/**
 * src/lib/compliance/omvic.ts
 *
 * Ontario Motor Vehicle Industry Council (OMVIC) All-In Pricing Statutory Rules Engine
 * Enforces Ontario Motor Vehicle Dealers Act (MVDA, 2002 - O. Reg. 333/08, s. 36)
 * All-In Price Advertising compliance auditing and rebuttal script generation.
 */

import { DEALERS } from '@/config/dealers';

export interface OntarioModelPreset {
  id: string;
  name: string;
  msrp: number;
  freightPdi: number;
}

export const ONTARIO_MODEL_PRESETS: OntarioModelPreset[] = [
  {
    id: 'rav4-hybrid',
    name: 'RAV4 Hybrid',
    msrp: 36150,
    freightPdi: 1930,
  },
  {
    id: 'rav4-phev',
    name: 'RAV4 PHEV',
    msrp: 51150,
    freightPdi: 1930,
  },
  {
    id: 'sienna',
    name: 'Sienna',
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
  {
    id: 'highlander',
    name: 'Highlander Hybrid',
    msrp: 50750,
    freightPdi: 2030,
  },
  {
    id: 'tacoma',
    name: 'Tacoma',
    msrp: 46950,
    freightPdi: 2030,
  },
  {
    id: 'camry-hybrid',
    name: 'Camry Hybrid',
    msrp: 34300,
    freightPdi: 1930,
  },
];

export const ONTARIO_STATUTORY_DEFAULTS = {
  freightPdi: 1930,
  acTax: 100,
  tireLevy: 20,
  omvicFee: 22,
  licensingNewPlates: 59,
  licensingTransfer: 32,
  hstRate: 0.13,
} as const;

export const OMVIC_OFFICIAL_URL =
  'https://www.omvic.ca/buying/your-rights/all-in-price-advertising/';
export const OMVIC_CONSUMER_PHONE = '1-800-943-6002';

export interface OmvicLineItemInput {
  id?: string;
  label: string;
  amount: number;
}

export type NonCompliantCategory =
  | 'Documentation / Admin Fee'
  | 'Window Etching / Anti-Theft / Security Guard'
  | 'Nitrogen Fill / Tire & Rim Package'
  | 'Dealer Prep / Additional PDI / Inspection Surcharge'
  | 'Mandatory Protection Package / Ceramic / Undercoat'
  | 'Unapproved Dealer Add-On';

export interface AuditedOmvicLineItem {
  id: string;
  label: string;
  amount: number;
  category: NonCompliantCategory | 'Statutory / Permitted';
  isCompliant: boolean;
  reason: string;
}

export interface OmvicAuditInput {
  dealerName?: string;
  modelName?: string;
  msrp: number;
  freightPdi?: number;
  acTax?: number;
  tireLevy?: number;
  omvicFee?: number;
  licensing?: number;
  additionalFees?: OmvicLineItemInput[];
  lineItems?: OmvicLineItemInput[];
  fees?: OmvicLineItemInput[];
  dealerQuotedTotal?: number;
}

export interface OmvicAuditResult {
  dealerName: string;
  modelName?: string;
  statutoryBreakdown: {
    msrp: number;
    freightPdi: number;
    acTax: number;
    tireLevy: number;
    omvicFee: number;
    licensing: number;
  };
  statutoryAllInPrice: number;
  dealerQuotedTotal: number;
  potentialOvercharge: number;
  hstAmount: number;
  statutoryTotalWithHst: number;
  isCompliant: boolean;
  flaggedItems: AuditedOmvicLineItem[];
  allAuditedItems: AuditedOmvicLineItem[];
  rebuttalScript: string;
}

/**
 * Returns the list of registered Ontario Toyota dealerships from our platform configuration.
 */
export function getOntarioRegisteredDealers(): Array<{
  id: string;
  name: string;
  city: string;
}> {
  return Object.values(DEALERS)
    .filter((d) => d.province === 'ON')
    .map((d) => ({
      id: d.id,
      name: d.name,
      city: d.city,
    }));
}

/**
 * Classifies a dealer-added line item and explains why it violates OMVIC All-In Price Advertising
 * when added on top of the advertised price.
 */
export function classifyOmvicFeeItem(
  item: OmvicLineItemInput,
  index = 0
): AuditedOmvicLineItem {
  const id = item.id || `fee-${index + 1}`;
  const cleanLabel = (item.label || 'Unnamed Dealer Fee').trim();
  const lower = cleanLabel.toLowerCase();
  const amount = Number.isFinite(item.amount) ? Math.max(0, Number(item.amount)) : 0;

  if (amount <= 0) {
    return {
      id,
      label: cleanLabel,
      amount: 0,
      category: 'Statutory / Permitted',
      isCompliant: true,
      reason: 'Zero-dollar line item does not increase the advertised all-in price.',
    };
  }

  // Check if user entered a statutory item into the custom list by mistake
  if (
    lower === 'hst' ||
    lower === '13% hst' ||
    lower.includes('harmonized sales tax') ||
    lower.includes('serviceontario') ||
    lower.includes('plate transfer') ||
    lower.includes('license plate')
  ) {
    return {
      id,
      label: cleanLabel,
      amount,
      category: 'Statutory / Permitted',
      isCompliant: true,
      reason:
        'Permitted under MVDA O. Reg. 333/08: Only 13% HST and actual ServiceOntario licensing may be added on top of the advertised price.',
    };
  }

  if (
    lower.includes('doc') ||
    lower.includes('admin') ||
    lower.includes('processing') ||
    lower.includes('finance fee') ||
    lower.includes('brokerage') ||
    lower.includes('conveyancing')
  ) {
    return {
      id,
      label: cleanLabel,
      amount,
      category: 'Documentation / Admin Fee',
      isCompliant: false,
      reason:
        'Violates OMVIC All-In Pricing (MVDA O. Reg. 333/08 s. 36): Any dealer administration or documentation fee must already be included inside the advertised vehicle price, never added on top.',
    };
  }

  if (
    lower.includes('etch') ||
    lower.includes('anti-theft') ||
    lower.includes('anti theft') ||
    lower.includes('security') ||
    lower.includes('kycs') ||
    lower.includes('phantom') ||
    lower.includes('trace') ||
    lower.includes('globali') ||
    lower.includes('theft')
  ) {
    return {
      id,
      label: cleanLabel,
      amount,
      category: 'Window Etching / Anti-Theft / Security Guard',
      isCompliant: false,
      reason:
        'Violates OMVIC All-In Pricing: Pre-installed security etching, GPS trackers, or anti-theft products cannot be forced as mandatory extra charges above the advertised price.',
    };
  }

  if (
    lower.includes('nitrogen') ||
    lower.includes('wheel lock') ||
    lower.includes('tire & rim') ||
    lower.includes('tire and rim') ||
    lower.includes('road hazard') ||
    lower.includes('rim')
  ) {
    return {
      id,
      label: cleanLabel,
      amount,
      category: 'Nitrogen Fill / Tire & Rim Package',
      isCompliant: false,
      reason:
        'Violates OMVIC All-In Pricing: Nitrogen tire fills, wheel locks, or tire/rim warranties must be optional or included in the advertised price.',
    };
  }

  if (
    lower.includes('prep') ||
    lower.includes('additional pdi') ||
    lower.includes('inspection') ||
    lower.includes('detail') ||
    lower.includes('fuel') ||
    lower.includes('gas') ||
    lower.includes('surcharge')
  ) {
    return {
      id,
      label: cleanLabel,
      amount,
      category: 'Dealer Prep / Additional PDI / Inspection Surcharge',
      isCompliant: false,
      reason:
        'Violates OMVIC All-In Pricing: Factory Freight & PDI already covers pre-delivery inspection. Dealers cannot add secondary prep, detailing, or inspection surcharges.',
    };
  }

  if (
    lower.includes('protection') ||
    lower.includes('ceramic') ||
    lower.includes('undercoat') ||
    lower.includes('rust') ||
    lower.includes('paint') ||
    lower.includes('fabric') ||
    lower.includes('tint') ||
    lower.includes('ppf') ||
    lower.includes('warranty') ||
    lower.includes('mat')
  ) {
    return {
      id,
      label: cleanLabel,
      amount,
      category: 'Mandatory Protection Package / Ceramic / Undercoat',
      isCompliant: false,
      reason:
        'Violates OMVIC All-In Pricing: Protection packages, rustproofing, ceramic coatings, or accessory bundles cannot be mandated as a condition of sale above the advertised price.',
    };
  }

  return {
    id,
    label: cleanLabel,
    amount,
    category: 'Unapproved Dealer Add-On',
    isCompliant: false,
    reason:
      'Violates OMVIC All-In Pricing: Under Ontario law, only 13% HST and actual ServiceOntario licensing may be added to the advertised price.',
  };
}

/**
 * Generates an OMVIC-backed rebuttal message referencing the Ontario Motor Vehicle Dealers Act (MVDA).
 */
export function generateOmvicRebuttalScript(params: {
  dealerName?: string | null;
  overchargeAmount: number;
}): string {
  const dealer = params.dealerName?.trim() || 'Dealership Team';
  const formattedOvercharge = Math.max(0, Math.round(params.overchargeAmount)).toLocaleString(
    'en-CA'
  );

  return `Hi ${dealer}, thank you for the quote. Under OMVIC All-In Price Advertising regulations (Ontario Motor Vehicle Dealers Act), all mandatory dealer fees, administrative costs, and pre-installed items must be included in the advertised price. Only HST and actual ServiceOntario licensing can be added. Please provide an updated bill of sale with the $${formattedOvercharge} in additional fees removed so we can finalize the agreement.`;
}

/**
 * Audits an Ontario Toyota dealer quote against statutory OMVIC All-In Pricing rules.
 */
export function auditOmvicQuote(input: OmvicAuditInput): OmvicAuditResult {
  const dealerName = input.dealerName?.trim() || 'Ontario Toyota Dealership';
  const msrp = Math.max(0, Number(input.msrp) || 0);
  const freightPdi =
    input.freightPdi !== undefined
      ? Math.max(0, Number(input.freightPdi))
      : ONTARIO_STATUTORY_DEFAULTS.freightPdi;
  const acTax =
    input.acTax !== undefined
      ? Math.max(0, Number(input.acTax))
      : ONTARIO_STATUTORY_DEFAULTS.acTax;
  const tireLevy =
    input.tireLevy !== undefined
      ? Math.max(0, Number(input.tireLevy))
      : ONTARIO_STATUTORY_DEFAULTS.tireLevy;
  const omvicFee =
    input.omvicFee !== undefined
      ? Math.max(0, Number(input.omvicFee))
      : ONTARIO_STATUTORY_DEFAULTS.omvicFee;
  const licensing =
    input.licensing !== undefined
      ? Math.max(0, Number(input.licensing))
      : ONTARIO_STATUTORY_DEFAULTS.licensingNewPlates;

  const statutoryAllInPrice =
    Math.round((msrp + freightPdi + acTax + tireLevy + omvicFee + licensing) * 100) / 100;

  const rawItems = input.additionalFees ?? input.lineItems ?? input.fees ?? [];
  const allAuditedItems = rawItems.map((item, idx) => classifyOmvicFeeItem(item, idx));
  const flaggedItems = allAuditedItems.filter((item) => !item.isCompliant && item.amount > 0);

  const flaggedTotal = flaggedItems.reduce((sum, item) => sum + item.amount, 0);

  const dealerQuotedTotal =
    input.dealerQuotedTotal !== undefined
      ? Math.round(Math.max(0, Number(input.dealerQuotedTotal)) * 100) / 100
      : Math.round((statutoryAllInPrice + flaggedTotal) * 100) / 100;

  const potentialOvercharge = Math.max(
    0,
    Math.round((dealerQuotedTotal - statutoryAllInPrice) * 100) / 100
  );

  // HST applies to vehicle + freight/PDI + AC tax + tire levy + OMVIC fee (licensing is HST-exempt)
  const taxableSubtotal = msrp + freightPdi + acTax + tireLevy + omvicFee;
  const hstAmount = Math.round(taxableSubtotal * ONTARIO_STATUTORY_DEFAULTS.hstRate * 100) / 100;
  const statutoryTotalWithHst = Math.round((statutoryAllInPrice + hstAmount) * 100) / 100;

  const isCompliant = potentialOvercharge === 0 && flaggedItems.length === 0;

  const rebuttalScript = generateOmvicRebuttalScript({
    dealerName: input.dealerName,
    overchargeAmount: potentialOvercharge,
  });

  return {
    dealerName,
    modelName: input.modelName,
    statutoryBreakdown: {
      msrp,
      freightPdi,
      acTax,
      tireLevy,
      omvicFee,
      licensing,
    },
    statutoryAllInPrice,
    dealerQuotedTotal,
    potentialOvercharge,
    hstAmount,
    statutoryTotalWithHst,
    isCompliant,
    flaggedItems,
    allAuditedItems,
    rebuttalScript,
  };
}
