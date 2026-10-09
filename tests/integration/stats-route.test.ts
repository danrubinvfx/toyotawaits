import { describe, it, expect } from 'vitest';
import { GET } from '@/app/api/stats/route';

describe('GET /api/stats', () => {
  it('returns 200 OK with model wait benchmarks and proper caching headers', async () => {
    const response = await GET();
    expect(response.status).toBe(200);

    const cacheHeader = response.headers.get('Cache-Control');
    expect(cacheHeader).toContain('public');
    expect(cacheHeader).toContain('s-maxage=3600');

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data).toBeDefined();
    expect(json.data.rav4).toBeDefined();
    expect(json.data.rav4.median_days).toBeGreaterThan(0);
    expect(json.data['prius-prime']).toBeDefined();
    expect(json.data.prius).toBeDefined();
    expect(json.data.sienna).toBeDefined();
  });
});
