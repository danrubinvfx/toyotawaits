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
    id: 'rav4-padded-armrest-cover',
    title: 'Custom-Fit Padded Center Console Armrest Cover',
    category: 'comfort',
    description: 'Soft memory-foam padded neoprene/leatherette slip cover that relieves forearm fatigue on long trips and protects the factory armrest from sweat, pets, and wear.',
    estimatedPriceCad: '$24 – $32 CAD',
    url: buildAmazonCaSearchUrl('Toyota RAV4 2019-2026 center console armrest cover cushion pad'),
    applicableModels: ['rav4', 'rav4-hybrid', 'rav4-prime', 'universal'],
    badge: 'Long-Drive Pick',
    isDeliveryDayEssential: true,
  },
  {
    id: 'lateral-console-knee-cushion',
    title: 'Driver Side Console Edge Leather Knee Cushion',
    category: 'comfort',
    description: 'Self-adhesive ergonomic foam pad that mounts along the center console tunnel to prevent right knee soreness against the hard interior plastics.',
    estimatedPriceCad: '$14 – $19 CAD',
    url: buildAmazonCaSearchUrl('car center console knee rest pad leather cushion ergonomic leg support'),
    applicableModels: ['rav4', 'rav4-hybrid', 'rav4-prime', 'universal'],
    badge: 'Road Trip Essential',
    isDeliveryDayEssential: true,
  },
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
    url: buildAmazonCaSearchUrl('Fitcamx dash cam Toyota RAV4 OEM 4K'),
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
    url: buildAmazonCaSearchUrl('Faraday bag key fob signal protector pouch'),
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
    url: buildAmazonCaSearchUrl('Toyota RAV4 center console organizer tray 2019-2026'),
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
export function isAudioEquipmentItem(item: {
  category?: string;
  id?: string;
  title?: string;
  description?: string;
}): boolean {
  const cat = (item.category || '').toLowerCase();
  const id = (item.id || '').toLowerCase();
  const title = (item.title || '').toLowerCase();
  const desc = (item.description || '').toLowerCase();

  return (
    cat.includes('audio') ||
    id.includes('speaker') ||
    id.includes('subwoofer') ||
    id.includes('amplifier') ||
    id.includes('beat-sonic') ||
    id.includes('tweeter') ||
    title.includes('speaker') ||
    title.includes('subwoofer') ||
    title.includes('amplifier') ||
    title.includes('beat-sonic') ||
    title.includes('tweeter') ||
    desc.includes('speaker') ||
    desc.includes('subwoofer') ||
    desc.includes('amplifier')
  );
}

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

  // Exclude audio equipment from Day 1 / delivery-day gear lists
  matching = matching.filter((item) => !isAudioEquipmentItem(item));

  // Dynamically tailor search queries for model-specific items
  const tailored = matching.map((item) => {
    if (item.id === 'all-weather-floor-liners') {
      const q = normalized?.toLowerCase() === 'sienna'
        ? 'Toyota Sienna all weather floor mats 2021-2026'
        : normalized?.toLowerCase() === 'grand highlander'
        ? 'Toyota Grand Highlander all weather floor mats liners'
        : normalized?.toLowerCase() === 'rav4'
        ? 'TuxMat Toyota RAV4 2019-2026'
        : `Toyota ${normalized || 'universal'} all weather floor mats liners TPE`;
      return {
        ...item,
        url: buildAmazonCaSearchUrl(q),
      };
    }
    if (item.id === '4k-front-rear-dash-cam') {
      const q = normalized?.toLowerCase().includes('rav4')
        ? 'Fitcamx dash cam Toyota RAV4 OEM 4K'
        : `Fitcamx dash cam Toyota ${normalized || 'OEM'} 4K`;
      return {
        ...item,
        url: buildAmazonCaSearchUrl(q),
      };
    }
    if (item.id === 'infotainment-screen-protector') {
      return {
        ...item,
        url: buildAmazonCaSearchUrl(`Toyota ${normalized || 'universal'} screen protector tempered glass 9H`),
      };
    }
    if (item.id === 'center-console-organizer-tray') {
      const q = normalized?.toLowerCase().includes('rav4')
        ? 'Toyota RAV4 center console organizer tray 2019-2026'
        : `Toyota ${normalized || 'universal'} center console organizer tray`;
      return {
        ...item,
        url: buildAmazonCaSearchUrl(q),
      };
    }
    return item;
  });

  // Dynamically sort by popularity weights when available
  const sorted = sortAccessoriesByPopularity(tailored, clickCounts);

  return sorted.slice(0, 8);
}
