'use client';

import React from 'react';
import {
  NewsTickerItem,
  DeliveryTickerItem,
  RecentActivityItem,
} from '@/lib/types/contracts';
import { TickerItem as UnifiedTickerItem } from '@/types/ticker';
import { TickerWire, normalizeTickerItem } from '@/components/common/TickerWire';

export type AnyTickerItem = UnifiedTickerItem | NewsTickerItem | DeliveryTickerItem | RecentActivityItem | any;

export interface ActivityTickerProps {
  initialData?: AnyTickerItem[];
}

export function isNewsItem(item: AnyTickerItem): item is NewsTickerItem {
  if (!item) return false;
  if (
    item.type === 'delivery' ||
    item.type === 'inventory' ||
    item.type === 'gear' ||
    item.status === 'delivered' ||
    item.lifecycle_status === 'delivered' ||
    item.daysWaited != null ||
    item.isUserSubmission === true
  ) {
    return false;
  }
  const cat = String(item.category || item.tag || '').toLowerCase();
  if (cat === 'delivery' || cat === 'deliveries' || cat === 'user_delivery') {
    return false;
  }
  return Boolean(
    item.type === 'news' ||
      item.type === 'article' ||
      'headline' in item ||
      ('title' in item && !('model_name' in item))
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
  if (item && typeof item.text === 'string' && typeof item.badge === 'string') {
    return `${item.badge} • ${item.text}`;
  }

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
  return <TickerWire initialData={initialData} />;
}

export { TickerWire, normalizeTickerItem };
export default ActivityTicker;
