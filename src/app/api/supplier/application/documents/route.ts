import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import {
  getOrCreateApplicationDraft,
  updateApplicationDraft,
  validateSupplierAuthUser,
  SupplierDocItem,
} from '@/server/suppliers/supplier-auth-store';
import { dbQuery, isDbConfigured } from '@/server/db/client';

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    const { searchParams } = new URL(req.url);
    const orgIdParam = searchParams.get('orgId');

    const orgId =
      orgIdParam ||
      session?.orgId ||
      (session?.personId ? (await validateSupplierAuthUser(session.personId))?.supplierUser?.organisation_id : null);

    if (!orgId) {
      return NextResponse.json({ error: 'Organisation ID is required' }, { status: 400 });
    }

    const draft = await getOrCreateApplicationDraft(orgId);
    return NextResponse.json({
      success: true,
      documents: draft?.documentVault || [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    const body = await req.json();
    const { orgId, document } = body;

    const targetOrgId =
      orgId ||
      session?.orgId ||
      (session?.personId ? (await validateSupplierAuthUser(session.personId))?.supplierUser?.organisation_id : null);

    if (!targetOrgId || !document) {
      return NextResponse.json({ error: 'Organisation ID and document payload are required' }, { status: 400 });
    }

    const draft = await getOrCreateApplicationDraft(targetOrgId);
    const currentVault: SupplierDocItem[] = draft?.documentVault || [];

    const newDoc: SupplierDocItem = {
      id: document.id || `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      category: document.category || 'MANDATORY',
      documentType: document.documentType || 'General Document',
      fileName: document.fileName || 'Uploaded_Document.pdf',
      fileSizeBytes: document.fileSizeBytes || 1024 * 250,
      fileUrl: document.fileUrl || `/vault/${targetOrgId}/${encodeURIComponent(document.fileName || 'file.pdf')}`,
      issueDate: document.issueDate,
      expiryDate: document.expiryDate,
      status: 'UPLOADED',
      uploadedBy: session?.name || session?.email || 'Supplier Administrator',
      uploadedAt: new Date().toISOString(),
      notes: document.notes || '',
    };

    // Filter out previous version of the exact same documentType if replacing
    const updatedVault = [
      ...currentVault.filter((d) => d.documentType !== newDoc.documentType),
      newDoc,
    ];

    await updateApplicationDraft(targetOrgId, {
      documentVault: updatedVault,
    });

    // Also persist into supplier_documents table if database configured
    if (isDbConfigured()) {
      await dbQuery('supplier_documents', {
        method: 'POST',
        body: {
          id: newDoc.id,
          supplier_id: targetOrgId,
          category: newDoc.category,
          document_type: newDoc.documentType,
          file_name: newDoc.fileName,
          file_size_bytes: newDoc.fileSizeBytes,
          file_url: newDoc.fileUrl,
          issue_date: newDoc.issueDate,
          expiry_date: newDoc.expiryDate,
          status: newDoc.status,
          uploaded_by: newDoc.uploadedBy,
          uploaded_at: newDoc.uploadedAt,
          notes: newDoc.notes,
        },
      });
    }

    return NextResponse.json({
      success: true,
      document: newDoc,
      documents: updatedVault,
    });
  } catch (error: any) {
    console.error('Error in document upload API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    const { searchParams } = new URL(req.url);
    const docId = searchParams.get('docId');
    const orgIdParam = searchParams.get('orgId');

    const targetOrgId =
      orgIdParam ||
      session?.orgId ||
      (session?.personId ? (await validateSupplierAuthUser(session.personId))?.supplierUser?.organisation_id : null);

    if (!targetOrgId || !docId) {
      return NextResponse.json({ error: 'Organisation ID and docId are required' }, { status: 400 });
    }

    const draft = await getOrCreateApplicationDraft(targetOrgId);
    const currentVault: SupplierDocItem[] = draft?.documentVault || [];
    const updatedVault = currentVault.filter((d) => d.id !== docId);

    await updateApplicationDraft(targetOrgId, {
      documentVault: updatedVault,
    });

    if (isDbConfigured()) {
      await dbQuery(`supplier_documents?id=eq.${encodeURIComponent(docId)}&supplier_id=eq.${encodeURIComponent(targetOrgId)}`, {
        method: 'DELETE',
      });
    }

    return NextResponse.json({
      success: true,
      documents: updatedVault,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
