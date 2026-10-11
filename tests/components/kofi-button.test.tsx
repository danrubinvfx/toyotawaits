import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  KOFI_URL,
  KofiHeaderPill,
  KofiFloatingPill,
  KofiCalloutCard,
} from '@/components/common/kofi-button';

describe('Ko-fi Support Components', () => {
  it('KofiHeaderPill renders discrete outline pill with verified Ko-fi URL', () => {
    render(<KofiHeaderPill />);

    const pill = screen.getByTestId('kofi-header-pill');
    expect(pill).toBeInTheDocument();
    expect(pill).toHaveAttribute('href', KOFI_URL);
    expect(pill).toHaveAttribute('target', '_blank');
    expect(pill).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByText('Support Tracker ☕')).toBeInTheDocument();
  });

  it('KofiFloatingPill renders mobile floating pill positioned bottom-4 right-4 z-40', () => {
    render(<KofiFloatingPill />);

    const container = screen.getByTestId('kofi-floating-container');
    expect(container).toHaveClass('fixed', 'bottom-4', 'right-4', 'z-40', 'sm:hidden');

    const pill = screen.getByTestId('kofi-floating-pill');
    expect(pill).toHaveAttribute('href', KOFI_URL);
    expect(pill).toHaveAttribute('target', '_blank');
    expect(pill).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByText('Buy a Coffee')).toBeInTheDocument();
  });

  it('KofiCalloutCard renders secondary callout card with message and button', () => {
    render(<KofiCalloutCard />);

    expect(screen.getByTestId('kofi-footer-callout')).toBeInTheDocument();
    expect(
      screen.getByText(/ToyotaWaits is an independent, ad-free community project/i)
    ).toBeInTheDocument();

    const button = screen.getByTestId('kofi-footer-button');
    expect(button).toHaveAttribute('href', KOFI_URL);
    expect(button).toHaveAttribute('target', '_blank');
    expect(button).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByText('☕ Buy us a coffee')).toBeInTheDocument();
  });
});
