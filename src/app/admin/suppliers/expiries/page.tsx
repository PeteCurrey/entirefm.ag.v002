import React from 'react';
import { listSupplierDocuments } from '@/server/suppliers/assurance-store';
import { evaluateDocumentExpiry } from '@/server/suppliers/assurance-engine';
import { Calendar, AlertTriangle, ShieldAlert } from 'lucide-react';
import { CsvExportButton } from '@/components/admin/suppliers/CsvExportButton';

export const dynamic = 'force-dynamic';

export default async function ExpiriesRadarPage() {
  const documents = await listSupplierDocuments();
  const expiringDocs = documents.filter((d) => d.expiry_date && d.document_state === 'CURRENT').map((d) => {
    const evalResult = evaluateDocumentExpiry(d);
    return { doc: d, evalResult };
  });

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
            PROACTIVE MONITORING
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Accreditation &amp; Insurance Expiry Radar
          </h1>
          <p className="text-xs text-slate-600 font-light mt-1">
            Automated tracking across 90, 60, 30, 14, and 7-day intervals to prevent compliance lapses.
          </p>
        </div>

        <CsvExportButton
          data={expiringDocs.map(({ doc, evalResult }) => ({
            supplier_id: doc.supplier_id,
            document_type: doc.document_type,
            file_name: doc.file_name,
            expiry_date: doc.expiry_date,
            days_remaining: evalResult.daysRemaining,
            state: evalResult.state,
          }))}
          filename="entirefm-expiring-compliance.csv"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10.5px]">
                <th className="py-3 px-4">Document Type</th>
                <th className="py-3 px-4">Supplier ID</th>
                <th className="py-3 px-4">Certificate #</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4 text-center">Days Remaining</th>
                <th className="py-3 px-4 text-center">Radar State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expiringDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-xs font-sans">
                    No active compliance documents expiring in the next 60 days.
                  </td>
                </tr>
              ) : (
                expiringDocs.map(({ doc, evalResult }) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900 font-sans">{doc.document_type.replace(/_/g, ' ')}</td>
                    <td className="py-3 px-4 text-slate-700">{doc.supplier_id}</td>
                    <td className="py-3 px-4 text-slate-600">{doc.certificate_number || '—'}</td>
                    <td className="py-3 px-4 text-slate-700">{doc.expiry_date}</td>
                    <td className="py-3 px-4 text-center font-bold">
                      {evalResult.daysRemaining !== null ? `${evalResult.daysRemaining} days` : '—'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded font-bold ${
                        evalResult.state === 'EXPIRED' ? 'bg-rose-600 text-white' : evalResult.state === 'EXPIRING' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {evalResult.state}
                      </span>
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
