import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/submissions/recent/route';

describe('GET /api/submissions/recent Endpoint', () => {
  it('returns 200 OK with recent activity items and required cache-control headers', async () => {
    const request = new NextRequest('http://localhost:3000/api/submissions/recent');
    const response = await GET(request);

    expect(response.status).toBe(200);

    // Verify Deliverable 1 Cache-Control Header
    const cacheControl = response.headers.get('Cache-Control');
    expect(cacheControl).toBe('public, s-maxage=60, stale-while-revalidate=120');

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBeGreaterThan(0);
    expect(data.data.length).toBeLessThanOrEqual(10);

    const first = data.data[0];
    expect(first.id).toBeDefined();
    expect(first.province).toBeDefined();
    expect(first.model_name).toBeDefined();
    expect(first.status).toBeDefined();
    expect(first.created_at).toBeDefined();
  });

  it('respects the limit query parameter', async () => {
    const request = new NextRequest('http://localhost:3000/api/submissions/recent?limit=3');
    const response = await GET(request);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.length).toBeLessThanOrEqual(3);
  });

  it('strictly adheres to Zero-PII by exposing no sensitive buyer attributes', async () => {
    const request = new NextRequest('http://localhost:3000/api/submissions/recent');
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
