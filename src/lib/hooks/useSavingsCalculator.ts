'use client';

/**
 * ToyotaWaits.ca - Savings & Payback Calculator Hook
 * Specification Reference: Master Plan v3.1 (Section 2, 3, 6, 7, and 9) - Stage 2 (Energy MVP)
 *
 * Manages reactive state for driving inputs, current vehicle, and target Toyota vehicle.
 * Synchronizes allowlisted state bidirectionally with URL hash fragment (#c=...)
 * with strict bounds validation and safe fallback defaults on corruption.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  calculateAnnualGasCost,
  calculateAnnualPHEVCost,
} from '@/lib/calculator-engine';
import {
  VEHICLE_PRESETS,
  TRADE_IN_ARCHETYPES,
  NEW_VEHICLE_PRESETS,
  getVehiclePresetById,
} from '@/data/vehicle-presets';
import { Powertrain } from '@/types/calculator';

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

const MAX_HASH_LENGTH = 2048;

/**
 * Serializes state to compact URL hash string (#c=...)
 */
export function serializeCalculatorHash(
  driving: DrivingInputsState,
  current: CurrentVehicleState,
  target: TargetVehicleState
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

    return validated;
  } catch {
    return null;
  }
}

export function useSavingsCalculator(initialHash?: string) {
  const [drivingInputs, setDrivingInputsState] = useState<DrivingInputsState>(DEFAULT_DRIVING_INPUTS);
  const [currentVehicle, setCurrentVehicleState] = useState<CurrentVehicleState>(DEFAULT_CURRENT_VEHICLE);
  const [targetVehicle, setTargetVehicleState] = useState<TargetVehicleState>(DEFAULT_TARGET_VEHICLE);
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

    const hash = serializeCalculatorHash(drivingInputs, currentVehicle, targetVehicle);
    if (window.location.hash !== hash) {
      window.history.replaceState(null, '', `${window.location.pathname}${hash}`);
    }
  }, [drivingInputs, currentVehicle, targetVehicle, isHydrated]);

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

  const resetToDefaults = useCallback(() => {
    setDrivingInputsState(DEFAULT_DRIVING_INPUTS);
    setCurrentVehicleState(DEFAULT_CURRENT_VEHICLE);
    setTargetVehicleState(DEFAULT_TARGET_VEHICLE);
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

    // 4. Share URL
    const hash = serializeCalculatorHash(drivingInputs, currentVehicle, targetVehicle);
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
      shareUrl,
    };
  }, [drivingInputs, currentVehicle, targetVehicle, currentArchetypePreset, targetPreset]);

  return {
    drivingInputs,
    setDrivingInputs,
    currentVehicle,
    setCurrentVehicle,
    targetVehicle,
    setTargetVehicle,
    resetToDefaults,
    currentArchetypePreset,
    targetPreset,
    results,
    isHydrated,
  };
}
