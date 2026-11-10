import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { createServerClient, isLiveSupabaseConfigured } from '@/lib/supabase/server';
import { getCommunitySubmissions } from '@/lib/db/submissions';
import { DeliveryPrepChecklist } from '@/components/dashboard/delivery-prep-checklist';
import { PartnerDealBanner } from '@/components/gear/PartnerDealBanner';
import { ModelFAQSection, type ModelFAQData } from '@/components/seo/ModelFAQSection';
import { BenchmarkMyOrderWidget } from '@/components/estimator/BenchmarkMyOrderWidget';
import { ModelDropAlertBridge } from '@/components/wait-times/ModelDropAlertBridge';
import { CrossShopBridge } from '@/components/wait-times/CrossShopBridge';
import { ModelDeliveryShelf } from '@/components/gear/ModelDeliveryShelf';
import { ModelSubmissionsTable } from '@/components/wait-times/ModelSubmissionsTable';
import { EstimatorDisclaimer } from '@/components/wait-times/EstimatorDisclaimer';
import {
  MODEL_REGISTRY,
  getModelConfig,
  type ModelRegistryEntry,
} from '@/lib/data/model-registry';
import { clampWaitDays } from '@/lib/estimator';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Clock,
  MapPin,
  TrendingUp,
  Users,
  ChevronRight,
  PlusCircle,
  ShieldCheck,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Snowflake,
  Package,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const revalidate = 3600; // Cache on edge for 1 hour

interface PageProps {
  params: Promise<{
    model: string;
  }>;
}

export async function generateStaticParams() {
  return Object.keys(MODEL_REGISTRY).map((model) => ({ model }));
}

export function getCalculatorBridgeHref(modelSlug: string): string {
  const clean = modelSlug.toLowerCase().trim();
  if (clean === 'rav4' || clean === 'rav4-hybrid') {
    return '/calculator/rav4-hybrid';
  }
  if (clean === 'sienna' || clean === 'sienna-hybrid') {
    return '/calculator/sienna-hybrid';
  }
  if (clean === 'grand-highlander' || clean === 'grand-highlander-hybrid') {
    return '/calculator/grand-highlander';
  }
  return `/calculator?model=${clean}`;
}

interface RawSubmissionRecord {
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

async function fetchModelSubmissions(modelConfig: ModelRegistryEntry): Promise<{
  submissions: RawSubmissionRecord[];
  latestSubmissionDate: string;
}> {
  let records: RawSubmissionRecord[] = [];
  let latestDate: string | null = null;

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = createServerClient({ revalidate: 3600, tags: ['submissions', 'benchmarks'] });
      const { data, error } = await supabase
        .from('wait_times')
        .select('id, created_at, order_date, delivery_date, wait_days, province, city, model, powertrain, trim, pricing, status')
        .ilike('model', `%${modelConfig.dbFilter}%`)
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && Array.isArray(data) && data.length > 0) {
        records = data;
        latestDate = data[0]?.created_at || data[0]?.order_date || null;
      }
    } catch {
      // Fallback gracefully to verified community records
    }
  }

  if (records.length === 0) {
    try {
      const allSubmissions = await getCommunitySubmissions('CA', { revalidate: 3600, tags: ['submissions', 'benchmarks'], limit: 50 });
      const filtered = allSubmissions.filter((s) => {
        const slugMatch = s.modelSlug?.toLowerCase() === modelConfig.slug.toLowerCase();
        const nameMatch = s.model?.toLowerCase().includes(modelConfig.dbFilter.toLowerCase());
        return slugMatch || nameMatch;
      });

      if (filtered.length > 0) {
        records = filtered.map((s) => ({
          id: s.id,
          order_date: s.orderDate,
          delivery_date: s.deliveryDate,
          wait_days: s.waitDays,
          province: s.province,
          city: s.city,
          model: s.model,
          powertrain: s.powertrain,
          trim: s.trim,
          pricing: s.pricing,
          status: s.status,
          created_at: s.orderDate,
        }));
        latestDate = filtered[0]?.orderDate || null;
      }
    } catch {
      // Fallback
    }
  }

  const currentDate = new Date().toISOString().split('T')[0];
  return {
    submissions: records,
    latestSubmissionDate: latestDate || currentDate,
  };
}

function computeModelStats(modelConfig: ModelRegistryEntry, records: RawSubmissionRecord[]) {
  const delivered = records.filter(
    (r) => r.status === 'delivered' && r.wait_days != null && Number(r.wait_days) > 0
  );
  const pending = records.filter((r) => r.status === 'pending');

  const waitDaysArr = delivered.map((r) => Number(r.wait_days)).sort((a, b) => a - b);

  let rawMedian: number;
  let rawP25: number;
  let rawP75: number;

  if (waitDaysArr.length >= 3) {
    const p25Idx = Math.floor(waitDaysArr.length * 0.25);
    const medIdx = Math.floor(waitDaysArr.length * 0.5);
    const p75Idx = Math.floor(waitDaysArr.length * 0.75);
    rawP25 = waitDaysArr[p25Idx];
    rawMedian = waitDaysArr[medIdx];
    rawP75 = waitDaysArr[p75Idx];
  } else if (waitDaysArr.length > 0) {
    rawMedian = waitDaysArr[Math.floor(waitDaysArr.length / 2)];
    rawP25 = Math.round(rawMedian * 0.8);
    rawP75 = Math.round(rawMedian * 1.25);
  } else {
    rawMedian = modelConfig.baseMedian;
    rawP25 = modelConfig.baseP25;
    rawP75 = modelConfig.baseP75;
  }

  // Hard clamp compounded multipliers under ~400–420 days
  const medianDays = clampWaitDays(rawMedian, 420);
  const p25Days = clampWaitDays(rawP25, 420);
  const p75Days = clampWaitDays(rawP75, 420);
  const iqrDays = Math.max(15, p75Days - p25Days);
  const medianMonths = (medianDays / 30.4).toFixed(1);
  const minWaitMonths = (p25Days / 30.4).toFixed(1);
  const maxWaitMonths = (p75Days / 30.4).toFixed(1);

  // Compute target delivery projection strictly capped before 2028
  const today = new Date();
  const projectedTargetMs = today.getTime() + medianDays * 24 * 60 * 60 * 1000;
  const projectedTargetDate = new Date(projectedTargetMs);
  if (projectedTargetDate.getFullYear() >= 2028) {
    projectedTargetDate.setFullYear(2027);
    projectedTargetDate.setMonth(11);
    projectedTargetDate.setDate(31);
  }
  const projectedDeliveryText = projectedTargetDate.toLocaleDateString('en-CA', {
    month: 'short',
    year: 'numeric',
  });

  // Provincial spreads: BC (1.15), AB (1.00), ON (1.05), QC (1.15)
  const provincialSpreads = [
    {
      code: 'BC',
      name: 'British Columbia',
      multiplier: 1.15,
      days: clampWaitDays(medianDays * 1.15, 420),
      months: (clampWaitDays(medianDays * 1.15, 420) / 30.4).toFixed(1),
      policyNote: 'High CleanBC ZEV rebate demand compounds waitlists on electrified allocations.',
    },
    {
      code: 'AB',
      name: 'Alberta',
      multiplier: 1.00,
      days: clampWaitDays(medianDays * 1.00, 420),
      months: (clampWaitDays(medianDays * 1.00, 420) / 30.4).toFixed(1),
      policyNote: 'Standard non-subsidized retail allocation; often fastest turnaround on gas and hybrid models.',
    },
    {
      code: 'ON',
      name: 'Ontario',
      multiplier: 1.05,
      days: clampWaitDays(medianDays * 1.05, 420),
      months: (clampWaitDays(medianDays * 1.05, 420) / 30.4).toFixed(1),
      policyNote: 'Largest allocation volume in Canada; steady dealership pipeline throughout the GTA.',
    },
    {
      code: 'QC',
      name: 'Quebec',
      multiplier: 1.15,
      days: clampWaitDays(medianDays * 1.15, 420),
      months: (clampWaitDays(medianDays * 1.15, 420) / 30.4).toFixed(1),
      policyNote: 'Heavy order backlogs due to provincial Roulez vert incentive and strong consumer EV demand.',
    },
  ];

  // Fast summary grid: Powertrain | National Median | BC Lead Time | Ontario Lead Time
  const powertrainGrid = modelConfig.powertrains.map((ptName) => {
    let ptMultiplier = 1.0;
    const lower = ptName.toLowerCase();
    if (lower.includes('plug-in')) {
      ptMultiplier = 1.45;
    } else if (lower.includes('hybrid max')) {
      ptMultiplier = 1.25;
    } else if (lower.includes('i-force max')) {
      ptMultiplier = 1.15;
    } else if (lower.includes('hybrid')) {
      ptMultiplier = 1.10;
    } else if (lower.includes('gas') || lower.includes('i-force')) {
      ptMultiplier = 0.75;
    }

    const ptMedian = clampWaitDays(medianDays * ptMultiplier, 420);
    const ptBc = clampWaitDays(ptMedian * 1.15, 420);
    const ptOn = clampWaitDays(ptMedian * 1.05, 420);

    return {
      powertrain: ptName,
      nationalMedian: `${ptMedian} days (~${(ptMedian / 30.4).toFixed(1)} mo)`,
      bcLeadTime: `${ptBc} days (~${(ptBc / 30.4).toFixed(1)} mo)`,
      onLeadTime: `${ptOn} days (~${(ptOn / 30.4).toFixed(1)} mo)`,
    };
  });

  const sortedProvinces = [...provincialSpreads].sort((a, b) => a.days - b.days);
  const fastestProvince = sortedProvinces[0];
  const slowestProvince = sortedProvinces[sortedProvinces.length - 1];

  return {
    sampleSize: records.length,
    deliveredCount: delivered.length,
    pendingCount: pending.length,
    medianDays,
    medianMonths,
    p25Days,
    p75Days,
    iqrDays,
    minWaitMonths,
    maxWaitMonths,
    projectedDeliveryText,
    provincialSpreads,
    fastestProvince,
    slowestProvince,
    powertrainGrid,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { model } = await params;
  const modelConfig = getModelConfig(model);

  if (!modelConfig) {
    return {
      title: 'Vehicle Not Found | ToyotaWaits.ca',
    };
  }

  const currentDate = new Date();
  const currentMonthYear = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const title =
    modelConfig.title ||
    `${modelConfig.name} Wait Times Canada (Updated ${currentMonthYear}) | Live Delivery Tracker`;
  const description =
    (['corolla', 'sienna', 'rav4'].includes(modelConfig.slug) && modelConfig.metaDescription) ||
    `Track real-time crowdsourced ${modelConfig.name} delivery wait times and allocations across Canada (Updated ${currentMonthYear}). Compare lead times by powertrain, trim, and province.`;
  const canonical = `https://www.toyotawaits.ca/wait-times/${modelConfig.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'ToyotaWaits',
      locale: 'en_CA',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-9 w-36" />
      </div>
      <Card className="border-zinc-200 dark:border-zinc-800 p-4 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="space-y-2 pt-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md" />
          ))}
        </div>
      </Card>
    </div>
  );
}

const MiniSubmissionFeed = ModelSubmissionsTable;

export default async function ModelWaitTimePage({ params }: PageProps) {
  const { model } = await params;
  const modelConfig = getModelConfig(model);

  if (!modelConfig) {
    notFound();
  }

  // Canonical 301/308 redirect for model aliases and powertrain suffixes (e.g. rav4-hybrid, sienna-hev)
  if (model.toLowerCase().trim() !== modelConfig.slug) {
    permanentRedirect(`/wait-times/${modelConfig.slug}`);
  }

  const { submissions, latestSubmissionDate } = await fetchModelSubmissions(modelConfig);
  const stats = computeModelStats(modelConfig, submissions);
  const currentMonthYear = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

  // Core machine-readable FAQs targeting Google Position Zero and user queries
  const coreFaqs = [
    {
      question: `What is the average wait time for a Toyota ${modelConfig.shortName} in Canada?`,
      answer: `The Canadian national median wait time for a ${modelConfig.name} is approximately ${stats.medianMonths} months (${stats.medianDays} days), with typical delivery times ranging from ${stats.minWaitMonths} to ${stats.maxWaitMonths} months (${stats.p25Days} to ${stats.p75Days} days) depending on powertrain and trim level.`,
    },
    {
      question: `Which Canadian province has the shortest wait time for the ${modelConfig.shortName}?`,
      answer: `${stats.fastestProvince.name} (${stats.fastestProvince.code}) generally reports the shortest wait times for the ${modelConfig.name} in Canada at approximately ${stats.fastestProvince.months} months (~${stats.fastestProvince.days} days), while provinces with heavy EV/ZEV rebate programs like ${stats.slowestProvince.name} (${stats.slowestProvince.code}) experience the longest delivery queues (~${stats.slowestProvince.days} days).`,
    },
  ];

  const allFaqs = [
    ...coreFaqs,
    ...modelConfig.faqs.filter((faq) => {
      const qLower = faq.question.toLowerCase();
      return (
        !qLower.includes('average wait time for') &&
        !qLower.includes('shortest wait time for')
      );
    }),
  ];

  const faqData: ModelFAQData = {
    modelName: modelConfig.name,
    slug: modelConfig.slug,
    overallMedianMonths: stats.medianMonths,
    fastestProvince: stats.fastestProvince,
    slowestProvince: stats.slowestProvince,
    powertrainBreakdown: stats.powertrainGrid,
    totalReports: stats.sampleSize,
    additionalFaqs: modelConfig.faqs,
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Dataset',
        name: `${modelConfig.name} Wait Times in Canada (${currentMonthYear} Tracker)`,
        description: `Track real-time ${modelConfig.name} delivery wait times across Canada. Compare crowdsourced lead times by trim and province.`,
        license: 'https://creativecommons.org/licenses/by-nc/4.0/',
        spatialCoverage: 'Canada',
        dateModified: latestSubmissionDate,
        creator: {
          '@type': 'Organization',
          name: 'ToyotaWaits',
          url: 'https://www.toyotawaits.ca',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: allFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center text-xs text-zinc-500 gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-red-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
        <Link href="/estimates" className="hover:text-red-600 transition-colors">
          Wait Times
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
          {modelConfig.name}
        </span>
      </nav>

      {/* Hero Header & Above-The-Fold Direct Answer */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className="bg-red-600 text-white font-semibold">
            {['corolla', 'grand-highlander', 'rav4'].includes(modelConfig.slug)
              ? '🇨🇦 2026–2027 Canadian Delivery Tracker'
              : '🇨🇦 2026 Canadian Delivery Tracker'}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Updated {latestSubmissionDate}
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
          {modelConfig.h1 || `${modelConfig.name} Wait Times Canada (Updated ${currentMonthYear})`}
        </h1>

        {/* RAV4 Canadian MSRP & Lead Time Summary Card (Featured Snippet Answer Box) */}
        {modelConfig.slug === 'rav4' && (
          <div
            data-testid="rav4-summary-card"
            className="rounded-2xl border-2 border-red-500/30 bg-gradient-to-br from-red-50/80 via-white to-zinc-50 dark:from-red-950/20 dark:via-zinc-900/60 dark:to-zinc-950 p-5 sm:p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between gap-2 flex-wrap border-b border-zinc-200/80 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white font-black text-xs">
                  ✓
                </span>
                <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
                  2026 Toyota RAV4 Canada: Estimated Wait Times &amp; Base Pricing
                </h2>
              </div>
              <Badge variant="outline" className="text-xs font-semibold text-red-600 dark:text-red-400 border-red-200 dark:border-red-900">
                Canadian Pricing &amp; Lead Times
              </Badge>
            </div>

            {/* Explicit Featured Snippet Answer */}
            <p className="text-base sm:text-lg font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed">
              In Canada, the average wait time for a 2026 Toyota RAV4 Hybrid is currently {stats.medianMonths} months, with fastest deliveries reported in Alberta and longer queues in BC and Ontario.
            </p>

            {/* Three-column visual grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
              {/* Column 1: Gas */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Gas (LE/XLE/Trail)
                </span>
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  <span>MSRP ~$35,950 CAD</span>
                  <span className="text-zinc-400 mx-1.5 font-normal">|</span>
                  <span className="text-zinc-600 dark:text-zinc-300 font-medium">Average Wait: ~2–4 months</span>
                </div>
              </div>

              {/* Column 2: Hybrid */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900/80 border border-red-200/80 dark:border-red-900/40 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                  Hybrid (LE/XLE/Woodland/Limited)
                </span>
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  <span>MSRP ~$38,950 CAD</span>
                  <span className="text-zinc-400 mx-1.5 font-normal">|</span>
                  <span className="text-zinc-600 dark:text-zinc-300 font-medium">Average Wait: ~6–10 months</span>
                </div>
              </div>

              {/* Column 3: Plug-in Hybrid */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Plug-in Hybrid (SE/XSE)
                </span>
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  <span>MSRP ~$53,150 CAD</span>
                  <span className="text-zinc-400 mx-1.5 font-normal">|</span>
                  <span className="text-zinc-600 dark:text-zinc-300 font-medium">Average Wait: ~12–18 months</span>
                </div>
                <div className="pt-1.5">
                  <Link
                    href="/wait-times/lexus-nx"
                    className="inline-flex items-center text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
                  >
                    Can&apos;t wait for Prime? View Lexus NX 450h+ PHEV lead times &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Position Zero Featured Snippet Answer Box */}
        <div
          data-testid="featured-snippet-box"
          className="rounded-2xl border-2 border-red-500/30 bg-gradient-to-br from-red-50/80 via-white to-zinc-50 dark:from-red-950/20 dark:via-zinc-900/60 dark:to-zinc-950 p-5 sm:p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between gap-2 flex-wrap border-b border-zinc-200/80 dark:border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white font-black text-xs">
                ✓
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                Quick Summary &bull; Canadian Delivery Overview
              </span>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Live Allocation Tracker &bull; Updated {currentMonthYear}
            </span>
          </div>

          {/* Core Snippet Direct Answer */}
          <p className="text-base sm:text-lg font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed">
            The Canadian national median wait time for a <strong>{modelConfig.name}</strong> is{' '}
            <strong className="text-red-600 dark:text-red-400">
              {stats.medianMonths} months ({stats.medianDays} days)
            </strong>
            , with typical buyer deliveries falling between {stats.minWaitMonths} and {stats.maxWaitMonths} months ({stats.p25Days}–{stats.p75Days} days).
          </p>

          {/* 3 Key Takeaway Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
            {/* 1. Canadian Median Wait */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Canadian Median Wait
              </span>
              <div className="text-xl font-black text-zinc-950 dark:text-zinc-50">
                {stats.medianMonths} mos <span className="text-sm font-normal text-zinc-500">({stats.medianDays} days)</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                IQR: {stats.minWaitMonths}–{stats.maxWaitMonths} months ({stats.p25Days}–{stats.p75Days} days)
              </p>
            </div>

            {/* 2. Powertrain Breakdown */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Powertrain Breakdown
              </span>
              <ul className="text-xs space-y-1 text-zinc-700 dark:text-zinc-300">
                {stats.powertrainGrid.map((pt) => (
                  <li key={pt.powertrain} className="flex justify-between items-center gap-1">
                    <span className="font-semibold truncate">{pt.powertrain}:</span>
                    <span className="font-mono text-zinc-900 dark:text-zinc-100 shrink-0 font-medium">{pt.nationalMedian}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Regional Lead Times */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Regional Lead Times
              </span>
              <div className="text-xs space-y-1 text-zinc-700 dark:text-zinc-300">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold truncate">Fastest: {stats.fastestProvince.name} ({stats.fastestProvince.code})</span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 shrink-0">~{stats.fastestProvince.days}d</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-amber-700 dark:text-amber-400 font-semibold truncate">Slowest: {stats.slowestProvince.name} ({stats.slowestProvince.code})</span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 shrink-0">~{stats.slowestProvince.days}d</span>
                </div>
              </div>
              <p className="text-[11px] text-zinc-400 leading-tight pt-0.5">
                Rebate demand compounds wait times in BC &amp; QC.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 space-y-2">
          <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
            As of <strong>2026</strong>, Canadian buyers ordering a <strong>{modelConfig.name}</strong> report an overall national median wait time of <strong>{stats.medianDays} days</strong> (~{stats.medianMonths} months), with an interquartile delivery range (IQR) between <strong>{stats.p25Days} days</strong> ({stats.minWaitMonths} months) and <strong>{stats.p75Days} days</strong> ({stats.maxWaitMonths} months). New deposits placed today have a projected target delivery of <strong>{stats.projectedDeliveryText}</strong>.
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Timelines vary considerably by powertrain variant (Gas vs. Hybrid vs. Plug-in Hybrid) and provincial allocation policies.
          </p>
        </div>
      </section>

      {/* Editorial Comparison Guide Bridge for Lexus TX / RX */}
      {(modelConfig.slug === 'lexus-tx' || modelConfig.slug === 'lexus-rx') && (
        <aside
          aria-label="Lexus TX vs. RX Sizing & Family Guide"
          className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-zinc-900/90 to-zinc-950 p-4 sm:p-5 my-4 shadow-md text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">
              <Sparkles className="h-3 w-3" />
              Editorial Comparison Guide
            </span>
            <p className="text-sm font-bold text-zinc-100">
              Torn between TX 3rd-row utility and RX maneuverability? Read our Lexus TX vs. RX Sizing &amp; Family Guide &rarr;
            </p>
            <p className="text-xs text-zinc-400">
              Compare physical dimensions, garage walkaround clearance, adult seating packaging, and Canadian queue times.
            </p>
          </div>
          <Link
            href="/guides/lexus-tx-vs-rx"
            className="shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <span>Compare TX vs. RX</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </aside>
      )}

      {/* Sibling Model Cross-Shopping Bridge Card */}
      <CrossShopBridge
        sourceModelSlug={modelConfig.slug}
        sourceModelName={modelConfig.name}
      />

      {/* "Skip the Wait" Live Inventory Bridge Card */}
      <ModelDropAlertBridge
        estimatedWaitMonths={stats.medianMonths}
        modelSlug={modelConfig.slug}
        modelName={modelConfig.name}
      />

      {/* Curated 3-Item Delivery Day Prep Shelf Mounted Directly Beneath Median Summary Card */}
      <ModelDeliveryShelf
        modelSlug={modelConfig.slug}
        modelName={modelConfig.name}
      />

      {/* Inline Benchmark My Order Acquisition Widget */}
      <section aria-label="Benchmark My Order Queue Placement">
        <BenchmarkMyOrderWidget
          modelSlug={modelConfig.slug}
          modelName={modelConfig.name}
          medianWaitDays={stats.medianDays}
        />
      </section>

      {/* Fast Summary Grid: Powertrain | National Median | BC Lead Time | Ontario Lead Time */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Fast Lead Time Summary Grid
        </h2>
        <Card className="border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Powertrain</th>
                  <th className="py-3 px-4">National Median</th>
                  <th className="py-3 px-4">BC Lead Time</th>
                  <th className="py-3 px-4">Ontario Lead Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                {stats.powertrainGrid.map((row) => (
                  <tr key={row.powertrain} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                      {row.powertrain}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-red-600 dark:text-red-400">
                      {row.nationalMedian}
                    </td>
                    <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                      {row.bcLeadTime}
                    </td>
                    <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">
                      {row.onLeadTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Cross-Sell Teaser Cards: Calculator Bridge & Delivery Day Preparation Bridge */}
      <section aria-label="Calculator and Delivery Preparation Resources">
        {/* A. "Is the Hybrid Worth the Wait?" Calculator Bridge */}
        <div
          data-testid="calculator-teaser-banner"
          className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 my-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              ⚡ Financial Break-Even Analysis
            </div>
            <h3 className="text-sm font-bold text-white">
              Weighing Gas vs. Hybrid while you wait?
            </h3>
            <p className="text-xs text-neutral-300">
              Calculate your annual fuel savings and determine if paying the hybrid premium or waiting out the queue makes financial sense.
            </p>
          </div>
          <Link
            href={getCalculatorBridgeHref(modelConfig.slug)}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-all shrink-0 self-start sm:self-center"
          >
            Calculate Payback &amp; Savings →
          </Link>
        </div>

        {/* B. "Delivery Day Preparation" Checklist Bridge */}
        <div
          data-testid="delivery-prep-teaser-banner"
          className="rounded-xl border border-sky-500/30 bg-sky-950/20 p-4 my-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
              📋 Delivery Day Prep
            </div>
            <h3 className="text-sm font-bold text-white">
              Taking delivery in the next 30–90 days?
            </h3>
            <p className="text-xs text-neutral-300">
              Avoid unexpected dealer doc fees, unverified accessory packages, and inspect fit-and-finish before signing.
            </p>
          </div>
          <Link
            href="/delivery-prep"
            className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-all shrink-0 self-start sm:self-center"
          >
            View Delivery Checklist →
          </Link>
        </div>

        {/* C. "Finance Office Defense: Toyota ECP Extended Warranty" Bridge */}
        <div
          data-testid="ecp-warranty-teaser-banner"
          className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 my-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              🛡️ Finance Office Defense
            </div>
            <h3 className="text-sm font-bold text-white">
              Quoted $3,000+ for Toyota ECP Extended Warranty?
            </h3>
            <p className="text-xs text-neutral-300">
              Break down factory hybrid coverage overlap, dealer margins, and whether extended protection makes financial sense for your {modelConfig.shortName || modelConfig.name}.
            </p>
          </div>
          <Link
            href="/guides/toyota-ecp-warranty-guide"
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-all shrink-0 self-start sm:self-center"
          >
            Check ECP Warranty Breakdown →
          </Link>
        </div>
      </section>

      {/* Seasonal Canadian Winter Delivery Alert Banner */}
      {['rav4', 'sienna', 'camry', 'grand-highlander'].includes(modelConfig.slug) && (
        <section
          aria-label="Seasonal Canadian Winter Delivery Alert"
          data-testid="seasonal-winter-delivery-banner"
        >
          <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 via-zinc-900/60 to-zinc-950 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-0.5 text-xs font-semibold text-cyan-400">
                  <Snowflake className="h-3.5 w-3.5" />
                  <span>Seasonal Canadian Delivery Alert &bull; 2026/2027</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                  Taking winter delivery?
                </h2>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  Taking winter delivery? Check factory OEM tire specs, 17-inch downsizing guides, and BC/Quebec winter tire compliance.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button asChild className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-sm">
                  <Link href="/tires" className="gap-2">
                    <span>Tire Fitment Guide &rarr;</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 font-bold shadow-sm">
                  <Link href="/winter-prep" className="gap-2">
                    <span>Winter Prep Checklist &rarr;</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sienna Trailer Hitch Guide Callout Banner */}
      {model === 'sienna' && (
        <section>
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-zinc-50 dark:from-amber-950/40 dark:via-zinc-900/60 dark:to-zinc-950 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <Badge className="bg-amber-500 text-zinc-950 font-bold text-xs">
                  Sienna Accessory Guide
                </Badge>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                  Planning Bike Racks or Towing?
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Waiting on your delivery? Read our 2021+ Toyota Sienna Trailer Hitch &amp; Kick-Sensor Guide to pick the right receiver and wiring before taking delivery.
                </p>
              </div>
              <Button asChild className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold shrink-0 shadow-sm">
                <Link href="/guides/toyota-sienna-trailer-hitch-guide" className="gap-2">
                  View Sienna Hitch Guide -&gt;
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Section 1: Trim and Powertrain Delivery Spreads */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Trim &amp; Powertrain Delivery Spreads
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Observed factory queue turnaround by trim package and mechanical configuration.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {modelConfig.popularTrims.map((item) => (
            <Card key={item.trim} className="border-zinc-200 dark:border-zinc-800 p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  {item.trim}
                </span>
                <Badge
                  variant={
                    item.status === 'Constrained'
                      ? 'destructive'
                      : item.status === 'High Demand'
                      ? 'outline'
                      : 'secondary'
                  }
                  className="text-[10px]"
                >
                  {item.status}
                </Badge>
              </div>
              <div className="text-xs text-zinc-500">
                Powertrain: <strong>{item.powertrain}</strong>
              </div>
              <div className="text-xs font-semibold text-red-600 dark:text-red-400 pt-1">
                Typical Delivery Spread: {item.spread}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 2026 vs 2027 RAV4 Guide Callout Banner */}
      {modelConfig.slug === 'rav4' && (
        <section aria-label="2026 vs 2027 RAV4 Guide Callout">
          <div className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-500/10 via-red-500/5 to-zinc-50 dark:from-red-950/40 dark:via-zinc-900/60 dark:to-zinc-950 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <Badge className="bg-red-600 text-white font-bold text-xs">
                  2026 vs. 2027 Model Year
                </Badge>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                  Allocated a 2026 or Waiting for a 2027?
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  The 2027 RAV4 brings major hardware changes including native NACS Supercharging and upgraded PHEV output. Read our breakdown before deciding to pass on an incoming allocation.
                </p>
              </div>
              <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-bold shrink-0 shadow-sm">
                <Link href="/guides/toyota-rav4-2026-vs-2027" className="gap-2">
                  Read 2026 vs. 2027 RAV4 Guide →
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* 2026 vs 2027 Sienna Guide Callout Banner */}
      {modelConfig.slug === 'sienna' && (
        <section aria-label="2026 vs 2027 Sienna Guide Callout">
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-zinc-50 dark:from-amber-950/40 dark:via-zinc-900/60 dark:to-zinc-950 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <Badge className="bg-amber-500 text-zinc-950 font-bold text-xs">
                  2026 vs. 2027 Model Year
                </Badge>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                  Allocated a 2026 or 2027 Model?
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  The 2027 Sienna is a direct mechanical carryover. Compare the trim differences and learn how dealer queue rollovers work before passing on a build slot.
                </p>
              </div>
              <Button asChild className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold shrink-0 shadow-sm">
                <Link href="/guides/toyota-sienna-2026-vs-2027" className="gap-2">
                  Read 2026 vs. 2027 Comparison →
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* 2026 vs 2027 Grand Highlander Guide Callout Banner */}
      {modelConfig.slug === 'grand-highlander' && (
        <section aria-label="2026 vs 2027 Grand Highlander Guide Callout">
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-zinc-50 dark:from-amber-950/40 dark:via-zinc-900/60 dark:to-zinc-950 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <Badge className="bg-amber-500 text-zinc-950 font-bold text-xs">
                  2026 vs. 2027 Model Year
                </Badge>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                  Allocated a 2026 or Waiting for a 2027 Grand Highlander?
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Toyota has officially announced the 2027 Grand Highlander featuring a new lifted Woodland Edition. Compare the trim changes and see how queue rollovers work.
                </p>
              </div>
              <Button asChild className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold shrink-0 shadow-sm">
                <Link href="/guides/toyota-grand-highlander-2026-vs-2027" className="gap-2">
                  Read 2026 vs. 2027 Comparison →
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Section 2: Provincial Allocation Breakdown */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Provincial Allocation Breakdown (BC, AB, ON, QC)
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Comparison of lead times and allocation dynamics across the four primary Canadian automotive markets.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.provincialSpreads.map((prov) => (
            <Card key={prov.code} className="border-zinc-200 dark:border-zinc-800 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-lg text-zinc-900 dark:text-zinc-50">
                  {prov.code}
                </span>
                <span className="text-[10px] font-semibold text-zinc-500">
                  {prov.multiplier.toFixed(2)}x factor
                </span>
              </div>
              <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {prov.name}
              </div>
              <div className="text-2xl font-black text-red-600 dark:text-red-500 pt-1">
                ~{prov.days} Days
              </div>
              <p className="text-[11px] text-zinc-500 leading-snug">
                {prov.policyNote}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Section 3: Model-Specific Allocation Tips */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Model-Specific Allocation Tips &amp; Order Guidance
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Field-tested recommendations from Canadian buyers to navigate allocation constraints and avoid unnecessary delivery holds.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3">
          <ul className="space-y-2.5">
            {modelConfig.allocationTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 font-bold text-[11px]">
                  {idx + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Section 4: Mini Submission Feed Wrapped in Suspense */}
      <section>
        <Suspense fallback={<TableSkeleton />}>
          <MiniSubmissionFeed
            modelName={modelConfig.name}
            slug={modelConfig.slug}
            submissions={submissions}
          />
        </Suspense>
      </section>

      {/* Section 4.5: Delivery Prep & Gear Shelf */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Delivery Day Upgrades &amp; Partner Deals: {modelConfig.name}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Field-tested interior protection, cabin ergonomics, and plug-and-play accessories while you wait for allocation.
          </p>
        </div>

        {/* Featured Muslogy Authorized Partner Deal Banner */}
        <PartnerDealBanner modelSlug={modelConfig.slug} modelName={modelConfig.name} />

        <DeliveryPrepChecklist model={modelConfig.slug} powertrain={modelConfig.slug === 'sienna' ? 'hev' : undefined} />
      </section>

      {/* Independent Platform Disclaimer Safe Harbor */}
      <EstimatorDisclaimer className="my-6" />

      {/* Section 5: FAQ Accordion Section with Schema.org JSON-LD */}
      <ModelFAQSection faqData={faqData} />
    </div>
  );
}
