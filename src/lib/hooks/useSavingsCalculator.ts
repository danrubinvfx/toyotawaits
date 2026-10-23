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
  calculateAnnualGasCostUS,
  calculateAnnualPHEVCost,
  calculateAnnualPHEVCostUS,
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
  UnitSystem,
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
  u?: 'us' | 'ca'; // unit system (US Imperial vs Canadian Metric)
  k?: number; // annualKm / annualMiles
  gp?: number; // gasPricePerL / gasPricePerGal
  ep?: number; // electricityRatePerKwh
  cm?: CurrentVehicleMode; // current mode
  ca?: string; // current archetype id
  cl?: number; // current custom L/100km or MPG
  tp?: string; // target preset id
  pt?: Powertrain; // target powertrain
  ch?: 0 | 1; // hasChargingAccess
  es?: number; // electricShare
  // Stage 4 additions
  cpm?: ComparisonMode;
  tp2?: number; // targetPriceCad / targetPriceUsd
  ti?: number; // tradeInProceedsCad / tradeInProceedsUsd
  lb?: number; // loanSettlementBalanceCad / loanSettlementBalanceUsd
  cc?: number; // chargerCostCad / chargerCostUsd
  rb?: number; // rebatesCad / rebatesUsd
  no?: number | null; // netOutlayOverride
  wd?: number; // waitDays
  v1p?: string; // vehicleAPresetId
  v1o?: number; // vehicleAOutlayCad / vehicleAOutlayUsd
  v1w?: number; // vehicleAWaitDays
  v2p?: string; // vehicleBPresetId
  v2o?: number; // vehicleBOutlayCad / vehicleBOutlayUsd
  v2w?: number; // vehicleBWaitDays
}

export interface CalculatorResults {
  // Unit system & currency
  unitSystem: UnitSystem;
  currencyCode: 'CAD' | 'USD';

  // Current vehicle
  effectiveCurrentL100km: number;
  effectiveCurrentMpg?: number;
  currentAnnualCost: number;
  currentMonthlyCost: number;
  currentAnnualFuelL: number;
  currentAnnualFuelGal?: number;

  // Target vehicle
  targetL100km: number;
  targetMpg?: number;
  targetAnnualCost: number;
  targetMonthlyCost: number;
  targetIsPhev: boolean;

  // PHEV itemized breakdown
  targetAnnualElectricCost: number;
  targetAnnualElectricKwh: number;
  targetAnnualGasCost: number;
  targetAnnualGasL: number;
  targetAnnualGasGal?: number;

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

export const DEFAULT_DRIVING_INPUTS_US: DrivingInputsState = {
  annualKm: 12000,
  gasPricePerL: 3.45,
  electricityRatePerKwh: 0.16,
};

export const DEFAULT_CURRENT_VEHICLE: CurrentVehicleState = {
  mode: 'ARCHETYPE',
  archetypeId: 'archetype-compact-crossover-awd',
  customL100km: 9.5,
};

export const DEFAULT_CURRENT_VEHICLE_US: CurrentVehicleState = {
  mode: 'ARCHETYPE',
  archetypeId: 'archetype-compact-crossover-awd',
  customL100km: 25,
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

export const DEFAULT_MODE2_OUTLAY_US: Mode2OutlayState = {
  targetPriceCad: 35000,
  tradeInProceedsCad: 12000,
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

export const DEFAULT_MODE3_OUTLAY_US: Mode3OutlayState = {
  vehicleAPresetId: '2026-toyota-rav4-hybrid',
  vehicleAOutlayCad: 35000,
  vehicleAWaitDays: 60,
  vehicleBPresetId: '2026-toyota-rav4-phev',
  vehicleBOutlayCad: 45000,
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
  waitDays = 180,
  unitSystem: UnitSystem = 'METRIC'
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

  if (unitSystem === 'IMPERIAL') {
    payload.u = 'us';
  }

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

    // Validate unit system (u)
    const isUs = obj.u === 'us';
    if (obj.u === 'us' || obj.u === 'ca') {
      validated.u = obj.u;
    }

    // Validate annualKm / annualMiles (k)
    if (typeof obj.k === 'number' && Number.isFinite(obj.k)) {
      validated.k = Math.min(150000, Math.max(1000, Math.round(obj.k)));
    }

    // Validate gasPricePerL or gasPricePerGal (gp)
    if (typeof obj.gp === 'number' && Number.isFinite(obj.gp)) {
      const maxGp = isUs ? 10.0 : 5.0;
      validated.gp = Math.min(maxGp, Math.max(0.5, Number(obj.gp.toFixed(2))));
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

    // Validate custom L/100km or MPG (cl)
    if (typeof obj.cl === 'number' && Number.isFinite(obj.cl)) {
      const maxCl = isUs ? 100.0 : 40.0;
      validated.cl = Math.min(maxCl, Math.max(1.0, Number(obj.cl.toFixed(1))));
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
  initialUnitSystem?: UnitSystem;
}

export function useSavingsCalculator(initialConfigOrHash?: string | CalculatorInitialConfig) {
  const initialHash =
    typeof initialConfigOrHash === 'string'
      ? initialConfigOrHash
      : initialConfigOrHash?.initialHash;
  const config = typeof initialConfigOrHash === 'object' ? initialConfigOrHash : undefined;

  const [unitSystem, setUnitSystemState] = useState<UnitSystem>(() => {
    if (typeof window !== 'undefined') {
      const hashToParse = initialHash || window.location.hash;
      const initialOverrides = deserializeCalculatorHash(hashToParse);
      if (initialOverrides?.u === 'us') return 'IMPERIAL';
      if (initialOverrides?.u === 'ca') return 'METRIC';
    }
    return config?.initialUnitSystem ?? 'METRIC';
  });

  const isInitialImp = config?.initialUnitSystem === 'IMPERIAL';
  const defaultDriving = isInitialImp ? DEFAULT_DRIVING_INPUTS_US : DEFAULT_DRIVING_INPUTS;
  const defaultCurrent = isInitialImp ? DEFAULT_CURRENT_VEHICLE_US : DEFAULT_CURRENT_VEHICLE;
  const defaultMode2 = isInitialImp ? DEFAULT_MODE2_OUTLAY_US : DEFAULT_MODE2_OUTLAY;
  const defaultMode3 = isInitialImp ? DEFAULT_MODE3_OUTLAY_US : DEFAULT_MODE3_OUTLAY;

  const [drivingInputs, setDrivingInputsState] = useState<DrivingInputsState>(() => ({
    ...defaultDriving,
    ...(config?.initialAnnualKm ? { annualKm: config.initialAnnualKm } : {}),
  }));

  const [currentVehicle, setCurrentVehicleState] = useState<CurrentVehicleState>(() => ({
    mode:
      config?.initialCurrentMode ??
      (config?.initialCustomL100km ? 'CUSTOM' : defaultCurrent.mode),
    archetypeId: config?.initialCurrentArchetypeId ?? defaultCurrent.archetypeId,
    customL100km: config?.initialCustomL100km ?? defaultCurrent.customL100km,
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
  const [mode2Outlay, setMode2OutlayState] = useState<Mode2OutlayState>(defaultMode2);
  const [mode3Outlay, setMode3OutlayState] = useState<Mode3OutlayState>(defaultMode3);
  const [waitDays, setWaitDaysState] = useState<number>(180);
  const [isHydrated, setIsHydrated] = useState(false);

  // Apply state overrides safely
  const applyOverrides = useCallback((overrides: Partial<SerializedCalculatorState>) => {
    if (overrides.u === 'us') {
      setUnitSystemState('IMPERIAL');
    } else if (overrides.u === 'ca') {
      setUnitSystemState('METRIC');
    }

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
      waitDays,
      unitSystem
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
    unitSystem,
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

  const setUnitSystem = useCallback((newUnit: UnitSystem) => {
    setUnitSystemState((prevUnit) => {
      if (prevUnit === newUnit) return prevUnit;
      if (newUnit === 'IMPERIAL') {
        setDrivingInputsState((prev) => ({
          annualKm: prev.annualKm === 20000 ? 12000 : Math.round(prev.annualKm * 0.621371),
          gasPricePerL: prev.gasPricePerL === 1.75 ? 3.45 : Number((prev.gasPricePerL * 3.78541 * 0.73).toFixed(2)),
          electricityRatePerKwh: prev.electricityRatePerKwh === 0.14 ? 0.16 : prev.electricityRatePerKwh,
        }));
        setCurrentVehicleState((prev) => ({
          ...prev,
          customL100km: prev.customL100km === 9.5 ? 25 : Math.round((235.215 / prev.customL100km) * 10) / 10,
        }));
      } else {
        setDrivingInputsState((prev) => ({
          annualKm: prev.annualKm === 12000 ? 20000 : Math.round(prev.annualKm / 0.621371),
          gasPricePerL: prev.gasPricePerL === 3.45 ? 1.75 : Number((prev.gasPricePerL / (3.78541 * 0.73)).toFixed(2)),
          electricityRatePerKwh: prev.electricityRatePerKwh === 0.16 ? 0.14 : prev.electricityRatePerKwh,
        }));
        setCurrentVehicleState((prev) => ({
          ...prev,
          customL100km: prev.customL100km === 25 ? 9.5 : Math.round((235.215 / prev.customL100km) * 10) / 10,
        }));
      }
      return newUnit;
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    const isImp = unitSystem === 'IMPERIAL';
    setDrivingInputsState(isImp ? DEFAULT_DRIVING_INPUTS_US : DEFAULT_DRIVING_INPUTS);
    setCurrentVehicleState(isImp ? DEFAULT_CURRENT_VEHICLE_US : DEFAULT_CURRENT_VEHICLE);
    setTargetVehicleState(DEFAULT_TARGET_VEHICLE);
    setComparisonModeState('ENERGY_COMPARISON');
    setMode2OutlayState(isImp ? DEFAULT_MODE2_OUTLAY_US : DEFAULT_MODE2_OUTLAY);
    setMode3OutlayState(isImp ? DEFAULT_MODE3_OUTLAY_US : DEFAULT_MODE3_OUTLAY);
    setWaitDaysState(180);
  }, [unitSystem]);

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
    const isImp = unitSystem === 'IMPERIAL';
    const currencyCode: 'CAD' | 'USD' = isImp ? 'USD' : 'CAD';

    // 1. Current Vehicle Consumption & Cost
    let effectiveCurrentL100km = 9.5;
    let effectiveCurrentMpg = 25;
    let currentAnnualCost = 0;
    let currentAnnualFuelL = 0;
    let currentAnnualFuelGal = 0;

    if (isImp) {
      effectiveCurrentMpg =
        currentVehicle.mode === 'ARCHETYPE'
          ? (currentArchetypePreset?.consumption.combinedMpg ?? 25)
          : currentVehicle.customL100km;
      effectiveCurrentL100km =
        effectiveCurrentMpg > 0 ? Math.round((235.215 / effectiveCurrentMpg) * 10) / 10 : 9.5;

      currentAnnualCost = calculateAnnualGasCostUS(
        drivingInputs.annualKm,
        effectiveCurrentMpg,
        drivingInputs.gasPricePerL
      );
      currentAnnualFuelGal =
        effectiveCurrentMpg > 0
          ? Math.round(((drivingInputs.annualKm / effectiveCurrentMpg) + Number.EPSILON) * 10) / 10
          : 0;
      currentAnnualFuelL = Math.round((currentAnnualFuelGal * 3.78541 + Number.EPSILON) * 10) / 10;
    } else {
      effectiveCurrentL100km =
        currentVehicle.mode === 'ARCHETYPE'
          ? (currentArchetypePreset?.consumption.combinedL100km ?? 9.5)
          : currentVehicle.customL100km;
      effectiveCurrentMpg =
        effectiveCurrentL100km > 0 ? Math.round((235.215 / effectiveCurrentL100km) * 10) / 10 : 25;

      currentAnnualCost = calculateAnnualGasCost(
        drivingInputs.annualKm,
        effectiveCurrentL100km,
        drivingInputs.gasPricePerL
      );
      currentAnnualFuelL =
        Math.round(((drivingInputs.annualKm / 100) * effectiveCurrentL100km + Number.EPSILON) * 10) / 10;
      currentAnnualFuelGal = Math.round((currentAnnualFuelL / 3.78541 + Number.EPSILON) * 10) / 10;
    }

    const currentMonthlyCost = Math.round((currentAnnualCost / 12 + Number.EPSILON) * 100) / 100;

    // 2. Target Vehicle Consumption & Cost
    const targetIsPhev = targetVehicle.powertrain === 'PHEV';
    let targetAnnualCost = 0;
    let targetL100km = targetPreset?.consumption.combinedL100km ?? 5.8;
    let targetMpg = targetPreset?.consumption.combinedMpg ?? 40;
    let targetAnnualElectricCost = 0;
    let targetAnnualElectricKwh = 0;
    let targetAnnualGasCost = 0;
    let targetAnnualGasL = 0;
    let targetAnnualGasGal = 0;

    if (isImp) {
      if (targetIsPhev) {
        const effectiveElectricShare = targetVehicle.hasChargingAccess
          ? targetVehicle.electricShare
          : 0.0;
        targetMpg = targetPreset?.consumption.gasModeMpg ?? 38;
        targetL100km = targetPreset?.consumption.gasModeL100km ?? 6.0;
        const kwhPer100Miles = targetPreset?.consumption.kwhPer100Miles ?? 36;

        const phevCost = calculateAnnualPHEVCostUS(
          drivingInputs.annualKm,
          effectiveElectricShare,
          kwhPer100Miles,
          drivingInputs.electricityRatePerKwh,
          targetMpg,
          drivingInputs.gasPricePerL
        );

        targetAnnualElectricCost = phevCost.electricCost;
        targetAnnualGasCost = phevCost.gasCost;
        targetAnnualCost = phevCost.totalCost;

        targetAnnualElectricKwh = Math.round(
          drivingInputs.annualKm * effectiveElectricShare * (kwhPer100Miles / 100)
        );
        targetAnnualGasGal =
          targetMpg > 0
            ? Math.round(
                (((drivingInputs.annualKm * (1 - effectiveElectricShare)) / targetMpg) +
                  Number.EPSILON) *
                  10
              ) / 10
            : 0;
        targetAnnualGasL = Math.round((targetAnnualGasGal * 3.78541 + Number.EPSILON) * 10) / 10;
      } else {
        // HEV or Gas
        targetMpg = targetPreset?.consumption.combinedMpg ?? 40;
        targetL100km = targetPreset?.consumption.combinedL100km ?? 5.8;
        targetAnnualCost = calculateAnnualGasCostUS(
          drivingInputs.annualKm,
          targetMpg,
          drivingInputs.gasPricePerL
        );
        targetAnnualGasCost = targetAnnualCost;
        targetAnnualGasGal =
          targetMpg > 0
            ? Math.round(((drivingInputs.annualKm / targetMpg) + Number.EPSILON) * 10) / 10
            : 0;
        targetAnnualGasL = Math.round((targetAnnualGasGal * 3.78541 + Number.EPSILON) * 10) / 10;
      }
    } else {
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
        targetMpg = targetPreset?.consumption.gasModeMpg ?? 38;

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
        targetAnnualGasGal = Math.round((targetAnnualGasL / 3.78541 + Number.EPSILON) * 10) / 10;
      } else {
        // HEV or Gas
        targetL100km = targetPreset?.consumption.combinedL100km ?? 5.8;
        targetMpg = targetPreset?.consumption.combinedMpg ?? 40;
        targetAnnualCost = calculateAnnualGasCost(
          drivingInputs.annualKm,
          targetL100km,
          drivingInputs.gasPricePerL
        );
        targetAnnualGasCost = targetAnnualCost;
        targetAnnualGasL =
          Math.round(((drivingInputs.annualKm / 100) * targetL100km + Number.EPSILON) * 10) / 10;
        targetAnnualGasGal = Math.round((targetAnnualGasL / 3.78541 + Number.EPSILON) * 10) / 10;
      }
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
        const phevCost = isImp
          ? calculateAnnualPHEVCostUS(
              drivingInputs.annualKm,
              0.65,
              presetA.consumption.kwhPer100Miles ?? 36,
              drivingInputs.electricityRatePerKwh,
              presetA.consumption.gasModeMpg ?? 38,
              drivingInputs.gasPricePerL
            )
          : calculateAnnualPHEVCost(
              drivingInputs.annualKm,
              0.65,
              presetA.consumption.wallKwhPer100km ?? 21.5,
              drivingInputs.electricityRatePerKwh,
              presetA.consumption.gasModeL100km ?? 6.0,
              drivingInputs.gasPricePerL
            );
        vehicleAAnnualCost = phevCost.totalCost;
      } else {
        vehicleAAnnualCost = isImp
          ? calculateAnnualGasCostUS(
              drivingInputs.annualKm,
              presetA.consumption.combinedMpg ?? 40,
              drivingInputs.gasPricePerL
            )
          : calculateAnnualGasCost(
              drivingInputs.annualKm,
              presetA.consumption.combinedL100km ?? 5.8,
              drivingInputs.gasPricePerL
            );
      }

      // Calculate Vehicle B annual energy cost
      if (presetB.identity.powertrain === 'PHEV') {
        const phevCost = isImp
          ? calculateAnnualPHEVCostUS(
              drivingInputs.annualKm,
              0.65,
              presetB.consumption.kwhPer100Miles ?? 36,
              drivingInputs.electricityRatePerKwh,
              presetB.consumption.gasModeMpg ?? 38,
              drivingInputs.gasPricePerL
            )
          : calculateAnnualPHEVCost(
              drivingInputs.annualKm,
              0.65,
              presetB.consumption.wallKwhPer100km ?? 21.5,
              drivingInputs.electricityRatePerKwh,
              presetB.consumption.gasModeL100km ?? 6.0,
              drivingInputs.gasPricePerL
            );
        vehicleBAnnualCost = phevCost.totalCost;
      } else {
        vehicleBAnnualCost = isImp
          ? calculateAnnualGasCostUS(
              drivingInputs.annualKm,
              presetB.consumption.combinedMpg ?? 40,
              drivingInputs.gasPricePerL
            )
          : calculateAnnualGasCost(
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
        0
      );

      refScenario = {
        name: 'Current Vehicle Baseline',
        deliveryWaitDays: 0,
        upfrontOutlay: 0,
        annualEnergyCost: currentAnnualCost,
      };

      targetScenario = {
        name: targetPreset?.name ?? 'Target Vehicle',
        deliveryWaitDays: 0,
        upfrontOutlay: 0,
        annualEnergyCost: targetAnnualCost,
        waitingAnnualEnergyCost: currentAnnualCost,
      };

      timelineResult = evaluateCashFlowTimeline(refScenario, targetScenario, 7, {
        monthlySampling: true,
      });
    }

    // 5. Recovery Boundary Check:
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
      waitDays,
      unitSystem
    );
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://toyotawaits.ca';
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '/calculator';
    const shareUrl = `${origin}${pathname}${hash}`;

    return {
      unitSystem,
      currencyCode,
      effectiveCurrentL100km,
      effectiveCurrentMpg,
      currentAnnualCost,
      currentMonthlyCost,
      currentAnnualFuelL,
      currentAnnualFuelGal,
      targetL100km,
      targetMpg,
      targetAnnualCost,
      targetMonthlyCost,
      targetIsPhev,
      targetAnnualElectricCost,
      targetAnnualElectricKwh,
      targetAnnualGasCost,
      targetAnnualGasL,
      targetAnnualGasGal,
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
    unitSystem,
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
    unitSystem,
    setUnitSystem,
    resetToDefaults,
    currentArchetypePreset,
    targetPreset,
    results,
    isHydrated,
  };
}
