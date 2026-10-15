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
  windowMs: number = 24 * 60 * 60 * 1000, // 24 hours
  record: boolean = false
): Promise<RateLimitResult> {
  // If no identifier provided, allow
  if (!identifier) {
    return { success: true, limit, remaining: limit, reset: Math.floor((Date.now() + windowMs) / 1000) };
  }

  const now = Date.now();
  const entry = memoryStore.get(identifier) || { timestamps: [] };

  // Filter timestamps within current sliding window
  entry.timestamps = entry.timestamps.filter((ts) => now - ts < windowMs);

  if (entry.timestamps.length >= limit) {
    const oldest = entry.timestamps[0];
    const reset = Math.floor((oldest + windowMs) / 1000);
    return {
      success: false,
      limit,
      remaining: 0,
      reset,
    };
  }

  // Only record if explicitly requested (e.g., legacy or single-step calls)
  if (record) {
    entry.timestamps.push(now);
    memoryStore.set(identifier, entry);
  }

  const reset = Math.floor((now + windowMs) / 1000);
  return {
    success: true,
    limit,
    remaining: limit - entry.timestamps.length,
    reset,
  };
}

/**
 * Consumes one quota attempt for the given identifier upon successful operation completion.
 */
export async function consumeRateLimit(
  identifier: string,
  windowMs: number = 24 * 60 * 60 * 1000
): Promise<void> {
  if (!identifier) return;

  const now = Date.now();
  const entry = memoryStore.get(identifier) || { timestamps: [] };
  entry.timestamps = entry.timestamps.filter((ts) => now - ts < windowMs);
  entry.timestamps.push(now);
  memoryStore.set(identifier, entry);
}

/**
 * Rolls back the latest recorded attempt for the identifier in case an operation fails.
 */
export async function rollbackRateLimit(identifier: string): Promise<void> {
  if (!identifier) return;

  const entry = memoryStore.get(identifier);
  if (entry && entry.timestamps.length > 0) {
    entry.timestamps.pop();
    if (entry.timestamps.length === 0) {
      memoryStore.delete(identifier);
    }
  }
}

// Reset rate limiter for testing
export function _resetRateLimiter() {
  memoryStore.clear();
}
