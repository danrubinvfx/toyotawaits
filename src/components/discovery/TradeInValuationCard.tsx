'use client';

import React from 'react';
import { trackAffiliateClick } from '@/lib/gear';

export interface TradeInValuationCardProps {
  market?: 'CA' | 'US';
  modelContext?: string;
  placement?: string;
  className?: string;
}

export function TradeInValuationCard({
  market,
  modelContext,
  placement = 'delivery_prep',
  className = '',
}: TradeInValuationCardProps) {
  const href = market === 'US' ? '/out/trade-in-quote?market=US' : '/out/trade-in-quote';

  return (
    <article
      data-testid="trade-in-valuation-card"
      aria-label="Maximize Your Trade-In Equity"
      className={`w-full rounded-xl border border-amber-500/30 bg-gradient-to-r from-zinc-900 via-zinc-900/95 to-amber-950/30 p-3.5 sm:p-4 shadow-sm transition-all hover:border-amber-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}
    >
      <div className="space-y-1 min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0">
            💰 Maximize Your Trade-In Equity
          </span>
          {modelContext && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 truncate">
              {modelContext}
            </span>
          )}
        </div>
        <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
          Trading in your current car on delivery day?
        </h4>
        <p className="text-xs text-zinc-300 leading-relaxed">
          Check an instant cash valuation before visiting the dealer finance desk so you know your real equity floor.
        </p>
      </div>

      <div className="shrink-0 flex flex-col items-start sm:items-end gap-1">
        <a
          href={href}
          target="_blank"
          rel="sponsored noopener noreferrer nofollow"
          data-testid="trade-in-valuation-cta"
          onClick={() => {
            trackAffiliateClick({
              accessory_id: 'trade-in-quote',
              placement,
              model_context: modelContext || null,
              target_url: href,
            });
          }}
          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 text-zinc-950 font-bold text-xs shadow inline-flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer"
        >
          <span>Check Instant Cash Value ↗</span>
        </a>
        <span className="text-[10px] text-zinc-400 tracking-tight">
          Sponsored referral · No obligation cash offer
        </span>
      </div>
    </article>
  );
}
