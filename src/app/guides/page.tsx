import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Wrench,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Car,
  Volume2,
  Sliders,
  ShieldAlert,
  Zap,
  Snowflake,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ClipboardCheck,
  Play,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Toyota DIY Mod Guides & Delivery Prep Almanac | ToyotaWaits.ca',
  description:
    'Comprehensive Canadian DIY upgrade playbooks and delivery day prep gear for Toyota RAV4 Prime, Sienna, Grand Highlander, and Land Cruiser 250 buyers.',
  openGraph: {
    title: 'Toyota DIY Mod Guides & Delivery Prep Almanac',
    description:
      'Skip lengthy dealer waitlists with DIY trim upgrades, and prep your vehicle for Canadian roads with community-vetted accessories.',
    url: 'https://toyotawaits.ca/guides',
    siteName: 'ToyotaWaits.ca',
    locale: 'en_CA',
    type: 'website',
  },
};

const MOD_GUIDES = [
  {
    slug: 'rav4-se-mods',
    title: 'Skipping the Wait: Turn Your RAV4 Prime SE into an XSE',
    tagline: 'Skip the 12-month queue: Drop-in audio, tailored leather, and trim tools for ~$700 CAD.',
    badge: 'Skip 6–12 Mo Wait',
    model: 'RAV4 Prime (PHEV)',
    highlights: ['JBL Club 3.5" Dash Speaker Swap', 'Clazzio & EKR Tailored Leather Covers', 'Plug-and-play wiring harnesses'],
    href: '/guides/rav4-se-mods',
  },
  {
    slug: 'sienna-mods',
    title: 'The Road Dog Cruiser: Essential Sienna Family & Road-Trip Mods',
    tagline: 'Fixing rear suspension sag, flying bridge clutter, and pitch-black cargo areas.',
    badge: 'Road-Trip Tested',
    model: 'Toyota Sienna Hybrid',
    highlights: ['Air Lift 1000 in-coil air helper springs', 'Dual-tier center console bridge tray', 'Powerty hatch LED floodlights'],
    href: '/guides/sienna-mods',
  },
  {
    slug: 'grand-highlander-mods',
    title: 'Big Rig Comfort: Grand Highlander Cabin & Utility Upgrades',
    tagline: 'Drop-in hatch flood illumination, textured anti-slip charging mats, and console dividers.',
    badge: 'Cabin Utility',
    model: 'Grand Highlander',
    highlights: ['OEM PT944-style cargo hatch lamps', 'Textured silicone Qi charging pad mat', 'Winter highway stone-chip prep'],
    href: '/guides/grand-highlander-mods',
  },
  {
    slug: 'land-cruiser-mods',
    title: 'Backroads & Borderlines: LC250 1958 Trim Upgrades',
    tagline: 'Overhaul base 6-speaker paper cones, frame sliders for battery harness protection, and winter rubber.',
    badge: 'Trail & Winter Armor',
    model: 'Land Cruiser 250',
    highlights: ['Drop-in 3.5" & 6.5" speaker upgrade', 'Frame-mounted rock sliders & underside armor', 'Severe snow tire & wheel packages'],
    href: '/guides/land-cruiser-mods',
  },
  {
    slug: 'prius-mods',
    title: 'Must-Have 2023-2026 Toyota Prius & Prius Prime Accessories & Mods',
    tagline: 'The essential exterior armor, interior protection, and tech upgrades for Canadian Gen 5 Prius owners.',
    badge: 'Gen 5 Essential Armor',
    model: 'Prius & Prius Prime',
    highlights: [
      'FitcamX OEM-Integrated 4K Dashcam',
      'Molded Splash Guards & Mud Flap Kit',
      '3D All-Weather TPE Floor & Cargo Liners',
    ],
    href: '/guides/prius-mods',
  },
];

const PREP_GUIDES = [
  {
    slug: 'ev-charging',
    title: 'Level 2 Home EVSE Charging Guide',
    description: 'Canadian winter charging specs, Grizzl-E and Flo Home chargers, and provincial grants.',
    icon: Zap,
    href: '/guides/ev-charging',
  },
  {
    slug: 'winter-tires',
    title: 'Provincial Winter Tire Mandates & Fitments',
    description: 'BC Mountain Pass and Quebec legal requirements, wheel downsizing, and studless compounds.',
    icon: Snowflake,
    href: '/guides/winter-tires',
  },
  {
    slug: 'insurance',
    title: 'Canadian Hybrid & PHEV Insurance Guide',
    description: 'Battery replacement endorsements, TAG anti-theft tracking, and rate negotiation tips.',
    icon: ShieldCheck,
    href: '/guides/insurance',
  },
];

const POPULAR_GEAR = [
  {
    title: 'FitcamX OEM Integrated 4K Dashcam',
    tagline: 'Replaces TSS mirror shroud with zero dangling cables and no fuse box tapping.',
    price: '~$210 CAD',
    slug: 'fitcamx-rav4',
  },
  {
    title: 'NOCO Boost Plus GB40 1000A Jump Starter',
    tagline: 'Compact 12V lithium rescue pack preventing hybrid ready-state lockouts in freezing temps.',
    price: '~$135 CAD',
    slug: 'noco-gb40-jump-pack',
  },
  {
    title: 'Matte 9H Anti-Glare Screen Protector',
    tagline: 'Eliminates touchscreen glare and protects displays against scratches.',
    price: '~$24 CAD',
    slug: 'screen-protector-rav4',
  },
  {
    title: 'Laser-Fit Center Console Organizer Tray',
    tagline: 'Drop-in dual-tier storage dividing cavernous armrest compartments.',
    price: '~$22 CAD',
    slug: 'console-tray-rav4',
  },
  {
    title: 'J1772 Charger Port Lock Ring',
    tagline: 'Stops unauthorized public EV charger handle disconnections on PHEV models.',
    price: '~$19 CAD',
    slug: 'j1772-charger-lock',
  },
];

export default function GuidesIndexPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-16 space-y-14">
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
            <Wrench className="h-3.5 w-3.5" /> Mod &amp; Prep Almanac
          </Badge>
          <Badge variant="outline" className="border-amber-500/30 text-amber-400 text-xs">
            Canadian Buyer Resource Hub
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          DIY Mod Playbooks &amp; Delivery Day Prep
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          The piano has been drinking, and dealer allocation queues are backed up for months. Turn your standard trim into a luxury spec, prep for Canadian winter roads, and skip the line.
        </p>
      </div>

      {/* 1. Model-Specific DIY Mod Guides */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <Wrench className="h-5 w-5 text-amber-500" />
              Model-Specific DIY Mod Playbooks
            </h2>
            <p className="text-sm text-zinc-500">
              Community-proven upgrades to skip high-trim wait queues and eliminate factory annoyances.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOD_GUIDES.map((guide) => (
            <Card
              key={guide.slug}
              className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm flex flex-col justify-between hover:border-amber-500/50 transition-colors"
            >
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-400 bg-amber-500/5">
                    {guide.model}
                  </Badge>
                  <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-semibold">
                    {guide.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
                  {guide.title}
                </CardTitle>
                <CardDescription className="text-xs text-zinc-600 dark:text-zinc-400">
                  {guide.tagline}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Key Upgrades Covered:</p>
                <ul className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
                  {guide.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                <Button asChild className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs gap-1.5">
                  <Link href={guide.href}>
                    Read Mod Guide <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* 2. Curated Delivery Day Prep & Gear */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-amber-500" />
              Essential Delivery Day Prep Gear
            </h2>
            <p className="text-sm text-zinc-500">
              Drop-in accessories vetted by Canadian owners. No drilling, no wire splicing.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="border-amber-500/40 text-amber-500 hover:bg-amber-500/10 text-xs">
            <Link href="/#delivery-prep">
              View Interactive Checklist
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {POPULAR_GEAR.map((item) => (
            <Card key={item.slug} className="border-zinc-200 dark:border-zinc-800 bg-zinc-900/40 p-4 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px]">
                    {item.price}
                  </Badge>
                  <span className="text-[10px] text-zinc-500">Amazon.ca</span>
                </div>
                <h3 className="text-sm font-bold text-zinc-100 leading-tight">{item.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.tagline}</p>
                {item.slug === 'noco-gb40-jump-pack' && (
                  <div className="pt-1">
                    <a
                      href="https://www.youtube.com/watch?v=gNDH1z4Is48"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-950/80 px-2 py-1 text-[11px] text-zinc-300 hover:border-amber-500/50 hover:bg-zinc-900/90 hover:text-amber-300 transition-all shadow-2xs"
                    >
                      <Play className="h-2.5 w-2.5 text-red-500 fill-red-500 shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="leading-snug text-[10px] text-zinc-400 group-hover:text-zinc-300">
                        Comparing GB40 vs GBX45? Watch breakdown &rarr;
                      </span>
                    </a>
                  </div>
                )}
              </div>
              <Button asChild size="sm" variant="outline" className="w-full text-xs font-semibold border-zinc-700 hover:border-amber-500 hover:text-amber-400 gap-1.5 cursor-pointer">
                <a href={`/out/${item.slug}`} target="_blank" rel="noopener noreferrer sponsored">
                  Check on Amazon.ca <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. Ownership & Prep Guides */}
      <section className="space-y-6">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-amber-500" />
            Ownership &amp; Cold-Weather Guides
          </h2>
          <p className="text-sm text-zinc-500">
            Canadian winter specifications, Level 2 EV charging, and comprehensive insurance strategies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PREP_GUIDES.map((guide) => {
            const Icon = guide.icon;
            return (
              <Card key={guide.slug} className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{guide.title}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{guide.description}</p>
                </div>
                <Button asChild variant="ghost" size="sm" className="w-full justify-between text-xs text-amber-500 hover:text-amber-400 p-0 h-auto pt-2">
                  <Link href={guide.href}>
                    Read Guide <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Compliance / Affiliate Disclaimer */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 text-xs text-zinc-500 space-y-1.5 bg-zinc-50 dark:bg-zinc-900/40">
        <div className="flex items-center gap-1.5 font-semibold text-zinc-700 dark:text-zinc-300">
          <ShieldCheck className="h-4 w-4 text-amber-500" />
          Affiliate Transparency Notice
        </div>
        <p>
          ToyotaWaits.ca participates in privacy-safe affiliate programs. When you follow product links via <code>/out/[slug]</code>, we may earn an affiliate commission at no extra cost to you. As an Amazon Associate, toyotawaits.ca earns from qualifying purchases at no extra cost to you.
        </p>
      </div>
    </div>
  );
}
