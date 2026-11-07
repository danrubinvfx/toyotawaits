'use client';

import React, { useState } from 'react';
import { VehicleSavingsCalculator } from './VehicleSavingsCalculator';
import { ShopByBudgetCalculator } from './ShopByBudgetCalculator';
import { TrustCalloutBanner } from './RelatedGuidesHub';
import { Car, DollarSign } from 'lucide-react';

export type CalculatorViewMode = 'MODEL' | 'BUDGET';

export function InteractiveCalculatorHub() {
  const [activeMode, setActiveMode] = useState<CalculatorViewMode>('MODEL');

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Top Segmented Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex p-1 rounded-xl bg-zinc-200/80 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 w-full sm:w-auto" role="tablist" aria-label="Calculator Mode Switcher">
          <button
            type="button"
            role="tab"
            aria-selected={activeMode === 'MODEL'}
            onClick={() => setActiveMode('MODEL')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeMode === 'MODEL'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Car className="w-4 h-4 text-red-600 dark:text-red-500" />
            <span>Shop by Toyota Model</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeMode === 'BUDGET'}
            onClick={() => setActiveMode('BUDGET')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeMode === 'BUDGET'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Shop by Monthly Budget</span>
          </button>
        </div>

        <span className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 italic">
          {activeMode === 'MODEL'
            ? 'Compare energy & payback across specific Toyota trims'
            : 'Find eligible Toyota models matching your target monthly payment'}
        </span>
      </div>

      {/* Trust Callout Banner (directly above calculator controls) */}
      <TrustCalloutBanner />

      {/* Active Mode Calculator Cockpit */}
      {activeMode === 'MODEL' ? (
        <VehicleSavingsCalculator />
      ) : (
        <ShopByBudgetCalculator />
      )}
    </div>
  );
}
