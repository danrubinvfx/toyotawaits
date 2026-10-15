import { describe, it, expect } from 'vitest';
import {
  getNewsWireItems,
  getDeliveredMilestones,
  getTickerItems,
  calculateDaysWaited,
  interleaveFeeds,
} from '@/lib/db/ticker';
import { NewsTickerItem, DeliveryTickerItem } from '@/lib/types/contracts';

describe('Ticker Data Fetcher & Aggregator (Zero-PII)', () => {
  it('calculates calendar days waited accurately from order and delivery dates', () => {
    // 240 days wait
    const wait = calculateDaysWaited('2025-01-01', '2025-08-29', null);
    expect(wait).toBe(240);

    // Uses precalculated column if provided
    expect(calculateDaysWaited('2025-01-01', '2025-08-29', 142)).toBe(142);
  });

  it('fetches active news wire items with expected schema', async () => {
    const news = await getNewsWireItems(5);
    expect(Array.isArray(news)).toBe(true);
    expect(news.length).toBeGreaterThan(0);
    expect(news.length).toBeLessThanOrEqual(5);

    for (const item of news) {
      expect(item.type).toBe('news');
      expect(item.id).toBeDefined();
      expect(typeof item.title).toBe('string');
      expect(item.timestamp).toBeDefined();
    }
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

  it('getTickerItems returns alternating feed within specified limit', async () => {
    const ticker = await getTickerItems(6);
    expect(ticker.length).toBeLessThanOrEqual(6);
    expect(ticker.length).toBeGreaterThan(0);

    const hasNews = ticker.some((t) => t.type === 'news');
    const hasDelivery = ticker.some((t) => t.type === 'delivery');
    expect(hasNews).toBe(true);
    expect(hasDelivery).toBe(true);
  });
});
