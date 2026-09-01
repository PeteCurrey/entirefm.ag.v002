/**
 * API ROUTE: /api/contractor/documents/[id]/print
 * ===============================================
 * Generates branded white-label printable HTML for a contractor document.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { getContractorDocumentById, renderBrandedDocumentHtml } from '@/server/contractor/document-engine';
import { getTemplateById } from '@/server/contractor/template-library';
import { getContractorBrandProfile } from '@/server/contractor/branding-service';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const doc = await getContractorDocumentById(id, session);
    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const template = getTemplateById(doc.template_id);
    if (!template) {
      return NextResponse.json({ error: 'Template definition not found' }, { status: 404 });
    }

    const brand = await getContractorBrandProfile(doc.contractor_org_id, session);
    const html = renderBrandedDocumentHtml(doc, template, brand);

    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (err: any) {
    console.error('[DOCUMENT_PRINT_ERROR]', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
