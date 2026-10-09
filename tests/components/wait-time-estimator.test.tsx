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

  it('renders the Trim Level select dropdown with All Trims as default', async () => {
    const mockData = {
      success: true,
      data: {
        modelSlug: 'rav4',
        modelName: 'RAV4',
        powertrainSlug: 'phev',
        province: 'BC',
        sampleCounts: { total: 10, delivered: 8, pending: 2 },
        waitStats: { p25: 300, median: 400, p75: 500, mean: 400, min: 200, max: 600 },
        pricingInsights: { atMsrpPercent: 85, aboveMsrpPercent: 15, avgAddonsCad: 350 },
      },
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as any);
    window.fetch = fetchMock;
    global.fetch = fetchMock;

    render(<WaitTimeEstimator />);

    const trimSelect = screen.getByLabelText(/Trim Level/i);
    expect(trimSelect).toBeInTheDocument();
    expect(trimSelect).toHaveValue('all');
    expect(screen.getByRole('option', { name: 'All Trims' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'SE AWD' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'XSE AWD' })).toBeInTheDocument();
  });

  it('displays explanatory fallback note when trim has fewer than 3 submissions', async () => {
    const mockFallbackData = {
      success: true,
      data: {
        modelSlug: 'rav4',
        modelName: 'RAV4',
        powertrainSlug: 'phev',
        powertrainName: 'Plug-in Hybrid (PHEV)',
        trimSlug: 'gr-sport-awd',
        province: 'BC',
        sampleCounts: { total: 12, delivered: 9, pending: 3 },
        waitStats: { p25: 320, median: 410, p75: 480, mean: 410, min: 300, max: 500 },
        pricingInsights: { atMsrpPercent: 85, aboveMsrpPercent: 15, avgAddonsCad: 350 },
        isTrimFallback: true,
        trimNote: 'Displaying overall Plug-in Hybrid (PHEV) baseline due to limited trim-specific data.',
      },
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockFallbackData,
    } as any);
    window.fetch = fetchMock;
    global.fetch = fetchMock;

    render(<WaitTimeEstimator />);

    const trimSelect = screen.getByLabelText(/Trim Level/i);
    fireEvent.change(trimSelect, { target: { value: 'gr-sport-awd' } });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('trim=gr-sport-awd'));
      expect(screen.getByTestId('trim-fallback-note')).toBeInTheDocument();
      expect(
        screen.getByText(/Displaying overall Plug-in Hybrid \(PHEV\) baseline due to limited trim-specific data\./i)
      ).toBeInTheDocument();
    });
  });

  it('displays trim-specific data without fallback note when at least 3 submissions exist', async () => {
    const mockTrimData = {
      success: true,
      data: {
        modelSlug: 'rav4',
        modelName: 'RAV4',
        powertrainSlug: 'phev',
        powertrainName: 'Plug-in Hybrid (PHEV)',
        trimSlug: 'se-awd',
        province: 'BC',
        sampleCounts: { total: 7, delivered: 5, pending: 2 },
        waitStats: { p25: 230, median: 250, p75: 275, mean: 251, min: 210, max: 290 },
        pricingInsights: { atMsrpPercent: 90, aboveMsrpPercent: 10, avgAddonsCad: 200 },
        isTrimFallback: false,
        trimNote: null,
      },
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockTrimData,
    } as any);
    window.fetch = fetchMock;
    global.fetch = fetchMock;

    render(<WaitTimeEstimator />);

    const trimSelect = screen.getByLabelText(/Trim Level/i);
    fireEvent.change(trimSelect, { target: { value: 'se-awd' } });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('trim=se-awd'));
      expect(screen.queryByTestId('trim-fallback-note')).not.toBeInTheDocument();
      expect(screen.getAllByText(/250 Days/i).length).toBeGreaterThanOrEqual(1);
    });
  });
});
