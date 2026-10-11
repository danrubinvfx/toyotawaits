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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getWinterPrepForModel } from '@/data/winter-prep';

export interface WinterGuideProps {
  modelKey?: string;
  className?: string;
}

export function WinterGuide({ modelKey = 'rav4', className }: WinterGuideProps) {
  const config = getWinterPrepForModel(modelKey);

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

      {/* 3 Clear Visual Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: 12V Hybrid Cold-Start & Jump Points */}
        <Card
          data-testid="winter-card-battery"
          className="border-zinc-800 bg-zinc-900/80 shadow-md flex flex-col justify-between overflow-hidden hover:border-zinc-700 transition-colors"
        >
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
              12V Hybrid Cold-Start &amp; Jump Points
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4 space-y-3.5 text-xs flex-1 flex flex-col justify-between">
            <div className="space-y-2.5">
              {/* Battery Location */}
              <div className="bg-zinc-950/70 p-2.5 rounded-lg border border-zinc-800/80">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-0.5">
                  12V Aux Battery Location
                </span>
                <p className="text-zinc-200 font-medium leading-relaxed">
                  {config.batterySpecs.auxBatteryLocation}
                </p>
              </div>

              {/* Jump Point Terminal Callout */}
              <div className="bg-zinc-950/70 p-2.5 rounded-lg border border-amber-500/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1 mb-0.5">
                  <Zap className="h-3 w-3" />
                  Jump Terminal Callout
                </span>
                <p className="text-zinc-200 leading-relaxed font-mono text-[11px]">
                  {config.batterySpecs.jumpPointLocation}
                </p>
              </div>

              {/* Cold Weather Tip / Warning */}
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-2.5 text-zinc-300">
                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                  <AlertTriangle className="h-3 w-3 shrink-0" />
                  <span>Sub-Zero Hybrid Note</span>
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-300">
                  {config.batterySpecs.hybridColdWeatherTip}
                </p>
              </div>
            </div>

            {/* Recommended Jump Pack CTA */}
            <div className="pt-2 border-t border-zinc-800/80">
              <span className="text-[10px] text-zinc-400 block mb-1.5 font-medium">
                Recommended Lithium Starter:
              </span>
              <Button
                asChild
                size="sm"
                className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs h-8 gap-1.5 cursor-pointer shadow-xs"
              >
                <Link
                  href={config.batterySpecs.amazonLink}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                >
                  <span>{config.batterySpecs.recommendedJumpPack}</span>
                  <ExternalLink className="h-3.5 w-3.5 ml-auto shrink-0" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Sub-Zero Floor & Salt Defense */}
        <Card
          data-testid="winter-card-floors"
          className="border-zinc-800 bg-zinc-900/80 shadow-md flex flex-col justify-between overflow-hidden hover:border-zinc-700 transition-colors"
        >
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
              Sub-Zero Floor &amp; Salt Defense
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4 space-y-3.5 text-xs flex-1 flex flex-col justify-between">
            <div className="space-y-2.5">
              {/* Floor Mat Type */}
              <div className="bg-zinc-950/70 p-2.5 rounded-lg border border-zinc-800/80">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-0.5">
                  Recommended Liners
                </span>
                <p className="text-zinc-200 font-medium leading-relaxed">
                  {config.interiorProtection.floorMatType}
                </p>
              </div>

              {/* Coverage Note */}
              <div className="bg-zinc-950/70 p-2.5 rounded-lg border border-zinc-800/80">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-0.5">
                  Salt &amp; Slush Containment
                </span>
                <p className="text-zinc-300 leading-relaxed text-[11px]">
                  {config.interiorProtection.coverageNote}
                </p>
              </div>

              {/* Battery Vent Clearance Warning */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2.5 text-red-200">
                <div className="flex items-center gap-1 text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1">
                  <AlertTriangle className="h-3 w-3 shrink-0" />
                  <span>Battery Vent Clearance Warning</span>
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-200">
                  {config.interiorProtection.batteryVentClearance}
                </p>
              </div>
            </div>

            {/* Custom Mats Link CTA */}
            <div className="pt-2 border-t border-zinc-800/80">
              <span className="text-[10px] text-zinc-400 block mb-1.5 font-medium">
                Vetted All-Weather Floor Mats:
              </span>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="w-full border-zinc-700 bg-zinc-900/80 text-zinc-100 hover:text-amber-400 hover:border-amber-500/40 font-bold text-xs h-8 gap-1.5 cursor-pointer shadow-xs"
              >
                <Link
                  href={config.interiorProtection.amazonLink}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                >
                  <span>View Custom-Fit Floor Liners</span>
                  <ExternalLink className="h-3.5 w-3.5 ml-auto shrink-0" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Freezing Rain & Windshield Care */}
        <Card
          data-testid="winter-card-windshield"
          className="border-zinc-800 bg-zinc-900/80 shadow-md flex flex-col justify-between overflow-hidden hover:border-zinc-700 transition-colors"
        >
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
              Freezing Rain &amp; Windshield Care
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4 space-y-3.5 text-xs flex-1 flex flex-col justify-between">
            <div className="space-y-2.5">
              {/* Educational Notice: Why Outdoor Covers Freeze to Clear Coats */}
              <div className="bg-cyan-950/30 border border-cyan-500/20 rounded-lg p-2.5 text-zinc-300">
                <div className="flex items-center gap-1 text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1">
                  <Info className="h-3 w-3 shrink-0" />
                  <span>Why Full Covers Freeze to Paint</span>
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-300">
                  Full fabric outdoor car covers trap rising engine condensation against sheet metal.
                  In Canadian freeze-thaw cycles, moisture freezes solid between cover and paint,
                  causing severe clear-coat scratches and micro-marring when pulled off. Instead, use a
                  door-flap anchored glass frost shield that touches only glass and rubber seals.
                </p>
              </div>

              {/* Windshield Frost Guard Spec */}
              <div className="bg-zinc-950/70 p-2.5 rounded-lg border border-zinc-800/80">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-0.5">
                  Flap-Anchored Frost Guard
                </span>
                <p className="text-zinc-200 leading-relaxed text-[11px]">
                  {config.exteriorWinterGear.frostGuardType}
                </p>
              </div>

              {/* Wiper Specs */}
              <div className="bg-zinc-950/70 p-2.5 rounded-lg border border-zinc-800/80">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-0.5">
                  Sub-Zero Winter Wipers
                </span>
                <p className="text-zinc-200 leading-relaxed text-[11px]">
                  {config.exteriorWinterGear.wiperSpecs}
                </p>
              </div>
            </div>

            {/* Frost Guard Link CTA */}
            <div className="pt-2 border-t border-zinc-800/80">
              <span className="text-[10px] text-zinc-400 block mb-1.5 font-medium">
                Door Flap Windshield Guard:
              </span>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="w-full border-zinc-700 bg-zinc-900/80 text-zinc-100 hover:text-cyan-400 hover:border-cyan-500/40 font-bold text-xs h-8 gap-1.5 cursor-pointer shadow-xs"
              >
                <Link
                  href={config.exteriorWinterGear.amazonLink}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                >
                  <span>View Windshield Frost Guard</span>
                  <ExternalLink className="h-3.5 w-3.5 ml-auto shrink-0" />
                </Link>
              </Button>
            </div>
          </CardContent>
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
