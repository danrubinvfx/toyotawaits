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
import { useMarket } from '@/context/MarketContext';
import { getAmazonAffiliateUrl as getLibAffiliateUrl } from '@/lib/affiliate';
import { VideoModal } from './video-modal';

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
  isDragging?: boolean;
  className?: string;
}

/**
 * Resolves the destination Amazon affiliate URL for a product,
 * respecting the active country context (Amazon.ca vs Amazon.com).
 */
export function getAmazonAffiliateUrl(
  item: ModCardItem,
  isUs: boolean = false
): string {
  const market = isUs ? 'US' : 'CA';
  const tag = isUs
    ? (process.env.NEXT_PUBLIC_AMAZON_US_TAG || process.env.NEXT_PUBLIC_AMAZON_TAG || 'toyotawaits-20')
    : (process.env.NEXT_PUBLIC_AMAZON_CA_TAG || 'toyotawaits-20');

  const rawUrl = item.destinationUrl || item.affiliateUrl || '';

  if (rawUrl && rawUrl.includes('amazon.')) {
    try {
      const parsed = new URL(rawUrl);
      parsed.hostname = isUs ? 'www.amazon.com' : 'www.amazon.ca';
      parsed.searchParams.set('tag', tag);
      return parsed.toString();
    } catch {
      return isUs
        ? rawUrl.replace(/amazon\.ca/g, 'amazon.com')
        : rawUrl.replace(/amazon\.com/g, 'amazon.ca');
    }
  }

  // Fallback to ASIN if available
  if (item.asin) {
    return getLibAffiliateUrl({ asin: item.asin, market });
  }

  // Fallback to title search if available
  if (item.title) {
    return getLibAffiliateUrl({ query: item.title, market });
  }

  return item.affiliateUrl || (item.slug ? `/out/${item.slug}` : '#');
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
  isDragging = false,
  className,
}: ModCardProps) {
  const [imgError, setImgError] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const { isUs } = useMarket();
  const amazonAffiliateUrl = getAmazonAffiliateUrl(item, isUs);

  const imageSource = item.imageSrc || item.image;
  const showImage = Boolean(imageSource && !imgError);
  const price = item.priceEst || item.priceEstCad;
  const note = item.whyBuy || item.utilityNote || item.description;

  const handleImageClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      data-testid={`checklist-item-${item.slug}`}
      className={cn(
        'relative w-[82vw] max-w-[300px] sm:w-[280px] shrink-0 snap-start bg-neutral-900/80 border border-neutral-800 rounded-2xl p-3.5 flex flex-col justify-between transition-all duration-200 touch-pan-y',
        isChecked
          ? 'border-amber-500/40 bg-neutral-900/95 shadow-inner'
          : 'hover:border-neutral-700 hover:bg-neutral-900/90',
        className
      )}
    >
      {/* Top corner clickable checkbox */}
      {showCheckbox && onToggle && (
        <div className="absolute top-3 right-3 z-10">
          <button
            type="button"
            onClick={() => onToggle(item.slug)}
            aria-checked={isChecked}
            role="checkbox"
            aria-label={`Mark ${item.title} as acquired`}
            className={cn(
              'h-6 w-6 rounded-md border flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs',
              isChecked
                ? 'bg-amber-500 border-amber-500 text-zinc-950 shadow-xs'
                : 'border-zinc-700 bg-zinc-950/80 text-transparent hover:border-amber-500/80 hover:bg-zinc-900'
            )}
          >
            <Check className={cn('h-3.5 w-3.5 stroke-[3]', isChecked ? 'opacity-100' : 'opacity-0')} />
          </button>
        </div>
      )}

      {/* Top Section: Media + Badges + Title + Savings Callout + Note */}
      <div className="flex-1 flex flex-col">
        {/* Constrain image height with clickable Amazon outbound affiliate link */}
        <a
          href={amazonAffiliateUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          aria-label={`View ${item.title} on Amazon`}
          onClick={handleImageClick}
          draggable={false}
          className="cursor-pointer transition-opacity hover:opacity-90 active:opacity-80 block mb-2.5"
        >
          {showImage ? (
            <div className="relative h-32 w-full aspect-video shrink-0 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 flex items-center justify-center shadow-xs">
              <img
                src={imageSource!}
                alt={item.title}
                loading="lazy"
                draggable={false}
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
              className="relative h-32 w-full aspect-video shrink-0 rounded-xl border border-neutral-800 bg-neutral-950/90 flex items-center justify-center text-amber-500/80 shadow-xs"
              title={item.title}
            >
              {React.createElement(getThemedCategoryIcon(item.category, item.title), {
                className: 'h-9 w-9 stroke-[1.5]',
              })}
            </div>
          )}
        </a>

        {/* Group badges into a single line (flex items-center gap-1.5 mb-2 overflow-hidden text-[11px]) */}
        {(item.badge || item.compatibility) && (
          <div className="flex items-center gap-1.5 mb-2 overflow-hidden text-[11px]">
            {item.badge && (
              <Badge
                variant="outline"
                className={cn(
                  'text-[10px] font-semibold px-2 py-0.5 border shrink-0',
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
              <span className="text-[10px] text-zinc-400 bg-zinc-800/80 border border-zinc-700/60 px-2 py-0.5 rounded font-mono truncate">
                {item.compatibility}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h4
          className={cn(
            'text-sm font-semibold tracking-tight transition-colors line-clamp-1 mb-1.5',
            isChecked ? 'line-through text-zinc-500' : 'text-zinc-100'
          )}
        >
          {item.title}
        </h4>

        {/* Keep the savings callout compact (text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-md inline-block w-fit mb-2) */}
        {price && (
          <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-md inline-block w-fit mb-2">
            {price}
          </span>
        )}

        {/* Truncate body text to 2 lines maximum (line-clamp-2 text-xs text-neutral-400) */}
        {note && (
          <p className="line-clamp-2 text-xs text-neutral-400 leading-relaxed font-sans mb-3">
            {note}
          </p>
        )}
      </div>

      {/* Bottom Action Section: Amazon Outbound Link + Optional Video Guide */}
      <div className="pt-2.5 border-t border-neutral-800/80 mt-auto w-full space-y-2 print:hidden">
        <Button
          asChild
          size="sm"
          variant="outline"
          className="w-full text-xs h-8 gap-1.5 border-zinc-700 bg-zinc-900/80 text-zinc-200 hover:border-amber-500/60 hover:text-amber-400 hover:bg-amber-500/10 transition-all cursor-pointer font-medium"
        >
          <a
            href={amazonAffiliateUrl}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            draggable={false}
          >
            <span>View on Amazon</span>
            <ExternalLink className="h-3 w-3 text-amber-400 shrink-0" />
          </a>
        </Button>

        {/* On-Site Video Guide Modal CTA */}
        {item.youtubeVideoId && (
          <>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setIsVideoModalOpen(true)}
              data-testid={item.slug === 'noco-gb40-jump-pack' ? 'jump-pack-video-comparison' : `video-modal-btn-${item.slug}`}
              className="w-full h-7 px-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition-all cursor-pointer gap-1.5"
            >
              <Play className="h-3 w-3 fill-red-500 text-red-500 shrink-0" />
              <span>Watch Video Guide</span>
            </Button>

            <VideoModal
              isOpen={isVideoModalOpen}
              onClose={() => setIsVideoModalOpen(false)}
              videoId={item.youtubeVideoId}
              title={item.videoTitle || item.name || item.title}
            />
          </>
        )}
      </div>
    </div>
  );
}

export const GearCard = ModCard;
export type GearCardProps = ModCardProps;
export type GearCardItem = ModCardItem;

export default ModCard;
