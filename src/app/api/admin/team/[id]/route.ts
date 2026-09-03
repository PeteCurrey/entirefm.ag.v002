/**
 * TEAM MEMBER DETAIL API — /api/admin/team/[id]
 * ============================================
 * [id] is the person_id (UUID).
 *
 * GET   — Retrieve team member profile, organisation membership, and role
 * PATCH — Update team member profile (name, phone, job_title, status) and/or role
 *
 * Auth: ENTIREFM internal users only with 'users:manage' or 'users:view' permissions.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, hasPermission } from '@/server/identity';
import { dbQuery } from '@/server/db/client';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession();
    if (!session || session.orgType !== 'ENTIREFM') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (!hasPermission(session, 'users:view') && !hasPermission(session, 'users:manage')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing person ID' }, { status: 400 });
    }

    const { data: personData, error: personErr } = await dbQuery<any[]>(
      `persons?id=eq.${encodeURIComponent(id)}&select=*&limit=1`
    );
    if (personErr || !personData || personData.length === 0) {
      return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    }
    const person = personData[0];

    const { data: memberships } = await dbQuery<any[]>(
      `organisation_memberships?person_id=eq.${encodeURIComponent(id)}&select=id,status,joined_at,role:roles(id,code,name),organisation:organisations(id,name,org_type)&organisation.org_type=eq.ENTIREFM`
    );
    const membership = memberships?.[0] || null;

    return NextResponse.json({
      success: true,
      member: {
        person_id: person.id,
        first_name: person.first_name,
        last_name: person.last_name,
        email: person.email,
        phone: person.phone,
        job_title: person.job_title,
        person_status: person.status,
        created_at: person.created_at,
        updated_at: person.updated_at,
        membership_id: membership?.id || null,
        membership_status: membership?.status || null,
        role_id: membership?.role?.id || null,
        role_code: membership?.role?.code || null,
        role_name: membership?.role?.name || null,
        organisation_id: membership?.organisation?.id || null,
        organisation_name: membership?.organisation?.name || null,
      },
    });
  } catch (error: any) {
    console.error('[TEAM_MEMBER_GET_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getCurrentSession();
    if (!session || session.orgType !== 'ENTIREFM') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (!hasPermission(session, 'users:manage')) {
      return NextResponse.json({ error: 'Insufficient permissions — users:manage required' }, { status: 403 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing person ID' }, { status: 400 });
    }

    const body = await request.json();
    const { first_name, last_name, phone, job_title, status, role_code } = body;

    // 1. Update person table if any person fields provided
    const personUpdates: Record<string, any> = {};
    if (first_name !== undefined) personUpdates.first_name = String(first_name).trim();
    if (last_name !== undefined) personUpdates.last_name = String(last_name).trim();
    if (phone !== undefined) personUpdates.phone = phone ? String(phone).trim() : null;
    if (job_title !== undefined) personUpdates.job_title = job_title ? String(job_title).trim() : null;
    if (status !== undefined) {
      const validStatuses = ['ACTIVE', 'SUSPENDED', 'ARCHIVED'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: `Invalid status: ${status}. Must be one of ${validStatuses.join(', ')}` }, { status: 400 });
      }
      personUpdates.status = status;
    }
    personUpdates.updated_at = new Date().toISOString();

    if (Object.keys(personUpdates).length > 1) { // more than just updated_at
      const { error: updatePersonErr } = await dbQuery<any[]>(`persons?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: personUpdates,
      });
      if (updatePersonErr) {
        console.error('[TEAM_MEMBER_PATCH_PERSON_ERROR]', updatePersonErr);
        return NextResponse.json({ error: `Failed to update person: ${updatePersonErr}` }, { status: 500 });
      }
    }

    // 2. Update membership role or status if provided
    if (role_code !== undefined || status !== undefined) {
      const { data: memberships } = await dbQuery<any[]>(
        `organisation_memberships?person_id=eq.${encodeURIComponent(id)}&select=id,organisation:organisations(org_type)&organisation.org_type=eq.ENTIREFM`
      );
      const membership = memberships?.[0];

      if (membership) {
        const memUpdates: Record<string, any> = {};
        if (status !== undefined) {
          memUpdates.status = status === 'ACTIVE' ? 'ACTIVE' : 'SUSPENDED';
        }
        if (role_code !== undefined) {
          const { data: roles } = await dbQuery<any[]>(
            `roles?code=eq.${encodeURIComponent(role_code)}&select=id,code,name`
          );
          if (!roles || roles.length === 0) {
            return NextResponse.json({ error: `Unknown role: ${role_code}` }, { status: 400 });
          }
          memUpdates.role_id = roles[0].id;
        }
        memUpdates.updated_at = new Date().toISOString();

        if (Object.keys(memUpdates).length > 1) {
          const { error: updateMemErr } = await dbQuery<any[]>(
            `organisation_memberships?id=eq.${encodeURIComponent(membership.id)}`,
            {
              method: 'PATCH',
              body: memUpdates,
            }
          );
          if (updateMemErr) {
            console.error('[TEAM_MEMBER_PATCH_MEM_ERROR]', updateMemErr);
            return NextResponse.json({ error: `Failed to update membership: ${updateMemErr}` }, { status: 500 });
          }
        }
      }
    }

    // Retrieve and return fresh record
    const { data: updatedPerson } = await dbQuery<any[]>(
      `persons?id=eq.${encodeURIComponent(id)}&select=*&limit=1`
    );
    const { data: updatedMems } = await dbQuery<any[]>(
      `organisation_memberships?person_id=eq.${encodeURIComponent(id)}&select=id,status,role:roles(id,code,name),organisation:organisations(id,name,org_type)&organisation.org_type=eq.ENTIREFM`
    );
    const mem = updatedMems?.[0] || null;

    return NextResponse.json({
      success: true,
      member: {
        person_id: updatedPerson?.[0]?.id || id,
        first_name: updatedPerson?.[0]?.first_name,
        last_name: updatedPerson?.[0]?.last_name,
        email: updatedPerson?.[0]?.email,
        phone: updatedPerson?.[0]?.phone,
        job_title: updatedPerson?.[0]?.job_title,
        person_status: updatedPerson?.[0]?.status,
        membership_id: mem?.id || null,
        membership_status: mem?.status || null,
        role_id: mem?.role?.id || null,
        role_code: mem?.role?.code || null,
        role_name: mem?.role?.name || null,
      },
    });
  } catch (error: any) {
    console.error('[TEAM_MEMBER_PATCH_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
