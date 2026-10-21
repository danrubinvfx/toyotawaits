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

    // Estimator direct nav link
    const estimatorDesktop = screen.getByRole('link', { name: /Estimator/i });
    expect(estimatorDesktop).toBeInTheDocument();
    expect(estimatorDesktop).toHaveAttribute('href', '/#estimator');

    // Guides & Tools dropdown buttons
    const guidesButton = screen.getByRole('button', { name: /Guides/i });
    expect(guidesButton).toBeInTheDocument();
    const toolsButton = screen.getByRole('button', { name: /Tools/i });
    expect(toolsButton).toBeInTheDocument();

    // Opening Guides dropdown reveals Winter Prep, Mod Guides, Gear
    fireEvent.click(guidesButton);
    const winterPrepDesktop = screen.getByRole('link', { name: /Winter Prep ❄️/i });
    expect(winterPrepDesktop).toBeInTheDocument();
    expect(winterPrepDesktop).toHaveAttribute('href', '/winter-prep');

    // Opening Tools dropdown reveals Tires and Pickup Checklist
    fireEvent.click(toolsButton);
    const tiresDesktop = screen.getByRole('link', { name: /Tire Finder & Sizing/i });
    expect(tiresDesktop).toBeInTheDocument();
    expect(tiresDesktop).toHaveAttribute('href', '/tires');

    const pickupDesktop = screen.getByRole('link', { name: /Pickup Checklist/i });
    expect(pickupDesktop).toBeInTheDocument();
    expect(pickupDesktop).toHaveAttribute('href', '/delivery-prep');

    // Ko-fi support header pill
    const kofiHeaderLink = screen.getByTestId('kofi-header-pill');
    expect(kofiHeaderLink).toBeInTheDocument();
    expect(kofiHeaderLink).toHaveAttribute('href', 'https://ko-fi.com/toyotawaits');
    expect(kofiHeaderLink).toHaveAttribute('target', '_blank');

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

    // Contains Winter Prep link in mobile drawer
    const winterDrawerLink = screen.getByRole('link', { name: /Winter Prep Guide ❄️/i });
    expect(winterDrawerLink).toBeInTheDocument();
    expect(winterDrawerLink).toHaveAttribute('href', '/winter-prep');

    // Contains Tire Guide link in mobile drawer
    const tiresDrawerLink = screen.getByRole('link', { name: /Tire Guide & Reviews 🛞/i });
    expect(tiresDrawerLink).toBeInTheDocument();
    expect(tiresDrawerLink).toHaveAttribute('href', '/tires');

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
    expect(screen.getByText(/Gen 5 Essentials/i)).toBeInTheDocument();
    expect(screen.getByText(/OEM mirror dashcam, mud flaps & winter floor liners/i)).toBeInTheDocument();
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
    mockSection.id = 'estimator';
    const scrollMock = vi.fn();
    mockSection.scrollIntoView = scrollMock;
    document.body.appendChild(mockSection);

    render(<Header />);

    const toggleButton = screen.getByTestId('mobile-menu-toggle');
    fireEvent.click(toggleButton);

    const estimatorLink = screen.getByText(/Wait-Time Estimator/i);
    fireEvent.click(estimatorLink);

    expect(scrollMock).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });

    document.body.removeChild(mockSection);
  });

  it('renders Pickup Checklist link pointing to /delivery-prep', () => {
    render(<Header />);

    const toolsButton = screen.getByRole('button', { name: /Tools/i });
    fireEvent.click(toolsButton);

    const pickupLink = screen.getByRole('link', { name: /Pickup Checklist/i });
    expect(pickupLink).toBeInTheDocument();
    expect(pickupLink).toHaveAttribute('href', '/delivery-prep');
  });

  it('renders "+ Log Order" action button linking to /submit when no local submission exists', () => {
    localStorage.clear();
    render(<Header />);

    const submitButtons = screen.getAllByRole('link', { name: /\+ Log Order/i });
    expect(submitButtons.length).toBeGreaterThanOrEqual(1);
    expect(submitButtons[0]).toHaveAttribute('href', '/submit');
  });

  it('renders "Update Status" button linking to /edit/[id]?key=[editKey] when local submission exists', () => {
    localStorage.setItem(
      'toyotawaits_submission',
      JSON.stringify({
        id: 'mock-sub-id-1234',
        editKey: 'mock-key-5678',
        model: 'RAV4 Prime',
        status: 'pending',
      })
    );

    render(<Header />);

    const updateButtons = screen.getAllByRole('link', { name: /Update Status/i });
    expect(updateButtons.length).toBeGreaterThanOrEqual(1);
    expect(updateButtons[0]).toHaveAttribute(
      'href',
      expect.stringContaining('/edit/mock-sub-id-1234?key=mock-key-5678')
    );
  });

  it('toggles mobile drawer and renders secondary submit link when submission exists', () => {
    localStorage.setItem(
      'toyotawaits_submission',
      JSON.stringify({
        id: 'mock-sub-id-1234',
        editKey: 'mock-key-5678',
        model: 'Sienna',
        status: 'pending',
      })
    );

    render(<Header />);

    // Open mobile drawer
    const toggle = screen.getByTestId('mobile-menu-toggle');
    fireEvent.click(toggle);

    expect(screen.getByTestId('mobile-menu-drawer')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /\+ Log another vehicle/i })).toHaveAttribute('href', '/submit');
  });

  it('enforces mobile action grouping, shrink-0 restraint, and responsive labels', () => {
    localStorage.clear();
    const { container } = render(<Header />);

    // 1. Right-side unified cluster wrapper
    const toggle = screen.getByTestId('mobile-menu-toggle');
    const rightCluster = toggle.parentElement;
    expect(rightCluster).toBeInTheDocument();
    expect(rightCluster).toHaveClass('flex', 'items-center', 'gap-2', 'shrink-0', 'ml-auto');

    // 2. Hamburger toggle shrink-0
    expect(toggle).toHaveClass('shrink-0');

    // 3. Responsive button text spans
    const submitBtn = screen.getAllByRole('link', { name: /\+ Log Order/i })[0];
    expect(submitBtn).toHaveClass('shrink-0', 'whitespace-nowrap', 'text-xs', 'font-semibold', 'rounded-lg');
    const fullTextSpan = submitBtn.querySelector('span.xs\\:inline, span[class*="xs:inline"]');
    const compactTextSpan = submitBtn.querySelector('span.xs\\:hidden, span[class*="xs:hidden"]');
    expect(fullTextSpan).toBeInTheDocument();
    expect(fullTextSpan).toHaveTextContent('+ Log Order');
    expect(compactTextSpan).toBeInTheDocument();
    expect(compactTextSpan).toHaveTextContent('+ Order');

    // 4. Left brand container restraint
    const brandLink = screen.getByRole('link', { name: /ToyotaWaits/i });
    expect(brandLink).toHaveClass('flex', 'items-center', 'gap-2', 'min-w-0', 'shrink');

    // 5. Outer header and inner nav boundary enforcement
    const headerElem = container.querySelector('header');
    expect(headerElem).toHaveClass('w-full', 'max-w-full', 'overflow-x-hidden');
    const innerWrapper = headerElem?.firstElementChild;
    expect(innerWrapper).toHaveClass('w-full', 'max-w-full', 'overflow-x-hidden', 'px-3', 'py-2.5', 'flex', 'items-center', 'justify-between');
  });
});
