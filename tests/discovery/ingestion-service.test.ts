/**
 * tests/discovery/ingestion-service.test.ts
 *
 * Sprint 3: Ingestion Pipeline, Observation Persistence & Transition Detection Tests
 * Master Plan V3.2 Page 3 & Appendix A
 */

import { beforeEach, describe, expect, it } from 'vitest';
import {
  computePayloadHash,
  ingestDealerListings,
} from '../../lib/discovery/services/ingestion-service';
import { evaluateSweepStaleness } from '../../lib/discovery/services/staleness-service';
import {
  NormalizedListingStatus,
  ParsedVehicleListing,
} from '../../lib/discovery/types';

/**
 * Creates an in-memory mock Supabase client mirroring table operations.
 */
function createMockSupabase() {
  const tables: Record<string, any[]> = {
    sources: [],
    dealers: [],
    vehicles: [],
    dealer_listings: [],
    observations: [],
    status_events: [],
    alert_outbox: [],
  };

  let idCounter = 1;

  return {
    tables,
    from: (tableName: string) => {
      let currentTable = tables[tableName] || [];
      let filters: Array<(row: any) => boolean> = [];
      let pendingUpdate: Record<string, any> | null = null;
      let pendingInsert: any = null;

      const queryBuilder: any = {
        select: (columns = '*') => {
          return queryBuilder;
        },
        insert: (data: any) => {
          pendingInsert = data;
          return queryBuilder;
        },
        update: (updates: Record<string, any>) => {
          pendingUpdate = updates;
          return queryBuilder;
        },
        eq: (col: string, val: any) => {
          filters.push((row: any) => row[col] === val);
          return queryBuilder;
        },
        neq: (col: string, val: any) => {
          filters.push((row: any) => row[col] !== val);
          return queryBuilder;
        },
        maybeSingle: async () => {
          const matched = currentTable.filter((row) =>
            filters.every((f) => f(row))
          );
          return { data: matched[0] || null, error: null };
        },
        single: async () => {
          if (pendingInsert) {
            const recordsToInsert = Array.isArray(pendingInsert)
              ? pendingInsert
              : [pendingInsert];
            const inserted = recordsToInsert.map((item) => {
              const record = {
                id: item.id || `mock-${tableName}-${idCounter++}`,
                ...item,
              };
              currentTable.push(record);
              return record;
            });
            return { data: inserted[0], error: null };
          }

          const matched = currentTable.filter((row) =>
            filters.every((f) => f(row))
          );
          if (matched.length === 0) {
            return { data: null, error: { message: 'Row not found' } };
          }
          return { data: matched[0], error: null };
        },
        then: async (resolve: any) => {
          if (pendingInsert) {
            const recordsToInsert = Array.isArray(pendingInsert)
              ? pendingInsert
              : [pendingInsert];
            const inserted = recordsToInsert.map((item) => {
              const record = {
                id: item.id || `mock-${tableName}-${idCounter++}`,
                ...item,
              };
              currentTable.push(record);
              return record;
            });
            return resolve({ data: inserted, error: null });
          }

          if (pendingUpdate) {
            const matched = currentTable.filter((row) =>
              filters.every((f) => f(row))
            );
            matched.forEach((row) => {
              Object.assign(row, pendingUpdate);
            });
            return resolve({ data: matched, error: null });
          }

          const matched = currentTable.filter((row) =>
            filters.every((f) => f(row))
          );
          return resolve({ data: matched, error: null });
        },
      };

      return queryBuilder;
    },
  };
}

describe('Sprint 3: Ingestion Pipeline & Observation Persistence', () => {
  let mockDb: ReturnType<typeof createMockSupabase>;
  const mockDealerId = 'dealer-uuid-1250';
  const mockSourceId = 'source-uuid-convertus';

  beforeEach(() => {
    mockDb = createMockSupabase();
  });

  const baseListing: ParsedVehicleListing = {
    vehicle: {
      vin: 'JTDACAAJ0T3038212',
      provisionalId: null,
      isProvisionalVin: false,
      make: 'Toyota',
      model: 'Crown Signia',
      trim: 'Limited',
      modelYear: 2026,
      modelCode: 'ACAAJC',
      packageCode: 'B,PRE1',
      bodyStyle: 'SUV',
      powertrain: 'Gas/Electric Hybrid',
      transmission: 'Automatic',
      driveTrain: 'All Wheel Drive',
      exteriorColor: 'Red',
      interiorColor: 'Black',
    },
    listing: {
      sourceListingId: 'listing-69116486',
      stockNumber: 'D-26136',
      vdpUrl: 'https://example.com/vdp/crown-signia',
      rawStatus: 'sale_class: New, in_transit: 0',
      normalizedStatus: NormalizedListingStatus.ADVERTISED_UNCONFIRMED,
      daysOnLot: 271,
    },
    pricing: {
      msrp: 61285,
      rawMsrp: '61285',
      askingPrice: 61957,
      rawAskingPrice: '61957',
      sellingPrice: 63957,
      rawSellingPrice: '63957',
      mandatoryFees: 0,
      hasUnverifiedFees: true,
    },
    raw: { id: 10192091 },
  };

  describe('Observation & Ingestion Workflow', () => {
    it('Observation 1: creates canonical vehicle, dealer_listing, observation, and initial discovery event', async () => {
      const summary = await ingestDealerListings({
        dealerId: mockDealerId,
        sourceId: mockSourceId,
        parsedListings: [baseListing],
        sweepTimestamp: '2026-10-17T12:00:00Z',
        supabaseClient: mockDb,
      });

      expect(summary.totalProcessed).toBe(1);
      expect(summary.vehiclesCreated).toBe(1);
      expect(summary.vehiclesLinked).toBe(0);
      expect(summary.listingsCreated).toBe(1);
      expect(summary.listingsUpdated).toBe(0);
      expect(summary.observationsStored).toBe(1);
      expect(summary.statusTransitionsDetected).toBe(0);
      expect(summary.statusEventsLogged).toBe(1); // initial discovery
      expect(summary.errors).toHaveLength(0);

      expect(mockDb.tables.vehicles).toHaveLength(1);
      expect(mockDb.tables.vehicles[0].vin).toBe('JTDACAAJ0T3038212');
      expect(mockDb.tables.vehicles[0].is_provisional_vin).toBe(false);

      expect(mockDb.tables.dealer_listings).toHaveLength(1);
      expect(mockDb.tables.dealer_listings[0].current_status).toBe(
        NormalizedListingStatus.ADVERTISED_UNCONFIRMED
      );
      expect(mockDb.tables.dealer_listings[0].first_observed_at).toBe(
        '2026-10-17T12:00:00Z'
      );
      expect(mockDb.tables.dealer_listings[0].last_observed_at).toBe(
        '2026-10-17T12:00:00Z'
      );

      expect(mockDb.tables.observations).toHaveLength(1);
      expect(mockDb.tables.observations[0].msrp).toBe(61285);
      expect(mockDb.tables.observations[0].raw_payload_hash).toBeDefined();

      expect(mockDb.tables.status_events).toHaveLength(1);
      expect(mockDb.tables.status_events[0].previous_status).toBeNull();
      expect(mockDb.tables.status_events[0].new_status).toBe(
        NormalizedListingStatus.ADVERTISED_UNCONFIRMED
      );
      expect(mockDb.tables.status_events[0].observation_id).toBe(
        mockDb.tables.observations[0].id
      );
    });

    it('Observation 2: identical sweep links vehicle, updates listing timestamps, stores observation, but logs NO status_event', async () => {
      // Run first sweep
      await ingestDealerListings({
        dealerId: mockDealerId,
        sourceId: mockSourceId,
        parsedListings: [baseListing],
        sweepTimestamp: '2026-10-17T12:00:00Z',
        supabaseClient: mockDb,
      });

      // Run second identical sweep 2 hours later
      const summary2 = await ingestDealerListings({
        dealerId: mockDealerId,
        sourceId: mockSourceId,
        parsedListings: [baseListing],
        sweepTimestamp: '2026-10-17T14:00:00Z',
        supabaseClient: mockDb,
      });

      expect(summary2.vehiclesCreated).toBe(0);
      expect(summary2.vehiclesLinked).toBe(1);
      expect(summary2.listingsCreated).toBe(0);
      expect(summary2.listingsUpdated).toBe(1);
      expect(summary2.observationsStored).toBe(1);
      expect(summary2.statusTransitionsDetected).toBe(0);
      expect(summary2.statusEventsLogged).toBe(0); // NO status event logged!

      // Vehicles count remains 1
      expect(mockDb.tables.vehicles).toHaveLength(1);
      // Listings count remains 1, but last_observed_at is updated
      expect(mockDb.tables.dealer_listings).toHaveLength(1);
      expect(mockDb.tables.dealer_listings[0].last_observed_at).toBe(
        '2026-10-17T14:00:00Z'
      );
      expect(mockDb.tables.dealer_listings[0].first_observed_at).toBe(
        '2026-10-17T12:00:00Z'
      );

      // Observations count is now 2 (historical record appended)
      expect(mockDb.tables.observations).toHaveLength(2);

      // Status events still only has the 1 initial discovery event
      expect(mockDb.tables.status_events).toHaveLength(1);
    });

    it('Observation 3: status transition (Advertised -> Incoming) logs status_event and updates listing', async () => {
      // Step 1: Initial discovery
      await ingestDealerListings({
        dealerId: mockDealerId,
        sourceId: mockSourceId,
        parsedListings: [baseListing],
        sweepTimestamp: '2026-10-17T12:00:00Z',
        supabaseClient: mockDb,
      });

      // Step 2: Listing is updated to 'Incoming availability unconfirmed' (e.g. in_transit toggled to 1)
      const updatedListing: ParsedVehicleListing = {
        ...baseListing,
        listing: {
          ...baseListing.listing,
          rawStatus: 'sale_class: New, in_transit: 1',
          normalizedStatus: NormalizedListingStatus.INCOMING_UNCONFIRMED,
        },
      };

      const summary3 = await ingestDealerListings({
        dealerId: mockDealerId,
        sourceId: mockSourceId,
        parsedListings: [updatedListing],
        sweepTimestamp: '2026-10-17T16:00:00Z',
        supabaseClient: mockDb,
      });

      expect(summary3.statusTransitionsDetected).toBe(1);
      expect(summary3.statusEventsLogged).toBe(1);
      expect(summary3.listingsUpdated).toBe(1);

      // Total status events: 1 initial + 1 transition = 2
      expect(mockDb.tables.status_events).toHaveLength(2);
      const transitionEvent = mockDb.tables.status_events[1];
      expect(transitionEvent.previous_status).toBe(
        NormalizedListingStatus.ADVERTISED_UNCONFIRMED
      );
      expect(transitionEvent.new_status).toBe(
        NormalizedListingStatus.INCOMING_UNCONFIRMED
      );
      expect(transitionEvent.transition_reason).toContain('Status transition observed in sweep');
      expect(transitionEvent.observation_id).toBe(
        mockDb.tables.observations[1].id
      );

      // Listing current status updated
      expect(mockDb.tables.dealer_listings[0].current_status).toBe(
        NormalizedListingStatus.INCOMING_UNCONFIRMED
      );
    });

    it('Provisional vehicles: persists provisional vehicles without synthesizing fake VIN', async () => {
      const provisionalListing: ParsedVehicleListing = {
        vehicle: {
          vin: null,
          provisionalId: 'STK-PROV-999',
          isProvisionalVin: true,
          make: 'Toyota',
          model: 'Tacoma',
          trim: 'TRD Pro',
          modelYear: 2026,
          modelCode: null,
          packageCode: null,
          bodyStyle: 'Truck',
          powertrain: 'Gas',
          transmission: 'Automatic',
          driveTrain: '4x4',
          exteriorColor: 'White',
          interiorColor: 'Black',
        },
        listing: {
          sourceListingId: 'listing-prov-999',
          stockNumber: 'STK-PROV-999',
          vdpUrl: 'https://example.com/vdp/tacoma-prov',
          rawStatus: 'sale_class: New, in_transit: 1',
          normalizedStatus: NormalizedListingStatus.INCOMING_UNCONFIRMED,
          daysOnLot: 10,
        },
        pricing: {
          msrp: 55000,
          rawMsrp: '55000',
          askingPrice: 56000,
          rawAskingPrice: '56000',
          sellingPrice: 56000,
          rawSellingPrice: '56000',
          mandatoryFees: 0,
          hasUnverifiedFees: true,
        },
        raw: { provisional: true },
      };

      const summary = await ingestDealerListings({
        dealerId: mockDealerId,
        sourceId: mockSourceId,
        parsedListings: [provisionalListing],
        sweepTimestamp: '2026-10-17T12:00:00Z',
        supabaseClient: mockDb,
      });

      expect(summary.vehiclesCreated).toBe(1);
      expect(mockDb.tables.vehicles[0].vin).toBeNull();
      expect(mockDb.tables.vehicles[0].is_provisional_vin).toBe(true);
      expect(mockDb.tables.vehicles[0].provisional_id).toBe('STK-PROV-999');

      // Subsequent sweep links to same provisional vehicle
      const summary2 = await ingestDealerListings({
        dealerId: mockDealerId,
        sourceId: mockSourceId,
        parsedListings: [provisionalListing],
        sweepTimestamp: '2026-10-17T14:00:00Z',
        supabaseClient: mockDb,
      });

      expect(summary2.vehiclesLinked).toBe(1);
      expect(mockDb.tables.vehicles).toHaveLength(1);
    });
  });

  describe('2-Sweep Staleness Safeguard', () => {
    it('Sweep 1 miss: increments missed count to 1, keeps status active, logs NO stale transition', async () => {
      // Ingest 1 initial active listing
      await ingestDealerListings({
        dealerId: mockDealerId,
        sourceId: mockSourceId,
        parsedListings: [baseListing],
        sweepTimestamp: '2026-10-17T12:00:00Z',
        supabaseClient: mockDb,
      });

      // Sweep 1: Vehicle is missing from the sweep!
      const staleness1 = await evaluateSweepStaleness({
        dealerId: mockDealerId,
        activeSourceListingIdsInSweep: [], // empty sweep (missed)
        sweepTimestamp: '2026-10-17T14:00:00Z',
        supabaseClient: mockDb,
      });

      expect(staleness1.totalActiveEvaluated).toBe(1);
      expect(staleness1.missedOnceCount).toBe(1);
      expect(staleness1.staleTransitionsCount).toBe(0);
      expect(staleness1.statusEventsLogged).toBe(0);

      // Status remains active
      expect(mockDb.tables.dealer_listings[0].current_status).toBe(
        NormalizedListingStatus.ADVERTISED_UNCONFIRMED
      );
      expect(mockDb.tables.dealer_listings[0].consecutive_missed_sweeps).toBe(1);
    });

    it('Sweep 2 consecutive miss: transitions status to No longer observed / stale and logs status_event', async () => {
      // Ingest initial listing
      await ingestDealerListings({
        dealerId: mockDealerId,
        sourceId: mockSourceId,
        parsedListings: [baseListing],
        sweepTimestamp: '2026-10-17T12:00:00Z',
        supabaseClient: mockDb,
      });

      // Sweep 1 miss
      await evaluateSweepStaleness({
        dealerId: mockDealerId,
        activeSourceListingIdsInSweep: [],
        sweepTimestamp: '2026-10-17T14:00:00Z',
        supabaseClient: mockDb,
      });

      // Sweep 2 consecutive miss
      const staleness2 = await evaluateSweepStaleness({
        dealerId: mockDealerId,
        activeSourceListingIdsInSweep: [],
        sweepTimestamp: '2026-10-17T16:00:00Z',
        supabaseClient: mockDb,
      });

      expect(staleness2.staleTransitionsCount).toBe(1);
      expect(staleness2.statusEventsLogged).toBe(1);

      // Status transitioned to No longer observed / stale
      expect(mockDb.tables.dealer_listings[0].current_status).toBe(
        NormalizedListingStatus.NO_LONGER_OBSERVED
      );
      expect(mockDb.tables.dealer_listings[0].consecutive_missed_sweeps).toBe(2);

      // Status event logged with audit trail
      const events = mockDb.tables.status_events;
      const lastEvent = events[events.length - 1];
      expect(lastEvent.previous_status).toBe(
        NormalizedListingStatus.ADVERTISED_UNCONFIRMED
      );
      expect(lastEvent.new_status).toBe(
        NormalizedListingStatus.NO_LONGER_OBSERVED
      );
      expect(lastEvent.transition_reason).toContain(
        'Listing missing across 2 consecutive verified sweeps'
      );
    });

    it('Vehicle re-observed after 1 miss resets consecutive missed count to 0', async () => {
      // Ingest initial listing
      await ingestDealerListings({
        dealerId: mockDealerId,
        sourceId: mockSourceId,
        parsedListings: [baseListing],
        sweepTimestamp: '2026-10-17T12:00:00Z',
        supabaseClient: mockDb,
      });

      // Sweep 1: missed once
      await evaluateSweepStaleness({
        dealerId: mockDealerId,
        activeSourceListingIdsInSweep: [],
        sweepTimestamp: '2026-10-17T14:00:00Z',
        supabaseClient: mockDb,
      });
      expect(mockDb.tables.dealer_listings[0].consecutive_missed_sweeps).toBe(1);

      // Sweep 2: vehicle is present again!
      const staleness2 = await evaluateSweepStaleness({
        dealerId: mockDealerId,
        activeSourceListingIdsInSweep: [baseListing.listing.sourceListingId],
        sweepTimestamp: '2026-10-17T16:00:00Z',
        supabaseClient: mockDb,
      });

      expect(staleness2.stillActiveCount).toBe(1);
      expect(mockDb.tables.dealer_listings[0].consecutive_missed_sweeps).toBe(0);
      expect(mockDb.tables.dealer_listings[0].current_status).toBe(
        NormalizedListingStatus.ADVERTISED_UNCONFIRMED
      );
    });
  });

  describe('Payload Hashing Utility', () => {
    it('produces deterministic SHA-256 hash for identical payloads', () => {
      const hash1 = computePayloadHash(baseListing);
      const hash2 = computePayloadHash({ ...baseListing });
      expect(hash1).toBe(hash2);
      expect(hash1).toMatch(/^[a-f0-9]{64}$/);
    });

    it('produces different hash when financial or status values change', () => {
      const hashOriginal = computePayloadHash(baseListing);
      const hashPriceChange = computePayloadHash({
        ...baseListing,
        pricing: { ...baseListing.pricing, msrp: 65000 },
      });
      const hashStatusChange = computePayloadHash({
        ...baseListing,
        listing: {
          ...baseListing.listing,
          normalizedStatus: NormalizedListingStatus.INCOMING_UNCONFIRMED,
        },
      });

      expect(hashPriceChange).not.toBe(hashOriginal);
      expect(hashStatusChange).not.toBe(hashOriginal);
    });
  });

  describe('Dealer Posted Date Persistence & Fallback', () => {
    it('persists explicit postedAt on initial listing creation', async () => {
      const mockDb = createMockSupabase();
      const listingWithDate: ParsedVehicleListing = {
        ...baseListing,
        listing: {
          ...baseListing.listing,
          sourceListingId: 'src-explicit-date-01',
          postedAt: '2026-10-10T14:00:00.000Z',
        },
      };

      await ingestDealerListings({
        dealerId: mockDealerId,
        sourceId: mockSourceId,
        parsedListings: [listingWithDate],
        sweepTimestamp: '2026-10-17T12:00:00.000Z',
        supabaseClient: mockDb,
      });

      expect(mockDb.tables.dealer_listings).toHaveLength(1);
      expect(mockDb.tables.dealer_listings[0].posted_at).toBe('2026-10-10T14:00:00.000Z');
      expect(mockDb.tables.dealer_listings[0].first_observed_at).toBe('2026-10-17T12:00:00.000Z');
    });

    it('falls back to first_seen_at (sweepTimestamp) when postedAt is null and never overwrites with last_observed_at', async () => {
      const mockDb = createMockSupabase();
      const listingWithoutDate: ParsedVehicleListing = {
        ...baseListing,
        listing: {
          ...baseListing.listing,
          sourceListingId: 'src-no-date-01',
          postedAt: null,
        },
      };

      // Initial sweep (first sighting)
      await ingestDealerListings({
        dealerId: mockDealerId,
        sourceId: mockSourceId,
        parsedListings: [listingWithoutDate],
        sweepTimestamp: '2026-10-15T09:00:00.000Z',
        supabaseClient: mockDb,
      });

      expect(mockDb.tables.dealer_listings[0].posted_at).toBe('2026-10-15T09:00:00.000Z');
      expect(mockDb.tables.dealer_listings[0].first_observed_at).toBe('2026-10-15T09:00:00.000Z');

      // Subsequent sweep 5 days later
      await ingestDealerListings({
        dealerId: mockDealerId,
        sourceId: mockSourceId,
        parsedListings: [listingWithoutDate],
        sweepTimestamp: '2026-10-20T10:00:00.000Z',
        supabaseClient: mockDb,
      });

      // posted_at must remain the initial sighting date (2026-10-15), NEVER updated_at or last_observed_at (2026-10-20)
      expect(mockDb.tables.dealer_listings[0].posted_at).toBe('2026-10-15T09:00:00.000Z');
      expect(mockDb.tables.dealer_listings[0].last_observed_at).toBe('2026-10-20T10:00:00.000Z');
    });
  });
});
