import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import TiresPage, { metadata } from '@/app/tires/page';

describe('TiresPage Route', () => {
  it('defines correct page metadata matching Canadian Toyota seasonal tire specifications', () => {
    expect(metadata.title).toBe(
      'Toyota Winter Tire Sizing & Wheel Packages Canada (2026/2027) | ToyotaWaits'
    );
    expect(metadata.description).toBe(
      'Confirmed OEM tire sizes, 17-inch downsizing specs, bolt patterns (5x114.3, 60.1mm bore), and 3PMSF winter tire picks for RAV4, Sienna, Grand Highlander, and Camry.'
    );
    expect(metadata.alternates?.canonical).toBe('https://www.toyotawaits.ca/tires');
  });

  it('renders the Direct-Fit Sizing Quick-Lookup Matrix with 17-inch downsizing specs', () => {
    render(<TiresPage />);

    const matrix = screen.getByTestId('direct-fit-sizing-matrix');
    expect(matrix).toBeInTheDocument();

    const matrixWithin = within(matrix);
    expect(
      matrixWithin.getByRole('heading', { name: /Direct-Fit Sizing Quick-Lookup Matrix/i })
    ).toBeInTheDocument();

    // Verify all 4 primary vehicle sizing specs within the matrix
    expect(matrixWithin.getByText('RAV4')).toBeInTheDocument();
    expect(matrixWithin.getByText('225/65R17 (or 235/60R18)')).toBeInTheDocument();

    expect(matrixWithin.getByText('Sienna AWD')).toBeInTheDocument();
    expect(matrixWithin.getByText('225/65R17 or 235/65R17')).toBeInTheDocument();

    expect(matrixWithin.getByText('Grand Highlander')).toBeInTheDocument();
    expect(matrixWithin.getByText('255/60R18')).toBeInTheDocument();
    expect(matrixWithin.getByText('5x120, 60.1mm')).toBeInTheDocument();

    expect(matrixWithin.getByText('Camry Hybrid')).toBeInTheDocument();
    expect(matrixWithin.getByText('215/55R17')).toBeInTheDocument();
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
      screen.getByText(/Can you downsize 18-inch wheels to 17-inch for winter tires on a Toyota RAV4\?/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Will 225\/65R17 tires fit on a Toyota Sienna AWD\?/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/What are the legal winter tire requirements in BC and Quebec for 2026\/2027\?/i)
    ).toBeInTheDocument();

    // Verify JSON-LD FAQ schema script
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    const faqScript = Array.from(scripts).find((s) => s.innerHTML.includes('FAQPage'));
    expect(faqScript).toBeDefined();
    expect(faqScript?.innerHTML).toContain('Can you downsize 18-inch wheels to 17-inch');
  });
});
