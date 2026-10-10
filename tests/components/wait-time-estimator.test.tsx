import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WaitTimeEstimator } from '@/components/calculator/wait-time-estimator';
import * as navigation from 'next/navigation';

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
          p25: 290,
          median: 330,
          p75: 360,
          mean: 330.4,
          min: 180,
          max: 410,
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
      expect(screen.getAllByText(/330 Days/i).length).toBeGreaterThanOrEqual(1);
    });

    expect(screen.getByText(/290 Days/i)).toBeInTheDocument();
    expect(screen.getByText(/360 Days/i)).toBeInTheDocument();
    expect(screen.getByText(/85%/i)).toBeInTheDocument();
    expect(screen.getByText(/Powertrain Wait-Time Comparison/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Gasoline \(Gas\)/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Hybrid \(HEV\)/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Plug-in Hybrid \(PHEV\)/i).length).toBeGreaterThanOrEqual(1);
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

  it('updates trims dynamically when Prius or Prius Prime is selected', async () => {
    const mockData = {
      success: true,
      data: {
        modelSlug: 'prius-prime',
        modelName: 'Prius Prime',
        powertrainSlug: 'phev',
        province: 'ON',
        sampleCounts: { total: 5, delivered: 4, pending: 1 },
        waitStats: { p25: 140, median: 181, p75: 220, mean: 180, min: 35, max: 341 },
        pricingInsights: { atMsrpPercent: 100, aboveMsrpPercent: 0, avgAddonsCad: 0 },
      },
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as any);
    window.fetch = fetchMock;
    global.fetch = fetchMock;

    render(<WaitTimeEstimator />);

    // Select Prius
    const modelSelect = screen.getByLabelText(/Vehicle Model/i);
    fireEvent.change(modelSelect, { target: { value: 'prius' } });

    // In HEV mode, should show LE AWD, XLE AWD, Limited AWD
    const trimSelect = screen.getByLabelText(/Trim Level/i);
    expect(screen.getByRole('option', { name: 'LE AWD' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'XLE AWD' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Limited AWD' })).toBeInTheDocument();

    // Select Prius Prime
    fireEvent.change(modelSelect, { target: { value: 'prius-prime' } });
    expect(screen.getByRole('option', { name: 'SE' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'XSE' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'XSE Premium' })).toBeInTheDocument();
  });

  it('grounds prediction strictly in overall model median and displays limited regional data indicator when sample size is < 5', async () => {
    const mockSmallSampleData = {
      success: true,
      data: {
        modelSlug: 'rav4',
        modelName: 'RAV4',
        powertrainSlug: 'phev',
        powertrainName: 'Plug-in Hybrid (PHEV)',
        trimSlug: 'all',
        province: 'PE',
        sampleCounts: { total: 3, delivered: 2, pending: 1 },
        waitStats: { p25: 120, median: 150, p75: 190, mean: 153, min: 100, max: 200 },
        pricingInsights: { atMsrpPercent: 100, aboveMsrpPercent: 0, avgAddonsCad: 0 },
      },
    };

    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (typeof url === 'string' && url.includes('/api/stats')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, data: {} }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => mockSmallSampleData,
      });
    });
    window.fetch = fetchMock as any;
    global.fetch = fetchMock as any;

    render(<WaitTimeEstimator />);

    await waitFor(() => {
      expect(
        screen.getByText('Based on overall model median (limited regional data)')
      ).toBeInTheDocument();
      // Grounded in RAV4 baseline median (375 Days) instead of regional 150 Days
      expect(screen.getAllByText(/375 Days/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  it('clamps predictions to not exceed empirical maximum delivered wait time', async () => {
    const mockExcessiveData = {
      success: true,
      data: {
        modelSlug: 'rav4',
        modelName: 'RAV4',
        powertrainSlug: 'phev',
        powertrainName: 'Plug-in Hybrid (PHEV)',
        province: 'BC',
        sampleCounts: { total: 10, delivered: 8, pending: 2 },
        // Outlandish wait stats exceeding empirical max 410
        waitStats: { p25: 480, median: 580, p75: 650, mean: 570, min: 400, max: 410 },
        pricingInsights: { atMsrpPercent: 80, aboveMsrpPercent: 20, avgAddonsCad: 500 },
      },
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockExcessiveData,
    } as any);
    window.fetch = fetchMock;
    global.fetch = fetchMock;

    render(<WaitTimeEstimator />);

    await waitFor(() => {
      // Clamped to conservative upper bound (410 Days)
      expect(screen.getAllByText(/410 Days/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  it('displays contextual mod guide banner for selected vehicle model', async () => {
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

    await waitFor(() => {
      const rav4Link = screen.getByRole('link', { name: /RAV4 Prime & Hybrid Essential Mods/i });
      expect(rav4Link).toHaveAttribute('href', '/guides/rav4-se-mods');
    });

    // Select Prius
    const modelSelect = screen.getByLabelText(/Vehicle Model/i);
    fireEvent.change(modelSelect, { target: { value: 'prius' } });

    await waitFor(() => {
      const priusLink = screen.getByRole('link', { name: /2023-2026 Prius & Prius Prime Essential Mods/i });
      expect(priusLink).toHaveAttribute('href', '/guides/prius-mods');
    });
  });

  it('calculates a realistic 2027 estimate (under 420 days, never 2028) for RAV4 Prime XSE Tech in BC', async () => {
    const mockRav4PrimeBcData = {
      success: true,
      data: {
        modelSlug: 'rav4',
        modelName: 'RAV4',
        powertrainSlug: 'phev',
        powertrainName: 'Plug-in Hybrid (PHEV)',
        trimSlug: 'xse-technology-awd',
        province: 'BC',
        sampleCounts: { total: 15, delivered: 12, pending: 3 },
        waitStats: { p25: 315, median: 335, p75: 360, mean: 340, min: 290, max: 395 },
        pricingInsights: { atMsrpPercent: 90, aboveMsrpPercent: 10, avgAddonsCad: 0 },
      },
    };

    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (typeof url === 'string' && url.includes('/api/stats')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, data: {} }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => mockRav4PrimeBcData,
      });
    });
    window.fetch = fetchMock as any;
    global.fetch = fetchMock as any;

    render(
      <WaitTimeEstimator
        initialModel="rav4"
        initialPowertrain="phev"
        initialTrim="xse-technology-awd"
        initialProvince="BC"
      />
    );

    await waitFor(() => {
      // Must display median 335 Days (well under 420 days)
      expect(screen.getAllByText(/335 Days/i).length).toBeGreaterThanOrEqual(1);
      // P25 and P75 bounds under 420 days
      expect(screen.getByText(/315 Days/i)).toBeInTheDocument();
      expect(screen.getByText(/360 Days/i)).toBeInTheDocument();
      // Arrival date must be in 2027 and never 2028
      expect(screen.getAllByText(/2027/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.queryByText(/2028/i)).not.toBeInTheDocument();
    });
  });

  it('displays post-submission confirmation banner when submitted=true search param is present', async () => {
    vi.spyOn(navigation, 'useSearchParams').mockReturnValue(
      new URLSearchParams('submitted=true&model=rav4&province=ON') as any
    );

    const mockData = {
      success: true,
      data: {
        modelSlug: 'rav4',
        modelName: 'RAV4',
        powertrainSlug: 'hev',
        powertrainName: 'Hybrid (HEV)',
        province: 'ON',
        sampleCounts: { total: 40, delivered: 35, pending: 5 },
        waitStats: {
          p25: 140,
          median: 185,
          p75: 235,
          mean: 188.5,
          min: 110,
          max: 260,
        },
        pricingInsights: {
          atMsrpPercent: 90,
          aboveMsrpPercent: 10,
          avgAddonsCad: 200,
        },
        confidenceRating: 'high',
      },
    };

    window.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as any);

    render(<WaitTimeEstimator />);

    // Confirmation banner should be displayed
    expect(screen.getByTestId('submitted-confirmation-banner')).toBeInTheDocument();
    expect(
      screen.getByText('Submission received! Here are the updated wait-time estimates.')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Thanks for contributing to the community! If ToyotaWaits helps you navigate your wait, consider/i)
    ).toBeInTheDocument();

    // Clicking dismiss should remove the banner
    const dismissBtn = screen.getByRole('button', { name: /Dismiss banner/i });
    fireEvent.click(dismissBtn);
    expect(screen.queryByTestId('submitted-confirmation-banner')).not.toBeInTheDocument();
  });

  it('renders subtle high-contrast mod link under delivery estimate card and updates dynamically on model change', async () => {
    const mockData = {
      success: true,
      data: {
        modelSlug: 'rav4',
        modelName: 'RAV4',
        powertrainSlug: 'phev',
        province: 'BC',
        sampleCounts: { total: 40, delivered: 35, pending: 5 },
        waitStats: { p25: 280, median: 320, p75: 350, mean: 322, min: 190, max: 400 },
        pricingInsights: { atMsrpPercent: 88, aboveMsrpPercent: 12, avgAddonsCad: 250 },
      },
    };

    window.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as any);

    render(<WaitTimeEstimator initialModel="rav4" />);

    // Check link under primary estimate cards for default rav4
    await waitFor(() => {
      const modLink = screen.getByTestId('delivery-estimate-mods-link');
      expect(modLink).toBeInTheDocument();
      expect(modLink).toHaveTextContent(/Planning your build\? Browse popular community accessories & mods/i);
      expect(modLink).toHaveAttribute('href', '/mods/rav4');
      expect(modLink.className).toContain('text-xs');
      expect(modLink.className).toContain('text-slate-500');
    });

    // Change model to Sienna
    const modelSelect = screen.getByLabelText(/Vehicle Model/i);
    fireEvent.change(modelSelect, { target: { value: 'sienna' } });

    await waitFor(() => {
      const modLink = screen.getByTestId('delivery-estimate-mods-link');
      expect(modLink).toHaveAttribute('href', '/mods/sienna');
    });
  });
});
