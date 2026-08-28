import { NextRequest, NextResponse } from 'next/server';

/**
 * Validates incoming cron requests.
 * Requirements:
 * - Server-only authorization via Bearer <CRON_SECRET> or ?key=<CRON_SECRET>
 * - Returns 401 Unauthorized for missing / invalid secret
 * - Disables execution on preview deployments to protect live data integrity unless explicitly enabled
 */
export function validateCronRequest(req: NextRequest): { authorized: boolean; errorResponse?: NextResponse } {
  // 1. Preview guard: if in preview environment on Vercel, don't execute cron unless explicitly permitted
  if (process.env.VERCEL_ENV === 'preview' && process.env.ALLOW_CRON_IN_PREVIEW !== 'true') {
    return {
      authorized: false,
      errorResponse: NextResponse.json(
        { error: 'Cron execution is disabled on preview deployments to protect live data integrity.' },
        { status: 403 }
      ),
    };
  }

  const configuredSecret = process.env.CRON_SECRET;
  if (!configuredSecret) {
    return {
      authorized: false,
      errorResponse: NextResponse.json(
        { error: 'CRON_SECRET is not configured on this server.' },
        { status: 500 }
      ),
    };
  }

  const authHeader = req.headers.get('authorization') || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : '';
  const queryKey = req.nextUrl.searchParams.get('key') || '';

  if (bearerToken !== configuredSecret && queryKey !== configuredSecret) {
    return {
      authorized: false,
      errorResponse: NextResponse.json(
        { error: '401 Unauthorized: Invalid or missing cron credentials.' },
        { status: 401 }
      ),
    };
  }

  return { authorized: true };
}
