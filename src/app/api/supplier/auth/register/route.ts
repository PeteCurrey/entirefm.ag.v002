/**
 * POST /api/supplier/auth/register
 * ================================
 * Create a new supplier user account.
 * Sets an HTTP-only session cookie on success.
 * Redirects to /supplier-portal/verify-email.
 */

import { NextResponse } from 'next/server';
import {
  createSupplierUser,
  findSupplierByEmail,
} from '@/server/suppliers/supplier-auth-store';
import {
  AUTH_COOKIE_NAME,
  createSessionToken,
  getRolePermissions,
} from '@/server/identity';

const SUPPLIER_SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function buildSupplierSession(user: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  organisationId: string | null;
}) {
  return {
    personId: user.id,
    email: user.email,
    name: `${user.firstName} ${user.lastName}`.trim(),
    role: 'SUPPLIER_ADMIN' as const,
    orgId: user.organisationId || user.id,
    orgName: 'New Supplier',
    orgType: 'SUPPLIER' as const,
    activeApplication: 'ADMIN' as const,
    permissions: getRolePermissions('SUPPLIER_ADMIN' as any),
    scopes: [],
    expiresAt: Date.now() + SUPPLIER_SESSION_MAX_AGE * 1000,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { firstName, lastName, email, password, confirmPassword } = body as Record<string, string>;

    // Server-side validation
    const errors: string[] = [];
    if (!firstName?.trim()) errors.push('First name is required.');
    if (!lastName?.trim()) errors.push('Last name is required.');
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.push('A valid work email address is required.');
    if (!password || password.length < 10)
      errors.push('Password must be at least 10 characters.');
    if (!/[A-Z]/.test(password || ''))
      errors.push('Password must contain at least one uppercase letter.');
    if (!/\d/.test(password || ''))
      errors.push('Password must contain at least one number.');
    if (password !== confirmPassword)
      errors.push('Passwords do not match.');

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const result = await createSupplierUser(
      email.trim().toLowerCase(),
      password,
      firstName.trim(),
      lastName.trim()
    );

    if (!result.success || !result.user) {
      return NextResponse.json(
        { success: false, errors: [result.error || 'Registration failed.'] },
        { status: 409 }
      );
    }

    const session = buildSupplierSession(result.user);
    const token = createSessionToken(session as any);

    const response = NextResponse.redirect(
      new URL('/supplier-portal/verify-email', request.url),
      { status: 303 }
    );

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: SUPPLIER_SESSION_MAX_AGE,
    });

    return response;
  } catch (err) {
    console.error('Supplier register error:', err);
    return NextResponse.json(
      { success: false, errors: ['An unexpected error occurred. Please try again.'] },
      { status: 500 }
    );
  }
}
