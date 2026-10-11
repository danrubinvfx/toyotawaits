import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModCard, getThemedCategoryIcon } from '@/components/delivery-prep/mod-card';
import { BatteryCharging, Luggage, Zap, Package, Layers, ShieldCheck } from 'lucide-react';

describe('ModCard Component', () => {
  const sampleItem = {
    id: 'prod-sample-dashcam',
    slug: 'sample-dashcam',
    title: 'OEM 4K Integrated Dashcam',
    category: 'Electronics & Safety',
    priceEst: 'Saves ~$350+ vs dealer install',
    whyBuy: 'Replaces factory mirror shroud cleanly.',
    image: '/images/accessories/fitcamx-rav4.png',
    asin: 'B09GLVMB76',
    affiliateUrl: '/out/sample-dashcam',
    badge: 'Recommended',
    compatibility: 'TSS 2.5+ Plug & Play',
    youtubeVideoId: 'sampleVid123',
    videoTitle: 'Dashcam Installation Guide',
  };

  it('renders correctly with title, badges, price, and outbound link', () => {
    render(<ModCard item={sampleItem} />);

    expect(screen.getByText('OEM 4K Integrated Dashcam')).toBeDefined();
    expect(screen.getByText('Recommended')).toBeDefined();
    expect(screen.getByText('TSS 2.5+ Plug & Play')).toBeDefined();
    expect(screen.getByText('Saves ~$350+ vs dealer install')).toBeDefined();
    expect(screen.getByText('Replaces factory mirror shroud cleanly.')).toBeDefined();

    const link = screen.getByRole('link', { name: /View on Amazon/i });
    expect(link.getAttribute('href')).toBe('/out/sample-dashcam');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toContain('noopener');
    expect(link.getAttribute('rel')).toContain('noreferrer');
    expect(link.getAttribute('rel')).toContain('nofollow');
    expect(link.getAttribute('rel')).toContain('sponsored');
  });

  it('renders graceful themed SVG icon fallback when image is omitted or empty', () => {
    const itemWithoutImg = {
      ...sampleItem,
      slug: 'item-no-img',
      image: '',
      imageSrc: undefined,
      category: 'Cargo & Utility',
    };

    render(<ModCard item={itemWithoutImg} />);

    // Should NOT render an img tag
    expect(screen.queryByRole('img')).toBeNull();
    // Should render the fallback container
    const fallbackBox = screen.getByTestId('fallback-icon-item-no-img');
    expect(fallbackBox).toBeDefined();
  });

  it('switches to fallback SVG icon when image load errors out', () => {
    render(<ModCard item={sampleItem} />);

    const img = screen.getByAltText('OEM 4K Integrated Dashcam');
    expect(img).toBeDefined();

    // Trigger onError on the image
    fireEvent.error(img);

    // Fallback icon container should now be rendered
    expect(screen.getByTestId('fallback-icon-sample-dashcam')).toBeDefined();
    expect(screen.queryByAltText('OEM 4K Integrated Dashcam')).toBeNull();
  });

  it('handles checkbox toggle events when enabled', () => {
    const onToggleMock = vi.fn();
    render(<ModCard item={sampleItem} isChecked={false} onToggle={onToggleMock} showCheckbox={true} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.getAttribute('aria-checked')).toBe('false');

    fireEvent.click(checkbox);
    expect(onToggleMock).toHaveBeenCalledWith('sample-dashcam');
  });

  it('renders external video walkthrough link button when youtubeVideoId is present', () => {
    render(<ModCard item={sampleItem} />);

    const videoLink = screen.getByText(/Watch Install Walkthrough ↗/i);
    expect(videoLink).toBeDefined();

    const linkAnchor = videoLink.closest('a');
    expect(linkAnchor).toBeInTheDocument();
    expect(linkAnchor?.getAttribute('href')).toBe('https://www.youtube.com/watch?v=sampleVid123');
    expect(linkAnchor?.getAttribute('target')).toBe('_blank');
    expect(linkAnchor?.getAttribute('rel')).toContain('noopener');

    // Confirm no iframe element is present
    expect(document.querySelector('iframe')).toBeNull();
  });

  it('getThemedCategoryIcon correctly assigns contextual Lucide icons', () => {
    expect(getThemedCategoryIcon('Battery & Emergency', 'NOCO Boost')).toBe(BatteryCharging);
    expect(getThemedCategoryIcon('Cargo & Utility', 'Roof Crossbars')).toBe(Luggage);
    expect(getThemedCategoryIcon('Electronics & Safety', 'Mirror Dashcam')).toBe(Zap);
    expect(getThemedCategoryIcon('Organization', 'Console Tray')).toBe(Package);
    expect(getThemedCategoryIcon('Interior Protection', 'All-Weather Liners')).toBe(Layers);
    expect(getThemedCategoryIcon('Other', 'Generic Item')).toBe(ShieldCheck);
  });
});
