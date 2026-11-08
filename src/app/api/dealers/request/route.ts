import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { Resend } from 'resend';
import { createServerClient, isLiveSupabaseConfigured } from '@/lib/supabase/server';
import { checkRateLimit, consumeRateLimit } from '@/lib/security/ratelimit';

export const dynamic = 'force-dynamic';
export * from './config';

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour sliding window
const MAX_REQUESTS_PER_HOUR = 5;

export async function POST(request: NextRequest) {
  let clientIp = '127.0.0.1';
  try {
    const forwarded = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip');
    clientIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    let body: Record<string, any>;
    try {
      body = (await request.json()) as Record<string, any>;
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Malformed JSON payload in request body.',
        },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // Extract fields supporting both camelCase and snake_case
    const dealerName =
      typeof body?.dealerName === 'string'
        ? body.dealerName.trim()
        : typeof body?.dealer_name === 'string'
        ? body.dealer_name.trim()
        : '';

    const city = typeof body?.city === 'string' ? body.city.trim() : '';
    const province = typeof body?.province === 'string' ? body.province.trim() : '';

    const websiteUrl =
      typeof body?.websiteUrl === 'string' && body.websiteUrl.trim()
        ? body.websiteUrl.trim()
        : typeof body?.website_url === 'string' && body.website_url.trim()
        ? body.website_url.trim()
        : null;

    const userEmail =
      typeof body?.userEmail === 'string' && body.userEmail.trim()
        ? body.userEmail.trim().toLowerCase()
        : typeof body?.user_email === 'string' && body.user_email.trim()
        ? body.user_email.trim().toLowerCase()
        : null;

    const notifyWhenAdded = Boolean(body?.notifyWhenAdded ?? body?.notify_when_added ?? false);

    const sourceFilterState =
      body?.sourceFilterState && typeof body.sourceFilterState === 'object'
        ? body.sourceFilterState
        : body?.source_filter_state && typeof body.source_filter_state === 'object'
        ? body.source_filter_state
        : {};

    // Validate required fields
    if (!dealerName || !city || !province) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: dealerName, city, and province are required.',
        },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // Validate optional email if provided
    if (userEmail && !EMAIL_REGEX.test(userEmail)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please enter a valid email address.',
        },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // Rate-limit guard: max 5 requests per hour per IP
    const rateLimit = await checkRateLimit(
      `dealer_request:${clientIp}`,
      MAX_REQUESTS_PER_HOUR,
      RATE_LIMIT_WINDOW_MS,
      false
    );

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. You can submit up to 5 dealership requests per hour.',
        },
        {
          status: 429,
          headers: {
            'Cache-Control': 'no-store',
            'Retry-After': String(Math.max(1, rateLimit.reset - Math.floor(Date.now() / 1000))),
          },
        }
      );
    }

    let recordId = crypto.randomUUID();

    // Persist to Supabase if live database is configured
    if (isLiveSupabaseConfigured()) {
      const supabase = createServerClient();
      const { data, error } = await supabase
        .from('dealer_requests')
        .insert({
          dealer_name: dealerName,
          city,
          province,
          website_url: websiteUrl,
          user_email: userEmail,
          notify_when_added: notifyWhenAdded,
          source_filter_state: sourceFilterState,
          status: 'pending',
        })
        .select('id')
        .single();

      if (error) {
        console.error('Failed to insert dealer request into Supabase:', error);
        return NextResponse.json(
          {
            success: false,
            error: 'Database error while saving dealership request.',
          },
          { status: 500, headers: { 'Cache-Control': 'no-store' } }
        );
      }

      if (data?.id) {
        recordId = data.id;
      }
    }

    // Consume rate limit quota on successful persistence
    await consumeRateLimit(`dealer_request:${clientIp}`, RATE_LIMIT_WINDOW_MS);

    // Dispatch notification email to hello@toyotawaits.ca via Resend if RESEND_API_KEY is configured
    const hasResendKey = Boolean(
      process.env.RESEND_API_KEY &&
        process.env.RESEND_API_KEY.trim() !== '' &&
        !process.env.RESEND_API_KEY.includes('placeholder') &&
        !process.env.RESEND_API_KEY.includes('mock-')
    );

    if (hasResendKey) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const fromEmail =
          process.env.RESEND_FROM_EMAIL?.trim() || 'ToyotaWaits.ca <hello@toyotawaits.ca>';

        await resend.emails.send({
          from: fromEmail,
          to: ['hello@toyotawaits.ca'],
          subject: `New Dealership Feed Request: ${dealerName} (${city}, ${province})`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background-color: #09090b; color: #f4f4f5; border-radius: 12px; border: 1px solid #27272a;">
              <h2 style="margin-top: 0; color: #ffffff; font-size: 20px;">New Dealership Feed Request</h2>
              <p style="color: #d4d4d8; font-size: 14px; line-height: 1.6;">
                A user has submitted a request to index a new dealership feed:
              </p>
              <ul style="color: #e4e4e7; font-size: 14px; line-height: 1.6; padding-left: 20px;">
                <li><strong>Dealership Name:</strong> ${dealerName}</li>
                <li><strong>Location:</strong> ${city}, ${province}</li>
                ${websiteUrl ? `<li><strong>Website:</strong> <a href="${websiteUrl}" style="color: #60a5fa;">${websiteUrl}</a></li>` : ''}
                ${userEmail ? `<li><strong>User Email:</strong> ${userEmail}</li>` : '<li><strong>User Email:</strong> Not provided</li>'}
                <li><strong>Notify When Added:</strong> ${notifyWhenAdded ? 'Yes' : 'No'}</li>
              </ul>
              ${
                sourceFilterState && Object.keys(sourceFilterState).length > 0
                  ? `
                <div style="margin-top: 16px;">
                  <h4 style="margin: 0 0 8px 0; color: #a1a1aa; font-size: 12px; text-transform: uppercase;">Active Filters at Request:</h4>
                  <pre style="background: #18181b; padding: 12px; border-radius: 8px; font-size: 11px; color: #a1a1aa; overflow-x: auto; border: 1px solid #27272a;">${JSON.stringify(sourceFilterState, null, 2)}</pre>
                </div>
              `
                  : ''
              }
              <hr style="border: 0; border-top: 1px solid #27272a; margin: 20px 0;" />
              <p style="color: #71717a; font-size: 11px; margin-bottom: 0;">
                ToyotaWaits.ca Intake Telemetry &bull; Request ID: ${recordId}
              </p>
            </div>
          `.trim(),
        });
      } catch (emailError) {
        console.error('Failed to dispatch dealership request email notification via Resend:', emailError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        id: recordId,
      },
      { status: 201, headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error: any) {
    console.error('Unhandled error in POST /api/dealers/request:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process dealership intake request.',
      },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
