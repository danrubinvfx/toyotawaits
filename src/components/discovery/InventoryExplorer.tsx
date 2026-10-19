'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  VehicleListingCard,
  VehicleListingCardProps,
} from './VehicleListingCard';
import {
  InventoryFilterBar,
  FilterState,
} from './InventoryFilterBar';
import { CoverageDisclosureBanner } from './CoverageDisclosureBanner';
import { Car, AlertCircle, Sparkles } from 'lucide-react';

export const INITIAL_SAMPLE_LISTINGS: VehicleListingCardProps[] = [
  {
    id: 'jp-rav4-xse-01',
    make: 'Toyota',
    model: 'RAV4 Hybrid',
    trim: 'XSE Technology Package AWD',
    modelYear: 2026,
    vin: 'JTDACAAJ0T3038212',
    isProvisionalVin: false,
    dealerName: 'Jim Pattison Toyota Downtown',
    dealerCity: 'Vancouver',
    dealerProvince: 'BC',
    status: 'Advertised - availability unconfirmed',
    lastChecked: new Date().toISOString(),
    vdpUrl: 'https://www.jptoyota-downtown.com/vehicles/new/?keyword=JTDACAAJ0T3038212',
    msrp: 61285,
    sellingPrice: 63957,
    mandatoryFees: 895,
    hasUnverifiedFees: true,
    powertrain: 'Hybrid 2.5L 4-Cyl AWD',
    exteriorColor: 'Wind Chill Pearl / Black Roof',
    stockNumber: 'T26-1044',
  },
  {
    id: 'jp-sienna-ltd-02',
    make: 'Toyota',
    model: 'Sienna',
    trim: 'Limited AWD 7-Passenger',
    modelYear: 2026,
    vin: null,
    provisionalId: 'PROV-SIENNA-881',
    isProvisionalVin: true,
    dealerName: 'Jim Pattison Toyota Downtown',
    dealerCity: 'Vancouver',
    dealerProvince: 'BC',
    status: 'Incoming availability unconfirmed',
    lastChecked: new Date(Date.now() - 3600000).toISOString(),
    vdpUrl: 'https://www.jptoyota-downtown.com/vehicles/new/?keyword=SI-9944',
    msrp: 68450,
    sellingPrice: 68450,
    mandatoryFees: null,
    hasUnverifiedFees: true,
    powertrain: 'Hybrid 2.5L e-AWD',
    exteriorColor: 'Blueprint',
    stockNumber: 'SI-9944',
  },
  {
    id: 'jp-grand-highlander-03',
    make: 'Toyota',
    model: 'Grand Highlander Hybrid',
    trim: 'Limited MAX AWD',
    modelYear: 2026,
    vin: '4T1B11HK5SU112233',
    isProvisionalVin: false,
    dealerName: 'Jim Pattison Toyota Downtown',
    dealerCity: 'Vancouver',
    dealerProvince: 'BC',
    status: 'Advertised - availability unconfirmed',
    lastChecked: new Date(Date.now() - 7200000).toISOString(),
    vdpUrl: 'https://www.jptoyota-downtown.com/vehicles/new/?keyword=4T1B11HK5SU112233',
    msrp: 66990,
    sellingPrice: 67885,
    mandatoryFees: 895,
    hasUnverifiedFees: true,
    powertrain: 'Hybrid MAX 2.4L Turbo AWD',
    exteriorColor: 'Storm Cloud',
    stockNumber: 'GH-2026',
  },
  {
    id: 'jp-tacoma-04',
    make: 'Toyota',
    model: 'Tacoma',
    trim: 'TRD Off-Road 4x4 Double Cab',
    modelYear: 2026,
    vin: '3TYLB5EN8RT009988',
    isProvisionalVin: false,
    dealerName: 'Jim Pattison Toyota Downtown',
    dealerCity: 'Vancouver',
    dealerProvince: 'BC',
    status: 'Incoming availability unconfirmed',
    lastChecked: new Date(Date.now() - 10800000).toISOString(),
    vdpUrl: 'https://www.jptoyota-downtown.com/vehicles/new/?keyword=3TYLB5EN8RT009988',
    msrp: 54200,
    sellingPrice: 54200,
    mandatoryFees: null,
    hasUnverifiedFees: true,
    powertrain: 'i-FORCE 2.4L Turbo',
    exteriorColor: 'Underground',
    stockNumber: 'TAC-552',
  },
];

/**
 * Checks if the inventory explorer should be enabled based on environment flags,
 * Vercel preview deployment status, or URL query overrides.
 */
export function checkInventoryDiscoveryEnabled(
  overrideParam?: boolean | string | null
): boolean {
  if (process.env.NEXT_PUBLIC_ENABLE_INVENTORY_DISCOVERY === 'true') return true;
  if (process.env.ENABLE_INVENTORY_DISCOVERY === 'true') return true;
  if (
    process.env.VERCEL_ENV === 'preview' ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
  ) {
    return true;
  }
  if (overrideParam === true || overrideParam === 'true') return true;
  return false;
}

export interface InventoryExplorerProps {
  initialListings?: VehicleListingCardProps[];
  previewOverride?: boolean;
}

export function InventoryExplorer({
  initialListings = INITIAL_SAMPLE_LISTINGS,
  previewOverride,
}: InventoryExplorerProps) {
  let isPreviewQuery = false;
  try {
    const sp = useSearchParams();
    if (sp?.get('preview') === 'true') {
      isPreviewQuery = true;
    }
  } catch {
    // Graceful fallback when rendered without Next.js Navigation context
  }

  const [listings, setListings] = useState<VehicleListingCardProps[]>(initialListings);

  // Sync state if initialListings changes (e.g. tests or SSR)
  useEffect(() => {
    setListings(initialListings);
  }, [initialListings]);

  // Client-side hydration from /api/inventory to display live observed inventory
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isMounted = true;
    fetch('/api/inventory')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data && Array.isArray(data.listings) && data.listings.length > 0) {
          setListings(data.listings);
        }
      })
      .catch(() => {
        // Retain initial fallback listings
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const [filters, setFilters] = useState<FilterState>({
    model: '',
    status: '',
    dealer: '',
    minPrice: '',
    maxPrice: '',
    search: '',
  });

  const availableModels = useMemo(() => {
    const set = new Set<string>();
    listings.forEach((item) => set.add(item.model));
    return Array.from(set).sort();
  }, [listings]);

  const availableDealers = useMemo(() => {
    const set = new Set<string>();
    listings.forEach((item) => set.add(item.dealerName));
    return Array.from(set).sort();
  }, [listings]);

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // Model facet
      if (filters.model && item.model.toLowerCase() !== filters.model.toLowerCase()) {
        return false;
      }

      // Status facet
      if (filters.status && item.status.toLowerCase() !== filters.status.toLowerCase()) {
        return false;
      }

      // Dealer facet
      if (filters.dealer && item.dealerName.toLowerCase() !== filters.dealer.toLowerCase()) {
        return false;
      }

      // Min Price
      if (filters.minPrice) {
        const min = parseFloat(filters.minPrice);
        const price = item.sellingPrice ?? item.msrp ?? 0;
        if (!isNaN(min) && price < min) return false;
      }

      // Max Price
      if (filters.maxPrice) {
        const max = parseFloat(filters.maxPrice);
        const price = item.sellingPrice ?? item.msrp ?? 0;
        if (!isNaN(max) && price > max) return false;
      }

      // Search keyword
      if (filters.search) {
        const q = filters.search.toLowerCase().trim();
        const fullSpec = `${item.modelYear} ${item.make} ${item.model} ${item.trim || ''} ${item.vin || ''} ${item.provisionalId || ''} ${item.exteriorColor || ''}`.toLowerCase();
        if (!fullSpec.includes(q)) return false;
      }

      return true;
    });
  }, [listings, filters]);

  const isEnabled = checkInventoryDiscoveryEnabled(
    previewOverride !== undefined ? previewOverride : isPreviewQuery
  );

  if (!isEnabled) {
    return (
      <div
        data-testid="inventory-disabled-screen"
        className="max-w-md w-full mx-auto rounded-2xl border border-zinc-800 bg-zinc-900/90 p-8 text-center space-y-4 shadow-xl backdrop-blur-md"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-950/80 text-amber-400 border border-amber-900/60">
          <AlertCircle className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Inventory Discovery (Private Pilot)
        </h2>
        <p className="text-xs text-zinc-400 leading-relaxed">
          The ToyotaWaits.ca public inventory explorer is currently in private trial mode under Master Plan V3.2. Automated polite sweeps are validating dealer endpoints.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6" data-testid="inventory-explorer">
      {/* Search & Filter Bar (Elevated immediately below header) */}
      <InventoryFilterBar
        filters={filters}
        onFilterChange={setFilters}
        availableModels={availableModels}
        availableDealers={availableDealers}
        totalResults={filteredListings.length}
      />

      {/* Pilot Coverage Disclosure (Positioned beneath filter bar) */}
      <CoverageDisclosureBanner />

      {/* Listings Grid */}
      {filteredListings.length > 0 ? (
        <section
          data-testid="listings-grid"
          aria-label="Observed inventory listings"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {filteredListings.map((listing) => (
            <VehicleListingCard key={listing.id} {...listing} />
          ))}
        </section>
      ) : (
        <div
          data-testid="no-results-message"
          className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-8 text-center space-y-3"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
            <Car className="h-6 w-6" aria-hidden="true" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-200">No matching listings observed</h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Try adjusting your model or price filters. Remember our pilot is currently monitoring validated Lower Mainland dealer feeds.
          </p>
        </div>
      )}
    </div>
  );
}
