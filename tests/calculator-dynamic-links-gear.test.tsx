import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CalculatorGearCards } from '@/components/gear/CalculatorGearCards';
import { VehicleSavingsCalculator } from '@/components/calculator/VehicleSavingsCalculator';
import { CalculatorProvider } from '@/context/CalculatorContext';
import { MarketProvider } from '@/context/MarketContext';

describe('Calculator Dynamic Links & Recommended Products', () => {
  it('renders strictly "Recommended Products" heading and required affiliate disclosure', () => {
    render(
      <MarketProvider initialMarket="CA">
        <CalculatorGearCards activeModel="rav4" />
      </MarketProvider>
    );

    const heading = screen.getByRole('heading', { level: 2, name: /Recommended Products/i });
    expect(heading).toBeDefined();
    expect(heading.textContent).toBe('Recommended Products');
    expect(screen.queryByText(/While You Wait/i)).toBeNull();

    expect(
      screen.getByText(/As an Amazon Associate, ToyotaWaits earns from qualifying purchases\./i)
    ).toBeDefined();
  });

  it('routes to Amazon.ca with tag=toyotawaits-20 and sponsored rel attribute for Canadian users', () => {
    render(
      <MarketProvider initialMarket="CA">
        <CalculatorGearCards activeModel="rav4" />
      </MarketProvider>
    );

    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThanOrEqual(4);

    links.forEach((link) => {
      const href = link.getAttribute('href');
      expect(href).toContain('amazon.ca');
      expect(href).toContain('tag=toyotawaits-20');
      expect(link.getAttribute('rel')).toBe('sponsored noopener noreferrer');
      expect(link.getAttribute('target')).toBe('_blank');
    });
  });

  it('routes to Amazon.com with tag=toyotawaits07-20 for US users', () => {
    render(
      <MarketProvider initialMarket="US">
        <CalculatorGearCards activeModel="sienna" />
      </MarketProvider>
    );

    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThanOrEqual(4);

    links.forEach((link) => {
      const href = link.getAttribute('href');
      expect(href).toContain('amazon.com');
      expect(href).toContain('tag=toyotawaits07-20');
      expect(link.getAttribute('rel')).toBe('sponsored noopener noreferrer');
      expect(link.getAttribute('target')).toBe('_blank');
    });
  });

  it('displays curated accessories for Sienna including 3-row liners and trailer hitch', () => {
    render(
      <MarketProvider initialMarket="CA">
        <CalculatorGearCards activeModel="sienna" />
      </MarketProvider>
    );

    expect(screen.getByText(/3-Row Custom All-Weather Floor Liners/i)).toBeDefined();
    expect(screen.getByText(/Class III 2-Inch Trailer Hitch Receiver/i)).toBeDefined();
    expect(screen.getByText(/Rear Seatback & Kick Mat Protectors/i)).toBeDefined();
  });

  it('displays curated accessories for Grand Highlander including 12.3" glass and cargo liner', () => {
    render(
      <MarketProvider initialMarket="CA">
        <CalculatorGearCards activeModel="grand-highlander" />
      </MarketProvider>
    );

    expect(screen.getByText(/12\.3" Matte Anti-Glare Infotainment Glass/i)).toBeDefined();
    expect(screen.getByText(/High-Wall 3-Row Cargo & Seatback Liner/i)).toBeDefined();
  });

  it('includes Level 2 EVSE charger when PHEV model is active', () => {
    render(
      <MarketProvider initialMarket="CA">
        <CalculatorGearCards activeModel="rav4" isPhev={true} />
      </MarketProvider>
    );

    expect(screen.getByText(/Level 2 Home EVSE 40A Fast Charger/i)).toBeDefined();
  });

  it('renders dynamic action bridges for wait times and live inventory in VehicleSavingsCalculator', () => {
    render(
      <CalculatorProvider initialPresetId="2026-toyota-rav4-hybrid">
        <VehicleSavingsCalculator initialTargetPresetId="2026-toyota-rav4-hybrid" />
      </CalculatorProvider>
    );

    // Wait times button
    const waitTimesLink = screen.getByRole('link', { name: /Check RAV4 Wait Times/i });
    expect(waitTimesLink.getAttribute('href')).toBe('/wait-times/rav4');

    // Live inventory button
    const inventoryLink = screen.getByRole('link', { name: /Skip the Wait \/ View Live Stock/i });
    expect(inventoryLink.getAttribute('href')).toBe('/inventory?model=RAV4');
  });

  it('renders Sienna Trailer Hitch Guide badge when Sienna is configured', () => {
    render(
      <CalculatorProvider initialPresetId="2025-toyota-sienna-hybrid">
        <VehicleSavingsCalculator initialTargetPresetId="2025-toyota-sienna-hybrid" />
      </CalculatorProvider>
    );

    const hitchBadge = screen.getByRole('link', { name: /Toyota Sienna Trailer Hitch & Towing Guide/i });
    expect(hitchBadge).toBeDefined();
    expect(hitchBadge.getAttribute('href')).toBe('/guides/toyota-sienna-trailer-hitch-guide');

    const siennaWaitLink = screen.getByRole('link', { name: /Check Sienna Wait Times/i });
    expect(siennaWaitLink.getAttribute('href')).toBe('/wait-times/sienna');
  });
});
