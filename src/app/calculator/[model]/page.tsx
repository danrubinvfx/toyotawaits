import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BackButton } from '@/components/common/back-button';
import { VehicleSavingsCalculator } from '@/components/calculator/VehicleSavingsCalculator';
import { StaticEnergyTable } from '@/components/calculator/StaticEnergyTable';
import { CalculatorNewsWire } from '@/components/news/CalculatorNewsWire';
import { CalculatorGearCards } from '@/components/gear/CalculatorGearCards';
import { ShieldCheck, Fuel, Zap, HelpCircle, Calculator } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { NEW_VEHICLE_PRESETS, getVehiclePresetById } from '@/data/vehicle-presets';

export const revalidate = 3600; // 1 hour ISR

interface ModelInfo {
  name: string;
  year: number;
  presetId: string;
  archetypeId: string;
  combinedL100km: number;
}

const KNOWN_MODELS: Record<string, ModelInfo> = {
  'sienna-hev': {
    name: 'Sienna',
    year: 2025,
    presetId: '2025-toyota-sienna-hybrid',
    archetypeId: 'archetype-minivan',
    combinedL100km: 6.6,
  },
  'camry-hev': {
    name: 'Camry',
    year: 2025,
    presetId: '2025-toyota-camry-hybrid',
    archetypeId: 'archetype-sedan-gas',
    combinedL100km: 4.6,
  },
  'rav4-prime': {
    name: 'RAV4 PHEV',
    year: 2026,
    presetId: '2026-toyota-rav4-phev',
    archetypeId: 'archetype-compact-crossover-awd',
    combinedL100km: 6.0,
  },
  'rav4': {
    name: 'RAV4 Hybrid',
    year: 2026,
    presetId: '2026-toyota-rav4-hybrid',
    archetypeId: 'archetype-compact-crossover-awd',
    combinedL100km: 5.8,
  },
  'sienna': {
    name: 'Sienna',
    year: 2025,
    presetId: '2025-toyota-sienna-hybrid',
    archetypeId: 'archetype-minivan',
    combinedL100km: 6.6,
  },
  'camry': {
    name: 'Camry',
    year: 2025,
    presetId: '2025-toyota-camry-hybrid',
    archetypeId: 'archetype-sedan-gas',
    combinedL100km: 4.6,
  },
  'prius': {
    name: 'Prius',
    year: 2025,
    presetId: '2025-toyota-prius-hybrid',
    archetypeId: 'archetype-sedan-gas',
    combinedL100km: 4.1,
  },
  'grand-highlander-hybrid': {
    name: 'Grand Highlander',
    year: 2025,
    presetId: '2025-toyota-grand-highlander-hybrid',
    archetypeId: 'archetype-compact-crossover-awd',
    combinedL100km: 7.0,
  },
  'rav4-hybrid': {
    name: 'RAV4 Hybrid',
    year: 2026,
    presetId: '2026-toyota-rav4-hybrid',
    archetypeId: 'archetype-compact-crossover-awd',
    combinedL100km: 5.8,
  },
  'rav4-phev': {
    name: 'RAV4 PHEV',
    year: 2026,
    presetId: '2026-toyota-rav4-phev',
    archetypeId: 'archetype-compact-crossover-awd',
    combinedL100km: 6.0,
  },
  'sienna-hybrid': {
    name: 'Sienna',
    year: 2025,
    presetId: '2025-toyota-sienna-hybrid',
    archetypeId: 'archetype-minivan',
    combinedL100km: 6.6,
  },
  'grand-highlander': {
    name: 'Grand Highlander',
    year: 2025,
    presetId: '2025-toyota-grand-highlander-hybrid',
    archetypeId: 'archetype-compact-crossover-awd',
    combinedL100km: 7.0,
  },
  'camry-hybrid': {
    name: 'Camry',
    year: 2025,
    presetId: '2025-toyota-camry-hybrid',
    archetypeId: 'archetype-sedan-gas',
    combinedL100km: 4.6,
  },
  'prius-hybrid': {
    name: 'Prius',
    year: 2025,
    presetId: '2025-toyota-prius-hybrid',
    archetypeId: 'archetype-sedan-gas',
    combinedL100km: 4.1,
  },
  'crown-signia': {
    name: 'Crown Signia',
    year: 2025,
    presetId: '2025-toyota-crown-signia-hybrid',
    archetypeId: 'archetype-compact-crossover-awd',
    combinedL100km: 6.2,
  },
};

function resolveModelInfo(slug: string): ModelInfo {
  const clean = slug.toLowerCase().trim();
  if (KNOWN_MODELS[clean]) {
    return KNOWN_MODELS[clean];
  }

  // Fallback heuristic: check presets
  const foundPreset = NEW_VEHICLE_PRESETS.find(
    (p) =>
      p.id.toLowerCase().includes(clean) ||
      clean.includes(p.identity.model.toLowerCase().replace(/\s+/g, '-'))
  );

  if (foundPreset) {
    return {
      name: foundPreset.identity.model,
      year: foundPreset.identity.year,
      presetId: foundPreset.id,
      archetypeId: 'archetype-compact-crossover-awd',
      combinedL100km: foundPreset.consumption.combinedL100km ?? 5.8,
    };
  }

  // Generic fallback
  const formattedName = clean
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    name: formattedName,
    year: 2026,
    presetId: '2026-toyota-rav4-hybrid',
    archetypeId: 'archetype-compact-crossover-awd',
    combinedL100km: 5.8,
  };
}

interface PageProps {
  params: Promise<{
    model: string;
  }>;
}

export async function generateStaticParams() {
  return [
    { model: 'rav4' },
    { model: 'rav4-hybrid' },
    { model: 'rav4-phev' },
    { model: 'sienna' },
    { model: 'sienna-hybrid' },
    { model: 'grand-highlander' },
    { model: 'grand-highlander-hybrid' },
    { model: 'camry' },
    { model: 'camry-hybrid' },
    { model: 'prius' },
    { model: 'prius-hybrid' },
    { model: 'crown-signia' },
    { model: 'highlander' },
    { model: 'tacoma' },
    { model: 'tundra' },
    { model: 'corolla-cross' },
    { model: 'land-cruiser' },
    { model: '4runner' },
    { model: 'sequoia' },
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { model } = await params;
  const info = resolveModelInfo(model);

  const title = `${info.year} Toyota ${info.name} Fuel Savings & Payback Calculator | ToyotaWaits`;
  const description = `Compare Toyota ${info.name} Hybrid vs gas operating costs. Calculate annual dollar savings, monthly fuel reduction, and payback timeline.`;

  return {
    metadataBase: new URL('https://toyotawaits.ca'),
    title,
    description,
    alternates: {
      canonical: `https://toyotawaits.ca/calculator/${model}`,
    },
    openGraph: {
      title,
      description,
      url: `https://toyotawaits.ca/calculator/${model}`,
      siteName: 'ToyotaWaits.ca',
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

export default async function DynamicModelCalculatorPage({ params }: PageProps) {
  const { model } = await params;
  const info = resolveModelInfo(model);

  return (
    <main className="min-h-screen pt-4 sm:pt-6 pb-20 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <div className="container mx-auto max-w-6xl px-3 sm:px-6 space-y-4 sm:space-y-6">
        {/* Navigation & Header */}
        <div className="space-y-2 sm:space-y-3">
          <BackButton fallbackHref="/calculator" label="← Back to Calculator" />

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-xs font-semibold mb-1">
              <Calculator className="w-3.5 h-3.5" />
              <span>{info.name} Fuel Savings &amp; Payback</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Toyota {info.name} Fuel Savings &amp; Payback Calculator
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 sm:mt-1">
              Compare actual annual fuel costs between your current vehicle and a {info.year} Toyota {info.name} ({info.combinedL100km} L/100km combined).
            </p>
          </div>
        </div>

        {/* News Wire Announcement Ticker */}
        <CalculatorNewsWire activeModel={model} />

        {/* Client-Side Interactive Calculator */}
        <section aria-label="Interactive Savings Calculator">
          <VehicleSavingsCalculator
            initialTargetPresetId={info.presetId}
            initialCurrentArchetypeId={info.archetypeId}
          />
        </section>

        {/* Recommended Products */}
        <div className="pt-2 sm:pt-4">
          <CalculatorGearCards activeModel={model} />
        </div>

        {/* Pre-rendered Static Benchmark Table */}
        <div className="pt-6 sm:pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <StaticEnergyTable />
        </div>

        {/* Methodology Disclosure */}
        <section aria-labelledby="methodology-heading" className="pt-2 sm:pt-4">
          <Card className="bg-zinc-100/60 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle id="methodology-heading" className="text-base sm:text-lg font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Calculation Methodology & Evidence Provenance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <Fuel className="w-4 h-4 text-amber-600" />
                    Gasoline Consumption
                  </div>
                  <p className="text-xs">
                    Gas costs are modeled strictly as <code className="text-zinc-800 dark:text-zinc-200 font-mono">(Annual km / 100) × L/100km × Gas Price</code>. Ratings reflect official NRCan laboratory 5-cycle combined ratings.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    Wall-to-Wheel Electricity
                  </div>
                  <p className="text-xs">
                    PHEV electric draw uses wall-to-wheel kWh/100km (including 15-20% onboard charger conversion losses) rather than naive battery-side capacity, ensuring full billing accuracy.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                    Shareable Hash Permalinks
                  </div>
                  <p className="text-xs">
                    Custom driving distances, gas prices, and vehicle choices are persisted directly in the URL hash (<code className="text-zinc-800 dark:text-zinc-200 font-mono">#c=...</code>) for instant bookmarking without server tracking or cookies.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
