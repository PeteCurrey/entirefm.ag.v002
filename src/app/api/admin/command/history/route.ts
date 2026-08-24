import { NextResponse } from 'next/server';
import { getCurrentSession, requireAdminSession, hasPermission } from '@/server/identity';
import { dbQuery } from '@/server/db/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try { requireAdminSession(session); } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
  if (!hasPermission(session, 'enterprise_intelligence:history_view' as any)) {
    return NextResponse.json({ error: 'enterprise_intelligence:history_view permission required' }, { status: 403 });
  }
  const { data: sessions } = await dbQuery<any[]>(
    `ceo_query_sessions?person_id=eq.${encodeURIComponent(session.personId)}&select=*,messages:ceo_query_messages(*)&order=last_message_at.desc&limit=50`
  );
  return NextResponse.json({ success: true, sessions: sessions || [] });
}
