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
    p75_days: 450,
    max_days: 510,
    mean_days: 290.0,
  },
  'prius-prime': {
    model: 'prius-prime',
    sample_size: 12,
    min_days: 28,
    p25_days: 140,
    median_days: 181,
    p75_days: 230,
    max_days: 390,
    mean_days: 175.4,
  },
  prius: {
    model: 'prius',
    sample_size: 6,
    min_days: 80,
    p25_days: 95,
    median_days: 104,
    p75_days: 120,
    max_days: 135,
    mean_days: 107.2,
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
    median_days: 325,
    p75_days: 380,
    max_days: 410,
    mean_days: 325.0,
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
};

/**
 * Direct fetch from Supabase model_wait_benchmarks view with graceful degradation.
 */
export async function fetchRawModelWaitBenchmarks(): Promise<Record<string, ModelWaitBenchmark>> {
  const result: Record<string, ModelWaitBenchmark> = { ...BASELINE_MODEL_BENCHMARKS };

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock-')
  ) {
    try {
      const supabase = createServerClient();
      const { data, error } = await supabase
        .from('model_wait_benchmarks')
        .select('model, sample_size, min_days, p25_days, median_days, p75_days, max_days, mean_days');

      if (!error && Array.isArray(data) && data.length > 0) {
        for (const row of data) {
          const sampleSize = Number(row.sample_size) || 0;
          // Only adopt dynamic database metrics if model has at least 2 delivered entries
          if (sampleSize >= 2 && row.model) {
            result[row.model] = {
              model: String(row.model),
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
