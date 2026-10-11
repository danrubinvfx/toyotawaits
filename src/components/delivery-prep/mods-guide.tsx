import React from 'react';
import {
  DeliveryPrepChecklist,
  DeliveryPrepChecklistProps,
  ChecklistProduct,
} from '@/components/dashboard/delivery-prep-checklist';
import { MODS_CONFIG, ModItem } from '@/data/mods';
import { ModCard, ModCardProps } from '@/components/delivery-prep/mod-card';

export const AMAZON_ASSOCIATES_DISCLAIMER =
  'As an Amazon Associate I earn from qualifying purchases.';

export const COMMUNITY_TRANSPARENCY_NOTE =
  'Community Transparency: Some links on this page are affiliate links. If you purchase through them, we may earn a small commission at no additional cost to you, which directly funds hosting, database infrastructure, and keeping this tracker open and ad-free. As an Amazon Associate I earn from qualifying purchases.';

export function ModsGuide(props: DeliveryPrepChecklistProps) {
  return <DeliveryPrepChecklist {...props} />;
}

export default ModsGuide;
export { DeliveryPrepChecklist, MODS_CONFIG, ModCard };
export type { DeliveryPrepChecklistProps, ChecklistProduct, ModItem, ModCardProps };
