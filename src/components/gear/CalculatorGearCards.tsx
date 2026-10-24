'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck,
  Video,
  Zap,
  Layers,
  ExternalLink,
  ShoppingBag,
  CheckCircle2,
} from 'lucide-react';
import { useMarket } from '@/context/MarketContext';

export interface VettedProduct {
  id: string;
  category: string;
  brand: string;
  title: string;
  description: string;
  asin: string;
  bullets: string[];
  buttonText: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

export const VETTED_PRODUCTS: VettedProduct[] = [
  {
    id: 'floor-liners',
    category: 'Interior Protection',
    brand: 'TuxMat / 3D MAXpider',
    title: 'All-Weather TPE Floor Liners',
    description: 'Laser-measured precision fit designed to withstand Canadian salt, slush, mud, and everyday dirt.',
    asin: 'B09GLVMB76',
    bullets: [
      'Maximum high-wall tub coverage up to center console',
      'Cold-flexible down to -40°C without curling or cracking',
      'Engineered hybrid battery intake vent clearance',
      'OEM factory retention hook snap-in compatibility',
    ],
    buttonText: 'View All-Weather Liners',
    icon: Layers,
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'dashcam',
    category: 'Vehicle Safety & Electronics',
    brand: 'FITCAMX / VIOFO',
    title: 'Integrated OEM-Fit 4K Dashcam',
    description: 'Seamless factory appearance replacing the rear-view mirror cover with no exposed dangling cords.',
    asin: 'B09GFNZK3C',
    bullets: [
      'Plug-and-play harness taps TSS 3.0 sensor / mirror socket',
      '4K Sony Starvis sensor with ultra-crisp HDR night vision',
      'Zero windshield clutter, preserves factory aesthetics',
      'Built-in Wi-Fi and instant smartphone video export',
    ],
    buttonText: 'View OEM-Fit Dashcams',
    icon: Video,
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'evse-charger',
    category: 'EV Home Charging',
    brand: 'Grizzl-E Classic 40A / Emporia',
    title: 'Level 2 Home EVSE Charger',
    description: 'Heavy-duty 40A / 9.6 kW fast charger to fully charge your Toyota PHEV in under 2.5 hours.',
    asin: 'B082LMVSLY',
    bullets: [
      'NEMA 14-50 plug or hardwire capable with flexible 24ft cable',
      'Cast-aluminum NEMA 4 sub-zero Canadian winter weatherproofing',
      'Energy Star certified and eligible for utility rebate programs',
      'Universal J1772 connector compatible with all Toyota PHEVs',
    ],
    buttonText: 'View Home EVSE',
    icon: Zap,
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    id: 'screen-protector',
    category: 'Cabin Accessories',
    brand: 'Spigen / Muslogy',
    title: 'Matte Anti-Glare Infotainment Screen Protector & Console Organizer',
    description: 'Essential cockpit upgrades to protect touch displays from scratches and maximize storage.',
    asin: 'B0D8XQ99P3',
    bullets: [
      '9H hardness matte oleophobic glass kills fingerprints & glare',
      'Precision fit for 10.5" and 12.3" Toyota Multimedia displays',
      'Drop-in multi-tier center console armrest divider tray',
      'Anti-slip silicone coin & smartphone compartment inserts',
    ],
    buttonText: 'View Cabin Upgrades',
    icon: ShieldCheck,
    iconBg: 'bg-purple-500/10 dark:bg-purple-500/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
];

export interface CalculatorGearCardsProps {
  className?: string;
}

export function CalculatorGearCards({ className }: CalculatorGearCardsProps) {
  const { isUs } = useMarket();

  const getAffiliateUrl = (asin: string) => {
    if (isUs) {
      return `https://www.amazon.com/dp/${asin}/?tag=toyotawaits07-20`;
    }
    return `https://www.amazon.ca/dp/${asin}/?tag=toyotawaits-20`;
  };

  return (
    <section
      aria-labelledby="recommended-products-heading"
      className={`space-y-4 ${className ?? ''}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-500 uppercase tracking-wider">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Essential Gear</span>
          </div>
          <h2
            id="recommended-products-heading"
            className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100"
          >
            Recommended Products
          </h2>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md">
          Community-tested accessories and equipment tailored for new Toyota Hybrid (HEV) and Plug-in Hybrid (PHEV) vehicles.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {VETTED_PRODUCTS.map((prod) => {
          const Icon = prod.icon;
          const affiliateUrl = getAffiliateUrl(prod.asin);

          return (
            <Card
              key={prod.id}
              className="flex flex-col justify-between border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
            >
              <CardHeader className="p-3.5 pb-2 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className={`p-1.5 rounded-lg ${prod.iconBg} ${prod.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-medium border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                  >
                    {prod.category}
                  </Badge>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">
                    {prod.brand}
                  </span>
                  <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2">
                    {prod.title}
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="p-3.5 pt-0 space-y-3 flex-1 flex flex-col justify-between">
                <ul className="space-y-1.5 text-[11px] text-zinc-600 dark:text-zinc-400">
                  {prod.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-tight">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full h-8 min-h-[32px] text-xs font-semibold flex items-center justify-center gap-1.5 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 cursor-pointer"
                  >
                    <a
                      href={affiliateUrl}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                    >
                      <span>{prod.buttonText}</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 text-center pt-1">
        As an Amazon Associate, ToyotaWaits earns from qualifying purchases.
      </p>
    </section>
  );
}
