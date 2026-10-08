import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { GuideHero } from '@/components/guides/guide-hero';
import { ToolChecklist } from '@/components/guides/tool-checklist';
import { ModComparisonCard } from '@/components/guides/mod-comparison-card';
import { Button } from '@/components/ui/button';
import {
  Car,
  Clock,
  Layers,
  ShieldCheck,
  Video,
  Lightbulb,
  Sliders,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'The Road Dog Cruiser: Essential Toyota Sienna Mods & Upgrades | ToyotaWaits.ca',
  description:
    'Essential DIY upgrades for Canadian Toyota Sienna owners: Air Lift 1000 rear suspension helpers, console bridge trays, FitcamX OEM dashcam, and cargo hatch LED lighting.',
  openGraph: {
    title: 'The Road Dog Cruiser: Essential Toyota Sienna Mods & Road-Trip Prep',
    description:
      'Community-proven DIY upgrades to fix factory minivan annoyances: suspension sag, dark trunks, and flying bridge clutter.',
    url: 'https://toyotawaits.ca/guides/sienna-mods',
    siteName: 'ToyotaWaits.ca',
    locale: 'en_CA',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Essential Toyota Sienna Mods & Road-Trip Prep',
    description:
      'Air Lift 1000 helper springs, FitcamX OEM-look dashcam, and hatch LED lighting for Canadian Sienna families.',
  },
};

export default function SiennaModsGuidePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* Hero Header */}
      <GuideHero
        badgeText="Sienna Mod Playbook"
        badgeIcon={Car}
        subBadgeText="4th Gen (2021–2026)"
        title="The Road Dog Cruiser: Essential Sienna Family & Road-Trip Mods"
        tagline="The kids are asleep, the coffee is lukewarm, and the highway stretches past Thunder Bay."
        description="The 4th-generation Toyota Sienna hybrid is Canada's definitive road-trip machine, but Toyota left a few glaring gaps: a rear suspension that squats under heavy cargo, a cavernous center console bridge that swallows phones, and a single dim cargo bulb. Here is how Canadian owners dial it in before the cross-country trek."
      />

      {/* Pre-Flight Checklist */}
      <ToolChecklist
        timeEst="1.5 Hours Total"
        difficulty="Moderate (Hand Tools)"
        warrantyFriendly={true}
        tools={[
          'Nylon interior trim removal pry tool',
          'T20 Torx driver (for mirror shroud)',
          'Floor jack & jack stands (for rear air springs)',
          'Flathead screwdriver or panel clip remover',
          'Bicycle tire pump or 12V portable tire inflator',
          'Zip ties & silicone spray lubricant',
        ]}
      />

      {/* Upgrades Section */}
      <section className="space-y-6">
        {/* Mod 1: Center Console Bridge */}
        <ModComparisonCard
          stepNumber={1}
          title="Center Console Bridge & Under-Bridge Organizers"
          categoryBadge="Interior Utility"
          icon={Layers}
          priceEst="~$35 CAD"
          factoryIssue="Toyota's 'bridge console' design creates a huge open floor cavity beneath the shifter. Without dividers, backpacks, drink bottles, and charging cords slide around and wedge themselves behind the gas pedal."
          solution="Dual-tier molded ABS organizer trays with textured anti-slip rubber inserts. The top tray holds phones and sunglasses directly under the shifter, while the lower tray compartmentalizes wipes, tablets, and road snacks."
          steps={[
            'Slide front driver and passenger seats back for clearance.',
            'Drop the lower bridge tray into the base carpeting—it friction-locks into the floor contours with zero tape.',
            'Insert the upper console armrest tray to create dual storage levels inside the main armrest box.',
            'Wipe clean in seconds whenever juice boxes spill.',
          ]}
          affiliateSlug="sienna-console-bridge-tray"
          affiliateLabel="Check Sienna Bridge Trays"
          affiliateSublabel="Custom 4th-Gen Fitment (~$35 CAD)"
        />

        {/* Mod 2: Air Lift 1000 */}
        <ModComparisonCard
          stepNumber={2}
          title="Air Lift 1000 In-Coil Air Helper Springs (#60858)"
          categoryBadge="Suspension & Towing"
          icon={Sliders}
          priceEst="~$165 CAD"
          factoryIssue="The Sienna's soft multi-link rear suspension rides like a cloud empty, but squats severely when loaded with 7 passengers, hitch-mounted 4-bike racks, and rooftop cargo boxes. This causes bottoming out over Canadian frost heaves and misaligns LED headlight aim into oncoming traffic."
          solution="Durable polyurethane air cylinders that slip directly inside the factory rear coil springs. Inflated between 5–35 PSI via standard Schrader valves, they level the vehicle, eliminate sag, and stabilize heavy crosswinds."
          steps={[
            'Jack up the rear suspension by the center jack point and secure with jack stands to let rear springs droop.',
            'Squish the deflated red Air Lift cylinders into hot water to soften, then squeeze them between the coil spring windings.',
            'Route the included black air lines through the spring perches to the rear bumper or tow hitch bracket.',
            'Install Schrader valves and inflate to 15–20 PSI for heavy road-trip loads (5 PSI when driving unloaded).',
          ]}
          affiliateSlug="sienna-air-lift-1000"
          affiliateLabel="View Air Lift 1000 Kit"
          affiliateSublabel="Sienna In-Coil Helper Kit (~$165 CAD)"
        />

        {/* Mod 3: FitcamX OEM Dashcam */}
        <ModComparisonCard
          stepNumber={3}
          title="FitcamX Integrated OEM-Style 4K Dashcam"
          categoryBadge="Safety & Electronics"
          icon={Video}
          priceEst="~$210 CAD"
          factoryIssue="Standard suction-cup dashcams clutter the massive Sienna windshield and require running long wires down the A-pillar, potentially interfering with side curtain airbag deployment."
          solution="Custom ABS plastic housing that completely replaces the factory TSS (Toyota Safety Sense) rearview mirror cover. It draws power from an included plug-and-play pass-through Y-harness tapped directly behind the auto-dimming mirror."
          steps={[
            'Pry off the factory two-piece plastic clamshell behind the rearview mirror using a nylon trim tool.',
            'Unplug the factory rain-sensor or auto-dimming mirror harness connector.',
            'Insert the FitcamX plug-and-play Y-splitter harness between the factory plug and mirror socket.',
            'Snap the FitcamX camera housing into the factory mirror base clips and insert the high-endurance MicroSD card.',
          ]}
          affiliateSlug="sienna-fitcamx-dashcam"
          affiliateLabel="Check FitcamX 4K on Amazon"
          affiliateSublabel="Plug & Play Mirror Tap (~$210 CAD)"
        />

        {/* Mod 4: Powerty Hatch LEDs */}
        <ModComparisonCard
          stepNumber={4}
          title="Powerty Dual Rear Liftgate Cargo LED Flood Lights"
          categoryBadge="Lighting Upgrade"
          icon={Lightbulb}
          priceEst="~$48 CAD"
          factoryIssue="The factory trunk light is a single, dim incandescent bulb mounted low on the left trim panel. The second you load one hockey bag or stroller, the light is blocked, leaving the entire cargo floor in pitch darkness."
          solution="Dual ultra-bright LED strip lenses that replace the plastic access knockouts on the inside of the rear hatch. When the power liftgate opens, the lamps shine downward from above, flooding the trunk and ground with bright daylight white LED light."
          steps={[
            'Pop out the two rectangular service access panels on the underside of the open rear tailgate.',
            'Fish the plug-and-play wiring harness through the factory liftgate rubber grommet down to the original trunk light socket.',
            'Plug in the inline bulb adapter tap—no splicing, soldering, or wire cutting required.',
            'Snap the LED light pods flush into the tailgate access holes and test with the hatch button.',
          ]}
          affiliateSlug="sienna-hatch-led-lights"
          affiliateLabel="Check Sienna Hatch LEDs"
          affiliateSublabel="Dual Liftgate Light Pods (~$48 CAD)"
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
      </div>

      {/* Navigation CTA */}
      <div className="pt-4 flex items-center justify-between">
        <Button asChild className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold gap-2 cursor-pointer">
          <Link href="/#estimator">
            <Clock className="h-4 w-4" />
            Check Live Sienna Wait Times
          </Link>
        </Button>
        <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
