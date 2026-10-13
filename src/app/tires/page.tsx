import React from 'react';
import type { Metadata } from 'next';
import { TireCatalog } from '@/components/tires/tire-catalog';
import { BackButton } from '@/components/common/back-button';

export const metadata: Metadata = {
  metadataBase: new URL('https://toyotawaits.ca'),
  title: 'Canadian Toyota Tire Guide: Winter & All-Weather Recommendations | ToyotaWaits.ca',
  description:
    'Factory tire sizes, Canadian winter reviews (3PMSF), and curated Amazon.ca links for RAV4, Sienna, Grand Highlander, Prius, and Land Cruiser.',
  keywords: [
    'toyota winter tires canada',
    'toyota all-weather tires 3pmsf',
    'rav4 prime winter tire size',
    'sienna winter tires',
    'grand highlander winter tires',
    'prius prime winter tire downsizing',
    'land cruiser 250 winter tires',
    'michelin x-ice snow rav4',
    'bridgestone blizzak ws90 canada',
    'michelin crossclimate 2 hybrid',
  ],
  alternates: {
    canonical: 'https://toyotawaits.ca/tires',
  },
  openGraph: {
    title: 'Canadian Toyota Tire Guide: Winter & All-Weather Recommendations | ToyotaWaits.ca',
    description:
      'Factory tire sizes, Canadian winter reviews (3PMSF), and curated Amazon.ca links for RAV4, Sienna, Grand Highlander, Prius, and Land Cruiser.',
    url: 'https://toyotawaits.ca/tires',
    siteName: 'ToyotaWaits.ca',
    locale: 'en_CA',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Canadian Toyota Tire Guide: Winter & All-Weather Recommendations | ToyotaWaits.ca',
    description:
      'Factory tire sizes, Canadian winter reviews (3PMSF), and curated Amazon.ca links for RAV4, Sienna, Grand Highlander, Prius, and Land Cruiser.',
  },
};

export default function TiresPage() {
  return (
    <main className="min-h-screen pt-4 sm:pt-6">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <BackButton className="mb-4" />
      </div>
      <TireCatalog />
    </main>
  );
}
