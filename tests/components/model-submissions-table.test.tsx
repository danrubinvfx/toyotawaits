import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  ModelSubmissionsTable,
  RawSubmissionRecord,
} from '@/components/wait-times/ModelSubmissionsTable';

const MOCK_SUBMISSIONS: RawSubmissionRecord[] = [
  {
    id: 'sub-bc-1',
    order_date: '2025-11-01',
    province: 'BC',
    city: 'Vancouver',
    model: 'RAV4 Hybrid',
    powertrain: 'Hybrid',
    trim: 'XSE',
    wait_days: 180,
    pricing: 'at_msrp',
    status: 'delivered',
  },
  {
    id: 'sub-bc-2',
    order_date: '2025-11-15',
    province: 'BC',
    city: 'Burnaby',
    model: 'RAV4 Hybrid',
    powertrain: 'Hybrid',
    trim: 'Limited',
    wait_days: null,
    pricing: 'at_msrp',
    status: 'pending',
  },
  {
    id: 'sub-ab-1',
    order_date: '2025-10-20',
    province: 'AB',
    city: 'Calgary',
    model: 'RAV4 Hybrid',
    powertrain: 'Hybrid',
    trim: 'LE',
    wait_days: 120,
    pricing: 'above_msrp',
    status: 'delivered',
  },
  {
    id: 'sub-on-1',
    order_date: '2025-12-01',
    province: 'ON',
    city: 'Toronto',
    model: 'RAV4 Hybrid',
    powertrain: 'Hybrid',
    trim: 'XLE',
    wait_days: 210,
    pricing: 'at_msrp',
    status: 'delivered',
  },
  {
    id: 'sub-qc-1',
    order_date: '2025-09-10',
    province: 'QC',
    city: 'Montreal',
    model: 'RAV4 Hybrid',
    powertrain: 'Hybrid',
    trim: 'SE',
    wait_days: 300,
    pricing: 'at_msrp',
    status: 'delivered',
  },
];

describe('ModelSubmissionsTable Component (Client-Side Province Filtering)', () => {
  it('renders all province selector pills (All, BC, AB, ON, QC) with accurate counts', () => {
    render(
      <ModelSubmissionsTable
        modelName="RAV4"
        slug="rav4"
        submissions={MOCK_SUBMISSIONS}
      />
    );

    const pillList = screen.getByTestId('province-filter-pills');
    expect(pillList).toBeInTheDocument();

    expect(screen.getByTestId('province-pill-all')).toHaveTextContent('All Canada5');
    expect(screen.getByTestId('province-pill-bc')).toHaveTextContent('BC2');
    expect(screen.getByTestId('province-pill-ab')).toHaveTextContent('AB1');
    expect(screen.getByTestId('province-pill-on')).toHaveTextContent('ON1');
    expect(screen.getByTestId('province-pill-qc')).toHaveTextContent('QC1');
  });

  it('filters submissions instantly in memory when province pills are selected', () => {
    render(
      <ModelSubmissionsTable
        modelName="RAV4"
        slug="rav4"
        submissions={MOCK_SUBMISSIONS}
      />
    );

    // Initial state: All 5 rows present
    expect(screen.getAllByRole('row').length).toBe(6); // 1 header + 5 rows

    // Select BC pill
    fireEvent.click(screen.getByTestId('province-pill-bc'));
    expect(screen.getByTestId('province-pill-bc')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByRole('row').length).toBe(3); // 1 header + 2 BC rows
    expect(screen.getByText('Vancouver')).toBeInTheDocument();
    expect(screen.getByText('Burnaby')).toBeInTheDocument();
    expect(screen.queryByText('Toronto')).not.toBeInTheDocument();

    // Select AB pill
    fireEvent.click(screen.getByTestId('province-pill-ab'));
    expect(screen.getByTestId('province-pill-ab')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByRole('row').length).toBe(2); // 1 header + 1 AB row
    expect(screen.getByText('Calgary')).toBeInTheDocument();
    expect(screen.queryByText('Vancouver')).not.toBeInTheDocument();

    // Select All pill
    fireEvent.click(screen.getByTestId('province-pill-all'));
    expect(screen.getByTestId('province-pill-all')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByRole('row').length).toBe(6); // 1 header + 5 rows
  });

  it('displays a friendly empty state when a province has 0 submissions', () => {
    const submissionsWithoutQC = MOCK_SUBMISSIONS.filter((s) => s.province !== 'QC');

    render(
      <ModelSubmissionsTable
        modelName="RAV4"
        slug="rav4"
        submissions={submissionsWithoutQC}
      />
    );

    fireEvent.click(screen.getByTestId('province-pill-qc'));

    expect(screen.getByTestId('province-empty-state')).toBeInTheDocument();
    expect(screen.getByText(/No Community Submissions Logged Yet for QC/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Add Your Timeline/i })).toHaveAttribute(
      'href',
      '/submit?model=rav4&province=QC'
    );
  });
});
