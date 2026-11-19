import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { GuideDisclaimer } from '@/components/common/GuideDisclaimer';
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
    slug: 'toyota-tundra-2026-vs-2027',
    caTitle: '2026 vs. 2027 Toyota Tundra Canada: Trailhunter, TSS 4.0 & Wait Times | ToyotaWaits',
    caDescription:
      'Compare the 2026 and 2027 Toyota Tundra & i-FORCE MAX Hybrid in Canada. Breakdown of the new SR5 Trailhunter package, standard 14" screen, TSS 4.0, 122L fuel tank, and San Antonio allocation rollovers.',
    usTitle: '2026 vs. 2027 Toyota Tundra United States (2026–2027 Guide): Trailhunter, TSS 4.0 & Wait Times | ToyotaWaits',
    usDescription:
      'Compare the 2026 and 2027 Toyota Tundra & i-FORCE MAX Hybrid in the United States. Breakdown of the new SR5 Trailhunter package, standard 14" screen, TSS 4.0, 32.2-gal fuel tank, and San Antonio allocation rollovers.',
  });
}

const faqData = [
  {
    question: 'What are the major changes for the 2027 Toyota Tundra in Canada?',
    answer:
      'Announced on November 5, 2026, the 2027 Toyota Tundra introduces a refreshed exterior fascia, a new SR5 Trailhunter overlanding package, upgraded TRD Pro FOX QS3 shocks, a standard 14-inch Toyota Multimedia screen, standard Toyota Safety Sense 4.0, a standard 122L fuel tank across all 31 Canadian 4x4 models, and Automated Trailer Detection.',
  },
  {
    question: 'Will my 2026 Toyota Tundra allocation roll over into a 2027 model year?',
    answer:
      'Yes. Because Toyota Motor Manufacturing Texas (TMMTX) in San Antonio transitions assembly plates in fall 2026, unallocated 2026 Tundra orders—especially i-FORCE MAX hybrids, TRD Pro, and long-bed trims—automatically roll into 2027 VINs without losing dealership queue priority.',
  },
  {
    question: 'Should I take an incoming 2026 Tundra allocation or wait for a 2027?',
    answer:
      'If you are buying an SR5 or Limited and want to save ~$3,500+ CAD in 2027 Canadian price increases (or prefer the 2026 CrewMax SR5 entry price), claim an incoming 2026 allocation. Wait for a 2027 if you want the new SR5 Trailhunter overlanding package, standard 14-inch screen on lower trims, TSS 4.0, or the upgraded TRD Pro FOX QS3 suspension.',
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
    '2026 vs. 2027 Toyota Tundra Canada: Trailhunter, TSS 4.0 & Wait Times',
  description:
    'Compare the 2026 and 2027 Toyota Tundra & i-FORCE MAX Hybrid in Canada. Breakdown of the new SR5 Trailhunter package, standard 14" screen, TSS 4.0, 122L fuel tank, and San Antonio allocation rollovers.',
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
  mainEntityOfPage: 'https://www.toyotawaits.ca/guides/toyota-tundra-2026-vs-2027',
};

const DAY_ONE_GEAR_ITEMS = [
  {
    id: 'tuxmat-tundra-crewmax',
    title: 'TuxMat / High-Wall 3D CrewMax Floor Liners',
    category: 'Interior Armor',
    badge: 'Confirmed Fit 2022–2027',
    priceCad: '~$260 CAD',
    description:
      'Laser-scanned high-wall floor liners engineered for the 3rd-gen Toyota Tundra CrewMax and Double Cab. Locks out Canadian winter road salt, mud, and slush.',
    query: 'Toyota Tundra CrewMax all weather floor mats',
    ctaText: 'Check Floor Liners on Amazon ↗',
    icon: Shield,
  },
  {
    id: 'tundra-retractable-tonneau',
    title: 'Retractable Hard Tonneau Cover (5.5ft / 6.5ft Bed)',
    category: 'Bed Protection',
    badge: 'All-Weather Bed Security',
    priceCad: '~$950 CAD',
    description:
      'Heavy-duty aluminum retractable or hard tri-fold bed cover engineered for the composite Tundra bed rails, sealing out snow drift and securing tools.',
    query: 'Toyota Tundra 5.5 ft retractable tonneau cover',
    ctaText: 'Check Tonneau Cover on Amazon ↗',
    icon: Compass,
  },
  {
    id: 'spigen-tundra-14in-screen',
    title: 'Spigen 14-Inch Tempered Glass Screen Protector',
    category: 'Touchscreen Defense',
    badge: 'Standard on All 2027s',
    priceCad: '~$45 CAD',
    description:
      'Optical-grade 9H matte anti-glare tempered glass shield custom-cut for the massive 14-inch Toyota Multimedia display (now standard across all 2027 Tundra grades).',
    query: 'Spigen 14 inch screen protector Toyota Tundra',
    ctaText: 'Check 14" Screen Shield on Amazon ↗',
    icon: Layers,
  },
  {
    id: 'tundra-console-organizer',
    title: 'Center Console Safe / Tray Organizer',
    category: 'Interior Storage',
    badge: 'Day-1 Essential',
    priceCad: '~$30 CAD',
    description:
      'Custom drop-in divider tray engineered for the deep Tundra center console vault, organizing daily essentials while preserving lower storage access.',
    query: 'Toyota Tundra center console organizer tray',
    ctaText: 'Check Console Tray on Amazon ↗',
    icon: Box,
  },
];

export default async function Tundra2026Vs2027GuidePage() {
  const { isUS } = await getRequestMarketMetadata('/guides/toyota-tundra-2026-vs-2027');
  const usConfig = US_GUIDE_CONFIGS['toyota-tundra-2026-vs-2027'];
  const activeFaqs = isUS ? usConfig.faqs : faqData;
  const activeFaqPageSchema = isUS ? buildGuideFaqSchema(activeFaqs) : faqPageSchema;
  const activeArticleSchema = isUS
    ? buildGuideArticleSchema({
        slug: 'toyota-tundra-2026-vs-2027',
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
            Tundra i-FORCE &amp; i-FORCE MAX Hybrid
          </Badge>
          <Badge variant="secondary" className="text-xs">
            2026 vs. 2027 Model Year
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          2026 vs. 2027 Toyota Tundra Canada: Trailhunter, TSS 4.0 &amp; Wait Times
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          Announced on November 5, 2026, the 2027 Toyota Tundra brings a major equipment upgrade across all 31 Canadian 4x4 models—headlined by a new SR5 Trailhunter overlanding package, standard 14-inch display, Toyota Safety Sense 4.0, and a standard 122L fuel tank. Compare 2026 vs. 2027 specs, Canadian pricing deltas, and San Antonio factory rollover rules.
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
          All 2026 and 2027 trim specifications, Canadian all-in pricing figures, and allocation timelines reflect official Toyota Canada announcements and Toyota Motor Manufacturing Texas (TMMTX) San Antonio production schedules.
        </p>
      </div>

      {/* 1. Side-by-Side Year-Over-Year Comparison Table (2026 vs. 2027 Canadian Specs) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Year-Over-Year Comparison Table (2026 vs. 2027 Canadian Specs)
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Side-by-side comparison of exterior styling, Trailhunter &amp; TRD Pro suspension hardware, cabin tech, fuel tank capacity, and Canadian all-in starting prices.
          </p>
        </div>

        <Card className="border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Specification / Canadian Trim</th>
                  <th className="py-3 px-4">2026 Toyota Tundra</th>
                  <th className="py-3 px-4">2027 Toyota Tundra</th>
                  <th className="py-3 px-4">Year-Over-Year Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Exterior &amp; Styling</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    Original 3rd-gen front fascia (2026)
                  </td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    Sharper refreshed exterior fascia &amp; grille (2027)
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold text-amber-600 dark:text-amber-400">
                    2027 Mid-Cycle Exterior Refresh
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">New Overlanding Grade</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    Not available (2026)
                  </td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    All-New SR5 Trailhunter Package (bronze wheels, color-selectable fog lamps, Old Man Emu / overlanding hardware, heritage badging) (2027)
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Major 2027 Overlanding Addition
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">TRD Pro Suspension &amp; Color</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    FOX internal bypass shocks (2026)
                  </td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    Upgraded Tundra-tuned FOX QS3 shocks, red tow hooks &amp; new Honeycomb paint (2027)
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    3-Position Adjustable FOX QS3
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Infotainment Display</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    8.0&quot; standard / 14.0&quot; on upper trims (2026)
                  </td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    Standard 14-inch Toyota Multimedia across all grades (2027)
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Huge Win for SR5 Buyers
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Active Safety Suite</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    Toyota Safety Sense 2.5 (2026)
                  </td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    Standard Toyota Safety Sense 4.0 with Emergency Drive Stop System (2027)
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    2-Generation ADAS Leap
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Fuel Tank &amp; Drivetrain</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    85L / 122L tank split; 4x2 &amp; 4x4 (2026)
                  </td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    Standard 122-litre (32.2-gal) tank &amp; standard 4x4 across all 31 Canadian models (2027)
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Long-Range Tank Standardized
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Towing Tech</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    Trailer Backup Guide (2026)
                  </td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    Automated Trailer Detection, Trailer Blind Spot Monitor, Trailer Garage moved to 14&quot; display, enhanced Trailer Backup Guide (up to 5,080 kg / 11,200 lb max tow) (2027)
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Upgraded Towing Electronics
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Powertrains</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    3.4L i-FORCE Twin-Turbo V6 (389 hp / 479 lb-ft) &amp; i-FORCE MAX Hybrid (437 hp / 583 lb-ft)
                  </td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    3.4L i-FORCE Twin-Turbo V6 (389 hp / 479 lb-ft) &amp; i-FORCE MAX Hybrid (437 hp / 583 lb-ft)
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Identical Carryover
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors bg-zinc-50/40 dark:bg-zinc-900/20">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                    CrewMax 5.5ft SR5 4x4 (All-In Starting Price)
                  </td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">~$65,738 (2026)</td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">$69,573 (2027)</td>
                  <td className="py-3 px-4 font-mono text-xs font-bold text-red-600 dark:text-red-400">
                    +$3,835 CAD (Adds 14&quot; screen, 122L tank &amp; TSS 4.0)
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors bg-zinc-50/40 dark:bg-zinc-900/20">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                    CrewMax 5.5ft Limited 4x4 (All-In Starting Price)
                  </td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">~$75,563 (2026)</td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">$79,733 (2027)</td>
                  <td className="py-3 px-4 font-mono text-xs font-bold text-red-600 dark:text-red-400">
                    +$4,170 CAD
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors bg-zinc-50/40 dark:bg-zinc-900/20">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                    CrewMax Hybrid Limited 4x4 (All-In Starting Price)
                  </td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">~$79,218 (2026)</td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">$83,658 (2027)</td>
                  <td className="py-3 px-4 font-mono text-xs font-bold text-red-600 dark:text-red-400">
                    +$4,440 CAD
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors bg-zinc-50/40 dark:bg-zinc-900/20">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                    CrewMax Hybrid TRD Pro (All-In Starting Price)
                  </td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">~$93,800 (2026)</td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">~$98,211 all-in (2027)</td>
                  <td className="py-3 px-4 font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                    Includes FOX QS3 Shocks &amp; TSS 4.0
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
            &ldquo;Pass or Take It?&rdquo; Decision Matrix: 2026 Savings vs. 2027 Hardware
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Unlike pure carryover models, the 2027 Tundra bundles real hardware upgrades alongside a ~$3,800–$4,400 CAD price increase.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-2 border-emerald-500/40 bg-emerald-500/5 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <Badge className="bg-emerald-600 text-white font-bold text-xs">
                Take the 2026 Allocation If...
              </Badge>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Save ~$3,800–$4,400 CAD
              </span>
            </div>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              You found an in-stock or in-transit <strong>2026 Tundra at or below MSRP</strong>, want to avoid the <strong>~$3,800–$4,400 CAD year-over-year price jump</strong>, or don&apos;t need Trailhunter/TSS 4.0 upgrades.
            </p>
            <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5 pt-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Identical 389-hp i-FORCE and 437-hp i-FORCE MAX twin-turbo V6 powertrains and 10-speed automatic transmission.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>2026 Limited, Platinum, and 1794 grades already include the 14-inch display and 122L fuel tank at a ~$4,170–$4,440 CAD lower sticker price.</span>
              </li>
            </ul>
          </Card>

          <Card className="border-2 border-amber-500/40 bg-amber-500/5 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <Badge className="bg-amber-500 text-zinc-950 font-bold text-xs">
                Hold for the 2027 Model If...
              </Badge>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                Trailhunter, 14&quot; Screen &amp; TSS 4.0
              </span>
            </div>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              You want the factory <strong>SR5 Trailhunter overlanding package</strong>, <strong>standard 14-inch screen + TSS 4.0</strong> on entry/mid grades, <strong>standard 122L long-range tank</strong>, or the <strong>2027 TRD Pro FOX QS3 shocks</strong>.
            </p>
            <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5 pt-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Base SR5 buyers no longer get stuck with the 8-inch screen or 85L small fuel tank—every 2027 Canadian SR5 gets the 14-inch screen and 122L tank standard.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Heavy trailer haulers gain Automated Trailer Detection, Trailer Blind Spot Monitor, and Trailer Garage directly on the 14-inch display.</span>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* 3. San Antonio (TMMTX) Allocation Rollovers & Canadian Wait Times */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            San Antonio (TMMTX) Queue Rollovers &amp; Canadian Lead Times
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            How unallocated 2026 Tundra deposits transition to 2027 VINs at Toyota Motor Manufacturing Texas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-3">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
              <Calendar className="h-4 w-4" />
              <span>TMMTX San Antonio Plant Switchover</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Every Canadian Tundra is built at <strong>Toyota Motor Manufacturing Texas (TMMTX)</strong> in San Antonio. Following the November 5, 2026 announcement, TMMTX transitions assembly lines to 2027 model-year production across all 31 Canadian 4x4 configurations.
            </p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              <strong>Queue Priority Preserved:</strong> Unallocated 2026 orders—especially constrained i-FORCE MAX hybrids, TRD Pro, Capstone, and 6.5-ft / 8.1-ft long-bed builds—automatically roll over into 2027 VINs without losing dealership queue rank.
            </p>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
              <DollarSign className="h-4 w-4" />
              <span>2027 Price Adjustments &amp; Provincial Deposit Rights</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Because 2027 standardizes the 14-inch screen, 122L tank, TSS 4.0, and 4x4 across the Canadian lineup, rolled-over orders face a larger year-over-year price step:
            </p>
            <div className="text-xs space-y-1.5 text-zinc-600 dark:text-zinc-400 pt-1">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>2027 CrewMax SR5 4x4 starts at <strong>$69,573 all-in</strong> (+$3,835 vs. 2026), while Limited i-FORCE MAX Hybrid starts at <strong>$83,658 all-in</strong> (+$4,440).</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Under OMVIC, AMVIC, and VSA rules, if your 2026 deposit rolls to a 2027 VIN with a higher MSRP than your signed buyer&apos;s order, you can either accept the updated 2027 pricing or request a full deposit refund.</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 4. Live Inventory CTA Card */}
      <section aria-label="Live Inventory Allocation Bridge">
        <div className="relative overflow-hidden rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-500/15 via-red-500/10 to-zinc-50 dark:from-red-950/50 dark:via-zinc-900/70 dark:to-zinc-950 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white shadow-xs">
                <Warehouse className="h-3.5 w-3.5" />
                <span>In-Stock &amp; In-Transit Trucks</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                Want to Lock In 2026 Tundra Pricing or Track 2027 Allocations?
              </h3>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Browse live Canadian dealer inventory to grab a remaining 2026 Tundra SR5 or Limited before the ~$3,835–$4,440 CAD price increase, or track real-time provincial delivery wait times for incoming 2027 Trailhunter and TRD Pro builds.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button
                asChild
                className="bg-red-600 hover:bg-red-700 text-white font-black text-sm px-6 py-6 shadow-md cursor-pointer"
              >
                <Link href="/inventory?model=Tundra" className="gap-2">
                  <span>Explore Live Toyota Tundra Inventory ↗</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-zinc-300 dark:border-zinc-700 text-xs font-bold px-4 py-6"
              >
                <Link href="/wait-times/tundra" className="gap-1.5">
                  <span>View Live Tundra Wait Times →</span>
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
              Day-1 Delivery Gear Shelf: 2026 &amp; 2027 Toyota Tundra
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
              Because the 2027 Tundra retains the identical CrewMax/Double Cab floor pan, composite bed dimensions, and 14-inch display housing, these Day-1 essentials fit both 2026 and 2027 trucks.
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
            Key answers for Canadian buyers comparing 2026 vs. 2027 Toyota Tundra &amp; i-FORCE MAX allocations.
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
      <GuideDisclaimer />
    </div>
  );
}
