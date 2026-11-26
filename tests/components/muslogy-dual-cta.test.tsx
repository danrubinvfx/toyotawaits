import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MarketProvider } from '@/context/MarketContext';
import { GearCard } from '@/components/gear/GearCard';
import { CalculatorGearCards } from '@/components/gear/CalculatorGearCards';
import { WhileYouWaitGear } from '@/components/submission/WhileYouWaitGear';
import { InventoryGearCard } from '@/components/discovery/InventoryGearCard';
import { ESSENTIAL_ACCESSORIES } from '@/data/accessories';
import * as vercelAnalytics from '@vercel/analytics';
import * as telemetry from '@/lib/gear/telemetry';

vi.mock('@vercel/analytics', () => ({
  track: vi.fn(),
}));

vi.mock('@/lib/gear/telemetry', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/gear/telemetry')>();
  return {
    ...actual,
    trackAffiliateClick: vi.fn(),
  };
});

describe('Muslogy Dual-CTA Split Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GearCard renders primary Muslogy CTA and secondary Amazon CA fallback link with separate telemetry', () => {
    render(
      <MarketProvider initialMarket="CA">
        <GearCard
          item={{
            id: 'muslogy-rav4-organizer',
            slug: 'muslogy-rav4',
            title: 'Console Organizer',
            brand: 'Muslogy',
            category: 'Cabin Organization',
            destinationType: 'direct_partner',
            discountCode: 'Toyotawaits',
            destinationUrl: '/out/muslogy-rav4',
            amazonFallbackQuery: 'Muslogy center console organizer Toyota RAV4',
          }}
          placement="guide_rav4_mods"
          showCheckbox={false}
        />
      </MarketProvider>
    );

    const primary = screen.getByRole('link', { name: /Get 2% Off on Muslogy/i });
    const secondary = screen.getByRole('link', { name: /or Check Prime Price on Amazon/i });

    expect(primary).toHaveAttribute('href', '/out/muslogy-rav4');
    expect(secondary).toHaveAttribute(
      'href',
      'https://www.amazon.ca/s?k=Muslogy%20center%20console%20organizer%20Toyota%20RAV4&tag=toyotawaits-20'
    );
    expect(secondary).toHaveAttribute('rel', 'sponsored noopener noreferrer nofollow');

    fireEvent.click(primary);
    expect(vercelAnalytics.track).toHaveBeenCalledWith(
      'muslogy_gear_clicked',
      expect.objectContaining({
        accessoryId: 'muslogy-rav4-organizer',
        channel: 'muslogy_direct',
      })
    );

    fireEvent.click(secondary);
    expect(vercelAnalytics.track).toHaveBeenCalledWith(
      'muslogy_gear_clicked',
      expect.objectContaining({
        accessoryId: 'muslogy-rav4-organizer-amazon',
        channel: 'amazon_prime_alt',
      })
    );
    expect(vercelAnalytics.track).toHaveBeenCalledWith(
      'affiliate_gear_clicked',
      expect.objectContaining({
        accessoryId: 'muslogy-rav4-organizer-amazon',
        channel: 'amazon_prime_alt',
      })
    );
    expect(telemetry.trackAffiliateClick).toHaveBeenCalledWith(
      expect.objectContaining({
        accessory_id: 'muslogy-rav4-organizer-amazon',
        placement: 'guide_rav4_mods',
      })
    );
  });

  it('GearCard routes secondary Amazon link to amazon.com with toyotawaits07-20 for US market', () => {
    render(
      <MarketProvider initialMarket="US">
        <GearCard
          item={{
            id: 'muslogy-armrest-cover',
            slug: 'muslogy-armrest-cover',
            title: 'Armrest Cover',
            brand: 'Muslogy',
            category: 'Comfort',
            destinationType: 'direct_partner',
            discountCode: 'Toyotawaits',
            destinationUrl: '/out/muslogy-armrest-cover',
          }}
          placement="guide_rav4_mods"
          showCheckbox={false}
        />
      </MarketProvider>
    );

    const secondary = screen.getByRole('link', { name: /or Check Prime Price on Amazon/i });
    expect(secondary).toHaveAttribute(
      'href',
      'https://www.amazon.com/s?k=Muslogy%20center%20console%20armrest%20cover%20Toyota%20RAV4&tag=toyotawaits07-20'
    );
  });

  it('CalculatorGearCards renders secondary Amazon Prime link on Muslogy card', () => {
    render(
      <MarketProvider initialMarket="CA">
        <CalculatorGearCards activeModel="rav4" />
      </MarketProvider>
    );

    const secondary = screen.getByRole('link', { name: /or Check Prime Price on Amazon/i });
    expect(secondary).toHaveAttribute(
      'href',
      'https://www.amazon.ca/s?k=Muslogy%20center%20console%20organizer%20Toyota%20RAV4&tag=toyotawaits-20'
    );
    fireEvent.click(secondary);
    expect(vercelAnalytics.track).toHaveBeenCalledWith(
      'muslogy_gear_clicked',
      expect.objectContaining({
        accessoryId: 'rav4-console-organizer-amazon',
        channel: 'amazon_prime_alt',
      })
    );
  });

  it('WhileYouWaitGear renders secondary Amazon Prime link on Muslogy items', () => {
    render(
      <MarketProvider initialMarket="CA">
        <WhileYouWaitGear modelName="RAV4" />
      </MarketProvider>
    );

    const secondaryLinks = screen.getAllByRole('link', { name: /or Check Prime Price on Amazon/i });
    expect(secondaryLinks.length).toBeGreaterThan(0);
    expect(secondaryLinks[0].getAttribute('href')).toContain('https://www.amazon.ca/s?k=');
    expect(secondaryLinks[0].getAttribute('href')).toContain('tag=toyotawaits-20');
  });

  it('InventoryGearCard renders secondary Amazon Prime link on Muslogy item', () => {
    const muslogyItem = ESSENTIAL_ACCESSORIES.find((i) => i.id === 'muslogy-rav4-organizer')!;
    render(
      <MarketProvider initialMarket="CA">
        <InventoryGearCard item={muslogyItem} modelContext="RAV4" />
      </MarketProvider>
    );

    const secondary = screen.getByRole('link', { name: /or Check Prime Price on Amazon/i });
    expect(secondary).toHaveAttribute(
      'href',
      'https://www.amazon.ca/s?k=Muslogy%20center%20console%20organizer%20Toyota%20RAV4&tag=toyotawaits-20'
    );
  });
});
