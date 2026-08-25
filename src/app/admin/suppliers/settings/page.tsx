import React from 'react';
import { DEFAULT_COVERAGE_TARGETS } from '@/server/suppliers/gap-engine';

export const dynamic = 'force-dynamic';

export default function SupplierSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-light">
          CONFIGURATION
        </span>
        <h1 className="text-2xl font-extralight text-slate-900 mt-1">
          Coverage Targets &amp; Strategy Settings
        </h1>
        <p className="text-xs text-slate-600 font-light mt-1">
          Configure minimum required approved and preferred supplier counts across cities to drive deterministic gap detection.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden p-6 space-y-4">
        <h3 className="text-sm font-normal uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-200">
          Configured Regional Coverage Rules ({DEFAULT_COVERAGE_TARGETS.length} Targets)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10.5px]">
                <th className="py-2.5 px-3">Service</th>
                <th className="py-2.5 px-3">City / Region</th>
                <th className="py-2.5 px-3 text-center">Min Approved</th>
                <th className="py-2.5 px-3 text-center">Min Preferred</th>
                <th className="py-2.5 px-3 text-center">24/7 Emergency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DEFAULT_COVERAGE_TARGETS.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-light text-slate-900">{t.service_name}</td>
                  <td className="py-2.5 px-3 text-slate-700">{t.region_or_city}</td>
                  <td className="py-2.5 px-3 text-center font-light">{t.min_approved_suppliers}</td>
                  <td className="py-2.5 px-3 text-center">{t.min_preferred_suppliers}</td>
                  <td className="py-2.5 px-3 text-center">{t.min_emergency_24_7_suppliers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
