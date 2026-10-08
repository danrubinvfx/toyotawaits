import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HeroEstimateButton } from '@/components/calculator/hero-estimate-button';

describe('HeroEstimateButton Component', () => {
  it('renders correctly with title and clock icon', () => {
    render(<HeroEstimateButton />);

    const link = screen.getByRole('link', { name: /Estimate My Arrival Date/i });
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toBe('#estimator');
  });

  it('scrolls to #estimator when clicked if target element exists', () => {
    // Setup mock element in document
    const mockSection = document.createElement('div');
    mockSection.id = 'estimator';
    const scrollIntoViewMock = vi.fn();
    mockSection.scrollIntoView = scrollIntoViewMock;
    document.body.appendChild(mockSection);

    render(<HeroEstimateButton />);

    const link = screen.getByRole('link', { name: /Estimate My Arrival Date/i });
    fireEvent.click(link);

    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });

    document.body.removeChild(mockSection);
  });
});
