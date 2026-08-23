import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { listMaintenanceRequirements } from '@/server/ppm';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const requirements = await listMaintenanceRequirements({
    assetClass: searchParams.get('assetClass') || undefined,
    status: searchParams.get('status') || undefined,
  });
  return NextResponse.json({ requirements });
}
