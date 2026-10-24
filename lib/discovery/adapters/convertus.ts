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
  created_at?: string | null;
  created?: string | null;
  date?: string | null;
  inventory_date?: string | null;
  vdp_url?: string | null;
  breakdown?: Array<{
    type?: string;
    amount?: number | string;
    title?: string;
    pre_tax?: boolean;
  }> | null;
  images?: any;
  image?: any;
  photos?: any;
  photo?: any;
  thumbnail?: any;
  media_urls?: any;
  placeholder_image?: boolean;
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

export interface ConvertusAdapterOptions {
  dealerBaseUrl?: string;
  dealerCity?: string;
  dealerProvince?: string;
  searchPath?: string;
}

/**
 * Normalizes dealer base URL by ensuring https protocol, trimming trailing slashes,
 * and correcting known domain typos (e.g. missing hyphen on jptoyota-downtown).
 */
export function normalizeDealerBaseUrl(rawUrl?: string | null): string {
  let url = String(rawUrl || 'https://www.jptoyota-downtown.com').trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  url = url.replace(/^http:\/\//i, 'https://');
  url = url.replace(/\/+$/, '');
  if (url.includes('jptoyotadowntown.com')) {
    url = url.replace('jptoyotadowntown.com', 'jptoyota-downtown.com');
  }
  if (url.includes('jptoyotasurrey.com')) {
    url = url.replace('jptoyotasurrey.com', 'jptoyota-surrey.com');
  }
  return url;
}

/**
 * Resolves or constructs the canonical VDP (or verified inventory search fallback) URL
 * from a Convertus vehicle item.
 *
 * 1. Checks raw link fields (vdp_url, canonical_url, dealer_url, url, link).
 * 2. If relative path (e.g. /vehicles/2026/toyota/...), prepends dealer base domain.
 * 3. If payload lacks a direct VDP link, constructs canonical URL via Convertus standard VDP routing:
 *    ${dealerBaseUrl}/vehicles/${year}/${make}/${model}/${city}/${province}/${vmsId}/?sale_class=${saleClass}
 * 4. Fallback Handling: If direct VDP cannot be verified or lacks internal VMS ID,
 *    falls back cleanly to dealer's public new inventory search page:
 *    ${dealerBaseUrl}/vehicles/new/?keyword=${vin || stockNumber}
 */
export function constructConvertusVdpUrl(
  raw: ConvertusRawVehicle,
  options?: ConvertusAdapterOptions
): string {
  const dealerBaseUrl = normalizeDealerBaseUrl(
    options?.dealerBaseUrl ||
    raw.company_data?.company_web_address ||
    raw.dealer_base_url ||
    raw.company_web_address
  );

  // 1. Check raw link fields
  const candidateLink =
    raw.vdp_url ||
    raw.canonical_url ||
    raw.dealer_url ||
    raw.url ||
    raw.link;

  if (candidateLink && typeof candidateLink === 'string') {
    let link = candidateLink.trim();
    if (link) {
      if (link.includes('jptoyotadowntown.com')) {
        link = link.replace('jptoyotadowntown.com', 'jptoyota-downtown.com');
      }
      if (link.includes('jptoyotasurrey.com')) {
        link = link.replace('jptoyotasurrey.com', 'jptoyota-surrey.com');
      }

      // If relative path (e.g. /vehicles/2026/toyota/...), prepend dealer base domain
      if (link.startsWith('/')) {
        return `${dealerBaseUrl}${link}`;
      }

      // If already absolute URL
      if (link.startsWith('http://') || link.startsWith('https://')) {
        // If it was pointed to dead /new-vehicles/ path without keyword, redirect to search fallback
        if (link.endsWith('/new-vehicles/') || link.endsWith('/new-vehicles')) {
          const kw = raw.vin || raw.stock_number;
          return kw
            ? `${dealerBaseUrl}/vehicles/new/?keyword=${encodeURIComponent(String(kw).trim())}`
            : `${dealerBaseUrl}/vehicles/new/`;
        }
        return link;
      }

      return `${dealerBaseUrl}/${link.replace(/^\/+/, '')}`;
    }
  }

  // 2. Construct canonical URL using Convertus standard VDP routing if VMS ID exists
  const year = raw.year || new Date().getFullYear();
  const make = raw.make || 'Toyota';
  const model = raw.model;
  const city = raw.company_data?.company_city || options?.dealerCity || 'Vancouver';
  const province = raw.company_data?.company_province || options?.dealerProvince || 'BC';
  const vmsId = raw.ad_id || raw.vehicle_id || raw.vms_id || raw.as24_vehicle_id;
  const saleClass = raw.sale_class || 'New';

  if (vmsId && model) {
    const encYear = encodeURIComponent(String(year).trim());
    const encMake = encodeURIComponent(String(make).trim());
    const encModel = encodeURIComponent(String(model).trim());
    const encCity = encodeURIComponent(String(city).trim());
    const encProvince = encodeURIComponent(String(province).trim());
    const encVmsId = encodeURIComponent(String(vmsId).trim());
    const encSaleClass = encodeURIComponent(String(saleClass).trim());

    return `${dealerBaseUrl}/vehicles/${encYear}/${encMake}/${encModel}/${encCity}/${encProvince}/${encVmsId}/?sale_class=${encSaleClass}`;
  }

  // 3. Fallback Handling:
  // If direct vehicle detail page cannot be verified or is missing internal VMS ID,
  // fall back cleanly to dealer's public new inventory search page
  const keyword = raw.vin || raw.stock_number;
  if (keyword) {
    const encKw = encodeURIComponent(String(keyword).trim());
    return `${dealerBaseUrl}/vehicles/new/?keyword=${encKw}`;
  }

  return `${dealerBaseUrl}/vehicles/new/`;
}

/**
 * Known placeholder image patterns used by dealer inventory feeds.
 */
export const PLACEHOLDER_IMAGE_PATTERNS = [
  /no[-_]photo/i,
  /coming[-_]soon/i,
  /placeholder/i,
  /image[-_]not[-_]available/i,
  /photo[-_]coming[-_]soon/i,
  /vehicle[-_]coming[-_]soon/i,
  /stock[-_]photo/i,
  /default[-_]car/i,
  /not[-_]available/i,
];

/**
 * Validates if an image URL matches known dealer placeholder patterns.
 */
export function isPlaceholderImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return true;
  const clean = url.trim();
  if (!clean) return true;
  return PLACEHOLDER_IMAGE_PATTERNS.some((pattern) => pattern.test(clean));
}

/**
 * Extracts and sanitizes the primary vehicle lot image from Convertus raw vehicle data.
 * Checks raw.images, raw.image, raw.photos, raw.photo, raw.thumbnail, and raw.media_urls.
 * Resolves relative URLs with dealer base domain.
 * Returns sanitized https:// URL or null, and sets hasRealPhoto=true only when non-placeholder.
 */
export function extractPrimaryImage(
  item: any,
  options?: ConvertusAdapterOptions
): {
  imageUrl: string | null;
  hasRealPhoto: boolean;
  imageSource: string;
} {
  if (!item || typeof item !== 'object') {
    return { imageUrl: null, hasRealPhoto: false, imageSource: 'placeholder' };
  }

  // Convertus explicit placeholder flag
  if (
    item.placeholder_image === true ||
    item.is_placeholder === true ||
    item.has_placeholder === true
  ) {
    return { imageUrl: null, hasRealPhoto: false, imageSource: 'placeholder' };
  }

  // Helper to extract a clean string URL from a candidate value (string or object)
  const extractUrlFromCandidate = (val: any): string | null => {
    if (!val) return null;
    if (typeof val === 'string') {
      const s = val.trim();
      return s.length > 0 ? s : null;
    }
    if (typeof val === 'object') {
      const u =
        val.url ||
        val.src ||
        val.image_lg ||
        val.large ||
        val.original ||
        val.image_original ||
        val.image_md ||
        val.thumbnail ||
        val.small;
      if (typeof u === 'string') {
        const s = u.trim();
        return s.length > 0 ? s : null;
      }
    }
    return null;
  };

  let candidateUrl: string | null = null;

  // 1. Check direct string fields
  if (typeof item.image === 'string' && item.image.trim()) {
    candidateUrl = item.image.trim();
  } else if (typeof item.image_url === 'string' && item.image_url.trim()) {
    candidateUrl = item.image_url.trim();
  } else if (typeof item.thumbnail === 'string' && item.thumbnail.trim()) {
    candidateUrl = item.thumbnail.trim();
  }

  // 2. Check array of strings or objects: images, photos, media_urls, pictures
  if (!candidateUrl) {
    const list = item.images || item.photos || item.media_urls || item.pictures;
    if (Array.isArray(list) && list.length > 0) {
      for (const entry of list) {
        const u = extractUrlFromCandidate(entry);
        if (u) {
          candidateUrl = u;
          break;
        }
      }
    }
  }

  // 3. Fall back to nested object fields: item.image, item.photo, item.thumbnail
  if (!candidateUrl) {
    candidateUrl =
      extractUrlFromCandidate(item.image) ||
      extractUrlFromCandidate(item.photo) ||
      extractUrlFromCandidate(item.thumbnail);
  }

  if (candidateUrl) {
    // Protocol normalization and relative domain resolution
    if (candidateUrl.startsWith('//')) {
      candidateUrl = `https:${candidateUrl}`;
    } else if (candidateUrl.startsWith('/')) {
      const base = normalizeDealerBaseUrl(
        options?.dealerBaseUrl || item.company_data?.company_web_address
      );
      candidateUrl = `${base}${candidateUrl}`;
    } else if (candidateUrl.startsWith('http://')) {
      candidateUrl = candidateUrl.replace(/^http:\/\//i, 'https://');
    } else if (!candidateUrl.startsWith('https://') && candidateUrl.includes('.')) {
      candidateUrl = `https://${candidateUrl}`;
    }

    if (candidateUrl.startsWith('https://') && !isPlaceholderImageUrl(candidateUrl)) {
      return {
        imageUrl: candidateUrl,
        hasRealPhoto: true,
        imageSource: 'feed',
      };
    }
  }

  return {
    imageUrl: null,
    hasRealPhoto: false,
    imageSource: 'placeholder',
  };
}

/**
 * Parses and validates a single Convertus raw vehicle record.
 * Quarantines if missing mandatory structural attributes (make or model).
 */
export function parseConvertusRecord(
  raw: any,
  index: number,
  options?: ConvertusAdapterOptions
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
  const vdpUrl = constructConvertusVdpUrl(raw, options);
  const imageInfo = extractPrimaryImage(raw, options);
  const daysOnLot =
    raw.days_on_lot !== undefined && raw.days_on_lot !== null
      ? parseInt(String(raw.days_on_lot), 10)
      : null;

  // Extract original dealer posting/creation date from incoming vehicle payload
  const candidatePostedDate =
    raw.created_at ||
    raw.created ||
    raw.date ||
    raw.inventory_date ||
    null;

  let postedAt: string | null = null;
  if (candidatePostedDate) {
    const parsedDate = new Date(candidatePostedDate);
    if (!isNaN(parsedDate.getTime())) {
      postedAt = parsedDate.toISOString();
    } else if (typeof candidatePostedDate === 'string' && candidatePostedDate.trim()) {
      postedAt = candidatePostedDate.trim();
    }
  }

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
      imageUrl: imageInfo.imageUrl,
      hasRealPhoto: imageInfo.hasRealPhoto,
      imageSource: imageInfo.imageSource,
      rawStatus,
      normalizedStatus,
      daysOnLot: isNaN(daysOnLot as any) ? null : daysOnLot,
      postedAt,
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
export function parseConvertusPayload(
  input: any,
  options?: ConvertusAdapterOptions
): AdapterParseResult {
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
    const { record, quarantine } = parseConvertusRecord(item, i, options);
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
