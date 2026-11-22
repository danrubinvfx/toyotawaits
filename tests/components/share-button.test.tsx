import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ShareButton } from '@/components/ui/ShareButton';
import { GearCard, type GearCardItem } from '@/components/gear/GearCard';
import * as analytics from '@/lib/analytics';

describe('ShareButton Component', () => {
  const originalShare = navigator.share;
  const originalClipboard = navigator.clipboard;

  beforeEach(() => {
    vi.restoreAllMocks();
    window.history.pushState({}, '', '/guides/toyota-rav4-must-have-accessories');
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'share', {
      value: originalShare,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true,
      writable: true,
    });
    vi.useRealTimers();
  });

  it('invokes navigator.share on mobile with canonical URL and anchorId and tracks native share', async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined);
    const trackSpy = vi.spyOn(analytics, 'trackGuideOrGearShared').mockImplementation(() => {});

    Object.defineProperty(navigator, 'share', {
      value: shareMock,
      configurable: true,
      writable: true,
    });

    render(
      <ShareButton
        title="TuxMat Custom Floor Liners"
        text="Full sidewall coverage for Canadian winters"
        anchorId="tuxmat-rav4"
        variant="card"
      />
    );

    const btn = screen.getByRole('button', { name: 'Share TuxMat Custom Floor Liners' });
    await act(async () => {
      fireEvent.click(btn);
    });

    expect(shareMock).toHaveBeenCalledTimes(1);
    expect(shareMock).toHaveBeenCalledWith({
      title: 'TuxMat Custom Floor Liners',
      text: 'Full sidewall coverage for Canadian winters',
      url: `${window.location.origin}/guides/toyota-rav4-must-have-accessories#tuxmat-rav4`,
    });
    expect(trackSpy).toHaveBeenCalledWith({
      title: 'TuxMat Custom Floor Liners',
      anchorId: 'tuxmat-rav4',
      method: 'native',
    });
  });

  it('swallows user AbortError silently when native share is cancelled', async () => {
    const abortError = new Error('Share cancelled');
    abortError.name = 'AbortError';
    const shareMock = vi.fn().mockRejectedValue(abortError);
    const trackSpy = vi.spyOn(analytics, 'trackGuideOrGearShared').mockImplementation(() => {});

    Object.defineProperty(navigator, 'share', {
      value: shareMock,
      configurable: true,
      writable: true,
    });

    render(<ShareButton title="RAV4 Guide" variant="header" />);

    const btn = screen.getByRole('button', { name: 'Share RAV4 Guide' });
    await act(async () => {
      fireEvent.click(btn);
    });

    expect(shareMock).toHaveBeenCalledTimes(1);
    expect(trackSpy).not.toHaveBeenCalled();
  });

  it('falls back to clipboard and displays Copied! feedback for 2 seconds on desktop', async () => {
    vi.useFakeTimers();
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    const trackSpy = vi.spyOn(analytics, 'trackGuideOrGearShared').mockImplementation(() => {});

    Object.defineProperty(navigator, 'share', {
      value: undefined,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
      writable: true,
    });

    render(<ShareButton title="Toyota DIY Maintenance Guide" variant="header" />);

    expect(screen.getByText('Share')).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: 'Share Toyota DIY Maintenance Guide' });

    await act(async () => {
      fireEvent.click(btn);
    });

    expect(writeTextMock).toHaveBeenCalledWith(
      `${window.location.origin}/guides/toyota-rav4-must-have-accessories`
    );
    expect(screen.getByText('Copied!')).toBeInTheDocument();
    expect(trackSpy).toHaveBeenCalledWith({
      title: 'Toyota DIY Maintenance Guide',
      anchorId: undefined,
      method: 'clipboard',
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.queryByText('Copied!')).toBeNull();
    expect(screen.getByText('Share')).toBeInTheDocument();
  });

  it('renders Copied! tooltip badge on card variant when copied on desktop', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(navigator, 'share', {
      value: undefined,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
      writable: true,
    });

    render(
      <ShareButton
        title="NOCO Boost GB40"
        anchorId="noco-gb40"
        variant="card"
      />
    );

    const btn = screen.getByRole('button', { name: 'Share NOCO Boost GB40' });
    await act(async () => {
      fireEvent.click(btn);
    });

    expect(writeTextMock).toHaveBeenCalledWith(
      `${window.location.origin}/guides/toyota-rav4-must-have-accessories#noco-gb40`
    );
    expect(screen.getByRole('status')).toHaveTextContent('Copied!');
  });
});

describe('GearCard Anchor ID & Share Button Integration', () => {
  const sampleGear: GearCardItem = {
    id: 'gear-tuxmat-rav4',
    slug: 'tuxmat-rav4',
    title: 'TuxMat Custom Floor Liners',
    category: 'Interior Protection',
    description: 'Laser-measured all-weather liners with full dead-pedal coverage.',
    asin: 'B07XYZ1234',
  };

  it('renders outer container with id={item.id}, scroll-mt-24, and card ShareButton', () => {
    render(<GearCard item={sampleGear} />);

    const card = screen.getByTestId('checklist-item-tuxmat-rav4');
    expect(card).toHaveAttribute('id', 'gear-tuxmat-rav4');
    expect(card.className).toContain('scroll-mt-24');

    const shareBtn = screen.getByRole('button', { name: 'Share TuxMat Custom Floor Liners' });
    expect(shareBtn).toBeInTheDocument();
  });
});
