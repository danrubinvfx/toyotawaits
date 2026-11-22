import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModelDropAlertBridge } from '@/components/wait-times/ModelDropAlertBridge';

describe('ModelDropAlertBridge Component', () => {
  it('renders high-contrast alert bridge banner with eyebrow, headline, subtext, and CTAs', () => {
    render(
      <ModelDropAlertBridge
        modelSlug="sienna"
        modelName="Sienna"
        estimatedWaitMonths={14}
        isUS={false}
      />
    );

    const bridge = screen.getByTestId('model-drop-alert-bridge');
    expect(bridge).toBeInTheDocument();

    expect(screen.getByText(/⚡ SKIP THE QUEUE • ~14 MO WAIT/i)).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /Skip the Queue: Get Free Sienna Drop Alerts/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Get notified by email when unreserved allocations or canceled customer orders land on dealer lots\./i
      )
    ).toBeInTheDocument();

    const alertBtn = screen.getByTestId('drop-alert-primary-button');
    expect(alertBtn).toBeInTheDocument();
    expect(alertBtn).toHaveTextContent(/🔔 Get Free Drop Alerts/i);

    const stockLink = screen.getByTestId('drop-alert-secondary-link');
    expect(stockLink).toBeInTheDocument();
    expect(stockLink).toHaveTextContent(/View Live Sienna Stock ↗/i);
    expect(stockLink).toHaveAttribute('href', '/inventory?model=sienna');
  });

  it('renders allocation radar eyebrow for US market or when estimatedWaitMonths is omitted', () => {
    render(
      <ModelDropAlertBridge
        modelSlug="rav4-hybrid"
        modelName="RAV4 Hybrid"
        estimatedWaitMonths={8}
        isUS={true}
      />
    );

    expect(screen.getByText(/⚡ SKIP THE QUEUE • ALLOCATION RADAR/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /Skip the Queue: Get Free RAV4 Hybrid Drop Alerts/i,
      })
    ).toBeInTheDocument();

    const stockLink = screen.getByTestId('drop-alert-secondary-link');
    expect(stockLink).toHaveAttribute('href', '/inventory?model=rav4-hybrid');
  });

  it('opens InventoryAlertModal pre-populated with active modelSlug and displays 180-Day Free Allocation Pass', () => {
    render(
      <ModelDropAlertBridge
        modelSlug="grand-highlander"
        modelName="Grand Highlander"
        estimatedWaitMonths="11.5"
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    const alertBtn = screen.getByTestId('drop-alert-primary-button');
    fireEvent.click(alertBtn);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/180-Day Free Allocation Pass/i)).toBeInTheDocument();

    const modelSelect = screen.getByTestId('alert-model-select') as HTMLSelectElement;
    expect(modelSelect.value).toBe('grand-highlander');

    const closeBtn = screen.getByTestId('close-alert-modal-btn');
    fireEvent.click(closeBtn);

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

    const bridge = screen.getByTestId('model-drop-alert-bridge');
    expect(bridge).toHaveClass('overflow-hidden');

    const actionRow = container.querySelector('.flex-col.sm\\:flex-row');
    expect(actionRow).toBeInTheDocument();
    expect(actionRow).toHaveClass('gap-3');

    const alertBtn = screen.getByTestId('drop-alert-primary-button');
    const stockLink = screen.getByTestId('drop-alert-secondary-link');
    expect(alertBtn).toHaveClass('w-full', 'sm:w-auto');
    expect(stockLink).toHaveClass('w-full', 'sm:w-auto');
  });
});
