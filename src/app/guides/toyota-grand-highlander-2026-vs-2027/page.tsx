import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { GuideDisclaimer } from '@/components/common/GuideDisclaimer';
import { GrandHighlanderDayOneGearShelf } from '@/components/guides/grand-highlander-day-one-gear';
import {
  Car,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Zap,
  Flame,
  Calendar,
  Layers,
  Compass,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const { instant } = { instant: false };

export function generateMetadata(): Metadata {
  return {
    title: '2026 vs. 2027 Toyota Grand Highlander: Woodland Edition, Trims & Wait Times | ToyotaWaits',
    description:
      'Compare the 2026 and 2027 Grand Highlander. Details on the new Hybrid Woodland Edition, +12mm ground clearance, blacked-out MAX Platinum, and Canadian queue rollovers.',
    alternates: {
      canonical: 'https://www.toyotawaits.ca/guides/toyota-grand-highlander-2026-vs-2027',
    },
    openGraph: {
      title: '2026 vs. 2027 Toyota Grand Highlander: Woodland Edition, Trims & Wait Times | ToyotaWaits',
      description:
        'Compare the 2026 and 2027 Grand Highlander. Details on the new Hybrid Woodland Edition, +12mm ground clearance, blacked-out MAX Platinum, and Canadian queue rollovers.',
      url: 'https://www.toyotawaits.ca/guides/toyota-grand-highlander-2026-vs-2027',
      siteName: 'ToyotaWaits.ca',
      locale: 'en_CA',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: '2026 vs. 2027 Toyota Grand Highlander: Woodland Edition, Trims & Wait Times',
      description:
        'Compare the 2026 and 2027 Grand Highlander. Details on the new Hybrid Woodland Edition, +12mm ground clearance, blacked-out MAX Platinum, and Canadian queue rollovers.',
    },
  };
}

const faqData = [
  {
    question: 'What are the major changes for the 2027 Toyota Grand Highlander?',
    answer:
      'The 2027 Grand Highlander introduces a new Hybrid Woodland Edition with all-terrain tires, +12 mm ground clearance, and a 1,500W power outlet. It also standardizes a heated steering wheel on the XLE and blacks out the trim on the Hybrid MAX Platinum.',
  },
  {
    question: 'Will my 2026 Grand Highlander allocation automatically roll into a 2027?',
    answer:
      'Yes. Due to 8–14 month Canadian delivery queues, allocations clearing the Indiana plant during the winter switchover transition to 2027 VINs without losing queue position.',
  },
  {
    question: 'Should I pass on a 2026 Grand Highlander to wait for a 2027?',
    answer:
      'Unless holding out specifically for the rugged Woodland Edition (+12mm lift, all-terrain tires, 1,500W inverter), Hybrid buyers should accept an incoming 2026 allocation immediately. Passing resets your position in an 8–12 month backlog and exposes you to annual Toyota MSRP increases.',
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

export default function GrandHighlander2026Vs2027GuidePage() {
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
            Grand Highlander (TNGA-K 3-Row)
          </Badge>
          <Badge variant="secondary" className="text-xs">
            2026 vs. 2027 Model Year
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          2026 vs. 2027 Toyota Grand Highlander: Woodland Edition, Trims &amp; Wait Times
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          Toyota has officially announced the 2027 Grand Highlander, headlining a rugged new Hybrid Woodland Edition, +12 mm lifted ground clearance, and trim refreshes. Should Canadian buyers take an incoming 2026 build slot or hold out for a 2027 VIN? Here is the full engineering, rollover, and trim comparison.
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
          <strong>Editorial Notice:</strong> ToyotaWaits is an independent crowdsourced delivery and allocation tracker. All trim equipment matrices, factory rollover policies, and mechanical comparisons reflect official Toyota announcements, Canadian dealership ordering guides, and verified Princeton, Indiana (TMMI) assembly transitions.
        </p>
      </div>

      {/* 1. Executive Summary & Quick Verdict: "Should You Pass on a 2026?" */}
      <section className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Executive Verdict: Should You Pass on a 2026 Grand Highlander?
        </h2>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6 space-y-4">
          <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
            If your Canadian dealership calls with an incoming <strong>2026 Grand Highlander allocation</strong>, <strong>accept the build slot immediately</strong>—unless you are specifically holding out for the off-road styling and lifted suspension of the new <strong>Woodland Edition</strong>.
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Standard hybrid and gas powertrains are mechanically carried over. For XLE, Limited, and Hybrid MAX buyers, declining a 2026 allocation forfeits your spot in an <strong>8 to 14 month delivery queue</strong> and leaves you vulnerable to an estimated <strong>$600 to $1,200 CAD annual inflationary MSRP increase</strong> for modest cosmetic updates.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Powertrain Carryover</span>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">100% Mechanical Match</p>
              <p className="text-xs text-zinc-500 mt-0.5">Identical 2.5L Hybrid (245 hp) &amp; MAX (362 hp)</p>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Queue Penalty If Passed</span>
              <p className="text-sm font-bold text-red-600 dark:text-red-400 mt-1">+8 to +14 Months</p>
              <p className="text-xs text-zinc-500 mt-0.5">Deposit resets to end of dealer queue</p>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Estimated MSRP Jump</span>
              <p className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-1">+$600 – $1,200 CAD</p>
              <p className="text-xs text-zinc-500 mt-0.5">Standard year-over-year factory adjustment</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Side-by-Side Comparison Table */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Side-by-Side Comparison: 2026 vs. 2027 Grand Highlander
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Detailed breakdown of Woodland Edition hardware, trim feature trickle-downs, towing capacities, and fuel economy ratings.
          </p>
        </div>

        <Card className="border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Feature / Specification</th>
                  <th className="py-3 px-4">2026 Grand Highlander</th>
                  <th className="py-3 px-4">2027 Grand Highlander</th>
                  <th className="py-3 px-4">Change Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Woodland Edition Trim</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Not Available</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">New Hybrid Grade:</span> +12 mm lift, all-terrain tires, 1,500W outlet, roof rails
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                      <Sparkles className="h-3.5 w-3.5" /> Major 2027 Addition
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Ground Clearance</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">8.0 inches (203 mm) standard across all trims</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    8.0 inches standard; <strong>8.5 inches (215 mm)</strong> on Woodland (+12 mm lifted springs)
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                      +12 mm clearance on Woodland
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">AC Power Inverter</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">100W on lower trims / 1,500W on Hybrid MAX Platinum only</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    <strong>1,500W High-Output Inverter</strong> standardized on Hybrid Woodland &amp; MAX Platinum
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      High-draw camp power on Woodland
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">XLE Heated Steering Wheel</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Optional / Bundled in cold package</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">Standard equipment</span> across all 2027 XLE grades
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Canadian Winter Win
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Hybrid MAX Platinum Styling</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Satin silver window trim, chrome accents, painted silver mirrors</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    <strong>Blacked-out exterior package:</strong> gloss black window trim, black mirror caps, darkened badge &amp; rear spoiler
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                      Stealth aesthetic refresh
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Powertrains &amp; Output</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    2.4L Turbo Gas (265 hp)<br />
                    2.5L Hybrid AWD (245 hp)<br />
                    2.4L Turbo MAX AWD (362 hp)
                  </td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    2.4L Turbo Gas (265 hp)<br />
                    2.5L Hybrid AWD (245 hp)<br />
                    2.4L Turbo MAX AWD (362 hp)
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" /> 100% Mechanical Carryover
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Towing Capacity</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    Hybrid: 3,500 lbs (1,588 kg)<br />
                    Gas / MAX: 5,000 lbs (2,268 kg)
                  </td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    Hybrid &amp; Woodland: 3,500 lbs (1,588 kg)<br />
                    Gas / MAX: 5,000 lbs (2,268 kg)
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Identical Ratings
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Fuel Economy (Combined)</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    2.5L Hybrid: 7.0 L/100 km (~34 MPG)<br />
                    Hybrid MAX: 8.8 L/100 km (~27 MPG)<br />
                    2.4L Gas Turbo: 10.0 L/100 km (~24 MPG)
                  </td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    2.5L Hybrid: 7.0 L/100 km (~34 MPG)<br />
                    Woodland: ~7.3 L/100 km (A/T drag)<br />
                    Hybrid MAX: 8.8 L/100 km (~27 MPG)
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">
                      Slight A/T tire rolling resistance on Woodland
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* 3. Deep Dive into the 2027 Hybrid Woodland Edition */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Spotlight: The 2027 Grand Highlander Hybrid Woodland Edition
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Bringing Toyota&apos;s adventure-ready overland styling to the 3-row flagship hauler.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <Card className="border-amber-500/40 dark:border-amber-500/30 bg-amber-500/5 p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
              <Compass className="h-4 w-4" />
              <span>+12 mm Ground Clearance &amp; All-Terrain Tires</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Factory suspension revised with taller springs adds +12 mm (+0.47 in) of ride height, bringing clearance to 8.5 inches. Paired with rugged all-terrain tires on 18-inch wheels, it improves gravel-road departure angles and Canadian winter snowpack clearance.
            </p>
          </Card>

          <Card className="border-amber-500/40 dark:border-amber-500/30 bg-amber-500/5 p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
              <Zap className="h-4 w-4" />
              <span>1,500W High-Output AC Inverter</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Previously locked behind the costly $65k+ Hybrid MAX Platinum, the 1,500-watt pure-sine AC outlet now comes standard on the 2.5L Hybrid Woodland. Powers campsite induction cooktops, e-bike battery chargers, and power tools directly from the hybrid traction battery.
            </p>
          </Card>

          <Card className="border-amber-500/40 dark:border-amber-500/30 bg-amber-500/5 p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
              <Layers className="h-4 w-4" />
              <span>Modular Roof Rail System &amp; Dark Accents</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Standard raised roof rails with adjustable crossbars engineered for rooftop cargo boxes and ski racks. Finished with black badge overlays, rugged rocker claddings, and all-weather rubber cargo liners directly from the Indiana plant.
            </p>
          </Card>
        </div>
      </section>

      {/* 4. Canadian Queue Rollovers: Indiana Plant (TMMI) Mechanics */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            How Canadian Grand Highlander Queue Rollovers Work
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Tooling switchover dynamics at Toyota Motor Manufacturing Indiana (TMMI in Princeton, IN).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
              <Calendar className="h-4 w-4" />
              <span>The Winter Tooling Transition (November–January)</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Because of high demand and earlier production pause recovery, Canadian Grand Highlander orders sit in an <strong>8 to 14 month delivery queue</strong>. The Princeton, Indiana plant conducts its annual tooling transition between late autumn and early winter.
            </p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              <strong>Seamless Queue Rollover:</strong> Any unbuilt factory allocation scheduled after the tooling line switch automatically receives a 2027 VIN. Toyota Canada matches customer orders by original dealer submission date—your spot in line remains fully protected.
            </p>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-3">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>The Danger of Declining a 2026 Build Slot</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Some buyers request to &quot;wait for a 2027&quot; hoping for major discounts or a complete overhaul. However, dealer allocations operate on a strict bi-weekly acceptance window:
            </p>
            <div className="text-xs space-y-1.5 text-zinc-600 dark:text-zinc-400 pt-1">
              <div className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <span>If you decline an offered 2026 allocation, the dealership passes the vehicle to the next buyer and pushes your deposit to the back of the queue (+8 to 12 months).</span>
              </div>
              <div className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <span>You will absorb 2027 base MSRP increases (~$600 to $1,200 CAD) while receiving identical mechanical running gear.</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 5. Live Allocation Inventory Bridge Card */}
      <section aria-label="Live Inventory Allocation Bridge">
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-zinc-50 dark:from-amber-950/50 dark:via-zinc-900/70 dark:to-zinc-950 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-zinc-950 shadow-xs">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Live Canadian Inventory Bridge</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                Want to Skip the 10-Month Wait? Check Incoming Allocations
              </h3>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Because 2026 and 2027 models share identical powertrains, taking an in-transit dealer allocation or cancelled order can put keys in your hand months ahead of a factory build.
              </p>
            </div>
            <Button
              asChild
              className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black text-sm px-6 py-6 shrink-0 shadow-md cursor-pointer"
            >
              <Link href="/inventory?model=Toyota%20Grand%20Highlander" className="gap-2">
                <span>View Live Grand Highlander Stock ↗</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 6. Vetted Day-1 Accessory Shelf */}
      <GrandHighlanderDayOneGearShelf />

      {/* 7. Frequently Asked Questions (FAQ Visual Cards) */}
      <section className="space-y-4" aria-label="Frequently Asked Questions">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Common questions regarding the 2026 vs. 2027 Toyota Grand Highlander Canadian ordering cycle.
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
            Comparing hybrid payback or researching cabin upgrades?
          </p>
          <p>
            Use our Grand Highlander Hybrid savings calculator or explore DIY utility mods for the cargo area.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button asChild variant="outline" size="sm" className="text-xs font-semibold">
            <Link href="/calculator/grand-highlander">
              Grand Highlander Calculator →
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="text-xs font-semibold">
            <Link href="/guides/grand-highlander-mods">
              Grand Highlander Mods →
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="text-xs font-semibold">
            <Link href="/wait-times/grand-highlander">
              Grand Highlander Wait Times →
            </Link>
          </Button>
        </div>
      </div>

      {/* Legal & Safety Disclaimer */}
      <GuideDisclaimer />
    </div>
  );
}
