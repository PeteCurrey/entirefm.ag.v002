/**
 * GET /supplier-portal/resume
 * ============================
 * Lifecycle-aware resume route for authenticated supplier users.
 * Resolves the correct destination based on application state.
 */

import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME, verifySessionToken } from '@/server/identity';
import {
  resolveResumeDestination,
  validateSupplierAuthUser,
} from '@/server/suppliers/supplier-auth-store';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = verifySessionToken(token);

  if (!session || (session.orgType as string) !== 'SUPPLIER') {
    const response = NextResponse.redirect(new URL('/supplier-portal/sign-in', request.url));
    response.cookies.delete(AUTH_COOKIE_NAME);
    response.cookies.delete('efm_admin');
    return response;
  }

  // Live Supabase Auth Validation
  const authState = await validateSupplierAuthUser(session.personId || session.authUserId || '');

  if (!authState.valid || !authState.authUser) {
    // Deleted user or invalid identity -> clear stale session and route to register
    const response = NextResponse.redirect(new URL('/supplier-portal/register', request.url));
    response.cookies.delete(AUTH_COOKIE_NAME);
    response.cookies.delete('efm_admin');
    return response;
  }

  if (!authState.isVerified) {
    return NextResponse.redirect(new URL('/supplier-portal/verify-email', request.url));
  }

  const destination = await resolveResumeDestination(authState.authUser.id);
  return NextResponse.redirect(new URL(destination, request.url));
}
