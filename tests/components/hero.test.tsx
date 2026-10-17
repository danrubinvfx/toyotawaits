import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/Hero';
import { MarketProvider } from '@/context/MarketContext';

describe('Hero Component', () => {
  it('renders default Canadian hero copy when in CA context', () => {
    render(
      <MarketProvider initialMarket="CA">
        <Hero />
      </MarketProvider>
    );

    expect(screen.getByTestId('hero-domain')).toHaveTextContent('ToyotaWaits.ca');
    expect(screen.getByTestId('hero-eyebrow')).toHaveTextContent(/Canadian Community Tracker/i);
    expect(screen.getByTestId('hero-title')).toHaveTextContent('Canadian Toyota Wait Time Tracker');
    expect(screen.getByTestId('hero-subtitle')).toHaveTextContent(/Canadian order timelines/i);
  });

  it('renders US hero copy when in US context', () => {
    render(
      <MarketProvider initialMarket="US">
        <Hero />
      </MarketProvider>
    );

    expect(screen.getByTestId('hero-domain')).toHaveTextContent('ToyotaWaits.com');
    expect(screen.getByTestId('hero-eyebrow')).toHaveTextContent(/U\.S\. Community Tracker/i);
    expect(screen.getByTestId('hero-title')).toHaveTextContent('U.S. Toyota Wait Time & Markup Tracker');
    expect(screen.getByTestId('hero-subtitle')).toHaveTextContent(/U\.S\. dealer allocations/i);
  });
});
