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
      const requestHost = (
        headersList.get('x-forwarded-host') ||
        headersList.get('host') ||
        ''
      )
        .split(',')[0]
        .trim()
        .split(':')[0]
        .toLowerCase();
      const xDomain = (headersList.get('x-domain') || '').trim().toLowerCase();
      isUS =
        headersList.get('x-region') === 'US' ||
        requestHost === 'toyotawaits.com' ||
        requestHost.endsWith('.toyotawaits.com') ||
        xDomain === 'toyotawaits.com' ||
        xDomain.endsWith('.toyotawaits.com');
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

export interface HostAwarePageMetadataOptions {
  path: string;
  caTitle: string;
  caDescription: string;
  usTitle: string;
  usDescription: string;
  keywords?: string[];
  caSiteName?: string;
  type?: 'website' | 'article';
}

/**
 * Builds host-aware Metadata for top-level public routes (/faq, /delivery-prep, /tires, etc.)
 * with reciprocal en-CA / en-US / x-default hreflang alternates and self-referencing canonicals.
 */
export async function buildHostAwarePageMetadata(
  options: HostAwarePageMetadataOptions
): Promise<Metadata> {
  const { isUS, baseUrl, alternatesLanguages } = await getRequestMarketMetadata(options.path);
  const canonical = `${baseUrl}${options.path}`;
  const title = isUS ? options.usTitle : options.caTitle;
  const description = isUS ? options.usDescription : options.caDescription;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    ...(options.keywords ? { keywords: options.keywords } : {}),
    alternates: {
      canonical,
      languages: alternatesLanguages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: isUS ? 'ToyotaWaits' : (options.caSiteName ?? 'ToyotaWaits.ca'),
      locale: isUS ? 'en_US' : 'en_CA',
      type: options.type ?? 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export interface GuideFaqItem {
  question: string;
  answer: string;
}

export function buildGuideFaqSchema(faqs: GuideFaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export interface GuideArticleSchemaOptions {
  slug: string;
  isUS: boolean;
  caHeadline: string;
  caDescription: string;
  usHeadline: string;
  usDescription: string;
  datePublished: string;
  dateModified: string;
}

export function buildGuideArticleSchema(options: GuideArticleSchemaOptions) {
  const baseUrl = options.isUS ? 'https://www.toyotawaits.com' : 'https://www.toyotawaits.ca';
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: options.isUS ? options.usHeadline : options.caHeadline,
    description: options.isUS ? options.usDescription : options.caDescription,
    author: {
      '@type': 'Organization',
      name: 'ToyotaWaits Editorial Team',
    },
    publisher: {
      '@type': 'Organization',
      name: options.isUS ? 'ToyotaWaits' : 'ToyotaWaits.ca',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/favicon.ico`,
      },
    },
    datePublished: options.datePublished,
    dateModified: options.dateModified,
    mainEntityOfPage: `${baseUrl}/guides/${options.slug}`,
  };
}

export interface UsGuideConfig {
  modelName: string;
  msrpUsdRange: string;
  assemblyPlant: string;
  transitTimeline: string;
  admRange: string;
  verdictSummary: string;
  faqs: GuideFaqItem[];
}

export const US_GUIDE_CONFIGS: Record<string, UsGuideConfig> = {
  'toyota-rav4-2026-vs-2027': {
    modelName: 'Toyota RAV4',
    msrpUsdRange: '$30,000 – $48,500 USD',
    assemblyPlant: 'TMMK (Georgetown, KY), TMMC (Ontario), and Japan',
    transitTimeline: '30–90 days once allocated',
    admRange: '$0 MSRP to +$3,000+ ADM',
    verdictSummary:
      'In the United States, 2026 Toyota RAV4 Hybrid buyers should claim an allocated 2026 build at $0 MSRP to avoid 2027 MSRP inflation, while Plug-in Hybrid buyers seeking native NACS Tesla Supercharging may prefer a 2027 allocation. Transit from assembly or port takes 30–90 days once allocated, with dealer ADM ranging from $0 MSRP to +$3,000+.',
    faqs: [
      {
        question: 'What is the US MSRP and ADM range for the 2026 vs. 2027 Toyota RAV4?',
        answer:
          'US base MSRP for the RAV4 lineup spans roughly $30,000 to $48,500 USD depending on Gas, Hybrid, or Plug-in Hybrid trim. Real-world US dealer pricing ranges from $0 MSRP at fair-price dealers to +$3,000+ ADM on high-demand Woodland and PHEV trims.',
      },
      {
        question: 'How long is the US allocation and transit timeline for a 2026 or 2027 RAV4?',
        answer:
          'Once TMNA or a regional distributor (SET/GST) assigns a build slot from Georgetown (KY), Ontario, or Japan, factory-to-dealer transit typically takes 30–90 days. Unallocated late-2026 reservations roll over to 2027 VINs.',
      },
      {
        question: 'Are US Toyota RAV4 waitlist deposits refundable?',
        answer:
          'Deposit refundability depends on US state motor vehicle franchise laws and your signed dealer receipt. In states like California, deposits on unsigned purchase agreements are generally refundable prior to VIN assignment.',
      },
    ],
  },
  'toyota-sienna-2026-vs-2027': {
    modelName: 'Toyota Sienna',
    msrpUsdRange: '$39,185 – $56,145 USD',
    assemblyPlant: 'TMMI (Princeton, Indiana)',
    transitTimeline: '30–90 days once allocated',
    admRange: '$0 MSRP to +$3,000+ ADM',
    verdictSummary:
      'In the United States, the 2027 Toyota Sienna is a mechanical carryover of the 2026 245-hp hybrid minivan built in Princeton, Indiana (TMMI). Claim an allocated 2026 build at $0 MSRP rather than waiting—once allocated, transit takes 30–90 days, while high-demand XSE and Platinum trims still see +$1,500 to +$3,000+ ADM at some dealers.',
    faqs: [
      {
        question: 'What is the US MSRP and ADM range for the 2026 vs. 2027 Toyota Sienna?',
        answer:
          'US Sienna MSRP starts around $39,185 USD for LE FWD and reaches ~$56,145 USD for Platinum AWD. While many US dealers sell at $0 MSRP, tight regional supply still drives +$1,500 to +$3,000+ ADM on AWD and Platinum trims.',
      },
      {
        question: 'How long does Princeton, Indiana (TMMI) Sienna allocation transit take in the US?',
        answer:
          'Once a Sienna allocation is assigned to your US dealership, rail and truck transit from TMMI in Princeton, Indiana takes 30–90 days. Unallocated late-2026 orders automatically roll to 2027 VINs.',
      },
      {
        question: 'Are US Toyota Sienna deposits refundable under state law?',
        answer:
          'US deposit refund rules vary by state. States such as California protect buyer deposit refunds prior to VIN assignment on unsigned contracts; always get written refundability terms before placing a hold.',
      },
    ],
  },
  'toyota-grand-highlander-2026-vs-2027': {
    modelName: 'Toyota Grand Highlander',
    msrpUsdRange: '$41,660 – $59,575 USD',
    assemblyPlant: 'TMMI (Princeton, Indiana)',
    transitTimeline: '30–90 days once allocated',
    admRange: '$0 MSRP to +$3,000+ ADM',
    verdictSummary:
      'In the United States, the 2027 Grand Highlander adds the Hybrid Woodland Edition, while standard Gas, Hybrid, and Hybrid MAX trims carry over mechanically from Princeton, Indiana (TMMI). Allocated builds deliver in 30–90 days, with US dealer ADM ranging from $0 MSRP to +$3,000+ on Hybrid and MAX Platinum grades.',
    faqs: [
      {
        question: 'What is the US MSRP and ADM range for the 2026 vs. 2027 Grand Highlander?',
        answer:
          'US MSRP spans ~$41,660 USD (Gas LE) to ~$59,575 USD (Hybrid MAX Platinum). Expect $0 MSRP at high-volume fair-price dealers, or +$1,500 to +$3,000+ ADM on constrained Hybrid and Woodland allocations.',
      },
      {
        question: 'How long is the US allocation transit timeline from Princeton, Indiana?',
        answer:
          'Once TMNA or regional distributors (SET/GST) assign your Grand Highlander allocation, transit from TMMI in Princeton, Indiana takes 30–90 days.',
      },
      {
        question: 'Are US Grand Highlander waitlist deposits refundable?',
        answer:
          'Refundability is governed by US state franchise laws and dealer policy. In California and several other states, deposits on unsigned orders are refundable prior to VIN assignment—insist on a written refund clause.',
      },
    ],
  },
  'toyota-corolla-cross-2026-vs-2027': {
    modelName: 'Toyota Corolla Cross',
    msrpUsdRange: '$24,135 – $32,180 USD',
    assemblyPlant: 'MTM (Huntsville, Alabama)',
    transitTimeline: '30–90 days once allocated',
    admRange: '$0 MSRP to +$3,000+ ADM',
    verdictSummary:
      'In the United States, the 2027 Corolla Cross & Hybrid carry over mechanically from Mazda Toyota Manufacturing (MTM) in Huntsville, Alabama. Claim an incoming 2026 build at $0 MSRP; once allocated, US transit takes 30–90 days, though coastal Hybrid trims can carry +$1,000 to +$3,000+ ADM.',
    faqs: [
      {
        question: 'What is the US MSRP and ADM range for the 2026 vs. 2027 Corolla Cross?',
        answer:
          'US MSRP starts near $24,135 USD for Gas L FWD and reaches ~$32,180 USD for Hybrid XSE AWD. Most US dealers sell Gas trims at $0 MSRP, while Hybrid trims range from $0 MSRP to +$3,000+ ADM in tight markets.',
      },
      {
        question: 'How long does MTM Huntsville, Alabama allocation transit take in the US?',
        answer:
          'Once your US dealer receives a Corolla Cross allocation from MTM in Huntsville, Alabama, rail and carrier transit typically takes 30–90 days.',
      },
      {
        question: 'Are US Corolla Cross deposits refundable?',
        answer:
          'US deposit refund rules vary by state law. In states like California, deposits on unsigned agreements are refundable prior to VIN assignment; always request written refund terms.',
      },
    ],
  },
  'toyota-camry-2026-vs-2027': {
    modelName: 'Toyota Camry',
    msrpUsdRange: '$28,700 – $36,425 USD',
    assemblyPlant: 'TMMK (Georgetown, Kentucky)',
    transitTimeline: '30–90 days once allocated',
    admRange: '$0 MSRP to +$3,000+ ADM',
    verdictSummary:
      'In the United States, the 2027 Toyota Camry Hybrid is a direct mechanical carryover of the 9th-gen 225/232-hp sedan built in Georgetown, Kentucky (TMMK). Take a 2026 build at $0 MSRP to lock in lower pricing; allocated US deliveries arrive in 30–90 days.',
    faqs: [
      {
        question: 'What is the US MSRP and ADM range for the 2026 vs. 2027 Toyota Camry?',
        answer:
          'US MSRP for the all-hybrid Camry ranges from ~$28,700 USD (LE FWD) to ~$36,425 USD (XSE AWD). High-volume US dealers routinely sell at $0 MSRP, while tight-supply XSE AWD allocations can see +$1,000 to +$3,000+ ADM.',
      },
      {
        question: 'How long is US allocation transit from Georgetown, Kentucky (TMMK)?',
        answer:
          'Once TMNA or regional distributors (SET/GST) allocate a Camry build slot from TMMK in Georgetown, Kentucky, dealer transit takes 30–90 days.',
      },
      {
        question: 'Are US Toyota Camry waitlist deposits refundable?',
        answer:
          'US deposit refundability varies by state law (for example, California mandates refundability prior to VIN assignment on unsigned orders). Always obtain a signed refundable deposit receipt.',
      },
    ],
  },
  'toyota-highlander-2026-vs-2027': {
    modelName: 'Toyota Highlander',
    msrpUsdRange: '$39,820 – $54,500 USD (Est. BEV)',
    assemblyPlant: 'TMMI (Princeton, Indiana) / TMMK (Georgetown, KY)',
    transitTimeline: '30–90 days once allocated',
    admRange: '$0 MSRP to +$3,000+ ADM',
    verdictSummary:
      'In the United States, the 2027 Highlander pivots to a 3-row all-electric BEV with native NACS charging, while remaining 2026 Gas and Hybrid stock winds down. Expect 30–90 day transit once allocated and initial US dealer ADM ranging from $0 MSRP to +$3,000+ on early BEV deliveries.',
    faqs: [
      {
        question: 'What is the US MSRP and ADM outlook for the 2026 vs. 2027 Highlander?',
        answer:
          'Outgoing 2026 Gas/Hybrid Highlanders start around $39,820 USD MSRP, while the all-new 2027 Highlander BEV is expected in the $45,000–$54,500+ USD range with early dealer ADM spanning $0 MSRP to +$3,000+.',
      },
      {
        question: 'How long is the US allocation transit timeline for the 2027 Highlander BEV?',
        answer:
          'Once allocated through TMNA or regional distributors, US factory-to-dealer transit takes 30–90 days.',
      },
      {
        question: 'Are US Highlander BEV reservation deposits refundable?',
        answer:
          'Deposit refund rules depend on US state franchise laws. In states like California, unsigned reservation deposits are refundable prior to VIN assignment—verify refund terms in writing.',
      },
    ],
  },
  'toyota-land-cruiser-2026-vs-2027': {
    modelName: 'Toyota Land Cruiser',
    msrpUsdRange: '$56,700 – $68,900 USD',
    assemblyPlant: 'Tahara / Hino Hamura, Japan',
    transitTimeline: '30–90 days once allocated',
    admRange: '$0 MSRP to +$3,000+ ADM',
    verdictSummary:
      'In the United States, the 2027 Land Cruiser keeps its 326-hp i-FORCE MAX hybrid powertrain while adding heated/ventilated rear seats and TSS upgrades on the Premium Package. Port-to-dealer transit from Japan takes 30–90 days once allocated, with ADM ranging from $0 MSRP to +$3,000+.',
    faqs: [
      {
        question: 'What is the US MSRP and ADM range for the 2026 vs. 2027 Land Cruiser?',
        answer:
          'US MSRP spans ~$56,700 USD (1958) to ~$68,900+ USD (Land Cruiser with Premium Package). Dealer pricing ranges from $0 MSRP to +$3,000+ ADM depending on regional allocation.',
      },
      {
        question: 'How long does Japan port-to-dealer transit take in the US?',
        answer:
          'Once a Land Cruiser build is allocated at port or factory in Japan, US transit to your dealership typically takes 30–90 days.',
      },
      {
        question: 'Are US Land Cruiser deposits refundable?',
        answer:
          'US deposit refundability varies by state law (e.g. California protects refundability prior to VIN assignment). Always secure written refund terms on your deposit receipt.',
      },
    ],
  },
  'toyota-prius-2026-vs-2027': {
    modelName: 'Toyota Prius & PHEV',
    msrpUsdRange: '$28,350 – $40,570 USD',
    assemblyPlant: 'Tsutsumi Plant, Japan',
    transitTimeline: '30–90 days once allocated',
    admRange: '$0 MSRP to +$3,000+ ADM',
    verdictSummary:
      'In the United States, the 2027 Prius and Prius Plug-in Hybrid standardize dual-zone climate control and an included dual-voltage L1/L2 charger on PHEV trims. Tsutsumi Japan port-to-dealer transit takes 30–90 days once allocated, with ADM from $0 MSRP to +$3,000+.',
    faqs: [
      {
        question: 'What is the US MSRP and ADM range for the 2026 vs. 2027 Prius & PHEV?',
        answer:
          'US MSRP starts near $28,350 USD for Prius LE and reaches ~$40,570 USD for Prius Plug-in Hybrid XSE Premium. Coastal markets still see $0 MSRP to +$3,000+ ADM on PHEV allocations.',
      },
      {
        question: 'How long is US allocation transit from Tsutsumi, Japan?',
        answer:
          'Once your US dealer is allocated a Prius or Prius PHEV build from Tsutsumi, ocean shipping and port-to-dealer transit take 30–90 days.',
      },
      {
        question: 'Are US Prius waitlist deposits refundable?',
        answer:
          'Refundability depends on US state motor vehicle laws. In states like California, deposits on unsigned purchase agreements are refundable prior to VIN assignment.',
      },
    ],
  },
  'toyota-sequoia-2026-vs-2027': {
    modelName: 'Toyota Sequoia',
    msrpUsdRange: '$62,425 – $83,915 USD',
    assemblyPlant: 'TMMTX (San Antonio, Texas)',
    transitTimeline: '30–90 days once allocated',
    admRange: '$0 MSRP to +$3,000+ ADM',
    verdictSummary:
      'In the United States, the 2027 Sequoia adds the SR5 Trailhunter, FOX QS3 TRD Pro shocks, TSS 4.0, and Trailer ADAS from San Antonio, Texas (TMMTX). Allocated builds arrive in 30–90 days, with ADM spanning $0 MSRP to +$3,000+ on TRD Pro and Trailhunter grades.',
    faqs: [
      {
        question: 'What is the US MSRP and ADM range for the 2026 vs. 2027 Toyota Sequoia?',
        answer:
          'US MSRP spans ~$62,425 USD (SR5) to ~$83,915+ USD (Capstone / TRD Pro). While standard trims often trade at $0 MSRP, TRD Pro and new Trailhunter allocations can carry +$1,500 to +$3,000+ ADM.',
      },
      {
        question: 'How long does San Antonio, Texas (TMMTX) allocation transit take in the US?',
        answer:
          'Once TMNA or regional distributors allocate a Sequoia build from TMMTX in San Antonio, Texas, US dealer transit takes 30–90 days.',
      },
      {
        question: 'Are US Toyota Sequoia deposits refundable?',
        answer:
          'US deposit refund rules vary by state law. In states like California, deposits on unsigned orders are refundable prior to VIN assignment—always get written refund terms.',
      },
    ],
  },
  'toyota-tundra-2026-vs-2027': {
    modelName: 'Toyota Tundra',
    msrpUsdRange: '$40,090 – $80,725 USD',
    assemblyPlant: 'TMMTX (San Antonio, Texas)',
    transitTimeline: '30–90 days once allocated',
    admRange: '$0 MSRP to +$3,000+ ADM',
    verdictSummary:
      'In the United States, the 2027 Tundra introduces the SR5 Trailhunter, standard 14-inch screen, TSS 4.0, and upgraded TRD Pro FOX QS3 shocks from San Antonio, Texas (TMMTX). Allocated US builds deliver in 30–90 days, with ADM ranging from $0 MSRP on volume SR5/Limited trucks to +$3,000+ on TRD Pro.',
    faqs: [
      {
        question: 'What is the US MSRP and ADM range for the 2026 vs. 2027 Toyota Tundra?',
        answer:
          'US Tundra MSRP starts near $40,090 USD (SR) and reaches ~$80,725 USD (Capstone / TRD Pro). Volume SR5 and Limited trims frequently sell at $0 MSRP or below, while TRD Pro and Trailhunter can see +$1,500 to +$3,000+ ADM.',
      },
      {
        question: 'How long is US allocation transit from San Antonio, Texas (TMMTX)?',
        answer:
          'Once a Tundra build slot is allocated by TMNA or regional distributors (SET/GST), transit from TMMTX in San Antonio takes 30–90 days.',
      },
      {
        question: 'Are US Toyota Tundra waitlist deposits refundable?',
        answer:
          'Deposit refundability depends on US state franchise laws. In states such as California, unsigned deposits are generally refundable prior to VIN assignment—always request a signed refund clause.',
      },
    ],
  },
};

