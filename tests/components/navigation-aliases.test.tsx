import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileTabBar } from '@/components/navigation/MobileTabBar';
import { MarketProvider } from '@/context/MarketContext';

describe('Navigation Aliases Re-exports', () => {
  it('renders Navbar alias correctly', () => {
    render(<Navbar />);
    expect(screen.getByTestId('mobile-menu-toggle')).toBeInTheDocument();
  });

  it('renders MobileTabBar alias correctly', () => {
    render(
      <MarketProvider>
        <MobileTabBar />
      </MarketProvider>
    );
    expect(screen.getByTestId('mobile-bottom-dock')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-dock-guides')).toBeInTheDocument();
  });
});
