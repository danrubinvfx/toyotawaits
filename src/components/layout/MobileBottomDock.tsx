'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Clock, Ship, Package, Calculator, BookOpen, X, Check, Tag, ExternalLink } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import { useCalculatorContext } from '@/context/CalculatorContext';
import { buildAmazonAffiliateUrl, getModelDisplayName } from '@/lib/gear/affiliate';
import { GearImage } from '@/components/gear/GearImage';
import { resolveVerifiedGearImageSrc } from '@/data/gear/catalog';
import { sortAccessoriesByPopularity, type AccessoryItem } from '@/data/accessories';
import { GuidesModal } from '@/components/navigation/GuidesModal';
import { cn } from '@/lib/utils';

export const GEAR_DRAWER_FILTER_PILLS = [
  { slug: 'all', label: 'All Gear' },
  { slug: 'universal', label: 'Universal' },
  { slug: 'rav4', label: 'RAV4' },
  { slug: 'sienna', label: 'Sienna' },
  { slug: 'grand-highlander', label: 'Grand Highlander' },
  { slug: 'tacoma', label: 'Tacoma' },
  { slug: 'prius', label: 'Prius' },
  { slug: '4runner', label: '4Runner' },
  { slug: 'land-cruiser', label: 'Land Cruiser' },
] as const;

export function normalizeGearFilterSlug(modelSlug?: string | null): string {
  const clean = (modelSlug || '').toLowerCase().trim();
  if (!clean || clean === 'all') return 'all';
  if (clean === 'universal') return 'universal';
  if (clean.includes('grand-highlander') || clean.includes('grand highlander')) return 'grand-highlander';
  if (clean.includes('land-cruiser') || clean.includes('land cruiser') || clean.includes('landcruiser')) {
    return 'land-cruiser';
  }
  if (clean.includes('rav4')) return 'rav4';
  if (clean.includes('sienna')) return 'sienna';
  if (clean.includes('tacoma')) return 'tacoma';
  if (clean.includes('prius')) return 'prius';
  if (clean.includes('4runner')) return '4runner';
  return clean;
}

export interface MobileGearItem {
  id: string;
  title: string;
  brand?: string;
  priceText?: string;
  description: string;
  destinationType: 'amazon' | 'direct_partner';
  partnerUrl?: string;
  searchQuery: string;
  discountCode?: string;
  discountText?: string;
  imageUrl?: string;
  fallbackIcon?: string;
  badge?: string;
  tag?: string;
  modelSlug?: string;
}

export const UNIVERSAL_MOBILE_GEAR: MobileGearItem[] = [
  {
    id: 'rfid-faraday-key-fob-pouch',
    title: 'Faraday Key Pouch',
    brand: 'TICONN',
    priceText: '$14 – $24 CAD',
    description: 'Blocks keyless relay theft.',
    destinationType: 'amazon',
    searchQuery: 'Faraday bag key fob signal protector pouch',
    badge: 'Security',
    tag: 'Security',
    imageUrl: '/assets/gear/faraday-pouch.webp',
    fallbackIcon: 'lock',
    modelSlug: 'universal',
  },
  {
    id: 'noco-gb40-jump-pack',
    title: '12V Jump Starter',
    brand: 'NOCO',
    priceText: '$129 – $149 CAD',
    description: 'Compact 1000A winter jump pack.',
    destinationType: 'amazon',
    searchQuery: 'NOCO Boost GB40 12V lithium jump starter',
    badge: 'Emergency & Winter',
    tag: 'Emergency & Winter',
    imageUrl: '/assets/gear/noco-gb40-jump-pack.webp',
    fallbackIcon: 'battery',
    modelSlug: 'universal',
  },
  {
    id: 'portable-tire-inflator',
    title: 'Cordless Tire Inflator',
    brand: 'Fanttik',
    priceText: '$65 – $89 CAD',
    description: 'Auto-stop 150 PSI air pump.',
    destinationType: 'amazon',
    searchQuery: 'portable cordless tire inflator auto shutoff 150 PSI',
    badge: 'Winter Prep',
    tag: 'Winter Prep',
    imageUrl: '/assets/gear/noco-gb40-jump-pack.webp',
    fallbackIcon: 'zap',
    modelSlug: 'universal',
  },
  {
    id: 'universal-spigen-screen-protector',
    title: 'Spigen 9H Tempered Glass Screen Protector',
    brand: 'Spigen',
    priceText: '~$24 CAD',
    description: 'Stops fingerprints and glare.',
    destinationType: 'amazon',
    searchQuery: 'Spigen tempered glass screen protector Toyota multimedia',
    badge: 'Display Protection',
    tag: 'Display Protection',
    imageUrl: '/assets/gear/spigen-screen-protector.webp',
    fallbackIcon: 'smartphone',
    modelSlug: 'universal',
  },
  {
    id: 'universal-wireless-carplay',
    title: 'Plug-and-Play Wireless CarPlay / Android Auto Adapter',
    brand: 'CarlinKit / Auto',
    priceText: '~$50 CAD',
    description: 'Instant wireless CarPlay & Android Auto.',
    destinationType: 'amazon',
    searchQuery: 'wireless carplay android auto adapter toyota',
    badge: 'Cabin Tech',
    tag: 'Cabin Tech',
    imageUrl: '/assets/gear/wireless-carplay-adapter.webp',
    fallbackIcon: 'wifi',
    modelSlug: 'universal',
  },
  {
    id: 'fast-usbc-pd-car-charger',
    title: '65W Fast Charger',
    brand: 'Baseus / Anker',
    priceText: '$19 – $32 CAD',
    description: 'Ultra-fast dual phone charging.',
    destinationType: 'amazon',
    searchQuery: 'flush fit 65W dual USB C car charger',
    badge: 'Charging',
    tag: 'Charging',
    imageUrl: '/assets/gear/fast-usbc-charger.webp',
    fallbackIcon: 'zap',
    modelSlug: 'universal',
  },
  {
    id: 'level-2-evse-charger',
    title: 'Home EV Charger',
    brand: 'Grizzl-E',
    priceText: '$499 – $549 CAD',
    description: 'Fast Level 2 home charging.',
    destinationType: 'amazon',
    searchQuery: 'Level 2 EV charger 40A NEMA 14-50 J1772',
    badge: 'PHEV Charging',
    tag: 'PHEV Charging',
    imageUrl: '/assets/gear/grizzl-e-charger.webp',
    fallbackIcon: 'zap',
    modelSlug: 'universal',
  },
];

function appendUniversalEssentials(
  modelItems: MobileGearItem[],
  excludeIds: string[] = ['universal-spigen-screen-protector', 'universal-wireless-carplay']
): MobileGearItem[] {
  const existingIds = new Set(modelItems.map((i) => i.id));
  const extras = UNIVERSAL_MOBILE_GEAR.filter(
    (u) => !existingIds.has(u.id) && !excludeIds.includes(u.id)
  );
  return [...modelItems, ...extras];
}

export function getCuratedMobileGear(modelSlug: string, market: 'CA' | 'US'): MobileGearItem[] {
  const isUs = market === 'US';
  const clean = modelSlug.toLowerCase().trim();

  // 0. Strictly Universal Essentials
  if (clean === 'universal') {
    return UNIVERSAL_MOBILE_GEAR;
  }

  // 1. RAV4 Curated Lineup
  if (clean === 'rav4' || clean.includes('rav4')) {
    return appendUniversalEssentials([
      {
        id: 'muslogy-rav4-organizer',
        title: 'Muslogy Center Console Organizer Tray (RAV4)',
        brand: 'Muslogy',
        priceText: '$24 – $28 CAD',
        description: 'Drop-in multi-tier center console armrest divider tray with anti-slip silicone coin pads.',
        destinationType: 'direct_partner',
        partnerUrl: '/out/muslogy-rav4',
        searchQuery: 'Muslogy center console organizer tray Toyota RAV4',
        discountCode: 'Toyotawaits',
        discountText: '2% OFF',
        badge: 'Partner Deal · 2% Off',
        tag: 'Partner Deal · 2% Off',
        imageUrl: '/assets/gear/muslogy-rav4-organizer.webp',
        fallbackIcon: 'layout-grid',
      },
      {
        id: 'spigen-screen-protector-rav4',
        title: 'Spigen 9H Tempered Glass Screen Protector',
        brand: 'Spigen',
        priceText: '~$24 CAD',
        description: 'Anti-glare oleophobic glass for 8", 10.5" & 12.3" multimedia screens.',
        destinationType: 'amazon',
        searchQuery: 'Spigen tempered glass screen protector Toyota RAV4',
        badge: 'Display Protection',
        tag: 'Display Protection',
        imageUrl: '/assets/gear/spigen-screen-protector.webp',
        fallbackIcon: 'smartphone',
      },
      {
        id: 'high-wall-floor-liners-rav4',
        title: 'TuxMat High-Wall TPE Floor Liners',
        brand: 'TuxMat',
        priceText: '~$190 - $290 CAD',
        description: 'Maximum coverage spill & slush protection avoiding 2x dealer markup.',
        destinationType: 'amazon',
        searchQuery: isUs ? 'TuxMat Toyota RAV4 custom all weather floor mats' : 'TuxMat Toyota RAV4 custom all weather floor mats',
        badge: 'Winter Protection',
        tag: 'Winter Protection',
        imageUrl: '/assets/gear/tuxmat-floor-liners.webp',
        fallbackIcon: 'layers',
      },
      {
        id: 'wireless-carplay-adapter-rav4',
        title: 'Plug-and-Play Wireless CarPlay / Android Auto Adapter',
        brand: 'CarlinKit / Auto',
        priceText: '~$50 CAD',
        description: 'Converts wired factory CarPlay to automatic wireless connection.',
        destinationType: 'amazon',
        searchQuery: 'wireless carplay android auto adapter plug and play toyota',
        badge: 'Cabin Tech',
        tag: 'Cabin Tech',
        imageUrl: '/assets/gear/wireless-carplay-adapter.webp',
        fallbackIcon: 'wifi',
      },
      {
        id: 'fitcamx-rav4',
        title: 'FitcamX OEM 4K Integrated Dashcam',
        brand: 'FitcamX',
        priceText: '~$188 CAD',
        description: 'Discrete OEM look tapping into rearview mirror power with zero dangling cables.',
        destinationType: 'amazon',
        searchQuery: isUs ? 'Fitcamx dash cam Toyota RAV4 OEM 4K' : 'Fitcamx dash cam Toyota RAV4 OEM 4K',
        badge: 'OEM Integrated',
        tag: 'OEM Integrated',
        imageUrl: '/assets/gear/fitcamx-rav4.webp',
        fallbackIcon: 'camera',
      },
    ]);
  }

  // 2. Sienna Curated Lineup
  if (clean === 'sienna' || clean.includes('sienna')) {
    return appendUniversalEssentials([
      {
        id: 'muslogy-sienna-organizer',
        title: 'Muslogy Sienna Console Sliding Tray & Bridge Box',
        brand: 'Muslogy',
        priceText: '$28 – $36 CAD',
        description: 'Custom-fit sliding upper tray and hidden lower bridge storage compartments for Toyota Sienna.',
        destinationType: 'direct_partner',
        partnerUrl: '/out/muslogy-sienna',
        searchQuery: 'Sienna center console organizer tray 2021-2026',
        discountCode: 'Toyotawaits',
        discountText: '2% OFF',
        badge: 'Partner Deal · 2% Off',
        tag: 'Partner Deal · 2% Off',
        imageUrl: '/assets/gear/muslogy-sienna-organizer.webp',
        fallbackIcon: 'layout-grid',
      },
      {
        id: 'spigen-screen-protector-sienna',
        title: 'Spigen 9H Tempered Glass Screen Protector',
        brand: 'Spigen',
        priceText: '~$24 CAD',
        description: 'Anti-glare oleophobic glass for 8", 10.5" & 12.3" multimedia screens.',
        destinationType: 'amazon',
        searchQuery: 'Spigen tempered glass screen protector Toyota Sienna',
        badge: 'Display Protection',
        tag: 'Display Protection',
        imageUrl: '/assets/gear/spigen-screen-protector.webp',
        fallbackIcon: 'smartphone',
      },
      {
        id: 'sienna-all-weather-liners',
        title: 'TuxMat / 3-Row Custom All-Weather Floor Liners',
        brand: 'TuxMat / OEM Fit',
        priceText: '~$190 - $290 CAD',
        description: 'Maximum coverage spill & slush protection avoiding 2x dealer markup.',
        destinationType: 'amazon',
        searchQuery: 'Toyota Sienna all weather floor mats 2021-2026',
        badge: 'Winter Protection',
        tag: 'Winter Protection',
        imageUrl: '/assets/gear/tuxmat-floor-liners.webp',
        fallbackIcon: 'layers',
      },
      {
        id: 'wireless-carplay-adapter-sienna',
        title: 'Plug-and-Play Wireless CarPlay / Android Auto Adapter',
        brand: 'CarlinKit / Auto',
        priceText: '~$50 CAD',
        description: 'Converts wired factory CarPlay to automatic wireless connection.',
        destinationType: 'amazon',
        searchQuery: 'wireless carplay android auto adapter plug and play toyota',
        badge: 'Cabin Tech',
        tag: 'Cabin Tech',
        imageUrl: '/assets/gear/wireless-carplay-adapter.webp',
        fallbackIcon: 'wifi',
      },
      {
        id: 'fitcamx-sienna',
        title: 'FitcamX OEM 4K Integrated Dashcam (Sienna)',
        brand: 'FitcamX',
        priceText: '~$188 CAD',
        description: 'Factory-integrated mirror replacement dashcam drawing power directly from the TSS mirror harness.',
        destinationType: 'amazon',
        searchQuery: 'Fitcamx dash cam Toyota Sienna OEM 4K',
        badge: 'OEM Integrated',
        tag: 'OEM Integrated',
        imageUrl: '/assets/gear/fitcamx-rav4.webp',
        fallbackIcon: 'camera',
      },
    ]);
  }

  // 3. Grand Highlander Curated Lineup
  if (clean === 'grand-highlander' || clean.includes('grand-highlander') || clean.includes('grand highlander')) {
    return appendUniversalEssentials([
      {
        id: 'muslogy-grand-highlander-organizer',
        title: 'Muslogy Grand Highlander Console Divider Tray',
        brand: 'Muslogy',
        priceText: '$24 – $32 CAD',
        description: 'Direct-fit upper armrest storage box and console divider tray tailored for Grand Highlander.',
        destinationType: 'direct_partner',
        partnerUrl: '/out/muslogy-grand-highlander',
        searchQuery: 'Muslogy center console organizer Grand Highlander',
        discountCode: 'Toyotawaits',
        discountText: '2% OFF',
        badge: 'Partner Deal · 2% Off',
        tag: 'Partner Deal · 2% Off',
        imageUrl: '/assets/gear/muslogy-grand-highlander-organizer.webp',
        fallbackIcon: 'layout-grid',
      },
      {
        id: 'screen-protector-grand-highlander',
        title: 'Spigen 9H Tempered Glass Screen Protector (Grand Highlander)',
        brand: 'Spigen / Tempered Glass',
        priceText: '~$24 CAD',
        description: 'Anti-glare oleophobic glass for 8", 10.5" & 12.3" multimedia screens.',
        destinationType: 'amazon',
        searchQuery: 'Grand Highlander 2024 2025 2026 12.3-inch screen protector tempered glass',
        badge: 'Display Protection',
        tag: 'Display Protection',
        imageUrl: '/assets/gear/spigen-screen-protector.webp',
        fallbackIcon: 'smartphone',
      },
      {
        id: 'tuxmat-floor-liners-grand-highlander',
        title: 'TuxMat High-Wall All-Weather Floor Liners (Grand Highlander)',
        brand: 'TuxMat',
        priceText: '~$190 - $290 CAD',
        description: 'Maximum coverage spill & slush protection avoiding 2x dealer markup.',
        destinationType: 'amazon',
        searchQuery: 'Toyota Grand Highlander all weather floor mats TuxMat',
        badge: 'Winter Protection',
        tag: 'Winter Protection',
        imageUrl: '/assets/gear/tuxmat-floor-liners.webp',
        fallbackIcon: 'layers',
      },
      {
        id: 'wireless-carplay-adapter-grand-highlander',
        title: 'Plug-and-Play Wireless CarPlay / Android Auto Adapter',
        brand: 'CarlinKit / Auto',
        priceText: '~$50 CAD',
        description: 'Converts wired factory CarPlay to automatic wireless connection.',
        destinationType: 'amazon',
        searchQuery: 'wireless carplay android auto adapter plug and play toyota',
        badge: 'Cabin Tech',
        tag: 'Cabin Tech',
        imageUrl: '/assets/gear/wireless-carplay-adapter.webp',
        fallbackIcon: 'wifi',
      },
      {
        id: 'fitcamx-grand-highlander',
        title: 'FitcamX TSS 3.0 Integrated 4K Dashcam',
        brand: 'FitcamX',
        priceText: '~$188 CAD',
        description: 'Custom molded mirror housing integrating 4K recording under the digital mirror bracket.',
        destinationType: 'amazon',
        searchQuery: 'Fitcamx dash cam Grand Highlander TSS 3.0',
        badge: 'OEM Integrated',
        tag: 'OEM Integrated',
        imageUrl: '/assets/gear/fitcamx-rav4.webp',
        fallbackIcon: 'camera',
      },
    ]);
  }

  // 4. Other Specific Models Fallback (e.g. Camry, Tacoma, Prius, Corolla Cross, 4Runner, Land Cruiser)
  if (clean && clean !== 'all') {
    const modelDisplayName = getModelDisplayName(clean);
    return appendUniversalEssentials([
      {
        id: `muslogy-${clean}-organizer`,
        title: 'Muslogy Center Console Organizer Tray',
        brand: 'Muslogy',
        priceText: '$24 – $32 CAD',
        description: 'Drop-in multi-tier center console armrest divider tray with anti-slip silicone coin pads.',
        destinationType: 'direct_partner',
        partnerUrl: clean.includes('sienna') ? '/out/muslogy-sienna' : '/out/muslogy-rav4',
        searchQuery: `Muslogy center console organizer tray Toyota ${modelDisplayName}`,
        discountCode: 'Toyotawaits',
        discountText: '2% OFF',
        badge: 'Partner Deal · 2% Off',
        tag: 'Partner Deal · 2% Off',
        imageUrl: clean.includes('sienna') ? '/assets/gear/muslogy-sienna-organizer.webp' : '/assets/gear/muslogy-rav4-organizer.webp',
        fallbackIcon: 'layout-grid',
      },
      {
        id: `spigen-screen-protector-${clean}`,
        title: `Spigen 9H Tempered Glass Screen Protector (${modelDisplayName})`,
        brand: 'Spigen',
        priceText: '~$24 CAD',
        description: 'Anti-glare oleophobic glass for 8", 10.5" & 12.3" multimedia screens.',
        destinationType: 'amazon',
        searchQuery: `Spigen tempered glass screen protector Toyota ${modelDisplayName}`,
        badge: 'Display Protection',
        tag: 'Display Protection',
        imageUrl: '/assets/gear/spigen-screen-protector.webp',
        fallbackIcon: 'smartphone',
      },
      {
        id: `tuxmat-floor-liners-${clean}`,
        title: `TuxMat High-Wall All-Weather Floor Liners (${modelDisplayName})`,
        brand: 'TuxMat',
        priceText: '~$190 - $290 CAD',
        description: 'Maximum coverage spill & slush protection avoiding 2x dealer markup.',
        destinationType: 'amazon',
        searchQuery: `TuxMat Toyota ${modelDisplayName} custom all weather floor mats`,
        badge: 'Winter Protection',
        tag: 'Winter Protection',
        imageUrl: '/assets/gear/tuxmat-floor-liners.webp',
        fallbackIcon: 'layers',
      },
      {
        id: `wireless-carplay-adapter-${clean}`,
        title: 'Plug-and-Play Wireless CarPlay / Android Auto Adapter',
        brand: 'CarlinKit / Auto',
        priceText: '~$50 CAD',
        description: 'Converts wired factory CarPlay to automatic wireless connection.',
        destinationType: 'amazon',
        searchQuery: 'wireless carplay android auto adapter plug and play toyota',
        badge: 'Cabin Tech',
        tag: 'Cabin Tech',
        imageUrl: '/assets/gear/wireless-carplay-adapter.webp',
        fallbackIcon: 'wifi',
      },
      {
        id: `fitcamx-${clean}`,
        title: `FitcamX OEM Factory-Look 4K Dashcam (${modelDisplayName})`,
        brand: 'FitcamX',
        priceText: '~$188 CAD',
        description: 'Clean factory OEM appearance tapping into rearview mirror power without dangling wires.',
        destinationType: 'amazon',
        searchQuery: `Fitcamx dash cam Toyota ${modelDisplayName} OEM 4K`,
        badge: 'OEM Integrated',
        tag: 'OEM Integrated',
        imageUrl: '/assets/gear/fitcamx-rav4.webp',
        fallbackIcon: 'camera',
      },
    ]);
  }

  // 5. All Gear: Top Model Bestsellers + Expanded Universal Essentials
  return appendUniversalEssentials([
    {
      id: 'muslogy-console-organizer-universal',
      title: 'Muslogy Center Console Organizer Tray',
      brand: 'Muslogy',
      priceText: '$24 – $28 CAD',
      description: 'Drop-in multi-tier center console armrest divider tray with anti-slip silicone coin pads.',
      destinationType: 'direct_partner',
      partnerUrl: '/out/muslogy-rav4',
      searchQuery: 'Muslogy center console organizer tray Toyota',
      discountCode: 'Toyotawaits',
      discountText: '2% OFF',
      badge: 'Partner Deal · 2% Off',
      tag: 'Partner Deal · 2% Off',
      imageUrl: '/assets/gear/muslogy-rav4-organizer.webp',
      fallbackIcon: 'layout-grid',
    },
    {
      id: 'universal-spigen-screen-protector',
      title: 'Spigen 9H Tempered Glass Screen Protector',
      brand: 'Spigen',
      priceText: '~$24 CAD',
      description: 'Anti-glare oleophobic glass for 8", 10.5" & 12.3" multimedia screens.',
      destinationType: 'amazon',
      searchQuery: 'Spigen tempered glass screen protector Toyota multimedia screen',
      badge: 'Display Protection',
      tag: 'Display Protection',
      imageUrl: '/assets/gear/spigen-screen-protector.webp',
      fallbackIcon: 'smartphone',
    },
    {
      id: 'universal-tuxmat-floor-liners',
      title: 'TuxMat / Custom-Fit All-Weather High-Wall Floor Liners',
      brand: 'TuxMat',
      priceText: '~$190 - $290 CAD',
      description: 'Maximum coverage spill & slush protection avoiding 2x dealer markup.',
      destinationType: 'amazon',
      searchQuery: 'TuxMat custom all weather high wall floor mats liners Toyota',
      badge: 'Winter Protection',
      tag: 'Winter Protection',
      imageUrl: '/assets/gear/tuxmat-floor-liners.webp',
      fallbackIcon: 'layers',
    },
    {
      id: 'universal-wireless-carplay',
      title: 'Plug-and-Play Wireless CarPlay / Android Auto Adapter',
      brand: 'CarlinKit / Auto',
      priceText: '~$50 CAD',
      description: 'Converts wired factory CarPlay to automatic wireless connection.',
      destinationType: 'amazon',
      searchQuery: 'wireless carplay android auto adapter plug and play',
      badge: 'Cabin Tech',
      tag: 'Cabin Tech',
      imageUrl: '/assets/gear/wireless-carplay-adapter.webp',
      fallbackIcon: 'wifi',
    },
    {
      id: 'universal-fitcamx-dashcam',
      title: 'FitcamX OEM Factory-Look 4K Dashcam',
      brand: 'FitcamX',
      priceText: '~$188 CAD',
      description: 'Clean factory OEM appearance tapping into rearview mirror power without dangling wires.',
      destinationType: 'amazon',
      searchQuery: 'Fitcamx dash cam Toyota OEM 4K',
      badge: 'OEM Integrated',
      tag: 'OEM Integrated',
      imageUrl: '/assets/gear/fitcamx-rav4.webp',
      fallbackIcon: 'camera',
    },
  ]);
}

export interface MobileGearDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  modelSlug: string;
  modelName: string;
  popularityWeights?: Record<string, number>;
}

export function MobileGearDrawer({
  isOpen,
  onClose,
  modelSlug,
  modelName,
  popularityWeights: externalWeights,
}: MobileGearDrawerProps) {
  const { market } = useMarket();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>(() =>
    normalizeGearFilterSlug(modelSlug)
  );
  const [fetchedWeights, setFetchedWeights] = useState<Record<string, number>>({});

  // Sync active filter pill when the route/context model changes or drawer opens
  useEffect(() => {
    setSelectedFilter(normalizeGearFilterSlug(modelSlug));
  }, [modelSlug, isOpen]);

  // Fetch 30-day Supabase click telemetry when drawer opens (unless externally supplied)
  useEffect(() => {
    if (!isOpen || externalWeights) return;
    let cancelled = false;
    if (typeof fetch !== 'function') return;

    fetch('/api/accessories/popular')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.counts && typeof data.counts === 'object') {
          setFetchedWeights(data.counts as Record<string, number>);
        }
      })
      .catch(() => {
        // Offline / error fallback: keep curated order
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, externalWeights]);

  const effectiveWeights = useMemo(
    () => externalWeights ?? fetchedWeights,
    [externalWeights, fetchedWeights]
  );

  const gearItems = useMemo(() => {
    const filtered = getCuratedMobileGear(selectedFilter, market || 'CA');
    if (!effectiveWeights || Object.keys(effectiveWeights).length === 0) {
      return filtered;
    }

    const originalById = new Map(filtered.map((item) => [item.id, item]));
    const sorted = sortAccessoriesByPopularity(
      filtered as unknown as AccessoryItem[],
      effectiveWeights
    );

    return sorted.map((sortedItem) => {
      const original = originalById.get(sortedItem.id);
      return original ?? (sortedItem as unknown as MobileGearItem);
    });
  }, [selectedFilter, market, effectiveWeights]);

  const headerTitleSuffix = useMemo(() => {
    if (selectedFilter === 'all') return 'Toyota Essentials';
    if (selectedFilter === 'universal') return 'Universal Essentials';
    if (normalizeGearFilterSlug(modelSlug) === selectedFilter && modelName) {
      return modelName;
    }
    return getModelDisplayName(selectedFilter);
  }, [selectedFilter, modelSlug, modelName]);

  const handleCopyCode = useCallback((code: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 2200);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden" data-testid="mobile-gear-drawer-root">
      {/* Backdrop */}
      <div
        data-testid="mobile-gear-drawer-overlay"
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-Up Bottom Sheet */}
      <div
        data-testid="mobile-gear-drawer-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={`Delivery Day Prep: ${headerTitleSuffix}`}
        className="fixed bottom-0 inset-x-0 z-50 rounded-t-2xl bg-zinc-900 border-t border-zinc-800 px-4 pt-3 max-h-[85vh] overflow-y-auto pb-8 shadow-2xl space-y-3.5"
      >
        {/* Sticky Sheet Header + Model Filter Pill Bar */}
        <div className="sticky top-0 z-10 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 -mx-4 px-4 pt-1 pb-3 space-y-3">
          {/* Pull Handle */}
          <div className="w-12 h-1.5 rounded-full bg-zinc-700 mx-auto" aria-hidden="true" />

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Delivery Day Prep: {headerTitleSuffix}
              </h3>
              <p className="text-xs text-zinc-400">
                Curated exclusive partner deals and community bestsellers
              </p>
            </div>
            <button
              type="button"
              data-testid="mobile-gear-drawer-close-btn"
              onClick={onClose}
              aria-label="Close gear drawer"
              className="rounded-full p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Horizontal Model Filter Pill Bar */}
          <div
            data-testid="gear-drawer-filter-pills"
            role="tablist"
            aria-label="Filter gear by Toyota model"
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5"
          >
            {GEAR_DRAWER_FILTER_PILLS.map((pill) => {
              const isSelected = selectedFilter === pill.slug;
              return (
                <button
                  key={pill.slug}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  data-testid={`gear-filter-pill-${pill.slug}`}
                  onClick={() => setSelectedFilter(pill.slug)}
                  className={cn(
                    'shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer whitespace-nowrap border',
                    isSelected
                      ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-sm'
                      : 'bg-zinc-800/80 text-zinc-300 border-zinc-700/70 hover:bg-zinc-800 hover:text-white'
                  )}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Curated Gear Cards */}
        <div className="space-y-3 pt-1">
          {gearItems.map((item, index) => {
            const isPartner = item.destinationType === 'direct_partner';
            const amazonUrl = buildAmazonAffiliateUrl(
              item.searchQuery,
              market || 'CA',
              market || 'CA'
            );
            const destinationUrl = isPartner && item.partnerUrl ? item.partnerUrl : amazonUrl;
            const isCodeCopied = copiedId === item.id;
            const imgSrc = resolveVerifiedGearImageSrc(item.imageUrl, undefined);
            const itemTag = item.tag || item.badge;
            const itemClicks = Number(effectiveWeights[item.id]) || 0;
            const isMostPopular = index === 0 && itemClicks >= 3;

            return (
              <div
                key={item.id}
                data-testid={`mobile-gear-card-${item.id}`}
                className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 flex gap-3 items-start"
              >
                {/* Gear Image / Fallback with Studio Spotlight Backdrop */}
                <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-zinc-800 bg-gradient-to-b from-zinc-700/35 via-zinc-900/90 to-zinc-950 flex items-center justify-center">
                  <GearImage
                    src={imgSrc}
                    alt={item.title}
                    affiliateUrl={destinationUrl}
                    rel="sponsored noopener noreferrer nofollow"
                    fallbackIcon={item.fallbackIcon || 'package'}
                    aspectRatioClass="h-16 w-16"
                    containerClassName="h-16 w-16"
                    sizes="64px"
                    className="w-16 h-16"
                  />
                </div>

                {/* Details & Actions */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <div className="flex flex-wrap items-center gap-1">
                      {itemTag && (
                        <span
                          className={cn(
                            'inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase',
                            isPartner
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : 'bg-zinc-800/90 text-zinc-300 border border-zinc-700/60'
                          )}
                        >
                          {itemTag}
                        </span>
                      )}
                      {isMostPopular && (
                        <span
                          data-testid={`most-popular-badge-${item.id}`}
                          className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide bg-orange-500/15 text-orange-300 border border-orange-500/30"
                        >
                          🔥 Most Popular
                        </span>
                      )}
                    </div>
                    {item.priceText && (
                      <span className="text-[11px] font-semibold text-emerald-400 shrink-0 ml-auto">
                        {item.priceText}
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">
                    {item.title}
                  </h4>

                  <p className="text-[11px] text-zinc-400 leading-normal line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {isPartner && item.discountCode && (
                      <button
                        type="button"
                        data-testid={`copy-code-btn-${item.id}`}
                        onClick={() => handleCopyCode(item.discountCode!, item.id)}
                        className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 border border-amber-500/30 px-2 py-1 text-[11px] font-bold text-amber-400 hover:bg-amber-500/25 active:scale-95 transition cursor-pointer"
                      >
                        {isCodeCopied ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Tag className="h-3 w-3" />
                            <span>CODE: {item.discountCode}{item.discountText ? ` (${item.discountText})` : ''}</span>
                          </>
                        )}
                      </button>
                    )}

                    <a
                      href={destinationUrl}
                      target="_blank"
                      rel="sponsored noopener noreferrer nofollow"
                      data-testid={`gear-cta-link-${item.id}`}
                      className="inline-flex items-center gap-1 rounded-md bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-2 py-1 text-[11px] font-semibold text-zinc-200 hover:text-white transition cursor-pointer"
                    >
                      <span>{isPartner ? 'Muslogy Deal ↗' : 'Check on Amazon ↗'}</span>
                      <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function useScrollCollapse(disabled: boolean) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const lastScrollY = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    lastScrollY.current = window.scrollY || 0;
    let isPending = false;

    const updateScroll = () => {
      isPending = false;
      rafIdRef.current = null;
      if (disabled) {
        setIsCollapsed(false);
        lastScrollY.current = window.scrollY || 0;
        return;
      }

      const currentScrollY = window.scrollY || 0;
      const delta = currentScrollY - lastScrollY.current;

      if (currentScrollY < 80 || delta < -10) {
        setIsCollapsed(false);
      } else if (currentScrollY > 100 && delta > 10) {
        setIsCollapsed(true);
      }

      lastScrollY.current = currentScrollY;
    };

    const handleScroll = () => {
      if (isPending) return;
      isPending = true;
      rafIdRef.current = window.requestAnimationFrame(updateScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (isPending && rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
      isPending = false;
      rafIdRef.current = null;
    };
  }, [disabled]);

  const effectiveCollapsed = disabled ? false : isCollapsed;
  return [effectiveCollapsed, setIsCollapsed] as const;
}

export function MobileBottomDock() {
  const pathname = usePathname() || '';
  const searchParams = useSearchParams();
  const calcContext = useCalculatorContext();
  const [isGearDrawerOpen, setIsGearDrawerOpen] = useState(false);
  const [isGuidesModalOpen, setIsGuidesModalOpen] = useState(false);
  const hasOpenModal = isGearDrawerOpen || isGuidesModalOpen;
  const [isCollapsed, setIsCollapsed] = useScrollCollapse(hasOpenModal);

  // Auto-close open drawers/modals on navigation
  useEffect(() => {
    setIsGearDrawerOpen(false);
    setIsGuidesModalOpen(false);
  }, [pathname]);
  const [eventModel, setEventModel] = useState<string | null>(null);

  // Listen to custom model selection events dispatched across pages
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleModelChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ model?: string; slug?: string }>;
      const next = customEvent.detail?.model || customEvent.detail?.slug;
      if (next) {
        setEventModel(next);
      }
    };

    window.addEventListener('toyotawait:model-change', handleModelChange as EventListener);
    return () => {
      window.removeEventListener('toyotawait:model-change', handleModelChange as EventListener);
    };
  }, []);

  // Resolve active vehicle context from URL, Context, Pathname, or Event
  const { activeModelSlug, activeModelName } = useMemo(() => {
    // 1. URL search param e.g. ?model=rav4
    const urlModel = searchParams?.get('model');
    if (urlModel) {
      const clean = urlModel.toLowerCase().trim();
      return {
        activeModelSlug: clean,
        activeModelName: getModelDisplayName(clean),
      };
    }

    // 2. CalculatorContext active model
    if (calcContext?.activeModelSlug) {
      return {
        activeModelSlug: calcContext.activeModelSlug,
        activeModelName: calcContext.activeModelName || getModelDisplayName(calcContext.activeModelSlug),
      };
    }

    // 3. Pathname detection (e.g. /calculator/rav4-hybrid, /camping/sienna, /wait-times/sienna)
    const lowerPath = pathname.toLowerCase();
    if (lowerPath.includes('grand-highlander') || lowerPath.includes('grand highlander')) {
      return { activeModelSlug: 'grand-highlander', activeModelName: 'Grand Highlander' };
    }
    if (lowerPath.includes('sienna')) {
      return { activeModelSlug: 'sienna', activeModelName: 'Sienna' };
    }
    if (lowerPath.includes('rav4')) {
      return { activeModelSlug: 'rav4', activeModelName: 'RAV4' };
    }
    if (lowerPath.includes('corolla-cross') || lowerPath.includes('corollacross')) {
      return { activeModelSlug: 'corolla-cross', activeModelName: 'Corolla Cross' };
    }
    if (lowerPath.includes('camry')) {
      return { activeModelSlug: 'camry', activeModelName: 'Camry' };
    }
    if (lowerPath.includes('prius')) {
      return { activeModelSlug: 'prius', activeModelName: 'Prius' };
    }
    if (lowerPath.includes('tacoma')) {
      return { activeModelSlug: 'tacoma', activeModelName: 'Tacoma' };
    }
    if (lowerPath.includes('highlander')) {
      return { activeModelSlug: 'highlander', activeModelName: 'Highlander' };
    }
    if (lowerPath.includes('4runner')) {
      return { activeModelSlug: '4runner', activeModelName: '4Runner' };
    }
    if (lowerPath.includes('tundra')) {
      return { activeModelSlug: 'tundra', activeModelName: 'Tundra' };
    }
    if (lowerPath.includes('land-cruiser') || lowerPath.includes('landcruiser')) {
      return { activeModelSlug: 'land-cruiser', activeModelName: 'Land Cruiser' };
    }

    // 4. Custom event or fallback
    if (eventModel) {
      const clean = eventModel.toLowerCase().trim();
      return {
        activeModelSlug: clean,
        activeModelName: getModelDisplayName(clean),
      };
    }

    return { activeModelSlug: '', activeModelName: '' };
  }, [searchParams, calcContext, pathname, eventModel]);

  const gearSlotLabel = activeModelName ? `${activeModelName} Gear` : 'Gear';

  // Active state matching
  const isTrackerActive = pathname === '/' || pathname === '';
  const isInventoryActive = pathname === '/inventory';
  const isGuidesActive = pathname.startsWith('/guides') || pathname === '/winter-prep' || pathname.startsWith('/camping');
  const isCalculatorActive = pathname.startsWith('/calculator');

  const ActiveCollapsedIcon = useMemo(() => {
    if (isInventoryActive) return Ship;
    if (isGuidesActive) return BookOpen;
    if (isCalculatorActive) return Calculator;
    return Clock;
  }, [isInventoryActive, isGuidesActive, isCalculatorActive]);

  return (
    <>
      <nav
        data-testid="mobile-bottom-dock"
        aria-label="Mobile Navigation Dock"
        className={cn(
          'fixed bottom-4 z-40 md:hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          isCollapsed
            ? 'left-4 w-12 h-12 rounded-full bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/90 shadow-xl flex items-center justify-center'
            : 'left-3 right-3 mx-auto max-w-md rounded-full bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/90 shadow-2xl px-2 py-1.5'
        )}
      >
        {isCollapsed ? (
          <button
            type="button"
            data-testid="mobile-dock-expand-btn"
            aria-label="Expand navigation menu"
            onClick={(e) => {
              e.preventDefault();
              setIsCollapsed(false);
            }}
            className="w-full h-full flex items-center justify-center rounded-full text-amber-400 hover:text-amber-300 cursor-pointer touch-manipulation"
          >
            <ActiveCollapsedIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        ) : (
        <div className="grid grid-cols-5 items-center h-12 px-0.5 sm:px-1">
          {/* Slot 1: Tracker */}
          <Link
            href="/"
            data-testid="mobile-dock-tracker"
            className={`flex flex-col items-center justify-center gap-0.5 text-center py-1 transition-colors px-0.5 ${
              isTrackerActive && !isGearDrawerOpen && !isGuidesModalOpen
                ? 'text-amber-400 font-bold'
                : 'text-zinc-400 hover:text-zinc-200 font-medium'
            }`}
          >
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span className="text-[10px] tracking-tight truncate max-w-full">Tracker</span>
          </Link>

          {/* Slot 2: Live Stock */}
          <Link
            href="/inventory"
            data-testid="mobile-dock-inventory"
            className={`flex flex-col items-center justify-center gap-0.5 text-center py-1 transition-colors px-0.5 ${
              isInventoryActive && !isGearDrawerOpen && !isGuidesModalOpen
                ? 'text-amber-400 font-bold'
                : 'text-zinc-400 hover:text-zinc-200 font-medium'
            }`}
          >
            <Ship className="h-4 w-4" aria-hidden="true" />
            <span className="text-[10px] tracking-tight truncate max-w-full">Live Stock</span>
          </Link>

          {/* Slot 3: Guides (Opens Modal) */}
          <button
            type="button"
            data-testid="mobile-dock-guides"
            onClick={() => {
              setIsGearDrawerOpen(false);
              setIsGuidesModalOpen(true);
            }}
            className={`flex flex-col items-center justify-center gap-0.5 text-center py-1 transition-colors cursor-pointer px-0.5 ${
              (isGuidesActive || isGuidesModalOpen) && !isGearDrawerOpen
                ? 'text-amber-400 font-bold'
                : 'text-zinc-400 hover:text-zinc-200 font-medium'
            }`}
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            <span className="text-[10px] tracking-tight truncate max-w-full">Guides</span>
          </button>

          {/* Slot 4: Model Gear (Opens Drawer) */}
          <button
            type="button"
            data-testid="mobile-dock-gear"
            onClick={() => {
              setIsGuidesModalOpen(false);
              setIsGearDrawerOpen(true);
            }}
            className={`flex flex-col items-center justify-center gap-0.5 text-center py-1 transition-colors cursor-pointer px-0.5 ${
              isGearDrawerOpen
                ? 'text-amber-400 font-bold'
                : 'text-zinc-400 hover:text-zinc-200 font-medium'
            }`}
          >
            <Package className="h-4 w-4" aria-hidden="true" />
            <span className="text-[10px] tracking-tight truncate max-w-full">
              {gearSlotLabel}
            </span>
          </button>

          {/* Slot 5: Calculator */}
          <Link
            href="/calculator"
            data-testid="mobile-dock-calculator"
            className={`flex flex-col items-center justify-center gap-0.5 text-center py-1 transition-colors px-0.5 ${
              isCalculatorActive && !isGearDrawerOpen && !isGuidesModalOpen
                ? 'text-amber-400 font-bold'
                : 'text-zinc-400 hover:text-zinc-200 font-medium'
            }`}
          >
            <Calculator className="h-4 w-4" aria-hidden="true" />
            <span className="text-[10px] tracking-tight truncate max-w-full">Calculator</span>
          </Link>
        </div>
        )}
      </nav>

      {/* Dynamic Model Gear Drawer */}
      <MobileGearDrawer
        isOpen={isGearDrawerOpen}
        onClose={() => setIsGearDrawerOpen(false)}
        modelSlug={activeModelSlug}
        modelName={activeModelName}
      />

      {/* Guides Modal / 2-Column Card Grid */}
      <GuidesModal
        isOpen={isGuidesModalOpen}
        onClose={() => setIsGuidesModalOpen(false)}
      />
    </>
  );
}

export { GuidesModal } from '@/components/navigation/GuidesModal';
export default MobileBottomDock;
