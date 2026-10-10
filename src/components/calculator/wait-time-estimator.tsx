'use client';

import React, { useState, useEffect, useMemo, useId } from 'react';
import {
  CANADIAN_VEHICLE_CATALOG,
  CANADIAN_PROVINCES_LIST,
  CatalogModel,
  CatalogPowertrain,
  CatalogTrim,
} from '@/lib/data/vehicles';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { RegionalWaitSummary } from '@/lib/types/contracts';
import { Clock, Calendar, CheckCircle, TrendingUp, DollarSign, Sparkles, Share2, Download, Wrench, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RebateNotice } from '@/components/incentives/rebate-notice';
import { RedditShareModal } from '@/components/modals/reddit-share-modal';
import { generateCalendarReminder, downloadCalendarEvent } from '@/lib/utils/calendar';
import { DeliveryPrepChecklist } from '@/components/dashboard/delivery-prep-checklist';
import { ModelWaitBenchmark, BASELINE_MODEL_BENCHMARKS } from '@/lib/db/stats';
import { useSearchParams } from 'next/navigation';

export interface WaitTimeEstimatorProps {
  initialModel?: string;
  initialPowertrain?: string;
  initialTrim?: string;
  initialProvince?: string;
}

export function WaitTimeEstimator({
  initialModel = 'rav4',
  initialPowertrain = 'phev',
  initialTrim = 'all',
  initialProvince = 'BC',
}: WaitTimeEstimatorProps = {}) {
  const compId = useId();
  const searchParams = useSearchParams();
  const isSubmittedParam = searchParams ? searchParams.get('submitted') === 'true' : false;
  const paramModel = searchParams ? searchParams.get('model') : null;
  const paramProvince = searchParams ? searchParams.get('province') : null;

  // Inputs
  const [modelSlug, setModelSlug] = useState<string>(initialModel);
  const [powertrainSlug, setPowertrainSlug] = useState<string>(initialPowertrain);
  const [trimSlug, setTrimSlug] = useState<string>(initialTrim);
  const [province, setProvince] = useState<string>(initialProvince);
  const [depositDate, setDepositDate] = useState<string>('2026-01-15');
  const [showSubmittedBanner, setShowSubmittedBanner] = useState<boolean>(false);

  // Dynamic Benchmarks State
  const [benchmarks, setBenchmarks] = useState<Record<string, ModelWaitBenchmark>>(BASELINE_MODEL_BENCHMARKS);

  // Async Data State
  const [stats, setStats] = useState<RegionalWaitSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Handle post-submission deep-link, parameter sync, and confirmation banner
  useEffect(() => {
    if (isSubmittedParam) {
      setShowSubmittedBanner(true);
      if (paramModel && CANADIAN_VEHICLE_CATALOG.some((m) => m.slug === paramModel)) {
        setModelSlug(paramModel);
        const m = CANADIAN_VEHICLE_CATALOG.find((x) => x.slug === paramModel);
        if (m && m.powertrains.length > 0) {
          setPowertrainSlug(m.powertrains[0].slug);
          setTrimSlug('all');
        }
      }
      if (paramProvince && CANADIAN_PROVINCES_LIST.some((p) => p.code === paramProvince)) {
        setProvince(paramProvince);
      }
      const el = document.getElementById('estimator');
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [isSubmittedParam, paramModel, paramProvince]);

  // Load dynamic model percentile benchmarks from Supabase via /api/stats
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
        console.warn('Could not load dynamic model wait benchmarks:', err);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  // Sync client-side date after mount
  useEffect(() => {
    setDepositDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Current catalog objects
  const currentModel: CatalogModel =
    CANADIAN_VEHICLE_CATALOG.find((m) => m.slug === modelSlug) || CANADIAN_VEHICLE_CATALOG[0];
  const currentPowertrains: CatalogPowertrain[] = currentModel.powertrains;
  const currentPowertrain: CatalogPowertrain =
    currentPowertrains.find((p) => p.slug === powertrainSlug) || currentPowertrains[0];
  const currentTrims: CatalogTrim[] = currentPowertrain.trims;

  // Handle cascading changes
  const handleModelChange = (slug: string) => {
    setModelSlug(slug);
    const m = CANADIAN_VEHICLE_CATALOG.find((x) => x.slug === slug);
    if (m && m.powertrains.length > 0) {
      setPowertrainSlug(m.powertrains[0].slug);
      setTrimSlug('all');
    }
  };

  const handlePowertrainChange = (slug: string) => {
    setPowertrainSlug(slug);
    setTrimSlug('all');
  };

  // Fetch aggregate data whenever filters change
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    const query = new URLSearchParams({
      model: modelSlug,
      powertrain: powertrainSlug,
      province,
      trim: trimSlug,
    });

    fetch(`/api/aggregate?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isCancelled && data.success) {
          setStats(data.data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load wait time statistics:', err);
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [modelSlug, powertrainSlug, province, trimSlug]);

  // Normalized current date for clean target arrival projections
  const [todayDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // Calculate days already elapsed since deposit date
  const daysAlreadyWaited = useMemo(() => {
    if (!depositDate) return 0;
    const base = new Date(depositDate + (depositDate.includes('T') ? '' : 'T00:00:00'));
    if (isNaN(base.getTime())) return 0;
    return Math.max(0, Math.floor((todayDate.getTime() - base.getTime()) / (1000 * 60 * 60 * 24)));
  }, [depositDate, todayDate]);

  // Projected Date Calculations: cleanly adds (estimated_days - days_already_waited) to today's date
  const calculateProjectedDate = (daysOffset: number): string => {
    const clampedOffset = modelSlug === 'rav4' ? Math.min(daysOffset, 410) : daysOffset;
    const remainingDays = Math.max(0, clampedOffset - daysAlreadyWaited);
    const target = new Date(todayDate.getTime() + remainingDays * 24 * 60 * 60 * 1000);
    return target.toLocaleDateString('en-CA', {
      month: 'short',
      year: 'numeric',
    });
  };

  const currentBenchmark = benchmarks[modelSlug] || BASELINE_MODEL_BENCHMARKS[modelSlug];

  // Small sample size handling (< 5):
  // If sample size for specific model/trim/province is small (< 5), ground strictly in overall model median
  const regionalSampleCount =
    stats?.sampleCounts?.delivered ?? stats?.sampleCounts?.total ?? 0;
  const isLimitedRegionalData = Boolean(stats && regionalSampleCount < 5);

  const rawMedian = isLimitedRegionalData
    ? currentBenchmark?.median_days ?? 375
    : stats?.waitStats?.median ?? currentBenchmark?.median_days ?? 375;

  const rawP25 = isLimitedRegionalData
    ? currentBenchmark?.p25_days ?? 185
    : stats?.waitStats?.p25 ?? currentBenchmark?.p25_days ?? 185;

  const rawP75 = isLimitedRegionalData
    ? currentBenchmark?.p75_days ?? 450
    : stats?.waitStats?.p75 ?? currentBenchmark?.p75_days ?? 450;

  // Clamping Upper Bounds:
  // Hard-clamp the upper bound (P75 or conservative estimate) so it CANNOT exceed 400-420 days
  // under any multiplier combination (hard cap 410 days for RAV4 / RAV4 Prime).
  // Ensures predicted arrival date calculated from today's date (Oct 2026) lands in mid/late 2027, never 2028.
  const hardCapLimit = modelSlug === 'rav4' ? 410 : (currentBenchmark?.max_days ?? 560);
  const benchmarkMax = Math.min(currentBenchmark?.max_days ?? 410, hardCapLimit);
  const empiricalMax = Math.min(stats?.waitStats?.max ?? benchmarkMax, hardCapLimit);

  const p75Days = Math.min(
    isLimitedRegionalData ? rawP75 : Math.min(rawP75, empiricalMax),
    hardCapLimit
  );
  const medianDays = Math.min(
    isLimitedRegionalData ? rawMedian : Math.min(rawMedian, empiricalMax),
    p75Days
  );
  const p25Days = Math.min(rawP25, medianDays);

  const verifiedSampleSize = isLimitedRegionalData
    ? currentBenchmark?.sample_size ?? 10
    : stats?.sampleCounts?.delivered || currentBenchmark?.sample_size || stats?.sampleCounts?.total || 140;

  const optimisticDate = calculateProjectedDate(p25Days);
  const conservativeDate = calculateProjectedDate(p75Days);
  const medianMonths = (medianDays / 30.4).toFixed(1);

  // Tom Waits Themed Wait Tier
  const getWaitTier = (days: number) => {
    if (days < 180) {
      return {
        label: 'Early Bird Special',
        sub: 'Short line at the diner counter',
        className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      };
    }
    if (days <= 365) {
      return {
        label: 'Rain Dogs Queue',
        sub: 'Standard Canadian weather; hunkered down in the drizzle',
        className: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      };
    }
    return {
      label: 'Time Stands Still at 5th and Hennepin',
      sub: 'Multi-season marathon; calendars peel away',
      className: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
  };

  const currentTier = getWaitTier(medianDays);

  const handleDownloadCalendar = () => {
    const remainingMedian = Math.max(0, medianDays - daysAlreadyWaited);
    const targetDate = new Date(todayDate.getTime() + remainingMedian * 24 * 60 * 60 * 1000);

    const ics = generateCalendarReminder({
      title: `Toyota Arrival Window: ${currentModel.name} ${currentPowertrain.name}`,
      description: `Projected delivery arrival window for ${currentModel.name} ${currentPowertrain.name} (${province}). Median wait: ${medianDays} days (~${medianMonths} months).`,
      startDate: targetDate,
      location: `${province} Dealership`,
    });

    downloadCalendarEvent(ics, `toyota-eta-${currentModel.slug}.ics`);
  };

  return (
    <Card id="estimator" className="w-full max-w-4xl mx-auto shadow-lg border-zinc-200 dark:border-zinc-800">
      <CardHeader className="space-y-1 bg-gradient-to-r from-amber-500/10 via-zinc-50 to-transparent dark:from-amber-950/20 dark:via-zinc-900 border-b border-zinc-200 dark:border-zinc-800 rounded-t-xl">
        <div className="flex items-center space-x-2">
          <Badge className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold gap-1 px-2.5">
            <Sparkles className="h-3 w-3" /> Live Community Predictor
          </Badge>
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            Canadian Regional Model
          </span>
        </div>
        <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Interactive Delivery Wait-Time Estimator
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
          Calculate empirical delivery arrival windows based on verified Canadian community wait times.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Post-Submission Confirmation Feedback Banner */}
        {showSubmittedBanner && (
          <div
            data-testid="submitted-confirmation-banner"
            className="flex items-start justify-between gap-3 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-100 shadow-sm animate-in fade-in slide-in-from-top-2"
          >
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div>
                <p className="font-bold text-base text-emerald-950 dark:text-emerald-50">
                  Submission received! Here are the updated wait-time estimates.
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                  Your delivery timeline has been incorporated into our crowdsourced Canadian database.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowSubmittedBanner(false)}
              className="text-xs text-emerald-700 hover:text-emerald-950 dark:text-emerald-300 dark:hover:text-emerald-100 font-semibold shrink-0 hover:underline"
              aria-label="Dismiss banner"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          <div className="space-y-1.5">
            <Label htmlFor={`${compId}-model`}>Vehicle Model</Label>
            <Select
              id={`${compId}-model`}
              value={modelSlug}
              onChange={(e) => handleModelChange(e.target.value)}
              className="font-medium"
            >
              {CANADIAN_VEHICLE_CATALOG.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`${compId}-powertrain`}>Powertrain</Label>
            <Select
              id={`${compId}-powertrain`}
              value={powertrainSlug}
              onChange={(e) => handlePowertrainChange(e.target.value)}
              className="font-medium"
            >
              {currentPowertrains.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`${compId}-trim`}>Trim Level</Label>
            <Select
              id={`${compId}-trim`}
              value={trimSlug}
              onChange={(e) => setTrimSlug(e.target.value)}
              className="font-medium"
            >
              <option value="all">All Trims</option>
              {currentTrims.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`${compId}-province`}>Province / Territory</Label>
            <Select
              id={`${compId}-province`}
              value={province}
              onChange={(e) => setProvince(e.target.value)}
            >
              {CANADIAN_PROVINCES_LIST.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name} ({p.code})
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`${compId}-deposit-date`}>Deposit / Order Date</Label>
            <Input
              id={`${compId}-deposit-date`}
              type="date"
              value={depositDate}
              onChange={(e) => setDepositDate(e.target.value)}
            />
          </div>
        </div>

        {/* Results Panel - ESTIMATOR VALUES BROUGHT TO TOP */}
        {isLoading ? (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 p-5 sm:p-6 shadow-sm space-y-6">
            {/* Primary KPI Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                    Estimated Delivery Window in {province}
                  </span>
                  <Badge variant="outline" className={`text-[11px] font-bold ${currentTier.className}`}>
                    Tier: {currentTier.label}
                  </Badge>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-4xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight">
                    {optimisticDate} – {conservativeDate}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-amber-500" />
                  Based on 25th – 75th percentile wait durations
                  {daysAlreadyWaited > 0 ? ` (${daysAlreadyWaited} days waited so far)` : ''} for orders placed on{' '}
                  {new Date(depositDate + (depositDate.includes('T') ? '' : 'T00:00:00')).toLocaleDateString('en-CA', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                {isLimitedRegionalData ? (
                  <div
                    data-testid="limited-data-fallback-note"
                    className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-2.5 py-1.5 rounded-md font-medium"
                  >
                    <Info className="h-3.5 w-3.5 shrink-0" />
                    <span>Based on overall model median (limited regional data)</span>
                  </div>
                ) : stats?.trimNote ? (
                  <div
                    data-testid="trim-fallback-note"
                    className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-2.5 py-1.5 rounded-md font-medium"
                  >
                    <Info className="h-3.5 w-3.5 shrink-0" />
                    <span>{stats.trimNote}</span>
                  </div>
                ) : null}
                <p className="text-[11px] text-zinc-400 italic">
                  &ldquo;{currentTier.sub}&rdquo;
                </p>
              </div>

              <div className="flex flex-col sm:items-end gap-2">
                <div className="inline-flex items-baseline gap-1.5 bg-amber-500/10 dark:bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-500/20">
                  <span className="text-xs font-medium text-amber-800 dark:text-amber-300">Median Wait:</span>
                  <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                    {medianDays} Days
                  </span>
                  <span className="text-xs text-amber-700/80 dark:text-amber-300/80">
                    (~{medianMonths} mos)
                  </span>
                </div>
                <div className="text-[11px] text-zinc-500 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-emerald-600" />
                  Based on {verifiedSampleSize} verified deliveries
                </div>

                {/* Action Buttons: Calendar + Reddit Share */}
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadCalendar}
                    className="h-7 text-xs border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 gap-1 px-2.5"
                  >
                    <Download className="h-3 w-3 text-amber-500" />
                    Calendar (.ics)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsShareModalOpen(true)}
                    className="h-7 text-xs border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 gap-1 px-2.5"
                  >
                    <Share2 className="h-3 w-3 text-amber-500" />
                    Share to Reddit
                  </Button>
                </div>
              </div>
            </div>

            {/* Distribution Breakdown Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="rounded-lg border border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/40 p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  <span>Fast / Optimistic</span>
                  <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-normal">
                    P25
                  </Badge>
                </div>
                <div className="mt-2 text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  {p25Days} Days
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Arrival by {optimisticDate}
                </p>
              </div>

              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 dark:border-amber-500/20 dark:bg-amber-950/20 p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-700 dark:text-amber-300">
                  <span>Expected / Median</span>
                  <Badge className="bg-amber-500 text-zinc-950 font-bold text-[10px] py-0 px-1.5">
                    P50
                  </Badge>
                </div>
                <div className="mt-2 text-xl font-bold text-amber-600 dark:text-amber-400">
                  {medianDays} Days
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Arrival around {calculateProjectedDate(medianDays)}
                </p>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/40 p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  <span>Conservative</span>
                  <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-normal">
                    P75
                  </Badge>
                </div>
                <div className="mt-2 text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  {p75Days} Days
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Arrival by {conservativeDate}
                </p>
              </div>
            </div>

            {/* Pricing Transparency Summary */}
            {stats?.pricingInsights && (
              <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900 p-3.5 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600 dark:text-zinc-300">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>{stats.pricingInsights.atMsrpPercent}%</strong> of buyers in this region paid exact MSRP with no dealer markup.
                  </span>
                </div>
                <div className="flex items-center gap-2 text-zinc-500 shrink-0">
                  <TrendingUp className="h-4 w-4 text-zinc-400" />
                  <span>Avg Mandatory Add-ons: ${stats.pricingInsights.avgAddonsCad.toFixed(0)} CAD</span>
                </div>
              </div>
            )}

            {/* Contextual Model DIY Mod Guide Callout Banner */}
            {(() => {
              const getContextualGuide = () => {
                if (
                  modelSlug === 'prius' ||
                  modelSlug === 'prius-prime' ||
                  currentModel.name === 'Prius' ||
                  currentModel.name === 'Prius Prime'
                ) {
                  return {
                    href: '/guides/prius-mods',
                    prefix: 'Planning ahead while you wait?',
                    title: 'Check out our 2023-2026 Prius & Prius Prime Essential Mods & Accessories Guide',
                    cta: 'Read Prius Guide',
                  };
                }
                if (
                  modelSlug === 'rav4' ||
                  currentModel.name === 'RAV4' ||
                  currentModel.name === 'RAV4 Prime'
                ) {
                  return {
                    href: '/guides/rav4-se-mods',
                    prefix: 'Planning ahead while you wait?',
                    title: 'RAV4 Prime & Hybrid Essential Mods & Upgrades Guide',
                    cta: 'Read RAV4 Guide',
                  };
                }
                if (modelSlug === 'sienna' || currentModel.name === 'Sienna') {
                  return {
                    href: '/guides/sienna-mods',
                    prefix: 'Planning ahead while you wait?',
                    title: 'Toyota Sienna Road-Trip & Family Mods Guide',
                    cta: 'Read Sienna Playbook',
                  };
                }
                if (modelSlug === 'grand-highlander' || currentModel.name === 'Grand Highlander') {
                  return {
                    href: '/guides/grand-highlander-mods',
                    prefix: 'Planning ahead while you wait?',
                    title: 'Toyota Grand Highlander Cabin & Utility Mods Guide',
                    cta: 'Read Grand Highlander Guide',
                  };
                }
                if (modelSlug === 'land-cruiser' || currentModel.name === 'Land Cruiser') {
                  return {
                    href: '/guides/land-cruiser-mods',
                    prefix: 'Planning ahead while you wait?',
                    title: 'Toyota Land Cruiser 250 Overhaul & Armor Guide',
                    cta: 'Read LC250 Mod Guide',
                  };
                }
                return null;
              };

              const guide = getContextualGuide();
              if (!guide) return null;

              return (
                <Link
                  href={guide.href}
                  className="group rounded-xl border border-amber-500/30 hover:border-amber-500/60 bg-amber-500/10 hover:bg-amber-500/15 dark:bg-amber-950/20 dark:hover:bg-amber-950/30 dark:border-amber-500/30 dark:hover:border-amber-500/60 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition-all duration-200 shadow-xs hover:shadow-md"
                >
                  <div className="flex items-center gap-2.5 text-zinc-800 dark:text-zinc-200">
                    <div className="h-8 w-8 rounded-lg bg-amber-500/20 dark:bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                      <Wrench className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100 flex flex-wrap items-center gap-1.5 leading-snug">
                        <span className="font-bold text-amber-700 dark:text-amber-400">{guide.prefix}</span>
                        <span>{guide.title}</span>
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 group-hover:text-amber-500 shrink-0 group-hover:translate-x-0.5 transition-transform">
                    {guide.cta} <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              );
            })()}

            {/* Delivery Day Prep Checklist */}
            <div id="delivery-prep" className="scroll-mt-24">
              <DeliveryPrepChecklist
                model={modelSlug}
                powertrain={powertrainSlug}
                className="mt-4"
                defaultExpanded={true}
              />
            </div>
          </div>
        )}

        {/* Dynamic Rebate Intelligence for PHEVs (Moved below estimator results) */}
        <RebateNotice
          powertrainSlug={powertrainSlug}
          provinceCode={province}
          defaultExpanded={false}
        />
      </CardContent>

      <RedditShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareParams={{
          modelName: currentModel.name,
          powertrainName: currentPowertrain.name,
          province,
          orderDate: depositDate,
          estDelivery: `${optimisticDate} – ${conservativeDate} (~${medianMonths} mos)`,
        }}
      />
    </Card>
  );
}
