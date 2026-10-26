import { handleSweep, validateCronSecret } from '../sweep/route';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60;

export { validateCronSecret };

export async function GET(request: Request) {
  const auth = validateCronSecret(request);
  if (!auth.authorized) {
    return new Response(
      JSON.stringify({
        success: false,
        error: `Unauthorized: ${auth.reason}`,
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  return handleSweep(request);
}

export async function POST(request: Request) {
  const auth = validateCronSecret(request);
  if (!auth.authorized) {
    return new Response(
      JSON.stringify({
        success: false,
        error: `Unauthorized: ${auth.reason}`,
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  return handleSweep(request);
}
