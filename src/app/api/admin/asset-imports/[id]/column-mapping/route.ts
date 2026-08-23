import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { proposeColumnMappings } from '@/server/ppm';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, { params: _params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  let body: any = {};
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  if (!Array.isArray(body.headers)) {
    return NextResponse.json({ error: 'headers array required' }, { status: 400 });
  }
  const result = proposeColumnMappings(body.headers as string[]);
  return NextResponse.json(result);
}
