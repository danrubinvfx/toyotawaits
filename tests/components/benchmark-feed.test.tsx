import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BenchmarkFeed, VEHICLE_OPTIONS } from '@/components/benchmarks/benchmark-feed';

describe('BenchmarkFeed Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('defaults to RAV4 (Hybrid/Prime) as pre-selected model and does NOT render redundant benchmark cards', async () => {
    render(<BenchmarkFeed />);

    // Verified Canadian Wait-Time Benchmarks card is completely removed
    expect(screen.queryByTestId('benchmark-card-rav4')).toBeNull();
    expect(screen.queryByText(/Median National Delivery Wait/i)).toBeNull();
    expect(screen.queryByText(/Live 2026 Supabase Feed/i)).toBeNull();
    expect(screen.queryByText(/Calculate .* Timeline/i)).toBeNull();

    // Delivery Prep section header defaults to RAV4
    expect(screen.getByText('RAV4 (Hybrid/Prime)')).toBeInTheDocument();

    // DeliveryPrepChecklist is present with gear for RAV4
    expect(screen.getByTestId('delivery-prep-checklist')).toBeInTheDocument();
    expect(screen.getByText(/FitcamX OEM Integrated 4K Mirror Dashcam \(RAV4\)/i)).toBeInTheDocument();
  });

  it('switches model gear checklist when global model-change event is dispatched', async () => {
    render(<BenchmarkFeed defaultModelId="rav4" />);

    expect(screen.getByText('RAV4 (Hybrid/Prime)')).toBeInTheDocument();

    // Dispatch global event for Grand Highlander
    act(() => {
      window.dispatchEvent(
        new CustomEvent('toyotawait:model-change', { detail: { model: 'grand-highlander' } })
      );
    });

    // Active vehicle updates to Grand Highlander and no duplicate benchmark card exists
    expect(screen.getAllByText('Grand Highlander').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId('delivery-prep-checklist')).toBeInTheDocument();
    expect(screen.queryByTestId('benchmark-card-grand-highlander')).toBeNull();
  });

  it('positions the Delivery Prep & Gear section with vehicle-specific gear', async () => {
    render(<BenchmarkFeed defaultModelId="rav4" />);

    // Delivery Prep section header with active model label
    expect(screen.getByRole('heading', { name: /Delivery (Day )?Prep & (Priority|Essential )?Gear/i })).toBeInTheDocument();
    expect(screen.getByText('RAV4 (Hybrid/Prime)')).toBeInTheDocument();

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

  it('synchronizes active model when toyotawait:model-change event is dispatched', async () => {
    render(<BenchmarkFeed defaultModelId="rav4" />);

    // 1. External event selects Sienna
    act(() => {
      window.dispatchEvent(
        new CustomEvent('toyotawait:model-change', { detail: { model: 'sienna' } })
      );
    });

    expect(screen.getAllByText('Sienna').length).toBeGreaterThanOrEqual(1);

    // 2. External event selects Tacoma
    act(() => {
      window.dispatchEvent(
        new CustomEvent('toyotawait:model-change', { detail: { model: 'tacoma' } })
      );
    });

    expect(screen.getAllByText('Tacoma').length).toBeGreaterThanOrEqual(1);
  });
});
