import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AFFILIATE_LINKS } from '@/lib/affiliate';
import {
  Car,
  Wrench,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronDown,
  ArrowRight,
  Sliders,
  Scale,
  Zap,
  HelpCircle,
  Footprints,
  ShieldAlert,
} from 'lucide-react';

export const revalidate = 3600;

export const metadata: Metadata = {
  title:
    'Toyota Sienna Trailer Hitch Guide (2021-2026) | Torklift vs. Curt & Kick-Sensor Compatibility',
  description:
    'Compare the best Class 3 trailer hitches for the 4th-gen Toyota Sienna hybrid. Learn which models clear driveways, work with hands-free kick sensors, and require zero cutting.',
  alternates: {
    canonical: 'https://www.toyotawaits.ca/guides/toyota-sienna-trailer-hitch-guide',
  },
  openGraph: {
    title:
      'Toyota Sienna Trailer Hitch Guide (2021-2026) | Torklift vs. Curt & Kick-Sensor Compatibility',
    description:
      'Compare the best Class 3 trailer hitches for the 4th-gen Toyota Sienna hybrid. Learn which models clear driveways, work with hands-free kick sensors, and require zero cutting.',
    url: 'https://www.toyotawaits.ca/guides/toyota-sienna-trailer-hitch-guide',
    siteName: 'ToyotaWaits.ca',
    locale: 'en_CA',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Toyota Sienna Trailer Hitch Guide (2021-2026) | Torklift vs. Curt & Kick-Sensor Compatibility',
    description:
      'Compare the best Class 3 trailer hitches for the 4th-gen Toyota Sienna hybrid. Clearance, wiring, and kick sensors explained.',
  },
};

export default function SiennaTrailerHitchGuidePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* Header & Breadcrumbs */}
      <div className="space-y-4">
        <BackButton label="← Back to Guides Almanac" fallbackHref="/guides" className="mb-2" />

        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-amber-500 text-zinc-950 font-bold gap-1 text-xs hover:bg-amber-400">
            <Car className="h-3.5 w-3.5" />
            Sienna Accessory Playbook
          </Badge>
          <Badge variant="outline" className="border-amber-500/30 text-amber-500 dark:text-amber-400 text-xs font-semibold">
            4th Gen Hybrid (2021–2026)
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Class 3 Receivers
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          2021–2026 Toyota Sienna Trailer Hitch &amp; Kick-Sensor Guide
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          Everything Canadian and North American Sienna owners need to know about Class 3 hitches,
          ground clearance scrape risks, trailer wiring harnesses, rear suspension squat, and
          preserving hands-free power tailgate kick sensors.
        </p>
      </div>

      {/* TOP CALLOUT BANNER: FTC & Canadian Ad Standards Compliance */}
      <div
        role="region"
        aria-label="Affiliate and Editorial Transparency Notice"
        className="rounded-2xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/5 p-4 sm:p-5 text-xs text-zinc-700 dark:text-zinc-300 space-y-2 shadow-xs"
      >
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>Affiliate &amp; Community Transparency Disclosure</span>
        </div>
        <p className="leading-relaxed text-[11px] sm:text-xs">
          <strong>FTC &amp; Ad Standards Canada Notice:</strong> toyotawaits.ca participates in
          affiliate partner programs, including the Amazon Associates Program. If you choose to
          purchase through links on this guide, we may earn an affiliate commission at{' '}
          <strong>no additional cost to you</strong>. Our technical recommendations are based strictly
          on real-world owner measurements, frame bolt geometry, and enthusiast community fitment
          testing.
        </p>
      </div>

      {/* QUICK TAKEAWAY / EXECUTIVE SUMMARY */}
      <Card className="border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-lg sm:text-xl font-bold">
              The 30-Second Verdict: Torklift EcoHitch vs. Curt 13470
            </CardTitle>
          </div>
          <CardDescription>
            Choosing the right hitch depends on whether you value ground clearance or installation speed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                  Top Choice: Torklift EcoHitch x7422s
                </span>
                <Badge className="bg-emerald-600 text-white text-[10px]">Best Ground Clearance</Badge>
              </div>
              <p className="text-xs">
                <strong>Why choose it:</strong> The cross-tube is completely hidden behind the bumper
                fascia. It offers ~10.5&quot; to 11&quot; of clearance, virtually eliminating driveway
                and speed-bump scraping. The hands-free kick sensor works reliably (~90%) once the sensor
                wire is slid 2 inches toward the driver&apos;s side.
              </p>
              <div className="pt-2">
                <a
                  href={AFFILIATE_LINKS.TORKLIFT}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:underline"
                >
                  View Torklift EcoHitch x7422s <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100/50 dark:bg-zinc-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                  Budget Alternative: Curt 13470
                </span>
                <Badge variant="outline" className="text-[10px]">100% No-Cut Bolt-On</Badge>
              </div>
              <p className="text-xs">
                <strong>Why choose it:</strong> Retails for roughly half the price of the Torklift and
                bolts directly to the frame without removing the bumper or trimming plastic.
                However, it hangs beneath the bumper with only ~7.5&quot; of clearance, making it prone to
                dragging on steep driveway transitions.
              </p>
              <div className="pt-2">
                <a
                  href={AFFILIATE_LINKS.AMAZON_CURT_HITCH}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-200 hover:underline"
                >
                  View Curt 13470 on Amazon <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* HEAD-TO-HEAD COMPARISON TABLE */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
            <Scale className="h-5 w-5 text-amber-500" />
            Class 3 Hitch Head-to-Head Comparison
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Engineered fitment data for the 4th Generation (2021–2026) Toyota Sienna (FWD &amp; AWD).
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-zinc-100 dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-100 font-semibold border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="p-3.5 sm:p-4">Spec / Feature</th>
                <th className="p-3.5 sm:p-4 bg-amber-500/10 text-amber-900 dark:text-amber-200 font-bold">
                  Torklift EcoHitch x7422s (Top Pick)
                </th>
                <th className="p-3.5 sm:p-4">Curt 13470 (Budget Pick)</th>
                <th className="p-3.5 sm:p-4 text-zinc-500">Toyota OEM (PK960-08R10)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
              <tr>
                <td className="p-3.5 sm:p-4 font-semibold text-zinc-900 dark:text-zinc-100">
                  Receiver Size
                </td>
                <td className="p-3.5 sm:p-4 bg-amber-500/5 font-semibold text-zinc-900 dark:text-zinc-100">
                  2-inch (Class 3)
                </td>
                <td className="p-3.5 sm:p-4">2-inch (Class 3)</td>
                <td className="p-3.5 sm:p-4 text-zinc-500">2-inch (Class 3)</td>
              </tr>
              <tr>
                <td className="p-3.5 sm:p-4 font-semibold text-zinc-900 dark:text-zinc-100">
                  Cross-Tube Design
                </td>
                <td className="p-3.5 sm:p-4 bg-amber-500/5">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>Hidden behind bumper cover</span>
                  </div>
                </td>
                <td className="p-3.5 sm:p-4">
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    <span>Exposed under bumper</span>
                  </div>
                </td>
                <td className="p-3.5 sm:p-4 text-zinc-500">Integrated bumper cutout</td>
              </tr>
              <tr>
                <td className="p-3.5 sm:p-4 font-semibold text-zinc-900 dark:text-zinc-100">
                  Ground Clearance
                </td>
                <td className="p-3.5 sm:p-4 bg-amber-500/5 font-bold text-emerald-600 dark:text-emerald-400">
                  ~10.5&quot; to 11.0&quot; (Zero scraping)
                </td>
                <td className="p-3.5 sm:p-4 text-rose-600 dark:text-rose-400 font-medium">
                  ~7.5&quot; to 8.0&quot; (Scrapes on steep inclines)
                </td>
                <td className="p-3.5 sm:p-4 text-zinc-500">~10.0&quot;</td>
              </tr>
              <tr>
                <td className="p-3.5 sm:p-4 font-semibold text-zinc-900 dark:text-zinc-100">
                  Bumper Modifications
                </td>
                <td className="p-3.5 sm:p-4 bg-amber-500/5">
                  Trim underside splash pan (hidden from view)
                </td>
                <td className="p-3.5 sm:p-4 font-semibold text-emerald-600 dark:text-emerald-400">
                  Zero cutting (100% bolt-on)
                </td>
                <td className="p-3.5 sm:p-4 text-zinc-500">Requires bumper fascia cut template</td>
              </tr>
              <tr>
                <td className="p-3.5 sm:p-4 font-semibold text-zinc-900 dark:text-zinc-100">
                  Kick-Sensor Compatibility
                </td>
                <td className="p-3.5 sm:p-4 bg-amber-500/5">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Works (~90% reliability)
                  </span>
                  <span className="block text-[11px] text-zinc-500">
                    After sliding sensor bracket 2&quot; left
                  </span>
                </td>
                <td className="p-3.5 sm:p-4">
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    Reduced (~60% reliability)
                  </span>
                  <span className="block text-[11px] text-zinc-500">
                    Tube blocks standard foot arc
                  </span>
                </td>
                <td className="p-3.5 sm:p-4 text-zinc-500">
                  Factory sensor relocation kit included
                </td>
              </tr>
              <tr>
                <td className="p-3.5 sm:p-4 font-semibold text-zinc-900 dark:text-zinc-100">
                  Vehicle Tow Capacity
                </td>
                <td className="p-3.5 sm:p-4 bg-amber-500/5 font-semibold">
                  3,500 lbs trailer / 350 lbs tongue
                </td>
                <td className="p-3.5 sm:p-4 font-semibold">
                  3,500 lbs trailer / 350 lbs tongue
                </td>
                <td className="p-3.5 sm:p-4 text-zinc-500">
                  3,500 lbs trailer / 350 lbs tongue
                </td>
              </tr>
              <tr>
                <td className="p-3.5 sm:p-4 font-semibold text-zinc-900 dark:text-zinc-100">
                  Installation Difficulty
                </td>
                <td className="p-3.5 sm:p-4 bg-amber-500/5">
                  Moderate (Remove bumper fascia, ~2.5 hrs)
                </td>
                <td className="p-3.5 sm:p-4">Easy (Direct bolt-on, ~45-60 min)</td>
                <td className="p-3.5 sm:p-4 text-zinc-500">High (Dealer installation advised)</td>
              </tr>
              <tr>
                <td className="p-3.5 sm:p-4 font-semibold text-zinc-900 dark:text-zinc-100">
                  Approximate Price
                </td>
                <td className="p-3.5 sm:p-4 bg-amber-500/5 font-bold text-zinc-900 dark:text-zinc-100">
                  ~$495–$540 USD (~$695 CAD)
                </td>
                <td className="p-3.5 sm:p-4 font-bold text-zinc-900 dark:text-zinc-100">
                  ~$220–$260 USD (~$320 CAD)
                </td>
                <td className="p-3.5 sm:p-4 text-zinc-500">~$750+ CAD (Plus dealer labor)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 1: TORKLIFT ECOHITCH DEEP DIVE */}
      <section className="space-y-6 border-t border-zinc-200 dark:border-zinc-800 pt-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-600 text-white text-xs">Community Champion</Badge>
            <span className="text-xs text-zinc-500 font-mono">Part # x7422s / x7422</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
            Torklift EcoHitch: The Definitive 2-Inch Receiver
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Why 9 out of 10 minivan forum owners recommend the hidden crossbar EcoHitch over any other receiver.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-zinc-200 dark:border-zinc-800 p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase">
              <CheckCircle2 className="h-4 w-4" />
              <span>Ground Clearance</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">
              The 4th-gen Sienna has a long rear overhang. The EcoHitch tucks its entire main crossbar
              behind the factory bumper, keeping the receiver collar nestled immediately below the
              valance at <strong>~10.75 inches above ground level</strong>.
            </p>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800 p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase">
              <CheckCircle2 className="h-4 w-4" />
              <span>Invisible Trimming</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">
              Unlike the dealer hitch which slices into the painted rear bumper face, the Torklift
              only requires a small rectangular cut into the black plastic splash shield underneath
              the van. From standing height, it looks 100% factory.
            </p>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800 p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase">
              <CheckCircle2 className="h-4 w-4" />
              <span>Heavy Bike Racks</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">
              Ideal for 4-bike tray carriers (1UP USA, Kuat Piston Pro, Thule T2 Pro). The higher
              collar prevents the rear bikes from dragging when navigating speed tables or steep gas
              station curb transitions.
            </p>
          </Card>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="font-bold text-sm text-zinc-950 dark:text-zinc-50">
              Torklift EcoHitch 2&quot; Receiver (x7422s)
            </div>
            <p className="text-xs text-zinc-500">
              Made in USA, precision laser cut, high-impact powder coat finish.
            </p>
          </div>
          <a
            href={AFFILIATE_LINKS.TORKLIFT}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs shadow-sm transition-all shrink-0"
          >
            Check Torklift EcoHitch Availability <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>

      {/* SECTION 2: CURT 13470 DEEP DIVE */}
      <section className="space-y-6 border-t border-zinc-200 dark:border-zinc-800 pt-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">Budget DIY Hero</Badge>
            <span className="text-xs text-zinc-500 font-mono">Part # 13470</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
            Curt 13470: The Fast Bolt-On Alternative
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            How it performs, when it makes sense, and what trade-offs you must accept.
          </p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <p>
            The <strong>Curt 13470</strong> is a popular choice for minivan owners who want an affordable,
            rock-solid receiver without taking apart their brand-new vehicle. You do not need to unclip
            the rear bumper, disconnect wiring harnesses, or use utility shears. Two people with a
            torque wrench and a jack stand can mount the Curt hitch in approximately 45 minutes.
          </p>

          <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/10 space-y-2">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Important Ground Clearance Caution</span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
              Because the Curt 13470 cross-tube is positioned below the rear bumper, its lowest point
              sits at just <strong>~7.5 inches of ground clearance</strong> on standard suspension.
              When carrying 4 passengers and road trip cargo, the rear squats, dropping clearance
              closer to 6.5 inches. If your daily route includes steep driveway curbs, ferry boarding ramps,
              or rutted cottage gravel roads, the bottom flange will occasionally drag.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="font-bold text-sm text-zinc-950 dark:text-zinc-50">
              Curt 13470 Class 3 Trailer Hitch (2-Inch)
            </div>
            <p className="text-xs text-zinc-500">
              100% no-cut bolt-on installation, dual-coat anti-rust liquid Bonderite finish.
            </p>
          </div>
          <a
            href={AFFILIATE_LINKS.AMAZON_CURT_HITCH}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 font-bold text-xs shadow-sm transition-all shrink-0"
          >
            Check Curt 13470 on Amazon <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>

      {/* SECTION 3: WIRING HARNESSES & HYBRID BATTERY ADVANTAGE */}
      <section className="space-y-6 border-t border-zinc-200 dark:border-zinc-800 pt-8">
        <div className="space-y-2">
          <Badge className="bg-blue-600 text-white text-xs">Electrical &amp; Lighting</Badge>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
            Trailer Wiring: Curt 56456 vs. Tekonsha 118844
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Plug-and-play 4-flat trailer light kits and the huge wiring advantage of the Sienna Hybrid platform.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/10 space-y-2">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
            <Zap className="h-4 w-4 shrink-0" />
            <span>The Sienna Hybrid 12V Battery Superpower</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            In standard gasoline SUVs, installing a powered converter harness is notoriously painful
            because you have to fish a hot 12V power wire under the vehicle all the way to the front
            engine compartment. <strong>On the 2021+ Toyota Sienna Hybrid, the 12V auxiliary AGM battery
            is located right inside the rear passenger-side quarter panel!</strong> You only need to run
            the power lead about 18 inches to connect directly to the 12V terminal, saving you over an
            hour of frustrating underbody routing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold">Curt 56456 Custom Harness</CardTitle>
                <Badge variant="outline" className="text-xs">4-Flat Connector</Badge>
              </div>
              <CardDescription className="text-xs">
                Direct plug-and-play T-connector for Sienna tail light plugs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300">
              <ul className="space-y-1.5 list-disc pl-4">
                <li>No wire cutting or splicing into factory CAN-bus wiring.</li>
                <li>Surface mount technology (SMT) converter module prevents trailer shorts.</li>
                <li>Rubber dust cap protects the 4-pin connector from road salt and moisture.</li>
              </ul>
              <div className="pt-2">
                <a
                  href={AFFILIATE_LINKS.AMAZON_WIRING}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="inline-flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400 hover:underline"
                >
                  View Curt 56456 Harness <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold">Tekonsha 118844 T-One</CardTitle>
                <Badge variant="outline" className="text-xs">T-One Connector</Badge>
              </div>
              <CardDescription className="text-xs">
                Heavy-duty commercial grade circuit-protected module.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300">
              <ul className="space-y-1.5 list-disc pl-4">
                <li>Potted electronics provide maximum vibration and winter salt resistance.</li>
                <li>OEM connector fitment ensures sealed, weather-tight connections.</li>
                <li>Rated for 4.2 amps on turn/brake circuits and 7.5 amps on taillights.</li>
              </ul>
              <div className="pt-2">
                <a
                  href={AFFILIATE_LINKS.TEKONSHA_WIRING}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="inline-flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400 hover:underline"
                >
                  View Tekonsha 118844 Harness <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 7-Pin & Brake Controller Callout */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 space-y-2">
          <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Sliders className="h-4 w-4 text-amber-500" />
            Towing Pop-Up Campers or Travel Trailers Over 1,500 Lbs?
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Most Canadian provinces and US states require electric trailer brakes on trailers exceeding
            1,500 to 2,000 lbs. If you need 7-way blade power with trailer brake actuation, avoid
            ripping apart your Sienna&apos;s dashboard to install a traditional controller. Instead, pair
            your 4-flat harness with a wireless proportional controller like the{' '}
            <a
              href={AFFILIATE_LINKS.BRAKE_CONTROLLER}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              className="text-amber-600 dark:text-amber-400 font-semibold underline hover:text-amber-500"
            >
              Curt Echo Mobile Brake Controller (#51180)
            </a>
            , which connects between the plug and your smartphone via Bluetooth with zero cabin wiring.
          </p>
        </div>
      </section>

      {/* SECTION 4: KICK SENSOR COMPATIBILITY & OPTIMIZATION */}
      <section className="space-y-6 border-t border-zinc-200 dark:border-zinc-800 pt-8">
        <div className="space-y-2">
          <Badge className="bg-purple-600 text-white text-xs">Sensors &amp; Convenience</Badge>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
            <Footprints className="h-6 w-6 text-purple-500" />
            Hands-Free Kick Sensor Mastery
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            How the rear bumper antenna works, how to reposition it, and how to prevent false triggers with bike racks.
          </p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <p>
            Higher Sienna trims (XLE, XSE, Limited, Platinum) come equipped with hands-free dual
            capacitive kick sensors running across the center of the rear bumper. When you kick forward
            under the rear valance, the capacitance change signals the Power Back Door (PBD) ECU to open
            the tailgate.
          </p>

          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-zinc-950 dark:text-zinc-50">
                How to Relocate the Kick Sensor for 90% Success (Torklift EcoHitch)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <ol className="space-y-2 list-decimal pl-4">
                <li>
                  <strong>Unclip the central sensor antenna:</strong> When the rear bumper fascia is removed,
                  locate the plastic bracket channel holding the two antenna wires along the center bottom lip.
                </li>
                <li>
                  <strong>Slide bracket 2 to 3 inches toward the driver side:</strong> Unclip the center
                  retainers and slide the plastic channel bracket slightly to the left (driver&apos;s side) of
                  where the 2-inch hitch collar passes through.
                </li>
                <li>
                  <strong>Fasten with UV-rated zip ties:</strong> Secure the shifted bracket to the inner bumper
                  ribbing so it cannot vibrate or shift loose.
                </li>
                <li>
                  <strong>The New Kick Target:</strong> To open your tailgate hands-free, simply kick straight
                  under the rear bumper <strong>3 inches to the left of the hitch receiver</strong> (directly
                  beneath the left bumper reflector). It works consistently with armfuls of groceries!
                </li>
              </ol>
            </CardContent>
          </Card>

          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 space-y-2">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Crucial Tip: Disable the Kick Sensor When Carrying Bike Racks!</span>
            </div>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
              When a bike rack or cargo carrier is installed in your hitch, dangling bike cables,
              pedals, or high-pressure car wash sprays can accidentally trigger the kick sensor, causing
              the motorized liftgate to smash open against your bicycles!
            </p>
            <div className="pt-1 text-xs">
              <strong>How to toggle it off in 10 seconds via steering wheel controls:</strong>
              <div className="mt-1 font-mono text-[11px] bg-zinc-900 text-zinc-200 p-2.5 rounded-md">
                MID Screen → Settings (Gear Icon) → Vehicle Settings (Hold OK) → PBD → Kick Sensor → OFF
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: TOW LIMITS & PREVENTING MINIVAN SAG */}
      <section className="space-y-6 border-t border-zinc-200 dark:border-zinc-800 pt-8">
        <div className="space-y-2">
          <Badge className="bg-red-600 text-white text-xs">Safety &amp; Physics</Badge>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
            Towing Limits &amp; Solving Rear Suspension Squat
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Understanding tongue weight limits and why helper air springs are essential for loaded road trips.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-zinc-200 dark:border-zinc-800 p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100 text-sm">
              <Scale className="h-4 w-4 text-red-600" />
              Factory Towing Capacity: 3,500 Lbs (1,587 kg)
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Every 2021–2026 Sienna is rated for a maximum trailer weight of 3,500 lbs when equipped with
              trailer brakes. Never exceed 3,500 lbs gross trailer weight regardless of whether your hitch
              is stamped for 5,000 lbs.
            </p>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800 p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100 text-sm">
              <Scale className="h-4 w-4 text-red-600" />
              Maximum Tongue Weight: 350 Lbs (158 kg)
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Standard automotive safety guidelines dictate 10% tongue weight. A 350 lb downward force on
              the hitch collar counts directly against your vehicle&apos;s Gross Vehicle Weight Rating (GVWR)
              and occupant payload.
            </p>
          </Card>
        </div>

        {/* The Air Lift 1000 Solution */}
        <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="font-bold text-sm sm:text-base text-zinc-950 dark:text-zinc-50">
              The #1 Minivan Mod: Air Lift 1000 Helper Springs (Kit #60860)
            </div>
            <Badge className="bg-amber-500 text-zinc-950 font-bold text-xs">Cures Rear Sag</Badge>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            The Sienna&apos;s factory coil springs are tuned soft for plush road compliance. When you mount
            a 4-bike tray rack (~160 lbs) or a trailer with 300 lbs of tongue weight, plus luggage in the
            deep trunk cavity, the rear squats 1.5 to 2.5 inches. This points your LED headlights into the
            eyes of oncoming drivers, lightens the front steering tires, and increases the likelihood of
            scraping on driveways.
          </p>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Installing <strong>Air Lift 1000 in-coil air cylinders</strong> inside the rear coil springs
            allows you to add 5 to 35 PSI with a standard bicycle hand pump, leveling the van perfectly and
            restoring firm, stable highway composure.
          </p>
          <div className="pt-1 flex flex-wrap items-center gap-4">
            <a
              href={AFFILIATE_LINKS.AIR_LIFT_1000}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              className="inline-flex items-center gap-1.5 font-bold text-xs text-amber-600 dark:text-amber-400 hover:underline"
            >
              View Air Lift 1000 Kit 60860 <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href={AFFILIATE_LINKS.ANTI_RATTLE_CLAMP}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              className="inline-flex items-center gap-1.5 font-bold text-xs text-zinc-700 dark:text-zinc-300 hover:underline"
            >
              Heavy-Duty Anti-Rattle Hitch Clamp <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 6: INSTALLATION TOOL CHECKLIST */}
      <section className="space-y-4 border-t border-zinc-200 dark:border-zinc-800 pt-8">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
          <Wrench className="h-5 w-5 text-amber-500" />
          Recommended DIY Tools &amp; Hardware
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-600 dark:text-zinc-300">
          <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Torque Wrench capable of 80–110 ft-lbs</span>
          </div>
          <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>10mm, 12mm, 17mm &amp; 19mm Deep Sockets</span>
          </div>
          <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Nylon Automotive Trim Removal Pry Tool Kit</span>
          </div>
          <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Exhaust Hanger Removal Pliers or Silicone Spray</span>
          </div>
          <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Floor Jack &amp; 2 Jack Stands (for rear axle safety)</span>
          </div>
          <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Utility knife or shears (for plastic undertray trim)</span>
          </div>
        </div>
      </section>

      {/* BOTTOM ACCORDION / COLLAPSIBLE CALLOUT NOTICES & STATUTORY DISCLAIMERS */}
      <section className="space-y-3 border-t border-zinc-200 dark:border-zinc-800 pt-8" aria-label="Legal Disclaimers and Notices">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Regulatory, Safety &amp; Warranty Notices
        </h3>

        {/* Notice 1: Statutory Affiliate Disclosure */}
        <details className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 p-4 transition-all">
          <summary className="flex items-center justify-between cursor-pointer font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 list-none">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-amber-500" />
              <span>1. Complete FTC &amp; Ad Standards Canada Affiliate Disclosure</span>
            </div>
            <ChevronDown className="h-4 w-4 text-zinc-400 group-open:rotate-180 transition-transform" />
          </summary>
          <div className="mt-3 text-xs text-zinc-600 dark:text-zinc-400 space-y-2 leading-relaxed border-t border-zinc-200 dark:border-zinc-800/80 pt-3">
            <p>
              toyotawaits.ca participates in the Amazon Services LLC Associates Program, an affiliate
              advertising program designed to provide a means for sites to earn advertising fees by
              advertising and linking to Amazon.ca and Amazon.com. We may also participate in independent
              affiliate agreements with manufacturers such as Torklift Central.
            </p>
            <p>
              Purchasing via these links does not alter the purchase price you pay. Commissions earned
              support our hosting infrastructure, crowdsourced wait-time tracking platform, and independent
              editorial test evaluations.
            </p>
          </div>
        </details>

        {/* Notice 2: Non-Affiliation Notice */}
        <details className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 p-4 transition-all">
          <summary className="flex items-center justify-between cursor-pointer font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 list-none">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-zinc-500" />
              <span>2. Non-Affiliation Notice &amp; Nominative Fair Use</span>
            </div>
            <ChevronDown className="h-4 w-4 text-zinc-400 group-open:rotate-180 transition-transform" />
          </summary>
          <div className="mt-3 text-xs text-zinc-600 dark:text-zinc-400 space-y-2 leading-relaxed border-t border-zinc-200 dark:border-zinc-800/80 pt-3">
            <p>
              toyotawaits.ca is an independent consumer community and is NOT affiliated with, sponsored by,
              authorized by, or endorsed by Toyota Motor Corporation, Toyota Canada Inc., or Toyota Motor
              Sales, U.S.A., Inc.
            </p>
            <p>
              The names &ldquo;Toyota&rdquo;, &ldquo;Sienna&rdquo;, &ldquo;TNGA-K&rdquo;, &ldquo;PBD&rdquo;,
              and related trademarks or model designations are the registered property of their respective
              trademark holders and are referenced strictly for nominative product identification and
              fitment verification under fair use.
            </p>
          </div>
        </details>

        {/* Notice 3: DIY Safety & Warranty Notice */}
        <details className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 p-4 transition-all">
          <summary className="flex items-center justify-between cursor-pointer font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 list-none">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span>3. DIY Installation Safety &amp; Factory Warranty Advisory</span>
            </div>
            <ChevronDown className="h-4 w-4 text-zinc-400 group-open:rotate-180 transition-transform" />
          </summary>
          <div className="mt-3 text-xs text-zinc-600 dark:text-zinc-400 space-y-2 leading-relaxed border-t border-zinc-200 dark:border-zinc-800/80 pt-3">
            <p>
              Vehicle towing, hitch installation, and electrical wiring involve physical risk. Always
              support the vehicle on certified jack stands rated for the vehicle weight—never rely solely
              on a hydraulic floor jack. Torque all fasteners to the manufacturer&apos;s specified values
              and re-torque after the first 500 miles (800 km) of towing.
            </p>
            <p>
              Under the U.S. Magnuson-Moss Warranty Act and Canadian provincial consumer protection
              statutes, installing aftermarket parts does not automatically void your vehicle warranty
              unless the aftermarket component or improper installation directly caused damage to a
              factory component. Always refer to your vehicle owner&apos;s manual for official towing
              limitations and guidelines.
            </p>
          </div>
        </details>
      </section>

      {/* FOOTER CTA & INTERNAL NAVIGATION */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-zinc-50 to-amber-50/30 dark:from-zinc-900 dark:to-amber-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="font-bold text-base text-zinc-950 dark:text-zinc-50">
            Still Waiting on Your Sienna Factory Delivery?
          </div>
          <p className="text-xs text-zinc-500">
            Track real Canadian dealer allocation timelines and delivery dates submitted by verified buyers.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/sienna"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-900 dark:text-zinc-100 transition-colors"
          >
            Sienna Wait Times
          </Link>
          <Link
            href="/guides/sienna-mods"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-zinc-950 text-xs font-bold transition-colors"
          >
            More Sienna Mods <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
