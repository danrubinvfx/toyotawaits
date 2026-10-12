import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { WinterPrepView } from '@/components/winter-prep/winter-prep-view';

export const metadata: Metadata = {
  metadataBase: new URL('https://toyotawaits.ca'),
  title: 'Canadian Winter Delivery & Prep Guide | ToyotaWaits.ca',
  description:
    'Model-by-model winter survival advice for Canadian Toyota owners: 12V hybrid jump procedures, salt defense liners, and cold-weather gear.',
  keywords: [
    'toyota winter prep canada',
    'toyota hybrid cold weather start',
    'toyota 12v jump point',
    'rav4 hybrid winter floor mats',
    'tuxmat hybrid battery vent clearance',
    'canadian toyota cold start',
    'prius prime sub zero heating',
  ],
  alternates: {
    canonical: '/winter-prep',
  },
  openGraph: {
    title: 'Canadian Winter Delivery & Prep Guide | ToyotaWaits.ca',
    description:
      'Model-by-model winter survival advice for Canadian Toyota owners: 12V hybrid jump procedures, salt defense liners, and cold-weather gear.',
    url: 'https://toyotawaits.ca/winter-prep',
    siteName: 'ToyotaWaits.ca',
    locale: 'en_CA',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Canadian Winter Delivery & Prep Guide | ToyotaWaits.ca',
    description:
      'Model-by-model winter survival advice for Canadian Toyota owners: 12V hybrid jump procedures, salt defense liners, and cold-weather gear.',
  },
};

export default function WinterPrepPage() {
  return (
    <main className="min-h-screen pt-4 sm:pt-6">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-amber-400 mb-4 transition-colors"
        >
          ← Back to Wait Time Tracker
        </Link>
      </div>
      <WinterPrepView />
    </main>
  );
}
