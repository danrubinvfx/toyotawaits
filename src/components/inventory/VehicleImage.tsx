'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Camera, Sparkles } from 'lucide-react';

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
}

export function generateTrimSlug(model?: string, trim?: string | null): string {
  const parts = [model, trim].filter(Boolean).join(' ');
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
}: VehicleImageProps) {
  const trimSlug = generateTrimSlug(model, trim) || 'base';
  const factoryTrimUrl = `/assets/models/${modelYear}/${trimSlug}.webp`;
  const silhouetteUrl = '/assets/placeholder-silhouette.svg';

  // Determine starting tier: Tier 1 if verified real lot photo is provided, otherwise Tier 2
  const initialTier: 1 | 2 | 3 =
    hasRealPhoto && imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))
      ? 1
      : 2;

  const [currentTier, setCurrentTier] = useState<1 | 2 | 3>(initialTier);

  // Downgrade tiers on error without infinite loops
  const handleError = () => {
    setCurrentTier((prev) => {
      if (prev === 1) return 2;
      if (prev === 2) return 3;
      return 3;
    });
  };

  let resolvedSrc: string;
  let statusBadge: { label: string; icon: React.ReactNode; style: string } | null = null;

  if (currentTier === 1 && imageUrl) {
    resolvedSrc = imageUrl;
    statusBadge = {
      label: 'Dealer Unit Photo',
      icon: <Camera className="h-3 w-3 text-emerald-400" aria-hidden="true" />,
      style: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80',
    };
  } else if (currentTier === 2) {
    resolvedSrc = factoryTrimUrl;
    statusBadge = {
      label: 'Factory Trim Render',
      icon: <Sparkles className="h-3 w-3 text-sky-400" aria-hidden="true" />,
      style: 'bg-sky-950/80 text-sky-300 border-sky-800/80',
    };
  } else {
    resolvedSrc = silhouetteUrl;
    statusBadge = null;
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
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority={priority}
        className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
        onError={handleError}
      />

      {statusBadge && (
        <div
          data-testid="vehicle-image-badge"
          className={`absolute top-2 left-2 z-10 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border backdrop-blur-md shadow-sm ${statusBadge.style}`}
        >
          {statusBadge.icon}
          <span>{statusBadge.label}</span>
        </div>
      )}
    </div>
  );
}

export default VehicleImage;
