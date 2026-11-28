/**
 * scripts/discovery/sweep-dealer.ts
 *
 * Automated Polite Inventory Sweep CLI Runner for ToyotaWaits.ca
 * Phase 3 Production Sweep Runner
 *
 * Usage:
 *   npx tsx scripts/discovery/sweep-dealer.ts --dealer=jptoyota-downtown
 *   npx tsx scripts/discovery/sweep-dealer.ts --dealer=jptoyota-surrey
 *   npx tsx scripts/discovery/sweep-dealer.ts --all
 *   npm run sweep:dealer -- --dealer=jptoyota-surrey
 *   npm run sweep:all
 *   npm run sweep:dealer -- --help
 */

import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import {
  detectAndTransitionSoldUnits,
  dispatchPendingAlerts,
} from '../../lib/discovery/services/lifecycle-service';
import { createServerClient } from '../../src/lib/supabase/server';
import {
  USER_AGENT_AUDITOR,
  DEFAULT_TIMEOUT_MS,
  MAX_RETRIES,
  INITIAL_BACKOFF_MS,
  POLITE_DEALER_COOLDOWN_MS,
  RegisteredDealerSource,
  REGISTERED_DEALERS,
  DealerSweepExecutionResult,
  DealerSweepResult,
  buildConvertusPageUrl,
  parseToyotaSlugSpec,
  parsePublicSitemapToConvertusItems,
  resolveDealer,
  seedReferenceEntities,
  sweepSingleDealer,
} from '../../lib/discovery/dealers';

export {
  loadEnv,
  dispatchPendingAlerts,
  detectAndTransitionSoldUnits,
  runRetentionCleanup,
  USER_AGENT_AUDITOR,
  DEFAULT_TIMEOUT_MS,
  MAX_RETRIES,
  INITIAL_BACKOFF_MS,
  POLITE_DEALER_COOLDOWN_MS,
  REGISTERED_DEALERS,
  buildConvertusPageUrl,
  parseToyotaSlugSpec,
  parsePublicSitemapToConvertusItems,
  resolveDealer,
  seedReferenceEntities,
  sweepSingleDealer,
};
export type { RegisteredDealerSource, DealerSweepExecutionResult, DealerSweepResult };

export interface SweepRunSummary {
  dealersTargeted: number;
  dealersSucceeded: number;
  dealersFailed: number;
  totalValidUnits: number;
  totalObservations: number;
  totalQuarantined: number;
  durationMs: number;
}

function printHelp() {
  console.log(`
ToyotaWaits.ca Dealer Inventory Sweep Runner
============================================
Automated polite sweep runner for Canadian Toyota dealer public inventory.

Usage:
  npx tsx scripts/discovery/sweep-dealer.ts [options]
  npm run sweep:dealer -- [options]
  npm run sweep:all

Options:
  --dealer=<code|alias|all>  Specify target dealer (default: jptoyota-downtown)
                             Supported: jptoyota-downtown, jptoyota-surrey, jptoyota-northshore, destination-toyota-burnaby, west-coast-toyota, regency-toyota, openroad-toyota-richmond, openroad-toyota-port-moody, granville-toyota, valley-toyota, abbotsford-toyota, jptoyota-victoria, jptoyota-duncan, kelowna-toyota, vernon-toyota, westminster-toyota, openroad-toyota-peace-arch, langley-toyota, nanaimo-toyota, ken-shaw-toyota, attrell-toyota, georgetown-toyota, erin-park-toyota, mississauga-toyota, simcoe-toyota, downtown-toyota, don-valley-north-toyota, thornhill-toyota, richmond-hill-toyota, oakville-toyota, upper-james-toyota, pickering-toyota, whitby-toyota, openroad-lexus-richmond, pattison-lexus-northshore, lexus-downtown-toronto, stampede-toyota, country-hills-toyota, gateway-toyota, mayfield-toyota, all
  --all                      Sweep all registered active pilot dealers sequentially
  --dry-run                  Execute sweep, parse and validate without persisting to Supabase
  --fixture                  Use local offline fixture instead of fetching live endpoint
  --help, -h                 Show this help screen and exit

Operating Safeguards:
  - User-Agent disclosure: ${USER_AGENT_AUDITOR}
  - Polite Cooldown: ${POLITE_DEALER_COOLDOWN_MS}ms between distinct dealership requests
  - Request timeout: ${DEFAULT_TIMEOUT_MS}ms
  - Retries: Up to ${MAX_RETRIES} attempts with exponential backoff on transient errors
  - Circuit Breaker: Immediate exit on HTTP 429 rate-limiting
  - Staleness Protection: Enforces 2-sweep confirmation before marking vehicles stale
`);
}

/**
 * Safely load local environment in non-CI development if present.
 * In CI (e.g. GitHub Actions runner), relies directly on process.env.NEXT_PUBLIC_SUPABASE_URL
 * and process.env.SUPABASE_SERVICE_ROLE_KEY provided by the workflow environment.
 */
function loadEnv(): void {
  dotenv.config({ path: '.env.local' });
  dotenv.config({ path: '.env.production' });
  dotenv.config({ path: '.env' });

  if (process.env.CI === 'true') {
    return;
  }

  // Attempt Node 20.6+ native loadEnvFile
  const proc = process as unknown as { loadEnvFile?: (path?: string) => void };
  if (typeof proc.loadEnvFile === 'function') {
    try {
      proc.loadEnvFile('.env.local');
      return;
    } catch {
      // Fall through to manual parsing if file doesn't exist or errors
    }
  }

  try {
    const fs = require('fs');
    const path = require('path');
    for (const f of ['.env.local', '.env']) {
      const full = path.resolve(process.cwd(), f);
      if (fs.existsSync(full)) {
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
            if (!process.env[k]) {
              process.env[k] = v;
            }
          }
        }
      }
    }
  } catch {
    // Non-fatal if local env cannot be loaded
  }
}

/**
 * Automated Supabase retention cleanup run after an --all sweep completes:
 * 1. Nullify raw_payload on observations older than 3 days (batched).
 * 2. Delete observations older than 21 days (batched).
 * 3. Delete non-active dealer_listings older than 30 days (batched).
 */
async function runRetentionCleanup(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabaseClient: any,
  nowMs = Date.now()
): Promise<void> {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const BATCH_SIZE = 200;
  const MAX_BATCHES = 500;
  const threeDaysAgoIso = new Date(nowMs - 3 * DAY_MS).toISOString();
  const twentyOneDaysAgoIso = new Date(nowMs - 21 * DAY_MS).toISOString();
  const thirtyDaysAgoIso = new Date(nowMs - 30 * DAY_MS).toISOString();

  try {
    // 1. Batched nullify raw_payload on observations > 3 days
    let totalNullified = 0;
    for (let batch = 0; batch < MAX_BATCHES; batch++) {
      const { data: rows, error: selectErr } = await supabaseClient
        .from('observations')
        .select('id')
        .lt('observed_at', threeDaysAgoIso)
        .not('raw_payload', 'is', null)
        .limit(BATCH_SIZE);

      if (selectErr) {
        console.warn('[RETENTION] Failed to query old observation raw_payload:', selectErr.message);
        break;
      }
      const ids = Array.isArray(rows) ? rows.map((r: { id: string }) => r.id).filter(Boolean) : [];
      if (ids.length === 0) break;

      const { error: nullifyError } = await supabaseClient
        .from('observations')
        .update({ raw_payload: null })
        .in('id', ids);

      if (nullifyError) {
        console.warn('[RETENTION] Failed to nullify old observation raw_payload:', nullifyError.message);
        break;
      }
      totalNullified += ids.length;
      if (ids.length < BATCH_SIZE) break;
    }
    console.log(
      `[RETENTION] Nullified raw_payload on ${totalNullified} observation(s) older than 3 days.`
    );

    // 2. Batched delete observations > 21 days
    let totalDeletedObs = 0;
    for (let batch = 0; batch < MAX_BATCHES; batch++) {
      const { data: rows, error: selectErr } = await supabaseClient
        .from('observations')
        .select('id')
        .lt('observed_at', twentyOneDaysAgoIso)
        .limit(BATCH_SIZE);

      if (selectErr) {
        console.warn('[RETENTION] Failed to query old observations:', selectErr.message);
        break;
      }
      const ids = Array.isArray(rows) ? rows.map((r: { id: string }) => r.id).filter(Boolean) : [];
      if (ids.length === 0) break;

      const { error: deleteObsError } = await supabaseClient
        .from('observations')
        .delete()
        .in('id', ids);

      if (deleteObsError) {
        console.warn('[RETENTION] Failed to delete old observations:', deleteObsError.message);
        break;
      }
      totalDeletedObs += ids.length;
      if (ids.length < BATCH_SIZE) break;
    }
    console.log(
      `[RETENTION] Deleted ${totalDeletedObs} observation(s) older than 21 days.`
    );

    // 3. Batched delete non-active dealer_listings > 30 days
    let totalDeletedListings = 0;
    for (let batch = 0; batch < MAX_BATCHES; batch++) {
      const { data: rows, error: selectErr } = await supabaseClient
        .from('dealer_listings')
        .select('id')
        .neq('lifecycle_status', 'active')
        .lt('last_observed_at', thirtyDaysAgoIso)
        .limit(BATCH_SIZE);

      if (selectErr) {
        console.warn('[RETENTION] Failed to query stale non-active dealer_listings:', selectErr.message);
        break;
      }
      const ids = Array.isArray(rows) ? rows.map((r: { id: string }) => r.id).filter(Boolean) : [];
      if (ids.length === 0) break;

      const { error: deleteListingsError } = await supabaseClient
        .from('dealer_listings')
        .delete()
        .in('id', ids);

      if (deleteListingsError) {
        console.warn(
          '[RETENTION] Failed to delete stale non-active dealer_listings:',
          deleteListingsError.message
        );
        break;
      }
      totalDeletedListings += ids.length;
      if (ids.length < BATCH_SIZE) break;
    }
    console.log(
      `[RETENTION] Deleted ${totalDeletedListings} non-active dealer_listing(s) older than 30 days.`
    );
  } catch (err: any) {
    console.warn('[RETENTION] Unexpected cleanup error:', err?.message || err);
  }
}

export async function runSweep(): Promise<SweepRunSummary> {
  loadEnv();

  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    return {
      dealersTargeted: 0,
      dealersSucceeded: 0,
      dealersFailed: 0,
      totalValidUnits: 0,
      totalObservations: 0,
      totalQuarantined: 0,
      durationMs: 0,
    };
  }

  const dryRun = args.includes('--dry-run');
  const useFixture = args.includes('--fixture');
  const isAll = args.includes('--all');

  // Secrets validation: Fail fast in headless CI if NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  let serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if ((!supabaseUrl || !serviceKey) && fs.existsSync('.env.local')) {
    dotenv.config({ path: '.env.local' });
    supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  }
  if ((!supabaseUrl || !serviceKey) && fs.existsSync('.env.production')) {
    dotenv.config({ path: '.env.production' });
    supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  }

  const isUrlConfigured = Boolean(
    supabaseUrl &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseUrl.includes('mock-') &&
    supabaseUrl !== ''
  );
  const isServiceKeyConfigured = Boolean(
    serviceKey &&
    !serviceKey.includes('placeholder') &&
    !serviceKey.includes('mock-') &&
    serviceKey !== ''
  );

  if (!dryRun && !useFixture && (!isUrlConfigured || !isServiceKeyConfigured)) {
    const missing: string[] = [];
    if (!isUrlConfigured) missing.push('NEXT_PUBLIC_SUPABASE_URL');
    if (!isServiceKeyConfigured) missing.push('SUPABASE_SERVICE_ROLE_KEY');
    throw new Error(
      `Missing required Supabase secrets (${missing.join(', ')}). Failing fast to prevent unauthenticated or hanging sweep execution.`
    );
  }

  let dealerArg = isAll ? 'all' : 'jptoyota-downtown';
  for (const arg of args) {
    if (arg.startsWith('--dealer=')) {
      dealerArg = arg.split('=')[1];
    }
  }

  const runAllDealers = isAll || dealerArg.toLowerCase() === 'all';

  let targetDealers: RegisteredDealerSource[] = [];

  if (runAllDealers) {
    targetDealers = REGISTERED_DEALERS;
  } else {
    const single = resolveDealer(dealerArg);
    if (!single) {
      throw new Error(
        `Unknown dealer code: "${dealerArg}". Supported dealers: ${REGISTERED_DEALERS.map((d) => d.dealerCode).join(', ')}, all`
      );
    }
    targetDealers = [single];
  }

  const overallStartTime = Date.now();

  console.log(`================================================================`);
  console.log(`ToyotaWaits.ca Phase 3 Multi-Dealer Inventory Sweep Runner`);
  console.log(`Dealers Targeted: ${targetDealers.map((d) => d.dealerName).join(', ')}`);
  console.log(`Mode:             ${useFixture ? 'OFFLINE FIXTURE' : dryRun ? 'DRY RUN' : 'LIVE INGESTION'}`);
  console.log(`================================================================`);

  const supabase = isServiceKeyConfigured && !dryRun ? createServerClient() : null;

  const results: DealerSweepResult[] = [];
  const cooldownMs = Number(process.env.POLITE_DEALER_COOLDOWN_MS) || POLITE_DEALER_COOLDOWN_MS;

  for (let i = 0; i < targetDealers.length; i++) {
    const dealer = targetDealers[i];

    // Execute isolated sweep with store-level error isolation
    try {
      const result = await sweepSingleDealer(dealer, {
        dryRun,
        useFixture,
        supabase,
        isServiceKeyConfigured,
      });
      if (!result.success) {
        console.warn(`  [STORE-LEVEL SKIP] ${dealer.dealerName} skipped politely: ${result.errorMessage}`);
      }
      results.push(result);
    } catch (storeErr: any) {
      console.error('  [STORE-LEVEL FAILURE] ' + dealer.dealerName + ' threw error:', storeErr?.message || storeErr);
      results.push({
        dealerCode: dealer.dealerCode,
        dealerName: dealer.dealerName,
        success: false,
        totalParsed: 0,
        quarantinedCount: 0,
        listingsCreated: 0,
        listingsUpdated: 0,
        observationsStored: 0,
        durationMs: 0,
        errorMessage: storeErr?.message || String(storeErr),
      });
    }

    // Polite delay between distinct dealerships
    if (i < targetDealers.length - 1) {
      console.log(`\n[POLITE COOLDOWN] Waiting ${cooldownMs}ms before next dealership sweep...`);
      await new Promise((r) => setTimeout(r, cooldownMs));
    }
  }

  const totalTime = Date.now() - overallStartTime;

  // Sold Unit Detection after an --all sweep completes
  if (runAllDealers && supabase) {
    const sweptDealerIds = results
      .filter((r) => r.success && r.dealerId)
      .map((r) => r.dealerId as string);
    if (sweptDealerIds.length > 0) {
      const soldSummary = await detectAndTransitionSoldUnits({
        sweptDealerIds,
        sweepStartTime: new Date(overallStartTime).toISOString(),
        supabaseClient: supabase,
      });
      console.log(
        `[LIFECYCLE] Sold Unit Detection evaluated ${soldSummary.evaluatedCount} active units -> transitioned ${soldSummary.transitionedToSoldCount} unobserved units to 'sold'.`
      );
    }

    await runRetentionCleanup(supabase);
  }

  // Print Overall Execution Summary
  console.log(`\n================================================================`);
  console.log(`MULTI-DEALER SWEEP EXECUTION SUMMARY (${totalTime}ms)`);
  console.log(`================================================================`);
  let totalValidUnits = 0;
  let totalObservations = 0;
  let totalQuarantined = 0;
  let hasFailure = false;

  for (const r of results) {
    totalValidUnits += r.totalParsed;
    totalObservations += r.observationsStored;
    totalQuarantined += r.quarantinedCount;
    if (!r.success) hasFailure = true;

    const statusLabel = r.success
      ? r.skippedReason
        ? `SKIPPED (${r.skippedReason})`
        : 'SUCCESS'
      : `FAILED (${r.errorMessage})`;

    console.log(`  * ${r.dealerName}:`);
    console.log(`      Status:               ${statusLabel}`);
    console.log(`      Valid Listings:       ${r.totalParsed}`);
    console.log(`      Quarantined:          ${r.quarantinedCount}`);
    console.log(`      Observations Stored:  ${r.observationsStored}`);
    console.log(`      Duration:             ${r.durationMs}ms`);
  }

  console.log(`----------------------------------------------------------------`);
  console.log(`Total Observed Units Across Dealers: ${totalValidUnits}`);
  console.log(`Total Observations Stored:           ${totalObservations}`);
  console.log(`Total Quarantined Across Stores:     ${totalQuarantined}`);
  console.log(`================================================================\n`);

  const dealersSucceeded = results.filter((r) => r.success).length;
  const dealersFailed = results.length - dealersSucceeded;

  if (hasFailure && (!runAllDealers || dealersSucceeded === 0)) {
    throw new Error(
      `Sweep failed for dealer(s): ${results
        .filter((r) => !r.success)
        .map((r) => r.dealerCode)
        .join(', ')}`
    );
  }

  return {
    dealersTargeted: targetDealers.length,
    dealersSucceeded,
    dealersFailed,
    totalValidUnits,
    totalObservations,
    totalQuarantined,
    durationMs: totalTime,
  };
}

if (
  process.env.VITEST !== 'true' &&
  process.env.NODE_ENV !== 'test' &&
  process.argv[1]?.includes('sweep-dealer')
) {
  runSweep()
    .then((summary) => {
      console.log('Sweep finished successfully:', summary);
      process.exitCode = 0;
    })
    .catch((err) => {
      console.error('Fatal sweep error:', err);
      process.exitCode = 1;
    });
}
