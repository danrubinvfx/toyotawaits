import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarketProvider } from '@/context/MarketContext';

let mockHeadersMap: Record<string, string> = {};

vi.mock('next/headers', () => ({
  headers: vi.fn(async () => ({
    get: (key: string) => mockHeadersMap[key.toLowerCase()] ?? null,
  })),
}));

import { generateMetadata as generateFaqMetadata } from '@/app/faq/page';
import { generateMetadata as generateDeliveryPrepMetadata } from '@/app/delivery-prep/page';
import { generateMetadata as generateTiresMetadata } from '@/app/tires/page';
import { generateMetadata as generateDiyMaintenanceMetadata } from '@/app/guides/toyota-diy-maintenance-guide/page';
import sitemap from '@/app/sitemap';
import { UsInventoryNotice } from '@/components/inventory/UsInventoryNotice';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/footer';

function setMockHeaders(headers: Record<string, string>) {
  mockHeadersMap = Object.fromEntries(
    Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v])
  );
}

describe('Phase 3: International Separation (toyotawaits.com vs toyotawaits.ca)', () => {
  beforeEach(() => {
    mockHeadersMap = {};
    vi.clearAllMocks();
  });

  describe('1. Host-Aware US Canonicals, Hreflang Reciprocity & Titles', () => {
    it('emits toyotawaits.com canonical, reciprocal hreflang, and US titles without Canada on /faq, /delivery-prep, /tires, and /guides/toyota-diy-maintenance-guide', async () => {
      setMockHeaders({ host: 'www.toyotawaits.com', 'x-region': 'US' });

      const faqMeta = await generateFaqMetadata();
      expect(faqMeta.alternates?.canonical).toBe('https://www.toyotawaits.com/faq');
      expect(faqMeta.alternates?.languages).toEqual({
        'en-CA': 'https://www.toyotawaits.ca/faq',
        'en-US': 'https://www.toyotawaits.com/faq',
        'x-default': 'https://www.toyotawaits.ca/faq',
      });
      expect(String(faqMeta.title)).not.toMatch(/Canada/i);
      expect(faqMeta.openGraph?.siteName).toBe('ToyotaWaits');

      const deliveryMeta = await generateDeliveryPrepMetadata();
      expect(deliveryMeta.alternates?.canonical).toBe('https://www.toyotawaits.com/delivery-prep');
      expect(deliveryMeta.alternates?.languages).toEqual({
        'en-CA': 'https://www.toyotawaits.ca/delivery-prep',
        'en-US': 'https://www.toyotawaits.com/delivery-prep',
        'x-default': 'https://www.toyotawaits.ca/delivery-prep',
      });
      expect(String(deliveryMeta.title)).not.toMatch(/Canada/i);
      expect(deliveryMeta.openGraph?.siteName).toBe('ToyotaWaits');

      const tiresMeta = await generateTiresMetadata();
      expect(tiresMeta.alternates?.canonical).toBe('https://www.toyotawaits.com/tires');
      expect(tiresMeta.alternates?.languages).toEqual({
        'en-CA': 'https://www.toyotawaits.ca/tires',
        'en-US': 'https://www.toyotawaits.com/tires',
        'x-default': 'https://www.toyotawaits.ca/tires',
      });
      expect(String(tiresMeta.title)).not.toMatch(/Canada/i);
      expect(tiresMeta.openGraph?.siteName).toBe('ToyotaWaits');

      const diyMeta = await generateDiyMaintenanceMetadata();
      expect(diyMeta.alternates?.canonical).toBe(
        'https://www.toyotawaits.com/guides/toyota-diy-maintenance-guide'
      );
      expect(diyMeta.alternates?.languages).toEqual({
        'en-CA': 'https://www.toyotawaits.ca/guides/toyota-diy-maintenance-guide',
        'en-US': 'https://www.toyotawaits.com/guides/toyota-diy-maintenance-guide',
        'x-default': 'https://www.toyotawaits.ca/guides/toyota-diy-maintenance-guide',
      });
      expect(String(diyMeta.title)).not.toMatch(/Canada/i);
      expect(diyMeta.openGraph?.siteName).toBe('ToyotaWaits');
    });
  });

  describe('2. US Sitemap Exclusions & Coverage', () => {
    it('excludes Canada-only /inventory, /tools/omvic-checker, and province subpaths on toyotawaits.com sitemap', async () => {
      setMockHeaders({ host: 'www.toyotawaits.com', 'x-region': 'US' });
      const entries = await sitemap();

      expect(entries.some((e) => e.url === 'https://www.toyotawaits.com')).toBe(true);
      expect(entries.some((e) => e.url === 'https://www.toyotawaits.com/delivery-prep')).toBe(true);
      expect(entries.some((e) => e.url === 'https://www.toyotawaits.com/tires')).toBe(true);
      expect(entries.some((e) => e.url === 'https://www.toyotawaits.com/winter-prep')).toBe(true);
      expect(
        entries.some((e) => e.url === 'https://www.toyotawaits.com/guides/toyota-diy-maintenance-guide')
      ).toBe(true);

      expect(entries.some((e) => e.url.endsWith('/inventory'))).toBe(false);
      expect(entries.some((e) => e.url.endsWith('/tools/omvic-checker'))).toBe(false);
      expect(entries.some((e) => e.url.endsWith('/rav4/hev/bc'))).toBe(false);
    });
  });

  describe('3. US Inventory Notice & Header/Footer Brand Badges', () => {
    it('displays US crowdsourced allocation & ADM guidance banner when market === "US" and hides for "CA"', () => {
      const { unmount } = render(
        <MarketProvider initialMarket="US">
          <UsInventoryNotice />
        </MarketProvider>
      );

      const notice = screen.getByTestId('us-inventory-notice');
      expect(notice).toBeInTheDocument();
      expect(notice.textContent).toContain(
        'Live lot sweeps currently track Canadian dealerships (BC, ON, AB). In the US, use the Crowdsourced Allocation & ADM Log to check state-by-state dealer markups and transit timelines.'
      );
      expect(screen.getByTestId('us-inventory-log-cta')).toHaveAttribute('href', '/#log-feed');

      unmount();

      render(
        <MarketProvider initialMarket="CA">
          <UsInventoryNotice />
        </MarketProvider>
      );
      expect(screen.queryByTestId('us-inventory-notice')).toBeNull();
    });

    it('renders "ToyotaWaits" without ".ca" in Header and Footer when US market is active', () => {
      render(
        <MarketProvider initialMarket="US">
          <Header initialRegion="US" />
          <Footer initialRegion="US" />
        </MarketProvider>
      );

      const brandLink = screen.getAllByRole('link', { name: /ToyotaWaits/i })[0];
      expect(brandLink.textContent).toContain('ToyotaWaits');
      expect(brandLink.textContent).not.toContain('.ca');
    });
  });
});
