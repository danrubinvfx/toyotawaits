'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  TickerItem,
  NewsTickerItem,
  DeliveryTickerItem,
  RecentActivityItem,
} from '@/lib/types/contracts';
import { ChevronLeft, ChevronRight, Pause, Play, ExternalLink } from 'lucide-react';

export type AnyTickerItem = TickerItem | RecentActivityItem | any;

export interface ActivityTickerProps {
  initialData?: AnyTickerItem[];
}

export function isNewsItem(item: AnyTickerItem): item is NewsTickerItem {
  return Boolean(item && (item.type === 'news' || ('title' in item && !('model_name' in item))));
}

export function isDeliveryItem(item: AnyTickerItem): item is DeliveryTickerItem {
  return Boolean(
    item &&
      (item.type === 'delivery' ||
        item.status === 'delivered' ||
        item.lifecycle_status === 'delivered' ||
        item.daysWaited != null)
  );
}

/**
 * Format relative time string adhering to Zero-PII and Canadian local contexts
 */
export function formatRelativeTime(dateString?: string | null): string {
  if (!dateString) return 'Recently';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  if (isNaN(diffMs) || diffMs < 0) return 'Just now';

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 120) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

/**
 * Normalizes vehicle name string into clean format (e.g. 2026 RAV4 Plug-in Hybrid SE)
 */
export function formatVehicleDescription(item: AnyTickerItem): string {
  const year = item.model_year || 2026;
  const model = item.model_name || 'RAV4';

  let pt = (item.powertrain || '').replace(/\s*\((?:PHEV|HEV)\)/gi, '').trim();
  let trim = (item.trim_name || '').replace(/\s*\(.*?\)/g, '').trim();

  if (trim.toLowerCase().startsWith(model.toLowerCase())) {
    trim = trim.substring(model.length).trim();
  }

  if (pt && trim.toLowerCase().includes(pt.toLowerCase())) {
    pt = '';
  }

  const parts = [year, model, pt, trim].filter(Boolean);
  return parts.join(' ');
}

/**
 * Maps lifecycle/order status to friendly action description
 */
export function formatActionDescription(item: AnyTickerItem): string {
  const stage = (item.lifecycle_status || item.status || '').toLowerCase();

  if (stage === 'delivered' || item.status === 'delivered') {
    const days = item.daysWaited != null ? item.daysWaited : item.wait_days;
    if (days != null && days > 0) {
      return `delivered (${days} days wait)`;
    }
    return 'delivered';
  }

  if (stage === 'in_transit' || stage === 'freight_transit') {
    return 'advanced to In Transit';
  }

  if (stage === 'vin_assigned' || stage === 'allocation_confirmed') {
    return 'advanced to VIN Assigned';
  }

  if (stage === 'arrived_at_dealer') {
    return 'arrived at dealer';
  }

  return 'placed on deposit';
}

/**
 * Generates the full Zero-PII ticker summary text
 */
export function formatTickerSummary(item: AnyTickerItem): string {
  if (isNewsItem(item)) {
    const tag = item.tag || 'NEWS WIRE';
    return `${tag} • ${item.title}`;
  }

  const prov = item.province || 'CA';
  const vehicle = formatVehicleDescription(item);

  if (isDeliveryItem(item)) {
    const days = item.daysWaited != null ? item.daysWaited : item.wait_days != null ? item.wait_days : 120;
    return `DELIVERED • ${prov}: ${vehicle} — ${days} days wait`;
  }

  const timeAgo = formatRelativeTime(item.updated_at || item.created_at);
  const action = formatActionDescription(item);
  return `${timeAgo} • ${prov}: ${vehicle} ${action}`;
}

export function ActivityTicker({ initialData = [] }: ActivityTickerProps) {
  const [items, setItems] = useState<AnyTickerItem[]>(initialData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Sync if initialData changes
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setItems(initialData);
    }
  }, [initialData]);

  // Check user system preference for reduced motion
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener?.('change', handler);
    return () => mediaQuery.removeEventListener?.('change', handler);
  }, []);

  // Periodic silent background refresh from /api/ticker (with fallback to /api/submissions/recent)
  useEffect(() => {
    const fetchTicker = async () => {
      try {
        const res = await fetch('/api/ticker');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setItems(json.data);
            return;
          }
        }
        const fallbackRes = await fetch('/api/submissions/recent');
        if (fallbackRes.ok) {
          const json = await fallbackRes.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setItems(json.data);
          }
        }
      } catch {
        // Silently retain current items on fetch failure
      }
    };

    const interval = setInterval(fetchTicker, 60000);
    return () => clearInterval(interval);
  }, []);

  const total = items.length;

  const nextItem = useCallback(() => {
    if (total <= 1) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
      setIsAnimating(false);
    }, 200);
  }, [total]);

  const prevItem = useCallback(() => {
    if (total <= 1) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + total) % total);
      setIsAnimating(false);
    }, 200);
  }, [total]);

  // Automatic ticker progression with pause on hover/focus
  useEffect(() => {
    if (prefersReducedMotion || isPaused || total <= 1) return;

    const interval = setInterval(() => {
      nextItem();
    }, 4500);

    return () => clearInterval(interval);
  }, [prefersReducedMotion, isPaused, total, nextItem]);

  const currentItem = useMemo(() => {
    if (total === 0) return null;
    return items[currentIndex % total];
  }, [items, currentIndex, total]);

  if (total === 0 || !currentItem) {
    return null;
  }

  // 1. Reduced Motion Mode: Render static horizontal scrollable list of pills
  if (prefersReducedMotion) {
    return (
      <div
        className="w-full border-b border-zinc-200/80 dark:border-white/10 bg-zinc-950/90 dark:bg-black/40 backdrop-blur-sm text-zinc-200"
        aria-live="polite"
        role="region"
        aria-label="Recent vehicle order activity"
      >
        <div className="container mx-auto max-w-6xl px-3 sm:px-6 py-1.5 sm:py-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30 shrink-0 self-start sm:self-auto select-none">
            <span className="relative flex h-2 w-2">
              <span className="inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>⚡ Canadian Activity Pulse</span>
          </div>

          <div
            tabIndex={0}
            className="flex items-center gap-2 overflow-x-auto py-0.5 text-xs text-zinc-300 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 rounded-md"
            aria-label="Scrollable list of recent community submissions"
          >
            {items.map((item, idx) => {
              if (isNewsItem(item)) {
                return (
                  <span
                    key={item.id || idx}
                    className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 shrink-0 whitespace-nowrap text-amber-300 font-medium"
                  >
                    <span className="text-[10px] font-bold">⚡ {item.tag || 'NEWS WIRE'}:</span>
                    {item.url ? (
                      <Link href={item.url} className="hover:underline">
                        {item.title}
                      </Link>
                    ) : (
                      <span>{item.title}</span>
                    )}
                  </span>
                );
              }

              if (isDeliveryItem(item)) {
                const vehicle = formatVehicleDescription(item);
                const days =
                  item.daysWaited != null
                    ? item.daysWaited
                    : item.wait_days != null
                    ? item.wait_days
                    : 120;
                return (
                  <span
                    key={item.id || idx}
                    className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0 whitespace-nowrap text-emerald-300 font-medium"
                  >
                    <span className="text-[10px] font-bold">🎉 DELIVERED:</span>
                    <span>
                      {item.province}: {vehicle} — {days} days wait
                    </span>
                  </span>
                );
              }

              return (
                <span
                  key={item.id || idx}
                  className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 border border-white/10 shrink-0 whitespace-nowrap text-zinc-200 font-medium"
                >
                  {formatTickerSummary(item)}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 2. Standard Mode: Render current alternating item (News Wire / Delivery / Activity)
  const isNews = isNewsItem(currentItem);
  const isDelivered = !isNews && isDeliveryItem(currentItem);

  return (
    <div
      className="group relative w-full border-b border-zinc-200/80 dark:border-white/10 bg-zinc-950/90 dark:bg-black/40 backdrop-blur-sm text-zinc-200 transition-colors"
      aria-live="polite"
      role="region"
      aria-label="Live Canadian Toyota order activity"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="container mx-auto max-w-6xl px-3 sm:px-6 py-1.5 sm:py-2 flex items-center justify-between gap-2 sm:gap-3">
        {/* Left Badge: Dynamic depending on item type */}
        {isNews ? (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/30 shrink-0 select-none">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
            </span>
            <span>{currentItem.tag ? `⚡ ${currentItem.tag}` : '📢 NEWS WIRE'}</span>
          </div>
        ) : isDelivered ? (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/30 shrink-0 select-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>🎉 DELIVERED</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30 shrink-0 select-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="hidden sm:inline">⚡ Canadian Activity Pulse</span>
            <span className="sm:hidden">● Live Updates</span>
          </div>
        )}

        {/* Center: Smooth Ticker Event Text */}
        <div className="min-w-0 flex-1 overflow-hidden">
          <div
            className={`transition-all duration-200 ease-in-out ${
              isAnimating ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
            }`}
          >
            {isNews ? (
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-200 truncate font-medium">
                <span className="text-zinc-600 shrink-0">•</span>
                {currentItem.url ? (
                  <Link
                    href={currentItem.url}
                    className="hover:underline hover:text-white transition-colors truncate inline-flex items-center gap-1"
                  >
                    <span className="truncate">{currentItem.title}</span>
                    <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
                  </Link>
                ) : (
                  <span className="truncate">{currentItem.title}</span>
                )}
              </div>
            ) : isDelivered ? (
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-300 truncate font-medium">
                <span className="text-zinc-600 shrink-0">•</span>
                <span className="font-bold text-white shrink-0">{currentItem.province}:</span>
                <span className="text-zinc-200 truncate">{formatVehicleDescription(currentItem)}</span>
                <span className="text-zinc-500 shrink-0">—</span>
                <span className="font-semibold text-emerald-400 shrink-0">
                  {currentItem.daysWaited != null
                    ? currentItem.daysWaited
                    : currentItem.wait_days != null
                    ? currentItem.wait_days
                    : 120}{' '}
                  days wait
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-300 truncate font-medium">
                <span className="text-zinc-400 shrink-0">
                  {formatRelativeTime(currentItem.updated_at || currentItem.created_at)}
                </span>
                <span className="text-zinc-600 shrink-0">•</span>
                <span className="font-bold text-white shrink-0">{currentItem.province}:</span>
                <span className="text-zinc-200 truncate">{formatVehicleDescription(currentItem)}</span>
                <span className="font-semibold text-emerald-400 shrink-0">
                  {formatActionDescription(currentItem)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Manual navigation controls & state indicator */}
        <div className="flex items-center gap-1 shrink-0 text-zinc-400">
          <span className="text-[11px] tabular-nums font-mono px-1 select-none hidden md:inline text-zinc-400">
            {currentIndex + 1}/{total}
          </span>

          <button
            type="button"
            onClick={prevItem}
            className="p-1 rounded-md hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Previous update"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={nextItem}
            className="p-1 rounded-md hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Next update"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            className="p-1 rounded-md hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer hidden sm:inline-flex"
            aria-label={isPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          </button>
        </div>
      </div>
    </div>
  );
}
