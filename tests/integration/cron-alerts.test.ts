import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as checkAlertsGET, POST as checkAlertsPOST, validateCronSecret } from '@/app/api/cron/check-alerts/route';
import { GET as sweepGET, POST as sweepPOST } from '@/app/api/cron/sweep/route';
import * as dealersModule from '@/../lib/discovery/dealers';
import * as lifecycleModule from '@/../lib/discovery/services/lifecycle-service';

describe('Allocation Check Alerts & Sweep Cron Workers (/api/cron/check-alerts & /api/cron/sweep)', () => {
  const originalCronSecret = process.env.CRON_SECRET;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env.CRON_SECRET = originalCronSecret;
  });

  it('rejects unauthorized requests with 401 on /api/cron/sweep when CRON_SECRET is configured', async () => {
    process.env.CRON_SECRET = 'cron-secret-super-secure';

    const req = new NextRequest('http://localhost:3000/api/cron/sweep', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer wrong-key',
      },
    });

    const res = await sweepPOST(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain('Unauthorized');
  });

  it('authorizes /api/cron/sweep with matching Bearer token', async () => {
    process.env.CRON_SECRET = 'cron-secret-super-secure';

    vi.spyOn(dealersModule, 'sweepSingleDealer').mockResolvedValue({
      dealerCode: 'jptoyota-downtown',
      dealerName: 'Jim Pattison Toyota Downtown',
      success: true,
      totalParsed: 12,
      quarantinedCount: 0,
      listingsCreated: 3,
      listingsUpdated: 9,
      observationsStored: 12,
      durationMs: 140,
      unreservedVehicles: [],
    });

    const req = new NextRequest('http://localhost:3000/api/cron/sweep?dealer=jptoyota-downtown&cooldown=0', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer cron-secret-super-secure',
        'Content-Type': 'application/json',
      },
    });

    const res = await sweepPOST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.swept).toBe(12);
  });

  it('rejects unauthorized requests with 401 when CRON_SECRET is configured', async () => {
    process.env.CRON_SECRET = 'cron-secret-super-secure';

    const req = new NextRequest('http://localhost:3000/api/cron/check-alerts', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer wrong-key',
      },
    });

    const res = await checkAlertsGET(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain('Unauthorized');
  });

  it('authorizes requests with matching Bearer token', async () => {
    process.env.CRON_SECRET = 'cron-secret-super-secure';

    vi.spyOn(dealersModule, 'sweepSingleDealer').mockResolvedValue({
      dealerCode: 'jptoyota-downtown',
      dealerName: 'Jim Pattison Toyota Downtown',
      success: true,
      totalParsed: 10,
      quarantinedCount: 0,
      listingsCreated: 2,
      listingsUpdated: 8,
      observationsStored: 10,
      durationMs: 150,
      unreservedVehicles: [],
    });

    const req = new NextRequest('http://localhost:3000/api/cron/check-alerts?dealer=jptoyota-downtown&cooldown=0', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer cron-secret-super-secure',
      },
    });

    const res = await checkAlertsGET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.swept).toBe(10);
    expect(json.matches).toBe(0);
    expect(json.dispatched).toBe(0);
    expect(json.skippedDuplicates).toBe(0);
  });

  it('authorizes requests with query parameter ?key=CRON_SECRET', async () => {
    process.env.CRON_SECRET = 'cron-secret-super-secure';

    vi.spyOn(dealersModule, 'sweepSingleDealer').mockResolvedValue({
      dealerCode: 'jptoyota-downtown',
      dealerName: 'Jim Pattison Toyota Downtown',
      success: true,
      totalParsed: 5,
      quarantinedCount: 0,
      listingsCreated: 1,
      listingsUpdated: 4,
      observationsStored: 5,
      durationMs: 100,
      unreservedVehicles: [
        {
          vin: '2T3TESTVIN1234567',
          model: 'RAV4 Plug-in Hybrid',
          trim: 'XSE',
          dealerName: 'Jim Pattison Toyota Downtown',
        },
      ],
    });

    vi.spyOn(lifecycleModule, 'dispatchPendingAlerts').mockResolvedValue({
      vehiclesEvaluated: 1,
      subscribersMatched: 1,
      emailsSent: 1,
      duplicatesSkipped: 0,
      loggedPayloads: [],
    });

    const req = new NextRequest(
      'http://localhost:3000/api/cron/check-alerts?key=cron-secret-super-secure&dealer=jptoyota-downtown&cooldown=0',
      { method: 'POST' }
    );

    const res = await checkAlertsPOST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.swept).toBe(5);
    expect(json.matches).toBe(1);
    expect(json.dispatched).toBe(1);
    expect(json.skippedDuplicates).toBe(0);
  });

  it('provides precise diagnostic error message when token mismatches', async () => {
    process.env.CRON_SECRET = 'expected-secret-12345';

    const req = new NextRequest('http://localhost:3000/api/cron/check-alerts', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer wrong-key',
      },
    });

    const res = await checkAlertsPOST(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain('Token mismatch');
    expect(json.error).toContain('Provided length: 9');
    expect(json.error).toContain('Expected server length: 21');
  });

  it('authorizes when token has surrounding quotes and extra whitespace', async () => {
    process.env.CRON_SECRET = '"quoted-secret-key"';

    const req = new NextRequest('http://localhost:3000/api/cron/check-alerts', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer   "quoted-secret-key"  ',
      },
    });

    const auth = validateCronSecret(req);
    expect(auth.authorized).toBe(true);
  });

  it('reports when no token is provided in request headers or query params', async () => {
    process.env.CRON_SECRET = 'my-secret';

    const req = new NextRequest('http://localhost:3000/api/cron/check-alerts', {
      method: 'GET',
    });

    const auth = validateCronSecret(req);
    expect(auth.authorized).toBe(false);
    expect(auth.reason).toContain('No token provided');
  });

  it('reports when CRON_SECRET is empty on runtime', async () => {
    delete process.env.CRON_SECRET;
    delete process.env.VERCEL_CRON_SECRET;
    delete process.env.SWEEP_CRON_SECRET;

    const req = new NextRequest('http://localhost:3000/api/cron/check-alerts', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer some-key',
      },
    });

    const auth = validateCronSecret(req);
    expect(auth.authorized).toBe(false);
    expect(auth.reason).toContain('CRON_SECRET environment variable is empty or undefined');
  });

  it('performs lightweight database alert reconcile when no dealer param is passed', async () => {
    process.env.CRON_SECRET = 'cron-secret-super-secure';

    vi.spyOn(lifecycleModule, 'dispatchPendingAlerts').mockResolvedValue({
      vehiclesEvaluated: 3,
      subscribersMatched: 2,
      emailsSent: 2,
      duplicatesSkipped: 0,
      loggedPayloads: [],
    });

    const req = new NextRequest('http://localhost:3000/api/cron/check-alerts', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer cron-secret-super-secure',
      },
    });

    const res = await checkAlertsPOST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.matches).toBe(2);
    expect(json.dispatched).toBe(2);
  });
});
