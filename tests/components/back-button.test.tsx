import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BackButton } from '@/components/common/back-button';

const mockBack = vi.fn();
const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    back: mockBack,
    push: mockPush,
  }),
}));

describe('BackButton Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders default label and navigates back with browser history', () => {
    // Simulate window.history.length > 1
    Object.defineProperty(window, 'history', {
      writable: true,
      value: { length: 3 },
    });

    render(<BackButton />);
    const btn = screen.getByRole('button', { name: /← Back to Wait Time Tracker/i });
    expect(btn).toBeInTheDocument();

    fireEvent.click(btn);
    expect(mockBack).toHaveBeenCalledTimes(1);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('falls back to router.push("/") when history length is <= 1', () => {
    Object.defineProperty(window, 'history', {
      writable: true,
      value: { length: 1 },
    });

    render(<BackButton />);
    const btn = screen.getByRole('button', { name: /← Back to Wait Time Tracker/i });
    fireEvent.click(btn);

    expect(mockBack).not.toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('renders custom label and custom className', () => {
    render(<BackButton label="← Return to Tracker" className="custom-class" />);
    const btn = screen.getByRole('button', { name: /← Return to Tracker/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass('custom-class');
  });
});
