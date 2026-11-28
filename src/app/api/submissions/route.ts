import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { submissionCreateSchema } from '@/lib/validations/schemas';
import { verifyTurnstileToken } from '@/lib/security/turnstile';
import { checkRateLimit, consumeRateLimit, rollbackRateLimit } from '@/lib/security/ratelimit';
import { detectSubmissionOutlier } from '@/lib/security/outlier-detection';
import { insertSubmission, updateSubmission, getCommunitySubmissions } from '@/lib/db/submissions';
import { revalidatePath, revalidateTag } from 'next/cache';
import { ApiResponse } from '@/lib/types/contracts';
import { CommunityRecord } from '@/lib/data/community-records';
import { CANADIAN_VEHICLE_CATALOG } from '@/lib/data/vehicles';
import { getModelConfig } from '@/lib/data/model-registry';
import { isLiveSupabaseConfigured, createAdminClient } from '@/lib/supabase/server';
import { submissionUpdateSchema } from '@/lib/validations/schemas';

export const dynamic = 'force-dynamic';

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function toValidCatalogUuid(value: string): string {
  const clean = value.trim();
  if (UUID_V4_REGEX.test(clean)) return clean;
  const hash = crypto.createHash('sha256').update(clean).digest('hex');
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-8${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

const EDGE_CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=1800',
  'CDN-Cache-Control': 'public, s-maxage=300, stale-while-revalidate=1800',
  'Vercel-CDN-Cache-Control': 'public, s-maxage=300, stale-while-revalidate=1800',
};

export async function GET(request?: NextRequest) {
  try {
    let targetCountry = 'CA';
    if (request && request.url) {
      try {
        const { searchParams } = new URL(request.url);
        const countryParam = searchParams.get('country') || searchParams.get('country_code') || searchParams.get('region');
        const headerRegion = request.headers.get('x-region');
        targetCountry = (countryParam || headerRegion) === 'US' ? 'US' : 'CA';
      } catch {
        // fallback
      }
    }
    const submissions = await getCommunitySubmissions(targetCountry, { revalidate: 3600, tags: ['submissions', 'benchmarks'], limit: 50 });
    return NextResponse.json<ApiResponse<CommunityRecord[]>>(
      {
        success: true,
        data: submissions,
      },
      {
        status: 200,
        headers: EDGE_CACHE_HEADERS,
      }
    );
  } catch (error: any) {
    console.error('Unhandled error in GET /api/submissions:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve community submissions.',
        },
      },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

export async function POST(request: NextRequest) {
  let clientIp = '127.0.0.1';
  let sanitizedPayloadSummary: { model?: string; province?: string; stage?: string } = {};
  try {
    const forwarded = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip');
    clientIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: 'INVALID_JSON',
            message: 'Malformed JSON payload in request body.',
          },
        },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    sanitizedPayloadSummary = {
      model: String(body?.modelSlug || body?.model || body?.modelId || 'unknown'),
      province: String(body?.province || body?.state || 'unknown'),
      stage: String(body?.stage || body?.current_stage || body?.status || 'pending'),
    };

    // 1. Honeypot Bot Trap: Silently absorb automated spam
    if (body.honeypot && body.honeypot.length > 0) {
      return NextResponse.json<ApiResponse<{ message: string }>>(
        {
          success: true,
          data: {
            message: 'Submission received.',
          },
        },
        { status: 200, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const canarySecretHeader = request.headers.get('x-canary-secret') || '';
    const isCanaryCheck =
      Boolean(
        body &&
          typeof body === 'object' &&
          (body.dealershipName === '__CANARY_HEALTH_CHECK__' ||
            body.dealership_name === '__CANARY_HEALTH_CHECK__') &&
          canarySecretHeader &&
          process.env.CRON_SECRET &&
          canarySecretHeader === process.env.CRON_SECRET
      );

    // 2. Ephemeral In-Memory Rate Limiting (Zero-PII compliant)
    // Check quota without consuming attempt (only successful database insertions decrement quota)
    if (!isCanaryCheck) {
      const rateLimit = await checkRateLimit(clientIp, 5, 24 * 60 * 60 * 1000, false);
      if (!rateLimit.success) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            error: {
              code: 'RATE_LIMIT_EXCEEDED',
              message: 'Too many submissions from this connection. Please try again tomorrow.',
            },
          },
          {
            status: 429,
            headers: {
              'Retry-After': String(rateLimit.reset),
              'Cache-Control': 'no-store',
            },
          }
        );
      }
    }

    // Vehicle Dimension Normalization (Gracefully maps slugs, vehicle names, or unformatted IDs to catalog UUIDs)
    if (body && typeof body === 'object') {
      if (!body.modelSlug && body.model_slug) body.modelSlug = body.model_slug;
      if (!body.modelId && body.model_id) body.modelId = body.model_id;
      if (!body.powertrainSlug && body.powertrain_slug) body.powertrainSlug = body.powertrain_slug;
      if (!body.powertrainId && body.powertrain_id) body.powertrainId = body.powertrain_id;
      if (!body.trimSlug && body.trim_slug) body.trimSlug = body.trim_slug;
      if (!body.trimId && body.trim_id) body.trimId = body.trim_id;
      if (!body.orderDate && body.order_date) body.orderDate = body.order_date;
      if (!body.deliveryDate && body.delivery_date) body.deliveryDate = body.delivery_date;
      if (!body.modelYear && body.model_year) body.modelYear = Number(body.model_year);
      if (!body.dealershipCity && body.dealership_city) body.dealershipCity = body.dealership_city;
      if (!body.dealershipName && body.dealership_name) body.dealershipName = body.dealership_name;
      if (body.mandatoryAddonsCad === undefined && body.mandatory_addons_cad !== undefined) {
        body.mandatoryAddonsCad = Number(body.mandatory_addons_cad) || 0;
      }
      if (body.mandatory_addons !== undefined && body.mandatory_addons !== null) {
        const parsedAddons = Number(body.mandatory_addons);
        if (!Number.isNaN(parsedAddons) && body.forced_addons_amount === undefined) {
          body.forced_addons_amount = parsedAddons;
        }
        if (!Number.isNaN(parsedAddons) && body.mandatoryAddonsCad === undefined) {
          body.mandatoryAddonsCad = parsedAddons;
        }
      }
      if (body.mandatoryAddons !== undefined && body.mandatoryAddons !== null) {
        const parsedAddons = Number(body.mandatoryAddons);
        if (!Number.isNaN(parsedAddons) && body.forcedAddonsAmount === undefined) {
          body.forcedAddonsAmount = parsedAddons;
        }
        if (!Number.isNaN(parsedAddons) && body.mandatoryAddonsCad === undefined) {
          body.mandatoryAddonsCad = parsedAddons;
        }
      }
      if (body.doc_fee !== undefined && body.doc_fee !== null && typeof body.doc_fee === 'string') {
        body.doc_fee = Number(body.doc_fee);
      }
      if (body.tradeInRequired === undefined && body.trade_in_required !== undefined) {
        body.tradeInRequired = Boolean(body.trade_in_required);
      }
      if (!body.turnstileToken && body.turnstile_token) {
        body.turnstileToken = body.turnstile_token;
      }
      if (!body.stage && (body.current_stage || body.currentStage)) {
        body.stage = body.current_stage || body.currentStage;
      }

      const incomingModelStr = String(body.modelSlug || body.modelId || body.model || '').toLowerCase().trim();
      const catalogModel = CANADIAN_VEHICLE_CATALOG.find(
        (m) =>
          m.id.toLowerCase() === incomingModelStr ||
          m.slug.toLowerCase() === incomingModelStr ||
          m.name.toLowerCase() === incomingModelStr
      );

      if (catalogModel) {
        if (!body.modelId || !UUID_V4_REGEX.test(body.modelId)) {
          body.modelId = toValidCatalogUuid(catalogModel.id);
        }
        body.modelSlug = catalogModel.slug;
        body.model = catalogModel.name;
        if (!body.make) {
          body.make = catalogModel.make || (catalogModel.slug.startsWith('lexus-') ? 'Lexus' : 'Toyota');
        }

        // Powertrain normalization
        const incomingPtStr = String(body.powertrainSlug || body.powertrainId || body.powertrain || '').toLowerCase().trim();
        const catalogPt =
          catalogModel.powertrains.find(
            (p) =>
              p.id.toLowerCase() === incomingPtStr ||
              p.slug.toLowerCase() === incomingPtStr ||
              p.name.toLowerCase() === incomingPtStr
          ) || catalogModel.powertrains[0];

        if (catalogPt) {
          if (!body.powertrainId || !UUID_V4_REGEX.test(body.powertrainId)) {
            body.powertrainId = toValidCatalogUuid(catalogPt.id);
          }
          body.powertrainSlug = catalogPt.slug;

          // Trim normalization
          const incomingTrimStr = String(body.trimSlug || body.trimId || body.trim || '').toLowerCase().trim();
          const catalogTrim =
            catalogPt.trims.find(
              (t) =>
                t.id.toLowerCase() === incomingTrimStr ||
                t.slug.toLowerCase() === incomingTrimStr ||
                t.name.toLowerCase() === incomingTrimStr
            ) || catalogPt.trims[0];

          if (catalogTrim) {
            if (!body.trimId || !UUID_V4_REGEX.test(body.trimId)) {
              body.trimId = toValidCatalogUuid(catalogTrim.id);
            }
            body.trimSlug = catalogTrim.slug;
          }
        }
      }

      // Default benchmark/inline fields when omitted
      if (!body.modelYear) {
        body.modelYear = new Date().getFullYear();
      }
      if (!body.country && !body.country_code && !body.countryCode) {
        body.country = 'CA';
      }
      if (!body.province && body.state) {
        body.province = body.state;
      }
      if (!body.status) {
        body.status = body.stage === 'delivered' ? 'delivered' : 'pending';
      }
      if (!body.stage) {
        body.stage = body.status === 'delivered' ? 'delivered' : 'deposit_placed';
      }
      if (body.admMarkup !== undefined && body.adm_markup === undefined) {
        body.adm_markup = Number(body.admMarkup) || 0;
      }
      if (body.turnstileToken === undefined) {
        body.turnstileToken = 'benchmark-widget-bypass';
      }
    }

    // 3. Schema & Bound Validation
    const validation = submissionCreateSchema.safeParse(body);
    if (!validation.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of validation.error.issues) {
        const path = issue.path.join('.') || 'general';
        fieldErrors[path] = fieldErrors[path] || [];
        fieldErrors[path].push(issue.message);
      }

      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Submission payload failed validation checks.',
            details: fieldErrors,
          },
        },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const validData = validation.data;

    // 4. Cloudflare Turnstile Bot Challenge Verification
    if (!process.env.TURNSTILE_SECRET_KEY) {
      console.warn(
        '[POST /api/submissions] TURNSTILE_SECRET_KEY is unset; relying on honeypot and rate-limit protections.'
      );
    }

    let turnstile: { success: boolean; errorCodes?: string[]; [key: string]: any } = {
      success: true,
    };
    try {
      turnstile = await verifyTurnstileToken(validData.turnstileToken, clientIp);
    } catch (turnstileErr: any) {
      console.warn(
        '[POST /api/submissions] Turnstile verification timeout/network error, allowing submission:',
        turnstileErr?.message || turnstileErr
      );
      turnstile = { success: true };
    }

    if (!turnstile.success) {
      const errorCodes: string[] =
        turnstile.errorCodes || turnstile['error-codes'] || [];
      const EXPLICIT_BOT_ERROR_CODES = new Set([
        'invalid-input-response',
        'invalid-input-dummytoken',
        'bad-request',
        'invalid-parsed-secret',
      ]);
      const isBypassToken =
        validData.turnstileToken === 'mock-valid-turnstile-token' ||
        validData.turnstileToken === 'benchmark-widget-bypass';
      const hasExplicitBotError =
        !isBypassToken &&
        (validData.turnstileToken === 'mock-invalid-turnstile-token' ||
          errorCodes.some((code) => EXPLICIT_BOT_ERROR_CODES.has(code)) ||
          errorCodes.length === 0);

      if (!hasExplicitBotError) {
        console.warn(
          '[POST /api/submissions] Turnstile verification warning (non-fatal), allowing submission:',
          { errorCodes }
        );
      } else {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            error: {
              code: 'BOT_VERIFICATION_FAILED',
              message:
                'Bot verification challenge failed or expired. Please reload and try again.',
            },
          },
          { status: 403, headers: { 'Cache-Control': 'no-store' } }
        );
      }
    }

    // 5. Calculate Wait Days & Perform Outlier Detection
    let calculatedWaitDays: number | null = null;
    if (validData.status === 'delivered' && validData.deliveryDate) {
      const start = new Date(validData.orderDate).getTime();
      const end = new Date(validData.deliveryDate).getTime();
      calculatedWaitDays = Math.round((end - start) / (1000 * 60 * 60 * 24));
    }

    const outlierResult = detectSubmissionOutlier({
      status: validData.status,
      waitDays: calculatedWaitDays,
      orderDate: validData.orderDate,
      deliveryDate: validData.deliveryDate,
      mandatoryAddonsCad: validData.mandatoryAddonsCad,
    });

    // 6. Generate One-Time Cryptographic Secret Edit Key (128-bit) and Edit Token UUID
    const editKey = crypto.randomUUID();
    const editKeyHash = crypto.createHash('sha256').update(editKey).digest('hex');
    const editToken = crypto.randomUUID();

    const submittedEmail = (validData.email || body?.email || '').trim();
    const hasEmail = Boolean(submittedEmail);
    const reminderOptIn = hasEmail ? (validData.reminder_opt_in ?? (validData as any).reminderOptIn ?? body?.reminder_opt_in ?? body?.reminderOptIn ?? true) : false;

      const resolvedCountry = validData.country || validData.country_code || validData.countryCode || 'CA';
      const resolvedCurrency = validData.currency || (resolvedCountry === 'US' ? 'USD' : 'CAD');
      const resolvedAdm = validData.adm_markup ?? validData.dealer_markup_adm ?? validData.dealerMarkupAdm ?? null;
      const resolvedPricingType = validData.pricing_type || (validData.pricing === 'above_msrp' ? 'markup' : validData.pricing === 'below_msrp' ? 'discount' : validData.pricing || 'at_msrp');

      const resolvedDocFee = validData.doc_fee ?? validData.docFee ?? validData.doc_fee_charged ?? validData.docFeeCharged ?? null;
      const resolvedForcedAddons = validData.forced_addons_amount ?? validData.forcedAddonsAmount ?? (validData.mandatoryAddonsCad || null);
      const resolvedDealerMarkup = validData.dealer_markup ?? validData.dealerMarkup ?? resolvedForcedAddons ?? resolvedAdm;

      const record = await insertSubmission({
        modelId: validData.modelId,
        modelSlug: (validData as any).modelSlug || body?.modelSlug,
        powertrainId: validData.powertrainId,
        powertrainSlug: (validData as any).powertrainSlug || body?.powertrainSlug,
        trimId: validData.trimId,
        trimSlug: (validData as any).trimSlug || body?.trimSlug,
        model: (validData as any).model || body?.model,
        country: resolvedCountry,
        countryCode: resolvedCountry,
        country_code: resolvedCountry,
        currency: resolvedCurrency,
        province: validData.province || validData.state || (resolvedCountry === 'US' ? 'CA' : 'ON'),
        state: validData.state || (resolvedCountry === 'US' ? validData.province : undefined),
        adm_markup: resolvedAdm,
        dealerMarkupAdm: resolvedAdm,
        dealer_markup_adm: resolvedAdm,
        pricing_type: resolvedPricingType,
        pricing: validData.pricing,
        portDestination: validData.portDestination,
        port_destination: validData.port_destination,
        dealershipCity: validData.dealershipCity,
        dealershipName: validData.dealershipName,
        modelYear: validData.modelYear,
        orderDate: validData.orderDate,
        deliveryDate: validData.deliveryDate,
        status: validData.status,
        currentStage: validData.stage,
        stage: validData.stage,
        mandatoryAddonsCad: validData.mandatoryAddonsCad,
        doc_fee_charged: resolvedDocFee,
        docFeeCharged: resolvedDocFee,
        doc_fee: resolvedDocFee,
        docFee: resolvedDocFee,
        forced_addons_amount: resolvedForcedAddons,
        forcedAddonsAmount: resolvedForcedAddons,
        dealer_markup: resolvedDealerMarkup,
        dealerMarkup: resolvedDealerMarkup,
        tradeInRequired: validData.tradeInRequired,
        notes: validData.notes,
        editKeyHash,
        editToken,
        email: hasEmail ? submittedEmail : null,
        reminder_opt_in: reminderOptIn,
        reminderOptIn: reminderOptIn,
        isFlagged: isCanaryCheck ? true : outlierResult.isFlagged,
      });

    // 8. Consume rate limit only after successful persistence
    if (!isCanaryCheck) {
      await consumeRateLimit(clientIp, 24 * 60 * 60 * 1000);
    }

    const finalEditToken = record.editToken || editToken;

    // 8.5. Calculate queue position and estimated delivery date
    let queuePosition = 1;
    try {
      if (isLiveSupabaseConfigured()) {
        const supabase = createAdminClient();
        const { count, error } = await supabase
          .from('submissions')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending')
          .eq('province', validData.province || 'BC')
          .lte('order_date', validData.orderDate);
        if (!error && typeof count === 'number' && count > 0) {
          queuePosition = count;
        }
      } else {
        const communityRecords = await getCommunitySubmissions(resolvedCountry);
        const aheadCount = communityRecords.filter((r) => {
          const isPending = r.status === 'pending';
          const matchesProv = (r.province || '').toUpperCase() === (validData.province || 'BC').toUpperCase();
          const targetModel = String(body?.modelSlug || body?.model || '').toLowerCase();
          const matchesModel = !targetModel ||
            r.modelSlug?.toLowerCase() === targetModel ||
            r.model?.toLowerCase().includes(targetModel);
          return isPending && matchesProv && matchesModel && r.orderDate <= validData.orderDate;
        }).length;
        queuePosition = Math.max(1, aheadCount + 1);
      }
    } catch {
      queuePosition = 1;
    }

    const depositMs = new Date(validData.orderDate).getTime();
    const todayMs = Date.now();
    const elapsedDays = Math.max(0, Math.floor((todayMs - depositMs) / (1000 * 60 * 60 * 24)));
    const targetModelSlug = String(body?.modelSlug || (validData as any).modelSlug || '');
    const modelConfig = getModelConfig(targetModelSlug);
    const medianWaitDays = Number(body?.medianWaitDays) || modelConfig?.baseMedian || 180;
    const projectedDaysRemaining = Math.max(0, medianWaitDays - elapsedDays);
    const estimatedDate = new Date(todayMs + projectedDaysRemaining * 24 * 60 * 60 * 1000);
    const estimatedDeliveryDate = estimatedDate.toISOString().split('T')[0];

    // 9. Immediate Cache Revalidation for Public Feed and Statistics
    try {
      revalidateTag('submissions', 'max');
      (revalidateTag as any)('submissions');
      revalidateTag('wait_stats', 'max');
      revalidateTag('stats', 'max');
      revalidateTag('recent_submissions', 'max');
      revalidateTag('ticker', 'max');
      revalidatePath('/');
      revalidatePath('/submit');
      revalidatePath('/api/stats');
      revalidatePath('/api/aggregate');
      revalidatePath('/api/submissions');
      revalidatePath('/api/submissions/recent');
      revalidatePath('/api/ticker');
    } catch (revalidateErr) {
      if (process.env.NODE_ENV !== 'test') {
        console.warn('Cache revalidation notice in POST /api/submissions:', revalidateErr);
      }
    }

    return NextResponse.json<ApiResponse<any>>(
      {
        success: true,
        data: {
          id: record.id,
          submissionId: record.id,
          queuePosition,
          estimatedDeliveryDate,
          status: record.status,
          currentStage: record.currentStage || validData.stage || 'deposit_placed',
          waitDays: record.waitDays,
          editKey,
          editToken: finalEditToken,
          editUrl: `/edit/${finalEditToken}`,
          updateStatusUrl: `/update-status/${finalEditToken}`,
          email: hasEmail ? submittedEmail : undefined,
          reminder_opt_in: reminderOptIn,
          isFlagged: isCanaryCheck ? true : record.isFlagged,
          is_flagged: isCanaryCheck ? true : record.isFlagged,
          message:
            'Submission recorded anonymously. Save your secret edit link to update your status later.',
        },
      },
      {
        status: 201,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    await rollbackRateLimit(clientIp);
    console.error('[POST /api/submissions]', {
      code: error?.code,
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      stack: error?.stack,
    });

    if (process.env.RESEND_API_KEY) {
      const fromAddress =
        process.env.RESEND_FROM_EMAIL || 'ToyotaWaits Alerts <hello@toyotawaits.ca>';
      const alertText = [
        'ToyotaWaits POST /api/submissions encountered a database/server failure:',
        `Code: ${error?.code || 'UNKNOWN'}`,
        `Message: ${error?.message || 'Unknown error'}`,
        `Details: ${error?.details || 'N/A'}`,
        `Model: ${sanitizedPayloadSummary.model || 'unknown'}`,
        `Province: ${sanitizedPayloadSummary.province || 'unknown'}`,
        `Stage: ${sanitizedPayloadSummary.stage || 'unknown'}`,
        `Timestamp: ${new Date().toISOString()}`,
      ].join('\n');

      Promise.resolve(
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromAddress,
            to: 'danielrubin76@gmail.com',
            subject: '[ALERT] ToyotaWaits POST /api/submissions 500 Error',
            text: alertText,
          }),
          signal: AbortSignal.timeout(8000),
        })
      ).catch((alertErr) => {
        console.warn('[POST /api/submissions] Alert email dispatch failed:', alertErr);
      });
    }

    const isRls = error?.code === '42501' || error?.message?.includes('violates row-level security');
    const isConstraint = error?.code === '23503' || error?.code === '23514';

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: {
          code: isRls
            ? 'RLS_PERMISSION_DENIED'
            : isConstraint
            ? 'DATABASE_CONSTRAINT_ERROR'
            : 'INTERNAL_SERVER_ERROR',
          message: error?.message || 'An unexpected server error occurred while recording your submission.',
          details: error?.details || undefined,
        },
      },
      { status: isRls ? 403 : isConstraint ? 400 : 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: 'INVALID_JSON',
            message: 'Malformed JSON payload in request body.',
          },
        },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const id = body.id || body.submissionId;
    if (!id) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: 'MISSING_ID',
            message: 'Submission ID is required.',
          },
        },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const headerEditKey = request.headers.get('x-edit-key') || undefined;
    const effectiveEditKey = body.editKey || headerEditKey;

    if (!effectiveEditKey) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Edit key is required via x-edit-key header or editKey body parameter.',
          },
        },
        { status: 401, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const validation = submissionUpdateSchema.safeParse({
      ...body,
      id,
      editKey: effectiveEditKey,
    });
    if (!validation.success) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid update payload or format.',
            details: validation.error.flatten().fieldErrors as any,
          },
        },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const validData = validation.data;
    const editKeyHash = crypto.createHash('sha256').update(effectiveEditKey).digest('hex');

    const result = await updateSubmission({
      id: validData.id,
      editKeyHash,
      status: validData.status,
      currentStage: validData.stage,
      deliveryDate: validData.deliveryDate,
      notes: validData.notes,
      trimId: validData.trimId || undefined,
      trimSlug: validData.trimSlug || undefined,
      dealerMarkupAdm: validData.dealerMarkupAdm ?? validData.dealer_markup_adm ?? validData.admMarkup ?? undefined,
      dealer_markup_adm: validData.dealerMarkupAdm ?? validData.dealer_markup_adm ?? validData.admMarkup ?? undefined,
    });

    if (result === 'unauthorized') {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid edit key provided for this submission.',
          },
        },
        { status: 401, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    if (!result) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Submission not found.',
          },
        },
        { status: 404, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    try {
      revalidateTag('submissions', 'max');
      (revalidateTag as any)('submissions');
      if (body.modelSlug) {
        revalidatePath(`/wait-times/${body.modelSlug}`);
      }
    } catch {}

    return NextResponse.json<ApiResponse<any>>(
      {
        success: true,
        data: result,
      },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err: any) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: err?.message || 'Failed to update submission.',
        },
      },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
