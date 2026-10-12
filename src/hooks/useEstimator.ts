import { useMemo } from 'react';
import { ModelWaitBenchmark, BASELINE_MODEL_BENCHMARKS } from '@/lib/db/stats';
import { RegionalWaitSummary } from '@/lib/types/contracts';

export interface UseEstimatorOptions {
  modelSlug: string;
  powertrainSlug?: string;
  province?: string;
  depositDate?: string;
  todayDate?: Date;
  benchmarks?: Record<string, ModelWaitBenchmark>;
  stats?: RegionalWaitSummary | null;
}

export interface EstimatorCalculationResult {
  p25Days: number;
  medianDays: number;
  p75Days: number;
  minWaitMonths: number;
  maxWaitMonths: number;
  medianMonths: string;
  optimisticDate: string;
  conservativeDate: string;
  medianDate: string;
  daysAlreadyWaited: number;
  isHistoricalOrderDate: boolean;
  isLimitedRegionalData: boolean;
  verifiedSampleSize: number;
  carryoverNote: string | null;
  exceedsCarryoverThreshold: boolean;
  calculateProjectedDate: (daysOffset: number) => string;
}

export const CARRYOVER_ALLOCATION_NOTE =
  'Orders over 14 months typically carry over into subsequent model-year allocation queues.';

export function useEstimator({
  modelSlug,
  depositDate,
  todayDate = new Date(),
  benchmarks = BASELINE_MODEL_BENCHMARKS,
  stats,
}: UseEstimatorOptions): EstimatorCalculationResult {
  // Days already elapsed since deposit date
  const daysAlreadyWaited = useMemo(() => {
    if (!depositDate) return 0;
    const base = new Date(depositDate + (depositDate.includes('T') ? '' : 'T00:00:00'));
    if (isNaN(base.getTime())) return 0;
    return Math.max(0, Math.floor((todayDate.getTime() - base.getTime()) / (1000 * 60 * 60 * 24)));
  }, [depositDate, todayDate]);

  // Check whether selected deposit date is prior to current 2026 model year
  const isHistoricalOrderDate = useMemo(() => {
    if (!depositDate) return false;
    const base = new Date(depositDate + (depositDate.includes('T') ? '' : 'T00:00:00'));
    const year = base.getFullYear();
    return !isNaN(year) && year < 2026;
  }, [depositDate]);

  // Projected Date Calculations: arrival window calculated directly without artificial 420-day clamping
  const calculateProjectedDate = (daysOffset: number): string => {
    const base = depositDate ? new Date(depositDate + (depositDate.includes('T') ? '' : 'T00:00:00')) : todayDate;
    const baseTime = !isNaN(base.getTime()) ? base.getTime() : todayDate.getTime();
    const target = new Date(baseTime + daysOffset * 24 * 60 * 60 * 1000);
    return target.toLocaleDateString('en-CA', {
      month: 'short',
      year: 'numeric',
    });
  };

  const currentBenchmark = benchmarks[modelSlug] || BASELINE_MODEL_BENCHMARKS[modelSlug];

  // Small sample size handling (< 5):
  const regionalSampleCount = stats?.sampleCounts?.delivered ?? stats?.sampleCounts?.total ?? 0;
  const isLimitedRegionalData = Boolean(stats && regionalSampleCount < 5);

  const rawMedian = isLimitedRegionalData
    ? currentBenchmark?.median_days ?? 375
    : stats?.waitStats?.median ?? currentBenchmark?.median_days ?? 375;

  const rawP25 = isLimitedRegionalData
    ? currentBenchmark?.p25_days ?? 185
    : stats?.waitStats?.p25 ?? currentBenchmark?.p25_days ?? 185;

  const rawP75 = isLimitedRegionalData
    ? currentBenchmark?.p75_days ?? 450
    : stats?.waitStats?.p75 ?? currentBenchmark?.p75_days ?? 450;

  // True percentiles: Remove artificial 420-day ceiling clamping so high-wait vehicles
  // (e.g. Sienna P75 = 450-560 days) display their authentic empirical wait times.
  const p75Days = rawP75;
  const medianDays = Math.min(rawMedian, p75Days);
  const p25Days = Math.min(rawP25, medianDays);

  const verifiedSampleSize = isLimitedRegionalData
    ? currentBenchmark?.sample_size ?? 10
    : stats?.sampleCounts?.delivered || currentBenchmark?.sample_size || stats?.sampleCounts?.total || 140;

  const optimisticDate = calculateProjectedDate(p25Days);
  const conservativeDate = calculateProjectedDate(p75Days);
  const medianDate = calculateProjectedDate(medianDays);

  const medianMonths = (medianDays / 30.4).toFixed(1);
  const minWaitMonths = Math.max(1, Math.round(p25Days / 30.4));
  const maxWaitMonths = Math.max(2, Math.round(p75Days / 30.4));

  // If wait times exceed 14 months (P75 > 400 days)
  const exceedsCarryoverThreshold = p75Days > 400;
  const carryoverNote = exceedsCarryoverThreshold ? CARRYOVER_ALLOCATION_NOTE : null;

  return {
    p25Days,
    medianDays,
    p75Days,
    minWaitMonths,
    maxWaitMonths,
    medianMonths,
    optimisticDate,
    conservativeDate,
    medianDate,
    daysAlreadyWaited,
    isHistoricalOrderDate,
    isLimitedRegionalData,
    verifiedSampleSize,
    carryoverNote,
    exceedsCarryoverThreshold,
    calculateProjectedDate,
  };
}
