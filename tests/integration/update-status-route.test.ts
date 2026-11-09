import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getStatus, POST as postStatus } from '@/app/api/update-status/[token]/route';
import { insertSubmission } from '@/lib/db/submissions';
import crypto from 'crypto';

describe('1-Click Status Update API (/api/update-status/[token])', () => {
  const modelId = '11111111-1111-4111-8111-111111111111';
  const powertrainId = '22222222-2222-4222-8222-222222222222';
  const trimId = '33333333-3333-4333-8333-333333333333';
  let testToken: string;

  beforeEach(async () => {
    testToken = crypto.randomBytes(24).toString('hex');
    await insertSubmission({
      modelId,
      modelSlug: 'rav4',
      model: 'RAV4',
      powertrainId,
      powertrainSlug: 'hev',
      trimId,
      trimSlug: 'xle-awd',
      province: 'BC',
      dealershipCity: 'Vancouver',
      modelYear: 2026,
      orderDate: '2026-01-10',
      status: 'pending',
      stage: 'deposit_placed',
      currentStage: 'deposit_placed',
      pricing: 'at_msrp',
      mandatoryAddonsCad: 0,
      tradeInRequired: false,
      editKeyHash: crypto.createHash('sha256').update('secret-test-key').digest('hex'),
      editToken: testToken,
      email: 'buyer@example.com',
      reminder_opt_in: true,
      isFlagged: false,
    });
  });

  it('returns 404 when token does not match any order', async () => {
    const invalidToken = 'non-existent-token-123456';
    const req = new NextRequest(`http://localhost:3000/api/update-status/${invalidToken}`);
    const res = await getStatus(req, { params: Promise.resolve({ token: invalidToken }) });

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error.message).toContain('not found');
  });

  it('fetches existing submission details with queue position and provincial median', async () => {
    const req = new NextRequest(`http://localhost:3000/api/update-status/${testToken}`);
    const res = await getStatus(req, { params: Promise.resolve({ token: testToken }) });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.token).toBe(testToken);
    expect(json.data.model).toBe('RAV4');
    expect(json.data.province).toBe('BC');
    expect(json.data.orderDate).toBe('2026-01-10');
    expect(json.data.status).toBe('pending');
    expect(typeof json.data.queuePosition).toBe('number');
    expect(typeof json.data.provincialMedianDays).toBe('number');
  });

  it('updates milestone to build_assigned with 1-click', async () => {
    const req = new NextRequest(`http://localhost:3000/api/update-status/${testToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ milestone: 'build_assigned' }),
    });

    const res = await postStatus(req, { params: Promise.resolve({ token: testToken }) });
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.stage).toBe('build_assigned');
    expect(json.data.status).toBe('pending');
    expect(typeof json.data.queuePosition).toBe('number');
    expect(typeof json.data.provincialMedianDays).toBe('number');
  });

  it('updates milestone to in_transit with 1-click', async () => {
    const req = new NextRequest(`http://localhost:3000/api/update-status/${testToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ milestone: 'in_transit' }),
    });

    const res = await postStatus(req, { params: Promise.resolve({ token: testToken }) });
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.stage).toBe('in_transit');
    expect(json.data.status).toBe('pending');
  });

  it('updates milestone to delivered and sets deliveryDate with waitDays calculated', async () => {
    const req = new NextRequest(`http://localhost:3000/api/update-status/${testToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ milestone: 'delivered', deliveryDate: '2026-06-15' }),
    });

    const res = await postStatus(req, { params: Promise.resolve({ token: testToken }) });
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.status).toBe('delivered');
    expect(json.data.stage).toBe('delivered');
    expect(json.data.deliveryDate).toBe('2026-06-15');
    expect(json.data.waitDays).toBeGreaterThan(0);
  });

  it('updates milestone to canceled', async () => {
    const req = new NextRequest(`http://localhost:3000/api/update-status/${testToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ milestone: 'canceled' }),
    });

    const res = await postStatus(req, { params: Promise.resolve({ token: testToken }) });
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.status).toBe('cancelled');
    expect(json.data.stage).toBe('canceled');
  });
});
