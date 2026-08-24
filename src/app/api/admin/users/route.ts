/**
 * ADMIN USERS API — GET /api/admin/users
 * =======================================
 * Returns all platform users visible to internal staff.
 * Requires internal EntireFM session (orgType === 'ENTIREFM').
 */
import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const session = await getCurrentSession();
  if (!session || session.orgType !== 'ENTIREFM') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  const search = url.searchParams.get('search');

  let query = `user_identities?select=id,email,last_sign_in_at,person:persons(id,first_name,last_name,status,memberships:organisation_memberships(id,status,role:roles(code,name),organisation:organisations(id,name,org_type)))&limit=200`;
  if (search) {
    query += `&email=ilike.*${encodeURIComponent(search)}*`;
  }

  const { data, error } = await dbQuery<any[]>(query);
  if (error) {
    return NextResponse.json({ error: 'Query failed', detail: error }, { status: 500 });
  }

  let users = data || [];
  if (type) {
    users = users.filter((u) =>
      (u.person?.memberships || []).some((m: any) => m.organisation?.org_type === type.toUpperCase())
    );
  }

  return NextResponse.json({ users, count: users.length });
}
