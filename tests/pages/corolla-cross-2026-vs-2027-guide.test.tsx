import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CorollaCross2026Vs2027GuidePage, {
  generateMetadata,
  dynamic,
  instant,
} from '@/app/guides/toyota-corolla-cross-2026-vs-2027/page';
import { MarketProvider } from '@/context/MarketContext';

describe('2026 vs. 2027 Toyota Corolla Cross Guide Page', () => {
  it('has valid Next.js 16 route segment exports', () => {
    expect(dynamic).toBe('force-dynamic');
    expect(instant).toBe(false);
  });

  it('has valid SEO metadata and canonical URL matching specification requirements', () => {
    const meta = generateMetadata();
    expect(meta.title).toBe(
      '2026 vs. 2027 Toyota Corolla Cross Canada: Price, Hybrid Changes & Waitlist Rollover | ToyotaWaits'
    );
    expect(meta.alternates?.canonical).toBe(
      'https://www.toyotawaits.ca/guides/toyota-corolla-cross-2026-vs-2027'
    );
  });

  it('renders both Article and FAQPage JSON-LD structured data schemas', () => {
    const { container } = render(
      <MarketProvider initialMarket="CA">
        <CorollaCross2026Vs2027GuidePage />
      </MarketProvider>
    );

    const scripts = Array.from(container.querySelectorAll('script[type="application/ld+json"]'));
    expect(scripts.length).toBeGreaterThanOrEqual(2);

    const parsedSchemas = scripts.map((s) => JSON.parse(s.textContent || '{}'));
    const article = parsedSchemas.find((s) => s['@type'] === 'Article');
    const faqPage = parsedSchemas.find((s) => s['@type'] === 'FAQPage');

    expect(article).toBeDefined();
    expect(article.mainEntityOfPage).toBe(
      'https://www.toyotawaits.ca/guides/toyota-corolla-cross-2026-vs-2027'
    );

    expect(faqPage).toBeDefined();
    expect(faqPage.mainEntity.length).toBeGreaterThanOrEqual(3);
  });

  it('covers Canadian MSRP expectations, Hybrid AWD vs Gas lead times, factory deposit rollovers, and RAV4 Hybrid comparison', () => {
    render(
      <MarketProvider initialMarket="CA">
        <CorollaCross2026Vs2027GuidePage />
      </MarketProvider>
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /2026 vs\. 2027 Toyota Corolla Cross Canada: Price, Hybrid Changes & Waitlist Rollover/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /Canadian MSRP Expectations & 2026 vs\. 2027 Specification Matrix/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /Hybrid AWD vs\. Gas Lead Times Across Canada/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /Factory Deposit Rollover Rules \(MTM Huntsville, Alabama\)/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /Corolla Cross Hybrid vs\. Toyota RAV4 Hybrid: Should You Step Up\?/i,
      })
    ).toBeInTheDocument();

    const inventoryLink = screen.getByRole('link', {
      name: /Explore Live Corolla Cross Stock ↗/i,
    });
    expect(inventoryLink).toHaveAttribute('href', '/inventory?model=corolla-cross');
  });
});
