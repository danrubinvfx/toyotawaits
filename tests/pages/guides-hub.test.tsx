import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GuidesIndexPage from '@/app/guides/page';

describe('Guides Index Hub Page', () => {
  it('renders seasonal prep and inspection guide cards with expected content and URLs', () => {
    render(<GuidesIndexPage />);

    // 1. Winter Prep Card
    expect(screen.getByText('Canadian Winter Prep & Salt Protection Guide')).toBeInTheDocument();
    expect(
      screen.getAllByText(/BC highway tire laws, Quebec Dec 1 mandates, 12V AGM hybrid auxiliary battery survival/i).length
    ).toBeGreaterThanOrEqual(1);
    const winterPrepLinks = screen.getAllByRole('link', { name: /Read (Mod )?Guide/i });
    const winterHref = winterPrepLinks.some((l) => l.getAttribute('href') === '/winter-prep');
    expect(winterHref).toBe(true);

    // 2. Tires Sizing Card
    expect(screen.getByText('OEM Tire Sizing & 17-Inch Downsizing Guide')).toBeInTheDocument();
    expect(
      screen.getAllByText(/Confirmed bolt patterns \(5x114\.3 \/ 5x120\), center bore offsets/i).length
    ).toBeGreaterThanOrEqual(1);
    const tiresHref = winterPrepLinks.some((l) => l.getAttribute('href') === '/tires');
    expect(tiresHref).toBe(true);

    // 3. Delivery Prep Card
    expect(screen.getAllByText('Zero-Mile Dealership Delivery Inspection').length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByText(/PDI checklist: transit fuse seating, overinflated shipping tires/i).length
    ).toBeGreaterThanOrEqual(1);
    const deliveryHref = winterPrepLinks.some((l) => l.getAttribute('href') === '/delivery-prep');
    expect(deliveryHref).toBe(true);
  });

  it('renders all active model guides and DIY playbook hubs', () => {
    const { container } = render(<GuidesIndexPage />);

    const expectedGuideHrefs = [
      '/guides/toyota-sienna-trailer-hitch-guide',
      '/guides/toyota-sienna-2026-vs-2027',
      '/guides/toyota-rav4-2026-vs-2027',
      '/guides/toyota-grand-highlander-2026-vs-2027',
      '/guides/toyota-rav4-must-have-accessories',
      '/guides/best-toyota-all-weather-floor-mats',
      '/guides/sienna-mods',
      '/guides/rav4-mods',
      '/guides/prius-mods',
      '/guides/grand-highlander-mods',
      '/guides/corolla-mods',
      '/guides/sequoia-mods',
    ];

    for (const href of expectedGuideHrefs) {
      const link = container.querySelector(`a[href="${href}"]`);
      expect(link).toBeInTheDocument();
    }
  });

  it('renders ownership and cold-weather quick cards', () => {
    const { container } = render(<GuidesIndexPage />);

    expect(container.querySelector('a[href="/winter-prep"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/tires"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/delivery-prep"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/guides/ev-charging"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/guides/winter-tires"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/guides/insurance"]')).toBeInTheDocument();
  });
});
