'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Gauge, Fuel, Zap } from 'lucide-react';
import { DrivingInputsState } from '@/lib/hooks/useSavingsCalculator';

export interface DrivingInputsCardProps {
  inputs: DrivingInputsState;
  onChange: (patch: Partial<DrivingInputsState>) => void;
  className?: string;
}

export function DrivingInputsCard({
  inputs,
  onChange,
  className,
}: DrivingInputsCardProps) {
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

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Gauge className="w-5 h-5 text-red-600 dark:text-red-500" />
          Driving & Utility Inputs
        </CardTitle>
        <CardDescription>
          Adjust your annual mileage, local gas price, and electricity rate.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 1. Annual Kilometers */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <Label
              htmlFor="annual-km-input"
              className="font-medium text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5"
            >
              Annual Driving Distance (km)
            </Label>
            <div className="w-36">
              <Input
                id="annual-km-input"
                aria-label="Annual driving distance in kilometers"
                type="number"
                min={1000}
                max={100000}
                step={500}
                value={inputs.annualKm}
                onChange={(e) => handleAnnualKmChange(Number(e.target.value))}
                className="min-h-[44px] text-right font-mono font-semibold"
              />
            </div>
          </div>

          <div className="pt-1">
            <input
              id="annual-km-slider"
              aria-label="Annual driving distance slider"
              type="range"
              min={5000}
              max={50000}
              step={1000}
              value={inputs.annualKm}
              onChange={(e) => handleAnnualKmChange(Number(e.target.value))}
              className="w-full min-h-[44px] accent-red-600 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>5,000 km</span>
              <span>20,000 km (Avg)</span>
              <span>50,000 km</span>
            </div>
          </div>

          {/* Quick-select chips */}
          <div className="flex flex-wrap gap-2 pt-1" role="group" aria-label="Quick distance presets">
            {[15000, 20000, 25000, 30000].map((km) => (
              <button
                key={km}
                type="button"
                onClick={() => handleAnnualKmChange(km)}
                className={`min-h-[44px] px-3 py-2 text-xs rounded-md border font-medium transition-colors ${
                  inputs.annualKm === km
                    ? 'border-red-600 bg-red-50 text-red-700 dark:bg-red-950/40 dark:border-red-500 dark:text-red-400'
                    : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {km.toLocaleString()} km
              </button>
            ))}
          </div>
        </div>

        {/* 2. Gasoline Price */}
        <div className="space-y-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between gap-4">
            <Label
              htmlFor="gas-price-input"
              className="font-medium text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5"
            >
              <Fuel className="w-4 h-4 text-amber-600 dark:text-amber-500" />
              Gasoline Price ($ CAD / L)
            </Label>
            <div className="w-36">
              <Input
                id="gas-price-input"
                aria-label="Gasoline price in Canadian dollars per litre"
                type="number"
                min={0.5}
                max={4.0}
                step={0.01}
                value={inputs.gasPricePerL}
                onChange={(e) => handleGasPriceChange(Number(e.target.value))}
                className="min-h-[44px] text-right font-mono font-semibold"
              />
            </div>
          </div>

          <div className="pt-1">
            <input
              id="gas-price-slider"
              aria-label="Gasoline price slider"
              type="range"
              min={1.2}
              max={2.5}
              step={0.01}
              value={inputs.gasPricePerL}
              onChange={(e) => handleGasPriceChange(Number(e.target.value))}
              className="w-full min-h-[44px] accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>$1.20/L</span>
              <span>$1.75/L</span>
              <span>$2.50/L</span>
            </div>
          </div>

          {/* Quick-select chips */}
          <div className="flex flex-wrap gap-2 pt-1" role="group" aria-label="Quick gas price presets">
            {[1.65, 1.75, 1.85, 1.95].map((price) => (
              <button
                key={price}
                type="button"
                onClick={() => handleGasPriceChange(price)}
                className={`min-h-[44px] px-3 py-2 text-xs rounded-md border font-medium transition-colors ${
                  inputs.gasPricePerL === price
                    ? 'border-amber-600 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:border-amber-500 dark:text-amber-300'
                    : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                ${price.toFixed(2)} / L
              </button>
            ))}
          </div>
        </div>

        {/* 3. Electricity Rate */}
        <div className="space-y-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between gap-4">
            <Label
              htmlFor="electricity-rate-input"
              className="font-medium text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
              Electricity Rate ($ CAD / kWh)
            </Label>
            <div className="w-36">
              <Input
                id="electricity-rate-input"
                aria-label="Electricity rate in Canadian dollars per kilowatt hour"
                type="number"
                min={0.05}
                max={0.8}
                step={0.005}
                value={inputs.electricityRatePerKwh}
                onChange={(e) => handleElectricityRateChange(Number(e.target.value))}
                className="min-h-[44px] text-right font-mono font-semibold"
              />
            </div>
          </div>

          <div className="pt-1">
            <input
              id="electricity-rate-slider"
              aria-label="Electricity rate slider"
              type="range"
              min={0.06}
              max={0.3}
              step={0.01}
              value={inputs.electricityRatePerKwh}
              onChange={(e) => handleElectricityRateChange(Number(e.target.value))}
              className="w-full min-h-[44px] accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>$0.06/kWh (QC)</span>
              <span>$0.14/kWh (BC/ON)</span>
              <span>$0.30/kWh</span>
            </div>
          </div>

          {/* Quick province chips */}
          <div className="flex flex-wrap gap-2 pt-1" role="group" aria-label="Provincial electricity rate presets">
            {[
              { label: 'QC ($0.08)', rate: 0.08 },
              { label: 'BC ($0.14)', rate: 0.14 },
              { label: 'ON ($0.15)', rate: 0.15 },
              { label: 'AB ($0.18)', rate: 0.18 },
            ].map((prov) => (
              <button
                key={prov.label}
                type="button"
                onClick={() => handleElectricityRateChange(prov.rate)}
                className={`min-h-[44px] px-3 py-2 text-xs rounded-md border font-medium transition-colors ${
                  inputs.electricityRatePerKwh === prov.rate
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-500 dark:text-emerald-300'
                    : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {prov.label}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
