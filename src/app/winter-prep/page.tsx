import React from 'react';
import type { Metadata } from 'next';
import { WinterPrepView } from '@/components/winter-prep/winter-prep-view';
import { BackButton } from '@/components/common/back-button';
import { ShareButton } from '@/components/ui/ShareButton';
import { GuideDisclaimer } from '@/components/common/GuideDisclaimer';
import { DayOneGearShelf } from '@/components/gear/DayOneGearShelf';
import type { GearCardItem } from '@/components/gear/GearCard';
import { getRequestMarketMetadata } from '@/lib/seo/host-metadata';
import { getPopularAccessoryWeights } from '@/lib/data/accessories-popularity';
import { GEAR_MARKET_CATALOG } from '@/data/gear/catalog';
import { sortAccessoriesByPopularity } from '@/data/accessories';

export const dynamic = 'force-dynamic';
export const { instant } = { instant: false };

export const metadata: Metadata = {
  metadataBase: new URL('https://www.toyotawaits.ca'),
  title: 'Canadian Toyota Winter Prep Guide (2026/2027) | Battery, Liners & Tire Mandates',
  description:
    'Essential winter prep for Canadian Toyota owners: BC highway tire laws, Quebec Dec 1 deadlines, hybrid 12V AGM auxiliary battery care, and laser-fit liners.',
  keywords: [
    'canadian toyota winter prep guide 2026 2027',
    'bc highway tire laws winter 3pmsf',
    'quebec dec 1 winter tire deadline',
    'hybrid 12v agm auxiliary battery care',
    'toyota hybrid cold weather start',
    'toyota 12v jump point fuse box',
    'rav4 hybrid winter floor mats tuxmat',
    'tuxmat hybrid battery vent clearance',
    'prius prime sub zero heat pump',
  ],
  alternates: {
    canonical: 'https://www.toyotawaits.ca/winter-prep',
  },
  openGraph: {
    title: 'Canadian Toyota Winter Prep Guide (2026/2027) | Battery, Liners & Tire Mandates',
    description:
      'Essential winter prep for Canadian Toyota owners: BC highway tire laws, Quebec Dec 1 deadlines, hybrid 12V AGM auxiliary battery care, and laser-fit liners.',
    url: 'https://www.toyotawaits.ca/winter-prep',
    siteName: 'ToyotaWaits.ca',
    locale: 'en_CA',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Canadian Toyota Winter Prep Guide (2026/2027) | Battery, Liners & Tire Mandates',
    description:
      'Essential winter prep for Canadian Toyota owners: BC highway tire laws, Quebec Dec 1 deadlines, hybrid 12V AGM auxiliary battery care, and laser-fit liners.',
  },
};

const MODEL_SPECIFIC_TOKENS = [
  'rav4',
  'sienna',
  'grand-highlander',
  'highlander',
  'tacoma',
  'tundra',
  'corolla',
  'camry',
  'prius',
  '4runner',
  'sequoia',
  'land-cruiser',
  'crown',
];

const WINTER_DEFAULT_SLOTS: Record<string, number> = {
  'noco-gb40-jump-pack': 100,
  'rfid-faraday-key-fob-pouch': 90,
};

function getUniversalWinterEssentials(weights: Record<string, number>): GearCardItem[] {
  const seenSlugs = new Set<string>();
  const rawItems: Array<GearCardItem & { winterPriority: number }> = [];

  for (const [key, config] of Object.entries(GEAR_MARKET_CATALOG)) {
    if (!config.isWinterPrepEssential) continue;
    if (seenSlugs.has(config.slug)) continue;
    seenSlugs.add(config.slug);

    const identityText = `${key} ${config.slug} ${config.compatibility || ''}`.toLowerCase();
    if (MODEL_SPECIFIC_TOKENS.some((token) => identityText.includes(token))) {
      continue;
    }

    const slug = config.slug || key;
    rawItems.push({
      id: slug,
      slug,
      title: config.title,
      brand: config.brand,
      category: config.category || 'Winter Essential',
      destinationType: config.destinationType || 'amazon',
      destinationUrl: config.destinationUrl,
      asin: config.asin,
      asin_ca: config.asin_ca,
      asin_us: config.asin_us,
      searchQuery: config.searchQuery,
      searchKeywordsCA: config.searchKeywordsCA,
      searchKeywordsUS: config.searchKeywordsUS,
      description: config.description,
      whyBuy: config.whyBuy,
      badge: config.badge,
      imageUrl: config.imageUrl,
      fallbackIcon: config.fallbackIcon,
      buttonLabel: config.buttonLabel,
      compatibility: config.compatibility,
      fitment: config.fitment,
      winterPriority: WINTER_DEFAULT_SLOTS[slug] ?? config.defaultPriorityWeight ?? 0,
    });
  }

  rawItems.sort((a, b) => b.winterPriority - a.winterPriority);

  const sorted = sortAccessoriesByPopularity(rawItems as any, weights) as unknown as GearCardItem[];

  const seenTitles = new Set<string>();
  const uniqueByTitle: GearCardItem[] = [];
  for (const item of sorted) {
    const normTitle = item.title.trim().toLowerCase();
    if (seenTitles.has(normTitle)) continue;
    seenTitles.add(normTitle);
    uniqueByTitle.push(item);
    if (uniqueByTitle.length >= 3) break;
  }

  return uniqueByTitle;
}

export default async function WinterPrepPage() {
  const [weights, { isUS }] = await Promise.all([
    getPopularAccessoryWeights(),
    getRequestMarketMetadata('/winter-prep'),
  ]);
  const topWinterItems = getUniversalWinterEssentials(weights);

  return (
    <main className="min-h-screen pt-4 sm:pt-6">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <BackButton />
          <ShareButton variant="header" title="Canadian Toyota Winter Prep & 12V AGM Battery Guide" />
        </div>
      </div>
      <WinterPrepView />
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 pt-4 pb-6">
        <DayOneGearShelf
          items={topWinterItems}
          title="Essential Winter & Cold-Weather Kit"
          subtitle="Top-clicked 12V lithium jump power, anti-theft relay defense, and sub-zero frost protection."
          market={isUS ? 'US' : 'CA'}
          placement="winter_prep_essential_kit"
        />
      </section>
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 pt-8 pb-16">
        <GuideDisclaimer />
      </div>
    </main>
  );
}
