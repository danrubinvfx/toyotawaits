'use client';

import React, { useMemo } from 'react';
import { ActivityTicker } from '@/components/feed/ActivityTicker';
import { NewsTickerItem } from '@/lib/types/contracts';
import { useCalculatorContext } from '@/context/CalculatorContext';

export interface ModelNewsTickerItem extends NewsTickerItem {
  applicableModels?: string[];
}

export const CALCULATOR_NEWS_ITEMS: ModelNewsTickerItem[] = [
  {
    id: 'news-rav4-1',
    type: 'news',
    category: 'ALLOCATION',
    title: '2026 RAV4 Hybrid & PHEV production allocations active for Canadian dealers',
    headline: '2026 RAV4 Hybrid & PHEV production allocations active for Canadian dealers',
    timestamp: new Date().toISOString(),
    applicableModels: ['rav4', 'rav4-hybrid', 'rav4-phev'],
  },
  {
    id: 'news-sienna-1',
    type: 'news',
    category: 'PRODUCTION',
    title: 'Sienna AWD hybrid fulfillment improving for Q2/Q3 2026 backlogs',
    headline: 'Sienna AWD hybrid fulfillment improving for Q2/Q3 2026 backlogs',
    timestamp: new Date().toISOString(),
    applicableModels: ['sienna', 'sienna-hybrid'],
  },
  {
    id: 'news-gh-1',
    type: 'news',
    category: 'ALLOCATION',
    title: 'Grand Highlander Hybrid MAX inventory batches arriving at West Coast ports',
    headline: 'Grand Highlander Hybrid MAX inventory batches arriving at West Coast ports',
    timestamp: new Date().toISOString(),
    applicableModels: ['grand-highlander', 'grand-highlander-hybrid'],
  },
  {
    id: 'news-camry-1',
    type: 'news',
    category: 'DELIVERY',
    title: 'Camry Hybrid wait times stabilizing at 3–4 months across BC and Ontario',
    headline: 'Camry Hybrid wait times stabilizing at 3–4 months across BC and Ontario',
    timestamp: new Date().toISOString(),
    applicableModels: ['camry', 'camry-hybrid'],
  },
  {
    id: 'news-prius-1',
    type: 'news',
    category: 'MARKET UPDATE',
    title: 'Prius Prime deliveries expanding; federal iZEV rebates apply at point of sale',
    headline: 'Prius Prime deliveries expanding; federal iZEV rebates apply at point of sale',
    timestamp: new Date().toISOString(),
    applicableModels: ['prius', 'prius-hybrid', 'prius-prime'],
  },
  {
    id: 'news-crown-1',
    type: 'news',
    category: 'ALLOCATION',
    title: 'Crown Signia Hybrid initial allocations shipping with standard AWD',
    headline: 'Crown Signia Hybrid initial allocations shipping with standard AWD',
    timestamp: new Date().toISOString(),
    applicableModels: ['crown-signia', 'crown-signia-hybrid'],
  },
];

export interface CalculatorNewsWireProps {
  className?: string;
  items?: ModelNewsTickerItem[];
  activeModel?: string;
}

export function CalculatorNewsWire({
  className,
  items = CALCULATOR_NEWS_ITEMS,
  activeModel: propActiveModel,
}: CalculatorNewsWireProps) {
  const calculatorContext = useCalculatorContext();
  const activeModel = (propActiveModel || calculatorContext?.activeModelSlug || 'rav4').toLowerCase();

  // Dynamically float and prioritize news matching the active vehicle family
  const sortedItems = useMemo(() => {
    if (!activeModel) return items;

    const matches: ModelNewsTickerItem[] = [];
    const others: ModelNewsTickerItem[] = [];

    for (const item of items) {
      const isMatch =
        item.applicableModels?.some((m) => m.toLowerCase().includes(activeModel) || activeModel.includes(m.toLowerCase())) ||
        item.title?.toLowerCase().includes(activeModel) ||
        item.headline?.toLowerCase().includes(activeModel);

      if (isMatch) {
        matches.push(item);
      } else {
        others.push(item);
      }
    }

    return [...matches, ...others];
  }, [items, activeModel]);

  return (
    <div
      className={`rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-black/40 shadow-xs ${className ?? ''}`}
      aria-label="Toyota allocation and production news ticker"
    >
      <ActivityTicker initialData={sortedItems} />
    </div>
  );
}
