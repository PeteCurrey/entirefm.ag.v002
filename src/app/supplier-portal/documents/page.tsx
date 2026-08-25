import React from 'react';
import Link from 'next/link';
import { FileText, Upload, CheckCircle2, AlertCircle, Clock, ArrowUpRight } from 'lucide-react';

export const metadata = {
  title: 'Supplier Document Vault | EntireFM Partner Network',
  description: 'Manage verified insurance schedules, trade accreditations, and health & safety documentation.',
};

export default function DocumentVaultPage() {
  const docs = [
    {
      id: 'doc-01',
      name: 'Public Liability Insurance (£10m)',
      category: 'INSURANCE',
      file: 'Aviva_PL_10M_2026.pdf',
      size: '480 KB',
      expiry: '30 Apr 2027',
      status: 'ACCEPTED',
      action: null,
    },
    {
      id: 'doc-02',
      name: 'Employers Liability Insurance (£10m)',
      category: 'INSURANCE',
      file: 'Aviva_EL_10M_2026.pdf',
      size: '480 KB',
      expiry: '30 Apr 2027',
      status: 'ACCEPTED',
      action: null,
    },
    {
      id: 'doc-03',
      name: 'Gas Safe Company Registration',
      category: 'ACCREDITATION',
      file: 'GasSafe_Cert_2025.pdf',
      size: '320 KB',
      expiry: '01 Jun 2026',
      status: 'EXPIRING',
      action: 'Upload renewed certificate (45 days remaining)',
    },
    {
      id: 'doc-04',
      name: 'REFCOM Elite F-Gas Certificate',
      category: 'ACCREDITATION',
      file: 'REFCOM_Elite_2025.pdf',
      size: '290 KB',
      expiry: '01 Jan 2028',
      status: 'ACCEPTED',
      action: null,
    },
  ];

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
                    <span className="font-bold text-slate-900 block">{d.name}</span>
                    {d.action && (
                      <span className="text-[10.5px] text-amber-700 font-mono block mt-0.5">
                        &bull; {d.action}
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-500">{d.category}</td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-600">{d.file} ({d.size})</td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-900">{d.expiry}</td>
                  <td className="p-3.5">
                    {d.status === 'ACCEPTED' && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                        ACCEPTED
                      </span>
                    )}
                    {d.status === 'EXPIRING' && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                        EXPIRING SOON
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
      </div>
    </div>
  );
}
