'use client';

import React from 'react';
import { useSavingsCalculator } from '@/lib/hooks/useSavingsCalculator';
import { DrivingInputsCard } from './DrivingInputsCard';
import { CurrentVehicleCard } from './CurrentVehicleCard';
import { TargetVehicleCard } from './TargetVehicleCard';
import { EnergyResultsCard } from './EnergyResultsCard';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function VehicleSavingsCalculator() {
  const {
    drivingInputs,
    setDrivingInputs,
    currentVehicle,
    setCurrentVehicle,
    targetVehicle,
    setTargetVehicle,
    resetToDefaults,
    results,
  } = useSavingsCalculator();

  return (
    <div className="w-full space-y-8">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-red-600 dark:text-red-500">
            Interactive Calculator (Stage 2 MVP)
          </span>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            Configure Your Comparison
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

      {/* Main Grid Layout: Inputs on left, Sticky Results on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Configuration Cards */}
        <div className="lg:col-span-7 space-y-6">
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

          {/* 3. Driving Distance & Energy Rates */}
          <DrivingInputsCard
            inputs={drivingInputs}
            onChange={setDrivingInputs}
          />
        </div>

        {/* Right Column: Sticky Energy Results Card */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-6">
          <EnergyResultsCard results={results} />
        </div>
      </div>
    </div>
  );
}
