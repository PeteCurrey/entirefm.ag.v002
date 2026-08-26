/**
 * POST /api/supplier/auth/reset-password
 * =======================================
 * Updates a user's password in Supabase Auth using the active recovery session token.
 * EntireFM does NOT store or hash the new password.
 */

import { NextResponse } from 'next/server';
import { supabaseUpdatePassword } from '@/server/auth/supabase-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { accessToken, password, confirmPassword } = body as Record<string, string>;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Recovery session expired. Please request a new password reset link.' },
        { status: 401 }
      );
    }

    if (!password || password.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 10 characters.' },
        { status: 400 }
      );
    }

    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { success: false, error: 'Password must contain at least one uppercase letter.' },
        { status: 400 }
      );
    }

    if (!/\d/.test(password)) {
      return NextResponse.json(
        { success: false, error: 'Password must contain at least one number.' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Passwords do not match.' },
        { status: 400 }
      );
    }

    // Delegate password update directly to Supabase Auth
    const { error } = await supabaseUpdatePassword(accessToken, password);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message || 'Password update failed with authentication provider.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password successfully updated. You may now sign in.',
    });
  } catch (err: any) {
    console.error('[SUPPLIER_RESET_PASSWORD] Error:', err);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
