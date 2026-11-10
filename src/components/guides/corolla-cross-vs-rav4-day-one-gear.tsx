'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle2, Sparkles, Shield, Camera, Layers, Box } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import { buildAmazonAffiliateUrl } from '@/lib/gear/affiliate';
import { MarketAssociateDisclaimer } from '@/components/guides/market-associate-disclaimer';

export interface CrossModelGearItem {
  id: string;
  title: string;
  category: string;
  badge: string;
  badgeVariant?: 'default' | 'secondary' | 'outline' | 'destructive';
  priceCad: string;
  priceUsd: string;
  description: string;
  note?: string;
  searchFallback: string;
  asin?: string;
  ctaText: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const COROLLA_CROSS_DAY_ONE_GEAR: CrossModelGearItem[] = [
  {
    id: 'tuxmat-corolla-cross',
    title: 'TuxMat Custom-Fit All-Weather Liners',
    category: 'Interior Armor',
    badge: 'Canadian Winter Ready',
    badgeVariant: 'secondary',
    priceCad: '~$240 CAD',
    priceUsd: '~$180 USD',
    description:
      'Laser-scanned maximum-coverage high-wall floor armor built specifically for the Corolla Cross cabin. Engineered to protect interior carpet from harsh Canadian winter road salt, melting snow slush, and gravel brine.',
    note: 'Deep threshold tub and full driver dead-pedal protection lock out carpet stains.',
    searchFallback: 'TuxMat Toyota Corolla Cross custom all weather floor mats liners',
    ctaText: 'Search TuxMat on Amazon ↗',
    icon: Shield,
  },
  {
    id: 'fitcamx-corolla-cross',
    title: 'FitcamX 4K OEM Integrated Dashcam',
    category: 'Stealth Optics',
    badge: 'Mirror-Tap Plug & Play',
    badgeVariant: 'secondary',
    priceCad: '~$210 CAD',
    priceUsd: '~$155 USD',
    description:
      'Discreet factory-look 4K UHD dashcam that replaces the OEM rearview mirror plastic shroud. Plugs directly into the factory Toyota Safety Sense (TSS) camera power harness with zero wire slicing or fuse-box routing.',
    note: 'Ultra-crisp 4K Sony sensor with HDR night vision and built-in Wi-Fi smartphone app access.',
    searchFallback: 'Fitcamx dash cam Toyota Corolla Cross 4K OEM',
    ctaText: 'Search FitcamX on Amazon ↗',
    icon: Camera,
  },
  {
    id: 'spigen-screen-protector',
    title: 'Spigen 8" / 10.5" Tempered Glass Screen Protector',
    category: 'Touchscreen Defense',
    badge: 'Anti-Glare 9H',
    badgeVariant: 'secondary',
    priceCad: '~$35 CAD',
    priceUsd: '~$25 USD',
    description:
      'Optical-grade 9H tempered glass screen protector shielding the prominent Toyota Multimedia center touchscreen from harsh sun reflections, scratches, and oily fingerprint smudges.',
    note: 'Oleophobic coating wipes clean instantly with zero touch latency or display discoloration.',
    searchFallback: 'Spigen screen protector Toyota Corolla Cross 8 inch 10.5 inch',
    ctaText: 'Search Spigen on Amazon ↗',
    icon: Layers,
  },
  {
    id: 'console-organizer-tray',
    title: 'Center Console Dual-Tier Drop-In Organizer Tray',
    category: 'Interior Storage',
    badge: 'Essential Organization',
    badgeVariant: 'secondary',
    priceCad: '~$25 CAD',
    priceUsd: '~$18 USD',
    description:
      'Custom drop-in divider tray engineered for the deep Corolla Cross armrest console bin. Segregates coins, cards, and sunglasses on top while preserving lower cavity storage for charging cables and larger items.',
    note: 'Textured non-slip rubber inserts silence rattling and maintain access to 12V / USB charging ports.',
    searchFallback: 'Center console organizer tray Toyota Corolla Cross',
    ctaText: 'Search Console Tray on Amazon ↗',
    icon: Box,
  },
];

export function CorollaCrossVsRav4DayOneGearShelf() {
  const { market, isUs } = useMarket();

  return (
    <section className="space-y-6" aria-label="Curated Day-1 Delivery Gear Shelf">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Day-1 Delivery Protection Essentials</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Curated Day-1 Delivery Gear Shelf
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
            Community-verified accessories engineered for Corolla Cross &amp; RAV4 protection, severe Canadian winter defense, and cockpit ergonomics.
          </p>
        </div>
        <div className="text-xs text-zinc-500 font-medium shrink-0">
          Localized for: <strong className="text-zinc-900 dark:text-zinc-200">{isUs ? '🇺🇸 United States (USD)' : '🇨🇦 Canada (CAD)'}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {COROLLA_CROSS_DAY_ONE_GEAR.map((item) => {
          const destinationHref = item.asin
            ? buildAmazonAffiliateUrl({
                asin: item.asin,
                searchQuery: item.searchFallback,
                market,
              })
            : buildAmazonAffiliateUrl(item.searchFallback, market);

          const price = isUs ? item.priceUsd : item.priceCad;
          const IconComponent = item.icon;

          return (
            <Card
              key={item.id}
              className="flex flex-col justify-between border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs hover:border-amber-500/50 transition-all duration-200"
            >
              <CardHeader className="space-y-2.5 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <IconComponent className="h-4 w-4 text-amber-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      {item.category}
                    </span>
                  </div>
                  {item.badge && (
                    <Badge
                      variant={item.badgeVariant || 'secondary'}
                      className="text-[10px] whitespace-nowrap"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                  {item.title}
                </CardTitle>

                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-base font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                    {price}
                  </span>
                </div>

                <CardDescription className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pt-1">
                  {item.description}
                </CardDescription>

                {item.note && (
                  <div className="inline-flex items-start gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/60 p-2 rounded-md">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item.note}</span>
                  </div>
                )}
              </CardHeader>

              <CardContent className="p-4 sm:p-5 pt-0">
                <Button
                  asChild
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-semibold gap-1.5 shadow-xs cursor-pointer"
                >
                  <a
                    href={destinationHref}
                    target="_blank"
                    rel="sponsored noopener noreferrer nofollow"
                  >
                    <span>{item.ctaText}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="pt-2">
        <MarketAssociateDisclaimer />
      </div>
    </section>
  );
}

export default CorollaCrossVsRav4DayOneGearShelf;
