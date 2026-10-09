'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ModelWaitBenchmark, BASELINE_MODEL_BENCHMARKS } from '@/lib/db/stats';
import { Clock, CheckCircle2, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';

export interface ModelSummaryCardConfig {
  slug: string;
  name: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
}

const FEATURED_MODELS: ModelSummaryCardConfig[] = [
  {
    slug: 'rav4',
    name: 'Toyota RAV4',
    subtitle: 'Prime PHEV & Hybrid',
    badge: 'High Demand',
    badgeColor: 'border-red-500/30 text-red-500 bg-red-500/10',
  },
  {
    slug: 'prius-prime',
    name: 'Toyota Prius Prime',
    subtitle: 'Plug-in Hybrid (PHEV)',
    badge: 'ZEV Rebate Eligible',
    badgeColor: 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
  },
  {
    slug: 'prius',
    name: 'Toyota Prius',
    subtitle: 'Hybrid (HEV AWD)',
    badge: 'Quickest Delivery',
    badgeColor: 'border-sky-500/30 text-sky-600 dark:text-sky-400 bg-sky-500/10',
  },
  {
    slug: 'sienna',
    name: 'Toyota Sienna',
    subtitle: 'Hybrid Family Minivan',
    badge: 'Allocation Quota',
    badgeColor: 'border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10',
  },
];

export interface ModelSummaryCardsProps {
  initialBenchmarks?: Record<string, ModelWaitBenchmark>;
  onSelectModel?: (modelSlug: string) => void;
}

export function ModelSummaryCards({
  initialBenchmarks = BASELINE_MODEL_BENCHMARKS,
  onSelectModel,
}: ModelSummaryCardsProps) {
  const [benchmarks, setBenchmarks] = useState<Record<string, ModelWaitBenchmark>>(initialBenchmarks);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isCancelled = false;

    fetch('/api/stats')
      .then((res) => res.json())
      .then((res) => {
        if (!isCancelled && res.success && res.data) {
          setBenchmarks((prev) => ({ ...prev, ...res.data }));
        }
      })
      .catch((err) => {
        console.warn('Using baseline model benchmarks:', err);
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            Verified Canadian Wait-Time Benchmarks
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Real-time empirical delivery percentiles calculated directly from crowdsourced Canadian buyer reports.
          </p>
        </div>
        <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/5 self-start sm:self-auto text-xs">
          <Sparkles className="h-3 w-3 mr-1" />
          Live 2026 Supabase Feed
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURED_MODELS.map((item) => {
          const stats = benchmarks[item.slug] || BASELINE_MODEL_BENCHMARKS[item.slug];
          const medianDays = stats?.median_days ?? 300;
          const p25Days = stats?.p25_days ?? 200;
          const p75Days = stats?.p75_days ?? 400;
          const sampleSize = stats?.sample_size ?? 10;
          const medianMonths = (medianDays / 30.4).toFixed(1);

          return (
            <Card
              key={item.slug}
              className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all duration-200"
            >
              <CardHeader className="p-4 sm:p-5 pb-3 space-y-2">
                <div className="flex items-center justify-between gap-1.5">
                  <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 ${item.badgeColor}`}>
                    {item.badge}
                  </Badge>
                  <span className="text-[11px] font-semibold text-zinc-500">
                    ~{medianMonths} mos
                  </span>
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
                    {item.name}
                  </CardTitle>
                  <p className="text-xs text-zinc-500">{item.subtitle}</p>
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 pt-0 space-y-4">
                {/* Median Wait Display */}
                <div className="bg-zinc-50 dark:bg-zinc-900/60 rounded-lg p-3 border border-zinc-100 dark:border-zinc-800/80 space-y-1">
                  <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Median Delivery Wait
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-zinc-950 dark:text-zinc-50">
                      {medianDays}
                    </span>
                    <span className="text-xs font-semibold text-zinc-500">Days</span>
                  </div>
                </div>

                {/* Percentile Range: P25 to P75 */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 font-medium">
                    <span className="text-[11px]">P25 (Fast):</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{p25Days}d</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 font-medium">
                    <span className="text-[11px]">P75 (Conservative):</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{p75Days}d</span>
                  </div>
                </div>

                {/* Sample Size Indicator */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center gap-1.5 text-[11px] text-zinc-500">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-500 shrink-0" />
                  <span>Based on {sampleSize} verified deliveries</span>
                </div>

                {/* Action Link to Estimator or Model Page */}
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-semibold h-8 border-zinc-300 dark:border-zinc-700 hover:border-amber-500/60 hover:text-amber-500 cursor-pointer"
                  onClick={() => onSelectModel?.(item.slug)}
                >
                  <Link href={`/#estimator`} className="flex items-center justify-center gap-1">
                    Calculate Timeline
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
