import React, { act } from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import AdminOptOutPage from '@/app/admin-opt-out/page';

const mockPush = vi.fn();
let mockSearchParams = new URLSearchParams();
const mockRouter = { push: mockPush };

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => mockSearchParams,
}));

describe('Admin Opt-Out Page (/admin-opt-out)', () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie = '';
    mockSearchParams = new URLSearchParams();
    mockPush.mockClear();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('sets tw_admin_opt_out in localStorage and sets cookie on load', () => {
    render(<AdminOptOutPage />);

    expect(screen.getByText('Admin Opt-Out Enabled')).toBeInTheDocument();
    expect(localStorage.getItem('tw_admin_opt_out')).toBe('true');
    expect(document.cookie).toContain('tw_admin_opt_out=true');
    expect(document.cookie).toContain('opt_out=true');
  });

  it('allows disabling opt-out when clicking the toggle button', async () => {
    render(<AdminOptOutPage />);

    expect(screen.getByText('Admin Opt-Out Enabled')).toBeInTheDocument();
    const toggleButton = screen.getByRole('button', { name: /Disable Opt-Out/i });
    fireEvent.click(toggleButton);

    expect(await screen.findByText('Opt-Out Disabled')).toBeInTheDocument();
    expect(localStorage.getItem('tw_admin_opt_out')).toBeNull();
  });

  it('handles action=disable query parameter', () => {
    mockSearchParams = new URLSearchParams('action=disable');
    render(<AdminOptOutPage />);

    expect(screen.getByText('Opt-Out Disabled')).toBeInTheDocument();
    expect(localStorage.getItem('tw_admin_opt_out')).toBeNull();
  });
});
