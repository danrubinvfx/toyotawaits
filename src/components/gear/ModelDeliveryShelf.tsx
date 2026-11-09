'use client';

import React from 'react';
import Link from 'next/link';
import { Package, ChevronRight } from 'lucide-react';
import { GearCard, type GearCardItem } from '@/components/gear/GearCard';

export interface ModelDeliveryShelfProps {
  modelSlug: string;
  modelName: string;
  className?: string;
}

export function getModelDeliveryShelfItems(modelSlug: string): GearCardItem[] {
  const clean = (modelSlug || '').toLowerCase().trim();

  if (clean === 'rav4' || clean.includes('rav4')) {
    return [
      {
        id: 'high-wall-floor-liners-rav4',
        slug: 'high-wall-floor-liners-rav4',
        title: 'All-Weather Liners',
        brand: 'TuxMat',
        category: 'protection',
        priceEst: '$240 – $310 CAD',
        description: 'Laser-fit spill and slush protection.',
        badge: 'Essential',
        imageUrl: '/assets/gear/tuxmat-floor-liners.webp',
        fallbackIcon: 'layers',
        destinationType: 'amazon',
        searchQuery: 'TuxMat Toyota RAV4 custom all weather floor mats',
        asin_ca: 'B08FRPV812',
      },
      {
        id: 'fitcamx-rav4',
        slug: 'fitcamx-rav4',
        title: 'Integrated Dash Cam',
        brand: 'FitcamX',
        category: 'tech',
        priceEst: '$169 – $289 CAD',
        description: 'Stealth OEM mirror-tap recording.',
        badge: 'Top Pick',
        imageUrl: '/assets/gear/fitcamx-rav4.webp',
        fallbackIcon: 'camera',
        destinationType: 'amazon',
        asin_ca: 'B09GLVMB76',
        asin_us: 'B09GLVMB76',
        searchQuery: 'Fitcamx dash cam Toyota RAV4 OEM 4K',
      },
      {
        id: 'muslogy-rav4',
        slug: 'muslogy-rav4',
        title: 'Console Organizer',
        brand: 'Muslogy',
        category: 'comfort',
        priceEst: '$22 – $28 CAD',
        description: 'Dual-tier armrest storage divider.',
        badge: 'Partner Deal · 2% Off',
        imageUrl: '/assets/gear/muslogy-rav4-organizer.webp',
        fallbackIcon: 'layout-grid',
        destinationType: 'direct_partner',
        destinationUrl: '/out/muslogy-rav4',
        discountCode: 'Toyotawaits',
        discountText: '2% off',
      },
    ];
  }

  if (clean === 'sienna' || clean.includes('sienna')) {
    return [
      {
        id: 'sienna-all-weather-liners',
        slug: 'sienna-all-weather-liners',
        title: 'All-Weather Liners',
        category: 'protection',
        priceEst: '$240 – $310 CAD',
        description: 'Laser-fit spill and slush protection.',
        badge: 'Essential',
        imageUrl: '/assets/gear/tuxmat-floor-liners.webp',
        fallbackIcon: 'layers',
        destinationType: 'amazon',
        searchQuery: 'Toyota Sienna all weather floor mats 2021-2026',
      },
      {
        id: 'muslogy-console',
        slug: 'muslogy-console',
        title: 'Console Organizer',
        brand: 'Muslogy',
        category: 'comfort',
        priceEst: '$28 – $36 CAD',
        description: 'Dual-tier armrest storage divider.',
        badge: 'Partner Deal · 2% Off',
        imageUrl: '/assets/gear/muslogy-sienna-organizer.webp',
        fallbackIcon: 'layout-grid',
        destinationType: 'direct_partner',
        destinationUrl: '/out/muslogy-console',
        discountCode: 'Toyotawaits',
        discountText: '2% off',
      },
      {
        id: 'muslogy-sienna-cargo-net',
        slug: 'muslogy-sienna-cargo-net',
        title: 'Trunk Cargo Net',
        brand: 'Muslogy',
        category: 'protection',
        priceEst: '$26 – $34 CAD',
        description: 'Secures groceries and gear.',
        badge: 'Partner Deal · 2% Off',
        imageUrl: '/assets/gear/muslogy-sienna-cargo-net.webp',
        fallbackIcon: 'luggage',
        destinationType: 'direct_partner',
        destinationUrl: '/out/muslogy-sienna-cargo-net',
        discountCode: 'Toyotawaits',
        discountText: '2% off',
      },
    ];
  }

  if (clean === 'grand-highlander' || clean.includes('grand highlander')) {
    return [
      {
        id: 'screen-protector-grand-highlander',
        slug: 'screen-protector-grand-highlander',
        title: 'Screen Protector',
        brand: 'Spigen',
        category: 'protection',
        priceEst: '$19 – $29 CAD',
        description: 'Stops fingerprints and glare.',
        badge: 'Community Favorite',
        imageUrl: '/assets/gear/spigen-screen-protector.webp',
        fallbackIcon: 'layout-grid',
        destinationType: 'amazon',
        searchQuery: 'Toyota Grand Highlander screen protector tempered glass 12.3 inch',
      },
      {
        id: 'muslogy-grand-highlander',
        slug: 'muslogy-grand-highlander',
        title: 'Console Organizer',
        brand: 'Muslogy',
        category: 'comfort',
        priceEst: '$24 – $32 CAD',
        description: 'Dual-tier armrest storage divider.',
        badge: 'Partner Deal · 2% Off',
        imageUrl: '/assets/gear/muslogy-grand-highlander-organizer.webp',
        fallbackIcon: 'layout-grid',
        destinationType: 'direct_partner',
        destinationUrl: '/out/muslogy-grand-highlander',
        discountCode: 'Toyotawaits',
        discountText: '2% off',
      },
      {
        id: 'grand-highlander-all-weather-liners',
        slug: 'grand-highlander-all-weather-liners',
        title: 'All-Weather Liners',
        category: 'protection',
        priceEst: '$240 – $310 CAD',
        description: 'Laser-fit spill and slush protection.',
        badge: 'Essential',
        imageUrl: '/assets/gear/tuxmat-floor-liners.webp',
        fallbackIcon: 'layers',
        destinationType: 'amazon',
        searchQuery: 'Toyota Grand Highlander all weather floor mats liners',
      },
    ];
  }

  // Universal / other models
  return [
    {
      id: 'all-weather-floor-liners',
      slug: 'all-weather-floor-liners',
      title: 'All-Weather Liners',
      category: 'protection',
      priceEst: '$120 – $189 CAD',
      description: 'Laser-fit spill and slush protection.',
      badge: 'Essential',
      imageUrl: '/assets/gear/tuxmat-floor-liners.webp',
      fallbackIcon: 'layers',
      destinationType: 'amazon',
      searchQuery: `Toyota ${clean || 'all weather'} floor mats liners TPE`,
    },
    {
      id: '4k-front-rear-dash-cam',
      slug: '4k-front-rear-dash-cam',
      title: 'Integrated Dash Cam',
      brand: 'FitcamX',
      category: 'tech',
      priceEst: '$169 – $289 CAD',
      description: 'Stealth OEM mirror-tap recording.',
      badge: 'Top Pick',
      imageUrl: '/assets/gear/fitcamx-rav4.webp',
      fallbackIcon: 'camera',
      destinationType: 'amazon',
      searchQuery: `Fitcamx dash cam Toyota ${clean || 'OEM'} 4K`,
    },
    {
      id: 'rfid-faraday-key-fob-pouch',
      slug: 'rfid-faraday-key-fob-pouch',
      title: 'Faraday Key Pouch',
      category: 'protection',
      priceEst: '$14 – $24 CAD',
      description: 'Blocks keyless relay theft.',
      badge: 'Essential',
      imageUrl: '/assets/gear/faraday-pouch.webp',
      fallbackIcon: 'lock',
      destinationType: 'amazon',
      searchQuery: 'Faraday bag key fob signal protector pouch',
    },
  ];
}

export function ModelDeliveryShelf({
  modelSlug,
  modelName,
  className = '',
}: ModelDeliveryShelfProps) {
  const items = getModelDeliveryShelfItems(modelSlug);
  const clean = (modelSlug || '').toLowerCase().trim();

  const guideLink =
    clean === 'rav4' || clean.includes('rav4')
      ? { href: '/guides/toyota-rav4-must-have-accessories', label: 'View RAV4 Gear Guide' }
      : clean === 'sienna' || clean.includes('sienna')
      ? { href: '/guides/toyota-sienna-trailer-hitch-guide', label: 'View Sienna Hitch & Gear Guide' }
      : clean === 'grand-highlander' || clean.includes('grand highlander')
      ? { href: '/guides/grand-highlander-mods', label: 'View Grand Highlander Mods Guide' }
      : { href: '/delivery-prep', label: 'View Delivery Checklist' };

  return (
    <section
      aria-label="Delivery Day Prep Essentials"
      data-testid="delivery-day-prep-shelf"
      className={`space-y-4 pt-2 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-200/80 dark:border-zinc-800 pb-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 uppercase tracking-wider">
            <Package className="h-3.5 w-3.5" />
            <span>Delivery Day Prep</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Prepping for Delivery Day?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Top community-vetted essentials to have waiting in your garage before pickup.
          </p>
        </div>
        <Link
          href={guideLink.href}
          className="text-xs font-bold text-amber-500 hover:text-amber-400 inline-flex items-center gap-1 self-start sm:self-auto transition-colors"
        >
          <span>{guideLink.label}</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 3-card horizontal shelf: swipeable on mobile, 3-column grid on desktop */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:overflow-visible">
        {items.map((item) => (
          <GearCard
            key={item.id || item.slug}
            item={item}
            activeModel={modelSlug}
            placement="wait_times_delivery_shelf"
            className="w-[280px] sm:w-auto flex-shrink-0 sm:flex-shrink snap-start"
          />
        ))}
      </div>
    </section>
  );
}

export default ModelDeliveryShelf;
