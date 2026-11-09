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
  ExternalLink,
  Layers,
  Sparkles,
  Lock,
  Tv,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const { instant } = { instant: false };

export const metadata: Metadata = {
  title: 'Lexus TX 350 & 500h Delivery Prep Guide: 3-Row Protection & Tech (2026) | ToyotaWaits',
  description:
    'Comprehensive delivery-day checklist and essential accessories for 2024–2026 Lexus TX 350, TX 500h, and TX 550h+ owners. 3-row high-wall liners, 14" screen defense, and Faraday theft prevention.',
  keywords: [
    'Lexus TX accessories',
    'Lexus TX all weather mats',
    'Lexus TX 3 row liner',
    'Lexus TX delivery checklist',
    'Lexus TX 500h accessories',
    'Lexus TX 14 inch screen protector',
    'Lexus TX Canadian delivery',
  ],
  alternates: {
    canonical: 'https://www.toyotawaits.ca/guides/lexus-tx-delivery-prep-gear',
  },
  openGraph: {
    title: 'Lexus TX 350 & 500h Delivery Prep Guide: 3-Row Protection & Tech (2026)',
    description:
      'Delivery-day inspection checklist, 3-row high-wall floor armor, and infotainment protection for Canadian Lexus TX buyers.',
    url: 'https://www.toyotawaits.ca/guides/lexus-tx-delivery-prep-gear',
    siteName: 'ToyotaWaits.ca',
    locale: 'en_CA',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lexus TX 350 & 500h Delivery Prep Guide: 3-Row Protection & Tech (2026)',
    description:
      'Delivery-day inspection checklist, 3-row high-wall floor armor, and infotainment protection for Canadian Lexus TX buyers.',
  },
};

const txFaqData = [
  {
    question: 'How do 3-row all-weather floor liners fit in the Lexus TX with 2nd-row captain’s chairs?',
    answer:
      'High-wall custom-fit TPE liners for the Lexus TX are designed specifically for either 7-passenger bench seating or 6-passenger captain’s chairs. Liners for the 6-passenger configuration include a dedicated pass-through runner strip that bridges the 2nd row aisle, preventing slush and salt tracked by children from soiling the carpet between seats.',
  },
  {
    question: 'Why are Faraday key fob signal blocker pouches recommended for the Lexus TX?',
    answer:
      'Modern luxury three-row SUVs like the Lexus TX are prime targets for relay theft attacks in urban Canadian hubs (such as the GTA and Lower Mainland). A dual-layer Faraday pouch completely blocks RFID and keyless smart-entry signals when your key fob is parked inside the home, preventing thieves from cloning the handshake signal to unlock and start the vehicle.',
  },
  {
    question: 'Can the 14-inch screen protector be installed without creating air bubbles?',
    answer:
      'Yes. High-quality tempered glass protectors (such as Spigen GlasTR) include an alignment frame or auto-alignment hinge tabs. Performing installation in a closed cabin after running the heater on low or wiping down surfaces with the included microfiber lint-cloth ensures a bubble-free, anti-glare finish.',
  },
  {
    question: 'Does the Lexus TX cargo area need a split-folding seatback protector?',
    answer:
      'Yes. Because the 50/50 power third row is frequently folded flat to expand cargo capacity from 572 liters to over 1,600 liters, full-coverage TPE cargo trays with velcro seatback protectors ensure the carpeted rear seat backs are shielded against hockey bags, strollers, and wet gear.',
  },
];

const structuredFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: txFaqData.map((faq) => ({
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
  headline: 'Lexus TX 350 & 500h Delivery Prep Guide: 3-Row Protection & Tech (2026)',
  description:
    'Comprehensive delivery-day checklist and essential accessories for 2024–2026 Lexus TX 350, TX 500h, and TX 550h+ owners.',
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
  mainEntityOfPage: 'https://www.toyotawaits.ca/guides/lexus-tx-delivery-prep-gear',
};

export default function LexusTxDeliveryPrepGearPage() {
  const floorLinersUrl = buildAmazonAffiliateUrl('Lexus TX 3-row all weather floor mats liners');
  const screenProtectorUrl = buildAmazonAffiliateUrl('Spigen 14 inch screen protector Lexus TX GX NX');
  const faradayUrl = buildAmazonAffiliateUrl('Faraday bag key fob signal protector pouch');
  const cargoLinerUrl = buildAmazonAffiliateUrl('Lexus TX cargo mat trunk liner with backrest protector');

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
            2024–2026 TX 350 / 500h / 550h+
          </Badge>
          <Badge variant="secondary" className="text-xs">
            3-Row Delivery Prep
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          Lexus TX 350 &amp; 500h Delivery Prep Guide: 3-Row Protection &amp; Tech (2026)
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          Engineered on the GA-K platform and manufactured at Toyota Motor Manufacturing Indiana (TMMI), the Lexus TX provides genuine three-row adult passenger comfort. This guide provides your delivery-day inspection roadmap, interior protection essentials, and anti-theft counter-measures tailored for Canadian owners.
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

      {/* Cross-Shopping & Sibling Platform Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/wait-times/lexus-tx"
          className="group p-4 rounded-xl border border-amber-500/30 bg-amber-50/40 dark:bg-amber-950/20 hover:border-amber-500/60 transition-all flex items-center justify-between shadow-2xs"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Live Allocation Tracker
            </span>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Lexus TX Canadian Wait Times &rarr;
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Track 6- to 12-month waitlists across Ontario, BC, and Quebec dealerships.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-amber-500 group-hover:translate-x-1 shrink-0 ml-3 transition-transform" />
        </Link>

        <Link
          href="/wait-times/grand-highlander"
          className="group p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all flex items-center justify-between shadow-2xs"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Sister Platform
            </span>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
              Toyota Grand Highlander Wait Times &rarr;
            </h2>
            <p className="text-xs text-zinc-500">
              Compare lead times and production cadence from the Princeton, Indiana assembly line.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-zinc-400 group-hover:translate-x-1 shrink-0 ml-3 transition-transform" />
        </Link>
      </div>

      {/* Part 1: Pre-Delivery Inspection (PDI) Checklist */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          1. Lexus TX Dealership Delivery Day Inspection
        </h2>
        <div className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          <p>
            When receiving your Lexus TX at the dealership, verify these crucial factory check items before taking formal delivery:
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong>Panoramic Glass Roof Shade &amp; Seals:</strong> Test the power panoramic sunshade through two complete open and close cycles. Verify there is no motor hesitation or wind-seal misalignment along the front edge.</li>
            <li><strong>Third-Row Power Folding Operation:</strong> Cycle the 50/50 power folding 3rd-row seats from both the trunk buttons and the C-pillar entry buttons to verify smooth motor retraction.</li>
            <li><strong>Rear Tri-Zone Climate Control:</strong> Confirm the dedicated rear HVAC blower unit delivers instant heating and cooling to 2nd- and 3rd-row ceiling vents.</li>
            <li><strong>Qi Wireless Charging Pad Alignment:</strong> Ensure your smartphone maintains steady inductive charging on the console tray without overheating or dropping connection during vehicle movement.</li>
          </ul>
        </div>
      </section>

      {/* Part 2: Essential 3-Row Protection & Tech Accessories */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          2. Essential Accessories &amp; Protection Gear
        </h2>

        {/* Item 1: 3-Row High-Wall All-Weather Floor Liners */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Full Cabin Floor Armor
              </span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                3-Row High-Wall All-Weather Floor Liners
              </h3>
            </div>
            <Badge variant="outline" className="text-xs font-semibold self-start sm:self-auto">
              3-Row Coverage
            </Badge>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Engineered with deep containment reservoirs and high sidewalls to trap snow, slush, and road salt across all three rows. Precision laser-measured for either captain’s chairs or 2nd-row bench configurations to guarantee zero dead-space gaps.
          </p>
          <div className="pt-1 flex items-center justify-between gap-4 flex-wrap">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Est. Price: $260 – $320 CAD
            </span>
            <a
              href={floorLinersUrl}
              target="_blank"
              rel="sponsored noopener noreferrer nofollow"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 text-xs font-semibold transition-colors"
            >
              <span>Search 3-Row Liners on Amazon</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Item 2: Spigen 14-inch Screen Protector */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Touchscreen Defense
              </span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Spigen GlasTR 14-inch Matte Tempered Glass Screen Protector
              </h3>
            </div>
            <Badge variant="outline" className="text-xs font-semibold self-start sm:self-auto">
              14&quot; Interface Fit
            </Badge>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            The expansive 14-inch Lexus Interface touchscreen is the visual centerpiece of the cabin. Spigen&apos;s 9H oleophobic matte tempered glass cuts blinding glare, eliminates fingerprint oil buildup, and shields the expensive digitizer from accidental impacts.
          </p>
          <div className="pt-1 flex items-center justify-between gap-4 flex-wrap">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Est. Price: $32 – $38 CAD
            </span>
            <a
              href={screenProtectorUrl}
              target="_blank"
              rel="sponsored noopener noreferrer nofollow"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 text-xs font-semibold transition-colors"
            >
              <span>Search Spigen on Amazon</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Item 3: Faraday Key Fob Signal Blocker Pouches */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Theft Defense
              </span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Dual-Layer Faraday Key Fob Shielding Pouches (2-Pack)
              </h3>
            </div>
            <Badge variant="outline" className="text-xs font-semibold self-start sm:self-auto">
              RFID &amp; Relay Defense
            </Badge>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Prevent relay theft attacks outside your residence. Metallic-weave Faraday pouches block 100% of the key fob smart-entry frequency, stopping thieves from extending the fob’s signal to unlock and clone the vehicle in under 60 seconds.
          </p>
          <div className="pt-1 flex items-center justify-between gap-4 flex-wrap">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Est. Price: $18 – $26 CAD
            </span>
            <a
              href={faradayUrl}
              target="_blank"
              rel="sponsored noopener noreferrer nofollow"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 text-xs font-semibold transition-colors"
            >
              <span>Search Faraday Pouches on Amazon</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Item 4: All-Weather Split Cargo Mat with Backrest Protectors */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Cargo Area Defense
              </span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                All-Weather Split Cargo Mat &amp; 3rd-Row Seatback Protectors
              </h3>
            </div>
            <Badge variant="outline" className="text-xs font-semibold self-start sm:self-auto">
              50/50 Split Coverage
            </Badge>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Protects the trunk floor and the backs of the 3rd-row seats independently. Allows you to raise or lower either side of the 3rd row without detaching the liner, shielding delicate upholstery from dirt, sports equipment, and luggage scuffs.
          </p>
          <div className="pt-1 flex items-center justify-between gap-4 flex-wrap">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Est. Price: $110 – $150 CAD
            </span>
            <a
              href={cargoLinerUrl}
              target="_blank"
              rel="sponsored noopener noreferrer nofollow"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 text-xs font-semibold transition-colors"
            >
              <span>Search Cargo Mats on Amazon</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {txFaqData.map((faq, i) => (
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
