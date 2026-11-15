import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { GuideDisclaimer } from '@/components/common/GuideDisclaimer';
import { buildAmazonAffiliateUrl } from '@/lib/affiliate';
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
  Zap,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const { instant } = { instant: false };

export function generateMetadata(): Metadata {
  return {
    title: '2026 vs. 2027 Toyota Prius & PHEV Canada: Standard Upgrades & Wait Times | ToyotaWaits',
    description:
      'Compare the 2026 and 2027 Toyota Prius AWD & Prius Plug-in Hybrid in Canada. Standard dual-zone climate control, included dual-voltage L1/L2 PHEV charger, Canadian pricing, and queue rollovers.',
    alternates: {
      canonical: 'https://www.toyotawaits.ca/guides/toyota-prius-2026-vs-2027',
    },
    openGraph: {
      title: '2026 vs. 2027 Toyota Prius & PHEV Canada: Standard Upgrades & Wait Times | ToyotaWaits',
      description:
        'Compare the 2026 and 2027 Toyota Prius AWD & Prius Plug-in Hybrid in Canada. Standard dual-zone climate control, included dual-voltage L1/L2 PHEV charger, Canadian pricing, and queue rollovers.',
      url: 'https://www.toyotawaits.ca/guides/toyota-prius-2026-vs-2027',
      siteName: 'ToyotaWaits.ca',
      locale: 'en_CA',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: '2026 vs. 2027 Toyota Prius & PHEV Canada: Standard Upgrades & Wait Times | ToyotaWaits',
      description:
        'Compare the 2026 and 2027 Toyota Prius AWD & Prius Plug-in Hybrid in Canada. Standard dual-zone climate control, included dual-voltage L1/L2 PHEV charger, Canadian pricing, and queue rollovers.',
    },
  };
}

const faqData = [
  {
    question: 'What changed on the 2027 Toyota Prius and Prius Plug-in Hybrid in Canada?',
    answer:
      'For 2027, dual-zone automatic climate control is now standardized across every Canadian Prius AWD and Prius Plug-in Hybrid grade, and every 2027 Prius Plug-in Hybrid includes a dual-voltage Level 1 / Level 2 home charging cable at no extra cost.',
  },
  {
    question: 'What are the 2027 Toyota Prius AWD and Prius PHEV prices in Canada?',
    answer:
      'In Canada, the 2027 Prius XLE AWD (196 hp, 4.8 L/100 km) starts at $39,000 MSRP ($42,588 all-in) and Limited AWD at $44,210 MSRP ($47,798 all-in). The 220-hp Prius Plug-in Hybrid SE starts at $41,080 MSRP ($44,668 all-in), XSE at $45,875 MSRP ($49,463 all-in), and XSE Premium at $49,160 MSRP ($52,748 all-in).',
  },
  {
    question: 'Should I take a 2026 Prius allocation or wait for a 2027?',
    answer:
      'Accept an incoming 2026 Prius or Prius Plug-in Hybrid allocation at MSRP immediately if offered, as Tsutsumi Japan export allocations to Canada remain constrained; if your deposit rolls to a 2027 VIN, you gain standard dual-zone climate control and the included dual-voltage L1/L2 charger on PHEV trims.',
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
    '2026 vs. 2027 Toyota Prius & PHEV Canada: Standard Upgrades & Wait Times',
  description:
    'Compare the 2026 and 2027 Toyota Prius AWD & Prius Plug-in Hybrid in Canada. Standard dual-zone climate control, included dual-voltage L1/L2 PHEV charger, Canadian pricing, and queue rollovers.',
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
  mainEntityOfPage: 'https://www.toyotawaits.ca/guides/toyota-prius-2026-vs-2027',
};

const DAY_ONE_GEAR_ITEMS = [
  {
    id: 'tuxmat-prius-gen5',
    title: 'TuxMat / High-Wall 3D All-Weather Floor Liners',
    category: 'Interior Armor',
    badge: 'Confirmed Fit 2023–2027',
    priceCad: '~$235 CAD',
    description:
      'Laser-measured high-wall floor liners engineered for the 5th-gen (XW60) Prius AWD and Prius Plug-in Hybrid cabin.',
    query: 'Toyota Prius 2023-2026 all weather floor mats',
    ctaText: 'Check Floor Liners on Amazon ↗',
    icon: Shield,
  },
  {
    id: 'fitcamx-prius-gen5',
    title: 'FitcamX 4K OEM Integrated Dashcam',
    category: 'Stealth Optics',
    badge: 'Plug & Play TSS 3.0',
    priceCad: '~$210 CAD',
    description:
      'Discreet OEM-style 4K UHD dashcam integrating into the Gen 5 Prius rearview mirror shroud with zero fuse tapping.',
    query: 'Fitcamx 4K dash cam Toyota Prius 2023 2024 2025',
    ctaText: 'Check FitcamX on Amazon ↗',
    icon: Camera,
  },
  {
    id: 'spigen-prius-screen',
    title: 'Spigen 8" / 12.3" Tempered Glass Screen Protector',
    category: 'Touchscreen Defense',
    badge: '9H Anti-Glare',
    priceCad: '~$35 CAD',
    description:
      'Optical-grade 9H matte anti-glare tempered glass shield protecting the Prius multimedia touchscreen from scratches and glare.',
    query: 'Spigen screen protector Toyota Prius 12.3 inch',
    ctaText: 'Check Screen Shield on Amazon ↗',
    icon: Layers,
  },
  {
    id: 'prius-phev-level2-evse',
    title: 'Grizzl-E / Level 2 J1772 Home & Portable EVSE',
    category: 'PHEV Charging',
    badge: 'Winter Rated -40°C',
    priceCad: '~$450 CAD',
    description:
      'Dedicated weatherproof Level 2 240V J1772 wall charger keeping your Prius Plug-in Hybrid 72 km EV range topped up all winter.',
    query: 'Grizzl-E Level 2 EV Charger J1772',
    ctaText: 'Check Level 2 Charger on Amazon ↗',
    icon: Zap,
  },
];

export default function Prius2026Vs2027GuidePage() {
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
            Prius AWD &amp; Prius Plug-in Hybrid (Gen 5)
          </Badge>
          <Badge variant="secondary" className="text-xs">
            2026 vs. 2027 Model Year
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          2026 vs. 2027 Toyota Prius &amp; PHEV Canada: Standard Upgrades &amp; Wait Times
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          Compare the 2026 and 2027 Toyota Prius AWD &amp; Prius Plug-in Hybrid in Canada. Breakdown of newly standardized dual-zone climate control across all grades, the included dual-voltage Level 1 / Level 2 PHEV charging cable, Canadian pricing ($39,000–$49,160 MSRP), and Tsutsumi Japan waitlist rollovers.
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
          All 2026 and 2027 Prius and Prius Plug-in Hybrid specifications and Canadian pricing figures reflect official Toyota Canada announcements.
        </p>
      </div>

      {/* 1. Year-Over-Year Comparison Table */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Year-Over-Year Comparison Table (2026 vs. 2027 Canadian Specs)
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Side-by-side comparison of Prius AWD and Prius Plug-in Hybrid equipment upgrades and 2027 Canadian pricing.
          </p>
        </div>

        <Card className="border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Specification / Canadian Trim</th>
                  <th className="py-3 px-4">2026 Toyota Prius &amp; PHEV</th>
                  <th className="py-3 px-4">2027 Toyota Prius &amp; PHEV</th>
                  <th className="py-3 px-4">Year-Over-Year Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Climate Control</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Single-zone automatic on entry/mid grades</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    Standard dual-zone automatic climate control across all Prius &amp; Prius PHEV grades
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Standardized Cabin Comfort
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Included PHEV Charging Cable</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">Standard 120V Level 1 cord</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                    Included dual-voltage Level 1 (120V) / Level 2 (240V) charging cable on all PHEV grades
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    ~$500+ Value Included Free
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Powertrains &amp; EV Range</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">196 hp HEV AWD (4.8 L/100 km) | 220 hp PHEV (up to 72 km EV range)</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">196 hp HEV AWD (4.8 L/100 km) | 220 hp PHEV (up to 72 km EV range)</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" /> 100% Mechanical Carryover
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors bg-zinc-50/40 dark:bg-zinc-900/20">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Prius XLE AWD &amp; Limited AWD (HEV)</td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">XLE: ~$38,165 | Limited: ~$43,545 MSRP (2026)</td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">
                    XLE AWD: $39,000 ($42,588 all-in) | Limited AWD: $44,210 ($47,798 all-in)
                  </td>
                  <td className="py-3 px-4 font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                    Adds Dual-Zone Climate
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors bg-zinc-50/40 dark:bg-zinc-900/20">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Prius PHEV SE / XSE / XSE Premium</td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">SE: ~$40,050 | XSE Prem: ~$48,350 MSRP (2026)</td>
                  <td className="py-3 px-4 font-mono text-zinc-700 dark:text-zinc-300">
                    SE: $41,080 | XSE: $45,875 | XSE Premium: $49,160 ($52,748 all-in)
                  </td>
                  <td className="py-3 px-4 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Includes Dual-Voltage L1/L2 Charger
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
          &ldquo;Pass or Take It?&rdquo; Decision Matrix: Claim Any Incoming Prius Slot
        </h2>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6 space-y-4">
          <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
            <strong>Verdict:</strong> Because Tsutsumi, Japan export allocations to Canada remain tightly constrained (especially on the 220-hp Prius Plug-in Hybrid), <strong>accept any incoming 2026 Prius allocation at MSRP immediately</strong>. If your deposit rolls over into a 2027 VIN, you automatically gain standard dual-zone climate control and the included dual-voltage L1/L2 charging cable on PHEV trims.
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
                <span>In-Transit Prius AWD &amp; PHEV Stock</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                Want to Skip the Prius &amp; Prius PHEV Queue?
              </h3>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Search live Canadian dealer inventory for incoming 2026 and 2027 Prius AWD and Plug-in Hybrid allocations or check provincial delivery timelines.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-black text-sm px-6 py-6 shadow-md cursor-pointer">
                <Link href="/inventory?model=Prius" className="gap-2">
                  <span>Explore Live Toyota Prius Inventory ↗</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-zinc-300 dark:border-zinc-700 text-xs font-bold px-4 py-6">
                <Link href="/wait-times/prius" className="gap-1.5">
                  <span>View Live Prius Wait Times →</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-zinc-300 dark:border-zinc-700 text-xs font-bold px-4 py-6">
                <Link href="/calculator/prius" className="gap-1.5">
                  <span>Prius Savings Calculator →</span>
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
            <span>Confirmed Gen 5 (2023–2027) Fitment</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Day-1 Delivery Gear Shelf: 2026 &amp; 2027 Toyota Prius
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
