import { CA_ASSOCIATE_TAG } from '@/lib/gear/affiliate';
import { GEAR_CONFIG, getGearForModel, getGearBySlug, type GearItem, type GearCategory } from '@/data/gear';
import { ESSENTIAL_ACCESSORIES, type AccessoryItem } from '@/data/accessories';

export interface SeasonalGearPick {
  id: string;
  accessoryId: string;
  text: string;
  title: string;
  linkUrl: string;
  badge: string;
  isExternal: boolean;
  modelContext?: string | null;
}

function buildAmazonCaUrl(keywords: string): string {
  return `https://www.amazon.ca/s?k=${encodeURIComponent(keywords.trim())}&tag=${CA_ASSOCIATE_TAG}`;
}

/**
 * Top-performing seasonal essentials highlighted in the unified top ticker wire.
 */
export const SEASONAL_TICKER_GEAR_PICKS: SeasonalGearPick[] = [
  {
    id: 'gear-floor-liners',
    accessoryId: 'all-weather-floor-liners',
    text: 'Custom-fit all-weather rubber floor liners & trunk spill mats',
    title: 'Custom-Fit All-Weather Floor Liners & Cargo Mat',
    linkUrl: buildAmazonCaUrl('Toyota custom fit all weather rubber floor liners trunk mat TPE'),
    badge: '[⚡ GEAR PICK]',
    isExternal: true,
    modelContext: 'universal',
  },
  {
    id: 'gear-console-organizer',
    accessoryId: 'center-console-organizer-tray',
    text: 'Direct-fit OEM console wireless charger & organizer trays',
    title: 'Drop-In Center Console Divider & Organizer Tray',
    linkUrl: buildAmazonCaUrl('Toyota direct fit center console wireless charger organizer tray'),
    badge: '[⚡ GEAR PICK]',
    isExternal: true,
    modelContext: 'universal',
  },
  {
    id: 'gear-dash-cam-4k',
    accessoryId: '4k-front-rear-dash-cam',
    text: 'Front & rear 4K dash cam with OEM mirror tap & parking mode',
    title: 'Front & Rear 4K Dash Cam with Parking Surveillance',
    linkUrl: buildAmazonCaUrl('4K front and rear dash cam Toyota OEM mirror tap parking mode'),
    badge: '[⚡ GEAR PICK]',
    isExternal: true,
    modelContext: 'universal',
  },
];

export {
  GEAR_CONFIG,
  ESSENTIAL_ACCESSORIES,
  getGearForModel,
  getGearBySlug,
  type GearItem,
  type GearCategory,
  type AccessoryItem,
};

export default SEASONAL_TICKER_GEAR_PICKS;
