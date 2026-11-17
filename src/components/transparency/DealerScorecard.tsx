'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Award, Search, ShieldCheck, ArrowRight, Store } from 'lucide-react';
import type { DealerScorecardEntry } from '@/lib/data/dealer-scorecard';

export interface DealerScorecardProps {
  entries: DealerScorecardEntry[];
}

export function DealerScorecard({ entries }: DealerScorecardProps) {
  const [query, setQuery] = useState('');
  const [provinceFilter, setProvinceFilter] = useState<string>('ALL');

  const provinces = useMemo(() => {
    const set = new Set(entries.map((e) => e.province));
    return ['ALL', ...Array.from(set).sort()];
  }, [entries]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((entry) => {
      if (provinceFilter !== 'ALL' && entry.province !== provinceFilter) return false;
      if (q && !entry.dealerName.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [entries, query, provinceFilter]);

  return (
    <section
      aria-labelledby="dealer-scorecard-heading"
      className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6 shadow-xl backdrop-blur-sm space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-emerald-400" />
            <h2 id="dealer-scorecard-heading" className="text-lg sm:text-xl font-bold text-white">
              &ldquo;MSRP or Bust&rdquo; Dealer Transparency Scorecard
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            Dealerships ranked by verified straight-MSRP compliance and median documentation fees.
          </p>
        </div>

        <Link
          href="/submit"
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25 transition-colors shrink-0"
        >
          <span>Bought from this dealer? Log your doc fee &amp; wait time</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by dealership name..."
            aria-label="Filter by dealership name"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 pl-9 pr-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none"
          />
        </div>
        <select
          value={provinceFilter}
          onChange={(e) => setProvinceFilter(e.target.value)}
          aria-label="Filter by province"
          className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none"
        >
          {provinces.map((prov) => (
            <option key={prov} value={prov}>
              {prov === 'ALL' ? 'All Provinces' : prov}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 text-center space-y-2">
          <Store className="h-6 w-6 text-zinc-500 mx-auto" />
          <p className="text-sm text-zinc-400">
            No matching dealership transparency reports yet.
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:underline"
          >
            Bought from this dealer? Log your doc fee &amp; wait time →
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400">
                <th className="py-2.5 pr-3">Dealership</th>
                <th className="py-2.5 px-3">Province</th>
                <th className="py-2.5 px-3">Verified Reports</th>
                <th className="py-2.5 px-3">% At Straight MSRP</th>
                <th className="py-2.5 px-3">Median Doc Fee</th>
                <th className="py-2.5 pl-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {filtered.slice(0, 25).map((dealer) => (
                <tr key={dealer.key} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="py-3 pr-3 font-semibold text-zinc-100">
                    {dealer.dealerName}
                  </td>
                  <td className="py-3 px-3 text-zinc-400 font-mono">{dealer.province}</td>
                  <td className="py-3 px-3 text-zinc-300">{dealer.verifiedReportsCount}</td>
                  <td className="py-3 px-3">
                    {dealer.needsConfirmation ? (
                      <span className="text-zinc-500 text-xs">—</span>
                    ) : (
                      <span
                        className={`font-bold ${
                          dealer.straightMsrpPct >= 85
                            ? 'text-emerald-400'
                            : dealer.straightMsrpPct >= 50
                            ? 'text-amber-400'
                            : 'text-red-400'
                        }`}
                      >
                        {dealer.straightMsrpPct}%
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono text-zinc-200">
                    {dealer.medianDocFee !== null ? `$${dealer.medianDocFee.toLocaleString()}` : '—'}
                  </td>
                  <td className="py-3 pl-3 text-right">
                    {dealer.isMsrpVerified ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                        <ShieldCheck className="h-3 w-3" />
                        <span>🏆 MSRP Verified</span>
                      </span>
                    ) : dealer.needsConfirmation ? (
                      <span className="inline-flex items-center rounded-full bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 text-[11px] font-medium text-zinc-300">
                        1 Report — Needs Confirmation
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-medium text-amber-300">
                        Watch Fees
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pt-2 border-t border-zinc-800/80 flex justify-end">
        <Link
          href="/submit"
          className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
        >
          Bought from this dealer? Log your doc fee &amp; wait time →
        </Link>
      </div>
    </section>
  );
}
