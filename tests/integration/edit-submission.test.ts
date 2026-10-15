import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, PATCH, PUT } from '@/app/api/submissions/edit/[token]/route';
import { insertSubmission, getCommunitySubmissions } from '@/lib/db/submissions';

describe('Edit Submission API Route (/api/submissions/edit/[token])', () => {
  const validEditToken = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

  beforeEach(async () => {
    // Seed an in-memory submission with the specific edit token
    await insertSubmission({
      modelId: '10000000-0000-4000-8000-000000000001',
      powertrainId: '20000000-0000-4000-8000-000000000002',
      trimId: '30000000-0000-4000-8000-000000000010',
      province: 'BC',
      dealershipCity: 'Richmond',
      dealershipName: 'Richmond Toyota',
      modelYear: 2026,
      orderDate: '2025-10-01',
      deliveryDate: null,
      status: 'pending',
      pricing: 'at_msrp',
      mandatoryAddonsCad: 0,
      tradeInRequired: false,
      editKeyHash: 'mock-edit-key-hash',
      editToken: validEditToken,
      isFlagged: false,
    });
  });

  it('rejects malformed non-UUID edit tokens with 404 Not Found', async () => {
    const req = new NextRequest('http://localhost:3000/api/submissions/edit/not-a-uuid');
    const res = await GET(req, { params: Promise.resolve({ token: 'not-a-uuid' }) });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('NOT_FOUND');
  });

  it('rejects unauthorized PATCH with invalid token returning 404', async () => {
    const req = new NextRequest('http://localhost:3000/api/submissions/edit/unauthorized-token', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'delivered', deliveryDate: '2026-03-01' }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ token: 'unauthorized-token' }) });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('NOT_FOUND');
  });

  it('returns 404 for non-existent UUID token', async () => {
    const nonExistentToken = '00000000-0000-0000-0000-000000000000';
    const req = new NextRequest(`http://localhost:3000/api/submissions/edit/${nonExistentToken}`);
    const res = await GET(req, { params: Promise.resolve({ token: nonExistentToken }) });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('NOT_FOUND');
  });

  it('retrieves submission details successfully with valid token', async () => {
    const req = new NextRequest(`http://localhost:3000/api/submissions/edit/${validEditToken}`);
    const res = await GET(req, { params: Promise.resolve({ token: validEditToken }) });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.editToken).toBe(validEditToken);
    expect(json.data.province).toBe('BC');
    expect(json.data.status).toBe('pending');
  });

  it('rejects update with invalid status', async () => {
    const req = new NextRequest(`http://localhost:3000/api/submissions/edit/${validEditToken}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'invalid_status' }),
    });

    const res = await PATCH(req, { params: Promise.resolve({ token: validEditToken }) });
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('INVALID_STATUS');
  });

  it('requires deliveryDate when updating status to delivered', async () => {
    const req = new NextRequest(`http://localhost:3000/api/submissions/edit/${validEditToken}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'delivered' }),
    });

    const res = await PATCH(req, { params: Promise.resolve({ token: validEditToken }) });
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('DELIVERY_DATE_REQUIRED');
  });

  it('successfully updates status to delivered and calculates waitDays', async () => {
    const req = new NextRequest(`http://localhost:3000/api/submissions/edit/${validEditToken}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'delivered',
        deliveryDate: '2026-03-01',
        notes: 'Delivered at MSRP without markups.',
      }),
    });

    const res = await PATCH(req, { params: Promise.resolve({ token: validEditToken }) });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.status).toBe('delivered');
    expect(json.data.deliveryDate).toBe('2026-03-01');
    expect(json.data.waitDays).toBeGreaterThan(0);
    expect(json.data.notes).toBe('Delivered at MSRP without markups.');
  });

  it('successfully updates status to cancelled and excludes from community submissions', async () => {
    const req = new NextRequest(`http://localhost:3000/api/submissions/edit/${validEditToken}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'cancelled',
        notes: 'Cancelled deposit.',
      }),
    });

    const res = await PATCH(req, { params: Promise.resolve({ token: validEditToken }) });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.status).toBe('cancelled');

    const allAfter = await getCommunitySubmissions();
    const foundAfter = allAfter.find(r => r.id === validEditToken || (r as any).editToken === validEditToken);
    expect(foundAfter).toBeUndefined();
  });

  it('successfully updates status via PUT without creating duplicate rows', async () => {
    const allBefore = await getCommunitySubmissions();
    const countBefore = allBefore.length;

    const req = new NextRequest(`http://localhost:3000/api/submissions/edit/${validEditToken}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'delivered',
        deliveryDate: '2026-03-10',
        notes: 'Delivered via PUT request update.',
      }),
    });

    const res = await PUT(req, { params: Promise.resolve({ token: validEditToken }) });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.status).toBe('delivered');
    expect(json.data.deliveryDate).toBe('2026-03-10');
    expect(json.data.waitDays).toBeGreaterThan(0);

    const allAfter = await getCommunitySubmissions();
    expect(allAfter.length).toBe(countBefore); // ZERO duplicate rows created
  });

  it('successfully updates status back to pending ("Still Waiting") without creating duplicate rows', async () => {
    const allBefore = await getCommunitySubmissions();
    const countBefore = allBefore.length;

    const req = new NextRequest(`http://localhost:3000/api/submissions/edit/${validEditToken}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'pending',
        notes: 'Back to still waiting on allocation.',
      }),
    });

    const res = await PATCH(req, { params: Promise.resolve({ token: validEditToken }) });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.status).toBe('pending');
    expect(json.data.deliveryDate).toBeNull();
    expect(json.data.waitDays).toBeNull();

    const allAfter = await getCommunitySubmissions();
    expect(allAfter.length).toBe(countBefore); // ZERO duplicate rows created
  });

  it('successfully updates submission to vin_assigned and in_transit lifecycle states', async () => {
    // 1. Advance to vin_assigned
    const req1 = new NextRequest(`http://localhost:3000/api/submissions/edit/${validEditToken}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stage: 'vin_assigned',
        notes: 'VIN generated and build assigned.',
      }),
    });

    const res1 = await PATCH(req1, { params: Promise.resolve({ token: validEditToken }) });
    const json1 = await res1.json();

    expect(res1.status).toBe(200);
    expect(json1.success).toBe(true);
    expect(json1.data.stage).toBe('vin_assigned');
    expect(json1.data.status).toBe('pending');

    // 2. Advance to in_transit
    const req2 = new NextRequest(`http://localhost:3000/api/submissions/edit/${validEditToken}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stage: 'in_transit',
        notes: 'On freight transport to dealer.',
      }),
    });

    const res2 = await PATCH(req2, { params: Promise.resolve({ token: validEditToken }) });
    const json2 = await res2.json();

    expect(res2.status).toBe(200);
    expect(json2.success).toBe(true);
    expect(json2.data.stage).toBe('in_transit');
    expect(json2.data.status).toBe('pending');

    // 3. Verify subsequent GET retains in_transit and does not snap back to deposit_placed
    const getReq = new NextRequest(`http://localhost:3000/api/submissions/edit/${validEditToken}`);
    const getRes = await GET(getReq, { params: Promise.resolve({ token: validEditToken }) });
    const getJson = await getRes.json();

    expect(getRes.status).toBe(200);
    expect(getJson.success).toBe(true);
    expect(getJson.data.stage).toBe('in_transit');
    expect(getJson.data.status).toBe('pending');
  });

  it('allows re-activating a cancelled order back to active pending state', async () => {
    // 1. Cancel the order
    const cancelReq = new NextRequest(`http://localhost:3000/api/submissions/edit/${validEditToken}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'cancelled',
        stage: 'cancelled',
      }),
    });
    const cancelRes = await PATCH(cancelReq, { params: Promise.resolve({ token: validEditToken }) });
    const cancelJson = await cancelRes.json();
    expect(cancelRes.status).toBe(200);
    expect(cancelJson.data.status).toBe('cancelled');

    // 2. Reactivate back to pending
    const reactivateReq = new NextRequest(`http://localhost:3000/api/submissions/edit/${validEditToken}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'pending',
        stage: 'deposit_placed',
      }),
    });
    const reactivateRes = await PATCH(reactivateReq, { params: Promise.resolve({ token: validEditToken }) });
    const reactivateJson = await reactivateRes.json();

    expect(reactivateRes.status).toBe(200);
    expect(reactivateJson.success).toBe(true);
    expect(reactivateJson.data.status).toBe('pending');
    expect(reactivateJson.data.stage).toBe('deposit_placed');

    // 3. Verify GET returns reactivated state
    const getReq = new NextRequest(`http://localhost:3000/api/submissions/edit/${validEditToken}`);
    const getRes = await GET(getReq, { params: Promise.resolve({ token: validEditToken }) });
    const getJson = await getRes.json();
    expect(getRes.status).toBe(200);
    expect(getJson.data.status).toBe('pending');
    expect(getJson.data.stage).toBe('deposit_placed');
  });
});
