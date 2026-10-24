/**
 * lib/discovery/types.ts
 *
 * Domain models and TypeScript interfaces for ToyotaWaits.ca Master Plan V3.2
 * Sprint 2: Dealer Discovery & Inventory Ingestion Schema
 *
 * Appendix A & Section 3 Strict Adherence:
 * - Independent models for Sources, Dealers, Vehicles, DealerListings, Observations, StatusEvents, AlertOutbox
 * - Strict 17-character VIN vs provisional identifiers
 * - Normalized listing statuses conforming to Page 3
 * - Separation of MSRP, advertised price, and mandatory fees
 */

/**
 * Normalized listing availability statuses per Master Plan V3.2 Page 3.
 * Preserves epistemic honesty: availability is not inferred; statuses reflect observed declarations.
 */
export enum NormalizedListingStatus {
  ADVERTISED_UNCONFIRMED = 'Advertised - availability unconfirmed',
  INCOMING_UNCONFIRMED = 'Incoming availability unconfirmed',
  RESERVED_SOLD = 'Reserved / sold',
  NO_LONGER_OBSERVED = 'No longer observed / stale',
}

export type ListingStatus =
  | 'Advertised - availability unconfirmed'
  | 'Incoming availability unconfirmed'
  | 'Reserved / sold'
  | 'No longer observed / stale'
  | 'No longer observed';

/**
 * Ingestion Source entity representing an external dealer feed / provider.
 */
export interface Source {
  id: string;
  code: string;
  name: string;
  platform: 'convertus' | 'dealer_inspire' | 'generic' | string;
  baseUrl: string;
  endpointUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Dealership entity in the discovery catalog.
 */
export interface Dealer {
  id: string;
  sourceId?: string | null;
  dealerCode: string;
  name: string;
  brand: string;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  country: string;
  postalCode?: string | null;
  phone?: string | null;
  websiteUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Physical / Canonical Vehicle Record.
 * Strictly distinguishes true 17-character VINs from provisional / internal stock identifiers.
 */
export interface VehicleRecord {
  id: string;
  vin: string | null;
  provisionalId: string | null;
  isProvisionalVin: boolean;
  make: string;
  model: string;
  trim?: string | null;
  modelYear: number;
  modelCode?: string | null;
  packageCode?: string | null;
  bodyStyle?: string | null;
  powertrain?: string | null;
  transmission?: string | null;
  driveTrain?: string | null;
  exteriorColor?: string | null;
  interiorColor?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Dealer Listing entity tying a vehicle to a specific dealer inventory listing.
 */
export interface DealerListing {
  id: string;
  dealerId: string;
  vehicleId: string;
  sourceListingId: string;
  stockNumber?: string | null;
  vdpUrl?: string | null;
  listingUrl?: string | null;
  imageUrl?: string | null;
  hasRealPhoto?: boolean;
  imageSource?: string;
  currentStatus: NormalizedListingStatus;
  rawStatus?: string | null;
  daysOnLot?: number | null;
  postedAt?: string | null;
  firstObservedAt: string;
  lastObservedAt: string;
  lastSuccessfulCheck?: string | null;
  staleAt?: string | null;
  consecutiveMissedSweeps?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Timestamped Observation snapshot of a listing during an audit/ingestion run.
 * Captures raw payload, financial breakdown, and verification state.
 */
export interface ListingObservation {
  id: string;
  dealerListingId: string;
  observedAt: string;
  rawStatus?: string | null;
  normalizedStatus: NormalizedListingStatus;
  msrp: number | null;
  rawMsrp?: string | null;
  advertisedPrice: number | null;
  rawAdvertisedPrice?: string | null;
  sellingPrice: number | null;
  rawSellingPrice?: string | null;
  mandatoryFees: number | null;
  hasUnverifiedFees: boolean;
  rawPayloadHash?: string | null;
  rawPayload?: Record<string, any> | null;
  createdAt: string;
}

/**
 * Status Transition Event capturing lifecycle changes with audit trail evidence.
 */
export interface StatusEvent {
  id: string;
  dealerListingId: string;
  observationId?: string | null;
  previousStatus: NormalizedListingStatus | null;
  newStatus: NormalizedListingStatus;
  transitionReason: string;
  evidencePayload?: Record<string, any> | null;
  eventTimestamp: string;
  createdAt: string;
}

/**
 * Outbox status types including worker claiming, sent, dead-letter and suppression states.
 */
export type AlertOutboxStatus =
  | 'pending'
  | 'claimed'
  | 'delivered'
  | 'sent'
  | 'failed'
  | 'suppressed'
  | 'cancelled';

/**
 * Alert Outbox entity supporting idempotent worker delivery and lease locking per Appendix A5.
 */
export interface AlertOutboxItem {
  id: string;
  deliveryKey: string;
  idempotencyKey: string;
  recipient: string;
  channel: 'email' | 'webhook';
  payload: Record<string, any>;
  status: AlertOutboxStatus;
  claimToken?: string | null;
  claimExpiresAt?: string | null;
  attempts: number;
  maxAttempts: number;
  lastError?: string | null;
  deliveredAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Search criteria for matching public inventory listings to buyer subscriptions.
 */
export interface SearchCriteria {
  make?: string;
  model?: string;
  trim?: string;
  modelYear?: number;
  province?: string;
  city?: string;
  dealerId?: string;
  maxPrice?: number;
  includeSold?: boolean;
}

/**
 * Saved Search / Alert Subscription entity for matching transitions.
 */
export interface SavedSearch {
  id: string;
  userId?: string | null;
  recipient: string;
  channel?: 'email' | 'webhook';
  hasConsent?: boolean;
  isSuppressed?: boolean;
  unsubscribeToken?: string;
  budgetRemaining?: number;
  criteria?: SearchCriteria;
  includeSoldTransitions?: boolean;
  createdAt?: string;
}

/**
 * Formatted notification message ready for transmission.
 */
export interface FormattedNotification {
  subject: string;
  html: string;
  text: string;
  headers: Record<string, string>;
}

/**
 * Email transmission provider contract.
 */
export interface EmailProvider {
  sendEmail(params: {
    to: string;
    subject: string;
    html: string;
    text: string;
    headers?: Record<string, string>;
  }): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

/**
 * Standard regex pattern for strict 17-character ISO VIN validation.
 * Excludes characters 'I', 'O', and 'Q' to comply with North American / ISO 3779 standards.
 */
export const VIN_17_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/i;

/**
 * Validates whether a candidate string is a true 17-character VIN.
 */
export function isValid17CharVin(candidate?: string | null): boolean {
  if (!candidate || typeof candidate !== 'string') return false;
  return VIN_17_REGEX.test(candidate.trim());
}

/**
 * Normalized parsed vehicle listing produced by ingestion adapters before DB insertion.
 */
export interface ParsedVehicleListing {
  vehicle: {
    vin: string | null;
    provisionalId: string | null;
    isProvisionalVin: boolean;
    make: string;
    model: string;
    trim: string | null;
    modelYear: number;
    modelCode: string | null;
    packageCode: string | null;
    bodyStyle: string | null;
    powertrain: string | null;
    transmission: string | null;
    driveTrain: string | null;
    exteriorColor: string | null;
    interiorColor: string | null;
  };
  listing: {
    sourceListingId: string;
    stockNumber: string | null;
    vdpUrl: string | null;
    listingUrl?: string | null;
    imageUrl?: string | null;
    hasRealPhoto?: boolean;
    imageSource?: string;
    rawStatus: string;
    normalizedStatus: NormalizedListingStatus;
    daysOnLot: number | null;
    postedAt?: string | null;
  };
  pricing: {
    msrp: number | null;
    rawMsrp: string | null;
    askingPrice: number | null;
    rawAskingPrice: string | null;
    sellingPrice: number | null;
    rawSellingPrice: string | null;
    mandatoryFees: number | null;
    hasUnverifiedFees: boolean;
  };
  raw: Record<string, any>;
}

/**
 * Quarantined malformed record caught during adapter ingestion.
 */
export interface QuarantinedRecord {
  record: any;
  reason: string;
  timestamp: string;
}

/**
 * Adapter parse result structure ensuring no unhandled crashes.
 */
export interface AdapterParseResult {
  success: boolean;
  count: number;
  totalInPayload: number;
  records: ParsedVehicleListing[];
  quarantined: QuarantinedRecord[];
  error?: string;
}

/**
 * Telemetry log record for source endpoint health & reliability (Gate 2 Readiness).
 */
export interface SourceHealthLog {
  id: string;
  sourceId: string;
  dealerId?: string | null;
  checkTimestamp: string;
  status: 'success' | 'failure' | 'degraded' | 'rate_limited' | 'timeout';
  httpStatus?: number | null;
  latencyMs?: number | null;
  itemsObserved: number;
  quarantinedItems: number;
  errorMessage?: string | null;
  createdAt: string;
}

/**
 * Gate 2 Private Trial audit report metrics.
 */
export interface TrialReportMetrics {
  generatedAt: string;
  reportingWindowDays: number;
  sourcesEvaluated: number;
  uptimePercentage: number;
  gate2UptimeTargetMet: boolean;
  totalObservations: number;
  uniqueVehiclesObserved: number;
  statusTransitionsCount: number;
  staleListingCount: number;
  staleListingPercentage: number;
  traceabilityScore: number;
  gate2TraceabilityMet: boolean;
  breakdownByStatus: Record<string, number>;
  sourceHealthSummary: Array<{
    sourceId: string;
    sourceName: string;
    dealerName: string;
    totalChecks: number;
    successfulChecks: number;
    uptimePercentage: number;
    lastStatus: string;
    lastCheckedAt: string;
  }>;
}
