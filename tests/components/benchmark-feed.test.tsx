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

    // Essential Gear section header defaults to RAV4
    expect(screen.getByText(/RAV4 \(Hybrid\/Prime\)/i)).toBeInTheDocument();

    // DeliveryPrepChecklist is present with gear for RAV4
    expect(screen.getByTestId('delivery-prep-checklist')).toBeInTheDocument();
    expect(screen.getByText(/FitcamX OEM Integrated 4K Mirror Dashcam \(RAV4\)/i)).toBeInTheDocument();
  });

  it('switches model gear checklist when global model-change event is dispatched', async () => {
    render(<BenchmarkFeed defaultModelId="rav4" />);

    expect(screen.getByText(/RAV4 \(Hybrid\/Prime\)/i)).toBeInTheDocument();

    // Dispatch global event for Grand Highlander
    act(() => {
      window.dispatchEvent(
        new CustomEvent('toyotawait:model-change', { detail: { model: 'grand-highlander' } })
      );
    });

    // Active vehicle updates to Grand Highlander and no duplicate benchmark card exists
    expect(screen.getAllByText(/Grand Highlander/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId('delivery-prep-checklist')).toBeInTheDocument();
    expect(screen.queryByTestId('benchmark-card-grand-highlander')).toBeNull();
  });

  it('positions the Delivery Prep & Gear section with vehicle-specific gear', async () => {
    render(<BenchmarkFeed defaultModelId="rav4" />);

    // Essential Gear section header with active model label in subtitle
    expect(screen.getByRole('heading', { name: /Essential Day-One Gear & Drop-In Upgrades/i })).toBeInTheDocument();
    expect(screen.getByText(/RAV4 \(Hybrid\/Prime\)/i)).toBeInTheDocument();

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

  it('does not render redundant seasonal banner, transitioning directly into delivery log', async () => {
    render(<BenchmarkFeed defaultModelId="rav4" />);

    expect(screen.queryByTestId('winter-prep-seasonal-banner')).toBeNull();
    expect(screen.queryByText(/Prepping for sub-zero deliveries\?/i)).toBeNull();
  });

  it('synchronizes active model when toyotawait:model-change event is dispatched', async () => {
    render(<BenchmarkFeed defaultModelId="rav4" />);

    // 1. External event selects Sienna
    act(() => {
      window.dispatchEvent(
        new CustomEvent('toyotawait:model-change', { detail: { model: 'sienna' } })
      );
    });

    expect(screen.getAllByText(/Sienna/i).length).toBeGreaterThanOrEqual(1);

    // 2. External event selects Tacoma
    act(() => {
      window.dispatchEvent(
        new CustomEvent('toyotawait:model-change', { detail: { model: 'tacoma' } })
      );
    });

    expect(screen.getAllByText(/Tacoma/i).length).toBeGreaterThanOrEqual(1);
  });

  it('strictly isolates gear by active model (Sienna vs RAV4)', async () => {
    // 1. Initial render with RAV4: should show Muslogy RAV4 gear and NOT Sienna bridge organizer
    render(<BenchmarkFeed defaultModelId="rav4" />);

    expect(screen.getByText(/Muslogy Center Console Organizer Tray \(RAV4\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Muslogy Custom-Fit Padded Center Console Armrest Cover/i)).toBeInTheDocument();
    expect(screen.queryByText(/Muslogy Sienna Center Console Sliding Organizer & Bridge Box/i)).toBeNull();

    // 2. Switch to Sienna
    act(() => {
      window.dispatchEvent(
        new CustomEvent('toyotawait:model-change', { detail: { model: 'sienna' } })
      );
    });

    // Should NOT render RAV4 organizer or armrest cover
    expect(screen.queryByText(/Muslogy Center Console Organizer Tray \(RAV4\)/i)).toBeNull();
    expect(screen.queryByText(/Muslogy Custom-Fit Padded Center Console Armrest Cover/i)).toBeNull();

    // Should render Sienna-compatible items
    expect(screen.getByText(/Muslogy Sienna Center Console Sliding Organizer & Bridge Box/i)).toBeInTheDocument();
    expect(screen.getByText(/3-Row Heavy Duty All-Weather Floor Liners/i)).toBeInTheDocument();
    expect(screen.getByText(/FitcamX OEM Integrated 4K Mirror Dashcam \(Sienna\)/i)).toBeInTheDocument();
  });
});
