import React from 'react';
import Link from 'next/link';
import { getCurrentSession } from '@/server/identity';
import { listSupplierVaultDocuments } from '@/server/suppliers/store';
import { FileText, Upload, CheckCircle2, AlertCircle, Clock, ArrowUpRight } from 'lucide-react';

export const metadata = {
  title: 'Supplier Document Vault | EntireFM Partner Network',
  description: 'Manage verified insurance schedules, trade accreditations, and health & safety documentation.',
};

export default async function DocumentVaultPage() {
  const session = await getCurrentSession();
  const orgId = session?.orgId ?? '';
  const docs = orgId ? await listSupplierVaultDocuments(orgId) : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
            DOCUMENT VAULT &amp; COMPLIANCE REPOSITORY
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Supplier Compliance Documents
          </h1>
          <p className="text-xs text-slate-500 font-light mt-1">
            Maintain current insurance schedules, trade accreditations, and safety certifications.
          </p>
        </div>

        <button className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 self-start sm:self-auto">
          <Upload className="h-3.5 w-3.5" /> Upload Document
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        {docs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-900 text-white font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Document Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">File</th>
                  <th className="p-3.5">Expiry Date</th>
                  <th className="p-3.5">Assurance Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {docs.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900 block">{d.document_type || d.file_name}</span>
                      {d.action_required && (
                        <span className="text-[10.5px] text-amber-700 font-mono block mt-0.5">
                          &bull; {d.action_required}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-500">{d.category}</td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-600">{d.file_name} ({d.file_size_kb || 0} KB)</td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-900">{d.expiry_date || '—'}</td>
                    <td className="p-3.5">
                      {d.status === 'ACCEPTED' && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                          ACCEPTED
                        </span>
                      )}
                      {d.status === 'SUBMITTED' || d.status === 'UNDER_REVIEW' ? (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                          UNDER REVIEW
                        </span>
                      ) : null}
                      {d.status === 'REJECTED' && (
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                          ACTION REQUIRED
                        </span>
                      )}
                      {d.status === 'EXPIRING' && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                          EXPIRING SOON
                        </span>
                      )}
                      {d.status === 'EXPIRED' && (
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                          EXPIRED
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <button className="text-slate-900 font-bold hover:underline text-[11px]">
                        Replace &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-slate-500 space-y-2">
            <FileText className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-800">No documents uploaded to vault yet</p>
            <p className="text-slate-500 text-[11.5px]">Uploaded insurance policies, trade licenses, and health &amp; safety certifications will be archived and verified here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
