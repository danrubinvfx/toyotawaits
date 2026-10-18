import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { GuideDisclaimer } from '@/components/common/GuideDisclaimer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ModComparisonCard } from '@/components/guides/mod-comparison-card';
import { ToolChecklist } from '@/components/guides/tool-checklist';
import {
  Wrench,
  Clock,
  Volume2,
  Gauge,
  Layers,
  Video,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Car,
  Sparkles,
  Zap,
  Activity,
  Flame,
  Music,
} from 'lucide-react';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Must-Have Toyota Corolla & Corolla Cross Mods & Accessories (2020–2026) | ToyotaWaits.ca',
  description:
    'Comprehensive Canadian enthusiast and practical mod guide for Toyota Corolla Sedan, Hatchback, GR Corolla, and Corolla Cross. Daily essentials, suspension handling, audio upgrades, and exhaust.',
  alternates: {
    canonical: 'https://www.toyotawaits.ca/guides/corolla-mods',
  },
  openGraph: {
    title: 'Must-Have Toyota Corolla & Corolla Cross Mods & Accessories (2020–2026)',
    description:
      'The 4-stage upgrade guide for Canadian Corolla owners: TuxMat liners, FitcamX 4K dashcam, Tanabe strut bar, 22mm sway bar, 3.5" tweeter swap, and cold air intake.',
    url: 'https://www.toyotawaits.ca/guides/corolla-mods',
    siteName: 'ToyotaWaits.ca',
    locale: 'en_CA',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Must-Have Toyota Corolla & Corolla Cross Mods & Accessories (2020–2026)',
    description:
      'The 4-stage upgrade guide for Canadian Corolla owners: daily protection, handling, audio, and performance.',
  },
};

export default function CorollaModsGuidePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* Header & Breadcrumb */}
      <div className="space-y-4">
        <BackButton className="mb-4" />

        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-amber-500 text-zinc-950 font-bold gap-1 text-xs hover:bg-amber-400">
            <Wrench className="h-3.5 w-3.5" /> Enthusiast &amp; Practical Playbook
          </Badge>
          <Badge variant="outline" className="border-amber-500/30 text-amber-400 text-xs">
            TNGA-C Architecture (E210)
          </Badge>
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-xs">
            Verified: 2020–2026 Canadian Models
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          Must-Have Toyota Corolla &amp; Corolla Cross Mods &amp; Upgrades
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          Built on Toyota’s ultra-rigid TNGA-C global platform, the E210 Corolla (Sedan, Hatchback, GR) and Corolla Cross offer incredible chassis balance and bulletproof reliability. But Canadian highway commuting, road salt, coarse asphalt roar, and conservative factory tuning leave massive room for high-ROI upgrades. Here is the curated 4-stage upgrade guide vetted by the Canadian Corolla community.
        </p>

        {/* Trim Compatibility Callout Banner */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-950/30 p-4 sm:p-5 flex items-start sm:items-center gap-3 shadow-xs">
          <Sparkles className="h-5 w-5 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
          <div className="text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 font-medium leading-relaxed">
            <strong className="font-bold text-amber-700 dark:text-amber-400">Model &amp; Platform Coverage:</strong>{' '}
            Verified for 2020–2026 Corolla Sedan (L, LE, SE, XSE, Hybrid AWD), Corolla Hatchback (SE, XSE, Nightshade), GR Corolla (Core, Premium, Circuit), and Corolla Cross (L, LE, XLE, SE/XSE Hybrid AWD).
          </div>
        </div>

        {/* Compliant Affiliate Transparency Notice */}
        <div className="inline-flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 border-l-2 border-amber-500/60 pl-3 py-1">
          <ShieldCheck className="h-3.5 w-3.5 text-amber-500 shrink-0" />
          <span>
            Curated enthusiast guide. As an Amazon Associate, toyotawaits.ca earns from qualifying purchases at no extra cost to you.
          </span>
        </div>
      </div>

      {/* Pre-Flight Tool Checklist */}
      <ToolChecklist
        timeEst="1–3 Hours per Stage"
        difficulty="Moderate (Hand Tools)"
        warrantyFriendly={true}
        tools={[
          'Nylon interior trim pry tool kit (for dash tweeters and console tray)',
          '10mm, 12mm, 14mm & 17mm sockets with ratchet and torque wrench',
          'Heavy-duty roller tool (for Kilmat/Noico butyl sound deadening)',
          'Low-profile car jack and rated jack stands (for rear sway bar and springs)',
          '70% Isopropyl alcohol wipes (for surface prep)',
          'Automotive wire harness adapter plugs (Metra 72-8110 for dash tweeters)',
        ]}
      />

      {/* ========================================================================= */}
      {/* STAGE 1: DAILY DRIVER ESSENTIALS */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <Badge className="bg-blue-600 text-white font-bold text-xs mb-2">Stage 1</Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Layers className="h-6 w-6 text-blue-500" />
            Stage 1: Daily Driver Essentials &amp; Cabin Armor
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Armoring the interior against Canadian slush and road spray while modernizing the cabin tech.
          </p>
        </div>

        {/* Mod 1: TuxMat / WeatherTech Floor Liners */}
        <ModComparisonCard
          stepNumber={1}
          title="TuxMat / WeatherTech Custom All-Weather Floor Liners & Trunk Mats"
          categoryBadge="Interior Armor"
          icon={Layers}
          priceEst="~$180–$250 CAD"
          installEffort="10-min Install"
          integration="OEM Floor Retention Twist-Locks"
          fitmentBadge="Sedan, Hatchback & Cross"
          whyThisPick="High-wall tub coverage engineered for Canadian winter salt crusts and melted boot snow. Leaves zero bare carpet exposed."
          proTip="For Corolla Cross owners: check whether your vehicle is AWD or FWD before ordering the trunk mat—AWD models have a raised spare tire deck with a 2-inch shallower cargo floor contour."
          factoryIssue="Dealer-supplied carpet mats or generic flat rubber mats let melted salty slush seep into sub-floor wiring harnesses, leaving permanent white crusts and musty odors."
          solution="Precision laser-measured thermoplastic elastomer (TPE) liners extending up the sidewalls and transmission tunnel, securing cleanly with factory floor anchor twist-locks."
          steps={[
            'Unlock factory twist clips on driver floor pan and remove OEM carpet mats.',
            'Thoroughly vacuum grit and clean footwells with an upholstery brush.',
            'Slide driver liner into place and twist-lock the dual retention posts.',
            'Snap rear one-piece bridge mat across the center exhaust tunnel.',
            'Lay trunk tray into cargo hold, aligning side cutouts around the wheel arches.',
          ]}
          affiliateSlug="corolla-all-weather-liners"
          ctaLabel="Check Fitment on Amazon.ca ↗"
          affiliateSublabel="Verified E210 Sedan & Cross Fitments"
        />

        {/* Mod 2: FitcamX OEM Integrated 4K Dashcam */}
        <ModComparisonCard
          stepNumber={2}
          title="FitcamX OEM-Integrated 4K Mirror Dashcam"
          categoryBadge="Tech & Safety"
          icon={Video}
          priceEst="~$190 CAD"
          installEffort="15-min Install"
          integration="Plug-and-Play TSS Mirror Harness"
          fitmentBadge="Corolla E210 & Corolla Cross"
          whyThisPick="Looks 100% factory OEM. Replaces the plastic rearview mirror housing with zero dangling wires across the windshield."
          proTip="Use the included plastic pry tool to split the top seam of the OEM rearview mirror clamshell shroud. The FitcamX Y-splitter taps power directly from the auto-dimming mirror harness with zero wire splicing or fuse box taps."
          factoryIssue="Aftermarket dashcams clutter the clean windshield with suction cups and dangling 12V cigarette lighter wires that interfere with phone charging ports."
          solution="A custom molded ABS collar containing a 4K Sony IMX sensor that replaces the factory mirror cowl and draws power through an inline pass-through harness."
          steps={[
            'Tilt rearview mirror downward to access the upper edge of the TSS camera shroud.',
            'Gently pry apart the two halves of the factory plastic clamshell cover.',
            'Disconnect the factory 10-pin or 12-pin power plug from the back of the mirror.',
            'Plug the FitcamX Y-splitter inline between the vehicle connector and mirror.',
            'Snap the new 4K camera housing into place and insert the high-endurance MicroSD card.',
          ]}
          affiliateSlug="fitcamx-corolla"
          ctaLabel="Check Fitment on Amazon.ca ↗"
          affiliateSublabel="TSS 2.0 / 3.0 Pass-Through Harness (~$190 CAD)"
        />

        {/* Mod 3: Center Console Organizer & Anti-Rattle Cup Liners */}
        <ModComparisonCard
          stepNumber={3}
          title="Center Console Organizer Tray & Anti-Rattle Cup Holder Liners"
          categoryBadge="Interior Organization"
          icon={CheckCircle2}
          priceEst="~$25 CAD"
          installEffort="Instant Drop-in"
          integration="Direct Fit Drop-in"
          fitmentBadge="Corolla E210 & Corolla Cross"
          whyThisPick="Converts the cavernous bottomless armrest bin into an organized dual-tier shelf with rubber coin and sunglass compartments."
          proTip="The organizer tray includes a built-in cable passthrough cutout so you can route your USB-C charging cord to your phone without pinching the wire."
          factoryIssue="The factory center armrest is a deep empty bucket where keys, coins, toll passes, and pens sink to the bottom and rattle against the plastic."
          solution="Custom ABS molded tray that rests snugly on the upper armrest ledges, creating an upper tier for quick-access items while preserving deep lower storage."
          steps={[
            'Open the center armrest lid and clear loose clutter.',
            'Place the molded non-slip silicone pads into the tray compartments.',
            'Drop the organizer tray directly into the armrest cavity.',
          ]}
          affiliateSlug="corolla-console-organizer"
          ctaLabel="Check Fitment on Amazon.ca ↗"
          affiliateSublabel="Dual-Tier ABS Storage Insert (~$25 CAD)"
        />
      </section>

      {/* ========================================================================= */}
      {/* STAGE 2: HANDLING, RIDE & SUSPENSION */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <Badge className="bg-amber-600 text-white font-bold text-xs mb-2">Stage 2</Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Activity className="h-6 w-6 text-amber-500" />
            Stage 2: Handling, Ride &amp; Suspension Tuning
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Sharpen steering precision, eliminate body roll, and dial in the athletic stance of the TNGA-C multi-link chassis.
          </p>
        </div>

        {/* Mod 4: Front Strut Tower Brace */}
        <ModComparisonCard
          stepNumber={4}
          title="Front Strut Tower Brace (Tanabe / Megan Racing)"
          categoryBadge="Chassis Stiffening"
          icon={Wrench}
          priceEst="~$160–$220 CAD"
          installEffort="20-min Install"
          integration="Direct Bolt-on to Strut Top Nuts"
          fitmentBadge="Corolla Sedan, Hatch & Cross"
          whyThisPick="Ties the front strut towers together to eliminate cowl shudder, tighten on-center highway steering feel, and reduce wander in crosswinds."
          proTip="Do not overtighten the strut tower nuts. Factory Toyota spec for the top 14mm strut mount nuts is 35 ft-lbs (47 Nm). Torque them in a criss-cross sequence."
          factoryIssue="On long Canadian highway drives (such as the 401 or Coquihalla), the tall front strut towers flex under crosswinds and ruts, causing minor continuous steering corrections."
          solution="One-piece reinforced tubular steel or extruded aluminum tower bar that bolts directly to factory strut studs, bracing the engine bay geometry."
          steps={[
            'Pop the hood and locate the three 14mm nuts atop each front strut tower.',
            'Remove the three nuts on both the driver and passenger shock towers.',
            'Carefully align the strut bar mounting brackets over the threaded studs.',
            'Thread the nuts back on by hand to avoid cross-threading.',
            'Torque all six nuts to 35 ft-lbs using a torque wrench.',
          ]}
          affiliateSlug="corolla-strut-tower-brace"
          ctaLabel="Search Strut Braces on Amazon.ca ↗"
          affiliateSublabel="Tanabe & Megan Racing Fitments (~$180 CAD)"
        />

        {/* Mod 5: Rear Anti-Roll Sway Bar (22mm TRD / Progress) */}
        <ModComparisonCard
          stepNumber={5}
          title="Rear Anti-Roll Sway Bar Upgrade (TRD / Progress 22mm)"
          categoryBadge="Handling & Dynamics"
          icon={Activity}
          priceEst="~$240–$310 CAD"
          installEffort="45-min Install"
          integration="Direct Replacement of Factory 19mm Bar"
          fitmentBadge="Corolla Sedan & Hatchback (SE, XSE)"
          whyThisPick="The single most dramatic handling upgrade for the E210 Corolla. Eliminates excessive rear body roll and delivers crisp, neutral turn-in."
          proTip="Corolla Hatchback and Sedan models with independent rear double-wishbone suspension come with a skinny 19mm hollow rear bar. Stepping up to a 22mm solid bar increases torsional stiffness by over 60%, drastically cutting understeer."
          factoryIssue="The factory rear anti-roll bar is tuned heavily for understeer and comfort, allowing the car to lean excessively during highway cloverleaf on-ramps and quick lane transitions."
          solution="A 22mm solid spring-steel rear sway bar equipped with polyurethane bushings and synthetic grease to maintain flat cornering without introducing cabin harshness."
          steps={[
            'Safely raise the rear of the car with ramps or jack stands under rear pinch welds.',
            'Unbolt the two 12mm sway bar end link nuts connecting to the rear control arms.',
            'Remove the four 14mm bushing bracket bolts securing the bar to the rear subframe.',
            'Drop the factory 19mm bar out from under the exhaust piping.',
            'Apply included silicone grease generously inside the new 22mm polyurethane bushings.',
            'Install the new bar and torque subframe bolts to 38 ft-lbs and end links to 33 ft-lbs.',
          ]}
          affiliateSlug="corolla-rear-sway-bar"
          ctaLabel="Search Sway Bars on Amazon.ca ↗"
          affiliateSublabel="22mm Stiffened Anti-Roll Bar (~$280 CAD)"
        />

        {/* Mod 6: Lowering Springs (RSR Superdown / TRD) */}
        <ModComparisonCard
          stepNumber={6}
          title="Lowering Springs / Sport Coilovers (RSR Superdown / TRD)"
          categoryBadge="Suspension & Stance"
          icon={Gauge}
          priceEst="~$320–$420 CAD"
          installEffort="2–3 Hour Install"
          integration="OEM Shock Absorber Compatible"
          fitmentBadge="Hatchback, Sedan & GR Corolla"
          whyThisPick="Drops ride height by 1.0 to 1.2 inches (25–30mm) to close excessive wheel gap while preserving factory progressive damping comfort."
          proTip="Always get a 4-wheel laser alignment 500 km after installing lowering springs to let the suspension settle. Re-zeroing the front toe prevents premature inner tire treadwear."
          factoryIssue="Stock North American Corollas come with substantial 3-finger fender wheel gap for snow chain clearance, resulting in a floating visual stance and higher center of gravity."
          solution="Cold-wound chrome-silicon progressive rate lowering springs engineered to match the stroke and rebound valving of factory Toyota shock absorbers."
          steps={[
            'Jack up vehicle on all 4 corners and remove wheels.',
            'Disconnect front sway bar links and unbolt front strut assemblies from steering knuckles.',
            'Use a spring compressor to safely decompress factory springs and install progressive sport springs.',
            'Reassemble front strut hat and torque top nut to spec.',
            'Lower rear control arms to swap rear coil springs and re-torque all suspension pivots at ride height.',
          ]}
          affiliateSlug="corolla-lowering-springs"
          ctaLabel="Search Lowering Springs on Amazon.ca ↗"
          affiliateSublabel="RSR & TRD Progressive Springs (~$350 CAD)"
        />
      </section>

      {/* ========================================================================= */}
      {/* STAGE 3: AUDIO & SOUND INSULATION */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <Badge className="bg-purple-600 text-white font-bold text-xs mb-2">Stage 3</Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Volume2 className="h-6 w-6 text-purple-500" />
            Stage 3: Audio Clarity &amp; Sound Insulation
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Overcoming factory paper-cone mud and Canadian highway road roar with high-ROI audio upgrades.
          </p>
        </div>

        {/* Mod 7: 3.5" Dash Corner Tweeter Swap */}
        <ModComparisonCard
          stepNumber={7}
          title="JBL Club / Kicker KS 3.5-inch Dash Corner Tweeter Swap"
          categoryBadge="Audio Upgrade"
          icon={Music}
          priceEst="~$95–$140 CAD"
          installEffort="20-min Install"
          integration="Plug & Play with Metra 72-8110 Wire Harness"
          fitmentBadge="All Corollas (Non-JBL Systems)"
          whyThisPick="The undisputed #1 highest ROI modification on any modern Toyota. Lifts muffled vocals right out of the floorboards onto the windshield soundstage."
          proTip="Toyota runs the entire front speaker signal through the dash speaker plug in parallel with the door woofers. Using the plug-and-play Metra 72-8110 harness retains the factory wiring loop without cutting a single OEM wire."
          factoryIssue="Non-JBL Corollas use tiny 2.5-inch paper-cone squawkers with cheap 6dB bass blockers that produce tinny, muddy sound, forcing you to crank volume to 40+ on highways."
          solution="High-sensitivity 3.5-inch 2-way coaxial speakers (JBL Club 322F or Kicker 47KSC3504) with silk dome tweeters and built-in crossovers that deliver crisp vocal clarity and detailed highs."
          steps={[
            'Insert a plastic pry tool under the outer edge of the driver dash speaker grille and unclip.',
            'Remove the two 10mm bolts securing the factory paper speaker.',
            'Unplug the factory 4-pin harness and connect the Metra 72-8110 adapter harness.',
            'Connect speaker terminals (+ / -) to the new 3.5-inch JBL or Kicker coaxial speaker.',
            'Drop the new speaker in, secure the two 10mm bolts, and snap the decorative grille back in.',
            'Repeat on the passenger side dash corner.',
          ]}
          affiliateSlug="corolla-dash-speakers"
          ctaLabel="Search 3.5-inch Speakers on Amazon.ca ↗"
          affiliateSublabel="JBL Club 322F & Kicker KS Series (~$110 CAD)"
        />

        {/* Mod 8: Butyl Sound Deadening */}
        <ModComparisonCard
          stepNumber={8}
          title="Multi-Layer Butyl Sound Deadening (Kilmat / Noico 80 mil)"
          categoryBadge="Cabin Acoustic Comfort"
          icon={Layers}
          priceEst="~$85 CAD per box"
          installEffort="1.5-Hour Install"
          integration="Self-Adhesive Heavy Butyl & Foil"
          fitmentBadge="Doors, Trunk & Spare Tire Well"
          whyThisPick="Cuts coarse Canadian asphalt tire drone by 3 to 5 dB at 110 km/h highway speeds, making conversation and Bluetooth calls effortless."
          proTip="You do not need 100% sheet coverage. Covering just 40–50% of the flat metal skin inside the spare tire well and outer door skins eliminates 90% of structural resonance."
          factoryIssue="To keep curb weight down, Toyota installed minimal sound absorption around the spare tire tub and outer door sheet metal, allowing gravel spray and tire roar to reverberate throughout the cabin."
          solution="80 mil thick dense butyl rubber bonded with an aluminum constraint layer that deadens low-frequency chassis vibrations into harmless thermal energy."
          steps={[
            'Empty the trunk floor board, remove spare tire, and clean the bare metal tub with isopropyl alcohol.',
            'Cut Kilmat / Noico sheets into 10\" x 10\" manageable tiles with utility scissors.',
            'Peel wax backing paper, place tile against the bare metal pan, and press firmly.',
            'Use a wooden or hard rubber roller tool to flatten the foil dimples until smooth.',
            'Reinstall spare tire and trunk floor board.',
          ]}
          affiliateSlug="sound-deadening-mats"
          ctaLabel="Search Sound Deadening on Amazon.ca ↗"
          affiliateSublabel="Kilmat 80 mil 36 sq ft Mat (~$85 CAD)"
        />
      </section>

      {/* ========================================================================= */}
      {/* STAGE 4: PERFORMANCE & STYLING */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <Badge className="bg-red-600 text-white font-bold text-xs mb-2">Stage 4</Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Flame className="h-6 w-6 text-red-500" />
            Stage 4: Intake, Exhaust &amp; Performance Styling
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Unlock the free-revving induction growl and aggressive quad-tip visual presence of the 2.0L Dynamic Force platform.
          </p>
        </div>

        {/* Mod 9: Cold Air Intake (Injen / K&N) */}
        <ModComparisonCard
          stepNumber={9}
          title="Performance Cold Air Intake (Injen / K&N)"
          categoryBadge="Engine & Induction"
          icon={Zap}
          priceEst="~$350–$440 CAD"
          installEffort="30-min Install"
          integration="Direct Bolt-on to Factory MAF & Throttle Body"
          fitmentBadge="2.0L M20A-FKS Engine (Sedan, Hatch & Cross)"
          whyThisPick="Replaces restrictive factory baffles with smooth mandrel-bent aluminum, delivering an intoxicating throatier intake growl at 3,500+ RPM."
          proTip="The 2.0L Dynamic Force M20A-FKS engine has high 13:1 compression. Upgrading the intake improves throttle responsiveness off idle without triggering check engine lights."
          factoryIssue="The stock intake features multiple sound-canceling resonator chambers and restrictive accordion elbows designed to silence the engine completely."
          solution="High-flow oiled cotton or dry synthetic air filter inside an isolated heat shield connected to smooth-bore aluminum intake tubing."
          steps={[
            'Disconnect the negative battery terminal with a 10mm wrench.',
            'Unplug the factory Mass Airflow (MAF) sensor and carefully remove sensor with a Phillips screwdriver.',
            'Loosen hose clamps and remove the OEM airbox and accordion intake tube.',
            'Install the new heat shield and bolt into factory airbox rubber grommets.',
            'Mount MAF sensor into the new intake pipe with included hardware.',
            'Connect intake tube to throttle body, attach cone filter, and reconnect battery.',
          ]}
          affiliateSlug="corolla-cold-air-intake"
          ctaLabel="Search Intakes on Amazon.ca ↗"
          affiliateSublabel="Injen & K&N Cold Air Systems (~$380 CAD)"
        />

        {/* Mod 10: Remark / Apex Cat-Back & Quad-Tip Exhaust */}
        <ModComparisonCard
          stepNumber={10}
          title="Remark / Apex Cat-Back & Quad-Tip Exhaust (Hatchback SE & XSE)"
          categoryBadge="Exhaust & Performance"
          icon={Flame}
          priceEst="~$450–$850 CAD"
          installEffort="45-min Install"
          integration="Factory Flange & Rubber Hanger Fitment"
          fitmentBadge="Corolla Hatchback (2019–2026)"
          whyThisPick="Transforms the rear styling with polished stainless quad or dual burn tips and provides a deep, sporty exhaust tone without highway cabin drone."
          proTip="For Corolla Hatchbacks with the factory faux chrome bumper diffuser cutouts: aftermarket exhaust diffusers (such as Tom's style or Remark quad cutout templates) allow quad 3.5-inch tips to sit perfectly flush."
          factoryIssue="The stock Corolla Hatch exhaust dumps inconspicuously down towards the pavement behind fake plastic chrome bumper inserts."
          solution="T304 mandrel-bent stainless steel cat-back exhaust with precision laser-cut flanges, tuned resonators, and quad staggered slant-cut exhaust tips."
          steps={[
            'Back the rear wheels onto solid ramps or raise securely on jack stands.',
            'Spray rubber exhaust isolator hangers with silicone lubricant spray for easy removal.',
            'Unbolt the two 14mm spring flange bolts connecting the factory axle-back pipe.',
            'Slide factory muffler assembly off the rubber mounting hangers.',
            'Hang the new stainless exhaust section into the rubber grommets and torque flange bolts to 32 ft-lbs.',
            'Wipe polished exhaust tips with glass cleaner to remove fingerprint oils before first startup.',
          ]}
          affiliateSlug="corolla-exhaust-system"
          ctaLabel="Search Corolla Exhausts on Amazon.ca ↗"
          affiliateSublabel="Remark & Apex Cat-Back Systems (~$520 CAD)"
        />
      </section>

      {/* Cross-Link Back to Tires Guide & Delivery Prep */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-950 p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
            <Car className="h-4 w-4" /> Next Step: Winter Wheels &amp; Rubber
          </div>
          <div className="text-lg font-bold text-zinc-100">
            Canadian Tire Sizing &amp; Winter Downsizing Guide
          </div>
          <p className="text-xs text-zinc-400 max-w-lg">
            Review certified 3PMSF winter tires and 15&quot;, 16&quot;, 17&quot;, and 18&quot; factory wheel fitments for Corolla Sedan, Hatchback, and Cross.
          </p>
        </div>
        <Link href="/tires">
          <Button className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shrink-0">
            Explore Tire Specs 🛞
          </Button>
        </Link>
      </div>

      {/* Statutory Affiliate Disclaimer */}
      <GuideDisclaimer />
    </div>
  );
}
