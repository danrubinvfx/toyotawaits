import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NextRequest } from 'next/server';
import {
  getTradeInAffiliateUrl,
  getTireRetailerAffiliateUrl,
  getDirectBrandPartnerUrl,
  CA_TRADEIN_FALLBACK_URL,
  US_TRADEIN_FALLBACK_URL,
  CA_TIRE_FALLBACK_URL,
  US_TIRE_FALLBACK_URL,
  MUSLOGY_DIRECT_PARTNER_URL,
} from '@/config/affiliates';
import { getCuratedGearShelf } from '@/data/gear/catalog';
import { TradeInValuationCard } from '@/components/discovery/TradeInValuationCard';
import { OntarioInsuranceCard } from '@/components/discovery/OntarioInsuranceCard';
import DeliveryPrepPage from '@/app/delivery-prep/page';
import TiresPage from '@/app/tires/page';
import { GET as outSlugGet } from '@/app/out/[slug]/route';
import * as gearLib from '@/lib/gear';

describe('Phase 2 Monetization Diversification', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
    delete process.env.NEXT_PUBLIC_CA_TRADEIN_AFFILIATE_URL;
    delete process.env.NEXT_PUBLIC_US_TRADEIN_AFFILIATE_URL;
    delete process.env.NEXT_PUBLIC_CA_TIRE_AFFILIATE_URL;
    delete process.env.NEXT_PUBLIC_US_TIRE_AFFILIATE_URL;
    delete process.env.NEXT_PUBLIC_TUXMAT_AFFILIATE_URL;
    delete process.env.NEXT_PUBLIC_FITCAMX_AFFILIATE_URL;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe('1. Centralized Affiliate Resolvers & Env Overrides', () => {
    it('resolves getTradeInAffiliateUrl defaults and env overrides for CA and US', () => {
      expect(getTradeInAffiliateUrl('CA')).toBe(CA_TRADEIN_FALLBACK_URL);
      expect(getTradeInAffiliateUrl('US')).toBe(US_TRADEIN_FALLBACK_URL);

      process.env.NEXT_PUBLIC_CA_TRADEIN_AFFILIATE_URL = 'https://partner.example.ca/sell';
      process.env.NEXT_PUBLIC_US_TRADEIN_AFFILIATE_URL = 'https://partner.example.com/sell';

      expect(getTradeInAffiliateUrl('CA')).toBe('https://partner.example.ca/sell');
      expect(getTradeInAffiliateUrl('US')).toBe('https://partner.example.com/sell');
    });

    it('resolves getTireRetailerAffiliateUrl defaults, tireSize param, and env overrides', () => {
      expect(getTireRetailerAffiliateUrl('CA')).toBe(CA_TIRE_FALLBACK_URL);
      expect(getTireRetailerAffiliateUrl('US')).toBe(US_TIRE_FALLBACK_URL);
      expect(getTireRetailerAffiliateUrl('CA', '225/65R17')).toContain('size=225%2F65R17');

      process.env.NEXT_PUBLIC_CA_TIRE_AFFILIATE_URL = 'https://tires.example.ca/';
      process.env.NEXT_PUBLIC_US_TIRE_AFFILIATE_URL = 'https://tires.example.com/';

      expect(getTireRetailerAffiliateUrl('CA')).toBe('https://tires.example.ca/');
      expect(getTireRetailerAffiliateUrl('US')).toBe('https://tires.example.com/');
    });

    it('resolves getDirectBrandPartnerUrl for muslogy, tuxmat, and fitcamx with env overrides', () => {
      expect(getDirectBrandPartnerUrl('muslogy', 'CA')).toBe(MUSLOGY_DIRECT_PARTNER_URL);
      expect(getDirectBrandPartnerUrl('tuxmat', 'CA')).toBe('https://www.tuxmat.ca');
      expect(getDirectBrandPartnerUrl('tuxmat', 'US')).toBe('https://www.tuxmat.com');
      expect(getDirectBrandPartnerUrl('fitcamx', 'CA')).toBe('https://fitcamx.com');

      process.env.NEXT_PUBLIC_TUXMAT_AFFILIATE_URL = 'https://tuxmat.partner.link/ref';
      process.env.NEXT_PUBLIC_FITCAMX_AFFILIATE_URL = 'https://fitcamx.partner.link/ref';

      expect(getDirectBrandPartnerUrl('tuxmat', 'CA')).toBe('https://tuxmat.partner.link/ref');
      expect(getDirectBrandPartnerUrl('fitcamx', 'US')).toBe('https://fitcamx.partner.link/ref');
    });
  });

  describe('2. Curated Gear Shelves (3–5 High-Conviction Picks)', () => {
    it('returns 3 to 5 picks per context and surfaces Muslogy 2% Off badge', () => {
      const deliveryShelf = getCuratedGearShelf('delivery-prep', 'rav4');
      expect(deliveryShelf.length).toBeGreaterThanOrEqual(3);
      expect(deliveryShelf.length).toBeLessThanOrEqual(5);
      expect(deliveryShelf[0].badge).toMatch(/2% Off/i);

      const calcShelf = getCuratedGearShelf('calculator', 'sienna');
      expect(calcShelf.length).toBeGreaterThanOrEqual(3);
      expect(calcShelf.length).toBeLessThanOrEqual(5);

      const tiresShelf = getCuratedGearShelf('tires');
      expect(tiresShelf.length).toBeGreaterThanOrEqual(3);
      expect(tiresShelf.length).toBeLessThanOrEqual(5);
    });
  });

  describe('3. TradeInValuationCard & BC Insurance Exclusion', () => {
    it('renders TradeInValuationCard with compliant affiliate attributes and /out/trade-in-quote', () => {
      const trackSpy = vi.spyOn(gearLib, 'trackAffiliateClick').mockImplementation(() => {});

      render(<TradeInValuationCard modelContext="RAV4 Hybrid" />);

      expect(screen.getByText(/Maximize Your Trade-In Equity/i)).toBeInTheDocument();
      expect(screen.getByText('Trading in your current car on delivery day?')).toBeInTheDocument();
      expect(
        screen.getByText(/Check an instant cash valuation before visiting the dealer finance desk/i)
      ).toBeInTheDocument();

      const cta = screen.getByTestId('trade-in-valuation-cta');
      expect(cta).toHaveAttribute('href', '/out/trade-in-quote');
      expect(cta).toHaveAttribute('target', '_blank');
      expect(cta).toHaveAttribute('rel', 'sponsored noopener noreferrer nofollow');

      fireEvent.click(cta);
      expect(trackSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          accessory_id: 'trade-in-quote',
          target_url: '/out/trade-in-quote',
        })
      );
    });

    it('strictly excludes BC from private auto insurance comparison cards while allowing ON and US', () => {
      const { rerender } = render(<OntarioInsuranceCard region="BC" />);
      expect(screen.queryByTestId('ontario-insurance-card')).toBeNull();

      rerender(<OntarioInsuranceCard region="British Columbia" />);
      expect(screen.queryByTestId('ontario-insurance-card')).toBeNull();

      rerender(<OntarioInsuranceCard region="ON" />);
      expect(screen.getByTestId('ontario-insurance-card')).toBeInTheDocument();

      rerender(<OntarioInsuranceCard region="US" />);
      expect(screen.getByTestId('ontario-insurance-card')).toBeInTheDocument();
    });
  });

  describe('4. Page Mounts & /out/[slug] Proxy Routing', () => {
    it('mounts TradeInValuationCard on /delivery-prep', async () => {
      render(await DeliveryPrepPage());
      expect(screen.getByTestId('trade-in-valuation-card')).toBeInTheDocument();
      expect(screen.getByTestId('trade-in-valuation-cta')).toHaveAttribute(
        'href',
        '/out/trade-in-quote'
      );
    });

    it('renders installed winter tire & rim package CTA card on /tires', () => {
      render(<TiresPage />);
      expect(screen.getByText('Compare Installed Winter Tire & Rim Packages')).toBeInTheDocument();

      const caLink = screen.getByTestId('tire-retailer-ca-cta');
      expect(caLink).toHaveAttribute('href', '/out/tire-retailer-ca');
      expect(caLink).toHaveAttribute('rel', 'sponsored noopener noreferrer nofollow');

      const usLink = screen.getByTestId('tire-retailer-us-cta');
      expect(usLink).toHaveAttribute('href', '/out/tire-retailer-us');
      expect(usLink).toHaveAttribute('rel', 'sponsored noopener noreferrer nofollow');
    });

    it('redirects new /out/[slug] CPA, tire, and direct brand slugs with 307', async () => {
      const cases: Array<[string, string]> = [
        ['trade-in-quote', CA_TRADEIN_FALLBACK_URL],
        ['tire-retailer-ca', CA_TIRE_FALLBACK_URL],
        ['tire-retailer-us', US_TIRE_FALLBACK_URL],
        ['tuxmat-direct', 'https://www.tuxmat.ca/'],
        ['fitcamx-direct', 'https://fitcamx.com/'],
        ['muslogy-direct', MUSLOGY_DIRECT_PARTNER_URL],
      ];

      for (const [slug, expectedLocation] of cases) {
        const req = new NextRequest(`https://www.toyotawaits.ca/out/${slug}?opt_out=true`);
        const res = await outSlugGet(req, { params: Promise.resolve({ slug }) });
        expect(res.status).toBe(307);
        expect(res.headers.get('location')).toBe(expectedLocation);
      }
    });
  });
});
