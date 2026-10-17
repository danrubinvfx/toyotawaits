import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LegalPage from '@/app/legal/page';

describe('Legal Page', () => {
  it('renders all statutory disclaimers and consumer disclosures', () => {
    render(<LegalPage />);

    // Page title and badges
    expect(
      screen.getByRole('heading', { level: 1, name: /Legal Terms, Fair Use & Consumer Pricing Disclosures/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Dual-Market: 🇨🇦 Canada & 🇺🇸 United States/i)).toBeInTheDocument();

    // Section 1: Non-Affiliation
    expect(screen.getByText(/Independent Community Project & Nominative Fair Use/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Toyota Motor Sales, U\.S\.A\., Inc\./i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Toyota Canada Inc\./i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Toyota Motor Corporation/i).length).toBeGreaterThanOrEqual(1);

    // Section 2: Canadian OMVIC / VSA
    expect(screen.getByText(/Canadian Consumer Pricing & Provincial Regulatory Disclosures/i)).toBeInTheDocument();
    expect(screen.getByText(/Ontario \(OMVIC\):/i)).toBeInTheDocument();
    expect(screen.getByText(/British Columbia \(VSA\):/i)).toBeInTheDocument();

    // Section 3: US ADM & Monroney
    expect(screen.getByText(/United States Market Pricing & Dealer Markup \(ADM\) Disclosures/i)).toBeInTheDocument();
    expect(screen.getByText(/Monroney Window Sticker \(MSRP\):/i)).toBeInTheDocument();
    expect(screen.getByText(/Adjusted Dealer Markup \(ADM\):/i)).toBeInTheDocument();

    // Section 4: Crowdsourced Estimates
    expect(screen.getByText(/Crowdsourced Wait Times & Not Financial\/Legal Advice/i)).toBeInTheDocument();

    // Section 5: Affiliate and Monetization
    expect(screen.getByText(/Monetization & Affiliate Disclosure/i)).toBeInTheDocument();
    expect(screen.getByText(/Amazon Associates Program:/i)).toBeInTheDocument();
  });
});
