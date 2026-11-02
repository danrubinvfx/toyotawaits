import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SiennaCampingPage, {
  metadata,
  SIENNA_CAMPING_GEAR,
  AFFILIATE_TAG,
} from '@/app/camping/sienna/page';

describe('Toyota Sienna Camping & Overland Gear Page', () => {
  it('has valid SEO metadata matching specification requirements', () => {
    expect(metadata.title).toBe(
      'Toyota Sienna Camper Van Conversion & Road Trip Gear (2021–2026) | ToyotaWaits'
    );
    expect(metadata.description).toBe(
      'Turn your hybrid Toyota Sienna into a stealth camper. Curated sleeping pads, blackout divider curtains, magnetic sliding door bug nets, 12V fridges, and tailgate shelters.'
    );
    expect(metadata.openGraph?.title).toBe(
      'Toyota Sienna Camper Van Conversion & Road Trip Gear (2021–2026) | ToyotaWaits'
    );
    expect(metadata.openGraph?.description).toBe(
      'Turn your hybrid Toyota Sienna into a stealth camper. Curated sleeping pads, blackout divider curtains, magnetic sliding door bug nets, 12V fridges, and tailgate shelters.'
    );
  });

  it('contains all 6 required curated camping gear items in the data array', () => {
    expect(SIENNA_CAMPING_GEAR).toHaveLength(6);

    const names = SIENNA_CAMPING_GEAR.map((item) => item.name);
    expect(names).toContain('Magnetic Sliding Door Bug Screens');
    expect(names).toContain('B-Pillar Telescopic Blackout Divider Curtain');
    expect(names).toContain('Tailored Wavy-Baffle Sienna Inflatable Air Mattress');
    expect(names).toContain('Compact 12V Compressor Refrigerator / Freezer');
    expect(names).toContain('Tailgate Liftgate Mesh Awning / Camp Enclosure');
    expect(names).toContain('Bridge Shifter Lower Floor Organizer Tray');

    // Verify fitment note across all items
    for (const item of SIENNA_CAMPING_GEAR) {
      expect(item.fitment).toBe(
        'Direct Fit: Sienna 2021–2026 (LE, XLE, XSE, Woodland, Limited, Platinum)'
      );
      expect(item.features.length).toBeGreaterThanOrEqual(2);
      expect(item.priceCad).toMatch(/CAD/);
    }
  });

  it('renders hero section and hybrid camp mode callout box', () => {
    render(<SiennaCampingPage />);

    expect(
      screen.getByRole('heading', {
        name: /Toyota Sienna Stealth Camper & Road Trip Setup/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Maximize the hybrid electrical architecture and cavernous sliding-door cabin with custom-fit sleeping, privacy, and off-grid gear./i
      )
    ).toBeInTheDocument();

    // Hybrid camping callout
    expect(screen.getByText(/READY Mode/i)).toBeInTheDocument();
    expect(screen.getByText(/negligible fuel consumption/i)).toBeInTheDocument();
  });

  it('renders category filter tabs and filters gear cards interactively', () => {
    render(<SiennaCampingPage />);

    // Check filter pills
    expect(screen.getByRole('button', { name: /All/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sleep Setup/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Window Privacy & Bug Screens/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /12V Refrigeration/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Tailgate & Outdoor Living/i })).toBeInTheDocument();

    // Initially all 6 items rendered
    expect(screen.getByText('Tailored Wavy-Baffle Sienna Inflatable Air Mattress')).toBeInTheDocument();
    expect(screen.getByText('Magnetic Sliding Door Bug Screens')).toBeInTheDocument();
    expect(screen.getByText('Compact 12V Compressor Refrigerator / Freezer')).toBeInTheDocument();

    // Filter by Sleep Setup
    const sleepTab = screen.getByRole('button', { name: /Sleep Setup/i });
    fireEvent.click(sleepTab);

    expect(screen.getByText('Tailored Wavy-Baffle Sienna Inflatable Air Mattress')).toBeInTheDocument();
    expect(screen.queryByText('Magnetic Sliding Door Bug Screens')).not.toBeInTheDocument();
    expect(screen.queryByText('Compact 12V Compressor Refrigerator / Freezer')).not.toBeInTheDocument();

    // Filter by 12V Refrigeration
    const fridgeTab = screen.getByRole('button', { name: /12V Refrigeration/i });
    fireEvent.click(fridgeTab);

    expect(screen.getByText('Compact 12V Compressor Refrigerator / Freezer')).toBeInTheDocument();
    expect(screen.queryByText('Tailored Wavy-Baffle Sienna Inflatable Air Mattress')).not.toBeInTheDocument();

    // Switch back to All
    const allTab = screen.getByRole('button', { name: /All/i });
    fireEvent.click(allTab);
    expect(screen.getByText('Tailored Wavy-Baffle Sienna Inflatable Air Mattress')).toBeInTheDocument();
    expect(screen.getByText('Magnetic Sliding Door Bug Screens')).toBeInTheDocument();
  });

  it('renders Amazon affiliate links with verified query pattern and security attributes', () => {
    render(<SiennaCampingPage />);

    const amazonLinks = screen.getAllByRole('link', { name: /View on Amazon/i });
    expect(amazonLinks.length).toBe(6);

    amazonLinks.forEach((link) => {
      const href = link.getAttribute('href');
      expect(href).toMatch(/^https:\/\/www\.amazon\.ca\/s\?k=/);
      expect(href).toContain(`tag=${AFFILIATE_TAG}`);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link.getAttribute('rel')).toContain('sponsored');
      expect(link.getAttribute('rel')).toContain('noopener');
      expect(link.getAttribute('rel')).toContain('noreferrer');
    });
  });

  it('renders Open Sienna Camping Checklist button and opens modal', () => {
    render(<SiennaCampingPage />);

    const checklistBtn = screen.getByRole('button', { name: /Open Sienna Camping Checklist/i });
    expect(checklistBtn).toBeInTheDocument();

    fireEvent.click(checklistBtn);

    expect(screen.getByText('Toyota Sienna Camping Checklist')).toBeInTheDocument();
  });

  it('renders Amazon Associate disclosure banner', () => {
    render(<SiennaCampingPage />);

    expect(
      screen.getByText(/As an Amazon Associate, ToyotaWaits earns from qualifying purchases\./i)
    ).toBeInTheDocument();
  });
});
