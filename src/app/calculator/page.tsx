import React from 'react';
import type { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { VehicleSavingsCalculator } from '@/components/calculator/VehicleSavingsCalculator';
import { StaticEnergyTable } from '@/components/calculator/StaticEnergyTable';
import { CalculatorNewsWire } from '@/components/news/CalculatorNewsWire';
import { CalculatorGearCards } from '@/components/gear/CalculatorGearCards';
import { ShieldCheck, Fuel, Zap, HelpCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export const revalidate = 3600; // 1 hour ISR

export const metadata: Metadata = {
  metadataBase: new URL('https://toyotawaits.ca'),
  title: 'Toyota Hybrid Fuel Savings & Payback Calculator (Canada & US) | ToyotaWaits',
  description:
    'Calculate real annual gas savings and break-even payback timelines for Toyota Hybrid (HEV) and Plug-in Hybrid (PHEV) models using official NRCan & EPA ratings.',
  keywords: [
    'toyota savings calculator',
    'toyota hybrid fuel savings canada',
    'toyota hybrid payback calculator',
    'rav4 hybrid vs gas savings',
    'phev electricity vs gas cost canada',
    'canadian ev payback calculator',
    'prius prime fuel economy calculator',
    'toyota wait times canada savings',
  ],
  alternates: {
    canonical: 'https://toyotawaits.ca/calculator',
  },
  openGraph: {
    title: 'Toyota Hybrid Fuel Savings & Payback Calculator (Canada & US) | ToyotaWaits',
    description:
      'Calculate real annual gas savings and break-even payback timelines for Toyota Hybrid (HEV) and Plug-in Hybrid (PHEV) models using official NRCan & EPA ratings.',
    url: 'https://toyotawaits.ca/calculator',
    siteName: 'ToyotaWaits.ca',
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toyota Hybrid Fuel Savings & Payback Calculator (Canada & US) | ToyotaWaits',
    description:
      'Calculate real annual gas savings and break-even payback timelines for Toyota Hybrid (HEV) and Plug-in Hybrid (PHEV) models using official NRCan & EPA ratings.',
  },
};

const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Toyota Hybrid Fuel Savings & Payback Calculator',
  url: 'https://toyotawaits.ca/calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'CAD',
  },
};

const faqPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much money does a Toyota Hybrid save per year?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A Toyota Hybrid typically saves between $1,200 and $2,400 CAD (or $900 to $1,800 USD) per year in fuel costs compared to a conventional gas-powered vehicle driven 20,000 km (12,000 miles) annually, depending on local fuel prices and vehicle class.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take for a Toyota Hybrid to pay for itself?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For most drivers purchasing a new Toyota Hybrid over a comparable gas model, the upfront purchase premium is recovered through fuel savings in approximately 2 to 4 years post-delivery. When keeping an existing paid-off vehicle vs. buying new, payback timelines range from 5 to 7+ years depending on trade-in value.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does electricity cost compare to gasoline for Toyota PHEVs?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'At average Canadian residential electricity rates ($0.14/kWh) and $1.75/L gasoline, driving a Toyota PHEV (like the RAV4 Prime) in EV mode costs approximately $2.80 CAD per 100 km, compared to over $10.15 CAD per 100 km on gasoline—a savings of over 70% per electric kilometer.',
      },
    },
  ],
};

export default function CalculatorPage() {
  return (
    <main className="min-h-screen pt-4 sm:pt-6 pb-20 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      {/* Machine-Readable JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />

      <div className="container mx-auto max-w-6xl px-3 sm:px-6 space-y-4 sm:space-y-6">
        {/* Navigation & Clean Header */}
        <div className="space-y-2 sm:space-y-3">
          <BackButton fallbackHref="/" label="← Back to Wait Time Tracker" />

          <div>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Toyota Fuel Savings & Payback Calculator
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 sm:mt-1">
              Compare actual annual fuel and electricity costs across Toyota Hybrid (HEV), Plug-in Hybrid (PHEV), and Gas models using official NRCan & EPA ratings.
            </p>
          </div>
        </div>

        {/* News Wire Announcement Ticker mounted directly beneath the header and above cockpit */}
        <CalculatorNewsWire />

        {/* Client-Side Interactive Calculator Cockpit */}
        <section aria-label="Interactive Savings Calculator">
          <VehicleSavingsCalculator />
        </section>

        {/* Recommended Products Section placed below the calculator cockpit and collapsed outlay drawer */}
        <div className="pt-2 sm:pt-4">
          <CalculatorGearCards />
        </div>

        {/* Pre-rendered Static Benchmark Table for SEO & No-JS Fallback */}
        <div className="pt-6 sm:pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <StaticEnergyTable />
        </div>

        {/* Methodology & Provenance Disclosure */}
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
