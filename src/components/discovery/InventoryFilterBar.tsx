import React, { useState } from 'react';
import { RotateCcw, Search, SlidersHorizontal, ChevronDown, ChevronUp, Navigation, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPresetCoordinates } from '@/lib/geo/distance';

export interface LocationOption {
  value: string;
  label: string;
}

export type SortOption =
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'distance_asc'
  | 'status';

export interface FilterState {
  model: string;
  status: string;
  dealer?: string;
  location?: string;
  minPrice: string;
  maxPrice: string;
  search: string;
  userLocation?: string;
  userCoordinates?: { lat: number; lng: number } | null;
  maxDistance?: string; // e.g. "", "15", "30", "50"
  sortNearest?: boolean;
  sortBy?: SortOption;
}

export interface InventoryFilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  availableModels?: string[];
  availableLocations?: (LocationOption | string)[];
  availableDealers?: string[];
  totalResults?: number;
  onOpenAlertModal?: () => void;
}

const DEFAULT_MODELS = [
  'RAV4 Hybrid',
  'RAV4 Prime',
  'Sienna',
  'Grand Highlander',
  'Grand Highlander Hybrid',
  'Land Cruiser',
  'Tacoma',
  'Prius Prime',
  'Camry Hybrid',
  'Corolla Cross Hybrid',
];

const DEFAULT_MUNICIPALITY_LOCATIONS: LocationOption[] = [
  { value: '', label: 'All Locations' },
  { value: 'Vancouver', label: 'Vancouver (Downtown)' },
  { value: 'Burnaby', label: 'Burnaby' },
  { value: 'Surrey', label: 'Surrey (Guildford)' },
  { value: 'Richmond', label: 'Richmond' },
  { value: 'Coquitlam', label: 'Coquitlam / Tri-Cities' },
  { value: 'Pitt Meadows', label: 'Pitt Meadows (West Coast)' },
  { value: 'Langley', label: 'Langley' },
  { value: 'Abbotsford', label: 'Abbotsford' },
];

export function InventoryFilterBar({
  filters,
  onFilterChange,
  availableModels = DEFAULT_MODELS,
  availableLocations,
  availableDealers,
  totalResults,
  onOpenAlertModal,
}: InventoryFilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Combine default municipality presets with any runtime observed locations
  const rawLocations: LocationOption[] = [...DEFAULT_MUNICIPALITY_LOCATIONS];
  if (availableLocations && availableLocations.length > 0) {
    for (const loc of availableLocations) {
      if (typeof loc === 'string') {
        rawLocations.push({ value: loc, label: loc });
      } else {
        rawLocations.push(loc);
      }
    }
  } else if (availableDealers && availableDealers.length > 0) {
    for (const d of availableDealers) {
      const lowerD = d.toLowerCase();
      if (lowerD.includes('surrey')) {
        rawLocations.push({ value: 'Surrey', label: 'Surrey (Guildford)' });
      } else if (lowerD.includes('west coast') || lowerD.includes('pitt meadows')) {
        rawLocations.push({ value: 'Pitt Meadows', label: 'Pitt Meadows (West Coast)' });
      } else if (lowerD.includes('richmond') || lowerD.includes('openroad')) {
        rawLocations.push({ value: 'Richmond', label: 'Richmond' });
      } else if (lowerD.includes('downtown') || lowerD.includes('regency') || lowerD.includes('vancouver')) {
        rawLocations.push({ value: 'Vancouver', label: 'Vancouver (Downtown)' });
      } else {
        rawLocations.push({ value: d, label: d });
      }
    }
  }

  const uniqueLocations: LocationOption[] = [];
  const seenValues = new Set<string>();
  for (const loc of rawLocations) {
    if (!seenValues.has(loc.value)) {
      seenValues.add(loc.value);
      uniqueLocations.push(loc);
    }
  }

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, model: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, status: e.target.value });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setLocationError(null);
    const coords = val ? getPresetCoordinates(val) : null;
    onFilterChange({
      ...filters,
      location: val,
      userLocation: val,
      userCoordinates: coords,
      dealer: val,
      sortNearest: Boolean(val) ? true : (filters.sortNearest ?? false),
      sortBy: Boolean(val) ? 'distance_asc' : (filters.sortBy || 'newest'),
    });
  };

  const handleMaxDistanceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      maxDistance: e.target.value,
    });
  };

  const handleSortNearestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    onFilterChange({
      ...filters,
      sortNearest: checked,
      sortBy: checked ? 'distance_asc' : 'newest',
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as SortOption;
    onFilterChange({
      ...filters,
      sortBy: val,
      sortNearest: val === 'distance_asc',
    });
  };

  const handleGpsLocation = () => {
    setLocationError(null);

    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        setIsLocating(false);
        setLocationError(null);
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        onFilterChange({
          ...filters,
          location: 'Near Me (GPS)',
          userLocation: 'Near Me (GPS)',
          userCoordinates: coords,
          dealer: '',
          sortNearest: true,
        });
      },
      (error: GeolocationPositionError) => {
        if (error.code === 1) { // PERMISSION_DENIED
          setLocationError('Location permission denied. Please choose a city below.');
        } else {
          setLocationError('Could not detect location. Please choose a municipality.');
        }
        setIsLocating(false);
      },
      {
        enableHighAccuracy: false, // Prevents timeouts on desktop Wi-Fi / IP triangulation
        timeout: 10000,            // 10s timeout
        maximumAge: 300000,        // Accept cached position up to 5 minutes
      }
    );
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, minPrice: e.target.value });
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, maxPrice: e.target.value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleReset = () => {
    setLocationError(null);
    setIsLocating(false);
    onFilterChange({
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
    });
  };

  const activeFacetCount = [
    Boolean(filters.model),
    Boolean(filters.status && filters.status !== 'advertised'),
    Boolean(filters.location || filters.dealer || filters.userCoordinates),
    Boolean(filters.maxDistance),
    Boolean(filters.minPrice || filters.maxPrice),
    Boolean(filters.sortBy && filters.sortBy !== 'newest'),
  ].filter(Boolean).length;

  const hasActiveFilters = Boolean(
    filters.model ||
      (filters.status && filters.status !== 'advertised') ||
      filters.location ||
      filters.dealer ||
      filters.userCoordinates ||
      filters.maxDistance ||
      filters.minPrice ||
      filters.maxPrice ||
      (filters.sortBy && filters.sortBy !== 'newest') ||
      filters.search
  );

  return (
    <section
      data-testid="inventory-filter-bar"
      aria-label="Filter inventory listings"
      className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-2.5 sm:p-3 shadow-sm backdrop-blur-sm relative z-10"
    >
      {/* Primary Row (Always Visible): Search + Mobile Filter Toggle + Results Count + Clear */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 min-w-0">
          <input
            id="filter-search"
            type="text"
            placeholder="Search model, trim, VIN..."
            data-testid="filter-search-input"
            aria-label="Search by trim, color or VIN"
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-7 pr-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
          <Search className="h-3.5 w-3.5 text-zinc-500 absolute left-2 top-2 pointer-events-none" aria-hidden="true" />
        </div>

        {/* Mobile Toggle Button */}
        <button
          type="button"
          data-testid="toggle-filters-btn"
          aria-label="Toggle filter options"
          aria-expanded={isExpanded}
          aria-controls="collapsible-filter-tray"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition md:hidden shrink-0 ${
            isExpanded || activeFacetCount > 0
              ? 'border-red-800/80 bg-red-950/40 text-red-300'
              : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:text-white hover:border-zinc-700'
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>Filters</span>
          {activeFacetCount > 0 && (
            <span className="inline-flex items-center justify-center bg-red-600 text-white text-[10px] font-bold rounded-full h-4 min-w-4 px-1">
              {activeFacetCount}
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="h-3 w-3 shrink-0" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-3 w-3 shrink-0" aria-hidden="true" />
          )}
        </button>

        {/* Total Results Count */}
        {totalResults !== undefined && (
          <span
            data-testid="filter-results-count"
            className="text-xs text-zinc-400 font-mono bg-zinc-950 border border-zinc-800/80 px-2 py-1.5 rounded-lg shrink-0 whitespace-nowrap"
          >
            {totalResults} {totalResults === 1 ? 'unit' : 'units'} <span className="hidden sm:inline">observed</span>
          </span>
        )}

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            data-testid="reset-filters-btn"
            className="text-xs text-zinc-400 hover:text-zinc-200 h-7 px-2 flex items-center gap-1 shrink-0"
            aria-label="Reset all search filters"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            <span className="hidden sm:inline">Clear</span>
          </Button>
        )}
      </div>

      {/* Collapsible Filter Tray: Compact 2-column on mobile, 5-column on desktop */}
      <div
        id="collapsible-filter-tray"
        data-testid="collapsible-filter-tray"
        className={`${isExpanded ? 'block' : 'hidden'} md:block pt-2.5 mt-2.5 border-t border-zinc-800/80`}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 text-xs">
          {/* Column 1: Model */}
          <div className="space-y-1">
            <label htmlFor="filter-model" className="text-[11px] font-medium text-zinc-400 block">
              Model
            </label>
            <select
              id="filter-model"
              data-testid="filter-model-select"
              aria-label="Filter by vehicle model"
              value={filters.model}
              onChange={handleModelChange}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-200 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="">All Models</option>
              {availableModels.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Column 2: User Location & Distance */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="filter-location" className="text-[11px] font-medium text-zinc-400 block">
                User Location
              </label>
              <button
                type="button"
                data-testid="gps-location-btn"
                onClick={handleGpsLocation}
                disabled={isLocating}
                className="inline-flex items-center gap-1 text-[10px] text-sky-400 hover:text-sky-300 disabled:opacity-60 font-medium transition-colors"
                title="Use current GPS location"
              >
                {isLocating ? (
                  <Loader2
                    data-testid="gps-loading-spinner"
                    className="h-2.5 w-2.5 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <Navigation className="h-2.5 w-2.5" aria-hidden="true" />
                )}
                <span>{isLocating ? 'Locating...' : 'Near Me (GPS)'}</span>
              </button>
            </div>
            {locationError && (
              <div
                data-testid="gps-error-banner"
                role="alert"
                className="rounded-md border border-amber-800/60 bg-amber-950/50 px-2 py-1 text-[11px] text-amber-300 flex items-center gap-1.5"
              >
                <AlertCircle className="h-3 w-3 shrink-0 text-amber-400" aria-hidden="true" />
                <span>{locationError}</span>
              </div>
            )}
            <select
              id="filter-location"
              data-testid="filter-location-select"
              aria-label="Filter by location"
              value={filters.location || ''}
              onChange={handleLocationChange}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-200 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              {filters.location === 'Near Me (GPS)' && (
                <option value="Near Me (GPS)">📍 Near Me (GPS)</option>
              )}
              {uniqueLocations.map((loc) => (
                <option key={loc.value || 'all'} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>

            {/* Radius & Proximity Sort Controls */}
            <div className="flex items-center justify-between gap-1.5 pt-0.5">
              <select
                id="filter-max-distance"
                data-testid="filter-max-distance-select"
                aria-label="Filter by maximum distance"
                value={filters.maxDistance || ''}
                onChange={handleMaxDistanceChange}
                className="w-1/2 rounded border border-zinc-800 bg-zinc-950 px-1.5 py-1 text-[11px] text-zinc-300 focus:border-red-500 focus:outline-none"
              >
                <option value="">Any distance</option>
                <option value="15">Within 15 km</option>
                <option value="30">Within 30 km</option>
                <option value="50">Within 50 km</option>
              </select>
              <label
                htmlFor="filter-sort-nearest"
                className="flex items-center gap-1 text-[10px] text-zinc-400 cursor-pointer select-none whitespace-nowrap"
              >
                <input
                  type="checkbox"
                  id="filter-sort-nearest"
                  data-testid="filter-sort-nearest-toggle"
                  checked={filters.sortNearest ?? false}
                  onChange={handleSortNearestChange}
                  className="rounded border-zinc-700 bg-zinc-950 text-red-600 focus:ring-0 h-3 w-3"
                />
                <span>Sort nearest</span>
              </label>
            </div>
          </div>

          {/* Column 3: Sort by + Drop Alerts CTA */}
          <div className="space-y-1">
            <label htmlFor="filter-sort" className="text-[11px] font-medium text-zinc-400 block">
              Sort by
            </label>
            <div className="flex items-center gap-1.5">
              <select
                id="filter-sort"
                data-testid="filter-sort-select"
                aria-label="Sort inventory listings"
                value={filters.sortBy || 'newest'}
                onChange={handleSortChange}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-200 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="newest">Newest Listing (Dealer Posted Date)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="distance_asc">Distance: Closest First</option>
                <option value="status">Lot Status (On Lot first, then In Transit)</option>
              </select>
              {onOpenAlertModal && (
                <button
                  type="button"
                  data-testid="get-drop-alerts-btn"
                  onClick={onOpenAlertModal}
                  className="inline-flex items-center gap-1 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1.5 text-xs font-semibold text-amber-300 transition whitespace-nowrap shrink-0"
                >
                  🔔 Get Drop Alerts
                </button>
              )}
            </div>
          </div>

          {/* Column 4: Status */}
          <div className="space-y-1">
            <label htmlFor="filter-status" className="text-[11px] font-medium text-zinc-400 block">
              Observed Status
            </label>
            <select
              id="filter-status"
              data-testid="filter-status-select"
              aria-label="Filter by observed status"
              value={filters.status ?? 'advertised'}
              onChange={handleStatusChange}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-200 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="advertised">Active / Verified Live</option>
              <option value="all">All Statuses</option>
              <option value="Advertised - availability unconfirmed">Advertised - availability unconfirmed</option>
              <option value="Incoming availability unconfirmed">Incoming availability unconfirmed</option>
              <option value="Reserved / sold">Reserved / sold</option>
              <option value="No longer observed / stale">No longer observed / stale</option>
            </select>
          </div>

          {/* Column 5: Price Range */}
          <div className="space-y-1">
            <label htmlFor="filter-min-price" className="text-[11px] font-medium text-zinc-400 block">
              Price Range ($ CAD)
            </label>
            <div className="flex items-center gap-1.5">
              <input
                id="filter-min-price"
                type="number"
                placeholder="Min $"
                data-testid="filter-min-price-input"
                aria-label="Minimum advertised price in Canadian dollars"
                value={filters.minPrice}
                onChange={handleMinPriceChange}
                className="w-1/2 rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <span className="text-zinc-600 text-xs">-</span>
              <input
                id="filter-max-price"
                type="number"
                placeholder="Max $"
                data-testid="filter-max-price-input"
                aria-label="Maximum advertised price in Canadian dollars"
                value={filters.maxPrice}
                onChange={handleMaxPriceChange}
                className="w-1/2 rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
