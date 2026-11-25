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
    slug: 'toyota-camry-2026-vs-2027',
    caTitle: '2026 vs. 2027 Toyota Camry Canada: Pricing, AWD Trims & Wait Times | ToyotaWaits',
    caDescription:
      'Compare the 2026 and 2027 Toyota Camry Hybrid in Canada (on sale Nov 2026). Full trim pricing ($39,148–$49,488 all-in), carryover 225/232-hp hybrid specs, and allocation advice.',
    usTitle: '2026 vs. 2027 Toyota Camry United States (2026–2027 Guide): Pricing, AWD Trims & Wait Times | ToyotaWaits',
    usDescription:
      'Compare the 2026 and 2027 Toyota Camry Hybrid in the United States. Full trim comparison, carryover 225/232-hp hybrid specs, dealer markups, and allocation advice.',
  });
}

const faqData = [
  {
    question: 'What changed on the 2027 Toyota Camry Hybrid in Canada?',
    answer:
      'The 2027 Toyota Camry is a direct mechanical carryover of the 9th-generation all-hybrid sedan in Canada, retaining the 2.5L 5th-Gen Toyota Hybrid System (225 hp on SE FWD and 232 hp on Electronic On-Demand AWD trims), 5.0–5.5 L/100 km combined fuel economy, and standard Toyota Safety Sense 3.0.',
  },
  {
    question: 'How much does the 2027 Toyota Camry cost in Canada compared to 2026?',
    answer:
      'In Canada, the 2027 Camry SE FWD ($35,560 MSRP / $39,148 all-in) and SE Upgrade AWD ($39,255 MSRP / $42,843 all-in) rise by +$485 CAD, the Nightshade AWD is $40,382 MSRP ($43,970 all-in), while the top XLE AWD ($45,795 MSRP / $49,383 all-in) and XSE AWD ($45,900 MSRP / $49,488 all-in) increase by just +$70 CAD.',
  },
  {
    question: 'Should I take a 2026 Toyota Camry allocation or wait for a 2027?',
    answer:
      'Claim an incoming 2026 Camry Hybrid at MSRP to save up to $485 CAD on SE grades; otherwise take whichever 2026 or 2027 build arrives first, since both model years share identical 9th-generation styling, interior tech, and hybrid powertrains.',
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
    '2026 vs. 2027 Toyota Camry Canada: Pricing, AWD Trims & Wait Times',
  description:
    'Compare the 2026 and 2027 Toyota Camry Hybrid in Canada (on sale Nov 2026). Full trim pricing ($39,148–$49,488 all-in), carryover 225/232-hp hybrid specs, and allocation advice.',
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
  mainEntityOfPage: 'https://www.toyotawaits.ca/guides/toyota-camry-2026-vs-2027',
};

const DAY_ONE_GEAR_ITEMS = [
  {
    id: 'tuxmat-camry-9th-gen',
    title: 'TuxMat / High-Wall 3D All-Weather Floor Liners',
    category: 'Interior Armor',
    badge: 'Confirmed Fit 2025–2027',
    priceCad: '~$240 CAD',
    description:
      'Laser-measured high-wall floor liners engineered for the 9th-gen (XV80) Camry Hybrid FWD and AWD floor pan.',
    query: 'Toyota Camry 2025 2026 all weather floor mats',
    ctaText: 'Check Floor Liners on Amazon ↗',
    icon: Shield,
  },
  {
    id: 'fitcamx-camry-9th-gen',
    title: 'FitcamX 4K OEM Integrated Dashcam',
    category: 'Stealth Optics',
    badge: 'Plug & Play TSS 3.0',
    priceCad: '~$210 CAD',
    description:
      'Factory-look 4K UHD dashcam integrating seamlessly into the 9th-gen Camry rearview mirror shroud with zero visible cables.',
    query: 'Fitcamx 4K dash cam Toyota Camry 2025 2026',
    ctaText: 'Check FitcamX on Amazon ↗',
    icon: Camera,
  },
  {
    id: 'spigen-camry-screen',
    title: 'Spigen 8" / 12.3" Tempered Glass Screen Protector',
    category: 'Touchscreen Defense',
    badge: '9H Anti-Glare',
    priceCad: '~$35 CAD',
    description:
      'Optical-grade 9H matte anti-glare tempered glass shield protecting the Toyota Multimedia touchscreen against scratches and smudges.',
    query: 'Spigen screen protector Toyota Camry 12.3 inch',
    ctaText: 'Check Screen Shield on Amazon ↗',
    icon: Layers,
  },
  {
    id: 'camry-console-tray',
    title: 'Center Console Organizer Tray',
    category: 'Interior Storage',
    badge: 'Day-1 Essential',
    priceCad: '~$25 CAD',
    description:
      'Custom drop-in divider tray engineered for the 9th-gen Camry armrest console bin, keeping coins, sunglasses, and cords tidy.',
    query: 'Toyota Camry 2025 2026 center console organizer tray',
    ctaText: 'Check Console Tray on Amazon ↗',
    icon: Box,
  },
];

export default async function Camry2026Vs2027GuidePage() {
  const { isUS } = await getRequestMarketMetadata('/guides/toyota-camry-2026-vs-2027');
  const usConfig = US_GUIDE_CONFIGS['toyota-camry-2026-vs-2027'];
  const activeFaqs = isUS ? usConfig.faqs : faqData;
  const activeFaqPageSchema = isUS ? buildGuideFaqSchema(activeFaqs) : faqPageSchema;
  const activeArticleSchema = isUS
    ? buildGuideArticleSchema({
        slug: 'toyota-camry-2026-vs-2027',
        isUS: true,
        caHeadline: articleSchema.headline,
        caDescription: articleSchema.description,
        usHeadline: articleSchema.headline.replace(/Canada/g, 'United States'),
        usDescription: usConfig.verdictSummary,
        datePublished: articleSchema.datePublished,
        dateModified: articleSchema.dateModified,
      })
    : articleSchema;
  const framingVariant = await evaluateFlagSafely(calculatorBridgeFraming, 'control');
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
            9th-Gen Camry Hybrid (FWD &amp; e-AWD)
          </Badge>
          <Badge variant="secondary" className="text-xs">
            2026 vs. 2027 Model Year
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          2026 vs. 2027 Toyota Camry Canada: Pricing, AWD Trims &amp; Wait Times
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          Compare the 2026 and 2027 Toyota Camry Hybrid in Canada (on sale November 2026). Complete breakdown of 2027 Canadian trim pricing ($39,148–$49,488 all-in), carryover 225-hp FWD / 232-hp AWD 5th-gen hybrid specs, and Georgetown, Kentucky (TMMK) allocation rollovers.
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
          <span>Independent Canadian Buyer Intelligence</span>
        </div>
        <p className="leading-relaxed text-[11px] sm:text-xs">
          <strong>Editorial Notice:</strong> ToyotaWaits is an independent crowdsourced community tracker.
          All 2026 and 2027 Camry specifications, Canadian all-in pricing, and allocation timelines reflect official Toyota Canada pricing bulletins.
        </p>
      </div>

      {/* 1. Year-Over-Year + Canadian Trim Pricing Table */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Year-Over-Year Comparison &amp; 2027 Canadian Trim Pricing
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Side-by-side comparison of mechanical carryover specs and official 2026 vs. 2027 Canadian pricing across all 5 trims.
          </p>
        </div>

        <Card className="border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Specification / Canadian Trim</th>
                  <th className="py-3 px-4">2026 Toyota Camry Hybrid</th>
                  <th className="py-3 px-4">2027 Toyota Camry Hybrid</th>
                  <th className="py-3 px-4">Year-Over-Year Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Powertrain &amp; Efficiency</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">2.5L 5th-Gen Hybrid (225 hp FWD / 232 hp AWD; 5.0–5.5 L/100 km)</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">2.5L 5th-Gen Hybrid (225 hp FWD / 232 hp AWD; 5.0–5.5 L/100 km)</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" /> 100% Mechanical Carryover
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Safety &amp; Infotainment</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">TSS 3.0 + 8.0&quot; (SE) / 12.3&quot; (XLE/XSE) Multimedia</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">TSS 3.0 + 8.0&quot; (SE) / 12.3&quot; (XLE/XSE) Multimedia</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Identical Carryover
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors bg-zinc-50/40 dark:bg-zinc-900/20">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">SE FWD (225 hp, 5.0 L/100 km)</td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">$35,075 MSRP (2026)</td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">$35,560 MSRP ($39,148 all-in)</td>
                  <td className="py-3 px-4 font-mono text-xs font-bold text-red-600 dark:text-red-400">+$485 CAD</td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors bg-zinc-50/40 dark:bg-zinc-900/20">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">SE Upgrade AWD &amp; Nightshade AWD (232 hp)</td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">SE Upgrade AWD: $38,770 MSRP (2026)</td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">
                    SE Upgrade: $39,255 ($42,843 all-in) | Nightshade: $40,382 ($43,970 all-in)
                  </td>
                  <td className="py-3 px-4 font-mono text-xs font-bold text-red-600 dark:text-red-400">+$485 CAD</td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors bg-zinc-50/40 dark:bg-zinc-900/20">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">XLE AWD &amp; XSE AWD (232 hp)</td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">XLE: $45,725 | XSE: $45,830 MSRP (2026)</td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">
                    XLE: $45,795 ($49,383 all-in) | XSE: $45,900 ($49,488 all-in)
                  </td>
                  <td className="py-3 px-4 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">+$70 CAD (Virtually Unchanged)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* 2. Decision Matrix */}
      <section className="space-y-4" aria-label="Pass or Take It Decision Matrix">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          &ldquo;Pass or Take It?&rdquo; Decision Matrix: Take Whichever Arrives First
        </h2>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6 space-y-4">
          <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
            <strong>Verdict:</strong> Claim an incoming <strong>2026 Camry Hybrid at MSRP</strong> to save up to <strong>$485 CAD</strong> on SE/SE Upgrade grades; on XLE AWD and XSE AWD, the 2027 price bump is just <strong>+$70 CAD</strong>, so take whichever 2026 or 2027 build slot arrives first.
          </p>
        </div>
      </section>

      {/* 3. Live Inventory CTA */}
      <section aria-label="Live Inventory Allocation Bridge">
        <div className="relative overflow-hidden rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-500/15 via-red-500/10 to-zinc-50 dark:from-red-950/50 dark:via-zinc-900/70 dark:to-zinc-950 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white shadow-xs">
                <Warehouse className="h-3.5 w-3.5" />
                <span>In-Transit 2026 &amp; 2027 Sedans</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                Want to Skip the Camry Hybrid AWD Waitlist?
              </h3>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Browse live Canadian dealer inventory for 2026 and 2027 Camry Hybrid AWD sedans or check real-time provincial delivery timelines.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-black text-sm px-6 py-6 shadow-md cursor-pointer">
                <Link href="/inventory?model=Camry" className="gap-2">
                  <span>Explore Live Toyota Camry Inventory ↗</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-zinc-300 dark:border-zinc-700 text-xs font-bold px-4 py-6">
                <Link href="/wait-times/camry" className="gap-1.5">
                  <span>View Live Camry Wait Times →</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-zinc-300 dark:border-zinc-700 text-xs font-bold px-4 py-6">
                <Link href="/calculator/camry-hybrid" className="gap-1.5">
                  <span>Camry Hybrid Savings Calculator →</span>
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
            <span>Confirmed 9th-Gen (2025–2027) Fitment</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Day-1 Delivery Gear Shelf: 2026 &amp; 2027 Toyota Camry
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
        href="/calculator/camry-hybrid"
        framingVariant={framingVariant}
      />

      <OrderRolloverCalculator
        modelSlug="camry"
        modelName="Toyota Camry Hybrid"
        baseMsrpCad={34300}
        baseMsrpUsd={28700}
        my27DeltaCad={485}
        my27DeltaUsd={385}
        medianWaitDays={120}
        isUS={isUS}
        initialMarket={isUS ? 'US' : 'CA'}
      />

      <GuideDisclaimer />
    </div>
  );
}
