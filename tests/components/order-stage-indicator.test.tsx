import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  OrderStageIndicator,
  OrderStageBadge,
  getStageStepIndex,
  getStageDisplayLabel,
} from '@/components/dashboard/order-stage-indicator';

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
