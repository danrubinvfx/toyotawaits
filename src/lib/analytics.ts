import { track } from '@vercel/analytics';

export const ADMIN_OPT_OUT_KEY = 'tw_admin_opt_out';
export const IGNORE_ANALYTICS_KEY = 'tw_ignore_analytics';

export function isAnalyticsOptedOut(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }

  try {
    return (
      window.localStorage.getItem(ADMIN_OPT_OUT_KEY) === 'true' ||
      window.localStorage.getItem(IGNORE_ANALYTICS_KEY) === 'true'
    );
  } catch {
    return false;
  }
}

/**
 * Standardized client-side Vercel Web Analytics event helper.
 * Respects `tw_admin_opt_out` and `tw_ignore_analytics` localStorage flags
 * and swallows any network or ad-blocker errors so UI interactions never break.
 */
export type AnalyticsTrackOptions = {
  flags?: (string | Record<string, unknown>)[] | Record<string, unknown>;
};

export function trackUserEvent(
  eventName: string,
  properties?: Record<string, string | number | boolean>,
  options?: AnalyticsTrackOptions
): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (isAnalyticsOptedOut()) {
    return;
  }

  try {
    if (options) {
      track(eventName, properties, options);
    } else {
      track(eventName, properties);
    }
  } catch {
    // Silently ignore analytics failures (e.g., ad blockers or offline mode)
  }
}

export function trackGuideOrGearShared(params: {
  title: string;
  anchorId?: string;
  method: 'native' | 'clipboard';
}): void {
  const properties: Record<string, string> = {
    title: params.title,
    method: params.method,
  };
  if (params.anchorId) {
    properties.anchorId = params.anchorId;
  }
  trackUserEvent('guide_or_gear_shared', properties);
}

export type MuslogyChannel = 'muslogy_direct' | 'amazon_prime_alt';

export function trackMuslogyGearClick(params: {
  accessoryId: string;
  channel: MuslogyChannel;
  placement?: string;
  model?: string;
}): void {
  const properties: Record<string, string> = {
    accessoryId: params.accessoryId,
    channel: params.channel,
  };
  if (params.placement) {
    properties.placement = params.placement;
  }
  if (params.model) {
    properties.model = params.model;
  }

  trackUserEvent('muslogy_gear_clicked', properties);
  if (params.channel === 'amazon_prime_alt') {
    trackUserEvent('affiliate_gear_clicked', properties);
  }
}
