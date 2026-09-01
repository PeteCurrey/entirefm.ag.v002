/**
 * ENTIREFM CONTRACTOR DOCUMENT BUILDER & EXPORT ENGINE
 * =====================================================
 * CRUD lifecycle, draft management, signature capture, versioning,
 * photo attachments, and custom white-label branded PDF/HTML export generator.
 */

import { dbQuery } from '@/server/db/client';
import { UserSession } from '@/server/identity';
import { recordAuditEvent } from '@/server/audit';
import { getTemplateById, BusinessTemplateDefinition } from './template-library';
import { getContractorBrandProfile, ContractorBrandProfile } from './branding-service';

export interface ContractorDocumentRecord {
  id: string;
  contractor_org_id: string;
  template_id: string;
  category: string;
  document_number: string;
  title: string;
  version: string;
  is_entirefm_job: boolean;
  work_order_id?: string;
  independent_job_id?: string;
  client_name?: string;
  site_name?: string;
  operative_name?: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'SIGNED' | 'ARCHIVED';
  form_data: Record<string, any>;
  signatures: Array<{ name: string; signature_data: string; signed_at: string; role: string }>;
  photos: Array<{ url: string; caption?: string; timestamp: string }>;
  pdf_url?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export async function listContractorDocuments(
  contractorOrgId: string,
  session: UserSession
): Promise<ContractorDocumentRecord[]> {
  const isContractor = session.orgType === 'CONTRACTOR' && !session.viewAsContext;
  if (isContractor && session.orgId !== contractorOrgId) {
    throw new Error('FORBIDDEN: Access denied to contractor document store');
  }

  const { data: docs, error } = await dbQuery<any[]>(
    `contractor_documents?contractor_org_id=eq.${encodeURIComponent(contractorOrgId)}&order=created_at.desc&limit=100`
  );

  if (error || !docs) {
    console.error('[DOCUMENTS_LIST_ERROR]', error);
    return [];
  }

  return docs;
}

export async function getContractorDocumentById(
  docId: string,
  session: UserSession
): Promise<ContractorDocumentRecord | null> {
  const { data: docs } = await dbQuery<any[]>(
    `contractor_documents?id=eq.${encodeURIComponent(docId)}`
  );

  if (!docs || docs.length === 0) return null;
  const doc = docs[0];

  const isContractor = session.orgType === 'CONTRACTOR' && !session.viewAsContext;
  if (isContractor && session.orgId !== doc.contractor_org_id) {
    throw new Error('FORBIDDEN: Document belongs to another organisation');
  }

  return doc;
}

export async function saveContractorDocument(
  payload: Partial<ContractorDocumentRecord> & {
    contractor_org_id: string;
    template_id: string;
    title: string;
  },
  session: UserSession
): Promise<{ success: boolean; document?: ContractorDocumentRecord; error?: string }> {
  const isContractor = session.orgType === 'CONTRACTOR' && !session.viewAsContext;
  if (isContractor && session.orgId !== payload.contractor_org_id) {
    return { success: false, error: 'Unauthorized to save document for another organisation' };
  }

  const template = getTemplateById(payload.template_id);
  const brand = await getContractorBrandProfile(payload.contractor_org_id, session);
  const prefix = brand.document_prefix || 'DOC-';
  const docNumber = payload.document_number || `${prefix}${Math.floor(100000 + Math.random() * 900000)}`;

  let computedVersion = payload.version || '1.0';

  // If updating an existing document that was already completed, increment revision
  if (payload.id) {
    const existing = await getContractorDocumentById(payload.id, session);
    if (existing && (existing.status === 'COMPLETED' || existing.status === 'SIGNED')) {
      const currentVerNum = parseFloat(existing.version || '1.0');
      computedVersion = isNaN(currentVerNum) ? '2.0' : (currentVerNum + 0.1).toFixed(1);
    }
  }

  const body = {
    contractor_org_id: payload.contractor_org_id,
    template_id: payload.template_id,
    category: template?.category || payload.category || 'HEALTH_SAFETY',
    document_number: docNumber,
    title: payload.title.trim(),
    version: computedVersion,
    is_entirefm_job: payload.is_entirefm_job || false,
    work_order_id: payload.work_order_id || null,
    independent_job_id: payload.independent_job_id || null,
    client_name: payload.client_name?.trim() || null,
    site_name: payload.site_name?.trim() || null,
    operative_name: payload.operative_name?.trim() || session.name,
    status: payload.status || 'DRAFT',
    form_data: payload.form_data || {},
    signatures: payload.signatures || [],
    photos: payload.photos || [],
    completed_at: payload.status === 'COMPLETED' ? new Date().toISOString() : null,
    created_by_person_id: session.personId || null,
    updated_at: new Date().toISOString(),
  };

  let queryEndpoint = 'contractor_documents';
  let method: 'POST' | 'PATCH' = 'POST';

  if (payload.id) {
    queryEndpoint = `contractor_documents?id=eq.${encodeURIComponent(payload.id)}`;
    method = 'PATCH';
  }

  const { data, error } = await dbQuery<any[]>(queryEndpoint, {
    method,
    body,
  });

  if (error) {
    console.error('[DOCUMENT_SAVE_ERROR]', error);
    return { success: false, error };
  }

  const savedDoc = data?.[0] || { ...body, id: payload.id || 'generated-id' };

  // Record audit log entry
  await recordAuditEvent({
    object_type: 'CONTRACTOR_DOCUMENT',
    object_id: savedDoc.id,
    event_type: payload.id ? 'DOCUMENT_UPDATED' : 'DOCUMENT_CREATED',
    actor_id: session.personId,
    actor_type: 'HUMAN',
    organisation_id: session.orgId,
    reason: `Document ${savedDoc.document_number} (${savedDoc.title}) saved as ${savedDoc.status} (v${savedDoc.version})`,
    after_state: {
      document_number: savedDoc.document_number,
      title: savedDoc.title,
      version: savedDoc.version,
      status: savedDoc.status,
    },
  });

  return { success: true, document: savedDoc };
}

/**
 * Generates clean, print-ready branded HTML/PDF view for a contractor document.
 * If is_entirefm_job is false, it renders white-label contractor branding ONLY.
 */
export function renderBrandedDocumentHtml(
  doc: ContractorDocumentRecord,
  template: BusinessTemplateDefinition,
  brand: ContractorBrandProfile
): string {
  const isEntireFm = doc.is_entirefm_job;

  const headerLogoHtml = isEntireFm
    ? `<div style="font-size: 20px; font-weight: 700; color: #0f172a;">ENTIRE<span style="color: #0284c7;">FM</span> <span style="font-size: 11px; font-weight: 500; color: #64748b; margin-left: 8px; text-transform: uppercase;">Partner Network Job</span></div>`
    : `<div style="font-size: 20px; font-weight: 700; color: ${brand.brand_color_secondary || '#0f172a'};">${brand.company_name}</div>
       ${brand.trading_name ? `<div style="font-size: 11px; color: #64748b;">Trading as: ${brand.trading_name}</div>` : ''}`;

  const companyContactHtml = isEntireFm
    ? `<div style="font-size: 11px; color: #64748b; text-align: right;">
         <div>EntireFM Operations Desk</div>
         <div>enquiries@entirefm.com · www.entirefm.com</div>
       </div>`
    : `<div style="font-size: 11px; color: #64748b; text-align: right;">
         ${brand.phone ? `<div>Tel: ${brand.phone}</div>` : ''}
         ${brand.email ? `<div>Email: ${brand.email}</div>` : ''}
         ${brand.website ? `<div>Web: ${brand.website}</div>` : ''}
         ${brand.vat_number ? `<div>VAT: ${brand.vat_number}</div>` : ''}
         ${brand.company_number ? `<div>Co. Reg: ${brand.company_number}</div>` : ''}
       </div>`;

  const sectionsHtml = template.sections.map((sec) => {
    const fieldsHtml = sec.fields.map((f) => {
      const val = doc.form_data[f.id] !== undefined ? doc.form_data[f.id] : '';
      const displayVal = typeof val === 'boolean' ? (val ? '✓ Yes' : '✗ No') : (val || '—');
      return `
        <div style="margin-bottom: 12px; page-break-inside: avoid;">
          <div style="font-size: 11px; font-weight: 600; color: #475569; margin-bottom: 3px;">${f.label}</div>
          <div style="font-size: 12px; color: #0f172a; background: #f8fafc; padding: 8px 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
            ${String(displayVal).replace(/\n/g, '<br/>')}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div style="margin-bottom: 24px; page-break-inside: avoid;">
        <h3 style="font-size: 14px; font-weight: 700; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
          ${sec.title}
        </h3>
        ${fieldsHtml}
      </div>
    `;
  }).join('');

  // Signatures Section
  const signaturesHtml = doc.signatures && doc.signatures.length > 0
    ? `
      <div style="margin-top: 30px; page-break-inside: avoid;">
        <h3 style="font-size: 14px; font-weight: 700; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
          Authorisation &amp; Signatures
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px;">
          ${doc.signatures.map((sig) => `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px;">
              <div style="font-size: 12px; font-weight: 700; color: #0f172a;">${sig.name}</div>
              <div style="font-size: 10.5px; color: #64748b; margin-top: 2px;">Role: ${sig.role}</div>
              <div style="font-size: 10px; color: #0284c7; margin-top: 6px; font-family: monospace;">Signed: ${new Date(sig.signed_at).toLocaleString('en-GB')}</div>
              <div style="margin-top: 8px; font-family: 'Brush Script MT', cursive, sans-serif; font-size: 18px; color: #0f172a; border-top: 1px dashed #cbd5e1; padding-top: 4px;">
                ${sig.name}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `
    : '';

  // Photos Section
  const photosHtml = doc.photos && doc.photos.length > 0
    ? `
      <div style="margin-top: 30px; page-break-inside: avoid;">
        <h3 style="font-size: 14px; font-weight: 700; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
          Worksite Photo Evidence
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px;">
          ${doc.photos.map((p) => `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px; text-align: center;">
              <div style="height: 120px; background: #e2e8f0; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #64748b; overflow: hidden;">
                ${p.url.startsWith('http') ? `<img src="${p.url}" alt="${p.caption || 'Evidence'}" style="max-height: 100%; max-width: 100%; object-fit: contain;" />` : `<span>📷 ${p.caption || 'Photo Evidence'}</span>`}
              </div>
              <div style="font-size: 11px; font-weight: 600; color: #0f172a; margin-top: 6px;">${p.caption || 'Evidence'}</div>
              <div style="font-size: 9.5px; color: #64748b;">${new Date(p.timestamp).toLocaleDateString('en-GB')}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${doc.document_number} — ${doc.title}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #ffffff; color: #0f172a; margin: 0; padding: 15mm; line-height: 1.4; }
    .header-box { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid ${brand.brand_color_primary || '#0284c7'}; padding-bottom: 16px; margin-bottom: 24px; }
    .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; background: #f1f5f9; padding: 12px 16px; border-radius: 8px; margin-bottom: 24px; font-size: 11px; }
    .footer-box { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 10.5px; color: #64748b; display: flex; justify-content: space-between; align-items: center; }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px; text-align: right;">
    <button onclick="window.print()" style="padding: 8px 18px; background: ${brand.brand_color_primary || '#0284c7'}; color: #ffffff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      Print Document (PDF)
    </button>
  </div>

  <div class="header-box">
    <div>
      ${headerLogoHtml}
      <h1 style="font-size: 18px; font-weight: 700; margin: 8px 0 0 0; color: #0f172a;">${doc.title}</h1>
      <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Doc Ref: <span style="font-weight: 600; font-family: monospace;">${doc.document_number}</span> · Status: ${doc.status}</div>
    </div>
    <div>
      ${companyContactHtml}
    </div>
  </div>

  <div class="meta-grid">
    <div><strong>Customer:</strong> ${doc.client_name || 'Direct Customer'}</div>
    <div><strong>Site Location:</strong> ${doc.site_name || 'Designated Site'}</div>
    <div><strong>Lead Operative:</strong> ${doc.operative_name || 'Competent Operative'}</div>
    <div><strong>Date:</strong> ${new Date(doc.created_at).toLocaleDateString('en-GB')}</div>
    <div><strong>Revision:</strong> v${doc.version}</div>
    <div><strong>Classification:</strong> ${template.categoryLabel}</div>
  </div>

  ${template.disclaimer ? `<div style="font-size: 10px; color: #64748b; background: #fffbeb; border: 1px solid #fef3c7; padding: 8px 12px; border-radius: 6px; margin-bottom: 20px;">ℹ️ Notice: ${template.disclaimer}</div>` : ''}

  <div class="sections-container">
    ${sectionsHtml}
  </div>

  ${signaturesHtml}
  ${photosHtml}

  <div class="footer-box">
    <div>${brand.footer_text || 'Thank you for your business.'}</div>
    <div>Generated via Contractor Business Toolkit &bull; Confidential</div>
  </div>
</body>
</html>`;
}
