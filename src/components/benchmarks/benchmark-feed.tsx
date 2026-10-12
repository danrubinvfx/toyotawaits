'use client';

import React, { useState, useEffect } from 'react';
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
    <div className={cn(className)} data-testid="delivery-prep-section">
      <div id="delivery-prep" className="scroll-mt-24">
        {/* Dynamic Delivery Prep Checklist Component */}
        <DeliveryPrepChecklist
          model={showUniversalGear ? 'all' : activeVehicle.id}
          powertrain={activeVehicle.powertrain}
          defaultExpanded={true}
          vehicleLabel={activeVehicle.label}
          showUniversalGear={showUniversalGear}
          onToggleUniversalGear={() => {
            setShowUniversalGear((prev) => !prev);
            onSelectModel?.(activeVehicle.id);
          }}
        />
      </div>
    </div>
  );
}

export { BenchmarkFeed as ModelGearChecklist };
export default BenchmarkFeed;
