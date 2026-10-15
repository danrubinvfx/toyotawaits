import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getNewsWireItems,
  getDeliveredMilestones,
  getTickerItems,
  calculateDaysWaited,
  interleaveFeeds,
} from '@/lib/db/ticker';
import { NewsTickerItem, DeliveryTickerItem } from '@/lib/types/contracts';
import * as serverSupabase from '@/lib/supabase/server';

describe('Ticker Data Fetcher & Aggregator (Zero-PII & Live news_wire)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('calculates calendar days waited accurately from order and delivery dates', () => {
    // 240 days wait
    const wait = calculateDaysWaited('2025-01-01', '2025-08-29', null);
    expect(wait).toBe(240);

    // Uses precalculated column if provided
    expect(calculateDaysWaited('2025-01-01', '2025-08-29', 142)).toBe(142);
  });

  it('queries Supabase directly for news_wire and maps rows accurately', async () => {
    const mockRows = [
      {
        id: 101,
        headline: 'Toyota Canada boosts PHEV allocations for Q4',
        category: 'ALLOCATION_ALERT',
        url: 'https://example.com/live-news',
        created_at: '2026-10-15T10:00:00Z',
      },
    ];

    const mockSelect = vi.fn().mockReturnThis();
    const mockOrder = vi.fn().mockReturnThis();
    const mockLimit = vi.fn().mockResolvedValue({ data: mockRows, error: null });

    vi.spyOn(serverSupabase, 'createServerClient').mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: mockSelect,
        order: mockOrder,
        limit: mockLimit,
      }),
    } as any);

    const news = await getNewsWireItems(5);
    expect(mockSelect).toHaveBeenCalledWith('id, created_at, url, headline, category');
    expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(news.length).toBe(1);
    expect(news[0]).toEqual({
      id: 'news-101',
      type: 'news',
      headline: 'Toyota Canada boosts PHEV allocations for Q4',
      title: 'Toyota Canada boosts PHEV allocations for Q4',
      category: 'ALLOCATION_ALERT',
      tag: 'ALLOCATION_ALERT',
      url: 'https://example.com/live-news',
      timestamp: '2026-10-15T10:00:00Z',
    });
  });

  it('returns empty array when Supabase returns an error and NEVER returns mock items', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.spyOn(serverSupabase, 'createServerClient').mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'relation "news_wire" does not exist', details: 'error details' },
        }),
      }),
    } as any);

    const news = await getNewsWireItems(5);
    expect(Array.isArray(news)).toBe(true);
    expect(news.length).toBe(0); // STRICT: empty array on error, never mock fallback

    // Ensure no mock fallback IDs exist
    const mockIds = ['news-1', 'news-2', 'news-3', 'news-4'];
    expect(news.some((n) => mockIds.includes(n.id))).toBe(false);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Ticker] news_wire query error:'),
      'relation "news_wire" does not exist',
      'error details'
    );
  });

  it('fetches delivered vehicle milestones with calculated daysWaited', async () => {
    const deliveries = await getDeliveredMilestones(5);
    expect(Array.isArray(deliveries)).toBe(true);
    expect(deliveries.length).toBeGreaterThan(0);
    expect(deliveries.length).toBeLessThanOrEqual(5);

    for (const item of deliveries) {
      expect(item.type).toBe('delivery');
      expect(item.id).toBeDefined();
      expect(item.province).toBeDefined();
      expect(item.model_name).toBeDefined();
      expect(typeof item.daysWaited).toBe('number');
      expect(item.daysWaited).toBeGreaterThan(0);
      expect(item.timestamp).toBeDefined();

      // Zero-PII strict verification
      const piiFields = ['name', 'email', 'vin', 'postal_code', 'phone'];
      for (const field of piiFields) {
        expect((item as any)[field]).toBeUndefined();
      }
    }
  });

  it('interleaves news wire alerts and delivery milestones in an alternating sequence', () => {
    const mockNews: NewsTickerItem[] = [
      { type: 'news', id: 'n1', title: 'News 1', timestamp: '2026-10-14' },
      { type: 'news', id: 'n2', title: 'News 2', timestamp: '2026-10-13' },
    ];

    const mockDeliveries: DeliveryTickerItem[] = [
      {
        type: 'delivery',
        id: 'd1',
        province: 'BC',
        model_name: 'RAV4',
        trim_name: 'SE',
        powertrain: 'PHEV',
        daysWaited: 240,
        timestamp: '2026-10-14',
      },
      {
        type: 'delivery',
        id: 'd2',
        province: 'ON',
        model_name: 'Tacoma',
        trim_name: 'SR5',
        powertrain: 'Turbo',
        daysWaited: 95,
        timestamp: '2026-10-13',
      },
    ];

    const merged = interleaveFeeds(mockNews, mockDeliveries, 10);
    expect(merged.length).toBe(4);
    expect(merged[0].type).toBe('delivery');
    expect(merged[1].type).toBe('news');
    expect(merged[2].type).toBe('delivery');
    expect(merged[3].type).toBe('news');
  });

  it('getTickerItems returns feed within specified limit and adheres to Zero-PII', async () => {
    const ticker = await getTickerItems(6);
    expect(ticker.length).toBeLessThanOrEqual(6);
    expect(ticker.length).toBeGreaterThan(0);

    // Never contains old hardcoded mock IDs
    const forbiddenMockIds = ['news-1', 'news-2', 'news-3', 'news-4'];
    for (const item of ticker) {
      expect(forbiddenMockIds.includes(item.id)).toBe(false);
    }
  });
});
