import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { GuideDisclaimer } from '@/components/common/GuideDisclaimer';
import { buildAmazonAffiliateUrl } from '@/lib/affiliate';
import { buildGuideMetadata } from '@/lib/seo/host-metadata';
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
  Box,
  Zap,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const { instant } = { instant: false };

export async function generateMetadata(): Promise<Metadata> {
  return buildGuideMetadata({
    slug: 'toyota-highlander-2026-vs-2027',
    caTitle: '2026 vs. 2027 Toyota Highlander Canada: All-Electric 3-Row BEV Overhaul | ToyotaWaits',
    caDescription:
      'Compare the 2026 Gas/Hybrid Highlander vs. the all-new 2027 Toyota Highlander 3-row electric SUV in Canada. Up to 511 km range, 338 hp AWD, native NACS port, and Grand Highlander alternatives.',
    usTitle: '2026 vs. 2027 Toyota Highlander United States (2026–2027 Guide): All-Electric 3-Row BEV Overhaul | ToyotaWaits',
    usDescription:
      'Compare the 2026 Gas/Hybrid Highlander vs. the all-new 2027 Toyota Highlander 3-row electric SUV in the United States. Up to 317 mi range, 338 hp AWD, native NACS port, and Grand Highlander alternatives.',
  });
}

const faqData = [
  {
    question: 'What is the major change for the 2027 Toyota Highlander in Canada?',
    answer:
      "The 2027 Toyota Highlander transitions completely to Toyota's first 3-row battery-electric SUV (BEV) in North America—discontinuing gas and hybrid powertrains, which now live exclusively in the larger Toyota Grand Highlander.",
  },
  {
    question: 'What is the range and battery specification of the 2027 Toyota Highlander BEV?',
    answer:
      'The 2027 Highlander BEV is offered in XLE FWD (77 kWh, 458 km range), XLE AWD (77 kWh / 431 km or 95.8 kWh / 511 km range, 338 hp), XLE Premium AWD (95.8 kWh, 473 km), and Limited AWD (95.8 kWh, 473 km), featuring a native NACS DC fast-charging port (10–80% in ~30 minutes), 14-inch screen, TSS 4.0, and V2L bi-directional power.',
  },
  {
    question: 'Should I buy a 2026 Highlander Hybrid or wait for the 2027 Highlander BEV?',
    answer:
      'Grab remaining 2026 Highlander Gas or Hybrid stock immediately—or pivot to the Toyota Grand Highlander Hybrid—if you want a liquid-fueled 3-row SUV for long winter highway road trips. Reserve a 2027 Highlander BEV if you want a zero-emission 3-row family EV with native Tesla Supercharger access.',
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
    '2026 vs. 2027 Toyota Highlander Canada: All-Electric 3-Row BEV Overhaul',
  description:
    'Compare the 2026 Gas/Hybrid Highlander vs. the all-new 2027 Toyota Highlander 3-row electric SUV in Canada. Up to 511 km range, 338 hp AWD, native NACS port, and Grand Highlander alternatives.',
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
  mainEntityOfPage: 'https://www.toyotawaits.ca/guides/toyota-highlander-2026-vs-2027',
};

const DAY_ONE_GEAR_ITEMS = [
  {
    id: 'nacs-level2-evse',
    title: 'Universal NACS / J1772 Level 2 48A Home EV Charger',
    category: 'Home Charging',
    badge: '2027 NACS Ready',
    priceCad: '~$595 CAD',
    description:
      'Cold-weather rated Level 2 240V home EVSE engineered to recharge the 2027 Highlander BEV 77 kWh and 95.8 kWh battery packs overnight.',
    query: 'Level 2 EV charger 40A 48A NACS J1772 outdoor',
    ctaText: 'Check Level 2 EVSE on Amazon ↗',
    icon: Zap,
  },
  {
    id: 'tuxmat-highlander-3row',
    title: 'TuxMat / High-Wall 3-Row All-Weather Liners',
    category: 'Interior Armor',
    badge: '3-Row Slush Defense',
    priceCad: '~$290 CAD',
    description:
      'High-wall custom 3-row floor liners protecting all three seating rows and rear pass-through aisle from Canadian winter road salt.',
    query: 'Toyota Highlander 3 row all weather floor mats',
    ctaText: 'Check 3-Row Liners on Amazon ↗',
    icon: Shield,
  },
  {
    id: 'spigen-highlander-14in',
    title: 'Spigen 14-Inch Tempered Glass Screen Protector',
    category: 'Touchscreen Defense',
    badge: '9H Anti-Glare',
    priceCad: '~$45 CAD',
    description:
      'Optical-grade 9H matte screen shield protecting the 14-inch Toyota Multimedia center display against glare and scratches.',
    query: 'Spigen 14 inch screen protector Toyota Highlander',
    ctaText: 'Check Screen Shield on Amazon ↗',
    icon: Layers,
  },
  {
    id: 'highlander-cargo-organizer',
    title: 'Collapsible 3-Row Trunk & Charging Cable Organizer',
    category: 'Cargo Storage',
    badge: 'Day-1 Essential',
    priceCad: '~$35 CAD',
    description:
      'Heavy-duty compartmentalized trunk organizer keeping portable EV charging adapters, winter survival kits, and groceries secure.',
    query: 'SUV trunk cargo organizer collapsible heavy duty',
    ctaText: 'Check Cargo Organizer on Amazon ↗',
    icon: Box,
  },
];

export default function Highlander2026Vs2027GuidePage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
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
            2026 Gas/Hybrid vs. 2027 All-Electric 3-Row BEV
          </Badge>
          <Badge variant="secondary" className="text-xs">
            2026 vs. 2027 Model Year
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          2026 vs. 2027 Toyota Highlander Canada: All-Electric 3-Row BEV Overhaul
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          Compare the final 2026 Gas and Hybrid Toyota Highlander against the all-new 2027 Toyota Highlander 3-row battery-electric SUV (BEV) in Canada—featuring up to 511 km range, 338 hp AWD, native NACS Supercharger access, TSS 4.0, and V2L bi-directional power.
        </p>
      </div>

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
          All 2026 and 2027 Highlander specifications, battery capacities, and range figures reflect official Toyota Canada announcements.
        </p>
      </div>

      {/* 1. Year-Over-Year Comparison Table */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Year-Over-Year Comparison Table (2026 Gas/Hybrid vs. 2027 BEV)
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Complete architectural shift from internal combustion and self-charging hybrid to a dedicated 3-row battery-electric SUV.
          </p>
        </div>

        <Card className="border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Specification / Feature</th>
                  <th className="py-3 px-4">2026 Toyota Highlander</th>
                  <th className="py-3 px-4">2027 Toyota Highlander (All-New BEV)</th>
                  <th className="py-3 px-4">Year-Over-Year Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Powertrain Architecture</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">2.4L Turbo Gas (265 hp) &amp; 2.5L Hybrid AWD (243 hp)</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    100% Battery-Electric (BEV): 221 hp FWD or 338 hp Dual-Motor AWD (Gas &amp; Hybrid discontinued)
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Complete BEV Transformation
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Battery &amp; Driving Range</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Gasoline tank (~950 km hybrid range)</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    77 kWh (458 km FWD / 431 km AWD) or 95.8 kWh (up to 511 km on XLE AWD; 473 km on XLE Premium &amp; Limited AWD)
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Up to 511 km Zero-Emission Range
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Charging &amp; V2L Power</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Does not plug in</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    Native NACS Port (10–80% DC fast charge in ~30 min), Battery Pre-Conditioning &amp; Vehicle-to-Load (V2L)
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Native Tesla Supercharger Access
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Cockpit &amp; Safety Suite</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">8&quot; / 12.3&quot; Display + TSS 2.5+</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    Standard 14&quot; touchscreen, 12.3&quot; gauge cluster, Toyota Safety Sense 4.0 &amp; 4,536 litres max cargo
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Next-Gen Cabin &amp; TSS 4.0
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
          &ldquo;Pass or Take It?&rdquo; Decision Matrix: Hybrid Road-Tripper vs. 3-Row EV
        </h2>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6 space-y-4">
          <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
            <strong>Verdict:</strong> Because the 2027 Highlander eliminates gas and self-charging hybrid engines altogether, <strong>claim a remaining 2026 Highlander Hybrid allocation immediately</strong> (or switch your deposit to the <strong>Toyota Grand Highlander Hybrid</strong>) if you want liquid-fuel convenience without charging stops. <strong>Hold for the late-2026/2027 Highlander BEV</strong> if you have Level 2 home charging and want a 338-hp, 511-km all-electric 3-row family SUV.
          </p>
        </div>
      </section>

      {/* 3. Live Inventory & Grand Highlander Bridge CTA */}
      <section aria-label="Live Inventory Allocation Bridge">
        <div className="relative overflow-hidden rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-500/15 via-red-500/10 to-zinc-50 dark:from-red-950/50 dark:via-zinc-900/70 dark:to-zinc-950 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white shadow-xs">
                <Warehouse className="h-3.5 w-3.5" />
                <span>3-Row Hybrid &amp; EV Options</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                Grab Remaining 2026 Highlander Stock or Pivot to Grand Highlander
              </h3>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Search live Canadian dealer inventory for remaining 2026 Highlander Gas/Hybrid builds, or check Grand Highlander Hybrid wait times if you still want a self-charging 3-row hybrid.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-black text-sm px-6 py-6 shadow-md cursor-pointer">
                <Link href="/inventory?model=Highlander" className="gap-2">
                  <span>Explore Live Highlander Inventory ↗</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-zinc-300 dark:border-zinc-700 text-xs font-bold px-4 py-6">
                <Link href="/wait-times/grand-highlander" className="gap-1.5">
                  <span>Compare Grand Highlander Wait Times →</span>
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
            <span>3-Row Protection &amp; Charging Gear</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Day-1 Delivery Gear Shelf: 2026 &amp; 2027 Toyota Highlander
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {DAY_ONE_GEAR_ITEMS.map((item) => {
            const href = buildAmazonAffiliateUrl({ query: item.query, market: 'CA' });
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
          {faqData.map((faq, index) => (
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

      <GuideDisclaimer />
    </div>
  );
}
