import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Rav4HybridPage, { metadata as rav4Metadata } from '@/app/calculator/rav4-hybrid/page';
import SiennaHybridPage, { metadata as siennaMetadata } from '@/app/calculator/sienna-hybrid/page';
import GrandHighlanderPage, { metadata as ghMetadata } from '@/app/calculator/grand-highlander/page';
import ModelPage from '@/app/[model]/page';
import CalculatorLayout from '@/app/calculator/layout';
import { Header } from '@/components/layout/header';
import sitemap from '@/app/sitemap';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/calculator',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn(),
}));

// Mock getModelBenchmark to avoid database calls in ModelPage test while preserving exports
vi.mock('@/lib/db/stats', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/db/stats')>();
  return {
    ...actual,
    getModelBenchmark: vi.fn().mockResolvedValue({
      median_days: 120,
      p25_days: 90,
      p75_days: 180,
      sample_size: 25,
    }),
  };
});

describe('Stage 5: Search Rollout & Site Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Programmatic Model Routes', () => {
    it('verifies RAV4 Hybrid page metadata, canonical, and static table', () => {
      expect(rav4Metadata.title).toBe(
        'Toyota RAV4 Hybrid Fuel Savings & Payback Calculator | ToyotaWaits'
      );
      expect(rav4Metadata.alternates?.canonical).toBe(
        'https://toyotawaits.ca/calculator/rav4-hybrid'
      );

      render(<Rav4HybridPage />);

      expect(
        screen.getByRole('heading', {
          name: /Toyota RAV4 Hybrid Fuel Savings & Payback Calculator/i,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Canadian Annual Energy Benchmark Table/i)
      ).toBeInTheDocument();
      expect(
        screen.getAllByText('2026 Toyota RAV4 Hybrid AWD').length
      ).toBeGreaterThanOrEqual(1);
    });

    it('verifies Sienna Hybrid page metadata, canonical, and static table', () => {
      expect(siennaMetadata.title).toBe(
        'Toyota Sienna Hybrid Fuel Savings Calculator | ToyotaWaits'
      );
      expect(siennaMetadata.alternates?.canonical).toBe(
        'https://toyotawaits.ca/calculator/sienna-hybrid'
      );

      render(<SiennaHybridPage />);

      expect(
        screen.getByRole('heading', {
          name: /Toyota Sienna Hybrid Fuel Savings Calculator/i,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Canadian Annual Energy Benchmark Table/i)
      ).toBeInTheDocument();
      expect(
        screen.getAllByText('2025 Toyota Sienna Hybrid AWD').length
      ).toBeGreaterThanOrEqual(1);
    });

    it('verifies Grand Highlander Hybrid page metadata, canonical, and static table', () => {
      expect(ghMetadata.title).toBe(
        'Toyota Grand Highlander Hybrid Savings Calculator | ToyotaWaits'
      );
      expect(ghMetadata.alternates?.canonical).toBe(
        'https://toyotawaits.ca/calculator/grand-highlander'
      );

      render(<GrandHighlanderPage />);

      expect(
        screen.getByRole('heading', {
          name: /Toyota Grand Highlander Hybrid Savings Calculator/i,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Canadian Annual Energy Benchmark Table/i)
      ).toBeInTheDocument();
      expect(
        screen.getAllByText('2025 Toyota Grand Highlander Hybrid AWD').length
      ).toBeGreaterThanOrEqual(1);
    });
  });

  describe('2. Truthful Schema.org WebApplication Metadata', () => {
    it('renders WebApplication JSON-LD and excludes deprecated FAQPage schema', () => {
      const { container } = render(
        <CalculatorLayout>
          <div>Calculator Child Content</div>
        </CalculatorLayout>
      );

      const script = container.querySelector('script[type="application/ld+json"]');
      expect(script).not.toBeNull();

      const jsonLd = JSON.parse(script!.textContent || '{}');
      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('WebApplication');
      expect(jsonLd.name).toBe(
        'ToyotaWaits Canadian Vehicle Energy Savings & Payback Calculator'
      );
      expect(jsonLd.applicationCategory).toBe('FinanceApplication');
      expect(jsonLd.operatingSystem).toBe('All');
      expect(jsonLd.offers).toEqual({
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'CAD',
      });

      // Strict requirement: NO deprecated FAQPage markup
      expect(jsonLd['@type']).not.toBe('FAQPage');
      expect(script!.textContent).not.toContain('FAQPage');
    });
  });

  describe('3. Global Navigation & Model Page Integration', () => {
    it('renders Calculator link in desktop and mobile header with active state styling', () => {
      render(<Header />);

      // Desktop Link
      const calcLinks = screen.getAllByRole('link', { name: /Calculator/i });
      expect(calcLinks.length).toBeGreaterThanOrEqual(1);

      const desktopCalcLink = calcLinks.find((el) => el.getAttribute('href') === '/calculator');
      expect(desktopCalcLink).toBeDefined();
      expect(desktopCalcLink).toHaveAttribute('href', '/calculator');
      // Should have active font-bold styling since pathname is '/calculator'
      expect(desktopCalcLink?.className).toContain('font-bold');
    });

    it('renders fuel savings teaser card on RAV4 model page linking to /calculator/rav4-hybrid', async () => {
      const page = await ModelPage({ params: Promise.resolve({ model: 'rav4' }) });
      render(page);

      expect(
        screen.getByText(
          'Weighing Gas vs. Hybrid? Calculate your fuel break-even and the energy cost of waiting.'
        )
      ).toBeInTheDocument();

      const calcBtn = screen.getByRole('link', { name: /Calculate Savings/i });
      expect(calcBtn).toHaveAttribute('href', '/calculator/rav4-hybrid');
    });

    it('renders fuel savings teaser card on Sienna model page linking to /calculator/sienna-hybrid', async () => {
      const page = await ModelPage({ params: Promise.resolve({ model: 'sienna' }) });
      render(page);

      const calcBtn = screen.getByRole('link', { name: /Calculate Savings/i });
      expect(calcBtn).toHaveAttribute('href', '/calculator/sienna-hybrid');
    });

    it('renders fuel savings teaser card on Grand Highlander model page linking to /calculator/grand-highlander', async () => {
      const page = await ModelPage({ params: Promise.resolve({ model: 'grand-highlander' }) });
      render(page);

      const calcBtn = screen.getByRole('link', { name: /Calculate Savings/i });
      expect(calcBtn).toHaveAttribute('href', '/calculator/grand-highlander');
    });
  });

  describe('4. Sitemap Verification Gate', () => {
    it('includes clean programmatic calculator routes in sitemap without query parameters', async () => {
      const entries = await sitemap();
      const urls = entries.map((e) => e.url);

      expect(urls.some((u) => u.includes('toyotawaits.ca/calculator'))).toBe(true);
      expect(urls.some((u) => u.includes('toyotawaits.ca/calculator/rav4-hybrid'))).toBe(true);
      expect(urls.some((u) => u.includes('toyotawaits.ca/calculator/sienna-hybrid'))).toBe(true);
      expect(urls.some((u) => u.includes('toyotawaits.ca/calculator/grand-highlander'))).toBe(true);

      // Verify no parameterized URLs in calculator entries
      const calcEntries = urls.filter((u) => u.includes('/calculator'));
      for (const url of calcEntries) {
        expect(url).not.toContain('?');
        expect(url).not.toContain('#');
      }
    });
  });
});
