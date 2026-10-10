import { describe, it, expect } from 'vitest';
import { SYNTHETIC_40_RECORDS, runSyntheticSeed } from '../../scripts/seed-synthetic-submissions';

describe('Synthetic 40 Canadian Toyota Submissions Seed', () => {
  it('contains exactly 40 records', () => {
    expect(SYNTHETIC_40_RECORDS.length).toBe(40);
  });

  it('meets the ~70% delivered / ~30% pending ratio', () => {
    const delivered = SYNTHETIC_40_RECORDS.filter((r) => r.status === 'delivered');
    const pending = SYNTHETIC_40_RECORDS.filter((r) => r.status === 'pending');

    expect(delivered.length).toBe(28); // 70%
    expect(pending.length).toBe(12);   // 30%
  });

  it('respects realistic wait duration clamps between 45 and 415 days for delivered records', () => {
    const delivered = SYNTHETIC_40_RECORDS.filter((r) => r.status === 'delivered');

    for (const record of delivered) {
      expect(record.deliveryDate).not.toBeNull();
      const order = new Date(record.orderDate).getTime();
      const deliv = new Date(record.deliveryDate!).getTime();
      const waitDays = Math.round((deliv - order) / (1000 * 60 * 60 * 24));

      expect(waitDays).toBeGreaterThanOrEqual(45);
      expect(waitDays).toBeLessThanOrEqual(415);
    }
  });

  it('has pending records with null deliveryDate', () => {
    const pending = SYNTHETIC_40_RECORDS.filter((r) => r.status === 'pending');

    for (const record of pending) {
      expect(record.deliveryDate).toBeNull();
    }
  });

  it('covers all requested Canadian models and provinces', () => {
    const models = new Set(SYNTHETIC_40_RECORDS.map((r) => r.modelSlug));
    expect(models.has('rav4')).toBe(true);
    expect(models.has('sienna')).toBe(true);
    expect(models.has('grand-highlander')).toBe(true);
    expect(models.has('land-cruiser')).toBe(true);
    expect(models.has('prius')).toBe(true);
    expect(models.has('prius-prime')).toBe(true);

    const provinces = new Set(SYNTHETIC_40_RECORDS.map((r) => r.province));
    const expectedProvinces = ['BC', 'ON', 'AB', 'QC', 'MB', 'SK', 'NS'];
    for (const prov of expectedProvinces) {
      expect(provinces.has(prov as any)).toBe(true);
    }
  });

  it('executes runSyntheticSeed cleanly and returns 40 seeded records', async () => {
    const result = await runSyntheticSeed();
    expect(result.total).toBe(40);
    expect(result.inserted).toBe(40);
    expect(result.errors.length).toBe(0);
  });
});
