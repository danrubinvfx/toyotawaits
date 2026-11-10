import React from 'react';
import { ShieldAlert } from 'lucide-react';

export interface EstimatorDisclaimerProps {
  className?: string;
}

export function EstimatorDisclaimer({ className = '' }: EstimatorDisclaimerProps) {
  return (
    <aside
      aria-label="Independent Platform Disclaimer"
      data-testid="estimator-disclaimer"
      className={`rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 p-4 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed shadow-xs ${className}`}
    >
      <div className="flex items-start gap-3">
        <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">
            Independent Community Tracker Disclaimer
          </p>
          <p>
            ToyotaWaits.ca is an independent, community-driven research tracker and is not affiliated, endorsed, or authorized by Toyota Canada Inc., Lexus Canada, or Toyota Motor Corporation. We cannot access or modify internal factory dealer allocation queues. Vehicle trademarks, logos, and model names are the property of their respective trademark holders.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default EstimatorDisclaimer;
