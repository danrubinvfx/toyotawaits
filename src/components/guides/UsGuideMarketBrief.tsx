import React from 'react';
import { ShieldCheck, DollarSign, Clock, Factory, FileCheck2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface UsGuideMarketBriefProps {
  modelName: string;
  msrpUsdRange: string;
  assemblyPlant: string;
  transitTimeline?: string;
  admRange?: string;
  verdictSummary: string;
}

/**
 * Server-rendered US Market Intelligence brief for 2026-vs-2027 guides on toyotawaits.com.
 * Ensures USD MSRP, US assembly plant / allocation transit timelines (30–90 days),
 * ADM ranges ($0 MSRP to +$3,000+), and US state deposit refund rules appear on first byte.
 */
export function UsGuideMarketBrief({
  modelName,
  msrpUsdRange,
  assemblyPlant,
  transitTimeline = '30–90 days once allocated',
  admRange = '$0 MSRP to +$3,000+ ADM',
  verdictSummary,
}: UsGuideMarketBriefProps) {
  return (
    <section
      data-testid="us-guide-market-brief"
      aria-label={`US Market & Allocation Brief for ${modelName}`}
      className="rounded-2xl border border-blue-500/30 bg-blue-500/5 dark:bg-blue-950/20 p-5 sm:p-6 space-y-4 shadow-xs"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-500/20 pb-3">
        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>United States Allocation, USD MSRP &amp; ADM Brief</span>
        </div>
        <Badge variant="outline" className="border-blue-500/30 text-blue-700 dark:text-blue-300 text-[11px] font-semibold">
          🇺🇸 US Market (USD)
        </Badge>
      </div>

      <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
        {verdictSummary}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            <DollarSign className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>US Base MSRP (USD)</span>
          </div>
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{msrpUsdRange}</p>
          <p className="text-[11px] text-zinc-500">Excludes destination &amp; state taxes</p>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Allocation Transit</span>
          </div>
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{transitTimeline}</p>
          <p className="text-[11px] text-zinc-500">TMNA, SET &amp; GST bi-weekly cycles</p>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            <Factory className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>Dealer Markup (ADM)</span>
          </div>
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{admRange}</p>
          <p className="text-[11px] text-zinc-500">Factory: {assemblyPlant}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            <FileCheck2 className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
            <span>State Deposit Rules</span>
          </div>
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Varies by State Law</p>
          <p className="text-[11px] text-zinc-500">
            Refundable prior to VIN in states like CA; get signed refund terms.
          </p>
        </div>
      </div>
    </section>
  );
}
