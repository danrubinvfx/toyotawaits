import React from 'react';
import {
  DeliveryPrepChecklist,
  DeliveryPrepChecklistProps,
  ChecklistProduct,
} from '@/components/dashboard/delivery-prep-checklist';
import { MODS_CONFIG, ModItem } from '@/data/mods';

export function ModsGuide(props: DeliveryPrepChecklistProps) {
  return <DeliveryPrepChecklist {...props} />;
}

export default ModsGuide;
export { DeliveryPrepChecklist, MODS_CONFIG };
export type { DeliveryPrepChecklistProps, ChecklistProduct, ModItem };
