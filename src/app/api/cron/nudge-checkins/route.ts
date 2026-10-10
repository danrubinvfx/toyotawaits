import { NextRequest, NextResponse } from 'next/server';
import { findEligibleNudgeSubmissions, recordNudgeSent } from '@/lib/db/nudges';
import { generateNudgeEmail } from '@/lib/email/nudge-template';

export const dynamic = 'force-dynamic';

function isAuthorized(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    // In local development or testing without CRON_SECRET configured, allow requests
    return true;
  }

  const authHeader = request.headers.get('authorization');
  const cronSecretHeader = request.headers.get('x-cron-secret');

  if (authHeader && authHeader === `Bearer ${cronSecret}`) {
    return true;
  }

  if (cronSecretHeader && cronSecretHeader === cronSecret) {
    return true;
  }

  return false;
}

export async function GET(request: NextRequest) {
  return handleNudgeCron(request);
}

export async function POST(request: NextRequest) {
  return handleNudgeCron(request);
}

async function handleNudgeCron(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Invalid or missing CRON_SECRET.' },
      { status: 401 }
    );
  }

  try {
    const candidates = await findEligibleNudgeSubmissions();
    const dispatched: string[] = [];

    for (const candidate of candidates) {
      const email = generateNudgeEmail({
        recipientEmail: candidate.email,
        model: candidate.model,
        modelSlug: candidate.modelSlug,
        powertrain: candidate.powertrain,
        trim: candidate.trim,
        province: candidate.province,
        orderDate: candidate.orderDate,
        daysWaited: candidate.daysWaited,
        editToken: candidate.editToken,
        unsubscribeToken: candidate.unsubscribeToken,
      });

      // If an external email provider (e.g. Resend) is configured in production:
      if (process.env.RESEND_API_KEY) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: 'ToyotaWaits Alerts <alerts@toyotawaits.ca>',
              to: candidate.email,
              subject: email.subject,
              html: email.html,
              text: email.text,
              headers: email.headers,
            }),
          });
        } catch (dispatchErr) {
          console.warn(`Failed to dispatch Resend nudge to ${candidate.email}:`, dispatchErr);
        }
      }

      // Record nudge timestamp in database
      await recordNudgeSent(candidate.submissionId);
      dispatched.push(candidate.submissionId);
    }

    return NextResponse.json(
      {
        success: true,
        checkedCount: candidates.length,
        nudgedCount: dispatched.length,
        dispatchedSubmissionIds: dispatched,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
      }
    );
  } catch (error: any) {
    console.error('Unhandled error in /api/cron/nudge-checkins:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error executing automated milestone nudge check-in.',
      },
      { status: 500 }
    );
  }
}
