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
      },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
      }
    );
  }

  // Fast Database Reconcile Only (decoupled from multi-dealer scraping loop)
  let alertVehicles: AlertDispatchVehicle[] = [];

  if (isConfigured && supabase) {
    try {
      const { data: listings } = await supabase
        .from('dealer_listings')
        .select(`
          vin,
          source_listing_id,
          selling_price,
          listing_url,
          vehicle:vehicles (model, trim, powertrain, model_year),
          dealer:dealers (name, city)
        `)
        .eq('lifecycle_status', 'active')
        .order('last_observed_at', { ascending: false })
        .limit(50);

      if (listings && Array.isArray(listings)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        alertVehicles = listings.map((l: any) => ({
          vin: l.vin,
          provisionalId: l.source_listing_id,
          model: l.vehicle?.model || '',
          trim: l.vehicle?.trim || 'Base',
          powertrain: l.vehicle?.powertrain || null,
          modelYear: l.vehicle?.model_year || undefined,
          dealerName: l.dealer?.name || undefined,
          dealerCity: l.dealer?.city || undefined,
          vdpUrl: l.listing_url || undefined,
          sellingPrice: l.selling_price || undefined,
        })).filter((v: AlertDispatchVehicle) => Boolean(v.model));
      }
    } catch (dbErr) {
      console.warn('[check-alerts] Failed querying active listings for reconcile:', dbErr);
    }
  }

  const alertSummary = await dispatchPendingAlerts(alertVehicles, {
    supabaseClient: supabase,
    dryRun,
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
