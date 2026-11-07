'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, ShieldCheck, Tag, CheckCircle2, Wrench, Sparkles } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import { buildAmazonAffiliateUrl } from '@/lib/affiliate';
import { MarketAssociateDisclaimer } from '@/components/guides/market-associate-disclaimer';

interface GearProduct {
  id: string;
  title: string;
  category: string;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'outline' | 'destructive';
  priceCad: string;
  priceUsd: string;
  description: string;
  note?: string;
  promoCode?: string;
  isPartner?: boolean;
  proxyUrl?: string;
  searchFallback: string;
  ctaText: string;
}

const SIENNA_DAY_ONE_GEAR: GearProduct[] = [
  {
    id: 'floor-liners',
    title: '3-Row High-Wall All-Weather Floor Liners',
    category: 'Interior Armor',
    badge: 'Direct Fit (7 & 8-Pass)',
    badgeVariant: 'secondary',
    priceCad: '$240 – $280 CAD',
    priceUsd: '$180 – $210 USD',
    description:
      'Laser-measured high-wall protection engineered specifically for the 4th-gen Sienna. Accommodates the 25-inch Super Long Slide track travel while locking out Canadian winter slush and road salt.',
    searchFallback: 'Toyota Sienna all weather floor mats 2021-2026',
    ctaText: 'Check Amazon Stock ↗',
  },
  {
    id: 'muslogy-bridge',
    title: 'Muslogy Center Console Sliding Organizer & Bridge Box',
    category: 'Cabin Storage',
    badge: 'Partner Deal · 2% Off',
    badgeVariant: 'default',
    priceCad: '$28 – $36 CAD',
    priceUsd: '$22 – $28 USD',
    description:
      'Custom-molded ABS upper sliding organizer and lower cavity tray. Tames the massive open cavern beneath the flying bridge console and stops phones and keys from sliding into footwells.',
    promoCode: 'TOYOTAWAITS',
    isPartner: true,
    proxyUrl: '/out/muslogy-sienna',
    searchFallback: 'Toyota Sienna center console organizer bridge tray',
    ctaText: 'Claim 2% Off Muslogy ↗',
  },
  {
    id: 'curt-hitch',
    title: 'CURT 13470 Class 3 Trailer Hitch Receiver (2")',
    category: 'Towing & Cargo',
    badge: 'Class 3 (3,500 lbs)',
    badgeVariant: 'secondary',
    priceCad: '$310 – $360 CAD',
    priceUsd: '$230 – $270 USD',
    description:
      'The gold-standard Class 3 bolt-on receiver for bike racks, hitch baskets, and camping trailers. Mounts cleanly to existing chassis weld nuts with zero bumper trimming or fascia modification.',
    note: '100% bolt-on, zero bumper trimming.',
    searchFallback: 'Curt 13470 Toyota Sienna hitch',
    ctaText: 'View Hitch on Amazon ↗',
  },
  {
    id: 'fitcamx-dashcam',
    title: 'FitcamX 4K OEM Integrated Dashcam',
    category: 'Safety & Tech',
    badge: 'OEM Stealth Tap',
    badgeVariant: 'secondary',
    priceCad: '$190 – $240 CAD',
    priceUsd: '$140 – $180 USD',
    description:
      'Discreet OEM replacement shell for the TSS 2.0 / 2.5 rearview mirror shroud. Delivers crisp 4K Sony-sensor footage with zero dangling wires down the windshield or A-pillar trim.',
    note: 'Plug-and-play into TSS rear-view mirror harness without fuse tapping.',
    searchFallback: 'Fitcamx dash cam Toyota Sienna OEM 4K',
    ctaText: 'View Camera on Amazon ↗',
  },
];

export function SiennaDayOneGearShelf() {
  const { market, isUs } = useMarket();

  return (
    <section className="space-y-6" aria-label="Direct-Fit Delivery Day Gear Shelf">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-500/20 dark:border-amber-800/50 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Essential Day-1 Fitments (2021–2027)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Direct-Fit Delivery Day Gear Shelf
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
            Because 2026 and 2027 Siennas share the exact interior geometry, floor plan, and TSS housing, these community-vetted accessories fit both model years without modification.
          </p>
        </div>
        <div className="text-xs text-zinc-500 font-medium shrink-0">
          Localized for: <strong className="text-zinc-900 dark:text-zinc-200">{isUs ? '🇺🇸 United States (USD)' : '🇨🇦 Canada (CAD)'}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {SIENNA_DAY_ONE_GEAR.map((item) => {
          const destinationHref = item.proxyUrl || buildAmazonAffiliateUrl(item.searchFallback, market);
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
                      className={
                        item.isPartner
                          ? 'bg-amber-500 text-zinc-950 font-bold hover:bg-amber-400 text-[10px]'
                          : 'text-[10px]'
                      }
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                  {item.title}
                </CardTitle>

                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-base font-extrabold text-amber-700 dark:text-amber-300 font-mono">
                    {price}
                  </span>
                  {item.promoCode && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      <Tag className="h-3 w-3" />
                      Code: {item.promoCode}
                    </span>
                  )}
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
                  className={
                    item.isPartner
                      ? 'w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs gap-1.5 shadow-xs cursor-pointer'
                      : 'w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-semibold gap-1.5 shadow-xs cursor-pointer'
                  }
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

      {/* Compliance / Disclosure Footer */}
      <div className="pt-2">
        <MarketAssociateDisclaimer />
      </div>
    </section>
  );
}
