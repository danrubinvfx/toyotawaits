import type {
  CountryCode,
  USState,
  CanadianProvince,
  SubmissionStatus,
  OrderStage,
  SubmissionStage,
  PricingType as LegacyPricingType,
} from '@/lib/types/contracts';

export type SubmissionCountry = 'CA' | 'US';
export type SubmissionCurrency = 'CAD' | 'USD';
export type SubmissionPricingType = 'at_msrp' | 'markup' | 'discount' | 'mandatory_addons';

export interface SubmissionData {
  id?: string;
  modelId: string;
  powertrainId: string;
  trimId: string;
  modelSlug?: string;
  powertrainSlug?: string;
  trimSlug?: string;
  model?: string;
  powertrain?: string;
  trim?: string;
  country: SubmissionCountry;
  countryCode?: CountryCode;
  country_code?: CountryCode;
  currency: SubmissionCurrency;
  province: string;
  state?: string | null;
  adm_markup?: number | null;
  dealerMarkupAdm?: number | null;
  dealer_markup_adm?: number | null;
  pricing_type?: SubmissionPricingType | null;
  pricing?: LegacyPricingType | SubmissionPricingType;
  portDestination?: string | null;
  port_destination?: string | null;
  dealershipCity?: string | null;
  dealershipName?: string | null;
  modelYear: number;
  orderDate: string;
  deliveryDate?: string | null;
  status: SubmissionStatus;
  stage?: OrderStage | SubmissionStage;
  currentStage?: SubmissionStage;
  mandatoryAddonsCad?: number;
  tradeInRequired?: boolean;
  notes?: string | null;
  turnstileToken?: string;
  honeypot?: string;
}

export type {
  CountryCode,
  USState,
  CanadianProvince,
  SubmissionStatus,
  OrderStage,
  SubmissionStage,
};
