import React, { useState } from 'react';
import { RotateCcw, Search, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface LocationOption {
  value: string;
  label: string;
}

export interface FilterState {
  model: string;
  status: string;
  dealer?: string;
  location?: string;
  minPrice: string;
  maxPrice: string;
  search: string;
}

export interface InventoryFilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  availableModels?: string[];
  availableLocations?: (LocationOption | string)[];
  availableDealers?: string[];
  totalResults?: number;
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

const DEFAULT_LOCATIONS: LocationOption[] = [
  { value: 'Vancouver', label: 'Vancouver (Downtown)' },
  { value: 'Surrey', label: 'Surrey (Guildford)' },
];

export function InventoryFilterBar({
  filters,
  onFilterChange,
  availableModels = DEFAULT_MODELS,
  availableLocations,
  availableDealers,
  totalResults,
}: InventoryFilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const rawLocations = (
    availableLocations && availableLocations.length > 0
      ? availableLocations
      : availableDealers && availableDealers.length > 0
      ? availableDealers.map((d) => {
          if (d.toLowerCase().includes('surrey')) {
            return { value: 'Surrey', label: 'Surrey (Guildford)' };
          }
          if (d.toLowerCase().includes('downtown') || d.toLowerCase().includes('vancouver')) {
            return { value: 'Vancouver', label: 'Vancouver (Downtown)' };
          }
          return { value: d, label: d };
        })
      : DEFAULT_LOCATIONS
  ).map((item) => (typeof item === 'string' ? { value: item, label: item } : item));

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
    onFilterChange({ ...filters, location: val, dealer: val });
  };

  const handleDealerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleLocationChange(e);
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
    onFilterChange({
      model: '',
      status: '',
      dealer: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      search: '',
    });
  };

  const activeFacetCount = [
    Boolean(filters.model),
    Boolean(filters.status),
    Boolean(filters.location || filters.dealer),
    Boolean(filters.minPrice || filters.maxPrice),
  ].filter(Boolean).length;

  const hasActiveFilters = Boolean(
    filters.model ||
      filters.status ||
      filters.location ||
      filters.dealer ||
      filters.minPrice ||
      filters.maxPrice ||
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

      {/* Collapsible Filter Tray: Compact 2-column on mobile, 4-column on desktop */}
      <div
        id="collapsible-filter-tray"
        data-testid="collapsible-filter-tray"
        className={`${isExpanded ? 'block' : 'hidden'} md:block pt-2.5 mt-2.5 border-t border-zinc-800/80`}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
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

          {/* Column 2: Location / Region */}
          <div className="space-y-1">
            <label htmlFor="filter-location" className="text-[11px] font-medium text-zinc-400 block">
              Location / Region
            </label>
            <select
              id="filter-location"
              data-testid="filter-location-select"
              aria-label="Filter by location"
              value={filters.location || filters.dealer || ''}
              onChange={handleLocationChange}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-200 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="">All Locations</option>
              {uniqueLocations.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>

          {/* Column 3: Status */}
          <div className="space-y-1">
            <label htmlFor="filter-status" className="text-[11px] font-medium text-zinc-400 block">
              Observed Status
            </label>
            <select
              id="filter-status"
              data-testid="filter-status-select"
              aria-label="Filter by observed status"
              value={filters.status}
              onChange={handleStatusChange}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-200 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="">All Statuses</option>
              <option value="Advertised - availability unconfirmed">Advertised - availability unconfirmed</option>
              <option value="Incoming availability unconfirmed">Incoming availability unconfirmed</option>
              <option value="Reserved / sold">Reserved / sold</option>
              <option value="No longer observed / stale">No longer observed / stale</option>
            </select>
          </div>

          {/* Column 4: Price Range */}
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
