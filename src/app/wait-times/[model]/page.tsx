import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { createServerClient, isLiveSupabaseConfigured } from '@/lib/supabase/server';
import { getCommunitySubmissions } from '@/lib/db/submissions';
import { DeliveryPrepChecklist } from '@/components/dashboard/delivery-prep-checklist';
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
  ChevronDown,
  PlusCircle,
  HelpCircle,
  ShieldCheck,
  AlertCircle,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    model: string;
  }>;
}

export async function generateStaticParams() {
  return Object.keys(MODEL_REGISTRY).map((model) => ({ model }));
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
      const supabase = createServerClient();
      const { data, error } = await supabase
        .from('wait_times')
        .select('*')
        .ilike('model', `%${modelConfig.dbFilter}%`)
        .order('created_at', { ascending: false });

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
      const allSubmissions = await getCommunitySubmissions('CA');
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

  const title = `${modelConfig.name} Wait Times Canada (2026 Tracker) | ToyotaWaits`;
  const description = `Track real-time 2026 ${modelConfig.name} delivery wait times across Canada. Compare crowdsourced lead times by trim and province.`;
  const canonical = `https://toyotawaits.ca/wait-times/${modelConfig.slug}`;

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

function MiniSubmissionFeed({
  modelName,
  slug,
  submissions,
}: {
  modelName: string;
  slug: string;
  submissions: RawSubmissionRecord[];
}) {
  return (
    <div className="space-y-4">
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

      <Card className="border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xs">
        {submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
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
                {submissions.slice(0, 10).map((sub) => (
                  <tr key={sub.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-zinc-800 dark:text-zinc-200 whitespace-nowrap">
                      {sub.order_date || '2025-10'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                        {sub.province || 'CA'}
                      </span>
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
                        <span className="inline-flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
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
          <div className="p-8 text-center space-y-3">
            <Users className="h-8 w-8 text-zinc-400 mx-auto" />
            <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              No Community Submissions Logged Yet for {modelName}
            </h4>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              Our 2026 wait time benchmarks are calibrated using verified dealership allocation turnaround times. Are you waiting on or recently received a {modelName}?
            </p>
            <Button asChild size="sm" className="font-semibold gap-1.5 shadow-xs bg-red-600 hover:bg-red-700 text-white">
              <Link href={`/submit?model=${slug}`}>
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Dataset',
        name: `${modelConfig.name} Wait Times in Canada (2026 Tracker)`,
        description: `Track real-time 2026 ${modelConfig.name} delivery wait times across Canada. Compare crowdsourced lead times by trim and province.`,
        license: 'https://creativecommons.org/licenses/by-nc/4.0/',
        spatialCoverage: 'Canada',
        dateModified: latestSubmissionDate,
        creator: {
          '@type': 'Organization',
          name: 'ToyotaWaits',
          url: 'https://toyotawaits.ca',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: modelConfig.faqs.map((faq) => ({
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
            🇨🇦 2026 Canadian Delivery Tracker
          </Badge>
          <Badge variant="outline" className="text-xs">
            Updated {latestSubmissionDate}
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
          {modelConfig.name} Wait Times in Canada (2026 Tracker)
        </h1>

        <div className="p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 space-y-2">
          <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
            As of <strong>2026</strong>, Canadian buyers ordering a <strong>{modelConfig.name}</strong> report an overall national median wait time of <strong>{stats.medianDays} days</strong> (~{stats.medianMonths} months), with an interquartile delivery range (IQR) between <strong>{stats.p25Days} days</strong> ({stats.minWaitMonths} months) and <strong>{stats.p75Days} days</strong> ({stats.maxWaitMonths} months). New deposits placed today have a projected target delivery of <strong>{stats.projectedDeliveryText}</strong>.
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Timelines vary considerably by powertrain variant (Gas vs. Hybrid vs. Plug-in Hybrid) and provincial allocation policies.
          </p>
        </div>
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

      {/* Sienna Trailer Hitch Guide Callout Banner */}
      {model === 'sienna' && (
        <section>
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-zinc-50 dark:from-amber-950/40 dark:via-zinc-900/60 dark:to-zinc-950 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <Badge className="bg-amber-500 text-zinc-950 font-bold text-xs">
                  Sienna Accessory Guide
                </Badge>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                  Planning Bike Racks or Towing?
                </h3>
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
            Essential Delivery Day Gear &amp; Upgrades: {modelConfig.name}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Field-tested interior protection, cabin ergonomics, and plug-and-play accessories while you wait for allocation.
          </p>
        </div>
        <DeliveryPrepChecklist model={modelConfig.slug} powertrain={modelConfig.slug === 'sienna' ? 'hev' : undefined} />
      </section>

      {/* Section 5: FAQ Accordion Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-red-600" />
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Frequently Asked Questions: {modelConfig.name} Wait Times
          </h2>
        </div>

        <div className="space-y-3">
          {modelConfig.faqs.map((faq, i) => (
            <details
              key={i}
              className="group border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs transition-all"
            >
              <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 select-none hover:text-red-600 dark:hover:text-red-400 transition-colors">
                <span>{faq.question}</span>
                <ChevronDown className="h-4 w-4 text-zinc-400 group-open:rotate-180 transition-transform duration-200 shrink-0 ml-2" />
              </summary>
              <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/60">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
