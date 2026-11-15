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

const DROUGHT_ALERT_COOLDOWN_MS = 24 * 60 * 60 * 1000;
let lastDroughtAlertSentAt = 0;

export function _resetDroughtAlertCooldown() {
  lastDroughtAlertSentAt = 0;
}

async function evaluateSubmissionDrought(
  supabase: any,
  dryRun: boolean
): Promise<{
  lastSubmissionAt: string | null;
  hoursSinceLastSubmission: number | null;
  droughtAlertTriggered: boolean;
}> {
  let lastSubmissionAt: string | null = null;
  let hoursSinceLastSubmission: number | null = null;
  let droughtAlertTriggered = false;

  if (supabase) {
    try {
      const { data: rows, error } = await supabase
        .from('submissions')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1);

      if (!error && Array.isArray(rows) && rows.length > 0 && rows[0]?.created_at) {
        lastSubmissionAt = String(rows[0].created_at);
        const createdMs = new Date(lastSubmissionAt).getTime();
        if (!isNaN(createdMs)) {
          hoursSinceLastSubmission =
            Math.round(((Date.now() - createdMs) / (1000 * 60 * 60)) * 10) / 10;
        }
      }
    } catch (err) {
      console.warn('[check-alerts] Failed querying latest submission timestamp:', err);
    }
  }

  if (
    hoursSinceLastSubmission !== null &&
    hoursSinceLastSubmission > 48 &&
    process.env.RESEND_API_KEY &&
    !dryRun &&
    Date.now() - lastDroughtAlertSentAt >= DROUGHT_ALERT_COOLDOWN_MS
  ) {
    lastDroughtAlertSentAt = Date.now();
    droughtAlertTriggered = true;
    const fromAddress =
      process.env.RESEND_FROM_EMAIL || 'ToyotaWaits Alerts <hello@toyotawaits.ca>';

    Promise.resolve(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: 'danielrubin76@gmail.com',
          subject: `[WARNING] Zero ToyotaWaits Submissions in ${hoursSinceLastSubmission}h (48h+ Drought)`,
          text: [
            `Zero community wait-time submissions have been recorded on ToyotaWaits in ${hoursSinceLastSubmission} hours.`,
            `Last submission timestamp: ${lastSubmissionAt}`,
            `Checked at: ${new Date().toISOString()}`,
            `Action: Verify POST /api/submissions and run npx tsx scripts/canary-submissions.ts.`,
          ].join('\n'),
        }),
        signal: AbortSignal.timeout(8000),
      })
    ).catch((emailErr) => {
      console.warn('[check-alerts] Drought alert email dispatch failed:', emailErr);
    });
  }

  return { lastSubmissionAt, hoursSinceLastSubmission, droughtAlertTriggered };
}

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
  const droughtStats = await evaluateSubmissionDrought(supabase, dryRun);

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
        lastSubmissionAt: droughtStats.lastSubmissionAt,
        hoursSinceLastSubmission: droughtStats.hoursSinceLastSubmission,
        diagnostics: {
          rawListingsQueried: result.totalParsed,
          candidatesEvaluated: result.unreservedVehicles?.length ?? 0,
          subscribersFound: alertSummary.subscribersMatched,
          lastSubmissionAt: droughtStats.lastSubmissionAt,
          hoursSinceLastSubmission: droughtStats.hoursSinceLastSubmission,
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
      lastSubmissionAt: droughtStats.lastSubmissionAt,
      hoursSinceLastSubmission: droughtStats.hoursSinceLastSubmission,
      diagnostics: {
        rawListingsQueried,
        candidatesEvaluated: alertVehicles.length,
        subscribersFound: alertSummary.subscribersMatched,
        lastSubmissionAt: droughtStats.lastSubmissionAt,
        hoursSinceLastSubmission: droughtStats.hoursSinceLastSubmission,
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
