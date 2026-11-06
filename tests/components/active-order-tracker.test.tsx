import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ActiveOrderTracker } from '@/components/tracking/ActiveOrderTracker';
import { WhileYouWaitGear, getDayOneProtectionGear } from '@/components/submission/WhileYouWaitGear';
import { CA_ASSOCIATE_TAG } from '@/lib/gear/affiliate';

describe('ActiveOrderTracker & Celebratory Delivery Banner', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders celebratory delivery banner and day-one gear when stored order status === "delivered"', () => {
    localStorage.setItem(
      'toyotawait_pending_submission',
      JSON.stringify({
        id: 'sub-delivered-100',
        editKey: 'key-100',
        model: 'RAV4',
        modelName: 'RAV4',
        year: 2025,
        daysWaited: 142,
        status: 'delivered',
        currentStage: 'delivered',
        province: 'BC',
      })
    );

    render(<ActiveOrderTracker />);

    // Celebratory delivery banner
    const banner = screen.getByTestId('delivery-congratulations-banner');
    expect(banner).toBeInTheDocument();
    expect(screen.getByText(/🎉 Delivery Confirmed • 2025 RAV4/i)).toBeInTheDocument();
    expect(screen.getByText('Congratulations on your new Toyota!')).toBeInTheDocument();
    expect(
      screen.getByText(/Your wait time \(142 days\) is now live in the community ticker\. Protect your interior before day one\./i)
    ).toBeInTheDocument();

    // Day-One Gear Grid header
    expect(screen.getByText('📦 Recommended Day-One Protection Gear')).toBeInTheDocument();

    // Recommended 4 day-one protection gear items
    expect(screen.getByText(/TuxMat Custom All-Weather Floor Liners/i)).toBeInTheDocument();
    expect(screen.getByText(/Spigen GlasTR Tempered Glass Screen Protector/i)).toBeInTheDocument();
    expect(screen.getByText(/Muslogy Center Console Organizer Tray/i)).toBeInTheDocument();
    expect(screen.getByText(/FitcamX OEM-Integrated 4K Dashcam/i)).toBeInTheDocument();

    // Outbound links with sponsored noopener noreferrer & tag toyotawaits-20
    const links = screen.getAllByRole('link', { name: /View .* on Amazon/i });
    expect(links.length).toBe(4);
    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'sponsored noopener noreferrer');
      expect(link.getAttribute('href')).toContain('https://www.amazon.ca/s?k=');
      expect(link.getAttribute('href')).toContain(`tag=${CA_ASSOCIATE_TAG}`);
    });
  });

  it('clears local tracking storage and resets device view when "Dismiss / Clear from device" is clicked', () => {
    localStorage.setItem(
      'toyotawait_pending_submission',
      JSON.stringify({
        id: 'sub-delivered-200',
        editKey: 'key-200',
        model: 'Sienna',
        modelName: 'Sienna',
        year: 2026,
        daysWaited: 310,
        status: 'delivered',
        currentStage: 'delivered',
      })
    );

    render(<ActiveOrderTracker />);

    expect(screen.getByTestId('delivery-congratulations-banner')).toBeInTheDocument();

    const clearButton = screen.getByRole('button', { name: /Dismiss \/ Clear from device/i });
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);

    // Banner is dismissed and storage is reset
    expect(screen.queryByTestId('delivery-congratulations-banner')).not.toBeInTheDocument();
    expect(localStorage.getItem('toyotawait_pending_submission')).toBeNull();
    expect(localStorage.getItem('toyotawaits_submission')).toBeNull();
    expect(localStorage.getItem('toyotawaits_saved_order')).toBeNull();
  });

  it('filters model-tailored day-one items for Sienna with WhileYouWaitGear isDeliveryDay={true}', () => {
    render(<WhileYouWaitGear isDeliveryDay={true} modelName="Sienna" />);

    expect(screen.getByText(/TuxMat Custom All-Weather Floor Liners \(Sienna\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Spigen GlasTR Tempered Glass Screen Protector \(Sienna\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Muslogy Center Console Organizer Tray \(Sienna\)/i)).toBeInTheDocument();
    expect(screen.getByText(/FitcamX OEM-Integrated 4K Dashcam \(Sienna\)/i)).toBeInTheDocument();

    // Verify gear item queries are routed through buildAmazonAffiliateUrl with tag toyotawaits-20
    const gearItems = getDayOneProtectionGear('Sienna');
    expect(gearItems).toHaveLength(4);
    gearItems.forEach((item) => {
      expect(item.url).toContain('https://www.amazon.ca/s?k=');
      expect(item.url).toContain(`tag=${CA_ASSOCIATE_TAG}`);
      expect(item.url).toContain('Sienna');
    });
  });

  it('replaces active order tracker stepper with celebratory banner when user advances to delivered', async () => {
    // Mock fetch for background sync PATCH
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as any);

    localStorage.setItem(
      'toyotawait_pending_submission',
      JSON.stringify({
        id: 'sub-advancing-300',
        editKey: 'key-300',
        model: 'Grand Highlander',
        modelName: 'Grand Highlander',
        year: 2026,
        orderDate: '2026-01-01',
        currentStage: 'arrived_at_dealer',
        status: 'pending',
      })
    );

    render(<ActiveOrderTracker defaultExpanded={true} />);

    // Initially shows active milestone stepper
    expect(screen.getByTestId('active-order-banner')).toBeInTheDocument();
    expect(screen.getByTestId('milestone-step-delivered')).toBeInTheDocument();

    // Advance to delivered
    const advanceButton = screen.getByRole('button', { name: /Advance to Delivered/i });
    fireEvent.click(advanceButton);

    // Replaced by celebratory delivery banner
    expect(screen.queryByTestId('active-order-banner')).not.toBeInTheDocument();
    expect(screen.getByTestId('delivery-congratulations-banner')).toBeInTheDocument();
    expect(screen.getByText(/🎉 Delivery Confirmed • 2026 Grand Highlander/i)).toBeInTheDocument();
    expect(screen.getByText('Congratulations on your new Toyota!')).toBeInTheDocument();
    expect(screen.getByText(/TuxMat Custom All-Weather Floor Liners/i)).toBeInTheDocument();
  });
});
