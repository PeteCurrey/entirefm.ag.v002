import React from 'react';
import { listSupplierDocuments } from '@/server/suppliers/assurance-store';
import { FileText, Download, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { CsvExportButton } from '@/components/admin/suppliers/CsvExportButton';

export const dynamic = 'force-dynamic';

export default async function DocumentVaultPage() {
  const documents = await listSupplierDocuments();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-light">
            COMPLIANCE EVIDENCE REPOSITORY
          </span>
          <h1 className="text-2xl font-extralight text-slate-900 mt-1">
            Supplier Document Vault
          </h1>
          <p className="text-xs text-slate-600 font-light mt-1">
            Master repository of verified insurance schedules, trade accreditations, RAMS samples, and statutory certificates.
          </p>
        </div>

        <CsvExportButton
          data={documents.map((d) => ({
            id: d.id,
            supplier_id: d.supplier_id,
            document_type: d.document_type,
            file_name: d.file_name,
            version: d.version,
            document_state: d.document_state,
            review_status: d.review_status,
            expiry_date: d.expiry_date || '',
          }))}
          filename="entirefm-supplier-documents.csv"
          label="Export Documents CSV"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10.5px]">
                <th className="py-3 px-4">Document Type</th>
                <th className="py-3 px-4">File Name</th>
                <th className="py-3 px-4">Supplier ID</th>
                <th className="py-3 px-4 text-center">Version</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4 text-center">State</th>
                <th className="py-3 px-4 text-center">Review Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-xs font-sans">
                    No compliance documents uploaded yet.
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-light text-slate-900 font-sans">{doc.document_type.replace(/_/g, ' ')}</td>
                    <td className="py-3 px-4 text-slate-700">{doc.file_name}</td>
                    <td className="py-3 px-4 text-slate-600">{doc.supplier_id}</td>
                    <td className="py-3 px-4 text-center font-light">v{doc.version}</td>
                    <td className="py-3 px-4 text-slate-600">{doc.expiry_date || '—'}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded font-light ${
                        doc.document_state === 'CURRENT' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {doc.document_state}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded font-light ${
                        doc.review_status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' : doc.review_status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {doc.review_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-slate-600 hover:text-slate-900 inline-flex items-center gap-1">
                        <Download className="h-3 w-3" /> Download
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
