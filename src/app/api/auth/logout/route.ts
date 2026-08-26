/**
 * UNIFIED LOGOUT API — /api/auth/logout
 * =====================================
 * Clears session cookies and redirects cleanly to the origin-appropriate login route.
 */

import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/server/identity';
import { ADMIN_COOKIE } from '@/lib/leads/auth';

export async function POST(request: Request) {
  const url = new URL(request.url);
  const referer = request.headers.get('referer') || '';

  let defaultRedirect = '/login';
  if (referer.includes('/admin')) {
    defaultRedirect = '/admin/login';
  } else if (referer.includes('/supplier-portal')) {
    defaultRedirect = '/supplier-portal/sign-in';
  }

  const next = url.searchParams.get('redirect') || defaultRedirect;
  const response = NextResponse.redirect(new URL(next, request.url), { status: 303 });
  
  response.cookies.delete(AUTH_COOKIE_NAME);
  response.cookies.delete('efm_admin');
  response.cookies.delete(ADMIN_COOKIE);
  return response;
}

export async function GET(request: Request) {
  return POST(request);
}
