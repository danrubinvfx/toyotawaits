/**
 * tests/discovery/ui-components.test.tsx
 *
 * Sprint 5: UI Integration & Search/Filter Components Tests
 * Master Plan V3.2 Page 4, Section 2 & 3
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  VehicleListingCard,
  VehicleListingCardProps,
} from '@/components/discovery/VehicleListingCard';
import {
  InventoryFilterBar,
  FilterState,
} from '@/components/discovery/InventoryFilterBar';
import { CoverageDisclosureBanner } from '@/components/discovery/CoverageDisclosureBanner';
import { InventoryExplorer } from '@/components/discovery/InventoryExplorer';
import InventoryPage from '@/app/inventory/page';

describe('Sprint 5: Discovery UI Components & Search Integration', () => {
  const sampleCardProps: VehicleListingCardProps = {
    id: 'listing-rav4-01',
    make: 'Toyota',
    model: 'RAV4 Hybrid',
    trim: 'XSE AWD',
    modelYear: 2026,
    vin: '2T3P1RFV5TC123456',
    isProvisionalVin: false,
    dealerName: 'Jim Pattison Toyota Downtown',
    dealerCity: 'Vancouver',
    dealerProvince: 'BC',
    status: 'Advertised - availability unconfirmed',
    lastChecked: '2026-10-17T11:00:00Z',
    vdpUrl: 'https://www.jptoyotadowntown.com/inventory/new-rav4',
    msrp: 47550,
    sellingPrice: 48995,
    mandatoryFees: 895,
    hasUnverifiedFees: true,
    powertrain: 'Hybrid 2.5L 4-Cyl',
    exteriorColor: 'Cavalry Blue',
    stockNumber: 'T26-1044',
  };

  // ===========================================================================
  // 1. VehicleListingCard Tests
  // ===========================================================================
  describe('VehicleListingCard', () => {
    it('renders vehicle spec, trim, dealer name, and accessible ARIA attributes', () => {
      render(<VehicleListingCard {...sampleCardProps} />);

      const article = screen.getByTestId('listing-card-listing-rav4-01');
      expect(article).toBeInTheDocument();
      expect(article).toHaveAttribute(
        'aria-label',
        '2026 Toyota RAV4 Hybrid XSE AWD at Jim Pattison Toyota Downtown'
      );

      expect(screen.getByText(/2026 Toyota RAV4 Hybrid/i)).toBeInTheDocument();
      expect(screen.getByText('XSE AWD')).toBeInTheDocument();
      expect(screen.getByText('Jim Pattison Toyota Downtown')).toBeInTheDocument();
      expect(screen.getByText('(Vancouver, BC)')).toBeInTheDocument();
      expect(screen.getByText('Hybrid 2.5L 4-Cyl')).toBeInTheDocument();
      expect(screen.getByText('Cavalry Blue')).toBeInTheDocument();
      expect(screen.getByText('Stock #T26-1044')).toBeInTheDocument();
    });

    it('displays exact "Advertised - availability unconfirmed" status badge', () => {
      render(<VehicleListingCard {...sampleCardProps} />);
      const badge = screen.getByTestId('status-badge');
      expect(badge).toHaveTextContent('Advertised - availability unconfirmed');
    });

    it('displays "Incoming availability unconfirmed" status badge for in-transit vehicles', () => {
      render(
        <VehicleListingCard
          {...sampleCardProps}
          status="Incoming availability unconfirmed"
        />
      );
      const badge = screen.getByTestId('status-badge');
      expect(badge).toHaveTextContent('Incoming availability unconfirmed');
    });

    it('displays "Price not verified" badge when dealer fees are unconfirmed', () => {
      render(<VehicleListingCard {...sampleCardProps} hasUnverifiedFees={true} />);
      const notice = screen.getByTestId('price-not-verified-badge');
      expect(notice).toHaveTextContent(/Price not verified/i);
      expect(notice).toHaveTextContent(/Dealer fees unconfirmed/i);
    });

    it('displays disclosed mandatory fees when fees are verified and provided', () => {
      render(
        <VehicleListingCard
          {...sampleCardProps}
          hasUnverifiedFees={false}
          mandatoryFees={895}
        />
      );
      expect(screen.queryByTestId('price-not-verified-badge')).not.toBeInTheDocument();
      expect(screen.getByText(/Disclosed mandatory fees:/i)).toBeInTheDocument();
      expect(screen.getByText('$895')).toBeInTheDocument();
    });

    it('distinguishes true 17-char VIN from provisional stock identifier', () => {
      const { rerender } = render(
        <VehicleListingCard {...sampleCardProps} isProvisionalVin={false} vin="2T3P1RFV5TC123456" />
      );
      expect(screen.getByTestId('vin-display')).toHaveTextContent('2T3P1RFV5TC123456');

      // Provisional VIN
      rerender(
        <VehicleListingCard
          {...sampleCardProps}
          isProvisionalVin={true}
          vin={null}
          provisionalId="PROV-STOCK-99"
        />
      );
      expect(screen.getByTestId('vin-display')).toHaveTextContent('PROV-STOCK-99');
      expect(screen.getByText(/Provisional Stock ID:/i)).toBeInTheDocument();
    });

    it('provides accessible canonical dealer VDP link opening in new tab', () => {
      render(<VehicleListingCard {...sampleCardProps} />);
      const link = screen.getByTestId('dealer-vdp-link');
      expect(link).toHaveAttribute('href', 'https://www.jptoyotadowntown.com/inventory/new-rav4');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link).toHaveAttribute(
        'aria-label',
        'View public dealer listing for 2026 Toyota RAV4 Hybrid at Jim Pattison Toyota Downtown (opens in new tab)'
      );
    });
  });

  // ===========================================================================
  // 2. InventoryFilterBar Tests
  // ===========================================================================
  describe('InventoryFilterBar', () => {
    const defaultFilters: FilterState = {
      model: '',
      status: '',
      dealer: '',
      minPrice: '',
      maxPrice: '',
      search: '',
    };

    it('renders all facet controls with accessible ARIA labels', () => {
      const onFilterChange = vi.fn();
      render(
        <InventoryFilterBar
          filters={defaultFilters}
          onFilterChange={onFilterChange}
          totalResults={12}
        />
      );

      expect(screen.getByTestId('inventory-filter-bar')).toHaveAttribute(
        'aria-label',
        'Filter inventory listings'
      );
      expect(screen.getByTestId('filter-model-select')).toHaveAttribute(
        'aria-label',
        'Filter by vehicle model'
      );
      expect(screen.getByTestId('filter-status-select')).toHaveAttribute(
        'aria-label',
        'Filter by observed status'
      );
      expect(screen.getByTestId('filter-dealer-select')).toHaveAttribute(
        'aria-label',
        'Filter by dealership'
      );
      expect(screen.getByTestId('filter-min-price-input')).toHaveAttribute(
        'aria-label',
        'Minimum advertised price in Canadian dollars'
      );
      expect(screen.getByTestId('filter-max-price-input')).toHaveAttribute(
        'aria-label',
        'Maximum advertised price in Canadian dollars'
      );
      expect(screen.getByTestId('filter-search-input')).toHaveAttribute(
        'aria-label',
        'Search by trim, color or VIN'
      );
      expect(screen.getByTestId('filter-results-count')).toHaveTextContent('12 units observed');
    });

    it('triggers onFilterChange when model is selected', () => {
      const onFilterChange = vi.fn();
      render(
        <InventoryFilterBar filters={defaultFilters} onFilterChange={onFilterChange} />
      );

      fireEvent.change(screen.getByTestId('filter-model-select'), {
        target: { value: 'Sienna' },
      });

      expect(onFilterChange).toHaveBeenCalledWith({
        ...defaultFilters,
        model: 'Sienna',
      });
    });

    it('triggers onFilterChange when status is changed', () => {
      const onFilterChange = vi.fn();
      render(
        <InventoryFilterBar filters={defaultFilters} onFilterChange={onFilterChange} />
      );

      fireEvent.change(screen.getByTestId('filter-status-select'), {
        target: { value: 'Incoming availability unconfirmed' },
      });

      expect(onFilterChange).toHaveBeenCalledWith({
        ...defaultFilters,
        status: 'Incoming availability unconfirmed',
      });
    });

    it('shows and executes Clear Filters reset button when filters are active', () => {
      const onFilterChange = vi.fn();
      const activeFilters: FilterState = {
        ...defaultFilters,
        model: 'RAV4 Hybrid',
      };

      render(
        <InventoryFilterBar filters={activeFilters} onFilterChange={onFilterChange} />
      );

      const resetBtn = screen.getByTestId('reset-filters-btn');
      expect(resetBtn).toBeInTheDocument();

      fireEvent.click(resetBtn);

      expect(onFilterChange).toHaveBeenCalledWith(defaultFilters);
    });
  });

  // ===========================================================================
  // 3. CoverageDisclosureBanner Tests
  // ===========================================================================
  describe('CoverageDisclosureBanner', () => {
    it('renders pilot scope and platform transparency badge', () => {
      render(<CoverageDisclosureBanner />);

      expect(
        screen.getByText(/Pilot Discovery Scope: BC Lower Mainland/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Convertus Platform Pilot/i)).toBeInTheDocument();
      expect(
        screen.getByText(/In accordance with Master Plan V3.2 safeguards/i)
      ).toBeInTheDocument();
    });

    it('expands dealer status panel to reveal validated and coverage-limited dealers', () => {
      render(<CoverageDisclosureBanner />);

      // Details panel initially closed
      expect(screen.queryByTestId('coverage-details-panel')).not.toBeInTheDocument();

      const toggleBtn = screen.getByTestId('toggle-coverage-details-btn');
      fireEvent.click(toggleBtn);

      // Details panel open
      expect(screen.getByTestId('coverage-details-panel')).toBeInTheDocument();

      // Jim Pattison Downtown: Gate 1 PASS
      expect(screen.getByText('Jim Pattison Downtown')).toBeInTheDocument();
      expect(screen.getByText('Gate 1 PASS')).toBeInTheDocument();
      expect(screen.getByText(/Convertus VMS/i)).toBeInTheDocument();

      // OpenRoad Richmond: Limitation
      expect(screen.getByText('OpenRoad Richmond')).toBeInTheDocument();
      expect(screen.getByText(/HTTP Basic auth/i)).toBeInTheDocument();

      // Granville Toyota: Limitation
      expect(screen.getByText('Granville Toyota')).toBeInTheDocument();
      expect(screen.getByText(/Cloudflare WAF Managed Challenge/i)).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // 4. InventoryExplorer Integration Tests
  // ===========================================================================
  describe('InventoryExplorer Integration', () => {
    it('filters listings interactively by model', () => {
      render(<InventoryExplorer />);

      // Initially renders RAV4, Sienna, Grand Highlander, Tacoma cards
      expect(screen.getByTestId('listing-card-jp-rav4-xse-01')).toBeInTheDocument();
      expect(screen.getByTestId('listing-card-jp-sienna-ltd-02')).toBeInTheDocument();

      // Select 'Sienna'
      fireEvent.change(screen.getByTestId('filter-model-select'), {
        target: { value: 'Sienna' },
      });

      // Now only Sienna is visible, RAV4 card is filtered out
      expect(screen.getByTestId('listing-card-jp-sienna-ltd-02')).toBeInTheDocument();
      expect(screen.queryByTestId('listing-card-jp-rav4-xse-01')).not.toBeInTheDocument();
    });

    it('displays empty state when no listings match active filter criteria', () => {
      render(<InventoryExplorer />);

      // Search non-existent keyword
      fireEvent.change(screen.getByTestId('filter-search-input'), {
        target: { value: 'NonExistentModel9988' },
      });

      expect(screen.getByTestId('no-results-message')).toBeInTheDocument();
      expect(screen.getByText(/No matching listings observed/i)).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // 5. Dedicated /inventory Route & Feature Flag Tests
  // ===========================================================================
  describe('/inventory Route Feature Flagging', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    it('renders full inventory discovery interface when feature flag is enabled', () => {
      process.env.NEXT_PUBLIC_ENABLE_INVENTORY_DISCOVERY = 'true';
      render(<InventoryPage />);

      expect(screen.getByTestId('inventory-page-main')).toBeInTheDocument();
      expect(screen.getByText(/Toyota Public Inventory Explorer/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Public Observation Feed — Physical Availability NOT Confirmed With Dealer/i)
      ).toBeInTheDocument();
    });

    it('renders gated preview screen when feature flag is explicitly disabled', () => {
      delete process.env.NEXT_PUBLIC_ENABLE_INVENTORY_DISCOVERY;
      delete process.env.ENABLE_INVENTORY_DISCOVERY;
      // Temporarily override NODE_ENV for test
      (process.env as any).NODE_ENV = 'production';

      render(<InventoryPage />);

      expect(screen.getByTestId('inventory-disabled-screen')).toBeInTheDocument();
      expect(
        screen.getByText(/Inventory Discovery \(Private Pilot\)/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Return to Wait Time Tracker/i)).toBeInTheDocument();
    });
  });
});
