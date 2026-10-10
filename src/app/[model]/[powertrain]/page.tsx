import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  getModelBySlug,
  getPowertrainBySlug,
  CANADIAN_VEHICLE_CATALOG,
  CANADIAN_PROVINCES_LIST,
  isRebateEligibleProvince,
} from '@/lib/data/vehicles';
import { WaitTimeEstimator } from '@/components/calculator/wait-time-estimator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ChevronRight, MapPin, Clock, ArrowRight, PlusCircle } from 'lucide-react';

interface RouteProps {
  params: Promise<{
    model: string;
    powertrain: string;
  }>;
}

export const revalidate = 1800;

export async function generateStaticParams() {
  const params: Array<{ model: string; powertrain: string }> = [];
  for (const model of CANADIAN_VEHICLE_CATALOG) {
    for (const pt of model.powertrains) {
      params.push({
        model: model.slug,
        powertrain: pt.slug,
      });
    }
  }
  return params;
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { model: modelSlug, powertrain: powertrainSlug } = await params;
  const model = getModelBySlug(modelSlug);
  const powertrain = getPowertrainBySlug(modelSlug, powertrainSlug);

  if (!model || !powertrain) {
    return { title: 'Vehicle Not Found | ToyotaWaits.ca' };
  }

  return {
    title: `Toyota ${model.name} ${powertrain.name} Wait Times Across Canada | ToyotaWaits.ca`,
    description: `Crowdsourced delivery wait times, trim breakdown, and provincial allocation comparison for the Toyota ${model.name} (${powertrain.name}) in Canada.`,
  };
}

export default async function ModelPowertrainPage({ params }: RouteProps) {
  const { model: modelSlug, powertrain: powertrainSlug } = await params;
  const model = getModelBySlug(modelSlug);
  const powertrain = getPowertrainBySlug(modelSlug, powertrainSlug);

  if (!model || !powertrain) {
    notFound();
  }

  return (
    <div className="space-y-10 pb-16">
      {/* Header & Breadcrumb */}
      <section className="border-b border-zinc-200 bg-zinc-50/70 dark:border-zinc-800 dark:bg-zinc-950/70 py-8">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-4">
          <nav className="flex items-center text-xs text-zinc-500 gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
            <Link href={`/${model.slug}`} className="hover:text-red-600 transition-colors">
              {model.name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {powertrain.name}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <Badge className="bg-red-600 text-white">🇨🇦 Canadian Delivery Timelines</Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                Toyota {model.name} {powertrain.name}
              </h1>
              <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-2xl">
                Compare delivery wait times by province or select your province below for localized arrival estimates.
              </p>
            </div>

            <Button asChild className="font-semibold gap-1.5 shadow-sm">
              <Link href="/submit">
                <PlusCircle className="h-4 w-4" />
                Submit Wait Time
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Provincial Deep-Links Grid */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Select Your Canadian Province
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Choose your province to view empirical wait times, local dealership pricing reports, and rebate info.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {CANADIAN_PROVINCES_LIST.map((prov) => {
            const hasRebate = isRebateEligibleProvince(prov.code);
            return (
              <Link
                key={prov.code}
                href={`/${model.slug}/${powertrain.slug}/${prov.code.toLowerCase()}`}
                className="group"
              >
                <Card className="h-full border-zinc-200 dark:border-zinc-800 hover:border-red-500 dark:hover:border-red-500 hover:shadow-md transition-all">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-950 dark:text-zinc-50 group-hover:text-red-600 transition-colors">
                          {prov.name}
                        </span>
                        <span className="text-xs font-semibold text-zinc-400">({prov.code})</span>
                      </div>
                      {hasRebate && powertrain.slug === 'phev' && (
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold block">
                          ⚡ Provincial Rebate
                        </span>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Estimator Pre-configured */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6">
        <React.Suspense fallback={<div className="h-96 rounded-xl bg-zinc-100 animate-pulse" />}>
          <WaitTimeEstimator initialModel={model.slug} initialPowertrain={powertrain.slug} />
        </React.Suspense>
      </section>
    </div>
  );
}
