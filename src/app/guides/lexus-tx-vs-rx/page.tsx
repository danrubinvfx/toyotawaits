import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { GuideDisclaimer } from '@/components/common/GuideDisclaimer';
import { LexusTxRxDayOneGearShelf } from '@/components/guides/lexus-tx-rx-day-one-gear';
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
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const { instant } = { instant: false };

export function generateMetadata(): Metadata {
  return {
    title: 'Lexus TX vs. RX: Family Sizing, Parking Maneuverability & Wait Times | ToyotaWaits',
    description:
      'Compare the 3-row Lexus TX vs. 2-row Lexus RX. Detailed footprint dimensions, turning radius, adult passenger legroom, cargo capacity, and Canadian delivery wait times.',
    alternates: {
      canonical: 'https://www.toyotawaits.ca/guides/lexus-tx-vs-rx',
    },
    openGraph: {
      title: 'Lexus TX vs. RX: Family Sizing, Parking Maneuverability & Wait Times | ToyotaWaits',
      description:
        'Compare the 3-row Lexus TX vs. 2-row Lexus RX. Detailed footprint dimensions, turning radius, adult passenger legroom, cargo capacity, and Canadian delivery wait times.',
      url: 'https://www.toyotawaits.ca/guides/lexus-tx-vs-rx',
      siteName: 'ToyotaWaits.ca',
      locale: 'en_CA',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Lexus TX vs. RX: Family Sizing, Parking Maneuverability & Wait Times',
      description:
        'Compare the 3-row Lexus TX vs. 2-row Lexus RX. Footprint dimensions, turning radius, adult passenger legroom, cargo capacity, and Canadian delivery wait times.',
    },
  };
}

const txVsRxFaqData = [
  {
    question: 'Is the Lexus TX harder to park and drive than the Lexus RX?',
    answer:
      'Yes. The Lexus TX is 203.1 inches long with a 38.0 ft turning circle, making it nearly 11 inches longer than the 192.5-inch RX (38.8 ft turning circle). Drivers prioritizing tight garage parking or urban agility will find the 2-row RX significantly easier to maneuver.',
  },
  {
    question: 'Which is better for a family of four with adult/college-age kids: Lexus TX or RX?',
    answer:
      'The Lexus TX provides significantly more space for four adult-sized passengers. While the RX seats four comfortably, the TX offers wider hip room, 39.5 inches of second-row legroom, and a cavernous 57.4 cu. ft. of cargo behind the second row for luggage, college gear, or sports equipment.',
  },
  {
    question: 'How do Canadian delivery wait times compare between the Lexus TX and RX?',
    answer:
      'The Lexus RX has higher domestic production volume and shorter average wait times (approx. 4–8 months), whereas the 3-row Lexus TX (especially the TX 500h F SPORT and TX 550h+ PHEV) sees tighter allocations with queues often spanning 6–12 months.',
  },
];

const structuredFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: txVsRxFaqData.map((faq) => ({
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
  headline: 'Lexus TX vs. RX: Family Sizing, Parking Maneuverability & Wait Times',
  description:
    'Comprehensive comparison between the 3-row Lexus TX and 2-row Lexus RX for Canadian luxury SUV buyers.',
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
  mainEntityOfPage: 'https://www.toyotawaits.ca/guides/lexus-tx-vs-rx',
};

interface DimensionMetric {
  metric: string;
  rxSpec: string;
  txSpec: string;
  delta: string;
  verdict: 'RX Advantage' | 'TX Advantage' | 'Tie / Nuanced';
  notes: string;
}

const DIMENSION_COMPARISON: DimensionMetric[] = [
  {
    metric: 'Overall Length',
    rxSpec: '192.5 in (4,890 mm)',
    txSpec: '203.1 in (5,160 mm)',
    delta: 'TX is +10.6 in (+270 mm) longer',
    verdict: 'RX Advantage',
    notes: 'RX easily fits standard 20-ft suburban garages; TX leaves mere inches of bumper clearance.',
  },
  {
    metric: 'Width (w/o mirrors)',
    rxSpec: '75.6 in (1,920 mm)',
    txSpec: '78.3 in (1,990 mm)',
    delta: 'TX is +2.7 in (+70 mm) wider',
    verdict: 'RX Advantage',
    notes: 'RX allows comfortable door opening in narrow condo and underground parking stalls.',
  },
  {
    metric: 'Wheelbase',
    rxSpec: '112.2 in (2,850 mm)',
    txSpec: '116.1 in (2,950 mm)',
    delta: 'TX is +3.9 in (+100 mm) longer',
    verdict: 'TX Advantage',
    notes: 'Longer TX wheelbase enhances high-speed straight-line highway stability and 2nd/3rd row pitch control.',
  },
  {
    metric: 'Turning Circle (Curb-to-Curb)',
    rxSpec: '38.8 ft (11.8 m)',
    txSpec: '38.0 ft (11.6 m)*',
    delta: 'TX is 0.8 ft tighter w/ DRS',
    verdict: 'Tie / Nuanced',
    notes: 'TX 500h includes Dynamic Rear Steering (DRS) cutting turning circle to 38.0 ft; standard TX is ~40.0 ft. TX has larger body overhangs.',
  },
  {
    metric: 'Cargo Behind 2nd Row',
    rxSpec: '29.6 cu. ft. (838 L)',
    txSpec: '57.4 cu. ft. (1,625 L)',
    delta: 'TX has +27.8 cu. ft. (+94%) more space',
    verdict: 'TX Advantage',
    notes: 'TX offers nearly 2x the luggage volume for 4 adult travelers on extended road trips.',
  },
  {
    metric: 'Cargo Behind 3rd Row',
    rxSpec: 'N/A (2-Row Only)',
    txSpec: '20.2 cu. ft. (572 L)',
    delta: 'TX holds 7 carry-on bags with all seats up',
    verdict: 'TX Advantage',
    notes: 'TX maintains a deep lower luggage tub even when seating 6 or 7 full-sized adults.',
  },
  {
    metric: 'Seating Capacity',
    rxSpec: '5 Passengers (2 rows)',
    txSpec: '6 or 7 Passengers (3 rows)',
    delta: 'TX adds genuine 3rd row',
    verdict: 'TX Advantage',
    notes: 'TX offers either a 2nd-row 60/40 bench (7 seats) or executive captain’s chairs with aisle walk-through (6 seats).',
  },
];

export default function LexusTxVsRxGuidePage() {
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
            Lexus Luxury Comparison
          </Badge>
          <Badge variant="outline" className="border-amber-500/30 text-amber-500 dark:text-amber-300 text-xs font-semibold">
            GA-K Platform Shootout
          </Badge>
          <Badge variant="secondary" className="text-xs">
            3-Row TX vs. 2-Row RX
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          Lexus TX vs. RX: Family Sizing, Parking Maneuverability &amp; Wait Times
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          One of the most persistent luxury crossover dilemmas on automotive forums like r/Lexus is choosing between the newly minted 3-row Lexus TX and Canada&apos;s perennial sales benchmark, the 2-row Lexus RX. For families of four with adult or college-age offspring, the decision hinges on garage bay clearance, true luggage carrying capacity, and Canadian allocation queues.
        </p>
      </div>

      {/* Editorial Transparency Notice */}
      <GuideDisclaimer />

      {/* The Core Dilemma Overview Card */}
      <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-zinc-900/40 to-zinc-950 text-zinc-100 overflow-hidden shadow-lg">
        <CardHeader className="p-5 sm:p-6 pb-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            The Real-World Dilemma
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-white mt-1">
            Why Families of Four Get Stuck Between RX &amp; TX
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 sm:p-6 pt-2 space-y-4 text-sm text-zinc-300 leading-relaxed">
          <p>
            When kids are in grade school, a 5-passenger Lexus RX feels spacious and manageable. But as children mature into 5&apos;10&quot;+ teenagers and college students packing hockey gear, ski bags, and dorm wardrobes, the RX&apos;s 29.6 cu. ft. rear boot rapidly becomes a bottleneck.
          </p>
          <p>
            The natural answer seems to be upgrading to the 3-row Lexus TX. However, doing so adds nearly a foot of vehicle length (+10.6 inches) and nearly 3 inches of width (+2.7 inches). Buyers who do not measure their home garage beforehand often discover that parking a 203-inch TX leaves zero walking clearance around the front bumper or forces their second car into the driveway.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-1">
              <span className="font-bold text-amber-400">Choose the Lexus RX if:</span>
              <p className="text-zinc-300">
                You park in a suburban 20-foot garage or downtown underground stalls, prioritize agile city commuting, have a family of 3–4 with occasional luggage, and prefer Cambridge-built availability with 4–8 month wait times.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-1">
              <span className="font-bold text-amber-400">Choose the Lexus TX if:</span>
              <p className="text-zinc-300">
                Your household regularly transports 4+ full-grown adults on 3+ hour highway drives, requires 57.4 cu. ft. of luggage volume with the 3rd row stowed, needs up to 5,000 lbs towing, and can accommodate a 203.1&quot; footprint.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Part 1: Physical Dimensions & Maneuverability Matrix */}
      <section className="space-y-6">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Head-to-Head Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            1. Dimensions &amp; Maneuverability Matrix
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Built on the same modular GA-K chassis architecture, the TX expands the platform to full-size American dimensions.
          </p>
        </div>

        {/* Responsive Comparison Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-100 dark:bg-zinc-900 text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              <tr>
                <th className="p-3.5 sm:p-4">Dimension / Metric</th>
                <th className="p-3.5 sm:p-4 text-zinc-900 dark:text-zinc-100">Lexus RX (2-Row)</th>
                <th className="p-3.5 sm:p-4 text-amber-600 dark:text-amber-400">Lexus TX (3-Row)</th>
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
                    {row.rxSpec}
                  </td>
                  <td className="p-3.5 sm:p-4 text-amber-600 dark:text-amber-400 whitespace-nowrap font-mono text-xs sm:text-sm font-bold">
                    {row.txSpec}
                  </td>
                  <td className="p-3.5 sm:p-4 text-xs text-zinc-600 dark:text-zinc-400">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-200 block">{row.delta}</span>
                    <span className="text-[11px] text-zinc-500">{row.notes}</span>
                  </td>
                  <td className="p-3.5 sm:p-4 whitespace-nowrap">
                    <Badge
                      variant={
                        row.verdict === 'RX Advantage'
                          ? 'default'
                          : row.verdict === 'TX Advantage'
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

        {/* Turning Radius & Garage Maneuverability Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 space-y-2">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-sm">
              <Warehouse className="h-4 w-4 text-amber-500" />
              Garage Depth &amp; Walkaround Clearance
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Standard Canadian suburban homes built by builders like Mattamy or Greenpark feature garage depths measuring <strong>240 inches (20 feet)</strong> from the rear drywall to the overhead roll-up track. A 192.5-inch RX leaves a generous <strong>47.5 inches (~4 feet)</strong> of walkway to access workbenches or trash bins. A 203.1-inch TX leaves only <strong>36.9 inches (~3 feet)</strong> total clearance—split between front and rear, giving you barely 18 inches at each bumper.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 space-y-2">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-sm">
              <Gauge className="h-4 w-4 text-amber-500" />
              Turning Radius &amp; Dynamic Rear Steer (DRS)
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              On paper, the Lexus TX 500h F SPORT boasts a <strong>38.0 ft</strong> turning circle—tighter than the standard RX (38.8 ft)—thanks to its active Dynamic Rear Steer (DRS) system that turns the rear wheels up to 4 degrees in opposite phase. However, do not let that number mislead you: the TX has significantly longer front and rear body overhangs, demanding greater swing radius when pulling into narrow Costco parking stalls.
            </p>
          </div>
        </div>
      </section>

      {/* Part 2: The Ascent / Midsize Benchmark */}
      <section className="space-y-4">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Household Context
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            2. The &quot;Ascent / Midsize Benchmark&quot; Section
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            How does the TX compare to familiar 3-row crossover baselines like the Subaru Ascent, Toyota Highlander, or Honda Pilot?
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-4">
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            Many cross-shoppers coming from midsize 3-row family vehicles—such as the <strong>Subaru Ascent (196.8 inches)</strong> or standard <strong>Toyota Highlander (194.9 inches)</strong>—assume the Lexus TX will drive identically to their familiar household crossover. In reality, the TX sits in a completely different vehicle class:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-1">
              <span className="text-[11px] font-bold uppercase text-zinc-500">Lexus RX</span>
              <div className="text-xl font-black text-zinc-900 dark:text-zinc-100 font-mono">192.5″</div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                4.3″ shorter than Ascent
              </p>
              <p className="text-[11px] text-zinc-500">Nimble, easy parallel parking</p>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
              <span className="text-[11px] font-bold uppercase text-amber-600 dark:text-amber-400">Subaru Ascent (Benchmark)</span>
              <div className="text-xl font-black text-zinc-900 dark:text-zinc-100 font-mono">196.8″</div>
              <p className="text-xs text-zinc-500 font-semibold">
                Midsize 3-Row Baseline
              </p>
              <p className="text-[11px] text-zinc-500">Tight 3rd row, moderate cargo</p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-1">
              <span className="text-[11px] font-bold uppercase text-zinc-500">Lexus TX</span>
              <div className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono">203.1″</div>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                6.3″ longer than Ascent
              </p>
              <p className="text-[11px] text-zinc-500">Full-size hauler, genuine adult 3rd row</p>
            </div>
          </div>

          <div className="rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 p-4 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>The Badge Misconception: Why Badge Familiarity Deceives Buyers</span>
            </div>
            <p>
              Buyers assuming the TX is &quot;just an RX with extra seats&quot; or &quot;more manageable than a Tahoe&quot; are often startled during home test drives. While the RX is 4.3 inches shorter than an Ascent, the TX is a substantial <strong>6.3 inches longer than an Ascent</strong> and over <strong>8 inches longer than a Highlander</strong>. The RX is the compact, maneuverable sibling; the TX is a true heavyweight hauler built for maximum interior cubic volume.
            </p>
          </div>
        </div>
      </section>

      {/* Part 3: Passenger Seating & Cargo Packaging Analysis */}
      <section className="space-y-6">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Cabin Packaging Deep Dive
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            3. Passenger Seating &amp; College-Age Cargo Packaging
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            How four adult-sized passengers fare on 500-km highway trips, weekend tournaments, and moving day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lexus RX Passenger & Cargo Reality */}
          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Users className="h-4 w-4 text-zinc-500" />
                Lexus RX (5-Passenger Cockpit)
              </h3>
              <Badge variant="outline" className="text-xs">2 Rows Only</Badge>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              <p>
                <strong>2nd-Row Legroom:</strong> 37.4 inches (950 mm). Generous for growing children or medium-build adults, but passengers over 6 feet tall will find their knees touching the contoured front seatbacks if front occupants recline.
              </p>
              <p>
                <strong>The 4-Adult Bottleneck:</strong> When 4 adults embark on a weekend ski getaway to Whistler or Mont-Tremblant, the RX&apos;s 29.6 cu. ft. trunk fills up with 3 large rolling bags and boot duffels. Additional gear is forced into the center rear seat, reducing cabin refinement.
              </p>
              <p>
                <strong>Third Row:</strong> None. Lexus discontinued the RX 350L (the extended RX with a cramped emergency 3rd row) with the 2023 redesign. The current RX is strictly a 2-row luxury tourer.
              </p>
            </div>
          </div>

          {/* Lexus TX Passenger & Cargo Reality */}
          <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-500" />
                Lexus TX (6 or 7-Passenger Hauler)
              </h3>
              <Badge className="bg-amber-500 text-zinc-950 font-bold text-xs">Adult 3rd Row</Badge>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              <p>
                <strong>2nd-Row Legroom:</strong> 39.5 inches (1,003 mm). First-class limousine comfort with slide-and-recline captain&apos;s chairs, independent rear tri-zone climate controls, and a removable center console box for aisle walk-through.
              </p>
              <p>
                <strong>3rd-Row Legroom:</strong> 33.5 inches (851 mm). Unlike the knees-in-chest 3rd row of an Ascent (31.7″) or Highlander (27.7″), the TX seats two 6-foot adults in complete comfort with standard cupholders, USB-C ports, and dedicated ceiling AC vents.
              </p>
              <p>
                <strong>57.4 cu. ft. Road Trip Mode:</strong> With the power 50/50 third row stowed flat into the floor, the TX swallows 4 full-sized hockey bags, golf club hardcases, or college dorm furniture with room to spare under the tonneau cover line.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Part 4: Powertrains, Fuel Economy & Payback Breakdown */}
      <section className="space-y-6">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Mechanical &amp; Efficiency Matchup
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            4. Powertrains, Fuel &amp; Luxury Tax Payback
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Gas turbo, standard self-charging hybrid, high-performance turbo hybrid, and plug-in PHEV comparisons.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* RX Powertrains */}
          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Fuel className="h-4 w-4 text-emerald-500" />
              Lexus RX Lineup &amp; Fuel Consumption
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
              <li className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <strong>RX 350 AWD (Gas Turbo):</strong> 2.4L Turbo 4-cyl (275 hp / 317 lb-ft). Fuel: <strong>11.2 / 8.4 / 9.9 L/100 km</strong>. Towing: 3,500 lbs.
              </li>
              <li className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <strong>RX 350h AWD (Hybrid Benchmark):</strong> 2.5L HEV + eFour (246 hp). Combined: <strong>6.5 L/100 km</strong>. Best-in-class commuter payback.
              </li>
              <li className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <strong>RX 450h+ AWD (PHEV):</strong> 18.1 kWh battery with <strong>56 km pure electric range</strong>. Combined: <strong>6.7 L/100 km</strong> once battery is depleted.
              </li>
              <li className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <strong>RX 500h F SPORT Performance:</strong> 2.4L Turbo + DIRECT4 (366 hp / 406 lb-ft). Combined: <strong>8.9 L/100 km</strong>.
              </li>
            </ul>
          </div>

          {/* TX Powertrains */}
          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Fuel className="h-4 w-4 text-amber-500" />
              Lexus TX Lineup &amp; Fuel Consumption
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
              <li className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <strong>TX 350 AWD (Gas Turbo):</strong> 2.4L Turbo 4-cyl (275 hp / 317 lb-ft). Fuel: <strong>11.5 / 8.9 / 10.3 L/100 km</strong>. Towing: 5,000 lbs standard.
              </li>
              <li className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <strong>TX 500h F SPORT Performance (HEV):</strong> 2.4L Turbo + DIRECT4 + DRS (366 hp / 406 lb-ft). Combined: <strong>8.6 L/100 km</strong>.
              </li>
              <li className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <strong>TX 550h+ AWD (Plug-in V6 PHEV):</strong> 3.5L V6 PHEV + DIRECT4 (404 hp). <strong>53 km EV range</strong>. Combined: <strong>8.1 L/100 km</strong>.
              </li>
              <li className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 text-[11px] text-zinc-500">
                *Note: Lexus does NOT offer the ultra-frugal 2.5L (6.5 L/100 km) hybrid in the TX due to vehicle curb weight (4,900+ lbs).
              </li>
            </ul>
          </div>
        </div>

        {/* Calculator Linkout Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <Link
            href="/calculator?model=lexus-tx"
            className="group p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 hover:border-amber-500/50 transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Financial Calculator
              </span>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">
                Lexus TX Fuel &amp; Luxury Tax Calculator &rarr;
              </h4>
              <p className="text-xs text-zinc-500">
                Estimate Canadian federal luxury tax, annual fuel costs, and 5-year ownership totals.
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-amber-500 group-hover:translate-x-1 shrink-0 ml-3 transition-transform" />
          </Link>

          <Link
            href="/calculator?model=lexus-rx"
            className="group p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 hover:border-amber-500/50 transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Financial Calculator
              </span>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">
                Lexus RX Hybrid Payback Calculator &rarr;
              </h4>
              <p className="text-xs text-zinc-500">
                Calculate break-even miles comparing the RX 350h Hybrid vs. Gas RX 350 at Canadian gas prices.
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-amber-500 group-hover:translate-x-1 shrink-0 ml-3 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Part 5: Canadian Allocation Reality & Wait-Time Comparison */}
      <section className="space-y-4">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Allocation Radar
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            5. Factory Assembly Lines &amp; Canadian Wait Times
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Why RX allocations move significantly faster across Canadian dealerships than the TX.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-zinc-600 dark:text-zinc-300">
          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold">
              <Clock className="h-4 w-4 text-emerald-500" />
              Lexus RX: 4–8 Months (Cambridge, ON)
            </div>
            <p className="text-xs leading-relaxed">
              The Lexus RX is manufactured right at <strong>Toyota Motor Manufacturing Canada (TMMC) in Cambridge, Ontario</strong>. With dedicated domestic line priority, rapid rail distribution to Canadian metros, and high production volume, the RX 350 and RX 350h maintain stable queue times averaging <strong>120 to 240 days (4 to 8 months)</strong>. Certain metropolitan dealerships even receive unallocated pipeline cancellations monthly.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold">
              <Clock className="h-4 w-4 text-amber-500" />
              Lexus TX: 6–12 Months (Princeton, IN)
            </div>
            <p className="text-xs leading-relaxed">
              The Lexus TX is assembled exclusively at <strong>Toyota Motor Manufacturing Indiana (TMMI)</strong>, sharing final assembly lines with the in-demand Toyota Grand Highlander. Because the vast majority of TMMI capacity is earmarked for high-volume US dealership networks, Canadian dealers receive very constrained monthly allocation quotas—pushing TX 350 wait times to <strong>6–9 months</strong> and TX 500h / 550h+ PHEV queues past <strong>9–12 months</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Part 6: Live Inventory Bridges CTA Banner */}
      <section
        aria-label="Checking Allocation Lead Times in Canada"
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
              Checking Allocation Lead Times in Canada?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Compare current in-transit arrivals and dealer waitlists across BC and Ontario:
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              asChild
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Link href="/inventory?model=Lexus%20TX">
                <span>View Live TX Stock ↗</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-100 font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
            >
              <Link href="/inventory?model=Lexus%20RX">
                <span>View Live RX Stock ↗</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Part 7: Luxury Day-1 Delivery Gear Shelf */}
      <LexusTxRxDayOneGearShelf />

      {/* Part 8: Frequently Asked Questions (FAQ) */}
      <section className="space-y-6 pt-4">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Common Community Inquiries
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Clear answers to common questions about parking, seating, and allocations for the Lexus TX and RX.
          </p>
        </div>

        <div className="space-y-4">
          {txVsRxFaqData.map((faq, index) => (
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
