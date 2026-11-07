import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuoteAuditorClient } from '@/components/compliance/QuoteAuditorClient';
import QuoteAuditorPage, { metadata } from '@/app/tools/quote-auditor/page';

describe('Canadian Dealer Quote Auditor Component & Page', () => {
  it('exports valid metadata for SEO and canonical URL', () => {
    expect(metadata.title).toBe(
      'Toyota Dealer Quote Auditor Canada | Check AMVIC, OMVIC & VSA Fees'
    );
    expect(metadata.description).toContain('Audit your Toyota dealership bill of sale or quote');
    expect(metadata.alternates?.canonical).toBe('https://www.toyotawaits.ca/tools/quote-auditor');
  });

  it('renders QuoteAuditorClient with default state, model selector, and province buttons', () => {
    render(<QuoteAuditorClient />);

    expect(
      screen.getByText(/Canadian Dealer Quote Auditor/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Check your Toyota dealership worksheet against provincial all-in pricing regulations/i)
    ).toBeInTheDocument();

    // Province buttons
    expect(screen.getByText('Alberta (AMVIC)')).toBeInTheDocument();
    expect(screen.getByText('Ontario (OMVIC)')).toBeInTheDocument();
    expect(screen.getByText('BC (VSA)')).toBeInTheDocument();
    expect(screen.getByText('Other / Canada')).toBeInTheDocument();
  });

  it('loads the typical dealer markup sample (Alberta Case Study) and displays savings tally', () => {
    render(<QuoteAuditorClient />);

    const loadSampleBtn = screen.getByText(/Load Typical Dealer Markup Sample/i);
    fireEvent.click(loadSampleBtn);

    // Should load Doc fee, Block heater, Protections, and ECP
    expect(screen.getByDisplayValue('Documentation / Admin Fee')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Engine Block Heater & Cordset')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Platinum Protection Pack (Rust & Paint Film)')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Toyota ECP Platinum Warranty (7yr/160k)')).toBeInTheDocument();

    // Savings tally should show ~$3,584 CAD savings
    expect(screen.getByText(/You can save up to \$3,584 CAD/i)).toBeInTheDocument();

    // Flagged markup cards
    expect(screen.getByText(/AMVIC All-In Pricing/i)).toBeInTheDocument();
    expect(screen.getByText(/Toyota OEM Standard Rate Benchmark/i)).toBeInTheDocument();
  });

  it('switches province to Ontario and flags OMVIC all-in pricing rules', () => {
    render(<QuoteAuditorClient />);

    const onBtn = screen.getByText('Ontario (OMVIC)');
    fireEvent.click(onBtn);

    // Jurisdiction should update
    expect(screen.getByText(/OMVIC \(Ontario\)/i)).toBeInTheDocument();

    // Rebuttal script should include OMVIC citation
    const scriptBox = screen.getByText(/Under the Ontario Motor Vehicle Dealers Act/i);
    expect(scriptBox).toBeInTheDocument();
  });

  it('renders "What to Buy Instead" bridge with compliant Amazon CA affiliate links', () => {
    render(<QuoteAuditorClient />);

    const tuxmatLink = screen.getByRole('link', { name: /Search TuxMat on Amazon/i });
    expect(tuxmatLink).toHaveAttribute('href');
    const tuxmatHref = tuxmatLink.getAttribute('href') || '';
    expect(tuxmatHref).toContain('amazon.ca/s?k=');
    expect(tuxmatHref).toContain('tag=toyotawaits-20');
    expect(tuxmatLink).toHaveAttribute('target', '_blank');
    expect(tuxmatLink).toHaveAttribute('rel', 'sponsored noopener noreferrer nofollow');

    const fitcamxLink = screen.getByRole('link', { name: /Search FitcamX on Amazon/i });
    const fitcamxHref = fitcamxLink.getAttribute('href') || '';
    expect(fitcamxHref).toContain('amazon.ca/s?k=');
    expect(fitcamxHref).toContain('tag=toyotawaits-20');
    expect(fitcamxLink).toHaveAttribute('rel', 'sponsored noopener noreferrer nofollow');

    const spigenLink = screen.getByRole('link', { name: /Search Spigen on Amazon/i });
    const spigenHref = spigenLink.getAttribute('href') || '';
    expect(spigenHref).toContain('amazon.ca/s?k=');
    expect(spigenHref).toContain('tag=toyotawaits-20');
    expect(spigenLink).toHaveAttribute('rel', 'sponsored noopener noreferrer nofollow');
  });

  it('allows adding and removing custom fee rows', () => {
    render(<QuoteAuditorClient />);

    // Click quick add button for Nitrogen
    const addNitrogenBtn = screen.getByText(/\+ Nitrogen Tire Fill/i);
    fireEvent.click(addNitrogenBtn);

    expect(screen.getByDisplayValue('Nitrogen Tire Fill & Cap Guard')).toBeInTheDocument();

    // Remove the added row
    const removeBtn = screen.getByRole('button', { name: /Remove Nitrogen Tire Fill/i });
    fireEvent.click(removeBtn);

    expect(screen.queryByDisplayValue('Nitrogen Tire Fill & Cap Guard')).not.toBeInTheDocument();
  });
});
