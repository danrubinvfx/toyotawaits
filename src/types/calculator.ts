/**
 * ToyotaWaits.ca - Savings & Payback Calculator Types
 * Specification Reference: Master Plan v3.1 (19 October 2026) - Stage 1 (Evidence & Engine)
 */

export type ComparisonMode =
  | 'ENERGY_COMPARISON'
  | 'KEEP_VS_REPLACE'
  | 'NEW_A_VS_NEW_B';

export type ProvenanceStatus =
  | 'VERIFIED'
  | 'PROVISIONAL'
  | 'HISTORICAL'
  | 'UNAVAILABLE';

export type ElectricityMeasurementBasis =
  | 'WALL_TO_WHEEL'
  | 'BATTERY_SIDE'
  | 'MANUFACTURER_ESTIMATE';

export type Powertrain = 'GAS' | 'HEV' | 'PHEV' | 'BEV';

export interface VehicleIdentity {
  make: string;
  model: string;
  year: number;
  trim?: string;
  powertrain: Powertrain;
}

export interface ProvenanceMetadata {
  sourceUrl: string;
  verifiedAtDate: string; // ISO 8601 date (YYYY-MM-DD)
  datasetVersion: string;
  status: ProvenanceStatus;
  notes?: string;
}

export interface VehicleConsumptionRecord {
  identity: VehicleIdentity;
  // Consumption ratings
  combinedL100km?: number;
  cityL100km?: number;
  highwayL100km?: number;
  // PHEV / BEV specific ratings
  electricRangeKm?: number;
  wallKwhPer100km?: number;
  batterySideKwhPer100km?: number;
  gasModeL100km?: number;
  electricityMeasurementBasis?: ElectricityMeasurementBasis;
  // Provenance metadata
  sourceUrl: string;
  verifiedAtDate: string;
  datasetVersion: string;
  status: ProvenanceStatus;
}

export interface VehiclePriceRecord {
  identity: VehicleIdentity;
  msrpCad: number;
  freightPdiCad?: number;
  dealerAdminFeeCad?: number;
  estimatedDeliveryDays?: number;
  // Provenance metadata
  sourceUrl: string;
  verifiedAtDate: string;
  datasetVersion: string;
  status: ProvenanceStatus;
}

export interface VehiclePresetRecord {
  id: string;
  name: string;
  category: 'NEW_VEHICLE' | 'TRADE_IN_ARCHETYPE';
  identity: VehicleIdentity;
  consumption: VehicleConsumptionRecord;
  pricing?: VehiclePriceRecord;
  isTradeInArchetype: boolean;
  typicalWaitDays?: number;
  notes?: string;
}

export interface DrivingInputs {
  annualKm: number;
  electricShare?: number; // 0.0 to 1.0 (defaults to 0.65 for PHEV when omitted)
  gasPricePerL: number; // CAD per liter
  electricityRatePerKwh: number; // CAD per kWh
}

export interface CurrentVehicleInput {
  identity?: Partial<VehicleIdentity>;
  l100km: number;
  annualMaintenanceCad?: number;
  annualInsuranceCad?: number;
  tradeInValueCad?: number;
  residualValueCad?: number;
}

export interface TargetVehicleSelection {
  presetId?: string;
  identity?: VehicleIdentity;
  consumption?: VehicleConsumptionRecord;
  pricing?: VehiclePriceRecord;
  customCombinedL100km?: number;
  customWallKwhPer100km?: number;
  customGasModeL100km?: number;
  customElectricRangeKm?: number;
  deliveryWaitDays?: number;
}

export interface PurchaseOutlayInput {
  vehiclePriceCad: number;
  freightPdiCad?: number;
  dealerFeesCad?: number;
  governmentRebatesCad?: number;
  tradeInValueCad?: number;
  salesTaxRate?: number;
  downPaymentCad?: number;
  netOutlayCad: number;
}

export type PaybackCondition =
  | 'POSITIVE_PAYBACK'
  | 'NO_ENERGY_SAVINGS'
  | 'HIGHER_ENERGY_COST'
  | 'NO_UPFRONT_PREMIUM'
  | 'LOWER_OUTLAY_SAVINGS'
  | 'LOWER_OUTLAY_HIGHER_ENERGY';

export interface PaybackResult {
  condition: PaybackCondition;
  annualSavings: number; // S = annualCostRef - annualCostTarget
  upfrontDifference: number; // D = outlayTarget - outlayRef
  simplePaybackYears: number | null; // Post-delivery payback (D / S)
  effectivePaybackYears: number | null; // Total payback from day 0 accounting for wait deficit
  extraEnergyCostWhileWaiting: number; // (annualCostRef - annualCostTarget) * (waitDays / 365)
  breakEvenDays: number | null;
  summaryMessage: string;
}

export interface CashFlowScenario {
  name: string;
  deliveryWaitDays: number;
  upfrontOutlay: number;
  annualEnergyCost: number;
  waitingAnnualEnergyCost?: number;
  annualMaintenanceCad?: number;
  annualInsuranceCad?: number;
}

export interface CashFlowPoint {
  day: number;
  year: number;
  refCumulativeCost: number;
  targetCumulativeCost: number;
  netAdvantageTarget: number; // refCumulativeCost - targetCumulativeCost (positive = target ahead)
  event?: string;
  isStepPoint?: boolean;
}

export interface CashFlowTimelineResult {
  points: CashFlowPoint[];
  horizonYears: number;
  crossoverDay: number | null;
  crossoverYear: number | null;
  netAdvantageAtHorizon: number;
}

export interface PHEVCostBreakdown {
  electricCost: number;
  gasCost: number;
  totalCost: number;
}
