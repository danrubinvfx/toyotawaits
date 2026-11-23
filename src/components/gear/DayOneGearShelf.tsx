'use client';

import React from 'react';
import Link from 'next/link';
import { Package, ChevronRight } from 'lucide-react';
import { GearCard, type GearCardItem } from '@/components/gear/GearCard';
import { getModelDeliveryShelfItems } from '@/components/gear/ModelDeliveryShelf';
import { sortAccessoriesByPopularity } from '@/data/accessories';
import { MarketProvider } from '@/context/MarketContext';
import { sortGearByPromotions, getCurrentPromoConfig } from '@/lib/gear/promotions';

export interface DayOneGearShelfProps {
  items?: GearCardItem[];
  popularityWeights?: Record<string, number>;
  modelSlug?: string;
  activeModel?: string;
  modelName?: string;
  title?: string;
  subtitle?: string;
  market?: 'CA' | 'US';
  placement?: string;
  className?: string;
}

export function DayOneGearShelf({
  items,
  popularityWeights,
  modelSlug,
  activeModel,
  modelName,
  title = 'Prepping for Delivery Day?',
  subtitle = 'Top community-vetted essentials to have waiting in your garage before pickup.',
  market,
  placement = 'day_one_gear_shelf',
  className = '',
}: DayOneGearShelfProps) {
  const targetModel = modelSlug || activeModel || 'all';
  const baseItems =
    items && items.length > 0 ? items : getModelDeliveryShelfItems(targetModel);

  const normalizedItems = baseItems.map((item) => ({
    ...item,
    id: item.id || item.slug,
  }));

  const sortedItems = popularityWeights
    ? (sortAccessoriesByPopularity(normalizedItems as any, popularityWeights) as unknown as GearCardItem[])
    : normalizedItems;

  const topItems = sortedItems.slice(0, 3);
  const clean = targetModel.toLowerCase().trim();

  const guideLink =
    clean === 'rav4' || clean.includes('rav4')
      ? { href: '/guides/toyota-rav4-must-have-accessories', label: 'View RAV4 Gear Guide' }
      : clean === 'sienna' || clean.includes('sienna')
      ? { href: '/guides/toyota-sienna-trailer-hitch-guide', label: 'View Sienna Hitch & Gear Guide' }
      : clean === 'grand-highlander' || clean.includes('grand highlander')
      ? { href: '/guides/grand-highlander-mods', label: 'View Grand Highlander Mods Guide' }
      : { href: '/delivery-prep', label: 'View Delivery Checklist' };

  const cards = (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:overflow-visible">
      {topItems.map((item) => (
        <GearCard
          key={item.id || item.slug}
          item={item}
          activeModel={targetModel !== 'all' ? targetModel : undefined}
          showCheckbox={false}
          placement={placement}
          className="w-[280px] sm:w-auto flex-shrink-0 sm:flex-shrink snap-start"
        />
      ))}
    </div>
  );

  return (
    <section
      aria-label={title}
      data-testid="day-one-gear-shelf"
      data-model={modelName || targetModel}
      className={`space-y-4 pt-2 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-200/80 dark:border-zinc-800 pb-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 uppercase tracking-wider">
            <Package className="h-3.5 w-3.5" />
            <span>Delivery Day Prep</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            {subtitle}
          </p>
        </div>
        {targetModel !== 'all' && (
          <Link
            href={guideLink.href}
            className="text-xs font-bold text-amber-500 hover:text-amber-400 inline-flex items-center gap-1 self-start sm:self-auto transition-colors"
          >
            <span>{guideLink.label}</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {market ? <MarketProvider initialMarket={market}>{cards}</MarketProvider> : cards}
    </section>
  );
}

export { sortGearByPromotions, getCurrentPromoConfig };
export default DayOneGearShelf;
