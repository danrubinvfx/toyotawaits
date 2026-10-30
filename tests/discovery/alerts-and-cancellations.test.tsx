import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as fs from 'fs';
import * as path from 'path';
import {
  calculateDaysOnLot,
  isOnLotStatus,
  evaluateListingLifecycle,
  detectAndTransitionSoldUnits,
  dispatchPendingAlerts,
} from '../../lib/discovery/services/lifecycle-service';
import { ingestDealerListings } from '../../lib/discovery/services/ingestion-service';
import { NormalizedListingStatus } from '../../lib/discovery/types';
import { InventoryVehicleCard } from '@/components/discovery/InventoryVehicleCard';
import { InventoryAlertModal } from '@/components/discovery/InventoryAlertModal';
import { InventoryExplorer } from '@/components/discovery/InventoryExplorer';
import { POST as subscribeRoutePost } from '@/app/api/alerts/subscribe/route';
import * as serverSupabase from '@/lib/supabase/server';

describe('Allocation Drop Alerts & Likely Cancellation Tracker', () => {
  // ===========================================================================
  // 1. Database Migration Verification
  // ===========================================================================
  describe('1. Migration 20261025000001_alerts_and_cancellations.sql', () => {
    const migrationPath = path.resolve(
      process.cwd(),
      'supabase/migrations/20261025000001_alerts_and_cancellations.sql'
    );

    it('creates inventory_alert_subscriptions and adds cancellation/lifecycle columns with RLS and Data API Grants', () => {
      expect(fs.existsSync(migrationPath)).toBe(true);
      const sql = fs.readFileSync(migrationPath, 'utf-8');

      // Table & Columns
      expect(sql).toMatch(/CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+public\.inventory_alert_subscriptions/i);
      expect(sql).toContain('email text NOT NULL');
      expect(sql).toContain('model text NOT NULL');
      expect(sql).toContain("powertrain text DEFAULT 'ALL'");
      expect(sql).toContain("trim text DEFAULT 'ALL'");
      expect(sql).toContain("region text DEFAULT 'Lower Mainland, BC'");
      expect(sql).toContain('is_active boolean DEFAULT true');
      expect(sql).toContain("token text UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex')");
      expect(sql).toContain('last_notified_at timestamptz');

      // Cancellation & Lifecycle columns
      expect(sql).toContain('is_likely_cancellation boolean DEFAULT false');
      expect(sql).toContain("lifecycle_status text DEFAULT 'active'");
      expect(sql).toContain('days_on_lot integer DEFAULT 0');
      expect(sql).toContain('sold_at timestamptz');

      // RLS & Post-October 30 Grants
      expect(sql).toMatch(/ALTER\s+TABLE\s+public\.inventory_alert_subscriptions\s+ENABLE\s+ROW\s+LEVEL\s+SECURITY;/i);
      expect(sql).toMatch(/GRANT\s+INSERT\s+ON\s+TABLE\s+public\.inventory_alert_subscriptions\s+TO\s+anon,\s*authenticated;/i);
      expect(sql).toMatch(/GRANT\s+ALL\s+ON\s+TABLE\s+public\.inventory_alert_subscriptions\s+TO\s+service_role;/i);
    });
  });

  // ===========================================================================
  // 2. Cancellation & Velocity Logic (lifecycle-service.ts)
  // ===========================================================================
  describe('2. Cancellation & Velocity Logic (lifecycle-service.ts)', () => {
    it('calculates days_on_lot from difference between NOW() and posted_at / first_seen_at', () => {
      const now = '2026-10-25T12:00:00Z';
      expect(calculateDaysOnLot('2026-10-18T12:00:00Z', now)).toBe(7);
      expect(calculateDaysOnLot('2026-10-20T12:00:00Z', now)).toBe(5);
      expect(calculateDaysOnLot('2026-10-23T12:00:00Z', now)).toBe(2);
      expect(calculateDaysOnLot(null, now)).toBe(0);
    });

    it('flags is_likely_cancellation = true when status is on_lot (or arrival confirmed) and days_on_lot >= 5', () => {
      const now = '2026-10-25T12:00:00Z';

      // On lot for 6 days -> likely cancellation = true
      const onLot6d = evaluateListingLifecycle({
        status: 'on_lot',
        postedAt: '2026-10-19T12:00:00Z',
        now,
      });
      expect(onLot6d.daysOnLot).toBe(6);
      expect(onLot6d.isLikelyCancellation).toBe(true);
      expect(onLot6d.lifecycleStatus).toBe('active');

      // Advertised (on lot) for 5 days -> likely cancellation = true
      const advertised5d = evaluateListingLifecycle({
        status: NormalizedListingStatus.ADVERTISED_UNCONFIRMED,
        postedAt: '2026-10-20T12:00:00Z',
        now,
      });
      expect(advertised5d.daysOnLot).toBe(5);
      expect(advertised5d.isLikelyCancellation).toBe(true);

      // On lot for 3 days (< 5 days) -> likely cancellation = false
      const onLot3d = evaluateListingLifecycle({
        status: 'on_lot',
        postedAt: '2026-10-22T12:00:00Z',
        now,
      });
      expect(onLot3d.daysOnLot).toBe(3);
      expect(onLot3d.isLikelyCancellation).toBe(false);

      // Incoming / In Transit for 10 days -> likely cancellation = false
      const incoming10d = evaluateListingLifecycle({
        status: NormalizedListingStatus.INCOMING_UNCONFIRMED,
        postedAt: '2026-10-15T12:00:00Z',
        now,
      });
      expect(incoming10d.daysOnLot).toBe(10);
      expect(incoming10d.isLikelyCancellation).toBe(false);
    });

    it('transitions unobserved active database VINs for swept dealers to lifecycle_status = sold', async () => {
      const mockListings = [
        {
          id: 'listing-observed-1',
          dealer_id: 'dealer-downtown',
          source_listing_id: 'src-1',
          vin: '2T3P1RFV5TC111111',
          current_status: NormalizedListingStatus.ADVERTISED_UNCONFIRMED,
          lifecycle_status: 'active',
          last_observed_at: '2026-10-25T12:05:00Z', // observed after sweepStartTime
        },
        {
          id: 'listing-unobserved-2',
          dealer_id: 'dealer-downtown',
          source_listing_id: 'src-2',
          vin: '2T3P1RFV5TC222222',
          current_status: NormalizedListingStatus.ADVERTISED_UNCONFIRMED,
          lifecycle_status: 'active',
          last_observed_at: '2026-10-24T08:00:00Z', // older than sweepStartTime
        },
        {
          id: 'listing-unobserved-other-dealer',
          dealer_id: 'dealer-unswept',
          source_listing_id: 'src-3',
          vin: '2T3P1RFV5TC333333',
          current_status: NormalizedListingStatus.ADVERTISED_UNCONFIRMED,
          lifecycle_status: 'active',
          last_observed_at: '2026-10-24T08:00:00Z',
        },
      ];

      const mockSupabase = {
        from: () => {
          let targetId: string | null = null;
          let pendingUpdates: any = null;
          const builder: any = {
            select: () => builder,
            in: () => builder,
            update: (u: any) => {
              pendingUpdates = u;
              return builder;
            },
            eq: (_col: string, val: string) => {
              targetId = val;
              return builder;
            },
            then: (resolve: any) => {
              if (pendingUpdates && targetId) {
                const row = mockListings.find((r) => r.id === targetId);
                if (row) Object.assign(row, pendingUpdates);
                return resolve({ data: [row], error: null });
              }
              return resolve({ data: mockListings, error: null });
            },
          };
          return builder;
        },
      };

      const summary = await detectAndTransitionSoldUnits({
        sweptDealerIds: ['dealer-downtown'],
        sweepStartTime: '2026-10-25T12:00:00Z',
        now: '2026-10-25T12:10:00Z',
        supabaseClient: mockSupabase,
      });

      expect(summary.evaluatedCount).toBe(2);
      expect(summary.transitionedToSoldCount).toBe(1);
      expect(summary.soldListingIds).toEqual(['listing-unobserved-2']);
      expect(summary.soldVins).toEqual(['2T3P1RFV5TC222222']);

      expect(mockListings[0].lifecycle_status).toBe('active');
      expect(mockListings[1].lifecycle_status).toBe('sold');
      expect((mockListings[1] as any).sold_at).toBe('2026-10-25T12:10:00.000Z');
      expect(mockListings[2].lifecycle_status).toBe('active'); // unswept dealer untouched
    });
  });

  // ===========================================================================
  // 3. "Likely Cancellation" Badge (InventoryVehicleCard.tsx)
  // ===========================================================================
  describe('3. "Likely Cancellation" Badge on InventoryVehicleCard', () => {
    const baseProps = {
      id: 'cancel-card-01',
      make: 'Toyota',
      model: 'Sienna',
      trim: 'XSE AWD 7-Passenger',
      modelYear: 2026,
      vin: '5TDGSKFC1TS289848',
      isProvisionalVin: false,
      dealerName: 'Jim Pattison Toyota Surrey',
      dealerCity: 'Surrey',
      dealerProvince: 'BC',
      status: 'Advertised - availability unconfirmed',
      lastChecked: new Date().toISOString(),
      msrp: 58450,
      sellingPrice: 58450,
    };

    it('renders prominent amber cancellation badge and explanatory sub-note when is_likely_cancellation is true', () => {
      render(
        <InventoryVehicleCard
          {...baseProps}
          is_likely_cancellation={true}
          days_on_lot={8}
        />
      );

      const badge = screen.getByTestId('likely-cancellation-badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('⚡ Likely Available Cancellation (8d on lot)');
      expect(badge.className).toContain('bg-amber-500/10');
      expect(badge.className).toContain('text-amber-400');
      expect(badge.className).toContain('border-amber-500/30');

      const subnote = screen.getByTestId('likely-cancellation-subnote');
      expect(subnote).toHaveTextContent(
        'Vehicles on lot over 5 days are frequently canceled customer allocations ready for immediate deposit.'
      );
    });

    it('does not render cancellation badge when is_likely_cancellation is false', () => {
      render(
        <InventoryVehicleCard
          {...baseProps}
          is_likely_cancellation={false}
          days_on_lot={2}
        />
      );

      expect(screen.queryByTestId('likely-cancellation-badge')).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // 4. "Notify Me When In Stock" Modal & API Route
  // ===========================================================================
  describe('4. InventoryAlertModal & POST /api/alerts/subscribe', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_ENABLE_INVENTORY_DISCOVERY = 'true';
      vi.restoreAllMocks();
    });

    it('opens InventoryAlertModal from "🔔 Get Drop Alerts" button in InventoryExplorer with pre-filled filter criteria', () => {
      render(<InventoryExplorer initialModel="Sienna" />);

      const alertBtn = screen.getByTestId('get-drop-alerts-btn');
      expect(alertBtn).toHaveTextContent('🔔 Get Drop Alerts');

      fireEvent.click(alertBtn);

      const modal = screen.getByTestId('inventory-alert-modal');
      expect(modal).toBeInTheDocument();

      const modelSelect = screen.getByTestId('alert-model-select') as HTMLSelectElement;
      expect(modelSelect.value).toBe('Sienna');

      expect(screen.getByTestId('alert-zero-pii-disclaimer')).toHaveTextContent(
        'We only use your email to alert you when a matching vehicle lands. Zero spam, unsubscribe anytime.'
      );
    });

    it('submits alert subscription via InventoryAlertModal and displays confirmation state', async () => {
      const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(
          JSON.stringify({
            success: true,
            message: "Drop alert active! We'll email buyer@example.ca as soon as a matching Tacoma (TRD Off-Road) lands.",
          }),
          { status: 201, headers: { 'Content-Type': 'application/json' } }
        )
      );

      const onClose = vi.fn();
      render(
        <InventoryAlertModal
          isOpen={true}
          onClose={onClose}
          initialModel="RAV4 Hybrid"
          initialTrim="XSE"
        />
      );

      // Pre-filled from props
      expect((screen.getByTestId('alert-model-select') as HTMLSelectElement).value).toBe(
        'RAV4 Hybrid'
      );
      expect((screen.getByTestId('alert-trim-input') as HTMLInputElement).value).toBe('XSE');

      // Toggle quick criteria to Tacoma + Limited
      fireEvent.click(screen.getByTestId('quick-model-tacoma'));
      fireEvent.click(screen.getByTestId('quick-trim-limited'));

      expect((screen.getByTestId('alert-model-select') as HTMLSelectElement).value).toBe('Tacoma');
      expect((screen.getByTestId('alert-trim-input') as HTMLInputElement).value).toBe('Limited');

      // Enter email & submit
      fireEvent.change(screen.getByTestId('alert-email-input'), {
        target: { value: 'buyer@example.ca' },
      });

      fireEvent.click(screen.getByTestId('alert-submit-btn'));

      await waitFor(() => {
        expect(screen.getByTestId('alert-success-state')).toBeInTheDocument();
      });

      expect(fetchMock).toHaveBeenCalledWith(
        '/api/alerts/subscribe',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('upserts into inventory_alert_subscriptions in POST /api/alerts/subscribe', async () => {
      const upsertedRecords: any[] = [];
      vi.spyOn(serverSupabase, 'isLiveSupabaseConfigured').mockReturnValue(true);
      vi.spyOn(serverSupabase, 'createServerClient').mockReturnValue({
        from: (table: string) => {
          expect(table).toBe('inventory_alert_subscriptions');
          return {
            upsert: (payload: any) => {
              upsertedRecords.push(payload);
              return {
                select: () => ({
                  single: async () => ({
                    data: { id: 'sub-uuid-1', token: 'tok-123', ...payload },
                    error: null,
                  }),
                }),
              };
            },
          };
        },
      } as any);

      const req = new Request('http://localhost:3000/api/alerts/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'User@Example.ca',
          model: 'Sienna',
          powertrain: 'Hybrid',
          trim: 'XSE',
          region: 'Lower Mainland, BC',
        }),
      });

      const res = await subscribeRoutePost(req);
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(upsertedRecords).toHaveLength(1);
      expect(upsertedRecords[0]).toEqual({
        email: 'user@example.ca',
        model: 'Sienna',
        powertrain: 'Hybrid',
        trim: 'XSE',
        region: 'Lower Mainland, BC',
        is_active: true,
      });
    });
  });

  // ===========================================================================
  // 5. Sweep Dispatcher Hook (dispatchPendingAlerts)
  // ===========================================================================
  describe('5. Sweep Dispatcher Hook (dispatchPendingAlerts)', () => {
    it('queries inventory_alert_subscriptions matching newlyInsertedVins.model and logs subscriber count', async () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const mockSubscriptions = [
        {
          id: 'sub-1',
          email: 'sienna-fan@example.ca',
          model: 'Sienna',
          trim: 'ALL',
          powertrain: 'ALL',
          is_active: true,
          token: 'tok-1',
        },
        {
          id: 'sub-2',
          email: 'sienna-xse@example.ca',
          model: 'Sienna',
          trim: 'XSE',
          powertrain: 'Hybrid',
          is_active: true,
          token: 'tok-2',
        },
        {
          id: 'sub-3',
          email: 'tacoma-buyer@example.ca',
          model: 'Tacoma',
          trim: 'ALL',
          powertrain: 'ALL',
          is_active: true,
          token: 'tok-3',
        },
      ];

      const mockSupabase = {
        from: (table: string) => {
          expect(table).toBe('inventory_alert_subscriptions');
          return {
            select: () => ({
              eq: async () => ({ data: mockSubscriptions, error: null }),
            }),
            update: () => ({
              eq: async () => ({ data: null, error: null }),
            }),
          };
        },
      };

      const summary = await dispatchPendingAlerts(
        [
          {
            vin: '5TDGSKFC1TS289848',
            model: 'Sienna',
            trim: 'XSE AWD',
            powertrain: 'Hybrid',
            dealerName: 'Jim Pattison Toyota Surrey',
            vdpUrl: 'https://www.jptoyota-surrey.com/vehicles/sienna-1',
          },
        ],
        { supabaseClient: mockSupabase, resendApiKey: '' }
      );

      expect(summary.vehiclesEvaluated).toBe(1);
      expect(summary.subscribersMatched).toBe(2);
      expect(logSpy).toHaveBeenCalledWith(
        '[Alert Worker] Found 2 subscribers matching 5TDGSKFC1TS289848 (Sienna XSE AWD)'
      );

      logSpy.mockRestore();
    });

    it('consolidates multiple vehicle matches into a single batch digest email per subscriber and audit dispatches per VIN', async () => {
      const dispatchedRows: any[] = [];
      const mockSubscriptions = [
        {
          id: 'sub-corolla-1',
          email: 'corolla-buyer@example.ca',
          model: 'Corolla Hatchback',
          trim: 'ALL',
          powertrain: 'ALL',
          is_active: true,
          token: 'tok-corolla-1',
        },
      ];

      const mockSupabase = {
        from: (table: string) => {
          if (table === 'inventory_alert_subscriptions') {
            return {
              select: () => ({
                eq: async () => ({ data: mockSubscriptions, error: null }),
              }),
              update: () => ({
                eq: async () => ({ data: null, error: null }),
              }),
            };
          }
          if (table === 'inventory_alert_dispatches') {
            return {
              select: () => ({
                eq: () => ({
                  eq: () => ({
                    maybeSingle: async () => ({ data: null, error: null }),
                  }),
                }),
              }),
              upsert: async (payload: any) => {
                dispatchedRows.push(payload);
                return { error: null };
              },
            };
          }
          return {};
        },
      };

      const mockFetcher = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'resend-msg-batch-999' }),
      });

      const summary = await dispatchPendingAlerts(
        [
          {
            vin: '2T1BURHE7TC111111',
            model: 'Corolla Hatchback',
            trim: 'SE Upgrade',
            powertrain: '2.0L FWD',
            modelYear: 2026,
            dealerName: 'Jim Pattison Toyota Surrey',
            dealerCity: 'Surrey, BC',
            sellingPrice: 31796,
            vdpUrl: 'https://dealer.ca/ch-1',
          },
          {
            vin: '2T1BURHE7TC222222',
            model: 'Corolla Hatchback',
            trim: 'XSE',
            powertrain: '2.0L FWD',
            modelYear: 2026,
            dealerName: 'Jim Pattison Toyota Downtown',
            dealerCity: 'Vancouver, BC',
            sellingPrice: 34500,
            vdpUrl: 'https://dealer.ca/ch-2',
          },
        ],
        {
          supabaseClient: mockSupabase,
          resendApiKey: 're_valid_test_key_123',
          fetcher: mockFetcher,
        }
      );

      expect(summary.vehiclesEvaluated).toBe(2);
      expect(summary.emailsSent).toBe(1); // 1 single batch digest email sent to subscriber
      expect(mockFetcher).toHaveBeenCalledTimes(1);

      // Verify sent email payload structure
      const fetchCallBody = JSON.parse(mockFetcher.mock.calls[0][1].body);
      expect(fetchCallBody.to).toEqual(['corolla-buyer@example.ca']);
      expect(fetchCallBody.subject).toBe(
        'Allocation Alert: 2 New Toyota Matches Observed (Corolla Hatchback)'
      );
      expect(fetchCallBody.html).toContain('2T1BURHE7TC111111');
      expect(fetchCallBody.html).toContain('2T1BURHE7TC222222');
      expect(fetchCallBody.html).toContain('2026 Corolla Hatchback SE Upgrade - 2.0L FWD');
      expect(fetchCallBody.html).toContain('2026 Corolla Hatchback XSE - 2.0L FWD');

      // Database Audit Dispatches: 2 individual rows inserted with shared Resend provider_message_id
      expect(dispatchedRows).toHaveLength(2);
      expect(dispatchedRows[0]).toEqual(
        expect.objectContaining({
          email: 'corolla-buyer@example.ca',
          vin: '2T1BURHE7TC111111',
          model: 'Corolla Hatchback',
          trim: 'SE Upgrade',
          dealer_name: 'Jim Pattison Toyota Surrey',
          provider_message_id: 'resend-msg-batch-999',
        })
      );
      expect(dispatchedRows[1]).toEqual(
        expect.objectContaining({
          email: 'corolla-buyer@example.ca',
          vin: '2T1BURHE7TC222222',
          model: 'Corolla Hatchback',
          trim: 'XSE',
          dealer_name: 'Jim Pattison Toyota Downtown',
          provider_message_id: 'resend-msg-batch-999',
        })
      );
    });
  });
});
