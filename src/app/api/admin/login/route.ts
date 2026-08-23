/**
 * ADMIN LOGIN — /api/admin/login
 * ==============================
 * POST a password, receive a session cookie. Sign-out is /api/admin/logout.
 *
 * The response is deliberately uninformative on failure: it does not say
 * whether the password was wrong or whether admin access has been configured
 * at all, because both answers are useful to someone who should not be here.
 */

import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, passwordMatches, sessionToken } from '@/lib/leads/auth';

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const password = String(form?.get('password') ?? '');
  const token = sessionToken();

  if (!password || !passwordMatches(password) || !token) {
    // A small fixed delay blunts rapid online guessing without pretending to
    // be rate limiting, which belongs at the edge rather than here.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.redirect(new URL('/admin?error=1', request.url), { status: 303 });
  }

  const response = NextResponse.redirect(new URL('/admin', request.url), { status: 303 });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
  return response;
}
