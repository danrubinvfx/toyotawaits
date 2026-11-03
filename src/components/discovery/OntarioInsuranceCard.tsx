'use client';

import React from 'react';
import { getInsuranceAffiliateUrl } from '@/config/affiliates';
import { trackAffiliateClick } from '@/lib/gear';

export interface OntarioInsuranceCardProps {
  region?: 'ON' | 'BC' | string | null;
  modelContext?: string;
  className?: string;
}

export function OntarioInsuranceCard({
  region = 'ON',
  modelContext,
  className = '',
}: OntarioInsuranceCardProps) {
  if (region && region.toUpperCase() !== 'ON' && region.toUpperCase() !== 'ONTARIO') {
    return null;
  }

  const targetUrl = getInsuranceAffiliateUrl('ON');

  return (
    <article
      data-testid="ontario-insurance-card"
      aria-label="Taking Delivery in Ontario? Compare 30+ Auto Quotes"
      className={`col-span-full w-full rounded-xl border border-sky-500/30 bg-gradient-to-r from-zinc-900 via-zinc-900/95 to-sky-950/30 p-3.5 sm:p-4 shadow-sm transition-all hover:border-sky-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}
    >
      <div className="space-y-1 min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 shrink-0">
            ONTARIO DELIVERY PREP
          </span>
          {modelContext && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 truncate">
              {modelContext}
            </span>
          )}
        </div>
        <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
          🛡️ Taking Delivery in Ontario? Compare 30+ Auto Quotes
        </h4>
        <p className="text-xs text-zinc-300 leading-relaxed">
          Ontario insurance premiums vary by up to $1,200 across private carriers. Check rates and lock in your policy before delivery.
        </p>
      </div>

      <div className="shrink-0 flex flex-col items-start sm:items-end gap-1">
        <a
          href={targetUrl}
          target="_blank"
          rel="sponsored noopener noreferrer nofollow"
          data-testid="ontario-insurance-cta"
          onClick={() => {
            trackAffiliateClick({
              accessory_id: 'ontario-auto-insurance-ratehub',
              placement: 'inventory_feed',
              model_context: modelContext || null,
              target_url: targetUrl,
            });
          }}
          className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 active:scale-95 text-zinc-950 font-bold text-xs shadow inline-flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer"
        >
          <span>Compare Ontario Rates ↗</span>
        </a>
        <span className="text-[10px] text-zinc-500 tracking-tight">
          Sponsored referral · Free 3-minute rate check
        </span>
      </div>
    </article>
  );
}
