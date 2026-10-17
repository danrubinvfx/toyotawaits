/**
 * tests/discovery/scheduled-poll.test.ts
 *
 * Sprint 6: Private Trial Runner & Audit Telemetry Tests (Gate 2 Readiness)
 * Master Plan V3.2 Page 2 & Appendix B
 */

import { describe, expect, it, vi } from 'vitest';
import {
  runScheduledSweep,
  USER_AGENT_AUDITOR,
  SweepSourceConfig,
} from '../../lib/discovery/runners/scheduled-poll';
import { generateTrialReportMetrics } from '../../scripts/discovery/generate-trial-report';
import {
  DealerListing,
  SourceHealthLog,
  StatusEvent,
} from '../../lib/discovery/types';

/**
 * In-memory mock database client simulating source_health_logs persistence.
 */
function createMockTelemetryDb() {
  const healthLogs: any[] = [];
  return {
    healthLogs,
    from: (tableName: string) => {
      let pendingInsert: any = null;
      const builder: any = {
        insert: (data: any) => {
          pendingInsert = data;
          const items = Array.isArray(data) ? data : [data];
          healthLogs.push(...items);
          return builder;
        },
        select: () => builder,
        then: (resolve: any) => resolve({ data: pendingInsert, error: null }),
      };
      return builder;
    },
  };
}

describe('Sprint 6: Scheduled Sweep Runner & Gate 2 Telemetry', () => {
  const mockConvertusSamplePayload = {
    total: 2,
    page: 1,
    per_page: 10,
    vehicles: [
      {
        id: 'convertus-1250-01',
        vin: '2T3P1RFV5TC112233',
        year: 2026,
        make: 'Toyota',
        model: 'RAV4 Hybrid',
        trim: 'XSE',
        stock_number: 'STK-01',
        vdp_url: 'https://www.jptoyotadowntown.com/inventory/rav4-hybrid-01',
        status: 'in_stock',
        in_transit: 0,
        pricing: {
          msrp: 47550,
          asking_price: 48995,
          final_price: 48995,
        },
      },
      {
        id: 'convertus-1250-02',
        vin: '4T1B11HK5SU445566',
        year: 2026,
        make: 'Toyota',
        model: 'Camry Hybrid',
        trim: 'SE',
        stock_number: 'STK-02',
        vdp_url: 'https://www.jptoyotadowntown.com/inventory/camry-hybrid-02',
        status: 'in_transit',
        in_transit: 1,
        pricing: {
          msrp: 38500,
          asking_price: 38500,
          final_price: 38500,
        },
      },
    ],
  };

  const testSourceConfig: SweepSourceConfig = {
    sourceId: 'source-test-convertus',
    sourceCode: 'test-toyota-convertus',
    dealerId: 'dealer-test-downtown',
    platform: 'convertus',
    endpointUrl: 'https://example.com/api/vehicles?dealer=test',
    isActive: true,
  };

  // ===========================================================================
  // 1. Scheduled Sweep Runner Execution Tests
  // ===========================================================================
  describe('Scheduled Sweep Runner Execution', () => {
    it('executes scheduled sweep with polite User-Agent and logs success telemetry', async () => {
      const mockDb = createMockTelemetryDb();

      let capturedUserAgent: string | null = null;
      const mockFetcher = vi.fn(async (url: string, init?: RequestInit) => {
        capturedUserAgent = (init?.headers as Record<string, string>)?.['User-Agent'] || null;
        return new Response(JSON.stringify(mockConvertusSamplePayload), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      });

      const summary = await runScheduledSweep({
        sources: [testSourceConfig],
        fetcher: mockFetcher,
        db: mockDb,
        timeoutMs: 3000,
      });

      // Verify polite operating safeguard
      expect(capturedUserAgent).toBe(USER_AGENT_AUDITOR);

      // Verify summary results
      expect(summary.sourcesChecked).toBe(1);
      expect(summary.successCount).toBe(1);
      expect(summary.failureCount).toBe(0);
      expect(summary.totalListingsIngested).toBe(2);

      // Verify health log entry
      expect(summary.telemetryLogs).toHaveLength(1);
      const log = summary.telemetryLogs[0];
      expect(log.status).toBe('success');
      expect(log.httpStatus).toBe(200);
      expect(log.itemsObserved).toBe(2);
      expect(log.quarantinedItems).toBe(0);
      expect(log.errorMessage).toBeNull();

      // Verify DB persistence
      expect(mockDb.healthLogs).toHaveLength(1);
      expect(mockDb.healthLogs[0].status).toBe('success');
    });

    it('retries on transient failure with backoff and logs timeout if endpoint unreached', async () => {
      const mockDb = createMockTelemetryDb();

      // Simulates AbortController timeout on all attempts
      let attemptCount = 0;
      const mockTimeoutFetcher = vi.fn(async () => {
        attemptCount++;
        const err = new Error('The operation was aborted');
        err.name = 'AbortError';
        throw err;
      });

      const summary = await runScheduledSweep({
        sources: [testSourceConfig],
        fetcher: mockTimeoutFetcher,
        db: mockDb,
        timeoutMs: 100,
        maxRetries: 2,
        initialBackoffMs: 10,
      });

      expect(attemptCount).toBe(3); // 1 initial + 2 retries
      expect(summary.failureCount).toBe(1);
      expect(summary.successCount).toBe(0);

      const log = summary.telemetryLogs[0];
      expect(log.status).toBe('timeout');
      expect(log.errorMessage).toContain('aborted');
      expect(mockDb.healthLogs[0].status).toBe('timeout');
    });

    it('flags rate_limited status on HTTP 429 without unneeded retries', async () => {
      const mockDb = createMockTelemetryDb();

      const mock429Fetcher = vi.fn(async () => {
        return new Response('Rate limit exceeded', {
          status: 429,
          statusText: 'Too Many Requests',
        });
      });

      const summary = await runScheduledSweep({
        sources: [testSourceConfig],
        fetcher: mock429Fetcher,
        db: mockDb,
        maxRetries: 2,
      });

      expect(summary.failureCount).toBe(1);
      expect(summary.telemetryLogs[0].status).toBe('rate_limited');
      expect(summary.telemetryLogs[0].httpStatus).toBe(429);
    });

    it('flags degraded status when malformed items are quarantined during parse', async () => {
      const payloadWithMalformed = {
        total: 2,
        vehicles: [
          mockConvertusSamplePayload.vehicles[0],
          { id: 'bad-unit' }, // Missing required fields -> quarantined
        ],
      };

      const mockFetcher = vi.fn(async () => {
        return new Response(JSON.stringify(payloadWithMalformed), { status: 200 });
      });

      const summary = await runScheduledSweep({
        sources: [testSourceConfig],
        fetcher: mockFetcher,
      });

      expect(summary.successCount).toBe(1);
      expect(summary.telemetryLogs[0].status).toBe('degraded');
      expect(summary.telemetryLogs[0].itemsObserved).toBe(1);
      expect(summary.telemetryLogs[0].quarantinedItems).toBe(1);
    });
  });

  // ===========================================================================
  // 2. Audit Telemetry & Gate 2 Metric Calculation Tests
  // ===========================================================================
  describe('Gate 2 Trial Metric Calculations', () => {
    it('verifies Gate 2 uptime target pass (>= 95%) vs failure (< 95%)', () => {
      const now = new Date();

      // Case 1: 19 success + 1 failure = 95.0% -> PASS
      const passingLogs: SourceHealthLog[] = Array.from({ length: 20 }, (_, i) => ({
        id: `log-pass-${i}`,
        sourceId: 'src-1',
        checkTimestamp: now.toISOString(),
        status: i === 0 ? 'failure' : 'success',
        itemsObserved: 10,
        quarantinedItems: 0,
        createdAt: now.toISOString(),
      }));

      const passMetrics = generateTrialReportMetrics({
        healthLogs: passingLogs,
        listings: [],
        now,
      });

      expect(passMetrics.uptimePercentage).toBe(95.0);
      expect(passMetrics.gate2UptimeTargetMet).toBe(true);

      // Case 2: 18 success + 2 failure = 90.0% -> FAIL
      const failingLogs: SourceHealthLog[] = Array.from({ length: 20 }, (_, i) => ({
        id: `log-fail-${i}`,
        sourceId: 'src-1',
        checkTimestamp: now.toISOString(),
        status: i < 2 ? 'failure' : 'success',
        itemsObserved: 10,
        quarantinedItems: 0,
        createdAt: now.toISOString(),
      }));

      const failMetrics = generateTrialReportMetrics({
        healthLogs: failingLogs,
        listings: [],
        now,
      });

      expect(failMetrics.uptimePercentage).toBe(90.0);
      expect(failMetrics.gate2UptimeTargetMet).toBe(false);
    });

    it('accurately computes observation totals, unique vehicles, and status transitions', () => {
      const now = new Date();
      const logs: SourceHealthLog[] = [
        {
          id: 'log-1',
          sourceId: 'src-1',
          checkTimestamp: now.toISOString(),
          status: 'success',
          itemsObserved: 25,
          quarantinedItems: 0,
          createdAt: now.toISOString(),
        },
        {
          id: 'log-2',
          sourceId: 'src-1',
          checkTimestamp: now.toISOString(),
          status: 'success',
          itemsObserved: 30,
          quarantinedItems: 0,
          createdAt: now.toISOString(),
        },
      ];

      const listings: DealerListing[] = [
        {
          id: 'l-1',
          dealerId: 'dealer-1',
          vehicleId: 'v-1',
          sourceListingId: 'src-l-1',
          vdpUrl: 'https://dealer.ca/v-1',
          currentStatus: 'Advertised - availability unconfirmed' as any,
          firstObservedAt: now.toISOString(),
          lastObservedAt: now.toISOString(),
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: 'l-2',
          dealerId: 'dealer-1',
          vehicleId: 'v-2',
          sourceListingId: 'src-l-2',
          vdpUrl: 'https://dealer.ca/v-2',
          currentStatus: 'Incoming availability unconfirmed' as any,
          firstObservedAt: now.toISOString(),
          lastObservedAt: now.toISOString(),
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
      ];

      const statusEvents: StatusEvent[] = [
        {
          id: 'evt-1',
          dealerListingId: 'l-1',
          previousStatus: null,
          newStatus: 'Advertised - availability unconfirmed' as any,
          transitionReason: 'First observed',
          eventTimestamp: now.toISOString(),
          createdAt: now.toISOString(),
        },
      ];

      const metrics = generateTrialReportMetrics({
        healthLogs: logs,
        listings,
        statusEvents,
        now,
      });

      expect(metrics.totalObservations).toBe(55);
      expect(metrics.uniqueVehiclesObserved).toBe(2);
      expect(metrics.statusTransitionsCount).toBe(1);
      expect(metrics.breakdownByStatus['Advertised - availability unconfirmed']).toBe(1);
      expect(metrics.breakdownByStatus['Incoming availability unconfirmed']).toBe(1);
    });

    it('verifies 100% traceability score when all required evidence dimensions are present', () => {
      const now = new Date();
      const compliantListings: DealerListing[] = [
        {
          id: 'l-1',
          dealerId: 'dealer-1',
          vehicleId: 'v-1',
          sourceListingId: 'src-l-1',
          vdpUrl: 'https://dealer.ca/1',
          currentStatus: 'Advertised - availability unconfirmed' as any,
          lastObservedAt: now.toISOString(),
          firstObservedAt: now.toISOString(),
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
      ];

      const metrics = generateTrialReportMetrics({
        healthLogs: [],
        listings: compliantListings,
        now,
      });

      expect(metrics.traceabilityScore).toBe(100);
      expect(metrics.gate2TraceabilityMet).toBe(true);
    });

    it('flags traceability failure (< 100%) if any listing lacks canonical dealer URL or timestamp', () => {
      const now = new Date();
      const incompleteListings: DealerListing[] = [
        {
          id: 'l-compliant',
          dealerId: 'dealer-1',
          vehicleId: 'v-1',
          sourceListingId: 'src-1',
          vdpUrl: 'https://dealer.ca/1',
          currentStatus: 'Advertised - availability unconfirmed' as any,
          lastObservedAt: now.toISOString(),
          firstObservedAt: now.toISOString(),
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: 'l-missing-link',
          dealerId: 'dealer-1',
          vehicleId: 'v-2',
          sourceListingId: 'src-2',
          vdpUrl: null, // Missing canonical link
          currentStatus: 'Advertised - availability unconfirmed' as any,
          lastObservedAt: now.toISOString(),
          firstObservedAt: now.toISOString(),
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
      ];

      const metrics = generateTrialReportMetrics({
        healthLogs: [],
        listings: incompleteListings,
        now,
      });

      expect(metrics.traceabilityScore).toBe(50.0);
      expect(metrics.gate2TraceabilityMet).toBe(false);
    });
  });
});
