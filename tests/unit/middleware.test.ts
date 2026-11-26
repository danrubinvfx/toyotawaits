import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware, config } from '@/middleware';

describe('Middleware Multi-Domain Routing (.ca vs .com)', () => {
  it('detects U.S. domain and sets x-region: US and x-domain: toyotawaits.com on request and response', () => {
    const request = new NextRequest('http://toyotawaits.com/dashboard', {
      headers: {
        host: 'toyotawaits.com',
      },
    });

    const response = middleware(request);

    expect(response.headers.get('x-region')).toBe('US');
    expect(response.headers.get('x-domain')).toBe('toyotawaits.com');
  });

  it('detects U.S. subdomain (e.g. www.toyotawaits.com) and sets x-region: US', () => {
    const request = new NextRequest('https://www.toyotawaits.com/', {
      headers: {
        host: 'www.toyotawaits.com',
      },
    });

    const response = middleware(request);

    expect(response.headers.get('x-region')).toBe('US');
    expect(response.headers.get('x-domain')).toBe('toyotawaits.com');
  });

  it('detects Canadian domain (toyotawaits.ca) and sets x-region: CA and x-domain: toyotawaits.ca', () => {
    const request = new NextRequest('https://toyotawaits.ca/', {
      headers: {
        host: 'toyotawaits.ca',
      },
    });

    const response = middleware(request);

    expect(response.headers.get('x-region')).toBe('CA');
    expect(response.headers.get('x-domain')).toBe('toyotawaits.ca');
  });

    it('enforces 301 permanent redirect from apex domain to www in production without creating redirect loops', () => {
    const originalEnv = process.env.NODE_ENV;
    try {
      (process.env as any).NODE_ENV = 'production';
      const request = new NextRequest('http://toyotawaits.ca/wait-times/grand-highlander', {
        headers: {
          host: 'toyotawaits.ca',
        },
      });

      const response = middleware(request);
      expect(response.status).toBe(301);
      expect(response.headers.get('location')).toBe('https://www.toyotawaits.ca/wait-times/grand-highlander');

      // Ensure that when the destination (www.toyotawaits.ca) is requested, it does not loop
      const wwwRequest = new NextRequest('https://www.toyotawaits.ca/wait-times/grand-highlander', {
        headers: {
          host: 'www.toyotawaits.ca',
        },
      });
      const wwwResponse = middleware(wwwRequest);
      expect(wwwResponse.status).toBe(200);
      expect(wwwResponse.headers.get('location')).toBeNull();
    } finally {
      (process.env as any).NODE_ENV = originalEnv;
    }
  });

  it('does not re-intercept or alter /wait-times/* paths on www.toyotawaits.ca', () => {
    const request = new NextRequest('https://www.toyotawaits.ca/wait-times/rav4', {
      headers: {
        host: 'www.toyotawaits.ca',
      },
    });

    const response = middleware(request);
    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBeNull();
    expect(response.headers.get('x-region')).toBe('CA');
    expect(response.headers.get('x-domain')).toBe('toyotawaits.ca');
  });

  it('defaults to Canadian domain for localhost and local development fallback', () => {
    const request = new NextRequest('http://localhost:3000/', {
      headers: {
        host: 'localhost:3000',
      },
    });

    const response = middleware(request);

    expect(response.headers.get('x-region')).toBe('CA');
    expect(response.headers.get('x-domain')).toBe('toyotawaits.ca');
  });

  it('has a matcher configuration that correctly filters out static files and /api/export', () => {
    expect(config.matcher).toBeDefined();
    expect(Array.isArray(config.matcher)).toBe(true);

    const matcherPattern = new RegExp(`^${config.matcher[0]}$`);

    // Paths that SHOULD match (middleware runs):
    expect(matcherPattern.test('/')).toBe(true);
    expect(matcherPattern.test('/submit')).toBe(true);
    expect(matcherPattern.test('/api/submissions')).toBe(true);
    expect(matcherPattern.test('/tires')).toBe(true);

    // Paths that SHOULD NOT match (excluded from middleware):
    expect(matcherPattern.test('/_next/static/chunks/main.js')).toBe(false);
    expect(matcherPattern.test('/_next/image?url=%2Ftoyota.png')).toBe(false);
    expect(matcherPattern.test('/favicon.ico')).toBe(false);
    expect(matcherPattern.test('/api/export')).toBe(false);
    expect(matcherPattern.test('/logo.svg')).toBe(false);
    expect(matcherPattern.test('/og-image.png')).toBe(false);
  });

  it('reads x-forwarded-host when present to detect toyotawaits.com', () => {
    const request = new NextRequest('https://internal-proxy.local/guides/toyota-sienna-2026-vs-2027', {
      headers: {
        host: 'internal-proxy.local',
        'x-forwarded-host': 'www.toyotawaits.com',
      },
    });

    const response = middleware(request);

    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBeNull();
    expect(response.headers.get('x-region')).toBe('US');
    expect(response.headers.get('x-domain')).toBe('toyotawaits.com');
  });

  it('normalizes apex toyotawaits.com to https://www.toyotawaits.com without redirecting to .ca', () => {
    const request = new NextRequest('https://toyotawaits.com/guides/toyota-sienna-2026-vs-2027?utm=test', {
      headers: {
        host: 'toyotawaits.com',
      },
    });

    const response = middleware(request);

    expect(response.status).toBe(301);
    expect(response.headers.get('location')).toBe(
      'https://www.toyotawaits.com/guides/toyota-sienna-2026-vs-2027?utm=test'
    );
    expect(response.headers.get('location')).not.toContain('toyotawaits.ca');
    expect(response.headers.get('x-region')).toBe('US');
    expect(response.headers.get('x-domain')).toBe('toyotawaits.com');

    const wwwRequest = new NextRequest('https://www.toyotawaits.com/guides/toyota-sienna-2026-vs-2027', {
      headers: {
        host: 'www.toyotawaits.com',
      },
    });
    const wwwResponse = middleware(wwwRequest);
    expect(wwwResponse.status).toBe(200);
    expect(wwwResponse.headers.get('location')).toBeNull();
  });
it('enforces single-hop 301 redirect from https://toyotawaits.ca/wait-times/prius-prime to https://www.toyotawaits.ca/wait-times/prius', () => {
    const apexRequest = new NextRequest('https://toyotawaits.ca/wait-times/prius-prime', {
      headers: {
        host: 'toyotawaits.ca',
      },
    });

    const apexResponse = middleware(apexRequest);
    expect(apexResponse.status).toBe(301);
    expect(apexResponse.headers.get('location')).toBe('https://www.toyotawaits.ca/wait-times/prius');

    // Legacy /prius-prime and /prius-prime/:path* on apex also consolidate in one hop
    const rootLegacyRequest = new NextRequest('https://toyotawaits.ca/prius-prime', {
      headers: { host: 'toyotawaits.ca' },
    });
    const rootLegacyResponse = middleware(rootLegacyRequest);
    expect(rootLegacyResponse.status).toBe(301);
    expect(rootLegacyResponse.headers.get('location')).toBe('https://www.toyotawaits.ca/wait-times/prius');

    const facetedLegacyRequest = new NextRequest('https://toyotawaits.ca/prius-prime/phev/on?ref=gsc', {
      headers: { host: 'toyotawaits.ca' },
    });
    const facetedLegacyResponse = middleware(facetedLegacyRequest);
    expect(facetedLegacyResponse.status).toBe(301);
    expect(facetedLegacyResponse.headers.get('location')).toBe(
      'https://www.toyotawaits.ca/wait-times/prius?ref=gsc'
    );

    // Canonical target /wait-times/prius on www does not loop
    const canonicalRequest = new NextRequest('https://www.toyotawaits.ca/wait-times/prius', {
      headers: { host: 'www.toyotawaits.ca' },
    });
    const canonicalResponse = middleware(canonicalRequest);
    expect(canonicalResponse.status).toBe(200);
    expect(canonicalResponse.headers.get('location')).toBeNull();
  });
});
