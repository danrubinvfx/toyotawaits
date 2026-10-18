import React from 'react';
import { Filter, RotateCcw, Search, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface FilterState {
  model: string;
  status: string;
  dealer: string;
  minPrice: string;
  maxPrice: string;
  search: string;
}

export interface InventoryFilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  availableModels?: string[];
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

export function InventoryFilterBar({
  filters,
  onFilterChange,
  availableModels = DEFAULT_MODELS,
  availableDealers = ['Jim Pattison Toyota Downtown', 'OpenRoad Toyota Richmond', 'Granville Toyota'],
  totalResults,
}: InventoryFilterBarProps) {
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, model: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, status: e.target.value });
  };

  const handleDealerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, dealer: e.target.value });
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
      minPrice: '',
      maxPrice: '',
      search: '',
    });
  };

  const hasActiveFilters = Boolean(
    filters.model || filters.status || filters.dealer || filters.minPrice || filters.maxPrice || filters.search
  );

  return (
    <section
      data-testid="inventory-filter-bar"
      aria-label="Filter inventory listings"
      className="rounded-xl border border-zinc-800 bg-zinc-900/90 px-4 py-2 sm:p-4 shadow-sm backdrop-blur-sm relative z-10"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 sm:mb-3 sm:pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-red-400" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-zinc-100">Filter Public Inventory</h2>
          {totalResults !== undefined && (
            <span
              data-testid="filter-results-count"
              className="text-xs text-zinc-400 font-mono ml-2 bg-zinc-800 px-2 py-0.5 rounded-full"
            >
              {totalResults} {totalResults === 1 ? 'unit' : 'units'} observed
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            data-testid="reset-filters-btn"
            className="text-xs text-zinc-400 hover:text-zinc-200 h-8 px-2 flex items-center gap-1.5"
            aria-label="Reset all search filters"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Clear filters</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Model Filter */}
        <div className="space-y-1">
          <label htmlFor="filter-model" className="text-xs font-medium text-zinc-400 block">
            Model
          </label>
          <select
            id="filter-model"
            data-testid="filter-model-select"
            aria-label="Filter by vehicle model"
            value={filters.model}
            onChange={handleModelChange}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <option value="">All Models</option>
            {availableModels.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="space-y-1">
          <label htmlFor="filter-status" className="text-xs font-medium text-zinc-400 block">
            Observed Status
          </label>
          <select
            id="filter-status"
            data-testid="filter-status-select"
            aria-label="Filter by observed status"
            value={filters.status}
            onChange={handleStatusChange}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <option value="">All Statuses</option>
            <option value="Advertised - availability unconfirmed">Advertised - availability unconfirmed</option>
            <option value="Incoming availability unconfirmed">Incoming availability unconfirmed</option>
            <option value="Reserved / sold">Reserved / sold</option>
          </select>
        </div>

        {/* Dealer / Region Filter */}
        <div className="space-y-1">
          <label htmlFor="filter-dealer" className="text-xs font-medium text-zinc-400 block">
            Dealership
          </label>
          <select
            id="filter-dealer"
            data-testid="filter-dealer-select"
            aria-label="Filter by dealership"
            value={filters.dealer}
            onChange={handleDealerChange}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <option value="">All Dealerships</option>
            {availableDealers.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="space-y-1">
          <label htmlFor="filter-min-price" className="text-xs font-medium text-zinc-400 block">
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

        {/* Search Input */}
        <div className="space-y-1">
          <label htmlFor="filter-search" className="text-xs font-medium text-zinc-400 block">
            Keyword / VIN
          </label>
          <div className="relative">
            <input
              id="filter-search"
              type="text"
              placeholder="Trim, color, VIN..."
              data-testid="filter-search-input"
              aria-label="Search by trim, color or VIN"
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-7 pr-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <Search className="h-3.5 w-3.5 text-zinc-500 absolute left-2 top-2 pointer-events-none" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
