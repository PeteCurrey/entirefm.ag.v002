/**
 * ADMIN USER DETAIL API — /api/admin/users/[id]
 * ===============================================
 * POST: Handle account actions (suspend, activate, revoke).
 * GET: Return user detail for a single person.
 */
import { NextResponse } from 'next/server';
import { getCurrentSession, PERMISSION } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { recordAuditEvent as logAuditEvent } from '@/server/audit';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session || session.orgType !== 'ENTIREFM') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const { data, error } = await dbQuery<any[]>(
    `persons?id=eq.${encodeURIComponent(id)}&select=id,first_name,last_name,email,mobile,status,is_field_engineer,memberships:organisation_memberships(*,role:roles(*),organisation:organisations(*),scopes:membership_scopes(*))&limit=1`
  );

  if (error || !data?.length) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ user: data[0] });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session || session.orgType !== 'ENTIREFM') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!session.permissions.includes(PERMISSION.MANAGE_USERS as any)) {
    return NextResponse.json({ error: 'Insufficient permissions to manage users' }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.formData().catch(async () => {
    const j = await request.json().catch(() => ({}));
    return new Map(Object.entries(j));
  });
  const action = String(body.get('action') || '').trim();

  const statusMap: Record<string, string> = {
    suspend: 'SUSPENDED',
    activate: 'ACTIVE',
    archive: 'ARCHIVED',
  };

  if (!statusMap[action]) {
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }

  const newStatus = statusMap[action];

  // Update person status — this immediately invalidates all sessions as
  // validateLiveSession checks person.status on every request
  const { error } = await dbQuery<any[]>(
    `persons?id=eq.${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus, updated_at: new Date().toISOString() }),
    }
  );

  if (error) {
    return NextResponse.json({ error: 'Failed to update user status', detail: error }, { status: 500 });
  }

  // Audit trail
  try {
    await logAuditEvent({
      event_type: `user.${action}`,
      actor_id: session.personId,
      actor_type: 'HUMAN',
      object_type: 'persons',
      object_id: id,
      after_state: { status: newStatus },
      reason: `Admin action: ${action} by ${session.email}`,
    });
  } catch {}

  const baseUrl = new URL(request.url).origin;
  return NextResponse.redirect(new URL(`/admin/platform/users/${id}`, baseUrl), { status: 303 });
}
