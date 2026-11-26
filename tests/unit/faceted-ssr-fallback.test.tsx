import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProvincialVehiclePage from '@/app/[model]/[powertrain]/[province]/page';
import { getFacetedRouteWaitStats } from '@/lib/db/faceted-wait-times';
import * as aggregateModule from '@/lib/db/aggregate';

vi.mock('@/components/calculator/wait-time-estimator', () => ({
  WaitTimeEstimator: () => <div data-testid="mock-wait-time-estimator">Estimator</div>,
}));

describe('Faceted Route SSR Fallback (/grand-highlander/hybrid-max/on)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('falls back cleanly to static baseline priors when Supabase aggregation throws an error', async () => {
    vi.spyOn(aggregateModule, 'getAggregateStats').mockRejectedValue(
      new Error('Supabase connection refused (cold start 500)')
    );

    const stats = await getFacetedRouteWaitStats('grand-highlander', 'hybrid-max', 'on');
    expect(stats.source).toBe('baseline');
    expect(stats.medianDays).toBe(280);
    expect(stats.p25Days).toBe(210);
    expect(stats.p75Days).toBe(380);
    expect(stats.sampleCount).toBe(88);

    const element = await ProvincialVehiclePage({
      params: Promise.resolve({
        model: 'grand-highlander',
        powertrain: 'hybrid-max',
        province: 'on',
      }),
    });

    render(element);
    expect(screen.getByText(/Toyota Grand Highlander Hybrid MAX/i)).toBeInTheDocument();
    expect(screen.getByText('280 Days')).toBeInTheDocument();
    expect(screen.getByText(/88 verified reports/i)).toBeInTheDocument();
  });
});
