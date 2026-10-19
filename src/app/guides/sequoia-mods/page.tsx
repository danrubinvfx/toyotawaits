import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ModComparisonCard } from '@/components/guides/mod-comparison-card';
import { ToolChecklist } from '@/components/guides/tool-checklist';
import {
  Wrench,
  Clock,
  Layers,
  Video,
  ShieldCheck,
  CheckCircle2,
  Car,
  Sparkles,
  Zap,
  Activity,
  Flame,
  Volume2,
  Truck,
  Anchor,
  Compass,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Must-Have Toyota Sequoia (XK80) Mods & Practical Upgrades (2023–2026) | ToyotaWaits.ca',
  description:
    'Essential Canadian enthusiast guide for 3rd-Gen Toyota Sequoia (XK80): solving the hybrid battery cargo hump, 3-inch preload collar leveling, 35-inch tire fitment, towing sag fixes, and 4K dashcam.',
  alternates: {
    canonical: 'https://www.toyotawaits.ca/guides/sequoia-mods',
  },
  openGraph: {
    title: 'Must-Have Toyota Sequoia (XK80) Mods & Upgrades (2023–2026)',
    description:
      'The comprehensive upgrade playbook for Canadian Sequoia owners: cargo deck leveling, Westcott 3-inch collar lift, air suspension calibration, and heavy towing stability.',
    url: 'https://www.toyotawaits.ca/guides/sequoia-mods',
    siteName: 'ToyotaWaits.ca',
    locale: 'en_CA',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Toyota Sequoia (XK80) Mods & Practical Upgrades (2023–2026)',
    description:
      'Cargo floor leveling shelves, preload leveling collars, 35-inch tire clearances, and heavy towing upgrades for 3rd-Gen Sequoia owners.',
  },
};

export default function SequoiaModsGuidePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* Header & Breadcrumb */}
      <div className="space-y-4">
        <BackButton className="mb-4" />

        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-amber-500 text-zinc-950 font-bold gap-1 text-xs hover:bg-amber-400">
            <Truck className="h-3.5 w-3.5" /> Full-Size 4WD Master Playbook
          </Badge>
          <Badge variant="outline" className="border-amber-500/30 text-amber-400 text-xs">
            TNGA-F Architecture (XK80)
          </Badge>
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-xs">
            Verified: 2023–2026 Canadian Models
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          Must-Have Toyota Sequoia (XK80) Mods &amp; Owner Upgrades
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          Sharing Toyota&apos;s boxed-steel TNGA-F truck platform with the Land Cruiser and Tundra, the 3rd-generation Sequoia delivers massive 437 hp and 583 lb-ft of twin-turbo hybrid punch. But its unique live rear axle, 1.87 kWh nickel-metal hydride battery placement under the third row, and tall factory stance introduce distinct ownership quirks. Here is the field-tested guide to leveling the cargo deck, dialing in suspension lifts without triggering AVS faults, clearing 35-inch rubber, and curing towing sag.
        </p>

        {/* Trim Compatibility Banner */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-950/30 p-4 sm:p-5 flex items-start sm:items-center gap-3 shadow-xs">
          <Sparkles className="h-5 w-5 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
          <div className="text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 font-medium leading-relaxed">
            <strong className="font-bold text-amber-700 dark:text-amber-400">Trim &amp; Suspension Compatibility:</strong>{' '}
            Verified for all Canadian 2023–2026 Sequoia 4WD trims: SR5 TRD Off-Road, Limited Nightshade, Platinum (Adaptive Variable Suspension &amp; Load-Leveling Air), TRD Pro (Fox 2.5-inch Internal Bypass), and Capstone (22-inch Luxury Street).
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
        timeEst="1–4 Hours per Upgrade"
        difficulty="Moderate (Hand Tools)"
        warrantyFriendly={true}
        tools={[
          'Metric socket set (10mm, 12mm, 14mm, 17mm, 19mm, 21mm, 22mm deep sockets)',
          'Heavy-duty floor jack (rated minimum 3.5 tons for full-size TNGA-F truck frame)',
          'Rated 6-ton jack stands with rubber pinch-weld protectors',
          'Automotive nylon trim pry tools (for interior dashcam and console inserts)',
          'Torque wrench capable of 150 ft-lbs (for wheel lugs and lower strut bolts)',
          'Acoustic roller tool and utility knife (for butyl door sound deadening)',
          'Heat gun or high-temp heat shield shears (for front fender liner clearance molding)',
        ]}
      />

      {/* ========================================================================= */}
      {/* SECTION 1: CARGO DECK & HYBRID BATTERY MANAGEMENT */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <Badge className="bg-blue-600 text-white font-bold text-xs mb-2">Section 1</Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Layers className="h-6 w-6 text-blue-500" />
            1. Cargo Deck &amp; Hybrid Battery Management (The 3rd-Gen Quirk)
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Overcoming the stepped rear floor caused by the 1.87 kWh hybrid battery pack with custom leveling systems.
          </p>
        </div>

        {/* Mod 1: Cargo Leveling Shelf & Drawers */}
        <ModComparisonCard
          stepNumber={1}
          title="Aftermarket Cargo Leveling Shelf &amp; Drawer System (Goose Gear / Custom)"
          categoryBadge="Interior Utility & Overlanding"
          icon={Layers}
          priceEst="~$450–$950 CAD"
          installEffort="45-min Drop-in"
          integration="Secures into OEM Cargo Floor Tie-Down D-Rings"
          fitmentBadge="All 3rd-Gen Sequoia Trims"
          whyThisPick="Solves the single biggest consumer complaint about the 3rd-gen Sequoia: the stepped 6-inch drop behind the sliding third row, creating a 100% flat continuous cargo and overland sleeping surface."
          proTip="The factory rear floor contains three adjustable shelf positions, but heavy cargo causes the OEM plastic dividers to bend and rattle. Heavy-duty aluminum and birch drawer platforms rest flush with folded 3rd-row seats and easily support 500+ lbs of gear or a dual sleeping mattress."
          factoryIssue="To package the solid rear axle and NiMH hybrid battery beneath the cabin floor, Toyota had to elevate the 3rd-row seat rails, preventing third-row seats from folding flush into the floor like the Gen 2 Sequoia."
          solution="Precision CNC-cut composite leveling drawer platforms that elevate the rear trunk well flush with folded seatbacks while creating lockable slide-out tool and camping gear storage beneath."
          steps={[
            'Slide the third-row seats fully forward or fold flat.',
            'Remove the factory removable multi-level plastic cargo divider panels.',
            'Position the lower leveling platform frame into the rear cargo recess.',
            'Fasten heavy-duty turnbuckles into the 4 factory steel D-ring cargo anchor points.',
            'Slide in the dual drawer compartments and lock roller bearings into place.',
            'Lay matching outdoor marine-grade carpet top deck flat for a continuous level floor.',
          ]}
          affiliateSlug="sequoia-cargo-drawers"
          ctaLabel="Search Cargo Drawers on Amazon.ca ↗"
          affiliateSublabel="Sequoia XK80 Rear Cargo Storage Systems"
        />

        {/* Mod 2: Canvasback Split 3rd-Row Liner */}
        <ModComparisonCard
          stepNumber={2}
          title="Canvasback / Custom Split 3rd-Row All-Weather Cargo Liner"
          categoryBadge="Cargo Protection"
          icon={ShieldCheck}
          priceEst="~$180–$260 CAD"
          installEffort="20-min Install"
          integration="Heavy-Duty Marine Grade Velcro to Carpet"
          fitmentBadge="Sequoia 2023–2026 (All Trims)"
          whyThisPick="Individually shields each 60/40 folding seat section and battery faceplate without jamming the power sliding seat tracks."
          proTip="Unlike rigid plastic rubber tub trays that bind and jam whenever you adjust the power sliding 3rd row, flexible 600D ballistic nylon covers cling tightly to each moving section with heavy-duty hook-and-loop fasteners."
          factoryIssue="Conventional one-piece rubber cargo trays cannot bend when third-row seats slide or recline, requiring you to remove the entire mat every time passengers enter the back."
          solution="Individual precision-tailored waterproof, puncture-resistant fabric panels that adhere seamlessly to the carpeted backrests and battery kickplates."
          steps={[
            'Vacuum third-row carpet backing and battery deck to remove loose lint.',
            'Wipe plastic hinge areas with rubbing alcohol for firm tape adhesion.',
            'Align and press the battery riser protective fabric panel into place.',
            'Adhere individual seat back protectors to each 60/40 split seat back.',
            'Cycle the power third-row sliding and folding functions to confirm zero bind points.',
          ]}
          affiliateSlug="sequoia-cargo-liner"
          ctaLabel="Check Fitment on Amazon.ca ↗"
          affiliateSublabel="Custom Tailored Sequoia Battery Deck Protection"
        />
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: SUSPENSION, LEVELING & RIDE QUALITY */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <Badge className="bg-amber-600 text-white font-bold text-xs mb-2">Section 2</Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Activity className="h-6 w-6 text-amber-500" />
            2. Suspension, Leveling &amp; Ride Quality
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Eliminating factory nose-down rake while protecting Adaptive Variable Suspension (AVS) dampers and load-leveling air springs.
          </p>
        </div>

        {/* Mod 3: Preload Collar Leveling Kit */}
        <ModComparisonCard
          stepNumber={3}
          title="Westcott Designs / Rough Country 3-inch Front / 1-inch Rear Preload Collar Lift"
          categoryBadge="Suspension & Stance"
          icon={Wrench}
          priceEst="~$450–$620 CAD"
          installEffort="2–3 Hour Install"
          integration="Maintains Factory Shocks & AVS Damper Sensors"
          fitmentBadge="SR5, Limited, TRD Pro, Platinum & Capstone"
          whyThisPick="Levels out the factory 2.5-inch front rake while 100% preserving factory shock valving, Fox internal bypass dynamics, and electronic damper calibrations."
          proTip="Do NOT use cheap top-hat spacer pucks that bolt on top of the strut hat! Top spacers push the suspension past factory down-travel limits, causing upper ball joint binding and CV axle boot tearing. Preload collars preload the lower spring perch inside the factory stroke envelope."
          factoryIssue="The factory Sequoia sits with an aggressive nose-down rake for wind resistance, leaving very tight clearance for larger tires and causing front bumper scraping on moderate approach angles."
          solution="Billet 6061-T6 aluminum machined preload collars that replace the lower spring perch, gaining 3 inches of front ground clearance without altering ride stiffness."
          steps={[
            'Safely raise front frame rails on rated jack stands and remove front wheels.',
            'Unplug electrical harness clips from Adaptive Variable Suspension (AVS) top caps (Platinum/Capstone).',
            'Unbolt lower strut mount and sway bar end links from lower control arms.',
            'Remove factory coil assembly and compress spring on a heavy-duty bench spring compressor.',
            'Slide factory lower spring perch off and install billet preload collar.',
            'Reassemble strut, re-torque lower shock bolt to 148 ft-lbs, and perform full laser alignment.',
          ]}
          affiliateSlug="sequoia-leveling-kit"
          ctaLabel="Search Leveling Kits on Amazon.ca ↗"
          affiliateSublabel="Westcott & Rough Country Preload Kits (~$480 CAD)"
        />

        {/* Mod 4: Air Suspension Sensor Adjustment */}
        <ModComparisonCard
          stepNumber={4}
          title="Rear Load-Leveling Air Suspension Sensor Linkage Adjustment (Platinum / Capstone)"
          categoryBadge="Electronic Chassis Calibration"
          icon={Activity}
          priceEst="~$35–$80 CAD"
          installEffort="30-min DIY"
          integration="Adjustable Ball-Joint Sensor Rod Replacement"
          fitmentBadge="Platinum & Capstone with Rear Air Springs"
          whyThisPick="Allows owners of air-ride Sequoias to calibrate rear ride height up by 0.75 to 1.5 inches to perfectly match front leveling kits without throwing dash warnings."
          proTip="The rear ride height sensors connect from the solid axle to the frame via threaded link rods. Lengthening or adjusting the aftermarket turnbuckle links tricks the ECU into maintaining slightly higher baseline air bladder pressure, eliminating reverse California squat when towing."
          factoryIssue="When you lift the front by 3 inches on Platinum or Capstone models, the rear electronic air suspension keeps factory baseline height, creating an awkward nose-high visual squat under payload."
          solution="Heavy-duty stainless steel adjustable sensor linkages that allow incremental fine-tuning of rear air bag baseline pressure in 5 minutes with hand wrenches."
          steps={[
            'Place transmission in Park on level ground with engine running in Normal drive mode.',
            'Locate the ride height sensor arm mounted above the rear control arm on each side.',
            'Pop the factory plastic ball-joint links off the upper sensor arms.',
            'Install the adjustable threaded linkage rods, set 5mm longer than OEM spec.',
            'Turn ignition on to allow the onboard air compressor to inflate air springs to the new baseline.',
            'Measure from wheel hub center to fender lip on both sides to verify perfect symmetry.',
          ]}
          affiliateSlug="sequoia-leveling-kit"
          ctaLabel="Search Sensor Links on Amazon.ca ↗"
          affiliateSublabel="Sequoia & Tundra Air Suspension Sensor Links"
        />
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: WHEELS, OFF-ROAD & TOWING UPGRADES */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <Badge className="bg-emerald-600 text-white font-bold text-xs mb-2">Section 3</Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Truck className="h-6 w-6 text-emerald-500" />
            3. Wheels, Off-Road Clearances &amp; Heavy Towing Upgrades
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Fitting true 35-inch all-terrains and eliminating high tongue-weight trailer sag.
          </p>
        </div>

        {/* Mod 5: 35-Inch Tire Clearance & Fender Molding */}
        <ModComparisonCard
          stepNumber={5}
          title="35-Inch (35x12.50R18 / 285/75R18) Tire Clearancing &amp; Fender Liner Molding"
          categoryBadge="Wheel & Trail Fitment"
          icon={Truck}
          priceEst="Free DIY / Heat Gun"
          installEffort="1-Hour DIY"
          integration="Retains OEM Fender Liners & Mudguards"
          fitmentBadge="All Trims (with 2.5-3 inch Front Lift)"
          whyThisPick="Unlocks true 35-inch diameter overland tires (Falken A/T4W, BFG KO3) filling out the massive wheel wells and adding 1.5 inches of pure mechanical ground clearance under the rear differential."
          proTip="To clear 35x12.50R18 or 295/70R18 tires without rubbing at full steering lock, you must trim or reshape the front lower fender liner bulge and remove the small aerodynamic wind bracket in front of the front tires. An aggressive positive offset (+18mm to +25mm) wheel is ideal; extreme negative offset wheels (-12mm) will rub the body mount cab frame."
          factoryIssue="Stock Sequoia wheel wells have an inward aerodynamic front liner bulge and lower air deflector flap that rub aggressively against 34-inch and 35-inch tires during suspension compression and full lock turns."
          solution="Carefully heating the thermoplastic front fender liner with a heat gun to mold it forward 1 inch, combined with trimming the bottom corner tab for 100% rub-free articulation."
          steps={[
            'Remove the two 10mm screws holding the front air deflector bracket forward of the front tires.',
            'Loosen lower fender liner clips to access the inner cavity.',
            'Apply moderate heat with an electric heat gun (set to 250°C) across the inner plastic liner bulge.',
            'While warm, press the pliable plastic liner forward and hold in place until cooled.',
            'Reinstall mounting screws with a custom stainless washer to anchor the liner in its new recessed position.',
            'Cycle steering from lock-to-lock on full suspension droop and bump to verify zero clearance issues.',
          ]}
          affiliateSlug="sequoia-running-boards"
          ctaLabel="Search 35-inch Tires on Amazon.ca ↗"
          affiliateSublabel="BFG KO3 & Falken Wildpeak 35x12.50R18"
        />

        {/* Mod 6: Heavy-Duty Rear Sway Bar & Towing Coils */}
        <ModComparisonCard
          stepNumber={6}
          title="Heavy-Duty Rear Sway Bar &amp; Variable-Rate Towing Coils"
          categoryBadge="Towing Dynamics"
          icon={Anchor}
          priceEst="~$320–$480 CAD"
          installEffort="1.5-Hour Install"
          integration="Direct Bolt-on to Rear Multi-Link Live Axle"
          fitmentBadge="SR5, Limited & TRD Pro (Non-Air Suspensions)"
          whyThisPick="Drastically cuts trailer sway, crosswind highway push, and high tongue-weight squat when pulling 7,000 to 9,000 lb travel trailers or boat haulers."
          proTip="Because the 3rd-Gen Sequoia switched from Gen 2 independent rear suspension (IRS) to a 5-link solid rear axle, rear suspension stability is directly tied to sway bar torsional rigidity. A 24mm or 26mm solid rear anti-roll bar tightens rear lateral body roll by up to 50% without stiffening daily ride comfort."
          factoryIssue="The factory rear coil springs are tuned progressively for plush family ride compliance, resulting in noticeable rear-end squat and highway float when hitching heavy tongue weights."
          solution="Heavy-duty powdercoated chromoly rear anti-roll bar with polyurethane bushings paired with progressive-rate heavy-duty rear coil springs."
          steps={[
            'Support rear axle on sturdy jack stands with suspension slightly preloaded.',
            'Unbolt the two rear sway bar end links from the axle brackets.',
            'Remove the four 14mm bushing bracket bolts from the rear frame crossmember.',
            'Drop out factory sway bar and install heavy-duty bar with fresh polyurethane bushings.',
            'Torque sway bar mounting brackets to 44 ft-lbs and end link nuts to 38 ft-lbs.',
            'Perform a road test with hitch attached to observe improved on-center stability.',
          ]}
          affiliateSlug="sequoia-rear-sway-bar"
          ctaLabel="Search Towing Upgrades on Amazon.ca ↗"
          affiliateSublabel="Heavy-Duty Rear Anti-Roll Bars & Towing Springs"
        />
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: TECH, INTERIOR & CABIN QUIETNESS */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <Badge className="bg-purple-600 text-white font-bold text-xs mb-2">Section 4</Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Volume2 className="h-6 w-6 text-purple-500" />
            4. Tech, Interior Organization &amp; Cabin Quietness
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Protecting flagship tech screens and deadening coarse highway tire drone on 20-inch and 22-inch wheel trims.
          </p>
        </div>

        {/* Mod 7: FitcamX OEM 4K Dashcam */}
        <ModComparisonCard
          stepNumber={7}
          title="FitcamX OEM Integrated 4K Mirror Dashcam (Sequoia XK80)"
          categoryBadge="Tech & Safety"
          icon={Video}
          priceEst="~$210 CAD"
          installEffort="15-min Install"
          integration="Plug-and-Play TSS 2.5 / 3.0 Pass-Through Harness"
          fitmentBadge="All 2023–2026 Sequoia Trims"
          whyThisPick="Looks 100% factory original. Replaces the plastic rearview mirror clamshell shroud with zero dangling cables and no fuse box tapping."
          proTip="Use the included pry tool to unclip the top seam of the factory mirror cowl. The FitcamX pass-through Y-harness draws power seamlessly from the auto-dimming rearview mirror with zero wire splicing."
          factoryIssue="Aftermarket suction-cup dash cameras clutter the windshield and require routing long wires around curtain airbags and into lower 12V power sockets."
          solution="Custom ABS molded camera housing containing an Ultra HD 4K Sony Starvis sensor that snaps directly over the windshield TSS sensor cluster."
          steps={[
            'Tilt rearview mirror downwards to expose the top seam of the camera shroud.',
            'Gently pry apart the two halves of the factory clamshell shroud.',
            'Disconnect the OEM power harness from the rearview mirror.',
            'Insert the FitcamX Y-splitter harness inline between mirror and vehicle harness.',
            'Snap the new 4K camera collar into place and insert high-endurance MicroSD card.',
            'Connect via the FitcamX smartphone app over local Wi-Fi to adjust viewing angle.',
          ]}
          affiliateSlug="fitcamx-sequoia"
          ctaLabel="Check Fitment on Amazon.ca ↗"
          affiliateSublabel="TSS 2.5 / 3.0 Integrated Dashcam (~$210 CAD)"
        />

        {/* Mod 8: Multi-Layer Door Card Sound Deadening */}
        <ModComparisonCard
          stepNumber={8}
          title="Multi-Layer Butyl Sound Deadening on Door Cards (Kilmat / Noico 80 mil)"
          categoryBadge="Cabin Acoustic Comfort"
          icon={Volume2}
          priceEst="~$85 CAD per box"
          installEffort="2-Hour Install"
          integration="Self-Adhesive Butyl Foil Sheets"
          fitmentBadge="All Sequoias (Crucial for 20-inch & 22-inch Wheels)"
          whyThisPick="Dramatically reduces road rumble and coarse highway roar on coarse chip-seal Canadian highways, transforming the Sequoia into Lexus LX600 levels of vault-like silence."
          proTip="The Sequoia's massive doors contain large flat outer sheet-metal panels with minimal factory dampening. Covering just 60% of the outer skin and inner door frame with 80-mil butyl mat eliminates metal resonance and noticeably tightens bass response from factory JBL door woofers."
          factoryIssue="Heavy 20-inch (Limited/Platinum) and 22-inch (Capstone) low-profile wheel/tire packages transmit significant road vibration into the vast cabin space at 110 km/h."
          solution="Dense 80-mil viscoelastic butyl rubber bonded with aluminum foil that dissipates structural vibration into thermal energy."
          steps={[
            'Remove door handle trim cover and window switch pod using a plastic pry tool.',
            'Remove the two 10mm screws securing the door panel.',
            'Pop the perimeter push-clips and lift the door card up and off the window sill.',
            'Wipe inner steel door cavity clean with isopropyl alcohol wipes.',
            'Cut 80-mil butyl sheets to size and roll firmly onto outer door skin with a wooden roller.',
            'Reinstall door card and reconnect window and ambient lighting plugs.',
          ]}
          affiliateSlug="sequoia-sound-deadening"
          ctaLabel="Search Sound Deadening on Amazon.ca ↗"
          affiliateSublabel="Kilmat & Noico 80-mil Butyl Foil Sheets (~$85 CAD)"
        />
      </section>

      {/* Cross-Link Back to Tires Guide & Delivery Prep */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-950 p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
            <Car className="h-4 w-4" /> Next Step: Winter Wheels &amp; Rubber
          </div>
          <div className="text-lg font-bold text-zinc-100">
            Canadian Tire Sizing &amp; Heavy-Duty Wheel Downsizing
          </div>
          <p className="text-xs text-zinc-400 max-w-lg">
            Review certified 3PMSF severe winter tires, 18-inch downsizing recommendations for Platinum/Capstone, and high-torque LT-rated all-terrains for Toyota Sequoia.
          </p>
        </div>
        <Link href="/tires?model=sequoia">
          <Button className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shrink-0">
            View Sequoia Tires ↗
          </Button>
        </Link>
      </div>

      {/* Compliance Footer */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
        <p className="text-xs text-zinc-400 text-center leading-relaxed">
          toyotawaits.ca is an independent enthusiast tracking community and is not affiliated with, authorized by, or endorsed by Toyota Motor Corporation or Toyota Canada Inc. Product specifications, fitments, and torque recommendations are verified against Canadian community field testing and factory shop manuals. Always verify bolt torques with an accurate torque wrench.
        </p>
      </div>
    </div>
  );
}
