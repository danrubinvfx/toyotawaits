import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

vi.mock('@vercel/analytics/react', () => ({
  Analytics: () => <div data-testid="vercel-analytics" />,
}));
vi.mock('@vercel/speed-insights/next', () => ({
  SpeedInsights: () => <div data-testid="vercel-speed-insights" />,
}));

import { AnalyticsWrapper, ADMIN_OPT_OUT_KEY } from '@/components/analytics/AnalyticsWrapper';

describe('AnalyticsWrapper', () => {
  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it('renders Analytics and SpeedInsights for regular visitors', () => {
    render(<AnalyticsWrapper />);
    expect(screen.getByTestId('vercel-analytics')).toBeInTheDocument();
    expect(screen.getByTestId('vercel-speed-insights')).toBeInTheDocument();
  });

  it('renders nothing when the admin opt-out flag is set', () => {
    window.localStorage.setItem(ADMIN_OPT_OUT_KEY, 'true');
    const { container } = render(<AnalyticsWrapper />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByTestId('vercel-analytics')).not.toBeInTheDocument();
  });
});
