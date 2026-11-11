import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  getCurrentPromoConfig,
  sortGearByPromotions,
} from '@/lib/gear/promotions';
import { buildAmazonAffiliateUrl } from '@/lib/gear/affiliate';
import { generateAllocationDropAlertEmail } from '@/lib/alerts/templates';
import type { GearItem } from '@/data/gear/catalog';

describe('Seasonal Promotion & Priority Sorter Engine', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns BFCM config for November 27 (new Date("2026-11-27"))', () => {
    const config = getCurrentPromoConfig(new Date('2026-11-27'));
    expect(config.season).toBe('BFCM');
    expect(config.isPromoActive).toBe(true);
    expect(config.badgeText).toBe('⚡ Black Friday Deal');
    expect(config.ctaText).toBe('Check Black Friday Price ↗');
    expect(config.bannerTitle).toContain('Black Friday & Cyber Week Deals Live');
  });

  it('returns BOXING_WEEK config for December 26 (new Date("2026-12-26"))', () => {
    const config = getCurrentPromoConfig(new Date('2026-12-26'));
    expect(config.season).toBe('BOXING_WEEK');
    expect(config.isPromoActive).toBe(true);
    expect(config.badgeText).toBe('🎁 Boxing Week Sale');
    expect(config.ctaText).toBe('View Boxing Day Deals ↗');
    expect(config.bannerTitle).toContain('Boxing Week Accessory Clearance');
  });

  it('returns WINTER_DEALS config for early November and mid-December', () => {
    const earlyNov = getCurrentPromoConfig(new Date('2026-11-05'));
    expect(earlyNov.season).toBe('WINTER_DEALS');
    expect(earlyNov.isPromoActive).toBe(true);
    expect(earlyNov.badgeText).toBe('❄️ Winter Sale');
    expect(earlyNov.ctaText).toBe('Check Winter Deals ↗');

    const midDec = getCurrentPromoConfig(new Date('2026-12-12'));
    expect(midDec.season).toBe('WINTER_DEALS');
    expect(midDec.isPromoActive).toBe(true);
  });

  it('falls back to STANDARD mode outside seasonal windows (new Date("2027-04-15"))', () => {
    const config = getCurrentPromoConfig(new Date('2027-04-15'));
    expect(config.season).toBe('STANDARD');
    expect(config.isPromoActive).toBe(false);
    expect(config.badgeText).toBe('⚡ Community Pick');
    expect(config.ctaText).toBe('Check Price on Amazon ↗');
  });

  it('places hero deal items and Day-1 Essentials at index 0 during promo dates', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-27T12:00:00Z'));

    const mockItems: GearItem[] = [
      {
        id: 'generic-organizer',
        title: 'Generic Tray',
        brand: 'Generic',
        category: 'Interior Protection',
        description: 'Standard organizer',
        searchQuery: 'toyota tray',
      },
      {
        id: 'muslogy-partner',
        title: 'Muslogy Mud Flaps',
        brand: 'Muslogy',
        category: 'Exterior & Utility',
        description: 'Direct partner mud flaps',
        searchQuery: 'muslogy mud flaps',
        discountCode: 'Toyotawaits',
      },
      {
        id: 'tuxmat-hero',
        title: 'TuxMat All-Weather Liners',
        brand: 'TuxMat',
        category: 'Day-1 Essential',
        isHeroDeal: true,
        description: 'Hero floor liners',
        searchQuery: 'tuxmat rav4',
      },
    ];

    const sorted = sortGearByPromotions(mockItems);
    expect(sorted[0].id).toBe('tuxmat-hero');
    expect(sorted[1].id).toBe('muslogy-partner');
    expect(sorted[2].id).toBe('generic-organizer');
  });

  it('preserves original order when no promotion is active (STANDARD mode)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2027-04-15T12:00:00Z'));

    const mockItems: GearItem[] = [
      {
        id: 'first-regular',
        title: 'Regular Item',
        brand: 'Generic',
        category: 'Interior Protection',
        description: 'Regular item',
        searchQuery: 'toyota regular',
      },
      {
        id: 'second-hero',
        title: 'Hero Item',
        brand: 'TuxMat',
        category: 'Day-1 Essential',
        isHeroDeal: true,
        description: 'Hero item',
        searchQuery: 'tuxmat rav4',
      },
    ];

    const sorted = sortGearByPromotions(mockItems);
    expect(sorted[0].id).toBe('first-regular');
    expect(sorted[1].id).toBe('second-hero');
  });

  it('renders "⚡ Black Friday Deals" and deal-filtered search links in drop alert emails during November', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-27T12:00:00Z'));

    const caEmail = generateAllocationDropAlertEmail({
      model: 'RAV4',
      trim: 'XSE AWD',
      vin: '2T3P1RFV5TC123456',
      dealerName: 'Jim Pattison Toyota Downtown',
      market: 'CA',
    });

    expect(caEmail.html).toContain('⚡ Black Friday Deals for Your RAV4');
    expect(caEmail.html).toContain('[ Black Friday Deal ]');
    expect(caEmail.html).toContain('Check Black Friday Price ↗');
    expect(caEmail.text).toContain('⚡ Black Friday Deals for Your RAV4');
    expect(caEmail.text).toContain('[ Black Friday Deal ]');

    for (const pick of caEmail.gearPicks) {
      expect(pick.url).toContain('https://www.amazon.ca/s?k=');
      expect(pick.url).toContain('tag=toyotawaits-20');
      expect(pick.url).toContain('rh=p_n_deal_type%3A23566065011');
      expect(pick.buttonLabel).toBe('Check Black Friday Price ↗');
    }

    const usEmail = generateAllocationDropAlertEmail({
      model: 'RAV4',
      trim: 'XSE AWD',
      vin: '2T3P1RFV5TC123456',
      dealerName: 'Seattle Toyota',
      market: 'US',
    });

    for (const pick of usEmail.gearPicks) {
      expect(pick.url).toContain('https://www.amazon.com/s?k=');
      expect(pick.url).toContain('tag=toyotawaits07-20');
      expect(pick.url).toContain('rh=p_n_deal_type%3A23566065011');
    }
  });

  it('maintains compliant CA and US Associate tags and dealFilter behavior in buildAmazonAffiliateUrl', () => {
    const caDealUrl = buildAmazonAffiliateUrl({
      searchQuery: 'TuxMat Toyota RAV4',
      countryCode: 'CA',
      dealFilter: true,
    });
    expect(caDealUrl).toContain('https://www.amazon.ca/s?k=');
    expect(caDealUrl).toContain('tag=toyotawaits-20');
    expect(caDealUrl).toContain('&rh=p_n_deal_type%3A23566065011');

    const usDealUrl = buildAmazonAffiliateUrl({
      searchQuery: 'TuxMat Toyota RAV4',
      countryCode: 'US',
      dealFilter: true,
    });
    expect(usDealUrl).toContain('https://www.amazon.com/s?k=');
    expect(usDealUrl).toContain('tag=toyotawaits07-20');
    expect(usDealUrl).toContain('&rh=p_n_deal_type%3A23566065011');

    const standardUrl = buildAmazonAffiliateUrl({
      searchQuery: 'TuxMat Toyota RAV4',
      countryCode: 'CA',
      dealFilter: false,
    });
    expect(standardUrl).toContain('tag=toyotawaits-20');
    expect(standardUrl).not.toContain('rh=p_n_deal_type%3A23566065011');
  });
});
