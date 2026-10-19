/**
 * Estimator Math & Bounding Guardrails
 * ToyotaWaits Canadian Toyota Allocation & Wait-Time Engine
 *
 * Implements vehicle trim and provincial rebate multipliers with hard bounding guardrails
 * (clamped to realistic upper bounds of <= 420 days) to prevent impossible compounding
 * into out-years (2028+).
 */

import { BASELINE_MODEL_BENCHMARKS, ModelWaitBenchmark, getPowertrainBenchmark } from '@/lib/db/stats';
import { getRegionByCode } from '@/lib/data/vehicles';
import { RegionalWaitSummary } from '@/lib/types/contracts';

/** Universal upper bound guardrail for calculated wait times */
export const MAX_WAIT_TIME_DAYS = 420;

/** Baseline model benchmarks for P75 wait times */
export const BASE_MODEL_P75: Record<string, number> = {
  sienna: 450,
  rav4: 382,
  'grand-highlander': 320,
  'prius-prime': 322,
  prius: 146,
  'land-cruiser': 145,
  tacoma: 180,
  corolla: 165,
  'corolla-cross': 270,
  sequoia: 240,
};

/** Provincial demand & EV/PHEV rebate multipliers */
export const PROVINCIAL_MULTIPLIERS: Record<string, number> = {
  bc: 1.15, // High demand driven by CleanBC provincial rebate + federal iZEV
  qc: 1.15, // High demand driven by Roulez vert rebate + federal iZEV
  on: 1.05, // High volume metropolitan demand
  ab: 1.00, // Standard baseline allocation
  mb: 0.95,
  sk: 0.95,
  ns: 1.00,
  nb: 0.95,
  nl: 0.95,
  pe: 1.00,
  yt: 0.95,
  nt: 0.95,
  nu: 0.95,
};

/** Model-specific trim-level allocation demand multipliers */
export const MODEL_TRIM_MULTIPLIERS: Record<string, Record<string, number>> = {
  rav4: {
    'xse-technology-awd': 1.15,
    'xse-awd': 1.05,
    'se-awd': 0.88,
    'woodland-awd': 1.05,
    'limited-awd': 1.12,
    'xle-awd': 1.00,
    'le-awd': 0.85,
    'gr-sport-awd': 1.18,
  },
  sienna: {
    'limited-awd': 1.18,
    'xse-awd': 1.10,
    'xle-awd': 1.02,
    'le-fwd-8-passenger': 0.88,
  },
  'grand-highlander': {
    'hybrid-max-platinum-awd': 1.18,
    'limited-awd': 1.08,
    'xle-awd': 0.95,
  },
  prius: {
    'xse-premium': 1.15,
    xse: 1.05,
    se: 0.85,
  },
  'prius-prime': {
    'xse-premium': 1.15,
    xse: 1.05,
    se: 0.85,
  },
  corolla: {
    l: 0.90,
    le: 1.00,
    se: 1.05,
    xse: 1.10,
    'hatchback-se': 1.02,
    'hatchback-xse': 1.08,
    'le-awd': 1.00,
    'se-awd': 1.08,
    'xse-awd': 1.12,
    core: 1.00,
    premium: 1.08,
    'circuit-edition': 1.15,
  },
  'corolla-cross': {
    'l-fwd': 0.92,
    'l-awd': 0.95,
    'le-fwd': 1.00,
    'le-awd': 1.05,
    'xle-awd': 1.10,
    'se-awd': 1.08,
    'xse-awd': 1.15,
  },
  sequoia: {
    'sr5-trd-off-road': 0.85,
    'limited-nightshade': 0.95,
    platinum: 1.05,
    'trd-pro': 1.25,
    capstone: 1.10,
  },
};

/** Common trim-level allocation demand multipliers fallback */
export const TRIM_MULTIPLIERS: Record<string, number> = {
  // Unique trims
  'xse-technology-awd': 1.15,
  'se-awd': 0.88,
  'woodland-awd': 1.05,
  'gr-sport-awd': 1.18,
  'le-fwd-8-passenger': 0.88,
  'hybrid-max-platinum-awd': 1.18,
  'xse-premium': 1.15,
  xse: 1.05,
  se: 0.85,
  core: 1.00,
  premium: 1.08,
  'circuit-edition': 1.15,
  'hatchback-se': 1.02,
  'hatchback-xse': 1.08,
  'l-fwd': 0.92,
  'l-awd': 0.95,
  'le-fwd': 1.00,

  // Baseline averages across multi-model trims
  'limited-awd': 1.12,
  'xse-awd': 1.08,
  'xle-awd': 1.00,
  'le-awd': 0.85,
  le: 1.00,
  l: 0.90,
};

export interface EstimatorOptions {
  modelSlug?: string;
  model?: string;
  powertrainSlug?: string;
  powertrain?: string;
  trimSlug?: string;
  trim?: string;
  trimName?: string;
  province?: string;
  depositDate?: string | Date;
  todayDate?: Date;
  benchmarks?: Record<string, ModelWaitBenchmark>;
  stats?: RegionalWaitSummary | null;
}

export interface EstimatorResult {
  p25: number;
  p50: number;
  p75: number;
  median: number;
  p25Days: number;
  medianDays: number;
  p75Days: number;
  baseP75Days: number;
  minWaitMonths: number;
  maxWaitMonths: number;
  medianMonths: string;
  optimisticDate: string;
  medianDate: string;
  conservativeDate: string;
  daysAlreadyWaited: number;
  isHistoricalOrderDate: boolean;
  isLimitedRegionalData: boolean;
  estimateType: 'empirical' | 'planning_benchmark';
  verifiedSampleSize: number;
  sampleBadgeText: string;
  carryoverNote: string | null;
  exceedsCarryoverThreshold: boolean;
  multiplierBreakdown: string | null;
  calculateProjectedDate: (daysOffset: number) => string;
}

/**
 * Hard-clamps any wait day number to realistic upper bounds (<= 420 days).
 */
export function clampWaitDays(days: number, maxCap = MAX_WAIT_TIME_DAYS): number {
  return Math.min(Math.max(0, Math.round(days)), maxCap);
}

/**
 * Resolves provincial multiplier based on province code.
 */
export function getProvincialMultiplier(province?: string): number {
  if (!province) return 1.0;
  const code = province.toLowerCase();
  return PROVINCIAL_MULTIPLIERS[code] ?? 1.0;
}

/**
 * Resolves trim demand multiplier.
 */
export function getTrimMultiplier(trimSlug?: string, modelSlug?: string): number {
  if (!trimSlug) return 1.0;
  const slug = trimSlug.toLowerCase();
  const model = modelSlug?.toLowerCase();
  if (model && MODEL_TRIM_MULTIPLIERS[model]?.[slug] !== undefined) {
    return MODEL_TRIM_MULTIPLIERS[model][slug];
  }
  return TRIM_MULTIPLIERS[slug] ?? 1.0;
}

/**
 * Strict ceiling clamping per model and powertrain specifications:
 * - Corolla Gas: max ceiling 120 days.
 * - Corolla Hybrid: max ceiling 240 days.
 * - Corolla Cross Hybrid: max ceiling 400 days.
 */
export function getModelCeiling(modelSlug?: string, powertrainSlug?: string, trimSlug?: string): number | null {
  const m = modelSlug?.toLowerCase();
  const p = powertrainSlug?.toLowerCase();
  const t = trimSlug?.toLowerCase();

  if (m === 'corolla') {
    const isGas =
      p === 'gas' ||
      ['l', 'le', 'se', 'xse', 'hatchback-se', 'hatchback-xse'].includes(t || '');
    if (isGas) return 120;

    const isHev =
      p === 'hev' ||
      ['le-awd', 'se-awd', 'xse-awd'].includes(t || '');
    if (isHev) return 240;

    const isGr =
      p === 'gr' ||
      ['core', 'premium', 'circuit-edition'].includes(t || '');
    if (isGr) return 360;

    return 240;
  }

  if (m === 'corolla-cross') {
    const isHev =
      p === 'hev' ||
      ['se-awd', 'xse-awd'].includes(t || '');
    if (isHev) return 400;

    const isGas =
      p === 'gas' ||
      ['l-fwd', 'l-awd', 'le-fwd', 'le-awd', 'xle-awd'].includes(t || '');
    if (isGas) return 180;

    return 400;
  }

  if (m === 'sequoia') {
    const isTrdPro = t === 'trd-pro' || t?.includes('trd-pro');
    if (isTrdPro) return 420;
    return 330;
  }

  return null;
}

/**
 * Core estimation function implementing multipliers and bounding guardrails.
 */
export function calculateEstimatedWaitTime(options: EstimatorOptions): EstimatorResult {
  const modelSlug = (options.modelSlug || options.model || 'rav4').toLowerCase();
  const powertrainSlug = (options.powertrainSlug || options.powertrain || '').toLowerCase();
  const trimSlug = (options.trimSlug || options.trim || '').toLowerCase();
  const trimName = options.trimName;
  const province = options.province?.toUpperCase();
  const benchmarks = options.benchmarks || BASELINE_MODEL_BENCHMARKS;
  const todayDate = options.todayDate || new Date();
  const stats = options.stats;

  // Deposit date handling
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

  // Multiplier resolution
  const provMultiplier = getProvincialMultiplier(province);
  const trimMult = getTrimMultiplier(trimSlug, modelSlug);
  const combinedMultiplier = provMultiplier * trimMult;

  const activePowertrainBenchmark = getPowertrainBenchmark(modelSlug, powertrainSlug);
  const currentBenchmark = activePowertrainBenchmark || benchmarks[modelSlug] || BASELINE_MODEL_BENCHMARKS[modelSlug];

  // Raw percentiles from stats or benchmark
  const regionalSampleCount = stats?.sampleCounts?.delivered ?? stats?.sampleCounts?.total ?? 0;
  const isLimitedRegionalData = Boolean(stats && regionalSampleCount < 5);

  let rawMedian = isLimitedRegionalData
    ? currentBenchmark?.median_days ?? 245
    : stats?.waitStats?.median ?? currentBenchmark?.median_days ?? 245;

  let rawP25 = isLimitedRegionalData
    ? currentBenchmark?.p25_days ?? 185
    : stats?.waitStats?.p25 ?? currentBenchmark?.p25_days ?? 185;

  let rawP75 = isLimitedRegionalData
    ? currentBenchmark?.p75_days ?? 382
    : stats?.waitStats?.p75 ?? currentBenchmark?.p75_days ?? 382;

  // Apply multipliers if calculated from benchmark
  if (!stats?.waitStats) {
    rawP75 = Math.round(rawP75 * combinedMultiplier);
    rawMedian = Math.round(rawMedian * combinedMultiplier);
    rawP25 = Math.round(rawP25 * combinedMultiplier);
  }

  // HARD BOUNDING GUARDRAILS:
  // Clamp maximum calculated wait time to realistic upper bounds (hard cap per model ceiling).
  // Ensures projections do not compound into impossible out-years (e.g. 2028+).
  const specificCeiling = getModelCeiling(modelSlug, powertrainSlug, trimSlug);
  const maxCeiling = specificCeiling !== null ? specificCeiling : MAX_WAIT_TIME_DAYS;
  const p75 = clampWaitDays(rawP75, maxCeiling);
  const p50 = clampWaitDays(Math.min(rawMedian, p75), maxCeiling);
  const p25 = clampWaitDays(Math.min(rawP25, p50), maxCeiling);

  // Projected arrival dates using bounded days
  const calculateProjectedDate = (daysOffset: number): string => {
    const cappedOffset = clampWaitDays(daysOffset, maxCeiling);
    const base = depositDateStr
      ? new Date(depositDateStr + (depositDateStr.includes('T') ? '' : 'T00:00:00'))
      : todayDate;
    const baseTime = !isNaN(base.getTime()) ? base.getTime() : todayDate.getTime();
    const target = new Date(baseTime + cappedOffset * 24 * 60 * 60 * 1000);
    return target.toLocaleDateString('en-CA', {
      month: 'short',
      year: 'numeric',
    });
  };

  const optimisticDate = calculateProjectedDate(p25);
  const conservativeDate = calculateProjectedDate(p75);
  const medianDate = calculateProjectedDate(p50);

  const medianMonths = (p50 / 30.4).toFixed(1);
  const minWaitMonths = Math.max(1, Math.round(p25 / 30.4));
  const maxWaitMonths = Math.max(2, Math.round(p75 / 30.4));

  const verifiedSampleSize = isLimitedRegionalData
    ? currentBenchmark?.sample_size ?? 10
    : stats?.sampleCounts?.delivered || currentBenchmark?.sample_size || stats?.sampleCounts?.total || 140;

  const baseP75Days = BASE_MODEL_P75[modelSlug] ?? currentBenchmark?.p75_days ?? 382;

  const provinceObj = getRegionByCode(province);
  const provinceLabel = provinceObj ? provinceObj.name : province || 'regional';
  const trimLabel =
    trimName && trimName !== 'All Trims' && trimName !== 'all'
      ? trimName
      : trimSlug && trimSlug !== 'all'
      ? trimSlug.toUpperCase()
      : 'trim';

  const isPlanningBenchmark = isLimitedRegionalData || !stats?.waitStats;
  const estimateType: 'empirical' | 'planning_benchmark' = isPlanningBenchmark
    ? 'planning_benchmark'
    : 'empirical';

  const multiplierBreakdown =
    p75 !== baseP75Days
      ? `Base P75: ${baseP75Days} days · Adjusted to ~${p75} days based on ${provinceLabel} regional allocation and ${trimLabel} demand factors.`
      : null;

  const sampleBadgeText =
    modelSlug === 'tacoma'
      ? '10 Historical Dealer Benchmarks (Community submissions opening soon).'
      : isPlanningBenchmark
      ? `Planning Benchmark (n=${verifiedSampleSize} reference baseline deliveries)`
      : `Based on ${verifiedSampleSize} verified deliveries`;

  const exceedsCarryoverThreshold = p75 >= 400;
  const carryoverNote = exceedsCarryoverThreshold
    ? 'Orders over 14 months typically carry over into subsequent model-year allocation queues.'
    : null;

  return {
    p25,
    p50,
    p75,
    median: p50,
    p25Days: p25,
    medianDays: p50,
    p75Days: p75,
    baseP75Days,
    minWaitMonths,
    maxWaitMonths,
    medianMonths,
    optimisticDate,
    medianDate,
    conservativeDate,
    daysAlreadyWaited,
    isHistoricalOrderDate,
    isLimitedRegionalData,
    estimateType,
    verifiedSampleSize,
    sampleBadgeText,
    carryoverNote,
    exceedsCarryoverThreshold,
    multiplierBreakdown,
    calculateProjectedDate,
  };
}

export const calculateWaitTime = calculateEstimatedWaitTime;
export const estimateWaitTime = calculateEstimatedWaitTime;
export default calculateEstimatedWaitTime;
