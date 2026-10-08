'use client';

import React, { useState, useEffect, useId } from 'react';
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
import { Clock, Calendar, CheckCircle, TrendingUp, DollarSign, Sparkles, Share2, Download, Wrench, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RebateNotice } from '@/components/incentives/rebate-notice';
import { RedditShareModal } from '@/components/modals/reddit-share-modal';
import { generateCalendarReminder, downloadCalendarEvent } from '@/lib/utils/calendar';
import { DeliveryPrepChecklist } from '@/components/dashboard/delivery-prep-checklist';

export interface WaitTimeEstimatorProps {
  initialModel?: string;
  initialPowertrain?: string;
  initialTrim?: string;
  initialProvince?: string;
}

export function WaitTimeEstimator({
  initialModel = 'rav4',
  initialPowertrain = 'phev',
  initialTrim = 'xse-technology-awd',
  initialProvince = 'BC',
}: WaitTimeEstimatorProps = {}) {
  const compId = useId();

  // Inputs
  const [modelSlug, setModelSlug] = useState<string>(initialModel);
  const [powertrainSlug, setPowertrainSlug] = useState<string>(initialPowertrain);
  const [trimSlug, setTrimSlug] = useState<string>(initialTrim);
  const [province, setProvince] = useState<string>(initialProvince);
  const [depositDate, setDepositDate] = useState<string>('2025-01-15');

  // Async Data State
  const [stats, setStats] = useState<RegionalWaitSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

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
      if (m.powertrains[0].trims.length > 0) {
        setTrimSlug(m.powertrains[0].trims[0].slug);
      }
    }
  };

  const handlePowertrainChange = (slug: string) => {
    setPowertrainSlug(slug);
    const p = currentModel.powertrains.find((x) => x.slug === slug);
    if (p && p.trims.length > 0) {
      setTrimSlug(p.trims[0].slug);
    }
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

  // Projected Date Calculations
  const calculateProjectedDate = (daysOffset: number): string => {
    const base = new Date(depositDate);
    if (isNaN(base.getTime())) return 'TBD';
    const target = new Date(base.getTime() + daysOffset * 24 * 60 * 60 * 1000);
    return target.toLocaleDateString('en-CA', {
      month: 'short',
      year: 'numeric',
    });
  };

  const medianDays = stats?.waitStats?.median ?? 412;
  const p25Days = stats?.waitStats?.p25 ?? 310;
  const p75Days = stats?.waitStats?.p75 ?? 540;

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
    const baseDate = new Date(depositDate);
    const targetDate = new Date(baseDate.getTime() + medianDays * 24 * 60 * 60 * 1000);

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
        {/* Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  Based on 25th – 75th percentile wait durations for orders placed on{' '}
                  {new Date(depositDate).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
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
                  {stats?.sampleCounts?.total || 140}+ verified Canadian submissions
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

            {/* Contextual Model DIY Mod & Prep Teaser Callouts */}
            {modelSlug === 'rav4' && powertrainSlug === 'phev' && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-950/20 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 text-zinc-800 dark:text-zinc-200">
                  <Wrench className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>
                    <strong>Tired of waiting for an XSE?</strong> See how owners build an SE for less without the 12-month wait.
                  </span>
                </div>
                <Link
                  href="/guides/rav4-se-mods"
                  className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-500 shrink-0 underline sm:no-underline"
                >
                  Read SE Mod Guide <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}

            {modelSlug === 'sienna' && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-950/20 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 text-zinc-800 dark:text-zinc-200">
                  <Wrench className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>
                    <strong>Waiting 12+ months?</strong> Check out the top community mods and road-trip prep gear for your Sienna.
                  </span>
                </div>
                <Link
                  href="/guides/sienna-mods"
                  className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-500 shrink-0 underline sm:no-underline"
                >
                  Read Sienna Playbook <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}

            {modelSlug === 'grand-highlander' && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-950/20 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 text-zinc-800 dark:text-zinc-200">
                  <Wrench className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>
                    <strong>Big rig, long wait.</strong> See essential utility mods, cargo lighting, and console upgrades for the Grand Highlander.
                  </span>
                </div>
                <Link
                  href="/guides/grand-highlander-mods"
                  className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-500 shrink-0 underline sm:no-underline"
                >
                  Read Grand Highlander Guide <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}

            {modelSlug === 'land-cruiser' && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-950/20 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 text-zinc-800 dark:text-zinc-200">
                  <Wrench className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>
                    <strong>Got a 1958 trim coming?</strong> Explore drop-in speaker swaps, underside armor, and severe winter setups for the LC250.
                  </span>
                </div>
                <Link
                  href="/guides/land-cruiser-mods"
                  className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-500 shrink-0 underline sm:no-underline"
                >
                  Read LC250 Mod Guide <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}

            {/* Delivery Day Prep Checklist */}
            <DeliveryPrepChecklist
              model={modelSlug}
              powertrain={powertrainSlug}
              className="mt-4"
              defaultExpanded={true}
            />
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
