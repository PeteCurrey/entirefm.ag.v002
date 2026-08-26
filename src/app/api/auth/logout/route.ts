/**
 * UNIFIED LOGOUT API — /api/auth/logout
 * =====================================
 * Clears session cookies and redirects to /login.
 */

import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/server/identity';

export async function POST(request: Request) {
  const url = new URL(request.url);
  const next = url.searchParams.get('redirect') || (request.headers.get('referer')?.includes('/supplier-portal') ? '/supplier-portal/sign-in' : '/login');
  const response = NextResponse.redirect(new URL(next, request.url), { status: 303 });
  response.cookies.delete(AUTH_COOKIE_NAME);
  response.cookies.delete('efm_admin');
  return response;
}

export async function GET(request: Request) {
  return POST(request);
}
