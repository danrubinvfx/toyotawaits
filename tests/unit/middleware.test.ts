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

    it('enforces 301 permanent redirect from apex domain to www in production', () => {
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
    } finally {
      (process.env as any).NODE_ENV = originalEnv;
    }
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
});
