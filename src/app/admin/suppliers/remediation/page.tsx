import React from 'react';
import { listRemediationActions } from '@/server/suppliers/assurance-store';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { CsvExportButton } from '@/components/admin/suppliers/CsvExportButton';

export const dynamic = 'force-dynamic';

export default async function RemediationTrackerPage() {
  const actions = await listRemediationActions();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-light">
            DEFICIT RECTIFICATION &amp; ESCALATION
          </span>
          <h1 className="text-2xl font-extralight text-slate-900 mt-1">
            Supplier Remediation Actions
          </h1>
          <p className="text-xs text-slate-600 font-light mt-1">
            Manage required supplier corrective actions resulting from failed audits, missing documents, or incident reviews.
          </p>
        </div>

        <CsvExportButton
          data={actions.map((a) => ({
            id: a.id,
            supplier_id: a.supplier_id,
            severity: a.severity,
            status: a.status,
            issue: a.issue_summary,
            due_date: a.due_date,
          }))}
          filename="entirefm-supplier-remediation.csv"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10.5px]">
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Supplier ID</th>
                <th className="py-3 px-4">Issue Summary</th>
                <th className="py-3 px-4">Required Remediation</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {actions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-xs font-sans">
                    No active remediation actions open.
                  </td>
                </tr>
              ) : (
                actions.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <span className={`inline-block text-[10px] font-normal px-2 py-0.5 rounded ${
                        a.severity === 'CRITICAL' ? 'bg-rose-600 text-white' : a.severity === 'HIGH' ? 'bg-amber-500 text-white' : 'bg-slate-700 text-white'
                      }`}>
                        {a.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{a.supplier_id}</td>
                    <td className="py-3 px-4 font-light text-slate-900 font-sans">{a.issue_summary}</td>
                    <td className="py-3 px-4 text-slate-600 font-sans max-w-sm">{a.detailed_remediation_required}</td>
                    <td className="py-3 px-4 text-slate-700">{a.due_date}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block text-[10px] px-2 py-0.5 rounded font-light bg-slate-100 text-slate-800">
                        {a.status}
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
