'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import { buildAmazonAffiliateUrl } from '@/lib/affiliate';
import { MarketAssociateDisclaimer } from '@/components/guides/market-associate-disclaimer';

export interface Rav4GearItem {
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

export const RAV4_DAY_ONE_GEAR: Rav4GearItem[] = [
  {
    id: 'evse-nacs-j1772',
    title: 'Tesla Universal Wall Connector (NACS & J1772 Level 2 EVSE)',
    category: 'Level 2 Charging',
    badge: '2027 Ready',
    badgeVariant: 'default',
    priceCad: '$780 – $850 CAD',
    priceUsd: '$580 – $650 USD',
    description:
      'Dual-standard home Level 2 charging with integrated Magic Dock adapter. Delivers seamless 11 kW AC charging for upcoming 2027 NACS vehicles while natively supporting current 2026 J1772 ports with zero external dongles.',
    note: 'Future-proof Level 2 EVSE supporting both native NACS and legacy J1772 vehicles.',
    searchFallback: 'Tesla Universal Wall Connector NACS J1772 Level 2 EVSE',
    ctaText: 'View EVSE on Amazon ↗',
  },
  {
    id: 'tuxmat-floor-liners',
    title: 'TuxMat Laser-Fit All-Weather Floor Liners',
    category: 'Interior Armor',
    badge: 'Confirmed Fit 2019-2027',
    badgeVariant: 'secondary',
    priceCad: '$190 – $240 CAD',
    priceUsd: '$140 – $180 USD',
    description:
      'Maximum-coverage custom laser-scanned floor liners engineered specifically for the Toyota RAV4. Raised perimeter dams trap winter slush, mud, and road salt while anchoring securely to factory retention posts.',
    note: 'Confirmed direct fitment across 2019–2027 gas, hybrid, and PHEV floor pans.',
    searchFallback: 'TuxMat Toyota RAV4 all weather floor mats',
    ctaText: 'View TuxMat on Amazon ↗',
  },
  {
    id: 'tss-dashcam',
    title: 'FitcamX 4K OEM Integrated Dashcam / Backup Solution',
    category: 'Safety & Tech',
    badge: 'OEM Stealth Tap',
    badgeVariant: 'secondary',
    priceCad: '$190 – $240 CAD',
    priceUsd: '$140 – $180 USD',
    description:
      'Factory-look dashcam seamlessly replacing the rearview mirror housing with crisp 4K Sony Starvis recording. Taps mirror power with zero loose cables dangling down the windshield.',
    note: 'Essential for 2026 and entry-level 2027 trims without the factory TSS 4.0 Drive Recorder. Higher 2027 grades feature integrated recording.',
    searchFallback: 'Fitcamx 4K dash cam Toyota RAV4',
    ctaText: 'View Dashcam on Amazon ↗',
  },
  {
    id: 'spigen-screen-protector',
    title: 'Spigen Tempered Glass Screen Protector (10.5" / 12.3")',
    category: 'Display Protection',
    badge: '9H Tempered Glass',
    badgeVariant: 'secondary',
    priceCad: '$35 – $45 CAD',
    priceUsd: '$28 – $35 USD',
    description:
      'Oleophobic matte tempered glass shield tailored specifically for Toyota Audio Multimedia displays. Eliminates daylight cabin glare and shields touchscreen digitizers against fingerprints and scratches.',
    note: 'Includes EZ-Fit alignment frame for perfect zero-bubble installation on 10.5" and 12.3" screens.',
    searchFallback: 'Spigen screen protector Toyota RAV4',
    ctaText: 'Check Screen Protector ↗',
  },
];

export function Rav4DayOneGearShelf() {
  const { market, isUs } = useMarket();

  return (
    <section className="space-y-6" aria-label="Direct-Fit Delivery Day Gear Shelf">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Essential Day-1 Fitments (2019–2027)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Delivery Day Gear Shelf: Tested 2026 &amp; 2027 Fitments
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
            Vetted accessories engineered to match cabin dimensions, high-voltage charging standards, and windshield sensor profiles across both model years.
          </p>
        </div>
        <div className="text-xs text-zinc-500 font-medium shrink-0">
          Localized for: <strong className="text-zinc-900 dark:text-zinc-200">{isUs ? '🇺🇸 United States (USD)' : '🇨🇦 Canada (CAD)'}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {RAV4_DAY_ONE_GEAR.map((item) => {
          const destinationHref = buildAmazonAffiliateUrl(item.searchFallback, market);
          const price = isUs ? item.priceUsd : item.priceCad;

          return (
            <Card
              key={item.id}
              className="flex flex-col justify-between border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs hover:border-red-500/50 transition-all duration-200"
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
                        item.badge === '2027 Ready'
                          ? 'bg-emerald-600 text-white font-bold hover:bg-emerald-500 text-[10px]'
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
                  <span className="text-base font-extrabold text-red-600 dark:text-red-400 font-mono">
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

export default Rav4DayOneGearShelf;
