import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { CANONICAL_FORM_TEMPLATES } from '@/server/contractor/digital-forms-engine';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  return NextResponse.json({ templates: CANONICAL_FORM_TEMPLATES });
}
