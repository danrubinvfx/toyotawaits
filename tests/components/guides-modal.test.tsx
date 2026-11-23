import React from 'react';
import fs from 'fs';
import path from 'path';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GuidesModal, PRIMARY_GUIDES, MODEL_MOD_PILLS } from '@/components/navigation/GuidesModal';

describe('GuidesModal Component (2-Column Grid Layout)', () => {
  it('does not render when isOpen is false', () => {
    const handleClose = vi.fn();
    render(<GuidesModal isOpen={false} onClose={handleClose} />);
    expect(screen.queryByTestId('mobile-guides-modal-root')).not.toBeInTheDocument();
  });

  it('renders modal dialog and 2-column grid when isOpen is true', () => {
    const handleClose = vi.fn();
    render(<GuidesModal isOpen={true} onClose={handleClose} />);

    expect(screen.getByTestId('mobile-guides-modal-root')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-guides-modal-sheet')).toBeInTheDocument();
    expect(screen.getByText('Popular Guides & Prep')).toBeInTheDocument();
    expect(screen.getByText('Model Mod Hubs')).toBeInTheDocument();
  });

  it('renders all 6 primary guides with valid live routes, titles, and subtitles', () => {
    const handleClose = vi.fn();
    render(<GuidesModal isOpen={true} onClose={handleClose} />);

    expect(PRIMARY_GUIDES).toHaveLength(6);

    const expectedRoutes = [
      { title: 'Winter Prep', subtitle: '12V & Floor Mats', href: '/winter-prep' },
      { title: 'Tire Fitment', subtitle: 'OEM Sizes & 3PMSF', href: '/tires' },
      { title: 'Delivery Day Prep', subtitle: 'Inspection Checklist', href: '/delivery-prep' },
      {
        title: 'DIY Maintenance',
        subtitle: 'Oil Specs & Hybrid Care',
        href: '/guides/toyota-diy-maintenance-guide',
      },
      {
        title: 'Sienna Hitch',
        subtitle: 'Sensors & Install',
        href: '/guides/toyota-sienna-trailer-hitch-guide',
      },
      {
        title: 'RAV4 Gear Guide',
        subtitle: 'Must-Have Accessories',
        href: '/guides/toyota-rav4-must-have-accessories',
      },
    ];

    expectedRoutes.forEach(({ title, subtitle, href }) => {
      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(subtitle)).toBeInTheDocument();

      const link = screen.getByText(title).closest('a');
      expect(link).toHaveAttribute('href', href);

      // Verify corresponding Next.js App Router page exists on disk (no 404 links)
      const pagePath = path.join(process.cwd(), 'src', 'app', ...href.split('/').filter(Boolean), 'page.tsx');
      expect(fs.existsSync(pagePath)).toBe(true);
    });

    // Ensure dead EV Rebates link is removed
    expect(screen.queryByText('EV Rebates')).not.toBeInTheDocument();
    expect(PRIMARY_GUIDES.some((g) => g.href === '/guides/ev-rebates-guide')).toBe(false);
  });

  it('renders all 6 model mod pill buttons linking to corresponding mod guides', () => {
    const handleClose = vi.fn();
    render(<GuidesModal isOpen={true} onClose={handleClose} />);

    MODEL_MOD_PILLS.forEach((mod) => {
      const pill = screen.getByText(`${mod.name} Mods`);
      expect(pill).toBeInTheDocument();
      expect(pill.closest('a')).toHaveAttribute('href', mod.href);
    });
  });

  it('calls onClose when clicking "View All →" link', () => {
    const handleClose = vi.fn();
    render(<GuidesModal isOpen={true} onClose={handleClose} />);

    const viewAllLink = screen.getByRole('link', { name: /View All →/i });
    expect(viewAllLink).toHaveAttribute('href', '/guides');
    fireEvent.click(viewAllLink);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking a primary guide card', () => {
    const handleClose = vi.fn();
    render(<GuidesModal isOpen={true} onClose={handleClose} />);

    const winterPrepLink = screen.getByText('Winter Prep').closest('a');
    expect(winterPrepLink).not.toBeNull();
    fireEvent.click(winterPrepLink!);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking a model mod pill', () => {
    const handleClose = vi.fn();
    render(<GuidesModal isOpen={true} onClose={handleClose} />);

    const siennaModPill = screen.getByText('Sienna Mods');
    fireEvent.click(siennaModPill);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking the close button', () => {
    const handleClose = vi.fn();
    render(<GuidesModal isOpen={true} onClose={handleClose} />);

    const closeBtn = screen.getByTestId('mobile-guides-modal-close-btn');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking the backdrop overlay', () => {
    const handleClose = vi.fn();
    render(<GuidesModal isOpen={true} onClose={handleClose} />);

    const overlay = screen.getByTestId('mobile-guides-modal-overlay');
    fireEvent.click(overlay);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = vi.fn();
    render(<GuidesModal isOpen={true} onClose={handleClose} />);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
