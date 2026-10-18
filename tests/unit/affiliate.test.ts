import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getAmazonAffiliateUrl,
  buildAmazonAffiliateUrl,
  DEFAULT_AMAZON_AFFILIATE_TAG,
  AFFILIATE_LINKS,
} from '@/lib/affiliate';

describe('Affiliate URL Utility (src/lib/affiliate.ts)', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_AMAZON_US_TAG;
    delete process.env.NEXT_PUBLIC_AMAZON_CA_TAG;
    delete process.env.NEXT_PUBLIC_AMAZON_TAG;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe('getAmazonAffiliateUrl', () => {
    it('defaults to Canadian market (amazon.ca) and default tag', () => {
      const url = getAmazonAffiliateUrl({ query: 'NOCO GB40' });
      expect(url).toBe('https://www.amazon.ca/s?k=NOCO%20GB40&tag=toyotawaits-20');
    });

    it('routes to US market (amazon.com) when market is US', () => {
      const url = getAmazonAffiliateUrl({ query: 'NOCO GB40', market: 'US' });
      expect(url).toBe('https://www.amazon.com/s?k=NOCO%20GB40&tag=toyotawaits-20');
    });

    it('builds direct ASIN product links', () => {
      const caUrl = getAmazonAffiliateUrl({ asin: 'B09GLVMB76', market: 'CA' });
      expect(caUrl).toBe('https://www.amazon.ca/dp/B09GLVMB76?tag=toyotawaits-20');

      const usUrl = getAmazonAffiliateUrl({ asin: 'B09GLVMB76', market: 'US' });
      expect(usUrl).toBe('https://www.amazon.com/dp/B09GLVMB76?tag=toyotawaits-20');
    });

    it('properly encodes special characters in queries', () => {
      const url = getAmazonAffiliateUrl({ query: 'Toyota RAV4 & Prime 2026+', market: 'CA' });
      expect(url).toContain('https://www.amazon.ca/s?k=');
      expect(url).toContain('Toyota%20RAV4%20%26%20Prime%202026%2B');
    });

    it('uses NEXT_PUBLIC_AMAZON_US_TAG environment variable when set for US', () => {
      process.env.NEXT_PUBLIC_AMAZON_US_TAG = 'usassociate-20';
      const url = getAmazonAffiliateUrl({ query: 'dashcam', market: 'US' });
      expect(url).toBe('https://www.amazon.com/s?k=dashcam&tag=usassociate-20');
    });

    it('uses NEXT_PUBLIC_AMAZON_CA_TAG environment variable when set for CA', () => {
      process.env.NEXT_PUBLIC_AMAZON_CA_TAG = 'caassociate-20';
      const url = getAmazonAffiliateUrl({ query: 'dashcam', market: 'CA' });
      expect(url).toBe('https://www.amazon.ca/s?k=dashcam&tag=caassociate-20');
    });

    it('falls back to NEXT_PUBLIC_AMAZON_TAG if US specific tag is absent', () => {
      process.env.NEXT_PUBLIC_AMAZON_TAG = 'generic-tag-20';
      const url = getAmazonAffiliateUrl({ asin: 'B09GLVMB76', market: 'US' });
      expect(url).toBe('https://www.amazon.com/dp/B09GLVMB76?tag=generic-tag-20');
    });

    it('returns root store with affiliate tag when query and asin are omitted', () => {
      expect(getAmazonAffiliateUrl({ market: 'CA' })).toBe('https://www.amazon.ca/?tag=toyotawaits-20');
      expect(getAmazonAffiliateUrl({ market: 'US' })).toBe('https://www.amazon.com/?tag=toyotawaits-20');
    });
  });

  describe('buildAmazonAffiliateUrl', () => {
    it('supports string query with default CA market', () => {
      const url = buildAmazonAffiliateUrl('FitcamX RAV4');
      expect(url).toBe('https://www.amazon.ca/s?k=FitcamX%20RAV4&tag=toyotawaits-20');
    });

    it('supports string query with market passed as second argument', () => {
      const url = buildAmazonAffiliateUrl('FitcamX RAV4', 'US');
      expect(url).toBe('https://www.amazon.com/s?k=FitcamX%20RAV4&tag=toyotawaits-20');
    });

    it('supports string query with custom tag string', () => {
      const url = buildAmazonAffiliateUrl('FitcamX RAV4', 'danrubin03-20');
      expect(url).toBe('https://www.amazon.ca/s?k=FitcamX%20RAV4&tag=danrubin03-20');
    });

    it('supports AffiliateParams object parameter', () => {
      const url = buildAmazonAffiliateUrl({ asin: 'B09GLVMB76', market: 'US' });
      expect(url).toBe('https://www.amazon.com/dp/B09GLVMB76?tag=toyotawaits-20');
    });
  });

  describe('DEFAULT_AMAZON_AFFILIATE_TAG', () => {
    it('exports default associate tag', () => {
      expect(DEFAULT_AMAZON_AFFILIATE_TAG).toBe('toyotawaits-20');
    });
  });

  describe('AFFILIATE_LINKS', () => {
    it('exports centralized affiliate URL constants with default values', () => {
      expect(AFFILIATE_LINKS.TORKLIFT).toBe(
        'https://torkliftcentral.com/2021-2027-toyota-sienna-featured-stainless-steel-rust-free-trailer-hitch-receiver'
      );
      expect(AFFILIATE_LINKS.AMAZON_CURT_HITCH).toBe('https://www.amazon.com/dp/B0BJ5928HS');
      expect(AFFILIATE_LINKS.AMAZON_WIRING).toBe('https://www.amazon.com/s?k=CURT+56456');
      expect(AFFILIATE_LINKS.TEKONSHA_WIRING).toBe('https://www.amazon.com/s?k=Tekonsha+118844');
      expect(AFFILIATE_LINKS.ANTI_RATTLE_CLAMP).toBe('https://www.amazon.com/s?k=2+inch+anti+rattle+hitch+tightener');
      expect(AFFILIATE_LINKS.AIR_LIFT_1000).toBe('https://www.amazon.com/s?k=Air+Lift+60858');
    });
  });
});
