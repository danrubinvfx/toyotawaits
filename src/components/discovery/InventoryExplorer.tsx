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
import { InventoryGearCard } from './InventoryGearCard';
import { getAccessoriesForModel } from '@/data/accessories';
import { getDealerCoordinates } from '@/config/dealers';
import { calculateDistanceKm, getPresetCoordinates } from '@/lib/geo/distance';
import { useDonationReminder } from '@/hooks/useDonationReminder';
import { DonationToast } from '@/components/common/DonationToast';
import { Car, AlertCircle } from 'lucide-react';

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
    imageUrl: 'https://media.toyota.ca/image/2026-rav4-hybrid-xse.jpg',
    hasRealPhoto: true,
    imageSource: 'dealer_feed',
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
    imageUrl: null,
    hasRealPhoto: false,
    imageSource: null,
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
    imageUrl: 'https://prod.pictures.autoscout24.net/listing-images/2026-grand-highlander-limited.jpg',
    hasRealPhoto: true,
    imageSource: 'dealer_feed',
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
    imageUrl: null,
    hasRealPhoto: false,
    imageSource: null,
  },
  {
    id: 'jp-surrey-rav4-01',
    make: 'Toyota',
    model: 'RAV4 Plug-in Hybrid',
    trim: 'SE AWD',
    modelYear: 2026,
    vin: '2T36CRAVXTW109453',
    isProvisionalVin: false,
    dealerName: 'Jim Pattison Toyota Surrey',
    dealerCity: 'Surrey',
    dealerProvince: 'BC',
    status: 'Advertised - availability unconfirmed',
    lastChecked: new Date().toISOString(),
    vdpUrl: 'https://www.jptoyota-surrey.com/vehicles/2026/Toyota/RAV4/Surrey/BC/71577607/?sale_class=New',
    msrp: 48750,
    sellingPrice: 48750,
    mandatoryFees: null,
    hasUnverifiedFees: true,
    powertrain: 'Plug-in Hybrid 2.5L 4-Cyl AWD',
    exteriorColor: 'Storm Cloud',
    stockNumber: 'N109453',
    imageUrl: 'https://pictures.dealerprocess.ca/inventory/2026-rav4-prime-se.jpg',
    hasRealPhoto: true,
    imageSource: 'dealer_feed',
  },
  {
    id: 'jp-surrey-sienna-02',
    make: 'Toyota',
    model: 'Sienna',
    trim: 'LE AWD 8-Passenger',
    modelYear: 2026,
    vin: '5TDGSKFC1TS289848',
    isProvisionalVin: false,
    dealerName: 'Jim Pattison Toyota Surrey',
    dealerCity: 'Surrey',
    dealerProvince: 'BC',
    status: 'Advertised - availability unconfirmed',
    lastChecked: new Date(Date.now() - 1800000).toISOString(),
    vdpUrl: 'https://www.jptoyota-surrey.com/vehicles/2026/Toyota/Sienna/Surrey/BC/71577608/?sale_class=New',
    msrp: 54928,
    sellingPrice: 54928,
    mandatoryFees: null,
    hasUnverifiedFees: true,
    powertrain: 'Hybrid 2.5L e-AWD',
    exteriorColor: 'White',
    stockNumber: 'N289848',
    imageUrl: null,
    hasRealPhoto: false,
    imageSource: null,
  },
  {
    id: 'wc-toyota-prius-01',
    make: 'Toyota',
    model: 'Prius Prime',
    trim: 'SE AWD',
    modelYear: 2026,
    vin: 'JTDACACU3V3084482',
    isProvisionalVin: false,
    dealerName: 'West Coast Toyota',
    dealerCity: 'Pitt Meadows',
    dealerProvince: 'BC',
    status: 'Advertised - availability unconfirmed',
    lastChecked: new Date(Date.now() - 3600000).toISOString(),
    vdpUrl: 'https://www.westcoasttoyota.com/vehicles/2026/Toyota/Prius%20Prime/Pitt%20Meadows/BC/71882001/?sale_class=New',
    msrp: 42150,
    sellingPrice: 42150,
    mandatoryFees: null,
    hasUnverifiedFees: true,
    powertrain: 'Plug-in Hybrid 2.0L 4-Cyl',
    exteriorColor: 'Guardian Gray',
    stockNumber: 'W10844',
    imageUrl: 'https://prod.pictures.autoscout24.net/listing-images/3802a880-08d5-4298-8edd-d837c0798a09_e6ef2092-9b54-4a0b-80e4-bf25b0858e1c.jpg/1024x786.webp',
    hasRealPhoto: true,
    imageSource: 'dealer_feed',
  },
  {
    id: 'jp-corolla-stale-01',
    make: 'Toyota',
    model: 'Corolla',
    trim: 'LE FWD',
    modelYear: 2026,
    vin: '2T1BURHE7TC998877',
    isProvisionalVin: false,
    dealerName: 'Jim Pattison Toyota Downtown',
    dealerCity: 'Vancouver',
    dealerProvince: 'BC',
    status: 'No longer observed / stale',
    lastChecked: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    vdpUrl: 'https://www.jptoyota-downtown.com/vehicles/new/?keyword=2T1BURHE7TC998877',
    msrp: 26500,
    sellingPrice: 26500,
    mandatoryFees: null,
    hasUnverifiedFees: true,
    powertrain: 'Gas 2.0L 4-Cyl',
    exteriorColor: 'Classic Silver',
    stockNumber: 'STALE-99',
    imageUrl: null,
    hasRealPhoto: false,
    imageSource: null,
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
  initialModel?: string;
  popularityCounts?: Record<string, number>;
}

export function InventoryExplorer({
  initialListings = INITIAL_SAMPLE_LISTINGS,
  previewOverride,
  initialModel,
  popularityCounts,
}: InventoryExplorerProps) {
  let isPreviewQuery = false;
  let queryModel = initialModel || '';

  try {
    const sp = useSearchParams();
    if (sp?.get('preview') === 'true') {
      isPreviewQuery = true;
    }
    const paramModel = sp?.get('model');
    if (paramModel && !queryModel) {
      queryModel = paramModel.trim();
    }
  } catch {
    // Graceful fallback when rendered without Next.js Navigation context
  }

  const [listings, setListings] = useState<VehicleListingCardProps[]>(initialListings);
  const [currentTime] = useState(() => Date.now());

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
    model: queryModel || '',
    status: 'advertised',
    dealer: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    search: '',
  });

  // Keep filter in sync if queryModel or searchParams update
  useEffect(() => {
    if (queryModel && filters.model !== queryModel) {
      setFilters((prev) => ({ ...prev, model: queryModel }));
    }
  }, [queryModel]);

  const availableModels = useMemo(() => {
    const set = new Set<string>();
    listings.forEach((item) => set.add(item.model));
    if (filters.model) {
      set.add(filters.model);
    }
    return Array.from(set).sort();
  }, [listings, filters.model]);

  const availableLocations = useMemo(() => {
    const locMap = new Map<string, string>([
      ['Vancouver', 'Vancouver (Downtown)'],
      ['Burnaby', 'Burnaby'],
      ['Surrey', 'Surrey (Guildford)'],
      ['Richmond', 'Richmond'],
      ['Coquitlam', 'Coquitlam / Tri-Cities'],
      ['Pitt Meadows', 'Pitt Meadows (West Coast)'],
      ['Langley', 'Langley'],
      ['Abbotsford', 'Abbotsford'],
    ]);
    listings.forEach((item) => {
      const city =
        item.dealerCity ||
        (item.dealerName.toLowerCase().includes('surrey')
          ? 'Surrey'
          : item.dealerName.toLowerCase().includes('west coast')
          ? 'Pitt Meadows'
          : 'Vancouver');

      if (city.toLowerCase() === 'vancouver') {
        locMap.set('Vancouver', 'Vancouver (Downtown)');
      } else if (city.toLowerCase() === 'surrey') {
        locMap.set('Surrey', 'Surrey (Guildford)');
      } else if (city.toLowerCase() === 'pitt meadows' || city.toLowerCase().includes('pitt')) {
        locMap.set('Pitt Meadows', 'Pitt Meadows (West Coast)');
      } else if (!locMap.has(city)) {
        locMap.set(city, city);
      }
    });

    return Array.from(locMap.entries()).map(([value, label]) => ({ value, label }));
  }, [listings]);

  const availableDealers = useMemo(() => {
    const set = new Set<string>();
    listings.forEach((item) => set.add(item.dealerName));
    return Array.from(set).sort();
  }, [listings]);

  const userCoordinates = useMemo(() => {
    if (filters.userCoordinates) return filters.userCoordinates;
    if (filters.location) {
      return getPresetCoordinates(filters.location);
    }
    return null;
  }, [filters.userCoordinates, filters.location]);

  const filteredListings = useMemo(() => {
    // 1. Calculate distance for each listing if user location coordinates are present
    const withDistance = listings.map((item) => {
      let distanceKm: number | null = null;
      if (userCoordinates) {
        const dealerCoords = getDealerCoordinates(item.dealerName, item.dealerCity);
        if (dealerCoords) {
          distanceKm = calculateDistanceKm(
            userCoordinates.lat,
            userCoordinates.lng,
            dealerCoords.lat,
            dealerCoords.lng
          );
        }
      }
      return {
        ...item,
        distanceKm,
      };
    });

    // 2. Filter listings based on active facets
    const filtered = withDistance.filter((item) => {
      // Model facet
      if (filters.model) {
        const filterModel = filters.model.toLowerCase().trim();
        const itemModel = item.model.toLowerCase().trim();
        const itemPowertrain = (item.powertrain || '').toLowerCase().trim();
        const itemTrim = (item.trim || '').toLowerCase().trim();

        const matchesExact = itemModel === filterModel;
        const isTargetPhev =
          filterModel.includes('plug-in') ||
          filterModel.includes('prime') ||
          filterModel.includes('phev');
        const isItemPhev =
          itemModel.includes('prime') ||
          itemModel.includes('plug-in') ||
          itemPowertrain.includes('plug-in') ||
          itemTrim.includes('prime');

        let matchesModel = matchesExact;
        if (!matchesModel) {
          if (isTargetPhev) {
            matchesModel =
              (filterModel.includes('rav4') && itemModel.includes('rav4') && isItemPhev) ||
              (filterModel.includes('prius') && itemModel.includes('prius') && isItemPhev) ||
              (isItemPhev && itemModel.includes(filterModel));
          } else {
            const isTargetHev = filterModel.includes('hybrid') || filterModel.includes('hev');
            const isItemHev =
              itemModel.includes('hybrid') ||
              itemPowertrain.includes('hybrid') ||
              itemTrim.includes('hybrid');
            if (isTargetHev) {
              matchesModel =
                itemModel === filterModel ||
                (itemModel.includes(filterModel) && !isItemPhev) ||
                (filterModel.split(' ')[0] === itemModel.split(' ')[0] && isItemHev && !isItemPhev);
            } else {
              matchesModel =
                itemModel === filterModel ||
                (!isItemPhev && !isItemHev && (itemModel.includes(filterModel) || filterModel.includes(itemModel)));
            }
          }
        }

        if (!matchesModel) {
          return false;
        }
      }

      // Status facet: Default state is "Active / Verified Live" ('advertised')
      const statusFilter = (filters.status ?? 'advertised').toLowerCase().trim();
      if (statusFilter === 'advertised' || statusFilter === 'active') {
        const itemStatus = item.status.toLowerCase();
        // Exclude stale, no longer observed, removed, quarantined, sold
        if (
          itemStatus.includes('stale') ||
          itemStatus.includes('no longer') ||
          itemStatus.includes('removed') ||
          itemStatus.includes('quarantined') ||
          itemStatus.includes('sold')
        ) {
          return false;
        }
        // Exclude anything older than 48 hours
        const checkTime = new Date(item.lastChecked).getTime();
        if (!isNaN(checkTime) && currentTime - checkTime > 48 * 3600 * 1000) {
          return false;
        }
      } else if (statusFilter !== 'all' && statusFilter !== '') {
        if (item.status.toLowerCase() !== filters.status.toLowerCase()) {
          return false;
        }
      }

      // Explicit Dealer facet (if separate from location preset)
      if (filters.dealer && filters.dealer !== filters.location && !userCoordinates) {
        const dQuery = filters.dealer.toLowerCase().trim();
        if (!item.dealerName.toLowerCase().includes(dQuery)) {
          return false;
        }
      }

      // Max Distance radius filter
      if (filters.maxDistance) {
        const maxDist = parseFloat(filters.maxDistance);
        if (!isNaN(maxDist)) {
          if (item.distanceKm == null || item.distanceKm > maxDist) {
            return false;
          }
        }
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

    // 3. Proximity Sort: when sortNearest is active (or enabled when user location is chosen)
    const shouldSortNearest = filters.sortNearest ?? Boolean(userCoordinates);
    if (shouldSortNearest && userCoordinates) {
      filtered.sort((a, b) => {
        const distA = a.distanceKm != null ? a.distanceKm : Infinity;
        const distB = b.distanceKm != null ? b.distanceKm : Infinity;
        return distA - distB;
      });
    }

    return filtered;
  }, [listings, filters, userCoordinates, currentTime]);

  const [fetchedGearCounts, setFetchedGearCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (popularityCounts) return;
    let isMounted = true;
    fetch('/api/accessories/popular')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.counts && typeof data.counts === 'object') {
          setFetchedGearCounts(data.counts);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [popularityCounts]);

  const effectiveGearCounts = popularityCounts || fetchedGearCounts;
  const gearItems = useMemo(() => {
    return getAccessoriesForModel(filters.model || undefined, effectiveGearCounts);
  }, [filters.model, effectiveGearCounts]);

  const { showReminder, recordListingClick, dismissReminder } = useDonationReminder();

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
    <div className="space-y-3 sm:space-y-4" data-testid="inventory-explorer">
      {/* Search & Filter Bar (Elevated immediately below header) */}
      <InventoryFilterBar
        filters={filters}
        onFilterChange={setFilters}
        availableModels={availableModels}
        availableLocations={availableLocations}
        availableDealers={availableDealers}
        totalResults={filteredListings.length}
      />

      {/* Listings Grid (Rendered immediately below filter bar for mobile visibility above the fold) */}
      {filteredListings.length > 0 ? (
        <section
          data-testid="listings-grid"
          aria-label="Observed inventory listings"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4"
        >
          {filteredListings.map((listing, index) => {
            const shouldInsertGear = (index + 1) % 2 === 0 && gearItems.length > 0;
            const gearItem = shouldInsertGear
              ? gearItems[Math.floor(index / 2) % gearItems.length]
              : null;

            return (
              <React.Fragment key={listing.id}>
                <VehicleListingCard
                  {...listing}
                  onListingClick={recordListingClick}
                />
                {shouldInsertGear && gearItem && (
                  <InventoryGearCard
                    key={`gear-strip-${gearItem.id}-${index}`}
                    item={gearItem}
                    modelContext={filters.model || undefined}
                  />
                )}
              </React.Fragment>
            );
          })}
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

      {/* Pilot Coverage Disclosure (Positioned beneath listings grid) */}
      <CoverageDisclosureBanner />

      {/* Non-intrusive Coffee Donation Reminder after 3 listing views */}
      <DonationToast
        isOpen={showReminder}
        onDismiss={dismissReminder}
        modelContext={filters.model || null}
      />
    </div>
  );
}
