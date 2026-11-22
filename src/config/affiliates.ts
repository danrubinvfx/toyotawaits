/**
 * src/config/affiliates.ts
 *
 * Centralized Affiliate Configuration & Regional Financial/Partner CPA Routing
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

export const CA_TRADEIN_FALLBACK_URL =
  'https://www.clutch.ca/sell?utm_source=toyotawaits&utm_medium=referral&utm_campaign=delivery_prep';
export const US_TRADEIN_FALLBACK_URL =
  'https://www.carvana.com/sell-my-car?utm_source=toyotawaits&utm_medium=referral&utm_campaign=delivery_prep';

/**
 * Resolves the instant trade-in cash valuation partner URL for CA or US markets.
 */
export function getTradeInAffiliateUrl(market: 'CA' | 'US' = 'CA'): string {
  if (market === 'US') {
    return process.env.NEXT_PUBLIC_US_TRADEIN_AFFILIATE_URL || US_TRADEIN_FALLBACK_URL;
  }
  return process.env.NEXT_PUBLIC_CA_TRADEIN_AFFILIATE_URL || CA_TRADEIN_FALLBACK_URL;
}

export const CA_TIRE_FALLBACK_URL =
  'https://www.blackcircles.ca/en?utm_source=toyotawaits&utm_medium=referral&utm_campaign=tires_guide';
export const US_TIRE_FALLBACK_URL =
  'https://www.tirerack.com/?utm_source=toyotawaits&utm_medium=referral&utm_campaign=tires_guide';

/**
 * Resolves the installed winter tire & rim package retailer URL for CA or US markets.
 */
export function getTireRetailerAffiliateUrl(
  market: 'CA' | 'US' = 'CA',
  tireSize?: string
): string {
  const baseUrl =
    market === 'US'
      ? process.env.NEXT_PUBLIC_US_TIRE_AFFILIATE_URL || US_TIRE_FALLBACK_URL
      : process.env.NEXT_PUBLIC_CA_TIRE_AFFILIATE_URL || CA_TIRE_FALLBACK_URL;

  if (!tireSize || !tireSize.trim()) {
    return baseUrl;
  }

  try {
    const url = new URL(baseUrl);
    url.searchParams.set('size', tireSize.trim());
    return url.toString();
  } catch {
    return baseUrl;
  }
}

export type DirectBrandPartner = 'muslogy' | 'tuxmat' | 'fitcamx';

export const MUSLOGY_DIRECT_PARTNER_URL =
  'https://muslogy.myshopify.com/discount/Toyotawaits?rs_ref=3f6lkniA';

export const DIRECT_BRAND_PARTNER_BADGES: Record<DirectBrandPartner, string> = {
  muslogy: '2% Off • Code: Toyotawaits',
  tuxmat: 'Direct Manufacturer Store',
  fitcamx: 'OEM-Look Dashcam Store',
};

/**
 * Resolves direct brand partner URLs with environment variable overrides and market defaults.
 */
export function getDirectBrandPartnerUrl(
  brand: DirectBrandPartner,
  market: 'CA' | 'US' = 'CA'
): string {
  if (brand === 'muslogy') {
    return MUSLOGY_DIRECT_PARTNER_URL;
  }
  if (brand === 'tuxmat') {
    return (
      process.env.NEXT_PUBLIC_TUXMAT_AFFILIATE_URL ||
      (market === 'CA' ? 'https://www.tuxmat.ca' : 'https://www.tuxmat.com')
    );
  }
  return process.env.NEXT_PUBLIC_FITCAMX_AFFILIATE_URL || 'https://fitcamx.com';
}
