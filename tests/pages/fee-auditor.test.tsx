import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FeeAuditorPage, { metadata } from '@/app/tools/fee-auditor/page';

describe('FeeAuditorPage Route (/tools/fee-auditor)', () => {
  it('defines correct page metadata for Toyota Dealer Fee Auditor', () => {
    expect(metadata.title).toBe(
      'Toyota Dealer Fee Auditor Canada | AMVIC & OMVIC All-In Pricing Compliance'
    );
    expect(metadata.description).toContain(
      'Interactive dealer fee auditor for Canadian Toyota buyers'
    );
    expect(metadata.alternates?.canonical).toBe('https://www.toyotawaits.ca/tools/fee-auditor');
  });

  it('renders hero section, interactive auditor, and printable fee refusal worksheet', () => {
    render(<FeeAuditorPage />);

    expect(
      screen.getByRole('heading', {
        name: /Toyota Dealer Fee & Compliance Auditor/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByTestId('dealer-fee-auditor')).toBeInTheDocument();
    expect(screen.getByTestId('fee-refusal-worksheet-section')).toBeInTheDocument();
  });
});
