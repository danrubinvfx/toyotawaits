import { describe, it, expect } from 'vitest';
import { generateNotificationEmail } from '@/lib/email/notification-template';

describe('Notification Email Engine & Template Generator', () => {
  const samplePayload = {
    recipientEmail: 'buyer@example.ca',
    model: 'RAV4',
    modelSlug: 'rav4',
    trim: 'XSE Technology Package (AWD)',
    province: 'BC',
    orderDate: '2025-06-15',
    deliveryDate: '2026-07-20',
    waitDays: 400,
    medianWaitDays: 410,
    momTrendPercent: '-12 days',
    activeOrdersCount: 18,
    unsubscribeToken: 'c3756b2c-6332-4752-9b27-44f331ca8711',
  };

  it('generates compliant List-Unsubscribe headers with HTTPS and mailto URLs', () => {
    const email = generateNotificationEmail(samplePayload);

    expect(email.headers).toBeDefined();
    expect(email.headers['List-Unsubscribe']).toContain('https://toyotawaits.ca/unsubscribe?token=c3756b2c-6332-4752-9b27-44f331ca8711');
    expect(email.headers['List-Unsubscribe']).toContain('mailto:unsubscribe@toyotawaits.ca');
    expect(email.headers['List-Unsubscribe-Post']).toBe('List-Unsubscribe=One-Click');
  });

  it('includes branding header and high-contrast dark-mode styling', () => {
    const email = generateNotificationEmail(samplePayload);

    expect(email.html).toContain('ToyotaWaits.ca 🍁 Canada');
    expect(email.html).toContain('#09090b'); // Dark-mode background
    expect(email.html).toContain('#f59e0b'); // Amber accent color
    expect(email.subject).toContain('RAV4');
    expect(email.subject).toContain('BC');
  });

  it('renders complete vehicle match details (spec, location, deposit, delivery, days waited)', () => {
    const email = generateNotificationEmail(samplePayload);

    expect(email.html).toContain('RAV4');
    expect(email.html).toContain('XSE Technology Package (AWD)');
    expect(email.html).toContain('BC');
    expect(email.html).toContain('400 days');
    expect(email.text).toContain('400 days');
    expect(email.text).toContain('2025-06-15');
    expect(email.text).toContain('2026-07-20');
  });

  it('renders regional benchmark delta grid (median wait, MoM trend, active orders)', () => {
    const email = generateNotificationEmail(samplePayload);

    expect(email.html).toContain('410 Days');
    expect(email.html).toContain('-12 days');
    expect(email.html).toContain('18 Orders');
  });

  it('contains primary Re-engagement CTA and secondary Delivery Prep / Mods link', () => {
    const email = generateNotificationEmail(samplePayload);

    // Primary CTA
    expect(email.html).toContain('https://toyotawaits.ca/estimates?model=rav4&province=BC');
    expect(email.html).toContain('View Updated Estimates');

    // Secondary Delivery Prep Card & Mods link
    expect(email.html).toContain('https://toyotawaits.ca/mods/rav4');
    expect(email.html).toContain('Delivery Day Prep &amp; Community Mods');
    expect(email.text).toContain('https://toyotawaits.ca/mods/rav4');
  });

  it('contains functional one-click unsubscribe links in footer and body', () => {
    const email = generateNotificationEmail(samplePayload);

    const unsubUrl = 'https://toyotawaits.ca/unsubscribe?token=c3756b2c-6332-4752-9b27-44f331ca8711';
    expect(email.html).toContain(unsubUrl);
    expect(email.html).toContain('Unsubscribe with one click');
    expect(email.text).toContain(unsubUrl);
  });

  it('renders Ko-fi community project support link above unsubscribe link in footer', () => {
    const email = generateNotificationEmail(samplePayload);

    const kofiUrl = 'https://ko-fi.com/toyotawaits';
    const supportText = 'ToyotaWaits is an independent community project. If this tracker helped you, support hosting costs at';

    expect(email.html).toContain(kofiUrl);
    expect(email.html).toContain(supportText);
    expect(email.text).toContain(kofiUrl);
    expect(email.text).toContain(supportText);
  });
});
