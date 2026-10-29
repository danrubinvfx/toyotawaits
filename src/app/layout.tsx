import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AnalyticsWrapper } from '@/components/analytics/AnalyticsWrapper';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { KofiFloatingPill } from '@/components/common/kofi-button';
import { MarketProvider } from '@/context/MarketContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.toyotawaits.ca'),
  title: 'ToyotaWaits | Canadian Toyota Wait Times & Allocation Tracker',
  description:
    'Crowdsourced Canadian Toyota delivery timelines, waitlists, MSRP compliance, and dealer markups for RAV4, Prius Prime, Sienna, and more (covering US and Canada).',
  keywords: [
    'toyota waits',
    'toyota wait tracker',
    'toyota wait times canada',
    'canadian toyota tracker',
    'toyota allocation canada',
    'rav4 prime wait time',
  ],
  alternates: {
    canonical: 'https://www.toyotawaits.ca',
  },
  openGraph: {
    title: 'ToyotaWaits | Canadian Toyota Wait Times & Allocation Tracker',
    description:
      'Crowdsourced Canadian Toyota delivery timelines, waitlists, MSRP compliance, and dealer markups for RAV4, Prius Prime, Sienna, and more (covering US and Canada).',
    url: 'https://www.toyotawaits.ca',
    siteName: 'ToyotaWaits',
    locale: 'en_CA',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ToyotaWaits.ca - Canadian Toyota Wait Times & Allocation Tracker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToyotaWaits | Canadian Toyota Wait Times & Allocation Tracker',
    description:
      'Crowdsourced Canadian Toyota delivery timelines, waitlists, MSRP compliance, and dealer markups for RAV4, Prius Prime, Sienna, and more (covering US and Canada).',
    images: ['/og-image.png'],
  },
  verification: {
    google:
      process.env.GOOGLE_SITE_VERIFICATION ||
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      '3gM-Rt6pfp2XODYUowsn5BNJt0CIfuxUoY-9ugCPK_E',
  },
};

export const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://www.toyotawaits.ca/#webapp',
      name: 'ToyotaWaits',
      url: 'https://www.toyotawaits.ca',
      applicationCategory: 'AutomotiveApplication',
      operatingSystem: 'All',
      description:
        'Crowd-sourced Toyota delivery wait-time tracker and public inventory discovery tool for Canada.',
    },
    {
      '@type': 'AutoDealer',
      '@id': 'https://www.toyotawaits.ca/#autodealer',
      name: 'Toyota Dealer Network - Metro Vancouver & Canada',
      url: 'https://www.toyotawaits.ca/inventory',
      description:
        'Public observed inventory and factory allocation tracking for Canadian Toyota dealerships.',
    },
    {
      '@type': 'Organization',
      '@id': 'https://www.toyotawaits.ca/#organization',
      name: 'ToyotaWaits',
      url: 'https://www.toyotawaits.ca',
      description:
        'Crowd-sourced Toyota delivery wait-time tracker and public inventory discovery tool for Canada.',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-CA"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      {/* overflow-x-clip (not hidden): clips sideways wobble without creating a scroll container, which would break position: sticky */}
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 font-sans overflow-x-clip">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <MarketProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <KofiFloatingPill />
          <Footer />
        </MarketProvider>
        <AnalyticsWrapper />
      </body>
    </html>
  );
}
