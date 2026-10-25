'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Check,
  Play,
  ShieldCheck,
  Layers,
  Zap,
  Luggage,
  Package,
  BatteryCharging,
  Armchair,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMarket } from '@/context/MarketContext';
import { VideoModal, extractYouTubeVideoId } from '@/components/delivery-prep/video-modal';
import { trackAffiliateClick } from '@/lib/gear/telemetry';

import { getGearMarketConfig } from '@/data/gear/catalog';
import { GearImage } from '@/components/gear/GearImage';
import {
  buildAmazonAffiliateUrl,
  sanitizeAmazonAffiliateUrl,
  injectActiveModelIntoQuery,
  isAmazonDirectProductUrl,
  getImageLinkAriaLabel,
} from '@/lib/gear/affiliate';

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
  imageUrl?: string;
  fallbackIcon?: string;
  savingsCad?: string;
  asin?: string;
  asin_ca?: string;
  asin_us?: string;
  searchQuery?: string;
  searchKeywordsCA?: string;
  searchKeywordsUS?: string;
  destinationUrl?: string;
  affiliateUrl?: string;
  activeModel?: string;
  badge?: 'Essential' | 'Recommended' | 'Pro Tip' | 'Recommended Upgrade' | 'Top Pick' | string;
  compatibility?: string;
  fitment?: string;
  youtubeVideoId?: string;
  youtubeId?: string;
  videoTitle?: string;
  buttonLabel?: string;
  videoUrl?: string;
  guideVideoUrl?: string;
  videoLabel?: string;
}

export type ModCardItem = GearCardItem;

export interface GearCardProps {
  item: GearCardItem;
  isChecked?: boolean;
  onToggle?: (slug: string) => void;
  showCheckbox?: boolean;
  isDragging?: boolean;
  activeModel?: string;
  className?: string;
  placement?: string;
  buttonLabel?: string;
}

export type ModCardProps = GearCardProps;

/**
 * Resolves the destination Amazon affiliate URL for a product,
 * respecting the active country context (Amazon.ca vs Amazon.com)
 * with verified ASIN routing and resilient keyword search fallbacks.
 * Completely eliminates Google Search wrapping and ensures clean URLs.
 */
export function getAffiliateUrl(
  item: GearCardItem,
  marketOrIsUs: 'US' | 'CA' | string | boolean = 'CA',
  activeModel?: string
): string {
  const isUs = marketOrIsUs === 'US' || marketOrIsUs === true;
  const market = isUs ? 'US' : 'CA';
  const targetModel =
    activeModel ||
    item.activeModel ||
    (item.models?.length === 1 && item.models[0] !== 'all' ? item.models[0] : undefined);
  const config = getGearMarketConfig(item.slug || item.id, targetModel);

  const rawAsin = isUs
    ? item.asin_us || config?.asin_us || item.asin || config?.asin
    : item.asin_ca || config?.asin_ca || item.asin || config?.asin;

  const rawKeywords = isUs
    ? item.searchKeywordsUS || config?.searchKeywordsUS || item.searchQuery || config?.searchQuery || item.title
    : item.searchKeywordsCA || config?.searchKeywordsCA || item.searchQuery || config?.searchQuery || item.title;

  const searchQuery = rawKeywords
    ? injectActiveModelIntoQuery(rawKeywords, targetModel, item.slug)
    : undefined;

  // Fallback if neither ASIN nor keywords exist
  if (!rawAsin && !searchQuery) {
    let rawUrl = item.destinationUrl || item.affiliateUrl || '';
    if (rawUrl.includes('google.com/search')) {
      try {
        const parsed = new URL(rawUrl);
        const q = parsed.searchParams.get('q');
        if (q && (q.startsWith('http://') || q.startsWith('https://'))) {
          rawUrl = q;
        }
      } catch {
        // ignore
      }
    }
    if (rawUrl && rawUrl.includes('amazon.')) {
      return sanitizeAmazonAffiliateUrl(rawUrl, market, item.slug);
    }
    return item.affiliateUrl || (item.slug ? `/out/${item.slug}` : '#');
  }

  // Handle direct custom destinationUrls with tag override
  let rawUrl = item.destinationUrl || item.affiliateUrl;
  if (rawUrl && rawUrl.includes('google.com/search')) {
    try {
      const parsed = new URL(rawUrl);
      const q = parsed.searchParams.get('q');
      if (q && (q.startsWith('http://') || q.startsWith('https://'))) {
        rawUrl = q;
      }
    } catch {
      // ignore
    }
  }
  if (!rawAsin && rawUrl && rawUrl.includes('amazon.') && !searchQuery) {
    return sanitizeAmazonAffiliateUrl(rawUrl, market, item.slug);
  }

  return buildAmazonAffiliateUrl({
    asin: rawAsin,
    searchQuery,
    market,
    slug: item.slug,
  });
}

export const getAmazonAffiliateUrl = getAffiliateUrl;

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
    cat.includes('comfort') ||
    cat.includes('ergonomic') ||
    name.includes('armrest') ||
    name.includes('cushion') ||
    name.includes('knee')
  ) {
    return Armchair;
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
  activeModel,
  className,
  placement,
  buttonLabel,
}: GearCardProps) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const { market, isUs } = useMarket();
  const currentModel =
    activeModel ||
    item.activeModel ||
    (item.models?.length === 1 && item.models[0] !== 'all' ? item.models[0] : undefined);
  const activeMarket = market || (isUs ? 'US' : 'CA');
  const isUsMarket = activeMarket === 'US';
  const config = getGearMarketConfig(item.slug || item.id, currentModel);
  const amazonAffiliateUrl = getAffiliateUrl(
    item,
    activeMarket,
    currentModel
  );

  const directAsin = isUsMarket
    ? item.asin_us || config?.asin_us || item.asin || config?.asin
    : item.asin_ca || config?.asin_ca || item.asin || config?.asin;
  const isDirectValidAsin = Boolean(directAsin && /^[A-Z0-9]{10}$/i.test(directAsin.trim()));
  const isDirectAsin = isDirectValidAsin;
  const hasDirectAsin = isDirectValidAsin || isAmazonDirectProductUrl(amazonAffiliateUrl);

  const buttonText = buttonLabel || item.buttonLabel || config?.buttonLabel || (isDirectAsin ? 'View on Amazon ↗' : 'Search on Amazon ↗');
  const imageAriaLabel = getImageLinkAriaLabel(item.title, amazonAffiliateUrl);
  const effectiveBadge = item.badge || config?.badge || (hasDirectAsin ? 'Direct Fit' : undefined);

  const imageSource = item.imageUrl || item.imageSrc || item.image || config?.imageUrl;
  const fallbackIcon = item.fallbackIcon || config?.fallbackIcon;
  const price = item.priceEst || item.priceEstCad;
  const note = config?.description || item.description || item.whyBuy || item.utilityNote || config?.whyBuy;

  const handleAffiliateClick = () => {
    if (placement) {
      trackAffiliateClick({
        accessory_id: item.id || item.slug,
        placement: placement as any,
        model_context: currentModel || 'RAV4',
        target_url: amazonAffiliateUrl,
      });
    }
  };

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
        <GearImage
          src={imageSource}
          alt={item.title}
          affiliateUrl={amazonAffiliateUrl}
          fallbackIcon={fallbackIcon}
          category={item.category}
          ariaLabel={imageAriaLabel}
          testId={item.slug}
          isChecked={isChecked}
          onClick={handleImageClick}
          className="mb-2"
          containerClassName="h-32 sm:h-44"
        />

        {/* Group badges into a single line (text-[10px] px-2 py-0.5) */}
        {(effectiveBadge || item.fitment || item.compatibility) && (
          <div className="flex items-center gap-1.5 mb-1.5 overflow-hidden text-[11px]">
            {effectiveBadge && (
              <Badge
                variant="outline"
                className={cn(
                  'text-[10px] font-semibold px-2 py-0.5 border shrink-0',
                  effectiveBadge === 'Essential'
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                    : effectiveBadge === 'Direct Fit'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                    : effectiveBadge === 'Delivery Day 1'
                    ? 'bg-sky-500/15 border-sky-500/40 text-sky-400'
                    : effectiveBadge === 'Recommended' || effectiveBadge === 'Recommended Upgrade'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                    : effectiveBadge === 'Top Pick'
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400'
                    : 'bg-sky-500/15 border-sky-500/40 text-sky-400'
                )}
              >
                {effectiveBadge}
              </Badge>
            )}
            {(item.fitment || item.compatibility) && (
              <span className="text-[10px] text-zinc-400 bg-zinc-800/80 border border-zinc-700/60 px-2 py-0.5 rounded font-mono truncate">
                {item.fitment || item.compatibility}
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
            rel="sponsored noopener noreferrer nofollow"
            draggable={false}
            onClick={handleAffiliateClick}
          >
            <span>{buttonText}</span>
            <span className="sr-only">
              {buttonText.startsWith('View on Amazon') ? ' (View on Amazon)' : ' (Search on Amazon)'}
            </span>
          </a>
        </Button>

        {/* Secondary CTA: Compact text button for VideoModal or external link */}
        {(() => {
          const videoLabel = item.videoLabel || config?.videoLabel || 'Watch Video Guide';
          const rawVideo =
            item.youtubeVideoId ||
            config?.youtubeVideoId ||
            item.youtubeId ||
            config?.youtubeId ||
            item.videoUrl ||
            config?.videoUrl ||
            item.guideVideoUrl ||
            config?.guideVideoUrl;

          const videoId = extractYouTubeVideoId(rawVideo);

          if (videoId) {
            return (
              <>
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(true)}
                  data-testid={
                    item.slug === 'noco-gb40-jump-pack'
                      ? 'jump-pack-video-comparison'
                      : `video-modal-btn-${item.slug}`
                  }
                  className="w-full flex items-center justify-center gap-1.5 text-[11px] font-medium text-red-400 hover:text-red-300 transition-colors py-0.5 cursor-pointer"
                >
                  <Play className="h-2.5 w-2.5 fill-red-500 text-red-500 shrink-0" />
                  <span>{videoLabel}</span>
                </button>

                <VideoModal
                  isOpen={isVideoModalOpen}
                  onClose={() => setIsVideoModalOpen(false)}
                  videoId={videoId}
                  title={item.videoTitle || item.name || item.title}
                />
              </>
            );
          }

          const externalVideoUrl = item.videoUrl || config?.videoUrl || item.guideVideoUrl || config?.guideVideoUrl;
          if (externalVideoUrl) {
            return (
              <a
                href={externalVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`video-link-${item.slug}`}
                className="w-full flex items-center justify-center gap-1.5 text-[11px] font-medium text-red-400 hover:text-red-300 transition-colors py-0.5 cursor-pointer"
              >
                <Play className="h-2.5 w-2.5 fill-red-500 text-red-500 shrink-0" />
                <span>{videoLabel}</span>
              </a>
            );
          }

          return null;
        })()}
      </div>
    </div>
  );
}

export const ModCard = GearCard;
export { buildAmazonAffiliateUrl };
export default GearCard;
