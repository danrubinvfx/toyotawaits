import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { GuideDisclaimer } from '@/components/common/GuideDisclaimer';
import { Rav4VsSiennaDayOneGearShelf } from '@/components/guides/rav4-vs-sienna-day-one-gear';
import {
  Car,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  Maximize2,
  Minimize2,
  Users,
  Briefcase,
  Fuel,
  Clock,
  Layers,
  Sparkles,
  ChevronRight,
  Gauge,
  Warehouse,
  DoorClosed,
  Mountain,
  Baby,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const { instant } = { instant: false };

export function generateMetadata(): Metadata {
  return {
    title: 'Toyota RAV4 vs. Sienna: Sizing, Cargo & Canadian Wait Times | ToyotaWaits',
    description:
      'Deciding between a Toyota RAV4 Hybrid/PHEV and Sienna AWD? Compare cargo packaging, ground clearance, sliding doors, fuel efficiency, and Canadian dealer wait times.',
    alternates: {
      canonical: 'https://www.toyotawaits.ca/guides/toyota-rav4-vs-sienna',
    },
    openGraph: {
      title: 'Toyota RAV4 vs. Sienna: Sizing, Cargo & Canadian Wait Times | ToyotaWaits',
      description:
        'Deciding between a Toyota RAV4 Hybrid/PHEV and Sienna AWD? Compare cargo packaging, ground clearance, sliding doors, fuel efficiency, and Canadian dealer wait times.',
      url: 'https://www.toyotawaits.ca/guides/toyota-rav4-vs-sienna',
      siteName: 'ToyotaWaits.ca',
      locale: 'en_CA',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Toyota RAV4 vs. Sienna: Sizing, Cargo & Canadian Wait Times',
      description:
        'Deciding between a Toyota RAV4 Hybrid/PHEV and Sienna AWD? Footprint, ground clearance, sliding doors, cargo, and Canadian wait times.',
    },
  };
}

const rav4VsSiennaFaqData = [
  {
    question: 'Is the Toyota Sienna significantly harder to park than the RAV4?',
    answer:
      "The Sienna is 204.1 inches long, making it roughly 23 inches longer than the 180.9-inch RAV4. While parallel parking requires a larger curb space, the Sienna's power sliding doors make tight parking lot entry and child seat loading substantially easier with zero risk of door dings.",
  },
  {
    question: 'Can I transfer my Canadian Toyota RAV4 deposit to a Sienna?',
    answer:
      'Yes, at most Canadian dealerships. Because Toyota utilizes a bi-weekly dealer allocation model rather than direct factory ordering, sales managers can typically roll your active deposit to their incoming Sienna allocation queue without financial penalty.',
  },
  {
    question: 'How does cargo volume compare between the RAV4 and Sienna with seats up?',
    answer:
      "While the RAV4 offers 33.5 to 37.5 cu. ft. on a flat floor behind its second row, the Sienna provides an identical 33.5 cu. ft. behind its third row within a deep sunken floor well. Stowing the Sienna's third row expands cargo capacity to over 75 cu. ft., out-hauling the RAV4 with all seats folded flat.",
  },
];

const structuredFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: rav4VsSiennaFaqData.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

const structuredArticleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Toyota RAV4 vs. Sienna: Sizing, Cargo & Canadian Wait Times',
  description:
    'Comprehensive comparison between the 2-row Toyota RAV4 and 3-row Sienna Hybrid for growing Canadian families.',
  author: {
    '@type': 'Organization',
    name: 'ToyotaWaits Editorial Team',
    url: 'https://www.toyotawaits.ca',
  },
  publisher: {
    '@type': 'Organization',
    name: 'ToyotaWaits.ca',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.toyotawaits.ca/assets/icons/favicon-512x512.png',
    },
  },
  mainEntityOfPage: 'https://www.toyotawaits.ca/guides/toyota-rav4-vs-sienna',
};

interface DimensionMetric {
  metric: string;
  rav4Spec: string;
  siennaSpec: string;
  delta: string;
  verdict: 'RAV4 Advantage' | 'Sienna Advantage' | 'Tie / Nuanced';
  notes: string;
}

const DIMENSION_COMPARISON: DimensionMetric[] = [
  {
    metric: 'Overall Length',
    rav4Spec: '180.9 in (4,595 mm)',
    siennaSpec: '204.1 in (5,185 mm)',
    delta: 'RAV4 is 23.2 in (590 mm) shorter',
    verdict: 'RAV4 Advantage',
    notes: 'RAV4 easily fits standard urban garage bays and compact parking stalls; Sienna requires full 20-ft depth.',
  },
  {
    metric: 'Wheelbase',
    rav4Spec: '105.9 in (2,690 mm)',
    siennaSpec: '120.5 in (3,060 mm)',
    delta: 'Sienna is +14.6 in (+370 mm) longer',
    verdict: 'Tie / Nuanced',
    notes: 'Sienna provides ultra-smooth highway tracking, but RAV4 provides a significantly sharper ramp breakover angle.',
  },
  {
    metric: 'Ground Clearance',
    rav4Spec: '8.1"–8.6" (PHEV/Woodland)',
    siennaSpec: '6.4" (Woodland 6.9")',
    delta: 'RAV4 has up to +2.2" higher clearance',
    verdict: 'RAV4 Advantage',
    notes: 'RAV4 clears heavy winter snowplow windrows and rutted cottage trails; Sienna prioritizes low step-in height.',
  },
  {
    metric: 'Cargo Behind Row 2',
    rav4Spec: '33.5 cu. ft. (PHEV) / 37.5 cu. ft.',
    siennaSpec: '75.2 cu. ft. (3rd row stowed)',
    delta: 'Sienna has +37.7–41.7 cu. ft. (+100%) more room',
    verdict: 'Sienna Advantage',
    notes: 'With 3rd row stowed into floor, Sienna swallows 4 adult bikes or a full week of hockey gear without obstructing rear view.',
  },
  {
    metric: 'Cargo Behind Row 3',
    rav4Spec: 'N/A (2-Row Only)',
    siennaSpec: '33.5 cu. ft. (Sunken Tub)',
    delta: 'Sienna matches RAV4 trunk with 7–8 seats up',
    verdict: 'Sienna Advantage',
    notes: 'Sienna deep lower cargo well allows standing full-size strollers or four upright rolling suitcases behind 3rd row.',
  },
  {
    metric: 'Towing Capacity',
    rav4Spec: '1,500–2,500 lbs (Prime)',
    siennaSpec: '3,500 lbs standard',
    delta: 'Sienna pulls +1,000–2,000 lbs more',
    verdict: 'Sienna Advantage',
    notes: 'All Sienna Hybrid trims include engine oil coolers rated for 3,500 lbs; RAV4 Hybrid is capped at 1,750 lbs (2,500 lbs for Prime).',
  },
  {
    metric: 'Combined Fuel Efficiency',
    rav4Spec: '6.0 L/100 km (PHEV 68 km EV)',
    siennaSpec: '6.6–6.8 L/100 km (AWD)',
    delta: 'RAV4 is slightly more frugal; Prime offers EV mode',
    verdict: 'RAV4 Advantage',
    notes: 'RAV4 PHEV offers pure electric commuting; Sienna AWD achieves remarkable 6.7 L/100 km for an 8-passenger hauler.',
  },
];

export default function ToyotaRav4VsSiennaGuidePage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredFaqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredArticleSchema) }}
      />

      {/* Header & Breadcrumbs */}
      <div className="space-y-4">
        <BackButton label="← Back to Guides Almanac" fallbackHref="/guides" className="mb-2" />

        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-amber-500 text-zinc-950 font-bold gap-1 text-xs hover:bg-amber-400">
            <Car className="h-3.5 w-3.5" />
            Family Sizing Shootout
          </Badge>
          <Badge variant="outline" className="border-amber-500/30 text-amber-500 dark:text-amber-300 text-xs font-semibold">
            TNGA-K Architecture
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Compact SUV vs. 3-Row Minivan
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          Toyota RAV4 vs. Sienna: Crossover to Minivan Transition &amp; Allocation Guide
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          It is the classic Canadian family inflection point: you put down a deposit on a fuel-efficient Toyota RAV4 Hybrid or Prime, only to welcome a second child, bulky rear-facing car seats, or travel sports gear. Suddenly, the compact crossover boot feels tight, and the allure of sliding doors and 75 cubic feet of stowed cargo in a Sienna AWD becomes impossible to ignore.
        </p>
      </div>

      {/* Editorial Transparency Notice */}
      <GuideDisclaimer />

      {/* The Core Family Dilemma Overview Card */}
      <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-zinc-900/40 to-zinc-950 text-zinc-100 overflow-hidden shadow-lg">
        <CardHeader className="p-5 sm:p-6 pb-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            The Crossover Bottleneck
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-white mt-1">
            Why Compact SUV Owners Outgrow the RAV4 Faster Than Expected
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 sm:p-6 pt-2 space-y-4 text-sm text-zinc-300 leading-relaxed">
          <p>
            The Toyota RAV4 is Canada&apos;s best-selling passenger vehicle for good reason: it delivers 6.0 L/100 km, confident AWD, and rugged ground clearance. But for growing families, the limits of a 180.9-inch compact crossover quickly surface:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-zinc-300">
            <li><strong>Rear-Facing Car Seat Interference:</strong> Installing an infant seat or convertible seat behind the front passenger forces the front occupant&apos;s knees uncomfortably close to the dashboard.</li>
            <li><strong>Flat-Floor Cargo Jam:</strong> The RAV4&apos;s 33.5–37.5 cu. ft. flat cargo deck fits a full-size stroller, but leaves virtually zero room for grocery boxes, pack-and-plays, or diaper bags without stacking items dangerously above the headrests.</li>
            <li><strong>Parking Lot Contortions:</strong> In tight Canadian suburban grocery stalls, traditional swing-out rear doors create a high-risk squeeze when strapping an uncooperative toddler into a car seat without dinging the neighboring vehicle.</li>
          </ul>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-1">
              <span className="font-bold text-amber-400">Keep the RAV4 Deposit if:</span>
              <p className="text-zinc-300">
                You live in unplowed rural regions requiring 8.6″ ground clearance, have a family of 3 with one stroller, commute daily on pure electric (PHEV Prime 68 km), or prioritize effortless underground condo parking.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-1">
              <span className="font-bold text-amber-400">Pivot to the Sienna Queue if:</span>
              <p className="text-zinc-300">
                You have 2+ kids in car seats, frequently host visiting grandparents, haul hockey bags or bicycles, desire stress-free power sliding doors, and want 6.6 L/100 km AWD efficiency across 8 passenger seats.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Part 1: Physical Footprint, Ramp Breakover & Ground Clearance Matrix */}
      <section className="space-y-6">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Head-to-Head Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            1. Dimensions, Ground Clearance &amp; Packaging Matrix
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Both vehicles share Toyota&apos;s celebrated TNGA-K platform, but calibrate suspension geometry and interior packaging for completely distinct missions.
          </p>
        </div>

        {/* Responsive Comparison Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-100 dark:bg-zinc-900 text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              <tr>
                <th className="p-3.5 sm:p-4">Dimension / Metric</th>
                <th className="p-3.5 sm:p-4 text-zinc-900 dark:text-zinc-100">Toyota RAV4 (Compact SUV)</th>
                <th className="p-3.5 sm:p-4 text-amber-600 dark:text-amber-400">Toyota Sienna (3-Row Minivan)</th>
                <th className="p-3.5 sm:p-4">Variance &amp; Impact</th>
                <th className="p-3.5 sm:p-4">Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950/60 font-medium">
              {DIMENSION_COMPARISON.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                    {row.metric}
                  </td>
                  <td className="p-3.5 sm:p-4 text-zinc-700 dark:text-zinc-300 whitespace-nowrap font-mono text-xs sm:text-sm">
                    {row.rav4Spec}
                  </td>
                  <td className="p-3.5 sm:p-4 text-amber-600 dark:text-amber-400 whitespace-nowrap font-mono text-xs sm:text-sm font-bold">
                    {row.siennaSpec}
                  </td>
                  <td className="p-3.5 sm:p-4 text-xs text-zinc-600 dark:text-zinc-400">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-200 block">{row.delta}</span>
                    <span className="text-[11px] text-zinc-500">{row.notes}</span>
                  </td>
                  <td className="p-3.5 sm:p-4 whitespace-nowrap">
                    <Badge
                      variant={
                        row.verdict === 'RAV4 Advantage'
                          ? 'default'
                          : row.verdict === 'Sienna Advantage'
                          ? 'secondary'
                          : 'outline'
                      }
                      className="text-[11px]"
                    >
                      {row.verdict}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Deep Dive on Clearance vs. Sliding Doors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 space-y-2">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-sm">
              <Mountain className="h-4 w-4 text-amber-500" />
              Ground Clearance: 8.6″ Crossover vs. 6.4″ Minivan
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              The RAV4 features a commanding <strong>8.1 to 8.6 inches</strong> of ground clearance with high approach and departure angles. During heavy Canadian prairie or Ontario blizzards, it easily crests frozen street plow windrows and handles washboard cottage access roads. In contrast, the Sienna sits at <strong>6.4 inches</strong> (or 6.9 inches on Woodland Edition) with a lengthy 120.5-inch wheelbase, which means steep driveway transitions and unplowed ice ruts require slower, angled entry.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 space-y-2">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-sm">
              <DoorClosed className="h-4 w-4 text-amber-500" />
              The Power Sliding Door Superpower
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              What the Sienna loses in off-road clearance, it completely recoups in everyday ergonomics. Its <strong>dual power sliding doors</strong> slide flush along the body panels, opening a massive 30-inch aperture without protruding into neighboring parking spaces. Parents can stand fully upright under an umbrella while buckling children, eliminate door dings against garage drywall, and trigger hands-free kick opening with arms full of groceries.
            </p>
          </div>
        </div>
      </section>

      {/* Part 2: Passenger Ergonomics & Cargo Packaging Analysis */}
      <section className="space-y-6">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Cargo &amp; Cabin Geometry
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            2. Flat Floor vs. Sunken Well: Real-World Luggage Loading
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Why 33.5 cu. ft. in a minivan holds vastly more than 33.5 cu. ft. in a compact crossover.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* RAV4 Cargo Packaging */}
          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-zinc-500" />
                Toyota RAV4 Flat Floor Boot
              </h3>
              <Badge variant="outline" className="text-xs">Flat Cargo Deck</Badge>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              <p>
                <strong>Behind Row 2:</strong> 33.5 cu. ft. (Prime PHEV battery floor) to 37.5 cu. ft. (Gas/HEV). The load floor is elevated to clear the rear electric drive motor and hybrid battery.
              </p>
              <p>
                <strong>The Stroller Dilemma:</strong> A folded full-size stroller (such as an Uppababy Vista) must lie flat on its side, claiming 70% of the usable floor footprint. Adding two rolling suitcases means piling luggage to the ceiling liner, obstructing rear window visibility and creating a projectile hazard during emergency braking.
              </p>
              <p>
                <strong>Max Utility:</strong> 69.8 cu. ft. with the second row folded completely flat. Ideal for two active adults hauling camping gear, but unusable when traveling with children.
              </p>
            </div>
          </div>

          {/* Sienna Cargo Packaging */}
          <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-amber-500" />
                Toyota Sienna Sunken Well &amp; Stowable 3rd Row
              </h3>
              <Badge className="bg-amber-500 text-zinc-950 font-bold text-xs">Deep Trunk Well</Badge>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              <p>
                <strong>Behind Row 3:</strong> 33.5 cu. ft. inside a deep recessed floor well. Because the floor drops 18 inches below the bumper lip, full-size strollers can stand vertically without folding, leaving the remainder of the well open for 4 upright carry-ons.
              </p>
              <p>
                <strong>Row 3 Stowed Mode:</strong> With a single tug of the handle, the 60/40 third-row seats pivot backwards into the floor well, creating a massive <strong>75.2 cu. ft.</strong> cavern while still seating 4 to 5 passengers in supreme comfort.
              </p>
              <p>
                <strong>Super-Long Slide Captain&apos;s Chairs:</strong> In 7-passenger models, the 2nd-row seats slide 25 inches fore-and-aft, allowing parents to pull a toddler right next to the front armrest or push them back for limousine-level legroom.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Part 3: The Deposit Pivot & Queue Rollover Reality */}
      <section className="space-y-6">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Allocation Radar
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            3. The &quot;Deposit Pivot &amp; Queue Rollover&quot; Reality
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            How Canadian dealer allocation mechanics allow deposit holders to pivot queues without losing priority.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-4">
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            In Canada, dealerships do not submit custom bespoke factory orders to Toyota. Instead, dealers receive monthly allocation quotas determined by regional sales velocity. When you place a deposit, you are securing priority on that dealer&apos;s internal waitlist for matching incoming inventory.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-1">
              <span className="text-[11px] font-bold uppercase text-zinc-500">RAV4 PHEV (Prime)</span>
              <div className="text-xl font-black text-zinc-900 dark:text-zinc-100 font-mono">4–8 Mos</div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                $2,000–$2,500 iZEV Rebate
              </p>
              <p className="text-[11px] text-zinc-500">High allocation priority in BC &amp; QC</p>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
              <span className="text-[11px] font-bold uppercase text-amber-600 dark:text-amber-400">Sienna LE AWD (Base)</span>
              <div className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono">1–4 Mos</div>
              <p className="text-xs text-zinc-500 font-semibold">
                $0 EV Rebate (HEV)
              </p>
              <p className="text-[11px] text-zinc-500">Fastest minivan delivery route</p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-1">
              <span className="text-[11px] font-bold uppercase text-zinc-500">Sienna XSE / Limited AWD</span>
              <div className="text-xl font-black text-zinc-900 dark:text-zinc-100 font-mono">6–10+ Mos</div>
              <p className="text-xs text-zinc-500 font-semibold">
                $0 EV Rebate (HEV)
              </p>
              <p className="text-[11px] text-zinc-500">High luxury demand &amp; tight quota</p>
            </div>
          </div>

          <div className="rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 p-4 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>How to Transfer Your Deposit Without Penalty</span>
            </div>
            <p>
              If your family has outgrown the RAV4 while waiting for delivery, contact your dealer&apos;s sales manager. Request to transfer your deposit to their incoming <strong>Sienna LE or XLE AWD</strong> pipeline. Many sales managers will credit your original deposit timestamp, moving you ahead of new minivan inquiries.
            </p>
            <p>
              <strong>The Rebate Trade-Off:</strong> While the RAV4 PHEV qualifies for up to <strong>$2,500 CAD in federal iZEV rebates</strong> (plus BC or Quebec provincial incentives), the self-charging Sienna HEV qualifies for $0 in government EV grants. Factor this rebate difference into your total cost calculation.
            </p>
          </div>
        </div>

        {/* Calculator Linkout Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <Link
            href="/calculator?model=rav4-hybrid"
            className="group p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 hover:border-amber-500/50 transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Financial Calculator
              </span>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">
                Toyota RAV4 Hybrid / Prime Payback Calculator &rarr;
              </h4>
              <p className="text-xs text-zinc-500">
                Calculate fuel savings and iZEV point-of-sale rebates for RAV4 Hybrid &amp; Prime.
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-amber-500 group-hover:translate-x-1 shrink-0 ml-3 transition-transform" />
          </Link>

          <Link
            href="/calculator?model=sienna-hybrid"
            className="group p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 hover:border-amber-500/50 transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Financial Calculator
              </span>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">
                Toyota Sienna Hybrid Savings Calculator &rarr;
              </h4>
              <p className="text-xs text-zinc-500">
                Compare Sienna 6.7 L/100 km gas costs against traditional 3-row V6 crossovers.
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-amber-500 group-hover:translate-x-1 shrink-0 ml-3 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Part 4: Live Inventory Bridges CTA Banner */}
      <section
        aria-label="Weighing RAV4 Maneuverability vs. Sienna Utility"
        className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-zinc-900/90 to-zinc-950 p-6 sm:p-8 shadow-xl text-white relative overflow-hidden"
      >
        <div
          className="absolute -right-16 -top-16 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              Live Dealership Inventory Radar
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Weighing RAV4 Maneuverability vs. Sienna Utility?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Track incoming allocations, port arrivals, and dealer lot stock across Canada:
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              asChild
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Link href="/inventory?model=RAV4">
                <span>View Live RAV4 Stock ↗</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-100 font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
            >
              <Link href="/inventory?model=Sienna">
                <span>View Live Sienna Stock ↗</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Part 5: Family Day-1 Delivery Gear Shelf */}
      <Rav4VsSiennaDayOneGearShelf />

      {/* Part 6: Frequently Asked Questions (FAQ) */}
      <section className="space-y-6 pt-4">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Common Community Inquiries
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Answers to common questions regarding cargo dimensions, parking ease, and Canadian deposit rollover rules.
          </p>
        </div>

        <div className="space-y-4">
          {rav4VsSiennaFaqData.map((faq, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs space-y-2"
            >
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-start gap-2">
                <HelpCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <span>{faq.question}</span>
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed pl-7">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
