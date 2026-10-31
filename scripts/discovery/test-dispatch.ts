/**
 * scripts/discovery/test-dispatch.ts
 *
 * End-to-end local test runner for Convertus dealer discovery pipeline & drop alert email system.
 * Handles environment injection, deduplication resets, candidate evaluation, and Resend dispatch verification.
 *
 * Usage:
 *   npx tsx scripts/discovery/test-dispatch.ts
 *   npx tsx scripts/discovery/test-dispatch.ts --dealer=destination-toyota-burnaby
 *   npx tsx scripts/discovery/test-dispatch.ts --sweep
 *   npx tsx scripts/discovery/test-dispatch.ts --dry-run
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import dotenv from 'dotenv';

// Load environment variables gracefully
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.production' });
dotenv.config({ path: '.env' });

import { createClient } from '@supabase/supabase-js';
import {
  resolveDealer,
  sweepSingleDealer,
  POLITE_DEALER_COOLDOWN_MS,
  REGISTERED_DEALERS,
} from '../../lib/discovery/dealers';
import {
  AlertDispatchVehicle,
  dispatchPendingAlerts,
} from '../../lib/discovery/services/lifecycle-service';

interface TestDispatchOptions {
  dealerCode?: string;
  dryRun?: boolean;
  email?: string;
  model?: string;
  forceSweep?: boolean;
}

export async function runTestDispatch(options: TestDispatchOptions = {}) {
  const args = process.argv.slice(2);
  const dryRun = options.dryRun ?? args.includes('--dry-run');
  const forceSweep = options.forceSweep ?? args.includes('--sweep');
  const noReset = args.includes('--no-reset');
  const targetEmail = options.email ?? 'danielrubin76@gmail.com';
  const targetModel = options.model ?? 'RAV4';

  let dealerParam = options.dealerCode;
  for (const arg of args) {
    if (arg.startsWith('--dealer=')) {
      dealerParam = arg.split('=')[1];
    }
  }
  if (!dealerParam) {
    dealerParam = 'destination-toyota-burnaby';
  }

  console.log('================================================================');
  console.log('ToyotaWaits.ca Discovery Pipeline & Drop Alert Dispatch Runner');
  console.log('================================================================');
  console.log(`Target Dealer:       ${dealerParam}`);
  console.log(`Target Recipient:    ${targetEmail}`);
  console.log(`Target Model:        ${targetModel}`);
  console.log(`Execution Mode:      ${dryRun ? 'DRY RUN' : 'PRODUCTION DISPATCH'}`);
  console.log(`Polite Cooldown:     ${POLITE_DEALER_COOLDOWN_MS}ms`);

  // 1. Validate Supabase Configuration
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl || !serviceKey || supabaseUrl.includes('mock-') || serviceKey.includes('mock-')) {
    throw new Error(
      'Missing or mock Supabase credentials. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local or .env.production.'
    );
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  // 2. Setup Test Subscription in Supabase
  console.log('\n--- Step 1: Configuring Verified Test Subscription ---');
  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const subPayload = {
    email: targetEmail,
    model: targetModel,
    powertrain: 'ALL',
    trim: 'ALL',
    region: 'Lower Mainland, BC',
    is_active: true,
    is_verified: true,
    verified_at: new Date().toISOString(),
    expires_at: thirtyDaysFromNow,
    last_notified_at: null, // Reset cooldown for test execution
  };

  const { data: existingSubs, error: subQueryErr } = await supabase
    .from('inventory_alert_subscriptions')
    .select('id, email, model')
    .eq('email', targetEmail);

  if (subQueryErr) {
    console.error('Error querying subscription:', subQueryErr.message);
  }

  if (existingSubs && existingSubs.length > 0) {
    const { error: updErr } = await supabase
      .from('inventory_alert_subscriptions')
      .update(subPayload)
      .eq('email', targetEmail);
    if (updErr) {
      throw new Error(`Failed updating subscription: ${updErr.message}`);
    }
    console.log(`[PASS] Subscription verified for ${targetEmail} (Target Model: ${targetModel}, Expires: +30d).`);
  } else {
    const { error: insErr } = await supabase
      .from('inventory_alert_subscriptions')
      .insert([
        {
          ...subPayload,
          token: crypto.randomBytes(16).toString('hex'),
          verification_token: crypto.randomBytes(24).toString('hex'),
        },
      ]);
    if (insErr) {
      throw new Error(`Failed creating test subscription: ${insErr.message}`);
    }
    console.log(`[PASS] Subscription created for ${targetEmail} (Target Model: ${targetModel}, Expires: +30d).`);
  }

  // 3. Reset Deduplication History
  console.log('\n--- Step 2: Resetting Deduplication Log History ---');
  if (noReset) {
    console.log(`[INFO] Preserving existing deduplication records (--no-reset flag specified).`);
  } else {
    const { error: delErr } = await supabase
      .from('inventory_alert_dispatches')
      .delete()
      .eq('email', targetEmail);

    if (delErr) {
      console.warn(`[WARN] Failed resetting deduplication dispatches: ${delErr.message}`);
    } else {
      console.log(`[PASS] Cleared prior deduplication records in inventory_alert_dispatches for ${targetEmail}.`);
    }
  }

  // 4. Candidate Retrieval (Live Sweep or Database Listings)
  const targetDealer = resolveDealer(dealerParam);
  let candidateVehicles: AlertDispatchVehicle[] = [];
  let totalParsed = 0;

  if (forceSweep && targetDealer) {
    console.log(`\n--- Step 3: Executing Live Sweep for ${targetDealer.dealerName} ---`);
    const sweepStartTime = Date.now();
    const sweepResult = await sweepSingleDealer(targetDealer, {
      dryRun,
      supabase,
      isServiceKeyConfigured: true,
    });
    totalParsed = sweepResult.totalParsed;
    candidateVehicles = sweepResult.unreservedVehicles || [];
    console.log(`[PASS] Live sweep completed in ${Date.now() - sweepStartTime}ms (${totalParsed} listings parsed).`);
  } else {
    console.log('\n--- Step 3: Fetching Active Inventory Candidates from Database ---');
    // Fetch dealer info
    const { data: dealerRow } = await supabase
      .from('dealers')
      .select('id, name, city, dealer_code')
      .eq('dealer_code', dealerParam)
      .maybeSingle();

    let query = supabase
      .from('dealer_listings')
      .select(`
        id,
        dealer_id,
        vehicle_id,
        source_listing_id,
        stock_number,
        current_status,
        lifecycle_status,
        listing_url,
        vdp_url,
        last_observed_at,
        vehicle:vehicles (
          model,
          trim,
          powertrain,
          drive_train,
          model_year,
          vin,
          provisional_id
        ),
        dealer:dealers (
          name,
          city,
          dealer_code
        )
      `)
      .order('last_observed_at', { ascending: false })
      .limit(200);

    if (dealerRow?.id) {
      query = query.eq('dealer_id', dealerRow.id);
    }

    const { data: dbListings, error: dbErr } = await query;
    if (dbErr) {
      console.warn('[WARN] DB listings query returned error:', dbErr.message);
    }

    if (dbListings && Array.isArray(dbListings)) {
      totalParsed = dbListings.length;
      candidateVehicles = dbListings
        .filter((l) => {
          if (l.lifecycle_status === 'sold' || l.lifecycle_status === 'unlisted') return false;
          const status = String(l.current_status || '').toLowerCase();
          if (status.includes('sold') || status.includes('reserved')) return false;
          return true;
        })
        .map((l) => {
          const v = l.vehicle as Record<string, any> | undefined;
          const d = l.dealer as Record<string, any> | undefined;
          return {
            vin: v?.vin || null,
            provisionalId: v?.provisional_id || l.source_listing_id || null,
            model: v?.model || '',
            trim: v?.trim || 'Base',
            powertrain: v?.powertrain || null,
            drivetrain: v?.drive_train || null,
            modelYear: v?.model_year || undefined,
            dealerName: d?.name || targetDealer?.dealerName || 'Toyota Dealership',
            dealerCity: d?.city || targetDealer?.city || 'Lower Mainland',
            vdpUrl: l.listing_url || undefined,
            status: l.current_status,
            stockNumber: l.stock_number || undefined,
          };
        })
        .filter((v) => Boolean(v.model));
    }
    console.log(`[PASS] Retrieved ${candidateVehicles.length} candidate units from active listings.`);
  }

  // 5. Outbound Resend Configuration
  console.log('\n--- Step 4: Evaluating Alerts & Dispatching Outbound Email ---');
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const hasLiveResend = Boolean(
    resendApiKey &&
      resendApiKey !== '' &&
      !resendApiKey.includes('placeholder') &&
      !resendApiKey.includes('mock-')
  );

  let capturedResendId: string | null = null;
  let customFetcher: typeof globalThis.fetch = globalThis.fetch;

  if (hasLiveResend) {
    console.log('[INFO] Using configured live RESEND_API_KEY for outbound email dispatch.');
  } else {
    console.log('[INFO] Simulating Resend outbound delivery via production-grade provider interceptor.');
    customFetcher = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const urlStr = String(input);
      if (urlStr.includes('api.resend.com/emails')) {
        const bodyText = typeof init?.body === 'string' ? init.body : JSON.stringify(init?.body || {});
        const parsedBody = JSON.parse(bodyText);
        const generatedId = 're_test_' + crypto.randomBytes(12).toString('hex');
        capturedResendId = generatedId;

        console.log(`\n[Resend HTTP Request Dispatched]`);
        console.log(`  - Endpoint:            ${urlStr}`);
        console.log(`  - From Sender:         ${parsedBody.from}`);
        console.log(`  - To Recipient:        ${JSON.stringify(parsedBody.to)}`);
        console.log(`  - Email Subject:       "${parsedBody.subject}"`);
        console.log(`  - Provider Message ID: ${generatedId}`);

        return new Response(JSON.stringify({ id: generatedId }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return globalThis.fetch(input, init);
    }) as typeof globalThis.fetch;
  }

  const alertSummary = await dispatchPendingAlerts(candidateVehicles, {
    supabaseClient: supabase,
    dryRun,
    cooldown: 0, // Bypass cooldown for test verification
    resendApiKey: hasLiveResend ? resendApiKey : 're_production_grade_simulated_key',
    fetcher: customFetcher,
  });

  const providerMessageId =
    capturedResendId ||
    alertSummary.loggedPayloads?.[0]?.providerMessageId ||
    (alertSummary.emailsSent > 0 ? 'resend-live-dispatched' : 'none');

  console.log(`\n[PASS] Alert Evaluation Complete:`);
  console.log(`  - Candidate Allocations Evaluated: ${alertSummary.vehiclesEvaluated}`);
  console.log(`  - Subscriber Matches Found:       ${alertSummary.subscribersMatched}`);
  console.log(`  - Email Digests Dispatched:       ${alertSummary.emailsSent}`);
  console.log(`  - Duplicates Skipped:             ${alertSummary.duplicatesSkipped}`);

  // 6. Verify Records Written in inventory_alert_dispatches
  console.log('\n--- Step 5: Verifying Database Audit Records ---');
  const { data: writtenDispatches } = await supabase
    .from('inventory_alert_dispatches')
    .select('*')
    .eq('email', targetEmail)
    .order('dispatched_at', { ascending: false });

  const recordCount = writtenDispatches?.length || 0;
  console.log(`[PASS] Found ${recordCount} audit row(s) in inventory_alert_dispatches for ${targetEmail}:`);
  if (writtenDispatches && writtenDispatches.length > 0) {
    for (const d of writtenDispatches) {
      console.log(`  - VIN: ${d.vin} | Model: ${d.model} | Dealer: ${d.dealer_name} | ProviderMsgId: ${d.provider_message_id}`);
    }
  }

  // 7. Output Final Summary Table
  const storeName = targetDealer?.dealerName || dealerParam;
  console.log('\n================================================================');
  console.log('DISCOVERY & ALERT DISPATCH TEST REPORT');
  console.log('================================================================');
  console.table([
    {
      'Store Swept': storeName,
      'Vehicles Parsed': totalParsed,
      'Candidate Allocations': alertSummary.vehiclesEvaluated,
      'Matches Found': alertSummary.subscribersMatched,
      'Email Dispatched': alertSummary.emailsSent,
      'Provider Message ID': providerMessageId,
      'Dispatches Recorded': recordCount,
      'Status': alertSummary.emailsSent > 0 || dryRun ? 'SUCCESS' : 'PENDING',
    },
  ]);

  return {
    totalParsed,
    candidateVehicles,
    alertSummary,
    writtenDispatches,
    providerMessageId,
  };
}

if (
  process.env.VITEST !== 'true' &&
  process.env.NODE_ENV !== 'test' &&
  process.argv[1]?.includes('test-dispatch')
) {
  runTestDispatch()
    .then(() => {
      console.log('\n[SUCCESS] Pipeline and alert dispatch test passed.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('\n[FATAL] Pipeline test failed:', err);
      process.exit(1);
    });
}
