import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Header } from '@/components/layout/header';
import { WaitTimeEstimator } from '@/components/calculator/wait-time-estimator';
import { SubmissionForm } from '@/components/forms/submission-form';
import { CommunityDataTable } from '@/components/dashboard/community-data-table';
import { MarketProvider } from '@/context/MarketContext';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

describe('Market Switcher & Dynamic Region Filtering', () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = 'toyotawaits_market=; path=/; max-age=0';
    vi.restoreAllMocks();
  });

  it('renders Header pill toggle with 🇨🇦 CA and 🇺🇸 US and toggles market', () => {
    render(
      <MarketProvider>
        <Header />
      </MarketProvider>
    );

    const toggleCa = screen.getByTestId('market-toggle-ca');
    const toggleUs = screen.getByTestId('market-toggle-us');

    expect(toggleCa).toBeInTheDocument();
    expect(toggleUs).toBeInTheDocument();

    // Default CA active state (amber highlight)
    expect(toggleCa).toHaveClass('bg-amber-500');
    expect(toggleUs).not.toHaveClass('bg-amber-500');

    // Click US toggle
    fireEvent.click(toggleUs);

    expect(toggleUs).toHaveClass('bg-amber-500');
    expect(toggleCa).not.toHaveClass('bg-amber-500');

    // Brand logo should reflect .com and USA badge
    expect(screen.getByText('.com')).toBeInTheDocument();
    expect(screen.getByText(/🇺🇸 USA/i)).toBeInTheDocument();

    // Click CA toggle
    fireEvent.click(toggleCa);

    expect(toggleCa).toHaveClass('bg-amber-500');
    expect(toggleUs).not.toHaveClass('bg-amber-500');
    expect(screen.getByText('.ca')).toBeInTheDocument();
    expect(screen.getByText(/🇨🇦 Canada/i)).toBeInTheDocument();
  });

  it('dynamically switches WaitTimeEstimator region label, options, and resets region safely', async () => {
    // Test body
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {},
      }),
    } as any);
    global.fetch = fetchMock;

    function IntegrationApp() {
      return (
        <MarketProvider>
          <Header />
          <WaitTimeEstimator initialProvince="BC" />
        </MarketProvider>
      );
    }

    render(<IntegrationApp />);

    // Initially CA market: Label is Province / Territory, value is BC
    expect(screen.getByLabelText(/Province \/ Territory/i)).toBeInTheDocument();
    const select = screen.getByLabelText(/Province \/ Territory/i) as HTMLSelectElement;
    expect(select.value).toBe('BC');

    // Options should contain Canadian provinces
    expect(screen.getByRole('option', { name: /British Columbia \(BC\)/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Ontario \(ON\)/i })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /Washington \(WA\)/i })).not.toBeInTheDocument();

    // Switch to US via header
    const toggleUs = screen.getByTestId('market-toggle-us');
    fireEvent.click(toggleUs);

    // Label should switch to State / Region
    await waitFor(() => {
      expect(screen.getByLabelText(/State \/ Region/i)).toBeInTheDocument();
    });

    const usSelect = screen.getByLabelText(/State \/ Region/i) as HTMLSelectElement;
    // BC is not a valid US state, so it should safely reset to US default (CA)
    expect(usSelect.value).toBe('CA');

    // Options should contain US states
    expect(screen.getByRole('option', { name: /California \(CA\)/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Washington \(WA\)/i })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /British Columbia \(BC\)/i })).not.toBeInTheDocument();

    // Switch state to WA
    fireEvent.change(usSelect, { target: { value: 'WA' } });
    expect(usSelect.value).toBe('WA');

    // Switch back to CA market
    const toggleCa = screen.getByTestId('market-toggle-ca');
    fireEvent.click(toggleCa);

    await waitFor(() => {
      expect(screen.getByLabelText(/Province \/ Territory/i)).toBeInTheDocument();
    });

    const caSelect = screen.getByLabelText(/Province \/ Territory/i) as HTMLSelectElement;
    // WA is not a valid CA province, so it should safely reset to CA default (BC)
    expect(caSelect.value).toBe('BC');
  }, 15000);

  it('dynamically switches SubmissionForm region label, options, and sends correct countryCode', async () => {
    let capturedPayload: any = null;
    global.fetch = vi.fn().mockImplementation((url, opts) => {
      if (opts?.body) {
        capturedPayload = JSON.parse(opts.body as string);
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({
          success: true,
          data: { id: 'test-123', status: 'pending', editKey: 'key-123' },
        }),
      });
    });

    function SubmissionApp() {
      return (
        <MarketProvider>
          <Header />
          <SubmissionForm />
        </MarketProvider>
      );
    }

    render(<SubmissionApp />);

    // Initially in CA market
    expect(screen.getByLabelText(/Province \/ Territory/i)).toBeInTheDocument();
    const caSelect = screen.getByLabelText(/Province \/ Territory/i) as HTMLSelectElement;
    expect(caSelect.value).toBe('ON');

    // Switch to US via header
    const toggleUs = screen.getByTestId('market-toggle-us');
    fireEvent.click(toggleUs);

    // Label should switch to State / Region
    let usSelect!: HTMLSelectElement;
    await waitFor(() => {
      usSelect = screen.getByLabelText(/State \/ Region/i) as HTMLSelectElement;
      expect(usSelect).toBeInTheDocument();
      expect(usSelect.value).toBe('CA');
    });

    // Select WA
    fireEvent.change(usSelect, { target: { value: 'WA' } });
    expect(usSelect.value).toBe('WA');

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /Submit Wait Time Anonymously/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(capturedPayload).not.toBeNull();
    });

    expect(capturedPayload.countryCode).toBe('US');
    expect(capturedPayload.state).toBe('WA');
    expect(capturedPayload.province).toBeUndefined();
  }, 15000);

  it('dynamically switches CommunityDataTable filter options and resets safely', () => {
    function TableApp() {
      return (
        <MarketProvider>
          <Header />
          <CommunityDataTable />
        </MarketProvider>
      );
    }

    render(<TableApp />);

    // Initially in CA market
    expect(screen.getByLabelText('Filter deliveries by province or territory')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'All Canadian Provinces' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /British Columbia \(BC\)/i })).toBeInTheDocument();

    // Select a province
    const provSelect = screen.getByLabelText('Filter deliveries by province or territory');
    fireEvent.change(provSelect, { target: { value: 'BC' } });
    expect((provSelect as HTMLSelectElement).value).toBe('BC');

    // Switch to US via header
    const toggleUs = screen.getByTestId('market-toggle-us');
    fireEvent.click(toggleUs);

    // Filter resets to 'all' and aria-label updates
    expect(screen.getByLabelText('Filter deliveries by state or region')).toBeInTheDocument();
    const usSelect = screen.getByLabelText('Filter deliveries by state or region') as HTMLSelectElement;
    expect(usSelect.value).toBe('all');
    expect(screen.getByRole('option', { name: 'All US States' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /California \(CA\)/i })).toBeInTheDocument();
  });
});
