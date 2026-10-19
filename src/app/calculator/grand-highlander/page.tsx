import React from 'react';
import type { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { VehicleSavingsCalculator } from '@/components/calculator/VehicleSavingsCalculator';
import { StaticEnergyTable } from '@/components/calculator/StaticEnergyTable';
import { Calculator, ShieldCheck, Fuel, Zap, HelpCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export const revalidate = 3600; // 1 hour ISR

export const metadata: Metadata = {
  metadataBase: new URL('https://toyotawaits.ca'),
  title: 'Toyota Grand Highlander Hybrid Savings Calculator | ToyotaWaits',
  description:
    'Calculate real-world Canadian fuel savings comparing the 2025 Toyota Grand Highlander Hybrid (7.0 L/100km) against an 11.5 L/100km 3-row gas SUV baseline.',
  keywords: [
    'toyota grand highlander hybrid fuel savings',
    'grand highlander hybrid vs gas suv canada',
    'grand highlander hybrid fuel economy calculator',
    'grand highlander hybrid payback period',
    'toyota 3-row hybrid suv savings canada',
  ],
  alternates: {
    canonical: 'https://toyotawaits.ca/calculator/grand-highlander',
  },
  openGraph: {
    title: 'Toyota Grand Highlander Hybrid Savings Calculator | ToyotaWaits',
    description:
      'Compare 2025 Toyota Grand Highlander Hybrid (7.0 L/100km) against an 11.5 L/100km 3-row gas SUV with verified NRCan ratings and delivery wait times.',
    url: 'https://toyotawaits.ca/calculator/grand-highlander',
    siteName: 'ToyotaWaits.ca',
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toyota Grand Highlander Hybrid Savings Calculator | ToyotaWaits',
    description:
      'Compare 2025 Toyota Grand Highlander Hybrid (7.0 L/100km) against an 11.5 L/100km 3-row gas SUV with verified NRCan ratings and delivery wait times.',
  },
};

export default function GrandHighlanderCalculatorPage() {
  return (
    <main className="min-h-screen pt-4 sm:pt-6 pb-20 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-8">
        {/* Navigation & Header */}
        <div className="space-y-4">
          <BackButton fallbackHref="/grand-highlander" label="← Back to Grand Highlander Wait Tracker" />

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-xs font-semibold">
              <Calculator className="w-3.5 h-3.5" />
              <span>Grand Highlander Hybrid Savings</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Toyota Grand Highlander Hybrid Savings Calculator
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
              Compare actual annual fuel costs between a typical 3.5L V6 3-row gas crossover (11.5 L/100km) and a 2025 Toyota Grand Highlander Hybrid AWD (7.0 L/100km combined). See how much you save on daily family driving and road trips.
            </p>
          </div>
        </div>

        {/* Client-Side Interactive Calculator with Pre-seeded Grand Highlander Hybrid */}
        <section aria-label="Interactive Savings Calculator">
          <VehicleSavingsCalculator
            initialTargetPresetId="2025-toyota-grand-highlander-hybrid"
            initialCurrentMode="CUSTOM"
            initialCustomL100km={11.5}
          />
        </section>

        {/* Pre-rendered Static Benchmark Table for SEO & No-JS Fallback */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <StaticEnergyTable />
        </div>

        {/* Methodology & Provenance Disclosure */}
        <section aria-labelledby="methodology-heading" className="pt-4">
          <Card className="bg-zinc-100/60 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle id="methodology-heading" className="text-lg font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Calculation Methodology &amp; Evidence Provenance
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
                    Waiting Opportunity Cost
                  </div>
                  <p className="text-xs">
                    High Canadian demand for 3-row family hybrids creates extended wait periods. Calculate the fuel cost of waiting for your Grand Highlander Hybrid delivery.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                    Shareable Hash Permalinks
                  </div>
                  <p className="text-xs">
                    All inputs are preserved directly in the URL hash (<code className="text-zinc-800 dark:text-zinc-200 font-mono">#c=...</code>) for bookmarking and easy sharing without tracking cookies.
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
