'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ExternalLink } from 'lucide-react';
import { TickerItem, TickerItemType, TICKER_BADGE_COLORS } from '@/types/ticker';
import { trackAffiliateClick } from '@/lib/gear/telemetry';
import { useMarket } from '@/context/MarketContext';

export interface TickerWireProps {
  initialData?: Array<TickerItem | Record<string, any> | null | undefined>;
}

const DEFAULT_BADGES: Record<TickerItemType, string> = {
  news: '[🗞️ UPDATE]',
  inventory: '[🟢 LIVE LOT]',
  delivery: '[📦 DELIVERED]',
  gear: '[⚡ GEAR PICK]',
};

const SHORTHAND_BADGE_COLORS: Record<string, string> = {
  sky: TICKER_BADGE_COLORS.news,
  cyan: TICKER_BADGE_COLORS.news,
  emerald: TICKER_BADGE_COLORS.inventory,
  green: TICKER_BADGE_COLORS.inventory,
  amber: TICKER_BADGE_COLORS.delivery,
  yellow: TICKER_BADGE_COLORS.delivery,
  purple: TICKER_BADGE_COLORS.gear,
  indigo: TICKER_BADGE_COLORS.gear,
};

function resolveBadgeColor(rawColor: string | undefined | null, type: TickerItemType): string {
  if (!rawColor || typeof rawColor !== 'string') {
    return TICKER_BADGE_COLORS[type] || TICKER_BADGE_COLORS.news;
  }
  const trimmed = rawColor.trim();
  if (SHORTHAND_BADGE_COLORS[trimmed]) {
    return SHORTHAND_BADGE_COLORS[trimmed];
  }
  return trimmed;
}

/**
 * Normalizes any incoming ticker item (unified `TickerItem` or legacy `NewsTickerItem` / `DeliveryTickerItem`)
 * into the unified 4-stream `TickerItem` contract.
 */
export function normalizeTickerItem(raw: any, index = 0): TickerItem | null {
  if (!raw || typeof raw !== 'object') return null;

  const type: TickerItemType =
    raw.type === 'inventory' || raw.type === 'delivery' || raw.type === 'gear' || raw.type === 'news'
      ? raw.type
      : 'model_name' in raw || raw.status === 'delivered'
      ? 'delivery'
      : 'news';

  // Already a unified TickerItem
  if (typeof raw.text === 'string' && raw.text.trim().length > 0) {
    const isExternal = Boolean(
      raw.isExternal ?? (type === 'gear' || (typeof raw.linkUrl === 'string' && /^https?:\/\//i.test(raw.linkUrl)))
    );
    return {
      id: String(raw.id || `${type}-${index}`),
      type,
      badge: raw.badge || DEFAULT_BADGES[type],
      badgeColor: resolveBadgeColor(raw.badgeColor, type),
      text: raw.text,
      linkUrl: raw.linkUrl || '/',
      isExternal,
      accessoryId: raw.accessoryId,
      modelContext: raw.modelContext ?? null,
    };
  }

  // Legacy DeliveryTickerItem support
  if (type === 'delivery') {
    const year = raw.model_year || 2026;
    const model = raw.model_name || 'RAV4';
    const trim = raw.trim_name ? ` ${raw.trim_name}` : '';
    const province = raw.province || raw.state || 'CA';
    const waitDays = raw.daysWaited ?? raw.wait_days ?? 120;
    return {
      id: String(raw.id || `del-${index}`),
      type: 'delivery',
      badge: raw.badge || '[📦 DELIVERED]',
      badgeColor: resolveBadgeColor(raw.badgeColor, 'delivery'),
      text: `${year} ${model}${trim} delivered in ${province} after ${waitDays} days`,
      linkUrl: raw.linkUrl || '/',
      isExternal: false,
    };
  }

  // Legacy NewsTickerItem support
  const headline = raw.headline || raw.title || 'Toyota Allocation & Pipeline Update';
  const rawTag = raw.tag || raw.category;
  const badge = raw.badge || (rawTag ? `[🗞️ ${rawTag}]` : '[🗞️ UPDATE]');
  const linkUrl = raw.linkUrl || raw.url || '/';
  const isExternal = Boolean(raw.isExternal ?? Boolean(raw.url));

  return {
    id: String(raw.id || `news-${index}`),
    type: 'news',
    badge,
    badgeColor: resolveBadgeColor(raw.badgeColor, 'news'),
    text: headline,
    linkUrl,
    isExternal,
  };
}

class TickerErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('[Ticker] Render error caught by boundary:', error);
  }

  render() {
    if (this.state.hasError) {
      return <div className="h-9 bg-zinc-950 border-b border-zinc-800" />;
    }
    return this.props.children;
  }
}

function TickerWireInner({ initialData = [] }: TickerWireProps) {
  const { isUs } = useMarket();
  const [items, setItems] = useState<TickerItem[]>(() =>
    Array.isArray(initialData)
      ? (initialData
          .filter(Boolean)
          .map((item, idx) => normalizeTickerItem(item, idx))
          .filter(Boolean) as TickerItem[])
      : []
  );
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (Array.isArray(initialData)) {
      const normalized = initialData
        .filter(Boolean)
        .map((item, idx) => normalizeTickerItem(item, idx))
        .filter(Boolean) as TickerItem[];
      setItems(normalized);
    }
  }, [initialData]);

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

  useEffect(() => {
    const fetchTicker = async () => {
      try {
        const res = await fetch('/api/ticker');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            const normalized = json.data
              .filter(Boolean)
              .map((item: any, idx: number) => normalizeTickerItem(item, idx))
              .filter(Boolean) as TickerItem[];
            if (normalized.length > 0) {
              setItems(normalized);
            }
          }
        }
      } catch {
        // Silently retain current ticker items on fetch failure
      }
    };

    const interval = setInterval(fetchTicker, 60000);
    return () => clearInterval(interval);
  }, []);

  const displayItems = useMemo(() => {
    const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];
    if (safeItems.length === 0) return [];
    if (safeItems.length < 4) {
      return [...safeItems, ...safeItems, ...safeItems];
    }
    return safeItems;
  }, [items]);

  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const handleItemClick = (item: TickerItem) => {
    if (item && item.type === 'gear') {
      trackAffiliateClick({
        accessory_id: item.accessoryId || item.id,
        placement: 'inventory_feed',
        model_context: item.modelContext || 'ticker_wire',
        target_url: item.linkUrl,
      });
    }
  };

  const renderTickerItem = (item: TickerItem, prefix = 'item') => {
    if (!item || typeof item !== 'object') return null;
    const key = `${prefix}-${item.id || ''}`;
    const badgeColorClass = resolveBadgeColor(item.badgeColor, item.type);

    return (
      <div
        key={key}
        data-ticker-type={item.type}
        className="inline-flex items-center gap-2 shrink-0 text-xs sm:text-sm font-medium"
      >
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border whitespace-nowrap ${badgeColorClass}`}
        >
          <span>{item.badge}</span>
        </span>
        {item.linkUrl ? (
          <a
            href={item.linkUrl}
            target={item.isExternal ? '_blank' : undefined}
            rel={item.isExternal ? 'noopener noreferrer' : undefined}
            onClick={() => handleItemClick(item)}
            className="text-zinc-200 hover:text-white hover:underline transition-colors whitespace-nowrap inline-flex items-center gap-1 cursor-pointer"
          >
            <span>{item.text}</span>
            {item.isExternal && <ExternalLink className="h-3 w-3 opacity-60 shrink-0" />}
          </a>
        ) : (
          <span className="text-zinc-200 whitespace-nowrap">{item.text}</span>
        )}
      </div>
    );
  };

  return (
    <div
      className="relative w-full overflow-hidden border-b border-white/10 bg-black/40 py-2.5 whitespace-nowrap text-zinc-200 select-none"
      aria-live="polite"
      role="region"
      aria-label={isUs ? 'Live U.S. Toyota news wire' : 'Live Canadian Toyota news wire'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
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
              animation: marquee 75s linear infinite;
              will-change: transform;
            }
            .animate-marquee:hover,
            .animate-marquee:active {
              animation-play-state: paused;
            }
          `,
        }}
      />

      {prefersReducedMotion ? (
        <div
          tabIndex={0}
          className="flex items-center overflow-x-auto no-scrollbar gap-8 px-4 text-xs sm:text-sm focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          aria-label="Scrollable list of curated Toyota news articles"
        >
          {items.filter(Boolean).map((item, idx) => renderTickerItem(item, `red-${idx}`))}
        </div>
      ) : (
        <div
          className="flex animate-marquee hover:[animation-play-state:paused] active:[animation-play-state:paused]"
          style={{
            animationDuration: '75s',
            animationPlayState: isHovered ? 'paused' : 'running',
          }}
        >
          {/* Set 1 */}
          <div className="flex shrink-0 items-center gap-8 px-4" data-testid="ticker-marquee-primary">
            {displayItems.map((item, idx) => renderTickerItem(item, `orig-${idx}`))}
          </div>
          {/* Set 2 (Clone for infinite loop) */}
          <div className="flex shrink-0 items-center gap-8 px-4" aria-hidden="true" data-testid="ticker-marquee-clone">
            {displayItems.map((item, idx) => renderTickerItem(item, `clone-${idx}`))}
          </div>
        </div>
      )}
    </div>
  );
}

export function TickerWire(props: TickerWireProps) {
  return (
    <TickerErrorBoundary>
      <TickerWireInner {...props} />
    </TickerErrorBoundary>
  );
}

export default TickerWire;
