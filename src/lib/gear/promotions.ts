import { GearItem } from '@/data/gear/catalog';

export type PromoSeason = 'BFCM' | 'HOLIDAY_WINTER' | 'BOXING_WEEK' | 'STANDARD';

export interface ActivePromoConfig {
  season: PromoSeason;
  badgeText: string;
  badgeColorClass: string;
  ctaText: string;
  bannerTitle: string;
  bannerSubtitle: string;
  isPromoActive: boolean;
  applyDealFilter: boolean;
}

export function getCurrentPromoConfig(currentDate: Date = new Date()): ActivePromoConfig {
  // Handle ISO date-only strings (e.g. new Date('2026-11-27')) which parse as UTC midnight
  const isUtcMidnight =
    currentDate.getUTCHours() === 0 &&
    currentDate.getUTCMinutes() === 0 &&
    currentDate.getUTCSeconds() === 0 &&
    currentDate.getUTCMilliseconds() === 0;
  const month = isUtcMidnight ? currentDate.getUTCMonth() : currentDate.getMonth(); // 0 = Jan, 10 = Nov, 11 = Dec
  const day = isUtcMidnight ? currentDate.getUTCDate() : currentDate.getDate();

  // 1. Black Friday & Cyber Monday Window (Nov 15 - Dec 3)
  if ((month === 10 && day >= 15) || (month === 11 && day <= 3)) {
    return {
      season: 'BFCM',
      badgeText: '⚡ Black Friday Deal',
      badgeColorClass: 'bg-red-600 text-white border-red-500 shadow-red-950/40',
      ctaText: 'Check Black Friday Price ↗',
      bannerTitle: '🔥 Black Friday & Cyber Week Deals Live',
      bannerSubtitle:
        'Seasonal markdowns and flash coupons across Toyota all-weather floor liners, dashcams, battery maintainers, and DIY maintenance gear.',
      isPromoActive: true,
      applyDealFilter: true,
    };
  }

  // 2. Holiday & Winter Delivery Prep Window (Dec 4 - Dec 23)
  if (month === 11 && day >= 4 && day <= 23) {
    return {
      season: 'HOLIDAY_WINTER',
      badgeText: '❄️ Holiday & Winter Deal',
      badgeColorClass: 'bg-cyan-600 text-white border-cyan-500 shadow-cyan-950/40',
      ctaText: 'Check Winter Deal Price ↗',
      bannerTitle: '❄️ Holiday & Winter Delivery Prep Deals',
      bannerSubtitle:
        'Subzero-rated floor liners, 12V battery maintainers, wipers, and winter protection before year-end.',
      isPromoActive: true,
      applyDealFilter: false,
    };
  }

  // 3. Boxing Week & New Year Clearance (Dec 24 - Jan 3)
  if ((month === 11 && day >= 24) || (month === 0 && day <= 3)) {
    return {
      season: 'BOXING_WEEK',
      badgeText: '🎁 Boxing Week & New Year Sale',
      badgeColorClass: 'bg-rose-700 text-white border-rose-600 shadow-rose-950/40',
      ctaText: 'View Boxing Week Price ↗',
      bannerTitle: '🎁 Boxing Week & New Year Accessory Clearance',
      bannerSubtitle: 'Year-end savings on custom floor liners, dash cams, and winter essentials.',
      isPromoActive: true,
      applyDealFilter: true,
    };
  }

  // 4. Default / Evergreen Standard Mode (Jan 4 - Nov 14)
  return {
    season: 'STANDARD',
    badgeText: '⚡ Community Pick',
    badgeColorClass: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    ctaText: 'Check Price on Amazon ↗',
    bannerTitle: 'Must-Have Delivery Day Accessories',
    bannerSubtitle: 'Vetted protection gear to order before picking up your allocation.',
    isPromoActive: false,
    applyDealFilter: false,
  };
}

export function sortGearByPromotions<
  T extends { isHeroDeal?: boolean; category?: string; discountCode?: string } = GearItem
>(items: T[], currentDate: Date = new Date()): T[] {
  const promo = getCurrentPromoConfig(currentDate);

  if (!promo.isPromoActive) return items;

  return [...items].sort((a, b) => {
    const aIsHero = a.isHeroDeal || a.category === 'Day-1 Essential' ? 1 : 0;
    const bIsHero = b.isHeroDeal || b.category === 'Day-1 Essential' ? 1 : 0;
    if (bIsHero !== aIsHero) return bIsHero - aIsHero;

    const aHasCode = a.discountCode ? 1 : 0;
    const bHasCode = b.discountCode ? 1 : 0;
    if (bHasCode !== aHasCode) return bHasCode - aHasCode;

    return 0;
  });
}
