import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { GuideHero } from '@/components/guides/guide-hero';
import { ToolChecklist } from '@/components/guides/tool-checklist';
import { ModComparisonCard } from '@/components/guides/mod-comparison-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Car,
  Clock,
  Layers,
  ShieldCheck,
  Video,
  Zap,
  Sparkles,
  Smartphone,
  ShieldAlert,
  Sliders,
  BatteryCharging,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Must-Have 2023-2026 Toyota Prius & Prius Prime Accessories & Mods | ToyotaWaits.ca',
  description:
    'The essential exterior armor, interior protection, and tech upgrades for Canadian Gen 5 Prius owners. Protect against winter road salt, scratches, and glare.',
  openGraph: {
    title: 'Must-Have 2023-2026 Toyota Prius & Prius Prime Accessories & Mods',
    description:
      'The essential exterior armor, interior protection, and tech upgrades for Canadian Gen 5 Prius owners.',
    url: 'https://toyotawaits.ca/guides/prius-mods',
    siteName: 'ToyotaWaits.ca',
    locale: 'en_CA',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Must-Have 2023-2026 Toyota Prius & Prius Prime Accessories & Mods',
    description:
      'The essential exterior armor, interior protection, and tech upgrades for Canadian Gen 5 Prius owners.',
  },
};

export default function PriusModsGuidePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* Hero Header */}
      <GuideHero
        badgeText="Gen 5 Prius Playbook"
        badgeIcon={Car}
        subBadgeText="5th Gen (2023–2026)"
        title="Must-Have 2023-2026 Toyota Prius & Prius Prime Accessories & Mods"
        tagline="Sleek supercar roofline, 4.3 L/100km efficiency, and raw Canadian highway gravel."
        description="The 5th-generation Toyota Prius and Prius Prime transformed Toyota's efficiency icon into a sharp, athletic sportback. But the low-slung stance and aerodynamic bodywork face harsh Canadian winters: exposed rocker panels vulnerable to road salt blast, a scratch-prone rear bumper sill, a cavernous console bin, and a slow stock 120V charging cable. Here are the 7 essential accessories and mods to armor your Gen 5 Prius."
      />

      {/* Trim Compatibility Callout Banner */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-950/30 p-4 sm:p-5 flex items-start sm:items-center gap-3 shadow-xs">
        <Sparkles className="h-5 w-5 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
        <div className="text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 font-medium leading-relaxed">
          <strong className="font-bold text-amber-700 dark:text-amber-400">Trim Compatibility:</strong>{' '}
          Compatible with 2023-2026 Prius (XLE, Limited) &amp; Prius Prime (SE, XSE, XSE Premium). All electrical and physical accessories are verified for Canadian-specification TNGA-C platform models.
        </div>
      </div>

      {/* Compliant Affiliate Transparency Notice */}
      <div className="inline-flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 border-l-2 border-amber-500/60 pl-3 py-1">
        <ShieldCheck className="h-3.5 w-3.5 text-amber-500 shrink-0" />
        <span>
          Curated enthusiast guide. As an Amazon Associate, toyotawaits.ca earns from qualifying purchases at no extra cost to you.
        </span>
      </div>

      {/* Pre-Flight Installation Checklist */}
      <ToolChecklist
        timeEst="1 Hour Total"
        difficulty="Easy (Plug & Play)"
        warrantyFriendly={true}
        tools={[
          'Nylon non-marring automotive interior pry tool',
          '8mm socket & short Phillips screwdriver (for mud flaps)',
          '70% isopropyl alcohol prep wipe (for bumper sill)',
          'Microfiber cleaning cloth & dust sticker (for screen protector)',
          'Hairdryer or heat gun (to warm adhesive tape in cold weather)',
          'Flashlight or LED work headlamp',
        ]}
      />

      {/* Upgrades Section */}
      <section className="space-y-6">
        {/* Mod 1: FitcamX OEM Dashcam */}
        <ModComparisonCard
          stepNumber={1}
          title="FitcamX OEM-Integrated 4K Dashcam (Gen 5 Prius)"
          categoryBadge="Tech & Safety"
          icon={Video}
          priceEst="~$180 CAD"
          installEffort="15-min Install"
          integration="Direct Harness Tap"
          fitmentBadge="Verified 2023–2026 Prius & Prime"
          whyThisPick="Plugs directly into factory rearview mirror harness, zero dangling wires, 4K recording, OEM-matched housing."
          proTip="Use the included pry tool to unclip the OEM mirror shroud from the top seam downwards. Listen for the satisfying click when snapping the new housing around the sensor pod."
          factoryIssue="Toyota Safety Sense 3.0 provides lane-keeping and radar cruise, but zero onboard dashcam video capture for Canadian insurance claims, road rage, or parking lot scrape disputes. Conventional aftermarket dashcams leave ugly dangling cables across the sleek minimalist dash."
          solution="The FitcamX replaces the factory plastic rearview mirror collar with an identical ABS housing containing a 4K Sony IMX335 sensor. Draws power cleanly from the auto-dimming mirror harness using a plug-and-play inline Y-splitter—zero fuse taps and zero battery drain."
          steps={[
            'Tilt the rearview mirror downward to access the upper edge of the factory camera cover.',
            'Insert the plastic pry tool along the center seam to release the two OEM clamshell halves.',
            'Unplug the factory 10-pin power harness connected to the auto-dimming rearview mirror.',
            'Plug the FitcamX Y-splitter harness in-line between the vehicle plug and the mirror.',
            'Tuck the excess wire neatly into the cavity and snap the FitcamX molded housing into the factory windshield mounts.',
            'Insert the included high-endurance MicroSD card and format it using the companion smartphone Wi-Fi app.',
          ]}
          affiliateSlug="fitcamx-prius"
          ctaLabel="Check Fitment on Amazon.ca ↗"
          affiliateSublabel="TSS 3.0 Plug-and-Play Tap (~$180 CAD)"
        />

        {/* Mod 2: Molded Splash Guards & Mud Flap Kit */}
        <ModComparisonCard
          stepNumber={2}
          title="Molded Splash Guards & Mud Flap Kit (Front & Rear)"
          categoryBadge="Exterior Armor"
          icon={ShieldAlert}
          priceEst="~$45 CAD"
          installEffort="20-min Install"
          integration="OEM Fender Clip-In"
          fitmentBadge="Verified 2023–2026 Prius & Prime"
          whyThisPick="Protects lower doors and side skirts from Canadian road salt, winter gravel, and slush spray. No drilling required."
          proTip="Turn the front steering wheel to full lock to easily access the wheel well liner fasteners without having to jack up the car or remove tires."
          factoryIssue="The Gen 5 Prius features flared rocker panels and a low aerodynamic profile, but Toyota omitted factory splash guards. Canadian winter salt, highway sand, and gravel spray kick directly off the front tires, sandblasting painted doors and lower sills."
          solution="Heavy-duty molded ABS splash guards contoured specifically to the Gen 5 front and rear body arches. Fastens directly to existing factory push-pin and screw locations with zero body drilling."
          steps={[
            'Turn the steering wheel to full left lock to expose the front left fender liner screws.',
            'Remove the two factory lower screws and lower plastic expanding rivet from the wheel arch.',
            'Place the molded splash guard against the fender contour, aligning mounting holes.',
            'Re-install the factory screws through the flap and tighten snugly (do not overtighten).',
            'Turn wheels to full right lock and repeat for the front right side.',
            'For the rear flaps, use an offset stubby Phillips screwdriver to secure into factory bumper liner clip holes.',
          ]}
          affiliateSlug="prius-mud-flaps"
          ctaLabel="Check Fitment on Amazon.ca ↗"
          affiliateSublabel="Complete 4-Piece Set (~$45 CAD)"
        />

        {/* Mod 3: Textured Rear Bumper Sill Protector Guard */}
        <ModComparisonCard
          stepNumber={3}
          title="Textured Rear Bumper Sill Protector Guard"
          categoryBadge="Exterior Protection"
          icon={ShieldCheck}
          priceEst="~$38 CAD"
          installEffort="5-min Install"
          integration="3M VHB Direct Bond"
          fitmentBadge="Verified 2023–2026 Prius & Prime"
          whyThisPick="Heavy-duty scratch protection for the rear hatch threshold when loading heavy luggage, cargo, or strollers."
          proTip="Clean the bumper shelf thoroughly with 70% isopropyl alcohol and warm the 3M tape backing with a hairdryer for 30 seconds if installing during sub-15°C Canadian weather."
          factoryIssue="The aerodynamic liftback tailgate exposes a flat, painted bumper ledge directly across the load sill. Dragging heavy grocery bins, luggage, golf bags, or strollers across this threshold leaves permanent clear-coat scratches and gouges within weeks."
          solution="A durable, textured impact-resistant ABS protector custom-formed to the 2023-2026 Prius rear bumper geometry. Pre-applied automotive 3M VHB adhesive bonds permanently to protect against impacts."
          steps={[
            'Wash the rear bumper thoroughly and degrease the sill with an isopropyl alcohol wipe.',
            'Dry-fit the protector with the hatch closed to verify center alignment with the trunk latch.',
            'Use blue painter\'s tape on the bumper edges to mark your left and right reference guidelines.',
            'Peel back 2 inches of the red 3M backing film from both outer ends.',
            'Press the protector firmly into position, slowly pull the remaining red tape liner, and apply firm palm pressure across the entire length.',
          ]}
          affiliateSlug="prius-bumper-protector"
          ctaLabel="Check Fitment on Amazon.ca ↗"
          affiliateSublabel="Scratch-Proof Textured ABS (~$38 CAD)"
        />

        {/* Mod 4: Custom-Fit All-Weather 3D TPE Floor Liners & Trunk Mat */}
        <ModComparisonCard
          stepNumber={4}
          title="Custom-Fit All-Weather 3D TPE Floor Liners & Trunk Mat"
          categoryBadge="Interior Protection"
          icon={Layers}
          priceEst="~$140 CAD"
          installEffort="10-min Install"
          integration="Factory Floor Anchor Lock"
          fitmentBadge="Verified 2023–2026 Prius & Prime"
          whyThisPick="Deep-dish spill containment engineered for snow, winter slush, and wet boots. Odorless all-weather TPE material."
          proTip="If the trunk cargo liner has shipping creases from packaging, lay it flat on a warm floor or under direct sun for 30 minutes to let the thermoformed memory TPE settle perfectly."
          factoryIssue="Dealer-supplied carpet floor mats quickly absorb melted snow, gravel, and caustic road salt during Canadian winters. Liquid brine seeps into sub-carpet wiring channels, causing white salt crusts and persistent mildew odors."
          solution="High-wall 3D laser-scanned thermoplastic elastomer (TPE) floor mats that trap up to 2 liters of liquid per footwell. Features factory twist-lock grommets to prevent forward pedal slippage."
          steps={[
            'Rotate the factory floor retention clips 90 degrees and remove the OEM carpet mats.',
            'Vacuum the cabin floor pan thoroughly to remove grit and salt residue.',
            'Drop the driver\'s side 3D mat in place and twist the dual floor anchors until they lock securely.',
            'Insert the passenger front mat and seamless one-piece rear row mat across the center tunnel.',
            'Drop the molded cargo tray into the trunk, ensuring the side wings tuck cleanly behind the wheel wells.',
          ]}
          affiliateSlug="prius-all-weather-liners"
          ctaLabel="Check Fitment on Amazon.ca ↗"
          affiliateSublabel="Full Cabin & Trunk Cargo Set (~$140 CAD)"
        />

        {/* Mod 5: Center Console 2-Tier Organizer Tray & Lower Cubby Insert */}
        <ModComparisonCard
          stepNumber={5}
          title="Center Console 2-Tier Organizer Tray & Lower Cubby Insert"
          categoryBadge="Cabin Storage"
          icon={Sliders}
          priceEst="~$22 CAD"
          installEffort="2-min Install"
          integration="Drop-In Friction Fit"
          fitmentBadge="Verified 2023–2026 Prius & Prime"
          whyThisPick="Divides the deep Gen 5 center console bin into organized, anti-rattle tiers for cards, sunglasses, and phones."
          proTip="The upper tray features a molded corner cutout that allows USB-C cables to route from the internal armrest ports up to your phone without pinching."
          factoryIssue="The Gen 5 Prius armrest console is a deep, unpartitioned bin. Small daily essentials like sunglasses, parking transponders, pens, and loose change slide to the bottom and become impossible to find while driving."
          solution="A dual-piece molded ABS organization kit: a drop-in top tray for quick-access essentials with textured non-slip silicone inserts, plus a lower divider tray that keeps the bottom cavity neatly separated."
          steps={[
            'Lift the center console armrest lid completely.',
            'Slide the lower bin divider tray into the base of the console cavity.',
            'Rest the secondary top organizer tray onto the molded upper interior lip of the bin.',
            'Place the included non-slip rubber mats into each divided section to eliminate rattles.',
            'Simply lift the upper tray out anytime you need access to bulky items stored underneath.',
          ]}
          affiliateSlug="prius-console-organizer"
          ctaLabel="Check Fitment on Amazon.ca ↗"
          affiliateSublabel="Anti-Rattle 2-Tier Organizer (~$22 CAD)"
        />

        {/* Mod 6: Matte Anti-Glare Tempered Glass Screen Protector */}
        <ModComparisonCard
          stepNumber={6}
          title="Matte Anti-Glare Tempered Glass Screen Protector (8&quot; / 12.3&quot;)"
          categoryBadge="Cabin Tech"
          icon={Smartphone}
          priceEst="~$24 CAD"
          installEffort="5-min Install"
          integration="Optical Static Cling"
          fitmentBadge="Verified 8&quot; &amp; 12.3&quot; Displays"
          whyThisPick="9H hardness, resists fingerprint grease and eliminates reflection on the large multimedia display."
          proTip="Turn off the vehicle or activate 'Screen Off' mode in the display settings before installing so the dark glass background reveals any micro-dust particles."
          factoryIssue="The large 8-inch (XLE/SE) and 12.3-inch (Limited/XSE) multimedia touchscreen sits prominently on the upper dashboard. The raked Gen 5 windshield causes intense sun reflection and glare, while the factory surface attracts greasy fingerprints instantly."
          solution="An etched matte 9H tempered glass screen protector with an oleophobic coating that diffuses harsh overhead sunlight, resists finger grease, and preserves ultra-responsive touch sensitivity."
          steps={[
            'Turn the car off and close all car windows to minimize airborne dust in the cabin.',
            'Wipe the display thoroughly using the included wet alcohol cleaning wipe.',
            'Dry the glass completely with the microfiber cloth and use the dust-absorber sticker to dab away all lint.',
            'Peel the protective film from the adhesive side of the tempered glass shield.',
            'Align the top corners with the screen bezel and gently let the static silicone layer adhere across the panel.',
            'Use the included card squeegee to push any remaining air bubbles toward the edges.',
          ]}
          affiliateSlug="prius-screen-protector"
          ctaLabel="Check Fitment on Amazon.ca ↗"
          affiliateSublabel="9H Matte Glare Reduction (~$24 CAD)"
        />

        {/* Mod 7: Dual-Voltage Portable Level 1 / Level 2 EV Charger (Prius Prime) */}
        <ModComparisonCard
          stepNumber={7}
          title="Dual-Voltage Portable Level 1 / Level 2 EV Charger (Prius Prime)"
          categoryBadge="Prime / PHEV Charging"
          icon={BatteryCharging}
          priceEst="~$195 CAD"
          installEffort="Plug & Play"
          integration="J1772 Direct Plug"
          fitmentBadge="Prius Prime PHEV (13.6 kWh)"
          whyThisPick="NEMA 5-15 (120V) and NEMA 14-50 (240V) capable. Charges the Prime traction battery in ~4 hours without a fixed wallbox."
          proTip="Keep this dual-voltage charger in the Prius Prime underfloor trunk organizer. When visiting friends, family, or cottages across Canada, you can plug into a 240V dryer or RV outlet for high-speed charging anywhere."
          factoryIssue="Toyota supplies the Prius Prime with a slow 120V Level 1 trickle charger that takes over 11 hours to recharge the 13.6 kWh battery pack from empty. Homeowners without dedicated $1,000+ hardwired wallboxes are stuck waiting half a day for pure EV range."
          solution="A portable 16A dual-voltage J1772 EVSE with interchangeable NEMA 5-15 (standard 120V wall outlet) and NEMA 14-50 (240V heavy outlet) plugs. Delivers 3.8 kW on 240V, recharging the Prime in roughly 4 hours."
          steps={[
            'Connect the NEMA 14-50 plug to an existing 240V garage outlet (or attach the 120V adapter for regular plugs).',
            'Verify the digital screen illuminates green, displaying standby voltage and ready status.',
            'Press the Prius Prime charging door on the right rear fender to release the hatch.',
            'Remove the protective rubber inlet cap and plug the J1772 connector firmly into the car inlet.',
            'The dashboard charging indicator illuminates green; full recharge finishes in ~4 hours on 240V.',
          ]}
          affiliateSlug="prius-prime-portable-charger"
          ctaLabel="Check Fitment on Amazon.ca ↗"
          affiliateSublabel="16A Dual 120V/240V Portable EVSE (~$195 CAD)"
        />
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
            Check Live Prius Wait Times
          </Link>
        </Button>
        <Link href="/guides" className="text-xs text-zinc-500 hover:text-zinc-300">
          Back to Mod Guides Hub
        </Link>
      </div>
    </div>
  );
}
