import type { Metadata, Viewport } from 'next';
import React, { Suspense } from 'react';
import { cookies } from 'next/headers';
import { Geist, Geist_Mono } from 'next/font/google';
import { AnalyticsWrapper } from '@/components/analytics/AnalyticsWrapper';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WSJCalloutBanner } from '@/components/news/WSJCalloutBanner';
import { KofiFloatingPill } from '@/components/common/kofi-button';
import { MarketProvider } from '@/context/MarketContext';
import { MobileBottomDock } from '@/components/layout/MobileBottomDock';
import { MobileStickyLogBar } from '@/components/layout/MobileStickyLogBar';
import { getRequestMarketMetadata } from '@/lib/seo/host-metadata';
import { FlagValues } from 'flags/react';
import { evaluateFlagSafely, mobileStickyLogBar } from '@/flags';

// Geist is a variable font: a single file covers every weight (incl. font-black used site-wide),
// so no explicit `weight` list is needed. Preloading is disabled to stop the
// "preloaded but not used within a few seconds" warnings; `swap` keeps text visible meanwhile.
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: false,
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

export async function generateMetadata(): Promise<Metadata> {
  const { isUS, baseUrl, alternatesLanguages } = await getRequestMarketMetadata('/');
  const verification = {
    google:
      process.env.GOOGLE_SITE_VERIFICATION ||
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      '3gM-Rt6pfp2XODYUowsn5BNJt0CIfuxUoY-9ugCPK_E',
  };

  if (isUS) {
    const title = 'Toyota Wait Times & Dealer Markup Tracker (2026–2027) | ToyotaWaits';
    const description =
      'Track real crowdsourced Toyota allocation transit timelines, wait times, and Additional Dealer Markups (ADM) across the United States.';
    const canonical = `${baseUrl}/`;

    return {
      metadataBase: new URL(baseUrl),
      title,
      description,
      keywords: [
        'toyota waits',
        'toyota wait tracker',
        'toyota wait times usa',
        'toyota dealer markup tracker',
        'toyota allocation tracker',
        'rav4 hybrid wait time',
      ],
      alternates: {
        canonical,
        languages: alternatesLanguages,
      },
      openGraph: {
        title,
        description,
        url: canonical,
        siteName: 'ToyotaWaits',
        locale: 'en_US',
        type: 'website',
        images: [
          {
            url: '/og-image.png',
            width: 1200,
            height: 630,
            alt: 'ToyotaWaits - US Toyota Wait Times & Dealer Markup Tracker',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ['/og-image.png'],
      },
      verification,
    };
  }

  return {
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
      canonical: 'https://www.toyotawaits.ca/',
      languages: alternatesLanguages,
    },
    openGraph: {
      title: 'ToyotaWaits | Canadian Toyota Wait Times & Allocation Tracker',
      description:
        'Crowdsourced Canadian Toyota delivery timelines, waitlists, MSRP compliance, and dealer markups for RAV4, Prius Prime, Sienna, and more (covering US and Canada).',
      url: 'https://www.toyotawaits.ca/',
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
    verification,
  };
}

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

function buildRootJsonLd(isUS: boolean) {
  if (!isUS) return jsonLd;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://www.toyotawaits.com/#webapp',
        name: 'ToyotaWaits',
        url: 'https://www.toyotawaits.com',
        applicationCategory: 'AutomotiveApplication',
        operatingSystem: 'All',
        description:
          'Crowd-sourced Toyota delivery wait-time tracker and public inventory discovery tool for the United States.',
      },
      {
        '@type': 'AutoDealer',
        '@id': 'https://www.toyotawaits.com/#autodealer',
        name: 'Toyota Dealer Network - United States',
        url: 'https://www.toyotawaits.com/inventory',
        description:
          'Public observed inventory and factory allocation tracking for US Toyota dealerships.',
      },
      {
        '@type': 'Organization',
        '@id': 'https://www.toyotawaits.com/#organization',
        name: 'ToyotaWaits',
        url: 'https://www.toyotawaits.com',
        description:
          'Crowd-sourced Toyota delivery wait-time tracker and public inventory discovery tool for the United States.',
      },
    ],
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { market: hostMarket, isUS } = await getRequestMarketMetadata('/');
  let initialMarket: 'CA' | 'US' = hostMarket;

  try {
    const cookieStore = await cookies();
    const cookieMarket = cookieStore.get('toyotawaits_market')?.value?.toUpperCase();
    if (cookieMarket === 'US' || cookieMarket === 'CA') {
      initialMarket = cookieMarket;
    }
  } catch {
    // Static build or unit test context without active request cookies
  }

  const activeJsonLd = buildRootJsonLd(isUS);
  const showMobileStickyLogBar = await evaluateFlagSafely(mobileStickyLogBar, false);

  return (
    <html
      lang={isUS ? 'en-US' : 'en-CA'}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      {/* overflow-x-clip (not hidden): clips sideways wobble without creating a scroll container, which would break position: sticky */}
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 font-sans overflow-x-clip">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(activeJsonLd) }}
        />
        <MarketProvider initialMarket={initialMarket}>
          <WSJCalloutBanner />
          <Header initialRegion={initialMarket} />
          <main className="flex-1 pb-16 md:pb-0">
            {children}
          </main>
          <KofiFloatingPill className="bottom-20 sm:bottom-4" />
          <Footer />
          <Suspense fallback={null}>
            <MobileStickyLogBar enabled={showMobileStickyLogBar} />
            <MobileBottomDock />
          </Suspense>
        </MarketProvider>
        <FlagValues values={{ 'mobile-sticky-log-bar': showMobileStickyLogBar }} />
        <AnalyticsWrapper />
      </body>
    </html>
  );
}
