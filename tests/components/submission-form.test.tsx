import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SubmissionForm, getTodayLocalDate } from '@/components/forms/submission-form';
import { getStoredSubmissions } from '@/lib/storage/submission-storage';

describe('SubmissionForm Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders the form with default vehicle model, province, 2026 model year, and today order date', () => {
    render(<SubmissionForm />);

    expect(screen.getByText('Submit Your Delivery Timeline')).toBeInTheDocument();
    expect(screen.getByLabelText(/Vehicle Model/i)).toHaveValue('rav4');
    expect(screen.getByLabelText(/Powertrain/i)).toHaveValue('hev');
    expect(screen.getByLabelText(/Province/i)).toHaveValue('ON');
    expect(screen.getByLabelText(/Model Year/i)).toHaveValue('2026');
    expect(screen.getByLabelText(/Order \/ Deposit Date/i)).toHaveValue(getTodayLocalDate());
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

  it('dynamically populates trims for Prius (HEV & PHEV) and Prius Prime', async () => {
    render(<SubmissionForm />);

    const modelSelect = screen.getByLabelText(/Vehicle Model/i);
    fireEvent.change(modelSelect, { target: { value: 'prius' } });

    // Prius HEV trims
    const powertrainSelect = screen.getByLabelText(/Powertrain/i);
    expect(powertrainSelect).toHaveValue('hev');
    const trimSelect = screen.getByLabelText(/Trim Level/i);
    expect(trimSelect.textContent).toContain('LE AWD');
    expect(trimSelect.textContent).toContain('XLE AWD');
    expect(trimSelect.textContent).toContain('Limited AWD');

    // Switch Prius to PHEV
    fireEvent.change(powertrainSelect, { target: { value: 'phev' } });
    expect(trimSelect.textContent).toContain('SE');
    expect(trimSelect.textContent).toContain('XSE');
    expect(trimSelect.textContent).toContain('XSE Premium');

    // Switch Model to Prius Prime
    fireEvent.change(modelSelect, { target: { value: 'prius-prime' } });
    expect(powertrainSelect).toHaveValue('phev');
    expect(trimSelect.textContent).toContain('SE');
    expect(trimSelect.textContent).toContain('XSE');
    expect(trimSelect.textContent).toContain('XSE Premium');
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

  it('submits valid form, stores edit key and edit token in localStorage, and opens success dialog', async () => {
    const mockResponse = {
      success: true,
      data: {
        id: 'mock-sub-12345',
        status: 'pending',
        waitDays: null,
        editKey: 'mock-secret-key-uuid-1234567890',
        editToken: 'mock-edit-token-12345',
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
      expect(screen.getAllByText('Save your private link to update this order later').length).toBeGreaterThan(0);
      expect(
        screen.getByText(/Thanks for contributing to the community! If ToyotaWaits helps you navigate your wait, consider supporting server costs on Ko-fi →/i)
      ).toBeInTheDocument();
    });

    // Check localStorage persistence
    const stored = getStoredSubmissions();
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe('mock-sub-12345');
    expect(stored[0].editKey).toBe('mock-secret-key-uuid-1234567890');
    expect(stored[0].editToken).toBe('mock-edit-token-12345');

    const pending = JSON.parse(localStorage.getItem('toyotawait_pending_submission') || '{}');
    expect(pending.editToken).toBe('mock-edit-token-12345');
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

  it('disables submit button and shows loading state while request is in-flight', async () => {
    let resolvePromise: (value: any) => void;
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    global.fetch = vi.fn().mockReturnValue(pendingPromise);

    render(<SubmissionForm />);

    const submitBtn = screen.getByRole('button', { name: /Submit Wait Time Anonymously/i });
    fireEvent.click(submitBtn);

    // Button should be disabled and showing loading spinner
    expect(submitBtn).toBeDisabled();
    expect(screen.getByText(/Recording Secure Submission.../i)).toBeInTheDocument();

    // Resolve the promise
    resolvePromise!({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          id: 'sub-done',
          status: 'pending',
          editKey: 'edit-key-done',
        },
      }),
    });

    await waitFor(() => {
      expect(screen.getByText('Timeline Recorded Successfully!')).toBeInTheDocument();
    });
  });

  it('debounces rapid double submissions to prevent duplicate entries', async () => {
    let resolvePromise: (value: any) => void;
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    global.fetch = vi.fn().mockReturnValue(pendingPromise);

    render(<SubmissionForm />);

    const submitBtn = screen.getByRole('button', { name: /Submit Wait Time Anonymously/i });

    // Fire multiple rapid clicks
    fireEvent.click(submitBtn);
    fireEvent.click(submitBtn);
    fireEvent.click(submitBtn);

    // Exactly 1 fetch request should be dispatched
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Clean up promise
    resolvePromise!({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          id: 'sub-single',
          status: 'pending',
          editKey: 'key-single',
        },
      }),
    });

    await waitFor(() => {
      expect(screen.getByText('Timeline Recorded Successfully!')).toBeInTheDocument();
    });
  });

  it('resets form fields and displays a clear success banner upon successful insert', async () => {
    const mockResponse = {
      success: true,
      data: {
        id: 'sub-reset-test',
        status: 'pending',
        editKey: 'reset-edit-key',
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as any);

    render(<SubmissionForm />);

    // Populate custom field values
    const cityInput = screen.getByLabelText(/City \(Optional\)/i);
    fireEvent.change(cityInput, { target: { value: 'Calgary' } });
    expect(cityInput).toHaveValue('Calgary');

    const notesInput = screen.getByLabelText(/Notes \/ Experience/i);
    fireEvent.change(notesInput, { target: { value: 'Seamless MSRP delivery' } });
    expect(notesInput).toHaveValue('Seamless MSRP delivery');

    const addonsInput = screen.getByLabelText(/Mandatory Add-ons/i);
    fireEvent.change(addonsInput, { target: { value: '450' } });
    expect(addonsInput).toHaveValue(450);

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /Submit Wait Time Anonymously/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Timeline Recorded Successfully!')).toBeInTheDocument();
    });

    // Close success modal to return to the form
    const doneBtn = screen.getByRole('button', { name: /Done & View Estimates/i });
    fireEvent.click(doneBtn);

    // Check success banner is rendered on the page
    expect(screen.getByTestId('success-banner')).toBeInTheDocument();
    expect(screen.getByText(/Your timeline has been added to our Canadian database/i)).toBeInTheDocument();

    // Check fields are reset
    expect(cityInput).toHaveValue('');
    expect(notesInput).toHaveValue('');
    expect(addonsInput).toHaveValue(0);
    expect(screen.getByLabelText(/Model Year/i)).toHaveValue('2026');
    expect(screen.getByLabelText(/Order \/ Deposit Date/i)).toHaveValue(getTodayLocalDate());
  });
});
