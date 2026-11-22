import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EnergyResultsCard, buildRedditShareUrl } from '@/components/calculator/EnergyResultsCard';
import type { CalculatorResults } from '@/lib/hooks/useSavingsCalculator';
import * as analytics from '@/lib/analytics';

describe('EnergyResultsCard — Reddit Share & Thread Markdown', () => {
  const baseResults: CalculatorResults = {
    unitSystem: 'METRIC',
    currencyCode: 'CAD',
    effectiveCurrentL100km: 9.5,
    currentAnnualCost: 3325,
    currentMonthlyCost: 277.08,
    currentAnnualFuelL: 1900,
    targetL100km: 5.8,
    targetAnnualCost: 2030,
    targetMonthlyCost: 169.17,
    targetIsPhev: false,
    targetAnnualElectricCost: 0,
    targetAnnualElectricKwh: 0,
    targetAnnualGasCost: 2030,
    targetAnnualGasL: 1160,
    annualSavings: 1295,
    monthlySavings: 107.92,
    savingsPercent: 38.9,
    shareUrl: 'https://toyotawaits.ca/calculator#c=%7B%22k%22%3A20000%2C%22gp%22%3A1.75%7D',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('constructs Reddit share URL preserving #c=... hash with UTM params before hash', () => {
    const urlWithHash = 'https://toyotawaits.ca/calculator#c=%7B%22k%22%3A20000%7D';
    expect(buildRedditShareUrl(urlWithHash)).toBe(
      'https://toyotawaits.ca/calculator?utm_source=reddit&utm_medium=organic_social&utm_campaign=calculator_share#c=%7B%22k%22%3A20000%7D'
    );

    const urlWithExistingQuery = 'https://toyotawaits.ca/calculator?model=rav4#c=%7B%22k%22%3A25000%7D';
    expect(buildRedditShareUrl(urlWithExistingQuery)).toBe(
      'https://toyotawaits.ca/calculator?model=rav4&utm_source=reddit&utm_medium=organic_social&utm_campaign=calculator_share#c=%7B%22k%22%3A25000%7D'
    );
  });

  it('renders Share on Reddit link with encoded URL, dynamic title, target="_blank", and fires analytics', () => {
    const trackSpy = vi.spyOn(analytics, 'trackUserEvent').mockImplementation(() => {});

    render(
      <EnergyResultsCard
        results={baseResults}
        model="rav4"
        powertrain="HEV"
        targetVehicleName="2026 Toyota RAV4 Hybrid"
        annualDistance={20000}
        gasPrice={1.75}
      />
    );

    const redditLink = screen.getByRole('link', { name: /Share on Reddit/i });
    expect(redditLink).toHaveAttribute('target', '_blank');
    expect(redditLink).toHaveAttribute('rel', 'noopener noreferrer');

    const href = redditLink.getAttribute('href')!;
    expect(href.startsWith('https://www.reddit.com/submit?')).toBe(true);

    const parsed = new URL(href);
    const sharedUrl = parsed.searchParams.get('url');
    const sharedTitle = parsed.searchParams.get('title');

    expect(sharedUrl).toBe(
      'https://toyotawaits.ca/calculator?utm_source=reddit&utm_medium=organic_social&utm_campaign=calculator_share#c=%7B%22k%22%3A20000%2C%22gp%22%3A1.75%7D'
    );
    expect(sharedTitle).toContain('2026 Toyota RAV4 Hybrid');
    expect(sharedTitle).toContain('20,000 km/yr');
    expect(sharedTitle).toContain('$1.75/L');
    expect(sharedTitle).toContain('$1,295 CAD/yr');

    fireEvent.click(redditLink);
    expect(trackSpy).toHaveBeenCalledWith('calculator_shared', {
      model: 'rav4',
      powertrain: 'HEV',
    });
  });

  it('copies Reddit thread Markdown with #c=... permalink, shows confirmation, and fires analytics', async () => {
    const trackSpy = vi.spyOn(analytics, 'trackUserEvent').mockImplementation(() => {});
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
    });

    render(
      <EnergyResultsCard
        results={baseResults}
        model="rav4"
        powertrain="HEV"
        targetVehicleName="2026 Toyota RAV4 Hybrid"
        annualDistance={20000}
        gasPrice={1.75}
      />
    );

    const copyBtn = screen.getByRole('button', { name: /Copy for Reddit Thread/i });
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Copied for Reddit!')).toBeInTheDocument();
    });

    const copiedText = writeTextMock.mock.calls[0][0] as string;
    expect(copiedText).toContain('**2026 Toyota RAV4 Hybrid Energy Savings Breakdown**');
    expect(copiedText).toContain('20,000 km/yr @ $1.75/L');
    expect(copiedText).toContain('$1,295 CAD/yr');
    expect(copiedText).toContain(
      'https://toyotawaits.ca/calculator?utm_source=reddit&utm_medium=organic_social&utm_campaign=calculator_share#c=%7B%22k%22%3A20000%2C%22gp%22%3A1.75%7D'
    );

    expect(trackSpy).toHaveBeenCalledWith('calculator_shared', {
      model: 'rav4',
      powertrain: 'HEV',
    });
  });
});
