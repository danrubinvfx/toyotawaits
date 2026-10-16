import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { submissionCreateSchema } from '@/lib/validations/schemas';
import { verifyTurnstileToken } from '@/lib/security/turnstile';
import { checkRateLimit, consumeRateLimit, rollbackRateLimit } from '@/lib/security/ratelimit';
import { detectSubmissionOutlier } from '@/lib/security/outlier-detection';
import { insertSubmission, getCommunitySubmissions } from '@/lib/db/submissions';
import { revalidatePath, revalidateTag } from 'next/cache';
import { ApiResponse } from '@/lib/types/contracts';
import { CommunityRecord } from '@/lib/data/community-records';
import { CANADIAN_VEHICLE_CATALOG } from '@/lib/data/vehicles';

export const dynamic = 'force-dynamic';

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
    const submissions = await getCommunitySubmissions(targetCountry);
    return NextResponse.json<ApiResponse<CommunityRecord[]>>(
      {
        success: true,
        data: submissions,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=600',
          'CDN-Cache-Control': 'public, s-maxage=60, stale-while-revalidate=600',
          'Vercel-CDN-Cache-Control': 'public, s-maxage=60, stale-while-revalidate=600',
        },
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

    // 2. Ephemeral In-Memory Rate Limiting (Zero-PII compliant)
    // Check quota without consuming attempt (only successful database insertions decrement quota)
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

    // Vehicle Dimension Normalization (Gracefully maps slugs, vehicle names, or unformatted IDs to catalog UUIDs)
    if (body && typeof body === 'object') {
      const incomingModelStr = String(body.modelSlug || body.modelId || body.model || '').toLowerCase().trim();
      const catalogModel = CANADIAN_VEHICLE_CATALOG.find(
        (m) =>
          m.id.toLowerCase() === incomingModelStr ||
          m.slug.toLowerCase() === incomingModelStr ||
          m.name.toLowerCase() === incomingModelStr
      );

      if (catalogModel) {
        if (!body.modelId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.modelId)) {
          body.modelId = catalogModel.id;
        }
        body.modelSlug = catalogModel.slug;
        body.model = catalogModel.name;

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
          if (!body.powertrainId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.powertrainId)) {
            body.powertrainId = catalogPt.id;
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
            if (!body.trimId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.trimId)) {
              body.trimId = catalogTrim.id;
            }
            body.trimSlug = catalogTrim.slug;
          }
        }
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
    const turnstile = await verifyTurnstileToken(validData.turnstileToken, clientIp);
    if (!turnstile.success) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: 'BOT_VERIFICATION_FAILED',
            message: 'Bot verification challenge failed or expired. Please reload and try again.',
          },
        },
        { status: 403, headers: { 'Cache-Control': 'no-store' } }
      );
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

      const resolvedCountry = validData.country || validData.country_code || validData.countryCode || 'CA';
      const resolvedCurrency = validData.currency || (resolvedCountry === 'US' ? 'USD' : 'CAD');
      const resolvedAdm = validData.adm_markup ?? validData.dealer_markup_adm ?? validData.dealerMarkupAdm ?? null;
      const resolvedPricingType = validData.pricing_type || (validData.pricing === 'above_msrp' ? 'markup' : validData.pricing === 'below_msrp' ? 'discount' : validData.pricing || 'at_msrp');

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
        province: validData.province,
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
        tradeInRequired: validData.tradeInRequired,
        notes: validData.notes,
        editKeyHash,
        editToken,
        isFlagged: outlierResult.isFlagged,
      });

    // 8. Consume rate limit only after successful persistence
    await consumeRateLimit(clientIp, 24 * 60 * 60 * 1000);

    const finalEditToken = record.editToken || editToken;

    // 9. Immediate Cache Revalidation for Public Feed and Statistics
    try {
      revalidatePath('/');
      revalidatePath('/submit');
      revalidatePath('/api/stats');
      revalidatePath('/api/aggregate');
      revalidatePath('/api/submissions');
      revalidatePath('/api/submissions/recent');
      revalidatePath('/api/ticker');
      revalidateTag('submissions', 'max');
      revalidateTag('wait_stats', 'max');
      revalidateTag('stats', 'max');
      revalidateTag('recent_submissions', 'max');
      revalidateTag('ticker', 'max');
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
          status: record.status,
          currentStage: record.currentStage || validData.stage || 'deposit_placed',
          waitDays: record.waitDays,
          editKey,
          editToken: finalEditToken,
          editUrl: `/edit/${finalEditToken}`,
          isFlagged: record.isFlagged,
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
    console.error('Unhandled error in POST /api/submissions:', {
      message: error?.message,
      code: error?.code,
      details: error?.details,
      hint: error?.hint,
      stack: error?.stack,
    });

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
