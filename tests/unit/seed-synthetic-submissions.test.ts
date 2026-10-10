import { describe, it, expect } from 'vitest';
import { SYNTHETIC_40_RECORDS, ALL_57_RECORDS, runSyntheticSeed } from '../../scripts/seed-synthetic-submissions';

describe('Synthetic 40 Canadian Toyota Submissions Seed', () => {
  it('contains exactly 40 records in synthetic batch and 57 in all records', () => {
    expect(SYNTHETIC_40_RECORDS.length).toBe(40);
    expect(ALL_57_RECORDS.length).toBe(57);
  });

  it('meets the delivered/pending ratio for both batches', () => {
    const delivered40 = SYNTHETIC_40_RECORDS.filter((r) => r.status === 'delivered');
    const pending40 = SYNTHETIC_40_RECORDS.filter((r) => r.status === 'pending');

    expect(delivered40.length).toBe(28); // 70%
    expect(pending40.length).toBe(12);   // 30%

    const delivered57 = ALL_57_RECORDS.filter((r) => r.status === 'delivered');
    const pending57 = ALL_57_RECORDS.filter((r) => r.status === 'pending');

    expect(delivered57.length).toBe(42);
    expect(pending57.length).toBe(15);
  });

  it('respects realistic wait duration clamps between 35 and 525 days for delivered records', () => {
    const delivered = ALL_57_RECORDS.filter((r) => r.status === 'delivered');

    for (const record of delivered) {
      expect(record.deliveryDate).not.toBeNull();
      const order = new Date(record.orderDate).getTime();
      const deliv = new Date(record.deliveryDate!).getTime();
      const waitDays = Math.round((deliv - order) / (1000 * 60 * 60 * 24));

      expect(waitDays).toBeGreaterThanOrEqual(30);
      expect(waitDays).toBeLessThanOrEqual(530);
    }
  });

  it('has pending records with null deliveryDate', () => {
    const pending = ALL_57_RECORDS.filter((r) => r.status === 'pending');

    for (const record of pending) {
      expect(record.deliveryDate).toBeNull();
    }
  });

  it('covers all requested Canadian models and provinces', () => {
    const models = new Set(ALL_57_RECORDS.map((r) => r.modelSlug));
    expect(models.has('rav4')).toBe(true);
    expect(models.has('sienna')).toBe(true);
    expect(models.has('grand-highlander')).toBe(true);
    expect(models.has('land-cruiser')).toBe(true);
    expect(models.has('prius')).toBe(true);
    expect(models.has('prius-prime')).toBe(true);

    const provinces = new Set(ALL_57_RECORDS.map((r) => r.province));
    const expectedProvinces = ['BC', 'ON', 'AB', 'QC', 'MB', 'SK', 'NS'];
    for (const prov of expectedProvinces) {
      expect(provinces.has(prov as any)).toBe(true);
    }
  });

  it('executes runSyntheticSeed cleanly and returns all 57 seeded records', async () => {
    const prevUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock-supabase.toyotawait.local';
    try {
      const result = await runSyntheticSeed(ALL_57_RECORDS);
      expect(result.total).toBe(57);
      expect(result.inserted).toBe(57);
      expect(result.errors.length).toBe(0);
    } finally {
      process.env.NEXT_PUBLIC_SUPABASE_URL = prevUrl;
    }
  });
});
