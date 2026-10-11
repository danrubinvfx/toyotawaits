import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TireCatalog } from '@/components/tires/tire-catalog';
import { TIRE_VEHICLE_OPTIONS } from '@/data/tires';

describe('TireCatalog Component', () => {
  it('renders the Canadian Toyota Tire Guide hero section with 3PMSF and insurance information', () => {
    render(<TireCatalog />);

    expect(
      screen.getByRole('heading', {
        name: /Canadian Toyota Tire Guide: Winter & All-Weather Recommendations/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/🇨🇦 Canadian Tire Guide & Fitment Reviews/i)).toBeInTheDocument();
    expect(screen.getByText(/Provincial 3PMSF Laws/i)).toBeInTheDocument();
    expect(screen.getByText(/Hybrid & EV Range/i)).toBeInTheDocument();
    expect(screen.getByText(/Insurance Discounts/i)).toBeInTheDocument();
  });

  it('renders the interactive vehicle selector with all 5 required models and defaults to RAV4', () => {
    render(<TireCatalog />);

    TIRE_VEHICLE_OPTIONS.forEach((option) => {
      expect(screen.getByRole('tab', { name: option.label })).toBeInTheDocument();
    });

    const rav4Tab = screen.getByRole('tab', { name: 'RAV4 (Hybrid / Prime)' });
    expect(rav4Tab.getAttribute('aria-selected')).toBe('true');

    // Default vehicle title
    expect(
      screen.getByRole('heading', { name: /Toyota RAV4 \(Hybrid, Prime & Gas\)/i })
    ).toBeInTheDocument();

    // Factory OEM sizes for RAV4
    expect(screen.getByText(/225\/65R17 \(LE, XLE, Woodland\)/i)).toBeInTheDocument();
    expect(screen.getByText(/225\/60R18 \(XSE, Prime SE\/XSE, Trail\)/i)).toBeInTheDocument();

    // Downsizing advisory
    expect(screen.getByText(/Winter Rim Downsizing Advisory/i)).toBeInTheDocument();
    expect(screen.getByText(/Downsizing 18" or 19" factory wheels to 17" rims/i)).toBeInTheDocument();
  });

  it('renders RAV4 tire recommendations including Michelin X-Ice Snow and CrossClimate 2', () => {
    render(<TireCatalog />);

    // Michelin X-Ice Snow card
    expect(screen.getByTestId('tire-card-rav4-michelin-xice')).toBeInTheDocument();
    expect(screen.getByText('Michelin X-Ice Snow')).toBeInTheDocument();
    expect(screen.getByText('Top Pick for Hybrids')).toBeInTheDocument();
    expect(screen.getByText(/FleX-Ice 2.0 silica compound/i)).toBeInTheDocument();

    // Bridgestone Blizzak WS90 card
    expect(screen.getByTestId('tire-card-rav4-bridgestone-blizzak')).toBeInTheDocument();
    expect(screen.getByText('Bridgestone Blizzak WS90')).toBeInTheDocument();
    expect(screen.getByText('Deep Snow & Slush Bite')).toBeInTheDocument();

    // Michelin CrossClimate 2 card
    expect(screen.getByTestId('tire-card-rav4-michelin-crossclimate2')).toBeInTheDocument();
    expect(screen.getByText('Michelin CrossClimate 2')).toBeInTheDocument();
    expect(screen.getByText('Top Year-Round All-Weather')).toBeInTheDocument();

    // Hankook Kinergy 4S2 card
    expect(screen.getByTestId('tire-card-rav4-hankook-kinergy-4s2')).toBeInTheDocument();
    expect(screen.getByText('Hankook Kinergy 4S2 (H750)')).toBeInTheDocument();
    expect(screen.getByText('Best Value All-Weather')).toBeInTheDocument();
  });

  it('filters tire cards by category (Dedicated Winter vs All-Weather 3PMSF)', () => {
    render(<TireCatalog />);

    // Click Winter filter
    const winterFilterBtn = screen.getByRole('button', { name: /Winter \(2\)/i });
    fireEvent.click(winterFilterBtn);

    expect(screen.getByTestId('tire-card-rav4-michelin-xice')).toBeInTheDocument();
    expect(screen.getByTestId('tire-card-rav4-bridgestone-blizzak')).toBeInTheDocument();
    expect(screen.queryByTestId('tire-card-rav4-michelin-crossclimate2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tire-card-rav4-hankook-kinergy-4s2')).not.toBeInTheDocument();

    // Click All-Weather filter
    const allWeatherFilterBtn = screen.getByRole('button', { name: /All-Weather \(2\)/i });
    fireEvent.click(allWeatherFilterBtn);

    expect(screen.queryByTestId('tire-card-rav4-michelin-xice')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tire-card-rav4-bridgestone-blizzak')).not.toBeInTheDocument();
    expect(screen.getByTestId('tire-card-rav4-michelin-crossclimate2')).toBeInTheDocument();
    expect(screen.getByTestId('tire-card-rav4-hankook-kinergy-4s2')).toBeInTheDocument();
  });

  it('switches vehicle to Sienna and updates OEM sizes and minivan tires', () => {
    render(<TireCatalog />);

    const siennaTab = screen.getByRole('tab', { name: 'Sienna' });
    fireEvent.click(siennaTab);

    expect(siennaTab.getAttribute('aria-selected')).toBe('true');
    expect(
      screen.getByRole('heading', { name: /Toyota Sienna Hybrid AWD/i })
    ).toBeInTheDocument();

    // Sienna factory sizes
    expect(screen.getByText(/235\/65R17 \(LE\)/i)).toBeInTheDocument();
    expect(screen.getByText(/235\/50R20 \(Platinum, XSE\)/i)).toBeInTheDocument();

    // Sienna tires
    expect(screen.getByTestId('tire-card-sienna-nokian-hakka-r5')).toBeInTheDocument();
    expect(screen.getByText('Nokian Hakkapeliitta R5 SUV')).toBeInTheDocument();
    expect(screen.getByText('Nordic Arctic Master')).toBeInTheDocument();
    expect(screen.getByText('Michelin CrossClimate 2 SUV')).toBeInTheDocument();
  });

  it('switches vehicle to Grand Highlander and updates 3-row crossover tires', () => {
    render(<TireCatalog />);

    const ghTab = screen.getByRole('tab', { name: 'Grand Highlander' });
    fireEvent.click(ghTab);

    expect(ghTab.getAttribute('aria-selected')).toBe('true');
    expect(
      screen.getByRole('heading', { name: /Toyota Grand Highlander \(Hybrid MAX & Turbo Gas\)/i })
    ).toBeInTheDocument();

    // Grand Highlander tires
    expect(screen.getByTestId('tire-card-gh-michelin-xice-suv')).toBeInTheDocument();
    expect(screen.getByText('Goodyear Assurance WeatherReady')).toBeInTheDocument();
    expect(screen.getByText('Asymmetric 4-Season Performer')).toBeInTheDocument();
  });

  it('switches vehicle to Prius / Prime and verifies EV efficiency tires', () => {
    render(<TireCatalog />);

    const priusTab = screen.getByRole('tab', { name: 'Prius / Prime' });
    fireEvent.click(priusTab);

    expect(priusTab.getAttribute('aria-selected')).toBe('true');
    expect(
      screen.getByRole('heading', { name: /Toyota Prius & Prius Prime \(Gen 5\)/i })
    ).toBeInTheDocument();

    // Prius tires
    expect(screen.getByTestId('tire-card-prius-continental-viking7')).toBeInTheDocument();
    expect(screen.getByText('Continental VikingContact 7')).toBeInTheDocument();
    expect(screen.getByText('Pirelli Cinturato WeatherActive')).toBeInTheDocument();
  });

  it('switches vehicle to Land Cruiser 250 and verifies severe snow trail tires', () => {
    render(<TireCatalog />);

    const lcTab = screen.getByRole('tab', { name: 'Land Cruiser 250' });
    fireEvent.click(lcTab);

    expect(lcTab.getAttribute('aria-selected')).toBe('true');
    expect(
      screen.getByRole('heading', { name: /Toyota Land Cruiser 250 \(1958 & First Edition\)/i })
    ).toBeInTheDocument();

    // Land Cruiser tires
    expect(screen.getByTestId('tire-card-lc-falken-wildpeak-at4w')).toBeInTheDocument();
    expect(screen.getByText('Falken Wildpeak A/T4W')).toBeInTheDocument();
    expect(screen.getByText('Severe Snow Trail Beast')).toBeInTheDocument();
    expect(screen.getByTestId('tire-card-lc-nokian-hakka-lt3')).toBeInTheDocument();
    expect(screen.getByText('Nokian Hakkapeliitta LT3')).toBeInTheDocument();
  });

  it('ensures all Amazon CTA buttons open in a new tab with compliance rel attributes', () => {
    render(<TireCatalog />);

    const amazonButtons = screen.getAllByRole('link', { name: /Check Price on Amazon.ca/i });
    expect(amazonButtons.length).toBeGreaterThanOrEqual(1);

    amazonButtons.forEach((btn) => {
      expect(btn).toHaveAttribute('target', '_blank');
      expect(btn).toHaveAttribute('rel', 'noopener noreferrer nofollow sponsored');
      expect(btn.getAttribute('href')).toContain('amazon.ca');
      expect(btn.getAttribute('href')).toContain('tag=toyotawaits-20');
    });
  });

  it('renders 90-day cookie window micro-copy below every tire card CTA', () => {
    render(<TireCatalog />);

    const tips = screen.getAllByText(
      /Tip: Add your selected tire size to your Amazon cart or wish list to lock in pricing and verify delivery dates closer to vehicle pickup\./i
    );
    expect(tips.length).toBeGreaterThanOrEqual(1);
  });

  it('renders statutory Amazon Associates disclaimer without hardcoded dollar prices', () => {
    render(<TireCatalog />);

    const disclaimers = screen.getAllByText(
      /As an Amazon Associate I earn from qualifying purchases\./i
    );
    expect(disclaimers.length).toBeGreaterThanOrEqual(1);

    // Verify no static hardcoded dollar prices like $199 or $250.00 exist in the tire cards
    const priceDollarMatches = screen.queryAllByText(/^\$\d+(\.\d{2})?$/);
    expect(priceDollarMatches).toHaveLength(0);
  });
});
