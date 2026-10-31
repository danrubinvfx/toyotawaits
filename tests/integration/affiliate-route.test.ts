import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '@/app/out/[slug]/route';

describe('GET /out/[slug] (Cloaked Affiliate Redirect Handler)', () => {
  it('returns 307 Temporary Redirect to destination URL with privacy headers', async () => {
    const request = new NextRequest('http://localhost:3000/out/tuxmat-rav4');
    const response = await GET(request, {
      params: Promise.resolve({ slug: 'tuxmat-rav4' }),
    });

    expect(response.status).toBe(307);
    const location = response.headers.get('Location');
    expect(location).toContain('amazon.ca');
    expect(location).toContain('tag=toyotawaits-20');

    expect(response.headers.get('Cache-Control')).toContain('no-store');
    expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
  });

  it('redirects safely to /winter-prep with 307 fallback when slug is unknown', async () => {
    const request = new NextRequest('http://localhost:3000/out/unknown-product-slug');
    const response = await GET(request, {
      params: Promise.resolve({ slug: 'unknown-product-slug' }),
    });

    expect(response.status).toBe(307);
    expect(response.headers.get('Location')).toBe('http://localhost:3000/winter-prep');
  });

  it('rejects malicious slug with directory traversal or uppercase characters with 400 Bad Request', async () => {
    const request = new NextRequest('http://localhost:3000/out/invalid..slug');
    const response = await GET(request, {
      params: Promise.resolve({ slug: 'invalid..slug' }),
    });

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('INVALID_SLUG');
  });

  it('correctly redirects all 5 SE-to-XSE mod affiliate slugs with 307 status', async () => {
    const slugs = [
      { slug: 'jbl-club-dash-speakers', targetDomain: 'amazon.ca' },
      { slug: 'toyota-speaker-harness', targetDomain: 'amazon.ca' },
      { slug: 'trim-removal-tools', targetDomain: 'amazon.ca' },
      { slug: 'clazzio-leather-covers', targetDomain: 'clazzio.com' },
      { slug: 'ekr-seat-covers', targetDomain: 'amazon.ca' },
    ];

    for (const item of slugs) {
      const request = new NextRequest(`http://localhost:3000/out/${item.slug}`);
      const response = await GET(request, {
        params: Promise.resolve({ slug: item.slug }),
      });

      expect(response.status).toBe(307);
      const location = response.headers.get('Location');
      expect(location).toContain(item.targetDomain);
      if (item.targetDomain === 'amazon.ca') {
        expect(location).toContain('/s?k=');
        expect(location).toContain('tag=toyotawaits-20');
        expect(location).not.toContain('B08XJBL34T');
      }
      expect(response.headers.get('Cache-Control')).toContain('no-store');
      expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    }
  });

  it('correctly redirects all 9 Sienna, Grand Highlander, and Land Cruiser mod slugs with 307 status', async () => {
    const slugs = [
      'sienna-console-bridge-tray',
      'sienna-air-lift-1000',
      'sienna-fitcamx-dashcam',
      'sienna-hatch-led-lights',
      'gh-console-organizer-tray',
      'gh-rear-cargo-lamps',
      'gh-wireless-charger-mat',
      'lc250-speaker-upgrade',
      'lc250-rock-sliders',
    ];

    for (const slug of slugs) {
      const request = new NextRequest(`http://localhost:3000/out/${slug}`);
      const response = await GET(request, {
        params: Promise.resolve({ slug }),
      });

      expect(response.status).toBe(307);
      const location = response.headers.get('Location');
      expect(location).toContain('amazon.ca');
      expect(location).toContain('/s?k=');
      expect(location).toContain('tag=toyotawaits-20');
      expect(response.headers.get('Cache-Control')).toContain('no-store');
      expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    }
  });

  it('correctly redirects all 14 Delivery Day Prep Checklist slugs with 307 status and Amazon tags', async () => {
    const checklistSlugs = [
      'fitcamx-rav4',
      'fitcamx-sienna',
      'fitcamx-grand-highlander',
      'fitcamx-land-cruiser',
      'screen-protector-rav4',
      'screen-protector-sienna',
      'screen-protector-grand-highlander',
      'screen-protector-land-cruiser',
      'console-tray-rav4',
      'console-tray-sienna',
      'console-tray-grand-highlander',
      'console-tray-land-cruiser',
      'noco-gb40-jump-pack',
      'j1772-charger-lock',
    ];

    for (const slug of checklistSlugs) {
      const request = new NextRequest(`http://localhost:3000/out/${slug}`);
      const response = await GET(request, {
        params: Promise.resolve({ slug }),
      });

      expect(response.status).toBe(307);
      const location = response.headers.get('Location');
      expect(location).toContain('amazon.ca');
      expect(location).toContain('tag=toyotawaits-20');
      expect(response.headers.get('Cache-Control')).toContain('no-store');
      expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    }
  });

  it('correctly redirects all 7 Gen 5 Prius and Prius Prime mod slugs with 307 status and toyotawaits-20 tag', async () => {
    const priusSlugs = [
      'fitcamx-prius',
      'prius-mud-flaps',
      'prius-bumper-protector',
      'prius-all-weather-liners',
      'prius-console-organizer',
      'prius-screen-protector',
      'prius-prime-portable-charger',
    ];

    for (const slug of priusSlugs) {
      const request = new NextRequest(`http://localhost:3000/out/${slug}`);
      const response = await GET(request, {
        params: Promise.resolve({ slug }),
      });

      expect(response.status).toBe(307);
      const location = response.headers.get('Location');
      expect(location).toContain('amazon.ca');
      expect(location).toContain('/s?k=');
      expect(location).toContain('tag=toyotawaits-20');
      expect(response.headers.get('Cache-Control')).toContain('no-store');
      expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    }
  });

  it('redirects Dongar 10-pin harness, hybrid battery intake filter mesh, and door sill scuff plates to evergreen Amazon.ca search URLs', async () => {
    const evergreenItems = [
      {
        slug: 'dongar-10pin-type-a',
        expectedUrl: 'https://www.amazon.ca/s?k=Dongar+10-pin+type+A+mirror+dash+cam+adapter&tag=toyotawaits-20',
      },
      {
        slug: 'hybrid-battery-filter-mesh',
        expectedUrl: 'https://www.amazon.ca/s?k=Toyota+RAV4+hybrid+battery+intake+filter+mesh+G92DH-42010&tag=toyotawaits-20',
      },
      {
        slug: 'fitcamx-corolla',
        expectedUrl: 'https://www.amazon.ca/s?k=Fitcamx+dash+cam+Toyota+Corolla+OEM+4K&tag=toyotawaits-20',
      },
      {
        slug: 'wireless-carplay-adapter-corolla',
        expectedUrl: 'https://www.amazon.ca/s?k=wireless+carplay+android+auto+adapter+toyota+corolla+cross&tag=toyotawaits-20',
      },
      {
        slug: 'corolla-cross-wireless-carplay',
        expectedUrl: 'https://www.amazon.ca/s?k=wireless+carplay+android+auto+adapter+toyota+corolla+cross&tag=toyotawaits-20',
      },
      {
        slug: 'corolla-console-organizer',
        expectedUrl: 'https://www.amazon.ca/s?k=Toyota+Corolla+center+console+organizer+tray+2020-2026&tag=toyotawaits-20',
      },
      {
        slug: 'corolla-custom-sunshade',
        expectedUrl: 'https://www.amazon.ca/s?k=Toyota+Corolla+custom+fit+windshield+sunshade+2020-2026&tag=toyotawaits-20',
      },
      {
        slug: 'corolla-windshield-sunshade',
        expectedUrl: 'https://www.amazon.ca/s?k=Toyota+Corolla+custom+fit+windshield+sunshade+2020-2026&tag=toyotawaits-20',
      },
      {
        slug: 'corolla-window-visors',
        expectedUrl: 'https://www.amazon.ca/s?k=Toyota+Corolla+window+visors+rain+guards+2020-2026&tag=toyotawaits-20',
      },
      {
        slug: 'corolla-sedan-mud-flaps',
        expectedUrl: 'https://www.amazon.ca/s?k=Toyota+Corolla+mud+flaps+splash+guards+2020-2026&tag=toyotawaits-20',
      },
      {
        slug: 'corolla-splash-guards',
        expectedUrl: 'https://www.amazon.ca/s?k=Toyota+Corolla+mud+flaps+splash+guards+2020-2026&tag=toyotawaits-20',
      },
      {
        slug: 'door-sill-scuff-guards',
        expectedUrl: 'https://www.amazon.ca/s?k=Toyota+RAV4+door+sill+protector+scuff+plate&tag=toyotawaits-20',
      },
    ];

    for (const item of evergreenItems) {
      const request = new NextRequest(`http://localhost:3000/out/${item.slug}`);
      const response = await GET(request, {
        params: Promise.resolve({ slug: item.slug }),
      });

      expect(response.status).toBe(307);
      expect(response.headers.get('Location')).toBe(item.expectedUrl);
    }
  });

  it('routes to amazon.com when ?market=US parameter is present', async () => {
    const request = new NextRequest('http://localhost:3000/out/tuxmat-rav4?market=US');
    const response = await GET(request, {
      params: Promise.resolve({ slug: 'tuxmat-rav4' }),
    });

    expect(response.status).toBe(307);
    const location = response.headers.get('Location');
    expect(location).toContain('amazon.com');
    expect(location).toContain('tag=toyotawaits07-20');
  });

  it('routes to amazon.com when toyotawaits_market=US cookie is present', async () => {
    const request = new NextRequest('http://localhost:3000/out/tuxmat-rav4', {
      headers: {
        cookie: 'toyotawaits_market=US',
      },
    });
    const response = await GET(request, {
      params: Promise.resolve({ slug: 'tuxmat-rav4' }),
    });

    expect(response.status).toBe(307);
    const location = response.headers.get('Location');
    expect(location).toContain('amazon.com');
  });

  it('correctly redirects Muslogy partner items (muslogy-rav4, muslogy-console, muslogy-armrest-cover) to Shopify discount checkout endpoint with 307 status', async () => {
    const muslogySlugs = ['muslogy-rav4', 'muslogy-console', 'muslogy-armrest-cover'];
    const expectedTarget = 'https://muslogy.myshopify.com/discount/Toyotawaits?rs_ref=3f6lkniA';

    for (const slug of muslogySlugs) {
      const request = new NextRequest(`http://localhost:3000/out/${slug}`);
      const response = await GET(request, {
        params: Promise.resolve({ slug }),
      });

      expect(response.status).toBe(307);
      expect(response.headers.get('Location')).toBe(expectedTarget);
      expect(response.headers.get('Cache-Control')).toContain('no-store');
      expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    }
  });
});

