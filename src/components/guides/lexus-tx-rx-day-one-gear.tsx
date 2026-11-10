'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle2, Sparkles, Shield, Camera, Layers, Key } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import { buildAmazonAffiliateUrl } from '@/lib/gear/affiliate';
import { MarketAssociateDisclaimer } from '@/components/guides/market-associate-disclaimer';

export interface LexusGearItem {
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

export const LEXUS_TX_RX_DAY_ONE_GEAR: LexusGearItem[] = [
  {
    id: 'spigen-screen-protector',
    title: 'Spigen GlasTR 14" Matte Screen Protector',
    category: 'Infotainment Armor',
    badge: '14" Lexus Interface Fit',
    badgeVariant: 'secondary',
    priceCad: '$32 – $38 CAD',
    priceUsd: '$24 – $29 USD',
    description:
      'Precision-engineered 9H matte tempered glass for the dominant 14-inch Lexus Interface touchscreen found in both the TX and RX. Cuts harsh cabin reflection, eliminates fingerprint oils, and protects the high-cost digitizer against accidental impacts.',
    note: 'Auto-align EZ-Fit installation tray guarantees zero air bubbles.',
    searchFallback: 'Spigen 14 inch screen protector Lexus TX RX',
    ctaText: 'Search Screen Protector ↗',
    icon: Layers,
  },
  {
    id: 'fitcamx-4k-dashcam',
    title: 'FitcamX 4K OEM Integrated Mirror Dashcam',
    category: 'Factory Stealth Optics',
    badge: 'Zero Wire Splicing',
    badgeVariant: 'secondary',
    priceCad: '$220 – $280 CAD',
    priceUsd: '$165 – $210 USD',
    description:
      'OEM-fit stealth casing that snaps cleanly behind the rearview mirror housing in place of the factory plastic shroud. Taps directly into the auto-dimming mirror harness with plug-and-play ease—no dangling wires or fuse tap routing.',
    note: '4K UHD Sony sensor with continuous loop recording and Wi-Fi phone playback.',
    searchFallback: 'Fitcamx dash cam Lexus RX NX TX GX OEM 4K',
    ctaText: 'Search FitcamX on Amazon ↗',
    icon: Camera,
  },
  {
    id: 'tuxmat-floor-liners',
    title: 'TuxMat High-Wall All-Weather Floor Liners',
    category: 'Sub-Zero Floor Defense',
    badge: 'Maximum Salt/Slush Coverage',
    badgeVariant: 'secondary',
    priceCad: '$260 – $340 CAD',
    priceUsd: '$195 – $255 USD',
    description:
      'Laser-measured, maximum-coverage floor armor engineered for Canadian winters. Deep reservoir walls protect past the door sill ridges and up the transmission tunnel, sealing luxury carpeting against toxic calcium salt stains and slush seepage.',
    note: 'Available in custom cuts for RX 2-row and TX 3-row (bench or captain’s chairs).',
    searchFallback: 'TuxMat Lexus TX RX all weather floor mats liners',
    ctaText: 'Search TuxMat on Amazon ↗',
    icon: Shield,
  },
  {
    id: 'ticonn-faraday-pouches',
    title: 'TICONN RFID Dual Faraday Key Signal Blocker Pouches',
    category: 'Anti-Theft Deterrence',
    badge: 'Theft Prevention',
    badgeVariant: 'secondary',
    priceCad: '$16 – $24 CAD',
    priceUsd: '$12 – $18 USD',
    description:
      'Dual-layer metallic nano-mesh fabric blocks 100% of RF signals emitted by Lexus smart fobs. Essential physical line-of-defense against driveway relay attacks and key cloning targeting luxury SUVs in the GTA, Montreal, and Lower Mainland.',
    note: 'Dual pouch pack covers primary key and household spare.',
    searchFallback: 'Faraday bag key fob signal protector pouch',
    asin: 'B07MDF5TX9',
    ctaText: 'Check Faraday Pouches ↗',
    icon: Key,
  },
];

export function LexusTxRxDayOneGearShelf() {
  const { market, isUs } = useMarket();

  return (
    <section className="space-y-6" aria-label="Day-1 Luxury Delivery Gear Shelf">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Curated Luxury Fitments</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Day-1 Delivery Gear Shelf: Essential RX &amp; TX Protection
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
            Community-verified accessories engineered specifically for modern GA-K Lexus crossover cockpits and Canadian road conditions.
          </p>
        </div>
        <div className="text-xs text-zinc-500 font-medium shrink-0">
          Localized for: <strong className="text-zinc-900 dark:text-zinc-200">{isUs ? '🇺🇸 United States (USD)' : '🇨🇦 Canada (CAD)'}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {LEXUS_TX_RX_DAY_ONE_GEAR.map((item) => {
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

export default LexusTxRxDayOneGearShelf;
