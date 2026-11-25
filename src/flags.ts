import { cookies, headers } from 'next/headers';
import { flag } from 'flags/next';

export const AB_SEED_COOKIE = 'tw_ab_seed';
export const AB_SEED_HEADER = 'x-tw-ab-seed';

export type DropAlertCtaVariant = 'control' | 'urgency';
export type CalculatorBridgeFramingVariant = 'control' | 'cost_of_waiting';

/**
 * Deterministic 32-bit FNV-1a hash returning a 50/50 bucket (0 or 1)
 * for consistent per-visitor experiment assignment.
 */
export function hashSeedToBucket(seed: string, flagKey: string): 0 | 1 {
  const input = `${seed}:${flagKey}`;
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % 2 === 0 ? 0 : 1;
}

/**
 * Reads the per-visitor A/B bucketing seed from request cookies or middleware header.
 * Returns undefined in static builds or test environments without a request scope.
 */
export async function getVisitorSeed(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    const fromCookie = cookieStore.get(AB_SEED_COOKIE)?.value;
    if (fromCookie) {
      return fromCookie;
    }
  } catch {
    // No active request cookies (static build / unit test)
  }

  try {
    const headerStore = await headers();
    const fromHeader = headerStore.get(AB_SEED_HEADER);
    if (fromHeader) {
      return fromHeader;
    }
  } catch {
    // No active request headers
  }

  return undefined;
}

/**
 * Safely evaluates a feature flag in Server Components, falling back to `fallback`
 * when executed outside an active Next.js request scope (e.g., static build or Vitest).
 */
export async function evaluateFlagSafely<T>(
  flagFn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await flagFn();
  } catch {
    return fallback;
  }
}

export const dropAlertCtaVariant = flag<DropAlertCtaVariant>({
  key: 'drop-alert-cta-variant',
  defaultValue: 'control',
  description: 'A/B test for ModelDropAlertBridge headline and primary CTA urgency copy',
  options: [
    { value: 'control', label: 'Control (Skip the Queue)' },
    { value: 'urgency', label: 'Urgency (Next Lot Drop)' },
  ],
  async decide() {
    const seed = await getVisitorSeed();
    if (!seed) return 'control';
    return hashSeedToBucket(seed, 'drop-alert-cta-variant') === 1 ? 'urgency' : 'control';
  },
});

export const calculatorBridgeFraming = flag<CalculatorBridgeFramingVariant>({
  key: 'calculator-bridge-framing',
  defaultValue: 'control',
  description: 'A/B test for calculator bridge framing (fuel payback vs. cost of waiting)',
  options: [
    { value: 'control', label: 'Control (Fuel Payback)' },
    { value: 'cost_of_waiting', label: 'Cost of Waiting' },
  ],
  async decide() {
    const seed = await getVisitorSeed();
    if (!seed) return 'control';
    return hashSeedToBucket(seed, 'calculator-bridge-framing') === 1
      ? 'cost_of_waiting'
      : 'control';
  },
});

export const mobileStickyLogBar = flag<boolean>({
  key: 'mobile-sticky-log-bar',
  defaultValue: false,
  description: 'A/B test for dismissible sticky mobile + Log Your Order bar above MobileBottomDock',
  options: [
    { value: false, label: 'Control (Hidden)' },
    { value: true, label: 'Show Sticky Mobile Bar' },
  ],
  async decide() {
    const seed = await getVisitorSeed();
    if (!seed) return false;
    return hashSeedToBucket(seed, 'mobile-sticky-log-bar') === 1;
  },
});
