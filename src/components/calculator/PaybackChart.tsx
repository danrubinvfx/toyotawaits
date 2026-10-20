'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { CashFlowTimelineResult, CashFlowPoint } from '@/types/calculator';
import { TrendingUp, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

export interface PaybackChartProps {
  timeline: CashFlowTimelineResult;
  isRecovered: boolean;
  recoveryYear: number | null;
  recoveryDay: number | null;
  refVehicleName?: string;
  targetVehicleName?: string;
  className?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: CashFlowPoint }>;
  label?: string | number;
  refVehicleName: string;
  targetVehicleName: string;
}

function CustomTooltip({
  active,
  payload,
  refVehicleName,
  targetVehicleName,
}: CustomTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const point = payload[0].payload;
  const isAdvantage = point.netAdvantageTarget >= 0;

  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900/95 p-3 text-xs text-zinc-100 shadow-xl backdrop-blur-xs min-w-[240px] space-y-2">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 font-semibold">
        <span>Year {point.year.toFixed(1)} (Day {point.day})</span>
        {point.isStepPoint && (
          <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded">
            Delivery Step
          </span>
        )}
      </div>

      <div className="flex items-center justify-between font-bold">
        <span className="text-zinc-400">Net Cash Advantage:</span>
        <span className={isAdvantage ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
          {isAdvantage ? '+' : ''}${point.netAdvantageTarget.toLocaleString()} CAD
        </span>
      </div>

      <div className="space-y-1.5 pt-1 border-t border-zinc-800 text-[11px]">
        {/* Target breakdown */}
        <div className="space-y-0.5">
          <div className="flex justify-between font-medium text-green-400">
            <span>{targetVehicleName}:</span>
            <span>${point.targetCumulativeCost.toLocaleString()} CAD</span>
          </div>
          <div className="flex justify-between text-zinc-400 text-[10px] pl-2">
            <span>• Purchase Outlay:</span>
            <span>${(point.targetPurchaseOutlay ?? 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-zinc-400 text-[10px] pl-2">
            <span>• Cumulative Energy:</span>
            <span>${(point.targetEnergyCost ?? 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Reference breakdown */}
        <div className="space-y-0.5 pt-1 border-t border-zinc-800/60">
          <div className="flex justify-between font-medium text-zinc-300">
            <span>{refVehicleName}:</span>
            <span>${point.refCumulativeCost.toLocaleString()} CAD</span>
          </div>
          <div className="flex justify-between text-zinc-400 text-[10px] pl-2">
            <span>• Purchase Outlay:</span>
            <span>${(point.refPurchaseOutlay ?? 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-zinc-400 text-[10px] pl-2">
            <span>• Cumulative Energy:</span>
            <span>${(point.refEnergyCost ?? 0).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PaybackChart({
  timeline,
  isRecovered,
  recoveryYear,
  recoveryDay,
  refVehicleName = 'Reference Vehicle',
  targetVehicleName = 'Target Vehicle',
  className,
}: PaybackChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { points } = timeline;

  // Format currency for Y Axis
  const formatYAxis = (val: number) => {
    if (val === 0) return '$0';
    if (Math.abs(val) >= 1000) {
      const sign = val > 0 ? '+' : '';
      return `${sign}$${Math.round(val / 1000)}k`;
    }
    return `$${val}`;
  };

  // Format X Axis to Year ticks
  const formatXAxis = (val: number) => `Yr ${val}`;

  return (
    <Card className={`border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm ${className ?? ''}`}>
      <CardHeader className="px-2.5 py-1.5 sm:px-4 sm:py-3 pb-1.5 sm:pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="p-1 sm:p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shrink-0">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 dark:text-green-500" />
            </div>
            <div>
              <CardTitle className="text-xs sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                <span className="hidden sm:inline">7-Year Cumulative Cash Flow Advantage</span>
                <span className="sm:hidden">Cash Flow Over Time</span>
              </CardTitle>
              <p className="hidden sm:block text-[11px] text-zinc-500 dark:text-zinc-400">
                Discrete daily energy accrual with vertical delivery steps. No curve smoothing.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {isRecovered ? (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300 border-green-200 dark:border-green-800 flex items-center gap-1 text-[10px] sm:text-xs py-0.5 px-1.5 sm:px-2.5">
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>
                  <span className="hidden sm:inline">Recovered at Year {recoveryYear !== null ? recoveryYear.toFixed(1) : ''}</span>
                  <span className="sm:hidden">Recovered Yr {recoveryYear !== null ? recoveryYear.toFixed(1) : ''}</span>
                </span>
              </Badge>
            ) : (
              <Badge variant="outline" className="border-amber-400 text-amber-700 dark:text-amber-400 flex items-center gap-1 text-[10px] sm:text-xs py-0.5 px-1.5 sm:px-2.5">
                <ShieldAlert className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>
                  <span className="hidden sm:inline">Not recovered within 7-year horizon</span>
                  <span className="sm:hidden">No Recovery (7y)</span>
                </span>
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-1.5 sm:p-4 pt-1 sm:pt-2.5 space-y-1.5 sm:space-y-2.5">
        {/* Chart View */}
        <div className="w-full h-[155px] sm:h-[260px] rounded-lg bg-zinc-950 border border-zinc-800 p-1 sm:p-2 pt-1.5 sm:pt-3">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100} initialDimension={{ width: 600, height: 155 }}>
              <LineChart
                data={points}
                margin={{ top: 8, right: 12, left: -10, bottom: 0 }}
              >
                <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  stroke="#71717a"
                  fontSize={10}
                  tickFormatter={formatXAxis}
                  type="number"
                  domain={[0, 7]}
                  ticks={[0, 1, 2, 3, 4, 5, 6, 7]}
                />
                <YAxis
                  stroke="#71717a"
                  fontSize={10}
                  tickFormatter={formatYAxis}
                />
                <Tooltip
                  content={
                    <CustomTooltip
                      refVehicleName={refVehicleName}
                      targetVehicleName={targetVehicleName}
                    />
                  }
                />
                <ReferenceLine
                  y={0}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: 'Break-Even ($0)',
                    fill: '#ef4444',
                    position: 'insideTopLeft',
                    fontSize: 9,
                    fontWeight: 600,
                  }}
                />
                <Line
                  type="linear"
                  dataKey="netAdvantageTarget"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#22c55e' }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">
              Loading cash flow timeline...
            </div>
          )}
        </div>

        {/* Legend & Microcopy (hidden on mobile, visible on sm and up) */}
        <div className="hidden sm:flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400 px-1">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#22c55e] rounded-full inline-block" />
              <span>Target Cash Flow Advantage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t border-dashed border-[#ef4444] inline-block" />
              <span>Break-Even Baseline ($0 CAD)</span>
            </div>
          </div>
          <p className="text-[11px] text-zinc-400">
            Positive values indicate cumulative dollar advantage of target vehicle.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
