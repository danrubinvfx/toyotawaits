import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ToyotaFirstWashPaintCareGuidePage, {
  generateMetadata,
  dynamic,
  instant,
} from '@/app/guides/toyota-first-wash-paint-care/page';
import { MarketProvider } from '@/context/MarketContext';
import { GEAR_MARKET_CATALOG } from '@/data/gear/catalog';
import GuidesIndexPage from '@/app/guides/page';
import DeliveryPrepPage from '@/app/delivery-prep/page';
import sitemap from '@/app/sitemap';

const mockHeadersGet = vi.fn();

vi.mock('next/headers', () => ({
  headers: vi.fn(async () => ({
    get: mockHeadersGet,
  })),
}));

describe('New Toyota First-Wash & Paint Care Guide Page', () => {
  beforeEach(() => {
    mockHeadersGet.mockReset();
    mockHeadersGet.mockReturnValue(null);
  });

  it('preserves Next.js 16 route segment exports', () => {
    expect(dynamic).toBe('force-dynamic');
    expect(instant).toBe(false);
  });

  it('generates expected SEO metadata and alternates', async () => {
    const meta = await generateMetadata();
    expect(meta.title).toBe(
      'New Toyota First-Wash & Paint Care Guide: Why to Decline the Dealer Car Wash | ToyotaWaits'
    );
    expect(meta.description).toBe(
      'Protect soft Toyota clear coats on delivery day. Why to tell your dealer "Do Not Wash," how to wash without swirl marks (ONR & two-bucket), and $30 DIY ceramic sealants vs. $899 dealer packages.'
    );
    expect(meta.alternates?.canonical).toBe(
      'https://www.toyotawaits.ca/guides/toyota-first-wash-paint-care'
    );
    expect(meta.alternates?.languages?.['en-CA']).toBe(
      'https://www.toyotawaits.ca/guides/toyota-first-wash-paint-care'
    );
    expect(meta.alternates?.languages?.['en-US']).toBe(
      'https://www.toyotawaits.com/guides/toyota-first-wash-paint-care'
    );
  });

  it('registers all 4 paint & wash starter items in GEAR_MARKET_CATALOG', () => {
    const expectedSlugs = [
      'optimum-no-rinse-wash',
      'griots-ceramic-3-in-1-wax',
      'microfiber-edgeless-towels',
      'chemical-guys-two-bucket-kit',
    ];

    for (const slug of expectedSlugs) {
      expect(GEAR_MARKET_CATALOG[slug]).toBeDefined();
      expect(GEAR_MARKET_CATALOG[slug].asin).toBeUndefined();
      expect(GEAR_MARKET_CATALOG[slug].asin_ca).toBeUndefined();
      expect(GEAR_MARKET_CATALOG[slug].asin_us).toBeUndefined();
      expect(GEAR_MARKET_CATALOG[slug].destinationUrl).toMatch(/^\/out\//);
    }
  });

  it('renders FAQPage and Article JSON-LD schemas on SSR', async () => {
    const pageElement = await ToyotaFirstWashPaintCareGuidePage();
    const { container } = render(
      <MarketProvider initialMarket="CA">{pageElement}</MarketProvider>
    );

    const scripts = Array.from(
      container.querySelectorAll('script[type="application/ld+json"]')
    );
    expect(scripts.length).toBe(2);

    const faqScript = scripts.find((s) => s.innerHTML.includes('"FAQPage"'));
    const articleScript = scripts.find((s) => s.innerHTML.includes('"Article"'));
    expect(faqScript).toBeDefined();
    expect(articleScript).toBeDefined();

    const faqJson = JSON.parse(faqScript!.innerHTML);
    expect(faqJson['@type']).toBe('FAQPage');
    expect(faqJson.mainEntity.length).toBeGreaterThanOrEqual(4);

    const articleJson = JSON.parse(articleScript!.innerHTML);
    expect(articleJson['@type']).toBe('Article');
    expect(articleJson.headline).toContain('New Toyota First-Wash & Paint Care Guide');
  });

  it('renders affiliate disclosure, editorial sections, and cross-links', async () => {
    const pageElement = await ToyotaFirstWashPaintCareGuidePage();
    const { container } = render(
      <MarketProvider initialMarket="CA">{pageElement}</MarketProvider>
    );

    expect(screen.getByTestId('affiliate-disclosure')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /1\. Rule #1 on Delivery Day: Tell Your Advisor/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /2\. Dealer \$899 Paint Sealant vs\. \$30 DIY SiO2 Ceramic Spray/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /3\. The 2-Method Safe Wash Playbook/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /4\. Day-One Paint & Wash Kit/i,
      })
    ).toBeInTheDocument();

    expect(container.querySelector('a[href="/delivery-prep"]')).toBeInTheDocument();
    expect(
      container.querySelector('a[href="/guides/toyota-ecp-warranty-guide"]')
    ).toBeInTheDocument();
  });

  it('routes all 4 Amazon gear cards to amazon.ca with toyotawaits-20 in CA market', async () => {
    const pageElement = await ToyotaFirstWashPaintCareGuidePage();
    const { container } = render(
      <MarketProvider initialMarket="CA">{pageElement}</MarketProvider>
    );

    const grid = container.querySelector('[data-testid="paint-care-gear-grid"]');
    expect(grid).not.toBeNull();

    const links = Array.from(grid!.querySelectorAll('a[target="_blank"]'));
    // Each GearCard has 2 target="_blank" links (image + CTA button) => 8 links for 4 items
    expect(links.length).toBe(8);

    for (const link of links) {
      const href = link.getAttribute('href') || '';
      const rel = link.getAttribute('rel') || '';
      expect(href).toContain('https://www.amazon.ca/s?');
      expect(href).toContain('tag=toyotawaits-20');
      expect(href).not.toContain('/dp/');
      expect(rel).toBe('sponsored noopener noreferrer nofollow');
    }

    expect(screen.getAllByText('Search on Amazon ↗').length).toBe(4);
  });

  it('routes all 4 Amazon gear cards to amazon.com with toyotawaits07-20 in US market', async () => {
    mockHeadersGet.mockImplementation((name: string) =>
      name === 'x-region' ? 'US' : null
    );

    const pageElement = await ToyotaFirstWashPaintCareGuidePage();
    const { container } = render(
      <MarketProvider initialMarket="US">{pageElement}</MarketProvider>
    );

    const grid = container.querySelector('[data-testid="paint-care-gear-grid"]');
    expect(grid).not.toBeNull();

    const links = Array.from(grid!.querySelectorAll('a[target="_blank"]'));
    expect(links.length).toBe(8);

    for (const link of links) {
      const href = link.getAttribute('href') || '';
      const rel = link.getAttribute('rel') || '';
      expect(href).toContain('https://www.amazon.com/s?');
      expect(href).toContain('tag=toyotawaits07-20');
      expect(href).not.toContain('/dp/');
      expect(rel).toBe('sponsored noopener noreferrer nofollow');
    }
  });

  it('is cross-linked from /delivery-prep, /guides, and sitemap.ts', async () => {
    const { container: guidesContainer } = render(<GuidesIndexPage />);
    expect(
      guidesContainer.querySelector('a[href="/guides/toyota-first-wash-paint-care"]')
    ).toBeInTheDocument();

    const { container: deliveryContainer } = render(
      <MarketProvider initialMarket="CA">
        <DeliveryPrepPage />
      </MarketProvider>
    );
    expect(
      deliveryContainer.querySelector('a[href="/guides/toyota-first-wash-paint-care"]')
    ).toBeInTheDocument();

    const entries = await sitemap();
    const entry = entries.find((e) =>
      e.url.endsWith('/guides/toyota-first-wash-paint-care')
    );
    expect(entry).toBeDefined();
    expect(entry?.alternates?.languages?.['en-CA']).toBe(
      'https://www.toyotawaits.ca/guides/toyota-first-wash-paint-care'
    );
    expect(entry?.alternates?.languages?.['en-US']).toBe(
      'https://www.toyotawaits.com/guides/toyota-first-wash-paint-care'
    );
  });
});
