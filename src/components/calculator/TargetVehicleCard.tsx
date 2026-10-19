'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Zap, BatteryCharging, AlertCircle, Sparkles } from 'lucide-react';
import { NEW_VEHICLE_PRESETS, getVehiclePresetById } from '@/data/vehicle-presets';
import { TargetVehicleState } from '@/lib/hooks/useSavingsCalculator';

export interface TargetVehicleCardProps {
  targetVehicle: TargetVehicleState;
  onChange: (patch: Partial<TargetVehicleState>) => void;
  className?: string;
}

export function TargetVehicleCard({
  targetVehicle,
  onChange,
  className,
}: TargetVehicleCardProps) {
  const selectedPreset =
    getVehiclePresetById(targetVehicle.presetId) || NEW_VEHICLE_PRESETS[0];

  const isPhev = targetVehicle.powertrain === 'PHEV';

  const handlePresetSelect = (presetId: string) => {
    const preset = getVehiclePresetById(presetId);
    if (!preset) return;

    onChange({
      presetId,
      powertrain: preset.identity.powertrain,
      // If switching to PHEV and electric share is 0 with charging access, set to 0.65
      electricShare:
        preset.identity.powertrain === 'PHEV'
          ? targetVehicle.hasChargingAccess
            ? 0.65
            : 0.0
          : targetVehicle.electricShare,
    });
  };

  const handleChargingAccessToggle = (hasAccess: boolean) => {
    onChange({
      hasChargingAccess: hasAccess,
      electricShare: hasAccess ? 0.65 : 0.0,
    });
  };

  const handleElectricShareChange = (pct: number) => {
    if (!Number.isFinite(pct)) return;
    const boundedPct = Math.min(100, Math.max(0, pct));
    onChange({ electricShare: boundedPct / 100 });
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-red-600 dark:text-red-500" />
            Target Toyota Vehicle
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant={selectedPreset?.consumption.status === 'PROVISIONAL' ? 'secondary' : 'default'}
              className="text-xs font-semibold"
            >
              {selectedPreset?.consumption.status === 'PROVISIONAL'
                ? 'PROVISIONAL DATA'
                : 'VERIFIED NRCAN'}
            </Badge>
          </div>
        </div>
        <CardDescription>
          Select your desired Toyota vehicle and powertrain configuration.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Model Presets Selector */}
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold">
            Select Toyota Model
          </Label>

          <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Target Toyota models">
            {NEW_VEHICLE_PRESETS.map((preset) => {
              const isSelected = targetVehicle.presetId === preset.id;
              const isPHEVPreset = preset.identity.powertrain === 'PHEV';

              return (
                <button
                  key={preset.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handlePresetSelect(preset.id)}
                  className={`min-h-[44px] text-left p-3 rounded-lg border transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'border-red-600 bg-red-50/50 dark:border-red-500 dark:bg-red-950/20 ring-1 ring-red-600 dark:ring-red-500'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 leading-tight">
                      {preset.name}
                    </span>
                    <Badge
                      variant={isPHEVPreset ? 'default' : 'outline'}
                      className="text-[10px] uppercase font-bold shrink-0"
                    >
                      {preset.identity.powertrain}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                    <span>
                      {isPHEVPreset
                        ? `${preset.consumption.electricRangeKm} km EV / ${preset.consumption.gasModeL100km} L`
                        : `${preset.consumption.combinedL100km} L/100km`}
                    </span>
                    <span className="font-mono font-medium">
                      ${preset.pricing?.msrpCad.toLocaleString()} CAD
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Powertrain Override Pills (HEV vs PHEV vs Gas) */}
        <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <Label className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold">
            Powertrain Technology
          </Label>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="Powertrain selection">
            <button
              type="button"
              onClick={() => {
                // If currently PHEV, switch to RAV4 HEV preset as default
                if (isPhev) {
                  onChange({
                    presetId: '2026-toyota-rav4-hybrid',
                    powertrain: 'HEV',
                  });
                }
              }}
              className={`min-h-[44px] px-3 py-2 text-sm font-semibold rounded-md border transition-all flex items-center justify-center gap-2 ${
                !isPhev
                  ? 'border-red-600 bg-red-600 text-white shadow-sm'
                  : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              <Zap className="w-4 h-4" />
              Hybrid (HEV)
            </button>
            <button
              type="button"
              onClick={() => {
                // Switch to RAV4 PHEV
                onChange({
                  presetId: '2026-toyota-rav4-phev',
                  powertrain: 'PHEV',
                  hasChargingAccess: true,
                  electricShare: 0.65,
                });
              }}
              className={`min-h-[44px] px-3 py-2 text-sm font-semibold rounded-md border transition-all flex items-center justify-center gap-2 ${
                isPhev
                  ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                  : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              <BatteryCharging className="w-4 h-4" />
              Plug-in Hybrid (PHEV)
            </button>
          </div>
        </div>

        {/* PHEV Specific Controls: Charging Access & Electric Share */}
        {isPhev && (
          <div className="space-y-5 p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 transition-all">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-bold text-sm">
              <BatteryCharging className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Plug-in Hybrid EV Settings
            </div>

            {/* 1. Charging Access Toggle */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Do you have regular home or workplace charging?
              </Label>
              <div className="grid grid-cols-2 gap-2" role="group" aria-label="Charging access options">
                <button
                  type="button"
                  onClick={() => handleChargingAccessToggle(true)}
                  className={`min-h-[44px] px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
                    targetVehicle.hasChargingAccess
                      ? 'border-emerald-600 bg-emerald-600 text-white shadow'
                      : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  Yes (Level 1 or 2)
                </button>
                <button
                  type="button"
                  onClick={() => handleChargingAccessToggle(false)}
                  className={`min-h-[44px] px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
                    !targetVehicle.hasChargingAccess
                      ? 'border-zinc-700 bg-zinc-800 text-white shadow'
                      : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  No Regular Charging
                </button>
              </div>
            </div>

            {/* 2. Electric Share Slider & Input (Revealed if charging access is Yes) */}
            {targetVehicle.hasChargingAccess ? (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between gap-4">
                  <Label
                    htmlFor="electric-share-input"
                    className="font-medium text-xs text-zinc-800 dark:text-zinc-200"
                  >
                    Electric Driving Share (%)
                  </Label>
                  <div className="w-24">
                    <Input
                      id="electric-share-input"
                      aria-label="Electric driving share percentage"
                      type="number"
                      min={0}
                      max={100}
                      step={5}
                      value={Math.round(targetVehicle.electricShare * 100)}
                      onChange={(e) => handleElectricShareChange(Number(e.target.value))}
                      className="min-h-[44px] text-right font-mono font-semibold"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <input
                    id="electric-share-slider"
                    aria-label="Electric driving share slider"
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={Math.round(targetVehicle.electricShare * 100)}
                    onChange={(e) => handleElectricShareChange(Number(e.target.value))}
                    className="w-full min-h-[44px] accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                    <span>0% (Gas only)</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      65% (Typical daily commute)
                    </span>
                    <span>100% (Pure EV)</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 italic">
                  Default 65% assumes daily round-trips within the 80 km EV range with overnight charging.
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-2 p-3 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Without regular charging access, electric share is set to 0%. The vehicle will operate in charge-sustaining hybrid gasoline mode ({selectedPreset?.consumption.gasModeL100km ?? 6.0} L/100km).
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
