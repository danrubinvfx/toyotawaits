'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMarket } from '@/context/MarketContext';

export interface AffiliateCTAProps {
  slug: string;
  label: string;
  sublabel?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'amber';
  className?: string;
  size?: 'default' | 'sm' | 'lg';
  isPrimary?: boolean;
}

export function AffiliateCTA({
  slug,
  label,
  sublabel,
  variant,
  className,
  size = 'default',
  isPrimary = false,
}: AffiliateCTAProps) {
  const { isUs } = useMarket();
  const chosenVariant = variant ?? (isPrimary ? 'amber' : 'outline');
  const isAmber = chosenVariant === 'amber';
  const isOutline = chosenVariant === 'outline';

  let displayLabel = label.replace(/\s*↗$/, '');
  if (isUs) {
    displayLabel = displayLabel.replace(/Amazon\.ca/g, 'Amazon.com');
  }

  let href = slug.startsWith('http') ? slug : `/out/${slug}`;
  if (href.startsWith('http') && href.includes('amazon.')) {
    try {
      const urlObj = new URL(href);
      urlObj.hostname = isUs ? 'www.amazon.com' : 'www.amazon.ca';
      const tag = isUs
        ? (process.env.NEXT_PUBLIC_AMAZON_US_TAG || process.env.NEXT_PUBLIC_AMAZON_TAG || 'toyotawaits-20')
        : (process.env.NEXT_PUBLIC_AMAZON_CA_TAG || 'toyotawaits-20');
      urlObj.searchParams.set('tag', tag);
      href = urlObj.toString();
    } catch {
      href = isUs
        ? href.replace(/amazon\.ca/g, 'amazon.com')
        : href.replace(/amazon\.com/g, 'amazon.ca');
    }
  }

  return (
    <Button
      asChild
      variant={isAmber ? 'default' : isOutline ? 'outline' : chosenVariant}
      size={size}
      className={cn(
        'group cursor-pointer transition-all duration-200 font-semibold shadow-sm hover:shadow-md',
        isAmber &&
          'bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold border border-amber-400/40 hover:scale-[1.01] active:scale-[0.99]',
        isOutline &&
          'border-zinc-300 bg-white/80 dark:bg-zinc-900/80 dark:border-zinc-700/80 hover:border-amber-500/60 hover:bg-amber-500/10 text-zinc-900 dark:text-zinc-100 hover:text-amber-600 dark:hover:text-amber-400',
        sublabel ? 'h-auto py-2.5 px-4 flex flex-col items-start text-left' : 'gap-1.5 px-4',
        className
      )}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow sponsored"
      >
        <span className="font-bold flex items-center gap-1.5 leading-snug">
          <span>{displayLabel}</span>
          <ArrowUpRight
            className={cn(
              'h-4 w-4 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform',
              isAmber ? 'text-zinc-950' : 'text-amber-500 dark:text-amber-400'
            )}
          />
        </span>
        {sublabel && (
          <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-normal mt-0.5 block">
            {sublabel}
          </span>
        )}
      </a>
    </Button>
  );
}
