import { createServerClient, isLiveSupabaseConfigured } from '@/lib/supabase/server';
import { withTimeout } from '@/lib/utils/timeout';

export type RolloverPriceStatus =
  | 'not_applicable'
  | 'honored_2026_msrp'
  | 'adjusted_2027_msrp';

export interface RolloverPriceProtectionStats {
  modelSlug: string;
  totalRollovers: number;
  honoredCount: number;
  adjustedCount: number;
  honoredPercent: number;
  adjustedPercent: number;
  hasSufficientSample: boolean;
}

export function computeRolloverPriceProtectionStats(
  modelSlug: string,
  rows: Array<{ rollover_price_status?: string | null }>
): RolloverPriceProtectionStats {
  let honoredCount = 0;
  let adjustedCount = 0;

  for (const row of rows) {
    if (row.rollover_price_status === 'honored_2026_msrp') {
      honoredCount += 1;
    } else if (row.rollover_price_status === 'adjusted_2027_msrp') {
      adjustedCount += 1;
    }
  }

  const totalRollovers = honoredCount + adjustedCount;
  const honoredPercent =
    totalRollovers > 0 ? Math.round((honoredCount / totalRollovers) * 100) : 0;
  const adjustedPercent = totalRollovers > 0 ? 100 - honoredPercent : 0;

  return {
    modelSlug,
    totalRollovers,
    honoredCount,
    adjustedCount,
    honoredPercent,
    adjustedPercent,
    hasSufficientSample: totalRollovers >= 3,
  };
}

export async function getRolloverPriceProtectionStats(
  modelSlug: string
): Promise<RolloverPriceProtectionStats> {
  const cleanSlug = modelSlug.toLowerCase().trim();
  const empty = computeRolloverPriceProtectionStats(cleanSlug, []);

  if (!isLiveSupabaseConfigured()) {
    return empty;
  }

  try {
    const supabase = createServerClient({ revalidate: 300, tags: ['submissions', 'rollover-stats'] });
    const result = await withTimeout(
      supabase
        .from('submissions')
        .select('rollover_price_status, vehicle_models!inner(slug)')
        .eq('vehicle_models.slug', cleanSlug)
        .in('rollover_price_status', ['honored_2026_msrp', 'adjusted_2027_msrp'])
        .limit(500),
      2500
    );

    if (result.error || !Array.isArray(result.data)) {
      return empty;
    }

    return computeRolloverPriceProtectionStats(cleanSlug, result.data);
  } catch {
    return empty;
  }
}
