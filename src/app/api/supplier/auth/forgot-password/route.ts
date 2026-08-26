/**
 * POST /api/supplier/auth/forgot-password
 * ========================================
 * Trigger secure password recovery using Supabase Auth (Canonical Authority).
 * EntireFM does NOT generate reset tokens or email passwords.
 * Supabase handles secure recovery link delivery.
 */

import { NextResponse } from 'next/server';
import { supabaseRecoverPassword } from '@/server/auth/supabase-auth';

export async function POST(request: Request) {
  try {
    const body = await request.formData().catch(async () => {
      const json = await request.json().catch(() => ({}));
      return new Map(Object.entries(json));
    });

    const email = String(body.get('email') || '').trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.redirect(
        new URL('/supplier-portal/forgot-password?error=invalid_email', request.url),
        { status: 303 }
      );
    }

    const host = request.headers.get('host') || 'localhost:3000';
    const proto = request.headers.get('x-forwarded-proto') || 'http';
    const redirectTo = `${proto}://${host}/supplier-portal/reset-password`;

    // 1. Delegate recovery to Supabase Auth
    await supabaseRecoverPassword(email, redirectTo);

    // 2. Safe enumeration-free response
    const maskedEmail = email.replace(/(.{2}).+(@.+)/, '$1•••$2');
    const encodedEmail = encodeURIComponent(maskedEmail);

    return NextResponse.redirect(
      new URL(`/supplier-portal/forgot-password?sent=1&to=${encodedEmail}`, request.url),
      { status: 303 }
    );
  } catch (err: any) {
    console.error('[SUPPLIER_FORGOT_PASSWORD] Error:', err);
    return NextResponse.redirect(
      new URL('/supplier-portal/forgot-password?error=server', request.url),
      { status: 303 }
    );
  }
}
