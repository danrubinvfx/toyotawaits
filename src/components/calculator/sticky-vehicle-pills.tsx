'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { QUICK_SELECT_MODELS, QuickSelectModelOption } from './wait-time-estimator';

import Link from 'next/link';
import { PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export interface StickyVehiclePillsProps {
  initialModel?: string;
  onSelectModel?: (slug: string) => void;
  className?: string;
}

export function StickyVehiclePills({
  initialModel = 'rav4',
  onSelectModel,
  className,
}: StickyVehiclePillsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(initialModel);
  const [selectedPowertrain, setSelectedPowertrain] = useState<string>('');
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [orderDate, setOrderDate] = useState<string>('');

  const checkScrollability = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
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
  }, [checkScrollability]);

  const scrollByCard = (direction: 'left' | 'right') => {
    const el = containerRef.current;
    if (!el) return;
    const firstButton = el.querySelector<HTMLElement>('button');
    const scrollAmount = firstButton ? firstButton.offsetWidth + 8 : 150;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Listen for model sync events from the Estimator dropdown
  useEffect(() => {
    const handleModelSync = (e: Event) => {
      const customEvent = e as CustomEvent<{
        model?: string;
        powertrain?: string;
        province?: string;
        orderDate?: string;
        depositDate?: string;
      }>;
      if (customEvent.detail) {
        if (customEvent.detail.model) setSelectedModel(customEvent.detail.model);
        if (customEvent.detail.powertrain) setSelectedPowertrain(customEvent.detail.powertrain);
        if (customEvent.detail.province) setSelectedProvince(customEvent.detail.province);
        if (customEvent.detail.orderDate || customEvent.detail.depositDate) {
          setOrderDate(customEvent.detail.orderDate || customEvent.detail.depositDate || '');
        }
      }
    };

    window.addEventListener('toyotawait:model-sync', handleModelSync);
    return () => {
      window.removeEventListener('toyotawait:model-sync', handleModelSync);
    };
  }, []);

  const handlePillClick = (opt: QuickSelectModelOption) => {
    setSelectedModel(opt.slug);
    if (onSelectModel) {
      onSelectModel(opt.slug);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('toyotawait:model-change', { detail: { model: opt.slug } })
      );
    }
  };

  return (
    <div
      role="region"
      aria-label="Popular models quick selector"
      className={cn(
        'sticky top-14 sm:top-16 z-40 w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 py-2 px-4 shadow-md',
        className
      )}
    >
      <div className="container mx-auto max-w-6xl flex items-center justify-between gap-3 px-1 sm:px-4">
        <div className="relative flex-1 flex items-center min-w-0">
          {/* Desktop Left Chevron Button */}
          <button
            type="button"
            aria-label="Previous vehicles"
            data-testid="pills-prev-button"
            disabled={!canScrollLeft}
            onClick={() => scrollByCard('left')}
            className={cn(
              'hidden md:flex items-center justify-center shrink-0 mr-1.5 h-7 w-7 rounded-full border border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all cursor-pointer',
              !canScrollLeft && 'opacity-25 pointer-events-none cursor-not-allowed'
            )}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          <div
            ref={containerRef}
            role="tablist"
            aria-label="Popular models list"
            className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 w-full justify-start md:justify-center snap-x snap-mandatory scroll-smooth touch-pan-x"
          >
            {QUICK_SELECT_MODELS.map((opt) => {
              const isActive = opt.matchSlugs.includes(selectedModel);
              return (
                <button
                  key={opt.label}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  data-testid={`quick-model-${opt.slug}`}
                  onClick={() => handlePillClick(opt)}
                  className={cn(
                    'snap-start shrink-0 px-3 py-1 text-xs sm:px-3.5 sm:py-1.5 sm:text-sm rounded-full transition-all cursor-pointer select-none',
                    isActive
                      ? 'bg-amber-500 text-black font-semibold shadow-sm border border-amber-400'
                      : 'bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Desktop Right Chevron Button */}
          <button
            type="button"
            aria-label="Next vehicles"
            data-testid="pills-next-button"
            disabled={!canScrollRight}
            onClick={() => scrollByCard('right')}
            className={cn(
              'hidden md:flex items-center justify-center shrink-0 ml-1.5 h-7 w-7 rounded-full border border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all cursor-pointer',
              !canScrollRight && 'opacity-25 pointer-events-none cursor-not-allowed'
            )}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <Link
          href={(() => {
            const params = new URLSearchParams();
            if (selectedModel) params.set('model', selectedModel);
            if (selectedPowertrain) params.set('powertrain', selectedPowertrain);
            if (selectedProvince) params.set('province', selectedProvince);
            if (orderDate) params.set('orderDate', orderDate);
            const qs = params.toString();
            return qs ? `/submit?${qs}` : '/submit';
          })()}
          className="shrink-0 hidden lg:inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full transition-all whitespace-nowrap"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>+ Add Delivery</span>
        </Link>
      </div>
    </div>
  );
}

export default StickyVehiclePills;
