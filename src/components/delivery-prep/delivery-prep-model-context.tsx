'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DayOneGearShelf } from '@/components/gear/DayOneGearShelf';
import type { GearCardItem } from '@/components/gear/GearCard';
import { cn } from '@/lib/utils';

export type DeliveryPrepModelId =
  | 'universal'
  | 'rav4'
  | 'sienna'
  | 'grand-highlander'
  | 'tacoma'
  | 'corolla-cross';

export interface DeliveryPrepModelOption {
  id: DeliveryPrepModelId;
  label: string;
}

export const DELIVERY_PREP_MODELS: DeliveryPrepModelOption[] = [
  { id: 'universal', label: 'Universal' },
  { id: 'rav4', label: 'RAV4' },
  { id: 'sienna', label: 'Sienna' },
  { id: 'grand-highlander', label: 'Grand Highlander' },
  { id: 'tacoma', label: 'Tacoma' },
  { id: 'corolla-cross', label: 'Corolla Cross' },
];

export const MODEL_PDI_CALLOUTS: Record<Exclude<DeliveryPrepModelId, 'universal'>, string> = {
  rav4: 'RAV4 / PHEV PDI: Verify 120V Level 1 charging cable in sub-floor & transit fuse seated.',
  sienna: 'Sienna PDI: Verify hands-free kick-sensor sliding doors & cargo hitch clearance.',
  'grand-highlander': 'Grand Highlander PDI: Verify 3rd-row USB-C ports & spare tire toolkit.',
  tacoma: 'Tacoma PDI: Verify composite bed tie-downs & front air dam clearance.',
  'corolla-cross': 'Corolla Cross PDI: Verify rear cargo cover & hybrid battery intake filter screen.',
};

export function normalizeDeliveryPrepModel(raw?: string | null): DeliveryPrepModelId {
  const clean = (raw || '').toLowerCase().trim();
  if (clean === 'rav4' || clean === 'rav4-hybrid' || clean === 'rav4-prime') return 'rav4';
  if (clean === 'sienna' || clean === 'sienna-hybrid') return 'sienna';
  if (clean === 'grand-highlander' || clean === 'grand highlander') return 'grand-highlander';
  if (clean === 'tacoma' || clean === 'tacoma-hybrid') return 'tacoma';
  if (clean === 'corolla-cross' || clean === 'corolla cross') return 'corolla-cross';
  return 'universal';
}

export function getModelPickupKitItems(model: DeliveryPrepModelId): GearCardItem[] {
  const option = DELIVERY_PREP_MODELS.find((m) => m.id === model);
  const modelName = option?.label || 'Toyota';

  if (model === 'universal') {
    return [];
  }

  const muslogyConfig: Record<
    Exclude<DeliveryPrepModelId, 'universal'>,
    { slug: string; destinationUrl: string; imageUrl: string }
  > = {
    rav4: {
      slug: 'muslogy-rav4',
      destinationUrl: '/out/muslogy-rav4',
      imageUrl: '/assets/gear/muslogy-rav4-organizer.webp',
    },
    sienna: {
      slug: 'muslogy-sienna',
      destinationUrl: '/out/muslogy-sienna',
      imageUrl: '/assets/gear/muslogy-sienna-organizer.webp',
    },
    'grand-highlander': {
      slug: 'muslogy-grand-highlander',
      destinationUrl: '/out/muslogy-grand-highlander',
      imageUrl: '/assets/gear/muslogy-grand-highlander-organizer.webp',
    },
    tacoma: {
      slug: 'muslogy-tacoma',
      destinationUrl: '/out/muslogy-tacoma',
      imageUrl: '/assets/gear/muslogy-rav4-organizer.webp',
    },
    'corolla-cross': {
      slug: 'muslogy-corolla-cross',
      destinationUrl: '/out/muslogy-corolla-cross',
      imageUrl: '/assets/gear/muslogy-rav4-organizer.webp',
    },
  };

  const muslogy = muslogyConfig[model];

  return [
    {
      id: `tuxmat-${model}`,
      slug: `tuxmat-${model}-floor-liners`,
      title: `TuxMat All-Weather Floor Liners (${modelName})`,
      brand: 'TuxMat',
      category: 'Floor Protection',
      description: `Laser-measured high-wall spill and slush protection tailored for the ${modelName}.`,
      badge: 'Essential',
      imageUrl: '/assets/gear/tuxmat-floor-liners.webp',
      fallbackIcon: 'layers',
      destinationType: 'amazon',
      searchQuery: `TuxMat Toyota ${modelName} custom all weather floor mats`,
      searchKeywordsCA: `TuxMat Toyota ${modelName} custom all weather floor mats`,
      searchKeywordsUS: `TuxMat Toyota ${modelName} custom all weather floor mats`,
      activeModel: model,
    },
    {
      id: `fitcamx-${model}`,
      slug: `fitcamx-${model}-dashcam`,
      title: `FitcamX OEM 4K Dashcam (${modelName})`,
      brand: 'FitcamX',
      category: 'Tech & Security',
      description: `Stealth OEM mirror-tap 4K recording with zero exposed wiring for ${modelName}.`,
      badge: 'Top Pick',
      imageUrl: '/assets/gear/fitcamx-rav4.webp',
      fallbackIcon: 'camera',
      destinationType: 'amazon',
      searchQuery: `Fitcamx dash cam Toyota ${modelName} OEM 4K`,
      searchKeywordsCA: `Fitcamx dash cam Toyota ${modelName} OEM 4K`,
      searchKeywordsUS: `Fitcamx dash cam Toyota ${modelName} OEM 4K`,
      activeModel: model,
    },
    {
      id: muslogy.slug,
      slug: muslogy.slug,
      title: `Muslogy Console Organizer (${modelName})`,
      brand: 'Muslogy',
      category: 'Cabin Organization',
      description: `Dual-tier armrest storage divider custom-molded for the ${modelName}.`,
      badge: 'Partner Deal · 2% Off',
      imageUrl: muslogy.imageUrl,
      fallbackIcon: 'layout-grid',
      destinationType: 'direct_partner',
      destinationUrl: muslogy.destinationUrl,
      discountCode: 'Toyotawaits',
      discountText: '2% off',
      buttonLabel: 'Get 2% Off on Muslogy ↗',
      activeModel: model,
    },
  ];
}

interface DeliveryPrepModelContextValue {
  selectedModel: DeliveryPrepModelId;
  setSelectedModel: (model: DeliveryPrepModelId) => void;
}

const DeliveryPrepModelContext = createContext<DeliveryPrepModelContextValue | null>(null);

export function useDeliveryPrepModel() {
  return useContext(DeliveryPrepModelContext);
}

export function DeliveryPrepModelProvider({
  initialModel = 'universal',
  children,
}: {
  initialModel?: DeliveryPrepModelId;
  children: React.ReactNode;
}) {
  const [selectedModel, setSelectedModelState] = useState<DeliveryPrepModelId>(initialModel);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const modelParam = params.get('model');
    if (modelParam) {
      setSelectedModelState(normalizeDeliveryPrepModel(modelParam));
    }
  }, []);

  const setSelectedModel = (model: DeliveryPrepModelId) => {
    setSelectedModelState(model);
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        if (model === 'universal') {
          url.searchParams.delete('model');
        } else {
          url.searchParams.set('model', model);
        }
        window.history.replaceState({}, '', url.toString());
      } catch {
        // Ignore history errors in restricted environments
      }
    }
  };

  return (
    <DeliveryPrepModelContext.Provider value={{ selectedModel, setSelectedModel }}>
      {children}
    </DeliveryPrepModelContext.Provider>
  );
}

export interface DeliveryPrepDayOneKitProps {
  universalItems: GearCardItem[];
  market: 'CA' | 'US';
}

export function DeliveryPrepDayOneKit({ universalItems, market }: DeliveryPrepDayOneKitProps) {
  const ctx = useDeliveryPrepModel();
  const selectedModel = ctx?.selectedModel ?? 'universal';
  const setSelectedModel = ctx?.setSelectedModel;

  const isUniversal = selectedModel === 'universal';
  const activeOption = DELIVERY_PREP_MODELS.find((m) => m.id === selectedModel);
  const items = isUniversal ? universalItems : getModelPickupKitItems(selectedModel);

  return (
    <div className="space-y-3 print:hidden">
      {/* Compact 1-row horizontal Model Selector Pill Bar */}
      <div
        role="tablist"
        aria-label="Select Toyota model for Day-One Pickup Kit"
        data-testid="delivery-prep-model-selector"
        className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
      >
        {DELIVERY_PREP_MODELS.map((option) => {
          const isActive = selectedModel === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              data-testid={`model-pill-${option.id}`}
              onClick={() => setSelectedModel?.(option.id)}
              className={cn(
                'min-h-[36px] px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 border transition-all cursor-pointer',
                isActive
                  ? 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-sm'
                  : 'bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white'
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <DayOneGearShelf
        items={items}
        modelSlug={isUniversal ? undefined : selectedModel}
        activeModel={isUniversal ? undefined : selectedModel}
        modelName={isUniversal ? undefined : activeOption?.label}
        title={isUniversal ? 'Top-Picked Day-One Pickup Kit' : `${activeOption?.label} Day-One Pickup Kit`}
        subtitle={
          isUniversal
            ? 'Most-ordered accessories by ToyotaWaits buyers before driving off the lot.'
            : `Exact-fit day-one essentials tailored for your ${activeOption?.label} pickup.`
        }
        market={market}
        placement="delivery_prep_top_kit"
      />
    </div>
  );
}
