// ============================================================================
// EPHEMERAL IN-MEMORY / EDGE SLIDING-WINDOW RATE LIMITER
// Zero-PII Guarantee: IP addresses are used in ephemeral memory only and
// are never persisted to long-term storage or database.
// ============================================================================

interface RateLimitRecord {
  timestamps: number[];
}

const memoryStore = new Map<string, RateLimitRecord>();

// Clean up expired entries every 10 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    for (const [key, record] of memoryStore.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < twentyFourHours);
      if (record.timestamps.length === 0) {
        memoryStore.delete(key);
      }
    }
  }, 10 * 60 * 1000).unref?.();
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp in seconds
}

export async function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 24 * 60 * 60 * 1000 // 24 hours
): Promise<RateLimitResult> {
  // If no identifier provided, allow
  if (!identifier) {
    return { success: true, limit, remaining: limit, reset: Math.floor((Date.now() + windowMs) / 1000) };
  }

  const now = Date.now();
  const record = memoryStore.get(identifier) || { timestamps: [] };

  // Filter timestamps within current sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0];
    const reset = Math.floor((oldest + windowMs) / 1000);
    return {
      success: false,
      limit,
      remaining: 0,
      reset,
    };
  }

  // Record this request
  record.timestamps.push(now);
  memoryStore.set(identifier, record);

  const reset = Math.floor((now + windowMs) / 1000);
  return {
    success: true,
    limit,
    remaining: limit - record.timestamps.length,
    reset,
  };
}

// Reset rate limiter for testing
export function _resetRateLimiter() {
  memoryStore.clear();
}
