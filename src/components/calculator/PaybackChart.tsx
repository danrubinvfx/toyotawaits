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
      <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-500" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                7-Year Cumulative Cash Flow Advantage
              </CardTitle>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Discrete daily energy accrual with vertical delivery steps. No curve smoothing.
              </p>
            </div>
          </div>

          <div>
            {isRecovered ? (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300 border-green-200 dark:border-green-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Recovered at Year {recoveryYear !== null ? recoveryYear.toFixed(1) : ''}</span>
              </Badge>
            ) : (
              <Badge variant="outline" className="border-amber-400 text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Not recovered within 7-year horizon</span>
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Chart View */}
        <div className="w-full h-[320px] rounded-lg bg-zinc-950 border border-zinc-800 p-2 pt-4">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100} initialDimension={{ width: 600, height: 280 }}>
              <LineChart
                data={points}
                margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  stroke="#71717a"
                  fontSize={11}
                  tickFormatter={formatXAxis}
                  type="number"
                  domain={[0, 7]}
                  ticks={[0, 1, 2, 3, 4, 5, 6, 7]}
                />
                <YAxis
                  stroke="#71717a"
                  fontSize={11}
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
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                />
                <Line
                  type="linear"
                  dataKey="netAdvantageTarget"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#22c55e' }}
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

        {/* Legend & Microcopy */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400 px-1">
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
