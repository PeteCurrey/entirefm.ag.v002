import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { content } = body;
  if (!content) {
    return NextResponse.json({ error: 'QR content required' }, { status: 400 });
  }

  // Look up in assets table
  const { data: assets } = await dbQuery<any[]>(
    `assets?or=(asset_reference.eq.${encodeURIComponent(content)},id.eq.${encodeURIComponent(content)})&select=*`
  );

  if (assets && assets.length > 0) {
    return NextResponse.json({ type: 'ASSET', entity: assets[0] });
  }

  // Look up in sites table
  const { data: sites } = await dbQuery<any[]>(
    `sites?or=(code.eq.${encodeURIComponent(content)},id.eq.${encodeURIComponent(content)})&select=*`
  );

  if (sites && sites.length > 0) {
    return NextResponse.json({ type: 'SITE', entity: sites[0] });
  }

  return NextResponse.json({ type: 'UNKNOWN', entity: null });
}
