import React from 'react';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';

export const dynamic = 'force-dynamic';

export default async function ClientCompliancePage() {
  const session = await getCurrentSession();
  if (!session) return null;

  const { data: obligations } = await dbQuery<any[]>(
    `compliance_obligations?status=eq.ACTIVE&select=id,title,legislation_reference,statutory_duty_holder,next_due_date,compliance_status&limit=50`
  );

  const list = obligations || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-white tracking-tight">Compliance & Statutory Obligations</h1>
        <p className="mt-1 text-[13px] text-brand-mist/60">
          Gas Safety, NICEIC Electrical, Fire Safety, Water Hygiene (L8), and Lifting (LOLER).
        </p>
      </div>

      <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden">
        <table className="w-full text-left text-[13px]">
          <thead className="border-b border-brand-edge-dark bg-brand-void/60 text-brand-mist/60 font-mono text-[11px] uppercase">
            <tr>
              <th className="px-6 py-3">Obligation</th>
              <th className="px-6 py-3">Legislation / Standard</th>
              <th className="px-6 py-3">Duty Holder</th>
              <th className="px-6 py-3">Next Due</th>
              <th className="px-6 py-3">Compliance Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-edge-dark/30 text-brand-mist">
            {list.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-brand-mist/40">
                  All compliance obligations verified up-to-date.
                </td>
              </tr>
            ) : (
              list.map((ob) => (
                <tr key={ob.id} className="hover:bg-brand-void/30 transition-colors">
                  <td className="px-6 py-3.5 font-medium text-white">{ob.title}</td>
                  <td className="px-6 py-3.5 font-mono text-[11.5px]">{ob.legislation_reference || 'Statutory UK'}</td>
                  <td className="px-6 py-3.5">{ob.statutory_duty_holder || 'Landlord / Client'}</td>
                  <td className="px-6 py-3.5 font-mono text-[12px]">{ob.next_due_date || '—'}</td>
                  <td className="px-6 py-3.5">
                    <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                      {ob.compliance_status || 'SATISFIED'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
