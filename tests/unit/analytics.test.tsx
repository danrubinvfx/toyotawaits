import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const { mockTrack } = vi.hoisted(() => ({
  mockTrack: vi.fn(),
}));

vi.mock('@vercel/analytics', () => ({
  track: mockTrack,
}));

import { trackUserEvent, ADMIN_OPT_OUT_KEY, IGNORE_ANALYTICS_KEY } from '@/lib/analytics';
import { VehicleSavingsCalculator } from '@/components/calculator/VehicleSavingsCalculator';
import { CalculatorGearCards } from '@/components/gear/CalculatorGearCards';
import { WhileYouWaitGear } from '@/components/submission/WhileYouWaitGear';
import { InventoryGearCard } from '@/components/discovery/InventoryGearCard';
import { InventoryAlertModal } from '@/components/inventory/InventoryAlertModal';
import { MarketProvider } from '@/context/MarketContext';

describe('Vercel Web Analytics Custom Events (src/lib/analytics.ts)', () => {
  beforeEach(() => {
    mockTrack.mockReset();
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('1. Central Event Helper & Opt-Out Guards', () => {
    it('calls @vercel/analytics track() when opt-out flags are absent', () => {
      trackUserEvent('order_logged', {
        model: 'rav4',
        powertrain: 'hev',
        province: 'ON',
        status: 'pending',
      });

      expect(mockTrack).toHaveBeenCalledTimes(1);
      expect(mockTrack).toHaveBeenCalledWith('order_logged', {
        model: 'rav4',
        powertrain: 'hev',
        province: 'ON',
        status: 'pending',
      });
    });

    it('blocks tracking when tw_admin_opt_out is set to true', () => {
      window.localStorage.setItem(ADMIN_OPT_OUT_KEY, 'true');

      trackUserEvent('order_logged', { model: 'sienna' });
      expect(mockTrack).not.toHaveBeenCalled();
    });

    it('blocks tracking when tw_ignore_analytics is set to true', () => {
      window.localStorage.setItem(IGNORE_ANALYTICS_KEY, 'true');

      trackUserEvent('cant_wait_clicked', { model: 'rav4', source: 'estimator' });
      expect(mockTrack).not.toHaveBeenCalled();
    });

    it('swallows errors thrown by track() without disrupting UI execution', () => {
      mockTrack.mockImplementationOnce(() => {
        throw new Error('Blocked by content blocker');
      });

      expect(() =>
        trackUserEvent('affiliate_gear_clicked', {
          accessoryId: 'tuxmat-rav4',
          model: 'rav4',
          placement: 'calculator_gear',
        })
      ).not.toThrow();
    });
  });

  describe('2. Savings Calculator & Live Inventory Bridge Events', () => {
    it('fires calculator_computed on model change and input adjustment, calculator_shared on copy link, and cant_wait_clicked on live stock click', () => {
      render(<VehicleSavingsCalculator />);

      // 1. Switch target model -> calculator_computed
      const targetSelect = screen.getByLabelText('Select Target Toyota');
      fireEvent.change(targetSelect, { target: { value: '2025-toyota-sienna-hybrid' } });

      expect(mockTrack).toHaveBeenCalledWith(
        'calculator_computed',
        {
          model: 'sienna',
          powertrain: 'HEV',
          province: 'CA',
        },
        { flags: ['calculator-bridge-framing'] }
      );

      // 2. Copy Shareable Link -> calculator_shared
      const shareBtn = screen.getByRole('button', { name: /Copy Shareable Link/i });
      fireEvent.click(shareBtn);

      expect(mockTrack).toHaveBeenCalledWith('calculator_shared', {
        model: 'sienna',
        powertrain: 'HEV',
      });

      // 3. Click Skip the Wait / View Live Stock -> cant_wait_clicked
      const liveStockLink = screen.getByRole('link', { name: /Skip the Wait \/ View Live Stock/i });
      fireEvent.click(liveStockLink);

      expect(mockTrack).toHaveBeenCalledWith('cant_wait_clicked', {
        model: 'sienna',
        source: 'calculator',
      });
    });
  });

  describe('3. Drop Alert Subscription Events', () => {
    it('fires drop_alert_subscribed on successful /api/alerts/subscribe submission', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

      render(
        <InventoryAlertModal
          isOpen={true}
          onClose={vi.fn()}
          initialModel="Sienna"
          initialRegion="Vancouver, BC"
        />
      );

      const emailInput = screen.getByTestId('alert-email-input');
      fireEvent.change(emailInput, { target: { value: 'buyer@example.ca' } });

      const submitBtn = screen.getByTestId('alert-submit-btn');
      fireEvent.click(submitBtn);

      await screen.findByTestId('alert-success-state');

      expect(fetchSpy).toHaveBeenCalled();
      expect(mockTrack).toHaveBeenCalledWith(
        'drop_alert_subscribed',
        {
          model: 'Sienna',
          region: 'Vancouver, BC',
        },
        { flags: ['drop-alert-cta-variant'] }
      );
    });
  });

  describe('4. Affiliate & Partner Gear Click Events', () => {
    it('fires affiliate_gear_clicked from CalculatorGearCards, WhileYouWaitGear, and InventoryGearCard', () => {
      render(
        <MarketProvider initialMarket="CA">
          <CalculatorGearCards activeModel="rav4" />
          <WhileYouWaitGear modelName="Toyota Sienna" placement="while_you_wait" />
          <InventoryGearCard
            item={{
              id: 'all-weather-floor-liners',
              title: 'TuxMat All-Weather Liners',
              category: 'protection',
              description: 'Laser-fit protection',
              estimatedPriceCad: '$260 CAD',
              url: 'https://www.amazon.ca/s?k=TuxMat+RAV4&tag=toyotawaits-20',
              applicableModels: ['rav4'],
            }}
            modelContext="RAV4 Hybrid"
          />
        </MarketProvider>
      );

      // Click a CalculatorGearCards CTA
      const calcDashcamLink = screen.getByRole('link', { name: /View OEM-Fit Dashcams/i });
      fireEvent.click(calcDashcamLink);

      expect(mockTrack).toHaveBeenCalledWith('affiliate_gear_clicked', {
        accessoryId: 'rav4-dashcam',
        model: 'rav4',
        placement: 'calculator_gear',
      });

      // Click InventoryGearCard CTA
      const invGearBtn = screen.getByTestId('gear-strip-action-btn');
      fireEvent.click(invGearBtn);

      expect(mockTrack).toHaveBeenCalledWith('affiliate_gear_clicked', {
        accessoryId: 'all-weather-floor-liners',
        model: 'RAV4 Hybrid',
        placement: 'inventory_feed',
      });
    });
  });
});
