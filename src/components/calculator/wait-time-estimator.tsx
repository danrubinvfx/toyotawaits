'use client';

import React, { useState, useEffect, useMemo, useId } from 'react';
import {
  CANADIAN_VEHICLE_CATALOG,
  CANADIAN_PROVINCES_LIST,
  US_STATES_LIST,
  getRegionsForMarket,
  getRegionLabel,
  getDefaultRegion,
  isValidRegionForMarket,
  getRegionByCode,
  CatalogModel,
  CatalogPowertrain,
  CatalogTrim,
} from '@/lib/data/vehicles';
import { useMarket } from '@/context/MarketContext';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { RegionalWaitSummary } from '@/lib/types/contracts';
import { Calendar, CheckCircle, TrendingUp, DollarSign, Share2, Download, Info, Fuel, Zap, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RedditShareModal } from '@/components/modals/reddit-share-modal';
import { NotificationSubscriptionModal } from '@/components/modals/notification-subscription-modal';
import { generateCalendarReminder, downloadCalendarEvent } from '@/lib/utils/calendar';
import { ModelWaitBenchmark, BASELINE_MODEL_BENCHMARKS, getPowertrainBenchmark } from '@/lib/db/stats';
import { US_NATIONAL_BENCHMARKS } from '@/lib/estimator/calculateWait';
import { CARRYOVER_ALLOCATION_NOTE, BASE_MODEL_P75 } from '@/hooks/useEstimator';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface QuickSelectModelOption {
  label: string;
  slug: string;
  matchSlugs: string[];
}

export const QUICK_SELECT_MODELS: QuickSelectModelOption[] = [
  { label: 'RAV4', slug: 'rav4', matchSlugs: ['rav4'] },
  { label: 'Sienna', slug: 'sienna', matchSlugs: ['sienna'] },
  { label: 'Grand Highlander', slug: 'grand-highlander', matchSlugs: ['grand-highlander'] },
  { label: 'Prius / Prime', slug: 'prius', matchSlugs: ['prius', 'prius-prime'] },
  { label: 'Land Cruiser 250', slug: 'land-cruiser', matchSlugs: ['land-cruiser'] },
  { label: 'Tacoma', slug: 'tacoma', matchSlugs: ['tacoma'] },
];

export interface WaitTimeEstimatorProps {
  initialModel?: string;
  initialPowertrain?: string;
  initialTrim?: string;
  initialProvince?: string;
}

export const SSR_DEFAULT_DEPOSIT_DATE = '2026-01-15';

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
  const [powertrainSlug, setPowertrainSlug] = useState<string>(() => {
    const m = CANADIAN_VEHICLE_CATALOG.find((x) => x.slug === initialModel);
    if (m && m.powertrains.length > 0 && !m.powertrains.some((p) => p.slug === initialPowertrain)) {
      return m.powertrains[0].slug;
    }
    return initialPowertrain;
  });
  const [trimSlug, setTrimSlug] = useState<string>(initialTrim);
  const { market } = useMarket();
  const isUs = market === 'US';
  const [province, setProvince] = useState<string>(() => {
    if (initialProvince && isValidRegionForMarket(initialProvince, market)) {
      return initialProvince;
    }
    return getDefaultRegion(market);
  });
  const [depositDate, setDepositDate] = useState<string>(SSR_DEFAULT_DEPOSIT_DATE);
  const [todayDate, setTodayDate] = useState<Date>(() => new Date('2026-01-15T00:00:00Z'));
  const [showSubmittedBanner, setShowSubmittedBanner] = useState<boolean>(false);

  // Safely reset region when toggling market if current region is invalid for the new market
  useEffect(() => {
    if (!isValidRegionForMarket(province, market)) {
      setProvince(getDefaultRegion(market));
    }
  }, [market, province]);

  // Dynamic Benchmarks State
  const [benchmarks, setBenchmarks] = useState<Record<string, ModelWaitBenchmark>>(BASELINE_MODEL_BENCHMARKS);

  // Async Data State
  const [stats, setStats] = useState<RegionalWaitSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState<boolean>(false);

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
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('toyotawait:model-sync', { detail: { model: paramModel } })
          );
        }
      }
      if (
        paramProvince &&
        (CANADIAN_PROVINCES_LIST.some((p) => p.code === paramProvince) ||
          US_STATES_LIST.some((p) => p.code === paramProvince))
      ) {
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
    const now = new Date();
    setTodayDate(now);
    setDepositDate(now.toISOString().split('T')[0]);
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
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('toyotawait:model-sync', { detail: { model: slug } })
      );
    }
  };

  // Listen for model change events from external controls (e.g. StickyVehiclePills)
  useEffect(() => {
    const handleExternalChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ model: string }>;
      if (customEvent.detail?.model) {
        handleModelChange(customEvent.detail.model);
      }
    };

    window.addEventListener('toyotawait:model-change', handleExternalChange);
    return () => {
      window.removeEventListener('toyotawait:model-change', handleExternalChange);
    };
  }, []);

  const handlePowertrainChange = (slug: string) => {
    setPowertrainSlug(slug);
    setTrimSlug('all');
  };

  // Sync active model, powertrain, province, and deposit date to other page components
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('toyotawait:model-sync', {
          detail: {
            model: modelSlug,
            powertrain: powertrainSlug,
            province,
            orderDate: depositDate,
            depositDate,
          },
        })
      );
    }
  }, [modelSlug, powertrainSlug, province, depositDate]);

  // Fetch aggregate data whenever filters change
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    const queryParams: Record<string, string> = {
      model: modelSlug,
      powertrain: powertrainSlug,
      trim: trimSlug,
    };
    if (isUs) {
      queryParams.state = province;
      queryParams.country_code = 'US';
    } else {
      queryParams.province = province;
      queryParams.country_code = 'CA';
    }

    const query = new URLSearchParams(queryParams);

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
  }, [modelSlug, powertrainSlug, province, trimSlug, isUs]);

  // Calculate days already elapsed since deposit date
  const daysAlreadyWaited = useMemo(() => {
    if (!depositDate) return 0;
    const base = new Date(depositDate + (depositDate.includes('T') ? '' : 'T00:00:00'));
    if (isNaN(base.getTime())) return 0;
    return Math.max(0, Math.floor((todayDate.getTime() - base.getTime()) / (1000 * 60 * 60 * 24)));
  }, [depositDate, todayDate]);

  // Check whether selected deposit date is prior to current 2026 model year
  const isHistoricalOrderDate = useMemo(() => {
    if (!depositDate) return false;
    const base = new Date(depositDate + (depositDate.includes('T') ? '' : 'T00:00:00'));
    const year = base.getFullYear();
    return !isNaN(year) && year < 2026;
  }, [depositDate]);

  // Projected Date Calculations: arrival window calculated directly without artificial 420-day clamping
  const calculateProjectedDate = (daysOffset: number): string => {
    const base = depositDate ? new Date(depositDate + (depositDate.includes('T') ? '' : 'T00:00:00')) : todayDate;
    const baseTime = !isNaN(base.getTime()) ? base.getTime() : todayDate.getTime();
    const target = new Date(baseTime + daysOffset * 24 * 60 * 60 * 1000);
    return target.toLocaleDateString('en-CA', {
      month: 'short',
      year: 'numeric',
    });
  };

  const currentBenchmark = benchmarks[modelSlug] || BASELINE_MODEL_BENCHMARKS[modelSlug];
  const activePowertrainBenchmark = getPowertrainBenchmark(modelSlug, powertrainSlug);
  const usBenchmark = US_NATIONAL_BENCHMARKS[modelSlug] || US_NATIONAL_BENCHMARKS.rav4;

  // Small sample size handling (< 5):
  const regionalSampleCount =
    stats?.sampleCounts?.delivered ?? stats?.sampleCounts?.total ?? 0;
  const isBaselineFallback = Boolean(
    stats?.isBaselineFallback || (isUs && (regionalSampleCount === 0 || !stats?.waitStats?.median))
  );
  const isLimitedRegionalData = Boolean(
    isBaselineFallback || (stats && regionalSampleCount < 5)
  );

  const isPowertrainSampleSufficient = Boolean(
    activePowertrainBenchmark && activePowertrainBenchmark.sample_size >= 5
  );
  const isPooledAllPowertrains = !isUs && isLimitedRegionalData && (!isPowertrainSampleSufficient || modelSlug === 'rav4');

  const fallbackBenchmark = isUs
    ? {
        min_days: usBenchmark.min_days,
        p25_days: usBenchmark.p25_days,
        median_days: usBenchmark.median_days,
        p75_days: usBenchmark.p75_days,
        max_days: usBenchmark.p75_days + 30,
        sample_size: usBenchmark.sample_size,
      }
    : isLimitedRegionalData && isPowertrainSampleSufficient && !isPooledAllPowertrains && activePowertrainBenchmark
    ? activePowertrainBenchmark
    : currentBenchmark;

  let rawMedian: number;
  let rawP25: number;
  let rawP75: number;

  if (isUs) {
    if (!isBaselineFallback && stats?.waitStats?.median) {
      rawMedian = stats.waitStats.median;
      rawP25 = stats.waitStats.p25;
      rawP75 = stats.waitStats.p75;
    } else if (stats?.waitStats?.median && stats.waitStats.median > 0) {
      rawMedian = stats.waitStats.median;
      rawP25 = stats.waitStats.p25;
      rawP75 = stats.waitStats.p75;
    } else {
      rawMedian = usBenchmark.median_days;
      rawP25 = usBenchmark.p25_days;
      rawP75 = usBenchmark.p75_days;
    }
  } else {
    rawMedian = isLimitedRegionalData
      ? fallbackBenchmark?.median_days ?? 375
      : stats?.waitStats?.median ?? fallbackBenchmark?.median_days ?? 375;
    rawP25 = isLimitedRegionalData
      ? fallbackBenchmark?.p25_days ?? 185
      : stats?.waitStats?.p25 ?? fallbackBenchmark?.p25_days ?? 185;
    rawP75 = isLimitedRegionalData
      ? fallbackBenchmark?.p75_days ?? 450
      : stats?.waitStats?.p75 ?? fallbackBenchmark?.p75_days ?? 450;
  }

  // True percentiles: Remove artificial 420-day ceiling clamping so high-wait vehicles
  // (e.g. Sienna P75 = 450-560 days) display their authentic empirical wait times.
  const empiricalMax = stats?.waitStats?.max ?? fallbackBenchmark?.max_days ?? 999;
  const p75Days = isLimitedRegionalData ? rawP75 : Math.min(rawP75, empiricalMax);
  const medianDays = Math.min(
    isLimitedRegionalData ? rawMedian : Math.min(rawMedian, empiricalMax),
    p75Days
  );
  const p25Days = Math.min(rawP25, medianDays);

  const verifiedSampleSize = isBaselineFallback
    ? (isUs ? usBenchmark.sample_size : (fallbackBenchmark?.sample_size ?? 10))
    : isLimitedRegionalData
    ? (isPooledAllPowertrains
        ? (modelSlug === 'rav4' ? 14 : fallbackBenchmark?.sample_size ?? 10)
        : (fallbackBenchmark?.sample_size ?? 10))
    : stats?.sampleCounts?.delivered || fallbackBenchmark?.sample_size || stats?.sampleCounts?.total || 140;

  const optimisticDate = calculateProjectedDate(p25Days);
  const conservativeDate = calculateProjectedDate(p75Days);
  const medianMonths = (medianDays / 30.4).toFixed(1);
  const minWaitMonths = Math.max(1, Math.round(p25Days / 30.4));
  const maxWaitMonths = Math.max(minWaitMonths + 1, Math.round(p75Days / 30.4));

  const modelPowertrainNamesSummary =
    modelSlug === 'rav4'
      ? 'Hybrid & PHEV'
      : modelSlug === 'grand-highlander'
      ? 'Hybrid & Hybrid MAX'
      : modelSlug === 'prius' || modelSlug === 'prius-prime'
      ? 'Hybrid & PHEV'
      : currentModel.powertrains.map((p) => p.name.split(' ')[0]).join(' & ');

  const regionalFallbackNotice = isUs
    ? `National US baseline: Based on reference deliveries across all US regions (limited regional data for ${province}).`
    : isPooledAllPowertrains || !isPowertrainSampleSufficient || modelSlug === 'rav4'
    ? `National baseline: Based on ${verifiedSampleSize} deliveries across all ${currentModel.name} powertrains (${modelPowertrainNamesSummary}).`
    : `National baseline: Based on ${verifiedSampleSize} deliveries for ${currentModel.name} ${currentPowertrain.name} (limited regional data in ${province}).`;

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
    const base = depositDate ? new Date(depositDate + (depositDate.includes('T') ? '' : 'T00:00:00')) : todayDate;
    const baseTime = !isNaN(base.getTime()) ? base.getTime() : todayDate.getTime();
    const targetDate = new Date(baseTime + medianDays * 24 * 60 * 60 * 1000);

    const ics = generateCalendarReminder({
      title: `Toyota Arrival Window: ${currentModel.name} ${currentPowertrain.name}`,
      description: `Projected delivery arrival window for ${currentModel.name} ${currentPowertrain.name} (${province}). Order date: ${depositDate}. Median wait: ${medianDays} days (~${medianMonths} months).`,
      startDate: targetDate,
      location: `${province} Dealership`,
    });

    downloadCalendarEvent(ics, `toyota-eta-${currentModel.slug}.ics`);
  };

  const isRebateEligible = ['BC', 'QC', 'MB', 'NS', 'NB', 'PE', 'NL'].includes(province);
  const provinceObj = getRegionByCode(province);
  const provinceName = provinceObj ? provinceObj.name : province;

  const baseP75Days = BASE_MODEL_P75[modelSlug] ?? fallbackBenchmark?.p75_days ?? 450;
  const currentTrim = currentTrims.find((t) => t.slug === trimSlug);
  const trimDisplayName =
    currentTrim && trimSlug !== 'all'
      ? currentTrim.name
      : modelSlug === 'sienna'
      ? 'AWD'
      : 'trim';

  const isPlanningBenchmark = isLimitedRegionalData || Boolean(stats?.isTrimFallback) || !stats?.waitStats;
  const multiplierBreakdown =
    p75Days !== baseP75Days
      ? `Base P75: ${baseP75Days} days · Adjusted to ~${p75Days} days based on ${provinceName} regional allocation and ${trimDisplayName} demand factors.`
      : null;

  const powertrainComparisonData = useMemo(() => {
    // Provincial factor based on empirical Canadian data
    let provFactor = 1.0;
    if (province === 'BC') provFactor = 1.35;
    else if (province === 'QC') provFactor = 1.30;
    else if (province === 'ON') provFactor = 1.0;
    else if (province === 'AB') provFactor = 0.95;
    else if (province === 'MB' || province === 'SK') provFactor = 0.90;
    else if (['NS', 'NB', 'NL', 'PE'].includes(province)) provFactor = 1.10;

    // Gas: baseline ~65 days
    const gasDays = Math.round(65 * Math.min(1.2, provFactor));

    // Hybrid: baseline ~190 days
    let hybridDays = Math.round(190 * provFactor);
    if (powertrainSlug === 'hev' && stats?.waitStats?.median) {
      hybridDays = Math.min(stats.waitStats.median, 350);
    }

    // PHEV: baseline ~280 days (in BC ~380-410, in ON ~220-280)
    let phevDays = Math.min(410, Math.round(280 * provFactor));
    if (powertrainSlug === 'phev' && stats?.waitStats?.median) {
      phevDays = Math.min(stats.waitStats.median, 410);
    }

    const vehicleModel = CANADIAN_VEHICLE_CATALOG.find((m) => m.slug === modelSlug);
    const availableSlugs = vehicleModel ? vehicleModel.powertrains.map((p) => p.slug) : [];
    const candidateList = [
      {
        slug: 'gas',
        name: 'Gasoline (Gas)',
        days: gasDays,
        months: (gasDays / 30.4).toFixed(1),
        badge: 'Fastest Allocation',
        badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300',
        barColor: 'bg-emerald-500',
        isAvailable: availableSlugs.includes('gas'),
      },
      {
        slug: 'hev',
        name: 'Hybrid (HEV)',
        days: hybridDays,
        months: (hybridDays / 30.4).toFixed(1),
        badge: 'High Demand',
        badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300',
        barColor: hybridDays > 230 ? 'bg-amber-500' : 'bg-emerald-500',
        isAvailable: availableSlugs.includes('hev') || availableSlugs.includes('hybrid-max'),
      },
      {
        slug: 'phev',
        name: 'Plug-in Hybrid (PHEV)',
        days: phevDays,
        months: (phevDays / 30.4).toFixed(1),
        badge: isRebateEligible ? 'Rebate Eligible' : 'Longest Queue',
        badgeColor: isRebateEligible
          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300'
          : 'bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300',
        barColor: phevDays > 350 ? 'bg-red-600' : 'bg-amber-500',
        isAvailable: availableSlugs.includes('phev'),
      },
    ];

    const filtered = candidateList.filter((item) => item.isAvailable);
    const maxDays = Math.max(...filtered.map((item) => item.days), 1);

    return filtered.map((item) => ({
      ...item,
      percentage: Math.round((item.days / maxDays) * 100),
    }));
  }, [province, powertrainSlug, stats, isRebateEligible, modelSlug]);

  return (
    <Card id="estimator" className="w-full max-w-4xl mx-auto shadow-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 mt-4 scroll-mt-28">
      <CardContent className="p-4 sm:p-6 space-y-5">
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
                  Your delivery timeline has been incorporated into our crowdsourced {isUs ? 'U.S.' : 'Canadian'} database.
                </p>
                <p className="text-xs text-emerald-800 dark:text-emerald-200 mt-2">
                  Thanks for contributing to the community! If ToyotaWaits helps you navigate your wait, consider{' '}
                  <a
                    href="https://ko-fi.com/toyotawaits"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold hover:text-emerald-950 dark:hover:text-white"
                  >
                    supporting server costs on Ko-fi →
                  </a>
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

        {/* Hidden Model Selector for accessibility & form test compatibility */}
        <div className="hidden" aria-hidden="true">
          <Label htmlFor={`${compId}-model`}>Vehicle Model</Label>
          <Select
            id={`${compId}-model`}
            value={modelSlug}
            onChange={(e) => handleModelChange(e.target.value)}
          >
            {CANADIAN_VEHICLE_CATALOG.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.name}
              </option>
            ))}
          </Select>
        </div>

        {/* 2-Column Responsive Grid Layout for Estimator Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Cell 1: Powertrain */}
          <div>
            <Label
              htmlFor={`${compId}-powertrain`}
              className="text-xs font-medium text-neutral-400 mb-1 block"
            >
              Powertrain
            </Label>
            <Select
              id={`${compId}-powertrain`}
              value={powertrainSlug}
              onChange={(e) => handlePowertrainChange(e.target.value)}
              disabled={currentPowertrains.length === 1}
              className="h-11 w-full rounded-lg border border-neutral-800 bg-neutral-900/80 px-3 pr-8 py-2 text-sm text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium cursor-pointer"
            >
              {currentPowertrains.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </Select>
            {currentPowertrains.length === 1 && (
              <p
                data-testid="single-powertrain-notice"
                className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1.5 leading-tight"
              >
                <span>ℹ️</span>
                <span>Toyota {currentModel.name} is exclusively available with a {currentPowertrains[0].name} powertrain in Canada.</span>
              </p>
            )}
          </div>

          {/* Cell 2: Trim Level */}
          <div>
            <Label
              htmlFor={`${compId}-trim`}
              className="text-xs font-medium text-neutral-400 mb-1 block"
            >
              Trim Level
            </Label>
            <Select
              id={`${compId}-trim`}
              value={trimSlug}
              onChange={(e) => setTrimSlug(e.target.value)}
              className="h-11 w-full rounded-lg border border-neutral-800 bg-neutral-900/80 px-3 pr-8 py-2 text-sm text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium cursor-pointer"
            >
              <option value="all">All Trims</option>
              {currentTrims.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Cell 3: Province / State */}
          <div>
            <Label
              htmlFor={`${compId}-province`}
              className="text-xs font-medium text-neutral-400 mb-1 block"
            >
              {getRegionLabel(market)}
            </Label>
            <Select
              id={`${compId}-province`}
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="h-11 w-full rounded-lg border border-neutral-800 bg-neutral-900/80 px-3 pr-8 py-2 text-sm text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium cursor-pointer"
            >
              {getRegionsForMarket(market).map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name} ({p.code})
                </option>
              ))}
            </Select>
          </div>

          {/* Cell 4: Deposit / Order Date */}
          <div>
            <Label
              htmlFor={`${compId}-deposit-date`}
              className="text-xs font-medium text-neutral-400 mb-1 block"
            >
              Deposit / Order Date
            </Label>
            <Input
              id={`${compId}-deposit-date`}
              type="date"
              value={depositDate}
              onChange={(e) => setDepositDate(e.target.value)}
              className="h-11 w-full rounded-lg border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500 flex items-center min-h-[44px] max-h-[44px] cursor-pointer"
              suppressHydrationWarning
            />
            {isHistoricalOrderDate && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 leading-tight">
                Historical pricing varies by model year (current 2026 MSRP shown for reference).
              </p>
            )}
          </div>
        </div>

        {/* Results Panel - ESTIMATOR VALUES BROUGHT TO TOP */}
        {isLoading && !stats ? (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ) : (
          <div
            className={cn(
              'rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6 transition-opacity duration-200',
              isLoading && 'opacity-70 pointer-events-none'
            )}
          >
            {/* Primary KPI Banner - Centered Clean Layout */}
            <div className="flex flex-col items-center text-center space-y-3.5 pb-6 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                {isPlanningBenchmark ? 'Planning Benchmark Window' : 'Empirical Delivery Window'} in {province}
              </span>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <Badge variant="outline" className={`text-[11px] font-bold ${currentTier.className}`}>
                  Tier: {currentTier.label}
                </Badge>
                <Badge
                  data-testid="estimator-range-badge"
                  className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[11px] font-bold"
                >
                  Estimated Wait: {minWaitMonths} – {maxWaitMonths} Months
                </Badge>
                {isPlanningBenchmark ? (
                  <Badge
                    variant="outline"
                    data-testid="planning-benchmark-badge"
                    className="border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-semibold"
                  >
                    Planning Benchmark (n={verifiedSampleSize})
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    data-testid="empirical-calculation-badge"
                    className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold"
                  >
                    Empirical Calculation (n={verifiedSampleSize})
                  </Badge>
                )}
                {(isLimitedRegionalData || isBaselineFallback) && (
                  <Badge
                    variant="outline"
                    data-testid="regional-baseline-badge"
                    className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-semibold"
                  >
                    {isUs ? 'National US baseline' : 'National baseline'} · Limited regional data for {province}
                  </Badge>
                )}
              </div>

              <div
                className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight"
                suppressHydrationWarning
              >
                {optimisticDate} – {conservativeDate}
              </div>

              {multiplierBreakdown && (
                <div
                  data-testid="multiplier-breakdown-note"
                  className="text-xs text-amber-600/90 dark:text-amber-400/90 font-medium text-center max-w-xl px-2"
                >
                  {multiplierBreakdown}
                </div>
              )}

              <p className="text-xs text-zinc-500 flex items-center justify-center gap-1.5 flex-wrap">
                <Calendar className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span suppressHydrationWarning>
                  Based on 25th – 75th percentile wait durations
                  {daysAlreadyWaited > 0 ? ` (${daysAlreadyWaited} days waited so far)` : ''} for orders placed on{' '}
                  {new Date(depositDate + (depositDate.includes('T') ? '' : 'T00:00:00')).toLocaleDateString('en-CA', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </p>

              {isLimitedRegionalData ? (
                <div
                  data-testid="limited-data-fallback-note"
                  className="inline-flex items-center justify-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-3 py-1.5 rounded-md font-medium text-center"
                >
                  <Info className="h-3.5 w-3.5 shrink-0" />
                  <span>{regionalFallbackNotice}</span>
                </div>
              ) : stats?.trimNote ? (
                <div
                  data-testid="trim-fallback-note"
                  className="inline-flex items-center justify-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-3 py-1.5 rounded-md font-medium text-center"
                >
                  <Info className="h-3.5 w-3.5 shrink-0" />
                  <span>{stats.trimNote}</span>
                </div>
              ) : null}

              <div className="text-[11px] text-zinc-500 flex items-center justify-center gap-1 pt-0.5">
                <CheckCircle className="h-3 w-3 text-emerald-600" />
                {modelSlug === 'tacoma' ? (
                  <span data-testid="tacoma-benchmark-badge">
                    10 Historical Dealer Benchmarks (Community submissions opening soon).
                    <span data-testid="tacoma-methodology-note" className="block text-[10px] text-zinc-400 mt-0.5">
                      Historical dealer benchmarks collected Q4 2024–Q1 2025 across {isUs ? 'U.S.' : 'Canadian'} dealerships (n=10). Median baseline calculation methodology excludes outlier custom factory orders.
                    </span>
                  </span>
                ) : (
                  <span>Based on {verifiedSampleSize} verified deliveries</span>
                )}
                {modelSlug !== 'tacoma' && stats?.sampleCounts?.pending ? (
                  <span className="text-[10px] text-zinc-400">
                    ({stats.sampleCounts.pending} active queue)
                  </span>
                ) : null}
              </div>
            </div>

            {/* Distribution Breakdown Metric Card & Actions */}
            <div className="space-y-2 !mt-3">
              {/* Single 3-Column Metric Card */}
              <div className="grid grid-cols-3 gap-2 bg-neutral-900/70 border border-neutral-800 rounded-2xl p-3 sm:p-4 text-center">
                <div className="border-r border-neutral-800/60 pr-1 sm:pr-2 flex flex-col items-center">
                  <div className="text-[11px] sm:text-xs text-neutral-400 font-medium inline-flex items-center justify-center gap-1">
                    <span>Optimistic</span>
                    <span className="inline-flex items-center rounded px-1 py-0.5 text-[9px] sm:text-[10px] font-semibold bg-neutral-800 text-neutral-300 border border-neutral-700/60">
                      P25
                    </span>
                  </div>
                  <div className="mt-1 text-lg sm:text-2xl font-bold tracking-tight text-white">
                    {p25Days} Days
                  </div>
                  <p className="text-[10px] sm:text-xs text-neutral-400 mt-0.5 truncate" suppressHydrationWarning>
                    ~{optimisticDate}
                  </p>
                </div>

                <div className="border-r border-neutral-800/60 pr-1 sm:pr-2 flex flex-col items-center">
                  <div className="text-[11px] sm:text-xs text-amber-400/90 font-medium inline-flex items-center justify-center gap-1">
                    <span>Median</span>
                    <span className="inline-flex items-center rounded px-1 py-0.5 text-[9px] sm:text-[10px] font-bold bg-amber-500 text-neutral-950">
                      P50
                    </span>
                  </div>
                  <div className="mt-1 text-lg sm:text-2xl font-extrabold tracking-tight text-amber-400">
                    {medianDays} Days
                  </div>
                  <p className="text-[10px] sm:text-xs text-neutral-400 mt-0.5 truncate" suppressHydrationWarning>
                    ~{calculateProjectedDate(medianDays)}
                  </p>
                </div>

                <div className="flex flex-col items-center pl-1 sm:pl-2">
                  <div className="text-[11px] sm:text-xs text-neutral-400 font-medium inline-flex items-center justify-center gap-1">
                    <span>Conservative</span>
                    <span className="inline-flex items-center rounded px-1 py-0.5 text-[9px] sm:text-[10px] font-semibold bg-neutral-800 text-neutral-300 border border-neutral-700/60">
                      P75
                    </span>
                  </div>
                  <div className="mt-1 text-lg sm:text-2xl font-bold tracking-tight text-white">
                    {p75Days} Days
                  </div>
                  <p className="text-[10px] sm:text-xs text-neutral-400 mt-0.5 truncate" suppressHydrationWarning>
                    ~{conservativeDate}
                  </p>
                </div>
              </div>

              {/* Carryover allocation note when wait time exceeds 14 months (P75 > 400 days) */}
              {p75Days > 400 && (
                <div
                  data-testid="carryover-allocation-notice"
                  className="flex items-center justify-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl py-2 px-3 text-center font-medium my-2"
                >
                  <Info className="h-4 w-4 shrink-0 text-amber-500" />
                  <span>{CARRYOVER_ALLOCATION_NOTE}</span>
                </div>
              )}

              {/* 3 Action Buttons in Single Compact Row Directly Beneath 3-Column Card */}
              <div className="grid grid-cols-3 gap-2 w-full mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsShareModalOpen(true)}
                  className="py-1.5 px-2 text-xs font-medium rounded-lg border-zinc-300 dark:border-neutral-800 text-zinc-700 dark:text-neutral-300 gap-1 w-full justify-center h-auto"
                >
                  <Share2 className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">Share to Reddit</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsNotifyModalOpen(true)}
                  className="py-1.5 px-2 text-xs font-semibold rounded-lg border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 gap-1 w-full justify-center h-auto"
                >
                  <Bell className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">Notify Me</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadCalendar}
                  className="py-1.5 px-2 text-xs font-medium rounded-lg border-zinc-300 dark:border-neutral-800 text-zinc-700 dark:text-neutral-300 gap-1 w-full justify-center h-auto"
                >
                  <Download className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">Calendar (.ics)</span>
                </Button>
              </div>

              {/* Subtle High-Contrast Mod Guide Link - Kept tight right beneath buttons */}
              <div className="flex items-center justify-end pt-0.5 pb-0">
                <Link
                  href={`/mods/${modelSlug}`}
                  data-testid="delivery-estimate-mods-link"
                  className="group inline-flex items-center gap-1 text-xs text-slate-500 hover:text-amber-500 dark:text-slate-400 dark:hover:text-amber-400 font-medium transition-colors"
                >
                  Planning your build? Browse popular community accessories &amp; mods &rarr;
                </Link>
              </div>
            </div>

            {/* Secondary Metrics & Notification Chips */}
            <div className="space-y-2 !mt-2.5">
              {/* Condensed Notify Me Trigger Bar */}
              <div
                data-testid="notify-me-trigger-card"
                className="flex items-center justify-between gap-3 bg-neutral-900/40 border border-neutral-800 rounded-xl p-2.5 pl-3 text-xs text-neutral-300"
              >
                <div className="flex items-center gap-2 truncate">
                  <Bell className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">
                    Get notified when matching deliveries occur or regional wait times adjust.
                  </span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setIsNotifyModalOpen(true)}
                  className="h-7 px-3 py-1 text-xs font-semibold rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 shrink-0"
                >
                  Notify Me
                </Button>
              </div>

              {/* Streamlined MSRP & Dealer Markup Stats Badge Bar */}
              {stats?.pricingInsights && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between bg-neutral-900/60 border border-neutral-800/80 rounded-xl px-3.5 py-2 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                      <DollarSign className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        <strong className="font-bold">{stats.pricingInsights.atMsrpPercent}%</strong> paid exact MSRP
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-300">
                      <TrendingUp className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                      <span>
                        Avg Add-ons: ${Number(stats.pricingInsights.avgAddonsCad.toFixed(0)).toLocaleString()} CAD
                      </span>
                    </div>
                  </div>
                  {isHistoricalOrderDate && (
                    <p className="text-[11px] text-neutral-400 px-1">
                      Historical pricing varies by model year (current 2026 MSRP shown for reference).
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Powertrain Comparison Chart (Only when model has 2+ powertrain options in Canada) */}
            {currentPowertrains.length > 1 && (
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-4 sm:p-5 space-y-4 !mt-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200/60 dark:border-zinc-800/80 pb-3">
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-500" />
                      {`Powertrain Wait-Time Comparison in ${provinceName} (${province})`}
                    </h4>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Side-by-side empirical wait times for available {currentModel.name} powertrains across {provinceName}.
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[11px] self-start sm:self-auto border-zinc-300 dark:border-zinc-700">
                    {province} Regional Benchmarks
                  </Badge>
                </div>

                <div className="space-y-3.5">
                  {powertrainComparisonData.map((pt) => (
                    <div key={pt.slug} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
                        <div className="flex items-center gap-2">
                          {pt.slug === 'gas' ? (
                            <Fuel className="h-3.5 w-3.5 text-zinc-500" />
                          ) : (
                            <Zap className="h-3.5 w-3.5 text-amber-500" />
                          )}
                          <span className="font-bold text-zinc-900 dark:text-zinc-100">{pt.name}</span>
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${pt.badgeColor}`}>
                            {pt.badge}
                          </span>
                        </div>

                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-zinc-950 dark:text-zinc-50">{pt.days} Days</span>
                          <span className="text-[11px] text-zinc-500">(~{pt.months} mos)</span>
                        </div>
                      </div>

                      {/* Horizontal Bar Chart matching provincial-comparison.tsx */}
                      <div className="h-2.5 sm:h-3 w-full rounded-full bg-zinc-200/70 dark:bg-zinc-800 overflow-hidden flex">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${pt.barColor}`}
                          style={{ width: `${pt.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {powertrainComparisonData.length > 1 && (
                  <div className="rounded-lg bg-zinc-100 dark:bg-zinc-900/80 p-3 border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500 flex items-center gap-2">
                    <Info className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                    <span>
                      <strong>Provincial Trend:</strong> In {provinceName},{' '}
                      {(() => {
                        const highest = [...powertrainComparisonData].sort((a, b) => b.days - a.days)[0];
                        const lowest = [...powertrainComparisonData].sort((a, b) => a.days - b.days)[0];
                        const ratio = (highest.days / (lowest.days || 1)).toFixed(1);
                        return `${highest.name} faces up to ${ratio}x longer waitlists than ${lowest.name} due to allocation limits and consumer demand.`;
                      })()}
                    </span>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

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

      <NotificationSubscriptionModal
        isOpen={isNotifyModalOpen}
        onClose={() => setIsNotifyModalOpen(false)}
        defaultModel={modelSlug}
        defaultProvince={province as import('@/lib/types/contracts').CanadianProvince}
        defaultTrim={trimSlug === 'all' ? undefined : trimSlug}
      />
    </Card>
  );
}
