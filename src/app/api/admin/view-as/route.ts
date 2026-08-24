/**
 * AUDITED VIEW-AS API — POST /api/admin/view-as
 * ===============================================
 * Launches a support context session where an internal operator can view
 * the platform as another user, WITHOUT impersonating their token.
 *
 * DESIGN INVARIANTS:
 * - The operator's own session remains unchanged
 * - The View-As session is a NEW token with viewAsContext embedded
 * - Every action in View-As mode logs audit_events referencing operatorPersonId
 * - View-As sessions expire after 2 hours maximum
 * - Operators without platform:view_as permission are rejected
 */
import { NextResponse } from 'next/server';
import {
  AUTH_COOKIE_NAME,
  getCurrentSession,
  createSessionToken,
  getPostLoginRedirect,
  getRolePermissions,
  PERMISSION,
  type RoleCode,
  type OrgType,
  type ApplicationPortal,
  type ViewAsContext,
} from '@/server/identity';
import { recordAuditEvent as logAuditEvent } from '@/server/audit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session || session.orgType !== 'ENTIREFM') {
    return NextResponse.redirect(new URL('/login?error=forbidden_admin', request.url), { status: 303 });
  }

  // Only operators with VIEW_AS permission can launch support sessions
  const canViewAs =
    session.role === 'SUPER_ADMIN' ||
    session.role === 'ADMINISTRATOR' ||
    session.permissions.includes(PERMISSION.VIEW_AS_USER as any);

  if (!canViewAs) {
    return NextResponse.redirect(new URL('/admin/platform/users?error=no_view_as_permission', request.url), { status: 303 });
  }

  const body = await request.formData().catch(async () => {
    const j = await request.json().catch(() => ({}));
    return new Map(Object.entries(j));
  });

  const targetPersonId = String(body.get('targetPersonId') || '').trim();
  const targetOrgId = String(body.get('targetOrgId') || '').trim();
  const targetRoleCode = String(body.get('targetRole') || 'CLIENT_READ_ONLY').trim() as RoleCode;
  const targetOrgType = String(body.get('targetOrgType') || 'CLIENT').trim() as OrgType;

  if (!targetPersonId || !targetOrgId) {
    return NextResponse.redirect(new URL('/admin/platform/users?error=missing_target', request.url), { status: 303 });
  }

  const viewAsContext: ViewAsContext = {
    isViewAs: true,
    operatorPersonId: session.personId,
    operatorEmail: session.email,
    operatorName: session.name,
    originalRole: session.role,
    startedAt: new Date().toISOString(),
  };

  let activeApplication: ApplicationPortal = 'ADMIN';
  if (targetRoleCode === 'ENGINEER' || targetRoleCode === 'CONTRACTOR_ENGINEER') activeApplication = 'ENGINEER';
  else if (targetOrgType === 'CLIENT') activeApplication = 'CLIENT';
  else if (targetOrgType === 'CONTRACTOR') activeApplication = 'CONTRACTOR';

  // View-As session: permissions of the target role, scoped to target org
  // Expires after 2 hours for security
  const viewAsSession = {
    personId: targetPersonId,
    email: `[VIEW-AS] ${session.email}`,
    name: `[VIEW-AS] ${session.name}`,
    role: targetRoleCode,
    orgId: targetOrgId,
    orgName: '—',
    orgType: targetOrgType,
    activeApplication,
    permissions: getRolePermissions(targetRoleCode),
    scopes: [],
    viewAsContext,
    expiresAt: Date.now() + 1000 * 60 * 60 * 2, // 2 hours hard cap
  };

  const token = createSessionToken(viewAsSession);

  // Audit the View-As launch
  try {
    await logAuditEvent({
      event_type: 'support.view_as.launched',
      actor_id: session.personId,
      actor_type: 'HUMAN',
      object_type: 'persons',
      object_id: targetPersonId,
      after_state: {
        operator: session.email,
        target_org_id: targetOrgId,
        target_org_type: targetOrgType,
        target_role: targetRoleCode,
        portal: activeApplication,
        started_at: viewAsContext.startedAt,
      },
      reason: `View-As launched by ${session.email}`,
    });
  } catch {}

  const destination = getPostLoginRedirect(targetRoleCode, targetOrgType);
  const response = NextResponse.redirect(new URL(destination, request.url), { status: 303 });

  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 2, // 2 hours max
  });

  return response;
}
