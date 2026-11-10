import React, { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { GuideDisclaimer } from '@/components/common/GuideDisclaimer';
import { GrandHighlanderTxDayOneGearShelf } from '@/components/guides/grand-highlander-vs-tx-day-one-gear';
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
  Users,
  Briefcase,
  Fuel,
  Clock,
  Layers,
  Sparkles,
  ChevronRight,
  Gauge,
  Warehouse,
  Volume2,
  DollarSign,
  Zap,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const { instant } = { instant: false };

export function generateMetadata(): Metadata {
  return {
    title: 'Toyota Grand Highlander vs. Lexus TX: Space, Wait Times & Luxury Tax | ToyotaWaits',
    description:
      'Weighing an 8-14 month Grand Highlander wait against an available Lexus TX? Compare TNGA-K platform packaging, third-row legroom, Canadian pricing, and allocation queues.',
    alternates: {
      canonical: 'https://www.toyotawaits.ca/guides/toyota-grand-highlander-vs-lexus-tx',
    },
    openGraph: {
      title: 'Toyota Grand Highlander vs. Lexus TX: Space, Wait Times & Luxury Tax | ToyotaWaits',
      description:
        'Weighing an 8-14 month Grand Highlander wait against an available Lexus TX? Compare TNGA-K platform packaging, third-row legroom, Canadian pricing, and allocation queues.',
      url: 'https://www.toyotawaits.ca/guides/toyota-grand-highlander-vs-lexus-tx',
      siteName: 'ToyotaWaits.ca',
      locale: 'en_CA',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Toyota Grand Highlander vs. Lexus TX: Space, Wait Times & Luxury Tax',
      description:
        'Weighing an 8-14 month Grand Highlander wait against an available Lexus TX? Compare TNGA-K platform packaging, third-row legroom, Canadian pricing, and allocation queues.',
    },
  };
}

const ghVsTxFaqData = [
  {
    question: 'Are the Toyota Grand Highlander and Lexus TX built on the same platform?',
    answer:
      "Yes. Both vehicles are assembled on Toyota's TNGA-K 3-row architecture at Toyota Motor Manufacturing Indiana (TMMI). They share identical wheelbase dimensions (116.1 in) and basic unibody structure, but differ in acoustic glass, suspension valving, interior materials, and powertrain tuning.",
  },
  {
    question: 'Is it faster to get a Lexus TX than a Toyota Grand Highlander in Canada?',
    answer:
      'In many Canadian metro markets, yes. While Grand Highlander Hybrid and Hybrid MAX trims face 8–14 month dealer allocation backlogs, standard Lexus TX 350 gas and TX 500h F SPORT trims often have shorter allocation lead times (4–8 months), making the TX a popular bypass option for buyers willing to pay the luxury premium.',
  },
  {
    question: 'Does the Lexus TX trigger the Canadian Federal Luxury Tax?',
    answer:
      'Yes, on high-spec trims. The TX 500h Executive and TX 550h+ PHEV exceed the $100,000 CAD retail price threshold, incurring the 20% tax on the amount over $100k (or 10% of total vehicle value). Grand Highlander trims remain entirely exempt under this threshold.',
  },
];

const structuredFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: ghVsTxFaqData.map((faq) => ({
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
  headline: 'Toyota Grand Highlander vs. Lexus TX: Space, Wait Times & Luxury Tax',
  description:
    'Detailed Canadian buyer comparison between the Toyota Grand Highlander and Lexus TX covering TNGA-K architecture, cargo, luxury tax thresholds, and delivery lead times.',
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
  mainEntityOfPage: 'https://www.toyotawaits.ca/guides/toyota-grand-highlander-vs-lexus-tx',
};

interface DimensionMetric {
  metric: string;
  ghSpec: string;
  txSpec: string;
  delta: string;
  verdict: 'Identical / Tie' | 'Grand Highlander Advantage' | 'Lexus TX Advantage' | 'Nuanced';
  notes: string;
}

const DIMENSION_COMPARISON: DimensionMetric[] = [
  {
    metric: 'Wheelbase',
    ghSpec: '116.1 in (2,949 mm)',
    txSpec: '116.1 in (2,949 mm)',
    delta: 'Identical (0.0 in)',
    verdict: 'Identical / Tie',
    notes: 'Both share the exact same extended TNGA-K chassis footprint engineered at TMMI in Princeton, Indiana.',
  },
  {
    metric: 'Overall Exterior Length',
    ghSpec: '201.4 in (5,115 mm)',
    txSpec: '203.1 in (5,159 mm)',
    delta: 'TX is +1.7 in (+44 mm) longer',
    verdict: 'Nuanced',
    notes: 'The Lexus spindle body fascia and elongated rear aero bumper overhang add 1.7 inches of overall vehicle length.',
  },
  {
    metric: 'Third-Row Adult Legroom',
    ghSpec: '33.5 in (851 mm)',
    txSpec: '33.5 in (851 mm)',
    delta: 'Identical (0.0 in)',
    verdict: 'Identical / Tie',
    notes: 'Both SUVs provide genuine adult third-row legroom with elevated hip points, eliminating knees-in-chest posture.',
  },
  {
    metric: 'Cargo Behind Row 3 (Seats Up)',
    ghSpec: '20.6 cu. ft. (583 L)',
    txSpec: '20.2 cu. ft. (572 L)',
    delta: 'GH is +0.4 cu. ft. (+11 L) larger',
    verdict: 'Grand Highlander Advantage',
    notes: 'Both easily swallow seven carry-on roller suitcases upright; GH has slightly squarer interior rear D-pillar trim.',
  },
  {
    metric: 'Maximum Cargo (All Rows Stowed)',
    ghSpec: '97.5 cu. ft. (2,761 L)',
    txSpec: '97.0 cu. ft. (2,747 L)',
    delta: 'GH is +0.5 cu. ft. (+14 L) larger',
    verdict: 'Grand Highlander Advantage',
    notes: 'Both deliver class-dominating flat cargo decks capable of accommodating 4x8 plywood sheets at a slight incline.',
  },
  {
    metric: 'Acoustic Dampening & NVH',
    ghSpec: 'Standard acoustic windshield',
    txSpec: 'Dual laminated acoustic side glass + ANC',
    delta: 'TX has substantial acoustic isolation',
    verdict: 'Lexus TX Advantage',
    notes: 'TX incorporates thicker floor damping sheets, dual acoustic side laminate glass, and active cabin noise cancellation.',
  },
  {
    metric: 'Combined Fuel Consumption',
    ghSpec: 'GH Hybrid: 7.0 L/100 km (34 MPG)',
    txSpec: 'TX 500h: 8.6 L/100 km (27 MPG)',
    delta: 'GH Hybrid saves ~1.6 L/100 km',
    verdict: 'Grand Highlander Advantage',
    notes: 'Grand Highlander offers the high-efficiency 2.5L eCVT system; TX starts with the performance-tuned 2.4L Turbo or Hybrid MAX.',
  },
  {
    metric: 'Federal Luxury Tax Exposure',
    ghSpec: '$0 (All trims under $100k CAD)',
    txSpec: 'Up to $2k–$6k on Exec & 550h+ trims',
    delta: 'GH completely avoids Federal Luxury Tax',
    verdict: 'Grand Highlander Advantage',
    notes: 'Grand Highlander pricing tops out near $68k CAD, safely avoiding the 20% federal luxury surcharge on MSRP over $100k.',
  },
];

export default function GrandHighlanderVsLexusTxGuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10 sm:space-y-12">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredFaqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredArticleSchema) }}
      />

      {/* Navigation & Header */}
      <div className="space-y-4">
        <BackButton label="Back to Guides Almanac" />

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs font-semibold"
            >
              TNGA-K Architecture Deep Dive
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Canada Allocation &amp; Luxury Math
            </Badge>
            <Badge variant="outline" className="text-xs">
              Updated November 2026
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
            Toyota Grand Highlander vs. Lexus TX: Space, Wait Times &amp; Luxury Tax
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Weighing an 8–14 month Toyota Grand Highlander wait against an incoming Lexus TX on dealer allocation lots?
            Here is the definitive Canadian breakdown of TNGA-K platform packaging, third-row adult seating ergonomics,
            real acoustic isolation benchmarks, and federal luxury tax calculations.
          </p>
        </div>
      </div>

      <GuideDisclaimer />

      {/* Executive Quick Take */}
      <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-zinc-900/50 to-zinc-950 text-zinc-900 dark:text-zinc-100 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            <span>Executive Verdict for Canadian Buyers</span>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-black">
            The Bypass Playbook: Pay the Luxury Premium or Hold the Queue?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          <p>
            The <strong>Toyota Grand Highlander</strong> and <strong>Lexus TX</strong> share identical core chassis dimensions,
            meaning family passenger comfort, third-row adult legroom (33.5 inches), and behind-row-three cargo space (~20.5 cu. ft.)
            are functionally identical. You do not gain interior volume by moving up to the Lexus.
          </p>
          <p>
            What you <em>do</em> gain with the Lexus TX is <strong>queue acceleration</strong> and <strong>acoustic refinement</strong>.
            While Grand Highlander Hybrid and Hybrid MAX trims face stubborn 8–14 month allocation backlogs across Canada,
            Lexus dealers routinely receive unallocated TX 350 gas and TX 500h F SPORT units with 4–8 month wait times (or immediate delivery).
            The tradeoff is a $12,000 to $18,000 CAD pricing spread—and on top trims, the Canadian Federal Luxury Tax.
          </p>
        </CardContent>
      </Card>

      {/* Part 1: Platform & Dimension Matrix */}
      <section className="space-y-6">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Head-to-Head Specification Matrix
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Platform Dimensions, Seating &amp; Cargo Packaging
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Engineered on Toyota&apos;s modular TNGA-K three-row architecture at Toyota Motor Manufacturing Indiana (TMMI).
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs">
          <table className="w-full text-left text-sm text-zinc-800 dark:text-zinc-200">
            <thead className="bg-zinc-100 dark:bg-zinc-800/80 text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-700">
              <tr>
                <th className="p-3.5 sm:p-4">Dimension / Metric</th>
                <th className="p-3.5 sm:p-4 text-emerald-600 dark:text-emerald-400">Grand Highlander</th>
                <th className="p-3.5 sm:p-4 text-amber-600 dark:text-amber-400">Lexus TX</th>
                <th className="p-3.5 sm:p-4 hidden md:table-cell">Delta &amp; Analysis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {DIMENSION_COMPARISON.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-zinc-900 dark:text-zinc-100">
                    <div>{row.metric}</div>
                    <div className="text-[11px] font-normal text-zinc-500 mt-0.5 md:hidden">
                      {row.notes}
                    </div>
                  </td>
                  <td className="p-3.5 sm:p-4 font-mono font-medium">{row.ghSpec}</td>
                  <td className="p-3.5 sm:p-4 font-mono font-medium">{row.txSpec}</td>
                  <td className="p-3.5 sm:p-4 hidden md:table-cell text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200 block mb-0.5">
                      {row.delta}
                    </span>
                    {row.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Part 2: Third-Row Ergonomics & Acoustic Isolation */}
      <section className="space-y-6">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Passenger Experience &amp; Cabin Acoustics
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Real-World Adult Seating vs. Luxury NVH Isolation
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Users className="h-4 w-4" />
                <span>True 3-Row Adult Packaging</span>
              </div>
              <CardTitle className="text-lg font-bold">Identical 33.5&quot; Legroom Geometry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>
                Unlike the standard Toyota Highlander or Lexus RX L of previous generations, both the Grand Highlander
                and Lexus TX seat 6-foot adults in the third row comfortably on long road trips.
              </p>
              <p>
                Both models feature stadium-style elevated seat cushions that support adult thighs without forcing a
                cramped knees-up posture. Cup holders, smartphone pockets, USB-C ports, and dedicated HVAC vents line both
                third-row armrests.
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Volume2 className="h-4 w-4" />
                <span>The Acoustic Differential</span>
              </div>
              <CardTitle className="text-lg font-bold">Dual Acoustic Laminated Side Glass &amp; ANC</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>
                The primary sensory distinction between the two sister vehicles is cabin noise, vibration, and harshness (NVH).
                While the Grand Highlander uses standard acoustic windshield glass with conventional side windows, the Lexus TX
                employs <strong>dual laminated acoustic front and rear side glass</strong>.
              </p>
              <p>
                Coupled with active noise cancellation (ANC), additional spray foam insulation in the pillars, and
                custom-valved swing-valve dampers, the TX measures 3 to 4 dB quieter at 110 km/h highway speeds on Canadian highways.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Part 3: "Bypassing the Queue" & Canadian Allocation Math */}
      <section className="space-y-6">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Canadian Market Reality
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            &quot;Bypassing the Queue&quot;: Weighing the $12k–$18k Spread vs. 8-Month Wait
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Why impatient Toyota buyers are cross-shopping Lexus TX allocations across the GTA, Calgary, and Metro Vancouver.
          </p>
        </div>

        <div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          <p>
            In Canada, Toyota&apos;s dealer allocation formula severely limits the number of Grand Highlander Hybrids reaching dealerships.
            With high demand and constrained hybrid battery production, Canadian wait times for a Grand Highlander Hybrid or
            Hybrid MAX Platinum consistently track at <strong>8 to 14 months</strong>.
          </p>
          <p>
            By contrast, the Lexus TX pipeline operates with higher dealer margin incentives and a dedicated assembly allocation slot at TMMI.
            Canadian Lexus dealerships in Ontario, Alberta, and British Columbia receive regular allocations of the
            <strong> Lexus TX 350 AWD</strong> (2.4L Turbo Gas, 275 hp) and <strong>TX 500h F SPORT Performance</strong> (366 hp Direct4 AWD)
            with lead times between <strong>4 and 8 months</strong>—and frequently have pipeline units available for assignment on deposit.
          </p>

          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 space-y-2">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <span>The Financial Opportunity Cost Equation</span>
            </h4>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              A buyer waiting 12 months for a Grand Highlander MAX ($68,000 CAD) faces a full year of used vehicle depreciation on their trade-in,
              rental or repair overhead on an aging primary car, and potential model year price hikes. Paying $82,000 CAD for an immediately
              incoming Lexus TX 350 Luxury or TX 500h avoids 6 to 8 months of uncertainty and preserves vehicle trade-in equity.
            </p>
          </div>
        </div>
      </section>

      {/* Part 4: Canadian Federal Luxury Tax Breakdown */}
      <section className="space-y-6">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Statutory Tax Warning
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Does the Lexus TX Trigger the Canadian Federal Luxury Tax?
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Understanding the Select Luxury Items Tax Act threshold on high-trim 3-row SUVs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" />
              <span>100% Luxury Tax Exempt</span>
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Toyota Grand Highlander</h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Every trim of the Toyota Grand Highlander—from the entry XLE Gas (~$53k CAD) through the Limited Hybrid (~$64k CAD)
              to the top-tier Hybrid MAX Platinum (~$68k CAD MSRP)—falls well below the <strong>$100,000 CAD federal threshold</strong>.
              Buyers pay $0 in luxury surcharges.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
              <AlertCircle className="h-4 w-4" />
              <span>Threshold Trigger on Top Trims</span>
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Lexus TX 500h Exec &amp; TX 550h+ PHEV</h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              While the TX 350 AWD ($68k–$79k CAD) and TX 500h F SPORT Base (~$87k CAD) remain exempt, fully loaded
              <strong> TX 500h Executive</strong> and <strong>TX 550h+ Plug-in Hybrid</strong> trims exceed $100,000 CAD retail.
              They incur the federal tax calculated as the <em>lesser</em> of:
            </p>
            <ul className="text-xs text-zinc-600 dark:text-zinc-400 list-disc list-inside space-y-1">
              <li>20% of the retail amount exceeding $100,000 CAD</li>
              <li>10% of the total vehicle value</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Part 5: Interactive Inventory CTA Banner */}
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
              Scan active dealership arrivals, pipeline builds, and unallocated lot units across Ontario, Alberta, and British Columbia:
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              asChild
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Link href="/inventory?model=Grand%20Highlander">
                <span>View Live Grand Highlander Allocations ↗</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-100 font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
            >
              <Link href="/inventory?model=Lexus%20TX">
                <span>View Live Lexus TX Allocations ↗</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Part 6: Luxury Day-1 Delivery Gear Shelf */}
      <Suspense fallback={<div className="h-64 rounded-2xl bg-zinc-100 dark:bg-zinc-800/40 animate-pulse" />}>
        <GrandHighlanderTxDayOneGearShelf />
      </Suspense>

      {/* Part 7: Frequently Asked Questions (FAQ) */}
      <section className="space-y-6 pt-4">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Common Buyer Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Practical answers regarding TNGA-K platform sharing, queue wait times, and Canadian taxes.
          </p>
        </div>

        <div className="space-y-4">
          {ghVsTxFaqData.map((faq, index) => (
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
