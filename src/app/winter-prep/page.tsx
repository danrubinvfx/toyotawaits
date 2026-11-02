import React from 'react';
import type { Metadata } from 'next';
import { WinterPrepView } from '@/components/winter-prep/winter-prep-view';
import { BackButton } from '@/components/common/back-button';
import { GuideDisclaimer } from '@/components/common/GuideDisclaimer';

export const revalidate = 60;

export const metadata: Metadata = {
  metadataBase: new URL('https://www.toyotawaits.ca'),
  title: 'Canadian Toyota Winter Prep Guide (2026/2027) | Battery, Liners & Tire Mandates',
  description:
    'Essential winter prep for Canadian Toyota owners: BC highway tire laws, Quebec Dec 1 deadlines, hybrid 12V AGM auxiliary battery care, and laser-fit liners.',
  keywords: [
    'canadian toyota winter prep guide 2026 2027',
    'bc highway tire laws winter 3pmsf',
    'quebec dec 1 winter tire deadline',
    'hybrid 12v agm auxiliary battery care',
    'toyota hybrid cold weather start',
    'toyota 12v jump point fuse box',
    'rav4 hybrid winter floor mats tuxmat',
    'tuxmat hybrid battery vent clearance',
    'prius prime sub zero heat pump',
  ],
  alternates: {
    canonical: 'https://www.toyotawaits.ca/winter-prep',
  },
  openGraph: {
    title: 'Canadian Toyota Winter Prep Guide (2026/2027) | Battery, Liners & Tire Mandates',
    description:
      'Essential winter prep for Canadian Toyota owners: BC highway tire laws, Quebec Dec 1 deadlines, hybrid 12V AGM auxiliary battery care, and laser-fit liners.',
    url: 'https://www.toyotawaits.ca/winter-prep',
    siteName: 'ToyotaWaits.ca',
    locale: 'en_CA',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Canadian Toyota Winter Prep Guide (2026/2027) | Battery, Liners & Tire Mandates',
    description:
      'Essential winter prep for Canadian Toyota owners: BC highway tire laws, Quebec Dec 1 deadlines, hybrid 12V AGM auxiliary battery care, and laser-fit liners.',
  },
};

export default function WinterPrepPage() {
  return (
    <main className="min-h-screen pt-4 sm:pt-6">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <BackButton className="mb-4" />
      </div>
      <WinterPrepView />
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 pt-8 pb-16">
        <GuideDisclaimer />
      </div>
    </main>
  );
}
