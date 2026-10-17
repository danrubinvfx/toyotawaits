import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { InventoryExplorer } from '@/components/discovery/InventoryExplorer';
import { AlertTriangle, ShieldCheck, ArrowLeft, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dealer Inventory Discovery (Pilot) | ToyotaWaits.ca',
  description:
    'Polite, unauthenticated public inventory discovery pilot for Canadian Toyota dealerships. Transparent pricing and availability evidence without web scraping bypasses.',
  alternates: {
    canonical: 'https://toyotawaits.ca/inventory',
  },
};

export interface InventoryPageProps {
  searchParams?:
    | Promise<{ [key: string]: string | string[] | undefined }>
    | { [key: string]: string | string[] | undefined };
}

export default function InventoryPage({ searchParams }: InventoryPageProps = {}) {
  // Extract preview query parameter from searchParams (supporting both sync and Promise)
  let isPreviewParam = false;
  if (searchParams) {
    if (typeof (searchParams as any).then === 'function') {
      try {
        const resolved = React.use(
          searchParams as Promise<{ [key: string]: string | string[] | undefined }>
        );
        isPreviewParam =
          resolved?.preview === 'true' ||
          (Array.isArray(resolved?.preview) && resolved.preview.includes('true'));
      } catch {
        // Fallback for environments where React.use is unavailable
      }
    } else {
      const sp = searchParams as { [key: string]: string | string[] | undefined };
      isPreviewParam =
        sp?.preview === 'true' ||
        (Array.isArray(sp?.preview) && sp.preview.includes('true'));
    }
  }

  // Feature Flag: Enable if explicitly configured, running in Vercel preview, or preview query override is present
  const isFeatureEnabled =
    process.env.NEXT_PUBLIC_ENABLE_INVENTORY_DISCOVERY === 'true' ||
    process.env.ENABLE_INVENTORY_DISCOVERY === 'true' ||
    process.env.VERCEL_ENV === 'preview' ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' ||
    isPreviewParam;

  if (!isFeatureEnabled) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
        <div
          data-testid="inventory-disabled-screen"
          className="max-w-md w-full rounded-2xl border border-zinc-800 bg-zinc-900/90 p-8 text-center space-y-4 shadow-xl backdrop-blur-md"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-950/80 text-amber-400 border border-amber-900/60">
            <Lock className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Inventory Discovery (Private Pilot)
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The ToyotaWaits.ca public inventory explorer is currently in private trial mode under Master Plan V3.2. Automated polite sweeps are validating dealer endpoints.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Return to Wait Time Tracker</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      data-testid="inventory-page-main"
      className="min-h-screen bg-zinc-950 text-zinc-100 py-8 px-4 sm:px-6 lg:px-8 selection:bg-red-500 selection:text-white"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation & Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to Wait-Time Tracker</span>
          </Link>
          <Badge
            variant="outline"
            className="bg-red-950/50 text-red-400 border-red-800 text-[11px] font-mono"
          >
            Master Plan V3.2 Pilot
          </Badge>
        </div>

        {/* Page Hero */}
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-800/80 bg-amber-950/40 px-3 py-1 text-xs text-amber-300">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="font-semibold">
              Public Observation Feed — Physical Availability NOT Confirmed With Dealer
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Toyota Public Inventory Explorer
          </h1>
          <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">
            Real-time public dealer inventory observed across validated dealer feeds. We enforce epistemic honesty: all listings reflect public website declarations. Availability and mandatory dealer fees must be verified directly with dealer staff.
          </p>
        </header>

        {/* Interactive Explorer Client Component */}
        <Suspense fallback={<div className="h-64 rounded-xl bg-zinc-900/60 border border-zinc-800 animate-pulse" />}>
          <InventoryExplorer />
        </Suspense>

        {/* Footer Disclaimer & CASL Notice */}
        <footer className="mt-12 pt-6 border-t border-zinc-800/80 text-xs text-zinc-500 space-y-2">
          <p>
            <strong>Epistemic Honesty Guarantee:</strong> ToyotaWaits.ca is an independent community tracker. We do not sell vehicles, receive allocation kickbacks, or synthesize unconfirmed vehicle data.
          </p>
          <p>
            Zero-PII Canadian Automotive Analytics &bull; Inquiries: <a href="mailto:support@toyotawaits.ca" className="underline hover:text-zinc-300">support@toyotawaits.ca</a>
          </p>
        </footer>
      </div>
    </main>
  );
}
