import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WaitTimeEstimator } from '@/components/calculator/wait-time-estimator';

describe('WaitTimeEstimator Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the calculator and displays aggregate metrics upon fetch', async () => {
    const mockData = {
      success: true,
      data: {
        modelSlug: 'rav4',
        modelName: 'RAV4',
        powertrainSlug: 'phev',
        powertrainName: 'Prime / Plug-in Hybrid (PHEV)',
        province: 'BC',
        sampleCounts: { total: 142, delivered: 118, pending: 24 },
        waitStats: {
          p25: 310,
          median: 412,
          p75: 540,
          mean: 425.4,
          min: 180,
          max: 730,
        },
        pricingInsights: {
          atMsrpPercent: 85,
          aboveMsrpPercent: 15,
          avgAddonsCad: 350,
        },
        confidenceRating: 'high',
      },
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as any);
    window.fetch = fetchMock;
    global.fetch = fetchMock;

    render(<WaitTimeEstimator />);

    expect(screen.getByText('Interactive Delivery Wait-Time Estimator')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByText(/412 Days/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/310 Days/i)).toBeInTheDocument();
      expect(screen.getByText(/540 Days/i)).toBeInTheDocument();
      expect(screen.getByText(/85%/i)).toBeInTheDocument();
    });
  });

  it('re-fetches when Province is changed', async () => {
    const mockData = {
      success: true,
      data: {
        modelSlug: 'rav4',
        modelName: 'RAV4',
        powertrainSlug: 'phev',
        province: 'ON',
        sampleCounts: { total: 80, delivered: 65, pending: 15 },
        waitStats: {
          p25: 250,
          median: 330,
          p75: 420,
          mean: 340,
          min: 150,
          max: 600,
        },
        pricingInsights: { atMsrpPercent: 90, aboveMsrpPercent: 10, avgAddonsCad: 200 },
      },
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as any);
    window.fetch = fetchMock;
    global.fetch = fetchMock;

    render(<WaitTimeEstimator />);

    const provinceSelect = screen.getByLabelText(/Province/i);
    fireEvent.change(provinceSelect, { target: { value: 'ON' } });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('province=ON'));
      expect(screen.getAllByText(/330 Days/i).length).toBeGreaterThanOrEqual(1);
    });
  });
});
