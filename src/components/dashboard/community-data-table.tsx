'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { CANADIAN_VEHICLE_CATALOG, CANADIAN_PROVINCES_LIST } from '@/lib/data/vehicles';
import {
  FileSpreadsheet,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  Clock,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { SubmissionStage } from '@/lib/types/contracts';
import { CommunityRecord, INITIAL_COMMUNITY_RECORDS } from '@/lib/data/community-records';

export type { CommunityRecord };
export const INITIAL_RECORDS: CommunityRecord[] = INITIAL_COMMUNITY_RECORDS;

export interface CommunityDataTableProps {
  initialRecords?: CommunityRecord[];
}

export function CommunityDataTable({ initialRecords }: CommunityDataTableProps = {}) {
  const [records, setRecords] = useState<CommunityRecord[]>(
    () => (initialRecords && initialRecords.length > 0 ? initialRecords : INITIAL_COMMUNITY_RECORDS)
  );
  const [modelFilter, setModelFilter] = useState<string>('all');
  const [provinceFilter, setProvinceFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'orderDate' | 'waitDays'>('orderDate');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  // Sync state if initialRecords changes
  React.useEffect(() => {
    if (initialRecords && initialRecords.length > 0) {
      setRecords(initialRecords);
    }
  }, [initialRecords]);

  // Fetch freshest submissions on client mount (bypassed in test environment)
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'test') return;
    let isMounted = true;
    async function fetchSubmissions() {
      try {
        const res = await fetch('/api/submissions', { cache: 'no-store' });
        if (!res.ok) return;
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && isMounted) {
          setRecords(json.data);
        }
      } catch {
        // Silently retain current records on network error
      }
    }
    fetchSubmissions();
    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate days waited so far for pending submissions
  const calculateDaysWaitedSoFar = (orderDateStr: string): number => {
    const today = new Date();
    const order = new Date(orderDateStr + (orderDateStr.includes('T') ? '' : 'T00:00:00'));
    if (isNaN(order.getTime())) return 0;
    return Math.max(0, Math.floor((today.getTime() - order.getTime()) / (1000 * 60 * 60 * 24)));
  };

  // Status counts reflecting current model and province filters
  const statusCounts = useMemo(() => {
    let all = 0;
    let delivered = 0;
    let pending = 0;
    for (const r of records) {
      if (modelFilter !== 'all' && r.modelSlug !== modelFilter) continue;
      if (provinceFilter !== 'all' && r.province !== provinceFilter) continue;
      all++;
      if (r.status === 'delivered') delivered++;
      else if (r.status === 'pending') pending++;
    }
    return { all, delivered, pending };
  }, [records, modelFilter, provinceFilter]);

  // Filter and sort items (includes both delivered and pending submissions)
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (modelFilter !== 'all' && r.modelSlug !== modelFilter) return false;
      if (provinceFilter !== 'all' && r.province !== provinceFilter) return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'orderDate') {
        const dateA = new Date(a.orderDate).getTime();
        const dateB = new Date(b.orderDate).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      } else {
        const daysA = a.waitDays ?? calculateDaysWaitedSoFar(a.orderDate);
        const daysB = b.waitDays ?? calculateDaysWaitedSoFar(b.orderDate);
        return sortOrder === 'desc' ? daysB - daysA : daysA - daysB;
      }
    });
  }, [modelFilter, provinceFilter, statusFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Dynamic CSV download link with query params
  const csvDownloadUrl = useMemo(() => {
    const params = new URLSearchParams({ format: 'csv' });
    if (modelFilter !== 'all') params.append('model', modelFilter);
    if (provinceFilter !== 'all') params.append('province', provinceFilter);
    if (statusFilter !== 'all') params.append('status', statusFilter);
    return `/api/export?${params.toString()}`;
  }, [modelFilter, provinceFilter, statusFilter]);

  // Full dataset CSV export handler (exports complete unpaginated matching records from parent state, e.g. all 17 rows)
  const handleExportCsv = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== 'undefined' && window.URL && window.Blob) {
      e.preventDefault();
      const headers = [
        'model',
        'powertrain',
        'trim',
        'model_year',
        'province',
        'dealership_city',
        'order_date',
        'delivery_date',
        'wait_days',
        'status',
        'pricing',
        'addons_cad',
      ];
      const escapeCell = (val: string | number | null | undefined): string => {
        if (val == null) return '';
        const str = String(val);
        if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      const lines = [headers.join(',')];
      // filteredRecords holds all matching entries without pagination slicing (pageSize: 8)
      for (const r of filteredRecords) {
        lines.push(
          [
            escapeCell(r.model),
            escapeCell(r.powertrain),
            escapeCell(r.trim),
            escapeCell(r.modelYear),
            escapeCell(r.province),
            escapeCell(r.city),
            escapeCell(r.orderDate),
            escapeCell(r.deliveryDate),
            escapeCell(r.waitDays),
            escapeCell(r.status),
            escapeCell(r.pricing),
            escapeCell(Number(r.addonsCad || 0).toFixed(2)),
          ].join(',')
        );
      }

      const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = url;
      const today = new Date().toISOString().split('T')[0];
      tempLink.setAttribute('download', `toyotawait-ca-export-${today}.csv`);
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
      <CardHeader className="space-y-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg sm:text-xl font-bold">
              Community Submissions & Delivery Log
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Real-world Canadian order records submitted by verified buyers. Free of PII, open for auditing.
            </CardDescription>
          </div>

          <a href={csvDownloadUrl} download onClick={handleExportCsv}>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs font-semibold shadow-sm w-full sm:w-auto">
              <Download className="h-3.5 w-3.5" />
              Download Filtered CSV
            </Button>
          </a>
        </div>

        {/* Status Toggle / Tab Filter: All | Delivered | Still Waiting */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setStatusFilter('all');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 shadow-2xs font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
              }`}
            >
              All ({statusCounts.all})
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter('delivered');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                statusFilter === 'delivered'
                  ? 'bg-white dark:bg-zinc-950 text-emerald-700 dark:text-emerald-400 shadow-2xs font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
              }`}
            >
              <CheckCircle2 className="h-3 w-3" />
              Delivered ({statusCounts.delivered})
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter('pending');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-white dark:bg-zinc-950 text-amber-600 dark:text-amber-400 shadow-2xs font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
              }`}
            >
              <Clock className="h-3 w-3" />
              Still Waiting ({statusCounts.pending})
            </button>
          </div>

          <span className="text-xs text-zinc-500 font-medium">
            Showing verified deliveries &amp; active queue wait times
          </span>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <Select
            value={modelFilter}
            onChange={(e) => {
              setModelFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs h-9"
          >
            <option value="all">All Vehicle Models</option>
            {CANADIAN_VEHICLE_CATALOG.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.name}
              </option>
            ))}
          </Select>

          <Select
            value={provinceFilter}
            onChange={(e) => {
              setProvinceFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs h-9"
          >
            <option value="all">All Canadian Provinces</option>
            {CANADIAN_PROVINCES_LIST.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name} ({p.code})
              </option>
            ))}
          </Select>

          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs h-9"
          >
            <option value="all">All Delivery Statuses</option>
            <option value="delivered">Delivered Only</option>
            <option value="pending">Still Waiting Only</option>
          </Select>

          <Select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [sb, so] = e.target.value.split('-') as ['orderDate' | 'waitDays', 'desc' | 'asc'];
              setSortBy(sb);
              setSortOrder(so);
            }}
            className="text-xs h-9"
          >
            <option value="orderDate-desc">Order Date: Newest First</option>
            <option value="orderDate-asc">Order Date: Oldest First</option>
            <option value="waitDays-desc">Wait Time: Longest First</option>
            <option value="waitDays-asc">Wait Time: Shortest First</option>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Responsive Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-zinc-100/70 text-zinc-600 dark:bg-zinc-900/80 dark:text-zinc-400 font-semibold border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="py-3 px-3 sm:px-4">Vehicle & Trim</th>
                <th className="py-3 px-3 sm:px-4">Province / City</th>
                <th className="py-3 px-3 sm:px-4">Order Date</th>
                <th className="py-3 px-3 sm:px-4">Status & Wait</th>
                <th className="py-3 px-3 sm:px-4">Pricing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-400 text-xs italic">
                    Nothin&apos; but crickets and street sweepers in this province yet. Be the first to drop a dime.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
                    {/* Vehicle */}
                    <td className="py-3 px-3 sm:px-4">
                      <div className="font-bold text-zinc-950 dark:text-zinc-50">
                        {r.model} {r.modelYear}
                      </div>
                      <div className="text-[11px] text-zinc-500">{r.trim}</div>
                      <Badge variant="secondary" className="text-[9px] py-0 px-1 mt-0.5 font-normal">
                        {r.powertrain}
                      </Badge>
                    </td>

                    {/* Geography */}
                    <td className="py-3 px-3 sm:px-4">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">{r.province}</span>
                      {r.city && <span className="text-zinc-500 text-xs block">{r.city}</span>}
                    </td>

                    {/* Order Date */}
                    <td className="py-3 px-3 sm:px-4 text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                      {r.orderDate}
                    </td>

                    {/* Status & Wait */}
                    <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                      {r.status === 'delivered' || r.stage === 'delivered' ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            {r.waitDays ?? 0} Days
                          </span>
                          <span className="text-[10px] text-zinc-500 block">
                            Delivered {r.deliveryDate ? `(${r.deliveryDate})` : ''}
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400 border border-amber-500/20">
                            <Clock className="h-3 w-3" />
                            Still Waiting
                          </span>
                          <span className="text-[10px] font-semibold text-zinc-500 block">
                            {calculateDaysWaitedSoFar(r.orderDate)} days so far
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Pricing */}
                    <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                      {r.pricing === 'at_msrp' ? (
                        <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                          Exact MSRP
                        </span>
                      ) : r.pricing === 'above_msrp' ? (
                        <div className="space-y-0.5">
                          <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 block" title="The Carny Hustle (Mandatory Add-ons)">
                            The Carny Hustle
                          </span>
                          <span className="text-[10px] text-zinc-500 block">
                            +${r.addonsCad} Add-ons
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-zinc-500">Undisclosed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between p-3.5 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500">
          <span>
            Showing {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, filteredRecords.length)} of {filteredRecords.length} submissions
          </span>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="h-7 w-7 p-0"
              aria-label="Previous Page"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="h-7 w-7 p-0"
              aria-label="Next Page"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
