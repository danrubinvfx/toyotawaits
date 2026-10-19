import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/inventory/route';
import * as serverSupabase from '@/lib/supabase/server';

describe('GET /api/inventory Endpoint', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns fallback sample listings when live supabase is not configured', async () => {
    vi.spyOn(serverSupabase, 'isLiveSupabaseConfigured').mockReturnValue(false);

    const response = await GET();
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.source).toBe('sample_fallback');
    expect(Array.isArray(json.listings)).toBe(true);
    expect(json.count).toBeGreaterThan(0);
  });

  it('queries dealer_listings from Supabase and formats records with pricing when configured', async () => {
    vi.spyOn(serverSupabase, 'isLiveSupabaseConfigured').mockReturnValue(true);

    const mockData = [
      {
        id: 'mock-listing-01',
        stock_number: 'STK-9901',
        vdp_url: 'https://www.jptoyota-downtown.com/vehicles/2026/toyota/rav4/v123/',
        current_status: 'Advertised - availability unconfirmed',
        last_observed_at: '2026-10-18T20:00:00Z',
        vehicle: {
          make: 'Toyota',
          model: 'RAV4 Hybrid',
          trim: 'XSE AWD',
          model_year: 2026,
          vin: '2T3P1RFV5TC999999',
          provisional_id: null,
          powertrain: 'Hybrid 2.5L 4-Cyl',
          exteriorColor: 'Blueprint',
          drive_train: 'All Wheel Drive',
        },
        dealer: {
          name: 'Jim Pattison Toyota Downtown',
          city: 'Vancouver',
          province: 'BC',
        },
        observations: [
          {
            msrp: 47550,
            selling_price: 48995,
            mandatory_fees: 895,
            has_unverified_fees: false,
            observed_at: '2026-10-18T20:00:00Z',
          },
        ],
      },
    ];

    const mockOrder = vi.fn().mockResolvedValue({ data: mockData, error: null });
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });

    vi.spyOn(serverSupabase, 'createServerClient').mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === 'dealer_listings') {
          return { select: mockSelect };
        }
        return { select: vi.fn().mockReturnThis() };
      }),
    } as any);

    const response = await GET();
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.source).toBe('supabase_dealer_listings');
    expect(json.count).toBe(1);
    expect(json.listings[0].model).toBe('RAV4 Hybrid');
    expect(json.listings[0].trim).toBe('XSE AWD');
    expect(json.listings[0].sellingPrice).toBe(48995);
    expect(json.listings[0].hasUnverifiedFees).toBe(false);
  });
});
