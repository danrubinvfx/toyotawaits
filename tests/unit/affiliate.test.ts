import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getAmazonAffiliateUrl,
  buildAmazonAffiliateUrl,
  shouldStripAffiliateTags,
  DEFAULT_AMAZON_AFFILIATE_TAG,
  DEFAULT_AMAZON_US_AFFILIATE_TAG,
  AFFILIATE_LINKS,
} from '@/lib/affiliate';
import { sanitizeUrlForAudit } from '../../scripts/audit-all-links';

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
      expect(url).toBe('https://www.amazon.com/s?k=NOCO%20GB40&tag=toyotawaits07-20');
    });

    it('builds direct ASIN product links', () => {
      const caUrl = getAmazonAffiliateUrl({ asin: 'B09GLVMB76', market: 'CA' });
      expect(caUrl).toBe('https://www.amazon.ca/dp/B09GLVMB76?tag=toyotawaits-20');

      const usUrl = getAmazonAffiliateUrl({ asin: 'B09GLVMB76', market: 'US' });
      expect(usUrl).toBe('https://www.amazon.com/dp/B09GLVMB76?tag=toyotawaits07-20');
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
      expect(getAmazonAffiliateUrl({ market: 'US' })).toBe('https://www.amazon.com/?tag=toyotawaits07-20');
    });
  });

  describe('buildAmazonAffiliateUrl', () => {
    it('supports string query with default CA market', () => {
      const url = buildAmazonAffiliateUrl('FitcamX RAV4');
      expect(url).toBe('https://www.amazon.ca/s?k=FitcamX%20RAV4&tag=toyotawaits-20');
    });

    it('supports string query with market passed as second argument', () => {
      const url = buildAmazonAffiliateUrl('FitcamX RAV4', 'US');
      expect(url).toBe('https://www.amazon.com/s?k=FitcamX%20RAV4&tag=toyotawaits07-20');
    });

    it('supports string query with custom tag string', () => {
      const url = buildAmazonAffiliateUrl('FitcamX RAV4', 'toyotawaits-20');
      expect(url).toBe('https://www.amazon.ca/s?k=FitcamX%20RAV4&tag=toyotawaits-20');
    });

    it('supports AffiliateParams object parameter', () => {
      const url = buildAmazonAffiliateUrl({ asin: 'B09GLVMB76', market: 'US' });
      expect(url).toBe('https://www.amazon.com/dp/B09GLVMB76?tag=toyotawaits07-20');
    });
  });

  describe('DEFAULT_AMAZON_AFFILIATE_TAG', () => {
    it('exports default associate tag', () => {
      expect(DEFAULT_AMAZON_AFFILIATE_TAG).toBe('toyotawaits-20');
    });

    it('exports default US associate tag', () => {
      expect(DEFAULT_AMAZON_US_AFFILIATE_TAG).toBe('toyotawaits07-20');
    });
  });

  describe('AFFILIATE_LINKS', () => {
    it('exports centralized affiliate URL constants with default values', () => {
      expect(AFFILIATE_LINKS.TORKLIFT).toBe(
        'https://torkliftcentral.com/2021-2027-toyota-sienna-featured-stainless-steel-rust-free-trailer-hitch-receiver'
      );
      expect(AFFILIATE_LINKS.AMAZON_CURT_HITCH).toBe('https://www.amazon.com/dp/B0BJ5928HS?tag=toyotawaits07-20');
      expect(AFFILIATE_LINKS.AMAZON_WIRING).toBe('https://www.amazon.com/s?k=CURT+56456&tag=toyotawaits07-20');
      expect(AFFILIATE_LINKS.TEKONSHA_WIRING).toBe('https://www.amazon.com/s?k=Tekonsha+118844&tag=toyotawaits07-20');
      expect(AFFILIATE_LINKS.ANTI_RATTLE_CLAMP).toBe('https://www.amazon.com/s?k=2+inch+anti+rattle+hitch+tightener&tag=toyotawaits07-20');
      expect(AFFILIATE_LINKS.AIR_LIFT_1000).toBe('https://www.amazon.com/s?k=Air+Lift+60858&tag=toyotawaits07-20');
    });
  });

  describe('Admin Opt-Out (tw_admin_opt_out in localStorage)', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    afterEach(() => {
      localStorage.clear();
    });

    it('returns shouldStripAffiliateTags() as false when tw_admin_opt_out is not set', () => {
      expect(shouldStripAffiliateTags()).toBe(false);
    });

    it('returns shouldStripAffiliateTags() as true when tw_admin_opt_out is true', () => {
      localStorage.setItem('tw_admin_opt_out', 'true');
      expect(shouldStripAffiliateTags()).toBe(true);
    });

    it('omits tag from buildAmazonAffiliateUrl when opt-out is enabled', () => {
      localStorage.setItem('tw_admin_opt_out', 'true');
      const url = buildAmazonAffiliateUrl('Dashcam');
      expect(url).toBe('https://www.amazon.ca/s?k=Dashcam');
      expect(url).not.toContain('tag=');
    });

    it('omits tag from direct ASIN URL when opt-out is enabled', () => {
      localStorage.setItem('tw_admin_opt_out', 'true');
      const url = buildAmazonAffiliateUrl({ asin: 'B09GLVMB76', market: 'US' });
      expect(url).toBe('https://www.amazon.com/dp/B09GLVMB76');
      expect(url).not.toContain('tag=');
    });

    it('omits tag from getAmazonAffiliateUrl when opt-out is enabled', () => {
      localStorage.setItem('tw_admin_opt_out', 'true');
      const url = getAmazonAffiliateUrl({ query: 'NOCO GB40', market: 'CA' });
      expect(url).toBe('https://www.amazon.ca/s?k=NOCO%20GB40');
      expect(url).not.toContain('tag=');
    });
  });

  describe('Audit Sanitization (sanitizeUrlForAudit)', () => {
    it('strips tag, linkCode, and ascsubtag from Amazon URLs', () => {
      const raw = 'https://www.amazon.ca/s?k=TuxMat&tag=toyotawaits-20&linkCode=ll2&ascsubtag=12345';
      const clean = sanitizeUrlForAudit(raw);
      expect(clean).toBe('https://www.amazon.ca/s?k=TuxMat');
      expect(clean).not.toContain('tag=');
      expect(clean).not.toContain('linkCode=');
      expect(clean).not.toContain('ascsubtag=');
    });

    it('handles direct product URLs cleanly without tracking parameters', () => {
      const raw = 'https://www.amazon.com/dp/B0BJ5928HS?tag=toyotawaits07-20&linkCode=as2';
      const clean = sanitizeUrlForAudit(raw);
      expect(clean).toBe('https://www.amazon.com/dp/B0BJ5928HS');
      expect(clean).not.toContain('tag=');
      expect(clean).not.toContain('linkCode=');
    });
  });
});
