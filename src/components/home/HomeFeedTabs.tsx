'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface HomeFeedTabsProps {
  queueContent: React.ReactNode;
  pipelineContent: React.ReactNode;
  defaultTab?: 'queue' | 'pipeline';
}

export function HomeFeedTabs({
  queueContent,
  pipelineContent,
  defaultTab = 'queue',
}: HomeFeedTabsProps) {
  const [activeTab, setActiveTab] = useState<'queue' | 'pipeline'>(defaultTab);

  // Sync URL search params and hash deep-linking (e.g. ?feed=pipeline or #pipeline)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const feedParam = searchParams.get('feed') || searchParams.get('tab');
      if (feedParam === 'pipeline') {
        setActiveTab('pipeline');
        return;
      }

      const hash = window.location.hash.toLowerCase();
      if (hash === '#pipeline' || hash === '#allocated-pipeline') {
        setActiveTab('pipeline');
      } else if (hash === '#queue' || hash === '#estimator' || hash === '#community-log' || hash === '#analytics') {
        setActiveTab('queue');
      }
    }
  }, []);

  return (
    <div className="w-full space-y-2 sm:space-y-4" data-testid="home-feed-manager">
      {/* Segmented Tab Control: [ ⏱️ Queue Tracker ] <-> [ 📍 Allocated Pipeline ] */}
      <div
        className="flex items-center justify-center my-1.5 sm:my-3"
        role="tablist"
        aria-label="Feed selection tabs"
        data-testid="home-feed-segmented-tabs"
      >
        <div className="inline-flex items-center rounded-xl bg-zinc-900/90 p-1 border border-zinc-800 text-xs gap-1 shadow-sm backdrop-blur-sm">
          <button
            type="button"
            role="tab"
            id="tab-queue-tracker"
            aria-selected={activeTab === 'queue'}
            aria-controls="panel-queue-tracker"
            data-testid="feed-tab-queue"
            onClick={() => setActiveTab('queue')}
            className={cn(
              'px-3 sm:px-4 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 text-xs select-none',
              activeTab === 'queue'
                ? 'bg-amber-500 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            )}
          >
            <span>⏱️</span>
            <span>Queue Tracker</span>
          </button>

          <button
            type="button"
            role="tab"
            id="tab-allocated-pipeline"
            aria-selected={activeTab === 'pipeline'}
            aria-controls="panel-allocated-pipeline"
            data-testid="feed-tab-pipeline"
            onClick={() => setActiveTab('pipeline')}
            className={cn(
              'px-3 sm:px-4 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 text-xs select-none',
              activeTab === 'pipeline'
                ? 'bg-amber-500 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            )}
          >
            <span>📍</span>
            <span>Allocated Pipeline</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div
        id="panel-queue-tracker"
        role="tabpanel"
        aria-labelledby="tab-queue-tracker"
        data-testid="panel-queue-tracker"
        className={cn(activeTab === 'queue' ? 'block' : 'hidden')}
      >
        {queueContent}
      </div>

      <div
        id="panel-allocated-pipeline"
        role="tabpanel"
        aria-labelledby="tab-allocated-pipeline"
        data-testid="panel-allocated-pipeline"
        className={cn(activeTab === 'pipeline' ? 'block' : 'hidden')}
      >
        {pipelineContent}
      </div>
    </div>
  );
}
