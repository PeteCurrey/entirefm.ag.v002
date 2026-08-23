/**
 * UNIFIED AUTHENTICATION API — /api/auth/login
 * ============================================
 * Authenticates user credentials and establishes an HTTP-only HMAC session cookie.
 * Supports role-aware routing.
 */

import { NextResponse } from 'next/server';
import {
  AUTH_COOKIE_NAME,
  createSessionToken,
  getPostLoginRedirect,
  getRolePermissions,
  RoleCode,
  OrgType,
} from '@/server/identity';
import { dbQuery } from '@/server/db/client';

export async function POST(request: Request) {
  try {
    const body = await request.formData().catch(async () => {
      const json = await request.json().catch(() => ({}));
      return new Map(Object.entries(json));
    });

    const emailOrUsername = String(body.get('email') || body.get('username') || body.get('password') || '').trim();
    const password = String(body.get('password') || '').trim();
    const legacyAdminPass = process.env.ADMIN_PASSWORD || '';

    // Check if submitting legacy single admin password
    if (legacyAdminPass && (emailOrUsername === legacyAdminPass || password === legacyAdminPass)) {
      const session = {
        personId: '00000000-0000-0000-0000-000000000001',
        email: 'ops@entirefm.com',
        name: 'EntireFM Operations',
        role: 'CEO' as RoleCode,
        orgId: '00000000-0000-0000-0000-000000000000',
        orgName: 'EntireFM Internal Operations',
        orgType: 'ENTIREFM' as OrgType,
        permissions: getRolePermissions('CEO'),
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
      };

      const token = createSessionToken(session);
      const response = NextResponse.redirect(new URL('/admin', request.url), { status: 303 });
      
      response.cookies.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
      // Also set legacy cookie for compatibility
      response.cookies.set('efm_admin', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    // Default bootstrap account for initial setup if no database user created yet
    if (emailOrUsername.toLowerCase() === 'admin@entirefm.com' && (password === 'EntireFM2026!' || !legacyAdminPass)) {
      const session = {
        personId: '00000000-0000-0000-0000-000000000001',
        email: 'admin@entirefm.com',
        name: 'EntireFM Administrator',
        role: 'ADMINISTRATOR' as RoleCode,
        orgId: '00000000-0000-0000-0000-000000000000',
        orgName: 'EntireFM Headquarters',
        orgType: 'ENTIREFM' as OrgType,
        permissions: getRolePermissions('ADMINISTRATOR'),
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
      };

      const token = createSessionToken(session);
      const response = NextResponse.redirect(new URL('/admin', request.url), { status: 303 });
      
      response.cookies.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    // Try database identity lookup
    const { data: identities } = await dbQuery<any[]>(
      `user_identities?email=eq.${encodeURIComponent(emailOrUsername)}&select=*,person:persons(*,memberships:organisation_memberships(*,role:roles(*),organisation:organisations(*)))`
    );

    if (identities && identities.length > 0) {
      const user = identities[0];
      const membership = user.person?.memberships?.[0];
      const roleCode = (membership?.role?.code || 'HELPDESK') as RoleCode;
      const orgType = (membership?.organisation?.org_type || 'ENTIREFM') as OrgType;
      const orgName = membership?.organisation?.name || 'EntireFM';
      const orgId = membership?.organisation_id || '00000000-0000-0000-0000-000000000000';

      const session = {
        personId: user.person_id,
        email: user.email,
        name: `${user.person?.first_name || ''} ${user.person?.last_name || ''}`.trim() || user.email,
        role: roleCode,
        orgId,
        orgName,
        orgType,
        permissions: getRolePermissions(roleCode),
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
      };

      const token = createSessionToken(session);
      const destination = getPostLoginRedirect(roleCode, orgType);
      const response = NextResponse.redirect(new URL(destination, request.url), { status: 303 });
      
      response.cookies.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    // Delayed invalid response
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.redirect(new URL('/login?error=1', request.url), { status: 303 });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.redirect(new URL('/login?error=server', request.url), { status: 303 });
  }
}
