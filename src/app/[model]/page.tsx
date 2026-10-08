import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getModelBySlug, CANADIAN_VEHICLE_CATALOG } from '@/lib/data/vehicles';
import { WaitTimeEstimator } from '@/components/calculator/wait-time-estimator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ChevronRight, PlusCircle, Car, ArrowRight } from 'lucide-react';

interface RouteProps {
  params: Promise<{
    model: string;
  }>;
}

export async function generateStaticParams() {
  return CANADIAN_VEHICLE_CATALOG.map((m) => ({ model: m.slug }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { model: modelSlug } = await params;
  const model = getModelBySlug(modelSlug);

  if (!model) {
    return { title: 'Model Not Found | ToyotaWaits.ca' };
  }

  return {
    title: `Toyota ${model.name} Canadian Delivery Wait Times | ToyotaWaits.ca`,
    description: `Crowdsourced delivery wait times, trims, and pricing transparency for the Toyota ${model.name} across Canada.`,
  };
}

export default async function ModelPage({ params }: RouteProps) {
  const { model: modelSlug } = await params;
  const model = getModelBySlug(modelSlug);

  if (!model) {
    notFound();
  }

  return (
    <div className="space-y-10 pb-16">
      {/* Header & Breadcrumbs */}
      <section className="border-b border-zinc-200 bg-zinc-50/70 dark:border-zinc-800 dark:bg-zinc-950/70 py-8">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-4">
          <nav className="flex items-center text-xs text-zinc-500 gap-1.5">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {model.name}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <Badge className="bg-red-600 text-white">🇨🇦 Canadian Tracker</Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                Toyota {model.name}
              </h1>
              <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-2xl">
                Explore crowdsourced wait times across all available {model.name} powertrain configurations.
              </p>
            </div>

            <Link href="/submit">
              <Button className="font-semibold gap-1.5 shadow-sm">
                <PlusCircle className="h-4 w-4" />
                Submit Wait Time
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Powertrain Selection Grid */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Available Powertrains &amp; Configurations
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Select a powertrain to compare provincial wait times and view trim details.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {model.powertrains.map((pt) => {
            const minMsrp = Math.min(...pt.trims.map((t) => t.msrpCad));
            return (
              <Card key={pt.slug} className="border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between">
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {pt.trims.length} Trims
                    </Badge>
                    <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
                      From ${minMsrp.toLocaleString('en-CA')} CAD
                    </span>
                  </div>
                  <CardTitle className="text-lg font-bold text-zinc-950 dark:text-zinc-50 pt-2">
                    {pt.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-500">
                    {pt.trims.map((t) => t.name).join(' • ')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link href={`/${model.slug}/${pt.slug}`}>
                    <Button variant="outline" className="w-full gap-1.5 text-xs font-semibold">
                      Explore Timelines
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Estimator Pre-configured */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6">
        <React.Suspense fallback={<div className="h-96 rounded-xl bg-zinc-100 animate-pulse" />}>
          <WaitTimeEstimator initialModel={model.slug} />
        </React.Suspense>
      </section>
    </div>
  );
}
