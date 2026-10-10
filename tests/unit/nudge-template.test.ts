import { describe, it, expect } from 'vitest';
import { generateNudgeEmail } from '@/lib/email/nudge-template';

describe('Milestone Nudge Email Template Engine', () => {
  const samplePayload = {
    recipientEmail: 'buyer@example.ca',
    model: 'RAV4',
    modelSlug: 'rav4',
    powertrain: 'Hybrid (HEV)',
    trim: 'XSE Technology Package (AWD)',
    province: 'BC',
    orderDate: '2025-08-15',
    daysWaited: 420,
    editToken: 'token-uuid-12345',
    unsubscribeToken: 'unsub-uuid-67890',
  };

  it('renders all 3 distinct action buttons with direct status-action query parameters', () => {
    const email = generateNudgeEmail(samplePayload);

    const stillWaitingExpected = '/api/orders/status-action?token=token-uuid-12345&action=still_waiting';
    const deliveredExpected = '/api/orders/status-action?token=token-uuid-12345&action=delivered';
    const cancelledExpected = '/api/orders/status-action?token=token-uuid-12345&action=cancelled';

    expect(email.html).toContain(stillWaitingExpected);
    expect(email.html).toContain(deliveredExpected);
    expect(email.html).toContain(cancelledExpected);

    expect(email.text).toContain(stillWaitingExpected);
    expect(email.text).toContain(deliveredExpected);
    expect(email.text).toContain(cancelledExpected);
  });

  it('renders vehicle details, order date, and days waited in email body', () => {
    const email = generateNudgeEmail(samplePayload);

    expect(email.subject).toContain('RAV4');
    expect(email.subject).toContain('420 Days');
    expect(email.html).toContain('420 days');
    expect(email.html).toContain('2025-08-15');
    expect(email.html).toContain('BC');
  });

  it('contains compliant List-Unsubscribe headers, Ko-fi link, and delivery prep mod link', () => {
    const email = generateNudgeEmail(samplePayload);

    // List-Unsubscribe headers
    expect(email.headers).toBeDefined();
    expect(email.headers['List-Unsubscribe']).toContain('unsub-uuid-67890');
    expect(email.headers['List-Unsubscribe-Post']).toBe('List-Unsubscribe=One-Click');

    // Ko-fi support link
    expect(email.html).toContain('https://ko-fi.com/toyotawaits');
    expect(email.text).toContain('https://ko-fi.com/toyotawaits');

    // Mod guide link
    expect(email.html).toContain('/mods/rav4');
    expect(email.text).toContain('/mods/rav4');
  });
});
