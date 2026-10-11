'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { QUICK_SELECT_MODELS, QuickSelectModelOption } from './wait-time-estimator';

import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

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
  const [selectedModel, setSelectedModel] = useState<string>(initialModel);

  // Listen for model sync events from the Estimator dropdown
  useEffect(() => {
    const handleModelSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ model: string }>;
      if (customEvent.detail?.model) {
        setSelectedModel(customEvent.detail.model);
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
        'sticky top-16 z-30 w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 py-2 sm:py-2.5 px-4 shadow-md',
        className
      )}
    >
      <div className="container mx-auto max-w-6xl flex items-center justify-between gap-3 px-1 sm:px-4">
        <div
          role="tablist"
          aria-label="Popular models list"
          className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 w-full justify-start md:justify-center snap-x snap-mandatory scroll-smooth"
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

        <Link
          href="/submit"
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
