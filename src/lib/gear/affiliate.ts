/**
 * ToyotaWaits Gear Affiliate Link & Tracking Tag System
 * Enforces standardized US ('toyotawaits07-20') and CA ('toyotawaits-20') Associate tags,
 * while preserving approved intentional exceptions (such as the 7 Prius guide redirects using 'danrubin03-20').
 */

export const CA_ASSOCIATE_TAG = 'toyotawaits-20';
export const US_ASSOCIATE_TAG = 'toyotawaits07-20';
export const PRIUS_SPECIAL_TAG = 'danrubin03-20';

export const DEFAULT_CA_AFFILIATE_TAG = CA_ASSOCIATE_TAG;
export const DEFAULT_US_AFFILIATE_TAG = US_ASSOCIATE_TAG;

export const PRIUS_GUIDE_SLUGS = new Set([
  'fitcamx-prius',
  'prius-mud-flaps',
  'prius-bumper-protector',
  'prius-all-weather-liners',
  'prius-console-organizer',
  'prius-screen-protector',
  'prius-prime-portable-charger',
]);

export const KNOWN_MODEL_NAMES: Record<string, string> = {
  rav4: 'RAV4',
  sienna: 'Sienna',
  'grand-highlander': 'Grand Highlander',
  highlander: 'Highlander',
  'land-cruiser': 'Land Cruiser',
  prius: 'Prius',
  'corolla-cross': 'Corolla Cross',
  camry: 'Camry',
  tacoma: 'Tacoma',
  tundra: 'Tundra',
};

/**
 * Resolves proper vehicle display model name (e.g. 'sienna' -> 'Sienna')
 */
export function getModelDisplayName(modelSlug?: string): string {
  if (!modelSlug || modelSlug === 'all') return 'RAV4';
  const clean = modelSlug.toLowerCase().trim();
  return KNOWN_MODEL_NAMES[clean] || clean.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Determines whether a URL is an Amazon search query destination.
 */
export function isAmazonSearchUrl(url: string): boolean {
  if (!url) return false;
  return url.includes('/s?') || url.includes('/s/') || url.includes('/s?k=');
}

/**
 * Determines whether a URL is an Amazon direct product (ASIN) destination.
 */
export function isAmazonDirectProductUrl(url: string): boolean {
  if (!url) return false;
  return url.includes('/dp/') || url.includes('/gp/product/');
}

/**
 * Standardizes button label across all shopping cards and sections:
 * - Amazon search destination: "Search Amazon"
 * - Direct product destination: "View Product on Amazon"
 * - Fallback: "View on Amazon"
 */
export function getAffiliateButtonLabel(url: string): 'Search Amazon' | 'View Product on Amazon' | 'View on Amazon' {
  if (isAmazonSearchUrl(url)) {
    return 'Search Amazon';
  }
  if (isAmazonDirectProductUrl(url)) {
    return 'View Product on Amazon';
  }
  return 'View on Amazon';
}

/**
 * Standardizes image-link and CTA accessibility labels to accurately describe destination:
 * - Search destination: "Search Amazon for {title}"
 * - Direct product destination: "View {title} on Amazon"
 */
export function getImageLinkAriaLabel(title: string, url: string): string {
  if (isAmazonSearchUrl(url)) {
    return `Search Amazon for ${title}`;
  }
  return `View ${title} on Amazon`;
}

/**
 * Resolves the appropriate Amazon Associate tag for a given market context,
 * preserving intentional exceptions like the 7 Prius guide redirects.
 */
export function getAssociateTag(
  marketOrIsUs: 'US' | 'CA' | string | boolean = 'CA',
  slug?: string
): string {
  const isUs = marketOrIsUs === 'US' || marketOrIsUs === true;
  if (isUs) {
    return (
      process.env.NEXT_PUBLIC_AMAZON_US_TAG ||
      process.env.NEXT_PUBLIC_AMAZON_US_AFFILIATE_TAG ||
      US_ASSOCIATE_TAG
    );
  }

  // Canadian market context
  if (slug && PRIUS_GUIDE_SLUGS.has(slug)) {
    return PRIUS_SPECIAL_TAG; // 'danrubin03-20'
  }

  return (
    process.env.NEXT_PUBLIC_AMAZON_CA_TAG ||
    process.env.NEXT_PUBLIC_AMAZON_CA_AFFILIATE_TAG ||
    CA_ASSOCIATE_TAG
  );
}

/**
 * Dynamically injects active vehicle model into shared multi-vehicle accessories.
 * Ensures model-specific part numbers (like RAV4 G92DH-42010) are NOT assumed to fit other vehicles.
 */
export function injectActiveModelIntoQuery(
  query: string,
  activeModel?: string,
  slug?: string
): string {
  if (!activeModel || activeModel === 'all') return query;
  const cleanModel = activeModel.toLowerCase().trim();
  const modelName = getModelDisplayName(cleanModel);

  // 1. Hybrid battery filter mesh:
  // RAV4 uses part G92DH-42010. Sienna uses a completely different intake screen.
  if (slug === 'hybrid-battery-filter-mesh' || query.toLowerCase().includes('battery intake filter')) {
    if (cleanModel === 'sienna') {
      return 'Toyota Sienna 2021-2025 hybrid battery air intake filter screen';
    }
    if (cleanModel === 'rav4') {
      return 'Toyota RAV4 2019-2025 hybrid battery intake filter mesh G92DH-42010';
    }
    return `Toyota ${modelName} hybrid battery air intake filter screen`;
  }

  // 2. Door sill scuff plates:
  if (slug === 'door-sill-scuff-guards' || query.toLowerCase().includes('door sill protector')) {
    if (cleanModel === 'grand-highlander') {
      return 'Toyota Grand Highlander 2024-2025 door sill protector scuff plate';
    }
    if (cleanModel === 'corolla-cross') {
      return 'Toyota Corolla Cross 2022-2025 door sill protector scuff plate';
    }
    if (cleanModel === 'rav4') {
      return 'Toyota RAV4 2019-2025 door sill protector scuff plate';
    }
    return `Toyota ${modelName} door sill protector scuff plate`;
  }

  // 3. Generic substitution for other multi-vehicle queries:
  if (/toyota\s+rav4/i.test(query)) {
    return query.replace(/toyota\s+rav4/gi, `Toyota ${modelName}`);
  }
  if (/\brav4\b/i.test(query)) {
    return query.replace(/\brav4\b/gi, modelName);
  }

  return query;
}

/**
 * Sanitizes and applies the standard Associate tag to an existing Amazon URL.
 * Preserves approved intentional exceptions (such as danrubin03-20 on Canadian Prius items)
 * and enforces toyotawaits07-20 (US) or toyotawaits-20 (CA).
 */
export function sanitizeAmazonAffiliateUrl(
  url: string,
  marketOrIsUs: 'US' | 'CA' | string | boolean = 'CA',
  slug?: string
): string {
  const isUs = marketOrIsUs === 'US' || marketOrIsUs === true;
  const targetTag = getAssociateTag(marketOrIsUs, slug);
  const targetDomain = isUs ? 'www.amazon.com' : 'www.amazon.ca';

  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('amazon.')) {
      parsed.hostname = targetDomain;
      // Preserve custom tag if intentional on CA, else set target tag
      const existingTag = parsed.searchParams.get('tag');
      if (!isUs && existingTag === PRIUS_SPECIAL_TAG && slug && PRIUS_GUIDE_SLUGS.has(slug)) {
        parsed.searchParams.set('tag', PRIUS_SPECIAL_TAG);
      } else {
        parsed.searchParams.set('tag', targetTag);
      }
      return parsed.toString();
    }
  } catch {
    // If not a valid parseable URL, perform safe string substitutions
    let result = url;
    if (isUs) {
      result = result.replace(/amazon\.ca/g, 'amazon.com');
      result = result.replace(/tag=[^&]+/g, `tag=${targetTag}`);
    } else {
      result = result.replace(/amazon\.com/g, 'amazon.ca');
      if (!url.includes(PRIUS_SPECIAL_TAG)) {
        result = result.replace(/tag=[^&]+/g, `tag=${targetTag}`);
      }
    }
    return result;
  }

  return url;
}
