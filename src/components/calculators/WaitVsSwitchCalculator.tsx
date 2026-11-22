'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalculatorSkeleton } from '@/components/calculator/CalculatorSkeleton';
import { ShopByBudgetCalculator } from '@/components/calculator/ShopByBudgetCalculator';
import { TrustCalloutBanner } from '@/components/calculator/RelatedGuidesHub';
import { useMarket } from '@/context/MarketContext';
import {
  ArrowRight,
  Car,
  Clock,
  DollarSign,
  Fuel,
  GitCompare,
  ShieldAlert,
  Sparkles,
  Wrench,
} from 'lucide-react';

const VehicleSavingsCalculator = dynamic(
  () => import('@/components/calculator/VehicleSavingsCalculator'),
  {
    ssr: false,
    loading: () => <CalculatorSkeleton />,
  }
);

export type TargetWaitModelId =
  | 'rav4-hybrid'
  | 'sienna-hybrid'
  | 'grand-highlander-hybrid'
  | 'rav4-phev';

export interface TargetWaitModelOption {
  id: TargetWaitModelId;
  label: string;
  defaultWaitMonths: number;
  priceCad: number;
  priceUsd: number;
  rolloverBufferCad: number;
  rolloverBufferUsd: number;
  monthlyFuelCad: number;
  monthlyFuelUsd: number;
}

export const TARGET_WAIT_MODELS: Record<TargetWaitModelId, TargetWaitModelOption> = {
  'rav4-hybrid': {
    id: 'rav4-hybrid',
    label: '2026 RAV4 Hybrid AWD',
    defaultWaitMonths: 12,
    priceCad: 41950,
    priceUsd: 34850,
    rolloverBufferCad: 1500,
    rolloverBufferUsd: 1100,
    monthlyFuelCad: 125,
    monthlyFuelUsd: 95,
  },
  'sienna-hybrid': {
    id: 'sienna-hybrid',
    label: '2026 Sienna Hybrid AWD',
    defaultWaitMonths: 13,
    priceCad: 51500,
    priceUsd: 41200,
    rolloverBufferCad: 1200,
    rolloverBufferUsd: 900,
    monthlyFuelCad: 145,
    monthlyFuelUsd: 110,
  },
  'grand-highlander-hybrid': {
    id: 'grand-highlander-hybrid',
    label: '2026 Grand Highlander Hybrid',
    defaultWaitMonths: 10,
    priceCad: 56900,
    priceUsd: 45400,
    rolloverBufferCad: 900,
    rolloverBufferUsd: 700,
    monthlyFuelCad: 155,
    monthlyFuelUsd: 115,
  },
  'rav4-phev': {
    id: 'rav4-phev',
    label: '2026 RAV4 Plug-in Hybrid',
    defaultWaitMonths: 14,
    priceCad: 53150,
    priceUsd: 44815,
    rolloverBufferCad: 1800,
    rolloverBufferUsd: 1350,
    monthlyFuelCad: 65,
    monthlyFuelUsd: 50,
  },
};

export type SwitchAlternativeId =
  | 'camry-hybrid-awd'
  | 'crown-signia-hybrid'
  | 'cpo-rav4-hybrid';

export interface SwitchAlternativeOption {
  id: SwitchAlternativeId;
  label: string;
  badgeText: string;
  waitMonths: number;
  waitLabel: string;
  inventorySlug: string;
  priceCad: number;
  priceUsd: number;
  monthlyFuelCad: number;
  monthlyFuelUsd: number;
  monthlyMaintCad: number;
  monthlyMaintUsd: number;
}

export const SWITCH_ALTERNATIVES: Record<SwitchAlternativeId, SwitchAlternativeOption> = {
  'camry-hybrid-awd': {
    id: 'camry-hybrid-awd',
    label: 'Camry Hybrid AWD',
    badgeText: 'New • ~3–4 mos',
    waitMonths: 3.5,
    waitLabel: '~3–4 months',
    inventorySlug: 'camry',
    priceCad: 39255,
    priceUsd: 31500,
    monthlyFuelCad: 110,
    monthlyFuelUsd: 82,
    monthlyMaintCad: 0,
    monthlyMaintUsd: 0,
  },
  'crown-signia-hybrid': {
    id: 'crown-signia-hybrid',
    label: 'Crown Signia Hybrid',
    badgeText: 'New • ~2–3 mos',
    waitMonths: 2.5,
    waitLabel: '~2–3 months',
    inventorySlug: 'crown-signia',
    priceCad: 57450,
    priceUsd: 43590,
    monthlyFuelCad: 135,
    monthlyFuelUsd: 100,
    monthlyMaintCad: 0,
    monthlyMaintUsd: 0,
  },
  'cpo-rav4-hybrid': {
    id: 'cpo-rav4-hybrid',
    label: '2024 Certified Pre-Owned RAV4 Hybrid',
    badgeText: '2-Yr-Old CPO • Available Now',
    waitMonths: 0,
    waitLabel: 'Available Now (0 mos)',
    inventorySlug: 'rav4',
    priceCad: 39900,
    priceUsd: 31800,
    monthlyFuelCad: 128,
    monthlyFuelUsd: 96,
    monthlyMaintCad: 45,
    monthlyMaintUsd: 35,
  },
};

export interface WaitVsSwitchResult {
  horizonMonths: number;
  pathAWaitFuelBurn: number;
  pathAWaitMaintBurn: number;
  pathARolloverBuffer: number;
  pathAWaitTotalBleed: number;
  pathAPostDeliveryFuel: number;
  pathAVehiclePrice: number;
  pathATotal3Yr: number;
  pathBWaitBleed: number;
  pathBPostDeliveryOperating: number;
  pathBVehiclePrice: number;
  pathBTotal3Yr: number;
  /** Positive means Path B (Switch) is cheaper over 3 years; negative means Path A (Wait) is cheaper */
  net3YearSavingsSwitching: number;
}

export function calculateWaitVsSwitch(params: {
  waitMonths: number;
  currentMonthlyFuel: number;
  maintenanceReserve: number;
  rolloverBuffer: number;
  targetVehiclePrice: number;
  targetMonthlyFuel: number;
  altWaitMonths: number;
  altVehiclePrice: number;
  altMonthlyFuel: number;
  altMonthlyMaint: number;
}): WaitVsSwitchResult {
  const horizonMonths = 36;
  const clampedWait = Math.max(0, Math.min(horizonMonths, params.waitMonths));
  const clampedAltWait = Math.max(0, Math.min(horizonMonths, params.altWaitMonths));

  const pathAWaitFuelBurn = Math.round(clampedWait * params.currentMonthlyFuel);
  const pathAWaitMaintBurn = Math.round(clampedWait * params.maintenanceReserve);
  const pathARolloverBuffer = clampedWait >= 4 ? Math.round(params.rolloverBuffer) : 0;
  const pathAWaitTotalBleed = pathAWaitFuelBurn + pathAWaitMaintBurn + pathARolloverBuffer;

  const pathARemainingMonths = Math.max(0, horizonMonths - clampedWait);
  const pathAPostDeliveryFuel = Math.round(pathARemainingMonths * params.targetMonthlyFuel);
  const pathATotal3Yr =
    Math.round(params.targetVehiclePrice) + pathAWaitTotalBleed + pathAPostDeliveryFuel;

  const pathBWaitBleed = Math.round(
    clampedAltWait * (params.currentMonthlyFuel + params.maintenanceReserve)
  );
  const pathBRemainingMonths = Math.max(0, horizonMonths - clampedAltWait);
  const pathBPostDeliveryOperating = Math.round(
    pathBRemainingMonths * (params.altMonthlyFuel + params.altMonthlyMaint)
  );
  const pathBTotal3Yr =
    Math.round(params.altVehiclePrice) + pathBWaitBleed + pathBPostDeliveryOperating;

  const net3YearSavingsSwitching = pathATotal3Yr - pathBTotal3Yr;

  return {
    horizonMonths,
    pathAWaitFuelBurn,
    pathAWaitMaintBurn,
    pathARolloverBuffer,
    pathAWaitTotalBleed,
    pathAPostDeliveryFuel,
    pathAVehiclePrice: Math.round(params.targetVehiclePrice),
    pathATotal3Yr,
    pathBWaitBleed,
    pathBPostDeliveryOperating,
    pathBVehiclePrice: Math.round(params.altVehiclePrice),
    pathBTotal3Yr,
    net3YearSavingsSwitching,
  };
}

export interface WaitVsSwitchCalculatorProps {
  isUS?: boolean;
  initialMarket?: 'CA' | 'US';
}

export function WaitVsSwitchCalculator({ isUS, initialMarket }: WaitVsSwitchCalculatorProps) {
  const { isUs: contextIsUS } = useMarket();
  const initialIsUS = isUS ?? (initialMarket ? initialMarket === 'US' : contextIsUS);
  const [marketIsUS, setMarketIsUS] = useState<boolean>(initialIsUS);

  const [targetModelId, setTargetModelId] = useState<TargetWaitModelId>('rav4-hybrid');
  const [waitMonths, setWaitMonths] = useState<number>(12);
  const [currentMonthlyFuel, setCurrentMonthlyFuel] = useState<number>(initialIsUS ? 210 : 280);
  const [maintenanceReserve, setMaintenanceReserve] = useState<number>(120);
  const [rolloverBuffer, setRolloverBuffer] = useState<number>(
    initialIsUS
      ? TARGET_WAIT_MODELS['rav4-hybrid'].rolloverBufferUsd
      : TARGET_WAIT_MODELS['rav4-hybrid'].rolloverBufferCad
  );
  const [altId, setAltId] = useState<SwitchAlternativeId>('cpo-rav4-hybrid');

  const targetModel = TARGET_WAIT_MODELS[targetModelId];
  const altModel = SWITCH_ALTERNATIVES[altId];
  const currencyCode = marketIsUS ? 'USD' : 'CAD';

  const handleMarketToggle = (nextIsUS: boolean) => {
    setMarketIsUS(nextIsUS);
    setCurrentMonthlyFuel(nextIsUS ? 210 : 280);
    setRolloverBuffer(nextIsUS ? targetModel.rolloverBufferUsd : targetModel.rolloverBufferCad);
  };

  const handleTargetModelChange = (nextId: TargetWaitModelId) => {
    setTargetModelId(nextId);
    const nextModel = TARGET_WAIT_MODELS[nextId];
    setWaitMonths(nextModel.defaultWaitMonths);
    setRolloverBuffer(marketIsUS ? nextModel.rolloverBufferUsd : nextModel.rolloverBufferCad);
  };

  const result = useMemo(
    () =>
      calculateWaitVsSwitch({
        waitMonths,
        currentMonthlyFuel,
        maintenanceReserve,
        rolloverBuffer,
        targetVehiclePrice: marketIsUS ? targetModel.priceUsd : targetModel.priceCad,
        targetMonthlyFuel: marketIsUS ? targetModel.monthlyFuelUsd : targetModel.monthlyFuelCad,
        altWaitMonths: altModel.waitMonths,
        altVehiclePrice: marketIsUS ? altModel.priceUsd : altModel.priceCad,
        altMonthlyFuel: marketIsUS ? altModel.monthlyFuelUsd : altModel.monthlyFuelCad,
        altMonthlyMaint: marketIsUS ? altModel.monthlyMaintUsd : altModel.monthlyMaintCad,
      }),
    [waitMonths, currentMonthlyFuel, maintenanceReserve, rolloverBuffer, targetModel, altModel, marketIsUS]
  );

  const fmt = (amount: number) =>
    `${new Intl.NumberFormat(marketIsUS ? 'en-US' : 'en-CA', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(amount)} ${currencyCode}`;

  const absDiff = Math.abs(result.net3YearSavingsSwitching);
  const switchWins = result.net3YearSavingsSwitching >= 0;

  return (
    <Card
      data-testid="wait-vs-switch-calculator"
      className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden"
    >
      <CardHeader className="bg-zinc-50 dark:bg-zinc-900/70 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <Badge className="bg-red-600 text-white text-xs font-bold">
              <GitCompare className="w-3 h-3 mr-1" />
              Wait vs. Switch / New vs. CPO Decision Tool
            </Badge>
            <CardTitle className="text-lg sm:text-2xl font-extrabold text-zinc-950 dark:text-zinc-50">
              Should You Keep Waiting or Switch to an Available Alternative?
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              Compare 3-year total cash flow between waiting for a factory-ordered Toyota Hybrid vs. switching to a faster in-stock model or 2-year-old Certified Pre-Owned (CPO) unit.
            </CardDescription>
          </div>

          <div
            className="inline-flex rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-0.5 self-start shrink-0"
            role="group"
            aria-label="Wait vs Switch Currency Market"
          >
            <button
              type="button"
              onClick={() => handleMarketToggle(false)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                !marketIsUS
                  ? 'bg-red-600 text-white'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              CAD
            </button>
            <button
              type="button"
              onClick={() => handleMarketToggle(true)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                marketIsUS
                  ? 'bg-red-600 text-white'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              USD
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="wait-target-model" className="text-xs font-semibold flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-red-600" />
              Path A: Target Factory Order
            </Label>
            <select
              id="wait-target-model"
              value={targetModelId}
              onChange={(e) => handleTargetModelChange(e.target.value as TargetWaitModelId)}
              className="w-full h-9 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 text-sm text-zinc-900 dark:text-zinc-100"
            >
              {Object.values(TARGET_WAIT_MODELS).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label} (~{m.defaultWaitMonths} mos)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="wait-months-input" className="text-xs font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              Est. Wait Months
            </Label>
            <Input
              id="wait-months-input"
              type="number"
              min={1}
              max={24}
              value={waitMonths}
              onChange={(e) => setWaitMonths(Math.max(0, Math.min(24, Number(e.target.value) || 0)))}
              className="text-sm bg-zinc-50 dark:bg-zinc-900"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="current-fuel-input" className="text-xs font-semibold flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-zinc-500" />
              Current Car Fuel ({currencyCode}/mo)
            </Label>
            <Input
              id="current-fuel-input"
              type="number"
              min={0}
              max={1500}
              value={currentMonthlyFuel}
              onChange={(e) => setCurrentMonthlyFuel(Math.max(0, Number(e.target.value) || 0))}
              className="text-sm bg-zinc-50 dark:bg-zinc-900"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="maint-reserve-input" className="text-xs font-semibold flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-zinc-500" />
              Aging-Car Repair Reserve ({currencyCode}/mo)
            </Label>
            <Input
              id="maint-reserve-input"
              type="number"
              min={0}
              max={1000}
              value={maintenanceReserve}
              onChange={(e) => setMaintenanceReserve(Math.max(0, Number(e.target.value) || 0))}
              className="text-sm bg-zinc-50 dark:bg-zinc-900"
            />
          </div>
        </div>

        {/* Path B Alternative Selector + Rollover Buffer */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
          <div className="lg:col-span-3 space-y-2">
            <Label className="text-xs font-semibold">
              Path B: Switch to Faster In-Stock Alternative or 2-Yr-Old CPO
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {Object.values(SWITCH_ALTERNATIVES).map((alt) => {
                const selected = alt.id === altId;
                return (
                  <button
                    key={alt.id}
                    type="button"
                    onClick={() => setAltId(alt.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selected
                        ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/30 ring-1 ring-emerald-600'
                        : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {alt.label}
                    </div>
                    <div className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 mt-0.5">
                      {alt.badgeText}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rollover-buffer-input" className="text-xs font-semibold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
              MY27 Rollover Risk Buffer ({currencyCode})
            </Label>
            <Input
              id="rollover-buffer-input"
              type="number"
              min={0}
              max={10000}
              value={rolloverBuffer}
              onChange={(e) => setRolloverBuffer(Math.max(0, Number(e.target.value) || 0))}
              className="text-sm bg-zinc-50 dark:bg-zinc-900"
            />
          </div>
        </div>

        {/* Side-by-Side Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Path A */}
          <div
            data-testid="path-a-card"
            className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 space-y-4"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  Path A • Wait for Factory Order
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-zinc-950 dark:text-zinc-50">
                  {targetModel.label}
                </h3>
              </div>
              <Badge variant="outline" className="border-amber-500/40 text-amber-600 dark:text-amber-400 font-bold">
                ~{waitMonths} mos wait
              </Badge>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Est. Vehicle MSRP</span>
                <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                  {fmt(result.pathAVehiclePrice)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Wait-Period Fuel Burn ({waitMonths} mos)</span>
                <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                  +{fmt(result.pathAWaitFuelBurn)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Aging-Car Repair Reserve ({waitMonths} mos)</span>
                <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                  +{fmt(result.pathAWaitMaintBurn)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>MY27 Rollover Risk Buffer</span>
                <span className="font-mono font-semibold text-red-600 dark:text-red-400">
                  +{fmt(result.pathARolloverBuffer)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Post-Delivery Fuel ({36 - Math.min(36, waitMonths)} mos)</span>
                <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                  +{fmt(result.pathAPostDeliveryFuel)}
                </span>
              </div>
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-baseline">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  3-Year Total Cash-Flow
                </span>
                <span
                  data-testid="path-a-total"
                  className="text-lg font-black font-mono text-zinc-950 dark:text-zinc-50"
                >
                  {fmt(result.pathATotal3Yr)}
                </span>
              </div>
            </div>
          </div>

          {/* Path B */}
          <div
            data-testid="path-b-card"
            className="p-5 rounded-2xl border border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-4"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Path B • Switch Now / Faster Allocation
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-zinc-950 dark:text-zinc-50">
                  {altModel.label}
                </h3>
              </div>
              <Badge className="bg-emerald-600 text-white font-bold">
                {altModel.waitLabel}
              </Badge>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Est. Vehicle Price</span>
                <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                  {fmt(result.pathBVehiclePrice)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Interim Wait Burn ({altModel.waitMonths} mos)</span>
                <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                  +{fmt(result.pathBWaitBleed)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>MY27 Rollover Exposure</span>
                <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                  {fmt(0)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>36-Mo Operating &amp; Fuel ({(36 - altModel.waitMonths).toFixed(1).replace(/\.0$/, '')} mos)</span>
                <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                  +{fmt(result.pathBPostDeliveryOperating)}
                </span>
              </div>
              <div className="pt-2 border-t border-emerald-500/30 flex justify-between items-baseline">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  3-Year Total Cash-Flow
                </span>
                <span
                  data-testid="path-b-total"
                  className="text-lg font-black font-mono text-emerald-700 dark:text-emerald-400"
                >
                  {fmt(result.pathBTotal3Yr)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Net 3-Year Cash-Flow Verdict + CTA */}
        <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-white dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              Net 3-Year Cash-Flow Difference
            </div>
            <div className="text-lg sm:text-xl font-extrabold" data-testid="net-cash-flow-diff">
              {switchWins
                ? `Switching to ${altModel.label} saves ${fmt(absDiff)} over 3 years`
                : `Waiting for ${targetModel.label} is ${fmt(absDiff)} lower over 3 years`}
            </div>
            <p className="text-xs text-zinc-300">
              Waiting {waitMonths} months burns{' '}
              <strong className="text-white">{fmt(result.pathAWaitTotalBleed)}</strong> in old-car fuel, repairs, and rollover risk before you take delivery.
            </p>
          </div>

          <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-bold shrink-0">
            <Link
              href={`/inventory?model=${altModel.inventorySlug}`}
              data-testid="wait-vs-switch-inventory-cta"
              className="gap-1.5"
            >
              Browse Live In-Stock Alternatives ↗
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export type CalculatorHubMode = 'MODEL' | 'BUDGET' | 'WAIT_VS_SWITCH';

export function CalculatorHubWithSwitch({
  isUS,
  initialMarket,
}: {
  isUS?: boolean;
  initialMarket?: 'CA' | 'US';
}) {
  const [activeMode, setActiveMode] = useState<CalculatorHubMode>('MODEL');

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Top Segmented Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div
          className="inline-flex flex-wrap sm:flex-nowrap p-1 rounded-xl bg-zinc-200/80 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 w-full lg:w-auto"
          role="tablist"
          aria-label="Calculator Mode Switcher"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeMode === 'MODEL'}
            onClick={() => setActiveMode('MODEL')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
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
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeMode === 'BUDGET'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Shop by Monthly Budget</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeMode === 'WAIT_VS_SWITCH'}
            onClick={() => setActiveMode('WAIT_VS_SWITCH')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeMode === 'WAIT_VS_SWITCH'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <GitCompare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Wait vs. Switch</span>
          </button>
        </div>

        <span className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 italic">
          {activeMode === 'MODEL'
            ? 'Compare energy & payback across specific Toyota trims'
            : activeMode === 'BUDGET'
              ? 'Find eligible Toyota models matching your target monthly payment'
              : 'Compare waiting for a factory order vs. switching to an in-stock or CPO model'}
        </span>
      </div>

      {/* Active Mode Calculator Cockpit */}
      {activeMode === 'MODEL' ? (
        <VehicleSavingsCalculator />
      ) : activeMode === 'BUDGET' ? (
        <ShopByBudgetCalculator />
      ) : (
        <WaitVsSwitchCalculator isUS={isUS} initialMarket={initialMarket} />
      )}

      {/* Trust Callout Banner */}
      <TrustCalloutBanner />
    </div>
  );
}

export default WaitVsSwitchCalculator;
