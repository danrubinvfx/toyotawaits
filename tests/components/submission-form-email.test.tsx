import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SubmissionForm } from '@/components/forms/submission-form';
import { MarketProvider } from '@/context/MarketContext';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

describe('SubmissionForm - Queue Tracking Email Card', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the optional email card with required copy, placeholder, and CASL micro-consent', () => {
    render(
      <MarketProvider initialMarket="CA">
        <SubmissionForm />
      </MarketProvider>
    );

    // Card header
    expect(screen.getByText(/Track Queue & Receive Monthly Benchmark Updates/i)).toBeInTheDocument();

    // Subtitle
    expect(
      screen.getByText(
        /Optional: Receive a monthly 1-tap status check-in, updated delivery estimate, and local allocation drop alerts while you wait\./i
      )
    ).toBeInTheDocument();

    // Field placeholder
    const emailInput = screen.getByPlaceholderText('name@example.com (optional)');
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');

    // Micro-consent line
    expect(
      screen.getByText(
        /Includes monthly status check-ins and unreserved lot drop alerts\. 1-click unsubscribe anytime per CASL\./i
      )
    ).toBeInTheDocument();
  });

  it('validates email format if non-empty and displays error message', async () => {
    render(
      <MarketProvider initialMarket="CA">
        <SubmissionForm />
      </MarketProvider>
    );

    const emailInput = screen.getByPlaceholderText('name@example.com (optional)');
    fireEvent.change(emailInput, { target: { value: 'not-an-email' } });

    const submitBtn = screen.getByRole('button', { name: /Submit Wait Time Anonymously/i });
    const form = submitBtn.closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('submits email and reminder_opt_in when a valid email is provided', async () => {
    let capturedBody: any = null;
    global.fetch = vi.fn().mockImplementation(async (url: string, opts?: any) => {
      if (opts?.method === 'POST') {
        capturedBody = JSON.parse(opts.body);
        return {
          ok: true,
          json: async () => ({
            success: true,
            data: {
              id: 'test-id-1',
              status: 'pending',
              currentStage: 'deposit_placed',
              waitDays: null,
              editKey: 'secret-key-12345',
              editToken: 'token-12345',
            },
          }),
        };
      }
      return { ok: true, json: async () => ({}) };
    });

    render(
      <MarketProvider initialMarket="CA">
        <SubmissionForm />
      </MarketProvider>
    );

    const emailInput = screen.getByPlaceholderText('name@example.com (optional)');
    fireEvent.change(emailInput, { target: { value: 'buyer@example.ca' } });

    const submitBtn = screen.getByRole('button', { name: /Submit Wait Time Anonymously/i });
    const form = submitBtn.closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(capturedBody).not.toBeNull();
      expect(capturedBody.email).toBe('buyer@example.ca');
      expect(capturedBody.reminder_opt_in).toBe(true);
    });
  });

  it('passes validation when email is left empty without forcing email submission', async () => {
    let capturedBody: any = null;
    global.fetch = vi.fn().mockImplementation(async (url: string, opts?: any) => {
      if (opts?.method === 'POST') {
        capturedBody = JSON.parse(opts.body);
        return {
          ok: true,
          json: async () => ({
            success: true,
            data: {
              id: 'test-id-2',
              status: 'pending',
              currentStage: 'deposit_placed',
              waitDays: null,
              editKey: 'secret-key-67890',
              editToken: 'token-67890',
            },
          }),
        };
      }
      return { ok: true, json: async () => ({}) };
    });

    render(
      <MarketProvider initialMarket="CA">
        <SubmissionForm />
      </MarketProvider>
    );

    const emailInput = screen.getByPlaceholderText('name@example.com (optional)');
    expect(emailInput).toHaveValue('');

    const submitBtn = screen.getByRole('button', { name: /Submit Wait Time Anonymously/i });
    const form = submitBtn.closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(capturedBody).not.toBeNull();
      expect(capturedBody.email).toBeUndefined();
      expect(capturedBody.reminder_opt_in).toBe(false);
    });
  });
});
