import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, requireContractorSession } from '@/server/identity';
import {
  getPersonalisedContractorIntelligence,
  evaluateCompanyWatch,
  evaluateCredentialWatch,
  recordIntelligenceAction,
  acknowledgeIntelligenceItem,
} from '@/server/intelligence/intelligence-engine';

export const dynamic = 'force-dynamic';

// GET — personalised contractor intelligence feed (intelligence centre data)
// STRICT PRODUCT BOUNDARY: Zero tender data is returned from this endpoint.
export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  const validSession = requireContractorSession(session);

  const orgId = validSession.orgId;
  const include = request.nextUrl.searchParams.get('include') || 'feed';

  try {
    if (include === 'company-watch') {
      const record = await evaluateCompanyWatch(orgId, validSession);
      return NextResponse.json({ companyWatch: record });
    }

    if (include === 'credential-watch') {
      const summary = await evaluateCredentialWatch(orgId, validSession);
      return NextResponse.json({ credentialWatch: summary });
    }

    // Default: full personalised feed (no tenders)
    const feed = await getPersonalisedContractorIntelligence(orgId, validSession);
    return NextResponse.json({ feed });
  } catch (err: any) {
    if (err.message?.includes('Access denied') || err.message?.includes('Authentication')) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    return NextResponse.json({ error: err.message || 'Failed to load intelligence' }, { status: 500 });
  }
}

// POST — record action or acknowledgement on an intelligence item
export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  const validSession = requireContractorSession(session);

  const orgId = validSession.orgId;

  try {
    const body = await request.json();
    const { action, intelligenceItemId } = body;

    if (!intelligenceItemId) {
      return NextResponse.json({ error: 'intelligenceItemId is required' }, { status: 400 });
    }

    if (action === 'ACKNOWLEDGE') {
      const ack = await acknowledgeIntelligenceItem(orgId, validSession, intelligenceItemId);
      return NextResponse.json({ acknowledgement: ack });
    }

    // Record structured action
    const { actionType, assignedTo, dueDate, internalNote, evidenceDocumentId, linkedRequirementId, notApplicableReason } = body;
    if (!actionType) {
      return NextResponse.json({ error: 'actionType is required' }, { status: 400 });
    }

    const record = await recordIntelligenceAction(orgId, validSession, intelligenceItemId, {
      actionType,
      assignedTo,
      dueDate,
      internalNote,
      evidenceDocumentId,
      linkedRequirementId,
      notApplicableReason,
    });

    return NextResponse.json({ action: record });
  } catch (err: any) {
    if (err.message?.includes('Access denied') || err.message?.includes('Authentication')) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    return NextResponse.json({ error: err.message || 'Failed to process action' }, { status: 500 });
  }
}
