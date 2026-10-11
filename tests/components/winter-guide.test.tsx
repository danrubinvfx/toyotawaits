import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WinterGuide } from '@/components/winter-prep/winter-guide';
import { WINTER_PREP_DATA, getWinterPrepForModel } from '@/data/winter-prep';

describe('WinterGuide Component', () => {
  it('renders all 3 two-part winter survival cards with embedded recommended gear modules for RAV4', () => {
    render(<WinterGuide modelKey="rav4" />);

    expect(screen.getByTestId('winter-prep-guide')).toBeInTheDocument();
    expect(screen.getByTestId('winter-card-battery')).toBeInTheDocument();
    expect(screen.getByTestId('winter-card-floors')).toBeInTheDocument();
    expect(screen.getByTestId('winter-card-windshield')).toBeInTheDocument();

    // Section Headers
    expect(
      screen.getByRole('heading', { name: /12V Battery & Cold Starts/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Salt & Slush Floor Protection/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Frost & Windshield Protection/i })
    ).toBeInTheDocument();

    // Upper Section: Model-Specific Technical Tips
    expect(screen.getByText(/Cargo area under right floor deck/i)).toBeInTheDocument();
    expect(screen.getByText(/under red plastic '\+' flip cap/i)).toBeInTheDocument();
    expect(screen.getByText(/Sub-zero cold drains auxiliary battery chemical capacity/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Must NOT obstruct the high-voltage battery cooling intake mesh/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Why Full Covers Freeze to Paint/i)).toBeInTheDocument();
    expect(screen.getByText(/Wiper Arm Frozen Hinge Prevention/i)).toBeInTheDocument();
    expect(screen.getByText(/keeping wipers resting flat against lower windshield heating elements/i)).toBeInTheDocument();

    // Lower Section: Embedded Recommended Gear Modules
    expect(screen.getByTestId('recommended-gear-battery')).toBeInTheDocument();
    expect(screen.getByTestId('recommended-gear-floors')).toBeInTheDocument();
    expect(screen.getByTestId('recommended-gear-windshield')).toBeInTheDocument();

    // Product Badges
    expect(screen.getByText('Essential')).toBeInTheDocument();
    expect(screen.getByText('Top Pick')).toBeInTheDocument();
    expect(screen.getByText('Recommended')).toBeInTheDocument();

    // Product Titles & Benefits
    expect(screen.getByText(/NOCO Boost Plus GB40 \(or GBX45 for extreme cold\)/i)).toBeInTheDocument();
    expect(screen.getByText(/TuxMat Custom High-Wall Floor Liners \(RAV4\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Magnetic Door-Anchor Windshield Frost Guard/i)).toBeInTheDocument();

    // View on Amazon.ca buttons
    const amazonButtons = screen.getAllByRole('link', { name: /View on Amazon\.ca/i });
    expect(amazonButtons).toHaveLength(3);

    // Statutory Amazon Associates Disclaimer
    expect(
      screen.getByText(/As an Amazon Associate I earn from qualifying purchases\./i)
    ).toBeInTheDocument();
  });

  it('renders model-specific data and product cards for Grand Highlander', () => {
    render(<WinterGuide modelKey="grand-highlander" />);

    expect(screen.getByText(/Grand Highlander \(Hybrid MAX & Standard\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Rear quarter panel compartment/i)).toBeInTheDocument();
    expect(screen.getByText(/Driver-side engine compartment fuse box/i)).toBeInTheDocument();
    expect(screen.getByText(/High electrical draw from heated windshield/i)).toBeInTheDocument();
    expect(screen.getByText(/3-Row Heavy Duty All-Weather Floor Liners \(Grand Highlander\)/i)).toBeInTheDocument();
  });

  it('renders model-specific data and product cards for Sienna Hybrid AWD', () => {
    render(<WinterGuide modelKey="sienna" />);

    expect(screen.getByText(/Sienna \(Hybrid AWD\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Driver-side rear cargo wall compartment/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Powered sliding doors can ice up along the lower rail channel/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/TuxMat Custom Floor Liners \(Sienna 7\/8 Passenger\)/i)
    ).toBeInTheDocument();
  });

  it('renders model-specific data for Prius Prime', () => {
    render(<WinterGuide modelKey="prius-prime" />);

    expect(screen.getByText(/Prius Prime \(PHEV\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Rear trunk area underneath the right side/i)).toBeInTheDocument();
    expect(
      screen.getByText(/In temperatures below -10°C, the gas engine will run to heat the cabin/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Custom-Fit High-Wall All-Weather Floor Liners \(Prius Prime\)/i)
    ).toBeInTheDocument();
  });

  it('renders model-specific data for Corolla Cross and Tacoma', () => {
    const { rerender } = render(<WinterGuide modelKey="corolla-cross" />);

    expect(screen.getByText(/Corolla Cross \(Hybrid & Gas\)/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Custom-Fit All-Weather Floor Mats \(Corolla Cross\)/i)
    ).toBeInTheDocument();

    rerender(<WinterGuide modelKey="tacoma" />);

    expect(screen.getByText(/Tacoma \(i-FORCE MAX & Turbo\)/i)).toBeInTheDocument();
    expect(
      screen.getByText(/store the jump pack in the rear cab under-seat compartment/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Heavy-Duty All-Weather Floor Liners \(Tacoma\)/i)
    ).toBeInTheDocument();
  });

  it('verifies all outbound affiliate links have rel="noopener noreferrer nofollow sponsored" and target="_blank"', () => {
    render(<WinterGuide modelKey="rav4" />);

    const amazonButtons = screen.getAllByRole('link', { name: /View on Amazon\.ca/i });
    expect(amazonButtons.length).toBe(3);

    amazonButtons.forEach((link) => {
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener noreferrer nofollow sponsored');
      expect(link.getAttribute('href')).toContain('amazon.ca');
    });
  });

  it('normalizes unrecognized model keys gracefully to RAV4 default', () => {
    const fallback = getWinterPrepForModel('unrecognized-model-xyz');
    expect(fallback.modelKey).toBe('rav4');
  });
});
