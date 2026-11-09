'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle2, Sparkles } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import { buildAmazonAffiliateUrl } from '@/lib/affiliate';
import { MarketAssociateDisclaimer } from '@/components/guides/market-associate-disclaimer';

export interface GrandHighlanderGearItem {
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
  ctaText: string;
}

export const GRAND_HIGHLANDER_DAY_ONE_GEAR: GrandHighlanderGearItem[] = [
  {
    id: 'tuxmat-floor-liners',
    title: 'TuxMat Custom High-Wall 3-Row Floor Liners',
    category: 'Interior Armor',
    badge: 'Confirmed Fit 2024–2027',
    badgeVariant: 'secondary',
    priceCad: '$290 – $340 CAD',
    priceUsd: '$210 – $250 USD',
    description:
      'Laser-scanned maximum-coverage floor liners engineered specifically for the 3-row Grand Highlander floor pan. Features high perimeter wall retention that seals out Canadian winter slush, mud, and road salt from the front footwells back to the 3rd row.',
    note: 'Full dead-pedal coverage and raised sill dams for captain chairs and bench rows.',
    searchFallback: 'TuxMat Toyota Grand Highlander floor mats',
    ctaText: 'Check TuxMat on Amazon ↗',
  },
  {
    id: 'spigen-screen-protector',
    title: 'Spigen Tempered Glass Screen Protector (12.3-inch)',
    category: 'Display Protection',
    badge: '9H Oleophobic Glass',
    badgeVariant: 'secondary',
    priceCad: '$35 – $45 CAD',
    priceUsd: '$28 – $35 USD',
    description:
      'Precision-engineered 9H hardness tempered glass protector tailored for the 12.3-inch Toyota Audio Multimedia touchscreen. Shields against glare, scratches, and micro-abrasions while preventing oily fingerprint buildup.',
    note: 'Includes EZ-Fit installation frame for perfect alignment and bubble-free application.',
    searchFallback: 'Spigen 12.3 inch screen protector Toyota Grand Highlander',
    ctaText: 'Check Screen Protector ↗',
  },
  {
    id: 'curt-trailer-hitch',
    title: 'CURT Class 3 Trailer Hitch Receiver (2-inch)',
    category: 'Towing & Cargo',
    badge: 'Class 3 (5,000 lbs)',
    badgeVariant: 'secondary',
    priceCad: '$320 – $380 CAD',
    priceUsd: '$240 – $290 USD',
    description:
      'Direct-fit Class 3 2-inch receiver hitch engineered for the Grand Highlander TNGA-K platform. Ideal for rear bike racks, hitch-mounted cargo boxes, and light travel trailers with zero cutting or bumper trimming.',
    note: '100% bolt-on installation to factory chassis weld nuts; maintains hands-free sensor clearance.',
    searchFallback: 'Curt trailer hitch receiver Toyota Grand Highlander',
    ctaText: 'Check Hitch on Amazon ↗',
  },
];

export function GrandHighlanderDayOneGearShelf() {
  const { market, isUs } = useMarket();

  return (
    <section className="space-y-6" aria-label="Direct-Fit Grand Highlander Day-1 Gear Shelf">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Essential Day-1 Fitments (2024–2027)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Delivery Day Gear Shelf: Vetted 2026 &amp; 2027 Fitments
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
            Community-verified accessories engineered to match cabin dimensions, display geometry, and chassis mounting points across both 2026 and 2027 model years.
          </p>
        </div>
        <div className="text-xs text-zinc-500 font-medium shrink-0">
          Localized for: <strong className="text-zinc-900 dark:text-zinc-200">{isUs ? '🇺🇸 United States (USD)' : '🇨🇦 Canada (CAD)'}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {GRAND_HIGHLANDER_DAY_ONE_GEAR.map((item) => {
          const destinationHref = buildAmazonAffiliateUrl(item.searchFallback, market);
          const price = isUs ? item.priceUsd : item.priceCad;

          return (
            <Card
              key={item.id}
              className="flex flex-col justify-between border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs hover:border-amber-500/50 transition-all duration-200"
            >
              <CardHeader className="space-y-2.5 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    {item.category}
                  </span>
                  {item.badge && (
                    <Badge
                      variant={item.badgeVariant || 'secondary'}
                      className="text-[10px]"
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

export default GrandHighlanderDayOneGearShelf;
