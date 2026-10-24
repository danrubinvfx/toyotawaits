import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DeliveryPrepChecklist } from '@/components/dashboard/delivery-prep-checklist';
import { MarketProvider } from '@/context/MarketContext';

describe('DeliveryPrepChecklist Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders correctly with default props and shows title and microcopy', () => {
    render(<DeliveryPrepChecklist model="rav4" powertrain="hev" />);

    expect(screen.getByRole('heading', { name: /Essential Day-One Gear & Drop-In Upgrades/i })).toBeDefined();
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
    expect(dashcamImg.getAttribute('src')).toContain('/images/accessories/fitcamx-rav4.png');

    // Price badge check
    expect(screen.getByText(/Saves ~\$350\+ vs dealer install/i)).toBeDefined();
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
    expect(lockImg.getAttribute('src')).toContain('/images/accessories/j1772-charger-lock.png');

    // 3. J1772 lock card triggers in-page popup modal
    const lockVideoBtn = screen.getByTestId('video-modal-btn-j1772-charger-lock');
    expect(lockVideoBtn).toBeInTheDocument();
    expect(lockVideoBtn.tagName).toBe('BUTTON');
    expect(lockVideoBtn.textContent).toContain('Watch Video Guide');

    fireEvent.click(lockVideoBtn);
    const modalContent = screen.getByTestId('video-modal-content');
    expect(modalContent).toBeInTheDocument();
    const activeIframe = modalContent.querySelector('iframe');
    expect(activeIframe).toBeInTheDocument();
    expect(activeIframe?.getAttribute('src')).toContain('https://www.youtube-nocookie.com/embed/8MQgYRKKmos');

    const closeBtn = screen.getByTestId('video-modal-close');
    fireEvent.click(closeBtn);
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

  it('does not render standalone banner in main content body, disclaimers moved to footer', () => {
    render(<DeliveryPrepChecklist model="rav4" powertrain="hev" />);

    expect(screen.queryByTestId('affiliate-disclosure-banner')).toBeNull();
    expect(screen.queryByText(/Community Transparency:/i)).toBeNull();
  });

  it('renders badges (Essential, Recommended, Pro Tip) and compatibility tags on product cards', () => {
    render(<DeliveryPrepChecklist model="rav4" powertrain="hev" />);

    // Essential badge for NOCO jump starter / floor mats
    expect(screen.getAllByText('Essential').length).toBeGreaterThan(0);
    // Recommended badge for Fitcamx / screen protector
    expect(screen.getAllByText('Recommended').length).toBeGreaterThan(0);
    // Pro Tip badge for Console tray
    expect(screen.getAllByText('Pro Tip').length).toBeGreaterThan(0);

    // Compatibility tags
    expect(screen.getByText('Hybrid & PHEV Critical')).toBeDefined();
    expect(screen.getByText('TSS Mirror Plug & Play')).toBeDefined();
    expect(screen.getByText('Dual-Tier Armrest Mold')).toBeDefined();
  });

  it('provides clean outbound affiliate links routing dynamically to Amazon with required compliance attributes', () => {
    render(<DeliveryPrepChecklist model="rav4" powertrain="hev" />);

    const outboundLinks = screen.getAllByRole('link', { name: /View (on Amazon|Item)/i });
    expect(outboundLinks.length).toBeGreaterThan(0);
    for (const link of outboundLinks) {
      const href = link.getAttribute('href');
      expect(href).toContain('amazon.ca');
      expect(link.getAttribute('rel')).toContain('noopener');
      expect(link.getAttribute('rel')).toContain('noreferrer');
      expect(link.getAttribute('rel')).toContain('nofollow');
      expect(link.getAttribute('rel')).toContain('sponsored');
      expect(link.getAttribute('target')).toBe('_blank');
    }
  });

  it('routes outbound links to Amazon.com when US market is selected', () => {
    render(
      <MarketProvider initialMarket="US">
        <DeliveryPrepChecklist model="rav4" powertrain="hev" />
      </MarketProvider>
    );

    const outboundLinks = screen.getAllByRole('link', { name: /View (on Amazon|Item)/i });
    expect(outboundLinks.length).toBeGreaterThan(0);
    for (const link of outboundLinks) {
      const href = link.getAttribute('href');
      expect(href).toContain('amazon.com');
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toContain('noopener');
      expect(link.getAttribute('rel')).toContain('noreferrer');
      expect(link.getAttribute('rel')).toContain('nofollow');
    }
  });

  it('does not render redundant outer header card, print button, or collapse toggle', () => {
    render(<DeliveryPrepChecklist model="rav4" powertrain="hev" defaultExpanded={true} />);

    // Outer redundant header elements removed
    expect(screen.queryByRole('heading', { name: /Delivery Day Prep & Gear/i })).toBeNull();
    expect(screen.queryByLabelText(/Print checklist/i)).toBeNull();
    expect(screen.queryByLabelText(/Collapse Checklist/i)).toBeNull();

    // Clean inner header is present and products are visible
    expect(screen.getByRole('heading', { name: /Essential Day-One Gear & Drop-In Upgrades/i })).toBeDefined();
    expect(screen.getByText(/FitcamX OEM Integrated 4K Mirror Dashcam \(RAV4\)/i)).toBeDefined();
  });

  it('renders on-site video modal trigger buttons for items with youtubeVideoId and omits for items without', () => {
    render(<DeliveryPrepChecklist model="rav4" powertrain="hev" />);

    // 1. Initial state: 0 iframes present on page (no broken embedded iframes)
    const initialIframes = document.querySelectorAll('iframe');
    expect(initialIframes.length).toBe(0);

    // 2. Video guide trigger buttons are present
    const videoGuideButtons = screen.getAllByRole('button', { name: /Watch Video Guide/i });
    expect(videoGuideButtons.length).toBe(2);

    // 3. Clicking trigger opens on-site modal player
    fireEvent.click(videoGuideButtons[0]);
    const modalContent = screen.getByTestId('video-modal-content');
    expect(modalContent).toBeInTheDocument();

    const activeIframe = modalContent.querySelector('iframe');
    expect(activeIframe).toBeInTheDocument();
    expect(activeIframe?.getAttribute('src')).toContain('https://www.youtube-nocookie.com/embed/');

    // 4. Close modal
    const closeBtn = screen.getByTestId('video-modal-close');
    fireEvent.click(closeBtn);
  });

  it('filters by Cargo & Utility category and renders roof rack crossbars', () => {
    render(<DeliveryPrepChecklist model="rav4" powertrain="hev" />);

    const cargoTab = screen.getByText('Cargo & Utility');
    fireEvent.click(cargoTab);

    // Crossbars should be visible
    expect(screen.getByText(/Roof Crossbars/i)).toBeDefined();
    expect(screen.getAllByText('Recommended').length).toBeGreaterThan(0);
    expect(screen.getByText(/RAV4 \(LE, XLE, XSE, Limited 2019-2026\)/i)).toBeDefined();

    // Visibility and interior protection items should be hidden
    expect(screen.queryByText(/FitcamX OEM Integrated 4K Mirror Dashcam \(RAV4\)/i)).toBeNull();
    expect(screen.queryByText(/Drop-In Center Console Divider & Coin Tray \(RAV4\)/i)).toBeNull();
  });

  it('renders 3-row all-weather floor liners for Grand Highlander and Sienna', () => {
    // Grand Highlander
    const { unmount } = render(<DeliveryPrepChecklist model="grand-highlander" powertrain="hev" />);
    expect(screen.getByText(/3-Row Heavy Duty All-Weather Floor Liners/i)).toBeDefined();
    expect(screen.getByText(/Heavy-Duty Roof Crossbar System/i)).toBeDefined();
    unmount();

    // Sienna
    render(<DeliveryPrepChecklist model="sienna" powertrain="hev" />);
    expect(screen.getByText(/3-Row Heavy Duty All-Weather Floor Liners/i)).toBeDefined();
  });

  it('renders low-profile crossbars for Corolla Cross model', () => {
    render(<DeliveryPrepChecklist model="corolla-cross" />);

    expect(screen.getAllByText(/Corolla Cross/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Low-Profile Cargo Roof Rack Bars \(Corolla Cross\)/i)).toBeDefined();
    expect(screen.getByText(/Corolla Cross \(All trims with factory rails\)/i)).toBeDefined();
  });

  it('does not render body Amazon Associates disclaimer (relocated to footer)', () => {
    render(<DeliveryPrepChecklist model="rav4" powertrain="hev" />);

    expect(screen.queryByText(/As an Amazon Associate I earn from qualifying purchases\./i)).toBeNull();
  });

  it('does not render dealership pickup inspection accordion in gear checklist', () => {
    render(<DeliveryPrepChecklist model="rav4" powertrain="hev" />);

    expect(screen.queryByText(/Dealership Pickup Day Inspection Steps/i)).toBeNull();
    expect(screen.queryByText(/0 of 4 Verified/i)).toBeNull();
    expect(screen.queryByText(/View Inspection Checks/i)).toBeNull();
    expect(screen.getByText(/Essential Day-One Gear & Drop-In Upgrades/i)).toBeInTheDocument();
  });

  it('renders swipe hint cue for the horizontal gear carousel', () => {
    render(<DeliveryPrepChecklist model="rav4" powertrain="hev" />);

    expect(screen.getByText('Showing recommended gear')).toBeInTheDocument();
    expect(screen.getByText(/Swipe →/i)).toBeInTheDocument();
  });

  it('applies smooth touch swiping and compact card dimensions to the gear carousel container and items', () => {
    render(<DeliveryPrepChecklist model="rav4" powertrain="hev" />);

    const container = screen.getByTestId('gear-carousel-container');
    expect(container).toHaveClass('overflow-x-auto');
    expect(container).toHaveClass('scroll-smooth');
    expect(container).toHaveClass('snap-x');
    expect(container).toHaveClass('snap-mandatory');
    expect(container).toHaveClass('touch-pan-x');
    expect(container).toHaveClass('overscroll-x-contain');
    expect(container).toHaveClass('[-webkit-overflow-scrolling:touch]');
    expect(container).toHaveClass('cursor-grab');
    expect(container).toHaveClass('active:cursor-grabbing');
    expect(container).toHaveClass('select-none');

    const card = screen.getByTestId('checklist-item-fitcamx-rav4');
    expect(card).toHaveClass('w-[82vw]');
    expect(card).toHaveClass('max-w-[300px]');
    expect(card).toHaveClass('sm:w-[280px]');
    expect(card).toHaveClass('snap-start');
    expect(card).toHaveClass('shrink-0');
  });

  it('calls scrollBy with 300px when clicking navigation buttons', () => {
    render(<DeliveryPrepChecklist model="rav4" powertrain="hev" />);

    const container = screen.getByTestId('gear-carousel-container');
    const scrollBySpy = vi.fn();
    container.scrollBy = scrollBySpy;

    // Simulate scrolled geometry to enable both prev and next buttons
    Object.defineProperty(container, 'scrollWidth', { configurable: true, value: 2000 });
    Object.defineProperty(container, 'clientWidth', { configurable: true, value: 600 });
    Object.defineProperty(container, 'scrollLeft', { configurable: true, value: 200, writable: true });
    fireEvent.scroll(container);

    const nextBtn = screen.getByTestId('gear-carousel-next');
    fireEvent.click(nextBtn);
    expect(scrollBySpy).toHaveBeenCalledWith({ left: 300, behavior: 'smooth' });

    const prevBtn = screen.getByTestId('gear-carousel-prev');
    fireEvent.click(prevBtn);
    expect(scrollBySpy).toHaveBeenCalledWith({ left: -300, behavior: 'smooth' });
  });

  it('supports mouse drag-to-scroll interactions and updates scrollLeft', () => {
    render(<DeliveryPrepChecklist model="rav4" powertrain="hev" />);

    const container = screen.getByTestId('gear-carousel-container');
    Object.defineProperty(container, 'offsetLeft', { configurable: true, value: 0 });
    container.scrollLeft = 0;

    fireEvent.mouseDown(container, { pageX: 200, clientX: 200 });
    fireEvent.mouseMove(container, { pageX: 100, clientX: 100 });
    expect(container.scrollLeft).toBe(150);

    fireEvent.mouseUp(container);
    expect(container).toBeInTheDocument();
  });

  it('renders Delivery Day 1 Checklist tab, displays subtitle, and filters to essentials', () => {
    render(<DeliveryPrepChecklist model="rav4" powertrain="hev" />);

    const deliveryTab = screen.getByRole('button', { name: /Delivery Day 1 Checklist/i });
    expect(deliveryTab).toBeInTheDocument();

    fireEvent.click(deliveryTab);

    // Amber highlight styling
    expect(deliveryTab.className).toContain('text-amber-300');
    expect(deliveryTab.className).toContain('bg-amber-950/30');

    // Subtitle helper
    expect(
      screen.getByText(/Essential protection and plug-and-play accessories Canadian Toyota owners order before taking delivery\./i)
    ).toBeInTheDocument();

    // Contains day 1 essentials
    expect(screen.getByText(/FitcamX OEM Integrated 4K Mirror Dashcam \(RAV4\)/i)).toBeInTheDocument();
    expect(screen.getByText(/High-Wall All-Weather Floor Liners/i)).toBeInTheDocument();
    expect(screen.getByText(/Drop-In Center Console Divider & Coin Tray/i)).toBeInTheDocument();
    expect(screen.getByText(/Anti-Glare 9H Tempered Glass Screen Protector/i)).toBeInTheDocument();
  });
});
