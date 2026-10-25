/**
 * lib/discovery/services/lifecycle-service.ts
 *
 * Cancellation & Velocity Logic + Sold Unit Lifecycle & Alert Dispatch Service
 *
 * Responsibilities:
 * 1. Calculate `days_on_lot`: difference in days between NOW() (or sweep timestamp)
 *    and `posted_at` (or `first_seen_at` / `first_observed_at`).
 * 2. Flag `is_likely_cancellation = true` when a unit is on the lot (`status === 'on_lot'`
 *    or arrival confirmed) AND `days_on_lot >= 5`.
 * 3. Sold Unit Detection: After an `--all` sweep completes, inspect active database
 *    listings/VINs for swept dealers that were NOT observed during the run and transition
 *    them to `lifecycle_status = 'sold'`, `sold_at = now()`.
 * 4. Allocation Drop Alert Dispatch (`dispatchPendingAlerts`): Query active subscribers in
 *    `inventory_alert_subscriptions` matching newly inserted VINs and send or log notifications.
 */

import { createServerClient } from '../../../src/lib/supabase/server';
import { NormalizedListingStatus } from '../types';

export const LIKELY_CANCELLATION_DAYS_THRESHOLD = 5;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export type LifecycleStatus = 'active' | 'sold' | 'unlisted';

export interface EvaluateLifecycleParams {
  status?: string | null;
  postedAt?: string | Date | null;
  firstSeenAt?: string | Date | null;
  existingDaysOnLot?: number | null;
  now?: string | Date;
}

export interface LifecycleEvaluationResult {
  daysOnLot: number;
  isLikelyCancellation: boolean;
  lifecycleStatus: LifecycleStatus;
}

export interface SoldTransitionParams {
  sweptDealerIds: string[];
  sweepStartTime: string | Date;
  observedSourceListingIds?: Set<string> | string[];
  observedVins?: Set<string> | string[];
  supabaseClient?: any;
  db?: any;
  now?: string | Date;
}

export interface SoldTransitionSummary {
  evaluatedCount: number;
  transitionedToSoldCount: number;
  soldListingIds: string[];
  soldVins: string[];
  errors: string[];
}

export interface AlertDispatchVehicle {
  vin?: string | null;
  provisionalId?: string | null;
  model: string;
  trim?: string | null;
  powertrain?: string | null;
  modelYear?: number;
  dealerId?: string;
  dealerName?: string;
  dealerCity?: string;
  vdpUrl?: string | null;
  sellingPrice?: number | null;
  msrp?: number | null;
}

export interface DispatchPendingAlertsOptions {
  supabaseClient?: any;
  db?: any;
  resendApiKey?: string;
  fetcher?: typeof fetch;
}

export interface DispatchPendingAlertsSummary {
  vehiclesEvaluated: number;
  subscribersMatched: number;
  emailsSent: number;
  loggedPayloads: Array<Record<string, any>>;
}

/**
 * Calculates the integer number of days a vehicle has been on the lot
 * based on the difference between `now` and `posted_at` (or `first_seen_at`).
 */
export function calculateDaysOnLot(
  postedAtOrFirstSeen?: string | Date | null,
  now: string | Date = new Date()
): number {
  if (!postedAtOrFirstSeen) return 0;

  const startMs =
    postedAtOrFirstSeen instanceof Date
      ? postedAtOrFirstSeen.getTime()
      : new Date(postedAtOrFirstSeen).getTime();
  const nowMs = now instanceof Date ? now.getTime() : new Date(now).getTime();

  if (isNaN(startMs) || isNaN(nowMs)) {
    return 0;
  }

  const diffMs = nowMs - startMs;
  if (diffMs <= 0) return 0;

  return Math.floor(diffMs / MS_PER_DAY);
}

/**
 * Determines whether a raw or normalized listing status represents an arrived
 * "on lot" unit (as opposed to in-transit/incoming, sold, or stale).
 */
export function isOnLotStatus(status?: string | null): boolean {
  if (!status) return false;
  const normalized = status.trim();
  const lower = normalized.toLowerCase();

  // Exclude incoming / in-transit / sold / stale / unlisted states
  if (
    lower.includes('incoming') ||
    lower.includes('transit') ||
    lower.includes('on_order') ||
    lower.includes('on order') ||
    lower.includes('sold') ||
    lower.includes('reserved') ||
    lower.includes('stale') ||
    lower.includes('no longer') ||
    lower.includes('removed') ||
    lower.includes('unlisted') ||
    lower.includes('quarantined')
  ) {
    return false;
  }

  if (
    normalized === NormalizedListingStatus.ADVERTISED_UNCONFIRMED ||
    lower === 'on_lot' ||
    lower === 'on lot' ||
    lower === 'in_stock' ||
    lower === 'in stock' ||
    lower === 'available' ||
    lower === 'active' ||
    lower.includes('advertised') ||
    lower.includes('on_lot') ||
    lower.includes('on lot')
  ) {
    return true;
  }

  return false;
}

/**
 * Evaluates `days_on_lot`, `is_likely_cancellation`, and `lifecycle_status`
 * for a vehicle listing during ingestion or display.
 */
export function evaluateListingLifecycle(
  params: EvaluateLifecycleParams
): LifecycleEvaluationResult {
  const {
    status,
    postedAt,
    firstSeenAt,
    existingDaysOnLot,
    now = new Date(),
  } = params;

  const referenceDate = postedAt || firstSeenAt;
  const calculatedDays = calculateDaysOnLot(referenceDate, now);

  // Use calculated days from timestamp difference when > 0; otherwise preserve feed-reported daysOnLot if positive
  const daysOnLot =
    calculatedDays > 0
      ? calculatedDays
      : Math.max(0, typeof existingDaysOnLot === 'number' ? existingDaysOnLot : 0);

  const onLot = isOnLotStatus(status);
  const isLikelyCancellation = onLot && daysOnLot >= LIKELY_CANCELLATION_DAYS_THRESHOLD;

  const lowerStatus = (status || '').toLowerCase();
  let lifecycleStatus: LifecycleStatus = 'active';
  if (lowerStatus === 'sold' || lowerStatus.includes('reserved / sold')) {
    lifecycleStatus = 'sold';
  } else if (
    lowerStatus === 'unlisted' ||
    lowerStatus === 'removed' ||
    lowerStatus === 'stale' ||
    lowerStatus.includes('no longer observed')
  ) {
    lifecycleStatus = 'unlisted';
  }

  return {
    daysOnLot,
    isLikelyCancellation,
    lifecycleStatus,
  };
}

/**
 * Sold Unit Detection:
 * After an `--all` sweep completes, inspects active database listings for swept dealers
 * that were NOT observed during the run (`last_observed_at < sweep_start_time`) and transitions
 * them to `lifecycle_status = 'sold'`, `sold_at = now()`.
 */
export async function detectAndTransitionSoldUnits(
  params: SoldTransitionParams
): Promise<SoldTransitionSummary> {
  const {
    sweptDealerIds,
    sweepStartTime,
    observedSourceListingIds,
    observedVins,
    supabaseClient,
    db,
    now = new Date(),
  } = params;

  const summary: SoldTransitionSummary = {
    evaluatedCount: 0,
    transitionedToSoldCount: 0,
    soldListingIds: [],
    soldVins: [],
    errors: [],
  };

  if (!sweptDealerIds || sweptDealerIds.length === 0) {
    return summary;
  }

  const supabase = supabaseClient || db || createServerClient();
  const sweepStartIso =
    sweepStartTime instanceof Date
      ? sweepStartTime.toISOString()
      : new Date(sweepStartTime).toISOString();
  const sweepStartMs = new Date(sweepStartIso).getTime();
  const nowIso = now instanceof Date ? now.toISOString() : new Date(now).toISOString();

  const observedIdsSet =
    observedSourceListingIds instanceof Set
      ? observedSourceListingIds
      : observedSourceListingIds
      ? new Set(observedSourceListingIds)
      : null;

  const observedVinsSet =
    observedVins instanceof Set
      ? observedVins
      : observedVins
      ? new Set(observedVins)
      : null;

  const sweptDealerSet = new Set(sweptDealerIds);

  // Support both canonical `dealer_listings` and alias `discovery_listings` if present in mock/DB
  const targetTables = ['dealer_listings'];
  if (supabase?.tables && Array.isArray(supabase.tables.discovery_listings)) {
    targetTables.push('discovery_listings');
  }

  for (const tableName of targetTables) {
    try {
      let query: any = supabase
        .from(tableName)
        .select(
          'id, dealer_id, vehicle_id, source_listing_id, vin, current_status, lifecycle_status, last_observed_at'
        );

      if (typeof query.in === 'function') {
        query = query.in('dealer_id', sweptDealerIds);
      }

      const { data: rows, error: fetchError } = await query;

      if (fetchError) {
        summary.errors.push(`Failed querying ${tableName} for sold detection: ${fetchError.message}`);
        continue;
      }

      const candidates = (rows || []).filter((row: any) => {
        if (!sweptDealerSet.has(row.dealer_id)) return false;

        // Only inspect active units
        const lcStatus = (row.lifecycle_status || 'active').toLowerCase();
        if (lcStatus === 'sold' || lcStatus === 'unlisted') return false;

        const curStatus = (row.current_status || '').toLowerCase();
        if (curStatus === 'removed' || curStatus === 'Reserved / sold'.toLowerCase()) return false;

        return true;
      });

      summary.evaluatedCount += candidates.length;

      for (const candidate of candidates) {
        const lastObsMs = candidate.last_observed_at
          ? new Date(candidate.last_observed_at).getTime()
          : 0;

        const isOlderThanSweepStart = !isNaN(lastObsMs) && lastObsMs < sweepStartMs;
        const missedByListingId =
          observedIdsSet && candidate.source_listing_id
            ? !observedIdsSet.has(candidate.source_listing_id)
            : false;
        const missedByVin =
          observedVinsSet && candidate.vin ? !observedVinsSet.has(candidate.vin) : false;

        if (isOlderThanSweepStart || missedByListingId || missedByVin) {
          const { error: updateError } = await supabase
            .from(tableName)
            .update({
              lifecycle_status: 'sold',
              sold_at: nowIso,
              is_likely_cancellation: false,
              updated_at: nowIso,
            })
            .eq('id', candidate.id);

          if (updateError) {
            summary.errors.push(
              `Failed transitioning listing ${candidate.id} to sold: ${updateError.message}`
            );
          } else {
            summary.transitionedToSoldCount++;
            summary.soldListingIds.push(candidate.id);
            if (candidate.vin) {
              summary.soldVins.push(candidate.vin);
            }
          }
        }
      }
    } catch (err: any) {
      summary.errors.push(err?.message || String(err));
    }
  }

  return summary;
}

/**
 * Dispatches pending inventory drop alerts for newly discovered VINs during a sweep.
 */
export async function dispatchPendingAlerts(
  newlyInsertedVins: AlertDispatchVehicle[] | AlertDispatchVehicle,
  options: DispatchPendingAlertsOptions = {}
): Promise<DispatchPendingAlertsSummary> {
  const items = Array.isArray(newlyInsertedVins)
    ? newlyInsertedVins
    : newlyInsertedVins
    ? [newlyInsertedVins]
    : [];

  const summary: DispatchPendingAlertsSummary = {
    vehiclesEvaluated: items.length,
    subscribersMatched: 0,
    emailsSent: 0,
    loggedPayloads: [],
  };

  if (items.length === 0) {
    return summary;
  }

  const supabase = options.supabaseClient || options.db || createServerClient();
  const resendApiKey = options.resendApiKey ?? process.env.RESEND_API_KEY;
  const fetchFn = options.fetcher || globalThis.fetch;
  const nowIso = new Date().toISOString();

  for (const item of items) {
    const displayVin = item.vin || item.provisionalId || 'PROVISIONAL';
    const displayTrim = item.trim || 'Base';

    let matchingSubs: any[] = [];
    try {
      let query: any = supabase.from('inventory_alert_subscriptions').select('*');
      if (typeof query.eq === 'function') {
        query = query.eq('is_active', true);
      }
      const { data: subs } = await query;

      const itemModelLower = (item.model || '').toLowerCase().trim();
      const itemTrimLower = (item.trim || '').toLowerCase().trim();
      const itemPowertrainLower = (item.powertrain || '').toLowerCase().trim();

      matchingSubs = (subs || []).filter((sub: any) => {
        if (sub.is_active === false) return false;

        const subModel = (sub.model || '').toLowerCase().trim();
        const subTrim = (sub.trim || 'ALL').toLowerCase().trim();
        const subPowertrain = (sub.powertrain || 'ALL').toLowerCase().trim();

        const modelMatches =
          subModel === 'all' ||
          subModel === itemModelLower ||
          itemModelLower.includes(subModel) ||
          subModel.includes(itemModelLower);

        if (!modelMatches) return false;

        if (subTrim && subTrim !== 'all') {
          if (!itemTrimLower.includes(subTrim) && !subTrim.includes(itemTrimLower)) {
            return false;
          }
        }

        if (subPowertrain && subPowertrain !== 'all') {
          if (
            !itemPowertrainLower.includes(subPowertrain) &&
            !itemModelLower.includes(subPowertrain)
          ) {
            return false;
          }
        }

        return true;
      });
    } catch {
      matchingSubs = [];
    }

    console.log(
      `[Alert Worker] Found ${matchingSubs.length} subscribers matching ${displayVin} (${item.model} ${displayTrim})`
    );

    for (const sub of matchingSubs) {
      summary.subscribersMatched++;

      const dispatchPayload = {
        email: sub.email,
        vin: displayVin,
        model: item.model,
        trim: displayTrim,
        dealerName: item.dealerName || 'Lower Mainland Toyota Dealer',
        vdpUrl: item.vdpUrl || 'https://toyotawaits.ca/inventory',
        sellingPrice: item.sellingPrice ?? item.msrp ?? null,
        token: sub.token,
        dispatchedAt: nowIso,
      };

      const hasResendKey = Boolean(
        resendApiKey &&
          resendApiKey.trim() !== '' &&
          !resendApiKey.includes('placeholder') &&
          !resendApiKey.includes('mock-')
      );

      if (hasResendKey && typeof fetchFn === 'function') {
        try {
          const res = await fetchFn('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'ToyotaWaits Alerts <alerts@toyotawaits.ca>',
              to: [sub.email],
              subject: `🔔 New ${item.model} (${displayTrim}) Drop Observed at ${dispatchPayload.dealerName}`,
              html: `<p>A matching <strong>${item.model} ${displayTrim}</strong> (VIN: <code>${displayVin}</code>) was just observed at <strong>${dispatchPayload.dealerName}</strong>.</p><p><a href="${dispatchPayload.vdpUrl}">View Dealer Listing</a></p>`,
            }),
          });
          if (res.ok) {
            summary.emailsSent++;
          }
        } catch (emailErr: any) {
          console.warn(`[Alert Worker] Resend email dispatch failed for ${sub.email}:`, emailErr?.message);
        }
      } else {
        console.log('[Alert Worker] Alert dispatch payload:', JSON.stringify(dispatchPayload));
      }

      summary.loggedPayloads.push(dispatchPayload);

      // Update last_notified_at on subscription
      try {
        if (sub.id) {
          await supabase
            .from('inventory_alert_subscriptions')
            .update({ last_notified_at: nowIso })
            .eq('id', sub.id);
        }
      } catch {
        // Non-fatal update error
      }
    }
  }

  return summary;
}
