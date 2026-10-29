/**
 * lib/discovery/dealers.ts
 *
 * Core Registered Dealer Definitions, Convertus Scraping Adapters,
 * and Sweep Execution Service for ToyotaWaits.ca.
 */

import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { parseConvertusPayload } from './adapters/convertus';
import { ingestDealerListings } from './services/ingestion-service';
import {
  AlertDispatchVehicle,
  dispatchPendingAlerts,
  DispatchPendingAlertsSummary,
} from './services/lifecycle-service';
import { evaluateSweepStaleness } from './services/staleness-service';
import { NormalizedListingStatus } from './types';

export const USER_AGENT_AUDITOR =
  'Mozilla/5.0 (compatible; ToyotaWaitsLocalAuditor/1.0; +https://toyotawaits.ca/source-register)';
export const DEFAULT_TIMEOUT_MS = 8000;
export const MAX_RETRIES = 2;
export const INITIAL_BACKOFF_MS = 1000;
export const POLITE_DEALER_COOLDOWN_MS = Number(process.env.POLITE_DEALER_COOLDOWN_MS) || 4000;

export interface RegisteredDealerSource {
  dealerCode: string;
  aliases: string[];
  dealerName: string;
  sourceCode: string;
  platform: 'convertus' | string;
  baseUrl: string;
  endpointUrl: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  websiteUrl: string;
}

export const REGISTERED_DEALERS: RegisteredDealerSource[] = [
  {
    dealerCode: 'jptoyota-downtown',
    aliases: ['jp-toyota-downtown', 'jptoyota-downtown', 'jim-pattison-toyota-downtown'],
    dealerName: 'Jim Pattison Toyota Downtown',
    sourceCode: 'jp-toyota-downtown-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.jptoyota-downtown.com',
    endpointUrl:
      'https://www.jptoyota-downtown.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Fcp%3D1250%26ln%3Den%26sc%3Dnew%26pc%3D100',
    address: '1290 Burrard Street',
    city: 'Vancouver',
    province: 'BC',
    postalCode: 'V6Z 1Z1',
    phone: '(604) 687-6044',
    websiteUrl: 'https://www.jptoyota-downtown.com/',
  },
  {
    dealerCode: 'jptoyota-surrey',
    aliases: ['jp-toyota-surrey', 'jptoyota-surrey', 'jim-pattison-toyota-surrey'],
    dealerName: 'Jim Pattison Toyota Surrey',
    sourceCode: 'jp-toyota-surrey-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.jptoyota-surrey.com',
    endpointUrl:
      'https://www.jptoyota-surrey.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Fcp%3D1249%26ln%3Den%26sc%3Dnew%26pc%3D100',
    address: '15389 Guildford Drive',
    city: 'Surrey',
    province: 'BC',
    postalCode: 'V3R 0H9',
    phone: '(604) 495-4100',
    websiteUrl: 'https://www.jptoyota-surrey.com/',
  },
{
    dealerCode: 'destination-toyota-burnaby',
    aliases: ['destination-toyota-burnaby', 'destination-toyota', 'destination toyota'],
    dealerName: 'Destination Toyota Burnaby',
    sourceCode: 'destination-toyota-burnaby-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.destinationtoyota.ca',
    endpointUrl:
      'https://www.destinationtoyota.ca/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Fcp%3D1224%26ln%3Den%26pg%3D1%26pc%3D25%26dc%3Dfalse%26qs%3D%26im%3Dtrue%26in_transit%3Dtrue%26in_stock%3Dtrue%26on_order%3Dtrue%26mk%3Dtoyota&action=vms_data',
    address: '4451 Still Creek Drive',
    city: 'Burnaby',
    province: 'BC',
    postalCode: 'V5C 6G9',
    phone: '(604) 571-4399',
    websiteUrl: 'https://www.destinationtoyota.ca/',
  },
  {
    dealerCode: 'westcoast-toyota',
    aliases: ['west-coast-toyota', 'westcoast-toyota', 'westcoasttoyota'],
    dealerName: 'West Coast Toyota',
    sourceCode: 'westcoast-toyota-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.westcoasttoyota.com',
    endpointUrl:
      'https://www.westcoasttoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Fcp%3D1218%26ln%3Den%26sc%3Dnew%26pc%3D100',
    address: '19950 Lougheed Hwy',
    city: 'Pitt Meadows',
    province: 'BC',
    postalCode: 'V3Y 2S9',
    phone: '(604) 465-9146',
    websiteUrl: 'https://www.westcoasttoyota.com/',
  },
  {
    dealerCode: 'regency-toyota',
    aliases: ['regency-toyota', 'regency', 'regencytoyota'],
    dealerName: 'Regency Toyota',
    sourceCode: 'regency-toyota-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.regencytoyota.com',
    endpointUrl: 'https://www.regencytoyota.com/wp-json/convertus/v1/vehicles',
    address: '401 Kingsway',
    city: 'Vancouver',
    province: 'BC',
    postalCode: 'V5T 3K1',
    phone: '(604) 879-8411',
    websiteUrl: 'https://www.regencytoyota.com/',
  },
  {
    dealerCode: 'openroad-toyota-richmond',
    aliases: ['openroad-toyota-richmond', 'openroad-richmond', 'openroadtoyotarichmond'],
    dealerName: 'OpenRoad Toyota Richmond',
    sourceCode: 'openroad-toyota-richmond-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.openroadtoyotarichmond.com',
    endpointUrl: 'https://www.openroadtoyotarichmond.com/wp-json/convertus/v1/vehicles',
    address: '13251 Smallwood Place',
    city: 'Richmond',
    province: 'BC',
    postalCode: 'V6V 1W8',
    phone: '(604) 273-3766',
    websiteUrl: 'https://www.openroadtoyotarichmond.com/',
  },
  {
    dealerCode: 'openroad-toyota-port-moody',
    aliases: ['openroad-toyota-port-moody', 'openroad-port-moody', 'openroadtoyotaportmoody', 'port-moody'],
    dealerName: 'OpenRoad Toyota Port Moody',
    sourceCode: 'openroad-toyota-port-moody-convertus',
    platform: 'convertus',
    baseUrl: 'https://www.openroadtoyotaportmoody.com',
    // NOTE: As of 2026-10-29 this proxy returns HTTP 404 (site runs the eDealer platform, same as
    // OpenRoad Richmond). sweepSingleDealer() falls back to the public /sitemap.xml
    // (`/new/<year>-toyota-<slug>/<VIN>` entries), which parsePublicSitemapToConvertusItems handles.
    endpointUrl:
      'https://www.openroadtoyotaportmoody.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data',
    address: '3166 St Johns Street',
    city: 'Port Moody',
    province: 'BC',
    postalCode: 'V3H 2H7',
    phone: '(604) 461-3656',
    websiteUrl: 'https://www.openroadtoyotaportmoody.com/',
  },
];

export interface DealerSweepExecutionResult {
  dealerCode: string;
  dealerName: string;
  dealerId?: string;
  success: boolean;
  totalParsed: number;
  quarantinedCount: number;
  listingsCreated: number;
  listingsUpdated: number;
  observationsStored: number;
  durationMs: number;
  errorMessage?: string;
  skippedReason?: string;
  unreservedVehicles?: AlertDispatchVehicle[];
  alertSummary?: DispatchPendingAlertsSummary;
}

export type DealerSweepResult = DealerSweepExecutionResult;

/**
 * Builds a parameterized Convertus VMS proxy URL with explicit page limit and page index.
 */
export function buildConvertusPageUrl(rawUrl: string, page: number = 1, limit: number = 100): string {
  try {
    const urlObj = new URL(rawUrl);
    const endpointParam = urlObj.searchParams.get('endpoint');
    if (endpointParam) {
      const innerUrl = new URL(endpointParam);
      innerUrl.searchParams.set('pc', String(limit));
      innerUrl.searchParams.set('pg', String(page));
      urlObj.searchParams.set('endpoint', innerUrl.toString());
      return urlObj.toString();
    }
  } catch {
    // URL parsing fallback
  }

  let modified = rawUrl;
  if (!modified.includes('pc%3D') && !modified.includes('pc=')) {
    modified += (modified.includes('?') ? '&' : '?') + 'pc=' + limit;
  }
  if (!modified.includes('pg%3D') && !modified.includes('pg=')) {
    modified += '&pg=' + page;
  }
  return modified;
}

const TOYOTA_MODEL_PREFIXES: Array<[string, string, number, string]> = [
  ['grand-highlander-hybrid', 'Grand Highlander Hybrid', 58150, 'Hybrid'],
  ['grand-highlander', 'Grand Highlander', 54150, 'Gas'],
  ['highlander-hybrid', 'Highlander Hybrid', 53950, 'Hybrid'],
  ['highlander', 'Highlander', 50450, 'Gas'],
  ['rav4-plug-in-hybrid', 'RAV4 Plug-in Hybrid', 54590, 'Plug-in Hybrid'],
  ['rav4-prime', 'RAV4 Plug-in Hybrid', 54590, 'Plug-in Hybrid'],
  ['rav4-hybrid', 'RAV4 Hybrid', 39950, 'Hybrid'],
  ['rav4', 'RAV4', 36550, 'Gas'],
  ['prius-plug-in-hybrid', 'Prius Plug-in Hybrid', 43150, 'Plug-in Hybrid'],
  ['prius-prime', 'Prius Plug-in Hybrid', 43150, 'Plug-in Hybrid'],
  ['prius', 'Prius', 40650, 'Hybrid'],
  ['corolla-cross-hybrid', 'Corolla Cross Hybrid', 34990, 'Hybrid'],
  ['corolla-cross', 'Corolla Cross', 30590, 'Gas'],
  ['corolla-hatchback', 'Corolla Hatchback', 27850, 'Gas'],
  ['corolla-hybrid', 'Corolla Hybrid', 29590, 'Hybrid'],
  ['gr-corolla', 'GR Corolla', 49990, 'Gas'],
  ['corolla', 'Corolla', 26790, 'Gas'],
  ['camry-hybrid', 'Camry Hybrid', 37690, 'Hybrid'],
  ['camry', 'Camry Hybrid', 37690, 'Hybrid'],
  ['4runner-hybrid', '4Runner Hybrid', 63950, 'Hybrid'],
  ['4runner', '4Runner', 57450, 'Gas'],
  ['tacoma-hybrid', 'Tacoma Hybrid', 64950, 'Hybrid'],
  ['tacoma', 'Tacoma', 50450, 'Gas'],
  ['tundra-hybrid', 'Tundra Hybrid', 72950, 'Hybrid'],
  ['tundra', 'Tundra', 56450, 'Gas'],
  ['sienna', 'Sienna', 50490, 'Hybrid'],
  ['crown-signia', 'Crown Signia', 57450, 'Hybrid'],
  ['crown', 'Crown', 55590, 'Hybrid'],
  ['land-cruiser', 'Land Cruiser', 72950, 'Hybrid'],
  ['sequoia', 'Sequoia', 82950, 'Hybrid'],
  ['bz4x', 'bZ4X', 48950, 'Electric'],
  ['bz-woodland', 'bZ4X', 52950, 'Electric'],
  ['bz', 'bZ4X', 48950, 'Electric'],
  ['c-hr', 'C-HR', 38950, 'Hybrid'],
  ['gr86', 'GR86', 34950, 'Gas'],
  ['gr-supra', 'GR Supra', 69950, 'Gas'],
];

function formatTrimTokens(rawTrimSlug: string): string {
  if (!rawTrimSlug) return 'Base';
  const upperTokens = new Set(['se', 'xse', 'le', 'xle', 'sr', 'sr5', 'trd', 'awd', 'fwd', '4x4', 'max', 'ev']);
  return rawTrimSlug
    .split('-')
    .filter(Boolean)
    .map((tok) => {
      const lower = tok.toLowerCase();
      if (lower === 'ltd') return 'Limited';
      if (upperTokens.has(lower)) return lower.toUpperCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

export function parseToyotaSlugSpec(slug: string): {
  year: number;
  model: string;
  trim: string;
  msrp: number;
  fuelType: string;
} | null {
  const m = slug.toLowerCase().match(/^(202\d)-toyota-(.+)$/);
  if (!m) return null;
  const year = parseInt(m[1], 10);
  let rest = m[2];

  for (const [prefix, canonicalModel, baseMsrp, fuelType] of TOYOTA_MODEL_PREFIXES) {
    if (rest === prefix || rest.startsWith(prefix + '-')) {
      rest = rest.slice(prefix.length).replace(/^-+/, '');
      if (rest === prefix || rest.startsWith(prefix + '-')) {
        rest = rest.slice(prefix.length).replace(/^-+/, '');
      }
      let finalModel = canonicalModel;
      let finalFuel = fuelType;
      let finalMsrp = baseMsrp;
      if (rest.startsWith('hybrid-') && !finalModel.includes('Hybrid')) {
        finalModel = `${finalModel} Hybrid`;
        finalFuel = 'Hybrid';
        finalMsrp += 3500;
        rest = rest.slice('hybrid-'.length);
      }
      const trim = formatTrimTokens(rest);
      return { year, model: finalModel, trim, msrp: finalMsrp, fuelType: finalFuel };
    }
  }
  return null;
}

export function parsePublicSitemapToConvertusItems(xmlText: string): Array<Record<string, unknown>> {
  const items: Array<Record<string, unknown>> = [];
  const urlBlocks = [...xmlText.matchAll(/<url>([\s\S]*?)<\/url>/gi)].map((m) => m[1]);

  for (const block of urlBlocks) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/i)?.[1]?.trim();
    if (!loc) continue;
    const imgLoc = block.match(/<image:loc>([^<]+)<\/image:loc>/i)?.[1]?.trim() || null;

    const openRoadMatch = loc.match(/\/new\/([^/]+)\/([A-HJ-NPR-Z0-9]{17})\/?$/i);
    if (openRoadMatch) {
      const slug = openRoadMatch[1];
      const vin = openRoadMatch[2].toUpperCase();
      const spec = parseToyotaSlugSpec(slug);
      if (spec) {
        items.push({
          ad_id: `OR-${vin}`,
          vehicle_id: `OR-${vin}`,
          vin,
          stock_number: `OR-${vin.slice(-6)}`,
          year: spec.year,
          make: 'Toyota',
          model: spec.model,
          trim: spec.trim,
          fuel_type: spec.fuelType,
          sale_class: 'New',
          in_transit: 0,
          on_order: 0,
          msrp: spec.msrp,
          asking_price: spec.msrp,
          final_price: spec.msrp,
          vdp_url: loc,
          image: imgLoc,
        });
      }
      continue;
    }

    const regencyMatch = loc.match(/\/en\/new-catalog\/toyota\/([a-z0-9-]+)-id(\d+)\/?$/i);
    if (regencyMatch) {
      const slug = regencyMatch[1];
      const catalogId = regencyMatch[2];
      const spec = parseToyotaSlugSpec(slug);
      if (spec) {
        items.push({
          ad_id: `REG-${catalogId}`,
          vehicle_id: `REG-${catalogId}`,
          vin: null,
          stock_number: `REG-${catalogId}`,
          year: spec.year,
          make: 'Toyota',
          model: spec.model,
          trim: spec.trim,
          fuel_type: spec.fuelType,
          sale_class: 'New',
          in_transit: 0,
          on_order: 0,
          msrp: spec.msrp,
          asking_price: spec.msrp,
          final_price: spec.msrp,
          vdp_url: loc,
          image: imgLoc,
        });
      }
    }
  }

  return items;
}

export function resolveDealer(dealerArg: string): RegisteredDealerSource | null {
  const normalized = dealerArg.toLowerCase().trim();
  for (const dealer of REGISTERED_DEALERS) {
    if (dealer.dealerCode === normalized || dealer.aliases.includes(normalized)) {
      return dealer;
    }
  }
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function seedReferenceEntities(supabase: any, dealerConfig: RegisteredDealerSource) {
  let sourceId: string;
  const { data: existingSource } = await supabase
    .from('sources')
    .select('id')
    .eq('code', dealerConfig.sourceCode)
    .maybeSingle();

  if (existingSource) {
    sourceId = existingSource.id;
  } else {
    const { data: newSource, error: sourceErr } = await supabase
      .from('sources')
      .insert({
        code: dealerConfig.sourceCode,
        name: `${dealerConfig.dealerName} Feed`,
        platform: dealerConfig.platform,
        base_url: dealerConfig.baseUrl,
        endpoint_url: dealerConfig.endpointUrl,
        is_active: true,
      })
      .select('id')
      .single();

    if (sourceErr) throw new Error(`Failed to seed source: ${sourceErr.message}`);
    sourceId = newSource.id;
  }

  let dealerId: string;
  const { data: existingDealer } = await supabase
    .from('dealers')
    .select('id')
    .eq('dealer_code', dealerConfig.dealerCode)
    .maybeSingle();

  if (existingDealer) {
    dealerId = existingDealer.id;
  } else {
    const { data: newDealer, error: dealerErr } = await supabase
      .from('dealers')
      .insert({
        dealer_code: dealerConfig.dealerCode,
        name: dealerConfig.dealerName,
        brand: 'Toyota',
        address: dealerConfig.address,
        city: dealerConfig.city,
        province: dealerConfig.province,
        country: 'CA',
        postal_code: dealerConfig.postalCode,
        phone: dealerConfig.phone,
        website_url: dealerConfig.websiteUrl,
        source_id: sourceId,
      })
      .select('id')
      .single();

    if (dealerErr) throw new Error(`Failed to seed dealer: ${dealerErr.message}`);
    dealerId = newDealer.id;
  }

  return { sourceId, dealerId };
}

async function fetchWithRetry(url: string, timeoutMs: number = DEFAULT_TIMEOUT_MS) {
  let attempt = 0;
  let lastError: unknown = null;
  let httpStatus: number | null = null;

  while (attempt <= MAX_RETRIES) {
    attempt++;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': USER_AGENT_AUDITOR,
          Accept: 'application/json, text/plain, */*',
        },
        signal: controller.signal,
      });

      clearTimeout(timer);
      httpStatus = res.status;

      if (res.status === 429) {
        throw new Error('HTTP 429: Too Many Requests (Rate limited)');
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const body = await res.json();
      return { body, status: res.status, attempts: attempt };
    } catch (err: unknown) {
      clearTimeout(timer);
      lastError = err;
      const isTransient =
        (err as { name?: string })?.name === 'AbortError' ||
        (err as { message?: string })?.message?.includes('timeout') ||
        (err as { message?: string })?.message?.includes('fetch failed') ||
        (httpStatus != null && httpStatus >= 500);

      if (attempt <= MAX_RETRIES && isTransient) {
        const delay = INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
        await new Promise((r) => setTimeout(r, delay));
      } else {
        break;
      }
    }
  }

  const errMessage = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(`Fetch failed after ${attempt} attempts: ${errMessage}`);
}

export async function sweepSingleDealer(
  dealerConfig: RegisteredDealerSource,
  options: {
    dryRun: boolean;
    useFixture?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase?: any;
    isServiceKeyConfigured: boolean;
  }
): Promise<DealerSweepResult> {
  const { dryRun, useFixture = false, supabase, isServiceKeyConfigured } = options;
  const startTime = Date.now();
  const sweepTimestamp = new Date().toISOString();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rawPayload: any;

  try {
    if (useFixture) {
      const fixturePath = path.resolve(
        process.cwd(),
        'audit-artifacts',
        'dealer-discovery',
        'convertus-vms-sample.json'
      );
      rawPayload = JSON.parse(fs.readFileSync(fixturePath, 'utf-8'));
    } else {
      const initialUrl = buildConvertusPageUrl(dealerConfig.endpointUrl, 1, 100);
      let cachedSitemapItems: Array<Record<string, unknown>> | null = null;

      try {
        const fetchResult = await fetchWithRetry(initialUrl, DEFAULT_TIMEOUT_MS);
        rawPayload = fetchResult.body;
      } catch (primaryErr: unknown) {
        const pMsg = primaryErr instanceof Error ? primaryErr.message : String(primaryErr);
        if (pMsg.includes('429')) {
          throw primaryErr;
        }
        const sitemapUrl = `${dealerConfig.baseUrl.replace(/\/+$/, '')}/sitemap.xml`;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
        try {
          const res = await fetch(sitemapUrl, {
            headers: {
              'User-Agent': USER_AGENT_AUDITOR,
              Accept: 'application/xml, text/xml, */*',
            },
            signal: controller.signal,
          });
          clearTimeout(timer);
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }
          const xmlText = await res.text();
          cachedSitemapItems = parsePublicSitemapToConvertusItems(xmlText);
          rawPayload = {
            summary: { total_vehicles: cachedSitemapItems.length },
            results: cachedSitemapItems.slice(0, 100),
          };
        } catch {
          clearTimeout(timer);
          throw primaryErr;
        }
      }

      const totalVehicles = rawPayload?.summary?.total_vehicles;
      if (
        totalVehicles &&
        Array.isArray(rawPayload.results) &&
        rawPayload.results.length < totalVehicles
      ) {
        let currentPage = 2;
        const maxPages = 10;
        while (rawPayload.results.length < totalVehicles && currentPage <= maxPages) {
          await new Promise((r) => setTimeout(r, 1500));
          if (cachedSitemapItems) {
            const nextSlice = cachedSitemapItems.slice((currentPage - 1) * 100, currentPage * 100);
            if (nextSlice.length === 0) break;
            rawPayload.results.push(...nextSlice);
            currentPage++;
            continue;
          }
          const nextUrl = buildConvertusPageUrl(dealerConfig.endpointUrl, currentPage, 100);
          try {
            const nextResult = await fetchWithRetry(nextUrl, DEFAULT_TIMEOUT_MS);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const nextItems = nextResult.body?.results as any[];
            if (Array.isArray(nextItems) && nextItems.length > 0) {
              const existingIds = new Set(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                rawPayload.results.map((x: any) => x.ad_id || x.vehicle_id || x.vin || x.stock_number)
              );
              const newItems = nextItems.filter(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (x: any) => !existingIds.has(x.ad_id || x.vehicle_id || x.vin || x.stock_number)
              );
              if (newItems.length === 0) break;
              rawPayload.results.push(...newItems);
            } else {
              break;
            }
          } catch {
            break;
          }
          currentPage++;
        }
      }
    }

    const parseResult = parseConvertusPayload(rawPayload, {
      dealerBaseUrl: dealerConfig.baseUrl,
      dealerCity: dealerConfig.city,
      dealerProvince: dealerConfig.province,
    });

    const unreservedVehicles: AlertDispatchVehicle[] = parseResult.records
      .filter((rec) => rec.listing.normalizedStatus !== NormalizedListingStatus.RESERVED_SOLD)
      .map((rec) => ({
        vin: rec.vehicle.vin,
        provisionalId: rec.vehicle.provisionalId || rec.listing.sourceListingId,
        model: rec.vehicle.model,
        trim: rec.vehicle.trim,
        powertrain: rec.vehicle.powertrain,
        modelYear: rec.vehicle.modelYear,
        dealerName: dealerConfig.dealerName,
        dealerCity: dealerConfig.city,
        vdpUrl: rec.listing.vdpUrl,
        sellingPrice: rec.pricing.sellingPrice ?? rec.pricing.askingPrice ?? rec.pricing.msrp,
        msrp: rec.pricing.msrp,
      }));

    if (!parseResult.success || parseResult.records.length === 0) {
      return {
        dealerCode: dealerConfig.dealerCode,
        dealerName: dealerConfig.dealerName,
        success: false,
        totalParsed: 0,
        quarantinedCount: parseResult.quarantined.length,
        listingsCreated: 0,
        listingsUpdated: 0,
        observationsStored: 0,
        durationMs: Date.now() - startTime,
        errorMessage: 'Zero valid vehicles found in feed',
        unreservedVehicles: [],
      };
    }

    if (!isServiceKeyConfigured || dryRun) {
      return {
        dealerCode: dealerConfig.dealerCode,
        dealerName: dealerConfig.dealerName,
        success: true,
        totalParsed: parseResult.count,
        quarantinedCount: parseResult.quarantined.length,
        listingsCreated: 0,
        listingsUpdated: 0,
        observationsStored: 0,
        durationMs: Date.now() - startTime,
        skippedReason: !isServiceKeyConfigured
          ? 'SUPABASE_SERVICE_ROLE_KEY not configured'
          : 'Dry run requested',
        unreservedVehicles,
      };
    }

    const { sourceId, dealerId } = await seedReferenceEntities(supabase, dealerConfig);

    const ingestSummary = await ingestDealerListings({
      dealerId,
      sourceId,
      parsedListings: parseResult.records,
      sweepTimestamp,
      supabaseClient: supabase,
    });

    let alertSummary: DispatchPendingAlertsSummary | undefined;
    if (unreservedVehicles.length > 0) {
      alertSummary = await dispatchPendingAlerts(unreservedVehicles, {
        supabaseClient: supabase,
      });
    }

    const activeIds = parseResult.records.map((r) => r.listing.sourceListingId);
    await evaluateSweepStaleness({
      dealerId,
      activeSourceListingIdsInSweep: activeIds,
      sweepTimestamp,
      supabaseClient: supabase,
    });

    try {
      await supabase.from('source_health_logs').insert({
        id: crypto.randomUUID(),
        source_id: sourceId,
        dealer_id: dealerId,
        check_timestamp: sweepTimestamp,
        status: parseResult.quarantined.length > 0 ? 'degraded' : 'success',
        http_status: 200,
        latency_ms: Date.now() - startTime,
        items_observed: parseResult.count,
        quarantined_items: parseResult.quarantined.length,
        error_message: null,
        created_at: sweepTimestamp,
      });
    } catch {
      // Telemetry error does not abort sweep
    }

    return {
      dealerCode: dealerConfig.dealerCode,
      dealerName: dealerConfig.dealerName,
      dealerId,
      success: true,
      totalParsed: parseResult.count,
      quarantinedCount: parseResult.quarantined.length,
      listingsCreated: ingestSummary.listingsCreated,
      listingsUpdated: ingestSummary.listingsUpdated,
      observationsStored: ingestSummary.observationsStored,
      durationMs: Date.now() - startTime,
      unreservedVehicles,
      alertSummary,
    };
  } catch (err: unknown) {
    const errMessage = err instanceof Error ? err.message : String(err);
    return {
      dealerCode: dealerConfig.dealerCode,
      dealerName: dealerConfig.dealerName,
      success: false,
      totalParsed: 0,
      quarantinedCount: 0,
      listingsCreated: 0,
      listingsUpdated: 0,
      observationsStored: 0,
      durationMs: Date.now() - startTime,
      errorMessage: errMessage,
      unreservedVehicles: [],
    };
  }
}
