'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Car, SlidersHorizontal, Fuel } from 'lucide-react';
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

  const activeRating =
    currentVehicle.mode === 'ARCHETYPE'
      ? selectedArchetype?.consumption.combinedL100km ?? 9.5
      : currentVehicle.customL100km;

  return (
    <Card className={`border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-4 ${className ?? ''}`}>
      <CardHeader className="p-0 pb-2.5 border-b border-zinc-100 dark:border-zinc-800/60">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <Car className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            Current Vehicle Baseline
          </CardTitle>
          <Badge variant="outline" className="text-[10px] font-mono font-medium py-0">
            {activeRating.toFixed(1)} L/100km • NRCan
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0 pt-3 space-y-3">
        {/* Compact Mode Toggle Tabs */}
        <div
          role="tablist"
          aria-label="Current vehicle input mode"
          className="grid grid-cols-2 p-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg gap-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={currentVehicle.mode === 'ARCHETYPE'}
            onClick={() => onChange({ mode: 'ARCHETYPE' })}
            className={`py-1 px-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
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
            className={`py-1 px-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              currentVehicle.mode === 'CUSTOM'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Custom L/100km
          </button>
        </div>

        {/* Option 1: Compact Archetype List */}
        {currentVehicle.mode === 'ARCHETYPE' && (
          <div className="space-y-1.5" role="radiogroup" aria-label="Vehicle archetype choices">
            {TRADE_IN_ARCHETYPES.map((archetype) => {
              const isSelected = currentVehicle.archetypeId === archetype.id;
              const cleanName = archetype.name.replace('Trade-in Archetype: ', '');
              return (
                <button
                  key={archetype.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`${cleanName} (${archetype.consumption.combinedL100km} L/100km)`}
                  onClick={() => onChange({ archetypeId: archetype.id })}
                  className={`w-full text-left py-1.5 px-2.5 rounded-lg border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/80 ring-1 ring-zinc-900 dark:ring-zinc-100'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                    {cleanName}
                  </span>
                  <span className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300 shrink-0">
                    {archetype.consumption.combinedL100km} L/100km
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Option 2: Custom L/100km Single Row */}
        {currentVehicle.mode === 'CUSTOM' && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 w-24 shrink-0">
                <Fuel className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
                <Label htmlFor="custom-l100km-input" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer">
                  Consumption
                </Label>
              </div>
              <div className="flex-1 px-1">
                <input
                  id="custom-l100km-slider"
                  aria-label="Custom fuel consumption slider"
                  type="range"
                  min={4.0}
                  max={22.0}
                  step={0.1}
                  value={currentVehicle.customL100km}
                  onChange={(e) => onChange({ customL100km: Number(e.target.value) })}
                  className="w-full h-1.5 accent-zinc-800 dark:accent-zinc-200 cursor-pointer"
                />
              </div>
              <div className="w-20 shrink-0">
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
                  className="w-20 h-8 min-h-[44px] sm:min-h-0 text-sm text-right font-mono font-semibold px-2 py-1"
                />
              </div>
            </div>

            {/* Micro-pills */}
            <div className="flex items-center justify-end gap-1 pt-0.5" role="group" aria-label="Typical benchmark presets">
              {[
                { label: 'Compact (7.5L)', val: 7.5 },
                { label: 'Midsize (10.5L)', val: 10.5 },
                { label: 'Truck (14.0L)', val: 14.0 },
              ].map((bench) => (
                <button
                  key={bench.label}
                  type="button"
                  onClick={() => onChange({ customL100km: bench.val })}
                  className={`text-xs py-0.5 px-2 rounded-full border transition-colors cursor-pointer ${
                    currentVehicle.customL100km === bench.val
                      ? 'border-zinc-900 bg-zinc-100 text-zinc-900 dark:border-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 font-semibold'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 text-zinc-600 dark:text-zinc-400'
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
