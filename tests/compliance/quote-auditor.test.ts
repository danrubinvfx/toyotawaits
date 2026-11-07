import { describe, it, expect } from 'vitest';
import {
  auditQuote,
  TYPICAL_DEALER_MARKUP_SAMPLE,
  inferFeeCategory,
  generateRebuttalScript,
  type LineItem,
} from '@/lib/compliance/quote-auditor';

describe('Canadian Dealer Quote Auditor (Rules Engine)', () => {
  it('flags ~$3,500+ in negotiable margin on typical Alberta case study dealer quote', () => {
    // The typical Alberta case study sample contains:
    // $888 Doc Fee, $802 Block Heater, $1,500 Protections, $2,644 ECP Warranty
    const result = auditQuote(TYPICAL_DEALER_MARKUP_SAMPLE, 'AB', {
      modelName: 'RAV4 Hybrid',
      dealerName: 'Prairie Toyota',
    });

    // 888 (Doc) + 452 (Block Heater overage vs $350 target) + 1500 (Protections) + 744 (ECP overage vs $1900 wholesale target) = $3,584
    expect(result.negotiableTotal).toBeGreaterThanOrEqual(3500);
    expect(result.negotiableTotal).toBe(3584);
    expect(result.flaggedItems).toHaveLength(4);

    const docFeeFlag = result.flaggedItems.find((f) => f.name.includes('Documentation'));
    expect(docFeeFlag).toBeDefined();
    expect(docFeeFlag?.recommendedTarget).toBe(0);
    expect(docFeeFlag?.statutoryRule).toContain('AMVIC');

    const blockHeaterFlag = result.flaggedItems.find((f) => f.name.includes('Block Heater'));
    expect(blockHeaterFlag).toBeDefined();
    expect(blockHeaterFlag?.recommendedTarget).toBe(350);

    const protectionFlag = result.flaggedItems.find((f) => f.name.includes('Protection'));
    expect(protectionFlag).toBeDefined();
    expect(protectionFlag?.recommendedTarget).toBe(0);

    const warrantyFlag = result.flaggedItems.find((f) => f.name.includes('ECP'));
    expect(warrantyFlag).toBeDefined();
    expect(warrantyFlag?.recommendedTarget).toBe(1900);

    // Rebuttal script should cite AMVIC and Alberta Consumer Protection Act
    expect(result.rebuttalScript).toContain('AMVIC');
    expect(result.rebuttalScript).toContain('Alberta Consumer Protection Act');
    expect(result.rebuttalScript).toContain('$3,584 CAD');
  });

  it('flags OMVIC non-compliance on Ontario dealer admin fees', () => {
    const ontarioQuote: LineItem[] = [
      { id: '1', name: 'Base MSRP', category: 'statutory', amount: 36150 },
      { id: '2', name: 'Freight & PDI', category: 'statutory', amount: 1930 },
      { id: '3', name: 'Federal AC Tax', category: 'statutory', amount: 100 },
      { id: '4', name: 'OMVIC Fee', category: 'statutory', amount: 22 },
      { id: '5', name: 'Dealer Documentation & Admin Fee', category: 'doc_fee', amount: 799 },
      { id: '6', name: 'Security Window Etch', category: 'protection', amount: 499 },
    ];

    const result = auditQuote(ontarioQuote, 'ON', {
      modelName: 'RAV4 Hybrid',
      dealerName: 'Toronto Metro Toyota',
    });

    expect(result.negotiableTotal).toBe(799 + 499); // 1,298

    const docFeeFlag = result.flaggedItems.find((f) => f.name.includes('Documentation'));
    expect(docFeeFlag).toBeDefined();
    expect(docFeeFlag?.statutoryRule).toContain('OMVIC');
    expect(docFeeFlag?.statutoryRule).toContain('MVDA 2002');
    expect(docFeeFlag?.explanation).toContain('OMVIC violation');

    expect(result.rebuttalScript).toContain('OMVIC');
    expect(result.rebuttalScript).toContain('Motor Vehicle Dealers Act (MVDA 2002 - O. Reg. 333/08, s. 36)');
  });

  it('flags VSA all-in pricing violations on British Columbia dealer quotes', () => {
    const bcQuote: LineItem[] = [
      { id: '1', name: 'Base MSRP', category: 'statutory', amount: 47650 },
      { id: '2', name: 'Freight & PDI', category: 'statutory', amount: 2030 },
      { id: '3', name: 'VSA Fee', category: 'statutory', amount: 12 },
      { id: '4', name: 'Dealer Admin Fee', category: 'doc_fee', amount: 695 },
    ];

    const result = auditQuote(bcQuote, 'BC', {
      modelName: 'Sienna Hybrid',
    });

    expect(result.negotiableTotal).toBe(695);
    const docFeeFlag = result.flaggedItems[0];
    expect(docFeeFlag.statutoryRule).toContain('VSA');
    expect(result.rebuttalScript).toContain('Vehicle Sales Authority of British Columbia (VSA)');
  });

  it('returns $0 overcharge for a clean MSRP and statutory fee quote', () => {
    const cleanQuote: LineItem[] = [
      { id: '1', name: 'Base MSRP', category: 'statutory', amount: 36150 },
      { id: '2', name: 'Freight & PDI', category: 'statutory', amount: 1930 },
      { id: '3', name: 'Federal AC Excise Tax', category: 'statutory', amount: 100 },
      { id: '4', name: 'Provincial Tire Recycling Levy', category: 'statutory', amount: 20 },
      { id: '5', name: 'AMVIC Levy', category: 'statutory', amount: 10 },
      { id: '6', name: 'Provincial Licensing', category: 'statutory', amount: 90 },
    ];

    const result = auditQuote(cleanQuote, 'AB');

    expect(result.negotiableTotal).toBe(0);
    expect(result.flaggedItems).toHaveLength(0);
    expect(result.statutoryTotal).toBe(36150 + 1930 + 100 + 20 + 10 + 90);
    expect(result.totalQuoted).toBe(result.statutoryTotal);
  });

  it('accurately infers fee categories from common dealer fee strings', () => {
    expect(inferFeeCategory('Dealership Administration Fee')).toBe('doc_fee');
    expect(inferFeeCategory('Doc & Prep Fee')).toBe('doc_fee');
    expect(inferFeeCategory('Engine Block Heater w/ Cord')).toBe('block_heater');
    expect(inferFeeCategory('Rust Protection Module')).toBe('protection');
    expect(inferFeeCategory('XPEL Front Hood PPF')).toBe('protection');
    expect(inferFeeCategory('Nitrogen Tire Package')).toBe('protection');
    expect(inferFeeCategory('Security Etch Anti-Theft')).toBe('protection');
    expect(inferFeeCategory('Toyota ECP Platinum 7yr/160k')).toBe('warranty');
    expect(inferFeeCategory('Freight & PDI')).toBe('statutory');
    expect(inferFeeCategory('Custom Unlisted Package')).toBe('other');
  });
});
