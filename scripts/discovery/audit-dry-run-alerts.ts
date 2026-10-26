/**
 * scripts/discovery/audit-dry-run-alerts.ts
 *
 * Dry-Run Diagnostic Audit for Convertus Dealer Sweeps & Drop Alert Matching:
 * 1. Sweeps Convertus dealer endpoints with full pagination (pc=100, pg=1..N)
 *    and polite delays (POLITE_DEALER_COOLDOWN_MS = 4000).
 * 2. Audits vehicle status classification (Incoming/In-Transit vs Advertised/On-Lot vs Reserved/Sold).
 * 3. Queries active verified subscribers in inventory_alert_subscriptions (is_verified=true, expires_at > now()).
 * 4. Evaluates drop alert matching & VIN de-duplication against inventory_alert_dispatches in dry-run mode
 *    using custom sender ToyotaWaits.ca <hello@toyotawaits.ca>.
 */

import * as fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import {
  REGISTERED_DEALERS,
  buildConvertusPageUrl,
  parsePublicSitemapToConvertusItems,
  POLITE_DEALER_COOLDOWN_MS,
  USER_AGENT_AUDITOR,
} from './sweep-dealer';
import { parseConvertusPayload } from '../../lib/discovery/adapters/convertus';
import {
  AlertDispatchVehicle,
  dispatchPendingAlerts,
} from '../../lib/discovery/services/lifecycle-service';
import { NormalizedListingStatus } from '../../lib/discovery/types';

async function runAudit() {
  const envText = fs.existsSync('.env.production')
    ? fs.readFileSync('.env.production', 'utf8')
    : '';
  const sbUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock-')
      ? process.env.NEXT_PUBLIC_SUPABASE_URL
      : envText.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim() || '';
  const sbKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    !process.env.SUPABASE_SERVICE_ROLE_KEY.includes('mock-')
      ? process.env.SUPABASE_SERVICE_ROLE_KEY
      : envText.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim() || '';

  const supabase = createClient(sbUrl, sbKey);

  console.log('================================================================================');
  console.log('1. CONVERTUS DEALER SWEEP & PAGINATION / STATUS PARSING AUDIT (DRY-RUN)');
  console.log('================================================================================');
  console.log(`Polite Cooldown Configured: POLITE_DEALER_COOLDOWN_MS = ${POLITE_DEALER_COOLDOWN_MS}ms`);

  const allParsedVehicles: Array<
    AlertDispatchVehicle & {
      dealerCode: string;
      normalizedStatus: NormalizedListingStatus;
      rawStatus: string;
    }
  > = [];
  const dealerSummaries: Array<Record<string, unknown>> = [];

  for (let i = 0; i < REGISTERED_DEALERS.length; i++) {
    const dealer = REGISTERED_DEALERS[i];
    const startMs = Date.now();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rawPayload: any = null;
    let pagesFetched = 0;
    let sourceMode = 'Convertus VMS JSON API';

    const page1Url = buildConvertusPageUrl(dealer.endpointUrl, 1, 100);
    try {
      const res = await fetch(page1Url, {
        headers: {
          'User-Agent': USER_AGENT_AUDITOR,
          Accept: 'application/json, text/plain, */*',
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      rawPayload = await res.json();
      pagesFetched = 1;
      const totalVehicles = rawPayload?.summary?.total_vehicles || 0;
      let currentPage = 2;
      while (
        Array.isArray(rawPayload?.results) &&
        rawPayload.results.length < totalVehicles &&
        currentPage <= 10
      ) {
        await new Promise((r) => setTimeout(r, 1500));
        const nextUrl = buildConvertusPageUrl(dealer.endpointUrl, currentPage, 100);
        const nextRes = await fetch(nextUrl, {
          headers: {
            'User-Agent': USER_AGENT_AUDITOR,
            Accept: 'application/json, text/plain, */*',
          },
        });
        if (!nextRes.ok) break;
        const nextBody = await nextRes.json();
        const nextItems = nextBody?.results || [];
        if (nextItems.length === 0) break;
        rawPayload.results.push(...nextItems);
        pagesFetched++;
        currentPage++;
      }
    } catch {
      sourceMode = 'Public Sitemap Fallback (pc=100 pagination)';
      const sitemapUrl = `${dealer.baseUrl.replace(/\/+$/, '')}/sitemap.xml`;
      const sRes = await fetch(sitemapUrl, {
        headers: {
          'User-Agent': USER_AGENT_AUDITOR,
          Accept: 'application/xml, text/xml, */*',
        },
      });
      const xmlText = await sRes.text();
      const items = parsePublicSitemapToConvertusItems(xmlText);
      pagesFetched = Math.max(1, Math.ceil(items.length / 100));
      rawPayload = { summary: { total_vehicles: items.length }, results: items };
    }

    const parsed = parseConvertusPayload(rawPayload, {
      dealerBaseUrl: dealer.baseUrl,
      dealerCity: dealer.city,
      dealerProvince: dealer.province,
    });

    let incomingCount = 0;
    let advertisedOnLotCount = 0;
    let reservedSoldCount = 0;

    for (const rec of parsed.records) {
      if (rec.listing.normalizedStatus === NormalizedListingStatus.INCOMING_UNCONFIRMED) {
        incomingCount++;
      } else if (rec.listing.normalizedStatus === NormalizedListingStatus.ADVERTISED_UNCONFIRMED) {
        advertisedOnLotCount++;
      } else if (rec.listing.normalizedStatus === NormalizedListingStatus.RESERVED_SOLD) {
        reservedSoldCount++;
      }

      allParsedVehicles.push({
        dealerCode: dealer.dealerCode,
        dealerName: dealer.dealerName,
        dealerCity: dealer.city,
        vin: rec.vehicle.vin,
        provisionalId: rec.vehicle.provisionalId || rec.listing.sourceListingId,
        model: rec.vehicle.model,
        trim: rec.vehicle.trim,
        powertrain: rec.vehicle.powertrain,
        modelYear: rec.vehicle.modelYear,
        sellingPrice: rec.pricing.advertisedPrice,
        msrp: rec.pricing.msrp,
        vdpUrl: rec.listing.vdpUrl,
        normalizedStatus: rec.listing.normalizedStatus,
        rawStatus: rec.listing.rawStatus,
      });
    }

    dealerSummaries.push({
      dealerName: dealer.dealerName,
      dealerCode: dealer.dealerCode,
      sourceMode,
      pagesFetched,
      totalSwept: parsed.count,
      quarantined: parsed.quarantined.length,
      incomingInTransit: incomingCount,
      advertisedAvailable: advertisedOnLotCount,
      reservedOrPresold: reservedSoldCount,
      durationMs: Date.now() - startMs,
    });

    console.log(
      `[${dealer.dealerName}] Pages(pc=100): ${pagesFetched} | Valid Swept: ${parsed.count} | Incoming/Transit: ${incomingCount} | Advertised/Unreserved: ${advertisedOnLotCount} | Reserved/Presold: ${reservedSoldCount}`
    );

    if (i < REGISTERED_DEALERS.length - 1) {
      await new Promise((r) => setTimeout(r, POLITE_DEALER_COOLDOWN_MS));
    }
  }

  // Compare against existing dealer_listings + vehicles in Supabase to see net-new vs existing unreserved allocations
  const { data: existingDbListings } = await supabase
    .from('dealer_listings')
    .select('source_listing_id, current_status, lifecycle_status, vehicles(vin, provisional_id)');

  const existingKeys = new Set<string>();
  for (const row of existingDbListings || []) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = row as any;
    if (r.source_listing_id) existingKeys.add(String(r.source_listing_id));
    const v = Array.isArray(r.vehicles) ? r.vehicles[0] : r.vehicles;
    if (v?.vin) existingKeys.add(String(v.vin));
    if (v?.provisional_id) existingKeys.add(String(v.provisional_id));
  }

  const unreservedVehicles = allParsedVehicles.filter(
    (v) => v.normalizedStatus !== NormalizedListingStatus.RESERVED_SOLD
  );
  const netNewUnreservedVehicles = unreservedVehicles.filter(
    (v) => !existingKeys.has(String(v.vin || '')) && !existingKeys.has(String(v.provisionalId || ''))
  );

  console.log('\n================================================================================');
  console.log('2. SUBSCRIBER VERIFICATION & DROP ALERT MATCHING AUDIT (DRY-RUN)');
  console.log('================================================================================');
  const { data: allSubs } = await supabase
    .from('inventory_alert_subscriptions')
    .select('*')
    .order('created_at', { ascending: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eligibleSubs = (allSubs || []).filter((s: any) => {
    return s.is_active === true && s.is_verified === true && new Date(s.expires_at) > new Date();
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const excludedSubs = (allSubs || []).filter((s: any) => {
    return !(s.is_active === true && s.is_verified === true && new Date(s.expires_at) > new Date());
  });

  console.log('Total Subscriptions in DB:           ', (allSubs || []).length);
  console.log('Eligible (Active + Verified + <30d): ', eligibleSubs.length);
  console.log('Excluded (Unverified or Expired):    ', excludedSubs.length);
  for (const ex of excludedSubs) {
    console.log(
      `  -> Excluded Subscriber: ${ex.email} | model: ${ex.model} | is_verified: ${ex.is_verified} | expires_at: ${ex.expires_at}`
    );
  }

  console.log('\n--- Running Dry-Run Alert Matcher Across Unreserved Allocations ---');
  const origLog = console.log;
  console.log = (...args: unknown[]) => {
    const first = String(args[0] || '');
    if (first.startsWith('[Alert Worker] Active verified') || first.startsWith('[Alert Worker] Found 0')) {
      return;
    }
    if (first.startsWith('[Alert Worker] Alert dispatch payload:')) {
      return;
    }
    origLog(...args);
  };

  const dispatchSummary = await dispatchPendingAlerts(unreservedVehicles, {
    supabaseClient: supabase,
    dryRun: true,
  });

  origLog('\n--- Testing Duplicate VIN Re-Dispatch Guard (Second Pass with Same VINs) ---');
  const mockSupabaseWithDispatched = {
    from: (table: string) => {
      if (table === 'inventory_alert_subscriptions') {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({
                gt: async () => ({ data: eligibleSubs, error: null }),
              }),
            }),
          }),
        };
      }
      if (table === 'inventory_alert_dispatches') {
        return {
          select: () => ({
            eq: (_col1: string, emailVal: string) => ({
              eq: (_col2: string, vinVal: string) => ({
                maybeSingle: async () => {
                  const found = dispatchSummary.loggedPayloads.some(
                    (p) => p.email === emailVal && p.vin === vinVal
                  );
                  return { data: found ? { id: 'existing-dispatch-id' } : null, error: null };
                },
              }),
            }),
          }),
        };
      }
      return {};
    },
  };

  const secondPassSummary = await dispatchPendingAlerts(unreservedVehicles, {
    supabaseClient: mockSupabaseWithDispatched,
    dryRun: true,
  });
  console.log = origLog;

  console.log('\n================================================================================');
  console.log('3. FINAL STRUCTURED SUMMARY');
  console.log('================================================================================');
  console.log(
    JSON.stringify(
      {
        totalVehiclesSwept: allParsedVehicles.length,
        totalUnreservedAllocations: unreservedVehicles.length,
        netNewUnreservedAllocationsSinceLastSweep: netNewUnreservedVehicles.length,
        activeVerifiedSubscriptions: eligibleSubs.length,
        excludedUnverifiedOrExpiredSubscriptions: excludedSubs.length,
        matchedActiveSubscriberAlerts: dispatchSummary.subscribersMatched,
        emailsSentInDryRun: dispatchSummary.emailsSent,
        secondPassMatchedAlerts: secondPassSummary.subscribersMatched,
        secondPassDuplicatesSkipped: secondPassSummary.duplicatesSkipped,
        dealerBreakdown: dealerSummaries,
        sampleSimulatedPayloads: dispatchSummary.loggedPayloads.slice(0, 5),
      },
      null,
      2
    )
  );
  process.exit(0);
}

runAudit().catch((e) => {
  console.error(e);
  process.exit(1);
});
