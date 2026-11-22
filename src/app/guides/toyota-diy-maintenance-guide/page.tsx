import React, { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { GuideDisclaimer } from '@/components/common/GuideDisclaimer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GearCard, type GearCardItem } from '@/components/gear/GearCard';
import { GEAR_MARKET_CATALOG } from '@/data/gear/catalog';
import { getRequestMarketMetadata } from '@/lib/seo/host-metadata';
import {
  Wrench,
  ShieldCheck,
  Droplets,
  CalendarClock,
  Sparkles,
  Armchair,
  CloudRain,
  BatteryCharging,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Gauge,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const { instant } = { instant: false };

const GUIDE_PATH = '/guides/toyota-diy-maintenance-guide';
const GUIDE_TITLE =
  'Toyota DIY Maintenance & Upkeep Guide: Oil Specs, Filters & Care | ToyotaWaits';
const GUIDE_DESCRIPTION =
  'Complete DIY maintenance checklist for Toyota Hybrid & Gas owners. Model-by-model 0W-8, 0W-16, and 0W-20 oil specs, hybrid battery fan filter cleaning, 12V battery care, and wash gear.';

export async function generateMetadata(): Promise<Metadata> {
  const { isUS, baseUrl, alternatesLanguages } = await getRequestMarketMetadata(GUIDE_PATH);
  const canonical = `${baseUrl}${GUIDE_PATH}`;

  return {
    title: GUIDE_TITLE,
    description: GUIDE_DESCRIPTION,
    keywords: [
      'toyota diy maintenance guide',
      'toyota 0w-16 vs 0w-20 vs 0w-8 oil',
      'toyota hybrid battery cooling filter cleaning',
      'toyota 90915-yzzn1 oil filter',
      'toyota rav4 hybrid oil change spec',
      'toyota wheel lug nut torque 76 ft lbs',
      'does diy oil change void toyota warranty',
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
    question:
      'What motor oil weight does my Toyota Hybrid or Gas model take (0W-8 vs 0W-16 vs 0W-20)?',
    answer:
      'Most 2019–2026 RAV4 Hybrid, Camry Hybrid, and Corolla Hybrid models take 0W-16 full synthetic oil with Toyota OEM filter 90915-YZZN1. Newer 2023+ Prius, Crown, and Corolla Cross powertrains specify ultra-low-viscosity 0W-8. Larger vehicles including the 2021+ Sienna Hybrid, Grand Highlander, Tacoma, and Tundra use 0W-20 full synthetic. Always verify the oil filler cap and owner manual for your exact model year.',
  },
  {
    question:
      'How often should I clean or replace the Toyota hybrid battery cooling intake filter?',
    answer:
      'Inspect and vacuum the rear-seat hybrid battery cooling intake filter every 15,000 km (or every 6 months if you carry pets or drive dusty gravel roads). A clogged mesh screen restricts airflow to the HV traction battery, triggering cooling fan noise, reduced hybrid regeneration, or premature battery heat warnings.',
  },
  {
    question:
      'Does doing my own oil changes or air filters void my Toyota factory warranty in Canada or the US?',
    answer:
      'No. Under Canadian consumer protection laws and the US Magnuson-Moss Warranty Act, performing your own oil changes, cabin air filters, or wiper replacements cannot void your factory powertrain or hybrid warranty—provided you use OEM-spec fluids (API SP / ILSAC GF-6B or JASO GLV-1 for 0W-8) and keep dated receipts plus odometer logs.',
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

interface FluidMatrixRow {
  group: string;
  models: string;
  oilWeight: string;
  oilSpecBadge: string;
  oemFilter: string;
  hybridNote: string;
  lugTorque: string;
}

const FLUID_MATRIX_ROWS: FluidMatrixRow[] = [
  {
    group: 'Compact & Midsize Hybrids',
    models: 'RAV4 Hybrid, Camry Hybrid, Corolla Hybrid',
    oilWeight: '0W-16 Full Synthetic',
    oilSpecBadge: 'ILSAC GF-6B',
    oemFilter: '90915-YZZN1',
    hybridNote: 'Inspect/vacuum rear-seat hybrid fan filter every 15,000 km.',
    lugTorque: '76 ft-lbs (103 Nm)',
  },
  {
    group: 'Next-Gen Ultra-Low Viscosity',
    models: 'Prius (2023+), Crown, Corolla Cross',
    oilWeight: '0W-8 Full Synthetic',
    oilSpecBadge: 'JASO GLV-1',
    oemFilter: '90915-YZZN1',
    hybridNote: 'Check rear HV intake screen; use 0W-8 only where cap specifies.',
    lugTorque: '76 ft-lbs (103 Nm)',
  },
  {
    group: '3-Row, Minivan & Body-on-Frame',
    models: 'Sienna Hybrid (2021+), Grand Highlander, Tacoma, Tundra',
    oilWeight: '0W-20 Full Synthetic',
    oilSpecBadge: 'API SP / GF-6A',
    oemFilter: '90915-YZZN1 / YZZD1',
    hybridNote: 'Sienna & GH Hybrids: clean under-seat battery intake vents every 15,000 km.',
    lugTorque: '76–97 ft-lbs (check trim)',
  },
];

const SHELF_A_SLUGS = [
  'toyota-0w16-synthetic-oil',
  'toyota-0w20-synthetic-oil',
  'toyota-oem-oil-filter-kit',
  'cabin-engine-air-filter',
  'hybrid-battery-filter-mesh',
] as const;

const SHELF_B_SLUGS = [
  'undercarriage-pressure-washer',
  'optimum-no-rinse-wash',
  'griots-ceramic-3-in-1-wax',
  'microfiber-edgeless-towels',
] as const;

const SHELF_C_SLUGS = [
  'interior-uv-protectant',
  'detailing-brush-screen-kit',
] as const;

const SHELF_D_SLUGS = [
  'beam-wiper-blades',
  'glass-rain-repellent',
] as const;

const SHELF_E_SLUGS = [
  'noco-12v-battery-maintainer',
  'torque-wrench-lug-socket',
] as const;

function buildGearShelfItems(slugs: readonly string[], defaultCategory: string): GearCardItem[] {
  return slugs.map((slug) => {
    const cfg = GEAR_MARKET_CATALOG[slug];
    return {
      id: cfg.id || slug,
      slug,
      title: cfg.title,
      brand: cfg.brand,
      category: cfg.category || defaultCategory,
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

function ShelfFallback() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="h-48 rounded-2xl border border-zinc-800 bg-zinc-900/50 animate-pulse" />
      <div className="h-48 rounded-2xl border border-zinc-800 bg-zinc-900/50 animate-pulse" />
    </div>
  );
}

export default async function ToyotaDiyMaintenanceGuidePage() {
  const { isUS, baseUrl } = await getRequestMarketMetadata(GUIDE_PATH);
  const articleSchema = buildArticleSchema(baseUrl);

  const shelfAItems = buildGearShelfItems(SHELF_A_SLUGS, 'Fluids & OEM Filters');
  const shelfBItems = buildGearShelfItems(SHELF_B_SLUGS, 'Exterior Wash & Salt Removal');
  const shelfCItems = buildGearShelfItems(SHELF_C_SLUGS, 'Interior & Cabin Care');
  const shelfDItems = buildGearShelfItems(SHELF_D_SLUGS, 'Wipers & Glass Visibility');
  const shelfEItems = buildGearShelfItems(SHELF_E_SLUGS, '12V Battery & Seasonal Tire Care');

  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-16 space-y-12">
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
            <Wrench className="h-3.5 w-3.5" />
            DIY Owner Maintenance
          </Badge>
          <Badge
            variant="outline"
            className="border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs font-semibold"
          >
            {isUS ? 'US & Canada Edition' : 'Canada & US Edition'}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            0W-8 · 0W-16 · 0W-20 Specs
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          Toyota DIY Maintenance &amp; Upkeep Guide: Oil Specs, Filters &amp; Care
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          Keep your Toyota Hybrid or Gas powertrain running past 400,000 km without paying $120+
          dealer markups for 5-minute air filters, wiper inserts, or winter salt flushes. Use our
          model-specific fluid matrix, 8,000 km / 16,000 km schedule, and vetted DIY kit below.
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
          <strong>Transparency Notice:</strong> {isUS ? 'ToyotaWaits.com' : 'ToyotaWaits.ca'}{' '}
          participates in affiliate partner programs, including the Amazon Associates Program (US
          &amp; Canada). If you purchase maintenance gear or OEM-spec consumables through links on
          this page, we may earn a small commission at <strong>no extra cost to you</strong>. All
          fluid weights and torque specs should be cross-checked against your vehicle&apos;s owner
          manual.
        </p>
      </div>

      {/* Section 1: Model Fluid & Filter Quick-Lookup Matrix */}
      <section className="space-y-5" aria-labelledby="fluid-matrix-heading">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 shrink-0">
              <Gauge className="h-4 w-4" />
            </div>
            <h2
              id="fluid-matrix-heading"
              className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50"
            >
              1. Model Fluid &amp; Filter Quick-Lookup Matrix
            </h2>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 max-w-3xl">
            Toyota uses three distinct synthetic oil viscosities across its modern lineup. Match
            your model group below before ordering oil or spin-on filters.
          </p>
        </div>

        {/* Desktop Table */}
        <div
          data-testid="fluid-lookup-matrix"
          className="hidden md:block overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 shadow-sm"
        >
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <th className="py-3.5 px-4 font-bold">Model Lineup</th>
                <th className="py-3.5 px-4 font-bold">Motor Oil Weight</th>
                <th className="py-3.5 px-4 font-bold">OEM Filter</th>
                <th className="py-3.5 px-4 font-bold">Hybrid Intake &amp; Torque Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {FLUID_MATRIX_ROWS.map((row) => (
                <tr
                  key={row.group}
                  className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                >
                  <td className="py-4 px-4 align-top">
                    <div className="font-bold text-zinc-900 dark:text-zinc-100">{row.models}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {row.group}
                    </div>
                  </td>
                  <td className="py-4 px-4 align-top">
                    <span className="inline-flex items-center rounded-md bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                      {row.oilWeight}
                    </span>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                      {row.oilSpecBadge}
                    </div>
                  </td>
                  <td className="py-4 px-4 align-top font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">
                    {row.oemFilter}
                  </td>
                  <td className="py-4 px-4 align-top text-xs text-zinc-600 dark:text-zinc-300 space-y-1">
                    <p>{row.hybridNote}</p>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium">
                      Wheel Lug Spec: {row.lugTorque}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {FLUID_MATRIX_ROWS.map((row) => (
            <Card
              key={row.group}
              className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70"
            >
              <CardHeader className="p-4 pb-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {row.group}
                </div>
                <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {row.models}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2 space-y-2 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 hover:bg-emerald-500/20">
                    {row.oilWeight}
                  </Badge>
                  <Badge variant="outline" className="font-mono text-amber-600 dark:text-amber-400">
                    Filter: {row.oemFilter}
                  </Badge>
                </div>
                <p className="text-zinc-600 dark:text-zinc-300">{row.hybridNote}</p>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium">
                  Lug Torque: {row.lugTorque}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Section 2: 8,000 km / 6-Month vs. 16,000 km / 12-Month DIY Schedule */}
      <section className="space-y-5" aria-labelledby="diy-schedule-heading">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shrink-0">
              <CalendarClock className="h-4 w-4" />
            </div>
            <h2
              id="diy-schedule-heading"
              className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50"
            >
              2. The 8,000 km / 6-Month vs. 16,000 km / 12-Month DIY Schedule
            </h2>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 max-w-3xl">
            Separate quick 10-minute driveway tasks from logged powertrain intervals so you never
            pay dealer service-bay markup for simple inspections—while keeping your factory warranty
            paperwork spotless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-emerald-500/25 bg-white dark:bg-zinc-900/70">
            <CardHeader className="p-5 pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Every 8,000 km / 6 Months (10-Minute DIY)
              </div>
              <CardTitle className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                Quick Driveway &amp; Seasonal Checks
              </CardTitle>
              <CardDescription className="text-xs">
                Zero special tools required—saves $150+ per visit over dealer &ldquo;Service #1&rdquo;
                packages.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Cabin &amp; Engine Air Filters:</strong> Pop the glovebox damper and airbox
                  clips in 5 minutes; replace with HEPA activated carbon filters annually or every
                  16,000 km.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Hybrid Battery Intake Mesh Vacuuming:</strong> Vacuum lint/pet fur from
                  the rear-seat battery cooling grille every 15,000 km (6 months with pets).
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Wiper Blades &amp; Windshield Hydrophobics:</strong> Swap streaky beam
                  blades before winter sleet and apply glass rain repellent away from TSS sensors.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Seasonal Wheel Torque:</strong> Torque lug nuts to{' '}
                  <strong>76 ft-lbs (103 Nm)</strong> on RAV4/Camry/Corolla/Sienna and re-check
                  after 100 km.
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-500/25 bg-white dark:bg-zinc-900/70">
            <CardHeader className="p-5 pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Every 16,000 km / 12 Months (Or 8,000 km Severe Cold)
              </div>
              <CardTitle className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                Oil Service &amp; Warranty Record-Keeping
              </CardTitle>
              <CardDescription className="text-xs">
                DIY-friendly or independent shop—just document every interval for warranty coverage.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Canadian Cold-Climate Rule:</strong> While Toyota lists 16,000 km (10,000
                  mi) oil intervals, short-trip winter driving and fuel dilution warrant{' '}
                  <strong>8,000 km / 6-month</strong> oil changes on hybrids and turbos.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <FileText className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Keep Dated Receipts &amp; Odometer Logs:</strong> Snap a photo of your oil
                  jug, OEM 90915-YZZN1 filter box, and odometer reading to preserve factory
                  powertrain &amp; hybrid warranty rights.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>12V Auxiliary Battery Check:</strong> Hybrids do not have a traditional
                  alternator—if you drive under 20 minutes/day in winter, hook up a smart 12V
                  maintainer monthly.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 3A: Motor Oil, OEM Filters & Hybrid Intake Care */}
      <section className="space-y-4" aria-labelledby="shelf-fluids-heading">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <Droplets className="h-4 w-4" />
            <span>Shelf A · Fluids &amp; OEM Filters</span>
          </div>
          <h2
            id="shelf-fluids-heading"
            className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            Motor Oil, OEM Filters &amp; Hybrid Intake Care
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
            OEM-spec synthetics, genuine Toyota filters with crush washers, and hybrid battery
            cooling intake protection—routed to {isUS ? 'Amazon.com (US)' : 'Amazon.ca (Canada)'}.
          </p>
        </div>

        <Suspense fallback={<ShelfFallback />}>
          <div
            data-testid="shelf-fluids-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {shelfAItems.map((item) => (
              <GearCard
                key={item.id}
                item={item}
                placement="diy_maintenance_fluids"
                showCheckbox={false}
                buttonLabel="Search on Amazon ↗"
                className="w-full max-w-none"
              />
            ))}
          </div>
        </Suspense>
      </section>

      {/* Section 3B: Paint-Safe Wash & Winter Salt Undercarriage Care */}
      <section className="space-y-4" aria-labelledby="shelf-wash-heading">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-4 w-4" />
              <span>Shelf B · Exterior Wash &amp; Salt Removal</span>
            </div>
            <h2
              id="shelf-wash-heading"
              className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50"
            >
              Paint-Safe Wash &amp; Winter Salt Undercarriage Care
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
              Flush corrosive road brine underneath and wash soft Toyota clear coats swirl-free.
            </p>
          </div>
          <Link
            href="/guides/toyota-first-wash-paint-care"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0"
          >
            <span>Read First-Wash &amp; Paint Care Guide</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <Suspense fallback={<ShelfFallback />}>
          <div
            data-testid="shelf-wash-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {shelfBItems.map((item) => (
              <GearCard
                key={item.id}
                item={item}
                placement="diy_maintenance_wash"
                showCheckbox={false}
                buttonLabel="Search on Amazon ↗"
                className="w-full max-w-none"
              />
            ))}
          </div>
        </Suspense>
      </section>

      {/* Section 3C: SofTex Interior & Touchscreen Preservation */}
      <section className="space-y-4" aria-labelledby="shelf-interior-heading">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            <Armchair className="h-4 w-4" />
            <span>Shelf C · Interior &amp; Cabin Care</span>
          </div>
          <h2
            id="shelf-interior-heading"
            className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            SofTex Interior &amp; Touchscreen Preservation
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
            Keep synthetic leather matte and protect piano-black console bezels and 12.3&quot;–14&quot;
            displays from micro-scratches.
          </p>
        </div>

        <Suspense fallback={<ShelfFallback />}>
          <div
            data-testid="shelf-interior-grid"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {shelfCItems.map((item) => (
              <GearCard
                key={item.id}
                item={item}
                placement="diy_maintenance_interior"
                showCheckbox={false}
                buttonLabel="Search on Amazon ↗"
                className="w-full max-w-none"
              />
            ))}
          </div>
        </Suspense>
      </section>

      {/* Section 3D: Wipers & All-Weather Glass Visibility */}
      <section className="space-y-4" aria-labelledby="shelf-wipers-heading">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <CloudRain className="h-4 w-4" />
            <span>Shelf D · Wipers &amp; Glass Visibility</span>
          </div>
          <h2
            id="shelf-wipers-heading"
            className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            Wipers &amp; All-Weather Glass Visibility
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
            Clear highway sleet and keep Toyota Safety Sense windshield camera zones streak-free.
          </p>
        </div>

        <Suspense fallback={<ShelfFallback />}>
          <div
            data-testid="shelf-wipers-grid"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {shelfDItems.map((item) => (
              <GearCard
                key={item.id}
                item={item}
                placement="diy_maintenance_wipers"
                showCheckbox={false}
                buttonLabel="Search on Amazon ↗"
                className="w-full max-w-none"
              />
            ))}
          </div>
        </Suspense>
      </section>

      {/* Section 3E: Hybrid 12V Battery Maintainers & Seasonal Tire Swap Tools */}
      <section className="space-y-4" aria-labelledby="shelf-battery-tires-heading">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <BatteryCharging className="h-4 w-4" />
              <span>Shelf E · 12V Battery &amp; Seasonal Tire Care</span>
            </div>
            <h2
              id="shelf-battery-tires-heading"
              className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50"
            >
              Hybrid 12V Battery Maintainers &amp; Seasonal Tire Swap Tools
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
              Prevent sub-zero hybrid 12V sleep drain and verify exact 76 ft-lbs lug torque on
              seasonal wheel swaps.
            </p>
          </div>
          <Link
            href="/tires"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline shrink-0"
          >
            <span>Open OEM Tire &amp; Wheel Sizing Guide</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <Suspense fallback={<ShelfFallback />}>
          <div
            data-testid="shelf-battery-tires-grid"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {shelfEItems.map((item) => (
              <GearCard
                key={item.id}
                item={item}
                placement="diy_maintenance_battery_tires"
                showCheckbox={false}
                buttonLabel="Search on Amazon ↗"
                className="w-full max-w-none"
              />
            ))}
          </div>
        </Suspense>
      </section>

      {/* Cross-Links Funnel */}
      <section
        aria-label="Related Toyota Ownership Guides"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <Card className="border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 hover:border-emerald-500/50 transition-colors">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Clear Coat Defense</span>
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                New Toyota First-Wash &amp; Paint Care Guide
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Why to tell your dealer &ldquo;Do Not Wash,&rdquo; swirl-free ONR rinseless
                washing, and $30 DIY ceramic sealants.
              </p>
            </div>
            <Link
              href="/guides/toyota-first-wash-paint-care"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <span>Read First-Wash &amp; Paint Care Guide</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 hover:border-amber-500/50 transition-colors">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Winter &amp; Wheel Fitment</span>
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Toyota OEM Tire Sizing &amp; 17&quot; Downsizing Guide
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Confirmed 5x114.3 / 5x120 bolt patterns, hub bores, and 3PMSF winter tire
                recommendations for all hybrid trims.
              </p>
            </div>
            <Link
              href="/tires"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
            >
              <span>Explore Tire &amp; Wheel Guide</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Frequently Asked Questions */}
      <section className="space-y-4" aria-labelledby="diy-maintenance-faq-heading">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-amber-500" />
          <h2
            id="diy-maintenance-faq-heading"
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
