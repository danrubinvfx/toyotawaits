import { NextRequest, NextResponse } from 'next/server';
import { unsubscribeByToken } from '@/lib/db/notifications';
import { ApiResponse } from '@/lib/types/contracts';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    let token: string | null = null;
    try {
      const body = await request.json();
      token = body?.token;
    } catch {
      token = request.nextUrl.searchParams.get('token');
    }

    if (!token) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: 'MISSING_TOKEN',
            message: 'Unsubscribe token is required.',
          },
        },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    if (!UUID_REGEX.test(token)) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid unsubscribe token format.',
          },
        },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const res = await unsubscribeByToken(token);

    if (!res.found) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Unsubscribe token not found or already unsubscribed.',
          },
        },
        { status: 404, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    return NextResponse.json<ApiResponse<{ message: string; isActive: boolean }>>(
      {
        success: true,
        data: {
          message: 'You have been successfully unsubscribed from delivery and wait-time alerts.',
          isActive: false,
        },
      },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err: any) {
    console.error('Unhandled error in POST /api/notifications/unsubscribe:', err);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while processing your unsubscribe request.',
        },
      },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: {
          code: 'MISSING_TOKEN',
          message: 'Unsubscribe token is required.',
        },
      },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  if (!UUID_REGEX.test(token)) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid unsubscribe token format.',
        },
      },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const res = await unsubscribeByToken(token);

  if (!res.found) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Unsubscribe token not found or already unsubscribed.',
        },
      },
      { status: 404, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  return NextResponse.json<ApiResponse<{ message: string; isActive: boolean }>>(
    {
      success: true,
      data: {
        message: 'You have been successfully unsubscribed from delivery and wait-time alerts.',
        isActive: false,
      },
    },
    { status: 200, headers: { 'Cache-Control': 'no-store' } }
  );
}
