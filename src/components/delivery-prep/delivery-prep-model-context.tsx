'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DayOneGearShelf } from '@/components/gear/DayOneGearShelf';
import type { GearCardItem } from '@/components/gear/GearCard';
import { cn } from '@/lib/utils';
import {
  type DeliveryPrepModelId,
  type DeliveryPrepModelOption,
  DELIVERY_PREP_MODELS,
  MODEL_PDI_CALLOUTS,
  normalizeDeliveryPrepModel,
  getModelPickupKitItems,
} from './delivery-prep-models';

export {
  type DeliveryPrepModelId,
  type DeliveryPrepModelOption,
  DELIVERY_PREP_MODELS,
  MODEL_PDI_CALLOUTS,
  normalizeDeliveryPrepModel,
  getModelPickupKitItems,
};

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
  const [selectedModel, setSelectedModelState] = useState<DeliveryPrepModelId>(() =>
    normalizeDeliveryPrepModel(initialModel)
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const modelParam = params.get('model');
    if (modelParam) {
      setSelectedModelState(normalizeDeliveryPrepModel(modelParam));
    }
  }, []);

  const setSelectedModel = (model: DeliveryPrepModelId) => {
    const normalized = normalizeDeliveryPrepModel(model);
    setSelectedModelState(normalized);
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        if (normalized === 'universal') {
          url.searchParams.delete('model');
        } else {
          url.searchParams.set('model', normalized);
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
  const selectedModel = normalizeDeliveryPrepModel(ctx?.selectedModel ?? 'universal');
  const setSelectedModel = ctx?.setSelectedModel;

  const isUniversal = selectedModel === 'universal';
  const activeOption =
    DELIVERY_PREP_MODELS.find((m) => m.id === selectedModel) ?? DELIVERY_PREP_MODELS[0];
  const modelItems = isUniversal ? universalItems : getModelPickupKitItems(selectedModel);
  const items = modelItems.length > 0 ? modelItems : universalItems;

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
