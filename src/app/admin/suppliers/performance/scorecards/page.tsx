import React from 'react';
import Link from 'next/link';
import { listSupplierScorecards } from '@/server/suppliers/performance-store';
import { Activity, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { CsvExportButton } from '@/components/admin/suppliers/CsvExportButton';

export const dynamic = 'force-dynamic';

export default async function ScorecardsDirectoryPage() {
  const scorecards = await listSupplierScorecards();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-light">
            SUPPLIER METRIC SCORECARDS
          </span>
          <h1 className="text-2xl font-extralight text-slate-900 mt-1">
            Supplier Performance Scorecards Directory
          </h1>
          <p className="text-xs text-slate-600 font-light mt-1">
            Traceable component scores across SLA Attendance, First-Time Fix, Attendance Reliability, and Evidence Quality.
          </p>
        </div>

        <CsvExportButton
          data={scorecards.map((s) => ({
            id: s.supplier_id,
            name: s.supplier_name,
            status: s.overall_status,
            jobs: s.total_completed_jobs,
            sla: `${s.sla_attendance_rate.value}%`,
            ftf: `${s.first_time_fix_rate.value}%`,
            evidence: `${s.evidence_acceptance_rate.value}%`,
            invoice: `${s.invoice_accuracy_rate.value}%`,
            feedback: s.client_feedback_rating.value,
          }))}
          filename="entirefm-supplier-scorecards.csv"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10.5px]">
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4 text-center">Jobs</th>
                <th className="py-3 px-4 text-center">SLA Rate</th>
                <th className="py-3 px-4 text-center">FTF Rate</th>
                <th className="py-3 px-4 text-center">Evidence Quality</th>
                <th className="py-3 px-4 text-center">Invoice Accuracy</th>
                <th className="py-3 px-4 text-center">Client Rating</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scorecards.map((s) => (
                <tr key={s.supplier_id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-light text-slate-900 font-sans">{s.supplier_name}</td>
                  <td className="py-3 px-4 text-center text-slate-700">{s.total_completed_jobs}</td>
                  <td className="py-3 px-4 text-center font-light text-emerald-700">{s.sla_attendance_rate.value}%</td>
                  <td className="py-3 px-4 text-center font-light text-slate-900">{s.first_time_fix_rate.value}%</td>
                  <td className="py-3 px-4 text-center font-light text-slate-900">{s.evidence_acceptance_rate.value}%</td>
                  <td className="py-3 px-4 text-center font-light text-slate-900">{s.invoice_accuracy_rate.value}%</td>
                  <td className="py-3 px-4 text-center font-light text-slate-900">{s.client_feedback_rating.value} / 5</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block text-[10px] px-2 py-0.5 rounded font-light ${
                      s.overall_status === 'EXCELLENT' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {s.overall_status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link href={`/admin/suppliers/${s.supplier_id}`} className="btn-primary text-[10.5px] py-1 px-2.5 font-sans">
                      Profile 360 &rarr;
                    </Link>
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
