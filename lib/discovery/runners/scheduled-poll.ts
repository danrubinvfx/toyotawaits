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
import { ingestDealerListings } from '../services/ingestion-service';
import {
  AdapterParseResult,
  Source,
  SourceHealthLog,
} from '../types';

export const USER_AGENT_AUDITOR =
  'Mozilla/5.0 (compatible; ToyotaWaitsLocalAuditor/1.0; +https://toyotawaits.ca/source-register)';
export const DEFAULT_TIMEOUT_MS = 6000;
export const DEFAULT_SWEEP_CADENCE_HOURS = 12;

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
  db?: any; // SupabaseClient or mock client
  fetcher?: (url: string, init?: RequestInit) => Promise<Response>;
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
    let lastError: any = null;
    let httpStatus: number | null = null;
    let responseBody: any = null;
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
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        responseBody = await res.json();
        isSuccess = true;
      } catch (err: any) {
        lastError = err;
        const isTransient =
          err.name === 'AbortError' ||
          err.message?.includes('timeout') ||
          err.message?.includes('network') ||
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
        } catch (ingestErr: any) {
          errorMessage = `Ingestion error: ${ingestErr.message}`;
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
      } catch (logErr) {
        // Telemetry persistence error caught gracefully
      }
    }
  }

  return summary;
}
