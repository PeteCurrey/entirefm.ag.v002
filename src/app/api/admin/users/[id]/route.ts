/**
 * ADMIN USER IDENTITY DETAIL & ACTION API — /api/admin/users/[id]
 * ===============================================================
 * Supports inspecting, transitioning operational role, managing Lobby membership,
 * and auditing account status.
 */
import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session || session.orgType !== 'ENTIREFM') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id: authUserId } = await params;

  // 1. Fetch directory record
  const { data: dirRows } = await dbQuery<any[]>(
    `admin_user_identity_directory?auth_user_id=eq.${encodeURIComponent(authUserId)}&select=*`
  );

  if (!dirRows || dirRows.length === 0) {
    return NextResponse.json({ error: 'User not found in directory' }, { status: 404 });
  }

  const user = dirRows[0];

  // 2. Fetch full Lobby Member record if present
  const { data: lobbyRows } = await dbQuery<any[]>(
    `lobby_members?auth_user_id=eq.${encodeURIComponent(authUserId)}&select=*`
  );

  // 3. Fetch Operational Identity record if present
  const { data: opRows } = await dbQuery<any[]>(
    `operational_identities?auth_user_id=eq.${encodeURIComponent(authUserId)}&select=*`
  );

  // 4. Fetch Audit Log
  const { data: auditRows } = await dbQuery<any[]>(
    `user_identity_audit_log?auth_user_id=eq.${encodeURIComponent(authUserId)}&order=created_at.desc&limit=50`
  );

  return NextResponse.json({
    user,
    lobbyMember: lobbyRows?.[0] || null,
    operationalIdentity: opRows?.[0] || null,
    auditTrail: auditRows || [],
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session || session.orgType !== 'ENTIREFM') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id: authUserId } = await params;
  const body = await request.json().catch(() => ({}));
  const { action, operationalType, organisationName, organisationId, lobbyStatus } = body;

  const now = new Date().toISOString();

  // Action 1: Set / Transition Operational Identity (exclusivity enforced: exactly 1 operational role)
  if (action === 'SET_OPERATIONAL_IDENTITY') {
    if (!['CLIENT', 'ENGINEER', 'CONTRACTOR', 'NONE'].includes(operationalType)) {
      return NextResponse.json({ error: 'Invalid operational identity type.' }, { status: 400 });
    }

    if (operationalType === 'NONE') {
      // Remove operational identity
      await dbQuery(`operational_identities?auth_user_id=eq.${encodeURIComponent(authUserId)}`, {
        method: 'DELETE',
      });
      await dbQuery('user_identity_audit_log', {
        method: 'POST',
        body: {
          auth_user_id: authUserId,
          action: 'OPERATIONAL_IDENTITY_REMOVED',
          actor_id: session.personId || session.email,
          details: { previous: body.previousType },
          created_at: now,
        },
      });
    } else {
      // Upsert operational identity (auth_user_id is UNIQUE, preventing multi-operational conflict)
      const roleCode = operationalType === 'ENGINEER' ? 'ENGINEER' : `${operationalType}_ADMIN`;
      await dbQuery('operational_identities', {
        method: 'POST',
        body: {
          auth_user_id: authUserId,
          identity_type: operationalType,
          organisation_id: organisationId || null,
          organisation_name: organisationName || `${operationalType} Organisation`,
          role_code: roleCode,
          status: 'ACTIVE',
          created_at: now,
          updated_at: now,
        },
      });

      await dbQuery('user_identity_audit_log', {
        method: 'POST',
        body: {
          auth_user_id: authUserId,
          action: 'OPERATIONAL_ROLE_TRANSITION',
          actor_id: session.personId || session.email,
          details: { newType: operationalType, org: organisationName },
          created_at: now,
        },
      });
    }

    return NextResponse.json({ success: true, message: 'Operational identity updated successfully.' });
  }

  // Action 2: Update Lobby Membership Status
  if (action === 'SET_LOBBY_STATUS') {
    if (!['active', 'pending_verification', 'suspended', 'banned', 'deleted'].includes(lobbyStatus)) {
      return NextResponse.json({ error: 'Invalid lobby member status.' }, { status: 400 });
    }

    const { data: member } = await dbQuery<any[]>(
      `lobby_members?auth_user_id=eq.${encodeURIComponent(authUserId)}`
    );

    if (member && member.length > 0) {
      await dbQuery(`lobby_members?auth_user_id=eq.${encodeURIComponent(authUserId)}`, {
        method: 'PATCH',
        body: {
          member_status: lobbyStatus,
          email_verified_at: lobbyStatus === 'active' ? now : undefined,
          updated_at: now,
        },
      });

      await dbQuery('user_identity_audit_log', {
        method: 'POST',
        body: {
          auth_user_id: authUserId,
          action: 'LOBBY_STATUS_CHANGED',
          actor_id: session.personId || session.email,
          details: { newStatus: lobbyStatus },
          created_at: now,
        },
      });

      return NextResponse.json({ success: true, message: 'Lobby status updated successfully.' });
    } else {
      return NextResponse.json({ error: 'User is not registered as a Lobby Member.' }, { status: 404 });
    }
  }

  return NextResponse.json({ error: 'Unrecognized action.' }, { status: 400 });
}
