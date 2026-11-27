import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import {
  generateWeeklyPipelineBriefEmail,
  getWeeklyGearPicks,
  type CommunityDeliveryPulseItem,
  type WaitTimeMover,
} from '../src/emails/WeeklyPipelineBriefEmail';
import { toCanonicalWaitTimeSlug } from '../src/lib/calculator-model-helpers';

interface SubscriberRow {
  id: string;
  email: string;
  country: 'CA' | 'US' | null;
  unsubscribe_token: string;
}

interface SubmissionRow {
  wait_days: number | null;
  province: string | null;
  state: string | null;
  country_code?: string | null;
  delivery_date: string | null;
  created_at: string;
  vehicle_models?: { name?: string | null; slug?: string | null } | { name?: string | null; slug?: string | null }[] | null;
}

function computeMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  }
  return Math.round(sorted[mid]);
}

function extractModelInfo(sub: SubmissionRow): { name: string; slug: string } {
  const vm = Array.isArray(sub.vehicle_models) ? sub.vehicle_models[0] : sub.vehicle_models;
  const rawName = vm?.name?.trim() || 'Toyota Hybrid';
  const rawSlug = vm?.slug?.trim() || rawName.toLowerCase().replace(/\s+/g, '-');
  return {
    name: rawName,
    slug: toCanonicalWaitTimeSlug(rawSlug) || rawSlug,
  };
}

async function fetchAccessoryPopularity30d(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  now: Date
): Promise<Record<string, number>> {
  const { data: viewData, error: viewError } = await supabase
    .from('view_accessory_popularity_30d')
    .select('accessory_id, click_count');

  if (!viewError && Array.isArray(viewData)) {
    const counts: Record<string, number> = {};
    for (const row of viewData as Array<{ accessory_id?: string | null; click_count?: unknown }>) {
      if (row.accessory_id) {
        counts[row.accessory_id] = Number(row.click_count) || 0;
      }
    }
    return counts;
  }

  const thirtyDaysAgoIso = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data: rawRows, error: rawError } = await supabase
    .from('telemetry_affiliate_clicks')
    .select('accessory_id')
    .gte('created_at', thirtyDaysAgoIso);

  if (rawError || !Array.isArray(rawRows)) {
    return {};
  }

  const counts: Record<string, number> = {};
  for (const row of rawRows as Array<{ accessory_id?: string | null }>) {
    if (row.accessory_id) {
      counts[row.accessory_id] = (counts[row.accessory_id] || 0) + 1;
    }
  }
  return counts;
}

async function fetchFreshLotSightingsCount(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  sevenDaysAgoIso: string
): Promise<number> {
  // Primary: discovery_listings over past 7 days (unreserved/active)
  const { count: discoveryCount, error: discoveryError } = await supabase
    .from('discovery_listings')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', sevenDaysAgoIso);

  if (!discoveryError && typeof discoveryCount === 'number') {
    return discoveryCount;
  }

  // Graceful fallback: dealer_listings over past 7 days
  const { count: dealerCount, error: dealerError } = await supabase
    .from('dealer_listings')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', sevenDaysAgoIso);

  if (!dealerError && typeof dealerCount === 'number') {
    return dealerCount;
  }

  return 0;
}

async function fetchDigestMetrics(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  country: 'CA' | 'US',
  sevenDaysAgoIso: string
): Promise<{
  waitTimeMovers: WaitTimeMover[];
  deliveryPulse: CommunityDeliveryPulseItem[];
}> {
  // Fetch recent delivered submissions (last 7 days first, fallback to recent 30 days if sparse)
  const { data: recentSubs } = await supabase
    .from('submissions')
    .select(
      'wait_days, province, state, country_code, delivery_date, created_at, vehicle_models(name, slug)'
    )
    .eq('status', 'delivered')
    .eq('is_flagged', false)
    .not('wait_days', 'is', null)
    .gte('created_at', sevenDaysAgoIso)
    .order('delivery_date', { ascending: false })
    .limit(100);

  let rows: SubmissionRow[] = Array.isArray(recentSubs) ? recentSubs : [];

  // Filter by country if country_code is populated
  const countryFiltered = rows.filter((r) => !r.country_code || r.country_code === country);
  if (countryFiltered.length > 0) {
    rows = countryFiltered;
  }

  if (rows.length === 0) {
    const { data: fallbackSubs } = await supabase
      .from('submissions')
      .select(
        'wait_days, province, state, country_code, delivery_date, created_at, vehicle_models(name, slug)'
      )
      .eq('status', 'delivered')
      .eq('is_flagged', false)
      .not('wait_days', 'is', null)
      .order('delivery_date', { ascending: false })
      .limit(30);

    const fallbackRows: SubmissionRow[] = Array.isArray(fallbackSubs) ? fallbackSubs : [];
    const filteredFallback = fallbackRows.filter(
      (r) => !r.country_code || r.country_code === country
    );
    rows = filteredFallback.length > 0 ? filteredFallback : fallbackRows;
  }

  // Group wait days by model for top 3 movers
  const byModel = new Map<string, { name: string; slug: string; waits: number[] }>();
  for (const row of rows) {
    if (typeof row.wait_days !== 'number' || row.wait_days < 0) continue;
    const { name, slug } = extractModelInfo(row);
    const existing = byModel.get(slug) || { name, slug, waits: [] };
    existing.waits.push(row.wait_days);
    byModel.set(slug, existing);
  }

  const waitTimeMovers: WaitTimeMover[] = Array.from(byModel.values())
    .sort((a, b) => b.waits.length - a.waits.length)
    .slice(0, 3)
    .map((m) => ({
      modelName: m.name,
      modelSlug: m.slug,
      medianWaitDays: computeMedian(m.waits),
      sampleCount: m.waits.length,
    }));

  // 1-2 recent verified deliveries (Zero-PII: model, province/state, days waited)
  const deliveryPulse: CommunityDeliveryPulseItem[] = rows
    .filter((r) => typeof r.wait_days === 'number' && r.wait_days >= 0)
    .slice(0, 2)
    .map((r) => {
      const { name } = extractModelInfo(r);
      const regionCode =
        country === 'US'
          ? r.state || r.province || 'US'
          : r.province || r.state || 'CA';
      return {
        modelName: name,
        regionCode,
        waitDays: r.wait_days as number,
      };
    });

  return { waitTimeMovers, deliveryPulse };
}

async function main() {
  const isDryRun =
    process.argv.includes('--dry-run') || process.env.DRY_RUN === 'true';

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail =
    process.env.RESEND_FROM_EMAIL?.trim() || 'ToyotaWaits <hello@toyotawaits.ca>';

  if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes('placeholder')) {
    console.error('[Weekly Newsletter] Missing live Supabase credentials.');
    process.exit(1);
  }

  if (!isDryRun && (!resendApiKey || resendApiKey.includes('placeholder'))) {
    console.error('[Weekly Newsletter] Missing RESEND_API_KEY for live dispatch.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const now = new Date();
  const sevenDaysAgoIso = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // 1. Fetch verified, active subscribers
  const { data: subscribers, error: subError } = await supabase
    .from('newsletter_subscriptions')
    .select('id, email, country, unsubscribe_token')
    .eq('is_verified', true)
    .eq('is_active', true);

  if (subError) {
    console.error('[Weekly Newsletter] Failed to fetch subscribers:', subError.message);
    process.exit(1);
  }

  const activeSubscribers: SubscriberRow[] = Array.isArray(subscribers) ? subscribers : [];
  console.log(
    `[Weekly Newsletter] Mode=${isDryRun ? 'DRY_RUN' : 'LIVE'} | Verified active subscribers=${activeSubscribers.length}`
  );

  if (activeSubscribers.length === 0) {
    console.log('[Weekly Newsletter] No verified active subscribers to notify. Exiting cleanly.');
    return;
  }

  // 2. Aggregate 7-day metrics & 30-day accessory popularity once per market
  const [freshLotSightingsCount, caMetrics, usMetrics, popularityCounts] = await Promise.all([
    fetchFreshLotSightingsCount(supabase, sevenDaysAgoIso),
    fetchDigestMetrics(supabase, 'CA', sevenDaysAgoIso),
    fetchDigestMetrics(supabase, 'US', sevenDaysAgoIso),
    fetchAccessoryPopularity30d(supabase, now),
  ]);

  const topGearCA = getWeeklyGearPicks('CA', now, popularityCounts).slice(0, 10);
  const topGearUS = getWeeklyGearPicks('US', now, popularityCounts).slice(0, 10);

  const resend = resendApiKey ? new Resend(resendApiKey) : null;

  let sentCount = 0;
  let failedCount = 0;

  for (const sub of activeSubscribers) {
    const country: 'CA' | 'US' = sub.country === 'US' ? 'US' : 'CA';
    const metrics = country === 'US' ? usMetrics : caMetrics;

    const emailPayload = generateWeeklyPipelineBriefEmail({
      country,
      unsubscribeToken: sub.unsubscribe_token,
      waitTimeMovers: metrics.waitTimeMovers,
      freshLotSightingsCount,
      deliveryPulse: metrics.deliveryPulse,
      gearPicks: country === 'US' ? topGearUS : topGearCA,
      currentDate: now,
    });

    if (isDryRun) {
      sentCount++;
      continue;
    }

    try {
      const { error: sendError } = await resend!.emails.send({
        from: fromEmail,
        to: [sub.email],
        subject: emailPayload.subject,
        html: emailPayload.html,
        text: emailPayload.text,
      });

      if (sendError) {
        failedCount++;
        console.error(`[Weekly Newsletter] Resend error for subscriber ${sub.id}: ${sendError.message}`);
        continue;
      }

      await supabase
        .from('newsletter_subscriptions')
        .update({ last_sent_at: now.toISOString() })
        .eq('id', sub.id);

      sentCount++;
    } catch (err) {
      failedCount++;
      console.error(
        `[Weekly Newsletter] Unexpected error for subscriber ${sub.id}:`,
        err instanceof Error ? err.message : 'Unknown error'
      );
    }
  }

  console.log(
    `[Weekly Newsletter] Complete | sent=${sentCount} | failed=${failedCount} | freshLotSightings=${freshLotSightingsCount} | popularityKeys=${Object.keys(popularityCounts).length}`
  );

  if (failedCount > 0 && sentCount === 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[Weekly Newsletter] Fatal error:', err instanceof Error ? err.message : err);
  process.exit(1);
});
