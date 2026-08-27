import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, requireContractorSession } from '@/server/identity';
import { evaluateCompanyWatch } from '@/server/intelligence/intelligence-engine';

export const dynamic = 'force-dynamic';

// GET — live Companies House status for contractor's own organisation
export async function GET(_request: NextRequest) {
  const session = await getCurrentSession();
  const validSession = requireContractorSession(session);

  try {
    const record = await evaluateCompanyWatch(validSession.orgId, validSession);
    return NextResponse.json({ companyWatch: record });
  } catch (err: any) {
    if (err.message?.includes('Access denied') || err.message?.includes('Authentication')) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    return NextResponse.json({ error: err.message || 'Company watch unavailable' }, { status: 500 });
  }
}
