/**
 * ToyotaWaits Gear Affiliate Link & Tracking Tag System
 * Enforces standardized US ('toyotawaits07-20') and CA ('toyotawaits-20') Associate tags.
 */

export const CA_ASSOCIATE_TAG = 'toyotawaits-20';
export const US_ASSOCIATE_TAG = 'toyotawaits07-20';

export const DEFAULT_CA_AFFILIATE_TAG = CA_ASSOCIATE_TAG;
export const DEFAULT_US_AFFILIATE_TAG = US_ASSOCIATE_TAG;

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
 * Dynamically injects active vehicle model into shared multi-vehicle accessories
 * (e.g. hybrid battery air filter, silicone key fob covers, door sill protectors)
 */
export function injectActiveModelIntoQuery(query: string, activeModel?: string): string {
  if (!activeModel || activeModel === 'all') return query;
  const modelName = getModelDisplayName(activeModel);

  // If query explicitly contains 'Toyota RAV4', replace with 'Toyota <Model>'
  if (/toyota\s+rav4/i.test(query)) {
    return query.replace(/toyota\s+rav4/gi, `Toyota ${modelName}`);
  }
  // If query contains standalone 'RAV4', replace with '<Model>'
  if (/\brav4\b/i.test(query)) {
    return query.replace(/\brav4\b/gi, modelName);
  }
  return query;
}

/**
 * Resolves the appropriate Amazon Associate tag for a given market context.
 */
export function getAssociateTag(marketOrIsUs: 'US' | 'CA' | string | boolean = 'CA'): string {
  const isUs = marketOrIsUs === 'US' || marketOrIsUs === true;
  return isUs ? US_ASSOCIATE_TAG : CA_ASSOCIATE_TAG;
}

/**
 * Sanitizes and applies the standard Associate tag to an existing Amazon URL.
 * Automatically strips obsolete/legacy tags (such as danrubin03-20) and enforces
 * toyotawaits07-20 (US) or toyotawaits-20 (CA).
 */
export function sanitizeAmazonAffiliateUrl(
  url: string,
  marketOrIsUs: 'US' | 'CA' | string | boolean = 'CA'
): string {
  const isUs = marketOrIsUs === 'US' || marketOrIsUs === true;
  const targetTag = isUs ? US_ASSOCIATE_TAG : CA_ASSOCIATE_TAG;
  const targetDomain = isUs ? 'www.amazon.com' : 'www.amazon.ca';

  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('amazon.')) {
      parsed.hostname = targetDomain;
      parsed.searchParams.set('tag', targetTag);
      return parsed.toString();
    }
  } catch {
    // If not a valid parseable URL, perform safe string substitutions
    let result = url;
    if (isUs) {
      result = result.replace(/amazon\.ca/g, 'amazon.com');
      result = result.replace(/tag=[^&]+/g, `tag=${US_ASSOCIATE_TAG}`);
    } else {
      result = result.replace(/amazon\.com/g, 'amazon.ca');
      result = result.replace(/tag=[^&]+/g, `tag=${CA_ASSOCIATE_TAG}`);
    }
    return result;
  }

  return url;
}
