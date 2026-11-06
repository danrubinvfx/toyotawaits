import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileBottomDock } from '@/components/layout/MobileBottomDock';
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

  it('renders fixed bottom dock on mobile with 4 thumb slots and responsive classes', () => {
    render(
      <MarketProvider>
        <MobileBottomDock />
      </MarketProvider>
    );

    const dock = screen.getByTestId('mobile-bottom-dock');
    expect(dock).toBeInTheDocument();
    expect(dock).toHaveClass(
      'fixed',
      'bottom-0',
      'inset-x-0',
      'z-40',
      'md:hidden',
      'bg-zinc-950/95',
      'border-t',
      'border-zinc-800/80',
      'backdrop-blur-lg',
      'pb-safe'
    );

    // 4 Slots
    expect(screen.getByTestId('mobile-dock-tracker')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-dock-inventory')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-dock-gear')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-dock-calculator')).toBeInTheDocument();

    // Default universal label
    expect(screen.getByText('Tracker')).toBeInTheDocument();
    expect(screen.getByText('Live Stock')).toBeInTheDocument();
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
});
