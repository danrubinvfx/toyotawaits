import React from 'react';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GuideDisclaimerProps {
  className?: string;
}

export function GuideDisclaimer({ className }: GuideDisclaimerProps) {
  return (
    <aside
      data-testid="guide-disclaimer"
      role="note"
      aria-label="Legal, Safety, and Non-Affiliation Disclaimer"
      className={cn(
        'rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/70 p-5 sm:p-6 text-xs text-zinc-600 dark:text-zinc-400 space-y-3.5 shadow-xs',
        className
      )}
    >
      <div className="flex items-center gap-2 pb-1 border-b border-zinc-200/80 dark:border-zinc-800/70">
        <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" />
        <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
          Legal, Safety &amp; Non-Affiliation Advisory
        </h4>
      </div>

      <div className="space-y-2.5 leading-relaxed text-[11px] sm:text-xs">
        <p>
          <strong className="text-zinc-900 dark:text-zinc-200">Non-Affiliation Notice:</strong>{' '}
          ToyotaWaits (toyotawaits.ca / toyotawaits.com) is an independent, community-driven platform and is NOT affiliated with, sponsored by, authorized by, or endorsed by Toyota Canada Inc., Toyota Motor Sales, U.S.A., Inc., Toyota Motor Corporation, or any affiliated dealership.
        </p>
        <p>
          <strong className="text-zinc-900 dark:text-zinc-200">DIY &amp; Safety Advisory:</strong>{' '}
          Information provided in mod guides, tire sizing references, and prep checklists is crowdsourced for general informational purposes only. Modifying a vehicle may impact factory warranties or safety compliance. Users should consult a certified automotive technician or refer to official manufacturer service manuals before undertaking vehicle modifications or installing aftermarket components.
        </p>
        <p>
          <strong className="text-zinc-900 dark:text-zinc-200">Pricing &amp; Timing Notice:</strong>{' '}
          Wait-time estimates, pricing points, and provincial rebate figures reflect community-reported experiences (alongside US dealer markups and ADM) and may differ by market, region, trim, and dealer allocation policies.
        </p>
        <p className="pt-1">
          <Link
            href="/legal"
            className="text-amber-600 dark:text-amber-400 font-medium underline hover:text-amber-500"
          >
            Read our complete Legal Disclaimers &amp; Pricing Policies →
          </Link>
        </p>
      </div>
    </aside>
  );
}

export default GuideDisclaimer;
