/**
 * src/lib/compliance/quote-auditor.ts
 *
 * Canadian Dealer Quote Auditor & Fee De-Bunker Engine
 * Audits dealership price worksheets against provincial All-In Pricing regulations:
 * - Alberta: AMVIC (Consumer Protection Act / Vehicle Sales Regulation)
 * - Ontario: OMVIC (Motor Vehicle Dealers Act, 2002 - O. Reg. 333/08 s. 36)
 * - British Columbia: VSA (Vehicle Sales Authority of BC / BPCPA)
 * - Other Canadian Provinces & Territories
 */

export type ProvinceCode = 'AB' | 'ON' | 'BC' | 'OTHER';

export type LineItemCategory =
  | 'statutory'
  | 'doc_fee'
  | 'block_heater'
  | 'protection'
  | 'warranty'
  | 'other';

export interface LineItem {
  id: string;
  name: string;
  category: LineItemCategory;
  amount: number;
}

export interface FlaggedItem {
  name: string;
  amount: number;
  recommendedTarget: number;
  explanation: string;
  statutoryRule?: string;
}

export interface QuoteAuditResult {
  totalQuoted: number;
  statutoryTotal: number;
  negotiableTotal: number;
  flaggedItems: FlaggedItem[];
  rebuttalScript: string;
}

export interface ModelPreset {
  id: string;
  name: string;
  msrp: number;
  freightPdi: number;
}

export const QUOTE_MODEL_PRESETS: ModelPreset[] = [
  {
    id: 'rav4-hybrid',
    name: 'RAV4 Hybrid',
    msrp: 36150,
    freightPdi: 1930,
  },
  {
    id: 'rav4-phev',
    name: 'RAV4 PHEV (Prime)',
    msrp: 51150,
    freightPdi: 1930,
  },
  {
    id: 'sienna',
    name: 'Sienna Hybrid',
    msrp: 47650,
    freightPdi: 2030,
  },
  {
    id: 'grand-highlander',
    name: 'Grand Highlander',
    msrp: 50490,
    freightPdi: 2030,
  },
  {
    id: 'corolla-cross',
    name: 'Corolla Cross',
    msrp: 27550,
    freightPdi: 1930,
  },
];

export interface ProvincialStatutoryDefaults {
  province: ProvinceCode;
  provinceName: string;
  regulatorName: string;
  regulatorShort: string;
  regulatoryLevy: number;
  regulatoryLevyName: string;
  acTax: number;
  tireLevy: number;
  typicalLicensing: number;
  allInPricingLaw: string;
  statuteCitation: string;
  officialUrl: string;
}

export const PROVINCIAL_DEFAULTS: Record<ProvinceCode, ProvincialStatutoryDefaults> = {
  AB: {
    province: 'AB',
    provinceName: 'Alberta',
    regulatorName: 'Alberta Motor Vehicle Industry Council',
    regulatorShort: 'AMVIC',
    regulatoryLevy: 10.0,
    regulatoryLevyName: 'AMVIC Consumer Compensation Levy',
    acTax: 100,
    tireLevy: 20,
    typicalLicensing: 90,
    allInPricingLaw: 'Alberta Consumer Protection Act (Vehicle Sales Regulation s. 11)',
    statuteCitation: 'AMVIC All-In Price Enforcement (CPA / VSR)',
    officialUrl: 'https://www.amvic.org/consumer/all-inpricing/',
  },
  ON: {
    province: 'ON',
    provinceName: 'Ontario',
    regulatorName: 'Ontario Motor Vehicle Industry Council',
    regulatorShort: 'OMVIC',
    regulatoryLevy: 22.0,
    regulatoryLevyName: 'OMVIC Transaction Fee',
    acTax: 100,
    tireLevy: 20,
    typicalLicensing: 59,
    allInPricingLaw: 'Motor Vehicle Dealers Act (MVDA 2002, O. Reg. 333/08, s. 36)',
    statuteCitation: 'OMVIC All-In Price Advertising (MVDA 2002)',
    officialUrl: 'https://www.omvic.ca/buying/your-rights/all-in-price-advertising/',
  },
  BC: {
    province: 'BC',
    provinceName: 'British Columbia',
    regulatorName: 'Vehicle Sales Authority of British Columbia',
    regulatorShort: 'VSA',
    regulatoryLevy: 12.0,
    regulatoryLevyName: 'VSA Transaction Fee',
    acTax: 100,
    tireLevy: 25,
    typicalLicensing: 45,
    allInPricingLaw: 'Motor Dealer Act & Business Practices and Consumer Protection Act (BPCPA)',
    statuteCitation: 'VSA All-In Pricing Advertising Standards',
    officialUrl: 'https://www.vsabc.ca/',
  },
  OTHER: {
    province: 'OTHER',
    provinceName: 'Other Canadian Province / Territory',
    regulatorName: 'Provincial Consumer Protection Branch',
    regulatorShort: 'Consumer Protection',
    regulatoryLevy: 0,
    regulatoryLevyName: 'Regulatory Fee',
    acTax: 100,
    tireLevy: 20,
    typicalLicensing: 50,
    allInPricingLaw: 'Provincial Consumer Protection & Deceptive Practices Legislation',
    statuteCitation: 'Provincial Fair Trading Guidelines',
    officialUrl: 'https://ised-isde.canada.ca/site/competition-bureau-canada/en',
  },
};

/**
 * Typical dealer markup sample from the Alberta case study ($888 Doc Fee, $802 Block Heater, $1,500 Protections, $2,644 ECP)
 */
export const TYPICAL_DEALER_MARKUP_SAMPLE: LineItem[] = [
  {
    id: 'sample-doc-fee',
    name: 'Documentation / Admin Fee',
    category: 'doc_fee',
    amount: 888,
  },
  {
    id: 'sample-block-heater',
    name: 'Engine Block Heater & Cordset',
    category: 'block_heater',
    amount: 802,
  },
  {
    id: 'sample-protection',
    name: 'Platinum Protection Pack (Rust & Paint Film)',
    category: 'protection',
    amount: 1500,
  },
  {
    id: 'sample-ecp',
    name: 'Toyota ECP Platinum Warranty (7yr/160k)',
    category: 'warranty',
    amount: 2644,
  },
];

/**
 * Common fee suggestions for quick-add in the UI
 */
export const FEE_AUTO_SUGGESTIONS: Array<{ name: string; category: LineItemCategory; defaultAmount: number }> = [
  { name: 'Documentation / Admin Fee', category: 'doc_fee', defaultAmount: 695 },
  { name: 'Engine Block Heater', category: 'block_heater', defaultAmount: 750 },
  { name: 'Electronic Rust Protection Module', category: 'protection', defaultAmount: 1295 },
  { name: 'Paint Protection Film (XPEL / 3M)', category: 'protection', defaultAmount: 1195 },
  { name: 'Window Security Etch / Police Trace', category: 'protection', defaultAmount: 499 },
  { name: 'Nitrogen Tire Fill & Cap Guard', category: 'protection', defaultAmount: 299 },
  { name: 'Toyota ECP Platinum Extended Warranty', category: 'warranty', defaultAmount: 2795 },
  { name: 'Dealer Delivery & Prep Fee', category: 'doc_fee', defaultAmount: 595 },
];

/**
 * Categorize a fee automatically based on its label/name
 */
export function inferFeeCategory(name: string): LineItemCategory {
  const n = name.toLowerCase();
  if (n.includes('doc') || n.includes('admin') || n.includes('processing') || n.includes('dealer prep')) {
    return 'doc_fee';
  }
  if (n.includes('block heater') || n.includes('heater') || n.includes('cordset')) {
    return 'block_heater';
  }
  if (
    n.includes('rust') ||
    n.includes('xpel') ||
    n.includes('film') ||
    n.includes('ppf') ||
    n.includes('etch') ||
    n.includes('nitrogen') ||
    n.includes('tire guard') ||
    n.includes('fabric') ||
    n.includes('protection')
  ) {
    return 'protection';
  }
  if (n.includes('ecp') || n.includes('warranty') || n.includes('extended service') || n.includes('platinum')) {
    return 'warranty';
  }
  if (
    n.includes('msrp') ||
    n.includes('freight') ||
    n.includes('pdi') ||
    n.includes('air conditioning') ||
    n.includes('ac tax') ||
    n.includes('tire levy') ||
    n.includes('omvic') ||
    n.includes('amvic') ||
    n.includes('vsa') ||
    n.includes('licensing') ||
    n.includes('plate')
  ) {
    return 'statutory';
  }
  return 'other';
}

/**
 * Audit engine configuration options
 */
export interface AuditOptions {
  modelName?: string;
  dealerName?: string;
}

/**
 * Main auditing engine: calculates statutory and negotiable totals, itemizes non-compliant/marked-up fees,
 * and generates a provincial counter-offer rebuttal email script.
 */
export function auditQuote(
  items: LineItem[],
  province: ProvinceCode = 'AB',
  options: AuditOptions = {}
): QuoteAuditResult {
  const defaults = PROVINCIAL_DEFAULTS[province] || PROVINCIAL_DEFAULTS.OTHER;
  const flaggedItems: FlaggedItem[] = [];

  let totalQuoted = 0;
  let statutoryTotal = 0;
  let negotiableTotal = 0;

  for (const item of items) {
    totalQuoted += item.amount;
    const cat = item.category || inferFeeCategory(item.name);

    switch (cat) {
      case 'statutory': {
        statutoryTotal += item.amount;
        break;
      }

      case 'doc_fee': {
        let explanation = '';
        let statutoryRule = '';

        if (province === 'AB') {
          explanation =
            'AMVIC strictly mandates all-in pricing on advertised inventory under the Alberta Consumer Protection Act. If the vehicle or price was advertised online or in dealership promotions, documentation or admin fees cannot be added on top of the advertised price.';
          statutoryRule = 'AMVIC All-In Pricing (Alberta Consumer Protection Act, Vehicle Sales Regulation s. 11)';
        } else if (province === 'ON') {
          explanation =
            'Explicit OMVIC violation under the Motor Vehicle Dealers Act (MVDA 2002). OMVIC all-in price regulations require all administrative, doc, and processing fees to be included in any advertised price or factory MSRP. Adding them separately is non-compliant.';
          statutoryRule = 'OMVIC All-In Price Advertising (MVDA 2002 - O. Reg. 333/08, s. 36)';
        } else if (province === 'BC') {
          explanation =
            'Vehicle Sales Authority of BC (VSA) all-in pricing violation if not disclosed upfront in the advertised vehicle price. Dealership documentation fees are non-statutory and cannot be unilaterally mandated.';
          statutoryRule = 'VSA All-In Pricing Standards (Motor Dealer Act & BPCPA)';
        } else {
          explanation =
            'Documentation and administration fees represent 100% dealership gross profit margin. Standard vehicle purchase paperwork and registration are standard dealership cost of doing business.';
          statutoryRule = 'Discretionary Dealer Margin (Non-Statutory)';
        }

        const recommendedTarget = 0;
        const overcharge = Math.max(0, item.amount - recommendedTarget);
        negotiableTotal += overcharge;

        flaggedItems.push({
          name: item.name,
          amount: item.amount,
          recommendedTarget,
          explanation,
          statutoryRule,
        });
        break;
      }

      case 'block_heater': {
        // OEM block heater part + ~1.0h shop labor is ~$300–$350. Anything >$400 is heavily marked up.
        const recommendedTarget = 350;
        const explanation =
          'OEM Toyota block heater parts (e.g. PK5A4-89J11/PK5A4-89J21) list for ~$130–$160 CAD, with 1.0 hour standard shop book labor (~$170–$190/hr). A legitimate installed total is $300–$350 CAD. Any quote over $400 is heavily marked up dealer margin.';
        const statutoryRule = 'Toyota OEM Standard Rate Benchmark (~$300–$350 CAD Parts + 1.0 hr Labor)';

        const overcharge = Math.max(0, item.amount - recommendedTarget);
        if (item.amount > 400 || overcharge > 0) {
          negotiableTotal += overcharge;
          flaggedItems.push({
            name: item.name,
            amount: item.amount,
            recommendedTarget,
            explanation,
            statutoryRule,
          });
        } else {
          statutoryTotal += item.amount;
        }
        break;
      }

      case 'protection': {
        const recommendedTarget = 0;
        const n = item.name.toLowerCase();
        let explanation = '';

        if (n.includes('rust') || n.includes('module') || n.includes('corrosion')) {
          explanation =
            'Electronic rust modules are scientifically proven ineffective on modern automotive unibody frames (which are already galvannealed and e-coated from the factory). Dealership wholesale cost is <$100, marked up by over 1,000%.';
        } else if (n.includes('xpel') || n.includes('film') || n.includes('ppf')) {
          explanation =
            'Dealership paint protection film is typically a partial hood cut outsourced to independent detailers for $350–$500 wholesale, then marked up to $1,200–$1,800. A dedicated specialized PPF installer charges comparable rates for full seamless custom wraps.';
        } else if (n.includes('nitrogen') || n.includes('tire guard')) {
          explanation =
            'Nitrogen tire fill costs the dealership pennies (ambient air is already 78% nitrogen). Green valve caps offer zero tangible real-world benefit for consumer street vehicles.';
        } else if (n.includes('etch') || n.includes('security') || n.includes('police')) {
          explanation =
            'Window security etch or anti-theft tracking is pure dealer profit margin, often pre-printed or bundled for $400–$600 with negligible deterrent value.';
        } else {
          explanation =
            'Dealer protection packages (interior fabric sprays, exterior ceramic sealants, security packs) represent high-margin dealer profit centers. Professional aftermarket alternatives offer superior durability at a fraction of the cost.';
        }

        const statutoryRule = 'Non-Mandatory Dealership Add-On';
        const overcharge = Math.max(0, item.amount - recommendedTarget);
        negotiableTotal += overcharge;

        flaggedItems.push({
          name: item.name,
          amount: item.amount,
          recommendedTarget,
          explanation,
          statutoryRule,
        });
        break;
      }

      case 'warranty': {
        // ECP extended warranty: dealer wholesale margin ~$800-$1,200, target ~$1,900 CAD
        const recommendedTarget = 1900;
        const explanation =
          'Dealership retail ECP warranty pricing includes $800–$1,200 in business office dealer commission. Under Toyota Canada policy, buyers have a statutory 31-day grace window post-delivery to purchase official Toyota ECP from ANY Canadian Toyota dealership at or near wholesale cost ($1,900–$2,100 CAD).';
        const statutoryRule = 'Toyota Canada 31-Day Post-Delivery ECP Purchase Window';

        const overcharge = Math.max(0, item.amount - recommendedTarget);
        negotiableTotal += overcharge;

        flaggedItems.push({
          name: item.name,
          amount: item.amount,
          recommendedTarget,
          explanation,
          statutoryRule,
        });
        break;
      }

      case 'other':
      default: {
        // Generic dealer fee
        const recommendedTarget = 0;
        const explanation =
          'Unclassified dealer add-on fee. Verify if this fee was consented to in writing or if it represents non-statutory dealership markup.';
        const statutoryRule = 'Negotiable Line Item';

        const overcharge = Math.max(0, item.amount - recommendedTarget);
        negotiableTotal += overcharge;

        flaggedItems.push({
          name: item.name,
          amount: item.amount,
          recommendedTarget,
          explanation,
          statutoryRule,
        });
        break;
      }
    }
  }

  const rebuttalScript = generateRebuttalScript({
    province,
    items,
    flaggedItems,
    statutoryTotal,
    negotiableTotal,
    modelName: options.modelName || 'Toyota Vehicle',
    dealerName: options.dealerName,
  });

  return {
    totalQuoted,
    statutoryTotal,
    negotiableTotal,
    flaggedItems,
    rebuttalScript,
  };
}

/**
 * Generate 1-click counter-offer rebuttal email script tailored to province regulations
 */
export function generateRebuttalScript(params: {
  province: ProvinceCode;
  items: LineItem[];
  flaggedItems: FlaggedItem[];
  statutoryTotal: number;
  negotiableTotal: number;
  modelName: string;
  dealerName?: string;
}): string {
  const { province, flaggedItems, negotiableTotal, modelName, dealerName } = params;
  const defs = PROVINCIAL_DEFAULTS[province] || PROVINCIAL_DEFAULTS.OTHER;
  const recipient = dealerName?.trim() ? dealerName.trim() : 'Sales Team / Business Office';

  let regulatoryReference = '';
  if (province === 'AB') {
    regulatoryReference = `Under the Alberta Consumer Protection Act and AMVIC (Alberta Motor Vehicle Industry Council) All-In Price Advertising regulations (Vehicle Sales Regulation s. 11), the advertised vehicle price must be the all-inclusive price, excluding only GST and licensing fees. Documentation, administrative, and pre-delivery preparation fees cannot be added above the advertised price.`;
  } else if (province === 'ON') {
    regulatoryReference = `Under the Ontario Motor Vehicle Dealers Act (MVDA 2002 - O. Reg. 333/08, s. 36) enforced by OMVIC, all-in price advertising is legally mandatory. Registered dealers are prohibited from adding administration fees, documentation fees, or mandatory security packages on top of the advertised MSRP.`;
  } else if (province === 'BC') {
    regulatoryReference = `Under Vehicle Sales Authority of British Columbia (VSA) regulations and the Business Practices and Consumer Protection Act (BPCPA), dealers must provide transparent all-in pricing and cannot mandate auxiliary accessory packages or prep fees beyond the advertised vehicle price.`;
  } else {
    regulatoryReference = `Under provincial fair trading and consumer protection guidelines, non-statutory dealer fees and optional accessory packages cannot be unilaterally mandated as a condition of vehicle sale.`;
  }

  const itemizedPoints = flaggedItems.map((item) => {
    if (item.recommendedTarget === 0) {
      return `• Remove ${item.name} ($${item.amount.toLocaleString()} CAD): Requesting full removal of this non-statutory dealer add-on.`;
    }
    return `• Adjust ${item.name} ($${item.amount.toLocaleString()} CAD): Re-quote to market/OEM target rate of $${item.recommendedTarget.toLocaleString()} CAD (benchmark: parts list + standard book rate), saving $${(item.amount - item.recommendedTarget).toLocaleString()} CAD.`;
  }).join('\n');

  return `Subject: Purchase Agreement Review & Counter-Offer – ${modelName}

Dear ${recipient},

Thank you for providing the quote worksheet for the ${modelName}. I am looking forward to finalizing this purchase and taking delivery.

Before signing the binding bill of sale, I reviewed the itemized breakdown against provincial automotive retail regulations in ${defs.provinceName}.

${regulatoryReference}

To move forward and execute the agreement immediately, please adjust the following line items on the purchase worksheet:

${itemizedPoints || '• Remove all non-statutory dealer fees and pre-installed accessories.'}

Total requested price correction: $${negotiableTotal.toLocaleString()} CAD.

I am prepared to place a firm deposit and execute the purchase contract today at the official manufacturer MSRP plus statutory Freight & PDI, federal air conditioning excise tax ($100), provincial tire recycling levy ($${defs.tireLevy}), ${defs.regulatorShort} fee ($${defs.regulatoryLevy}), and official provincial licensing fees.

Please send an updated purchase agreement reflecting these corrections, and I will sign right away.

Thank you for your professionalism and assistance.

Sincerely,
[Your Name]
[Your Phone Number]
[Your Email Address]`;
}
