import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {
  ActivityTicker,
  formatRelativeTime,
  formatVehicleDescription,
  formatActionDescription,
  formatTickerSummary,
} from '@/components/feed/ActivityTicker';
import { RecentActivityItem } from '@/lib/types/contracts';

describe('Activity Ticker Formatting Helpers', () => {
  it('formats relative time correctly for various intervals', () => {
    const now = new Date();

    // Just now (within 1 minute)
    const justNow = new Date(now.getTime() - 30 * 1000).toISOString();
    expect(formatRelativeTime(justNow)).toBe('Just now');

    // 2 hours ago
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(twoHoursAgo)).toBe('2h ago');

    // Yesterday (26 hours ago)
    const yesterday = new Date(now.getTime() - 26 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(yesterday)).toBe('Yesterday');
  });

  it('formats vehicle description cleanly without duplication', () => {
    // Example 1: RAV4 Plug-in Hybrid SE
    const item1: RecentActivityItem = {
      id: '1',
      province: 'BC',
      model_name: 'RAV4',
      trim_name: 'SE',
      powertrain: 'Plug-in Hybrid (PHEV)',
      status: 'pending',
      lifecycle_status: 'deposit_placed',
      order_date: '2026-01-01',
      delivered_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      model_year: 2026,
    };
    expect(formatVehicleDescription(item1)).toBe('2026 RAV4 Plug-in Hybrid SE');

    // Example 2: Tacoma i-FORCE Turbo SR5
    const item2: RecentActivityItem = {
      id: '2',
      province: 'ON',
      model_name: 'Tacoma',
      trim_name: 'SR5',
      powertrain: 'i-FORCE Turbo',
      status: 'pending',
      lifecycle_status: 'in_transit',
      order_date: '2026-01-01',
      delivered_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      model_year: 2026,
    };
    expect(formatVehicleDescription(item2)).toBe('2026 Tacoma i-FORCE Turbo SR5');

    // Example 3: Sienna XSE AWD
    const item3: RecentActivityItem = {
      id: '3',
      province: 'AB',
      model_name: 'Sienna',
      trim_name: 'XSE AWD',
      powertrain: 'Hybrid (HEV)',
      status: 'delivered',
      lifecycle_status: 'delivered',
      order_date: '2025-10-01',
      delivered_date: '2026-02-20',
      wait_days: 142,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      model_year: 2026,
    };
    expect(formatVehicleDescription(item3)).toContain('2026 Sienna');
    expect(formatVehicleDescription(item3)).toContain('XSE AWD');
  });

  it('formats lifecycle actions accurately for deposits, transitions, and deliveries', () => {
    const depositItem: RecentActivityItem = {
      id: '1',
      province: 'BC',
      model_name: 'RAV4',
      trim_name: 'SE',
      powertrain: 'PHEV',
      status: 'pending',
      lifecycle_status: 'deposit_placed',
      order_date: '2026-01-01',
      delivered_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    expect(formatActionDescription(depositItem)).toBe('placed on deposit');

    const inTransitItem: RecentActivityItem = {
      ...depositItem,
      lifecycle_status: 'in_transit',
    };
    expect(formatActionDescription(inTransitItem)).toBe('advanced to In Transit');

    const vinItem: RecentActivityItem = {
      ...depositItem,
      lifecycle_status: 'vin_assigned',
    };
    expect(formatActionDescription(vinItem)).toBe('advanced to VIN Assigned');

    const deliveredItem: RecentActivityItem = {
      ...depositItem,
      status: 'delivered',
      lifecycle_status: 'delivered',
      wait_days: 142,
    };
    expect(formatActionDescription(deliveredItem)).toBe('delivered (142 days wait)');
  });

  it('produces the exact formatted summary string for example cases', () => {
    const item1: RecentActivityItem = {
      id: '1',
      province: 'BC',
      model_name: 'RAV4',
      trim_name: 'SE',
      powertrain: 'Plug-in Hybrid (PHEV)',
      status: 'pending',
      lifecycle_status: 'deposit_placed',
      order_date: '2026-01-01',
      delivered_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      model_year: 2026,
    };
    expect(formatTickerSummary(item1)).toBe('Just now • BC: 2026 RAV4 Plug-in Hybrid SE placed on deposit');
  });
});

describe('ActivityTicker Component', () => {
  const mockSubmissions: RecentActivityItem[] = [
    {
      id: 'rec-1',
      province: 'BC',
      model_name: 'RAV4',
      trim_name: 'SE',
      powertrain: 'Plug-in Hybrid (PHEV)',
      status: 'pending',
      lifecycle_status: 'deposit_placed',
      order_date: '2026-01-01',
      delivered_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      model_year: 2026,
    },
    {
      id: 'rec-2',
      province: 'ON',
      model_name: 'Tacoma',
      trim_name: 'SR5',
      powertrain: 'i-FORCE Turbo',
      status: 'pending',
      lifecycle_status: 'in_transit',
      order_date: '2026-01-01',
      delivered_date: null,
      created_at: new Date(Date.now() - 7200000).toISOString(),
      updated_at: new Date(Date.now() - 7200000).toISOString(),
      model_year: 2026,
    },
    {
      id: 'rec-3',
      province: 'AB',
      model_name: 'Sienna',
      trim_name: 'XSE AWD',
      powertrain: 'Hybrid',
      status: 'delivered',
      lifecycle_status: 'delivered',
      wait_days: 142,
      order_date: '2025-10-01',
      delivered_date: '2026-02-20',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
      model_year: 2026,
    },
  ];

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the live activity badge and accessible aria-live container', () => {
    render(<ActivityTicker initialData={mockSubmissions} />);

    // Live Badge Indicator
    expect(screen.getByText(/Canadian Activity Pulse/i)).toBeInTheDocument();

    // Accessibility
    const container = screen.getByRole('region', { name: /Live Canadian Toyota order activity/i });
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute('aria-live', 'polite');

    // First item content rendered
    expect(screen.getByText(/placed on deposit/i)).toBeInTheDocument();
  });

  it('allows manual progression with next and previous navigation buttons', () => {
    render(<ActivityTicker initialData={mockSubmissions} />);

    // Click Next
    const nextBtn = screen.getByRole('button', { name: /Next update/i });
    fireEvent.click(nextBtn);

    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Should now display the second item
    expect(screen.getByText(/advanced to In Transit/i)).toBeInTheDocument();

    // Click Previous
    const prevBtn = screen.getByRole('button', { name: /Previous update/i });
    fireEvent.click(prevBtn);

    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Should return to first item
    expect(screen.getByText(/placed on deposit/i)).toBeInTheDocument();
  });

  it('pauses auto-scrolling when hovered or focused', () => {
    render(<ActivityTicker initialData={mockSubmissions} />);

    const container = screen.getByRole('region', { name: /Live Canadian Toyota order activity/i });

    // Hover container
    fireEvent.mouseEnter(container);

    // Advance interval timer beyond 4500ms
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Still on first item because paused
    expect(screen.getByText(/placed on deposit/i)).toBeInTheDocument();

    // Leave hover
    fireEvent.mouseLeave(container);

    // Advance timers
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Successfully rotated to next item
    expect(screen.getByText(/advanced to In Transit/i)).toBeInTheDocument();
  });

  it('respects prefers-reduced-motion by rendering a static horizontal scrollable list', () => {
    // Mock matchMedia for prefers-reduced-motion
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<ActivityTicker initialData={mockSubmissions} />);

    // In reduced motion mode, all items are listed as static pills in a scrollable list
    const scrollContainer = screen.getByLabelText(/Scrollable list of recent community submissions/i);
    expect(scrollContainer).toBeInTheDocument();

    expect(screen.getByText(/BC: 2026 RAV4 Plug-in Hybrid SE placed on deposit/i)).toBeInTheDocument();
    expect(screen.getByText(/ON: 2026 Tacoma i-FORCE Turbo SR5 advanced to In Transit/i)).toBeInTheDocument();
    expect(screen.getByText(/AB: 2026 Sienna/i)).toBeInTheDocument();
  });

  it('returns null cleanly when no submissions are provided', () => {
    const { container } = render(<ActivityTicker initialData={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
