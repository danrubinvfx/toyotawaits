import { createServerClient, isLiveSupabaseConfigured } from '@/lib/supabase/server';
import { getCommunitySubmissions } from '@/lib/db/submissions';

export interface DealerReportRecord {
  dealer_name?: string | null;
  dealership_name?: string | null;
  dealership?: string | null;
  province?: string | null;
  state?: string | null;
  pricing?: string | null;
  at_msrp?: boolean | null;
  doc_fee?: number | null;
  doc_fee_charged?: number | null;
  mandatory_addons?: number | null;
  mandatory_addons_cad?: number | null;
}

export interface DealerScorecardEntry {
  key: string;
  dealerName: string;
  province: string;
  verifiedReportsCount: number;
  straightMsrpPct: number;
  medianDocFee: number | null;
  isMsrpVerified: boolean;
  needsConfirmation: boolean;
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

/**
 * Pure aggregation of crowdsourced submissions and dealer intel tips
 * by dealership name and province/state.
 */
export function aggregateDealerScorecards(records: DealerReportRecord[]): DealerScorecardEntry[] {
  const groups = new Map<
    string,
    {
      dealerName: string;
      province: string;
      total: number;
      straightMsrpCount: number;
      docFees: number[];
    }
  >();

  for (const row of records) {
    const rawDealer = (row.dealer_name || row.dealership_name || row.dealership || '').trim();
    if (!rawDealer || rawDealer === '__CANARY_HEALTH_CHECK__') continue;

    const province = (row.province || row.state || 'CA').trim().toUpperCase();
    const key = `${rawDealer.toLowerCase()}::${province}`;

    const existing = groups.get(key) ?? {
      dealerName: rawDealer,
      province,
      total: 0,
      straightMsrpCount: 0,
      docFees: [],
    };

    existing.total += 1;

    const addons = Number(row.mandatory_addons ?? row.mandatory_addons_cad ?? 0);
    const isAtMsrp =
      row.at_msrp === true ||
      row.pricing === 'at_msrp' ||
      row.pricing === 'below_msrp';
    if (isAtMsrp && (!Number.isFinite(addons) || addons <= 0)) {
      existing.straightMsrpCount += 1;
    }

    const docFeeVal = row.doc_fee ?? row.doc_fee_charged;
    if (docFeeVal != null && Number.isFinite(Number(docFeeVal)) && Number(docFeeVal) >= 0) {
      existing.docFees.push(Number(docFeeVal));
    }

    groups.set(key, existing);
  }

  const entries: DealerScorecardEntry[] = [];
  for (const [key, g] of groups.entries()) {
    const straightMsrpPct = g.total > 0 ? Math.round((g.straightMsrpCount / g.total) * 100) : 0;
    const medianDocFee = computeMedian(g.docFees);
    const needsConfirmation = g.total < 2;
    const isMsrpVerified =
      !needsConfirmation &&
      straightMsrpPct >= 85 &&
      (medianDocFee === null || medianDocFee <= 599);

    entries.push({
      key,
      dealerName: g.dealerName,
      province: g.province,
      verifiedReportsCount: g.total,
      straightMsrpPct,
      medianDocFee,
      isMsrpVerified,
      needsConfirmation,
    });
  }

  return entries.sort((a, b) => {
    if (a.isMsrpVerified !== b.isMsrpVerified) return a.isMsrpVerified ? -1 : 1;
    if (a.needsConfirmation !== b.needsConfirmation) return a.needsConfirmation ? 1 : -1;
    if (b.straightMsrpPct !== a.straightMsrpPct) return b.straightMsrpPct - a.straightMsrpPct;
    return b.verifiedReportsCount - a.verifiedReportsCount;
  });
}

export async function getDealerScorecards(market: 'CA' | 'US' = 'CA'): Promise<DealerScorecardEntry[]> {
  const records: DealerReportRecord[] = [];

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = createServerClient({ revalidate: 3600, tags: ['submissions', 'benchmarks'] });
      const { data } = await supabase
        .from('submissions')
        .select('dealership_name, province, state, pricing, doc_fee, mandatory_addons, mandatory_addons_cad, country')
        .eq('country', market)
        .not('dealership_name', 'is', null)
        .limit(500);

      if (Array.isArray(data)) {
        for (const r of data) {
          records.push(r as DealerReportRecord);
        }
      }
    } catch {
      // Fall back to community submissions below
    }
  }

  if (records.length === 0) {
    try {
      const community = await getCommunitySubmissions(market, {
        revalidate: 3600,
        tags: ['submissions', 'benchmarks'],
        limit: 200,
      });
      for (const s of community) {
        records.push({
          dealership_name: s.dealershipName || s.city,
          province: s.province,
          pricing: s.pricing,
          doc_fee: (s as { docFee?: number | null }).docFee ?? null,
          mandatory_addons_cad: s.addonsCad ?? 0,
        });
      }
    } catch {
      // Return empty gracefully
    }
  }

  return aggregateDealerScorecards(records);
}
