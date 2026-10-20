/**
 * tests/discovery/staleness.test.ts
 *
 * Verifies strict 48-hour staleness expiration rule for public inventory listings.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/inventory/route';
import * as serverSupabase from '@/lib/supabase/server';
import { evaluateSweepStaleness } from '@/../lib/discovery/services/staleness-service';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { InventoryExplorer } from '@/components/discovery/InventoryExplorer';
import { VehicleListingCard } from '@/components/discovery/VehicleListingCard';

describe('Inventory 48-Hour Staleness Expiration & Filtering', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.NEXT_PUBLIC_ENABLE_INVENTORY_DISCOVERY = 'true';
  });

  describe('GET /api/inventory Staleness Hard Cutoff', () => {
    it('omits listings older than 48 hours and stale/removed records from public feed', async () => {
      vi.spyOn(serverSupabase, 'isLiveSupabaseConfigured').mockReturnValue(true);

      const now = Date.now();
      const freshTimestamp = new Date(now - 4 * 3600 * 1000).toISOString(); // 4 hours ago
      const staleTimestamp = new Date(now - 50 * 3600 * 1000).toISOString(); // 50 hours ago

      const mockData = [
        {
          id: 'fresh-listing-01',
          stock_number: 'FRESH-01',
          vdp_url: 'https://www.jptoyota-downtown.com/vehicles/fresh/',
          current_status: 'Advertised - availability unconfirmed',
          last_observed_at: freshTimestamp,
          vehicle: {
            make: 'Toyota',
            model: 'RAV4 Hybrid',
            trim: 'XSE',
            model_year: 2026,
            vin: '2T3P1RFV5TC000001',
          },
          dealer: { name: 'Jim Pattison Toyota Downtown', city: 'Vancouver', province: 'BC' },
          observations: [{ selling_price: 49000, msrp: 49000, observed_at: freshTimestamp }],
        },
        {
          id: 'old-listing-02',
          stock_number: 'OLD-02',
          vdp_url: 'https://www.jptoyota-downtown.com/vehicles/old/',
          current_status: 'Advertised - availability unconfirmed',
          last_observed_at: staleTimestamp, // > 48h
          vehicle: {
            make: 'Toyota',
            model: 'Sienna',
            trim: 'LE',
            model_year: 2026,
            vin: '2T3P1RFV5TC000002',
          },
          dealer: { name: 'Jim Pattison Toyota Downtown', city: 'Vancouver', province: 'BC' },
          observations: [{ selling_price: 52000, msrp: 52000, observed_at: staleTimestamp }],
        },
        {
          id: 'stale-status-listing-03',
          stock_number: 'STALE-03',
          vdp_url: 'https://www.jptoyota-downtown.com/vehicles/stale/',
          current_status: 'stale',
          last_observed_at: freshTimestamp,
          vehicle: {
            make: 'Toyota',
            model: 'Tacoma',
            trim: 'TRD',
            model_year: 2026,
            vin: '2T3P1RFV5TC000003',
          },
          dealer: { name: 'Jim Pattison Toyota Downtown', city: 'Vancouver', province: 'BC' },
          observations: [{ selling_price: 58000, msrp: 58000, observed_at: freshTimestamp }],
        },
        {
          id: 'removed-status-listing-04',
          stock_number: 'REMOVED-04',
          vdp_url: 'https://www.jptoyota-downtown.com/vehicles/removed/',
          current_status: 'removed',
          last_observed_at: freshTimestamp,
          vehicle: {
            make: 'Toyota',
            model: 'Prius Prime',
            trim: 'SE',
            model_year: 2026,
            vin: '2T3P1RFV5TC000004',
          },
          dealer: { name: 'Jim Pattison Toyota Downtown', city: 'Vancouver', province: 'BC' },
          observations: [{ selling_price: 42000, msrp: 42000, observed_at: freshTimestamp }],
        },
      ];

      const mockQueryBuilder: any = {
        gte: vi.fn().mockReturnThis(),
        not: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      };

      vi.spyOn(serverSupabase, 'createServerClient').mockReturnValue({
        from: vi.fn(() => ({
          select: vi.fn(() => mockQueryBuilder),
        })),
      } as any);

      // Public request without includeStale
      const response = await GET(new Request('http://localhost:3000/api/inventory'));
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);

      // Verify that query called gte and not for 48h filter
      expect(mockQueryBuilder.gte).toHaveBeenCalledWith(
        'last_observed_at',
        expect.any(String)
      );
      expect(mockQueryBuilder.not).toHaveBeenCalledWith(
        'current_status',
        'in',
        expect.stringContaining('stale')
      );

      // Verify returned listings contain ONLY the fresh active listing
      expect(json.count).toBe(1);
      expect(json.listings).toHaveLength(1);
      expect(json.listings[0].id).toBe('fresh-listing-01');
      expect(json.countsByModel['RAV4 Hybrid']).toBe(1);
      expect(json.countsByModel['Sienna']).toBeUndefined();
    });

    it('allows includeStale=true override for audit and admin views', async () => {
      vi.spyOn(serverSupabase, 'isLiveSupabaseConfigured').mockReturnValue(true);

      const now = Date.now();
      const freshTimestamp = new Date(now - 4 * 3600 * 1000).toISOString();
      const staleTimestamp = new Date(now - 50 * 3600 * 1000).toISOString();

      const mockData = [
        {
          id: 'fresh-listing-01',
          stock_number: 'FRESH-01',
          vdp_url: 'https://www.jptoyota-downtown.com/vehicles/fresh/',
          current_status: 'Advertised - availability unconfirmed',
          last_observed_at: freshTimestamp,
          vehicle: { make: 'Toyota', model: 'RAV4 Hybrid', trim: 'XSE', model_year: 2026 },
          dealer: { name: 'Jim Pattison Toyota Downtown', city: 'Vancouver', province: 'BC' },
          observations: [{ selling_price: 49000, msrp: 49000, observed_at: freshTimestamp }],
        },
        {
          id: 'old-listing-02',
          stock_number: 'OLD-02',
          vdp_url: 'https://www.jptoyota-downtown.com/vehicles/old/',
          current_status: 'Advertised - availability unconfirmed',
          last_observed_at: staleTimestamp,
          vehicle: { make: 'Toyota', model: 'Sienna', trim: 'LE', model_year: 2026 },
          dealer: { name: 'Jim Pattison Toyota Downtown', city: 'Vancouver', province: 'BC' },
          observations: [{ selling_price: 52000, msrp: 52000, observed_at: staleTimestamp }],
        },
      ];

      const mockQueryBuilder: any = {
        gte: vi.fn().mockReturnThis(),
        not: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      };

      vi.spyOn(serverSupabase, 'createServerClient').mockReturnValue({
        from: vi.fn(() => ({
          select: vi.fn(() => mockQueryBuilder),
        })),
      } as any);

      // Audit request with includeStale=true
      const response = await GET(
        new Request('http://localhost:3000/api/inventory?includeStale=true')
      );
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);

      // gte and not should NOT be called when includeStale is enabled
      expect(mockQueryBuilder.gte).not.toHaveBeenCalled();
      expect(mockQueryBuilder.not).not.toHaveBeenCalled();

      // All listings returned
      expect(json.count).toBe(2);
      expect(json.listings).toHaveLength(2);
    });
  });

  describe('Staleness Transition in Sweep Engine', () => {
    it('transitions missing listing older than 48 hours to removed', async () => {
      const mockDb: any = {
        tables: {
          dealer_listings: [
            {
              id: 'listing-old-01',
              dealer_id: 'dealer-jp-downtown',
              source_listing_id: 'src-old-99',
              current_status: 'Advertised - availability unconfirmed',
              consecutive_missed_sweeps: 1,
              last_observed_at: new Date(Date.now() - 50 * 3600 * 1000).toISOString(),
            },
          ],
          status_events: [],
        },
        from(table: string) {
          return {
            select: () => ({
              eq: () => ({
                neq: () => Promise.resolve({ data: mockDb.tables[table], error: null }),
              }),
            }),
            insert: (row: any) => {
              mockDb.tables[table].push(row);
              return Promise.resolve({ error: null });
            },
            update: (patch: any) => ({
              eq: (_col: string, val: string) => {
                const item = mockDb.tables[table].find((r: any) => r.id === val);
                if (item) Object.assign(item, patch);
                return Promise.resolve({ error: null });
              },
            }),
          };
        },
      };

      const sweepTime = new Date().toISOString();
      const summary = await evaluateSweepStaleness({
        dealerId: 'dealer-jp-downtown',
        activeSourceListingIdsInSweep: [], // missing from sweep
        sweepTimestamp: sweepTime,
        supabaseClient: mockDb,
      });

      expect(summary.totalActiveEvaluated).toBe(1);
      expect(summary.removedTransitionsCount).toBe(1);
      expect(mockDb.tables.dealer_listings[0].current_status).toBe('removed');

      // Verify status event logged with transition to 'removed'
      const lastEvent = mockDb.tables.status_events[mockDb.tables.status_events.length - 1];
      expect(lastEvent.new_status).toBe('removed');
      expect(lastEvent.transition_reason).toContain('>48 hours ago');
    });

    it('transitions missing listing missing across sweeps within 48h to stale and updates stale_at', async () => {
      const mockDb: any = {
        tables: {
          dealer_listings: [
            {
              id: 'listing-recent-01',
              dealer_id: 'dealer-jp-downtown',
              source_listing_id: 'src-recent-99',
              current_status: 'Advertised - availability unconfirmed',
              consecutive_missed_sweeps: 1, // already missed once, this is sweep 2
              last_observed_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(), // 12 hours ago
            },
          ],
          status_events: [],
        },
        from(table: string) {
          return {
            select: () => ({
              eq: () => ({
                neq: () => Promise.resolve({ data: mockDb.tables[table], error: null }),
              }),
            }),
            insert: (row: any) => {
              mockDb.tables[table].push(row);
              return Promise.resolve({ error: null });
            },
            update: (patch: any) => ({
              eq: (_col: string, val: string) => {
                const item = mockDb.tables[table].find((r: any) => r.id === val);
                if (item) Object.assign(item, patch);
                return Promise.resolve({ error: null });
              },
            }),
          };
        },
      };

      const sweepTime = new Date().toISOString();
      const summary = await evaluateSweepStaleness({
        dealerId: 'dealer-jp-downtown',
        activeSourceListingIdsInSweep: [],
        sweepTimestamp: sweepTime,
        supabaseClient: mockDb,
      });

      expect(summary.staleTransitionsCount).toBe(1);
      expect(mockDb.tables.dealer_listings[0].current_status).toBe(
        'No longer observed / stale'
      );
      expect(mockDb.tables.dealer_listings[0].stale_at).toBe(sweepTime);
    });
  });

  describe('Client UI Warning Badge & Status Filtering', () => {
    it('displays subtle visual warning badge on listings confirmed > 24 hours ago', () => {
      const check36hAgo = new Date(Date.now() - 36 * 3600 * 1000).toISOString();
      render(
        <VehicleListingCard
          id="listing-card-stale-01"
          make="Toyota"
          model="Corolla"
          modelYear={2026}
          dealerName="Jim Pattison Toyota Downtown"
          status="Advertised - availability unconfirmed"
          lastChecked={check36hAgo}
        />
      );

      const warningBadge = screen.getByTestId('staleness-warning-badge');
      expect(warningBadge).toBeInTheDocument();
      expect(warningBadge).toHaveTextContent(/⚠️ Last confirmed 36h ago/i);
      expect(warningBadge).toHaveClass('text-amber-500/80');
    });

    it('defaults to Active / Verified Live status and only displays stale listings under All Statuses', () => {
      render(<InventoryExplorer />);

      // Default state: Active / Verified Live is selected
      const statusSelect = screen.getByTestId('filter-status-select');
      expect(statusSelect).toHaveValue('advertised');

      // The stale sample listing (jp-corolla-stale-01, 36h old, 'No longer observed / stale') is filtered out by default
      expect(screen.queryByTestId('listing-card-jp-corolla-stale-01')).not.toBeInTheDocument();

      // Total results counter strictly reflects live listings (7 units)
      expect(screen.getByTestId('filter-results-count')).toHaveTextContent('7 units observed');

      // Now switch status to "All Statuses"
      fireEvent.change(statusSelect, { target: { value: 'all' } });

      // Stale listing is now displayed with staleness warning badge
      expect(screen.getByTestId('listing-card-jp-corolla-stale-01')).toBeInTheDocument();
      expect(screen.getByText(/⚠️ Last confirmed 36h ago/i)).toBeInTheDocument();
    });
  });
});
