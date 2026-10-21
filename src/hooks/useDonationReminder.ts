'use client';

import { useState, useEffect, useCallback } from 'react';

export const LISTING_CLICKS_STORAGE_KEY = 'toyotawaits_listing_clicks';
export const DONATION_DISMISSED_STORAGE_KEY = 'toyotawaits_donation_dismissed';
export const LISTING_CLICKS_THRESHOLD = 3;
export const DISMISSAL_COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

export function isDonationDismissalActive(
  rawDismissed: string | null,
  nowMs: number = Date.now()
): boolean {
  if (!rawDismissed) return false;
  const trimmed = rawDismissed.trim();
  if (!trimmed) return false;

  const numericTs = Number(trimmed);
  const parsedTs = !isNaN(numericTs) && numericTs > 0 ? numericTs : Date.parse(trimmed);

  if (isNaN(parsedTs) || parsedTs <= 0) {
    return false;
  }

  return nowMs - parsedTs < DISMISSAL_COOLDOWN_MS;
}

export interface UseDonationReminderResult {
  listingClicks: number;
  showReminder: boolean;
  recordListingClick: () => void;
  dismissReminder: () => void;
}

export function useDonationReminder(): UseDonationReminderResult {
  const [listingClicks, setListingClicks] = useState<number>(0);
  const [showReminder, setShowReminder] = useState<boolean>(false);

  // Hydrate safely on client mount to prevent SSR mismatch
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const rawClicks = window.localStorage.getItem(LISTING_CLICKS_STORAGE_KEY);
      const rawDismissed = window.localStorage.getItem(DONATION_DISMISSED_STORAGE_KEY);
      const parsedClicks = parseInt(rawClicks || '0', 10);
      const safeClicks = !isNaN(parsedClicks) && parsedClicks > 0 ? parsedClicks : 0;

      setListingClicks(safeClicks);
      if (safeClicks >= LISTING_CLICKS_THRESHOLD && !isDonationDismissalActive(rawDismissed)) {
        setShowReminder(true);
      }
    } catch {
      // Ignore storage access restrictions (e.g. private browsing)
    }
  }, []);

  const recordListingClick = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const rawClicks = window.localStorage.getItem(LISTING_CLICKS_STORAGE_KEY);
      const rawDismissed = window.localStorage.getItem(DONATION_DISMISSED_STORAGE_KEY);
      const currentClicks = parseInt(rawClicks || '0', 10);
      const nextClicks = (!isNaN(currentClicks) && currentClicks >= 0 ? currentClicks : 0) + 1;

      window.localStorage.setItem(LISTING_CLICKS_STORAGE_KEY, String(nextClicks));
      setListingClicks(nextClicks);

      if (nextClicks >= LISTING_CLICKS_THRESHOLD && !isDonationDismissalActive(rawDismissed)) {
        setShowReminder(true);
      }
    } catch {
      // Fallback to in-memory counter if localStorage is blocked
      setListingClicks((prev) => {
        const next = prev + 1;
        if (next >= LISTING_CLICKS_THRESHOLD) {
          setShowReminder(true);
        }
        return next;
      });
    }
  }, []);

  const dismissReminder = useCallback(() => {
    setShowReminder(false);
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(DONATION_DISMISSED_STORAGE_KEY, String(Date.now()));
    } catch {
      // Ignore storage access restrictions
    }
  }, []);

  return {
    listingClicks,
    showReminder,
    recordListingClick,
    dismissReminder,
  };
}
