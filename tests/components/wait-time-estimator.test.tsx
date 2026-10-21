import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WaitTimeEstimator } from '@/components/calculator/wait-time-estimator';
import { StickyVehiclePills } from '@/components/calculator/sticky-vehicle-pills';
import * as navigation from 'next/navigation';
import * as calendarUtils from '@/lib/utils/calendar';
import { MarketProvider } from '@/context/MarketContext';

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

    expect(screen.getByText('Vehicle Model')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByText(/330 Days/i).length).toBeGreaterThanOrEqual(1);
    });

    expect(screen.getByText(/290 Days/i)).toBeInTheDocument();
    expect(screen.getAllByText(/360 Days/i).length).toBeGreaterThanOrEqual(1);
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

    render(<WaitTimeEstimator initialProvince="PE" />);

    await waitFor(() => {
      expect(
        screen.getByText(/National baseline: Based on 14 deliveries across all RAV4 powertrains \(Hybrid & PHEV\)\./i)
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('regional-baseline-badge')
      ).toBeInTheDocument();
      expect(
        screen.getByText(/National baseline · Limited regional data for PE/i)
      ).toBeInTheDocument();
      // Grounded in RAV4 baseline median (375 Days) instead of regional 150 Days
      expect(screen.getAllByText(/375 Days/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  it('displays inline explanatory carryover note when wait time exceeds 12 months', async () => {
    const mockSiennaData = {
      success: true,
      data: {
        modelSlug: 'sienna',
        modelName: 'Sienna',
        powertrainSlug: 'hev',
        powertrainName: 'Hybrid (HEV)',
        province: 'ON',
        sampleCounts: { total: 30, delivered: 25, pending: 5 },
        // Conservative wait time exceeds 14 months (e.g. 450-560 days)
        waitStats: { p25: 400, median: 480, p75: 560, mean: 490, min: 380, max: 620 },
        pricingInsights: { atMsrpPercent: 85, aboveMsrpPercent: 15, avgAddonsCad: 0 },
      },
    };

    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (typeof url === 'string' && url.includes('/api/stats')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            success: true,
            data: {
              sienna: {
                model: 'sienna',
                sample_size: 7,
                min_days: 400,
                p25_days: 440,
                median_days: 510,
                p75_days: 560,
                max_days: 620,
                mean_days: 505.7,
              },
            },
          }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => mockSiennaData,
      });
    });
    window.fetch = fetchMock as any;
    global.fetch = fetchMock as any;

    render(<WaitTimeEstimator initialModel="sienna" initialPowertrain="hev" initialProvince="ON" />);

    await waitFor(() => {
      // Conservative P75 displays true value (560 Days) without 420-day clamping
      expect(screen.getAllByText(/560 Days/i).length).toBeGreaterThanOrEqual(1);
      // Multiplier breakdown shows base P75 scaling to adjusted wait
      expect(screen.getByTestId('multiplier-breakdown-note')).toBeInTheDocument();
      expect(
        screen.getByText(/Base P75: 450 days · Adjusted to ~560 days based on Ontario regional allocation and AWD demand factors\./i)
      ).toBeInTheDocument();
      // Explanatory carryover allocation notice is rendered
      expect(screen.getByTestId('carryover-allocation-notice')).toBeInTheDocument();
      expect(
        screen.getByText(/Orders over 14 months typically carry over into subsequent model-year allocation queues\./i)
      ).toBeInTheDocument();
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

  it('updates mod link dynamically for selected vehicle model', async () => {
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
      const modsLink = screen.getByTestId('delivery-estimate-mods-link');
      expect(modsLink).toHaveAttribute('href', '/mods/rav4');
    });

    // Select Prius
    const modelSelect = screen.getByLabelText(/Vehicle Model/i);
    fireEvent.change(modelSelect, { target: { value: 'prius' } });

    await waitFor(() => {
      const modsLink = screen.getByTestId('delivery-estimate-mods-link');
      expect(modsLink).toHaveAttribute('href', '/mods/prius');
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
      expect(screen.getAllByText(/360 Days/i).length).toBeGreaterThanOrEqual(1);
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

  it('renders prominent output badge displaying crowdsourced wait range and has scroll-mt-20', async () => {
    const mockData = {
      success: true,
      data: {
        modelSlug: 'rav4',
        modelName: 'RAV4',
        powertrainSlug: 'phev',
        province: 'BC',
        sampleCounts: { total: 40, delivered: 35, pending: 5 },
        waitStats: { p25: 120, median: 180, p75: 240, mean: 180, min: 90, max: 300 },
        pricingInsights: { atMsrpPercent: 88, aboveMsrpPercent: 12, avgAddonsCad: 250 },
      },
    };

    window.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as any);

    const { container } = render(<WaitTimeEstimator />);

    // Output badge
    const badge = await screen.findByTestId('estimator-range-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent(/Estimated Wait: \d+ – \d+ Months/i);

    // Card mt-4 scroll-mt-28
    const card = container.querySelector('#estimator');
    expect(card).toBeInTheDocument();
    expect(card?.className).toContain('scroll-mt-28');
    expect(card?.className).toContain('mt-4');
  });

  it('renders quick-select vehicle pills and supports bi-directional sync with the model dropdown', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          modelSlug: 'rav4',
          modelName: 'RAV4',
          powertrainSlug: 'phev',
          province: 'BC',
          sampleCounts: { total: 40, delivered: 35, pending: 5 },
          waitStats: { p25: 120, median: 180, p75: 240, mean: 180, min: 90, max: 300 },
          pricingInsights: { atMsrpPercent: 88, aboveMsrpPercent: 12, avgAddonsCad: 250 },
        },
      }),
    } as any);

    window.fetch = fetchMock;
    global.fetch = fetchMock;

    render(
      <>
        <StickyVehiclePills initialModel="rav4" />
        <WaitTimeEstimator initialModel="rav4" />
      </>
    );

    // Verify all 6 pills are rendered
    const rav4Pill = screen.getByRole('tab', { name: 'RAV4' });
    const siennaPill = screen.getByRole('tab', { name: 'Sienna' });
    const ghPill = screen.getByRole('tab', { name: 'Grand Highlander' });
    const priusPill = screen.getByRole('tab', { name: 'Prius / Prime' });
    const lcPill = screen.getByRole('tab', { name: 'Land Cruiser 250' });
    const tacomaPill = screen.getByRole('tab', { name: 'Tacoma' });

    expect(rav4Pill).toBeInTheDocument();
    expect(siennaPill).toBeInTheDocument();
    expect(ghPill).toBeInTheDocument();
    expect(priusPill).toBeInTheDocument();
    expect(lcPill).toBeInTheDocument();
    expect(tacomaPill).toBeInTheDocument();

    // Default RAV4 pill is active
    expect(rav4Pill).toHaveAttribute('aria-selected', 'true');
    expect(rav4Pill.className).toContain('bg-amber-500');
    expect(siennaPill).toHaveAttribute('aria-selected', 'false');

    // 1. Tapping 'Sienna' pill updates dropdown and triggers fetch
    fireEvent.click(siennaPill);

    const modelSelect = screen.getByLabelText(/Vehicle Model/i) as HTMLSelectElement;
    expect(modelSelect.value).toBe('sienna');
    expect(siennaPill).toHaveAttribute('aria-selected', 'true');
    expect(siennaPill.className).toContain('bg-amber-500');
    expect(rav4Pill).toHaveAttribute('aria-selected', 'false');

    // 2. Changing dropdown to Tacoma updates pill highlight
    fireEvent.change(modelSelect, { target: { value: 'tacoma' } });
    expect(tacomaPill).toHaveAttribute('aria-selected', 'true');
    expect(tacomaPill.className).toContain('bg-amber-500');
    expect(siennaPill).toHaveAttribute('aria-selected', 'false');

    // 3. Changing dropdown to Prius Prime highlights Prius / Prime pill
    fireEvent.change(modelSelect, { target: { value: 'prius-prime' } });
    expect(priusPill).toHaveAttribute('aria-selected', 'true');
    expect(priusPill.className).toContain('bg-amber-500');
    expect(tacomaPill).toHaveAttribute('aria-selected', 'false');
  });

  it('restricts powertrain to Hybrid (HEV), disables dropdown, and shows single-powertrain notice for Sienna', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          modelSlug: 'sienna',
          modelName: 'Sienna',
          powertrainSlug: 'hev',
          province: 'BC',
          sampleCounts: { total: 40, delivered: 35, pending: 5 },
          waitStats: { p25: 300, median: 400, p75: 500, mean: 400, min: 200, max: 600 },
          pricingInsights: { atMsrpPercent: 80, aboveMsrpPercent: 20, avgAddonsCad: 500 },
        },
      }),
    } as any);

    window.fetch = fetchMock;
    global.fetch = fetchMock;

    render(<WaitTimeEstimator initialModel="sienna" />);

    // 1. Powertrain select should be disabled and only have Hybrid (HEV)
    const powertrainSelect = screen.getByLabelText(/Powertrain/i) as HTMLSelectElement;
    expect(powertrainSelect).toBeDisabled();
    expect(powertrainSelect.value).toBe('hev');
    expect(screen.queryByRole('option', { name: 'Gasoline' })).toBeNull();
    expect(screen.queryByRole('option', { name: 'Plug-in Hybrid (PHEV)' })).toBeNull();

    // 2. Wait for async load to finish and check single-powertrain notice and comparison
    await waitFor(() => {
      const notice = screen.getByTestId('single-powertrain-notice');
      expect(notice).toBeInTheDocument();
      expect(notice).toHaveTextContent(/Toyota Sienna is exclusively available with a Hybrid \(HEV\) powertrain in Canada/i);
      expect(screen.queryByText('Fastest Allocation')).toBeNull();
    });

    // 3. Verifies redundant middle-page crowdsource banner and standalone cards are removed
    expect(screen.queryByTestId('estimator-submit-wait-time-banner')).toBeNull();
    expect(screen.queryByText(/Toyota Sienna Road-Trip & Family Mods Guide/i)).toBeNull();
    expect(screen.queryByRole('link', { name: /View Delivery Day Prep & Essential Gear for Sienna/i })).toBeNull();

    // 4. Renders all 3 CTA action buttons in responsive grid
    expect(screen.getByRole('button', { name: /Calendar \(\.ics\)/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Share to Reddit/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Notify Me/i }).length).toBeGreaterThanOrEqual(1);
  });

  it('reactively recalculates delivery date windows and updates calendar export when deposit date changes', async () => {
    const mockData = {
      success: true,
      data: {
        modelSlug: 'rav4',
        modelName: 'RAV4',
        powertrainSlug: 'phev',
        powertrainName: 'Plug-in Hybrid (PHEV)',
        province: 'BC',
        sampleCounts: { total: 100, delivered: 80, pending: 20 },
        waitStats: {
          p25: 100,
          median: 200,
          p75: 300,
          mean: 200,
          min: 50,
          max: 410,
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

    await waitFor(() => {
      expect(screen.getAllByText(/200 Days/i).length).toBeGreaterThanOrEqual(1);
    });

    const dateInput = screen.getByLabelText(/Deposit \/ Order Date/i) as HTMLInputElement;
    expect(dateInput).toBeInTheDocument();

    // Change deposit date to 2025-01-01
    fireEvent.change(dateInput, { target: { value: '2025-01-01' } });
    expect(dateInput.value).toBe('2025-01-01');

    // 1. Order date label immediately reflects updated order date
    expect(screen.getByText(/orders placed on Jan 1, 2025/i)).toBeInTheDocument();

    // 2. Percentile dates recalculate reactively based on 2025-01-01
    // P25: 2025-01-01 + 100 days (~Apr 2025)
    // P75: 2025-01-01 + 300 days (~Oct 2025)
    expect(screen.getByText(/Apr 2025 – Oct 2025/i)).toBeInTheDocument();

    // 3. Calendar export includes the updated order date
    const downloadSpy = vi.spyOn(calendarUtils, 'downloadCalendarEvent').mockImplementation(() => {});
    const calendarBtn = screen.getByRole('button', { name: /Calendar \(\.ics\)/i });
    fireEvent.click(calendarBtn);

    expect(downloadSpy).toHaveBeenCalledTimes(1);
    expect(downloadSpy.mock.calls[0][0]).toContain('Order date: 2025-01-01');
    downloadSpy.mockRestore();
  });

  it('displays historical pricing disclaimers when deposit date is earlier than 2026', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          modelSlug: 'rav4',
          modelName: 'RAV4',
          powertrainSlug: 'hev',
          province: 'ON',
          sampleCounts: { total: 30, delivered: 25, pending: 5 },
          waitStats: { p25: 100, median: 200, p75: 300, mean: 200, min: 50, max: 400 },
          pricingInsights: { atMsrpPercent: 80, aboveMsrpPercent: 20, avgAddonsCad: 300 },
        },
      }),
    } as any);

    window.fetch = fetchMock;
    global.fetch = fetchMock;

    render(<WaitTimeEstimator />);

    const dateInput = screen.getByLabelText(/Deposit \/ Order Date/i) as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: '2024-06-15' } });

    await waitFor(() => {
      expect(
        screen.getAllByText(/Historical pricing varies by model year \(current 2026 MSRP shown for reference\)\./i).length
      ).toBeGreaterThanOrEqual(1);
    });
  });

  it('displays historical dealer benchmark badge when Tacoma is selected', async () => {
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (typeof url === 'string' && url.includes('/api/stats')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, data: {} }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            modelSlug: 'tacoma',
            modelName: 'Tacoma',
            powertrainSlug: 'gas',
            province: 'BC',
            sampleCounts: { total: 10, delivered: 10, pending: 0 },
            waitStats: { p25: 120, median: 150, p75: 180, mean: 150, min: 90, max: 210 },
            pricingInsights: { atMsrpPercent: 100, aboveMsrpPercent: 0, avgAddonsCad: 0 },
          },
        }),
      });
    });
    window.fetch = fetchMock as any;
    global.fetch = fetchMock as any;

    render(<WaitTimeEstimator initialModel="tacoma" initialPowertrain="gas" initialProvince="BC" />);

    await waitFor(() => {
      expect(screen.getByTestId('tacoma-benchmark-badge')).toBeInTheDocument();
      expect(
        screen.getByText(/10 Historical Dealer Benchmarks \(Community submissions opening soon\)\./i)
      ).toBeInTheDocument();
    });
  });

  it('renders Corolla variant toggle and switches between Corolla Sedan/Hatch and Corolla Cross', async () => {
    const fetchMock = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            modelSlug: 'corolla',
            modelName: 'Corolla',
            powertrainSlug: 'gas',
            province: 'BC',
            sampleCounts: { total: 5, delivered: 5, pending: 0 },
            waitStats: { p25: 30, median: 60, p75: 90, mean: 60, min: 25, max: 110 },
            pricingInsights: { atMsrpPercent: 100, aboveMsrpPercent: 0, avgAddonsCad: 0 },
          },
        }),
      })
    );
    window.fetch = fetchMock as any;
    global.fetch = fetchMock as any;

    render(<WaitTimeEstimator initialModel="corolla" initialPowertrain="gas" initialProvince="BC" />);

    await waitFor(() => {
      expect(screen.getByTestId('estimator-corolla-toggle')).toBeInTheDocument();
    });

    const sedanTab = screen.getByTestId('estimator-corolla-sedan-tab');
    const crossTab = screen.getByTestId('estimator-corolla-cross-tab');
    expect(sedanTab).toHaveAttribute('aria-selected', 'true');
    expect(crossTab).toHaveAttribute('aria-selected', 'false');

    // Toggle to Corolla Cross
    fireEvent.click(crossTab);
    expect(crossTab).toHaveAttribute('aria-selected', 'true');
    expect(sedanTab).toHaveAttribute('aria-selected', 'false');
  });

  it('renders prominent "Skip the wait?" inventory callout when matching dealer stock exists', async () => {
    const fetchMock = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            modelSlug: 'rav4',
            modelName: 'RAV4',
            powertrainSlug: 'phev',
            powertrainName: 'Plug-in Hybrid (PHEV)',
            province: 'BC',
            sampleCounts: { total: 10, delivered: 8, pending: 2 },
            waitStats: { p25: 200, median: 250, p75: 300, mean: 250, min: 150, max: 350 },
          },
          countsByModel: {
            'RAV4 Plug-in Hybrid': 3,
            'Sienna': 5,
          },
        }),
      })
    );
    window.fetch = fetchMock as any;
    global.fetch = fetchMock as any;

    render(<WaitTimeEstimator initialModel="rav4" initialPowertrain="phev" initialProvince="BC" />);

    await waitFor(() => {
      expect(screen.getByTestId('estimator-inventory-callout')).toBeInTheDocument();
    });

    expect(screen.getByText(/Skip the wait\?/i)).toBeInTheDocument();
    expect(screen.getByText(/We observed 3 matching units in recent dealer feeds\./i)).toBeInTheDocument();

    const stockBtn = screen.getByTestId('estimator-view-stock-btn');
    expect(stockBtn).toHaveTextContent(/View Live Stock ↗/i);
    expect(stockBtn).toHaveAttribute('href', '/inventory?model=RAV4%20Plug-in%20Hybrid');
  });

  it('renders subtle "Browse all observed dealer inventory" link when model inventory count is zero', async () => {
    const fetchMock = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            modelSlug: 'sequoia',
            modelName: 'Sequoia',
            powertrainSlug: 'hev',
            province: 'BC',
            sampleCounts: { total: 4, delivered: 4, pending: 0 },
            waitStats: { p25: 120, median: 150, p75: 200, mean: 155, min: 90, max: 240 },
          },
          countsByModel: {
            'RAV4 Plug-in Hybrid': 2,
          },
        }),
      })
    );
    window.fetch = fetchMock as any;
    global.fetch = fetchMock as any;

    render(<WaitTimeEstimator initialModel="sequoia" initialPowertrain="hev" initialProvince="BC" />);

    await waitFor(() => {
      expect(screen.getByTestId('estimator-inventory-zero-callout')).toBeInTheDocument();
    });

    const link = screen.getByTestId('estimator-browse-all-inventory-link');
    expect(link).toHaveTextContent(/Browse all observed dealer inventory ↗/i);
    expect(link).toHaveAttribute('href', '/inventory');
  });

  it('does NOT render live stock callout when user is viewing US wait times', async () => {
    const fetchMock = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            modelSlug: 'rav4',
            modelName: 'RAV4',
            powertrainSlug: 'phev',
            province: 'WA',
            sampleCounts: { total: 10, delivered: 10, pending: 0 },
            waitStats: { p25: 120, median: 150, p75: 200, mean: 155, min: 90, max: 240 },
          },
          countsByModel: {
            'RAV4 Plug-in Hybrid': 3,
          },
        }),
      })
    );
    window.fetch = fetchMock as any;
    global.fetch = fetchMock as any;

    render(
      <MarketProvider initialMarket="US">
        <WaitTimeEstimator initialModel="rav4" initialPowertrain="phev" initialProvince="WA" />
      </MarketProvider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('estimator-inventory-callout')).not.toBeInTheDocument();
      expect(screen.queryByTestId('estimator-inventory-zero-callout')).not.toBeInTheDocument();
    });
  });
});

