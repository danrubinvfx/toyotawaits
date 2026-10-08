import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProvincialComparison } from '@/components/dashboard/provincial-comparison';

describe('ProvincialComparison Component', () => {
  it('renders top-line Canadian metrics', () => {
    render(<ProvincialComparison />);

    expect(screen.getByText('National Median Wait')).toBeInTheDocument();
    expect(screen.getByText('265 Days')).toBeInTheDocument();
    expect(screen.getByText('Active Waiting Queue')).toBeInTheDocument();
    expect(screen.getByText('Verified Deliveries')).toBeInTheDocument();
    expect(screen.getByText('True MSRP Compliance')).toBeInTheDocument();
  });

  it('renders provincial wait breakdown with rebate indicators', () => {
    render(<ProvincialComparison />);

    expect(screen.getByText('British Columbia')).toBeInTheDocument();
    expect(screen.getByText('Quebec')).toBeInTheDocument();
    expect(screen.getByText('Ontario')).toBeInTheDocument();
    expect(screen.getByText('Alberta')).toBeInTheDocument();

    // Verify provincial rebate badges exist for BC/QC
    const rebateBadges = screen.getAllByText('Provincial Rebate');
    expect(rebateBadges.length).toBeGreaterThan(0);
  });
});
