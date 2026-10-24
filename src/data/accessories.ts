import { CA_ASSOCIATE_TAG } from '@/lib/gear/affiliate';

export interface AccessoryItem {
  id: string;
  title: string;
  category: 'protection' | 'tech' | 'comfort' | 'care';
  description: string;
  estimatedPriceCad: string;
  url: string;
  applicableModels: string[];
  badge?: string;
  isDeliveryDayEssential?: boolean;
}

function buildAmazonCaSearchUrl(keywords: string): string {
  const query = encodeURIComponent(keywords.trim());
  return `https://www.amazon.ca/s?k=${query}&tag=${CA_ASSOCIATE_TAG}`;
}

export const ESSENTIAL_ACCESSORIES: AccessoryItem[] = [
  {
    id: 'all-weather-floor-liners',
    title: 'TPE All-Weather Floor & Cargo Liners',
    category: 'protection',
    description: 'Laser-fit floor & trunk spill protection for Canadian winters',
    estimatedPriceCad: '$120 – $189 CAD',
    url: buildAmazonCaSearchUrl('Toyota all weather floor mats liners TPE'),
    applicableModels: ['RAV4', 'RAV4 Hybrid', 'RAV4 Plug-in Hybrid', 'Sienna', 'Grand Highlander', 'Tacoma', 'Highlander', 'Corolla Cross', 'universal'],
    badge: 'Essential',
    isDeliveryDayEssential: true,
  },
  {
    id: '4k-front-rear-dash-cam',
    title: 'Plug-and-Play FitcamX 4K Dash Cam',
    category: 'tech',
    description: 'OEM-integrated rearview mirror power tap with zero visible wiring',
    estimatedPriceCad: '$169 – $289 CAD',
    url: buildAmazonCaSearchUrl('FitcamX 4K dash cam Toyota OEM rearview mirror power tap'),
    applicableModels: ['universal', 'RAV4', 'Sienna', 'Grand Highlander', 'Tacoma', 'Highlander', 'Camry', 'Corolla'],
    badge: 'Top Pick',
    isDeliveryDayEssential: true,
  },
  {
    id: 'infotainment-screen-protector',
    title: 'Anti-Glare Screen Protector (10.5" / 12.3")',
    category: 'protection',
    description: '9H tempered glass to reduce fingerprint smudges & glare',
    estimatedPriceCad: '$19 – $29 CAD',
    url: buildAmazonCaSearchUrl('Toyota navigation screen protector tempered glass 9H'),
    applicableModels: ['universal', 'RAV4', 'Sienna', 'Grand Highlander', 'Tacoma', 'Highlander', 'Camry', 'Prius'],
    badge: 'Community Favorite',
    isDeliveryDayEssential: true,
  },
  {
    id: 'rfid-faraday-key-fob-pouch',
    title: 'Heavy-Duty RFID Faraday Key Fob Signal Blocker',
    category: 'protection',
    description: 'Dual-layer shielding Faraday pouch that blocks RF relay theft and clone attacks on your Toyota Smart Key while parked at home or work.',
    estimatedPriceCad: '$14 – $24 CAD',
    url: buildAmazonCaSearchUrl('faraday bag key fob protector RFID signal blocker car theft'),
    applicableModels: ['universal'],
    badge: 'Essential',
    isDeliveryDayEssential: true,
  },
  {
    id: 'ceramic-interior-leather-protection',
    title: 'Ceramic Interior & SofTex Leather Protection Kit',
    category: 'care',
    description: 'Hydrophobic UV-blocking barrier coating for SofTex synthetic and genuine leather seats, shielding against blue jean dye and winter salt crust.',
    estimatedPriceCad: '$28 – $45 CAD',
    url: buildAmazonCaSearchUrl('ceramic interior protectant spray leather softex UV protection'),
    applicableModels: ['universal'],
    badge: 'Top Pick',
  },
  {
    id: 'fast-usbc-pd-car-charger',
    title: 'Dual-Port 65W Fast USB-C PD Car Charger',
    category: 'tech',
    description: 'High-speed compact metal 12V adapter with 65W Power Delivery to fast-charge laptops, tablets, and phones simultaneously without clutter.',
    estimatedPriceCad: '$19 – $32 CAD',
    url: buildAmazonCaSearchUrl('65W fast USB-C PD car charger metal compact dual port'),
    applicableModels: ['universal'],
    badge: 'Community Favorite',
    isDeliveryDayEssential: true,
  },
  {
    id: 'center-console-organizer-tray',
    title: 'Center Console Organizer & Fast Charger',
    category: 'comfort',
    description: 'Drop-in dual tray with OEM-style USB-C fast charging',
    estimatedPriceCad: '$18 – $29 CAD',
    url: buildAmazonCaSearchUrl('Toyota center console organizer tray armrest divider'),
    applicableModels: ['RAV4', 'RAV4 Hybrid', 'Sienna', 'Grand Highlander', 'Tacoma', 'Highlander', 'Tundra', 'universal'],
    badge: 'Top Pick',
    isDeliveryDayEssential: true,
  },
];

/**
 * Normalizes vehicle model input (e.g. "rav4" -> "RAV4", "grand-highlander" -> "Grand Highlander")
 */
function normalizeModelName(model?: string | null): string {
  if (!model) return '';
  const clean = model.trim().toLowerCase();
  if (clean === 'rav4' || clean.includes('rav4')) return 'RAV4';
  if (clean === 'sienna' || clean.includes('sienna')) return 'Sienna';
  if (clean === 'grand-highlander' || clean.includes('grand highlander')) return 'Grand Highlander';
  if (clean === 'highlander' || clean.includes('highlander')) return 'Highlander';
  if (clean === 'tacoma' || clean.includes('tacoma')) return 'Tacoma';
  if (clean === 'tundra' || clean.includes('tundra')) return 'Tundra';
  if (clean === 'camry' || clean.includes('camry')) return 'Camry';
  if (clean === 'corolla-cross' || clean.includes('corolla cross')) return 'Corolla Cross';
  if (clean === 'corolla' || clean.includes('corolla')) return 'Corolla';
  if (clean === 'prius' || clean.includes('prius')) return 'Prius';
  if (clean === 'land-cruiser' || clean.includes('land cruiser')) return 'Land Cruiser';
  if (clean === 'sequoia' || clean.includes('sequoia')) return 'Sequoia';
  return model.trim();
}

/**
 * Sorts accessory items by recent 30-day click telemetry, enhancing badges for the top 2 clicked items.
 * 1. Primary: Sort descending by recent click count.
 * 2. Secondary / Fallback: Preserve original curated order.
 * 3. Badge Enhancement: Top 1 gets '🔥 Most Popular', Top 2 gets 'Community Top Pick' (when clicks > 0).
 */
export function sortAccessoriesByPopularity(
  items: AccessoryItem[],
  clickCounts?: Record<string, number>
): AccessoryItem[] {
  if (!clickCounts || Object.keys(clickCounts).length === 0) {
    return items;
  }

  const withIndex = items.map((item, originalIndex) => ({
    item,
    originalIndex,
    clicks: clickCounts[item.id] ?? 0,
  }));

  withIndex.sort((a, b) => {
    if (b.clicks !== a.clicks) {
      return b.clicks - a.clicks;
    }
    return a.originalIndex - b.originalIndex;
  });

  return withIndex.map(({ item, clicks }, rank) => {
    if (clicks > 0) {
      if (rank === 0) {
        return {
          ...item,
          badge: '🔥 Most Popular',
        };
      }
      if (rank === 1) {
        return {
          ...item,
          badge: 'Community Top Pick',
        };
      }
    }
    return item;
  });
}

/**
 * Returns curated delivery-day gear, tailoring queries and links to the vehicle model when available.
 * Supports optional 30-day telemetry click weighting for dynamic popularity ranking.
 */
export function getAccessoriesForModel(
  modelName?: string | null,
  clickCounts?: Record<string, number>
): AccessoryItem[] {
  const normalized = normalizeModelName(modelName);

  let matching: AccessoryItem[];
  if (!normalized) {
    // Return universal essentials
    matching = ESSENTIAL_ACCESSORIES.filter((item) =>
      item.applicableModels.includes('universal')
    );
  } else {
    // Filter items that match the model or are universal
    matching = ESSENTIAL_ACCESSORIES.filter((item) => {
      if (item.applicableModels.includes('universal')) return true;
      return item.applicableModels.some(
        (m) =>
          m.toLowerCase() === normalized.toLowerCase() ||
          normalized.toLowerCase().includes(m.toLowerCase())
      );
    });
  }

  // Dynamically tailor search queries for model-specific items
  const tailored = matching.map((item) => {
    if (item.id === 'all-weather-floor-liners') {
      return {
        ...item,
        url: buildAmazonCaSearchUrl(`Toyota ${normalized || 'universal'} all weather floor mats liners TPE`),
      };
    }
    if (item.id === 'infotainment-screen-protector') {
      return {
        ...item,
        url: buildAmazonCaSearchUrl(`Toyota ${normalized || 'universal'} screen protector tempered glass 9H`),
      };
    }
    if (item.id === 'center-console-organizer-tray') {
      return {
        ...item,
        url: buildAmazonCaSearchUrl(`Toyota ${normalized || 'universal'} center console organizer tray`),
      };
    }
    return item;
  });

  // Dynamically sort by popularity weights when available
  const sorted = sortAccessoriesByPopularity(tailored, clickCounts);

  return sorted.slice(0, 6);
}
