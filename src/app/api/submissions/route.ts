import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { submissionCreateSchema } from '@/lib/validations/schemas';
import { verifyTurnstileToken } from '@/lib/security/turnstile';
import { checkRateLimit } from '@/lib/security/ratelimit';
import { detectSubmissionOutlier } from '@/lib/security/outlier-detection';
import { insertSubmission, getCommunitySubmissions } from '@/lib/db/submissions';
import { revalidatePath, revalidateTag } from 'next/cache';
import { ApiResponse } from '@/lib/types/contracts';
import { CommunityRecord } from '@/lib/data/community-records';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const submissions = await getCommunitySubmissions();
    return NextResponse.json<ApiResponse<CommunityRecord[]>>(
      {
        success: true,
        data: submissions,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
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
  try {
    const forwarded = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

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
    const rateLimit = await checkRateLimit(clientIp, 5, 24 * 60 * 60 * 1000);
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

    // 7. Persist Submission
    const record = await insertSubmission({
      modelId: validData.modelId,
      powertrainId: validData.powertrainId,
      trimId: validData.trimId,
      province: validData.province,
      dealershipCity: validData.dealershipCity,
      dealershipName: validData.dealershipName,
      modelYear: validData.modelYear,
      orderDate: validData.orderDate,
      deliveryDate: validData.deliveryDate,
      status: validData.status,
      currentStage: validData.stage,
      pricing: validData.pricing,
      mandatoryAddonsCad: validData.mandatoryAddonsCad,
      tradeInRequired: validData.tradeInRequired,
      notes: validData.notes,
      editKeyHash,
      editToken,
      isFlagged: outlierResult.isFlagged,
    });

    const finalEditToken = record.editToken || editToken;

    // 8. Immediate Cache Revalidation for Public Feed and Statistics
    try {
      revalidatePath('/');
      revalidatePath('/submit');
      revalidatePath('/api/stats');
      revalidatePath('/api/aggregate');
      revalidatePath('/api/submissions');
      revalidateTag('wait_stats', 'max');
      revalidateTag('submissions', 'max');
      revalidateTag('stats', 'max');
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
