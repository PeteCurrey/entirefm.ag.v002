/**
 * API ROUTE: /api/contractor/documents
 * ====================================
 * Manages contractor business documents and form submissions.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { listContractorDocuments, saveContractorDocument } from '@/server/contractor/document-engine';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orgId = req.nextUrl.searchParams.get('org_id') || session.orgId;
    const docs = await listContractorDocuments(orgId, session);

    return NextResponse.json({ success: true, documents: docs });
  } catch (err: any) {
    console.error('[API_DOCS_GET_ERROR]', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = await saveContractorDocument(
      {
        ...body,
        contractor_org_id: body.contractor_org_id || session.orgId,
      },
      session
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to save document' }, { status: 400 });
    }

    return NextResponse.json({ success: true, document: result.document });
  } catch (err: any) {
    console.error('[API_DOCS_POST_ERROR]', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
