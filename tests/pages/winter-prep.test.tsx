import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WinterPrepView, WINTER_VEHICLE_OPTIONS } from '@/components/winter-prep/winter-prep-view';

describe('WinterPrepView Page Component', () => {
  it('renders the clean hero section explaining Canadian cold-weather realities', () => {
    render(<WinterPrepView />);

    expect(
      screen.getByRole('heading', {
        name: /Canadian Winter Delivery & Cold-Weather Survival Guide/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/🇨🇦 Canadian Winter Survival Playbook/i)).toBeInTheDocument();
    expect(screen.getByText(/Jump Packs Rated -20°C to \+50°C/i)).toBeInTheDocument();

    // 3 Realities Callouts
    expect(screen.getByText(/12V Battery Drop/i)).toBeInTheDocument();
    expect(screen.getByText(/Salt & Slush Armor/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Freezing Rain Defense/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders the interactive vehicle selector with all 6 required Toyota models and defaults to RAV4', () => {
    render(<WinterPrepView />);

    expect(screen.getByRole('button', { name: 'RAV4 (Hybrid / Prime)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Grand Highlander' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sienna' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Prius Prime' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Corolla Cross' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tacoma' })).toBeInTheDocument();

    // RAV4 is pre-selected
    const rav4Btn = screen.getByRole('button', { name: 'RAV4 (Hybrid / Prime)' });
    expect(rav4Btn.getAttribute('aria-pressed')).toBe('true');

    // Default RAV4 guidance
    expect(screen.getByText(/RAV4 \(Hybrid \/ Prime \/ Gas\)/i)).toBeInTheDocument();
    expect(screen.getByText(/TuxMat Custom High-Wall Floor Liners \(RAV4\)/i)).toBeInTheDocument();
  });

  it('updates model-specific guidance and product cards when vehicle selection changes', () => {
    render(<WinterPrepView />);

    // Switch to Grand Highlander
    const ghBtn = screen.getByRole('button', { name: 'Grand Highlander' });
    fireEvent.click(ghBtn);

    expect(ghBtn.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByText(/Grand Highlander \(Hybrid MAX & Standard\)/i)).toBeInTheDocument();
    expect(
      screen.getByText(/3-Row Heavy Duty All-Weather Floor Liners \(Grand Highlander\)/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Rear quarter panel compartment/i)).toBeInTheDocument();

    // Switch to Tacoma
    const tacomaBtn = screen.getByRole('button', { name: 'Tacoma' });
    fireEvent.click(tacomaBtn);

    expect(tacomaBtn.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByText(/Tacoma \(i-FORCE MAX & Turbo\)/i)).toBeInTheDocument();
    expect(
      screen.getByText(/store the jump pack in the rear cab under-seat compartment/i)
    ).toBeInTheDocument();
  });

  it('renders cross-links back to delivery timeline calculator and full mods catalog', () => {
    render(<WinterPrepView />);

    const estimatorLink = screen.getByRole('link', { name: /Delivery Timeline Calculator/i });
    expect(estimatorLink).toBeInTheDocument();
    expect(estimatorLink).toHaveAttribute('href', '/#estimator');

    const modsLink = screen.getByRole('link', { name: /Complete Mods & Gear Catalog/i });
    expect(modsLink).toBeInTheDocument();
    expect(modsLink).toHaveAttribute('href', '/mods');

    // Tire Guide cross-link banner
    expect(screen.getByTestId('winter-prep-tire-callout')).toBeInTheDocument();
    const tireGuideLink = screen.getByRole('link', { name: /View Canadian Tire Guide 🛞 →/i });
    expect(tireGuideLink).toBeInTheDocument();
    expect(tireGuideLink).toHaveAttribute('href', '/tires');
  });

  it('includes the mandatory Amazon Associates statutory disclaimer', () => {
    render(<WinterPrepView />);

    expect(
      screen.getByText(/As an Amazon Associate I earn from qualifying purchases\./i)
    ).toBeInTheDocument();
  });
});
