/**
 * ADMIN LOGOUT — /api/admin/logout
 * ================================
 * Clears both efm_session and efm_admin cookies and redirects to /admin/login.
 */

import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/server/identity';
import { ADMIN_COOKIE } from '@/lib/leads/auth';

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/admin/login', request.url), { status: 303 });
  response.cookies.delete(AUTH_COOKIE_NAME);
  response.cookies.delete(ADMIN_COOKIE);
  return response;
}

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL('/admin/login', request.url), { status: 303 });
  response.cookies.delete(AUTH_COOKIE_NAME);
  response.cookies.delete(ADMIN_COOKIE);
  return response;
}
