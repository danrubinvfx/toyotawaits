import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HomeFeedTabs } from '@/components/home/HomeFeedTabs';
import { InventoryFilterBar, FilterState } from '@/components/discovery/InventoryFilterBar';
import { InventoryExplorer, INITIAL_SAMPLE_LISTINGS } from '@/components/discovery/InventoryExplorer';
import { ModelSubmissionsTable } from '@/components/wait-times/ModelSubmissionsTable';
import { MarketProvider } from '@/context/MarketContext';

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));

function setViewport(width: number, height: number = 844) {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  window.dispatchEvent(new Event('resize'));
}

describe('Responsive Viewports (390px, 412px, 768px, 1024px) UI Verification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const VIEWPORTS = [
    { name: 'iPhone 14 (390px)', width: 390, height: 844, isMobile: true },
    { name: 'Pixel 7 (412px)', width: 412, height: 915, isMobile: true },
    { name: 'iPad / Tablet (768px)', width: 768, height: 1024, isMobile: false },
    { name: 'Desktop (1024px)', width: 1024, height: 768, isMobile: false },
  ];

  VIEWPORTS.forEach(({ name, width, height, isMobile }) => {
    describe(`Viewport: ${name}`, () => {
      it('renders homepage segmented tab control cleanly across all viewport widths', () => {
        setViewport(width, height);
        render(
          <HomeFeedTabs
            queueContent={<div data-testid="queue-content">Queue Tracker Feed</div>}
            pipelineContent={<div data-testid="pipeline-content">Allocated Pipeline Feed</div>}
          />
        );

        const segmentedTabs = screen.getByTestId('home-feed-segmented-tabs');
        expect(segmentedTabs).toBeInTheDocument();

        const queueTab = screen.getByTestId('feed-tab-queue');
        const pipelineTab = screen.getByTestId('feed-tab-pipeline');

        expect(queueTab).toHaveTextContent(/Queue Tracker/);
        expect(pipelineTab).toHaveTextContent(/Allocated Pipeline/);

        // Can toggle between feeds without network reload
        fireEvent.click(pipelineTab);
        expect(pipelineTab).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByTestId('panel-allocated-pipeline')).not.toHaveClass('hidden');

        fireEvent.click(queueTab);
        expect(queueTab).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByTestId('panel-queue-tracker')).not.toHaveClass('hidden');
      });

      it('verifies inventory filter drawer and compact badge behavior', () => {
        setViewport(width, height);
        const filtersWithActiveFacets: FilterState = {
          model: 'RAV4 Hybrid',
          status: 'advertised',
          cancellationsOnly: true,
          dealer: '',
          location: '',
          minPrice: '',
          maxPrice: '',
          search: '',
        };

        const onFilterChange = vi.fn();

        render(
          <InventoryFilterBar
            filters={filtersWithActiveFacets}
            onFilterChange={onFilterChange}
            totalResults={45}
            cancellationsCount={3}
          />
        );

        const filterTray = screen.getByTestId('collapsible-filter-tray');
        expect(filterTray).toBeInTheDocument();

        if (isMobile) {
          // On mobile (< 768px), drawer is collapsed by default and expandable via toggle button
          expect(filterTray).toHaveClass('hidden');
          const toggleBtn = screen.getByTestId('toggle-filters-btn');
          expect(toggleBtn).toBeInTheDocument();

          // Displays "Filters (n)" text and count badge
          expect(toggleBtn).toHaveTextContent(/Filters \([1-9]\)/);
          const badge = screen.getByTestId('active-filter-count-badge');
          expect(badge).toBeInTheDocument();

          // Clicking toggle expands the drawer
          fireEvent.click(toggleBtn);
          expect(filterTray).toHaveClass('block');
        } else {
          // On desktop (>= 768px), tray has md:block
          expect(filterTray).toHaveClass('md:block');
        }
      });

      it('verifies client-side province pills filter submissions in memory', () => {
        setViewport(width, height);
        const sampleSubmissions = [
          { id: '1', province: 'BC', model: 'Sienna', status: 'delivered', wait_days: 180 },
          { id: '2', province: 'ON', model: 'Sienna', status: 'pending' },
          { id: '3', province: 'AB', model: 'Sienna', status: 'delivered', wait_days: 120 },
        ];

        render(
          <MarketProvider initialMarket="CA">
            <ModelSubmissionsTable
              modelName="Sienna"
              slug="sienna"
              submissions={sampleSubmissions}
            />
          </MarketProvider>
        );

        // Verify All, BC, AB, ON, QC pills exist
        const allPill = screen.getByTestId('province-pill-all');
        const bcPill = screen.getByTestId('province-pill-bc');
        const abPill = screen.getByTestId('province-pill-ab');
        const onPill = screen.getByTestId('province-pill-on');
        const qcPill = screen.getByTestId('province-pill-qc');

        expect(allPill).toBeInTheDocument();
        expect(bcPill).toBeInTheDocument();
        expect(abPill).toBeInTheDocument();
        expect(onPill).toBeInTheDocument();
        expect(qcPill).toBeInTheDocument();

        // Toggling pill updates immediately in-memory
        fireEvent.click(bcPill);
        expect(bcPill).toHaveAttribute('aria-selected', 'true');
        expect(allPill).toHaveAttribute('aria-selected', 'false');

        // Table shows only BC submission
        expect(screen.getAllByRole('row').length).toBe(2); // 1 header + 1 BC row

        fireEvent.click(onPill);
        expect(onPill).toHaveAttribute('aria-selected', 'true');
        expect(screen.getAllByRole('row').length).toBe(2); // 1 header + 1 ON row
      });
    });
  });
});
