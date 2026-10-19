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
  ShieldCheck,
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
      {/* Top Banner: Strict label */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 dark:from-red-700 dark:to-rose-800 px-6 py-4 text-white">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-red-100">
            Energy-Cost Savings
          </span>
          <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 text-xs">
            Annual Projection
          </Badge>
        </div>

        {/* Primary Savings Number */}
        <div className="mt-3">
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {isPositiveSavings ? (
              <span>${Math.abs(results.annualSavings).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} CAD</span>
            ) : (
              <span>-${Math.abs(results.annualSavings).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} CAD</span>
            )}
            <span className="text-base sm:text-lg font-normal text-red-100 ml-1.5">/ year</span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-red-100">
            <span>
              {isPositiveSavings ? '+' : '-'}
              ${Math.abs(results.monthlySavings).toFixed(0)} CAD / month
            </span>
            <span>•</span>
            <span className="font-semibold underline decoration-white/40 underline-offset-4">
              {results.savingsPercent.toFixed(1)}% {isPositiveSavings ? 'reduction' : 'increase'} in energy spend
            </span>
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Cost Comparison Summary Grid */}
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="space-y-1">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Current Baseline
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
              ${results.currentAnnualCost.toLocaleString()}
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 block">
              ${results.currentMonthlyCost.toFixed(0)} / mo • {results.currentAnnualFuelL.toLocaleString()} L gas
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Target Toyota
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              ${results.targetAnnualCost.toLocaleString()}
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 block">
              ${results.targetMonthlyCost.toFixed(0)} / mo
            </span>
          </div>
        </div>

        {/* Itemized Energy Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            <span>Target Energy Breakdown</span>
            <span>Annual Spend</span>
          </div>

          {results.targetIsPhev ? (
            /* PHEV Itemization: Electricity ($CAD & kWh) vs Gasoline ($CAD & Litres) */
            <div className="space-y-2.5">
              {/* Electricity Row */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      Electricity (EV Mode)
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                      {results.targetAnnualElectricKwh.toLocaleString()} kWh
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-bold text-emerald-700 dark:text-emerald-300">
                    ${results.targetAnnualElectricCost.toFixed(2)} CAD
                  </span>
                </div>
              </div>

              {/* Gasoline Row */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-700 dark:text-amber-300">
                    <Fuel className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      Gasoline (Hybrid Mode)
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                      {results.targetAnnualGasL.toLocaleString()} Litres
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-bold text-amber-800 dark:text-amber-300">
                    ${results.targetAnnualGasCost.toFixed(2)} CAD
                  </span>
                </div>
              </div>

              {/* Combined Total */}
              <div className="flex items-center justify-between pt-1 px-1 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                <span>Combined PHEV Operating Cost</span>
                <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                  ${results.targetAnnualCost.toFixed(2)} CAD
                </span>
              </div>
            </div>
          ) : (
            /* HEV / Gas Itemization */
            <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-red-600 dark:text-red-500" />
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Gasoline Consumption
                  </span>
                </div>
                <span className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  ${results.targetAnnualGasCost.toFixed(2)} CAD
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pt-1 border-t border-zinc-100 dark:border-zinc-800 font-mono">
                <span>Annual Fuel Consumed</span>
                <span>{results.targetAnnualGasL.toLocaleString()} Litres</span>
              </div>
            </div>
          )}
        </div>

        {/* Share Calculation Button */}
        <div className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCopyLink}
            className="w-full min-h-[44px] flex items-center justify-center gap-2 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer font-medium text-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Link Copied with All Custom Inputs!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                <span>Copy Shareable Link (#hash)</span>
              </>
            )}
          </Button>
        </div>

        {/* Disclaimers & Methodology */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
          <div className="flex items-center gap-1.5 font-semibold text-zinc-700 dark:text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />
            <span>Scope Notice: Energy-Cost Savings Only</span>
          </div>
          <p>
            This Stage 2 Energy MVP models direct fuel and wall-to-wheel electricity consumption. It excludes vehicle purchase price, provincial/federal taxes, insurance premiums, maintenance schedules, and wait time depreciation. Full Total Cost of Ownership (TCO) & Payback period are calculated in Stage 3.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
