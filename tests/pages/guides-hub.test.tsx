import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GuidesIndexPage, { dynamic, instant } from '@/app/guides/page';

describe('Guides Index Hub Page', () => {
  it('preserves Next.js 16 route segment exports', () => {
    expect(dynamic).toBe('force-dynamic');
    expect(instant).toBe(false);
  });

  it('features Toyota DIY Maintenance & Upkeep Guide in Popular Guides without duplicates', () => {
    const { container } = render(<GuidesIndexPage />);

    const popularGrid = container.querySelector('[data-testid="popular-guides-grid"]');
    expect(popularGrid).not.toBeNull();

    expect(screen.getByText('Toyota DIY Maintenance & Upkeep Guide')).toBeInTheDocument();
    expect(screen.getByText('DIY & Maintenance')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Model-by-model 0W-8, 0W-16, and 0W-20 oil specs, OEM filter numbers, hybrid battery fan filter cleaning, 12V battery care, and clear-coat safe wash gear\./i
      )
    ).toBeInTheDocument();
    expect(screen.getByText('[Maintenance]')).toBeInTheDocument();
    expect(screen.getByText('[DIY]')).toBeInTheDocument();
    expect(screen.getByText('[Hybrid Care]')).toBeInTheDocument();

    const links = container.querySelectorAll('a[href="/guides/toyota-diy-maintenance-guide"]');
    expect(links.length).toBe(1);
    expect(popularGrid!.querySelector('a[href="/guides/toyota-diy-maintenance-guide"]')).not.toBeNull();
  });

  it('renders Popular Guides evergreen playbooks and links', () => {
    const { container } = render(<GuidesIndexPage />);
    const popularGrid = container.querySelector('[data-testid="popular-guides-grid"]');
    expect(popularGrid).not.toBeNull();

    const expectedPopularHrefs = [
      '/guides/toyota-diy-maintenance-guide',
      '/delivery-prep',
      '/tires',
      '/winter-prep',
      '/guides/toyota-ecp-warranty-guide',
      '/guides/toyota-sienna-trailer-hitch-guide',
      '/guides/toyota-rav4-must-have-accessories',
      '/guides/best-toyota-all-weather-floor-mats',
      '/guides/toyota-first-wash-paint-care',
    ];

    for (const href of expectedPopularHrefs) {
      expect(popularGrid!.querySelector(`a[href="${href}"]`)).toBeInTheDocument();
    }
  });

  it('keeps all 2026 vs. 2027 model-year rollover guides visible in their dedicated section', () => {
    const { container } = render(<GuidesIndexPage />);
    const rolloverGrid = container.querySelector('[data-testid="rollover-guides-grid"]');
    expect(rolloverGrid).not.toBeNull();

    const expectedRolloverHrefs = [
      '/guides/toyota-rav4-2026-vs-2027',
      '/guides/toyota-sienna-2026-vs-2027',
      '/guides/toyota-grand-highlander-2026-vs-2027',
      '/guides/toyota-corolla-cross-2026-vs-2027',
      '/guides/toyota-tundra-2026-vs-2027',
      '/guides/toyota-sequoia-2026-vs-2027',
      '/guides/toyota-highlander-2026-vs-2027',
      '/guides/toyota-camry-2026-vs-2027',
      '/guides/toyota-land-cruiser-2026-vs-2027',
      '/guides/toyota-prius-2026-vs-2027',
    ];

    for (const href of expectedRolloverHrefs) {
      expect(rolloverGrid!.querySelector(`a[href="${href}"]`)).toBeInTheDocument();
    }
  });

  it('groups model-vs-model comparisons inside a collapsed-by-default <details> disclosure with SSR links', () => {
    const { container } = render(<GuidesIndexPage />);
    const details = container.querySelector(
      'details[data-testid="cross-model-comparisons-details"]'
    );
    expect(details).not.toBeNull();
    expect(details!.hasAttribute('open')).toBe(false);
    expect(screen.getByText('Model-vs-Model Comparison Guides')).toBeInTheDocument();
    expect(screen.getByText('(4 Guides)')).toBeInTheDocument();

    const expectedComparisonHrefs = [
      '/guides/toyota-rav4-vs-sienna',
      '/guides/toyota-corolla-cross-vs-rav4-hybrid',
      '/guides/toyota-grand-highlander-vs-lexus-tx',
      '/guides/lexus-tx-vs-rx',
    ];

    for (const href of expectedComparisonHrefs) {
      expect(details!.querySelector(`a[href="${href}"]`)).toBeInTheDocument();
    }
  });

  it('renders model mod hubs and specialty EV, insurance & Lexus guides', () => {
    const { container } = render(<GuidesIndexPage />);

    const expectedOtherHrefs = [
      '/guides/sienna-mods',
      '/guides/rav4-mods',
      '/guides/rav4-se-mods',
      '/guides/grand-highlander-mods',
      '/guides/prius-mods',
      '/guides/corolla-mods',
      '/guides/sequoia-mods',
      '/guides/land-cruiser-mods',
      '/guides/ev-charging',
      '/guides/winter-tires',
      '/guides/insurance',
      '/guides/lexus-gx550-must-have-accessories',
      '/guides/lexus-tx-delivery-prep-gear',
      '/guides/lexus-phev-home-charging-setup',
    ];

    for (const href of expectedOtherHrefs) {
      expect(container.querySelector(`a[href="${href}"]`)).toBeInTheDocument();
    }
  });

  it('renders clear funnel CTAs to Log Your Order (/submit) and Check Live Local Stock (/inventory)', () => {
    const { container } = render(<GuidesIndexPage />);
    const ctaSection = container.querySelector('[data-testid="guides-funnel-ctas"]');
    expect(ctaSection).not.toBeNull();

    const submitLink = ctaSection!.querySelector('a[href="/submit"]');
    const inventoryLink = ctaSection!.querySelector('a[href="/inventory"]');
    expect(submitLink).toBeInTheDocument();
    expect(submitLink!.textContent).toMatch(/Log Your Order/i);
    expect(inventoryLink).toBeInTheDocument();
    expect(inventoryLink!.textContent).toMatch(/Check Live Local Stock/i);
  });
});
