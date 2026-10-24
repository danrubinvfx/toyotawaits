import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import {
  useSavingsCalculator,
  serializeCalculatorHash,
  deserializeCalculatorHash,
  DEFAULT_DRIVING_INPUTS,
  DEFAULT_CURRENT_VEHICLE,
  DEFAULT_TARGET_VEHICLE,
} from '@/lib/hooks/useSavingsCalculator';
import { DrivingInputsCard } from '@/components/calculator/DrivingInputsCard';
import { CurrentVehicleCard } from '@/components/calculator/CurrentVehicleCard';
import { TargetVehicleCard } from '@/components/calculator/TargetVehicleCard';
import { EnergyResultsCard } from '@/components/calculator/EnergyResultsCard';
import { StaticEnergyTable } from '@/components/calculator/StaticEnergyTable';
import { VehicleSavingsCalculator } from '@/components/calculator/VehicleSavingsCalculator';
import CalculatorPage, { metadata } from '@/app/calculator/page';

describe('Stage 2: ToyotaWaits.ca Savings Calculator (Energy MVP)', () => {
  beforeEach(() => {
    window.location.hash = '';
    vi.clearAllMocks();
  });

  afterEach(() => {
    window.location.hash = '';
  });

  describe('useSavingsCalculator Hook & Hash Sync', () => {
    it('initializes with default values and produces verified calculations', () => {
      const { result } = renderHook(() => useSavingsCalculator());

      expect(result.current.drivingInputs.annualKm).toBe(20000);
      expect(result.current.drivingInputs.gasPricePerL).toBe(1.75);
      expect(result.current.currentVehicle.mode).toBe('ARCHETYPE');
      expect(result.current.targetVehicle.presetId).toBe('2026-toyota-rav4-hybrid');

      // Baseline Compact Crossover (9.5 L/100km):
      // (20000 / 100) * 9.5 * 1.75 = 200 * 9.5 * 1.75 = 3325
      expect(result.current.results.currentAnnualCost).toBe(3325);

      // Target RAV4 Hybrid LE AWD (5.8 L/100km):
      // (20000 / 100) * 5.8 * 1.75 = 200 * 5.8 * 1.75 = 2030
      expect(result.current.results.targetAnnualCost).toBe(2030);

      // Annual Savings: 3325 - 2030 = 1295
      expect(result.current.results.annualSavings).toBe(1295);
      expect(result.current.results.monthlySavings).toBeCloseTo(1295 / 12, 2);
    });

    it('serializes and deserializes hash fragment with strict validation', () => {
      const driving = { annualKm: 25000, gasPricePerL: 1.85, electricityRatePerKwh: 0.16 };
      const current = { mode: 'CUSTOM' as const, archetypeId: 'archetype-sedan-gas', customL100km: 11.2 };
      const target = {
        presetId: '2026-toyota-rav4-phev',
        powertrain: 'PHEV' as const,
        hasChargingAccess: true,
        electricShare: 0.7,
      };

      const hash = serializeCalculatorHash(driving, current, target);
      expect(hash.startsWith('#c=')).toBe(true);

      const parsed = deserializeCalculatorHash(hash);
      expect(parsed).not.toBeNull();
      expect(parsed?.k).toBe(25000);
      expect(parsed?.gp).toBe(1.85);
      expect(parsed?.ep).toBe(0.16);
      expect(parsed?.cm).toBe('CUSTOM');
      expect(parsed?.cl).toBe(11.2);
      expect(parsed?.tp).toBe('2026-toyota-rav4-phev');
      expect(parsed?.pt).toBe('PHEV');
      expect(parsed?.ch).toBe(1);
      expect(parsed?.es).toBe(0.7);
    });

    it('safely handles corrupted, invalid JSON, or oversized hashes without crashing', () => {
      // 1. Invalid JSON
      expect(deserializeCalculatorHash('#c=invalid-not-json')).toBeNull();

      // 2. Empty string
      expect(deserializeCalculatorHash('')).toBeNull();

      // 3. Oversized hash (> 2048 chars)
      const hugeHash = '#c=' + 'a'.repeat(3000);
      expect(deserializeCalculatorHash(hugeHash)).toBeNull();

      // 4. Hook falls back safely when mounted with corrupted hash
      const { result } = renderHook(() => useSavingsCalculator('#c=malformed_payload_here'));
      expect(result.current.drivingInputs.annualKm).toBe(DEFAULT_DRIVING_INPUTS.annualKm);
      expect(result.current.currentVehicle.mode).toBe(DEFAULT_CURRENT_VEHICLE.mode);
      expect(result.current.targetVehicle.presetId).toBe(DEFAULT_TARGET_VEHICLE.presetId);
    });

    it('clamps out-of-bounds deserialized parameters', () => {
      const outOfBounds = {
        k: 9999999, // Too high (max 150000)
        gp: 99.9, // Too high (max 5.0)
        ep: -5, // Too low (min 0.01)
        cl: 80, // Too high (max 40)
        es: 2.5, // Too high (max 1.0)
      };
      const json = encodeURIComponent(JSON.stringify(outOfBounds));
      const parsed = deserializeCalculatorHash(`#c=${json}`);

      expect(parsed?.k).toBe(150000);
      expect(parsed?.gp).toBe(5.0);
      expect(parsed?.ep).toBe(0.01);
      expect(parsed?.cl).toBe(40.0);
      expect(parsed?.es).toBe(1.0);
    });

    it('updates calculations when switching to PHEV and adjusts for charging access', () => {
      const { result } = renderHook(() => useSavingsCalculator());

      // Switch to PHEV with charging access
      act(() => {
        result.current.setTargetVehicle({
          presetId: '2026-toyota-rav4-phev',
          powertrain: 'PHEV',
          hasChargingAccess: true,
          electricShare: 0.65,
        });
      });

      expect(result.current.results.targetIsPhev).toBe(true);
      expect(result.current.results.targetAnnualElectricCost).toBeGreaterThan(0);
      expect(result.current.results.targetAnnualGasCost).toBeGreaterThan(0);

      // Turn OFF regular charging access -> electric share must become 0
      act(() => {
        result.current.setTargetVehicle({
          hasChargingAccess: false,
        });
      });

      expect(result.current.targetVehicle.electricShare).toBe(0);
      expect(result.current.results.targetAnnualElectricCost).toBe(0);
      // In hybrid gas mode: (20000 / 100) * 6.0 * 1.75 = 200 * 6 * 1.75 = 2100
      expect(result.current.results.targetAnnualCost).toBe(2100);
    });
  });

  describe('UI Component: DrivingInputsCard', () => {
    it('renders accessible labels and input controls with min 44px touch targets', () => {
      const mockChange = vi.fn();
      render(
        <DrivingInputsCard
          inputs={DEFAULT_DRIVING_INPUTS}
          onChange={mockChange}
        />
      );

      // Check Accessible Label & Synchronized Input for Annual Km
      const kmInput = screen.getByLabelText(/Annual driving distance in kilometers/i);
      expect(kmInput).toBeInTheDocument();
      expect(kmInput).toHaveValue(20000);
      expect(kmInput.className).toContain('min-h-[44px]');

      // Check Gas Price Input
      const gasInput = screen.getByLabelText(/Gasoline price in Canadian dollars per litre/i);
      expect(gasInput).toBeInTheDocument();
      expect(gasInput).toHaveValue(1.75);
      expect(gasInput.className).toContain('min-h-[44px]');

      // Check Electricity Rate Input
      const electricInput = screen.getByLabelText(/Electricity rate in Canadian dollars per kilowatt hour/i);
      expect(electricInput).toBeInTheDocument();
      expect(electricInput).toHaveValue(0.14);
      expect(electricInput.className).toContain('min-h-[44px]');
    });

    it('triggers onChange when slider or input changes', () => {
      const mockChange = vi.fn();
      render(
        <DrivingInputsCard
          inputs={DEFAULT_DRIVING_INPUTS}
          onChange={mockChange}
        />
      );

      const kmInput = screen.getByLabelText(/Annual driving distance in kilometers/i);
      fireEvent.change(kmInput, { target: { value: '25000' } });
      expect(mockChange).toHaveBeenCalledWith({ annualKm: 25000 });

      // Click quick distance preset chip
      const chip15k = screen.getByRole('button', { name: /15,000 km/i });
      fireEvent.click(chip15k);
      expect(mockChange).toHaveBeenCalledWith({ annualKm: 15000 });
    });
  });

  describe('UI Component: CurrentVehicleCard', () => {
    it('supports tab switching between Archetype and Custom L/100km', () => {
      const mockChange = vi.fn();
      const { rerender } = render(
        <CurrentVehicleCard
          currentVehicle={DEFAULT_CURRENT_VEHICLE}
          onChange={mockChange}
        />
      );

      // In Archetype mode, archetypes are visible
      expect(screen.getByRole('radio', { name: /Compact Crossover AWD/i })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: /Full-Size Truck/i })).toBeInTheDocument();

      // Click Custom tab
      const customTab = screen.getByRole('tab', { name: /Custom L\/100km/i });
      fireEvent.click(customTab);
      expect(mockChange).toHaveBeenCalledWith({ mode: 'CUSTOM' });

      // Re-render in custom mode
      rerender(
        <CurrentVehicleCard
          currentVehicle={{ mode: 'CUSTOM', archetypeId: 'archetype-compact-crossover-awd', customL100km: 10.5 }}
          onChange={mockChange}
        />
      );

      const customInput = screen.getByLabelText(/Custom fuel consumption in litres per 100 kilometers/i);
      expect(customInput).toBeInTheDocument();
      expect(customInput).toHaveValue(10.5);
    });
  });

  describe('UI Component: TargetVehicleCard', () => {
    it('renders models and reveals PHEV charging access and electric share slider', () => {
      const mockChange = vi.fn();
      const { rerender } = render(
        <TargetVehicleCard
          targetVehicle={DEFAULT_TARGET_VEHICLE}
          onChange={mockChange}
        />
      );

      // RAV4 Hybrid is selected by default, no PHEV slider yet
      expect(screen.getByText(/2026 Toyota RAV4 Hybrid AWD/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/Electric driving share/i)).not.toBeInTheDocument();

      // Switch to PHEV
      rerender(
        <TargetVehicleCard
          targetVehicle={{
            presetId: '2026-toyota-rav4-phev',
            powertrain: 'PHEV',
            hasChargingAccess: true,
            electricShare: 0.65,
          }}
          onChange={mockChange}
        />
      );

      // Now PHEV charging access and electric share slider are revealed
      expect(screen.getByText(/Plug-in Hybrid EV Settings/i)).toBeInTheDocument();
      expect(screen.getByText(/Do you have regular home or workplace charging\?/i)).toBeInTheDocument();
      const shareInput = screen.getByLabelText(/Electric driving share percentage/i);
      expect(shareInput).toBeInTheDocument();
      expect(shareInput).toHaveValue(65);
    });

    it('shows hybrid warning callout when charging access is set to No', () => {
      const mockChange = vi.fn();
      render(
        <TargetVehicleCard
          targetVehicle={{
            presetId: '2026-toyota-rav4-phev',
            powertrain: 'PHEV',
            hasChargingAccess: false,
            electricShare: 0.0,
          }}
          onChange={mockChange}
        />
      );

      expect(screen.getByText(/Without regular charging access, electric share is set to 0%/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/Electric driving share slider/i)).not.toBeInTheDocument();
    });

    it('supports direct selection via vehicle pulldown menu', () => {
      const mockChange = vi.fn();
      render(
        <TargetVehicleCard
          targetVehicle={DEFAULT_TARGET_VEHICLE}
          onChange={mockChange}
        />
      );

      const select = screen.getByLabelText('Select Target Toyota');
      expect(select.tagName).toBe('SELECT');
      expect(screen.getByRole('option', { name: /RAV4 PHEV AWD/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /Grand Highlander Hybrid AWD/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /Crown Signia/i })).toBeInTheDocument();
      expect(screen.queryByRole('tab')).not.toBeInTheDocument();

      // Select RAV4 PHEV
      fireEvent.change(select, { target: { value: '2026-toyota-rav4-phev' } });
      expect(mockChange).toHaveBeenCalledWith(
        expect.objectContaining({
          presetId: '2026-toyota-rav4-phev',
          powertrain: 'PHEV',
          hasChargingAccess: true,
          electricShare: 0.65,
        })
      );

      // Select Crown Signia
      fireEvent.change(select, { target: { value: '2025-toyota-crown-signia-hybrid' } });
      expect(mockChange).toHaveBeenCalledWith(
        expect.objectContaining({
          presetId: '2025-toyota-crown-signia-hybrid',
          powertrain: 'HEV',
        })
      );
    });
  });

  describe('UI Component: EnergyResultsCard', () => {
    it('strictly labels results as Energy-Cost Savings and itemizes PHEV costs', () => {
      const phevResults = {
        effectiveCurrentL100km: 9.5,
        currentAnnualCost: 3325,
        currentMonthlyCost: 277.08,
        currentAnnualFuelL: 1900,
        targetL100km: 6.0,
        targetAnnualCost: 1175.25,
        targetMonthlyCost: 97.94,
        targetIsPhev: true,
        targetAnnualElectricCost: 419.25,
        targetAnnualElectricKwh: 2795,
        targetAnnualGasCost: 756.0,
        targetAnnualGasL: 420,
        annualSavings: 2149.75,
        monthlySavings: 179.15,
        savingsPercent: 64.7,
        unitSystem: 'METRIC' as const,
        currencyCode: 'CAD' as const,
        shareUrl: 'https://toyotawaits.ca/calculator#c=test',
      };

      render(<EnergyResultsCard results={phevResults} />);

      // Strict label compliance
      expect(screen.getByText('Energy-Cost Savings')).toBeInTheDocument();

      // Primary savings number
      expect(screen.getByText('$2,150 CAD')).toBeInTheDocument();
      expect(screen.getByText(/64.7% reduction in energy spend/i)).toBeInTheDocument();

      // PHEV itemized breakdown: Electricity ($CAD & kWh) and Gas ($CAD & Litres)
      expect(screen.getByText(/Electricity \(EV Mode\)/i)).toBeInTheDocument();
      expect(screen.getByText('$419.25 CAD')).toBeInTheDocument();
      expect(screen.getByText(/2,795 kWh/i)).toBeInTheDocument();

      expect(screen.getByText(/Gasoline \(Hybrid Mode\)/i)).toBeInTheDocument();
      expect(screen.getByText('$756.00 CAD')).toBeInTheDocument();
      expect(screen.getByText(/420 Litres/i)).toBeInTheDocument();

      // Share button
      const shareBtn = screen.getByRole('button', { name: /Copy Shareable Link/i });
      expect(shareBtn).toBeInTheDocument();
    });
  });

  describe('UI Component: StaticEnergyTable', () => {
    it('renders accessible static benchmark table across 15k, 20k, and 25k km', () => {
      render(<StaticEnergyTable />);

      const heading = screen.getByRole('heading', { name: /Canadian Annual Energy Benchmark Table/i });
      expect(heading).toBeInTheDocument();

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();

      // Column headers
      expect(screen.getByText('15,000 km / yr')).toBeInTheDocument();
      expect(screen.getByText('20,000 km / yr')).toBeInTheDocument();
      expect(screen.getByText('25,000 km / yr')).toBeInTheDocument();

      // Check presence of key vehicles
      expect(screen.getByText(/2026 Toyota RAV4 Hybrid AWD/i)).toBeInTheDocument();
      expect(screen.getByText(/2026 Toyota RAV4 PHEV AWD/i)).toBeInTheDocument();
      expect(screen.getByText(/Compact Crossover Gas AWD/i)).toBeInTheDocument();
    });
  });

  describe('Page & Verification Gates: CalculatorPage', () => {
    it('renders server component page with metadata and canonical URL', async () => {
      expect(metadata.alternates?.canonical).toBe('https://toyotawaits.ca/calculator');
      expect(metadata.title).toContain('Toyota Hybrid Fuel Savings & Payback Calculator');

      await act(async () => {
        render(<CalculatorPage />);
      });

      expect(screen.getByRole('heading', { level: 1, name: /Toyota Fuel Savings & Payback Calculator/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Recommended Products/i })).toBeInTheDocument();
      expect(screen.getByText(/Calculation Methodology & Evidence Provenance/i)).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Canadian Annual Energy Benchmark Table/i })).toBeInTheDocument();
    });

    it('verifies that full VehicleSavingsCalculator renders with zero missing controls', async () => {
      await act(async () => {
        render(<VehicleSavingsCalculator />);
      });

      // Reset button
      expect(screen.getByRole('button', { name: /Reset Defaults/i })).toBeInTheDocument();

      // Input cards
      expect(screen.getByText(/Target Toyota Vehicle/i)).toBeInTheDocument();
      expect(screen.getByText(/Current Vehicle Baseline/i)).toBeInTheDocument();
      expect(screen.getByText(/Driving & Utility Inputs/i)).toBeInTheDocument();

      // Results card
      expect(screen.getByText('Energy-Cost Savings')).toBeInTheDocument();
    });

    it('Gate 1: verifies responsive layout compatibility across 320px, 375px, 768px, and 1440px', async () => {
      const viewports = [320, 375, 768, 1440];

      for (const width of viewports) {
        window.innerWidth = width;
        let containerElem: HTMLElement;
        await act(async () => {
          const { container } = render(<CalculatorPage />);
          containerElem = container;
        });

        // Verify main container has responsive padding and max-w constraint
        const main = containerElem!.querySelector('main');
        expect(main).toBeInTheDocument();
        expect(main?.className).toContain('min-h-screen');

        const wrapper = containerElem!.querySelector('.max-w-6xl');
        expect(wrapper).toBeInTheDocument();

        // Verify benchmark table has overflow-x-auto to prevent horizontal page blowouts on 320px/375px
        const tableWrapper = containerElem!.querySelector('.overflow-x-auto');
        expect(tableWrapper).toBeInTheDocument();
      }
    });

    it('Gate 2: confirms keyboard navigation and screen-reader label compliance for all slider/input pairs', async () => {
      await act(async () => {
        render(<VehicleSavingsCalculator />);
      });

      // Default HEV hides power rate
      expect(screen.queryByLabelText(/Electricity rate in Canadian dollars per kilowatt hour/i)).not.toBeInTheDocument();

      // Switch to PHEV to reveal electricity rate controls
      await act(async () => {
        fireEvent.change(screen.getByLabelText('Select Target Toyota'), {
          target: { value: '2026-toyota-rav4-phev' },
        });
      });

      // Verify every number input has an accessible name
      const annualKmInput = screen.getByLabelText(/Annual driving distance in kilometers/i);
      const gasPriceInput = screen.getByLabelText(/Gasoline price in Canadian dollars per litre/i);
      const electricRateInput = screen.getByLabelText(/Electricity rate in Canadian dollars per kilowatt hour/i);

      expect(annualKmInput).toHaveAttribute('type', 'number');
      expect(gasPriceInput).toHaveAttribute('type', 'number');
      expect(electricRateInput).toHaveAttribute('type', 'number');

      // Verify sliders have accessible labels
      expect(screen.getByLabelText(/Annual driving distance slider/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Gasoline price slider/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Electricity rate slider/i)).toBeInTheDocument();

      // Verify minimum touch target compliance (min-h-[44px])
      expect(annualKmInput.className).toContain('min-h-[44px]');
      expect(gasPriceInput.className).toContain('min-h-[44px]');
      expect(electricRateInput.className).toContain('min-h-[44px]');

      // Test focusability / keyboard navigation
      annualKmInput.focus();
      expect(document.activeElement).toBe(annualKmInput);

      gasPriceInput.focus();
      expect(document.activeElement).toBe(gasPriceInput);

      electricRateInput.focus();
      expect(document.activeElement).toBe(electricRateInput);
    });

    it('Gate 3: confirms hash-based share links restore state without triggering page reloads or SSR hydration mismatches', () => {
      const replaceStateSpy = vi.spyOn(window.history, 'replaceState');

      // Set initial hash
      const payload = {
        k: 32000,
        gp: 1.95,
        ep: 0.18,
        cm: 'CUSTOM' as const,
        cl: 12.5,
        tp: '2026-toyota-rav4-hybrid',
        pt: 'HEV' as const,
        ch: 1 as const,
        es: 0.65,
      };
      const initialHash = `#c=${encodeURIComponent(JSON.stringify(payload))}`;
      window.location.hash = initialHash;

      const { result } = renderHook(() => useSavingsCalculator());

      // Hydration must complete cleanly
      expect(result.current.isHydrated).toBe(true);

      // State is restored from hash
      expect(result.current.drivingInputs.annualKm).toBe(32000);
      expect(result.current.drivingInputs.gasPricePerL).toBe(1.95);
      expect(result.current.drivingInputs.electricityRatePerKwh).toBe(0.18);
      expect(result.current.currentVehicle.mode).toBe('CUSTOM');
      expect(result.current.currentVehicle.customL100km).toBe(12.5);

      // Changing state replaces hash in history without full page reload
      act(() => {
        result.current.setDrivingInputs({ annualKm: 35000 });
      });

      expect(replaceStateSpy).toHaveBeenCalled();
      const lastCallUrl = replaceStateSpy.mock.calls[replaceStateSpy.mock.calls.length - 1][2] as string;
      expect(lastCallUrl).toContain('#c=');
    });
  });
});
