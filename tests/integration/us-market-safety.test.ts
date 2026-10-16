import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { getCommunitySubmissions } from '@/lib/db/submissions';
import { calculateEstimatedWaitTime, MAX_WAIT_TIME_DAYS } from '@/lib/estimator';
import { GET as getSubmissionsRoute } from '@/app/api/submissions/route';

describe('US Market Safety & Reference Data Verification', () => {
  it('ensures US community submissions are seeded and return non-empty records preventing empty state UI', async () => {
    const usSubmissions = await getCommunitySubmissions('US');

    expect(usSubmissions.length).toBeGreaterThanOrEqual(5);

    // Verify key models are represented in US seed data
    const models = usSubmissions.map((s) => s.modelSlug);
    expect(models).toContain('rav4');
    expect(models).toContain('sienna');
    expect(models).toContain('grand-highlander');
    expect(models).toContain('prius');

    // Verify all US records are strictly partitioned with US country codes
    for (const record of usSubmissions) {
      expect(['US']).toContain(record.countryCode);
      expect(record.state).toBeTruthy();
      expect(record.state?.length).toBe(2);
    }
  });

  it('guarantees zero cross-contamination between CA and US community records', async () => {
    const caSubmissions = await getCommunitySubmissions('CA');
    const usSubmissions = await getCommunitySubmissions('US');

    expect(caSubmissions.length).toBeGreaterThan(0);
    expect(usSubmissions.length).toBeGreaterThan(0);

    const caIds = new Set(caSubmissions.map((r) => r.id));
    const usIds = new Set(usSubmissions.map((r) => r.id));

    // Ensure disjoint set between CA and US submissions
    for (const id of caIds) {
      expect(usIds.has(id)).toBe(false);
    }

    // Ensure Canadian submissions never have US country code
    for (const record of caSubmissions) {
      expect(record.countryCode).not.toBe('US');
    }
  });

  it('verifies GET /api/submissions?country=US returns edge-cached US records with ADM markup info', async () => {
    const request = new NextRequest('http://localhost:3000/api/submissions?country=US');
    const response = await getSubmissionsRoute(request);

    expect(response.status).toBe(200);

    // Verify edge caching headers
    expect(response.headers.get('Cache-Control')).toContain('public');
    expect(response.headers.get('Cache-Control')).toContain('s-maxage=60');
    expect(response.headers.get('CDN-Cache-Control')).toContain('s-maxage=60');
    expect(response.headers.get('Vercel-CDN-Cache-Control')).toContain('s-maxage=60');

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data.length).toBeGreaterThanOrEqual(5);

    // Check presence of markup records
    const recordsWithMarkup = json.data.filter(
      (r: any) => (r.dealerMarkupAdm && r.dealerMarkupAdm > 0) || (r.dealer_markup_adm && r.dealer_markup_adm > 0)
    );
    expect(recordsWithMarkup.length).toBeGreaterThanOrEqual(2);
  });

  it('verifies that estimator multipliers clamp cleanly for US wait windows without exceeding realistic limits', () => {
    const usStates = ['WA', 'CA', 'TX', 'NY', 'OR', 'FL', 'IL'];
    const testModels = ['rav4', 'sienna', 'grand-highlander', 'prius-prime', 'land-cruiser'];

    for (const state of usStates) {
      for (const model of testModels) {
        const estimate = calculateEstimatedWaitTime({
          modelSlug: model,
          province: state,
          todayDate: new Date('2026-10-16T12:00:00Z'),
        });

        // Bounding guardrails: must be positive and strictly clamped to MAX_WAIT_TIME_DAYS
        expect(estimate.p25Days).toBeGreaterThan(0);
        expect(estimate.medianDays).toBeGreaterThanOrEqual(estimate.p25Days);
        expect(estimate.p75Days).toBeGreaterThanOrEqual(estimate.medianDays);
        expect(estimate.p75Days).toBeLessThanOrEqual(MAX_WAIT_TIME_DAYS);
        expect(estimate.medianDays).toBeLessThanOrEqual(MAX_WAIT_TIME_DAYS);
        expect(estimate.p25Days).toBeLessThanOrEqual(MAX_WAIT_TIME_DAYS);

        // Projected arrival date must not compound into impossible out-years
        expect(estimate.conservativeDate).toBeTruthy();
        expect(estimate.conservativeDate).not.toContain('2029');
        expect(estimate.conservativeDate).not.toContain('2030');
      }
    }
  });
});
