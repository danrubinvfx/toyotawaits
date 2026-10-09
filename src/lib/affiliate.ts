/**
 * ToyotaWaits Affiliate Link Helper & URL Builders
 * Tag: danrubin03-20
 */

export const DEFAULT_AMAZON_AFFILIATE_TAG = 'danrubin03-20';

/**
 * Builds a search query affiliate link pointing directly to Amazon.ca
 * Structure: https://www.amazon.ca/s?k=${encodeURIComponent(query)}&tag=${tag}
 */
export function buildAmazonAffiliateUrl(
  query: string,
  tag: string = DEFAULT_AMAZON_AFFILIATE_TAG
): string {
  return `https://www.amazon.ca/s?k=${encodeURIComponent(query)}&tag=${tag}`;
}
