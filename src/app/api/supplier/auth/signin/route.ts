/**
 * POST /api/supplier/auth/signin
 * ==============================
 * Authenticate a supplier user by email + password.
 * Sets session cookie and resolves lifecycle-aware redirect.
 */

import { NextResponse } from 'next/server';
import {
  findSupplierByEmail,
  verifyPassword,
  resolveResumeDestination,
} from '@/server/suppliers/supplier-auth-store';
import {
  AUTH_COOKIE_NAME,
  createSessionToken,
  getRolePermissions,
} from '@/server/identity';

const SUPPLIER_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(request: Request) {
  try {
    const body = await request.formData().catch(async () => {
      const json = await request.json().catch(() => ({}));
      return new Map(Object.entries(json));
    });

    const email = String(body.get('email') || '').trim().toLowerCase();
    const password = String(body.get('password') || '');
    const redirectParam = String(body.get('redirect') || '');

    if (!email || !password) {
      return NextResponse.redirect(
        new URL('/supplier-portal/sign-in?error=missing_credentials', request.url),
        { status: 303 }
      );
    }

    const user = await findSupplierByEmail(email);

    if (!user || !verifyPassword(password, user.passwordHash)) {
      // Constant-time response regardless of whether user exists
      await new Promise((r) => setTimeout(r, 350));
      return NextResponse.redirect(
        new URL('/supplier-portal/sign-in?error=invalid_credentials', request.url),
        { status: 303 }
      );
    }

    if (user.status !== 'ACTIVE') {
      return NextResponse.redirect(
        new URL('/supplier-portal/sign-in?error=account_suspended', request.url),
        { status: 303 }
      );
    }

    const session = {
      personId: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      role: 'SUPPLIER_ADMIN' as const,
      orgId: user.organisationId || user.id,
      orgName: 'Supplier',
      orgType: 'SUPPLIER' as const,
      activeApplication: 'ADMIN' as const,
      permissions: getRolePermissions('SUPPLIER_ADMIN' as any),
      scopes: [],
      expiresAt: Date.now() + SUPPLIER_SESSION_MAX_AGE * 1000,
    };

    const token = createSessionToken(session as any);

    // Resolve lifecycle-aware destination
    const destination = redirectParam || (await resolveResumeDestination(user.id));

    const response = NextResponse.redirect(new URL(destination, request.url), { status: 303 });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: SUPPLIER_SESSION_MAX_AGE,
    });

    return response;
  } catch (err) {
    console.error('Supplier sign-in error:', err);
    return NextResponse.redirect(
      new URL('/supplier-portal/sign-in?error=server', request.url),
      { status: 303 }
    );
  }
}
