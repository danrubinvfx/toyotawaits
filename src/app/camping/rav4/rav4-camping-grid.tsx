'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  ExternalLink,
  CheckCircle2,
  Check,
  Tent,
  Moon,
  Shield,
  Layers,
  Sparkles,
  Smartphone,
} from 'lucide-react';
import { buildAmazonAffiliateUrl } from '@/lib/affiliate';

export type Rav4CampingCategory =
  | 'In-Vehicle Sleeping'
  | 'Cargo Defense'
  | 'Cockpit Mounts'
  | 'Outdoor & Roof';

export interface Rav4CampingGear {
  id: string;
  name: string;
  badge: 'Must-Have' | 'Custom Fit' | 'Overland Ready' | 'Top Upgrade' | 'Stealth Camp' | string;
  category: Rav4CampingCategory;
  fitment: string;
  features: string[];
  priceCad: string;
  query: string;
}

export const AFFILIATE_TAG = 'toyotawaits-20';

const CATEGORIES = [
  'All',
  'In-Vehicle Sleeping',
  'Cargo Defense',
  'Cockpit Mounts',
  'Outdoor & Roof',
] as const;

function getCategoryIcon(category: string) {
  switch (category) {
    case 'In-Vehicle Sleeping':
      return <Moon className="w-3.5 h-3.5 mr-1.5 shrink-0" />;
    case 'Cargo Defense':
      return <Shield className="w-3.5 h-3.5 mr-1.5 shrink-0" />;
    case 'Cockpit Mounts':
      return <Smartphone className="w-3.5 h-3.5 mr-1.5 shrink-0" />;
    case 'Outdoor & Roof':
      return <Tent className="w-3.5 h-3.5 mr-1.5 shrink-0" />;
    default:
      return <Layers className="w-3.5 h-3.5 mr-1.5 shrink-0" />;
  }
}

function getBadgeVariantClass(badge: string) {
  switch (badge) {
    case 'Must-Have':
      return 'border-amber-800/50 bg-amber-950/40 text-amber-300';
    case 'Custom Fit':
      return 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400';
    case 'Overland Ready':
      return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400';
    case 'Top Upgrade':
      return 'border-amber-400/40 bg-amber-400/10 text-amber-300';
    case 'Stealth Camp':
      return 'border-purple-500/40 bg-purple-500/10 text-purple-400';
    default:
      return 'border-slate-700 bg-slate-800 text-slate-300';
  }
}

export interface Rav4CampingGridProps {
  items: Rav4CampingGear[];
}

export function Rav4CampingGrid({ items }: Rav4CampingGridProps) {
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
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {getCategoryIcon(cat)}
              <span>{cat}</span>
              <span
                className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-slate-950/20 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
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
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-400 text-sm">
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
              className="flex flex-col justify-between border-slate-800 bg-slate-900/70 hover:border-slate-700/80 transition-all duration-200 shadow-xl group overflow-hidden"
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
                  <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                    {gear.category}
                  </span>
                </div>

                {/* Product Name */}
                <CardTitle className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                  {gear.name}
                </CardTitle>

                {/* Fitment Note */}
                <div className="flex items-start gap-1.5 text-xs text-amber-300 font-medium bg-amber-950/40 border border-amber-800/50 rounded-md p-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
                  <span className="leading-tight">{gear.fitment}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-5 flex-1 flex flex-col justify-between pt-0">
                {/* Key feature bullet points (2–3 bullet points) */}
                <ul className="space-y-2 text-xs text-slate-300">
                  {gear.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <Check className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Bottom Section: Price & CTA */}
                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-400">Est. Price Range</span>
                    <span className="font-bold text-amber-300 text-sm">{gear.priceCad}</span>
                  </div>

                  <a
                    href={amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored nofollow"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-950 shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900"
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
