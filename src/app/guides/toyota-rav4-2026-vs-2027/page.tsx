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
  ExternalLink,
  Sliders,
  DollarSign,
  Fuel,
  Gauge,
  Calendar,
  Compass,
  Sparkles,
  Info,
  Radio,
  FileText,
  Warehouse,
  Check,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  return {
    title: '2026 vs. 2027 Toyota RAV4: Key Differences, NACS Port & Wait Times | ToyotaWaits',
    description:
      'Compare the 2026 and 2027 Toyota RAV4 (Hybrid & PHEV). Breakdown of native NACS Supercharging, 321-hp PHEV upgrade, 9.1" Woodland lift, and allocation queue rollovers.',
    alternates: {
      canonical: 'https://www.toyotawaits.ca/guides/toyota-rav4-2026-vs-2027',
    },
    openGraph: {
      title: '2026 vs. 2027 Toyota RAV4: Key Differences, NACS Port & Wait Times | ToyotaWaits',
      description:
        'Compare the 2026 and 2027 Toyota RAV4 (Hybrid & PHEV). Breakdown of native NACS Supercharging, 321-hp PHEV upgrade, 9.1" Woodland lift, and allocation queue rollovers.',
      url: 'https://www.toyotawaits.ca/guides/toyota-rav4-2026-vs-2027',
      siteName: 'ToyotaWaits.ca',
      locale: 'en_CA',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: '2026 vs. 2027 Toyota RAV4: Key Differences, NACS Port & Wait Times',
      description:
        'Compare the 2026 and 2027 Toyota RAV4: native NACS Supercharging, 321-hp PHEV upgrade, 9.1" Woodland lift, and factory queue rollovers.',
    },
  };
}

const faqData = [
  {
    question: 'What are the major differences between the 2026 and 2027 Toyota RAV4?',
    answer:
      'The 2027 RAV4 introduces a native NACS (Tesla-style) charging port and DC fast charging on all PHEVs, upgrades PHEV power to 321 hp (6th-gen system), increases Woodland ground clearance to 9.1 inches, and standardizes Toyota Safety Sense 4.0 with an integrated drive recorder.',
  },
  {
    question: 'Will my 2026 RAV4 allocation roll over into a 2027 model year?',
    answer:
      'Yes. In Toyota\'s bi-weekly dealer allocation system, build slots clearing Japanese or North American plants between November and January will transition to 2027 VINs without losing queue position.',
  },
  {
    question: 'Should I pass on a 2026 RAV4 Plug-in Hybrid to get a 2027?',
    answer:
      'Only if native NACS Supercharger access and 11 kW Level 2 charging are critical to you. Passing on a late 2026 build will push delivery back by 6 to 12 months, subject you to annual model-year price bumps, and may cross into lower federal PHEV incentive brackets.',
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
          2026 vs. 2027 Toyota RAV4: Key Differences, NACS Port &amp; Wait Times
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          Should Canadian and US buyers accept an incoming 2026 allocation or roll over into a 2027 VIN?
          Here is the complete engineering breakdown of native NACS Supercharging, the 321-hp PHEV upgrade, 9.1-inch Woodland lift, factory queue rollovers, and incentive dynamics.
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

      {/* 1. "Pass or Take It?" Buyer Decision Engine */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            &quot;Pass or Take It?&quot; Buyer Decision Engine
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Determine whether you should take an allocated 2026 build slot today or roll over into a 2027 VIN.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Take 2026 Card */}
          <div className="rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-white to-zinc-50 dark:from-emerald-950/20 dark:via-zinc-900/60 dark:to-zinc-950 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm uppercase tracking-wider">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>Take the 2026 Allocation If:</span>
            </div>
            <ul className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>You need a vehicle immediately:</strong> Passing on a late 2026 build slot will push your delivery date back by 6 to 12 months in the national queue.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>You charge primarily at home using J1772:</strong> If your garage already has a standard J1772 Level 2 wall connector, the 2026 plugs in natively without adapters.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>You want to lock in current MSRP:</strong> Secure current pricing before typical annual model-year MSRP bumps ($800–$1,500 CAD/USD) take effect.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>You want to secure maximum EV rebates:</strong> Provincial and federal point-of-sale clean vehicle rebates face statutory phase-downs on deliveries registered in 2027.</span>
              </li>
            </ul>
          </div>

          {/* Hold Out for 2027 Card */}
          <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-white to-zinc-50 dark:from-amber-950/20 dark:via-zinc-900/60 dark:to-zinc-950 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm uppercase tracking-wider">
              <Clock className="h-5 w-5 shrink-0" />
              <span>Hold Out for the 2027 If:</span>
            </div>
            <ul className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span><strong>You rely on public road-trip charging:</strong> The 2027 RAV4 PHEV features a native NACS (Tesla Supercharger) port with Level 3 DC fast charging, eliminating third-party CCS/J1772 dongles.</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span><strong>You need 11 kW Level 2 AC charging:</strong> Upgrade from 6.6 kW to 11.0 kW onboard AC charging cuts home full-recharge time nearly in half (under 2.5 hours).</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span><strong>You want maximum PHEV performance:</strong> The 6th-gen hybrid synergy system pushes total system output from 302 hp to 321 hp.</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span><strong>You want the 9.1&quot; lifted Woodland trim:</strong> Factory off-road package clearance increases from 8.1 inches to an authoritative 9.1 inches with retuned multi-link suspension.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Highlight Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Queue Penalty If Passed</span>
            <p className="text-sm font-bold text-red-600 dark:text-red-400 mt-1">+6 to +12 Months</p>
            <p className="text-xs text-zinc-500 mt-0.5">Loss of bi-weekly dealer queue priority</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">PHEV Horsepower Delta</span>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">+19 HP Net System</p>
            <p className="text-xs text-zinc-500 mt-0.5">302 hp (2026) vs. 321 hp (2027)</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Charging Port Architecture</span>
            <p className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-1">Native NACS (J3400) + DC</p>
            <p className="text-xs text-zinc-500 mt-0.5">Standard DC Fast Charging on 2027 PHEV</p>
          </div>
        </div>
      </section>

      {/* 2. Side-by-Side Carryover & Upgrade Comparison Table */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Year-Over-Year Carryover &amp; Upgrade Comparison (2026 vs. 2027)
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Direct parameter-by-parameter analysis of powertrain, charging architecture, clearance, and electronics.
          </p>
        </div>

        <Card className="border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Specification / Feature</th>
                  <th className="py-3 px-4">2026 Toyota RAV4</th>
                  <th className="py-3 px-4">2027 Toyota RAV4</th>
                  <th className="py-3 px-4">Verdict &amp; Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">PHEV Charging Port</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">J1772 (AC only)</td>
                  <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">Native NACS (J3400) + Level 3 DC Fast Charging</td>
                  <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400 text-xs">2027 gains direct Tesla Supercharger access and public DC fast charging.</td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">PHEV AC Onboard Charger</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">6.6 kW AC</td>
                  <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">11.0 kW AC</td>
                  <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400 text-xs">Home Level 2 recharge speeds boosted by 66%, completing in ~2.5 hrs on a 48A circuit.</td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">PHEV Output</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">302 hp net system</td>
                  <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">321 hp net system (6th-Gen)</td>
                  <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400 text-xs">+19 hp gain from upgraded rear e-axle transaxle inverter and high-discharge battery cells.</td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Woodland Edition Clearance</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">8.1 inches (206 mm)</td>
                  <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">9.1 inches (231 mm)</td>
                  <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400 text-xs">+1.0&quot; factory suspension lift paired with Falken WILDPEAK A/T Trail rubber.</td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Active Safety &amp; Recording</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">TSS 3.0</td>
                  <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">TSS 4.0 with Factory Drive Recorder</td>
                  <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400 text-xs">Standardized front and cabin recording integrated with forward radar and optical cameras.</td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Powertrain Options</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">100% Electrified (HEV &amp; PHEV standard)</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">100% Electrified (HEV &amp; PHEV standard)</td>
                  <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400 text-xs">Gas-only trims fully discontinued across both 2026 and 2027 Canadian &amp; US model years.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
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
              <span>Provincial &amp; Federal Incentive Phase-Downs</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Incentive eligibility is strictly tied to vehicle registration and delivery date, not deposit date:
            </p>
            <ul className="text-xs text-zinc-700 dark:text-zinc-300 space-y-2">
              <li className="flex items-start gap-1.5">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Transport Canada iZEV:</strong> Delivers up to $5,000 CAD for eligible PHEVs. If annual MSRP inflation nudges higher trim packages over the federal MSRP price cap ($55,000–$65,000 threshold), the subsidy may diminish or drop entirely.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Quebec Roulez vert &amp; BC CleanBC:</strong> Quebec&apos;s Roulez vert provincial rebate undergoes legislative reductions for registrations stamped in 2027. Locking in a late 2026 delivery guarantees maximum current point-of-sale payouts.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>US Federal Clean Vehicle Credit (Section 30D):</strong> Japanese-assembled RAV4 PHEV units remain ineligible for US 30D purchase credits (lease loop-hole notwithstanding). Delivery timing changes do not alter US federal battery sourcing restrictions.</span>
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
