import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ModelDeliveryShelf, getModelDeliveryShelfItems } from '@/components/gear/ModelDeliveryShelf';
import { MarketProvider } from '@/context/MarketContext';

describe('ModelDeliveryShelf Component', () => {
  it('returns curated 3-item lineup for RAV4', () => {
    const items = getModelDeliveryShelfItems('rav4');
    expect(items).toHaveLength(3);

    // 1. All-Weather Liners (TuxMat)
    expect(items[0].title).toBe('All-Weather Liners');
    expect(items[0].brand).toBe('TuxMat');
    expect(items[0].description).toBe('Laser-fit spill and slush protection.');

    // 2. Integrated Dash Cam (FitcamX)
    expect(items[1].title).toBe('Integrated Dash Cam');
    expect(items[1].brand).toBe('FitcamX');
    expect(items[1].description).toBe('Stealth OEM mirror-tap recording.');

    // 3. Console Organizer (Muslogy)
    expect(items[2].title).toBe('Console Organizer');
    expect(items[2].brand).toBe('Muslogy');
    expect(items[2].destinationType).toBe('direct_partner');
    expect(items[2].description).toBe('Dual-tier armrest storage divider.');
  });

  it('returns curated 3-item lineup for Sienna', () => {
    const items = getModelDeliveryShelfItems('sienna');
    expect(items).toHaveLength(3);

    // 1. All-Weather Liners
    expect(items[0].title).toBe('All-Weather Liners');
    expect(items[0].description).toBe('Laser-fit spill and slush protection.');

    // 2. Console Organizer
    expect(items[1].title).toBe('Console Organizer');
    expect(items[1].brand).toBe('Muslogy');
    expect(items[1].description).toBe('Dual-tier armrest storage divider.');

    // 3. Trunk Cargo Net
    expect(items[2].title).toBe('Trunk Cargo Net');
    expect(items[2].brand).toBe('Muslogy');
    expect(items[2].description).toBe('Secures groceries and gear.');
  });

  it('returns curated 3-item lineup for Grand Highlander', () => {
    const items = getModelDeliveryShelfItems('grand-highlander');
    expect(items).toHaveLength(3);

    // 1. Screen Protector (12.3")
    expect(items[0].title).toBe('Screen Protector');
    expect(items[0].description).toBe('Stops fingerprints and glare.');

    // 2. Console Organizer
    expect(items[1].title).toBe('Console Organizer');
    expect(items[1].brand).toBe('Muslogy');
    expect(items[1].description).toBe('Dual-tier armrest storage divider.');

    // 3. All-Weather Liners
    expect(items[2].title).toBe('All-Weather Liners');
    expect(items[2].description).toBe('Laser-fit spill and slush protection.');
  });

  it('returns universal fallback 3-item lineup for unlisted models', () => {
    const items = getModelDeliveryShelfItems('corolla');
    expect(items).toHaveLength(3);

    expect(items[0].title).toBe('All-Weather Liners');
    expect(items[1].title).toBe('Integrated Dash Cam');
    expect(items[2].title).toBe('Faraday Key Pouch');
  });

  it('renders section header, subtitle, and 3 high-contrast cards in UI', () => {
    render(
      <MarketProvider initialMarket="CA">
        <ModelDeliveryShelf modelSlug="rav4" modelName="Toyota RAV4" />
      </MarketProvider>
    );

    // Header & Subtitle
    expect(screen.getByText('Prepping for Delivery Day?')).toBeInTheDocument();
    expect(
      screen.getByText('Top community-vetted essentials to have waiting in your garage before pickup.')
    ).toBeInTheDocument();

    // 3 Cards rendered
    expect(screen.getByText('All-Weather Liners')).toBeInTheDocument();
    expect(screen.getByText('Integrated Dash Cam')).toBeInTheDocument();
    expect(screen.getByText('Console Organizer')).toBeInTheDocument();

    // Benefit Sublines (crisp 3-4 word lines)
    expect(screen.getByText('Laser-fit spill and slush protection.')).toBeInTheDocument();
    expect(screen.getByText('Stealth OEM mirror-tap recording.')).toBeInTheDocument();
    expect(screen.getByText('Dual-tier armrest storage divider.')).toBeInTheDocument();

    // Guide Link
    const guideLink = screen.getByRole('link', { name: /View RAV4 Gear Guide/i });
    expect(guideLink).toHaveAttribute('href', '/guides/toyota-rav4-must-have-accessories');
  });
});
