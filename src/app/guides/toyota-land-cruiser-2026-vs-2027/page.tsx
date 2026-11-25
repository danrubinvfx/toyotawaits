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
  Compass,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const { instant } = { instant: false };

export async function generateMetadata(): Promise<Metadata> {
  return buildGuideMetadata({
    slug: 'toyota-land-cruiser-2026-vs-2027',
    caTitle: '2026 vs. 2027 Toyota Land Cruiser Canada: Premium Updates & Wait Times | ToyotaWaits',
    caDescription:
      'Compare the 2026 and 2027 Toyota Land Cruiser in Canada. Standard heated & ventilated rear seats on Premium Package, added TSS safety tech, Canadian pricing ($71,670–$86,835 MSRP), and stock tracking.',
    usTitle: '2026 vs. 2027 Toyota Land Cruiser United States (2026–2027 Guide): Premium Updates & Wait Times | ToyotaWaits',
    usDescription:
      'Compare the 2026 and 2027 Toyota Land Cruiser in the United States. Standard heated & ventilated rear seats on Premium Package, added TSS safety tech, and allocation tracking.',
  });
}

const faqData = [
  {
    question: 'What changed on the 2027 Toyota Land Cruiser in Canada?',
    answer:
      'The 2027 Toyota Land Cruiser carries over its 326-hp / 465 lb-ft 2.4L i-FORCE MAX hybrid 4WD powertrain, while the Land Cruiser Premium Package ($86,835 MSRP / $90,493 all-in) gains standard heated and ventilated second-row seats along with Front Cross Traffic Alert, Lane Change Assist, and Traffic Jam Assist.',
  },
  {
    question: 'What are the 2027 Toyota Land Cruiser grades and prices in Canada?',
    answer:
      'In Canada, the 2027 Land Cruiser lineup consists of three configurations: the retro round-headlight 1958 grade ($71,670 MSRP / $75,328 all-in), the Land Cruiser grade ($80,460 MSRP / $84,118 all-in), and the Land Cruiser with Premium Package ($86,835 MSRP / $90,493 all-in).',
  },
  {
    question: 'Should I take a 2026 Land Cruiser allocation or wait for a 2027?',
    answer:
      'Take an incoming 2026 allocation on the 1958 or base Land Cruiser grade to avoid annual MSRP creep, as those trims are unchanged. Hold for a 2027 model if you are ordering the Premium Package and want factory heated and ventilated rear seats.',
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
    '2026 vs. 2027 Toyota Land Cruiser Canada: Premium Updates & Wait Times',
  description:
    'Compare the 2026 and 2027 Toyota Land Cruiser in Canada. Standard heated & ventilated rear seats on Premium Package, added TSS safety tech, Canadian pricing ($71,670–$86,835 MSRP), and stock tracking.',
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
  mainEntityOfPage: 'https://www.toyotawaits.ca/guides/toyota-land-cruiser-2026-vs-2027',
};

const DAY_ONE_GEAR_ITEMS = [
  {
    id: 'tuxmat-land-cruiser-250',
    title: 'TuxMat / High-Wall 3D All-Weather Floor Liners',
    category: 'Interior Armor',
    badge: 'Confirmed Fit 2024–2027',
    priceCad: '~$260 CAD',
    description:
      'Laser-scanned high-wall floor and cargo liners built for the J250 Land Cruiser 5-passenger cabin, sealing out trail mud and winter slush.',
    query: 'Toyota Land Cruiser 2024 2025 2026 all weather floor mats',
    ctaText: 'Check Floor Liners on Amazon ↗',
    icon: Shield,
  },
  {
    id: 'fitcamx-land-cruiser-250',
    title: 'FitcamX 4K OEM Integrated Dashcam',
    category: 'Stealth Optics',
    badge: 'Plug & Play TSS 3.0',
    priceCad: '~$220 CAD',
    description:
      'OEM-style 4K dashcam replacing the Land Cruiser 250 rearview mirror cover and tapping directly into the TSS 3.0 sensor housing.',
    query: 'Fitcamx 4K dash cam Toyota Land Cruiser 2024 2025',
    ctaText: 'Check FitcamX on Amazon ↗',
    icon: Camera,
  },
  {
    id: 'spigen-land-cruiser-screen',
    title: 'Spigen 12.3-Inch Tempered Glass Screen Protector',
    category: 'Touchscreen Defense',
    badge: '9H Anti-Glare',
    priceCad: '~$40 CAD',
    description:
      'Matte 9H tempered glass screen shield protecting the Land Cruiser 12.3-inch multimedia touchscreen from off-road dust and glare.',
    query: 'Spigen 12.3 inch screen protector Toyota Land Cruiser',
    ctaText: 'Check Screen Shield on Amazon ↗',
    icon: Layers,
  },
  {
    id: 'land-cruiser-recovery-kit',
    title: 'Heavy-Duty Off-Road Recovery Strap & Shackle Kit',
    category: 'Trail Recovery',
    badge: 'Day-1 Trail Essential',
    priceCad: '~$95 CAD',
    description:
      '30,000-lb kinetic recovery strap, soft shackles, and heavy-duty storage bag sized for the Land Cruiser 250 rear cargo compartment.',
    query: 'off road recovery tow strap shackle kit 4x4',
    ctaText: 'Check Recovery Kit on Amazon ↗',
    icon: Compass,
  },
];

export default async function LandCruiser2026Vs2027GuidePage() {
  const { isUS } = await getRequestMarketMetadata('/guides/toyota-land-cruiser-2026-vs-2027');
  const usConfig = US_GUIDE_CONFIGS['toyota-land-cruiser-2026-vs-2027'];
  const activeFaqs = isUS ? usConfig.faqs : faqData;
  const activeFaqPageSchema = isUS ? buildGuideFaqSchema(activeFaqs) : faqPageSchema;
  const activeArticleSchema = isUS
    ? buildGuideArticleSchema({
        slug: 'toyota-land-cruiser-2026-vs-2027',
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
            Land Cruiser 250 (i-FORCE MAX 4WD)
          </Badge>
          <Badge variant="secondary" className="text-xs">
            2026 vs. 2027 Model Year
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          2026 vs. 2027 Toyota Land Cruiser Canada: Premium Updates &amp; Wait Times
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          Compare the 2026 and 2027 Toyota Land Cruiser 250 in Canada. Full breakdown of the new standard heated and ventilated rear seats on the 2027 Premium Package, added TSS 3.0 safety features, Canadian pricing ($71,670–$86,835 MSRP), and Tahara/Hino Japan allocation timelines.
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
          All 2026 and 2027 Land Cruiser specifications and Canadian pricing figures reflect official Toyota Canada announcements.
        </p>
      </div>

      {/* 1. Year-Over-Year Comparison Table */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Year-Over-Year Comparison Table (2026 vs. 2027 Canadian Specs)
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Side-by-side comparison of i-FORCE MAX specs, Premium Package rear comfort upgrades, and 2027 Canadian pricing.
          </p>
        </div>

        <Card className="border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Specification / Canadian Trim</th>
                  <th className="py-3 px-4">2026 Toyota Land Cruiser</th>
                  <th className="py-3 px-4">2027 Toyota Land Cruiser</th>
                  <th className="py-3 px-4">Year-Over-Year Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Powertrain &amp; 4WD</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">2.4L i-FORCE MAX Hybrid (326 hp / 465 lb-ft), Full-Time 4WD, 2,722 kg tow</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">2.4L i-FORCE MAX Hybrid (326 hp / 465 lb-ft), Full-Time 4WD, 2,722 kg tow</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" /> 100% Mechanical Carryover
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Premium Package Rear Seats &amp; ADAS</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Standard 2nd-row seats</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    Adds standard heated &amp; ventilated 2nd-row seats + Front Cross Traffic Alert, Lane Change Assist &amp; Traffic Jam Assist
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Major Comfort &amp; Safety Upgrade
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors bg-zinc-50/40 dark:bg-zinc-900/20">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">1958 Grade (Round LED Headlights)</td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">~$70,950 MSRP (2026)</td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">$71,670 MSRP ($75,328 all-in)</td>
                  <td className="py-3 px-4 font-mono text-xs font-bold text-zinc-600 dark:text-zinc-400">Carryover Equipment</td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors bg-zinc-50/40 dark:bg-zinc-900/20">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Land Cruiser Grade (SDM Disconnect)</td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">~$79,700 MSRP (2026)</td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">$80,460 MSRP ($84,118 all-in)</td>
                  <td className="py-3 px-4 font-mono text-xs font-bold text-zinc-600 dark:text-zinc-400">Carryover Equipment</td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors bg-zinc-50/40 dark:bg-zinc-900/20">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Land Cruiser + Premium Package</td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">~$85,500 MSRP (2026)</td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">$86,835 MSRP ($90,493 all-in)</td>
                  <td className="py-3 px-4 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Adds Heated/Ventilated Rear Seats
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* 2. Decision Matrix */}
      <section className="space-y-4" aria-label="Pass or Take It Decision Matrix">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          &ldquo;Pass or Take It?&rdquo; Decision Matrix: 1958 vs. Premium Package
        </h2>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6 space-y-4">
          <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
            <strong>Verdict:</strong> If you are buying the <strong>1958</strong> or standard <strong>Land Cruiser</strong> grade, <strong>take an incoming 2026 allocation immediately</strong> to save on annual MSRP adjustments. If you are ordering the <strong>Land Cruiser Premium Package ($86,835 MSRP)</strong> and carry rear passengers year-round, <strong>the 2027 model is worth targeting</strong> for its newly standardized heated and ventilated second-row seats and expanded TSS 3.0 safety suite.
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
                <span>Live Stock &amp; Allocation Tracker</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                Browse Live Land Cruiser 250 Stock Across Canada
              </h3>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Check live Canadian dealer inventory for 1958 and Land Cruiser grades or monitor real-time provincial wait times.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-black text-sm px-6 py-6 shadow-md cursor-pointer">
                <Link href="/inventory?model=Land%20Cruiser" className="gap-2">
                  <span>Explore Live Land Cruiser Inventory ↗</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-zinc-300 dark:border-zinc-700 text-xs font-bold px-4 py-6">
                <Link href="/wait-times/land-cruiser" className="gap-1.5">
                  <span>View Land Cruiser Wait Times →</span>
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
            <span>Confirmed J250 (2024–2027) Fitment</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Day-1 Delivery Gear Shelf: 2026 &amp; 2027 Toyota Land Cruiser
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
        href="/calculator?model=land-cruiser"
        framingVariant={framingVariant}
      />

      <OrderRolloverCalculator
        modelSlug="land-cruiser"
        modelName="Toyota Land Cruiser 250"
        baseMsrpCad={71055}
        baseMsrpUsd={56700}
        my27DeltaCad={1470}
        my27DeltaUsd={1100}
        medianWaitDays={180}
        isUS={isUS}
        initialMarket={isUS ? 'US' : 'CA'}
      />

      <GuideDisclaimer />
    </div>
  );
}
