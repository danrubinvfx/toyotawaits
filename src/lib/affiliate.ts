/**
 * ToyotaWaits Affiliate Link Helper & URL Builders
 * Supports dynamic market routing (Canada amazon.ca vs US amazon.com)
 * with associate tag attribution.
 */

import { shouldStripAffiliateTags } from '@/lib/gear/affiliate';

export { shouldStripAffiliateTags };

export const DEFAULT_AMAZON_AFFILIATE_TAG = 'toyotawaits-20';
export const DEFAULT_AMAZON_US_AFFILIATE_TAG = 'toyotawaits07-20';

export interface AffiliateParams {
  query?: string;
  searchQuery?: string;
  asin?: string;
  market?: 'CA' | 'US';
  dealFilter?: boolean;
}

/**
 * Builds a dynamically localized Amazon affiliate URL for either Canada (amazon.ca)
 * or the United States (amazon.com), with proper associate attribution tags.
 * If admin opt-out is enabled, the tag parameter is omitted.
 */
export function getAmazonAffiliateUrl({
  query,
  searchQuery,
  asin,
  market = 'CA',
  dealFilter,
}: AffiliateParams): string {
  const isUS = market === 'US';
  const domain = isUS ? 'https://www.amazon.com' : 'https://www.amazon.ca';
  const tag = isUS
    ? (process.env.NEXT_PUBLIC_AMAZON_US_TAG || process.env.NEXT_PUBLIC_AMAZON_TAG || 'toyotawaits07-20')
    : (process.env.NEXT_PUBLIC_AMAZON_CA_TAG || 'toyotawaits-20');
  const stripTag = shouldStripAffiliateTags();

  const cleanAsin = asin?.trim().toUpperCase();
  if (cleanAsin && /^[A-Z0-9]{10}$/.test(cleanAsin)) {
    return stripTag ? `${domain}/dp/${cleanAsin}` : `${domain}/dp/${cleanAsin}?tag=${tag}`;
  }

  const effectiveQuery = query || searchQuery;
  if (effectiveQuery && effectiveQuery.trim().length > 0) {
    const dealSuffix = dealFilter ? '&rh=p_n_deal_type%3A23566065011' : '';
    return stripTag
      ? `${domain}/s?k=${encodeURIComponent(effectiveQuery.trim())}${dealSuffix}`
      : `${domain}/s?k=${encodeURIComponent(effectiveQuery.trim())}&tag=${tag}${dealSuffix}`;
  }

  return stripTag ? `${domain}/` : `${domain}/?tag=${tag}`;
}

/**
 * Helper supporting both string query signatures and AffiliateParams objects
 * for backwards compatibility across existing and new guide components.
 */
export function buildAmazonAffiliateUrl(
  paramsOrQuery: AffiliateParams | string,
  tagOrMarket?: string | boolean,
  marketFallback: 'CA' | 'US' | boolean = 'CA',
  dealFilterArg?: boolean
): string {
  if (typeof paramsOrQuery === 'string') {
    const isDeal =
      dealFilterArg === true ||
      (typeof tagOrMarket === 'boolean' && tagOrMarket) ||
      (typeof marketFallback === 'boolean' && marketFallback);
    if (tagOrMarket === 'CA' || tagOrMarket === 'US') {
      return getAmazonAffiliateUrl({ query: paramsOrQuery, market: tagOrMarket, dealFilter: isDeal });
    }
    const isUS = marketFallback === 'US';
    const domain = isUS ? 'https://www.amazon.com' : 'https://www.amazon.ca';
    const tag =
      (typeof tagOrMarket === 'string' && tagOrMarket) ||
      (isUS
        ? process.env.NEXT_PUBLIC_AMAZON_US_TAG || process.env.NEXT_PUBLIC_AMAZON_TAG || 'toyotawaits07-20'
        : process.env.NEXT_PUBLIC_AMAZON_CA_TAG || 'toyotawaits-20');
    const stripTag = shouldStripAffiliateTags();
    const dealSuffix = isDeal ? '&rh=p_n_deal_type%3A23566065011' : '';
    return stripTag
      ? `${domain}/s?k=${encodeURIComponent(paramsOrQuery)}${dealSuffix}`
      : `${domain}/s?k=${encodeURIComponent(paramsOrQuery)}&tag=${tag}${dealSuffix}`;
  }
  return getAmazonAffiliateUrl({
    ...paramsOrQuery,
    dealFilter: paramsOrQuery.dealFilter ?? dealFilterArg,
  });
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
    'https://www.amazon.com/dp/B0BJ5928HS?tag=toyotawaits07-20',
  AMAZON_CURT_HITCH_SEARCH:
    'https://www.amazon.com/s?k=Curt+13470+Sienna&tag=toyotawaits07-20',
  AMAZON_WIRING:
    process.env.NEXT_PUBLIC_AFFILIATE_AMAZON_WIRING ||
    'https://www.amazon.com/s?k=CURT+56456&tag=toyotawaits07-20',
  TEKONSHA_WIRING:
    process.env.NEXT_PUBLIC_AFFILIATE_TEKONSHA_WIRING ||
    'https://www.amazon.com/s?k=Tekonsha+118844&tag=toyotawaits07-20',
  BALL_MOUNT:
    process.env.NEXT_PUBLIC_AFFILIATE_BALL_MOUNT ||
    'https://www.amazon.com/s?k=Curt+45036+Class+3+Ball+Mount+2-Inch+Rise&tag=toyotawaits07-20',
  ANTI_RATTLE_CLAMP:
    process.env.NEXT_PUBLIC_AFFILIATE_ANTI_RATTLE ||
    'https://www.amazon.com/s?k=2+inch+anti+rattle+hitch+tightener&tag=toyotawaits07-20',
  AIR_LIFT_1000:
    process.env.NEXT_PUBLIC_AFFILIATE_AIR_LIFT ||
    'https://www.amazon.com/s?k=Air+Lift+60858&tag=toyotawaits07-20',
  BRAKE_CONTROLLER:
    process.env.NEXT_PUBLIC_AFFILIATE_BRAKE_CONTROLLER ||
    'https://www.amazon.com/s?k=CURT+51180+Echo+Mobile+Electric+Trailer+Brake+Controller&tag=toyotawaits07-20',
} as const;

export {
  buildAmazonDeepLinks,
  type MobileDeepLinkTargets,
} from '@/lib/gear/affiliate';

export {
  getInsuranceAffiliateUrl,
  ONTARIO_INSURANCE_FALLBACK_URL,
  INSURANCE_AFFILIATE_URLS,
} from '@/config/affiliates';
