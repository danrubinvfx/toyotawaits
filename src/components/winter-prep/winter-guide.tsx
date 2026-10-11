'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Snowflake,
  Zap,
  ShieldAlert,
  Wind,
  AlertTriangle,
  ExternalLink,
  BatteryCharging,
  Info,
  Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getWinterPrepForModel, WinterRecommendedProduct } from '@/data/winter-prep';

export interface WinterGuideProps {
  modelKey?: string;
  className?: string;
}

interface RecommendedGearModuleProps {
  product: WinterRecommendedProduct;
  badgeVariant?: 'amber' | 'emerald' | 'cyan';
  testId?: string;
}

function RecommendedGearModule({
  product,
  badgeVariant = 'amber',
  testId,
}: RecommendedGearModuleProps) {
  const badgeColors = {
    amber: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    emerald: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    cyan: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
  };

  return (
    <div
      data-testid={testId}
      className="mt-4 pt-3.5 border-t border-zinc-800 bg-zinc-950/60 -mx-4 -mb-4 p-4 rounded-b-xl flex flex-col justify-between space-y-3"
    >
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            <Package className="h-3.5 w-3.5 text-zinc-300" />
            <span>Recommended Gear</span>
          </div>
          <Badge
            variant="outline"
            className={cn('text-[10px] font-bold px-2 py-0.5', badgeColors[badgeVariant])}
          >
            {product.badge}
          </Badge>
        </div>

        <p className="font-bold text-zinc-100 text-xs sm:text-sm leading-snug">
          {product.title}
        </p>
        <p className="text-[11px] text-zinc-400 leading-relaxed">
          {product.benefit}
        </p>
      </div>

      <Button
        asChild
        size="sm"
        className={cn(
          'w-full font-bold text-xs h-8 gap-1.5 cursor-pointer shadow-xs transition-all',
          badgeVariant === 'amber'
            ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
            : badgeVariant === 'emerald'
            ? 'bg-emerald-600 hover:bg-emerald-500 text-zinc-50'
            : 'bg-cyan-600 hover:bg-cyan-500 text-zinc-50'
        )}
      >
        <Link
          href={product.url}
          target="_blank"
          rel="noopener noreferrer nofollow sponsored"
        >
          <span>View on Amazon.ca</span>
          <ExternalLink className="h-3.5 w-3.5 ml-auto shrink-0" />
        </Link>
      </Button>
    </div>
  );
}

export function WinterGuide({ modelKey = 'rav4', className }: WinterGuideProps) {
  const config = getWinterPrepForModel(modelKey);
  const { batteryTopic, floorTopic, windshieldTopic } = config;

  return (
    <section
      id="winter-prep"
      data-testid="winter-prep-guide"
      className={cn('space-y-4 scroll-mt-24 pt-2', className)}
    >
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Snowflake className="h-4 w-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-zinc-100 tracking-tight flex items-center gap-2">
              <span>Canadian Winter Prep &amp; Survival Guide:</span>
              <span className="text-cyan-400">{config.vehicleName}</span>
            </h3>
          </div>
          <p className="text-xs text-zinc-400 max-w-2xl">
            Critical sub-zero jump points, road salt and slush armor, and freezing rain defense
            calibrated for Canadian deep-freeze conditions (-30°C).
          </p>
        </div>

        <Badge
          variant="outline"
          className="border-cyan-500/30 text-cyan-400 bg-cyan-500/5 self-start sm:self-auto text-xs shrink-0"
        >
          <Snowflake className="h-3 w-3 mr-1 text-cyan-400" />
          Sub-Zero Readiness
        </Badge>
      </div>

      {/* 3 Two-Part Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: 12V Battery & Cold Starts */}
        <Card
          data-testid="winter-card-battery"
          className="border-zinc-800 bg-zinc-900/80 shadow-md flex flex-col justify-between overflow-hidden hover:border-zinc-700 transition-colors"
        >
          {/* Upper Section: Clean Model-Tailored Tip */}
          <div>
            <CardHeader className="p-4 pb-3 border-b border-zinc-800/80 bg-zinc-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="border-amber-500/30 text-amber-400 bg-amber-500/10 text-[10px] font-bold"
                >
                  Cold-Start Protocol
                </Badge>
                <BatteryCharging className="h-4 w-4 text-amber-400" />
              </div>
              <CardTitle className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-400 shrink-0" />
                {batteryTopic.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-2.5 text-xs">
              {/* Battery Location */}
              <div className="bg-zinc-950/70 p-2.5 rounded-lg border border-zinc-800/80">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-0.5">
                  12V Aux Battery Location
                </span>
                <p className="text-zinc-200 font-medium leading-relaxed">
                  {batteryTopic.auxBatteryLocation}
                </p>
              </div>

              {/* Jump Point Terminal Callout */}
              <div className="bg-zinc-950/70 p-2.5 rounded-lg border border-amber-500/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1 mb-0.5">
                  <Zap className="h-3 w-3" />
                  Jump Terminal Callout
                </span>
                <p className="text-zinc-200 leading-relaxed font-mono text-[11px]">
                  {batteryTopic.jumpPointLocation}
                </p>
              </div>

              {/* Cold Weather Tip / Relay Draining Context */}
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-2.5 text-zinc-300">
                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                  <AlertTriangle className="h-3 w-3 shrink-0" />
                  <span>Sub-Zero Starter Relay Note</span>
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-300">
                  {batteryTopic.coldWeatherTip}
                </p>
              </div>
            </CardContent>
          </div>

          {/* Lower Section: Embedded Recommended Gear Module */}
          <div className="px-4 pb-4">
            <RecommendedGearModule
              product={batteryTopic.product}
              badgeVariant="amber"
              testId="recommended-gear-battery"
            />
          </div>
        </Card>

        {/* Card 2: Salt & Slush Floor Protection */}
        <Card
          data-testid="winter-card-floors"
          className="border-zinc-800 bg-zinc-900/80 shadow-md flex flex-col justify-between overflow-hidden hover:border-zinc-700 transition-colors"
        >
          {/* Upper Section: Clean Model-Tailored Tip */}
          <div>
            <CardHeader className="p-4 pb-3 border-b border-zinc-800/80 bg-zinc-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px] font-bold"
                >
                  Salt &amp; Brine Armor
                </Badge>
                <ShieldAlert className="h-4 w-4 text-emerald-400" />
              </div>
              <CardTitle className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-emerald-400 shrink-0" />
                {floorTopic.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-2.5 text-xs">
              {/* Floor Mat Type */}
              <div className="bg-zinc-950/70 p-2.5 rounded-lg border border-zinc-800/80">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-0.5">
                  Recommended Liners
                </span>
                <p className="text-zinc-200 font-medium leading-relaxed">
                  {floorTopic.floorMatType}
                </p>
              </div>

              {/* Coverage Note */}
              <div className="bg-zinc-950/70 p-2.5 rounded-lg border border-zinc-800/80">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-0.5">
                  Salt &amp; Slush Containment
                </span>
                <p className="text-zinc-300 leading-relaxed text-[11px]">
                  {floorTopic.carpetProtectionNote}
                </p>
              </div>

              {/* Battery Vent Clearance Warning */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2.5 text-red-200">
                <div className="flex items-center gap-1 text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1">
                  <AlertTriangle className="h-3 w-3 shrink-0" />
                  <span>Battery Vent Clearance Warning</span>
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-200">
                  {floorTopic.batteryVentClearance}
                </p>
              </div>
            </CardContent>
          </div>

          {/* Lower Section: Embedded Recommended Gear Module */}
          <div className="px-4 pb-4">
            <RecommendedGearModule
              product={floorTopic.product}
              badgeVariant="emerald"
              testId="recommended-gear-floors"
            />
          </div>
        </Card>

        {/* Card 3: Frost & Windshield Protection */}
        <Card
          data-testid="winter-card-windshield"
          className="border-zinc-800 bg-zinc-900/80 shadow-md flex flex-col justify-between overflow-hidden hover:border-zinc-700 transition-colors"
        >
          {/* Upper Section: Clean Model-Tailored Tip */}
          <div>
            <CardHeader className="p-4 pb-3 border-b border-zinc-800/80 bg-zinc-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="border-cyan-500/30 text-cyan-400 bg-cyan-500/10 text-[10px] font-bold"
                >
                  Clear-Coat Safe
                </Badge>
                <Wind className="h-4 w-4 text-cyan-400" />
              </div>
              <CardTitle className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                <Snowflake className="h-4 w-4 text-cyan-400 shrink-0" />
                {windshieldTopic.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-2.5 text-xs">
              {/* Educational Notice: Why Outdoor Covers Freeze to Clear Coats */}
              <div className="bg-cyan-950/30 border border-cyan-500/20 rounded-lg p-2.5 text-zinc-300">
                <div className="flex items-center gap-1 text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1">
                  <Info className="h-3 w-3 shrink-0" />
                  <span>Why Full Covers Freeze to Paint</span>
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-300">
                  {windshieldTopic.carCoverWarning}
                </p>
              </div>

              {/* Wiper Arm Frozen Hinge Prevention Tip */}
              <div className="bg-zinc-950/70 p-2.5 rounded-lg border border-zinc-800/80">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400 block mb-0.5">
                  Wiper Arm Frozen Hinge Prevention
                </span>
                <p className="text-zinc-300 leading-relaxed text-[11px]">
                  {windshieldTopic.wiperHingeTip}
                </p>
              </div>

              {/* Wiper Specs */}
              <div className="bg-zinc-950/70 p-2.5 rounded-lg border border-zinc-800/80">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-0.5">
                  Sub-Zero Winter Wipers
                </span>
                <p className="text-zinc-200 leading-relaxed text-[11px]">
                  {windshieldTopic.wiperSpecs}
                </p>
              </div>
            </CardContent>
          </div>

          {/* Lower Section: Embedded Recommended Gear Module */}
          <div className="px-4 pb-4">
            <RecommendedGearModule
              product={windshieldTopic.product}
              badgeVariant="cyan"
              testId="recommended-gear-windshield"
            />
          </div>
        </Card>
      </div>

      {/* Subtle Statutory Amazon Associates Disclaimer Tag */}
      <div className="text-center sm:text-right pt-1">
        <p className="text-[11px] text-zinc-500">
          As an Amazon Associate I earn from qualifying purchases.
        </p>
      </div>
    </section>
  );
}

export default WinterGuide;
