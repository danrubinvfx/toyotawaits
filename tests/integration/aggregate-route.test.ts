import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/aggregate/route';

describe('GET /api/aggregate', () => {
  it('returns 200 OK with summary statistics and percentiles for valid model', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/aggregate?model=rav4&powertrain=phev&province=BC'
    );

    const response = await GET(request);
    expect(response.status).toBe(200);

    const cacheHeader = response.headers.get('Cache-Control');
    expect(cacheHeader).toContain('public');
    expect(cacheHeader).toContain('s-maxage=120');

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.modelSlug).toBe('rav4');
    expect(json.data.powertrainSlug).toBe('phev');
    expect(json.data.province).toBe('BC');
    expect(json.data.waitStats).toBeDefined();
    expect(json.data.waitStats.p25).toBeGreaterThan(0);
    expect(json.data.waitStats.median).toBeGreaterThanOrEqual(json.data.waitStats.p25);
    expect(json.data.waitStats.p75).toBeGreaterThanOrEqual(json.data.waitStats.median);
    expect(json.data.sampleCounts.total).toBeGreaterThan(0);
    expect(json.data.pricingInsights.atMsrpPercent).toBeDefined();
  });

  it('returns 400 Bad Request when model parameter is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/aggregate');
    const response = await GET(request);
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('INVALID_QUERY_PARAMS');
  });

  it('returns 400 Bad Request when timeframe filter is invalid', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/aggregate?model=rav4&timeframe=invalid_period'
    );
    const response = await GET(request);
    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('INVALID_QUERY_PARAMS');
  });
});
