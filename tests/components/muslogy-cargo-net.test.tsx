import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GEAR_MARKET_CATALOG } from '@/data/gear/catalog';
import { ESSENTIAL_ACCESSORIES } from '@/data/accessories';
import { DeliveryPrepChecklist } from '@/components/dashboard/delivery-prep-checklist';
import DeliveryPrepPage from '@/app/delivery-prep/page';
import { MarketProvider } from '@/context/MarketContext';
import { GET, MUSLOGY_DIRECT_URLS } from '@/app/out/[slug]/route';
import { NextRequest } from 'next/server';

describe('Muslogy Cargo Nets Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('1. Catalog Registration', () => {
    it('registers Muslogy cargo nets in GEAR_MARKET_CATALOG with direct_partner destination', () => {
      const rav4Net = GEAR_MARKET_CATALOG['muslogy-rav4-cargo-net'];
      expect(rav4Net).toBeDefined();
      expect(rav4Net.title).toContain('Muslogy Heavy-Duty Trunk Cargo Net');
      expect(rav4Net.brand).toBe('Muslogy');
      expect(rav4Net.category).toBe('Cargo & Utility');
      expect(rav4Net.destinationType).toBe('direct_partner');
      expect(rav4Net.discountCode).toBe('Toyotawaits');
      expect(rav4Net.discountPercent).toBe(2);
      expect(rav4Net.destinationUrl).toBe('/out/muslogy-rav4-cargo-net');
      expect(rav4Net.buttonLabel).toBe('Get 2% Off on Muslogy ↗');
      expect(rav4Net.imageUrl).toBe('/assets/gear/muslogy-rav4-cargo-net.webp');

      const siennaNet = GEAR_MARKET_CATALOG['muslogy-sienna-cargo-net'];
      expect(siennaNet).toBeDefined();
      expect(siennaNet.destinationUrl).toBe('/out/muslogy-sienna-cargo-net');
      expect(siennaNet.imageUrl).toBe('/assets/gear/muslogy-sienna-cargo-net.webp');

      const ghNet = GEAR_MARKET_CATALOG['muslogy-grand-highlander-cargo-net'];
      expect(ghNet).toBeDefined();
      expect(ghNet.destinationUrl).toBe('/out/muslogy-grand-highlander-cargo-net');
    });

    it('registers Muslogy cargo nets in ESSENTIAL_ACCESSORIES with partner badges', () => {
      const rav4Net = ESSENTIAL_ACCESSORIES.find((a) => a.id === 'muslogy-rav4-cargo-net');
      expect(rav4Net).toBeDefined();
      expect(rav4Net?.brand).toBe('Muslogy');
      expect(rav4Net?.badge).toBe('Partner Deal · 2% Off');
      expect(rav4Net?.url).toBe('/out/muslogy-rav4-cargo-net');
      expect(rav4Net?.discountCode).toBe('Toyotawaits');

      const siennaNet = ESSENTIAL_ACCESSORIES.find((a) => a.id === 'muslogy-sienna-cargo-net');
      expect(siennaNet).toBeDefined();
      expect(siennaNet?.url).toBe('/out/muslogy-sienna-cargo-net');

      const ghNet = ESSENTIAL_ACCESSORIES.find((a) => a.id === 'muslogy-grand-highlander-cargo-net');
      expect(ghNet).toBeDefined();
      expect(ghNet?.url).toBe('/out/muslogy-grand-highlander-cargo-net');
    });
  });

  describe('2. Outbound Proxy Handler (/out/[slug])', () => {
    it('maps cargo net slugs directly to the Muslogy discount cargo collection endpoint', () => {
      const targetUrl = 'https://muslogy.net/discount/Toyotawaits?redirect=/collections/cargo-net&rs_ref=3f6lkniA';
      expect(MUSLOGY_DIRECT_URLS['muslogy-rav4-cargo-net']).toBe(targetUrl);
      expect(MUSLOGY_DIRECT_URLS['muslogy-sienna-cargo-net']).toBe(targetUrl);
      expect(MUSLOGY_DIRECT_URLS['muslogy-cargo-net']).toBe(targetUrl);
      expect(MUSLOGY_DIRECT_URLS['muslogy-grand-highlander-cargo-net']).toBe(targetUrl);
    });

    it('returns a 307 temporary redirect with strict security headers', async () => {
      const req = new NextRequest('http://localhost:3000/out/muslogy-rav4-cargo-net');
      const res = await GET(req, { params: Promise.resolve({ slug: 'muslogy-rav4-cargo-net' }) });

      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe(
        'https://muslogy.net/discount/Toyotawaits?redirect=/collections/cargo-net&rs_ref=3f6lkniA'
      );
      expect(res.headers.get('cache-control')).toContain('no-store');
      expect(res.headers.get('referrer-policy')).toBe('strict-origin-when-cross-origin');
    });
  });

  describe('3. Homepage Gear Carousel & Cargo Filter Tab', () => {
    it('renders Muslogy cargo net under the Cargo & Utility category tab for RAV4', () => {
      render(
        <MarketProvider>
          <DeliveryPrepChecklist model="rav4" />
        </MarketProvider>
      );

      // Find and click the "Cargo & Utility" tab
      const cargoTab = screen.getAllByRole('button', { name: /Cargo & Utility/i })[0];
      expect(cargoTab).toBeInTheDocument();
      fireEvent.click(cargoTab);

      // Should render the Muslogy RAV4 Cargo Net
      expect(screen.getByText('Muslogy Heavy-Duty Trunk Cargo Net (RAV4)')).toBeInTheDocument();
      expect(screen.getAllByText(/CODE:/i).length).toBeGreaterThanOrEqual(1);

      // Verify link attributes
      const partnerLink = screen.getAllByRole('link', { name: /Get 2% Off on Muslogy/i })[0];
      expect(partnerLink).toHaveAttribute('href', '/out/muslogy-rav4-cargo-net');
      expect(partnerLink).toHaveAttribute('target', '_blank');
      expect(partnerLink).toHaveAttribute('rel', 'sponsored noopener noreferrer');
    });

    it('renders Muslogy Sienna cargo net under the Cargo & Utility tab when Sienna is selected', () => {
      render(
        <MarketProvider>
          <DeliveryPrepChecklist model="sienna" />
        </MarketProvider>
      );

      const cargoTab = screen.getAllByRole('button', { name: /Cargo & Utility/i })[0];
      fireEvent.click(cargoTab);

      expect(screen.getByText('Muslogy Heavy-Duty Trunk Cargo Net (Sienna)')).toBeInTheDocument();
      const siennaLink = screen.getAllByRole('link', { name: /Get 2% Off on Muslogy/i })[0];
      expect(siennaLink).toHaveAttribute('href', '/out/muslogy-sienna-cargo-net');
    });
  });

  describe('4. Delivery Day Prep Checklist Page (/delivery-prep)', () => {
    it('renders the Cargo & Trunk Organization section with Muslogy cargo net gear cards', () => {
      render(
        <MarketProvider>
          <DeliveryPrepPage />
        </MarketProvider>
      );

      // Check section header
      expect(screen.getByRole('heading', { name: /Cargo & Trunk Organization/i })).toBeInTheDocument();

      // Check all 3 cargo nets are rendered
      expect(screen.getByText('Muslogy Heavy-Duty Trunk Cargo Net (RAV4)')).toBeInTheDocument();
      expect(screen.getByText('Muslogy Heavy-Duty Trunk Cargo Net (Sienna)')).toBeInTheDocument();
      expect(screen.getByText('Muslogy Heavy-Duty Trunk Cargo Net (Grand Highlander)')).toBeInTheDocument();

      // Check discount copy code buttons
      const copyButtons = screen.getAllByRole('button', { name: /Copy discount code Toyotawaits/i });
      expect(copyButtons.length).toBeGreaterThanOrEqual(3);
    });
  });
});
