import React from 'react';
import { listSupplierAgreements } from '@/server/suppliers/assurance-store';
import { FileCheck, CheckCircle2, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SupplierAgreementsPage() {
  const agreements = await listSupplierAgreements();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
          CONTRACTUAL GOVERNANCE
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Supplier Agreements &amp; Code of Conduct
        </h1>
        <p className="text-xs text-slate-600 font-light mt-1">
          Binding digital execution of Master Services Agreements (MSA), NDAs, and Supplier Code of Conduct acceptances.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10.5px]">
                <th className="py-3 px-4">Agreement Type</th>
                <th className="py-3 px-4">Supplier ID</th>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4">Signatory</th>
                <th className="py-3 px-4">Signed Date</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {agreements.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-900 font-sans">{a.agreement_type.replace(/_/g, ' ')}</td>
                  <td className="py-3 px-4 text-slate-700">{a.supplier_id}</td>
                  <td className="py-3 px-4 text-slate-600">{a.version}</td>
                  <td className="py-3 px-4 text-slate-800 font-sans">{a.signatory_name || '—'} ({a.signatory_title || '—'})</td>
                  <td className="py-3 px-4 text-slate-600">{a.signed_at?.split('T')[0] || '—'}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800">
                      {a.status}
                    </span>
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
