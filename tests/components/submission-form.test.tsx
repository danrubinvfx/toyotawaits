import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SubmissionForm } from '@/components/forms/submission-form';
import { getStoredSubmissions } from '@/lib/storage/submission-storage';

describe('SubmissionForm Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders the form with default vehicle model and province', () => {
    render(<SubmissionForm />);

    expect(screen.getByText('Submit Your Delivery Timeline')).toBeInTheDocument();
    expect(screen.getByLabelText(/Vehicle Model/i)).toHaveValue('rav4');
    expect(screen.getByLabelText(/Powertrain/i)).toHaveValue('hev');
    expect(screen.getByLabelText(/Province/i)).toHaveValue('ON');
  });

  it('updates powertrains and trims when Model changes to Sienna', async () => {
    render(<SubmissionForm />);

    const modelSelect = screen.getByLabelText(/Vehicle Model/i);
    fireEvent.change(modelSelect, { target: { value: 'sienna' } });

    // Powertrain should reflect Sienna's HEV
    const powertrainSelect = screen.getByLabelText(/Powertrain/i);
    expect(powertrainSelect).toHaveValue('hev');

    // Trims should show Sienna trims (e.g. 8-Passenger)
    const trimSelect = screen.getByLabelText(/Trim Level/i);
    expect(trimSelect.textContent).toContain('LE FWD (8-Passenger)');
  });

  it('toggles delivery status and reveals delivery date picker', () => {
    render(<SubmissionForm />);

    // Initially "Still Waiting" is selected, delivery date is hidden
    expect(screen.queryByLabelText(/Delivery Date/i)).not.toBeInTheDocument();

    // Click "Vehicle Received"
    const receivedBtn = screen.getByText(/Vehicle Received/i);
    fireEvent.click(receivedBtn);

    // Delivery date should now be visible
    expect(screen.getByLabelText(/Delivery Date/i)).toBeInTheDocument();
  });

  it('submits valid form, stores edit key in localStorage, and opens success dialog', async () => {
    const mockResponse = {
      success: true,
      data: {
        id: 'mock-sub-12345',
        status: 'pending',
        waitDays: null,
        editKey: 'mock-secret-key-uuid-1234567890',
        message: 'Submission recorded anonymously.',
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as any);

    render(<SubmissionForm />);

    const submitBtn = screen.getByRole('button', { name: /Submit Wait Time Anonymously/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Timeline Recorded Successfully!')).toBeInTheDocument();
      expect(screen.getByText('mock-secret-key-uuid-1234567890')).toBeInTheDocument();
    });

    // Check localStorage persistence
    const stored = getStoredSubmissions();
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe('mock-sub-12345');
    expect(stored[0].editKey).toBe('mock-secret-key-uuid-1234567890');
  });

  it('displays error banner if API returns error response', async () => {
    const mockError = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed for submission.',
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => mockError,
    } as any);

    render(<SubmissionForm />);

    const submitBtn = screen.getByRole('button', { name: /Submit Wait Time Anonymously/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Unable to submit timeline')).toBeInTheDocument();
      expect(screen.getByText('Validation failed for submission.')).toBeInTheDocument();
    });
  });
});
