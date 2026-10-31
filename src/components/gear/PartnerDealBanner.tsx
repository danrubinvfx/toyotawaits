'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { trackAffiliateClick } from '@/lib/gear';

export interface PartnerDealItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  discountCode: string;
  discountText: string;
  badge: string;
  imageUrl: string;
  destinationUrl: string;
  priceNote: string;
}

const PARTNER_DEALS_BY_MODEL: Record<string, PartnerDealItem[]> = {
  rav4: [
    {
      id: 'muslogy-rav4-organizer',
      slug: 'muslogy-rav4',
      title: 'Muslogy Center Console Organizer Tray',
      category: 'Cabin Organization',
      description: 'Custom-molded drop-in upper tray dividing the cavernous RAV4 armrest into two accessible levels with anti-rattle rubber mats.',
      discountCode: 'Toyotawaits',
      discountText: '2% OFF',
      badge: 'Partner Deal · 2% Off',
      imageUrl: '/assets/gear/muslogy-rav4-organizer.webp',
      destinationUrl: '/out/muslogy-rav4',
      priceNote: 'Exclusive 2% Partner Discount',
    },
    {
      id: 'muslogy-armrest-cover',
      slug: 'muslogy-armrest-cover',
      title: 'Muslogy Custom-Fit Padded Armrest Cover',
      category: 'Interior Comfort',
      description: 'Soft memory-foam padded leatherette cover that protects factory SofTex upholstery and relieves arm fatigue on long trips.',
      discountCode: 'Toyotawaits',
      discountText: '2% OFF',
      badge: 'Partner Deal · 2% Off',
      imageUrl: '/assets/gear/muslogy-armrest-cover.webp',
      destinationUrl: '/out/muslogy-rav4',
      priceNote: 'Exclusive 2% Partner Discount',
    },
  ],
  sienna: [
    {
      id: 'muslogy-sienna-organizer',
      slug: 'muslogy-console',
      title: 'Muslogy Sliding Center Console & Bridge Organizer',
      category: 'Cabin Organization',
      description: 'Precision sliding upper tray and lower bridge console divider tailored for Sienna minivan cabins to prevent gear sliding.',
      discountCode: 'Toyotawaits',
      discountText: '2% OFF',
      badge: 'Partner Deal · 2% Off',
      imageUrl: '/assets/gear/muslogy-sienna-organizer.webp',
      destinationUrl: '/out/muslogy-console',
      priceNote: 'Exclusive 2% Partner Discount',
    },
    {
      id: 'muslogy-armrest-cover',
      slug: 'muslogy-armrest-cover',
      title: 'Muslogy Custom-Fit Padded Armrest Cover',
      category: 'Interior Comfort',
      description: 'Ergonomic soft memory-foam padded leatherette console cover that relieves arm fatigue and protects factory upholstery.',
      discountCode: 'Toyotawaits',
      discountText: '2% OFF',
      badge: 'Partner Deal · 2% Off',
      imageUrl: '/assets/gear/muslogy-armrest-cover.webp',
      destinationUrl: '/out/muslogy-rav4',
      priceNote: 'Exclusive 2% Partner Discount',
    },
  ],
  'grand-highlander': [
    {
      id: 'muslogy-gh-divider',
      slug: 'muslogy-console',
      title: 'Muslogy Center Console Dual-Tier Divider Tray',
      category: 'Cabin Organization',
      description: 'Multi-compartment organizer that splits the deep armrest bin into easily accessible levels with coin and phone slots.',
      discountCode: 'Toyotawaits',
      discountText: '2% OFF',
      badge: 'Partner Deal · 2% Off',
      imageUrl: '/assets/gear/muslogy-sienna-organizer.webp',
      destinationUrl: '/out/muslogy-console',
      priceNote: 'Exclusive 2% Partner Discount',
    },
    {
      id: 'muslogy-armrest-cover',
      slug: 'muslogy-armrest-cover',
      title: 'Muslogy Custom-Fit Padded Armrest Cover',
      category: 'Interior Comfort',
      description: 'Ergonomic soft memory-foam padded leatherette console cover that relieves arm fatigue and protects factory upholstery.',
      discountCode: 'Toyotawaits',
      discountText: '2% OFF',
      badge: 'Partner Deal · 2% Off',
      imageUrl: '/assets/gear/muslogy-armrest-cover.webp',
      destinationUrl: '/out/muslogy-rav4',
      priceNote: 'Exclusive 2% Partner Discount',
    },
  ],
};

export interface PartnerDealBannerProps {
  modelSlug: string;
  modelName: string;
  className?: string;
}

export function PartnerDealBanner({
  modelSlug,
  modelName,
  className = '',
}: PartnerDealBannerProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const cleanSlug = modelSlug.toLowerCase().trim();
  const deals =
    PARTNER_DEALS_BY_MODEL[cleanSlug] ||
    (cleanSlug.includes('rav4')
      ? PARTNER_DEALS_BY_MODEL.rav4
      : cleanSlug.includes('sienna')
      ? PARTNER_DEALS_BY_MODEL.sienna
      : cleanSlug.includes('grand')
      ? PARTNER_DEALS_BY_MODEL['grand-highlander']
      : null);

  if (!deals || deals.length === 0) {
    return null;
  }

  const handleCopyCode = (code: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div
      data-testid="partner-deals-section"
      className={`rounded-2xl border border-amber-500/30 bg-gradient-to-br from-zinc-950 via-zinc-900/90 to-amber-950/20 p-4 sm:p-5 shadow-sm space-y-4 ${className}`}
    >
      {/* Header with Muslogy Authorized Partner Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-zinc-800/80 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Delivery Day Upgrades &amp; Partner Deals: {modelName}
            </h3>
          </div>
          <p className="text-xs text-zinc-400">
            Authorized Muslogy direct-fit accessories with an exclusive 2% community discount with code <strong className="text-amber-400 font-mono">Toyotawaits</strong>.
          </p>
        </div>

        <Badge
          variant="outline"
          className="w-fit text-[11px] font-bold border-amber-500/40 bg-amber-500/10 text-amber-400 px-2.5 py-1"
        >
          Official Partner Deal · 2% Off
        </Badge>
      </div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {deals.map((deal) => (
          <div
            key={deal.id}
            className="flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-950/70 p-3.5 hover:border-amber-500/40 transition-all space-y-3"
          >
            <div className="space-y-3">
              {/* Product Visual Container with Fallback */}
              <div className="relative w-full h-40 sm:h-44 rounded-lg overflow-hidden bg-zinc-900/80 border border-zinc-800 flex items-center justify-center group">
                <Image
                  src={deal.imageUrl}
                  alt={deal.title}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, 400px"
                  className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Title & Badge Header */}
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                    Muslogy Direct Fit
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                    {deal.priceNote}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white leading-snug">
                  {deal.title}
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                  {deal.description}
                </p>
              </div>

              {/* Interactive 2% Discount Pill & Copy Button */}
              <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                <span className="tracking-tight">
                  CODE: <span className="underline decoration-amber-500/60 font-mono text-white">{deal.discountCode}</span> (2% OFF)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(deal.discountCode, deal.id)}
                  className="inline-flex items-center gap-1 uppercase text-[10px] font-bold text-amber-300 hover:text-amber-200 bg-amber-500/20 hover:bg-amber-500/30 px-2 py-0.5 rounded cursor-pointer transition-colors shrink-0"
                  title="Copy discount code"
                  aria-label={`Copy discount code ${deal.discountCode}`}
                >
                  {copiedId === deal.id ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400 shrink-0" />
                      <span className="text-emerald-400 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 shrink-0" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Outbound CTA Button */}
            <div className="pt-2 border-t border-zinc-800/80">
              <Button
                asChild
                size="sm"
                variant="outline"
                className="w-full h-9 text-xs font-bold border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 cursor-pointer transition-all"
              >
                <a
                  href={deal.destinationUrl}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  onClick={() => {
                    trackAffiliateClick({
                      accessory_id: deal.id,
                      placement: 'while_you_wait' as any,
                      model_context: modelName,
                      target_url: deal.destinationUrl,
                    });
                    handleCopyCode(deal.discountCode, deal.id);
                  }}
                  className="inline-flex items-center justify-center gap-1.5"
                >
                  <span>Get 2% Off on Muslogy ↗</span>
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PartnerDealBanner;
