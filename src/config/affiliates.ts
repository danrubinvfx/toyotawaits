/**
 * src/config/affiliates.ts
 *
 * Centralized Affiliate Configuration & Regional Insurance Quote Routing
 * ToyotaWaits.ca Discovery Platform
 */

export const ONTARIO_INSURANCE_FALLBACK_URL =
  'https://www.ratehub.ca/insurance/best-car-insurance-quote?utm_source=toyotawaits&utm_medium=referral&utm_campaign=ontario_delivery';

export const INSURANCE_AFFILIATE_URLS: Record<string, string> = {
  ON:
    process.env.NEXT_PUBLIC_ONTARIO_INSURANCE_AFFILIATE_URL ||
    ONTARIO_INSURANCE_FALLBACK_URL,
};

/**
 * Resolves the centralized insurance affiliate quote URL for a given Canadian province.
 */
export function getInsuranceAffiliateUrl(region: 'ON' | 'BC' | string = 'ON'): string {
  const normalized = region.trim().toUpperCase();
  if (normalized === 'ON' || normalized === 'ONTARIO') {
    return (
      process.env.NEXT_PUBLIC_ONTARIO_INSURANCE_AFFILIATE_URL ||
      INSURANCE_AFFILIATE_URLS.ON ||
      ONTARIO_INSURANCE_FALLBACK_URL
    );
  }
  return INSURANCE_AFFILIATE_URLS[normalized] || ONTARIO_INSURANCE_FALLBACK_URL;
}
