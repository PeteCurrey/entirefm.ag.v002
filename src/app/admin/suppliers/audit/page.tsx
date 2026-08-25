import React from 'react';
import { listSupplierAuditLogs } from '@/server/suppliers/assurance-store';
import { History, ShieldCheck } from 'lucide-react';
import { CsvExportButton } from '@/components/admin/suppliers/CsvExportButton';

export const dynamic = 'force-dynamic';

export default async function ComplianceAuditLedgerPage() {
  const logs = await listSupplierAuditLogs();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-light">
            IMMUTABLE COMPLIANCE AUDIT TRAIL
          </span>
          <h1 className="text-2xl font-extralight text-slate-900 mt-1">
            Supplier Assurance Audit Ledger
          </h1>
          <p className="text-xs text-slate-600 font-light mt-1">
            Forensic logging of all approvals, compliance holds, waivers, bank changes, and risk overrides.
          </p>
        </div>

        <CsvExportButton
          data={logs.map((l) => ({
            id: l.id,
            supplier_id: l.supplier_id,
            actor: l.actor,
            action: l.action,
            entity_type: l.entity_type,
            old_value: l.old_value || '',
            new_value: l.new_value || '',
            reason: l.reason || '',
            timestamp: l.timestamp,
          }))}
          filename="entirefm-compliance-audit.csv"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10.5px]">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">Details / Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-xs font-sans">
                    No audit records logged yet.
                  </td>
                </tr>
              ) : (
                logs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 text-slate-500">{l.timestamp.replace('T', ' ').substring(0, 19)}</td>
                    <td className="py-3 px-4 font-light text-slate-900 font-sans">{l.actor}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-slate-900 text-white font-light">
                        {l.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{l.entity_type}</td>
                    <td className="py-3 px-4 text-slate-700">{l.supplier_id}</td>
                    <td className="py-3 px-4 text-slate-700 font-sans max-w-sm">{l.reason || '—'}</td>
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
