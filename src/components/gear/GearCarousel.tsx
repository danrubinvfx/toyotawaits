'use client';

import React from 'react';
import {
  DeliveryPrepChecklist,
  DeliveryPrepChecklistProps,
} from '@/components/dashboard/delivery-prep-checklist';
import { injectActiveModelIntoQuery, getModelDisplayName } from '@/lib/gear/affiliate';

export interface GearCarouselProps extends DeliveryPrepChecklistProps {
  activeModel?: string;
}

export function GearCarousel({ activeModel, model, ...props }: GearCarouselProps) {
  const effectiveModel = activeModel || model || 'all';
  return <DeliveryPrepChecklist model={effectiveModel} {...props} />;
}

export { DeliveryPrepChecklist, injectActiveModelIntoQuery, getModelDisplayName };
export default GearCarousel;
