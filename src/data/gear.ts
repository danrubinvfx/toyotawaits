/**
 * Essential Day-One Gear & Drop-In Upgrades Dataset
 * ToyotaWaits Canadian Toyota Accessory Catalog
 *
 * Provides curated, community-vetted vehicle gear, interior protection,
 * dashcam mirror taps, and emergency gear compliant with Amazon Associates guidelines.
 */

import { MODS_CONFIG, ModItem, ModCategory } from '@/data/mods';

export type GearItem = ModItem;
export type GearCategory = ModCategory;

/** Canonical gear configuration alias for mods catalog */
export const GEAR_CONFIG: ModItem[] = MODS_CONFIG;

/** Wish list guidance tip compliant with Amazon Associates Operating Agreement */
export const AMAZON_WISHLIST_TIP =
  'Add to Amazon Wish List to monitor price changes and stock.';

export function getGearForModel(modelSlug: string): ModItem[] {
  return MODS_CONFIG.filter(
    (item) => item.models.includes(modelSlug) || item.models.includes('universal')
  );
}

export function getGearBySlug(slug: string): ModItem | undefined {
  return MODS_CONFIG.find((item) => item.slug === slug);
}

export { MODS_CONFIG };
export default GEAR_CONFIG;
