import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const rawHostHeader =
    request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
  const rawHost = rawHostHeader.split(',')[0].trim().toLowerCase();
  const host = rawHost.split(':')[0];

  // Detect domain context:
  // - U.S. domain: toyotawaits.com (and *.toyotawaits.com) -> US
  // - Canadian domain: toyotawaits.ca (and *.toyotawaits.ca, local dev fallback default) -> CA
  const isUsDomain = host === 'toyotawaits.com' || host.endsWith('.toyotawaits.com');
  const region = isUsDomain ? 'US' : 'CA';
  const domain = isUsDomain ? 'toyotawaits.com' : 'toyotawaits.ca';

  // Enforce 301 canonical redirect from apex domain to www within the same TLD
  // preserving pathname and query string without looping on /wait-times/*
  if (host === 'toyotawaits.com' || host === 'toyotawaits.ca') {
    const targetOrigin =
      host === 'toyotawaits.com'
        ? 'https://www.toyotawaits.com'
        : 'https://www.toyotawaits.ca';
    const redirectUrl = new URL(
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
      targetOrigin
    );
    const redirectResponse = NextResponse.redirect(redirectUrl, 301);
    redirectResponse.headers.set('x-region', region);
    redirectResponse.headers.set('x-domain', domain);
    return redirectResponse;
  }

  // Propagate custom headers to downstream Server Components and Route Handlers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-region', region);
  requestHeaders.set('x-domain', domain);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Also attach to response headers for edge / client inspection
  response.headers.set('x-region', region);
  response.headers.set('x-domain', domain);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/export (explicitly excluded)
     * - static file extensions (.svg, .png, .jpg, .jpeg, .gif, .webp, .ico)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|api/export|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
