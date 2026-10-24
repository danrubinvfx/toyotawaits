import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CalculatorGearCards } from '@/components/gear/CalculatorGearCards';
import { VehicleSavingsCalculator } from '@/components/calculator/VehicleSavingsCalculator';
import { CalculatorProvider } from '@/context/CalculatorContext';
import { MarketProvider } from '@/context/MarketContext';
import { buildAmazonAffiliateUrl } from '@/lib/gear/affiliate';
import { GEAR_MARKET_CATALOG } from '@/data/gear/catalog';

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

  it('displays curated accessories for Sienna including 3-row high-wall liners (ASIN B0CFV5R8QM) and hitch', () => {
    render(
      <MarketProvider initialMarket="CA">
        <CalculatorGearCards activeModel="sienna" />
      </MarketProvider>
    );

    expect(screen.getByText(/3-Row All-Weather High-Wall Floor Liners/i)).toBeDefined();
    expect(screen.getByText(/Class III 2-Inch Trailer Hitch Receiver/i)).toBeDefined();
    expect(screen.getByText(/Rear Seatback & Kick Mat Protectors/i)).toBeDefined();

    // Verify Sienna floor liners link strictly uses Sienna ASIN B0CFV5R8QM and never mentions RAV4
    const siennaLinerLink = screen.getByRole('link', { name: /View 3-Row Liners/i });
    expect(siennaLinerLink.getAttribute('href')).toContain('B0CFV5R8QM');
    expect(siennaLinerLink.getAttribute('href')).not.toContain('RAV4');
    expect(siennaLinerLink.getAttribute('href')).not.toContain('B0833DT93B');
  });

  it('strictly isolates RAV4 floor liners to ASIN B0833DT93B and never includes Sienna data', () => {
    render(
      <MarketProvider initialMarket="CA">
        <CalculatorGearCards activeModel="rav4" />
      </MarketProvider>
    );

    const rav4LinerLink = screen.getByRole('link', { name: /View All-Weather Liners/i });
    expect(rav4LinerLink.getAttribute('href')).toContain('B0833DT93B');
    expect(rav4LinerLink.getAttribute('href')).not.toContain('B0CFV5R8QM');
    expect(rav4LinerLink.getAttribute('href')).not.toContain('Sienna');
  });

  it('verifies buildAmazonAffiliateUrl in src/lib/gear/affiliate.ts generates correct CA and US URLs', () => {
    // CA query fallback
    const caQueryUrl = buildAmazonAffiliateUrl({
      query: 'Toyota Sienna all weather floor mats 2021-2026',
      market: 'CA',
    });
    expect(caQueryUrl).toBe(
      'https://www.amazon.ca/s?k=Toyota%20Sienna%20all%20weather%20floor%20mats%202021-2026&tag=toyotawaits-20'
    );

    // CA direct ASIN
    const caAsinUrl = buildAmazonAffiliateUrl({
      asin: 'B0CFV5R8QM',
      market: 'CA',
    });
    expect(caAsinUrl).toBe('https://www.amazon.ca/dp/B0CFV5R8QM?tag=toyotawaits-20');

    // US query fallback
    const usQueryUrl = buildAmazonAffiliateUrl({
      query: 'Toyota Sienna all weather floor mats 2021-2026',
      market: 'US',
    });
    expect(usQueryUrl).toBe(
      'https://www.amazon.com/s?k=Toyota%20Sienna%20all%20weather%20floor%20mats%202021-2026&tag=toyotawaits07-20'
    );

    // US direct ASIN
    const usAsinUrl = buildAmazonAffiliateUrl({
      asin: 'B0CFV5R8QM',
      market: 'US',
    });
    expect(usAsinUrl).toBe('https://www.amazon.com/dp/B0CFV5R8QM?tag=toyotawaits07-20');
  });

  it('verifies GEAR_MARKET_CATALOG floor liner entries for Sienna and RAV4', () => {
    const siennaEntry = GEAR_MARKET_CATALOG['sienna-all-weather-liners'];
    expect(siennaEntry.title).toBe('3-Row All-Weather High-Wall Floor Liners');
    expect(siennaEntry.asin_ca).toBe('B0CFV5R8QM');
    expect(siennaEntry.asin_us).toBe('B0CFV5R8QM');
    expect(siennaEntry.searchKeywordsCA).toBe('Toyota Sienna all weather floor mats 2021-2026');
    expect(siennaEntry.searchKeywordsUS).toBe('Toyota Sienna all weather floor mats 2021-2026');

    const rav4Entry = GEAR_MARKET_CATALOG['high-wall-floor-liners-rav4'];
    expect(rav4Entry.asin_ca).toBe('B0833DT93B');
    expect(rav4Entry.asin_us).toBe('B0833DT93B');
    expect(rav4Entry.searchKeywordsCA).toBe('TuxMat Toyota RAV4 2019-2026');
    expect(rav4Entry.searchKeywordsUS).toBe('TuxMat Toyota RAV4 2019-2026');
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
  it('correctly maps Crown Signia to /wait-times/crown-signia and /inventory?model=Crown%20Signia without 404', () => {
    render(
      <CalculatorProvider initialPresetId="2025-toyota-crown-signia-hybrid">
        <VehicleSavingsCalculator initialTargetPresetId="2025-toyota-crown-signia-hybrid" />
      </CalculatorProvider>
    );

    const waitTimesLink = screen.getByRole('link', { name: /Check Crown Signia Wait Times/i });
    expect(waitTimesLink.getAttribute('href')).toBe('/wait-times/crown-signia');

    const inventoryLink = screen.getByRole('link', { name: /Skip the Wait \/ View Live Stock/i });
    expect(inventoryLink.getAttribute('href')).toBe('/inventory?model=Crown%20Signia');
  });

  it('validates 10-character alphanumeric ASINs and falls back safely to search query to prevent 404s', () => {
    // Valid 10-char ASIN
    const validUrl = buildAmazonAffiliateUrl({
      asin: 'B0CFV5R8QM',
      searchQuery: 'Toyota Sienna floor mats',
      market: 'CA',
    });
    expect(validUrl).toBe('https://www.amazon.ca/dp/B0CFV5R8QM?tag=toyotawaits-20');

    // Invalid ASIN format falls back to searchQuery
    const invalidAsinUrl = buildAmazonAffiliateUrl({
      asin: 'INVALID_ASIN_12345',
      searchQuery: 'Toyota Sienna floor mats',
      market: 'CA',
    });
    expect(invalidAsinUrl).toBe('https://www.amazon.ca/s?k=Toyota%20Sienna%20floor%20mats&tag=toyotawaits-20');

    // Missing ASIN falls back to searchQuery
    const noAsinUrl = buildAmazonAffiliateUrl({
      searchQuery: 'Toyota RAV4 dash cam',
      market: 'US',
    });
    expect(noAsinUrl).toBe('https://www.amazon.com/s?k=Toyota%20RAV4%20dash%20cam&tag=toyotawaits07-20');
  });
});
