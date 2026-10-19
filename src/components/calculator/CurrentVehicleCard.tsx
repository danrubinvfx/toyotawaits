'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Car, SlidersHorizontal, Info } from 'lucide-react';
import { TRADE_IN_ARCHETYPES } from '@/data/vehicle-presets';
import { CurrentVehicleState } from '@/lib/hooks/useSavingsCalculator';

export interface CurrentVehicleCardProps {
  currentVehicle: CurrentVehicleState;
  onChange: (patch: Partial<CurrentVehicleState>) => void;
  className?: string;
}

export function CurrentVehicleCard({
  currentVehicle,
  onChange,
  className,
}: CurrentVehicleCardProps) {
  const selectedArchetype = TRADE_IN_ARCHETYPES.find(
    (a) => a.id === currentVehicle.archetypeId
  );

  return (
    <Card className={`border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm ${className ?? ''}`}>
      <CardHeader className="p-3 sm:p-4 pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Car className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            Current Vehicle Baseline
          </CardTitle>
          <Badge variant="outline" className="text-xs font-mono font-medium">
            {currentVehicle.mode === 'ARCHETYPE'
              ? `${selectedArchetype?.consumption.combinedL100km ?? 9.5} L/100km`
              : `${currentVehicle.customL100km.toFixed(1)} L/100km`}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Choose a typical archetype or enter measured fuel consumption.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 space-y-3.5">
        {/* Mode Toggle Buttons (min 44px height) */}
        <div
          role="tablist"
          aria-label="Current vehicle input mode"
          className="grid grid-cols-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg gap-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={currentVehicle.mode === 'ARCHETYPE'}
            onClick={() => onChange({ mode: 'ARCHETYPE' })}
            className={`min-h-[44px] px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
              currentVehicle.mode === 'ARCHETYPE'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            Select Archetype
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={currentVehicle.mode === 'CUSTOM'}
            onClick={() => onChange({ mode: 'CUSTOM' })}
            className={`min-h-[44px] px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
              currentVehicle.mode === 'CUSTOM'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Custom L/100km
          </button>
        </div>

        {/* Tab 1: Archetype Selector */}
        {currentVehicle.mode === 'ARCHETYPE' && (
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold">
              Select Vehicle Archetype
            </Label>
            <div className="grid gap-2" role="radiogroup" aria-label="Vehicle archetype choices">
              {TRADE_IN_ARCHETYPES.map((archetype) => {
                const isSelected = currentVehicle.archetypeId === archetype.id;
                return (
                  <button
                    key={archetype.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => onChange({ archetypeId: archetype.id })}
                    className={`min-h-[44px] w-full text-left p-2.5 sm:p-3 rounded-lg border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50/80 dark:bg-zinc-800/60 ring-1 ring-zinc-900 dark:ring-zinc-100'
                        : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-600'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                        {archetype.name.replace('Trade-in Archetype: ', '')}
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate max-w-[180px] sm:max-w-none">
                        {archetype.notes}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-block font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {archetype.consumption.combinedL100km}
                      </span>
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">L/100km</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pt-2 text-xs text-zinc-500 dark:text-zinc-400">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>
                Historical 5-cycle ratings sourced from Natural Resources Canada (NRCan).
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Custom L/100km */}
        {currentVehicle.mode === 'CUSTOM' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <Label
                htmlFor="custom-l100km-input"
                className="font-medium text-sm text-zinc-900 dark:text-zinc-100"
              >
                Measured Fuel Consumption (L/100km)
              </Label>
              <div className="w-32">
                <Input
                  id="custom-l100km-input"
                  aria-label="Custom fuel consumption in litres per 100 kilometers"
                  type="number"
                  min={2.0}
                  max={35.0}
                  step={0.1}
                  value={currentVehicle.customL100km}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (Number.isFinite(val) && val >= 0) {
                      onChange({ customL100km: val });
                    }
                  }}
                  className="h-9 min-h-[44px] text-sm text-right font-mono font-semibold"
                />
              </div>
            </div>

            <div className="pt-1">
              <input
                id="custom-l100km-slider"
                aria-label="Custom fuel consumption slider"
                type="range"
                min={4.0}
                max={22.0}
                step={0.1}
                value={currentVehicle.customL100km}
                onChange={(e) => onChange({ customL100km: Number(e.target.value) })}
                className="w-full min-h-[44px] accent-zinc-800 dark:accent-zinc-200 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>4.0 L (Compact)</span>
                <span>9.5 L (Crossover)</span>
                <span>22.0 L (V8/HD)</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1" role="group" aria-label="Typical benchmark presets">
              {[
                { label: 'Compact Car (7.5L)', val: 7.5 },
                { label: 'Midsize SUV (10.5L)', val: 10.5 },
                { label: 'V8 Truck (14.0L)', val: 14.0 },
              ].map((bench) => (
                <button
                  key={bench.label}
                  type="button"
                  onClick={() => onChange({ customL100km: bench.val })}
                  className={`min-h-[44px] px-3 py-2 text-xs rounded-md border font-medium transition-colors ${
                    currentVehicle.customL100km === bench.val
                      ? 'border-zinc-900 bg-zinc-100 text-zinc-900 dark:border-zinc-100 dark:bg-zinc-800 dark:text-zinc-100'
                      : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {bench.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
