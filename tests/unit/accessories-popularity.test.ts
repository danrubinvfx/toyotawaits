import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as serverLib from '@/lib/supabase/server';
import {
  getPopularAccessoryWeights,
  queryPopularAccessoryWeights,
} from '@/lib/data/accessories-popularity';
import {
  COMMUNITY_TOP_PICK_BADGE,
  getAccessoriesForModel,
  sortAccessoriesByPopularity,
  type AccessoryItem,
} from '@/data/accessories';

describe('getPopularAccessoryWeights', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns {} when Supabase is offline / not configured', async () => {
    vi.spyOn(serverLib, 'isLiveSupabaseConfigured').mockReturnValue(false);
    await expect(getPopularAccessoryWeights()).resolves.toEqual({});
  });

  it('returns {} when the database client throws', async () => {
    vi.spyOn(serverLib, 'isLiveSupabaseConfigured').mockReturnValue(true);
    vi.spyOn(serverLib, 'createServerClient').mockImplementation(() => {
      throw new Error('ECONNREFUSED');
    });
    await expect(getPopularAccessoryWeights()).resolves.toEqual({});
  });

  it('aggregates raw clicks filtered to the last 30 days when the view is unavailable', async () => {
    const gte = vi.fn().mockResolvedValue({
      data: [
        { accessory_id: 'all-weather-floor-liners' },
        { accessory_id: 'all-weather-floor-liners' },
        { accessory_id: '4k-front-rear-dash-cam' },
        { accessory_id: null },
      ],
      error: null,
    });
    const mockSupabase = {
      from: vi.fn().mockImplementation((table: string) =>
        table === 'view_accessory_popularity_30d'
          ? { select: vi.fn().mockResolvedValue({ data: null, error: { message: 'missing' } }) }
          : { select: vi.fn().mockReturnValue({ gte }) }
      ),
    };
    vi.spyOn(serverLib, 'isLiveSupabaseConfigured').mockReturnValue(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn(serverLib, 'createServerClient').mockReturnValue(mockSupabase as any);

    const before = Date.now();
    const result = await queryPopularAccessoryWeights();

    expect(result.source).toBe('telemetry_affiliate_clicks_raw');
    expect(result.counts).toEqual({ 'all-weather-floor-liners': 2, '4k-front-rear-dash-cam': 1 });

    const [column, since] = gte.mock.calls[0];
    expect(column).toBe('created_at');
    const windowMs = before - new Date(since).getTime();
    expect(windowMs).toBeGreaterThanOrEqual(30 * 24 * 60 * 60 * 1000 - 1000);
    expect(windowMs).toBeLessThanOrEqual(30 * 24 * 60 * 60 * 1000 + 1000);
  });
});

describe('sortAccessoriesByPopularity', () => {
  const make = (id: string, badge?: string): AccessoryItem => ({
    id,
    title: id,
    category: 'protection',
    description: '',
    estimatedPriceCad: '$1',
    url: 'https://example.com',
    applicableModels: ['universal'],
    badge,
  });

  it('returns curated order untouched when no weights are supplied', () => {
    const items = [make('a'), make('b'), make('c')];
    expect(sortAccessoriesByPopularity(items)).toBe(items);
    expect(sortAccessoriesByPopularity(items, {})).toBe(items);
  });

  it('sorts by clicks desc, preserves curated order on ties, and tags only #1', () => {
    const items = [make('a', 'Essential'), make('b'), make('c', 'Top Pick'), make('d')];
    const sorted = sortAccessoriesByPopularity(items, { c: 9, b: 3, d: 3 });

    expect(sorted.map((i) => i.id)).toEqual(['c', 'b', 'd', 'a']);
    expect(sorted[0].badge).toBe(COMMUNITY_TOP_PICK_BADGE);
    expect(sorted.filter((i) => i.badge === COMMUNITY_TOP_PICK_BADGE)).toHaveLength(1);
    expect(sorted[3].badge).toBe('Essential');
  });

  it('promotes all-weather liners to the first gear slot when they lead recent clicks', () => {
    const items = getAccessoriesForModel('RAV4', { 'all-weather-floor-liners': 12, '4k-front-rear-dash-cam': 4 });
    expect(items[0].id).toBe('all-weather-floor-liners');
    expect(items[0].badge).toBe(COMMUNITY_TOP_PICK_BADGE);
    expect(items[1].id).toBe('4k-front-rear-dash-cam');
  });
});
