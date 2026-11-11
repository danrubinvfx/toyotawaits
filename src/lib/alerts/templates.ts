import { getGearMarketConfig } from '@/data/gear/catalog';
import {
  buildAmazonAffiliateUrl,
  getModelDisplayName,
} from '@/lib/gear/affiliate';
import {
  getCurrentPromoConfig,
  sortGearByPromotions,
} from '@/lib/gear/promotions';
import { toCanonicalWaitTimeSlug } from '@/lib/calculator-model-helpers';

export const AMAZON_ASSOCIATES_DISCLOSURE =
  'As an Amazon Associate, ToyotaWaits earns from qualifying purchases.';

export const SIENNA_HITCH_GUIDE_URL =
  'https://www.toyotawaits.ca/guides/toyota-sienna-trailer-hitch-guide';

export interface DropAlertGearPick {
  id: string;
  title: string;
  description: string;
  searchQuery: string;
  url: string;
  buttonLabel: string;
  isHeroDeal?: boolean;
  category?: string;
  discountCode?: string;
}

export interface DropAlertEnrichment {
  modelDisplay: string;
  modelSlug: string;
  calculatorUrl: string;
  calculatorBannerText: string;
  gearPicks: DropAlertGearPick[];
  guideUrl: string;
  guideTitle: string;
  guideDescription: string;
  disclosureText: string;
  htmlSection: string;
  textSection: string;
}

export interface AllocationDropAlertVehicle {
  make?: string | null;
  vin?: string | null;
  provisionalId?: string | null;
  model: string;
  trim?: string | null;
  powertrain?: string | null;
  drivetrain?: string | null;
  engine?: string | null;
  status?: string | null;
  stockNumber?: string | null;
  modelYear?: number | null;
  dealerId?: string | null;
  dealerName?: string | null;
  dealerCity?: string | null;
  vdpUrl?: string | null;
  sellingPrice?: number | null;
  msrp?: number | null;
}

export interface AllocationDropAlertEmailInput {
  make?: string | null;
  recipientEmail?: string;
  model?: string;
  modelSlug?: string | null;
  trim?: string | null;
  powertrain?: string | null;
  vin?: string | null;
  dealerName?: string | null;
  dealerCity?: string | null;
  vdpUrl?: string | null;
  sellingPrice?: number | null;
  msrp?: number | null;
  status?: string | null;
  stockNumber?: string | null;
  drivetrain?: string | null;
  engine?: string | null;
  modelYear?: number | null;
  unsubscribeToken?: string | null;
  unsubscribeUrl?: string | null;
  market?: 'CA' | 'US';
  region?: string | null;
  vehicles?: AllocationDropAlertVehicle[];
  currentDate?: Date;
}

export interface GeneratedDropAlertEmail {
  subject: string;
  html: string;
  text: string;
  headers: Record<string, string>;
  calculatorUrl: string;
  guideUrl: string;
  gearPicks: DropAlertGearPick[];
  primaryInventoryUrl: string;
}

/**
 * Resolves the canonical URL slug for calculator & wait-times routes
 * (e.g. "Grand Highlander" -> "grand-highlander", "RAV4 Hybrid" -> "rav4", "Sienna" -> "sienna").
 */
export function resolveAlertModelSlug(
  model?: string | null,
  explicitSlug?: string | null
): string {
  const candidate = explicitSlug?.trim() || model?.trim() || 'rav4';
  return toCanonicalWaitTimeSlug(candidate);
}

/**
 * Resolves clean human-readable model name (e.g. "RAV4", "Sienna", "Grand Highlander", "Camry", "Prius").
 */
export function resolveAlertModelDisplay(
  model?: string | null,
  modelSlug?: string | null
): string {
  const slug = resolveAlertModelSlug(model, modelSlug);
  const raw = (model || '').trim();
  if (raw && raw.toLowerCase() !== slug) {
    // Preserve clean model title if already human-formatted (e.g. "RAV4", "Sienna", "Grand Highlander")
    return raw;
  }
  return getModelDisplayName(slug);
}

/**
 * Builds zero-404 Amazon search URL using compliant Associate tags:
 * - CA: amazon.ca/s?k=...&tag=toyotawaits-20
 * - US: amazon.com/s?k=...&tag=toyotawaits07-20
 */
export function buildZero404AmazonSearchUrl(
  searchKeywords: string,
  market: 'CA' | 'US' = 'CA',
  dealFilter: boolean = false
): string {
  const cleanKeywords = searchKeywords.trim() || 'Toyota accessories';
  return buildAmazonAffiliateUrl(cleanKeywords, market, market, dealFilter);
}

/**
 * Returns curated model-specific Delivery Day Essentials from the gear catalog
 * using zero-404 search URL fallbacks, seasonal deal filtering, priority sorting, and dynamic CTA labels.
 */
export function getCuratedGearForDropAlert(
  modelOrSlug?: string | null,
  market: 'CA' | 'US' = 'CA',
  currentDate: Date = new Date()
): DropAlertGearPick[] {
  const slug = resolveAlertModelSlug(modelOrSlug);
  const isUs = market === 'US';
  const promoConfig = getCurrentPromoConfig(currentDate);
  const dealFilter = promoConfig.isPromoActive;
  const buttonLabel = promoConfig.isPromoActive
    ? promoConfig.ctaText
    : 'Check on Amazon ↗';

  let picks: DropAlertGearPick[];

  if (slug === 'rav4') {
    const dashcamCfg = getGearMarketConfig('fitcamx-rav4', 'rav4');
    const linersCfg = getGearMarketConfig('high-wall-floor-liners-rav4', 'rav4');

    const dashcamQuery =
      (isUs ? dashcamCfg?.searchKeywordsUS : dashcamCfg?.searchKeywordsCA) ||
      'Fitcamx dash cam Toyota RAV4 OEM 4K';
    const linersQuery =
      (isUs ? linersCfg?.searchKeywordsUS : linersCfg?.searchKeywordsCA) ||
      'TuxMat Toyota RAV4 custom all weather floor mats';

    picks = [
      {
        id: 'fitcamx-rav4',
        title: 'FitcamX OEM 4K Dashcam',
        description:
          dashcamCfg?.whyBuy ||
          'Discrete OEM look tapping into rearview mirror power with zero dangling cables.',
        searchQuery: dashcamQuery,
        url: buildZero404AmazonSearchUrl(dashcamQuery, market, dealFilter),
        buttonLabel,
        isHeroDeal: true,
        category: 'Day-1 Essential',
      },
      {
        id: 'high-wall-floor-liners-rav4',
        title: 'TuxMat TPE Liners',
        description:
          linersCfg?.whyBuy ||
          'Maximum high-wall laser-measured coverage containing snow, salt, mud, and water spills.',
        searchQuery: linersQuery,
        url: buildZero404AmazonSearchUrl(linersQuery, market, dealFilter),
        buttonLabel,
        isHeroDeal: true,
        category: 'Day-1 Essential',
      },
    ];
    return sortGearByPromotions(picks, currentDate);
  }

  if (slug === 'sienna') {
    const linersCfg = getGearMarketConfig('sienna-all-weather-liners', 'sienna');
    const consoleCfg = getGearMarketConfig('console-tray-sienna', 'sienna');

    const linersQuery =
      (isUs ? linersCfg?.searchKeywordsUS : linersCfg?.searchKeywordsCA) ||
      'Toyota Sienna all weather floor mats 2021-2026';
    const consoleQuery =
      (isUs ? consoleCfg?.searchKeywordsUS : consoleCfg?.searchKeywordsCA) ||
      'Sienna center console organizer tray 2021-2026';

    picks = [
      {
        id: 'sienna-all-weather-liners',
        title: '3-Row Custom Floor Liners',
        description:
          linersCfg?.whyBuy ||
          'Maximized spill containment along sliding Super Long Slide tracks and cargo trunk well.',
        searchQuery: linersQuery,
        url: buildZero404AmazonSearchUrl(linersQuery, market, dealFilter),
        buttonLabel,
        isHeroDeal: true,
        category: 'Day-1 Essential',
      },
      {
        id: 'console-tray-sienna',
        title: 'Center Console Sliding Organizer',
        description:
          consoleCfg?.whyBuy ||
          'Tames the deep center bridge cubby and upper armrest cavity with non-slip rubber inserts.',
        searchQuery: consoleQuery,
        url: buildZero404AmazonSearchUrl(consoleQuery, market, dealFilter),
        buttonLabel,
        isHeroDeal: true,
        category: 'Day-1 Essential',
      },
    ];
    return sortGearByPromotions(picks, currentDate);
  }

  if (slug === 'grand-highlander') {
    const screenCfg = getGearMarketConfig(
      'screen-protector-grand-highlander',
      'grand-highlander'
    );
    const dashcamCfg = getGearMarketConfig(
      'fitcamx-grand-highlander',
      'grand-highlander'
    );

    const screenQuery =
      (isUs ? screenCfg?.searchKeywordsUS : screenCfg?.searchKeywordsCA) ||
      'Grand Highlander 2024 2025 2026 12.3-inch screen protector tempered glass';
    const dashcamQuery =
      (isUs ? dashcamCfg?.searchKeywordsUS : dashcamCfg?.searchKeywordsCA) ||
      'Fitcamx dash cam Grand Highlander TSS 3.0';

    picks = [
      {
        id: 'screen-protector-grand-highlander',
        title: '12.3" Matte Screen Protector',
        description:
          screenCfg?.whyBuy ||
          'Prevents fingerprint oil buildup and eliminates harsh reflections across wide cabin glass.',
        searchQuery: screenQuery,
        url: buildZero404AmazonSearchUrl(screenQuery, market, dealFilter),
        buttonLabel,
        isHeroDeal: true,
        category: 'Day-1 Essential',
      },
      {
        id: 'fitcamx-grand-highlander',
        title: 'TSS 3.0 Dashcam',
        description:
          dashcamCfg?.whyBuy ||
          'Custom molded mirror housing integrating 4K recording under the digital/standard mirror bracket.',
        searchQuery: dashcamQuery,
        url: buildZero404AmazonSearchUrl(dashcamQuery, market, dealFilter),
        buttonLabel,
        isHeroDeal: true,
        category: 'Day-1 Essential',
      },
    ];
    return sortGearByPromotions(picks, currentDate);
  }

  if (slug === 'prius') {
    const dashcamCfg = getGearMarketConfig('fitcamx-prius', 'prius');
    const linersCfg = getGearMarketConfig('prius-all-weather-liners', 'prius');

    const dashcamQuery =
      (isUs ? dashcamCfg?.searchKeywordsUS : dashcamCfg?.searchKeywordsCA) ||
      'fitcamx 4k dash cam prius 2023-2025';
    const linersQuery =
      (isUs ? linersCfg?.searchKeywordsUS : linersCfg?.searchKeywordsCA) ||
      'toyota prius 2023-2025 all weather floor mats cargo liner';

    picks = [
      {
        id: 'fitcamx-prius',
        title: 'FitcamX OEM Integrated 4K Dashcam',
        description:
          dashcamCfg?.whyBuy ||
          'Factory-integrated mirror replacement for sleek Gen 5 Prius windshield aerodynamics.',
        searchQuery: dashcamQuery,
        url: buildZero404AmazonSearchUrl(dashcamQuery, market, dealFilter),
        buttonLabel,
        isHeroDeal: true,
        category: 'Day-1 Essential',
      },
      {
        id: 'prius-all-weather-liners',
        title: 'Custom-Fit All-Weather 3D TPE Floor Liners',
        description:
          linersCfg?.whyBuy ||
          'High-wall laser-measured floor & trunk protection engineered for the Gen 5 Prius cabin.',
        searchQuery: linersQuery,
        url: buildZero404AmazonSearchUrl(linersQuery, market, dealFilter),
        buttonLabel,
        isHeroDeal: true,
        category: 'Day-1 Essential',
      },
    ];
    return sortGearByPromotions(picks, currentDate);
  }

  if (slug === 'camry') {
    const screenQuery = 'Toyota Camry 12.3 inch screen protector tempered glass';
    const linersQuery = 'Toyota Camry all weather floor mats TPE';

    picks = [
      {
        id: 'camry-screen-protector',
        title: '12.3" Anti-Glare Tempered Glass Screen Protector',
        description:
          '9H hardness matte oleophobic tempered glass custom cut for the Camry multimedia touchscreen.',
        searchQuery: screenQuery,
        url: buildZero404AmazonSearchUrl(screenQuery, market, dealFilter),
        buttonLabel,
        isHeroDeal: true,
        category: 'Day-1 Essential',
      },
      {
        id: 'camry-floor-liners',
        title: 'All-Weather Custom TPE Floor Liners',
        description:
          'Laser-fit high-wall floor mats protecting front and rear footwells from winter slush and road salt.',
        searchQuery: linersQuery,
        url: buildZero404AmazonSearchUrl(linersQuery, market, dealFilter),
        buttonLabel,
        isHeroDeal: true,
        category: 'Day-1 Essential',
      },
    ];
    return sortGearByPromotions(picks, currentDate);
  }

  if (
    slug === 'corolla-hatchback' ||
    slug === 'corolla' ||
    slug.includes('corolla-hatchback') ||
    (slug.includes('corolla') && !slug.includes('corolla-cross'))
  ) {
    const dashcamQuery = 'Fitcamx dash cam Toyota Corolla Hatchback 2020-2026 OEM 4K';
    const linersQuery = 'Toyota Corolla Hatchback custom all weather floor mats liners';
    const trayQuery = 'Toyota Corolla Hatchback center console organizer tray 2020-2026';

    picks = [
      {
        id: 'fitcamx-corolla-hatchback',
        title: 'FitcamX OEM-Integrated 4K Dashcam',
        description:
          'Clean factory-look dashcam drawing power directly from the TSS rearview mirror harness without exposed wires.',
        searchQuery: dashcamQuery,
        url: buildZero404AmazonSearchUrl(dashcamQuery, market, dealFilter),
        buttonLabel,
        isHeroDeal: true,
        category: 'Day-1 Essential',
      },
      {
        id: 'corolla-hatchback-all-weather-liners',
        title: 'Custom-Fit All-Weather Floor Liners',
        description:
          'High-wall TPE waterproof liners engineered for Corolla Hatchback floor wells and retention clips.',
        searchQuery: linersQuery,
        url: buildZero404AmazonSearchUrl(linersQuery, market, dealFilter),
        buttonLabel,
        isHeroDeal: true,
        category: 'Day-1 Essential',
      },
      {
        id: 'console-tray-corolla-hatchback',
        title: 'Center Console Armrest Organizer Tray',
        description:
          'Dual-tier organizer tray dividing the deep armrest compartment with coin and cable slots.',
        searchQuery: trayQuery,
        url: buildZero404AmazonSearchUrl(trayQuery, market, dealFilter),
        buttonLabel,
        isHeroDeal: false,
      },
    ];
    return sortGearByPromotions(picks, currentDate);
  }

  if (slug.startsWith('lexus-') || slug === 'lexus') {
    const dashcamQuery =
      slug === 'lexus-gx550'
        ? 'Fitcamx dash cam Lexus GX 550 4K OEM'
        : slug === 'lexus-tx'
        ? 'Fitcamx dash cam Lexus TX 350 500h 4K'
        : slug === 'lexus-nx'
        ? 'Fitcamx dash cam Lexus NX 2022-2026 4K OEM'
        : 'Fitcamx dash cam Lexus RX 350 350h 500h 4K OEM';

    const linersQuery =
      slug === 'lexus-gx550'
        ? 'TuxMat custom floor mats Lexus GX 550'
        : slug === 'lexus-tx'
        ? 'TuxMat custom floor mats Lexus TX'
        : slug === 'lexus-nx'
        ? 'TuxMat custom floor mats Lexus NX'
        : 'TuxMat custom floor mats Lexus RX';

    picks = [
      {
        id: `fitcamx-${slug}`,
        title: 'FitcamX 4K OEM Dashcam',
        description:
          'Factory-integrated rearview mirror cover replacement with 4K recording and zero dangling wires.',
        searchQuery: dashcamQuery,
        url: buildZero404AmazonSearchUrl(dashcamQuery, market, dealFilter),
        buttonLabel,
        isHeroDeal: true,
        category: 'Day-1 Essential',
      },
      {
        id: `tuxmat-${slug}`,
        title: 'TuxMat High-Wall Liners',
        description:
          'Laser-measured luxury high-wall floor protection engineered for severe Canadian slush and snow.',
        searchQuery: linersQuery,
        url: buildZero404AmazonSearchUrl(linersQuery, market, dealFilter),
        buttonLabel,
        isHeroDeal: true,
        category: 'Day-1 Essential',
      },
    ];
    return sortGearByPromotions(picks, currentDate);
  }

  // Fallback for other Toyota models (Tacoma, Corolla Cross, Land Cruiser, Sequoia, Highlander, etc.)
  const faradayQuery = 'TICONN Faraday bag key fob signal protector pouch';
  const inflatorQuery = 'portable cordless tire inflator 150 psi';

  picks = [
    {
      id: 'ticonn-faraday-pouches',
      title: 'TICONN Faraday Pouches',
      description:
        'Dual-layer RFID & BLE signal blocking pouches preventing relay theft and key fob signal cloning.',
      searchQuery: faradayQuery,
      url: buildZero404AmazonSearchUrl(faradayQuery, market, dealFilter),
      buttonLabel,
      isHeroDeal: true,
      category: 'Day-1 Essential',
    },
    {
      id: 'cordless-tire-inflator',
      title: 'Cordless Tire Inflator',
      description:
        'Compact rechargeable digital air pump with auto-shutoff for rapid seasonal tire pressure management.',
      searchQuery: inflatorQuery,
      url: buildZero404AmazonSearchUrl(inflatorQuery, market, dealFilter),
      buttonLabel,
      isHeroDeal: false,
    },
  ];
  return sortGearByPromotions(picks, currentDate);
}

/**
 * Builds the model-specific Calculator CTA, Curated Delivery Day Gear Picks,
 * and Guide / Model Hub Cross-Link for both HTML and Plain-Text drop alert emails.
 */
export function buildDropAlertEnrichment(params: {
  model?: string | null;
  modelSlug?: string | null;
  market?: 'CA' | 'US';
  currentDate?: Date;
}): DropAlertEnrichment {
  const modelSlug = resolveAlertModelSlug(params.model, params.modelSlug);
  const modelDisplay = resolveAlertModelDisplay(params.model, modelSlug);
  const market = params.market || 'CA';
  const effectiveDate = params.currentDate ?? new Date();
  const promoConfig = getCurrentPromoConfig(effectiveDate);

  const calculatorUrl = `https://www.toyotawaits.ca/calculator/${modelSlug}`;
  const calculatorBannerText = `Weighing Hybrid vs. Gas? Calculate annual fuel payback on this trim before signing the purchase agreement → ${calculatorUrl}`;

  const rawGearPicks = getCuratedGearForDropAlert(modelSlug, market, effectiveDate);
  const gearPicks = sortGearByPromotions(rawGearPicks, effectiveDate);

  const gearSectionEyebrow = promoConfig.isPromoActive
    ? `⚡ Black Friday Deals for Your ${modelDisplay}`
    : `🛡️ Delivery Day Essentials (${modelDisplay})`;

  const isSienna = modelSlug === 'sienna';
  const isLexus = modelSlug.startsWith('lexus-') || modelSlug === 'lexus';
  let guideUrl = `https://www.toyotawaits.ca/wait-times/${modelSlug}`;
  let guideTitle = `${modelDisplay} Wait Times & Delivery Checklist Hub`;
  let guideDescription = `Review live Canadian wait-time benchmarks, provincial allocation trends, and the delivery checklist for your ${modelDisplay}.`;

  if (modelSlug === 'lexus-gx550') {
    guideUrl = 'https://www.toyotawaits.ca/guides/lexus-gx550-must-have-accessories';
    guideTitle = 'Lexus GX 550 Delivery Prep & Armor Guide';
    guideDescription = 'Essential rock-sliders, TuxMat liners, ceramic protection, and 4K dashcam installation for your GX 550.';
  } else if (modelSlug === 'lexus-tx') {
    guideUrl = 'https://www.toyotawaits.ca/guides/lexus-tx-delivery-prep-gear';
    guideTitle = 'Lexus TX Delivery Day Prep & Protection Guide';
    guideDescription = 'Complete guide for 3-row cargo trays, 14-inch screen protectors, and day-one essentials for the Lexus TX.';
  } else if (modelSlug === 'lexus-nx' || modelSlug === 'lexus-rx') {
    guideUrl = 'https://www.toyotawaits.ca/guides/lexus-phev-home-charging-setup';
    guideTitle = 'Lexus PHEV & Hybrid Delivery Day Prep Guide';
    guideDescription = 'Level 2 240V charging specs, winter range optimization, and luxury interior protection for NX & RX.';
  } else if (isSienna) {
    guideUrl = SIENNA_HITCH_GUIDE_URL;
    guideTitle = 'Sienna Trailer Hitch & Bike Rack Guide';
    guideDescription = 'Planning to carry bikes or cargo? Check our complete Sienna 2-inch hitch receiver, ground clearance, and kick-sensor guide.';
  }
  const guideCtaText = isLexus ? 'Read the Delivery Day Prep Guide &rarr;' : `${guideTitle} &rarr;`;

  const htmlSection = `
    <!-- Calculator CTA Callout Box -->
    <div style="margin-top: 20px; background-color: #18181b; border: 1px solid #f59e0b; border-left: 4px solid #f59e0b; border-radius: 10px; padding: 18px;">
      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #fbbf24; margin-bottom: 6px;">
        ⛽ Hybrid &amp; PHEV Savings Calculator
      </div>
      <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 1.5; color: #e4e4e7;">
        Weighing Hybrid vs. Gas? Calculate annual fuel payback on this trim before signing the purchase agreement &rarr; <a href="${calculatorUrl}" target="_blank" rel="noopener noreferrer" style="color: #fbbf24; font-weight: 600; text-decoration: underline;">${calculatorUrl}</a>
      </p>
      <a href="${calculatorUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 16px; background-color: #f59e0b; color: #09090b; font-weight: 700; font-size: 13px; border-radius: 6px; text-decoration: none;">
        Calculate ${modelDisplay} Fuel Payback &rarr;
      </a>
    </div>

    <!-- Delivery Day Essentials (Curated Picks) -->
    <div style="margin-top: 20px; background-color: #18181b; border: 1px solid #27272a; border-radius: 10px; padding: 18px;">
      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: ${promoConfig.isPromoActive ? '#f87171' : '#34d399'}; margin-bottom: 4px;">
        ${gearSectionEyebrow}
      </div>
      <h4 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 700; color: #ffffff;">
        Curated Day-One Protection &amp; Gear Picks
      </h4>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">
        ${gearPicks
          .map(
            (pick) => `
        <tr>
          <td style="padding: 12px; background-color: #09090b; border: 1px solid #27272a; border-radius: 8px;">
            <div style="font-size: 14px; font-weight: 700; color: #fafafa; margin-bottom: 4px;">
              ${pick.title}${
                promoConfig.isPromoActive
                  ? ' <span style="display: inline-block; margin-left: 6px; padding: 2px 6px; background-color: #dc2626; color: #ffffff; font-size: 10px; font-weight: 700; border-radius: 4px;">[ Black Friday Deal ]</span>'
                  : ''
              }
            </div>
            <div style="font-size: 12px; color: #a1a1aa; line-height: 1.4; margin-bottom: 10px;">
              ${pick.description}
            </div>
            <a href="${pick.url}" target="_blank" rel="sponsored noopener noreferrer nofollow" style="display: inline-block; padding: 8px 14px; background-color: #27272a; border: 1px solid #3f3f46; color: #fbbf24; font-weight: 700; font-size: 12px; border-radius: 6px; text-decoration: none;">
              ${pick.buttonLabel}
            </a>
          </td>
        </tr>
        <tr><td style="height: 10px; font-size: 0; line-height: 0;">&nbsp;</td></tr>`
          )
          .join('')}
      </table>
      <p style="margin: 4px 0 0 0; font-size: 11px; color: #71717a; line-height: 1.4;">
        ${AMAZON_ASSOCIATES_DISCLOSURE}
      </p>
    </div>

    <!-- Model Guide / Hitch Guide Cross-Link -->
    <div style="margin-top: 20px; background-color: #18181b; border: 1px solid #27272a; border-radius: 10px; padding: 18px;">
      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #60a5fa; margin-bottom: 4px;">
        📘 ${isLexus ? 'Lexus Delivery Day Prep Guide' : 'Buyer Guide &amp; Delivery Checklist'}
      </div>
      <div style="font-size: 14px; font-weight: 700; color: #fafafa; margin-bottom: 4px;">
        ${guideTitle}
      </div>
      <p style="margin: 0 0 10px 0; font-size: 12px; color: #a1a1aa; line-height: 1.5;">
        ${guideDescription}
      </p>
      <a href="${guideUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 16px; background-color: #27272a; border: 1px solid #3f3f46; color: #60a5fa; font-weight: 700; font-size: 13px; border-radius: 6px; text-decoration: none;">
        ${guideCtaText}
      </a>
    </div>
  `.trim();

  const textSection = `
--------------------------------------------------
HYBRID SAVINGS CALCULATOR:
${calculatorBannerText}

--------------------------------------------------
${promoConfig.isPromoActive ? `⚡ Black Friday Deals for Your ${modelDisplay}:` : `DELIVERY DAY ESSENTIALS (${modelDisplay}):`}
${gearPicks
  .map(
    (pick, i) => `${i + 1}. ${pick.title}${promoConfig.isPromoActive ? ' [ Black Friday Deal ]' : ''}
   ${pick.description}
   ${pick.buttonLabel}: ${pick.url}`
  )
  .join('\n\n')}

${AMAZON_ASSOCIATES_DISCLOSURE}

--------------------------------------------------
MODEL GUIDE & DELIVERY CHECKLIST:
${guideTitle}:
${guideUrl}
`.trim();

  return {
    modelDisplay,
    modelSlug,
    calculatorUrl,
    calculatorBannerText,
    gearPicks,
    guideUrl,
    guideTitle,
    guideDescription,
    disclosureText: AMAZON_ASSOCIATES_DISCLOSURE,
    htmlSection,
    textSection,
  };
}

/**
 * Formats an articulate vehicle header line (Year, Model, Trim, Powertrain/Drivetrain).
 * e.g., "2026 Corolla Hatchback SE Upgrade - 2.0L FWD"
 */
export function formatVehicleHeader(v: AllocationDropAlertVehicle): string {
  const yearStr = v.modelYear ? `${v.modelYear} ` : '';
  const modelStr = v.model || 'Toyota';
  const trimStr = v.trim ? ` ${v.trim}` : '';

  const specsParts: string[] = [];
  const engineStr = (v.engine || '').trim();
  const ptStr = (v.powertrain || '').trim();
  const dtStr = (v.drivetrain || '').trim();

  if (ptStr && ptStr.toLowerCase() !== 'all') {
    specsParts.push(ptStr);
  } else if (engineStr) {
    specsParts.push(engineStr);
  }

  if (dtStr && !specsParts.some((p) => p.toLowerCase().includes(dtStr.toLowerCase()))) {
    specsParts.push(dtStr);
  }

  const specsStr = specsParts.join(' ');
  const suffix = specsStr ? ` - ${specsStr}` : '';
  return `${yearStr}${modelStr}${trimStr}${suffix}`.trim();
}

/**
 * Resolves high-contrast status badge properties for email display.
 */
export function resolveVehicleStatusBadge(status?: string | null): {
  label: string;
  bg: string;
  color: string;
  border: string;
} {
  const lower = (status || '').toLowerCase().trim();
  if (lower.includes('transit') || lower.includes('incoming')) {
    return {
      label: 'In Transit',
      bg: 'rgba(56, 189, 248, 0.15)',
      color: '#38bdf8',
      border: 'rgba(56, 189, 248, 0.3)',
    };
  }
  if (lower.includes('allocat') || lower.includes('order')) {
    return {
      label: 'Allocated',
      bg: 'rgba(167, 139, 250, 0.15)',
      color: '#c084fc',
      border: 'rgba(167, 139, 250, 0.3)',
    };
  }
  return {
    label: 'Available on Lot',
    bg: 'rgba(52, 211, 153, 0.15)',
    color: '#34d399',
    border: 'rgba(52, 211, 153, 0.3)',
  };
}

/**
 * Formats vehicle pricing with currency badge.
 * e.g. "$31,796 CAD"
 */
export function formatVehiclePricing(
  sellingPrice?: number | null,
  msrp?: number | null
): string | null {
  if (sellingPrice != null && Number(sellingPrice) > 0) {
    return `$${Number(sellingPrice).toLocaleString('en-CA')} CAD`;
  }
  if (msrp != null && Number(msrp) > 0) {
    return `$${Number(msrp).toLocaleString('en-CA')} CAD`;
  }
  return null;
}

/**
 * Formats dealership name and city.
 * e.g., "Jim Pattison Toyota Surrey · Surrey, BC"
 */
export function formatVehicleDealership(
  dealerName?: string | null,
  dealerCity?: string | null
): string {
  const name = dealerName?.trim() || 'Lower Mainland Toyota Dealer';
  const city = dealerCity?.trim();
  if (city && !name.toLowerCase().includes(city.toLowerCase())) {
    return `${name} · ${city}`;
  }
  return name;
}

/**
 * Generates the complete responsive HTML and plain-text Allocation Drop Alert email
 * sent to verified subscribers when matching unreserved vehicles are observed.
 * Supports batch digests (multiple vehicles) and articulate vehicle dossiers.
 */
export function generateAllocationDropAlertEmail(
  input: AllocationDropAlertEmailInput,
  currentDate?: Date
): GeneratedDropAlertEmail {
  const effectiveDate = currentDate ?? input.currentDate ?? new Date();
  const vehicles: AllocationDropAlertVehicle[] =
    input.vehicles && input.vehicles.length > 0
      ? input.vehicles
      : [
          {
            vin: input.vin,
            model: input.model || 'Toyota',
            trim: input.trim,
            powertrain: input.powertrain,
            drivetrain: input.drivetrain,
            engine: input.engine,
            status: input.status,
            stockNumber: input.stockNumber,
            modelYear: input.modelYear,
            dealerName: input.dealerName,
            dealerCity: input.dealerCity,
            vdpUrl: input.vdpUrl,
            sellingPrice: input.sellingPrice,
            msrp: input.msrp,
          },
        ];

  const primaryModel = (vehicles[0] && vehicles[0].model) || input.model || 'rav4';
  const enrichment = buildDropAlertEnrichment({
    model: primaryModel,
    modelSlug: input.modelSlug,
    market: input.market || 'CA',
    currentDate: effectiveDate,
  });

  const count = vehicles.length;
  const matchSummary = `${count} Matching ${count === 1 ? 'Allocation' : 'Allocations'} Observed`;
  const targetModelName = primaryModel
    ? resolveAlertModelDisplay(primaryModel, input.modelSlug)
    : 'Toyota';

  // Region resolution: input.region -> vehicle city -> default Lower Mainland, BC
  const rawCity = vehicles[0]?.dealerCity;
  const region =
    input.region ||
    (rawCity ? (rawCity.includes(',') ? rawCity : `${rawCity}, BC`) : 'Lower Mainland, BC');

  // Pipeline Stage resolution
  const isInTransit = vehicles.some((v) => {
    const s = (v.status || '').toLowerCase();
    return s.includes('transit') || s.includes('incoming') || s.includes('port');
  });
  const pipelineStage = isInTransit
    ? '[ 🚢 In-Transit / Destination Port ]'
    : '[ ⚡ Fresh Allocation ]';

  // High-contrast pricing badge
  const firstPrice =
    vehicles[0]?.sellingPrice ?? vehicles[0]?.msrp ?? input.sellingPrice ?? input.msrp;
  const baseMsrpCad =
    firstPrice != null && Number(firstPrice) > 0
      ? Number(firstPrice).toLocaleString('en-CA')
      : null;
  const pricingBadge = baseMsrpCad
    ? `At MSRP ($${baseMsrpCad} CAD) • Zero Added Dealer Markups`
    : 'At MSRP • Zero Added Dealer Markups';

  // Deep-link primary inventory destination
  const commaSeparatedVins = vehicles
    .map((v) => v.vin || v.provisionalId)
    .filter(Boolean)
    .join(',');
  const primaryInventoryUrl = `https://www.toyotawaits.ca/inventory?vins=${encodeURIComponent(
    commaSeparatedVins
  )}&model=${encodeURIComponent(enrichment.modelSlug)}&utm_source=alert_drop`;

  const unsubToken = input.unsubscribeToken || '';
  const unsubscribeUrl =
    input.unsubscribeUrl ||
    (unsubToken
      ? `https://www.toyotawaits.ca/api/alerts/unsubscribe?token=${encodeURIComponent(unsubToken)}`
      : 'https://www.toyotawaits.ca/api/alerts/unsubscribe');

  const isLexusAllocation =
    input.make === 'Lexus' ||
    enrichment.modelSlug.startsWith('lexus-') ||
    vehicles.some(
      (v) =>
        v.make === 'Lexus' ||
        (typeof v.model === 'string' && v.model.toLowerCase().includes('lexus'))
    );

  let subject: string;
  if (isLexusAllocation) {
    if (vehicles.length === 1) {
      const v = vehicles[0];
      const yearStr = v.modelYear ? `${v.modelYear} ` : '';
      const cleanModel = (v.model || '').replace(/^Lexus\s+/i, '') || 'GX 550';
      const trimStr = v.trim ? ` ${v.trim}` : '';
      subject = `⚡ Lexus Allocation Match: ${yearStr}Lexus ${cleanModel}${trimStr} Available Now`.trim();
    } else {
      subject = `⚡ Lexus Allocation Match: ${vehicles.length} New Lexus Allocations Available Now`;
    }
  } else if (vehicles.length === 1) {
    const v = vehicles[0];
    const trimStr = v.trim ? ` (${v.trim})` : '';
    subject = `Allocation Alert: ${v.model}${trimStr} Observed (${region})`;
  } else {
    const distinctModels = Array.from(new Set(vehicles.map((v) => v.model).filter(Boolean)));
    subject = `Allocation Alert: ${vehicles.length} New Toyota Matches Observed (${distinctModels.join(', ')})`;
  }

  // Information-Gap Gatekeeping: Masked vehicle cards withholding dealer name and full VIN
  const vehiclesHtml = vehicles
    .map((v, idx) => {
      const headerText = formatVehicleHeader(v);
      const statusBadge = resolveVehicleStatusBadge(v.status);
      const priceFormatted = formatVehiclePricing(v.sellingPrice, v.msrp);
      const rawVin = v.vin || v.provisionalId || '';
      const maskedVin = rawVin.length >= 6 ? `••••••••••••${rawVin.slice(-4)}` : '•••••••••••••••••';

      return `
    <!-- Teaser Allocation Card ${idx + 1} (Information-Gap Gatekept) -->
    <div style="margin-top: 16px; background-color: #18181b; border: 1px solid #27272a; border-radius: 10px; padding: 18px;">
      <div style="margin-bottom: 12px; border-bottom: 1px solid #27272a; padding-bottom: 10px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
          <tr>
            <td style="vertical-align: middle;">
              <h3 style="margin: 0; font-size: 15px; font-weight: 700; color: #ffffff;">
                ${headerText}
              </h3>
            </td>
            <td style="vertical-align: middle; text-align: right; width: 140px;">
              <span style="display: inline-block; padding: 3px 8px; border-radius: 9999px; font-size: 10px; font-weight: 700; background-color: ${statusBadge.bg}; color: ${statusBadge.color}; border: 1px solid ${statusBadge.border}; text-transform: uppercase; letter-spacing: 0.5px;">
                ${statusBadge.label}
              </span>
            </td>
          </tr>
        </table>
      </div>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 14px; font-size: 13px;">
        <tr>
          <td style="padding: 4px 0; color: #a1a1aa; width: 130px;">Allocation VIN:</td>
          <td style="padding: 4px 0; color: #e4e4e7; font-family: monospace, Courier, monospace; font-weight: 600;">
            <span style="letter-spacing: 2px;">${maskedVin}</span>
            <span style="display: inline-block; margin-left: 6px; font-size: 10px; color: #f59e0b; background-color: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 4px; padding: 1px 5px; font-family: sans-serif;">Full VIN Isolated</span>
          </td>
        </tr>
        ${
          v.stockNumber
            ? `
        <tr>
          <td style="padding: 4px 0; color: #a1a1aa;">Stock Reference:</td>
          <td style="padding: 4px 0; color: #f4f4f5; font-weight: 600;">${v.stockNumber}</td>
        </tr>`
            : ''
        }
        ${
          priceFormatted
            ? `
        <tr>
          <td style="padding: 4px 0; color: #a1a1aa;">Pricing:</td>
          <td style="padding: 4px 0; color: #34d399; font-weight: 700;">${priceFormatted}</td>
        </tr>`
            : ''
        }
        <tr>
          <td style="padding: 4px 0; color: #a1a1aa;">Dealer &amp; Location:</td>
          <td style="padding: 4px 0; color: #fbbf24; font-weight: 600;">
            🔒 Locked &bull; Revealed on Live Inventory Feed
          </td>
        </tr>
      </table>

      <div>
        <a href="${primaryInventoryUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 18px; background-color: #dc2626; color: #ffffff; font-weight: 700; font-size: 13px; border-radius: 6px; text-decoration: none;">
          View Allocations &amp; Dealer Details &nearr;
        </a>
      </div>
    </div>`;
    })
    .join('');

  const vehiclesText = vehicles
    .map((v, idx) => {
      const headerText = formatVehicleHeader(v);
      const statusBadge = resolveVehicleStatusBadge(v.status);
      const priceFormatted = formatVehiclePricing(v.sellingPrice, v.msrp);
      const rawVin = v.vin || v.provisionalId || '';
      const maskedVin = rawVin.length >= 6 ? `••••••••••••${rawVin.slice(-4)}` : '•••••••••••••••••';

      return `==================================================
Match #${idx + 1}: ${headerText}
Status: ${statusBadge.label}
Allocation VIN: ${maskedVin} (Full 17-digit VIN locked)
${priceFormatted ? `Pricing: ${priceFormatted}\n` : ''}Dealer & Location: 🔒 Locked (Revealed on Live Feed)`;
    })
    .join('\n\n');

  const text = `
⚡ ${isLexusAllocation ? 'TOYOTAWAITS / LEXUS ALLOCATION RADAR' : 'ALLOCATION RADAR'}: ${region}
${matchSummary}
Prepping for: ${targetModelName}
Pipeline Stage: ${pipelineStage}
Pricing: ${pricingBadge}

Primary Link:
[ View Allocations & Dealer Details ↗ ]
${primaryInventoryUrl}

${vehiclesText}

${enrichment.textSection}

--------------------------------------------------
Sender: ToyotaWaits Alerts <hello@toyotawaits.ca>, Burnaby, BC
1-Click Unsubscribe: ${unsubscribeUrl}

Independent Platform Disclaimer: ToyotaWaits.ca is an independent community research platform not affiliated with Toyota Canada Inc., Toyota Motor Sales, U.S.A., or any franchised dealership.
Vehicle Availability Disclaimer: Observed allocations and transit statuses are collected via automated sweeps. Allocations are subject to prior sale, dealer reservation policies, and inventory updates.
${AMAZON_ASSOCIATES_DISCLOSURE}
`.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f4f4f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px; background-color: #09090b;">
    <!-- Top Radar Eyebrow & Branding Header -->
    <div style="padding-bottom: 14px; border-bottom: 1px solid #27272a;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
        <tr>
          <td>
            <span style="font-size: 18px; font-weight: 800; color: #ffffff;">${isLexusAllocation ? 'ToyotaWaits / Lexus Allocation Radar 🍁' : 'ToyotaWaits.ca 🍁'}</span>
          </td>
          <td style="text-align: right;">
            <span style="display: inline-block; padding: 3px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; background-color: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); text-transform: uppercase; letter-spacing: 0.5px;">
              ⚡ ALLOCATION RADAR: ${region}
            </span>
          </td>
        </tr>
      </table>
    </div>

    <!-- Match Summary & Target Model Pill -->
    <div style="margin-top: 18px;">
      <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 800; color: #ffffff; line-height: 1.3;">
        ${matchSummary}
      </h2>
      <div style="margin-bottom: 12px;">
        <span style="display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; background-color: #27272a; color: #f4f4f5; border: 1px solid #3f3f46;">
          Prepping for: ${targetModelName}
        </span>
        <span style="display: inline-block; margin-left: 6px; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; background-color: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3);">
          ${pipelineStage}
        </span>
      </div>
      <div style="margin-bottom: 18px; padding: 8px 12px; border-radius: 6px; background-color: rgba(52, 211, 153, 0.1); border: 1px solid rgba(52, 211, 153, 0.25); color: #34d399; font-size: 12px; font-weight: 700;">
        ${pricingBadge}
      </div>
    </div>

    <!-- Primary CTA Hero Button (Directs to isolated inventory allocations) -->
    <div style="margin-bottom: 24px; text-align: center;">
      <a href="${primaryInventoryUrl}" target="_blank" rel="noopener noreferrer" style="display: block; width: 100%; box-sizing: border-box; padding: 14px 20px; background-color: #dc2626; color: #ffffff; font-weight: 800; font-size: 15px; border-radius: 8px; text-decoration: none; text-align: center; letter-spacing: 0.3px; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);">
        View Allocations &amp; Dealer Details &nearr;
      </a>
    </div>

    <!-- Teaser Vehicle Allocations Grid -->
    ${vehiclesHtml}

    <!-- Secondary Engagement Bridges (Fuel Payback & Curated Delivery Gear) -->
    ${enrichment.htmlSection}

    <hr style="border: 0; border-top: 1px solid #27272a; margin: 28px 0 16px 0;" />

    <!-- Compliance Footer -->
    <div style="font-size: 11px; color: #71717a; line-height: 1.5;">
      <p style="margin: 0 0 8px 0; color: #a1a1aa;">
        Sender: <strong>ToyotaWaits Alerts</strong> &lt;hello@toyotawaits.ca&gt;, Burnaby, BC &bull; <a href="${unsubscribeUrl}" style="color: #fbbf24; text-decoration: underline;">1-Click Unsubscribe</a>
      </p>
      <p style="margin: 0 0 6px 0; font-size: 10px; color: #52525b; line-height: 1.4;">
        <strong>Independent Platform Disclaimer:</strong> ToyotaWaits.ca is an independent community research platform not affiliated with Toyota Canada Inc., Toyota Motor Sales, U.S.A., or any franchised dealership.
      </p>
      <p style="margin: 0 0 6px 0; font-size: 10px; color: #52525b; line-height: 1.4;">
        <strong>Vehicle Availability Disclaimer:</strong> Observed allocations and transit statuses are collected via automated sweeps. Allocations are subject to prior sale, dealer reservation policies, and inventory updates.
      </p>
      <p style="margin: 0; font-size: 10px; color: #52525b; line-height: 1.4;">
        ${AMAZON_ASSOCIATES_DISCLOSURE}
      </p>
    </div>
  </div>
</body>
</html>
`.trim();

  return {
    subject,
    html,
    text,
    headers: {
      'List-Unsubscribe': `<mailto:unsubscribe@toyotawaits.ca?subject=unsubscribe-${unsubToken}>, <${unsubscribeUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
    calculatorUrl: enrichment.calculatorUrl,
    guideUrl: enrichment.guideUrl,
    gearPicks: enrichment.gearPicks,
    primaryInventoryUrl,
  };
}
