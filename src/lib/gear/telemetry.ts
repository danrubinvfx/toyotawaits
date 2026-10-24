/**
 * src/lib/gear/telemetry.ts
 *
 * Lightweight client-side telemetry tracking for outbound affiliate link clicks.
 * Uses navigator.sendBeacon where available for non-blocking beacon delivery,
 * falling back to fire-and-forget fetch with keepalive.
 */

export interface AffiliateClickEvent {
  accessory_id: string;
  placement: 'inventory_feed' | 'submission_modal' | 'donation_toast' | 'guide_rav4_mods' | 'while_you_wait' | string;
  model_context?: string | null;
  target_url: string;
}

export function trackAffiliateClick(payload: AffiliateClickEvent): void {
  if (typeof window === 'undefined') return;

  const endpoint = '/api/telemetry/affiliate-click';
  const serialized = JSON.stringify(payload);

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([serialized], { type: 'application/json' });
      const sent = navigator.sendBeacon(endpoint, blob);
      if (sent) return;
    }
  } catch {
    // Fall back to fetch below
  }

  try {
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: serialized,
      keepalive: true,
    }).catch(() => {
      // Silently swallow network errors during telemetry delivery
    });
  } catch {
    // Silently ignore
  }
}
