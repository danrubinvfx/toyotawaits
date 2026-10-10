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

  it('successfully updates status to cancelled', async () => {
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
});
