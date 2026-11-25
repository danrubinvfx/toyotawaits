import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { ShareButton } from '@/components/ui/ShareButton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { GuideDisclaimer } from '@/components/common/GuideDisclaimer';
import { OrderRolloverCalculator } from '@/components/calculators/OrderRolloverCalculator';
import { CalculatorBridgeBanner } from '@/components/wait-times/CalculatorBridgeBanner';
import { FlagValues } from 'flags/react';
import { calculatorBridgeFraming, evaluateFlagSafely } from '@/flags';
import { SiennaDayOneGearShelf } from '@/components/guides/sienna-day-one-gear';
import { UsGuideMarketBrief } from '@/components/guides/UsGuideMarketBrief';
import {
  buildGuideMetadata,
  buildGuideFaqSchema,
  getRequestMarketMetadata,
  US_GUIDE_CONFIGS,
} from '@/lib/seo/host-metadata';
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
export const { instant } = { instant: false };

export async function generateMetadata(): Promise<Metadata> {
  return buildGuideMetadata({
    slug: 'toyota-sienna-2026-vs-2027',
    caTitle: '2026 vs 2027 Toyota Sienna Canada: 251-HP Hybrid, $3,580 Price Hike & Wait Times | ToyotaWaits',
    caDescription:
      'Official Nov 2026 specs: 2027 Toyota Sienna upgrades to 251 hp (6th-gen hybrid), TSS 4.0, and dual 12.3" screens—with a $3,580 CAD base price increase. Compare 2026 vs 2027 trims and wait times.',
    usTitle: '2026 vs 2027 Toyota Sienna: 251-HP Hybrid, TSS 4.0 & Order Rollover Guide | ToyotaWaits',
    usDescription:
      'Official Nov 2026 specs: 2027 Toyota Sienna upgrades to 251 hp (6th-gen hybrid), TSS 4.0, and dual 12.3" screens—with a $3,580 CAD base price increase. Compare 2026 vs 2027 trims and wait times.',
  });
}

const faqData = [
  {
    question: 'Are there mechanical differences between the 2026 and 2027 Toyota Sienna?',
    answer:
      'Yes. Announced on November 20, 2026, the 2027 Sienna upgrades to Toyota’s 6th-generation Toyota Hybrid System (THS 6) with silicon-carbide motors and a transaxle-integrated inverter. Output rises from 245 hp to 251 hp (176 lb-ft), 0–100 km/h improves from 8.1s to 7.7s FWD / 7.8s AWD, and fuel economy improves to 6.4 L/100 km combined (6.0 city / 6.8 hwy). It also adds a revised steering column/gearbox, Vehicle Braking Posture Control, a -1.6 dB dash silencer, Toyota Safety Sense 4.0 (TSS 4.0), built-in Drive Recorder dashcam, and standard 12.3-inch dual displays.',
  },
  {
    question: 'How much did the 2027 Toyota Sienna price increase in Canada, and which trims changed?',
    answer:
      'For early 2027 arrival in Canada, Toyota trimmed the lineup to 7 grades (dropping Limited AWD and XSE Tech AWD). The base LE FWD starts at $54,000 CAD (+$3,580 over 2026’s $50,420), scaling to $73,000 CAD for Platinum AWD ($76,658 with freight, PDI, and fees). Unbuilt late-2026 allocations automatically roll to 2027 VINs without losing dealer queue priority.',
  },
  {
    question: 'What is the difference between the Sienna XSE and LE suspension, and what is new for 2027?',
    answer:
      'The XSE features exclusive sport-tuned dampers and thicker anti-sway bars for flatter cornering, whereas LE, XLE, and Platinum use standard soft-ride comfort tuning. For 2027, the LE adds a rear liftgate kick sensor (without tow hitch) and upgrades from an 8-inch screen and 7-inch MID to standard 12.3-inch dual displays (touchscreen + digital gauge cluster), while XSE AWD and Platinum AWD gain a 12.9-inch rear entertainment touchscreen and new Storm Cloud paint replaces Cypress.',
  },
];

const usFaqData = [
  {
    question: 'What changed on the 2027 Toyota Sienna vs. 2026?',
    answer:
      'Announced on November 20, 2026, the 2027 Toyota Sienna upgrades to Toyota’s 6th-gen hybrid system (251 hp / 176 lb-ft, up from 245 hp) with silicon-carbide motors, a transaxle-integrated inverter, and 37 mpg US combined. It also adds standard Toyota Safety Sense 4.0 (TSS 4.0), a built-in Drive Recorder dashcam, standard dual 12.3-inch screens (replacing the 8-inch touchscreen and 7-inch MID), Vehicle Braking Posture Control, a -1.6 dB dash silencer, and Storm Cloud paint.',
  },
  {
    question: 'How long does Princeton, Indiana (TMMI) Sienna allocation transit take in the US?',
    answer:
      'Once a Sienna allocation is assigned to your US dealership, rail and truck transit from TMMI in Princeton, Indiana takes 30–90 days. Unallocated late-2026 orders automatically roll to 2027 VINs without losing queue priority.',
  },
  {
    question: 'Are US Toyota Sienna deposits refundable under state law?',
    answer:
      'US deposit refund rules vary by state. States such as California protect buyer deposit refunds prior to VIN assignment on unsigned contracts; always get written refundability terms before placing a hold.',
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

export default async function Sienna2026Vs2027GuidePage() {
  const { isUS } = await getRequestMarketMetadata('/guides/toyota-sienna-2026-vs-2027');
  const usConfig = US_GUIDE_CONFIGS['toyota-sienna-2026-vs-2027'];
  const activeFaqs = isUS ? usFaqData : faqData;
  const activeFaqPageSchema = isUS ? buildGuideFaqSchema(activeFaqs) : faqPageSchema;

  const framingVariant = await evaluateFlagSafely(calculatorBridgeFraming, 'control');

  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      <FlagValues values={{ 'calculator-bridge-framing': framingVariant }} />
      {/* FAQPage Structured Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(activeFaqPageSchema) }}
      />

      {/* Header & Breadcrumbs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 mb-2">
          <BackButton label="← Back to Guides Almanac" fallbackHref="/guides" />
          <ShareButton variant="header" title="2026 vs. 2027 Toyota Sienna: Key Differences, Trim Matrix & Wait Times" />
        </div>

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
          {isUS
            ? 'Should US buyers accept an allocated 2026 Sienna build slot or wait for a 2027 VIN? Here is the complete breakdown, USD MSRP & ADM range, Indiana factory queue rollover timing, and delivery day gear guide.'
            : 'Should Canadian buyers accept an allocated 2026 Sienna build slot or wait for a 2027 VIN? Here is the complete engineering breakdown, trim level equipment matrix, Indiana factory queue rollover timing, and delivery day gear guide.'}
        </p>
      </div>

      {isUS && (
        <UsGuideMarketBrief
          {...usConfig}
          verdictSummary="In the United States, the 2027 Toyota Sienna (announced Nov 20, 2026) upgrades to Toyota's 6th-gen hybrid system at 251 hp (176 lb-ft, up from 245 hp) with 37 mpg combined, standard Toyota Safety Sense 4.0 (TSS 4.0), built-in Drive Recorder dashcam, and dual 12.3-inch displays. Claim an allocated 2026 build at $0 MSRP for immediate delivery, or wait for a 2027 allocation from TMMI Princeton, Indiana (30–90 days transit once allocated)."
        />
      )}

      {/* Transparency Disclosure */}
      <div
        role="region"
        aria-label="Affiliate and Editorial Transparency Notice"
        className="rounded-2xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/5 p-4 sm:p-5 text-xs text-zinc-700 dark:text-zinc-300 space-y-2 shadow-xs"
      >
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>{isUS ? 'Independent US Buyer Intelligence' : 'Independent Canadian Buyer Intelligence'}</span>
        </div>
        <p className="leading-relaxed text-[11px] sm:text-xs">
          <strong>Editorial Notice:</strong> ToyotaWaits is an independent crowdsourced community tracker.
          {isUS
            ? ' All trim specifications, allocation cycles, and mechanical benchmarks reflect verified US dealership ordering guides (USD pricing) and real-world TMMI production schedules.'
            : ' All trim specifications, allocation cycles, and mechanical benchmarks reflect verified Canadian dealership ordering guides and real-world TMMI production schedules.'}
        </p>
      </div>

      {/* 1. Executive Summary & Quick Verdict */}
      <section className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Pass or Take It? 2026 Allocation vs. 2027 Upgrade Verdict
        </h2>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6 space-y-4">
          <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
            Officially announced on <strong>November 20, 2026</strong> (arriving early 2027), the <strong>2027 Toyota Sienna</strong> replaces carryover expectations with Toyota’s <strong>6th-gen Toyota Hybrid System (251 hp / 176 lb-ft)</strong> using silicon-carbide motors and a transaxle-integrated inverter.{' '}
            {isUS
              ? 'Acceleration improves to 7.7s FWD / 7.8s AWD (0–62 mph) while combined fuel economy improves to 37 mpg US combined. Every 2027 trim adds standard Toyota Safety Sense 4.0 (TSS 4.0), built-in Drive Recorder dashcam, standard 12.3" touchscreen + 12.3" digital gauge cluster, Vehicle Braking Posture Control, a -1.6 dB dash silencer, and Storm Cloud paint (replacing Cypress).'
              : '0–100 km/h improves from 8.1s to 7.7s FWD / 7.8s AWD, and fuel economy improves to 6.4 L/100 km combined (6.0 city / 6.8 hwy). Every 2027 trim adds standard Toyota Safety Sense 4.0 (TSS 4.0), built-in Drive Recorder dashcam, standard 12.3" touchscreen + 12.3" digital gauge cluster, Vehicle Braking Posture Control, and a -1.6 dB dash silencer. In Canada, the 7-grade lineup starts at $54,000 CAD (+$3,580 over 2026’s $50,420) and scales to $73,000 CAD for Platinum AWD ($76,658 with freight/PDI/fees).'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">6th-Gen Hybrid</span>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">251 hp / 176 lb-ft</p>
              <p className="text-xs text-zinc-500 mt-0.5">
                {isUS
                  ? '37 mpg combined · 7.7s FWD / 7.8s AWD'
                  : '6.4 L/100 km combined · 7.7s FWD / 7.8s AWD'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Safety &amp; Cabin Tech</span>
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-1">TSS 4.0 + Dual 12.3&quot;</p>
              <p className="text-xs text-zinc-500 mt-0.5">Drive Recorder dashcam &amp; -1.6 dB dash silencer</p>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                {isUS ? '2027 Arrival & Paint' : '2027 Canadian MSRP'}
              </span>
              <p className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-1">
                {isUS ? 'Early 2027 · Storm Cloud' : '$54,000 CAD (+$3,580)'}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                {isUS
                  ? 'Storm Cloud replaces Cypress; 7.7s–7.8s'
                  : '7 grades (up to $73,000 Platinum AWD)'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Side-by-Side Comparison Table */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Year-Over-Year Comparison (2026 vs. 2027)
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Direct parameter-by-parameter analysis of 2026 vs. 2027 powertrain, safety, cabin tech, and packaging specifications.
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
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">6th-Gen Toyota Hybrid System (251 hp / 176 lb-ft)</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Silicon-carbide motors &amp; transaxle-integrated inverter
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">0–100 km/h &amp; Fuel Economy</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    {isUS ? '8.1s (0–62 mph) · 36 mpg combined' : '8.1s · 6.6 L/100 km combined'}
                  </td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    {isUS
                      ? '7.7s FWD / 7.8s AWD · 37 mpg combined'
                      : '7.7s FWD / 7.8s AWD · 6.4 L/100 km combined (6.0 city / 6.8 hwy)'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      Faster acceleration &amp; lower fuel burn
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Chassis &amp; NVH</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Standard steering &amp; braking calibration</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Revised steering column/gearbox, Vehicle Braking Posture Control &amp; -1.6 dB dash silencer</td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      Quieter cabin &amp; refined ride control
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Safety &amp; Dashcam</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Toyota Safety Sense 3.0</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Standard Toyota Safety Sense 4.0 (TSS 4.0) + built-in Drive Recorder dashcam</td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                      Major active safety &amp; factory dashcam upgrade
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Displays &amp; Paint</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">8&quot; touchscreen (LE) + 7&quot; MID; Cypress paint</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Standard 12.3&quot; touchscreen + 12.3&quot; digital gauge cluster; Storm Cloud paint (replaces Cypress)</td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                      Dual 12.3&quot; displays standard across all trims
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
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">LE &amp; XLE+ Packaging</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">8.0&quot; LE screen; 4-way pass. seat on XLE</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">LE rear liftgate kick sensor (without hitch); XLE+ 8-way power passenger seat</td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                      Notable LE &amp; XLE+ convenience upgrades
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                    {isUS ? 'XSE & Rear Screen Options' : 'XSE & Canadian Rear Screen'}
                  </td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Sport SofTex without HUD or ventilated seats</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    {isUS
                      ? 'XSE adds ventilated/memory seats, HUD, Panoramic View Monitor; rear-seat entertainment available on select US grades'
                      : 'XSE adds ventilated/memory seats, HUD, Panoramic View Monitor; 12.9" rear screen on XSE AWD / Platinum AWD in Canada'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      Major XSE feature expansion
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Availability &amp; Starting MSRP</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    {isUS
                      ? '$39,185 USD base MSRP (in-transit 2026 allocations)'
                      : '$50,420 CAD base MSRP (9 grades, incl. Limited AWD & XSE Tech AWD)'}
                  </td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    {isUS
                      ? 'Arriving early 2027 (USD MSRP TBD; expect MY27 adjustment over $39,185)'
                      : 'Early 2027 arrival · $54,000 CAD LE FWD (+$3,580) to $73,000 CAD Platinum AWD ($76,658 w/ freight/PDI/fees); 7 grades'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                      {isUS
                        ? '2026 delivers sooner; 2027 adds major tech'
                        : 'Limited AWD & XSE Tech AWD dropped for 2027'}
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
            {isUS ? 'Complete US Trim Level Matrix' : 'Complete Canadian Trim Level Matrix'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {isUS
              ? 'Key seating configurations, suspension tuning, audio systems, and interior appointments across all trim grades.'
              : 'Canadian 2027 lineup consolidates to 7 grades (Limited AWD and XSE Tech AWD dropped), starting at $54,000 CAD LE FWD up to $73,000 CAD Platinum AWD.'}
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
              <p><strong>Seating &amp; Packaging:</strong> 8-passenger cloth seats; 2027 adds rear liftgate kick sensor (without hitch)</p>
              <p><strong>Infotainment &amp; Safety:</strong> 2026 uses 8.0-inch screen &amp; TSS 2.0/2.5; 2027 upgrades to standard 12.3&quot; touchscreen + 12.3&quot; digital cluster, TSS 4.0 &amp; Drive Recorder</p>
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
              <p><strong>Seating &amp; Upholstery:</strong> SofTex synthetic leather, power moonroof, hands-free kick sensor doors; 2027 XLE+ adds 8-way power passenger seat</p>
              <p><strong>Infotainment &amp; Safety:</strong> 12.3-inch Toyota Multimedia display (2027 adds 12.3&quot; digital cluster, TSS 4.0 &amp; Drive Recorder)</p>
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
              <p>
                <strong>2027 Tech &amp; Comfort Upgrades:</strong>{' '}
                {isUS
                  ? 'Ventilated & memory front seats, Head-Up Display (HUD), and Panoramic View Monitor'
                  : 'Ventilated & memory front seats, Head-Up Display (HUD), Panoramic View Monitor, and 12.9" rear screen on XSE AWD in Canada'}
              </p>
              <p><strong>Interior &amp; Styling:</strong> 18&quot; dark alloys, dark honeycomb grille, and two-tone Sport SofTex captain&apos;s chairs</p>
            </div>
          </Card>

          {/* Limited */}
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-lg text-zinc-900 dark:text-zinc-100">Limited (7-Passenger)</span>
              <Badge variant="outline" className="border-zinc-300 dark:border-zinc-700 text-xs">Luxury Tourer</Badge>
            </div>
            <div className="text-xs space-y-2 text-zinc-600 dark:text-zinc-400">
              <p><strong>Drivetrain:</strong> Standard Electronic AWD (AWD-e) with 251-hp THS 6 for 2027</p>
              <p><strong>Suspension &amp; Glass:</strong> Comfort suspension + acoustic laminated front side glass (-1.6 dB dash silencer for 2027)</p>
              <p><strong>Seating &amp; Upholstery:</strong> Genuine perforated leather, heated &amp; ventilated front seats, 2nd-row captain ottomans</p>
              <p><strong>Audio &amp; Safety:</strong> 12-speaker JBL audio; 2027 adds TSS 4.0, Drive Recorder &amp; 12.3&quot; digital cluster</p>
            </div>
          </Card>

          {/* Platinum */}
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-3 md:col-span-2 lg:col-span-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-lg text-zinc-900 dark:text-zinc-100">Platinum (7-Passenger)</span>
              <Badge className="bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-bold text-xs">Flagship Luxury</Badge>
            </div>
            <div className="text-xs space-y-2 text-zinc-600 dark:text-zinc-400">
              <p><strong>Drivetrain:</strong> Standard Electronic AWD (AWD-e) with 20&quot; metallic alloy wheels; 251-hp THS 6 &amp; new Storm Cloud paint option for 2027</p>
              <p><strong>Suspension &amp; Glass:</strong> Comfort-tuned chassis with full acoustic sound-deadening glass package</p>
              <p>
                <strong>Flagship Technology:</strong>{' '}
                {isUS
                  ? '10-inch color HUD, 360° Panoramic View Monitor, FridgeBox & vacuum, plus available rear-seat entertainment (2027 adds TSS 4.0 & Drive Recorder)'
                  : '10-inch color HUD, 360° Panoramic View Monitor, FridgeBox & vacuum, plus 12.9" rear screen on Platinum AWD in Canada (2027 adds TSS 4.0 & Drive Recorder)'}
              </p>
              <p><strong>Interior:</strong> Premium two-tone Noble Brown aniline-style leather with heated 2nd-row ottomans</p>
            </div>
          </Card>
        </div>
      </section>

      {/* 4. Queue Rollover Explanation (TMMI Indiana) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            {isUS ? 'How US Sienna Allocation Queue Rollovers Work' : 'How Canadian Sienna Allocation Queue Rollovers Work'}
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
              Every year between <strong>November and January</strong>, Toyota’s assembly plant in Princeton, Indiana (TMMI) executes model-year line changeovers. When your dealer receives their bi-weekly allocation drop from{' '}
              {isUS ? 'Toyota Motor North America (TMNA) or regional distributors (SET/GST)' : 'Toyota Canada'}, any unbuilt order that has not entered production status by late autumn automatically rolls to a 2027 model year build slot.
            </p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              <strong>Your Queue Position Is Safe:</strong>{' '}
              {isUS
                ? 'Because US dealers and regional distributors assign production slots sequentially based on deposit and allocation timestamp, your place in line does not reset when the plant shifts from 2026 to 2027 VIN codes.'
                : 'Because Toyota Canada assigns production slots sequentially based on dealer submission timestamp, your place in line does not reset when the plant shifts from 2026 to 2027 VIN codes.'}
            </p>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>Pass or Take It? Weighing a 2026 Slot vs. Early-2027 Arrival</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Because the 2027 Sienna (arriving early 2027) introduces THS 6 (251 hp), TSS 4.0, Drive Recorder, and dual 12.3&quot; screens, passing on a 2026 allocation is now a genuine trade-off rather than a pure penalty:
            </p>
            <div className="text-xs space-y-1.5 text-zinc-600 dark:text-zinc-400 pt-1">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Take 2026</strong> if you need a vehicle immediately and want to lock in 2026 pricing without waiting for early-2027 deliveries.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <span><strong>Roll / Wait for 2027</strong> if you can wait until early 2027 for 251-hp THS 6, TSS 4.0, Drive Recorder, and XSE/LE packaging upgrades.</span>
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
                Whether you want an unclaimed 2026 in-transit allocation today or are tracking early-2027 arrivals, filter verified dealer pipelines by {isUS ? 'state' : 'province'}, trim, and incoming freight status.
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
      <SiennaDayOneGearShelf initialMarket={isUS ? 'US' : 'CA'} />

      {/* 7. Frequently Asked Questions (FAQ Visual Accordion / Cards) */}
      <section className="space-y-4" aria-label="Frequently Asked Questions">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {isUS
              ? 'Common questions about the 2026 vs. 2027 Toyota Sienna transition, USD MSRP, ADM, and US state deposit rules.'
              : 'Common questions about the 2026 vs. 2027 Toyota Sienna transition in Canada.'}
          </p>
        </div>

        <div className="space-y-4">
          {activeFaqs.map((faq, index) => (
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
      <CalculatorBridgeBanner
        href="/calculator/sienna-hybrid"
        framingVariant={framingVariant}
      />

      <OrderRolloverCalculator
        modelSlug="sienna"
        modelName="Toyota Sienna"
        baseMsrpCad={50420}
        baseMsrpUsd={39185}
        my27DeltaCad={3580}
        my27DeltaUsd={900}
        medianWaitDays={360}
        isUS={isUS}
        initialMarket={isUS ? 'US' : 'CA'}
      />

      <GuideDisclaimer />
    </div>
  );
}
