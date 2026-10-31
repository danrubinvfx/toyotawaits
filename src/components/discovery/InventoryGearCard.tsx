'use client';

import React, { useState } from 'react';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { AccessoryItem } from '@/data/accessories';
import { trackAffiliateClick } from '@/lib/gear';
import { GearImage } from '@/components/gear/GearImage';
import {
  GEAR_MARKET_CATALOG,
  getGearMarketConfig,
  resolveGearLocalImage,
  resolveVerifiedGearImageSrc,
} from '@/data/gear/catalog';

export interface InventoryGearCardProps {
  item: AccessoryItem;
  modelContext?: string;
  className?: string;
}

const BENEFIT_HOOK_MAP: Record<string, string> = {
  'all-weather-floor-liners':
    'Laser-fit floor & trunk spill protection for Canadian winters',
  '4k-front-rear-dash-cam':
    'OEM-integrated rearview mirror power tap with zero visible wiring',
  'infotainment-screen-protector':
    '9H tempered glass to reduce fingerprint smudges & glare',
  'rfid-faraday-key-fob-pouch':
    'Stops keyless relay theft signals right out of the showroom.',
  'ceramic-interior-leather-protection':
    'Shields SofTex & leather seats from indigo dye transfer and winter salt.',
  'fast-usbc-pd-car-charger':
    'Ultra-fast dual phone charging.',
  'center-console-organizer-tray':
    'Drop-in dual tray with OEM-style USB-C fast charging',
  'muslogy-rav4-organizer':
    'Drop-in multi-tier center console armrest divider tray with anti-slip silicone coin pads.',
  'muslogy-armrest-cover':
    'Ergonomic soft memory-foam padded leatherette console cover that relieves arm fatigue.',
};

export function InventoryGearCard({
  item,
  modelContext,
  className = '',
}: InventoryGearCardProps) {
  const [copied, setCopied] = useState(false);
  const benefitSubline = BENEFIT_HOOK_MAP[item.id] || item.description;

  const config = getGearMarketConfig(item.id);
  const resolvedLocal = resolveGearLocalImage(item.id, item.category, item.title);
  const imageSource = resolveVerifiedGearImageSrc(
    item.imageUrl,
    config?.imageUrl,
    resolvedLocal?.imageUrl
  );
  const fallbackIcon = item.fallbackIcon || config?.fallbackIcon || resolvedLocal?.fallbackIcon;

  const isDirectPartner =
    item.destinationType === 'direct_partner' ||
    item.brand === 'Muslogy' ||
    item.id.startsWith('muslogy-');

  const discountCode = item.discountCode || config?.discountCode || (isDirectPartner ? 'Toyotawaits' : undefined);
  const buttonText = isDirectPartner ? 'Get 2% Off' : 'Check Price';
  const outboundRel = isDirectPartner ? 'sponsored noopener noreferrer' : 'noopener noreferrer';

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article
      data-testid="inventory-gear-card"
      aria-label={`Delivery Day Gear: ${item.title}`}
      className={`col-span-full w-full rounded-xl border border-amber-500/30 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-amber-950/20 p-3.5 shadow-sm transition-all hover:border-amber-500/50 flex flex-col gap-2 ${className}`}
    >
      {/* 1. Clear Header Row: Category/Model Badge + Price */}
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800/60 pb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0">
            {isDirectPartner ? 'PARTNER DEAL' : 'GEAR PICK'}
          </span>
          {modelContext && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 truncate">
              {modelContext}
            </span>
          )}
          {item.badge && item.badge.toLowerCase() !== 'essential' && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 text-[10px] font-semibold border border-amber-500/25 shrink-0">
              {item.badge}
            </span>
          )}
          {isDirectPartner && discountCode && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 shrink-0">
              <span>CODE: <span className="font-mono underline">{discountCode}</span> (2% OFF)</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCopyCode(discountCode);
                }}
                className="hover:text-white transition-colors cursor-pointer"
                title="Copy discount code"
              >
                {copied ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
              </button>
            </span>
          )}
        </div>

        <span className="text-xs font-semibold text-amber-200/90 whitespace-nowrap shrink-0">
          {item.estimatedPriceCad}
        </span>
      </div>

      {/* 2. Content & Action Row: Thumbnail + Title/Benefit + Action Button */}
      <div className="flex items-center gap-3 pt-0.5">
        {/* Compact Gear Thumbnail with Local Studio Photo */}
        <div className="w-20 sm:w-28 shrink-0">
          <GearImage
            src={imageSource}
            alt={item.title}
            affiliateUrl={item.url}
            fallbackIcon={fallbackIcon}
            category={item.category}
            aspectRatioClass="aspect-[16/10]"
            containerClassName="h-14 sm:h-16 rounded-md overflow-hidden"
            testId={item.id}
            rel={isDirectPartner ? 'sponsored noopener noreferrer' : 'sponsored noopener noreferrer nofollow'}
          />
        </div>

        {/* Middle Column: Product Identity & Description */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white tracking-tight truncate">
            {item.title}
          </h4>
          <p className="text-xs text-neutral-400 line-clamp-1">
            {benefitSubline}
          </p>
        </div>

        {/* Right Column: High-Conversion CTA Button */}
        <div className="flex-shrink-0">
          <a
            href={item.url}
            target="_blank"
            rel={outboundRel}
            data-testid="gear-strip-action-btn"
            aria-label={`${buttonText} for ${item.title} (opens in new tab)`}
            onClick={() => {
              trackAffiliateClick({
                accessory_id: item.id,
                placement: 'inventory_feed',
                model_context: modelContext || null,
                target_url: item.url,
              });
              if (isDirectPartner && discountCode) {
                handleCopyCode(discountCode);
              }
            }}
            className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 text-zinc-950 font-bold text-xs shadow inline-flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer"
          >
            <span>{buttonText}</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* 3. Footer Micro-Disclosure */}
      {isDirectPartner ? (
        <div className="text-[10px] text-amber-400/80 tracking-tight font-medium">
          Authorized Muslogy partner deal · 2% discount with code {discountCode}
        </div>
      ) : (
        <div className="text-[10px] text-zinc-500 tracking-tight">
          Verified Amazon affiliate link
        </div>
      )}
    </article>
  );
}
