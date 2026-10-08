// ============================================================================
// OUTLIER & ANOMALY DETECTION ENGINE
// Flags unverified, suspicious, or statistically anomalous entries for
// moderation quarantine (is_flagged = true), preventing malicious manipulation
// of community percentiles and public medians.
// ============================================================================

export interface OutlierCheckInput {
  status: 'pending' | 'delivered' | 'cancelled';
  waitDays?: number | null;
  orderDate: string;
  deliveryDate?: string | null;
  mandatoryAddonsCad?: number;
  powertrainSlug?: string;
}

export interface OutlierCheckResult {
  isFlagged: boolean;
  reason?: string;
}

export function detectSubmissionOutlier(input: OutlierCheckInput): OutlierCheckResult {
  // If not delivered, no wait time anomaly to flag
  if (input.status !== 'delivered' || input.waitDays == null) {
    return { isFlagged: false };
  }

  // 1. Extreme minimum wait anomaly: Under 5 days wait for custom order
  if (input.waitDays < 5) {
    return {
      isFlagged: true,
      reason: `Reported wait time of ${input.waitDays} days is below minimum plausibility threshold (< 5 days).`,
    };
  }

  // 2. High-demand hybrid/PHEV fast delivery anomaly (PHEV under 14 days)
  if (input.powertrainSlug === 'phev' && input.waitDays < 14) {
    return {
      isFlagged: true,
      reason: `Reported wait time of ${input.waitDays} days for PHEV is statistically improbable without cancellation allocation. Flagged for review.`,
    };
  }

  // 3. Extreme maximum wait anomaly (> 1200 days / ~3.3 years)
  if (input.waitDays > 1200) {
    return {
      isFlagged: true,
      reason: `Reported wait time of ${input.waitDays} days exceeds 1200-day soft threshold. Flagged for verification.`,
    };
  }

  // 4. Extreme add-on markup anomaly (> $15,000 CAD)
  if (input.mandatoryAddonsCad && input.mandatoryAddonsCad > 15000) {
    return {
      isFlagged: true,
      reason: `Reported mandatory add-on fees ($${input.mandatoryAddonsCad}) exceed standard retail threshold.`,
    };
  }

  return { isFlagged: false };
}
