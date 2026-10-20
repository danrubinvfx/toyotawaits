'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Fuel,
  Zap,
  Share2,
  Check,
} from 'lucide-react';
import { CalculatorResults } from '@/lib/hooks/useSavingsCalculator';

export interface EnergyResultsCardProps {
  results: CalculatorResults;
  className?: string;
}

export function EnergyResultsCard({ results, className }: EnergyResultsCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      if (typeof window !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(results.shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  const isPositiveSavings = results.annualSavings >= 0;

  return (
    <Card className={`border-2 border-red-500/20 dark:border-red-500/30 overflow-hidden shadow-lg ${className ?? ''}`}>
      {/* Top Banner: Strict label & Dense Layout */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 dark:from-red-700 dark:to-rose-800 px-4 py-3 text-white">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-100">
            Energy-Cost Savings
          </span>
          <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 text-[10px] px-1.5 py-0.5">
            Annual Projection
          </Badge>
        </div>

        {/* Primary Savings Number */}
        <div className="mt-2 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isPositiveSavings ? (
              <span>${Math.abs(results.annualSavings).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} CAD</span>
            ) : (
              <span>-${Math.abs(results.annualSavings).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} CAD</span>
            )}
            <span className="text-xs sm:text-sm font-normal text-red-100 ml-1">/ yr</span>
          </div>

          <div className="text-xs text-red-100 flex items-center gap-1.5">
            <span>
              {isPositiveSavings ? '+' : '-'}
              ${Math.abs(results.monthlySavings).toFixed(0)} CAD / month
            </span>
            <span>•</span>
            <span className="font-semibold underline decoration-white/40 underline-offset-2">
              {results.savingsPercent.toFixed(1)}% {isPositiveSavings ? 'reduction' : 'increase'} in energy spend
            </span>
          </div>
        </div>
      </div>

      <CardContent className="p-3.5 space-y-2.5">
        {/* Cost Comparison Summary Grid: 2-column inline card */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80">
          <div className="space-y-0.5">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium block">
              Current Baseline
            </span>
            <div className="text-base sm:text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100">
              ${results.currentAnnualCost.toLocaleString()}
            </div>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block truncate">
              ${results.currentMonthlyCost.toFixed(0)} / mo • {results.currentAnnualFuelL.toLocaleString()} L gas
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium block">
              Target Toyota
            </span>
            <div className="text-base sm:text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
              ${results.targetAnnualCost.toLocaleString()}
            </div>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">
              ${results.targetMonthlyCost.toFixed(0)} / mo
            </span>
          </div>
        </div>

        {/* Itemized Energy Breakdown */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            <span>Target Energy Breakdown</span>
            <span>Annual Spend</span>
          </div>

          {results.targetIsPhev ? (
            /* PHEV Itemization: Electricity ($CAD & kWh) vs Gasoline ($CAD & Litres) */
            <div className="space-y-1.5">
              {/* Electricity Row */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                      Electricity (EV Mode)
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                      {results.targetAnnualElectricKwh.toLocaleString()} kWh
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    ${results.targetAnnualElectricCost.toFixed(2)} CAD
                  </span>
                </div>
              </div>

              {/* Gasoline Row */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
                    <Fuel className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                      Gasoline (Hybrid Mode)
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                      {results.targetAnnualGasL.toLocaleString()} Litres
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-amber-800 dark:text-amber-300">
                    ${results.targetAnnualGasCost.toFixed(2)} CAD
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* HEV (pure gas) single-row badge */
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 text-xs">
              <div className="flex items-center gap-2">
                <Fuel className="w-3.5 h-3.5 text-red-600 dark:text-red-500 shrink-0" />
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  Gasoline: {results.targetAnnualGasL.toLocaleString()} L
                </span>
              </div>
              <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                ${results.targetAnnualGasCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} CAD/yr
              </span>
            </div>
          )}
        </div>

        {/* Share Calculation Button: Compact h-8 text-xs */}
        <div className="pt-0.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="w-full h-8 min-h-[32px] flex items-center justify-center gap-1.5 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer font-medium text-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Link Copied with All Custom Inputs!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                <span>Copy Shareable Link</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
