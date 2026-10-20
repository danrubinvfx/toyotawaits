/**
 * tests/discovery/ui-components.test.tsx
 *
 * Sprint 5: UI Integration & Search/Filter Components Tests
 * Master Plan V3.2 Page 4, Section 2 & 3
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
import { InventoryGearCard } from '@/components/discovery/InventoryGearCard';
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
    vdpUrl: 'https://www.jptoyota-downtown.com/inventory/new-rav4',
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

    it('enforces typographic title hierarchy: model over trim on separate line', () => {
      render(
        <VehicleListingCard
          {...sampleCardProps}
          make="Toyota"
          model="RAV4 Hybrid"
          trim="XSE Technology Package AWD"
          modelYear={2026}
        />
      );

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('2026 Toyota RAV4 Hybrid');
      expect(heading).toHaveClass('text-lg', 'font-bold', 'text-white', 'tracking-tight');

      const secondary = screen.getByText('XSE Technology Package AWD');
      expect(secondary).toHaveClass('text-sm', 'font-medium', 'text-neutral-400');
    });

    it('prevents redundant string concatenations if drivetrain or hybrid is already in model', () => {
      render(
        <VehicleListingCard
          {...sampleCardProps}
          make="Toyota"
          model="RAV4 Hybrid"
          trim="Hybrid XSE AWD"
          driveTrain="All Wheel Drive"
        />
      );

      // Model already has Hybrid, trim starts with Hybrid -> strips redundant "Hybrid"
      // Trim already has AWD -> All Wheel Drive is not duplicated
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('2026 Toyota RAV4 Hybrid');
      expect(screen.getByText('XSE AWD')).toBeInTheDocument();
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
      expect(link).toHaveAttribute('href', 'https://www.jptoyota-downtown.com/inventory/new-rav4');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link).toHaveAttribute(
        'aria-label',
        'View public dealer listing for 2026 Toyota RAV4 Hybrid at Jim Pattison Toyota Downtown (opens in new tab)'
      );
    });

    it('falls back to dealer inventory search URL when vdpUrl is dead /new-vehicles/ placeholder', () => {
      render(
        <VehicleListingCard
          {...sampleCardProps}
          vdpUrl="https://www.jptoyotadowntown.com/new-vehicles/"
          vin="JTDACAAJ0T3038212"
        />
      );
      const link = screen.getByTestId('dealer-vdp-link');
      expect(link).toHaveAttribute(
        'href',
        'https://www.jptoyota-downtown.com/vehicles/new/?keyword=JTDACAAJ0T3038212'
      );
    });

    it('falls back to dealer inventory search URL when vdpUrl is omitted', () => {
      render(
        <VehicleListingCard
          {...sampleCardProps}
          vdpUrl={null}
          stockNumber="T26-1044"
        />
      );
      const link = screen.getByTestId('dealer-vdp-link');
      expect(link).toHaveAttribute(
        'href',
        'https://www.jptoyota-downtown.com/vehicles/new/?keyword=2T3P1RFV5TC123456'
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
      location: '',
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
      expect(screen.getByTestId('filter-location-select')).toHaveAttribute(
        'aria-label',
        'Filter by location'
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

    it('supports toggling mobile filter tray expansion', () => {
      const onFilterChange = vi.fn();
      render(
        <InventoryFilterBar filters={defaultFilters} onFilterChange={onFilterChange} />
      );

      const toggleBtn = screen.getByTestId('toggle-filters-btn');
      const tray = screen.getByTestId('collapsible-filter-tray');

      // Initially collapsed on mobile
      expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
      expect(tray.className).toContain('hidden');

      // Tap to expand
      fireEvent.click(toggleBtn);
      expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
      expect(tray.className).toContain('block');

      // Tap to collapse
      fireEvent.click(toggleBtn);
      expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
      expect(tray.className).toContain('hidden');
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

      // Pilot dealers: Gate 1 PASS
      expect(screen.getByText('Jim Pattison Downtown')).toBeInTheDocument();
      expect(screen.getByText('Jim Pattison Surrey')).toBeInTheDocument();
      expect(screen.getByText('West Coast Toyota')).toBeInTheDocument();
      expect(screen.getAllByText('Gate 1 PASS').length).toBe(3);
      expect(screen.getAllByText(/Convertus VMS/i).length).toBe(3);

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
    beforeEach(() => {
      process.env.NEXT_PUBLIC_ENABLE_INVENTORY_DISCOVERY = 'true';
    });

    it('filters listings interactively by model', () => {
      render(<InventoryExplorer />);

      // Initially renders RAV4, Sienna, Grand Highlander, Tacoma, Prius Prime cards
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

    it('dynamically populates Downtown, Surrey, and Pitt Meadows location options and filters listings by region', () => {
      render(<InventoryExplorer />);

      const locationSelect = screen.getByTestId('filter-location-select');
      expect(screen.getByRole('option', { name: 'Vancouver (Downtown)' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Surrey (Guildford)' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Pitt Meadows (West Coast)' })).toBeInTheDocument();

      // Filter by Surrey
      fireEvent.change(locationSelect, {
        target: { value: 'Surrey' },
      });

      expect(screen.getByTestId('listing-card-jp-surrey-rav4-01')).toBeInTheDocument();
      expect(screen.getByTestId('listing-card-jp-surrey-sienna-02')).toBeInTheDocument();
      expect(screen.queryByTestId('listing-card-jp-rav4-xse-01')).not.toBeInTheDocument();
      expect(screen.queryByTestId('listing-card-jp-grand-highlander-03')).not.toBeInTheDocument();
      expect(screen.queryByTestId('listing-card-wc-toyota-prius-01')).not.toBeInTheDocument();

      // Filter by Pitt Meadows
      fireEvent.change(locationSelect, {
        target: { value: 'Pitt Meadows' },
      });

      expect(screen.getByTestId('listing-card-wc-toyota-prius-01')).toBeInTheDocument();
      expect(screen.queryByTestId('listing-card-jp-rav4-xse-01')).not.toBeInTheDocument();
      expect(screen.queryByTestId('listing-card-jp-surrey-rav4-01')).not.toBeInTheDocument();

      // Filter by Vancouver
      fireEvent.change(locationSelect, {
        target: { value: 'Vancouver' },
      });

      expect(screen.getByTestId('listing-card-jp-rav4-xse-01')).toBeInTheDocument();
      expect(screen.getByTestId('listing-card-jp-sienna-ltd-02')).toBeInTheDocument();
      expect(screen.queryByTestId('listing-card-jp-surrey-rav4-01')).not.toBeInTheDocument();
      expect(screen.queryByTestId('listing-card-jp-surrey-sienna-02')).not.toBeInTheDocument();
      expect(screen.queryByTestId('listing-card-wc-toyota-prius-01')).not.toBeInTheDocument();
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

    it('interleaves delivery day gear strips every 2 vehicle listings', () => {
      render(<InventoryExplorer />);

      // Initial sample listings has 6 listings: item 0, 1, 2, 3, 4, 5
      // Gear cards should be interleaved after item 1, 3, 5 (Math.floor(6 / 2) = 3)
      const gearCards = screen.getAllByTestId('inventory-gear-card');
      expect(gearCards.length).toBe(3); // floor(6 / 2) = 3

      // Verify outbound links use toyotawaits-20
      const links = screen.getAllByTestId('gear-strip-action-btn');
      expect(links.length).toBe(3);
      expect(links[0].getAttribute('href')).toContain('tag=toyotawaits-20');
      expect(links[0]).toHaveAttribute('target', '_blank');
      expect(links[0]).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('updates gear card model context when model filter is selected', () => {
      render(<InventoryExplorer />);

      // Select 'RAV4'
      fireEvent.change(screen.getByTestId('filter-model-select'), {
        target: { value: 'RAV4 Hybrid' },
      });

      // Filtered to RAV4 listings
      const gearCard = screen.queryByTestId('inventory-gear-card');
      if (gearCard) {
        expect(screen.getByText(/DELIVERY ESSENTIAL • RAV4 HYBRID/i)).toBeInTheDocument();
      }
    });

    it('initializes with model pre-filtered when initialModel prop is provided', () => {
      render(<InventoryExplorer initialModel="RAV4 Plug-in Hybrid" />);

      // Pre-filtered: RAV4 Plug-in Hybrid is visible, others are filtered out
      expect(screen.getByTestId('listing-card-jp-surrey-rav4-01')).toBeInTheDocument();
      expect(screen.queryByTestId('listing-card-jp-rav4-xse-01')).not.toBeInTheDocument();
      expect(screen.queryByTestId('listing-card-jp-sienna-ltd-02')).not.toBeInTheDocument();

      const modelSelect = screen.getByTestId('filter-model-select') as HTMLSelectElement;
      expect(modelSelect.value).toBe('RAV4 Plug-in Hybrid');
    });

    it('pre-filters inventory from URL searchParams in InventoryPage', () => {
      process.env.NEXT_PUBLIC_ENABLE_INVENTORY_DISCOVERY = 'true';
      render(<InventoryPage searchParams={{ model: 'RAV4 Plug-in Hybrid' }} />);

      expect(screen.getByTestId('listing-card-jp-surrey-rav4-01')).toBeInTheDocument();
      expect(screen.queryByTestId('listing-card-jp-sienna-ltd-02')).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // 4b. InventoryGearCard Unit Tests
  // ===========================================================================
  describe('InventoryGearCard Unit Tests', () => {
    const sampleAccessory = {
      id: 'all-weather-floor-liners',
      title: 'Custom-Fit All-Weather Floor Liners & Cargo Mat',
      category: 'protection' as const,
      description: 'High-wall laser-measured TPE rubber floor liners.',
      estimatedPriceCad: '$120 – $189 CAD',
      url: 'https://www.amazon.ca/s?k=Toyota+floor+mats&tag=toyotawaits-20',
      applicableModels: ['RAV4', 'universal'],
      badge: 'Essential',
    };

    it('renders compact gear strip with title, model context subtitle, price, and affiliate action', () => {
      render(
        <InventoryGearCard item={sampleAccessory} modelContext="RAV4 Hybrid" />
      );

      expect(screen.getByTestId('inventory-gear-card')).toBeInTheDocument();
      expect(
        screen.getByText('Custom-Fit All-Weather Floor Liners & Cargo Mat')
      ).toBeInTheDocument();
      expect(
        screen.getByText(/DELIVERY ESSENTIAL • RAV4 HYBRID/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText('Complete front, rear & trunk spill protection tailored for Canadian winters.')
      ).toBeInTheDocument();
      expect(screen.getAllByText('$120 – $189 CAD').length).toBeGreaterThan(0);
      expect(screen.getByText('Verified Amazon affiliate link')).toBeInTheDocument();
      expect(screen.getAllByText('Essential').length).toBeGreaterThan(0);

      const actionBtn = screen.getByTestId('gear-strip-action-btn');
      expect(actionBtn).toHaveTextContent(/Check Price/i);
      expect(actionBtn).toHaveAttribute(
        'href',
        'https://www.amazon.ca/s?k=Toyota+floor+mats&tag=toyotawaits-20'
      );
      expect(actionBtn).toHaveAttribute('target', '_blank');
      expect(actionBtn).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders fallback universal subtitle when modelContext is omitted', () => {
      render(<InventoryGearCard item={sampleAccessory} />);

      expect(
        screen.getByText(/DELIVERY ESSENTIAL • UNIVERSAL/i)
      ).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // 5. Dedicated /inventory Route & Feature Flag Tests
  // ===========================================================================
  describe('/inventory Route Feature Flagging', () => {
    const originalEnv = { ...process.env };

    beforeEach(() => {
      process.env = { ...originalEnv };
      delete process.env.NEXT_PUBLIC_ENABLE_INVENTORY_DISCOVERY;
      delete process.env.ENABLE_INVENTORY_DISCOVERY;
      delete process.env.VERCEL_ENV;
      delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    });

    afterEach(() => {
      process.env = { ...originalEnv };
    });

    it('renders full inventory discovery interface when feature flag is enabled', () => {
      process.env.NEXT_PUBLIC_ENABLE_INVENTORY_DISCOVERY = 'true';
      render(<InventoryPage />);

      expect(screen.getByTestId('inventory-page-main')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1, name: /Toyota Public Inventory/i })).toBeInTheDocument();
      expect(screen.getByTestId('unconfirmed-feed-badge')).toBeInTheDocument();
      expect(screen.getByText(/Unconfirmed Dealer Feed/i)).toBeInTheDocument();
    });

    it('renders gated preview screen when feature flags and overrides are absent', () => {
      render(<InventoryPage />);

      expect(screen.getByTestId('inventory-disabled-screen')).toBeInTheDocument();
      expect(
        screen.getByText(/Inventory Discovery \(Private Pilot\)/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Return to Wait Time Tracker/i)).toBeInTheDocument();
    });

    it('renders full inventory discovery interface when VERCEL_ENV === "preview"', () => {
      process.env.VERCEL_ENV = 'preview';

      render(<InventoryPage />);

      expect(screen.getByTestId('inventory-page-main')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1, name: /Toyota Public Inventory/i })).toBeInTheDocument();
    });

    it('renders full inventory discovery interface when URL query parameter ?preview=true is present', () => {
      render(<InventoryPage searchParams={{ preview: 'true' }} />);

      expect(screen.getByTestId('inventory-page-main')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1, name: /Toyota Public Inventory/i })).toBeInTheDocument();
    });
  });
});
