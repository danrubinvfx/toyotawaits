import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UpdateStatusPage from '@/app/update-status/[token]/page';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

describe('1-Click Status Update Cockpit (/update-status/[token])', () => {
  const sampleToken = 'e3a1f94c2560b7194f1c93a8e49d21c430e84b9f1234abcd';

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading state initially', async () => {
    // Hang fetch to check loading state
    global.fetch = vi.fn().mockImplementation(() => new Promise(() => {}));

    await React.act(async () => {
      render(
        <React.Suspense fallback={<div>Loading fallback...</div>}>
          <UpdateStatusPage params={Promise.resolve({ token: sampleToken })} />
        </React.Suspense>
      );
    });

    expect(screen.getByText(/Loading your queue tracking status/i)).toBeInTheDocument();
  });

  it('renders error view when token is invalid or expired', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        error: { message: 'Order submission not found or link has expired.' },
      }),
    });

    await React.act(async () => {
      render(
        <React.Suspense fallback={<div>Loading fallback...</div>}>
          <UpdateStatusPage params={Promise.resolve({ token: 'bad-token' })} />
        </React.Suspense>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Unable to Find Order')).toBeInTheDocument();
      expect(screen.getByText(/not found or link has expired/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Return to Live Tracker/i })).toBeInTheDocument();
    });
  });

  it('renders vehicle cockpit with order details and 5 milestone buttons', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          id: 'sub-1',
          token: sampleToken,
          orderDate: '2026-02-15',
          model: 'Toyota RAV4',
          modelSlug: 'rav4',
          province: 'BC',
          status: 'pending',
          stage: 'deposit_placed',
          queuePosition: 14,
          provincialMedianDays: 240,
        },
      }),
    });

    await React.act(async () => {
      render(
        <React.Suspense fallback={<div>Loading fallback...</div>}>
          <UpdateStatusPage params={Promise.resolve({ token: sampleToken })} />
        </React.Suspense>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('2026-02-15')).toBeInTheDocument();
      expect(screen.getAllByText('Toyota RAV4').length).toBeGreaterThan(0);
      expect(screen.getAllByText('BC').length).toBeGreaterThan(0);
    });

    // Milestone buttons
    expect(screen.getByText('Still Waiting in Queue')).toBeInTheDocument();
    expect(screen.getByText('Build Assigned / VIN Created')).toBeInTheDocument();
    expect(screen.getByText('Vehicle In Transit')).toBeInTheDocument();
    expect(screen.getByText('Delivered!')).toBeInTheDocument();
    expect(screen.getByText('Canceled / Bought Elsewhere')).toBeInTheDocument();
  });

  it('updates milestone on 1-click and reveals revised queue position reward and allocation bridge', async () => {
    global.fetch = vi.fn().mockImplementation(async (url: string, opts?: any) => {
      if (!opts || opts.method === 'GET' || !opts.method) {
        return {
          ok: true,
          json: async () => ({
            success: true,
            data: {
              id: 'sub-1',
              token: sampleToken,
              orderDate: '2026-02-15',
              model: 'Toyota RAV4',
              modelSlug: 'rav4',
              province: 'BC',
              status: 'pending',
              stage: 'deposit_placed',
              queuePosition: 14,
              provincialMedianDays: 240,
            },
          }),
        };
      }

      // POST update
      return {
        ok: true,
        json: async () => ({
          success: true,
          data: {
            id: 'sub-1',
            token: sampleToken,
            status: 'pending',
            stage: 'build_assigned',
            queuePosition: 12,
            provincialMedianDays: 240,
            model: 'Toyota RAV4',
            modelSlug: 'rav4',
            province: 'BC',
          },
        }),
      };
    });

    await React.act(async () => {
      render(
        <React.Suspense fallback={<div>Loading fallback...</div>}>
          <UpdateStatusPage params={Promise.resolve({ token: sampleToken })} />
        </React.Suspense>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Build Assigned / VIN Created')).toBeInTheDocument();
    });

    // Click 1-tap milestone button
    await React.act(async () => {
      fireEvent.click(screen.getByText('Build Assigned / VIN Created'));
    });

    await waitFor(() => {
      expect(screen.getByText('Status Updated Successfully!')).toBeInTheDocument();
      expect(screen.getByText(/#12/i)).toBeInTheDocument();
      expect(screen.getByText(/~240/i)).toBeInTheDocument();
      const allocationButton = screen.getByRole('link', { name: /View Live Local Allocations for Toyota RAV4/i });
      expect(allocationButton).toBeInTheDocument();
      expect(allocationButton).toHaveAttribute('href', '/inventory?model=rav4');
    });
  });
});
