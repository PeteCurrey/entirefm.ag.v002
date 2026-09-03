/**
 * INTERNAL TEAM MANAGEMENT API — /api/admin/team
 * ================================================
 * Manages EntireFM internal personnel (persons + organisation_memberships).
 *
 * GET  /api/admin/team  — List all internal team members with role
 * POST /api/admin/team  — Create a new internal team member
 *
 * Auth: ENTIREFM internal users only. Requires 'users:manage' permission for
 * write operations, 'users:view' for reads.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, hasPermission } from '@/server/identity';
import { dbQuery } from '@/server/db/client';

export const dynamic = 'force-dynamic';

// ── GET — List all internal team members ─────────────────────────────────────

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session || session.orgType !== 'ENTIREFM') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (!hasPermission(session, 'users:view') && !hasPermission(session, 'users:manage')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Fetch all persons with active memberships in ENTIREFM orgs
    const { data, error } = await dbQuery<any[]>(
      `organisation_memberships?select=id,status,joined_at,person:persons(id,first_name,last_name,email,phone,job_title,status,created_at),role:roles(id,code,name),organisation:organisations(id,name,org_type)&organisation.org_type=eq.ENTIREFM&order=person.last_name.asc`
    );

    if (error) {
      console.error('[TEAM_API GET]', error);
      return NextResponse.json({ success: false, error: 'Failed to retrieve team members' }, { status: 500 });
    }

    // Filter to ENTIREFM org only and include all statuses for management view
    const members = (data || [])
      .filter((m: any) => m.organisation?.org_type === 'ENTIREFM' && m.person)
      .map((m: any) => ({
        membership_id: m.id,
        membership_status: m.status,
        joined_at: m.joined_at,
        person_id: m.person.id,
        first_name: m.person.first_name,
        last_name: m.person.last_name,
        email: m.person.email,
        phone: m.person.phone || null,
        job_title: m.person.job_title || null,
        person_status: m.person.status,
        created_at: m.person.created_at,
        role_id: m.role?.id || null,
        role_code: m.role?.code || null,
        role_name: m.role?.name || null,
        organisation_id: m.organisation?.id || null,
        organisation_name: m.organisation?.name || null,
      }));

    return NextResponse.json({ success: true, members });
  } catch (error: any) {
    console.error('[TEAM_API GET]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ── POST — Create a new internal team member ──────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.orgType !== 'ENTIREFM') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (!hasPermission(session, 'users:manage')) {
      return NextResponse.json({ error: 'Insufficient permissions — users:manage required' }, { status: 403 });
    }

    const body = await request.json();
    const { first_name, last_name, email, phone, job_title, role_code, organisation_id } = body;

    // Validate required fields
    if (!first_name?.trim() || !last_name?.trim()) {
      return NextResponse.json({ success: false, error: 'First name and last name are required.' }, { status: 400 });
    }
    if (!email?.trim() || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'A valid email address is required.' }, { status: 400 });
    }
    if (!role_code?.trim()) {
      return NextResponse.json({ success: false, error: 'A role is required.' }, { status: 400 });
    }

    // Check for duplicate email
    const { data: existing } = await dbQuery<any[]>(
      `persons?email=eq.${encodeURIComponent(email.trim().toLowerCase())}&select=id`
    );
    if (existing && existing.length > 0) {
      return NextResponse.json(
        { success: false, error: 'A person with this email address already exists.' },
        { status: 409 }
      );
    }

    // Resolve role ID
    const { data: roles } = await dbQuery<any[]>(
      `roles?code=eq.${encodeURIComponent(role_code)}&select=id,code,name`
    );
    if (!roles || roles.length === 0) {
      return NextResponse.json({ success: false, error: `Unknown role: ${role_code}` }, { status: 400 });
    }
    const role = roles[0];

    // Resolve ENTIREFM organisation (use provided ID or find the primary ENTIREFM org)
    let orgId = organisation_id;
    if (!orgId) {
      const { data: orgs } = await dbQuery<any[]>(
        `organisations?org_type=eq.ENTIREFM&status=eq.ACTIVE&select=id&limit=1`
      );
      orgId = orgs?.[0]?.id;
    }
    if (!orgId) {
      return NextResponse.json(
        { success: false, error: 'No active ENTIREFM organisation found. Please contact a system administrator.' },
        { status: 500 }
      );
    }

    // Create the person record
    const { data: personData, error: personError } = await dbQuery<any[]>('persons', {
      method: 'POST',
      body: {
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        job_title: job_title?.trim() || null,
        status: 'ACTIVE',
      },
    });

    if (personError || !personData?.[0]) {
      console.error('[TEAM_API POST] Person create error:', personError);
      return NextResponse.json(
        { success: false, error: `Failed to create person record: ${personError || 'Unknown error'}` },
        { status: 500 }
      );
    }

    const person = personData[0];

    // Create the organisation membership
    const { data: membershipData, error: membershipError } = await dbQuery<any[]>(
      'organisation_memberships',
      {
        method: 'POST',
        body: {
          person_id: person.id,
          organisation_id: orgId,
          role_id: role.id,
          is_primary: true,
          status: 'ACTIVE',
        },
      }
    );

    if (membershipError || !membershipData?.[0]) {
      console.error('[TEAM_API POST] Membership create error:', membershipError);
      // Note: person was created — in production this would be wrapped in a transaction
      return NextResponse.json(
        { success: false, error: `Failed to create organisation membership: ${membershipError || 'Unknown error'}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        member: {
          person_id: person.id,
          first_name: person.first_name,
          last_name: person.last_name,
          email: person.email,
          phone: person.phone,
          job_title: person.job_title,
          person_status: person.status,
          membership_id: membershipData[0].id,
          membership_status: membershipData[0].status,
          role_code: role.code,
          role_name: role.name,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[TEAM_API POST]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
