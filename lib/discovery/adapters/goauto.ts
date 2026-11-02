/**
 * lib/discovery/adapters/goauto.ts
 *
 * Ingestion Adapter for GoAuto Typesense Public Inventory Feeds (e.g. Langley Toyota)
 * ToyotaWaits.ca Discovery Platform
 */

import { ConvertusRawVehicle } from './convertus';

export const LANGLEY_TYPESENSE_ENDPOINT =
  'https://typesense.goauto.io/collections/inventory/documents/search';
export const LANGLEY_TYPESENSE_API_KEY =
  'E69PdQxcDxFBTK0Rn76OVs8fr2Y8HbQA';
export const LANGLEY_CRAFT_SITE_ID = 20;

export interface GoAutoDocument {
  id: string;
  vin?: string | null;
  stock_number?: string | null;
  year?: number | string;
  make_name?: string;
  model_name?: string;
  trim?: string | null;
  body_type?: string | null;
  drive_type_name?: string | null;
  fuel_type_category?: string | null;
  fuel_type_name?: string | null;
  transmission_name?: string | null;
  exterior_colour_value?: string | null;
  interior_colour_name?: string | null;
  msrp?: number | string | null;
  list_price?: number | string | null;
  regular_price?: number | string | null;
  in_transit?: boolean | number | null;
  photo_service_ids?: string[];
  days_in_stock?: number | null;
  date_created?: number | null;
  [key: string]: unknown;
}

export function mapGoAutoDocToConvertusItem(doc: GoAutoDocument): ConvertusRawVehicle {
  const photoId = Array.isArray(doc.photo_service_ids) && doc.photo_service_ids.length > 0
    ? doc.photo_service_ids[0]
    : null;
  const image = photoId
    ? `https://res.cloudinary.com/goauto-images/image/upload/v1/${photoId}.jpg`
    : null;

  let model = doc.model_name || 'Unknown';
  if (model === 'bZ' || model === 'bZ Woodland') {
    model = 'bZ4X';
  }

  return {
    vehicle_id: doc.id,
    ad_id: doc.id,
    vin: doc.vin || null,
    stock_number: doc.stock_number || doc.id,
    year: doc.year,
    make: doc.make_name || 'Toyota',
    model,
    trim: doc.trim || null,
    body_style: doc.body_type || null,
    sale_class: 'New',
    drive_train: doc.drive_type_name || null,
    fuel_type: doc.fuel_type_category || doc.fuel_type_name || null,
    transmission: doc.transmission_name || null,
    exterior_color: doc.exterior_colour_value || null,
    interior_color: doc.interior_colour_name || null,
    msrp: doc.msrp ?? doc.list_price ?? null,
    asking_price: doc.list_price ?? doc.regular_price ?? doc.msrp ?? null,
    sale_price: doc.list_price ?? doc.regular_price ?? null,
    final_price: doc.list_price ?? doc.regular_price ?? null,
    in_transit: doc.in_transit ? 1 : 0,
    on_order: 0,
    vdp_url: `https://www.langleytoyota.com/vehicles/${doc.id}`,
    url: `https://www.langleytoyota.com/vehicles/${doc.id}`,
    listing_url: `https://www.langleytoyota.com/vehicles/${doc.id}`,
    image,
    days_on_lot: doc.days_in_stock ?? null,
  };
}

export async function fetchGoAutoInventory(
  siteId: number = LANGLEY_CRAFT_SITE_ID,
  options: {
    page?: number;
    limit?: number;
    stockType?: string;
    userAgent?: string;
  } = {}
): Promise<{ total: number; items: ConvertusRawVehicle[] }> {
  const {
    page = 1,
    limit = 100,
    stockType = 'NEW',
    userAgent = 'Mozilla/5.0 (compatible; ToyotaWaitsLocalAuditor/1.0; +https://toyotawaits.ca/source-register)',
  } = options;

  const url = `${LANGLEY_TYPESENSE_ENDPOINT}?q=*&filter_by=craft_site_ids:=[${siteId}]&&stock_type:=${stockType}&per_page=${limit}&page=${page}&x-typesense-api-key=${LANGLEY_TYPESENSE_API_KEY}`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': userAgent,
      Accept: 'application/json, text/plain, */*',
    },
  });

  if (!res.ok) {
    throw new Error(`GoAuto Typesense fetch failed: HTTP ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const total = data.found || 0;
  const hits = Array.isArray(data.hits) ? data.hits : [];
  const items = hits.map((h: { document: GoAutoDocument }) =>
    mapGoAutoDocToConvertusItem(h.document)
  );

  return { total, items };
}
