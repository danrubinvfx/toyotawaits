import { describe, it, expect } from 'vitest';
import { submissionSchema, regionCodeSchema } from '@/lib/validation/submission';
import { submissionCreateSchema } from '@/lib/validations/schemas';
import { insertSubmission } from '@/lib/db/submissions';

describe('US Market Database Schema & Submission Adaptation (Step 2)', () => {
  const validUuid1 = '11111111-1111-4111-8111-111111111111';
  const validUuid2 = '22222222-2222-4222-8222-222222222222';
  const validUuid3 = '33333333-3333-4333-8333-333333333333';

  describe('Validation Schema (src/lib/validation/submission.ts)', () => {
    it('defaults country to CA and currency to CAD when omitted', () => {
      const input = {
        modelId: validUuid1,
        powertrainId: validUuid2,
        trimId: validUuid3,
        province: 'BC',
        modelYear: 2026,
        orderDate: '2026-01-15',
        turnstileToken: 'mock-valid-turnstile-token',
      };

      const parsed = submissionSchema.safeParse(input);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.country).toBe('CA');
        expect(parsed.data.currency).toBe('CAD');
        expect(parsed.data.province).toBe('BC');
      }
    });

    it('accepts US market submission with state, USD currency, and adm_markup', () => {
      const input = {
        modelId: validUuid1,
        powertrainId: validUuid2,
        trimId: validUuid3,
        country: 'US',
        currency: 'USD',
        province: 'WA',
        adm_markup: 2500,
        pricing_type: 'markup',
        modelYear: 2026,
        orderDate: '2026-02-01',
        turnstileToken: 'mock-valid-turnstile-token',
      };

      const parsed = submissionSchema.safeParse(input);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.country).toBe('US');
        expect(parsed.data.currency).toBe('USD');
        expect(parsed.data.province).toBe('WA');
        expect(parsed.data.adm_markup).toBe(2500);
        expect(parsed.data.pricing_type).toBe('markup');
      }
    });

    it('allows negative adm_markup for discounts and 0 for MSRP', () => {
      const discountInput = {
        modelId: validUuid1,
        powertrainId: validUuid2,
        trimId: validUuid3,
        country: 'US',
        currency: 'USD',
        province: 'CA',
        adm_markup: -1000,
        pricing_type: 'discount',
        modelYear: 2026,
        orderDate: '2026-02-01',
        turnstileToken: 'mock-valid-turnstile-token',
      };

      const msrpInput = {
        modelId: validUuid1,
        powertrainId: validUuid2,
        trimId: validUuid3,
        country: 'US',
        currency: 'USD',
        province: 'TX',
        adm_markup: 0,
        pricing_type: 'at_msrp',
        modelYear: 2026,
        orderDate: '2026-02-01',
        turnstileToken: 'mock-valid-turnstile-token',
      };

      expect(submissionSchema.safeParse(discountInput).success).toBe(true);
      expect(submissionSchema.safeParse(msrpInput).success).toBe(true);
    });

    it('accepts valid 2-letter Canadian province codes and US state codes in regionCodeSchema', () => {
      expect(regionCodeSchema.safeParse('BC').success).toBe(true);
      expect(regionCodeSchema.safeParse('ON').success).toBe(true);
      expect(regionCodeSchema.safeParse('CA').success).toBe(true);
      expect(regionCodeSchema.safeParse('WA').success).toBe(true);
      expect(regionCodeSchema.safeParse('NY').success).toBe(true);
      expect(regionCodeSchema.safeParse('ZZ').success).toBe(false);
    });

    it('rejects invalid state code for US submission', () => {
      const input = {
        modelId: validUuid1,
        powertrainId: validUuid2,
        trimId: validUuid3,
        country: 'US',
        currency: 'USD',
        province: 'BC', // Canadian province used when country is US
        modelYear: 2026,
        orderDate: '2026-02-01',
        turnstileToken: 'mock-valid-turnstile-token',
      };

      const parsed = submissionSchema.safeParse(input);
      expect(parsed.success).toBe(false);
    });
  });

  describe('Database Persistence (insertSubmission)', () => {
    it('persists country, currency, adm_markup, and pricing_type into memory store', async () => {
      const record = await insertSubmission({
        modelId: validUuid1,
        powertrainId: validUuid2,
        trimId: validUuid3,
        country: 'US',
        currency: 'USD',
        province: 'CA',
        state: 'CA',
        adm_markup: 3000,
        pricing_type: 'markup',
        pricing: 'above_msrp',
        modelYear: 2026,
        orderDate: '2026-03-01',
        status: 'pending',
        mandatoryAddonsCad: 0,
        tradeInRequired: false,
        editKeyHash: 'test-hash-us',
        isFlagged: false,
      });

      expect(record.country).toBe('US');
      expect(record.currency).toBe('USD');
      expect(record.adm_markup).toBe(3000);
      expect(record.pricing_type).toBe('markup');
      expect(record.state).toBe('CA');
    });

    it('falls back to CA and CAD when country and currency are omitted', async () => {
      const record = await insertSubmission({
        modelId: validUuid1,
        powertrainId: validUuid2,
        trimId: validUuid3,
        province: 'ON',
        pricing: 'at_msrp',
        modelYear: 2026,
        orderDate: '2026-03-01',
        status: 'pending',
        mandatoryAddonsCad: 0,
        tradeInRequired: false,
        editKeyHash: 'test-hash-ca',
        isFlagged: false,
      });

      expect(record.country).toBe('CA');
      expect(record.currency).toBe('CAD');
    });
  });
});
