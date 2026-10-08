import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { GuideHero } from '@/components/guides/guide-hero';
import { ToolChecklist } from '@/components/guides/tool-checklist';
import { ModComparisonCard } from '@/components/guides/mod-comparison-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Compass,
  Clock,
  Volume2,
  ShieldCheck,
  Shield,
  Snowflake,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Backroads & Borderlines: Land Cruiser 250 (1958) Mods | ToyotaWaits.ca',
  description:
    'Essential DIY upgrades for Canadian Toyota Land Cruiser 250 owners: 1958 trim drop-in speaker upgrades, frame-mounted rock sliders, and winter wheel packages.',
  openGraph: {
    title: 'Backroads & Borderlines: LC250 1958 Trim Upgrades & Trail Prep',
    description:
      'Community-tested modifications to fix the base Land Cruiser 1958 trim: audio upgrades, rock sliders, and severe Canadian winter rubber.',
    url: 'https://toyotawaits.ca/guides/land-cruiser-mods',
    siteName: 'ToyotaWaits.ca',
    locale: 'en_CA',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Land Cruiser 250 (1958) Mods & Trail Prep',
    description:
      'Drop-in speaker upgrades, heavy-duty rock sliders, and Canadian winter tire setups for the new LC250.',
  },
};

export default function LandCruiserModsGuidePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* Hero Header */}
      <GuideHero
        badgeText="Land Cruiser 250 Playbook"
        badgeIcon={Compass}
        subBadgeText="J250 (1958 & Base Trims)"
        title="Backroads & Borderlines: LC250 1958 Trim Upgrades"
        tagline="The round headlights look sharp at 2:00 AM, but the factory speakers sound like a transistor radio in a rain barrel."
        description="The Land Cruiser 250 brings real off-road hardware back to Canadian Toyota showrooms. But buyers opting for the classic '1958' retro-round headlight trim face a few budget compromises: an anemic base audio system, unprotected rocker panels, and massive 20-inch street wheels on higher trims. Here is how Canadian owners outfit the 1958 for wilderness durability."
      />

      {/* Pre-Flight Checklist */}
      <ToolChecklist
        timeEst="2.5 Hours Total"
        difficulty="Moderate (Hand Tools)"
        warrantyFriendly={true}
        tools={[
          'Nylon non-marring pry tool kit (for dash grilles)',
          '10mm socket, ratchet & extension',
          '17mm & 19mm deep sockets (for rock slider frame bolts)',
          'Torque wrench (rated to 95 ft-lbs)',
          'Anti-seize compound for chassis hardware',
        ]}
      />

      {/* Upgrades Section */}
      <section className="space-y-6">
        {/* Mod 1: Dash & Front Door Speaker Upgrade */}
        <ModComparisonCard
          stepNumber={1}
          title="Factory Speaker Drop-In Upgrades (1958 Trim Audio Fix)"
          categoryBadge="Sound & Acoustics"
          icon={Volume2}
          priceEst="~$185 CAD"
          factoryIssue="The base 1958 trim comes with an elementary 6-speaker sound system equipped with tiny, lightweight paper-cone dash tweeters. Over highway tire rumble and wind noise, dialogue and music sound muffled, flat, and strained."
          solution="High-sensitivity (89–91 dB) 3.5-inch 2-way coaxial dash speakers and matched front door drivers connected via plug-and-play Toyota wiring harnesses. Delivers crystal-clear acoustics without requiring an external amplifier or cutting factory harnesses."
          steps={[
            'Pry up the left and right dash speaker grilles at the corners using a nylon pry tool.',
            'Remove the two 10mm mounting bolts holding the factory paper tweeters.',
            'Unplug the factory Toyota harness connector and clip in the plug-and-play adapter harness.',
            'Fasten the new 3.5-inch speakers in place, snap the grilles back flush, and enjoy concert-grade highs.',
          ]}
          affiliateSlug="lc250-speaker-upgrade"
          affiliateLabel="Check LC250 Speaker Upgrades"
          affiliateSublabel="Plug & Play Dash / Door Kit (~$185 CAD)"
        />

        {/* Mod 2: Rock Sliders & Underside Armor */}
        <ModComparisonCard
          stepNumber={2}
          title="Frame-Mounted Heavy-Duty Steel Rock Sliders & Sill Armor"
          categoryBadge="Armor & Protection"
          icon={Shield}
          priceEst="~$850 CAD"
          factoryIssue="Unlike legacy 70-series or 80-series Cruisers, the LC250 features hybrid electrical conduits and battery cooling passages routed beneath the body. Standard factory side steps are thin sheet metal that will crumple directly into the vehicle sills on rock obstacles."
          solution="Heavy-duty 1.75-inch DOM tubular steel rock sliders that bolt directly to existing chassis frame holes. They provide 100% kick-out protection against boulders, shield hybrid wiring conduits, and function as certified high-lift jack points."
          steps={[
            'Support the slider on a floor jack aligned with the factory threaded frame bracket holes.',
            'Apply anti-seize to high-tensile Grade 8 mounting bolts.',
            'Thread all chassis bolts finger-tight before torquing sequentially to 85 ft-lbs.',
            'Apply touch-up black enamel to prevent winter road brine corrosion around frame seams.',
          ]}
          affiliateSlug="lc250-rock-sliders"
          affiliateLabel="View Land Cruiser Rock Sliders"
          affiliateSublabel="Heavy-Duty Frame-Mounted Armor (~$850 CAD)"
        />

        {/* Mod 3: Canadian Winter Severe Snow Wheel & Tire Setup */}
        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <Snowflake className="h-5 w-5 text-sky-400" />
                3. Canadian Severe Snow Package: 18-Inch Downsizing Strategy
              </CardTitle>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Essential Winter Prep
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <p>
              Canadian Land Cruiser 250s delivered on 20-inch wheels suffer from harsh impacts over frozen winter potholes and limited tire sidewall cushion. Community consensus strongly recommends downsizing to 18-inch wheels for Canadian winter driving.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-900/40">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">Recommended Tire Size</div>
                <div className="text-amber-500 font-mono font-bold text-sm mt-0.5">265/70R18 (32.6&quot; Diameter)</div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Maintains exact factory speedometer calibration, provides generous 7.3-inch sidewall cushion, and clears front brake calipers cleanly.
                </p>
              </div>

              <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-900/40">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">Top Studless Winter Rubber</div>
                <div className="text-emerald-500 font-mono font-bold text-sm mt-0.5">Nokian Hakkapeliitta LT3 / Blizzak LT</div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Three-Peak Mountain Snowflake (3PMSF) certified for legal transit over BC Coquihalla Highway and Quebec Dec 1 mandates.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Button asChild variant="outline" className="text-xs h-auto py-2.5 cursor-pointer border-zinc-300 dark:border-zinc-700">
                <a href="/guides/winter-tires" className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-100">
                  <Snowflake className="h-3.5 w-3.5 text-sky-400" />
                  View Full Canadian Winter Tire Guide &amp; Fitments
                </a>
              </Button>
            </div>
          </CardContent>
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
      </div>

      {/* Navigation CTA */}
      <div className="pt-4 flex items-center justify-between">
        <Button asChild className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold gap-2 cursor-pointer">
          <Link href="/#estimator">
            <Clock className="h-4 w-4" />
            Check Live Land Cruiser Wait Times
          </Link>
        </Button>
        <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
