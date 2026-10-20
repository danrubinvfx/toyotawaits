import React, { useState } from 'react';
import { Info, ShieldCheck, AlertCircle, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function CoverageDisclosureBanner() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside
      data-testid="coverage-disclosure-banner"
      aria-label="Pilot Inventory Coverage Disclosure and Limitations"
      className="rounded-xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 p-3 sm:p-4 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-blue-950/70 p-1.5 sm:p-2 text-blue-400 border border-blue-900/60 shrink-0 mt-0.5">
            <Info className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-0.5 sm:mb-1">
              <h2 className="text-sm font-semibold text-zinc-100">
                Pilot Discovery Scope: BC Lower Mainland
              </h2>
              <Badge variant="outline" className="bg-emerald-950/50 text-emerald-400 border-emerald-800 text-[10px] py-0">
                Convertus Platform Pilot
              </Badge>
            </div>
            <p className="text-[11px] sm:text-xs text-zinc-400 leading-snug sm:leading-relaxed">
              <span className="hidden sm:inline">
                Public listings are monitored via polite, unauthenticated API feeds. In accordance with Master Plan V3.2 safeguards, we do not bypass CAPTCHAs or authenticated portals.
              </span>
              <span className="sm:hidden">
                Monitored via polite, unauthenticated API feeds. CAPTCHAs are never bypassed.
              </span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          data-testid="toggle-coverage-details-btn"
          aria-expanded={isExpanded}
          aria-controls="coverage-details-panel"
          className="inline-flex items-center gap-1.5 self-start sm:self-center text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800/80 px-2.5 py-1.5 rounded-lg border border-zinc-700/60 transition shrink-0"
        >
          <span>{isExpanded ? 'Hide Dealer Status' : 'View Dealer Status'}</span>
          {isExpanded ? (
            <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div
          id="coverage-details-panel"
          data-testid="coverage-details-panel"
          className="mt-4 pt-4 border-t border-zinc-800/80 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {/* Jim Pattison Toyota Downtown */}
          <div className="rounded-lg bg-zinc-950/80 p-3 border border-zinc-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-200">Jim Pattison Downtown</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/80">
                <ShieldCheck className="h-3 w-3" /> Gate 1 PASS
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-tight">
              Platform: Convertus VMS. True 17-char VINs and price transparency verified.
            </p>
          </div>

          {/* Jim Pattison Toyota Surrey */}
          <div className="rounded-lg bg-zinc-950/80 p-3 border border-zinc-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-200">Jim Pattison Surrey</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/80">
                <ShieldCheck className="h-3 w-3" /> Gate 1 PASS
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-tight">
              Platform: Convertus VMS. Multi-store Surrey feed with 17-char VIN tracking.
            </p>
          </div>

          {/* West Coast Toyota */}
          <div className="rounded-lg bg-zinc-950/80 p-3 border border-zinc-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-200">West Coast Toyota</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/80">
                <ShieldCheck className="h-3 w-3" /> Gate 1 PASS
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-tight">
              Platform: Convertus VMS. Pitt Meadows dealer coverage with verified inventory.
            </p>
          </div>

          {/* OpenRoad Toyota Richmond */}
          <div className="rounded-lg bg-zinc-950/80 p-3 border border-zinc-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-200">OpenRoad Richmond</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/80">
                <Lock className="h-3 w-3" /> Coverage Limitation
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-tight">
              Platform: ASP.NET Core / React. Backend requires HTTP Basic auth; automated collection paused per Section 2 limits.
            </p>
          </div>

          {/* Granville Toyota */}
          <div className="rounded-lg bg-zinc-950/80 p-3 border border-zinc-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-200">Granville Toyota</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/80">
                <AlertCircle className="h-3 w-3" /> Coverage Limitation
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-tight">
              Platform: Cloudflare WAF Managed Challenge. CAPTCHA solver bypass rejected per operating guidelines.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
