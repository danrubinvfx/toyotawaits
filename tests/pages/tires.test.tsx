import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import TiresPage, { metadata } from '@/app/tires/page';

describe('TiresPage Route', () => {
  it('defines correct page metadata matching Canadian Toyota seasonal tire specifications', () => {
    expect(metadata.title).toBe(
      'Toyota Winter & All-Weather Tires Canada (2026 Guide) — Sizing & Rules | ToyotaWaits'
    );
    expect(metadata.description).toBe(
      'Complete Canadian winter tire guide for Toyota RAV4, Sienna, Grand Highlander, and Corolla Cross. Provincial winter tire deadlines, insurance discounts, and factory wheel sizing.'
    );
    expect(metadata.alternates?.canonical).toBe('https://www.toyotawaits.ca/tires');
  });

  it('renders the Direct-Fit Sizing Quick-Lookup Matrix with 17-inch downsizing specs', () => {
    render(<TiresPage />);

    const matrix = screen.getByTestId('direct-fit-sizing-matrix');
    expect(matrix).toBeInTheDocument();

    const matrixWithin = within(matrix);
    expect(
      matrixWithin.getByRole('heading', { name: /(Direct-Fit Sizing Quick-Lookup Matrix|Direct OEM Sizing & 17" Downsizing Matrix)/i })
    ).toBeInTheDocument();

    // Verify all 4 primary vehicle sizing specs within the matrix
    expect(matrixWithin.getAllByText(/RAV4/).length).toBeGreaterThanOrEqual(1);
    expect(matrixWithin.getAllByText(/225\/65R17/).length).toBeGreaterThanOrEqual(1);

    expect(matrixWithin.getAllByText(/Sienna AWD/).length).toBeGreaterThanOrEqual(1);
    expect(matrixWithin.getAllByText(/235\/65R17|225\/65R17/).length).toBeGreaterThanOrEqual(1);

    expect(matrixWithin.getAllByText(/Grand Highlander/).length).toBeGreaterThanOrEqual(1);
    expect(matrixWithin.getAllByText(/255\/60R18/).length).toBeGreaterThanOrEqual(1);
    expect(matrixWithin.getAllByText(/5x120, 60\.1mm/).length).toBeGreaterThanOrEqual(1);

    expect(matrixWithin.getAllByText(/Camry Hybrid/).length).toBeGreaterThanOrEqual(1);
    expect(matrixWithin.getAllByText(/215\/55R17/).length).toBeGreaterThanOrEqual(1);
  });

  it('renders provincial regulations matrix with BC, Quebec, Ontario, and Manitoba programs', () => {
    render(<TiresPage />);

    expect(
      screen.getByRole('heading', {
        name: /Canadian Provincial Winter Tire Mandates & Insurance Discounts/i,
      })
    ).toBeInTheDocument();

    expect(screen.getAllByText('British Columbia').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('October 1 – April 30')).toBeInTheDocument();
    expect(screen.getAllByText('Quebec').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('December 1 – March 15')).toBeInTheDocument();
    expect(screen.getAllByText(/Ontario/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/2% to 5% (discount|off annual auto insurance)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Manitoba/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/(Financing up to \$2,000|finance up to \$2,000)/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders trim-by-trim factory tire sizing table for RAV4, Sienna, Grand Highlander, and Corolla Cross', () => {
    render(<TiresPage />);

    expect(
      screen.getByRole('heading', {
        name: /Trim-by-Trim Factory Tire Sizing & Wheel Specs/i,
      })
    ).toBeInTheDocument();

    // Check RAV4 trims
    expect(screen.getByText(/LE \/ XLE \/ Woodland Edition/i)).toBeInTheDocument();
    expect(screen.getAllByText('225/65R17').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('225/60R18').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('235/55R19').length).toBeGreaterThanOrEqual(1);

    // Check Sienna trims & note
    expect(screen.getByText('Sienna AWD / FWD')).toBeInTheDocument();
    expect(screen.getByText(/Sienna Spare Tire Caveat/i)).toBeInTheDocument();

    // Check Grand Highlander
    expect(screen.getByText(/Grand Highlander \(Gas, HEV & Hybrid MAX\)/i)).toBeInTheDocument();
    expect(screen.getByText('255/65R18 or 255/55R20')).toBeInTheDocument();

    // Check Corolla Cross
    expect(screen.getByText(/Corolla Cross \(AWD \/ FWD & Hybrid\)/i)).toBeInTheDocument();
    expect(screen.getAllByText('215/65R17').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('225/55R18').length).toBeGreaterThanOrEqual(1);
  });

  it('renders top 3 recommended winter & all-weather tire solutions', () => {
    render(<TiresPage />);

    expect(screen.getAllByText('Michelin CrossClimate 2').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Bridgestone Blizzak WS90 \/ Nokian Hakkapeliitta R5/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Falken Wildpeak A/T Trail').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Search Cordless Inflator Kits/i)).toBeInTheDocument();
  });

  it('renders contextual winter gear recommendations with verified ASINs', () => {
    render(<TiresPage />);

    expect(screen.getByText(/TuxMat Custom High-Wall Liners/i)).toBeInTheDocument();
    expect(screen.getByText(/NOCO Boost Plus GB40 \/ GBX45/i)).toBeInTheDocument();
    expect(screen.getByText(/Cordless 150 PSI Tire Inflator/i)).toBeInTheDocument();

    // Verify ASIN links
    const rav4LinerLink = screen.getByRole('link', { name: /RAV4 \(B0833DT93B\)/i });
    expect(rav4LinerLink).toHaveAttribute('href', 'https://www.amazon.ca/dp/B0833DT93B?tag=toyotawaits-20');

    const siennaLinerLink = screen.getByRole('link', { name: /Sienna \(B0CFV5R8QM\)/i });
    expect(siennaLinerLink).toHaveAttribute('href', 'https://www.amazon.ca/dp/B0CFV5R8QM?tag=toyotawaits-20');

    const nocoLink = screen.getByRole('link', { name: /View NOCO GB40 on Amazon/i });
    expect(nocoLink).toHaveAttribute('href', 'https://www.amazon.ca/dp/B015TKUPIC?tag=toyotawaits-20');
  });

  it('renders FAQ section covering RAV4 downsizing, Sienna 17-inch fitment, and BC/Quebec laws', () => {
    const { container } = render(<TiresPage />);

    expect(
      screen.getByText(/(When do I need to switch to winter tires in BC and Quebec\?|What are the legal winter tire requirements in BC and Quebec\?)/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/What tire size fits a Toyota RAV4 Hybrid\?/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Can you downsize 18-inch (or 19-inch )?wheels to 17-inch for winter tires on a Toyota RAV4\?/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Will 225\/65R17 (or 235\/65R17 )?tires fit on a Toyota Sienna AWD\?/i)
    ).toBeInTheDocument();

    // Verify JSON-LD FAQ schema script
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    const faqScript = Array.from(scripts).find((s) => s.innerHTML.includes('FAQPage'));
    expect(faqScript).toBeDefined();
    expect(faqScript?.innerHTML).toMatch(/(When do I need to switch to winter tires in BC and Quebec\?|What are the legal winter tire requirements in BC and Quebec\?)/);
    expect(faqScript?.innerHTML).toContain('What tire size fits a Toyota RAV4 Hybrid?');
  });
});
