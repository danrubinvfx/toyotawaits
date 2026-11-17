import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockHeaders = vi.fn();

vi.mock('next/headers', () => ({
  headers: () => mockHeaders(),
}));

import { getRequestMarketMetadata } from '@/lib/seo/host-metadata';
import { generateMetadata as generateLayoutMetadata } from '@/app/layout';
import { generateMetadata as generateHomeMetadata } from '@/app/page';
import { generateMetadata as generateWaitTimesMetadata } from '@/app/wait-times/[model]/page';
import { generateMetadata as generateInventoryMetadata } from '@/app/inventory/page';
import { generateMetadata as generateCalculatorMetadata } from '@/app/calculator/page';
import { generateMetadata as generateDynamicCalculatorMetadata } from '@/app/calculator/[model]/page';
import { generateMetadata as generateRav4CalcMetadata } from '@/app/calculator/rav4-hybrid/page';
import { generateMetadata as generateSiennaCalcMetadata } from '@/app/calculator/sienna-hybrid/page';
import { generateMetadata as generateGhCalcMetadata } from '@/app/calculator/grand-highlander/page';
import { generateMetadata as generateCcCalcMetadata } from '@/app/calculator/corolla-cross-hybrid/page';
import { generateMetadata as generateRav4GuideMetadata } from '@/app/guides/toyota-rav4-2026-vs-2027/page';
import { generateMetadata as generateSiennaGuideMetadata } from '@/app/guides/toyota-sienna-2026-vs-2027/page';
import { generateMetadata as generateTundraGuideMetadata } from '@/app/guides/toyota-tundra-2026-vs-2027/page';

function setMockHeaders(entries: Record<string, string>) {
  mockHeaders.mockResolvedValue(new Headers(entries));
}

describe('Host-Aware Server Metadata (toyotawaits.com vs. toyotawaits.ca)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHeaders.mockRejectedValue(new Error('No active request headers'));
  });

  describe('getRequestMarketMetadata helper', () => {
    it('defaults cleanly to CA when headers() throws or has no US host/region', async () => {
      const fallback = await getRequestMarketMetadata('/inventory');
      expect(fallback.market).toBe('CA');
      expect(fallback.isUS).toBe(false);
      expect(fallback.baseUrl).toBe('https://www.toyotawaits.ca');
      expect(fallback.alternatesLanguages).toEqual({
        'en-CA': 'https://www.toyotawaits.ca/inventory',
        'en-US': 'https://www.toyotawaits.com/inventory',
        'x-default': 'https://www.toyotawaits.ca/inventory',
      });

      setMockHeaders({ host: 'www.toyotawaits.ca', 'x-region': 'CA' });
      const ca = await getRequestMarketMetadata('/inventory');
      expect(ca.market).toBe('CA');
      expect(ca.isUS).toBe(false);
      expect(ca.baseUrl).toBe('https://www.toyotawaits.ca');
    });

    it('detects US market via x-region: US, host: www.toyotawaits.com, or x-domain', async () => {
      setMockHeaders({ 'x-region': 'US' });
      expect(await getRequestMarketMetadata('/')).toMatchObject({
        market: 'US',
        isUS: true,
        baseUrl: 'https://www.toyotawaits.com',
      });

      setMockHeaders({ host: 'www.toyotawaits.com' });
      expect(await getRequestMarketMetadata('/')).toMatchObject({
        market: 'US',
        isUS: true,
        baseUrl: 'https://www.toyotawaits.com',
      });

      setMockHeaders({ 'x-domain': 'toyotawaits.com' });
      expect(await getRequestMarketMetadata('/')).toMatchObject({
        market: 'US',
        isUS: true,
        baseUrl: 'https://www.toyotawaits.com',
      });
    });
  });

  describe('US Host (www.toyotawaits.com / x-region: US)', () => {
    beforeEach(() => {
      setMockHeaders({ host: 'www.toyotawaits.com', 'x-region': 'US' });
    });

    it('emits US metadata without "Canada" and https://www.toyotawaits.com canonical for layout & home', async () => {
      const layoutMeta = await generateLayoutMetadata();
      expect(layoutMeta.title).toBe(
        'Toyota Wait Times & Dealer Markup Tracker (2026–2027) | ToyotaWaits'
      );
      expect(layoutMeta.description).toBe(
        'Track real crowdsourced Toyota allocation transit timelines, wait times, and Additional Dealer Markups (ADM) across the United States.'
      );
      expect(String(layoutMeta.title)).not.toContain('Canada');
      expect(layoutMeta.description).not.toContain('Canada');
      expect(layoutMeta.alternates?.canonical).toBe('https://www.toyotawaits.com/');

      const homeMeta = await generateHomeMetadata();
      expect(homeMeta.title).toBe(
        'Toyota Wait Times & Dealer Markup Tracker (2026–2027) | ToyotaWaits'
      );
      expect(homeMeta.openGraph?.title).toBe(
        'Toyota Wait Times & Dealer Markup Tracker (2026–2027) | ToyotaWaits'
      );
      expect(homeMeta.alternates?.canonical).toBe('https://www.toyotawaits.com/');
    });

    it('emits US metadata for /wait-times/[model] without "Canada"', async () => {
      const meta = await generateWaitTimesMetadata({
        params: Promise.resolve({ model: 'rav4' }),
      });
      expect(meta.title).toBe(
        'Toyota RAV4 Wait Times & Dealer Markups (2026–2027 US Tracker) | ToyotaWaits'
      );
      expect(meta.description).toBe(
        'Track real-time 2026–2027 Toyota RAV4 allocation transit times, state-by-state queues, and dealer markups (ADM) across the United States.'
      );
      expect(String(meta.title)).not.toContain('Canada');
      expect(meta.description).not.toContain('Canada');
      expect(meta.alternates?.canonical).toBe('https://www.toyotawaits.com/wait-times/rav4');
      expect(meta.openGraph?.url).toBe('https://www.toyotawaits.com/wait-times/rav4');
    });

    it('emits US metadata for /inventory without "Canada"', async () => {
      const meta = await generateInventoryMetadata();
      expect(meta.title).toBe(
        'In-Stock & Incoming Toyota Allocations — Live Dealer Inventory Tracker | ToyotaWaits'
      );
      expect(meta.description).toBe(
        'Search live incoming and on-lot Toyota hybrid, PHEV, and truck allocations before they sell.'
      );
      expect(String(meta.title)).not.toContain('Canada');
      expect(meta.alternates?.canonical).toBe('https://www.toyotawaits.com/inventory');
    });

    it('emits US metadata dropping "Canada" and "CAD" across calculator routes', async () => {
      const calcMeta = await generateCalculatorMetadata();
      expect(String(calcMeta.title)).toContain('US Gas vs. Hybrid Payback Calculator');
      expect(String(calcMeta.title)).not.toContain('Canada');
      expect(calcMeta.description).toContain('USD');
      expect(calcMeta.description).not.toContain('CAD');
      expect(calcMeta.description).not.toContain('Canada');
      expect(calcMeta.alternates?.canonical).toBe('https://www.toyotawaits.com/calculator');

      const dynMeta = await generateDynamicCalculatorMetadata({
        params: Promise.resolve({ model: 'sienna-hybrid' }),
      });
      expect(String(dynMeta.title)).toContain('US Gas vs. Hybrid Payback Calculator');
      expect(String(dynMeta.title)).not.toContain('Canada');
      expect(dynMeta.description).toContain('USD');
      expect(dynMeta.alternates?.canonical).toBe(
        'https://www.toyotawaits.com/calculator/sienna-hybrid'
      );

      for (const [fn, slug] of [
        [generateRav4CalcMetadata, 'rav4-hybrid'],
        [generateSiennaCalcMetadata, 'sienna-hybrid'],
        [generateGhCalcMetadata, 'grand-highlander'],
        [generateCcCalcMetadata, 'corolla-cross-hybrid'],
      ] as const) {
        const meta = await fn();
        expect(String(meta.title)).toContain('US Gas vs. Hybrid Payback Calculator');
        expect(String(meta.title)).not.toContain('Canada');
        expect(meta.description).toContain('USD');
        expect(meta.description).not.toContain('Canada');
        expect(meta.alternates?.canonical).toBe(`https://www.toyotawaits.com/calculator/${slug}`);
      }
    });

    it('emits US metadata for 2026-vs-2027 guide routes with United States (2026–2027 Guide)', async () => {
      const rav4Guide = await generateRav4GuideMetadata();
      expect(String(rav4Guide.title)).toContain('United States (2026–2027 Guide)');
      expect(String(rav4Guide.title)).not.toContain('Canada');
      expect(rav4Guide.description).not.toContain('Canadian');
      expect(rav4Guide.alternates?.canonical).toBe(
        'https://www.toyotawaits.com/guides/toyota-rav4-2026-vs-2027'
      );

      const siennaGuide = await generateSiennaGuideMetadata();
      expect(String(siennaGuide.title)).toContain('United States (2026–2027 Guide)');
      expect(String(siennaGuide.title)).not.toContain('Canada');
      expect(siennaGuide.alternates?.canonical).toBe(
        'https://www.toyotawaits.com/guides/toyota-sienna-2026-vs-2027'
      );

      const tundraGuide = await generateTundraGuideMetadata();
      expect(String(tundraGuide.title)).toContain('United States (2026–2027 Guide)');
      expect(String(tundraGuide.title)).not.toContain('Canada');
      expect(tundraGuide.alternates?.canonical).toBe(
        'https://www.toyotawaits.com/guides/toyota-tundra-2026-vs-2027'
      );
    });
  });

  describe('CA Host (www.toyotawaits.ca / default)', () => {
    it('preserves Canadian titles and https://www.toyotawaits.ca canonicals', async () => {
      setMockHeaders({ host: 'www.toyotawaits.ca', 'x-region': 'CA' });

      const layoutMeta = await generateLayoutMetadata();
      expect(layoutMeta.title).toBe(
        'ToyotaWaits | Canadian Toyota Wait Times & Allocation Tracker'
      );
      expect(layoutMeta.alternates?.canonical).toBe('https://www.toyotawaits.ca/');

      const homeMeta = await generateHomeMetadata();
      expect(homeMeta.title).toBe(
        'Toyota Wait Times Canada (2026) | Crowd-Sourced Delivery Estimator'
      );
      expect(homeMeta.alternates?.canonical).toBe('https://www.toyotawaits.ca/');

      const rav4Meta = await generateWaitTimesMetadata({
        params: Promise.resolve({ model: 'rav4' }),
      });
      expect(rav4Meta.title).toBe(
        'Toyota RAV4 Wait Times Canada (2026–2027 Delivery Tracker) | ToyotaWaits'
      );
      expect(rav4Meta.alternates?.canonical).toBe('https://www.toyotawaits.ca/wait-times/rav4');

      const tundraGuide = await generateTundraGuideMetadata();
      expect(tundraGuide.title).toBe(
        '2026 vs. 2027 Toyota Tundra Canada: Trailhunter, TSS 4.0 & Wait Times | ToyotaWaits'
      );
      expect(tundraGuide.alternates?.canonical).toBe(
        'https://www.toyotawaits.ca/guides/toyota-tundra-2026-vs-2027'
      );
    });
  });
});
