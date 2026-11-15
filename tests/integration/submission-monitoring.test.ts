import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/submissions/route';
import {
  GET as checkAlertsGET,
  _resetDroughtAlertCooldown,
} from '@/app/api/cron/check-alerts/route';
import { _resetRateLimiter } from '@/lib/security/ratelimit';
import * as dbSubmissions from '@/lib/db/submissions';
import * as supabaseServer from '@/lib/supabase/server';
import { runSubmissionCanary } from '../../scripts/canary-submissions';

describe('Submission Monitoring, Canary & Drought Watchdog', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    _resetRateLimiter();
    _resetDroughtAlertCooldown();
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  it('dispatches fire-and-forget Resend alert email on POST /api/submissions 500 error without blocking response', async () => {
    process.env.RESEND_API_KEY = 're_test_secret_key_123';
    process.env.RESEND_FROM_EMAIL = 'ToyotaWaits Alerts <hello@toyotawaits.ca>';

    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ id: 'email_123' }), { status: 200 })
    );

    const dbError: any = new Error('invalid input syntax for type uuid');
    dbError.code = '22P02';
    dbError.details = 'Key (edit_token)=(invalid) is not a valid UUID';
    vi.spyOn(dbSubmissions, 'insertSubmission').mockRejectedValueOnce(dbError);

    const req = new NextRequest('http://localhost:3000/api/submissions', {
      method: 'POST',
      body: JSON.stringify({
        model: 'rav4',
        powertrain: 'hev',
        trim: 'XLE',
        province: 'BC',
        orderDate: '2026-11-01',
        status: 'pending',
        turnstileToken: 'mock-valid-turnstile-token',
      }),
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '10.99.0.1',
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(500);

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer re_test_secret_key_123',
        }),
      })
    );

    const resendCall = fetchSpy.mock.calls.find(
      (c) => c[0] === 'https://api.resend.com/emails'
    );
    expect(resendCall).toBeDefined();
    const emailPayload = JSON.parse(String(resendCall![1]?.body));
    expect(emailPayload.to).toBe('danielrubin76@gmail.com');
    expect(emailPayload.subject).toBe(
      '[ALERT] ToyotaWaits POST /api/submissions 500 Error'
    );
    expect(emailPayload.text).toContain('22P02');
    expect(emailPayload.text).toContain('rav4');
    expect(emailPayload.text).toContain('BC');
  });

  it('bypasses rate-limiting and marks is_flagged: true when dealershipName is __CANARY_HEALTH_CHECK__ and x-canary-secret matches CRON_SECRET', async () => {
    process.env.CRON_SECRET = 'canary-cron-secret-xyz';
    const canaryIp = '10.99.0.2';

    // Exhaust normal 5-submission rate limit for this IP
    for (let i = 0; i < 6; i++) {
      const req = new NextRequest('http://localhost:3000/api/submissions', {
        method: 'POST',
        body: JSON.stringify({
          model: 'rav4',
          powertrain: 'hev',
          trim: 'XLE',
          province: 'BC',
          orderDate: '2026-11-01',
          status: 'pending',
          dealershipName: '__CANARY_HEALTH_CHECK__',
          turnstileToken: 'mock-valid-turnstile-token',
        }),
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': canaryIp,
          'x-canary-secret': 'canary-cron-secret-xyz',
        },
      });

      const res = await POST(req);
      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.isFlagged).toBe(true);
      expect(body.data.is_flagged).toBe(true);
    }
  });

  it('verifies scripts/canary-submissions.ts POSTs canary payload and cleans up row', async () => {
    const mockFetch = vi.fn().mockImplementation(async (url: any, init: any) => {
      const urlStr = String(url);
      if (urlStr.endsWith('/api/submissions') && init?.method === 'POST') {
        return new Response(
          JSON.stringify({
            success: true,
            data: { id: '11111111-2222-4333-8444-555555555555' },
          }),
          { status: 201, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    const result = await runSubmissionCanary({
      baseUrl: 'https://www.toyotawaits.ca',
      cronSecret: 'test-cron-secret',
      supabaseUrl: 'https://gcvdxaguvawkvufqwnwt.supabase.co',
      supabaseServiceKey: 'sb_secret_valid_service_role_key_for_canary_cleanup',
      fetchImpl: mockFetch as any,
    });

    expect(result.success).toBe(true);
    expect(result.id).toBe('11111111-2222-4333-8444-555555555555');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://www.toyotawaits.ca/api/submissions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'x-canary-secret': 'test-cron-secret',
        }),
      })
    );
  });

  it('includes lastSubmissionAt and hoursSinceLastSubmission in /api/cron/check-alerts diagnostics and sends drought warning when > 48h', async () => {
    process.env.CRON_SECRET = 'cron-secret-check';
    process.env.RESEND_API_KEY = 're_drought_key_123';

    const sixtyHoursAgoIso = new Date(
      Date.now() - 60 * 60 * 60 * 1000
    ).toISOString();

    vi.spyOn(supabaseServer, 'isLiveSupabaseConfigured').mockReturnValue(true);
    vi.spyOn(supabaseServer, 'createServerClient').mockReturnValue({
      from: (table: string) => {
        if (table === 'submissions') {
          return {
            select: () => ({
              order: () => ({
                limit: async () => ({
                  data: [{ created_at: sixtyHoursAgoIso }],
                  error: null,
                }),
              }),
            }),
          };
        }
        return {
          select: () => ({
            order: () => ({
              limit: async () => ({ data: [], error: null }),
            }),
          }),
        };
      },
    } as any);

    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ id: 'drought_email_1' }), { status: 200 })
    );

    const req = new Request('http://localhost:3000/api/cron/check-alerts', {
      headers: {
        Authorization: 'Bearer cron-secret-check',
      },
    });

    const res = await checkAlertsGET(req);
    expect(res.status).toBe(200);
    const json = await res.json();

    expect(json.diagnostics.lastSubmissionAt).toBe(sixtyHoursAgoIso);
    expect(json.diagnostics.hoursSinceLastSubmission).toBeGreaterThanOrEqual(59.9);
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({
        method: 'POST',
      })
    );

    // Calling again within 24h cooldown must not send duplicate drought email
    fetchSpy.mockClear();
    const res2 = await checkAlertsGET(req);
    expect(res2.status).toBe(200);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
