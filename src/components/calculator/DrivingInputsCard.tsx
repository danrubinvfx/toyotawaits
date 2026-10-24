'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Gauge, Fuel, Zap } from 'lucide-react';
import { DrivingInputsState } from '@/lib/hooks/useSavingsCalculator';
import { UnitSystem } from '@/types/calculator';

export interface DrivingInputsCardProps {
  inputs: DrivingInputsState;
  onChange: (patch: Partial<DrivingInputsState>) => void;
  className?: string;
  isPhev?: boolean;
  unitSystem?: UnitSystem;
}

export function DrivingInputsCard({
  inputs,
  onChange,
  className,
  isPhev = true,
  unitSystem = 'METRIC',
}: DrivingInputsCardProps) {
  const isImp = unitSystem === 'IMPERIAL';

  const handleAnnualKmChange = (val: number) => {
    if (!Number.isFinite(val) || val < 0) return;
    onChange({ annualKm: val });
  };

  const handleGasPriceChange = (val: number) => {
    if (!Number.isFinite(val) || val < 0) return;
    onChange({ gasPricePerL: val });
  };

  const handleElectricityRateChange = (val: number) => {
    if (!Number.isFinite(val) || val < 0) return;
    onChange({ electricityRatePerKwh: val });
  };

  const distancePresets = isImp
    ? [
        { label: '10k', val: 10000, aria: '10,000 miles' },
        { label: '12k', val: 12000, aria: '12,000 miles' },
        { label: '15k', val: 15000, aria: '15,000 miles' },
        { label: '20k', val: 20000, aria: '20,000 miles' },
      ]
    : [
        { label: '15k', val: 15000, aria: '15,000 km' },
        { label: '20k', val: 20000, aria: '20,000 km' },
        { label: '25k', val: 25000, aria: '25,000 km' },
        { label: '30k', val: 30000, aria: '30,000 km' },
      ];

  const gasPresets = isImp ? [3.15, 3.45, 3.75, 4.05] : [1.65, 1.75, 1.85, 1.95];

  const electricityPresets = isImp
    ? [
        { label: 'TX ($0.14)', rate: 0.14 },
        { label: 'FL ($0.15)', rate: 0.15 },
        { label: 'CA ($0.30)', rate: 0.30 },
        { label: 'WA ($0.11)', rate: 0.11 },
      ]
    : [
        { label: 'QC ($0.08)', rate: 0.08 },
        { label: 'BC ($0.14)', rate: 0.14 },
        { label: 'ON ($0.15)', rate: 0.15 },
        { label: 'AB ($0.18)', rate: 0.18 },
      ];

  return (
    <Card className={`border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-1.5 sm:p-4 ${className ?? ''}`}>
      <CardHeader className="p-0 pb-1 sm:pb-2.5 border-b border-zinc-100 dark:border-zinc-800/60">
        <CardTitle className="text-xs sm:text-base font-bold flex items-center gap-1.5 sm:gap-2 text-zinc-900 dark:text-zinc-100">
          <Gauge className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 dark:text-red-500" />
          Driving & Utility Inputs
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 pt-1.5 sm:pt-3 space-y-1.5 sm:space-y-3">
        {/* Row 3: 2-column grid on mobile (<sm), stacked rows on desktop (sm+) */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 sm:gap-3">
          {/* Col 1: Distance */}
          <div className="space-y-1">
            <div className="flex items-center justify-between sm:justify-start sm:gap-2">
              <div className="flex items-center gap-1 sm:gap-1.5 sm:w-24 shrink-0">
                <Gauge className="w-3.5 h-3.5 text-red-600 dark:text-red-500 shrink-0" />
                <Label htmlFor="annual-km-input" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer">
                  {isImp ? 'Distance' : 'Distance'}
                </Label>
              </div>

              {/* Mobile Inline Value Badge */}
              <div className="sm:hidden font-mono text-[10px] font-bold text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800/80 px-1 py-0.5 rounded">
                {inputs.annualKm >= 1000 ? `${(inputs.annualKm / 1000).toFixed(0)}k` : inputs.annualKm} {isImp ? 'mi' : 'km'}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1">
                <input
                  id="annual-km-slider"
                  aria-label="Annual driving distance slider"
                  type="range"
                  min={isImp ? 3000 : 5000}
                  max={50000}
                  step={1000}
                  value={inputs.annualKm}
                  onChange={(e) => handleAnnualKmChange(Number(e.target.value))}
                  className="w-full h-1.5 accent-red-600 cursor-pointer"
                />
              </div>
              <div className="hidden sm:block w-20 shrink-0">
                <Input
                  id="annual-km-input"
                  aria-label={isImp ? "Annual driving distance in miles" : "Annual driving distance in kilometers"}
                  type="number"
                  min={1000}
                  max={100000}
                  step={500}
                  value={inputs.annualKm}
                  onChange={(e) => handleAnnualKmChange(Number(e.target.value))}
                  className="w-20 h-8 min-h-[44px] sm:min-h-0 text-sm text-right font-mono font-semibold px-2 py-1"
                />
              </div>
            </div>

            {/* Micro-pills */}
            <div className="hidden sm:flex items-center justify-end gap-1 pt-0.5" role="group" aria-label="Quick distance presets">
              {distancePresets.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  aria-label={item.aria}
                  onClick={() => handleAnnualKmChange(item.val)}
                  className={`text-xs py-0.5 px-2 rounded-full border transition-colors cursor-pointer ${
                    inputs.annualKm === item.val
                      ? 'border-red-600 bg-red-500/10 text-red-600 dark:text-red-400 font-semibold'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Col 2: Fuel Price */}
          <div className="space-y-1 sm:pt-2 sm:border-t sm:border-zinc-100 sm:dark:border-zinc-800/60">
            <div className="flex items-center justify-between sm:justify-start sm:gap-2">
              <div className="flex items-center gap-1 sm:gap-1.5 sm:w-24 shrink-0">
                <Fuel className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500 shrink-0" />
                <Label htmlFor="gas-price-input" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer">
                  {isImp ? 'Gas' : 'Gas Price'}
                </Label>
              </div>

              {/* Mobile Inline Value Badge */}
              <div className="sm:hidden font-mono text-[10px] font-bold text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800/80 px-1 py-0.5 rounded">
                ${inputs.gasPricePerL.toFixed(2)}{isImp ? '/gal' : '/L'}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1">
                <input
                  id="gas-price-slider"
                  aria-label="Gasoline price slider"
                  type="range"
                  min={isImp ? 2.0 : 1.2}
                  max={isImp ? 6.0 : 2.5}
                  step={0.01}
                  value={inputs.gasPricePerL}
                  onChange={(e) => handleGasPriceChange(Number(e.target.value))}
                  className="w-full h-1.5 accent-amber-600 cursor-pointer"
                />
              </div>
              <div className="hidden sm:block w-20 shrink-0">
                <Input
                  id="gas-price-input"
                  aria-label={isImp ? "Gasoline price in US dollars per gallon" : "Gasoline price in Canadian dollars per litre"}
                  type="number"
                  min={0.5}
                  max={10.0}
                  step={0.01}
                  value={inputs.gasPricePerL}
                  onChange={(e) => handleGasPriceChange(Number(e.target.value))}
                  className="w-20 h-8 min-h-[44px] sm:min-h-0 text-sm text-right font-mono font-semibold px-2 py-1"
                />
              </div>
            </div>

            {/* Micro-pills */}
            <div className="hidden sm:flex items-center justify-end gap-1 pt-0.5" role="group" aria-label="Quick gas price presets">
              {gasPresets.map((price) => (
                <button
                  key={price}
                  type="button"
                  aria-label={`$${price.toFixed(2)} ${isImp ? '/ gal' : '/ L'}`}
                  onClick={() => handleGasPriceChange(price)}
                  className={`text-xs py-0.5 px-2 rounded-full border transition-colors cursor-pointer ${
                    inputs.gasPricePerL === price
                      ? 'border-amber-600 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  ${price.toFixed(2)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Power Rate (PHEV Only - Strictly Hidden unless PHEV is selected) */}
        {isPhev && (
          <div className="space-y-1 pt-1.5 sm:pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
            <div className="flex items-center justify-between sm:justify-start sm:gap-2">
              <div className="flex items-center gap-1 sm:gap-1.5 sm:w-24 shrink-0">
                <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500 shrink-0" />
                <Label htmlFor="electricity-rate-input" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer">
                  Power Rate
                </Label>
              </div>

              {/* Mobile Inline Value Badge */}
              <div className="sm:hidden font-mono text-[10px] font-bold text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800/80 px-1 py-0.5 rounded">
                ${inputs.electricityRatePerKwh.toFixed(2)}/kWh
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1">
                <input
                  id="electricity-rate-slider"
                  aria-label="Electricity rate slider"
                  type="range"
                  min={0.06}
                  max={0.4}
                  step={0.01}
                  value={inputs.electricityRatePerKwh}
                  onChange={(e) => handleElectricityRateChange(Number(e.target.value))}
                  className="w-full h-1.5 accent-emerald-600 cursor-pointer"
                />
              </div>
              <div className="hidden sm:block w-20 shrink-0">
                <Input
                  id="electricity-rate-input"
                  aria-label={isImp ? "Electricity rate in US dollars per kilowatt hour" : "Electricity rate in Canadian dollars per kilowatt hour"}
                  type="number"
                  min={0.05}
                  max={0.8}
                  step={0.005}
                  value={inputs.electricityRatePerKwh}
                  onChange={(e) => handleElectricityRateChange(Number(e.target.value))}
                  className="w-20 h-8 min-h-[44px] sm:min-h-0 text-sm text-right font-mono font-semibold px-2 py-1"
                />
              </div>
            </div>

            {/* Micro-pills */}
            <div className="hidden sm:flex items-center justify-end gap-1 pt-0.5" role="group" aria-label="Electricity rate presets">
              {electricityPresets.map((prov) => (
                <button
                  key={prov.label}
                  type="button"
                  aria-label={prov.label}
                  onClick={() => handleElectricityRateChange(prov.rate)}
                  className={`text-xs py-0.5 px-2 rounded-full border transition-colors cursor-pointer ${
                    inputs.electricityRatePerKwh === prov.rate
                      ? 'border-emerald-600 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {prov.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
