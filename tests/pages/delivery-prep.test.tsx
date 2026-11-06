import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DeliveryPrepPage, { metadata } from '@/app/delivery-prep/page';

describe('DeliveryPrepPage Route', () => {
  it('defines correct page metadata for Toyota Canada delivery tracking and status codes', () => {
    expect(metadata.title).toBe(
      'Toyota Canada Delivery Tracking & Status Codes (2026 Guide) | ToyotaWaits'
    );
    expect(metadata.description).toBe(
      'Track your Canadian Toyota order from factory allocation to dealership delivery. Demystify Status A, Freight Status F, rail tracking, and dealer PDI checks.'
    );
    expect(metadata.alternates?.canonical).toBe('https://www.toyotawaits.ca/delivery-prep');
  });

  it('renders factory order status tracker with Status A, Status F, and Status G stages', () => {
    render(<DeliveryPrepPage />);

    expect(
      screen.getByRole('heading', {
        name: /Toyota Canada Order Status Codes: “The Black Box” Decoded/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText('Status A')).toBeInTheDocument();
    expect(screen.getByText(/Allocated \/ Scheduled for Assembly/i)).toBeInTheDocument();
    expect(screen.getByText(/TMMC \(Cambridge & Woodstock, ON\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Takaoka & Tahara Plants/i)).toBeInTheDocument();
    expect(screen.getByText(/TMMI \(Princeton, Indiana\)/i)).toBeInTheDocument();

    expect(screen.getByText('Status F')).toBeInTheDocument();
    expect(screen.getByText(/Freight \/ In-Transit Logistics/i)).toBeInTheDocument();
    expect(screen.getByText(/Loaded onto CN \/ CPKC rail/i)).toBeInTheDocument();

    expect(screen.getByText('Status G')).toBeInTheDocument();
    expect(screen.getByText(/Ground \/ Dealership Compound/i)).toBeInTheDocument();
  });

  it('renders dealer tracking secrets, Dealer Daily portal, and PDI audit advice', () => {
    render(<DeliveryPrepPage />);

    expect(
      screen.getByRole('heading', {
        name: /Dealer Tracking FAQ & Logistics Pro-Tips/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/Can My Dealer Track the Train\?/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Dealer Daily/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/How to Request Your VIN Build Sheet/i)).toBeInTheDocument();
    expect(screen.getByText(/Watch Out for PDI Add-Ons/i)).toBeInTheDocument();
  });

  it('renders cross-link buttons bridging to RAV4 accessories and floor mats guides', () => {
    render(<DeliveryPrepPage />);

    expect(
      screen.getByRole('heading', {
        name: /Order Your Day-One Gear Before Status G Arrival/i,
      })
    ).toBeInTheDocument();

    const matsLink = screen.getByRole('link', { name: /Compare All-Weather Floor Mats/i });
    expect(matsLink).toHaveAttribute('href', '/guides/best-toyota-all-weather-floor-mats');

    const rav4Link = screen.getByRole('link', { name: /Browse RAV4 Must-Have Accessories/i });
    expect(rav4Link).toHaveAttribute('href', '/guides/toyota-rav4-must-have-accessories');
  });

  it('renders delivery FAQ items and JSON-LD schema', () => {
    const { container } = render(<DeliveryPrepPage />);

    expect(screen.getByText(/What does Toyota Status F mean\?/i)).toBeInTheDocument();
    expect(screen.getByText(/How long does a Toyota take to arrive once in transit\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Can my dealer track the train carrying my Toyota\?/i)).toBeInTheDocument();

    // Verify JSON-LD FAQ schema script
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    const faqScript = Array.from(scripts).find((s) => s.innerHTML.includes('FAQPage'));
    expect(faqScript).toBeDefined();
    expect(faqScript?.innerHTML).toContain('What does Toyota Status F mean?');
    expect(faqScript?.innerHTML).toContain('How long does a Toyota take to arrive once in transit?');
  });
});
