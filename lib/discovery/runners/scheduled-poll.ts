/**
 * lib/discovery/runners/scheduled-poll.ts
 *
 * Sprint 6: Private Trial Runner & Audit Telemetry (Gate 2 Readiness)
 * Master Plan V3.2 Section 2 Operating Limits & Appendix A:
 * - Conservative sweep interval (12-hour default cadence)
 * - Strict operating safeguards: 6000ms timeout, polite User-Agent, sequential calls
 * - Transient error handling with bounded exponential backoff
 * - Comprehensive source health telemetry logging to source_health_logs
 */

import { parseConvertusVmsPayload } from '../adapters/convertus';
import { fetchViaHttps } from '../dealers';
import { ingestDealerListings } from '../services/ingestion-service';
import {
  AdapterParseResult,
  SourceHealthLog,
} from '../types';

export const USER_AGENT_AUDITOR =
  'Mozilla/5.0 (compatible; ToyotaWaitsLocalAuditor/1.0; +https://toyotawaits.ca/source-register)';
export const DEFAULT_TIMEOUT_MS = 6000;
export const DEFAULT_SWEEP_CADENCE_HOURS = 12;
export const POLITE_DEALER_COOLDOWN_MS = Number(process.env.POLITE_DEALER_COOLDOWN_MS) || 4000;

export interface SweepSourceConfig {
  sourceId: string;
  sourceCode: string;
  dealerId: string;
  platform: 'convertus' | string;
  endpointUrl: string;
  isActive?: boolean;
}

export interface SweepOptions {
  sources?: SweepSourceConfig[];
  timeoutMs?: number;
  maxRetries?: number;
  initialBackoffMs?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db?: any; // SupabaseClient or mock client
  fetcher?: (url: string, init?: RequestInit) => Promise<Response>;
  cooldownMs?: number;
  now?: Date;
}

export interface SweepExecutionSummary {
  sweepTimestamp: string;
  sourcesChecked: number;
  successCount: number;
  failureCount: number;
  totalListingsIngested: number;
  telemetryLogs: SourceHealthLog[];
}

export const PILOT_SOURCES: SweepSourceConfig[] = [
  {
    sourceId: 'source-jp-duncan-convertus',
    sourceCode: 'jp-toyota-duncan-convertus',
    dealerId: 'dealer-jp-duncan',
    platform: 'convertus',
    endpointUrl:
      'https://www.jptoyota-duncan.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26cp%3D1254%26sc%3Dnew%26pc%3D100',
    isActive: true,
  },
  {
    sourceId: 'source-openroad-port-moody-convertus',
    sourceCode: 'openroad-toyota-port-moody-convertus',
    dealerId: 'dealer-openroad-toyota-port-moody',
    platform: 'convertus',
    endpointUrl:
      'https://www.openroadtoyotaportmoody.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    isActive: true,
  },
  {
    sourceId: 'source-jp-convertus',
    sourceCode: 'jp-toyota-downtown-convertus',
    dealerId: 'dealer-jp-downtown',
    platform: 'convertus',
    endpointUrl:
      'https://www.jptoyota-downtown.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Fcp%3D1250%26ln%3Den%26sc%3Dnew%26pc%3D100',
    isActive: true,
  },
  {
    sourceId: 'source-jp-surrey-convertus',
    sourceCode: 'jp-toyota-surrey-convertus',
    dealerId: 'dealer-jp-surrey',
    platform: 'convertus',
    endpointUrl:
      'https://www.jptoyota-surrey.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Fcp%3D1249%26ln%3Den%26sc%3Dnew%26pc%3D100',
    isActive: true,
  },
  {
    sourceId: 'source-westcoast-convertus',
    sourceCode: 'westcoast-toyota-convertus',
    dealerId: 'dealer-westcoast-toyota',
    platform: 'convertus',
    endpointUrl:
      'https://www.westcoasttoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Fcp%3D1218%26ln%3Den%26sc%3Dnew%26pc%3D100',
    isActive: true,
  },
  {
    sourceId: 'source-regency-convertus',
    sourceCode: 'regency-toyota-convertus',
    dealerId: 'dealer-regency-toyota',
    platform: 'convertus',
    endpointUrl: 'https://www.regencytoyota.com/wp-json/convertus/v1/vehicles',
    isActive: true,
  },
  {
    sourceId: 'source-openroad-richmond-convertus',
    sourceCode: 'openroad-toyota-richmond-convertus',
    dealerId: 'dealer-openroad-toyota-richmond',
    platform: 'convertus',
    endpointUrl: 'https://www.openroadtoyotarichmond.com/wp-json/convertus/v1/vehicles',
    isActive: true,
  },
  {
    sourceId: 'source-kelowna-toyota-convertus',
    sourceCode: 'kelowna-toyota-convertus',
    dealerId: 'dealer-kelowna-toyota',
    platform: 'convertus',
    endpointUrl:
      'https://www.kelownatoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26cp%3D1935%26sc%3Dnew%26pc%3D100',
    isActive: true,
  },
  {
    sourceId: 'source-vernon-toyota-convertus',
    sourceCode: 'vernon-toyota-convertus',
    dealerId: 'dealer-vernon-toyota',
    platform: 'convertus',
    endpointUrl:
      'https://www.vernontoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    isActive: true,
  },
  {
    sourceId: 'source-westminster-toyota-convertus',
    sourceCode: 'westminster-toyota-convertus',
    dealerId: 'dealer-westminster-toyota',
    platform: 'convertus',
    endpointUrl:
      'https://www.westminstertoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    isActive: true,
  },
  {
    sourceId: 'source-openroad-peace-arch-convertus',
    sourceCode: 'openroad-toyota-peace-arch-convertus',
    dealerId: 'dealer-openroad-toyota-peace-arch',
    platform: 'convertus',
    endpointUrl:
      'https://openroadtoyotapeacearch.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    isActive: true,
  },
  {
    sourceId: 'source-langley-toyota-convertus',
    sourceCode: 'langley-toyota-convertus',
    dealerId: 'dealer-langley-toyota',
    platform: 'convertus',
    endpointUrl:
      'https://www.langleytoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    isActive: true,
  },
  {
    sourceId: 'source-nanaimo-toyota-convertus',
    sourceCode: 'nanaimo-toyota-convertus',
    dealerId: 'dealer-nanaimo-toyota',
    platform: 'convertus',
    endpointUrl:
      'https://www.nanaimotoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    isActive: true,
  },
  {
    sourceId: 'source-ken-shaw-toyota-convertus',
    sourceCode: 'ken-shaw-toyota-convertus',
    dealerId: 'dealer-ken-shaw-toyota',
    platform: 'convertus',
    endpointUrl:
      'https://www.kenshawtoyota.ca/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    isActive: true,
  },
  {
    sourceId: 'source-attrell-toyota-convertus',
    sourceCode: 'attrell-toyota-convertus',
    dealerId: 'dealer-attrell-toyota',
    platform: 'convertus',
    endpointUrl:
      'https://www.attrelltoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    isActive: true,
  },
  {
    sourceId: 'source-georgetown-toyota-convertus',
    sourceCode: 'georgetown-toyota-convertus',
    dealerId: 'dealer-georgetown-toyota',
    platform: 'convertus',
    endpointUrl:
      'https://www.georgetowntoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    isActive: true,
  },
  {
    sourceId: 'source-erin-park-toyota-convertus',
    sourceCode: 'erin-park-toyota-convertus',
    dealerId: 'dealer-erin-park-toyota',
    platform: 'convertus',
    endpointUrl:
      'https://www.erinparktoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    isActive: true,
  },
  {
    sourceId: 'source-mississauga-toyota-convertus',
    sourceCode: 'mississauga-toyota-convertus',
    dealerId: 'dealer-mississauga-toyota',
    platform: 'convertus',
    endpointUrl:
      'https://www.mississaugatoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26cp%3D4092%26ln%3Den%26sc%3Dnew%26pc%3D100',
    isActive: true,
  },
  {
    sourceId: 'source-simcoe-toyota-convertus',
    sourceCode: 'simcoe-toyota-convertus',
    dealerId: 'dealer-simcoe-toyota',
    platform: 'convertus',
    endpointUrl:
      'https://www.simcoetoyota.ca/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26cp%3D1559%26ln%3Den%26sc%3Dnew%26pc%3D100',
    isActive: true,
  },
  {
    sourceId: 'source-downtown-toyota-convertus',
    sourceCode: 'downtown-toyota-convertus',
    dealerId: 'dealer-downtown-toyota',
    platform: 'convertus',
    endpointUrl:
      'https://www.downtowntoyota.ca/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    isActive: true,
  },
  {
    sourceId: 'source-don-valley-north-toyota-convertus',
    sourceCode: 'don-valley-north-toyota-convertus',
    dealerId: 'dealer-don-valley-north-toyota',
    platform: 'convertus',
    endpointUrl:
      'https://www.donvalleynorthtoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    isActive: true,
  },
  {
    sourceId: 'source-thornhill-toyota-convertus',
    sourceCode: 'thornhill-toyota-convertus',
    dealerId: 'dealer-thornhill-toyota',
    platform: 'convertus',
    endpointUrl:
      'https://www.thornhilltoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    isActive: true,
  },
  {
    sourceId: 'source-richmond-hill-toyota-convertus',
    sourceCode: 'richmond-hill-toyota-convertus',
    dealerId: 'dealer-richmond-hill-toyota',
    platform: 'convertus',
    endpointUrl:
      'https://www.richmondhilltoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    isActive: true,
  },
  {
    sourceId: 'source-oakville-toyota-convertus',
    sourceCode: 'oakville-toyota-convertus',
    dealerId: 'dealer-oakville-toyota',
    platform: 'convertus',
    endpointUrl:
      'https://www.oakvilletoyota.ca/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    isActive: true,
  },
  {
    sourceId: 'source-upper-james-toyota-convertus',
    sourceCode: 'upper-james-toyota-convertus',
    dealerId: 'dealer-upper-james-toyota',
    platform: 'convertus',
    endpointUrl:
      'https://www.upperjamestoyota.ca/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    isActive: true,
  },
  {
    sourceId: 'source-pickering-toyota-convertus',
    sourceCode: 'pickering-toyota-convertus',
    dealerId: 'dealer-pickering-toyota',
    platform: 'convertus',
    endpointUrl:
      'https://www.pickeringtoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    isActive: true,
  },
  {
    sourceId: 'source-whitby-toyota-convertus',
    sourceCode: 'whitby-toyota-convertus',
    dealerId: 'dealer-whitby-toyota',
    platform: 'convertus',
    endpointUrl:
      'https://www.whitbytoyota.com/wp-content/plugins/convertus-vms/include/php/ajax-vehicles.php?action=vms_data&endpoint=https%3A%2F%2Fvms.prod.convertus.rocks%2Fapi%2Ffiltering%2F%3Faction%3Dvms_data%26sc%3Dnew%26pc%3D100',
    isActive: true,
  },
];

/**
 * Executes a single polite scheduled sweep across active pilot sources.
 */
export async function runScheduledSweep(
  options: SweepOptions = {}
): Promise<SweepExecutionSummary> {
  const {
    sources = PILOT_SOURCES,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    maxRetries = 2,
    initialBackoffMs = 500,
    db,
    fetcher = fetch,
    now = new Date(),
  } = options;

  const sweepTimestamp = now.toISOString();
  const summary: SweepExecutionSummary = {
    sweepTimestamp,
    sourcesChecked: 0,
    successCount: 0,
    failureCount: 0,
    totalListingsIngested: 0,
    telemetryLogs: [],
  };

  for (const source of sources) {
    if (source.isActive === false) continue;
    summary.sourcesChecked++;

    const startTime = Date.now();
    let attempt = 0;
    let lastError: Error | null = null;
    let httpStatus: number | null = null;
    let responseBody: unknown = null;
    let isSuccess = false;

    // Retry loop with bounded backoff
    while (attempt <= maxRetries && !isSuccess) {
      attempt++;
      try {
        const controller = new AbortController();
        const timeoutHandle = setTimeout(() => controller.abort(), timeoutMs);

        const res = await fetcher(source.endpointUrl, {
          method: 'GET',
          headers: {
            'User-Agent': USER_AGENT_AUDITOR,
            Accept: 'application/json, text/plain, */*',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutHandle);
        httpStatus = res.status;

        if (res.status === 429) {
          throw new Error('HTTP 429: Rate limited by endpoint');
        }

        if (!res.ok) {
          if (res.status === 403) {
            try {
              const fallback = await fetchViaHttps(source.endpointUrl, timeoutMs);
              responseBody = fallback.body;
              httpStatus = fallback.status;
              isSuccess = true;
              break;
            } catch {
              // fallback failed
            }
          }
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        responseBody = await res.json();
        isSuccess = true;
      } catch (err: unknown) {
        const normalizedErr = err instanceof Error ? err : new Error(String(err));
        lastError = normalizedErr;
        const isTransient =
          normalizedErr.name === 'AbortError' ||
          normalizedErr.message?.includes('timeout') ||
          normalizedErr.message?.includes('network') ||
          (httpStatus != null && httpStatus >= 500);

        if (attempt <= maxRetries && isTransient) {
          const delay = initialBackoffMs * Math.pow(2, attempt - 1);
          await new Promise((r) => setTimeout(r, delay));
        } else {
          break;
        }
      }
    }

    const latencyMs = Date.now() - startTime;

    // Evaluate health log status
    let healthStatus: SourceHealthLog['status'] = 'success';
    let errorMessage: string | null = null;
    let itemsObserved = 0;
    let quarantinedItems = 0;

    if (!isSuccess) {
      summary.failureCount++;
      errorMessage = lastError?.message || 'Unknown network error';
      if (lastError?.name === 'AbortError' || lastError?.message?.includes('timeout')) {
        healthStatus = 'timeout';
      } else if (httpStatus === 429 || lastError?.message?.includes('429')) {
        healthStatus = 'rate_limited';
      } else {
        healthStatus = 'failure';
      }
    } else {
      summary.successCount++;

      // Parse payload with adapter
      let parseResult: AdapterParseResult = {
        success: false,
        count: 0,
        totalInPayload: 0,
        records: [],
        quarantined: [],
      };

      if (source.platform === 'convertus') {
        parseResult = parseConvertusVmsPayload(responseBody);
      } else {
        // Generic fallback
        parseResult = {
          success: true,
          count: Array.isArray(responseBody) ? responseBody.length : 0,
          totalInPayload: Array.isArray(responseBody) ? responseBody.length : 0,
          records: [],
          quarantined: [],
        };
      }

      itemsObserved = parseResult.count;
      quarantinedItems = parseResult.quarantined.length;

      if (quarantinedItems > 0 && itemsObserved > 0) {
        healthStatus = 'degraded';
      } else if (!parseResult.success) {
        healthStatus = 'failure';
        errorMessage = parseResult.error || 'Adapter parsing failed';
      }

      // Ingest into discovery pipeline if database client is provided
      if (db && parseResult.records.length > 0) {
        try {
          const ingestResult = await ingestDealerListings({
            dealerId: source.dealerId,
            sourceId: source.sourceId,
            parsedListings: parseResult.records,
            sweepTimestamp,
            db,
          });
          summary.totalListingsIngested +=
            ingestResult.totalProcessed ?? parseResult.records.length;
        } catch (ingestErr: unknown) {
          const msg = ingestErr instanceof Error ? ingestErr.message : String(ingestErr);
          errorMessage = `Ingestion error: ${msg}`;
          healthStatus = 'degraded';
        }
      } else {
        summary.totalListingsIngested += parseResult.records.length;
      }
    }

    const healthLog: SourceHealthLog = {
      id: crypto.randomUUID(),
      sourceId: source.sourceId,
      dealerId: source.dealerId,
      checkTimestamp: sweepTimestamp,
      status: healthStatus,
      httpStatus,
      latencyMs,
      itemsObserved,
      quarantinedItems,
      errorMessage,
      createdAt: sweepTimestamp,
    };

    summary.telemetryLogs.push(healthLog);
    const cooldown = options.cooldownMs ?? (process.env.NODE_ENV === 'test' || process.env.VITEST ? 0 : POLITE_DEALER_COOLDOWN_MS);
    if (sources.indexOf(source) < sources.length - 1 && cooldown > 0) {
      await new Promise((r) => setTimeout(r, cooldown));
    }

    // Persist to source_health_logs table
    if (db) {
      try {
        await db.from('source_health_logs').insert({
          id: healthLog.id,
          source_id: healthLog.sourceId,
          dealer_id: healthLog.dealerId,
          check_timestamp: healthLog.checkTimestamp,
          status: healthLog.status,
          http_status: healthLog.httpStatus,
          latency_ms: healthLog.latencyMs,
          items_observed: healthLog.itemsObserved,
          quarantined_items: healthLog.quarantinedItems,
          error_message: healthLog.errorMessage,
          created_at: healthLog.createdAt,
        });
      } catch {
        // Telemetry persistence error caught gracefully
      }
    }
  }

  return summary;
}
