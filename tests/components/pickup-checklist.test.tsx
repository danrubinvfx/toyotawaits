import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PickupChecklist, DELIVERY_INSPECTION_ITEMS } from '@/components/delivery-prep/pickup-checklist';

describe('PickupChecklist Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders collapsed by default with compact header and progress chip', () => {
    render(<PickupChecklist />);

    // Header bar elements
    expect(screen.getByText(/Dealership Pickup Day Checklist/i)).toBeInTheDocument();
    expect(screen.getByText(/0 of 4 Verified/i)).toBeInTheDocument();
    expect(screen.getByText(/View 4 Inspection Checks/i)).toBeInTheDocument();

    // Body cards are hidden initially
    expect(screen.queryByText(/Bill of Sale & Pricing Verification/i)).toBeNull();
    expect(screen.queryByText(/Physical Key Fobs & Deliverables Handover/i)).toBeNull();
  });

  it('expands accordion when header or view button is clicked', () => {
    render(<PickupChecklist />);

    // Click expand button
    const expandBtn = screen.getByText(/View 4 Inspection Checks/i);
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

    // Verify localStorage has saved checked state
    const saved = JSON.parse(localStorage.getItem('toyotawaits_prep_checklist_checks') || '{}');
    expect(saved['inspect-bill-of-sale']).toBe(true);

    // Click Reset Inspection Checks
    const resetBtn = screen.getByText(/Reset Inspection Checks/i);
    fireEvent.click(resetBtn);

    // Back to 0 of 4
    expect(screen.getByText(/0 of 4 Verified/i)).toBeInTheDocument();
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
