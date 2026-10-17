import { Market } from './regions';

export interface MarketCopy {
  countryName: string;
  countryShort: string;
  domain: string;
  regionType: string;
  regionTypePlural: string;
  nationalBaseline: string;
  queueConcept: string;
  pricingConcept: string;
  pricingLegislation: string;
  dealershipType: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  estimatorBenchmarkDisclaimer: string;
  estimatorDatabaseNote: string;
  analyticsHeading: string;
  disclaimerEntity: string;
  currency: string;
  currencySymbol: string;
}

export const MARKET_COPY: Record<Market, MarketCopy> = {
  CA: {
    countryName: 'Canada',
    countryShort: 'CA',
    domain: 'ToyotaWaits.ca',
    regionType: 'Province',
    regionTypePlural: 'Provinces',
    nationalBaseline: 'Canadian National Baseline',
    queueConcept: 'Factory Order Queue',
    pricingConcept: 'MSRP / All-In Pricing',
    pricingLegislation: 'Provincial OMVIC/VSA All-In Pricing Rules',
    dealershipType: 'Canadian Dealerships',
    heroEyebrow: 'Canadian Community Tracker',
    heroTitle: 'Canadian Toyota Wait Time Tracker',
    heroSubtitle: 'Tracking real-world Canadian order timelines and dealer deliveries.',
    heroDescription: 'Crowdsourced delivery timelines across Canada. Select your model to estimate your wait.',
    estimatorBenchmarkDisclaimer:
      'Historical dealer benchmarks collected across Canadian dealerships. Median baseline calculation methodology excludes outlier custom factory orders.',
    estimatorDatabaseNote: 'Your delivery timeline has been incorporated into our crowdsourced Canadian database.',
    analyticsHeading: 'Provincial Wait Time Analytics',
    disclaimerEntity: 'Toyota Canada Inc.',
    currency: 'CAD',
    currencySymbol: '$',
  },
  US: {
    countryName: 'United States',
    countryShort: 'US',
    domain: 'ToyotaWaits.com',
    regionType: 'State',
    regionTypePlural: 'States',
    nationalBaseline: 'US National Baseline',
    queueConcept: 'Dealer Allocation & Waitlist',
    pricingConcept: 'MSRP / Market Adjustment (ADM)',
    pricingLegislation: 'Monroney Window Sticker vs Dealer Addendums & ADM',
    dealershipType: 'U.S. Dealerships',
    heroEyebrow: 'U.S. Community Tracker',
    heroTitle: 'U.S. Toyota Wait Time & Markup Tracker',
    heroSubtitle: 'Tracking real-world U.S. dealer allocations, waitlists, and markups.',
    heroDescription:
      'Crowdsourced delivery timelines and dealer pricing across the United States. Select your model to estimate your wait.',
    estimatorBenchmarkDisclaimer:
      'Historical dealer benchmarks collected across U.S. dealerships. Median baseline calculation methodology excludes outlier orders.',
    estimatorDatabaseNote: 'Your delivery timeline has been incorporated into our crowdsourced U.S. database.',
    analyticsHeading: 'State Wait Time Analytics',
    disclaimerEntity: 'Toyota Motor Sales, U.S.A., Inc.',
    currency: 'USD',
    currencySymbol: '$',
  },
};

export function getMarketCopy(market: Market = 'CA'): MarketCopy {
  return MARKET_COPY[market] || MARKET_COPY.CA;
}
