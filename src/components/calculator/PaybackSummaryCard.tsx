'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Zap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { PaybackResult, ComparisonMode } from '@/types/calculator';

export interface PaybackSummaryCardProps {
  payback: PaybackResult;
  comparisonMode: ComparisonMode;
  waitDays?: number;
  className?: string;
}

export function PaybackSummaryCard({
  payback,
  comparisonMode,
  waitDays = 0,
  className,
}: PaybackSummaryCardProps) {
  const {
    condition,
    annualSavings,
    upfrontDifference,
    simplePaybackYears,
    effectivePaybackYears,
    extraEnergyCostWhileWaiting,
    summaryMessage,
  } = payback;

  // Format years & months
  const formatYearsAndMonths = (years: number | null): string => {
    if (years === null) return 'N/A';
    const roundedYears = (Math.round(years * 10) / 10).toFixed(1);
    const months = Math.round(years * 12);
    return `${roundedYears} Years (or ${months} mos)`;
  };

  const formatYearsOnly = (years: number | null): string => {
    if (years === null) return 'N/A';
    return (Math.round(years * 10) / 10).toFixed(1);
  };

  return (
    <Card className={`border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm ${className ?? ''}`}>
      <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Payback Evaluation & Recovery Summary
              </CardTitle>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Pure cash outlay payback based on ongoing energy savings
              </p>
            </div>
          </div>

          <div>
            {condition === 'POSITIVE_PAYBACK' && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300 border-green-200 dark:border-green-800">
                Positive Payback
              </Badge>
            )}
            {condition === 'NO_UPFRONT_PREMIUM' && (
              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                Immediate Win
              </Badge>
            )}
            {condition === 'LOWER_OUTLAY_SAVINGS' && (
              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                Lower Outlay & Savings
              </Badge>
            )}
            {condition === 'NO_ENERGY_SAVINGS' && (
              <Badge variant="outline" className="text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700">
                No Energy Savings
              </Badge>
            )}
            {condition === 'HIGHER_ENERGY_COST' && (
              <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800">
                Higher Energy Cost
              </Badge>
            )}
            {condition === 'LOWER_OUTLAY_HIGHER_ENERGY' && (
              <Badge variant="outline" className="border-amber-400 text-amber-700 dark:text-amber-400">
                Savings Exhaustion
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-5">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
            <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block">
              Upfront Difference
            </span>
            <span className={`text-base font-bold ${
              upfrontDifference > 0
                ? 'text-zinc-900 dark:text-zinc-100'
                : upfrontDifference < 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-zinc-700 dark:text-zinc-300'
            }`}>
              {upfrontDifference > 0
                ? `+$${upfrontDifference.toLocaleString()}`
                : upfrontDifference < 0
                ? `-$${Math.abs(upfrontDifference).toLocaleString()}`
                : '$0 CAD'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
            <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block">
              Annual Energy Savings
            </span>
            <span className={`text-base font-bold ${
              annualSavings > 0
                ? 'text-green-600 dark:text-green-400'
                : annualSavings < 0
                ? 'text-red-600 dark:text-red-400'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}>
              {annualSavings > 0
                ? `+$${annualSavings.toLocaleString()}/yr`
                : annualSavings < 0
                ? `-$${Math.abs(annualSavings).toLocaleString()}/yr`
                : '$0/yr'}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
            <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block">
              Delivery Wait
            </span>
            <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {waitDays > 0 ? `${waitDays} days` : 'Immediate (0d)'}
            </span>
          </div>
        </div>

        {/* 6 Canonical Condition Display Cards */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 space-y-3">
          {condition === 'POSITIVE_PAYBACK' && (
            <div className="space-y-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Approximate simple energy-savings payback after delivery: {formatYearsAndMonths(simplePaybackYears)}
                  </div>
                  {comparisonMode === 'KEEP_VS_REPLACE' && (
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                      Years from today: {formatYearsOnly(effectivePaybackYears)} Years
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 pl-7 leading-relaxed">
                Recovers the ${upfrontDifference.toLocaleString()} net purchase outlay difference post-delivery through ${annualSavings.toLocaleString()}/yr in lower energy spending.
                {waitDays > 0 && ` Incurs an estimated $${extraEnergyCostWhileWaiting.toLocaleString()} extra in energy while waiting for delivery.`}
              </p>
            </div>
          )}

          {condition === 'NO_ENERGY_SAVINGS' && (
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-zinc-400 dark:text-zinc-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  No energy savings to recover the premium.
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Both vehicles have identical estimated annual energy costs (${payback.annualSavings}/yr savings), so the ${upfrontDifference.toLocaleString()} upfront premium is never recovered through energy savings alone.
                </p>
              </div>
            </div>
          )}

          {condition === 'HIGHER_ENERGY_COST' && (
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                  Higher energy spending; no energy-savings payback.
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  The comparison target incurs an estimated ${Math.abs(annualSavings).toLocaleString()}/yr in higher energy costs, meaning the upfront premium will never break even on fuel/electricity costs.
                </p>
              </div>
            </div>
          )}

          {condition === 'NO_UPFRONT_PREMIUM' && (
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  No upfront premium to recover; immediate energy savings.
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Both vehicles carry identical upfront outlay ($0 difference). You start saving ${annualSavings.toLocaleString()}/yr immediately upon taking delivery.
                </p>
              </div>
            </div>
          )}

          {condition === 'LOWER_OUTLAY_SAVINGS' && (
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  Lower upfront outlay; lower or equal energy spending (no negative payback years).
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  The target vehicle costs ${Math.abs(upfrontDifference).toLocaleString()} less upfront and saves ${annualSavings.toLocaleString()}/yr in energy spending. Immediate net benefit with no recovery horizon needed.
                </p>
              </div>
            </div>
          )}

          {condition === 'LOWER_OUTLAY_HIGHER_ENERGY' && (
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                  Lower upfront outlay, but higher ongoing energy spending.
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  While ${Math.abs(upfrontDifference).toLocaleString()} cheaper upfront, higher ongoing energy costs of ${Math.abs(annualSavings).toLocaleString()}/yr will completely exhaust the initial upfront savings in approximately {formatYearsOnly(simplePaybackYears)} years.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
