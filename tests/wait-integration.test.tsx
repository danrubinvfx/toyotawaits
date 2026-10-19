import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import {
  evaluateCohortEvidence,
  fetchCohortWaitTime,
  MIN_EVIDENCE_SAMPLES,
  MAX_STALENESS_DAYS,
} from '@/lib/api/wait-times';
import { WaitOpportunityCard } from '@/components/calculator/WaitOpportunityCard';
import { VehicleSavingsCalculator } from '@/components/calculator/VehicleSavingsCalculator';
import { calculateExtraEnergyWhileWaiting } from '@/lib/calculator-engine';
import { RegionalWaitSummary } from '@/lib/types/contracts';

describe('Stage 3: Wait Integration & Section 6 Evidence Contract', () => {
  const mockNow = new Date('2026-10-19T12:00:00Z');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Evidence Contract Gate: 20+ Completed Deliveries within 180d', () => {
    const validCohort = {
      model: 'rav4',
      powertrain: 'hev',
      province: 'BC',
    };

    it('approves cohort with 20+ valid completed deliveries and returns empirical P50', () => {
      const summary: Partial<RegionalWaitSummary> = {
        modelSlug: 'rav4',
        powertrainSlug: 'hev',
        province: 'BC',
        sampleCounts: {
          total: 35,
          delivered: 24, // >= 20
          pending: 11,
        },
        waitStats: {
          p25: 140,
          median: 185, // P50
          p75: 230,
          mean: 188,
          min: 90,
          max: 290,
        },
        latestSubmissionAt: '2026-10-17T10:00:00Z', // 2 days old (fresh)
        isBaselineFallback: false,
        isTrimFallback: false,
      };

      const result = evaluateCohortEvidence(summary, validCohort, { now: mockNow });

      expect(result.status).toBe('SUFFICIENT');
      expect(result.p50Days).toBe(185);
      expect(result.sampleCount).toBe(24);
      expect(result.isStale).toBe(false);
      expect(result.cohortDescription).toContain('Based on 24 verified BC deliveries in past 180d');
    });

    it('rejects cohort when delivered sample count is under 20 and enforces manual fallback', () => {
      const summary: Partial<RegionalWaitSummary> = {
        modelSlug: 'rav4',
        powertrainSlug: 'hev',
        province: 'BC',
        sampleCounts: {
          total: 18,
          delivered: 14, // < 20
          pending: 4,
        },
        waitStats: {
          p25: 130,
          median: 175,
          p75: 210,
          mean: 172,
          min: 80,
          max: 250,
        },
        latestSubmissionAt: '2026-10-18T10:00:00Z',
        isBaselineFallback: false,
      };

      const result = evaluateCohortEvidence(summary, validCohort, { now: mockNow });

      expect(result.status).toBe('INSUFFICIENT_DATA');
      expect(result.p50Days).toBeNull();
      expect(result.sampleCount).toBe(14);
      expect(result.isStale).toBe(false);
    });

    it('strictly rejects silent fallback to national or cross-powertrain baselines', () => {
      const fallbackSummary: Partial<RegionalWaitSummary> = {
        modelSlug: 'rav4',
        powertrainSlug: 'hev',
        province: 'BC',
        sampleCounts: {
          total: 50,
          delivered: 35,
          pending: 15,
        },
        waitStats: {
          p25: 150,
          median: 200,
          p75: 250,
          mean: 202,
          min: 100,
          max: 310,
        },
        isBaselineFallback: true, // Baseline fallback flagged by backend
        latestSubmissionAt: '2026-10-18T10:00:00Z',
      };

      const result = evaluateCohortEvidence(fallbackSummary, validCohort, { now: mockNow });

      expect(result.status).toBe('INSUFFICIENT_DATA');
      expect(result.p50Days).toBeNull();
    });

    it('rejects cross-province mismatch (e.g. returned ALL or ON when BC requested)', () => {
      const mismatchedSummary: Partial<RegionalWaitSummary> = {
        modelSlug: 'rav4',
        powertrainSlug: 'hev',
        province: 'ALL', // National fallback
        sampleCounts: {
          total: 100,
          delivered: 65,
          pending: 35,
        },
        waitStats: {
          p25: 120,
          median: 160,
          p75: 200,
          mean: 162,
          min: 60,
          max: 260,
        },
        latestSubmissionAt: '2026-10-18T10:00:00Z',
      };

      const result = evaluateCohortEvidence(mismatchedSummary, validCohort, { now: mockNow });

      expect(result.status).toBe('INSUFFICIENT_DATA');
      expect(result.p50Days).toBeNull();
    });
  });

  describe('2. 7-Day Staleness Gate', () => {
    const validCohort = {
      model: 'rav4',
      powertrain: 'hev',
      province: 'BC',
    };

    it('rejects aggregate data older than 7 days and marks as STALE', () => {
      const staleSummary: Partial<RegionalWaitSummary> = {
        modelSlug: 'rav4',
        powertrainSlug: 'hev',
        province: 'BC',
        sampleCounts: {
          total: 40,
          delivered: 25, // >= 20
          pending: 15,
        },
        waitStats: {
          p25: 140,
          median: 190,
          p75: 240,
          mean: 192,
          min: 90,
          max: 300,
        },
        latestSubmissionAt: '2026-10-05T10:00:00Z', // 14 days ago (> 7 days)
        isBaselineFallback: false,
      };

      const result = evaluateCohortEvidence(staleSummary, validCohort, { now: mockNow });

      expect(result.status).toBe('STALE');
      expect(result.isStale).toBe(true);
      expect(result.p50Days).toBeNull();
      expect(result.ageDays).toBeGreaterThan(MAX_STALENESS_DAYS);
    });

    it('accepts aggregate data updated within 7 days', () => {
      const freshSummary: Partial<RegionalWaitSummary> = {
        modelSlug: 'rav4',
        powertrainSlug: 'hev',
        province: 'BC',
        sampleCounts: {
          total: 40,
          delivered: 22,
          pending: 18,
        },
        waitStats: {
          p25: 140,
          median: 180,
          p75: 220,
          mean: 182,
          min: 90,
          max: 270,
        },
        latestSubmissionAt: '2026-10-15T12:00:00Z', // 4 days ago (<= 7 days)
        isBaselineFallback: false,
      };

      const result = evaluateCohortEvidence(freshSummary, validCohort, { now: mockNow });

      expect(result.status).toBe('SUFFICIENT');
      expect(result.isStale).toBe(false);
      expect(result.p50Days).toBe(180);
    });
  });

  describe('3. Wait Energy Calculation Accuracy & Honest Sign Handling', () => {
    it('accurately calculates positive extra energy when current car costs more', () => {
      // Current car: $3,325/yr, Target car: $2,030/yr, Wait: 180 days
      // Annual delta = $1,295/yr
      // Extra energy = 1,295 * (180 / 365) = 638.63
      const extraEnergy = calculateExtraEnergyWhileWaiting(3325, 2030, 180);
      expect(extraEnergy).toBe(638.63);
    });

    it('accurately calculates zero extra energy when wait is 0 days or costs match', () => {
      expect(calculateExtraEnergyWhileWaiting(3325, 2030, 0)).toBe(0);
      expect(calculateExtraEnergyWhileWaiting(2000, 2000, 180)).toBe(0);
    });

    it('honestly handles negative extra energy when current car costs less to run', () => {
      // Current car: $1,500/yr (e.g. small EV or cheap hybrid), Target: $2,500/yr (large SUV)
      // Extra energy = (1500 - 2500) * (180 / 365) = -1000 * (180 / 365) = -493.15
      const extraEnergy = calculateExtraEnergyWhileWaiting(1500, 2500, 180);
      expect(extraEnergy).toBe(-493.15);
    });
  });

  describe('4. Network & Failure Handling in fetchCohortWaitTime', () => {
    it('returns NETWORK_ERROR gracefully when fetch rejects', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network connection timeout'));

      const result = await fetchCohortWaitTime(
        { model: 'rav4', powertrain: 'hev', province: 'BC' },
        { fetchFn: mockFetch as any }
      );

      expect(result.status).toBe('NETWORK_ERROR');
      expect(result.p50Days).toBeNull();
      expect(result.sampleCount).toBe(0);
    });

    it('returns NETWORK_ERROR gracefully when endpoint responds with 500 status', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });

      const result = await fetchCohortWaitTime(
        { model: 'rav4', powertrain: 'hev', province: 'BC' },
        { fetchFn: mockFetch as any }
      );

      expect(result.status).toBe('NETWORK_ERROR');
      expect(result.p50Days).toBeNull();
    });
  });

  describe('5. UI Component: WaitOpportunityCard', () => {
    it('renders strict requirement label and disclaimers', async () => {
      await act(async () => {
        render(
          <WaitOpportunityCard
            annualCostCurrent={3600}
            annualCostTarget={2160}
            initialWaitDays={365}
          />
        );
      });

      // Strict label compliance
      expect(
        screen.getByText('Estimated Extra Energy Cost While Waiting')
      ).toBeInTheDocument();

      // Calculation: (3600 - 2160) * (365 / 365) = $1,440 CAD
      expect(screen.getByText('+$1,440 CAD')).toBeInTheDocument();

      // Strict visual note
      expect(
        screen.getByText(
          /Historical median total wait for past deliveries, not a guaranteed delivery date/i
        )
      ).toBeInTheDocument();

      // Explanatory disclaimer
      expect(
        screen.getByText(
          /Assumes target vehicle were available today, constant energy prices, and use of current car until delivery/i
        )
      ).toBeInTheDocument();
    });

    it('displays honest negative energy savings when current car costs less', async () => {
      await act(async () => {
        render(
          <WaitOpportunityCard
            annualCostCurrent={1500}
            annualCostTarget={2500}
            initialWaitDays={365}
          />
        );
      });

      expect(screen.getByText('-$1,000 CAD')).toBeInTheDocument();
      expect(
        screen.getByText(/Current-car energy use costs less over the wait period/i)
      ).toBeInTheDocument();
    });

    it('supports quick preset chips (3 mos, 6 mos, 9 mos, 12 mos) and manual slider', async () => {
      await act(async () => {
        render(
          <WaitOpportunityCard
            annualCostCurrent={3600}
            annualCostTarget={2160}
            initialWaitDays={180}
          />
        );
      });

      const input = screen.getByLabelText(/Delivery wait time in days/i);
      expect(input).toHaveValue(180);

      // Click 12 mos (365d) preset
      const chip12m = screen.getByRole('button', { name: /12 mos \(365d\)/i });
      await act(async () => {
        fireEvent.click(chip12m);
      });

      expect(input).toHaveValue(365);
      expect(screen.getByText('+$1,440 CAD')).toBeInTheDocument();

      // Change via manual slider/input
      await act(async () => {
        fireEvent.change(input, { target: { value: '90' } });
      });
      expect(input).toHaveValue(90);
    });

    it('auto-populates with cohort P50 when empirical evidence gate passes', async () => {
      // Mock global fetch
      const mockSuccessData = {
        success: true,
        data: {
          modelSlug: 'rav4',
          powertrainSlug: 'hev',
          province: 'BC',
          sampleCounts: { delivered: 28, pending: 8, total: 36 },
          waitStats: { median: 210, p25: 160, p75: 260 },
          latestSubmissionAt: new Date().toISOString(), // Fresh
          isBaselineFallback: false,
        },
      };

      const originalFetch = window.fetch;
      window.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockSuccessData,
      });

      render(
        <WaitOpportunityCard
          annualCostCurrent={3600}
          annualCostTarget={2160}
          targetModelSlug="rav4"
          targetPowertrain="hev"
          province="BC"
        />
      );

      // Wait for auto-fill to populate input with 210 days
      await waitFor(() => {
        expect(screen.getByLabelText(/Delivery wait time in days/i)).toHaveValue(210);
      });

      // Verify metadata badge
      expect(screen.getByText(/Based on 28 verified BC deliveries in past 180d/i)).toBeInTheDocument();

      window.fetch = originalFetch;
    });
  });

  describe('6. VehicleSavingsCalculator Integration', () => {
    it('places WaitOpportunityCard directly beneath energy results and does not block on network failure', async () => {
      // Simulate network failure
      const originalFetch = window.fetch;
      window.fetch = vi.fn().mockRejectedValue(new Error('Network offline'));

      await act(async () => {
        render(<VehicleSavingsCalculator />);
      });

      // Core energy results remain fully rendered and interactive
      expect(screen.getByText('Energy-Cost Savings')).toBeInTheDocument();

      // Wait opportunity card is present directly below
      expect(
        screen.getByText('Estimated Extra Energy Cost While Waiting')
      ).toBeInTheDocument();

      // Manual controls work normally
      expect(screen.getByLabelText(/Delivery wait time in days/i)).toBeInTheDocument();

      window.fetch = originalFetch;
    });
  });
});
