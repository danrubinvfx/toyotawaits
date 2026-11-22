import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { GuideDisclaimer } from '@/components/common/GuideDisclaimer';
import { OrderRolloverCalculator } from '@/components/calculators/OrderRolloverCalculator';
import { buildAmazonAffiliateUrl } from '@/lib/affiliate';
import { UsGuideMarketBrief } from '@/components/guides/UsGuideMarketBrief';
import {
  buildGuideMetadata,
  buildGuideFaqSchema,
  buildGuideArticleSchema,
  getRequestMarketMetadata,
  US_GUIDE_CONFIGS,
} from '@/lib/seo/host-metadata';
import {
  Car,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Calendar,
  DollarSign,
  Fuel,
  Warehouse,
  Layers,
  Calculator,
  ExternalLink,
  Shield,
  Camera,
  Box,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const { instant } = { instant: false };

export async function generateMetadata(): Promise<Metadata> {
  return buildGuideMetadata({
    slug: 'toyota-corolla-cross-2026-vs-2027',
    caTitle: '2026 vs. 2027 Toyota Corolla Cross Canada: Pricing, Trims & Wait Times | ToyotaWaits',
    caDescription:
      'Compare the 2026 and 2027 Toyota Corolla Cross & Hybrid in Canada. Breakdown of 2027 Canadian MSRP increases (~$565–$955), carryover 196-hp hybrid specs, and MTM Huntsville queue rollovers.',
    usTitle: '2026 vs. 2027 Toyota Corolla Cross United States (2026–2027 Guide): Pricing, Trims & Wait Times | ToyotaWaits',
    usDescription:
      'Compare the 2026 and 2027 Toyota Corolla Cross & Hybrid in the United States. Breakdown of 2027 trim updates, carryover 196-hp hybrid specs, and MTM Huntsville allocation rollovers.',
  });
}

const faqData = [
  {
    question: 'What changed on the 2027 Toyota Corolla Cross in Canada?',
    answer:
      'The 2027 Toyota Corolla Cross is a mechanical carryover in Canada following its 2026 styling refresh. Gas models keep the 169-hp 2.0L engine and Hybrid models keep the 196-hp 5th-gen AWD system, while Canadian all-in prices rise ~$565 on Gas trims and ~$950 on Hybrid trims.',
  },
  {
    question: 'Will my 2026 Corolla Cross Hybrid deposit roll over into a 2027?',
    answer:
      'Yes. Because Canadian Corolla Cross Hybrid waitlists run 6 to 12+ months from the Huntsville, Alabama (MTM) plant, unallocated 2026 orders automatically roll into 2027 VINs without resetting your dealership queue position.',
  },
  {
    question: 'Should I take a 2026 Corolla Cross allocation or wait for a 2027?',
    answer:
      'Take an incoming 2026 allocation immediately. Because there are no hardware or powertrain upgrades for 2027 in Canada, passing on a 2026 only delays delivery by months and adds ~$565 to $955 CAD in model-year price increases.',
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
    '2026 vs. 2027 Toyota Corolla Cross Canada: Pricing, Trims & Wait Times',
  description:
    'Compare the 2026 and 2027 Toyota Corolla Cross & Hybrid in Canada. Breakdown of 2027 Canadian MSRP increases (~$565–$955), carryover 196-hp hybrid specs, and MTM Huntsville queue rollovers.',
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
  datePublished: '2026-11-14T00:00:00.000Z',
  dateModified: '2026-11-14T00:00:00.000Z',
  mainEntityOfPage: 'https://www.toyotawaits.ca/guides/toyota-corolla-cross-2026-vs-2027',
};

const DAY_ONE_GEAR_ITEMS = [
  {
    id: 'tuxmat-corolla-cross',
    title: 'TuxMat / High-Wall 3D All-Weather Floor Liners',
    category: 'Interior Armor',
    badge: 'Confirmed Fit 2022–2027',
    priceCad: '~$240 CAD',
    description:
      'Laser-scanned high-wall floor liners engineered for the 2022–2027 Corolla Cross Gas and Hybrid cabin. Protects carpet from Canadian winter road salt, slush, and gravel brine.',
    query: 'Toyota Corolla Cross all weather floor mats',
    ctaText: 'Check Floor Liners on Amazon ↗',
    icon: Shield,
  },
  {
    id: 'fitcamx-corolla-cross',
    title: 'FitcamX 4K OEM Integrated Dashcam',
    category: 'Stealth Optics',
    badge: 'Plug & Play TSS Housing',
    priceCad: '~$210 CAD',
    description:
      'OEM-look 4K UHD dashcam that replaces the factory rearview mirror shroud and taps directly into the Toyota Safety Sense (TSS 3.0) camera harness with zero exposed wires.',
    query: 'Fitcamx 4K dash cam Toyota Corolla Cross',
    ctaText: 'Check FitcamX on Amazon ↗',
    icon: Camera,
  },
  {
    id: 'spigen-corolla-cross-screen',
    title: 'Spigen 8" / 10.5" Tempered Glass Screen Protector',
    category: 'Touchscreen Defense',
    badge: '9H Anti-Glare',
    priceCad: '~$35 CAD',
    description:
      'Optical-grade 9H tempered glass protector shielding the 8.0-inch standard or 10.5-inch available Toyota Multimedia display against scratches, glare, and fingerprints.',
    query: 'Spigen screen protector Toyota Corolla Cross',
    ctaText: 'Check Screen Protector on Amazon ↗',
    icon: Layers,
  },
  {
    id: 'corolla-cross-console-tray',
    title: 'Center Console Dual-Tier Organizer Tray',
    category: 'Interior Storage',
    badge: 'Day-1 Essential',
    priceCad: '~$25 CAD',
    description:
      'Custom drop-in divider tray designed for the Corolla Cross center armrest bin. Separates daily essentials on top while keeping lower storage accessible for USB-C cables.',
    query: 'Toyota Corolla Cross center console organizer tray',
    ctaText: 'Check Console Tray on Amazon ↗',
    icon: Box,
  },
];

export default async function CorollaCross2026Vs2027GuidePage() {
  const { isUS } = await getRequestMarketMetadata('/guides/toyota-corolla-cross-2026-vs-2027');
  const usConfig = US_GUIDE_CONFIGS['toyota-corolla-cross-2026-vs-2027'];
  const activeFaqs = isUS ? usConfig.faqs : faqData;
  const activeFaqPageSchema = isUS ? buildGuideFaqSchema(activeFaqs) : faqPageSchema;
  const activeArticleSchema = isUS
    ? buildGuideArticleSchema({
        slug: 'toyota-corolla-cross-2026-vs-2027',
        isUS: true,
        caHeadline: articleSchema.headline,
        caDescription: articleSchema.description,
        usHeadline: articleSchema.headline.replace(/Canada/g, 'United States'),
        usDescription: usConfig.verdictSummary,
        datePublished: articleSchema.datePublished,
        dateModified: articleSchema.dateModified,
      })
    : articleSchema;
  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* FAQPage & Article Structured Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(activeFaqPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(activeArticleSchema) }}
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
          2026 vs. 2027 Toyota Corolla Cross Canada: Pricing, Trims &amp; Wait Times
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          Compare the 2026 and 2027 Toyota Corolla Cross &amp; Hybrid in Canada. Full breakdown of 2027 Canadian all-in MSRP increases (~$565–$956 CAD), carryover 196-hp 5th-gen hybrid and 169-hp gas specifications, and how MTM Huntsville, Alabama waitlist rollovers work.
        </p>
      </div>

      {isUS && <UsGuideMarketBrief {...usConfig} />}

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
          All trim specifications, Canadian all-in pricing figures, and allocation timelines reflect verified Canadian dealership ordering guides and Mazda Toyota Manufacturing (MTM) Huntsville, Alabama production schedules.
        </p>
      </div>

      {/* 1. Side-by-Side Year-Over-Year Comparison Table (2026 vs. 2027 Canadian Specs) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Year-Over-Year Comparison Table (2026 vs. 2027 Canadian Specs)
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Side-by-side comparison of Canadian powertrains, 7-trim lineup, multimedia hardware, and all-in starting prices (including Freight &amp; PDI).
          </p>
        </div>

        <Card className="border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Specification / Canadian Trim</th>
                  <th className="py-3 px-4">2026 Toyota Corolla Cross</th>
                  <th className="py-3 px-4">2027 Toyota Corolla Cross</th>
                  <th className="py-3 px-4">Year-Over-Year Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Gas Powertrain</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    2.0L 4-Cyl (169 hp, CVT, FWD/AWD, 7.4–7.8 L/100 km)
                  </td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    2.0L 4-Cyl (169 hp, CVT, FWD/AWD, 7.4–7.8 L/100 km)
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Identical Carryover
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Hybrid Powertrain</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    2.0L 5th-Gen Hybrid e-AWD (196 hp, e-CVT, 5.6 L/100 km combined)
                  </td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    2.0L 5th-Gen Hybrid e-AWD (196 hp, e-CVT, 5.6 L/100 km combined)
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Identical Carryover
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Canadian Trim Lineup</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    Gas (L FWD, L AWD, LE FWD, LE AWD, XLE AWD) &amp; Hybrid (SE AWD, XSE AWD)
                  </td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    Gas (L FWD, L AWD, LE FWD, LE AWD, XLE AWD) &amp; Hybrid (SE AWD, XSE AWD)
                  </td>
                  <td className="py-3 px-4 text-xs text-zinc-600 dark:text-zinc-400">
                    Identical 7-trim Canadian lineup (note: US dropped Hybrid S, Canada never had Hybrid S)
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Infotainment &amp; Safety</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    8.0&quot; standard / 10.5&quot; available Multimedia, wireless CarPlay/AA, TSS 3.0, standard heated front seats
                  </td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    8.0&quot; standard / 10.5&quot; available Multimedia, wireless CarPlay/AA, TSS 3.0, standard heated front seats
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Identical Carryover
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors bg-zinc-50/40 dark:bg-zinc-900/20">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                    L FWD (All-In Starting Price incl. Freight/PDI)
                  </td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">$31,973 (2026)</td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">$32,538 (2027)</td>
                  <td className="py-3 px-4 font-mono text-xs font-bold text-red-600 dark:text-red-400">
                    +$565
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors bg-zinc-50/40 dark:bg-zinc-900/20">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                    LE AWD (All-In Starting Price incl. Freight/PDI)
                  </td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">$35,428 (2026)</td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">$35,993 (2027)</td>
                  <td className="py-3 px-4 font-mono text-xs font-bold text-red-600 dark:text-red-400">
                    +$565
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors bg-zinc-50/40 dark:bg-zinc-900/20">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                    Hybrid SE AWD (All-In Starting Price incl. Freight/PDI)
                  </td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">$39,297 (2026)</td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">$40,248 (2027)</td>
                  <td className="py-3 px-4 font-mono text-xs font-bold text-red-600 dark:text-red-400">
                    +$951
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors bg-zinc-50/40 dark:bg-zinc-900/20">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                    Hybrid XSE AWD (All-In Starting Price incl. Freight/PDI)
                  </td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">$42,122 (2026)</td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">$43,078 (2027)</td>
                  <td className="py-3 px-4 font-mono text-xs font-bold text-red-600 dark:text-red-400">
                    +$956
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* 2. "Pass or Take It?" Decision Matrix */}
      <section className="space-y-4" aria-label="Pass or Take It Decision Matrix">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            &ldquo;Pass or Take It?&rdquo; Decision Matrix: Take the 2026 Allocation Immediately
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Why Canadian deposit holders should claim any incoming 2026 Corolla Cross at MSRP rather than waiting for a 2027 VIN.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6 space-y-4">
          <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
            <strong>Verdict: Accept any incoming 2026 allocation at MSRP immediately.</strong> Because Toyota already executed the exterior fascia and interior console refresh for the 2026 model year, the <strong>2027 Toyota Corolla Cross is a 100% mechanical and equipment carryover in Canada</strong>. Passing on a matched 2026 VIN does not get you a newer engine, larger battery, or updated infotainment—it only costs you <strong>~$565 to $956 CAD</strong> in model-year price increases and forces you into another <strong>6 to 12 month MTM Huntsville queue cycle</strong>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Mechanical &amp; Tech Delta</span>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">0% (Identical Carryover)</p>
              <p className="text-xs text-zinc-500 mt-0.5">Same 196-hp Hybrid e-AWD, 169-hp Gas &amp; TSS 3.0</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">2027 Canadian Price Hike</span>
              <p className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-1">+$565 to +$956 CAD</p>
              <p className="text-xs text-zinc-500 mt-0.5">+$565 on Gas trims; +$951–$956 on Hybrid AWD</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Queue Penalty If Passed</span>
              <p className="text-sm font-bold text-red-600 dark:text-red-400 mt-1">+6 to +12 Months</p>
              <p className="text-xs text-zinc-500 mt-0.5">Constrained MTM Huntsville, Alabama export quotas</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MTM Huntsville Queue Rollover & Waitlist Rules */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            MTM Huntsville Queue Rollovers &amp; Canadian Lead Times
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            How unallocated 2026 deposits transition to 2027 VINs at the Mazda Toyota Manufacturing (MTM) plant in Alabama.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-3">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
              <Calendar className="h-4 w-4" />
              <span>Automatic 2026-to-2027 Queue Rollover</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Every North American Corolla Cross is assembled at <strong>Mazda Toyota Manufacturing (MTM)</strong> in Huntsville, Alabama. Because Canadian Corolla Cross Hybrid SE and XSE waitlists run <strong>6 to 12+ months</strong> (compared to 2 to 5 months for Gas L/LE/XLE trims), many 2026 orders remain unfulfilled when MTM switches model-year production.
            </p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              <strong>Queue Priority Preserved:</strong> Unallocated 2026 orders automatically roll over into 2027 VINs based on your original deposit date without resetting your dealership waitlist position.
            </p>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
              <DollarSign className="h-4 w-4" />
              <span>Canadian Pricing &amp; Provincial Deposit Rights</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              When an unallocated 2026 factory order rolls into a 2027 VIN, the bill of sale adjusts to Toyota Canada&apos;s 2027 pricing bulletin:
            </p>
            <div className="text-xs space-y-1.5 text-zinc-600 dark:text-zinc-400 pt-1">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>2027 all-in Canadian pricing increases by <strong>+$565 CAD</strong> on L/LE/XLE Gas models and <strong>+$951–$956 CAD</strong> on Hybrid SE/XSE AWD models.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Under provincial consumer protection rules (OMVIC, AMVIC, VSA), if a model-year price increase exceeds your signed contract terms before a VIN is assigned, you may cancel for a 100% deposit refund.</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 4. Live Inventory & Payback Calculator CTA Card */}
      <section aria-label="Live Inventory Allocation Bridge">
        <div className="relative overflow-hidden rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-500/15 via-red-500/10 to-zinc-50 dark:from-red-950/50 dark:via-zinc-900/70 dark:to-zinc-950 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white shadow-xs">
                <Warehouse className="h-3.5 w-3.5" />
                <span>Live Stock &amp; Payback Tools</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                Want to Skip the 6–12 Month Corolla Cross Waitlist?
              </h3>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Because 2026 and 2027 Corolla Cross models are mechanically identical, claiming an incoming 2026 dealer allocation lets you bypass the Huntsville backlog and save up to $956 CAD—or run the math to see how fast the 196-hp Hybrid pays back its premium over Gas.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button
                asChild
                className="bg-red-600 hover:bg-red-700 text-white font-black text-sm px-6 py-6 shadow-md cursor-pointer"
              >
                <Link href="/inventory?model=Corolla%20Cross" className="gap-2">
                  <span>Explore Live Corolla Cross Inventory ↗</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-zinc-300 dark:border-zinc-700 text-xs font-bold px-4 py-6"
              >
                <Link href="/calculator/corolla-cross-hybrid" className="gap-1.5">
                  <Calculator className="h-3.5 w-3.5" />
                  <span>Run Hybrid vs. Gas Payback Calculator →</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Day-1 Delivery Gear Shelf (4 cards using buildAmazonAffiliateUrl search fallbacks) */}
      <section className="space-y-6" aria-label="Day-1 Delivery Gear Shelf">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Confirmed 2022–2027 Fitment</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              Day-1 Delivery Gear Shelf: 2026 &amp; 2027 Corolla Cross
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
              Because cabin dimensions and multimedia displays are 100% identical between 2026 and 2027, all interior protection and TSS 3.0 accessories fit both model years without modification.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {DAY_ONE_GEAR_ITEMS.map((item) => {
            const href = buildAmazonAffiliateUrl({
              query: item.query,
              market: isUS ? 'US' : 'CA',
            });
            const IconComponent = item.icon;

            return (
              <Card
                key={item.id}
                className="flex flex-col justify-between border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs hover:border-amber-500/50 transition-all duration-200"
              >
                <CardHeader className="space-y-2.5 p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <IconComponent className="h-4 w-4 text-amber-500" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        {item.category}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-[10px] whitespace-nowrap">
                      {item.badge}
                    </Badge>
                  </div>

                  <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                    {item.title}
                  </CardTitle>

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-base font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                      {item.priceCad}
                    </span>
                  </div>

                  <CardDescription className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pt-1">
                    {item.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-4 sm:p-5 pt-0">
                  <Button
                    asChild
                    className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-semibold gap-1.5 shadow-xs cursor-pointer"
                  >
                    <a
                      href={href}
                      target="_blank"
                      rel="sponsored noopener noreferrer nofollow"
                    >
                      <span>{item.ctaText}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 6. Frequently Asked Questions */}
      <section className="space-y-4" aria-label="Frequently Asked Questions">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Key answers for Canadian buyers comparing 2026 vs. 2027 Toyota Corolla Cross &amp; Hybrid allocations.
          </p>
        </div>

        <div className="space-y-4">
          {activeFaqs.map((faq, index) => (
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
      <OrderRolloverCalculator
        modelSlug="corolla-cross"
        modelName="Toyota Corolla Cross"
        baseMsrpCad={27250}
        baseMsrpUsd={24035}
        my27DeltaCad={565}
        my27DeltaUsd={450}
        medianWaitDays={150}
        isUS={isUS}
        initialMarket={isUS ? 'US' : 'CA'}
      />

      <GuideDisclaimer />
    </div>
  );
}
