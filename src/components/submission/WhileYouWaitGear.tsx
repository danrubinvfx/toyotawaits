'use client';

import React from 'react';
import { ExternalLink, Shield, Cpu, Sparkles, ShieldCheck } from 'lucide-react';
import { getAccessoriesForModel, AccessoryItem } from '@/data/accessories';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { trackAffiliateClick } from '@/lib/gear';

export interface WhileYouWaitGearProps {
  modelName?: string | null;
  className?: string;
  popularityCounts?: Record<string, number>;
  placement?: string;
}

const CATEGORY_META: Record<
  AccessoryItem['category'],
  { label: string; icon: React.ComponentType<{ className?: string }>; colorClass: string }
> = {
  protection: {
    label: 'Protection',
    icon: Shield,
    colorClass: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/50',
  },
  tech: {
    label: 'Tech',
    icon: Cpu,
    colorClass: 'text-sky-400 bg-sky-950/60 border-sky-800/50',
  },
  comfort: {
    label: 'Comfort',
    icon: Sparkles,
    colorClass: 'text-amber-400 bg-amber-950/60 border-amber-800/50',
  },
  care: {
    label: 'Care',
    icon: ShieldCheck,
    colorClass: 'text-purple-400 bg-purple-950/60 border-purple-800/50',
  },
};

export function WhileYouWaitGear({ modelName, className = '', popularityCounts, placement = 'while_you_wait' }: WhileYouWaitGearProps) {
  const [fetchedCounts, setFetchedCounts] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    if (popularityCounts) return;
    let isMounted = true;
    fetch('/api/accessories/popular')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.counts && typeof data.counts === 'object') {
          setFetchedCounts(data.counts);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [popularityCounts]);

  const effectiveCounts = popularityCounts || fetchedCounts;
  const accessories = React.useMemo(() => getAccessoriesForModel(modelName, effectiveCounts), [modelName, effectiveCounts]);

  if (!accessories || accessories.length === 0) {
    return null;
  }

  return (
    <div
      data-testid="while-you-wait-gear"
      className={`rounded-xl bg-zinc-900/90 border border-zinc-800 p-3.5 sm:p-4 text-zinc-100 space-y-3 ${className}`}
    >
      {/* Module Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="text-xs sm:text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
            <span>While You Wait: Essential Delivery Day Gear</span>
          </h4>
          {modelName && (
            <span className="text-[10px] font-medium text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/60 shrink-0 hidden sm:inline">
              For {modelName}
            </span>
          )}
        </div>
        <p className="text-[11px] text-zinc-400 leading-relaxed">
          Recommended by fellow Canadian Toyota owners to protect and set up your new vehicle from day one.
        </p>
      </div>

      {/* Grid of Accessories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {accessories.map((item) => {
          const categoryMeta = CATEGORY_META[item.category] || CATEGORY_META.protection;
          const CategoryIcon = categoryMeta.icon;

          return (
            <div
              key={item.id}
              className="group flex flex-col justify-between bg-zinc-950/80 border border-zinc-800/90 rounded-lg p-2.5 sm:p-3 hover:border-zinc-700 transition-colors"
            >
              <div className="space-y-1.5">
                {/* Meta row: Category + Badge */}
                <div className="flex items-center justify-between gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border ${categoryMeta.colorClass}`}
                  >
                    <CategoryIcon className="h-2.5 w-2.5" />
                    <span>{categoryMeta.label}</span>
                  </span>

                  {item.badge && (
                    <Badge
                      variant="outline"
                      className={`text-[9px] font-medium py-0 px-1.5 ${
                        item.badge.includes('🔥')
                          ? 'border-amber-500/50 text-amber-300 bg-amber-950/60 font-semibold'
                          : item.badge === 'Community Top Pick'
                          ? 'border-emerald-500/50 text-emerald-300 bg-emerald-950/60 font-semibold'
                          : 'border-zinc-700 text-zinc-300 bg-zinc-900/80'
                      }`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>

                {/* Title & Description */}
                <div>
                  <h5 className="text-xs font-semibold text-zinc-200 line-clamp-1 group-hover:text-white transition-colors">
                    {item.title}
                  </h5>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Price & External Link Action */}
              <div className="flex items-center justify-between gap-2 pt-2.5 mt-2 border-t border-zinc-800/80">
                <span className="text-xs font-semibold text-emerald-400 truncate">
                  {item.estimatedPriceCad}
                </span>

                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-[11px] gap-1 shrink-0 font-medium border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white"
                >
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${item.title} on Amazon`}
                    onClick={() => {
                      trackAffiliateClick({
                        accessory_id: item.id,
                        placement: (placement || 'while_you_wait') as any,
                        model_context: modelName || null,
                        target_url: item.url,
                      });
                    }}
                  >
                    <span>View on Amazon</span>
                    <ExternalLink className="h-3 w-3 opacity-70" />
                  </a>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compliance / Affiliate Note */}
      <div className="pt-1 text-center">
        <p className="text-[10px] text-zinc-500">
          Estimated prices in CAD. As an Amazon Associate, ToyotaWaits earns from qualifying purchases.
        </p>
      </div>
    </div>
  );
}

export default WhileYouWaitGear;
