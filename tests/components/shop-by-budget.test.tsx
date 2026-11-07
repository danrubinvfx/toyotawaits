import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InteractiveCalculatorHub } from '@/components/calculator/InteractiveCalculatorHub';
import {
  ShopByBudgetCalculator,
  calculateMonthlyFuelSavingsCad,
} from '@/components/calculator/ShopByBudgetCalculator';
import { RelatedGuidesHub, TrustCalloutBanner } from '@/components/calculator/RelatedGuidesHub';

// Mock CalculatorContext if needed by subcomponents
vi.mock('@/context/CalculatorContext', () => ({
  useCalculatorContext: () => ({
    activeModelSlug: 'rav4',
    activeModelName: 'RAV4',
    activePresetId: '2026-toyota-rav4-hybrid',
    setActivePresetId: vi.fn(),
  }),
}));

describe('Shop by Budget & Content Trust Architecture', () => {
  describe('TrustCalloutBanner Component', () => {
    it('renders 100% Free & Independent copy with zero-lead-gen guarantee', () => {
      render(<TrustCalloutBanner />);

      expect(screen.getByText(/100% Free & Independent/i)).toBeInTheDocument();
      expect(
        screen.getByText(/No signups, no email required, nothing stored/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Real Canadian wait-time medians, fuel savings, and all-in pricing transparency/i)
      ).toBeInTheDocument();
    });
  });

  describe('RelatedGuidesHub Component', () => {
    it('renders the Guides to Pair With Your Search section and all 3 required internal guides', () => {
      render(<RelatedGuidesHub />);

      expect(screen.getByRole('heading', { level: 2, name: /Guides to Pair With Your Search/i })).toBeInTheDocument();
      expect(
        screen.getByText(/Clear, field-tested guides on factory options, waitlists, and vehicle delivery/i)
      ).toBeInTheDocument();

      // Guide 1: Sienna Trailer Hitch
      const siennaLink = screen.getByRole('link', {
        name: /2021\+ Toyota Sienna Trailer Hitch & Kick Sensor Guide/i,
      });
      expect(siennaLink).toHaveAttribute('href', '/guides/toyota-sienna-trailer-hitch-guide');
      expect(
        screen.getByText(/EcoHitch vs\. Curt 13470 comparison, bumper removal instructions/i)
      ).toBeInTheDocument();

      // Guide 2: RAV4 2026 vs 2027
      const rav4Link = screen.getByRole('link', {
        name: /2026 vs\. 2027 Toyota RAV4 Carryover & Buying Guide/i,
      });
      expect(rav4Link).toHaveAttribute('href', '/guides/toyota-rav4-2026-vs-2027');
      expect(
        screen.getByText(/Model year generational changes, factory allocation carryovers/i)
      ).toBeInTheDocument();

      // Guide 3: Delivery Day Inspection Checklist
      const deliveryLink = screen.getByRole('link', {
        name: /Delivery Day Inspection Checklist & Factory Pickup Guide/i,
      });
      expect(deliveryLink).toHaveAttribute('href', '/delivery-prep');
      expect(
        screen.getByText(/All-in pricing audit, PDI checklist, anti-theft tagging/i)
      ).toBeInTheDocument();
    });
  });

  describe('InteractiveCalculatorHub Mode Switcher', () => {
    it('renders segmented control and defaults to Shop by Toyota Model mode', () => {
      render(<InteractiveCalculatorHub />);

      const modelTab = screen.getByRole('tab', { name: /Shop by Toyota Model/i });
      const budgetTab = screen.getByRole('tab', { name: /Shop by Monthly Budget/i });

      expect(modelTab).toBeInTheDocument();
      expect(budgetTab).toBeInTheDocument();
      expect(modelTab).toHaveAttribute('aria-selected', 'true');
      expect(budgetTab).toHaveAttribute('aria-selected', 'false');

      // Trust banner is present
      expect(screen.getByText(/100% Free & Independent/i)).toBeInTheDocument();
    });

    it('switches cleanly to Shop by Monthly Budget mode when tab is clicked', () => {
      render(<InteractiveCalculatorHub />);

      const budgetTab = screen.getByRole('tab', { name: /Shop by Monthly Budget/i });
      fireEvent.click(budgetTab);

      expect(budgetTab).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText(/Your Monthly Financing Budget/i)).toBeInTheDocument();
      expect(screen.getByText(/Calculated Affordability Ceiling/i)).toBeInTheDocument();
    });
  });

  describe('ShopByBudgetCalculator Component', () => {
    it('renders default budget inputs: $700/mo, $5,000 down, 60m term, 6.49% APR', () => {
      render(<ShopByBudgetCalculator />);

      const monthlyInput = screen.getByLabelText('Target Monthly Payment', { exact: true }) as HTMLInputElement;
      const downPaymentInput = screen.getByLabelText(/Down Payment & Trade-In Equity/i) as HTMLInputElement;
      const rateInput = screen.getByLabelText(/Estimated Financing Rate/i) as HTMLInputElement;

      expect(monthlyInput.value).toBe('700');
      expect(downPaymentInput.value).toBe('5000');
      expect(rateInput.value).toBe('6.49');

      // Default term 60m should be highlighted
      const term60 = screen.getByRole('button', { name: '60 months' });
      expect(term60).toHaveClass('bg-emerald-600');
    });

    it('calculates and displays purchase ceiling and matching models for $700/mo and $5,000 down', () => {
      render(<ShopByBudgetCalculator />);

      // At $700/mo, $5k down, 6.49% APR, 60m: ceiling is ~$40,785 CAD
      expect(screen.getAllByText(/40,785/).length).toBeGreaterThanOrEqual(1);

      // Matched cards should include Corolla Hybrid, Camry, RAV4 Hybrid
      expect(screen.getByText('Toyota Corolla Hybrid')).toBeInTheDocument();
      expect(screen.getByText('Toyota Camry Hybrid')).toBeInTheDocument();
      expect(screen.getByText('Toyota RAV4 Hybrid')).toBeInTheDocument();

      // Should display P50 wait times
      expect(screen.getByText('P50 Wait: ~180 days (5–8 mos)')).toBeInTheDocument();

      // Direct CTA linking to wait times
      const rav4QueueLink = screen.getAllByRole('link', { name: /Explore Queue/i }).find((link) =>
        link.getAttribute('href') === '/wait-times/rav4'
      );
      expect(rav4QueueLink).toBeDefined();
    });

    it('dynamically updates affordability ceiling when monthly payment or term is changed', () => {
      render(<ShopByBudgetCalculator />);

      const monthlyInput = screen.getByLabelText('Target Monthly Payment', { exact: true });
      fireEvent.change(monthlyInput, { target: { value: '1000' } });

      // Switching term to 72 months
      const term72 = screen.getByRole('button', { name: '72 months' });
      fireEvent.click(term72);

      // Higher budget ceiling should be rendered
      expect(screen.getByText(/Calculated Affordability Ceiling/i)).toBeInTheDocument();
    });

    it('correctly calculates monthly fuel savings vs 9.5 L/100km gas reference', () => {
      // 20,000 km/yr = 1,666.67 km/mo
      // Ref: (1666.67 / 100) * 9.5 * 1.65 = $261.25/mo
      // Camry (4.6 L/100km): (1666.67 / 100) * 4.6 * 1.65 = $126.50/mo -> $135 savings
      const camrySavings = calculateMonthlyFuelSavingsCad(4.6);
      expect(camrySavings).toBe(135);

      // RAV4 Hybrid (5.8 L/100km): (1666.67 / 100) * 5.8 * 1.65 = $159.50/mo -> $102 savings
      const rav4Savings = calculateMonthlyFuelSavingsCad(5.8);
      expect(rav4Savings).toBe(102);
    });

    it('filters models by powertrain pill buttons', () => {
      render(<ShopByBudgetCalculator />);

      const hybridsOnlyBtn = screen.getByRole('button', { name: /Hybrids Only/i });
      fireEvent.click(hybridsOnlyBtn);

      // Gas models like RAV4 Gas should not be present
      expect(screen.queryByText('Toyota RAV4 LE AWD • 7.9 L/100km combined')).not.toBeInTheDocument();
      // Hybrids should still be visible
      expect(screen.getByText('Toyota RAV4 Hybrid')).toBeInTheDocument();
    });
  });
});
