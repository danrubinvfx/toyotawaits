import { describe, it, expect } from 'vitest';
import { buildAmazonAffiliateUrl } from '@/utils/affiliate';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { GearCard } from '@/components/gear/GearCard';
import { MarketProvider } from '@/context/MarketContext';

describe('Dynamic Outbound Link Helper (src/utils/affiliate.ts)', () => {
  it('builds direct ASIN URL for Canadian market with tag toyotawaits-20', () => {
    const url = buildAmazonAffiliateUrl({ asin: 'B08XLP89V8', market: 'CA' });
    expect(url).toBe('https://www.amazon.ca/dp/B08XLP89V8?tag=toyotawaits-20');
  });

  it('builds direct ASIN URL for US market with tag toyotawaits07-20', () => {
    const url = buildAmazonAffiliateUrl({ asin: 'B08XLP89V8', market: 'US' });
    expect(url).toBe('https://www.amazon.com/dp/B08XLP89V8?tag=toyotawaits07-20');
  });

  it('builds keyword search URL for CA when asin is omitted', () => {
    const url = buildAmazonAffiliateUrl({
      searchQuery: 'Fitcamx dash cam RAV4 2019-2026',
      market: 'CA',
    });
    expect(url).toBe(
      'https://www.amazon.ca/s?k=Fitcamx%20dash%20cam%20RAV4%202019-2026&tag=toyotawaits-20'
    );
  });

  it('builds keyword search URL for US when asin is omitted', () => {
    const url = buildAmazonAffiliateUrl({
      searchQuery: 'Fitcamx dash cam RAV4 2019-2026',
      market: 'US',
    });
    expect(url).toBe(
      'https://www.amazon.com/s?k=Fitcamx%20dash%20cam%20RAV4%202019-2026&tag=toyotawaits07-20'
    );
  });

  it('falls back to "Toyota accessories" query when no asin or query provided', () => {
    const caUrl = buildAmazonAffiliateUrl({ market: 'CA' });
    expect(caUrl).toBe('https://www.amazon.ca/s?k=Toyota%20accessories&tag=toyotawaits-20');

    const usUrl = buildAmazonAffiliateUrl({ market: 'US' });
    expect(usUrl).toBe('https://www.amazon.com/s?k=Toyota%20accessories&tag=toyotawaits07-20');
  });
});

describe('GearCard CTA and Market Localization Behavior', () => {
  it('renders "View on Amazon ↗" for items with direct ASIN', () => {
    const itemWithAsin = {
      id: 'fitcamx-rav4',
      slug: 'fitcamx-rav4',
      title: 'FitcamX OEM Integrated 4K Mirror Dashcam',
      category: 'Tech & Security',
      asin: 'B08XLP89V8',
    };

    render(
      <MarketProvider initialMarket="CA">
        <GearCard item={itemWithAsin} />
      </MarketProvider>
    );

    const buttonLink = screen.getByRole('link', { name: /View on Amazon ↗/i });
    expect(buttonLink).toBeInTheDocument();
    expect(buttonLink.getAttribute('href')).toBe(
      'https://www.amazon.ca/dp/B08XLP89V8?tag=toyotawaits-20'
    );
    expect(buttonLink.getAttribute('target')).toBe('_blank');
    expect(buttonLink.getAttribute('rel')).toContain('sponsored');
    expect(buttonLink.getAttribute('rel')).toContain('noopener');
    expect(buttonLink.getAttribute('rel')).toContain('noreferrer');
  });

  it('renders "Search on Amazon ↗" when falling back to search query', () => {
    const itemWithQueryOnly = {
      id: 'custom-search-item',
      slug: 'custom-search-item',
      title: 'Custom Roof Rails',
      category: 'Cargo & Utility',
      searchKeywordsCA: 'Custom Roof Rails 2026',
      searchKeywordsUS: 'Custom Roof Rails 2026',
    };

    render(
      <MarketProvider initialMarket="CA">
        <GearCard item={itemWithQueryOnly} />
      </MarketProvider>
    );

    const buttonLink = screen.getByRole('link', { name: /Search on Amazon ↗/i });
    expect(buttonLink).toBeInTheDocument();
    expect(buttonLink.getAttribute('href')).toContain('/s?k=Custom%20Roof%20Rails%202026');
    expect(buttonLink.getAttribute('href')).toContain('tag=toyotawaits-20');
  });

  it('switches between CA and US markets with correct domain and associate tag', () => {
    const item = {
      id: 'fitcamx-rav4',
      slug: 'fitcamx-rav4',
      title: 'FitcamX OEM Integrated 4K Mirror Dashcam',
      category: 'Tech & Security',
      asin: 'B08XLP89V8',
    };

    // CA
    const { unmount } = render(
      <MarketProvider initialMarket="CA">
        <GearCard item={item} />
      </MarketProvider>
    );
    let link = screen.getByRole('link', { name: /View on Amazon ↗/i });
    expect(link.getAttribute('href')).toBe(
      'https://www.amazon.ca/dp/B08XLP89V8?tag=toyotawaits-20'
    );
    unmount();

    // US
    render(
      <MarketProvider initialMarket="US">
        <GearCard item={item} />
      </MarketProvider>
    );
    link = screen.getByRole('link', { name: /View on Amazon ↗/i });
    expect(link.getAttribute('href')).toBe(
      'https://www.amazon.com/dp/B08XLP89V8?tag=toyotawaits07-20'
    );
  });
});
