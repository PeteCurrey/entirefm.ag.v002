/**
 * GLOBAL COMMAND / SEARCH API — /api/search
 * =========================================
 * Fast server endpoint querying cross-entity records for Cmd+K search.
 */

import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { searchEntities } from '@/server/search';

export async function GET(request: Request) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';

  const results = await searchEntities(q);
  return NextResponse.json({ results });
}
