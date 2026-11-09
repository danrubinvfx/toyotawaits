import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { Badge } from '@/components/ui/badge';
import { buildAmazonAffiliateUrl } from '@/lib/gear/affiliate';
import {
  Car,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Snowflake,
  Clock,
  Sparkles,
  Plug,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const { instant } = { instant: false };

export const metadata: Metadata = {
  title: 'Lexus NX 450h+ & RX 450h+ Home Charging Guide: Level 2 EVSE Setup in Canada (2026) | ToyotaWaits',
  description:
    'Complete home EV charging guide for Canadian Lexus NX 450h+ and RX 450h+ plug-in hybrid owners. 6.6 kW onboard charger specs, Grizzl-E Level 2 EVSE, and sub-zero winter preconditioning tips.',
  keywords: [
    'Lexus NX 450h charger',
    'Lexus RX 450h+ Level 2 charger installation Canada',
    'Lexus NX 450h+ home charging',
    'Lexus PHEV charging time',
    'Grizzl-E Level 2 charger Lexus',
    'Lexus PHEV winter charging Canada',
  ],
  alternates: {
    canonical: 'https://www.toyotawaits.ca/guides/lexus-phev-home-charging-setup',
  },
  openGraph: {
    title: 'Lexus NX 450h+ & RX 450h+ Home Charging Guide: Level 2 EVSE Setup in Canada (2026)',
    description:
      'Home EVSE setup, 6.6 kW 240V charging times, and winter battery preconditioning for Canadian Lexus NX 450h+ and RX 450h+ plug-in hybrids.',
    url: 'https://www.toyotawaits.ca/guides/lexus-phev-home-charging-setup',
    siteName: 'ToyotaWaits.ca',
    locale: 'en_CA',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lexus NX 450h+ & RX 450h+ Home Charging Guide: Level 2 EVSE Setup in Canada (2026)',
    description:
      'Home EVSE setup, 6.6 kW 240V charging times, and winter battery preconditioning for Canadian Lexus NX 450h+ and RX 450h+ plug-in hybrids.',
  },
};

const phevFaqData = [
  {
    question: 'How fast do the Lexus NX 450h+ and RX 450h+ charge on Level 2 vs Level 1?',
    answer:
      'Both the NX 450h+ and RX 450h+ feature an internal 6.6 kW onboard charger. Connected to a 240V / 32A Level 2 home EVSE, the 18.1 kWh lithium-ion battery replenishes from 0% to 100% in approximately 2.5 hours. On a standard 120V household wall outlet (Level 1, 12A), full recharge requires approximately 11 to 12 hours.',
  },
  {
    question: 'Why is the Canadian-made Grizzl-E Classic 40A recommended for Canadian winters?',
    answer:
      'Unlike plastic-cased smart chargers, the Grizzl-E Classic is manufactured in Ontario, Canada, featuring an IP67 water/dustproof cast aluminum enclosure rated for -40°C to +50°C. Its heavy-duty rubber cable remains flexible and easy to coil even during deep Canadian sub-zero cold snaps.',
  },
  {
    question: 'Can I precondition the cabin using wall power so it doesn’t deplete my pure EV range?',
    answer:
      'Yes. Both the NX 450h+ and RX 450h+ support remote climate preconditioning via the Lexus App. When plugged into a 240V Level 2 charger, the heat pump draws power directly from the grid (shore power) to defrost glass and warm the cabin to 21°C before departure, preserving 100% of your 56–61 km electric driving range.',
  },
  {
    question: 'Do Canadian provinces offer rebates for installing a home EV charger?',
    answer:
      'Yes. Depending on your province, EVSE installation rebates exist. In Quebec, the Roulez vert program provides up to $600 towards Level 2 home charger acquisition and electrician installation. In BC, BC Hydro and CleanBC programs offer up to $350 for single-family residential EVSE installations.',
  },
];

const structuredFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: phevFaqData.map((faq) => ({
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
  headline: 'Lexus NX 450h+ & RX 450h+ Home Charging Guide: Level 2 EVSE Setup in Canada (2026)',
  description:
    'Complete home EV charging guide for Canadian Lexus NX 450h+ and RX 450h+ plug-in hybrid owners.',
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
  mainEntityOfPage: 'https://www.toyotawaits.ca/guides/lexus-phev-home-charging-setup',
};

export default function LexusPhevHomeChargingSetupPage() {
  const grizzlEUrl = buildAmazonAffiliateUrl('Grizzl-E Level 2 EV charger 40A NEMA 14-50', 'B082LMVSLY');
  const holsterUrl = buildAmazonAffiliateUrl('EV charger holster and cable holder J1772');
  const weatherBoxUrl = buildAmazonAffiliateUrl('NEMA 14-50 outdoor weatherproof box RV EV');

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
          <Badge className="bg-emerald-500 text-zinc-950 font-bold gap-1 text-xs hover:bg-emerald-400">
            <Zap className="h-3.5 w-3.5" />
            Lexus PHEV Charging
          </Badge>
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            NX 450h+ &amp; RX 450h+
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Level 2 Home Setup
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          Lexus NX 450h+ &amp; RX 450h+ Home Charging Guide: Level 2 EVSE Setup in Canada (2026)
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          Unlocking the full potential of your Lexus Plug-in Hybrid Electric Vehicle (PHEV) requires a dependable 240V Level 2 charging setup. This guide covers charging speeds, electrical panel requirements, winter heat-pump preconditioning, and durable Canadian-tested EVSE hardware.
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
          href="/wait-times/lexus-nx"
          className="group p-4 rounded-xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 hover:border-emerald-500/60 transition-all flex items-center justify-between shadow-2xs"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Live Allocation Tracker
            </span>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Lexus NX 450h+ Wait Times &rarr;
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Check 10- to 14-month allocation waitlists for Canadian Cambridge, ON assembly allocations.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-emerald-500 group-hover:translate-x-1 shrink-0 ml-3 transition-transform" />
        </Link>

        <Link
          href="/wait-times/lexus-rx"
          className="group p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all flex items-center justify-between shadow-2xs"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Luxury Mid-Size Platform
            </span>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
              Lexus RX 450h+ Wait Times &rarr;
            </h2>
            <p className="text-xs text-zinc-500">
              Compare lead times and dealer allotments for the flagship Japanese PHEV crossover.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-zinc-400 group-hover:translate-x-1 shrink-0 ml-3 transition-transform" />
        </Link>
      </div>

      {/* Part 1: Charging Speed & Technical Specifications */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          1. Lexus PHEV Charging Architecture Explained
        </h2>
        <div className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          <p>
            Both the <strong>Lexus NX 450h+</strong> and <strong>Lexus RX 450h+</strong> are equipped with a high-capacity 18.1 kWh lithium-ion battery pack and an integrated <strong>6.6 kW AC onboard charger</strong>:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 space-y-2">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Level 1 Charging (120V Standard Wall)
              </span>
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">~11.5 – 12 Hours (12A draw)</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Adequate only if parked for extended overnights with low daily mileage. Cannot sustain full cabin preheating in Canadian winter without depleting battery energy.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Level 2 Charging (240V / 32A – 40A Circuit)
              </span>
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">~2.5 Hours (6.6 kW max intake)</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-300">
                Replenishes total EV range during evening errands or midday pauses. Allows heat-pump climate preconditioning using pure shore power.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Part 2: Canadian Winter Pre-Conditioning Protocol */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          2. Canadian Winter Pre-Conditioning &amp; Range Optimization
        </h2>
        <div className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          <p>
            Sub-zero Canadian winters can diminish EV range by 25% to 35% if the heat pump must warm a cold cabin solely from high-voltage battery reserves. Follow this winter charging protocol:
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong>Always Plug In Overnight:</strong> Even when fully charged, keeping the vehicle connected enables automatic battery thermal management to prevent lithium cell freezing at -20°C and lower.</li>
            <li><strong>Shore-Power Preheating:</strong> Program departure timers in the Lexus App 15 minutes before your morning commute. The 6.6 kW Level 2 feed powers the heat pump, heated seats, and defroster directly from your wall box, so you drive away with 100% full EV range.</li>
            <li><strong>Dedicated 40A Breaker / 32A Continuous:</strong> The Canadian Electrical Code (CEC) mandates an 80% continuous load rule. For a 32A charge rate (which maxes the 6.6 kW Lexus onboard charger), have your licensed electrician wire a dedicated 40A two-pole circuit breaker with 8 AWG Romex or armored cable.</li>
          </ul>
        </div>
      </section>

      {/* Part 3: Recommended EVSE Hardware */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          3. Curated Canadian Home EV Charging Equipment
        </h2>

        {/* Item 1: Grizzl-E Classic 40A EVSE */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Heavy-Duty Canadian Engineered EVSE
              </span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Grizzl-E Classic 40A Heavy-Duty Level 2 EV Charger
              </h3>
            </div>
            <Badge variant="outline" className="text-xs font-semibold self-start sm:self-auto">
              Winter Rated (-40°C)
            </Badge>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Proudly designed and manufactured in Canada. Featuring a fire-resistant NEMA 4 cast aluminum body and ultra-flexible 24-foot cold-weather cord that won’t stiffen into solid wire during Canadian blizzards. Supports adjustable amperage dip-switches (16A, 24A, 32A, 40A) to fit your home panel capacity.
          </p>
          <div className="pt-1 flex items-center justify-between gap-4 flex-wrap">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Est. Price: $499 – $549 CAD
            </span>
            <a
              href={grizzlEUrl}
              target="_blank"
              rel="sponsored noopener noreferrer nofollow"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 text-xs font-semibold transition-colors"
            >
              <span>View Grizzl-E on Amazon</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Item 2: Heavy-Duty J1772 Holster & Cable Management */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Cable &amp; Port Protection
              </span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                J1772 Wall-Mounted EV Nozzle Holster &amp; Cable Hanger
              </h3>
            </div>
            <Badge variant="outline" className="text-xs font-semibold self-start sm:self-auto">
              Drop Protection
            </Badge>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Keeps your charging nozzle elevated above wet garage floors, slush pools, and snowbanks. Heavy-duty ABS holster clicks securely onto the J1772 handle release latch, preventing accidental drops that can crack the charging pins.
          </p>
          <div className="pt-1 flex items-center justify-between gap-4 flex-wrap">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Est. Price: $22 – $32 CAD
            </span>
            <a
              href={holsterUrl}
              target="_blank"
              rel="sponsored noopener noreferrer nofollow"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 text-xs font-semibold transition-colors"
            >
              <span>Search Cable Holsters on Amazon</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Item 3: Outdoor Weatherproof NEMA 14-50 Enclosure */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Outdoor Driveway Defense
              </span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Lockable Weatherproof NEMA 14-50 RV/EV Outlet Box
              </h3>
            </div>
            <Badge variant="outline" className="text-xs font-semibold self-start sm:self-auto">
              NEMA 3R Rated
            </Badge>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Essential for outdoor driveway parking setups. Steel enclosure protects the 50-amp 240V receptacle against blowing rain, ice formation, and unauthorized plugging. Can be padlocked while the heavy-duty EVSE plug remains seated inside.
          </p>
          <div className="pt-1 flex items-center justify-between gap-4 flex-wrap">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Est. Price: $65 – $85 CAD
            </span>
            <a
              href={weatherBoxUrl}
              target="_blank"
              rel="sponsored noopener noreferrer nofollow"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 text-xs font-semibold transition-colors"
            >
              <span>Search Weatherproof Boxes on Amazon</span>
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
          {phevFaqData.map((faq, i) => (
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
