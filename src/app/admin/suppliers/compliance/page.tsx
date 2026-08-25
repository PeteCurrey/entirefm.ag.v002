import React from 'react';
import Link from 'next/link';
import { listSupplierOrganisations } from '@/server/suppliers/store';
import { listComplianceHolds, listRemediationActions } from '@/server/suppliers/assurance-store';
import { ShieldAlert, ShieldCheck, AlertTriangle, Clock, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ComplianceControlCentrePage() {
  const [suppliers, holds, remediation] = await Promise.all([
    listSupplierOrganisations(),
    listComplianceHolds(),
    listRemediationActions(),
  ]);

  const activeHolds = holds.filter((h) => h.is_active);
  const openRemediation = remediation.filter((r) => r.status === 'OPEN' || r.status === 'SUPPLIER_ACTION');

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
            STATUTORY ASSURANCE &amp; AUDITABILITY
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Compliance Control Centre
          </h1>
          <p className="text-xs text-slate-600 font-light mt-1">
            Proactive monitoring of compliance holds, remediation actions, accreditation expiries, and reassessment schedules.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">APPROVED SUPPLIERS</span>
          <div className="text-2xl font-mono font-bold text-emerald-600">
            {suppliers.filter((s) => s.compliance_status === 'APPROVED').length}
          </div>
          <span className="text-[10.5px] font-mono text-slate-500">Active Work Eligible</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">ACTIVE COMPLIANCE HOLDS</span>
          <div className="text-2xl font-mono font-bold text-rose-600">{activeHolds.length}</div>
          <span className="text-[10.5px] font-mono text-slate-500">Operational Blocks</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">OPEN REMEDIATION</span>
          <div className="text-2xl font-mono font-bold text-amber-600">{openRemediation.length}</div>
          <span className="text-[10.5px] font-mono text-slate-500">Actions Pending</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">UNDER ASSURANCE REVIEW</span>
          <div className="text-2xl font-mono font-bold text-slate-900">
            {suppliers.filter((s) => s.compliance_status === 'UNDER_REVIEW').length}
          </div>
          <span className="text-[10.5px] font-mono text-slate-500">In Due Diligence</span>
        </div>
      </div>

      {/* Active Compliance Holds Table */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Active Compliance Holds &amp; Service Restrictions
          </h3>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
            {activeHolds.length} Active
          </span>
        </div>

        {activeHolds.length === 0 ? (
          <p className="py-6 text-center text-slate-500 text-xs font-light">
            No active compliance holds across the supplier network. All approved suppliers are in good standing.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10.5px]">
                  <th className="py-2.5 px-3">Supplier ID</th>
                  <th className="py-2.5 px-3">Scope</th>
                  <th className="py-2.5 px-3">Hold Reason</th>
                  <th className="py-2.5 px-3">Raised By</th>
                  <th className="py-2.5 px-3">Resolution Required</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeHolds.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-bold text-slate-900">{h.supplier_id}</td>
                    <td className="py-3 px-3">
                      <span className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-white font-bold">
                        {h.hold_scope}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-rose-700 font-semibold">{h.hold_reason}</td>
                    <td className="py-3 px-3 text-slate-600">{h.raised_by}</td>
                    <td className="py-3 px-3 text-slate-700 font-sans max-w-sm">{h.resolution_required}</td>
                    <td className="py-3 px-3 text-right">
                      <Link href={`/admin/suppliers/${h.supplier_id}`} className="btn-primary text-xs py-1 px-2.5">
                        Manage Hold &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
