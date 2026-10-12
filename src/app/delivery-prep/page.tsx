import React from 'react';
import type { Metadata } from 'next';
import { BackButton } from '@/components/common/back-button';
import { PickupChecklist } from '@/components/delivery-prep/pickup-checklist';
import { PrintButton } from '@/components/delivery-prep/print-button';
import { ShieldCheck, Car, KeyRound, Wrench } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  metadataBase: new URL('https://toyotawaits.ca'),
  title: 'Canadian Dealership Pickup Day Checklist & PDI Audit | ToyotaWaits.ca',
  description:
    'Comprehensive Canadian Toyota delivery day inspection checklist: bill of sale verification, PDI suspension shipping spacer removal, key fob count audits, and hybrid battery intake checks.',
  keywords: [
    'toyota delivery day checklist',
    'toyota pickup day inspection',
    'toyota pdi shipping spacers',
    'toyota smart key shortage canada',
    'rav4 hybrid pickup inspection',
    'toyota bill of sale omvic amvic',
    'canadian toyota delivery checklist',
  ],
  alternates: {
    canonical: '/delivery-prep',
  },
  openGraph: {
    title: 'Canadian Dealership Pickup Day Checklist & PDI Audit | ToyotaWaits.ca',
    description:
      'Comprehensive Canadian Toyota delivery day inspection checklist: bill of sale verification, PDI suspension shipping spacer removal, key fob count audits, and hybrid battery intake checks.',
    url: 'https://toyotawaits.ca/delivery-prep',
    siteName: 'ToyotaWaits.ca',
    locale: 'en_CA',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Canadian Dealership Pickup Day Checklist & PDI Audit | ToyotaWaits.ca',
    description:
      'Comprehensive Canadian Toyota delivery day inspection checklist: bill of sale verification, PDI suspension shipping spacer removal, key fob count audits, and hybrid battery intake checks.',
  },
};

export default function DeliveryPrepPage() {
  return (
    <main className="min-h-screen pt-4 sm:pt-6 pb-16">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 space-y-6">
        <BackButton className="mb-2" />

        {/* Page Hero */}
        <div className="border border-zinc-800 rounded-2xl bg-gradient-to-br from-zinc-900/90 to-zinc-950/80 p-5 sm:p-7 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Pickup Day Inspection</span>
                <span className="text-zinc-600">•</span>
                <span>Pre-Delivery Audit</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Dealership Pickup Day Checklist
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
                Step-by-step pre-delivery inspection checkpoints to review before handing over certified funds
                or signing your final vehicle handover acceptance.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 print:hidden">
              <PrintButton />
            </div>
          </div>

          {/* Quick Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-zinc-800/80 text-xs">
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800/60">
              <Car className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-zinc-200">Inspect In Bright Daylight</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Always inspect paint, rocker panels, and glass outdoors—never under dim delivery-bay lights.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800/60">
              <Wrench className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-zinc-200">Audit PDI Transport Spacers</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Check front and rear coil struts to ensure plastic shipping blocks were removed by dealer tech.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800/60">
              <KeyRound className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-zinc-200">Secure Key Allocation IOU</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  If delivering with 1 smart key due to microchip shortages, demand an official Toyota 2nd key IOU voucher in writing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Checklist Component */}
        <section className="space-y-4">
          <PickupChecklist defaultOpen={true} />
        </section>

        {/* Additional Guides Link */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400 print:hidden">
          <div>
            <p className="font-semibold text-zinc-200">Preparing for cold-weather delivery or drop-in upgrades?</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Explore our model-by-model winter survival guides and drop-in accessories.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/winter-prep"
              className="px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-semibold transition-colors"
            >
              Winter Prep Guide ❄️
            </Link>
            <Link
              href="/#gear"
              className="px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-semibold transition-colors"
            >
              Essential Gear 🛡️
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
