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
});
