/**
 * INTERNAL ADMIN AUTHENTICATION API — /api/admin/login
 * ====================================================
 * Dedicated internal control-plane authentication handler.
 * Completely decoupled from the public Client / Supplier / Engineer login flow.
 *
 * Supports:
 * 1. Master Security Secret (ADMIN_PASSWORD)
 * 2. Bootstrap Super Admin (admin@entirefm.com / EntireFM2026!)
 * 3. Database-backed Internal EntireFM Staff (user_identities + organisation_memberships with org_type='ENTIREFM')
 * 4. Supabase Auth internal staff accounts
 * 5. Destination preservation (next=/admin/careers etc.)
 */

import { NextResponse } from 'next/server';
import {
  AUTH_COOKIE_NAME,
  createSessionToken,
  getRolePermissions,
  RoleCode,
  OrgType,
  ApplicationPortal,
} from '@/server/identity';
import { ADMIN_COOKIE, passwordMatches, sessionToken } from '@/lib/leads/auth';
import { dbQuery } from '@/server/db/client';
import { supabaseSignIn } from '@/server/auth/supabase-auth';

const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(request: Request) {
  try {
    const body = await request.formData().catch(async () => {
      const json = await request.json().catch(() => ({}));
      return new Map(Object.entries(json));
    });

    const emailOrIdentifier = String(body.get('email') || body.get('username') || '').trim();
    const password = String(body.get('password') || '').trim();
    const twoFactorCode = String(body.get('two_factor_code') || '').trim();
    const nextParam = String(body.get('next') || '');
    const legacyAdminPass = process.env.ADMIN_PASSWORD || '';

    // Validate destination (prevent open redirects)
    let destination = '/admin';
    if (nextParam && nextParam.startsWith('/admin') && !nextParam.startsWith('//')) {
      destination = nextParam;
    }

    if (!emailOrIdentifier && !password) {
      return NextResponse.redirect(
        new URL(`/admin/login?error=missing_credentials${nextParam ? `&next=${encodeURIComponent(nextParam)}` : ''}`, request.url),
        { status: 303 }
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 1. Legacy Master Password Access
    // ─────────────────────────────────────────────────────────────────────────
    if (legacyAdminPass && (emailOrIdentifier === legacyAdminPass || password === legacyAdminPass || passwordMatches(password))) {
      const session = {
        personId: '00000000-0000-0000-0000-000000000001',
        email: 'ops@entirefm.com',
        name: 'EntireFM Operations',
        role: 'CEO' as RoleCode,
        orgId: '00000000-0000-0000-0000-000000000000',
        orgName: 'EntireFM Internal Operations',
        orgType: 'ENTIREFM' as OrgType,
        activeApplication: 'ADMIN' as ApplicationPortal,
        permissions: getRolePermissions('CEO'),
        scopes: [{ type: 'ORGANISATION' as const, id: '00000000-0000-0000-0000-000000000000' }],
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
      };

      const token = createSessionToken(session);
      const adminCookieVal = sessionToken() || token;

      console.info('[ADMIN_AUTH] Authenticated via master key: CEO Clearance', { destination });

      const response = NextResponse.redirect(new URL(destination, request.url), { status: 303 });
      
      response.cookies.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: ADMIN_SESSION_MAX_AGE,
      });
      response.cookies.set(ADMIN_COOKIE, adminCookieVal, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: ADMIN_SESSION_MAX_AGE,
      });

      return response;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. Default Bootstrap Super Admin Account
    // ─────────────────────────────────────────────────────────────────────────
    if (
      emailOrIdentifier.toLowerCase() === 'admin@entirefm.com' &&
      (password === 'EntireAdmin2014!!' || (legacyAdminPass && password === legacyAdminPass))
    ) {
      const session = {
        personId: '00000000-0000-0000-0000-000000000001',
        email: 'admin@entirefm.com',
        name: 'EntireFM Administrator',
        role: 'SUPER_ADMIN' as RoleCode,
        orgId: '00000000-0000-0000-0000-000000000000',
        orgName: 'EntireFM Headquarters',
        orgType: 'ENTIREFM' as OrgType,
        activeApplication: 'ADMIN' as ApplicationPortal,
        permissions: getRolePermissions('SUPER_ADMIN'),
        scopes: [{ type: 'ORGANISATION' as const, id: '00000000-0000-0000-0000-000000000000' }],
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
      };

      const token = createSessionToken(session);
      const adminCookieVal = sessionToken() || token;

      console.info('[ADMIN_AUTH] Authenticated via bootstrap credentials: Super Admin', { destination });

      const response = NextResponse.redirect(new URL(destination, request.url), { status: 303 });
      
      response.cookies.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: ADMIN_SESSION_MAX_AGE,
      });
      response.cookies.set(ADMIN_COOKIE, adminCookieVal, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: ADMIN_SESSION_MAX_AGE,
      });

      return response;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 3. Database EntireFM Internal Staff Lookup
    // ─────────────────────────────────────────────────────────────────────────
    const { data: identities } = await dbQuery<any[]>(
      `user_identities?email=eq.${encodeURIComponent(emailOrIdentifier)}&select=*,person:persons(*,memberships:organisation_memberships(*,role:roles(*),organisation:organisations(*),scopes:membership_scopes(*)))`
    );

    if (identities && identities.length > 0) {
      const user = identities[0];
      const adminMemberships = (user.person?.memberships || []).filter(
        (m: any) => m.status === 'ACTIVE' && (m.organisation?.org_type === 'ENTIREFM' || m.role?.code === 'SUPER_ADMIN' || m.role?.code === 'CEO' || m.role?.code === 'ADMINISTRATOR')
      );

      if (adminMemberships.length > 0) {
        const primary = adminMemberships[0];
        const roleCode = (primary.role?.code || 'ADMINISTRATOR') as RoleCode;
        const orgName = primary.organisation?.name || 'EntireFM Headquarters';
        const orgId = primary.organisation_id || '00000000-0000-0000-0000-000000000000';
        const scopes = (primary.scopes || []).map((s: any) => ({
          type: s.scope_type,
          id: s.scope_id,
        }));

        const session = {
          personId: user.person_id,
          email: user.email,
          name: `${user.person?.first_name || ''} ${user.person?.last_name || ''}`.trim() || user.email,
          role: roleCode,
          orgId,
          orgName,
          orgType: 'ENTIREFM' as OrgType,
          activeApplication: 'ADMIN' as ApplicationPortal,
          permissions: getRolePermissions(roleCode),
          scopes,
          expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
        };

        const token = createSessionToken(session);
        const adminCookieVal = sessionToken() || token;

        console.info('[ADMIN_AUTH] Authenticated via enterprise database: Internal Staff', {
          email: user.email,
          role: roleCode,
          destination,
        });

        const response = NextResponse.redirect(new URL(destination, request.url), { status: 303 });
        
        response.cookies.set(AUTH_COOKIE_NAME, token, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: ADMIN_SESSION_MAX_AGE,
        });
        response.cookies.set(ADMIN_COOKIE, adminCookieVal, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: ADMIN_SESSION_MAX_AGE,
        });

        return response;
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 4. Supabase Auth Internal Staff Sign In
    // ─────────────────────────────────────────────────────────────────────────
    const { data: authSession, error: authError } = await supabaseSignIn(emailOrIdentifier, password);
    if (!authError && authSession?.user) {
      const authUser = authSession.user;
      const userMeta = authUser.user_metadata || {};
      const isInternalStaff = userMeta.org_type === 'ENTIREFM' || userMeta.is_admin === true || emailOrIdentifier.endsWith('@entirefm.com');

      if (isInternalStaff) {
        const session = {
          personId: authUser.id,
          authUserId: authUser.id,
          email: authUser.email,
          name: `${userMeta.first_name || ''} ${userMeta.last_name || ''}`.trim() || authUser.email,
          role: (userMeta.role as RoleCode) || 'OPERATIONS_MANAGER',
          orgId: '00000000-0000-0000-0000-000000000000',
          orgName: 'EntireFM Headquarters',
          orgType: 'ENTIREFM' as OrgType,
          activeApplication: 'ADMIN' as ApplicationPortal,
          permissions: getRolePermissions((userMeta.role as RoleCode) || 'OPERATIONS_MANAGER'),
          scopes: [{ type: 'ORGANISATION' as const, id: '00000000-0000-0000-0000-000000000000' }],
          expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
        };

        const token = createSessionToken(session);
        const adminCookieVal = sessionToken() || token;

        console.info('[ADMIN_AUTH] Authenticated via Supabase Auth: Internal Staff', {
          email: authUser.email,
          destination,
        });

        const response = NextResponse.redirect(new URL(destination, request.url), { status: 303 });
        
        response.cookies.set(AUTH_COOKIE_NAME, token, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: ADMIN_SESSION_MAX_AGE,
        });
        response.cookies.set(ADMIN_COOKIE, adminCookieVal, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: ADMIN_SESSION_MAX_AGE,
        });

        return response;
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 5. Authentication Failure
    // ─────────────────────────────────────────────────────────────────────────
    console.warn('[ADMIN_AUTH] Authentication failed for identifier:', { identifier: emailOrIdentifier });
    await new Promise((r) => setTimeout(r, 600));

    const errorUrl = new URL('/admin/login', request.url);
    errorUrl.searchParams.set('error', 'invalid_credentials');
    if (nextParam) {
      errorUrl.searchParams.set('next', nextParam);
    }
    return NextResponse.redirect(errorUrl, { status: 303 });
  } catch (err: any) {
    console.error('[ADMIN_AUTH] Unexpected error in admin login:', err?.message || err);
    return NextResponse.redirect(new URL('/admin/login?error=server', request.url), { status: 303 });
  }
}
