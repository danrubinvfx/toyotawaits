import React from 'react';
import Link from 'next/link';
import { WaitTimeEstimator } from '@/components/calculator/wait-time-estimator';
import { HeroEstimateButton } from '@/components/calculator/hero-estimate-button';
import { ProvincialComparison } from '@/components/dashboard/provincial-comparison';
import { CommunityDataTable } from '@/components/dashboard/community-data-table';
import { ActiveOrderStepper } from '@/components/dashboard/active-order-stepper';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  PlusCircle,
  FileSpreadsheet,
  CheckCircle2,
  TrendingUp,
  MapPin,
  ShieldCheck,
  ChevronRight,
  BarChart3,
  Flame,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 py-12 sm:py-20 dark:border-zinc-800 text-white">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-400">
            <Flame className="h-3.5 w-3.5 text-amber-400" />
            <span>ToyotaWaits.ca</span>
            <span className="text-zinc-600">•</span>
            <span>Canadian Community Tracker</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            The piano has been drinking, and your Toyota is still on a boat.
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Real-time, crowdsourced delivery wait times for{' '}
            <strong className="text-amber-400">RAV4 HEV/PHEV</strong>,{' '}
            <strong className="text-amber-400">Sienna</strong>,{' '}
            <strong className="text-amber-400">Grand Highlander</strong>, and{' '}
            <strong className="text-amber-400">Land Cruiser</strong> across all Canadian provinces.
            Empirical data from real Canadian buyers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button asChild size="lg" className="w-full sm:w-auto gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-lg font-bold text-base h-12 px-6">
              <Link href="/submit">
                <PlusCircle className="h-5 w-5" />
                Submit Your Wait Time (60s)
              </Link>
            </Button>
            <HeroEstimateButton />
          </div>

          {/* Quick Metrics Ticker */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-zinc-800/80">
            <div className="space-y-0.5">
              <span className="text-xl sm:text-2xl font-black text-amber-400">410 Days</span>
              <p className="text-xs text-zinc-400">Median 2026 RAV4 PHEV Wait</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-xl sm:text-2xl font-black text-amber-400">510 Days</span>
              <p className="text-xs text-zinc-400">Median 2026 Sienna Wait</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-xl sm:text-2xl font-black text-emerald-400">88%</span>
              <p className="text-xs text-zinc-400">Delivered at True MSRP</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-xl sm:text-2xl font-black text-zinc-200">100%</span>
              <p className="text-xs text-zinc-400">Anonymous & Zero-PII</p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Order Stepper (for returning users with edit keys) */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6">
        <ActiveOrderStepper />
      </section>

      {/* Main Interactive Estimator Widget */}
      <section id="estimator" className="container mx-auto max-w-6xl px-4 sm:px-6 scroll-mt-24">
        <React.Suspense fallback={<div className="h-96 rounded-xl bg-zinc-100 animate-pulse" />}>
          <WaitTimeEstimator />
        </React.Suspense>
      </section>

      {/* Provincial Comparison & Aggregate Insights Dashboard */}
      <section id="analytics" className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-red-600" />
              Canada-Wide Wait Time Analytics
            </h2>
            <p className="text-sm text-zinc-500">
              Aggregated delivery metrics comparing rebate and non-rebate provincial allocation trends.
            </p>
          </div>
        </div>
        <React.Suspense fallback={<div className="h-96 rounded-xl bg-zinc-100 animate-pulse" />}>
          <ProvincialComparison />
        </React.Suspense>
      </section>

      {/* Community Submissions & Delivery Log Table */}
      <section id="community-log" className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-4">
        <React.Suspense fallback={<div className="h-96 rounded-xl bg-zinc-100 animate-pulse" />}>
          <CommunityDataTable />
        </React.Suspense>
      </section>

      {/* Feature & Community Insights Grid */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Why Track With ToyotaWaits.ca?
          </h2>
          <p className="text-sm text-zinc-500">
            Built by and for Canadian car buyers navigating persistent hybrid vehicle allocation quotas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader className="space-y-1">
              <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-950 flex items-center justify-center text-red-600 mb-2">
                <MapPin className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Provincial Accuracy</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Vehicle allocations vary dramatically between provinces with ZEV incentives (BC & QC) and non-rebate
              provinces (ON & AB). Our model segments data geographically.
            </CardContent>
          </Card>

          <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader className="space-y-1">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 mb-2">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Zero-PII Privacy</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Zero login requirements, zero VIN tracking, and zero email collection. We use client-side cryptographic
              secret keys so you can update delivery status later without revealing who you are.
            </CardContent>
          </Card>

          <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader className="space-y-1">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 mb-2">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Auditable Open Data</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We believe in total transparency. Anyone can download the full, sanitized community dataset via RFC 4180
              CSV export for independent verification and community research.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Community Callout CTA */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl bg-zinc-900 text-white p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Have You Placed an Order or Received a Delivery?
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Join hundreds of Canadian drivers contributing their timelines. It takes less than 60 seconds and helps
              the entire community.
            </p>
          </div>
          <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold h-12 px-8 text-base shrink-0">
            <Link href="/submit">
              Submit My Timeline
              <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
