import type { Metadata } from 'next';
import { headers } from 'next/headers';

export interface RequestMarketMetadata {
  market: 'US' | 'CA';
  isUS: boolean;
  baseUrl: 'https://www.toyotawaits.com' | 'https://www.toyotawaits.ca';
  alternatesLanguages: {
    'en-CA': string;
    'en-US': string;
    'x-default': string;
  };
}

/**
 * Resolves the active request market ('US' | 'CA') from Next.js request headers.
 * Defaults cleanly to 'CA' (www.toyotawaits.ca) in static build or test contexts
 * where request headers are unavailable or do not specify a US host/region.
 */
export async function getRequestMarketMetadata(path = ''): Promise<RequestMarketMetadata> {
  let isUS = false;

  try {
    const headersList = await headers();
    if (headersList && typeof headersList.get === 'function') {
      isUS =
        headersList.get('x-region') === 'US' ||
        (headersList.get('host') || '').toLowerCase().includes('toyotawaits.com') ||
        (headersList.get('x-domain') || '').toLowerCase().includes('toyotawaits.com');
    }
  } catch {
    // Static build or unit test context without active request headers
    isUS = false;
  }

  const market: 'US' | 'CA' = isUS ? 'US' : 'CA';
  const baseUrl = isUS ? 'https://www.toyotawaits.com' : 'https://www.toyotawaits.ca';

  return {
    market,
    isUS,
    baseUrl,
    alternatesLanguages: {
      'en-CA': `https://www.toyotawaits.ca${path}`,
      'en-US': `https://www.toyotawaits.com${path}`,
      'x-default': `https://www.toyotawaits.ca${path}`,
    },
  };
}

export interface GuideMetadataOptions {
  slug: string;
  caTitle: string;
  caDescription: string;
  usTitle: string;
  usDescription: string;
  caTwitterTitle?: string;
  caTwitterDescription?: string;
}

/**
 * Builds host-aware Metadata for 2026-vs-2027 guide pages so US requests
 * drop "Canada" and emit self-referencing https://www.toyotawaits.com canonicals.
 */
export async function buildGuideMetadata(options: GuideMetadataOptions): Promise<Metadata> {
  const path = `/guides/${options.slug}`;
  const { isUS, baseUrl, alternatesLanguages } = await getRequestMarketMetadata(path);
  const canonical = `${baseUrl}${path}`;

  if (isUS) {
    return {
      title: options.usTitle,
      description: options.usDescription,
      alternates: {
        canonical,
        languages: alternatesLanguages,
      },
      openGraph: {
        title: options.usTitle,
        description: options.usDescription,
        url: canonical,
        siteName: 'ToyotaWaits',
        locale: 'en_US',
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: options.usTitle,
        description: options.usDescription,
      },
    };
  }

  return {
    title: options.caTitle,
    description: options.caDescription,
    alternates: {
      canonical,
      languages: alternatesLanguages,
    },
    openGraph: {
      title: options.caTitle,
      description: options.caDescription,
      url: canonical,
      siteName: 'ToyotaWaits.ca',
      locale: 'en_CA',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: options.caTwitterTitle ?? options.caTitle,
      description: options.caTwitterDescription ?? options.caDescription,
    },
  };
}
