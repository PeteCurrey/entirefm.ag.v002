/**
 * GET /api/auth/callback
 * =======================
 * Canonical Supabase Auth Callback handler for email confirmations & password recoveries.
 * Validates callback parameters and redirects safely to the intended destination.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { setSupplierUserEmailVerified } from '@/server/suppliers/supplier-auth-store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const next = searchParams.get('next') || searchParams.get('redirect_to');
  const userId = searchParams.get('user_id') || searchParams.get('uid');

  if (error) {
    console.error('[SUPABASE_CALLBACK_ERROR]', error, errorDescription);
    const redirectUrl = new URL('/supplier-portal/sign-in', request.url);
    redirectUrl.searchParams.set('error', 'auth_callback_failed');
    if (errorDescription) redirectUrl.searchParams.set('detail', errorDescription);
    return NextResponse.redirect(redirectUrl);
  }

  // Open-redirect protection: ensure destination is a relative internal path
  let safeNext = '/supplier-portal/resume';
  if (next && next.startsWith('/') && !next.startsWith('//')) {
    safeNext = next;
  }

  // Handle password recovery callback
  if (type === 'recovery') {
    const resetUrl = new URL('/supplier-portal/reset-password', request.url);
    // Forward any hash or query tokens
    return NextResponse.redirect(resetUrl);
  }

  // Handle email verification callback
  if (type === 'signup' || type === 'email_change' || type === 'invite') {
    if (userId) {
      await setSupplierUserEmailVerified(userId, true);
    }
    const target = safeNext === '/supplier-portal/resume' ? '/supplier-portal/org-setup' : safeNext;
    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.redirect(new URL(safeNext, request.url));
}
