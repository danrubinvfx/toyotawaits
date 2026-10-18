import { describe, it, expect } from 'vitest';
import {
  calculateEstimatedWaitTime,
  clampWaitDays,
  MAX_WAIT_TIME_DAYS,
  PROVINCIAL_MULTIPLIERS,
  TRIM_MULTIPLIERS,
  BASE_MODEL_P75,
  getProvincialMultiplier,
  getTrimMultiplier,
} from '@/lib/estimator';
import { CANADIAN_PROVINCES_LIST, CANADIAN_VEHICLE_CATALOG } from '@/lib/data/vehicles';
import { BASELINE_MODEL_BENCHMARKS } from '@/lib/db/stats';

describe('Estimator Math Clamping & Multiplier Guardrails (src/lib/estimator.ts)', () => {
  describe('clampWaitDays', () => {
    it('clamps wait times to MAX_WAIT_TIME_DAYS (420 days)', () => {
      expect(clampWaitDays(500)).toBe(420);
      expect(clampWaitDays(421)).toBe(420);
      expect(clampWaitDays(420)).toBe(420);
      expect(clampWaitDays(300)).toBe(300);
      expect(clampWaitDays(0)).toBe(0);
      expect(clampWaitDays(-10)).toBe(0);
    });

    it('respects custom cap if provided', () => {
      expect(clampWaitDays(500, 365)).toBe(365);
    });
  });

  describe('Provincial & Trim Multipliers', () => {
    it('applies provincial EV/PHEV rebate multipliers for BC and QC (1.15x)', () => {
      expect(getProvincialMultiplier('BC')).toBe(1.15);
      expect(getProvincialMultiplier('bc')).toBe(1.15);
      expect(getProvincialMultiplier('QC')).toBe(1.15);
      expect(getProvincialMultiplier('qc')).toBe(1.15);
    });

    it('applies ON volume multiplier (1.05x) and AB baseline (1.00x)', () => {
      expect(getProvincialMultiplier('ON')).toBe(1.05);
      expect(getProvincialMultiplier('AB')).toBe(1.00);
    });

    it('applies high-demand trim multiplier for XSE Tech (1.15x) and fast-track SE (0.88x)', () => {
      expect(getTrimMultiplier('xse-technology-awd')).toBe(1.15);
      expect(getTrimMultiplier('se-awd')).toBe(0.88);
    });
  });

  describe('Standardized Percentile Spreads (P25, P50, P75)', () => {
    it('returns standardized percentile spreads with p25 <= p50 <= p75', () => {
      const result = calculateEstimatedWaitTime({
        modelSlug: 'rav4',
        powertrainSlug: 'hev',
        province: 'ON',
        trimSlug: 'xle-awd',
      });

      expect(result.p25).toBeDefined();
      expect(result.p50).toBeDefined();
      expect(result.p75).toBeDefined();

      expect(result.p25).toBeLessThanOrEqual(result.p50);
      expect(result.p50).toBeLessThanOrEqual(result.p75);

      // Backwards-compatible aliases
      expect(result.p25Days).toBe(result.p25);
      expect(result.medianDays).toBe(result.p50);
      expect(result.p75Days).toBe(result.p75);
      expect(result.median).toBe(result.p50);
    });
  });

  describe('Hard Bounding Guardrail (<= 420 days)', () => {
    it('clamps RAV4 PHEV XSE Technology in BC to exactly <= 420 days', () => {
      // RAV4 base P75 is 382. Compounded multiplier: 1.15 (BC) * 1.15 (XSE Tech) = 1.3225 -> 505 days unclamped
      const result = calculateEstimatedWaitTime({
        modelSlug: 'rav4',
        powertrainSlug: 'phev',
        trimSlug: 'xse-technology-awd',
        province: 'BC',
        depositDate: '2026-01-15',
      });

      expect(result.p75).toBeLessThanOrEqual(MAX_WAIT_TIME_DAYS);
      expect(result.p75).toBe(420);
      expect(result.p50).toBeLessThanOrEqual(420);
      expect(result.p25).toBeLessThanOrEqual(420);
      expect(result.p25).toBeLessThanOrEqual(result.p50);
      expect(result.p50).toBeLessThanOrEqual(result.p75);
    });

    it('clamps RAV4 PHEV XSE Technology in QC to exactly <= 420 days', () => {
      const result = calculateEstimatedWaitTime({
        modelSlug: 'rav4',
        powertrainSlug: 'phev',
        trimSlug: 'xse-technology-awd',
        province: 'QC',
        depositDate: '2026-01-15',
      });

      expect(result.p75).toBeLessThanOrEqual(MAX_WAIT_TIME_DAYS);
      expect(result.p75).toBe(420);
    });

    it('clamps Sienna in high demand provinces (ON / BC / QC) to <= 420 days', () => {
      // Sienna base P75 is 450 days
      const result = calculateEstimatedWaitTime({
        modelSlug: 'sienna',
        powertrainSlug: 'hev',
        trimSlug: 'limited-awd',
        province: 'ON',
        depositDate: '2026-01-15',
      });

      expect(result.p75).toBeLessThanOrEqual(MAX_WAIT_TIME_DAYS);
      expect(result.p75).toBe(420);
      expect(result.p50).toBeLessThanOrEqual(420);
      expect(result.p25).toBeLessThanOrEqual(420);
    });

    it('clamps Grand Highlander Hybrid MAX Platinum in BC to <= 420 days', () => {
      // Grand Highlander base P75 is 380 days * 1.18 (Platinum) * 1.15 (BC) = 515 days
      const result = calculateEstimatedWaitTime({
        modelSlug: 'grand-highlander',
        powertrainSlug: 'hybrid-max',
        trimSlug: 'hybrid-max-platinum-awd',
        province: 'BC',
        depositDate: '2026-01-15',
      });

      expect(result.p75).toBeLessThanOrEqual(MAX_WAIT_TIME_DAYS);
      expect(result.p75).toBe(420);
    });

    it('clamps raw stats wait times exceeding 420 days down to 420 days', () => {
      const excessiveStats = {
        modelSlug: 'sienna',
        modelName: 'Sienna',
        powertrainSlug: 'hev',
        powertrainName: 'Hybrid (HEV)',
        trimSlug: null,
        trimName: null,
        province: 'ON' as const,
        sampleCounts: { total: 20, delivered: 18, pending: 2 },
        waitStats: {
          p25: 440,
          median: 510,
          p75: 560,
          mean: 505,
          min: 400,
          max: 620,
        },
        pricingInsights: { atMsrpPercent: 85, aboveMsrpPercent: 15, avgAddonsCad: 0 },
        confidenceRating: 'high' as const,
      };

      const result = calculateEstimatedWaitTime({
        modelSlug: 'sienna',
        province: 'ON',
        stats: excessiveStats,
        depositDate: '2026-01-15',
      });

      expect(result.p75).toBe(420);
      expect(result.p50).toBe(420);
      expect(result.p25).toBe(420);
    });

    it('clamps Corolla Gas to a maximum ceiling of 120 days regardless of multipliers', () => {
      const result = calculateEstimatedWaitTime({
        modelSlug: 'corolla',
        powertrainSlug: 'gas',
        trimSlug: 'xse',
        province: 'BC',
        depositDate: '2026-01-15',
      });

      expect(result.p75).toBeLessThanOrEqual(120);
      expect(result.p50).toBeLessThanOrEqual(120);
      expect(result.p25).toBeLessThanOrEqual(result.p50);
      expect(result.p50).toBeLessThanOrEqual(result.p75);
    });

    it('clamps Corolla Hybrid to a maximum ceiling of 240 days regardless of multipliers', () => {
      const result = calculateEstimatedWaitTime({
        modelSlug: 'corolla',
        powertrainSlug: 'hev',
        trimSlug: 'xse-awd',
        province: 'BC',
        depositDate: '2026-01-15',
      });

      expect(result.p75).toBeLessThanOrEqual(240);
      expect(result.p50).toBeLessThanOrEqual(240);
      expect(result.p25).toBeLessThanOrEqual(result.p50);
      expect(result.p50).toBeLessThanOrEqual(result.p75);
    });

    it('clamps Corolla Cross Hybrid to a maximum ceiling of 400 days regardless of multipliers', () => {
      const result = calculateEstimatedWaitTime({
        modelSlug: 'corolla-cross',
        powertrainSlug: 'hev',
        trimSlug: 'xse-awd',
        province: 'QC',
        depositDate: '2026-01-15',
      });

      expect(result.p75).toBeLessThanOrEqual(400);
      expect(result.p50).toBeLessThanOrEqual(400);
      expect(result.p25).toBeLessThanOrEqual(result.p50);
      expect(result.p50).toBeLessThanOrEqual(result.p75);
    });

    it('confirms wait-time outputs are clamped at or below 420 days for ALL vehicle models, trims, and provinces', () => {
      const trimsToTest = [
        ...Object.keys(TRIM_MULTIPLIERS),
        'base',
        'all',
        'unknown-trim',
      ];

      for (const vehicle of CANADIAN_VEHICLE_CATALOG) {
        for (const province of CANADIAN_PROVINCES_LIST) {
          for (const trimSlug of trimsToTest) {
            const result = calculateEstimatedWaitTime({
              modelSlug: vehicle.slug,
              province: province.code,
              trimSlug,
              depositDate: '2026-01-15',
            });

            expect(result.p75).toBeLessThanOrEqual(MAX_WAIT_TIME_DAYS);
            expect(result.p50).toBeLessThanOrEqual(MAX_WAIT_TIME_DAYS);
            expect(result.p25).toBeLessThanOrEqual(MAX_WAIT_TIME_DAYS);
            expect(result.p25).toBeLessThanOrEqual(result.p50);
            expect(result.p50).toBeLessThanOrEqual(result.p75);
            expect(result.p75).toBeGreaterThanOrEqual(0);
          }
        }
      }
    });
  });

  describe('Out-Year Bounding (No 2028+ Drift)', () => {
    it('ensures conservative projected dates for 2026 orders land in 2026-2027 and never drift into 2028+', () => {
      const orderDates = ['2026-01-01', '2026-03-15', '2026-06-01', '2026-09-01'];

      for (const depositDate of orderDates) {
        const result = calculateEstimatedWaitTime({
          modelSlug: 'rav4',
          powertrainSlug: 'phev',
          trimSlug: 'xse-technology-awd',
          province: 'BC',
          depositDate,
        });

        // 420 days from any 2026 date:
        // 2026-01-01 + 420 days = ~Feb 2027
        // 2026-09-01 + 420 days = ~Oct 2027
        // None should land in 2028 or later
        expect(result.conservativeDate).toMatch(/2026|2027/);
        expect(result.conservativeDate).not.toContain('2028');
        expect(result.conservativeDate).not.toContain('2029');
      }
    });

    it('clamps calculateProjectedDate offset to MAX_WAIT_TIME_DAYS (420 days)', () => {
      const result = calculateEstimatedWaitTime({
        modelSlug: 'sienna',
        depositDate: '2026-01-01',
      });

      // Even if an extreme offset like 999 or 600 days is requested, it clamps to 420 days
      const projected = result.calculateProjectedDate(999);
      expect(projected).toMatch(/2027/);
      expect(projected).not.toContain('2028');
      expect(projected).not.toContain('2029');
    });
  });

  describe('Relative Trim & Province Multiplier Ordering', () => {
    it('proves SE trim delivers faster than XSE Technology trim in the same province', () => {
      const seResult = calculateEstimatedWaitTime({
        modelSlug: 'rav4',
        trimSlug: 'se-awd',
        province: 'ON',
      });

      const xseTechResult = calculateEstimatedWaitTime({
        modelSlug: 'rav4',
        trimSlug: 'xse-technology-awd',
        province: 'ON',
      });

      expect(seResult.p75).toBeLessThan(xseTechResult.p75);
    });

    it('proves high-rebate province (BC) has longer wait queue than standard allocation (AB) for same trim', () => {
      const abResult = calculateEstimatedWaitTime({
        modelSlug: 'rav4',
        trimSlug: 'xle-awd',
        province: 'AB',
      });

      const bcResult = calculateEstimatedWaitTime({
        modelSlug: 'rav4',
        trimSlug: 'xle-awd',
        province: 'BC',
      });

      expect(bcResult.p75).toBeGreaterThan(abResult.p75);
    });
  });
});
