import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ToyotaDiyMaintenanceGuidePage, {
  generateMetadata,
  dynamic,
  instant,
} from '@/app/guides/toyota-diy-maintenance-guide/page';
import { MarketProvider } from '@/context/MarketContext';
import { GEAR_MARKET_CATALOG } from '@/data/gear/catalog';
import GuidesIndexPage from '@/app/guides/page';
import DeliveryPrepPage from '@/app/delivery-prep/page';
import { Footer } from '@/components/layout/footer';
import sitemap from '@/app/sitemap';

const mockHeadersGet = vi.fn();

vi.mock('next/headers', () => ({
  headers: vi.fn(async () => ({
    get: mockHeadersGet,
  })),
}));

describe('Toyota DIY Maintenance & Upkeep Guide Page', () => {
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
      'Toyota DIY Maintenance & Upkeep Guide: Oil Specs, Filters & Care | ToyotaWaits'
    );
    expect(meta.description).toBe(
      'Complete DIY maintenance checklist for Toyota Hybrid & Gas owners. Model-by-model 0W-8, 0W-16, and 0W-20 oil specs, hybrid battery fan filter cleaning, 12V battery care, and wash gear.'
    );
    expect(meta.alternates?.canonical).toBe(
      'https://www.toyotawaits.ca/guides/toyota-diy-maintenance-guide'
    );
    expect(meta.alternates?.languages?.['en-CA']).toBe(
      'https://www.toyotawaits.ca/guides/toyota-diy-maintenance-guide'
    );
    expect(meta.alternates?.languages?.['en-US']).toBe(
      'https://www.toyotawaits.com/guides/toyota-diy-maintenance-guide'
    );
  });

  it('registers all maintenance gear items in GEAR_MARKET_CATALOG without raw ASINs', () => {
    const expectedSlugs = [
      'toyota-0w16-synthetic-oil',
      'toyota-0w20-synthetic-oil',
      'toyota-oem-oil-filter-kit',
      'cabin-engine-air-filter',
      'hybrid-battery-filter-mesh',
      'undercarriage-pressure-washer',
      'optimum-no-rinse-wash',
      'griots-ceramic-3-in-1-wax',
      'microfiber-edgeless-towels',
      'interior-uv-protectant',
      'detailing-brush-screen-kit',
      'beam-wiper-blades',
      'glass-rain-repellent',
      'noco-12v-battery-maintainer',
      'torque-wrench-lug-socket',
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
    const pageElement = await ToyotaDiyMaintenanceGuidePage();
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
    expect(faqJson.mainEntity.length).toBe(3);

    const articleJson = JSON.parse(articleScript!.innerHTML);
    expect(articleJson['@type']).toBe('Article');
    expect(articleJson.headline).toContain('Toyota DIY Maintenance & Upkeep Guide');
  });

  it('renders affiliate disclosure, fluid matrix, DIY schedule, and cross-links', async () => {
    const pageElement = await ToyotaDiyMaintenanceGuidePage();
    const { container } = render(
      <MarketProvider initialMarket="CA">{pageElement}</MarketProvider>
    );

    expect(screen.getByTestId('affiliate-disclosure')).toBeInTheDocument();
    expect(screen.getByTestId('fluid-lookup-matrix')).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /1\. Model Fluid & Filter Quick-Lookup Matrix/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /2\. The 8,000 km \/ 6-Month vs\. 16,000 km \/ 12-Month DIY Schedule/i,
      })
    ).toBeInTheDocument();

    expect(
      container.querySelector('a[href="/guides/toyota-first-wash-paint-care"]')
    ).toBeInTheDocument();
    expect(container.querySelector('a[href="/tires"]')).toBeInTheDocument();
  });

  it('routes all 15 Amazon gear cards to amazon.ca with toyotawaits-20 in CA market', async () => {
    const pageElement = await ToyotaDiyMaintenanceGuidePage();
    const { container } = render(
      <MarketProvider initialMarket="CA">{pageElement}</MarketProvider>
    );

    const shelfIds = [
      'shelf-fluids-grid',
      'shelf-wash-grid',
      'shelf-interior-grid',
      'shelf-wipers-grid',
      'shelf-battery-tires-grid',
    ];

    let totalLinks = 0;
    for (const id of shelfIds) {
      const grid = container.querySelector(`[data-testid="${id}"]`);
      expect(grid).not.toBeNull();
      const links = Array.from(grid!.querySelectorAll('a[target="_blank"]'));
      totalLinks += links.length;

      for (const link of links) {
        const href = link.getAttribute('href') || '';
        const rel = link.getAttribute('rel') || '';
        expect(href).toContain('https://www.amazon.ca/s?');
        expect(href).toContain('tag=toyotawaits-20');
        expect(href).not.toContain('/dp/');
        expect(rel).toBe('sponsored noopener noreferrer nofollow');
      }
    }

    // 15 GearCards * 2 target="_blank" links per card = 30 links
    expect(totalLinks).toBe(30);
    expect(screen.getAllByText('Search on Amazon ↗').length).toBe(15);
  });

  it('routes all 15 Amazon gear cards to amazon.com with toyotawaits07-20 in US market', async () => {
    mockHeadersGet.mockImplementation((name: string) =>
      name === 'x-region' ? 'US' : null
    );

    const pageElement = await ToyotaDiyMaintenanceGuidePage();
    const { container } = render(
      <MarketProvider initialMarket="US">{pageElement}</MarketProvider>
    );

    const shelfIds = [
      'shelf-fluids-grid',
      'shelf-wash-grid',
      'shelf-interior-grid',
      'shelf-wipers-grid',
      'shelf-battery-tires-grid',
    ];

    let totalLinks = 0;
    for (const id of shelfIds) {
      const grid = container.querySelector(`[data-testid="${id}"]`);
      expect(grid).not.toBeNull();
      const links = Array.from(grid!.querySelectorAll('a[target="_blank"]'));
      totalLinks += links.length;

      for (const link of links) {
        const href = link.getAttribute('href') || '';
        const rel = link.getAttribute('rel') || '';
        expect(href).toContain('https://www.amazon.com/s?');
        expect(href).toContain('tag=toyotawaits07-20');
        expect(href).not.toContain('/dp/');
        expect(rel).toBe('sponsored noopener noreferrer nofollow');
      }
    }

    expect(totalLinks).toBe(30);
  });

  it('is cross-linked from /guides, /delivery-prep, footer, and sitemap.ts', async () => {
    const { container: guidesContainer } = render(<GuidesIndexPage />);
    expect(
      guidesContainer.querySelector('a[href="/guides/toyota-diy-maintenance-guide"]')
    ).toBeInTheDocument();

    const deliveryJsx = await DeliveryPrepPage();
    const { container: deliveryContainer } = render(
      <MarketProvider initialMarket="CA">
        {deliveryJsx}
      </MarketProvider>
    );
    expect(
      deliveryContainer.querySelector('a[href="/guides/toyota-diy-maintenance-guide"]')
    ).toBeInTheDocument();

    const { container: footerContainer } = render(
      <MarketProvider initialMarket="CA">
        <Footer />
      </MarketProvider>
    );
    expect(
      footerContainer.querySelector('a[href$="/guides/toyota-diy-maintenance-guide"]')
    ).toBeInTheDocument();

    const entries = await sitemap();
    const entry = entries.find((e) =>
      e.url.endsWith('/guides/toyota-diy-maintenance-guide')
    );
    expect(entry).toBeDefined();
    expect(entry?.priority).toBe(0.8);
    expect(entry?.changeFrequency).toBe('monthly');
  });
});
