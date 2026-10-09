// ============================================================================
// TOYOTAWAITS.CA DOMAIN TYPES & DATA CONTRACTS
// ============================================================================

export type CanadianProvince =
  | 'AB' // Alberta
  | 'BC' // British Columbia
  | 'MB' // Manitoba
  | 'NB' // New Brunswick
  | 'NL' // Newfoundland and Labrador
  | 'NS' // Nova Scotia
  | 'NT' // Northwest Territories
  | 'NU' // Nunavut
  | 'ON' // Ontario
  | 'PE' // Prince Edward Island
  | 'QC' // Quebec
  | 'SK' // Saskatchewan
  | 'YT'; // Yukon

export type SubmissionStatus = 'pending' | 'delivered' | 'cancelled';

export type SubmissionStage =
  | 'deposit_placed'
  | 'allocation_confirmed'
  | 'freight_transit'
  | 'arrived_at_dealer'
  | 'delivered';

export type PricingType = 'at_msrp' | 'above_msrp' | 'below_msrp' | 'undisclosed';

// ----------------------------------------------------------------------------
// Relational Entity Interfaces
// ----------------------------------------------------------------------------

export interface VehicleModel {
  id: string; // UUIDv4
  slug: string; // e.g. "rav4", "sienna"
  name: string; // e.g. "RAV4"
  manufacturer: string; // "Toyota"
  generationStartYear: number; // e.g. 2019
  isActive: boolean;
  sortOrder: number;
  createdAt: string; // ISO 8601
}

export interface VehiclePowertrain {
  id: string; // UUIDv4
  modelId: string; // UUIDv4 FK
  slug: string; // e.g. "hev", "phev", "gas"
  name: string; // e.g. "Hybrid (HEV)"
  sortOrder: number;
  createdAt: string; // ISO 8601
}

export interface VehicleTrim {
  id: string; // UUIDv4
  modelId: string; // UUIDv4 FK
  powertrainId: string; // UUIDv4 FK
  slug: string; // e.g. "xse-technology-awd"
  name: string; // e.g. "XSE AWD Technology Package"
  msrpCad: number; // MSRP in CAD
  sortOrder: number;
  createdAt: string; // ISO 8601
}

export interface Submission {
  id: string; // UUIDv4
  modelId: string;
  powertrainId: string;
  trimId: string;
  province: CanadianProvince;
  dealershipCity?: string | null;
  dealershipName?: string | null;
  modelYear: number;
  orderDate: string; // YYYY-MM-DD
  deliveryDate?: string | null; // YYYY-MM-DD
  status: SubmissionStatus;
  currentStage?: SubmissionStage;
  waitDays?: number | null; // Database-generated calendar days
  pricing: PricingType;
  mandatoryAddonsCad: number;
  tradeInRequired: boolean;
  notes?: string | null;
  isFlagged: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface AffiliateLink {
  id: string; // UUIDv4
  slug: string;
  destinationUrl: string;
  title: string;
  category: string;
  clickCount: number;
  isActive: boolean;
}

// ----------------------------------------------------------------------------
// Statistical Aggregation Contracts
// ----------------------------------------------------------------------------

export interface PercentileStats {
  p25: number; // 25th percentile (days)
  median: number; // 50th percentile (days)
  p75: number; // 75th percentile (days)
  mean: number; // Mean average (days)
  min: number; // Minimum recorded (days)
  max: number; // Maximum recorded (days)
}

export interface RegionalWaitSummary {
  modelSlug: string;
  modelName: string;
  powertrainSlug: string;
  powertrainName: string;
  trimSlug?: string | null;
  trimName?: string | null;
  province: CanadianProvince | 'ALL';
  sampleCounts: {
    total: number;
    delivered: number;
    pending: number;
  };
  waitStats: PercentileStats | null;
  pricingInsights: {
    atMsrpPercent: number;
    aboveMsrpPercent: number;
    avgAddonsCad: number;
  };
  confidenceRating: 'high' | 'medium' | 'low' | 'insufficient_data';
  latestSubmissionAt?: string | null;
  isTrimFallback?: boolean;
  trimNote?: string | null;
}

// ----------------------------------------------------------------------------
// Standard API Envelope
// ----------------------------------------------------------------------------

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}
