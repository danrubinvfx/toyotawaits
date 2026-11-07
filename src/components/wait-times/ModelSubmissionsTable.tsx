'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Clock,
  CheckCircle2,
  PlusCircle,
  Users,
} from 'lucide-react';

export interface RawSubmissionRecord {
  id: string;
  created_at?: string;
  order_date?: string;
  delivery_date?: string | null;
  wait_days?: number | null;
  province?: string;
  city?: string;
  model?: string;
  powertrain?: string;
  trim?: string;
  pricing?: string;
  status?: string;
}

export interface ModelSubmissionsTableProps {
  modelName: string;
  slug: string;
  submissions: RawSubmissionRecord[];
}

export const PROVINCE_PILLS = ['All', 'BC', 'AB', 'ON', 'QC'] as const;
export type ProvinceFilter = (typeof PROVINCE_PILLS)[number];

export function ModelSubmissionsTable({
  modelName,
  slug,
  submissions,
}: ModelSubmissionsTableProps) {
  const [selectedProvince, setSelectedProvince] = useState<ProvinceFilter>('All');

  // In-memory instant client-side province filtering
  const filteredSubmissions = useMemo(() => {
    if (selectedProvince === 'All') {
      return submissions;
    }
    return submissions.filter((sub) => {
      const p = (sub.province || '').toUpperCase().trim();
      return p === selectedProvince;
    });
  }, [submissions, selectedProvince]);

  // Province counts for badge pills
  const countsByProvince = useMemo(() => {
    const counts: Record<string, number> = {
      All: submissions.length,
      BC: 0,
      AB: 0,
      ON: 0,
      QC: 0,
    };
    submissions.forEach((sub) => {
      const p = (sub.province || '').toUpperCase().trim();
      if (counts[p] !== undefined) {
        counts[p] += 1;
      }
    });
    return counts;
  }, [submissions]);

  return (
    <div className="space-y-4" data-testid="model-submissions-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Recent Verified Submissions &amp; Delivery Log
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Real order dates, factory delivery timelines, and dealer pricing submitted by Canadian {modelName} buyers.
          </p>
        </div>
        <Button asChild size="sm" className="font-semibold gap-1.5 shadow-xs bg-red-600 hover:bg-red-700 text-white shrink-0 self-start sm:self-auto">
          <Link href={`/submit?model=${slug}`}>
            <PlusCircle className="h-3.5 w-3.5" />
            Submit Your Timeline
          </Link>
        </Button>
      </div>

      {/* Client-Side Province Selector Pills (All, BC, AB, ON, QC) */}
      <div
        role="tablist"
        aria-label="Filter submissions by province"
        data-testid="province-filter-pills"
        className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs overflow-x-auto max-w-full"
      >
        {PROVINCE_PILLS.map((prov) => {
          const isSelected = selectedProvince === prov;
          const count = countsByProvince[prov] ?? 0;
          return (
            <button
              key={prov}
              type="button"
              role="tab"
              aria-selected={isSelected}
              data-testid={`province-pill-${prov.toLowerCase()}`}
              onClick={() => setSelectedProvince(prov)}
              className={cn(
                'px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap text-xs flex items-center gap-1.5',
                isSelected
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60'
              )}
            >
              <span>{prov === 'All' ? 'All Canada' : prov}</span>
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none',
                  isSelected
                    ? 'bg-red-700 text-white'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <Card className="border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xs">
        {filteredSubmissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse" data-testid="model-submissions-table">
              <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Order Date</th>
                  <th className="py-3 px-4">Province</th>
                  <th className="py-3 px-4">Trim &amp; Spec</th>
                  <th className="py-3 px-4">Powertrain</th>
                  <th className="py-3 px-4 text-center">Wait Time</th>
                  <th className="py-3 px-4 text-right">Pricing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                {filteredSubmissions.slice(0, 15).map((sub) => (
                  <tr key={sub.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-zinc-800 dark:text-zinc-200 whitespace-nowrap">
                      {sub.order_date || '2025-10'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                        {sub.province || 'CA'}
                      </span>
                      {sub.city && (
                        <span className="ml-1.5 text-zinc-500 text-[11px] hidden xs:inline sm:inline">
                          {sub.city}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-zinc-900 dark:text-zinc-100 max-w-[200px] truncate" title={sub.trim || 'Standard'}>
                      {sub.trim || 'Standard'}
                    </td>
                    <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                      {sub.powertrain || 'Hybrid'}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {sub.status === 'delivered' && sub.wait_days ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {sub.wait_days} Days
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-medium text-amber-700 dark:text-amber-300">
                          <Clock className="h-3.5 w-3.5" />
                          In Queue
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap font-medium">
                      {sub.pricing === 'at_msrp' ? (
                        <span className="text-emerald-600 dark:text-emerald-400">At MSRP</span>
                      ) : sub.pricing === 'above_msrp' ? (
                        <span className="text-red-600 dark:text-red-400">Over MSRP</span>
                      ) : (
                        <span className="text-zinc-500">MSRP</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center space-y-3" data-testid="province-empty-state">
            <Users className="h-8 w-8 text-zinc-400 mx-auto" />
            <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              No Community Submissions Logged Yet {selectedProvince !== 'All' ? `for ${selectedProvince}` : `for ${modelName}`}
            </h4>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              {selectedProvince !== 'All'
                ? `Be the first buyer from ${selectedProvince} to contribute your ${modelName} deposit timeline and help Canadian drivers.`
                : `Our 2026 wait time benchmarks are calibrated using verified dealership allocation turnaround times. Are you waiting on or recently received a ${modelName}?`}
            </p>
            <Button asChild size="sm" className="font-semibold gap-1.5 shadow-xs bg-red-600 hover:bg-red-700 text-white">
              <Link href={`/submit?model=${slug}&province=${selectedProvince !== 'All' ? selectedProvince : 'ON'}`}>
                <PlusCircle className="h-3.5 w-3.5" />
                Add Your Timeline
              </Link>
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
