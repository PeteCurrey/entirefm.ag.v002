/**
 * POST /api/supplier/auth/forgot-password
 * ========================================
 * Accepts supplier email and returns a confirmation.
 * In production this would send a reset link via email provider.
 * For this phase: returns confirmation UI state.
 */

import { NextResponse } from 'next/server';
import { findSupplierByEmail } from '@/server/suppliers/supplier-auth-store';

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

    // Constant-time: always respond the same way regardless of whether account exists
    await new Promise((r) => setTimeout(r, 400));

    // In production: send reset link via email provider
    // For this phase: return confirmation state
    const maskedEmail = email.replace(/(.{2}).+(@.+)/, '$1•••$2');
    const encodedEmail = encodeURIComponent(maskedEmail);

    return NextResponse.redirect(
      new URL(`/supplier-portal/forgot-password?sent=1&to=${encodedEmail}`, request.url),
      { status: 303 }
    );
  } catch (err) {
    console.error('Forgot password error:', err);
    return NextResponse.redirect(
      new URL('/supplier-portal/forgot-password?error=server', request.url),
      { status: 303 }
    );
  }
}
