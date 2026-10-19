'use client';

import React, { useId } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DollarSign,
  AlertCircle,
  HelpCircle,
  Scale,
  Car,
  Layers,
  ArrowRightLeft,
  RotateCcw,
} from 'lucide-react';
import { ComparisonMode } from '@/types/calculator';
import { Mode2OutlayState, Mode3OutlayState } from '@/lib/hooks/useSavingsCalculator';
import { NEW_VEHICLE_PRESETS } from '@/data/vehicle-presets';

export interface PurchaseOutlayCardProps {
  comparisonMode: ComparisonMode;
  onComparisonModeChange: (mode: ComparisonMode) => void;
  mode2Outlay: Mode2OutlayState;
  onMode2OutlayChange: (patch: Partial<Mode2OutlayState>) => void;
  mode3Outlay: Mode3OutlayState;
  onMode3OutlayChange: (patch: Partial<Mode3OutlayState>) => void;
  calculatedNetOutlay: number;
  effectiveNetOutlay: number;
  className?: string;
}

export function PurchaseOutlayCard({
  comparisonMode,
  onComparisonModeChange,
  mode2Outlay,
  onMode2OutlayChange,
  mode3Outlay,
  onMode3OutlayChange,
  calculatedNetOutlay,
  effectiveNetOutlay,
  className,
}: PurchaseOutlayCardProps) {
  const targetPriceId = useId();
  const tradeInId = useId();
  const loanBalanceId = useId();
  const chargerCostId = useId();
  const rebatesId = useId();
  const overrideId = useId();

  const vehicleAOutlayId = useId();
  const vehicleAWaitId = useId();
  const vehicleBOutlayId = useId();
  const vehicleBWaitId = useId();

  return (
    <div className={`space-y-3 ${className ?? ''}`}>
      {/* Compact Segmented Pill Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-1.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 w-full" role="tablist" aria-label="Comparison modes">
          <button
            type="button"
            role="tab"
            aria-selected={comparisonMode === 'ENERGY_COMPARISON'}
            onClick={() => onComparisonModeChange('ENERGY_COMPARISON')}
            className={`min-h-[44px] px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
              comparisonMode === 'ENERGY_COMPARISON'
                ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 shadow-xs'
                : 'bg-transparent text-zinc-700 dark:text-zinc-300 border-transparent hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span>1. Energy Only</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={comparisonMode === 'KEEP_VS_REPLACE'}
            onClick={() => onComparisonModeChange('KEEP_VS_REPLACE')}
            className={`min-h-[44px] px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
              comparisonMode === 'KEEP_VS_REPLACE'
                ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 shadow-xs'
                : 'bg-transparent text-zinc-700 dark:text-zinc-300 border-transparent hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60'
            }`}
          >
            <Car className="w-4 h-4 shrink-0" />
            <span>2. Keep vs. Replace</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={comparisonMode === 'NEW_A_VS_NEW_B'}
            onClick={() => onComparisonModeChange('NEW_A_VS_NEW_B')}
            className={`min-h-[44px] px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
              comparisonMode === 'NEW_A_VS_NEW_B'
                ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 shadow-xs'
                : 'bg-transparent text-zinc-700 dark:text-zinc-300 border-transparent hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4 shrink-0" />
            <span>3. New A vs. New B</span>
          </button>
        </div>
      </div>

      {/* Subtle 1-Line Scope Disclosure */}
      <div className="flex items-center gap-2 px-1 text-[11px] text-zinc-500 dark:text-zinc-400">
        <AlertCircle className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
        <p className="truncate">
          <strong>Scope Disclosure:</strong> Models net vehicle purchase cash outlay and energy spending only. Excludes financing interest, insurance differences, future depreciation, and maintenance.
        </p>
      </div>

      {/* Mode 1 Description Banner */}
      {comparisonMode === 'ENERGY_COMPARISON' && (
        <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800/80 text-xs text-zinc-600 dark:text-zinc-400 flex items-center justify-between gap-4">
          <div>
            <span className="font-semibold text-zinc-900 dark:text-zinc-200 mr-2">
              Mode 1: Energy-Cost Comparison Only
            </span>
            <span>Compares operational fuel and electricity spend without upfront vehicle purchase outlays.</span>
          </div>
          <span className="hidden md:inline-block text-[11px] text-zinc-400 shrink-0">
            Switch to Mode 2 or 3 to factor in vehicle prices & payback.
          </span>
        </div>
      )}

        {/* Mode 2: Keep Current vs. Replace with Target */}
        {comparisonMode === 'KEEP_VS_REPLACE' && (
          <div className="space-y-4">
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              Calculate your net out-of-pocket cash outlay to trade in your current vehicle for the target Toyota:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Target Price */}
              <div className="space-y-1.5">
                <Label htmlFor={targetPriceId} className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Target Cash Price (inc. taxes/fees)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">$</span>
                  <Input
                    id={targetPriceId}
                    type="number"
                    min={0}
                    step={500}
                    value={mode2Outlay.targetPriceCad}
                    onChange={(e) =>
                      onMode2OutlayChange({
                        targetPriceCad: Math.max(0, Number(e.target.value) || 0),
                        netOutlayOverride: null,
                      })
                    }
                    className="min-h-[44px] pl-7 text-xs font-medium bg-zinc-50/50 dark:bg-zinc-800/50"
                  />
                </div>
              </div>

              {/* Trade-in Proceeds */}
              <div className="space-y-1.5">
                <Label htmlFor={tradeInId} className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Minus: Trade-in / Sale Proceeds
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">$</span>
                  <Input
                    id={tradeInId}
                    type="number"
                    min={0}
                    step={500}
                    value={mode2Outlay.tradeInProceedsCad}
                    onChange={(e) =>
                      onMode2OutlayChange({
                        tradeInProceedsCad: Math.max(0, Number(e.target.value) || 0),
                        netOutlayOverride: null,
                      })
                    }
                    className="min-h-[44px] pl-7 text-xs font-medium bg-zinc-50/50 dark:bg-zinc-800/50"
                  />
                </div>
              </div>

              {/* Loan Settlement Balance */}
              <div className="space-y-1.5">
                <Label htmlFor={loanBalanceId} className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Plus: Loan Settlement Balance
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">$</span>
                  <Input
                    id={loanBalanceId}
                    type="number"
                    min={0}
                    step={500}
                    value={mode2Outlay.loanSettlementBalanceCad}
                    onChange={(e) =>
                      onMode2OutlayChange({
                        loanSettlementBalanceCad: Math.max(0, Number(e.target.value) || 0),
                        netOutlayOverride: null,
                      })
                    }
                    className="min-h-[44px] pl-7 text-xs font-medium bg-zinc-50/50 dark:bg-zinc-800/50"
                  />
                </div>
              </div>

              {/* Charger Hardware & Install Cost */}
              <div className="space-y-1.5">
                <Label htmlFor={chargerCostId} className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Plus: Optional Level 2 Charger & Install
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">$</span>
                  <Input
                    id={chargerCostId}
                    type="number"
                    min={0}
                    step={100}
                    value={mode2Outlay.chargerCostCad}
                    onChange={(e) =>
                      onMode2OutlayChange({
                        chargerCostCad: Math.max(0, Number(e.target.value) || 0),
                        netOutlayOverride: null,
                      })
                    }
                    className="min-h-[44px] pl-7 text-xs font-medium bg-zinc-50/50 dark:bg-zinc-800/50"
                  />
                </div>
              </div>

              {/* Government Rebates */}
              <div className="space-y-1.5">
                <Label htmlFor={rebatesId} className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Minus: Eligible Rebates (iZEV / Prov.)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">$</span>
                  <Input
                    id={rebatesId}
                    type="number"
                    min={0}
                    step={500}
                    value={mode2Outlay.rebatesCad}
                    onChange={(e) =>
                      onMode2OutlayChange({
                        rebatesCad: Math.max(0, Number(e.target.value) || 0),
                        netOutlayOverride: null,
                      })
                    }
                    className="min-h-[44px] pl-7 text-xs font-medium bg-zinc-50/50 dark:bg-zinc-800/50"
                  />
                </div>
              </div>

              {/* Authoritative Net Outlay Override */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor={overrideId} className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    Authoritative Net Outlay ($CAD)
                  </Label>
                  {mode2Outlay.netOutlayOverride !== null && (
                    <button
                      type="button"
                      onClick={() => onMode2OutlayChange({ netOutlayOverride: null })}
                      className="text-[11px] text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset to breakdown</span>
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-900 dark:text-zinc-100 font-bold text-xs">$</span>
                  <Input
                    id={overrideId}
                    type="number"
                    min={0}
                    step={500}
                    value={effectiveNetOutlay}
                    onChange={(e) =>
                      onMode2OutlayChange({
                        netOutlayOverride: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    className={`min-h-[44px] pl-7 text-xs font-bold ${
                      mode2Outlay.netOutlayOverride !== null
                        ? 'border-red-500 dark:border-red-500 bg-red-50/30 dark:bg-red-950/20 text-zinc-900 dark:text-zinc-100'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold'
                    }`}
                  />
                </div>
                <p className="text-[10px] text-zinc-500">
                  {mode2Outlay.netOutlayOverride !== null
                    ? `Manual override active (Breakdown: $${calculatedNetOutlay.toLocaleString()})`
                    : `Calculated from breakdown ($${calculatedNetOutlay.toLocaleString()})`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mode 3: New Vehicle A vs. New Vehicle B */}
        {comparisonMode === 'NEW_A_VS_NEW_B' && (
          <div className="space-y-4">
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              Compare two new vehicles with independent purchase prices and delivery dates:
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-zinc-50/60 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800">
              {/* Vehicle A (Reference) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-700/60">
                  <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    A
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Vehicle A (Baseline / Reference)
                  </h4>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-600 dark:text-zinc-400">Model Preset</Label>
                  <select
                    value={mode3Outlay.vehicleAPresetId}
                    onChange={(e) => onMode3OutlayChange({ vehicleAPresetId: e.target.value })}
                    className="w-full min-h-[44px] px-3 py-2 text-xs rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 cursor-pointer"
                  >
                    {NEW_VEHICLE_PRESETS.map((preset) => (
                      <option key={preset.id} value={preset.id}>
                        {preset.name} ({preset.identity.powertrain})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor={vehicleAOutlayId} className="text-xs text-zinc-600 dark:text-zinc-400">
                      Total Cash Price ($CAD)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">$</span>
                      <Input
                        id={vehicleAOutlayId}
                        type="number"
                        min={0}
                        step={500}
                        value={mode3Outlay.vehicleAOutlayCad}
                        onChange={(e) =>
                          onMode3OutlayChange({ vehicleAOutlayCad: Math.max(0, Number(e.target.value) || 0) })
                        }
                        className="min-h-[44px] pl-6 text-xs bg-white dark:bg-zinc-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={vehicleAWaitId} className="text-xs text-zinc-600 dark:text-zinc-400">
                      Delivery Wait (Days)
                    </Label>
                    <Input
                      id={vehicleAWaitId}
                      type="number"
                      min={0}
                      max={1825}
                      step={15}
                      value={mode3Outlay.vehicleAWaitDays}
                      onChange={(e) =>
                        onMode3OutlayChange({ vehicleAWaitDays: Math.max(0, Number(e.target.value) || 0) })
                      }
                      className="min-h-[44px] text-xs bg-white dark:bg-zinc-800"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle B (Target) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-700/60">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-700 dark:text-green-400 flex items-center justify-center text-xs font-bold">
                    B
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-green-700 dark:text-green-400">
                    Vehicle B (Comparison Target)
                  </h4>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-600 dark:text-zinc-400">Model Preset</Label>
                  <select
                    value={mode3Outlay.vehicleBPresetId}
                    onChange={(e) => onMode3OutlayChange({ vehicleBPresetId: e.target.value })}
                    className="w-full min-h-[44px] px-3 py-2 text-xs rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 cursor-pointer"
                  >
                    {NEW_VEHICLE_PRESETS.map((preset) => (
                      <option key={preset.id} value={preset.id}>
                        {preset.name} ({preset.identity.powertrain})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor={vehicleBOutlayId} className="text-xs text-zinc-600 dark:text-zinc-400">
                      Total Cash Price ($CAD)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">$</span>
                      <Input
                        id={vehicleBOutlayId}
                        type="number"
                        min={0}
                        step={500}
                        value={mode3Outlay.vehicleBOutlayCad}
                        onChange={(e) =>
                          onMode3OutlayChange({ vehicleBOutlayCad: Math.max(0, Number(e.target.value) || 0) })
                        }
                        className="min-h-[44px] pl-6 text-xs bg-white dark:bg-zinc-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={vehicleBWaitId} className="text-xs text-zinc-600 dark:text-zinc-400">
                      Delivery Wait (Days)
                    </Label>
                    <Input
                      id={vehicleBWaitId}
                      type="number"
                      min={0}
                      max={1825}
                      step={15}
                      value={mode3Outlay.vehicleBWaitDays}
                      onChange={(e) =>
                        onMode3OutlayChange({ vehicleBWaitDays: Math.max(0, Number(e.target.value) || 0) })
                      }
                      className="min-h-[44px] text-xs bg-white dark:bg-zinc-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

    </div>
  );
}
