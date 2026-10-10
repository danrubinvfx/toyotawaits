import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as cronGET, POST as cronPOST } from '@/app/api/cron/nudge-checkins/route';
import { addInMemoryNudgeCandidate, clearInMemoryNudgeCandidates } from '@/lib/db/nudges';

describe('Milestone Nudge Cron Worker (/api/cron/nudge-checkins)', () => {
  const originalCronSecret = process.env.CRON_SECRET;

  beforeEach(() => {
    clearInMemoryNudgeCandidates();
  });

  afterEach(() => {
    process.env.CRON_SECRET = originalCronSecret;
  });

  it('rejects unauthorized requests with 401 when CRON_SECRET is configured', async () => {
    process.env.CRON_SECRET = 'secret-test-key-1234';

    const req = new NextRequest('http://localhost:3000/api/cron/nudge-checkins', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer wrong-secret',
      },
    });

    const res = await cronGET(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it('authorizes requests with matching Bearer token or x-cron-secret header', async () => {
    process.env.CRON_SECRET = 'secret-test-key-1234';

    const req = new NextRequest('http://localhost:3000/api/cron/nudge-checkins', {
      method: 'POST',
      headers: {
        'x-cron-secret': 'secret-test-key-1234',
      },
    });

    const res = await cronPOST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it('processes eligible active submissions and records last_nudged_at', async () => {
    delete process.env.CRON_SECRET; // Open in dev/test

    addInMemoryNudgeCandidate({
      submissionId: 'sub-test-1234',
      editToken: 'token-test-1234',
      email: 'buyer@example.ca',
      model: 'RAV4',
      modelSlug: 'rav4',
      powertrain: 'Hybrid (HEV)',
      trim: 'XLE AWD',
      province: 'BC',
      orderDate: '2025-06-01',
      daysWaited: 210,
      stage: 'deposit_placed',
      lastNudgedAt: null,
    });

    const req = new NextRequest('http://localhost:3000/api/cron/nudge-checkins');
    const res = await cronGET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.checkedCount).toBe(1);
    expect(json.nudgedCount).toBe(1);
    expect(json.dispatchedSubmissionIds).toContain('sub-test-1234');
  });
});
