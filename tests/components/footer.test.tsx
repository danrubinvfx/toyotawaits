import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/layout/footer';

describe('Footer Component', () => {
  it('renders the brand and copyright information', () => {
    render(<Footer />);

    expect(screen.getByText('ToyotaWaits.ca')).toBeInTheDocument();
    expect(screen.getByText(/Canadian Community Data Initiative/i)).toBeInTheDocument();
  });

  it('renders the Ko-fi support pill buttons with target="_blank" and rel="noopener noreferrer"', () => {
    render(<Footer />);

    const supportButtons = screen.getAllByRole('link', { name: /☕ Support this tracker/i });
    expect(supportButtons.length).toBeGreaterThanOrEqual(1);

    supportButtons.forEach((btn) => {
      expect(btn).toHaveAttribute('href', 'https://ko-fi.com/toyotawaits');
      expect(btn).toHaveAttribute('target', '_blank');
      expect(btn).toHaveAttribute('rel', 'noopener noreferrer');
      expect(btn.className).toContain('border-neutral-800');
      expect(btn.className).toContain('text-neutral-400');
    });
  });

  it('renders statutory Amazon Associates disclaimer', () => {
    render(<Footer />);
    expect(screen.getByText(/As an Amazon Associate I earn from qualifying purchases\./i)).toBeInTheDocument();
  });

  it('renders secondary Ko-fi community callout card with verified link', () => {
    render(<Footer />);

    expect(screen.getByTestId('kofi-footer-callout')).toBeInTheDocument();
    expect(screen.getByText(/ToyotaWaits is an independent, ad-free community project/i)).toBeInTheDocument();

    const buyCoffeeBtn = screen.getByTestId('kofi-footer-button');
    expect(buyCoffeeBtn).toHaveAttribute('href', 'https://ko-fi.com/toyotawaits');
    expect(buyCoffeeBtn).toHaveAttribute('target', '_blank');
    expect(buyCoffeeBtn).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders Buyer Prep & Mods Hub links including Canadian Tire Guide', () => {
    render(<Footer />);

    const tireLink = screen.getByRole('link', { name: /Canadian Tire Guide 🛞/i });
    expect(tireLink).toBeInTheDocument();
    expect(tireLink).toHaveAttribute('href', '/tires');

    const winterPrepLink = screen.getByRole('link', { name: /Winter Prep & Survival ❄️/i });
    expect(winterPrepLink).toBeInTheDocument();
    expect(winterPrepLink).toHaveAttribute('href', '/winter-prep');
  });
});
