import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HomeFeedTabs } from '@/components/home/HomeFeedTabs';

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}));

describe('HomeFeedTabs Component', () => {
  it('renders segmented tab control with Queue Tracker and Allocated Pipeline tabs', () => {
    render(
      <HomeFeedTabs
        queueContent={<div data-testid="queue-test-content">Queue Tracker Feed Content</div>}
        pipelineContent={<div data-testid="pipeline-test-content">Allocated Pipeline Feed Content</div>}
      />
    );

    const tabsList = screen.getByTestId('home-feed-segmented-tabs');
    expect(tabsList).toBeInTheDocument();

    const queueTab = screen.getByTestId('feed-tab-queue');
    const pipelineTab = screen.getByTestId('feed-tab-pipeline');

    expect(queueTab).toBeInTheDocument();
    expect(pipelineTab).toBeInTheDocument();

    expect(queueTab).toHaveTextContent(/Queue Tracker/i);
    expect(pipelineTab).toHaveTextContent(/Allocated Pipeline/i);

    // Default tab is Queue Tracker
    expect(queueTab).toHaveAttribute('aria-selected', 'true');
    expect(pipelineTab).toHaveAttribute('aria-selected', 'false');

    expect(screen.getByTestId('panel-queue-tracker')).not.toHaveClass('hidden');
    expect(screen.getByTestId('panel-allocated-pipeline')).toHaveClass('hidden');
  });

  it('switches between Queue Tracker and Allocated Pipeline when tabs are clicked', () => {
    render(
      <HomeFeedTabs
        queueContent={<div data-testid="queue-test-content">Queue Tracker Feed Content</div>}
        pipelineContent={<div data-testid="pipeline-test-content">Allocated Pipeline Feed Content</div>}
      />
    );

    const queueTab = screen.getByTestId('feed-tab-queue');
    const pipelineTab = screen.getByTestId('feed-tab-pipeline');

    // Click Allocated Pipeline
    fireEvent.click(pipelineTab);

    expect(pipelineTab).toHaveAttribute('aria-selected', 'true');
    expect(queueTab).toHaveAttribute('aria-selected', 'false');

    expect(screen.getByTestId('panel-allocated-pipeline')).not.toHaveClass('hidden');
    expect(screen.getByTestId('panel-queue-tracker')).toHaveClass('hidden');

    // Click Queue Tracker
    fireEvent.click(queueTab);

    expect(queueTab).toHaveAttribute('aria-selected', 'true');
    expect(pipelineTab).toHaveAttribute('aria-selected', 'false');

    expect(screen.getByTestId('panel-queue-tracker')).not.toHaveClass('hidden');
    expect(screen.getByTestId('panel-allocated-pipeline')).toHaveClass('hidden');
  });
});
