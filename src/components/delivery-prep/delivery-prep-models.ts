import type { GearCardItem } from '@/components/gear/GearCard';

export type DeliveryPrepModelId =
  | 'universal'
  | 'rav4'
  | 'sienna'
  | 'grand-highlander'
  | 'tacoma'
  | 'corolla-cross';

export interface DeliveryPrepModelOption {
  id: DeliveryPrepModelId;
  label: string;
}

export const DELIVERY_PREP_MODELS: DeliveryPrepModelOption[] = [
  { id: 'universal', label: 'Universal' },
  { id: 'rav4', label: 'RAV4' },
  { id: 'sienna', label: 'Sienna' },
  { id: 'grand-highlander', label: 'Grand Highlander' },
  { id: 'tacoma', label: 'Tacoma' },
  { id: 'corolla-cross', label: 'Corolla Cross' },
];

export const MODEL_PDI_CALLOUTS: Record<Exclude<DeliveryPrepModelId, 'universal'>, string> = {
  rav4: 'RAV4 / PHEV PDI: Verify 120V Level 1 charging cable in sub-floor & transit fuse seated.',
  sienna: 'Sienna PDI: Verify hands-free kick-sensor sliding doors & cargo hitch clearance.',
  'grand-highlander': 'Grand Highlander PDI: Verify 3rd-row USB-C ports & spare tire toolkit.',
  tacoma: 'Tacoma PDI: Verify composite bed tie-downs & front air dam clearance.',
  'corolla-cross': 'Corolla Cross PDI: Verify rear cargo cover & hybrid battery intake filter screen.',
};

export function normalizeDeliveryPrepModel(raw?: string | string[] | null): DeliveryPrepModelId {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const clean = typeof value === 'string' ? value.toLowerCase().trim() : '';
  if (clean === 'rav4' || clean === 'rav4-hybrid' || clean === 'rav4-prime') return 'rav4';
  if (clean === 'sienna' || clean === 'sienna-hybrid') return 'sienna';
  if (clean === 'grand-highlander' || clean === 'grand highlander') return 'grand-highlander';
  if (clean === 'tacoma' || clean === 'tacoma-hybrid') return 'tacoma';
  if (clean === 'corolla-cross' || clean === 'corolla cross') return 'corolla-cross';
  return 'universal';
}

export function getModelPickupKitItems(model: DeliveryPrepModelId): GearCardItem[] {
  const normalized = normalizeDeliveryPrepModel(model);
  if (normalized === 'universal') {
    return [];
  }

  const option = DELIVERY_PREP_MODELS.find((m) => m.id === normalized);
  const modelName = option?.label || 'Toyota';

  const muslogyConfig: Record<
    Exclude<DeliveryPrepModelId, 'universal'>,
    { slug: string; destinationUrl: string; imageUrl: string }
  > = {
    rav4: {
      slug: 'muslogy-rav4',
      destinationUrl: '/out/muslogy-rav4',
      imageUrl: '/assets/gear/muslogy-rav4-organizer.webp',
    },
    sienna: {
      slug: 'muslogy-sienna',
      destinationUrl: '/out/muslogy-sienna',
      imageUrl: '/assets/gear/muslogy-sienna-organizer.webp',
    },
    'grand-highlander': {
      slug: 'muslogy-grand-highlander',
      destinationUrl: '/out/muslogy-grand-highlander',
      imageUrl: '/assets/gear/muslogy-grand-highlander-organizer.webp',
    },
    tacoma: {
      slug: 'muslogy-tacoma',
      destinationUrl: '/out/muslogy-tacoma',
      imageUrl: '/assets/gear/muslogy-rav4-organizer.webp',
    },
    'corolla-cross': {
      slug: 'muslogy-corolla-cross',
      destinationUrl: '/out/muslogy-corolla-cross',
      imageUrl: '/assets/gear/muslogy-rav4-organizer.webp',
    },
  };

  const muslogy = muslogyConfig[normalized];
  if (!muslogy) {
    return [];
  }

  return [
    {
      id: `tuxmat-${normalized}`,
      slug: `tuxmat-${normalized}-floor-liners`,
      title: `TuxMat All-Weather Floor Liners (${modelName})`,
      brand: 'TuxMat',
      category: 'Floor Protection',
      description: `Laser-measured high-wall spill and slush protection tailored for the ${modelName}.`,
      badge: 'Essential',
      imageUrl: '/assets/gear/tuxmat-floor-liners.webp',
      fallbackIcon: 'layers',
      destinationType: 'amazon',
      searchQuery: `TuxMat Toyota ${modelName} custom all weather floor mats`,
      searchKeywordsCA: `TuxMat Toyota ${modelName} custom all weather floor mats`,
      searchKeywordsUS: `TuxMat Toyota ${modelName} custom all weather floor mats`,
      activeModel: normalized,
    },
    {
      id: `fitcamx-${normalized}`,
      slug: `fitcamx-${normalized}-dashcam`,
      title: `FitcamX OEM 4K Dashcam (${modelName})`,
      brand: 'FitcamX',
      category: 'Tech & Security',
      description: `Stealth OEM mirror-tap 4K recording with zero exposed wiring for ${modelName}.`,
      badge: 'Top Pick',
      imageUrl: '/assets/gear/fitcamx-rav4.webp',
      fallbackIcon: 'camera',
      destinationType: 'amazon',
      searchQuery: `Fitcamx dash cam Toyota ${modelName} OEM 4K`,
      searchKeywordsCA: `Fitcamx dash cam Toyota ${modelName} OEM 4K`,
      searchKeywordsUS: `Fitcamx dash cam Toyota ${modelName} OEM 4K`,
      activeModel: normalized,
    },
    {
      id: muslogy.slug,
      slug: muslogy.slug,
      title: `Muslogy Console Organizer (${modelName})`,
      brand: 'Muslogy',
      category: 'Cabin Organization',
      description: `Dual-tier armrest storage divider custom-molded for the ${modelName}.`,
      badge: 'Partner Deal · 2% Off',
      imageUrl: muslogy.imageUrl,
      fallbackIcon: 'layout-grid',
      destinationType: 'direct_partner',
      destinationUrl: muslogy.destinationUrl,
      discountCode: 'Toyotawaits',
      discountText: '2% off',
      buttonLabel: 'Get 2% Off on Muslogy ↗',
      activeModel: normalized,
    },
  ];
}
