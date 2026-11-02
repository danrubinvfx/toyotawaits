'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ExternalLink,
  CheckCircle2,
  Check,
  Tent,
  Moon,
  Wind,
  Refrigerator,
  Flame,
  Layers,
  Sparkles,
} from 'lucide-react';
import { buildAmazonAffiliateUrl } from '@/lib/affiliate';

export type CampingCategory =
  | 'Sleep Setup'
  | 'Window Privacy & Bug Screens'
  | '12V Refrigeration'
  | 'Tailgate & Outdoor Living';

export interface SiennaCampingGear {
  id: string;
  name: string;
  badge: 'Must-Have' | 'Custom Fit' | 'Stealth Camp' | '12V Hybrid Ready' | 'Tailgate Ready' | string;
  category: CampingCategory;
  fitment: string;
  features: string[];
  priceCad: string;
  query: string;
}

export const AFFILIATE_TAG = 'toyotawaits-20';

const CATEGORIES = [
  'All',
  'Sleep Setup',
  'Window Privacy & Bug Screens',
  '12V Refrigeration',
  'Tailgate & Outdoor Living',
] as const;

function getCategoryIcon(category: string) {
  switch (category) {
    case 'Sleep Setup':
      return <Moon className="w-3.5 h-3.5 mr-1.5 shrink-0" />;
    case 'Window Privacy & Bug Screens':
      return <Wind className="w-3.5 h-3.5 mr-1.5 shrink-0" />;
    case '12V Refrigeration':
      return <Refrigerator className="w-3.5 h-3.5 mr-1.5 shrink-0" />;
    case 'Tailgate & Outdoor Living':
      return <Tent className="w-3.5 h-3.5 mr-1.5 shrink-0" />;
    default:
      return <Layers className="w-3.5 h-3.5 mr-1.5 shrink-0" />;
  }
}

function getBadgeVariantClass(badge: string) {
  switch (badge) {
    case 'Must-Have':
      return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
    case 'Custom Fit':
      return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300';
    case 'Stealth Camp':
      return 'border-purple-500/30 bg-purple-500/10 text-purple-300';
    case '12V Hybrid Ready':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
    case 'Tailgate Ready':
      return 'border-blue-500/30 bg-blue-500/10 text-blue-300';
    default:
      return 'border-zinc-700 bg-zinc-800 text-zinc-300';
  }
}

export interface SiennaCampingGridProps {
  items: SiennaCampingGear[];
}

export function SiennaCampingGrid({ items }: SiennaCampingGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return items;
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: items.length };
    for (const item of items) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, [items]);

  return (
    <div className="space-y-6">
      {/* Category Tabs / Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          const count = categoryCounts[cat] || 0;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`inline-flex items-center px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              {getCategoryIcon(cat)}
              <span>{cat}</span>
              <span
                className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-zinc-950/20 text-zinc-950 font-black' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Empty State Guard */}
      {filteredItems.length === 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 text-center text-zinc-400">
          No gear found in this category.
        </div>
      )}

      {/* Responsive Gear Grid (1 col mobile, 2–3 col desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((gear) => {
          const amazonUrl = buildAmazonAffiliateUrl(gear.query, 'CA');

          return (
            <Card
              key={gear.id}
              className="flex flex-col justify-between border-zinc-800 bg-zinc-900/70 hover:border-zinc-700/80 transition-all duration-200 shadow-lg group overflow-hidden"
            >
              <CardHeader className="space-y-3 pb-3">
                {/* Badge and Category */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getBadgeVariantClass(
                      gear.badge
                    )}`}
                  >
                    <Sparkles className="w-3 h-3 shrink-0" />
                    {gear.badge}
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                    {gear.category}
                  </span>
                </div>

                {/* Product Name */}
                <CardTitle className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug">
                  {gear.name}
                </CardTitle>

                {/* Fitment Note */}
                <div className="flex items-start gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 rounded-md p-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-tight">{gear.fitment}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-5 flex-1 flex flex-col justify-between pt-0">
                {/* Key feature bullet points (2–3 bullet points) */}
                <ul className="space-y-2 text-xs text-zinc-300">
                  {gear.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <Check className="w-3.5 h-3.5 text-emerald-400/90 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Bottom Section: Price & CTA */}
                <div className="pt-4 border-t border-zinc-800/80 space-y-3">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-zinc-400">Est. Price Range</span>
                    <span className="font-bold text-emerald-400 text-sm">{gear.priceCad}</span>
                  </div>

                  <a
                    href={amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored nofollow"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                  >
                    <span>View on Amazon</span>
                    <ExternalLink className="w-4 h-4 shrink-0" />
                  </a>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
