/**
 * lib/discovery/services/staleness-service.ts
 *
 * Sweep Staleness Evaluator for ToyotaWaits.ca Master Plan V3.2
 * Sprint 3: Ingestion Pipeline & Staleness Safeguards
 *
 * Staleness Safeguard (Master Plan V3.2 Page 3 & Appendix A):
 * - Never mark a listing as removed or stale from a single partial/failed sweep.
 * - A listing is transitioned to 'No longer observed / stale' only after TWO consecutive
 *   verified sweeps that miss the vehicle.
 */

import { createServerClient } from '../../../src/lib/supabase/server';
import { NormalizedListingStatus } from '../types';

export interface EvaluateStalenessParams {
  dealerId: string;
  activeSourceListingIdsInSweep: Set<string> | string[];
  sweepTimestamp?: string;
  supabaseClient?: any;
}

export interface StalenessSummary {
  totalActiveEvaluated: number;
  missedOnceCount: number;
  staleTransitionsCount: number;
  stillActiveCount: number;
  statusEventsLogged: number;
  errors: string[];
}

/**
 * Evaluates active listings against a completed sweep to enforce the 2-sweep staleness safeguard.
 */
export async function evaluateSweepStaleness(
  params: EvaluateStalenessParams
): Promise<StalenessSummary> {
  const {
    dealerId,
    activeSourceListingIdsInSweep,
    sweepTimestamp = new Date().toISOString(),
    supabaseClient,
  } = params;

  const supabase = supabaseClient || createServerClient();

  const activeSet =
    activeSourceListingIdsInSweep instanceof Set
      ? activeSourceListingIdsInSweep
      : new Set(activeSourceListingIdsInSweep);

  const summary: StalenessSummary = {
    totalActiveEvaluated: 0,
    missedOnceCount: 0,
    staleTransitionsCount: 0,
    stillActiveCount: 0,
    statusEventsLogged: 0,
    errors: [],
  };

  try {
    // Select all dealer listings that are not already marked 'No longer observed / stale'
    const { data: listings, error: fetchError } = await supabase
      .from('dealer_listings')
      .select('id, source_listing_id, current_status, consecutive_missed_sweeps')
      .eq('dealer_id', dealerId)
      .neq('current_status', NormalizedListingStatus.NO_LONGER_OBSERVED)
      .neq('current_status', 'No longer observed');

    if (fetchError) {
      throw new Error(`Failed to fetch active dealer listings: ${fetchError.message}`);
    }

    if (!listings || listings.length === 0) {
      return summary;
    }

    summary.totalActiveEvaluated = listings.length;

    for (const listing of listings) {
      const isPresentInSweep = activeSet.has(listing.source_listing_id);

      if (isPresentInSweep) {
        // Vehicle was observed in this sweep
        summary.stillActiveCount++;
        if ((listing.consecutive_missed_sweeps || 0) > 0) {
          const { error: resetError } = await supabase
            .from('dealer_listings')
            .update({
              consecutive_missed_sweeps: 0,
              last_successful_check: sweepTimestamp,
              updated_at: sweepTimestamp,
            })
            .eq('id', listing.id);

          if (resetError) {
            summary.errors.push(
              `Failed to reset missed sweeps for listing ${listing.id}: ${resetError.message}`
            );
          }
        }
      } else {
        // Vehicle was missed in this sweep
        const newMissCount = (listing.consecutive_missed_sweeps || 0) + 1;

        if (newMissCount >= 2) {
          // 2-SWEEP RULE SATISFIED: Transition to 'No longer observed / stale'
          const previousStatus = listing.current_status as NormalizedListingStatus;
          const newStatus = NormalizedListingStatus.NO_LONGER_OBSERVED;

          // 1. Log transition event
          const { error: eventError } = await supabase.from('status_events').insert({
            dealer_listing_id: listing.id,
            observation_id: null,
            previous_status: previousStatus,
            new_status: newStatus,
            transition_reason: `Listing missing across 2 consecutive verified sweeps (miss_count=${newMissCount})`,
            evidence_payload: {
              consecutive_missed_sweeps: newMissCount,
              source_listing_id: listing.source_listing_id,
            },
            event_timestamp: sweepTimestamp,
            created_at: sweepTimestamp,
          });

          if (eventError) {
            summary.errors.push(
              `Failed to log status event for stale listing ${listing.id}: ${eventError.message}`
            );
          } else {
            summary.statusEventsLogged++;
          }

          // 2. Update listing status
          const { error: updateError } = await supabase
            .from('dealer_listings')
            .update({
              current_status: newStatus,
              consecutive_missed_sweeps: newMissCount,
              last_successful_check: sweepTimestamp,
              updated_at: sweepTimestamp,
            })
            .eq('id', listing.id);

          if (updateError) {
            summary.errors.push(
              `Failed to transition listing ${listing.id} to stale: ${updateError.message}`
            );
          } else {
            summary.staleTransitionsCount++;
          }
        } else {
          // SAFEGUARD APPLIED: Only 1 sweep missed; do NOT transition to stale
          const { error: updateError } = await supabase
            .from('dealer_listings')
            .update({
              consecutive_missed_sweeps: newMissCount,
              last_successful_check: sweepTimestamp,
              updated_at: sweepTimestamp,
            })
            .eq('id', listing.id);

          if (updateError) {
            summary.errors.push(
              `Failed to increment missed sweeps count for listing ${listing.id}: ${updateError.message}`
            );
          } else {
            summary.missedOnceCount++;
          }
        }
      }
    }
  } catch (err: any) {
    summary.errors.push(err?.message || String(err));
  }

  return summary;
}
