import { NextResponse } from 'next/server';
import {
  resolveDealer,
  sweepSingleDealer,
} from '../../../../../lib/discovery/dealers';
import {
  AlertDispatchVehicle,
  DispatchPendingAlertsSummary,
  dispatchPendingAlerts,
} from '../../../../../lib/discovery/services/lifecycle-service';
import { createServerClient, isLiveSupabaseConfigured } from '@/lib/supabase/server';
import { validateCronSecret } from '../sweep/route';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60;

export { validateCronSecret };

export async function handleCheckAlerts(request: Request) {
  const auth = validateCronSecret(request);
  if (!auth.authorized) {
    return new Response(
      JSON.stringify({
        success: false,
        error: `Unauthorized: ${auth.reason}`,
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const startTime = Date.now();
  const url = new URL(request.url);
  const dealerParam = url.searchParams.get('dealer');
  const dryRun = url.searchParams.get('dryRun') === 'true';
  const cooldownParam = url.searchParams.get('cooldown');
  const cooldown =
    cooldownParam !== null && !isNaN(Number(cooldownParam)) ? Number(cooldownParam) : undefined;

  const isConfigured = isLiveSupabaseConfigured();
  const supabase = isConfigured ? createServerClient() : null;

  // Single-dealer sweep mode (safe for HTTP, runs in < 2 seconds)
  if (dealerParam && dealerParam !== 'all') {
    const targetDealer = resolveDealer(dealerParam);
    if (!targetDealer) {
      return NextResponse.json(
        { success: false, error: `Invalid dealer parameter: "${dealerParam}"` },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const result = await sweepSingleDealer(targetDealer, {
      dryRun,
      supabase,
      isServiceKeyConfigured: isConfigured,
    });

    let alertSummary: DispatchPendingAlertsSummary = {
      vehiclesEvaluated: 0,
      subscribersMatched: 0,
      emailsSent: 0,
      duplicatesSkipped: 0,
      loggedPayloads: [],
    };
    if (result.unreservedVehicles && result.unreservedVehicles.length > 0) {
      alertSummary = await dispatchPendingAlerts(result.unreservedVehicles, {
        supabaseClient: supabase,
        dryRun,
        cooldown,
      });
    }

    return NextResponse.json(
      {
        success: true,
        swept: result.totalParsed,
        matches: alertSummary.subscribersMatched,
        dispatched: alertSummary.emailsSent,
        skippedDuplicates: alertSummary.duplicatesSkipped ?? 0,
        dealerSwept: targetDealer.dealerCode,
        durationMs: Date.now() - startTime,
        diagnostics: {
          rawListingsQueried: result.totalParsed,
          candidatesEvaluated: result.unreservedVehicles?.length ?? 0,
          subscribersFound: alertSummary.subscribersMatched,
        },
      },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
      }
    );
  }

  // Fast Database Reconcile Only (decoupled from multi-dealer scraping loop)
  let alertVehicles: AlertDispatchVehicle[] = [];
  let rawListingsQueried = 0;

  if (isConfigured && supabase) {
    try {
      const { data: listings, error: queryError } = await supabase
        .from('dealer_listings')
        .select(`
          *,
          vehicle:vehicles (model, trim, powertrain, model_year, vin, provisional_id),
          dealer:dealers (name, city)
        `)
        .order('last_observed_at', { ascending: false })
        .limit(50);

      if (queryError) {
        console.error('[check-alerts] Supabase listings query error:', queryError);
      }

      if (listings && Array.isArray(listings)) {
        rawListingsQueried = listings.length;
        console.log(`[check-alerts] Raw listings fetched from Supabase: ${listings.length}`);
        alertVehicles = (listings as Array<Record<string, any>>)
          .filter((l) => {
            // Relax strict lifecycle_status: allow active, in_stock, is_active=true, or unflagged active listings
            if (l.lifecycle_status === 'sold' || l.lifecycle_status === 'unlisted') return false;
            if (l.is_active === false) return false;
            const currentStatus = String(l.current_status || l.status || '').toLowerCase();
            if (
              currentStatus.includes('sold') ||
              currentStatus.includes('stale') ||
              currentStatus.includes('no longer')
            ) {
              return false;
            }
            return true;
          })
          .map((l) => ({
            vin: l.vehicle?.vin || l.vin || null,
            provisionalId: l.vehicle?.provisional_id || l.source_listing_id || l.provisionalId || null,
            model: l.vehicle?.model || l.model || '',
            trim: l.vehicle?.trim || l.trim || 'Base',
            powertrain: l.vehicle?.powertrain || l.powertrain || null,
            modelYear: l.vehicle?.model_year || l.model_year || undefined,
            dealerName: l.dealer?.name || l.dealerName || undefined,
            dealerCity: l.dealer?.city || l.dealerCity || undefined,
            vdpUrl: l.listing_url || l.vdp_url || l.vdpUrl || undefined,
            sellingPrice: l.selling_price || l.observations?.[0]?.selling_price || undefined,
          }))
          .filter((v: AlertDispatchVehicle) => Boolean(v.model));
      }
    } catch (dbErr) {
      console.warn('[check-alerts] Failed querying active listings for reconcile:', dbErr);
    }
  }

  const alertSummary = await dispatchPendingAlerts(alertVehicles, {
    supabaseClient: supabase,
    dryRun,
    cooldown,
  });

  return NextResponse.json(
    {
      success: true,
      evaluated: alertVehicles.length,
      matches: alertSummary.subscribersMatched,
      dispatched: alertSummary.emailsSent,
      skippedDuplicates: alertSummary.duplicatesSkipped ?? 0,
      durationMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      diagnostics: {
        rawListingsQueried,
        candidatesEvaluated: alertVehicles.length,
        subscribersFound: alertSummary.subscribersMatched,
      },
    },
    {
      status: 200,
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    }
  );
}

export async function GET(request: Request) {
  return handleCheckAlerts(request);
}

export async function POST(request: Request) {
  return handleCheckAlerts(request);
}
