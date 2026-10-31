import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BenchmarkMyOrderWidget } from '@/components/estimator/BenchmarkMyOrderWidget';

describe('BenchmarkMyOrderWidget Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders State A with 2 input fields, title, subtitle, and CTA button', () => {
    render(
      <BenchmarkMyOrderWidget
        modelSlug="rav4"
        modelName="Toyota RAV4"
        medianWaitDays={240}
      />
    );

    // Header check
    expect(screen.getByText('Where Do You Stand in Line?')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Enter your deposit date to benchmark your delivery window against active Canadian allocations.'
      )
    ).toBeInTheDocument();

    // Inputs check
    const depositInput = screen.getByLabelText('Deposit Date') as HTMLInputElement;
    expect(depositInput).toBeInTheDocument();
    expect(depositInput.type).toBe('date');
    expect(depositInput.required).toBe(true);

    const todayIso = new Date().toISOString().split('T')[0];
    expect(depositInput.max).toBe(todayIso);

    const provinceSelect = screen.getByLabelText('Province') as HTMLSelectElement;
    expect(provinceSelect).toBeInTheDocument();
    expect(provinceSelect.value).toBe('BC');

    // CTA button check
    const ctaButton = screen.getByRole('button', { name: /Benchmark My Delivery Window →/i });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveClass('bg-amber-500');
  });

  it('transitions to State B upon submission, rendering estimated delivery window and queue position', async () => {
    const mockPostResponse = {
      success: true,
      data: {
        submissionId: 'test-sub-1234',
        editKey: 'test-edit-key-1234567890',
        queuePosition: 4,
        estimatedDeliveryDate: '2027-02-15',
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockPostResponse,
    } as any);

    render(
      <BenchmarkMyOrderWidget
        modelSlug="rav4"
        modelName="Toyota RAV4"
        medianWaitDays={240}
      />
    );

    const depositInput = screen.getByLabelText('Deposit Date');
    fireEvent.change(depositInput, { target: { value: '2026-01-15' } });

    const provinceSelect = screen.getByLabelText('Province');
    fireEvent.change(provinceSelect, { target: { value: 'ON' } });

    const ctaButton = screen.getByRole('button', { name: /Benchmark My Delivery Window →/i });
    fireEvent.click(ctaButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/submissions',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            modelSlug: 'rav4',
            orderDate: '2026-01-15',
            province: 'ON',
            country: 'CA',
            medianWaitDays: 240,
          }),
        })
      );
    });

    // Check State B payoff banner
    await waitFor(() => {
      expect(screen.getByText(/Estimated Delivery:/i)).toBeInTheDocument();
      expect(
        screen.getByText('You are approximately #4 in the active ON queue for Toyota RAV4.')
      ).toBeInTheDocument();
    });

    // Progressive Enrichment Section
    expect(screen.getByText('Want a tighter window? Add your trim and pricing:')).toBeInTheDocument();
    expect(screen.getByLabelText(/Trim Level/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'MSRP' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mandatory Dealer Add-ons / ADM ($)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save Details' })).toBeInTheDocument();
  });

  it('allows progressive enrichment and saves trim and ADM markup details via PATCH', async () => {
    const mockPostResponse = {
      success: true,
      data: {
        submissionId: 'sub-uuid-abc-123',
        editKey: 'secret-key-1234567890',
        queuePosition: 2,
        estimatedDeliveryDate: '2026-11-20',
      },
    };

    const mockPatchResponse = {
      success: true,
      data: {
        id: 'sub-uuid-abc-123',
        status: 'pending',
      },
    };

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPostResponse,
      } as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPatchResponse,
      } as any);

    render(
      <BenchmarkMyOrderWidget
        modelSlug="rav4"
        modelName="Toyota RAV4"
        medianWaitDays={240}
      />
    );

    const depositInput = screen.getByLabelText('Deposit Date');
    fireEvent.change(depositInput, { target: { value: '2026-03-01' } });

    const ctaButton = screen.getByRole('button', { name: /Benchmark My Delivery Window →/i });
    fireEvent.click(ctaButton);

    await waitFor(() => {
      expect(screen.getByText(/Estimated Delivery:/i)).toBeInTheDocument();
    });

    // Switch to ADM markup
    const admBtn = screen.getByRole('button', { name: 'Mandatory Dealer Add-ons / ADM ($)' });
    fireEvent.click(admBtn);

    const admInput = screen.getByPlaceholderText(/e\.g\. 1500/i);
    fireEvent.change(admInput, { target: { value: '1500' } });

    // Select a trim
    const trimSelect = screen.getByLabelText(/Trim Level/i);
    fireEvent.change(trimSelect, { target: { value: '30000000-0000-4000-8000-000000000002' } });

    // Toggle trade-in
    const tradeInCheckbox = screen.getByRole('checkbox');
    fireEvent.click(tradeInCheckbox);

    // Save Details
    const saveBtn = screen.getByRole('button', { name: 'Save Details' });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/submissions/sub-uuid-abc-123',
        expect.objectContaining({
          method: 'PATCH',
          headers: expect.objectContaining({
            'x-edit-key': 'secret-key-1234567890',
          }),
          body: JSON.stringify({
            id: 'sub-uuid-abc-123',
            editKey: 'secret-key-1234567890',
            trimId: '30000000-0000-4000-8000-000000000002',
            admMarkup: 1500,
            dealerMarkupAdm: 1500,
            pricing: 'above_msrp',
            tradeInRequired: true,
          }),
        })
      );
    });

    // Success feedback
    await waitFor(() => {
      expect(screen.getByText(/Details saved! Your benchmark has been calibrated/i)).toBeInTheDocument();
    });
  });
});
