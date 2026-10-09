import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { submissionUpdateSchema } from '@/lib/validations/schemas';
import { updateSubmission } from '@/lib/db/submissions';
import { revalidatePath, revalidateTag } from 'next/cache';
import { ApiResponse } from '@/lib/types/contracts';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
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
      revalidatePath('/');
      revalidatePath('/submit');
      revalidateTag('wait_stats', 'max');
    } catch (revalidateErr) {
      if (process.env.NODE_ENV !== 'test') {
        console.warn('Cache revalidation notice in PATCH /api/submissions/[id]:', revalidateErr);
      }
    }

    return NextResponse.json<ApiResponse<any>>(
      {
        success: true,
        data: result,
      },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error: any) {
    console.error('Unhandled error in PATCH /api/submissions/[id]:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update submission.',
        },
      },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
