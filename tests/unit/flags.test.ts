import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const { mockCookieGet } = vi.hoisted(() => ({
  mockCookieGet: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({
    get: mockCookieGet,
  })),
  headers: vi.fn(async () => ({
    get: vi.fn(() => null),
  })),
}));

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/wait-times/rav4'),
}));

import {
  AB_SEED_COOKIE,
  dropAlertCtaVariant,
  calculatorBridgeFraming,
  mobileStickyLogBar,
  hashSeedToBucket,
} from '@/flags';
import { ModelDropAlertBridge } from '@/components/wait-times/ModelDropAlertBridge';
import { CalculatorBridgeBanner } from '@/components/wait-times/CalculatorBridgeBanner';
import {
  MobileStickyLogBar,
  STICKY_LOG_BAR_DISMISSED_KEY,
} from '@/components/layout/MobileStickyLogBar';

describe('Vercel Flags SDK Definitions & A/B Variants', () => {
  beforeEach(() => {
    mockCookieGet.mockReset();
    window.sessionStorage.clear();
  });

  afterEach(() => {
    window.sessionStorage.clear();
  });

  describe('Flag keys, defaults, and deterministic bucketing', () => {
    it('exports all 3 flag definitions with expected keys and default values', () => {
      expect(dropAlertCtaVariant.key).toBe('drop-alert-cta-variant');
      expect(dropAlertCtaVariant.defaultValue).toBe('control');

      expect(calculatorBridgeFraming.key).toBe('calculator-bridge-framing');
      expect(calculatorBridgeFraming.defaultValue).toBe('control');

      expect(mobileStickyLogBar.key).toBe('mobile-sticky-log-bar');
      expect(mobileStickyLogBar.defaultValue).toBe(false);
    });

    it('falls back to deterministic defaults when no tw_ab_seed cookie is present', async () => {
      mockCookieGet.mockReturnValue(undefined);

      const cta = await dropAlertCtaVariant.decide?.({} as never);
      const framing = await calculatorBridgeFraming.decide?.({} as never);
      const sticky = await mobileStickyLogBar.decide?.({} as never);

      expect(cta).toBe('control');
      expect(framing).toBe('control');
      expect(sticky).toBe(false);
    });

    it('produces consistent per-visitor bucketing for a given tw_ab_seed cookie', async () => {
      const seed = 'visitor-seed-abc-123';
      mockCookieGet.mockImplementation((name: string) =>
        name === AB_SEED_COOKIE ? { value: seed } : undefined
      );

      const cta1 = await dropAlertCtaVariant.decide?.({} as never);
      const cta2 = await dropAlertCtaVariant.decide?.({} as never);
      expect(cta1).toBe(cta2);
      expect(['control', 'urgency']).toContain(cta1);

      const framing1 = await calculatorBridgeFraming.decide?.({} as never);
      const framing2 = await calculatorBridgeFraming.decide?.({} as never);
      expect(framing1).toBe(framing2);
      expect(['control', 'cost_of_waiting']).toContain(framing1);

      const sticky1 = await mobileStickyLogBar.decide?.({} as never);
      const sticky2 = await mobileStickyLogBar.decide?.({} as never);
      expect(sticky1).toBe(sticky2);
      expect(typeof sticky1).toBe('boolean');

      // Verify hash helper matches
      expect(cta1).toBe(
        hashSeedToBucket(seed, 'drop-alert-cta-variant') === 1 ? 'urgency' : 'control'
      );
      expect(framing1).toBe(
        hashSeedToBucket(seed, 'calculator-bridge-framing') === 1
          ? 'cost_of_waiting'
          : 'control'
      );
      expect(sticky1).toBe(hashSeedToBucket(seed, 'mobile-sticky-log-bar') === 1);
    });
  });

  describe('ModelDropAlertBridge variant rendering', () => {
    it('renders control copy by default', () => {
      render(
        React.createElement(ModelDropAlertBridge, {
          modelSlug: 'rav4',
          modelName: 'RAV4',
          estimatedWaitMonths: 8,
        })
      );

      expect(
        screen.getByRole('heading', {
          name: /Skip the Queue: Get Free RAV4 Drop Alerts/i,
        })
      ).toBeInTheDocument();
      expect(screen.getByTestId('drop-alert-primary-button')).toHaveTextContent(
        '🔔 Get Free Drop Alerts'
      );
    });

    it('renders urgency copy when ctaVariant is urgency', () => {
      render(
        React.createElement(ModelDropAlertBridge, {
          modelSlug: 'rav4',
          modelName: 'RAV4',
          estimatedWaitMonths: 8,
          ctaVariant: 'urgency',
        })
      );

      expect(
        screen.getByRole('heading', {
          name: /Skip the Wait — Get Emailed When an Unreserved RAV4 Lands/i,
        })
      ).toBeInTheDocument();
      expect(screen.getByTestId('drop-alert-primary-button')).toHaveTextContent(
        '⚡ Notify Me on Next Lot Drop'
      );
    });
  });

  describe('CalculatorBridgeBanner variant rendering', () => {
    it('renders control and cost_of_waiting framing variants', () => {
      const { rerender } = render(
        React.createElement(CalculatorBridgeBanner, {
          href: '/calculator/rav4-hybrid',
          framingVariant: 'control',
        })
      );
      expect(
        screen.getByText(/Is the Hybrid Worth the Wait\? Calculate Annual Fuel Savings/i)
      ).toBeInTheDocument();

      rerender(
        React.createElement(CalculatorBridgeBanner, {
          href: '/calculator/rav4-hybrid',
          framingVariant: 'cost_of_waiting',
        })
      );
      expect(
        screen.getByText(/See What Waiting 8\+ Months Actually Costs You — Run the Numbers/i)
      ).toBeInTheDocument();
    });
  });

  describe('MobileStickyLogBar rendering and dismissal', () => {
    const mockMatchMedia = (matches: boolean) => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: query === '(max-width: 767px)' ? matches : false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
    };

    it('suppresses mobile-sticky-log-bar flag exposure and rendering on desktop viewports (>= 768px)', () => {
      mockMatchMedia(false);
      const { container } = render(React.createElement(MobileStickyLogBar, { enabled: true }));
      expect(screen.queryByTestId('mobile-sticky-log-bar')).not.toBeInTheDocument();
      expect(container.querySelector('[data-flag-values]')).not.toBeInTheDocument();
      expect(container.innerHTML).toBe('');
    });

    it('does not render bar when enabled is false on mobile', () => {
      mockMatchMedia(true);
      render(React.createElement(MobileStickyLogBar, { enabled: false }));
      expect(screen.queryByTestId('mobile-sticky-log-bar')).not.toBeInTheDocument();
    });

    it('renders positioned above MobileBottomDock on mobile viewports (< 768px) when enabled is true and persists dismissal', () => {
      mockMatchMedia(true);
      render(React.createElement(MobileStickyLogBar, { enabled: true }));

      const bar = screen.getByTestId('mobile-sticky-log-bar');
      expect(bar).toBeInTheDocument();
      expect(bar.className).toContain('fixed');
      expect(bar.className).toContain('bottom-16');
      expect(bar.className).toContain('z-30');
      expect(bar.className).toContain('md:hidden');

      const cta = screen.getByTestId('mobile-sticky-log-bar-cta');
      expect(cta).toHaveAttribute('href', '/submit');
      expect(cta).toHaveTextContent('+ Log Your Order');

      const dismissBtn = screen.getByTestId('mobile-sticky-log-bar-dismiss');
      fireEvent.click(dismissBtn);

      expect(screen.queryByTestId('mobile-sticky-log-bar')).not.toBeInTheDocument();
      expect(window.sessionStorage.getItem(STICKY_LOG_BAR_DISMISSED_KEY)).toBe('true');
    });
  });
});
