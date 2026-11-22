'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, ArrowRight, PlusCircle } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';

export function UsInventoryNotice() {
  const { market } = useMarket();
  const isHostUS =
    typeof window !== 'undefined' &&
    window.location.hostname.toLowerCase().includes('toyotawaits.com');
  const isUS = market === 'US' || isHostUS;

  if (!isUS) {
    return null;
  }

  return (
    <section
      data-testid="us-inventory-notice"
      aria-label="United States Crowdsourced Allocation and ADM Guidance"
      className="rounded-xl border border-blue-500/30 bg-gradient-to-r from-zinc-900 via-zinc-900/95 to-blue-950/30 p-4 sm:p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div className="space-y-1.5 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-blue-300">
          <Globe className="h-3.5 w-3.5" />
          <span>US Allocation &amp; ADM Guidance</span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
          Live lot sweeps currently track Canadian dealerships (BC, ON, AB). In the US, use the Crowdsourced Allocation &amp; ADM Log to check state-by-state dealer markups and transit timelines.
        </p>
      </div>

      <div className="shrink-0 flex flex-wrap items-center gap-2">
        <Link
          href="/#log-feed"
          data-testid="us-inventory-log-cta"
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500 hover:bg-blue-400 px-3.5 py-2 text-xs font-bold text-zinc-950 shadow transition-colors whitespace-nowrap"
        >
          <span>View Allocation &amp; ADM Log</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="/submit"
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200 transition-colors whitespace-nowrap"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Log Your Allocation</span>
        </Link>
      </div>
    </section>
  );
}
