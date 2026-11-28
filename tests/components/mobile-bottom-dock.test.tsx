import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';
import {
  MobileBottomDock,
  MobileGearDrawer,
  GEAR_DRAWER_FILTER_PILLS,
  getCuratedMobileGear,
} from '@/components/layout/MobileBottomDock';
import { MarketProvider } from '@/context/MarketContext';
import { CalculatorProvider } from '@/context/CalculatorContext';

// Mock next/navigation
let mockPathname = '/';
let mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
}));

describe('MobileBottomDock Component & Dynamic Gear Drawer', () => {
  beforeEach(() => {
    mockPathname = '/';
    mockSearchParams = new URLSearchParams();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders fixed bottom dock on mobile with 5 thumb slots and responsive classes', () => {
    render(
      <MarketProvider>
        <MobileBottomDock />
      </MarketProvider>
    );

    const dock = screen.getByTestId('mobile-bottom-dock');
    expect(dock).toBeInTheDocument();
    expect(dock).toHaveClass(
      'fixed',
      'bottom-4',
      'z-40',
      'md:hidden',
      'left-3',
      'right-3',
      'rounded-full',
      'bg-zinc-950/90',
      'backdrop-blur-xl',
      'border',
      'border-zinc-800/90'
    );

    // 5 Slots
    expect(screen.getByTestId('mobile-dock-tracker')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-dock-inventory')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-dock-guides')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-dock-gear')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-dock-calculator')).toBeInTheDocument();

    // Default universal labels
    expect(screen.getByText('Tracker')).toBeInTheDocument();
    expect(screen.getByText('Live Stock')).toBeInTheDocument();
    expect(screen.getByText('Guides')).toBeInTheDocument();
    expect(screen.getByText('Gear')).toBeInTheDocument();
    expect(screen.getByText('Calculator')).toBeInTheDocument();
  });

  it('dynamically adapts Slot 3 label to active vehicle context from URL search param', () => {
    mockSearchParams = new URLSearchParams('model=rav4');

    render(
      <MarketProvider>
        <MobileBottomDock />
      </MarketProvider>
    );

    expect(screen.getByText('RAV4 Gear')).toBeInTheDocument();
  });

  it('dynamically adapts Slot 3 label to Sienna from pathname', () => {
    mockPathname = '/calculator/sienna-hybrid';

    render(
      <MarketProvider>
        <MobileBottomDock />
      </MarketProvider>
    );

    expect(screen.getByText('Sienna Gear')).toBeInTheDocument();
  });

  it('dynamically adapts Slot 3 label to Grand Highlander from CalculatorContext', () => {
    render(
      <MarketProvider>
        <CalculatorProvider initialModelSlug="grand-highlander">
          <MobileBottomDock />
        </CalculatorProvider>
      </MarketProvider>
    );

    expect(screen.getByText('Grand Highlander Gear')).toBeInTheDocument();
  });

  it('opens Dynamic Gear Drawer when Slot 3 is tapped and surfaces curated accessory cards', () => {
    mockSearchParams = new URLSearchParams('model=rav4');

    render(
      <MarketProvider>
        <MobileBottomDock />
      </MarketProvider>
    );

    // Initial closed state
    expect(screen.queryByTestId('mobile-gear-drawer-root')).not.toBeInTheDocument();

    // Tap Gear slot
    const gearBtn = screen.getByTestId('mobile-dock-gear');
    fireEvent.click(gearBtn);

    // Drawer opens
    const drawer = screen.getByTestId('mobile-gear-drawer-root');
    expect(drawer).toBeInTheDocument();

    // Header matches active model
    expect(screen.getByText('Delivery Day Prep: RAV4')).toBeInTheDocument();

    // Curated heroes are present (Muslogy, FitcamX, TuxMat)
    expect(screen.getByText('Muslogy Center Console Organizer Tray (RAV4)')).toBeInTheDocument();
    expect(screen.getByText('FitcamX OEM 4K Integrated Dashcam')).toBeInTheDocument();
    expect(screen.getByText('TuxMat High-Wall TPE Floor Liners')).toBeInTheDocument();

    // Partner discount code button
    const copyBtn = screen.getByTestId('copy-code-btn-muslogy-rav4-organizer');
    expect(copyBtn).toHaveTextContent(/CODE: Toyotawaits \(2% OFF\)/i);

    // Tap copy button triggers copied feedback state
    fireEvent.click(copyBtn);
    expect(screen.getByText('Copied!')).toBeInTheDocument();

    // Close drawer via close button
    const closeBtn = screen.getByTestId('mobile-gear-drawer-close-btn');
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId('mobile-gear-drawer-root')).not.toBeInTheDocument();
  });

  it('closes gear drawer when clicking the overlay backdrop', () => {
    render(
      <MarketProvider>
        <MobileBottomDock />
      </MarketProvider>
    );

    fireEvent.click(screen.getByTestId('mobile-dock-gear'));
    expect(screen.getByTestId('mobile-gear-drawer-root')).toBeInTheDocument();

    const overlay = screen.getByTestId('mobile-gear-drawer-overlay');
    fireEvent.click(overlay);
    expect(screen.queryByTestId('mobile-gear-drawer-root')).not.toBeInTheDocument();
  });

  it('renders localized Amazon and partner outbound links with sponsored rel attributes', () => {
    mockSearchParams = new URLSearchParams('model=sienna');

    render(
      <MarketProvider>
        <MobileBottomDock />
      </MarketProvider>
    );

    fireEvent.click(screen.getByTestId('mobile-dock-gear'));

    // Check Amazon link for Sienna liners
    const linersLink = screen.getByTestId('gear-cta-link-sienna-all-weather-liners');
    expect(linersLink).toHaveAttribute('target', '_blank');
    expect(linersLink).toHaveAttribute('rel', 'sponsored noopener noreferrer nofollow');
    expect(linersLink.getAttribute('href')).toContain('tag=toyotawaits-20');

    // Check Muslogy direct partner link
    const partnerLink = screen.getByTestId('gear-cta-link-muslogy-sienna-organizer');
    expect(partnerLink).toHaveAttribute('href', '/out/muslogy-sienna');
  });
  it('displays top universal deals & bestsellers when no model is active', () => {
    mockSearchParams = new URLSearchParams();

    render(
      <MarketProvider>
        <MobileBottomDock />
      </MarketProvider>
    );

    fireEvent.click(screen.getByTestId('mobile-dock-gear'));

    // Drawer header
    expect(screen.getByText('Delivery Day Prep: Toyota Essentials')).toBeInTheDocument();

    // Priority Lineup Items
    expect(screen.getByText('Muslogy Center Console Organizer Tray')).toBeInTheDocument();
    expect(screen.getByText('Spigen 9H Tempered Glass Screen Protector')).toBeInTheDocument();
    expect(screen.getByText('TuxMat / Custom-Fit All-Weather High-Wall Floor Liners')).toBeInTheDocument();
    expect(screen.getByText('Plug-and-Play Wireless CarPlay / Android Auto Adapter')).toBeInTheDocument();
    expect(screen.getByText('FitcamX OEM Factory-Look 4K Dashcam')).toBeInTheDocument();

    // Category / Deal Tags
    expect(screen.getByText('Partner Deal · 2% Off')).toBeInTheDocument();
    expect(screen.getByText('Display Protection')).toBeInTheDocument();
    expect(screen.getByText('Winter Protection')).toBeInTheDocument();
    expect(screen.getByText('Cabin Tech')).toBeInTheDocument();
    expect(screen.getByText('OEM Integrated')).toBeInTheDocument();

    // Price indicators
    expect(screen.getByText('~$24 CAD')).toBeInTheDocument();
    expect(screen.getByText('~$190 - $290 CAD')).toBeInTheDocument();
    expect(screen.getByText('~$50 CAD')).toBeInTheDocument();
    expect(screen.getByText('~$188 CAD')).toBeInTheDocument();

    // Muslogy promo pill & partner link
    const copyBtn = screen.getByTestId('copy-code-btn-muslogy-console-organizer-universal');
    expect(copyBtn).toHaveTextContent(/CODE: Toyotawaits/i);
    const partnerLink = screen.getByTestId('gear-cta-link-muslogy-console-organizer-universal');
    expect(partnerLink).toHaveAttribute('href', '/out/muslogy-rav4');
    expect(partnerLink).toHaveAttribute('rel', 'sponsored noopener noreferrer nofollow');

    // Amazon affiliate link verification
    const spigenLink = screen.getByTestId('gear-cta-link-universal-spigen-screen-protector');
    expect(spigenLink).toHaveAttribute('target', '_blank');
    expect(spigenLink).toHaveAttribute('rel', 'sponsored noopener noreferrer nofollow');
    expect(spigenLink.getAttribute('href')).toContain('tag=toyotawaits-20');

    const carplayLink = screen.getByTestId('gear-cta-link-universal-wireless-carplay');
    expect(carplayLink).toHaveAttribute('target', '_blank');
    expect(carplayLink).toHaveAttribute('rel', 'sponsored noopener noreferrer nofollow');
    expect(carplayLink.getAttribute('href')).toContain('tag=toyotawaits-20');
  });

  it('verifies all mobile dock gear thumbnail assets exist on disk', () => {
    // getCuratedMobileGear imported from @/components/layout/MobileBottomDock
    const modelsToTest = ['', 'rav4', 'sienna', 'grand-highlander', 'camry'];
    const publicDir = path.resolve(process.cwd(), 'public');

    for (const slug of modelsToTest) {
      const items = getCuratedMobileGear(slug, 'CA');
      expect(items.length).toBeGreaterThanOrEqual(4);
      for (const item of items) {
        if (item.imageUrl) {
          const diskPath = path.join(publicDir, item.imageUrl);
          expect(fs.existsSync(diskPath), `Missing thumbnail on disk for ${item.id}: ${item.imageUrl}`).toBe(true);
        }
      }
    }
  });
  it('opens Guides modal when Slot 3 is tapped and displays 2-column grid', () => {
    render(
      <MarketProvider>
        <MobileBottomDock />
      </MarketProvider>
    );

    expect(screen.queryByTestId('mobile-guides-modal-root')).not.toBeInTheDocument();

    const guidesBtn = screen.getByTestId('mobile-dock-guides');
    fireEvent.click(guidesBtn);

    expect(screen.getByTestId('mobile-guides-modal-root')).toBeInTheDocument();
    expect(screen.getByText('Popular Guides & Prep')).toBeInTheDocument();
    expect(screen.getByText('Winter Prep')).toBeInTheDocument();
    expect(screen.getByText('Tire Fitment')).toBeInTheDocument();

    // Close via close button
    fireEvent.click(screen.getByTestId('mobile-guides-modal-close-btn'));
    expect(screen.queryByTestId('mobile-guides-modal-root')).not.toBeInTheDocument();
  });

  it('collapses into bottom-left badge on downward scroll and expands on upward scroll or near top', () => {
    let scrollYValue = 0;
    Object.defineProperty(window, 'scrollY', {
      get: () => scrollYValue,
      configurable: true,
    });
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });

    render(
      <MarketProvider>
        <MobileBottomDock />
      </MarketProvider>
    );

    const dock = screen.getByTestId('mobile-bottom-dock');
    expect(screen.getByTestId('mobile-dock-tracker')).toBeInTheDocument();
    expect(screen.queryByTestId('mobile-dock-expand-btn')).not.toBeInTheDocument();

    // Scroll down past threshold (> 100 and > 10px delta)
    scrollYValue = 220;
    fireEvent.scroll(window);

    expect(dock).toHaveClass('left-4', 'w-12', 'h-12', 'rounded-full');
    expect(screen.queryByTestId('mobile-dock-tracker')).not.toBeInTheDocument();
    const expandBtn = screen.getByRole('button', { name: 'Expand navigation menu' });
    expect(expandBtn).toBeInTheDocument();

    // Scroll up > 10px delta -> expands back to 5-tab pill
    scrollYValue = 180;
    fireEvent.scroll(window);

    expect(dock).toHaveClass('left-3', 'right-3', 'rounded-full');
    expect(screen.getByTestId('mobile-dock-tracker')).toBeInTheDocument();
    expect(screen.queryByTestId('mobile-dock-expand-btn')).not.toBeInTheDocument();

    // Collapse again, then scroll near top (< 80) -> expands
    scrollYValue = 300;
    fireEvent.scroll(window);
    expect(screen.getByRole('button', { name: 'Expand navigation menu' })).toBeInTheDocument();

    scrollYValue = 40;
    fireEvent.scroll(window);
    expect(screen.getByTestId('mobile-dock-tracker')).toBeInTheDocument();
  });

  it('expands immediately when tapping the collapsed pill without triggering navigation', () => {
    let scrollYValue = 0;
    Object.defineProperty(window, 'scrollY', {
      get: () => scrollYValue,
      configurable: true,
    });
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });

    mockPathname = '/inventory';
    render(
      <MarketProvider>
        <MobileBottomDock />
      </MarketProvider>
    );

    scrollYValue = 250;
    fireEvent.scroll(window);

    const expandBtn = screen.getByRole('button', { name: 'Expand navigation menu' });
    fireEvent.click(expandBtn);

    expect(screen.getByTestId('mobile-dock-inventory')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-dock-tracker')).toBeInTheDocument();
    expect(screen.queryByTestId('mobile-dock-expand-btn')).not.toBeInTheDocument();
  });

  it('switches visible gear when clicking Model Filter Pills (All Gear, Universal, RAV4, Sienna)', () => {
    mockSearchParams = new URLSearchParams();

    render(
      <MarketProvider>
        <MobileBottomDock />
      </MarketProvider>
    );

    fireEvent.click(screen.getByTestId('mobile-dock-gear'));

    // All 9 filter pills should be rendered
    for (const pill of GEAR_DRAWER_FILTER_PILLS) {
      expect(screen.getByTestId(`gear-filter-pill-${pill.slug}`)).toBeInTheDocument();
    }

    // Default 'all' shows both bestsellers and universal essentials
    expect(screen.getByTestId('gear-filter-pill-all')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByTestId('mobile-gear-card-muslogy-console-organizer-universal')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-gear-card-rfid-faraday-key-fob-pouch')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-gear-card-noco-gb40-jump-pack')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-gear-card-level-2-evse-charger')).toBeInTheDocument();

    // Switch to Universal -> strictly universal essentials (7 items), no Muslogy model-specific organizer
    fireEvent.click(screen.getByTestId('gear-filter-pill-universal'));
    expect(screen.getByTestId('gear-filter-pill-universal')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Delivery Day Prep: Universal Essentials')).toBeInTheDocument();
    expect(screen.queryByTestId('mobile-gear-card-muslogy-console-organizer-universal')).not.toBeInTheDocument();
    expect(screen.getByTestId('mobile-gear-card-rfid-faraday-key-fob-pouch')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-gear-card-noco-gb40-jump-pack')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-gear-card-portable-tire-inflator')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-gear-card-universal-spigen-screen-protector')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-gear-card-universal-wireless-carplay')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-gear-card-fast-usbc-pd-car-charger')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-gear-card-level-2-evse-charger')).toBeInTheDocument();

    // Switch to RAV4 -> RAV4 direct-fit items + universal essentials
    fireEvent.click(screen.getByTestId('gear-filter-pill-rav4'));
    expect(screen.getByTestId('gear-filter-pill-rav4')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Delivery Day Prep: RAV4')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-gear-card-muslogy-rav4-organizer')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-gear-card-noco-gb40-jump-pack')).toBeInTheDocument();

    // Switch to Sienna -> Sienna direct-fit items + universal essentials
    fireEvent.click(screen.getByTestId('gear-filter-pill-sienna'));
    expect(screen.getByTestId('gear-filter-pill-sienna')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Delivery Day Prep: Sienna')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-gear-card-muslogy-sienna-organizer')).toBeInTheDocument();
    expect(screen.queryByTestId('mobile-gear-card-muslogy-rav4-organizer')).not.toBeInTheDocument();
    expect(screen.getByTestId('mobile-gear-card-rfid-faraday-key-fob-pouch')).toBeInTheDocument();

    // Switch back to All Gear
    fireEvent.click(screen.getByTestId('gear-filter-pill-all'));
    expect(screen.getByText('Delivery Day Prep: Toyota Essentials')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-gear-card-muslogy-console-organizer-universal')).toBeInTheDocument();
  });

  it('sorts gear drawer items descending by popularityWeights and preserves partner badges', () => {
    const { rerender } = render(
      <MarketProvider>
        <MobileGearDrawer
          isOpen={true}
          onClose={() => {}}
          modelSlug="rav4"
          modelName="RAV4"
          popularityWeights={{
            'noco-gb40-jump-pack': 15,
            'rfid-faraday-key-fob-pouch': 7,
            'fitcamx-rav4': 4,
          }}
        />
      </MarketProvider>
    );

    const cards = screen.getAllByTestId(/^mobile-gear-card-/);
    expect(cards[0]).toHaveAttribute('data-testid', 'mobile-gear-card-noco-gb40-jump-pack');
    expect(cards[1]).toHaveAttribute('data-testid', 'mobile-gear-card-rfid-faraday-key-fob-pouch');
    expect(cards[2]).toHaveAttribute('data-testid', 'mobile-gear-card-fitcamx-rav4');

    // #1 item with >= 3 clicks shows Most Popular badge
    expect(screen.getByTestId('most-popular-badge-noco-gb40-jump-pack')).toHaveTextContent('🔥 Most Popular');

    // When a Muslogy partner item ranks #1, both Partner Deal badge and Most Popular badge are shown
    rerender(
      <MarketProvider>
        <MobileGearDrawer
          isOpen={true}
          onClose={() => {}}
          modelSlug="rav4"
          modelName="RAV4"
          popularityWeights={{
            'muslogy-rav4-organizer': 20,
            'noco-gb40-jump-pack': 5,
          }}
        />
      </MarketProvider>
    );

    const updatedCards = screen.getAllByTestId(/^mobile-gear-card-/);
    expect(updatedCards[0]).toHaveAttribute('data-testid', 'mobile-gear-card-muslogy-rav4-organizer');
    expect(screen.getByTestId('most-popular-badge-muslogy-rav4-organizer')).toHaveTextContent('🔥 Most Popular');
    expect(screen.getByText('Partner Deal · 2% Off')).toBeInTheDocument();
  });
});