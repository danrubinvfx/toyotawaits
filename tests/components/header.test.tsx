import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '@/components/layout/header';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn() }),
}));

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the brand logo and core navigation elements', () => {
    render(<Header />);

    // Brand logo
    expect(screen.getByText(/ToyotaWaits/i)).toBeInTheDocument();
    expect(screen.getByText(/🇨🇦 Canada/i)).toBeInTheDocument();

    // Toggle button should exist
    const toggleButton = screen.getByTestId('mobile-menu-toggle');
    expect(toggleButton).toBeInTheDocument();
  });

  it('toggles mobile drawer when mobile menu button is clicked', () => {
    render(<Header />);

    // Initially drawer is not visible
    expect(screen.queryByTestId('mobile-menu-drawer')).not.toBeInTheDocument();

    // Click toggle button
    const toggleButton = screen.getByTestId('mobile-menu-toggle');
    fireEvent.click(toggleButton);

    // Drawer is now open
    expect(screen.getByTestId('mobile-menu-drawer')).toBeInTheDocument();

    // Click again to close
    fireEvent.click(toggleButton);
    expect(screen.queryByTestId('mobile-menu-drawer')).not.toBeInTheDocument();
  });

  it('displays DIY Mod Guides links in the mobile menu', () => {
    render(<Header />);

    const toggleButton = screen.getByTestId('mobile-menu-toggle');
    fireEvent.click(toggleButton);

    const drawer = screen.getByTestId('mobile-menu-drawer');
    expect(drawer).toBeInTheDocument();

    // Check mod guides section heading
    expect(screen.getByText(/DIY Mod Guides/i)).toBeInTheDocument();

    // Check individual model mod links
    expect(screen.getByText(/SE to XSE DIY Upgrades/i)).toBeInTheDocument();
    expect(screen.getByText(/Road-Trip & Family Mods/i)).toBeInTheDocument();
    expect(screen.getByText(/Cabin & Utility Mods/i)).toBeInTheDocument();
    expect(screen.getByText(/1958 Trim Overhaul/i)).toBeInTheDocument();
    expect(screen.getByText(/View All Guides →/i)).toBeInTheDocument();
  });

  it('displays Recommended Gear and Product links in the mobile menu', () => {
    render(<Header />);

    const toggleButton = screen.getByTestId('mobile-menu-toggle');
    fireEvent.click(toggleButton);

    const drawer = screen.getByTestId('mobile-menu-drawer');
    expect(drawer).toBeInTheDocument();

    // Check Gear & Product Links heading
    expect(screen.getByText(/Gear & Product Links/i)).toBeInTheDocument();

    // Check in-page Delivery Checklist jump
    expect(screen.getByText(/Delivery Day Prep Checklist/i)).toBeInTheDocument();

    // Check direct curated product links (/out/[slug])
    expect(screen.getByText(/FitcamX 4K Integrated Dashcam/i)).toBeInTheDocument();
    expect(screen.getByText(/NOCO Boost GB40 Jump Starter/i)).toBeInTheDocument();
    expect(screen.getByText(/Matte 9H Tempered Glass Screen Protector/i)).toBeInTheDocument();
    expect(screen.getByText(/Center Console Organizer Tray/i)).toBeInTheDocument();
    expect(screen.getByText(/J1772 Charger Port Lock Ring \(PHEV\)/i)).toBeInTheDocument();
  });

  it('closes the drawer when a guide or product link is clicked', () => {
    render(<Header />);

    const toggleButton = screen.getByTestId('mobile-menu-toggle');
    fireEvent.click(toggleButton);

    expect(screen.getByTestId('mobile-menu-drawer')).toBeInTheDocument();

    // Click on a mod guide link
    const rav4ModLink = screen.getByText(/SE to XSE DIY Upgrades/i);
    fireEvent.click(rav4ModLink);

    // Drawer should close
    expect(screen.queryByTestId('mobile-menu-drawer')).not.toBeInTheDocument();
  });

  it('smoothly scrolls to target anchor when anchor link is clicked while on home page', () => {
    const mockSection = document.createElement('div');
    mockSection.id = 'delivery-prep';
    const scrollMock = vi.fn();
    mockSection.scrollIntoView = scrollMock;
    document.body.appendChild(mockSection);

    render(<Header />);

    const toggleButton = screen.getByTestId('mobile-menu-toggle');
    fireEvent.click(toggleButton);

    const prepLink = screen.getByText(/Delivery Day Prep Checklist/i);
    fireEvent.click(prepLink);

    expect(scrollMock).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });

    document.body.removeChild(mockSection);
  });
});
