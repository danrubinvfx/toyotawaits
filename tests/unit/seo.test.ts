import { describe, it, expect } from 'vitest';
import sitemap from '@/app/sitemap';
import robots from '@/app/robots';
import { metadata as layoutMetadata, jsonLd } from '@/app/layout';
import { metadata as homeMetadata } from '@/app/page';

describe('Technical SEO & Discovery Configuration', () => {
  it('generates a valid sitemap with required URLs, priorities, and change frequencies', async () => {
    const sitemapEntries = await sitemap();

    // Required 1: https://toyotawaits.ca (priority 1.0, daily)
    const rootEntry = sitemapEntries.find((e) => e.url === 'https://toyotawaits.ca');
    expect(rootEntry).toBeDefined();
    expect(rootEntry?.priority).toBe(1.0);
    expect(rootEntry?.changeFrequency).toBe('daily');

    // Required 2: https://toyotawaits.ca/submit (priority 0.8, weekly)
    const submitEntry = sitemapEntries.find((e) => e.url === 'https://toyotawaits.ca/submit');
    expect(submitEntry).toBeDefined();
    expect(submitEntry?.priority).toBe(0.8);
    expect(submitEntry?.changeFrequency).toBe('weekly');

    // Required 3: https://toyotawaits.ca/guides/rav4-se-mods (priority 0.8, monthly)
    const guideEntry = sitemapEntries.find(
      (e) => e.url === 'https://toyotawaits.ca/guides/rav4-se-mods'
    );
    expect(guideEntry).toBeDefined();
    expect(guideEntry?.priority).toBe(0.8);
    expect(guideEntry?.changeFrequency).toBe('monthly');

    // Prius Mods Guide: https://toyotawaits.ca/guides/prius-mods (priority 0.8, weekly)
    const priusGuideEntry = sitemapEntries.find(
      (e) => e.url === 'https://toyotawaits.ca/guides/prius-mods'
    );
    expect(priusGuideEntry).toBeDefined();
    expect(priusGuideEntry?.priority).toBe(0.8);
    expect(priusGuideEntry?.changeFrequency).toBe('weekly');

    // Dynamic vehicle model and province routes (priority 0.7 - 0.9)
    const siennaEntry = sitemapEntries.find((e) => e.url === 'https://toyotawaits.ca/sienna');
    expect(siennaEntry).toBeDefined();
    expect(siennaEntry?.priority).toBe(0.9);

    const rav4HevBcEntry = sitemapEntries.find(
      (e) => e.url === 'https://toyotawaits.ca/rav4/hev/bc'
    );
    expect(rav4HevBcEntry).toBeDefined();
    expect(rav4HevBcEntry?.priority).toBe(0.7);
  });

  it('gracefully falls back to static and catalog routes if Supabase query fails', async () => {
    const prevEnv = process.env.NEXT_PUBLIC_SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock-failing-supabase.local';
    try {
      const entries = await sitemap();
      expect(entries.some((e) => e.url === 'https://toyotawaits.ca')).toBe(true);
      expect(entries.some((e) => e.url === 'https://toyotawaits.ca/submit')).toBe(true);
      expect(entries.some((e) => e.url === 'https://toyotawaits.ca/rav4')).toBe(true);
    } finally {
      process.env.NEXT_PUBLIC_SUPABASE_URL = prevEnv;
    }
  });

  it('generates a valid robots.txt disallowing /api/ and internal paths and pointing to sitemap.xml', () => {
    const robotsConfig = robots();

    expect(robotsConfig.sitemap).toBe('https://toyotawaits.ca/sitemap.xml');

    const rules = Array.isArray(robotsConfig.rules)
      ? robotsConfig.rules[0]
      : robotsConfig.rules;

    expect(rules).toBeDefined();
    expect(rules?.userAgent).toBe('*');
    expect(rules?.allow).toBe('/');
    expect(rules?.disallow).toContain('/api/');
    expect(rules?.disallow).toContain('/admin/');
    expect(rules?.disallow).toContain('/out/');
  });

  it('exports root metadata matching required SEO title, description, and keywords', () => {
    expect(layoutMetadata.title).toBe(
      'ToyotaWaits | Canadian Toyota Wait Times & Allocation Tracker'
    );
    expect(layoutMetadata.description).toContain(
      'Crowdsourced Canadian Toyota delivery timelines'
    );
    expect(layoutMetadata.keywords).toEqual([
      'toyota waits',
      'toyota wait tracker',
      'toyota wait times canada',
      'canadian toyota tracker',
      'toyota allocation canada',
      'rav4 prime wait time',
    ]);
    expect(layoutMetadata.metadataBase?.toString()).toBe('https://www.toyotawaits.ca/');
    expect(layoutMetadata.openGraph?.title).toBe(
      'ToyotaWaits | Canadian Toyota Wait Times & Allocation Tracker'
    );
    expect(layoutMetadata.openGraph?.siteName).toBe('ToyotaWaits');
    expect((layoutMetadata.openGraph as { type?: string })?.type).toBe('website');
    expect(layoutMetadata.verification?.google).toBe(
      '3gM-Rt6pfp2XODYUowsn5BNJt0CIfuxUoY-9ugCPK_E'
    );
  });

  it('exports home page metadata consistent with root metadata', () => {
    expect(homeMetadata.title).toBe(
      'ToyotaWaits | Canadian Toyota Wait Times & Allocation Tracker'
    );
    expect(homeMetadata.description).toContain(
      'Crowdsourced Canadian Toyota delivery timelines'
    );
    expect(homeMetadata.alternates?.canonical).toBe('https://www.toyotawaits.ca');
  });

  it('defines valid Schema.org WebApplication and Organization JSON-LD entities', () => {
    expect(jsonLd['@context']).toBe('https://schema.org');
    const webApp = jsonLd['@graph'].find((e) => e['@type'] === 'WebApplication');
    expect(webApp).toBeDefined();
    expect(webApp?.name).toBe('ToyotaWaits');
    expect(webApp?.url).toBe('https://www.toyotawaits.ca');
    expect(webApp?.applicationCategory).toBe('AutomotiveApplication');
    expect(webApp?.operatingSystem).toBe('All');
    expect(webApp?.description).toBe(
      'Community wait time tracker for Canadian Toyota allocations.'
    );

    const org = jsonLd['@graph'].find((e) => e['@type'] === 'Organization');
    expect(org).toBeDefined();
    expect(org?.name).toBe('ToyotaWaits');
    expect(org?.url).toBe('https://www.toyotawaits.ca');
    expect(org?.description).toBe(
      'Community wait time tracker for Canadian Toyota allocations.'
    );
  });
});
