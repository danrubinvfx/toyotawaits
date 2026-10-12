import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useEstimator, CARRYOVER_ALLOCATION_NOTE } from '@/hooks/useEstimator';
import { BASELINE_MODEL_BENCHMARKS } from '@/lib/db/stats';

describe('useEstimator Hook', () => {
  it('computes true percentiles without 420-day clamping for Sienna', () => {
    const { result } = renderHook(() =>
      useEstimator({
        modelSlug: 'sienna',
        powertrainSlug: 'hev',
        province: 'ON',
        depositDate: '2026-01-15',
        todayDate: new Date('2026-06-01T00:00:00Z'),
        benchmarks: BASELINE_MODEL_BENCHMARKS,
        stats: {
          modelSlug: 'sienna',
          modelName: 'Sienna',
          powertrainSlug: 'hev',
          powertrainName: 'Hybrid (HEV)',
          trimSlug: null,
          trimName: null,
          province: 'ON',
          sampleCounts: { total: 10, delivered: 8, pending: 2 },
          waitStats: {
            p25: 440,
            median: 510,
            p75: 560,
            mean: 505.7,
            min: 400,
            max: 620,
          },
          pricingInsights: { atMsrpPercent: 85, aboveMsrpPercent: 15, avgAddonsCad: 0 },
          confidenceRating: 'medium',
        },
      })
    );

    // P75 is 560 days, NOT clamped to 420
    expect(result.current.p75Days).toBe(560);
    expect(result.current.baseP75Days).toBe(450);
    expect(result.current.multiplierBreakdown).toBe(
      'Base P75: 450 days · Adjusted to ~560 days based on Ontario regional allocation and AWD demand factors.'
    );
    expect(result.current.medianDays).toBe(510);
    expect(result.current.p25Days).toBe(440);
    expect(result.current.exceedsCarryoverThreshold).toBe(true);
    expect(result.current.carryoverNote).toBe(CARRYOVER_ALLOCATION_NOTE);
  });

  it('calculates projected arrival date without 420-day offset clamping', () => {
    const { result } = renderHook(() =>
      useEstimator({
        modelSlug: 'sienna',
        powertrainSlug: 'hev',
        province: 'ON',
        depositDate: '2026-01-01',
        todayDate: new Date('2026-01-01T00:00:00Z'),
      })
    );

    // 560 days offset from 2026-01-01 should reach mid-2027 (~July 2027)
    const date560 = result.current.calculateProjectedDate(560);
    expect(date560).toContain('2027');
  });

  it('does not trigger carryover note for fast delivery vehicles under 12 months', () => {
    const { result } = renderHook(() =>
      useEstimator({
        modelSlug: 'prius',
        powertrainSlug: 'hev',
        province: 'ON',
        depositDate: '2026-01-15',
        todayDate: new Date('2026-02-01T00:00:00Z'),
        stats: {
          modelSlug: 'prius',
          modelName: 'Prius',
          powertrainSlug: 'hev',
          powertrainName: 'Hybrid (HEV)',
          trimSlug: null,
          trimName: null,
          province: 'ON',
          sampleCounts: { total: 10, delivered: 8, pending: 2 },
          waitStats: {
            p25: 95,
            median: 104,
            p75: 120,
            mean: 107.2,
            min: 80,
            max: 135,
          },
          pricingInsights: { atMsrpPercent: 100, aboveMsrpPercent: 0, avgAddonsCad: 0 },
          confidenceRating: 'medium',
        },
      })
    );

    expect(result.current.p75Days).toBe(120);
    expect(result.current.exceedsCarryoverThreshold).toBe(false);
    expect(result.current.carryoverNote).toBeNull();
  });

  it('renders Tacoma sampleBadgeText indicating historical dealer benchmarks', () => {
    const { result } = renderHook(() =>
      useEstimator({
        modelSlug: 'tacoma',
        powertrainSlug: 'gas',
        province: 'BC',
      })
    );

    expect(result.current.sampleBadgeText).toBe(
      '10 Historical Dealer Benchmarks (Community submissions opening soon).'
    );
  });
});
