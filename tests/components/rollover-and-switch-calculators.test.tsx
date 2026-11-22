import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  OrderRolloverCalculator,
  calculateRolloverProjection,
} from '@/components/calculators/OrderRolloverCalculator';
import {
  WaitVsSwitchCalculator,
  CalculatorHubWithSwitch,
  calculateWaitVsSwitch,
} from '@/components/calculators/WaitVsSwitchCalculator';

vi.mock('next/dynamic', () => ({
  default: () => {
    const MockDynamic = () => <div data-testid="mock-vehicle-savings-calc">Mock Savings Calc</div>;
    return MockDynamic;
  },
}));

describe('OrderRolloverCalculator', () => {
  it('computes rollover risk tiers and clamps delivery dates safely within 2026–2027', () => {
    const early2026 = calculateRolloverProjection({
      depositDateStr: '2026-02-01',
      medianWaitDays: 90,
      baseMsrp: 35650,
      my27Delta: 1500,
      taxRate: 0.13,
      isUS: false,
    });
    expect(early2026.riskTier).toBe('Likely 2026 Allocation');
    expect(early2026.otdImpact).toBe(1695);

    const q4Risk = calculateRolloverProjection({
      depositDateStr: '2026-08-01',
      medianWaitDays: 120,
      baseMsrp: 35650,
      my27Delta: 1500,
      taxRate: 0.13,
      isUS: false,
    });
    expect(q4Risk.riskTier).toBe('High 2027 Rollover Risk');

    const clamped2027 = calculateRolloverProjection({
      depositDateStr: '2027-06-01',
      medianWaitDays: 420,
      baseMsrp: 35650,
      my27Delta: 1500,
      taxRate: 0.13,
      isUS: false,
    });
    expect(clamped2027.riskTier).toBe('Confirmed 2027 Build Window');
    expect(clamped2027.estimatedDate.getUTCFullYear()).toBe(2027);
  });

  it('renders CAD pricing on first byte when isUS=false and updates tax math by province', () => {
    render(
      <OrderRolloverCalculator
        modelSlug="rav4"
        modelName="Toyota RAV4"
        baseMsrpCad={35650}
        baseMsrpUsd={30250}
        my27DeltaCad={1500}
        my27DeltaUsd={1100}
        medianWaitDays={240}
        isUS={false}
        initialMarket="CA"
      />
    );

    const otdEl = screen.getByTestId('rollover-otd-impact');
    expect(otdEl.textContent).toContain('1,695');
    expect(otdEl.textContent).toContain('CAD');

    const regionSelect = screen.getByLabelText(/Province \/ State Tax Rate/i);
    fireEvent.change(regionSelect, { target: { value: 'AB' } });
    expect(otdEl.textContent).toContain('1,575');
    expect(otdEl.textContent).toContain('CAD');
  });

  it('renders USD pricing on first byte when isUS=true and updates negotiation checklist by status', () => {
    render(
      <OrderRolloverCalculator
        modelSlug="rav4"
        modelName="Toyota RAV4"
        baseMsrpCad={35650}
        baseMsrpUsd={30250}
        my27DeltaCad={1500}
        my27DeltaUsd={1100}
        medianWaitDays={240}
        isUS={true}
        initialMarket="US"
      />
    );

    const otdEl = screen.getByTestId('rollover-otd-impact');
    // Math.round(31350 * 1.075) - Math.round(30250 * 1.075) = 33701 - 32519 = 1182 USD
    expect(otdEl.textContent).toContain('1,182');
    expect(otdEl.textContent).toContain('USD');

    const statusSelect = screen.getByLabelText(/Dealer Price-Protection Status/i);
    fireEvent.change(statusSelect, { target: { value: 'locked' } });
    expect(screen.getByText(/Protected by signed Bill of Sale/i)).toBeInTheDocument();

    fireEvent.change(statusSelect, { target: { value: 'verbal' } });
    expect(screen.getByText(/verbal promises are not enforceable/i)).toBeInTheDocument();
  });
});

describe('WaitVsSwitchCalculator', () => {
  it('calculates 3-year cash-flow and wait-period bleed accurately', () => {
    const res = calculateWaitVsSwitch({
      waitMonths: 12,
      currentMonthlyFuel: 280,
      maintenanceReserve: 120,
      rolloverBuffer: 1500,
      targetVehiclePrice: 41950,
      targetMonthlyFuel: 125,
      altWaitMonths: 0,
      altVehiclePrice: 39900,
      altMonthlyFuel: 128,
      altMonthlyMaint: 45,
    });

    expect(res.pathAWaitTotalBleed).toBe(12 * (280 + 120) + 1500);
    expect(res.pathATotal3Yr).toBe(41950 + 6300 + 24 * 125);
    expect(res.pathBTotal3Yr).toBe(39900 + 36 * (128 + 45));
    expect(res.net3YearSavingsSwitching).toBe(res.pathATotal3Yr - res.pathBTotal3Yr);
  });

  it('renders CAD by default when isUS=false and updates CTA link when switching alternatives', () => {
    render(<WaitVsSwitchCalculator isUS={false} initialMarket="CA" />);

    expect(screen.getByTestId('path-a-total').textContent).toContain('CAD');
    const cta = screen.getByTestId('wait-vs-switch-inventory-cta');
    expect(cta).toHaveAttribute('href', '/inventory?model=rav4');

    fireEvent.click(screen.getByText('Camry Hybrid AWD'));
    expect(screen.getByTestId('wait-vs-switch-inventory-cta')).toHaveAttribute(
      'href',
      '/inventory?model=camry'
    );

    fireEvent.click(screen.getByText('Crown Signia Hybrid'));
    expect(screen.getByTestId('wait-vs-switch-inventory-cta')).toHaveAttribute(
      'href',
      '/inventory?model=crown-signia'
    );
  });

  it('renders USD on first byte when isUS=true and updates when inputs change', () => {
    render(<WaitVsSwitchCalculator isUS={true} initialMarket="US" />);

    const pathATotal = screen.getByTestId('path-a-total');
    expect(pathATotal.textContent).toContain('USD');
    const initialText = pathATotal.textContent;

    const maintInput = screen.getByLabelText(/Aging-Car Repair Reserve/i);
    fireEvent.change(maintInput, { target: { value: '250' } });
    expect(pathATotal.textContent).not.toBe(initialText);
  });

  it('mounts Wait vs. Switch as the 3rd mode tab in CalculatorHubWithSwitch', () => {
    render(<CalculatorHubWithSwitch isUS={false} initialMarket="CA" />);

    const tabs = screen.getAllByRole('tab');
    expect(tabs.map((t) => t.textContent)).toEqual([
      'Shop by Toyota Model',
      'Shop by Monthly Budget',
      'Wait vs. Switch',
    ]);

    fireEvent.click(screen.getByRole('tab', { name: /Wait vs\. Switch/i }));
    expect(screen.getByTestId('wait-vs-switch-calculator')).toBeInTheDocument();
  });
});
