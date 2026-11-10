'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle2, Sparkles, Shield, Camera, Gauge, Anchor } from 'lucide-react';
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

export const RAV4_SIENNA_DAY_ONE_GEAR: CrossModelGearItem[] = [
  {
    id: 'tuxmat-high-wall',
    title: 'TuxMat High-Wall All-Weather Floor Liners',
    category: 'Interior Armor',
    badge: 'Canadian Winter Ready',
    badgeVariant: 'secondary',
    priceCad: '$220 – $280 CAD',
    priceUsd: '$165 – $210 USD',
    description:
      'Laser-scanned, maximum-coverage floor liners engineered for severe Canadian winter slush and road salt. Custom-molded for either the 2-row RAV4 or 3-row Sienna cabin pan, offering high-perimeter retention walls that lock out carpet stains.',
    note: 'Dead-pedal and threshold coverage prevents salt brine buildup.',
    searchFallback: 'TuxMat Toyota RAV4 Sienna all weather floor mats',
    ctaText: 'Search TuxMat on Amazon ↗',
    icon: Shield,
  },
  {
    id: 'fitcamx-4k-dashcam',
    title: 'FitcamX 4K OEM Integrated Mirror Dashcam',
    category: 'Stealth Optics',
    badge: 'Factory Clean Look',
    badgeVariant: 'secondary',
    priceCad: '$190 – $240 CAD',
    priceUsd: '$140 – $180 USD',
    description:
      'Direct plug-and-play 4K UHD dashcam that replaces the factory plastic rearview mirror shroud on both RAV4 and Sienna. Taps cleanly into the Toyota Safety Sense (TSS) camera power harness with zero wire splicing or fuse box routing.',
    note: 'Sony Starvis sensor with loop recording and integrated Wi-Fi app access.',
    searchFallback: 'Fitcamx dash cam Toyota RAV4 Sienna OEM 4K',
    ctaText: 'Search FitcamX on Amazon ↗',
    icon: Camera,
  },
  {
    id: 'air-lift-1000-springs',
    title: 'Air Lift 1000 Helper Springs (Kit #60860)',
    category: 'Suspension Leveling',
    badge: 'Towing & Bike Racks',
    badgeVariant: 'secondary',
    priceCad: '$140 – $180 CAD',
    priceUsd: '$105 – $135 USD',
    description:
      'In-coil polyurethane air helper springs tailored specifically for the 4th-gen Sienna rear suspension. Eliminates rear-end squat, bottoming out over driveways, and headlight misaiming when loaded with 4+ bikes or vacation luggage.',
    note: 'Adjustable from 5 to 35 PSI to dial in ride firmness for road trips.',
    searchFallback: 'Air Lift 60860 helper springs Toyota Sienna',
    ctaText: 'Search Air Lift on Amazon ↗',
    icon: Gauge,
  },
  {
    id: 'curt-13470-hitch',
    title: 'Curt 13470 Class 3 Trailer Hitch Receiver (2")',
    category: 'Towing & Utility',
    badge: '3,500 lb Rated',
    badgeVariant: 'secondary',
    priceCad: '$310 – $360 CAD',
    priceUsd: '$230 – $270 USD',
    description:
      'Heavy-duty 2-inch receiver hitch engineered for standard chassis weld nuts. Provides 3,500 lbs gross trailer weight rating and 525 lbs tongue weight rating—ideal for heavy platform bike trays, cargo baskets, or light camping trailers.',
    note: '100% bolt-on installation with zero frame drilling or bumper skin cutting.',
    searchFallback: 'Curt 13470 trailer hitch receiver Toyota Sienna',
    ctaText: 'Search Curt 13470 on Amazon ↗',
    icon: Anchor,
  },
];

export function Rav4VsSiennaDayOneGearShelf() {
  const { market, isUs } = useMarket();

  return (
    <section className="space-y-6" aria-label="Day-1 Family Delivery Gear Shelf">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Cross-Shopping Delivery Essentials</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Day-1 Family Gear Shelf: RAV4 &amp; Sienna Protection
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
            Community-verified accessories engineered for TNGA-K platform longevity, all-weather defense, and family hauling duties.
          </p>
        </div>
        <div className="text-xs text-zinc-500 font-medium shrink-0">
          Localized for: <strong className="text-zinc-900 dark:text-zinc-200">{isUs ? '🇺🇸 United States (USD)' : '🇨🇦 Canada (CAD)'}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {RAV4_SIENNA_DAY_ONE_GEAR.map((item) => {
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

export default Rav4VsSiennaDayOneGearShelf;
