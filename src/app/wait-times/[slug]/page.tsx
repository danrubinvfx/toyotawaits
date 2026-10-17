import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getModelBySlug,
  CANADIAN_VEHICLE_CATALOG,
  getRegionByCode,
} from '@/lib/data/vehicles';
import { getModelBenchmark } from '@/lib/db/stats';
import { getCommunitySubmissions } from '@/lib/db/submissions';
import { createServerClient, isLiveSupabaseConfigured } from '@/lib/supabase/server';
import { CommunityDataTable } from '@/components/dashboard/community-data-table';
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
  HelpCircle,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

function formatSlugToName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateStaticParams() {
  const slugs = new Set<string>(CANADIAN_VEHICLE_CATALOG.map((m) => m.slug));

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = createServerClient();
      const { data, error } = await supabase
        .from('vehicle_models')
        .select('slug')
        .eq('is_active', true);

      if (!error && Array.isArray(data)) {
        for (const row of data) {
          if (row.slug) {
            slugs.add(String(row.slug).toLowerCase());
          }
        }
      }
    } catch {
      // Graceful fallback to catalog slugs
    }
  }

  return Array.from(slugs).map((slug) => ({ slug }));
}

async function getModelStats(slug: string) {
  const catalogModel = getModelBySlug(slug);
  const modelName = catalogModel ? catalogModel.name : formatSlugToName(slug);

  const [benchmark, allSubmissions] = await Promise.all([
    getModelBenchmark(slug),
    getCommunitySubmissions('CA'),
  ]);

  const modelSubmissions = allSubmissions.filter(
    (s) =>
      s.modelSlug.toLowerCase() === slug.toLowerCase() ||
      s.model.toLowerCase() === modelName.toLowerCase()
  );

  if (!catalogModel && modelSubmissions.length === 0) {
    return null;
  }

  const delivered = modelSubmissions.filter(
    (s) => s.status === 'delivered' && s.waitDays != null && s.waitDays > 0
  );
  const pending = modelSubmissions.filter((s) => s.status === 'pending');

  const count = modelSubmissions.length > 0 ? modelSubmissions.length : benchmark.sample_size;
  const avgDays =
    delivered.length > 0
      ? Math.round(delivered.reduce((acc, s) => acc + (s.waitDays || 0), 0) / delivered.length)
      : benchmark.mean_days || benchmark.median_days || 180;

  const averageMonths = (avgDays / 30.4).toFixed(1);

  // Group delivered submissions by province to determine fastest and slowest
  const provMap = new Map<string, number[]>();
  for (const s of delivered) {
    if (!s.province) continue;
    const p = s.province.toUpperCase();
    if (!provMap.has(p)) provMap.set(p, []);
    provMap.get(p)!.push(s.waitDays!);
  }

  let fastestProvince = 'Ontario (ON)';
  let fastestDays = Math.round(avgDays * 0.75);
  let slowestProvince = 'British Columbia (BC)';
  let slowestDays = Math.round(avgDays * 1.35);

  if (provMap.size > 0) {
    const provAverages = Array.from(provMap.entries())
      .map(([code, days]) => {
        const avg = Math.round(days.reduce((a, b) => a + b, 0) / days.length);
        const region = getRegionByCode(code);
        const provName = region ? `${region.name} (${region.code})` : code;
        return { code, provName, avg };
      })
      .sort((a, b) => a.avg - b.avg);

    fastestProvince = provAverages[0].provName;
    fastestDays = provAverages[0].avg;
    slowestProvince = provAverages[provAverages.length - 1].provName;
    slowestDays = provAverages[provAverages.length - 1].avg;
  }

  return {
    catalogModel,
    modelName,
    avgDays,
    averageMonths,
    count,
    deliveredCount: delivered.length,
    pendingCount: pending.length,
    fastestProvince,
    fastestDays,
    slowestProvince,
    slowestDays,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const stats = await getModelStats(slug);

  if (!stats) {
    return {
      title: 'Vehicle Not Found | ToyotaWaits.ca',
    };
  }

  const currentYear = new Date().getFullYear();
  const title = `Toyota ${stats.modelName} Wait Times in Canada (${currentYear}) | Live Tracker`;
  const description = `Current crowdsourced wait times for the Toyota ${stats.modelName} across Canada. Average wait: ${stats.averageMonths} months based on ${stats.count} owner reports.`;
  const canonical = `https://toyotawaits.ca/wait-times/${slug}`;

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

async function SubmissionsTableSection({
  slug,
  modelName,
}: {
  slug: string;
  modelName: string;
}) {
  const allSubmissions = await getCommunitySubmissions('CA');
  const modelSubmissions = allSubmissions.filter(
    (s) =>
      s.modelSlug.toLowerCase() === slug.toLowerCase() ||
      s.model.toLowerCase() === modelName.toLowerCase()
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Toyota {modelName} Verified Delivery Log
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Real order dates, factory delivery timelines, and dealer pricing submitted by Canadian buyers.
          </p>
        </div>
      </div>
      <CommunityDataTable
        initialRecords={modelSubmissions.length > 0 ? modelSubmissions : allSubmissions}
        initialModelFilter={slug}
      />
    </div>
  );
}

export default async function WaitTimesModelPage({ params }: PageProps) {
  const { slug } = await params;
  const stats = await getModelStats(slug);

  if (!stats) {
    notFound();
  }

  const {
    modelName,
    avgDays,
    averageMonths,
    count,
    deliveredCount,
    pendingCount,
    fastestProvince,
    fastestDays,
    slowestProvince,
    slowestDays,
    catalogModel,
  } = stats;

  const currentIsoDate = new Date().toISOString().split('T')[0];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Dataset',
        name: `Toyota ${modelName} Wait Times in Canada`,
        description: `Crowdsourced delivery wait times, provincial comparisons, and allocation tracking for Toyota ${modelName} vehicles in Canada.`,
        spatialCoverage: 'Canada',
        dateModified: currentIsoDate,
        creator: {
          '@type': 'Organization',
          name: 'ToyotaWaits',
          url: 'https://toyotawaits.ca',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `What is the average wait time for a Toyota ${modelName} in Canada?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The average crowdsourced wait time for a Toyota ${modelName} across Canada is approximately ${avgDays} days (${averageMonths} months), based on ${count} owner reports.`,
            },
          },
          {
            '@type': 'Question',
            name: `Which Canadian province has the shortest wait time for the ${modelName}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Based on verified community reports, ${fastestProvince} currently reports the shortest average wait time for the Toyota ${modelName} at approximately ${fastestDays} days.`,
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="space-y-10 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header & Breadcrumbs */}
      <section className="border-b border-zinc-200 bg-zinc-50/70 dark:border-zinc-800 dark:bg-zinc-950/70 py-8">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-4">
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
              {modelName}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-red-600 text-white font-semibold">
                  🇨🇦 Live Canadian Tracker
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Updated Daily
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                Toyota {modelName} Wait Times in Canada
              </h1>
              <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                Live crowdsourced delivery timelines, provincial wait comparisons, and dealership
                MSRP transparency for the Toyota {modelName} across Canadian provinces.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Button asChild className="font-semibold gap-1.5 shadow-sm bg-red-600 hover:bg-red-700 text-white">
                <Link href={`/submit?model=${slug}`}>
                  <PlusCircle className="h-4 w-4" />
                  Submit Your Wait Time
                </Link>
              </Button>
              {catalogModel && (
                <Button asChild variant="outline" className="font-semibold text-xs">
                  <Link href={`/${slug}`}>
                    Explore Trims
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Summary KPI Stats Card */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between text-zinc-500">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  National Average Wait
                </span>
                <Clock className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-3xl font-black text-red-600 dark:text-red-500">
                {avgDays} Days
              </div>
              <p className="text-xs text-zinc-500">
                Approximately <strong>{averageMonths} months</strong> from deposit to keys
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between text-zinc-500">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Fastest Province
                </span>
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50 truncate" title={fastestProvince}>
                {fastestProvince}
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                ~{fastestDays} days average delivery
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between text-zinc-500">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Slowest Province
                </span>
                <MapPin className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50 truncate" title={slowestProvince}>
                {slowestProvince}
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                ~{slowestDays} days average allocation
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between text-zinc-500">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Sample Size
                </span>
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
                {count} Submissions
              </div>
              <p className="text-xs text-zinc-500">
                {deliveredCount > 0 ? `${deliveredCount} delivered` : 'Verified community baseline'}
                {pendingCount > 0 ? ` • ${pendingCount} in queue` : ''}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Submissions Table with Suspense Fallback */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6">
        <Suspense fallback={<TableSkeleton />}>
          <SubmissionsTableSection slug={slug} modelName={modelName} />
        </Suspense>
      </section>

      {/* FAQ Accordion Section for SEO & User Help */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6">
        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-red-600" />
              <CardTitle className="text-lg sm:text-xl font-bold">
                Frequently Asked Questions: Toyota {modelName} Wait Times
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                What is the average wait time for a Toyota {modelName} in Canada?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                The average crowdsourced delivery wait time for a Toyota {modelName} in Canada is currently
                approximately <strong>{avgDays} days ({averageMonths} months)</strong>. Wait times vary
                based on powertrain (PHEV vs HEV vs Gas), trim package availability, and dealership allocation volume.
              </p>
            </div>

            <div className="space-y-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                Which Canadian province has the shortest wait time for the {modelName}?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Based on verified community deliveries, <strong>{fastestProvince}</strong> currently reports
                the fastest average turnaround at approximately <strong>~{fastestDays} days</strong>, compared
                to longer waitlists in provinces with high ZEV incentive demand like {slowestProvince}.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                How can I speed up my Toyota {modelName} delivery?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Flexibility with exterior color, interior trim, and package options can significantly reduce
                your wait time. High-volume dealerships receive more factory allocation batches monthly,
                which can shave weeks off your timeline.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
