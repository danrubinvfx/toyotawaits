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
import { generateAllocationDropAlertEmail } from '../../../src/lib/alerts/templates';
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabaseClient?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  drivetrain?: string | null;
  engine?: string | null;
  status?: string | null;
  stockNumber?: string | null;
  modelYear?: number;
  dealerId?: string;
  dealerName?: string;
  dealerCity?: string;
  vdpUrl?: string | null;
  sellingPrice?: number | null;
  msrp?: number | null;
}

export interface DispatchPendingAlertsOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabaseClient?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db?: any;
  resendApiKey?: string;
  fetcher?: typeof fetch;
  dryRun?: boolean;
  cooldown?: number | string | null;
  cooldownHours?: number;
}

export interface DispatchPendingAlertsSummary {
  vehiclesEvaluated: number;
  subscribersMatched: number;
  emailsSent: number;
  duplicatesSkipped?: number;
  loggedPayloads: Array<Record<string, unknown>>;
}

function normalizeModelForAlertMatch(rawModel: string, rawPowertrain?: string | null): string {
  const m = (rawModel || '').toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
  const pt = (rawPowertrain || '').toLowerCase().trim();
  if (
    m.includes('rav4 prime') ||
    m.includes('rav4 plug in') ||
    m.includes('rav4 phev') ||
    (m.startsWith('rav4') && (pt.includes('plug') || pt.includes('phev') || pt.includes('prime')))
  ) {
    return 'rav4 plug-in hybrid';
  }
  if (
    m.includes('prius prime') ||
    m.includes('prius plug in') ||
    m.includes('prius phev') ||
    (m.startsWith('prius') && (pt.includes('plug') || pt.includes('phev') || pt.includes('prime')))
  ) {
    return 'prius plug-in hybrid';
  }
  if (!m.includes('hybrid') && pt === 'hybrid' && m !== 'sienna' && m !== 'crown' && m !== 'crown signia' && m !== 'land cruiser' && m !== 'sequoia' && m !== 'prius') {
    return `${m} hybrid`;
  }
  return m;
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    } catch (err: unknown) {
      summary.errors.push(err instanceof Error ? err.message : String(err));
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
    duplicatesSkipped: 0,
    loggedPayloads: [],
  };

  if (items.length === 0) {
    return summary;
  }

  const supabase = options.supabaseClient || options.db || createServerClient();
  const resendApiKey = options.resendApiKey ?? process.env.RESEND_API_KEY;
  const fetchFn = options.fetcher || globalThis.fetch;
  const isDryRun = Boolean(options.dryRun);
  const nowIso = new Date().toISOString();
  const seenEmailVinPairs = new Set<string>();
  const subscriberMatches = new Map<string, { subscriber: any; vehicles: AlertDispatchVehicle[] }>();

  for (const item of items) {
    const displayVin = item.vin || item.provisionalId || 'PROVISIONAL';
    const displayTrim = item.trim || 'Base';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let matchingSubs: any[] = [];
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query: any = supabase.from('inventory_alert_subscriptions').select('*');
      if (typeof query.eq === 'function') {
        query = query.eq('is_active', true);
      }
      if (query && typeof query.eq === 'function') {
        query = query.eq('is_verified', true);
      }
      if (query && typeof query.gt === 'function') {
        query = query.gt('expires_at', nowIso);
      }
      const { data: subs } = await query;

      const itemModelCanonical = normalizeModelForAlertMatch(item.model || '', item.powertrain);
      const itemModelLower = (item.model || '').toLowerCase().trim();
      const itemTrimLower = (item.trim || '').toLowerCase().trim();
      const itemPowertrainLower = (item.powertrain || '').toLowerCase().trim();
      const nowMs = Date.now();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      matchingSubs = (subs || []).filter((sub: any) => {
        if (sub.is_active === false) return false;
        if (sub.is_verified === false) return false;
        if (sub.expires_at) {
          const expMs = new Date(sub.expires_at).getTime();
          if (!isNaN(expMs) && expMs <= nowMs) return false;
        }

        // Subscriber alert cooldown check (24h default / 6h configurable)
        // If cooldown=0 is passed in options, this check is explicitly bypassed for testing
        const isCooldownBypassed = options.cooldown === 0 || options.cooldown === '0';
        if (!isCooldownBypassed && sub.last_notified_at) {
          const lastNotifiedMs = new Date(sub.last_notified_at).getTime();
          if (!isNaN(lastNotifiedMs)) {
            const elapsedMs = nowMs - lastNotifiedMs;
            const cooldownWindowMs =
              typeof options.cooldown === 'number' && options.cooldown > 0
                ? options.cooldown < 1000
                  ? options.cooldown * 60 * 60 * 1000
                  : options.cooldown
                : (options.cooldownHours ?? 24) * 60 * 60 * 1000;
            if (elapsedMs < cooldownWindowMs) {
              return false;
            }
          }
        }

        const subModelCanonical = normalizeModelForAlertMatch(sub.model || '', sub.powertrain);
        const subModel = (sub.model || '').toLowerCase().trim();
        const subTrim = (sub.trim || 'ALL').toLowerCase().trim();
        const subPowertrain = (sub.powertrain || 'ALL').toLowerCase().trim();

        const subRequiresPlugIn =
          subModelCanonical.includes('plug-in') || subModel.includes('prime');
        const subRequiresHybrid =
          !subRequiresPlugIn && subModelCanonical.includes('hybrid');

        let modelMatches = false;
        if (subModel === 'all') {
          modelMatches = true;
        } else if (subRequiresPlugIn) {
          modelMatches = itemModelCanonical === subModelCanonical;
        } else if (subRequiresHybrid) {
          modelMatches =
            itemModelCanonical === subModelCanonical ||
            (itemModelLower.includes(subModel) && !itemModelCanonical.includes('plug-in'));
        } else {
          modelMatches =
            subModelCanonical === itemModelCanonical ||
            subModel === itemModelLower ||
            itemModelLower.startsWith(subModel);
        }

        if (!modelMatches) return false;

        const isAllTrims = !subTrim || subTrim === 'all' || subTrim === 'all trims';
        if (!isAllTrims) {
          if (!itemTrimLower.includes(subTrim) && !subTrim.includes(itemTrimLower)) {
            return false;
          }
        }

        const isAllPowertrains =
          !subPowertrain || subPowertrain === 'all' || subPowertrain === 'all powertrains';
        if (!isAllPowertrains) {
          if (
            !itemPowertrainLower.includes(subPowertrain) &&
            !itemModelLower.includes(subPowertrain) &&
            !itemModelCanonical.includes(subPowertrain)
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
      `[Alert Worker] Active verified candidates for ${item.model}: ${matchingSubs.length}.`
    );
    console.log(
      `[Alert Worker] Found ${matchingSubs.length} subscribers matching ${displayVin} (${item.model} ${displayTrim})`
    );

    for (const sub of matchingSubs) {
      const dedupKey = `${String(sub.email).toLowerCase()}::${displayVin}`;
      let alreadyDispatched = seenEmailVinPairs.has(dedupKey);

      if (!alreadyDispatched && supabase && typeof supabase.from === 'function') {
        try {
          const dispatchTable = supabase.from('inventory_alert_dispatches');
          if (dispatchTable && typeof dispatchTable.select === 'function') {
            let dQuery = dispatchTable.select('id');
            if (typeof dQuery.eq === 'function') {
              dQuery = dQuery.eq('email', sub.email).eq('vin', displayVin);
              const { data: existingRows } =
                typeof dQuery.maybeSingle === 'function'
                  ? await dQuery.maybeSingle()
                  : await dQuery;
              if (
                (Array.isArray(existingRows) && existingRows.length > 0) ||
                (existingRows && !Array.isArray(existingRows) && existingRows.id)
              ) {
                alreadyDispatched = true;
              }
            }
          }
        } catch {
          // Table might not be mocked in unit tests; proceed with in-memory dedup
        }
      }

      if (alreadyDispatched) {
        summary.duplicatesSkipped = (summary.duplicatesSkipped || 0) + 1;
        console.log(
          `[Alert Match] VIN: ${displayVin} | Model: ${item.model} | Recipient: ${sub.email} | Status: SKIPPED_DUPLICATE`
        );
        continue;
      }

      seenEmailVinPairs.add(dedupKey);
      summary.subscribersMatched++;

      console.log(
        `[Alert Match] VIN: ${displayVin} | Model: ${item.model} | Recipient: ${sub.email} | Status: ELIGIBLE`
      );

      const emailKey = String(sub.email).toLowerCase();
      if (!subscriberMatches.has(emailKey)) {
        subscriberMatches.set(emailKey, { subscriber: sub, vehicles: [] });
      }
      subscriberMatches.get(emailKey)!.vehicles.push(item);
    }
  }

  // Dispatch consolidated batch digests per subscriber
  for (const { subscriber: sub, vehicles: matchedVehicles } of subscriberMatches.values()) {
    if (matchedVehicles.length === 0) continue;

    const unsubToken = sub.verification_token || sub.token || '';
    const unsubscribeUrl = `https://www.toyotawaits.ca/api/alerts/verify?token=${encodeURIComponent(
      unsubToken
    )}&action=unsubscribe`;
    const fromSender =
      process.env.RESEND_FROM_EMAIL?.trim() || 'ToyotaWaits.ca <hello@toyotawaits.ca>';

    const firstVehicle = matchedVehicles[0];
    const displayVin = firstVehicle.vin || firstVehicle.provisionalId || 'PROVISIONAL';
    const displayTrim = firstVehicle.trim || 'Base';
    const dealerName = firstVehicle.dealerName || 'Lower Mainland Toyota Dealer';
    const vdpUrl = firstVehicle.vdpUrl || 'https://www.toyotawaits.ca/inventory';

    const emailMessage = generateAllocationDropAlertEmail({
      recipientEmail: sub.email,
      vehicles: matchedVehicles,
      model: firstVehicle.model,
      trim: displayTrim,
      powertrain: firstVehicle.powertrain,
      drivetrain: firstVehicle.drivetrain,
      engine: firstVehicle.engine,
      status: firstVehicle.status,
      stockNumber: firstVehicle.stockNumber,
      modelYear: firstVehicle.modelYear,
      vin: displayVin,
      dealerName,
      dealerCity: firstVehicle.dealerCity,
      vdpUrl,
      sellingPrice: firstVehicle.sellingPrice,
      msrp: firstVehicle.msrp,
      unsubscribeToken: unsubToken,
      unsubscribeUrl,
    });

    let providerMessageId: string | null = null;
    const hasResendKey = Boolean(
      resendApiKey &&
        resendApiKey.trim() !== '' &&
        !resendApiKey.includes('placeholder') &&
        !resendApiKey.includes('mock-')
    );

    if (!isDryRun && hasResendKey && typeof fetchFn === 'function') {
      try {
        const res = await fetchFn('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromSender,
            to: [sub.email],
            subject: emailMessage.subject,
            html: emailMessage.html,
            text: emailMessage.text,
            headers: emailMessage.headers,
          }),
        });
        if (res.ok) {
          summary.emailsSent++;
          try {
            const resJson = await res.json();
            if (resJson && typeof resJson === 'object' && resJson.id) {
              providerMessageId = String(resJson.id);
            }
          } catch {
            // Optional json parse
          }
        }
      } catch (emailErr: unknown) {
        const msg = emailErr instanceof Error ? emailErr.message : String(emailErr);
        console.warn(`[Alert Worker] Resend email dispatch failed for ${sub.email}:`, msg);
      }
    }

    const dispatchPayload = {
      from: fromSender,
      email: sub.email,
      vin: displayVin,
      model: firstVehicle.model,
      trim: displayTrim,
      dealerName,
      vdpUrl,
      sellingPrice: firstVehicle.sellingPrice ?? firstVehicle.msrp ?? null,
      subject: emailMessage.subject,
      vehicles: matchedVehicles.map((v) => ({
        vin: v.vin || v.provisionalId || 'PROVISIONAL',
        model: v.model,
        trim: v.trim || 'Base',
        dealerName: v.dealerName || dealerName,
        vdpUrl: v.vdpUrl || vdpUrl,
        sellingPrice: v.sellingPrice ?? v.msrp ?? null,
        stockNumber: v.stockNumber || null,
        status: v.status || null,
      })),
      calculatorUrl: emailMessage.calculatorUrl,
      guideUrl: emailMessage.guideUrl,
      gearPicks: emailMessage.gearPicks,
      token: sub.token || sub.verification_token,
      dispatchedAt: nowIso,
      dryRun: isDryRun,
      providerMessageId,
    };

    if (isDryRun || !hasResendKey) {
      console.log('[Alert Worker] Alert dispatch payload:', JSON.stringify(dispatchPayload));
    }

    summary.loggedPayloads.push(dispatchPayload);

    if (!isDryRun) {
      // Record in inventory_alert_dispatches for EACH individual VIN notified in the digest
      for (const v of matchedVehicles) {
        const vVin = v.vin || v.provisionalId || 'PROVISIONAL';
        const vTrim = v.trim || 'Base';
        const vDealerName = v.dealerName || dealerName;

        try {
          const dispatchTable = supabase.from('inventory_alert_dispatches');
          if (dispatchTable && typeof dispatchTable.upsert === 'function') {
            await dispatchTable.upsert(
              {
                subscription_id: sub.id || null,
                email: sub.email,
                vin: vVin,
                model: v.model,
                trim: vTrim,
                dealer_name: vDealerName,
                provider_message_id: providerMessageId,
                dispatched_at: nowIso,
              },
              { onConflict: 'email,vin' }
            );
          }
        } catch {
          // Non-fatal in mock test environments
        }
      }

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
