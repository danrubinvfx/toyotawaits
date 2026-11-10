'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle2, Sparkles, Shield, Camera, Layers, Key } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import { buildAmazonAffiliateUrl } from '@/lib/gear/affiliate';
import { MarketAssociateDisclaimer } from '@/components/guides/market-associate-disclaimer';

export interface GrandHighlanderTxGearItem {
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

export const GRAND_HIGHLANDER_TX_DAY_ONE_GEAR: GrandHighlanderTxGearItem[] = [
  {
    id: 'tuxmat-high-wall-liners',
    title: 'TuxMat High-Wall 3-Row Floor Liners',
    category: 'Interior Floor Armor',
    badge: '3-Row Maximum Coverage',
    badgeVariant: 'secondary',
    priceCad: '$290 – $360 CAD',
    priceUsd: '$210 – $270 USD',
    description:
      'Laser-measured, maximum-coverage floor defense tailored for TNGA-K three-row floor pans. Raised perimeter ridges guard door sill lips, dead pedals, and 2nd/3rd row pathways against corrosive Canadian road salt brine and winter slush.',
    note: 'Custom cutouts engineered for both 7-seat (captain chairs) and 8-seat (bench) configurations in Grand Highlander and Lexus TX.',
    searchFallback: 'TuxMat Toyota Grand Highlander Lexus TX floor mats',
    ctaText: 'Search TuxMat Liners ↗',
    icon: Shield,
  },
  {
    id: 'spigen-tempered-screen-protectors',
    title: 'Spigen GlasTR Tempered Glass Display Protectors',
    category: 'Infotainment Armor',
    badge: '12.3" GH / 14" TX Interface',
    badgeVariant: 'secondary',
    priceCad: '$34 – $42 CAD',
    priceUsd: '$26 – $32 USD',
    description:
      'Ultra-clear 9H hardness tempered glass custom-cut for the 12.3-inch Toyota Audio Multimedia screen or the massive 14.0-inch Lexus Interface touchscreen. Features oleophobic anti-fingerprint coating and reflection-damping clarity.',
    note: 'Includes EZ-Fit alignment housing frame for guaranteed bubble-free, dust-sealed installation.',
    searchFallback: 'Spigen screen protector Toyota Grand Highlander Lexus TX 12.3 14 inch',
    ctaText: 'Search Screen Protector ↗',
    icon: Layers,
  },
  {
    id: 'fitcamx-4k-oem-dashcam',
    title: 'FitcamX 4K OEM Integrated Mirror Dashcam',
    category: 'Factory Stealth Optics',
    badge: 'Plug-and-Play Mirror Tap',
    badgeVariant: 'secondary',
    priceCad: '$210 – $275 CAD',
    priceUsd: '$160 – $210 USD',
    description:
      'Stealth OEM-matched replacement cover that replaces the plastic rearview mirror housing. Draws power straight from the factory auto-dimming mirror connector with zero dangling cords, zero fuse-box tapping, and full TSS 3.0 / LSS+ 3.0 camera clearance.',
    note: '4K Sony Starvis sensor with loop recording, G-sensor collision lock, and integrated iOS/Android Wi-Fi companion app.',
    searchFallback: 'Fitcamx 4K dash cam Toyota Grand Highlander Lexus TX OEM',
    ctaText: 'Search FitcamX on Amazon ↗',
    icon: Camera,
  },
  {
    id: 'ticonn-faraday-pouches',
    title: 'TICONN Dual RFID Faraday Key Signal Blocker Pouches',
    category: 'Anti-Theft Deterrence',
    badge: 'Driveway Relay Defense',
    badgeVariant: 'secondary',
    priceCad: '$16 – $24 CAD',
    priceUsd: '$12 – $18 USD',
    description:
      'Dual-layer metallic nano-mesh fabric blocks 100% of RF signals emitted by Toyota and Lexus smart fobs. Crucial passive protection against relay-theft attacks targeting high-value 3-row SUVs in Ontario and Quebec.',
    note: 'Twin pack safeguards both the primary master fob and secondary household spare.',
    searchFallback: 'Faraday bag key fob signal protector pouch',
    ctaText: 'Check Faraday Pouches ↗',
    icon: Key,
  },
];

export function GrandHighlanderTxDayOneGearShelf() {
  const { market, isUs } = useMarket();

  return (
    <section className="space-y-6" aria-label="Day-1 Luxury Delivery Gear Shelf">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Curated TNGA-K Fitments</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Day-1 Delivery Gear Shelf: Grand Highlander &amp; Lexus TX Protection
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
            Community-verified accessories engineered specifically for Toyota and Lexus TNGA-K 3-row architectures and Canadian road conditions.
          </p>
        </div>
        <div className="text-xs text-zinc-500 font-medium shrink-0">
          Localized for: <strong className="text-zinc-900 dark:text-zinc-200">{isUs ? '🇺🇸 United States (USD)' : '🇨🇦 Canada (CAD)'}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {GRAND_HIGHLANDER_TX_DAY_ONE_GEAR.map((item) => {
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

export default GrandHighlanderTxDayOneGearShelf;
