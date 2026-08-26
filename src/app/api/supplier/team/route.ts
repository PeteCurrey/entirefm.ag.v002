/**
 * POST /api/supplier/team/invite
 * ===============================
 * Supplier Admin invites a colleague to their organisation.
 * Colleague authenticates with Supabase Auth and is linked to the organisation with their assigned role.
 */

import { NextResponse } from 'next/server';
import {
  inviteSupplierUser,
  getSupplierUserByAuthId,
  listSupplierUsersByOrg,
  SupplierRole,
} from '@/server/suppliers/supplier-auth-store';
import {
  AUTH_COOKIE_NAME,
  verifySessionToken,
} from '@/server/identity';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const jar = await cookies();
    const token = jar.get(AUTH_COOKIE_NAME)?.value;
    const session = verifySessionToken(token);

    if (!session || (session.orgType as string) !== 'SUPPLIER') {
      return NextResponse.json({ success: false, error: 'Authentication required.' }, { status: 401 });
    }

    const user = await getSupplierUserByAuthId(session.personId);
    if (!user || user.role !== 'SUPPLIER_ADMIN') {
      return NextResponse.json({ success: false, error: 'Only a Supplier Admin can invite team members.' }, { status: 403 });
    }

    if (!user.organisation_id) {
      return NextResponse.json({ success: false, error: 'Organisation setup must be completed before inviting team members.' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const { email, role } = body as { email: string; role: SupplierRole };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: 'A valid email address is required.' }, { status: 400 });
    }

    const validRoles: SupplierRole[] = ['SUPPLIER_ADMIN', 'OPERATIONS', 'COMPLIANCE', 'FINANCE', 'FIELD_USER', 'VIEWER'];
    const assignedRole = validRoles.includes(role) ? role : 'OPERATIONS';

    const result = await inviteSupplierUser(user.auth_user_id, user.organisation_id, email, assignedRole);

    return NextResponse.json({
      success: true,
      message: `Invitation issued for ${email} with role ${assignedRole}.`,
      invitation: result.invitation,
    });
  } catch (err: any) {
    console.error('[SUPPLIER_TEAM_INVITE] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to issue invitation.' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const jar = await cookies();
    const token = jar.get(AUTH_COOKIE_NAME)?.value;
    const session = verifySessionToken(token);

    if (!session || (session.orgType as string) !== 'SUPPLIER') {
      return NextResponse.json({ success: false, error: 'Authentication required.' }, { status: 401 });
    }

    const user = await getSupplierUserByAuthId(session.personId);
    if (!user?.organisation_id) {
      return NextResponse.json({ success: true, users: [] });
    }

    const users = await listSupplierUsersByOrg(user.organisation_id);
    return NextResponse.json({ success: true, users });
  } catch (err: any) {
    console.error('[SUPPLIER_TEAM_LIST] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to list team members.' }, { status: 500 });
  }
}
