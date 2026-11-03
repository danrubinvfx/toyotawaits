/**
 * ToyotaWaits Dynamic Outbound Affiliate Link Helper
 * Resolves localized Amazon outbound destinations across Canada (amazon.ca)
 * and United States (amazon.com) with verified Associate tags.
 */

import { shouldStripAffiliateTags } from '@/lib/gear/affiliate';

export { shouldStripAffiliateTags };

export interface AffiliateLinkParams {
  asin?: string;
  asin_ca?: string;
  asin_us?: string;
  searchQuery?: string;
  query?: string;
  market?: 'CA' | 'US';
}

export function buildAmazonAffiliateUrl({
  asin,
  asin_ca,
  asin_us,
  searchQuery,
  query,
  market = 'CA',
}: AffiliateLinkParams): string {
  const isUS = market === 'US';
  const domain = isUS ? 'https://www.amazon.com' : 'https://www.amazon.ca';
  const tag = isUS ? 'toyotawaits07-20' : 'toyotawaits-20';
  const activeAsin = isUS ? (asin_us || asin) : (asin_ca || asin);
  const stripTag = shouldStripAffiliateTags();

  // If a valid 10-character alphanumeric ASIN is explicitly provided, link to product page
  if (activeAsin && /^[A-Z0-9]{10}$/i.test(activeAsin.trim())) {
    return stripTag
      ? `${domain}/dp/${activeAsin.trim().toUpperCase()}`
      : `${domain}/dp/${activeAsin.trim().toUpperCase()}?tag=${tag}`;
  }

  // Evergreen Fallback: Search queries never yield 404 error pages
  const effectiveQuery = searchQuery || query || 'Toyota accessories';
  return stripTag
    ? `${domain}/s?k=${encodeURIComponent(effectiveQuery)}`
    : `${domain}/s?k=${encodeURIComponent(effectiveQuery)}&tag=${tag}`;
}

export default buildAmazonAffiliateUrl;
