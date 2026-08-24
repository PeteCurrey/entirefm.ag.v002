import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, requireAdminSession } from '@/server/identity';
import { listComplianceRules } from '@/server/compliance';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    requireAdminSession(session);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const sourceId = searchParams.get('sourceId') || undefined;
  const ruleFamily = searchParams.get('ruleFamily') || undefined;

  const rules = await listComplianceRules(sourceId, ruleFamily, session);
  return NextResponse.json({ success: true, rules });
}
