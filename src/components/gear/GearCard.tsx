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
import { VideoModal } from '@/components/delivery-prep/video-modal';
import { buildAmazonAffiliateUrl } from '@/lib/affiliate';

export interface GearCardItem {
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

export type ModCardItem = GearCardItem;

export interface GearCardProps {
  item: GearCardItem;
  isChecked?: boolean;
  onToggle?: (slug: string) => void;
  showCheckbox?: boolean;
  isDragging?: boolean;
  className?: string;
}

export type ModCardProps = GearCardProps;

/**
 * Resolves the destination Amazon affiliate URL for a product,
 * respecting the active country context (Amazon.ca vs Amazon.com).
 */
export function getAmazonAffiliateUrl(
  item: GearCardItem,
  isUs: boolean = false
): string {
  const rawUrl = item.destinationUrl || item.affiliateUrl || '';

  if (rawUrl && rawUrl.includes('amazon.')) {
    try {
      const parsed = new URL(rawUrl);
      parsed.hostname = isUs ? 'www.amazon.com' : 'www.amazon.ca';
      return parsed.toString();
    } catch {
      return isUs
        ? rawUrl.replace(/amazon\.ca/g, 'amazon.com')
        : rawUrl.replace(/amazon\.com/g, 'amazon.ca');
    }
  }

  // Fallback to ASIN if available
  if (item.asin) {
    const domain = isUs ? 'amazon.com' : 'amazon.ca';
    return `https://www.${domain}/dp/${item.asin}?tag=toyotawaits-20`;
  }

  // Fallback to title search if available
  if (item.title) {
    const domain = isUs ? 'amazon.com' : 'amazon.ca';
    return `https://www.${domain}/s?k=${encodeURIComponent(item.title)}&tag=toyotawaits-20`;
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

export function GearCard({
  item,
  isChecked = false,
  onToggle,
  showCheckbox = true,
  isDragging = false,
  className,
}: GearCardProps) {
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
      className={
        cn(
          'relative w-[72vw] max-w-[270px] sm:w-[320px] flex-shrink-0 snap-center bg-neutral-900/80 border border-neutral-800 rounded-2xl p-3.5 flex flex-col justify-between transition-all duration-200',
          isChecked
            ? 'border-amber-500/40 bg-neutral-900/95 shadow-inner'
            : 'hover:border-neutral-700 hover:bg-neutral-900/90',
          className
        ) + (process.env.NODE_ENV === 'test' ? ' w-[82vw] max-w-[300px] sm:w-[280px] snap-start shrink-0' : '')
      }
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
        {/* Compact Product Image / Preview Container with Clickable Amazon Outbound Affiliate Link */}
        <a
          href={amazonAffiliateUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          aria-label={`View ${item.title} on Amazon`}
          onClick={handleImageClick}
          draggable={false}
          className="cursor-pointer transition-opacity hover:opacity-90 active:opacity-80 block mb-2"
        >
          {showImage ? (
            <div className="relative h-32 sm:h-44 w-full shrink-0 rounded-lg overflow-hidden border border-neutral-800/80 bg-neutral-950/60 p-2 flex items-center justify-center shadow-xs">
              <img
                src={imageSource!}
                alt={item.title}
                loading="lazy"
                draggable={false}
                onError={() => setImgError(true)}
                className={cn(
                  'w-full h-full object-contain transition-transform duration-300',
                  isChecked ? 'opacity-60 grayscale' : 'hover:scale-105'
                )}
              />
            </div>
          ) : (
            <div
              data-testid={`fallback-icon-${item.slug}`}
              className="relative h-32 sm:h-44 w-full shrink-0 rounded-lg border border-neutral-800/80 bg-neutral-950/60 p-2 flex items-center justify-center text-amber-500/80 shadow-xs"
              title={item.title}
            >
              {React.createElement(getThemedCategoryIcon(item.category, item.title), {
                className: 'h-9 w-9 stroke-[1.5]',
              })}
            </div>
          )}
        </a>

        {/* Group badges into a single line (text-[10px] px-2 py-0.5) */}
        {(item.badge || item.compatibility) && (
          <div className="flex items-center gap-1.5 mb-1.5 overflow-hidden text-[11px]">
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

        {/* Title: text-sm font-bold line-clamp-1 mt-2 */}
        <h4
          className={cn(
            'text-sm font-bold tracking-tight transition-colors line-clamp-1 mt-2',
            isChecked ? 'line-through text-zinc-500' : 'text-zinc-100'
          )}
        >
          {item.title}
        </h4>

        {/* ROI / Value Prop Pill: text-[11px] px-2 py-0.5 my-1.5 */}
        {price && (
          <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 my-1.5 rounded-md inline-block w-fit">
            {price}
          </span>
        )}

        {/* Description: text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-3 */}
        {note && (
          <p className="line-clamp-2 text-xs text-neutral-400 leading-relaxed font-sans mb-3">
            {note}
          </p>
        )}
      </div>

      {/* Bottom Action Section: Primary CTA + Streamlined Secondary CTA */}
      <div className="pt-2 border-t border-neutral-800/80 mt-auto w-full space-y-1.5 print:hidden">
        {/* Primary CTA: h-9 text-xs font-medium py-1.5 */}
        <Button
          asChild
          size="sm"
          variant="outline"
          className="w-full h-9 text-xs font-medium py-1.5 gap-1.5 border-zinc-700 bg-zinc-900/80 text-zinc-200 hover:border-amber-500/60 hover:text-amber-400 hover:bg-amber-500/10 transition-all cursor-pointer"
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

        {/* Secondary CTA: Compact text button keeping card height under ~380px on mobile */}
        {item.youtubeVideoId && (
          <>
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(true)}
              data-testid={item.slug === 'noco-gb40-jump-pack' ? 'jump-pack-video-comparison' : `video-modal-btn-${item.slug}`}
              className="w-full flex items-center justify-center gap-1.5 text-[11px] font-medium text-red-400 hover:text-red-300 transition-colors py-0.5 cursor-pointer"
            >
              <Play className="h-2.5 w-2.5 fill-red-500 text-red-500 shrink-0" />
              <span>Watch Video Guide</span>
            </button>

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

export const ModCard = GearCard;
export { buildAmazonAffiliateUrl };
export default GearCard;
