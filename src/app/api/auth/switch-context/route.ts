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
    const targetPortal = String(body.get('portal') || '').trim().toUpperCase() as ApplicationPortal | '';
    if (!targetOrgId && !targetPortal) {
      return NextResponse.redirect(new URL('/login', request.url), { status: 303 });
    }

    // Verify user actually has an active membership for the target organization / portal
    let queryUrl = `organisation_memberships?person_id=eq.${encodeURIComponent(session.personId)}&status=eq.ACTIVE&select=*,role:roles(*),organisation:organisations(*),scopes:membership_scopes(*)`;
    if (targetOrgId) {
      queryUrl += `&organisation_id=eq.${encodeURIComponent(targetOrgId)}`;
    }

    const { data: memberships } = await dbQuery<any[]>(queryUrl);

    if (!memberships || memberships.length === 0) {
      // Audit failed context switch attempt
      await dbQuery('access_audit_logs', {
        method: 'POST',
        body: JSON.stringify({
          event_type: 'CONTEXT_SWITCH_FAILED',
          actor_person_id: session.personId,
          target_organisation_id: targetOrgId || null,
          portal: targetPortal || null,
          details_json: { reason: 'No active membership found for requested target' },
        }),
      });
      return NextResponse.redirect(new URL('/login?error=unauthorized_context', request.url), { status: 303 });
    }

    // If targetPortal was requested, find matching membership
    let targetMembership = memberships[0];
    if (targetPortal) {
      const match = memberships.find((m: any) => {
        const r = m.role?.code;
        const ot = m.organisation?.org_type;
        if (targetPortal === 'ADMIN') return ot === 'ENTIREFM' && r !== 'ENGINEER' && r !== 'CONTRACTOR_ENGINEER';
        if (targetPortal === 'ENGINEER') return r === 'ENGINEER' || r === 'CONTRACTOR_ENGINEER';
        if (targetPortal === 'CLIENT') return ot === 'CLIENT';
        if (targetPortal === 'CONTRACTOR') return ot === 'CONTRACTOR';
        return false;
      });

      if (!match) {
        // Audit failed escalation attempt (e.g. engineer requesting ADMIN)
        await dbQuery('access_audit_logs', {
          method: 'POST',
          body: JSON.stringify({
            event_type: 'CONTEXT_SWITCH_FAILED',
            actor_person_id: session.personId,
            target_organisation_id: targetOrgId || null,
            portal: targetPortal,
            details_json: { reason: `User lacks membership required for ${targetPortal} context` },
          }),
        });
        return NextResponse.redirect(new URL('/login?error=unauthorized_context', request.url), { status: 303 });
      }
      targetMembership = match;
    }

    const roleCode = (targetMembership.role?.code || 'HELPDESK_USER') as RoleCode;
    const orgType = (targetMembership.organisation?.org_type || 'CLIENT') as OrgType;
    const orgName = targetMembership.organisation?.name || 'Organisation';
    const orgId = targetMembership.organisation_id || targetOrgId;
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
      orgId,
      orgName,
      orgType,
      activeApplication,
      permissions: getRolePermissions(roleCode),
      scopes,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
    };

    // Audit successful context switch
    await dbQuery('access_audit_logs', {
      method: 'POST',
      body: JSON.stringify({
        event_type: 'CONTEXT_SWITCHED',
        actor_person_id: session.personId,
        target_organisation_id: orgId,
        portal: activeApplication,
        details_json: { fromPortal: session.activeApplication, toPortal: activeApplication, role: roleCode },
      }),
    });

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
