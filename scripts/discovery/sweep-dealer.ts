/**
 * scripts/discovery/sweep-dealer.ts
 *
 * Automated Polite Inventory Sweep CLI Runner for ToyotaWaits.ca
 * Phase 3 Production Sweep Runner
 *
 * Usage:
 *   npx tsx scripts/discovery/sweep-dealer.ts --dealer=jptoyota-downtown
 *   npm run sweep:dealer -- --dealer=jptoyota-downtown
 *   npm run sweep:dealer -- --help
 */

import * as fs from 'fs';
import * as path from 'path';
import { parseConvertusPayload } from '../../lib/discovery/adapters/convertus';
import { ingestDealerListings } from '../../lib/discovery/services/ingestion-service';
import { evaluateSweepStaleness } from '../../lib/discovery/services/staleness-service';
import { createServerClient, isLiveSupabaseConfigured } from '../../src/lib/supabase/server';

// Polite operating safeguards per Master Plan V3.2
export const USER_AGENT_AUDITOR =
  'Mozilla/5.0 (compatible; ToyotaWaitsLocalAuditor/1.0; +https://toyotawaits.ca/source-register)';
export const DEFAULT_TIMEOUT_MS = 6000;
export const MAX_RETRIES = 2;
export const INITIAL_BACKOFF_MS = 1000;

// Registered dealer configurations
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
];

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

// Automatically load environment files if present
function loadEnv() {
  const envFiles = ['.env.production', '.env.local', '.env'];
  for (const f of envFiles) {
    const full = path.resolve(process.cwd(), f);
    if (fs.existsSync(full)) {
      try {
        const text = fs.readFileSync(full, 'utf-8');
        for (const line of text.split(/\r?\n/)) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const idx = trimmed.indexOf('=');
          if (idx !== -1) {
            const k = trimmed.slice(0, idx).trim();
            let v = trimmed.slice(idx + 1).trim();
            if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
              v = v.slice(1, -1);
            }
            if (f === '.env.production' || !process.env[k] || process.env[k]?.includes('mock-')) {
              process.env[k] = v;
            }
          }
        }
      } catch {
        // ignore read errors
      }
    }
  }
}

function printHelp() {
  console.log(`
ToyotaWaits.ca Dealer Inventory Sweep Runner
============================================
Automated polite sweep runner for Canadian Toyota dealer public inventory.

Usage:
  npx tsx scripts/discovery/sweep-dealer.ts [options]
  npm run sweep:dealer -- [options]

Options:
  --dealer=<code|alias>  Specify target dealer (default: jptoyota-downtown)
                         Supported: jptoyota-downtown, jp-toyota-downtown
  --dry-run              Execute sweep, parse and validate without persisting to Supabase
  --fixture              Use local offline fixture instead of fetching live endpoint
  --help, -h             Show this help screen and exit

Operating Safeguards:
  - User-Agent disclosure: ${USER_AGENT_AUDITOR}
  - Request timeout: ${DEFAULT_TIMEOUT_MS}ms
  - Retries: Up to ${MAX_RETRIES} attempts with exponential backoff on transient errors
  - Circuit Breaker: Immediate exit on HTTP 429 rate-limiting
  - Staleness Protection: Enforces 2-sweep confirmation before marking vehicles stale
`);
}

function resolveDealer(dealerArg: string): RegisteredDealerSource | null {
  const normalized = dealerArg.toLowerCase().trim();
  for (const dealer of REGISTERED_DEALERS) {
    if (dealer.dealerCode === normalized || dealer.aliases.includes(normalized)) {
      return dealer;
    }
  }
  return null;
}

async function seedReferenceEntities(supabase: any, dealerConfig: RegisteredDealerSource) {
  // 1. Ensure Ingestion Source exists
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

  // 2. Ensure Dealer exists
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
  let lastError: any = null;
  let httpStatus: number | null = null;

  while (attempt <= MAX_RETRIES) {
    attempt++;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      console.log(`[HTTP] Fetching ${url} (Attempt ${attempt}/${MAX_RETRIES + 1})...`);
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
        console.error(`[CIRCUIT BREAKER] HTTP 429 Rate Limited. Aborting sweep immediately.`);
        process.exit(1);
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const body = await res.json();
      return { body, status: res.status, attempts: attempt };
    } catch (err: any) {
      clearTimeout(timer);
      lastError = err;
      const isTransient =
        err.name === 'AbortError' ||
        err.message?.includes('timeout') ||
        err.message?.includes('fetch failed') ||
        (httpStatus != null && httpStatus >= 500);

      if (attempt <= MAX_RETRIES && isTransient) {
        const delay = INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
        console.warn(`[RETRY] Transient failure (${err.message}). Retrying in ${delay}ms...`);
        await new Promise((r) => setTimeout(r, delay));
      } else {
        break;
      }
    }
  }

  throw new Error(`Sweep failed after ${attempt} attempts: ${lastError?.message || 'Unknown error'}`);
}

async function main() {
  loadEnv();

  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    return;
  }

  const dryRun = args.includes('--dry-run');
  const useFixture = args.includes('--fixture');

  let dealerArg = 'jptoyota-downtown';
  for (const arg of args) {
    if (arg.startsWith('--dealer=')) {
      dealerArg = arg.split('=')[1];
    }
  }

  const dealerConfig = resolveDealer(dealerArg);
  if (!dealerConfig) {
    console.error(`[ERROR] Unknown dealer code: "${dealerArg}"`);
    console.error(`Supported dealers: ${REGISTERED_DEALERS.map((d) => d.dealerCode).join(', ')}`);
    process.exitCode = 1;
    return;
  }

  const startTime = Date.now();
  const sweepTimestamp = new Date().toISOString();

  console.log(`================================================================`);
  console.log(`ToyotaWaits.ca Phase 3 Automated Inventory Sweep Runner`);
  console.log(`Target Dealer: ${dealerConfig.dealerName} (${dealerConfig.dealerCode})`);
  console.log(`Platform:      ${dealerConfig.platform.toUpperCase()}`);
  console.log(`Timestamp:     ${sweepTimestamp}`);
  console.log(`Mode:          ${useFixture ? 'OFFLINE FIXTURE' : dryRun ? 'DRY RUN (Network Check)' : 'LIVE INGESTION'}`);
  console.log(`================================================================\n`);

  let rawPayload: any;

  if (useFixture) {
    const fixturePath = path.resolve(
      process.cwd(),
      'audit-artifacts',
      'dealer-discovery',
      'convertus-vms-sample.json'
    );
    console.log(`[FIXTURE] Loading fixture: ${fixturePath}`);
    rawPayload = JSON.parse(fs.readFileSync(fixturePath, 'utf-8'));
  } else {
    try {
      const initialUrl = buildConvertusPageUrl(dealerConfig.endpointUrl, 1, 100);
      const fetchResult = await fetchWithRetry(initialUrl, DEFAULT_TIMEOUT_MS);
      rawPayload = fetchResult.body;
      console.log(`[HTTP] Feed successfully retrieved in ${Date.now() - startTime}ms.`);

      // Handle multi-page pagination loops if total inventory exceeds page capacity
      const totalVehicles = rawPayload?.summary?.total_vehicles;
      if (
        totalVehicles &&
        Array.isArray(rawPayload.results) &&
        rawPayload.results.length < totalVehicles
      ) {
        console.log(
          `[PAGINATION] Total vehicles reported (${totalVehicles}) exceeds initial page count (${rawPayload.results.length}). Fetching subsequent pages...`
        );
        let currentPage = 2;
        const maxPages = 10;
        while (rawPayload.results.length < totalVehicles && currentPage <= maxPages) {
          await new Promise((r) => setTimeout(r, 1500)); // Polite delay per Master Plan V3.2
          const nextUrl = buildConvertusPageUrl(dealerConfig.endpointUrl, currentPage, 100);
          try {
            const nextResult = await fetchWithRetry(nextUrl, DEFAULT_TIMEOUT_MS);
            const nextItems = nextResult.body?.results;
            if (Array.isArray(nextItems) && nextItems.length > 0) {
              const existingIds = new Set(
                rawPayload.results.map((x: any) => x.ad_id || x.vehicle_id || x.vin || x.stock_number)
              );
              const newItems = nextItems.filter(
                (x: any) => !existingIds.has(x.ad_id || x.vehicle_id || x.vin || x.stock_number)
              );
              if (newItems.length === 0) break;
              rawPayload.results.push(...newItems);
              console.log(
                `[PAGINATION] Page ${currentPage} fetched ${newItems.length} new items (Total collected: ${rawPayload.results.length}/${totalVehicles})`
              );
            } else {
              break;
            }
          } catch (err: any) {
            console.warn(`[PAGINATION] Failed to fetch page ${currentPage}: ${err.message}. Proceeding with partial.`);
            break;
          }
          currentPage++;
        }
      }
    } catch (err: any) {
      console.error(`[CIRCUIT BREAKER] Fatal network failure during dealer sweep:`, err.message);
      // Gracefully exit with non-zero code to fail GitHub Actions step without corrupting data
      process.exitCode = 1;
      return;
    }
  }

  // Parse & Normalize
  console.log(`[ADAPTER] Parsing payload via Convertus VMS Adapter...`);
  const parseResult = parseConvertusPayload(rawPayload);
  console.log(`  -> Validated Vehicles: ${parseResult.count} / ${parseResult.totalInPayload}`);
  console.log(`  -> Quarantined Items:  ${parseResult.quarantined.length}`);

  if (!parseResult.success || parseResult.records.length === 0) {
    console.error(`[ERROR] Parsing failed or zero valid vehicles found. Aborting ingestion.`);
    process.exitCode = 1;
    return;
  }

  // Check Database Configuration & Validate Service Key
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const isServiceKeyConfigured = Boolean(
    serviceKey &&
    !serviceKey.includes('placeholder') &&
    serviceKey.trim() !== ''
  );

  if (!isServiceKeyConfigured) {
    if (dryRun) {
      console.log(`\nℹ️  Notice: Running in dry-run mode (Supabase persistence skipped).`);
      console.log(`    Validation succeeded for ${parseResult.count} vehicle listings.`);
      console.log(`[DRY RUN VERIFIED]`);
      console.log(`  - Sample Model: ${parseResult.records[0].vehicle.model} ${parseResult.records[0].vehicle.trim || ''}`);
      console.log(`  - Sample VIN:   ${parseResult.records[0].vehicle.vin || 'Provisional'}`);
      console.log(`  - Sample Price: $${parseResult.records[0].pricing.sellingPrice ?? parseResult.records[0].pricing.msrp}`);
      console.log(`\n================================================================`);
      console.log(`Sweep completed successfully (Dry Run).`);
      return;
    }

    console.log(`\n================================================================`);
    console.log(`SKIPPED: SUPABASE_SERVICE_ROLE_KEY not configured in GitHub Secrets`);
    console.log(`Validated ${parseResult.count} public inventory records from endpoint.`);
    console.log(`To enable automated persistence, configure SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL in GitHub Secrets.`);
    console.log(`================================================================`);
    return;
  }

  if (dryRun) {
    console.log(`\nℹ️  Notice: Running in explicit dry-run mode.`);
    console.log(`    Validation succeeded for ${parseResult.count} vehicle listings.`);
    console.log(`================================================================`);
    console.log(`Sweep completed successfully (Dry Run).`);
    return;
  }

  // Connect & Ingest to Supabase
  const supabase = createServerClient();

  try {
    console.log(`[DB] Seeding or resolving source and dealer records...`);
    const { sourceId, dealerId } = await seedReferenceEntities(supabase, dealerConfig);
    console.log(`  -> Source ID: ${sourceId}`);
    console.log(`  -> Dealer ID: ${dealerId}`);

    console.log(`[INGEST] Ingesting ${parseResult.records.length} parsed listings...`);
    const ingestSummary = await ingestDealerListings({
      dealerId,
      sourceId,
      parsedListings: parseResult.records,
      sweepTimestamp,
      supabaseClient: supabase,
    });

    console.log(`  -> Listings Created:             ${ingestSummary.listingsCreated}`);
    console.log(`  -> Listings Updated:             ${ingestSummary.listingsUpdated}`);
    console.log(`  -> Status Transitions Detected:  ${ingestSummary.statusTransitionsDetected}`);
    console.log(`  -> Observations Persisted:       ${ingestSummary.observationsStored}`);

    // Staleness Evaluation (enforcing 2-sweep safeguard)
    console.log(`[STALENESS] Evaluating missed listings against 2-sweep safeguard...`);
    const activeIds = parseResult.records.map((r) => r.listing.sourceListingId);
    const stalenessSummary = await evaluateSweepStaleness({
      dealerId,
      activeSourceListingIdsInSweep: activeIds,
      sweepTimestamp,
      supabaseClient: supabase,
    });

    console.log(`  -> Active Evaluated:      ${stalenessSummary.totalActiveEvaluated}`);
    console.log(`  -> Missed Once (Pending): ${stalenessSummary.missedOnceCount}`);
    console.log(`  -> Marked Stale:          ${stalenessSummary.staleTransitionsCount}`);

    // Telemetry Logging
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
      console.log(`[TELEMETRY] Health log successfully registered in source_health_logs.`);
    } catch {
      // Telemetry error does not abort sweep
    }

    console.log(`\n================================================================`);
    console.log(`[SUCCESS] Sweep completed cleanly in ${Date.now() - startTime}ms.`);
    console.log(`================================================================`);
  } catch (err: any) {
    if (
      err.message?.includes('Could not find the table') ||
      err.message?.includes('relation "sources" does not exist') ||
      err.message?.includes('schema cache')
    ) {
      console.log(`\n================================================================`);
      console.log(`SKIPPED: Discovery schema not yet applied to remote Supabase instance.`);
      console.log(`Validated ${parseResult.count} public inventory records from endpoint.`);
      console.log(`To enable persistence, apply migration supabase/migrations/20261017_inventory_discovery_schema.sql`);
      console.log(`================================================================`);
      return;
    }
    console.error(`[ERROR] Ingestion error:`, err.message);
    process.exitCode = 1;
    return;
  }
}

main().catch((err) => {
  console.error(`[UNHANDLED ERROR]`, err);
  process.exit(1);
});
