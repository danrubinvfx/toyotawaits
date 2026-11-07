import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModelInventoryBridge } from '@/components/wait-times/ModelInventoryBridge';

describe('ModelInventoryBridge Component', () => {
  it('renders high-contrast banner with header, description, and primary CTA for Sienna', () => {
    render(<ModelInventoryBridge modelSlug="sienna" modelName="Sienna" />);

    // High-contrast container
    const bridge = screen.getByTestId('model-inventory-bridge');
    expect(bridge).toBeInTheDocument();

    // Header and description
    expect(screen.getByText(/⚡ Skip the wait\?/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Check observed dealer allocations and incoming transit units before waiting in queue\./i)
    ).toBeInTheDocument();

    // Primary CTA
    const primaryCta = screen.getByRole('link', { name: /View Live Sienna Stock ↗/i });
    expect(primaryCta).toBeInTheDocument();
    expect(primaryCta).toHaveAttribute('href', '/inventory?model=sienna');
  });

  it('renders primary CTA correctly for models with hyphens and special characters', () => {
    render(<ModelInventoryBridge modelSlug="grand-highlander" modelName="Grand Highlander" />);

    const primaryCta = screen.getByRole('link', { name: /View Live Grand Highlander Stock ↗/i });
    expect(primaryCta).toBeInTheDocument();
    expect(primaryCta).toHaveAttribute('href', '/inventory?model=grand-highlander');
  });

  it('renders secondary Set Drop Alert CTA and opens InventoryAlertModal on click', () => {
    render(<ModelInventoryBridge modelSlug="sienna" modelName="Sienna" />);

    const alertBtn = screen.getByRole('button', { name: /Set Drop Alert/i });
    expect(alertBtn).toBeInTheDocument();

    // Modal is initially not present or closed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Click secondary CTA
    fireEvent.click(alertBtn);

    // Modal opens with initialModel prefilled
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/30-Day Free Allocation Pass/i)).toBeInTheDocument();
    expect(screen.getByTestId('close-alert-modal-btn')).toBeInTheDocument();
  });

  it('verifies responsive mobile view hierarchy on 375px viewport', () => {
    window.innerWidth = 375;
    const { container } = render(<ModelInventoryBridge modelSlug="sienna" modelName="Sienna" />);

    const bridge = container.querySelector('[data-testid="model-inventory-bridge"]');
    expect(bridge).toBeInTheDocument();

    const innerLayout = bridge?.querySelector('.flex-col');
    expect(innerLayout).toBeInTheDocument();
  });
});
