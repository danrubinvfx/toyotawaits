'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, Snowflake, Disc3 } from 'lucide-react';
import { DeliveryPrepChecklist } from '@/components/dashboard/delivery-prep-checklist';
import { cn } from '@/lib/utils';

export interface VehicleOption {
  id: string;
  label: string;
  name: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  powertrain?: string;
}

export const VEHICLE_OPTIONS: VehicleOption[] = [
  {
    id: 'rav4',
    label: 'RAV4 (Hybrid/Prime)',
    name: 'Toyota RAV4',
    subtitle: 'Prime PHEV & Hybrid (AWD)',
    badge: 'High Demand',
    badgeColor: 'border-red-500/30 text-red-500 bg-red-500/10',
    powertrain: 'phev',
  },
  {
    id: 'grand-highlander',
    label: 'Grand Highlander',
    name: 'Toyota Grand Highlander',
    subtitle: 'MAX Hybrid & Turbo Gas (AWD)',
    badge: 'Family SUV',
    badgeColor: 'border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/10',
    powertrain: 'hev',
  },
  {
    id: 'sienna',
    label: 'Sienna',
    name: 'Toyota Sienna',
    subtitle: 'Hybrid Family Minivan (eAWD)',
    badge: 'Allocation Quota',
    badgeColor: 'border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10',
    powertrain: 'hev',
  },
  {
    id: 'prius-prime',
    label: 'Prius Prime',
    name: 'Toyota Prius Prime',
    subtitle: 'Plug-in Hybrid (PHEV)',
    badge: 'ZEV Rebate Eligible',
    badgeColor: 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
    powertrain: 'phev',
  },
  {
    id: 'prius',
    label: 'Prius',
    name: 'Toyota Prius',
    subtitle: 'Hybrid (HEV AWD)',
    badge: 'Quickest Delivery',
    badgeColor: 'border-sky-500/30 text-sky-600 dark:text-sky-400 bg-sky-500/10',
    powertrain: 'hev',
  },
  {
    id: 'land-cruiser',
    label: 'Land Cruiser',
    name: 'Toyota Land Cruiser',
    subtitle: 'i-FORCE MAX Hybrid (4WD)',
    badge: 'Heritage 4WD',
    badgeColor: 'border-amber-500/30 text-amber-500 bg-amber-500/10',
    powertrain: 'hev',
  },
  {
    id: 'tacoma',
    label: 'Tacoma',
    name: 'Toyota Tacoma',
    subtitle: 'i-FORCE MAX Hybrid & Turbo Gas',
    badge: 'Mid-Size Truck',
    badgeColor: 'border-orange-500/30 text-orange-500 bg-orange-500/10',
    powertrain: 'hev',
  },
];

export interface BenchmarkFeedProps {
  initialBenchmarks?: Record<string, any>;
  defaultModelId?: string;
  onSelectModel?: (modelSlug: string) => void;
  className?: string;
}

export function BenchmarkFeed({
  defaultModelId = 'rav4',
  onSelectModel,
  className,
}: BenchmarkFeedProps) {
  const [selectedModel, setSelectedModel] = useState<string>(defaultModelId);
  const [showUniversalGear, setShowUniversalGear] = useState<boolean>(false);

  // Listen for global vehicle model changes from StickyVehiclePills or WaitTimeEstimator
  useEffect(() => {
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ model: string }>;
      if (customEvent.detail?.model) {
        const slug = customEvent.detail.model;
        const matched = VEHICLE_OPTIONS.find((v) => v.id === slug);
        if (matched) {
          setSelectedModel(matched.id);
        } else if (slug === 'prius' || slug === 'prius-prime') {
          setSelectedModel(slug);
        }
      }
    };

    window.addEventListener('toyotawait:model-change', handleSync);
    window.addEventListener('toyotawait:model-sync', handleSync);
    return () => {
      window.removeEventListener('toyotawait:model-change', handleSync);
      window.removeEventListener('toyotawait:model-sync', handleSync);
    };
  }, []);

  const activeVehicle =
    VEHICLE_OPTIONS.find((v) => v.id === selectedModel) || VEHICLE_OPTIONS[0];

  return (
    <div className={cn('space-y-6', className)} data-testid="delivery-prep-section">
      {/* Dynamic Gear & Mods Placement */}
      <div id="delivery-prep" className="space-y-3 scroll-mt-24 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-100 flex items-center gap-2">
              <span>Delivery Day Prep &amp; Essential Gear:</span>
              <span className="text-amber-400">{activeVehicle.label}</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Community-vetted drop-in gear, dashcam harnesses, and protective armor matching {activeVehicle.name}.
            </p>
          </div>

          {/* Secondary Toggle: View All Universal Delivery Gear */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setShowUniversalGear((prev) => !prev);
              onSelectModel?.(activeVehicle.id);
            }}
            className={cn(
              'text-xs h-8 border-zinc-700 transition-all font-medium self-start sm:self-auto cursor-pointer',
              showUniversalGear
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-400 hover:bg-amber-500/20'
                : 'bg-zinc-900/80 text-zinc-300 hover:text-amber-400 hover:border-amber-500/40'
            )}
          >
            <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-amber-500 shrink-0" />
            {showUniversalGear ? `Filter to ${activeVehicle.label} Only` : 'View All Universal Delivery Gear'}
          </Button>
        </div>

        {/* Dynamic Delivery Prep Checklist Component */}
        <DeliveryPrepChecklist
          model={showUniversalGear ? 'all' : activeVehicle.id}
          powertrain={activeVehicle.powertrain}
          defaultExpanded={true}
        />
      </div>

      {/* Compact Seasonal Winter Prep Banner */}
      <div
        data-testid="winter-prep-seasonal-banner"
        className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs"
      >
        <div className="flex items-center gap-2.5 text-zinc-300">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
            <Snowflake className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold text-zinc-100">
              Prepping for sub-zero deliveries?
            </p>
            <p className="text-zinc-400 text-[11px]">
              Model-by-model 12V hybrid jump procedures, TuxMat vent clearance, and freezing rain gear.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end sm:self-center shrink-0">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs h-8 gap-1.5"
          >
            <Link href="/tires">
              <Disc3 className="h-3.5 w-3.5" />
              <span>Tire Guide 🛞</span>
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            variant="outline"
            className="border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-bold text-xs h-8 gap-1.5"
          >
            <Link href="/winter-prep">
              <span>View our Canadian Winter Guide →</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export { BenchmarkFeed as ModelGearChecklist };
export default BenchmarkFeed;
