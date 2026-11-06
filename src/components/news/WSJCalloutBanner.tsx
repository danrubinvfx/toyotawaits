'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ArrowRight } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';

export interface WSJCalloutBannerProps {
  className?: string;
  forceShow?: boolean;
}

export function WSJCalloutBanner({ className = '', forceShow = false }: WSJCalloutBannerProps) {
  const { market } = useMarket();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const isDismissed = sessionStorage.getItem('tw_rav4_2027_news_dismissed');
      if (isDismissed === 'true' && !forceShow) {
        setDismissed(true);
      }
    } catch {
      // Ignore storage access errors
    }
  }, [forceShow]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDismissed(true);
    try {
      sessionStorage.setItem('tw_rav4_2027_news_dismissed', 'true');
    } catch {
      // Ignore storage access errors
    }
  };

  if (dismissed && !forceShow) {
    return null;
  }

  const alertText =
    market === 'CA'
      ? '📰 Official Update: Toyota announces 2027 RAV4 with native NACS port, 321-hp PHEV, and 9.1" Woodland lift. See how 2026 build slots roll over →'
      : '📰 Official Update: Toyota announces 2027 RAV4 with native NACS port, 321-hp PHEV, and 9.1" Woodland lift. See how 2026 build slots roll over →';

  return (
    <aside
      aria-label="Official RAV4 2027 Announcement Banner"
      data-testid="wsj-callout-banner"
      className={`relative z-40 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white text-xs sm:text-sm font-semibold shadow-xs min-h-[40px] flex items-center ${className}`}
    >
      <div className="container mx-auto max-w-7xl px-4 py-2 sm:py-2.5 flex items-center justify-between gap-3 min-h-[40px] w-full">
        <Link
          href="/guides/toyota-rav4-2026-vs-2027"
          className="flex-1 flex items-center justify-center sm:justify-start gap-1.5 hover:opacity-95 transition-opacity text-center sm:text-left group"
        >
          <span className="leading-snug group-hover:underline underline-offset-2">{alertText}</span>
        </Link>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss announcement banner"
          className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}

export default WSJCalloutBanner;
