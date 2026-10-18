/**
 * tests/discovery/dispatch-worker.test.ts
 *
 * Sprint 4: Transactional Outbox, Lease-Locking Worker & Dispatch Tests
 * Master Plan V3.2 Page 4 & Appendices A4, A5, A6, B3
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { formatAlertEmail } from '../../lib/discovery/notifications/formatters';
import {
  claimOutboxBatch,
  processClaimedBatch,
  releaseExpiredLeases,
} from '../../lib/discovery/services/dispatch-worker';
import {
  enqueueEligibleAlerts,
  generateDeliveryKey,
} from '../../lib/discovery/services/outbox-service';
import {
  AlertOutboxItem,
  DealerListing,
  EmailProvider,
  NormalizedListingStatus,
  SavedSearch,
  StatusEvent,
} from '../../lib/discovery/types';

/**
 * Creates an in-memory mock Supabase client mirroring outbox database operations.
 */
function createMockOutboxDb() {
  const table: AlertOutboxItem[] = [];
  let idCounter = 1;

  return {
    rows: table,
    from: (tableName: string) => {
      let filters: Array<(row: any) => boolean> = [];
      let pendingUpdate: Record<string, any> | null = null;
      let pendingInsert: any = null;

      const builder: any = {
        select: (cols = '*') => builder,
        insert: (data: any) => {
          pendingInsert = data;
          return builder;
        },
        update: (updates: Record<string, any>) => {
          pendingUpdate = updates;
          return builder;
        },
        eq: (col: string, val: any) => {
          filters.push((row: any) => {
            const rowVal = row[col] !== undefined ? row[col] : (
              col === 'claim_token' ? row.claimToken :
              col === 'claim_expires_at' ? row.claimExpiresAt :
              col === 'delivery_key' ? row.deliveryKey :
              col === 'idempotency_key' ? row.idempotencyKey : undefined
            );
            return rowVal === val;
          });
          return builder;
        },
        neq: (col: string, val: any) => {
          filters.push((row: any) => {
            const rowVal = row[col] !== undefined ? row[col] : undefined;
            return rowVal !== val;
          });
          return builder;
        },
        maybeSingle: async () => {
          if (pendingUpdate) {
            const matched = table.filter((r) => filters.every((f) => f(r)));
            if (matched.length > 0) {
              Object.assign(matched[0], pendingUpdate);
              return { data: matched[0], error: null };
            }
            return { data: null, error: null };
          }
          const matched = table.filter((r) => filters.every((f) => f(r)));
          return { data: matched[0] || null, error: null };
        },
        single: async () => {
          if (pendingInsert) {
            const items = Array.isArray(pendingInsert) ? pendingInsert : [pendingInsert];
            for (const item of items) {
              const deliveryKey = item.delivery_key || item.deliveryKey;
              const idempotencyKey = item.idempotency_key || item.idempotencyKey;
              const duplicate = table.find(
                (r) => r.deliveryKey === deliveryKey || r.idempotencyKey === idempotencyKey
              );
              if (duplicate) {
                return {
                  data: null,
                  error: {
                    code: '23505',
                    message: 'duplicate key value violates unique constraint "alert_outbox_delivery_key_key"',
                  },
                };
              }
              const created: AlertOutboxItem = {
                id: item.id || `outbox-${idCounter++}`,
                deliveryKey,
                idempotencyKey,
                recipient: item.recipient,
                channel: item.channel,
                payload: item.payload,
                status: item.status || 'pending',
                claimToken: item.claim_token || item.claimToken || null,
                claimExpiresAt: item.claim_expires_at || item.claimExpiresAt || null,
                attempts: item.attempts || 0,
                maxAttempts: item.max_attempts || item.maxAttempts || 5,
                lastError: item.last_error || item.lastError || null,
                deliveredAt: item.delivered_at || item.deliveredAt || null,
                createdAt: item.created_at || item.createdAt || new Date().toISOString(),
                updatedAt: item.updated_at || item.updatedAt || new Date().toISOString(),
              };
              table.push(created);
              return { data: created, error: null };
            }
          }
          const matched = table.filter((r) => filters.every((f) => f(r)));
          return matched[0]
            ? { data: matched[0], error: null }
            : { data: null, error: { message: 'Row not found' } };
        },
        then: async (resolve: any) => {
          if (pendingInsert) {
            const items = Array.isArray(pendingInsert) ? pendingInsert : [pendingInsert];
            const insertedList: AlertOutboxItem[] = [];
            for (const item of items) {
              const deliveryKey = item.delivery_key || item.deliveryKey;
              const duplicate = table.find((r) => r.deliveryKey === deliveryKey);
              if (duplicate) {
                return resolve({
                  data: null,
                  error: {
                    code: '23505',
                    message: 'duplicate key value violates unique constraint',
                  },
                });
              }
              const created: AlertOutboxItem = {
                id: item.id || `outbox-${idCounter++}`,
                deliveryKey,
                idempotencyKey: item.idempotency_key || item.idempotencyKey || deliveryKey,
                recipient: item.recipient,
                channel: item.channel,
                payload: item.payload,
                status: item.status || 'pending',
                claimToken: item.claim_token || item.claimToken || null,
                claimExpiresAt: item.claim_expires_at || item.claimExpiresAt || null,
                attempts: item.attempts || 0,
                maxAttempts: item.max_attempts || item.maxAttempts || 5,
                lastError: item.last_error || item.lastError || null,
                deliveredAt: item.delivered_at || item.deliveredAt || null,
                createdAt: item.created_at || item.createdAt || new Date().toISOString(),
                updatedAt: item.updated_at || item.updatedAt || new Date().toISOString(),
              };
              table.push(created);
              insertedList.push(created);
            }
            return resolve({ data: insertedList, error: null });
          }

          if (pendingUpdate) {
            const matched = table.filter((r) => filters.every((f) => f(r)));
            matched.forEach((row) => {
              Object.assign(row, pendingUpdate);
            });
            return resolve({ data: matched, error: null });
          }

          const matched = table.filter((r) => filters.every((f) => f(r)));
          return resolve({ data: matched, error: null });
        },
      };

      return builder;
    },
  };
}

describe('Sprint 4: Outbox Enqueue, Lease Locking & Dispatch Worker', () => {
  let mockDb: ReturnType<typeof createMockOutboxDb>;

  const mockListing: DealerListing = {
    id: 'listing-rav4-hybrid-001',
    dealerId: 'dealer-jp-downtown',
    vehicleId: 'vehicle-rav4-001',
    sourceListingId: 'convertus-1250-9988',
    stockNumber: 'T26-1044',
    vdpUrl: 'https://www.jptoyotadowntown.com/inventory/rav4-hybrid-2026',
    currentStatus: NormalizedListingStatus.ADVERTISED_UNCONFIRMED,
    firstObservedAt: '2026-10-17T10:00:00Z',
    lastObservedAt: '2026-10-17T11:00:00Z',
    createdAt: '2026-10-17T10:00:00Z',
    updatedAt: '2026-10-17T11:00:00Z',
  };

  const mockStatusEvent: StatusEvent = {
    id: 'event-transit-to-advertised-001',
    dealerListingId: mockListing.id,
    previousStatus: NormalizedListingStatus.INCOMING_UNCONFIRMED,
    newStatus: NormalizedListingStatus.ADVERTISED_UNCONFIRMED,
    transitionReason: 'Status changed from Incoming to Advertised in dealer inventory feed',
    eventTimestamp: '2026-10-17T11:00:00Z',
    createdAt: '2026-10-17T11:00:00Z',
  };

  const mockSavedSearch: SavedSearch = {
    id: 'search-user-alice-rav4',
    userId: 'user-alice-123',
    recipient: 'alice@example.ca',
    channel: 'email',
    hasConsent: true,
    isSuppressed: false,
    unsubscribeToken: 'unsub-alice-token-9988',
    budgetRemaining: 5,
    criteria: {
      make: 'Toyota',
      model: 'RAV4 Hybrid',
      province: 'BC',
    },
  };

  beforeEach(() => {
    mockDb = createMockOutboxDb();
  });

  // ===========================================================================
  // 1. Unique Delivery Key Deduplication Tests
  // ===========================================================================
  describe('Deterministic Delivery Key & Outbox Deduplication', () => {
    it('generates deterministic keys invariant of whitespace and letter case', () => {
      const key1 = generateDeliveryKey({
        recipient: 'Alice@Example.CA ',
        channel: 'EMAIL',
        savedSearchId: 'search-1',
        listingId: 'list-1',
        eventId: 'evt-1',
      });
      const key2 = generateDeliveryKey({
        recipient: 'alice@example.ca',
        channel: 'email',
        savedSearchId: 'search-1',
        listingId: 'list-1',
        eventId: 'evt-1',
      });

      expect(key1).toBe('alice@example.ca:email:search-1:list-1:evt-1');
      expect(key1).toBe(key2);
    });

    it('enqueues eligible alerts into the outbox table', async () => {
      const enqueued = await enqueueEligibleAlerts({
        statusEvent: mockStatusEvent,
        listing: mockListing,
        matchedSearches: [mockSavedSearch],
        tx: mockDb,
        vehicle: {
          vin: '2T3P1RFV5TC123456',
          make: 'Toyota',
          model: 'RAV4 Hybrid',
          trim: 'XSE AWD',
          modelYear: 2026,
        },
        dealer: {
          name: 'Jim Pattison Toyota Downtown',
          city: 'Vancouver',
          province: 'BC',
        },
        observation: {
          msrp: 47550,
          sellingPrice: 47550,
          mandatoryFees: 895,
          hasUnverifiedFees: true,
        },
      });

      expect(enqueued).toHaveLength(1);
      expect(enqueued[0].recipient).toBe('alice@example.ca');
      expect(enqueued[0].status).toBe('pending');
      expect(mockDb.rows).toHaveLength(1);
    });

    it('deduplicates identical triggers and prevents duplicate row insertion', async () => {
      // First enqueue
      const first = await enqueueEligibleAlerts({
        statusEvent: mockStatusEvent,
        listing: mockListing,
        matchedSearches: [mockSavedSearch],
        tx: mockDb,
      });
      expect(first).toHaveLength(1);
      expect(mockDb.rows).toHaveLength(1);

      // Re-trigger with same event and listing
      const second = await enqueueEligibleAlerts({
        statusEvent: mockStatusEvent,
        listing: mockListing,
        matchedSearches: [mockSavedSearch],
        tx: mockDb,
      });

      // Second attempt should be safely deduplicated
      expect(second).toHaveLength(0);
      expect(mockDb.rows).toHaveLength(1);
    });

    it('skips sold/stale transitions unless search preferences explicitly opt-in', async () => {
      const soldEvent: StatusEvent = {
        id: 'event-sold-001',
        dealerListingId: mockListing.id,
        previousStatus: NormalizedListingStatus.ADVERTISED_UNCONFIRMED,
        newStatus: NormalizedListingStatus.RESERVED_SOLD,
        transitionReason: 'Vehicle removed from feed / marked sold',
        eventTimestamp: '2026-10-17T11:00:00Z',
        createdAt: '2026-10-17T11:00:00Z',
      };

      // Search without includeSold flag
      const defaultSearch: SavedSearch = {
        id: 'search-default',
        recipient: 'buyer@example.ca',
      };

      const enqueuedDefault = await enqueueEligibleAlerts({
        statusEvent: soldEvent,
        listing: mockListing,
        matchedSearches: [defaultSearch],
        tx: mockDb,
      });
      expect(enqueuedDefault).toHaveLength(0);

      // Search with explicit includeSold flag
      const soldAlertSearch: SavedSearch = {
        id: 'search-sold-tracker',
        recipient: 'analyst@example.ca',
        criteria: { includeSold: true },
      };

      const enqueuedSold = await enqueueEligibleAlerts({
        statusEvent: soldEvent,
        listing: mockListing,
        matchedSearches: [soldAlertSearch],
        tx: mockDb,
      });
      expect(enqueuedSold).toHaveLength(1);
      expect(enqueuedSold[0].recipient).toBe('analyst@example.ca');
    });
  });

  // ===========================================================================
  // 2. Concurrent Workers & Lease Locking Tests
  // ===========================================================================
  describe('Concurrent Workers & Lease Locking', () => {
    it('allows two concurrent workers to claim distinct batches without overlapping sends', async () => {
      // Seed 5 pending outbox items
      for (let i = 1; i <= 5; i++) {
        mockDb.rows.push({
          id: `alert-${i}`,
          deliveryKey: `buyer-${i}@example.ca:email:s-${i}:l-1:e-1`,
          idempotencyKey: `buyer-${i}@example.ca:email:s-${i}:l-1:e-1`,
          recipient: `buyer-${i}@example.ca`,
          channel: 'email',
          payload: {
            vehicle: { make: 'Toyota', model: 'Grand Highlander', modelYear: 2026 },
            dealer: { name: 'Toyota Dealer' },
            status: 'Advertised - availability unconfirmed',
            observedAt: new Date().toISOString(),
            unsubscribeToken: `token-${i}`,
          },
          status: 'pending',
          attempts: 0,
          maxAttempts: 5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      // Worker 1 claims batch of 3
      const worker1Batch = await claimOutboxBatch({
        workerId: 'worker-node-1',
        batchSize: 3,
        leaseDurationMs: 60000,
        db: mockDb,
      });

      // Worker 2 claims batch of 3 concurrently
      const worker2Batch = await claimOutboxBatch({
        workerId: 'worker-node-2',
        batchSize: 3,
        leaseDurationMs: 60000,
        db: mockDb,
      });

      expect(worker1Batch).toHaveLength(3);
      expect(worker2Batch).toHaveLength(2); // Only 2 were left pending

      // Verify mutual exclusion (zero intersection)
      const worker1Ids = new Set(worker1Batch.map((r) => r.id));
      const worker2Ids = new Set(worker2Batch.map((r) => r.id));
      const intersection = [...worker1Ids].filter((id) => worker2Ids.has(id));

      expect(intersection).toHaveLength(0);

      // Verify worker tokens in database
      const claimedByWorker1 = mockDb.rows.filter((r) => r.claimToken === 'worker-node-1');
      const claimedByWorker2 = mockDb.rows.filter((r) => r.claimToken === 'worker-node-2');
      expect(claimedByWorker1).toHaveLength(3);
      expect(claimedByWorker2).toHaveLength(2);

      // Mock email provider
      const sentEmails: string[] = [];
      const mockEmailProvider: EmailProvider = {
        sendEmail: vi.fn(async ({ to }) => {
          sentEmails.push(to);
          return { success: true, messageId: `provider-id-${to}` };
        }),
      };

      // Both workers process their batches
      await processClaimedBatch({
        claimedRows: worker1Batch,
        emailProvider: mockEmailProvider,
        db: mockDb,
      });
      await processClaimedBatch({
        claimedRows: worker2Batch,
        emailProvider: mockEmailProvider,
        db: mockDb,
      });

      // Exactly 5 unique emails were sent
      expect(sentEmails).toHaveLength(5);
      expect(new Set(sentEmails).size).toBe(5);

      // All 5 rows are marked sent
      const allSent = mockDb.rows.filter((r) => r.status === 'sent');
      expect(allSent).toHaveLength(5);
    });
  });

  // ===========================================================================
  // 3. Pre-Send Re-verification & Suppression Tests (Appendix A4)
  // ===========================================================================
  describe('Pre-Send Re-verification & Suppression (Appendix A4)', () => {
    it('cancels delivery if recipient unsubscribes before worker processes claimed batch', async () => {
      const row: AlertOutboxItem = {
        id: 'outbox-alice-unsub',
        deliveryKey: 'alice@example.ca:email:s-1:l-1:e-1',
        idempotencyKey: 'alice@example.ca:email:s-1:l-1:e-1',
        recipient: 'alice@example.ca',
        channel: 'email',
        payload: {
          vehicle: { make: 'Toyota', model: 'Sienna', modelYear: 2026 },
          dealer: { name: 'Pattison Toyota' },
          status: 'Advertised - availability unconfirmed',
          observedAt: new Date().toISOString(),
          isSuppressed: false,
        },
        status: 'claimed',
        claimToken: 'worker-1',
        attempts: 1,
        maxAttempts: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockDb.rows.push(row);

      const mockEmailProvider: EmailProvider = {
        sendEmail: vi.fn(async () => ({ success: true })),
      };

      // External suppression checker returns true (user unsubscribed)
      const suppressionChecker = vi.fn(async (recipient: string) => recipient === 'alice@example.ca');

      const result = await processClaimedBatch({
        claimedRows: [row],
        emailProvider: mockEmailProvider,
        db: mockDb,
        suppressionChecker,
      });

      expect(mockEmailProvider.sendEmail).not.toHaveBeenCalled();
      expect(result.sentCount).toBe(0);
      expect(result.suppressedCount).toBe(1);
      expect(mockDb.rows[0].status).toBe('suppressed');
      expect(mockDb.rows[0].lastError).toContain('USER_OPTED_OUT');
    });

    it('suppresses alerts if listing evidence exceeds freshness threshold', async () => {
      const now = new Date('2026-10-17T12:00:00Z');
      // Observed 30 hours ago (freshness limit is 24 hours)
      const staleObservedAt = new Date(now.getTime() - 30 * 3600 * 1000).toISOString();

      const row: AlertOutboxItem = {
        id: 'outbox-stale-check',
        deliveryKey: 'bob@example.ca:email:s-2:l-1:e-1',
        idempotencyKey: 'bob@example.ca:email:s-2:l-1:e-1',
        recipient: 'bob@example.ca',
        channel: 'email',
        payload: {
          vehicle: { make: 'Toyota', model: 'Prius Prime', modelYear: 2026 },
          dealer: { name: 'Granville Toyota' },
          status: 'Advertised - availability unconfirmed',
          observedAt: staleObservedAt,
        },
        status: 'claimed',
        claimToken: 'worker-1',
        attempts: 1,
        maxAttempts: 5,
        createdAt: staleObservedAt,
        updatedAt: staleObservedAt,
      };
      mockDb.rows.push(row);

      const mockEmailProvider: EmailProvider = {
        sendEmail: vi.fn(async () => ({ success: true })),
      };

      const result = await processClaimedBatch({
        claimedRows: [row],
        emailProvider: mockEmailProvider,
        db: mockDb,
        now,
      });

      expect(mockEmailProvider.sendEmail).not.toHaveBeenCalled();
      expect(result.suppressedCount).toBe(1);
      expect(mockDb.rows[0].status).toBe('suppressed');
      expect(mockDb.rows[0].lastError).toContain('EXPIRED_EVIDENCE');
    });

    it('suppresses alerts when CASL channel consent is revoked', async () => {
      const row: AlertOutboxItem = {
        id: 'outbox-no-consent',
        deliveryKey: 'charlie@example.ca:email:s-3:l-1:e-1',
        idempotencyKey: 'charlie@example.ca:email:s-3:l-1:e-1',
        recipient: 'charlie@example.ca',
        channel: 'email',
        payload: {
          vehicle: { make: 'Toyota', model: 'Tacoma', modelYear: 2026 },
          dealer: { name: 'OpenRoad Toyota' },
          status: 'Incoming availability unconfirmed',
          observedAt: new Date().toISOString(),
          hasConsent: false,
        },
        status: 'claimed',
        attempts: 1,
        maxAttempts: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockDb.rows.push(row);

      const mockEmailProvider: EmailProvider = {
        sendEmail: vi.fn(async () => ({ success: true })),
      };

      const result = await processClaimedBatch({
        claimedRows: [row],
        emailProvider: mockEmailProvider,
        db: mockDb,
      });

      expect(mockEmailProvider.sendEmail).not.toHaveBeenCalled();
      expect(result.suppressedCount).toBe(1);
      expect(mockDb.rows[0].status).toBe('suppressed');
      expect(mockDb.rows[0].lastError).toContain('CONSENT_REVOKED');
    });
  });

  // ===========================================================================
  // 4. Lease Timeout Recovery & Retry Tests
  // ===========================================================================
  describe('Lease Timeout Recovery & Retry Logic', () => {
    it('reclaims an expired lease back to queue for a new worker after timeout', async () => {
      const initialTime = new Date('2026-10-17T12:00:00Z');
      const expiredLeaseTime = new Date('2026-10-17T12:01:00Z').toISOString();

      // Row was claimed by crashed worker, expired at 12:01:00Z
      const staleClaimRow: AlertOutboxItem = {
        id: 'outbox-crashed-worker',
        deliveryKey: 'recovery@example.ca:email:s-1:l-1:e-1',
        idempotencyKey: 'recovery@example.ca:email:s-1:l-1:e-1',
        recipient: 'recovery@example.ca',
        channel: 'email',
        payload: {
          vehicle: { make: 'Toyota', model: 'Crown Signia', modelYear: 2026 },
          dealer: { name: 'Jim Pattison' },
          status: 'Advertised - availability unconfirmed',
          observedAt: initialTime.toISOString(),
        },
        status: 'claimed',
        claimToken: 'crashed-worker-pid-999',
        claimExpiresAt: expiredLeaseTime,
        attempts: 1,
        maxAttempts: 5,
        createdAt: initialTime.toISOString(),
        updatedAt: initialTime.toISOString(),
      };
      mockDb.rows.push(staleClaimRow);

      // Now time is 12:05:00Z (4 minutes after lease expired)
      const currentTime = new Date('2026-10-17T12:05:00Z');

      // Reclaiming directly via claimOutboxBatch
      const reclaimedBatch = await claimOutboxBatch({
        workerId: 'healthy-worker-pid-100',
        batchSize: 10,
        leaseDurationMs: 60000,
        db: mockDb,
        now: currentTime,
      });

      expect(reclaimedBatch).toHaveLength(1);
      expect(reclaimedBatch[0].id).toBe('outbox-crashed-worker');
      expect(reclaimedBatch[0].claimToken).toBe('healthy-worker-pid-100');
      expect(reclaimedBatch[0].attempts).toBe(2);
    });

    it('releases expired leases back to pending via releaseExpiredLeases helper', async () => {
      const expiredLeaseTime = new Date('2026-10-17T12:01:00Z').toISOString();

      mockDb.rows.push({
        id: 'outbox-stale-lease-1',
        deliveryKey: 'lease1@example.ca:email:1:1:1',
        idempotencyKey: 'lease1@example.ca:email:1:1:1',
        recipient: 'lease1@example.ca',
        channel: 'email',
        payload: {},
        status: 'claimed',
        claimToken: 'dead-worker',
        claimExpiresAt: expiredLeaseTime,
        attempts: 1,
        maxAttempts: 5,
        createdAt: '2026-10-17T12:00:00Z',
        updatedAt: '2026-10-17T12:00:00Z',
      });

      const released = await releaseExpiredLeases({
        db: mockDb,
        now: new Date('2026-10-17T12:05:00Z'),
      });

      expect(released).toBe(1);
      expect(mockDb.rows[0].status).toBe('pending');
      expect(mockDb.rows[0].claimToken).toBeNull();
      expect(mockDb.rows[0].claimExpiresAt).toBeNull();
    });

    it('transitions to dead-letter failed status once maxAttempts is reached', async () => {
      const row: AlertOutboxItem = {
        id: 'outbox-flaky-email',
        deliveryKey: 'flaky@example.ca:email:1:1:1',
        idempotencyKey: 'flaky@example.ca:email:1:1:1',
        recipient: 'flaky@example.ca',
        channel: 'email',
        payload: {
          vehicle: { make: 'Toyota', model: 'Corolla', modelYear: 2026 },
          dealer: { name: 'Dealer' },
          status: 'Advertised - availability unconfirmed',
          observedAt: new Date().toISOString(),
        },
        status: 'claimed',
        claimToken: 'worker-1',
        attempts: 5,
        maxAttempts: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockDb.rows.push(row);

      const mockFailingEmailProvider: EmailProvider = {
        sendEmail: vi.fn(async () => ({ success: false, error: 'SMTP 550 Mailbox full' })),
      };

      const result = await processClaimedBatch({
        claimedRows: [row],
        emailProvider: mockFailingEmailProvider,
        db: mockDb,
      });

      expect(result.failedCount).toBe(1);
      expect(result.retryCount).toBe(0);
      expect(mockDb.rows[0].status).toBe('failed');
      expect(mockDb.rows[0].lastError).toContain('SMTP 550 Mailbox full');
    });
  });

  // ===========================================================================
  // 5. CASL & Transparent Content Formatting Tests (Page 4 & Appendix B3)
  // ===========================================================================
  describe('Notification Formatter & CASL Compliance', () => {
    it('generates notification containing required disclaimers, unconfirmed status, and CASL footer', () => {
      const email = formatAlertEmail({
        recipient: 'shopper@example.ca',
        unsubscribeToken: 'unsub-secret-token-1234',
        listingId: 'list-123',
        eventId: 'evt-123',
        status: 'Advertised - availability unconfirmed',
        observedAt: '2026-10-17 11:30 UTC',
        vdpUrl: 'https://www.jptoyotadowntown.com/inventory/new-rav4-hybrid',
        stockNumber: 'STK-2026-99',
        vehicle: {
          vin: '2T3P1RFV8TC998877',
          make: 'Toyota',
          model: 'RAV4 Hybrid',
          trim: 'Limited AWD',
          modelYear: 2026,
          powertrain: 'Hybrid 2.5L 4-Cyl',
        },
        dealer: {
          name: 'Jim Pattison Toyota Downtown',
          city: 'Vancouver',
          province: 'BC',
        },
        pricing: {
          msrp: 52150,
          sellingPrice: 53995,
          mandatoryFees: 895,
          hasUnverifiedFees: true,
        },
      });

      // Subject line
      expect(email.subject).toContain('Matching listing detected - availability unconfirmed with dealer');
      expect(email.subject).toContain('2026 Toyota RAV4 Hybrid Limited AWD');

      // Epistemic honesty & availability disclaimer in body
      expect(email.text).toContain('Matching listing detected - availability unconfirmed with dealer');
      expect(email.text).toContain('Advertised - availability unconfirmed');
      expect(email.text).toContain('ToyotaWaits.ca is an independent public observation tool and does NOT confirm vehicle availability with dealer staff');
      
      // Pricing & unverified fee notice
      expect(email.text).toContain('$53,995');
      expect(email.text).toContain('Pricing Notice: Dealer fee items are unverified');

      // Canonical link and timestamp
      expect(email.text).toContain('https://www.jptoyotadowntown.com/inventory/new-rav4-hybrid');
      expect(email.text).toContain('Last Checked: 2026-10-17 11:30 UTC');

      // CASL Sender info & Mailing address
      expect(email.text).toContain('Sender: ToyotaWaits.ca');
      expect(email.text).toContain('1055 W Georgia St, Vancouver, BC V6E 3P3, Canada');
      expect(email.text).toContain('https://toyotawaits.ca/unsubscribe?token=unsub-secret-token-1234');

      // Headers (RFC 2369 / 8058)
      expect(email.headers['List-Unsubscribe']).toContain('https://toyotawaits.ca/unsubscribe?token=unsub-secret-token-1234');
      expect(email.headers['List-Unsubscribe-Post']).toBe('List-Unsubscribe=One-Click');

      // HTML version checks
      expect(email.html).toContain('Availability Unconfirmed With Dealer');
      expect(email.html).toContain('One-Click Unsubscribe');
      expect(email.html).toContain('1055 W Georgia St, Vancouver, BC V6E 3P3, Canada');
    });

    it('clearly flags provisional stock IDs when 17-char VIN is not yet published', () => {
      const email = formatAlertEmail({
        recipient: 'shopper@example.ca',
        unsubscribeToken: 'unsub-token-55',
        listingId: 'list-456',
        eventId: 'evt-456',
        status: 'Incoming availability unconfirmed',
        observedAt: '2026-10-17 11:30 UTC',
        stockNumber: 'PROV-STOCK-888',
        vehicle: {
          vin: null,
          provisionalId: 'PROV-STOCK-888',
          isProvisionalVin: true,
          make: 'Toyota',
          model: 'Land Cruiser',
          modelYear: 2026,
        },
        dealer: {
          name: 'Granville Toyota',
          city: 'Vancouver',
          province: 'BC',
        },
      });

      expect(email.text).toContain('Provisional Stock Identifier: PROV-STOCK-888 (True 17-char VIN not yet published by dealer)');
      expect(email.text).toContain('Incoming availability unconfirmed');
    });
  });
});
