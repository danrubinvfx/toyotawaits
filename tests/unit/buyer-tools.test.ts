import { describe, it, expect } from 'vitest';
import { generateCalendarReminder } from '@/lib/utils/calendar';
import { formatRedditMarkdown, formatMonthYear, STAGE_DISPLAY_NAMES } from '@/lib/utils/reddit-share';

describe('Buyer Tools Unit Tests', () => {
  describe('Calendar Reminder Generator (.ics)', () => {
    it('generates a valid RFC 5545 iCalendar payload', () => {
      const startDate = new Date('2026-11-15T14:00:00Z');
      const ics = generateCalendarReminder({
        title: 'Toyota Check-in: Sienna HEV',
        description: 'Month 6 check-in with dealership regarding allocation queue.',
        startDate,
        durationHours: 1,
        location: 'Don Valley North Toyota',
      });

      expect(ics).toContain('BEGIN:VCALENDAR');
      expect(ics).toContain('VERSION:2.0');
      expect(ics).toContain('PRODID:-//ToyotaWaits.ca//Canadian Delivery Tracker//EN');
      expect(ics).toContain('BEGIN:VEVENT');
      expect(ics).toContain('DTSTART:20261115T140000Z');
      expect(ics).toContain('DTEND:20261115T150000Z');
      expect(ics).toContain('SUMMARY:Toyota Check-in: Sienna HEV');
      expect(ics).toContain('Month 6 check-in with dealership');
      expect(ics).toContain('LOCATION:Don Valley North Toyota');
      expect(ics).toContain('BEGIN:VALARM');
      expect(ics).toContain('TRIGGER:-PT24H');
      expect(ics).toContain('END:VALARM');
      expect(ics).toContain('END:VEVENT');
      expect(ics).toContain('END:VCALENDAR');
    });

    it('escapes special characters such as semicolons and commas', () => {
      const startDate = new Date('2026-10-01T10:00:00Z');
      const ics = generateCalendarReminder({
        title: 'Order status; check parts, allocations',
        description: 'Check: 1, 2; and 3.',
        startDate,
      });

      expect(ics).toContain('SUMMARY:Order status\\; check parts\\, allocations');
      expect(ics).toContain('Check: 1\\, 2\\; and 3.');
    });
  });

  describe('Reddit Share Generator', () => {
    it('formats month and year correctly from ISO date strings', () => {
      expect(formatMonthYear('2025-03-15')).toBe('Mar 2025');
      expect(formatMonthYear('2026-10-01')).toBe('Oct 2026');
      expect(formatMonthYear('2024-01-30')).toBe('Jan 2024');
    });

    it('generates proper Reddit markdown formatting with stage and estimated arrival', () => {
      const markdown = formatRedditMarkdown({
        modelName: '2026 RAV4',
        powertrainName: 'Prime',
        trimName: 'XSE',
        province: 'BC',
        orderDate: '2025-03-15',
        currentStage: 'freight_transit',
        estDelivery: 'Aug 2026 (~17 mos)',
      });

      expect(markdown).toBe(
        '> **2026 RAV4 Prime XSE** | BC | Ordered: Mar 2025 | Current Status: Freight Transit | Est. Delivery: Aug 2026 (~17 mos) — via [ToyotaWaits.ca](https://toyotawaits.ca)'
      );
    });

    it('supports delivered status formatting', () => {
      const markdown = formatRedditMarkdown({
        modelName: 'Sienna',
        powertrainName: 'HEV',
        trimName: 'Limited AWD',
        province: 'ON',
        orderDate: '2024-11-10',
        currentStage: 'delivered',
        status: 'delivered',
      });

      expect(markdown).toContain('**Sienna HEV Limited AWD** | ON | Ordered: Nov 2024 | Current Status: Delivered');
      expect(markdown).toContain('via [ToyotaWaits.ca](https://toyotawaits.ca)');
    });

    it('maps all 5 stages to display names', () => {
      expect(STAGE_DISPLAY_NAMES.deposit_placed).toBe('Deposit Placed');
      expect(STAGE_DISPLAY_NAMES.allocation_confirmed).toBe('Allocation Confirmed');
      expect(STAGE_DISPLAY_NAMES.freight_transit).toBe('Freight Transit');
      expect(STAGE_DISPLAY_NAMES.arrived_at_dealer).toBe('Arrived at Dealer');
      expect(STAGE_DISPLAY_NAMES.delivered).toBe('Delivered');
    });
  });
});
