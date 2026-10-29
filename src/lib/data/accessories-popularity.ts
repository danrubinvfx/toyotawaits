/**
 * src/lib/data/accessories-popularity.ts
 *
 * 30-day affiliate click telemetry aggregation for popularity-weighted accessory ranking.
 *
 * - Primary source: `view_accessory_popularity_30d` (pre-aggregated SQL view)
 * - Fallback: raw `telemetry_affiliate_clicks` rows where
 *   `created_at >= NOW() - INTERVAL '30 days'`, aggregated in-process.
 * - Offline / error: resolves cleanly to `{}` so curated ordering is preserved.
 */
import { unstable_cache } from 'next/cache';
import { createServerClient, isLiveSupabaseConfigured } from '@/lib/supabase/server';

export const POPULARITY_WINDOW_DAYS = 30;
export const POPULARITY_CACHE_SECONDS = 3600;
export const POPULARITY_CACHE_TAG = 'accessory-popularity';

export type PopularityWeights = Record<string, number>;

export type PopularitySource =
  | 'view_accessory_popularity_30d'
  | 'telemetry_affiliate_clicks_raw'
  | 'fallback_offline'
  | 'error_fallback'
  | 'catch_fallback';

export interface PopularityResult {
  counts: PopularityWeights;
  source: PopularitySource;
}

/**
 * Uncached query: aggregates 30-day click counts per accessory_id.
 * Never throws — returns `{ counts: {} }` with a descriptive source on failure.
 */
export async function queryPopularAccessoryWeights(): Promise<PopularityResult> {
  if (!isLiveSupabaseConfigured()) {
    return { counts: {}, source: 'fallback_offline' };
  }

  try {
    const supabase = createServerClient();

    // 1. Pre-aggregated 30-day view
    const { data: viewData, error: viewError } = await supabase
      .from('view_accessory_popularity_30d')
      .select('accessory_id, click_count');

    if (!viewError && Array.isArray(viewData)) {
      const counts: PopularityWeights = {};
      for (const row of viewData as Array<{ accessory_id?: string | null; click_count?: unknown }>) {
        if (row.accessory_id) {
          counts[row.accessory_id] = Number(row.click_count) || 0;
        }
      }
      return { counts, source: 'view_accessory_popularity_30d' };
    }

    // 2. Raw table fallback: created_at >= NOW() - INTERVAL '30 days'
    const windowStart = new Date(
      Date.now() - POPULARITY_WINDOW_DAYS * 24 * 60 * 60 * 1000
    ).toISOString();
    const { data: rawRows, error: rawError } = await supabase
      .from('telemetry_affiliate_clicks')
      .select('accessory_id')
      .gte('created_at', windowStart);

    if (rawError || !Array.isArray(rawRows)) {
      return { counts: {}, source: 'error_fallback' };
    }

    const counts: PopularityWeights = {};
    for (const row of rawRows as Array<{ accessory_id?: string | null }>) {
      if (row.accessory_id) {
        counts[row.accessory_id] = (counts[row.accessory_id] || 0) + 1;
      }
    }
    return { counts, source: 'telemetry_affiliate_clicks_raw' };
  } catch {
    return { counts: {}, source: 'catch_fallback' };
  }
}

const cachedQuery = unstable_cache(queryPopularAccessoryWeights, ['accessory-popularity-30d'], {
  revalidate: POPULARITY_CACHE_SECONDS,
  tags: [POPULARITY_CACHE_TAG],
});

/**
 * Cached (1h) popularity result including the data source.
 * Falls back to a direct query when invoked outside the Next.js runtime
 * (e.g. scripts or unit tests, where the incremental cache is unavailable).
 */
export async function getPopularAccessoryWeightsWithSource(): Promise<PopularityResult> {
  if (!process.env.NEXT_RUNTIME) {
    return queryPopularAccessoryWeights();
  }
  try {
    return await cachedQuery();
  } catch {
    return queryPopularAccessoryWeights();
  }
}

/**
 * Cached helper returning `accessory_id -> 30-day click count`.
 * Resolves to `{}` when the database is unreachable or offline.
 */
export async function getPopularAccessoryWeights(): Promise<PopularityWeights> {
  const { counts } = await getPopularAccessoryWeightsWithSource();
  return counts;
}
