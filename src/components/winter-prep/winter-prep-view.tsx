'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Snowflake,
  BatteryCharging,
  ShieldAlert,
  Wind,
  Car,
  Clock,
  Wrench,
  ArrowRight,
  Flame,
  Disc3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { WinterGuide } from '@/components/winter-prep/winter-guide';
import { WinterModelKey } from '@/data/winter-prep';

export interface WinterVehicleOption {
  id: WinterModelKey;
  label: string;
  name: string;
  badge: string;
}

export const WINTER_VEHICLE_OPTIONS: WinterVehicleOption[] = [
  {
    id: 'rav4',
    label: 'RAV4 (Hybrid / Prime)',
    name: 'Toyota RAV4',
    badge: 'Popular HEV/PHEV',
  },
  {
    id: 'grand-highlander',
    label: 'Grand Highlander',
    name: 'Toyota Grand Highlander',
    badge: '3-Row SUV',
  },
  {
    id: 'sienna',
    label: 'Sienna',
    name: 'Toyota Sienna',
    badge: 'AWD Minivan',
  },
  {
    id: 'prius-prime',
    label: 'Prius Prime',
    name: 'Toyota Prius Prime',
    badge: 'Plug-in Hybrid',
  },
  {
    id: 'corolla-cross',
    label: 'Corolla Cross',
    name: 'Toyota Corolla Cross',
    badge: 'Compact Utility',
  },
  {
    id: 'tacoma',
    label: 'Tacoma',
    name: 'Toyota Tacoma',
    badge: 'i-FORCE MAX Truck',
  },
];

export function WinterPrepView() {
  const [selectedModel, setSelectedModel] = useState<WinterModelKey>('rav4');

  const activeVehicle =
    WINTER_VEHICLE_OPTIONS.find((v) => v.id === selectedModel) ||
    WINTER_VEHICLE_OPTIONS[0];

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 py-12 sm:py-16 dark:border-zinc-800 text-white rounded-2xl mx-4 sm:mx-0 shadow-xl">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 text-center space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-400">
            <Snowflake className="h-3.5 w-3.5 text-cyan-400" />
            <span>🇨🇦 Canadian Winter Survival Playbook</span>
            <span className="text-zinc-600">•</span>
            <span>Sub-Zero Rated (-30°C)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Canadian Winter Delivery &amp; Cold-Weather Survival Guide
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Taking winter delivery of a Canadian Toyota? Sub-zero temperatures, corrosive road salt,
            and freezing rain demand model-specific prep. Learn exact 12V hybrid jump procedures,
            critical rear seat battery vent clearances, and windshield freeze defense.
          </p>

          {/* Quick Realities Ticker */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-3xl mx-auto pt-6 border-t border-zinc-800/80 text-left">
            <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80 flex items-start gap-2.5">
              <BatteryCharging className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs text-zinc-100">12V Battery Drop</p>
                <p className="text-[11px] text-zinc-400 leading-snug">
                  Cold drops 12V voltage below the 10.5V relay trigger threshold, leaving hybrids unstartable.
                </p>
              </div>
            </div>

            <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80 flex items-start gap-2.5">
              <ShieldAlert className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs text-zinc-100">Salt &amp; Slush Armor</p>
                <p className="text-[11px] text-zinc-400 leading-snug">
                  High-wall mats prevent salt crust while preserving rear seat HV cooling fan airflow.
                </p>
              </div>
            </div>

            <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80 flex items-start gap-2.5">
              <Wind className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs text-zinc-100">Freezing Rain Defense</p>
                <p className="text-[11px] text-zinc-400 leading-snug">
                  Why full car covers freeze to clear coats, and how flap frost shields save wipers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Canadian Tire Guide Cross-Link Callout Banner */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div
          data-testid="winter-prep-tire-callout"
          className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs"
        >
          <div className="flex items-center gap-2.5 text-zinc-200">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <Disc3 className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-zinc-100 text-xs sm:text-sm">
                Need certified 3PMSF winter tires or year-round all-weather rubber?
              </p>
              <p className="text-zinc-400 text-[11px] sm:text-xs">
                Check model-specific OEM tire sizes, wheel downsizing advice, and Amazon.ca reviews.
              </p>
            </div>
          </div>

          <Button
            asChild
            size="sm"
            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs h-8 gap-1.5 shrink-0 self-end sm:self-center cursor-pointer shadow-xs"
          >
            <Link href="/tires">
              <span>View Canadian Tire Guide 🛞 →</span>
            </Link>
          </Button>
        </div>
      </section>

      {/* 3. Interactive Vehicle Selector (Sticky / Top-Level) */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-6">
        <div className="sticky top-16 z-30 bg-zinc-950/95 backdrop-blur-md py-3 -mx-4 px-4 sm:mx-0 sm:px-3 border-y sm:border sm:rounded-xl border-zinc-800 shadow-md">
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-zinc-400 pl-2 shrink-0">
              <Car className="h-4 w-4 text-cyan-400" />
              <span>Select Vehicle:</span>
            </div>

            {/* Horizontal Scrollable Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full sm:w-auto flex-1">
              {WINTER_VEHICLE_OPTIONS.map((option) => {
                const isSelected = selectedModel === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedModel(option.id)}
                    aria-pressed={isSelected}
                    className={cn(
                      'inline-flex items-center whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer shrink-0',
                      isSelected
                        ? 'bg-cyan-500 text-zinc-950 shadow-sm font-bold scale-[1.02]'
                        : 'bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800/60'
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. Model-Specific Winter Prep Guide Cards */}
        <WinterGuide modelKey={activeVehicle.id} />
      </section>

      {/* 4. Cross-Navigation & Action Footer */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 pt-4">
        <Card className="border-zinc-800 bg-zinc-900/60 shadow-lg overflow-hidden">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="text-center sm:text-left space-y-1">
              <h3 className="text-lg sm:text-xl font-bold text-zinc-100 flex items-center justify-center sm:justify-start gap-2">
                <Flame className="h-5 w-5 text-amber-500" />
                Next Steps for Canadian Toyota Buyers
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400">
                Continue planning your delivery timeline or browse verified trim DIY mods and accessories.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/#estimator"
                className="group flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-950/70 hover:border-amber-500/40 hover:bg-zinc-950 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-zinc-100 group-hover:text-amber-400 transition-colors">
                      Delivery Timeline Calculator
                    </p>
                    <p className="text-xs text-zinc-400">
                      Check real-world wait times by province, trim, and powertrain.
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0" />
              </Link>

              <Link
                href="/mods"
                className="group flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-950/70 hover:border-cyan-500/40 hover:bg-zinc-950 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-zinc-100 group-hover:text-cyan-400 transition-colors">
                      Complete Mods &amp; Gear Catalog
                    </p>
                    <p className="text-xs text-zinc-400">
                      Explore plug-and-play dashcams, roof crossbars, and organizers.
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default WinterPrepView;
