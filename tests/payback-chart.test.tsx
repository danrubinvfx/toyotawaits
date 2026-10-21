import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { PurchaseOutlayCard } from '@/components/calculator/PurchaseOutlayCard';
import { PaybackSummaryCard } from '@/components/calculator/PaybackSummaryCard';
import { PaybackChart } from '@/components/calculator/PaybackChart';
import { AccessibleChartTable } from '@/components/calculator/AccessibleChartTable';
import { VehicleSavingsCalculator } from '@/components/calculator/VehicleSavingsCalculator';
import {
  evaluateSimplePayback,
  evaluateCashFlowTimeline,
  calculateAnnualGasCost,
} from '@/lib/calculator-engine';
import {
  DEFAULT_MODE2_OUTLAY,
  DEFAULT_MODE3_OUTLAY,
} from '@/lib/hooks/useSavingsCalculator';
import { PaybackResult, CashFlowTimelineResult } from '@/types/calculator';

describe('Stage 4: Payback & Graph Test Suite', () => {
  beforeEach(() => {
    window.location.hash = '';
    vi.clearAllMocks();
  });

  describe('1. PurchaseOutlayCard Component', () => {
    it('renders 3-mode switcher and switches modes cleanly', () => {
      const onComparisonModeChange = vi.fn();
      const onMode2OutlayChange = vi.fn();
      const onMode3OutlayChange = vi.fn();

      render(
        <PurchaseOutlayCard
          comparisonMode="ENERGY_COMPARISON"
          onComparisonModeChange={onComparisonModeChange}
          mode2Outlay={DEFAULT_MODE2_OUTLAY}
          onMode2OutlayChange={onMode2OutlayChange}
          mode3Outlay={DEFAULT_MODE3_OUTLAY}
          onMode3OutlayChange={onMode3OutlayChange}
          calculatedNetOutlay={27000}
          effectiveNetOutlay={27000}
        />
      );

      expect(screen.getByText('1. Energy Only')).toBeInTheDocument();
      expect(screen.getByText('2. Keep vs. Replace')).toBeInTheDocument();
      expect(screen.getByText('3. New A vs. New B')).toBeInTheDocument();
      expect(screen.getByText(/Mode 1: Energy-Cost Comparison Only/i)).toBeInTheDocument();

      // Click Keep vs Replace
      fireEvent.click(screen.getByText('2. Keep vs. Replace'));
      expect(onComparisonModeChange).toHaveBeenCalledWith('KEEP_VS_REPLACE');

      // Click New A vs New B
      fireEvent.click(screen.getByText('3. New A vs. New B'));
      expect(onComparisonModeChange).toHaveBeenCalledWith('NEW_A_VS_NEW_B');
    });

    it('renders Mode 2 cash outlay breakdown inputs and Net Outlay Override', () => {
      const onMode2OutlayChange = vi.fn();

      render(
        <PurchaseOutlayCard
          comparisonMode="KEEP_VS_REPLACE"
          onComparisonModeChange={vi.fn()}
          mode2Outlay={DEFAULT_MODE2_OUTLAY}
          onMode2OutlayChange={onMode2OutlayChange}
          mode3Outlay={DEFAULT_MODE3_OUTLAY}
          onMode3OutlayChange={vi.fn()}
          calculatedNetOutlay={27000}
          effectiveNetOutlay={27000}
        />
      );

      // Verify all breakdown inputs exist
      expect(screen.getByLabelText(/Target Cash Price/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Minus: Trade-in \/ Sale Proceeds/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Plus: Loan Settlement Balance/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Plus: Optional Level 2 Charger/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Minus: Eligible Rebates/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Authoritative Net Outlay/i)).toBeInTheDocument();

      // Change target price
      const priceInput = screen.getByLabelText(/Target Cash Price/i);
      fireEvent.change(priceInput, { target: { value: '45000' } });
      expect(onMode2OutlayChange).toHaveBeenCalledWith(
        expect.objectContaining({ targetPriceCad: 45000 })
      );

      // Change net outlay override
      const overrideInput = screen.getByLabelText(/Authoritative Net Outlay/i);
      fireEvent.change(overrideInput, { target: { value: '30000' } });
      expect(onMode2OutlayChange).toHaveBeenCalledWith(
        expect.objectContaining({ netOutlayOverride: 30000 })
      );

      // Prominent disclosure text
      expect(
        screen.getByText(/Models net vehicle purchase cash outlay and energy spending only/i)
      ).toBeInTheDocument();
    });

    it('renders Mode 3 Vehicle A and Vehicle B independent configuration inputs', () => {
      const onMode3OutlayChange = vi.fn();

      render(
        <PurchaseOutlayCard
          comparisonMode="NEW_A_VS_NEW_B"
          onComparisonModeChange={vi.fn()}
          mode2Outlay={DEFAULT_MODE2_OUTLAY}
          onMode2OutlayChange={vi.fn()}
          mode3Outlay={DEFAULT_MODE3_OUTLAY}
          onMode3OutlayChange={onMode3OutlayChange}
          calculatedNetOutlay={27000}
          effectiveNetOutlay={27000}
        />
      );

      expect(screen.getByText(/Vehicle A \(Baseline \/ Reference\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Vehicle B \(Comparison Target\)/i)).toBeInTheDocument();

      const priceInputs = screen.getAllByLabelText(/Total Cash Price/i);
      expect(priceInputs.length).toBe(2);

      const waitInputs = screen.getAllByLabelText(/Delivery Wait \(Days\)/i);
      expect(waitInputs.length).toBe(2);

      // Update Vehicle A wait
      fireEvent.change(waitInputs[0], { target: { value: '90' } });
      expect(onMode3OutlayChange).toHaveBeenCalledWith(
        expect.objectContaining({ vehicleAWaitDays: 90 })
      );
    });
  });

  describe('2. PaybackSummaryCard Component (6 Canonical Conditions)', () => {
    it('1. POSITIVE_PAYBACK: renders post-delivery years/months and years from today in Mode 2', () => {
      const payback: PaybackResult = {
        condition: 'POSITIVE_PAYBACK',
        annualSavings: 1440,
        upfrontDifference: 10000,
        simplePaybackYears: 6.944,
        effectivePaybackYears: 7.444,
        extraEnergyCostWhileWaiting: 720,
        breakEvenDays: 2717,
        summaryMessage: 'Target vehicle pays back its $10,000 upfront premium in 6.944 years post-delivery.',
      };

      render(
        <PaybackSummaryCard
          payback={payback}
          comparisonMode="KEEP_VS_REPLACE"
          waitDays={180}
        />
      );

      expect(
        screen.getByText(/Approximate simple energy-savings payback after delivery: 6.9 Years \(or 83 mos\)/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Years from today: 7.4 Years/i)).toBeInTheDocument();
      expect(screen.getByText('Positive Payback')).toBeInTheDocument();
    });

    it('2. NO_ENERGY_SAVINGS: renders strict canonical text', () => {
      const payback: PaybackResult = {
        condition: 'NO_ENERGY_SAVINGS',
        annualSavings: 0,
        upfrontDifference: 5000,
        simplePaybackYears: null,
        effectivePaybackYears: null,
        extraEnergyCostWhileWaiting: 0,
        breakEvenDays: null,
        summaryMessage: 'No savings.',
      };

      render(
        <PaybackSummaryCard
          payback={payback}
          comparisonMode="KEEP_VS_REPLACE"
        />
      );

      expect(
        screen.getByText('No energy savings to recover the premium.')
      ).toBeInTheDocument();
      expect(screen.getByText('No Energy Savings')).toBeInTheDocument();
    });

    it('3. HIGHER_ENERGY_COST: renders strict canonical text', () => {
      const payback: PaybackResult = {
        condition: 'HIGHER_ENERGY_COST',
        annualSavings: -500,
        upfrontDifference: 5000,
        simplePaybackYears: null,
        effectivePaybackYears: null,
        extraEnergyCostWhileWaiting: -250,
        breakEvenDays: null,
        summaryMessage: 'Higher energy costs.',
      };

      render(
        <PaybackSummaryCard
          payback={payback}
          comparisonMode="KEEP_VS_REPLACE"
        />
      );

      expect(
        screen.getByText('Higher energy spending; no energy-savings payback.')
      ).toBeInTheDocument();
      expect(screen.getByText('Higher Energy Cost')).toBeInTheDocument();
    });

    it('4. NO_UPFRONT_PREMIUM: renders strict canonical text', () => {
      const payback: PaybackResult = {
        condition: 'NO_UPFRONT_PREMIUM',
        annualSavings: 1200,
        upfrontDifference: 0,
        simplePaybackYears: 0,
        effectivePaybackYears: 0,
        extraEnergyCostWhileWaiting: 0,
        breakEvenDays: 0,
        summaryMessage: 'Immediate savings.',
      };

      render(
        <PaybackSummaryCard
          payback={payback}
          comparisonMode="KEEP_VS_REPLACE"
        />
      );

      expect(
        screen.getByText('No upfront premium to recover; immediate energy savings.')
      ).toBeInTheDocument();
      expect(screen.getByText('Immediate Win')).toBeInTheDocument();
    });

    it('5. LOWER_OUTLAY_SAVINGS: renders strict canonical text', () => {
      const payback: PaybackResult = {
        condition: 'LOWER_OUTLAY_SAVINGS',
        annualSavings: 1200,
        upfrontDifference: -4000,
        simplePaybackYears: 0,
        effectivePaybackYears: 0,
        extraEnergyCostWhileWaiting: 0,
        breakEvenDays: 0,
        summaryMessage: 'Lower outlay savings.',
      };

      render(
        <PaybackSummaryCard
          payback={payback}
          comparisonMode="KEEP_VS_REPLACE"
        />
      );

      expect(
        screen.getByText(
          'Lower upfront outlay; lower or equal energy spending (no negative payback years).'
        )
      ).toBeInTheDocument();
      expect(screen.getByText('Lower Outlay & Savings')).toBeInTheDocument();
    });

    it('6. LOWER_OUTLAY_HIGHER_ENERGY: renders strict canonical text', () => {
      const payback: PaybackResult = {
        condition: 'LOWER_OUTLAY_HIGHER_ENERGY',
        annualSavings: -1000,
        upfrontDifference: -5000,
        simplePaybackYears: 5,
        effectivePaybackYears: null,
        extraEnergyCostWhileWaiting: -500,
        breakEvenDays: null,
        summaryMessage: 'Exhaustion in 5 years.',
      };

      render(
        <PaybackSummaryCard
          payback={payback}
          comparisonMode="KEEP_VS_REPLACE"
        />
      );

      expect(
        screen.getByText('Lower upfront outlay, but higher ongoing energy spending.')
      ).toBeInTheDocument();
      expect(screen.getByText('Savings Exhaustion')).toBeInTheDocument();
    });
  });

  describe('3. PaybackChart & AccessibleChartTable', () => {
    const mockTimeline: CashFlowTimelineResult = {
      points: [
        { day: 0, year: 0, refCumulativeCost: 0, targetCumulativeCost: 10000, netAdvantageTarget: -10000 },
        { day: 365, year: 1, refCumulativeCost: 3600, targetCumulativeCost: 12160, netAdvantageTarget: -8560 },
        { day: 730, year: 2, refCumulativeCost: 7200, targetCumulativeCost: 14320, netAdvantageTarget: -7120 },
        { day: 1095, year: 3, refCumulativeCost: 10800, targetCumulativeCost: 16480, netAdvantageTarget: -5680 },
        { day: 1460, year: 4, refCumulativeCost: 14400, targetCumulativeCost: 18640, netAdvantageTarget: -4240 },
        { day: 1825, year: 5, refCumulativeCost: 18000, targetCumulativeCost: 20800, netAdvantageTarget: -2800 },
        { day: 2190, year: 6, refCumulativeCost: 21600, targetCumulativeCost: 22960, netAdvantageTarget: -1360 },
        { day: 2555, year: 7, refCumulativeCost: 25200, targetCumulativeCost: 25120, netAdvantageTarget: 80 },
      ],
      horizonYears: 7,
      crossoverDay: 2535,
      crossoverYear: 6.945,
      netAdvantageAtHorizon: 80,
    };

    it('renders PaybackChart with "Recovered at Year X.X" badge when recovered within 7 years', () => {
      render(
        <PaybackChart
          timeline={mockTimeline}
          isRecovered={true}
          recoveryYear={6.9}
          recoveryDay={2535}
        />
      );

      expect(screen.getByText(/7-Year Cumulative Cash Flow Advantage/i)).toBeInTheDocument();
      expect(screen.getByText(/Recovered at Year 6.9/i)).toBeInTheDocument();
    });

    it('renders PaybackChart with "Not recovered within 7-year horizon" badge when unrecovered', () => {
      render(
        <PaybackChart
          timeline={mockTimeline}
          isRecovered={false}
          recoveryYear={null}
          recoveryDay={null}
        />
      );

      expect(screen.getByText('Not recovered within 7-year horizon')).toBeInTheDocument();
    });

    it('renders clean savings curve without $0 break-even reference line or baseline label', () => {
      render(
        <PaybackChart
          timeline={mockTimeline}
          isRecovered={true}
          recoveryYear={6.9}
          recoveryDay={2535}
        />
      );

      // Verify legend contains the primary savings advantage line
      expect(screen.getByText('Target Cash Flow Advantage')).toBeInTheDocument();

      // Verify $0 break-even baseline reference line and labels are removed
      expect(screen.queryByText(/Break-Even Baseline/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Break-Even \(\$0\)/i)).not.toBeInTheDocument();
    });

    it('renders AccessibleChartTable with semantic HTML table elements for screen readers', () => {
      render(<AccessibleChartTable points={mockTimeline.points} />);

      expect(
        screen.getByText('Accessible Timeline Data Table (Screen Reader Equivalent)')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Timeline of Cumulative Cash Flow Advantage over 7 years')
      ).toBeInTheDocument();

      // Check column headers
      expect(screen.getByRole('columnheader', { name: /Milestone/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /Net Cash Advantage/i })).toBeInTheDocument();

      // Check rows exist from Year 0 through Year 7
      expect(screen.getByText('Year 0')).toBeInTheDocument();
      expect(screen.getByText('Year 1')).toBeInTheDocument();
      expect(screen.getByText('Year 7')).toBeInTheDocument();
    });
  });

  describe('4. Fixture A & Fixture C Verification and Deferred Recovery Protection', () => {
    it('verifies Fixture A: Gas vs HEV (K=20,000, 10.0 vs 6.0 L/100km, $1.80/L, D=$10,000)', () => {
      const gasCost = calculateAnnualGasCost(20000, 10.0, 1.8); // 3600
      const hevCost = calculateAnnualGasCost(20000, 6.0, 1.8); // 2160
      const outlayRef = 0;
      const outlayTarget = 10000;

      const payback = evaluateSimplePayback(gasCost, hevCost, outlayRef, outlayTarget, 0);
      expect(payback.condition).toBe('POSITIVE_PAYBACK');
      expect(payback.annualSavings).toBe(1440);
      expect(payback.simplePaybackYears).toBeCloseTo(6.944, 3);

      const refScenario = {
        name: 'Gas Reference',
        deliveryWaitDays: 0,
        upfrontOutlay: 0,
        annualEnergyCost: 3600,
      };
      const targetScenario = {
        name: 'HEV Target',
        deliveryWaitDays: 0,
        upfrontOutlay: 10000,
        annualEnergyCost: 2160,
      };

      const timeline = evaluateCashFlowTimeline(refScenario, targetScenario, 7, { monthlySampling: true });
      expect(timeline.crossoverDay).toBeGreaterThan(2500);
      expect(timeline.crossoverDay).toBeLessThan(2550);
      expect(timeline.crossoverYear).toBeCloseTo(6.944, 2);
    });

    it('verifies Fixture C: Staggered Deliveries & vertical delivery step at Day 365', () => {
      const refScenario = {
        name: 'Vehicle A (HEV @ Day 0)',
        deliveryWaitDays: 0,
        upfrontOutlay: 0,
        annualEnergyCost: 2160,
      };
      const targetScenario = {
        name: 'Vehicle B (PHEV @ Day 365)',
        deliveryWaitDays: 365,
        upfrontOutlay: 10000,
        annualEnergyCost: 1175.25,
        waitingAnnualEnergyCost: 3600,
      };

      // 7-year horizon
      const timeline = evaluateCashFlowTimeline(refScenario, targetScenario, 7, { monthlySampling: true });

      // Step at Day 365
      const day365Points = timeline.points.filter((p) => p.day === 365);
      expect(day365Points.length).toBeGreaterThanOrEqual(2);

      const [preStep, postStep] = day365Points;
      expect(preStep.event).toBe('DELIVERY_PENDING');
      expect(preStep.targetCumulativeCost).toBe(3600);

      expect(postStep.event).toBe('DELIVERY_OUTLAY');
      expect(postStep.targetCumulativeCost).toBe(13600);
      expect(postStep.netAdvantageTarget).toBe(-11440);

      // Post-delivery recovery is ~11.617 years
      expect(timeline.postDeliveryRecoveryYears).toBeCloseTo(11.617, 3);

      // In a 7-year horizon, Vehicle B is NOT recovered (crossoverDay is null or beyond 7 years)
      expect(timeline.crossoverDay).toBeNull();
      expect(timeline.netAdvantageAtHorizon).toBeLessThan(0);
    });

    it('verifies Deferred-Purchase Recovery Protection (Vehicle B delivered at Day 365)', () => {
      // Scenario: Vehicle A bought at Day 0 for $40,000 (annualCost $2,500)
      // Vehicle B bought at Day 365 for $50,000 (annualCost $1,500, waiting cost $3,000)
      // Between Day 0 and Day 364: Vehicle A paid $40k outlay, Vehicle B paid $0 outlay.
      // Net advantage between Day 0 and 364 is positive for B purely because B hasn't been delivered or paid for yet!
      // The engine must NOT trigger crossover before Day 365.
      const scenarioA = {
        name: 'Vehicle A',
        deliveryWaitDays: 0,
        upfrontOutlay: 40000,
        annualEnergyCost: 2500,
      };
      const scenarioB = {
        name: 'Vehicle B',
        deliveryWaitDays: 365,
        upfrontOutlay: 50000,
        annualEnergyCost: 1500,
        waitingAnnualEnergyCost: 3000,
      };

      const timeline = evaluateCashFlowTimeline(scenarioA, scenarioB, 7, { monthlySampling: true });

      // Crossover must be either null or strictly >= 365
      if (timeline.crossoverDay !== null) {
        expect(timeline.crossoverDay).toBeGreaterThanOrEqual(365);
      }
    });

    it('integrates seamlessly in VehicleSavingsCalculator when switching to Keep vs Replace', async () => {
      await act(async () => {
        render(<VehicleSavingsCalculator />);
      });

      // Default is Mode 1: Payback section shows prompt
      expect(
        screen.getByText(/Want to see how long it takes to recover the purchase price difference\?/i)
      ).toBeInTheDocument();

      // Switch to Mode 2: Keep vs Replace
      await act(async () => {
        fireEvent.click(screen.getByText('2. Keep vs. Replace'));
      });

      // Payback section is now active!
      expect(screen.getByText('Payback Analysis & 7-Year Timeline')).toBeInTheDocument();
      expect(screen.getByText(/Payback Evaluation & Recovery Summary/i)).toBeInTheDocument();
      expect(screen.getByText(/7-Year Cumulative Cash Flow Advantage/i)).toBeInTheDocument();
      expect(screen.getByText(/Accessible Timeline Data Table/i)).toBeInTheDocument();
    });
  });
});
