import { createServerClient } from '@/lib/supabase/server';
import { CanadianProvince } from '@/lib/types/contracts';

export interface EligibleNudgeItem {
  submissionId: string;
  editToken: string;
  email: string;
  model: string;
  modelSlug: string;
  powertrain?: string;
  trim?: string | null;
  province: CanadianProvince | string;
  orderDate: string;
  daysWaited: number;
  stage: string;
  lastNudgedAt?: string | null;
  unsubscribeToken?: string;
}

// In-memory test store of submissions with nudge tracking
const inMemoryNudgeCandidates: EligibleNudgeItem[] = [];

export function addInMemoryNudgeCandidate(item: EligibleNudgeItem) {
  inMemoryNudgeCandidates.push(item);
}

export function clearInMemoryNudgeCandidates() {
  inMemoryNudgeCandidates.length = 0;
}

/**
 * Finds active waiting orders eligible for milestone check-in nudges.
 * Criteria:
 * 1. Active milestone stage ('deposit_placed', 'allocation_confirmed', 'in_transit') and pending status.
 * 2. It has been >= 60 days since order_date or stage_updated_at.
 * 3. No nudge sent in the last 60 days (last_nudged_at is NULL or older than 60 days).
 * 4. An email exists on the record or linked notification subscription.
 */
export async function findEligibleNudgeSubmissions(): Promise<EligibleNudgeItem[]> {
  const eligibleList: EligibleNudgeItem[] = [];
  const now = new Date();

  // 1. Supabase live connection
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock-')
  ) {
    try {
      const supabase = createServerClient();

      // Query active submissions
      const { data: submissions, error } = await supabase
        .from('submissions')
        .select(`
          id,
          email,
          order_date,
          stage,
          current_stage,
          status,
          stage_updated_at,
          last_nudged_at,
          edit_token,
          province,
          vehicle_models(name, slug),
          vehicle_powertrains(name, slug),
          vehicle_trims(name, slug)
        `)
        .or('is_flagged.eq.false,is_flagged.is.null')
        .in('stage', ['deposit_placed', 'allocation_confirmed', 'in_transit'])
        .eq('status', 'pending');

      if (!error && Array.isArray(submissions)) {
        // Query active notification requests for email fallback
        const { data: notifications } = await supabase
          .from('notification_requests')
          .select('email, model, province, trim, unsubscribe_token')
          .eq('is_active', true);

        const notifMap = new Map<string, { email: string; unsubscribeToken: string }>();
        if (Array.isArray(notifications)) {
          for (const n of notifications) {
            const key = `${n.model?.toLowerCase()}::${n.province?.toUpperCase()}`;
            if (!notifMap.has(key)) {
              notifMap.set(key, { email: n.email, unsubscribeToken: n.unsubscribe_token });
            }
          }
        }

        for (const sub of submissions) {
          const orderTime = new Date(sub.order_date).getTime();
          if (isNaN(orderTime)) continue;

          const daysSinceOrder = Math.max(0, Math.floor((now.getTime() - orderTime) / (1000 * 60 * 60 * 24)));
          const stageUpdateTime = sub.stage_updated_at ? new Date(sub.stage_updated_at).getTime() : orderTime;
          const daysSinceStageUpdate = Math.max(0, Math.floor((now.getTime() - stageUpdateTime) / (1000 * 60 * 60 * 24)));

          // Check milestone threshold (at least 60 days elapsed)
          if (daysSinceOrder < 60 && daysSinceStageUpdate < 60) {
            continue;
          }

          // Check last nudge date (must be > 60 days since last nudge)
          if (sub.last_nudged_at) {
            const lastNudgeTime = new Date(sub.last_nudged_at).getTime();
            const daysSinceLastNudge = Math.floor((now.getTime() - lastNudgeTime) / (1000 * 60 * 60 * 24));
            if (daysSinceLastNudge < 60) {
              continue;
            }
          }

          // Resolve email
          const modelName = (sub.vehicle_models as any)?.name || 'Toyota';
          const modelSlug = (sub.vehicle_models as any)?.slug || 'rav4';
          const lookupKey = `${modelSlug}::${sub.province?.toUpperCase()}`;
          const linkedNotif = notifMap.get(lookupKey);

          const email = sub.email || linkedNotif?.email;
          if (!email) {
            continue; // No email on record or linked notification request
          }

          eligibleList.push({
            submissionId: sub.id,
            editToken: sub.edit_token || sub.id,
            email,
            model: modelName,
            modelSlug,
            powertrain: (sub.vehicle_powertrains as any)?.name,
            trim: (sub.vehicle_trims as any)?.name,
            province: sub.province,
            orderDate: sub.order_date,
            daysWaited: daysSinceOrder,
            stage: sub.stage || sub.current_stage || 'deposit_placed',
            lastNudgedAt: sub.last_nudged_at,
            unsubscribeToken: linkedNotif?.unsubscribeToken,
          });
        }

        return eligibleList;
      }
    } catch (err) {
      console.warn('Supabase findEligibleNudgeSubmissions fallback to memory:', err);
    }
  }

  // 2. In-memory candidate fallback
  for (const item of inMemoryNudgeCandidates) {
    eligibleList.push(item);
  }

  return eligibleList;
}

/**
 * Updates last_nudged_at timestamp on a submission.
 */
export async function recordNudgeSent(submissionId: string): Promise<boolean> {
  const nowIso = new Date().toISOString();

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock-')
  ) {
    try {
      const supabase = createServerClient();
      const { error } = await supabase
        .from('submissions')
        .update({ last_nudged_at: nowIso })
        .eq('id', submissionId);

      if (!error) return true;
    } catch (err) {
      console.warn('Failed to record nudge timestamp in Supabase:', err);
    }
  }

  // In-memory update
  const inMem = inMemoryNudgeCandidates.find((c) => c.submissionId === submissionId);
  if (inMem) {
    inMem.lastNudgedAt = nowIso;
  }

  return true;
}
