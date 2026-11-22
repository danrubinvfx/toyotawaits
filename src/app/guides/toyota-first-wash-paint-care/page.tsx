import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { GuideDisclaimer } from '@/components/common/GuideDisclaimer';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { GearCard, type GearCardItem } from '@/components/gear/GearCard';
import { GEAR_MARKET_CATALOG } from '@/data/gear/catalog';
import { getRequestMarketMetadata } from '@/lib/seo/host-metadata';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Droplets,
  HelpCircle,
  ArrowRight,
  FileText,
  Layers,
  ShieldAlert,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const { instant } = { instant: false };

const GUIDE_PATH = '/guides/toyota-first-wash-paint-care';
const GUIDE_TITLE =
  'New Toyota First-Wash & Paint Care Guide: Why to Decline the Dealer Car Wash | ToyotaWaits';
const GUIDE_DESCRIPTION =
  'Protect soft Toyota clear coats on delivery day. Why to tell your dealer "Do Not Wash," how to wash without swirl marks (ONR & two-bucket), and $30 DIY ceramic sealants vs. $899 dealer packages.';

export async function generateMetadata(): Promise<Metadata> {
  const { isUS, baseUrl, alternatesLanguages } = await getRequestMarketMetadata(GUIDE_PATH);
  const canonical = `${baseUrl}${GUIDE_PATH}`;

  return {
    title: GUIDE_TITLE,
    description: GUIDE_DESCRIPTION,
    keywords: [
      'new toyota first wash',
      'tell dealer do not wash new car',
      'toyota clear coat swirl marks',
      'optimum no rinse toyota',
      'dealer paint protection package worth it',
      'toyota ceramic spray sealant diy',
      'toyota delivery day paint care',
    ],
    alternates: {
      canonical,
      languages: alternatesLanguages,
    },
    openGraph: {
      title: GUIDE_TITLE,
      description: GUIDE_DESCRIPTION,
      url: canonical,
      siteName: isUS ? 'ToyotaWaits' : 'ToyotaWaits.ca',
      locale: isUS ? 'en_US' : 'en_CA',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: GUIDE_TITLE,
      description: GUIDE_DESCRIPTION,
    },
  };
}

const faqData = [
  {
    question: 'Why should I tell my Toyota dealer "Do Not Wash" before delivery?',
    answer:
      'Dealership wash bays rely on high-speed spinning nylon brushes, recycled grit-laden water, and dirty lot squeegees that inflict spiderweb swirl marks on soft factory Toyota clear coat before you even take the keys. Asking your advisor in writing to leave exterior transport plastic on or perform only a touchless rinse preserves factory-fresh paint.',
  },
  {
    question: 'Is the $899+ dealership paint protection or ceramic package worth it?',
    answer:
      'No. Dealership F&I "ceramic" or "environmental paint protection" packages are typically a quick 15-minute spray sealant applied by a lot attendant, marked up 800% to 1,500% primarily to sell a third-party warranty brochure. A $30 bottle of Griot\'s Garage Ceramic 3-in-1 Spray Wax delivers comparable SiO2 hydrophobic protection in 20 minutes at home. Save your budget for physical Paint Protection Film (PPF) at a dedicated local shop.',
  },
  {
    question: 'How do I wash my new Toyota if I live in a condo or apartment with no hose?',
    answer:
      'Use a rinseless polymer wash like Optimum No Rinse (ONR) Wash & Shine. Two gallons of warm water and a capful of ONR in a single bucket encapsulate road dirt and winter salt, allowing you to safely wipe and dry each panel in an underground parking stall or garage with edgeless 500+ GSM microfiber towels.',
  },
  {
    question: 'When is real Paint Protection Film (PPF) actually worth paying for?',
    answer:
      'If you drive Canadian or northern US highways with winter gravel, sand, and salt, physical 8-mil urethane PPF on the front bumper, leading hood edge, headlights, and mirror caps prevents rock chips down to bare primer—something no liquid wax or ceramic coating can stop. Always book PPF with a reputable local detailing studio rather than the dealership F&I desk.',
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

function buildArticleSchema(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: GUIDE_TITLE,
    description: GUIDE_DESCRIPTION,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}${GUIDE_PATH}`,
    },
    author: {
      '@type': 'Organization',
      name: 'ToyotaWaits',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ToyotaWaits',
    },
  };
}

const PAINT_CARE_SLUGS = [
  'optimum-no-rinse-wash',
  'griots-ceramic-3-in-1-wax',
  'microfiber-edgeless-towels',
  'chemical-guys-two-bucket-kit',
] as const;

function buildPaintCareGearItems(): GearCardItem[] {
  return PAINT_CARE_SLUGS.map((slug) => {
    const cfg = GEAR_MARKET_CATALOG[slug];
    return {
      id: cfg.id || slug,
      slug,
      title: cfg.title,
      brand: cfg.brand,
      category: cfg.category || 'Paint Care & Wash',
      description: cfg.description,
      whyBuy: cfg.whyBuy,
      badge: cfg.badge,
      searchQuery: cfg.searchQuery,
      searchKeywordsCA: cfg.searchKeywordsCA,
      searchKeywordsUS: cfg.searchKeywordsUS,
      destinationUrl: cfg.destinationUrl,
      fallbackIcon: cfg.fallbackIcon,
      buttonLabel: 'Search on Amazon ↗',
    };
  });
}

export default async function ToyotaFirstWashPaintCareGuidePage() {
  const { isUS, baseUrl } = await getRequestMarketMetadata(GUIDE_PATH);
  const articleSchema = buildArticleSchema(baseUrl);
  const paintCareItems = buildPaintCareGearItems();

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* Structured JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Header & Breadcrumbs */}
      <div className="space-y-4">
        <BackButton label="← Back to Guides Almanac" fallbackHref="/guides" className="mb-2" />

        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-amber-500 text-zinc-950 font-bold gap-1 text-xs hover:bg-amber-400">
            <Sparkles className="h-3.5 w-3.5" />
            Delivery Day Paint Defense
          </Badge>
          <Badge variant="outline" className="border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs font-semibold">
            {isUS ? 'US & Canada Edition' : 'Canada & US Edition'}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Zero-Swirl Playbook
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          New Toyota First-Wash &amp; Paint Care Guide: Why to Decline the Dealer Car Wash
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          Toyota and Lexus factory clear coats—especially dark colors like Blueprint, Midnight Black
          Metallic, and Ruby Flare Pearl—are notoriously soft. Learn how to stop dealership swirl
          damage before pickup, skip $899 F&amp;I paint sealants, and protect your finish at home
          for under $35.
        </p>
      </div>

      {/* FTC & Ad Standards Canada Affiliate Disclosure */}
      <div
        role="region"
        aria-label="Affiliate and Editorial Transparency Notice"
        data-testid="affiliate-disclosure"
        className="rounded-2xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/5 p-4 sm:p-5 text-xs text-zinc-700 dark:text-zinc-300 space-y-2 shadow-xs"
      >
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>FTC &amp; Ad Standards Canada Affiliate Disclosure</span>
        </div>
        <p className="leading-relaxed text-[11px] sm:text-xs">
          <strong>Transparency Notice:</strong> {isUS ? 'ToyotaWaits.com' : 'ToyotaWaits.ca'} participates
          in affiliate partner programs, including the Amazon Associates Program (US &amp; Canada).
          If you purchase detailing gear through links on this page, we may earn a small commission
          at <strong>no extra cost to you</strong>. Our paint care recommendations are independent
          and focused on helping new Toyota owners avoid dealership F&amp;I markups and swirl
          marks.
        </p>
      </div>

      {/* Section 1: Rule #1 on Delivery Day */}
      <section className="space-y-4" aria-labelledby="do-not-wash-heading">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/25 shrink-0">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <h2
            id="do-not-wash-heading"
            className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            1. Rule #1 on Delivery Day: Tell Your Advisor &ldquo;Do Not Wash&rdquo; in Writing
          </h2>
        </div>

        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
          <CardContent className="p-5 sm:p-6 space-y-4 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            <p>
              As soon as your Toyota hits <strong>Status G (Ground Delivery)</strong> and your
              sales advisor calls to schedule pickup, send a quick text or email:{' '}
              <strong>
                &ldquo;Please instruct PDI and lot prep: DO NOT run my vehicle through the
                dealership car wash or use lot brushes/squeegees.&rdquo;
              </strong>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 space-y-2">
                <h3 className="font-bold text-red-700 dark:text-red-400 flex items-center gap-2 text-sm">
                  <XCircle className="h-4 w-4 shrink-0" />
                  Why Dealer Washes Ruin New Clear Coat
                </h3>
                <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300 list-disc pl-4">
                  <li>
                    <strong>Rotary Tunnel Brushes:</strong> Automated dealership brush tunnels hold
                    sand, salt, and brake dust from hundreds of service-lane vehicles.
                  </li>
                  <li>
                    <strong>Dirty Lot Squeegees &amp; Towels:</strong> Used across dusty dealer
                    inventory lots, dragging micro-grit across fresh Toyota clear coat.
                  </li>
                  <li>
                    <strong>Hidden Under Dealership Lights:</strong> Swirl marks often stay invisible
                    inside a shaded delivery bay and only show up in direct sunlight.
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
                <h3 className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  What to Request Instead
                </h3>
                <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300 list-disc pl-4">
                  <li>
                    <strong>Mechanical PDI Only:</strong> Have technicians complete safety checks,
                    shipping spacer removal, and tire pressures—skip the cosmetic wash.
                  </li>
                  <li>
                    <strong>Keep Protective Film or Touchless Rinse:</strong> Ask them to peel
                    white transit wrap carefully or leave exterior dust for your first home wash.
                  </li>
                  <li>
                    <strong>Inspect Paint Outdoors:</strong> Walk the vehicle in bright daylight
                    before signing—see our{' '}
                    <Link
                      href="/delivery-prep"
                      className="text-emerald-600 dark:text-emerald-400 underline font-semibold"
                    >
                      Delivery Prep Inspection Checklist
                    </Link>
                    .
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 2: Dealer $899 Paint Sealant vs. $30 DIY SiO2 Ceramic Spray */}
      <section className="space-y-4" aria-labelledby="sealant-comparison-heading">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 shrink-0">
            <Layers className="h-4 w-4" />
          </div>
          <h2
            id="sealant-comparison-heading"
            className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            2. Dealer $899 Paint Sealant vs. $30 DIY SiO2 Ceramic Spray
          </h2>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          In the finance office, you will almost certainly be pitched an{' '}
          <strong>&ldquo;Environmental Paint &amp; Interior Protection&rdquo;</strong> or{' '}
          <strong>&ldquo;Dealer Ceramic Coating&rdquo;</strong> package for $899 to $1,499+. In
          reality, these packages are pure F&amp;I profit margin—often a $15 spray sealant wiped on
          in 15 minutes with a warranty contract full of exclusions.
        </p>

        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 text-zinc-900 dark:text-zinc-100">
              <tr>
                <th className="p-3.5 sm:p-4 font-bold">Factor</th>
                <th className="p-3.5 sm:p-4 font-bold text-red-600 dark:text-red-400">
                  Dealer F&amp;I Paint Sealant ($899+)
                </th>
                <th className="p-3.5 sm:p-4 font-bold text-emerald-600 dark:text-emerald-400">
                  DIY SiO2 Ceramic Spray (~$30)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
              <tr>
                <td className="p-3.5 sm:p-4 font-semibold">Upfront Cost</td>
                <td className="p-3.5 sm:p-4">$899 – $1,499 (often rolled into 7% financing)</td>
                <td className="p-3.5 sm:p-4">~$25 – $35 for a 22 oz bottle (6+ applications)</td>
              </tr>
              <tr>
                <td className="p-3.5 sm:p-4 font-semibold">Chemistry &amp; Prep</td>
                <td className="p-3.5 sm:p-4">Quick spray-on polymer applied by lot staff over unprepped paint</td>
                <td className="p-3.5 sm:p-4">True SiO2 ceramic polymer (Griot&apos;s 3-in-1) applied to clean paint</td>
              </tr>
              <tr>
                <td className="p-3.5 sm:p-4 font-semibold">Real-World Durability</td>
                <td className="p-3.5 sm:p-4">3–6 months before water beading fades</td>
                <td className="p-3.5 sm:p-4">6–12 months per coat; 15-minute top-up twice a year</td>
              </tr>
              <tr>
                <td className="p-3.5 sm:p-4 font-semibold">Rock Chip Protection</td>
                <td className="p-3.5 sm:p-4">None (liquid sealants cannot stop highway gravel)</td>
                <td className="p-3.5 sm:p-4">None—spend your savings on real local-shop PPF instead</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4 sm:p-5 flex items-start gap-3 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
            <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-zinc-900 dark:text-zinc-100">
                When Real PPF Is Worth Paying For:
              </strong>{' '}
              Skip dealer spray sealants, and instead put that budget toward{' '}
              <strong>8-mil urethane Paint Protection Film (PPF)</strong> at a dedicated local
              detailing shop for your front bumper, leading hood edge, headlights, and mirror caps.
              Unlike liquid coatings, physical PPF absorbs highway gravel impacts so your Toyota
              front fascia stays chip-free.
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 3: The 2-Method Safe Wash Playbook */}
      <section className="space-y-4" aria-labelledby="wash-playbook-heading">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25 shrink-0">
            <Droplets className="h-4 w-4" />
          </div>
          <h2
            id="wash-playbook-heading"
            className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            3. The 2-Method Safe Wash Playbook
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
            <CardHeader className="pb-3">
              <Badge variant="outline" className="w-fit text-xs border-cyan-500/30 text-cyan-600 dark:text-cyan-400">
                Method A: Driveway Owners
              </Badge>
              <CardTitle className="text-lg font-bold">Two-Bucket + Grit Guard Wash</CardTitle>
              <CardDescription>
                Best when you have a garden hose or pressure washer at home.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
              <ol className="space-y-2 list-decimal pl-4">
                <li>
                  <strong>Pre-rinse thoroughly</strong> to knock loose sand and road grit off rocker
                  panels before touching the paint.
                </li>
                <li>
                  <strong>Two buckets with Grit Guards:</strong> Bucket 1 holds pH-neutral car
                  shampoo; Bucket 2 holds clean rinse water to trap grit at the bottom.
                </li>
                <li>
                  <strong>Wash top-to-bottom</strong> with a plush chenille microfiber mitt, rinsing
                  the mitt against the Grit Guard after every single panel.
                </li>
                <li>
                  <strong>Apply SiO2 ceramic spray while drying</strong> with edgeless 500+ GSM
                  microfiber towels to add lubrication and 6+ months of protection.
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
            <CardHeader className="pb-3">
              <Badge variant="outline" className="w-fit text-xs border-amber-500/30 text-amber-600 dark:text-amber-400">
                Method B: Condos &amp; Winter Garages
              </Badge>
              <CardTitle className="text-lg font-bold">Rinseless ONR Polymer Wash</CardTitle>
              <CardDescription>
                Zero hose needed—ideal for apartment parking stalls and sub-zero winters.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
              <ol className="space-y-2 list-decimal pl-4">
                <li>
                  <strong>Mix 1 oz of Optimum No Rinse (ONR)</strong> into 2 gallons of warm water
                  in a single bucket.
                </li>
                <li>
                  <strong>Pre-mist heavy salt or mud</strong> using a pump sprayer filled with ONR
                  solution (or do a quick coin-op touchless water-only rinse first).
                </li>
                <li>
                  <strong>Wipe one panel at a time</strong> using a soaked edgeless microfiber towel
                  folded into quarters, flipping to a clean face after each pass.
                </li>
                <li>
                  <strong>Dry immediately</strong> with a clean plush drying towel, misting Griot&apos;s
                  Ceramic 3-in-1 Wax as your drying aid.
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 4: Day-One Paint & Wash Kit (4-Card GearCard Grid) */}
      <section className="space-y-5" aria-labelledby="day-one-paint-kit-heading">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>4-Item Starter Kit</span>
          </div>
          <h2
            id="day-one-paint-kit-heading"
            className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            4. Day-One Paint &amp; Wash Kit
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 max-w-2xl">
            Everything you need to safely wash and ceramic-seal your new Toyota on day one—automatically
            routed to {isUS ? 'Amazon.com (US)' : 'Amazon.ca (Canada)'}.
          </p>
        </div>

        <div
          data-testid="paint-care-gear-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {paintCareItems.map((item) => (
            <GearCard
              key={item.id}
              item={item}
              placement="first_wash_paint_care_guide"
              showCheckbox={false}
              buttonLabel="Search on Amazon ↗"
              className="w-full max-w-none"
            />
          ))}
        </div>
      </section>

      {/* Cross-Links to Delivery Prep & ECP Warranty Guide */}
      <section
        aria-label="Related Delivery Day Defense Guides"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <Card className="border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 hover:border-emerald-500/50 transition-colors">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Pre-Delivery Inspection</span>
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Delivery-Day PDI &amp; Fee Refusal Checklist
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Track Status A/F/G, inspect paint in bright daylight, verify transport spacers were
                removed, and refuse unrequested dealer add-ons.
              </p>
            </div>
            <Link
              href="/delivery-prep"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <span>Open Delivery Prep Checklist</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 hover:border-amber-500/50 transition-colors">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                <FileText className="h-3.5 w-3.5" />
                <span>Finance Office Defense</span>
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Toyota ECP Extended Warranty Guide
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Don&apos;t overpay at the F&amp;I desk. Compare factory hybrid coverage vs. ECP
                Platinum wholesale target pricing and the 31-day grace period.
              </p>
            </div>
            <Link
              href="/guides/toyota-ecp-warranty-guide"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
            >
              <span>Read Toyota ECP Warranty Guide</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Frequently Asked Questions */}
      <section className="space-y-4" aria-labelledby="paint-care-faq-heading">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-amber-500" />
          <h2
            id="paint-care-faq-heading"
            className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqData.map((faq) => (
            <Card
              key={faq.question}
              className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60"
            >
              <CardContent className="p-4 sm:p-5 space-y-1.5">
                <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {faq.question}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {faq.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <GuideDisclaimer />
    </div>
  );
}
