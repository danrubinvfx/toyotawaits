'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, BatteryCharging, AlertCircle } from 'lucide-react';
import { NEW_VEHICLE_PRESETS, getVehiclePresetById } from '@/data/vehicle-presets';
import { TargetVehicleState } from '@/lib/hooks/useSavingsCalculator';

export interface TargetVehicleCardProps {
  targetVehicle: TargetVehicleState;
  onChange: (patch: Partial<TargetVehicleState>) => void;
  className?: string;
}

interface ModelFamily {
  label: string;
  slug: string;
  hevPresetId: string;
  phevPresetId?: string;
}

const MODEL_FAMILIES: ModelFamily[] = [
  { label: 'RAV4', slug: 'rav4', hevPresetId: '2026-toyota-rav4-hybrid', phevPresetId: '2026-toyota-rav4-phev' },
  { label: 'Camry', slug: 'camry', hevPresetId: '2025-toyota-camry-hybrid' },
  { label: 'Prius', slug: 'prius', hevPresetId: '2025-toyota-prius-hybrid' },
  { label: 'Sienna', slug: 'sienna', hevPresetId: '2025-toyota-sienna-hybrid' },
  { label: 'Grand Highlander', slug: 'grand-highlander', hevPresetId: '2025-toyota-grand-highlander-hybrid' },
];

export function TargetVehicleCard({
  targetVehicle,
  onChange,
  className,
}: TargetVehicleCardProps) {
  const selectedPreset =
    getVehiclePresetById(targetVehicle.presetId) || NEW_VEHICLE_PRESETS[0];

  const isPhev = targetVehicle.powertrain === 'PHEV';

  // Identify active model family
  const activeFamily =
    MODEL_FAMILIES.find((f) => targetVehicle.presetId.includes(f.slug)) ||
    MODEL_FAMILIES[0];

  const supportsPhev = Boolean(activeFamily.phevPresetId);

  const handleFamilySelect = (family: ModelFamily) => {
    if (isPhev && family.phevPresetId) {
      onChange({
        presetId: family.phevPresetId,
        powertrain: 'PHEV',
      });
    } else {
      onChange({
        presetId: family.hevPresetId,
        powertrain: 'HEV',
      });
    }
  };

  const handlePowertrainSelect = (powertrain: 'HEV' | 'PHEV') => {
    if (powertrain === 'PHEV' && activeFamily.phevPresetId) {
      onChange({
        presetId: activeFamily.phevPresetId,
        powertrain: 'PHEV',
        hasChargingAccess: true,
        electricShare: 0.65,
      });
    } else {
      onChange({
        presetId: activeFamily.hevPresetId,
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

  const ratingSummary = isPhev
    ? `${selectedPreset.consumption.electricRangeKm} km EV / ${selectedPreset.consumption.gasModeL100km} L`
    : `${selectedPreset.consumption.combinedL100km} L/100km`;

  return (
    <Card className={`border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-4 ${className ?? ''}`}>
      <CardHeader className="p-0 pb-2.5 border-b border-zinc-100 dark:border-zinc-800/60">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <Sparkles className="w-4 h-4 text-red-600 dark:text-red-500" />
            Target Toyota Vehicle
          </CardTitle>
          <Badge
            variant={selectedPreset?.consumption.status === 'PROVISIONAL' ? 'secondary' : 'default'}
            className="text-[10px] font-semibold py-0"
          >
            {selectedPreset?.consumption.status === 'PROVISIONAL'
              ? 'PROVISIONAL'
              : 'NRCAN VERIFIED'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0 pt-3 space-y-2.5">
        {/* 1. Horizontal Model Selector Tab/Pill Row */}
        <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Toyota models">
          {MODEL_FAMILIES.map((family) => {
            const isSelected = activeFamily.slug === family.slug;
            return (
              <button
                key={family.slug}
                type="button"
                onClick={() => handleFamilySelect(family)}
                className={`text-xs py-1 px-2.5 rounded-md border font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'border-red-600 bg-red-50 text-red-700 dark:bg-red-950/40 dark:border-red-500 dark:text-red-300 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                {family.label}
              </button>
            );
          })}
        </div>

        {/* 2. Inline Powertrain Toggle */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800/60">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Powertrain</span>
          <div className="flex gap-1" role="group" aria-label="Powertrain selection">
            <button
              type="button"
              onClick={() => handlePowertrainSelect('HEV')}
              className={`text-xs py-1 px-2.5 rounded-md border font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                !isPhev
                  ? 'border-red-600 bg-red-600 text-white shadow-xs'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>HEV</span>
            </button>

            <button
              type="button"
              disabled={!supportsPhev}
              onClick={() => handlePowertrainSelect('PHEV')}
              className={`text-xs py-1 px-2.5 rounded-md border font-semibold flex items-center gap-1 transition-all ${
                !supportsPhev
                  ? 'opacity-40 border-zinc-200 dark:border-zinc-800 text-zinc-400 cursor-not-allowed'
                  : isPhev
                  ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs cursor-pointer'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer'
              }`}
            >
              <BatteryCharging className="w-3.5 h-3.5" />
              <span>PHEV</span>
            </button>
          </div>
        </div>

        {/* 3. Active Vehicle Rating & MSRP Summary Pill */}
        <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 text-xs">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
            {selectedPreset.name}
          </span>
          <span className="font-mono text-zinc-600 dark:text-zinc-400 shrink-0 font-medium">
            {ratingSummary} • ${selectedPreset.pricing?.msrpCad.toLocaleString()} MSRP
          </span>
        </div>

        {/* 4. Tight Inline PHEV Controls */}
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
