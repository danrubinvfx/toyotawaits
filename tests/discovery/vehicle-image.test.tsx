import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VehicleImage, generateTrimSlug } from '@/components/inventory/VehicleImage';
import { VehicleListingCard, VehicleListingCardProps } from '@/components/discovery/VehicleListingCard';

// Mock next/image to render standard img tag with passed props for testing
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    onError,
    priority: _priority,
    fill: _fill,
    sizes: _sizes,
    unoptimized: _unoptimized,
    className,
    ...props
  }: any) => {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={onError}
        {...props}
      />
    );
  },
}));

describe('VehicleImage Component (3-Tier Fallback)', () => {
  it('generates consistent trim slugs', () => {
    expect(generateTrimSlug('RAV4 Hybrid', 'XSE Technology Package')).toBe(
      'rav4-hybrid-xse-technology-package'
    );
    expect(generateTrimSlug('Sienna', 'Limited 7-Passenger')).toBe(
      'sienna-limited-7-passenger'
    );
    expect(generateTrimSlug('Tacoma', null)).toBe('tacoma');
  });

  it('renders Tier 1 lot photo when hasRealPhoto=true and valid https imageUrl is provided', () => {
    render(
      <VehicleImage
        imageUrl="https://pictures.dealerprocess.ca/inventory/rav4.jpg"
        hasRealPhoto={true}
        model="RAV4 Hybrid"
        trim="XSE"
        modelYear={2026}
        alt="2026 Toyota RAV4 Hybrid XSE"
      />
    );

    const container = screen.getByTestId('vehicle-image-container');
    expect(container).toHaveAttribute('data-tier', '1');
    expect(container).toHaveClass('aspect-[16/10]');

    const img = screen.getByRole('img', { name: '2026 Toyota RAV4 Hybrid XSE' });
    expect(img).toHaveAttribute('src', 'https://pictures.dealerprocess.ca/inventory/rav4.jpg');

    const badge = screen.getByTestId('vehicle-image-badge');
    expect(badge).toHaveTextContent('Dealer Unit Photo');
    expect(badge).toHaveClass('text-emerald-400');
  });

  it('defaults to Tier 2 factory trim render when hasRealPhoto=false', () => {
    render(
      <VehicleImage
        imageUrl={null}
        hasRealPhoto={false}
        model="RAV4 Hybrid"
        trim="XSE AWD"
        modelYear={2026}
        alt="2026 Toyota RAV4 Hybrid XSE AWD"
      />
    );

    const container = screen.getByTestId('vehicle-image-container');
    expect(container).toHaveAttribute('data-tier', '2');

    const img = screen.getByRole('img', { name: '2026 Toyota RAV4 Hybrid XSE AWD' });
    expect(img).toHaveAttribute('src', '/assets/models/2026/rav4-hybrid-xse-awd.webp');

    const badge = screen.getByTestId('vehicle-image-badge');
    expect(badge).toHaveTextContent('Factory Trim Render');
    expect(badge).toHaveClass('text-sky-400');
  });

  it('downgrades Tier 1 to Tier 2 and then Tier 3 on consecutive image load errors', () => {
    render(
      <VehicleImage
        imageUrl="https://media.toyota.ca/image/corrupted.jpg"
        hasRealPhoto={true}
        model="Sienna"
        trim="Limited"
        modelYear={2026}
        alt="2026 Toyota Sienna Limited"
      />
    );

    const container = screen.getByTestId('vehicle-image-container');
    expect(container).toHaveAttribute('data-tier', '1');

    const img = screen.getByRole('img', { name: '2026 Toyota Sienna Limited' });

    // 1st error: Downgrades to Tier 2 factory render
    fireEvent.error(img);
    expect(container).toHaveAttribute('data-tier', '2');
    const tier2Img = screen.getByRole('img', { name: '2026 Toyota Sienna Limited' });
    expect(tier2Img).toHaveAttribute('src', '/assets/models/2026/sienna-limited.webp');
    expect(screen.getByTestId('vehicle-image-badge')).toHaveTextContent('Factory Trim Render');

    // 2nd error: Downgrades to Tier 3 SVG silhouette
    fireEvent.error(tier2Img);
    expect(container).toHaveAttribute('data-tier', '3');
    const tier3Img = screen.getByRole('img', { name: '2026 Toyota Sienna Limited' });
    expect(tier3Img).toHaveAttribute('src', '/assets/placeholder-silhouette.svg');
    const tier3Badge = screen.getByTestId('vehicle-image-badge');
    expect(tier3Badge).toHaveTextContent('Specification Preview');
    expect(tier3Badge).toHaveClass('text-zinc-400');
  });

  it('defaults to Tier 2 factory trim render for In-Transit units even with unconfirmed dealer photo', () => {
    render(
      <VehicleImage
        imageUrl="https://pictures.dealerprocess.ca/inventory/placeholder.jpg"
        hasRealPhoto={true}
        isInTransit={true}
        model="Grand Highlander"
        trim="Limited"
        modelYear={2026}
        alt="2026 Toyota Grand Highlander Limited"
      />
    );

    const container = screen.getByTestId('vehicle-image-container');
    expect(container).toHaveAttribute('data-tier', '2');

    const img = screen.getByRole('img', { name: '2026 Toyota Grand Highlander Limited' });
    expect(img).toHaveAttribute('src', '/assets/models/2026/grand-highlander-limited.webp');

    const badge = screen.getByTestId('vehicle-image-badge');
    expect(badge).toHaveTextContent('Factory Trim Render');
    expect(badge).toHaveClass('text-sky-400');
  });
});

describe('VehicleListingCard Image & Transit Status Integration', () => {
  const baseListing: VehicleListingCardProps = {
    id: 'test-unit-01',
    make: 'Toyota',
    model: 'RAV4 Hybrid',
    trim: 'XSE AWD',
    modelYear: 2026,
    vin: '2T3P1RFV5TC999999',
    dealerName: 'Jim Pattison Toyota Downtown',
    dealerCity: 'Vancouver',
    dealerProvince: 'BC',
    status: 'Advertised - availability unconfirmed',
    lastChecked: new Date().toISOString(),
    vdpUrl: 'https://www.jptoyota-downtown.com/inventory/test',
    msrp: 48000,
    sellingPrice: 48000,
    imageUrl: 'https://pictures.dealerprocess.ca/sample.jpg',
    hasRealPhoto: true,
  };

  it('renders VehicleImage and "On Lot" badge for on-lot vehicle', () => {
    render(<VehicleListingCard {...baseListing} />);

    expect(screen.getByTestId('vehicle-image-container')).toBeInTheDocument();
    const transitBadge = screen.getByTestId('transit-status-badge');
    expect(transitBadge).toHaveTextContent('On Lot');
    expect(transitBadge).toHaveClass('text-emerald-300');
  });

  it('renders "In Transit" badge for incoming vehicle', () => {
    render(
      <VehicleListingCard
        {...baseListing}
        status="Incoming availability unconfirmed"
        hasRealPhoto={false}
        imageUrl={null}
      />
    );

    const transitBadge = screen.getByTestId('transit-status-badge');
    expect(transitBadge).toHaveTextContent('In Transit');
    expect(transitBadge).toHaveClass('text-blue-300');

    // Should render Tier 2 factory trim badge
    expect(screen.getByTestId('vehicle-image-badge')).toHaveTextContent('Factory Trim Render');
  });
});
