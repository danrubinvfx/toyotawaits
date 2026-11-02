import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Rav4CampingPage, {
  metadata,
  RAV4_CAMPING_GEAR,
  RAV4_CHECKLIST_ITEMS,
  AFFILIATE_TAG,
} from '@/app/camping/rav4/page';

describe('Toyota RAV4 Camping & Overland Gear Page', () => {
  it('has valid SEO metadata matching specification requirements', () => {
    expect(metadata.title).toBe(
      'Toyota RAV4 Trail & Car Camping Gear (2019–2026) | ToyotaWaits'
    );
    expect(metadata.description).toBe(
      'Transform your 5th-Gen Toyota RAV4 or RAV4 Prime into an off-grid overland camper. Dual-chamber split air mattress, seatback liners, hatch LEDs, and roof crossbars.'
    );
    expect(metadata.openGraph?.title).toBe(
      'Toyota RAV4 Trail & Car Camping Gear (2019–2026) | ToyotaWaits'
    );
  });

  it('contains all 6 required curated camping gear items in the data array', () => {
    expect(RAV4_CAMPING_GEAR).toHaveLength(6);

    const names = RAV4_CAMPING_GEAR.map((item) => item.name);
    expect(names).toContain('Dual-Chamber Fold-Flat Split Air Mattress');
    expect(names).toContain('Waterproof Split Seatback Cargo Liners');
    expect(names).toContain('Lockable Aerodynamic Roof Crossbars');
    expect(names).toContain('Hatch Ceiling Touch-Dimmable Downward LED Kit');
    expect(names).toContain('Tailgate Hatch Mosquito Tent & Rain Canopy');
    expect(names).toContain('Behind-Screen Dash Organizer Tray');

    for (const item of RAV4_CAMPING_GEAR) {
      expect(item.fitment).toMatch(/RAV4 2019–2026/);
      expect(item.features.length).toBeGreaterThanOrEqual(2);
      expect(item.priceCad).toMatch(/CAD/);
    }
  });

  it('contains RAV4 specific packing checklist defaults', () => {
    expect(RAV4_CHECKLIST_ITEMS.length).toBeGreaterThanOrEqual(8);
    const itemNames = RAV4_CHECKLIST_ITEMS.map((i) => i.item);
    expect(itemNames).toContain('Dual-chamber fold-flat split air mattress');
    expect(itemNames).toContain('Lockable aerodynamic roof crossbars');
  });

  it('renders hero section and fold-flat leveling callout box', () => {
    render(<Rav4CampingPage />);

    expect(
      screen.getByRole('heading', {
        name: /Toyota RAV4 Trail & Car Camping Gear/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Turn your 5th-Gen Toyota RAV4 \(Gas, Hybrid, or Prime PHEV\) into a versatile overland micro-camper/i
      )
    ).toBeInTheDocument();

    expect(screen.getByText(/Fold-Flat Incline Fix/i)).toBeInTheDocument();
    expect(screen.getByText(/Prime 'My Room Mode'/i)).toBeInTheDocument();
    expect(screen.getByText(/Battery Intake Caution/i)).toBeInTheDocument();
  });

  it('renders category filter tabs and filters gear cards interactively', () => {
    render(<Rav4CampingPage />);

    expect(screen.getByRole('button', { name: /All/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /In-Vehicle Sleeping/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cargo Defense/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cockpit Mounts/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Outdoor & Roof/i })).toBeInTheDocument();

    // All items present
    expect(screen.getByText('Dual-Chamber Fold-Flat Split Air Mattress')).toBeInTheDocument();
    expect(screen.getByText('Waterproof Split Seatback Cargo Liners')).toBeInTheDocument();
    expect(screen.getByText('Behind-Screen Dash Organizer Tray')).toBeInTheDocument();

    // Filter by Cockpit Mounts
    const cockpitTab = screen.getByRole('button', { name: /Cockpit Mounts/i });
    fireEvent.click(cockpitTab);

    expect(screen.getByText('Behind-Screen Dash Organizer Tray')).toBeInTheDocument();
    expect(screen.queryByText('Dual-Chamber Fold-Flat Split Air Mattress')).not.toBeInTheDocument();

    // Filter by In-Vehicle Sleeping
    const sleepingTab = screen.getByRole('button', { name: /In-Vehicle Sleeping/i });
    fireEvent.click(sleepingTab);

    expect(screen.getByText('Dual-Chamber Fold-Flat Split Air Mattress')).toBeInTheDocument();
    expect(screen.queryByText('Behind-Screen Dash Organizer Tray')).not.toBeInTheDocument();
  });

  it('renders Amazon affiliate links with verified query pattern and security attributes', () => {
    render(<Rav4CampingPage />);

    const amazonLinks = screen.getAllByRole('link', { name: /View on Amazon/i });
    expect(amazonLinks.length).toBe(6);

    amazonLinks.forEach((link) => {
      const href = link.getAttribute('href');
      expect(href).toMatch(/^https:\/\/www\.amazon\.ca\/s\?k=/);
      expect(href).toContain(`tag=${AFFILIATE_TAG}`);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link.getAttribute('rel')).toContain('sponsored');
      expect(link.getAttribute('rel')).toContain('noopener');
    });
  });

  it('renders Open RAV4 Packing Checklist button and opens modal', () => {
    render(<Rav4CampingPage />);

    const checklistBtn = screen.getByRole('button', { name: /Open RAV4 Packing Checklist/i });
    expect(checklistBtn).toBeInTheDocument();

    fireEvent.click(checklistBtn);

    expect(screen.getByText('Toyota RAV4 Camping Checklist')).toBeInTheDocument();
  });
});
