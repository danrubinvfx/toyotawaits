'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { AccessoryItem } from '@/data/accessories';

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
      className={`rounded-xl border border-amber-500/30 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-amber-950/20 p-3 sm:p-3.5 shadow-sm transition-all hover:border-amber-500/50 md:col-span-2 xl:col-span-3 ${className}`}
    >
      <div className="flex flex-row items-center justify-between gap-3">
        {/* Left: Hook Badge, Bold Title & Punchy Benefit Hook */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <span>⚡</span>
              <span className="truncate">Delivery Day Essential • {targetModel}</span>
            </span>
            {item.badge && (
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-semibold border border-amber-500/30">
                {item.badge}
              </span>
            )}
          </div>

          <h4 className="text-sm font-bold text-white line-clamp-1 leading-snug">
            {item.title}
          </h4>

          <p className="text-xs text-neutral-300 line-clamp-1 leading-snug">
            {benefitSubline}
          </p>
        </div>

        {/* Right: Price, High-Conversion CTA Button & Micro-disclosure */}
        <div className="flex flex-col items-end justify-center shrink-0 space-y-1.5 pl-1">
          <div className="flex items-center gap-1.5">
            {item.badge && (
              <span className="sm:hidden inline-flex items-center px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-semibold border border-amber-500/30">
                {item.badge}
              </span>
            )}
            <span className="text-xs font-semibold text-amber-300 whitespace-nowrap">
              {item.estimatedPriceCad}
            </span>
          </div>

          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="gear-strip-action-btn"
            aria-label={`Check price for ${item.title} on Amazon (opens in new tab)`}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 text-zinc-950 font-bold text-xs shadow-md transition-all whitespace-nowrap"
          >
            <span>Check Price</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </a>

          <span className="text-[10px] text-neutral-500/70 whitespace-nowrap text-right">
            Verified affiliate gear
          </span>
        </div>
      </div>
    </article>
  );
}
