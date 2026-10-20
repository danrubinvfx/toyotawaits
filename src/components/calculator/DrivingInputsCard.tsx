'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Gauge, Fuel, Zap } from 'lucide-react';
import { DrivingInputsState } from '@/lib/hooks/useSavingsCalculator';

export interface DrivingInputsCardProps {
  inputs: DrivingInputsState;
  onChange: (patch: Partial<DrivingInputsState>) => void;
  className?: string;
  isPhev?: boolean;
}

export function DrivingInputsCard({
  inputs,
  onChange,
  className,
  isPhev = true,
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
    <Card className={`border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-4 ${className ?? ''}`}>
      <CardHeader className="p-0 pb-2.5 border-b border-zinc-100 dark:border-zinc-800/60">
        <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
          <Gauge className="w-4 h-4 text-red-600 dark:text-red-500" />
          Driving & Utility Inputs
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 pt-3 space-y-3">
        {/* 1. Distance */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 w-24 shrink-0">
              <Gauge className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
              <Label htmlFor="annual-km-input" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer">
                Distance
              </Label>
            </div>
            <div className="flex-1 px-1">
              <input
                id="annual-km-slider"
                aria-label="Annual driving distance slider"
                type="range"
                min={5000}
                max={50000}
                step={1000}
                value={inputs.annualKm}
                onChange={(e) => handleAnnualKmChange(Number(e.target.value))}
                className="w-full h-1.5 accent-red-600 cursor-pointer"
              />
            </div>
            <div className="w-20 shrink-0">
              <Input
                id="annual-km-input"
                aria-label="Annual driving distance in kilometers"
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
          <div className="flex items-center justify-end gap-1 pt-0.5" role="group" aria-label="Quick distance presets">
            {[
              { label: '15k', val: 15000, aria: '15,000 km' },
              { label: '20k', val: 20000, aria: '20,000 km' },
              { label: '25k', val: 25000, aria: '25,000 km' },
              { label: '30k', val: 30000, aria: '30,000 km' },
            ].map((item) => (
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

        {/* 2. Gas Price */}
        <div className="space-y-1 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 w-24 shrink-0">
              <Fuel className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500 shrink-0" />
              <Label htmlFor="gas-price-input" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer">
                Gas Price
              </Label>
            </div>
            <div className="flex-1 px-1">
              <input
                id="gas-price-slider"
                aria-label="Gasoline price slider"
                type="range"
                min={1.2}
                max={2.5}
                step={0.01}
                value={inputs.gasPricePerL}
                onChange={(e) => handleGasPriceChange(Number(e.target.value))}
                className="w-full h-1.5 accent-amber-600 cursor-pointer"
              />
            </div>
            <div className="w-20 shrink-0">
              <Input
                id="gas-price-input"
                aria-label="Gasoline price in Canadian dollars per litre"
                type="number"
                min={0.5}
                max={4.0}
                step={0.01}
                value={inputs.gasPricePerL}
                onChange={(e) => handleGasPriceChange(Number(e.target.value))}
                className="w-20 h-8 min-h-[44px] sm:min-h-0 text-sm text-right font-mono font-semibold px-2 py-1"
              />
            </div>
          </div>

          {/* Micro-pills */}
          <div className="flex items-center justify-end gap-1 pt-0.5" role="group" aria-label="Quick gas price presets">
            {[1.65, 1.75, 1.85, 1.95].map((price) => (
              <button
                key={price}
                type="button"
                aria-label={`$${price.toFixed(2)} / L`}
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

        {/* 3. Power Rate (PHEV Only) */}
        {isPhev && (
          <div className="space-y-1 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 w-24 shrink-0">
                <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500 shrink-0" />
                <Label htmlFor="electricity-rate-input" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer">
                  Power Rate
                </Label>
              </div>
              <div className="flex-1 px-1">
                <input
                  id="electricity-rate-slider"
                  aria-label="Electricity rate slider"
                  type="range"
                  min={0.06}
                  max={0.3}
                  step={0.01}
                  value={inputs.electricityRatePerKwh}
                  onChange={(e) => handleElectricityRateChange(Number(e.target.value))}
                  className="w-full h-1.5 accent-emerald-600 cursor-pointer"
                />
              </div>
              <div className="w-20 shrink-0">
                <Input
                  id="electricity-rate-input"
                  aria-label="Electricity rate in Canadian dollars per kilowatt hour"
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
            <div className="flex items-center justify-end gap-1 pt-0.5" role="group" aria-label="Provincial electricity rate presets">
              {[
                { label: 'QC ($0.08)', rate: 0.08 },
                { label: 'BC ($0.14)', rate: 0.14 },
                { label: 'ON ($0.15)', rate: 0.15 },
                { label: 'AB ($0.18)', rate: 0.18 },
              ].map((prov) => (
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
