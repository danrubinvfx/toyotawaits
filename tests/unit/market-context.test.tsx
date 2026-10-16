import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MarketProvider, useMarket, getClientDetectedMarket } from '@/context/MarketContext';

function TestConsumer() {
  const { market, setMarket, toggleMarket, isUs } = useMarket();
  return (
    <div>
      <span data-testid="current-market">{market}</span>
      <span data-testid="is-us">{isUs ? 'yes' : 'no'}</span>
      <button onClick={() => setMarket('US')} data-testid="set-us">
        Set US
      </button>
      <button onClick={() => setMarket('CA')} data-testid="set-ca">
        Set CA
      </button>
      <button onClick={toggleMarket} data-testid="toggle">
        Toggle
      </button>
    </div>
  );
}

describe('MarketContext & useMarket', () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = 'toyotawaits_market=; path=/; max-age=0';
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
    document.cookie = 'toyotawaits_market=; path=/; max-age=0';
  });

  it('defaults to CA when no storage, cookie, host, or param are provided', () => {
    render(
      <MarketProvider>
        <TestConsumer />
      </MarketProvider>
    );

    expect(screen.getByTestId('current-market')).toHaveTextContent('CA');
    expect(screen.getByTestId('is-us')).toHaveTextContent('no');
  });

  it('updates market, localStorage, and cookie when setMarket is called', () => {
    render(
      <MarketProvider>
        <TestConsumer />
      </MarketProvider>
    );

    const setUsBtn = screen.getByTestId('set-us');
    fireEvent.click(setUsBtn);

    expect(screen.getByTestId('current-market')).toHaveTextContent('US');
    expect(screen.getByTestId('is-us')).toHaveTextContent('yes');
    expect(localStorage.getItem('toyotawaits_market')).toBe('US');
    expect(document.cookie).toContain('toyotawaits_market=US');

    const setCaBtn = screen.getByTestId('set-ca');
    fireEvent.click(setCaBtn);

    expect(screen.getByTestId('current-market')).toHaveTextContent('CA');
    expect(screen.getByTestId('is-us')).toHaveTextContent('no');
    expect(localStorage.getItem('toyotawaits_market')).toBe('CA');
    expect(document.cookie).toContain('toyotawaits_market=CA');
  });

  it('toggles market state when toggleMarket is called', () => {
    render(
      <MarketProvider>
        <TestConsumer />
      </MarketProvider>
    );

    const toggleBtn = screen.getByTestId('toggle');
    fireEvent.click(toggleBtn);

    expect(screen.getByTestId('current-market')).toHaveTextContent('US');

    fireEvent.click(toggleBtn);
    expect(screen.getByTestId('current-market')).toHaveTextContent('CA');
  });

  it('detects market from localStorage on mount', () => {
    localStorage.setItem('toyotawaits_market', 'US');

    render(
      <MarketProvider>
        <TestConsumer />
      </MarketProvider>
    );

    expect(screen.getByTestId('current-market')).toHaveTextContent('US');
    expect(screen.getByTestId('is-us')).toHaveTextContent('yes');
  });

  it('detects market from cookie when localStorage is absent', () => {
    document.cookie = 'toyotawaits_market=US; path=/';

    render(
      <MarketProvider>
        <TestConsumer />
      </MarketProvider>
    );

    expect(screen.getByTestId('current-market')).toHaveTextContent('US');
  });

  it('detects market from toyotawaits.com hostname', () => {
    const originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      value: new URL('https://toyotawaits.com/estimates'),
      writable: true,
      configurable: true,
    });

    expect(getClientDetectedMarket()).toBe('US');

    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
  });

  it('detects market from URL query param ?market=US', () => {
    const originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      value: new URL('https://toyotawaits.ca/estimates?market=US'),
      writable: true,
      configurable: true,
    });

    expect(getClientDetectedMarket()).toBe('US');

    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
  });

  it('provides safe fallback when useMarket is used outside MarketProvider', () => {
    render(<TestConsumer />);

    expect(screen.getByTestId('current-market')).toHaveTextContent('CA');
    expect(screen.getByTestId('is-us')).toHaveTextContent('no');
  });
});
