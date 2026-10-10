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

    const submission = await getSubmissionByEditToken(token);

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

    const { status, deliveryDate, notes, currentStage } = body;

    // Validate status if provided
    if (status && !['pending', 'delivered', 'cancelled'].includes(status)) {
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
    if (status === 'delivered') {
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

    const updated = await updateSubmissionByEditToken(token, {
      status: status as SubmissionStatus | undefined,
      deliveryDate: deliveryDate !== undefined ? deliveryDate : undefined,
      notes: typeof notes === 'string' ? notes.trim() : undefined,
      currentStage: currentStage as SubmissionStage | undefined,
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
      revalidatePath('/');
      revalidatePath('/submit');
      revalidatePath('/api/stats');
      revalidatePath('/api/aggregate');
      revalidatePath('/api/submissions');
      revalidatePath(`/edit/${token}`);
      revalidateTag('wait_stats', 'max');
      revalidateTag('submissions', 'max');
      revalidateTag('stats', 'max');
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
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred updating your submission.',
        },
      },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

export const PUT = PATCH;
