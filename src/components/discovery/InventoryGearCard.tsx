'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { AccessoryItem } from '@/data/accessories';
import { trackAffiliateClick } from '@/lib/gear';

export interface InventoryGearCardProps {
  item: AccessoryItem;
  modelContext?: string;
  className?: string;
}

const BENEFIT_HOOK_MAP: Record<string, string> = {
  'all-weather-floor-liners':
    'Complete front, rear & trunk spill protection tailored for Canadian winters.',
  '4k-front-rear-dash-cam':
    'OEM-fit 4K dual recording with stealth plug-and-play harness.',
  'infotainment-screen-protector':
    'Anti-glare 9H tempered glass to stop fingerprints & micro-scratches.',
  'rfid-faraday-key-fob-pouch':
    'Stops keyless relay theft signals right out of the showroom.',
  'ceramic-interior-leather-protection':
    'Shields SofTex & leather seats from indigo dye transfer and winter salt.',
  'fast-usbc-pd-car-charger':
    'Dual 65W fast charging for phones, tablets & laptops on the go.',
  'center-console-organizer-tray':
    'Custom dual-tier drop-in tray to organize everyday cabin clutter.',
};

export function InventoryGearCard({
  item,
  modelContext,
  className = '',
}: InventoryGearCardProps) {
  const targetModel = modelContext ? modelContext : 'Universal Essential';
  const benefitSubline = BENEFIT_HOOK_MAP[item.id] || item.description;

  return (
    <article
      data-testid="inventory-gear-card"
      aria-label={`Delivery Day Gear: ${item.title}`}
      className={`rounded-xl border border-amber-500/30 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-amber-950/20 p-3.5 shadow-sm transition-all hover:border-amber-500/50 flex flex-col gap-2 md:col-span-2 xl:col-span-3 ${className}`}
    >
      {/* 1. Clear Header Row: Category/Model Badge + Price */}
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800/60 pb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[11px] font-bold tracking-wide uppercase text-amber-400 flex items-center gap-1 truncate">
            <span>⚡</span>
            <span>DELIVERY ESSENTIAL • {targetModel.toUpperCase()}</span>
          </span>
          {item.badge && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 text-[10px] font-semibold border border-amber-500/25 shrink-0">
              {item.badge}
            </span>
          )}
        </div>

        <span className="text-xs font-semibold text-amber-200/90 whitespace-nowrap shrink-0">
          {item.estimatedPriceCad}
        </span>
      </div>

      {/* 2. Content & Action Row: Title/Benefit + Action Button */}
      <div className="flex items-center justify-between gap-3 pt-0.5">
        {/* Left Column: Product Identity & Description */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-white leading-tight break-words line-clamp-2">
            {item.title}
          </h4>
          <p className="text-xs text-neutral-400 leading-snug line-clamp-1 mt-0.5">
            {benefitSubline}
          </p>
        </div>

        {/* Right Column: High-Conversion CTA Button */}
        <div className="flex-shrink-0">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="gear-strip-action-btn"
            aria-label={`Check price for ${item.title} on Amazon (opens in new tab)`}
            onClick={() => {
              trackAffiliateClick({
                accessory_id: item.id,
                placement: 'inventory_feed',
                model_context: modelContext || null,
                target_url: item.url,
              });
            }}
            className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 text-zinc-950 font-bold text-xs shadow inline-flex items-center gap-1.5 whitespace-nowrap transition-all"
          >
            <span>Check Price</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* 3. Footer Micro-Disclosure */}
      <div className="text-[10px] text-zinc-500 tracking-tight">
        Verified Amazon affiliate link
      </div>
    </article>
  );
}
