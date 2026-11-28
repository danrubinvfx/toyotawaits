import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { GuideDisclaimer } from '@/components/common/GuideDisclaimer';
import { OrderRolloverCalculator } from '@/components/calculators/OrderRolloverCalculator';
import { CalculatorBridgeBanner } from '@/components/wait-times/CalculatorBridgeBanner';
import { FlagValues } from 'flags/react';
import { calculatorBridgeFraming, evaluateFlagSafely } from '@/flags';
import { buildAmazonAffiliateUrl } from '@/lib/affiliate';
import { UsGuideMarketBrief } from '@/components/guides/UsGuideMarketBrief';
import { getRolloverPriceProtectionStats } from '@/lib/db/rollover-stats';
import {
  buildGuideMetadata,
  buildGuideFaqSchema,
  buildGuideArticleSchema,
  getRequestMarketMetadata,
  US_GUIDE_CONFIGS,
} from '@/lib/seo/host-metadata';
import {
  Car,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Warehouse,
  Layers,
  ExternalLink,
  Shield,
  Camera,
  Box,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const { instant } = { instant: false };

export async function generateMetadata(): Promise<Metadata> {
  return buildGuideMetadata({
    slug: 'toyota-tacoma-2026-vs-2027',
    caTitle: '2026 vs. 2027 Toyota Tacoma Canada: Unbundled Options, Pricing & Wait Times | ToyotaWaits',
    caDescription:
      'Compare the 2026 and 2027 Toyota Tacoma & i-FORCE MAX (Nov 28, 2026 update). Carryover 278/326-hp powertrains, +$180 USD on Limited/TRD Pro, and unbundled option packages.',
    usTitle: '2026 vs. 2027 Toyota Tacoma United States: Unbundled Options, +$180 Pricing & Wait Times | ToyotaWaits',
    usDescription:
      'Compare the 2026 and 2027 Toyota Tacoma in the United States (Nov 28, 2026 update). Carryover 2.4L i-FORCE (278 hp) and i-FORCE MAX (326 hp), +$180 USD on Limited/TRD Pro, and unbundled option packages.',
  });
}

const faqData = [
  {
    question: 'What changed on the 2027 Toyota Tacoma in the November 28, 2026 official update?',
    answer:
      'Per Toyota’s November 28, 2026 release, the 2027 Tacoma carries over its 2.4L i-FORCE (278 hp) and i-FORCE MAX (326 hp) powertrains with minor price increases (+$180 USD on Limited, Limited i-FORCE MAX, and TRD Pro) and newly unbundled/restructured option packages so buyers can add individual features without large mandatory bundles.',
  },
  {
    question: 'Will my 2026 Toyota Tacoma order roll over into a 2027 model year?',
    answer:
      'Yes. Unallocated 2026 Tacoma orders—especially i-FORCE MAX hybrids, Trailhunter, and TRD Pro—roll over to 2027 VINs while keeping your dealership waitlist priority.',
  },
  {
    question: 'Should I take an incoming 2026 Tacoma allocation or wait for a 2027?',
    answer:
      'Take an incoming 2026 allocation if it already matches your preferred options and is offered at MSRP (saving $180 USD on Limited/TRD Pro). Wait for a 2027 build if you want to take advantage of unbundled option packages to add specific standalone features without paying for an expensive mandatory package.',
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
  headline: '2026 vs. 2027 Toyota Tacoma: Unbundled Options, Pricing & Wait Times',
  description:
    'Compare the 2026 and 2027 Toyota Tacoma & i-FORCE MAX (Nov 28, 2026 official update). Carryover 2.4L i-FORCE (278 hp) and i-FORCE MAX (326 hp), +$180 USD on Limited/TRD Pro, and unbundled option packages.',
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
  datePublished: '2026-11-28T00:00:00.000Z',
  dateModified: '2026-11-28T00:00:00.000Z',
  mainEntityOfPage: 'https://www.toyotawaits.ca/guides/toyota-tacoma-2026-vs-2027',
};

const DAY_ONE_GEAR_ITEMS = [
  {
    id: 'tuxmat-tacoma-4th-gen',
    title: 'TuxMat / High-Wall 3D Double Cab Floor Liners',
    category: 'Interior Armor',
    badge: 'Confirmed Fit 2024–2027',
    priceCad: '~$250 CAD',
    description:
      'Laser-measured high-wall floor liners engineered for the 4th-gen Toyota Tacoma Double Cab floor pan.',
    query: 'Toyota Tacoma 2024 2025 2026 all weather floor mats',
    ctaText: 'Check Floor Liners on Amazon ↗',
    icon: Shield,
  },
  {
    id: 'fitcamx-tacoma-dashcam',
    title: 'FitcamX 4K OEM-Integrated Dashcam',
    category: 'Safety & Evidence',
    badge: 'Plug & Play TSS Housing',
    priceCad: '~$245 CAD',
    description:
      'OEM-style stealth 4K dashcam that snaps cleanly into the 4th-gen Tacoma mirror housing with zero exposed wires.',
    query: 'Fitcamx Toyota Tacoma 2024 2025 2026 4K dashcam',
    ctaText: 'Check FitcamX on Amazon ↗',
    icon: Camera,
  },
  {
    id: 'spigen-tacoma-screen-protector',
    title: 'Spigen Tempered Glass 14" Screen Protector',
    category: 'Screen Defense',
    badge: '9H Anti-Glare',
    priceCad: '~$42 CAD',
    description:
      'Matte-finish 9H tempered glass protector for the 14-inch Toyota Multimedia display, cutting sun glare and fingerprints.',
    query: 'Toyota Tacoma 2024 2025 14 inch screen protector',
    ctaText: 'Check Screen Protector on Amazon ↗',
    icon: Layers,
  },
  {
    id: 'tacoma-console-organizer',
    title: 'Center Console Dual-Tier Organizer Tray',
    category: 'Interior Storage',
    badge: 'Day-1 Essential',
    priceCad: '~$28 CAD',
    description:
      'Custom drop-in divider tray engineered for the 4th-gen Tacoma center armrest bin to organize tools, keys, and cables.',
    query: 'Toyota Tacoma 2024 2025 2026 center console organizer tray',
    ctaText: 'Check Console Tray on Amazon ↗',
    icon: Box,
  },
];

export default async function Tacoma2026Vs2027GuidePage() {
  const [{ isUS }, framingVariant, priceProtectionStats] = await Promise.all([
    getRequestMarketMetadata('/guides/toyota-tacoma-2026-vs-2027'),
    evaluateFlagSafely(calculatorBridgeFraming, 'control'),
    getRolloverPriceProtectionStats('tacoma'),
  ]);

  const usConfig = US_GUIDE_CONFIGS['toyota-tacoma-2026-vs-2027'];
  const activeFaqs = isUS ? usConfig.faqs : faqData;
  const activeFaqPageSchema = isUS ? buildGuideFaqSchema(activeFaqs) : faqPageSchema;
  const activeArticleSchema = isUS
    ? buildGuideArticleSchema({
        slug: 'toyota-tacoma-2026-vs-2027',
        isUS: true,
        caHeadline: articleSchema.headline,
        caDescription: articleSchema.description,
        usHeadline: '2026 vs. 2027 Toyota Tacoma United States: Unbundled Options & Wait Times',
        usDescription: usConfig.verdictSummary,
        datePublished: articleSchema.datePublished,
        dateModified: articleSchema.dateModified,
      })
    : articleSchema;

  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      <FlagValues values={{ 'calculator-bridge-framing': framingVariant }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(activeFaqPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(activeArticleSchema) }}
      />

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
            4th-Gen Tacoma (i-FORCE &amp; i-FORCE MAX)
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Nov 28, 2026 Official Update
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          {isUS
            ? '2026 vs. 2027 Toyota Tacoma United States: Unbundled Options, Pricing & Wait Times'
            : '2026 vs. 2027 Toyota Tacoma Canada: Unbundled Options, Pricing & Wait Times'}
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          Official November 28, 2026 update: Carryover 2.4L i-FORCE (278 hp) and i-FORCE MAX (326 hp) lineup with minor price increases (+$180 USD on Limited, Limited i-FORCE MAX, and TRD Pro) and unbundled/restructured option packages so buyers can add individual features without large mandatory packages.
        </p>
      </div>

      {isUS && <UsGuideMarketBrief {...usConfig} />}

      <div
        role="region"
        aria-label="Affiliate and Editorial Transparency Notice"
        className="rounded-2xl border border-red-500/30 bg-red-500/10 dark:bg-red-500/5 p-4 sm:p-5 text-xs text-zinc-700 dark:text-zinc-300 space-y-2 shadow-xs"
      >
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>Independent Buyer Intelligence</span>
        </div>
        <p className="leading-relaxed text-[11px] sm:text-xs">
          <strong>Editorial Notice:</strong> ToyotaWaits is an independent crowdsourced community tracker.
          All 2026 and 2027 Tacoma pricing adjustments and unbundled package changes reflect Toyota’s official November 28, 2026 model-year announcement.
        </p>
      </div>

      {/* 1. Year-Over-Year Comparison Table */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Year-Over-Year Comparison Table (2026 vs. 2027)
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Official November 28, 2026 specs, unbundled package structure, and minor pricing deltas.
          </p>
        </div>

        <Card className="border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Specification / Trim</th>
                  <th className="py-3 px-4">2026 Toyota Tacoma</th>
                  <th className="py-3 px-4">2027 Toyota Tacoma</th>
                  <th className="py-3 px-4">Year-Over-Year Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Base Powertrain (i-FORCE)</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">2.4L Turbo 4-Cyl (278 hp / 317 lb-ft)</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">2.4L Turbo 4-Cyl (278 hp / 317 lb-ft)</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Carryover
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Hybrid Powertrain (i-FORCE MAX)</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">2.4L Turbo Hybrid (326 hp / 465 lb-ft)</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">2.4L Turbo Hybrid (326 hp / 465 lb-ft)</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Carryover
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Option Package Structure</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Large bundled Upgrade / Premium packages</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Unbundled &amp; restructured standalone options</td>
                  <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                    Easier a-la-carte feature selection
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Limited, Limited MAX &amp; TRD Pro</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">2026 Base MSRP</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">2027 Base MSRP</td>
                  <td className="py-3 px-4 font-bold text-amber-600 dark:text-amber-400">+$180 USD</td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Assembly Plants</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Guanajuato (TMMGT) &amp; Baja California (TMMBC)</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Guanajuato (TMMGT) &amp; Baja California (TMMBC)</td>
                  <td className="py-3 px-4 text-zinc-500">Same North American plants</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* 2. Pass or Take It Decision Matrix */}
      <section className="space-y-4" aria-label="Pass or Take It Decision Matrix">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            &ldquo;Pass or Take It?&rdquo; Decision Matrix
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Should you take an incoming 2026 Tacoma allocation or wait for a 2027 build?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/15 p-5 space-y-3">
            <Badge className="bg-emerald-600 text-white text-xs font-bold">Take Incoming 2026 Allocation If...</Badge>
            <ul className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 space-y-2 list-disc pl-4">
              <li>An incoming 2026 SR5, TRD Sport, or TRD Off-Road already has your exact desired equipment at MSRP.</li>
              <li>You are buying Limited, Limited i-FORCE MAX, or TRD Pro and want to save $180 USD.</li>
              <li>Powertrains (278 hp / 326 hp) are 100% identical between 2026 and 2027.</li>
            </ul>
          </Card>

          <Card className="border-amber-500/40 bg-amber-500/5 dark:bg-amber-950/15 p-5 space-y-3">
            <Badge className="bg-amber-600 text-white text-xs font-bold">Wait for 2027 Model Year If...</Badge>
            <ul className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 space-y-2 list-disc pl-4">
              <li>You want specific individual features without paying for a large bundled 2026 option package.</li>
              <li>You are custom-requesting a 2027 allocation with the newly restructured option groups.</li>
              <li>You prefer a newer 2027 model-year VIN for long-term resale.</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Live Dealer Price-Protection Tracker */}
      <section
        aria-label="Live Dealer Price-Protection Tracker"
        data-testid="rollover-price-protection-tracker"
        className="rounded-2xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-5 sm:p-6 space-y-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge className="bg-amber-600 text-white text-xs font-bold">
            Live Dealer Price-Protection Tracker
          </Badge>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            2026 → 2027 Toyota Tacoma Rollover Reports
          </span>
        </div>
        {priceProtectionStats.hasSufficientSample ? (
          <div className="space-y-2">
            <p className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
              {priceProtectionStats.honoredPercent}% of {priceProtectionStats.totalRollovers} rolled-over Toyota Tacoma orders had their original 2026 MSRP honored.
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Honored 2026 MSRP: {priceProtectionStats.honoredCount} ({priceProtectionStats.honoredPercent}%) · Adjusted to 2027 MSRP: {priceProtectionStats.adjustedCount} ({priceProtectionStats.adjustedPercent}%)
            </p>
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
            Collecting 2026→2027 rollover pricing reports for Toyota Tacoma ({priceProtectionStats.totalRollovers} verified so far; tracker displays live percentages once 3+ rollover reports are logged).{' '}
            <Link href="/submit?model=tacoma" className="font-bold text-amber-600 dark:text-amber-400 underline">
              Report your rollover outcome →
            </Link>
          </p>
        )}
      </section>

      {/* 3. Live Inventory & Wait Times CTA */}
      <section aria-label="Live Inventory Allocation Bridge">
        <div className="relative overflow-hidden rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-500/15 via-red-500/10 to-zinc-50 dark:from-red-950/50 dark:via-zinc-900/70 dark:to-zinc-950 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white shadow-xs">
                <Warehouse className="h-3.5 w-3.5" />
                <span>Live Stock &amp; Wait Times</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                Track 2026 &amp; 2027 Tacoma Wait Times and Incoming Stock
              </h3>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Compare real-world allocation wait times across i-FORCE and i-FORCE MAX trims or browse incoming dealer inventory.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-black text-sm px-6 py-6 shadow-md cursor-pointer">
                <Link href="/inventory?model=Tacoma" className="gap-2">
                  <span>Explore Live Toyota Tacoma Inventory ↗</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-zinc-300 dark:border-zinc-700 text-xs font-bold px-4 py-6">
                <Link href="/wait-times/tacoma" className="gap-1.5">
                  <span>View Live Tacoma Wait Times →</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Day-1 Delivery Gear Shelf */}
      <section className="space-y-6" aria-label="Day-1 Delivery Gear Shelf">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Confirmed 4th-Gen (2024–2027) Fitment</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Day-1 Delivery Gear Shelf: 2026 &amp; 2027 Toyota Tacoma
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {DAY_ONE_GEAR_ITEMS.map((item) => {
            const href = buildAmazonAffiliateUrl({ query: item.query, market: isUS ? 'US' : 'CA' });
            const IconComponent = item.icon;
            return (
              <Card key={item.id} className="flex flex-col justify-between border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs">
                <CardHeader className="space-y-2.5 p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <IconComponent className="h-4 w-4 text-amber-500" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{item.category}</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px] whitespace-nowrap">{item.badge}</Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-snug">{item.title}</CardTitle>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-base font-extrabold text-amber-600 dark:text-amber-400 font-mono">{item.priceCad}</span>
                  </div>
                  <CardDescription className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pt-1">{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-5 pt-0">
                  <Button asChild className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-semibold gap-1.5 shadow-xs cursor-pointer">
                    <a href={href} target="_blank" rel="sponsored noopener noreferrer nofollow">
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

      {/* 5. Frequently Asked Questions */}
      <section className="space-y-4" aria-label="Frequently Asked Questions">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {activeFaqs.map((faq, index) => (
            <Card key={index} className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-base">
                <HelpCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
                <span>{faq.question}</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pl-6">{faq.answer}</p>
            </Card>
          ))}
        </div>
      </section>

      <CalculatorBridgeBanner
        href="/calculator?model=tacoma"
        framingVariant={framingVariant}
      />

      <OrderRolloverCalculator
        modelSlug="tacoma"
        modelName="Toyota Tacoma"
        baseMsrpCad={46950}
        baseMsrpUsd={32145}
        my27DeltaCad={250}
        my27DeltaUsd={180}
        medianWaitDays={120}
        isUS={isUS}
      />

      <GuideDisclaimer />
    </div>
  );
}
