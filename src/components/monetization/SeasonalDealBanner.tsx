import React from 'react';
import { getCurrentPromoConfig } from '@/lib/gear/promotions';
import { cn } from '@/lib/utils';
import { Layers, Camera, Smartphone } from 'lucide-react';

export interface SeasonalDealBannerProps {
  currentDate?: Date;
  modelSlug?: string;
  modelName?: string;
  className?: string;
}

const DEFAULT_JUMP_LINKS = [
  {
    label: 'All-Weather Liners',
    href: '#all-weather-liners',
    icon: Layers,
  },
  {
    label: 'Dash Cams',
    href: '#dash-cams',
    icon: Camera,
  },
  {
    label: 'Screen Glass',
    href: '#screen-glass',
    icon: Smartphone,
  },
];

export function SeasonalDealBanner({
  currentDate,
  modelName,
  className,
}: SeasonalDealBannerProps) {
  const promoConfig = getCurrentPromoConfig(currentDate);

  const borderAccentClass =
    promoConfig.season === 'BFCM'
      ? 'border-red-500/60 shadow-red-950/30'
      : promoConfig.season === 'BOXING_WEEK'
      ? 'border-rose-600/60 shadow-rose-950/30'
      : promoConfig.season === 'WINTER_DEALS'
      ? 'border-cyan-500/60 shadow-cyan-950/30'
      : 'border-zinc-700/80';

  return (
    <section
      aria-label="Seasonal Accessory Deals & Delivery Essentials"
      data-testid="seasonal-deal-banner"
      className={cn(
        'rounded-2xl border bg-zinc-900/95 text-zinc-100 p-4 sm:p-5 shadow-lg transition-all',
        borderAccentClass,
        className
      )}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-xs',
                promoConfig.badgeColorClass
              )}
            >
              {promoConfig.badgeText}
            </span>
            {modelName && (
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                • {modelName} Delivery Prep
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-white">
            {promoConfig.bannerTitle}
          </h3>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            {promoConfig.bannerSubtitle}
          </p>
        </div>

        {/* Jump-link pills to key accessory categories */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {DEFAULT_JUMP_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-800/90 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 hover:border-amber-500/50 transition-colors"
              >
                <Icon className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default SeasonalDealBanner;
