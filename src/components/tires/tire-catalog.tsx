'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Snowflake,
  Mountain,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Star,
  Car,
  Info,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  TIRE_VEHICLE_OPTIONS,
  TIRE_CATALOG_DATA,
  TireCategory,
  TireRecommendation,
  formatAmazonAffiliateUrl,
} from '@/data/tires';

export interface TireCatalogProps {
  initialModelId?: string;
  className?: string;
}

export function TireCatalog({ initialModelId = 'rav4', className }: TireCatalogProps) {
  const [selectedModel, setSelectedModel] = useState<string>(initialModelId);
  const [selectedCategory, setSelectedCategory] = useState<TireCategory | 'all'>('all');

  const activeVehicle = TIRE_CATALOG_DATA[selectedModel] || TIRE_CATALOG_DATA['rav4'];

  const filteredTires = activeVehicle.tires.filter((tire) => {
    if (selectedCategory === 'all') return true;
    return tire.category === selectedCategory;
  });

  const dedicatedCount = activeVehicle.tires.filter(
    (t) => t.category === 'Dedicated Winter'
  ).length;
  const allWeatherCount = activeVehicle.tires.filter(
    (t) => t.category === 'All-Weather 3PMSF'
  ).length;

  return (
    <div className={cn('space-y-8 sm:space-y-10 pb-16', className)}>
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 py-10 sm:py-16 dark:border-zinc-800 text-white rounded-2xl mx-4 sm:mx-0 shadow-xl">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 text-center space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-400">
            <Snowflake className="h-3.5 w-3.5 text-cyan-400" />
            <span>🇨🇦 Canadian Tire Guide &amp; Fitment Reviews</span>
            <span className="text-zinc-600">•</span>
            <span>3PMSF Certified</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Canadian Toyota Tire Guide: Winter &amp; All-Weather Recommendations
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Taking delivery of a new Toyota in Canada? Don&apos;t get stranded on factory all-seasons.
            Explore OEM factory tire sizes, seasonal wheel downsizing tips, and curated 3PMSF
            winter and all-weather rubber for Canadian snow, black ice, and mountain passes.
          </p>

          {/* Canadian Winter Context Ticker */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-3xl mx-auto pt-6 border-t border-zinc-800/80 text-left">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5 space-y-1">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
                <Mountain className="h-4 w-4 shrink-0" />
                <span>Provincial 3PMSF Laws</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Quebec mandates 3PMSF rubber Dec 1–Mar 15. BC requires winter-rated tires on mountain
                passes Oct 1–Apr 30.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5 space-y-1">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <Sparkles className="h-4 w-4 shrink-0" />
                <span>Hybrid &amp; EV Range</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Low rolling resistance compounds preserve electric driving range and battery efficiency
                in -25°C weather.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5 space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>Insurance Discounts</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Ontario insurers mandate up to ~5% auto policy discounts when certified winter tires are
                installed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Vehicle Selector (Horizontal Sticky Pills) */}
      <section className="sticky top-14 sm:top-16 z-30 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-y border-zinc-200 dark:border-zinc-800 py-3 shadow-xs">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 shrink-0 text-xs font-bold text-zinc-500 uppercase tracking-wider hidden md:flex">
              <Car className="h-4 w-4 text-amber-500" />
              <span>Select Model:</span>
            </div>

            {/* Scrollable Pills Container */}
            <div
              role="tablist"
              aria-label="Toyota vehicle model selector"
              className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 w-full md:w-auto"
            >
              {TIRE_VEHICLE_OPTIONS.map((option) => {
                const isSelected = selectedModel === option.id;
                return (
                  <button
                    key={option.id}
                    role="tab"
                    type="button"
                    aria-selected={isSelected}
                    onClick={() => {
                      setSelectedModel(option.id);
                      setSelectedCategory('all');
                    }}
                    className={cn(
                      'px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer flex items-center gap-1.5 shrink-0 border',
                      isSelected
                        ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-sm scale-102'
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-800'
                    )}
                  >
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Statutory Amazon Associates Disclosure Bar */}
      <div className="container mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 bg-zinc-100/70 dark:bg-zinc-900/60 rounded-xl py-2 px-3 border border-zinc-200 dark:border-zinc-800 text-center shadow-xs">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
          <span>
            <strong>Amazon Disclosure:</strong> As an Amazon Associate I earn from qualifying purchases.
          </span>
        </div>
      </div>

      {/* 3. Active Vehicle OEM Specs & Downsizing Advisory */}
      <section className="container mx-auto max-w-5xl px-4 sm:px-6 space-y-4">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100">
                  {activeVehicle.modelName}
                </h2>
                <Badge
                  variant="outline"
                  className="bg-amber-500/10 text-amber-500 border-amber-500/30 text-[10px] font-bold"
                >
                  {activeVehicle.badge}
                </Badge>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Official factory fitments &amp; Canadian winter rim recommendations
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <Button
                size="sm"
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                className={cn(
                  'h-7 text-xs px-2.5 rounded-lg cursor-pointer font-semibold',
                  selectedCategory === 'all'
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950'
                    : 'text-zinc-600 dark:text-zinc-400'
                )}
              >
                All ({activeVehicle.tires.length})
              </Button>
              <Button
                size="sm"
                variant={selectedCategory === 'Dedicated Winter' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('Dedicated Winter')}
                className={cn(
                  'h-7 text-xs px-2.5 rounded-lg cursor-pointer font-semibold gap-1',
                  selectedCategory === 'Dedicated Winter'
                    ? 'bg-cyan-600 text-white hover:bg-cyan-500'
                    : 'text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
                )}
              >
                <Snowflake className="h-3 w-3" />
                Winter ({dedicatedCount})
              </Button>
              <Button
                size="sm"
                variant={selectedCategory === 'All-Weather 3PMSF' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('All-Weather 3PMSF')}
                className={cn(
                  'h-7 text-xs px-2.5 rounded-lg cursor-pointer font-semibold gap-1',
                  selectedCategory === 'All-Weather 3PMSF'
                    ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400 font-bold'
                    : 'text-amber-600 dark:text-amber-400 border-amber-500/30'
                )}
              >
                <Mountain className="h-3 w-3" />
                All-Weather ({allWeatherCount})
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Factory OEM Sizes */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Car className="h-3.5 w-3.5 text-zinc-500" />
                Factory OEM Tire Sizes:
              </span>
              <ul className="space-y-1">
                {activeVehicle.factorySizes.map((size, idx) => (
                  <li
                    key={idx}
                    className="text-xs font-mono font-medium text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-950 px-2.5 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 flex items-center gap-2"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>{size}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Downsizing Tip Box */}
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold">
                <Info className="h-4 w-4 shrink-0" />
                <span>Winter Rim Downsizing Advisory</span>
              </div>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {activeVehicle.downsizingTip}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Curated Tire Cards Grid */}
      <section className="container mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {filteredTires.map((tire) => (
            <TireCard key={tire.id} tire={tire} />
          ))}
        </div>
      </section>

      {/* 5. Statutory Affiliate Disclaimer & Cross-Navigation */}
      <section className="container mx-auto max-w-5xl px-4 sm:px-6 space-y-6">
        {/* Cross-Link Card back to Winter Prep & Delivery Checklist */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 p-6 text-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-zinc-100 flex items-center gap-2">
                <Snowflake className="h-5 w-5 text-cyan-400" />
                <span>Complete Your Cold-Weather Delivery Prep</span>
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
                Tires are only half the battle. Check model-specific 12V auxiliary battery jump points,
                TuxMat hybrid vent clearance, and freezing rain windshield armor.
              </p>
            </div>

            <Button
              asChild
              className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs h-9 gap-1.5 shrink-0"
            >
              <Link href="/winter-prep">
                <span>View Canadian Winter Prep Guide →</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Amazon Associates Statutory Disclaimer */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 text-center">
          <p className="text-[11px] text-zinc-500 leading-relaxed max-w-3xl mx-auto">
            <strong>Amazon Affiliate Disclosure:</strong> As an Amazon Associate I earn from qualifying
            purchases. Pricing and availability are subject to change on Amazon.ca. We recommend
            verifying tire size matching your vehicle&apos;s door jamb B-pillar placard prior to ordering.
          </p>
        </div>
      </section>
    </div>
  );
}

interface TireCardProps {
  tire: TireRecommendation;
}

function TireCard({ tire }: TireCardProps) {
  const isDedicatedWinter = tire.category === 'Dedicated Winter';

  return (
    <Card
      data-testid={`tire-card-${tire.id}`}
      className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between shadow-xs hover:border-amber-500/40 transition-all rounded-xl overflow-hidden"
    >
      <CardHeader className="space-y-3 pb-3">
        {/* Badges Bar */}
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="outline"
            className={cn(
              'text-[10px] font-bold px-2.5 py-0.5 gap-1',
              isDedicatedWinter
                ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
            )}
          >
            {isDedicatedWinter ? (
              <Snowflake className="h-3 w-3 shrink-0" />
            ) : (
              <Mountain className="h-3 w-3 shrink-0" />
            )}
            <span>{tire.category}</span>
          </Badge>

          {tire.badge && (
            <Badge className="bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 text-[10px] font-semibold">
              {tire.badge}
            </Badge>
          )}
        </div>

        {/* Tire Title & Brand */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            {tire.brand}
          </span>
          <CardTitle className="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-snug">
            {tire.name}
          </CardTitle>
        </div>

        {/* Rating, OEM Fitment, and Load/Speed Ratings */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
          {tire.rating !== undefined && (
            <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              <span>{tire.rating.toFixed(1)}</span>
              {tire.reviewCount !== undefined && (
                <span className="text-zinc-400 font-normal text-[11px]">
                  ({tire.reviewCount.toLocaleString()}+ reviews)
                </span>
              )}
            </div>
          )}

          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800">
            {tire.oemFitment || `Fits OEM: ${tire.oemSize}`}
          </span>

          {(tire.loadIndex || tire.speedRating) && (
            <span className="text-[11px] font-mono font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800">
              {[tire.loadIndex, tire.speedRating].filter(Boolean).join(' ')}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0 flex-1 flex flex-col justify-between">
        {/* Best For Tag */}
        <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 p-3 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Best For
          </span>
          <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
            {tire.bestFor}
          </p>
        </div>

        {/* Pros (Why Canadian Owners Love It) */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Why Canadian Owners Love It:
          </span>
          <ul className="space-y-1 text-xs text-zinc-600 dark:text-zinc-300">
            {tire.pros.map((pro, idx) => (
              <li key={idx} className="flex items-start gap-1.5 leading-snug">
                <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons (Keep In Mind) */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5 text-zinc-400" />
            Keep In Mind:
          </span>
          <ul className="space-y-1 text-xs text-zinc-500 dark:text-zinc-400">
            {tire.cons.map((con, idx) => (
              <li key={idx} className="flex items-start gap-1.5 leading-snug">
                <span className="text-zinc-400 shrink-0 mt-0.5">•</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing Notice & Amazon CTA */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2 mt-auto">
          <div className="flex items-center justify-between text-[11px] text-zinc-500">
            <span>Amazon.ca Live Listing</span>
            <span className="text-zinc-400">Prime &amp; Express Delivery</span>
          </div>

          <Button
            asChild
            className={cn(
              'w-full font-bold text-xs h-9 gap-1.5 cursor-pointer shadow-xs transition-all',
              isDedicatedWinter
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
            )}
          >
            <a
              href={formatAmazonAffiliateUrl(tire.amazonUrl)}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
            >
              <span>Check Price on Amazon.ca</span>
              <ExternalLink className="h-3.5 w-3.5 ml-auto shrink-0" />
            </a>
          </Button>

          {/* 90-Day Cookie Window Micro-Copy */}
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 italic text-center leading-snug pt-0.5">
            Tip: Add your selected tire size to your Amazon cart or wish list to lock in pricing and verify delivery dates closer to vehicle pickup.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default TireCatalog;
