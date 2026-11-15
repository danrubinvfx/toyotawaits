import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SequoiaGuidePage, {
  generateMetadata as generateSequoiaMetadata,
  dynamic as sequoiaDynamic,
  instant as sequoiaInstant,
} from '@/app/guides/toyota-sequoia-2026-vs-2027/page';
import HighlanderGuidePage, {
  generateMetadata as generateHighlanderMetadata,
  dynamic as highlanderDynamic,
  instant as highlanderInstant,
} from '@/app/guides/toyota-highlander-2026-vs-2027/page';
import CamryGuidePage, {
  generateMetadata as generateCamryMetadata,
  dynamic as camryDynamic,
  instant as camryInstant,
} from '@/app/guides/toyota-camry-2026-vs-2027/page';
import LandCruiserGuidePage, {
  generateMetadata as generateLandCruiserMetadata,
  dynamic as landCruiserDynamic,
  instant as landCruiserInstant,
} from '@/app/guides/toyota-land-cruiser-2026-vs-2027/page';
import PriusGuidePage, {
  generateMetadata as generatePriusMetadata,
  dynamic as priusDynamic,
  instant as priusInstant,
} from '@/app/guides/toyota-prius-2026-vs-2027/page';
import ModelWaitTimePage, {
  generateMetadata as generateWaitTimesMetadata,
} from '@/app/wait-times/[model]/page';

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Map([['x-Detected-Country', 'CA']])),
}));

vi.mock('@/components/common/back-button', () => ({
  BackButton: ({ label }: { label?: string }) => <div data-testid="back-button">{label}</div>,
}));

vi.mock('@/components/common/GuideDisclaimer', () => ({
  GuideDisclaimer: () => <div data-testid="guide-disclaimer">Disclaimer</div>,
}));

vi.mock('@/lib/services/wait-times', () => ({
  getModelStats: vi.fn().mockImplementation(async () => ({
    sampleSize: 40,
    medianDays: 140,
    p25Days: 90,
    p75Days: 210,
    isFallback: false,
    powertrainStats: [],
    provincialSpreads: [
      { code: 'ON', name: 'Ontario', medianDays: 130, p25Days: 85, p75Days: 190, sampleSize: 18, note: 'Strong hub' },
    ],
    recentDeliveries: [],
  })),
}));

vi.mock('@/lib/services/inventory', () => ({
  getModelInventoryCount: vi.fn().mockResolvedValue(4),
}));

vi.mock('@/components/inventory/ModelLiveInventorySection', () => ({
  ModelLiveInventorySection: () => <div data-testid="live-inventory-section">Live Inventory</div>,
}));

describe('Remaining 5 Official 2026 vs. 2027 Comparison Guides & Hub Bridges', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. 2026 vs. 2027 Toyota Sequoia Guide (/guides/toyota-sequoia-2026-vs-2027)', () => {
    it('exports Next.js 16 route segment config and exact metadata', async () => {
      expect(sequoiaDynamic).toBe('force-dynamic');
      expect(sequoiaInstant).toBe(false);

      const metadata = await generateSequoiaMetadata();
      expect(metadata.title).toBe(
        '2026 vs. 2027 Toyota Sequoia Canada: Trailhunter, Price Hike & Wait Times | ToyotaWaits'
      );
      expect(metadata.description).toBe(
        'Compare the 2026 and 2027 Toyota Sequoia in Canada. Breakdown of the new SR5 Trailhunter ($95,552 MSRP), +$5,560 base price jump, FOX QS3 TRD Pro shocks, TSS 4.0, and Trailer ADAS.'
      );
      expect(metadata.alternates?.canonical).toBe(
        'https://www.toyotawaits.ca/guides/toyota-sequoia-2026-vs-2027'
      );
    });

    it('renders FAQPage JSON-LD, comparison table, CTAs, and affiliate gear links', async () => {
      const ui = await SequoiaGuidePage();
      const { container } = render(ui);

      const scripts = Array.from(container.querySelectorAll('script[type="application/ld+json"]'));
      const schemas = scripts.map((s) => JSON.parse(s.innerHTML));
      const faqSchema = schemas.find((s) => s['@type'] === 'FAQPage');
      expect(faqSchema).toBeDefined();
      expect(faqSchema.mainEntity).toHaveLength(3);

      expect(container.querySelector('table')).not.toBeNull();
      expect(screen.getByLabelText('Pass or Take It Decision Matrix')).toBeInTheDocument();
      const gearShelf = screen.getByLabelText('Day-1 Delivery Gear Shelf');
      expect(gearShelf).toBeInTheDocument();

      const gearLinks = Array.from(gearShelf.querySelectorAll('a[href*="amazon."]'));
      expect(gearLinks).toHaveLength(4);
      for (const link of gearLinks) {
        expect(link.getAttribute('href')).toContain('tag=toyotawaits-20');
        expect(link.getAttribute('rel')).toBe('sponsored noopener noreferrer nofollow');
      }
    });
  });

  describe('2. 2026 vs. 2027 Toyota Highlander Guide (/guides/toyota-highlander-2026-vs-2027)', () => {
    it('exports Next.js 16 route segment config and exact metadata', async () => {
      expect(highlanderDynamic).toBe('force-dynamic');
      expect(highlanderInstant).toBe(false);

      const metadata = await generateHighlanderMetadata();
      expect(metadata.title).toBe(
        '2026 vs. 2027 Toyota Highlander Canada: All-Electric 3-Row BEV Overhaul | ToyotaWaits'
      );
      expect(metadata.description).toBe(
        'Compare the 2026 Gas/Hybrid Highlander vs. the all-new 2027 Toyota Highlander 3-row electric SUV in Canada. Up to 511 km range, 338 hp AWD, native NACS port, and Grand Highlander alternatives.'
      );
      expect(metadata.alternates?.canonical).toBe(
        'https://www.toyotawaits.ca/guides/toyota-highlander-2026-vs-2027'
      );
    });

    it('renders FAQPage JSON-LD, BEV vs Gas/Hybrid table, Grand Highlander alternative link, and affiliate gear links', async () => {
      const ui = await HighlanderGuidePage();
      const { container } = render(ui);

      const scripts = Array.from(container.querySelectorAll('script[type="application/ld+json"]'));
      const schemas = scripts.map((s) => JSON.parse(s.innerHTML));
      const faqSchema = schemas.find((s) => s['@type'] === 'FAQPage');
      expect(faqSchema).toBeDefined();
      expect(faqSchema.mainEntity).toHaveLength(3);

      expect(container.querySelector('table')).not.toBeNull();
      expect(screen.getByLabelText('Pass or Take It Decision Matrix')).toBeInTheDocument();
      const gearShelf = screen.getByLabelText('Day-1 Delivery Gear Shelf');
      expect(gearShelf).toBeInTheDocument();

      const ghLinks = Array.from(container.querySelectorAll('a[href="/wait-times/grand-highlander"]'));
      expect(ghLinks.length).toBeGreaterThanOrEqual(1);

      const gearLinks = Array.from(gearShelf.querySelectorAll('a[href*="amazon."]'));
      expect(gearLinks).toHaveLength(4);
      for (const link of gearLinks) {
        expect(link.getAttribute('href')).toContain('tag=toyotawaits-20');
        expect(link.getAttribute('rel')).toBe('sponsored noopener noreferrer nofollow');
      }
    });
  });

  describe('3. 2026 vs. 2027 Toyota Camry Guide (/guides/toyota-camry-2026-vs-2027)', () => {
    it('exports Next.js 16 route segment config and exact metadata', async () => {
      expect(camryDynamic).toBe('force-dynamic');
      expect(camryInstant).toBe(false);

      const metadata = await generateCamryMetadata();
      expect(metadata.title).toBe(
        '2026 vs. 2027 Toyota Camry Canada: Pricing, AWD Trims & Wait Times | ToyotaWaits'
      );
      expect(metadata.description).toBe(
        'Compare the 2026 and 2027 Toyota Camry Hybrid in Canada (on sale Nov 2026). Full trim pricing ($39,148–$49,488 all-in), carryover 225/232-hp hybrid specs, and allocation advice.'
      );
      expect(metadata.alternates?.canonical).toBe(
        'https://www.toyotawaits.ca/guides/toyota-camry-2026-vs-2027'
      );
    });

    it('renders FAQPage JSON-LD, comparison table, calculator link, and affiliate gear links', async () => {
      const ui = await CamryGuidePage();
      const { container } = render(ui);

      const scripts = Array.from(container.querySelectorAll('script[type="application/ld+json"]'));
      const schemas = scripts.map((s) => JSON.parse(s.innerHTML));
      const faqSchema = schemas.find((s) => s['@type'] === 'FAQPage');
      expect(faqSchema).toBeDefined();
      expect(faqSchema.mainEntity).toHaveLength(3);

      expect(container.querySelector('table')).not.toBeNull();
      expect(screen.getByLabelText('Pass or Take It Decision Matrix')).toBeInTheDocument();
      const gearShelf = screen.getByLabelText('Day-1 Delivery Gear Shelf');
      expect(gearShelf).toBeInTheDocument();

      const waitLinks = Array.from(container.querySelectorAll('a[href="/wait-times/camry"]'));
      expect(waitLinks.length).toBeGreaterThanOrEqual(1);

      const gearLinks = Array.from(gearShelf.querySelectorAll('a[href*="amazon."]'));
      expect(gearLinks).toHaveLength(4);
      for (const link of gearLinks) {
        expect(link.getAttribute('href')).toContain('tag=toyotawaits-20');
        expect(link.getAttribute('rel')).toBe('sponsored noopener noreferrer nofollow');
      }
    });
  });

  describe('4. 2026 vs. 2027 Toyota Land Cruiser Guide (/guides/toyota-land-cruiser-2026-vs-2027)', () => {
    it('exports Next.js 16 route segment config and exact metadata', async () => {
      expect(landCruiserDynamic).toBe('force-dynamic');
      expect(landCruiserInstant).toBe(false);

      const metadata = await generateLandCruiserMetadata();
      expect(metadata.title).toBe(
        '2026 vs. 2027 Toyota Land Cruiser Canada: Premium Updates & Wait Times | ToyotaWaits'
      );
      expect(metadata.description).toBe(
        'Compare the 2026 and 2027 Toyota Land Cruiser in Canada. Standard heated & ventilated rear seats on Premium Package, added TSS safety tech, Canadian pricing ($71,670–$86,835 MSRP), and stock tracking.'
      );
      expect(metadata.alternates?.canonical).toBe(
        'https://www.toyotawaits.ca/guides/toyota-land-cruiser-2026-vs-2027'
      );
    });

    it('renders FAQPage JSON-LD, comparison table, and affiliate gear links', async () => {
      const ui = await LandCruiserGuidePage();
      const { container } = render(ui);

      const scripts = Array.from(container.querySelectorAll('script[type="application/ld+json"]'));
      const schemas = scripts.map((s) => JSON.parse(s.innerHTML));
      const faqSchema = schemas.find((s) => s['@type'] === 'FAQPage');
      expect(faqSchema).toBeDefined();
      expect(faqSchema.mainEntity).toHaveLength(3);

      expect(container.querySelector('table')).not.toBeNull();
      expect(screen.getByLabelText('Pass or Take It Decision Matrix')).toBeInTheDocument();
      const gearShelf = screen.getByLabelText('Day-1 Delivery Gear Shelf');
      expect(gearShelf).toBeInTheDocument();

      const gearLinks = Array.from(gearShelf.querySelectorAll('a[href*="amazon."]'));
      expect(gearLinks).toHaveLength(4);
      for (const link of gearLinks) {
        expect(link.getAttribute('href')).toContain('tag=toyotawaits-20');
        expect(link.getAttribute('rel')).toBe('sponsored noopener noreferrer nofollow');
      }
    });
  });

  describe('5. 2026 vs. 2027 Toyota Prius Guide (/guides/toyota-prius-2026-vs-2027)', () => {
    it('exports Next.js 16 route segment config and exact metadata', async () => {
      expect(priusDynamic).toBe('force-dynamic');
      expect(priusInstant).toBe(false);

      const metadata = await generatePriusMetadata();
      expect(metadata.title).toBe(
        '2026 vs. 2027 Toyota Prius & PHEV Canada: Standard Upgrades & Wait Times | ToyotaWaits'
      );
      expect(metadata.description).toBe(
        'Compare the 2026 and 2027 Toyota Prius AWD & Prius Plug-in Hybrid in Canada. Standard dual-zone climate control, included dual-voltage L1/L2 PHEV charger, Canadian pricing, and queue rollovers.'
      );
      expect(metadata.alternates?.canonical).toBe(
        'https://www.toyotawaits.ca/guides/toyota-prius-2026-vs-2027'
      );
    });

    it('renders FAQPage JSON-LD, comparison table, and affiliate gear links', async () => {
      const ui = await PriusGuidePage();
      const { container } = render(ui);

      const scripts = Array.from(container.querySelectorAll('script[type="application/ld+json"]'));
      const schemas = scripts.map((s) => JSON.parse(s.innerHTML));
      const faqSchema = schemas.find((s) => s['@type'] === 'FAQPage');
      expect(faqSchema).toBeDefined();
      expect(faqSchema.mainEntity).toHaveLength(3);

      expect(container.querySelector('table')).not.toBeNull();
      expect(screen.getByLabelText('Pass or Take It Decision Matrix')).toBeInTheDocument();
      const gearShelf = screen.getByLabelText('Day-1 Delivery Gear Shelf');
      expect(gearShelf).toBeInTheDocument();

      const gearLinks = Array.from(gearShelf.querySelectorAll('a[href*="amazon."]'));
      expect(gearLinks).toHaveLength(4);
      for (const link of gearLinks) {
        expect(link.getAttribute('href')).toContain('tag=toyotawaits-20');
        expect(link.getAttribute('rel')).toBe('sponsored noopener noreferrer nofollow');
      }
    });
  });

  describe('6. Wait-Time Model Hub Bridges & (2026–2027 Delivery Tracker) Metadata', () => {
    const models = [
      {
        slug: 'sequoia',
        expectedTitle: 'Toyota Sequoia Wait Times Canada (2026–2027 Delivery Tracker) | ToyotaWaits',
        bridgeTestId: 'sequoia-2026-2027-bridge',
        expectedHref: '/guides/toyota-sequoia-2026-vs-2027',
      },
      {
        slug: 'highlander',
        expectedTitle: 'Toyota Highlander Wait Times Canada (2026–2027 Delivery Tracker) | ToyotaWaits',
        bridgeTestId: 'highlander-2026-2027-bridge',
        expectedHref: '/guides/toyota-highlander-2026-vs-2027',
      },
      {
        slug: 'camry',
        expectedTitle: 'Toyota Camry Wait Times Canada (2026–2027 Delivery Tracker) | ToyotaWaits',
        bridgeTestId: 'camry-2026-2027-bridge',
        expectedHref: '/guides/toyota-camry-2026-vs-2027',
      },
      {
        slug: 'land-cruiser',
        expectedTitle: 'Toyota Land Cruiser Wait Times Canada (2026–2027 Delivery Tracker) | ToyotaWaits',
        bridgeTestId: 'land-cruiser-2026-2027-bridge',
        expectedHref: '/guides/toyota-land-cruiser-2026-vs-2027',
      },
      {
        slug: 'prius',
        expectedTitle: 'Toyota Prius Wait Times Canada (2026–2027 Delivery Tracker) | ToyotaWaits',
        bridgeTestId: 'prius-2026-2027-bridge',
        expectedHref: '/guides/toyota-prius-2026-vs-2027',
      },
    ];

    it.each(models)(
      'updates metadata title and renders 2026 vs. 2027 callout card on /wait-times/$slug',
      async ({ slug, expectedTitle, bridgeTestId, expectedHref }) => {
        const metadata = await generateWaitTimesMetadata({
          params: Promise.resolve({ model: slug }),
        });
        expect(metadata.title).toBe(expectedTitle);

        const ui = await ModelWaitTimePage({
          params: Promise.resolve({ model: slug }),
        });
        render(ui);

        const bridge = screen.getByTestId(bridgeTestId);
        expect(bridge).toBeInTheDocument();
        const link = bridge.querySelector(`a[href="${expectedHref}"]`);
        expect(link).not.toBeNull();
      }
    );
  });
});
