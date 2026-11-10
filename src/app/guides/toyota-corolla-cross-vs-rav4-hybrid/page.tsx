import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { GuideDisclaimer } from '@/components/common/GuideDisclaimer';
import { CorollaCrossVsRav4DayOneGearShelf } from '@/components/guides/corolla-cross-vs-rav4-day-one-gear';
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
  Baby,
  Calculator,
  ExternalLink,
  Factory,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const { instant } = { instant: false };

export function generateMetadata(): Metadata {
  return {
    title: 'Toyota Corolla Cross vs. RAV4 Hybrid (2026–2027): Sizing, Price & Canadian Wait Times | ToyotaWaits',
    description:
      'Deciding between a Corolla Cross Hybrid and RAV4 Hybrid? Compare real cargo dimensions, e-AWD powertrains, Canadian MSRP price deltas, and dealership allocation wait times.',
    alternates: {
      canonical: 'https://www.toyotawaits.ca/guides/toyota-corolla-cross-vs-rav4-hybrid',
    },
    openGraph: {
      title: 'Toyota Corolla Cross vs. RAV4 Hybrid (2026–2027): Sizing, Price & Canadian Wait Times | ToyotaWaits',
      description:
        'Deciding between a Corolla Cross Hybrid and RAV4 Hybrid? Compare real cargo dimensions, e-AWD powertrains, Canadian MSRP price deltas, and dealership allocation wait times.',
      url: 'https://www.toyotawaits.ca/guides/toyota-corolla-cross-vs-rav4-hybrid',
      siteName: 'ToyotaWaits.ca',
      locale: 'en_CA',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Toyota Corolla Cross vs. RAV4 Hybrid (2026–2027): Sizing, Price & Canadian Wait Times',
      description:
        'Deciding between a Corolla Cross Hybrid and RAV4 Hybrid? Compare real cargo dimensions, e-AWD powertrains, Canadian MSRP price deltas, and dealership allocation wait times.',
    },
  };
}

const corollaCrossVsRav4FaqData = [
  {
    question: 'Is the Corolla Cross Hybrid significantly smaller than the RAV4 Hybrid?',
    answer:
      'Yes. The Corolla Cross is roughly 6 inches shorter (175.6" vs. 180.9") and offers 21.5 cu. ft. of rear cargo space compared to 37.5 cu. ft. in the RAV4. Rear legroom is noticeably tighter (32.0" vs. 37.8"), making the RAV4 much more accommodating for rear-facing child seats.',
  },
  {
    question: 'How do Canadian wait times compare between the Corolla Cross Hybrid and RAV4 Hybrid?',
    answer:
      'Corolla Cross Hybrid models face 6 to 12 month waitlists in Canada due to tight factory allocations from the MTM Alabama plant. RAV4 Hybrid wait times typically range from 3 to 8 months thanks to higher production output from Toyota Motor Manufacturing Canada (TMMC) in Ontario.',
  },
  {
    question: 'Is the $5,000–$8,000 price premium for a RAV4 Hybrid worth it over a Corolla Cross Hybrid?',
    answer:
      "If you frequently haul adult passengers, install bulky car seats, or need 1,750 lb towing capacity, the RAV4 Hybrid's extra cabin room and 219 hp powertrain justify the cost. For solo commuters and couples prioritizing maneuverability and standard e-AWD at under $37,000 CAD, the Corolla Cross is the better value.",
  },
];

const structuredFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: corollaCrossVsRav4FaqData.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
    },
  })),
};

const structuredArticleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Toyota Corolla Cross vs. RAV4 Hybrid (2026–2027): Sizing, Price & Canadian Wait Times',
  description:
    'Comprehensive Canadian buying guide and dimension comparison between the Corolla Cross Hybrid and RAV4 Hybrid.',
  author: {
    '@type': 'Organization',
    name: 'ToyotaWaits Editorial Team',
  },
  publisher: {
    '@type': 'Organization',
    name: 'ToyotaWaits.ca',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.toyotawaits.ca/favicon.ico',
    },
  },
  datePublished: '2026-11-09T00:00:00.000Z',
  dateModified: '2026-11-09T00:00:00.000Z',
  mainEntityOfPage: 'https://www.toyotawaits.ca/guides/toyota-corolla-cross-vs-rav4-hybrid',
};

export default function CorollaCrossVsRav4GuidePage() {
  return (
    <main className="min-h-screen pt-4 sm:pt-6 pb-20 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredFaqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredArticleSchema) }}
      />

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 space-y-10">
        {/* Navigation & Header */}
        <div className="space-y-4">
          <BackButton fallbackHref="/guides" label="← Back to Guides &amp; Almanac" />

          {/* Breadcrumbs */}
          <nav className="flex items-center text-xs text-zinc-500 gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
            <Link href="/guides" className="hover:text-red-600 transition-colors">
              Guides
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              Corolla Cross vs. RAV4 Hybrid
            </span>
          </nav>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Compact Crossover Shootout &bull; Canadian Market</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">
              Toyota Corolla Cross vs. RAV4 Hybrid (2026–2027)
            </h1>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
              Facing the compact crossover dilemma? Compare real cargo dimensions, 5th-Gen vs. Dynamic Force e-AWD powertrains, Canadian MSRP pricing deltas, and dealership allocation wait times across Canada.
            </p>
          </div>
        </div>

        {/* Quick Decision Executive Summary Banner */}
        <div className="p-5 sm:p-6 rounded-2xl border-2 border-red-500/30 bg-gradient-to-br from-red-50/80 via-white to-zinc-50 dark:from-red-950/20 dark:via-zinc-900/60 dark:to-zinc-950 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white font-black text-xs">
              ✓
            </span>
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-zinc-50">
              The 30-Second Verdict for Canadian Buyers
            </h2>
          </div>
          <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
            The <strong>Corolla Cross Hybrid</strong> is the ultimate agile urban commuter: standard electronic AWD, exceptional <strong>5.3 L/100 km</strong> efficiency, and a budget-friendly starting price under <strong>$35,000 CAD</strong>. However, tight Canadian quotas from Mazda Toyota Manufacturing (MTM) in Huntsville, Alabama create <strong>6–12 month backlogs</strong>. Meanwhile, the Ontario-built (TMMC) <strong>RAV4 Hybrid</strong> offers <strong>74% more cargo volume (37.5 vs. 21.5 cu. ft.)</strong>, superior rear legroom for child car seats, and shorter waitlists (<strong>3–8 months</strong>), justifying its $5,000–$8,000 MSRP premium for active families.
          </p>
        </div>

        {/* SECTION 1: Head-to-Head Specification Matrix */}
        <section className="space-y-4" aria-labelledby="specs-matrix-heading">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              <Gauge className="w-4 h-4" />
              <span>Direct Benchmark Comparison</span>
            </div>
            <h2 id="specs-matrix-heading" className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
              Head-to-Head Specification Matrix
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              Key dimensions, powertrain metrics, Canadian pricing, and factory allocation data verified for 2026–2027 model years.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 uppercase tracking-wider font-bold text-[11px] border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th scope="col" className="p-3.5 sm:p-4">Specification</th>
                  <th scope="col" className="p-3.5 sm:p-4 text-red-600 dark:text-red-400">Corolla Cross Hybrid SE AWD</th>
                  <th scope="col" className="p-3.5 sm:p-4 text-zinc-900 dark:text-zinc-100">RAV4 Hybrid LE AWD</th>
                  <th scope="col" className="p-3.5 sm:p-4">Key Takeaway</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                  <td className="p-3.5 sm:p-4 font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Fuel className="w-4 h-4 text-amber-500 shrink-0" />
                    Starting MSRP (CAD)
                  </td>
                  <td className="p-3.5 sm:p-4 font-mono font-bold text-red-600 dark:text-red-400">~$34,500 CAD</td>
                  <td className="p-3.5 sm:p-4 font-mono font-bold text-zinc-900 dark:text-zinc-100">~$37,500 – $39,500 CAD</td>
                  <td className="p-3.5 sm:p-4 text-xs text-zinc-600 dark:text-zinc-400">Corolla Cross saves $3,000–$5,000 on entry-trim MSRP</td>
                </tr>

                <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                  <td className="p-3.5 sm:p-4 font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-blue-500 shrink-0" />
                    Powertrain &amp; Output
                  </td>
                  <td className="p-3.5 sm:p-4 text-zinc-700 dark:text-zinc-300">
                    2.0L 5th-Gen Hybrid (<strong>196 hp</strong>)
                  </td>
                  <td className="p-3.5 sm:p-4 text-zinc-700 dark:text-zinc-300">
                    2.5L Dynamic Force Hybrid (<strong>219 hp</strong>)
                  </td>
                  <td className="p-3.5 sm:p-4 text-xs text-zinc-600 dark:text-zinc-400">RAV4 offers +23 hp for passing and towing confidence</td>
                </tr>

                <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                  <td className="p-3.5 sm:p-4 font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Fuel className="w-4 h-4 text-emerald-500 shrink-0" />
                    NRCan Fuel Economy
                  </td>
                  <td className="p-3.5 sm:p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ~5.3 L/100 km combined
                  </td>
                  <td className="p-3.5 sm:p-4 font-mono font-bold text-zinc-700 dark:text-zinc-300">
                    ~6.0 L/100 km combined
                  </td>
                  <td className="p-3.5 sm:p-4 text-xs text-zinc-600 dark:text-zinc-400">Corolla Cross consumes ~12% less fuel in city/mixed cycles</td>
                </tr>

                <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                  <td className="p-3.5 sm:p-4 font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-purple-500 shrink-0" />
                    Cargo Behind Row 2
                  </td>
                  <td className="p-3.5 sm:p-4 text-zinc-700 dark:text-zinc-300">
                    21.5 cu. ft. (609 L)
                  </td>
                  <td className="p-3.5 sm:p-4 font-bold text-zinc-900 dark:text-zinc-100">
                    37.5 cu. ft. (1,062 L)
                  </td>
                  <td className="p-3.5 sm:p-4 text-xs font-semibold text-purple-600 dark:text-purple-400">
                    RAV4 delivers +74% more cargo volume
                  </td>
                </tr>

                <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                  <td className="p-3.5 sm:p-4 font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Baby className="w-4 h-4 text-rose-500 shrink-0" />
                    Rear Legroom
                  </td>
                  <td className="p-3.5 sm:p-4 text-zinc-700 dark:text-zinc-300">
                    32.0 in (813 mm)
                  </td>
                  <td className="p-3.5 sm:p-4 font-bold text-zinc-900 dark:text-zinc-100">
                    37.8 in (960 mm)
                  </td>
                  <td className="p-3.5 sm:p-4 text-xs text-rose-600 dark:text-rose-400">
                    RAV4 provides +5.8 inches; critical for rear-facing car seats
                  </td>
                </tr>

                <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                  <td className="p-3.5 sm:p-4 font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-teal-500 shrink-0" />
                    Ground Clearance
                  </td>
                  <td className="p-3.5 sm:p-4 text-zinc-700 dark:text-zinc-300">8.0 in (203 mm)</td>
                  <td className="p-3.5 sm:p-4 text-zinc-700 dark:text-zinc-300">8.1 in (8.6 in Woodland)</td>
                  <td className="p-3.5 sm:p-4 text-xs text-zinc-600 dark:text-zinc-400">Both clear deep Canadian winter snowbanks effortlessly</td>
                </tr>

                <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                  <td className="p-3.5 sm:p-4 font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Factory className="w-4 h-4 text-indigo-500 shrink-0" />
                    Assembly Location
                  </td>
                  <td className="p-3.5 sm:p-4 text-zinc-700 dark:text-zinc-300">Huntsville, Alabama (MTM)</td>
                  <td className="p-3.5 sm:p-4 font-semibold text-emerald-600 dark:text-emerald-400">Woodstock &amp; Cambridge, ON (TMMC)</td>
                  <td className="p-3.5 sm:p-4 text-xs text-zinc-600 dark:text-zinc-400">RAV4 is built domestically in Ontario with higher output</td>
                </tr>

                <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                  <td className="p-3.5 sm:p-4 font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-red-500 shrink-0" />
                    Canadian Median Queue
                  </td>
                  <td className="p-3.5 sm:p-4 font-mono font-bold text-red-600 dark:text-red-400">180–300 days (6–10 mos)</td>
                  <td className="p-3.5 sm:p-4 font-mono font-bold text-zinc-900 dark:text-zinc-100">90–210 days (3–7 mos)</td>
                  <td className="p-3.5 sm:p-4 text-xs text-zinc-600 dark:text-zinc-400">RAV4 moves 2–4 months faster due to Ontario factory volume</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 2: "Should You Settle or Wait?" Buyer Decision Engine */}
        <section className="space-y-5" aria-labelledby="decision-engine-heading">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              <Compass className="w-4 h-4" />
              <span>Buyer Decision Framework</span>
            </div>
            <h2 id="decision-engine-heading" className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
              Should You Settle for Corolla Cross or Step Up to RAV4?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              Use our real-world lifestyle checklist to make the optimal decision based on parking, passenger packaging, and queue patience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card A: Settle for Corolla Cross Hybrid */}
            <Card className="border-2 border-red-500/20 bg-white dark:bg-zinc-900/60 shadow-xs flex flex-col justify-between">
              <CardHeader className="space-y-2 p-5 sm:p-6 pb-3">
                <Badge className="bg-red-600 text-white w-fit text-[11px] font-bold">
                  Take the Corolla Cross Hybrid if:
                </Badge>
                <CardTitle className="text-xl font-bold text-zinc-950 dark:text-zinc-50">
                  Agile Urban Commuting &amp; Maximum Fuel Value
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-5 sm:p-6 pt-0 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Tight Underground Parking:</strong> At 175.6 inches long with a 35.4-foot turning circle, it maneuvers effortlessly in tight condo stalls and narrow parkades.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Strict Budget Under $37,000 CAD:</strong> Secure standard e-AWD and Toyota&apos;s 5th-gen hybrid drive without crossing the $40k threshold.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Maximum Fuel Savings (5.3 L/100 km):</strong> Save roughly $250–$350 more per year in gasoline compared to larger compact crossovers.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>1 to 2 Occupants:</strong> Perfect for singles, couples, or dog owners who rarely carry tall adults in the second row.</span>
                </div>
              </CardContent>
            </Card>

            {/* Card B: Step up to RAV4 Hybrid */}
            <Card className="border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs flex flex-col justify-between">
              <CardHeader className="space-y-2 p-5 sm:p-6 pb-3">
                <Badge variant="outline" className="border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 w-fit text-[11px] font-bold">
                  Step up / Hold out for RAV4 Hybrid if:
                </Badge>
                <CardTitle className="text-xl font-bold text-zinc-950 dark:text-zinc-50">
                  Growing Families, Road Trips &amp; Faster Delivery
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-5 sm:p-6 pt-0 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span><strong>Rear-Facing Child Car Seats:</strong> 37.8 inches of rear legroom accommodates bulky infant seats without forcing the front passenger into the dash.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span><strong>Expansive Road Trip Cargo:</strong> 37.5 cu. ft. behind Row 2 easily handles strollers, hockey gear, coolers, and camping luggage simultaneously.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span><strong>Towing &amp; Hitch Cargo:</strong> 1,750 lb factory towing capacity allows small utility trailers and heavy 4-bike platform trays with zero suspension sag.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span><strong>Faster Delivery Pipeline:</strong> Toyota Motor Manufacturing Canada (TMMC) in Ontario builds hundreds of thousands of RAV4s annually, reducing queue delays by 2–4 months.</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SECTION 3: Dedicated 2026 vs. 2027 Corolla Cross Rollover & Production Queue */}
        <section className="space-y-5" aria-labelledby="rollover-heading">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              <RefreshCw className="w-4 h-4" />
              <span>Factory Allocation Insights</span>
            </div>
            <h2 id="rollover-heading" className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
              2026 vs. 2027 Corolla Cross Rollover &amp; Production Queue
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              Navigating the MTM Huntsville allocation bottlenecks and model year rollover rules at Canadian dealerships.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-2">
                <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                  <Factory className="w-4 h-4 text-red-600" />
                  <span>MTM Huntsville Shared Line</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  The Corolla Cross is built at the Mazda Toyota Manufacturing (MTM) joint-venture plant in Huntsville, Alabama, sharing production tooling with the Mazda CX-50. Canadian hybrid quotas represent a modest percentage of total plant line speed, creating chronic supply bottlenecks.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-2">
                <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                  <RefreshCw className="w-4 h-4 text-amber-600" />
                  <span>Model Year Rollovers</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  As production shifts from 2026 to 2027, Canadian Toyota dealerships operate on a bi-weekly dealer allocation framework. Active waitlist deposits automatically roll forward to incoming 2027 VIN matches without loss of queue seniority or financial penalties.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-2">
                <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>2027 Spec Revisions</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Incoming 2027 allocations feature revised Toyota Safety Sense (TSS 3.0) software calibrations and minor multimedia firmware improvements. MSRP adjustments are projected at modest 1.5%–2.5% inflation brackets across SE and XSE trims.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 space-y-1.5">
              <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Dealer Allocation Strategy Tip
              </span>
              <p className="leading-relaxed">
                If your sales representative informs you that your 2026 build slot has shifted to a 2027 allocation, confirm that your signed Bill of Sale or deposit receipt maintains your original agreed MSRP margin. Canadian OMVIC (Ontario) and AMVIC (Alberta) regulations protect buyers from unilateral dealer administration fee hikes on model year rollovers.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: Live Inventory Bridges CTA */}
        <section className="space-y-4" aria-label="Live Inventory Bridges">
          <div className="p-6 sm:p-8 rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-500/10 via-zinc-900/90 to-zinc-950 text-white shadow-md space-y-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-400">
                <Warehouse className="w-4 h-4" />
                <span>Live Canadian Inventory Search</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-100">
                Tracking Delivery Allocations Across Canada?
              </h2>
              <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
                Skip the factory queue entirely. Compare on-the-lot inventory and incoming dealer allocation freight statuses across Toyota dealerships in Ontario, BC, and Alberta.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-sm cursor-pointer">
                <Link href="/inventory?model=Corolla%20Cross">
                  <span>Explore Corolla Cross Stock ↗</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-zinc-700 hover:bg-zinc-800 text-zinc-100 font-bold text-xs sm:text-sm shadow-sm cursor-pointer">
                <Link href="/inventory?model=RAV4">
                  <span>Explore RAV4 Stock ↗</span>
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* SECTION 5: Programmatic Calculator Bridge Card */}
        <section className="space-y-4" aria-label="Fuel Savings Calculator Bridge">
          <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400 text-xs font-bold">
                <Calculator className="w-3.5 h-3.5" />
                <span>Programmatic Payback Calculator</span>
              </div>
              <h3 className="text-xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight">
                Calculate Break-Even Mileage for Corolla Cross Hybrid vs. Gas
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Weighing the $6,000 price delta between gas and hybrid Corolla Cross models? Plug in your provincial pump prices (BC, ON, AB) and annual commuting distance to calculate exact payback months.
              </p>
            </div>
            <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-bold shrink-0 shadow-sm cursor-pointer">
              <Link href="/calculator/corolla-cross-hybrid" className="gap-2">
                <span>Launch Corolla Cross Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* SECTION 6: Curated Day-1 Delivery Gear Shelf */}
        <CorollaCrossVsRav4DayOneGearShelf />

        {/* SECTION 7: JSON-LD Accordion / FAQ Section */}
        <section className="space-y-4" aria-labelledby="faq-section-heading">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              <HelpCircle className="w-4 h-4" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 id="faq-section-heading" className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
              Corolla Cross vs. RAV4 Hybrid Buyer FAQs
            </h2>
          </div>

          <div className="space-y-3">
            {corollaCrossVsRav4FaqData.map((faq, idx) => (
              <Card key={idx} className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs">
                <CardHeader className="p-4 sm:p-5">
                  <CardTitle className="text-base font-bold text-zinc-950 dark:text-zinc-50 flex items-start gap-2.5">
                    <span className="text-red-600 dark:text-red-400 font-mono font-bold">Q{idx + 1}.</span>
                    <span>{faq.question}</span>
                  </CardTitle>
                  <CardContent className="p-0 pt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pl-7">
                    {faq.answer}
                  </CardContent>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* SECTION 8: Bidirectional Tracker Hub Bridges */}
        <section className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/wait-times/corolla-cross"
              className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-red-500/50 transition-all flex items-center justify-between group"
            >
              <div className="space-y-0.5">
                <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Live Wait Tracker</span>
                <div className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 transition-colors">
                  Corolla Cross Wait Times Canada →
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/wait-times/rav4"
              className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-red-500/50 transition-all flex items-center justify-between group"
            >
              <div className="space-y-0.5">
                <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Live Wait Tracker</span>
                <div className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 transition-colors">
                  RAV4 Wait Times Canada →
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </section>

        {/* Guide Disclaimer */}
        <GuideDisclaimer />
      </div>
    </main>
  );
}
