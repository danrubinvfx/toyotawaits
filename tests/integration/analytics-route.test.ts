import { describe, it, expect } from 'vitest';
import { GET } from '@/app/api/analytics/route';

describe('GET /api/analytics', () => {
  it('returns aggregate counts matching public delivery log and strictly excludes Tacoma', async () => {
    const response = await GET();
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data).toBeDefined();
    expect(json.data.totalTracked).toBe(57);
    expect(json.data.delivered).toBe(42);
    expect(json.data.pending).toBe(15);

    // Verify active models list excludes Tacoma
    expect(json.data.activeTrackedModels).toContain('rav4');
    expect(json.data.activeTrackedModels).toContain('sienna');
    expect(json.data.activeTrackedModels).toContain('prius-prime');
    expect(json.data.activeTrackedModels).not.toContain('tacoma');

    // Verify excluded models list explicitly notes Tacoma
    expect(json.data.excludedModels).toContain('tacoma');
    expect(json.data.modelBreakdown.tacoma).toBeUndefined();
  });
});
