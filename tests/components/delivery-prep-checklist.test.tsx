import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DeliveryPrepChecklist } from '@/components/dashboard/delivery-prep-checklist';

describe('DeliveryPrepChecklist Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders correctly with default props and shows title and microcopy', () => {
    render(<DeliveryPrepChecklist model="rav4" powertrain="hev" />);

    expect(screen.getByText(/Delivery Day Prep Checklist/i)).toBeDefined();
    expect(screen.getByText(/Glovebox Essentials & Rainy-Day Armor/i)).toBeDefined();
    expect(
      screen.getByText(/Community-vetted gear. Outbound links support ToyotaWaits.ca without tracking your personal data./i)
    ).toBeDefined();
  });

  it('renders model-specific accessories for RAV4', () => {
    render(<DeliveryPrepChecklist model="rav4" powertrain="hev" />);

    // Should include RAV4 items
    expect(screen.getByText(/FitcamX OEM Integrated 4K Mirror Dashcam \(RAV4\)/i)).toBeDefined();
    expect(screen.getByText(/Drop-In Center Console Divider & Coin Tray \(RAV4\)/i)).toBeDefined();
    // Universal item
    expect(screen.getByText(/NOCO Boost Plus GB40 1000A/i)).toBeDefined();

    // Should NOT include Sienna or Grand Highlander specific items
    expect(screen.queryByText(/FitcamX OEM Integrated 4K Mirror Dashcam \(Sienna\)/i)).toBeNull();
    expect(screen.queryByText(/FitcamX OEM Integrated 4K Mirror Dashcam \(Grand Highlander\)/i)).toBeNull();
  });

  it('renders visual cards with 80x80 thumbnail imagery and price badges', () => {
    render(<DeliveryPrepChecklist model="rav4" powertrain="hev" />);

    const dashcamImg = screen.getByAltText(/FitcamX OEM Integrated 4K Mirror Dashcam \(RAV4\)/i);
    expect(dashcamImg).toBeDefined();
    expect(dashcamImg.getAttribute('src')).toBe('/images/accessories/fitcamx-rav4.png');

    // Price badge check
    expect(screen.getByText(/~\$210 CAD/i)).toBeDefined();
    // Punchy utility text
    expect(screen.getByText(/Replaces the TSS mirror shroud with zero dangling cables/i)).toBeDefined();
  });

  it('displays PHEV-specific accessories only when powertrain is phev', () => {
    // 1. HEV RAV4 -> J1772 lock should NOT be present
    const { unmount } = render(<DeliveryPrepChecklist model="rav4" powertrain="hev" />);
    expect(screen.queryByText(/J1772 Public EV Charging Port Combination Lock Ring/i)).toBeNull();
    unmount();

    // 2. PHEV RAV4 -> J1772 lock SHOULD be present
    render(<DeliveryPrepChecklist model="rav4" powertrain="phev" />);
    expect(screen.getByText(/J1772 Public EV Charging Port Combination Lock Ring/i)).toBeDefined();
    const lockImg = screen.getByAltText(/J1772 Public EV Charging Port Combination Lock Ring/i);
    expect(lockImg.getAttribute('src')).toBe('/images/accessories/j1772-charger-lock.png');
  });

  it('filters accessories when model is Sienna', () => {
    render(<DeliveryPrepChecklist model="sienna" powertrain="hev" />);

    expect(screen.getByText(/FitcamX OEM Integrated 4K Mirror Dashcam \(Sienna\)/i)).toBeDefined();
    expect(screen.getByText(/Dual-Tier Center Console & Bridge Organizer \(Sienna\)/i)).toBeDefined();
    expect(screen.queryByText(/FitcamX OEM Integrated 4K Mirror Dashcam \(RAV4\)/i)).toBeNull();
  });

  it('filters accessories when model is Land Cruiser', () => {
    render(<DeliveryPrepChecklist model="land-cruiser" powertrain="hev" />);

    expect(screen.getByText(/FitcamX OEM Integrated 4K Mirror Dashcam \(Land Cruiser 250\)/i)).toBeDefined();
    expect(screen.getByText(/Heavy-Duty Armrest Storage Organizer \(Land Cruiser 250\)/i)).toBeDefined();
    expect(screen.queryByText(/FitcamX OEM Integrated 4K Mirror Dashcam \(RAV4\)/i)).toBeNull();
  });

  it('filters by category tabs (Visibility & Tech, Interior Protection, Roadside Armor)', () => {
    render(<DeliveryPrepChecklist model="rav4" powertrain="phev" />);

    // Click "Visibility & Tech"
    const visTab = screen.getByText('Visibility & Tech');
    fireEvent.click(visTab);
    expect(screen.getByText(/FitcamX OEM Integrated 4K Mirror Dashcam \(RAV4\)/i)).toBeDefined();
    expect(screen.queryByText(/Drop-In Center Console Divider & Coin Tray \(RAV4\)/i)).toBeNull();

    // Click "Interior Protection"
    const intTab = screen.getByText('Interior Protection');
    fireEvent.click(intTab);
    expect(screen.getByText(/Drop-In Center Console Divider & Coin Tray \(RAV4\)/i)).toBeDefined();
    expect(screen.queryByText(/FitcamX OEM Integrated 4K Mirror Dashcam \(RAV4\)/i)).toBeNull();

    // Click "Roadside Armor"
    const roadTab = screen.getByText('Roadside Armor');
    fireEvent.click(roadTab);
    expect(screen.getByText(/NOCO Boost Plus GB40 1000A/i)).toBeDefined();
    expect(screen.getByText(/J1772 Public EV Charging Port Combination Lock Ring/i)).toBeDefined();
    expect(screen.queryByText(/FitcamX OEM Integrated 4K Mirror Dashcam \(RAV4\)/i)).toBeNull();
  });

  it('persists checked state in localStorage and updates completion progress', () => {
    render(<DeliveryPrepChecklist model="rav4" powertrain="hev" />);

    // Find first checkbox
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);

    // Initial state: not checked
    expect(checkboxes[0].getAttribute('aria-checked')).toBe('false');

    // Click checkbox
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0].getAttribute('aria-checked')).toBe('true');

    // Verify localStorage has entry
    const saved = JSON.parse(localStorage.getItem('toyotawaits_prep_checklist_checks') || '{}');
    expect(Object.values(saved)).toContain(true);
  });

  it('provides clean outbound redirect links routing strictly through /out/[slug]', () => {
    render(<DeliveryPrepChecklist model="rav4" powertrain="hev" />);

    const outboundLinks = screen.getAllByRole('link', { name: /View Item/i });
    expect(outboundLinks.length).toBeGreaterThan(0);
    for (const link of outboundLinks) {
      const href = link.getAttribute('href');
      expect(href).toMatch(/^\/out\/[a-z0-9-]+$/);
      expect(link.getAttribute('rel')).toContain('sponsored');
      expect(link.getAttribute('target')).toBe('_blank');
    }
  });

  it('collapses and expands when toggle button is clicked', () => {
    render(<DeliveryPrepChecklist model="rav4" powertrain="hev" defaultExpanded={true} />);

    // Items visible initially
    expect(screen.getByText(/FitcamX OEM Integrated 4K Mirror Dashcam \(RAV4\)/i)).toBeDefined();

    // Click collapse toggle button
    const toggleBtn = screen.getByLabelText(/Collapse Checklist/i);
    fireEvent.click(toggleBtn);

    // Items should now be hidden
    expect(screen.queryByText(/FitcamX OEM Integrated 4K Mirror Dashcam \(RAV4\)/i)).toBeNull();
  });

  it('renders the 12V jump pack video breakdown callout link with correct attributes', () => {
    render(<DeliveryPrepChecklist model="rav4" powertrain="hev" />);

    const videoCallout = screen.getByTestId('jump-pack-video-comparison');
    expect(videoCallout).toBeDefined();
    expect(videoCallout.getAttribute('href')).toBe('https://www.youtube.com/watch?v=gNDH1z4Is48');
    expect(videoCallout.getAttribute('target')).toBe('_blank');
    expect(videoCallout.getAttribute('rel')).toContain('noopener');
    expect(videoCallout.getAttribute('rel')).toContain('noreferrer');

    expect(
      screen.getByText(/Comparing the GB40 vs GBX45\? Watch the side-by-side breakdown/i)
    ).toBeDefined();
  });

  it('renders the inline lazy-loaded video comparison iframe for NOCO jump pack with privacy domain', () => {
    render(<DeliveryPrepChecklist model="rav4" powertrain="hev" />);

    // Header check
    expect(screen.getByText(/Comparison: GB40 vs\. GBX45 \(Charging & Ports\)/i)).toBeDefined();

    // Iframe embed check
    const iframe = screen.getByTitle('NOCO Boost Jump Starter COMPARISON: GBX45 vs GB40');
    expect(iframe).toBeDefined();
    expect(iframe.getAttribute('src')).toBe('https://www.youtube-nocookie.com/embed/gNDH1z4Is48');
    expect(iframe.getAttribute('loading')).toBe('lazy');
    expect(iframe.getAttribute('allow')).toContain('accelerometer');
    expect(iframe.getAttribute('allow')).toContain('encrypted-media');

    // Outbound link below video
    expect(screen.getByText('View Item on Amazon.ca')).toBeDefined();

    // Toggle collapse and expand
    const toggleBtn = screen.getByRole('button', { name: /Collapse Video/i });
    fireEvent.click(toggleBtn);
    expect(screen.queryByTitle('NOCO Boost Jump Starter COMPARISON: GBX45 vs GB40')).toBeNull();

    const expandBtn = screen.getByRole('button', { name: /Expand Video/i });
    fireEvent.click(expandBtn);
    expect(screen.getByTitle('NOCO Boost Jump Starter COMPARISON: GBX45 vs GB40')).toBeDefined();
  });
});
