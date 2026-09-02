/**
 * CLIENT DOCUMENTS & RECORDS — /clients/documents
 * ================================================
 * Service reports, O&M manuals, certificates, technical drawings,
 * and supporting documentation for the client's managed estate.
 * Queries the canonical `documents` table scoped to the client org.
 */

import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { listDocuments } from '@/server/documents';
import Link from 'next/link';
import { FileText, Download, FileCheck, Wrench, BookOpen, Camera, ClipboardList } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Documents & Records | Client Portal — EntireFM',
  description: 'Certificates, O&M manuals, reports, and technical documentation for your managed properties.',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

const DOC_TYPE_LABELS: Record<string, string> = {
  CERTIFICATE: 'Certificate',
  EICR: 'Electrical Certificate',
  GAS_CERTIFICATE: 'Gas Certificate',
  F_GAS: 'F-Gas Record',
  FIRE_REPORT: 'Fire Safety Report',
  WATER_HYGIENE: 'Water Hygiene Report',
  OM_MANUAL: 'O&M Manual',
  TECHNICAL_DRAWING: 'Technical Drawing & Plan',
  WARRANTY: 'Warranty',
  INSPECTION_REPORT: 'Inspection Report',
  SERVICE_RECORD: 'Service Record',
  PHOTOGRAPH: 'Photograph',
  RISK_ASSESSMENT: 'Risk Assessment',
  OTHER: 'Document',
};

function docTypeLabel(type: string): string {
  return DOC_TYPE_LABELS[type?.toUpperCase()] || type || 'Document';
}

function docIcon(type: string) {
  const t = type?.toUpperCase() || '';
  if (t.includes('CERTIFICATE') || t === 'EICR' || t === 'GAS_CERTIFICATE' || t === 'F_GAS') {
    return <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />;
  }
  if (t === 'OM_MANUAL') return <BookOpen className="w-4 h-4 text-brand-electric shrink-0" />;
  if (t === 'TECHNICAL_DRAWING') return <Wrench className="w-4 h-4 text-brand-mist/60 shrink-0" />;
  if (t === 'PHOTOGRAPH') return <Camera className="w-4 h-4 text-brand-mist/60 shrink-0" />;
  if (t === 'INSPECTION_REPORT' || t === 'SERVICE_RECORD') {
    return <ClipboardList className="w-4 h-4 text-amber-400 shrink-0" />;
  }
  return <FileText className="w-4 h-4 text-brand-mist/50 shrink-0" />;
}

export default async function ClientDocumentsPage() {
  const session = await getCurrentSession();
  if (!session) return null;

  // listDocuments enforces tenant isolation by orgId
  const docs = await listDocuments(session);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-white tracking-tight">Documents & Records</h1>
        <p className="mt-1 text-[13px] text-brand-mist/60">
          Certificates, O&amp;M manuals, inspection reports, technical drawings, and supporting documentation for {session.orgName}.
        </p>
        <p className="mt-1 text-[11.5px] text-brand-mist/40">
          Technical drawings and plans stored here have been supplied to EntireFM and are stored against your property records.
        </p>
      </div>

      {docs.length === 0 ? (
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 px-6 py-14 text-center">
          <FileText className="w-8 h-8 text-brand-mist/30 mx-auto mb-3" />
          <p className="text-sm text-brand-mist/60 font-normal">No documents have been added to your account yet.</p>
          <p className="text-xs text-brand-mist/40 mt-1">
            Documents are added by EntireFM as services are delivered. Contact your account manager for more information.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden">
          <table className="w-full text-left text-[13px]">
            <thead className="border-b border-brand-edge-dark bg-brand-void/60 text-brand-mist/60 font-medium text-[11px] uppercase">
              <tr>
                <th className="px-6 py-3">Document</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Expiry</th>
                <th className="px-6 py-3">Added</th>
                <th className="px-6 py-3 text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/30 text-brand-mist">
              {docs.map((doc) => (
                <tr key={doc.id} className="hover:bg-brand-void/30 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      {docIcon(doc.document_type)}
                      <div>
                        <div className="font-normal text-white">{doc.title}</div>
                        {doc.file_name && (
                          <div className="text-[11px] text-brand-mist/40 mt-0.5">{doc.file_name}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-brand-mist/70">
                    {docTypeLabel(doc.document_type)}
                  </td>
                  <td className="px-6 py-3.5 text-[12px]">
                    {doc.expiry_date ? (
                      <span className={
                        new Date(doc.expiry_date) < new Date()
                          ? 'text-rose-400'
                          : 'text-brand-mist/70'
                      }>
                        {new Date(doc.expiry_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    ) : (
                      <span className="text-brand-mist/30">—</span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-[12px] text-brand-mist/50">
                    {new Date(doc.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <Link
                      href={`/api/documents/download?id=${doc.id}`}
                      className="inline-flex items-center gap-1 text-[11px] text-brand-electric hover:text-brand-electric-bright transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
