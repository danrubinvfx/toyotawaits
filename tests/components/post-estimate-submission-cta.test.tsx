import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PostEstimateSubmissionCta } from '@/components/calculator/post-estimate-submission-cta';

describe('PostEstimateSubmissionCta Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders default high-contrast prompt and button when no submission exists in localStorage', () => {
    render(<PostEstimateSubmissionCta />);

    // Header copy
    expect(screen.getByText(/Waiting on a delivery or picked up recently\?/i)).toBeInTheDocument();
    // Subtext copy
    expect(screen.getByText(/Help keep Canadian wait times accurate\. 100% anonymous, takes 30s\./i)).toBeInTheDocument();
    // CTA Button
    const btn = screen.getByRole('link', { name: /\+ Add Your Wait Time/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('href', '/submit');
  });

  it('renders returning user state with model and edit link when toyotawaits_submission is in localStorage', () => {
    localStorage.setItem(
      'toyotawaits_submission',
      JSON.stringify({
        id: 'sub-test-456',
        editKey: 'key-test-789',
        model: 'RAV4 Prime',
        status: 'waiting',
      })
    );

    render(<PostEstimateSubmissionCta />);

    // Dynamic model header
    expect(screen.getByText(/Tracking your RAV4 Prime order/i)).toBeInTheDocument();
    expect(screen.getByText('Active Order')).toBeInTheDocument();

    // CTA Button
    const btn = screen.getByRole('link', { name: /Update Status \/ Mark Delivered/i });
    expect(btn).toBeInTheDocument();
    expect(btn.getAttribute('href')).toContain('/edit/sub-test-456?key=key-test-789');
  });
});
