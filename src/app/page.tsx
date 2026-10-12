import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { WaitTimeEstimator } from '@/components/calculator/wait-time-estimator';
import { PostEstimateSubmissionCta } from '@/components/calculator/post-estimate-submission-cta';
import { StickyVehiclePills } from '@/components/calculator/sticky-vehicle-pills';
import { CommunityDataTable } from '@/components/dashboard/community-data-table';
import { ActiveOrderStepper } from '@/components/dashboard/active-order-stepper';
import { ModelGearChecklist } from '@/components/benchmarks/benchmark-feed';
import { HashScrollHandler } from '@/components/common/hash-scroll-handler';
import { getCommunitySubmissions } from '@/lib/db/submissions';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  FileSpreadsheet,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Flame,
  Snowflake,
  Disc3,
  ClipboardCheck,
  Zap,
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
  const submissions = await getCommunitySubmissions();

  return (
    <div className="pb-16">
      {/* Client-Side Hash Scroll Listener for anchor deep-linking */}
      <HashScrollHandler />

      {/* Sticky Quick-Select Vehicle Model Pills docked directly under navbar */}
      <StickyVehiclePills />

      <div className="space-y-6 sm:space-y-8">
        {/* 1. Above-the-Fold Hero Section with Wait Time Estimator */}
        <section className="relative border-b border-zinc-200 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 pt-4 pb-4 sm:pt-6 sm:pb-6 dark:border-zinc-800 text-white">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-4 sm:space-y-6">
            {/* Tight Header */}
            <div className="text-center space-y-2 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-semibold text-amber-400">
                <Flame className="h-3.5 w-3.5 text-amber-400" />
                <span>ToyotaWaits.ca</span>
                <span className="text-zinc-600">•</span>
                <span>Canadian Community Tracker</span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                Canadian Toyota Wait Time Tracker
              </h1>

              <p className="text-xs text-neutral-400 font-medium tracking-wide">
                Tracking real-world Canadian order timelines and dealer deliveries.
              </p>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl mx-auto">
                Crowdsourced delivery timelines across Canada. Select your model to estimate your wait.
              </p>
            </div>

            {/* Estimator Container immediately below header */}
            <div className="mt-2">
              <React.Suspense fallback={<div className="h-96 rounded-xl bg-zinc-900 animate-pulse" />}>
                <WaitTimeEstimator />
              </React.Suspense>
            </div>

            {/* High-Contrast Post-Estimate Crowdsourcing Submission Card */}
            <PostEstimateSubmissionCta />

            {/* Elevated Compact Guides Grid directly underneath estimator */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full mt-3 mb-0 sm:mt-4 sm:mb-0">
              <Link
                href="/winter-prep"
                className="group rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 to-zinc-900/60 p-2.5 sm:p-3 flex items-center justify-between hover:border-cyan-500/50 hover:bg-cyan-950/40 transition-all min-h-[72px]"
              >
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <Snowflake className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-white whitespace-normal leading-tight group-hover:text-cyan-400 transition-colors">
                      Winter Prep
                    </h4>
                    <p className="text-[10px] sm:text-xs text-zinc-400 whitespace-normal leading-tight mt-0.5">
                      12V &amp; Floor Mats
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-1" />
              </Link>

              <Link
                href="/tires"
                className="group rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-950/30 to-zinc-900/60 p-2.5 sm:p-3 flex items-center justify-between hover:border-amber-500/50 hover:bg-amber-950/40 transition-all min-h-[72px]"
              >
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <Disc3 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-white whitespace-normal leading-tight group-hover:text-amber-400 transition-colors">
                      Tire Fitment
                    </h4>
                    <p className="text-[10px] sm:text-xs text-zinc-400 whitespace-normal leading-tight mt-0.5">
                      OEM Sizes &amp; 3PMSF
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-1" />
              </Link>

              <Link
                href="/delivery-prep"
                className="group rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/30 to-zinc-900/60 p-2.5 sm:p-3 flex items-center justify-between hover:border-emerald-500/50 hover:bg-emerald-950/40 transition-all min-h-[72px]"
              >
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <ClipboardCheck className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-white whitespace-normal leading-tight group-hover:text-emerald-400 transition-colors">
                      Delivery Day Prep
                    </h4>
                    <p className="text-[10px] sm:text-xs text-zinc-400 whitespace-normal leading-tight mt-0.5">
                      Inspection Checklist
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-1" />
              </Link>

              <Link
                href="/guides/ev-charging"
                className="group rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-950/30 to-zinc-900/60 p-2.5 sm:p-3 flex items-center justify-between hover:border-purple-500/50 hover:bg-purple-950/40 transition-all min-h-[72px]"
              >
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-white whitespace-normal leading-tight group-hover:text-purple-400 transition-colors">
                      EV Rebates
                    </h4>
                    <p className="text-[10px] sm:text-xs text-zinc-400 whitespace-normal leading-tight mt-0.5">
                      Federal &amp; Provincial
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* 3. Model Gear Checklist */}
        <section id="gear" className="container mx-auto max-w-6xl px-4 sm:px-6 scroll-mt-24">
          <React.Suspense fallback={<div className="h-64 rounded-xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />}>
            <ModelGearChecklist />
          </React.Suspense>
        </section>

        {/* 4. Community Submissions & Delivery Log Table (Verifiable Audit Trail) */}
        <section id="community-log" className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-4 sm:space-y-6 scroll-mt-20">
          <div id="analytics" className="scroll-mt-24" />
          {/* Active Order Stepper (for returning users with edit keys) */}
          <React.Suspense fallback={<div className="h-32 rounded-xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />}>
            <ActiveOrderStepper />
          </React.Suspense>

          <div className="space-y-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <FileSpreadsheet className="h-6 w-6 text-amber-500" />
                Community Delivery Log &amp; Audit Trail
              </h2>
              <p className="text-sm text-zinc-500">
                Real-time crowdsourced submissions from verified Canadian buyers across all provinces.
              </p>
            </div>

            <React.Suspense fallback={<div className="h-96 rounded-xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />}>
              <CommunityDataTable initialRecords={submissions} />
            </React.Suspense>
          </div>
        </section>

      {/* 5. Secondary Content: FAQ / Crowdsourcing Disclaimer */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-6">
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
