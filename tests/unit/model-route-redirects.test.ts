import { describe, it, expect } from 'vitest';
import nextConfig from '../../next.config';
import { generateMetadata } from '@/app/wait-times/[model]/page';

describe('Duplicate Model Route Equity & 301 Redirect Consolidation', () => {
  const models = [
    'rav4',
    'sienna',
    'corolla-cross',
    'grand-highlander',
    'land-cruiser',
    'camry',
    'prius',
    'tacoma',
    'tundra',
    'sequoia',
    '4runner',
    'highlander',
    'corolla',
  ];

  it('configures permanent (301) redirects for all Canadian vehicle root model paths', async () => {
    const redirects = await (nextConfig.redirects ? nextConfig.redirects() : []);

    for (const model of models) {
      const match = redirects.find((r) => r.source === `/${model}`);
      expect(match, `Expected redirect rule for /${model}`).toBeDefined();
      expect(match?.destination).toBe(`/wait-times/${model}`);
      expect(match?.permanent).toBe(true);
    }
  });

  it('configures permanent redirects for faceted sub-paths', async () => {
    const redirects = await (nextConfig.redirects ? nextConfig.redirects() : []);

    const facetedTwoLevel = redirects.find(
      (r) =>
        r.source.includes(':powertrain/:province') &&
        r.destination === '/wait-times/:model' &&
        r.permanent === true
    );
    expect(facetedTwoLevel).toBeDefined();

    const facetedOneLevel = redirects.find(
      (r) =>
        r.source.includes('/:powertrain') &&
        !r.source.includes(':province') &&
        r.destination === '/wait-times/:model' &&
        r.permanent === true
    );
    expect(facetedOneLevel).toBeDefined();
  });

  it('ensures static utility routes are protected and never matched by model redirects', async () => {
    const redirects = await (nextConfig.redirects ? nextConfig.redirects() : []);
    const utilityRoutes = [
      '/tires',
      '/calculator',
      '/submit',
      '/delivery-prep',
      '/winter-prep',
      '/guides',
      '/inventory',
      '/faq',
      '/api',
      '/api/stats',
      '/api/export',
    ];

    for (const utilityRoute of utilityRoutes) {
      // None of the utility routes should match any exact redirect source
      const exactMatch = redirects.find((r) => r.source === utilityRoute);
      expect(exactMatch, `Utility route ${utilityRoute} should not match any redirect`).toBeUndefined();

      // Ensure root segment does not collide with vehicle models
      const firstSegment = utilityRoute.split('/')[1];
      expect(
        models.includes(firstSegment),
        `Utility segment '${firstSegment}' collides with a vehicle model`
      ).toBe(false);
    }
  });

  it('strictly resolves canonical URLs to https://www.toyotawaits.ca/wait-times/${slug} on model hubs', async () => {
    for (const model of models) {
      const meta = await generateMetadata({
        params: Promise.resolve({ model }),
      });
      expect(meta.alternates?.canonical).toBe(`https://www.toyotawaits.ca/wait-times/${model}`);
    }
  });
});
