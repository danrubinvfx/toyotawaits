'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { calculateMaxVehiclePrice, BudgetAffordabilityResult } from '@/lib/calculator-engine';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DollarSign,
  Calendar,
  Percent,
  Clock,
  Fuel,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Car,
  Filter,
} from 'lucide-react';

export interface BudgetToyotaModel {
  id: string;
  name: string;
  trim: string;
  powertrain: 'Hybrid' | 'Plug-in Hybrid' | 'Gas';
  msrpCad: number;
  combinedL100km: number;
  waitDays: number;
  waitDisplay: string;
  waitSlug: string;
}

export const CANADIAN_TOYOTA_BUDGET_MODELS: BudgetToyotaModel[] = [
  {
    id: 'corolla-gas',
    name: 'Toyota Corolla',
    trim: 'L CVT FWD',
    powertrain: 'Gas',
    msrpCad: 23490,
    combinedL100km: 6.8,
    waitDays: 90,
    waitDisplay: 'P50 Wait: ~90 days (2–4 mos)',
    waitSlug: 'corolla',
  },
  {
    id: 'corolla-hybrid',
    name: 'Toyota Corolla Hybrid',
    trim: 'LE FWD',
    powertrain: 'Hybrid',
    msrpCad: 26790,
    combinedL100km: 4.7,
    waitDays: 180,
    waitDisplay: 'P50 Wait: ~180 days (5–7 mos)',
    waitSlug: 'corolla',
  },
  {
    id: 'corolla-cross-gas',
    name: 'Toyota Corolla Cross',
    trim: 'L FWD',
    powertrain: 'Gas',
    msrpCad: 27250,
    combinedL100km: 7.4,
    waitDays: 120,
    waitDisplay: 'P50 Wait: ~120 days (3–5 mos)',
    waitSlug: 'corolla-cross',
  },
  {
    id: 'rav4-gas',
    name: 'Toyota RAV4',
    trim: 'LE AWD',
    powertrain: 'Gas',
    msrpCad: 33150,
    combinedL100km: 7.9,
    waitDays: 90,
    waitDisplay: 'P50 Wait: ~90 days (2–4 mos)',
    waitSlug: 'rav4',
  },
  {
    id: 'camry-hybrid',
    name: 'Toyota Camry Hybrid',
    trim: 'SE FWD',
    powertrain: 'Hybrid',
    msrpCad: 34300,
    combinedL100km: 4.6,
    waitDays: 120,
    waitDisplay: 'P50 Wait: ~120 days (3–5 mos)',
    waitSlug: 'camry',
  },
  {
    id: 'corolla-cross-hybrid',
    name: 'Toyota Corolla Cross Hybrid',
    trim: 'SE AWD',
    powertrain: 'Hybrid',
    msrpCad: 34590,
    combinedL100km: 5.6,
    waitDays: 270,
    waitDisplay: 'P50 Wait: ~270 days (8–10 mos)',
    waitSlug: 'corolla-cross',
  },
  {
    id: 'rav4-hybrid',
    name: 'Toyota RAV4 Hybrid',
    trim: 'LE AWD',
    powertrain: 'Hybrid',
    msrpCad: 37500,
    combinedL100km: 5.8,
    waitDays: 180,
    waitDisplay: 'P50 Wait: ~180 days (5–8 mos)',
    waitSlug: 'rav4',
  },
  {
    id: 'prius-hybrid',
    name: 'Toyota Prius Hybrid',
    trim: 'XLE AWD',
    powertrain: 'Hybrid',
    msrpCad: 37990,
    combinedL100km: 4.8,
    waitDays: 240,
    waitDisplay: 'P50 Wait: ~240 days (7–9 mos)',
    waitSlug: 'prius',
  },
  {
    id: 'sienna-hybrid',
    name: 'Toyota Sienna Hybrid',
    trim: 'LE AWD',
    powertrain: 'Hybrid',
    msrpCad: 45950,
    combinedL100km: 6.6,
    waitDays: 410,
    waitDisplay: 'P50 Wait: ~410 days (12–14 mos)',
    waitSlug: 'sienna',
  },
  {
    id: 'rav4-phev',
    name: 'Toyota RAV4 PHEV (Prime)',
    trim: 'SE AWD',
    powertrain: 'Plug-in Hybrid',
    msrpCad: 48750,
    combinedL100km: 6.0,
    waitDays: 365,
    waitDisplay: 'P50 Wait: ~365 days (10–14 mos)',
    waitSlug: 'rav4',
  },
  {
    id: 'highlander-hybrid',
    name: 'Toyota Highlander Hybrid',
    trim: 'LE AWD',
    powertrain: 'Hybrid',
    msrpCad: 50550,
    combinedL100km: 6.7,
    waitDays: 240,
    waitDisplay: 'P50 Wait: ~240 days (7–9 mos)',
    waitSlug: 'highlander',
  },
  {
    id: 'grand-highlander-hybrid',
    name: 'Toyota Grand Highlander Hybrid',
    trim: 'XLE AWD',
    powertrain: 'Hybrid',
    msrpCad: 54050,
    combinedL100km: 7.0,
    waitDays: 300,
    waitDisplay: 'P50 Wait: ~300 days (10–12 mos)',
    waitSlug: 'grand-highlander',
  },
  {
    id: 'crown-signia-hybrid',
    name: 'Toyota Crown Signia',
    trim: 'Limited AWD',
    powertrain: 'Hybrid',
    msrpCad: 57450,
    combinedL100km: 6.2,
    waitDays: 240,
    waitDisplay: 'P50 Wait: ~240 days (7–9 mos)',
    waitSlug: 'crown-signia',
  },
];

const TERM_OPTIONS = [36, 48, 60, 72, 84] as const;

// Canadian reference standards
const REF_GAS_L100KM = 9.5; // Benchmark compact crossover AWD
const REF_ANNUAL_KM = 20000; // Average annual km in Canada
const REF_MONTHLY_KM = REF_ANNUAL_KM / 12; // ~1,666.7 km/mo
const REF_GAS_PRICE_PER_L = 1.65; // CAD per litre national benchmark

export function calculateMonthlyFuelSavingsCad(combinedL100km: number): number {
  const refMonthlyCost = (REF_MONTHLY_KM / 100) * REF_GAS_L100KM * REF_GAS_PRICE_PER_L;
  const vehMonthlyCost = (REF_MONTHLY_KM / 100) * combinedL100km * REF_GAS_PRICE_PER_L;
  return Math.max(0, Math.round(refMonthlyCost - vehMonthlyCost));
}

export function ShopByBudgetCalculator() {
  const [targetMonthlyPayment, setTargetMonthlyPayment] = useState<number>(700);
  const [downPayment, setDownPayment] = useState<number>(5000);
  const [termMonths, setTermMonths] = useState<number>(60);
  const [annualInterestRatePct, setAnnualInterestRatePct] = useState<number>(6.49);
  const [powertrainFilter, setPowertrainFilter] = useState<'ALL' | 'HYBRID' | 'GAS'>('ALL');

  // Compute affordability result deterministically
  const result: BudgetAffordabilityResult = useMemo(() => {
    try {
      return calculateMaxVehiclePrice(
        Math.max(0, targetMonthlyPayment),
        Math.max(0, downPayment),
        Math.max(0, annualInterestRatePct),
        Math.max(1, termMonths)
      );
    } catch {
      return {
        maxVehiclePrice: 0,
        totalFinancedAmount: 0,
        totalInterestPaid: 0,
        totalLoanCost: 0,
      };
    }
  }, [targetMonthlyPayment, downPayment, annualInterestRatePct, termMonths]);

  const ceiling = result.maxVehiclePrice;

  // Filter and prioritize models falling under or near the ceiling
  const matchingModels = useMemo(() => {
    return CANADIAN_TOYOTA_BUDGET_MODELS.filter((model) => {
      // Powertrain filter
      if (powertrainFilter === 'HYBRID' && model.powertrain === 'Gas') return false;
      if (powertrainFilter === 'GAS' && model.powertrain !== 'Gas') return false;

      // Include all models within 15% of ceiling, or at least baseline models up to $38k so lower budgets show realistic next steps
      const upperThreshold = Math.max(ceiling * 1.15, 38000);
      return model.msrpCad <= upperThreshold;
    }).sort((a, b) => {
      // Sort within budget first, then by ascending MSRP
      const aWithin = a.msrpCad <= ceiling;
      const bWithin = b.msrpCad <= ceiling;
      if (aWithin && !bWithin) return -1;
      if (!aWithin && bWithin) return 1;
      return a.msrpCad - b.msrpCad;
    });
  }, [ceiling, powertrainFilter]);

  return (
    <div className="space-y-6">
      {/* 2-Column Responsive Layout: Inputs (Left) and Purchase Ceiling Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* Left Column (7 cols): Budget Parameters */}
        <Card className="lg:col-span-7 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-xs">
          <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Your Monthly Financing Budget
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4 sm:space-y-5">
            {/* 1. Target Monthly Payment */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="target-monthly-payment"
                  className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200"
                >
                  Target Monthly Payment
                </label>
                <div className="flex items-center gap-1 font-mono font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-50 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-500 text-xs">$</span>
                  <input
                    id="target-monthly-payment"
                    type="number"
                    min={300}
                    max={1800}
                    step={25}
                    value={targetMonthlyPayment}
                    onChange={(e) => setTargetMonthlyPayment(Number(e.target.value) || 0)}
                    className="w-16 sm:w-20 bg-transparent text-right outline-none font-bold text-zinc-900 dark:text-zinc-100"
                  />
                  <span className="text-zinc-500 text-[11px]">CAD/mo</span>
                </div>
              </div>
              <input
                type="range"
                min={300}
                max={1800}
                step={25}
                value={targetMonthlyPayment}
                onChange={(e) => setTargetMonthlyPayment(Number(e.target.value))}
                aria-label="Target monthly payment slider"
                className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
                <span>$300/mo</span>
                <span>$700/mo (Avg)</span>
                <span>$1,200/mo</span>
                <span>$1,800/mo</span>
              </div>
            </div>

            {/* 2. Down Payment & Trade-In Equity */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="down-payment"
                  className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200"
                >
                  Down Payment &amp; Trade-In Equity
                </label>
                <div className="flex items-center gap-1 font-mono font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-50 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-500">$</span>
                  <input
                    id="down-payment"
                    type="number"
                    min={0}
                    step={500}
                    value={downPayment}
                    onChange={(e) => setDownPayment(Math.max(0, Number(e.target.value) || 0))}
                    className="w-20 bg-transparent text-right outline-none font-bold text-zinc-900 dark:text-zinc-100"
                  />
                  <span className="text-zinc-500 text-[11px]">CAD</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[0, 2500, 5000, 8000, 12000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDownPayment(preset)}
                    className={`text-[11px] px-2.5 py-1 rounded-md font-medium border transition-colors cursor-pointer ${
                      downPayment === preset
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    ${preset.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Loan Term Selector Pills */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 block">
                Financing Term (Months)
              </label>
              <div className="grid grid-cols-5 gap-1.5" role="group" aria-label="Financing term in months">
                {TERM_OPTIONS.map((term) => (
                  <button
                    key={term}
                    type="button"
                    aria-label={`${term} months`}
                    onClick={() => setTermMonths(term)}
                    className={`py-2 px-1 text-center rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      termMonths === term
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    {term}m
                    <span className="block text-[10px] font-normal opacity-80">
                      {term / 12} yrs
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Estimated Financing Rate (% APR) */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="interest-rate"
                  className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5"
                >
                  <Percent className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Estimated Financing Rate (APR)</span>
                </label>
                <div className="flex items-center gap-1 font-mono font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-50 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700">
                  <input
                    id="interest-rate"
                    type="number"
                    min={0}
                    max={25}
                    step={0.1}
                    value={annualInterestRatePct}
                    onChange={(e) =>
                      setAnnualInterestRatePct(Math.max(0, Number(e.target.value) || 0))
                    }
                    className="w-14 bg-transparent text-right outline-none font-bold text-zinc-900 dark:text-zinc-100"
                  />
                  <span className="text-zinc-500">%</span>
                </div>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Current Canadian bank &amp; Toyota Financial Services average loan rate: 5.99% – 7.49% APR.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Right Column (5 cols): Maximum Purchase Ceiling Summary */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="bg-gradient-to-br from-emerald-950/20 via-zinc-900 to-zinc-950 border-emerald-500/30 text-white shadow-md">
            <CardHeader className="pb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block">
                Calculated Affordability Ceiling
              </span>
              <CardTitle className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-baseline gap-1.5">
                <span>${Math.round(ceiling).toLocaleString()}</span>
                <span className="text-xs sm:text-sm font-semibold text-emerald-300">CAD MSRP</span>
              </CardTitle>
              <p className="text-xs text-zinc-400 mt-1">
                Supported vehicle price for ${targetMonthlyPayment}/mo over {termMonths} months with ${downPayment.toLocaleString()} down.
              </p>
            </CardHeader>
            <CardContent className="pt-2 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs border-t border-zinc-800 pt-3">
                <div className="p-2 rounded-lg bg-zinc-900/80 border border-zinc-800">
                  <span className="text-zinc-400 block text-[11px]">Financed Amount</span>
                  <span className="font-mono font-bold text-zinc-100 text-sm">
                    ${Math.round(result.totalFinancedAmount).toLocaleString()}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-zinc-900/80 border border-zinc-800">
                  <span className="text-zinc-400 block text-[11px]">Total Interest</span>
                  <span className="font-mono font-bold text-zinc-100 text-sm">
                    ${Math.round(result.totalInterestPaid).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Total Outlay Over {termMonths / 12} Yrs:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  ${Math.round(result.totalLoanCost).toLocaleString()} CAD
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Powertrain Filter Bar */}
          <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 flex items-center justify-between gap-2 text-xs">
            <span className="font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter Models:</span>
            </span>
            <div className="inline-flex rounded-lg border border-zinc-200 dark:border-zinc-800 p-0.5 bg-zinc-100 dark:bg-zinc-800">
              <button
                type="button"
                onClick={() => setPowertrainFilter('ALL')}
                className={`px-2 py-1 rounded text-[11px] font-medium cursor-pointer transition-colors ${
                  powertrainFilter === 'ALL'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-bold shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                All Models
              </button>
              <button
                type="button"
                onClick={() => setPowertrainFilter('HYBRID')}
                className={`px-2 py-1 rounded text-[11px] font-medium cursor-pointer transition-colors ${
                  powertrainFilter === 'HYBRID'
                    ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                Hybrids Only
              </button>
              <button
                type="button"
                onClick={() => setPowertrainFilter('GAS')}
                className={`px-2 py-1 rounded text-[11px] font-medium cursor-pointer transition-colors ${
                  powertrainFilter === 'GAS'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-bold shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                Gas Only
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Matching Section */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Eligible Canadian Toyota Models ({matchingModels.length} Matches)
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Ranked by Canadian baseline MSRP against your ${Math.round(ceiling).toLocaleString()} CAD ceiling.
            </p>
          </div>
          <span className="text-xs font-medium text-zinc-500">
            Reference gas benchmark: 9.5 L/100km @ $1.65/L
          </span>
        </div>

        {matchingModels.length === 0 ? (
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
              No Toyota models fit under ${Math.round(ceiling).toLocaleString()} CAD
            </h4>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              The entry-level Toyota Corolla Sedan starts at $23,490 CAD. Increase your monthly budget or down payment to expand matching options.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {matchingModels.map((model) => {
              const isWithinBudget = model.msrpCad <= ceiling;
              const diff = Math.abs(ceiling - model.msrpCad);
              const monthlySavings = calculateMonthlyFuelSavingsCad(model.combinedL100km);

              return (
                <Card
                  key={model.id}
                  className={`flex flex-col justify-between transition-all border ${
                    isWithinBudget
                      ? 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 hover:border-emerald-500/50'
                      : 'border-amber-500/30 dark:border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/10'
                  }`}
                >
                  <CardHeader className="pb-2 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                          model.powertrain === 'Hybrid'
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                            : model.powertrain === 'Plug-in Hybrid'
                            ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                        }`}
                      >
                        {model.powertrain}
                      </span>

                      {isWithinBudget ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Within Budget</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-500/30">
                          <span>Stretch (+${Math.round(diff).toLocaleString()})</span>
                        </span>
                      )}
                    </div>

                    <div>
                      <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
                        {model.name}
                      </CardTitle>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {model.trim} • {model.combinedL100km} L/100km combined
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-1 space-y-3">
                    {/* MSRP & Price Status */}
                    <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Base MSRP</span>
                        <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                          ${model.msrpCad.toLocaleString()} CAD
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Budget Margin</span>
                        <span
                          className={`font-mono text-xs font-bold ${
                            isWithinBudget
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {isWithinBudget
                            ? `+$${Math.round(diff).toLocaleString()} headroom`
                            : `-$${Math.round(diff).toLocaleString()} stretch`}
                        </span>
                      </div>
                    </div>

                    {/* Wait Time & Fuel Savings */}
                    <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">
                          {model.waitDisplay}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Fuel className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                          {monthlySavings > 0
                            ? `Save ~$${monthlySavings}/mo on gas vs 9.5L ref`
                            : 'Baseline reference fuel consumption'}
                        </span>
                      </div>
                    </div>

                    {/* Action Bridge CTA */}
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-semibold border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Link href={`/wait-times/${model.waitSlug}`}>
                        <span>Explore Queue</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
