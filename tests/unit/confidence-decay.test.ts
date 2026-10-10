import { describe, it, expect } from 'vitest';
import { isSubmissionStale, classifySubmissionsQueue } from '@/lib/utils/confidence-decay';

describe('Estimator Confidence Decay & Active Queue Integrity', () => {
  const modelMedianDays = 375; // e.g. RAV4 model median
  // 1.5x median threshold = 562.5 days
  const referenceDate = new Date('2026-10-10T12:00:00Z');

  it('keeps active orders fresh if wait duration is under 1.5x regional model median', () => {
    // 200 days wait (< 562.5 days)
    const recentOrder = {
      orderDate: '2026-03-24', // ~200 days ago
      stageUpdatedAt: '2026-03-24',
      stage: 'deposit_placed',
      status: 'pending',
    };

    expect(isSubmissionStale(recentOrder, modelMedianDays, referenceDate)).toBe(false);
  });

  it('flags an active order as stale if wait exceeds 1.5x median AND no status update in >120 days', () => {
    // 600 days wait (> 562.5 days) and last update 150 days ago (> 120 days)
    const staleOrder = {
      orderDate: '2025-02-17', // ~600 days ago
      stageUpdatedAt: '2026-05-13', // ~150 days ago
      stage: 'deposit_placed',
      status: 'pending',
    };

    expect(isSubmissionStale(staleOrder, modelMedianDays, referenceDate)).toBe(true);
  });

  it('retains valid 400-600+ day waits as fresh if the user confirmed Still Waiting within the last 120 days', () => {
    // 600 days wait (> 562.5 days), BUT confirmed "Still Waiting" 30 days ago (< 120 days)
    const verifiedLongWait = {
      orderDate: '2025-02-17', // ~600 days ago
      stageUpdatedAt: '2026-09-10', // ~30 days ago (fresh check-in!)
      stage: 'deposit_placed',
      status: 'pending',
    };

    expect(isSubmissionStale(verifiedLongWait, modelMedianDays, referenceDate)).toBe(false);
  });

  it('never marks delivered or cancelled submissions as stale active queue items', () => {
    const deliveredOrder = {
      orderDate: '2024-01-01',
      stageUpdatedAt: '2024-06-01',
      stage: 'delivered',
      status: 'delivered',
    };

    const cancelledOrder = {
      orderDate: '2024-01-01',
      stageUpdatedAt: '2024-06-01',
      stage: 'cancelled',
      status: 'cancelled',
    };

    expect(isSubmissionStale(deliveredOrder, modelMedianDays, referenceDate)).toBe(false);
    expect(isSubmissionStale(cancelledOrder, modelMedianDays, referenceDate)).toBe(false);
  });

  it('correctly classifies a heterogeneous submissions queue into fresh, stale, delivered, and cancelled', () => {
    const queue = [
      {
        id: '1',
        orderDate: '2026-06-01', // ~130 days ago (< 562.5) -> fresh active
        stage: 'in_transit',
        status: 'pending',
      },
      {
        id: '2',
        orderDate: '2024-12-01', // ~680 days ago (> 562.5) and no update -> stale active
        stageUpdatedAt: '2024-12-01',
        stage: 'deposit_placed',
        status: 'pending',
      },
      {
        id: '3',
        orderDate: '2025-01-01', // ~650 days ago (> 562.5) BUT updated 15 days ago -> fresh active
        stageUpdatedAt: '2026-09-25',
        stage: 'allocation_confirmed',
        status: 'pending',
      },
      {
        id: '4',
        orderDate: '2025-06-01',
        stage: 'delivered',
        status: 'delivered',
      },
      {
        id: '5',
        orderDate: '2025-05-01',
        stage: 'cancelled',
        status: 'cancelled',
      },
    ];

    const result = classifySubmissionsQueue(queue, modelMedianDays, referenceDate);

    expect(result.activeTotalCount).toBe(3);
    expect(result.activeFreshCount).toBe(2);
    expect(result.activeStaleCount).toBe(1);
    expect(result.activeFresh.map((i) => i.id)).toEqual(['1', '3']);
    expect(result.activeStale.map((i) => i.id)).toEqual(['2']);
    expect(result.delivered.map((i) => i.id)).toEqual(['4']);
    expect(result.cancelled.map((i) => i.id)).toEqual(['5']);
  });
});
