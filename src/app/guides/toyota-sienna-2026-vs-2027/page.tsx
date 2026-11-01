import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { GuideDisclaimer } from '@/components/common/GuideDisclaimer';
import { SiennaDayOneGearShelf } from '@/components/guides/sienna-day-one-gear';
import {
  Car,
  Clock,
  Layers,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  Sliders,
  DollarSign,
  Fuel,
  Gauge,
  Calendar,
  Compass,
  Sparkles,
  Info,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  return {
    title: '2026 vs. 2027 Toyota Sienna: Key Differences, Trim Matrix & Wait Times | ToyotaWaits',
    description:
      'Compare the 2026 and 2027 Toyota Sienna. Full trim level matrix (LE, XLE, XSE, Limited, Platinum), carryover specs, Canadian queue rollovers, live lot inventory, and Day-1 gear.',
    alternates: {
      canonical: 'https://www.toyotawaits.ca/guides/toyota-sienna-2026-vs-2027',
    },
    openGraph: {
      title: '2026 vs. 2027 Toyota Sienna: Key Differences, Trim Matrix & Wait Times | ToyotaWaits',
      description:
        'Compare the 2026 and 2027 Toyota Sienna. Full trim level matrix (LE, XLE, XSE, Limited, Platinum), carryover specs, Canadian queue rollovers, live lot inventory, and Day-1 gear.',
      url: 'https://www.toyotawaits.ca/guides/toyota-sienna-2026-vs-2027',
      siteName: 'ToyotaWaits.ca',
      locale: 'en_CA',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: '2026 vs. 2027 Toyota Sienna: Key Differences, Trim Matrix & Wait Times',
      description:
        'Compare the 2026 and 2027 Toyota Sienna: mechanical carryovers, trim level matrix, TMMI Indiana queue rollovers, and live inventory.',
    },
  };
}

const faqData = [
  {
    question: 'Are there mechanical differences between the 2026 and 2027 Toyota Sienna?',
    answer:
      'No. The 2027 Sienna is a direct mechanical carryover sharing the identical 245-hp 2.5L hybrid synergy powertrain, AWD-e architecture, and 33.5 cu. ft. sunken cargo well.',
  },
  {
    question: 'Will my Canadian 2026 Sienna allocation automatically turn into a 2027?',
    answer:
      'Yes. In Toyota\'s bi-weekly dealer allocation system, deposits placed in late 2026 roll to a 2027 VIN when the Indiana assembly plant transitions tooling between November and January without losing queue priority.',
  },
  {
    question: 'What is the difference between the Sienna XSE and LE suspension?',
    answer:
      'The XSE features exclusive sport-tuned dampers and thicker anti-sway bars for flatter cornering, whereas LE, XLE, Limited, and Platinum use standard soft-ride comfort tuning.',
  },
];

const faqPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqData.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export default function Sienna2026Vs2027GuidePage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* FAQPage Structured Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />

      {/* Header & Breadcrumbs */}
      <div className="space-y-4">
        <BackButton label="← Back to Guides Almanac" fallbackHref="/guides" className="mb-2" />

        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-amber-500 text-zinc-950 font-bold gap-1 text-xs hover:bg-amber-400">
            <Car className="h-3.5 w-3.5" />
            Model Year Playbook
          </Badge>
          <Badge
            variant="outline"
            className="border-amber-500/30 text-amber-500 dark:text-amber-400 text-xs font-semibold"
          >
            Sienna Hybrid (4th Generation)
          </Badge>
          <Badge variant="secondary" className="text-xs">
            2026 vs. 2027 Model Year
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          2026 vs. 2027 Toyota Sienna: Key Differences, Trim Matrix &amp; Wait Times
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          Should Canadian buyers accept an allocated 2026 Sienna build slot or wait for a 2027 VIN?
          Here is the complete engineering breakdown, trim level equipment matrix, Indiana factory queue rollover timing, and delivery day gear guide.
        </p>
      </div>

      {/* Transparency Disclosure */}
      <div
        role="region"
        aria-label="Affiliate and Editorial Transparency Notice"
        className="rounded-2xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/5 p-4 sm:p-5 text-xs text-zinc-700 dark:text-zinc-300 space-y-2 shadow-xs"
      >
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>Independent Canadian Buyer Intelligence</span>
        </div>
        <p className="leading-relaxed text-[11px] sm:text-xs">
          <strong>Editorial Notice:</strong> ToyotaWaits is an independent crowdsourced community tracker.
          All trim specifications, allocation cycles, and mechanical benchmarks reflect verified Canadian dealership ordering guides and real-world TMMI production schedules.
        </p>
      </div>

      {/* 1. Executive Summary & Quick Verdict */}
      <section className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Executive Verdict: Take the 2026 Allocation Immediately
        </h2>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6 space-y-4">
          <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
            If your dealership calls with an allocated <strong>2026 Toyota Sienna build slot</strong>, <strong>do not pass or ask to wait for a 2027</strong>.
            The 2027 Sienna is a direct mechanical carryover with zero powertrain revisions, identical fuel efficiency, and unchanged suspension geometry. Passing on a 2026 allocation simply resets your queue priority, subjecting you to an additional <strong>6 to 12 months of delay</strong> and an estimated <strong>$300 to $800 CAD annual inflationary MSRP increase</strong>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Mechanical Delta</span>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">0% (100% Carryover)</p>
              <p className="text-xs text-zinc-500 mt-0.5">Identical 245-hp Hybrid Synergy Drive</p>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Queue Penalty If Passed</span>
              <p className="text-sm font-bold text-red-600 dark:text-red-400 mt-1">+6 to +12 Months</p>
              <p className="text-xs text-zinc-500 mt-0.5">Loss of bi-weekly dealer queue priority</p>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Projected MSRP Jump</span>
              <p className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-1">+$300 – $800 CAD</p>
              <p className="text-xs text-zinc-500 mt-0.5">Standard annual base price bump</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Side-by-Side Carryover Table */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Year-Over-Year Carryover Comparison (2026 vs. 2027)
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Direct parameter-by-parameter analysis of mechanical, dimensional, and packaging specifications.
          </p>
        </div>

        <Card className="border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Specification / Feature</th>
                  <th className="py-3 px-4">2026 Toyota Sienna</th>
                  <th className="py-3 px-4">2027 Toyota Sienna</th>
                  <th className="py-3 px-4">Verdict &amp; Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Powertrain</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">2.5L 4-Cyl Hybrid (245 hp net)</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">2.5L 4-Cyl Hybrid (245 hp net)</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Identical (100% carryover)
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Drivetrain</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">FWD or Electronic AWD (AWD-e)</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">FWD or Electronic AWD (AWD-e)</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Identical
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Fuel Economy</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">6.5–6.8 L/100 km (~36 MPG)</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">6.5–6.8 L/100 km (~36 MPG)</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Identical
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Sunken Cargo Well</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">33.5 cu. ft. deep sunken tub</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">33.5 cu. ft. deep sunken tub</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Identical
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Towing Capacity</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">3,500 lbs / 1,585 kg</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">3,500 lbs / 1,585 kg</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Identical
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Base LE Features</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Manual sliding doors standard</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Trickle-down hands-free kick sensors and sonar</td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                      LE convenience packaging update
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Canadian XLE Seating</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">8-Pass FWD primary volume</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Return of 7-passenger AWD for non-sport buyers</td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      Captain chairs available on AWD XLE
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">MSRP Delta (CAD)</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Base MSRP lock on 2026 allocation</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Standard annual inflationary bump (~$300–$800 CAD)</td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                      2026 saves on base inflation
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* 3. Complete Trim Level Matrix */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Complete Canadian Trim Level Matrix
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Key seating configurations, suspension tuning, audio systems, and interior appointments across all 5 trim grades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* LE */}
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-lg text-zinc-900 dark:text-zinc-100">LE (8-Passenger)</span>
              <Badge variant="secondary" className="text-xs">Value Benchmark</Badge>
            </div>
            <div className="text-xs space-y-2 text-zinc-600 dark:text-zinc-400">
              <p><strong>Drivetrain:</strong> FWD or Electronic AWD (AWD-e)</p>
              <p><strong>Suspension:</strong> Standard Comfort-tuned soft-ride</p>
              <p><strong>Seating &amp; Upholstery:</strong> 8-passenger durable cloth seats with stowable middle seat</p>
              <p><strong>Infotainment:</strong> 8.0-inch Toyota Multimedia touchscreen with wireless Apple CarPlay &amp; Android Auto</p>
            </div>
          </Card>

          {/* XLE */}
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-lg text-zinc-900 dark:text-zinc-100">XLE (7 or 8-Pass)</span>
              <Badge className="bg-blue-600 text-white text-xs">Family Sweet Spot</Badge>
            </div>
            <div className="text-xs space-y-2 text-zinc-600 dark:text-zinc-400">
              <p><strong>Drivetrain:</strong> FWD (AWD returns for 2027 in 7-passenger)</p>
              <p><strong>Suspension:</strong> Standard Comfort-tuned soft-ride</p>
              <p><strong>Seating &amp; Upholstery:</strong> SofTex synthetic leather, power moonroof, hands-free kick sensor dual power sliding doors</p>
              <p><strong>Infotainment:</strong> Upgraded 12.3-inch Toyota Multimedia display</p>
            </div>
          </Card>

          {/* XSE */}
          <Card className="border-amber-500/40 dark:border-amber-500/30 bg-amber-500/5 p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-lg text-amber-600 dark:text-amber-400">XSE (7-Passenger)</span>
              <Badge className="bg-amber-500 text-zinc-950 font-bold text-xs">Sport-Tuned</Badge>
            </div>
            <div className="text-xs space-y-2 text-zinc-600 dark:text-zinc-400">
              <p><strong>Drivetrain:</strong> FWD or Electronic AWD (AWD-e)</p>
              <p><strong>Suspension:</strong> Exclusive Sport-Tuned dampers &amp; thicker stabilizer bars for flatter cornering</p>
              <p><strong>Styling:</strong> Dark honeycomb mesh grille, aggressive front lip, 18&quot; dark alloys, sport rocker panels</p>
              <p><strong>Interior:</strong> Two-tone Sport SofTex upholstery with contrast stitching and captain&apos;s chairs</p>
            </div>
          </Card>

          {/* Limited */}
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-lg text-zinc-900 dark:text-zinc-100">Limited (7-Passenger)</span>
              <Badge variant="outline" className="border-zinc-300 dark:border-zinc-700 text-xs">Luxury Tourer</Badge>
            </div>
            <div className="text-xs space-y-2 text-zinc-600 dark:text-zinc-400">
              <p><strong>Drivetrain:</strong> Standard Electronic AWD (AWD-e)</p>
              <p><strong>Suspension &amp; Glass:</strong> Comfort suspension + acoustic laminated front side glass</p>
              <p><strong>Seating &amp; Upholstery:</strong> Genuine perforated leather, heated &amp; ventilated front seats, 2nd-row captain ottomans</p>
              <p><strong>Audio:</strong> Premium 12-speaker JBL audio system with subwoofer</p>
            </div>
          </Card>

          {/* Platinum */}
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-3 md:col-span-2 lg:col-span-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-lg text-zinc-900 dark:text-zinc-100">Platinum (7-Passenger)</span>
              <Badge className="bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-bold text-xs">Flagship Luxury</Badge>
            </div>
            <div className="text-xs space-y-2 text-zinc-600 dark:text-zinc-400">
              <p><strong>Drivetrain:</strong> Standard Electronic AWD (AWD-e) with 20&quot; metallic alloy wheels</p>
              <p><strong>Suspension &amp; Glass:</strong> Comfort-tuned chassis with full acoustic sound-deadening glass package</p>
              <p><strong>Flagship Technology:</strong> 10-inch color Head-Up Display (HUD), 360° Panoramic View Monitor, and integrated FridgeBox &amp; on-board vacuum</p>
              <p><strong>Interior:</strong> Premium two-tone Noble Brown aniline-style leather with heated 2nd-row ottomans</p>
            </div>
          </Card>
        </div>
      </section>

      {/* 4. Queue Rollover Explanation (TMMI Indiana) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            How Canadian Sienna Allocation Queue Rollovers Work
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Understanding Toyota Motor Manufacturing Indiana (TMMI) tooling transitions and dealer deposit priority.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
              <Calendar className="h-4 w-4" />
              <span>The TMMI Indiana Factory Switchover (Nov–Jan)</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Every year between <strong>November and January</strong>, Toyota’s assembly plant in Princeton, Indiana (TMMI) executes model-year line changeovers. When your dealer receives their bi-weekly allocation drop from Toyota Canada, any unbuilt order that has not entered production status by late autumn automatically rolls to a 2027 model year build slot.
            </p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              <strong>Your Queue Position Is Safe:</strong> Because Toyota Canada assigns production slots sequentially based on dealer submission timestamp, your place in line does not reset when the plant shifts from 2026 to 2027 VIN codes.
            </p>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-3">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>Why Passing on a 2026 Build Slot Is a Costly Mistake</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Some buyers mistakenly ask their sales representative to &quot;hold out for a 2027 VIN&quot; believing a major redesign is incoming. However, passing on an allocated 2026 build slot releases that vehicle to the next customer on the waitlist.
            </p>
            <div className="text-xs space-y-1.5 text-zinc-600 dark:text-zinc-400 pt-1">
              <div className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <span>You return to the back of the dealer queue, adding an extra 6 to 12 months of waiting.</span>
              </div>
              <div className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <span>You absorb the 2027 MSRP price increase (~$300 to $800 CAD) for identical mechanics.</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 5. Live Allocation Bridge Card */}
      <section aria-label="Live Inventory Allocation Bridge">
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-zinc-50 dark:from-amber-950/50 dark:via-zinc-900/70 dark:to-zinc-950 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-zinc-950 shadow-xs">
                <Sparkles className="h-3.5 w-3.5" />
                <span>In-Transit Stock Bridge</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                Looking for an Incoming Allocation Right Now?
              </h3>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Because 2026 and 2027 Siennas are mechanically identical, taking an unclaimed in-transit allocation can save you <strong>8 to 14 months of waiting</strong>. Filter verified dealer pipelines by province, trim, and incoming freight status.
              </p>
            </div>
            <Button
              asChild
              className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black text-sm px-6 py-6 shrink-0 shadow-md cursor-pointer"
            >
              <Link href="/inventory?model=Toyota%20Sienna" className="gap-2">
                <span>Explore Live Sienna Stock ↗</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 6. Direct-Fit Delivery Day Gear Shelf */}
      <SiennaDayOneGearShelf />

      {/* 7. Frequently Asked Questions (FAQ Visual Accordion / Cards) */}
      <section className="space-y-4" aria-label="Frequently Asked Questions">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Common questions about the 2026 vs. 2027 Toyota Sienna transition in Canada.
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <Card
              key={index}
              className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-2 shadow-xs"
            >
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-base">
                <HelpCircle className="h-4 w-4 text-amber-500 shrink-0" />
                <span>{faq.question}</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pl-6">
                {faq.answer}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* 8. Additional Resource Links */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
        <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
          <p className="font-semibold text-zinc-900 dark:text-zinc-200">
            Need towing details or suspension upgrades?
          </p>
          <p>
            Read our in-depth guides on the Sienna Class 3 Trailer Hitch and Air Lift 1000 helper springs.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button asChild variant="outline" size="sm" className="text-xs font-semibold">
            <Link href="/guides/toyota-sienna-trailer-hitch-guide">
              Sienna Hitch Guide →
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="text-xs font-semibold">
            <Link href="/guides/sienna-mods">
              Sienna Mod Almanac →
            </Link>
          </Button>
        </div>
      </div>

      {/* Legal & Safety Disclaimer */}
      <GuideDisclaimer />
    </div>
  );
}
