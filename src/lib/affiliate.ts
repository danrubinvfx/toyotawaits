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

  if (query) {
    return `${domain}/s?k=${encodeURIComponent(query)}&tag=${tag}`;
  }
  if (asin) {
    return `${domain}/dp/${asin}?tag=${tag}`;
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
    'https://torkliftcentral.com/x7422s-toyota-sienna-ecohitch?aff=toyotawaits',
  AMAZON_CURT_HITCH:
    process.env.NEXT_PUBLIC_AFFILIATE_AMAZON_CURT_HITCH ||
    getAmazonAffiliateUrl({ query: 'Curt 13470 Class 3 Trailer Hitch Toyota Sienna', market: 'CA' }),
  AMAZON_WIRING:
    process.env.NEXT_PUBLIC_AFFILIATE_AMAZON_WIRING ||
    getAmazonAffiliateUrl({ query: 'Curt 56456 Custom 4-Pin Trailer Wiring Harness Toyota Sienna', market: 'CA' }),
  TEKONSHA_WIRING:
    process.env.NEXT_PUBLIC_AFFILIATE_TEKONSHA_WIRING ||
    getAmazonAffiliateUrl({ query: 'Tekonsha 118844 T-One Connector Toyota Sienna', market: 'CA' }),
  BALL_MOUNT:
    process.env.NEXT_PUBLIC_AFFILIATE_BALL_MOUNT ||
    getAmazonAffiliateUrl({ query: 'Curt 45036 Class 3 Ball Mount 2-Inch Rise', market: 'CA' }),
  ANTI_RATTLE_CLAMP:
    process.env.NEXT_PUBLIC_AFFILIATE_ANTI_RATTLE ||
    getAmazonAffiliateUrl({ query: 'MaxxHaul 50027 Heavy Duty Anti-Rattle Hitch Tightener', market: 'CA' }),
  AIR_LIFT_1000:
    process.env.NEXT_PUBLIC_AFFILIATE_AIR_LIFT ||
    getAmazonAffiliateUrl({ query: 'Air Lift 1000 60860 Toyota Sienna', market: 'CA' }),
  BRAKE_CONTROLLER:
    process.env.NEXT_PUBLIC_AFFILIATE_BRAKE_CONTROLLER ||
    getAmazonAffiliateUrl({ query: 'CURT 51180 Echo Mobile Electric Trailer Brake Controller', market: 'CA' }),
} as const;
