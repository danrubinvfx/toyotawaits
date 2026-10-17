import { ModelWaitBenchmark, BASELINE_MODEL_BENCHMARKS, getPowertrainBenchmark } from '@/lib/db/stats';
import { RegionalWaitSummary } from '@/lib/types/contracts';
import { CommunityRecord } from '@/lib/data/community-records';
import { US_STATES } from '@/lib/validations/schemas';

export interface CalculateWaitOptions {
  modelSlug?: string;
  model?: string;
  powertrainSlug?: string;
  powertrain?: string;
  trimSlug?: string;
  trim?: string;
  trimName?: string;
  province?: string;
  state?: string;
  region?: string;
  country?: 'US' | 'CA';
  countryCode?: 'US' | 'CA';
  country_code?: 'US' | 'CA';
  market?: 'US' | 'CA';
  depositDate?: string | Date;
  todayDate?: Date;
  benchmarks?: Record<string, ModelWaitBenchmark>;
  stats?: RegionalWaitSummary | null;
  submissions?: CommunityRecord[];
}

export interface CalculateWaitResult {
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
  isBaselineFallback: boolean;
  isLimitedRegionalData: boolean;
  fallbackBadgeText: string | null;
  verifiedSampleSize: number;
  sampleBadgeText: string;
  estimateType: 'empirical' | 'planning_benchmark';
  multiplierBreakdown: string | null;
  calculateProjectedDate: (daysOffset: number) => string;
}

/** US National Benchmarks for realistic default projections (45 - 180 days) */
export const US_NATIONAL_BENCHMARKS: Record<
  string,
  { min_days: number; p25_days: number; median_days: number; p75_days: number; sample_size: number }
> = {
  rav4: { min_days: 30, p25_days: 45, median_days: 65, p75_days: 90, sample_size: 20 },
  sienna: { min_days: 60, p25_days: 90, median_days: 135, p75_days: 180, sample_size: 15 },
  'grand-highlander': { min_days: 45, p25_days: 60, median_days: 105, p75_days: 150, sample_size: 15 },
  prius: { min_days: 30, p25_days: 45, median_days: 60, p75_days: 85, sample_size: 12 },
  'prius-prime': { min_days: 30, p25_days: 45, median_days: 65, p75_days: 90, sample_size: 12 },
  tacoma: { min_days: 40, p25_days: 60, median_days: 90, p75_days: 120, sample_size: 10 },
  'land-cruiser': { min_days: 45, p25_days: 60, median_days: 90, p75_days: 130, sample_size: 10 },
};

export function calculateWait(options: CalculateWaitOptions): CalculateWaitResult {
  const modelSlug = (options.modelSlug || options.model || 'rav4').toLowerCase();
  const powertrainSlug = (options.powertrainSlug || options.powertrain || 'hev').toLowerCase();
  const rawRegion = (options.state || options.province || options.region || '').trim().toUpperCase();

  const isUs = Boolean(
    options.country === 'US' ||
      options.countryCode === 'US' ||
      options.country_code === 'US' ||
      options.market === 'US' ||
      (rawRegion && (US_STATES as readonly string[]).includes(rawRegion))
  );

  const regionCode = rawRegion || (isUs ? 'CA' : 'ON');
  const todayDate = options.todayDate || new Date();
  const benchmarks = options.benchmarks || BASELINE_MODEL_BENCHMARKS;
  const stats = options.stats;

  // Handle deposit date
  const depositDateStr =
    options.depositDate instanceof Date
      ? options.depositDate.toISOString().split('T')[0]
      : options.depositDate;

  const daysAlreadyWaited = (() => {
    if (!depositDateStr) return 0;
    const base = new Date(depositDateStr + (depositDateStr.includes('T') ? '' : 'T00:00:00'));
    if (isNaN(base.getTime())) return 0;
    return Math.max(0, Math.floor((todayDate.getTime() - base.getTime()) / (1000 * 60 * 60 * 24)));
  })();

  const isHistoricalOrderDate = (() => {
    if (!depositDateStr) return false;
    const base = new Date(depositDateStr + (depositDateStr.includes('T') ? '' : 'T00:00:00'));
    const year = base.getFullYear();
    return !isNaN(year) && year < 2026;
  })();

  const calculateProjectedDate = (daysOffset: number): string => {
    const base = depositDateStr
      ? new Date(depositDateStr + (depositDateStr.includes('T') ? '' : 'T00:00:00'))
      : todayDate;
    const baseTime = !isNaN(base.getTime()) ? base.getTime() : todayDate.getTime();
    const target = new Date(baseTime + daysOffset * 24 * 60 * 60 * 1000);
    return target.toLocaleDateString('en-CA', {
      month: 'short',
      year: 'numeric',
    });
  };

  // Check matching submissions if passed directly
  let matchingRegionalCount = 0;
  if (options.submissions && Array.isArray(options.submissions)) {
    const matchingVehicles = options.submissions.filter((s) => {
      const mMatch = s.modelSlug === modelSlug || s.model.toLowerCase() === modelSlug;
      const pMatch = !powertrainSlug || s.powertrainSlug === powertrainSlug;
      return mMatch && pMatch;
    });
    matchingRegionalCount = matchingVehicles.filter(
      (s) => (s.state || s.province)?.toUpperCase() === regionCode
    ).length;
  }

  // 1. Evaluate whether regional state data has 0 or low samples
  const regionalCount =
    matchingRegionalCount > 0
      ? matchingRegionalCount
      : stats?.sampleCounts?.delivered ?? stats?.sampleCounts?.total ?? 0;

  const isStatsBaselineFallback = Boolean(stats?.isBaselineFallback);
  const isZeroMatchingSubmissions =
    (options.submissions && matchingRegionalCount === 0) ||
    regionalCount === 0 ||
    isStatsBaselineFallback;

  const isBaselineFallback = isZeroMatchingSubmissions || isStatsBaselineFallback;
  const isLimitedRegionalData = Boolean(isBaselineFallback || (stats && regionalCount < 5));

  // 2. Fallback to national baseline benchmarks
  const currentBenchmark = benchmarks[modelSlug] || BASELINE_MODEL_BENCHMARKS[modelSlug];
  const activePowertrainBenchmark = getPowertrainBenchmark(modelSlug, powertrainSlug);
  const usBenchmark = US_NATIONAL_BENCHMARKS[modelSlug] || US_NATIONAL_BENCHMARKS.rav4;

  let rawMedian: number;
  let rawP25: number;
  let rawP75: number;

  if (isUs) {
    if (!isZeroMatchingSubmissions && stats?.waitStats?.median) {
      rawMedian = stats.waitStats.median;
      rawP25 = stats.waitStats.p25;
      rawP75 = stats.waitStats.p75;
    } else if (stats?.waitStats?.median && stats.waitStats.median > 0) {
      // Fallback to national country-wide aggregate returned from API
      rawMedian = stats.waitStats.median;
      rawP25 = stats.waitStats.p25;
      rawP75 = stats.waitStats.p75;
    } else {
      // Fallback to US national benchmarks
      rawMedian = usBenchmark.median_days;
      rawP25 = usBenchmark.p25_days;
      rawP75 = usBenchmark.p75_days;
    }
  } else {
    // Canadian calculation
    if (!isLimitedRegionalData && stats?.waitStats?.median) {
      rawMedian = stats.waitStats.median;
      rawP25 = stats.waitStats.p25;
      rawP75 = stats.waitStats.p75;
    } else {
      const benchmark = activePowertrainBenchmark || currentBenchmark;
      rawMedian = stats?.waitStats?.median || benchmark?.median_days || 375;
      rawP25 = stats?.waitStats?.p25 || benchmark?.p25_days || 185;
      rawP75 = stats?.waitStats?.p75 || benchmark?.p75_days || 450;
    }
  }

  // Ensure percentiles are authentic and NEVER zero
  const p25Days = Math.max(30, rawP25 || 45);
  const medianDays = Math.max(p25Days, rawMedian || 65);
  const p75Days = Math.max(medianDays, rawP75 || 90);

  // Months calculated safely (never 0)
  const medianMonths = (medianDays / 30.4).toFixed(1);
  const minWaitMonths = Math.max(1, Math.round(p25Days / 30.4));
  const maxWaitMonths = Math.max(minWaitMonths + 1, Math.round(p75Days / 30.4));

  const optimisticDate = calculateProjectedDate(p25Days);
  const conservativeDate = calculateProjectedDate(p75Days);
  const medianDate = calculateProjectedDate(medianDays);

  const verifiedSampleSize = isBaselineFallback
    ? isUs
      ? usBenchmark.sample_size
      : currentBenchmark?.sample_size || 14
    : stats?.sampleCounts?.delivered || stats?.sampleCounts?.total || regionalCount || 10;

  const fallbackBadgeText = isLimitedRegionalData
    ? isUs
      ? `National US baseline · Limited regional data for ${regionCode}`
      : `National baseline · Limited regional data for ${regionCode}`
    : null;

  const isPlanningBenchmark = isLimitedRegionalData || !stats?.waitStats;
  const estimateType: 'empirical' | 'planning_benchmark' = isPlanningBenchmark
    ? 'planning_benchmark'
    : 'empirical';

  const sampleBadgeText = isPlanningBenchmark
    ? `Planning Benchmark (n=${verifiedSampleSize} reference baseline deliveries)`
    : `Based on ${verifiedSampleSize} verified deliveries`;

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
    isBaselineFallback,
    isLimitedRegionalData,
    fallbackBadgeText,
    verifiedSampleSize,
    sampleBadgeText,
    estimateType,
    multiplierBreakdown: null,
    calculateProjectedDate,
  };
}
