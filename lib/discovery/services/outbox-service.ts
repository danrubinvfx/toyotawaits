/**
 * lib/discovery/services/outbox-service.ts
 *
 * Sprint 4: Transactional Outbox Enqueue Service
 * Master Plan V3.2 Page 4, Appendices A4, A5, A6:
 * - Deterministic delivery keys: recipient + channel + saved_search_id + listing_id + event_id
 * - Atomic deduplication: Unique constraints prevent duplicate alert queuing
 * - Sold / Stale gating: Skips 'Reserved / sold' and 'No longer observed / stale' unless search explicitly requests sold transitions
 */

import {
  AlertOutboxItem,
  Dealer,
  DealerListing,
  ListingObservation,
  NormalizedListingStatus,
  SavedSearch,
  StatusEvent,
  VehicleRecord,
} from '../types';

export interface GenerateDeliveryKeyParams {
  recipient: string;
  channel?: string;
  savedSearchId: string;
  listingId: string;
  eventId: string;
}

/**
 * Generates a deterministic delivery key per Master Plan V3.2 Appendix A5.
 * Format: recipient + channel + saved_search_id + listing_id + event_id
 */
export function generateDeliveryKey({
  recipient,
  channel = 'email',
  savedSearchId,
  listingId,
  eventId,
}: GenerateDeliveryKeyParams): string {
  const normRecipient = recipient.toLowerCase().trim();
  const normChannel = channel.toLowerCase().trim();
  return `${normRecipient}:${normChannel}:${savedSearchId}:${listingId}:${eventId}`;
}

export interface EnqueueEligibleAlertsParams {
  statusEvent: StatusEvent;
  listing: DealerListing;
  matchedSearches: SavedSearch[];
  tx?: any; // SupabaseClient or transaction runner
  vehicle?: Partial<VehicleRecord> | null;
  dealer?: Partial<Dealer> | null;
  observation?: Partial<ListingObservation> | null;
}

/**
 * Checks whether a listing status is a terminal / non-available state.
 */
function isSoldOrStaleStatus(status: string): boolean {
  return (
    status === NormalizedListingStatus.RESERVED_SOLD ||
    status === NormalizedListingStatus.NO_LONGER_OBSERVED ||
    status === 'Reserved / sold' ||
    status === 'No longer observed / stale' ||
    status === 'No longer observed'
  );
}

/**
 * Enqueues eligible alert notifications to the transactional outbox.
 * Enforces sold-state preferences and unique delivery keys.
 */
export async function enqueueEligibleAlerts({
  statusEvent,
  listing,
  matchedSearches,
  tx,
  vehicle,
  dealer,
  observation,
}: EnqueueEligibleAlertsParams): Promise<AlertOutboxItem[]> {
  const enqueued: AlertOutboxItem[] = [];
  const seenDeliveryKeys = new Set<string>();

  const isSoldOrStale = isSoldOrStaleStatus(statusEvent.newStatus);

  for (const search of matchedSearches) {
    // 1. Skip sold / stale transitions unless search preferences explicitly opt-in
    const wantsSold =
      search.criteria?.includeSold === true ||
      search.includeSoldTransitions === true;

    if (isSoldOrStale && !wantsSold) {
      continue;
    }

    const channel = search.channel || 'email';
    const deliveryKey = generateDeliveryKey({
      recipient: search.recipient,
      channel,
      savedSearchId: search.id,
      listingId: listing.id,
      eventId: statusEvent.id,
    });

    // In-memory deduplication for batch inputs
    if (seenDeliveryKeys.has(deliveryKey)) {
      continue;
    }
    seenDeliveryKeys.add(deliveryKey);

    const outboxItem: AlertOutboxItem = {
      id: crypto.randomUUID(),
      deliveryKey,
      idempotencyKey: deliveryKey,
      recipient: search.recipient.trim(),
      channel,
      payload: {
        savedSearchId: search.id,
        recipient: search.recipient.trim(),
        channel,
        hasConsent: search.hasConsent ?? true,
        isSuppressed: search.isSuppressed ?? false,
        unsubscribeToken: search.unsubscribeToken || search.id,
        budgetRemaining: search.budgetRemaining,
        listingId: listing.id,
        eventId: statusEvent.id,
        status: statusEvent.newStatus,
        previousStatus: statusEvent.previousStatus,
        observedAt: statusEvent.eventTimestamp || listing.lastObservedAt,
        vdpUrl: listing.vdpUrl,
        stockNumber: listing.stockNumber,
        vehicle: {
          vin: vehicle?.vin || null,
          provisionalId: vehicle?.provisionalId || null,
          isProvisionalVin: vehicle?.isProvisionalVin ?? (!vehicle?.vin),
          make: vehicle?.make || 'Toyota',
          model: vehicle?.model || 'Vehicle',
          trim: vehicle?.trim || null,
          modelYear: vehicle?.modelYear || new Date().getFullYear(),
          powertrain: vehicle?.powertrain || null,
          exteriorColor: vehicle?.exteriorColor || null,
        },
        dealer: {
          name: dealer?.name || 'Authorized Toyota Dealer',
          city: dealer?.city || null,
          province: dealer?.province || null,
          websiteUrl: dealer?.websiteUrl || null,
        },
        pricing: observation
          ? {
              msrp: observation.msrp,
              sellingPrice: observation.sellingPrice || observation.advertisedPrice,
              mandatoryFees: observation.mandatoryFees,
              hasUnverifiedFees: observation.hasUnverifiedFees ?? false,
            }
          : null,
      },
      status: 'pending',
      attempts: 0,
      maxAttempts: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (tx) {
      try {
        const { data, error } = await tx
          .from('alert_outbox')
          .insert({
            id: outboxItem.id,
            delivery_key: outboxItem.deliveryKey,
            idempotency_key: outboxItem.idempotencyKey,
            recipient: outboxItem.recipient,
            channel: outboxItem.channel,
            payload: outboxItem.payload,
            status: outboxItem.status,
            attempts: outboxItem.attempts,
            max_attempts: outboxItem.maxAttempts,
            created_at: outboxItem.createdAt,
            updated_at: outboxItem.updatedAt,
          })
          .select()
          .single();

        if (error) {
          // Check for duplicate key / unique violation
          const isUniqueViolation =
            error.code === '23505' ||
            error.message?.includes('duplicate key') ||
            error.message?.includes('unique constraint') ||
            error.message?.includes('UNIQUE');

          if (isUniqueViolation) {
            // Deduplicated: row already exists, silently skip
            continue;
          }
          throw new Error(`Failed to enqueue outbox alert: ${error.message}`);
        }

        if (data) {
          enqueued.push({
            ...outboxItem,
            id: data.id || outboxItem.id,
          });
        }
      } catch (err: any) {
        if (
          err.message?.includes('duplicate key') ||
          err.message?.includes('unique constraint') ||
          err.message?.includes('UNIQUE')
        ) {
          continue;
        }
        throw err;
      }
    } else {
      enqueued.push(outboxItem);
    }
  }

  return enqueued;
}
