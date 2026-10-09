import { describe, it, expect } from 'vitest';
import {
  BASELINE_MODEL_BENCHMARKS,
  getModelBenchmark,
  fetchRawModelWaitBenchmarks,
} from '@/lib/db/stats';

describe('Model Wait Benchmarks (lib/db/stats)', () => {
  it('defines valid baseline benchmarks for core Canadian models', () => {
    const coreModels = ['rav4', 'prius-prime', 'prius', 'sienna', 'grand-highlander', 'land-cruiser'];
    for (const slug of coreModels) {
      const benchmark = BASELINE_MODEL_BENCHMARKS[slug];
      expect(benchmark).toBeDefined();
      expect(benchmark.model).toBe(slug);
      expect(benchmark.sample_size).toBeGreaterThanOrEqual(2);
      expect(benchmark.min_days).toBeLessThanOrEqual(benchmark.p25_days);
      expect(benchmark.p25_days).toBeLessThanOrEqual(benchmark.median_days);
      expect(benchmark.median_days).toBeLessThanOrEqual(benchmark.p75_days);
      expect(benchmark.p75_days).toBeLessThanOrEqual(benchmark.max_days);
      expect(benchmark.mean_days).toBeGreaterThan(0);
    }
  });

  it('retrieves specific model benchmark using getModelBenchmark', async () => {
    const rav4 = await getModelBenchmark('rav4');
    expect(rav4.model).toBe('rav4');
    expect(rav4.median_days).toBeGreaterThan(0);
    expect(rav4.sample_size).toBeGreaterThan(0);

    const priusPrime = await getModelBenchmark('prius-prime');
    expect(priusPrime.model).toBe('prius-prime');
    expect(priusPrime.sample_size).toBeGreaterThan(0);

    const prius = await getModelBenchmark('prius');
    expect(prius.model).toBe('prius');
    expect(prius.sample_size).toBeGreaterThan(0);

    const sienna = await getModelBenchmark('sienna');
    expect(sienna.model).toBe('sienna');
    expect(sienna.median_days).toBeGreaterThan(0);
  });

  it('falls back to default benchmark when unknown model is requested', async () => {
    const unknown = await getModelBenchmark('unknown-vehicle');
    expect(unknown.model).toBe('unknown-vehicle');
    expect(unknown.median_days).toBe(200);
    expect(unknown.sample_size).toBe(5);
  });

  it('fetchRawModelWaitBenchmarks returns baseline fallback when Supabase is unconfigured', async () => {
    const benchmarks = await fetchRawModelWaitBenchmarks();
    expect(benchmarks.rav4).toBeDefined();
    expect(benchmarks['prius-prime']).toBeDefined();
    expect(benchmarks.prius).toBeDefined();
    expect(benchmarks.sienna).toBeDefined();
  });
});
