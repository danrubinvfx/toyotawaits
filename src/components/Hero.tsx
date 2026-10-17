'use client';

import React from 'react';
import { Flame } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import { getMarketCopy } from '@/lib/constants/marketCopy';

export interface HeroProps {
  initialMarket?: 'CA' | 'US';
}

export function Hero({ initialMarket }: HeroProps) {
  const { market } = useMarket();
  const currentMarket = market || initialMarket || 'CA';
  const copy = getMarketCopy(currentMarket);

  return (
    <div className="text-center space-y-2 max-w-3xl mx-auto pt-4 sm:pt-6" data-testid="hero-header">
      {/* Eyebrow Pill */}
      <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-semibold text-amber-400">
        <Flame className="h-3.5 w-3.5 text-amber-400" />
        <span data-testid="hero-domain">{copy.domain}</span>
        <span className="text-zinc-600">•</span>
        <span data-testid="hero-eyebrow">{copy.heroEyebrow}</span>
      </div>

      {/* Main H1 Title */}
      <h1
        data-testid="hero-title"
        className="text-2xl sm:text-4xl font-extrabold tracking-tight text-center text-white leading-tight"
      >
        {copy.heroTitle}
      </h1>

      {/* Subcopy */}
      <p data-testid="hero-subtitle" className="text-xs text-neutral-400 font-medium tracking-wide">
        {copy.heroSubtitle}
      </p>

      <p data-testid="hero-description" className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl mx-auto">
        {copy.heroDescription}
      </p>
    </div>
  );
}

export default Hero;
