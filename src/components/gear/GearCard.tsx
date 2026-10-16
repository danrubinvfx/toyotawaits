'use client';

import {
  ModCard,
  ModCardProps,
  ModCardItem,
  getAmazonAffiliateUrl,
  getThemedCategoryIcon,
} from '@/components/delivery-prep/mod-card';

export const GearCard = ModCard;
export type GearCardProps = ModCardProps;
export type GearCardItem = ModCardItem;

export { ModCard, getAmazonAffiliateUrl, getThemedCategoryIcon };
export default ModCard;
