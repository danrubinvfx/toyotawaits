import { createServerClient, isLiveSupabaseConfigured } from '@/lib/supabase/server';
import { getCommunitySubmissions } from '@/lib/db/submissions';
import { getModelConfig } from '@/lib/data/model-registry';

export type TrimOutcomeBadge =
  | '🟢 Straight MSRP Common'
  | '🟡 Watch Doc / Add-Ons'
  | '🔴 Heavy Add-On Risk'
  | '⚪ Needs Reports';

export interface TrimSubmissionInput {
  trim?: string | null;
  pricing?: string | null;
  at_msrp?: boolean | null;
  doc_fee?: number | null;
  doc_fee_charged?: number | null;
  mandatory_addons?: number | null;
  mandatory_addons_cad?: number | null;
  adm_markup?: number | null;
  dealer_markup_adm?: number | null;
}

export interface DiscoveryListingInput {
  trim?: string | null;
  model?: string | null;
}

export interface TrimTransparencyMetric {
  trim: string;
  reportCount: number;
  straightMsrpPct: number | null;
  medianDocFee: number | null;
  medianAddons: number | null;
  badge: TrimOutcomeBadge;
  observedUnits: number;
  allocationSharePct: number | null;
  allocationShareLabel: string;
}

export interface TrimTransparencySummary {
  modelSlug: string;
  market: 'CA' | 'US';
  totalVerifiedReports: number;
  totalObservedUnits: number;
  overallStraightMsrpPct: number | null;
  overallMedianDocFee: number | null;
  overallMedianAddons: number | null;
  trims: TrimTransparencyMetric[];
}

function computeMedian(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) {
    return Math.round(sorted[mid]);
  }
  return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

export function normalizeTrimKey(rawTrim: string | null | undefined): string {
  const clean = (rawTrim || '').trim();
  if (!clean) return 'Unspecified';
  return clean.replace(/\s+/g, ' ');
}

export function classifyTrimBadge(
  reportCount: number,
  straightMsrpPct: number | null,
  medianAddons: number | null
): TrimOutcomeBadge {
  if (reportCount <= 0 || straightMsrpPct === null) {
    return '⚪ Needs Reports';
  }
  const addons = medianAddons ?? 0;
  if (straightMsrpPct >= 75 && addons <= 250) {
    return '🟢 Straight MSRP Common';
  }
  if (straightMsrpPct < 40 || addons > 1200) {
    return '🔴 Heavy Add-On Risk';
  }
  return '🟡 Watch Doc / Add-Ons';
}

/**
 * Pure computation of trim-level MSRP transparency & Convertus allocation share.
 * Guarantees zero NaN values when trims have 0 reports or 0 observed units.
 */
export function computeTrimTransparencyMetrics(
  modelSlug: string,
  market: 'CA' | 'US',
  submissions: TrimSubmissionInput[],
  listings: DiscoveryListingInput[]
): TrimTransparencySummary {
  const trimGroups = new Map<
    string,
    {
      displayTrim: string;
      reportCount: number;
      straightMsrpCount: number;
      docFees: number[];
      addons: number[];
      observedUnits: number;
    }
  >();

  const ensureGroup = (rawTrim: string | null | undefined) => {
    const displayTrim = normalizeTrimKey(rawTrim);
    const key = displayTrim.toLowerCase();
    let group = trimGroups.get(key);
    if (!group) {
      group = {
        displayTrim,
        reportCount: 0,
        straightMsrpCount: 0,
        docFees: [],
        addons: [],
        observedUnits: 0,
      };
      trimGroups.set(key, group);
    }
    return group;
  };

  let overallReports = 0;
  let overallStraightMsrp = 0;
  const allDocFees: number[] = [];
  const allAddons: number[] = [];

  for (const sub of submissions) {
    const group = ensureGroup(sub.trim);
    group.reportCount += 1;
    overallReports += 1;

    const addonsVal =
      market === 'US'
        ? Number(sub.adm_markup ?? sub.dealer_markup_adm ?? sub.mandatory_addons ?? sub.mandatory_addons_cad ?? 0)
        : Number(sub.mandatory_addons ?? sub.mandatory_addons_cad ?? 0);
    const safeAddons = Number.isFinite(addonsVal) && addonsVal >= 0 ? addonsVal : 0;

    const isAtMsrp =
      sub.at_msrp === true ||
      sub.pricing === 'at_msrp' ||
      sub.pricing === 'below_msrp';

    if (isAtMsrp && safeAddons <= 0) {
      group.straightMsrpCount += 1;
      overallStraightMsrp += 1;
    }

    group.addons.push(safeAddons);
    allAddons.push(safeAddons);

    const docVal = sub.doc_fee ?? sub.doc_fee_charged;
    if (docVal != null && Number.isFinite(Number(docVal)) && Number(docVal) >= 0) {
      const n = Number(docVal);
      group.docFees.push(n);
      allDocFees.push(n);
    }
  }

  let totalObservedUnits = 0;
  for (const listing of listings) {
    const group = ensureGroup(listing.trim);
    group.observedUnits += 1;
    totalObservedUnits += 1;
  }

  const trims: TrimTransparencyMetric[] = [];
  for (const g of trimGroups.values()) {
    const straightMsrpPct =
      g.reportCount > 0 ? Math.round((g.straightMsrpCount / g.reportCount) * 100) : null;
    const medianDocFee = computeMedian(g.docFees);
    const medianAddons = computeMedian(g.addons);
    const badge = classifyTrimBadge(g.reportCount, straightMsrpPct, medianAddons);

    const allocationSharePct =
      totalObservedUnits > 0 && g.observedUnits > 0
        ? Math.round((g.observedUnits / totalObservedUnits) * 100)
        : totalObservedUnits > 0
        ? 0
        : null;

    const allocationShareLabel =
      allocationSharePct !== null
        ? `${allocationSharePct}% of observed incoming units`
        : 'No live sweep units';

    trims.push({
      trim: g.displayTrim,
      reportCount: g.reportCount,
      straightMsrpPct,
      medianDocFee,
      medianAddons,
      badge,
      observedUnits: g.observedUnits,
      allocationSharePct,
      allocationShareLabel,
    });
  }

  trims.sort((a, b) => {
    if (b.observedUnits !== a.observedUnits) return b.observedUnits - a.observedUnits;
    return b.reportCount - a.reportCount;
  });

  const overallStraightMsrpPct =
    overallReports > 0 ? Math.round((overallStraightMsrp / overallReports) * 100) : null;

  return {
    modelSlug,
    market,
    totalVerifiedReports: overallReports,
    totalObservedUnits,
    overallStraightMsrpPct,
    overallMedianDocFee: computeMedian(allDocFees),
    overallMedianAddons: computeMedian(allAddons),
    trims,
  };
}

/**
 * Finds the best matching trim metric for a catalog trim label (e.g. "XLE Hybrid" -> "XLE").
 */
export function findTrimMetric(
  summary: TrimTransparencySummary,
  trimLabel: string
): TrimTransparencyMetric | null {
  if (!summary.trims.length) return null;
  const target = trimLabel.trim().toLowerCase();
  const exact = summary.trims.find((t) => t.trim.toLowerCase() === target);
  if (exact) return exact;

  const partial = summary.trims.find((t) => {
    const k = t.trim.toLowerCase();
    return k !== 'unspecified' && (target.includes(k) || k.includes(target));
  });
  return partial ?? null;
}

export async function getTrimTransparencyMetrics(
  modelSlug: string,
  market: 'CA' | 'US' = 'CA'
): Promise<TrimTransparencySummary> {
  const modelConfig = getModelConfig(modelSlug);
  const dbFilter = modelConfig?.dbFilter || modelSlug;

  const submissions: TrimSubmissionInput[] = [];
  const listings: DiscoveryListingInput[] = [];

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = createServerClient({ revalidate: 3600, tags: ['submissions', 'benchmarks'] });

      const { data: subRows } = await supabase
        .from('submissions')
        .select('trim_name, pricing, doc_fee, mandatory_addons, mandatory_addons_cad, adm_markup, dealer_markup_adm, country')
        .eq('country', market)
        .limit(250);

      if (Array.isArray(subRows)) {
        for (const r of subRows) {
          submissions.push({
            trim: (r as any).trim_name ?? null,
            pricing: (r as any).pricing ?? null,
            doc_fee: (r as any).doc_fee ?? null,
            mandatory_addons: (r as any).mandatory_addons ?? null,
            mandatory_addons_cad: (r as any).mandatory_addons_cad ?? null,
            adm_markup: (r as any).adm_markup ?? null,
            dealer_markup_adm: (r as any).dealer_markup_adm ?? null,
          });
        }
      }

      const { data: listingRows } = await supabase
        .from('discovery_listings')
        .select('trim, model')
        .ilike('model', `%${dbFilter}%`)
        .limit(250);

      if (Array.isArray(listingRows)) {
        for (const l of listingRows) {
          listings.push({
            trim: (l as any).trim ?? null,
            model: (l as any).model ?? null,
          });
        }
      }
    } catch {
      // Fallback gracefully below
    }
  }

  if (submissions.length === 0) {
    try {
      const community = await getCommunitySubmissions(market, {
        revalidate: 3600,
        tags: ['submissions', 'benchmarks'],
        limit: 100,
      });
      for (const s of community) {
        const slugMatch = s.modelSlug?.toLowerCase() === modelSlug.toLowerCase();
        const nameMatch = s.model?.toLowerCase().includes(dbFilter.toLowerCase());
        if (slugMatch || nameMatch) {
          submissions.push({
            trim: s.trim,
            pricing: s.pricing,
            doc_fee: (s as { docFee?: number | null }).docFee ?? null,
            mandatory_addons_cad: s.addonsCad ?? 0,
            adm_markup: s.dealerMarkupAdm ?? null,
          });
        }
      }
    } catch {
      // Return empty gracefully
    }
  }

  return computeTrimTransparencyMetrics(modelSlug, market, submissions, listings);
}
