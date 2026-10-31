import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { GuideDisclaimer } from '@/components/common/GuideDisclaimer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ModComparisonCard } from '@/components/guides/mod-comparison-card';
import { GearCard } from '@/components/gear/GearCard';
import {
  Wrench,
  Clock,
  Volume2,
  DollarSign,
  Layers,
  Video,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  AlertCircle,
  Zap,
} from 'lucide-react';

export const revalidate = 60;

export function generateMetadata(): Metadata {
  const currentDate = new Date();
  const currentMonthYear = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  return {
    title: `Skipping the Wait: Turn Your RAV4 Prime SE into an XSE (Updated ${currentMonthYear}) | ToyotaWaits.ca`,
    description:
      `Skip the 12-month XSE queue: How Canadian RAV4 Prime SE buyers upgrade dash speakers, leather seats, and accessories for under $700 CAD (Updated ${currentMonthYear}).`,
    alternates: {
      canonical: 'https://www.toyotawaits.ca/guides/rav4-se-mods',
    },
    openGraph: {
      title: `Skipping the Wait: Turn Your RAV4 Prime SE into an XSE (Updated ${currentMonthYear})`,
      description:
        'The DIY playbook for Canadian buyers tired of waiting 18+ months for an XSE. Get premium sound and leather on an SE for $700 CAD.',
      url: 'https://www.toyotawaits.ca/guides/rav4-se-mods',
      siteName: 'ToyotaWaits.ca',
      locale: 'en_CA',
      type: 'article',
    },
  };
}

export default function Rav4SeModsGuidePage() {
  const currentDate = new Date();
  const currentMonthYear = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* Header & Breadcrumb */}
      <div className="space-y-4">
        <BackButton className="mb-4" />

        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-amber-500 text-zinc-950 font-bold gap-1 text-xs hover:bg-amber-400">
            <Wrench className="h-3.5 w-3.5" /> DIY Mod Playbook
          </Badge>
          <Badge variant="outline" className="border-amber-500/30 text-amber-400 text-xs">
            Skip 6–12 Months of Waiting
          </Badge>
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-xs">
            Verified: 2019–2025 | 2026: Pending Validation
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          Skipping the Wait: Turn Your RAV4 Prime SE into an XSE (Updated {currentMonthYear})
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

      {/* Stage 1.5: Cabin Ergonomics & Long-Distance Comfort */}
      <section className="space-y-6" id="cabin-ergonomics">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold">
              Stage 1.5 Ergonomics &amp; Comfort
            </Badge>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-xs">
              Under $35 CAD • Direct DIY Fit
            </Badge>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-amber-500 shrink-0" />
            Cabin Ergonomics &amp; Long-Distance Comfort (Stage 1.5)
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Community feedback from long-distance Canadian RAV4 drivers identifies two major daily ergonomics pain points on extended highway trips:
          </p>
        </div>

        {/* The Problem Callout Card */}
        <Card className="border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20">
          <CardContent className="p-5 sm:p-6 space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
              The Problem: Hard Plastics &amp; Elbow Fatigue
            </h3>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 italic leading-relaxed">
              &ldquo;The 5th-generation RAV4 cockpit features firm plastics right where the driver&apos;s right leg rests against the center stack tunnel, coupled with a firm factory armrest that quickly wears under daily commuting.&rdquo;
            </p>
          </CardContent>
        </Card>

        {/* The Quick Fixes Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
              Fix 1: Console Armrest Sleeve
            </span>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              0.5&quot; Memory Foam Padding &amp; Stitching Protection
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Slip-on padded covers are preferred over full lid replacements because they preserve original factory stitching, add approximately 0.5&quot; of plush memory foam cushioning to relieve forearm fatigue, and shield the factory vinyl from sunscreen oils, sweat, and dog paws.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
              Fix 2: Tunnel Knee Pad Cushion
            </span>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Eliminate Highway Right-Knee Soreness
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Extended highway driving creates a notorious contact pressure point where the driver&apos;s right knee braces against the rigid console tunnel plastic. Low-profile self-adhesive leather knee cushions cushion this contact zone completely without interfering with seatbelts, cup holders, or passenger legroom.
            </p>
          </div>
        </div>

        {/* Featured Muslogy Authorized Upgrades */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
              <span>Partner Spotlight: Muslogy Direct-Fit Cabin Solutions</span>
            </h3>
            <span className="text-[11px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              Exclusive 2% Off • Code: Toyotawaits
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GearCard
              item={{
                id: 'muslogy-armrest-cover',
                slug: 'muslogy-armrest-cover',
                title: 'Muslogy Custom-Fit Padded Center Console Armrest Cover',
                category: 'comfort',
                brand: 'Muslogy',
                destinationType: 'direct_partner',
                discountCode: 'Toyotawaits',
                discountText: '2% off',
                badge: 'Partner Deal · 2% Off',
                priceEstCad: '$24 – $32 CAD',
                description: 'Ergonomic soft memory-foam padded leatherette console cover that relieves arm fatigue and protects factory upholstery without replacing the lid.',
                whyBuy: 'Solves hard OEM armrest fatigue on multi-hour road trips without replacing the lid. Verified direct fit for 2019-2026 RAV4.',
                buttonLabel: 'Get 2% Off on Muslogy ↗',
                destinationUrl: '/out/muslogy-armrest-cover',
                imageUrl: '/assets/gear/muslogy-armrest-cover.webp',
                models: ['rav4', 'rav4-hybrid', 'rav4-prime', 'universal'],
                activeModel: 'rav4',
              }}
              placement="guide_rav4_mods"
              showCheckbox={false}
              className="w-full max-w-none"
            />
            <GearCard
              item={{
                id: 'muslogy-rav4-organizer',
                slug: 'muslogy-rav4',
                title: 'Muslogy Dual-Tier Drop-In Organizer Tray (RAV4)',
                category: 'comfort',
                brand: 'Muslogy',
                destinationType: 'direct_partner',
                discountCode: 'Toyotawaits',
                discountText: '2% off',
                badge: 'Partner Deal · 2% Off',
                priceEstCad: '$22 – $28 CAD',
                description: 'Precision OEM-fit dual-tier drop-in tray that organizes the deep, disorganized factory console bin with anti-slip silicone pads.',
                whyBuy: 'Divides the deep, disorganized factory console bin into accessible dual tiers with dedicated coin and phone slots.',
                buttonLabel: 'Get 2% Off on Muslogy ↗',
                destinationUrl: '/out/muslogy-rav4',
                imageUrl: '/assets/gear/muslogy-rav4-organizer.webp',
                models: ['rav4', 'rav4-hybrid', 'rav4-prime', 'universal'],
                activeModel: 'rav4',
              }}
              placement="guide_rav4_mods"
              showCheckbox={false}
              className="w-full max-w-none"
            />
          </div>
        </div>

        {/* Embedded Gear Cards with Direct "Check Price ↗" buttons */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Recommended Ergonomic Gear (Stage 1.5)
            </h3>
            <span className="text-[11px] text-zinc-500">
              Verified OEM Fit: 2019–2026 RAV4 / Hybrid / Prime
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GearCard
              item={{
                id: 'rav4-padded-armrest-cover',
                slug: 'rav4-padded-armrest-cover',
                title: 'Custom-Fit Padded Center Console Armrest Cover',
                category: 'comfort',
                badge: 'Long-Drive Pick',
                priceEstCad: '$24 – $32 CAD',
                description: 'Soft memory-foam padded neoprene/leatherette slip cover that relieves forearm fatigue on long trips and protects the factory armrest from sweat, pets, and wear.',
                whyBuy: 'Preserves OEM stitching, adds ~0.5" memory foam cushioning, and shields the lid from sunscreen, sweat, and dog paws.',
                buttonLabel: 'Check Price ↗',
                models: ['rav4', 'rav4-hybrid', 'rav4-prime', 'universal'],
                activeModel: 'rav4',
              }}
              placement="guide_rav4_mods"
              showCheckbox={false}
              className="w-full max-w-none"
            />
            <GearCard
              item={{
                id: 'lateral-console-knee-cushion',
                slug: 'lateral-console-knee-cushion',
                title: 'Driver Side Console Edge Leather Knee Cushion',
                category: 'comfort',
                badge: 'Road Trip Essential',
                priceEstCad: '$14 – $19 CAD',
                description: 'Stops right knee soreness.',
                whyBuy: 'Stops right knee soreness.',
                buttonLabel: 'Check Price ↗',
                models: ['rav4', 'rav4-hybrid', 'rav4-prime', 'universal'],
                activeModel: 'rav4',
              }}
              placement="guide_rav4_mods"
              showCheckbox={false}
              className="w-full max-w-none"
            />
          </div>

          {/* FTC-compliant Amazon Associate disclosure */}
          <p className="text-[11px] text-zinc-500 italic pt-1">
            As an Amazon Associate, ToyotaWaits earns from qualifying purchases. Real-time pricing and stock verified on Amazon.ca and Amazon.com.
          </p>
        </div>
      </section>

      {/* 2. Audio: Stealth "OEM+" Audio Overhaul (Non-JBL Fix) */}
      <section className="space-y-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold">
              Non-JBL Audio Overhaul Blueprint
            </Badge>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-xs">
              Zero Wire Splicing • 100% Trunk Space Preserved
            </Badge>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Volume2 className="h-6 w-6 text-amber-500 shrink-0" />
            Audio: Stealth &ldquo;OEM+&rdquo; Audio Overhaul (Non-JBL Fix)
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            The factory non-JBL sound system in the 2019–2026 RAV4 is notoriously weak, using paper-cone drivers with quarter-sized magnets powered by low head-unit wattage that distorts easily. You can achieve studio-grade sound without splicing factory wires, tripping hybrid battery sensors, or giving up a single square inch of trunk cargo floor or spare tire space.
          </p>
        </div>

        {/* The 4-Piece Plug-and-Play Formula Overview Banner */}
        <Card className="border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20">
          <CardContent className="p-5 sm:p-6 space-y-3">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              The 4-Piece Plug-and-Play Formula
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 text-xs">
              <div className="bg-zinc-900/60 p-3 rounded-lg border border-zinc-800 space-y-1">
                <span className="text-[11px] font-bold text-amber-400">1. Clean Inline Power</span>
                <p className="text-zinc-300 font-semibold">Beat-Sonic ENA-3T3 Micro-Amp</p>
                <p className="text-zinc-500 text-[11px]">50W x 4 inline amp + built-in RCA sub pre-out behind glovebox.</p>
              </div>
              <div className="bg-zinc-900/60 p-3 rounded-lg border border-zinc-800 space-y-1">
                <span className="text-[11px] font-bold text-amber-400">2. Stage 1 Clarity</span>
                <p className="text-zinc-300 font-semibold">3.5&quot; Dash Speaker Swap</p>
                <p className="text-zinc-500 text-[11px]">Cerwin-Vega V3 or Kicker KSC350 + Metra 72-8110 harnesses.</p>
              </div>
              <div className="bg-zinc-900/60 p-3 rounded-lg border border-zinc-800 space-y-1">
                <span className="text-[11px] font-bold text-amber-400">3. Stage 2 Mid-Bass</span>
                <p className="text-zinc-300 font-semibold">6.5&quot; Door Speaker Swap</p>
                <p className="text-zinc-500 text-[11px]">Kicker CS Series 6.5&quot; + Metra 82-8148 brackets &amp; 72-8104 leads.</p>
              </div>
              <div className="bg-zinc-900/60 p-3 rounded-lg border border-zinc-800 space-y-1">
                <span className="text-[11px] font-bold text-amber-400">4. Stealth Low-End</span>
                <p className="text-zinc-300 font-semibold">Alpine PWE-S800 Powered Sub</p>
                <p className="text-zinc-500 text-[11px]">120W RMS shallow sub flat under front passenger seat frame.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detail Cards for each of the 4 Formula Components */}
        <div className="space-y-6">
          {/* Component 1: Clean Inline Power */}
          <ModComparisonCard
            stepNumber={1}
            title="1. Clean Inline Power: Beat-Sonic ENA-3T3 Micro Power Amplifier Kit"
            categoryBadge="Amplifiers & Power"
            icon={Zap}
            priceEst="~$380 CAD"
            installEffort="45-min Plug & Play"
            integration="Factory Inline T-Harness"
            fitmentBadge="2019–2026 Non-JBL (8-inch & 10.5-inch Screens)"
            whyThisPick="The Beat-Sonic ENA-3T3 micro power amp is the cornerstone of the non-JBL stealth overhaul. It connects inline directly behind the factory multimedia touchscreen with a custom Toyota T-harness—zero wire splicing, zero tapping into fuse boxes, and zero risk of tripping 12V hybrid battery drain codes. Crucially, it includes an integrated RCA subwoofer preamp output, which completely eliminates the need for an external Line Output Converter (LOC)."
            proTip="Mount the compact micro-amp module behind the lower glovebox or behind the radio bracket using heavy-duty 3M VHB automotive tape and zip-ties. Pre-set gain dials to ~50% before re-assembling the dash trim."
            factoryIssue="Factory non-JBL head units output only ~12-15W RMS per channel with high distortion levels at highway listening volumes, starving aftermarket speakers of dynamics."
            solution="Micro-sized 50W x 4 class-D amplifier with plug-and-play Toyota T-harness. Boosts output cleanly across all 4 channels and provides a clean RCA low-level subwoofer pre-out."
            steps={[
              'Remove the lower passenger dash trim and unclip the glovebox dampener arm to lower the glovebox.',
              'Unclip the center multimedia touchscreen bezel and remove the four 10mm head-unit mounting bolts.',
              'Pull the touchscreen forward and disconnect the factory 28-pin/10-pin audio harness plugs.',
              'Click the Beat-Sonic T-harness between the factory vehicle plugs and the touchscreen receptacles.',
              'Route the dedicated RCA subwoofer preamp cable down towards the passenger seat well.',
              'Secure the micro-amp behind the dash frame using automotive zip ties and test audio playback before snapping trim back.',
            ]}
            affiliateSlug="beat-sonic-ena-3t3"
            ctaLabel="View on Beat-Sonic USA ↗"
            affiliateSublabel="Beat-Sonic ENA-3T3 Plug & Play Kit (~$380 CAD)"
          />

          {/* Component 2: Stage 1 Vocal & Treble Clarity (3.5" Dash Swap) */}
          <ModComparisonCard
            stepNumber={2}
            title="2. Stage 1 Vocal & Treble Clarity: 3.5&quot; Dash Corner Speaker Swap"
            categoryBadge="High-Frequency Clarity"
            icon={Volume2}
            priceEst="~$95–$128 CAD"
            installEffort="15-min Solder-Free Swap"
            integration="Direct Harness Adapter"
            fitmentBadge="2019–2026 Left & Right Dash Corners"
            whyThisPick="Factory dash locations house fragile 2.5-inch paper tweeters that swallow podcast dialogue and high-frequency sparkle. Swapping in high-efficiency 3.5-inch coaxial drivers (Cerwin-Vega V3 or Kicker KSC350) paired with Metra 72-8110 harnesses raises the entire soundstage to ear level in fifteen minutes without cutting any wires."
            proTip="Use plastic nylon pry tools along the windshield edge to pop corner grilles straight up. Point speaker terminals towards the cabin so they do not press against the defroster air duct underneath."
            factoryIssue="The factory SE / LE paper dash cones muffle vocals and distort when turned up over road noise on the highway."
            solution="High-sensitivity 3.5-inch 2-way coaxial drivers (Cerwin-Vega V3 or Kicker KSC350) with Metra 72-8110 harnesses. Solder-free swap that delivers crystal-clear dialogue and crisp acoustic highs."
            steps={[
              'Insert a nylon trim pry tool along the outer edge of each corner dash grille and gently pop the retaining clips upwards.',
              'Remove the two 10mm (or 8mm) factory hex screws securing each paper speaker cone.',
              'Disconnect the factory electrical connector from the OEM speaker.',
              'Plug the Metra 72-8110 adapter harness into the factory vehicle connector, then slide the spade connectors onto the new speaker terminals.',
              'Screw down the new 3.5\" speaker with factory hardware and snap the protective grille flush.',
            ]}
            affiliateSlug="dash-speakers-rav4"
            ctaLabel="Check Fitment on Amazon.ca ↗"
            affiliateSublabel={'Cerwin-Vega V3 3.5" / Kicker KSC350 Pair (~$95 CAD)'}
            secondaryActions={[
              {
                slug: 'metra-72-8110-harness',
                label: 'View Exact Part Listing ↗',
                sublabel: 'Metra 72-8110 Harness Adapters (~$18 CAD)',
              },
              {
                slug: 'trim-removal-tools',
                label: 'Check Fitment on Amazon.ca ↗',
                sublabel: 'Nylon Dash Pry Tool Set (~$15 CAD)',
              },
            ]}
          />

          {/* Component 3: Stage 2 Mid-Bass Punch (6.5" Door Speakers) */}
          <ModComparisonCard
            stepNumber={3}
            title="3. Stage 2 Mid-Bass Punch: Kicker CS Series 6.5&quot; Door Speakers (Front & Rear)"
            categoryBadge="Mid-Bass & Dynamics"
            icon={Volume2}
            priceEst="~$149 CAD"
            installEffort="1-hr Install"
            integration="Bracket & Harness Adapters"
            fitmentBadge="2019–2026 Front & Rear Door Panels"
            whyThisPick="Factory door drivers use flimsy paper diaphragms with tiny quarter-sized magnets that bottom out when bass kicks in. Replacing all four doors with Kicker CS Series 6.5-inch coaxial drivers on Metra 82-8148 mounting brackets delivers tight, punchy mid-bass while sealing firmly against the factory door weather barrier."
            proTip="Apply a 10-inch strip of sound deadening mat (butyl damping) around the inner sheet metal behind each speaker bracket to stop panel rattles and maximize door mid-bass resonance."
            factoryIssue="Factory door speakers have virtually no excursion, rattling the plastic door cards and producing muddy, hollow mid-bass."
            solution="Rigid polypropylene Kicker CS Series 6.5-inch drivers mounted on Metra 82-8148 adapter brackets with Metra 72-8104 plug-and-play wiring leads."
            steps={[
              'Remove the door panel trim screws hidden behind the interior door handle cup and armrest grab handle.',
              'Pry along the bottom and side edges of the door card to release the plastic retaining clips, then unhook the door lock and latch cables.',
              'Drill out the three aluminum factory rivets holding the OEM speaker cone using a 3/16" drill bit.',
              'Bolt the Metra 82-8148 speaker adapter bracket firmly into the factory rivet holes.',
              'Click the Metra 72-8104 harness into the vehicle speaker plug and slide terminals onto the Kicker CS driver.',
              'Fasten the speaker into the bracket, test audio, and snap the interior door card back onto the frame.',
            ]}
            affiliateSlug="kicker-cs-door-speakers-rav4"
            ctaLabel="Check Fitment on Amazon.ca ↗"
            affiliateSublabel={'Kicker CS Series 6.5" 2-Way Drivers (~$149 CAD)'}
            secondaryActions={[
              {
                slug: 'metra-82-8148-brackets',
                label: 'View Exact Part Listing ↗',
                sublabel: 'Metra 82-8148 Door Brackets (~$24 CAD)',
              },
              {
                slug: 'metra-72-8104-harness',
                label: 'View Exact Part Listing ↗',
                sublabel: 'Metra 72-8104 Wiring Leads (~$16 CAD)',
              },
            ]}
          />

          {/* Component 4: Stealth Low-End (Under-Seat Powered Sub) */}
          <ModComparisonCard
            stepNumber={4}
            title="4. Stealth Low-End: Alpine PWE-S800 8&quot; Compact Under-Seat Powered Subwoofer"
            categoryBadge="Subwoofers & Deep Bass"
            icon={Volume2}
            priceEst="~$399 CAD"
            installEffort="45-min Under-Seat Fit"
            integration="Direct RCA Sub Pre-Out Tap"
            fitmentBadge="Flat Under Front Passenger Seat (Hybrid Safe)"
            whyThisPick="Traditional trunk subwoofers sacrifice stroller or camping cargo space and risk hitting high-voltage hybrid wiring. The Alpine PWE-S800 (or PWE-S8) packs 120W RMS in a shallow 3-inch cast-aluminum enclosure that slides completely flat under the front passenger seat frame. It connects directly to the Beat-Sonic amp RCA pre-out, giving you chest-thumping bass while keeping 100% of your trunk floor and spare tire well empty."
            proTip="Route the RCA cables down the center console tunnel beneath the passenger carpeting. Connect the 12V constant wire with an inline fuse to the 12V auxiliary battery, and secure the chassis ground to the bare metal front seat bracket bolt."
            factoryIssue="RAV4s without the factory JBL package have zero dedicated subwoofer, leaving kick drums and deep acoustic notes completely absent."
            solution="Shallow cast-aluminum 8-inch powered sub (120W RMS / 240W peak) fitting underneath the front passenger seat frame, wired directly to the Beat-Sonic amplifier RCA output."
            steps={[
              'Slide the front passenger seat all the way forward and tilt it up to expose the floor cavity beneath the seat rail.',
              'Verify clearance above the rear passenger floor air duct (the 3-inch shallow Alpine enclosure clears with room to spare).',
              'Route the shielded RCA audio cable from the Beat-Sonic amp down the passenger console trim to the sub location.',
              'Connect the sub remote turn-on lead and 12V auxiliary power wire with the supplied inline 15A fuse.',
              'Fasten the sub chassis to the carpet using the included heavy-duty hook-and-loop mounting brackets to prevent sliding.',
              'Tune the low-pass filter (LPF) to ~80Hz and adjust the wired bass remote knob from the driver cockpit.',
            ]}
            affiliateSlug="alpine-pwe-s800"
            ctaLabel="Check Fitment on Amazon.ca ↗"
            affiliateSublabel={'Alpine PWE-S800 / PWE-S8 8" Powered Sub (~$399 CAD)'}
            secondaryActions={[
              {
                slug: 'beat-sonic-ena-3t3',
                label: 'View Beat-Sonic Amp ↗',
                sublabel: 'ENA-3T3 Micro Power Amp w/ Sub Out',
              },
            ]}
          />
        </div>
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
          fitmentBadge="Verified: 2019–2025 | 2026: Pending Validation"
          whyThisPick="Why pay $4,800+ CAD more for the XSE trim just to get SofTex leather? Clazzio (perforated genuine leather inserts) and EKR (4-layer waterproof leatherette) are patterned for 5th Gen (2019–2025) RAV4 seats. 6th Gen (2026+) seat patterns are not yet confirmed — check the seller's listed model years before ordering. For seats with side airbags, follow the cover manufacturer's airbag-compatibility guidance and your Toyota owner's manual."
          proTip="Warm the covers indoors or under sunlight before installation to maximize leatherette flexibility. Sliding a thin plastic grocery bag over headrests helps the snug covers slide on without snagging."
          factoryIssue="Standard SE cloth seats readily soak up winter road salt, coffee spills, and pet hair, whereas factory SofTex requires jumping up to top-tier XSE packages with lengthy wait lists."
          solution="Tailored slip-over leatherette or leather covers laser-scanned to 5th Gen (2019–2025) RAV4 seating contours. Includes front and 60/40 rear seats and headrests. Confirm 6th Gen (2026+) fitment and side-airbag compatibility with the cover manufacturer before purchase."
          steps={[
            'Warm covers indoors before installation to maximize material elasticity and ease stretching.',
            'Slip the bottom cushion cover over the seat base and feed the anchor chucks through the rear cushion crevice.',
            'Pull the lower anchor straps tight underneath the seat frame and secure the industrial hook-and-loop fasteners.',
            'Slide the backrest cover down over the seat upright, following the cover manufacturer\'s instructions for seats with side airbags.',
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
          fitmentBadge="Verified: 2019–2025 | 2026: Pending Validation"
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
                  <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                    Stealth &ldquo;OEM+&rdquo; Audio Package
                    <span className="block text-[11px] font-normal text-zinc-500">
                      Beat-Sonic Amp + 3.5&quot; Dash + 6.5&quot; Doors + Alpine Sub
                    </span>
                  </td>
                  <td className="py-3 px-4">Factory JBL (Bundled in XSE/Tech)</td>
                  <td className="py-3 px-4">~$1,023 CAD (Full 4-Piece Package)</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">Studio Sound + 100% Trunk Space</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">Stage 1 Dash Audio Only</td>
                  <td className="py-3 px-4">Factory JBL (Bundled)</td>
                  <td className="py-3 px-4">3.5&quot; Coaxial + Metra Harness ($113 CAD)</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">Included in $113</td>
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
                  <td className="py-3 px-4 text-emerald-500 font-bold">~$1,783 CAD complete spec</td>
                  <td className="py-3 px-4 text-emerald-600 font-extrabold">&gt; $3,000 to $6,400 CAD saved</td>
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

      {/* Legal & Safety Disclaimer */}
      <GuideDisclaimer />

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
