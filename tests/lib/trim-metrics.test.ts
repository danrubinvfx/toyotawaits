import { describe, it, expect } from 'vitest';
import {
  computeTrimTransparencyMetrics,
  findTrimMetric,
} from '@/lib/data/trim-metrics';

describe('computeTrimTransparencyMetrics', () => {
  it('calculates straight-MSRP percentages, median fees, badges, and allocation share', () => {
    const submissions = [
      // XLE: 4 reports, 3 straight MSRP (75%), 1 with $200 addons -> medianAddons = 0 -> 🟢
      { trim: 'XLE', pricing: 'at_msrp', doc_fee: 495, mandatory_addons: 0 },
      { trim: 'XLE', pricing: 'at_msrp', doc_fee: 595, mandatory_addons: 0 },
      { trim: 'XLE', pricing: 'at_msrp', doc_fee: 595, mandatory_addons: 0 },
      { trim: 'XLE', pricing: 'above_msrp', doc_fee: 695, mandatory_addons: 200 },
      // Limited: 2 reports, 0 straight MSRP (0%), median addons $1500 -> 🔴
      { trim: 'Limited', pricing: 'above_msrp', doc_fee: 888, mandatory_addons: 1500 },
      { trim: 'Limited', pricing: 'above_msrp', doc_fee: 888, mandatory_addons: 1500 },
      // SE: 2 reports, 1 straight MSRP (50%), median addons $500 -> 🟡
      { trim: 'SE', pricing: 'at_msrp', doc_fee: 595, mandatory_addons: 0 },
      { trim: 'SE', pricing: 'above_msrp', doc_fee: 695, mandatory_addons: 1000 },
    ];

    const listings = [
      { trim: 'XLE', model: 'RAV4' },
      { trim: 'XLE', model: 'RAV4' },
      { trim: 'XLE', model: 'RAV4' },
      { trim: 'Limited', model: 'RAV4' },
      { trim: 'SE', model: 'RAV4' },
    ];

    const summary = computeTrimTransparencyMetrics('rav4', 'CA', submissions, listings);

    expect(summary.totalVerifiedReports).toBe(8);
    expect(summary.totalObservedUnits).toBe(5);
    expect(summary.overallStraightMsrpPct).toBe(50); // 4 of 8

    const xle = findTrimMetric(summary, 'XLE Hybrid');
    expect(xle).not.toBeNull();
    expect(xle?.straightMsrpPct).toBe(75);
    expect(xle?.medianDocFee).toBe(595);
    expect(xle?.medianAddons).toBe(0);
    expect(xle?.badge).toBe('🟢 Straight MSRP Common');
    expect(xle?.allocationSharePct).toBe(60); // 3 of 5
    expect(xle?.allocationShareLabel).toBe('60% of observed incoming units');

    const limited = findTrimMetric(summary, 'Limited');
    expect(limited?.straightMsrpPct).toBe(0);
    expect(limited?.badge).toBe('🔴 Heavy Add-On Risk');
    expect(limited?.allocationSharePct).toBe(20); // 1 of 5

    const se = findTrimMetric(summary, 'SE');
    expect(se?.straightMsrpPct).toBe(50);
    expect(se?.badge).toBe('🟡 Watch Doc / Add-Ons');
  });

  it('handles zero-report trims and empty inputs gracefully without NaN', () => {
    const summary = computeTrimTransparencyMetrics(
      'sienna',
      'CA',
      [],
      [{ trim: 'XSE', model: 'Sienna' }]
    );

    expect(summary.totalVerifiedReports).toBe(0);
    expect(summary.overallStraightMsrpPct).toBeNull();
    expect(summary.overallMedianDocFee).toBeNull();
    expect(summary.overallMedianAddons).toBeNull();

    const xse = findTrimMetric(summary, 'XSE');
    expect(xse).not.toBeNull();
    expect(xse?.reportCount).toBe(0);
    expect(xse?.straightMsrpPct).toBeNull();
    expect(Number.isNaN(xse?.straightMsrpPct)).toBe(false);
    expect(xse?.badge).toBe('⚪ Needs Reports');
    expect(xse?.allocationSharePct).toBe(100);
  });
});
