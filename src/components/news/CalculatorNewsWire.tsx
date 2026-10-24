'use client';

import React from 'react';
import { ActivityTicker } from '@/components/feed/ActivityTicker';
import { NewsTickerItem } from '@/lib/types/contracts';

export const CALCULATOR_NEWS_ITEMS: NewsTickerItem[] = [
  {
    id: 'news-1',
    type: 'news',
    category: 'ALLOCATION',
    title: '2026 RAV4 Hybrid & PHEV production allocations active for Canadian dealers',
    headline: '2026 RAV4 Hybrid & PHEV production allocations active for Canadian dealers',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'news-2',
    type: 'news',
    category: 'DELIVERY',
    title: 'Camry Hybrid wait times stabilizing at 3–4 months across BC and Ontario',
    headline: 'Camry Hybrid wait times stabilizing at 3–4 months across BC and Ontario',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'news-3',
    type: 'news',
    category: 'MARKET UPDATE',
    title: 'Prius Prime deliveries expanding; federal iZEV rebates apply at point of sale',
    headline: 'Prius Prime deliveries expanding; federal iZEV rebates apply at point of sale',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'news-4',
    type: 'news',
    category: 'PRODUCTION',
    title: 'Sienna AWD hybrid fulfillment improving for Q2/Q3 2026 backlogs',
    headline: 'Sienna AWD hybrid fulfillment improving for Q2/Q3 2026 backlogs',
    timestamp: new Date().toISOString(),
  },
];

export interface CalculatorNewsWireProps {
  className?: string;
  items?: NewsTickerItem[];
}

export function CalculatorNewsWire({
  className,
  items = CALCULATOR_NEWS_ITEMS,
}: CalculatorNewsWireProps) {
  return (
    <div
      className={`rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-black/40 shadow-xs ${className ?? ''}`}
      aria-label="Toyota allocation and production news ticker"
    >
      <ActivityTicker initialData={items} />
    </div>
  );
}
