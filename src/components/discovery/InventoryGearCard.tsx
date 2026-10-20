'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { AccessoryItem } from '@/data/accessories';

export interface InventoryGearCardProps {
  item: AccessoryItem;
  modelContext?: string;
  className?: string;
}

const CATEGORY_EMOJI_MAP: Record<AccessoryItem['category'], string> = {
  protection: '🛡️',
  tech: '⚡',
  comfort: '✨',
  care: '🧼',
};

export function InventoryGearCard({
  item,
  modelContext,
  className = '',
}: InventoryGearCardProps) {
  const iconEmoji = CATEGORY_EMOJI_MAP[item.category] || '📦';
  const subtitle = modelContext
    ? `Delivery Day Prep • ${modelContext}`
    : 'Delivery Day Prep • Universal Essential';

  return (
    <article
      data-testid="inventory-gear-card"
      aria-label={`Delivery Day Gear: ${item.title}`}
      className={`rounded-xl border border-zinc-800/80 bg-zinc-900/50 hover:bg-zinc-900/80 p-3 transition-colors md:col-span-2 xl:col-span-3 ${className}`}
    >
      <div className="flex flex-row items-center justify-between gap-3">
        {/* Left: Subtle Icon + Category / Model Label */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="h-8 w-8 rounded-lg bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center shrink-0 text-base"
            aria-hidden="true"
          >
            {iconEmoji}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-semibold text-neutral-300 truncate">
              {item.title}
            </h4>
            <p className="text-[11px] text-neutral-500 truncate">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right: Compact Price & Mini Outbound Pill Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-xs font-medium text-neutral-400 whitespace-nowrap hidden sm:inline">
            {item.estimatedPriceCad}
          </span>

          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="gear-strip-action-btn"
            aria-label={`View ${item.title} on Amazon (opens in new tab)`}
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-neutral-200 px-2.5 py-1 rounded-md inline-flex items-center gap-1 border border-zinc-700/60 transition whitespace-nowrap"
          >
            <span>View</span>
            <ExternalLink className="h-3 w-3 text-neutral-400" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Micro-Disclosure Bar */}
      <div className="flex items-center justify-between mt-1 pt-1 border-t border-zinc-800/40 text-[10px] text-neutral-600">
        <span>Affiliate link supports hosting</span>
        <div className="flex items-center gap-2">
          <span className="sm:hidden text-neutral-400 font-medium">
            {item.estimatedPriceCad}
          </span>
          {item.badge && (
            <span className="text-amber-500/80 font-medium">{item.badge}</span>
          )}
        </div>
      </div>
    </article>
  );
}
