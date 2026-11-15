import { describe, it, expect, vi, beforeEach } from 'vitest';
import { notFound, permanentRedirect } from 'next/navigation';
import nextConfig from '../../next.config';
import { generateMetadata } from '@/app/wait-times/[model]/page';
import ModelPage, * as ModelPageModule from '@/app/[model]/page';

describe('Duplicate Model Route Equity & 301 Redirect Consolidation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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
    'crown-signia',
    'lexus-gx550',
    'lexus-tx',
    'lexus-nx',
    'lexus-rx',
  ];

  it('configures permanent (301) redirects for all Canadian vehicle root model paths and aliases', async () => {
    const redirects = await (nextConfig.redirects ? nextConfig.redirects() : []);

    for (const model of models) {
      const match = redirects.find((r) => r.source === `/${model}`);
      expect(match, `Expected redirect rule for /${model}`).toBeDefined();
      expect(match?.destination).toBe(`/wait-times/${model}`);
      expect(match?.permanent).toBe(true);
    }

    const priusPrimeMatch = redirects.find((r) => r.source === '/prius-prime');
    expect(priusPrimeMatch).toBeDefined();
    expect(priusPrimeMatch?.destination).toBe('/wait-times/prius');
    expect(priusPrimeMatch?.permanent).toBe(true);

    const rav4PrimeMatch = redirects.find((r) => r.source === '/rav4-prime');
    expect(rav4PrimeMatch).toBeDefined();
    expect(rav4PrimeMatch?.destination).toBe('/wait-times/rav4');
    expect(rav4PrimeMatch?.permanent).toBe(true);
  });

  it('enforces hard permanentRedirect on legacy /[model]/page.tsx and removes duplicate generateMetadata', async () => {
    expect('generateMetadata' in ModelPageModule).toBe(false);

    for (const model of models) {
      vi.clearAllMocks();
      await ModelPage({ params: Promise.resolve({ model }) });
      expect(permanentRedirect).toHaveBeenCalledWith(`/wait-times/${model}`);
    }

    vi.clearAllMocks();
    await ModelPage({ params: Promise.resolve({ model: 'prius-prime' }) });
    expect(permanentRedirect).toHaveBeenCalledWith('/wait-times/prius');

    vi.clearAllMocks();
    await ModelPage({ params: Promise.resolve({ model: 'rav4-prime' }) });
    expect(permanentRedirect).toHaveBeenCalledWith('/wait-times/rav4');

    vi.clearAllMocks();
    await ModelPage({ params: Promise.resolve({ model: 'untracked-vehicle-xyz' }) });
    expect(notFound).toHaveBeenCalledTimes(1);
    expect(permanentRedirect).not.toHaveBeenCalled();
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
      '/tools',
      '/privacy',
      '/legal',
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

  it('configures permanent (301) redirect from /guides/winter-tires to /tires and apex toyotawaits.ca to www.toyotawaits.ca', async () => {
    const redirects = await (nextConfig.redirects ? nextConfig.redirects() : []);

    const tireRedirect = redirects.find((r) => r.source === '/guides/winter-tires');
    expect(tireRedirect).toBeDefined();
    expect(tireRedirect?.destination).toBe('/tires');
    expect(tireRedirect?.permanent).toBe(true);

    const apexRedirect = redirects.find(
      (r) =>
        r.source === '/:path*' &&
        r.destination === 'https://www.toyotawaits.ca/:path*' &&
        r.permanent === true
    );
    expect(apexRedirect).toBeDefined();
  });
});
