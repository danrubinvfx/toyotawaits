/**
 * ToyotaWaits Affiliate Link Helper & URL Builders
 * Supports dynamic market routing (Canada amazon.ca vs US amazon.com)
 * with associate tag attribution.
 */

export const DEFAULT_AMAZON_AFFILIATE_TAG = 'toyotawaits-20';

export interface AffiliateParams {
  query?: string;
  asin?: string;
  market?: 'CA' | 'US';
}

/**
 * Builds a dynamically localized Amazon affiliate URL for either Canada (amazon.ca)
 * or the United States (amazon.com), with proper associate attribution tags.
 */
export function getAmazonAffiliateUrl({ query, asin, market = 'CA' }: AffiliateParams): string {
  const isUS = market === 'US';
  const domain = isUS ? 'https://www.amazon.com' : 'https://www.amazon.ca';
  const tag = isUS
    ? (process.env.NEXT_PUBLIC_AMAZON_US_TAG || process.env.NEXT_PUBLIC_AMAZON_TAG || 'toyotawaits-20')
    : (process.env.NEXT_PUBLIC_AMAZON_CA_TAG || 'toyotawaits-20');

  const cleanAsin = asin?.trim().toUpperCase();
  if (cleanAsin && /^[A-Z0-9]{10}$/.test(cleanAsin)) {
    return `${domain}/dp/${cleanAsin}?tag=${tag}`;
  }

  if (query && query.trim().length > 0) {
    return `${domain}/s?k=${encodeURIComponent(query.trim())}&tag=${tag}`;
  }

  return `${domain}/?tag=${tag}`;
}

/**
 * Helper supporting both string query signatures and AffiliateParams objects
 * for backwards compatibility across existing and new guide components.
 */
export function buildAmazonAffiliateUrl(
  paramsOrQuery: AffiliateParams | string,
  tagOrMarket?: string,
  marketFallback: 'CA' | 'US' = 'CA'
): string {
  if (typeof paramsOrQuery === 'string') {
    if (tagOrMarket === 'CA' || tagOrMarket === 'US') {
      return getAmazonAffiliateUrl({ query: paramsOrQuery, market: tagOrMarket });
    }
    const isUS = marketFallback === 'US';
    const domain = isUS ? 'https://www.amazon.com' : 'https://www.amazon.ca';
    const tag =
      tagOrMarket ||
      (isUS
        ? process.env.NEXT_PUBLIC_AMAZON_US_TAG || process.env.NEXT_PUBLIC_AMAZON_TAG || 'toyotawaits-20'
        : process.env.NEXT_PUBLIC_AMAZON_CA_TAG || 'toyotawaits-20');
    return `${domain}/s?k=${encodeURIComponent(paramsOrQuery)}&tag=${tag}`;
  }
  return getAmazonAffiliateUrl(paramsOrQuery);
}

/**
 * Shared affiliate link constants for accessories and guides.
 * Centralized for easy updates and environment variable overrides.
 */
export const AFFILIATE_LINKS = {
  TORKLIFT:
    process.env.NEXT_PUBLIC_AFFILIATE_TORKLIFT ||
    'https://torkliftcentral.com/2021-2027-toyota-sienna-featured-stainless-steel-rust-free-trailer-hitch-receiver',
  TORKLIFT_SEARCH:
    'https://torkliftcentral.com/catalogsearch/result/?q=sienna',
  AMAZON_CURT_HITCH:
    process.env.NEXT_PUBLIC_AFFILIATE_AMAZON_CURT_HITCH ||
    'https://www.amazon.com/dp/B0BJ5928HS',
  AMAZON_CURT_HITCH_SEARCH:
    'https://www.amazon.com/s?k=Curt+13470+Sienna',
  AMAZON_WIRING:
    process.env.NEXT_PUBLIC_AFFILIATE_AMAZON_WIRING ||
    'https://www.amazon.com/s?k=CURT+56456',
  TEKONSHA_WIRING:
    process.env.NEXT_PUBLIC_AFFILIATE_TEKONSHA_WIRING ||
    'https://www.amazon.com/s?k=Tekonsha+118844',
  BALL_MOUNT:
    process.env.NEXT_PUBLIC_AFFILIATE_BALL_MOUNT ||
    'https://www.amazon.com/s?k=Curt+45036+Class+3+Ball+Mount+2-Inch+Rise',
  ANTI_RATTLE_CLAMP:
    process.env.NEXT_PUBLIC_AFFILIATE_ANTI_RATTLE ||
    'https://www.amazon.com/s?k=2+inch+anti+rattle+hitch+tightener',
  AIR_LIFT_1000:
    process.env.NEXT_PUBLIC_AFFILIATE_AIR_LIFT ||
    'https://www.amazon.com/s?k=Air+Lift+60858',
  BRAKE_CONTROLLER:
    process.env.NEXT_PUBLIC_AFFILIATE_BRAKE_CONTROLLER ||
    'https://www.amazon.com/s?k=CURT+51180+Echo+Mobile+Electric+Trailer+Brake+Controller',
} as const;
