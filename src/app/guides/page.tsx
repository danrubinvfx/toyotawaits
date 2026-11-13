import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { GuideDisclaimer } from '@/components/common/GuideDisclaimer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Wrench,
  Clock,
  ArrowRight,
  Sparkles,
  Car,
  Volume2,
  Sliders,
  ShieldAlert,
  Zap,
  Snowflake,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ClipboardCheck,
  Play,
  Disc3,
} from 'lucide-react';
import { PopularGearCard } from '@/components/guides/popular-gear-card';

export const revalidate = 60;

export function generateMetadata(): Metadata {
  const currentDate = new Date();
  const currentMonthYear = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  return {
    title: `Toyota DIY Mod Guides & Delivery Prep Almanac (Updated ${currentMonthYear}) | ToyotaWaits.ca`,
    description:
      `Comprehensive Canadian DIY upgrade playbooks and delivery day prep gear for Toyota RAV4 Prime, Sienna, Grand Highlander, and Land Cruiser 250 buyers (Updated ${currentMonthYear}).`,
    alternates: {
      canonical: 'https://www.toyotawaits.ca/guides',
    },
    openGraph: {
      title: `Toyota DIY Mod Guides & Delivery Prep Almanac (Updated ${currentMonthYear})`,
      description:
        'Skip lengthy dealer waitlists with DIY trim upgrades, and prep your vehicle for Canadian roads with community-vetted accessories.',
      url: 'https://www.toyotawaits.ca/guides',
      siteName: 'ToyotaWaits.ca',
      locale: 'en_CA',
      type: 'website',
    },
  };
}

const MOD_GUIDES = [
  {
    slug: 'toyota-corolla-cross-vs-rav4-hybrid',
    title: 'Toyota Corolla Cross vs. RAV4 Hybrid: Sizing, Price & Canadian Wait Times',
    tagline: 'Cargo dimensions (21.5 vs. 37.5 cu. ft.), rear child seat space, Canadian MSRP deltas, and Ontario vs. Alabama allocation queues.',
    badge: 'Compact Crossover Shootout',
    model: 'Corolla Cross vs. RAV4',
    tags: ['Toyota', 'Corolla Cross', 'RAV4', 'Hybrid', 'Sizing', 'Wait Times', 'Canada'],
    highlights: [
      'Dimensions & Cargo: 175.6" length (21.5 cu. ft.) vs 180.9" RAV4 (37.5 cu. ft.) — RAV4 offers +74% cargo volume',
      'Child Seat Clearance: 32.0" rear legroom in Corolla Cross vs 37.8" in RAV4 (+5.8" for rear-facing seats)',
      'Pricing & Efficiency: CC Hybrid from ~$34,500 CAD (5.3 L/100 km) vs RAV4 Hybrid from ~$38,950 CAD (6.0 L/100 km)',
      'Allocation Wait Times: MTM Alabama CC quotas (6–10 mo) vs TMMC Ontario RAV4 production (3–7 mo)',
    ],
    href: '/guides/toyota-corolla-cross-vs-rav4-hybrid',
  },
  {
    slug: 'toyota-grand-highlander-vs-lexus-tx',
    title: 'Toyota Grand Highlander vs. Lexus TX: Space, Wait Times & Luxury Tax',
    tagline: 'TNGA-K platform packaging, adult third-row legroom, acoustic glass & materials, Canadian luxury tax math, and allocation timelines.',
    badge: '3-Row Crossover Shootout',
    model: 'Grand Highlander vs. Lexus TX',
    tags: ['Toyota', 'Lexus', 'Grand Highlander', 'Lexus TX', '3-Row SUVs', 'Wait Times', 'Luxury Tax'],
    highlights: [
      'Identical 116.1" Wheelbase: True 33.5" third-row adult legroom on both TNGA-K platforms',
      'Acoustic Refinement: Dual laminated acoustic side glass & active noise cancelling in TX',
      'Federal Luxury Tax: TX 500h Exec & 550h+ trigger 20% over $100k; GH trims 100% exempt',
      'Queue Bypassing: Avoid 8–14 month GH Hybrid waits with faster 4–8 month TX 350 allocations',
    ],
    href: '/guides/toyota-grand-highlander-vs-lexus-tx',
  },
  {
    slug: 'toyota-rav4-vs-sienna',
    title: 'Toyota RAV4 vs. Sienna: Crossover to Minivan Transition & Allocation Guide',
    tagline: 'Crossover ground clearance vs. sliding door ergonomics, 33.5 cu. ft. flat deck vs. deep sunken trunk well, and Canadian queue rollover rules.',
    badge: 'Family Transition Guide',
    model: 'RAV4 vs. Sienna',
    tags: ['Toyota', 'RAV4', 'Sienna', 'Crossover vs Minivan', 'Sizing', 'Wait Times'],
    highlights: [
      'Ground Clearance: RAV4 8.1"–8.6" snow clearance vs. Sienna 6.4" low step-in',
      'Cargo Packaging: Flat 33.5 cu. ft. crossover deck vs. Sienna 33.5 cu. ft. sunken well + 75.2 cu. ft. stowed',
      'Sliding Door Superpower: Zero door dings in tight parking stalls & stress-free car seat loading',
      'Canadian Queue Rollovers: 4–8 mo RAV4 Prime ($2.5k iZEV) vs. 1–4 mo Sienna LE AWD queue transitions',
    ],
    href: '/guides/toyota-rav4-vs-sienna',
  },
  {
    slug: 'lexus-tx-vs-rx',
    title: 'Lexus TX vs. RX: Sizing, Seating & Allocation Guide',
    tagline: 'Head-to-head dimensions, garage maneuverability, adult passenger legroom, cargo packaging, and Canadian wait times.',
    badge: 'Luxury Family SUV Shootout',
    model: 'Lexus TX vs. RX',
    tags: ['Lexus', 'Sizing', '3-Row vs 2-Row', 'Wait Times'],
    highlights: [
      'Footprint & Turning Circle: RX 192.5" (38.8 ft) vs TX 203.1" (38.0 ft w/ DRS)',
      'Passenger packaging: 3-row college-adult comfort vs midsize Ascent baselines',
      'Cargo capacity: 57.4 cu. ft. behind 2nd row vs 29.6 cu. ft. in RX',
      'Powertrains & Allocations: 4–8 mo RX queue vs 6–12 mo TX 500h/550h+ allocations',
    ],
    href: '/guides/lexus-tx-vs-rx',
  },
  {
    slug: 'lexus-gx550-must-have-accessories',
    title: 'Lexus GX 550 Day-One Delivery Checklist & Essential Accessories',
    tagline: 'Essential delivery-day inspection checklist, TuxMat floor protection, FitcamX 4K OEM dashcam, and PPF stone-chip armor.',
    badge: 'Lexus Luxury Armor',
    model: 'Lexus GX 550',
    tags: ['Lexus', 'Delivery Prep', 'Accessories'],
    highlights: [
      'TuxMat high-wall laser floor liners & dead-pedal protection',
      'FitcamX 4K OEM-integrated LSS+ mirror-tap dashcam',
      'Spigen GlasTR 14" matte 9H tempered glass screen shield',
      'Bluff fascia Paint Protection Film (PPF) strike-zone roadmap',
    ],
    href: '/guides/lexus-gx550-must-have-accessories',
  },
  {
    slug: 'lexus-tx-delivery-prep-gear',
    title: 'Lexus TX 350 & 500h Delivery Prep Guide: 3-Row Protection & Tech',
    tagline: 'Full 3-row high-wall TPE floor liners, 14-inch touchscreen defense, split cargo seatback armor, and relay theft deterrence.',
    badge: '3-Row Protection',
    model: 'Lexus TX 350 & 500h',
    tags: ['Lexus', '3-Row', 'Delivery Prep'],
    highlights: [
      '3-row laser-fit high-wall floor liners with pass-through aisle runners',
      'Spigen 14" matte tempered glass touchscreen protector',
      'Dual-layer Faraday smart-key signal blocking pouches',
      'Split-folding 50/50 cargo mat & 3rd-row seatback armor',
    ],
    href: '/guides/lexus-tx-delivery-prep-gear',
  },
  {
    slug: 'lexus-phev-home-charging-setup',
    title: 'Lexus NX 450h+ & RX 450h+ Home Charging: Level 2 EVSE Setup in Canada',
    tagline: '6.6 kW onboard charger specs, Grizzl-E Canadian winter-rated EVSE, provincial rebates, and sub-zero shore-power preheating.',
    badge: 'PHEV EVSE Setup',
    model: 'Lexus NX 450h+ & RX 450h+',
    tags: ['Lexus', 'EVSE', 'PHEV', 'Winter'],
    highlights: [
      '6.6 kW onboard charger: 2.5-hour 240V full recharge vs 12 hours 120V',
      'Canadian-made Grizzl-E Classic 40A (-40°C winter-rated aluminum EVSE)',
      'Shore-power preheating via Lexus App preserving 100% pure EV range',
      'CEC 80% continuous load electrical panel & provincial grant breakdown',
    ],
    href: '/guides/lexus-phev-home-charging-setup',
  },
  {
    slug: 'toyota-ecp-warranty-guide',
    title: 'Toyota ECP Extended Warranty: Is It Worth It in Canada?',
    tagline: 'Objective breakdown of Toyota Extra Care Protection (ECP Platinum vs. Gold). Real component repair costs, hybrid warranty overlap, dealer margins, and negotiation rules.',
    badge: 'Finance Office Guide',
    model: 'Universal Canadian Guide',
    tags: ['Finance', 'Warranty', 'Buyer Guide'],
    highlights: [
      'Platinum Exclusionary vs Gold Named Component trap analysis',
      'Factory 8yr/160k km hybrid component overlap breakdown',
      'Net cost math: $2,800 retail vs. ~$1,950 true mechanical risk',
      'Dealer negotiation playbook: target wholesale ($1,900–$2,100 CAD)',
    ],
    href: '/guides/toyota-ecp-warranty-guide',
  },
  {
    slug: 'winter-prep',
    title: 'Canadian Winter Prep & Salt Protection Guide',
    tagline: "BC highway tire laws, Quebec Dec 1 mandates, 12V AGM hybrid auxiliary battery survival, and undercoating dos & don'ts.",
    badge: 'Seasonal Prep',
    model: 'Universal Canadian Guide',
    tags: ['Seasonal', 'Winter', 'Essential'],
    highlights: [
      'BC highway tire laws & Quebec Dec 1 winter mandates',
      '12V AGM hybrid auxiliary battery winter survival & jump procedures',
      'Anti-corrosion undercoating dos and don\'ts for high-voltage harnesses',
      'Winter prep checklist: block heaters, winter wipers & frost shields',
    ],
    href: '/winter-prep',
  },
  {
    slug: 'tires',
    title: 'OEM Tire Sizing & 17-Inch Downsizing Guide',
    tagline: 'Confirmed bolt patterns (5x114.3 / 5x120), center bore offsets, and 3PMSF winter rubber for RAV4, Sienna, Grand Highlander, and Corolla.',
    badge: 'Tire & Wheel DB',
    model: 'RAV4, Sienna, Grand Highlander, Corolla',
    tags: ['Tires', 'Wheels', 'Specs'],
    highlights: [
      'Confirmed bolt patterns (5x114.3 / 5x120) and center bore offsets',
      '17-inch downsizing fitment clearing front brake calipers',
      'Top 3PMSF severe snow tires: Michelin X-Ice Snow vs Blizzak WS90',
      'Seasonal tire changeover math & steel wheel downsizing savings',
    ],
    href: '/tires',
  },
  {
    slug: 'delivery-prep',
    title: 'Zero-Mile Dealership Delivery Inspection',
    tagline: 'PDI checklist: transit fuse seating, overinflated shipping tires, hybrid cable inspection, and factory accessories check.',
    badge: 'Delivery Checklist',
    model: 'Universal Delivery Checklist',
    tags: ['Checklist', 'Delivery'],
    highlights: [
      'Pre-Delivery Inspection (PDI) fuse seating & spring spacer removal',
      'Shipping tire pressure deflation (dropping from 45+ PSI)',
      'High-voltage orange cable corroded connector inspection',
      'OMVIC/VSA bill of sale add-on audit & dual key fob verification',
    ],
    href: '/delivery-prep',
  },
  {
    slug: 'toyota-rav4-must-have-accessories',
    title: 'Top 7 Must-Have Toyota RAV4 Accessories (2026)',
    tagline: 'Community-vetted delivery day gear for 2019–2026 RAV4 Hybrid & PHEV owners: TuxMat, FitcamX 4K, Spigen 9H, and faraday defense.',
    badge: 'Delivery Day Gear',
    model: 'RAV4 Hybrid & Prime',
    tags: ['Accessories', 'Gear'],
    highlights: [
      'TuxMat custom-fit high-wall floor liners (Full Dead Pedal)',
      'FitcamX 4K OEM-look integrated mirror dashcam (TSS tap)',
      'Spigen 9H anti-glare tempered screen protector (10.5" / 12.3")',
      'Grizzl-E Level 2 40A sub-zero winter home charger',
    ],
    href: '/guides/toyota-rav4-must-have-accessories',
  },
  {
    slug: 'best-toyota-all-weather-floor-mats',
    title: 'Best Toyota All-Weather Floor Mats: TuxMat vs. WeatherTech vs. OEM',
    tagline: 'Head-to-head comparison for Canadian winters: dead pedal coverage, slush containment, and multi-row minivan fitment.',
    badge: 'Floor Mat Comparison',
    model: 'Multi-Model Benchmark',
    tags: ['Accessories', 'Gear'],
    highlights: [
      'TuxMat vs WeatherTech dead pedal containment breakdown',
      'Sienna Super Long Slide 2nd-row track compatibility',
      'Hybrid battery cooling intake vent obstruction warnings',
      'Model-specific high-wall search cards for RAV4, Sienna & Grand Highlander',
    ],
    href: '/guides/best-toyota-all-weather-floor-mats',
  },
  {
    slug: 'rav4-mods',
    title: 'Must-Have Toyota RAV4 Mods & DIY Upgrades',
    tagline: 'Comprehensive mod playbook for Canadian RAV4 Hybrid, Prime, and Gas owners: dashcams, high-wall liners, and speaker swaps.',
    badge: 'RAV4 Master Playbook',
    model: 'RAV4 Hybrid, Prime & Gas',
    tags: ['Accessories', 'Mods'],
    highlights: [
      'FitcamX OEM 4K Integrated Mirror Dashcam',
      'TuxMat High-Wall Canadian Winter Floor Liners',
      'JBL Club 3.5" Dash Corner Speaker Upgrade',
      'Anti-Glare 9H Tempered Glass Display Shield',
    ],
    href: '/guides/rav4-mods',
  },
  {
    slug: 'rav4-se-mods',
    title: 'Skipping the Wait: Turn Your RAV4 Prime SE into an XSE',
    tagline: 'Skip the 12-month queue: Drop-in audio, tailored leather, and trim tools for ~$700 CAD.',
    badge: 'Skip 6–12 Mo Wait',
    model: 'RAV4 Prime (PHEV)',
    highlights: ['JBL Club 3.5" Dash Speaker Swap', 'Clazzio & EKR Tailored Leather Covers', 'Plug-and-play wiring harnesses'],
    href: '/guides/rav4-se-mods',
  },
  {
    slug: 'sienna-mods',
    title: 'The Road Dog Cruiser: Essential Sienna Family & Road-Trip Mods',
    tagline: 'Fixing rear suspension sag, flying bridge clutter, and pitch-black cargo areas.',
    badge: 'Road-Trip Tested',
    model: 'Toyota Sienna Hybrid',
    highlights: ['Air Lift 1000 in-coil air helper springs', 'Dual-tier center console bridge tray', 'Powerty hatch LED floodlights'],
    href: '/guides/sienna-mods',
  },
  {
    slug: 'toyota-sienna-trailer-hitch-guide',
    title: '2021–2026 Toyota Sienna Trailer Hitch & Kick-Sensor Guide',
    tagline: 'Torklift EcoHitch vs. Curt 13470: Ground clearance, kick-sensor relocation, and trailer wiring.',
    badge: 'Hitch & Towing',
    model: 'Toyota Sienna Hybrid',
    highlights: [
      'Torklift EcoHitch vs Curt 13470 comparison',
      'Kick-sensor relocation & disable instructions',
      'Plug-and-play 4-flat wiring harnesses',
    ],
    href: '/guides/toyota-sienna-trailer-hitch-guide',
  },
  {
    slug: 'toyota-sienna-2026-vs-2027',
    title: '2026 vs. 2027 Toyota Sienna: Key Differences & Trim Matrix',
    tagline: 'Carryover engineering, full trim matrix, Indiana queue rollovers, and delivery day gear.',
    badge: '2026 vs. 2027',
    model: 'Toyota Sienna Hybrid',
    highlights: [
      'Side-by-side carryover specs & 0% mechanical delta',
      'Indiana factory queue rollover explanation',
      'Direct-fit delivery day gear shelf & live stock bridge',
    ],
    href: '/guides/toyota-sienna-2026-vs-2027',
  },
  {
    slug: 'toyota-rav4-2026-vs-2027',
    title: '2026 vs. 2027 Toyota RAV4: NACS Charging, Trims & Wait Times',
    tagline: 'Native NACS Tesla charging, 11 kW AC charger, 321 hp PHEV, 9.1" Woodland lift, and delivery queues.',
    badge: '2026 vs. 2027',
    model: 'RAV4 Hybrid & PHEV',
    highlights: [
      'Native NACS Tesla port & Level 3 DC fast charging',
      '321-hp PHEV upgrade & 11 kW AC home charger',
      '9.1" Woodland lift & $500 iZEV rebate change',
    ],
    href: '/guides/toyota-rav4-2026-vs-2027',
  },
  {
    slug: 'toyota-grand-highlander-2026-vs-2027',
    title: '2026 vs. 2027 Grand Highlander: Woodland Edition & Trim Matrix',
    tagline: 'New Hybrid Woodland Edition, +12mm lift, 1500W inverter, blacked-out MAX Platinum, and Indiana queue rollovers.',
    badge: '2026 vs. 2027',
    model: 'Grand Highlander',
    highlights: [
      'New Hybrid Woodland Edition with +12mm lifted suspension',
      '1,500W high-output AC inverter & standard heated wheel on XLE',
      'Princeton Indiana (TMMI) allocation queue rollover guide',
    ],
    href: '/guides/toyota-grand-highlander-2026-vs-2027',
  },
  {
    slug: 'toyota-corolla-cross-2026-vs-2027',
    title: '2026 vs. 2027 Toyota Corolla Cross: Price, Hybrid Changes & Waitlist Rollover',
    tagline: 'Canadian MSRP expectations, 196-hp Hybrid AWD vs. Gas lead times, MTM Alabama deposit rollovers, and RAV4 Hybrid comparison.',
    badge: '2026 vs. 2027',
    model: 'Corolla Cross Gas & Hybrid',
    highlights: [
      'Expected $400–$850 CAD annual MSRP delta & carryover specs',
      'Hybrid AWD (6–12 mo) vs. Gas AWD (2–5 mo) Canadian waitlists',
      'MTM Huntsville Alabama factory queue rollover rules',
    ],
    href: '/guides/toyota-corolla-cross-2026-vs-2027',
  },
  {
    slug: 'grand-highlander-mods',
    title: 'Big Rig Comfort: Grand Highlander Cabin & Utility Upgrades',
    tagline: 'Drop-in hatch flood illumination, textured anti-slip charging mats, and console dividers.',
    badge: 'Cabin Utility',
    model: 'Grand Highlander',
    highlights: ['OEM PT944-style cargo hatch lamps', 'Textured silicone Qi charging pad mat', 'Winter highway stone-chip prep'],
    href: '/guides/grand-highlander-mods',
  },
  {
    slug: 'land-cruiser-mods',
    title: 'Backroads & Borderlines: LC250 1958 Trim Upgrades',
    tagline: 'Overhaul base 6-speaker paper cones, frame sliders for battery harness protection, and winter rubber.',
    badge: 'Trail & Winter Armor',
    model: 'Land Cruiser 250',
    highlights: ['Drop-in 3.5" & 6.5" speaker upgrade', 'Frame-mounted rock sliders & underside armor', 'Severe snow tire & wheel packages'],
    href: '/guides/land-cruiser-mods',
  },
  {
    slug: 'prius-mods',
    title: 'Must-Have 2023-2026 Toyota Prius & Prius Prime Accessories & Mods',
    tagline: 'The essential exterior armor, interior protection, and tech upgrades for Canadian Gen 5 Prius owners.',
    badge: 'Gen 5 Essential Armor',
    model: 'Prius & Prius Prime',
    highlights: [
      'FitcamX OEM-Integrated 4K Dashcam',
      'Molded Splash Guards & Mud Flap Kit',
      '3D All-Weather TPE Floor & Cargo Liners',
    ],
    href: '/guides/prius-mods',
  },
  {
    slug: 'corolla-mods',
    title: 'Must-Have Toyota Corolla & Corolla Cross Mods & Upgrades',
    tagline: 'The 4-stage playbook: TuxMat liners, FitcamX 4K dashcam, 22mm sway bar, 3.5" tweeter swap, and intake.',
    badge: '4-Stage Playbook',
    model: 'Corolla & Corolla Cross',
    highlights: [
      'TuxMat / WeatherTech All-Weather Liners',
      'FitcamX OEM-Integrated 4K Mirror Dashcam',
      'JBL / Kicker 3.5" Dash Corner Tweeter Swap',
      'TRD / Progress 22mm Rear Sway Bar',
    ],
    href: '/guides/corolla-mods',
  },
  {
    slug: 'sequoia-mods',
    title: 'Must-Have Toyota Sequoia (XK80) Mods & Practical Upgrades',
    tagline: 'Solving the hybrid battery cargo hump, 3-inch preload leveling, 35-inch clearances, and towing stability.',
    badge: 'Full-Size 4WD Playbook',
    model: 'Toyota Sequoia (XK80)',
    highlights: [
      'Aftermarket Cargo Leveling Drawers & Shelves',
      'Westcott Designs 3"/1" Preload Collar Lift',
      'FitcamX OEM 4K Integrated Dashcam',
      'Heavy-Duty Rear Sway Bar & Towing Coils',
    ],
    href: '/guides/sequoia-mods',
  },
];

const PREP_GUIDES = [
  {
    slug: 'toyota-ecp-warranty-guide',
    title: 'Toyota ECP Warranty Guide',
    description: 'ECP Platinum vs. Gold breakdown, factory hybrid warranty overlap, dealer margins, and the 31-day purchase rule.',
    icon: ShieldCheck,
    href: '/guides/toyota-ecp-warranty-guide',
  },
  {
    slug: 'winter-prep',
    title: 'Winter Prep & Salt Protection Guide',
    description: 'BC highway tire laws, Quebec Dec 1 mandates, 12V AGM hybrid auxiliary battery survival, and undercoating dos & don\'ts.',
    icon: Snowflake,
    href: '/winter-prep',
  },
  {
    slug: 'tires',
    title: 'OEM Tire Sizing & 17" Downsizing Guide',
    description: 'Confirmed bolt patterns (5x114.3 / 5x120), center bore offsets, and 3PMSF winter rubber for all hybrid models.',
    icon: Disc3,
    href: '/tires',
  },
  {
    slug: 'delivery-prep',
    title: 'Zero-Mile Dealership Delivery Inspection',
    description: 'PDI checklist: transit fuse seating, overinflated shipping tires, hybrid cable inspection, and factory accessories check.',
    icon: ClipboardCheck,
    href: '/delivery-prep',
  },
  {
    slug: 'ev-charging',
    title: 'Level 2 Home EVSE Charging Guide',
    description: 'Canadian winter charging specs, Grizzl-E and Flo Home chargers, and provincial grants.',
    icon: Zap,
    href: '/guides/ev-charging',
  },
  {
    slug: 'winter-tires',
    title: 'Provincial Winter Tire Mandates & Fitments',
    description: 'BC Mountain Pass and Quebec legal requirements, wheel downsizing, and studless compounds.',
    icon: Snowflake,
    href: '/guides/winter-tires',
  },
  {
    slug: 'insurance',
    title: 'Canadian Hybrid & PHEV Insurance Guide',
    description: 'Battery replacement endorsements, TAG anti-theft tracking, and rate negotiation tips.',
    icon: ShieldCheck,
    href: '/guides/insurance',
  },
];

const POPULAR_GEAR = [
  {
    title: 'FitcamX OEM Integrated 4K Dashcam',
    tagline: 'Replaces TSS mirror shroud with zero dangling cables and no fuse box tapping.',
    price: 'Saves ~$350+ vs dealer install',
    slug: 'fitcamx-rav4',
  },
  {
    title: 'NOCO Boost Plus GB40 1000A Jump Starter',
    tagline: 'Compact 12V lithium rescue pack preventing hybrid ready-state lockouts in freezing temps.',
    price: 'Avoids costly roadside towing',
    slug: 'noco-gb40-jump-pack',
  },
  {
    title: 'Matte 9H Anti-Glare Screen Protector',
    tagline: 'Eliminates touchscreen glare and protects displays against scratches.',
    price: 'Protects expensive OEM display',
    slug: 'screen-protector-rav4',
  },
  {
    title: 'Laser-Fit Center Console Organizer Tray',
    tagline: 'Drop-in dual-tier storage dividing cavernous armrest compartments.',
    price: 'OEM-fit dual-tier storage',
    slug: 'console-tray-rav4',
  },
  {
    title: 'J1772 Charger Port Lock Ring',
    tagline: 'Stops unauthorized public EV charger handle disconnections on PHEV models.',
    price: 'Prevents unplugged charge sessions',
    slug: 'j1772-charger-lock',
  },
];

export default function GuidesIndexPage() {
  const currentDate = new Date();
  const currentMonthYear = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-16 space-y-14">
      {/* Header & Breadcrumb */}
      <div className="space-y-4">
        <BackButton className="mb-4" />

        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-amber-500 text-zinc-950 font-bold gap-1 text-xs hover:bg-amber-400">
            <Wrench className="h-3.5 w-3.5" /> Mod &amp; Prep Almanac
          </Badge>
          <Badge variant="outline" className="border-amber-500/30 text-amber-400 text-xs">
            Canadian Buyer Resource Hub
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          DIY Mod Playbooks &amp; Delivery Day Prep (Updated {currentMonthYear})
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          The piano has been drinking, and dealer allocation queues are backed up for months. Turn your standard trim into a luxury spec, prep for Canadian winter roads, and skip the line.
        </p>
      </div>

      {/* 1. Model-Specific DIY Mod Guides */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <Wrench className="h-5 w-5 text-amber-500" />
              Model-Specific DIY Mod Playbooks
            </h2>
            <p className="text-sm text-zinc-500">
              Community-proven upgrades to skip high-trim wait queues and eliminate factory annoyances.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOD_GUIDES.map((guide) => (
            <Card
              key={guide.slug}
              className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm flex flex-col justify-between hover:border-amber-500/50 transition-colors"
            >
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-400 bg-amber-500/5">
                      {guide.model}
                    </Badge>
                    {guide.tags?.map((t) => (
                      <Badge key={t} variant="secondary" className="text-[10px] font-semibold">
                        [{t}]
                      </Badge>
                    ))}
                  </div>
                  <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-semibold">
                    {guide.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
                  {guide.title}
                </CardTitle>
                <CardDescription className="text-xs text-zinc-600 dark:text-zinc-400">
                  {guide.tagline}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Key Upgrades Covered:</p>
                <ul className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
                  {guide.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                <Button asChild className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs gap-1.5">
                  <Link href={guide.href}>
                    Read Mod Guide <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* 2. Curated Delivery Day Prep & Gear */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-amber-500" />
              Essential Delivery Day Prep Gear
            </h2>
            <p className="text-sm text-zinc-500">
              Drop-in accessories vetted by Canadian owners. No drilling, no wire splicing.
            </p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              As an Amazon Associate I earn from qualifying purchases. Outbound links support ToyotaWaits.ca.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="border-amber-500/40 text-amber-500 hover:bg-amber-500/10 text-xs">
            <Link href="/#gear">
              View Interactive Checklist
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {POPULAR_GEAR.map((item) => (
            <PopularGearCard key={item.slug} item={item} />
          ))}
        </div>
      </section>

      {/* 3. Ownership & Prep Guides */}
      <section className="space-y-6">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-amber-500" />
            Ownership &amp; Cold-Weather Guides
          </h2>
          <p className="text-sm text-zinc-500">
            Canadian winter specifications, Level 2 EV charging, and comprehensive insurance strategies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PREP_GUIDES.map((guide) => {
            const Icon = guide.icon;
            return (
              <Card key={guide.slug} className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{guide.title}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{guide.description}</p>
                </div>
                <Button asChild variant="ghost" size="sm" className="w-full justify-between text-xs text-amber-500 hover:text-amber-400 p-0 h-auto pt-2">
                  <Link href={guide.href}>
                    Read Guide <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Compliance / Affiliate Disclaimer */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 text-xs text-zinc-500 space-y-1.5 bg-zinc-50 dark:bg-zinc-900/40">
        <div className="flex items-center gap-1.5 font-semibold text-zinc-700 dark:text-zinc-300">
          <ShieldCheck className="h-4 w-4 text-amber-500" />
          Affiliate Transparency Notice
        </div>
        <p>
          ToyotaWaits.ca participates in privacy-safe affiliate programs. When you follow product links via <code>/out/[slug]</code>, we may earn an affiliate commission at no extra cost to you. As an Amazon Associate, toyotawaits.ca earns from qualifying purchases at no extra cost to you.
        </p>
      </div>

      {/* Legal & Safety Disclaimer */}
      <GuideDisclaimer />
    </div>
  );
}
