import { describe, it, expect } from 'vitest';
import {
  calculateAnnualGasCost,
  calculateAnnualPHEVCost,
  calculateAnnualGasCostUS,
  calculateAnnualPHEVCostUS,
  calculateExtraEnergyWhileWaiting,
  evaluateSimplePayback,
  evaluateCashFlowTimeline,
  calculateMaxVehiclePrice,
  calculateCanadianLuxuryTax,
  calculateVehicleTotalPurchasePrice,
} from '@/lib/calculator-engine';
import {
  VEHICLE_PRESETS,
  getVehiclePresetById,
  NEW_VEHICLE_PRESETS,
  TRADE_IN_ARCHETYPES,
} from '@/data/vehicle-presets';

describe('ToyotaWaits.ca Savings & Payback Calculator Engine', () => {
  describe('Fixture A: Gas vs HEV Payback & Wait Energy', () => {
    // Fixture A: K=20,000 km, 10.0 vs 6.0 L/100km, $1.80/L, D=$10,000
    // Expected: Savings $1,440/yr, Payback 6.944 yrs post-delivery, 365-day wait energy $1,440
    const annualKm = 20000;
    const gasRefL100km = 10.0;
    const hevTargetL100km = 6.0;
    const gasPricePerL = 1.8;
    const outlayDifference = 10000; // D

    it('calculates correct annual gas costs for Gas and HEV', () => {
      const gasAnnualCost = calculateAnnualGasCost(annualKm, gasRefL100km, gasPricePerL);
      const hevAnnualCost = calculateAnnualGasCost(annualKm, hevTargetL100km, gasPricePerL);

      expect(gasAnnualCost).toBe(3600);
      expect(hevAnnualCost).toBe(2160);

      const annualSavings = gasAnnualCost - hevAnnualCost;
      expect(annualSavings).toBe(1440);
    });

    it('evaluates simple payback of 6.944 yrs post-delivery and 365-day wait energy of $1,440', () => {
      const gasCost = calculateAnnualGasCost(annualKm, gasRefL100km, gasPricePerL);
      const hevCost = calculateAnnualGasCost(annualKm, hevTargetL100km, gasPricePerL);

      const result = evaluateSimplePayback(
        gasCost,
        hevCost,
        0, // outlayRef
        outlayDifference, // outlayTarget
        365 // remainingWaitDays
      );

      expect(result.condition).toBe('POSITIVE_PAYBACK');
      expect(result.annualSavings).toBe(1440);
      expect(result.upfrontDifference).toBe(10000);
      expect(result.simplePaybackYears).toBeCloseTo(6.944, 3);
      expect(result.extraEnergyCostWhileWaiting).toBe(1440);
    });

    it('calculates 365-day wait energy as exactly $1,440 via calculateExtraEnergyWhileWaiting', () => {
      const gasCost = 3600;
      const hevCost = 2160;
      const extraEnergy = calculateExtraEnergyWhileWaiting(gasCost, hevCost, 365);
      expect(extraEnergy).toBe(1440);
    });
  });

  describe('Fixture B: PHEV Split (Electric & Gas Operation)', () => {
    // Fixture B: K=20,000, f=0.65, E_wall=21.5 kWh/100km, r=$0.15/kWh, Gh=6.0 L/100km, p=$1.80/L
    // Expected: Electric $419.25, Gas $756.00, Total $1,175.25
    const annualKm = 20000;
    const electricShare = 0.65; // f
    const wallKwhPer100km = 21.5; // E_wall
    const electricityRatePerKwh = 0.15; // r
    const gasModeL100km = 6.0; // Gh
    const gasPricePerL = 1.8; // p

    it('calculates exact electric, gas, and total costs for PHEV operation', () => {
      const phevCost = calculateAnnualPHEVCost(
        annualKm,
        electricShare,
        wallKwhPer100km,
        electricityRatePerKwh,
        gasModeL100km,
        gasPricePerL
      );

      expect(phevCost.electricCost).toBe(419.25);
      expect(phevCost.gasCost).toBe(756.0);
      expect(phevCost.totalCost).toBe(1175.25);
    });

    it('supports numeric evaluation and totalCost access', () => {
      const phevCost = calculateAnnualPHEVCost(
        annualKm,
        electricShare,
        wallKwhPer100km,
        electricityRatePerKwh,
        gasModeL100km,
        gasPricePerL
      );

      expect(Number(phevCost)).toBe(1175.25);
      expect(phevCost.totalCost).toBe(1175.25);
    });
  });

  describe('Fixture C: Staggered Deliveries & Cash Flow Timeline', () => {
    // Vehicle A @ Day 0 (HEV, annualCost $2,160, outlay 0)
    // Vehicle B @ Day 365 (PHEV, annualCost $1,175.25, waitingCost $3,600, outlay $10,000)
    // At Day 365:
    // Vehicle A cumulative = 0 + 2160 = $2,160
    // Vehicle B cumulative = 3600 (wait energy) + 10000 (outlay step) = $13,600
    // Net advantage of B = 2160 - 13600 = -$11,440
    // Post-delivery annual savings = 2160 - 1175.25 = $984.75/yr
    // Post-delivery recovery = 11440 / 984.75 = ~11.617 yrs

    const refScenario = {
      name: 'Vehicle A (HEV Delivered Day 0)',
      deliveryWaitDays: 0,
      upfrontOutlay: 0,
      annualEnergyCost: 2160,
    };

    const targetScenario = {
      name: 'Vehicle B (PHEV Delivered Day 365)',
      deliveryWaitDays: 365,
      upfrontOutlay: 10000,
      annualEnergyCost: 1175.25,
      waitingAnnualEnergyCost: 3600, // Driven baseline gas vehicle while waiting
    };

    it('projects cash flow with vertical delivery step and exact -$11,440 advantage at Day 365', () => {
      const timeline = evaluateCashFlowTimeline(refScenario, targetScenario, 15);

      // Find the points on Day 365 (before step and after step)
      const day365Points = timeline.points.filter((p) => p.day === 365);
      expect(day365Points.length).toBeGreaterThanOrEqual(2);

      const [pendingPoint, outlayPoint] = day365Points;
      expect(pendingPoint.event).toBe('DELIVERY_PENDING');
      expect(pendingPoint.targetCumulativeCost).toBe(3600);
      expect(pendingPoint.refCumulativeCost).toBe(2160);

      expect(outlayPoint.event).toBe('DELIVERY_OUTLAY');
      expect(outlayPoint.targetCumulativeCost).toBe(13600);
      expect(outlayPoint.refCumulativeCost).toBe(2160);
      expect(outlayPoint.netAdvantageTarget).toBe(-11440);
    });

    it('calculates post-delivery recovery of ~11.617 yrs', () => {
      const timeline = evaluateCashFlowTimeline(refScenario, targetScenario, 15);

      expect(timeline.postDeliveryRecoveryYears).not.toBeNull();
      expect(timeline.postDeliveryRecoveryYears).toBeCloseTo(11.617, 3);
    });

    it('identifies break-even crossover day without whole-curve distortion', () => {
      const timeline = evaluateCashFlowTimeline(refScenario, targetScenario, 15);

      // Deficit is recovered at Day 365 + (11.61716 * 365) = Day ~4605
      expect(timeline.crossoverDay).toBeGreaterThan(4500);
      expect(timeline.crossoverDay).toBeLessThan(4700);
      expect(timeline.crossoverYear).toBeCloseTo(12.617, 2);
    });
  });

  describe('Boundary Tests & Error Rejection', () => {
    it('rejects negative and infinite values in calculateAnnualGasCost', () => {
      expect(() => calculateAnnualGasCost(-20000, 8.0, 1.8)).toThrow(RangeError);
      expect(() => calculateAnnualGasCost(20000, -8.0, 1.8)).toThrow(RangeError);
      expect(() => calculateAnnualGasCost(20000, 8.0, -1.8)).toThrow(RangeError);
      expect(() => calculateAnnualGasCost(Infinity, 8.0, 1.8)).toThrow(TypeError);
      expect(() => calculateAnnualGasCost(20000, NaN, 1.8)).toThrow(TypeError);
    });

    it('rejects invalid electricShare values in calculateAnnualPHEVCost', () => {
      expect(() => calculateAnnualPHEVCost(20000, -0.1, 20, 0.15, 6, 1.8)).toThrow(RangeError);
      expect(() => calculateAnnualPHEVCost(20000, 1.05, 20, 0.15, 6, 1.8)).toThrow(RangeError);
      expect(() => calculateAnnualPHEVCost(20000, NaN, 20, 0.15, 6, 1.8)).toThrow(TypeError);
    });

    it('handles boundary electricShare f=0 (100% gas mode)', () => {
      const cost = calculateAnnualPHEVCost(20000, 0.0, 21.5, 0.15, 6.0, 1.8);
      expect(cost.electricCost).toBe(0);
      expect(cost.gasCost).toBe(2160);
      expect(cost.totalCost).toBe(2160);
    });

    it('handles boundary electricShare f=1 (100% electric mode)', () => {
      const cost = calculateAnnualPHEVCost(20000, 1.0, 20.0, 0.15, 6.0, 1.8);
      // 20000 / 100 * 20 * 0.15 = 200 * 20 * 0.15 = 4000 * 0.15 = 600
      expect(cost.electricCost).toBe(600);
      expect(cost.gasCost).toBe(0);
      expect(cost.totalCost).toBe(600);
    });

    it('returns 0 extra energy cost when wait days is 0', () => {
      const extraEnergy = calculateExtraEnergyWhileWaiting(3600, 2160, 0);
      expect(extraEnergy).toBe(0);
    });

    it('returns 0 cost when annual distance is 0 km', () => {
      const gasCost = calculateAnnualGasCost(0, 8.0, 1.8);
      const phevCost = calculateAnnualPHEVCost(0, 0.65, 21.5, 0.15, 6.0, 1.8);
      expect(gasCost).toBe(0);
      expect(phevCost.totalCost).toBe(0);
    });
  });

  describe('Payback Condition Classifications (6 Canonical States)', () => {
    it('handles POSITIVE_PAYBACK (D > 0, S > 0)', () => {
      const res = evaluateSimplePayback(3600, 2160, 0, 10000, 0);
      expect(res.condition).toBe('POSITIVE_PAYBACK');
      expect(res.simplePaybackYears).toBeCloseTo(6.944, 3);
    });

    it('handles NO_ENERGY_SAVINGS (D > 0, S == 0)', () => {
      const res = evaluateSimplePayback(2500, 2500, 30000, 40000, 0);
      expect(res.condition).toBe('NO_ENERGY_SAVINGS');
      expect(res.simplePaybackYears).toBeNull();
    });

    it('handles HIGHER_ENERGY_COST (D >= 0, S < 0)', () => {
      const res = evaluateSimplePayback(2000, 3000, 30000, 35000, 0);
      expect(res.condition).toBe('HIGHER_ENERGY_COST');
      expect(res.simplePaybackYears).toBeNull();
      expect(res.annualSavings).toBe(-1000);
    });

    it('handles NO_UPFRONT_PREMIUM (D == 0, S > 0)', () => {
      const res = evaluateSimplePayback(3000, 2000, 35000, 35000, 90);
      expect(res.condition).toBe('NO_UPFRONT_PREMIUM');
      expect(res.simplePaybackYears).toBe(0);
      expect(res.effectivePaybackYears).toBeCloseTo(90 / 365, 3);
    });

    it('handles LOWER_OUTLAY_SAVINGS (D < 0, S >= 0)', () => {
      const res = evaluateSimplePayback(3000, 2000, 40000, 35000, 0);
      expect(res.condition).toBe('LOWER_OUTLAY_SAVINGS');
      expect(res.simplePaybackYears).toBe(0);
      expect(res.upfrontDifference).toBe(-5000);
      expect(res.annualSavings).toBe(1000);
    });

    it('handles LOWER_OUTLAY_HIGHER_ENERGY (D < 0, S < 0)', () => {
      // Cheaper upfront by $5,000, but costs $1,000 more per year in energy
      const res = evaluateSimplePayback(2000, 3000, 40000, 35000, 0);
      expect(res.condition).toBe('LOWER_OUTLAY_HIGHER_ENERGY');
      expect(res.upfrontDifference).toBe(-5000);
      expect(res.annualSavings).toBe(-1000);
      expect(res.simplePaybackYears).toBe(5); // Savings exhausted in 5 years
    });
  });

  describe('Vehicle Presets & Provenance Verification', () => {
    it('verifies 2026 RAV4 Hybrid provisional preset', () => {
      const rav4HEV = getVehiclePresetById('2026-toyota-rav4-hybrid');
      expect(rav4HEV).toBeDefined();
      expect(rav4HEV?.consumption.combinedL100km).toBe(5.8);
      expect(rav4HEV?.pricing?.msrpCad).toBe(37500);
      expect(rav4HEV?.consumption.status).toBe('PROVISIONAL');
      expect(rav4HEV?.pricing?.status).toBe('PROVISIONAL');
      expect(rav4HEV?.consumption.sourceUrl).toContain('media.toyota.ca');
    });

    it('verifies 2026 RAV4 PHEV provisional preset', () => {
      const rav4PHEV = getVehiclePresetById('2026-toyota-rav4-phev');
      expect(rav4PHEV).toBeDefined();
      expect(rav4PHEV?.consumption.electricRangeKm).toBe(80);
      expect(rav4PHEV?.consumption.wallKwhPer100km).toBe(21.5);
      expect(rav4PHEV?.consumption.electricityMeasurementBasis).toBe('WALL_TO_WHEEL');
      expect(rav4PHEV?.pricing?.msrpCad).toBe(48750);
      expect(rav4PHEV?.consumption.status).toBe('PROVISIONAL');
      expect(rav4PHEV?.pricing?.status).toBe('PROVISIONAL');
    });

    it('verifies trade-in archetypes with historical provenance', () => {
      const crossover = getVehiclePresetById('archetype-compact-crossover-awd');
      const sedan = getVehiclePresetById('archetype-sedan-gas');
      const truck = getVehiclePresetById('archetype-truck-gas');

      expect(crossover?.consumption.combinedL100km).toBe(9.5);
      expect(crossover?.consumption.status).toBe('HISTORICAL');

      expect(sedan?.consumption.combinedL100km).toBe(8.2);
      expect(sedan?.consumption.status).toBe('HISTORICAL');

      expect(truck?.consumption.combinedL100km).toBe(13.5);
      expect(truck?.consumption.status).toBe('HISTORICAL');
    });

    it('ensures all presets satisfy non-empty provenance metadata', () => {
      for (const preset of VEHICLE_PRESETS) {
        expect(preset.consumption.sourceUrl).toBeTruthy();
        expect(preset.consumption.verifiedAtDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(preset.consumption.datasetVersion).toBeTruthy();
        expect(['VERIFIED', 'PROVISIONAL', 'HISTORICAL', 'UNAVAILABLE']).toContain(
          preset.consumption.status
        );
      }
      expect(NEW_VEHICLE_PRESETS.length).toBeGreaterThan(0);
      expect(TRADE_IN_ARCHETYPES.length).toBe(3);
    });
  });

  describe('US Customary Calculations (MPG, Miles, Gallons, USD)', () => {
    it('calculates US gas costs accurately with 15k miles, 25 vs 40 MPG @ $3.50/gal', () => {
      const annualMiles = 15000;
      const refMpg = 25;
      const targetMpg = 40;
      const gasPricePerGal = 3.5;

      const baselineCost = calculateAnnualGasCostUS(annualMiles, refMpg, gasPricePerGal);
      const hybridCost = calculateAnnualGasCostUS(annualMiles, targetMpg, gasPricePerGal);
      const annualSavings = baselineCost - hybridCost;

      expect(baselineCost).toBe(2100);
      expect(hybridCost).toBe(1312.5);
      expect(annualSavings).toBe(787.5);
    });

    it('calculates US PHEV dual-fuel operating costs with 15k miles, f=0.65, 36 kWh/100mi, $0.16/kWh, 38 MPG, $3.50/gal', () => {
      const annualMiles = 15000;
      const electricShare = 0.65;
      const kwhPer100Miles = 36;
      const electricityRate = 0.16;
      const gasModeMpg = 38;
      const gasPricePerGal = 3.5;

      const phevCost = calculateAnnualPHEVCostUS(
        annualMiles,
        electricShare,
        kwhPer100Miles,
        electricityRate,
        gasModeMpg,
        gasPricePerGal
      );

      // Electric: 15,000 * 0.65 * (36 / 100) * 0.16 = $561.60
      expect(phevCost.electricCost).toBe(561.6);
      // Gas: (15,000 * 0.35 / 38) * 3.50 = 483.55263...
      expect(phevCost.gasCost).toBeCloseTo(483.55, 2);
      expect(phevCost.totalCost).toBeCloseTo(1045.15, 2);
    });

    it('rejects non-positive or non-finite MPG values in US formulas', () => {
      expect(() => calculateAnnualGasCostUS(15000, 0, 3.5)).toThrow(RangeError);
      expect(() => calculateAnnualGasCostUS(15000, -10, 3.5)).toThrow(RangeError);
      expect(() => calculateAnnualGasCostUS(15000, NaN, 3.5)).toThrow(TypeError);

      expect(() =>
        calculateAnnualPHEVCostUS(15000, 0.65, 36, 0.16, 0, 3.5)
      ).toThrow(RangeError);
      expect(() =>
        calculateAnnualPHEVCostUS(15000, 1.2, 36, 0.16, 38, 3.5)
      ).toThrow(RangeError);
      expect(() =>
        calculateAnnualPHEVCostUS(15000, -0.1, 36, 0.16, 38, 3.5)
      ).toThrow(RangeError);
    });

    it('verifies EPA ratings and US MSRP presets', () => {
      const rav4 = getVehiclePresetById('2026-toyota-rav4-hybrid');
      expect(rav4?.consumption.combinedMpg).toBe(40);
      expect(rav4?.pricing?.msrpUsd).toBe(32500);

      const rav4Phev = getVehiclePresetById('2026-toyota-rav4-phev');
      expect(rav4Phev?.consumption.electricRangeMiles).toBe(42);
      expect(rav4Phev?.consumption.gasModeMpg).toBe(38);
      expect(rav4Phev?.consumption.kwhPer100Miles).toBe(36);
      expect(rav4Phev?.pricing?.msrpUsd).toBe(44500);

      const camry = getVehiclePresetById('2025-toyota-camry-hybrid');
      expect(camry?.consumption.combinedMpg).toBe(51);
      expect(camry?.pricing?.msrpUsd).toBe(28400);

      const prius = getVehiclePresetById('2025-toyota-prius-hybrid');
      expect(prius?.consumption.combinedMpg).toBe(57);
      expect(prius?.pricing?.msrpUsd).toBe(27950);

      const crossover = getVehiclePresetById('archetype-compact-crossover-awd');
      expect(crossover?.consumption.combinedMpg).toBe(25);
    });
  });
  describe('Reverse Amortization & Budget Affordability Engine', () => {
    // Fixture: Target $650/mo, $5,000 down, 5.99% APR, 60 months
    it('calculates reverse affordability for standard fixture ($650/mo, $5,000 down, 5.99% APR, 60m)', () => {
      const result = calculateMaxVehiclePrice(650, 5000, 5.99, 60);

      // r = 0.0599 / 12 = 0.004991666666666667
      // principal = 650 * ((1 - (1 + r)^(-60)) / r) = 33629.70
      expect(result.totalFinancedAmount).toBe(33629.7);
      expect(result.maxVehiclePrice).toBe(38629.7);
      expect(result.totalInterestPaid).toBe(5370.3);
      expect(result.totalLoanCost).toBe(44000);
    });

    it('handles 0% APR edge case correctly', () => {
      const result = calculateMaxVehiclePrice(500, 3000, 0, 48);

      expect(result.totalFinancedAmount).toBe(24000);
      expect(result.maxVehiclePrice).toBe(27000);
      expect(result.totalInterestPaid).toBe(0);
      expect(result.totalLoanCost).toBe(27000);
    });

    it('handles zero down payment edge case correctly', () => {
      const result = calculateMaxVehiclePrice(600, 0, 6.0, 60);

      expect(result.totalFinancedAmount).toBe(31035.34);
      expect(result.maxVehiclePrice).toBe(31035.34);
      expect(result.totalInterestPaid).toBe(4964.66);
      expect(result.totalLoanCost).toBe(36000);
    });

    it('handles zero monthly payment edge case', () => {
      const result = calculateMaxVehiclePrice(0, 5000, 5.99, 60);

      expect(result.totalFinancedAmount).toBe(0);
      expect(result.maxVehiclePrice).toBe(5000);
      expect(result.totalInterestPaid).toBe(0);
      expect(result.totalLoanCost).toBe(5000);
    });

    it('validates and rejects negative, non-finite, or invalid inputs', () => {
      expect(() => calculateMaxVehiclePrice(-650, 5000, 5.99, 60)).toThrow(RangeError);
      expect(() => calculateMaxVehiclePrice(650, -5000, 5.99, 60)).toThrow(RangeError);
      expect(() => calculateMaxVehiclePrice(650, 5000, -5.99, 60)).toThrow(RangeError);
      expect(() => calculateMaxVehiclePrice(650, 5000, 5.99, 0)).toThrow(RangeError);
      expect(() => calculateMaxVehiclePrice(650, 5000, 5.99, -12)).toThrow(RangeError);

      expect(() => calculateMaxVehiclePrice(NaN, 5000, 5.99, 60)).toThrow(TypeError);
      expect(() => calculateMaxVehiclePrice(650, Infinity, 5.99, 60)).toThrow(TypeError);
      expect(() => calculateMaxVehiclePrice(650, 5000, NaN, 60)).toThrow(TypeError);
      expect(() => calculateMaxVehiclePrice(650, 5000, 5.99, NaN)).toThrow(TypeError);
    });
  });
  describe('Canadian Federal Luxury Tax Math (Select Luxury Items Tax Act)', () => {
    it('returns  for vehicle price at or below ,000 CAD', () => {
      expect(calculateCanadianLuxuryTax(0)).toBe(0);
      expect(calculateCanadianLuxuryTax(50000)).toBe(0);
      expect(calculateCanadianLuxuryTax(85000)).toBe(0);
      expect(calculateCanadianLuxuryTax(100000)).toBe(0);
    });

    it('calculates correct luxury tax for ,000 vehicle (Math.min(,000, ,000) = ,000)', () => {
      expect(calculateCanadianLuxuryTax(110000)).toBe(2000);
    });

    it('calculates correct luxury tax for ,000 vehicle (Math.min(,000, ,000) = ,000)', () => {
      expect(calculateCanadianLuxuryTax(130000)).toBe(6000);
    });

    it('calculates correct luxury tax for ,000 luxury vehicle where 10% rule takes over', () => {
      expect(calculateCanadianLuxuryTax(250000)).toBe(25000);
    });

    it('calculates total purchase price with luxury tax and provincial sales tax', () => {
      const result = calculateVehicleTotalPurchasePrice(110000, 13);
      expect(result.luxuryTaxCad).toBe(2000);
      expect(result.subtotalWithLuxuryTax).toBe(112000);
      expect(result.salesTaxCad).toBe(14560);
      expect(result.totalPurchasePrice).toBe(126560);
    });

    it('validates and rejects negative or non-finite inputs', () => {
      expect(() => calculateCanadianLuxuryTax(-100000)).toThrow(RangeError);
      expect(() => calculateCanadianLuxuryTax(NaN)).toThrow(TypeError);
      expect(() => calculateCanadianLuxuryTax(Infinity)).toThrow(TypeError);
    });
  });
});
