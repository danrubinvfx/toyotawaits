'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QUICK_SELECT_MODELS, QuickSelectModelOption } from './wait-time-estimator';

export interface ModelCarouselProps {
  models?: QuickSelectModelOption[];
  selectedModel?: string;
  onSelectModel?: (slug: string) => void;
  className?: string;
}

export function ModelCarousel({
  models = QUICK_SELECT_MODELS,
  selectedModel = 'rav4',
  onSelectModel,
  className,
}: ModelCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    // 5px tolerance threshold for subpixel scrolling
    const atStart = scrollLeft <= 5;
    const atEnd = scrollLeft + clientWidth >= scrollWidth - 5;

    setCanScrollLeft(!atStart);
    setCanScrollRight(!atEnd);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    checkScrollability();

    el.addEventListener('scroll', checkScrollability, { passive: true });
    window.addEventListener('resize', checkScrollability, { passive: true });

    return () => {
      el.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [checkScrollability, models]);

  const scrollByOneCard = (direction: 'left' | 'right') => {
    const el = containerRef.current;
    if (!el) return;

    const firstCard = el.querySelector<HTMLElement>('[data-carousel-card="true"]');
    // Scroll by one card width including gap (default ~180px fallback)
    const cardWidth = firstCard ? firstCard.offsetWidth + 12 : 180;
    const delta = direction === 'left' ? -cardWidth : cardWidth;

    el.scrollBy({
      left: delta,
      behavior: 'smooth',
    });
  };

  const handleSelect = (slug: string) => {
    if (onSelectModel) {
      onSelectModel(slug);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('toyotawait:model-change', { detail: { model: slug } })
      );
    }
  };

  return (
    <div
      role="region"
      aria-label="Vehicle model selection carousel"
      className={cn('relative w-full flex items-center', className)}
    >
      {/* Desktop Prev Button: visible and interactive on md: and above */}
      <button
        type="button"
        aria-label="Previous model"
        data-testid="carousel-prev-button"
        disabled={!canScrollLeft}
        onClick={() => scrollByOneCard('left')}
        className={cn(
          'hidden md:flex items-center justify-center absolute -left-3 z-20 h-8 w-8 rounded-full border border-neutral-700 bg-neutral-900/95 text-neutral-200 shadow-md transition-all duration-200 cursor-pointer',
          'hover:bg-neutral-800 hover:text-white hover:border-amber-500/60',
          'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500',
          !canScrollLeft && 'opacity-0 pointer-events-none cursor-not-allowed md:opacity-25'
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Scrollable Container: Frictionless touch swipe on mobile, smooth scroll, no scrollbar */}
      <div
        ref={containerRef}
        data-testid="model-carousel-container"
        className="flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory touch-pan-x w-full py-1 px-1"
      >
        {models.map((opt) => {
          const isSelected = opt.matchSlugs.includes(selectedModel) || opt.slug === selectedModel;
          return (
            <button
              key={opt.slug}
              type="button"
              data-carousel-card="true"
              data-testid={`model-card-${opt.slug}`}
              aria-pressed={isSelected}
              onClick={() => handleSelect(opt.slug)}
              className={cn(
                'snap-start shrink-0 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all duration-150 cursor-pointer select-none text-left whitespace-nowrap',
                isSelected
                  ? 'bg-amber-500 text-zinc-950 border-amber-400 font-bold shadow-sm ring-1 ring-amber-400/50'
                  : 'bg-neutral-900/90 text-neutral-300 hover:text-white hover:bg-neutral-800 border-neutral-800'
              )}
            >
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop Next Button: visible and interactive on md: and above */}
      <button
        type="button"
        aria-label="Next model"
        data-testid="carousel-next-button"
        disabled={!canScrollRight}
        onClick={() => scrollByOneCard('right')}
        className={cn(
          'hidden md:flex items-center justify-center absolute -right-3 z-20 h-8 w-8 rounded-full border border-neutral-700 bg-neutral-900/95 text-neutral-200 shadow-md transition-all duration-200 cursor-pointer',
          'hover:bg-neutral-800 hover:text-white hover:border-amber-500/60',
          'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500',
          !canScrollRight && 'opacity-0 pointer-events-none cursor-not-allowed md:opacity-25'
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export const VehicleSlider = ModelCarousel;
export default ModelCarousel;
