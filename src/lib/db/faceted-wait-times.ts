import { getAggregateStats } from '@/lib/db/aggregate';
import { withTimeout } from '@/lib/utils/timeout';

export interface FacetedRouteWaitStats {
  medianDays: number;
  p25Days: number;
  p75Days: number;
  sampleCount: number;
  source: 'live' | 'baseline';
}

export function getStaticBaselinePriors(
  modelSlug: string,
  powertrainSlug: string,
  provinceCode: string
): FacetedRouteWaitStats {
  const model = modelSlug.toLowerCase();
  const powertrain = powertrainSlug.toLowerCase();
  const province = provinceCode.toUpperCase();

  if (model === 'sienna') {
    return { medianDays: 520, p25Days: 420, p75Days: 640, sampleCount: 185, source: 'baseline' };
  }
  if (model === 'rav4' && powertrain === 'phev') {
    if (['BC', 'QC'].includes(province)) {
      return { medianDays: 412, p25Days: 310, p75Days: 540, sampleCount: 215, source: 'baseline' };
    }
    return { medianDays: 380, p25Days: 280, p75Days: 490, sampleCount: 98, source: 'baseline' };
  }
  if (model === 'rav4' && powertrain === 'hev') {
    return {
      medianDays: ['BC', 'QC'].includes(province) ? 245 : 175,
      p25Days: 120,
      p75Days: 290,
      sampleCount: 240,
      source: 'baseline',
    };
  }
  if (model === 'grand-highlander') {
    return { medianDays: 280, p25Days: 210, p75Days: 380, sampleCount: 88, source: 'baseline' };
  }
  if (model === 'land-cruiser') {
    return { medianDays: 120, p25Days: 75, p75Days: 180, sampleCount: 38, source: 'baseline' };
  }
  if (model === 'prius' || model === 'prius-prime') {
    if (powertrain === 'phev') {
      return { medianDays: 181, p25Days: 120, p75Days: 240, sampleCount: 45, source: 'baseline' };
    }
    return { medianDays: 104, p25Days: 75, p75Days: 145, sampleCount: 35, source: 'baseline' };
  }
  if (model === 'sequoia') {
    return {
      medianDays: ['BC', 'ON'].includes(province) ? 260 : 210,
      p25Days: 180,
      p75Days: 330,
      sampleCount: 28,
      source: 'baseline',
    };
  }

  return { medianDays: 265, p25Days: 190, p75Days: 360, sampleCount: 65, source: 'baseline' };
}

export async function getFacetedRouteWaitStats(
  modelSlug: string,
  powertrainSlug: string,
  provinceCode: string
): Promise<FacetedRouteWaitStats> {
  const priors = getStaticBaselinePriors(modelSlug, powertrainSlug, provinceCode);

  try {
    const live = await withTimeout(
      getAggregateStats({
        model: modelSlug,
        powertrain: powertrainSlug,
        province: provinceCode as any,
        timeframe: 'all',
      }),
      3000
    );

    if (
      live?.waitStats &&
      !live.isBaselineFallback &&
      (live.sampleCounts?.delivered ?? 0) >= 3 &&
      Number.isFinite(live.waitStats.median) &&
      live.waitStats.median > 0
    ) {
      return {
        medianDays: live.waitStats.median,
        p25Days: live.waitStats.p25,
        p75Days: live.waitStats.p75,
        sampleCount: live.sampleCounts.total || priors.sampleCount,
        source: 'live',
      };
    }
  } catch {
    // Defensive fallback to static baseline estimator priors on Supabase error or timeout
  }

  return priors;
}
