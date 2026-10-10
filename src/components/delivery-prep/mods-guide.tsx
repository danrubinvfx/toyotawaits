import React from 'react';
import {
  DeliveryPrepChecklist,
  DeliveryPrepChecklistProps,
} from '@/components/dashboard/delivery-prep-checklist';

export function ModsGuide(props: DeliveryPrepChecklistProps) {
  return <DeliveryPrepChecklist {...props} />;
}

export default ModsGuide;
export { DeliveryPrepChecklist };
export type { DeliveryPrepChecklistProps };
