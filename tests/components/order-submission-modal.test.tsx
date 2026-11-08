import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OrderSubmissionModal } from '@/components/forms/OrderSubmissionModal';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

describe('OrderSubmissionModal Canadian Fields', () => {
  it('renders Canadian doc fee and forced add-ons fields with exact labels and placeholders', () => {
    render(<OrderSubmissionModal />);

    // Verify Dealer Documentation Fee field
    expect(screen.getByLabelText(/Dealer Documentation Fee \(\$CAD\)/i)).toBeInTheDocument();
    const docFeeInput = screen.getByPlaceholderText('e.g. 595');
    expect(docFeeInput).toBeInTheDocument();
    expect(docFeeInput).toHaveAttribute('name', 'doc_fee_charged');

    // Verify Mandatory Add-ons / Packages field
    expect(screen.getByLabelText(/Mandatory Add-ons \/ Packages \(\$CAD\)/i)).toBeInTheDocument();
    const forcedAddonsInput = screen.getByPlaceholderText('e.g. 995 for VIN etching, rust, tire protection');
    expect(forcedAddonsInput).toBeInTheDocument();
    expect(forcedAddonsInput).toHaveAttribute('name', 'forced_addons_amount');
  });
});
