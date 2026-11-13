import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { GuideDisclaimer } from '@/components/common/GuideDisclaimer';
import { CorollaCrossVsRav4DayOneGearShelf } from '@/components/guides/corolla-cross-vs-rav4-day-one-gear';
import {
  Car,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Calendar,
  DollarSign,
  Fuel,
  Compass,
  Warehouse,
  Layers,
  Calculator,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const { instant } = { instant: false };

export function generateMetadata(): Metadata {
  return {
    title: '2026 vs. 2027 Toyota Corolla Cross Canada: Price, Hybrid Changes & Waitlist Rollover | ToyotaWaits',
    description:
      'Compare the 2026 and 2027 Toyota Corolla Cross in Canada. Expected MSRP increases, Hybrid AWD vs. Gas lead times, MTM Alabama factory waitlist rollovers, and RAV4 Hybrid comparison.',
    alternates: {
      canonical: 'https://www.toyotawaits.ca/guides/toyota-corolla-cross-2026-vs-2027',
    },
    openGraph: {
      title: '2026 vs. 2027 Toyota Corolla Cross Canada: Price, Hybrid Changes & Waitlist Rollover | ToyotaWaits',
      description:
        'Compare the 2026 and 2027 Toyota Corolla Cross in Canada. Expected MSRP increases, Hybrid AWD vs. Gas lead times, MTM Alabama factory waitlist rollovers, and RAV4 Hybrid comparison.',
      url: 'https://www.toyotawaits.ca/guides/toyota-corolla-cross-2026-vs-2027',
      siteName: 'ToyotaWaits.ca',
      locale: 'en_CA',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: '2026 vs. 2027 Toyota Corolla Cross Canada: Price, Hybrid Changes & Waitlist Rollover | ToyotaWaits',
      description:
        'Compare the 2026 and 2027 Toyota Corolla Cross in Canada: MSRP expectations, Hybrid AWD vs. Gas lead times, MTM Alabama waitlist rollovers, and RAV4 Hybrid comparison.',
    },
  };
}

const faqData = [
  {
    question: 'Are there mechanical differences between the 2026 and 2027 Toyota Corolla Cross in Canada?',
    answer:
      'No major mechanical changes are introduced for 2027. Both model years carry over the 196-hp 2.0L 5th-Gen Hybrid Synergy Drive with standard Electronic On-Demand AWD (5.6 L/100 km combined) and the 169-hp 2.0L Dynamic Force gas engine on L, LE, and XLE grades.',
  },
  {
    question: 'How much will the 2027 Toyota Corolla Cross MSRP increase in Canada?',
    answer:
      'Canadian buyers should expect a routine annual inflationary MSRP adjustment of approximately $400 to $850 CAD across 2027 Corolla Cross Gas and Hybrid trims. Accepting an incoming 2026 build slot locks in current model-year pricing and avoids 2027 freight or base price bumps.',
  },
  {
    question: 'Will my Canadian 2026 Corolla Cross deposit automatically roll over to a 2027 model?',
    answer:
      'Yes. In Toyota Canada\'s bi-weekly allocation system, unfulfilled factory orders at the Mazda Toyota Manufacturing (MTM) plant in Huntsville, Alabama automatically transition to 2027 VINs during the late-autumn tooling changeover (November–January) without losing dealership waitlist priority.',
  },
  {
    question: 'How do 2026–2027 Corolla Cross Hybrid wait times compare to the Gas model and RAV4 Hybrid?',
    answer:
      'In Canada, the Corolla Cross Gas AWD typically delivers in 2 to 5 months, whereas the Corolla Cross Hybrid AWD faces 6 to 12 month waitlists due to constrained MTM Alabama export quotas. Ironically, the larger Ontario-built RAV4 Hybrid often delivers faster (4 to 8 months) despite costing roughly $4,500 to $5,500 CAD more.',
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

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline:
    '2026 vs. 2027 Toyota Corolla Cross Canada: Price, Hybrid Changes & Waitlist Rollover',
  description:
    'Compare the 2026 and 2027 Toyota Corolla Cross in Canada. Expected MSRP increases, Hybrid AWD vs. Gas lead times, MTM Alabama factory waitlist rollovers, and RAV4 Hybrid comparison.',
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
  datePublished: '2026-11-13T00:00:00.000Z',
  dateModified: '2026-11-13T00:00:00.000Z',
  mainEntityOfPage: 'https://www.toyotawaits.ca/guides/toyota-corolla-cross-2026-vs-2027',
};

export default function CorollaCross2026Vs2027GuidePage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* Article & FAQPage Structured Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
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
            Corolla Cross Gas &amp; Hybrid AWD
          </Badge>
          <Badge variant="secondary" className="text-xs">
            2026 vs. 2027 Model Year
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          2026 vs. 2027 Toyota Corolla Cross Canada: Price, Hybrid Changes &amp; Waitlist Rollover
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          Should Canadian buyers accept an allocated 2026 Toyota Corolla Cross build slot or wait for a 2027 VIN?
          Here is the complete breakdown of Canadian MSRP expectations, Hybrid AWD vs. Gas lead times, MTM Alabama factory deposit rollover rules, and how it stacks up against the RAV4 Hybrid.
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
          <span>Independent Canadian Buyer Intelligence</span>
        </div>
        <p className="leading-relaxed text-[11px] sm:text-xs">
          <strong>Editorial Notice:</strong> ToyotaWaits is an independent crowdsourced community tracker.
          All trim specifications, allocation cycles, and mechanical benchmarks reflect verified Canadian dealership ordering guides and Mazda Toyota Manufacturing (MTM) Huntsville, Alabama production schedules.
        </p>
      </div>

      {/* 1. Executive Verdict */}
      <section className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Executive Verdict: Take the 2026 Allocation Without Hesitation
        </h2>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6 space-y-4">
          <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
            If your Canadian dealership calls with an incoming <strong>2026 Toyota Corolla Cross Hybrid or Gas AWD allocation</strong>, <strong>accept the build immediately</strong>. The 2027 Corolla Cross is a mechanical carryover utilizing the identical 196-hp 5th-Gen Hybrid Synergy Drive and 169-hp 2.0L Dynamic Force gas powertrain. Declining a matched 2026 VIN forfeits your priority allocation slot, pushing your delivery back <strong>6 to 10+ months</strong> while exposing you to an estimated <strong>$400 to $850 CAD 2027 MSRP price increase</strong>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Mechanical Delta</span>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">0% (100% Carryover)</p>
              <p className="text-xs text-zinc-500 mt-0.5">Identical 196-hp Hybrid AWD &amp; 169-hp Gas</p>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Expected 2027 MSRP Hike</span>
              <p className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-1">+$400 – $850 CAD</p>
              <p className="text-xs text-zinc-500 mt-0.5">Annual base price &amp; freight inflation</p>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Queue Penalty If Passed</span>
              <p className="text-sm font-bold text-red-600 dark:text-red-400 mt-1">+6 to +10 Months</p>
              <p className="text-xs text-zinc-500 mt-0.5">Constrained MTM Alabama export quotas</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Canadian MSRP Expectations & 2026 vs 2027 Specification Matrix */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Canadian MSRP Expectations &amp; 2026 vs. 2027 Specification Matrix
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Side-by-side comparison of Canadian trim pricing, powertrain specs, infotainment hardware, and winter equipment.
          </p>
        </div>

        <Card className="border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Specification / Trim</th>
                  <th className="py-3 px-4">2026 Toyota Corolla Cross</th>
                  <th className="py-3 px-4">2027 Toyota Corolla Cross</th>
                  <th className="py-3 px-4">Buyer Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Gas Base MSRP (L / LE / XLE)</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">~$27,950 – $35,850 CAD</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Projected ~$28,400 – $36,500 CAD</td>
                  <td className="py-3 px-4 text-xs text-red-600 dark:text-red-400 font-medium">
                    2026 locks in lower base MSRP
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Hybrid AWD MSRP (SE / XSE)</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">~$34,550 – $37,350 CAD</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Projected ~$35,100 – $38,150 CAD</td>
                  <td className="py-3 px-4 text-xs text-red-600 dark:text-red-400 font-medium">
                    Save ~$500–$800 CAD on 2026 VIN
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Hybrid Powertrain</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">2.0L 5th-Gen Hybrid AWD (196 hp)</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">2.0L 5th-Gen Hybrid AWD (196 hp)</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" /> 100% Mechanical Carryover
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Gas Powertrain</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">2.0L Dynamic Force 4-Cyl (169 hp)</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">2.0L Dynamic Force 4-Cyl (169 hp)</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Identical
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Combined Fuel Economy</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Hybrid: 5.6 L/100 km | Gas AWD: 7.8 L/100 km</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Hybrid: 5.6 L/100 km | Gas AWD: 7.8 L/100 km</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Identical NRCan Ratings
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Active Safety &amp; Cockpit</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Toyota Safety Sense 3.0 + 8&quot;/10.5&quot; Display</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Toyota Safety Sense 3.0 + 8&quot;/10.5&quot; Display</td>
                  <td className="py-3 px-4 text-xs text-zinc-600 dark:text-zinc-400">
                    Minor exterior paint &amp; accent refreshes
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* 3. Hybrid AWD vs. Gas Lead Times in Canada */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Hybrid AWD vs. Gas Lead Times Across Canada
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Why the 196-hp Corolla Cross Hybrid SE and XSE waitlists are twice as long as Gas L/LE/XLE trims.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-lg text-zinc-900 dark:text-zinc-100">
                Corolla Cross Gas (L / LE / XLE AWD)
              </span>
              <Badge variant="secondary" className="text-xs">2 – 5 Months Wait</Badge>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Equipped with the 169-hp 2.0L naturally aspirated engine and mechanical Dynamic Torque Control AWD (standard on LE AWD and XLE), gas allocations arrive steadily across Ontario, Alberta, and BC dealerships.
            </p>
            <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5 pt-1">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span><strong>Fastest Trim:</strong> LE AWD (highest Canadian production volume)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span><strong>Best For:</strong> Drivers driving under 14,000 km/year who need immediate delivery</span>
              </li>
            </ul>
          </Card>

          <Card className="border-red-500/40 dark:border-red-500/30 bg-red-500/5 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-lg text-red-600 dark:text-red-400">
                Corolla Cross Hybrid AWD (SE / XSE)
              </span>
              <Badge className="bg-red-600 text-white font-bold text-xs">6 – 12 Months Wait</Badge>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              The 196-hp Hybrid SE and XSE cut 0–100 km/h times to ~8.0 seconds while dropping fuel consumption to 5.6 L/100 km. However, U.S. domestic demand absorbs the majority of Huntsville, Alabama hybrid output, restricting Canadian provincial quotas.
            </p>
            <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5 pt-1">
              <li className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span><strong>Longest Queues:</strong> British Columbia &amp; Quebec (8–12 months on XSE)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span><strong>Allocation Tip:</strong> Accepting flexible exterior colors on SE AWD cuts wait times by 2–3 months</span>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* 4. Factory Deposit Rollover Rules (MTM Huntsville, Alabama) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Factory Deposit Rollover Rules (MTM Huntsville, Alabama)
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            How unfulfilled 2026 Canadian waitlist deposits transition to 2027 VINs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-3">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
              <Calendar className="h-4 w-4" />
              <span>Automatic Queue Rollover Protection</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Every Corolla Cross sold in Canada is built at the <strong>Mazda Toyota Manufacturing (MTM)</strong> joint-venture plant in Huntsville, Alabama. Between <strong>November and January</strong>, MTM transitions assembly lines from 2026 to 2027 model-year VINs.
            </p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              <strong>You Do Not Lose Your Spot:</strong> Toyota Canada dealerships manage waitlists by original deposit timestamp. If your 2026 order is not allocated before the Alabama plant changeover, your request automatically converts into a 2027 order at the exact same queue rank.
            </p>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
              <DollarSign className="h-4 w-4" />
              <span>Price Protection &amp; OMVIC / AMVIC Deposit Rights</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Unlike locked factory VIN contracts, a waitlist rollover to a new model year is subject to Toyota Canada&apos;s official 2027 MSRP bulletin:
            </p>
            <div className="text-xs space-y-1.5 text-zinc-600 dark:text-zinc-400 pt-1">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Expect a $400–$850 CAD base MSRP adjustment when your bill of sale updates to a 2027 VIN.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Under provincial consumer laws (OMVIC, AMVIC, VSA), if a model-year price hike exceeds your agreed contract terms and no VIN was assigned, you retain the right to a full refund of your deposit.</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 5. Comparison vs. Toyota RAV4 Hybrid */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Corolla Cross Hybrid vs. Toyota RAV4 Hybrid: Should You Step Up?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Why Ontario TMMC production often makes the larger RAV4 Hybrid faster to get in Canada than the Alabama-built Corolla Cross.
          </p>
        </div>

        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                1. The Canadian Waitlist Paradox
              </span>
              <p className="font-bold text-zinc-900 dark:text-zinc-100">
                Ontario TMMC vs. Alabama MTM
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Because the RAV4 Hybrid is built domestically in Cambridge and Woodstock, Ontario (TMMC), Canadian dealers receive far larger bi-weekly allocations (4–8 months typical wait) compared to the imported Corolla Cross Hybrid (6–12 months).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                2. Cabin &amp; Cargo Dimensions
              </span>
              <p className="font-bold text-zinc-900 dark:text-zinc-100">
                21.5 vs. 37.5 Cu. Ft. Rear Cargo
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                The Corolla Cross (175.6&quot; length, 32.0&quot; rear legroom) is ideal for urban parking and solo commuters. Families with rear-facing child seats or strollers strongly benefit from the RAV4&apos;s 37.8&quot; rear legroom and +74% deeper cargo bay.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                3. Price &amp; Efficiency Delta
              </span>
              <p className="font-bold text-zinc-900 dark:text-zinc-100">
                ~$4,400 CAD Savings on Corolla Cross
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Starting around ~$34,550 CAD vs. ~$38,950 CAD for the RAV4 Hybrid LE, the Corolla Cross Hybrid saves ~$4,400 upfront and sips slightly less fuel (5.6 vs. 6.0 L/100 km).
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <span className="text-xs text-zinc-500">
              Want the full dimensional &amp; child-seat breakdown between both crossovers?
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild variant="outline" size="sm" className="text-xs font-semibold">
                <Link href="/guides/toyota-corolla-cross-vs-rav4-hybrid">
                  Read Corolla Cross vs. RAV4 Hybrid Shootout →
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="text-xs font-semibold">
                <Link href="/calculator/corolla-cross-hybrid">
                  Corolla Cross Hybrid Payback Calculator →
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* 6. Live Allocation Bridge Card */}
      <section aria-label="Live Inventory Allocation Bridge">
        <div className="relative overflow-hidden rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-500/15 via-red-500/10 to-zinc-50 dark:from-red-950/50 dark:via-zinc-900/70 dark:to-zinc-950 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white shadow-xs">
                <Warehouse className="h-3.5 w-3.5" />
                <span>In-Transit Stock Bridge</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                Want to Skip the 6–12 Month Corolla Cross Waitlist?
              </h3>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Because 2026 and 2027 Corolla Cross models share identical powertrains, claiming an incoming dealer allocation in BC, Ontario, or Alberta lets you bypass the Alabama factory backlog and dodge 2027 MSRP increases.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button
                asChild
                className="bg-red-600 hover:bg-red-700 text-white font-black text-sm px-6 py-6 shadow-md cursor-pointer"
              >
                <Link href="/inventory?model=corolla-cross" className="gap-2">
                  <span>Explore Live Corolla Cross Stock ↗</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-zinc-300 dark:border-zinc-700 text-xs font-bold px-4 py-6"
              >
                <Link href="/wait-times/corolla-cross">
                  <span>View Wait-Time Tracker →</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Direct-Fit Delivery Day Gear Shelf */}
      <CorollaCrossVsRav4DayOneGearShelf />

      {/* 8. Frequently Asked Questions */}
      <section className="space-y-4" aria-label="Frequently Asked Questions">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Key questions from Canadian buyers comparing 2026 vs. 2027 Toyota Corolla Cross allocations.
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <Card
              key={index}
              className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-2 shadow-xs"
            >
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-base">
                <HelpCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
                <span>{faq.question}</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pl-6">
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
