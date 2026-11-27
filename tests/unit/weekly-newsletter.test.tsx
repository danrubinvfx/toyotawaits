import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NewsletterSignup } from '@/components/newsletter/NewsletterSignup';
import {
  generateWeeklyPipelineBriefEmail,
  getWeeklyGearPicks,
} from '@/emails/WeeklyPipelineBriefEmail';
import { POST as subscribePost } from '@/app/api/newsletter/subscribe/route';
import { GET as verifyGet } from '@/app/api/newsletter/verify/route';
import { GET as unsubscribeGet } from '@/app/api/newsletter/unsubscribe/route';

describe('Weekly Pipeline Brief Newsletter', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('<NewsletterSignup /> component', () => {
    it('renders dark charcoal/amber card with required micro-disclaimer and button', () => {
      render(<NewsletterSignup />);
      expect(screen.getByText('The ToyotaWaits Weekly Pipeline Brief')).toBeInTheDocument();
      expect(
        screen.getByText(
          /1 email every Monday\. Wait-time shifts, fresh lot sightings & gear deals\. 1-click unsubscribe anytime\./i
        )
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Join Weekly Brief/i })).toBeInTheDocument();
    });

    it('validates email client-side and submits valid email to /api/newsletter/subscribe', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Check your inbox to confirm your Weekly Pipeline Brief subscription.',
        }),
      });
      global.fetch = fetchMock as unknown as typeof fetch;

      render(<NewsletterSignup />);
      const input = screen.getByTestId('newsletter-email-input');
      const btn = screen.getByTestId('newsletter-submit-btn');

      fireEvent.change(input, { target: { value: 'invalid-email' } });
      fireEvent.click(btn);
      expect(screen.getByRole('alert')).toHaveTextContent(/valid email/i);
      expect(fetchMock).not.toHaveBeenCalled();

      fireEvent.change(input, { target: { value: 'driver@example.ca' } });
      fireEvent.click(btn);

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          '/api/newsletter/subscribe',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ email: 'driver@example.ca', country: 'CA' }),
          })
        );
      });

      expect(await screen.findByRole('status')).toHaveTextContent(/Check your inbox/i);
    });
  });

  describe('Newsletter API Routes', () => {
    it('POST /api/newsletter/subscribe rejects invalid email and invalid country', async () => {
      const badEmailReq = new Request('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'bad', country: 'CA' }),
      });
      const badEmailRes = await subscribePost(badEmailReq);
      expect(badEmailRes.status).toBe(400);

      const badCountryReq = new Request('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'driver@example.com', country: 'UK' }),
      });
      const badCountryRes = await subscribePost(badCountryReq);
      expect(badCountryRes.status).toBe(400);
    });

    it('POST /api/newsletter/subscribe succeeds for valid CA/US payload', async () => {
      const req = new Request('http://localhost:3000/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'buyer@example.ca', country: 'CA' }),
      });
      const res = await subscribePost(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
    });

    it('GET /api/newsletter/verify requires token and redirects when present', async () => {
      const missingRes = await verifyGet(new Request('http://localhost:3000/api/newsletter/verify'));
      expect(missingRes.status).toBe(400);

      const validRes = await verifyGet(
        new Request('http://localhost:3000/api/newsletter/verify?token=abc123')
      );
      expect(validRes.status).toBe(302);
      expect(validRes.headers.get('location')).toContain('/?newsletter=verified');
    });

    it('GET /api/newsletter/unsubscribe requires token and redirects when present', async () => {
      const missingRes = await unsubscribeGet(
        new Request('http://localhost:3000/api/newsletter/unsubscribe')
      );
      expect(missingRes.status).toBe(400);

      const validRes = await unsubscribeGet(
        new Request('http://localhost:3000/api/newsletter/unsubscribe?token=unsub123')
      );
      expect(validRes.status).toBe(302);
      expect(validRes.headers.get('location')).toContain('/?newsletter=unsubscribed');
    });
  });

  describe('WeeklyPipelineBriefEmail generator', () => {
    it('ranks Top 10 gear by 30-day click telemetry and localizes CA vs US affiliate URLs', () => {
      const clickCounts = {
        'muslogy-rav4-organizer': 142,
        'noco-genius5': 95,
      };
      const caPicks = getWeeklyGearPicks('CA', new Date('2026-11-23T16:00:00Z'), clickCounts);
      const usPicks = getWeeklyGearPicks('US', new Date('2026-11-23T16:00:00Z'), clickCounts);

      expect(caPicks).toHaveLength(10);
      expect(usPicks).toHaveLength(10);
      expect(caPicks[0].id).toBe('muslogy-rav4-organizer');
      expect(caPicks[0].rank).toBe(1);
      expect(caPicks[0].discountCode).toBe('Toyotawaits');

      const amazonCaItem = caPicks.find((p) => p.url.includes('amazon.ca'));
      const amazonUsItem = usPicks.find((p) => p.url.includes('amazon.com'));
      expect(amazonCaItem?.url).toContain('tag=toyotawaits-20');
      expect(amazonUsItem?.url).toContain('tag=toyotawaits07-20');
    });

    it('generates CA and US localized HTML + text with Top 10 ranked gear, CASL footer, and affiliate tags', () => {
      const caPicks = getWeeklyGearPicks('CA', new Date('2026-11-23T16:00:00Z'), {
        'muslogy-rav4-organizer': 200,
      });
      const caEmail = generateWeeklyPipelineBriefEmail({
        country: 'CA',
        unsubscribeToken: 'unsub-ca-123',
        waitTimeMovers: [
          { modelName: 'RAV4 Hybrid', modelSlug: 'rav4-hybrid', medianWaitDays: 145, sampleCount: 12 },
        ],
        freshLotSightingsCount: 18,
        deliveryPulse: [{ modelName: 'Sienna', regionCode: 'BC', waitDays: 390 }],
        gearPicks: caPicks,
        currentDate: new Date('2026-11-23T16:00:00Z'),
      });

      expect(caEmail.subject).toContain('Canada');
      expect(caEmail.html).toContain('RAV4 Hybrid');
      expect(caEmail.html).toContain('https://www.toyotawaits.ca/wait-times/rav4-hybrid');
      expect(caEmail.html).toContain('https://www.toyotawaits.ca/inventory');
      expect(caEmail.html).toContain('4. Top 10 Most Popular Gear This Week');
      expect(caEmail.html).toContain('🔥 #1 Most Popular');
      expect(caEmail.html).toContain('Code: Toyotawaits');
      expect(caEmail.html).toContain('#10');
      expect(caEmail.html).toContain('Burnaby, BC, Canada');
      expect(caEmail.html).toContain('hello@toyotawaits.ca');
      expect(caEmail.html).toContain('As an Amazon Associate, ToyotaWaits earns from qualifying purchases.');
      expect(caEmail.html).toContain(
        'https://www.toyotawaits.ca/api/newsletter/unsubscribe?token=unsub-ca-123'
      );
      expect(caEmail.text).toContain('4. TOP 10 MOST POPULAR GEAR THIS WEEK');
      expect(caEmail.text).toContain('#1 ');
      expect(caEmail.text).toContain('#10 ');
      expect(caEmail.text).toContain('1-Click Unsubscribe');

      const usEmail = generateWeeklyPipelineBriefEmail({
        country: 'US',
        unsubscribeToken: 'unsub-us-456',
        waitTimeMovers: [],
        freshLotSightingsCount: 9,
        deliveryPulse: [],
        currentDate: new Date('2026-11-23T16:00:00Z'),
      });

      expect(usEmail.subject).toContain('United States');
      expect(usEmail.html).toContain('tag=toyotawaits07-20');
      expect(usEmail.html).toContain(
        'https://www.toyotawaits.com/api/newsletter/unsubscribe?token=unsub-us-456'
      );
    });
  });
});
