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
import { InventoryAlertModal } from './InventoryAlertModal';
import { getAccessoriesForModel } from '@/data/accessories';
import { DEALERS, getDealerCoordinates } from '@/config/dealers';
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
    postedAt: new Date(Date.now() - 9 * 24 * 3600 * 1000).toISOString(),
    firstSeenAt: new Date(Date.now() - 9 * 24 * 3600 * 1000).toISOString(),
    daysOnLot: 9,
    days_on_lot: 9,
    isLikelyCancellation: true,
    is_likely_cancellation: true,
    lifecycleStatus: 'active',
    lifecycle_status: 'active',
    vdpUrl: 'https://www.jptoyota-downtown.com/vehicles/2026/Toyota/RAV4%20Hybrid/Vancouver/BC/69116486/?sale_class=New',
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
    postedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    firstSeenAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    daysOnLot: 3,
    days_on_lot: 3,
    isLikelyCancellation: false,
    is_likely_cancellation: false,
    lifecycleStatus: 'active',
    lifecycle_status: 'active',
    vdpUrl: null,
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
    postedAt: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
    firstSeenAt: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
    daysOnLot: 14,
    days_on_lot: 14,
    isLikelyCancellation: true,
    is_likely_cancellation: true,
    lifecycleStatus: 'active',
    lifecycle_status: 'active',
    vdpUrl: 'https://www.jptoyota-downtown.com/vehicles/2026/Toyota/Grand%20Highlander%20Hybrid/Vancouver/BC/69116488/?sale_class=New',
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
    postedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    firstSeenAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    daysOnLot: 1,
    days_on_lot: 1,
    isLikelyCancellation: false,
    is_likely_cancellation: false,
    lifecycleStatus: 'active',
    lifecycle_status: 'active',
    vdpUrl: null,
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
    postedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    firstSeenAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    daysOnLot: 7,
    days_on_lot: 7,
    isLikelyCancellation: true,
    is_likely_cancellation: true,
    lifecycleStatus: 'active',
    lifecycle_status: 'active',
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
    postedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    firstSeenAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    daysOnLot: 5,
    days_on_lot: 5,
    isLikelyCancellation: true,
    is_likely_cancellation: true,
    lifecycleStatus: 'active',
    lifecycle_status: 'active',
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
    postedAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
    firstSeenAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
    daysOnLot: 12,
    days_on_lot: 12,
    isLikelyCancellation: true,
    is_likely_cancellation: true,
    lifecycleStatus: 'active',
    lifecycle_status: 'active',
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
    postedAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
    firstSeenAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
    daysOnLot: 20,
    days_on_lot: 20,
    isLikelyCancellation: false,
    is_likely_cancellation: false,
    lifecycleStatus: 'unlisted',
    lifecycle_status: 'unlisted',
    vdpUrl: null,
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

export const PAGE_SIZE = 24;

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
  let isAlertVerifiedQuery = false;
  let isAlertUnsubscribedQuery = false;

  try {
    const sp = useSearchParams();
    if (sp?.get('preview') === 'true') {
      isPreviewQuery = true;
    }
    if (sp?.get('alert_verified') === 'true') {
      isAlertVerifiedQuery = true;
    }
    if (sp?.get('alert_unsubscribed') === 'true') {
      isAlertUnsubscribedQuery = true;
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
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [dismissedBanner, setDismissedBanner] = useState(false);

  // Sync state if initialListings changes (e.g. tests or SSR)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setListings(initialListings);
  }, [initialListings]);

  // Client-side hydration from /api/inventory to display live observed inventory
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isMounted = true;
    fetch('/api/inventory', { cache: 'no-store' })
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
    sortBy: 'newest',
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setVisibleCount(PAGE_SIZE);
  };

  // Keep filter in sync if queryModel or searchParams update (case-insensitively normalizing e.g. 'sienna' -> 'Sienna')
  useEffect(() => {
    if (!queryModel) return;
    const matched = listings.find(
      (l) => l.model.toLowerCase() === queryModel.toLowerCase()
    );
    const targetModel = matched ? matched.model : queryModel;
    if (filters.model !== targetModel) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFilters((prev) => ({ ...prev, model: targetModel }));
      setVisibleCount(PAGE_SIZE);
    }
  }, [queryModel, listings, filters.model]);

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
      const lowerDealer = item.dealerName.toLowerCase();
      const city =
        item.dealerCity ||
        (lowerDealer.includes('surrey')
          ? 'Surrey'
          : lowerDealer.includes('west coast')
          ? 'Pitt Meadows'
          : lowerDealer.includes('richmond') || lowerDealer.includes('openroad')
          ? 'Richmond'
          : 'Vancouver');

      if (city.toLowerCase() === 'vancouver') {
        locMap.set('Vancouver', 'Vancouver (Downtown)');
      } else if (city.toLowerCase() === 'surrey') {
        locMap.set('Surrey', 'Surrey (Guildford)');
      } else if (city.toLowerCase() === 'richmond') {
        locMap.set('Richmond', 'Richmond');
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
    Object.values(DEALERS).forEach((d) => set.add(d.name));
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

    const hasRecentObservation = withDistance.some((item) => {
      const st = (item.status || '').toLowerCase();
      const lc = (item.lifecycleStatus || item.lifecycle_status || 'active').toLowerCase();
      if (
        lc === 'sold' ||
        lc === 'unlisted' ||
        st.includes('stale') ||
        st.includes('no longer') ||
        st.includes('removed') ||
        st.includes('quarantined') ||
        st.includes('sold')
      ) {
        return false;
      }
      const checkTime = new Date(item.lastChecked).getTime();
      return !isNaN(checkTime) && currentTime - checkTime <= 48 * 3600 * 1000;
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
        const lcStatus = (item.lifecycleStatus || item.lifecycle_status || 'active').toLowerCase();
        if (lcStatus === 'sold' || lcStatus === 'unlisted') {
          return false;
        }
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
        // Exclude anything older than 48 hours when recent sweep data is present
        if (hasRecentObservation) {
          const checkTime = new Date(item.lastChecked).getTime();
          if (!isNaN(checkTime) && currentTime - checkTime > 48 * 3600 * 1000) {
            return false;
          }
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

    // 3. Sorting Engine
    const shouldSortNearest = filters.sortNearest ?? Boolean(userCoordinates);
    const activeSort =
      filters.sortBy || (shouldSortNearest && userCoordinates ? 'distance_asc' : 'newest');

    filtered.sort((a, b) => {
      if (activeSort === 'newest') {
        const dateA = new Date(a.postedAt || a.firstSeenAt || a.lastChecked || 0).getTime();
        const dateB = new Date(b.postedAt || b.firstSeenAt || b.lastChecked || 0).getTime();
        if (dateB !== dateA) return dateB - dateA;
        return a.id.localeCompare(b.id);
      }

      if (activeSort === 'price_asc') {
        const priceA = a.sellingPrice != null ? a.sellingPrice : (a.msrp != null ? a.msrp : null);
        const priceB = b.sellingPrice != null ? b.sellingPrice : (b.msrp != null ? b.msrp : null);
        if (priceA == null && priceB == null) return 0;
        if (priceA == null) return 1;
        if (priceB == null) return -1;
        if (priceA !== priceB) return priceA - priceB;
        return a.id.localeCompare(b.id);
      }

      if (activeSort === 'price_desc') {
        const priceA = a.sellingPrice != null ? a.sellingPrice : (a.msrp != null ? a.msrp : null);
        const priceB = b.sellingPrice != null ? b.sellingPrice : (b.msrp != null ? b.msrp : null);
        if (priceA == null && priceB == null) return 0;
        if (priceA == null) return 1;
        if (priceB == null) return -1;
        if (priceA !== priceB) return priceB - priceA;
        return a.id.localeCompare(b.id);
      }

      if (activeSort === 'distance_asc') {
        const distA = a.distanceKm != null ? a.distanceKm : Infinity;
        const distB = b.distanceKm != null ? b.distanceKm : Infinity;
        if (distA !== distB) return distA - distB;
        return a.id.localeCompare(b.id);
      }

      if (activeSort === 'status') {
        const getStatusRank = (status?: string | null) => {
          const s = (status || '').toLowerCase();
          // On lot units ('advertised') first
          if (s.includes('advertised') || s.includes('on lot') || s.includes('on_lot')) return 0;
          // In transit units ('incoming') second
          if (s.includes('incoming') || s.includes('transit') || s.includes('order')) return 1;
          return 2;
        };
        const rankA = getStatusRank(a.status);
        const rankB = getStatusRank(b.status);
        if (rankA !== rankB) return rankA - rankB;
        // Tie-breaker: newest
        const dateA = new Date(a.postedAt || a.firstSeenAt || a.lastChecked || 0).getTime();
        const dateB = new Date(b.postedAt || b.firstSeenAt || b.lastChecked || 0).getTime();
        return dateB - dateA;
      }

      return 0;
    });

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
    const raw = getAccessoriesForModel(filters.model || undefined, effectiveGearCounts);
    return raw.filter(
      (item) =>
        !/speaker|audio|amplifier|subwoofer|beat-sonic|tweeter/i.test(
          `${item.id} ${item.title} ${item.category}`
        )
    );
  }, [filters.model, effectiveGearCounts]);

  const displayedListings = useMemo(
    () => filteredListings.slice(0, visibleCount),
    [filteredListings, visibleCount]
  );

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
      {!dismissedBanner && isAlertVerifiedQuery && (
        <div
          data-testid="alert-verified-banner"
          role="status"
          className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-4 py-3 text-xs sm:text-sm text-emerald-200 shadow-sm"
        >
          <span>
            ✅ <strong>30-Day Free Allocation Pass Activated!</strong> Your email is verified and we are now monitoring Lower Mainland dealer drops for your vehicle.
          </span>
          <button
            type="button"
            onClick={() => setDismissedBanner(true)}
            aria-label="Dismiss confirmation banner"
            className="text-emerald-300/80 hover:text-white text-xs font-semibold shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {!dismissedBanner && isAlertUnsubscribedQuery && (
        <div
          data-testid="alert-unsubscribed-banner"
          role="status"
          className="flex items-center justify-between gap-3 rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-xs sm:text-sm text-zinc-300 shadow-sm"
        >
          <span>
            You have been unsubscribed from your 30-day allocation drop alert pass.
          </span>
          <button
            type="button"
            onClick={() => setDismissedBanner(true)}
            aria-label="Dismiss unsubscribed banner"
            className="text-zinc-400 hover:text-white text-xs font-semibold shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search & Filter Bar (Elevated immediately below header) */}
      <InventoryFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        availableModels={availableModels}
        availableLocations={availableLocations}
        availableDealers={availableDealers}
        totalResults={filteredListings.length}
        onOpenAlertModal={() => setIsAlertModalOpen(true)}
      />

      {/* Listings Grid (Rendered immediately below filter bar for mobile visibility above the fold) */}
      {filteredListings.length > 0 ? (
        <>
          <section
            data-testid="listings-grid"
            aria-label="Observed inventory listings"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4"
          >
            {displayedListings.map((listing, index) => {
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

          {/* Load More / Showing All Footer Control */}
          <div className="pt-2 pb-1 text-center" data-testid="pagination-footer">
            {visibleCount < filteredListings.length ? (
              <div data-testid="load-more-section" className="flex flex-col items-center">
                <p
                  data-testid="load-more-counter"
                  className="text-xs text-neutral-400 mb-3"
                >
                  Showing {displayedListings.length} of {filteredListings.length} vehicles
                </p>
                <button
                  type="button"
                  data-testid="load-more-btn"
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                  className="px-6 py-2.5 rounded-xl border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm transition-colors shadow-sm"
                >
                  Load 24 More Vehicles ({filteredListings.length - displayedListings.length} remaining)
                </button>
              </div>
            ) : (
              <p
                data-testid="showing-all-message"
                className="text-xs text-neutral-400"
              >
                Showing all {filteredListings.length} observed vehicles
              </p>
            )}
          </div>
        </>
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

      {/* Allocation Drop Alerts Modal */}
      <InventoryAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        initialModel={filters.model}
        initialTrim={filters.search || 'ALL'}
        initialRegion={
          filters.location && filters.location !== 'Near Me (GPS)'
            ? `${filters.location}, BC`
            : 'Lower Mainland, BC'
        }
        availableModels={availableModels}
      />

      {/* Non-intrusive Coffee Donation Reminder after 3 listing views */}
      <DonationToast
        isOpen={showReminder}
        onDismiss={dismissReminder}
        modelContext={filters.model || null}
      />
    </div>
  );
}
