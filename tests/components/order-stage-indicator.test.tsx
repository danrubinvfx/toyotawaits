import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  OrderStageIndicator,
  OrderStageBadge,
  getStageStepIndex,
  getStageDisplayLabel,
} from '@/components/dashboard/order-stage-indicator';
import { ActiveOrderStepper } from '@/components/dashboard/active-order-stepper';

describe('OrderStageIndicator Component', () => {
  describe('Helper logic', () => {
    it('correctly maps milestone keys to step indices', () => {
      expect(getStageStepIndex('deposit_placed', 'pending')).toBe(0);
      expect(getStageStepIndex('vin_assigned', 'pending')).toBe(1);
      expect(getStageStepIndex('allocation_confirmed', 'pending')).toBe(1);
      expect(getStageStepIndex('in_transit', 'pending')).toBe(2);
      expect(getStageStepIndex('freight_transit', 'pending')).toBe(2);
      expect(getStageStepIndex('delivered', 'delivered')).toBe(3);
      expect(getStageStepIndex(null, 'delivered')).toBe(3);
      expect(getStageStepIndex('cancelled', 'cancelled')).toBe(-1);
    });

    it('returns human-readable labels', () => {
      expect(getStageDisplayLabel('deposit_placed')).toBe('Deposit Placed');
      expect(getStageDisplayLabel('vin_assigned')).toBe('Build Assigned / VIN Generated');
      expect(getStageDisplayLabel('allocation_confirmed')).toBe('Allocation Assigned');
      expect(getStageDisplayLabel('in_transit')).toBe('In Transit');
      expect(getStageDisplayLabel('delivered')).toBe('Delivered');
      expect(getStageDisplayLabel('cancelled')).toBe('Cancelled');
    });
  });

  describe('Compact rendering (Table cell mode)', () => {
    it('renders compact 4-segment progress bar with active step index', () => {
      render(<OrderStageIndicator stage="allocation_confirmed" status="pending" compact={true} />);

      const indicator = screen.getByTestId('order-stage-indicator-compact');
      expect(indicator).toBeInTheDocument();
      expect(screen.getByText('Allocation Assigned')).toBeInTheDocument();
      expect(screen.getByText('2/4')).toBeInTheDocument();
    });

    it('renders delivered milestone at 4/4', () => {
      render(<OrderStageIndicator stage="delivered" status="delivered" compact={true} />);

      expect(screen.getByText('Delivered')).toBeInTheDocument();
      expect(screen.getByText('4/4')).toBeInTheDocument();
    });

    it('renders cancelled status gracefully', () => {
      render(<OrderStageIndicator stage="cancelled" status="cancelled" compact={true} />);

      expect(screen.getByText('Order Cancelled')).toBeInTheDocument();
    });
  });

  describe('Full rendering (Card banner mode)', () => {
    it('renders 4 milestone steps with labels in full card mode', () => {
      render(<OrderStageIndicator stage="in_transit" status="pending" compact={false} />);

      const indicator = screen.getByTestId('order-stage-indicator');
      expect(indicator).toBeInTheDocument();
      expect(screen.getByText('Order Milestone')).toBeInTheDocument();
      expect(screen.getAllByText('In Transit').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Deposit')).toBeInTheDocument();
      expect(screen.getByText('Allocated')).toBeInTheDocument();
      expect(screen.getByText('Delivered')).toBeInTheDocument();
    });

    it('allows clicking milestone step buttons to view guidance details', () => {
      render(<OrderStageIndicator stage="deposit_placed" status="pending" compact={false} />);

      const allocatedBtn = screen.getByTestId('order-stage-step-allocation_confirmed');
      expect(allocatedBtn.tagName).toBe('BUTTON');
      expect(allocatedBtn.className).toContain('touch-manipulation');

      fireEvent.click(allocatedBtn);
      expect(allocatedBtn).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByTestId('order-stage-guidance')).toHaveTextContent(
        'Step 02: Factory build slot and temporary VIN assigned.'
      );
    });
  });

  describe('ActiveOrderStepper interactive mobile stages', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('renders 5 semantic stage buttons and switches active state and guidance immediately on tap/click', () => {
      localStorage.setItem(
        'toyotawait_pending_submission',
        JSON.stringify({
          id: 'test-sub-123',
          editKey: 'secret-key-9999',
          modelName: 'RAV4',
          powertrainName: 'Prime / Plug-in Hybrid',
          trimName: 'XSE AWD',
          province: 'BC',
          orderDate: '2026-01-15',
          currentStage: 'deposit_placed',
          status: 'pending',
        })
      );

      render(<ActiveOrderStepper />);

      const step1 = screen.getByTestId('milestone-step-deposit_placed');
      const step2 = screen.getByTestId('milestone-step-allocation_confirmed');
      const step3 = screen.getByTestId('milestone-step-freight_transit');
      const step4 = screen.getByTestId('milestone-step-arrived_at_dealer');

      expect(step1.tagName).toBe('BUTTON');
      expect(step2.tagName).toBe('BUTTON');
      expect(step2.className).toContain('touch-manipulation');
      expect(step1).toHaveAttribute('aria-pressed', 'true');

      fireEvent.click(step3);
      expect(step3).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByTestId('active-milestone-details')).toHaveTextContent('Step 03 Active');
      expect(screen.getByTestId('active-milestone-details')).toHaveTextContent('Freight Transit');

      fireEvent.click(step4);
      expect(step4).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByTestId('active-milestone-details')).toHaveTextContent('Step 04 Active');
      expect(screen.getByTestId('active-milestone-details')).toHaveTextContent('Arrived at Dealer');
    });

    it('renders compact pull-down banner by default and expands/collapses drawer on toggle', () => {
      localStorage.setItem(
        'toyotawait_pending_submission',
        JSON.stringify({
          id: 'test-sienna-456',
          editKey: 'secret-key-sienna',
          modelName: 'Sienna',
          powertrainName: 'Hybrid',
          trimName: 'XSE AWD',
          province: 'ON',
          orderDate: '2026-02-01',
          currentStage: 'allocation_confirmed',
          status: 'pending',
        })
      );

      render(<ActiveOrderStepper />);

      // Compact banner verification
      const banner = screen.getByTestId('active-order-banner');
      expect(banner).toBeInTheDocument();
      expect(banner).toHaveTextContent('Your Sienna XSE AWD Order');
      expect(banner).toHaveTextContent('(Step 2: Allocation Confirmed)');

      // Toggle button default state
      const toggleBtn = screen.getByTestId('toggle-order-status');
      expect(toggleBtn).toHaveTextContent('View Status');
      expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');

      // Drawer is collapsed by default
      const drawer = screen.getByTestId('active-order-drawer');
      expect(drawer.className).toContain('hidden');

      // Expand drawer
      fireEvent.click(toggleBtn);
      expect(toggleBtn).toHaveTextContent('Hide Status');
      expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
      expect(drawer.className).toContain('block');
      expect(localStorage.getItem('toyotawait_tracker_collapsed')).toBe('false');

      // Check for Edit Order link and action buttons
      const editLink = screen.getByRole('link', { name: /Edit Order/i });
      expect(editLink).toBeInTheDocument();
      expect(editLink).toHaveAttribute(
        'href',
        '/edit/test-sienna-456?key=secret-key-sienna'
      );
      expect(screen.getByText('Calendar Check-in (.ics)')).toBeInTheDocument();
      expect(screen.getByText('Share to Reddit')).toBeInTheDocument();

      // Collapse drawer again
      fireEvent.click(toggleBtn);
      expect(toggleBtn).toHaveTextContent('View Status');
      expect(drawer.className).toContain('hidden');
      expect(localStorage.getItem('toyotawait_tracker_collapsed')).toBe('true');
    });

    it('dismisses banner and persists dismissal in localStorage', () => {
      localStorage.setItem(
        'toyotawait_pending_submission',
        JSON.stringify({
          id: 'test-rav4-789',
          editKey: 'secret-key-rav4',
          modelName: 'RAV4',
          powertrainName: 'Prime',
          trimName: 'XSE AWD',
          province: 'BC',
          orderDate: '2026-01-20',
          currentStage: 'deposit_placed',
          status: 'pending',
        })
      );

      const { unmount } = render(<ActiveOrderStepper />);

      expect(screen.getByTestId('active-order-tracker')).toBeInTheDocument();

      const dismissBtn = screen.getByTestId('dismiss-order-banner');
      fireEvent.click(dismissBtn);

      expect(screen.queryByTestId('active-order-tracker')).not.toBeInTheDocument();
      expect(localStorage.getItem('toyotawait_tracker_dismissed')).toBe('true');

      unmount();

      // Re-rendering respects persisted dismissal
      render(<ActiveOrderStepper />);
      expect(screen.queryByTestId('active-order-tracker')).not.toBeInTheDocument();
    });
  });

  describe('OrderStageBadge rendering', () => {
    it('renders discrete visual badges for all 4 lifecycle stages', () => {
      const { unmount: u1 } = render(<OrderStageBadge stage="deposit_placed" status="pending" />);
      expect(screen.getByText('Deposit Placed')).toBeInTheDocument();
      expect(screen.getByText('1/4')).toBeInTheDocument();
      u1();

      const { unmount: u2 } = render(<OrderStageBadge stage="vin_assigned" status="pending" />);
      expect(screen.getByText('Build Assigned / VIN Generated')).toBeInTheDocument();
      expect(screen.getByText('2/4')).toBeInTheDocument();
      u2();

      const { unmount: u3 } = render(<OrderStageBadge stage="in_transit" status="pending" />);
      expect(screen.getByText('In Transit')).toBeInTheDocument();
      expect(screen.getByText('3/4')).toBeInTheDocument();
      u3();

      const { unmount: u4 } = render(<OrderStageBadge stage="delivered" status="delivered" />);
      expect(screen.getByText('Delivered')).toBeInTheDocument();
      expect(screen.getByText('4/4')).toBeInTheDocument();
      u4();
    });

    it('renders cancelled badge gracefully', () => {
      render(<OrderStageBadge stage="cancelled" status="cancelled" />);
      expect(screen.getByTestId('order-stage-badge-cancelled')).toBeInTheDocument();
      expect(screen.getByText('Cancelled')).toBeInTheDocument();
    });
  });
});

