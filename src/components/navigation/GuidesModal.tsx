'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  Snowflake,
  Disc,
  ClipboardCheck,
  Zap,
  Wrench,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export const PRIMARY_GUIDES = [
  {
    slug: 'winter-prep',
    title: 'Winter Prep',
    subtitle: '12V & Floor Mats',
    href: '/winter-prep',
    icon: 'Snowflake',
    badgeClass: 'bg-cyan-950/40 text-cyan-400 border-cyan-800/40',
  },
  {
    slug: 'tires',
    title: 'Tire Fitment',
    subtitle: 'OEM Sizes & 3PMSF',
    href: '/tires',
    icon: 'Disc',
    badgeClass: 'bg-amber-950/40 text-amber-400 border-amber-800/40',
  },
  {
    slug: 'delivery-prep',
    title: 'Delivery Day Prep',
    subtitle: 'Inspection Checklist',
    href: '/delivery-prep',
    icon: 'ClipboardCheck',
    badgeClass: 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40',
  },
  {
    slug: 'ev-rebates',
    title: 'EV Rebates',
    subtitle: 'Federal & Provincial',
    href: '/guides/ev-rebates-guide',
    icon: 'Zap',
    badgeClass: 'bg-purple-950/40 text-purple-400 border-purple-800/40',
  },
  {
    slug: 'sienna-hitch',
    title: 'Sienna Hitch',
    subtitle: 'Sensors & Install',
    href: '/guides/toyota-sienna-trailer-hitch-guide',
    icon: 'Wrench',
    badgeClass: 'bg-orange-950/40 text-orange-400 border-orange-800/40',
  },
  {
    slug: 'rav4-gear',
    title: 'RAV4 Gear Guide',
    subtitle: 'Must-Have Accessories',
    href: '/guides/toyota-rav4-must-have-accessories',
    icon: 'Sparkles',
    badgeClass: 'bg-blue-950/40 text-blue-400 border-blue-800/40',
  },
];

export const MODEL_MOD_PILLS = [
  { name: 'Sienna', href: '/guides/sienna-mods' },
  { name: 'RAV4', href: '/guides/rav4-mods' },
  { name: 'Grand Highlander', href: '/guides/grand-highlander-mods' },
  { name: 'Prius', href: '/guides/prius-mods' },
  { name: 'Corolla', href: '/guides/corolla-mods' },
  { name: 'Sequoia', href: '/guides/sequoia-mods' },
];

function IconComponent({ name, className }: { name: string; className?: string }) {
  switch (name) {
    case 'Snowflake':
      return <Snowflake className={className} aria-hidden="true" />;
    case 'Disc':
      return <Disc className={className} aria-hidden="true" />;
    case 'ClipboardCheck':
      return <ClipboardCheck className={className} aria-hidden="true" />;
    case 'Zap':
      return <Zap className={className} aria-hidden="true" />;
    case 'Wrench':
      return <Wrench className={className} aria-hidden="true" />;
    case 'Sparkles':
      return <Sparkles className={className} aria-hidden="true" />;
    default:
      return <BookOpen className={className} aria-hidden="true" />;
  }
}

export interface GuidesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuidesModal({ isOpen, onClose }: GuidesModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden" data-testid="mobile-guides-modal-root">
      {/* Backdrop */}
      <div
        data-testid="mobile-guides-modal-overlay"
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-Up Bottom Sheet */}
      <div
        data-testid="mobile-guides-modal-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Guides & Delivery Prep"
        className="fixed bottom-0 inset-x-0 z-50 rounded-t-2xl bg-zinc-900 border-t border-zinc-800 max-h-[85vh] overflow-y-auto pb-safe shadow-2xl space-y-2"
      >
        {/* Pull Handle */}
        <div className="pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-zinc-700 mx-auto" aria-hidden="true" />
        </div>

        {/* Sheet Header */}
        <div className="flex items-center justify-between px-4 pb-2 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Vehicle Guides &amp; Prep
            </h3>
            <p className="text-xs text-zinc-400">
              Field-tested playbooks, checklists, and mods
            </p>
          </div>
          <button
            type="button"
            data-testid="mobile-guides-modal-close-btn"
            onClick={onClose}
            aria-label="Close guides modal"
            className="rounded-full p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="p-4 space-y-4 pt-1">
          <div>
            <div className="flex items-center justify-between mb-2.5 px-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Popular Guides &amp; Prep
              </span>
              <Link
                href="/guides"
                onClick={onClose}
                className="text-[11px] font-medium text-amber-400 hover:text-amber-300 transition-colors"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {PRIMARY_GUIDES.map((guide) => (
                <Link
                  key={guide.slug}
                  href={guide.href}
                  onClick={onClose}
                  className="group relative flex items-center justify-between p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 active:scale-[0.98] transition-all overflow-hidden"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${guide.badgeClass}`}>
                      <IconComponent name={guide.icon} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex flex-col text-left">
                      <span className="text-xs font-semibold text-neutral-100 group-hover:text-white truncate">
                        {guide.title}
                      </span>
                      <span className="text-[10px] text-neutral-400 truncate leading-tight">
                        {guide.subtitle}
                      </span>
                    </div>
                  </div>
                  <span className="text-neutral-500 group-hover:text-neutral-300 text-xs shrink-0 ml-1">
                    ›
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-800/60">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2 px-0.5">
              Model Mod Hubs
            </span>
            <div className="flex flex-wrap gap-1.5">
              {MODEL_MOD_PILLS.map((mod) => (
                <Link
                  key={mod.name}
                  href={mod.href}
                  onClick={onClose}
                  className="px-2.5 py-1 text-xs rounded-lg bg-neutral-900/60 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
                >
                  {mod.name} Mods
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuidesModal;
