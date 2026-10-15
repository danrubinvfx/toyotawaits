import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import EditSubmissionPage from '@/app/edit/[token]/page';

const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

describe('EditSubmissionPage - Invalid / Expired Token View', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders the Invalid or Expired Link state with Submit New Wait Time and Clear Saved Order buttons', async () => {
    // Mock fetch returning 404
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Submission not found or invalid edit token.' },
      }),
    } as any);

    const params = Promise.resolve({ token: 'non-existent-token' });
    await React.act(async () => {
      render(
        <React.Suspense fallback={<div>Loading...</div>}>
          <EditSubmissionPage params={params} />
        </React.Suspense>
      );
    });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Invalid or Expired Link/i })).toBeInTheDocument();
    });

    // Check primary button: Submit New Wait Time
    const submitBtn = screen.getByRole('link', { name: /Submit New Wait Time/i });
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toHaveAttribute('href', '/#submit');

    // Check secondary button: Clear Saved Order & Go Home
    const clearBtn = screen.getByRole('button', { name: /Clear Saved Order & Go Home/i });
    expect(clearBtn).toBeInTheDocument();
  });

  it('clears saved order from local storage and redirects to "/" when Clear Saved Order is clicked', async () => {
    localStorage.setItem('toyotawaits_submission', JSON.stringify({ id: 'bad-token', editToken: 'bad-token' }));
    localStorage.setItem('toyotawait_pending_submission', JSON.stringify({ id: 'bad-token', editToken: 'bad-token' }));
    localStorage.setItem('toyota_submission_token', 'bad-token');
    localStorage.setItem('toyota_edit_token', 'bad-token');

    let eventFired = false;
    window.addEventListener('toyotawaits:submission-updated', () => {
      eventFired = true;
    });

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Order was removed from active queue.' },
      }),
    } as any);

    const params = Promise.resolve({ token: 'bad-token' });
    await React.act(async () => {
      render(
        <React.Suspense fallback={<div>Loading...</div>}>
          <EditSubmissionPage params={params} />
        </React.Suspense>
      );
    });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Invalid or Expired Link/i })).toBeInTheDocument();
    });

    const clearBtn = screen.getByRole('button', { name: /Clear Saved Order & Go Home/i });
    fireEvent.click(clearBtn);

    // Verify localStorage is wiped
    expect(localStorage.getItem('toyotawaits_submission')).toBeNull();
    expect(localStorage.getItem('toyotawait_pending_submission')).toBeNull();
    expect(localStorage.getItem('toyota_submission_token')).toBeNull();
    expect(localStorage.getItem('toyota_edit_token')).toBeNull();

    // Verify event dispatched and router navigated home
    expect(eventFired).toBe(true);
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
