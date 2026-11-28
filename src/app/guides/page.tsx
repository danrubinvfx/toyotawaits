import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Wrench,
  ArrowRight,
  Sparkles,
  Zap,
  Snowflake,
  ShieldCheck,
  CheckCircle2,
  ClipboardCheck,
  Disc3,
  CalendarClock,
  GitCompare,
  ChevronDown,
} from 'lucide-react';
import { PopularGearCard } from '@/components/guides/popular-gear-card';
import { SeasonalDealBanner } from '@/components/monetization/SeasonalDealBanner';

export const dynamic = 'force-dynamic';
export const { instant } = { instant: false };

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

const POPULAR_GUIDES = [
  {
    slug: 'toyota-diy-maintenance-guide',
    title: 'Toyota DIY Maintenance & Upkeep Guide',
    description:
      'Model-by-model 0W-8, 0W-16, and 0W-20 oil specs, OEM filter numbers, hybrid battery fan filter cleaning, 12V battery care, and clear-coat safe wash gear.',
    badge: 'DIY & Maintenance',
    tags: ['Maintenance', 'DIY', 'Hybrid Care'],
    href: '/guides/toyota-diy-maintenance-guide',
    icon: Wrench,
  },
  {
    slug: 'delivery-prep',
    title: 'Delivery Day Prep & Inspection Checklist',
    description:
      'Zero-Mile Dealership Delivery Inspection & PDI checklist: transit fuse seating, overinflated shipping tires, hybrid cable inspection, and factory accessories check.',
    badge: 'Delivery Checklist',
    tags: ['Checklist', 'Delivery'],
    href: '/delivery-prep',
    icon: ClipboardCheck,
  },
  {
    slug: 'tires',
    title: 'Tire Fitment & Winter Tire Guide',
    description:
      'OEM Tire Sizing & 17-Inch Downsizing Guide: Confirmed bolt patterns (5x114.3 / 5x120), center bore offsets, and 3PMSF winter rubber for all hybrid models.',
    badge: 'Tire & Wheel DB',
    tags: ['Tires', 'Wheels', 'Specs'],
    href: '/tires',
    icon: Disc3,
  },
  {
    slug: 'winter-prep',
    title: 'Toyota Winter Prep & 12V Battery Guide',
    description:
      'Canadian Winter Prep & Salt Protection Guide: BC highway tire laws, Quebec Dec 1 mandates, 12V AGM hybrid auxiliary battery survival, and undercoating dos & don\'ts.',
    badge: 'Seasonal Prep',
    tags: ['Seasonal', 'Winter', 'Essential'],
    href: '/winter-prep',
    icon: Snowflake,
  },
  {
    slug: 'toyota-ecp-warranty-guide',
    title: 'Toyota ECP Extended Warranty Guide',
    description:
      'ECP Platinum vs. Gold breakdown, factory 8yr/160k km hybrid warranty overlap, dealer margins, and the 31-day purchase rule.',
    badge: 'Finance Office Guide',
    tags: ['Finance', 'Warranty'],
    href: '/guides/toyota-ecp-warranty-guide',
    icon: ShieldCheck,
  },
  {
    slug: 'toyota-sienna-trailer-hitch-guide',
    title: 'Sienna Trailer Hitch & Kick-Sensor Guide',
    description:
      'Torklift EcoHitch vs. Curt 13470: Ground clearance, kick-sensor relocation, and plug-and-play 4-flat trailer wiring.',
    badge: 'Hitch & Towing',
    tags: ['Sienna', 'Towing'],
    href: '/guides/toyota-sienna-trailer-hitch-guide',
    icon: Wrench,
  },
  {
    slug: 'toyota-rav4-must-have-accessories',
    title: 'RAV4 Must-Have Accessories',
    description:
      'Community-vetted delivery day gear for 2019–2026 RAV4 Hybrid & PHEV owners: TuxMat, FitcamX 4K, Spigen 9H, and faraday defense.',
    badge: 'Delivery Day Gear',
    tags: ['RAV4', 'Accessories'],
    href: '/guides/toyota-rav4-must-have-accessories',
    icon: Sparkles,
  },
  {
    slug: 'best-toyota-all-weather-floor-mats',
    title: 'Best All-Weather Floor Mats: TuxMat vs. WeatherTech',
    description:
      'Head-to-head comparison for Canadian winters: dead pedal coverage, slush containment, and multi-row minivan fitment.',
    badge: 'Floor Mat Comparison',
    tags: ['Accessories', 'Winter'],
    href: '/guides/best-toyota-all-weather-floor-mats',
    icon: CheckCircle2,
  },
  {
    slug: 'toyota-first-wash-paint-care',
    title: 'First Wash & Clear-Coat Paint Care',
    description:
      'Why to tell your dealer "Do Not Wash," swirl-free ONR & two-bucket washes, and $30 DIY ceramic sealants vs. $899 dealer packages.',
    badge: 'Delivery Day Paint Defense',
    tags: ['Paint Care', 'Zero-Swirl'],
    href: '/guides/toyota-first-wash-paint-care',
    icon: Sparkles,
  },
];

const MODEL_YEAR_ROLLOVER_GUIDES = [
  {
    slug: 'toyota-rav4-2026-vs-2027',
    title: '2026 vs. 2027 Toyota RAV4: NACS Charging, Trims & Wait Times',
    summary: 'Native NACS Tesla charging, 11 kW AC charger, 321 hp PHEV, 9.1" Woodland lift, and delivery queues.',
    model: 'RAV4 Hybrid & PHEV',
    href: '/guides/toyota-rav4-2026-vs-2027',
  },
  {
    slug: 'toyota-sienna-2026-vs-2027',
    title: '2026 vs. 2027 Toyota Sienna: Key Differences & Trim Matrix',
    summary: 'Carryover engineering, full trim matrix, Indiana queue rollovers, and delivery day gear.',
    model: 'Toyota Sienna Hybrid',
    href: '/guides/toyota-sienna-2026-vs-2027',
  },
  {
    slug: 'toyota-grand-highlander-2026-vs-2027',
    title: '2026 vs. 2027 Grand Highlander: Woodland Edition & Trim Matrix',
    summary: 'New Hybrid Woodland Edition, +12mm lift, 1500W inverter, blacked-out MAX Platinum, and Indiana queue rollovers.',
    model: 'Grand Highlander',
    href: '/guides/toyota-grand-highlander-2026-vs-2027',
  },
  {
    slug: 'toyota-corolla-cross-2026-vs-2027',
    title: '2026 vs. 2027 Toyota Corolla Cross Canada: Pricing, Trims & Wait Times',
    summary: '2027 Canadian MSRP increases (~$565–$955), carryover 196-hp hybrid specs, and MTM Huntsville queue rollovers.',
    model: 'Corolla Cross Gas & Hybrid',
    href: '/guides/toyota-corolla-cross-2026-vs-2027',
  },
  {
    slug: 'toyota-tundra-2026-vs-2027',
    title: '2026 vs. 2027 Toyota Tundra Canada: Trailhunter, TSS 4.0 & Wait Times',
    summary: 'New SR5 Trailhunter package, standard 14" screen, TSS 4.0, 122L fuel tank, and San Antonio allocation rollovers.',
    model: 'Tundra i-FORCE & MAX',
    href: '/guides/toyota-tundra-2026-vs-2027',
  },
  {
    slug: 'toyota-sequoia-2026-vs-2027',
    title: '2026 vs. 2027 Toyota Sequoia Canada: Trailhunter, Price Hike & Wait Times',
    summary: 'New SR5 Trailhunter ($95,552 MSRP), +$5,560 base price jump, FOX QS3 TRD Pro shocks, TSS 4.0, and Trailer ADAS.',
    model: 'Sequoia i-FORCE MAX',
    href: '/guides/toyota-sequoia-2026-vs-2027',
  },
  {
    slug: 'toyota-highlander-2026-vs-2027',
    title: '2026 vs. 2027 Toyota Highlander Canada: Gas/Hybrid vs. All-New 3-Row EV',
    summary: 'Transforms into an all-electric 3-row BEV in Canada (up to 515 km range, NACS port, TSS 4.0).',
    model: 'Highlander Hybrid vs. BEV',
    href: '/guides/toyota-highlander-2026-vs-2027',
  },
  {
    slug: 'toyota-camry-2026-vs-2027',
    title: '2026 vs. 2027 Toyota Camry Canada: XSE Special Edition, Pricing & Wait Times',
    summary: 'New 2027 XSE AWD Special Edition ($46,565 MSRP), +$375–$385 price increases, and Kentucky queue rollovers.',
    model: 'Camry Hybrid FWD & AWD',
    href: '/guides/toyota-camry-2026-vs-2027',
  },
  {
    slug: 'toyota-land-cruiser-2026-vs-2027',
    title: '2026 vs. 2027 Toyota Land Cruiser Canada: Price Increase, Specs & Wait Times',
    summary: '+$1,470 to +$2,340 MSRP increase, carryover 326-hp i-FORCE MAX specs, and Tahara allocation rollovers.',
    model: 'Land Cruiser 250',
    href: '/guides/toyota-land-cruiser-2026-vs-2027',
  },
  {
    slug: 'toyota-prius-2026-vs-2027',
    title: '2026 vs. 2027 Toyota Prius & Plug-in Hybrid Canada: Pricing, Trims & Wait Times',
    summary: '+$375–$435 MSRP increases, 72 km EV range carryover, and Tsutsumi Japan allocation queues.',
    model: 'Prius AWD & PHEV',
    href: '/guides/toyota-prius-2026-vs-2027',
  },
  {
    slug: 'toyota-4runner-2026-vs-2027',
    title: '2026 vs. 2027 Toyota 4Runner: Power Seats, Pricing & Wait Times',
    summary: 'Nov 26 update: Base SR5 +$1,220 USD ($43,490 MSRP) with heated 8-way power seats, TRD Sport/Off-Road +$870 USD, carryover 278/326 hp.',
    model: '4Runner i-FORCE & MAX',
    href: '/guides/toyota-4runner-2026-vs-2027',
  },
  {
    slug: 'toyota-tacoma-2026-vs-2027',
    title: '2026 vs. 2027 Toyota Tacoma: Unbundled Options, Pricing & Wait Times',
    summary: 'Nov 28 update: Carryover 278/326 hp powertrains, +$180 USD on Limited/TRD Pro, and unbundled standalone option packages.',
    model: 'Tacoma i-FORCE & MAX',
    href: '/guides/toyota-tacoma-2026-vs-2027',
  },
];

const CROSS_MODEL_COMPARISONS = [
  {
    slug: 'toyota-rav4-vs-sienna',
    matchup: 'RAV4 vs. Sienna',
    takeaway: 'Ground Clearance vs. Sliding Doors & Cargo Packaging',
    href: '/guides/toyota-rav4-vs-sienna',
  },
  {
    slug: 'toyota-corolla-cross-vs-rav4-hybrid',
    matchup: 'Corolla Cross vs. RAV4 Hybrid',
    takeaway: '21.5 vs. 37.5 cu. ft. Cargo, Rear Car Seats & Wait Times',
    href: '/guides/toyota-corolla-cross-vs-rav4-hybrid',
  },
  {
    slug: 'toyota-grand-highlander-vs-lexus-tx',
    matchup: 'Grand Highlander vs. Lexus TX',
    takeaway: '3-Row Space, Acoustic Glass, Luxury Tax & Allocations',
    href: '/guides/toyota-grand-highlander-vs-lexus-tx',
  },
  {
    slug: 'lexus-tx-vs-rx',
    matchup: 'Lexus TX vs. RX',
    takeaway: '3-Row College-Adult Comfort vs. 2-Row Garage Footprint',
    href: '/guides/lexus-tx-vs-rx',
  },
];

const MODEL_MOD_HUBS = [
  {
    slug: 'sienna-mods',
    label: 'Sienna Mods',
    subtitle: 'Road Dog Cruiser & Air Helper Springs',
    href: '/guides/sienna-mods',
  },
  {
    slug: 'rav4-mods',
    label: 'RAV4 Mods',
    subtitle: 'Dashcam, TuxMat & Dash Speakers',
    href: '/guides/rav4-mods',
  },
  {
    slug: 'rav4-se-mods',
    label: 'RAV4 Prime SE → XSE',
    subtitle: 'Skip 12-Mo Queue for ~$700 CAD',
    href: '/guides/rav4-se-mods',
  },
  {
    slug: 'grand-highlander-mods',
    label: 'Grand Highlander Mods',
    subtitle: 'Hatch Flood Lamps & Console Trays',
    href: '/guides/grand-highlander-mods',
  },
  {
    slug: 'prius-mods',
    label: 'Prius Mods',
    subtitle: 'Gen 5 Dashcam, Mud Flaps & TPE Liners',
    href: '/guides/prius-mods',
  },
  {
    slug: 'corolla-mods',
    label: 'Corolla & Cross Mods',
    subtitle: '4-Stage Playbook & Rear Sway Bar',
    href: '/guides/corolla-mods',
  },
  {
    slug: 'sequoia-mods',
    label: 'Sequoia (XK80) Mods',
    subtitle: 'Cargo Leveling & 3" Preload Lift',
    href: '/guides/sequoia-mods',
  },
  {
    slug: 'land-cruiser-mods',
    label: 'Land Cruiser 250 Mods',
    subtitle: '1958 Trim Audio & Trail Armor',
    href: '/guides/land-cruiser-mods',
  },
];

const SPECIALTY_AND_LEXUS_GUIDES = [
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
  {
    slug: 'lexus-gx550-must-have-accessories',
    title: 'Lexus GX 550 Day-One Delivery Checklist',
    description: 'TuxMat liners, FitcamX 4K dashcam, 14" screen shield, and PPF stone-chip armor.',
    icon: Sparkles,
    href: '/guides/lexus-gx550-must-have-accessories',
  },
  {
    slug: 'lexus-tx-delivery-prep-gear',
    title: 'Lexus TX 350 & 500h Delivery Prep Gear',
    description: 'Full 3-row TPE floor liners, 14" screen defense, cargo seatback armor & faraday pouches.',
    icon: ClipboardCheck,
    href: '/guides/lexus-tx-delivery-prep-gear',
  },
  {
    slug: 'lexus-phev-home-charging-setup',
    title: 'Lexus NX 450h+ & RX 450h+ Home Charging',
    description: '6.6 kW charger specs, Grizzl-E winter EVSE, rebates, and sub-zero shore preheating.',
    icon: Zap,
    href: '/guides/lexus-phev-home-charging-setup',
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
          Dealer allocation queues are backed up for months. Prep for delivery day, maintain your
          hybrid or gas powertrain yourself, and skip high-trim markups.
        </p>

        {/* Funnel CTAs: Log Your Order & Check Live Local Stock */}
        <div
          data-testid="guides-funnel-ctas"
          className="flex flex-wrap items-center gap-3 pt-2"
        >
          <Button
            asChild
            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm gap-1.5"
          >
            <Link href="/submit">
              Log Your Order <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 font-bold text-sm gap-1.5"
          >
            <Link href="/inventory">
              Check Live Local Stock <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <SeasonalDealBanner />

      {/* Section 1 — Popular Guides & Ownership Playbooks (Always Visible, Top Grid) */}
      <section className="space-y-6" aria-labelledby="popular-guides-heading">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div>
            <h2
              id="popular-guides-heading"
              className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2"
            >
              <Sparkles className="h-5 w-5 text-amber-500" />
              Popular Guides &amp; Ownership Playbooks
            </h2>
            <p className="text-sm text-zinc-500">
              High-utility evergreen checklists for maintenance, delivery inspection, tires, winter prep, and paint care.
            </p>
          </div>
        </div>

        <div
          data-testid="popular-guides-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {POPULAR_GUIDES.map((guide) => {
            const Icon = guide.icon;
            return (
              <Card
                key={guide.slug}
                className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm flex flex-col justify-between hover:border-amber-500/50 transition-colors"
              >
                <CardHeader className="space-y-2 p-4 pb-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="h-7 w-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 text-[10px] font-semibold">
                      {guide.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
                    {guide.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {guide.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 py-2">
                  <div className="flex flex-wrap gap-1.5">
                    {guide.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px] font-semibold">
                        [{tag}]
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                  <Button
                    asChild
                    className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs gap-1.5"
                  >
                    <Link href={guide.href}>
                      Read Guide <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Section 2 — 2026 vs. 2027 Model-Year Rollover Guides (Always Visible) */}
      <section className="space-y-6" aria-labelledby="rollover-guides-heading">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <h2
            id="rollover-guides-heading"
            className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2"
          >
            <CalendarClock className="h-5 w-5 text-amber-500" />
            2026 vs. 2027 Model-Year Rollover Guides
          </h2>
          <p className="text-sm text-zinc-500">
            Pricing deltas, spec changes, and factory allocation rollover rules for buyers tracking incoming model years.
          </p>
        </div>

        <div
          data-testid="rollover-guides-grid"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {MODEL_YEAR_ROLLOVER_GUIDES.map((guide) => (
            <Card
              key={guide.slug}
              className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-amber-500/50 transition-colors flex flex-col justify-between"
            >
              <CardHeader className="p-4 pb-2 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-500">
                    {guide.model}
                  </Badge>
                  <Badge className="bg-zinc-800 text-zinc-200 text-[10px]">2026 vs. 2027</Badge>
                </div>
                <CardTitle className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                  {guide.title}
                </CardTitle>
                <CardDescription className="text-xs text-zinc-600 dark:text-zinc-400">
                  {guide.summary}
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-4 pt-2">
                <Link
                  href={guide.href}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:text-amber-400 hover:underline"
                >
                  <span>Read Rollover Guide</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Section 3 — Cross-Model & Head-to-Head Comparisons (Collapsible Disclosure) */}
      <section aria-labelledby="cross-model-heading">
        <details
          data-testid="cross-model-comparisons-details"
          className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 sm:p-5 shadow-sm"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <GitCompare className="h-5 w-5 text-amber-500 shrink-0" />
              <h2
                id="cross-model-heading"
                className="text-lg sm:text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50"
              >
                Model-vs-Model Comparison Guides
              </h2>
              <Badge variant="secondary" className="text-xs font-semibold">
                ({CROSS_MODEL_COMPARISONS.length} Guides)
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 shrink-0">
              <span className="group-open:hidden">Show All</span>
              <span className="hidden group-open:inline">Hide</span>
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
            </div>
          </summary>

          <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {CROSS_MODEL_COMPARISONS.map((comp) => (
              <Link
                key={comp.slug}
                href={comp.href}
                className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 px-4 py-3 hover:border-amber-500/50 transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    {comp.matchup}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    {comp.takeaway}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-amber-500 shrink-0" />
              </Link>
            ))}
          </div>
        </details>
      </section>

      {/* Section 4 — Model Modification & Build Hubs (Compact Pill Strip) */}
      <section className="space-y-4" aria-labelledby="mod-hubs-heading">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <h2
            id="mod-hubs-heading"
            className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2"
          >
            <Wrench className="h-5 w-5 text-amber-500" />
            Model Modification &amp; Build Hubs
          </h2>
          <p className="text-sm text-zinc-500">
            Model-specific DIY upgrade playbooks to skip high-trim wait queues and eliminate factory annoyances.
          </p>
        </div>

        <div
          data-testid="model-mod-hubs-strip"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {MODEL_MOD_HUBS.map((hub) => (
            <Link
              key={hub.slug}
              href={hub.href}
              className="group flex items-center justify-between gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 px-3.5 py-3 hover:border-amber-500/50 transition-colors"
            >
              <div className="min-w-0">
                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors truncate">
                  {hub.label}
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                  {hub.subtitle}
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-amber-500 shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      {/* Essential Delivery Day Prep & Gear */}
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

      {/* Specialty EV, Insurance & Lexus Delivery Guides */}
      <section className="space-y-6">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-amber-500" />
            EV Charging, Insurance &amp; Lexus Delivery Guides
          </h2>
          <p className="text-sm text-zinc-500">
            Level 2 EVSE charging, provincial tire mandates, hybrid insurance, and Lexus delivery checklists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SPECIALTY_AND_LEXUS_GUIDES.map((guide) => {
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
    </div>
  );
}
