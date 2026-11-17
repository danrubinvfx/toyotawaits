import { describe, it, expect } from 'vitest';
import { parseRawDealerWorksheet, categorizeWorksheetLine } from '@/lib/compliance/worksheet-parser';

describe('parseRawDealerWorksheet', () => {
  it('extracts doc fee, block heater, and protection package while ignoring GST/HST/subtotal lines', () => {
    const rawWorksheet = `
      2026 Toyota RAV4 Hybrid XLE
      Vehicle Price MSRP: $38,500.00
      Freight & PDI $1,930.00
      Doc Fee $888
      Engine Block Heater $802.40
      XPEL Paint Protection & Rust Module $1,500
      Toyota ECP Platinum Warranty $2,644.00
      Subtotal: $46,264.40
      GST (5%) $2,313.22
      HST (13%) $6,014.37
      Total Cash Price: $48,577.62
    `;

    const items = parseRawDealerWorksheet(rawWorksheet);

    const docFee = items.find((i) => i.category === 'doc_fee');
    expect(docFee).toBeDefined();
    expect(docFee?.amount).toBe(888);

    const blockHeater = items.find((i) => i.category === 'block_heater');
    expect(blockHeater).toBeDefined();
    expect(blockHeater?.amount).toBe(802.4);

    const protection = items.find((i) => i.category === 'protection');
    expect(protection).toBeDefined();
    expect(protection?.amount).toBe(1500);

    const warranty = items.find((i) => i.category === 'warranty');
    expect(warranty).toBeDefined();
    expect(warranty?.amount).toBe(2644);

    const statutory = items.find((i) => i.category === 'statutory');
    expect(statutory).toBeDefined();
    expect(statutory?.amount).toBe(1930);

    // Ensure GST, HST, Subtotal, Total, and MSRP were ignored
    expect(items.some((i) => /gst|hst|subtotal|total|msrp/i.test(i.name))).toBe(false);
  });

  it('returns an empty array for empty or non-numeric input', () => {
    expect(parseRawDealerWorksheet('')).toEqual([]);
    expect(parseRawDealerWorksheet('   \n  ')).toEqual([]);
    expect(parseRawDealerWorksheet('No prices here\nJust text')).toEqual([]);
  });

  it('categorizes common Canadian dealer fee labels deterministically', () => {
    expect(categorizeWorksheetLine('Admin Fee')).toBe('doc_fee');
    expect(categorizeWorksheetLine('Dealer Prep')).toBe('doc_fee');
    expect(categorizeWorksheetLine('Block Heater & Cord')).toBe('block_heater');
    expect(categorizeWorksheetLine('Ceramic Coating & Etch')).toBe('protection');
    expect(categorizeWorksheetLine('Extended Warranty 7yr')).toBe('warranty');
    expect(categorizeWorksheetLine('OMVIC Transaction Fee')).toBe('statutory');
  });
});
