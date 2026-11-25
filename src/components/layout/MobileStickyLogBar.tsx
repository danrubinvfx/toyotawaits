'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PlusCircle, X } from 'lucide-react';

export const STICKY_LOG_BAR_DISMISSED_KEY = 'tw_mobile_sticky_log_bar_dismissed';

export interface MobileStickyLogBarProps {
  enabled: boolean;
}

export function MobileStickyLogBar({ enabled }: MobileStickyLogBarProps) {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      const isDismissed =
        window.sessionStorage.getItem(STICKY_LOG_BAR_DISMISSED_KEY) === 'true';
      setDismissed(isDismissed);
    } catch {
      setDismissed(false);
    }
  }, []);

  if (!enabled || dismissed || pathname === '/submit') {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    try {
      window.sessionStorage.setItem(STICKY_LOG_BAR_DISMISSED_KEY, 'true');
    } catch {
      // Ignore storage errors in restricted environments
    }
  };

  return (
    <div
      data-testid="mobile-sticky-log-bar"
      role="region"
      aria-label="Log your Toyota order"
      className="fixed bottom-16 inset-x-3 z-30 md:hidden flex items-center justify-between gap-2 rounded-xl border border-zinc-700/80 bg-zinc-950/95 px-3 py-2 text-zinc-100 shadow-lg backdrop-blur-md"
    >
      <span className="text-xs font-medium text-zinc-300 truncate min-w-0">
        Waiting on an allocation?
      </span>
      <div className="flex items-center gap-1.5 shrink-0">
        <Link
          href="/submit"
          data-testid="mobile-sticky-log-bar-cta"
          className="inline-flex items-center gap-1 rounded-lg bg-red-600 hover:bg-red-500 px-2.5 py-1.5 text-xs font-bold text-white shadow-sm transition-colors whitespace-nowrap"
        >
          <PlusCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>+ Log Your Order</span>
        </Link>
        <button
          type="button"
          onClick={handleDismiss}
          data-testid="mobile-sticky-log-bar-dismiss"
          aria-label="Dismiss order logging bar"
          className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
