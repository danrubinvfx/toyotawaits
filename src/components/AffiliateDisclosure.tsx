import React from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AffiliateDisclosureProps {
  className?: string;
  compact?: boolean;
}

export const AFFILIATE_DISCLOSURE_TEXT =
  'toyotawaits.ca participates in affiliate programs, including the Amazon Associates Program. As an Amazon Associate, we may earn commissions from qualifying purchases made through links on this site at no additional cost to you.';

export const NOMINATIVE_FAIR_USE_DISCLAIMER_TEXT =
  'toyotawaits.ca is an independent community tracker and is not affiliated with, endorsed by, or sponsored by Toyota Motor Corporation or Toyota Canada Inc. All trademarks, service marks, and trade names are the property of their respective owners and are used strictly for identification purposes under nominative fair use.';

export function AffiliateDisclosure({
  className,
  compact = false,
}: AffiliateDisclosureProps) {
  if (compact) {
    return (
      <div
        data-testid="affiliate-disclosure-compact"
        role="note"
        aria-label="Affiliate disclosure"
        className={cn(
          'flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 py-1 px-2.5 rounded-md bg-zinc-100/60 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60',
          className
        )}
      >
        <Info className="h-3 w-3 shrink-0 text-amber-500" />
        <span>{AFFILIATE_DISCLOSURE_TEXT}</span>
      </div>
    );
  }

  return (
    <div
      data-testid="affiliate-disclosure"
      role="note"
      aria-label="Affiliate disclosure"
      className={cn(
        'rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-zinc-600 dark:text-zinc-400 space-y-1',
        className
      )}
    >
      <div className="flex items-start gap-2">
        <Info className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
        <p className="leading-relaxed">{AFFILIATE_DISCLOSURE_TEXT}</p>
      </div>
    </div>
  );
}

export default AffiliateDisclosure;
