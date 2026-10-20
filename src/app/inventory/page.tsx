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

import { VehicleListingCardProps } from '@/components/discovery/VehicleListingCard';

export interface InventoryPageProps {
  searchParams?:
    | Promise<{ [key: string]: string | string[] | undefined }>
    | { [key: string]: string | string[] | undefined };
  initialListings?: VehicleListingCardProps[];
}

function parsePreviewParam(
  searchParams?:
    | Promise<{ [key: string]: string | string[] | undefined }>
    | { [key: string]: string | string[] | undefined }
): boolean {
  if (!searchParams) return false;
  if (typeof (searchParams as any).then !== 'function') {
    const sp = searchParams as { [key: string]: string | string[] | undefined };
    return (
      sp?.preview === 'true' ||
      (Array.isArray(sp?.preview) && sp.preview.includes('true'))
    );
  }
  const maybeObj = (searchParams as any).value ?? (searchParams as any)._value;
  if (maybeObj) {
    return (
      maybeObj.preview === 'true' ||
      (Array.isArray(maybeObj.preview) && maybeObj.preview.includes('true'))
    );
  }
  return false;
}

function parseModelParam(
  searchParams?:
    | Promise<{ [key: string]: string | string[] | undefined }>
    | { [key: string]: string | string[] | undefined }
): string | undefined {
  if (!searchParams) return undefined;
  if (typeof (searchParams as any).then !== 'function') {
    const sp = searchParams as { [key: string]: string | string[] | undefined };
    if (typeof sp?.model === 'string') return sp.model;
    if (Array.isArray(sp?.model) && sp.model.length > 0) return sp.model[0];
  }
  const maybeObj = (searchParams as any).value ?? (searchParams as any)._value;
  if (maybeObj) {
    if (typeof maybeObj.model === 'string') return maybeObj.model;
    if (Array.isArray(maybeObj.model) && maybeObj.model.length > 0) return maybeObj.model[0];
  }
  return undefined;
}

export default function InventoryPage({ searchParams, initialListings }: InventoryPageProps = {}) {
  // Extract preview query parameter and initial model filter from searchParams
  const isPreviewParam = parsePreviewParam(searchParams);
  const initialModel = parseModelParam(searchParams);


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
      className="min-h-screen bg-zinc-950 text-zinc-100 py-3 sm:py-5 px-3 sm:px-6 lg:px-8 pb-16 sm:pb-12 selection:bg-red-500 selection:text-white"
    >
      <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4">
        {/* Compact Single-Unit Header */}
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5 sm:pb-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition shrink-0"
              aria-label="Back to wait-time tracker"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Back to Tracker</span>
              <span className="sm:hidden">Tracker</span>
            </Link>

            <span className="text-zinc-700 hidden sm:inline" aria-hidden="true">•</span>

            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-tight">
              Toyota Public Inventory
            </h1>

            <span
              data-testid="unconfirmed-feed-badge"
              className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-amber-400/90 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded-full"
            >
              <AlertTriangle className="h-3 w-3 shrink-0 text-amber-400" aria-hidden="true" />
              <span>Unconfirmed Dealer Feed</span>
            </span>
          </div>

          <Badge
            variant="outline"
            className="bg-red-950/50 text-red-400 border-red-800 text-[10px] font-mono hidden sm:inline-flex"
          >
            Pilot
          </Badge>
        </header>

        {/* Interactive Explorer Client Component */}
        <Suspense fallback={<div className="h-48 rounded-xl bg-zinc-900/60 border border-zinc-800 animate-pulse" />}>
          <InventoryExplorer initialListings={initialListings} initialModel={initialModel} />
        </Suspense>

        {/* Footer Disclaimer & Transparency Notice */}
        <footer className="mt-8 pt-4 border-t border-zinc-800/80 text-[11px] text-zinc-500 space-y-1.5">
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
