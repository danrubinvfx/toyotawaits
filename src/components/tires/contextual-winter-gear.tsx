import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ShieldAlert,
  BatteryCharging,
  Gauge,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { buildAmazonAffiliateUrl } from '@/lib/affiliate';

export function ContextualWinterGear() {
  const rav4TuxmatUrl = 'https://www.amazon.ca/dp/B0833DT93B?tag=toyotawaits-20';
  const siennaTuxmatUrl = 'https://www.amazon.ca/dp/B0CFV5R8QM?tag=toyotawaits-20';
  const nocoGb40Url = 'https://www.amazon.ca/dp/B015TKUPIC?tag=toyotawaits-20';
  const inflatorUrl = buildAmazonAffiliateUrl('portable cordless tire inflator 150 psi', 'CA');

  return (
    <section
      aria-label="Contextual Winter Survival Gear"
      data-testid="contextual-winter-gear"
      className="container mx-auto max-w-6xl px-4 sm:px-6 py-6"
    >
      <div className="space-y-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Canadian Cold-Weather Gear Essentials</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Essential Winter Delivery Gear &amp; Hybrid Protection
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Field-tested winter survival accessories protecting Canadian Toyota owners from road salt crust,
            severe cold 12V auxiliary discharge, and winter morning tire pressure drops.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. TuxMat High-Wall Liners */}
          <Card className="flex flex-col justify-between border-zinc-800 bg-zinc-900/70 hover:border-zinc-700 transition-all shadow-xl">
            <CardHeader className="space-y-2 pb-3">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="outline" className="border-cyan-500/40 text-cyan-300 bg-cyan-950/20 text-[10px] font-bold">
                  Hero Brand • Salt Defense
                </Badge>
                <span className="text-[10px] font-mono text-zinc-400">Direct ASIN</span>
              </div>
              <CardTitle className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>TuxMat Custom High-Wall Liners</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 flex-1 flex flex-col justify-between pt-0 text-xs">
              <p className="text-zinc-300 leading-relaxed">
                Maximum edge-to-edge footwell and dead-pedal coverage locking out Canadian calcium chloride road salt.
                Laser-scanned to ensure 100% unobstructed airflow to rear hybrid battery intake vents.
              </p>

              <div className="pt-3 border-t border-zinc-800/80 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={rav4TuxmatUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored nofollow"
                    className="inline-flex items-center justify-center gap-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 py-2 px-2 text-[11px] font-bold text-white transition-colors"
                  >
                    <span>RAV4 (B0833DT93B)</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                  <a
                    href={siennaTuxmatUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored nofollow"
                    className="inline-flex items-center justify-center gap-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 py-2 px-2 text-[11px] font-bold text-white transition-colors"
                  >
                    <span>Sienna (B0CFV5R8QM)</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. NOCO Boost Jump Starters */}
          <Card className="flex flex-col justify-between border-zinc-800 bg-zinc-900/70 hover:border-zinc-700 transition-all shadow-xl">
            <CardHeader className="space-y-2 pb-3">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="outline" className="border-amber-800/50 text-amber-300 bg-amber-950/40 text-[10px] font-bold">
                  Essential • Hybrid 12V
                </Badge>
                <span className="text-[10px] font-mono text-zinc-400">ASIN B015TKUPIC</span>
              </div>
              <CardTitle className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <BatteryCharging className="w-4 h-4 text-amber-300 shrink-0" />
                <span>NOCO Boost Plus GB40 / GBX45</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 flex-1 flex flex-col justify-between pt-0 text-xs">
              <p className="text-zinc-300 leading-relaxed">
                Rated for severe cold (-20°C to +50°C). Delivers the essential 12V auxiliary surge required
                to close Toyota Hybrid System (THS-II) contactor relays and wake up READY mode on sub-zero Canadian mornings.
              </p>

              <div className="pt-3 border-t border-zinc-800/80">
                <a
                  href={nocoGb40Url}
                  target="_blank"
                  rel="noopener noreferrer sponsored nofollow"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 py-2.5 px-4 text-xs font-bold text-zinc-950 transition-colors shadow-sm"
                >
                  <span>View NOCO GB40 on Amazon</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* 3. Cordless 150 PSI Tire Inflator */}
          <Card className="flex flex-col justify-between border-zinc-800 bg-zinc-900/70 hover:border-zinc-700 transition-all shadow-xl">
            <CardHeader className="space-y-2 pb-3">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 bg-emerald-950/20 text-[10px] font-bold">
                  Tire Safety • Auto-Shutoff
                </Badge>
                <span className="text-[10px] font-mono text-zinc-400">Search Fallback</span>
              </div>
              <CardTitle className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Gauge className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Cordless 150 PSI Tire Inflator</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 flex-1 flex flex-col justify-between pt-0 text-xs">
              <p className="text-zinc-300 leading-relaxed">
                Tire pressure drops 1 PSI for every 5°C (9°F) dip in outdoor winter temperature.
                A compact cordless 150 PSI digital pump ensures your 3PMSF winter rubber maintains proper door-jamb inflation without gas station queues.
              </p>

              <div className="pt-3 border-t border-zinc-800/80">
                <a
                  href={inflatorUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored nofollow"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2.5 px-4 text-xs font-bold text-white transition-colors shadow-sm"
                >
                  <span>Search 150 PSI Inflators on Amazon</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default ContextualWinterGear;
