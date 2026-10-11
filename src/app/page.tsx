import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { WaitTimeEstimator } from '@/components/calculator/wait-time-estimator';
import { StickyVehiclePills } from '@/components/calculator/sticky-vehicle-pills';
import { ProvincialComparison } from '@/components/dashboard/provincial-comparison';
import { CommunityDataTable } from '@/components/dashboard/community-data-table';
import { ActiveOrderStepper } from '@/components/dashboard/active-order-stepper';
import { BenchmarkFeed } from '@/components/benchmarks/benchmark-feed';
import { getModelWaitBenchmarks } from '@/lib/db/stats';
import { getCommunitySubmissions } from '@/lib/db/submissions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  FileSpreadsheet,
  MapPin,
  ShieldCheck,
  ChevronRight,
  BarChart3,
  Flame,
  Snowflake,
  Disc3,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL('https://toyotawaits.ca'),
  title: 'ToyotaWaits | Canadian Toyota Wait Times & Allocation Tracker',
  description:
    'Crowdsourced Canadian Toyota delivery timelines, waitlists, MSRP compliance, and dealer markups for RAV4, Prius Prime, Sienna, and more.',
  keywords: [
    'toyota waits',
    'toyota wait tracker',
    'toyota wait times canada',
    'canadian toyota tracker',
    'toyota allocation canada',
    'rav4 prime wait time',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ToyotaWaits | Canadian Toyota Wait Times & Allocation Tracker',
    description:
      'Crowdsourced Canadian Toyota delivery timelines, waitlists, MSRP compliance, and dealer markups for RAV4, Prius Prime, Sienna, and more.',
    url: 'https://toyotawaits.ca',
    siteName: 'ToyotaWaits',
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToyotaWaits | Canadian Toyota Wait Times & Allocation Tracker',
    description:
      'Crowdsourced Canadian Toyota delivery timelines, waitlists, MSRP compliance, and dealer markups for RAV4, Prius Prime, Sienna, and more.',
  },
};

export default async function HomePage() {
  const [benchmarks, submissions] = await Promise.all([
    getModelWaitBenchmarks(),
    getCommunitySubmissions(),
  ]);

  return (
    <div className="pb-16">
      {/* Sticky Quick-Select Vehicle Model Pills docked directly under navbar */}
      <StickyVehiclePills />

      <div className="space-y-12">
        {/* 1. Above-the-Fold Hero Section with Wait Time Estimator */}
        <section className="relative border-b border-zinc-200 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 pt-8 pb-12 sm:pt-12 sm:pb-16 dark:border-zinc-800 text-white">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-6">
            {/* Tight Header */}
            <div className="text-center space-y-2.5 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-semibold text-amber-400">
                <Flame className="h-3.5 w-3.5 text-amber-400" />
                <span>ToyotaWaits.ca</span>
                <span className="text-zinc-600">•</span>
                <span>Canadian Community Tracker</span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                Canadian Toyota Wait Time Tracker
              </h1>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl mx-auto">
                Crowdsourced delivery timelines across Canada. Select your model to estimate your wait.
              </p>
            </div>

            {/* Estimator Container immediately below header */}
            <div id="estimator" className="pt-2 mt-4 scroll-mt-28">
              <React.Suspense fallback={<div className="h-96 rounded-xl bg-zinc-900 animate-pulse" />}>
                <WaitTimeEstimator />
              </React.Suspense>
            </div>
          </div>
        </section>

      {/* 2. Secondary Content: Live Delivery Logs & Community Submissions Feed */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-8">
        {/* Active Order Stepper (for returning users with edit keys) */}
        <React.Suspense fallback={<div className="h-32 rounded-xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />}>
          <ActiveOrderStepper />
        </React.Suspense>

        {/* Community Submissions & Delivery Log Table */}
        <div id="community-log" className="space-y-4 scroll-mt-20">
          <React.Suspense fallback={<div className="h-96 rounded-xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />}>
            <CommunityDataTable initialRecords={submissions} />
          </React.Suspense>
        </div>

        {/* Provincial Comparison & Aggregate Insights Dashboard */}
        <div id="analytics" className="space-y-4 scroll-mt-20">
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
          <React.Suspense fallback={<div className="h-96 rounded-xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />}>
            <ProvincialComparison />
          </React.Suspense>
        </div>
      </section>

      {/* 3. Secondary Content: Winter Prep & Tire Fitment Guide Callout */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Canadian Winter Guide */}
          <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 via-zinc-900/40 to-zinc-950 dark:border-cyan-500/20 p-6 flex flex-col justify-between shadow-md hover:border-cyan-500/50 transition-all group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                  <Snowflake className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-500/10 text-xs font-semibold">
                  Sub-Zero Delivery Readiness
                </Badge>
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-cyan-400 transition-colors">
                  Canadian Winter Prep &amp; Survival Guide
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                  Protect your hybrid 12V battery from extreme cold drain, prevent frozen washer fluid nozzles, and fit high-wall TuxMat floor liners without blocking hybrid battery cooling vents.
                </p>
              </div>
            </div>
            <div className="pt-5 border-t border-zinc-200/50 dark:border-zinc-800/80 mt-4">
              <Button asChild variant="outline" className="w-full justify-between border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-bold">
                <Link href="/winter-prep">
                  <span>Explore Canadian Winter Guide</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </Card>

          {/* Card 2: Tire Fitment Guide */}
          <Card className="border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-zinc-900/40 to-zinc-950 dark:border-amber-500/20 p-6 flex flex-col justify-between shadow-md hover:border-amber-500/50 transition-all group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
                  <Disc3 className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/10 text-xs font-semibold">
                  OEM Sizes &amp; 3PMSF Ratings
                </Badge>
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-amber-500 transition-colors">
                  Canadian Toyota Tire Fitment Guide
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                  Factory tire size specifications, severe snow service (3PMSF) winter tire shootouts, and all-weather compound tests for RAV4, Sienna, Grand Highlander, and Prius.
                </p>
              </div>
            </div>
            <div className="pt-5 border-t border-zinc-200/50 dark:border-zinc-800/80 mt-4">
              <Button asChild variant="outline" className="w-full justify-between border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                <Link href="/tires">
                  <span>Explore Tire Recommendations</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* 4. Secondary Content: Popular Mods & Accessories Hub */}
      <section id="benchmarks" className="container mx-auto max-w-6xl px-4 sm:px-6 scroll-mt-20">
        <div id="delivery-prep" className="scroll-mt-20">
          <React.Suspense fallback={<div className="h-64 rounded-xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />}>
            <BenchmarkFeed initialBenchmarks={benchmarks} />
          </React.Suspense>
        </div>
      </section>

      {/* 5. Secondary Content: FAQ / Crowdsourcing Disclaimer */}
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
              Vehicle allocations vary dramatically between provinces with ZEV incentives (BC &amp; QC) and non-rebate
              provinces (ON &amp; AB). Our model segments data geographically.
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
    </div>
  );
}
