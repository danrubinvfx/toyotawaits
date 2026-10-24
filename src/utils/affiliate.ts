/**
 * ToyotaWaits Dynamic Outbound Affiliate Link Helper
 * Resolves localized Amazon outbound destinations across Canada (amazon.ca)
 * and United States (amazon.com) with verified Associate tags.
 */

export interface AffiliateLinkParams {
  asin?: string;
  searchQuery?: string;
  query?: string;
  market: 'CA' | 'US';
}

export function buildAmazonAffiliateUrl({
  asin,
  searchQuery,
  query,
  market,
}: AffiliateLinkParams): string {
  const isUS = market === 'US';
  const domain = isUS ? 'www.amazon.com' : 'www.amazon.ca';
  const tag = isUS ? 'toyotawaits07-20' : 'toyotawaits-20';

  if (asin) {
    return `https://${domain}/dp/${asin}?tag=${tag}`;
  }

  const encodedQuery = encodeURIComponent(searchQuery || query || 'Toyota accessories');
  return `https://${domain}/s?k=${encodedQuery}&tag=${tag}`;
}

export default buildAmazonAffiliateUrl;
