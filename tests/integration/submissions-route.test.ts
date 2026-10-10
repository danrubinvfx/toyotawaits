import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/submissions/route';
import { PATCH } from '@/app/api/submissions/[id]/route';
import { _resetRateLimiter } from '@/lib/security/ratelimit';

describe('POST /api/submissions', () => {
  const validUuid1 = '11111111-1111-4111-8111-111111111111';
  const validUuid2 = '22222222-2222-4222-8222-222222222222';
  const validUuid3 = '33333333-3333-4333-8333-333333333333';

  beforeEach(() => {
    _resetRateLimiter();
  });

  it('successfully creates an anonymous pending submission (201 Created)', async () => {
    const payload = {
      modelId: validUuid1,
      powertrainId: validUuid2,
      trimId: validUuid3,
      province: 'BC',
      dealershipCity: 'Vancouver',
      modelYear: 2024,
      orderDate: '2024-01-15',
      status: 'pending',
      pricing: 'at_msrp',
      mandatoryAddonsCad: 0,
      tradeInRequired: false,
      notes: 'No markup reported at dealership.',
      turnstileToken: 'mock-valid-turnstile-token',
    };

    const request = new NextRequest('http://localhost:3000/api/submissions', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '192.168.1.10',
      },
    });

    const response = await POST(request);
    expect(response.status).toBe(201);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.id).toBeDefined();
    expect(data.data.editKey).toBeDefined();
    expect(data.data.status).toBe('pending');
    expect(data.data.isFlagged).toBe(false);
    expect(response.headers.get('Cache-Control')).toContain('no-store');
  });

  it('successfully creates a delivered submission with wait days calculated', async () => {
    const payload = {
      modelId: validUuid1,
      powertrainId: validUuid2,
      trimId: validUuid3,
      province: 'ON',
      dealershipCity: 'Toronto',
      modelYear: 2024,
      orderDate: '2023-06-01',
      deliveryDate: '2024-01-15',
      status: 'delivered',
      pricing: 'at_msrp',
      mandatoryAddonsCad: 350,
      tradeInRequired: false,
      notes: 'Smooth delivery.',
      turnstileToken: 'mock-valid-turnstile-token',
    };

    const request = new NextRequest('http://localhost:3000/api/submissions', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '192.168.1.11',
      },
    });

    const response = await POST(request);
    expect(response.status).toBe(201);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.status).toBe('delivered');
    expect(data.data.waitDays).toBe(228);
    expect(data.data.isFlagged).toBe(false);
  });

  it('triggers outlier quarantine for suspicious 2-day wait time (isFlagged = true)', async () => {
    const payload = {
      modelId: validUuid1,
      powertrainId: validUuid2,
      trimId: validUuid3,
      province: 'QC',
      dealershipCity: 'Montreal',
      modelYear: 2024,
      orderDate: '2024-05-01',
      deliveryDate: '2024-05-03', // 2-day impossible wait for factory order
      status: 'delivered',
      turnstileToken: 'mock-valid-turnstile-token',
    };

    const request = new NextRequest('http://localhost:3000/api/submissions', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '192.168.1.12',
      },
    });

    const response = await POST(request);
    expect(response.status).toBe(201);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.isFlagged).toBe(true); // Quarantined for review!
  });

  it('returns 400 Bad Request for malformed request body', async () => {
    const request = new NextRequest('http://localhost:3000/api/submissions', {
      method: 'POST',
      body: 'this-is-not-json',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('INVALID_JSON');
  });

  it('returns 400 Bad Request when validation constraints fail', async () => {
    const invalidPayload = {
      modelId: 'not-uuid',
      province: 'INVALID_PROVINCE',
      orderDate: '2099-01-01', // Future date
      status: 'pending',
      turnstileToken: 'mock-token',
    };

    const request = new NextRequest('http://localhost:3000/api/submissions', {
      method: 'POST',
      body: JSON.stringify(invalidPayload),
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '192.168.1.13',
      },
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('VALIDATION_ERROR');
    expect(data.error.details).toBeDefined();
  });

  it('returns 403 Forbidden when Turnstile token verification fails', async () => {
    const payload = {
      modelId: validUuid1,
      powertrainId: validUuid2,
      trimId: validUuid3,
      province: 'AB',
      modelYear: 2024,
      orderDate: '2024-01-01',
      status: 'pending',
      turnstileToken: 'mock-invalid-turnstile-token',
    };

    const request = new NextRequest('http://localhost:3000/api/submissions', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '192.168.1.14',
      },
    });

    const response = await POST(request);
    expect(response.status).toBe(403);

    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('BOT_VERIFICATION_FAILED');
  });

  it('silently absorbs honeypot submission with 200 OK without inserting', async () => {
    const honeypotPayload = {
      modelId: validUuid1,
      powertrainId: validUuid2,
      trimId: validUuid3,
      province: 'BC',
      modelYear: 2024,
      orderDate: '2024-01-01',
      status: 'pending',
      turnstileToken: 'mock-valid-turnstile-token',
      honeypot: 'http://spam-link.com',
    };

    const request = new NextRequest('http://localhost:3000/api/submissions', {
      method: 'POST',
      body: JSON.stringify(honeypotPayload),
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '192.168.1.15',
      },
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.message).toBe('Submission received.');
  });
});

describe('PATCH /api/submissions/[id]', () => {
  const validUuid1 = '11111111-1111-4111-8111-111111111111';
  const validUuid2 = '22222222-2222-4222-8222-222222222222';
  const validUuid3 = '33333333-3333-4333-8333-333333333333';

  it('updates a pending submission to delivered with valid secret edit key', async () => {
    // 1. Create submission
    const createReq = new NextRequest('http://localhost:3000/api/submissions', {
      method: 'POST',
      body: JSON.stringify({
        modelId: validUuid1,
        powertrainId: validUuid2,
        trimId: validUuid3,
        province: 'AB',
        modelYear: 2024,
        orderDate: '2024-01-01',
        status: 'pending',
        turnstileToken: 'mock-valid-turnstile-token',
      }),
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '192.168.1.20',
      },
    });

    const createRes = await POST(createReq);
    const created = (await createRes.json()).data;

    // 2. Update with secret key
    const patchReq = new NextRequest(`http://localhost:3000/api/submissions/${created.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        editKey: created.editKey,
        status: 'delivered',
        deliveryDate: '2024-06-01',
        notes: 'Car was delivered on June 1st!',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const patchRes = await PATCH(patchReq, {
      params: Promise.resolve({ id: created.id }),
    });

    expect(patchRes.status).toBe(200);
    const patchData = await patchRes.json();
    expect(patchData.success).toBe(true);
    expect(patchData.data.status).toBe('delivered');
    expect(patchData.data.waitDays).toBe(152);
  });

  it('rejects update with 401 Unauthorized when invalid edit key is used', async () => {
    const patchReq = new NextRequest('http://localhost:3000/api/submissions/a1000000-0000-4000-8000-000000000003', {
      method: 'PATCH',
      body: JSON.stringify({
        editKey: 'wrong-edit-key-that-does-not-match',
        status: 'delivered',
        deliveryDate: '2024-06-01',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const patchRes = await PATCH(patchReq, {
      params: Promise.resolve({ id: 'a1000000-0000-4000-8000-000000000003' }),
    });

    expect(patchRes.status).toBe(401);
    const patchData = await patchRes.json();
    expect(patchData.success).toBe(false);
    expect(patchData.error.code).toBe('UNAUTHORIZED');
  });

  it('advances order lifecycle stage through x-edit-key header', async () => {
    // 1. Create submission
    const createReq = new NextRequest('http://localhost:3000/api/submissions', {
      method: 'POST',
      body: JSON.stringify({
        modelId: validUuid1,
        powertrainId: validUuid2,
        trimId: validUuid3,
        province: 'BC',
        modelYear: 2025,
        orderDate: '2025-01-15',
        status: 'pending',
        stage: 'deposit_placed',
        turnstileToken: 'mock-valid-turnstile-token',
      }),
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '192.168.1.25',
      },
    });

    const createRes = await POST(createReq);
    const created = (await createRes.json()).data;
    expect(created.currentStage).toBe('deposit_placed');

    // 2. Advance to allocation_confirmed using x-edit-key header
    const patchStageReq = new NextRequest(`http://localhost:3000/api/submissions/${created.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        stage: 'allocation_confirmed',
        notes: 'Dealership confirmed build sheet allocation.',
      }),
      headers: {
        'Content-Type': 'application/json',
        'x-edit-key': created.editKey,
      },
    });

    const patchStageRes = await PATCH(patchStageReq, {
      params: Promise.resolve({ id: created.id }),
    });

    expect(patchStageRes.status).toBe(200);
    const stageData = await patchStageRes.json();
    expect(stageData.success).toBe(true);
    expect(stageData.data.currentStage).toBe('allocation_confirmed');

    // 3. Advance to freight_transit
    const patchTransitReq = new NextRequest(`http://localhost:3000/api/submissions/${created.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        stage: 'freight_transit',
      }),
      headers: {
        'Content-Type': 'application/json',
        'x-edit-key': created.editKey,
      },
    });

    const patchTransitRes = await PATCH(patchTransitReq, {
      params: Promise.resolve({ id: created.id }),
    });

    expect(patchTransitRes.status).toBe(200);
    const transitData = await patchTransitRes.json();
    expect(transitData.data.currentStage).toBe('freight_transit');
  });
});

describe('GET /api/submissions', () => {
  it('returns community submissions including pending submissions with null delivery dates', async () => {
    const { GET } = await import('@/app/api/submissions/route');
    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toContain('no-store');

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);

    // Ensure pending records exist in response with deliveryDate: null
    const pendingRecords = json.data.filter((r: any) => r.status === 'pending');
    expect(pendingRecords.length).toBeGreaterThan(0);
    expect(pendingRecords[0].deliveryDate).toBeNull();
    expect(pendingRecords[0].waitDays).toBeNull();
  });
});
