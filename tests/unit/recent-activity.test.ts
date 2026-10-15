import { describe, it, expect } from 'vitest';
import { getRecentActivity, insertSubmission } from '@/lib/db/submissions';
import crypto from 'crypto';

describe('getRecentActivity Data Fetcher (Zero-PII)', () => {
  it('returns recent activity records up to specified limit', async () => {
    const records = await getRecentActivity(5);
    expect(Array.isArray(records)).toBe(true);
    expect(records.length).toBeLessThanOrEqual(5);
    expect(records.length).toBeGreaterThan(0);
  });

  it('selects only allowed fields and strictly adheres to Zero-PII', async () => {
    const records = await getRecentActivity(10);
    expect(records.length).toBeGreaterThan(0);

    for (const record of records) {
      // Required Deliverable 1 fields
      expect(record.id).toBeDefined();
      expect(typeof record.province).toBe('string');
      expect(typeof record.model_name).toBe('string');
      expect(typeof record.trim_name).toBe('string');
      expect(typeof record.powertrain).toBe('string');
      expect(typeof record.status).toBe('string');
      expect(record.order_date).toBeDefined();
      expect(record.created_at).toBeDefined();
      expect(record.updated_at).toBeDefined();
      expect(record.lifecycle_status).toBeDefined();

      // Zero-PII Strict Verification: forbidden fields must NOT exist
      const piiFields = [
        'name',
        'customer_name',
        'customerName',
        'email',
        'customerEmail',
        'vin',
        'VIN',
        'postal_code',
        'postalCode',
        'zip',
        'zip_code',
        'phone',
        'phoneNumber',
        'ip',
        'ip_address',
        'edit_token',
        'editToken',
        'edit_key_hash',
        'editKeyHash',
      ];

      for (const field of piiFields) {
        expect((record as any)[field]).toBeUndefined();
      }
    }
  });

  it('orders events in descending chronological order by updated_at / created_at', async () => {
    const records = await getRecentActivity(10);
    for (let i = 0; i < records.length - 1; i++) {
      const current = new Date(records[i].updated_at || records[i].created_at).getTime();
      const next = new Date(records[i + 1].updated_at || records[i + 1].created_at).getTime();
      expect(current).toBeGreaterThanOrEqual(next);
    }
  });

  it('places a newly inserted active submission at the top of recent activity', async () => {
    const uniqueCity = `RecentTestCity-${Date.now()}`;
    const newSubmission = await insertSubmission({
      modelId: '11111111-1111-4111-8111-111111111111',
      powertrainId: '22222222-2222-4222-8222-222222222222',
      trimId: '33333333-3333-4333-8333-333333333333',
      modelSlug: 'rav4',
      powertrainSlug: 'phev',
      trimSlug: 'se-awd',
      model: 'RAV4',
      powertrain: 'Plug-in Hybrid (PHEV)',
      trim: 'SE AWD',
      province: 'BC',
      dealershipCity: uniqueCity,
      modelYear: 2026,
      orderDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      stage: 'deposit_placed',
      pricing: 'at_msrp',
      mandatoryAddonsCad: 0,
      tradeInRequired: false,
      editKeyHash: crypto.createHash('sha256').update(`ticker-key-${Date.now()}`).digest('hex'),
      isFlagged: false,
    });

    const recent = await getRecentActivity(5);
    const topItem = recent[0];
    expect(topItem).toBeDefined();
    expect(topItem.id).toBe(newSubmission.id);
    expect(topItem.province).toBe('BC');
    expect(topItem.model_name).toBe('RAV4');
    expect(topItem.lifecycle_status).toBe('deposit_placed');
  });
});
