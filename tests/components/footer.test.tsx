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

  it('renders statutory Amazon Associates and Community Transparency affiliate disclaimer in footer', () => {
    render(<Footer />);
    expect(screen.getByText(/As an Amazon Associate I earn from qualifying purchases\./i)).toBeInTheDocument();
    expect(screen.getByText(/Some links on this page are affiliate links/i)).toBeInTheDocument();
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

  it('renders standardized Global Nominative Fair Use Disclaimer', () => {
    render(<Footer />);

    expect(
      screen.getByText(
        /toyotawaits\.ca is an independent community tracker and is not affiliated with, endorsed by, or sponsored by Toyota Motor Corporation or Toyota Canada Inc\./i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /All trademarks, service marks, and trade names are the property of their respective owners and are used strictly for identification purposes under nominative fair use\./i
      )
    ).toBeInTheDocument();
  });

  it('renders FTC and Canadian compliant Regulatory & Affiliate Notice in footer', () => {
    render(<Footer />);

    expect(
      screen.getByText(
        /toyotawaits\.ca participates in affiliate programs, including the Amazon Associates Program\. As an Amazon Associate, we may earn commissions from qualifying purchases made through links on this site at no additional cost to you\./i
      )
    ).toBeInTheDocument();
  });
});
