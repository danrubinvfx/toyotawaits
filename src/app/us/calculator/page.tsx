import React from 'react';
import type { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { VehicleSavingsCalculator } from '@/components/calculator/VehicleSavingsCalculator';
import { Calculator, ShieldCheck, Fuel, Zap, HelpCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export const revalidate = 3600; // 1 hour ISR

export const metadata: Metadata = {
  metadataBase: new URL('https://toyotawaits.ca'),
  title: 'Toyota Fuel & Energy Savings Calculator (US) | ToyotaWaits',
  description:
    'Calculate real-world US fuel and electricity savings comparing Hybrid (HEV), Plug-in Hybrid (PHEV), and Gas vehicles with official EPA ratings in MPG and USD.',
  keywords: [
    'toyota savings calculator us',
    'toyota hybrid mpg savings',
    'rav4 hybrid vs gas savings us',
    'toyota phev savings usd',
    'prius prime fuel economy calculator us',
    'hybrid payback calculator miles mpg',
  ],
  alternates: {
    canonical: 'https://toyotawaits.ca/us/calculator',
  },
  openGraph: {
    title: 'Toyota Fuel & Energy Savings Calculator (US) | ToyotaWaits',
    description:
      'Compare real-world US fuel and electricity costs across Hybrid (HEV), Plug-in Hybrid (PHEV), and Gas vehicles in MPG, gallons, and USD.',
    url: 'https://toyotawaits.ca/us/calculator',
    siteName: 'ToyotaWaits',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toyota Fuel & Energy Savings Calculator (US) | ToyotaWaits',
    description:
      'Compare real-world US fuel and electricity costs across Hybrid (HEV), Plug-in Hybrid (PHEV), and Gas vehicles in MPG, gallons, and USD.',
  },
};

export default function USCalculatorPage() {
  return (
    <main className="min-h-screen pt-4 sm:pt-6 pb-20 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-8">
        {/* Navigation & Header */}
        <div className="space-y-4">
          <BackButton fallbackHref="/us" label="← Back to US Wait Time Tracker" />

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-xs font-semibold">
              <Calculator className="w-3.5 h-3.5" />
              <span>EPA-Verified Vehicle Energy Calculator</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              US Toyota Fuel & Energy Savings Calculator
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
              Compare actual annual gasoline and electricity operating costs between your current vehicle and a new Toyota Hybrid (HEV) or Plug-in Hybrid (PHEV). Powered by official US EPA fuel economy ratings in MPG and USD.
            </p>
          </div>
        </div>

        {/* Client-Side Interactive Calculator */}
        <section aria-label="Interactive Savings Calculator (US)">
          <VehicleSavingsCalculator initialUnitSystem="IMPERIAL" />
        </section>

        {/* Methodology & Provenance Disclosure */}
        <section aria-labelledby="methodology-heading" className="pt-4">
          <Card className="bg-zinc-100/60 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle id="methodology-heading" className="text-lg font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Calculation Methodology & EPA Evidence Provenance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <Fuel className="w-4 h-4 text-amber-600" />
                    Gasoline Consumption (MPG)
                  </div>
                  <p className="text-xs">
                    Gas costs are modeled strictly as <code className="text-zinc-800 dark:text-zinc-200 font-mono">(Annual Miles / Combined MPG) × Gas Price ($/gal)</code>. Ratings reflect official US EPA window sticker ratings.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    PHEV Dual-Fuel Operating Costs
                  </div>
                  <p className="text-xs">
                    PHEV models split annual miles into electric and hybrid modes based on charging availability. Electric consumption uses official EPA kWh/100mi ratings with local electricity rates ($/kWh).
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-red-600" />
                    Scope & Exclusions
                  </div>
                  <p className="text-xs">
                    Calculations reflect net energy and direct cash outlays. Financing interest, sales taxes, auto insurance variations, and residual depreciation are excluded from baseline calculations.
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
