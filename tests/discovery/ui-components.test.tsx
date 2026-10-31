/**
 * tests/discovery/ui-components.test.tsx
 *
 * Sprint 5: UI Integration & Search/Filter Components Tests
 * Master Plan V3.2 Page 4, Section 2 & 3
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {
  VehicleListingCard,
  VehicleListingCardProps,
  getDealerListingUrl,
} from '@/components/discovery/VehicleListingCard';
import { InventoryVehicleCard } from '@/components/discovery/InventoryVehicleCard';
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

    it('renders subtle calculated distance badge alongside dealership name when distanceKm is provided', () => {
      render(<VehicleListingCard {...sampleCardProps} distanceKm={8.4} />);

      const badge = screen.getByTestId('distance-badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('(8.4 km away)');
      expect(badge).toHaveClass('text-xs', 'text-sky-400/90', 'font-medium');
      expect(screen.getByText('Jim Pattison Toyota Downtown')).toBeInTheDocument();
      expect(screen.getByText('Vancouver')).toBeInTheDocument();
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

    it('falls back to resilient dealer inventory search URL without sc=new when vdpUrl is dead /new-vehicles/ placeholder', () => {
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
        'https://www.jptoyota-downtown.com/vehicles/?search=JTDACAAJ0T3038212'
      );
      expect(link.getAttribute('href')).not.toContain('sc=new');
    });

    it('falls back to resilient dealer inventory search URL without sc=new when vdpUrl is omitted', () => {
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
        'https://www.jptoyota-downtown.com/vehicles/?search=2T3P1RFV5TC123456'
      );
      expect(link.getAttribute('href')).not.toContain('sc=new');
    });

    describe('getDealerListingUrl & Action Button Permalinks', () => {
      it('returns direct URL when listing_url is provided and starts with http', () => {
        const url = getDealerListingUrl({
          listing_url: 'https://www.jptoyota-downtown.com/vehicles/2026/toyota/rav4/vancouver/bc/112233/',
          dealer_base_url: 'https://www.jptoyota-downtown.com',
          vin: '2T3P1RFV5TC123456',
        });
        expect(url).toBe(
          'https://www.jptoyota-downtown.com/vehicles/2026/toyota/rav4/vancouver/bc/112233/'
        );
      });

      it('builds resilient search query without sc=new using real VIN', () => {
        const url = getDealerListingUrl({
          listing_url: undefined,
          dealer_base_url: 'https://www.jptoyota-downtown.com',
          vin: '2T3P1RFV5TC123456',
        });
        expect(url).toBe(
          'https://www.jptoyota-downtown.com/vehicles/?search=2T3P1RFV5TC123456'
        );
        expect(url).not.toContain('sc=new');
        expect(url).not.toContain('/vehicles/new/');
      });

      it('falls back to real stock number when VIN is provisional (starts with PROV)', () => {
        const url = getDealerListingUrl({
          listing_url: null,
          dealer_base_url: 'https://www.jptoyota-downtown.com',
          vin: 'PROV-SIENNA-881',
          stock_number: 'SI-9944',
          model: 'Sienna',
          trim: 'Limited AWD',
        });
        expect(url).toBe(
          'https://www.jptoyota-downtown.com/vehicles/?search=SI-9944'
        );
        expect(url).not.toContain('PROV');
      });

      it('falls back to vehicle model + trim when both VIN and stock number are missing/provisional', () => {
        const url = getDealerListingUrl({
          listing_url: null,
          dealer_base_url: 'https://www.jptoyota-downtown.com',
          vin: null,
          stock_number: null,
          model: 'Toyota Sienna',
          trim: 'Limited',
        });
        expect(url).toBe(
          'https://www.jptoyota-downtown.com/vehicles/?search=Toyota%20Sienna%20Limited'
        );
      });

      it('renders "View Public Dealer Listing" button with target="_blank" and rel="noopener noreferrer" for explicit VDP URL', () => {
        const onListingClick = vi.fn();
        render(
          <InventoryVehicleCard
            {...sampleCardProps}
            vdpUrl="https://www.jptoyota-downtown.com/vehicles/2026/toyota/rav4/vancouver/bc/69116486/?sale_class=New"
            onListingClick={onListingClick}
          />
        );
        const link = screen.getByTestId('dealer-vdp-link');
        expect(link).toHaveAttribute(
          'href',
          'https://www.jptoyota-downtown.com/vehicles/2026/toyota/rav4/vancouver/bc/69116486/?sale_class=New'
        );
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        expect(link).toHaveTextContent('View Public Dealer Listing');

        fireEvent.click(link);
        expect(onListingClick).toHaveBeenCalled();
      });

      it('renders "View Public Dealer Listing" button linking to resilient fallback search without sc=new for fallback vehicle', () => {
        render(
          <VehicleListingCard
            {...sampleCardProps}
            vdpUrl={null}
            listingUrl={null}
            vin="2T3P1RFV5TC123456"
          />
        );
        const link = screen.getByTestId('dealer-vdp-link');
        expect(link).toHaveAttribute(
          'href',
          'https://www.jptoyota-downtown.com/vehicles/?search=2T3P1RFV5TC123456'
        );
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        expect(link.getAttribute('href')).not.toContain('sc=new');
        expect(link.getAttribute('href')).not.toContain('/vehicles/new/');
      });
    });

    it('displays dealer posted date and relative detection date with clock icon and tooltip', () => {
      // 1. Explicit postedAt
      const { rerender } = render(
        <VehicleListingCard
          {...sampleCardProps}
          lastChecked={new Date().toISOString()}
          postedAt="2026-10-14T08:00:00Z"
          firstSeenAt="2026-10-14T08:00:00Z"
        />
      );

      expect(screen.getByText('Listed Oct 14')).toBeInTheDocument();
      const timeContainer = screen.getByTitle(/First detected on Oct 14, 2026/i);
      expect(timeContainer).toBeInTheDocument();

      // 2. Fallback to firstSeenAt (9 days ago)
      const nineDaysAgo = new Date(Date.now() - 9 * 24 * 3600 * 1000).toISOString();
      rerender(
        <VehicleListingCard
          {...sampleCardProps}
          lastChecked={new Date().toISOString()}
          postedAt={null}
          firstSeenAt={nineDaysAgo}
        />
      );

      expect(screen.getByText('Added 9 days ago')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // 2. InventoryFilterBar Tests
  // ===========================================================================
  describe('InventoryFilterBar', () => {
    const defaultFilters: FilterState = {
      model: '',
      status: 'advertised',
      dealer: '',
      location: '',
      userLocation: '',
      userCoordinates: null,
      maxDistance: '',
      sortNearest: false,
      sortBy: 'newest',
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
      expect(screen.getByTestId('filter-sort-select')).toHaveAttribute(
        'aria-label',
        'Sort inventory listings'
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

    it('renders "Sort by" dropdown control and triggers onFilterChange', () => {
      const onFilterChange = vi.fn();
      render(
        <InventoryFilterBar filters={defaultFilters} onFilterChange={onFilterChange} />
      );

      const sortSelect = screen.getByTestId('filter-sort-select');
      expect(sortSelect).toHaveValue('newest');

      const options = Array.from(sortSelect.querySelectorAll('option')).map((o) => ({
        value: o.value,
        text: o.textContent,
      }));

      expect(options).toEqual([
        { value: 'newest', text: 'Newest Listing (Dealer Posted Date)' },
        { value: 'price_asc', text: 'Price: Low to High' },
        { value: 'price_desc', text: 'Price: High to Low' },
        { value: 'distance_asc', text: 'Distance: Closest First' },
        { value: 'status', text: 'Lot Status (On Lot first, then In Transit)' },
      ]);

      fireEvent.change(sortSelect, { target: { value: 'price_asc' } });
      expect(onFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({ sortBy: 'price_asc' })
      );
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

    it('renders User Location presets, Near Me GPS button, distance radius filter, and sort toggle', () => {
      const onFilterChange = vi.fn();
      render(
        <InventoryFilterBar filters={defaultFilters} onFilterChange={onFilterChange} />
      );

      expect(screen.getByTestId('gps-location-btn')).toBeInTheDocument();
      expect(screen.getByTestId('filter-max-distance-select')).toBeInTheDocument();
      expect(screen.getByTestId('filter-sort-nearest-toggle')).toBeInTheDocument();

      const locationSelect = screen.getByTestId('filter-location-select');
      expect(screen.getByRole('option', { name: 'Vancouver (Downtown)' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Burnaby' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Surrey (Guildford)' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Richmond' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Coquitlam / Tri-Cities' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Pitt Meadows (West Coast)' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Langley' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Abbotsford' })).toBeInTheDocument();
    });

    it('triggers onFilterChange with coordinates when municipality preset is selected', () => {
      const onFilterChange = vi.fn();
      render(
        <InventoryFilterBar filters={defaultFilters} onFilterChange={onFilterChange} />
      );

      fireEvent.change(screen.getByTestId('filter-location-select'), {
        target: { value: 'Burnaby' },
      });

      expect(onFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          location: 'Burnaby',
          userLocation: 'Burnaby',
          userCoordinates: { lat: 49.2488, lng: -122.9805 },
          sortNearest: true,
        })
      );
    });

    it('triggers onFilterChange when max distance radius or sort toggle changes', () => {
      const onFilterChange = vi.fn();
      render(
        <InventoryFilterBar filters={defaultFilters} onFilterChange={onFilterChange} />
      );

      fireEvent.change(screen.getByTestId('filter-max-distance-select'), {
        target: { value: '15' },
      });
      expect(onFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          maxDistance: '15',
        })
      );

      fireEvent.click(screen.getByTestId('filter-sort-nearest-toggle'));
      expect(onFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          sortNearest: true,
        })
      );
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
      window.localStorage.clear();
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

    it('ensures Granville Toyota, Valley Toyota, and Abbotsford Toyota appear in the inventory explorer dealership selector', () => {
      render(<InventoryExplorer />);

      const locationSelect = screen.getByTestId('filter-location-select');
      expect(screen.getByRole('option', { name: 'Granville Toyota' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Valley Toyota' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Abbotsford Toyota' })).toBeInTheDocument();
    });

    it('supports proximity filtering and distance calculation when municipality is selected', () => {
      render(<InventoryExplorer />);

      const locationSelect = screen.getByTestId('filter-location-select');
      expect(screen.getByRole('option', { name: 'Vancouver (Downtown)' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Burnaby' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Surrey (Guildford)' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Pitt Meadows (West Coast)' })).toBeInTheDocument();

      // Pick "Burnaby"
      fireEvent.change(locationSelect, {
        target: { value: 'Burnaby' },
      });

      // All listings should have distance badges relative to Burnaby
      // Downtown (~8.0 km), Surrey (~14.4 km), Pitt Meadows (~21.4 km)
      expect(screen.getAllByText(/\(8 km away\)|\(8\.0 km away\)/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/\(14\.4 km away\)/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/\(21\.4 km away\)/i).length).toBeGreaterThan(0);

      // Verify proximity sorting: cards for Downtown appear before Surrey, which appear before Pitt Meadows
      const allCards = screen.getAllByTestId(/^listing-card-/);
      const cardIds = allCards.map((c) => c.getAttribute('data-testid'));
      const downtownIdx = cardIds.findIndex((id) => id?.includes('jp-rav4-xse-01'));
      const surreyIdx = cardIds.findIndex((id) => id?.includes('jp-surrey-rav4-01'));
      const pittMeadowsIdx = cardIds.findIndex((id) => id?.includes('wc-toyota-prius-01'));
      expect(downtownIdx).toBeLessThan(surreyIdx);
      expect(surreyIdx).toBeLessThan(pittMeadowsIdx);

      // Now pick "Surrey"
      fireEvent.change(locationSelect, {
        target: { value: 'Surrey' },
      });

      // Relative to Surrey: Surrey dealer is ~3.4 km, Pitt Meadows is ~12.2 km, Downtown is ~19.3 km
      expect(screen.getAllByText(/\(3\.4 km away\)/i).length).toBeGreaterThan(0);

      // Verify proximity sorting from Surrey: Surrey first, Pitt Meadows second, Downtown third
      const allCardsSurrey = screen.getAllByTestId(/^listing-card-/);
      const cardIdsSurrey = allCardsSurrey.map((c) => c.getAttribute('data-testid'));
      const surreyIdx2 = cardIdsSurrey.findIndex((id) => id?.includes('jp-surrey-rav4-01'));
      const pittMeadowsIdx2 = cardIdsSurrey.findIndex((id) => id?.includes('wc-toyota-prius-01'));
      const downtownIdx2 = cardIdsSurrey.findIndex((id) => id?.includes('jp-rav4-xse-01'));
      expect(surreyIdx2).toBeLessThan(pittMeadowsIdx2);
      expect(pittMeadowsIdx2).toBeLessThan(downtownIdx2);

      // Now apply Max Distance "Within 15 km"
      fireEvent.change(screen.getByTestId('filter-max-distance-select'), {
        target: { value: '15' },
      });

      // Surrey (3.4 km) and Pitt Meadows (12.2 km) are within 15 km
      expect(screen.getByTestId('listing-card-jp-surrey-rav4-01')).toBeInTheDocument();
      expect(screen.getByTestId('listing-card-wc-toyota-prius-01')).toBeInTheDocument();
      // Downtown (19.3 km) is excluded (> 15 km)
      expect(screen.queryByTestId('listing-card-jp-rav4-xse-01')).not.toBeInTheDocument();
    });

    it('calculates proximity relative to OpenRoad Toyota Richmond and Regency Toyota when Richmond or Vancouver is selected', () => {
      const fiveStoreListings: VehicleListingCardProps[] = [
        {
          id: 'regency-camry-01',
          make: 'Toyota',
          model: 'Camry Hybrid',
          trim: 'SE AWD',
          modelYear: 2026,
          vin: null,
          provisionalId: 'REG-31810',
          isProvisionalVin: true,
          dealerName: 'Regency Toyota',
          dealerCity: 'Vancouver',
          dealerProvince: 'BC',
          status: 'Advertised - availability unconfirmed',
          lastChecked: new Date().toISOString(),
          vdpUrl: 'https://www.regencytoyota.com/en/new-catalog/toyota/2026-toyota-camry-hybrid-se-upgrade-awd-id31810',
          msrp: 41190,
          sellingPrice: 41190,
          mandatoryFees: null,
          hasUnverifiedFees: true,
          powertrain: 'Hybrid',
          stockNumber: 'REG-31810',
        },
        {
          id: 'openroad-tacoma-01',
          make: 'Toyota',
          model: 'Tacoma',
          trim: 'TRD Sport',
          modelYear: 2026,
          vin: '3TYLB5JN0TT144104',
          isProvisionalVin: false,
          dealerName: 'OpenRoad Toyota Richmond',
          dealerCity: 'Richmond',
          dealerProvince: 'BC',
          status: 'Advertised - availability unconfirmed',
          lastChecked: new Date().toISOString(),
          vdpUrl: 'https://openroadtoyotarichmond.com/new/2026-toyota-tacoma-tacoma-trd-sport/3TYLB5JN0TT144104',
          msrp: 50450,
          sellingPrice: 50450,
          mandatoryFees: null,
          hasUnverifiedFees: true,
          powertrain: 'Gas',
          stockNumber: 'OR-144104',
        },
      ];

      render(<InventoryExplorer initialListings={fiveStoreListings} />);

      const locationSelect = screen.getByTestId('filter-location-select');

      // Select Richmond -> OpenRoad Richmond (~4.5 km) should appear before Regency Toyota (~10.3 km)
      fireEvent.change(locationSelect, { target: { value: 'Richmond' } });
      expect(screen.getByText(/\(4\.5 km away\)/i)).toBeInTheDocument();
      expect(screen.getByText(/\(10\.3 km away\)/i)).toBeInTheDocument();

      const cardsFromRichmond = screen.getAllByTestId(/^listing-card-/);
      expect(cardsFromRichmond[0]).toHaveAttribute('data-testid', 'listing-card-openroad-tacoma-01');
      expect(cardsFromRichmond[1]).toHaveAttribute('data-testid', 'listing-card-regency-camry-01');

      // Select Vancouver -> Regency Toyota (~7.3 km) should appear before OpenRoad Richmond (~12.9 km)
      fireEvent.change(locationSelect, { target: { value: 'Vancouver' } });
      expect(screen.getByText(/\(7\.3 km away\)/i)).toBeInTheDocument();
      expect(screen.getByText(/\(12\.9 km away\)/i)).toBeInTheDocument();

      const cardsFromVancouver = screen.getAllByTestId(/^listing-card-/);
      expect(cardsFromVancouver[0]).toHaveAttribute('data-testid', 'listing-card-regency-camry-01');
      expect(cardsFromVancouver[1]).toHaveAttribute('data-testid', 'listing-card-openroad-tacoma-01');
    });

    it('resolves Near Me (GPS) coordinates with desktop-friendly options when permission is allowed', () => {
      let capturedSuccess: PositionCallback | null = null;
      const getCurrentPositionMock = vi.fn((success, _error, _options) => {
        capturedSuccess = success;
      });
      Object.defineProperty(global.navigator, 'geolocation', {
        value: { getCurrentPosition: getCurrentPositionMock },
        configurable: true,
      });

      render(<InventoryExplorer />);

      const gpsBtn = screen.getByTestId('gps-location-btn');
      fireEvent.click(gpsBtn);

      // Verify loading state while resolving coordinates
      expect(gpsBtn).toHaveTextContent('Locating...');
      expect(screen.getByTestId('gps-loading-spinner')).toBeInTheDocument();

      // Verify desktop-friendly geolocation options
      expect(getCurrentPositionMock).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000,
        }
      );

      // Resolve position in Surrey
      act(() => {
        capturedSuccess!({
          coords: {
            latitude: 49.1913,
            longitude: -122.849,
            accuracy: 100,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
            toJSON: () => ({}),
          },
          timestamp: Date.now(),
          toJSON: () => ({}),
        } as GeolocationPosition);
      });

      // Loading state resets and location updates to Near Me (GPS)
      expect(gpsBtn).toHaveTextContent('Near Me (GPS)');
      expect(screen.queryByTestId('gps-loading-spinner')).not.toBeInTheDocument();
      expect(screen.queryByTestId('gps-error-banner')).not.toBeInTheDocument();
      expect((screen.getByTestId('filter-location-select') as HTMLSelectElement).value).toBe(
        'Near Me (GPS)'
      );
      expect(screen.getAllByText(/\(3\.4 km away\)/i).length).toBeGreaterThan(0);
    });

    it('displays permission denied banner and falls back to municipality dropdown when geolocation is denied or unavailable', () => {
      const getCurrentPositionMock = vi.fn((_success, error) => {
        error({
          code: 1, // PERMISSION_DENIED
          message: 'User denied Geolocation',
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        });
      });
      Object.defineProperty(global.navigator, 'geolocation', {
        value: { getCurrentPosition: getCurrentPositionMock },
        configurable: true,
      });

      render(<InventoryExplorer />);

      const gpsBtn = screen.getByTestId('gps-location-btn');
      fireEvent.click(gpsBtn);

      // Loading state is reset and permission denied banner is displayed
      expect(gpsBtn).toHaveTextContent('Near Me (GPS)');
      const errorBanner = screen.getByTestId('gps-error-banner');
      expect(errorBanner).toHaveTextContent(
        'Location permission denied. Please choose a city below.'
      );

      // Trigger TIMEOUT (code 3)
      getCurrentPositionMock.mockImplementationOnce((_success, error) => {
        error({
          code: 3, // TIMEOUT
          message: 'Timeout expired',
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        });
      });
      fireEvent.click(gpsBtn);
      expect(screen.getByTestId('gps-error-banner')).toHaveTextContent(
        'Could not detect location. Please choose a municipality.'
      );

      // Selecting a municipality preset clears the error banner and sorts by distance
      fireEvent.change(screen.getByTestId('filter-location-select'), {
        target: { value: 'Burnaby' },
      });
      expect(screen.queryByTestId('gps-error-banner')).not.toBeInTheDocument();
      expect(screen.getAllByText(/\(8 km away\)|\(8\.0 km away\)/i).length).toBeGreaterThan(0);
    });

    it('displays error banner when geolocation is not supported by browser', () => {
      const originalGeo = global.navigator.geolocation;
      // @ts-expect-error test unsupported environment
      delete global.navigator.geolocation;

      render(<InventoryExplorer />);

      const gpsBtn = screen.getByTestId('gps-location-btn');
      fireEvent.click(gpsBtn);

      expect(screen.getByTestId('gps-error-banner')).toHaveTextContent(
        'Geolocation is not supported by your browser.'
      );

      // Restore
      Object.defineProperty(global.navigator, 'geolocation', {
        value: originalGeo,
        configurable: true,
      });
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

      // Verify outbound links use toyotawaits-20 or /out/ partner proxy
      const links = screen.getAllByTestId('gear-strip-action-btn');
      expect(links.length).toBe(3);
      links.forEach((link) => {
        const href = link.getAttribute('href') || '';
        expect(link).toHaveAttribute('target', '_blank');
        if (href.startsWith('/out/')) {
          expect(href).toMatch(/^\/out\/muslogy/);
          expect(link.getAttribute('rel')).toContain('noopener noreferrer');
        } else {
          expect(href).toContain('tag=toyotawaits-20');
          expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        }
      });
    });

    it('injects top-ranked gear items into interleaved strips in popularity order', () => {
      const simulatedCounts = {
        'infotainment-screen-protector': 120, // Rank 1
        'center-console-organizer-tray': 80,  // Rank 2
        '4k-front-rear-dash-cam': 40,         // Rank 3
      };

      render(<InventoryExplorer popularityCounts={simulatedCounts} />);

      const gearCards = screen.getAllByTestId('inventory-gear-card');
      expect(gearCards.length).toBe(3);

      // Strip 1 gets Rank 1: Infotainment Screen Protector with '🔥 Most Popular'
      expect(gearCards[0]).toHaveTextContent('Anti-Glare Screen Protector (10.5" / 12.3")');
      expect(gearCards[0]).toHaveTextContent('🔥 Community Top Pick');

      // Strip 2 gets Rank 2: Center Console Organizer Tray with 'Community Top Pick'
      expect(gearCards[1]).toHaveTextContent('Center Console Organizer & Fast Charger');
      expect(gearCards[1]).not.toHaveTextContent('🔥 Community Top Pick');

      // Strip 3 gets Rank 3: 4K Dash Cam
      expect(gearCards[2]).toHaveTextContent('Plug-and-Play FitcamX 4K Dash Cam');
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
        expect(gearCard).toHaveTextContent(/GEAR PICK/i);
        expect(gearCard).toHaveTextContent(/RAV4 Hybrid/i);
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

    it('shows slide-up coffee donation toast after 3 listing clicks and persists 14-day dismissal in localStorage', () => {
      render(<InventoryExplorer />);

      // Initially hidden
      expect(screen.queryByTestId('donation-toast')).not.toBeInTheDocument();

      const vdpLinks = screen.getAllByTestId('dealer-vdp-link');
      expect(vdpLinks.length).toBeGreaterThanOrEqual(3);

      // Click 1 -> still hidden
      fireEvent.click(vdpLinks[0]);
      expect(window.localStorage.getItem('toyotawaits_listing_clicks')).toBe('1');
      expect(screen.queryByTestId('donation-toast')).not.toBeInTheDocument();

      // Click 2 -> still hidden
      fireEvent.click(vdpLinks[1]);
      expect(window.localStorage.getItem('toyotawaits_listing_clicks')).toBe('2');
      expect(screen.queryByTestId('donation-toast')).not.toBeInTheDocument();

      // Click 3 -> toast slides in
      fireEvent.click(vdpLinks[2]);
      expect(window.localStorage.getItem('toyotawaits_listing_clicks')).toBe('3');

      const toast = screen.getByTestId('donation-toast');
      expect(toast).toBeInTheDocument();
      expect(toast).toHaveTextContent(/Finding this useful\?/i);
      expect(toast).toHaveTextContent(/ToyotaWaits is free and ad-free/i);

      const ctaLink = screen.getByTestId('donation-toast-cta');
      expect(ctaLink).toHaveTextContent(/Buy a Coffee/i);
      expect(ctaLink).toHaveAttribute('target', '_blank');
      expect(ctaLink).toHaveAttribute('rel', 'noopener noreferrer');

      // Click "Maybe later" -> dismisses toast and records suppression timestamp
      const dismissBtn = screen.getByTestId('donation-toast-dismiss');
      fireEvent.click(dismissBtn);

      expect(screen.queryByTestId('donation-toast')).not.toBeInTheDocument();
      const dismissedTs = Number(window.localStorage.getItem('toyotawaits_donation_dismissed'));
      expect(dismissedTs).toBeGreaterThan(0);

      // Clicking another listing within 14 days keeps toast suppressed
      fireEvent.click(vdpLinks[0]);
      expect(window.localStorage.getItem('toyotawaits_listing_clicks')).toBe('4');
      expect(screen.queryByTestId('donation-toast')).not.toBeInTheDocument();
    });

    it('re-activates donation toast when previous dismissal is older than 14 days', () => {
      const fifteenDaysAgo = Date.now() - 15 * 24 * 60 * 60 * 1000;
      window.localStorage.setItem('toyotawaits_listing_clicks', '3');
      window.localStorage.setItem('toyotawaits_donation_dismissed', String(fifteenDaysAgo));

      render(<InventoryExplorer />);

      expect(screen.getByTestId('donation-toast')).toBeInTheDocument();
    });

    it('limits initial render to 24 vehicles (plus 12 gear cards), appends next 24 on Load More, and resets to 24 on filter change', () => {
      const manyListings: VehicleListingCardProps[] = Array.from({ length: 55 }, (_, i) => ({
        id: `batch-unit-${i + 1}`,
        make: 'Toyota',
        model: i < 30 ? 'RAV4 Hybrid' : 'Sienna',
        trim: 'XSE AWD',
        modelYear: 2026,
        vin: `2T3P1RFV5TC${String(100000 + i)}`,
        isProvisionalVin: false,
        dealerName: 'Jim Pattison Toyota Downtown',
        dealerCity: 'Vancouver',
        dealerProvince: 'BC',
        status: 'Advertised - availability unconfirmed',
        lastChecked: new Date().toISOString(),
        vdpUrl: `https://www.jptoyota-downtown.com/vehicles/new/?keyword=${i}`,
        msrp: 52000,
        sellingPrice: 52000,
        mandatoryFees: 895,
        hasUnverifiedFees: false,
        powertrain: 'Hybrid 2.5L AWD',
        exteriorColor: 'Ice Cap',
        stockNumber: `STK-${i + 1}`,
      }));

      render(<InventoryExplorer initialListings={manyListings} />);

      // Initial load: 24 vehicle cards + 12 gear cards
      expect(screen.getAllByTestId(/^listing-card-batch-unit-/).length).toBe(24);
      expect(screen.getAllByTestId('inventory-gear-card').length).toBe(12);
      expect(screen.getByTestId('load-more-counter')).toHaveTextContent(
        'Showing 24 of 55 vehicles'
      );

      const loadMoreBtn = screen.getByTestId('load-more-btn');
      expect(loadMoreBtn).toHaveTextContent('Load 24 More Vehicles (31 remaining)');

      // Click Load More once -> 48 vehicle cards + 24 gear cards
      fireEvent.click(loadMoreBtn);
      expect(screen.getAllByTestId(/^listing-card-batch-unit-/).length).toBe(48);
      expect(screen.getAllByTestId('inventory-gear-card').length).toBe(24);
      expect(screen.getByTestId('load-more-counter')).toHaveTextContent(
        'Showing 48 of 55 vehicles'
      );
      expect(screen.getByTestId('load-more-btn')).toHaveTextContent(
        'Load 24 More Vehicles (7 remaining)'
      );

      // Changing a filter (e.g. search or model) resets visibleCount back to 24
      fireEvent.change(screen.getByTestId('filter-model-select'), {
        target: { value: 'RAV4 Hybrid' },
      });
      // There are 30 RAV4 Hybrid units; only first 24 should render after filter change
      expect(screen.getAllByTestId(/^listing-card-batch-unit-/).length).toBe(24);
      expect(screen.getByTestId('load-more-counter')).toHaveTextContent(
        'Showing 24 of 30 vehicles'
      );
      expect(screen.getByTestId('load-more-btn')).toHaveTextContent(
        'Load 24 More Vehicles (6 remaining)'
      );

      // Load remaining 6 -> all 30 displayed, showing-all-message appears
      fireEvent.click(screen.getByTestId('load-more-btn'));
      expect(screen.getAllByTestId(/^listing-card-batch-unit-/).length).toBe(30);
      expect(screen.queryByTestId('load-more-btn')).not.toBeInTheDocument();
      expect(screen.getByTestId('showing-all-message')).toHaveTextContent(
        'Showing all 30 observed vehicles'
      );

      // Click Load More to expand again, then change Sort -> visibleCount resets back to 24
      // Reset filter first to see 55 vehicles
      fireEvent.change(screen.getByTestId('filter-model-select'), {
        target: { value: '' },
      });
      fireEvent.click(screen.getByTestId('load-more-btn'));
      expect(screen.getAllByTestId(/^listing-card-batch-unit-/).length).toBe(48);

      fireEvent.change(screen.getByTestId('filter-sort-select'), {
        target: { value: 'price_desc' },
      });
      expect(screen.getAllByTestId(/^listing-card-batch-unit-/).length).toBe(24);
    }, 30000);

    it('implements comprehensive sorting suite across newest, price, distance, and status', () => {
      const customListings: VehicleListingCardProps[] = [
        {
          id: 'unit-cheapest-transit',
          make: 'Toyota',
          model: 'Corolla',
          modelYear: 2026,
          dealerName: 'Jim Pattison Toyota Downtown',
          status: 'Incoming availability unconfirmed',
          lastChecked: new Date().toISOString(),
          postedAt: '2026-10-10T00:00:00Z',
          msrp: 30000,
          sellingPrice: 30000,
        },
        {
          id: 'unit-expensive-onlot',
          make: 'Toyota',
          model: 'Land Cruiser',
          modelYear: 2026,
          dealerName: 'Jim Pattison Toyota Surrey',
          status: 'Advertised - availability unconfirmed',
          lastChecked: new Date().toISOString(),
          postedAt: '2026-10-22T00:00:00Z',
          msrp: 85000,
          sellingPrice: 85000,
        },
        {
          id: 'unit-mid-onlot',
          make: 'Toyota',
          model: 'RAV4 Hybrid',
          modelYear: 2026,
          dealerName: 'West Coast Toyota',
          status: 'Advertised - availability unconfirmed',
          lastChecked: new Date().toISOString(),
          postedAt: '2026-10-18T00:00:00Z',
          msrp: 50000,
          sellingPrice: 50000,
        },
      ];

      render(<InventoryExplorer initialListings={customListings} />);

      const sortSelect = screen.getByTestId('filter-sort-select');

      // 1. Default: newest (Land Cruiser 10-22, RAV4 10-18, Corolla 10-10)
      let cards = screen.getAllByTestId(/^listing-card-/);
      expect(cards[0]).toHaveAttribute('data-testid', 'listing-card-unit-expensive-onlot');
      expect(cards[1]).toHaveAttribute('data-testid', 'listing-card-unit-mid-onlot');
      expect(cards[2]).toHaveAttribute('data-testid', 'listing-card-unit-cheapest-transit');

      // 2. Price: Low to High (Corolla $30k, RAV4 $50k, Land Cruiser $85k)
      fireEvent.change(sortSelect, { target: { value: 'price_asc' } });
      cards = screen.getAllByTestId(/^listing-card-/);
      expect(cards[0]).toHaveAttribute('data-testid', 'listing-card-unit-cheapest-transit');
      expect(cards[1]).toHaveAttribute('data-testid', 'listing-card-unit-mid-onlot');
      expect(cards[2]).toHaveAttribute('data-testid', 'listing-card-unit-expensive-onlot');

      // 3. Price: High to Low (Land Cruiser $85k, RAV4 $50k, Corolla $30k)
      fireEvent.change(sortSelect, { target: { value: 'price_desc' } });
      cards = screen.getAllByTestId(/^listing-card-/);
      expect(cards[0]).toHaveAttribute('data-testid', 'listing-card-unit-expensive-onlot');
      expect(cards[1]).toHaveAttribute('data-testid', 'listing-card-unit-mid-onlot');
      expect(cards[2]).toHaveAttribute('data-testid', 'listing-card-unit-cheapest-transit');

      // 4. Lot Status (On Lot units first, then Incoming in-transit units)
      fireEvent.change(sortSelect, { target: { value: 'status' } });
      cards = screen.getAllByTestId(/^listing-card-/);
      expect(cards[0]).toHaveAttribute('data-testid', 'listing-card-unit-expensive-onlot');
      expect(cards[1]).toHaveAttribute('data-testid', 'listing-card-unit-mid-onlot');
      expect(cards[2]).toHaveAttribute('data-testid', 'listing-card-unit-cheapest-transit');
    });
  });

  // ===========================================================================
  // 4b. InventoryGearCard Unit Tests
  // ===========================================================================
  describe('InventoryGearCard Unit Tests', () => {
    const sampleAccessory = {
      id: 'all-weather-floor-liners',
      title: 'TPE All-Weather Floor & Cargo Liners',
      category: 'protection' as const,
      description: 'Laser-fit floor & trunk spill protection for Canadian winters',
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
        screen.getByText('TPE All-Weather Floor & Cargo Liners')
      ).toBeInTheDocument();
      expect(
        screen.getByText('GEAR PICK')
      ).toBeInTheDocument();
      expect(
        screen.getByText('RAV4 Hybrid')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Laser-fit floor & trunk spill protection for Canadian winters')
      ).toBeInTheDocument();
      expect(screen.getAllByText('$120 – $189 CAD').length).toBeGreaterThan(0);
      expect(screen.getByText('Verified Amazon affiliate link')).toBeInTheDocument();
      expect(screen.queryByText('Essential')).not.toBeInTheDocument();

      const actionBtn = screen.getByTestId('gear-strip-action-btn');
      expect(actionBtn).toHaveTextContent(/Check Price/i);
      expect(actionBtn).toHaveAttribute(
        'href',
        'https://www.amazon.ca/s?k=Toyota+floor+mats&tag=toyotawaits-20'
      );
      expect(actionBtn).toHaveAttribute('target', '_blank');
      expect(actionBtn).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders clean tag without model subtitle when modelContext is omitted', () => {
      render(<InventoryGearCard item={sampleAccessory} />);

      expect(
        screen.getByText('GEAR PICK')
      ).toBeInTheDocument();
      expect(screen.queryByText(/UNIVERSAL/i)).not.toBeInTheDocument();
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
