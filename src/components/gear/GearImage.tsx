'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Camera,
  Layers,
  Lock,
  LayoutGrid,
  Zap,
  BatteryCharging,
  Luggage,
  Package,
  Armchair,
  ShieldCheck,
  Smartphone,
  Wifi,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GearImageProps {
  src?: string;
  alt: string;
  affiliateUrl: string;
  fallbackIcon?: string;
  category?: string;
  className?: string;
  imageClassName?: string;
  containerClassName?: string;
  aspectRatioClass?: string;
  sizes?: string;
  ariaLabel?: string;
  testId?: string;
  isChecked?: boolean;
  rel?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Maps known icon names or vehicle accessory categories to sleek Lucide category icons.
 */
export function resolveCategoryIcon(
  fallbackIcon?: string,
  category?: string,
  title?: string
): LucideIcon {
  const iconKey = (fallbackIcon || '').toLowerCase().trim();
  if (iconKey === 'camera') return Camera;
  if (iconKey === 'layers') return Layers;
  if (iconKey === 'lock') return Lock;
  if (iconKey === 'layout-grid' || iconKey === 'grid') return LayoutGrid;
  if (iconKey === 'zap' || iconKey === 'bolt') return Zap;
  if (iconKey === 'battery' || iconKey === 'battery-charging') return BatteryCharging;
  if (iconKey === 'luggage') return Luggage;
  if (iconKey === 'package') return Package;
  if (iconKey === 'armchair') return Armchair;
  if (iconKey === 'shield') return ShieldCheck;
  if (iconKey === 'smartphone' || iconKey === 'phone' || iconKey === 'tech') return Smartphone;
  if (iconKey === 'wifi' || iconKey === 'wireless') return Wifi;

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
    name.includes('crossbar') ||
    name.includes('hitch')
  ) {
    return Luggage;
  }
  if (
    name.includes('carplay') ||
    name.includes('android auto') ||
    name.includes('adapter') ||
    name.includes('smartphone') ||
    name.includes('phone')
  ) {
    return Smartphone;
  }
  if (
    cat.includes('electronics') ||
    cat.includes('safety') ||
    cat.includes('visibility') ||
    cat.includes('tech') ||
    name.includes('dashcam') ||
    name.includes('fitcamx') ||
    name.includes('camera')
  ) {
    return Camera;
  }
  if (
    name.includes('lock') ||
    name.includes('rfid') ||
    name.includes('faraday') ||
    name.includes('security')
  ) {
    return Lock;
  }
  if (
    cat.includes('organization') ||
    name.includes('tray') ||
    name.includes('divider') ||
    name.includes('storage') ||
    name.includes('console')
  ) {
    return LayoutGrid;
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
  if (
    name.includes('charger') ||
    name.includes('evse') ||
    name.includes('power') ||
    name.includes('usb')
  ) {
    return Zap;
  }

  return ShieldCheck;
}

/**
 * Checks whether a given image URL belongs to Amazon's CDNs.
 * Amazon compliance standard: Never hotlink or scrape images from Amazon domains.
 */
export function isAmazonImageDomain(url?: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.includes('m.media-amazon.com') ||
    lower.includes('images-na.ssl-images-amazon.com') ||
    lower.includes('images.amazon.com') ||
    lower.includes('ssl-images-amazon.com')
  );
}

/**
 * Resilient, Amazon-compliant gear product image component.
 * Features:
 * - Wrap image in clickable link pointing to Amazon affiliate URL
 * - Next.js <Image /> with fill, sizes="(max-width: 640px) 100vw, 320px", object-contain p-2
 * - Fixed aspect ratio (aspect-[16/10])
 * - Local WebP rendering with state-based fallback
 * - Ambient dark-mode gradient backdrop (bg-zinc-950/80)
 * - Strict block on Amazon direct hotlinking
 */
export function GearImage({
  src,
  alt,
  affiliateUrl,
  fallbackIcon,
  category,
  className,
  imageClassName,
  containerClassName,
  aspectRatioClass = 'aspect-[16/10]',
  sizes = '(max-width: 640px) 100vw, 320px',
  ariaLabel,
  testId,
  isChecked = false,
  rel = 'sponsored noopener noreferrer nofollow',
  onClick,
}: GearImageProps) {
  // Track the specific src that failed so a new src (e.g. vehicle switch) gets a fresh attempt
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const hasError = Boolean(src) && failedSrc === src;

  // Strictly enforce compliance: Never hotlink from Amazon CDN endpoints
  const isDirectAmazonUrl = isAmazonImageDomain(src);
  const isValidSrc = Boolean(src && !isDirectAmazonUrl && !hasError);

  const iconType = resolveCategoryIcon(fallbackIcon, category, alt);

  return (
    <a
      href={affiliateUrl}
      target="_blank"
      rel={rel}
      aria-label={ariaLabel || `View ${alt} on Amazon`}
      onClick={onClick}
      draggable={false}
      className={cn(
        'group cursor-pointer transition-opacity hover:opacity-90 active:opacity-80 block w-full',
        className
      )}
    >
      <div
        className={cn(
          'relative w-full shrink-0 rounded-lg overflow-hidden border border-neutral-800/80 bg-zinc-950/80 flex items-center justify-center shadow-xs transition-colors group-hover:border-neutral-700',
          aspectRatioClass,
          containerClassName
        )}
      >
        {isValidSrc ? (
          <Image
            src={src!}
            alt={alt}
            fill
            unoptimized
            sizes={sizes}
            onError={() => setFailedSrc(src ?? null)}
            className={cn(
              'object-contain p-2 transition-transform duration-300',
              isChecked ? 'opacity-60 grayscale' : 'group-hover:scale-105',
              imageClassName
            )}
          />
        ) : (
          <div
            data-testid={testId ? `fallback-icon-${testId}` : undefined}
            className="w-full h-full flex flex-col items-center justify-center p-3 text-amber-500/80 bg-gradient-to-b from-zinc-900/60 via-zinc-950/90 to-zinc-950"
            title={alt}
          >
            {/* Ambient SVG Silhouette Background Accents */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-10 stroke-zinc-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 160 100"
            >
              <line x1="0" y1="20" x2="160" y2="20" strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1="0" y1="80" x2="160" y2="80" strokeWidth="0.5" strokeDasharray="4 4" />
              <circle cx="80" cy="50" r="32" strokeWidth="0.5" strokeDasharray="2 4" />
            </svg>

            {React.createElement(iconType, {
              className: 'h-9 w-9 stroke-[1.5] transition-transform group-hover:scale-110',
            })}
            <span className="mt-2 text-[10px] font-medium tracking-wider text-zinc-400 uppercase font-mono truncate max-w-[85%] text-center opacity-80">
              {fallbackIcon || category || 'Gear Preview'}
            </span>
          </div>
        )}
      </div>
    </a>
  );
}
