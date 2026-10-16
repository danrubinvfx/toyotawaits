'use client';

import {
  ModCard,
  ModCardProps,
  ModCardItem,
  getAmazonAffiliateUrl,
  getThemedCategoryIcon,
} from '@/components/delivery-prep/mod-card';
import { buildAmazonAffiliateUrl } from '@/lib/affiliate';

export const GearCard = ModCard;
export type GearCardProps = ModCardProps;
export type GearCardItem = ModCardItem;

export { ModCard, getAmazonAffiliateUrl, buildAmazonAffiliateUrl, getThemedCategoryIcon };
export default ModCard;
