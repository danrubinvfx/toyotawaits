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
import { RecentActivityItem, TickerItem } from '@/lib/types/contracts';

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

describe('ActivityTicker Component — Alternating News Wire & Delivered Milestones', () => {
  const mockTickerData: TickerItem[] = [
    {
      type: 'delivery',
      id: 'del-1',
      province: 'BC',
      model_name: 'RAV4',
      trim_name: 'SE',
      powertrain: 'Plug-in Hybrid',
      model_year: 2026,
      daysWaited: 240,
      timestamp: '2026-10-15T12:00:00Z',
    },
    {
      type: 'news',
      id: 'news-1',
      title: 'Q4 Canadian Allocation Update: High hybrid production slots allocated for BC & ON',
      tag: 'ALLOCATION ALERT',
      url: '/guides',
      timestamp: '2026-10-14T10:00:00Z',
    },
    {
      type: 'delivery',
      id: 'del-2',
      province: 'AB',
      model_name: 'Sienna',
      trim_name: 'XSE AWD',
      powertrain: 'Hybrid',
      model_year: 2026,
      daysWaited: 142,
      timestamp: '2026-10-13T08:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders a verified delivery item with DELIVERED badge and days waited', () => {
    render(<ActivityTicker initialData={mockTickerData} />);

    // DELIVERED Badge
    expect(screen.getByText(/DELIVERED/i)).toBeInTheDocument();

    // Content format: BC: 2026 RAV4 Plug-in Hybrid SE — 240 days wait
    expect(screen.getByText('BC:')).toBeInTheDocument();
    expect(screen.getByText(/2026 RAV4 Plug-in Hybrid SE/)).toBeInTheDocument();
    expect(screen.getByText(/240 days wait/i)).toBeInTheDocument();
  });

  it('alternates to News Wire item when advancing to next ticker item', () => {
    render(<ActivityTicker initialData={mockTickerData} />);

    // Initially displays delivery
    expect(screen.getByText(/DELIVERED/i)).toBeInTheDocument();

    // Click Next
    const nextBtn = screen.getByRole('button', { name: /Next update/i });
    fireEvent.click(nextBtn);

    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Should now display the news wire announcement with ALLOCATION ALERT badge
    expect(screen.getByText(/ALLOCATION ALERT/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Q4 Canadian Allocation Update: High hybrid production slots/i)
    ).toBeInTheDocument();

    // Verify it links to the article URL
    const newsLink = screen.getByRole('link', {
      name: /Q4 Canadian Allocation Update/i,
    });
    expect(newsLink).toHaveAttribute('href', '/guides');
  });

  it('pauses auto-scrolling when hovered or focused', () => {
    render(<ActivityTicker initialData={mockTickerData} />);

    const container = screen.getByRole('region', { name: /Live Canadian Toyota order activity/i });

    // Hover container
    fireEvent.mouseEnter(container);

    // Advance timer beyond 4500ms
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Still on first delivery item because paused
    expect(screen.getByText(/240 days wait/i)).toBeInTheDocument();

    // Leave hover
    fireEvent.mouseLeave(container);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Rotated to news item
    expect(screen.getByText(/ALLOCATION ALERT/i)).toBeInTheDocument();
  });

  it('respects prefers-reduced-motion by rendering both deliveries and news alerts as static pills', () => {
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

    render(<ActivityTicker initialData={mockTickerData} />);

    const scrollContainer = screen.getByLabelText(/Scrollable list of recent community submissions/i);
    expect(scrollContainer).toBeInTheDocument();

    expect(screen.getByText(/240 days wait/i)).toBeInTheDocument();
    expect(screen.getByText(/Q4 Canadian Allocation Update/i)).toBeInTheDocument();
    expect(screen.getByText(/142 days wait/i)).toBeInTheDocument();
  });

  it('returns null cleanly when no items are provided', () => {
    const { container } = render(<ActivityTicker initialData={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
