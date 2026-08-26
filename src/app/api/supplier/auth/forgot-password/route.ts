/**
 * POST /api/supplier/auth/forgot-password
 * ========================================
 * Trigger secure password recovery using Supabase Auth (Canonical Authority).
 * EntireFM does NOT generate reset tokens or email passwords.
 * Supabase handles secure recovery link delivery.
 *
 * REDIRECT URL:
 * The recovery email from Supabase delivers a PKCE token_hash link in the form:
 *   {siteUrl}/auth/confirm?token_hash=...&type=recovery
 *
 * The redirectTo parameter passed here MUST be the /auth/confirm endpoint (not the reset page
 * directly) so Supabase knows where to send the user. This URL must be whitelisted in
 * the Supabase Dashboard → Authentication → URL Configuration → Redirect URLs.
 *
 * See docs/SUPABASE_URL_CONFIG.md for the full whitelist.
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

    // Derive the canonical site origin.
    // In production this will be https://www.entirefm.com.
    // In Vercel preview deployments this will be the preview URL.
    // The SITE_URL env var takes priority if set.
    const host = request.headers.get('host') || 'localhost:3000';
    const proto = request.headers.get('x-forwarded-proto') || 'http';
    const origin = process.env.SITE_URL || `${proto}://${host}`;

    // redirectTo MUST point to /auth/confirm — the PKCE token_hash callback handler.
    // Supabase will append ?token_hash=...&type=recovery to this URL.
    // This URL must be whitelisted in Supabase Dashboard → Redirect URLs.
    const redirectTo = `${origin}/auth/confirm`;

    console.info('[SUPPLIER_AUTH] Password recovery requested.', { maskedEmail: email.replace(/(.{2}).+(@.+)/, '$1•••$2') });

    // 1. Delegate recovery to Supabase Auth — always returns 200 (enumeration-safe)
    await supabaseRecoverPassword(email, redirectTo);

    // 2. Safe enumeration-free response — show sent banner regardless of whether user exists
    const maskedEmail = email.replace(/(.{2}).+(@.+)/, '$1•••$2');
    const encodedEmail = encodeURIComponent(maskedEmail);

    return NextResponse.redirect(
      new URL(`/supplier-portal/forgot-password?sent=1&to=${encodedEmail}`, request.url),
      { status: 303 }
    );
  } catch (err: any) {
    console.error('[SUPPLIER_AUTH] Password recovery error:', err?.message || err);
    return NextResponse.redirect(
      new URL('/supplier-portal/forgot-password?error=server', request.url),
      { status: 303 }
    );
  }
}
