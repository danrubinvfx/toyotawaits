import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getNewsWireItems,
  getDeliveredMilestones,
  getTickerItems,
  calculateDaysWaited,
  interleaveFeeds,
} from '@/lib/db/ticker';
import {
  getInventoryTickerItems,
  getDeliveryTickerItems,
  getNewsTickerItems,
  getGearTickerItems,
  interleaveTickerStreams,
  getAggregatedTickerItems,
} from '@/lib/data/ticker';
import { TICKER_BADGE_COLORS } from '@/types/ticker';
import { NewsTickerItem, DeliveryTickerItem } from '@/lib/types/contracts';
import * as serverSupabase from '@/lib/supabase/server';

describe('Ticker Data Fetcher & 4-Stream Aggregator', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('calculates calendar days waited accurately from order and delivery dates', () => {
    const wait = calculateDaysWaited('2025-01-01', '2025-08-29', null);
    expect(wait).toBe(240);

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

  it('returns empty array when Supabase returns an error on getNewsWireItems', async () => {
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
    expect(news.length).toBe(0);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Ticker] news_wire query error:'),
      'relation "news_wire" does not exist',
      'error details'
    );
  });

  it('fetches delivered vehicle milestones with calculated daysWaited and Zero-PII', async () => {
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

      const piiFields = ['name', 'email', 'vin', 'postal_code', 'phone'];
      for (const field of piiFields) {
        expect((item as any)[field]).toBeUndefined();
      }
    }
  });

  it('formats all 4 ticker streams (news, inventory, delivery, gear) with exact badges, colors, and URLs', async () => {
    const inventoryItems = await getInventoryTickerItems(5);
    expect(inventoryItems.length).toBe(5);
    for (const item of inventoryItems) {
      expect(item.type).toBe('inventory');
      expect(['[🟢 LIVE LOT]', '[🚢 IN TRANSIT]']).toContain(item.badge);
      expect(item.badgeColor).toBe(TICKER_BADGE_COLORS.inventory);
      expect(item.text).toMatch(/observed at .+ \(.+\)/);
      expect(item.linkUrl).toMatch(/^\/inventory\?q=/);
    }

    const deliveryItems = await getDeliveryTickerItems(5, 'CA');
    expect(deliveryItems.length).toBe(5);
    for (const item of deliveryItems) {
      expect(item.type).toBe('delivery');
      expect(['[📦 DELIVERED]', '[📝 ALLOCATED]']).toContain(item.badge);
      expect(item.badgeColor).toBe(TICKER_BADGE_COLORS.delivery);
      expect(item.text).toMatch(/delivered in .+ after \d+ days/);
      expect(item.linkUrl).toBe('/');
    }

    const newsItems = await getNewsTickerItems(3);
    expect(newsItems.length).toBeGreaterThanOrEqual(2);
    for (const item of newsItems) {
      expect(item.type).toBe('news');
      expect(item.badge).toBe('[🗞️ UPDATE]');
      expect(item.badgeColor).toBe(TICKER_BADGE_COLORS.news);
    }

    const gearItems = getGearTickerItems(3);
    expect(gearItems.length).toBe(3);
    for (const item of gearItems) {
      expect(item.type).toBe('gear');
      expect(item.badge).toBe('[⚡ GEAR PICK]');
      expect(item.badgeColor).toBe(TICKER_BADGE_COLORS.gear);
      expect(item.isExternal).toBe(true);
      expect(item.linkUrl).toContain('amazon.ca');
    }
  });

  it('interleaves 4 streams in round-robin sequence with NO two adjacent items sharing the same type', async () => {
    const interleaved = await getAggregatedTickerItems(16, 'CA');
    expect(interleaved.length).toBeGreaterThanOrEqual(12);

    // First 4 items follow [News -> Inventory -> Delivery -> Gear]
    expect(interleaved[0].type).toBe('news');
    expect(interleaved[1].type).toBe('inventory');
    expect(interleaved[2].type).toBe('delivery');
    expect(interleaved[3].type).toBe('gear');

    // No two adjacent items share the same type
    for (let i = 1; i < interleaved.length; i++) {
      expect(interleaved[i].type).not.toBe(interleaved[i - 1].type);
    }

    // Even across the marquee wrap-around (last -> first), types do not collide
    if (interleaved.length > 1) {
      expect(interleaved[interleaved.length - 1].type).not.toBe(interleaved[0].type);
    }
  });

  it('preserves legacy interleaveFeeds helper for two-stream callers', () => {
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
  });

  it('getTickerItems returns interleaved 4-stream feed within specified limit', async () => {
    const ticker = await getTickerItems(8, 'CA');
    expect(ticker.length).toBeLessThanOrEqual(8);
    expect(ticker.length).toBeGreaterThan(0);

    const types = new Set(ticker.map((t) => t.type));
    expect(types.has('news')).toBe(true);
    expect(types.has('inventory')).toBe(true);
    expect(types.has('delivery')).toBe(true);
    expect(types.has('gear')).toBe(true);
  });

  it('safely handles empty, null, or undefined items in interleaveTickerStreams without throwing', () => {
    const emptyResult = interleaveTickerStreams({
      news: [],
      inventory: null,
      delivery: undefined,
      gear: [undefined as any, null as any],
    });
    expect(Array.isArray(emptyResult)).toBe(true);
    expect(emptyResult.length).toBe(0);
    expect(emptyResult.every(Boolean)).toBe(true);
  });
});
