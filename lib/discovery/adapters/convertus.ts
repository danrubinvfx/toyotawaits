/**
 * lib/discovery/adapters/convertus.ts
 *
 * Ingestion Adapter for Convertus VMS Public Inventory Feeds
 * ToyotaWaits.ca Master Plan V3.2 - Sprint 2
 *
 * Compliance Constraints:
 * 1. Strict 17-character VIN validation: regex ^[A-HJ-NPR-Z0-9]{17}$. Never synthesize VINs.
 * 2. Status normalization preserving epistemic honesty:
 *    - in_transit = 1 -> 'Incoming availability unconfirmed'
 *    - in_transit = 0 -> 'Advertised - availability unconfirmed'
 *    - stated sold/reserved flags -> 'Reserved / sold'
 * 3. Separate MSRP, advertised selling price, and mandatory fees; do not assume markup-free if fee items are unverified.
 * 4. Safe fallbacks for missing/partial fields and quarantine malformed records without throwing.
 */

import {
  AdapterParseResult,
  isValid17CharVin,
  NormalizedListingStatus,
  ParsedVehicleListing,
  QuarantinedRecord,
} from '../types';

/**
 * Raw Convertus VMS vehicle item structure from API payload.
 */
export interface ConvertusRawVehicle {
  vehicle_id?: number | string;
  as24_vehicle_id?: string;
  ad_id?: string | number;
  vin?: string | null;
  stock_number?: string | null;
  year?: number | string;
  make?: string;
  model?: string;
  trim?: string | null;
  search_trim?: string | null;
  model_code?: string | null;
  package_code?: string | null;
  body_style?: string | null;
  sale_class?: string | null;
  drive_train?: string | null;
  engine?: string | null;
  fuel_type?: string | null;
  transmission?: string | null;
  exterior_color?: string | null;
  manu_exterior_color?: string | null;
  interior_color?: string | null;
  msrp?: number | string | null;
  asking_price?: number | string | null;
  sale_price?: number | string | null;
  internet_price?: number | string | null;
  initial_price?: number | string | null;
  final_price?: number | string | null;
  in_transit?: number | boolean | string | null;
  on_order?: number | boolean | string | null;
  days_on_lot?: number | string | null;
  vdp_url?: string | null;
  breakdown?: Array<{
    type?: string;
    amount?: number | string;
    title?: string;
    pre_tax?: boolean;
  }> | null;
  [key: string]: any;
}

/**
 * Safely parses a numeric dollar amount, returning null if invalid or negative.
 */
export function parseNumericPrice(val: any): number | null {
  if (val === null || val === undefined || val === '') return null;
  if (typeof val === 'number') {
    return isNaN(val) || val <= 0 ? null : val;
  }
  const clean = String(val).replace(/[^0-9.-]+/g, '');
  const parsed = parseFloat(clean);
  return isNaN(parsed) || parsed <= 0 ? null : parsed;
}

/**
 * Normalizes raw price to a trimmed string representation.
 */
export function formatRawPrice(val: any): string | null {
  if (val === null || val === undefined || val === '') return null;
  return String(val).trim();
}

/**
 * Normalizes Convertus vehicle status according to Master Plan V3.2 Page 3 rules.
 */
export function normalizeConvertusStatus(raw: ConvertusRawVehicle): {
  normalized: NormalizedListingStatus;
  rawStatusDescription: string;
} {
  const saleClass = String(raw.sale_class || '').trim();
  const saleClassLower = saleClass.toLowerCase();

  const isSoldOrReserved =
    saleClassLower.includes('sold') ||
    saleClassLower.includes('reserve') ||
    saleClassLower.includes('pending') ||
    raw.is_sold === 1 ||
    raw.is_sold === true ||
    raw.reserved === 1 ||
    raw.reserved === true;

  const isInTransit =
    raw.in_transit === 1 ||
    raw.in_transit === true ||
    String(raw.in_transit).toLowerCase() === 'true' ||
    String(raw.in_transit) === '1' ||
    raw.on_order === 1 ||
    raw.on_order === true ||
    String(raw.on_order).toLowerCase() === 'true' ||
    String(raw.on_order) === '1';

  let normalized: NormalizedListingStatus;
  if (isSoldOrReserved) {
    normalized = NormalizedListingStatus.RESERVED_SOLD;
  } else if (isInTransit) {
    normalized = NormalizedListingStatus.INCOMING_UNCONFIRMED;
  } else {
    normalized = NormalizedListingStatus.ADVERTISED_UNCONFIRMED;
  }

  const rawStatusDescription = `sale_class: ${saleClass || 'Unknown'}, in_transit: ${raw.in_transit ?? 0}, on_order: ${raw.on_order ?? 0}`;
  return { normalized, rawStatusDescription };
}

/**
 * Parses and validates a single Convertus raw vehicle record.
 * Quarantines if missing mandatory structural attributes (make or model).
 */
export function parseConvertusRecord(
  raw: any,
  index: number
): { record?: ParsedVehicleListing; quarantine?: QuarantinedRecord } {
  const timestamp = new Date().toISOString();

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {
      quarantine: {
        record: raw,
        reason: `Item at index ${index} is not a valid vehicle object`,
        timestamp,
      },
    };
  }

  const make = String(raw.make || '').trim();
  const model = String(raw.model || '').trim();

  if (!make || !model) {
    return {
      quarantine: {
        record: raw,
        reason: `Missing mandatory vehicle definition (make='${make}', model='${model}') at index ${index}`,
        timestamp,
      },
    };
  }

  // Model year fallback
  let modelYear = parseInt(String(raw.year || ''), 10);
  if (isNaN(modelYear) || modelYear < 1980 || modelYear > 2050) {
    modelYear = new Date().getFullYear();
  }

  // 17-Character VIN vs Provisional Handling
  const candidateVin = raw.vin ? String(raw.vin).trim() : '';
  const is17Char = isValid17CharVin(candidateVin);

  let vin: string | null = null;
  let provisionalId: string | null = null;
  let isProvisionalVin = false;

  if (is17Char) {
    vin = candidateVin.toUpperCase();
    isProvisionalVin = false;
  } else {
    vin = null;
    isProvisionalVin = true;
    // Derive provisional ID from available identifiers (candidate VIN, stock number, or vehicle ID)
    provisionalId =
      candidateVin ||
      (raw.stock_number ? String(raw.stock_number).trim() : null) ||
      (raw.ad_id ? `PROV-AD-${raw.ad_id}` : null) ||
      (raw.vehicle_id ? `PROV-VID-${raw.vehicle_id}` : `PROV-IDX-${index}`);
  }

  // Status Normalization
  const { normalized: normalizedStatus, rawStatusDescription: rawStatus } =
    normalizeConvertusStatus(raw);

  // Financial Attributes Parsing
  const msrp = parseNumericPrice(raw.msrp);
  const rawMsrp = formatRawPrice(raw.msrp);

  const askingPrice = parseNumericPrice(raw.asking_price ?? raw.internet_price);
  const rawAskingPrice = formatRawPrice(raw.asking_price ?? raw.internet_price);

  const sellingPrice = parseNumericPrice(raw.sale_price ?? raw.final_price);
  const rawSellingPrice = formatRawPrice(raw.sale_price ?? raw.final_price);

  // Mandatory fees inspection
  let mandatoryFees: number | null = null;
  let hasUnverifiedFees = true; // Conservative default per Master Plan: do not assume markup-free if fee items unverified

  if (Array.isArray(raw.breakdown) && raw.breakdown.length > 0) {
    let feeSum = 0;
    let foundExplicitFees = false;
    for (const b of raw.breakdown) {
      if (b && (b.type === 'fee' || b.type === 'mandatory_fee' || b.type === 'freight_pdi')) {
        const feeVal = parseNumericPrice(b.amount);
        if (feeVal !== null) {
          feeSum += feeVal;
          foundExplicitFees = true;
        }
      }
    }
    if (foundExplicitFees) {
      mandatoryFees = feeSum;
      hasUnverifiedFees = false;
    }
  }

  // Listing identity
  const sourceListingId = String(
    raw.ad_id || raw.vehicle_id || raw.as24_vehicle_id || provisionalId || `LST-${index}`
  ).trim();

  const stockNumber = raw.stock_number ? String(raw.stock_number).trim() : null;
  const vdpUrl = raw.vdp_url ? String(raw.vdp_url).trim() : null;
  const daysOnLot =
    raw.days_on_lot !== undefined && raw.days_on_lot !== null
      ? parseInt(String(raw.days_on_lot), 10)
      : null;

  const parsed: ParsedVehicleListing = {
    vehicle: {
      vin,
      provisionalId,
      isProvisionalVin,
      make,
      model,
      trim: raw.trim ? String(raw.trim).trim() : (raw.search_trim ? String(raw.search_trim).trim() : null),
      modelYear,
      modelCode: raw.model_code ? String(raw.model_code).trim() : null,
      packageCode: raw.package_code ? String(raw.package_code).trim() : null,
      bodyStyle: raw.body_style ? String(raw.body_style).trim() : null,
      powertrain: raw.fuel_type ? String(raw.fuel_type).trim() : null,
      transmission: raw.transmission ? String(raw.transmission).trim() : null,
      driveTrain: raw.drive_train ? String(raw.drive_train).trim() : null,
      exteriorColor: raw.manu_exterior_color
        ? String(raw.manu_exterior_color).trim()
        : (raw.exterior_color ? String(raw.exterior_color).trim() : null),
      interiorColor: raw.interior_color ? String(raw.interior_color).trim() : null,
    },
    listing: {
      sourceListingId,
      stockNumber,
      vdpUrl,
      rawStatus,
      normalizedStatus,
      daysOnLot: isNaN(daysOnLot as any) ? null : daysOnLot,
    },
    pricing: {
      msrp,
      rawMsrp,
      askingPrice,
      rawAskingPrice,
      sellingPrice,
      rawSellingPrice,
      mandatoryFees,
      hasUnverifiedFees,
    },
    raw,
  };

  return { record: parsed };
}

/**
 * Main Convertus Ingestion Adapter function.
 * Accepts raw JSON string or parsed object from Convertus VMS endpoint.
 * Returns an AdapterParseResult with normalized records and quarantined items.
 */
export function parseConvertusPayload(input: any): AdapterParseResult {
  let data: any = input;

  if (typeof input === 'string') {
    try {
      data = JSON.parse(input);
    } catch (err: any) {
      return {
        success: false,
        count: 0,
        totalInPayload: 0,
        records: [],
        quarantined: [],
        error: `JSON parse failure: ${err?.message || String(err)}`,
      };
    }
  }

  if (!data || typeof data !== 'object') {
    return {
      success: false,
      count: 0,
      totalInPayload: 0,
      records: [],
      quarantined: [],
      error: 'Invalid payload structure: expected JSON object or array',
    };
  }

  // Extract results array
  let rawItems: any[] = [];
  if (Array.isArray(data)) {
    rawItems = data;
  } else if (Array.isArray(data.results)) {
    rawItems = data.results;
  } else if (Array.isArray(data.vehicles)) {
    rawItems = data.vehicles;
  } else if (Array.isArray(data.data)) {
    rawItems = data.data;
  } else {
    return {
      success: false,
      count: 0,
      totalInPayload: 0,
      records: [],
      quarantined: [],
      error: "Payload missing vehicle results array (checked 'results', 'vehicles', 'data')",
    };
  }

  const records: ParsedVehicleListing[] = [];
  const quarantined: QuarantinedRecord[] = [];

  for (let i = 0; i < rawItems.length; i++) {
    const item = rawItems[i];
    const { record, quarantine } = parseConvertusRecord(item, i);
    if (record) {
      records.push(record);
    }
    if (quarantine) {
      quarantined.push(quarantine);
    }
  }

  return {
    success: true,
    count: records.length,
    totalInPayload: rawItems.length,
    records,
    quarantined,
  };
}

export const parseConvertusVmsPayload = parseConvertusPayload;
