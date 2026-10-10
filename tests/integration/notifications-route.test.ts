import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as subscribePOST } from '@/app/api/notifications/subscribe/route';
import { GET as unsubscribeGET, POST as unsubscribePOST } from '@/app/api/notifications/unsubscribe/route';
import { subscribeToNotifications, getNotificationByToken } from '@/lib/db/notifications';

describe('Notification Alerts API & Unsubscribe Flow', () => {
  describe('POST /api/notifications/subscribe', () => {
    it('rejects invalid email address with 400 and validation error', async () => {
      const req = new NextRequest('http://localhost:3000/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'not-an-email',
          model: 'rav4',
          province: 'BC',
        }),
      });

      const res = await subscribePOST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.error.code).toBe('VALIDATION_ERROR');
    });

    it('rejects missing model or invalid province with 400', async () => {
      const req = new NextRequest('http://localhost:3000/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'user@example.ca',
          model: '',
          province: 'INVALID_PROV',
        }),
      });

      const res = await subscribePOST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
    });

    it('successfully subscribes with valid inputs', async () => {
      const req = new NextRequest('http://localhost:3000/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'driver@toyota.ca',
          model: 'rav4',
          trim: 'XSE Technology Package',
          province: 'BC',
        }),
      });

      const res = await subscribePOST(req);
      const json = await res.json();

      expect([200, 201]).toContain(res.status);
      expect(json.success).toBe(true);
      expect(json.data.email).toBe('driver@toyota.ca');
      expect(json.data.model).toBe('rav4');
      expect(json.data.province).toBe('BC');
      expect(json.data.unsubscribeToken).toBeDefined();
    });

    it('handles duplicate subscription gracefully via upsert/reactivation', async () => {
      const payload = {
        email: 'repeat.buyer@toyota.ca',
        model: 'prius-prime',
        province: 'ON' as const,
      };

      // First subscription
      const req1 = new NextRequest('http://localhost:3000/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const res1 = await subscribePOST(req1);
      const json1 = await res1.json();
      expect([200, 201]).toContain(res1.status);
      expect(json1.success).toBe(true);

      // Repeat subscription with same email, model, province
      const req2 = new NextRequest('http://localhost:3000/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const res2 = await subscribePOST(req2);
      const json2 = await res2.json();
      expect([200, 201]).toContain(res2.status);
      expect(json2.success).toBe(true);
      expect(json2.data.email).toBe('repeat.buyer@toyota.ca');
    });
  });

  describe('Unsubscribe Handlers (GET & POST /api/notifications/unsubscribe)', () => {
    it('rejects missing token with 400', async () => {
      const req = new NextRequest('http://localhost:3000/api/notifications/unsubscribe');
      const res = await unsubscribeGET(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.error.code).toBe('MISSING_TOKEN');
    });

    it('rejects invalid UUID token format with 400', async () => {
      const req = new NextRequest('http://localhost:3000/api/notifications/unsubscribe?token=not-a-uuid');
      const res = await unsubscribeGET(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.error.code).toBe('INVALID_TOKEN');
    });

    it('successfully deactivates active subscription via GET query parameter', async () => {
      // First create a subscription
      const sub = await subscribeToNotifications({
        email: 'unsub.test@toyota.ca',
        model: 'sienna',
        province: 'QC',
      });
      expect(sub.unsubscribeToken).toBeDefined();

      // Deactivate using token
      const req = new NextRequest(`http://localhost:3000/api/notifications/unsubscribe?token=${sub.unsubscribeToken}`);
      const res = await unsubscribeGET(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.isActive).toBe(false);

      // Verify stored record is no longer active
      const record = await getNotificationByToken(sub.unsubscribeToken);
      expect(record?.isActive).toBe(false);
    });

    it('successfully deactivates active subscription via POST JSON payload', async () => {
      const sub = await subscribeToNotifications({
        email: 'post.unsub@toyota.ca',
        model: 'grand-highlander',
        province: 'AB',
      });

      const req = new NextRequest('http://localhost:3000/api/notifications/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: sub.unsubscribeToken }),
      });
      const res = await unsubscribePOST(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.isActive).toBe(false);
    });
  });
});
