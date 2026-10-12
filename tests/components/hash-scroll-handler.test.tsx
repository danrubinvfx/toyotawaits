import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { HashScrollHandler } from '@/components/common/hash-scroll-handler';

describe('HashScrollHandler Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    window.location.hash = '';
  });

  it('scrolls into view smoothly when hash matches an element on mount', () => {
    window.location.hash = '#gear';

    const targetElem = document.createElement('section');
    targetElem.id = 'gear';
    const scrollMock = vi.fn();
    targetElem.scrollIntoView = scrollMock;
    document.body.appendChild(targetElem);

    render(<HashScrollHandler />);

    // Fast-forward past the 150ms timeout
    vi.advanceTimersByTime(150);

    expect(scrollMock).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });

    document.body.removeChild(targetElem);
  });

  it('does nothing when no hash is present in URL', () => {
    window.location.hash = '';

    const targetElem = document.createElement('section');
    targetElem.id = 'gear';
    const scrollMock = vi.fn();
    targetElem.scrollIntoView = scrollMock;
    document.body.appendChild(targetElem);

    render(<HashScrollHandler />);

    vi.advanceTimersByTime(200);

    expect(scrollMock).not.toHaveBeenCalled();

    document.body.removeChild(targetElem);
  });
});
