'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  TickerItem,
  NewsTickerItem,
  DeliveryTickerItem,
  RecentActivityItem,
} from '@/lib/types/contracts';
import { ExternalLink } from 'lucide-react';

export type AnyTickerItem = TickerItem | RecentActivityItem | any;

export interface ActivityTickerProps {
  initialData?: AnyTickerItem[];
}

export function isNewsItem(item: AnyTickerItem): item is NewsTickerItem {
  return Boolean(
    item &&
      (item.type === 'news' ||
        'headline' in item ||
        ('title' in item && !('model_name' in item)))
  );
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
 * Generates full Zero-PII ticker summary text (used for accessibility / fallback)
 */
export function formatTickerSummary(item: AnyTickerItem): string {
  if (isNewsItem(item)) {
    const category = item.category || item.tag || 'MARKET_DATA';
    const headline = item.headline || item.title || 'Toyota News Alert';
    return `📢 ${category} • ${headline}`;
  }

  const prov = item.province || (item as any).state || 'CA';
  const vehicle = formatVehicleDescription(item);

  if (isDeliveryItem(item)) {
    const days = item.daysWaited != null ? item.daysWaited : item.wait_days != null ? item.wait_days : 120;
    return `🟢 DELIVERED • ${prov}: ${vehicle} — ${days} days wait`;
  }

  const timeAgo = formatRelativeTime(item.updated_at || item.created_at);
  const action = formatActionDescription(item);
  return `${timeAgo} • ${prov}: ${vehicle} ${action}`;
}

export function ActivityTicker({ initialData = [] }: ActivityTickerProps) {
  const [items, setItems] = useState<AnyTickerItem[]>(initialData);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

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

  // Ensure enough items in the marquee loop so it smoothly covers ultra-wide monitors
  const displayItems = useMemo(() => {
    if (items.length === 0) return [];
    if (items.length < 4) {
      return [...items, ...items, ...items];
    }
    return items;
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  const renderTickerItem = (item: AnyTickerItem, prefix = 'item') => {
    const key = `${prefix}-${item.id || ''}`;

    if (isNewsItem(item)) {
      const category = item.category || item.tag || 'MARKET_DATA';
      const headline = item.headline || item.title || 'Toyota News Alert';

      return (
        <div key={key} className="inline-flex items-center gap-2 shrink-0 text-xs sm:text-sm font-medium">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 whitespace-nowrap">
            <span>📢</span>
            <span>{category}</span>
          </span>
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-200 hover:text-white hover:underline transition-colors whitespace-nowrap inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{headline}</span>
              <ExternalLink className="h-3 w-3 opacity-60 shrink-0" />
            </a>
          ) : (
            <span className="text-zinc-200 whitespace-nowrap">{headline}</span>
          )}
        </div>
      );
    }

    if (isDeliveryItem(item)) {
      const prov = item.province || (item as any).state || 'CA';
      const vehicle = formatVehicleDescription(item);
      const days = item.daysWaited != null ? item.daysWaited : item.wait_days != null ? item.wait_days : 120;

      return (
        <div key={key} className="inline-flex items-center gap-2 shrink-0 text-xs sm:text-sm font-medium">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
            <span>🟢</span>
            <span>DELIVERED</span>
          </span>
          <span className="text-zinc-300 whitespace-nowrap">
            <span className="font-semibold text-white">{prov}</span>
            <span className="text-zinc-500 mx-1">•</span>
            <span>{vehicle}</span>
            <span className="text-zinc-500 mx-1.5">—</span>
            <span className="font-semibold text-emerald-400">{days} days wait</span>
          </span>
        </div>
      );
    }

    // Generic order lifecycle update
    const prov = item.province || (item as any).state || 'CA';
    const vehicle = formatVehicleDescription(item);
    const action = formatActionDescription(item);

    return (
      <div key={key} className="inline-flex items-center gap-2 shrink-0 text-xs sm:text-sm font-medium">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30 whitespace-nowrap">
          <span>⚡</span>
          <span>UPDATE</span>
        </span>
        <span className="text-zinc-300 whitespace-nowrap">
          <span className="font-semibold text-white">{prov}</span>
          <span className="text-zinc-500 mx-1">•</span>
          <span>{vehicle}</span>
          <span className="text-zinc-500 mx-1.5">—</span>
          <span className="font-semibold text-sky-400">{action}</span>
        </span>
      </div>
    );
  };

  return (
    <div
      className="relative w-full overflow-hidden border-b border-white/10 bg-black/40 py-2.5 whitespace-nowrap text-zinc-200 select-none"
      aria-live="polite"
      role="region"
      aria-label="Live Canadian Toyota order activity and news wire"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {/* Explicit scoped CSS to ensure continuous rolling across all browsers and bundlers */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes marquee {
              0% {
                transform: translate3d(0, 0, 0);
              }
              100% {
                transform: translate3d(-50%, 0, 0);
              }
            }
            .animate-marquee {
              display: flex;
              width: max-content;
              animation: marquee 45s linear infinite;
              will-change: transform;
            }
            .animate-marquee:hover {
              animation-play-state: paused;
            }
          `,
        }}
      />

      {prefersReducedMotion ? (
        <div
          tabIndex={0}
          className="flex items-center overflow-x-auto no-scrollbar gap-8 px-4 text-xs sm:text-sm focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          aria-label="Scrollable list of recent community submissions and news"
        >
          {items.map((item, idx) => renderTickerItem(item, `red-${idx}`))}
        </div>
      ) : (
        <div
          className="flex animate-marquee"
          style={{
            animationPlayState: isHovered ? 'paused' : 'running',
          }}
        >
          {/* Set 1 */}
          <div className="flex shrink-0 items-center gap-8 px-4">
            {displayItems.map((item, idx) => renderTickerItem(item, `orig-${idx}`))}
          </div>
          {/* Set 2 (Clone for infinite loop) */}
          <div className="flex shrink-0 items-center gap-8 px-4" aria-hidden="true">
            {displayItems.map((item, idx) => renderTickerItem(item, `clone-${idx}`))}
          </div>
        </div>
      )}
    </div>
  );
}
