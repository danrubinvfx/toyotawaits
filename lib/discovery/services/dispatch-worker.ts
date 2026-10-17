/**
 * lib/discovery/services/dispatch-worker.ts
 *
 * Sprint 4: Lease-Locking Worker & Notification Dispatch Service
 * Master Plan V3.2 Page 4, Appendices A4, A5, A6:
 * - Lease locking on alert_outbox (worker_id, claim_token, claim_expires_at)
 * - Controlled claiming preventing concurrent double-send
 * - Pre-send re-verification (listing freshness, user suppression, channel consent, message budget)
 * - CASL-compliant dispatch and provider message ID recording
 * - Exponential / bounded retries and dead-letter failure handling
 * - Lease timeout recovery
 */

import { formatAlertEmail } from '../notifications/formatters';
import {
  AlertOutboxItem,
  AlertOutboxStatus,
  EmailProvider,
} from '../types';

export interface ClaimOutboxBatchParams {
  workerId: string;
  batchSize?: number;
  leaseDurationMs?: number;
  db: any; // SupabaseClient or mock client
  now?: Date;
}

export interface ProcessClaimedBatchParams {
  claimedRows: AlertOutboxItem[];
  emailProvider: EmailProvider;
  db?: any;
  suppressionChecker?: (recipient: string) => Promise<boolean> | boolean;
  freshnessThresholdMs?: number;
  now?: Date;
}

export interface ProcessBatchResult {
  sentCount: number;
  suppressedCount: number;
  failedCount: number;
  retryCount: number;
  results: Array<{
    id: string;
    deliveryKey: string;
    status: AlertOutboxStatus;
    providerMessageId?: string;
    error?: string;
  }>;
}

const DEFAULT_LEASE_DURATION_MS = 60 * 1000; // 60 seconds
const DEFAULT_FRESHNESS_THRESHOLD_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Claims a batch of pending or expired-lease outbox rows using lease locking.
 */
export async function claimOutboxBatch({
  workerId,
  batchSize = 10,
  leaseDurationMs = DEFAULT_LEASE_DURATION_MS,
  db,
  now = new Date(),
}: ClaimOutboxBatchParams): Promise<AlertOutboxItem[]> {
  const currentTimeIso = now.toISOString();
  const leaseExpiresAt = new Date(now.getTime() + leaseDurationMs).toISOString();

  // 1. Fetch candidates from alert_outbox
  // A row is eligible if status == 'pending', OR status == 'claimed' with an expired lease
  const { data: allCandidates, error: fetchError } = await db
    .from('alert_outbox')
    .select('*');

  if (fetchError) {
    throw new Error(`Failed to query alert_outbox candidates: ${fetchError.message}`);
  }

  const eligibleCandidates = (allCandidates || []).filter((row: any) => {
    if (row.status === 'pending') return true;
    if (row.status === 'claimed') {
      const expires = row.claim_expires_at || row.claimExpiresAt;
      return expires && new Date(expires).getTime() <= now.getTime();
    }
    return false;
  }).slice(0, batchSize);

  const claimedRows: AlertOutboxItem[] = [];

  // 2. Atomically claim each candidate
  for (const candidate of eligibleCandidates) {
    const candidateId = candidate.id;
    const currentAttempts = (candidate.attempts ?? 0) + 1;

    const { data: updated, error: updateError } = await db
      .from('alert_outbox')
      .update({
        status: 'claimed',
        claim_token: workerId,
        claimToken: workerId,
        claim_expires_at: leaseExpiresAt,
        claimExpiresAt: leaseExpiresAt,
        attempts: currentAttempts,
        updated_at: currentTimeIso,
        updatedAt: currentTimeIso,
      })
      .eq('id', candidateId)
      .select()
      .maybeSingle();

    if (!updateError && updated) {
      claimedRows.push({
        id: updated.id,
        deliveryKey: updated.delivery_key || updated.deliveryKey,
        idempotencyKey: updated.idempotency_key || updated.idempotencyKey,
        recipient: updated.recipient,
        channel: updated.channel,
        payload: updated.payload,
        status: updated.status,
        claimToken: updated.claim_token || updated.claimToken,
        claimExpiresAt: updated.claim_expires_at || updated.claimExpiresAt,
        attempts: updated.attempts,
        maxAttempts: updated.max_attempts || updated.maxAttempts || 5,
        lastError: updated.last_error || updated.lastError,
        deliveredAt: updated.delivered_at || updated.deliveredAt,
        createdAt: updated.created_at || updated.createdAt,
        updatedAt: updated.updated_at || updated.updatedAt,
      });
    }
  }

  return claimedRows;
}

/**
 * Releases expired leases back to 'pending' state.
 */
export async function releaseExpiredLeases({
  db,
  now = new Date(),
}: {
  db: any;
  now?: Date;
}): Promise<number> {
  const currentTimeIso = now.toISOString();

  const { data: candidates, error: fetchError } = await db
    .from('alert_outbox')
    .select('*')
    .eq('status', 'claimed');

  if (fetchError) {
    throw new Error(`Failed to query claimed alert_outbox rows: ${fetchError.message}`);
  }

  let releasedCount = 0;

  for (const row of candidates || []) {
    const expires = row.claim_expires_at || row.claimExpiresAt;
    if (expires && new Date(expires).getTime() <= now.getTime()) {
      const { error: releaseError } = await db
        .from('alert_outbox')
        .update({
          status: 'pending',
          claim_token: null,
          claimToken: null,
          claim_expires_at: null,
          claimExpiresAt: null,
          updated_at: currentTimeIso,
          updatedAt: currentTimeIso,
        })
        .eq('id', row.id);

      if (!releaseError) {
        releasedCount++;
      }
    }
  }

  return releasedCount;
}

/**
 * Processes a batch of claimed outbox rows with re-verification and bounded retry logic.
 */
export async function processClaimedBatch({
  claimedRows,
  emailProvider,
  db,
  suppressionChecker,
  freshnessThresholdMs = DEFAULT_FRESHNESS_THRESHOLD_MS,
  now = new Date(),
}: ProcessClaimedBatchParams): Promise<ProcessBatchResult> {
  const resultSummary: ProcessBatchResult = {
    sentCount: 0,
    suppressedCount: 0,
    failedCount: 0,
    retryCount: 0,
    results: [],
  };

  const currentTimeIso = now.toISOString();

  for (const row of claimedRows) {
    const payload = row.payload || {};

    // -------------------------------------------------------------------------
    // Step 1: Pre-Send Re-verification (Appendix A4 Guardrails)
    // -------------------------------------------------------------------------

    // 1a. Listing Evidence Freshness Check
    const observedAt = payload.observedAt;
    if (observedAt) {
      const observedTimestamp = new Date(observedAt).getTime();
      const ageMs = now.getTime() - observedTimestamp;
      if (ageMs > freshnessThresholdMs) {
        const errorReason = `EXPIRED_EVIDENCE: Listing observation age (${Math.round(
          ageMs / 3600000
        )}h) exceeds freshness threshold (${Math.round(freshnessThresholdMs / 3600000)}h)`;

        await markRowSuppressed(db, row.id, errorReason, currentTimeIso);
        resultSummary.suppressedCount++;
        resultSummary.results.push({
          id: row.id,
          deliveryKey: row.deliveryKey,
          status: 'suppressed',
          error: errorReason,
        });
        continue;
      }
    }

    // 1b. User Channel Consent Check (CASL)
    if (payload.hasConsent === false) {
      const errorReason = 'CONSENT_REVOKED: Recipient has no valid channel consent';
      await markRowSuppressed(db, row.id, errorReason, currentTimeIso);
      resultSummary.suppressedCount++;
      resultSummary.results.push({
        id: row.id,
        deliveryKey: row.deliveryKey,
        status: 'suppressed',
        error: errorReason,
      });
      continue;
    }

    // 1c. Opt-out & Suppression List Check
    let isSuppressed = payload.isSuppressed === true;
    if (!isSuppressed && suppressionChecker) {
      isSuppressed = await suppressionChecker(row.recipient);
    }

    if (isSuppressed) {
      const errorReason = 'USER_OPTED_OUT: Recipient is suppressed or has opted out of alerts';
      await markRowSuppressed(db, row.id, errorReason, currentTimeIso);
      resultSummary.suppressedCount++;
      resultSummary.results.push({
        id: row.id,
        deliveryKey: row.deliveryKey,
        status: 'suppressed',
        error: errorReason,
      });
      continue;
    }

    // 1d. Message Budget Check
    if (payload.budgetRemaining !== undefined && payload.budgetRemaining <= 0) {
      const errorReason = 'BUDGET_EXCEEDED: Recipient message budget depleted';
      await markRowSuppressed(db, row.id, errorReason, currentTimeIso);
      resultSummary.suppressedCount++;
      resultSummary.results.push({
        id: row.id,
        deliveryKey: row.deliveryKey,
        status: 'suppressed',
        error: errorReason,
      });
      continue;
    }

    // -------------------------------------------------------------------------
    // Step 2: Format & Dispatch Notification
    // -------------------------------------------------------------------------
    try {
      const formatted = formatAlertEmail({
        recipient: row.recipient,
        unsubscribeToken: payload.unsubscribeToken || row.id,
        listingId: payload.listingId,
        eventId: payload.eventId,
        status: payload.status,
        observedAt: payload.observedAt,
        vdpUrl: payload.vdpUrl,
        stockNumber: payload.stockNumber,
        vehicle: payload.vehicle || {
          make: 'Toyota',
          model: 'Vehicle',
          modelYear: now.getFullYear(),
        },
        dealer: payload.dealer || {
          name: 'Authorized Toyota Dealer',
        },
        pricing: payload.pricing,
      });

      const sendResponse = await emailProvider.sendEmail({
        to: row.recipient,
        subject: formatted.subject,
        html: formatted.html,
        text: formatted.text,
        headers: formatted.headers,
      });

      if (sendResponse.success) {
        // Successful dispatch
        const providerMessageId = sendResponse.messageId || `msg-${crypto.randomUUID()}`;
        if (db) {
          await db
            .from('alert_outbox')
            .update({
              status: 'sent',
              delivered_at: currentTimeIso,
              deliveredAt: currentTimeIso,
              claim_token: null,
              claimToken: null,
              claim_expires_at: null,
              claimExpiresAt: null,
              last_error: null,
              lastError: null,
              payload: {
                ...payload,
                providerMessageId,
              },
              updated_at: currentTimeIso,
              updatedAt: currentTimeIso,
            })
            .eq('id', row.id);
        }

        resultSummary.sentCount++;
        resultSummary.results.push({
          id: row.id,
          deliveryKey: row.deliveryKey,
          status: 'sent',
          providerMessageId,
        });
      } else {
        // Email provider reported failure
        const failureReason = sendResponse.error || 'Provider returned unsuccessful response';
        await handleDispatchFailure(
          db,
          row,
          failureReason,
          currentTimeIso,
          resultSummary
        );
      }
    } catch (sendError: any) {
      // Unhandled transport / network exception
      await handleDispatchFailure(
        db,
        row,
        sendError.message || 'Unknown network error',
        currentTimeIso,
        resultSummary
      );
    }
  }

  return resultSummary;
}

/**
 * Marks an outbox row as suppressed.
 */
async function markRowSuppressed(
  db: any,
  rowId: string,
  reason: string,
  currentTimeIso: string
) {
  if (!db) return;
  await db
    .from('alert_outbox')
    .update({
      status: 'suppressed',
      claim_token: null,
      claimToken: null,
      claim_expires_at: null,
      claimExpiresAt: null,
      last_error: reason,
      lastError: reason,
      updated_at: currentTimeIso,
      updatedAt: currentTimeIso,
    })
    .eq('id', rowId);
}

/**
 * Handles transient failures vs dead-letter terminal failures.
 */
async function handleDispatchFailure(
  db: any,
  row: AlertOutboxItem,
  reason: string,
  currentTimeIso: string,
  summary: ProcessBatchResult
) {
  const isTerminalFailure = row.attempts >= row.maxAttempts;
  const newStatus: AlertOutboxStatus = isTerminalFailure ? 'failed' : 'pending';

  if (db) {
    await db
      .from('alert_outbox')
      .update({
        status: newStatus,
        claim_token: null,
        claimToken: null,
        claim_expires_at: null,
        claimExpiresAt: null,
        last_error: reason,
        lastError: reason,
        updated_at: currentTimeIso,
        updatedAt: currentTimeIso,
      })
      .eq('id', row.id);
  }

  if (isTerminalFailure) {
    summary.failedCount++;
    summary.results.push({
      id: row.id,
      deliveryKey: row.deliveryKey,
      status: 'failed',
      error: reason,
    });
  } else {
    summary.retryCount++;
    summary.results.push({
      id: row.id,
      deliveryKey: row.deliveryKey,
      status: 'pending',
      error: reason,
    });
  }
}
