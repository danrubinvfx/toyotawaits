import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ModelSummaryCards } from '@/components/dashboard/model-summary-cards';

describe('ModelSummaryCards Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: {} }),
    } as any);
    window.fetch = fetchMock;
    global.fetch = fetchMock;
  });

  it('renders all four featured model cards with verified delivery sample sizes', async () => {
    render(<ModelSummaryCards />);

    await waitFor(() => {
      expect(screen.getByText('Toyota RAV4')).toBeInTheDocument();
      expect(screen.getByText('Toyota Prius Prime')).toBeInTheDocument();
      expect(screen.getByText('Toyota Prius')).toBeInTheDocument();
      expect(screen.getByText('Toyota Sienna')).toBeInTheDocument();
    });

    const sampleBadges = screen.getAllByText(/Based on \d+ verified deliveries/i);
    expect(sampleBadges.length).toBe(4);
  });

  it('displays median delivery wait days and percentiles', async () => {
    render(
      <ModelSummaryCards
        initialBenchmarks={{
          rav4: {
            model: 'rav4',
            sample_size: 25,
            min_days: 100,
            p25_days: 180,
            median_days: 360,
            p75_days: 475,
            max_days: 500,
            mean_days: 350,
          },
          'prius-prime': {
            model: 'prius-prime',
            sample_size: 15,
            min_days: 30,
            p25_days: 120,
            median_days: 175,
            p75_days: 220,
            max_days: 350,
            mean_days: 168,
          },
        }}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('360')).toBeInTheDocument();
      expect(screen.getByText('180d')).toBeInTheDocument();
      expect(screen.getByText('475d')).toBeInTheDocument();
      expect(screen.getByText('Based on 25 verified deliveries')).toBeInTheDocument();
    });
  });

  it('triggers onSelectModel when clicking calculate timeline button', async () => {
    const onSelectModel = vi.fn();
    render(<ModelSummaryCards onSelectModel={onSelectModel} />);

    await waitFor(() => {
      expect(screen.getByText('Toyota RAV4')).toBeInTheDocument();
    });

    const buttons = screen.getAllByText('Calculate Timeline');
    fireEvent.click(buttons[0]);
    expect(onSelectModel).toHaveBeenCalledWith('rav4');
  });
});
