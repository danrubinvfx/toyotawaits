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
  dispatchPendingAlerts,
  detectAndTransitionSoldUnits,
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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

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
      process.exit(0);
    })
    .catch((err) => {
      console.error('Fatal sweep error:', err);
      process.exit(1);
    });
}
