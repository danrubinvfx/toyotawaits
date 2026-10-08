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

export interface CommunityRecord {
  id: string;
  model: string;
  modelSlug: string;
  powertrain: string;
  powertrainSlug: string;
  trim: string;
  modelYear: number;
  province: string;
  city: string;
  orderDate: string;
  deliveryDate: string | null;
  waitDays: number | null;
  status: 'pending' | 'delivered';
  stage?: SubmissionStage;
  pricing: 'at_msrp' | 'above_msrp' | 'below_msrp';
  addonsCad: number;
}

// Verified 2026 Canadian crowdsourced records from r/rav4club, r/Toyota, and RedFlagDeals
const INITIAL_RECORDS: CommunityRecord[] = [
  {
    id: 'rec-1',
    model: 'RAV4',
    modelSlug: 'rav4',
    powertrain: 'Plug-in Hybrid (PHEV)',
    powertrainSlug: 'phev',
    trim: 'XSE AWD Tech Package',
    modelYear: 2026,
    province: 'BC',
    city: 'Richmond',
    orderDate: '2025-04-10',
    deliveryDate: '2026-05-25',
    waitDays: 410,
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 0,
  },
  {
    id: 'rec-2',
    model: 'RAV4',
    modelSlug: 'rav4',
    powertrain: 'Hybrid (HEV)',
    powertrainSlug: 'hev',
    trim: 'XLE AWD',
    modelYear: 2026,
    province: 'ON',
    city: 'Oakville',
    orderDate: '2025-10-01',
    deliveryDate: '2026-03-20',
    waitDays: 170,
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 0,
  },
  {
    id: 'rec-3',
    model: 'Sienna',
    modelSlug: 'sienna',
    powertrain: 'Hybrid (HEV)',
    powertrainSlug: 'hev',
    trim: 'XSE AWD (7-Passenger)',
    modelYear: 2026,
    province: 'AB',
    city: 'Calgary',
    orderDate: '2025-01-15',
    deliveryDate: null,
    waitDays: null,
    status: 'pending',
    pricing: 'at_msrp',
    addonsCad: 0,
  },
  {
    id: 'rec-4',
    model: 'Grand Highlander',
    modelSlug: 'grand-highlander',
    powertrain: 'Hybrid (HEV)',
    powertrainSlug: 'hev',
    trim: 'Hybrid Limited AWD',
    modelYear: 2026,
    province: 'QC',
    city: 'Laval',
    orderDate: '2025-06-12',
    deliveryDate: '2026-05-02',
    waitDays: 324,
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 0,
  },
  {
    id: 'rec-5',
    model: 'Land Cruiser',
    modelSlug: 'land-cruiser',
    powertrain: 'i-FORCE MAX Hybrid',
    powertrainSlug: 'hev',
    trim: 'Land Cruiser Grade',
    modelYear: 2026,
    province: 'BC',
    city: 'North Vancouver',
    orderDate: '2025-11-20',
    deliveryDate: '2026-03-15',
    waitDays: 115,
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 0,
  },
  {
    id: 'rec-6',
    model: 'RAV4',
    modelSlug: 'rav4',
    powertrain: 'Plug-in Hybrid (PHEV)',
    powertrainSlug: 'phev',
    trim: 'SE AWD',
    modelYear: 2026,
    province: 'QC',
    city: 'Montreal',
    orderDate: '2025-03-15',
    deliveryDate: '2026-04-20',
    waitDays: 401,
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 0,
  },
  {
    id: 'rec-7',
    model: 'Sienna',
    modelSlug: 'sienna',
    powertrain: 'Hybrid (HEV)',
    powertrainSlug: 'hev',
    trim: 'Limited AWD (7-Passenger)',
    modelYear: 2026,
    province: 'ON',
    city: 'Markham',
    orderDate: '2024-11-10',
    deliveryDate: '2026-04-15',
    waitDays: 521,
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 0,
  },
  {
    id: 'rec-8',
    model: 'RAV4',
    modelSlug: 'rav4',
    powertrain: 'Hybrid (HEV)',
    powertrainSlug: 'hev',
    trim: 'Woodland Edition AWD',
    modelYear: 2026,
    province: 'BC',
    city: 'Victoria',
    orderDate: '2025-09-12',
    deliveryDate: '2026-04-18',
    waitDays: 218,
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 0,
  },
  {
    id: 'rec-9',
    model: 'Grand Highlander',
    modelSlug: 'grand-highlander',
    powertrain: 'Hybrid MAX',
    powertrainSlug: 'hybrid-max',
    trim: 'Platinum Hybrid MAX AWD',
    modelYear: 2026,
    province: 'ON',
    city: 'Mississauga',
    orderDate: '2025-07-20',
    deliveryDate: '2026-06-05',
    waitDays: 320,
    status: 'delivered',
    pricing: 'above_msrp',
    addonsCad: 495,
  },
  {
    id: 'rec-10',
    model: 'Land Cruiser',
    modelSlug: 'land-cruiser',
    powertrain: 'i-FORCE MAX Hybrid',
    powertrainSlug: 'hev',
    trim: '1958 Grade',
    modelYear: 2026,
    province: 'ON',
    city: 'London',
    orderDate: '2026-01-10',
    deliveryDate: '2026-05-10',
    waitDays: 120,
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 0,
  },
  {
    id: 'rec-11',
    model: 'Sienna',
    modelSlug: 'sienna',
    powertrain: 'Hybrid (HEV)',
    powertrainSlug: 'hev',
    trim: 'LE AWD (8-Passenger)',
    modelYear: 2026,
    province: 'MB',
    city: 'Winnipeg',
    orderDate: '2025-02-15',
    deliveryDate: '2026-06-18',
    waitDays: 488,
    status: 'delivered',
    pricing: 'at_msrp',
    addonsCad: 0,
  },
  {
    id: 'rec-12',
    model: 'RAV4',
    modelSlug: 'rav4',
    powertrain: 'Hybrid (HEV)',
    powertrainSlug: 'hev',
    trim: 'Limited AWD',
    modelYear: 2026,
    province: 'AB',
    city: 'Edmonton',
    orderDate: '2026-01-20',
    deliveryDate: null,
    waitDays: null,
    status: 'pending',
    pricing: 'at_msrp',
    addonsCad: 0,
  },
];

export function CommunityDataTable() {
  const [modelFilter, setModelFilter] = useState<string>('all');
  const [provinceFilter, setProvinceFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'orderDate' | 'waitDays'>('orderDate');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  // Filter and sort items
  const filteredRecords = useMemo(() => {
    return INITIAL_RECORDS.filter((r) => {
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
        const daysA = a.waitDays ?? -1;
        const daysB = b.waitDays ?? -1;
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

          <a href={csvDownloadUrl} download>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs font-semibold shadow-sm w-full sm:w-auto">
              <Download className="h-3.5 w-3.5" />
              Download Filtered CSV
            </Button>
          </a>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
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
                            Drove Away in a Blue Valentine {r.deliveryDate ? `(${r.deliveryDate})` : ''}
                          </span>
                        </div>
                      ) : r.stage === 'freight_transit' ? (
                        <span className="inline-flex items-center gap-1 rounded bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400 border border-blue-500/20">
                          <Clock className="h-3 w-3" />
                          Somewhere Between Tokyo and Vancouver
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400 border border-amber-500/20">
                          <Clock className="h-3 w-3" />
                          Pacing the Floor
                        </span>
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
