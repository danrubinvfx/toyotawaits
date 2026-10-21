import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  ActivityTicker,
  TickerWire,
  formatRelativeTime,
  formatVehicleDescription,
  formatActionDescription,
  formatTickerSummary,
} from '@/components/feed/ActivityTicker';
import { RecentActivityItem } from '@/lib/types/contracts';
import { TickerItem, TICKER_BADGE_COLORS } from '@/types/ticker';
import * as gearTelemetry from '@/lib/gear/telemetry';

describe('Activity Ticker Formatting Helpers', () => {
  it('formats relative time correctly for various intervals', () => {
    const now = new Date();

    const justNow = new Date(now.getTime() - 30 * 1000).toISOString();
    expect(formatRelativeTime(justNow)).toBe('Just now');

    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(twoHoursAgo)).toBe('2h ago');

    const yesterday = new Date(now.getTime() - 26 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(yesterday)).toBe('Yesterday');
  });

  it('formats vehicle description cleanly without duplication', () => {
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

describe('TickerWire & ActivityTicker — 4-Stream Interleaved Marquee', () => {
  const mockFourStreamData: TickerItem[] = [
    {
      id: 'news-1',
      type: 'news',
      badge: '[🗞️ UPDATE]',
      badgeColor: TICKER_BADGE_COLORS.news,
      text: 'BC PHEV clean energy rebate allocations update • Track latest eligible trims',
      linkUrl: '/',
      isExternal: false,
    },
    {
      id: 'inv-1',
      type: 'inventory',
      badge: 'LIVE LOT',
      badgeColor: TICKER_BADGE_COLORS.inventory,
      text: '2026 RAV4 HEV XSE • JP Toyota Downtown (Vancouver)',
      linkUrl: '/inventory?q=JTDACAAJ0T3038212',
      isExternal: false,
    },
    {
      id: 'del-1',
      type: 'delivery',
      badge: '[📦 DELIVERED]',
      badgeColor: TICKER_BADGE_COLORS.delivery,
      text: '2026 RAV4 SE delivered in BC after 240 days',
      linkUrl: '/',
      isExternal: false,
    },
    {
      id: 'gear-1',
      type: 'gear',
      badge: '[⚡ GEAR PICK]',
      badgeColor: TICKER_BADGE_COLORS.gear,
      text: 'Custom-fit all-weather rubber floor liners & trunk spill mats',
      linkUrl: 'https://www.amazon.ca/s?k=Toyota+custom+fit+floor+liners&tag=toyotawaits-20',
      isExternal: true,
      accessoryId: 'all-weather-floor-liners',
      modelContext: 'universal',
    },
  ];

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders all 4 interleaved content streams with high-contrast badges and links', () => {
    render(<TickerWire initialData={mockFourStreamData} />);

    // Verify all 4 stream badges render
    expect(screen.getAllByText('[🗞️ UPDATE]').length).toBeGreaterThan(0);
    expect(screen.getAllByText('LIVE LOT').length).toBeGreaterThan(0);
    expect(screen.getAllByText('[📦 DELIVERED]').length).toBeGreaterThan(0);
    expect(screen.getAllByText('[⚡ GEAR PICK]').length).toBeGreaterThan(0);

    // Verify inventory link points to /inventory?q={vin}
    const inventoryLinks = screen.getAllByRole('link', {
      name: /2026 RAV4 HEV XSE/i,
    });
    expect(inventoryLinks[0]).toHaveAttribute('href', '/inventory?q=JTDACAAJ0T3038212');

    // Verify gear link has external target="_blank" and rel="noopener noreferrer"
    const gearLinks = screen.getAllByRole('link', {
      name: /Custom-fit all-weather rubber floor liners/i,
    });
    expect(gearLinks[0]).toHaveAttribute(
      'href',
      'https://www.amazon.ca/s?k=Toyota+custom+fit+floor+liners&tag=toyotawaits-20'
    );
    expect(gearLinks[0]).toHaveAttribute('target', '_blank');
    expect(gearLinks[0]).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('fires trackAffiliateClick telemetry when a gear ticker item is clicked', () => {
    const spy = vi.spyOn(gearTelemetry, 'trackAffiliateClick').mockImplementation(() => {});
    render(<ActivityTicker initialData={mockFourStreamData} />);

    const gearLinks = screen.getAllByRole('link', {
      name: /Custom-fit all-weather rubber floor liners/i,
    });
    fireEvent.click(gearLinks[0]);

    expect(spy).toHaveBeenCalledWith({
      accessory_id: 'all-weather-floor-liners',
      placement: 'inventory_feed',
      model_context: 'universal',
      target_url: 'https://www.amazon.ca/s?k=Toyota+custom+fit+floor+liners&tag=toyotawaits-20',
    });
  });

  it('uses a comfortable 75s marquee animation duration and pauses when hovered, focused, or touched', () => {
    const { container } = render(<ActivityTicker initialData={mockFourStreamData} />);

    const region = screen.getByRole('region', {
      name: /Live Canadian Toyota (news wire|order activity)/i,
    });
    const marqueeTrack = container.querySelector('.animate-marquee') as HTMLElement;
    expect(marqueeTrack).toBeInTheDocument();
    expect(marqueeTrack.style.animationDuration).toBe('75s');
    expect(marqueeTrack.style.animationPlayState).toBe('running');
    expect(marqueeTrack.className).toContain('hover:[animation-play-state:paused]');
    expect(marqueeTrack.className).toContain('active:[animation-play-state:paused]');

    fireEvent.mouseEnter(region);
    expect(marqueeTrack.style.animationPlayState).toBe('paused');

    fireEvent.mouseLeave(region);
    expect(marqueeTrack.style.animationPlayState).toBe('running');

    fireEvent.touchStart(region);
    expect(marqueeTrack.style.animationPlayState).toBe('paused');

    fireEvent.touchEnd(region);
    expect(marqueeTrack.style.animationPlayState).toBe('running');

    fireEvent.focus(region);
    expect(marqueeTrack.style.animationPlayState).toBe('paused');
  });

  it('respects prefers-reduced-motion by rendering items in standard horizontal scroll without continuous animation', () => {
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

    const { container } = render(<ActivityTicker initialData={mockFourStreamData} />);

    expect(container.querySelector('.animate-marquee')).toBeNull();

    const scrollContainer = screen.getByLabelText(
      /Scrollable list of (curated Toyota news articles|recent community submissions)/i
    );
    expect(scrollContainer).toBeInTheDocument();
  });

  it('returns null cleanly when no items are provided', () => {
    const { container } = render(<ActivityTicker initialData={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
