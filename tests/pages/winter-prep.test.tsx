import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { WinterPrepView, WINTER_VEHICLE_OPTIONS } from '@/components/winter-prep/winter-prep-view';
import WinterPrepPage, { dynamic, instant } from '@/app/winter-prep/page';
import * as hostMetadata from '@/lib/seo/host-metadata';
import * as popularityData from '@/lib/data/accessories-popularity';

describe('WinterPrepView Page Component', () => {
  it('renders the clean hero section explaining Canadian cold-weather realities', () => {
    render(<WinterPrepView />);

    expect(
      screen.getByRole('heading', {
        name: /Canadian Winter Delivery & Cold-Weather Survival Guide/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/🇨🇦 Canadian Winter Survival Playbook/i)).toBeInTheDocument();
    expect(screen.getByText(/Jump Packs Rated -20°C to \+50°C/i)).toBeInTheDocument();

    // 3 Realities Callouts
    expect(screen.getByText(/12V Battery Drop/i)).toBeInTheDocument();
    expect(screen.getByText(/Salt & Slush Armor/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Freezing Rain Defense/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders the interactive vehicle selector with all 6 required Toyota models and defaults to RAV4', () => {
    render(<WinterPrepView />);

    expect(screen.getByRole('button', { name: 'RAV4 (Hybrid / Prime)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Grand Highlander' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sienna' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Prius Prime' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Corolla Cross' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tacoma' })).toBeInTheDocument();

    // RAV4 is pre-selected
    const rav4Btn = screen.getByRole('button', { name: 'RAV4 (Hybrid / Prime)' });
    expect(rav4Btn.getAttribute('aria-pressed')).toBe('true');

    // Default RAV4 guidance
    expect(screen.getByText(/RAV4 \(Hybrid \/ Prime \/ Gas\)/i)).toBeInTheDocument();
    expect(screen.getByText(/TuxMat Custom High-Wall Floor Liners \(RAV4\)/i)).toBeInTheDocument();
  });

  it('updates model-specific guidance and product cards when vehicle selection changes', () => {
    render(<WinterPrepView />);

    // Switch to Grand Highlander
    const ghBtn = screen.getByRole('button', { name: 'Grand Highlander' });
    fireEvent.click(ghBtn);

    expect(ghBtn.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByText(/Grand Highlander \(Hybrid MAX & Standard\)/i)).toBeInTheDocument();
    expect(
      screen.getByText(/3-Row Heavy Duty All-Weather Floor Liners \(Grand Highlander\)/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Rear quarter panel compartment/i)).toBeInTheDocument();

    // Switch to Tacoma
    const tacomaBtn = screen.getByRole('button', { name: 'Tacoma' });
    fireEvent.click(tacomaBtn);

    expect(tacomaBtn.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByText(/Tacoma \(i-FORCE MAX & Turbo\)/i)).toBeInTheDocument();
    expect(
      screen.getByText(/store the jump pack in the rear cab under-seat compartment/i)
    ).toBeInTheDocument();
  });

  it('renders cross-links back to delivery timeline calculator and full mods catalog', () => {
    render(<WinterPrepView />);

    const estimatorLink = screen.getByRole('link', { name: /Delivery Timeline Calculator/i });
    expect(estimatorLink).toBeInTheDocument();
    expect(estimatorLink).toHaveAttribute('href', '/#estimator');

    const modsLink = screen.getByRole('link', { name: /Complete Mods & Gear Catalog/i });
    expect(modsLink).toBeInTheDocument();
    expect(modsLink).toHaveAttribute('href', '/mods');

    // Tire Guide cross-link banner
    expect(screen.getByTestId('winter-prep-tire-callout')).toBeInTheDocument();
    const tireGuideLink = screen.getByRole('link', {
      name: /(View Canadian Tire Guide 🛞 →|View Full Sizing Matrix & Reviews 🛞 →)/i,
    });
    expect(tireGuideLink).toBeInTheDocument();
    expect(tireGuideLink).toHaveAttribute('href', '/tires');
  });

  it('includes the mandatory Amazon Associates statutory disclaimer', () => {
    render(<WinterPrepView />);

    expect(
      screen.getByText(/As an Amazon Associate I earn from qualifying purchases\./i)
    ).toBeInTheDocument();
  });
});

describe('WinterPrepPage Route & Essential Kit Shelf', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('exports force-dynamic and instant=false route segment configuration', () => {
    expect(dynamic).toBe('force-dynamic');
    expect(instant).toBe(false);
  });

  it('renders NOCO GB40 (B015TKUPIC) and Faraday Pouch (B07MDF5TX9) in the top 2 slots with CA (toyotawaits-20) routing', async () => {
    vi.spyOn(hostMetadata, 'getRequestMarketMetadata').mockResolvedValue({
      market: 'CA',
      isUS: false,
      baseUrl: 'https://www.toyotawaits.ca',
      alternatesLanguages: {
        'en-CA': 'https://www.toyotawaits.ca/winter-prep',
        'en-US': 'https://www.toyotawaits.com/winter-prep',
        'x-default': 'https://www.toyotawaits.ca/winter-prep',
      },
    });
    vi.spyOn(popularityData, 'getPopularAccessoryWeights').mockResolvedValue({});

    render(await WinterPrepPage());

    const shelf = screen.getByTestId('day-one-gear-shelf');
    expect(shelf).toBeInTheDocument();

    const cards = shelf.querySelectorAll('[data-testid^="checklist-item-"]');
    expect(cards.length).toBe(3);
    expect(cards[0]).toHaveAttribute('data-testid', 'checklist-item-noco-gb40-jump-pack');
    expect(cards[1]).toHaveAttribute('data-testid', 'checklist-item-rfid-faraday-key-fob-pouch');

    const slot1Links = within(cards[0] as HTMLElement)
      .getAllByRole('link')
      .filter((link) => (link.getAttribute('href') || '').includes('amazon.ca'));
    expect(slot1Links.length).toBeGreaterThanOrEqual(1);
    expect(slot1Links[0]).toHaveAttribute('href', expect.stringContaining('B015TKUPIC'));
    expect(slot1Links[0]).toHaveAttribute('href', expect.stringContaining('tag=toyotawaits-20'));
    expect(slot1Links[0]).toHaveAttribute('rel', 'sponsored noopener noreferrer nofollow');

    const slot2Links = within(cards[1] as HTMLElement)
      .getAllByRole('link')
      .filter((link) => (link.getAttribute('href') || '').includes('amazon.ca'));
    expect(slot2Links.length).toBeGreaterThanOrEqual(1);
    expect(slot2Links[0]).toHaveAttribute('href', expect.stringContaining('B07MDF5TX9'));
    expect(slot2Links[0]).toHaveAttribute('href', expect.stringContaining('tag=toyotawaits-20'));
    expect(slot2Links[0]).toHaveAttribute('rel', 'sponsored noopener noreferrer nofollow');
  });

  it('routes NOCO GB40 (B015TKUPIC) and Faraday Pouch (B07MDF5TX9) to amazon.com with toyotawaits07-20 when market is US', async () => {
    vi.spyOn(hostMetadata, 'getRequestMarketMetadata').mockResolvedValue({
      market: 'US',
      isUS: true,
      baseUrl: 'https://www.toyotawaits.com',
      alternatesLanguages: {
        'en-CA': 'https://www.toyotawaits.ca/winter-prep',
        'en-US': 'https://www.toyotawaits.com/winter-prep',
        'x-default': 'https://www.toyotawaits.ca/winter-prep',
      },
    });
    vi.spyOn(popularityData, 'getPopularAccessoryWeights').mockResolvedValue({});

    render(await WinterPrepPage());

    const shelf = screen.getByTestId('day-one-gear-shelf');
    const cards = shelf.querySelectorAll('[data-testid^="checklist-item-"]');
    expect(cards.length).toBe(3);
    expect(cards[0]).toHaveAttribute('data-testid', 'checklist-item-noco-gb40-jump-pack');
    expect(cards[1]).toHaveAttribute('data-testid', 'checklist-item-rfid-faraday-key-fob-pouch');

    const slot1Links = within(cards[0] as HTMLElement)
      .getAllByRole('link')
      .filter((link) => (link.getAttribute('href') || '').includes('amazon.com'));
    expect(slot1Links.length).toBeGreaterThanOrEqual(1);
    expect(slot1Links[0]).toHaveAttribute('href', expect.stringContaining('B015TKUPIC'));
    expect(slot1Links[0]).toHaveAttribute('href', expect.stringContaining('tag=toyotawaits07-20'));
    expect(slot1Links[0]).toHaveAttribute('rel', 'sponsored noopener noreferrer nofollow');

    const slot2Links = within(cards[1] as HTMLElement)
      .getAllByRole('link')
      .filter((link) => (link.getAttribute('href') || '').includes('amazon.com'));
    expect(slot2Links.length).toBeGreaterThanOrEqual(1);
    expect(slot2Links[0]).toHaveAttribute('href', expect.stringContaining('B07MDF5TX9'));
    expect(slot2Links[0]).toHaveAttribute('href', expect.stringContaining('tag=toyotawaits07-20'));
    expect(slot2Links[0]).toHaveAttribute('rel', 'sponsored noopener noreferrer nofollow');
  });
});
