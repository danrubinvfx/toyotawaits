// ============================================================================
// TOYOTAWAITS.CA DOMAIN TYPES & DATA CONTRACTS
// ============================================================================

export type CountryCode = 'CA' | 'US';

export type USState =
  | 'AL' | 'AK' | 'AZ' | 'AR' | 'CA' | 'CO' | 'CT' | 'DE' | 'FL' | 'GA'
  | 'HI' | 'ID' | 'IL' | 'IN' | 'IA' | 'KS' | 'KY' | 'LA' | 'ME' | 'MD'
  | 'MA' | 'MI' | 'MN' | 'MS' | 'MO' | 'MT' | 'NE' | 'NV' | 'NH' | 'NJ'
  | 'NM' | 'NY' | 'NC' | 'ND' | 'OH' | 'OK' | 'OR' | 'PA' | 'RI' | 'SC'
  | 'SD' | 'TN' | 'TX' | 'UT' | 'VT' | 'VA' | 'WA' | 'WV' | 'WI' | 'WY'
  | 'DC';

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

export type OrderLifecycleState =
  | 'deposit_placed' // Deposit Placed / Waiting on Allocation
  | 'vin_assigned' // Build Assigned / VIN Generated
  | 'in_transit' // In Transit / Freight
  | 'delivered'; // Delivered / Keys in Hand

export type OrderStage =
  | 'deposit_placed'
  | 'vin_assigned'
  | 'allocation_confirmed'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export type SubmissionStage =
  | 'deposit_placed'
  | 'vin_assigned'
  | 'allocation_confirmed'
  | 'in_transit'
  | 'freight_transit'
  | 'arrived_at_dealer'
  | 'delivered'
  | 'cancelled';

export type DbSubmissionStageEnum =
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
  countryCode?: CountryCode;
  country_code?: CountryCode;
  province?: CanadianProvince | null;
  state?: USState | string | null;
  dealershipCity?: string | null;
  dealershipName?: string | null;
  modelYear: number;
  orderDate: string; // YYYY-MM-DD
  deliveryDate?: string | null; // YYYY-MM-DD
  status: SubmissionStatus;
  stage?: OrderStage;
  currentStage?: SubmissionStage;
  stageUpdatedAt?: string;
  waitDays?: number | null; // Database-generated calendar days
  pricing: PricingType;
  mandatoryAddonsCad: number;
  dealerMarkupAdm?: number | null;
  dealer_markup_adm?: number | null;
  portDestination?: string | null;
  port_destination?: string | null;
  tradeInRequired: boolean;
  isFlagged: boolean;
  editToken?: string;
  email?: string | null;
  lastNudgedAt?: string | null;
  cancelledAt?: string | null;
  isStale?: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export type NudgeAction =
  | 'still_waiting'
  | 'deposit_placed'
  | 'vin_assigned'
  | 'allocation_confirmed'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export interface NudgeActionResult {
  success: boolean;
  action: NudgeAction;
  submission?: {
    id: string;
    model: string;
    modelYear?: number;
    trim?: string | null;
    province: string;
    orderDate: string;
    deliveryDate?: string | null;
    stage: string;
    status: string;
    waitDays?: number | null;
    editToken: string;
    stageUpdatedAt?: string;
  };
  error?: string;
}

export interface NotificationRequest {
  id: string;
  email: string;
  model: string;
  trim?: string | null;
  province: CanadianProvince;
  createdAt: string;
  isActive: boolean;
  unsubscribeToken: string;
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
    stalePending?: number;
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

export interface RecentActivityItem {
  id: string;
  province: string;
  model_name: string;
  trim_name: string;
  powertrain: string;
  status: string;
  lifecycle_status: string;
  order_date: string;
  delivered_date: string | null;
  created_at: string;
  updated_at: string;
  model_year?: number;
  wait_days?: number | null;
}

export interface NewsTickerItem {
  type: 'news';
  id: string;
  headline?: string;
  title: string;
  category?: string | null;
  summary?: string | null;
  tag?: string | null;
  url?: string | null;
  timestamp: string;
}

export interface DeliveryTickerItem {
  type: 'delivery';
  id: string;
  province: string;
  model_name: string;
  trim_name: string;
  powertrain: string;
  model_year?: number;
  daysWaited: number;
  wait_days?: number | null;
  timestamp: string;
}

export type TickerItem = NewsTickerItem | DeliveryTickerItem;


