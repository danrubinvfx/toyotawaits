'use client';

import { useSyncExternalStore } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const ADMIN_OPT_OUT_KEY = 'tw_admin_opt_out';

function readAdminOptOut(): boolean {
  try {
    return window.localStorage.getItem(ADMIN_OPT_OUT_KEY) === 'true';
  } catch {
    // Storage blocked (privacy mode / sandboxed iframe): treat as a regular visitor.
    return false;
  }
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener('storage', onChange);
  return () => window.removeEventListener('storage', onChange);
}

/**
 * Client-side analytics guard.
 *
 * Renders Vercel Web Analytics + Speed Insights only when the admin opt-out flag
 * (`localStorage.tw_admin_opt_out === 'true'`) is NOT set, so admin/owner browsing
 * never pollutes traffic or Core Web Vitals data.
 *
 * The server snapshot reports "opted out" so nothing renders during SSR/hydration;
 * tracking scripts mount only after the client confirms the flag is absent.
 */
export function AnalyticsWrapper() {
  const isAdminOptOut = useSyncExternalStore(subscribe, readAdminOptOut, () => true);

  if (isAdminOptOut) {
    return null;
  }

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default AnalyticsWrapper;
