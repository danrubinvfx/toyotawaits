import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/accessories/popular/route';
import * as serverLib from '@/lib/supabase/server';

describe('GET /api/accessories/popular', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns popularity counts from view_accessory_popularity_30d', async () => {
    const mockViewData = [
      { accessory_id: 'infotainment-screen-protector', click_count: 42 },
      { accessory_id: 'all-weather-floor-liners', click_count: 28 },
    ];

    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: mockViewData,
          error: null,
        }),
      }),
    };

    vi.spyOn(serverLib, 'isLiveSupabaseConfigured').mockReturnValue(true);
    vi.spyOn(serverLib, 'createServerClient').mockReturnValue(mockSupabase as any);

    const res = await GET();
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.source).toBe('view_accessory_popularity_30d');
    expect(json.counts).toEqual({
      'infotainment-screen-protector': 42,
      'all-weather-floor-liners': 28,
    });
  });

  it('falls back to raw telemetry_affiliate_clicks query if view query fails', async () => {
    const mockRawRows = [
      { accessory_id: 'all-weather-floor-liners' },
      { accessory_id: 'all-weather-floor-liners' },
      { accessory_id: '4k-front-rear-dash-cam' },
    ];

    const mockSupabase = {
      from: vi.fn().mockImplementation((table: string) => {
        if (table === 'view_accessory_popularity_30d') {
          return {
            select: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'View not found' },
            }),
          };
        }
        return {
          select: vi.fn().mockReturnValue({
            gte: vi.fn().mockResolvedValue({
              data: mockRawRows,
              error: null,
            }),
          }),
        };
      }),
    };

    vi.spyOn(serverLib, 'isLiveSupabaseConfigured').mockReturnValue(true);
    vi.spyOn(serverLib, 'createServerClient').mockReturnValue(mockSupabase as any);

    const res = await GET();
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.source).toBe('telemetry_affiliate_clicks_raw');
    expect(json.counts).toEqual({
      'all-weather-floor-liners': 2,
      '4k-front-rear-dash-cam': 1,
    });
  });

  it('returns graceful fallback when Supabase is not configured', async () => {
    vi.spyOn(serverLib, 'isLiveSupabaseConfigured').mockReturnValue(false);

    const res = await GET();
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.counts).toEqual({});
    expect(json.source).toBe('fallback_offline');
  });
});
