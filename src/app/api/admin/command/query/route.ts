import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, requireAdminSession, hasPermission } from '@/server/identity';
import { executeCeoQuery } from '@/server/ceo-command';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try { requireAdminSession(session); } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
  if (!hasPermission(session, 'enterprise_intelligence:view' as any)) {
    return NextResponse.json({ error: 'enterprise_intelligence:view permission required' }, { status: 403 });
  }

  let body: any;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { question, sessionContext } = body;
  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    return NextResponse.json({ error: 'question is required' }, { status: 400 });
  }
  if (question.length > 1000) {
    return NextResponse.json({ error: 'question exceeds maximum length (1000 characters)' }, { status: 400 });
  }

  try {
    const answer = await executeCeoQuery({ question: question.trim(), sessionContext, session });
    return NextResponse.json({ success: true, answer });
  } catch (err: any) {
    return NextResponse.json({ error: 'CEO Command query failed', details: err.message }, { status: 500 });
  }
}
