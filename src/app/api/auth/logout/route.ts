/**
 * UNIFIED LOGOUT API — /api/auth/logout
 * =====================================
 * Clears session cookies and redirects to /login.
 */

import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/server/identity';

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/login', request.url), { status: 303 });
  response.cookies.delete(AUTH_COOKIE_NAME);
  response.cookies.delete('efm_admin');
  return response;
}

export async function GET(request: Request) {
  return POST(request);
}
