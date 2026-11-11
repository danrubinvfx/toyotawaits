'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  DeliveryPrepChecklist,
  DeliveryPrepChecklistProps,
} from '@/components/dashboard/delivery-prep-checklist';
import { injectActiveModelIntoQuery, getModelDisplayName } from '@/lib/gear/affiliate';
import { sortGearByPromotions, getCurrentPromoConfig } from '@/lib/gear/promotions';

export interface GearCarouselProps extends DeliveryPrepChecklistProps {
  activeModel?: string;
  items?: any[];
}

export function GearCarousel({ activeModel, model, items, ...props }: GearCarouselProps) {
  const searchParams = useSearchParams();
  const urlModel = searchParams?.get('model');
  const [currentModel, setCurrentModel] = useState<string>(activeModel || model || urlModel || 'all');

  useEffect(() => {
    if (activeModel) {
      setCurrentModel(activeModel);
    } else if (urlModel) {
      setCurrentModel(urlModel);
    }
  }, [activeModel, urlModel]);

  useEffect(() => {
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ model: string }>;
      if (customEvent.detail?.model) {
        setCurrentModel(customEvent.detail.model);
      }
    };
    window.addEventListener('toyotawait:model-change', handleSync);
    window.addEventListener('toyotawait:model-sync', handleSync);
    return () => {
      window.removeEventListener('toyotawait:model-change', handleSync);
      window.removeEventListener('toyotawait:model-sync', handleSync);
    };
  }, []);

  const sortedItems = items ? sortGearByPromotions(items) : undefined;

  return <DeliveryPrepChecklist model={currentModel} items={sortedItems} {...props} />;
}

export const GearSection = GearCarousel;
export const DayOneGearShelf = GearCarousel;
export {
  DeliveryPrepChecklist,
  injectActiveModelIntoQuery,
  getModelDisplayName,
  sortGearByPromotions,
  getCurrentPromoConfig,
};
export default GearCarousel;
