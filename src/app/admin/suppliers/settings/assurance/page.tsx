import React from 'react';
import { CANONICAL_REQUIREMENT_CATALOGUE } from '@/server/suppliers/assurance-engine';
import { Settings, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AssuranceSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-light">
          CONFIGURATION &amp; POLICY RULES
        </span>
        <h1 className="text-2xl font-extralight text-slate-900 mt-1">
          Assurance Requirement Catalogue &amp; Rule Engine
        </h1>
        <p className="text-xs text-slate-600 font-light mt-1">
          Manage canonical assurance requirements, expiry consequences, minimum insurance limits, and approval authorities.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden p-6 space-y-4">
        <h3 className="text-sm font-normal uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-200">
          Canonical Requirements ({CANONICAL_REQUIREMENT_CATALOGUE.length} Rules Active)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-normal">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10.5px]">
                <th className="py-2.5 px-3">Code</th>
                <th className="py-2.5 px-3">Title</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Evidence Type</th>
                <th className="py-2.5 px-3 text-center">Expiry Consequence</th>
                <th className="py-2.5 px-3">Authority Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {CANONICAL_REQUIREMENT_CATALOGUE.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-light text-slate-900">{req.internal_code}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-800">{req.title}</td>
                  <td className="py-2.5 px-3 text-slate-600">{req.category}</td>
                  <td className="py-2.5 px-3 text-slate-600">{req.evidence_type}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-block text-[10px] px-1.5 py-0.5 rounded font-light bg-slate-100 text-slate-800">
                      {req.consequence_on_expiry}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{req.approval_authority_role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
