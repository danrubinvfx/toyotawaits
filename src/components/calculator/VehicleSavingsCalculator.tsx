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
import { RotateCcw, TrendingUp } from 'lucide-react';
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

  return (
    <div className="w-full space-y-8">
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

      {/* Comparison Mode & Outlay Configuration */}
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

      {/* Main Grid Layout: Inputs on left, Sticky Results on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Vehicle & Driving Configuration Cards */}
        <div className="lg:col-span-7 space-y-6">
          {comparisonMode !== 'NEW_A_VS_NEW_B' && (
            <>
              {/* 1. Target Toyota Vehicle */}
              <TargetVehicleCard
                targetVehicle={targetVehicle}
                onChange={setTargetVehicle}
              />

              {/* 2. Current Vehicle Baseline */}
              <CurrentVehicleCard
                currentVehicle={currentVehicle}
                onChange={setCurrentVehicle}
              />
            </>
          )}

          {/* 3. Driving Distance & Energy Rates */}
          <DrivingInputsCard
            inputs={drivingInputs}
            onChange={setDrivingInputs}
          />
        </div>

        {/* Right Column: Sticky Energy Results & Wait Opportunity Cards */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-6">
          <EnergyResultsCard results={results} />
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
      </div>

      {/* Payback & Cash Flow Timeline Section (Active for Mode 2 & Mode 3) */}
      {comparisonMode !== 'ENERGY_COMPARISON' && results.paybackResult && results.timelineResult ? (
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-600 dark:text-red-500" />
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Payback Analysis & 7-Year Timeline
            </h3>
          </div>

          <PaybackSummaryCard
            payback={results.paybackResult}
            comparisonMode={comparisonMode}
            waitDays={waitDays}
          />

          <PaybackChart
            timeline={results.timelineResult}
            isRecovered={results.isRecovered ?? false}
            recoveryYear={results.recoveryYear ?? null}
            recoveryDay={results.recoveryDay ?? null}
            refVehicleName={refVehicleName}
            targetVehicleName={targetVehicleName}
          />

          <AccessibleChartTable
            points={results.timelineResult.points}
            refVehicleName={refVehicleName}
            targetVehicleName={targetVehicleName}
          />
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/30 border border-dashed border-zinc-300 dark:border-zinc-700/80 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Want to see how long it takes to recover the purchase price difference?
          Select <strong className="text-zinc-800 dark:text-zinc-200 font-semibold">Keep vs. Replace</strong> or <strong className="text-zinc-800 dark:text-zinc-200 font-semibold">New A vs. New B</strong> above to activate the payback evaluation and 7-year cumulative cash flow chart.
        </div>
      )}
    </div>
  );
}
