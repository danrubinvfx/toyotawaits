/**
 * ToyotaWaits.ca - Wait Times API Client & Section 6 Evidence Gate
 * Specification Reference: Master Plan v3.1 (Section 5, 6, 8, and 9) - Stage 3 (Wait Integration)
 */

import { RegionalWaitSummary } from '@/lib/types/contracts';

export type WaitTimeEvidenceStatus =
  | 'SUFFICIENT'
  | 'INSUFFICIENT_DATA'
  | 'STALE'
  | 'NETWORK_ERROR';

export interface CohortFilter {
  model: string;
  modelYear?: number;
  powertrain: string;
  province: string;
}

export interface CohortWaitTimeResult {
  p50Days: number | null;
  sampleCount: number;
  isStale: boolean;
  status: WaitTimeEvidenceStatus;
  cohortDescription?: string;
  latestTimestamp?: string | null;
  ageDays?: number;
}

export const MIN_EVIDENCE_SAMPLES = 20; // Minimum 20 valid completed deliveries
export const MAX_STALENESS_DAYS = 7; // Discard records/cohorts if aggregate timestamp is older than 7 days
export const DELIVERY_RECENCY_DAYS = 180; // Within the past 180 days

/**
 * Pure evaluator enforcing Section 6 Evidence Contract:
 * 1. Minimum 20 valid completed deliveries within the past 180 days for the specific cohort.
 * 2. Discard records/cohorts if aggregate timestamp is older than 7 days (mark as stale).
 * 3. Strict rule: NO silent fallback to national or cross-powertrain medians.
 */
export function evaluateCohortEvidence(
  summary: Partial<RegionalWaitSummary> | null | undefined,
  cohort: CohortFilter,
  options?: { now?: Date }
): CohortWaitTimeResult {
  const normProvince = cohort.province.trim().toUpperCase();
  const cohortLabel = `${cohort.model.toUpperCase()} ${cohort.powertrain.toUpperCase()} (${normProvince})`;

  if (!summary) {
    return {
      p50Days: null,
      sampleCount: 0,
      isStale: false,
      status: 'INSUFFICIENT_DATA',
      cohortDescription: cohortLabel,
    };
  }

  // Strict rule: NO silent fallback to national or cross-powertrain medians
  if (summary.isBaselineFallback || summary.isTrimFallback) {
    return {
      p50Days: null,
      sampleCount: summary.sampleCounts?.delivered ?? 0,
      isStale: false,
      status: 'INSUFFICIENT_DATA',
      cohortDescription: cohortLabel,
    };
  }

  // Province must strictly match specific cohort (no national ALL fallback)
  if (summary.province && summary.province.toUpperCase() !== normProvince) {
    return {
      p50Days: null,
      sampleCount: 0,
      isStale: false,
      status: 'INSUFFICIENT_DATA',
      cohortDescription: cohortLabel,
    };
  }

  // Check completed deliveries count within past 180 days
  const deliveredCount =
    summary.sampleCounts?.delivered ?? summary.delivered_count ?? 0;

  // Gate 1: Minimum 20 valid completed deliveries
  if (deliveredCount < MIN_EVIDENCE_SAMPLES) {
    return {
      p50Days: null,
      sampleCount: deliveredCount,
      isStale: false,
      status: 'INSUFFICIENT_DATA',
      cohortDescription: cohortLabel,
    };
  }

  // Gate 2: Discard records/cohorts if aggregate timestamp is older than 7 days (mark as stale)
  const nowMs = options?.now ? options.now.getTime() : Date.now();
  const timestamp = summary.latestSubmissionAt;
  let isStale = false;
  let ageDays = 0;

  if (timestamp) {
    const timeMs = new Date(timestamp).getTime();
    if (!Number.isNaN(timeMs)) {
      ageDays = (nowMs - timeMs) / (1000 * 60 * 60 * 24);
      if (ageDays > MAX_STALENESS_DAYS) {
        isStale = true;
      }
    }
  }

  if (isStale) {
    return {
      p50Days: null,
      sampleCount: deliveredCount,
      isStale: true,
      status: 'STALE',
      ageDays: Math.round(ageDays * 10) / 10,
      latestTimestamp: timestamp,
      cohortDescription: cohortLabel,
    };
  }

  // Extract P50 median days
  const p50 =
    summary.waitStats?.median ??
    summary.delivered_median_days ??
    null;

  if (p50 == null || p50 <= 0) {
    return {
      p50Days: null,
      sampleCount: deliveredCount,
      isStale: false,
      status: 'INSUFFICIENT_DATA',
      cohortDescription: cohortLabel,
    };
  }

  return {
    p50Days: Math.round(p50),
    sampleCount: deliveredCount,
    isStale: false,
    status: 'SUFFICIENT',
    ageDays: Math.round(ageDays * 10) / 10,
    latestTimestamp: timestamp,
    cohortDescription: `Based on ${deliveredCount} verified ${normProvince} deliveries in past 180d`,
  };
}

/**
 * Fetches aggregate P50 wait times from the existing read-only public endpoint / Supabase view
 * and applies the Section 6 Evidence Contract.
 */
export async function fetchCohortWaitTime(
  cohort: CohortFilter,
  options?: {
    fetchFn?: typeof fetch;
    baseUrl?: string;
    now?: Date;
  }
): Promise<CohortWaitTimeResult> {
  const fetcher =
    options?.fetchFn ||
    (typeof window !== 'undefined' ? window.fetch.bind(window) : fetch);
  const baseUrl = options?.baseUrl || '';

  try {
    const query = new URLSearchParams({
      model: cohort.model.toLowerCase(),
      powertrain: cohort.powertrain.toLowerCase(),
      province: cohort.province.toUpperCase(),
      timeframe: '180d',
    });

    const res = await fetcher(`${baseUrl}/api/aggregate?${query.toString()}`);
    if (!res.ok) {
      return {
        p50Days: null,
        sampleCount: 0,
        isStale: false,
        status: 'NETWORK_ERROR',
      };
    }

    const json = await res.json();
    if (!json.success || !json.data) {
      return {
        p50Days: null,
        sampleCount: 0,
        isStale: false,
        status: 'INSUFFICIENT_DATA',
      };
    }

    return evaluateCohortEvidence(json.data, cohort, { now: options?.now });
  } catch {
    return {
      p50Days: null,
      sampleCount: 0,
      isStale: false,
      status: 'NETWORK_ERROR',
    };
  }
}
