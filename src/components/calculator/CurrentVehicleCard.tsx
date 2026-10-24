'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Car, SlidersHorizontal, Fuel } from 'lucide-react';
import { TRADE_IN_ARCHETYPES } from '@/data/vehicle-presets';
import { CurrentVehicleState } from '@/lib/hooks/useSavingsCalculator';
import { UnitSystem } from '@/types/calculator';

export interface CurrentVehicleCardProps {
  currentVehicle: CurrentVehicleState;
  onChange: (patch: Partial<CurrentVehicleState>) => void;
  className?: string;
  unitSystem?: UnitSystem;
}

export function CurrentVehicleCard({
  currentVehicle,
  onChange,
  className,
  unitSystem = 'METRIC',
}: CurrentVehicleCardProps) {
  const isImp = unitSystem === 'IMPERIAL';
  const selectedArchetype = TRADE_IN_ARCHETYPES.find(
    (a) => a.id === currentVehicle.archetypeId
  );

  const activeRating =
    currentVehicle.mode === 'ARCHETYPE'
      ? (isImp ? selectedArchetype?.consumption.combinedMpg ?? 25 : selectedArchetype?.consumption.combinedL100km ?? 9.5)
      : currentVehicle.customL100km;

  return (
    <Card className={`border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-1.5 sm:p-4 ${className ?? ''}`}>
      <CardHeader className="p-0 pb-1 sm:pb-2.5 border-b border-zinc-100 dark:border-zinc-800/60">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-xs sm:text-base font-bold flex items-center gap-1.5 sm:gap-2 text-zinc-900 dark:text-zinc-100">
            <Car className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-700 dark:text-zinc-300" />
            Current Vehicle Baseline
          </CardTitle>
          <Badge variant="outline" className="text-[10px] font-mono font-medium py-0">
            {activeRating.toFixed(1)} {isImp ? 'MPG • EPA' : 'L/100km • NRCan'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0 pt-1.5 sm:pt-3 space-y-1.5 sm:space-y-3">
        {/* Mobile Inline Segmented Buttons (Row 2) */}
        <div className="sm:hidden grid grid-cols-4 gap-1 p-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          <button
            type="button"
            onClick={() => onChange({ mode: 'ARCHETYPE', archetypeId: 'archetype-compact-crossover-awd' })}
            className={`text-[10px] py-1 px-1 rounded-md font-medium transition-all text-center truncate ${
              currentVehicle.mode === 'ARCHETYPE' && currentVehicle.archetypeId === 'archetype-compact-crossover-awd'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            {isImp ? 'Crossover 25' : 'Crossover 9.5L'}
          </button>
          <button
            type="button"
            onClick={() => onChange({ mode: 'ARCHETYPE', archetypeId: 'archetype-sedan-gas' })}
            className={`text-[10px] py-1 px-1 rounded-md font-medium transition-all text-center truncate ${
              currentVehicle.mode === 'ARCHETYPE' && currentVehicle.archetypeId === 'archetype-sedan-gas'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            {isImp ? 'Sedan 30' : 'Sedan 8.2L'}
          </button>
          <button
            type="button"
            onClick={() => onChange({ mode: 'ARCHETYPE', archetypeId: 'archetype-truck-gas' })}
            className={`text-[10px] py-1 px-1 rounded-md font-medium transition-all text-center truncate ${
              currentVehicle.mode === 'ARCHETYPE' && currentVehicle.archetypeId === 'archetype-truck-gas'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            {isImp ? 'Truck 18' : 'Truck 13.5L'}
          </button>
          <button
            type="button"
            onClick={() => onChange({ mode: 'CUSTOM' })}
            className={`text-[10px] py-1 px-1 rounded-md font-medium transition-all text-center truncate ${
              currentVehicle.mode === 'CUSTOM'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            Custom
          </button>
        </div>

        {/* Desktop Mode Toggle Tabs */}
        <div
          role="tablist"
          aria-label="Current vehicle input mode"
          className="hidden sm:grid grid-cols-2 p-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg gap-1"
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
            {isImp ? 'Custom MPG' : 'Custom L/100km'}
          </button>
        </div>

        {/* Option 1: Segmented Archetype Chips (2-column micro-grid on desktop) */}
        {currentVehicle.mode === 'ARCHETYPE' && (
          <div className="hidden sm:grid grid-cols-2 gap-1.5" role="radiogroup" aria-label="Vehicle archetype choices">
            {TRADE_IN_ARCHETYPES.map((archetype) => {
              const isSelected = currentVehicle.archetypeId === archetype.id;
              const cleanName = archetype.name.replace('Trade-in Archetype: ', '');
              const shortLabel = cleanName
                .replace('Compact Crossover AWD', 'Crossover')
                .replace('Mid-Size Sedan', 'Sedan')
                .replace('Full-Size Truck', 'Truck')
                .replace('Minivan', 'Minivan');

              const archetypeRatingStr = isImp
                ? `${archetype.consumption.combinedMpg ?? 25} MPG`
                : `${archetype.consumption.combinedL100km} L/100km`;

              return (
                <button
                  key={archetype.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`${cleanName} (${archetypeRatingStr})`}
                  onClick={() => onChange({ archetypeId: archetype.id })}
                  className={`text-left py-1 px-2 rounded-md border transition-all flex items-center justify-between gap-1 cursor-pointer ${
                    isSelected
                      ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800 ring-1 ring-zinc-900 dark:ring-zinc-100 font-semibold text-zinc-900 dark:text-zinc-100'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <span className="text-xs truncate">
                    <span className="sm:hidden">{shortLabel}</span>
                    <span className="hidden sm:inline">{cleanName}</span>
                  </span>
                  <span className="font-mono text-[11px] font-bold text-zinc-600 dark:text-zinc-400 shrink-0">
                    {isImp ? `${archetype.consumption.combinedMpg ?? 25} MPG` : `${archetype.consumption.combinedL100km}L`}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Option 2: Custom Fuel Economy Single Row */}
        {currentVehicle.mode === 'CUSTOM' && (
          <div className="space-y-1.5 sm:space-y-2 pt-0.5 sm:pt-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 sm:gap-1.5 sm:w-24 shrink-0">
                <Fuel className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
                <Label htmlFor="custom-l100km-input" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer">
                  {isImp ? 'MPG' : 'Consumption'}
                </Label>
              </div>
              <div className="flex-1 px-1">
                <input
                  id="custom-l100km-slider"
                  aria-label={isImp ? "Custom fuel economy slider" : "Custom fuel consumption slider"}
                  type="range"
                  min={isImp ? 10.0 : 4.0}
                  max={isImp ? 60.0 : 22.0}
                  step={isImp ? 1.0 : 0.1}
                  value={currentVehicle.customL100km}
                  onChange={(e) => onChange({ customL100km: Number(e.target.value) })}
                  className="w-full h-1.5 accent-zinc-800 dark:accent-zinc-200 cursor-pointer"
                />
              </div>
              <div className="w-16 sm:w-20 shrink-0">
                <Input
                  id="custom-l100km-input"
                  aria-label={isImp ? "Custom vehicle fuel economy in MPG" : "Custom fuel consumption in litres per 100 kilometers"}
                  type="number"
                  min={isImp ? 5.0 : 2.0}
                  max={isImp ? 90.0 : 35.0}
                  step={isImp ? 1.0 : 0.1}
                  value={currentVehicle.customL100km}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (Number.isFinite(val) && val >= 0) {
                      onChange({ customL100km: val });
                    }
                  }}
                  className="w-16 sm:w-20 h-7 sm:h-8 min-h-0 text-xs sm:text-sm text-right font-mono font-semibold px-2 py-0.5 sm:py-1"
                />
              </div>
            </div>

            {/* Micro-pills */}
            <div className="hidden sm:flex items-center justify-end gap-1 pt-0.5" role="group" aria-label="Typical benchmark presets">
              {(isImp
                ? [
                    { label: 'Compact (31 MPG)', val: 31 },
                    { label: 'Midsize (25 MPG)', val: 25 },
                    { label: 'Truck (18 MPG)', val: 18 },
                  ]
                : [
                    { label: 'Compact (7.5L)', val: 7.5 },
                    { label: 'Midsize (10.5L)', val: 10.5 },
                    { label: 'Truck (14.0L)', val: 14.0 },
                  ]
              ).map((bench) => (
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
