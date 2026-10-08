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

  it('redirects to / with 302 fallback when slug is unknown', async () => {
    const request = new NextRequest('http://localhost:3000/out/unknown-product-slug');
    const response = await GET(request, {
      params: Promise.resolve({ slug: 'unknown-product-slug' }),
    });

    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('http://localhost:3000/');
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
      expect(response.headers.get('Cache-Control')).toContain('no-store');
      expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    }
  });
});

