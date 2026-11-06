import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InventoryExplorer } from '@/components/discovery/InventoryExplorer';
import { VehicleListingCardProps } from '@/components/discovery/VehicleListingCard';

const mockListings: VehicleListingCardProps[] = [
  {
    id: 'listing-vin-01',
    make: 'Toyota',
    model: 'RAV4 Hybrid',
    trim: 'XSE AWD',
    modelYear: 2026,
    vin: '2T3TESTVIN0000001',
    isProvisionalVin: false,
    dealerName: 'Jim Pattison Toyota Downtown',
    dealerCity: 'Vancouver',
    dealerProvince: 'BC',
    status: 'Advertised - availability unconfirmed',
    lastChecked: new Date().toISOString(),
    msrp: 48000,
    sellingPrice: 48000,
    lifecycleStatus: 'active',
  },
  {
    id: 'listing-vin-02',
    make: 'Toyota',
    model: 'Sienna',
    trim: 'XSE 7-Passenger',
    modelYear: 2026,
    vin: '5TDTESTVIN0000002',
    isProvisionalVin: false,
    dealerName: 'Jim Pattison Toyota Surrey',
    dealerCity: 'Surrey',
    dealerProvince: 'BC',
    status: 'Advertised - availability unconfirmed',
    lastChecked: new Date().toISOString(),
    msrp: 55000,
    sellingPrice: 55000,
    lifecycleStatus: 'active',
  },
  {
    id: 'listing-vin-03',
    make: 'Toyota',
    model: 'Corolla Hatchback',
    trim: 'SE Upgrade',
    modelYear: 2026,
    vin: '2T1TESTVIN0000003',
    isProvisionalVin: false,
    dealerName: 'OpenRoad Toyota Richmond',
    dealerCity: 'Richmond',
    dealerProvince: 'BC',
    status: 'Advertised - availability unconfirmed',
    lastChecked: new Date().toISOString(),
    msrp: 32000,
    sellingPrice: 32000,
    lifecycleStatus: 'active',
  },
];

describe('VIN Deep-Link Isolation & Alert Context Banner', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_ENABLE_INVENTORY_DISCOVERY', 'true');
    vi.stubGlobal('fetch', vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ listings: mockListings, totalCount: mockListings.length }),
      })
    ));
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('filters public feed to exact matching allocations when initialVins is present', () => {
    render(
      <InventoryExplorer
        initialListings={mockListings}
        initialVins={['2T3TESTVIN0000001']}
      />
    );

    // Context banner renders matching allocation count
    const banner = screen.getByTestId('alert-vin-context-banner');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveTextContent(/Showing 1 matching allocation from your alert/i);

    // Only matched vehicle is visible
    expect(screen.getByText('2T3TESTVIN0000001')).toBeInTheDocument();
    expect(screen.queryByText('5TDTESTVIN0000002')).not.toBeInTheDocument();
    expect(screen.queryByText('2T1TESTVIN0000003')).not.toBeInTheDocument();
  });

  it('renders plural allocation wording and advisory note when 1 of multiple alerted VINs was spoken for', () => {
    render(
      <InventoryExplorer
        initialListings={mockListings}
        initialVins={['2T3TESTVIN0000001', '5TDTESTVIN0000002', 'SOLDVIN9999999999']}
      />
    );

    const banner = screen.getByTestId('alert-vin-context-banner');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveTextContent(/Showing 2 matching allocations from your alert/i);

    // Amber advisory note
    const advisory = screen.getByTestId('alert-vin-sold-advisory');
    expect(advisory).toBeInTheDocument();
    expect(advisory).toHaveTextContent(
      /1 of your alerted allocations was spoken for today\. Showing active units below\./i
    );

    // 2 active matched units render
    expect(screen.getByText('2T3TESTVIN0000001')).toBeInTheDocument();
    expect(screen.getByText('5TDTESTVIN0000002')).toBeInTheDocument();
  });

  it('never 404s or crashes when no VINs match: gracefully falls back to active units with advisory note', () => {
    render(
      <InventoryExplorer
        initialListings={mockListings}
        initialVins={['NONEXISTENT_VIN']}
        initialModel="RAV4 Hybrid"
      />
    );

    // Amber advisory note displays spoken for note
    const advisory = screen.getByTestId('alert-vin-sold-advisory');
    expect(advisory).toBeInTheDocument();
    expect(advisory).toHaveTextContent(
      /1 of your alerted allocations was spoken for today\. Showing active units below\./i
    );

    // Gracefully shows active units for the model without 404 or crash
    expect(screen.getByText('2T3TESTVIN0000001')).toBeInTheDocument();
  });

  it('resets filter cleanly to all vehicles when Clear Filter / View All button is clicked', () => {
    render(
      <InventoryExplorer
        initialListings={mockListings}
        initialVins={['2T3TESTVIN0000001']}
      />
    );

    expect(screen.getByText('2T3TESTVIN0000001')).toBeInTheDocument();
    expect(screen.queryByText('5TDTESTVIN0000002')).not.toBeInTheDocument();

    const clearBtn = screen.getByTestId('clear-vin-filter-btn');
    fireEvent.click(clearBtn);

    // Banner removed, all listings become visible
    expect(screen.queryByTestId('alert-vin-context-banner')).not.toBeInTheDocument();
    expect(screen.getByText('2T3TESTVIN0000001')).toBeInTheDocument();
    expect(screen.getByText('5TDTESTVIN0000002')).toBeInTheDocument();
    expect(screen.getByText('2T1TESTVIN0000003')).toBeInTheDocument();
  });
});
