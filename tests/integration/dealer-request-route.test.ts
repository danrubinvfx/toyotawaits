import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST, dynamic, instant } from '@/app/api/dealers/request/route';

describe('POST /api/dealers/request', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exports Next.js 16 dynamic route configurations', () => {
    expect(dynamic).toBe('force-dynamic');
    expect(instant).toBe(false);
  });

  it('rejects malformed JSON payload with 400', async () => {
    const req = new NextRequest('http://localhost:3000/api/dealers/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid-json{',
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Malformed JSON');
  });

  it('rejects missing dealerName, city, or province with 400', async () => {
    const testCases = [
      { city: 'Vancouver', province: 'BC' }, // missing dealerName
      { dealerName: 'Test Toyota', province: 'BC' }, // missing city
      { dealerName: 'Test Toyota', city: 'Vancouver' }, // missing province
      { dealerName: '', city: 'Vancouver', province: 'BC' }, // empty dealerName
    ];

    for (const body of testCases) {
      const req = new NextRequest('http://localhost:3000/api/dealers/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': '10.0.0.1',
        },
        body: JSON.stringify(body),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('Missing required fields');
    }
  });

  it('rejects invalid email format when provided with 400', async () => {
    const req = new NextRequest('http://localhost:3000/api/dealers/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '10.0.0.2',
      },
      body: JSON.stringify({
        dealerName: 'Test Toyota',
        city: 'Mississauga',
        province: 'ON',
        userEmail: 'not-an-email',
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('valid email address');
  });

  it('successfully creates dealership request and returns HTTP 201 with id', async () => {
    const req = new NextRequest('http://localhost:3000/api/dealers/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '10.0.0.3',
      },
      body: JSON.stringify({
        dealerName: 'Erin Park Toyota',
        city: 'Mississauga',
        province: 'ON',
        websiteUrl: 'https://www.erinparktoyota.com',
        userEmail: 'buyer@example.ca',
        notifyWhenAdded: true,
        sourceFilterState: { model: 'Sienna', location: 'Mississauga' },
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.id).toBeDefined();
    expect(typeof data.id).toBe('string');
  });

  it('enforces rate limit: max 5 requests per hour per IP', async () => {
    const ip = '192.168.10.99';

    // Submit 5 requests within quota
    for (let i = 0; i < 5; i++) {
      const req = new NextRequest('http://localhost:3000/api/dealers/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': ip,
        },
        body: JSON.stringify({
          dealerName: `Dealer ${i}`,
          city: 'Vancouver',
          province: 'BC',
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(201);
    }

    // 6th request from same IP should be blocked by rate limiter
    const blockedReq = new NextRequest('http://localhost:3000/api/dealers/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': ip,
      },
      body: JSON.stringify({
        dealerName: 'Blocked Dealer',
        city: 'Vancouver',
        province: 'BC',
      }),
    });

    const blockedRes = await POST(blockedReq);
    const blockedData = await blockedRes.json();

    expect(blockedRes.status).toBe(429);
    expect(blockedData.success).toBe(false);
    expect(blockedData.error).toContain('Rate limit exceeded');
  });
});
