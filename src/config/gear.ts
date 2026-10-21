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
    title: 'TPE All-Weather Floor & Cargo Liners',
    text: 'Laser-fit floor & trunk spill protection for Canadian winters',
    linkUrl: buildAmazonCaUrl('Toyota custom fit all weather rubber floor liners trunk mat TPE'),
    badge: '[⚡ GEAR PICK]',
    isExternal: true,
    modelContext: 'universal',
  },
  {
    id: 'gear-console-organizer',
    accessoryId: 'center-console-organizer-tray',
    title: 'Center Console Organizer & Fast Charger',
    text: 'Drop-in dual tray with OEM-style USB-C fast charging',
    linkUrl: buildAmazonCaUrl('Toyota direct fit center console wireless charger organizer tray'),
    badge: '[⚡ GEAR PICK]',
    isExternal: true,
    modelContext: 'universal',
  },
  {
    id: 'gear-screen-protector',
    accessoryId: 'infotainment-screen-protector',
    title: 'Anti-Glare Screen Protector (10.5" / 12.3")',
    text: '9H tempered glass to reduce fingerprint smudges & glare',
    linkUrl: buildAmazonCaUrl('Toyota 10.5 12.3 anti glare screen protector tempered glass 9H'),
    badge: '[⚡ GEAR PICK]',
    isExternal: true,
    modelContext: 'universal',
  },
  {
    id: 'gear-dash-cam-4k',
    accessoryId: '4k-front-rear-dash-cam',
    title: 'Plug-and-Play FitcamX 4K Dash Cam',
    text: 'OEM-integrated rearview mirror power tap with zero visible wiring',
    linkUrl: buildAmazonCaUrl('FitcamX 4K dash cam Toyota OEM rearview mirror power tap'),
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
