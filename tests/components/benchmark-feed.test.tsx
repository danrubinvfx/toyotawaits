import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BenchmarkFeed, VEHICLE_OPTIONS } from '@/components/benchmarks/benchmark-feed';

describe('BenchmarkFeed Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: {} }),
    } as any);
    window.fetch = fetchMock;
    global.fetch = fetchMock;
  });

  it('renders the vehicle selector with all 6 required vehicle options', async () => {
    render(<BenchmarkFeed />);

    expect(screen.getByRole('button', { name: 'RAV4 (Hybrid/Prime)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Grand Highlander' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sienna' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Prius Prime' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Corolla Cross' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tacoma' })).toBeInTheDocument();
  });

  it('defaults to RAV4 (Hybrid/Prime) as pre-selected model and displays ONLY one benchmark card', async () => {
    render(<BenchmarkFeed />);

    // RAV4 button should be marked as pressed/active
    const rav4Btn = screen.getByRole('button', { name: 'RAV4 (Hybrid/Prime)' });
    expect(rav4Btn.getAttribute('aria-pressed')).toBe('true');

    // ONLY the single RAV4 benchmark card is rendered
    expect(screen.getByTestId('benchmark-card-rav4')).toBeInTheDocument();
    expect(screen.queryByTestId('benchmark-card-sienna')).toBeNull();
    expect(screen.queryByTestId('benchmark-card-grand-highlander')).toBeNull();
    expect(screen.queryByTestId('benchmark-card-prius-prime')).toBeNull();

    // Contains vehicle details, median days, percentile ranges, and sample count
    expect(screen.getByText('Toyota RAV4')).toBeInTheDocument();
    expect(screen.getByText('Prime PHEV & Hybrid (AWD)')).toBeInTheDocument();
    expect(screen.getByText(/Median National Delivery Wait/i)).toBeInTheDocument();
    expect(screen.getByText(/Empirical Wait Range \(P25 – P75\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Based on \d+ verified deliveries/i)).toBeInTheDocument();

    // CTA button exists
    expect(screen.getByText(/Calculate Toyota RAV4 Timeline/i)).toBeInTheDocument();
  });

  it('switches benchmark card and updates metrics when another vehicle is selected', async () => {
    const onSelectModel = vi.fn();
    render(<BenchmarkFeed onSelectModel={onSelectModel} />);

    // Click Grand Highlander
    const ghBtn = screen.getByRole('button', { name: 'Grand Highlander' });
    fireEvent.click(ghBtn);

    expect(onSelectModel).toHaveBeenCalledWith('grand-highlander');
    expect(ghBtn.getAttribute('aria-pressed')).toBe('true');

    // ONLY Grand Highlander card rendered
    expect(screen.getByTestId('benchmark-card-grand-highlander')).toBeInTheDocument();
    expect(screen.queryByTestId('benchmark-card-rav4')).toBeNull();
    expect(screen.getByText('Toyota Grand Highlander')).toBeInTheDocument();
    expect(screen.getByText(/Calculate Toyota Grand Highlander Timeline/i)).toBeInTheDocument();
  });

  it('positions the Delivery Prep & Gear section immediately below the benchmark card and prioritizes vehicle gear', async () => {
    render(<BenchmarkFeed defaultModelId="rav4" />);

    // Delivery Prep section header with active model label
    expect(screen.getByRole('heading', { name: /Delivery (Day )?Prep & (Priority|Essential) Gear/i })).toBeInTheDocument();
    expect(screen.getAllByText('RAV4 (Hybrid/Prime)').length).toBeGreaterThanOrEqual(2);

    // DeliveryPrepChecklist is present with gear for RAV4
    expect(screen.getByTestId('delivery-prep-checklist')).toBeInTheDocument();
    expect(screen.getByText(/FitcamX OEM Integrated 4K Mirror Dashcam \(RAV4\)/i)).toBeInTheDocument();
  });

  it('toggles View All Universal Delivery Gear to expand accessory view', async () => {
    render(<BenchmarkFeed defaultModelId="rav4" />);

    const toggleBtn = screen.getByRole('button', { name: /View All Universal Delivery Gear/i });
    expect(toggleBtn).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(screen.getByRole('button', { name: /Filter to RAV4 \(Hybrid\/Prime\) Only/i })).toBeInTheDocument();

    // Universal items like NOCO Boost GB40 should still be present
    expect(screen.getByText(/NOCO Boost Plus GB40 1000A/i)).toBeInTheDocument();
  });

  it('renders the compact seasonal winter prep banner linking to /winter-prep', async () => {
    render(<BenchmarkFeed defaultModelId="rav4" />);

    expect(screen.getByTestId('winter-prep-seasonal-banner')).toBeInTheDocument();
    expect(screen.getByText(/Prepping for sub-zero deliveries\?/i)).toBeInTheDocument();
    const guideLink = screen.getByRole('link', { name: /View our Canadian Winter Guide →/i });
    expect(guideLink).toBeInTheDocument();
    expect(guideLink).toHaveAttribute('href', '/winter-prep');
  });
});
