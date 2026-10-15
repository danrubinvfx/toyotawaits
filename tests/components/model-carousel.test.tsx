import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModelCarousel } from '@/components/calculator/ModelCarousel';

describe('ModelCarousel Component', () => {
  it('renders all vehicle model options in a snap-scroll container', () => {
    render(<ModelCarousel selectedModel="rav4" />);

    expect(screen.getByRole('region', { name: /Vehicle model selection carousel/i })).toBeInTheDocument();
    expect(screen.getByTestId('model-carousel-container')).toHaveClass('overflow-x-auto');
    expect(screen.getByTestId('model-carousel-container')).toHaveClass('touch-pan-x');

    expect(screen.getByTestId('model-card-rav4')).toBeInTheDocument();
    expect(screen.getByTestId('model-card-sienna')).toBeInTheDocument();
    expect(screen.getByTestId('model-card-grand-highlander')).toBeInTheDocument();
  });

  it('renders explicit left and right desktop chevron navigation buttons', () => {
    render(<ModelCarousel selectedModel="rav4" />);

    const prevBtn = screen.getByTestId('carousel-prev-button');
    const nextBtn = screen.getByTestId('carousel-next-button');

    expect(prevBtn).toBeInTheDocument();
    expect(nextBtn).toBeInTheDocument();
    expect(prevBtn.className).toContain('hidden md:flex');
    expect(nextBtn.className).toContain('hidden md:flex');
  });

  it('triggers onSelectModel when a model card is clicked', () => {
    const onSelect = vi.fn();
    render(<ModelCarousel selectedModel="rav4" onSelectModel={onSelect} />);

    const siennaCard = screen.getByTestId('model-card-sienna');
    fireEvent.click(siennaCard);

    expect(onSelect).toHaveBeenCalledWith('sienna');
  });

  it('scrolls container when navigation buttons are clicked', () => {
    render(<ModelCarousel selectedModel="rav4" />);

    const container = screen.getByTestId('model-carousel-container');
    const scrollByMock = vi.fn();
    container.scrollBy = scrollByMock;

    Object.defineProperty(container, 'scrollWidth', { configurable: true, value: 1000 });
    Object.defineProperty(container, 'clientWidth', { configurable: true, value: 400 });
    Object.defineProperty(container, 'scrollLeft', { configurable: true, value: 50 });
    fireEvent.scroll(container);

    const nextBtn = screen.getByTestId('carousel-next-button');
    expect(nextBtn).not.toBeDisabled();
    fireEvent.click(nextBtn);

    expect(scrollByMock).toHaveBeenCalledWith(
      expect.objectContaining({
        behavior: 'smooth',
      })
    );
  });
});
