import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModelDropAlertBridge } from '@/components/wait-times/ModelDropAlertBridge';

describe('ModelDropAlertBridge Component', () => {
  it('renders high-contrast alert bridge banner with eyebrow, headline with wait months, subtitle, and buttons', () => {
    render(
      <ModelDropAlertBridge
        modelSlug="sienna"
        modelName="Sienna"
        estimatedWaitMonths={14}
      />
    );

    // Container
    const bridge = screen.getByTestId('model-drop-alert-bridge');
    expect(bridge).toBeInTheDocument();

    // Eyebrow badge
    expect(screen.getByText(/⚡ SKIP THE QUEUE • ALLOCATION RADAR/i)).toBeInTheDocument();

    // Headline with dynamic wait months & model name
    expect(
      screen.getByRole('heading', {
        name: /Don't want to wait 14 months for a Sienna\?/i,
      })
    ).toBeInTheDocument();

    // Subtitle
    expect(
      screen.getByText(
        /Dealerships receive unreserved allocations and order cancellations every week across Canadian lots\. Get notified before they hit public dealer listings\./i
      )
    ).toBeInTheDocument();

    // Primary CTA Button
    const alertBtn = screen.getByTestId('drop-alert-primary-button');
    expect(alertBtn).toBeInTheDocument();
    expect(alertBtn).toHaveTextContent(/🔔 Set Free 30-Day Drop Alert/i);

    // Secondary Link CTA
    const stockLink = screen.getByTestId('drop-alert-secondary-link');
    expect(stockLink).toBeInTheDocument();
    expect(stockLink).toHaveTextContent(/Browse Live Sienna Stock ↗/i);
    expect(stockLink).toHaveAttribute('href', '/inventory?model=sienna');
  });

  it('renders fallback headline "in line" when estimatedWaitMonths is undefined or zero', () => {
    render(
      <ModelDropAlertBridge
        modelSlug="rav4-hybrid"
        modelName="RAV4 Hybrid"
      />
    );

    expect(
      screen.getByRole('heading', {
        name: /Don't want to wait in line for a RAV4 Hybrid\?/i,
      })
    ).toBeInTheDocument();

    const stockLink = screen.getByTestId('drop-alert-secondary-link');
    expect(stockLink).toHaveAttribute('href', '/inventory?model=rav4-hybrid');
  });

  it('opens InventoryAlertModal upon clicking primary CTA and closes when dismissed', () => {
    render(
      <ModelDropAlertBridge
        modelSlug="grand-highlander"
        modelName="Grand Highlander"
        estimatedWaitMonths="11.5"
      />
    );

    // Modal is initially absent
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Click Set Drop Alert
    const alertBtn = screen.getByTestId('drop-alert-primary-button');
    fireEvent.click(alertBtn);

    // Modal should now be open
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/30-Day Free Allocation Pass/i)).toBeInTheDocument();

    // Close the modal
    const closeBtn = screen.getByTestId('close-alert-modal-btn');
    fireEvent.click(closeBtn);

    // Modal should close
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('maintains responsive mobile stacking classes without horizontal overflow', () => {
    const { container } = render(
      <ModelDropAlertBridge
        modelSlug="sienna"
        modelName="Sienna"
        estimatedWaitMonths={12}
      />
    );

    const actionRow = container.querySelector('.flex-col.sm\\:flex-row');
    expect(actionRow).toBeInTheDocument();
    expect(actionRow).toHaveClass('gap-3');
  });
});
