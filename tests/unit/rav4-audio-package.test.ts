import { describe, it, expect } from 'vitest';
import { RAV4_AUDIO_PACKAGE, getProductBySlug } from '@/lib/products';
import { MODS_CONFIG } from '@/data/mods';
import { FALLBACK_AFFILIATES } from '@/lib/db/affiliates';
import { GEAR_MARKET_CATALOG } from '@/data/gear/catalog';
import affiliateProductsJson from '@/lib/data/affiliate-products.json';

describe('RAV4 Stealth OEM+ Audio Package & Catalog Verification', () => {
  const expectedAudioSlugs = [
    'beat-sonic-ena-3t3',
    'alpine-pwe-s800',
    'dash-speakers-rav4',
    'kicker-cs-door-speakers-rav4',
  ];

  it('defines the 4 core audio package components in lib/products.ts', () => {
    expect(RAV4_AUDIO_PACKAGE.length).toBeGreaterThanOrEqual(4);

    for (const slug of expectedAudioSlugs) {
      const product = getProductBySlug(slug);
      expect(product).toBeDefined();
      expect(product?.models).toContain('rav4');
      expect(product?.category).toBe('Audio & Electronics');
      expect(product?.destinationUrl).toBeDefined();
      expect(product?.destinationUrl).not.toContain('404');
    }
  });

  it('contains proper accessories and adapters for speakers in lib/products.ts', () => {
    const dashSpeakers = getProductBySlug('dash-speakers-rav4');
    expect(dashSpeakers?.accessories).toBeDefined();
    expect(dashSpeakers?.accessories?.some((a) => a.slug === 'metra-72-8110-harness')).toBe(true);

    const doorSpeakers = getProductBySlug('kicker-cs-door-speakers-rav4');
    expect(doorSpeakers?.accessories).toBeDefined();
    expect(doorSpeakers?.accessories?.some((a) => a.slug === 'metra-82-8148-brackets')).toBe(true);
    expect(doorSpeakers?.accessories?.some((a) => a.slug === 'metra-72-8104-harness')).toBe(true);
  });

  it('integrates all audio package components into MODS_CONFIG in src/data/mods.ts', () => {
    for (const slug of expectedAudioSlugs) {
      const mod = MODS_CONFIG.find((m) => m.slug === slug);
      expect(mod).toBeDefined();
      expect(mod?.models).toContain('rav4');
      expect(mod?.category).toBe('Audio & Electronics');
      expect(mod?.compatibility).toBeDefined();
    }
  });

  it('integrates all audio package components into affiliate-products.json', () => {
    for (const slug of expectedAudioSlugs) {
      const item = affiliateProductsJson.find((p) => p.slug === slug);
      expect(item).toBeDefined();
      expect(item?.models).toContain('rav4');
      expect(item?.category).toBe('Audio & Electronics');
    }
  });

  it('registers all audio slugs and accessories in FALLBACK_AFFILIATES to prevent 404s', () => {
    const allSlugsToCheck = [
      ...expectedAudioSlugs,
      'alpine-pwe-s8',
      'metra-72-8110-harness',
      'metra-82-8148-brackets',
      'metra-72-8104-harness',
    ];

    for (const slug of allSlugsToCheck) {
      const record = FALLBACK_AFFILIATES[slug];
      expect(record).toBeDefined();
      expect(record.isActive).toBe(true);
      expect(record.destinationUrl).toBeDefined();
      expect(record.destinationUrl).not.toBe('');
      // Canadian Amazon links should have tag=toyotawaits-20
      if (record.destinationUrl.includes('amazon.ca')) {
        expect(record.destinationUrl).toContain('tag=toyotawaits-20');
      }
    }
  });

  it('registers search keywords in GEAR_MARKET_CATALOG for all audio components', () => {
    for (const slug of expectedAudioSlugs) {
      const gearConfig = GEAR_MARKET_CATALOG[slug];
      expect(gearConfig).toBeDefined();
      expect(gearConfig.searchKeywordsCA).toBeDefined();
      expect(gearConfig.searchKeywordsUS).toBeDefined();
    }
  });
});
