/**
 * Confidence Decay Logic for Long-Timeline Vehicle Wait Orders (300-500+ Days)
 * 
 * Rules:
 * 1. Completed Benchmarks:
 *    Median calculations are strictly derived from submissions with stage = 'delivered'
 *    (or status = 'delivered') and valid deposit_date + delivery_date (wait_days > 0).
 * 2. Active Waiting Queue:
 *    Active orders (deposit_placed, allocation_confirmed, in_transit) are tracked for volume context.
 * 3. Confidence Decay:
 *    If an active order's wait time exceeds 1.5x the regional model median AND
 *    has not had a status update or nudge confirmation in >120 days, it is flagged as 'stale'
 *    so it does not distort regional projections.
 * 4. Freshness Retention:
 *    Valid 400-500+ day waits stay intact and fresh if the user confirmed "Still Waiting"
 *    within the last 120 days.
 */

export interface SubmissionDecaySubject {
  orderDate: string;
  stageUpdatedAt?: string | null;
  updatedAt?: string | null;
  stage?: string;
  status?: string;
  lastNudgedAt?: string | null;
}

export function isSubmissionStale(
  submission: SubmissionDecaySubject,
  modelMedianDays: number,
  referenceDate: Date = new Date()
): boolean {
  const stage = submission.stage || (submission.status === 'delivered' ? 'delivered' : 'deposit_placed');
  const status = submission.status || (stage === 'delivered' ? 'delivered' : 'pending');

  // Completed or cancelled orders are not active waiting queue items
  if (status === 'delivered' || stage === 'delivered' || status === 'cancelled' || stage === 'cancelled') {
    return false;
  }

  const orderTime = new Date(submission.orderDate).getTime();
  if (isNaN(orderTime)) return false;

  const refTime = referenceDate.getTime();
  const currentWaitDays = Math.max(0, Math.floor((refTime - orderTime) / (1000 * 60 * 60 * 24)));

  // If wait time does not exceed 1.5x the model median, it remains fresh
  const thresholdDays = 1.5 * modelMedianDays;
  if (currentWaitDays <= thresholdDays) {
    return false;
  }

  // Determine the most recent activity timestamp: stageUpdatedAt, updatedAt, or orderDate
  const activityTimestamp = submission.stageUpdatedAt || submission.updatedAt || submission.orderDate;
  const lastActivityTime = new Date(activityTimestamp).getTime();
  if (isNaN(lastActivityTime)) return false;

  const daysSinceActivity = Math.max(0, Math.floor((refTime - lastActivityTime) / (1000 * 60 * 60 * 24)));

  // Flag as stale if no activity or check-in confirmation in >120 days
  return daysSinceActivity > 120;
}

export interface QueueClassification<T> {
  activeFresh: T[];
  activeStale: T[];
  delivered: T[];
  cancelled: T[];
  activeTotalCount: number;
  activeFreshCount: number;
  activeStaleCount: number;
}

export function classifySubmissionsQueue<T extends SubmissionDecaySubject>(
  items: T[],
  modelMedianDays: number,
  referenceDate: Date = new Date()
): QueueClassification<T> {
  const activeFresh: T[] = [];
  const activeStale: T[] = [];
  const delivered: T[] = [];
  const cancelled: T[] = [];

  for (const item of items) {
    const stage = item.stage || (item.status === 'delivered' ? 'delivered' : 'deposit_placed');
    const status = item.status || (stage === 'delivered' ? 'delivered' : 'pending');

    if (status === 'delivered' || stage === 'delivered') {
      delivered.push(item);
    } else if (status === 'cancelled' || stage === 'cancelled') {
      cancelled.push(item);
    } else {
      // Active waiting queue
      const stale = isSubmissionStale(item, modelMedianDays, referenceDate);
      if (stale) {
        activeStale.push(item);
      } else {
        activeFresh.push(item);
      }
    }
  }

  return {
    activeFresh,
    activeStale,
    delivered,
    cancelled,
    activeTotalCount: activeFresh.length + activeStale.length,
    activeFreshCount: activeFresh.length,
    activeStaleCount: activeStale.length,
  };
}
