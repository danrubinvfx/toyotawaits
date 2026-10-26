import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModCard, getThemedCategoryIcon } from '@/components/delivery-prep/mod-card';
import { MarketProvider } from '@/context/MarketContext';
import { GearCard } from '@/components/gear/GearCard';
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
    expect(link.getAttribute('href')).toBe('https://www.amazon.ca/dp/B09GLVMB76?tag=toyotawaits-20');
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

  it('opens on-site video modal when Watch Video Guide button is clicked', () => {
    render(<ModCard item={sampleItem} />);

    const openBtn = screen.getByRole('button', { name: /Watch Video Guide/i });
    expect(openBtn).toBeInTheDocument();

    // Click button to open video modal
    fireEvent.click(openBtn);

    // YouTube embed iframe inside modal is now present with autoplay and rel=0
    const iframe = screen.getByTitle('Dashcam Installation Guide');
    expect(iframe).toBeInTheDocument();
    expect(iframe.getAttribute('src')).toBe('https://www.youtube-nocookie.com/embed/sampleVid123?autoplay=1&rel=0');

    // Close button dismisses modal
    const closeBtn = screen.getByTestId('video-modal-close');
    fireEvent.click(closeBtn);
    expect(screen.queryByTitle('Dashcam Installation Guide')).toBeNull();
  });

  it('getThemedCategoryIcon correctly assigns contextual Lucide icons', () => {
    expect(getThemedCategoryIcon('Battery & Emergency', 'NOCO Boost')).toBe(BatteryCharging);
    expect(getThemedCategoryIcon('Cargo & Utility', 'Roof Crossbars')).toBe(Luggage);
    expect(getThemedCategoryIcon('Electronics & Safety', 'Mirror Dashcam')).toBe(Zap);
    expect(getThemedCategoryIcon('Organization', 'Console Tray')).toBe(Package);
    expect(getThemedCategoryIcon('Interior Protection', 'All-Weather Liners')).toBe(Layers);
    expect(getThemedCategoryIcon('Other', 'Generic Item')).toBe(ShieldCheck);
  });

  it('wraps the product preview image in an Amazon affiliate anchor with required compliance attributes and classes', () => {
    render(<ModCard item={sampleItem} />);

    const imageLink = screen.getByRole('link', { name: `View ${sampleItem.title} on Amazon` });
    expect(imageLink).toBeInTheDocument();
    expect(imageLink.getAttribute('href')).toContain('amazon.ca');
    expect(imageLink.getAttribute('href')).toContain('B09GLVMB76');
    expect(imageLink.getAttribute('target')).toBe('_blank');
    expect(imageLink.getAttribute('rel')).toBe('sponsored noopener noreferrer nofollow');
    expect(imageLink).toHaveClass('cursor-pointer');
    expect(imageLink).toHaveClass('transition-opacity');
    expect(imageLink).toHaveClass('hover:opacity-90');
    expect(imageLink).toHaveClass('active:opacity-80');
  });

  it('prevents link navigation when user is dragging or swiping the carousel', () => {
    render(<ModCard item={sampleItem} isDragging={true} />);

    const imageLink = screen.getByRole('link', { name: `View ${sampleItem.title} on Amazon` });
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    imageLink.dispatchEvent(clickEvent);

    expect(clickEvent.defaultPrevented).toBe(true);
  });

  it('respects country context for Canada (Amazon.ca) and United States (Amazon.com)', () => {
    const itemWithDirectUrl = {
      ...sampleItem,
      destinationUrl: 'https://www.amazon.ca/dp/B09GLVMB76?tag=toyotawaits-20',
    };

    // CA Default
    const { unmount } = render(<ModCard item={itemWithDirectUrl} />);
    const caImageLink = screen.getByRole('link', { name: `View ${sampleItem.title} on Amazon` });
    const caButtonLink = screen.getByRole('link', { name: /View on Amazon/i });
    expect(caImageLink.getAttribute('href')).toBe('https://www.amazon.ca/dp/B09GLVMB76?tag=toyotawaits-20');
    expect(caButtonLink.getAttribute('href')).toBe('https://www.amazon.ca/dp/B09GLVMB76?tag=toyotawaits-20');
    expect(caButtonLink.getAttribute('target')).toBe('_blank');
    expect(caButtonLink.getAttribute('rel')).toContain('noopener');
    expect(caButtonLink.getAttribute('rel')).toContain('noreferrer');
    expect(caButtonLink.getAttribute('rel')).toContain('nofollow');
    unmount();

    // US Market via MarketProvider
    render(
      <MarketProvider initialMarket="US">
        <ModCard item={itemWithDirectUrl} />
      </MarketProvider>
    );
    const usImageLink = screen.getByRole('link', { name: `View ${sampleItem.title} on Amazon` });
    const usButtonLink = screen.getByRole('link', { name: /View on Amazon/i });
    expect(usImageLink.getAttribute('href')).toBe('https://www.amazon.com/dp/B09GLVMB76?tag=toyotawaits07-20');
    expect(usButtonLink.getAttribute('href')).toBe('https://www.amazon.com/dp/B09GLVMB76?tag=toyotawaits07-20');
    expect(usButtonLink.getAttribute('target')).toBe('_blank');
    expect(usButtonLink.getAttribute('rel')).toContain('noopener');
    expect(usButtonLink.getAttribute('rel')).toContain('noreferrer');
    expect(usButtonLink.getAttribute('rel')).toContain('nofollow');
  });

  it('allows importing GearCard alias from @/components/gear/GearCard', () => {
    render(<GearCard item={sampleItem} />);
    expect(screen.getByRole('link', { name: `View ${sampleItem.title} on Amazon` })).toBeInTheDocument();
  });
  it('falls back to search query and "Search Amazon ↗" button text when ASIN is missing or invalid', () => {
    const itemWithInvalidAsin = {
      id: 'prod-fallback-search',
      slug: 'sample-search-item',
      title: 'TuxMat All-Weather Liners',
      category: 'Interior Protection',
      asin: 'INVALID_TOO_LONG_123',
      searchQuery: 'TuxMat Toyota RAV4 2019-2026',
    };

    render(<ModCard item={itemWithInvalidAsin} />);

    // Link must route to search query, NOT /dp/...
    const buttonLink = screen.getByRole('link', { name: /Search Amazon ↗/i });
    expect(buttonLink).toBeInTheDocument();
    expect(buttonLink.getAttribute('href')).toBe('https://www.amazon.ca/s?k=TuxMat%20Toyota%20RAV4%202019-2026&tag=toyotawaits-20');
    expect(buttonLink.getAttribute('target')).toBe('_blank');
    expect(buttonLink.getAttribute('rel')).toBe('sponsored noopener noreferrer nofollow');
  });
});
