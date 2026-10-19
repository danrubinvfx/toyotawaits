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
    <Card className={`border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm ${className ?? ''}`}>
      <CardHeader className="p-3 sm:p-4 pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-600 dark:text-red-500" />
            Target Toyota Vehicle
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant={selectedPreset?.consumption.status === 'PROVISIONAL' ? 'secondary' : 'default'}
              className="text-[10px] font-semibold py-0.5"
            >
              {selectedPreset?.consumption.status === 'PROVISIONAL'
                ? 'PROVISIONAL'
                : 'NRCAN VERIFIED'}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-xs">
          Select target Toyota model and powertrain.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 space-y-3.5">
        {/* Model Presets Selector */}
        <div className="space-y-2">
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
                  className={`min-h-[44px] text-left p-2.5 rounded-lg border transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'border-red-600 bg-red-50/50 dark:border-red-500 dark:bg-red-950/20 ring-1 ring-red-600 dark:ring-red-500'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 leading-tight">
                      {preset.name}
                    </span>
                    <Badge
                      variant={isPHEVPreset ? 'default' : 'outline'}
                      className="text-[9px] uppercase font-bold shrink-0 px-1 py-0"
                    >
                      {preset.identity.powertrain}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-600 dark:text-zinc-400 pt-1 border-t border-zinc-100 dark:border-zinc-800/60">
                    <span>
                      {isPHEVPreset
                        ? `${preset.consumption.electricRangeKm}km EV`
                        : `${preset.consumption.combinedL100km} L/100km`}
                    </span>
                    <span className="font-mono font-medium">
                      ${preset.pricing?.msrpCad.toLocaleString()}
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
          <div className="space-y-2.5 p-2.5 sm:p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 transition-all">
            <div className="flex items-center justify-between gap-2 text-emerald-900 dark:text-emerald-300 font-bold text-xs">
              <span className="flex items-center gap-1.5">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Plug-in Hybrid EV Settings
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                {targetVehicle.hasChargingAccess ? 'Home Charging / 65% EV' : 'Gas Only (0% EV)'}
              </span>
            </div>

            {/* 1. Charging Access Toggle */}
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                Do you have regular home or workplace charging?
              </Label>
              <div className="grid grid-cols-2 gap-1.5" role="group" aria-label="Charging access options">
                <button
                  type="button"
                  onClick={() => handleChargingAccessToggle(true)}
                  className={`min-h-[44px] px-2.5 py-1 text-xs font-semibold rounded-md border transition-all ${
                    targetVehicle.hasChargingAccess
                      ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                      : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  Yes (Level 1 or 2)
                </button>
                <button
                  type="button"
                  onClick={() => handleChargingAccessToggle(false)}
                  className={`min-h-[44px] px-2.5 py-1 text-xs font-semibold rounded-md border transition-all ${
                    !targetVehicle.hasChargingAccess
                      ? 'border-zinc-700 bg-zinc-800 text-white shadow-xs'
                      : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  No Regular Charging
                </button>
              </div>
            </div>

            {/* 2. Electric Share Slider & Input (Revealed if charging access is Yes) */}
            {targetVehicle.hasChargingAccess ? (
              <div className="space-y-1.5 pt-1 border-t border-emerald-100 dark:border-emerald-900/40">
                <div className="flex items-center justify-between gap-3">
                  <Label
                    htmlFor="electric-share-input"
                    className="font-medium text-[11px] text-zinc-800 dark:text-zinc-200"
                  >
                    Electric Driving Share (%)
                  </Label>
                  <div className="w-20">
                    <Input
                      id="electric-share-input"
                      aria-label="Electric driving share percentage"
                      type="number"
                      min={0}
                      max={100}
                      step={5}
                      value={Math.round(targetVehicle.electricShare * 100)}
                      onChange={(e) => handleElectricShareChange(Number(e.target.value))}
                      className="h-9 min-h-[44px] text-xs text-right font-mono font-semibold"
                    />
                  </div>
                </div>

                <div className="pt-0.5">
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
                  <div className="flex justify-between text-[10px] text-zinc-500 dark:text-zinc-400">
                    <span>0% (Gas)</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      65% (Avg Commute)
                    </span>
                    <span>100% (EV)</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-1.5 p-2 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-800 dark:text-amber-300">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
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
