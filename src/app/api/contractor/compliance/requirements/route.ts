import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { evaluateContractorCompliance } from '@/server/contractor/compliance-engine';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get('orgId') || session.orgId;

    // Tenant isolation: Contractor users can only query their own organisation
    if (session.orgType === 'CONTRACTOR' && !session.viewAsContext && session.orgId !== orgId) {
      return NextResponse.json({ error: 'Forbidden: Scoped organisation access only' }, { status: 403 });
    }

    if (!orgId) {
      return NextResponse.json({ error: 'Organisation ID is required' }, { status: 400 });
    }

    const summary = await evaluateContractorCompliance(orgId, session);
    return NextResponse.json(summary);
  } catch (err: any) {
    console.error('[API_COMPLIANCE_REQUIREMENTS] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
