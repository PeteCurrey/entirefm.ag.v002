import React from 'react';
import Link from 'next/link';
import { listSupplierOrganisations } from '@/server/suppliers/store';
import { getSupplierOnboardingPlan } from '@/server/suppliers/assurance-store';
import { ShieldCheck, Clock, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';
import { CsvExportButton } from '@/components/admin/suppliers/CsvExportButton';

export const dynamic = 'force-dynamic';

export default async function OnboardingPipelinePage() {
  const suppliers = await listSupplierOrganisations();
  const plans = await Promise.all(suppliers.map((s) => getSupplierOnboardingPlan(s.id)));

  const onboardingData = suppliers.map((s, idx) => ({
    supplier: s,
    plan: plans[idx],
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-light">
            DYNAMIC RISK-BASED ONBOARDING
          </span>
          <h1 className="text-2xl font-extralight text-slate-900 mt-1">
            Supplier Onboarding Pipeline
          </h1>
          <p className="text-xs text-slate-600 font-light mt-1">
            Real-time tracking of dynamic assurance plans, evidence submission progress, and review completion.
          </p>
        </div>

        <CsvExportButton
          data={onboardingData.map((d) => ({
            id: d.supplier.id,
            name: d.supplier.legal_name,
            risk: d.supplier.risk_level,
            compliance: d.supplier.compliance_status,
            progress: `${d.plan?.completion_percentage || 0}%`,
            mandatory_total: d.plan?.total_mandatory_items || 0,
            mandatory_complete: d.plan?.completed_mandatory_items || 0,
          }))}
          filename="entirefm-onboarding-pipeline.csv"
          label="Export Pipeline CSV"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono uppercase text-[10.5px]">
                <th className="py-3 px-4">Organisation</th>
                <th className="py-3 px-4">Risk Classification</th>
                <th className="py-3 px-4">Compliance Status</th>
                <th className="py-3 px-4">Assurance Progress</th>
                <th className="py-3 px-4 text-center">Mandatory Completed</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {onboardingData.map(({ supplier, plan }) => {
                const pct = plan?.completion_percentage || 0;
                return (
                  <tr key={supplier.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <div className="font-light text-slate-900 font-sans">{supplier.legal_name}</div>
                      <span className="text-[10.5px] text-slate-400 font-mono">{supplier.headquarters_city} &middot; {supplier.services.map((s) => s.service_name).join(', ')}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block text-[10px] font-normal px-2 py-0.5 rounded ${
                        supplier.risk_level === 'CRITICAL' ? 'bg-rose-600 text-white' : supplier.risk_level === 'HIGH' ? 'bg-amber-500 text-white' : 'bg-slate-700 text-white'
                      }`}>
                        {supplier.risk_level}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded font-light ${
                        supplier.compliance_status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {supplier.compliance_status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className={`h-full ${pct === 100 ? 'bg-emerald-500' : 'bg-brand-pink'}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-slate-900 font-light">{pct}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-light text-slate-900">{plan?.completed_mandatory_items || 0}</span> / {plan?.total_mandatory_items || 0}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/suppliers/${supplier.id}`}
                        className="btn-primary text-[10.5px] py-1 px-2.5 inline-flex items-center gap-1 font-sans"
                      >
                        Assurance Profile <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
