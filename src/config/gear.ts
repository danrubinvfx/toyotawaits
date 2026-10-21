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
  const query = keywords.trim().split(/\s+/).map(encodeURIComponent).join('+');
  return `https://www.amazon.ca/s?k=${query}&tag=${CA_ASSOCIATE_TAG}`;
}

/**
 * Top-performing seasonal essentials highlighted in the unified top ticker wire.
 */
export const SEASONAL_TICKER_GEAR_PICKS: SeasonalGearPick[] = [
  {
    id: 'gear-floor-liners',
    accessoryId: 'all-weather-floor-liners',
    title: 'Custom All-Weather Floor Liners',
    text: 'Laser-fit front, rear & cargo liners for RAV4, Sienna, Tacoma & Highlander',
    linkUrl: buildAmazonCaUrl('Toyota custom all weather floor liners'),
    badge: '[⚡ GEAR PICK]',
    isExternal: true,
    modelContext: 'universal',
  },
  {
    id: 'gear-wireless-carplay',
    accessoryId: 'wireless-carplay-adapter',
    title: 'Plug-and-Play Wireless CarPlay / Android Auto',
    text: 'Eliminate cables with instant auto-connect for all modern Toyota screens',
    linkUrl: buildAmazonCaUrl('wireless carplay adapter toyota'),
    badge: '[⚡ GEAR PICK]',
    isExternal: true,
    modelContext: 'universal',
  },
  {
    id: 'gear-console-organizer',
    accessoryId: 'center-console-organizer-tray',
    title: 'Center Console Drop-In Organizers',
    text: 'OEM-fit organization trays & dividers for all Toyota crossover & truck consoles',
    linkUrl: buildAmazonCaUrl('Toyota center console organizer tray'),
    badge: '[⚡ GEAR PICK]',
    isExternal: true,
    modelContext: 'universal',
  },
  {
    id: 'gear-tire-inflator',
    accessoryId: 'compact-cordless-tire-inflator',
    title: 'Compact Cordless Tire Inflator',
    text: 'Digital auto-stop 150 PSI air pump for winter cold-weather pressure drops',
    linkUrl: buildAmazonCaUrl('portable tire inflator car'),
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
