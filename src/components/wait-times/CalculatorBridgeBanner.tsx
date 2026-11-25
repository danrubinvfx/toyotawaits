import React from 'react';
import Link from 'next/link';
import type { CalculatorBridgeFramingVariant } from '@/flags';

export interface CalculatorBridgeBannerProps {
  href: string;
  framingVariant?: CalculatorBridgeFramingVariant;
  className?: string;
}

export function CalculatorBridgeBanner({
  href,
  framingVariant = 'control',
  className = '',
}: CalculatorBridgeBannerProps) {
  const isCostOfWaiting = framingVariant === 'cost_of_waiting';

  const eyebrow = isCostOfWaiting
    ? '⏳ Cost of Waiting Analysis'
    : '⚡ Financial Break-Even Analysis';

  const headline = isCostOfWaiting
    ? 'See What Waiting 8+ Months Actually Costs You — Run the Numbers'
    : 'Is the Hybrid Worth the Wait? Calculate Annual Fuel Savings';

  const subcopy = isCostOfWaiting
    ? 'Factor in fuel spend on your current vehicle, potential 2027 MSRP inflation, and lost hybrid savings while you sit in the queue.'
    : 'Calculate your annual fuel savings and determine if paying the hybrid premium or waiting out the queue makes financial sense.';

  return (
    <div
      data-testid="calculator-teaser-banner"
      data-framing-variant={framingVariant}
      className={`rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 my-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${className}`}
    >
      <div className="space-y-1">
        <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
          {eyebrow}
        </div>
        <h3 className="text-sm font-bold text-white">{headline}</h3>
        <p className="text-xs text-neutral-300">{subcopy}</p>
      </div>
      <Link
        href={href}
        className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-all shrink-0 self-start sm:self-center"
      >
        Calculate Payback &amp; Savings →
      </Link>
    </div>
  );
}
