import { describe, it, expect } from 'vitest';
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
});
