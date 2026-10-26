'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck,
  Video,
  Zap,
  Layers,
  ExternalLink,
  ShoppingBag,
  CheckCircle2,
  Box,
  Compass,
  Gauge,
  Radio,
} from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import { useCalculatorContext } from '@/context/CalculatorContext';
import { buildAmazonAffiliateUrl } from '@/lib/gear/affiliate';

export interface VettedProduct {
  id: string;
  category: string;
  brand: string;
  title: string;
  description: string;
  asin?: string;
  searchQuery?: string;
  bullets: string[];
  buttonText: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

const UNIVERSAL_FALLBACKS: VettedProduct[] = [
  {
    id: 'universal-tire-inflator',
    category: 'Roadside Preparedness',
    brand: 'AstroAI',
    title: 'Portable Digital 120 PSI Auto-Shutoff Tire Inflator',
    description: 'Ultra-fast handheld 12V DC compressor with digital gauge to prevent cold-weather pressure drops.',
    searchQuery: 'AstroAI portable tire inflator air compressor 12V',
    bullets: [
      'Accurate auto-shutoff presets prevent over-inflation',
      'Ultra-bright integrated emergency LED flashlight',
      'Plugs into 12V accessory port with 10ft reach',
      'Essential for cold Canadian winter tire maintenance',
    ],
    buttonText: 'View Digital Inflator',
    icon: Gauge,
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    id: 'universal-wireless-carplay',
    category: 'Cabin Connectivity',
    brand: 'CarlinKit 5.0 2Air',
    title: 'Plug-and-Play Wireless CarPlay & Android Auto Adapter',
    description: 'Eliminate tangled cables with seamless 5.8GHz automatic Bluetooth and Wi-Fi phone connection.',
    searchQuery: 'CarlinKit 5.0 2Air wireless CarPlay Android Auto adapter',
    bullets: [
      'Converts OEM factory wired CarPlay/Auto to wireless',
      'Near-zero latency 5.8GHz Wi-Fi transmission',
      'Auto-connects in seconds upon entering cabin',
      'Preserves factory touchscreen & steering wheel controls',
    ],
    buttonText: 'View Wireless Adapter',
    icon: Radio,
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
];

const RAV4_PRODUCTS: VettedProduct[] = [
  {
    id: 'rav4-dashcam',
    category: 'Vehicle Safety & Electronics',
    brand: 'FITCAMX / VIOFO',
    title: 'Integrated OEM-Fit 4K Dashcam',
    description: 'Factory-appearance dual dashcam replacing the rear-view mirror housing with no exposed dangling cords.',
    searchQuery: 'FITCAMX 4K dash cam Toyota RAV4 2019-2026',
    bullets: [
      'Plug-and-play harness taps TSS 2.5/3.0 mirror socket',
      '4K Sony Starvis sensor with ultra-crisp HDR night vision',
      'Zero windshield clutter, preserves factory aesthetic',
      'Built-in Wi-Fi and instant smartphone video playback',
    ],
    buttonText: 'View OEM-Fit Dashcams',
    icon: Video,
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'rav4-floor-liners',
    category: 'Interior Protection',
    brand: 'TuxMat / 3D MAXpider',
    title: 'All-Weather Custom-Fit TPE Floor Liners',
    description: 'Laser-measured precision tub coverage engineered to protect carpets from Canadian winter slush and salt.',
    searchQuery: 'TuxMat Toyota RAV4 custom all weather floor mats',
    bullets: [
      'High-wall tub coverage extends up to center console',
      'Cold-flexible down to -40°C without curling or cracking',
      'Engineered hybrid battery intake vent clearance',
      'OEM factory retention hook snap-in alignment',
    ],
    buttonText: 'View All-Weather Liners',
    icon: Layers,
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'rav4-screen-protector',
    category: 'Cabin Accessories',
    brand: 'Spigen / Muslogy',
    title: 'Matte Anti-Glare Infotainment Screen Protector',
    description: 'Essential 9H oleophobic tempered glass to eliminate fingerprint smudges and harsh sunlight glare.',
    searchQuery: 'Spigen matte screen protector Toyota RAV4',
    bullets: [
      '9H hardness matte oleophobic glass kills fingerprints & glare',
      'Precision fit for 10.5" and 12.3" Toyota Multimedia displays',
      'Zero touchscreen latency and responsive gesture recognition',
      'Resists key and fingernail scratches permanently',
    ],
    buttonText: 'View Screen Protector',
    icon: ShieldCheck,
    iconBg: 'bg-purple-500/10 dark:bg-purple-500/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    id: 'rav4-console-organizer',
    category: 'Interior Storage',
    brand: 'Muslogy / EDBETOS',
    title: 'Center Console Armrest Organizer Tray',
    description: 'Custom-fit drop-in tray that divides deep console bins into organized dual compartments.',
    searchQuery: 'Muslogy center console organizer tray Toyota RAV4',
    bullets: [
      'Drop-in multi-tier center console armrest divider tray',
      'Anti-slip silicone coin & smartphone compartment inserts',
      'Leaves full access to 12V power port and cable pass-through',
      'Factory-matched matte black textured ABS plastic',
    ],
    buttonText: 'View Console Organizer',
    icon: Box,
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
];

const SIENNA_PRODUCTS: VettedProduct[] = [
  {
    id: 'sienna-floor-liners',
    category: 'Interior Protection',
    brand: 'TuxMat / 3D MAXpider',
    title: '3-Row All-Weather High-Wall Floor Liners',
    description: 'Complete 3-row laser-scanned floor liners engineered specifically for Sienna Super-Long Slide seats.',
    searchQuery: 'Toyota Sienna 2021-2026 all weather floor mats liners 7 8 passenger',
    bullets: [
      'Full 1st, 2nd, and 3rd row coverage with seat-track clearance',
      'Shields against juice spills, winter salt crust, and gravel',
      'Custom cutout leaves 2nd-row sliding tracks unobstructed',
      'Deep high walls contain melted snow and liquid runoff',
    ],
    buttonText: 'View 3-Row Liners',
    icon: Layers,
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'sienna-console-organizer',
    category: 'Storage & Organization',
    brand: 'Vehicle OCD / Muslogy',
    title: 'Center Console Sliding Organizer & Bridge Box',
    description: 'Drop-in sliding organizer that unlocks the expansive cavernous Sienna bridge console area.',
    searchQuery: 'Toyota Sienna 2021-2026 center console bridge organizer tray',
    bullets: [
      'Smooth-sliding top tray for sunglasses, toll passes, and pens',
      'Lower bridge organizer for purse, tissue boxes, or tablets',
      'OEM-matched texture and sound-deadening rubber mats',
      'Prevents items from sliding into pedals during braking',
    ],
    buttonText: 'View Console Organizer',
    icon: Box,
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    id: 'sienna-seatback-kick-guards',
    category: 'Cabin Protection',
    brand: 'JoyTutus / Powerty',
    title: 'Rear Seatback & Kick Mat Protectors',
    description: 'Durable anti-scuff backrest protectors shielding 2nd and 3rd row seatbacks from kids and cargo.',
    searchQuery: 'Toyota Sienna seat back protectors kick mats',
    bullets: [
      'Tough waterproof TPE shields fabric and SofTex leather',
      'Velcro-backed quick installation with factory alignment',
      'Split-folding design accommodates 60/40 folding 3rd row',
      'Easy wipe-down cleaning with a damp microfiber cloth',
    ],
    buttonText: 'View Kick Protectors',
    icon: ShieldCheck,
    iconBg: 'bg-purple-500/10 dark:bg-purple-500/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    id: 'sienna-trailer-hitch',
    category: 'Towing & Hauling',
    brand: 'Curt 13470 / EcoHitch',
    title: 'Class III 2-Inch Trailer Hitch Receiver',
    description: 'Heavy-duty 3,500 lb rated hitch engineered for Sienna hybrid bumper clearance and bike racks.',
    searchQuery: 'Curt 13470 Toyota Sienna trailer hitch receiver class 3',
    bullets: [
      'Standard 2" receiver tube for bike racks and cargo baskets',
      '3,500 lbs GTW / 525 lbs tongue weight rating',
      'Designed to maintain factory hands-free kick sensor function',
      'Dual-coat rust-resistant liquid Bonderite & black powder coat',
    ],
    buttonText: 'View Trailer Hitch',
    icon: Compass,
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
];

const GRAND_HIGHLANDER_PRODUCTS: VettedProduct[] = [
  {
    id: 'gh-screen-protector',
    category: 'Cabin Protection',
    brand: 'Spigen / YEE PIN',
    title: '12.3" Matte Anti-Glare Infotainment Glass',
    description: 'Ultra-thin 9H tempered glass custom cut for the expansive 12.3" Grand Highlander center screen.',
    searchQuery: 'Toyota Grand Highlander 12.3 screen protector tempered glass',
    bullets: [
      'Matte finish eliminates reflective dashboard glare and haze',
      'Oleophobic nano-coating repels fingerprint smudges',
      'Precise laser cut around multimedia volume knob',
      'Zero degradation in touchscreen sensitivity or clarity',
    ],
    buttonText: 'View Screen Glass',
    icon: ShieldCheck,
    iconBg: 'bg-purple-500/10 dark:bg-purple-500/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    id: 'gh-cargo-liner',
    category: 'Interior Protection',
    brand: 'Powerty / TuxMat',
    title: 'High-Wall 3-Row Cargo & Seatback Liner',
    description: 'Full-coverage trunk tub liner that covers trunk floor and fold-flat 3rd row seatbacks.',
    searchQuery: 'Toyota Grand Highlander 3 row cargo liner trunk mat',
    bullets: [
      'Protects trunk and folding 3rd-row seats from muddy gear',
      'Hook-and-loop backing sticks firmly to carpet backing',
      'Flexible hinge fold allows effortless seat transitions',
      'Non-skid textured TPE prevents sports equipment shifting',
    ],
    buttonText: 'View Cargo Liners',
    icon: Layers,
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'gh-dashcam',
    category: 'Vehicle Safety',
    brand: 'FITCAMX',
    title: 'Integrated OEM-Fit 4K Dashcam (TSS 3.0)',
    description: 'Factory-style front dashcam replacing the TSS 3.0 sensor housing without trailing wires.',
    searchQuery: 'FITCAMX 4K dash cam Toyota Grand Highlander TSS 3.0',
    bullets: [
      'TSS 3.0 mirror housing replacement looks completely stock',
      '4K UHD Sony sensor with superior low-light recording',
      'Automatic emergency collision G-sensor loop recording',
      'Direct smartphone companion app for video export',
    ],
    buttonText: 'View OEM Dashcam',
    icon: Video,
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'gh-console-divider',
    category: 'Cabin Storage',
    brand: 'Vehicle OCD',
    title: 'Center Console Dual-Tier Divider Tray',
    description: 'Multi-compartment organizer that splits the deep armrest bin into easily accessible levels.',
    searchQuery: 'Toyota Grand Highlander center console organizer tray divider',
    bullets: [
      'Organizes phones, wallet, sunglasses, keys, and coins',
      'Preserves lower bin room for large items and charging cables',
      'High-density matte black ABS plastic matching interior trim',
      'Anti-rattle non-slip removable rubber base inserts',
    ],
    buttonText: 'View Console Tray',
    icon: Box,
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
];

const CAMRY_PRODUCTS: VettedProduct[] = [
  {
    id: 'camry-screen-protector',
    category: 'Cabin Protection',
    brand: 'Spigen / YEE PIN',
    title: 'Anti-Glare 12.3" Tempered Glass Screen Protector',
    description: 'Ultra-clear 9H hardness tempered glass custom made for the updated Camry widescreen display.',
    searchQuery: 'Toyota Camry 12.3 inch screen protector tempered glass',
    bullets: [
      '9H tempered hardness prevents keys and ring scratches',
      'Anti-fingerprint hydrophobic oleophobic surface',
      'Silicone auto-adhesion eliminates bubbles during installation',
      'Preserves vivid colors and touch responsiveness',
    ],
    buttonText: 'View Screen Protector',
    icon: ShieldCheck,
    iconBg: 'bg-purple-500/10 dark:bg-purple-500/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    id: 'camry-console-organizer',
    category: 'Cabin Storage',
    brand: 'EDBETOS',
    title: 'Center Console Organizer & Armrest Tray',
    description: 'Custom-molded tray maximizing storage utility in the Camry center armrest console.',
    searchQuery: 'Toyota Camry center console organizer tray',
    bullets: [
      'Transforms messy deep compartment into neat dual tiers',
      'Coin holder slots and dedicated phone pocket',
      'Noise-dampening textured rubber mats eliminate rattles',
      'Easy lift-out access to deep lower compartment',
    ],
    buttonText: 'View Console Tray',
    icon: Box,
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    id: 'camry-floor-mats',
    category: 'Interior Protection',
    brand: 'TuxMat / WeatherTech',
    title: 'All-Weather Custom TPE Floor Mats',
    description: 'Heavy-duty laser-fit floor mats protecting front and rear footwells from Canadian road salt.',
    searchQuery: 'Toyota Camry all weather floor mats TPE',
    bullets: [
      'Deep raised edges trap snow, melted slush, and mud',
      'Factory retention clip lock-in stops mat slipping forward',
      'Safe non-toxic TPE remains supple in deep sub-zero cold',
      'Quick hose-off cleaning dries in minutes',
    ],
    buttonText: 'View Floor Mats',
    icon: Layers,
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'camry-fast-charger',
    category: 'Cabin Power',
    brand: 'Anker / Baseus',
    title: 'Dual-Port 65W USB-C Fast Car Charger',
    description: 'Compact metal 12V adapter with 65W Power Delivery to rapidly charge laptops and phones.',
    searchQuery: 'Anker 65W fast USB-C PD car charger',
    bullets: [
      'Dual USB-C and USB-A high-speed fast charging',
      '65W total output powers MacBooks, iPads, and smartphones',
      'Flush-fit aluminum alloy shell with ambient LED ring',
      'Active temperature monitoring protects vehicle battery',
    ],
    buttonText: 'View Fast Charger',
    icon: Zap,
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
];

const PRIUS_PRODUCTS: VettedProduct[] = [
  {
    id: 'prius-screen-protector',
    category: 'Cabin Protection',
    brand: 'Spigen',
    title: 'Anti-Glare 12.3" Infotainment Screen Protector',
    description: 'Premium tempered glass engineered for the 5th-gen Prius center multimedia display.',
    searchQuery: 'Spigen Toyota Prius 12.3 inch screen protector',
    bullets: [
      'Matte anti-glare finish cuts harsh sun reflections on highway',
      '9H surface hardness defends against scratches',
      'Oleophobic coating keeps fingerprints off the touchscreen',
      'Includes alignment frame for bubble-free application',
    ],
    buttonText: 'View Screen Protector',
    icon: ShieldCheck,
    iconBg: 'bg-purple-500/10 dark:bg-purple-500/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    id: 'prius-console-tray',
    category: 'Storage & Organization',
    brand: 'EDBETOS',
    title: 'Center Console Organizer & Coin Tray',
    description: 'Precision molded drop-in organizer tailored for the 5th-gen Prius center armrest.',
    searchQuery: 'Toyota Prius 2023-2026 center console organizer tray',
    bullets: [
      'Custom partitioned slots for key fob, cards, and coins',
      'Non-slip silicone mats prevent rattling during acceleration',
      'Quick lift out to reach lower storage box',
      'Seamless OEM appearance matching Prius cabin plastic',
    ],
    buttonText: 'View Console Tray',
    icon: Box,
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    id: 'prius-floor-liners',
    category: 'Interior Protection',
    brand: '3D MAXpider / TuxMat',
    title: 'All-Weather Heavy-Duty TPE Liners',
    description: 'Laser-measured floor protection customized for the Prius hybrid cabin layout.',
    searchQuery: 'Toyota Prius 2023-2026 all weather floor mats TPE',
    bullets: [
      'High-wall tub design stops liquid spillover onto carpet',
      'Patented bottom layer prevents shifting without pins',
      'Engineered clearance around hybrid battery cooling vents',
      'Ultra-lightweight yet rigid waterproof construction',
    ],
    buttonText: 'View Floor Liners',
    icon: Layers,
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'prius-wireless-carplay',
    category: 'Connectivity',
    brand: 'CarlinKit 5.0 2Air',
    title: 'Plug-and-Play Wireless CarPlay & Auto Adapter',
    description: 'Converts factory wired smartphone connection to immediate 5.8GHz wireless syncing.',
    searchQuery: 'CarlinKit 5.0 2Air wireless CarPlay adapter',
    bullets: [
      'Instant wireless connection when you start your Prius',
      'Fast 5.8GHz transmission with minimal audio lag',
      'Full steering wheel and touchscreen compatibility',
      'Compact form factor tucks neatly into center tray',
    ],
    buttonText: 'View Wireless Adapter',
    icon: Radio,
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
];

const PHEV_EVSE_CHARGER: VettedProduct = {
  id: 'evse-charger',
  category: 'EV Home Charging',
  brand: 'Grizzl-E Classic 40A / Emporia',
  title: 'Level 2 Home EVSE 40A Fast Charger',
  description: 'Heavy-duty 40A / 9.6 kW fast charger to fully recharge your Toyota PHEV in under 2.5 hours.',
  searchQuery: 'Grizzl-E Classic 40A Level 2 EVSE home charger NEMA 14-50',
  bullets: [
    'NEMA 14-50 plug or hardwire capable with flexible 24ft cable',
    'Cast-aluminum NEMA 4 sub-zero Canadian winter weatherproofing',
    'Energy Star certified and eligible for federal/utility rebates',
    'Universal J1772 connector compatible with all Toyota PHEVs',
  ],
  buttonText: 'View Home EVSE',
  icon: Zap,
  iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
  iconColor: 'text-amber-600 dark:text-amber-400',
};

const MODEL_CATALOG: Record<string, VettedProduct[]> = {
  rav4: RAV4_PRODUCTS,
  'rav4-hybrid': RAV4_PRODUCTS,
  'rav4-phev': RAV4_PRODUCTS,
  sienna: SIENNA_PRODUCTS,
  'sienna-hybrid': SIENNA_PRODUCTS,
  'grand-highlander': GRAND_HIGHLANDER_PRODUCTS,
  'grand-highlander-hybrid': GRAND_HIGHLANDER_PRODUCTS,
  camry: CAMRY_PRODUCTS,
  'camry-hybrid': CAMRY_PRODUCTS,
  prius: PRIUS_PRODUCTS,
  'prius-hybrid': PRIUS_PRODUCTS,
  'prius-prime': PRIUS_PRODUCTS,
};

export const ALL_CALCULATOR_PRODUCTS: VettedProduct[] = [
  ...UNIVERSAL_FALLBACKS,
  ...RAV4_PRODUCTS,
  ...SIENNA_PRODUCTS,
  ...GRAND_HIGHLANDER_PRODUCTS,
  ...CAMRY_PRODUCTS,
  ...PRIUS_PRODUCTS,
  PHEV_EVSE_CHARGER,
];

export interface CalculatorGearCardsProps {
  className?: string;
  activeModel?: string;
  isPhev?: boolean;
}

export function CalculatorGearCards({
  className,
  activeModel: propActiveModel,
  isPhev: propIsPhev,
}: CalculatorGearCardsProps) {
  const { isUs } = useMarket();
  const context = useCalculatorContext();

  // Listen to window-level model change events for instant reactivity across client components
  const [eventModelSlug, setEventModelSlug] = useState<string | null>(null);

  useEffect(() => {
    const handleModelChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ model?: string; presetId?: string }>;
      if (customEvent.detail?.model) {
        setEventModelSlug(customEvent.detail.model);
      }
    };
    window.addEventListener('toyotawait:model-change', handleModelChange);
    return () => {
      window.removeEventListener('toyotawait:model-change', handleModelChange);
    };
  }, []);

  const rawModel = propActiveModel || eventModelSlug || context?.activeModelSlug || 'rav4';
  const effectiveIsPhev = propIsPhev ?? context?.isPhev ?? false;

  // Normalize model key
  const modelKey = useMemo(() => {
    const clean = rawModel.toLowerCase().trim();
    if (clean.includes('sienna')) return 'sienna';
    if (clean.includes('grand-highlander') || clean.includes('grand highlander')) return 'grand-highlander';
    if (clean.includes('camry')) return 'camry';
    if (clean.includes('prius')) return 'prius';
    if (clean.includes('rav4')) return 'rav4';
    return clean;
  }, [rawModel]);

  const activeModelDisplay = useMemo(() => {
    if (modelKey === 'sienna') return 'Sienna';
    if (modelKey === 'grand-highlander') return 'Grand Highlander';
    if (modelKey === 'camry') return 'Camry';
    if (modelKey === 'prius') return 'Prius';
    if (modelKey === 'rav4') return effectiveIsPhev ? 'RAV4 PHEV' : 'RAV4 Hybrid';
    return context?.activeModelName || 'Toyota Hybrid';
  }, [modelKey, effectiveIsPhev, context?.activeModelName]);

  // Build the 4-item list based on model and PHEV status
  const products = useMemo(() => {
    const list: VettedProduct[] = [];
    const baseItems = MODEL_CATALOG[modelKey] || [];

    if (effectiveIsPhev) {
      // For PHEVs, prioritize the Level 2 EVSE charger
      list.push(PHEV_EVSE_CHARGER);
      for (const item of baseItems) {
        if (list.length >= 4) break;
        if (item.id !== 'evse-charger' && item.id !== 'rav4-console-organizer') {
          list.push(item);
        }
      }
    } else {
      for (const item of baseItems) {
        if (list.length >= 4) break;
        list.push(item);
      }
    }

    // Fall back to universal essentials if fewer than 4 items
    if (list.length < 4) {
      for (const fallback of UNIVERSAL_FALLBACKS) {
        if (list.length >= 4) break;
        if (!list.some((existing) => existing.id === fallback.id)) {
          list.push(fallback);
        }
      }
    }

    return list.slice(0, 4);
  }, [modelKey, effectiveIsPhev]);

    const getAffiliateUrl = (prod: VettedProduct) => {
    const market = isUs ? 'US' : 'CA';
    return buildAmazonAffiliateUrl({
      asin: prod.asin,
      searchQuery: prod.searchQuery,
      market,
    });
  };

  return (
    <section
      aria-labelledby="recommended-products-heading"
      className={`space-y-4 ${className ?? ''}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-500 uppercase tracking-wider">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Essential Gear</span>
          </div>
          <h2
            id="recommended-products-heading"
            className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100"
          >
            Recommended Products
          </h2>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md">
          Community-tested accessories and equipment curated for the {activeModelDisplay}.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((prod) => {
          const Icon = prod.icon;
          const affiliateUrl = getAffiliateUrl(prod);

          return (
            <Card
              key={prod.id}
              className="flex flex-col justify-between border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
            >
              <CardHeader className="p-3.5 pb-2 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className={`p-1.5 rounded-lg ${prod.iconBg} ${prod.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-medium border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                  >
                    {prod.category}
                  </Badge>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">
                    {prod.brand}
                  </span>
                  <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2">
                    <a
                      href={affiliateUrl}
                      target="_blank"
                      rel="sponsored noopener noreferrer nofollow"
                      className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      {prod.title}
                    </a>
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="p-3.5 pt-0 space-y-3 flex-1 flex flex-col justify-between">
                <ul className="space-y-1.5 text-[11px] text-zinc-600 dark:text-zinc-400">
                  {prod.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-tight">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full h-8 min-h-[32px] text-xs font-semibold flex items-center justify-center gap-1.5 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 cursor-pointer"
                  >
                    <a
                      href={affiliateUrl}
                      target="_blank"
                      rel="sponsored noopener noreferrer nofollow"
                    >
                      <span>{prod.buttonText}</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 text-center pt-1">
        As an Amazon Associate, ToyotaWaits earns from qualifying purchases.
      </p>
    </section>
  );
}
