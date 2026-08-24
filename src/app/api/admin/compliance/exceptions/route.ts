import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, requireAdminSession } from '@/server/identity';
import { listComplianceExceptions, openComplianceException } from '@/server/compliance';

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
  const state = searchParams.get('state') || undefined;
  const severity = searchParams.get('severity') || undefined;
  const siteId = searchParams.get('siteId') || undefined;

  const exceptions = await listComplianceExceptions({ state, severity, siteId }, session);
  return NextResponse.json({ success: true, exceptions });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    requireAdminSession(session);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }

  const body = await req.json();
  const res = await openComplianceException(body, session);
  return NextResponse.json(res);
}
