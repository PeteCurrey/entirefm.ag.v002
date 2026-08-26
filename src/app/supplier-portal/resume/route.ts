/**
 * GET /supplier-portal/resume
 * ============================
 * Lifecycle-aware resume route for authenticated supplier users.
 * Resolves the correct destination based on application state.
 */

import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME, verifySessionToken } from '@/server/identity';
import { resolveResumeDestination } from '@/server/suppliers/supplier-auth-store';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = verifySessionToken(token);

  if (!session || (session.orgType as string) !== 'SUPPLIER') {
    return NextResponse.redirect(new URL('/supplier-portal/sign-in', request.url));
  }

  const destination = await resolveResumeDestination(session.personId);
  return NextResponse.redirect(new URL(destination, request.url));
}
