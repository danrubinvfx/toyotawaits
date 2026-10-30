import { getGearMarketConfig } from '@/data/gear/catalog';
import { getAccessoriesForModel } from '@/data/accessories';
import {
  buildAmazonAffiliateUrl,
  getModelDisplayName,
} from '@/lib/gear/affiliate';
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
  buttonLabel: 'Check on Amazon ↗';
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
  vehicles?: AllocationDropAlertVehicle[];
}

export interface GeneratedDropAlertEmail {
  subject: string;
  html: string;
  text: string;
  headers: Record<string, string>;
  calculatorUrl: string;
  guideUrl: string;
  gearPicks: DropAlertGearPick[];
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
  market: 'CA' | 'US' = 'CA'
): string {
  const cleanKeywords = searchKeywords.trim() || 'Toyota accessories';
  return buildAmazonAffiliateUrl(cleanKeywords, market, market);
}

/**
 * Returns 2 curated model-specific Delivery Day Essentials from the gear catalog
 * using zero-404 search URL fallbacks and standard "Check on Amazon ↗" CTA labels.
 */
export function getCuratedGearForDropAlert(
  modelOrSlug?: string | null,
  market: 'CA' | 'US' = 'CA'
): DropAlertGearPick[] {
  const slug = resolveAlertModelSlug(modelOrSlug);
  const isUs = market === 'US';

  if (slug === 'rav4') {
    const dashcamCfg = getGearMarketConfig('fitcamx-rav4', 'rav4');
    const linersCfg = getGearMarketConfig('high-wall-floor-liners-rav4', 'rav4');

    const dashcamQuery =
      (isUs ? dashcamCfg?.searchKeywordsUS : dashcamCfg?.searchKeywordsCA) ||
      'Fitcamx dash cam Toyota RAV4 OEM 4K';
    const linersQuery =
      (isUs ? linersCfg?.searchKeywordsUS : linersCfg?.searchKeywordsCA) ||
      'TuxMat Toyota RAV4 custom all weather floor mats';

    return [
      {
        id: 'fitcamx-rav4',
        title: 'FitcamX OEM 4K Dashcam',
        description:
          dashcamCfg?.whyBuy ||
          'Discrete OEM look tapping into rearview mirror power with zero dangling cables.',
        searchQuery: dashcamQuery,
        url: buildZero404AmazonSearchUrl(dashcamQuery, market),
        buttonLabel: 'Check on Amazon ↗',
      },
      {
        id: 'high-wall-floor-liners-rav4',
        title: 'TuxMat TPE Liners',
        description:
          linersCfg?.whyBuy ||
          'Maximum high-wall laser-measured coverage containing snow, salt, mud, and water spills.',
        searchQuery: linersQuery,
        url: buildZero404AmazonSearchUrl(linersQuery, market),
        buttonLabel: 'Check on Amazon ↗',
      },
    ];
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

    return [
      {
        id: 'sienna-all-weather-liners',
        title: '3-Row Custom Floor Liners',
        description:
          linersCfg?.whyBuy ||
          'Maximized spill containment along sliding Super Long Slide tracks and cargo trunk well.',
        searchQuery: linersQuery,
        url: buildZero404AmazonSearchUrl(linersQuery, market),
        buttonLabel: 'Check on Amazon ↗',
      },
      {
        id: 'console-tray-sienna',
        title: 'Center Console Sliding Organizer',
        description:
          consoleCfg?.whyBuy ||
          'Tames the deep center bridge cubby and upper armrest cavity with non-slip rubber inserts.',
        searchQuery: consoleQuery,
        url: buildZero404AmazonSearchUrl(consoleQuery, market),
        buttonLabel: 'Check on Amazon ↗',
      },
    ];
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

    return [
      {
        id: 'screen-protector-grand-highlander',
        title: '12.3" Matte Screen Protector',
        description:
          screenCfg?.whyBuy ||
          'Prevents fingerprint oil buildup and eliminates harsh reflections across wide cabin glass.',
        searchQuery: screenQuery,
        url: buildZero404AmazonSearchUrl(screenQuery, market),
        buttonLabel: 'Check on Amazon ↗',
      },
      {
        id: 'fitcamx-grand-highlander',
        title: 'TSS 3.0 Dashcam',
        description:
          dashcamCfg?.whyBuy ||
          'Custom molded mirror housing integrating 4K recording under the digital/standard mirror bracket.',
        searchQuery: dashcamQuery,
        url: buildZero404AmazonSearchUrl(dashcamQuery, market),
        buttonLabel: 'Check on Amazon ↗',
      },
    ];
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

    return [
      {
        id: 'fitcamx-prius',
        title: 'FitcamX OEM Integrated 4K Dashcam',
        description:
          dashcamCfg?.whyBuy ||
          'Factory-integrated mirror replacement for sleek Gen 5 Prius windshield aerodynamics.',
        searchQuery: dashcamQuery,
        url: buildZero404AmazonSearchUrl(dashcamQuery, market),
        buttonLabel: 'Check on Amazon ↗',
      },
      {
        id: 'prius-all-weather-liners',
        title: 'Custom-Fit All-Weather 3D TPE Floor Liners',
        description:
          linersCfg?.whyBuy ||
          'High-wall laser-measured floor & trunk protection engineered for the Gen 5 Prius cabin.',
        searchQuery: linersQuery,
        url: buildZero404AmazonSearchUrl(linersQuery, market),
        buttonLabel: 'Check on Amazon ↗',
      },
    ];
  }

  if (slug === 'camry') {
    const screenQuery = 'Toyota Camry 12.3 inch screen protector tempered glass';
    const linersQuery = 'Toyota Camry all weather floor mats TPE';

    return [
      {
        id: 'camry-screen-protector',
        title: '12.3" Anti-Glare Tempered Glass Screen Protector',
        description:
          '9H hardness matte oleophobic tempered glass custom cut for the Camry multimedia touchscreen.',
        searchQuery: screenQuery,
        url: buildZero404AmazonSearchUrl(screenQuery, market),
        buttonLabel: 'Check on Amazon ↗',
      },
      {
        id: 'camry-floor-liners',
        title: 'All-Weather Custom TPE Floor Liners',
        description:
          'Laser-fit high-wall floor mats protecting front and rear footwells from winter slush and road salt.',
        searchQuery: linersQuery,
        url: buildZero404AmazonSearchUrl(linersQuery, market),
        buttonLabel: 'Check on Amazon ↗',
      },
    ];
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

    return [
      {
        id: 'fitcamx-corolla-hatchback',
        title: 'FitcamX OEM-Integrated 4K Dashcam',
        description:
          'Clean factory-look dashcam drawing power directly from the TSS rearview mirror harness without exposed wires.',
        searchQuery: dashcamQuery,
        url: buildZero404AmazonSearchUrl(dashcamQuery, market),
        buttonLabel: 'Check on Amazon ↗',
      },
      {
        id: 'corolla-hatchback-all-weather-liners',
        title: 'Custom-Fit All-Weather Floor Liners',
        description:
          'High-wall TPE waterproof liners engineered for Corolla Hatchback floor wells and retention clips.',
        searchQuery: linersQuery,
        url: buildZero404AmazonSearchUrl(linersQuery, market),
        buttonLabel: 'Check on Amazon ↗',
      },
      {
        id: 'console-tray-corolla-hatchback',
        title: 'Center Console Armrest Organizer Tray',
        description:
          'Dual-tier organizer tray dividing the deep armrest compartment with coin and cable slots.',
        searchQuery: trayQuery,
        url: buildZero404AmazonSearchUrl(trayQuery, market),
        buttonLabel: 'Check on Amazon ↗',
      },
    ];
  }

  // Fallback for other Toyota models (Tacoma, Corolla Cross, Land Cruiser, Sequoia, Highlander, etc.)
  const modelDisplay = getModelDisplayName(slug);
  const accessories = getAccessoriesForModel(modelDisplay);
  const pick1Source = accessories[0];
  const pick2Source = accessories[1];

  const query1 =
    pick1Source?.searchQuery ||
    `Fitcamx dash cam Toyota ${modelDisplay} OEM 4K`;
  const query2 =
    pick2Source?.searchQuery ||
    `Toyota ${modelDisplay} custom all weather floor mats liners`;

  return [
    {
      id: pick1Source?.id || `${slug}-dashcam`,
      title: pick1Source?.title || `FitcamX OEM-Integrated 4K Dashcam (${modelDisplay})`,
      description:
        pick1Source?.description ||
        `Clean factory-look dashcam drawing power directly from the TSS rearview mirror harness without exposed wires for ${modelDisplay}.`,
      searchQuery: query1,
      url: buildZero404AmazonSearchUrl(query1, market),
      buttonLabel: 'Check on Amazon ↗',
    },
    {
      id: pick2Source?.id || `${slug}-floor-liners`,
      title: pick2Source?.title || `Custom-Fit All-Weather Floor Liners (${modelDisplay})`,
      description:
        pick2Source?.description ||
        `High-wall TPE waterproof liners engineered for ${modelDisplay} floor wells and retention clips.`,
      searchQuery: query2,
      url: buildZero404AmazonSearchUrl(query2, market),
      buttonLabel: 'Check on Amazon ↗',
    },
  ];
}

/**
 * Builds the model-specific Calculator CTA, 2 Curated Delivery Day Gear Picks,
 * and Guide / Model Hub Cross-Link for both HTML and Plain-Text drop alert emails.
 */
export function buildDropAlertEnrichment(params: {
  model?: string | null;
  modelSlug?: string | null;
  market?: 'CA' | 'US';
}): DropAlertEnrichment {
  const modelSlug = resolveAlertModelSlug(params.model, params.modelSlug);
  const modelDisplay = resolveAlertModelDisplay(params.model, modelSlug);
  const market = params.market || 'CA';

  const calculatorUrl = `https://www.toyotawaits.ca/calculator/${modelSlug}`;
  const calculatorBannerText = `Planning your budget? Calculate your annual fuel savings and break-even timeline for this ${modelDisplay} on our Hybrid Savings Calculator: ${calculatorUrl}`;

  const gearPicks = getCuratedGearForDropAlert(modelSlug, market);

  const isSienna = modelSlug === 'sienna';
  const guideUrl = isSienna
    ? SIENNA_HITCH_GUIDE_URL
    : `https://www.toyotawaits.ca/wait-times/${modelSlug}`;
  const guideTitle = isSienna
    ? 'Sienna Trailer Hitch & Bike Rack Guide'
    : `${modelDisplay} Wait Times & Delivery Checklist Hub`;
  const guideDescription = isSienna
    ? 'Planning to carry bikes or cargo? Check our complete Sienna 2-inch hitch receiver, ground clearance, and kick-sensor guide.'
    : `Review live Canadian wait-time benchmarks, provincial allocation trends, and the delivery checklist for your ${modelDisplay}.`;

  const htmlSection = `
    <!-- Calculator CTA Callout Box -->
    <div style="margin-top: 20px; background-color: #18181b; border: 1px solid #f59e0b; border-left: 4px solid #f59e0b; border-radius: 10px; padding: 18px;">
      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #fbbf24; margin-bottom: 6px;">
        ⛽ Hybrid &amp; PHEV Savings Calculator
      </div>
      <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 1.5; color: #e4e4e7;">
        Planning your budget? Calculate your annual fuel savings and break-even timeline for this ${modelDisplay} on our Hybrid Savings Calculator: <a href="${calculatorUrl}" target="_blank" rel="noopener noreferrer" style="color: #fbbf24; font-weight: 600; text-decoration: underline;">${calculatorUrl}</a>
      </p>
      <a href="${calculatorUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 16px; background-color: #f59e0b; color: #09090b; font-weight: 700; font-size: 13px; border-radius: 6px; text-decoration: none;">
        Calculate ${modelDisplay} Fuel Savings &rarr;
      </a>
    </div>

    <!-- Delivery Day Essentials (2 Curated Picks) -->
    <div style="margin-top: 20px; background-color: #18181b; border: 1px solid #27272a; border-radius: 10px; padding: 18px;">
      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #34d399; margin-bottom: 4px;">
        🛡️ Delivery Day Essentials (${modelDisplay})
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
              ${pick.title}
            </div>
            <div style="font-size: 12px; color: #a1a1aa; line-height: 1.4; margin-bottom: 10px;">
              ${pick.description}
            </div>
            <a href="${pick.url}" target="_blank" rel="sponsored noopener noreferrer" style="display: inline-block; padding: 8px 14px; background-color: #27272a; border: 1px solid #3f3f46; color: #fbbf24; font-weight: 700; font-size: 12px; border-radius: 6px; text-decoration: none;">
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
        📘 Buyer Guide &amp; Delivery Checklist
      </div>
      <div style="font-size: 14px; font-weight: 700; color: #fafafa; margin-bottom: 4px;">
        ${guideTitle}
      </div>
      <p style="margin: 0 0 10px 0; font-size: 12px; color: #a1a1aa; line-height: 1.5;">
        ${guideDescription}
      </p>
      <a href="${guideUrl}" target="_blank" rel="noopener noreferrer" style="font-size: 13px; font-weight: 700; color: #60a5fa; text-decoration: underline;">
        ${guideTitle} &rarr;
      </a>
    </div>
  `.trim();

  const textSection = `
--------------------------------------------------
HYBRID SAVINGS CALCULATOR:
${calculatorBannerText}

--------------------------------------------------
DELIVERY DAY ESSENTIALS (${modelDisplay}):
${gearPicks
  .map(
    (pick, i) => `${i + 1}. ${pick.title}
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
  input: AllocationDropAlertEmailInput
): GeneratedDropAlertEmail {
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
  });

  const unsubToken = input.unsubscribeToken || '';
  const unsubscribeUrl =
    input.unsubscribeUrl ||
    `https://www.toyotawaits.ca/api/alerts/verify?token=${encodeURIComponent(
      unsubToken
    )}&action=unsubscribe`;

  let subject: string;
  if (vehicles.length === 1) {
    const v = vehicles[0];
    const trimStr = v.trim ? ` (${v.trim})` : '';
    const dealerStr = v.dealerName || 'Toyota Dealer';
    subject = `Allocation Alert: ${v.model}${trimStr} at ${dealerStr}`;
  } else {
    const distinctModels = Array.from(new Set(vehicles.map((v) => v.model).filter(Boolean)));
    subject = `Allocation Alert: ${vehicles.length} New Toyota Matches Observed (${distinctModels.join(', ')})`;
  }

  const vehiclesHtml = vehicles
    .map((v) => {
      const headerText = formatVehicleHeader(v);
      const statusBadge = resolveVehicleStatusBadge(v.status);
      const priceFormatted = formatVehiclePricing(v.sellingPrice, v.msrp);
      const dealerFormatted = formatVehicleDealership(v.dealerName, v.dealerCity);
      const displayVin = v.vin || v.provisionalId || 'PROVISIONAL';
      const vdpUrl = v.vdpUrl || 'https://www.toyotawaits.ca/inventory';

      return `
    <!-- Articulate Vehicle Dossier Card -->
    <div style="margin-top: 20px; background-color: #18181b; border: 1px solid #27272a; border-radius: 10px; padding: 20px;">
      <div style="margin-bottom: 14px; border-bottom: 1px solid #27272a; padding-bottom: 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
          <tr>
            <td style="vertical-align: middle;">
              <h3 style="margin: 0; font-size: 16px; font-weight: 700; color: #ffffff;">
                ${headerText}
              </h3>
            </td>
            <td style="vertical-align: middle; text-align: right; width: 130px;">
              <span style="display: inline-block; padding: 3px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; background-color: ${statusBadge.bg}; color: ${statusBadge.color}; border: 1px solid ${statusBadge.border}; text-transform: uppercase; letter-spacing: 0.5px;">
                ${statusBadge.label}
              </span>
            </td>
          </tr>
        </table>
      </div>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 16px; font-size: 13px;">
        <tr>
          <td style="padding: 4px 0; color: #a1a1aa; width: 100px;">VIN:</td>
          <td style="padding: 4px 0; color: #f4f4f5; font-family: monospace, Courier, monospace; font-weight: 600;">${displayVin}</td>
        </tr>
        ${
          v.stockNumber
            ? `
        <tr>
          <td style="padding: 4px 0; color: #a1a1aa;">Stock #:</td>
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
          <td style="padding: 4px 0; color: #a1a1aa;">Dealership:</td>
          <td style="padding: 4px 0; color: #f4f4f5; font-weight: 500;">${dealerFormatted}</td>
        </tr>
      </table>

      <div>
        <a href="${vdpUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 18px; background-color: #dc2626; color: #ffffff; font-weight: 700; font-size: 13px; border-radius: 6px; text-decoration: none;">
          View Dealer Listing &rarr;
        </a>
      </div>
    </div>`;
    })
    .join('');

  const vehiclesText = vehicles
    .map((v) => {
      const h = formatVehicleHeader(v);
      const b = resolveVehicleStatusBadge(v.status);
      const p = formatVehiclePricing(v.sellingPrice, v.msrp);
      const d = formatVehicleDealership(v.dealerName, v.dealerCity);
      const vinStr = v.vin || v.provisionalId || 'PROVISIONAL';
      const vUrl = v.vdpUrl || 'https://www.toyotawaits.ca/inventory';

      return `==================================================
${h}
Status: ${b.label}
VIN: ${vinStr}
${v.stockNumber ? `Stock #: ${v.stockNumber}\n` : ''}${p ? `Pricing: ${p}\n` : ''}Dealership: ${d}
View Dealer Listing:
${vUrl}`;
    })
    .join('\n\n');

  const text = `
ToyotaWaits.ca 🍁 Allocation Drop Alert
${vehiclesText}

${enrichment.textSection}

--------------------------------------------------
Sent by ToyotaWaits.ca (Independent research platform not affiliated with Toyota Canada Inc. or any dealership).
Contact: hello@toyotawaits.ca
1-Click Unsubscribe: ${unsubscribeUrl}
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
    <div style="padding-bottom: 16px; border-bottom: 1px solid #27272a;">
      <span style="font-size: 18px; font-weight: 800; color: #ffffff;">ToyotaWaits.ca 🍁</span>
      <span style="display: inline-block; margin-left: 8px; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; background-color: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3);">Allocation Drop Alert</span>
    </div>

    ${vehiclesHtml}

    ${enrichment.htmlSection}

    <hr style="border: 0; border-top: 1px solid #27272a; margin: 24px 0 16px 0;" />
    <p style="font-size: 11px; color: #71717a; line-height: 1.5; margin: 0;">
      Sent by ToyotaWaits.ca (Independent research platform not affiliated with Toyota Canada Inc. or any dealership). Contact: <a href="mailto:hello@toyotawaits.ca" style="color: #a1a1aa;">hello@toyotawaits.ca</a> &bull; <a href="${unsubscribeUrl}" style="color: #a1a1aa;">1-Click Unsubscribe</a>
    </p>
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
  };
}
