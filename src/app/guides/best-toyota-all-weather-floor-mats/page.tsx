import React, { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { GuideDisclaimer } from '@/components/common/GuideDisclaimer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { GearCard } from '@/components/gear/GearCard';
import { SeasonalDealBanner } from '@/components/monetization/SeasonalDealBanner';
import {
  Layers,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Car,
  Snowflake,
  ShieldAlert,
  Sliders,
  Sparkles,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const { instant } = { instant: false };

export const metadata: Metadata = {
  title: 'Best Toyota All-Weather Floor Mats (2026): TuxMat vs WeatherTech vs OEM | ToyotaWaits',
  description:
    'Compare TuxMat, WeatherTech, and Toyota OEM rubber mats for Canadian winters. Detailed analysis of dead pedal coverage, slush containment, and multi-row minivan fitment.',
  alternates: {
    canonical: 'https://www.toyotawaits.ca/guides/best-toyota-all-weather-floor-mats',
  },
  openGraph: {
    title: 'Best Toyota All-Weather Floor Mats (2026): TuxMat vs WeatherTech vs OEM | ToyotaWaits',
    description:
      'Compare TuxMat, WeatherTech, and Toyota OEM rubber mats for Canadian winters. Detailed analysis of dead pedal coverage, slush containment, and multi-row minivan fitment.',
    url: 'https://www.toyotawaits.ca/guides/best-toyota-all-weather-floor-mats',
    siteName: 'ToyotaWaits.ca',
    locale: 'en_CA',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Toyota All-Weather Floor Mats (2026): TuxMat vs WeatherTech vs OEM',
    description:
      'Compare TuxMat, WeatherTech, and Toyota OEM rubber mats for Canadian winters. Dead pedal coverage, slush containment, and 3-row minivan fitment.',
  },
};

const comparisonTableData = [
  {
    brand: 'TuxMat Custom-Fit Super-Coverage',
    badge: 'Best Canadian Overall',
    deadPedal: '100% Full Height (Tucks under top trim)',
    lipHeight: 'Ultra-High (8–10" walls enclosing footwell)',
    material: 'Multi-layer padded leatherette / waterproof TPE core',
    containment: 'Superior — Zero salt seepage over edge',
    threeRow: 'Full interlocking 3-row + cargo well coverage',
    priceCad: '$260 – $320 (2-Row) / $360 – $420 (3-Row)',
    highlight: true,
  },
  {
    brand: 'WeatherTech FloorLiner / HP',
    badge: 'Popular Rigid Brand',
    deadPedal: 'Partial (~50% half-pedal coverage)',
    lipHeight: 'Medium-High (1.5–2" molded rigid lip)',
    material: 'HDTE (High-Density Tri-Extruded) rigid polymer',
    containment: 'Moderate — Slush seeps behind left footrest',
    threeRow: 'Available for Sienna & Grand Highlander',
    priceCad: '$280 – $350 (2-Row) / $390 – $460 (3-Row)',
    highlight: false,
  },
  {
    brand: 'Toyota OEM All-Weather Liners',
    badge: 'Factory Dealer Option',
    deadPedal: 'Minimal / 0% (Stops below footrest)',
    lipHeight: 'Low (0.5–1.0" shallow bevel)',
    material: 'Heavy vulcanized molded rubber',
    containment: 'Poor — Brine overflows during freeze-thaw',
    threeRow: 'Standard 3-row set (No sliding track protection)',
    priceCad: '$200 – $280 (Dealer Package Line Item)',
    highlight: false,
  },
  {
    brand: 'Husky Liners WeatherBeater',
    badge: 'Flexible Rubber Alternative',
    deadPedal: 'Moderate (~75% coverage)',
    lipHeight: 'Medium (1.5" formed border)',
    material: 'Rubberized DuraGrip thermoplastic',
    containment: 'Good — Form-fit containment walls',
    threeRow: 'Select models only',
    priceCad: '$230 – $290 (2-Row)',
    highlight: false,
  },
];

const floorMatFaqData = [
  {
    question: 'Why does full dead pedal coverage matter so much in Canadian winters?',
    answer:
      'Your left boot rests on the dead pedal throughout your drive. In winter, this boot is caked with snow, road salt (sodium chloride and calcium chloride), and sand. As your cabin heater warms up, this slush melts immediately. If your floor mat cuts off halfway up the dead pedal (like WeatherTech and factory OEM mats), that salty brine trickles directly behind the liner, soaking the vehicle floorboard and rotting under-carpet electrical harnesses.',
  },
  {
    question: 'Are TuxMat floor liners difficult to clean compared to hard plastic mats?',
    answer:
      'Contrary to impressions from their leatherette finish, TuxMat liners are 100% waterproof. You do not need to remove them for routine cleaning: simply spray with interior detailer or mild soapy water and wipe down with a microfiber towel. For heavy spring cleaning, undo the retention clips, pressure-wash them with a wide nozzle at a car wash, let dry for 10 minutes, and reinstall.',
  },
  {
    question: 'Can all-weather floor mats block the hybrid battery cooling vent in my Toyota?',
    answer:
      'Yes, if using generic universal rubber mats. In the Toyota RAV4, Sienna, Grand Highlander, and Corolla Cross, the high-voltage traction battery cooling fan draws air through a slotted intake grille located beneath the rear seat bench. Universal floor mats can bunch up and cover this vent, causing battery overheating, reduced hybrid efficiency, and DTC trouble codes. Precision custom-fit liners (such as TuxMat) are engineered with laser-cut perimeter clearance around this vent.',
  },
  {
    question: 'How do 3-row liners work with the Toyota Sienna Super Long Slide second-row tracks?',
    answer:
      'The 4th-Gen Sienna features 25 inches of sliding seat track travel. Inexpensive mats bridge over the tracks, requiring you to remove or cut the mat whenever moving second-row seats. Quality 3-row liners feature tailored track cutouts with raised lips that prevent melted snow from spilling down into the aluminum slider tracks while allowing captain chairs to slide unobstructed.',
  },
];

const structuredFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: floorMatFaqData.map((faq) => ({
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
  headline: 'Best Toyota All-Weather Floor Mats (2026): TuxMat vs WeatherTech vs OEM',
  description:
    'Compare TuxMat, WeatherTech, and Toyota OEM rubber mats for Canadian winters. Detailed analysis of dead pedal coverage, slush containment, and multi-row minivan fitment.',
  author: {
    '@type': 'Organization',
    name: 'ToyotaWaits Technical Editorial',
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
  mainEntityOfPage: 'https://www.toyotawaits.ca/guides/best-toyota-all-weather-floor-mats',
};

export default function BestToyotaAllWeatherFloorMatsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* Schema.org JSON-LD Structured Metadata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredFaqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredArticleSchema) }}
      />

      {/* Header & Navigation */}
      <Suspense fallback={null}>
        <SeasonalDealBanner modelName="Toyota All-Weather Liners" />
      </Suspense>
      <div className="space-y-4">
        <BackButton label="← Back to Guides Almanac" fallbackHref="/guides" className="mb-2" />

        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-amber-500 text-zinc-950 font-bold gap-1 text-xs hover:bg-amber-400">
            <Layers className="h-3.5 w-3.5" />
            Winter Protection Guide
          </Badge>
          <Badge variant="outline" className="border-amber-500/30 text-amber-500 dark:text-amber-300 text-xs font-semibold">
            Canadian Road Salt Benchmark
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Head-to-Head Comparison
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          Best Toyota All-Weather Floor Mats (2026): TuxMat vs. WeatherTech vs. OEM
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          Canadian winters are brutal on vehicle interiors. Between rock salt, calcium chloride brine, melting snow, and slush, substandard floor mats will ruin virgin carpeting within a single winter. We compare Canada&apos;s top high-wall floor liner brands across dead pedal protection, sidewall coverage, Sienna sliding tracks, and hybrid battery ventilation.
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
          <strong>FTC &amp; Ad Standards Canada Notice:</strong> toyotawaits.ca participates in verified affiliate programs, including the Amazon Associates Program. If you make a purchase through product search links in this guide, we may earn an affiliate commission at zero additional cost to you. Our recommendations reflect hundreds of hours of Canadian community member reviews across Ontario, Quebec, the Prairies, and British Columbia.
        </p>
      </div>

      {/* Cross-Link Bridges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/guides/toyota-rav4-must-have-accessories"
          className="group p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-amber-500/50 transition-all flex items-center justify-between shadow-2xs"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
              Delivery Day Playbook
            </span>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">
              Top 7 RAV4 Accessories &rarr;
            </h2>
            <p className="text-xs text-zinc-500">
              Explore dashcams, screen protectors, faraday pouches, and console trays.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-zinc-400 group-hover:text-amber-500 transition-transform group-hover:translate-x-1 shrink-0 ml-3" />
        </Link>

        <Link
          href="/delivery-prep"
          className="group p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-sky-500/50 transition-all flex items-center justify-between shadow-2xs"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-500">
              Pre-Delivery Checklist
            </span>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-sky-500 transition-colors">
              Dealership Delivery Prep &rarr;
            </h2>
            <p className="text-xs text-zinc-500">
              25-point inspection guide before signing dealer delivery papers.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-zinc-400 group-hover:text-sky-500 transition-transform group-hover:translate-x-1 shrink-0 ml-3" />
        </Link>
      </div>

      {/* Head-to-Head Comparison Table */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Sliders className="h-5 w-5 text-amber-500" />
            Head-to-Head Comparison: TuxMat vs. WeatherTech vs. OEM
          </h2>
          <p className="text-sm text-zinc-500">
            Real-world performance evaluated against Canadian freeze-thaw slush and calcium chloride salt conditions.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xs bg-white dark:bg-zinc-950">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[700px]">
              <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Brand / Model</th>
                  <th className="py-3.5 px-3">Dead Pedal Coverage</th>
                  <th className="py-3.5 px-3">Sidewall Lip Height</th>
                  <th className="py-3.5 px-3">Material Feel</th>
                  <th className="py-3.5 px-3">Salt/Slush Containment</th>
                  <th className="py-3.5 px-3">3-Row Coverage</th>
                  <th className="py-3.5 px-4 text-right">Est. Price (CAD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {comparisonTableData.map((row, idx) => (
                  <tr
                    key={idx}
                    className={
                      row.highlight
                        ? 'bg-amber-500/5 dark:bg-amber-500/10 font-medium'
                        : 'hover:bg-zinc-50/70 dark:hover:bg-zinc-900/40 transition-colors'
                    }
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-zinc-900 dark:text-zinc-100">
                        {row.brand}
                      </div>
                      <Badge
                        variant={row.highlight ? 'default' : 'outline'}
                        className={`text-[10px] mt-1 ${
                          row.highlight
                            ? 'bg-amber-500 text-zinc-950 font-bold hover:bg-amber-400'
                            : 'text-zinc-500'
                        }`}
                      >
                        {row.badge}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-3 text-zinc-700 dark:text-zinc-300">
                      {row.deadPedal}
                    </td>
                    <td className="py-3.5 px-3 text-zinc-700 dark:text-zinc-300">
                      {row.lipHeight}
                    </td>
                    <td className="py-3.5 px-3 text-zinc-700 dark:text-zinc-300">
                      {row.material}
                    </td>
                    <td className="py-3.5 px-3 text-zinc-700 dark:text-zinc-300">
                      {row.containment}
                    </td>
                    <td className="py-3.5 px-3 text-zinc-700 dark:text-zinc-300">
                      {row.threeRow}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                      {row.priceCad}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section 1: Why OEM Carpet Mats Fail in Canadian Winters */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Snowflake className="h-5 w-5 text-sky-500" />
          1. Why OEM Carpet Mats Fail Catastrophically in Canadian Winters
        </h2>
        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
          <CardContent className="p-6 space-y-4 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <p>
              When taking delivery of a new Toyota in Canada, dealerships often provide standard embroidered carpet floor mats or basic low-lip rubber mats. In Canadian winter conditions, these factory options fail within weeks due to two chemical and physical realities:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 space-y-2 text-xs">
                <h3 className="font-bold text-red-600 dark:text-red-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  Salt-Brine Migration &amp; Wire Corrosion
                </h3>
                <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Municipal road crews spray calcium chloride and liquid brine. Once tracked into the cabin, melted snow saturates carpet mats, soaking down into the vehicle&apos;s underlying polyurethane sound-deadening foam. Because the foam cannot dry during winter, this trapped brine creates a moist, corrosive bath directly over floorpan wiring looms and yaw sensors.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 space-y-2 text-xs">
                <h3 className="font-bold text-amber-600 dark:text-amber-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  Permanent White Crust &amp; Foam Mildew
                </h3>
                <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                  As the moisture evaporates over springtime, calcium salts crystallize into rock-hard white chalk that fuses to carpet fibers. Removing this crust requires intensive hot-water extraction and acid neutralizing rinses that often degrade factory carpet backing and leave permanent musty mildew odors.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 2: TuxMat vs. WeatherTech: The Dead Pedal Breakdown */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Layers className="h-5 w-5 text-amber-500" />
          2. TuxMat vs. WeatherTech: The High-Wall &amp; Dead Pedal Breakdown
        </h2>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 sm:p-7 space-y-5 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed shadow-sm">
          <p>
            WeatherTech and TuxMat represent the two most popular aftermarket choices in Canada. However, their structural engineering approaches differ drastically:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2 text-xs">
              <h3 className="font-bold text-amber-500 uppercase tracking-wider text-sm flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                TuxMat: 100% Dead Pedal &amp; High-Wall Tub
              </h3>
              <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">
                TuxMat was founded in Toronto, Ontario specifically to address Canadian road conditions. TuxMat liners extend all the way up the left dead pedal to the bottom of the dashboard fascia, secured by clips that slide behind factory trim panels.
              </p>
              <ul className="space-y-1 text-zinc-600 dark:text-zinc-300 list-disc list-inside pt-1">
                <li>Zero gap for boot melt to drip behind carpet.</li>
                <li>Padded multi-layer material absorbs road vibration.</li>
                <li>Matches luxury leatherette interiors seamlessly.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 space-y-2 text-xs">
              <h3 className="font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider text-sm flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-zinc-400" />
                WeatherTech: The Half-Pedal Achilles&apos; Heel
              </h3>
              <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                WeatherTech FloorLiners are laser-molded from rigid High-Density Tri-Extruded (HDTE) polymer. While durable in mud, their driver-side mold terminates halfway down the left footrest.
              </p>
              <ul className="space-y-1 text-zinc-600 dark:text-zinc-400 list-disc list-inside pt-1">
                <li>Melting snow from the top of your left boot flows behind the mat.</li>
                <li>Rigid plastic can curl inward at edges after multiple winter seasons.</li>
                <li>Can feel slick underfoot with icy boot soles.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Special Fitment Considerations: Sienna Tracks & Hybrid Vents */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          3. Crucial Fitment Warnings: Sienna Sliding Tracks &amp; Hybrid Battery Vents
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 space-y-3 text-xs shadow-sm">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
              <Car className="h-4 w-4" />
              <span>Sienna Super Long Slide 2nd-Row Tracks</span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
              The 4th-Gen Sienna features 25 inches of captain chair track travel. Generic flat rubber mats will bunch up, jam the slide wheels, or get shredded when passengers adjust the seats. Premium 3-row floor liner kits incorporate precision perimeter channels that seal around the sliding aluminum track rails without restricting smooth seat movement.
            </p>
            <div className="pt-2 text-[11px] text-zinc-500 border-t border-zinc-200 dark:border-zinc-800">
              Pro Tip: Never cut generic floor mats with utility knives over slide tracks; raw edges allow salt water to corrode internal track ball bearings.
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-red-500/30 bg-red-500/5 dark:bg-red-950/10 space-y-3 text-xs shadow-sm">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
              <ShieldAlert className="h-4 w-4" />
              <span>Hybrid Battery Air Intake Vent Clearance</span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
              In Toyota hybrid models (RAV4, Sienna, Grand Highlander, Corolla Cross), the high-voltage traction battery cooling fan draws ambient cabin air through an intake grille located beneath the rear passenger seat cushion. <strong>Never install floor mats that cover or block this vent.</strong> Airflow restriction causes battery thermal throttling, poor fuel economy, and eventual DTC diagnostic trouble codes (P0A7F / P0A80).
            </p>
            <div className="pt-2 text-[11px] text-red-500/80 border-t border-red-500/20">
              Verified OEM-fit liners feature laser-molded perimeter cutouts specifically to leave the battery cooling vent 100% open.
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Dynamic Model-Specific Floor Liner Cards */}
      <section className="space-y-6 pt-4">
        <div className="space-y-1 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Model-Specific Floor Liner Recommendations
            </h2>
          </div>
          <p className="text-sm text-zinc-500">
            Laser-measured, community-verified high-wall all-weather liners for Toyota&apos;s highest-demand Canadian models.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Card 1: RAV4 */}
          <GearCard
            item={{
              id: 'best-floor-mats-rav4',
              slug: 'high-wall-floor-liners-rav4',
              title: 'TuxMat Custom High-Wall Floor Liners (RAV4 2019–2026)',
              brand: 'TuxMat',
              category: 'Floor Protection',
              badge: 'Top Pick · RAV4',
              priceEstCad: '$260 – $320 CAD',
              description: 'Maximum high-wall laser-measured coverage containing snow, salt, mud, and water spills. Full coverage of the left dead pedal.',
              whyBuy: 'Protects the left dead pedal that OEM mats leave bare. Millimeter clearance for the hybrid battery intake grille.',
              searchQuery: 'TuxMat Toyota RAV4 custom all weather floor mats',
              searchKeywordsCA: 'TuxMat Toyota RAV4 custom all weather floor mats',
              searchKeywordsUS: 'TuxMat Toyota RAV4 custom all weather floor mats',
              compatibility: 'RAV4 Hybrid, Prime & Gas (2019-2026)',
              fitment: '2019–2026 RAV4 Direct Fit',
              buttonLabel: 'Search Live Stock on Amazon ↗',
              imageUrl: '/assets/gear/tuxmat-floor-liners.webp',
              fallbackIcon: 'layers',
              models: ['rav4', 'rav4-hybrid', 'rav4-prime'],
              activeModel: 'rav4',
            }}
            placement="guide_floor_mats"
            showCheckbox={false}
            className="w-full"
          />

          {/* Card 2: Sienna */}
          <GearCard
            item={{
              id: 'best-floor-mats-sienna',
              slug: 'sienna-all-weather-liners',
              title: '3-Row All-Weather High-Wall Liners (Sienna 2021–2026)',
              brand: 'TuxMat / Custom Fit',
              category: 'Floor Protection',
              badge: 'Top Pick · Sienna 3-Row',
              priceEstCad: '$360 – $430 CAD',
              description: 'Complete 3-row high-wall liner coverage engineered with precision sliding channels for 7- and 8-passenger Sienna Super Long Slide tracks.',
              whyBuy: 'Maximized spill containment along sliding seat tracks and rear deep well cargo area. Preserves full seat adjustability.',
              searchQuery: 'Toyota Sienna 2021-2026 all weather floor mats liners 7 8 passenger',
              searchKeywordsCA: 'Toyota Sienna 2021-2026 all weather floor mats liners 7 8 passenger',
              searchKeywordsUS: 'Toyota Sienna 2021-2026 all weather floor mats liners 7 8 passenger',
              compatibility: 'Sienna 7-Passenger & 8-Passenger (2021-2026)',
              fitment: 'Sienna 4th-Gen 3-Row Fit',
              buttonLabel: 'Search Live Stock on Amazon ↗',
              imageUrl: '/assets/gear/tuxmat-floor-liners.webp',
              fallbackIcon: 'layers',
              models: ['sienna', 'sienna-hybrid'],
              activeModel: 'sienna',
            }}
            placement="guide_floor_mats"
            showCheckbox={false}
            className="w-full"
          />

          {/* Card 3: Grand Highlander */}
          <GearCard
            item={{
              id: 'best-floor-mats-grand-highlander',
              slug: 'grand-highlander-all-weather-liners',
              title: 'Custom-Fit All-Weather 3-Row Floor Liners (Grand Highlander)',
              brand: 'Custom Fit',
              category: 'Floor Protection',
              badge: 'Top Pick · Grand Highlander',
              priceEstCad: '$340 – $410 CAD',
              description: 'Laser-measured 3-row floor liner and cargo well protection custom-engineered for Grand Highlander captain chairs and bench configurations.',
              whyBuy: 'Full-cabin protection for 3-row family road trips with deep channels for snow melt, muddy sports gear, and grocery spills.',
              searchQuery: 'Toyota Grand Highlander all weather floor mats liners 3 row',
              searchKeywordsCA: 'Toyota Grand Highlander all weather floor mats liners 3 row',
              searchKeywordsUS: 'Toyota Grand Highlander all weather floor mats liners 3 row',
              compatibility: 'Grand Highlander Gas & Hybrid (2024-2026)',
              fitment: 'Grand Highlander 3-Row Fit',
              buttonLabel: 'Search Live Stock on Amazon ↗',
              imageUrl: '/assets/gear/tuxmat-floor-liners.webp',
              fallbackIcon: 'layers',
              models: ['grand-highlander', 'grand-highlander-hybrid'],
              activeModel: 'grand-highlander',
            }}
            placement="guide_floor_mats"
            showCheckbox={false}
            className="w-full"
          />

          {/* Card 4: Corolla Cross */}
          <GearCard
            item={{
              id: 'best-floor-mats-corolla-cross',
              slug: 'corolla-all-weather-liners',
              title: 'Custom-Fit All-Weather Floor Liners (Corolla Cross)',
              brand: 'Custom Fit',
              category: 'Floor Protection',
              badge: 'Top Pick · Corolla Cross',
              priceEstCad: '$220 – $280 CAD',
              description: 'Laser-scanned high-wall floor liners tailored for Toyota Corolla Cross compact SUV footwells and cargo compartment.',
              whyBuy: 'Traps Canadian road grit, mud, and slush with raised perimeter walls while anchoring securely to factory floor twist-locks.',
              searchQuery: 'Toyota Corolla Cross custom fit all weather floor liners',
              searchKeywordsCA: 'Toyota Corolla Cross custom fit all weather floor liners',
              searchKeywordsUS: 'Toyota Corolla Cross custom fit all weather floor liners',
              compatibility: 'Corolla Cross Gas & Hybrid (2022-2026)',
              fitment: 'Corolla Cross Direct Fit',
              buttonLabel: 'Search Live Stock on Amazon ↗',
              imageUrl: '/assets/gear/tuxmat-floor-liners.webp',
              fallbackIcon: 'layers',
              models: ['corolla-cross', 'corolla'],
              activeModel: 'corolla-cross',
            }}
            placement="guide_floor_mats"
            showCheckbox={false}
            className="w-full"
          />
        </div>
      </section>

      {/* Model Hub Cross-Sell Teasers */}
      <section className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          Explore Model Delivery Trackers &amp; Calculators
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/wait-times/rav4"
            className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-amber-500/50 transition-colors block text-xs space-y-1"
          >
            <div className="font-bold text-zinc-900 dark:text-zinc-100">RAV4 Wait Times &rarr;</div>
            <p className="text-zinc-500">Track 2026 delivery queues across Canada.</p>
          </Link>

          <Link
            href="/wait-times/sienna"
            className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-amber-500/50 transition-colors block text-xs space-y-1"
          >
            <div className="font-bold text-zinc-900 dark:text-zinc-100">Sienna Wait Times &rarr;</div>
            <p className="text-zinc-500">Indiana factory allocations and trim timelines.</p>
          </Link>

          <Link
            href="/wait-times/grand-highlander"
            className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-amber-500/50 transition-colors block text-xs space-y-1"
          >
            <div className="font-bold text-zinc-900 dark:text-zinc-100">Grand Highlander Hub &rarr;</div>
            <p className="text-zinc-500">Benchmark wait times and dealer queues.</p>
          </Link>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="space-y-4 pt-4">
        <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-amber-500" />
          Frequently Asked Questions
        </h3>

        <div className="space-y-3">
          {floorMatFaqData.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 sm:p-5 space-y-2 shadow-2xs"
            >
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {faq.question}
              </h4>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Legal & Editorial Disclaimer */}
      <GuideDisclaimer />
    </div>
  );
}
