import { NextRequest, NextResponse } from 'next/server';
import { getSubmissionByEditToken, updateSubmissionByEditToken } from '@/lib/db/submissions';
import { revalidatePath, revalidateTag } from 'next/cache';
import { ApiResponse, SubmissionStatus, SubmissionStage } from '@/lib/types/contracts';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const queryKey =
      request.nextUrl.searchParams.get('key') ||
      request.nextUrl.searchParams.get('edit_token') ||
      request.nextUrl.searchParams.get('editKey') ||
      undefined;

    if (!token || !UUID_REGEX.test(token)) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Submission not found or invalid edit token.',
          },
        },
        { status: 404, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const submission = await getSubmissionByEditToken(token, queryKey);

    if (!submission) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Submission not found or invalid edit token.',
          },
        },
        { status: 404, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    return NextResponse.json<ApiResponse<any>>(
      {
        success: true,
        data: submission,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('Error in GET /api/submissions/edit/[token]:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred retrieving your submission.',
        },
      },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const queryKey =
      request.nextUrl.searchParams.get('key') ||
      request.nextUrl.searchParams.get('edit_token') ||
      request.nextUrl.searchParams.get('editKey') ||
      '';

    if (!token || !UUID_REGEX.test(token)) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Submission not found or invalid edit token.',
          },
        },
        { status: 404, headers: { 'Cache-Control': 'no-store' } }
      );
    }

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

    const submissionId = body.id || body.submissionId || (UUID_REGEX.test(token) ? token : undefined);
    const secretKey = body.edit_token || body.key || body.editKey || queryKey || token;
    const rawMilestone = body.milestone || body.stage || body.currentStage;

    const { status, deliveryDate, notes, modelId, powertrainId, trimId, model, modelSlug, powertrainSlug, trimSlug } = body;
    const resolvedStage = rawMilestone;

    const finalStatus =
      status ||
      (resolvedStage === 'delivered'
        ? 'delivered'
        : resolvedStage === 'cancelled'
        ? 'cancelled'
        : resolvedStage
        ? 'pending'
        : undefined);

    // Validate status if provided
    if (finalStatus && !['pending', 'delivered', 'cancelled'].includes(finalStatus)) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: 'INVALID_STATUS',
            message: 'Status must be pending, delivered, or cancelled.',
          },
        },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // Validate delivery date if status is delivered
    if (finalStatus === 'delivered') {
      if (!deliveryDate) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            error: {
              code: 'DELIVERY_DATE_REQUIRED',
              message: 'Delivery date is required when marking an order as delivered.',
            },
          },
          { status: 400, headers: { 'Cache-Control': 'no-store' } }
        );
      }
      const parsedDate = new Date(deliveryDate);
      if (isNaN(parsedDate.getTime())) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            error: {
              code: 'INVALID_DATE',
              message: 'Invalid delivery date format.',
            },
          },
          { status: 400, headers: { 'Cache-Control': 'no-store' } }
        );
      }
    }

    const effectiveStage = resolvedStage || (finalStatus === 'cancelled' ? 'cancelled' : undefined);

    const updated = await updateSubmissionByEditToken(token, {
      id: submissionId,
      edit_token: secretKey,
      key: secretKey,
      milestone: effectiveStage,
      status: finalStatus as SubmissionStatus | undefined,
      deliveryDate: deliveryDate !== undefined ? deliveryDate : undefined,
      notes: typeof notes === 'string' ? notes.trim() : undefined,
      currentStage: effectiveStage as SubmissionStage | undefined,
      stage: effectiveStage,
      modelId,
      powertrainId,
      trimId,
      model,
      modelSlug,
      powertrainSlug,
      trimSlug,
    });

    if (!updated) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Submission not found or invalid edit token.',
          },
        },
        { status: 404, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // Immediate Cache Revalidation
    try {
      revalidatePath('/edit/[token]', 'page');
      revalidatePath('/edit/[token]');
      revalidatePath(`/edit/${token}`);
      if (submissionId && submissionId !== token) {
        revalidatePath(`/edit/${submissionId}`);
      }
      revalidatePath('/analytics');
      revalidatePath('/api/analytics');
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
        console.warn('Cache revalidation notice in PATCH /api/submissions/edit/[token]:', revalidateErr);
      }
    }

    return NextResponse.json<ApiResponse<any>>(
      {
        success: true,
        data: {
          ...updated,
          message: 'Submission successfully updated.',
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('Error in PATCH /api/submissions/edit/[token]:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPDATE_FAILED',
          message: error?.message || 'An unexpected error occurred updating your submission.',
        },
        message: error?.message || 'An unexpected error occurred updating your submission.',
      },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

export const PUT = PATCH;
