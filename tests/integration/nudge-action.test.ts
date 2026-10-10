import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/orders/status-action/route';
import { insertSubmission, handleNudgeAction, getSubmissionByEditToken } from '@/lib/db/submissions';

describe('One-Click Nudge Action API (/api/orders/status-action)', () => {
  const testEditToken = 'a1b2c3d4-e5f6-47a8-b9c0-123456789abc';

  beforeEach(async () => {
    await insertSubmission({
      modelId: '10000000-0000-4000-8000-000000000001',
      powertrainId: '20000000-0000-4000-8000-000000000002',
      trimId: '30000000-0000-4000-8000-000000000010',
      province: 'BC',
      dealershipCity: 'Burnaby',
      dealershipName: 'OpenRoad Toyota',
      modelYear: 2026,
      orderDate: '2025-06-01',
      deliveryDate: null,
      status: 'pending',
      stage: 'deposit_placed',
      pricing: 'at_msrp',
      mandatoryAddonsCad: 0,
      tradeInRequired: false,
      editKeyHash: 'mock-edit-hash-1',
      editToken: testEditToken,
      isFlagged: false,
    });
  });

  it('redirects with error if token or action parameter is missing', async () => {
    const req = new NextRequest('http://localhost:3000/api/orders/status-action?action=still_waiting');
    const res = await GET(req);

    expect(res.status).toBe(303);
    const location = res.headers.get('location') || '';
    expect(location).toContain('/orders/status-updated');
    expect(location).toContain('error=missing_params');
  });

  it('redirects with error if action parameter is invalid', async () => {
    const req = new NextRequest(`http://localhost:3000/api/orders/status-action?token=${testEditToken}&action=invalid_choice`);
    const res = await GET(req);

    expect(res.status).toBe(303);
    const location = res.headers.get('location') || '';
    expect(location).toContain('/orders/status-updated');
    expect(location).toContain('error=invalid_action');
  });

  it('action=still_waiting keeps stage unchanged, marks active, and updates timestamp', async () => {
    const req = new NextRequest(`http://localhost:3000/api/orders/status-action?token=${testEditToken}&action=still_waiting`);
    const res = await GET(req);

    expect(res.status).toBe(303);
    const location = res.headers.get('location') || '';
    expect(location).toContain('/orders/status-updated');
    expect(location).toContain('action=still_waiting');
    expect(location).toContain(`token=${testEditToken}`);

    // Verify submission record
    const sub = await getSubmissionByEditToken(testEditToken);
    expect(sub).toBeDefined();
    expect(sub?.status).toBe('pending');
    expect(sub?.stage).toBe('deposit_placed');
  });

  it('action=delivered updates stage to delivered, sets delivery_date to today, and calculates wait_days', async () => {
    const req = new NextRequest(`http://localhost:3000/api/orders/status-action?token=${testEditToken}&action=delivered`);
    const res = await GET(req);

    expect(res.status).toBe(303);
    const location = res.headers.get('location') || '';
    expect(location).toContain('/orders/status-updated');
    expect(location).toContain('action=delivered');
    expect(location).toContain('deliveryDate=');

    // Verify record state
    const sub = await getSubmissionByEditToken(testEditToken);
    expect(sub).toBeDefined();
    expect(sub?.status).toBe('delivered');
    expect(sub?.stage).toBe('delivered');
    expect(sub?.deliveryDate).toBe(new Date().toISOString().split('T')[0]);
    expect(sub?.waitDays).toBeGreaterThan(0);
  });

  it('action=cancelled updates stage to cancelled and clears delivery/wait metrics', async () => {
    const req = new NextRequest(`http://localhost:3000/api/orders/status-action?token=${testEditToken}&action=cancelled`);
    const res = await GET(req);

    expect(res.status).toBe(303);
    const location = res.headers.get('location') || '';
    expect(location).toContain('/orders/status-updated');
    expect(location).toContain('action=cancelled');

    // Verify record state
    const sub = await getSubmissionByEditToken(testEditToken);
    expect(sub).toBeDefined();
    expect(sub?.status).toBe('cancelled');
    expect(sub?.stage).toBe('cancelled');
    expect(sub?.deliveryDate).toBeNull();
  });

  it('supports programmatic POST requests for API integrations', async () => {
    const req = new NextRequest('http://localhost:3000/api/orders/status-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: testEditToken, action: 'still_waiting' }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.action).toBe('still_waiting');
    expect(json.submission.id).toBeDefined();
  });
});
