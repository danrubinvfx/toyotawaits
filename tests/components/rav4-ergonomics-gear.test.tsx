import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GEAR_MARKET_CATALOG, getGearMarketConfig } from '@/data/gear/catalog';
import { ESSENTIAL_ACCESSORIES, getAccessoriesForModel } from '@/data/accessories';
import { WhileYouWaitGear } from '@/components/submission/WhileYouWaitGear';
import { DeliveryPrepChecklist } from '@/components/dashboard/delivery-prep-checklist';
import Rav4ModsGuidePage from '@/app/guides/rav4-mods/page';
import { MarketProvider } from '@/context/MarketContext';
import * as telemetryModule from '@/lib/gear/telemetry';

vi.mock('@/lib/gear/telemetry', async () => {
  const actual = await vi.importActual<typeof import('@/lib/gear/telemetry')>('@/lib/gear/telemetry');
  return {
    ...actual,
    trackAffiliateClick: vi.fn(),
  };
});

describe('RAV4 Interior Comfort & Ergonomics Gear Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('1. Catalog & Affiliate Updates (catalog.ts & accessories.ts)', () => {
    it('contains custom-fit padded armrest cover in GEAR_MARKET_CATALOG with CA and US tags', () => {
      const item = GEAR_MARKET_CATALOG['rav4-padded-armrest-cover'];
      expect(item).toBeDefined();
      expect(item.title).toBe('Custom-Fit Padded Center Console Armrest Cover');
      expect(item.badge).toBe('Long-Drive Pick');
      expect(item.searchKeywordsCA).toContain('Toyota RAV4');
      expect(item.searchKeywordsCA).toContain('armrest cover');
      expect(item.searchKeywordsUS).toContain('Toyota RAV4');
      expect(item.isDeliveryDayEssential).toBe(true);
    });

    it('contains lateral console edge knee cushion in GEAR_MARKET_CATALOG', () => {
      const item = GEAR_MARKET_CATALOG['lateral-console-knee-cushion'];
      expect(item).toBeDefined();
      expect(item.title).toBe('Driver Side Console Edge Leather Knee Cushion');
      expect(item.badge).toBe('Road Trip Essential');
      expect(item.searchKeywordsCA).toContain('knee cushion pad');
      expect(item.isDeliveryDayEssential).toBe(true);
    });

    it('contains both items in ESSENTIAL_ACCESSORIES with comfort category and applicable models', () => {
      const armrest = ESSENTIAL_ACCESSORIES.find((a) => a.id === 'rav4-padded-armrest-cover');
      expect(armrest).toBeDefined();
      expect(armrest?.category).toBe('comfort');
      expect(armrest?.applicableModels).toContain('rav4');
      expect(armrest?.applicableModels).toContain('rav4-hybrid');
      expect(armrest?.applicableModels).toContain('rav4-prime');
      expect(armrest?.applicableModels).toContain('universal');
      expect(armrest?.badge).toBe('Long-Drive Pick');
      expect(armrest?.estimatedPriceCad).toBe('$24 – $32 CAD');
      expect(armrest?.url).toContain('tag=toyotawaits-20');

      const knee = ESSENTIAL_ACCESSORIES.find((a) => a.id === 'lateral-console-knee-cushion');
      expect(knee).toBeDefined();
      expect(knee?.category).toBe('comfort');
      expect(knee?.applicableModels).toContain('rav4');
      expect(knee?.applicableModels).toContain('rav4-hybrid');
      expect(knee?.applicableModels).toContain('rav4-prime');
      expect(knee?.applicableModels).toContain('universal');
      expect(knee?.badge).toBe('Road Trip Essential');
      expect(knee?.estimatedPriceCad).toBe('$14 – $19 CAD');
      expect(knee?.url).toContain('tag=toyotawaits-20');
    });
  });

  describe('2. Cross-Link to Post-Submission "While You Wait" Modal', () => {
    it('includes both comfort items in rotation when a user logs a RAV4 order', () => {
      const items = getAccessoriesForModel('RAV4');
      const armrest = items.find((i) => i.id === 'rav4-padded-armrest-cover');
      const knee = items.find((i) => i.id === 'lateral-console-knee-cushion');

      expect(armrest).toBeDefined();
      expect(knee).toBeDefined();
      expect(armrest?.title).toBe('Custom-Fit Padded Center Console Armrest Cover');
      expect(knee?.title).toBe('Driver Side Console Edge Leather Knee Cushion');
    });

    it('renders both comfort items in WhileYouWaitGear component for RAV4', () => {
      render(<WhileYouWaitGear modelName="RAV4" />);

      expect(screen.getByText('Custom-Fit Padded Center Console Armrest Cover')).toBeInTheDocument();
      expect(screen.getByText('Driver Side Console Edge Leather Knee Cushion')).toBeInTheDocument();
      expect(screen.getAllByText('$24 – $32 CAD').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('$14 – $19 CAD')).toBeInTheDocument();
    });

    it('triggers affiliate telemetry click with while_you_wait placement tag', () => {
      render(<WhileYouWaitGear modelName="RAV4" />);

      const links = screen.getAllByRole('link', { name: /View .* on Amazon/i });
      const armrestLink = links.find((l) =>
        l.getAttribute('aria-label')?.includes('Custom-Fit Padded Center Console Armrest Cover')
      );
      expect(armrestLink).toBeDefined();

      fireEvent.click(armrestLink!);

      expect(telemetryModule.trackAffiliateClick).toHaveBeenCalledWith(
        expect.objectContaining({
          accessory_id: 'rav4-padded-armrest-cover',
          placement: 'while_you_wait',
          model_context: 'RAV4',
        })
      );
    });
  });

  describe('3. Wait-Times Gear Shelf (Comfort Filter Tab)', () => {
    it('displays both comfort products under the Comfort filter tab on RAV4 gear shelf', () => {
      render(
        <MarketProvider>
          <DeliveryPrepChecklist model="rav4" />
        </MarketProvider>
      );

      // Find and click the Comfort filter tab
      const comfortTab = screen.getByRole('button', { name: /🛋️ Comfort/i });
      expect(comfortTab).toBeInTheDocument();
      fireEvent.click(comfortTab);

      // Both items should be rendered
      expect(
        screen.getAllByText(/Custom-Fit Padded Center Console Armrest Cover/i)[0]
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Driver Side Console Edge Leather Knee Cushion/i)
      ).toBeInTheDocument();

      // Verify badges
      expect(screen.getByText('Long-Drive Pick')).toBeInTheDocument();
      expect(screen.getByText('Road Trip Essential')).toBeInTheDocument();
    });
  });

  describe('4. RAV4 Mod & Lifestyle Guide (/guides/rav4-mods)', () => {
    it('renders the Cabin Ergonomics & Long-Distance Comfort (Stage 1.5) section', () => {
      render(
        <MarketProvider>
          <Rav4ModsGuidePage />
        </MarketProvider>
      );

      // Header check
      expect(
        screen.getByRole('heading', {
          name: /Cabin Ergonomics & Long-Distance Comfort \(Stage 1\.5\)/i,
        })
      ).toBeInTheDocument();

      // Exact problem statement check
      expect(
        screen.getByText(
          /The 5th-generation RAV4 cockpit features firm plastics right where the driver's right leg rests against the center stack tunnel, coupled with a firm factory armrest that quickly wears under daily commuting\./i
        )
      ).toBeInTheDocument();

      // Quick fixes check
      expect(screen.getByText(/Fix 1: Console Armrest Sleeve/i)).toBeInTheDocument();
      expect(screen.getByText(/Fix 2: Tunnel Knee Pad Cushion/i)).toBeInTheDocument();

      // Check Price ↗ buttons check
      const checkPriceButtons = screen.getAllByRole('link', { name: /Check Price ↗/i });
      expect(checkPriceButtons.length).toBeGreaterThanOrEqual(2);

      // FTC disclosure check
      expect(
        screen.getByText(
          /As an Amazon Associate, ToyotaWaits earns from qualifying purchases\. Real-time pricing and stock verified on Amazon\.ca and Amazon\.com\./i
        )
      ).toBeInTheDocument();
    });

    it('renders Muslogy partner items in Section 1.5 with 2% discount code and official deep-links', () => {
      render(
        <MarketProvider>
          <Rav4ModsGuidePage />
        </MarketProvider>
      );

      // Verify Muslogy items rendered in Section 1.5
      expect(
        screen.getByText('Muslogy Custom-Fit Padded Center Console Armrest Cover')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Muslogy Dual-Tier Drop-In Organizer Tray (RAV4)')
      ).toBeInTheDocument();

      // Verify discount pills and CTAs
      const muslogyButtons = screen.getAllByRole('link', { name: /Get 2% Off on Muslogy ↗/i });
      expect(muslogyButtons.length).toBeGreaterThanOrEqual(2);
      muslogyButtons.forEach((link) => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'sponsored noopener noreferrer');
        expect(link.getAttribute('href')).toMatch(/\/out\/muslogy-(rav4|armrest-cover)/);
      });
    });

    it('triggers telemetry with placement "guide_rav4_mods" when clicking guide gear cards', () => {
      render(
        <MarketProvider>
          <Rav4ModsGuidePage />
        </MarketProvider>
      );

      const checkPriceButtons = screen.getAllByRole('link', { name: /Check Price ↗/i });
      fireEvent.click(checkPriceButtons[0]);

      expect(telemetryModule.trackAffiliateClick).toHaveBeenCalledWith(
        expect.objectContaining({
          placement: 'guide_rav4_mods',
          model_context: 'rav4',
        })
      );
    });
  });
});
