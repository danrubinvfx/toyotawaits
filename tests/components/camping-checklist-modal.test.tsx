import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  CampingChecklistModal,
  type ChecklistItem,
} from '@/components/camping/CampingChecklistModal';

const TEST_ITEMS: ChecklistItem[] = [
  { category: 'Sleep Setup', item: 'Fold-flat mattress' },
  { category: 'Sleep Setup', item: '12V pump' },
  { category: 'Window Privacy', item: 'Blackout shades' },
];

describe('CampingChecklistModal Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <CampingChecklistModal
        isOpen={false}
        onClose={vi.fn()}
        vehicleName="Toyota Sienna"
        defaultItems={TEST_ITEMS}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders modal with items and progress when isOpen is true', () => {
    render(
      <CampingChecklistModal
        isOpen={true}
        onClose={vi.fn()}
        vehicleName="Toyota Sienna"
        defaultItems={TEST_ITEMS}
      />
    );

    expect(screen.getByText('Toyota Sienna Camping Checklist')).toBeInTheDocument();
    expect(screen.getByText('Fold-flat mattress')).toBeInTheDocument();
    expect(screen.getByText('12V pump')).toBeInTheDocument();
    expect(screen.getByText('Blackout shades')).toBeInTheDocument();
    expect(screen.getByText(/0 of 3 items \(0%\)/i)).toBeInTheDocument();
  });

  it('persists checkbox toggles in localStorage', () => {
    render(
      <CampingChecklistModal
        isOpen={true}
        onClose={vi.fn()}
        vehicleName="Toyota Sienna"
        defaultItems={TEST_ITEMS}
      />
    );

    const checkbox = screen.getByLabelText(/Fold-flat mattress/i);
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(screen.getByText(/1 of 3 items \(33%\)/i)).toBeInTheDocument();

    const stored = JSON.parse(
      localStorage.getItem('toyotawaits_camping_checklist_toyota_sienna') || '{}'
    );
    expect(stored['Sleep Setup:::Fold-flat mattress']).toBe(true);
  });

  it('filters by All vs Remaining items', () => {
    render(
      <CampingChecklistModal
        isOpen={true}
        onClose={vi.fn()}
        vehicleName="Toyota Sienna"
        defaultItems={TEST_ITEMS}
      />
    );

    const firstCheckbox = screen.getByLabelText(/Fold-flat mattress/i);
    fireEvent.click(firstCheckbox);

    // Filter by Remaining
    const remainingBtn = screen.getByRole('button', { name: /Remaining \(2\)/i });
    fireEvent.click(remainingBtn);

    expect(screen.queryByText('Fold-flat mattress')).not.toBeInTheDocument();
    expect(screen.getByText('12V pump')).toBeInTheDocument();
    expect(screen.getByText('Blackout shades')).toBeInTheDocument();

    // Switch back to All
    const allBtn = screen.getByRole('button', { name: /All \(3\)/i });
    fireEvent.click(allBtn);
    expect(screen.getByText('Fold-flat mattress')).toBeInTheDocument();
  });

  it('resets checklist when Reset button is clicked', () => {
    render(
      <CampingChecklistModal
        isOpen={true}
        onClose={vi.fn()}
        vehicleName="Toyota Sienna"
        defaultItems={TEST_ITEMS}
      />
    );

    const firstCheckbox = screen.getByLabelText(/Fold-flat mattress/i);
    fireEvent.click(firstCheckbox);
    expect(screen.getByText(/1 of 3 items/i)).toBeInTheDocument();

    const resetBtn = screen.getByRole('button', { name: /Reset Checklist/i });
    fireEvent.click(resetBtn);

    expect(screen.getByText(/0 of 3 items \(0%\)/i)).toBeInTheDocument();
    expect(firstCheckbox).not.toBeChecked();
  });

  it('triggers window.print when Print button is clicked', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});

    render(
      <CampingChecklistModal
        isOpen={true}
        onClose={vi.fn()}
        vehicleName="Toyota Sienna"
        defaultItems={TEST_ITEMS}
      />
    );

    const printBtn = screen.getByRole('button', { name: /Print \/ Save PDF/i });
    fireEvent.click(printBtn);

    expect(printSpy).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on backdrop click and Escape key press', () => {
    const onClose = vi.fn();
    render(
      <CampingChecklistModal
        isOpen={true}
        onClose={onClose}
        vehicleName="Toyota Sienna"
        defaultItems={TEST_ITEMS}
      />
    );

    // Backdrop click
    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);

    // Escape key
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
