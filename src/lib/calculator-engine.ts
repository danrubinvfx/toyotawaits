/**
 * ToyotaWaits.ca - Savings & Payback Calculator Engine
 * Specification Reference: Master Plan v3.1 (19 October 2026) - Stage 1 (Evidence & Engine)
 * Pure, zero-dependency calculation functions.
 */

import {
  PaybackCondition,
  PaybackResult,
  CashFlowScenario,
  CashFlowPoint,
  CashFlowTimelineResult,
  PHEVCostBreakdown,
} from '@/types/calculator';

/**
 * Validates that all provided numeric arguments are finite, non-negative numbers.
 * Throws TypeError or RangeError if any validation fails.
 */
function assertFiniteNonNegative(name: string, value: unknown): asserts value is number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`${name} must be a finite number. Received: ${String(value)}`);
  }
  if (value < 0) {
    throw new RangeError(`${name} cannot be negative. Received: ${value}`);
  }
}

/**
 * Validates that electric share f is a finite number in [0, 1].
 */
function assertElectricShare(f: unknown): asserts f is number {
  if (typeof f !== 'number' || !Number.isFinite(f)) {
    throw new TypeError(`electricShare must be a finite number. Received: ${String(f)}`);
  }
  if (f < 0 || f > 1) {
    throw new RangeError(`electricShare must be between 0.0 and 1.0 inclusive. Received: ${f}`);
  }
}

/**
 * Extracts a numeric cost whether given as a primitive number or a PHEVCostBreakdown object.
 */
function extractCostNumber(cost: number | { totalCost: number }): number {
  if (typeof cost === 'number') {
    return cost;
  }
  if (cost && typeof cost === 'object' && typeof cost.totalCost === 'number') {
    return cost.totalCost;
  }
  throw new TypeError(`Expected number or cost object with totalCost. Received: ${String(cost)}`);
}

/**
 * Calculates annual gas cost for a vehicle.
 * Formula: (annualKm / 100) * l100km * gasPricePerL
 *
 * @param annualKm Annual driving distance in kilometers
 * @param l100km Fuel consumption in liters per 100 kilometers
 * @param gasPricePerL Fuel price in CAD per liter
 * @returns Annual fuel cost in CAD
 */
export function calculateAnnualGasCost(
  annualKm: number,
  l100km: number,
  gasPricePerL: number
): number {
  assertFiniteNonNegative('annualKm', annualKm);
  assertFiniteNonNegative('l100km', l100km);
  assertFiniteNonNegative('gasPricePerL', gasPricePerL);

  const cost = (annualKm / 100) * l100km * gasPricePerL;
  return Math.round((cost + Number.EPSILON) * 100) / 100;
}

/**
 * Calculates annual PHEV cost split between electric and gas operation.
 *
 * @param annualKm Annual driving distance in kilometers
 * @param electricShare Fraction of driving in EV mode (0.0 to 1.0, e.g. 0.65)
 * @param wallKwhPer100km Wall-to-wheel electricity consumption in kWh/100km
 * @param electricityRatePerKwh Electricity rate in CAD per kWh
 * @param gasModeL100km Fuel consumption in charge-sustaining (hybrid) mode in L/100km
 * @param gasPricePerL Fuel price in CAD per liter
 * @returns Object containing electricCost, gasCost, and totalCost (also coerces as a number)
 */
export function calculateAnnualPHEVCost(
  annualKm: number,
  electricShare: number,
  wallKwhPer100km: number,
  electricityRatePerKwh: number,
  gasModeL100km: number,
  gasPricePerL: number
): PHEVCostBreakdown {
  assertFiniteNonNegative('annualKm', annualKm);
  assertElectricShare(electricShare);
  assertFiniteNonNegative('wallKwhPer100km', wallKwhPer100km);
  assertFiniteNonNegative('electricityRatePerKwh', electricityRatePerKwh);
  assertFiniteNonNegative('gasModeL100km', gasModeL100km);
  assertFiniteNonNegative('gasPricePerL', gasPricePerL);

  const electricKm = annualKm * electricShare;
  const gasKm = annualKm * (1 - electricShare);

  const rawElectricCost = (electricKm / 100) * wallKwhPer100km * electricityRatePerKwh;
  const rawGasCost = (gasKm / 100) * gasModeL100km * gasPricePerL;

  const electricCost = Math.round((rawElectricCost + Number.EPSILON) * 100) / 100;
  const gasCost = Math.round((rawGasCost + Number.EPSILON) * 100) / 100;
  const totalCost = Math.round((electricCost + gasCost + Number.EPSILON) * 100) / 100;

  const result: PHEVCostBreakdown = {
    electricCost,
    gasCost,
    totalCost,
  };

  // Enable valueOf and Symbol.toPrimitive so numeric operations (+res, Number(res)) evaluate cleanly to totalCost
  Object.defineProperty(result, 'valueOf', {
    value: () => totalCost,
    enumerable: false,
  });
  Object.defineProperty(result, Symbol.toPrimitive, {
    value: () => totalCost,
    enumerable: false,
  });

  return result;
}

/**
 * Calculates extra energy cost incurred while waiting for delivery of a more efficient vehicle.
 *
 * @param annualCostCurrent Annual energy cost of current/reference vehicle
 * @param annualCostTarget Annual energy cost of target vehicle
 * @param remainingWaitDays Remaining delivery wait time in days
 * @returns Extra energy cost in CAD
 */
export function calculateExtraEnergyWhileWaiting(
  annualCostCurrent: number | { totalCost: number },
  annualCostTarget: number | { totalCost: number },
  remainingWaitDays: number
): number {
  const currentCost = extractCostNumber(annualCostCurrent);
  const targetCost = extractCostNumber(annualCostTarget);

  assertFiniteNonNegative('annualCostCurrent', currentCost);
  assertFiniteNonNegative('annualCostTarget', targetCost);
  assertFiniteNonNegative('remainingWaitDays', remainingWaitDays);

  if (remainingWaitDays === 0) {
    return 0;
  }

  const extraCost = (currentCost - targetCost) * (remainingWaitDays / 365);
  return Math.round((extraCost + Number.EPSILON) * 100) / 100;
}

/**
 * Evaluates simple payback and classifies the comparison into one of the 6 canonical conditions:
 * - POSITIVE_PAYBACK: Outlay premium > 0, Annual savings > 0. Pays back in finite years.
 * - NO_ENERGY_SAVINGS: Outlay premium >= 0, Annual savings == 0.
 * - HIGHER_ENERGY_COST: Outlay premium >= 0, Annual savings < 0.
 * - NO_UPFRONT_PREMIUM: Outlay premium == 0, Annual savings > 0. Immediate payback.
 * - LOWER_OUTLAY_SAVINGS: Outlay premium < 0, Annual savings >= 0. Immediate win.
 * - LOWER_OUTLAY_HIGHER_ENERGY: Outlay premium < 0, Annual savings < 0. Cheaper upfront, but higher energy costs erode savings.
 *
 * @param annualCostRef Annual energy cost of reference vehicle
 * @param annualCostTarget Annual energy cost of target vehicle
 * @param outlayRef Upfront purchase outlay of reference vehicle
 * @param outlayTarget Upfront purchase outlay of target vehicle
 * @param remainingWaitDays Wait days for target delivery (default 0)
 */
export function evaluateSimplePayback(
  annualCostRef: number | { totalCost: number },
  annualCostTarget: number | { totalCost: number },
  outlayRef: number,
  outlayTarget: number,
  remainingWaitDays = 0
): PaybackResult {
  const costRef = extractCostNumber(annualCostRef);
  const costTarget = extractCostNumber(annualCostTarget);

  assertFiniteNonNegative('annualCostRef', costRef);
  assertFiniteNonNegative('annualCostTarget', costTarget);
  assertFiniteNonNegative('outlayRef', outlayRef);
  assertFiniteNonNegative('outlayTarget', outlayTarget);
  assertFiniteNonNegative('remainingWaitDays', remainingWaitDays);

  const upfrontDifference = Math.round((outlayTarget - outlayRef + Number.EPSILON) * 100) / 100; // D
  const annualSavings = Math.round((costRef - costTarget + Number.EPSILON) * 100) / 100; // S
  const extraEnergyCostWhileWaiting = calculateExtraEnergyWhileWaiting(
    costRef,
    costTarget,
    remainingWaitDays
  );

  let condition: PaybackCondition;
  let simplePaybackYears: number | null = null;
  let effectivePaybackYears: number | null = null;
  let breakEvenDays: number | null = null;
  let summaryMessage = '';

  if (upfrontDifference > 0) {
    if (annualSavings > 0) {
      condition = 'POSITIVE_PAYBACK';
      simplePaybackYears = Math.round((upfrontDifference / annualSavings) * 1000) / 1000;
      const totalDeficitAtDelivery = upfrontDifference + extraEnergyCostWhileWaiting;
      effectivePaybackYears =
        Math.round(((remainingWaitDays / 365) + totalDeficitAtDelivery / annualSavings) * 1000) / 1000;
      breakEvenDays = Math.round(effectivePaybackYears * 365);
      summaryMessage = `Target vehicle pays back its $${upfrontDifference.toLocaleString()} upfront premium in ${simplePaybackYears} years post-delivery through $${annualSavings.toLocaleString()}/yr energy savings.`;
    } else if (annualSavings === 0) {
      condition = 'NO_ENERGY_SAVINGS';
      summaryMessage = `Target vehicle costs $${upfrontDifference.toLocaleString()} more upfront but provides no annual energy savings.`;
    } else {
      condition = 'HIGHER_ENERGY_COST';
      summaryMessage = `Target vehicle costs $${upfrontDifference.toLocaleString()} more upfront and incurs $${Math.abs(annualSavings).toLocaleString()}/yr higher energy costs.`;
    }
  } else if (upfrontDifference === 0) {
    if (annualSavings > 0) {
      condition = 'NO_UPFRONT_PREMIUM';
      simplePaybackYears = 0;
      effectivePaybackYears = Math.round((remainingWaitDays / 365) * 1000) / 1000;
      breakEvenDays = remainingWaitDays;
      summaryMessage = `Target vehicle has identical upfront cost and saves $${annualSavings.toLocaleString()}/yr in energy immediately upon delivery.`;
    } else if (annualSavings === 0) {
      condition = 'NO_ENERGY_SAVINGS';
      simplePaybackYears = 0;
      effectivePaybackYears = 0;
      breakEvenDays = 0;
      summaryMessage = `Both vehicles have identical upfront outlay and identical annual energy costs.`;
    } else {
      condition = 'HIGHER_ENERGY_COST';
      summaryMessage = `Target vehicle has identical upfront cost but incurs $${Math.abs(annualSavings).toLocaleString()}/yr higher energy costs.`;
    }
  } else {
    // upfrontDifference < 0: Target is cheaper upfront
    if (annualSavings >= 0) {
      condition = 'LOWER_OUTLAY_SAVINGS';
      simplePaybackYears = 0;
      effectivePaybackYears = 0;
      breakEvenDays = 0;
      summaryMessage = `Target vehicle costs $${Math.abs(upfrontDifference).toLocaleString()} less upfront and saves $${annualSavings.toLocaleString()}/yr in energy.`;
    } else {
      // upfrontDifference < 0 and annualSavings < 0
      condition = 'LOWER_OUTLAY_HIGHER_ENERGY';
      const exhaustionYears =
        Math.round((Math.abs(upfrontDifference) / Math.abs(annualSavings)) * 1000) / 1000;
      simplePaybackYears = exhaustionYears;
      summaryMessage = `Target vehicle costs $${Math.abs(upfrontDifference).toLocaleString()} less upfront, but higher energy costs ($${Math.abs(annualSavings).toLocaleString()}/yr) exhaust the upfront savings in ${exhaustionYears} years.`;
    }
  }

  return {
    condition,
    annualSavings,
    upfrontDifference,
    simplePaybackYears,
    effectivePaybackYears,
    extraEnergyCostWhileWaiting,
    breakEvenDays,
    summaryMessage,
  };
}

/**
 * Calculates cumulative cost and breakdown for a scenario at day t.
 * Supports pre-delivery waiting energy cost and an exact vertical delivery step at deliveryWaitDays.
 */
function getScenarioCostBreakdown(
  scenario: CashFlowScenario,
  t: number,
  isPostDeliveryOnStepDay: boolean
): { total: number; outlay: number; energy: number } {
  const waitDays = scenario.deliveryWaitDays;
  const waitingAnnualCost = scenario.waitingAnnualEnergyCost ?? scenario.annualEnergyCost;
  const upfront = scenario.upfrontOutlay;
  const postDeliveryAnnualCost = scenario.annualEnergyCost;

  if (t < waitDays) {
    const energy = (t / 365) * waitingAnnualCost;
    return { total: energy, outlay: 0, energy };
  }

  if (t === waitDays) {
    const energy = (waitDays / 365) * waitingAnnualCost;
    return isPostDeliveryOnStepDay
      ? { total: energy + upfront, outlay: upfront, energy }
      : { total: energy, outlay: 0, energy };
  }

  // t > waitDays
  const preDeliveryAccrual = (waitDays / 365) * waitingAnnualCost;
  const postDeliveryAccrual = ((t - waitDays) / 365) * postDeliveryAnnualCost;
  const energy = preDeliveryAccrual + postDeliveryAccrual;
  return {
    total: energy + upfront,
    outlay: upfront,
    energy,
  };
}

/**
 * Evaluates cash flow timeline using event-based cash accrual with vertical delivery steps.
 * Does not perform naive whole-curve smoothing or coarse stepAfter approximations.
 *
 * At delivery day T, two points are generated:
 * 1. Just before delivery: [day: T, cost: preDeliveryAccrual]
 * 2. Instant of delivery: [day: T, cost: preDeliveryAccrual + upfrontOutlay]
 *
 * @param refScenario Reference vehicle scenario
 * @param targetScenario Target vehicle scenario
 * @param horizonYears Number of years to project (e.g. 7 or 15)
 * @param options Optional sampling configuration (e.g. monthlySampling)
 */
export function evaluateCashFlowTimeline(
  refScenario: CashFlowScenario,
  targetScenario: CashFlowScenario,
  horizonYears: number,
  options?: { monthlySampling?: boolean }
): CashFlowTimelineResult & { postDeliveryRecoveryYears?: number | null } {
  assertFiniteNonNegative('horizonYears', horizonYears);
  if (horizonYears <= 0) {
    throw new RangeError(`horizonYears must be greater than 0. Received: ${horizonYears}`);
  }

  assertFiniteNonNegative('refScenario.upfrontOutlay', refScenario.upfrontOutlay);
  assertFiniteNonNegative('refScenario.annualEnergyCost', refScenario.annualEnergyCost);
  assertFiniteNonNegative('refScenario.deliveryWaitDays', refScenario.deliveryWaitDays);

  assertFiniteNonNegative('targetScenario.upfrontOutlay', targetScenario.upfrontOutlay);
  assertFiniteNonNegative('targetScenario.annualEnergyCost', targetScenario.annualEnergyCost);
  assertFiniteNonNegative('targetScenario.deliveryWaitDays', targetScenario.deliveryWaitDays);

  const horizonDays = Math.round(horizonYears * 365);

  // Collect key event days:
  const eventDaysSet = new Set<number>();
  eventDaysSet.add(0);
  eventDaysSet.add(horizonDays);

  if (refScenario.deliveryWaitDays >= 0 && refScenario.deliveryWaitDays <= horizonDays) {
    eventDaysSet.add(refScenario.deliveryWaitDays);
  }
  if (targetScenario.deliveryWaitDays >= 0 && targetScenario.deliveryWaitDays <= horizonDays) {
    eventDaysSet.add(targetScenario.deliveryWaitDays);
  }

  // Add yearly milestone days
  for (let y = 1; y <= horizonYears; y++) {
    const day = y * 365;
    if (day <= horizonDays) {
      eventDaysSet.add(day);
    }
  }

  // Optionally add monthly milestone days
  if (options?.monthlySampling) {
    const totalMonths = horizonYears * 12;
    for (let m = 1; m <= totalMonths; m++) {
      const day = Math.round((m * 365) / 12);
      if (day <= horizonDays) {
        eventDaysSet.add(day);
      }
    }
  }

  const sortedDays = Array.from(eventDaysSet).sort((a, b) => a - b);
  const points: CashFlowPoint[] = [];

  for (const day of sortedDays) {
    const isRefDeliveryDay = day === refScenario.deliveryWaitDays;
    const isTargetDeliveryDay = day === targetScenario.deliveryWaitDays;

    if (isRefDeliveryDay || isTargetDeliveryDay) {
      // 1. Point immediately BEFORE delivery step
      const refPre = getScenarioCostBreakdown(refScenario, day, false);
      const targetPre = getScenarioCostBreakdown(targetScenario, day, false);
      points.push({
        day,
        year: Math.round((day / 365) * 1000) / 1000,
        refCumulativeCost: Math.round((refPre.total + Number.EPSILON) * 100) / 100,
        targetCumulativeCost: Math.round((targetPre.total + Number.EPSILON) * 100) / 100,
        netAdvantageTarget: Math.round((refPre.total - targetPre.total + Number.EPSILON) * 100) / 100,
        refPurchaseOutlay: refPre.outlay,
        targetPurchaseOutlay: targetPre.outlay,
        refEnergyCost: Math.round((refPre.energy + Number.EPSILON) * 100) / 100,
        targetEnergyCost: Math.round((targetPre.energy + Number.EPSILON) * 100) / 100,
        event: 'DELIVERY_PENDING',
        isStepPoint: true,
      });

      // 2. Point immediately AFTER delivery step
      const refPost = getScenarioCostBreakdown(refScenario, day, true);
      const targetPost = getScenarioCostBreakdown(targetScenario, day, true);
      points.push({
        day,
        year: Math.round((day / 365) * 1000) / 1000,
        refCumulativeCost: Math.round((refPost.total + Number.EPSILON) * 100) / 100,
        targetCumulativeCost: Math.round((targetPost.total + Number.EPSILON) * 100) / 100,
        netAdvantageTarget: Math.round((refPost.total - targetPost.total + Number.EPSILON) * 100) / 100,
        refPurchaseOutlay: refPost.outlay,
        targetPurchaseOutlay: targetPost.outlay,
        refEnergyCost: Math.round((refPost.energy + Number.EPSILON) * 100) / 100,
        targetEnergyCost: Math.round((targetPost.energy + Number.EPSILON) * 100) / 100,
        event: 'DELIVERY_OUTLAY',
        isStepPoint: true,
      });
    } else {
      const refCost = getScenarioCostBreakdown(refScenario, day, true);
      const targetCost = getScenarioCostBreakdown(targetScenario, day, true);
      points.push({
        day,
        year: Math.round((day / 365) * 1000) / 1000,
        refCumulativeCost: Math.round((refCost.total + Number.EPSILON) * 100) / 100,
        targetCumulativeCost: Math.round((targetCost.total + Number.EPSILON) * 100) / 100,
        netAdvantageTarget: Math.round((refCost.total - targetCost.total + Number.EPSILON) * 100) / 100,
        refPurchaseOutlay: refCost.outlay,
        targetPurchaseOutlay: targetCost.outlay,
        refEnergyCost: Math.round((refCost.energy + Number.EPSILON) * 100) / 100,
        targetEnergyCost: Math.round((targetCost.energy + Number.EPSILON) * 100) / 100,
        event: day % 365 === 0 ? `YEAR_${day / 365}` : undefined,
      });
    }
  }

  // Calculate post-delivery recovery time if target vehicle was delivered with a deficit
  let postDeliveryRecoveryYears: number | null = null;
  const targetDeliveryDay = targetScenario.deliveryWaitDays;
  const refCostAtTargetDelivery = getScenarioCostBreakdown(refScenario, targetDeliveryDay, true).total;
  const targetCostAtTargetDelivery = getScenarioCostBreakdown(targetScenario, targetDeliveryDay, true).total;
  const deficitAtDelivery = targetCostAtTargetDelivery - refCostAtTargetDelivery;

  const postDeliveryAnnualSavings = refScenario.annualEnergyCost - targetScenario.annualEnergyCost;
  if (deficitAtDelivery > 0 && postDeliveryAnnualSavings > 0) {
    postDeliveryRecoveryYears = Math.round((deficitAtDelivery / postDeliveryAnnualSavings) * 1000) / 1000;
  }

  // Find crossover (break-even) day if cumulative cost lines cross after all purchases are completed
  let crossoverDay: number | null = null;
  let crossoverYear: number | null = null;
  const maxDeliveryDay = Math.max(refScenario.deliveryWaitDays, targetScenario.deliveryWaitDays);

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];

    if (p1.day < maxDeliveryDay) {
      continue;
    }

    if (p1.day > 0 && p1.netAdvantageTarget === 0) {
      crossoverDay = p1.day;
      crossoverYear = p1.year;
      break;
    }

    if (
      (p1.netAdvantageTarget < 0 && p2.netAdvantageTarget > 0) ||
      (p1.netAdvantageTarget > 0 && p2.netAdvantageTarget < 0)
    ) {
      if (p2.day === p1.day) {
        // Vertical step crossover
        crossoverDay = p1.day;
        crossoverYear = p1.year;
      } else {
        // Linear interpolation between p1 and p2
        const slope = (p2.netAdvantageTarget - p1.netAdvantageTarget) / (p2.day - p1.day);
        const dayOffset = -p1.netAdvantageTarget / slope;
        crossoverDay = Math.round(p1.day + dayOffset);
        crossoverYear = Math.round((crossoverDay / 365) * 1000) / 1000;
      }
      break;
    }
  }

  const finalPoint = points[points.length - 1];
  const netAdvantageAtHorizon = finalPoint ? finalPoint.netAdvantageTarget : 0;

  return {
    points,
    horizonYears,
    crossoverDay,
    crossoverYear,
    netAdvantageAtHorizon,
    postDeliveryRecoveryYears,
  };
}
