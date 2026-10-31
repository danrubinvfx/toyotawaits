import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST, PATCH } from '@/app/api/submissions/route';
import { _resetRateLimiter } from '@/lib/security/ratelimit';

describe('Benchmark My Order Submission API (/api/submissions)', () => {
  beforeEach(() => {
    _resetRateLimiter();
  });

  it('accepts 2-field benchmark payload { modelSlug, orderDate, province } and returns HTTP 201 with queuePosition and estimatedDeliveryDate', async () => {
    const payload = {
      modelSlug: 'rav4',
      orderDate: '2026-02-01',
      province: 'BC',
      country: 'CA',
      medianWaitDays: 240,
    };

    const request = new NextRequest('http://localhost:3000/api/submissions', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '192.168.10.42',
      },
    });

    const response = await POST(request);
    expect(response.status).toBe(201);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.submissionId).toBeDefined();
    expect(data.data.id).toBeDefined();
    expect(data.data.queuePosition).toBeGreaterThanOrEqual(1);
    expect(data.data.estimatedDeliveryDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(data.data.status).toBe('pending');
    expect(data.data.editKey).toBeDefined();
  });

  it('allows progressive detail enrichment via PATCH with trimId and admMarkup', async () => {
    // 1. Create benchmark submission
    const createPayload = {
      modelSlug: 'rav4',
      orderDate: '2026-03-01',
      province: 'ON',
      country: 'CA',
    };

    const createReq = new NextRequest('http://localhost:3000/api/submissions', {
      method: 'POST',
      body: JSON.stringify(createPayload),
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '192.168.10.43',
      },
    });

    const createRes = await POST(createReq);
    expect(createRes.status).toBe(201);
    const createData = await createRes.json();
    const subId = createData.data.submissionId;
    const editKey = createData.data.editKey;

    // 2. Update with trim and markup
    const updatePayload = {
      id: subId,
      editKey,
      trimId: '30000000-0000-4000-8000-000000000002',
      admMarkup: 1200,
      pricing: 'above_msrp',
    };

    const patchReq = new NextRequest('http://localhost:3000/api/submissions', {
      method: 'PATCH',
      body: JSON.stringify(updatePayload),
      headers: {
        'Content-Type': 'application/json',
        'x-edit-key': editKey,
      },
    });

    const patchRes = await PATCH(patchReq);
    expect(patchRes.status).toBe(200);
    const patchData = await patchRes.json();
    expect(patchData.success).toBe(true);
    expect(patchData.data.id).toBe(subId);
  });
});
