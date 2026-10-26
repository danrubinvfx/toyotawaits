import { NextRequest, NextResponse } from 'next/server';
import {
  REGISTERED_DEALERS,
  POLITE_DEALER_COOLDOWN_MS,
  sweepSingleDealer,
  resolveDealer,
} from '../../../../../lib/discovery/dealers';
import {
  AlertDispatchVehicle,
  dispatchPendingAlerts,
  detectAndTransitionSoldUnits,
} from '../../../../../lib/discovery/services/lifecycle-service';
import { createServerClient, isLiveSupabaseConfigured } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60;

export function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const cronSecretHeader = request.headers.get('x-cron-secret')?.trim();
  const url = new URL(request.url);
  const queryKey = url.searchParams.get('key')?.trim();
  const expectedSecret = process.env.CRON_SECRET?.trim();

  if (!expectedSecret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[CRON /api/cron/sweep] CRON_SECRET is not configured in production environment.');
      return false;
    }
    // Allow local development and testing when CRON_SECRET is omitted
    return true;
  }

  return Boolean(
    expectedSecret &&
      (token === expectedSecret ||
        queryKey === expectedSecret ||
        cronSecretHeader === expectedSecret)
  );
}

export async function GET(request: Request) {
  return handleSweep(request);
}

export async function POST(request: Request) {
  return handleSweep(request);
}

export async function handleSweep(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Invalid or missing CRON_SECRET.' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const startTime = Date.now();
  const url = new URL(request.url);
  const dealerParam = url.searchParams.get('dealer');
  const dryRun = url.searchParams.get('dryRun') === 'true';
  const customCooldown = url.searchParams.get('cooldown');
  const cooldownMs =
    customCooldown !== null && !isNaN(Number(customCooldown))
      ? Math.max(0, Number(customCooldown))
      : POLITE_DEALER_COOLDOWN_MS;

  const targetDealers = dealerParam && dealerParam !== 'all'
    ? [resolveDealer(dealerParam)].filter((d): d is NonNullable<typeof d> => Boolean(d))
    : REGISTERED_DEALERS;

  if (targetDealers.length === 0) {
    return NextResponse.json(
      { success: false, error: `Invalid dealer parameter: "${dealerParam}"` },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const isConfigured = isLiveSupabaseConfigured();
  const supabase = isConfigured ? createServerClient() : null;

  let totalSwept = 0;
  const allUnreservedVehicles: AlertDispatchVehicle[] = [];
  const dealerResults: Array<{ dealer: string; swept: number; success: boolean }> = [];

  for (let i = 0; i < targetDealers.length; i++) {
    const dealer = targetDealers[i];
    try {
      const result = await sweepSingleDealer(dealer, {
        dryRun,
        supabase,
        isServiceKeyConfigured: isConfigured,
      });

      totalSwept += result.totalParsed;
      if (result.unreservedVehicles && result.unreservedVehicles.length > 0) {
        allUnreservedVehicles.push(...result.unreservedVehicles);
      }
      dealerResults.push({
        dealer: dealer.dealerCode,
        swept: result.totalParsed,
        success: result.success,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      dealerResults.push({
        dealer: dealer.dealerCode,
        swept: 0,
        success: false,
      });
      console.error(`[sweep cron] Error sweeping ${dealer.dealerCode}:`, msg);
    }

    if (i < targetDealers.length - 1 && cooldownMs > 0) {
      await new Promise((r) => setTimeout(r, cooldownMs));
    }
  }

  // Sold Unit Detection after full sweep
  if (targetDealers.length === REGISTERED_DEALERS.length && supabase && !dryRun) {
    try {
      const sweptDealerIds = dealerResults
        .filter((r) => r.success)
        .map((r) => r.dealer);
      await detectAndTransitionSoldUnits({
        sweptDealerIds,
        sweepStartTime: new Date(startTime).toISOString(),
        supabaseClient: supabase,
      });
    } catch (soldErr: unknown) {
      console.warn('[sweep cron] Sold unit transition warning:', soldErr);
    }
  }

  // Dispatch alerts across unreserved allocations
  let totalMatches = 0;
  let totalDispatched = 0;
  let totalSkippedDuplicates = 0;

  if (allUnreservedVehicles.length > 0) {
    const alertSummary = await dispatchPendingAlerts(allUnreservedVehicles, {
      supabaseClient: supabase,
      dryRun,
    });
    totalMatches = alertSummary.subscribersMatched;
    totalDispatched = alertSummary.emailsSent;
    totalSkippedDuplicates = alertSummary.duplicatesSkipped ?? 0;
  }

  return NextResponse.json(
    {
      success: true,
      swept: totalSwept,
      matches: totalMatches,
      dispatched: totalDispatched,
      skippedDuplicates: totalSkippedDuplicates,
      dealersSwept: dealerResults.length,
      durationMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    }
  );
}
