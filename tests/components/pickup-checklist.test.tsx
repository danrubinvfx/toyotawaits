import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  PickupChecklist,
  PDI_CHECKLIST_STORAGE_KEY,
} from '@/components/delivery-prep/pickup-checklist';

describe('PickupChecklist Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders collapsed by default with compact header and progress chip', () => {
    render(<PickupChecklist />);

    // Header bar elements
    expect(screen.getByText(/Dealership Pickup Day Inspection Steps/i)).toBeInTheDocument();
    expect(screen.getByText(/0 of 4 Verified/i)).toBeInTheDocument();
    expect(screen.getByText(/View Inspection Checks/i)).toBeInTheDocument();

    // Body cards are hidden initially
    expect(screen.queryByText(/Bill of Sale & Pricing Verification/i)).toBeNull();
    expect(screen.queryByText(/Physical Key Fobs & Deliverables Handover/i)).toBeNull();
  });

  it('expands accordion when header or view button is clicked', () => {
    render(<PickupChecklist />);

    // Click expand button
    const expandBtn = screen.getByText(/View Inspection Checks/i);
    fireEvent.click(expandBtn);

    // All 4 inspection cards now visible
    expect(screen.getByText(/Bill of Sale & Pricing Verification/i)).toBeInTheDocument();
    expect(screen.getByText(/Physical Key Fobs & Deliverables Handover/i)).toBeInTheDocument();
    expect(screen.getByText(/Exterior Paint & PDI Transport Spacer Removal/i)).toBeInTheDocument();
    expect(screen.getByText(/Hybrid Battery Vent & Electronics Verification/i)).toBeInTheDocument();

    // Bottom collapse button is present
    expect(screen.getByText(/Collapse Checklist/i)).toBeInTheDocument();
  });

  it('toggles check items and updates verified count', () => {
    render(<PickupChecklist defaultOpen={true} />);

    // Initially 0 of 4 verified
    expect(screen.getByText(/0 of 4 Verified/i)).toBeInTheDocument();

    // Click Bill of Sale
    const billOfSale = screen.getByText(/Bill of Sale & Pricing Verification/i);
    fireEvent.click(billOfSale);

    // Now 1 of 4 verified
    expect(screen.getByText(/1 of 4 Verified/i)).toBeInTheDocument();

    // Verify localStorage has saved checked item IDs under toyotawaits_pdi_checklist_v1
    const saved = JSON.parse(localStorage.getItem(PDI_CHECKLIST_STORAGE_KEY) || '[]');
    expect(saved).toEqual(['inspect-bill-of-sale']);

    // Header Reset link is visible when >= 1 item is checked
    const headerResetBtn = screen.getByTestId('checklist-header-reset-btn');
    expect(headerResetBtn).toHaveTextContent(/Reset/i);

    // Click Reset Inspection Checks
    const resetBtn = screen.getByText(/Reset Inspection Checks/i);
    fireEvent.click(resetBtn);

    // Back to 0 of 4
    expect(screen.getByText(/0 of 4 Verified/i)).toBeInTheDocument();
    expect(localStorage.getItem(PDI_CHECKLIST_STORAGE_KEY)).toBeNull();
  });

  it('restores checked item IDs from localStorage toyotawaits_pdi_checklist_v1 and resets via header Reset link', () => {
    localStorage.setItem(
      PDI_CHECKLIST_STORAGE_KEY,
      JSON.stringify(['inspect-bill-of-sale', 'inspect-key-fobs'])
    );

    render(<PickupChecklist defaultOpen={true} />);

    expect(screen.getByText(/2 of 4 Verified/i)).toBeInTheDocument();

    const headerResetBtn = screen.getByTestId('checklist-header-reset-btn');
    fireEvent.click(headerResetBtn);

    expect(screen.getByText(/0 of 4 Verified/i)).toBeInTheDocument();
    expect(screen.queryByTestId('checklist-header-reset-btn')).toBeNull();
  });

  it('triggers navigator.share on Share Checklist click when supported', async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', {
      value: shareMock,
      configurable: true,
    });

    render(<PickupChecklist />);

    const shareBtn = screen.getByTestId('checklist-share-btn');
    fireEvent.click(shareBtn);

    await waitFor(() => {
      expect(shareMock).toHaveBeenCalledWith({
        title: 'Toyota Delivery Day PDI Checklist',
        url: window.location.href,
      });
    });
  });

  it('falls back to clipboard copy and shows Copied confirmation pill when navigator.share is unavailable', async () => {
    Object.defineProperty(navigator, 'share', {
      value: undefined,
      configurable: true,
    });
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
    });

    render(<PickupChecklist />);

    const shareBtn = screen.getByTestId('checklist-share-btn');
    fireEvent.click(shareBtn);

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith(window.location.href);
      expect(screen.getByText('Copied')).toBeInTheDocument();
    });
  });

  it('renders model-specific PDI callout pill when model prop is provided', () => {
    render(<PickupChecklist model="sienna" />);

    const pill = screen.getByTestId('model-pdi-callout-pill');
    expect(pill).toHaveTextContent(/hands-free kick-sensor sliding doors/i);
  });

  it('opens automatically when defaultOpen is true', () => {
    render(<PickupChecklist defaultOpen={true} />);

    expect(screen.getByText(/Bill of Sale & Pricing Verification/i)).toBeInTheDocument();
    expect(screen.getByText(/Collapse Checklist/i)).toBeInTheDocument();
  });

  it('opens automatically upon receiving toyotawait:open-checklist custom event', () => {
    render(<PickupChecklist defaultOpen={false} />);

    expect(screen.queryByText(/Bill of Sale & Pricing Verification/i)).toBeNull();

    // Dispatch event
    fireEvent(window, new CustomEvent('toyotawait:open-checklist'));

    // Should now be open
    expect(screen.getByText(/Bill of Sale & Pricing Verification/i)).toBeInTheDocument();
  });
});
