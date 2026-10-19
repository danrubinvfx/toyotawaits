'use client';

import React from 'react';
import { CashFlowPoint } from '@/types/calculator';
import { Table, Eye } from 'lucide-react';

export interface AccessibleChartTableProps {
  points: CashFlowPoint[];
  refVehicleName?: string;
  targetVehicleName?: string;
  className?: string;
}

export function AccessibleChartTable({
  points,
  refVehicleName = 'Reference Vehicle',
  targetVehicleName = 'Target Vehicle',
  className,
}: AccessibleChartTableProps) {
  // Extract yearly milestone points (Year 0 through Year 7)
  // When there are step points at a year mark, select the post-delivery outlay step point
  const yearlyPoints: CashFlowPoint[] = [];

  for (let y = 0; y <= 7; y++) {
    const matching = points.filter((p) => Math.abs(p.year - y) < 0.05);
    if (matching.length > 0) {
      // Pick the last matching point (post-delivery step if applicable)
      yearlyPoints.push(matching[matching.length - 1]);
    }
  }

  return (
    <div className={`space-y-3 ${className ?? ''}`}>
      <details className="group rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-xs">
        <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-zinc-500" />
            <span>Accessible Timeline Data Table (Screen Reader Equivalent)</span>
          </div>
          <span className="text-[11px] text-zinc-500 group-open:rotate-180 transition-transform">
            ▼
          </span>
        </summary>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <caption className="sr-only">
              Timeline of Cumulative Cash Flow Advantage over 7 years
            </caption>
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-medium">
                <th scope="col" className="py-2 pr-4 font-semibold">Milestone</th>
                <th scope="col" className="py-2 px-4 font-semibold">{refVehicleName} Cumulative Spend</th>
                <th scope="col" className="py-2 px-4 font-semibold">{targetVehicleName} Cumulative Spend</th>
                <th scope="col" className="py-2 px-4 font-semibold">Net Cash Advantage ($CAD)</th>
                <th scope="col" className="py-2 pl-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-mono">
              {yearlyPoints.map((point) => {
                const isAdvantage = point.netAdvantageTarget >= 0;
                return (
                  <tr key={point.day} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="py-2.5 pr-4 font-sans font-medium text-zinc-900 dark:text-zinc-100">
                      Year {Math.round(point.year)}
                    </td>
                    <td className="py-2.5 px-4 text-zinc-700 dark:text-zinc-300">
                      ${point.refCumulativeCost.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 text-zinc-700 dark:text-zinc-300">
                      ${point.targetCumulativeCost.toLocaleString()}
                    </td>
                    <td className={`py-2.5 px-4 font-bold ${
                      isAdvantage ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {isAdvantage ? '+' : ''}${point.netAdvantageTarget.toLocaleString()} CAD
                    </td>
                    <td className="py-2.5 pl-4 font-sans text-zinc-500 dark:text-zinc-400">
                      {isAdvantage ? (
                        <span className="text-green-600 dark:text-green-400 font-semibold">Ahead / Recovered</span>
                      ) : (
                        <span className="text-zinc-500">In Deficit</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
