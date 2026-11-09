import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DealerFeeAuditor, generateNegotiationScript } from '@/components/compliance/DealerFeeAuditor';
import { FeeRefusalWorksheet } from '@/components/delivery-prep/fee-refusal-worksheet';

describe('DealerFeeAuditor & FeeRefusalWorksheet Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  describe('DealerFeeAuditor Component', () => {
    it('renders with default line items and Alberta AMVIC enforcement active', () => {
      render(<DealerFeeAuditor />);

      // Headers & eyebrow
      expect(screen.getByText('AMVIC & OMVIC All-In Pricing Engine')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Interactive Dealer Fee & Compliance Auditor/i })).toBeInTheDocument();

      // Province buttons
      expect(screen.getByTestId('province-btn-ab')).toBeInTheDocument();
      expect(screen.getByTestId('province-btn-on')).toBeInTheDocument();
      expect(screen.getByTestId('province-btn-bc')).toBeInTheDocument();
      expect(screen.getByTestId('province-btn-other')).toBeInTheDocument();

      // Check all 5 fee number inputs
      expect(screen.getByRole('spinbutton', { name: /Documentation \/ Admin Fee/i })).toHaveValue(799);
      expect(screen.getByRole('spinbutton', { name: /Window Security Etching/i })).toHaveValue(499);
      expect(screen.getByRole('spinbutton', { name: /Electronic Rust Module/i })).toHaveValue(1295);
      expect(screen.getByRole('spinbutton', { name: /Engine Block Heater/i })).toHaveValue(800);
      expect(screen.getByRole('spinbutton', { name: /Toyota ECP Warranty/i })).toHaveValue(2850);

      // Verify AMVIC violation banner
      expect(screen.getByText(/AMVIC Violation \(Alberta All-In Pricing Law\)/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Vehicle Sales Regulation s\. 11/i).length).toBeGreaterThanOrEqual(1);
    });

    it('switches jurisdiction to Ontario (OMVIC) and displays OMVIC violation flags', () => {
      render(<DealerFeeAuditor />);

      const onBtn = screen.getByTestId('province-btn-on');
      fireEvent.click(onBtn);

      expect(screen.getByText(/OMVIC Violation \(Ontario All-In Pricing Law\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Motor Vehicle Dealers Act \(MVDA 2002, O\. Reg\. 333\/08 s\. 36\)/i)).toBeInTheDocument();
    });

    it('updates fee inputs dynamically and recalculates potential savings tally', () => {
      render(<DealerFeeAuditor />);

      const docFeeInput = screen.getByRole('spinbutton', { name: /Documentation \/ Admin Fee/i });
      fireEvent.change(docFeeInput, { target: { value: '995' } });
      expect(docFeeInput).toHaveValue(995);

      const scriptPreview = screen.getByTestId('negotiation-script-preview');
      expect(scriptPreview.textContent).toContain('$995 CAD');
    });

    it('copies polite negotiation script to clipboard with feedback', async () => {
      render(<DealerFeeAuditor />);

      const copyBtn = screen.getByTestId('copy-script-btn');
      fireEvent.click(copyBtn);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        expect.stringContaining('Attention: Sales & Finance Management Team,')
      );

      await waitFor(() => {
        expect(screen.getByText(/Copied Negotiation Script!/i)).toBeInTheDocument();
      });
    });

    it('generates personalized negotiation script referencing dealer name and provincial rules', () => {
      const script = generateNegotiationScript(
        {
          docFee: 850,
          etching: 399,
          rustModule: 1100,
          blockHeater: 750,
          ecp: 2800,
        },
        {
          docFee: true,
          etching: true,
          rustModule: true,
          blockHeater: true,
          ecp: true,
        },
        'AB',
        'Stampede Toyota'
      );

      expect(script).toContain('Attention: Stampede Toyota,');
      expect(script).toContain('Alberta AMVIC regulations (Consumer Protection Act, Vehicle Sales Regulation s. 11)');
      expect(script).toContain('$850 CAD');
      expect(script).toContain('Window Security Etch');
      expect(script).toContain('Electronic Rust Module');
      expect(script).toContain('Toyota ECP Extended Warranty');
      expect(script).toContain('31-day grace rule');
    });
  });

  describe('FeeRefusalWorksheet Component', () => {
    it('renders printable vehicle inspection checkpoints and finance fee refusal table', () => {
      const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
      render(<FeeRefusalWorksheet />);

      expect(screen.getByText('Printable Inspection Checklist & Fee Refusal Worksheet')).toBeInTheDocument();
      expect(screen.getByText('Front Suspension Transport Spacers Removed')).toBeInTheDocument();
      expect(screen.getByText('Bright Daylight Exterior Body & Glass Audit')).toBeInTheDocument();
      expect(screen.getByText('2nd Smart Key Allocation IOU Voucher')).toBeInTheDocument();
      expect(screen.getByText('Hybrid Battery Vent Filter & Charging Cables')).toBeInTheDocument();

      // Check fee refusal items
      expect(screen.getByText('Part 2: Finance Office Fee Refusal & All-In Pricing Worksheet')).toBeInTheDocument();
      expect(screen.getByText('Window Security Etching')).toBeInTheDocument();
      expect(screen.getByText('Electronic Rust Module')).toBeInTheDocument();
      expect(screen.getByText('Toyota ECP Extended Warranty')).toBeInTheDocument();

      // Test print button trigger
      const printBtn = screen.getByTestId('print-worksheet-btn');
      fireEvent.click(printBtn);
      expect(printSpy).toHaveBeenCalled();
    });
  });
});
