/**
 * Races an async operation against a timeout, returning a fallback value or
 * rejecting with an Error if the deadline is exceeded.
 * Always clears the timer so Node/Vitest event loops never hang.
 */
export async function withTimeout<T>(
  promise: PromiseLike<T>,
  timeoutMs: number,
  fallbackValue?: T
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<T>((resolve, reject) => {
    timer = setTimeout(() => {
      if (fallbackValue !== undefined) {
        resolve(fallbackValue);
      } else {
        reject(new Error(`Operation timed out after ${timeoutMs}ms`));
      }
    }, timeoutMs);
  });

  try {
    return await Promise.race([Promise.resolve(promise), timeoutPromise]);
  } finally {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  }
}
