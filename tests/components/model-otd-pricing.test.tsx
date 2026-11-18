import React, { act } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import {
  ModelOtdPricingSection,
  calculateCanadianOtdBreakdown,
  STATUTORY_AC_TAX_CAD,
  DEFAULT_TIRE_LEVY_CAD,
} from '@/components/seo/ModelOtdPricingSection';
import ModelWaitTimePage from '@/app/wait-times/[model]/page';

vi.mock('@/context/MarketContext', () => ({
  useMarket: () => ({ market: 'CA', setMarket: vi.fn() }),
  MarketProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('ModelOtdPricingSection', () => {
  it('computes accurate OTD tax math across ON (13%), BC (12%), AB (5%), and QC (14.975%) in CAD', () => {
    const baseMsrpCad = 35650;
    const freightPdiCad = 1930;
    const expectedSubtotal = baseMsrpCad + freightPdiCad + STATUTORY_AC_TAX_CAD + DEFAULT_TIRE_LEVY_CAD; // 37700

    const result = calculateCanadianOtdBreakdown(baseMsrpCad, freightPdiCad);
    expect(result.subtotalCad).toBe(expectedSubtotal);

    const byCode = Object.fromEntries(result.provinces.map((p) => [p.code, p]));
    expect(byCode.ON.taxRate).toBe(0.13);
    expect(byCode.ON.taxAmountCad).toBe(Math.round(expectedSubtotal * 0.13));
    expect(byCode.ON.estimatedOtdCad).toBe(Math.round(expectedSubtotal * 1.13));

    expect(byCode.BC.taxRate).toBe(0.12);
    expect(byCode.BC.taxAmountCad).toBe(Math.round(expectedSubtotal * 0.12));
    expect(byCode.BC.estimatedOtdCad).toBe(Math.round(expectedSubtotal * 1.12));

    expect(byCode.AB.taxRate).toBe(0.05);
    expect(byCode.AB.taxAmountCad).toBe(Math.round(expectedSubtotal * 0.05));
    expect(byCode.AB.estimatedOtdCad).toBe(Math.round(expectedSubtotal * 1.05));

    expect(byCode.QC.taxRate).toBe(0.14975);
    expect(byCode.QC.taxAmountCad).toBe(Math.round(expectedSubtotal * 0.14975));
    expect(byCode.QC.estimatedOtdCad).toBe(Math.round(expectedSubtotal * 1.14975));
  });

  it('renders Canadian mode with provincial OTD table, all-in pricing rules, and quote auditor CTA', () => {
    render(
      <ModelOtdPricingSection
        modelSlug="rav4"
        modelName="Toyota RAV4"
        baseMsrpCad={35650}
        baseMsrpUsd={30250}
        isUS={false}
      />
    );

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: '2026–2027 Toyota RAV4 Out-the-Door Price & Dealer Fees in Canada',
      })
    ).toBeInTheDocument();

    expect(screen.getByText('$35,650')).toBeInTheDocument();
    expect(screen.getByText('+$1,930')).toBeInTheDocument();
    expect(screen.getByText('$37,700 CAD')).toBeInTheDocument();

    const onRow = screen.getByTestId('otd-row-on');
    expect(within(onRow).getByText('Ontario (ON)')).toBeInTheDocument();
    expect(within(onRow).getByText('13% HST')).toBeInTheDocument();
    expect(within(onRow).getByText('$42,601 CAD')).toBeInTheDocument();

    const bcRow = screen.getByTestId('otd-row-bc');
    expect(within(bcRow).getByText('British Columbia (BC)')).toBeInTheDocument();
    expect(within(bcRow).getByText('$42,224 CAD')).toBeInTheDocument();

    const abRow = screen.getByTestId('otd-row-ab');
    expect(within(abRow).getByText('Alberta (AB)')).toBeInTheDocument();
    expect(within(abRow).getByText('Lowest OTD in Canada')).toBeInTheDocument();
    expect(within(abRow).getByText('$39,585 CAD')).toBeInTheDocument();

    const qcRow = screen.getByTestId('otd-row-qc');
    expect(within(qcRow).getByText('Quebec (QC)')).toBeInTheDocument();
    expect(within(qcRow).getByText('$43,346 CAD')).toBeInTheDocument();

    expect(screen.getByText(/OMVIC in ON, VSA in BC, AMVIC in AB/i)).toBeInTheDocument();
    const cta = screen.getByRole('link', { name: /Audit Your Dealer Quote/i });
    expect(cta).toHaveAttribute('href', '/tools/quote-auditor?model=rav4');
  });

  it('uses Lexus branding for lexus-* model slugs', () => {
    render(
      <ModelOtdPricingSection
        modelSlug="lexus-tx"
        modelName="Lexus TX"
        baseMsrpCad={68750}
        isUS={false}
      />
    );

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: '2026–2027 Lexus TX Out-the-Door Price & Dealer Fees in Canada',
      })
    ).toBeInTheDocument();
  });

  it('renders US mode with USD MSRP, destination fee, ADM guidance, and no Canadian provincial tax rows', () => {
    render(
      <ModelOtdPricingSection
        modelSlug="sienna"
        modelName="Toyota Sienna"
        baseMsrpCad={49370}
        baseMsrpUsd={39185}
        isUS={true}
      />
    );

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: '2026–2027 Toyota Sienna Out-the-Door Price & Dealer Markup (ADM) Guide',
      })
    ).toBeInTheDocument();

    expect(screen.getByText('$39,185 USD')).toBeInTheDocument();
    expect(screen.getByText('+$1,450 USD')).toBeInTheDocument();
    expect(screen.getByText('$0 – +$2,500')).toBeInTheDocument();
    expect(screen.getAllByText('$40,635 USD').length).toBeGreaterThan(0);
    expect(screen.getByText('$43,135 USD')).toBeInTheDocument();

    expect(screen.queryByTestId('otd-row-on')).not.toBeInTheDocument();
    expect(screen.queryByTestId('otd-row-bc')).not.toBeInTheDocument();
    expect(screen.queryByTestId('otd-row-ab')).not.toBeInTheDocument();
    expect(screen.queryByTestId('otd-row-qc')).not.toBeInTheDocument();

    const cta = screen.getByRole('link', { name: /Check Dealer Addendum & ADM/i });
    expect(cta).toHaveAttribute('href', '/tools/quote-auditor?model=sienna');
  });

  it('renders cleanly inside /wait-times/[model] page', async () => {
    const jsx = await ModelWaitTimePage({
      params: Promise.resolve({ model: 'rav4' }),
    });

    await act(async () => {
      render(jsx);
    });

    expect(screen.getByTestId('model-otd-pricing-section')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: '2026–2027 Toyota RAV4 Out-the-Door Price & Dealer Fees in Canada',
      })
    ).toBeInTheDocument();
  });
});
