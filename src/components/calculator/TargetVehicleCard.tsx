'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sparkles, BatteryCharging, AlertCircle } from 'lucide-react';
import { NEW_VEHICLE_PRESETS, getVehiclePresetById } from '@/data/vehicle-presets';
import { TargetVehicleState } from '@/lib/hooks/useSavingsCalculator';
import { UnitSystem } from '@/types/calculator';

export interface TargetVehicleCardProps {
  targetVehicle: TargetVehicleState;
  onChange: (patch: Partial<TargetVehicleState>) => void;
  unitSystem?: UnitSystem;
  className?: string;
}

interface TargetVehicleOption {
  presetId: string;
  powertrain: 'HEV' | 'PHEV';
}

const VEHICLE_OPTIONS: TargetVehicleOption[] = [
  { presetId: '2026-toyota-rav4-hybrid', powertrain: 'HEV' },
  { presetId: '2026-toyota-rav4-phev', powertrain: 'PHEV' },
  { presetId: '2025-toyota-camry-hybrid', powertrain: 'HEV' },
  { presetId: '2025-toyota-prius-hybrid', powertrain: 'HEV' },
  { presetId: '2025-toyota-sienna-hybrid', powertrain: 'HEV' },
  { presetId: '2025-toyota-grand-highlander-hybrid', powertrain: 'HEV' },
  { presetId: '2025-toyota-crown-signia-hybrid', powertrain: 'HEV' },
];

/** Builds the dropdown label, e.g. "2026 Toyota RAV4 Hybrid AWD (5.8 L/100km / 40 MPG)". */
function buildOptionLabel(option: TargetVehicleOption): string {
  const preset = getVehiclePresetById(option.presetId);
  if (!preset) return option.presetId;
  const c = preset.consumption;
  const spec =
    option.powertrain === 'PHEV'
      ? `${c.electricRangeKm} km EV / ${c.gasModeL100km} L/100km / ${c.mpge ?? c.combinedMpg} MPGe`
      : `${c.combinedL100km} L/100km / ${c.combinedMpg} MPG`;
  return `${preset.name} (${spec})`;
}

export function TargetVehicleCard({
  targetVehicle,
  onChange,
  unitSystem = 'METRIC',
  className,
}: TargetVehicleCardProps) {
  const selectedPreset =
    getVehiclePresetById(targetVehicle.presetId) || NEW_VEHICLE_PRESETS[0];

  const isPhev = targetVehicle.powertrain === 'PHEV';

  const handleVehicleSelect = (presetId: string) => {
    const option = VEHICLE_OPTIONS.find((o) => o.presetId === presetId);
    if (!option) return;
    if (option.powertrain === 'PHEV') {
      onChange({
        presetId: option.presetId,
        powertrain: 'PHEV',
        hasChargingAccess: true,
        electricShare: 0.65,
      });
    } else {
      onChange({
        presetId: option.presetId,
        powertrain: 'HEV',
      });
    }
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

  const isImperial = unitSystem === 'IMPERIAL';

  const ratingSummary = isImperial
    ? isPhev
      ? `${selectedPreset.consumption.electricRangeMiles ?? 42} mi EV / ${selectedPreset.consumption.gasModeMpg ?? 38} MPG`
      : `${selectedPreset.consumption.combinedMpg ?? 40} MPG`
    : isPhev
    ? `${selectedPreset.consumption.electricRangeKm} km EV / ${selectedPreset.consumption.gasModeL100km} L`
    : `${selectedPreset.consumption.combinedL100km} L/100km`;

  const msrpDisplay = isImperial
    ? `$${(selectedPreset.pricing?.msrpUsd ?? 32500).toLocaleString()} USD MSRP`
    : `$${selectedPreset.pricing?.msrpCad.toLocaleString()} MSRP`;

  const verificationBadgeText =
    selectedPreset?.consumption.status === 'PROVISIONAL'
      ? 'PROVISIONAL'
      : isImperial
      ? 'EPA VERIFIED'
      : 'NRCAN VERIFIED';

  return (
    <Card className={`border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-1.5 sm:p-4 ${className ?? ''}`}>
      <CardHeader className="p-0 pb-1 sm:pb-2.5 border-b border-zinc-100 dark:border-zinc-800/60">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-xs sm:text-base font-bold flex items-center gap-1.5 sm:gap-2 text-zinc-900 dark:text-zinc-100">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 dark:text-red-500" />
            Target Toyota Vehicle
          </CardTitle>
          <Badge
            variant={selectedPreset?.consumption.status === 'PROVISIONAL' ? 'secondary' : 'default'}
            className="text-[10px] font-semibold py-0"
          >
            {verificationBadgeText}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0 pt-1.5 sm:pt-3 space-y-1.5 sm:space-y-2.5">
        {/* Vehicle Pulldown Selector */}
        <div className="relative">
          <label htmlFor="target-vehicle-select" className="sr-only">
            Select Target Toyota
          </label>
          <select
            id="target-vehicle-select"
            value={targetVehicle.presetId}
            onChange={(e) => handleVehicleSelect(e.target.value)}
            className="w-full h-9 text-xs bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg px-2.5 font-medium focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition cursor-pointer appearance-none pr-8 truncate"
          >
            {VEHICLE_OPTIONS.map((option) => (
              <option key={option.presetId} value={option.presetId}>
                {buildOptionLabel(option)}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400">
            ▾
          </div>
        </div>

        {/* Compact Spec Summary Badge (consumption, EV range if PHEV, MSRP) */}
        <div className="flex items-center justify-between gap-2 p-1.5 sm:p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 text-xs">
          <span className="font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide text-[10px]">
            {isPhev ? 'Plug-in Hybrid' : 'Hybrid'}
          </span>
          <span className="font-mono text-zinc-600 dark:text-zinc-400 shrink-0 font-medium text-[11px] sm:text-xs">
            {ratingSummary} • {msrpDisplay}
          </span>
        </div>

        {/* Tight Inline PHEV Controls */}
        {isPhev && (
          <div className="space-y-1.5 p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 transition-all">
            <div className="flex items-center justify-between gap-2 text-emerald-900 dark:text-emerald-300 font-bold text-xs">
              <span className="flex items-center gap-1">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Plug-in Hybrid EV Settings
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                {targetVehicle.hasChargingAccess ? 'Home Charging (65% EV)' : 'No Charging (0% EV)'}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <Label className="text-[11px] text-zinc-700 dark:text-zinc-300 truncate">
                Do you have regular home or workplace charging?
              </Label>
              <div className="flex gap-1 shrink-0" role="group" aria-label="Charging access options">
                <button
                  type="button"
                  onClick={() => handleChargingAccessToggle(true)}
                  className={`text-[10px] py-0.5 px-2 rounded-md border font-semibold transition-colors cursor-pointer ${
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
                  className={`text-[10px] py-0.5 px-2 rounded-md border font-semibold transition-colors cursor-pointer ${
                    !targetVehicle.hasChargingAccess
                      ? 'border-zinc-700 bg-zinc-800 text-white shadow-xs'
                      : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  No Regular Charging
                </button>
              </div>
            </div>

            {targetVehicle.hasChargingAccess ? (
              <div className="flex items-center gap-2 pt-1 border-t border-emerald-100 dark:border-emerald-900/40">
                <Label htmlFor="electric-share-input" className="text-[11px] text-zinc-700 dark:text-zinc-300 w-24 shrink-0">
                  EV Share (%)
                </Label>
                <div className="flex-1 px-1">
                  <input
                    id="electric-share-slider"
                    aria-label="Electric driving share slider"
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={Math.round(targetVehicle.electricShare * 100)}
                    onChange={(e) => handleElectricShareChange(Number(e.target.value))}
                    className="w-full h-1.5 accent-emerald-600 cursor-pointer"
                  />
                </div>
                <div className="w-16 shrink-0">
                  <Input
                    id="electric-share-input"
                    aria-label="Electric driving share percentage"
                    type="number"
                    min={0}
                    max={100}
                    step={5}
                    value={Math.round(targetVehicle.electricShare * 100)}
                    onChange={(e) => handleElectricShareChange(Number(e.target.value))}
                    className="w-16 h-7 text-xs text-right font-mono font-semibold px-2 py-0.5"
                  />
                </div>
              </div>
            ) : (
              <div className="text-[10px] text-amber-800 dark:text-amber-300 pt-0.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>Without regular charging access, electric share is set to 0%.</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
