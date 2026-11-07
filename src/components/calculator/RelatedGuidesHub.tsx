import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, BookOpen } from 'lucide-react';

export function TrustCalloutBanner() {
  return (
    <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/15 dark:bg-emerald-950/30 p-3 sm:p-4 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 shadow-xs">
      <div className="flex items-center gap-2.5 sm:gap-3">
        <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <p className="font-medium text-zinc-800 dark:text-zinc-200 leading-snug">
          <span className="font-bold text-emerald-700 dark:text-emerald-400">100% Free &amp; Independent</span>
          {' '}• No signups, no email required, nothing stored • Real Canadian wait-time medians, fuel savings, and all-in pricing transparency.
        </p>
      </div>
    </div>
  );
}

export interface RelatedGuideItem {
  title: string;
  href: string;
  description: string;
  tag?: string;
}

const DEFAULT_GUIDES: RelatedGuideItem[] = [
  {
    title: '2021+ Toyota Sienna Trailer Hitch & Kick Sensor Guide',
    href: '/guides/toyota-sienna-trailer-hitch-guide',
    description: 'EcoHitch vs. Curt 13470 comparison, bumper removal instructions, kick sensor retention, and wiring options.',
    tag: 'Factory Mod & Towing',
  },
  {
    title: '2026 vs. 2027 Toyota RAV4 Carryover & Buying Guide',
    href: '/guides/toyota-rav4-2026-vs-2027',
    description: 'Model year generational changes, factory allocation carryovers, and trim package breakdowns.',
    tag: 'Generational Buyers Guide',
  },
  {
    title: 'Delivery Day Inspection Checklist & Factory Pickup Guide',
    href: '/delivery-prep',
    description: 'All-in pricing audit, PDI checklist, anti-theft tagging, and essential day-one accessories.',
    tag: 'PDI & Handover',
  },
];

export function RelatedGuidesHub({ guides = DEFAULT_GUIDES }: { guides?: RelatedGuideItem[] }) {
  return (
    <section aria-labelledby="related-guides-heading" className="space-y-3 sm:space-y-4">
      <div>
        <h2 id="related-guides-heading" className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-500" />
          Guides to Pair With Your Search
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
          Clear, field-tested guides on factory options, waitlists, and vehicle delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {guides.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            className="group block p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all space-y-2 cursor-pointer"
          >
            {guide.tag && (
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md border border-red-200/50 dark:border-red-900/40">
                {guide.tag}
              </span>
            )}
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors flex items-start justify-between gap-2">
              <span>{guide.title}</span>
              <ArrowRight className="w-4 h-4 shrink-0 text-zinc-400 group-hover:text-red-600 dark:group-hover:text-red-400 group-hover:translate-x-0.5 transition-all mt-0.5" />
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {guide.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
