'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, ExternalLink } from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import { buildAmazonAffiliateUrl } from '@/lib/affiliate';
import { getAffiliateButtonLabel, getImageLinkAriaLabel } from '@/lib/gear/affiliate';

export interface PopularGearItem {
  title: string;
  tagline: string;
  price: string;
  slug: string;
  query?: string;
  asin?: string;
}

export function PopularGearCard({ item }: { item: PopularGearItem }) {
  const { market, isUs } = useMarket();

  const amazonUrl = buildAmazonAffiliateUrl({
    query: item.query || item.title,
    asin: item.asin,
    market,
  });

  const buttonLabel = getAffiliateButtonLabel(amazonUrl);
  const ariaLabel = getImageLinkAriaLabel(item.title, amazonUrl);

  return (
    <Card className="border-zinc-200 dark:border-zinc-800 bg-zinc-900/40 p-4 space-y-3 flex flex-col justify-between">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px]">
            {item.price}
          </Badge>
          <span className="text-[10px] text-zinc-500">{isUs ? 'Amazon.com' : 'Amazon.ca'}</span>
        </div>
        <h3 className="text-sm font-bold text-zinc-100 leading-tight">{item.title}</h3>
        <p className="text-xs text-zinc-400 leading-relaxed">{item.tagline}</p>
        {item.slug === 'noco-gb40-jump-pack' && (
          <div className="pt-1">
            <a
              href="https://www.youtube.com/watch?v=gNDH1z4Is48"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-950/80 px-2 py-1 text-[11px] text-zinc-300 hover:border-amber-500/50 hover:bg-zinc-900/90 hover:text-amber-300 transition-all shadow-2xs"
            >
              <Play className="h-2.5 w-2.5 text-red-500 fill-red-500 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="leading-snug text-[10px] text-zinc-400 group-hover:text-zinc-300">
                Comparing GB40 vs GBX45? Watch breakdown &rarr;
              </span>
            </a>
          </div>
        )}
      </div>
      <Button asChild size="sm" variant="outline" className="w-full text-xs font-semibold border-zinc-700 hover:border-amber-500 hover:text-amber-400 gap-1.5 cursor-pointer">
        <a
          href={amazonUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          aria-label={ariaLabel}
        >
          <span>{buttonLabel}</span> <ExternalLink className="h-3 w-3" />
        </a>
      </Button>
    </Card>
  );
}
