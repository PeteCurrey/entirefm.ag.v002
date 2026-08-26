/**
 * POST /api/supplier/auth/resend-verification
 * ============================================
 * Resends Supabase Auth confirmation email.
 */

import { NextResponse } from 'next/server';
import { supabaseResendVerification } from '@/server/auth/supabase-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email } = body as Record<string, string>;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const host = request.headers.get('host') || 'localhost:3000';
    const proto = request.headers.get('x-forwarded-proto') || 'http';
    const redirectTo = `${proto}://${host}/api/auth/callback?type=signup`;

    const { error } = await supabaseResendVerification(email.trim().toLowerCase(), redirectTo);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to resend confirmation email.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Confirmation email has been resent.',
    });
  } catch (err: any) {
    console.error('[RESEND_VERIFICATION] Error:', err);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
