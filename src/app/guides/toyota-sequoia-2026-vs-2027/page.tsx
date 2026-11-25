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
  AlertCircle,
  HelpCircle,
  Sparkles,
  Calendar,
  DollarSign,
  Warehouse,
  Layers,
  ExternalLink,
  Shield,
  Box,
  Compass,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const { instant } = { instant: false };

export async function generateMetadata(): Promise<Metadata> {
  return buildGuideMetadata({
    slug: 'toyota-sequoia-2026-vs-2027',
    caTitle: '2026 vs. 2027 Toyota Sequoia Canada: Trailhunter, Price Hike & Wait Times | ToyotaWaits',
    caDescription:
      'Compare the 2026 and 2027 Toyota Sequoia in Canada. Breakdown of the new SR5 Trailhunter ($95,552 MSRP), +$5,560 base price jump, FOX QS3 TRD Pro shocks, TSS 4.0, and Trailer ADAS.',
    usTitle: '2026 vs. 2027 Toyota Sequoia United States (2026–2027 Guide): Trailhunter, TSS 4.0 & Wait Times | ToyotaWaits',
    usDescription:
      'Compare the 2026 and 2027 Toyota Sequoia in the United States. Breakdown of the new SR5 Trailhunter, FOX QS3 TRD Pro shocks, TSS 4.0, Trailer ADAS, and dealer allocations.',
  });
}

const faqData = [
  {
    question: 'What are the major changes for the 2027 Toyota Sequoia in Canada?',
    answer:
      'The 2027 Toyota Sequoia introduces a refreshed front fascia, a new SR5 Trailhunter package (Old Man Emu suspension, bronze wheels, skid plates), TRD Pro FOX QS3 shocks and Honeycomb color, a standard 14-inch touchscreen with Drive Recorder, Toyota Safety Sense 4.0, and Trailer ADAS (Automated Trailer Detection and Trailer Blind Spot Monitor).',
  },
  {
    question: 'How much does the 2027 Toyota Sequoia price increase in Canada?',
    answer:
      'In Canada, the starting 2027 Sequoia SR5 TRD Off-Road MSRP jumps +$5,560 to $91,250 ($94,908 all-in). The new SR5 Trailhunter starts at $95,552 MSRP, Limited at $94,000 MSRP, Platinum at $103,800 MSRP, Capstone at $108,700 MSRP, and TRD Pro at $109,851 MSRP.',
  },
  {
    question: 'Should I take an incoming 2026 Sequoia allocation or wait for a 2027?',
    answer:
      'Take an incoming 2026 allocation immediately to save ~$5,560+ CAD unless you are holding out specifically for the new SR5 Trailhunter grade, Toyota Safety Sense 4.0, or Trailer ADAS towing technology.',
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
    '2026 vs. 2027 Toyota Sequoia Canada: Trailhunter, Price Hike & Wait Times',
  description:
    'Compare the 2026 and 2027 Toyota Sequoia in Canada. Breakdown of the new SR5 Trailhunter ($95,552 MSRP), +$5,560 base price jump, FOX QS3 TRD Pro shocks, TSS 4.0, and Trailer ADAS.',
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
  mainEntityOfPage: 'https://www.toyotawaits.ca/guides/toyota-sequoia-2026-vs-2027',
};

const DAY_ONE_GEAR_ITEMS = [
  {
    id: 'tuxmat-sequoia-3row',
    title: 'TuxMat / High-Wall 3-Row Floor Liners',
    category: 'Interior Armor',
    badge: 'Confirmed Fit 2023–2027',
    priceCad: '~$320 CAD',
    description:
      'Full 3-row high-wall all-weather floor liners engineered for the XK80 Toyota Sequoia cabin, shielding carpet and sliding 3rd-row tracks from winter salt.',
    query: 'Toyota Sequoia 3 row all weather floor mats',
    ctaText: 'Check 3-Row Liners on Amazon ↗',
    icon: Shield,
  },
  {
    id: 'curt-class4-hitch-ball-mount',
    title: 'CURT Class 4 Heavy-Duty Hitch Ball Mount (2-Inch)',
    category: 'Towing Hardware',
    badge: '9,000+ lb Tow Rated',
    priceCad: '~$75 CAD',
    description:
      'Forged solid-steel 2-inch receiver ball mount rated for the Sequoia i-FORCE MAX 9,000+ lb towing capacity and Automated Trailer Detection setup.',
    query: 'CURT Class 4 ball mount 2 inch shank heavy duty',
    ctaText: 'Check Hitch Mount on Amazon ↗',
    icon: Compass,
  },
  {
    id: 'spigen-sequoia-14in-screen',
    title: 'Spigen 14-Inch Tempered Glass Screen Protector',
    category: 'Touchscreen Defense',
    badge: 'Standard on All 2027s',
    priceCad: '~$45 CAD',
    description:
      '9H matte anti-glare tempered glass protector custom-cut for the standard 14-inch Toyota Multimedia display across all 2027 Sequoia trims.',
    query: 'Spigen 14 inch screen protector Toyota Sequoia Tundra',
    ctaText: 'Check 14" Screen Shield on Amazon ↗',
    icon: Layers,
  },
  {
    id: 'sequoia-console-organizer',
    title: 'Center Console Dual-Tier Organizer Tray',
    category: 'Interior Storage',
    badge: 'Day-1 Essential',
    priceCad: '~$30 CAD',
    description:
      'Drop-in ABS organizer tray dividing the massive Sequoia center armrest vault into upper and lower compartments.',
    query: 'Toyota Sequoia 2023-2026 center console organizer tray',
    ctaText: 'Check Console Tray on Amazon ↗',
    icon: Box,
  },
];

export default async function Sequoia2026Vs2027GuidePage() {
  const { isUS } = await getRequestMarketMetadata('/guides/toyota-sequoia-2026-vs-2027');
  const usConfig = US_GUIDE_CONFIGS['toyota-sequoia-2026-vs-2027'];
  const activeFaqs = isUS ? usConfig.faqs : faqData;
  const activeFaqPageSchema = isUS ? buildGuideFaqSchema(activeFaqs) : faqPageSchema;
  const activeArticleSchema = isUS
    ? buildGuideArticleSchema({
        slug: 'toyota-sequoia-2026-vs-2027',
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
            Sequoia i-FORCE MAX Hybrid 4WD
          </Badge>
          <Badge variant="secondary" className="text-xs">
            2026 vs. 2027 Model Year
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          2026 vs. 2027 Toyota Sequoia Canada: Trailhunter, Price Hike &amp; Wait Times
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          Compare the 2026 and 2027 Toyota Sequoia in Canada. Full breakdown of the new SR5 Trailhunter overlanding package ($95,552 MSRP), the +$5,560 CAD base price increase, upgraded TRD Pro FOX QS3 shocks, standard 14-inch screen, TSS 4.0, and Trailer ADAS.
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
          All 2026 and 2027 Sequoia specifications, Canadian MSRP figures, and Federal Luxury Tax thresholds reflect verified Toyota Canada announcements and San Antonio (TMMTX) production schedules.
        </p>
      </div>

      {/* 1. Year-Over-Year Comparison Table */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Year-Over-Year Comparison Table (2026 vs. 2027 Canadian Specs)
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Side-by-side comparison of exterior styling, Trailhunter &amp; TRD Pro suspension, cabin tech, and Canadian MSRP across all trims.
          </p>
        </div>

        <Card className="border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Specification / Canadian Trim</th>
                  <th className="py-3 px-4">2026 Toyota Sequoia</th>
                  <th className="py-3 px-4">2027 Toyota Sequoia</th>
                  <th className="py-3 px-4">Year-Over-Year Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Exterior &amp; Trailhunter Grade</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Original XK80 front fascia; no Trailhunter</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    Refreshed front fascia + New SR5 Trailhunter (Old Man Emu suspension, bronze wheels, skid plates)
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    All-New Overlanding Package
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">TRD Pro Suspension &amp; Paint</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">FOX internal bypass shocks</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    Upgraded FOX QS3 3-position shocks + Exclusive Honeycomb exterior color
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Adjustable Damping Upgrade
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Infotainment &amp; Safety Suite</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">8&quot; / 14&quot; Multimedia + TSS 2.5</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    Standard 14&quot; touchscreen w/ Drive Recorder, TSS 4.0 &amp; Trailer ADAS (Automated Trailer Detection, Trailer BSM)
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Major ADAS &amp; Towing Tech Leap
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Powertrain</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">3.4L i-FORCE MAX Hybrid 4WD (437 hp / 583 lb-ft)</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">3.4L i-FORCE MAX Hybrid 4WD (437 hp / 583 lb-ft)</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" /> 100% Mechanical Carryover
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors bg-zinc-50/40 dark:bg-zinc-900/20">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">SR5 TRD Off-Road (Base Canadian Grade)</td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">$85,690 MSRP (2026)</td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">$91,250 MSRP ($94,908 all-in)</td>
                  <td className="py-3 px-4 font-mono text-xs font-bold text-red-600 dark:text-red-400">
                    +$5,560 CAD Base Price Jump
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors bg-zinc-50/40 dark:bg-zinc-900/20">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">SR5 Trailhunter / Limited</td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">Limited: ~$89,500 MSRP (2026)</td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">Limited: $94,000 | Trailhunter: $95,552 MSRP</td>
                  <td className="py-3 px-4 font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                    Remains Below $100k Luxury Tax
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors bg-zinc-50/40 dark:bg-zinc-900/20">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Platinum / Capstone / TRD Pro</td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">~$98,000 – $104,500 MSRP (2026)</td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">Platinum $103,800 | Capstone $108,700 | TRD Pro $109,851</td>
                  <td className="py-3 px-4 font-mono text-xs font-bold text-red-600 dark:text-red-400">
                    Triggers Federal Luxury Tax (&gt;$100k)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* 2. "Pass or Take It?" Decision Matrix */}
      <section className="space-y-4" aria-label="Pass or Take It Decision Matrix">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          &ldquo;Pass or Take It?&rdquo; Decision Matrix: Beat the +$5,560 Price Jump
        </h2>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6 space-y-4">
          <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
            <strong>Verdict: Take an incoming 2026 Sequoia allocation immediately to save ~$5,560+ CAD</strong> (and avoid crossing the $100,000 Federal Luxury Tax threshold on Platinum builds), unless you are holding out specifically for the new <strong>SR5 Trailhunter overlanding grade ($95,552 MSRP)</strong>, <strong>Toyota Safety Sense 4.0</strong>, or <strong>Trailer ADAS</strong> towing hardware.
          </p>
        </div>
      </section>

      {/* 3. Live Inventory CTA Card */}
      <section aria-label="Live Inventory Allocation Bridge">
        <div className="relative overflow-hidden rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-500/15 via-red-500/10 to-zinc-50 dark:from-red-950/50 dark:via-zinc-900/70 dark:to-zinc-950 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white shadow-xs">
                <Warehouse className="h-3.5 w-3.5" />
                <span>Live Stock &amp; Waitlist Tracker</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                Lock In 2026 Sequoia Pricing or Track 2027 Trailhunter Allocations
              </h3>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Check live Canadian dealer stock to claim a remaining 2026 Sequoia before the +$5,560 CAD MSRP hike, or monitor real-time provincial delivery timelines.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-black text-sm px-6 py-6 shadow-md cursor-pointer">
                <Link href="/inventory?model=Sequoia" className="gap-2">
                  <span>Explore Live Toyota Sequoia Inventory ↗</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-zinc-300 dark:border-zinc-700 text-xs font-bold px-4 py-6">
                <Link href="/wait-times/sequoia" className="gap-1.5">
                  <span>View Live Sequoia Wait Times →</span>
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
            <span>Confirmed 2023–2027 Fitment</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Day-1 Delivery Gear Shelf: 2026 &amp; 2027 Toyota Sequoia
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
        href="/calculator?model=sequoia"
        framingVariant={framingVariant}
      />

      <OrderRolloverCalculator
        modelSlug="sequoia"
        modelName="Toyota Sequoia"
        baseMsrpCad={84940}
        baseMsrpUsd={62425}
        my27DeltaCad={5560}
        my27DeltaUsd={4100}
        medianWaitDays={210}
        isUS={isUS}
        initialMarket={isUS ? 'US' : 'CA'}
      />

      <GuideDisclaimer />
    </div>
  );
}
