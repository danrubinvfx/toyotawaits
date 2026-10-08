import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { GuideHero } from '@/components/guides/guide-hero';
import { ToolChecklist } from '@/components/guides/tool-checklist';
import { ModComparisonCard } from '@/components/guides/mod-comparison-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Car,
  Clock,
  Layers,
  ShieldCheck,
  Zap,
  Lightbulb,
  ShieldAlert,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Big Rig Comfort: Essential Grand Highlander Mods | ToyotaWaits.ca',
  description:
    'Essential DIY utility and cabin upgrades for Canadian Toyota Grand Highlander owners: OEM-style hatch LED lamps, console organizers, and anti-slip Qi mats.',
  openGraph: {
    title: 'Big Rig Comfort: Essential Grand Highlander Mods & Cabin Upgrades',
    description:
      'Community-proven DIY upgrades to fix common Grand Highlander annoyances: dark rear cargo bins, sliding phones, and console clutter.',
    url: 'https://toyotawaits.ca/guides/grand-highlander-mods',
    siteName: 'ToyotaWaits.ca',
    locale: 'en_CA',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Essential Toyota Grand Highlander Mods & Cabin Upgrades',
    description:
      'Rear cargo hatch LED lighting, anti-slip Qi charging mats, and console dividers for Grand Highlander owners.',
  },
};

export default function GrandHighlanderModsGuidePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* Hero Header */}
      <GuideHero
        badgeText="Grand Highlander Playbook"
        badgeIcon={Car}
        subBadgeText="1st Gen (2024–2026)"
        title="Big Rig Comfort: Grand Highlander Utility & Cabin Upgrades"
        tagline="Three rows of steel, six months in allocation purgatory, and one massive dash shelf."
        description="The Toyota Grand Highlander delivers limousine-grade cabin space, but Canadian owners quickly run into small ergonomic oversights: smartphones sliding off the slick Qi charging pad, a pitch-black trunk at night, and a center console deep enough to lose a hockey puck. Here are the top community-proven fixes."
      />

      {/* Pre-Flight Checklist */}
      <ToolChecklist
        timeEst="45 Minutes Total"
        difficulty="Easy (Plug & Play)"
        warrantyFriendly={true}
        tools={[
          'Nylon non-marring pry tool kit',
          'Small flathead screwdriver (wrapped in painter tape)',
          'Microfiber cleaning cloth & isopropyl alcohol wipe',
          'Flashlight or work headlamp',
        ]}
      />

      {/* Upgrades Section */}
      <section className="space-y-6">
        {/* Mod 1: Rear Cargo Hatch LED Lamps */}
        <ModComparisonCard
          stepNumber={1}
          title="OEM-Style Dual Rear Cargo Hatch Flood Lamps"
          categoryBadge="Lighting Upgrade"
          icon={Lightbulb}
          priceEst="~$60 CAD"
          factoryIssue="Despite being a 3-row flagship hauler, the Grand Highlander trunk has only a single weak side courtesy light. When hockey bags, coolers, or camping gear are loaded, the trunk is pitch-black at night."
          solution="Dual high-output LED light assemblies (compatible with OEM PT944-48260-C0 style harnesses) that snap directly into the rear liftgate inner service trim. They flood the entire cargo bed and ground from overhead."
          steps={[
            'Open the power liftgate and pry off the two rectangular service inspection blanks on the hatch underside.',
            'Locate the factory pre-wired wiring pigtail clipped behind the liftgate panel (or route the plug-and-play jumper).',
            'Connect the LED lamp harness with the factory-style click connector.',
            'Snap the flush-mounted LED light housings into place and toggle the touch-sensitive integrated lens switches.',
          ]}
          affiliateSlug="gh-rear-cargo-lamps"
          affiliateLabel="Check Grand Highlander Cargo Lamps"
          affiliateSublabel="Dual Liftgate LED Kit (~$60 CAD)"
        />

        {/* Mod 2: Console Divider & Tray */}
        <ModComparisonCard
          stepNumber={2}
          title="Center Armrest Dual-Tier Organizer & Divider Tray"
          categoryBadge="Interior Storage"
          icon={Layers}
          priceEst="~$28 CAD"
          factoryIssue="The Grand Highlander's center console storage bin is cavernous—over 10 inches deep. Small essentials like sunglasses, parking passes, wallets, and pens sink to the bottom and become impossible to find while driving."
          solution="Precision laser-scanned ABS dual-tier organizer tray with textured rubber liners and integrated USB cord pass-through notches. Divides the bin into quick-access top storage while keeping bulky items underneath."
          steps={[
            'Slide the butterfly armrest open.',
            'Drop the molded tray directly onto the upper console ledger lips—no fasteners or adhesive required.',
            'Route your phone charging cable through the built-in side notch.',
            'Lift the tray out effortlessly whenever you need access to the lower deep storage vault.',
          ]}
          affiliateSlug="gh-console-organizer-tray"
          affiliateLabel="View Console Organizer Tray"
          affiliateSublabel="Grand Highlander Custom Fit (~$28 CAD)"
        />

        {/* Mod 3: Anti-Slip Qi Wireless Charging Mat */}
        <ModComparisonCard
          stepNumber={3}
          title="Anti-Slip Textured Silicone Qi Wireless Charging Mat"
          categoryBadge="Cabin Ergonomics"
          icon={Zap}
          priceEst="~$22 CAD"
          factoryIssue="The factory Qi wireless charging tray has a slick, hard plastic finish. Under normal Canadian winter cornering or acceleration, smartphones slide across the shelf, immediately disconnecting the wireless charging cycle and vibrating loudly."
          solution="Heavy-duty textured silicone rubber pad custom-cut to the exact contours of the Grand Highlander charging shelf. Provides high-friction grip without dampening induction coil charging speeds."
          steps={[
            'Wipe down the factory charging shelf with an isopropyl alcohol wipe to remove dust.',
            'Drop the flexible silicone mat into place; the raised border edges lock against the console walls.',
            'Place your iPhone or Android phone onto the mat—it stays firmly anchored over the charging coils through tight turns.',
          ]}
          affiliateSlug="gh-wireless-charger-mat"
          affiliateLabel="Check Wireless Charger Mat"
          affiliateSublabel="Non-Slip Silicone Mat (~$22 CAD)"
        />

        {/* Bonus Canadian Road Prep: Windshield & Hood Defense */}
        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-500" />
              Bonus Canadian Prep: Front Fascia &amp; Hood Deflector Armor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <p>
              The Grand Highlander has a blunt, upright front fascia that acts as a magnet for highway gravel and road grit thrown by semi-trucks on Highway 401 or the Coquihalla.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-900/40">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">Hood Edge Deflector</div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Aerodynamic acrylic bug/stone deflector sweeps airflow over the hood lip, preventing rock chips from pitting the leading sheet metal.
                </p>
              </div>
              <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-900/40">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">Front Bumper PPF Film</div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  8-mil self-healing polyurethane paint protection film applied to the bumper and radar sensor window prevents winter brine sandblasting.
                </p>
              </div>
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
            Check Live Grand Highlander Wait Times
          </Link>
        </Button>
        <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
