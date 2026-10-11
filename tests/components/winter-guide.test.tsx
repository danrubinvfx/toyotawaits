import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WinterGuide } from '@/components/winter-prep/winter-guide';
import { WINTER_PREP_DATA, getWinterPrepForModel } from '@/data/winter-prep';

describe('WinterGuide Component', () => {
  it('renders all 3 winter survival cards for the default RAV4', () => {
    render(<WinterGuide modelKey="rav4" />);

    expect(screen.getByTestId('winter-prep-guide')).toBeInTheDocument();
    expect(screen.getByTestId('winter-card-battery')).toBeInTheDocument();
    expect(screen.getByTestId('winter-card-floors')).toBeInTheDocument();
    expect(screen.getByTestId('winter-card-windshield')).toBeInTheDocument();

    // Headers
    expect(
      screen.getByRole('heading', { name: /12V Hybrid Cold-Start & Jump Points/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Sub-Zero Floor & Salt Defense/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Freezing Rain & Windshield Care/i })
    ).toBeInTheDocument();

    // RAV4 Specific content
    expect(screen.getByText(/Cargo area under right floor deck/i)).toBeInTheDocument();
    expect(screen.getByText(/under the red plastic '\+' flip cap/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Must NOT obstruct the high-voltage battery cooling intake mesh/i)
    ).toBeInTheDocument();

    // Educational cover context
    expect(screen.getByText(/Why Full Covers Freeze to Paint/i)).toBeInTheDocument();
    expect(screen.getByText(/trap rising engine condensation against sheet metal/i)).toBeInTheDocument();

    // Statutory Amazon Associates Disclaimer
    expect(
      screen.getByText(/As an Amazon Associate I earn from qualifying purchases\./i)
    ).toBeInTheDocument();
  });

  it('renders model-specific data for Grand Highlander', () => {
    render(<WinterGuide modelKey="grand-highlander" />);

    expect(screen.getByText(/Grand Highlander \(Hybrid MAX & Standard\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Rear quarter panel compartment/i)).toBeInTheDocument();
    expect(screen.getByText(/Driver-side engine compartment fuse box/i)).toBeInTheDocument();
    expect(screen.getByText(/High electrical draw from heated windshield/i)).toBeInTheDocument();
    expect(screen.getByText(/3-row full sidewall protection with middle aisle runner/i)).toBeInTheDocument();
  });

  it('renders model-specific data for Sienna Hybrid AWD', () => {
    render(<WinterGuide modelKey="sienna" />);

    expect(screen.getByText(/Sienna \(Hybrid AWD\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Driver-side rear cargo wall compartment/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Powered sliding doors can ice up along the lower rail channel/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Long-slide track floor liners with rubber seat rail seals/i)
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
      screen.getByText(/Low-profile, high-rim floor mats that keep dead pedal carpet dry/i)
    ).toBeInTheDocument();
  });

  it('renders model-specific data for Corolla Cross and Tacoma', () => {
    const { rerender } = render(<WinterGuide modelKey="corolla-cross" />);

    expect(screen.getByText(/Corolla Cross \(Hybrid & Gas\)/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Laser-measured dual front and rear bench liners/i)
    ).toBeInTheDocument();

    rerender(<WinterGuide modelKey="tacoma" />);

    expect(screen.getByText(/Tacoma \(i-FORCE MAX & Turbo\)/i)).toBeInTheDocument();
    expect(
      screen.getByText(/store the jump pack in the rear cab under-seat compartment/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Deep-channel heavy-duty rubber all-weather bucket liners/i)
    ).toBeInTheDocument();
  });

  it('verifies all outbound affiliate links have rel="noopener noreferrer nofollow sponsored" and target="_blank"', () => {
    render(<WinterGuide modelKey="rav4" />);

    const links = screen.getAllByRole('link');
    const outboundLinks = links.filter((link) =>
      link.getAttribute('href')?.startsWith('/out/') ||
      link.getAttribute('href')?.includes('amazon.ca')
    );

    expect(outboundLinks.length).toBeGreaterThanOrEqual(3);
    outboundLinks.forEach((link) => {
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener noreferrer nofollow sponsored');
    });
  });

  it('normalizes unrecognized model keys gracefully to RAV4 default', () => {
    const fallback = getWinterPrepForModel('unrecognized-model-xyz');
    expect(fallback.modelKey).toBe('rav4');
  });
});
