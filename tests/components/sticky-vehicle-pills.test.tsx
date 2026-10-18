import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { StickyVehiclePills } from '@/components/calculator/sticky-vehicle-pills';

describe('StickyVehiclePills Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders sticky container directly beneath navbar with proper classes and accessibility attributes', () => {
    const { container } = render(<StickyVehiclePills initialModel="rav4" />);

    const region = screen.getByRole('region', { name: /Popular models quick selector/i });
    expect(region).toBeInTheDocument();
    expect(region.className).toContain('sticky');
    expect(region.className).toContain('top-16');
    expect(region.className).toContain('z-40');
    expect(region.className).toContain('backdrop-blur-md');

    const tablist = screen.getByRole('tablist', { name: /Popular models list/i });
    expect(tablist).toBeInTheDocument();
    expect(tablist.className).toContain('overflow-x-auto');
    expect(tablist.className).toContain('no-scrollbar');
    expect(tablist.className).toContain('flex');
    expect(tablist.className).toContain('items-center');
    expect(tablist.className).toContain('gap-2');
  });

  it('renders all 6 popular model pills with correct initial active state', () => {
    render(<StickyVehiclePills initialModel="rav4" />);

    const rav4 = screen.getByTestId('quick-model-rav4');
    const corolla = screen.getByTestId('quick-model-corolla');
    const sienna = screen.getByTestId('quick-model-sienna');
    const gh = screen.getByTestId('quick-model-grand-highlander');
    const prius = screen.getByTestId('quick-model-prius');
    const lc = screen.getByTestId('quick-model-land-cruiser');
    const tacoma = screen.getByTestId('quick-model-tacoma');

    expect(rav4).toBeInTheDocument();
    expect(corolla).toBeInTheDocument();
    expect(sienna).toBeInTheDocument();
    expect(gh).toBeInTheDocument();
    expect(prius).toBeInTheDocument();
    expect(lc).toBeInTheDocument();
    expect(tacoma).toBeInTheDocument();

    expect(rav4).toHaveAttribute('aria-selected', 'true');
    expect(rav4.className).toContain('bg-amber-500');
    expect(corolla).toHaveAttribute('aria-selected', 'false');
    expect(sienna).toHaveAttribute('aria-selected', 'false');
    expect(sienna.className).toContain('bg-neutral-900');
  });

  it('renders Corolla subselector when Corolla is active and toggles variants', () => {
    const onSelectModel = vi.fn();
    render(<StickyVehiclePills initialModel="corolla" onSelectModel={onSelectModel} />);

    // Subselector must be rendered
    const subselector = screen.getByTestId('corolla-subselector');
    expect(subselector).toBeInTheDocument();

    const sedanBtn = screen.getByTestId('sub-corolla-sedan');
    const crossBtn = screen.getByTestId('sub-corolla-cross');
    expect(sedanBtn).toHaveAttribute('aria-selected', 'true');
    expect(crossBtn).toHaveAttribute('aria-selected', 'false');

    // Click Corolla Cross
    fireEvent.click(crossBtn);
    expect(onSelectModel).toHaveBeenCalledWith('corolla-cross');
    expect(crossBtn).toHaveAttribute('aria-selected', 'true');
    expect(sedanBtn).toHaveAttribute('aria-selected', 'false');

    // Click Corolla Sedan back
    fireEvent.click(sedanBtn);
    expect(onSelectModel).toHaveBeenCalledWith('corolla');
    expect(sedanBtn).toHaveAttribute('aria-selected', 'true');
  });

  it('dispatches toyotawait:model-change and calls onSelectModel when a pill is clicked', () => {
    const onSelectModel = vi.fn();
    const eventHandler = vi.fn();
    window.addEventListener('toyotawait:model-change', eventHandler);

    render(<StickyVehiclePills initialModel="rav4" onSelectModel={onSelectModel} />);

    const sienna = screen.getByTestId('quick-model-sienna');
    fireEvent.click(sienna);

    expect(onSelectModel).toHaveBeenCalledWith('sienna');
    expect(eventHandler).toHaveBeenCalled();
    const eventDetail = (eventHandler.mock.calls[0][0] as CustomEvent).detail;
    expect(eventDetail).toEqual({ model: 'sienna' });

    expect(sienna).toHaveAttribute('aria-selected', 'true');
    expect(sienna.className).toContain('bg-amber-500');

    window.removeEventListener('toyotawait:model-change', eventHandler);
  });

  it('synchronizes active pill when toyotawait:model-sync is received from external components', () => {
    render(<StickyVehiclePills initialModel="rav4" />);

    const prius = screen.getByTestId('quick-model-prius');
    const rav4 = screen.getByTestId('quick-model-rav4');

    expect(rav4).toHaveAttribute('aria-selected', 'true');
    expect(prius).toHaveAttribute('aria-selected', 'false');

    act(() => {
      window.dispatchEvent(
        new CustomEvent('toyotawait:model-sync', { detail: { model: 'prius-prime' } })
      );
    });

    expect(prius).toHaveAttribute('aria-selected', 'true');
    expect(prius.className).toContain('bg-amber-500');
    expect(rav4).toHaveAttribute('aria-selected', 'false');
  });
});
