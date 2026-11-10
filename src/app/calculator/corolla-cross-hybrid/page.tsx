import React from 'react';
import type { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { VehicleSavingsCalculator } from '@/components/calculator/VehicleSavingsCalculator';
import { StaticEnergyTable } from '@/components/calculator/StaticEnergyTable';
import { CalculatorNewsWire } from '@/components/news/CalculatorNewsWire';
import { CalculatorGearCards } from '@/components/gear/CalculatorGearCards';
import { Calculator, ShieldCheck, Fuel, Zap, HelpCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export const dynamic = 'force-dynamic';
export const { instant } = { instant: false };

export const metadata: Metadata = {
  metadataBase: new URL('https://www.toyotawaits.ca'),
  title: 'Toyota Corolla Cross Hybrid Fuel Savings & Payback Calculator (2026–2027 Canada) | ToyotaWaits',
  description:
    'Calculate break-even mileage and annual gas savings for the Corolla Cross Hybrid vs Gas in Canada. Factoring in BC, Ontario, and Alberta pump prices.',
  keywords: [
    'corolla cross hybrid vs gas savings canada',
    'corolla cross payback calculator',
    'toyota corolla cross hybrid fuel economy canada',
    'corolla cross hybrid break even timeline',
    'toyota corolla cross canada gas prices',
  ],
  alternates: {
    canonical: 'https://www.toyotawaits.ca/calculator/corolla-cross-hybrid',
  },
  openGraph: {
    title: 'Toyota Corolla Cross Hybrid Fuel Savings & Payback Calculator (2026–2027 Canada) | ToyotaWaits',
    description:
      'Calculate break-even mileage and annual gas savings for the Corolla Cross Hybrid vs Gas in Canada. Factoring in BC, Ontario, and Alberta pump prices.',
    url: 'https://www.toyotawaits.ca/calculator/corolla-cross-hybrid',
    siteName: 'ToyotaWaits.ca',
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toyota Corolla Cross Hybrid Fuel Savings & Payback Calculator (2026–2027 Canada) | ToyotaWaits',
    description:
      'Calculate break-even mileage and annual gas savings for the Corolla Cross Hybrid vs Gas in Canada. Factoring in BC, Ontario, and Alberta pump prices.',
  },
};

export default function CorollaCrossHybridCalculatorPage() {
  return (
    <main className="min-h-screen pt-4 sm:pt-6 pb-20 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-8">
        {/* Navigation & Header */}
        <div className="space-y-4">
          <BackButton fallbackHref="/wait-times/corolla-cross" label="← Back to Corolla Cross Wait Tracker" />

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-xs font-semibold">
              <Calculator className="w-3.5 h-3.5" />
              <span>Corolla Cross Hybrid Savings &amp; Payback</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Toyota Corolla Cross Hybrid Fuel Savings &amp; Payback Calculator
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
              Compare actual annual fuel costs between a 2026 Toyota Corolla Cross Gas AWD (7.4 L/100km) and a 2026 Toyota Corolla Cross Hybrid AWD (5.3 L/100km combined). Pre-configured with Canadian provincial gas prices and historical factory queue wait times.
            </p>
          </div>
        </div>

        {/* News Wire Announcement Ticker */}
        <CalculatorNewsWire activeModel="corolla-cross" />

        {/* Client-Side Interactive Calculator with Pre-seeded Corolla Cross Hybrid */}
        <section aria-label="Interactive Savings Calculator">
          <VehicleSavingsCalculator
            initialTargetPresetId="corolla-cross-hybrid"
            initialCurrentArchetypeId="archetype-compact-crossover-awd"
          />
        </section>

        {/* Recommended Products */}
        <div className="pt-2 sm:pt-4">
          <CalculatorGearCards activeModel="corolla-cross" />
        </div>

        {/* Pre-rendered Static Benchmark Table for SEO & No-JS Fallback */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <StaticEnergyTable />
        </div>

        {/* Methodology & Provenance Disclosure */}
        <section aria-labelledby="methodology-heading" className="pt-4">
          <Card className="bg-zinc-100/60 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle id="methodology-heading" as="h2" className="text-lg font-bold flex items-center gap-2">
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
                    Gas costs are modeled strictly as <code className="text-zinc-800 dark:text-zinc-200 font-mono">(Annual km / 100) × L/100km × Gas Price</code>. Ratings reflect official NRCan laboratory 5-cycle combined ratings (5.3 L/100km for Hybrid AWD vs. 7.4 L/100km for Gas AWD).
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    Waiting Opportunity Cost
                  </div>
                  <p className="text-xs">
                    Calculates the extra gasoline expenditure incurred while driving your current vehicle during the verified Canadian wait period for Corolla Cross Hybrid delivery (270 days median).
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                    Shareable Hash Permalinks
                  </div>
                  <p className="text-xs">
                    Custom driving distances, gas prices, and trade-in outlays are saved directly into your URL hash (<code className="text-zinc-800 dark:text-zinc-200 font-mono">#c=...</code>) for instant bookmarking without server tracking or cookies.
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
