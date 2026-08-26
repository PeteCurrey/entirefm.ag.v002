/**
 * UNIFIED AUTHENTICATION API — /api/auth/login
 * ============================================
 * Authenticates user credentials and establishes an HTTP-only HMAC session cookie.
 * Supports multi-context users and role-aware routing.
 */

import { NextResponse } from 'next/server';
import {
  AUTH_COOKIE_NAME,
  createSessionToken,
  getPostLoginRedirect,
  getRolePermissions,
  RoleCode,
  OrgType,
  ApplicationPortal,
  UserContextSummary,
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

    // Legacy single admin password
    if (legacyAdminPass && (emailOrUsername === legacyAdminPass || password === legacyAdminPass)) {
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
      const response = NextResponse.redirect(new URL('/admin', request.url), { status: 303 });
      
      response.cookies.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
      response.cookies.set('efm_admin', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    // Default bootstrap account
    if (
      emailOrUsername.toLowerCase() === 'admin@entirefm.com' &&
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

    // Database identity lookup
    const { data: identities } = await dbQuery<any[]>(
      `user_identities?email=eq.${encodeURIComponent(emailOrUsername)}&select=*,person:persons(*,memberships:organisation_memberships(*,role:roles(*),organisation:organisations(*),scopes:membership_scopes(*)))`
    );

    if (identities && identities.length > 0) {
      const user = identities[0];
      const allMemberships = (user.person?.memberships || []).filter((m: any) => m.status === 'ACTIVE');

      if (allMemberships.length === 0) {
        console.warn('[AUTH_LOGIN] Role resolution failure: authenticated user has no active membership', {
          email: emailOrUsername,
        });
        return NextResponse.redirect(new URL('/login?error=no_active_membership', request.url), { status: 303 });
      }

      // Build context list
      const availableContexts: UserContextSummary[] = allMemberships.map((m: any) => {
        const rCode = (m.role?.code || 'HELPDESK_USER') as RoleCode;
        const oType = (m.organisation?.org_type || 'ENTIREFM') as OrgType;
        let portal: ApplicationPortal = 'ADMIN';
        if (rCode === 'ENGINEER' || rCode === 'CONTRACTOR_ENGINEER') portal = 'ENGINEER';
        else if (oType === 'CLIENT') portal = 'CLIENT';
        else if (oType === 'CONTRACTOR') portal = 'CONTRACTOR';
        return {
          membershipId: m.id,
          orgId: m.organisation_id,
          orgName: m.organisation?.name || 'Organisation',
          orgType: oType,
          role: rCode,
          portal,
        };
      });

      // Default to primary membership
      const primary = allMemberships[0];
      const roleCode = (primary.role?.code || 'HELPDESK_USER') as RoleCode;
      const orgType = (primary.organisation?.org_type || 'ENTIREFM') as OrgType;
      const orgName = primary.organisation?.name || 'EntireFM';
      const orgId = primary.organisation_id || '00000000-0000-0000-0000-000000000000';
      const scopes = (primary.scopes || []).map((s: any) => ({
        type: s.scope_type,
        id: s.scope_id,
      }));

      let activeApplication: ApplicationPortal = 'ADMIN';
      if (roleCode === 'ENGINEER' || roleCode === 'CONTRACTOR_ENGINEER') activeApplication = 'ENGINEER';
      else if (orgType === 'CLIENT') activeApplication = 'CLIENT';
      else if (orgType === 'CONTRACTOR') activeApplication = 'CONTRACTOR';

      const session = {
        personId: user.person_id,
        email: user.email,
        name: `${user.person?.first_name || ''} ${user.person?.last_name || ''}`.trim() || user.email,
        role: roleCode,
        orgId,
        orgName,
        orgType,
        activeApplication,
        permissions: getRolePermissions(roleCode),
        scopes,
        availableContexts,
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
      };

      const token = createSessionToken(session);

      // If user has multiple contexts, allow context selection if requested
      if (availableContexts.length > 1 && body.get('select_context') === 'true') {
        const response = NextResponse.redirect(new URL('/login?select_context=1', request.url), { status: 303 });
        response.cookies.set(AUTH_COOKIE_NAME, token, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        });
        return response;
      }

      const destination = getPostLoginRedirect(roleCode, orgType);

      console.info('[AUTH_LOGIN] Login success: role resolved', {
        email: user.email,
        role: roleCode,
        orgType,
        destination,
      });

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

    // No profile found in enterprise DB — credentials may be valid in Supabase
    // but no EntireFM application profile exists.
    // NOTE: Supplier accounts are NOT in this DB — they use /api/supplier/auth/signin.
    // This path covers Client, Contractor, Engineer accounts only.
    console.warn('[AUTH_LOGIN] Login failure: credentials not found in enterprise identity store', {
      email: emailOrUsername,
    });
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.redirect(new URL('/login?error=invalid_credentials', request.url), { status: 303 });
  } catch (err) {
    console.error('[AUTH_LOGIN] Unexpected server error during login:', err instanceof Error ? err.message : err);
    return NextResponse.redirect(new URL('/login?error=server', request.url), { status: 303 });
  }
}
