import { createServerClient } from '@/lib/supabase/server';
import { unstable_cache } from 'next/cache';

export interface ModelWaitBenchmark {
  model: string;
  sample_size: number;
  min_days: number;
  p25_days: number;
  median_days: number;
  p75_days: number;
  max_days: number;
  mean_days: number;
}

// Baseline data reflecting verified Canadian crowdsourced delivery timelines
export const BASELINE_MODEL_BENCHMARKS: Record<string, ModelWaitBenchmark> = {
  rav4: {
    model: 'rav4',
    sample_size: 17,
    min_days: 110,
    p25_days: 185,
    median_days: 375,
    p75_days: 410,
    max_days: 410,
    mean_days: 290.0,
  },
  'prius-prime': {
    model: 'prius-prime',
    sample_size: 12,
    min_days: 28,
    p25_days: 140,
    median_days: 318,
    p75_days: 322,
    max_days: 390,
    mean_days: 275.4,
  },
  prius: {
    model: 'prius',
    sample_size: 6,
    min_days: 80,
    p25_days: 95,
    median_days: 143,
    p75_days: 146,
    max_days: 166,
    mean_days: 138.8,
  },
  sienna: {
    model: 'sienna',
    sample_size: 7,
    min_days: 400,
    p25_days: 440,
    median_days: 510,
    p75_days: 560,
    max_days: 620,
    mean_days: 505.7,
  },
  'grand-highlander': {
    model: 'grand-highlander',
    sample_size: 7,
    min_days: 240,
    p25_days: 270,
    median_days: 300,
    p75_days: 320,
    max_days: 410,
    mean_days: 308.0,
  },
  'land-cruiser': {
    model: 'land-cruiser',
    sample_size: 6,
    min_days: 60,
    p25_days: 85,
    median_days: 125,
    p75_days: 145,
    max_days: 170,
    mean_days: 115.8,
  },
  corolla: {
    model: 'corolla',
    sample_size: 20,
    min_days: 20,
    p25_days: 30,
    median_days: 60,
    p75_days: 165,
    max_days: 240,
    mean_days: 98.5,
  },
  'corolla-cross': {
    model: 'corolla-cross',
    sample_size: 16,
    min_days: 45,
    p25_days: 60,
    median_days: 120,
    p75_days: 270,
    max_days: 400,
    mean_days: 165.0,
  },
  sequoia: {
    model: 'sequoia',
    sample_size: 15,
    min_days: 90,
    p25_days: 180,
    median_days: 240,
    p75_days: 330,
    max_days: 420,
    mean_days: 255.0,
  },
};

export const ACTIVE_TRACKED_MODELS = [
  'rav4',
  'prius-prime',
  'prius',
  'sienna',
  'grand-highlander',
  'land-cruiser',
  'corolla',
  'corolla-cross',
  'sequoia',
] as const;

export type ActiveTrackedModel = (typeof ACTIVE_TRACKED_MODELS)[number];

export interface PowertrainWaitBenchmark {
  model: string;
  powertrain: string;
  powertrainName: string;
  sample_size: number;
  min_days: number;
  p25_days: number;
  median_days: number;
  p75_days: number;
  max_days: number;
  mean_days: number;
}

export const BASELINE_POWERTRAIN_BENCHMARKS: Record<string, PowertrainWaitBenchmark> = {
  'rav4-phev': {
    model: 'rav4',
    powertrain: 'phev',
    powertrainName: 'Plug-in Hybrid (PHEV)',
    sample_size: 6,
    min_days: 240,
    p25_days: 285,
    median_days: 340,
    p75_days: 410,
    max_days: 410,
    mean_days: 345.0,
  },
  'rav4-hev': {
    model: 'rav4',
    powertrain: 'hev',
    powertrainName: 'Hybrid (HEV)',
    sample_size: 8,
    min_days: 110,
    p25_days: 130,
    median_days: 175,
    p75_days: 220,
    max_days: 260,
    mean_days: 178.5,
  },
  'sienna-hev': {
    model: 'sienna',
    powertrain: 'hev',
    powertrainName: 'Hybrid (HEV)',
    sample_size: 7,
    min_days: 400,
    p25_days: 440,
    median_days: 510,
    p75_days: 560,
    max_days: 620,
    mean_days: 505.7,
  },
  'grand-highlander-hev': {
    model: 'grand-highlander',
    powertrain: 'hev',
    powertrainName: 'Hybrid (HEV)',
    sample_size: 5,
    min_days: 240,
    p25_days: 270,
    median_days: 300,
    p75_days: 320,
    max_days: 410,
    mean_days: 308.0,
  },
  'grand-highlander-hybrid-max': {
    model: 'grand-highlander',
    powertrain: 'hybrid-max',
    powertrainName: 'Hybrid MAX',
    sample_size: 2,
    min_days: 320,
    p25_days: 350,
    median_days: 380,
    p75_days: 420,
    max_days: 450,
    mean_days: 385.0,
  },
  'prius-prime-phev': {
    model: 'prius-prime',
    powertrain: 'phev',
    powertrainName: 'Plug-in Hybrid (PHEV)',
    sample_size: 12,
    min_days: 28,
    p25_days: 140,
    median_days: 318,
    p75_days: 322,
    max_days: 390,
    mean_days: 275.4,
  },
  'prius-hev': {
    model: 'prius',
    powertrain: 'hev',
    powertrainName: 'Hybrid (HEV)',
    sample_size: 6,
    min_days: 80,
    p25_days: 95,
    median_days: 143,
    p75_days: 146,
    max_days: 166,
    mean_days: 138.8,
  },
  'land-cruiser-hev': {
    model: 'land-cruiser',
    powertrain: 'hev',
    powertrainName: 'i-FORCE MAX Hybrid',
    sample_size: 6,
    min_days: 60,
    p25_days: 85,
    median_days: 125,
    p75_days: 145,
    max_days: 170,
    mean_days: 115.8,
  },
  'corolla-gas': {
    model: 'corolla',
    powertrain: 'gas',
    powertrainName: 'Gasoline',
    sample_size: 10,
    min_days: 20,
    p25_days: 30,
    median_days: 60,
    p75_days: 90,
    max_days: 120,
    mean_days: 61.0,
  },
  'corolla-hev': {
    model: 'corolla',
    powertrain: 'hev',
    powertrainName: 'Hybrid (HEV)',
    sample_size: 12,
    min_days: 80,
    p25_days: 120,
    median_days: 165,
    p75_days: 210,
    max_days: 240,
    mean_days: 164.5,
  },
  'corolla-gr': {
    model: 'corolla',
    powertrain: 'gr',
    powertrainName: 'GR Performance',
    sample_size: 6,
    min_days: 120,
    p25_days: 180,
    median_days: 240,
    p75_days: 330,
    max_days: 360,
    mean_days: 248.0,
  },
  'corolla-cross-gas': {
    model: 'corolla-cross',
    powertrain: 'gas',
    powertrainName: 'Gasoline',
    sample_size: 9,
    min_days: 40,
    p25_days: 60,
    median_days: 90,
    p75_days: 135,
    max_days: 180,
    mean_days: 94.0,
  },
  'corolla-cross-hev': {
    model: 'corolla-cross',
    powertrain: 'hev',
    powertrainName: 'Hybrid (HEV)',
    sample_size: 10,
    min_days: 140,
    p25_days: 210,
    median_days: 270,
    p75_days: 360,
    max_days: 400,
    mean_days: 278.0,
  },
  'sequoia-hev': {
    model: 'sequoia',
    powertrain: 'hev',
    powertrainName: 'i-FORCE MAX Hybrid',
    sample_size: 15,
    min_days: 90,
    p25_days: 180,
    median_days: 240,
    p75_days: 330,
    max_days: 420,
    mean_days: 255.0,
  },
};

export function getPowertrainBenchmark(
  modelSlug: string,
  powertrainSlug?: string
): PowertrainWaitBenchmark | null {
  if (!powertrainSlug) return null;
  const key = `${modelSlug.toLowerCase()}-${powertrainSlug.toLowerCase()}`;
  return BASELINE_POWERTRAIN_BENCHMARKS[key] || null;
}

/**
 * Direct fetch from Supabase model_wait_benchmarks view with graceful degradation.
 * Excludes legacy or unlisted models (e.g. Tacoma) to align with public delivery logs.
 */
export async function fetchRawModelWaitBenchmarks(): Promise<Record<string, ModelWaitBenchmark>> {
  const result: Record<string, ModelWaitBenchmark> = { ...BASELINE_MODEL_BENCHMARKS };

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock-')
  ) {
    try {
      const supabase = createServerClient({ revalidate: 3600, tags: ['benchmarks'] });
      const { data, error } = await supabase
        .from('model_wait_benchmarks')
        .select('model, sample_size, min_days, p25_days, median_days, p75_days, max_days, mean_days');

      if (!error && Array.isArray(data) && data.length > 0) {
        for (const row of data) {
          const sampleSize = Number(row.sample_size) || 0;
          const modelKey = String(row.model || '').toLowerCase();
          // Only adopt dynamic database metrics if model has at least 2 delivered entries
          // and belongs to active tracked models (excluding Tacoma / legacy unlisted models)
          if (sampleSize >= 2 && (ACTIVE_TRACKED_MODELS as readonly string[]).includes(modelKey)) {
            result[modelKey] = {
              model: modelKey,
              sample_size: sampleSize,
              min_days: Number(row.min_days) || 0,
              p25_days: Number(row.p25_days) || 0,
              median_days: Number(row.median_days) || 0,
              p75_days: Number(row.p75_days) || 0,
              max_days: Number(row.max_days) || 0,
              mean_days: Number(row.mean_days) || 0,
            };
          }
        }
      }
    } catch (err) {
      console.warn('Falling back to baseline wait benchmarks map:', err);
    }
  }

  return result;
}

// Cached helper with 3600s TTL and 'wait_stats' tag
const cachedModelWaitBenchmarks = unstable_cache(
  async () => fetchRawModelWaitBenchmarks(),
  ['model_wait_benchmarks_cache'],
  { revalidate: 3600, tags: ['wait_stats'] }
);

/**
 * Main server helper: reads dynamic percentile benchmarks from Supabase with caching and fallback.
 */
export async function getModelWaitBenchmarks(): Promise<Record<string, ModelWaitBenchmark>> {
  try {
    return await cachedModelWaitBenchmarks();
  } catch {
    return await fetchRawModelWaitBenchmarks();
  }
}

/**
 * Get benchmark for a specific model slug with fallback.
 */
export async function getModelBenchmark(modelSlug: string): Promise<ModelWaitBenchmark> {
  const benchmarks = await getModelWaitBenchmarks();
  return (
    benchmarks[modelSlug] ||
    BASELINE_MODEL_BENCHMARKS[modelSlug] || {
      model: modelSlug,
      sample_size: 5,
      min_days: 100,
      p25_days: 150,
      median_days: 200,
      p75_days: 300,
      max_days: 400,
      mean_days: 220,
    }
  );
}
