/**
 * scripts/discovery/run-ingestion.ts
 *
 * Local Pipeline Test Runner for ToyotaWaits.ca Master Plan V3.2
 * Sprint 3: Ingestion Pipeline, Observation Persistence & Transition Detection
 *
 * Usage:
 *   npx tsx scripts/discovery/run-ingestion.ts [--live]
 */

import * as fs from 'fs';
import * as path from 'path';
import { parseConvertusPayload } from '../../lib/discovery/adapters/convertus';
import { ingestDealerListings } from '../../lib/discovery/services/ingestion-service';
import { evaluateSweepStaleness } from '../../lib/discovery/services/staleness-service';
import { createServerClient, isLiveSupabaseConfigured } from '../../src/lib/supabase/server';

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
loadEnv();

const JP_DOWNTOWN_SOURCE = {
  code: 'jp-toyota-downtown-convertus',
  name: 'Jim Pattison Toyota Downtown Convertus Feed',
  platform: 'convertus',
  base_url: 'https://www.jptoyota-downtown.com',
  endpoint_url:
    'https://www.jptoyota-downtown.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Fcp%3D1250%26ln%3Den%26sc%3Dnew',
  is_active: true,
};

const JP_DOWNTOWN_DEALER = {
  dealer_code: 'jp-toyota-downtown',
  name: 'Jim Pattison Toyota Downtown',
  brand: 'Toyota',
  address: '1290 Burrard Street',
  city: 'Vancouver',
  province: 'BC',
  country: 'CA',
  postal_code: 'V6Z 1Z1',
  phone: '(604) 687-6044',
  website_url: 'https://www.jptoyota-downtown.com/',
};

async function seedReferenceEntities(supabase: any) {
  // 1. Ensure Ingestion Source exists
  let sourceId: string;
  const { data: existingSource } = await supabase
    .from('sources')
    .select('id')
    .eq('code', JP_DOWNTOWN_SOURCE.code)
    .maybeSingle();

  if (existingSource) {
    sourceId = existingSource.id;
  } else {
    const { data: newSource, error: sourceErr } = await supabase
      .from('sources')
      .insert(JP_DOWNTOWN_SOURCE)
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
    .eq('dealer_code', JP_DOWNTOWN_DEALER.dealer_code)
    .maybeSingle();

  if (existingDealer) {
    dealerId = existingDealer.id;
  } else {
    const { data: newDealer, error: dealerErr } = await supabase
      .from('dealers')
      .insert({ ...JP_DOWNTOWN_DEALER, source_id: sourceId })
      .select('id')
      .single();

    if (dealerErr) throw new Error(`Failed to seed dealer: ${dealerErr.message}`);
    dealerId = newDealer.id;
  }

  return { sourceId, dealerId };
}

async function run() {
  const isLiveMode = process.argv.includes('--live');
  console.log(`================================================================`);
  console.log(`ToyotaWaits.ca Master Plan V3.2 - Sprint 3 Local Ingestion Pipeline`);
  console.log(`Mode: ${isLiveMode ? 'LIVE SWEEP (Validated Proxy)' : 'OFFLINE FIXTURE'}`);
  console.log(`Target: Jim Pattison Toyota Downtown (${JP_DOWNTOWN_SOURCE.code})`);
  console.log(`================================================================\n`);

  // 1. Load Raw Payload
  let rawPayload: any;
  if (isLiveMode) {
    console.log(`[SWEEP] Fetching live Convertus inventory payload...`);
    const res = await fetch(JP_DOWNTOWN_SOURCE.endpoint_url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; ToyotaWaitsLocalAuditor/1.0; +https://toyotawaits.ca/source-register)',
        'Accept': 'application/json, text/plain, */*',
      },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch live feed: HTTP ${res.status} ${res.statusText}`);
    }
    rawPayload = await res.json();
    console.log(`[SWEEP] Live feed successfully retrieved.`);
  } else {
    const fixturePath = path.resolve(
      process.cwd(),
      'audit-artifacts',
      'dealer-discovery',
      'convertus-vms-sample.json'
    );
    console.log(`[FIXTURE] Loading reference contract fixture: ${fixturePath}`);
    const fixtureContent = fs.readFileSync(fixturePath, 'utf-8');
    rawPayload = JSON.parse(fixtureContent);
  }

  // 2. Parse & Normalize via Convertus Adapter
  console.log(`[ADAPTER] Parsing payload with Convertus Ingestion Adapter...`);
  const parseResult = parseConvertusPayload(rawPayload);
  console.log(`  -> Parse Success: ${parseResult.success}`);
  console.log(`  -> Normalized Records: ${parseResult.count} / ${parseResult.totalInPayload}`);
  console.log(`  -> Quarantined Items: ${parseResult.quarantined.length}`);

  if (!parseResult.success || parseResult.records.length === 0) {
    console.error(`Error: Ingestion aborted due to parser failure.`);
    process.exit(1);
  }

  // 3. Connect to Supabase
  const isConfigured = isLiveSupabaseConfigured();
  if (!isConfigured) {
    console.log(`\nℹ️  Notice: No live remote Supabase credentials detected in environment.`);
    console.log(`    Running in dry-run validation mode (parser contract verified).`);
    console.log(`    To apply against a database, execute migrations and configure SUPABASE_URL / KEY.`);
    console.log(`\n[DRY RUN SUMMARY]`);
    console.log(`  - Validated Units: ${parseResult.count}`);
    console.log(`  - Sample VIN: ${parseResult.records[0].vehicle.vin}`);
    console.log(`  - Sample Status: ${parseResult.records[0].listing.normalizedStatus}`);
    console.log(`  - Sample MSRP: $${parseResult.records[0].pricing.msrp}`);
    console.log(`================================================================`);
    return;
  }

  const supabase = createServerClient();
  const sweepTimestamp = new Date().toISOString();

  // 4. Seed Reference Dealer & Source and Run Ingestion
  try {
    console.log(`[DB] Seeding reference source and dealer entities...`);
    const { sourceId, dealerId } = await seedReferenceEntities(supabase);
    console.log(`  -> Source ID: ${sourceId}`);
    console.log(`  -> Dealer ID: ${dealerId}`);

    // 5. Ingest Listings & Detect Transitions
    console.log(`[INGEST] Ingesting ${parseResult.records.length} parsed listings...`);
    const ingestSummary = await ingestDealerListings({
      dealerId,
      sourceId,
      parsedListings: parseResult.records,
      sweepTimestamp,
      supabaseClient: supabase,
    });

    // 6. Evaluate Sweep Staleness
    console.log(`[STALENESS] Evaluating 2-sweep staleness safeguard...`);
    const activeListingIds = parseResult.records.map((r) => r.listing.sourceListingId);
    const stalenessSummary = await evaluateSweepStaleness({
      dealerId,
      activeSourceListingIdsInSweep: activeListingIds,
      sweepTimestamp,
      supabaseClient: supabase,
    });

    // 7. Output Final Summary Report
    console.log(`\n================================================================`);
    console.log(`INGESTION PIPELINE EXECUTION SUMMARY`);
    console.log(`================================================================`);
    console.log(`Vehicles Created:             ${ingestSummary.vehiclesCreated}`);
    console.log(`Vehicles Linked (Existing):   ${ingestSummary.vehiclesLinked}`);
    console.log(`Listings Created:             ${ingestSummary.listingsCreated}`);
    console.log(`Listings Updated:             ${ingestSummary.listingsUpdated}`);
    console.log(`Observations Stored:          ${ingestSummary.observationsStored}`);
    console.log(`Status Transitions Detected:  ${ingestSummary.statusTransitionsDetected}`);
    console.log(`Status Events Logged:         ${ingestSummary.statusEventsLogged}`);
    console.log(`Active Listings Still Active: ${stalenessSummary.stillActiveCount}`);
    console.log(`Listings Missed Once (Held):  ${stalenessSummary.missedOnceCount}`);
    console.log(`Listings Stale (2 Sweeps):    ${stalenessSummary.staleTransitionsCount}`);
    if (ingestSummary.errors.length > 0) {
      console.log(`Errors Encountered:           ${ingestSummary.errors.length}`);
      ingestSummary.errors.forEach((e) => console.log(`  - [${e.listingId}]: ${e.error}`));
    }
    console.log(`================================================================\n`);
  } catch (dbErr: any) {
    const isMissingTable =
      dbErr.message?.includes('schema cache') ||
      dbErr.message?.includes('does not exist') ||
      dbErr.message?.includes('relation');

    if (isMissingTable) {
      console.log(`\nℹ️  Notice: Discovery database tables not yet migrated in connected database.`);
      console.log(`    Migration file: supabase/migrations/20261017_inventory_discovery_schema.sql`);
      console.log(`    (Run 'npm run db:migrate' or apply migration in Supabase SQL editor to persist).`);
      console.log(`\n[DRY RUN SUMMARY - PARSER VALIDATED]`);
      console.log(`  - Validated Units: ${parseResult.count}`);
      console.log(`  - Sample VIN: ${parseResult.records[0].vehicle.vin}`);
      console.log(`  - Sample Status: ${parseResult.records[0].listing.normalizedStatus}`);
      console.log(`  - Sample MSRP: $${parseResult.records[0].pricing.msrp}`);
      console.log(`  - Sample Selling Price: $${parseResult.records[0].pricing.sellingPrice}`);
      console.log(`================================================================\n`);
    } else {
      throw dbErr;
    }
  }
}

run().catch((err) => {
  console.error('Fatal error running ingestion pipeline:', err);
  process.exit(1);
});
