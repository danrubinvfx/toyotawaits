/**
 * ToyotaWaits.ca - Calculator Model Resolution & Synchronization Helpers
 * Resolves active model configuration from URL params, tracker local storage,
 * and calculator pulldown selection.
 */

export interface ModelResolution {
  modelSlug: string;
  modelName: string;
  presetId: string;
  isPhev: boolean;
}

export function modelSlugToPresetId(modelOrSlug?: string | null): string | null {
  if (!modelOrSlug) return null;
  const s = modelOrSlug.toLowerCase().trim();
  if (s.includes('sienna')) return '2025-toyota-sienna-hybrid';
  if (s.includes('grand-highlander') || s.includes('grand_highlander') || s.includes('grand highlander')) {
    return '2025-toyota-grand-highlander-hybrid';
  }
  if (s.includes('camry')) return '2025-toyota-camry-hybrid';
  if (s.includes('prius')) return '2025-toyota-prius-hybrid';
  if (s.includes('crown')) return '2025-toyota-crown-signia-hybrid';
  if (s.includes('phev') || s.includes('prime')) return '2026-toyota-rav4-phev';
  if (s.includes('rav4')) return '2026-toyota-rav4-hybrid';
  return null;
}

export function presetIdToModelSlug(presetId?: string): string {
  if (!presetId) return 'rav4';
  const clean = presetId.toLowerCase();
  if (clean.includes('sienna')) return 'sienna';
  if (clean.includes('grand-highlander')) return 'grand-highlander';
  if (clean.includes('camry')) return 'camry';
  if (clean.includes('prius')) return 'prius';
  if (clean.includes('crown')) return 'crown-signia';
  if (clean.includes('rav4')) return 'rav4';
  return 'rav4';
}

export function presetIdToModelName(presetId?: string): string {
  if (!presetId) return 'RAV4';
  const clean = presetId.toLowerCase();
  if (clean.includes('sienna')) return 'Sienna';
  if (clean.includes('grand-highlander')) return 'Grand Highlander';
  if (clean.includes('camry')) return 'Camry';
  if (clean.includes('prius')) return 'Prius';
  if (clean.includes('crown')) return 'Crown Signia';
  if (clean.includes('rav4-phev') || clean.includes('prime')) return 'RAV4 Prime';
  if (clean.includes('rav4')) return 'RAV4';
  return 'RAV4';
}

/**
 * Normalizes any model slug, vehicle preset ID, or name into a canonical /wait-times/[model] route slug.
 * Strips powertrain suffixes (-hev, -phev, -hybrid, etc.) so internal navigation links never 404.
 */
export function toCanonicalWaitTimeSlug(slugOrPreset?: string | null): string {
  if (!slugOrPreset) return 'rav4';
  const clean = slugOrPreset.toLowerCase().trim().replace(/[\s_]+/g, '-');
  if (clean.includes('crown')) return 'crown-signia';
  if (clean.includes('grand-highlander') || clean.includes('grandhighlander')) return 'grand-highlander';
  if (clean.includes('corolla-cross') || clean.includes('corollacross')) return 'corolla-cross';
  if (clean.includes('land-cruiser') || clean.includes('landcruiser')) return 'land-cruiser';
  if (clean.includes('sienna')) return 'sienna';
  if (clean.includes('highlander')) return 'highlander';
  if (clean.includes('rav4')) return 'rav4';
  if (clean.includes('camry')) return 'camry';
  if (clean.includes('prius')) return 'prius';
  if (clean.includes('tacoma')) return 'tacoma';
  if (clean.includes('tundra')) return 'tundra';
  if (clean.includes('4runner')) return '4runner';
  if (clean.includes('sequoia')) return 'sequoia';
  return clean.replace(/-(hybrid|phev|hev|gas|prime|awd|fwd)$/g, '').trim();
}

/**
 * Resolves previously tracked vehicle from localStorage (tracker context)
 */
export function resolveTrackerContextModel(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    // 1. Pending submission
    const pendingRaw = localStorage.getItem('toyotawait_pending_submission');
    if (pendingRaw) {
      const parsed = JSON.parse(pendingRaw);
      const m = parsed?.model_slug || parsed?.model || parsed?.model_name;
      if (m) return String(m).toLowerCase();
    }
    // 2. Active confirmed submission
    const confirmedRaw = localStorage.getItem('toyotawaits_submission');
    if (confirmedRaw) {
      const parsed = JSON.parse(confirmedRaw);
      const m = parsed?.model_slug || parsed?.model || parsed?.model_name;
      if (m) return String(m).toLowerCase();
    }
    // 3. User submissions array
    const mySubsRaw = localStorage.getItem('toyotawait_my_submissions');
    if (mySubsRaw) {
      const parsed = JSON.parse(mySubsRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const m = parsed[0]?.model_slug || parsed[0]?.model || parsed[0]?.model_name;
        if (m) return String(m).toLowerCase();
      }
    }
  } catch {
    // Graceful fallback on localStorage restriction
  }
  return null;
}
