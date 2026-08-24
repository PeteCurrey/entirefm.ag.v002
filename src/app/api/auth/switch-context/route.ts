/**
 * CONTEXT SWITCHING API — /api/auth/switch-context
 * ================================================
 * Allows authenticated multi-context users to switch between valid memberships.
 */

import { NextResponse } from 'next/server';
import {
  AUTH_COOKIE_NAME,
  getCurrentSession,
  createSessionToken,
  getPostLoginRedirect,
  getRolePermissions,
  RoleCode,
  OrgType,
  ApplicationPortal,
} from '@/server/identity';
import { dbQuery } from '@/server/db/client';

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url), { status: 303 });
    }

    const body = await request.formData().catch(async () => {
      const json = await request.json().catch(() => ({}));
      return new Map(Object.entries(json));
    });

    const targetOrgId = String(body.get('orgId') || '').trim();
    if (!targetOrgId) {
      return NextResponse.redirect(new URL('/login', request.url), { status: 303 });
    }

    // Verify user actually has an active membership for the target organization
    const { data: memberships } = await dbQuery<any[]>(
      `organisation_memberships?person_id=eq.${encodeURIComponent(session.personId)}&organisation_id=eq.${encodeURIComponent(targetOrgId)}&status=eq.ACTIVE&select=*,role:roles(*),organisation:organisations(*),scopes:membership_scopes(*)`
    );

    if (!memberships || memberships.length === 0) {
      return NextResponse.redirect(new URL('/login?error=unauthorized_context', request.url), { status: 303 });
    }

    const targetMembership = memberships[0];
    const roleCode = (targetMembership.role?.code || 'HELPDESK_USER') as RoleCode;
    const orgType = (targetMembership.organisation?.org_type || 'CLIENT') as OrgType;
    const orgName = targetMembership.organisation?.name || 'Organisation';
    const scopes = (targetMembership.scopes || []).map((s: any) => ({
      type: s.scope_type,
      id: s.scope_id,
    }));

    let activeApplication: ApplicationPortal = 'ADMIN';
    if (roleCode === 'ENGINEER' || roleCode === 'CONTRACTOR_ENGINEER') activeApplication = 'ENGINEER';
    else if (orgType === 'CLIENT') activeApplication = 'CLIENT';
    else if (orgType === 'CONTRACTOR') activeApplication = 'CONTRACTOR';

    const newSession = {
      ...session,
      role: roleCode,
      orgId: targetOrgId,
      orgName,
      orgType,
      activeApplication,
      permissions: getRolePermissions(roleCode),
      scopes,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
    };

    const token = createSessionToken(newSession);
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
  } catch (err) {
    console.error('Context switch error:', err);
    return NextResponse.redirect(new URL('/login?error=server', request.url), { status: 303 });
  }
}
