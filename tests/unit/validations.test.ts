import { describe, it, expect } from 'vitest';
import {
  submissionCreateSchema,
  submissionUpdateSchema,
  aggregateQuerySchema,
  exportQuerySchema,
  affiliateSlugSchema,
  sanitizedNotesSchema,
} from '@/lib/validations/schemas';

describe('Zod Validation Schemas (Data Contracts)', () => {
  const validUuid1 = '11111111-1111-4111-8111-111111111111';
  const validUuid2 = '22222222-2222-4222-8222-222222222222';
  const validUuid3 = '33333333-3333-4333-8333-333333333333';

  describe('submissionCreateSchema', () => {
    it('accepts a valid pending submission', () => {
      const input = {
        modelId: validUuid1,
        powertrainId: validUuid2,
        trimId: validUuid3,
        province: 'BC',
        dealershipCity: 'Richmond',
        modelYear: 2024,
        orderDate: '2024-01-15',
        status: 'pending',
        pricing: 'at_msrp',
        mandatoryAddonsCad: 0,
        tradeInRequired: false,
        notes: 'Waiting for call from dealership.',
        turnstileToken: 'mock-valid-turnstile-token',
        honeypot: '',
      };

      const result = submissionCreateSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.province).toBe('BC');
        expect(result.data.status).toBe('pending');
      }
    });

    it('accepts a valid delivered submission with computed timeline', () => {
      const input = {
        modelId: validUuid1,
        powertrainId: validUuid2,
        trimId: validUuid3,
        province: 'ON',
        dealershipCity: 'Oakville',
        modelYear: 2024,
        orderDate: '2023-05-01',
        deliveryDate: '2024-02-15',
        status: 'delivered',
        pricing: 'at_msrp',
        mandatoryAddonsCad: 199.5,
        tradeInRequired: false,
        notes: 'Delivered as promised.',
        turnstileToken: 'mock-valid-turnstile-token',
      };

      const result = submissionCreateSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('rejects a delivered submission if deliveryDate is missing', () => {
      const input = {
        modelId: validUuid1,
        powertrainId: validUuid2,
        trimId: validUuid3,
        province: 'AB',
        modelYear: 2024,
        orderDate: '2024-01-01',
        status: 'delivered',
        turnstileToken: 'mock-token',
      };

      const result = submissionCreateSchema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        const issues = result.error.issues;
        expect(issues.some((i) => i.path.includes('deliveryDate'))).toBe(true);
      }
    });

    it('rejects if deliveryDate precedes orderDate', () => {
      const input = {
        modelId: validUuid1,
        powertrainId: validUuid2,
        trimId: validUuid3,
        province: 'QC',
        modelYear: 2024,
        orderDate: '2024-05-01',
        deliveryDate: '2024-04-01', // Precedes order date
        status: 'delivered',
        turnstileToken: 'mock-token',
      };

      const result = submissionCreateSchema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((i) =>
            i.message.includes('Delivery date cannot precede order date')
          )
        ).toBe(true);
      }
    });

    it('rejects extreme outlier wait times exceeding 5 years (1825 days)', () => {
      const input = {
        modelId: validUuid1,
        powertrainId: validUuid2,
        trimId: validUuid3,
        province: 'QC',
        modelYear: 2024,
        orderDate: '2019-01-01',
        deliveryDate: '2024-10-01', // ~2100 days
        status: 'delivered',
        turnstileToken: 'mock-token',
      };

      const result = submissionCreateSchema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((i) =>
            i.message.includes('Reported wait duration exceeds plausible 5-year maximum')
          )
        ).toBe(true);
      }
    });

    it('rejects future order dates', () => {
      const input = {
        modelId: validUuid1,
        powertrainId: validUuid2,
        trimId: validUuid3,
        province: 'MB',
        modelYear: 2025,
        orderDate: '2099-01-01',
        status: 'pending',
        turnstileToken: 'mock-token',
      };

      const result = submissionCreateSchema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((i) =>
            i.message.includes('Order date cannot be in the future')
          )
        ).toBe(true);
      }
    });

    it('rejects invalid Canadian province codes', () => {
      const input = {
        modelId: validUuid1,
        powertrainId: validUuid2,
        trimId: validUuid3,
        province: 'CALIFORNIA', // Invalid
        modelYear: 2024,
        orderDate: '2024-01-01',
        status: 'pending',
        turnstileToken: 'mock-token',
      };

      const result = submissionCreateSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('rejects non-UUID model, powertrain, or trim identifiers', () => {
      const input = {
        modelId: 'not-a-uuid',
        powertrainId: validUuid2,
        trimId: validUuid3,
        province: 'BC',
        modelYear: 2024,
        orderDate: '2024-01-01',
        status: 'pending',
        turnstileToken: 'mock-token',
      };

      const result = submissionCreateSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('rejects when honeypot trap is filled by bot', () => {
      const input = {
        modelId: validUuid1,
        powertrainId: validUuid2,
        trimId: validUuid3,
        province: 'BC',
        modelYear: 2024,
        orderDate: '2024-01-01',
        status: 'pending',
        turnstileToken: 'mock-token',
        honeypot: 'http://spam-link.com',
      };

      const result = submissionCreateSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('rejects missing Cloudflare Turnstile token', () => {
      const input = {
        modelId: validUuid1,
        powertrainId: validUuid2,
        trimId: validUuid3,
        province: 'BC',
        modelYear: 2024,
        orderDate: '2024-01-01',
        status: 'pending',
        turnstileToken: '', // Empty
      };

      const result = submissionCreateSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('Zero-PII Regex Scrubber (sanitizedNotesSchema)', () => {
    it('allows clean community notes', () => {
      const result = sanitizedNotesSchema.safeParse(
        'Dealer was upfront about delays. Paid MSRP with zero markups.'
      );
      expect(result.success).toBe(true);
    });

    it('rejects 17-character VIN strings', () => {
      const result = sanitizedNotesSchema.safeParse(
        'My vehicle VIN is 2T3C1RFV2RC123456 ready for pickup.'
      );
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('VIN');
      }
    });

    it('rejects email addresses', () => {
      const result = sanitizedNotesSchema.safeParse(
        'Contact sales rep at john.doe@toyotadealer.ca for updates.'
      );
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('email');
      }
    });

    it('rejects telephone numbers', () => {
      const result = sanitizedNotesSchema.safeParse('Dealer phone number: 604-555-0199.');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('telephone');
      }
    });

    it('rejects Canadian postal codes', () => {
      const result = sanitizedNotesSchema.safeParse('Located at dealership near V6X 2W8.');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('postal');
      }
    });
  });

  describe('submissionUpdateSchema', () => {
    it('accepts a valid update to delivered status with edit key', () => {
      const input = {
        id: validUuid1,
        editKey: 'c39a8208-8f83-424a-9b81-eb940c6a8362',
        status: 'delivered',
        deliveryDate: '2024-06-15',
        notes: 'Car arrived today!',
      };

      const result = submissionUpdateSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('rejects update with too short edit key', () => {
      const input = {
        id: validUuid1,
        editKey: 'short',
        status: 'delivered',
      };

      const result = submissionUpdateSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('aggregateQuerySchema', () => {
    it('accepts valid query parameters', () => {
      const input = {
        model: 'rav4',
        powertrain: 'phev',
        province: 'BC',
        timeframe: '90d',
      };

      const result = aggregateQuerySchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('applies default timeframe of 365d', () => {
      const input = {
        model: 'sienna',
      };

      const result = aggregateQuerySchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.timeframe).toBe('365d');
      }
    });

    it('rejects invalid timeframe filter', () => {
      const input = {
        model: 'rav4',
        timeframe: 'invalid_interval',
      };

      const result = aggregateQuerySchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('exportQuerySchema', () => {
    it('accepts valid export parameters', () => {
      const input = {
        model: 'rav4',
        province: 'ON',
        status: 'delivered',
        format: 'csv',
      };

      const result = exportQuerySchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('rejects non-csv formats', () => {
      const input = {
        format: 'json',
      };

      const result = exportQuerySchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('affiliateSlugSchema', () => {
    it('accepts lowercase hyphenated slugs', () => {
      const input = { slug: 'tuxmat-rav4' };
      const result = affiliateSlugSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('rejects slugs with directory traversal or invalid characters', () => {
      expect(affiliateSlugSchema.safeParse({ slug: '../evil' }).success).toBe(false);
      expect(affiliateSlugSchema.safeParse({ slug: 'tuxmat/rav4' }).success).toBe(false);
      expect(affiliateSlugSchema.safeParse({ slug: 'TUXMAT_RAV4' }).success).toBe(false);
      expect(affiliateSlugSchema.safeParse({ slug: 'tuxmat?tag=spam' }).success).toBe(false);
    });
  });
});
