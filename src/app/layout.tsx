import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { KofiFloatingPill } from '@/components/common/kofi-button';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.toyotawaits.ca'),
  title: 'ToyotaWaits | Canadian Toyota Wait Times & Allocation Tracker',
  description:
    'Crowdsourced Canadian Toyota delivery timelines, waitlists, MSRP compliance, and dealer markups for RAV4, Prius Prime, Sienna, and more.',
  keywords: [
    'toyota waits',
    'toyota wait tracker',
    'toyota wait times canada',
    'canadian toyota tracker',
    'toyota allocation canada',
    'rav4 prime wait time',
  ],
  openGraph: {
    title: 'ToyotaWaits | Canadian Toyota Wait Times & Allocation Tracker',
    description:
      'Crowdsourced Canadian Toyota delivery timelines, waitlists, MSRP compliance, and dealer markups for RAV4, Prius Prime, Sienna, and more.',
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
      'Crowdsourced Canadian Toyota delivery timelines, waitlists, MSRP compliance, and dealer markups for RAV4, Prius Prime, Sienna, and more.',
    images: ['/og-image.png'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '3gM-Rt6pfp2XODYUowsn5BNJt0CIfuxUoY-9ugCPK_E',
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
      description: 'Community wait time tracker for Canadian Toyota allocations.',
    },
    {
      '@type': 'Organization',
      '@id': 'https://www.toyotawaits.ca/#organization',
      name: 'ToyotaWaits',
      url: 'https://www.toyotawaits.ca',
      description: 'Community wait time tracker for Canadian Toyota allocations.',
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
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      {/* overflow-x-clip (not hidden): clips sideways wobble without creating a scroll container, which would break position: sticky */}
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 font-sans overflow-x-clip">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main className="flex-1">
          {children}
          <Analytics />
          <SpeedInsights />
        </main>
        <KofiFloatingPill />
        <Footer />
      </body>
    </html>
  );
}
