import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ModComparisonCard } from '@/components/guides/mod-comparison-card';
import {
  Wrench,
  Clock,
  Volume2,
  ArrowLeft,
  DollarSign,
  Layers,
  Video,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Skipping the Wait: Turn Your RAV4 Prime SE into an XSE | ToyotaWaits.ca',
  description:
    'Skip the 12-month XSE queue: How Canadian RAV4 Prime SE buyers upgrade dash speakers, leather seats, and accessories for under $700 CAD without voiding warranty.',
  openGraph: {
    title: 'Skipping the Wait: Turn Your RAV4 Prime SE into an XSE',
    description:
      'The DIY playbook for Canadian buyers tired of waiting 18+ months for an XSE. Get premium sound and leather on an SE for $700 CAD.',
    url: 'https://toyotawaits.ca/guides/rav4-se-mods',
    siteName: 'ToyotaWaits.ca',
    locale: 'en_CA',
    type: 'article',
  },
};

export default function Rav4SeModsGuidePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* Header & Breadcrumb */}
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Wait Times
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-amber-500 text-zinc-950 font-bold gap-1 text-xs hover:bg-amber-400">
            <Wrench className="h-3.5 w-3.5" /> DIY Mod Playbook
          </Badge>
          <Badge variant="outline" className="border-amber-500/30 text-amber-400 text-xs">
            Skip 6–12 Months of Waiting
          </Badge>
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-xs">
            Verified 2019–2026 RAV4 Prime / Hybrid
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          Skipping the Wait: Turn Your RAV4 Prime SE into an XSE
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          Dealer allocation queues for the RAV4 Prime XSE Technology Package remain backed up over a year across Canada. Taking delivery of a base SE trim and installing community-proven acoustic, upholstery, and dashcam upgrades in an afternoon gets you on the road faster while saving thousands of dollars.
        </p>

        {/* Compliant Affiliate Transparency Notice */}
        <div className="inline-flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 border-l-2 border-amber-500/60 pl-3 py-1">
          <ShieldCheck className="h-3.5 w-3.5 text-amber-500 shrink-0" />
          <span>
            Curated enthusiast guide. As an Amazon Associate, toyotawaits.ca earns from qualifying purchases at no extra cost to you.
          </span>
        </div>
      </div>

      {/* 1. The Wait-Time Trade-off */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Clock className="h-5 w-5 text-amber-500" />
          1. The Allocation Reality: SE vs. XSE Wait Times
        </h2>
        <Card className="border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
          <CardContent className="p-6 space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <p>
              In Canadian dealerships (especially across British Columbia, Quebec, and Ontario), Toyota Canada allocates roughly <strong>3 to 4 base SE trims</strong> for every single <strong>XSE Technology Package</strong> that leaves the factory in Japan.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  RAV4 Prime SE Allocation
                </span>
                <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">180 – 240 Days</div>
                <p className="text-xs text-zinc-500">Early allocation batches. Significantly shorter queue.</p>
              </div>
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  RAV4 Prime XSE / Tech
                </span>
                <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">410 – 540+ Days</div>
                <p className="text-xs text-zinc-500">Multi-season marathon. High demand, strict factory quotas.</p>
              </div>
            </div>
            <p className="text-xs italic text-zinc-500">
              By telling your dealer you will accept an SE allocation if one becomes available earlier, Canadian buyers frequently shave 6 to 12 months off their delivery wait time.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 2. Mod 1: The 20-Minute Dash Speaker Swap */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-amber-500" />
          2. The 20-Minute Dash Speaker Swap (Near-JBL Clarity)
        </h2>

        <ModComparisonCard
          stepNumber={1}
          title="JBL Club 3412T Dash Tweeter & Harness Upgrade"
          categoryBadge="Sound & Acoustics"
          icon={Volume2}
          priceEst="~$128 CAD"
          installEffort="20-min Install"
          integration="Direct Harness Tap"
          fitmentBadge="Verified 2019–2026 RAV4"
          whyThisPick="The factory SE sound system uses cheap 2.5-inch paper-cone dash speakers that muffle podcasts and dialogue. High-sensitivity 3.5-inch JBL Club 3412Ts drop right into the factory corner dash sockets and plug directly into custom Red Wolf adapter harnesses—no wire cutting, soldering, or warranty concerns."
          proTip="Use nylon trim pry tools along the outer windshield edge to pop dash grilles straight up without leaving indents on the soft dash vinyl. Point the speaker terminals towards the cabin to avoid interference with the defroster vent ducting."
          factoryIssue="The factory SE sound system relies on tiny 2.5-inch paper-cone dash tweeters that clip early and muffle high-frequency vocal clarity, requiring excessive volume."
          solution="Drop-in 3.5-inch 2-way coaxial JBL Club drivers paired with plug-and-play Toyota adapter harnesses. Delivers concert-grade treble and spacious soundstage without splicing factory wiring."
          steps={[
            'Pry Corner Grilles: Insert a nylon pry tool along the dash corner grilles and gently pop the retaining clips upwards.',
            'Remove Factory Bolts: Remove the two 10mm (or 8mm) bolts holding each factory paper speaker.',
            'Unclip Factory Connector: Disconnect the factory wiring plug from the paper speaker cone.',
            'Attach Harness: Click the Red Wolf / Metra harness into the factory vehicle plug, then slide the spade connectors onto the JBL Club terminals.',
            'Fasten & Snap Down: Re-fasten the two mounting bolts and press the speaker grille flush until clips click home.',
          ]}
          affiliateSlug="jbl-club-dash-speakers"
          ctaLabel="Check Fitment on Amazon.ca ↗"
          affiliateSublabel="JBL Club 3412T 3.5-inch 2-Way Coaxial Pair (~$95 CAD)"
          secondaryActions={[
            {
              slug: 'toyota-speaker-harness',
              label: 'View Exact Part Listing ↗',
              sublabel: 'Red Wolf Plug & Play Harness (~$18 CAD)',
            },
            {
              slug: 'trim-removal-tools',
              label: 'Check Fitment on Amazon.ca ↗',
              sublabel: 'Nylon Dash Pry Tool Set (~$15 CAD)',
            },
          ]}
        />
      </section>

      {/* 3. Mod 2: Custom Leather Upholstery */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Layers className="h-5 w-5 text-amber-500" />
          3. Custom Leather Upholstery: Clazzio &amp; EKR vs. Factory SofTex
        </h2>

        <ModComparisonCard
          stepNumber={2}
          title="Tailored Leather Upholstery: Clazzio or EKR Custom Covers"
          categoryBadge="Interior Upgrade"
          icon={Layers}
          priceEst="~$350–$700 CAD"
          installEffort="1.5-hr Install"
          integration="OEM Factory Look"
          fitmentBadge="Verified 2019–2026 RAV4"
          whyThisPick="Why pay $4,800+ CAD more for the XSE trim just to get SofTex leather? Clazzio (perforated genuine leather inserts) and EKR (4-layer waterproof leatherette) are laser-measured specifically for 5th-gen RAV4 seats. Both feature certified tear-away seams for side-impact airbag deployment."
          proTip="Warm the covers indoors or under sunlight before installation to maximize leatherette flexibility. Sliding a thin plastic grocery bag over headrests helps the snug covers slide on without snagging."
          factoryIssue="Standard SE cloth seats readily soak up winter road salt, coffee spills, and pet hair, whereas factory SofTex requires jumping up to top-tier XSE packages with lengthy wait lists."
          solution="Tailored slip-over leatherette or leather covers laser-scanned to 5th-gen RAV4 seating contours. Includes front and 60/40 rear seats, headrests, and verified side airbag deployment seams."
          steps={[
            'Warm covers indoors before installation to maximize material elasticity and ease stretching.',
            'Slip the bottom cushion cover over the seat base and feed the anchor chucks through the rear cushion crevice.',
            'Pull the lower anchor straps tight underneath the seat frame and secure the industrial hook-and-loop fasteners.',
            'Slide the backrest cover down over the seat upright, verifying the airbag tag aligns with the outer door seam.',
            'Slide custom headrest covers on and tuck the lower seam flap underneath the plastic bezel.',
          ]}
          affiliateSlug="clazzio-leather-covers"
          ctaLabel="View Exact Part Listing ↗"
          affiliateSublabel="Clazzio Genuine Leather / PVC Custom Covers (~$650 CAD)"
          secondaryActions={[
            {
              slug: 'ekr-seat-covers',
              label: 'Check Fitment on Amazon.ca ↗',
              sublabel: 'EKR 4-Layer Waterproof Leatherette (~$350 CAD)',
            },
          ]}
        />
      </section>

      {/* 4. Mod 3: FitcamX OEM Integrated 4K Dashcam */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Video className="h-5 w-5 text-amber-500" />
          4. FitcamX OEM Integrated 4K Dash Camera
        </h2>

        <ModComparisonCard
          stepNumber={3}
          title="FitcamX Integrated OEM-Style 4K Dashcam"
          categoryBadge="Safety & Electronics"
          icon={Video}
          priceEst="~$210 CAD"
          installEffort="15-min Install"
          integration="OEM Factory Look"
          fitmentBadge="Verified 2019–2026 RAV4"
          whyThisPick="FitcamX replaces the factory plastic rearview mirror shroud and taps directly into the Toyota Safety Sense (TSS) camera power harness with zero visible wires, no windshield suction cups, and no fuse box routing through the side curtain airbag."
          proTip="Tuck the pass-through Y-harness flat against the windshield glass before snapping the lower cowl into place. Make sure to format your high-endurance MicroSD card directly in the FitcamX smartphone app."
          factoryIssue="Traditional suction-cup dashcams clutter the windshield view and require tucking 10-foot cables along the A-pillar, where wires can dangerously cross the deployment path of side curtain airbags."
          solution="Custom OEM-matching ABS housing that snaps directly onto the rearview mirror base. Draws clean 12V power from an included plug-and-play pass-through Y-harness tapped into the factory TSS sensor."
          steps={[
            'Pry off the factory two-piece mirror shroud behind the rearview mirror using a nylon pry tool.',
            'Unplug the factory TSS radar or auto-dimming mirror power harness connector.',
            'Insert the FitcamX plug-and-play pass-through Y-splitter harness between the factory vehicle harness and sensor socket.',
            'Connect the camera lead, align the housing clips, and snap the assembly flush onto the mirror base.',
            'Insert a high-endurance MicroSD card and verify live 4K recording angles via the mobile app.',
          ]}
          affiliateSlug="fitcamx-rav4"
          ctaLabel="Check Fitment on Amazon.ca ↗"
          affiliateSublabel="FitcamX 4K Plug & Play TSS Mirror Tap (~$210 CAD)"
          secondaryActions={[
            {
              slug: 'screen-protector-rav4',
              label: 'Check Fitment on Amazon.ca ↗',
              sublabel: 'Anti-Glare 9H Screen Shield (~$22 CAD)',
            },
            {
              slug: 'console-tray-rav4',
              label: 'View Exact Part Listing ↗',
              sublabel: 'Console Divider & Coin Tray (~$20 CAD)',
            },
          ]}
        />
      </section>

      {/* 5. Cost vs. Wait-Time Financial Breakdown */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-emerald-500" />
          5. Cost vs. Wait-Time Financial Breakdown
        </h2>
        <Card className="border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-zinc-100 dark:bg-zinc-900 font-semibold border-b border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                <tr>
                  <th className="py-3 px-4">Feature / Upgrade</th>
                  <th className="py-3 px-4">Factory XSE Package</th>
                  <th className="py-3 px-4">SE + DIY Playbook</th>
                  <th className="py-3 px-4">Your Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60 text-zinc-600 dark:text-zinc-400">
                <tr>
                  <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">Dash &amp; Front Audio</td>
                  <td className="py-3 px-4">Factory JBL (Bundled in XSE)</td>
                  <td className="py-3 px-4">JBL Club 3412T + Harness ($128 CAD)</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">Included in $128</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">Leather / SofTex Seats</td>
                  <td className="py-3 px-4">SofTex (Bundled in XSE)</td>
                  <td className="py-3 px-4">Clazzio / EKR Covers (~$550 CAD)</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">~$550 total</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">Integrated 4K Dashcam</td>
                  <td className="py-3 px-4">Dealer Port Option ($550+ CAD)</td>
                  <td className="py-3 px-4">FitcamX TSS Tap ($210 CAD)</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">$340 CAD saved</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">MSRP Trim Difference</td>
                  <td className="py-3 px-4 text-rose-500 font-bold">+$4,800 to +$8,200 CAD</td>
                  <td className="py-3 px-4 text-emerald-500 font-bold">$888 CAD total parts</td>
                  <td className="py-3 px-4 text-emerald-600 font-extrabold">&gt; $3,900 CAD saved</td>
                </tr>
                <tr className="bg-amber-500/5 dark:bg-amber-950/20">
                  <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">Delivery Wait Time</td>
                  <td className="py-3 px-4 text-amber-500 font-bold">410 – 540 Days</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">180 – 240 Days</td>
                  <td className="py-3 px-4 text-amber-600 dark:text-amber-400 font-extrabold">6 to 12 Months Faster</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Disclaimers & Zero-PII Notice */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 text-xs text-zinc-500 space-y-2 bg-zinc-50 dark:bg-zinc-900/40">
        <div className="flex items-center gap-1.5 font-semibold text-zinc-700 dark:text-zinc-300">
          <ShieldCheck className="h-4 w-4 text-amber-500" />
          Transparency &amp; Disclosures (Canadian Competition Act &amp; FTC)
        </div>
        <p>
          ToyotaWaits.ca participates in privacy-safe affiliate programs. When you follow product links via <code>/out/[slug]</code>, we may earn an affiliate commission at no extra cost to you. We route all outbound clicks through our zero-PII serverless proxy to prevent advertising pixels from tracking your browsing activity.
        </p>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
          As an Amazon Associate, toyotawaits.ca earns from qualifying purchases at no extra cost to you.
        </p>
      </div>

      {/* Back to Estimator CTA */}
      <div className="pt-4 flex items-center justify-between">
        <Button asChild className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold gap-2 cursor-pointer">
          <Link href="/#estimator">
            <Clock className="h-4 w-4" />
            Check Live SE vs XSE Wait Times
          </Link>
        </Button>
        <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
