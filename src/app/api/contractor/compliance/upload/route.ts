import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { saveContractorComplianceDocument } from '@/server/supply-chain';
import { classifyDocumentCategory } from '@/server/contractor/document-vault-service';
import { recordAuditEvent } from '@/server/audit';

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

  const {
    documentType,
    documentTitle,
    fileName,
    fileUrl,
    storagePath,
    fileSizeBytes,
    mimeType,
    issueDate,
    expiryDate,
    category,
    policyNumber,
    insurerOrIssuer,
    coverLimitGbp,
    notes,
  } = body;

  const title = documentTitle || fileName?.replace(/\.[^/.]+$/, '') || 'Compliance Document';
  const resolvedType = documentType || category || 'OTHER';
  const finalFileUrl = fileUrl || storagePath || `/storage/compliance/${session.orgId}/${Date.now()}_doc.pdf`;

  const orgId = session.orgId || session.personId;
  const docId = `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const resolvedCategory = category || classifyDocumentCategory(category, resolvedType);

  // 1. Persist to supplier_documents table
  const supDocRecord = {
    id: docId,
    supplier_id: orgId,
    category: resolvedCategory,
    document_type: resolvedType,
    file_name: fileName || `${title}.pdf`,
    file_size_bytes: fileSizeBytes || 102400,
    file_url: finalFileUrl,
    issue_date: issueDate || null,
    expiry_date: expiryDate || null,
    status: 'UNDER_REVIEW',
    uploaded_by: session.name || session.email,
    notes: notes || (insurerOrIssuer ? `Insurer: ${insurerOrIssuer}` : null),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  await dbQuery('supplier_documents', {
    method: 'POST',
    body: JSON.stringify(supDocRecord),
  });

  // 2. Also save to contractor_compliance_documents for complete backwards compatibility
  const legacyResult = await saveContractorComplianceDocument(
    {
      orgId,
      documentType: resolvedType,
      documentTitle: title,
      storagePath: finalFileUrl,
      fileSizeBytes,
      mimeType,
      expiryDate,
      uploadedByPersonId: session.personId,
    },
    session
  );

  // 3. Log audit record
  await recordAuditEvent({
    event_type: 'COMPLIANCE_DOCUMENT_UPLOADED',
    object_type: 'supplier_documents',
    object_id: docId,
    actor_id: session.personId,
    after_state: {
      document_type: resolvedType,
      title,
      category: resolvedCategory,
      expiry_date: expiryDate,
      status: 'UNDER_REVIEW',
    },
  });

  return NextResponse.json({
    success: true,
    id: docId,
    legacyId: legacyResult.id,
  });
}
