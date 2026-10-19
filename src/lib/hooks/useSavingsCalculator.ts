'use client';

/**
 * ToyotaWaits.ca - Savings & Payback Calculator Hook
 * Specification Reference: Master Plan v3.1 (Section 1, 2, 3, 4, 5, 6, 7, 8, 9)
 *
 * Manages reactive state for driving inputs, current vehicle, target Toyota vehicle,
 * comparison mode (Mode 1, Mode 2, Mode 3), purchase outlays, and delivery wait days.
 * Synchronizes allowlisted state bidirectionally with URL hash fragment (#c=...)
 * with strict bounds validation and safe fallback defaults on corruption.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  calculateAnnualGasCost,
  calculateAnnualPHEVCost,
  evaluateSimplePayback,
  evaluateCashFlowTimeline,
} from '@/lib/calculator-engine';
import {
  VEHICLE_PRESETS,
  TRADE_IN_ARCHETYPES,
  NEW_VEHICLE_PRESETS,
  getVehiclePresetById,
} from '@/data/vehicle-presets';
import {
  Powertrain,
  ComparisonMode,
  PaybackResult,
  CashFlowTimelineResult,
  CashFlowScenario,
} from '@/types/calculator';

export interface DrivingInputsState {
  annualKm: number;
  gasPricePerL: number;
  electricityRatePerKwh: number;
}

export type CurrentVehicleMode = 'ARCHETYPE' | 'CUSTOM';

export interface CurrentVehicleState {
  mode: CurrentVehicleMode;
  archetypeId: string;
  customL100km: number;
}

export interface TargetVehicleState {
  presetId: string;
  powertrain: Powertrain;
  hasChargingAccess: boolean;
  electricShare: number; // 0.0 to 1.0 (default 0.65 for PHEV when charging is accessible)
}

export interface Mode2OutlayState {
  targetPriceCad: number;
  tradeInProceedsCad: number;
  loanSettlementBalanceCad: number;
  chargerCostCad: number;
  rebatesCad: number;
  netOutlayOverride: number | null;
}

export interface Mode3OutlayState {
  vehicleAPresetId: string;
  vehicleAOutlayCad: number;
  vehicleAWaitDays: number;
  vehicleBPresetId: string;
  vehicleBOutlayCad: number;
  vehicleBWaitDays: number;
}

export interface SerializedCalculatorState {
  k?: number; // annualKm
  gp?: number; // gasPricePerL
  ep?: number; // electricityRatePerKwh
  cm?: CurrentVehicleMode; // current mode
  ca?: string; // current archetype id
  cl?: number; // current custom L/100km
  tp?: string; // target preset id
  pt?: Powertrain; // target powertrain
  ch?: 0 | 1; // hasChargingAccess
  es?: number; // electricShare
  // Stage 4 additions
  cpm?: ComparisonMode;
  tp2?: number; // targetPriceCad
  ti?: number; // tradeInProceedsCad
  lb?: number; // loanSettlementBalanceCad
  cc?: number; // chargerCostCad
  rb?: number; // rebatesCad
  no?: number | null; // netOutlayOverride
  wd?: number; // waitDays
  v1p?: string; // vehicleAPresetId
  v1o?: number; // vehicleAOutlayCad
  v1w?: number; // vehicleAWaitDays
  v2p?: string; // vehicleBPresetId
  v2o?: number; // vehicleBOutlayCad
  v2w?: number; // vehicleBWaitDays
}

export interface CalculatorResults {
  // Current vehicle
  effectiveCurrentL100km: number;
  currentAnnualCost: number;
  currentMonthlyCost: number;
  currentAnnualFuelL: number;

  // Target vehicle
  targetL100km: number;
  targetAnnualCost: number;
  targetMonthlyCost: number;
  targetIsPhev: boolean;

  // PHEV itemized breakdown
  targetAnnualElectricCost: number;
  targetAnnualElectricKwh: number;
  targetAnnualGasCost: number;
  targetAnnualGasL: number;

  // Savings
  annualSavings: number; // currentAnnualCost - targetAnnualCost
  monthlySavings: number;
  savingsPercent: number;

  // Stage 4 Payback & Timeline (optional for test mock backwards compatibility)
  comparisonMode?: ComparisonMode;
  paybackResult?: PaybackResult;
  timelineResult?: CashFlowTimelineResult;
  effectiveNetOutlay?: number;
  calculatedNetOutlay?: number;
  isRecovered?: boolean;
  recoveryYear?: number | null;
  recoveryDay?: number | null;

  // Mode 3 specific results (if Mode 3 active)
  vehicleAAnnualCost?: number;
  vehicleBAnnualCost?: number;

  // Share URL
  shareUrl: string;
}

export const DEFAULT_DRIVING_INPUTS: DrivingInputsState = {
  annualKm: 20000,
  gasPricePerL: 1.75,
  electricityRatePerKwh: 0.14,
};

export const DEFAULT_CURRENT_VEHICLE: CurrentVehicleState = {
  mode: 'ARCHETYPE',
  archetypeId: 'archetype-compact-crossover-awd',
  customL100km: 9.5,
};

export const DEFAULT_TARGET_VEHICLE: TargetVehicleState = {
  presetId: '2026-toyota-rav4-hybrid',
  powertrain: 'HEV',
  hasChargingAccess: true,
  electricShare: 0.65,
};

export const DEFAULT_MODE2_OUTLAY: Mode2OutlayState = {
  targetPriceCad: 42000,
  tradeInProceedsCad: 15000,
  loanSettlementBalanceCad: 0,
  chargerCostCad: 0,
  rebatesCad: 0,
  netOutlayOverride: null,
};

export const DEFAULT_MODE3_OUTLAY: Mode3OutlayState = {
  vehicleAPresetId: '2026-toyota-rav4-hybrid',
  vehicleAOutlayCad: 42000,
  vehicleAWaitDays: 60,
  vehicleBPresetId: '2026-toyota-rav4-phev',
  vehicleBOutlayCad: 52000,
  vehicleBWaitDays: 365,
};

const MAX_HASH_LENGTH = 2048;

/**
 * Serializes state to compact URL hash string (#c=...)
 */
export function serializeCalculatorHash(
  driving: DrivingInputsState,
  current: CurrentVehicleState,
  target: TargetVehicleState,
  comparisonMode: ComparisonMode = 'ENERGY_COMPARISON',
  mode2Outlay: Mode2OutlayState = DEFAULT_MODE2_OUTLAY,
  mode3Outlay: Mode3OutlayState = DEFAULT_MODE3_OUTLAY,
  waitDays = 180
): string {
  const payload: SerializedCalculatorState = {
    k: driving.annualKm,
    gp: driving.gasPricePerL,
    ep: driving.electricityRatePerKwh,
    cm: current.mode,
    ca: current.archetypeId,
    cl: current.customL100km,
    tp: target.presetId,
    pt: target.powertrain,
    ch: target.hasChargingAccess ? 1 : 0,
    es: target.electricShare,
  };

  if (comparisonMode !== 'ENERGY_COMPARISON') {
    payload.cpm = comparisonMode;
  }

  if (waitDays !== 180) {
    payload.wd = waitDays;
  }

  if (comparisonMode === 'KEEP_VS_REPLACE') {
    if (mode2Outlay.targetPriceCad !== DEFAULT_MODE2_OUTLAY.targetPriceCad) {
      payload.tp2 = mode2Outlay.targetPriceCad;
    }
    if (mode2Outlay.tradeInProceedsCad !== DEFAULT_MODE2_OUTLAY.tradeInProceedsCad) {
      payload.ti = mode2Outlay.tradeInProceedsCad;
    }
    if (mode2Outlay.loanSettlementBalanceCad !== 0) {
      payload.lb = mode2Outlay.loanSettlementBalanceCad;
    }
    if (mode2Outlay.chargerCostCad !== 0) {
      payload.cc = mode2Outlay.chargerCostCad;
    }
    if (mode2Outlay.rebatesCad !== 0) {
      payload.rb = mode2Outlay.rebatesCad;
    }
    if (mode2Outlay.netOutlayOverride !== null) {
      payload.no = mode2Outlay.netOutlayOverride;
    }
  } else if (comparisonMode === 'NEW_A_VS_NEW_B') {
    payload.v1p = mode3Outlay.vehicleAPresetId;
    payload.v1o = mode3Outlay.vehicleAOutlayCad;
    payload.v1w = mode3Outlay.vehicleAWaitDays;
    payload.v2p = mode3Outlay.vehicleBPresetId;
    payload.v2o = mode3Outlay.vehicleBOutlayCad;
    payload.v2w = mode3Outlay.vehicleBWaitDays;
  }

  try {
    const jsonStr = JSON.stringify(payload);
    return `#c=${encodeURIComponent(jsonStr)}`;
  } catch {
    return '';
  }
}

/**
 * Deserializes and validates URL hash string into state overrides.
 * Returns null on any validation failure, corruption, or oversized hash.
 */
export function deserializeCalculatorHash(
  hash: string
): Partial<SerializedCalculatorState> | null {
  if (!hash || hash.length > MAX_HASH_LENGTH) {
    return null;
  }

  const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash;
  const match = cleanHash.match(/(?:^|&)c=([^&]+)/);
  if (!match || !match[1]) {
    return null;
  }

  try {
    const rawDecoded = decodeURIComponent(match[1]);
    const parsed = JSON.parse(rawDecoded) as unknown;

    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    const obj = parsed as Record<string, unknown>;
    const validated: Partial<SerializedCalculatorState> = {};

    // Validate annualKm (k)
    if (typeof obj.k === 'number' && Number.isFinite(obj.k)) {
      validated.k = Math.min(150000, Math.max(1000, Math.round(obj.k)));
    }

    // Validate gasPricePerL (gp)
    if (typeof obj.gp === 'number' && Number.isFinite(obj.gp)) {
      validated.gp = Math.min(5.0, Math.max(0.5, Number(obj.gp.toFixed(2))));
    }

    // Validate electricityRatePerKwh (ep)
    if (typeof obj.ep === 'number' && Number.isFinite(obj.ep)) {
      validated.ep = Math.min(1.0, Math.max(0.01, Number(obj.ep.toFixed(3))));
    }

    // Validate current mode (cm)
    if (obj.cm === 'ARCHETYPE' || obj.cm === 'CUSTOM') {
      validated.cm = obj.cm;
    }

    // Validate current archetype id (ca)
    if (
      typeof obj.ca === 'string' &&
      TRADE_IN_ARCHETYPES.some((a) => a.id === obj.ca)
    ) {
      validated.ca = obj.ca;
    }

    // Validate custom L/100km (cl)
    if (typeof obj.cl === 'number' && Number.isFinite(obj.cl)) {
      validated.cl = Math.min(40.0, Math.max(1.0, Number(obj.cl.toFixed(1))));
    }

    // Validate target preset id (tp)
    if (
      typeof obj.tp === 'string' &&
      VEHICLE_PRESETS.some((p) => p.id === obj.tp)
    ) {
      validated.tp = obj.tp;
    }

    // Validate target powertrain (pt)
    if (obj.pt === 'GAS' || obj.pt === 'HEV' || obj.pt === 'PHEV' || obj.pt === 'BEV') {
      validated.pt = obj.pt;
    }

    // Validate charging access (ch)
    if (obj.ch === 0 || obj.ch === 1) {
      validated.ch = obj.ch;
    }

    // Validate electric share (es)
    if (typeof obj.es === 'number' && Number.isFinite(obj.es)) {
      validated.es = Math.min(1.0, Math.max(0.0, Number(obj.es.toFixed(2))));
    }

    // Stage 4 Validations
    if (
      obj.cpm === 'ENERGY_COMPARISON' ||
      obj.cpm === 'KEEP_VS_REPLACE' ||
      obj.cpm === 'NEW_A_VS_NEW_B'
    ) {
      validated.cpm = obj.cpm;
    }

    if (typeof obj.wd === 'number' && Number.isFinite(obj.wd)) {
      validated.wd = Math.min(1825, Math.max(0, Math.round(obj.wd)));
    }

    if (typeof obj.tp2 === 'number' && Number.isFinite(obj.tp2)) {
      validated.tp2 = Math.min(500000, Math.max(0, Math.round(obj.tp2)));
    }
    if (typeof obj.ti === 'number' && Number.isFinite(obj.ti)) {
      validated.ti = Math.min(500000, Math.max(0, Math.round(obj.ti)));
    }
    if (typeof obj.lb === 'number' && Number.isFinite(obj.lb)) {
      validated.lb = Math.min(500000, Math.max(0, Math.round(obj.lb)));
    }
    if (typeof obj.cc === 'number' && Number.isFinite(obj.cc)) {
      validated.cc = Math.min(20000, Math.max(0, Math.round(obj.cc)));
    }
    if (typeof obj.rb === 'number' && Number.isFinite(obj.rb)) {
      validated.rb = Math.min(20000, Math.max(0, Math.round(obj.rb)));
    }
    if (obj.no === null || (typeof obj.no === 'number' && Number.isFinite(obj.no))) {
      validated.no = obj.no === null ? null : Math.min(500000, Math.max(0, Math.round(obj.no)));
    }

    if (typeof obj.v1p === 'string' && VEHICLE_PRESETS.some((p) => p.id === obj.v1p)) {
      validated.v1p = obj.v1p;
    }
    if (typeof obj.v1o === 'number' && Number.isFinite(obj.v1o)) {
      validated.v1o = Math.min(500000, Math.max(0, Math.round(obj.v1o)));
    }
    if (typeof obj.v1w === 'number' && Number.isFinite(obj.v1w)) {
      validated.v1w = Math.min(1825, Math.max(0, Math.round(obj.v1w)));
    }

    if (typeof obj.v2p === 'string' && VEHICLE_PRESETS.some((p) => p.id === obj.v2p)) {
      validated.v2p = obj.v2p;
    }
    if (typeof obj.v2o === 'number' && Number.isFinite(obj.v2o)) {
      validated.v2o = Math.min(500000, Math.max(0, Math.round(obj.v2o)));
    }
    if (typeof obj.v2w === 'number' && Number.isFinite(obj.v2w)) {
      validated.v2w = Math.min(1825, Math.max(0, Math.round(obj.v2w)));
    }

    return validated;
  } catch {
    return null;
  }
}

export interface CalculatorInitialConfig {
  initialHash?: string;
  initialTargetPresetId?: string;
  initialCurrentArchetypeId?: string;
  initialCurrentMode?: CurrentVehicleMode;
  initialCustomL100km?: number;
  initialAnnualKm?: number;
}

export function useSavingsCalculator(initialConfigOrHash?: string | CalculatorInitialConfig) {
  const initialHash =
    typeof initialConfigOrHash === 'string'
      ? initialConfigOrHash
      : initialConfigOrHash?.initialHash;
  const config = typeof initialConfigOrHash === 'object' ? initialConfigOrHash : undefined;

  const [drivingInputs, setDrivingInputsState] = useState<DrivingInputsState>(() => ({
    ...DEFAULT_DRIVING_INPUTS,
    ...(config?.initialAnnualKm ? { annualKm: config.initialAnnualKm } : {}),
  }));

  const [currentVehicle, setCurrentVehicleState] = useState<CurrentVehicleState>(() => ({
    mode:
      config?.initialCurrentMode ??
      (config?.initialCustomL100km ? 'CUSTOM' : DEFAULT_CURRENT_VEHICLE.mode),
    archetypeId: config?.initialCurrentArchetypeId ?? DEFAULT_CURRENT_VEHICLE.archetypeId,
    customL100km: config?.initialCustomL100km ?? DEFAULT_CURRENT_VEHICLE.customL100km,
  }));

  const [targetVehicle, setTargetVehicleState] = useState<TargetVehicleState>(() => {
    const presetId = config?.initialTargetPresetId ?? DEFAULT_TARGET_VEHICLE.presetId;
    const preset = getVehiclePresetById(presetId);
    return {
      presetId,
      powertrain: preset?.identity.powertrain ?? DEFAULT_TARGET_VEHICLE.powertrain,
      hasChargingAccess: true,
      electricShare: 0.65,
    };
  });

  const [comparisonMode, setComparisonModeState] = useState<ComparisonMode>('ENERGY_COMPARISON');
  const [mode2Outlay, setMode2OutlayState] = useState<Mode2OutlayState>(DEFAULT_MODE2_OUTLAY);
  const [mode3Outlay, setMode3OutlayState] = useState<Mode3OutlayState>(DEFAULT_MODE3_OUTLAY);
  const [waitDays, setWaitDaysState] = useState<number>(180);
  const [isHydrated, setIsHydrated] = useState(false);

  // Apply state overrides safely
  const applyOverrides = useCallback((overrides: Partial<SerializedCalculatorState>) => {
    setDrivingInputsState((prev) => ({
      annualKm: overrides.k ?? prev.annualKm,
      gasPricePerL: overrides.gp ?? prev.gasPricePerL,
      electricityRatePerKwh: overrides.ep ?? prev.electricityRatePerKwh,
    }));

    setCurrentVehicleState((prev) => ({
      mode: overrides.cm ?? prev.mode,
      archetypeId: overrides.ca ?? prev.archetypeId,
      customL100km: overrides.cl ?? prev.customL100km,
    }));

    setTargetVehicleState((prev) => {
      const presetId = overrides.tp ?? prev.presetId;
      const preset = getVehiclePresetById(presetId);
      const powertrain = overrides.pt ?? (preset ? preset.identity.powertrain : prev.powertrain);
      const hasChargingAccess = overrides.ch !== undefined ? overrides.ch === 1 : prev.hasChargingAccess;
      const electricShare = overrides.es ?? (hasChargingAccess ? 0.65 : 0.0);

      return {
        presetId,
        powertrain,
        hasChargingAccess,
        electricShare,
      };
    });

    if (overrides.cpm) {
      setComparisonModeState(overrides.cpm);
    }
    if (overrides.wd !== undefined) {
      setWaitDaysState(overrides.wd);
    }

    setMode2OutlayState((prev) => ({
      targetPriceCad: overrides.tp2 ?? prev.targetPriceCad,
      tradeInProceedsCad: overrides.ti ?? prev.tradeInProceedsCad,
      loanSettlementBalanceCad: overrides.lb ?? prev.loanSettlementBalanceCad,
      chargerCostCad: overrides.cc ?? prev.chargerCostCad,
      rebatesCad: overrides.rb ?? prev.rebatesCad,
      netOutlayOverride: overrides.no !== undefined ? overrides.no : prev.netOutlayOverride,
    }));

    setMode3OutlayState((prev) => ({
      vehicleAPresetId: overrides.v1p ?? prev.vehicleAPresetId,
      vehicleAOutlayCad: overrides.v1o ?? prev.vehicleAOutlayCad,
      vehicleAWaitDays: overrides.v1w ?? prev.vehicleAWaitDays,
      vehicleBPresetId: overrides.v2p ?? prev.vehicleBPresetId,
      vehicleBOutlayCad: overrides.v2o ?? prev.vehicleBOutlayCad,
      vehicleBWaitDays: overrides.v2w ?? prev.vehicleBWaitDays,
    }));
  }, []);

  // Client hydration and hash synchronization
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hashToParse = initialHash || window.location.hash;
    const overrides = deserializeCalculatorHash(hashToParse);
    if (overrides) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      applyOverrides(overrides);
    }
    setIsHydrated(true);

    const handleHashChange = () => {
      const nextOverrides = deserializeCalculatorHash(window.location.hash);
      if (nextOverrides) {
        applyOverrides(nextOverrides);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [initialHash, applyOverrides]);

  // Update URL hash when state changes (only post-hydration)
  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;

    const hash = serializeCalculatorHash(
      drivingInputs,
      currentVehicle,
      targetVehicle,
      comparisonMode,
      mode2Outlay,
      mode3Outlay,
      waitDays
    );
    if (window.location.hash !== hash) {
      window.history.replaceState(null, '', `${window.location.pathname}${hash}`);
    }
  }, [
    drivingInputs,
    currentVehicle,
    targetVehicle,
    comparisonMode,
    mode2Outlay,
    mode3Outlay,
    waitDays,
    isHydrated,
  ]);

  // Setters
  const setDrivingInputs = useCallback((patch: Partial<DrivingInputsState>) => {
    setDrivingInputsState((prev) => ({ ...prev, ...patch }));
  }, []);

  const setCurrentVehicle = useCallback((patch: Partial<CurrentVehicleState>) => {
    setCurrentVehicleState((prev) => ({ ...prev, ...patch }));
  }, []);

  const setTargetVehicle = useCallback((patch: Partial<TargetVehicleState>) => {
    setTargetVehicleState((prev) => {
      const next = { ...prev, ...patch };
      // If preset changed without explicit powertrain, sync powertrain from preset
      if (patch.presetId && !patch.powertrain) {
        const p = getVehiclePresetById(patch.presetId);
        if (p) {
          next.powertrain = p.identity.powertrain;
        }
      }
      // If charging access is toggled to false, clamp electric share to 0
      if (patch.hasChargingAccess === false) {
        next.electricShare = 0.0;
      } else if (patch.hasChargingAccess === true && next.electricShare === 0.0) {
        next.electricShare = 0.65;
      }
      return next;
    });
  }, []);

  const setComparisonMode = useCallback((mode: ComparisonMode) => {
    setComparisonModeState(mode);
  }, []);

  const setMode2Outlay = useCallback((patch: Partial<Mode2OutlayState>) => {
    setMode2OutlayState((prev) => ({ ...prev, ...patch }));
  }, []);

  const setMode3Outlay = useCallback((patch: Partial<Mode3OutlayState>) => {
    setMode3OutlayState((prev) => ({ ...prev, ...patch }));
  }, []);

  const setWaitDays = useCallback((days: number) => {
    setWaitDaysState(days);
  }, []);

  const resetToDefaults = useCallback(() => {
    setDrivingInputsState(DEFAULT_DRIVING_INPUTS);
    setCurrentVehicleState(DEFAULT_CURRENT_VEHICLE);
    setTargetVehicleState(DEFAULT_TARGET_VEHICLE);
    setComparisonModeState('ENERGY_COMPARISON');
    setMode2OutlayState(DEFAULT_MODE2_OUTLAY);
    setMode3OutlayState(DEFAULT_MODE3_OUTLAY);
    setWaitDaysState(180);
  }, []);

  // Presets lookup
  const currentArchetypePreset = useMemo(
    () => TRADE_IN_ARCHETYPES.find((a) => a.id === currentVehicle.archetypeId),
    [currentVehicle.archetypeId]
  );

  const targetPreset = useMemo(
    () => getVehiclePresetById(targetVehicle.presetId) || NEW_VEHICLE_PRESETS[0],
    [targetVehicle.presetId]
  );

  // Pure Math Calculations Memoization
  const results: CalculatorResults = useMemo(() => {
    // 1. Current Vehicle Consumption & Cost
    const effectiveCurrentL100km =
      currentVehicle.mode === 'ARCHETYPE'
        ? (currentArchetypePreset?.consumption.combinedL100km ?? 9.5)
        : currentVehicle.customL100km;

    const currentAnnualCost = calculateAnnualGasCost(
      drivingInputs.annualKm,
      effectiveCurrentL100km,
      drivingInputs.gasPricePerL
    );
    const currentMonthlyCost = Math.round((currentAnnualCost / 12 + Number.EPSILON) * 100) / 100;
    const currentAnnualFuelL =
      Math.round(((drivingInputs.annualKm / 100) * effectiveCurrentL100km + Number.EPSILON) * 10) / 10;

    // 2. Target Vehicle Consumption & Cost
    const targetIsPhev = targetVehicle.powertrain === 'PHEV';
    let targetAnnualCost = 0;
    let targetL100km = targetPreset?.consumption.combinedL100km ?? 5.8;
    let targetAnnualElectricCost = 0;
    let targetAnnualElectricKwh = 0;
    let targetAnnualGasCost = 0;
    let targetAnnualGasL = 0;

    if (targetIsPhev) {
      const effectiveElectricShare = targetVehicle.hasChargingAccess
        ? targetVehicle.electricShare
        : 0.0;
      const wallKwhPer100km = targetPreset?.consumption.wallKwhPer100km ?? 21.5;
      const gasModeL100km =
        targetPreset?.consumption.gasModeL100km ??
        targetPreset?.consumption.combinedL100km ??
        6.0;

      targetL100km = gasModeL100km;

      const phevCost = calculateAnnualPHEVCost(
        drivingInputs.annualKm,
        effectiveElectricShare,
        wallKwhPer100km,
        drivingInputs.electricityRatePerKwh,
        gasModeL100km,
        drivingInputs.gasPricePerL
      );

      targetAnnualElectricCost = phevCost.electricCost;
      targetAnnualGasCost = phevCost.gasCost;
      targetAnnualCost = phevCost.totalCost;

      const electricKm = drivingInputs.annualKm * effectiveElectricShare;
      targetAnnualElectricKwh =
        Math.round(((electricKm / 100) * wallKwhPer100km + Number.EPSILON) * 10) / 10;

      const gasKm = drivingInputs.annualKm * (1 - effectiveElectricShare);
      targetAnnualGasL =
        Math.round(((gasKm / 100) * gasModeL100km + Number.EPSILON) * 10) / 10;
    } else {
      // HEV or Gas
      targetL100km = targetPreset?.consumption.combinedL100km ?? 5.8;
      targetAnnualCost = calculateAnnualGasCost(
        drivingInputs.annualKm,
        targetL100km,
        drivingInputs.gasPricePerL
      );
      targetAnnualGasCost = targetAnnualCost;
      targetAnnualGasL =
        Math.round(((drivingInputs.annualKm / 100) * targetL100km + Number.EPSILON) * 10) / 10;
    }

    const targetMonthlyCost = Math.round((targetAnnualCost / 12 + Number.EPSILON) * 100) / 100;

    // 3. Savings Calculations
    const annualSavings =
      Math.round((currentAnnualCost - targetAnnualCost + Number.EPSILON) * 100) / 100;
    const monthlySavings =
      Math.round((annualSavings / 12 + Number.EPSILON) * 100) / 100;
    const savingsPercent =
      currentAnnualCost > 0
        ? Math.round(((annualSavings / currentAnnualCost) * 100 + Number.EPSILON) * 10) / 10
        : 0;

    // 4. Outlay & Payback Calculations based on Comparison Mode
    const calculatedNetOutlay = Math.max(
      0,
      mode2Outlay.targetPriceCad -
        mode2Outlay.tradeInProceedsCad +
        mode2Outlay.loanSettlementBalanceCad +
        mode2Outlay.chargerCostCad -
        mode2Outlay.rebatesCad
    );
    const effectiveNetOutlay =
      mode2Outlay.netOutlayOverride !== null
        ? mode2Outlay.netOutlayOverride
        : calculatedNetOutlay;

    let paybackResult: PaybackResult;
    let timelineResult: CashFlowTimelineResult;
    let refScenario: CashFlowScenario;
    let targetScenario: CashFlowScenario;
    let vehicleAAnnualCost: number | undefined;
    let vehicleBAnnualCost: number | undefined;

    if (comparisonMode === 'NEW_A_VS_NEW_B') {
      const presetA = getVehiclePresetById(mode3Outlay.vehicleAPresetId) || NEW_VEHICLE_PRESETS[0];
      const presetB = getVehiclePresetById(mode3Outlay.vehicleBPresetId) || NEW_VEHICLE_PRESETS[1];

      // Calculate Vehicle A annual energy cost
      if (presetA.identity.powertrain === 'PHEV') {
        const phevCost = calculateAnnualPHEVCost(
          drivingInputs.annualKm,
          0.65,
          presetA.consumption.wallKwhPer100km ?? 21.5,
          drivingInputs.electricityRatePerKwh,
          presetA.consumption.gasModeL100km ?? 6.0,
          drivingInputs.gasPricePerL
        );
        vehicleAAnnualCost = phevCost.totalCost;
      } else {
        vehicleAAnnualCost = calculateAnnualGasCost(
          drivingInputs.annualKm,
          presetA.consumption.combinedL100km ?? 5.8,
          drivingInputs.gasPricePerL
        );
      }

      // Calculate Vehicle B annual energy cost
      if (presetB.identity.powertrain === 'PHEV') {
        const phevCost = calculateAnnualPHEVCost(
          drivingInputs.annualKm,
          0.65,
          presetB.consumption.wallKwhPer100km ?? 21.5,
          drivingInputs.electricityRatePerKwh,
          presetB.consumption.gasModeL100km ?? 6.0,
          drivingInputs.gasPricePerL
        );
        vehicleBAnnualCost = phevCost.totalCost;
      } else {
        vehicleBAnnualCost = calculateAnnualGasCost(
          drivingInputs.annualKm,
          presetB.consumption.combinedL100km ?? 5.8,
          drivingInputs.gasPricePerL
        );
      }

      const waitDelta = Math.max(0, mode3Outlay.vehicleBWaitDays - mode3Outlay.vehicleAWaitDays);
      paybackResult = evaluateSimplePayback(
        vehicleAAnnualCost,
        vehicleBAnnualCost,
        mode3Outlay.vehicleAOutlayCad,
        mode3Outlay.vehicleBOutlayCad,
        waitDelta
      );

      refScenario = {
        name: presetA.name,
        deliveryWaitDays: mode3Outlay.vehicleAWaitDays,
        upfrontOutlay: mode3Outlay.vehicleAOutlayCad,
        annualEnergyCost: vehicleAAnnualCost,
        waitingAnnualEnergyCost: currentAnnualCost,
      };

      targetScenario = {
        name: presetB.name,
        deliveryWaitDays: mode3Outlay.vehicleBWaitDays,
        upfrontOutlay: mode3Outlay.vehicleBOutlayCad,
        annualEnergyCost: vehicleBAnnualCost,
        waitingAnnualEnergyCost: currentAnnualCost,
      };

      timelineResult = evaluateCashFlowTimeline(refScenario, targetScenario, 7, {
        monthlySampling: true,
      });
    } else if (comparisonMode === 'KEEP_VS_REPLACE') {
      paybackResult = evaluateSimplePayback(
        currentAnnualCost,
        targetAnnualCost,
        0,
        effectiveNetOutlay,
        waitDays
      );

      refScenario = {
        name: 'Keep Current Vehicle',
        deliveryWaitDays: 0,
        upfrontOutlay: 0,
        annualEnergyCost: currentAnnualCost,
      };

      targetScenario = {
        name: targetPreset?.name ?? 'Target Vehicle',
        deliveryWaitDays: waitDays,
        upfrontOutlay: effectiveNetOutlay,
        annualEnergyCost: targetAnnualCost,
        waitingAnnualEnergyCost: currentAnnualCost,
      };

      timelineResult = evaluateCashFlowTimeline(refScenario, targetScenario, 7, {
        monthlySampling: true,
      });
    } else {
      // ENERGY_COMPARISON (Default Mode 1)
      paybackResult = evaluateSimplePayback(
        currentAnnualCost,
        targetAnnualCost,
        0,
        0,
        waitDays
      );

      refScenario = {
        name: 'Current Vehicle Baseline',
        deliveryWaitDays: 0,
        upfrontOutlay: 0,
        annualEnergyCost: currentAnnualCost,
      };

      targetScenario = {
        name: targetPreset?.name ?? 'Target Vehicle',
        deliveryWaitDays: waitDays,
        upfrontOutlay: 0,
        annualEnergyCost: targetAnnualCost,
        waitingAnnualEnergyCost: currentAnnualCost,
      };

      timelineResult = evaluateCashFlowTimeline(refScenario, targetScenario, 7, {
        monthlySampling: true,
      });
    }

    // 5. Recovery Boundary Check:
    // Only designate as "Recovered" if balance crosses above $0 after all purchases have completed and stays non-negative.
    const finalPoint = timelineResult.points[timelineResult.points.length - 1];
    const maxDeliveryDay = Math.max(refScenario.deliveryWaitDays, targetScenario.deliveryWaitDays);

    let isRecovered = false;
    let recoveryDay: number | null = null;
    let recoveryYear: number | null = null;

    if (paybackResult.condition === 'POSITIVE_PAYBACK') {
      if (
        timelineResult.crossoverDay !== null &&
        timelineResult.crossoverDay <= 7 * 365 &&
        finalPoint &&
        finalPoint.netAdvantageTarget >= 0
      ) {
        isRecovered = true;
        recoveryDay = timelineResult.crossoverDay;
        recoveryYear = timelineResult.crossoverYear;
      }
    } else if (
      paybackResult.condition === 'NO_UPFRONT_PREMIUM' ||
      paybackResult.condition === 'LOWER_OUTLAY_SAVINGS'
    ) {
      if (finalPoint && finalPoint.netAdvantageTarget >= 0) {
        isRecovered = true;
        recoveryDay = maxDeliveryDay;
        recoveryYear = Math.round(((maxDeliveryDay / 365) + Number.EPSILON) * 10) / 10;
      }
    }

    // 6. Share URL
    const hash = serializeCalculatorHash(
      drivingInputs,
      currentVehicle,
      targetVehicle,
      comparisonMode,
      mode2Outlay,
      mode3Outlay,
      waitDays
    );
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://toyotawaits.ca';
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '/calculator';
    const shareUrl = `${origin}${pathname}${hash}`;

    return {
      effectiveCurrentL100km,
      currentAnnualCost,
      currentMonthlyCost,
      currentAnnualFuelL,
      targetL100km,
      targetAnnualCost,
      targetMonthlyCost,
      targetIsPhev,
      targetAnnualElectricCost,
      targetAnnualElectricKwh,
      targetAnnualGasCost,
      targetAnnualGasL,
      annualSavings,
      monthlySavings,
      savingsPercent,
      comparisonMode,
      paybackResult,
      timelineResult,
      effectiveNetOutlay,
      calculatedNetOutlay,
      isRecovered,
      recoveryYear,
      recoveryDay,
      vehicleAAnnualCost,
      vehicleBAnnualCost,
      shareUrl,
    };
  }, [
    drivingInputs,
    currentVehicle,
    targetVehicle,
    currentArchetypePreset,
    targetPreset,
    comparisonMode,
    mode2Outlay,
    mode3Outlay,
    waitDays,
  ]);

  return {
    drivingInputs,
    setDrivingInputs,
    currentVehicle,
    setCurrentVehicle,
    targetVehicle,
    setTargetVehicle,
    comparisonMode,
    setComparisonMode,
    mode2Outlay,
    setMode2Outlay,
    mode3Outlay,
    setMode3Outlay,
    waitDays,
    setWaitDays,
    resetToDefaults,
    currentArchetypePreset,
    targetPreset,
    results,
    isHydrated,
  };
}
