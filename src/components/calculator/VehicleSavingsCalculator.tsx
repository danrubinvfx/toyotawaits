'use client';

import React from 'react';
import {
  useSavingsCalculator,
  CalculatorInitialConfig,
} from '@/lib/hooks/useSavingsCalculator';
import { DrivingInputsCard } from './DrivingInputsCard';
import { CurrentVehicleCard } from './CurrentVehicleCard';
import { TargetVehicleCard } from './TargetVehicleCard';
import { EnergyResultsCard } from './EnergyResultsCard';
import { WaitOpportunityCard } from './WaitOpportunityCard';
import { PurchaseOutlayCard } from './PurchaseOutlayCard';
import { PaybackSummaryCard } from './PaybackSummaryCard';
import { PaybackChart } from './PaybackChart';
import { AccessibleChartTable } from './AccessibleChartTable';
import { RotateCcw, TrendingUp, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getVehiclePresetById } from '@/data/vehicle-presets';

export type VehicleSavingsCalculatorProps = CalculatorInitialConfig;

export function VehicleSavingsCalculator(props: VehicleSavingsCalculatorProps = {}) {
  const {
    drivingInputs,
    setDrivingInputs,
    currentVehicle,
    setCurrentVehicle,
    targetVehicle,
    setTargetVehicle,
    comparisonMode,
    setComparisonMode,
    mode2Outlay,
    setMode2Outlay,
    mode3Outlay,
    setMode3Outlay,
    waitDays,
    setWaitDays,
    resetToDefaults,
    targetPreset,
    results,
  } = useSavingsCalculator(props);

  const refVehicleName =
    comparisonMode === 'NEW_A_VS_NEW_B'
      ? getVehiclePresetById(mode3Outlay.vehicleAPresetId)?.name ?? 'Vehicle A'
      : 'Current Vehicle';

  const targetVehicleName =
    comparisonMode === 'NEW_A_VS_NEW_B'
      ? getVehiclePresetById(mode3Outlay.vehicleBPresetId)?.name ?? 'Vehicle B'
      : targetPreset?.name ?? 'Target Vehicle';

  const isTargetPhev = targetVehicle.powertrain === 'PHEV';

  return (
    <div className="w-full space-y-6">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-red-600 dark:text-red-500">
            Interactive Calculator (Stage 4 Payback & Timeline)
          </span>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            Configure Your Vehicle Comparison
          </h2>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={resetToDefaults}
          className="min-h-[44px] px-3 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </Button>
      </div>

      {comparisonMode !== 'ENERGY_COMPARISON' && (
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-red-600 dark:text-red-500" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            Payback Analysis & 7-Year Timeline
          </h3>
        </div>
      )}

      {/* Step 1: Top Hero Section - Money-Over-Time Graph (Left) & High-Impact Savings Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start">
        {/* Left Column (65% on Desktop): Interactive Recharts money-over-time graph */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-3">
          {results.timelineResult ? (
            <PaybackChart
              timeline={results.timelineResult}
              isRecovered={results.isRecovered ?? false}
              recoveryYear={results.recoveryYear ?? null}
              recoveryDay={results.recoveryDay ?? null}
              refVehicleName={refVehicleName}
              targetVehicleName={targetVehicleName}
            />
          ) : null}

          {/* Accessible Table for Screen Readers (when Mode 2 or 3 is active) */}
          {comparisonMode !== 'ENERGY_COMPARISON' && results.timelineResult && (
            <AccessibleChartTable
              points={results.timelineResult.points}
              refVehicleName={refVehicleName}
              targetVehicleName={targetVehicleName}
            />
          )}
        </div>

        {/* Right Column (35% on Desktop): High-Impact Savings Card + Payback Summary */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-3">
          <EnergyResultsCard results={results} />

          {comparisonMode !== 'ENERGY_COMPARISON' && results.paybackResult && (
            <PaybackSummaryCard
              payback={results.paybackResult}
              comparisonMode={comparisonMode}
              waitDays={waitDays}
            />
          )}
        </div>
      </div>

      {/* Step 2: Streamlined 3-Step Input Cockpit (Directly Under Graph) */}
      <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Driving & Vehicle Parameters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-start">
          {/* 1. Target Toyota Selection */}
          {comparisonMode !== 'NEW_A_VS_NEW_B' ? (
            <TargetVehicleCard
              targetVehicle={targetVehicle}
              onChange={setTargetVehicle}
            />
          ) : (
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-500">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 block mb-1">
                Vehicle B Configured Below
              </span>
              In New A vs. New B mode, Vehicle B serves as the comparison target and is selected in the comparison drawer below.
            </div>
          )}

          {/* 2. Your Current Ride Baseline */}
          {comparisonMode !== 'NEW_A_VS_NEW_B' ? (
            <CurrentVehicleCard
              currentVehicle={currentVehicle}
              onChange={setCurrentVehicle}
            />
          ) : (
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-500">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 block mb-1">
                Vehicle A Configured Below
              </span>
              In New A vs. New B mode, Vehicle A serves as the baseline reference and is selected in the comparison drawer below.
            </div>
          )}

          {/* 3. Driving Distance & Gas Price (Power Rate hidden for HEVs!) */}
          <DrivingInputsCard
            inputs={drivingInputs}
            onChange={setDrivingInputs}
            isPhev={isTargetPhev}
          />
        </div>
      </div>

      {/* Wait Opportunity Card */}
      <div className="pt-2">
        <WaitOpportunityCard
          annualCostCurrent={results.currentAnnualCost}
          annualCostTarget={results.targetAnnualCost}
          initialWaitDays={waitDays}
          onWaitDaysChange={setWaitDays}
          targetModelSlug={
            targetVehicle.presetId.includes('rav4')
              ? 'rav4'
              : targetVehicle.presetId.includes('prius')
              ? 'prius'
              : targetVehicle.presetId.includes('camry')
              ? 'camry'
              : targetVehicle.presetId.includes('sienna')
              ? 'sienna'
              : 'rav4'
          }
          targetPowertrain={targetVehicle.powertrain.toLowerCase()}
          province="BC"
        />
      </div>

      {/* Step 3: Collapsed Comparison Drawer (Keep vs. Replace / New A vs. B) & Scope Notice at Bottom */}
      <details
        className="mt-8 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-zinc-50/50 dark:bg-zinc-900/30"
        open={comparisonMode !== 'ENERGY_COMPARISON'}
      >
        <summary className="cursor-pointer font-medium text-sm text-zinc-700 dark:text-zinc-300 flex items-center justify-between select-none">
          <span className="flex items-center gap-2">
            <Car className="w-4 h-4 text-zinc-500" />
            <span>🚗 Factor in Vehicle Purchase Price & Trade-in (Keep vs. Replace / New A vs. B)</span>
          </span>
          <span className="text-zinc-500 group-open:rotate-180 transition-transform">▾</span>
        </summary>
        <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
          <PurchaseOutlayCard
            comparisonMode={comparisonMode}
            onComparisonModeChange={setComparisonMode}
            mode2Outlay={mode2Outlay}
            onMode2OutlayChange={setMode2Outlay}
            mode3Outlay={mode3Outlay}
            onMode3OutlayChange={setMode3Outlay}
            calculatedNetOutlay={results.calculatedNetOutlay ?? 0}
            effectiveNetOutlay={results.effectiveNetOutlay ?? 0}
          />

          {/* Collapsible Scope Disclosure */}
          <details className="group text-xs text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 bg-zinc-100/50 dark:bg-zinc-900/40">
            <summary className="cursor-pointer select-none font-medium text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
              <span>Methodology & Scope Exclusions</span>
              <span className="text-zinc-500 group-open:rotate-180 transition-transform">▾</span>
            </summary>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-zinc-200 dark:border-zinc-800/60 pt-2 text-[11px]">
              Models direct fuel & wall-to-wheel electricity consumption only. Excludes vehicle purchase cost, provincial/federal taxes, insurance premiums, maintenance, and wait-time depreciation.
            </p>
          </details>
        </div>
      </details>
    </div>
  );
}
