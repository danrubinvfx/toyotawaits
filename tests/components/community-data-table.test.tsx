import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CommunityDataTable } from '@/components/dashboard/community-data-table';

describe('CommunityDataTable Component', () => {
  it('renders table headers and initial crowd submissions', () => {
    render(<CommunityDataTable />);

    expect(screen.getByText('Community Submissions & Delivery Log')).toBeInTheDocument();
    expect(screen.getByText('Vehicle & Trim')).toBeInTheDocument();
    expect(screen.getByText('Province / City')).toBeInTheDocument();
    expect(screen.getByText('Status & Wait')).toBeInTheDocument();
    expect(screen.getByText('Download Filtered CSV')).toBeInTheDocument();
  });

  it('filters records when a specific vehicle model is selected', () => {
    render(<CommunityDataTable />);

    // By default multiple models are present
    const modelSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(modelSelect, { target: { value: 'sienna' } });

    // Should now show Sienna records and hide RAV4 records
    expect(screen.getAllByText(/Sienna/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Woodland Edition AWD/)).not.toBeInTheDocument();
  });

  it('filters records by delivery status', () => {
    render(<CommunityDataTable />);

    const statusSelect = screen.getAllByRole('combobox')[2];
    fireEvent.change(statusSelect, { target: { value: 'pending' } });

    // Should show "Still Waiting" badges and days so far in status column
    expect(screen.getAllByText('Still Waiting').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\d+ days so far/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Delivered 2024/)).not.toBeInTheDocument();
  });

  it('filters records using status tab toggle buttons', () => {
    render(<CommunityDataTable />);

    const deliveredTab = screen.getByRole('button', { name: /Delivered/i });
    fireEvent.click(deliveredTab);

    expect(screen.getAllByText(/Delivered/i).length).toBeGreaterThan(0);
    expect(screen.queryByText('Still Waiting')).not.toBeInTheDocument();

    const pendingTab = screen.getByRole('button', { name: /Still Waiting/i });
    fireEvent.click(pendingTab);

    expect(screen.getAllByText('Still Waiting').length).toBeGreaterThan(0);
    // In table body, no rows should show Days wait (only pending days so far)
    expect(screen.queryByText('410 Days')).not.toBeInTheDocument();
  });

  it('updates the CSV download URL when filters change', () => {
    render(<CommunityDataTable />);

    const downloadLink = screen.getByText('Download Filtered CSV').closest('a');
    expect(downloadLink).toHaveAttribute('href', '/api/export?format=csv');

    // Filter by province
    const provSelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(provSelect, { target: { value: 'BC' } });

    expect(downloadLink).toHaveAttribute(
      'href',
      expect.stringContaining('province=BC')
    );
  });

  it('triggers unpaginated client CSV export on click without truncating to page size', () => {
    const createObjectURLMock = vi.fn().mockReturnValue('blob:mock-url');
    const revokeObjectURLMock = vi.fn();
    window.URL.createObjectURL = createObjectURLMock;
    window.URL.revokeObjectURL = revokeObjectURLMock;

    render(<CommunityDataTable />);

    const downloadLink = screen.getByText('Download Filtered CSV').closest('a');
    expect(downloadLink).toBeInTheDocument();

    fireEvent.click(downloadLink!);

    expect(createObjectURLMock).toHaveBeenCalledTimes(1);
    const blobArg = createObjectURLMock.mock.calls[0][0] as Blob;
    expect(blobArg).toBeInstanceOf(Blob);

    // Verify it exports all 57 records, not just page size 8
    const reader = new FileReader();
    const readPromise = new Promise<string>((resolve) => {
      reader.onload = () => resolve(reader.result as string);
      reader.readAsText(blobArg);
    });

    return readPromise.then((csvText) => {
      const dataLines = csvText.trim().split('\r\n').filter((l) => l.trim().length > 0);
      // 1 header row + 57 data rows = 58 total lines
      expect(dataLines.length).toBe(58);
    });
  });

  it('renders custom initialRecords passed as prop including pending submissions', () => {
    const customRecords = [
      {
        id: 'custom-pending-1',
        model: 'RAV4',
        modelSlug: 'rav4',
        powertrain: 'Plug-in Hybrid (PHEV)',
        powertrainSlug: 'phev',
        trim: 'XSE AWD Tech Package',
        modelYear: 2026,
        province: 'BC',
        city: 'Richmond',
        orderDate: '2026-07-25',
        deliveryDate: null,
        waitDays: null,
        status: 'pending' as const,
        pricing: 'at_msrp' as const,
        addonsCad: 0,
      },
    ];

    render(<CommunityDataTable initialRecords={customRecords} />);

    expect(screen.getByText('Still Waiting')).toBeInTheDocument();
    expect(screen.getByText(/Richmond/)).toBeInTheDocument();
  });

  it('filters records live when typing in the debounced search input', async () => {
    vi.useFakeTimers();
    render(<CommunityDataTable />);

    const searchInput = screen.getByPlaceholderText(/Search by dealer name, city, model, trim, or province/i);
    fireEvent.change(searchInput, { target: { value: 'Oakville' } });

    // Advance debounce timer within act
    React.act(() => {
      vi.advanceTimersByTime(300);
    });

    // Oakville should be present, other cities hidden
    expect(screen.getAllByText(/Oakville/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Richmond/)).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it('filters records when clicking Hybrid or PHEV pill buttons', () => {
    render(<CommunityDataTable />);

    const phevPill = screen.getByRole('button', { name: /PHEV/i });
    fireEvent.click(phevPill);

    // PHEV records should be visible
    expect(screen.getAllByText(/PHEV/i).length).toBeGreaterThan(0);

    const hybridPill = screen.getByRole('button', { name: /Hybrid/i });
    fireEvent.click(hybridPill);

    expect(screen.getAllByText(/Hybrid/i).length).toBeGreaterThan(0);
  });
});

