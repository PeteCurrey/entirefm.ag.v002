/**
 * ENTIREFM XERO ATTACHMENT SERVICE
 * ==================================
 * Uploads eligible EntireCAFM documents to corresponding Xero invoice attachments.
 *
 * Eligibility rules:
 * - Invoice must already be SYNCED (xero_invoice_id required)
 * - Only explicitly eligible document types are uploaded (no automatic bulk upload)
 * - Evidence packs (PDFs) and invoice PDFs are eligible
 * - Duplicate filenames for the same invoice are silently skipped
 */

import { dbQuery } from '@/server/db/client';
import { recordAuditEvent } from '@/server/audit';
import { XeroClient } from './client';
import { getActiveConnection } from './oauth';
import { XeroAuthError, XeroApiError } from './errors';
import type { XeroAttachment } from './types';

export interface AttachmentUploadResult {
  success: boolean;
  filename: string;
  attachmentId?: string;
  skipped?: boolean;
  skipReason?: string;
  error?: string;
}

/**
 * Uploads a PDF document (as a Buffer) to a Xero invoice as an attachment.
 * Idempotent: if a file with the same name already exists, it is skipped.
 */
export async function uploadInvoiceAttachment(params: {
  cafmInvoiceId: string;
  filename: string;
  pdfBuffer: Buffer;
  xeroClient?: XeroClient;
  actorPersonId?: string;
}): Promise<AttachmentUploadResult> {
  // 1. Load CAFM invoice to get xero_invoice_id
  const { data: invoices } = await dbQuery<any[]>(
    `client_invoices?id=eq.${encodeURIComponent(params.cafmInvoiceId)}&select=id,xero_invoice_id,invoice_number&limit=1`
  );

  if (!invoices || invoices.length === 0) {
    return { success: false, filename: params.filename, error: `Invoice ${params.cafmInvoiceId} not found.` };
  }

  const invoice = invoices[0];

  if (!invoice.xero_invoice_id) {
    return {
      success: false,
      filename: params.filename,
      skipped: true,
      skipReason: 'Invoice has not been synchronised to Xero yet. Sync invoice first.',
    };
  }

  // 2. Obtain Xero client
  let client = params.xeroClient;
  if (!client) {
    const connection = await getActiveConnection();
    if (!connection) throw new XeroAuthError('No active Xero connection found.');
    client = new XeroClient(connection);
  }

  // 3. Check if attachment with same filename already exists (idempotency)
  try {
    const existingRes = await client.get<{ Attachments: XeroAttachment[] }>(
      `Invoices/${encodeURIComponent(invoice.xero_invoice_id)}/Attachments`
    );

    if (existingRes?.Attachments) {
      const alreadyExists = existingRes.Attachments.some(
        (a) => a.FileName.toLowerCase() === params.filename.toLowerCase()
      );
      if (alreadyExists) {
        return {
          success: true,
          filename: params.filename,
          skipped: true,
          skipReason: 'Attachment with this filename already exists in Xero.',
        };
      }
    }
  } catch {
    // Non-critical — proceed to upload
  }

  // 4. Upload attachment
  try {
    const uploadRes = await client.request<{ Attachments: XeroAttachment[] }>(
      `Invoices/${encodeURIComponent(invoice.xero_invoice_id)}/Attachments/${encodeURIComponent(params.filename)}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/pdf',
          'x-include-online': 'true',
        },
        body: params.pdfBuffer,
      }
    );

    const uploaded = uploadRes?.Attachments?.[0];

    await recordAuditEvent({
      event_type: 'XERO_ATTACHMENT_UPLOADED',
      actor_id: params.actorPersonId,
      actor_type: params.actorPersonId ? 'HUMAN' : 'SYSTEM',
      object_type: 'client_invoices',
      object_id: params.cafmInvoiceId,
      after_state: {
        filename: params.filename,
        xero_invoice_id: invoice.xero_invoice_id,
        attachment_id: uploaded?.AttachmentID,
      },
      is_ai: false,
    });

    return {
      success: true,
      filename: params.filename,
      attachmentId: uploaded?.AttachmentID,
    };
  } catch (err: any) {
    const safeMsg = err?.safeMessage || err?.message || 'Unknown attachment upload error.';
    console.error(`[XERO_ATTACHMENT_UPLOAD_FAILED] ${params.cafmInvoiceId}:`, safeMsg);
    return {
      success: false,
      filename: params.filename,
      error: safeMsg,
    };
  }
}
