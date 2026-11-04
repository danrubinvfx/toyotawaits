import { describe, expect, it } from 'vitest';
import {
  auditOmvicQuote,
  classifyOmvicFeeItem,
  generateOmvicRebuttalScript,
  getOntarioRegisteredDealers,
  ONTARIO_MODEL_PRESETS,
  OMVIC_CONSUMER_PHONE,
  OMVIC_OFFICIAL_URL,
} from '@/lib/compliance/omvic';

describe('Ontario OMVIC All-In Price Checker & Statutory Rules Engine', () => {
  it('returns 0 overcharge and isCompliant=true for a clean MSRP quote', () => {
    const result = auditOmvicQuote({
      dealerName: 'Ken Shaw Toyota',
      modelName: 'RAV4 Hybrid',
      msrp: 36150,
      freightPdi: 1930,
      acTax: 100,
      tireLevy: 20,
      omvicFee: 22,
      licensing: 59,
      additionalFees: [],
    });

    expect(result.isCompliant).toBe(true);
    expect(result.potentialOvercharge).toBe(0);
    expect(result.flaggedItems).toHaveLength(0);
    // 36150 + 1930 + 100 + 20 + 22 + 59 = 38281
    expect(result.statutoryAllInPrice).toBe(38281);
    expect(result.dealerQuotedTotal).toBe(38281);
  });

  it('flags $1,194 in non-compliant overcharges for a quote with $695 Doc Fee + $499 Etch', () => {
    const result = auditOmvicQuote({
      dealerName: 'Erin Park Toyota',
      modelName: 'RAV4 Hybrid',
      msrp: 36150,
      freightPdi: 1930,
      acTax: 100,
      tireLevy: 20,
      omvicFee: 22,
      licensing: 59,
      additionalFees: [
        { label: 'Documentation / Admin Fee', amount: 695 },
        { label: 'Window Security Etch', amount: 499 },
      ],
    });

    expect(result.isCompliant).toBe(false);
    expect(result.potentialOvercharge).toBe(1194);
    expect(result.flaggedItems).toHaveLength(2);
    expect(result.flaggedItems[0].category).toBe('Documentation / Admin Fee');
    expect(result.flaggedItems[1].category).toBe(
      'Window Etching / Anti-Theft / Security Guard'
    );
    expect(result.dealerQuotedTotal).toBe(result.statutoryAllInPrice + 1194);
  });

  it('generates an OMVIC-backed rebuttal script that accurately substitutes dealer name and overcharge numbers', () => {
    const script = generateOmvicRebuttalScript({
      dealerName: 'Don Valley North Toyota',
      overchargeAmount: 1194,
    });

    expect(script).toBe(
      'Hi Don Valley North Toyota, thank you for the quote. Under OMVIC All-In Price Advertising regulations (Ontario Motor Vehicle Dealers Act), all mandatory dealer fees, administrative costs, and pre-installed items must be included in the advertised price. Only HST and actual ServiceOntario licensing can be added. Please provide an updated bill of sale with the $1,194 in additional fees removed so we can finalize the agreement.'
    );
  });

  it('classifies nitrogen fill, dealer prep, and mandatory protection packages as non-compliant', () => {
    const nitrogen = classifyOmvicFeeItem({ label: 'Nitrogen Fill & Wheel Locks', amount: 299 });
    expect(nitrogen.isCompliant).toBe(false);
    expect(nitrogen.category).toBe('Nitrogen Fill / Tire & Rim Package');

    const prep = classifyOmvicFeeItem({ label: 'Additional PDI / Dealer Prep Surcharge', amount: 395 });
    expect(prep.isCompliant).toBe(false);
    expect(prep.category).toBe('Dealer Prep / Additional PDI / Inspection Surcharge');

    const protection = classifyOmvicFeeItem({
      label: 'Mandatory Protection Package & Ceramic',
      amount: 1495,
    });
    expect(protection.isCompliant).toBe(false);
    expect(protection.category).toBe('Mandatory Protection Package / Ceramic / Undercoat');
  });

  it('exposes all 14 registered Ontario dealerships, model presets, and official OMVIC resources', () => {
    const ontarioDealers = getOntarioRegisteredDealers();
    expect(ontarioDealers.length).toBeGreaterThanOrEqual(14);
    expect(ontarioDealers.some((d) => d.name.includes('Ken Shaw Toyota'))).toBe(true);
    expect(ontarioDealers.some((d) => d.name.includes('Whitby Toyota'))).toBe(true);

    expect(ONTARIO_MODEL_PRESETS.map((p) => p.name)).toEqual(
      expect.arrayContaining([
        'RAV4 Hybrid',
        'RAV4 PHEV',
        'Sienna',
        'Grand Highlander',
        'Corolla Cross',
      ])
    );

    expect(OMVIC_OFFICIAL_URL).toBe(
      'https://www.omvic.ca/buying/your-rights/all-in-price-advertising/'
    );
    expect(OMVIC_CONSUMER_PHONE).toBe('1-800-943-6002');
  });
});
