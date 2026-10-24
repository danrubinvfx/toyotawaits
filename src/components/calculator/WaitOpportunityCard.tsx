'use client';

import React, { useState, useEffect, useId } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Clock, Info, Sparkles, CheckCircle2 } from 'lucide-react';
import { calculateExtraEnergyWhileWaiting } from '@/lib/calculator-engine';
import {
  fetchCohortWaitTime,
  CohortWaitTimeResult,
} from '@/lib/api/wait-times';

export interface WaitOpportunityCardProps {
  annualCostCurrent: number;
  annualCostTarget: number;
  targetModelSlug?: string;
  targetPowertrain?: string;
  province?: string;
  initialWaitDays?: number;
  onWaitDaysChange?: (days: number) => void;
  className?: string;
}

export function WaitOpportunityCard({
  annualCostCurrent,
  annualCostTarget,
  targetModelSlug = 'rav4',
  targetPowertrain = 'hev',
  province = 'BC',
  initialWaitDays = 180,
  onWaitDaysChange,
  className,
}: WaitOpportunityCardProps) {
  const [overrideProvince, setOverrideProvince] = useState<string | null>(null);
  const selectedProvince = overrideProvince ?? province;
  const [waitDays, setWaitDays] = useState<number>(initialWaitDays);
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const [cohortResult, setCohortResult] = useState<CohortWaitTimeResult | null>(null);

  const inputId = useId();

  // Fetch cohort wait times with Section 6 Evidence Contract
  useEffect(() => {
    let isCancelled = false;

    fetchCohortWaitTime({
      model: targetModelSlug,
      powertrain: targetPowertrain,
      province: selectedProvince,
    })
      .then((res) => {
        if (!isCancelled) {
          setCohortResult(res);

          // Auto-populate with cohort P50 ONLY when the evidence gate passes
          if (res.status === 'SUFFICIENT' && res.p50Days !== null && !hasUserEdited) {
            setWaitDays(res.p50Days);
            onWaitDaysChange?.(res.p50Days);
          }
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setCohortResult({
            p50Days: null,
            sampleCount: 0,
            isStale: false,
            status: 'NETWORK_ERROR',
          });
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [targetModelSlug, targetPowertrain, selectedProvince, hasUserEdited, onWaitDaysChange]);

  const handleWaitDaysChange = (newDays: number) => {
    if (!Number.isFinite(newDays)) return;
    const clamped = Math.min(730, Math.max(0, Math.round(newDays)));
    setWaitDays(clamped);
    setHasUserEdited(true);
    onWaitDaysChange?.(clamped);
  };

  const handleApplyCohortMedian = () => {
    if (cohortResult?.status === 'SUFFICIENT' && cohortResult.p50Days !== null) {
      setWaitDays(cohortResult.p50Days);
      setHasUserEdited(false);
      onWaitDaysChange?.(cohortResult.p50Days);
    }
  };

  // Pure engine calculation for extra energy while waiting
  const extraEnergy = calculateExtraEnergyWhileWaiting(
    annualCostCurrent,
    annualCostTarget,
    waitDays
  );

  const isPositive = extraEnergy > 0;
  const isZero = extraEnergy === 0;
  const isNegative = extraEnergy < 0;

  return (
    <Card className={`border border-zinc-200 dark:border-zinc-800 shadow-sm ${className ?? ''}`}>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            Wait Opportunity Cost
          </CardTitle>

          <div className="flex items-center gap-1" role="group" aria-label="Select delivery province">
            {(['BC', 'ON', 'AB', 'QC'] as const).map((prov) => (
              <button
                key={prov}
                type="button"
                onClick={() => {
                  setOverrideProvince(prov);
                  setHasUserEdited(false);
                }}
                className={`px-2 py-1 text-xs font-semibold rounded border transition-colors cursor-pointer ${
                  selectedProvince === prov
                    ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {prov}
              </button>
            ))}
          </div>
        </div>

        {/* Evidence Cohort Badge */}
        {cohortResult?.status === 'SUFFICIENT' && cohortResult.cohortDescription && (
          <div className="pt-2">
            <Badge
              variant="secondary"
              className="text-[11px] font-medium bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 flex items-center gap-1 w-fit"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>{cohortResult.cohortDescription}</span>
            </Badge>
          </div>
        )}

        {cohortResult?.status === 'INSUFFICIENT_DATA' && (
          <div className="pt-2">
            <Badge variant="outline" className="text-[10px] text-zinc-500 w-fit">
              Manual Estimate Mode (&lt; 20 recent deliveries)
            </Badge>
          </div>
        )}

        {cohortResult?.status === 'STALE' && (
          <div className="pt-2">
            <Badge variant="destructive" className="text-[10px] w-fit">
              Stale Data (&gt; 7d old)
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Strict Requirement Label & Signed Result Display */}
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Estimated Extra Energy Cost While Waiting
          </div>

          <div className="flex flex-wrap items-baseline gap-2">
            <span
              className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
                isPositive
                  ? 'text-amber-700 dark:text-amber-400'
                  : isNegative
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-zinc-700 dark:text-zinc-300'
              }`}
            >
              {isPositive && `+$${extraEnergy.toLocaleString()} CAD`}
              {isNegative && `-$${Math.abs(extraEnergy).toLocaleString()} CAD`}
              {isZero && `$0 CAD`}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              over {waitDays} days ({Math.round(waitDays / 30)} mos) of waiting
            </span>
          </div>

          {/* Honest Signed Result Explanations */}
          <div className="text-xs text-zinc-600 dark:text-zinc-400 pt-1">
            {isPositive && (
              <p>
                Driving your current vehicle is projected to cost ${extraEnergy.toLocaleString()} CAD more in fuel over {waitDays} days compared to driving your target Toyota.
              </p>
            )}
            {isNegative && (
              <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                Current-car energy use costs less over the wait period (saving ${Math.abs(extraEnergy).toLocaleString()} CAD in energy while waiting).
              </p>
            )}
            {isZero && (
              <p>
                No extra energy cost accrued while waiting ({waitDays} days).
              </p>
            )}
          </div>
        </div>

        {/* Estimator "Can't Wait?" Bridge Pill */}
        {(waitDays >= 180 || cohortResult?.status === 'SUFFICIENT') && (
          <div
            data-testid="estimator-inventory-bridge-pill"
            className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-sky-500/30 bg-sky-950/20 p-3.5 text-xs"
          >
            <div className="flex flex-col gap-0.5">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-sky-400">
                ⚡ Skip the wait?
              </span>
              <span className="text-neutral-300">
                Explore live unreserved units and incoming allocations observed across Lower Mainland dealers.
              </span>
            </div>
            <Link
              className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-sky-500 px-3 py-1.5 font-bold text-zinc-950 shadow-sm transition hover:bg-sky-400 active:scale-95"
              href={`/inventory?model=${encodeURIComponent(targetModelSlug)}`}
            >
              View Stock ↗
            </Link>
          </div>
        )}

        {/* Wait Days Controls: Slider & Number Input (min 44px targets) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <Label
              htmlFor={inputId}
              className="text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5"
            >
              Projected Delivery Wait (Days)
            </Label>
            <div className="w-28">
              <Input
                id={inputId}
                aria-label="Delivery wait time in days"
                type="number"
                min={0}
                max={730}
                step={5}
                value={waitDays}
                onChange={(e) => handleWaitDaysChange(Number(e.target.value))}
                className="min-h-[44px] text-right font-mono font-semibold"
              />
            </div>
          </div>

          <div className="pt-1">
            <input
              id={`${inputId}-slider`}
              aria-label="Delivery wait time slider in days"
              type="range"
              min={0}
              max={730}
              step={5}
              value={waitDays}
              onChange={(e) => handleWaitDaysChange(Number(e.target.value))}
              className="w-full min-h-[44px] accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>0 days (Immediate)</span>
              <span>180 days (6 mos)</span>
              <span>365 days (1 yr)</span>
              <span>730 days (2 yrs)</span>
            </div>
          </div>

          {/* Quick Preset Chips (min 44px touch targets) */}
          <div className="flex flex-wrap items-center gap-2 pt-1" role="group" aria-label="Quick wait time presets">
            {[
              { label: '3 mos (90d)', days: 90 },
              { label: '6 mos (180d)', days: 180 },
              { label: '9 mos (270d)', days: 270 },
              { label: '12 mos (365d)', days: 365 },
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => handleWaitDaysChange(chip.days)}
                className={`min-h-[44px] px-3 py-2 text-xs rounded-md border font-medium transition-colors ${
                  waitDays === chip.days
                    ? 'border-amber-600 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:border-amber-500 dark:text-amber-300'
                    : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {chip.label}
              </button>
            ))}

            {cohortResult?.status === 'SUFFICIENT' && cohortResult.p50Days !== null && (
              <button
                type="button"
                onClick={handleApplyCohortMedian}
                className={`min-h-[44px] px-3 py-2 text-xs rounded-md border font-semibold flex items-center gap-1 transition-colors ${
                  waitDays === cohortResult.p50Days && !hasUserEdited
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-500 dark:text-emerald-300'
                    : 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-200'
                }`}
              >
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Empirical P50 ({cohortResult.p50Days}d)</span>
              </button>
            )}
          </div>
        </div>

        {/* Clear Visual Note & Disclaimer */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
          <div className="flex items-start gap-1.5 font-medium text-zinc-700 dark:text-zinc-300">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-zinc-500" />
            <span>Historical median total wait for past deliveries, not a guaranteed delivery date.</span>
          </div>
          <p className="italic">
            Assumes target vehicle were available today, constant energy prices, and use of current car until delivery. Excludes purchase deferral benefits, financing, repairs, and depreciation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
