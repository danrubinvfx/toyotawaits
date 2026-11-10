'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { trackCrossShopClick } from '@/lib/gear/telemetry';

export interface SisterModelInfo {
  slug: string;
  name: string;
  headline: string;
  description: string;
  waitSummary: string;
  badge: string;
}

const CROSS_SHOP_MAP: Record<string, SisterModelInfo> = {
  // Toyota -> Lexus
  'grand-highlander': {
    slug: 'lexus-tx',
    name: 'Lexus TX',
    headline: "Can't Wait for a Grand Highlander? Consider the Lexus TX",
    description:
      'Built on the same GA-K 3-row architecture with standard adult third-row legroom, available 500h F SPORT hybrid powertrain, and luxury sound insulation.',
    waitSummary: 'Est. 180–360 days • Lower allocation queues in select Canadian regions',
    badge: 'LUXURY SISTER PLATFORM',
  },
  'grand-highlander-hybrid': {
    slug: 'lexus-tx',
    name: 'Lexus TX',
    headline: "Can't Wait for a Grand Highlander Hybrid? Consider the Lexus TX",
    description:
      'Built on the same GA-K 3-row architecture with standard adult third-row legroom, available 500h F SPORT hybrid powertrain, and luxury sound insulation.',
    waitSummary: 'Est. 180–360 days • Lower allocation queues in select Canadian regions',
    badge: 'LUXURY SISTER PLATFORM',
  },
  'land-cruiser': {
    slug: 'lexus-gx550',
    name: 'Lexus GX 550',
    headline: "Cross-Shopping the Land Cruiser 250? Explore the Lexus GX 550",
    description:
      'Shared GA-F full-frame truck platform paired with a 349-hp twin-turbo 3.4L V6, standard 33-inch tires on Overtrail, and full-time 4WD with Torsen center differential.',
    waitSummary: 'Est. 270–420 days • Canadian allocation radar active',
    badge: 'LUXURY TWIN PLATFORM',
  },
  'rav4': {
    slug: 'lexus-nx',
    name: 'Lexus NX',
    headline: "Facing Long RAV4 Hybrid Queues? Explore the Lexus NX",
    description:
      'Shared TNGA-K compact crossover platform offering refined cabin insulation, NX 350h AWD hybrid (6.0 L/100 km), and NX 450h+ PHEV (61 km EV range).',
    waitSummary: 'Est. 120–420 days • Immediate dealer lot allocations observed',
    badge: 'LUXURY SISTER PLATFORM',
  },
  'rav4-hybrid': {
    slug: 'lexus-nx',
    name: 'Lexus NX',
    headline: "Facing Long RAV4 Hybrid Queues? Explore the Lexus NX",
    description:
      'Shared TNGA-K compact crossover platform offering refined cabin insulation, NX 350h AWD hybrid (6.0 L/100 km), and NX 450h+ PHEV (61 km EV range).',
    waitSummary: 'Est. 120–420 days • Immediate dealer lot allocations observed',
    badge: 'LUXURY SISTER PLATFORM',
  },
  'highlander': {
    slug: 'lexus-rx',
    name: 'Lexus RX',
    headline: "Weighing the Highlander? Explore the Lexus RX 350h / 450h+",
    description:
      'Canada’s best-selling luxury hybrid crossover featuring whisper-quiet acoustic glass, 6.5 L/100 km combined fuel efficiency, and Canadian assembly in Cambridge, Ontario.',
    waitSummary: 'Est. 120–330 days • Stable Canadian allocation flow',
    badge: 'LUXURY SISTER PLATFORM',
  },
  'highlander-hybrid': {
    slug: 'lexus-rx',
    name: 'Lexus RX',
    headline: "Weighing the Highlander Hybrid? Explore the Lexus RX 350h / 450h+",
    description:
      'Canada’s best-selling luxury hybrid crossover featuring whisper-quiet acoustic glass, 6.5 L/100 km combined fuel efficiency, and Canadian assembly in Cambridge, Ontario.',
    waitSummary: 'Est. 120–330 days • Stable Canadian allocation flow',
    badge: 'LUXURY SISTER PLATFORM',
  },

  // Lexus -> Toyota
  'lexus-tx': {
    slug: 'grand-highlander',
    name: 'Toyota Grand Highlander',
    headline: "Comparing 3-Row Luxury? Cross-Shop the Toyota Grand Highlander",
    description:
      'Shared platform offering maximum cubic cargo utility, 8-passenger capacity, Hybrid MAX powertrain, and lower starting MSRP.',
    waitSummary: 'Est. 180–365 days • High Canadian demand',
    badge: 'TOYOTA SISTER PLATFORM',
  },
  'lexus-gx550': {
    slug: 'land-cruiser',
    name: 'Toyota Land Cruiser 250',
    headline: "Looking for Overland Capability? Cross-Shop the Land Cruiser 250",
    description:
      'Shared GA-F boxed ladder frame with i-FORCE MAX hybrid torque, retro heritage styling, and off-road disconnect stabilizer bar.',
    waitSummary: 'Est. 120–270 days • Benchmark wait times',
    badge: 'TOYOTA SISTER PLATFORM',
  },
  'lexus-nx': {
    slug: 'rav4',
    name: 'Toyota RAV4',
    headline: "Cross-Shopping Compact Utility? Check Toyota RAV4 Wait Times",
    description:
      'Canada’s best-selling passenger vehicle with Hybrid and Prime Plug-in Hybrid powertrains, exceptional resale value, and broad dealer support.',
    waitSummary: 'Est. 120–420 days • Submissions from all 10 provinces',
    badge: 'TOYOTA SISTER PLATFORM',
  },
  'lexus-rx': {
    slug: 'highlander',
    name: 'Toyota Highlander',
    headline: "Evaluating Midsize Crossovers? Cross-Shop the Toyota Highlander",
    description:
      '3-row seating for up to 8 occupants, proven Hybrid AWD synergy drive, and low cost of ownership.',
    waitSummary: 'Est. 90–240 days • Balanced provincial pipeline',
    badge: 'TOYOTA SISTER PLATFORM',
  },
};

export interface CrossShopBridgeProps {
  sourceModelSlug: string;
  sourceModelName: string;
  className?: string;
}

export function CrossShopBridge({
  sourceModelSlug,
  sourceModelName,
  className = '',
}: CrossShopBridgeProps) {
  const sister = CROSS_SHOP_MAP[sourceModelSlug.toLowerCase().trim()];
  if (!sister) return null;

  const handleClick = () => {
    trackCrossShopClick(sourceModelSlug, sister.slug);
  };

  return (
    <aside
      aria-label={`Cross-Shopping Bridge: ${sister.name}`}
      data-testid={`sibling-bridge-${sister.slug}`}
      className={`rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-zinc-900/90 to-zinc-950 p-5 sm:p-6 my-6 shadow-xl text-white relative overflow-hidden ${className}`}
    >
      {/* Decorative background glow */}
      <div
        className="absolute -right-16 -top-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span>{sister.badge}</span>
            </span>
            <span className="text-xs text-zinc-400 font-medium">Cross-Shopping Bridge</span>
          </div>

          <h3 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-white">
            {sister.headline}
          </h3>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
            {sister.description}
          </p>

          <div className="text-xs text-amber-300/90 font-medium pt-0.5">
            📊 {sister.waitSummary}
          </div>
        </div>

        <div className="shrink-0 flex items-center pt-2 md:pt-0">
          <Link
            href={`/wait-times/${sister.slug}`}
            onClick={handleClick}
            data-testid="cross-shop-cta-link"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer text-center"
          >
            <span>View {sister.name} Wait Times</span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </aside>
  );
}

export default CrossShopBridge;
