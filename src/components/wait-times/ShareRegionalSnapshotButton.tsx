'use client';

import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ShareRegionalSnapshotButtonProps {
  modelSlug: string;
  modelName: string;
  medianMonths: string;
  medianDays: number;
  straightMsrpPct: number | null;
  topTrimAllocation?: string | null;
}

export function ShareRegionalSnapshotButton({
  modelSlug,
  modelName,
  medianMonths,
  medianDays,
  straightMsrpPct,
  topTrimAllocation,
}: ShareRegionalSnapshotButtonProps) {
  const [copied, setCopied] = useState(false);

  const utmUrl = `https://www.toyotawaits.ca/wait-times/${modelSlug}?utm_source=reddit&utm_medium=organic_social&utm_campaign=ca_allocation_guides_2026&utm_content=${modelSlug}_snapshot`;

  const handleCopy = async () => {
    const msrpLine =
      straightMsrpPct !== null ? `${straightMsrpPct}% Straight MSRP` : 'MSRP data collecting';
    const allocLine = topTrimAllocation
      ? `Top Trim Allocation Share: ${topTrimAllocation}`
      : 'Live trim allocation tracking';

    const summary = [
      `Toyota ${modelName} Canada Snapshot (${new Date().getFullYear()}):`,
      `• P50 Median Wait: ${medianMonths} mos (${medianDays} days)`,
      `• Pricing Reality: ${msrpLine}`,
      `• ${allocLine}`,
      `Live tracker & dealer scorecard: ${utmUrl}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Ignore clipboard permission errors in headless environments
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleCopy}
      data-testid="share-regional-snapshot-btn"
      className="gap-1.5 text-xs font-semibold"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-500" />
          <span>Snapshot Copied</span>
        </>
      ) : (
        <>
          <Share2 className="h-3.5 w-3.5" />
          <span>Share Regional Snapshot</span>
        </>
      )}
    </Button>
  );
}
