import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { GuideDisclaimer } from '@/components/common/GuideDisclaimer';
import { Rav4DayOneGearShelf } from '@/components/guides/rav4-day-one-gear';
import {
  Car,
  Clock,
  Zap,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Calendar,
  Warehouse,
  Check,
  Fuel,
  Compass,
  Sliders,
  DollarSign,
  Camera,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const { instant } = { instant: false };

export function generateMetadata(): Metadata {
  return {
    title: '2026 vs. 2027 Toyota RAV4: NACS Charging, Trims & Wait Times | ToyotaWaits',
    description:
      'Compare the 2026 and 2027 Toyota RAV4. Breakdown of native NACS Tesla charging, 11kW AC onboard charger, 321 hp PHEV, 9.1-inch Woodland lift, and Canadian delivery queues.',
    alternates: {
      canonical: 'https://www.toyotawaits.ca/guides/toyota-rav4-2026-vs-2027',
    },
    openGraph: {
      title: '2026 vs. 2027 Toyota RAV4: NACS Charging, Trims & Wait Times | ToyotaWaits',
      description:
        'Compare the 2026 and 2027 Toyota RAV4. Breakdown of native NACS Tesla charging, 11kW AC onboard charger, 321 hp PHEV, 9.1-inch Woodland lift, and Canadian delivery queues.',
      url: 'https://www.toyotawaits.ca/guides/toyota-rav4-2026-vs-2027',
      siteName: 'ToyotaWaits.ca',
      locale: 'en_CA',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: '2026 vs. 2027 Toyota RAV4: NACS Charging, Trims & Wait Times | ToyotaWaits',
      description:
        'Compare the 2026 and 2027 Toyota RAV4: native NACS Tesla charging, 11kW AC onboard charger, 321 hp PHEV, 9.1" Woodland lift, and Canadian delivery queues.',
    },
  };
}

const faqData = [
  {
    question: 'What are the biggest upgrades on the 2027 Toyota RAV4?',
    answer:
      'The 2027 RAV4 introduces native NACS ports for direct Tesla Supercharger access, Level 3 DC fast charging on PHEVs, an upgraded 11 kW AC onboard charger, and TSS 4.0 with a factory dashcam.',
  },
  {
    question: 'Should I accept a 2026 RAV4 allocation or hold out for a 2027?',
    answer:
      'Hybrid (HEV) buyers should take a 2026 build immediately to dodge annual MSRP inflation. Plug-in Hybrid (PHEV) buyers wanting native Tesla Supercharging may prefer waiting for 2027, though taking delivery in 2026 locks in an extra $500 in Canadian federal iZEV rebates.',
  },
  {
    question: 'Will my 2026 RAV4 allocation roll over into a 2027 model year?',
    answer:
      'Yes. In Toyota\'s bi-weekly dealer allocation system, build slots clearing Japanese or North American plants between November and January will transition to 2027 VINs without losing queue position.',
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

export default function Rav42026Vs2027GuidePage() {
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
          <Badge className="bg-red-600 text-white font-bold gap-1 text-xs hover:bg-red-500">
            <Car className="h-3.5 w-3.5" />
            Model Year Playbook
          </Badge>
          <Badge
            variant="outline"
            className="border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold"
          >
            RAV4 Hybrid &amp; Plug-in Hybrid
          </Badge>
          <Badge variant="secondary" className="text-xs">
            2026 vs. 2027 Model Year
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          2026 vs. 2027 Toyota RAV4: NACS Charging, Trims &amp; Wait Times
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          Should Canadian and US buyers accept an incoming 2026 allocation or roll over into a 2027 VIN?
          Here is the complete engineering breakdown of official 2027 RAV4 announcements: native NACS Tesla charging, Level 3 DC fast charging, 11 kW AC charger, 321 hp PHEV, 9.1-inch Woodland lift, TSS 4.0 factory dashcam, and the $500 iZEV rebate change.
        </p>
      </div>

      {/* Transparency Disclosure */}
      <div
        role="region"
        aria-label="Affiliate and Editorial Transparency Notice"
        className="rounded-2xl border border-red-500/30 bg-red-500/10 dark:bg-red-500/5 p-4 sm:p-5 text-xs text-zinc-700 dark:text-zinc-300 space-y-2 shadow-xs"
      >
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>Independent North American Buyer Intelligence</span>
        </div>
        <p className="leading-relaxed text-[11px] sm:text-xs">
          <strong>Editorial Notice:</strong> ToyotaWaits is an independent crowdsourced community tracker.
          All specifications, allocation cycles, and mechanical benchmarks reflect verified official manufacturer announcements, dealer allocation bulletins, and plant production switchover timelines across Nagakusa, Takaoka, and TMMK.
        </p>
      </div>

      {/* 1. Side-by-Side Comparison Table */}
      <section className="space-y-4" aria-label="Side-by-Side Comparison Table">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            2026 vs. 2027 RAV4 Specification Matrix
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Direct parameter-by-parameter analysis of charging architecture, powertrain output, suspension clearance, active sensors, and federal incentives.
          </p>
        </div>

        <Card className="border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Specification / Feature</th>
                  <th className="py-3.5 px-4">2026 Toyota RAV4</th>
                  <th className="py-3.5 px-4">2027 Toyota RAV4</th>
                  <th className="py-3.5 px-4">Key Takeaway</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                    Port Standard
                  </td>
                  <td className="py-3.5 px-4 text-zinc-700 dark:text-zinc-300">
                    J1772 (Type 1)
                  </td>
                  <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                    Native NACS (SAE J3400)
                  </td>
                  <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400 text-xs">
                    Direct access to Tesla Supercharger network without bulky adapters.
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                    DC Fast Charging
                  </td>
                  <td className="py-3.5 px-4 text-zinc-700 dark:text-zinc-300">
                    None (AC only)
                  </td>
                  <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                    Standard on PHEV (Level 3 DC)
                  </td>
                  <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400 text-xs">
                    Rapid 20–80% public top-ups in ~20 minutes on road trips.
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                    AC Level 2 Charger
                  </td>
                  <td className="py-3.5 px-4 text-zinc-700 dark:text-zinc-300">
                    6.6 kW
                  </td>
                  <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                    11.0 kW
                  </td>
                  <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400 text-xs">
                    Home Level 2 recharge speeds boosted by 66% (under 2.5 hrs on a 48A circuit).
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                    PHEV Output
                  </td>
                  <td className="py-3.5 px-4 text-zinc-700 dark:text-zinc-300">
                    302 hp
                  </td>
                  <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                    321 hp (6th-Gen)
                  </td>
                  <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400 text-xs">
                    +19 hp bump via updated rear e-axle transaxle inverter and high-discharge cells.
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                    Woodland Ground Clearance
                  </td>
                  <td className="py-3.5 px-4 text-zinc-700 dark:text-zinc-300">
                    8.1&quot; (206 mm)
                  </td>
                  <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                    9.1&quot; (231 mm)
                  </td>
                  <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400 text-xs">
                    +1.0&quot; taller factory multi-link suspension lift with Falken WILDPEAK A/T Trail tires.
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                    Dashcam &amp; Recording
                  </td>
                  <td className="py-3.5 px-4 text-zinc-700 dark:text-zinc-300">
                    Aftermarket (e.g. FitcamX)
                  </td>
                  <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                    TSS 4.0 Factory Integrated Drive Recorder
                  </td>
                  <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400 text-xs">
                    Built-in optical camera &amp; forward radar event recording without external taps.
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                    Federal iZEV Rebate (Canada)
                  </td>
                  <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                    $2,500 CAD (Full)
                  </td>
                  <td className="py-3.5 px-4 text-zinc-700 dark:text-zinc-300">
                    $2,000 CAD (Phase-down)
                  </td>
                  <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400 text-xs">
                    Taking delivery in 2026 locks in an extra $500 in statutory clean vehicle rebates.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* 2. "The Verdict" Decision Matrix */}
      <section className="space-y-6" aria-label="The Verdict Decision Matrix">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 mb-2">
            <Sliders className="h-3.5 w-3.5" />
            <span>Buyer Decision Matrix</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            The Verdict: What Should Deposit Holders Do?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Tailored recommendations based on powertrain type, allocation status, and home charging setup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gas Deposit Holders */}
          <Card className="flex flex-col justify-between border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xs">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-zinc-700 dark:text-zinc-300 border-zinc-400 text-xs font-bold">
                  <Fuel className="h-3 w-3 mr-1" />
                  Gas Trims
                </Badge>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Phasing Out
                </span>
              </div>
              <CardTitle className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                Gas Deposit Holders
              </CardTitle>
              <CardDescription className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Toyota is transitioning RAV4 production to 100% electrified (HEV and PHEV). Pure ICE gas configurations are heavily constrained or eliminated in Canadian order books.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 text-xs space-y-1.5">
                <p className="font-bold text-zinc-900 dark:text-zinc-100">
                  Recommendation:
                </p>
                <p className="text-zinc-600 dark:text-zinc-300">
                  <strong>Take the 2026 build immediately</strong> if an allocation matches your deposit. Otherwise, request your dealer convert your deposit to an HEV (Hybrid) allocation before gas lines shut down.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Hybrid (HEV) Deposit Holders */}
          <Card className="flex flex-col justify-between border-2 border-emerald-500/50 bg-gradient-to-b from-emerald-500/5 to-transparent dark:from-emerald-950/20 dark:to-zinc-900 shadow-xs">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-emerald-600 text-white text-xs font-bold">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Hybrid (HEV)
                </Badge>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Take the 2026
                </span>
              </div>
              <CardTitle className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                Hybrid (HEV) Holders
              </CardTitle>
              <CardDescription className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                The core Hybrid powertrain remains the proven 219 hp 5th-gen Hybrid Synergy Drive. You do not gain charging advantages by waiting since HEVs do not plug in.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1.5">
                <p className="font-bold text-emerald-900 dark:text-emerald-300">
                  Recommendation:
                </p>
                <p className="text-zinc-700 dark:text-zinc-300">
                  <strong>Lock in the 2026 build now.</strong> Taking delivery saves 6–12 months in the national queue and dodges annual MSRP price inflation ($800–$1,500 CAD) without sacrificing mechanical performance.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Plug-in Hybrid (PHEV) Deposit Holders */}
          <Card className="flex flex-col justify-between border-2 border-amber-500/50 bg-gradient-to-b from-amber-500/5 to-transparent dark:from-amber-950/20 dark:to-zinc-900 shadow-xs">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-amber-600 text-white text-xs font-bold">
                  <Zap className="h-3 w-3 mr-1" />
                  Plug-in (PHEV)
                </Badge>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Decision Tradeoff
                </span>
              </div>
              <CardTitle className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                PHEV Deposit Holders
              </CardTitle>
              <CardDescription className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                This is where the major hardware split occurs: native Tesla NACS, Level 3 DC fast charging, 11 kW AC charging, and 321 hp vs. locking in confirmed 2026 iZEV rebates and avoiding an 8–14+ month queue reset.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs space-y-1.5">
                <p className="font-bold text-amber-900 dark:text-amber-300">
                  Recommendation:
                </p>
                <p className="text-zinc-700 dark:text-zinc-300">
                  <strong>Take 2026</strong> if your allocation is arriving next month at MSRP—you lock in confirmed federal iZEV ($2,500–$5,000) and provincial rebates while charging overnight at home. <strong>Hold for 2027</strong> only if native NACS and 11 kW home charging justify waiting into late 2027.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dedicated PHEV Buyer Dilemma Deep-Dive */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm uppercase tracking-wider">
            <Zap className="h-4 w-4 shrink-0" />
            <span>The PHEV Buyer Dilemma: Allocation Arriving Next Month vs. Waiting for 2027</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="rounded-xl bg-white dark:bg-zinc-900/80 border border-amber-500/20 p-4 space-y-1.5">
              <p className="font-bold text-zinc-900 dark:text-zinc-100">
                1. Point-of-Sale Rebate Security
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">
                Taking a 2026 allocation now secures confirmed federal iZEV ($2,500–$5,000) and provincial incentives (e.g., CleanBC, Roulez vert) at delivery before scheduled phase-downs or 2027 MSRP price cap bracket shifts.
              </p>
            </div>
            <div className="rounded-xl bg-white dark:bg-zinc-900/80 border border-amber-500/20 p-4 space-y-1.5">
              <p className="font-bold text-zinc-900 dark:text-zinc-100">
                2. NACS &amp; DC Fast Charging ROI Reality
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">
                While 2027 adds native NACS and Level 3 DC fast charging, with an 18.1 kWh battery and 68 km EV range, commercial Supercharger rates provide minimal financial return compared to cheap overnight Level 2 home charging (and running the efficient hybrid engine on road trips).
              </p>
            </div>
            <div className="rounded-xl bg-white dark:bg-zinc-900/80 border border-amber-500/20 p-4 space-y-1.5">
              <p className="font-bold text-zinc-900 dark:text-zinc-100">
                3. Queue Reset Penalty
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">
                While unallocated waitlist deposits roll over automatically, passing on a matched 2026 VIN arriving &quot;next month&quot; at MSRP forfeits that priority build slot and typically resets wait times by 8–14+ months into late 2027.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Live Inventory Bridge CTA Card */}
      <section aria-label="Live Inventory Bridge">
        <div className="relative overflow-hidden rounded-2xl border-2 border-red-500/30 bg-gradient-to-r from-red-500/10 via-rose-500/5 to-zinc-50 dark:from-red-950/40 dark:via-zinc-900/60 dark:to-zinc-950 p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400 text-xs font-bold">
                <Warehouse className="w-3.5 h-3.5" />
                <span>Immediate In-Transit Pipeline</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                Looking for an Immediate In-Transit Allocation?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                If you do not need native NACS charging, claiming an unclaimed 2026 allocation can save you 6 to 12 months in the national queue.
              </p>
            </div>
            <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-bold shrink-0 shadow-sm min-h-[44px] px-6 text-sm">
              <Link href="/inventory?model=Toyota%20RAV4" className="flex items-center gap-2">
                <span>Explore Live RAV4 Inventory ↗</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Queue Rollover & Incentive Dynamics */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Queue Rollover &amp; Incentive Dynamics
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Understanding how bi-weekly allocations, assembly plant tooling changeovers, and provincial rebates intersect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Plant Changeover Cycles */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-base">
              <Calendar className="h-5 w-5 text-red-600 dark:text-red-400" />
              <span>Nagakusa, Takaoka &amp; TMMK Plant Changeovers</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Toyota sources North American RAV4s from three key manufacturing facilities:
            </p>
            <ul className="text-xs text-zinc-700 dark:text-zinc-300 space-y-2">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <span><strong>Nagakusa &amp; Takaoka Plants (Japan):</strong> Build slots for RAV4 Plug-in Hybrid (Prime) transition to 2027 tooling starting mid-November through early January. Deposits clearing production after November 15 will naturally stamp a 2027 VIN.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <span><strong>Toyota Motor Manufacturing Kentucky (TMMK) &amp; Woodstock (TMMC):</strong> North American RAV4 Hybrid lines stagger the switchover over late December to maintain uninterrupted bi-weekly dealer allocation flow.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <span><strong>Queue Priority Protected:</strong> In Toyota&apos;s allocation matching system, your chronological deposit date at the dealer remains anchored. Your queue position is not reset during the model-year switchover.</span>
              </li>
            </ul>
          </div>

          {/* Canadian & US Rebate Mechanics */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-base">
              <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span>Provincial &amp; Federal Incentive Phase-Downs ($500 iZEV Change)</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Incentive eligibility is strictly tied to vehicle registration and delivery date, not deposit date:
            </p>
            <ul className="text-xs text-zinc-700 dark:text-zinc-300 space-y-2">
              <li className="flex items-start gap-1.5">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Federal iZEV ($500 Phase-Down):</strong> 2026 registered PHEV deliveries receive $2,500 CAD in federal rebates, adjusting down to $2,000 CAD for 2027 calendar year registrations.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Quebec Roulez vert &amp; BC CleanBC:</strong> Provincial rebates face scheduled reductions. Registering a late 2026 delivery locks in higher existing point-of-sale provincial subsidies before lower 2027 caps.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Price Cap Sensitivity:</strong> If annual MSRP price adjustments on 2027 trims push base pricing close to government caps, higher-trim rebate eligibility risks diminishing.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Delivery Day Gear Shelf */}
      <Rav4DayOneGearShelf />

      {/* 6. Frequently Asked Questions */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Core answers for Canadian and US buyers navigating 2026 vs. 2027 allocation decisions.
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <Card key={index} className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-2 shadow-xs">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-start gap-2">
                <HelpCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <span>{faq.question}</span>
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 pl-7 leading-relaxed">
                {faq.answer}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Legal & Safety Disclaimer */}
      <GuideDisclaimer />
    </div>
  );
}
