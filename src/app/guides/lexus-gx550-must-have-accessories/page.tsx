import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { Badge } from '@/components/ui/badge';
import { buildAmazonAffiliateUrl } from '@/lib/gear/affiliate';
import {
  Car,
  ShieldCheck,
  Package,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  ExternalLink,
  Camera,
  Layers,
  Sparkles,
  Lock,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const { instant } = { instant: false };

export const metadata: Metadata = {
  title: 'Lexus GX 550 Day-One Delivery Checklist & Essential Accessories (2026) | ToyotaWaits',
  description:
    'Essential delivery-day accessories and pre-delivery inspection checklist for 2024–2026 Lexus GX 550 owners. TuxMat floor liners, FitcamX 4K dashcam, Spigen 14" screen protector, and PPF tips.',
  keywords: [
    'Lexus GX 550 accessories',
    'GX 550 floor mats',
    'GX 550 dashcam installation',
    'Lexus GX 550 delivery checklist',
    'Lexus GX 550 TuxMat',
    'GX 550 screen protector 14 inch',
    'GX 550 Canadian delivery',
  ],
  alternates: {
    canonical: 'https://www.toyotawaits.ca/guides/lexus-gx550-must-have-accessories',
  },
  openGraph: {
    title: 'Lexus GX 550 Day-One Delivery Checklist & Essential Accessories (2026)',
    description:
      'Community-vetted delivery-day gear and essential protection for Canadian 2024–2026 Lexus GX 550 buyers.',
    url: 'https://www.toyotawaits.ca/guides/lexus-gx550-must-have-accessories',
    siteName: 'ToyotaWaits.ca',
    locale: 'en_CA',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lexus GX 550 Day-One Delivery Checklist & Essential Accessories (2026)',
    description:
      'Community-vetted delivery-day gear and essential protection for Canadian 2024–2026 Lexus GX 550 buyers.',
  },
};

const gxFaqData = [
  {
    question: 'When should I purchase delivery-day accessories for my Lexus GX 550?',
    answer:
      'With Canadian wait times for the Lexus GX 550 currently averaging 9 to 14 months, owners should order laser-fit floor protection and screen tempered glass 3 to 4 weeks before their build reaches Canadian port or railhead. Installing floor protection before leaving the dealership lot prevents permanent winter road salt crusting on factory carpet.',
  },
  {
    question: 'Does installing the FitcamX dashcam void my Lexus factory warranty?',
    answer:
      'No. The FitcamX dashcam uses an OEM-spec plug-and-play Y-harness that taps directly into the auto-dimming rearview mirror and Lexus Safety System+ (LSS+ 3.0) power port. Because it requires zero wire splicing, zero fuse-box tapping, and can be completely removed without trace marks, your Lexus factory warranty remains fully intact under Canadian consumer protection laws.',
  },
  {
    question: 'Why should I install a tempered glass protector on the Lexus 14-inch touchscreen?',
    answer:
      'The 14-inch Lexus Interface touchscreen is prone to visible fingerprint grease, dust micro-scratches, and high-glare reflections under direct sunlight. A 9H matte tempered glass screen protector (like Spigen GlasTR) eliminates harsh cabin glare while preserving responsive haptic touch sensitivity.',
  },
  {
    question: 'What Paint Protection Film (PPF) areas are essential for the Lexus GX 550?',
    answer:
      'The GX 550 features an upright, boxy front fascia, flat hood, and flared fender arches that take severe stone impacts on Canadian highways. At a minimum, apply high-quality 8-mil self-healing PPF across the full front hood, bumper, headlights, side mirror caps, and rear rocker panels ahead of the rear wheels.',
  },
];

const structuredFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: gxFaqData.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

const structuredArticleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Lexus GX 550 Day-One Delivery Checklist & Essential Accessories (2026)',
  description:
    'Essential delivery-day accessories and pre-delivery inspection checklist for 2024–2026 Lexus GX 550 owners.',
  author: {
    '@type': 'Organization',
    name: 'ToyotaWaits Editorial Team',
    url: 'https://www.toyotawaits.ca',
  },
  publisher: {
    '@type': 'Organization',
    name: 'ToyotaWaits.ca',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.toyotawaits.ca/assets/icons/favicon-512x512.png',
    },
  },
  mainEntityOfPage: 'https://www.toyotawaits.ca/guides/lexus-gx550-must-have-accessories',
};

export default function LexusGx550MustHaveAccessoriesPage() {
  const tuxMatUrl = buildAmazonAffiliateUrl('Lexus GX 550 all weather floor mats TuxMat');
  const fitcamxUrl = buildAmazonAffiliateUrl('Fitcamx dash cam Lexus RX NX TX GX OEM 4K');
  const spigenUrl = buildAmazonAffiliateUrl('Spigen 14 inch screen protector Lexus TX GX NX');
  const faradayUrl = buildAmazonAffiliateUrl('Faraday bag key fob signal protector pouch');

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredFaqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredArticleSchema) }}
      />

      {/* Header & Navigation */}
      <div className="space-y-4">
        <BackButton label="← Back to Guides Almanac" fallbackHref="/guides" className="mb-2" />

        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-amber-500 text-zinc-950 font-bold gap-1 text-xs hover:bg-amber-400">
            <Car className="h-3.5 w-3.5" />
            Lexus Luxury Gear
          </Badge>
          <Badge variant="outline" className="border-amber-500/30 text-amber-500 dark:text-amber-300 text-xs font-semibold">
            2024–2026 GX 550
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Day-One Delivery Checklist
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          Lexus GX 550 Day-One Delivery Checklist &amp; Essential Accessories (2026)
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          Taking delivery of a new twin-turbo 2024–2026 Lexus GX 550 represents the payoff of a 9- to 14-month Canadian allocation wait. This guide outlines the essential delivery-day inspection checklist, factory paint preservation measures, and community-proven accessories to install before your first road trip.
        </p>
      </div>

      {/* FTC & Canadian Ad Standards Affiliate Disclosure Banner */}
      <div
        role="region"
        aria-label="Affiliate and Editorial Transparency Notice"
        className="rounded-2xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/5 p-4 sm:p-5 text-xs text-zinc-700 dark:text-zinc-300 space-y-2 shadow-xs"
      >
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-300 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>Affiliate &amp; Community Transparency Disclosure</span>
        </div>
        <p className="leading-relaxed text-[11px] sm:text-xs">
          <strong>FTC &amp; Ad Standards Canada Notice:</strong> toyotawaits.ca participates in verified affiliate partner programs, including the Amazon Associates Program. If you purchase through curated gear links on this guide, we may earn an affiliate commission at zero additional cost to you.
        </p>
      </div>

      {/* Cross-Link Callout Card to GX 550 Live Wait Times */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/wait-times/lexus-gx550"
          className="group p-4 rounded-xl border border-amber-500/30 bg-amber-50/40 dark:bg-amber-950/20 hover:border-amber-500/60 transition-all flex items-center justify-between shadow-2xs"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Live Allocation Tracker
            </span>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Lexus GX 550 Canadian Wait Times &rarr;
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Check median delivery timelines, lot arrivals, and regional queues across BC, Ontario &amp; Alberta.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-amber-500 group-hover:translate-x-1 shrink-0 ml-3 transition-transform" />
        </Link>

        <Link
          href="/wait-times/land-cruiser"
          className="group p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all flex items-center justify-between shadow-2xs"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Sister Platform
            </span>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
              Toyota Land Cruiser 250 Wait Times &rarr;
            </h2>
            <p className="text-xs text-zinc-500">
              Compare lead times and availability on the shared GA-F body-on-frame platform.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-zinc-400 group-hover:translate-x-1 shrink-0 ml-3 transition-transform" />
        </Link>
      </div>

      {/* Part 1: Delivery Day Pre-Delivery Inspection (PDI) Checklist */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          1. Lexus GX 550 Pre-Delivery Inspection (PDI) Checklist
        </h2>
        <div className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          <p>
            Before signing your final bill of sale and driving off the lot, perform a methodical physical inspection. Factory shipping damages and dealer prep oversights are much easier to rectify prior to delivery sign-off:
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong>Upright Front Fascia Inspection:</strong> Check the leading hood edge, grille surround, and lower front air dam for micro-scratches or rail-dust fallout accumulated during sea transit and CP rail transit from Tahara, Japan.</li>
            <li><strong>Factory Transport Spring Blocks:</strong> Verify the dealer service technician removed the front suspension shipping spacers. Leaving these in produces a harsh, jarring ride quality.</li>
            <li><strong>Rear Door Alignment:</strong> Inspect the rear power liftgate and independent glass hatch latching mechanisms for symmetric panel gaps.</li>
            <li><strong>Lexus Interface Software Build:</strong> Ensure the 14-inch touchscreen display has the latest over-the-air firmware applied with wireless Apple CarPlay and Android Auto active.</li>
          </ul>
        </div>
      </section>

      {/* Part 2: Curated Must-Have Accessories */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          2. Essential Delivery-Day Accessories
        </h2>

        {/* Item 1: TuxMat High-Wall All-Weather Liners */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Interior Floor Armor
              </span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                TuxMat Custom-Fit High-Wall Floor Liners
              </h3>
            </div>
            <Badge variant="outline" className="text-xs font-semibold self-start sm:self-auto">
              Direct Fit (2024–2026)
            </Badge>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Standard OEM rubber mats leave the driver footrest dead pedal exposed, letting melting road salt seep directly into factory carpet and underbody harnesses. TuxMat provides 100% vertical sidewall and dead-pedal coverage, locking securely into place with retention clips.
          </p>
          <div className="pt-1 flex items-center justify-between gap-4 flex-wrap">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Est. Price: $280 – $340 CAD
            </span>
            <a
              href={tuxMatUrl}
              target="_blank"
              rel="sponsored noopener noreferrer nofollow"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 text-xs font-semibold transition-colors"
            >
              <span>Search TuxMat on Amazon</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Item 2: FitcamX 4K OEM Integrated Dashcam */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Stealth OEM Video Defense
              </span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                FitcamX 4K Integrated Dashcam (Lexus LSS+ 3.0)
              </h3>
            </div>
            <Badge variant="outline" className="text-xs font-semibold self-start sm:self-auto">
              Zero Wire Splicing
            </Badge>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Replaces the factory plastic rearview mirror shroud with an identical OEM-textured casing housing a high-resolution 4K Sony Starvis sensor. Taps directly into the auto-dimming mirror harness with zero fuse-box routing, maintaining full factory aesthetics.
          </p>
          <div className="pt-1 flex items-center justify-between gap-4 flex-wrap">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Est. Price: $230 – $280 CAD
            </span>
            <a
              href={fitcamxUrl}
              target="_blank"
              rel="sponsored noopener noreferrer nofollow"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 text-xs font-semibold transition-colors"
            >
              <span>Search FitcamX on Amazon</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Item 3: Spigen GlasTR 14-inch Screen Protector */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Display Defense
              </span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Spigen GlasTR 14-inch Matte Tempered Glass Screen Protector
              </h3>
            </div>
            <Badge variant="outline" className="text-xs font-semibold self-start sm:self-auto">
              9H Oleophobic Finish
            </Badge>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            The prominent 14-inch center infotainment display attracts severe glare and smudge marks. Spigen&apos;s custom-cut matte tempered glass diffuses harsh cabin reflections and protects the factory glass against ring and key micro-scratches.
          </p>
          <div className="pt-1 flex items-center justify-between gap-4 flex-wrap">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Est. Price: $32 – $38 CAD
            </span>
            <a
              href={spigenUrl}
              target="_blank"
              rel="sponsored noopener noreferrer nofollow"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 text-xs font-semibold transition-colors"
            >
              <span>Search Spigen on Amazon</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Part 3: Paint Protection Film (PPF) Strategy */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          3. Paint Protection Film (PPF) Preservation Tips
        </h2>
        <div className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          <p>
            Unlike sloped aerodynamic crossovers, the Lexus GX 550 features a near-vertical front grille and bluff hood profile. Highway gravel and road grit strike perpendicular to painted surfaces, causing immediate rock chips down to bare primer:
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong>High-Impact Strike Zones:</strong> Apply 8-mil to 10-mil self-healing TPU film across the full hood, front bumper, A-pillars, and front windshield header.</li>
            <li><strong>Fender Flares &amp; Rockers:</strong> The GX 550&apos;s wide track kicks up gravel directly against the lower doors and flared wheel arches. Ensure rocker panel film wraps behind the mudguard line.</li>
            <li><strong>Ceramic Coating Sequence:</strong> Always apply PPF to bare clear coat <em>before</em> applying ceramic coatings, as ceramic slickness impairs film adhesive tack.</li>
          </ul>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {gxFaqData.map((faq, i) => (
            <div key={i} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 space-y-1.5">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {faq.question}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
