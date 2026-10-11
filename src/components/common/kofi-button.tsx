import React from 'react';
import { Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';

export const KOFI_URL = 'https://ko-fi.com/toyotawaits';

export interface KofiHeaderPillProps {
  className?: string;
}

/**
 * Desktop & Tablet Header Navigation Pill: "Support Tracker ☕"
 * Placed beside "Submit Wait Time" button in header navigation.
 */
export function KofiHeaderPill({ className }: KofiHeaderPillProps) {
  return (
    <a
      href={KOFI_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="kofi-header-pill"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/5 px-3 py-1.5 text-xs font-semibold text-amber-500 dark:text-amber-400 hover:border-amber-500/60 hover:bg-amber-500/10 hover:text-amber-300 transition-all duration-150 shadow-xs cursor-pointer',
        className
      )}
    >
      <span>Support Tracker ☕</span>
    </a>
  );
}

export interface KofiFloatingPillProps {
  className?: string;
}

/**
 * Mobile Viewports Floating Pill: "☕ Buy a Coffee"
 * Fixed at bottom-right (bottom-4 right-4 z-40) on mobile screens.
 * Styled to avoid overlapping the vehicle selector or primary buttons.
 */
export function KofiFloatingPill({ className }: KofiFloatingPillProps) {
  return (
    <div
      data-testid="kofi-floating-container"
      className={cn(
        'fixed bottom-4 right-4 z-40 sm:hidden print:hidden pointer-events-auto',
        className
      )}
    >
      <a
        href={KOFI_URL}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="kofi-floating-pill"
        className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-zinc-950/95 backdrop-blur-md px-3.5 py-2 text-xs font-bold text-amber-400 hover:border-amber-400 hover:bg-zinc-900 shadow-xl transition-all duration-200 active:scale-95 cursor-pointer"
      >
        <span aria-hidden="true">☕</span>
        <span>Buy a Coffee</span>
      </a>
    </div>
  );
}

export interface KofiCalloutCardProps {
  className?: string;
}

/**
 * Footer Secondary Callout Card
 * "ToyotaWaits is an independent, ad-free community project. If this saved you time at the dealership, consider supporting hosting costs [☕ Buy us a coffee]."
 */
export function KofiCalloutCard({ className }: KofiCalloutCardProps) {
  return (
    <div
      data-testid="kofi-footer-callout"
      className={cn(
        'rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs',
        className
      )}
    >
      <div className="space-y-1 max-w-xl">
        <p className="font-semibold text-zinc-100 flex items-center gap-1.5">
          <Coffee className="h-4 w-4 text-amber-500" />
          <span>Independent &amp; Ad-Free Community Project</span>
        </p>
        <p className="text-zinc-400 leading-relaxed text-[11px] sm:text-xs">
          ToyotaWaits is an independent, ad-free community project. If this saved you time at the dealership, consider supporting hosting costs:
        </p>
      </div>

      <a
        href={KOFI_URL}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="kofi-footer-button"
        className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-2 text-xs transition-all shadow-sm shrink-0 self-start sm:self-center cursor-pointer"
      >
        <span>☕ Buy us a coffee</span>
      </a>
    </div>
  );
}

export default KofiHeaderPill;
