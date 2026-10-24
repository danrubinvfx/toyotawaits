'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Camera, Sparkles, Eye } from 'lucide-react';

export interface VehicleImageProps {
  imageUrl?: string | null;
  hasRealPhoto?: boolean;
  imageSource?: string | null;
  modelYear?: number;
  model?: string;
  trim?: string | null;
  alt: string;
  priority?: boolean;
  className?: string;
  isInTransit?: boolean;
  status?: string;
}

const PLACEHOLDER_PATTERNS = [
  /placeholder/i,
  /no[-_]image/i,
  /image[-_]coming[-_]soon/i,
  /photo[-_]coming[-_]soon/i,
  /vehicle[-_]coming[-_]soon/i,
  /stock[-_]photo/i,
  /default[-_]car/i,
  /not[-_]available/i,
];

export function isPlaceholderImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return true;
  const clean = url.trim();
  if (!clean) return true;
  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(clean));
}

export function generateTrimSlug(model?: string, trim?: string | null): string {
  const parts = [model, trim].filter(Boolean).join('-');
  return parts
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * 3-Tier Vehicle Image component:
 * - Tier 1: Verified lot photo from dealer feed (imageUrl)
 * - Tier 2: Factory trim render (/assets/models/${modelYear}/${trimSlug}.webp)
 * - Tier 3: Neutral SVG silhouette fallback (/assets/placeholder-silhouette.svg)
 *
 * Implements defensive onError downgrading and strict 16:10 fixed aspect ratio
 * to prevent cumulative layout shift (CLS).
 */
export function VehicleImage({
  imageUrl,
  hasRealPhoto = false,
  imageSource,
  modelYear = 2026,
  model = 'Toyota',
  trim,
  alt,
  priority = false,
  className = '',
  isInTransit = false,
  status,
}: VehicleImageProps) {
  const trimSlug = generateTrimSlug(model, trim) || 'base';
  const factoryTrimUrl = `/assets/models/${modelYear}/${trimSlug}.webp`;
  const silhouetteUrl = '/assets/placeholder-silhouette.svg';

  const isTransit =
    isInTransit ||
    Boolean(
      status &&
        (status.toLowerCase().includes('transit') ||
          status.toLowerCase().includes('incoming'))
    );

  // Determine starting tier: Tier 1 if lot photo is provided, verified real, not placeholder, and vehicle is not in transit
  const isTier1Valid =
    Boolean(imageUrl) &&
    (imageUrl!.startsWith('http://') || imageUrl!.startsWith('https://')) &&
    hasRealPhoto !== false &&
    !isPlaceholderImageUrl(imageUrl) &&
    !isTransit;

  const initialTier: 1 | 2 | 3 = isTier1Valid ? 1 : 2;

  const [currentTier, setCurrentTier] = useState<1 | 2 | 3>(initialTier);

  // Synchronize tier if incoming props change
  useEffect(() => {
    setCurrentTier(isTier1Valid ? 1 : 2);
  }, [imageUrl, hasRealPhoto, isTransit, isTier1Valid]);

  // Downgrade tiers on error without infinite loops: Tier 1 -> Tier 2 -> Tier 3
  const handleError = () => {
    setCurrentTier((prev) => {
      if (prev === 1) return 2;
      return 3;
    });
  };

  let resolvedSrc: string;
  let statusBadge: { label: string; icon: React.ReactNode; style: string };

  if (currentTier === 1 && imageUrl) {
    resolvedSrc = imageUrl;
    statusBadge = {
      label: 'Dealer Unit Photo',
      icon: <Camera className="h-3 w-3 text-emerald-400" aria-hidden="true" />,
      style: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    };
  } else if (currentTier === 2) {
    resolvedSrc = factoryTrimUrl;
    statusBadge = {
      label: 'Factory Trim Render',
      icon: <Sparkles className="h-3 w-3 text-sky-400" aria-hidden="true" />,
      style: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
    };
  } else {
    resolvedSrc = silhouetteUrl;
    statusBadge = {
      label: 'Specification Preview',
      icon: <Eye className="h-3 w-3 text-zinc-400" aria-hidden="true" />,
      style: 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20',
    };
  }

  return (
    <div
      data-testid="vehicle-image-container"
      data-tier={currentTier}
      data-source={imageSource || undefined}
      className={`relative w-full aspect-[16/10] overflow-hidden bg-zinc-950 rounded-lg border border-zinc-800/80 group ${className}`}
    >
      <Image
        key={resolvedSrc}
        src={resolvedSrc}
        alt={alt}
        fill
        unoptimized
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority={priority}
        className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
        onError={handleError}
      />

      <span
        data-testid="vehicle-image-badge"
        className={`absolute top-2 left-2 z-10 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border backdrop-blur-md shadow-sm ${statusBadge.style}`}
      >
        {statusBadge.icon}
        <span>{statusBadge.label}</span>
      </span>
    </div>
  );
}

export default VehicleImage;
