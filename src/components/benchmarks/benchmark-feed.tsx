'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ModelWaitBenchmark, BASELINE_MODEL_BENCHMARKS } from '@/lib/db/stats';
import { Clock, CheckCircle2, ArrowRight, Sparkles, SlidersHorizontal, Car } from 'lucide-react';
import { DeliveryPrepChecklist } from '@/components/dashboard/delivery-prep-checklist';
import { WinterGuide } from '@/components/winter-prep/winter-guide';
import { cn } from '@/lib/utils';

export interface VehicleOption {
  id: string;
  label: string;
  name: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  powertrain?: string;
}

export const VEHICLE_OPTIONS: VehicleOption[] = [
  {
    id: 'rav4',
    label: 'RAV4 (Hybrid/Prime)',
    name: 'Toyota RAV4',
    subtitle: 'Prime PHEV & Hybrid (AWD)',
    badge: 'High Demand',
    badgeColor: 'border-red-500/30 text-red-500 bg-red-500/10',
    powertrain: 'phev',
  },
  {
    id: 'grand-highlander',
    label: 'Grand Highlander',
    name: 'Toyota Grand Highlander',
    subtitle: 'MAX Hybrid & Turbo Gas (AWD)',
    badge: 'Family SUV',
    badgeColor: 'border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/10',
    powertrain: 'hev',
  },
  {
    id: 'sienna',
    label: 'Sienna',
    name: 'Toyota Sienna',
    subtitle: 'Hybrid Family Minivan (eAWD)',
    badge: 'Allocation Quota',
    badgeColor: 'border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10',
    powertrain: 'hev',
  },
  {
    id: 'prius-prime',
    label: 'Prius Prime',
    name: 'Toyota Prius Prime',
    subtitle: 'Plug-in Hybrid (PHEV)',
    badge: 'ZEV Rebate Eligible',
    badgeColor: 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
    powertrain: 'phev',
  },
  {
    id: 'corolla-cross',
    label: 'Corolla Cross',
    name: 'Toyota Corolla Cross',
    subtitle: 'Hybrid AWD & Gas Compact',
    badge: 'Subcompact Utility',
    badgeColor: 'border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/10',
    powertrain: 'hev',
  },
  {
    id: 'tacoma',
    label: 'Tacoma',
    name: 'Toyota Tacoma',
    subtitle: 'i-FORCE MAX Hybrid & Turbo',
    badge: 'Mid-Size Truck',
    badgeColor: 'border-orange-500/30 text-orange-600 dark:text-orange-400 bg-orange-500/10',
    powertrain: 'hev',
  },
];

export interface BenchmarkFeedProps {
  initialBenchmarks?: Record<string, ModelWaitBenchmark>;
  defaultModelId?: string;
  onSelectModel?: (modelSlug: string) => void;
  className?: string;
}

export function BenchmarkFeed({
  initialBenchmarks = BASELINE_MODEL_BENCHMARKS,
  defaultModelId = 'rav4',
  onSelectModel,
  className,
}: BenchmarkFeedProps) {
  const [selectedModel, setSelectedModel] = useState<string>(defaultModelId);
  const [benchmarks, setBenchmarks] = useState<Record<string, ModelWaitBenchmark>>(initialBenchmarks);
  const [showUniversalGear, setShowUniversalGear] = useState<boolean>(false);

  useEffect(() => {
    let isCancelled = false;

    fetch('/api/stats', { cache: 'no-store' })
      .then((res) => res.json())
      .then((res) => {
        if (!isCancelled && res.success && res.data) {
          setBenchmarks((prev) => ({ ...prev, ...res.data }));
        }
      })
      .catch((err) => {
        console.warn('Using baseline model benchmarks in BenchmarkFeed:', err);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const activeVehicle =
    VEHICLE_OPTIONS.find((v) => v.id === selectedModel) || VEHICLE_OPTIONS[0];

  const stats =
    benchmarks[activeVehicle.id] ||
    BASELINE_MODEL_BENCHMARKS[activeVehicle.id] || {
      model: activeVehicle.id,
      sample_size: 15,
      min_days: 90,
      p25_days: 180,
      median_days: 340,
      p75_days: 420,
      max_days: 520,
      mean_days: 330,
    };

  const medianDays = stats.median_days;
  const p25Days = stats.p25_days;
  const p75Days = stats.p75_days;
  const sampleSize = stats.sample_size;
  const medianMonths = (medianDays / 30.4).toFixed(1);

  const handleModelChange = (id: string) => {
    setSelectedModel(id);
    onSelectModel?.(id);
  };

  return (
    <div className={cn('space-y-6', className)} data-testid="benchmark-feed">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500 shrink-0" />
            Verified Canadian Wait-Time Benchmarks
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Real-time empirical delivery percentiles calculated directly from crowdsourced Canadian buyer reports.
          </p>
        </div>
        <Badge
          variant="outline"
          className="border-amber-500/30 text-amber-500 bg-amber-500/5 self-start sm:self-auto text-xs shrink-0"
        >
          <Sparkles className="h-3 w-3 mr-1" />
          Live 2026 Supabase Feed
        </Badge>
      </div>

      {/* 2. Prominent Vehicle Selector (Mobile: Scrollable Pills, Desktop: Segmented Control) */}
      <div className="sticky top-14 sm:top-16 z-20 bg-zinc-950/90 backdrop-blur-md py-2.5 -mx-4 px-4 sm:mx-0 sm:px-0 border-y sm:border sm:rounded-xl border-zinc-800/80 shadow-md">
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-zinc-400 pl-3 shrink-0">
            <Car className="h-4 w-4 text-amber-500" />
            <span>Select Vehicle:</span>
          </div>

          {/* Segmented Options: Horizontal Scroll on Mobile */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full sm:w-auto flex-1">
            {VEHICLE_OPTIONS.map((option) => {
              const isSelected = selectedModel === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleModelChange(option.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    'inline-flex items-center whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer shrink-0',
                    isSelected
                      ? 'bg-amber-500 text-zinc-950 shadow-sm font-bold scale-[1.02]'
                      : 'bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800/60'
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Single Active Benchmark Card */}
      <Card
        data-testid={`benchmark-card-${activeVehicle.id}`}
        className="border-zinc-800 bg-zinc-900/80 shadow-md overflow-hidden transition-all duration-200 hover:border-zinc-700"
      >
        <CardHeader className="p-4 sm:p-5 pb-3 sm:pb-4 border-b border-zinc-800/80 bg-zinc-900/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg sm:text-xl font-bold text-zinc-100 tracking-tight">
                  {activeVehicle.name}
                </CardTitle>
                <Badge variant="outline" className={cn('text-[10px] font-bold px-2 py-0.5', activeVehicle.badgeColor)}>
                  {activeVehicle.badge}
                </Badge>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">{activeVehicle.subtitle}</p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                ~{medianMonths} Months Typical Delivery
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-stretch">
            {/* Median Wait Display */}
            <div className="bg-zinc-950/80 rounded-xl p-3.5 border border-zinc-800/80 flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Median National Delivery Wait
              </span>
              <div className="flex items-baseline gap-1.5 mt-1.5">
                <span className="text-3xl sm:text-4xl font-black text-zinc-50 font-mono tracking-tight">
                  {medianDays}
                </span>
                <span className="text-sm font-semibold text-zinc-400">Days</span>
              </div>
            </div>

            {/* P25 & P75 Percentile Range */}
            <div className="bg-zinc-950/80 rounded-xl p-3.5 border border-zinc-800/80 flex flex-col justify-between space-y-2">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Empirical Wait Range (P25 – P75)
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-[11px]">P25 (Fast Allocations):</span>
                  <span className="font-bold text-zinc-100 font-mono">{p25Days}d</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-[11px]">P75 (Backlogged Queue):</span>
                  <span className="font-bold text-zinc-100 font-mono">{p75Days}d</span>
                </div>
              </div>
            </div>

            {/* Sample Size & Action CTA */}
            <div className="bg-zinc-950/80 rounded-xl p-3.5 border border-zinc-800/80 flex flex-col justify-between space-y-3">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Based on {sampleSize} verified deliveries</span>
              </div>

              <Button
                asChild
                size="sm"
                className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs h-8 gap-1 cursor-pointer transition-all shadow-xs"
                onClick={() => onSelectModel?.(activeVehicle.id)}
              >
                <Link href={`/#estimator`}>
                  Calculate {activeVehicle.name} Timeline
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Dynamic Gear & Mods Placement Positioned Directly Below Benchmark */}
      <div id="delivery-prep" className="space-y-3 scroll-mt-24 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-100 flex items-center gap-2">
              <span>Delivery Prep &amp; Priority Gear:</span>
              <span className="text-amber-400">{activeVehicle.label}</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Community-vetted drop-in gear, dashcam harnesses, and protective armor matching {activeVehicle.name}.
            </p>
          </div>

          {/* Secondary Toggle: View All Universal Delivery Gear */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowUniversalGear((prev) => !prev)}
            className={cn(
              'text-xs h-8 border-zinc-700 transition-all font-medium self-start sm:self-auto cursor-pointer',
              showUniversalGear
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-400 hover:bg-amber-500/20'
                : 'bg-zinc-900/80 text-zinc-300 hover:text-amber-400 hover:border-amber-500/40'
            )}
          >
            <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-amber-500 shrink-0" />
            {showUniversalGear ? `Filter to ${activeVehicle.label} Only` : 'View All Universal Delivery Gear'}
          </Button>
        </div>

        {/* Dynamic Delivery Prep Checklist Component */}
        <DeliveryPrepChecklist
          model={showUniversalGear ? 'all' : activeVehicle.id}
          powertrain={activeVehicle.powertrain}
          defaultExpanded={true}
        />
      </div>

      {/* 5. Canadian Winter Prep & Survival Guide Bound to Selected Vehicle */}
      <WinterGuide modelKey={activeVehicle.id} />
    </div>
  );
}

export default BenchmarkFeed;
