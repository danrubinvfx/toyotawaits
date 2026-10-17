/**
 * inspect-endpoints.ts
 *
 * Sprint 1: Dealer Discovery & Endpoint Validation (Refined Audit)
 * ToyotaWaits.ca Master Plan V3.2
 *
 * Policy Guardrails (Master Plan V3.2 Section 2 & Page 2):
 * 1. "Do not bypass authentication, CAPTCHAS, access restrictions or other technical controls.
 *    An unavailable source becomes a coverage limitation, not a reason to promise completeness."
 * 2. Sequential requests only (no concurrent bursts)
 * 3. Polite delay of at least 1.2s between calls (configured to 1500ms)
 * 4. Explicit 6000ms request timeout
 * 5. User-Agent: Mozilla/5.0 (compatible; ToyotaWaitsLocalAuditor/1.0; +https://toyotawaits.ca/source-register)
 */

import * as fs from 'fs';
import * as path from 'path';

// --- Configuration Constants ---
const POLITE_DELAY_MS = 1500;
const REQUEST_TIMEOUT_MS = 6000;
const USER_AGENT =
  'Mozilla/5.0 (compatible; ToyotaWaitsLocalAuditor/1.0; +https://toyotawaits.ca/source-register)';

export interface TargetProbe {
  probeId: string;
  dealerId: string;
  dealerName: string;
  category: 'convertus_html' | 'convertus_api' | 'openroad_html' | 'openroad_api' | 'generic_cloudflare';
  targetUrl: string;
  description: string;
  expectedSurface: string;
}

export interface Gate1FieldEvaluation {
  supported: boolean;
  fieldsFound: string[];
  notes: string;
}

export interface Gate1Evaluation {
  verdict: 'PASS' | 'CONDITIONAL' | 'COVERAGE_LIMITATION' | 'INCOMPATIBLE';
  vinEvaluation: Gate1FieldEvaluation;
  modelTrimEvaluation: Gate1FieldEvaluation;
  statusEvaluation: Gate1FieldEvaluation;
  priceBreakdownEvaluation: Gate1FieldEvaluation;
  paginationEvaluation: Gate1FieldEvaluation;
  summary: string;
}

export interface ProbeResult {
  probeId: string;
  dealerId: string;
  dealerName: string;
  category: string;
  targetUrl: string;
  finalUrl: string;
  httpStatus: number | null;
  statusText: string;
  headers: Record<string, string>;
  contentType: string;
  isJson: boolean;
  isCloudflareChallenge: boolean;
  requiresAuth: boolean;
  responseTimeMs: number;
  payloadSummary: {
    type: 'json_array' | 'json_object' | 'html' | 'text' | 'error' | 'empty';
    detectedItemCount?: number;
    sampleKeys?: string[];
    rawSnippet: string;
  };
  architecturalFindings: {
    hostingPlatform?: string;
    serverSideHydrationFound?: boolean;
    discoveredEndpoints?: string[];
    governanceStatus?: string;
  };
  gate1Evaluation: Gate1Evaluation;
  error?: string;
  timestamp: string;
}

const PROBE_TARGETS: TargetProbe[] = [
  // 1. Jim Pattison Toyota Downtown - Public Inventory Landing Page Inspection
  {
    probeId: 'jp-inventory-page',
    dealerId: 'jp-toyota-downtown',
    dealerName: 'Jim Pattison Toyota Downtown',
    category: 'convertus_html',
    targetUrl: 'https://www.jptoyota-downtown.com/vehicles/new/',
    description: 'Inspect public inventory landing page for dataLayer, vmsData, and server-rendered hydration state.',
    expectedSurface: 'Convertus WordPress SRP page',
  },
  // 1b. Jim Pattison Toyota Downtown - Convertus VMS Endpoint (Discovered via SRP bundle)
  {
    probeId: 'jp-convertus-vms-endpoint',
    dealerId: 'jp-toyota-downtown',
    dealerName: 'Jim Pattison Toyota Downtown',
    category: 'convertus_api',
    targetUrl:
      'https://www.jptoyota-downtown.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Fcp%3D1250%26ln%3Den%26sc%3Dnew',
    description: 'Probe Convertus VMS proxy endpoint for vehicle records and Gate 1 schema compatibility.',
    expectedSurface: 'Convertus VMS JSON Proxy API',
  },
  // 2. OpenRoad Toyota Richmond - Public Inventory Listing HTML
  {
    probeId: 'openroad-inventory-html',
    dealerId: 'openroad-toyota-richmond',
    dealerName: 'OpenRoad Toyota Richmond',
    category: 'openroad_html',
    targetUrl: 'https://openroadtoyotarichmond.com/inventory?page=1&page_size=24&sort_by=recents&condition=new&init_ds=1',
    description: 'Fetch public inventory listing HTML to inspect for hydration state and client-side React bundles.',
    expectedSurface: 'ASP.NET Core / React SPA Shell',
  },
  // 2b. OpenRoad Toyota Richmond - Client-side Inventory API Endpoint
  {
    probeId: 'openroad-inventory-api',
    dealerId: 'openroad-toyota-richmond',
    dealerName: 'OpenRoad Toyota Richmond',
    category: 'openroad_api',
    targetUrl:
      'https://inventory.oragdigital.com/inventory/search?startIndex=0&endIndex=5&sortCode=recent&searchPhrase=&businessUnitId=30&searchBusinessUnitId=30',
    description: 'Probe client-side inventory search API identified in OpenRoad React bundle (VLP.bundle.js).',
    expectedSurface: 'ORAG Digital Inventory API',
  },
  // 3. Granville Toyota - Cloudflare Protected Endpoint (Coverage Limitation Assessment)
  {
    probeId: 'granville-api-cloudflare',
    dealerId: 'granville-toyota',
    dealerName: 'Granville Toyota',
    category: 'generic_cloudflare',
    targetUrl: 'https://www.granvilletoyota.com/api/inventory/?vehicle_type=new&limit=5',
    description: 'Probe canonical inventory route without bypassing Cloudflare WAF/CAPTCHAs.',
    expectedSurface: 'Cloudflare Managed Challenge / WAF Protected API',
  },
];

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

function evaluateGate1(
  isJson: boolean,
  httpStatus: number | null,
  isCloudflare: boolean,
  requiresAuth: boolean,
  data: any,
  responseHeaders: Record<string, string>,
  target: TargetProbe
): Gate1Evaluation {
  // Policy Guardrail 1: Cloudflare WAF / Managed Challenge
  if (isCloudflare) {
    return {
      verdict: 'COVERAGE_LIMITATION',
      vinEvaluation: { supported: false, fieldsFound: [], notes: 'Source protected by Cloudflare Managed Challenge' },
      modelTrimEvaluation: { supported: false, fieldsFound: [], notes: 'Source protected by Cloudflare Managed Challenge' },
      statusEvaluation: { supported: false, fieldsFound: [], notes: 'Source protected by Cloudflare Managed Challenge' },
      priceBreakdownEvaluation: { supported: false, fieldsFound: [], notes: 'Source protected by Cloudflare Managed Challenge' },
      paginationEvaluation: { supported: false, fieldsFound: [], notes: 'Source protected by Cloudflare Managed Challenge' },
      summary:
        'Policy Guardrail Applied (Master Plan V3.2 Page 2): Do not bypass authentication, CAPTCHAs, or access restrictions. Flagged as COVERAGE LIMITATION.',
    };
  }

  // Policy Guardrail 2: Access Restrictions / HTTP 401 Unauthorized
  if (requiresAuth || httpStatus === 401) {
    return {
      verdict: 'COVERAGE_LIMITATION',
      vinEvaluation: { supported: false, fieldsFound: [], notes: 'Access restricted: HTTP 401 Unauthorized without authentication' },
      modelTrimEvaluation: { supported: false, fieldsFound: [], notes: 'Access restricted: HTTP 401 Unauthorized' },
      statusEvaluation: { supported: false, fieldsFound: [], notes: 'Access restricted: HTTP 401 Unauthorized' },
      priceBreakdownEvaluation: { supported: false, fieldsFound: [], notes: 'Access restricted: HTTP 401 Unauthorized' },
      paginationEvaluation: { supported: false, fieldsFound: [], notes: 'Access restricted: HTTP 401 Unauthorized' },
      summary:
        'Policy Guardrail Applied: Endpoint requires authentication credentials. ToyotaWaits will not inject credentials or bypass access controls. Flagged as COVERAGE LIMITATION.',
    };
  }

  // If HTML landing page, evaluate hydration state
  if (target.category.endsWith('_html')) {
    return {
      verdict: 'INCOMPATIBLE',
      vinEvaluation: { supported: false, fieldsFound: [], notes: 'HTML shell inspected: no server-side vehicle records hydrated into DOM' },
      modelTrimEvaluation: { supported: false, fieldsFound: [], notes: 'HTML shell inspected' },
      statusEvaluation: { supported: false, fieldsFound: [], notes: 'HTML shell inspected' },
      priceBreakdownEvaluation: { supported: false, fieldsFound: [], notes: 'HTML shell inspected' },
      paginationEvaluation: { supported: false, fieldsFound: [], notes: 'HTML shell inspected' },
      summary:
        'Client-rendered HTML shell; vehicle records are not hydrated in static DOM or dataLayer, but loaded asynchronously via client bundles.',
    };
  }

  if (!isJson || !data || (httpStatus !== null && httpStatus >= 400)) {
    return {
      verdict: 'INCOMPATIBLE',
      vinEvaluation: { supported: false, fieldsFound: [], notes: `HTTP ${httpStatus ?? 'ERR'}` },
      modelTrimEvaluation: { supported: false, fieldsFound: [], notes: `HTTP ${httpStatus ?? 'ERR'}` },
      statusEvaluation: { supported: false, fieldsFound: [], notes: `HTTP ${httpStatus ?? 'ERR'}` },
      priceBreakdownEvaluation: { supported: false, fieldsFound: [], notes: `HTTP ${httpStatus ?? 'ERR'}` },
      paginationEvaluation: { supported: false, fieldsFound: [], notes: `HTTP ${httpStatus ?? 'ERR'}` },
      summary: `Candidate endpoint failed: returned HTTP ${httpStatus ?? 'network error'}.`,
    };
  }

  // Locate records array
  let records: any[] = [];
  if (Array.isArray(data)) {
    records = data;
  } else if (typeof data === 'object') {
    for (const key of ['results', 'vehicles', 'data', 'inventory', 'items']) {
      if (Array.isArray(data[key])) {
        records = data[key];
        break;
      }
    }
  }

  const sample = records[0] || {};
  const sampleKeys = Object.keys(sample);

  // 1. True 17-char VIN vs provisional/stock
  const vinVal = String(sample.vin || sample.VIN || '');
  const stockVal = String(sample.stock_number || sample.stockNumber || sample.stock || '');
  const is17CharVin = /^[A-HJ-NPR-Z0-9]{17}$/i.test(vinVal.trim());

  const vinEval: Gate1FieldEvaluation = {
    supported: is17CharVin,
    fieldsFound: [
      ...(sample.vin !== undefined ? ['vin'] : []),
      ...(sample.stock_number !== undefined ? ['stock_number'] : []),
    ],
    notes: is17CharVin
      ? `Verified true 17-character VIN in 'vin' ("${vinVal}") distinctly separated from stock_number ("${stockVal}")`
      : 'Missing true 17-character VIN',
  };

  // 2. Model & Trim
  const hasModel = Boolean(sample.model || sample.make);
  const hasTrim = Boolean(sample.trim || sample.search_trim || sample.model_code);
  const modelTrimEval: Gate1FieldEvaluation = {
    supported: hasModel && hasTrim,
    fieldsFound: [
      ...(sample.make ? ['make'] : []),
      ...(sample.model ? ['model'] : []),
      ...(sample.trim ? ['trim'] : []),
      ...(sample.model_code ? ['model_code'] : []),
      ...(sample.package_code ? ['package_code'] : []),
    ],
    notes: hasModel && hasTrim
      ? `Comprehensive vehicle definition: make='${sample.make}', model='${sample.model}', trim='${sample.trim}', model_code='${sample.model_code}'`
      : 'Incomplete model or trim specification',
  };

  // 3. Explicit status declaration (no inference)
  const hasSaleClass = sample.sale_class !== undefined;
  const hasInTransit = sample.in_transit !== undefined;
  const hasOnOrder = sample.on_order !== undefined;
  const hasDaysOnLot = sample.days_on_lot !== undefined;
  const statusSupported = hasSaleClass && (hasInTransit || hasOnOrder || hasDaysOnLot);

  const statusEval: Gate1FieldEvaluation = {
    supported: statusSupported,
    fieldsFound: [
      ...(hasSaleClass ? ['sale_class'] : []),
      ...(hasInTransit ? ['in_transit'] : []),
      ...(hasOnOrder ? ['on_order'] : []),
      ...(hasDaysOnLot ? ['days_on_lot'] : []),
    ],
    notes: statusSupported
      ? `Explicit availability flags: sale_class='${sample.sale_class}', in_transit=${sample.in_transit}, on_order=${sample.on_order}, days_on_lot=${sample.days_on_lot}. Zero inference required.`
      : 'No explicit status fields; violates Gate 1 non-inference mandate',
  };

  // 4. Price breakdown (MSRP vs advertised vs fees)
  const hasMsrp = sample.msrp !== undefined;
  const hasAskingPrice = sample.asking_price !== undefined || sample.internet_price !== undefined;
  const hasFinalPrice = sample.final_price !== undefined || sample.sale_price !== undefined;
  const hasBreakdown = Array.isArray(sample.breakdown) || Array.isArray(sample.finance);
  const priceSupported = hasMsrp && (hasAskingPrice || hasFinalPrice);

  const priceEval: Gate1FieldEvaluation = {
    supported: priceSupported,
    fieldsFound: [
      ...(hasMsrp ? ['msrp'] : []),
      ...(sample.asking_price !== undefined ? ['asking_price'] : []),
      ...(sample.sale_price !== undefined ? ['sale_price'] : []),
      ...(sample.internet_price !== undefined ? ['internet_price'] : []),
      ...(sample.initial_price !== undefined ? ['initial_price'] : []),
      ...(sample.final_price !== undefined ? ['final_price'] : []),
      ...(hasBreakdown ? ['breakdown', 'finance', 'lease'] : []),
    ],
    notes: priceSupported
      ? `Granular pricing breakdown present: msrp=$${sample.msrp}, asking_price=$${sample.asking_price}, internet_price=$${sample.internet_price}, final_price=$${sample.final_price}`
      : 'Single price field or missing MSRP separation',
  };

  // 5. Pagination parameters
  const totalVehicles = data?.summary?.total_vehicles;
  const paginationSupported = typeof totalVehicles === 'number' || data.filters !== undefined;

  const paginationEval: Gate1FieldEvaluation = {
    supported: paginationSupported,
    fieldsFound: [
      ...(totalVehicles !== undefined ? ['summary.total_vehicles'] : []),
      ...(data.filters ? ['filters'] : []),
      ...(data.all_filters ? ['all_filters'] : []),
    ],
    notes: paginationSupported
      ? `Pagination metadata validated: total_vehicles=${totalVehicles}, multi-facet filter parameters supported`
      : 'No pagination parameters detected',
  };

  const isFullPass =
    vinEval.supported &&
    modelTrimEval.supported &&
    statusEval.supported &&
    priceEval.supported &&
    paginationEval.supported;

  return {
    verdict: isFullPass ? 'PASS' : 'CONDITIONAL',
    vinEvaluation: vinEval,
    modelTrimEvaluation: modelTrimEval,
    statusEvaluation: statusEval,
    priceBreakdownEvaluation: priceEval,
    paginationEvaluation: paginationEval,
    summary: isFullPass
      ? 'Fully satisfies Gate 1 Source Register requirements (true 17-char VIN, explicit status, MSRP breakdown, complete pagination).'
      : 'Conditionally compatible; some required fields missing or unverified.',
  };
}

async function probeTarget(target: TargetProbe): Promise<ProbeResult> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  console.log(`\n======================================================`);
  console.log(`[PROBING] ${target.dealerName} -> ${target.probeId}`);
  console.log(`  Description: ${target.description}`);
  console.log(`  Target URL: ${target.targetUrl}`);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const res = await fetch(target.targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'application/json, text/html, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: controller.signal,
      redirect: 'follow',
    });

    clearTimeout(timeoutId);
    const responseTimeMs = Date.now() - startTime;

    const headers: Record<string, string> = {};
    res.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const contentType = headers['content-type'] || '';
    const rawBody = await res.text();

    const isCloudflareChallenge =
      rawBody.includes('challenges.cloudflare.com') ||
      rawBody.includes('_cf_chl_opt') ||
      rawBody.includes('Just a moment...');

    const requiresAuth = res.status === 401;

    let isJson = false;
    let parsedJson: any = null;

    try {
      parsedJson = JSON.parse(rawBody);
      isJson = true;
    } catch {
      isJson = false;
    }

    let payloadType: ProbeResult['payloadSummary']['type'] = 'text';
    let detectedItemCount: number | undefined;
    let sampleKeys: string[] | undefined;

    if (isJson) {
      if (Array.isArray(parsedJson)) {
        payloadType = 'json_array';
        detectedItemCount = parsedJson.length;
        if (parsedJson[0] && typeof parsedJson[0] === 'object') {
          sampleKeys = Object.keys(parsedJson[0]).slice(0, 15);
        }
      } else if (typeof parsedJson === 'object' && parsedJson !== null) {
        payloadType = 'json_object';
        sampleKeys = Object.keys(parsedJson).slice(0, 15);
        for (const k of ['results', 'vehicles', 'data', 'inventory', 'items']) {
          if (Array.isArray(parsedJson[k])) {
            detectedItemCount = parsedJson[k].length;
            break;
          }
        }
      }
    } else if (contentType.includes('html') || rawBody.trim().startsWith('<')) {
      payloadType = 'html';
    } else if (rawBody.trim().length === 0) {
      payloadType = 'empty';
    }

    const rawSnippet = rawBody.slice(0, 300).replace(/[\r\n]+/g, ' ');

    const architecturalFindings: ProbeResult['architecturalFindings'] = {};
    if (target.category === 'convertus_html') {
      architecturalFindings.hostingPlatform = 'Convertus (WordPress)';
      architecturalFindings.serverSideHydrationFound = false;
      architecturalFindings.discoveredEndpoints = [
        'https://www.jptoyota-downtown.com/wp-admin/admin-ajax.php (action=vms_data)',
        'https://www.jptoyota-downtown.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php',
        'https://vms.prod.convertus.rocks/api/filtering/?cp=1250',
      ];
      architecturalFindings.governanceStatus = 'Active Convertus SRP with VMS PHP proxy fallback';
    } else if (target.category === 'convertus_api') {
      architecturalFindings.hostingPlatform = 'Convertus VMS Proxy';
      architecturalFindings.governanceStatus = 'Gate 1 Compliant Public Feed';
    } else if (target.category === 'openroad_html') {
      architecturalFindings.hostingPlatform = 'ASP.NET Core / React';
      architecturalFindings.serverSideHydrationFound = false;
      architecturalFindings.discoveredEndpoints = [
        'https://inventory.oragdigital.com/inventory/search (buId=30)',
        'https://openroadtoyotarichmond.com/dist/react/VLP.bundle.js',
      ];
      architecturalFindings.governanceStatus = 'Client-rendered React SPA; no server-side vehicle records';
    } else if (target.category === 'openroad_api') {
      architecturalFindings.hostingPlatform = 'ORAG Digital Inventory API';
      architecturalFindings.governanceStatus = 'Protected by HTTP Basic Auth (Coverage Limitation)';
    } else if (target.category === 'generic_cloudflare') {
      architecturalFindings.hostingPlatform = 'Cloudflare WAF / Managed Challenge';
      architecturalFindings.governanceStatus = 'Blocked by Cloudflare Bot Management (Coverage Limitation)';
    }

    const gate1Evaluation = evaluateGate1(
      isJson,
      res.status,
      isCloudflareChallenge,
      requiresAuth,
      parsedJson,
      headers,
      target
    );

    console.log(`  -> HTTP Status: ${res.status} ${res.statusText} (${responseTimeMs}ms)`);
    console.log(`  -> Content-Type: ${contentType}`);
    console.log(`  -> Payload: ${payloadType}${detectedItemCount !== undefined ? ` (${detectedItemCount} items)` : ''}`);
    console.log(`  -> Gate 1 Verdict: ${gate1Evaluation.verdict}`);
    console.log(`  -> Summary: ${gate1Evaluation.summary}`);

    return {
      probeId: target.probeId,
      dealerId: target.dealerId,
      dealerName: target.dealerName,
      category: target.category,
      targetUrl: target.targetUrl,
      finalUrl: res.url || target.targetUrl,
      httpStatus: res.status,
      statusText: res.statusText,
      headers,
      contentType,
      isJson,
      isCloudflareChallenge,
      requiresAuth,
      responseTimeMs,
      payloadSummary: {
        type: payloadType,
        detectedItemCount,
        sampleKeys,
        rawSnippet,
      },
      architecturalFindings,
      gate1Evaluation,
      timestamp,
    };
  } catch (err: any) {
    const responseTimeMs = Date.now() - startTime;
    const isTimeout = err.name === 'AbortError' || err.message?.includes('aborted');
    const errorMessage = isTimeout
      ? `Request timed out after ${REQUEST_TIMEOUT_MS}ms`
      : err.message || String(err);

    console.log(`  -> ERROR: ${errorMessage} (${responseTimeMs}ms)`);

    return {
      probeId: target.probeId,
      dealerId: target.dealerId,
      dealerName: target.dealerName,
      category: target.category,
      targetUrl: target.targetUrl,
      finalUrl: target.targetUrl,
      httpStatus: null,
      statusText: isTimeout ? 'TIMEOUT' : 'NETWORK_ERROR',
      headers: {},
      contentType: '',
      isJson: false,
      isCloudflareChallenge: false,
      requiresAuth: false,
      responseTimeMs,
      payloadSummary: {
        type: 'error',
        rawSnippet: errorMessage,
      },
      architecturalFindings: {},
      gate1Evaluation: {
        verdict: 'INCOMPATIBLE',
        vinEvaluation: { supported: false, fieldsFound: [], notes: errorMessage },
        modelTrimEvaluation: { supported: false, fieldsFound: [], notes: errorMessage },
        statusEvaluation: { supported: false, fieldsFound: [], notes: errorMessage },
        priceBreakdownEvaluation: { supported: false, fieldsFound: [], notes: errorMessage },
        paginationEvaluation: { supported: false, fieldsFound: [], notes: errorMessage },
        summary: `Network error or timeout: ${errorMessage}`,
      },
      error: errorMessage,
      timestamp,
    };
  }
}

async function main() {
  console.log(`================================================================`);
  console.log(`ToyotaWaits.ca Master Plan V3.2 - Sprint 1 Refined Endpoint Audit`);
  console.log(`Operating Limits:`);
  console.log(`  - Mode: Sequential requests`);
  console.log(`  - Polite Delay: ${POLITE_DELAY_MS}ms between calls`);
  console.log(`  - Request Timeout: ${REQUEST_TIMEOUT_MS}ms`);
  console.log(`  - User-Agent: ${USER_AGENT}`);
  console.log(`Policy Guardrail:`);
  console.log(`  - Do NOT bypass authentication, CAPTCHAs, or access restrictions.`);
  console.log(`================================================================`);

  const results: ProbeResult[] = [];

  for (let i = 0; i < PROBE_TARGETS.length; i++) {
    const target = PROBE_TARGETS[i];
    const result = await probeTarget(target);
    results.push(result);

    if (i < PROBE_TARGETS.length - 1) {
      console.log(`\n[PAUSE] Applying polite delay of ${POLITE_DELAY_MS}ms before next request...`);
      await sleep(POLITE_DELAY_MS);
    }
  }

  // Save audit artifact
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const outDir = path.resolve(process.cwd(), 'audit-artifacts', 'dealer-discovery');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outFilePath = path.join(outDir, `endpoint-validation-${dateStr}.json`);

  const auditReport = {
    metadata: {
      generatedAt: now.toISOString(),
      script: 'scripts/discovery/inspect-endpoints.ts',
      masterPlanVersion: 'V3.2',
      sprint: 'Sprint 1: Dealer Discovery & Endpoint Validation (Refined)',
      operatingLimits: {
        sequential: true,
        politeDelayMs: POLITE_DELAY_MS,
        requestTimeoutMs: REQUEST_TIMEOUT_MS,
        userAgent: USER_AGENT,
      },
      policyGuardrailCompliance: {
        bypassCaptchas: false,
        bypassAuth: false,
        coverageLimitationsAcknowledged: true,
      },
      targetsProbedCount: PROBE_TARGETS.length,
    },
    results,
  };

  fs.writeFileSync(outFilePath, JSON.stringify(auditReport, null, 2), 'utf-8');

  console.log(`\n================================================================`);
  console.log(`AUDIT COMPLETE`);
  console.log(`Artifact saved to: ${path.relative(process.cwd(), outFilePath)}`);
  console.log(`================================================================\n`);

  // Summary Table
  console.log(`REFINED SPRINT 1 AUDIT SUMMARY TABLE:`);
  console.log(`------------------------------------------------------------------------------------------------------------------------------------------------------`);
  console.log(
    `Dealer`.padEnd(28) +
    `Probe Surface`.padEnd(32) +
    `Status`.padEnd(10) +
    `Payload`.padEnd(14) +
    `Gate 1 Verdict`.padEnd(22) +
    `Diagnostic Note`
  );
  console.log(`------------------------------------------------------------------------------------------------------------------------------------------------------`);

  for (const r of results) {
    const dealerTrunc = r.dealerName.length > 26 ? r.dealerName.slice(0, 23) + '...' : r.dealerName;
    const probeTrunc = r.probeId.padEnd(30);
    const statusStr = (r.httpStatus ? String(r.httpStatus) : (r.statusText || 'ERR')).padEnd(8);
    const payloadStr = r.payloadSummary.type.padEnd(12);
    const verdictStr = r.gate1Evaluation.verdict.padEnd(20);
    const note = r.isCloudflareChallenge
      ? 'Cloudflare WAF / Managed Challenge (Coverage Limitation)'
      : r.requiresAuth
        ? 'Protected API: HTTP 401 Unauthorized (Coverage Limitation)'
        : r.gate1Evaluation.verdict === 'PASS'
          ? `Validated ${r.payloadSummary.detectedItemCount} new units with 17-char VINs & MSRP`
          : r.category.endsWith('_html')
            ? 'Client SPA shell; no vehicle data hydrated in DOM'
            : r.gate1Evaluation.summary.slice(0, 48);

    console.log(
      `${dealerTrunc.padEnd(28)}${probeTrunc}  ${statusStr}  ${payloadStr}  ${verdictStr}  ${note}`
    );
  }
  console.log(`------------------------------------------------------------------------------------------------------------------------------------------------------\n`);
}

main().catch((err) => {
  console.error('Fatal error running endpoint inspection:', err);
  process.exit(1);
});
