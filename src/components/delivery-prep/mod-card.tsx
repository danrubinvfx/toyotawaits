'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Check,
  ExternalLink,
  Play,
  ShieldCheck,
  Layers,
  Zap,
  Luggage,
  Package,
  BatteryCharging,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModCardItem {
  id: string;
  slug: string;
  title: string;
  name?: string;
  category: string;
  categories?: string[];
  models?: string[];
  powertrains?: string[];
  priceEst?: string;
  priceEstCad?: string;
  whyBuy?: string;
  utilityNote?: string;
  description?: string;
  image?: string;
  imageSrc?: string;
  asin?: string;
  destinationUrl?: string;
  affiliateUrl?: string;
  badge?: 'Essential' | 'Recommended' | 'Pro Tip' | 'Recommended Upgrade' | 'Top Pick' | string;
  compatibility?: string;
  youtubeVideoId?: string;
  videoTitle?: string;
}

export interface ModCardProps {
  item: ModCardItem;
  isChecked?: boolean;
  onToggle?: (slug: string) => void;
  showCheckbox?: boolean;
  className?: string;
}

/**
 * Returns a contextual Lucide icon when product images fail or are not supplied.
 */
export function getThemedCategoryIcon(category?: string, title?: string) {
  const cat = (category || '').toLowerCase();
  const name = (title || '').toLowerCase();

  if (
    cat.includes('battery') ||
    cat.includes('emergency') ||
    cat.includes('roadside') ||
    name.includes('noco') ||
    name.includes('jump')
  ) {
    return BatteryCharging;
  }
  if (
    cat.includes('cargo') ||
    cat.includes('utility') ||
    name.includes('rack') ||
    name.includes('crossbar')
  ) {
    return Luggage;
  }
  if (
    cat.includes('electronics') ||
    cat.includes('safety') ||
    cat.includes('visibility') ||
    name.includes('dashcam') ||
    name.includes('dongar') ||
    name.includes('harness')
  ) {
    return Zap;
  }
  if (
    cat.includes('organization') ||
    name.includes('tray') ||
    name.includes('divider') ||
    name.includes('storage') ||
    name.includes('console')
  ) {
    return Package;
  }
  if (
    cat.includes('interior') ||
    cat.includes('protection') ||
    cat.includes('cabin') ||
    name.includes('liner') ||
    name.includes('mat') ||
    name.includes('scuff') ||
    name.includes('sill') ||
    name.includes('filter')
  ) {
    return Layers;
  }
  return ShieldCheck;
}

export function ModCard({
  item,
  isChecked = false,
  onToggle,
  showCheckbox = true,
  className,
}: ModCardProps) {
  const [imgError, setImgError] = useState(false);
  const imageSource = item.imageSrc || item.image;
  const showImage = Boolean(imageSource && !imgError);
  const price = item.priceEst || item.priceEstCad;
  const note = item.whyBuy || item.utilityNote || item.description;

  return (
    <div
      data-testid={`checklist-item-${item.slug}`}
      className={cn(
        'relative rounded-xl border p-3.5 sm:p-4 transition-all duration-200 flex flex-col justify-between gap-4',
        isChecked
          ? 'border-amber-500/40 bg-zinc-900/90 shadow-inner'
          : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700/80 hover:bg-zinc-900/80',
        className
      )}
    >
      {/* Top corner clickable checkbox */}
      {showCheckbox && onToggle && (
        <div className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 z-10">
          <button
            type="button"
            onClick={() => onToggle(item.slug)}
            aria-checked={isChecked}
            role="checkbox"
            aria-label={`Mark ${item.title} as acquired`}
            className={cn(
              'h-6 w-6 rounded-md border flex items-center justify-center transition-all cursor-pointer',
              isChecked
                ? 'bg-amber-500 border-amber-500 text-zinc-950 shadow-xs'
                : 'border-zinc-700 bg-zinc-950/80 text-transparent hover:border-amber-500/80 hover:bg-zinc-900'
            )}
          >
            <Check className={cn('h-3.5 w-3.5 stroke-[3]', isChecked ? 'opacity-100' : 'opacity-0')} />
          </button>
        </div>
      )}

      {/* Main Row: Thumbnail + Details + Outbound Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
        {/* Left & Middle content container */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 flex-1 pr-8 sm:pr-2">
          {/* Left: 80x80px Product Thumbnail with Graceful SVG Fallback */}
          {showImage ? (
            <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center shadow-xs">
              <img
                src={imageSource!}
                alt={item.title}
                width={80}
                height={80}
                loading="lazy"
                onError={() => setImgError(true)}
                className={cn(
                  'w-full h-full object-cover transition-transform duration-300',
                  isChecked ? 'opacity-60 grayscale' : 'hover:scale-105'
                )}
              />
            </div>
          ) : (
            <div
              data-testid={`fallback-icon-${item.slug}`}
              className="relative w-20 h-20 shrink-0 rounded-lg border border-zinc-800 bg-zinc-950/90 flex items-center justify-center text-amber-500/80 shadow-xs"
              title={item.title}
            >
              {React.createElement(getThemedCategoryIcon(item.category, item.title), {
                className: 'h-8 w-8 stroke-[1.5]',
              })}
            </div>
          )}

          {/* Middle: Details */}
          <div className="space-y-1.5 flex-1 min-w-0">
            {/* Badges & Compatibility Tag */}
            {(item.badge || item.compatibility) && (
              <div className="flex flex-wrap items-center gap-1.5">
                {item.badge && (
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[10px] sm:text-xs font-semibold px-2 py-0.5 border',
                      item.badge === 'Essential'
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                        : item.badge === 'Recommended' || item.badge === 'Recommended Upgrade'
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                        : item.badge === 'Top Pick'
                        ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400'
                        : 'bg-sky-500/15 border-sky-500/40 text-sky-400'
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
                {item.compatibility && (
                  <span className="text-[10px] sm:text-[11px] text-zinc-400 bg-zinc-800/80 border border-zinc-700/60 px-2 py-0.5 rounded font-mono">
                    {item.compatibility}
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-baseline gap-2">
              <h4
                className={cn(
                  'text-sm font-semibold tracking-tight transition-colors',
                  isChecked ? 'line-through text-zinc-500' : 'text-zinc-100'
                )}
              >
                {item.title}
              </h4>
              {price && (
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {price}
                </span>
              )}
            </div>
            {note && (
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                {note}
              </p>
            )}
          </div>
        </div>

        {/* Right: Outbound Action Button */}
        <div className="sm:self-center shrink-0 w-full sm:w-auto pt-1 sm:pt-0 print:hidden">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="w-full sm:w-auto text-xs h-8 gap-1.5 border-zinc-700 bg-zinc-900/80 text-zinc-200 hover:border-amber-500/60 hover:text-amber-400 hover:bg-amber-500/10 transition-all cursor-pointer font-medium"
          >
            <a
              href={item.affiliateUrl || `/out/${item.slug}`}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
            >
              <span>View on Amazon</span>
              <ExternalLink className="h-3 w-3 text-amber-400 shrink-0" />
            </a>
          </Button>
        </div>
      </div>

      {/* External Video Guide / Walkthrough Button (replaces broken iframe) */}
      {item.youtubeVideoId && (
        <div className="mt-2 pt-2.5 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 print:hidden w-full">
          <div className="flex items-center gap-2 min-w-0">
            <Play className="h-3.5 w-3.5 text-red-500 fill-red-500 shrink-0" />
            <span className="text-xs font-semibold text-zinc-300 truncate">
              {item.videoTitle || 'Video Guide'}
            </span>
          </div>
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="h-7 px-2.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 shrink-0 transition-all cursor-pointer self-start sm:self-auto"
          >
            <a
              href={`https://www.youtube.com/watch?v=${item.youtubeVideoId}`}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={item.slug === 'noco-gb40-jump-pack' ? 'jump-pack-video-comparison' : `video-link-${item.slug}`}
              className="inline-flex items-center gap-1.5"
            >
              <span>
                {(item.title || '').toLowerCase().includes('dashcam') || (item.title || '').toLowerCase().includes('harness')
                  ? 'Watch Install Walkthrough ↗'
                  : 'Watch Video Guide ↗'}
              </span>
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}

export default ModCard;
