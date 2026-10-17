import { describe, it, expect } from 'vitest';
import { MARKET_COPY, getMarketCopy } from '@/lib/constants/marketCopy';

describe('Market Copy Helper (CA vs US)', () => {
  it('provides comprehensive terminology for Canadian market (CA)', () => {
    const copy = getMarketCopy('CA');
    expect(copy.countryName).toBe('Canada');
    expect(copy.countryShort).toBe('CA');
    expect(copy.domain).toBe('ToyotaWaits.ca');
    expect(copy.regionType).toBe('Province');
    expect(copy.regionTypePlural).toBe('Provinces');
    expect(copy.nationalBaseline).toBe('Canadian National Baseline');
    expect(copy.queueConcept).toBe('Factory Order Queue');
    expect(copy.pricingConcept).toBe('MSRP / All-In Pricing');
    expect(copy.pricingLegislation).toContain('OMVIC');
    expect(copy.heroEyebrow).toContain('Canadian');
    expect(copy.heroTitle).toBe('Canadian Toyota Wait Time Tracker');
    expect(copy.disclaimerEntity).toBe('Toyota Canada Inc.');
  });

  it('provides comprehensive terminology for US market (US)', () => {
    const copy = getMarketCopy('US');
    expect(copy.countryName).toBe('United States');
    expect(copy.countryShort).toBe('US');
    expect(copy.domain).toBe('ToyotaWaits.com');
    expect(copy.regionType).toBe('State');
    expect(copy.regionTypePlural).toBe('States');
    expect(copy.nationalBaseline).toBe('US National Baseline');
    expect(copy.queueConcept).toBe('Dealer Allocation & Waitlist');
    expect(copy.pricingConcept).toBe('MSRP / Market Adjustment (ADM)');
    expect(copy.pricingLegislation).toContain('ADM');
    expect(copy.heroEyebrow).toContain('U.S.');
    expect(copy.heroTitle).toBe('U.S. Toyota Wait Time & Markup Tracker');
    expect(copy.disclaimerEntity).toBe('Toyota Motor Sales, U.S.A., Inc.');
  });

  it('falls back safely to CA when an unknown market is provided', () => {
    const fallback = getMarketCopy('UNKNOWN' as any);
    expect(fallback.countryName).toBe('Canada');
    expect(fallback.countryShort).toBe('CA');
  });
});
