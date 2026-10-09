import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { parse } from 'csv-parse/sync';
import {
  CANADIAN_VEHICLE_CATALOG,
  getModelBySlug,
  getPowertrainBySlug,
  CatalogModel,
  CatalogPowertrain,
  CatalogTrim,
} from '../src/lib/data/vehicles';
import {
  CANADIAN_PROVINCES,
  vinRegex,
  emailRegex,
  phoneRegex,
  postalRegex,
} from '../src/lib/validations/schemas';
import { CanadianProvince } from '../src/lib/types/contracts';
import { createServerClient } from '../src/lib/supabase/server';

// ============================================================================
// DATA TYPES
// ============================================================================

export interface RawLegacyRow {
  model_id: string;
  powertrain_id: string;
  trim_name: string;
  province: string;
  dealer_city?: string;
  dealer_name?: string;
  deposit_date: string;
  delivery_date?: string;
  status: string;
  pricing_deal?: string;
  notes?: string;
  source_reference?: string;
}

export interface IngestedRecord {
  id: string;
  model_id: string;
  powertrain_id: string;
  trim_id: string;
  province: CanadianProvince;
  dealership_city?: string | null;
  dealership_name?: string | null;
  model_year: number;
  order_date: string;
  delivery_date?: string | null;
  status: 'pending' | 'delivered' | 'cancelled';
  pricing: 'at_msrp' | 'above_msrp' | 'below_msrp' | 'undisclosed';
  mandatory_addons_cad: number;
  trade_in_required: boolean;
  notes?: string | null;
  edit_key_hash: string;
  is_flagged: boolean;
  created_at: string;
}

export interface ValidationSuccess {
  isValid: true;
  record: IngestedRecord;
  fingerprint: string;
  isOutlier: boolean;
  outlierReason?: string;
}

export interface ValidationFailure {
  isValid: false;
  reason: string;
  rawRow: RawLegacyRow;
}

export type ValidationResult = ValidationSuccess | ValidationFailure;

export interface IngestSummary {
  totalProcessed: number;
  validInserted: number;
  duplicatesSkipped: number;
  validationSkipped: number;
  outliersQuarantined: number;
  errors: string[];
}

export interface IngestOptions {
  csvFilePath?: string;
  csvContent?: string;
  batchSize?: number;
  dryRun?: boolean;
  currentDate?: Date;
  onWarning?: (msg: string) => void;
}

// ============================================================================
// ZERO-PII SCRUBBER
// ============================================================================

export function scrubPII(rawNotes?: string | null): { sanitized: string | null; hasPII: boolean } {
  if (!rawNotes || !rawNotes.trim()) {
    return { sanitized: null, hasPII: false };
  }

  let text = rawNotes.trim();
  let hasPII = false;

  // 1. Scrub email addresses
  if (emailRegex.test(text)) {
    hasPII = true;
    text = text.replace(new RegExp(emailRegex, 'gi'), '[REDACTED_EMAIL]');
  }

  // 2. Scrub telephone numbers
  if (phoneRegex.test(text)) {
    hasPII = true;
    text = text.replace(new RegExp(phoneRegex, 'gi'), '[REDACTED_PHONE]');
  }

  // 3. Scrub Canadian postal codes
  if (postalRegex.test(text)) {
    hasPII = true;
    text = text.replace(new RegExp(postalRegex, 'gi'), '[REDACTED_POSTAL]');
  }

  // 4. Scrub Vehicle Identification Numbers (VIN)
  if (vinRegex.test(text)) {
    hasPII = true;
    text = text.replace(new RegExp(vinRegex, 'gi'), '[REDACTED_VIN]');
  }

  // Enforce max length of 280 characters
  if (text.length > 280) {
    text = text.slice(0, 277) + '...';
  }

  return { sanitized: text, hasPII };
}

// ============================================================================
// PRICING DEAL NORMALIZER
// ============================================================================

export function normalizePricingDeal(raw?: string | null): 'at_msrp' | 'above_msrp' | 'below_msrp' | 'undisclosed' {
  if (!raw) return 'undisclosed';
  const val = raw.toLowerCase().trim();
  if (val === 'msrp' || val === 'at_msrp') return 'at_msrp';
  if (val.includes('above') || val.includes('markup') || val.includes('over')) return 'above_msrp';
  if (val.includes('below') || val.includes('discount') || val.includes('under')) return 'below_msrp';
  return 'undisclosed';
}

// ============================================================================
// TRIM & VEHICLE RESOLVER
// ============================================================================

export function resolveVehicleIdentifiers(
  modelRaw: string,
  powertrainRaw: string,
  trimRaw: string,
  onWarning?: (msg: string) => void
): {
  model: CatalogModel;
  powertrain: CatalogPowertrain;
  trim: CatalogTrim;
} | null {
  const normModel = modelRaw.toLowerCase().trim().replace(/_/g, '-');
  const normPowertrain = powertrainRaw.toLowerCase().trim().replace(/_/g, '-');
  const normTrim = trimRaw.trim();

  // 1. Resolve Model
  let model = CANADIAN_VEHICLE_CATALOG.find(
    (m) => m.id === modelRaw || m.slug === normModel
  );

  if (!model) {
    // Attempt alias resolution
    if (normModel.includes('rav4')) model = getModelBySlug('rav4');
    else if (normModel.includes('sienna')) model = getModelBySlug('sienna');
    else if (normModel.includes('grand')) model = getModelBySlug('grand-highlander');
    else if (normModel.includes('cruiser')) model = getModelBySlug('land-cruiser');
    else if (normModel.includes('prius-prime') || normModel.includes('prius prime')) model = getModelBySlug('prius-prime') || getModelBySlug('prius');
    else if (normModel.includes('prius')) model = getModelBySlug('prius');
  }

  if (!model) {
    onWarning?.(`Unable to resolve vehicle model for "${modelRaw}"`);
    return null;
  }

  // 2. Resolve Powertrain
  let powertrain = model.powertrains.find(
    (p) => p.id === powertrainRaw || p.slug === normPowertrain
  );

  if (!powertrain) {
    // Attempt aliases
    if (normPowertrain.includes('prime') || normPowertrain.includes('plug')) {
      powertrain = model.powertrains.find((p) => p.slug === 'phev');
    } else if (normPowertrain.includes('max')) {
      powertrain = model.powertrains.find((p) => p.slug === 'hybrid-max');
    } else if (normPowertrain.includes('hyb') || normPowertrain.includes('hev')) {
      powertrain = model.powertrains.find((p) => p.slug === 'hev');
    } else if (normPowertrain.includes('gas') || normPowertrain.includes('turbo')) {
      powertrain = model.powertrains.find((p) => p.slug === 'gas');
    }
  }

  if (!powertrain) {
    onWarning?.(`Unable to resolve powertrain for model "${model.name}" with "${powertrainRaw}"`);
    return null;
  }

  // 3. Resolve Trim
  // Exact match by ID or slug
  let trim = powertrain.trims.find(
    (t) => t.id === trimRaw || t.slug.toLowerCase() === normTrim.toLowerCase().replace(/_/g, '-')
  );

  // Exact match by name
  if (!trim) {
    trim = powertrain.trims.find(
      (t) => t.name.toLowerCase() === normTrim.toLowerCase()
    );
  }

  // Token-based matching with score ranking
  if (!trim) {
    const cleanRaw = normTrim.toLowerCase().replace(/[^a-z0-9]/g, ' ');
    const rawTokens = cleanRaw.split(/\s+/).filter(Boolean);
    const rawTokenSet = new Set(rawTokens);

    let bestScore = 0;
    let bestTrim: CatalogTrim | null = null;

    for (const t of powertrain.trims) {
      const cleanTrimName = t.name.toLowerCase().replace(/[^a-z0-9]/g, ' ');
      const trimTokens = cleanTrimName.split(/\s+/).filter(Boolean);

      let score = 0;
      for (const token of trimTokens) {
        if (rawTokenSet.has(token)) {
          score += 2;
        }
      }

      // Specific package bonuses to disambiguate sub-packages
      if ((rawTokenSet.has('tech') || rawTokenSet.has('technology')) &&
          (t.slug.includes('technology') || t.slug.includes('tech'))) {
        score += 5;
      }
      if (rawTokenSet.has('woodland') && t.slug.includes('woodland')) score += 5;
      if (rawTokenSet.has('1958') && t.slug.includes('1958')) score += 5;
      if (rawTokenSet.has('premium') && t.slug.includes('premium')) score += 5;
      if (rawTokenSet.has('platinum') && t.slug.includes('platinum')) score += 5;

      if (score > bestScore) {
        bestScore = score;
        bestTrim = t;
      }
    }

    if (bestScore >= 2 && bestTrim) {
      trim = bestTrim;
    }
  }

  // Graceful fallback: Default to first trim of powertrain if ambiguous
  if (!trim) {
    const fallbackTrim = powertrain.trims[0];
    onWarning?.(
      `Trim "${trimRaw}" not directly matched for ${model.name} (${powertrain.name}). Falling back to "${fallbackTrim.name}"`
    );
    trim = fallbackTrim;
  }

  return { model, powertrain, trim };
}

// ============================================================================
// OUTLIER & WAIT-TIME EVALUATOR
// ============================================================================

export function evaluateOutlier(
  orderDate: string,
  deliveryDate: string
): { isOutlier: boolean; waitDays: number; reason?: string } {
  const start = new Date(orderDate).getTime();
  const end = new Date(deliveryDate).getTime();
  const waitDays = Math.round((end - start) / (1000 * 60 * 60 * 24));

  if (waitDays < 14) {
    return {
      isOutlier: true,
      waitDays,
      reason: `Wait duration (${waitDays}d) is < 14 days (extreme low outlier / lot sale)`,
    };
  }

  if (waitDays > 1825) {
    return {
      isOutlier: true,
      waitDays,
      reason: `Wait duration (${waitDays}d) exceeds 1825 days (5-year plausible upper bound)`,
    };
  }

  return { isOutlier: false, waitDays };
}

// ============================================================================
// DEDUPLICATION FINGERPRINTING
// ============================================================================

export function computeFingerprint(
  modelId: string,
  powertrainId: string,
  province: string,
  depositDate: string,
  deliveryDate?: string | null
): string {
  return `${modelId}::${powertrainId}::${province.toUpperCase()}::${depositDate}::${deliveryDate || 'NONE'}`;
}

// ============================================================================
// ROW VALIDATION & TRANSFORMATION
// ============================================================================

export function validateAndTransformRow(
  row: RawLegacyRow,
  options?: { currentDate?: Date; onWarning?: (msg: string) => void }
): ValidationResult {
  const now = options?.currentDate ?? new Date();

  // 1. Resolve vehicle hierarchy
  const vehicle = resolveVehicleIdentifiers(
    row.model_id,
    row.powertrain_id,
    row.trim_name,
    options?.onWarning
  );

  if (!vehicle) {
    return {
      isValid: false,
      reason: `Vehicle trim resolution failed for "${row.model_id}/${row.powertrain_id}/${row.trim_name}"`,
      rawRow: row,
    };
  }

  // 2. Validate Canadian Province
  const provinceUpper = row.province.toUpperCase().trim() as CanadianProvince;
  if (!CANADIAN_PROVINCES.includes(provinceUpper)) {
    return {
      isValid: false,
      reason: `Invalid Canadian province "${row.province}". Must be one of: ${CANADIAN_PROVINCES.join(', ')}`,
      rawRow: row,
    };
  }

  // 3. Validate Deposit/Order Date
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const depositDate = row.deposit_date?.trim();
  if (!depositDate || !dateRegex.test(depositDate)) {
    return {
      isValid: false,
      reason: `Invalid deposit_date "${row.deposit_date}". Format must be YYYY-MM-DD.`,
      rawRow: row,
    };
  }

  const depositTimestamp = new Date(depositDate).getTime();
  if (isNaN(depositTimestamp)) {
    return {
      isValid: false,
      reason: `deposit_date "${depositDate}" is not a valid date.`,
      rawRow: row,
    };
  }

  if (new Date(depositDate) > now) {
    return {
      isValid: false,
      reason: `deposit_date "${depositDate}" cannot be in the future.`,
      rawRow: row,
    };
  }

  // 4. Validate Status
  const rawStatus = (row.status || 'pending').toLowerCase().trim();
  let status: 'pending' | 'delivered' | 'cancelled' = 'pending';
  if (rawStatus === 'delivered') status = 'delivered';
  else if (rawStatus === 'cancelled') status = 'cancelled';
  else if (rawStatus === 'pending') status = 'pending';

  // 5. Validate Delivery Date & Outliers
  const deliveryDate = row.delivery_date?.trim() || null;
  let isOutlier = false;
  let outlierReason: string | undefined;

  if (status === 'delivered') {
    if (!deliveryDate || !dateRegex.test(deliveryDate)) {
      return {
        isValid: false,
        reason: `delivery_date is required and must be YYYY-MM-DD when status is "delivered".`,
        rawRow: row,
      };
    }

    const deliveryTimestamp = new Date(deliveryDate).getTime();
    if (isNaN(deliveryTimestamp)) {
      return {
        isValid: false,
        reason: `delivery_date "${deliveryDate}" is not a valid date.`,
        rawRow: row,
      };
    }

    if (new Date(deliveryDate) > now) {
      return {
        isValid: false,
        reason: `delivery_date "${deliveryDate}" cannot be in the future.`,
        rawRow: row,
      };
    }

    if (deliveryTimestamp < depositTimestamp) {
      return {
        isValid: false,
        reason: `delivery_date "${deliveryDate}" cannot precede deposit_date "${depositDate}".`,
        rawRow: row,
      };
    }

    // Check outlier bounds
    const outlierCheck = evaluateOutlier(depositDate, deliveryDate);
    if (outlierCheck.isOutlier) {
      isOutlier = true;
      outlierReason = outlierCheck.reason;
    }
  } else {
    // If pending or cancelled, delivery_date must be null
    if (deliveryDate) {
      return {
        isValid: false,
        reason: `delivery_date must be empty when status is "${status}".`,
        rawRow: row,
      };
    }
  }

  // 6. Zero-PII sanitization on notes
  const piiScrubResult = scrubPII(row.notes);

  // 7. Calculate model year (inferred from delivery/deposit date)
  const referenceYear = new Date(deliveryDate || depositDate).getFullYear();
  const modelYear = Math.max(2019, Math.min(now.getFullYear() + 1, referenceYear));

  // 8. Generate stable deterministic edit key hash
  const id = crypto.randomUUID();
  const editKeyHash = crypto
    .createHash('sha256')
    .update(`seed-import-${id}-${depositDate}`)
    .digest('hex');

  const fingerprint = computeFingerprint(
    vehicle.model.id,
    vehicle.powertrain.id,
    provinceUpper,
    depositDate,
    deliveryDate
  );

  const record: IngestedRecord = {
    id,
    model_id: vehicle.model.id,
    powertrain_id: vehicle.powertrain.id,
    trim_id: vehicle.trim.id,
    province: provinceUpper,
    dealership_city: row.dealer_city?.trim() || null,
    dealership_name: row.dealer_name?.trim() || null,
    model_year: modelYear,
    order_date: depositDate,
    delivery_date: deliveryDate,
    status,
    pricing: normalizePricingDeal(row.pricing_deal),
    mandatory_addons_cad: 0,
    trade_in_required: false,
    notes: piiScrubResult.sanitized,
    edit_key_hash: editKeyHash,
    is_flagged: isOutlier,
    created_at: new Date().toISOString(),
  };

  return {
    isValid: true,
    record,
    fingerprint,
    isOutlier,
    outlierReason,
  };
}

// ============================================================================
// CSV PARSING
// ============================================================================

export function parseLegacyCsv(csvContent: string): RawLegacyRow[] {
  return parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
    comment: '#',
  });
}

// ============================================================================
// CHUNKING UTILITY
// ============================================================================

export function chunkArray<T>(items: T[], chunkSize = 50): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }
  return chunks;
}

// ============================================================================
// MAIN INGESTION PIPELINE
// ============================================================================

export async function ingestLegacyData(options: IngestOptions = {}): Promise<IngestSummary> {
  const batchSize = options.batchSize ?? 50;
  const isDryRun = options.dryRun ?? false;
  const warnings: string[] = [];

  const handleWarning = (msg: string) => {
    warnings.push(msg);
    if (options.onWarning) {
      options.onWarning(msg);
    } else {
      console.warn(`[WARN] ${msg}`);
    }
  };

  // 1. Read CSV Content
  let content = options.csvContent;
  if (!content) {
    const defaultPath = path.resolve(process.cwd(), 'data/legacy-seed-data.csv');
    const targetPath = options.csvFilePath ? path.resolve(process.cwd(), options.csvFilePath) : defaultPath;

    if (!fs.existsSync(targetPath)) {
      throw new Error(`CSV seed file not found at path: ${targetPath}`);
    }
    content = fs.readFileSync(targetPath, 'utf-8');
  }

  // 2. Parse Raw CSV Rows
  const rawRows = parseLegacyCsv(content);
  const summary: IngestSummary = {
    totalProcessed: rawRows.length,
    validInserted: 0,
    duplicatesSkipped: 0,
    validationSkipped: 0,
    outliersQuarantined: 0,
    errors: [],
  };

  // 3. Populate existing fingerprints for deduplication
  const existingFingerprints = new Set<string>();

  // If Supabase is live, fetch existing fingerprints
  const isSupabaseConfigured =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder') &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('mock-');

  let supabase: any = null;
  if (isSupabaseConfigured) {
    try {
      supabase = createServerClient();
      const { data: existingRows, error: fetchErr } = await supabase
        .from('submissions')
        .select('model_id, powertrain_id, province, order_date, delivery_date');

      if (!fetchErr && existingRows) {
        for (const row of existingRows) {
          const fp = computeFingerprint(
            row.model_id,
            row.powertrain_id,
            row.province,
            row.order_date,
            row.delivery_date
          );
          existingFingerprints.add(fp);
        }
      }
    } catch (err: any) {
      handleWarning(`Supabase query failed during deduplication init: ${err.message}`);
    }
  }

  // 4. Validate & Deduplicate Rows
  const recordsToInsert: IngestedRecord[] = [];
  const seenInBatch = new Set<string>();

  for (let i = 0; i < rawRows.length; i++) {
    const row = rawRows[i];
    const validation = validateAndTransformRow(row, {
      currentDate: options.currentDate,
      onWarning: handleWarning,
    });

    if (!validation.isValid) {
      summary.validationSkipped++;
      summary.errors.push(`Row ${i + 1}: ${validation.reason}`);
      continue;
    }

    // Deduplication check
    if (existingFingerprints.has(validation.fingerprint) || seenInBatch.has(validation.fingerprint)) {
      summary.duplicatesSkipped++;
      continue;
    }

    seenInBatch.add(validation.fingerprint);
    existingFingerprints.add(validation.fingerprint);

    if (validation.isOutlier) {
      summary.outliersQuarantined++;
    }

    recordsToInsert.push(validation.record);
  }

  // 5. Batch Insert in Chunks of 50
  const chunks = chunkArray(recordsToInsert, batchSize);

  for (let c = 0; c < chunks.length; c++) {
    const chunk = chunks[c];

    if (!isDryRun && isSupabaseConfigured && supabase) {
      try {
        const { error: insertErr } = await supabase.from('submissions').insert(chunk);
        if (insertErr) {
          summary.errors.push(`Chunk ${c + 1} insert failed: ${insertErr.message}`);
          continue;
        }
      } catch (err: any) {
        summary.errors.push(`Chunk ${c + 1} insert exception: ${err.message}`);
        continue;
      }
    }

    summary.validInserted += chunk.length;
  }

  return summary;
}

// ============================================================================
// CLI ENTRY POINT
// ============================================================================

async function main() {
  console.log('='.repeat(80));
  console.log('🍁 ToyotaWaits.ca - Curated Legacy Data Ingestion Pipeline');
  console.log('='.repeat(80));

  const csvPath = process.argv[2] || 'data/legacy-seed-data.csv';
  console.log(`Target CSV:  ${csvPath}`);
  console.log(`Batch size:  50 records per chunk`);
  console.log('-'.repeat(80));

  try {
    const summary = await ingestLegacyData({
      csvFilePath: csvPath,
      batchSize: 50,
    });

    console.log('\n' + '='.repeat(80));
    console.log('📊 INGESTION SUMMARY REPORT');
    console.log('='.repeat(80));
    console.log(`Total rows processed:       ${summary.totalProcessed}`);
    console.log(`Valid records inserted:     ${summary.validInserted}`);
    console.log(`Rows skipped (duplicates):  ${summary.duplicatesSkipped}`);
    console.log(`Rows skipped (validation):  ${summary.validationSkipped}`);
    console.log(`Flagged outliers (flagged): ${summary.outliersQuarantined}`);
    console.log('='.repeat(80));

    if (summary.errors.length > 0) {
      console.log('\nValidation & Processing Issues:');
      summary.errors.slice(0, 10).forEach((err) => console.log(`  • ${err}`));
      if (summary.errors.length > 10) {
        console.log(`  ... and ${summary.errors.length - 10} more`);
      }
    }

    console.log('\n✅ Pipeline execution finished successfully!\n');
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Fatal ingestion error:', error.message);
    process.exit(1);
  }
}

// Run CLI if invoked directly
if (typeof require !== 'undefined' && require.main === module) {
  main();
} else if (process.argv[1]?.includes('ingest-legacy-data')) {
  main();
}
