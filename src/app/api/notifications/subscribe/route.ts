import { NextRequest, NextResponse } from 'next/server';
import { notificationSubscribeSchema } from '@/lib/validations/schemas';
import { subscribeToNotifications } from '@/lib/db/notifications';
import { ApiResponse } from '@/lib/types/contracts';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
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

    const validation = notificationSubscribeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid subscription request parameters.',
            details: validation.error.flatten().fieldErrors as any,
          },
        },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const result = await subscribeToNotifications(validation.data);

    if (!result.success) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: 'SUBSCRIPTION_FAILED',
            message: result.error || 'Failed to save notification subscription.',
          },
        },
        { status: 500, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    return NextResponse.json<ApiResponse<{ message: string; id: string; email: string; model: string; province: string; unsubscribeToken: string; isNew: boolean }>>(
      {
        success: true,
        data: {
          id: result.id,
          email: result.email || validation.data.email,
          model: result.model || validation.data.model,
          province: result.province || validation.data.province,
          unsubscribeToken: result.unsubscribeToken,
          isNew: result.isNew,
          message: result.isNew
            ? 'Alert subscription confirmed! You will be notified when matching delivery data arrives.'
            : 'Alert subscription reactivated! Your preferences have been updated.',
        },
      },
      {
        status: result.isNew ? 201 : 200,
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
      }
    );
  } catch (error: any) {
    console.error('Unhandled error in POST /api/notifications/subscribe:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred while processing your alert subscription.',
        },
      },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
