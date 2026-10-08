'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CANADIAN_PROVINCES_LIST } from '@/lib/data/vehicles';
import { TrendingUp, Users, CheckCircle2, ShieldAlert, Award } from 'lucide-react';

interface ProvincialWaitData {
  provinceCode: string;
  provinceName: string;
  medianDays: number;
  sampleCount: number;
  rebateEligible: boolean;
}

const PROVINCIAL_STATS: ProvincialWaitData[] = [
  { provinceCode: 'BC', provinceName: 'British Columbia', medianDays: 412, sampleCount: 215, rebateEligible: true },
  { provinceCode: 'QC', provinceName: 'Quebec', medianDays: 385, sampleCount: 198, rebateEligible: true },
  { provinceCode: 'ON', provinceName: 'Ontario', medianDays: 245, sampleCount: 312, rebateEligible: false },
  { provinceCode: 'AB', provinceName: 'Alberta', medianDays: 210, sampleCount: 145, rebateEligible: false },
  { provinceCode: 'MB', provinceName: 'Manitoba', medianDays: 195, sampleCount: 42, rebateEligible: true },
  { provinceCode: 'SK', provinceName: 'Saskatchewan', medianDays: 180, sampleCount: 38, rebateEligible: false },
  { provinceCode: 'NS', provinceName: 'Nova Scotia', medianDays: 260, sampleCount: 54, rebateEligible: true },
  { provinceCode: 'NB', provinceName: 'New Brunswick', medianDays: 240, sampleCount: 39, rebateEligible: true },
  { provinceCode: 'NL', provinceName: 'Newfoundland', medianDays: 225, sampleCount: 28, rebateEligible: true },
  { provinceCode: 'PE', provinceName: 'PEI', medianDays: 230, sampleCount: 16, rebateEligible: true },
];

export function ProvincialComparison() {
  const maxDays = Math.max(...PROVINCIAL_STATS.map((p) => p.medianDays));

  return (
    <div className="space-y-6">
      {/* Top-Line Canada KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardContent className="p-4 sm:p-5 space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              National Median Wait
            </span>
            <div className="text-2xl sm:text-3xl font-black text-red-600 dark:text-red-500">
              265 Days
            </div>
            <p className="text-[11px] text-zinc-500 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-red-600" />
              ~8.7 months across all trims
            </p>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardContent className="p-4 sm:p-5 space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Active Waiting Queue
            </span>
            <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50">
              342 Orders
            </div>
            <p className="text-[11px] text-zinc-500 flex items-center gap-1">
              <Users className="h-3 w-3 text-zinc-500" />
              Active deposits reported
            </p>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardContent className="p-4 sm:p-5 space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Verified Deliveries
            </span>
            <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50">
              1,087 Cars
            </div>
            <p className="text-[11px] text-zinc-500 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              Completed delivery reports
            </p>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardContent className="p-4 sm:p-5 space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              True MSRP Compliance
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-500">
              86.2%
            </div>
            <p className="text-[11px] text-zinc-500 flex items-center gap-1">
              <Award className="h-3 w-3 text-emerald-600" />
              Zero mandatory dealer markup
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Provincial Wait Time Breakdown Card */}
      <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
        <CardHeader className="space-y-1 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg sm:text-xl font-bold">
                Provincial Delivery Wait-Time Comparison
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Empirical wait differences across Canadian provinces. Provinces with provincial EV incentives (BC, QC)
                experience 40–70% longer wait times.
              </CardDescription>
            </div>
            <Badge variant="outline" className="border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300 self-start sm:self-auto">
              10 Provinces Tracked
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 space-y-4">
          <div className="space-y-3">
            {PROVINCIAL_STATS.map((prov) => {
              const percentage = Math.round((prov.medianDays / maxDays) * 100);
              const months = (prov.medianDays / 30.4).toFixed(1);

              return (
                <div key={prov.provinceCode} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <span className="font-bold w-7 text-zinc-900 dark:text-zinc-100">
                        {prov.provinceCode}
                      </span>
                      <span className="text-zinc-600 dark:text-zinc-400">
                        {prov.provinceName}
                      </span>
                      {prov.rebateEligible && (
                        <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                          Provincial Rebate
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-zinc-950 dark:text-zinc-50">
                        {prov.medianDays} Days
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        (~{months} mos)
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar Chart */}
                  <div className="h-3 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        prov.medianDays > 350
                          ? 'bg-red-600'
                          : prov.medianDays > 230
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900/60 p-3.5 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-zinc-400 shrink-0" />
            <span>
              <strong>Allocation Insight:</strong> Toyota allocates PHEV and HEV volume proportionally to rebate
              jurisdictions, but consumer waitlists in BC and Quebec still exceed supply by a factor of 3:1.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
