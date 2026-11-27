import React from 'react';
import { GEAR_MARKET_CATALOG, type GearMarketConfig } from '@/data/gear/catalog';
import { buildAmazonAffiliateUrl } from '@/lib/gear/affiliate';
import { getCurrentPromoConfig, sortGearByPromotions } from '@/lib/gear/promotions';
import { AMAZON_ASSOCIATES_DISCLOSURE } from '@/lib/alerts/templates';

export interface WaitTimeMover {
  modelName: string;
  modelSlug: string;
  medianWaitDays: number;
  deltaDays?: number | null;
  sampleCount: number;
}

export interface CommunityDeliveryPulseItem {
  modelName: string;
  regionCode: string; // Province or State code (e.g., BC, ON, WA)
  waitDays: number;
}

export interface WeeklyGearPick {
  id: string;
  rank?: number;
  title: string;
  description: string;
  fitment?: string;
  url: string;
  badge?: string;
  discountCode?: string;
  discountText?: string;
  isPartnerDeal?: boolean;
  clicks30d?: number;
}

export interface WeeklyPipelineBriefInput {
  country: 'CA' | 'US';
  unsubscribeToken: string;
  waitTimeMovers: WaitTimeMover[];
  freshLotSightingsCount: number;
  deliveryPulse: CommunityDeliveryPulseItem[];
  gearPicks?: WeeklyGearPick[];
  currentDate?: Date;
}

export interface GeneratedWeeklyPipelineBrief {
  subject: string;
  html: string;
  text: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getClicksForCatalogItem(
  id: string,
  cfg: GearMarketConfig,
  clickCounts: Record<string, number>
): number {
  const candidates = [id, cfg.slug, cfg.proxySlug].filter(
    (k): k is string => typeof k === 'string' && k.trim().length > 0
  );
  let maxClicks = 0;
  for (const key of candidates) {
    const val = clickCounts[key];
    if (typeof val === 'number' && val > maxClicks) {
      maxClicks = val;
    }
  }
  return maxClicks;
}

function getCuratedTiebreakerScore(cfg: GearMarketConfig): number {
  let score = cfg.defaultPriorityWeight ?? 0;
  if (cfg.isHeroDeal) score += 100;
  if (cfg.discountCode) score += 60;
  if (cfg.isWinterPrepEssential) score += 40;
  if (cfg.isDeliveryDayEssential) score += 20;
  return score;
}

function buildOneLineBenefit(cfg: GearMarketConfig): string {
  const fitment = cfg.fitment?.trim() || cfg.compatibility?.trim();
  const desc = cfg.description?.trim() || cfg.whyBuy?.trim() || 'Community-vetted Toyota accessory.';
  if (fitment && !desc.toLowerCase().includes(fitment.toLowerCase())) {
    return `${fitment} — ${desc}`;
  }
  return desc;
}

export function getWeeklyGearPicks(
  country: 'CA' | 'US',
  currentDate: Date = new Date(),
  clickCounts: Record<string, number> = {}
): WeeklyGearPick[] {
  const promo = getCurrentPromoConfig(currentDate);
  const baseUrl = country === 'US' ? 'https://www.toyotawaits.com' : 'https://www.toyotawaits.ca';

  const catalogEntries = Object.entries(GEAR_MARKET_CATALOG).map(([id, cfg], index) => ({
    id,
    index,
    clicks30d: getClicksForCatalogItem(id, cfg, clickCounts),
    curatedScore: getCuratedTiebreakerScore(cfg),
    ...cfg,
  }));

  // Apply seasonal promotion boost first, then sort by 30-day telemetry clicks descending
  const promoSorted = sortGearByPromotions(catalogEntries, currentDate);
  const promoOrder = new Map<string, number>();
  promoSorted.forEach((item, idx) => promoOrder.set(item.id, idx));

  const ranked = [...catalogEntries].sort((a, b) => {
    if (b.clicks30d !== a.clicks30d) {
      return b.clicks30d - a.clicks30d;
    }
    if (b.curatedScore !== a.curatedScore) {
      return b.curatedScore - a.curatedScore;
    }
    return (promoOrder.get(a.id) ?? a.index) - (promoOrder.get(b.id) ?? b.index);
  });

  // Deduplicate by clean title so the Top 10 list features 10 distinct products
  const picked: WeeklyGearPick[] = [];
  const seenTitles = new Set<string>();

  for (const item of ranked) {
    if (picked.length >= 10) break;
    const cleanTitle = (item.title || item.name || item.id).trim();
    const displayTitle = item.brand ? `${item.brand} ${cleanTitle}` : cleanTitle;
    const dedupeKey = displayTitle.toLowerCase();
    if (seenTitles.has(dedupeKey)) continue;
    seenTitles.add(dedupeKey);

    const isDirectPartner =
      item.destinationType === 'direct_partner' &&
      typeof item.destinationUrl === 'string' &&
      item.destinationUrl.startsWith('/');

    const searchQuery =
      (country === 'US' ? item.searchKeywordsUS : item.searchKeywordsCA) ||
      item.searchQuery ||
      item.amazonFallbackQuery ||
      displayTitle;

    const url = isDirectPartner
      ? `${baseUrl}${item.destinationUrl}`
      : buildAmazonAffiliateUrl({
          query: searchQuery,
          asin_ca: item.asin_ca || item.asin,
          asin_us: item.asin_us || item.asin,
          market: country,
          dealFilter: promo.applyDealFilter,
        });

    picked.push({
      id: item.id,
      rank: picked.length + 1,
      title: displayTitle,
      description: buildOneLineBenefit(item),
      fitment: item.fitment || item.compatibility,
      url,
      badge: item.badge,
      discountCode: item.discountCode,
      discountText: item.discountText,
      isPartnerDeal: isDirectPartner || Boolean(item.discountCode),
      clicks30d: item.clicks30d,
    });
  }

  return picked;
}

export function generateWeeklyPipelineBriefEmail(
  input: WeeklyPipelineBriefInput
): GeneratedWeeklyPipelineBrief {
  const {
    country,
    unsubscribeToken,
    waitTimeMovers,
    freshLotSightingsCount,
    deliveryPulse,
    currentDate = new Date(),
  } = input;

  const baseUrl = country === 'US' ? 'https://www.toyotawaits.com' : 'https://www.toyotawaits.ca';
  const regionLabel = country === 'US' ? 'United States' : 'Canada';
  const gearPicks = (
    input.gearPicks && input.gearPicks.length > 0
      ? input.gearPicks.slice(0, 10)
      : getWeeklyGearPicks(country, currentDate)
  ).map((item, idx) => ({
    ...item,
    rank: item.rank ?? idx + 1,
  }));

  const dateLabel = currentDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });

  const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?token=${encodeURIComponent(
    unsubscribeToken
  )}`;

  const subject = `ToyotaWaits Weekly Pipeline Brief (${regionLabel}) — ${dateLabel}`;

  // 1. Wait-Time Movers HTML
  const moversHtml =
    waitTimeMovers.length > 0
      ? waitTimeMovers
          .slice(0, 3)
          .map((m) => {
            const deltaBadge =
              typeof m.deltaDays === 'number' && m.deltaDays !== 0
                ? `<span style="font-size: 11px; font-weight: 700; color: ${
                    m.deltaDays < 0 ? '#34d399' : '#fbbf24'
                  }; margin-left: 6px;">(${m.deltaDays > 0 ? `+${m.deltaDays}` : m.deltaDays}d vs prior)</span>`
                : '';
            return `
              <tr>
                <td style="padding: 10px 12px; border-bottom: 1px solid #27272a;">
                  <a href="${baseUrl}/wait-times/${encodeURIComponent(
                    m.modelSlug
                  )}" style="color: #fbbf24; font-weight: 700; text-decoration: none; font-size: 14px;">
                    ${escapeHtml(m.modelName)} &rarr;
                  </a>
                  <div style="color: #a1a1aa; font-size: 12px; margin-top: 2px;">
                    Median wait: <strong style="color: #f4f4f5;">${m.medianWaitDays} days</strong>${deltaBadge} &bull; ${m.sampleCount} reports
                  </div>
                </td>
              </tr>
            `;
          })
          .join('')
      : `
          <tr>
            <td style="padding: 10px 12px; color: #a1a1aa; font-size: 13px;">
              Wait-time benchmarks held steady over the past 7 days.
              <a href="${baseUrl}/#estimator" style="color: #fbbf24; text-decoration: underline;">Check live estimator &rarr;</a>
            </td>
          </tr>
        `;

  // 2. Community Delivery Pulse HTML
  const pulseHtml =
    deliveryPulse.length > 0
      ? deliveryPulse
          .slice(0, 2)
          .map(
            (d) => `
              <li style="margin-bottom: 6px; color: #e4e4e7; font-size: 13px; line-height: 1.5;">
                <strong>${escapeHtml(d.modelName)}</strong> delivered in <strong>${escapeHtml(
                  d.regionCode
                )}</strong> after <strong>${d.waitDays} days</strong>
              </li>
            `
          )
          .join('')
      : `<li style="color: #a1a1aa; font-size: 13px;">New verified deliveries are logged daily — <a href="${baseUrl}/submit" style="color: #fbbf24; text-decoration: underline;">share your timeline</a>.</li>`;

  // 3. Top 10 Most Popular Gear This Week HTML
  const gearHtml = gearPicks
    .map((g, idx) => {
      const rank = g.rank ?? idx + 1;
      const isTopOne = rank === 1;
      const topBadge = isTopOne
        ? `<span style="display: inline-block; margin-left: 6px; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 999px; background-color: #f59e0b26; border: 1px solid #f59e0b66; color: #fbbf24;">🔥 #1 Most Popular</span>`
        : '';
      const partnerBadge = g.discountCode
        ? `<span style="display: inline-block; margin-left: 6px; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 999px; background-color: #064e3b; border: 1px solid #10b98166; color: #34d399;">${escapeHtml(
            g.discountText ? `${g.discountText} • ` : '2% Off • '
          )}Code: ${escapeHtml(g.discountCode)}</span>`
        : '';
      const actionLabel = g.isPartnerDeal ? 'Claim Deal &rarr;' : 'View on Amazon &rarr;';

      return `
        <tr>
          <td style="padding: 10px 12px; border-bottom: 1px solid #27272a; vertical-align: middle;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
              <tr>
                <td style="vertical-align: top; padding-right: 10px;">
                  <div style="font-size: 13px; font-weight: 700; color: #ffffff; line-height: 1.4;">
                    <span style="color: ${isTopOne ? '#fbbf24' : '#a1a1aa'}; font-family: ui-monospace, SFMono-Regular, monospace; margin-right: 6px;">#${rank}</span>${escapeHtml(g.title)}${topBadge}${partnerBadge}
                  </div>
                  <div style="font-size: 12px; color: #a1a1aa; line-height: 1.4; margin-top: 2px;">
                    ${escapeHtml(g.description)}
                  </div>
                </td>
                <td style="vertical-align: middle; text-align: right; white-space: nowrap; width: 125px;">
                  <a href="${g.url}" style="display: inline-block; font-size: 12px; font-weight: 700; color: #fbbf24; text-decoration: none; padding: 6px 10px; border-radius: 6px; border: 1px solid #3f3f46; background-color: #09090b;">
                    ${actionLabel}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `;
    })
    .join('');

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #09090b; color: #f4f4f5; border-radius: 12px; border: 1px solid #27272a;">
      <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #f59e0b;">
        ToyotaWaits Weekly Pipeline Brief &bull; ${escapeHtml(regionLabel)}
      </p>
      <h1 style="margin: 0 0 8px 0; font-size: 22px; color: #ffffff;">Monday Allocation &amp; Wait-Time Pulse</h1>
      <p style="margin: 0 0 20px 0; font-size: 13px; color: #a1a1aa; line-height: 1.5;">
        7-day snapshot as of ${escapeHtml(dateLabel)}.
      </p>

      <!-- 1. Wait-Time Movers -->
      <h2 style="margin: 0 0 8px 0; font-size: 15px; color: #ffffff;">1. Wait-Time Movers (Past 7 Days)</h2>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #27272a; border-radius: 8px; background-color: #18181b; margin-bottom: 20px;">
        ${moversHtml}
      </table>

      <!-- 2. Fresh Lot Sightings Summary -->
      <div style="padding: 14px 16px; border: 1px solid #f59e0b40; border-radius: 10px; background-color: #18181b; margin-bottom: 20px;">
        <h2 style="margin: 0 0 6px 0; font-size: 15px; color: #ffffff;">2. Fresh Lot Sightings Summary</h2>
        <p style="margin: 0 0 10px 0; font-size: 13px; color: #d4d4d8; line-height: 1.5;">
          <strong style="color: #fbbf24; font-size: 16px;">${freshLotSightingsCount}</strong> unreserved units were spotted across tracked dealer feeds over the past 7 days.
        </p>
        <a href="${baseUrl}/inventory" style="display: inline-block; background-color: #f59e0b; color: #09090b; text-decoration: none; font-weight: 700; font-size: 13px; padding: 9px 16px; border-radius: 8px;">
          Browse Live Unreserved Inventory &rarr;
        </a>
      </div>

      <!-- 3. Community Delivery Pulse -->
      <h2 style="margin: 0 0 8px 0; font-size: 15px; color: #ffffff;">3. Community Delivery Pulse</h2>
      <ul style="margin: 0 0 20px 0; padding-left: 18px;">
        ${pulseHtml}
      </ul>

      <!-- 4. Top 10 Most Popular Gear This Week -->
      <h2 style="margin: 0 0 8px 0; font-size: 15px; color: #ffffff;">4. Top 10 Most Popular Gear This Week</h2>
      <p style="margin: 0 0 10px 0; font-size: 12px; color: #a1a1aa; line-height: 1.4;">
        Ranked by live 30-day Toyota &amp; Lexus owner clicks across ${escapeHtml(regionLabel)}.
      </p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #27272a; border-radius: 8px; background-color: #18181b;">
        ${gearHtml}
      </table>

      <!-- 5. CASL Compliance Footer -->
      <hr style="border: 0; border-top: 1px solid #27272a; margin: 24px 0 16px 0;" />
      <p style="color: #71717a; font-size: 11px; line-height: 1.5; margin: 0 0 8px 0;">
        <strong>Disclosure:</strong> ${escapeHtml(AMAZON_ASSOCIATES_DISCLOSURE)}
      </p>
      <p style="color: #71717a; font-size: 11px; line-height: 1.5; margin: 0;">
        Sent by <strong>ToyotaWaits</strong> &lt;hello@toyotawaits.ca&gt; &bull; Burnaby, BC, Canada.<br />
        Independent automotive research tracker — not affiliated with Toyota Canada Inc., Toyota Motor Sales, U.S.A., Inc., or any dealership.<br />
        <a href="${unsubscribeUrl}" style="color: #fbbf24; text-decoration: underline;">1-Click Unsubscribe</a>
      </p>
    </div>
  `.trim();

  const moversText =
    waitTimeMovers.length > 0
      ? waitTimeMovers
          .slice(0, 3)
          .map(
            (m) =>
              `- ${m.modelName}: ${m.medianWaitDays} days median (${m.sampleCount} reports) -> ${baseUrl}/wait-times/${m.modelSlug}`
          )
          .join('\n')
      : `- Benchmarks held steady. Check live estimator: ${baseUrl}/#estimator`;

  const pulseText =
    deliveryPulse.length > 0
      ? deliveryPulse
          .slice(0, 2)
          .map((d) => `- ${d.modelName} delivered in ${d.regionCode} after ${d.waitDays} days`)
          .join('\n')
      : `- Log your delivery timeline: ${baseUrl}/submit`;

  const gearText = gearPicks
    .map((g, idx) => {
      const rank = g.rank ?? idx + 1;
      const tag = rank === 1 ? ' [🔥 #1 Most Popular]' : '';
      const code = g.discountCode
        ? ` [${g.discountText ? `${g.discountText} • ` : '2% Off • '}Code: ${g.discountCode}]`
        : '';
      return `#${rank} ${g.title}${tag}${code} — ${g.description}\n   ${g.url}`;
    })
    .join('\n');

  const text = [
    `ToyotaWaits Weekly Pipeline Brief (${regionLabel}) — ${dateLabel}`,
    '',
    '1. WAIT-TIME MOVERS (PAST 7 DAYS)',
    moversText,
    '',
    '2. FRESH LOT SIGHTINGS SUMMARY',
    `${freshLotSightingsCount} unreserved units spotted over the past 7 days. Browse live inventory: ${baseUrl}/inventory`,
    '',
    '3. COMMUNITY DELIVERY PULSE',
    pulseText,
    '',
    '4. TOP 10 MOST POPULAR GEAR THIS WEEK',
    gearText,
    '',
    '---',
    AMAZON_ASSOCIATES_DISCLOSURE,
    'Sent by ToyotaWaits <hello@toyotawaits.ca>, Burnaby, BC, Canada.',
    'Not affiliated with Toyota Canada Inc., Toyota Motor Sales, U.S.A., Inc., or any dealership.',
    `1-Click Unsubscribe: ${unsubscribeUrl}`,
  ].join('\n');

  return { subject, html, text };
}

export function WeeklyPipelineBriefEmail(props: WeeklyPipelineBriefInput) {
  const email = generateWeeklyPipelineBriefEmail(props);
  return <div dangerouslySetInnerHTML={{ __html: email.html }} />;
}

export default WeeklyPipelineBriefEmail;
