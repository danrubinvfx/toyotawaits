import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CorollaCrossVsRav4GuidePage, {
  generateMetadata as generateGuideMetadata,
} from '@/app/guides/toyota-corolla-cross-vs-rav4-hybrid/page';
import CorollaCrossHybridCalculatorPage, {
  metadata as calculatorMetadata,
} from '@/app/calculator/corolla-cross-hybrid/page';
import {
  getVehiclePresetById,
  COROLLA_CROSS_GAS_PRESET,
  COROLLA_CROSS_HYBRID_PRESET,
  VEHICLE_PRESETS,
} from '@/data/vehicle-presets';
import { buildAmazonAffiliateUrl } from '@/lib/gear/affiliate';

describe('Corolla Cross vs RAV4 Hybrid Guide & Calculator Route', () => {
  describe('1. Vehicle Presets & NRCan Benchmarks', () => {
    it('exports corolla-cross-gas preset with accurate pricing and fuel metrics', () => {
      expect(COROLLA_CROSS_GAS_PRESET).toBeDefined();
      expect(COROLLA_CROSS_GAS_PRESET.id).toBe('corolla-cross-gas');
      expect(COROLLA_CROSS_GAS_PRESET.pricing?.msrpCad).toBe(28500);
      expect(COROLLA_CROSS_GAS_PRESET.consumption.combinedL100km).toBe(7.4);
      expect(COROLLA_CROSS_GAS_PRESET.typicalWaitDays).toBe(90);
    });

    it('exports corolla-cross-hybrid preset with accurate pricing and fuel metrics', () => {
      expect(COROLLA_CROSS_HYBRID_PRESET).toBeDefined();
      expect(COROLLA_CROSS_HYBRID_PRESET.id).toBe('corolla-cross-hybrid');
      expect(COROLLA_CROSS_HYBRID_PRESET.pricing?.msrpCad).toBe(34500);
      expect(COROLLA_CROSS_HYBRID_PRESET.consumption.combinedL100km).toBe(5.3);
      expect(COROLLA_CROSS_HYBRID_PRESET.typicalWaitDays).toBe(270);
    });

    it('resolves preset by id and aliases via getVehiclePresetById', () => {
      expect(getVehiclePresetById('corolla-cross-hybrid')?.id).toBe('corolla-cross-hybrid');
      expect(getVehiclePresetById('corolla-cross')?.id).toBe('corolla-cross-hybrid');
      expect(getVehiclePresetById('corolla-cross-gas')?.id).toBe('corolla-cross-gas');
    });

    it('registers both presets in master VEHICLE_PRESETS array', () => {
      expect(VEHICLE_PRESETS.some((p) => p.id === 'corolla-cross-gas')).toBe(true);
      expect(VEHICLE_PRESETS.some((p) => p.id === 'corolla-cross-hybrid')).toBe(true);
    });
  });

  describe('2. Head-to-Head Comparison Guide Page', () => {
    it('generates compliant SEO metadata with canonical and title', () => {
      const meta = generateGuideMetadata();
      expect(meta.title).toBe(
        'Toyota Corolla Cross vs. RAV4 Hybrid (2026–2027): Sizing, Price & Canadian Wait Times | ToyotaWaits'
      );
      expect(meta.alternates?.canonical).toBe(
        'https://www.toyotawaits.ca/guides/toyota-corolla-cross-vs-rav4-hybrid'
      );
      expect(meta.description).toContain('Corolla Cross Hybrid and RAV4 Hybrid');
    });

    it('renders the head-to-head spec matrix and core sections', () => {
      render(<CorollaCrossVsRav4GuidePage />);

      // Title & Headings
      expect(
        screen.getByRole('heading', {
          name: /Toyota Corolla Cross vs\. RAV4 Hybrid \(2026–2027\)/i,
          level: 1,
        })
      ).toBeInTheDocument();

      expect(screen.getByText(/Head-to-Head Specification Matrix/i)).toBeInTheDocument();
      expect(screen.getByText(/Should You Settle for Corolla Cross or Step Up to RAV4\?/i)).toBeInTheDocument();
      expect(screen.getByText(/2026 vs\. 2027 Corolla Cross Rollover & Production Queue/i)).toBeInTheDocument();
      expect(screen.getByText(/Tracking Delivery Allocations Across Canada\?/i)).toBeInTheDocument();
      expect(screen.getByText(/Curated Day-1 Delivery Gear Shelf/i)).toBeInTheDocument();
    });

    it('renders outbound inventory action buttons', () => {
      render(<CorollaCrossVsRav4GuidePage />);

      const ccInventoryLink = screen.getByRole('link', { name: /Explore Corolla Cross Stock ↗/i });
      expect(ccInventoryLink).toHaveAttribute('href', '/inventory?model=Corolla%20Cross');

      const rav4InventoryLink = screen.getByRole('link', { name: /Explore RAV4 Stock ↗/i });
      expect(rav4InventoryLink).toHaveAttribute('href', '/inventory?model=RAV4');
    });

    it('renders curated day-1 gear with compliant Amazon affiliate links', () => {
      render(<CorollaCrossVsRav4GuidePage />);

      const tuxmatBtn = screen.getByRole('link', { name: /Search TuxMat on Amazon ↗/i });
      expect(tuxmatBtn).toHaveAttribute('target', '_blank');
      expect(tuxmatBtn).toHaveAttribute('rel', 'sponsored noopener noreferrer nofollow');
      expect(tuxmatBtn.getAttribute('href')).toContain('amazon.ca');
      expect(tuxmatBtn.getAttribute('href')).toContain('toyotawaits-20');

      const fitcamxBtn = screen.getByRole('link', { name: /Search FitcamX on Amazon ↗/i });
      expect(fitcamxBtn).toHaveAttribute('target', '_blank');
      expect(fitcamxBtn).toHaveAttribute('rel', 'sponsored noopener noreferrer nofollow');
    });
  });

  describe('3. Programmatic Calculator Route', () => {
    it('exports compliant SEO metadata and canonical url', () => {
      expect(calculatorMetadata.title).toBe(
        'Toyota Corolla Cross Hybrid Fuel Savings & Payback Calculator (2026–2027 Canada) | ToyotaWaits'
      );
      expect(calculatorMetadata.alternates?.canonical).toBe(
        'https://www.toyotawaits.ca/calculator/corolla-cross-hybrid'
      );
    });

    it('renders the calculator page layout and header', () => {
      render(<CorollaCrossHybridCalculatorPage />);

      expect(
        screen.getByRole('heading', {
          name: /Toyota Corolla Cross Hybrid Fuel Savings & Payback Calculator/i,
          level: 1,
        })
      ).toBeInTheDocument();

      expect(
        screen.getByText(/Calculation Methodology & Evidence Provenance/i)
      ).toBeInTheDocument();
    });
  });

  describe('4. Outbound Link Builder Compliance', () => {
    it('routes Amazon search queries to amazon.ca with Canadian associate tag toyotawaits-20', () => {
      const url = buildAmazonAffiliateUrl('TuxMat Toyota Corolla Cross', 'CA');
      expect(url).toContain('https://www.amazon.ca/s?k=');
      expect(url).toContain('tag=toyotawaits-20');
      expect(url).not.toContain('/dp/');
    });

    it('routes Amazon search queries to amazon.com with US associate tag toyotawaits07-20 when US market selected', () => {
      const url = buildAmazonAffiliateUrl('TuxMat Toyota Corolla Cross', 'US');
      expect(url).toContain('https://www.amazon.com/s?k=');
      expect(url).toContain('tag=toyotawaits07-20');
      expect(url).not.toContain('/dp/');
    });
  });
});
