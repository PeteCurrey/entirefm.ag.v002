/**
 * ADMIN USERS CANONICAL DIRECTORY API — GET /api/admin/users
 * ==========================================================
 * Queries the secure admin_user_identity_directory view in PostgreSQL.
 * Provides separate Lobby Membership and Operational Identity tracking.
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
  const search = (url.searchParams.get('search') || '').trim();
  const lobbyFilter = url.searchParams.get('lobby'); // 'member' | 'non_member' | 'pending'
  const opFilter = url.searchParams.get('operational'); // 'CONTRACTOR' | 'CLIENT' | 'ENGINEER' | 'NONE'

  let query = 'admin_user_identity_directory?select=*&order=lobby_joined_at.desc.nullslast,auth_created_at.desc';

  if (search) {
    query += `&or=(email.ilike.*${encodeURIComponent(search)}*,display_name.ilike.*${encodeURIComponent(search)}*,organisation_name.ilike.*${encodeURIComponent(search)}*)`;
  }

  if (lobbyFilter === 'member') {
    query += '&is_lobby_member=eq.true';
  } else if (lobbyFilter === 'non_member') {
    query += '&is_lobby_member=eq.false';
  } else if (lobbyFilter === 'pending') {
    query += '&lobby_member_status=eq.pending_verification';
  }

  if (opFilter) {
    query += `&operational_identity_type=eq.${encodeURIComponent(opFilter.toUpperCase())}`;
  }

  const { data, error } = await dbQuery<any[]>(query);
  if (error) {
    console.error('[ADMIN_USERS_API] Query error:', error);
    return NextResponse.json({ error: 'Failed to retrieve directory', detail: error }, { status: 500 });
  }

  return NextResponse.json({ users: data || [], count: (data || []).length });
}
