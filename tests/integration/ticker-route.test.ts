import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/ticker/route';

describe('GET /api/ticker Endpoint', () => {
  it('returns 200 OK with alternating news and delivery items and required cache-control headers', async () => {
    const request = new NextRequest('http://localhost:3000/api/ticker');
    const response = await GET(request);

    expect(response.status).toBe(200);

    // Verify Cache-Control header
    const cacheControl = response.headers.get('Cache-Control');
    expect(cacheControl).toBe('public, s-maxage=60, stale-while-revalidate=120');

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBeGreaterThan(0);

    const types = data.data.map((item: any) => item.type);
    expect(types).toContain('delivery');
    expect(types).toContain('news');
  });

  it('respects the limit query parameter', async () => {
    const request = new NextRequest('http://localhost:3000/api/ticker?limit=4');
    const response = await GET(request);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.length).toBeLessThanOrEqual(4);
  });

  it('strictly adheres to Zero-PII across both delivery and news items', async () => {
    const request = new NextRequest('http://localhost:3000/api/ticker');
    const response = await GET(request);
    const data = await response.json();

    const piiFields = ['name', 'email', 'vin', 'postal_code', 'phone', 'ip', 'edit_token'];
    for (const item of data.data) {
      for (const field of piiFields) {
        expect((item as any)[field]).toBeUndefined();
      }
    }
  });
});
