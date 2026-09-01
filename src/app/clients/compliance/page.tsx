import React from 'react';
import { getCurrentSession, requireClientSession } from '@/server/identity';
import { listComplianceObligations, listCertificates, listComplianceExceptions } from '@/server/compliance';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ClientCompliancePage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login');

  try {
    requireClientSession(session);
  } catch {
    redirect('/login?error=forbidden_client');
  }

  const clientId = session.orgId;
  const obligations = await listComplianceObligations({ clientId }, session);
  const certs = await listCertificates({ clientId }, session);
  const exceptions = (await listComplianceExceptions({ clientId }, session)).filter(e => e.client_visible);

  const compliantCount = obligations.filter(o => o.status === 'COMPLIANT').length;
  const overdueCount = obligations.filter(o => o.status === 'OVERDUE').length;
  const dueSoonCount = obligations.filter(o => o.status === 'DUE_SOON').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-light text-white tracking-tight">Compliance & Statutory Assurance</h1>
        <p className="mt-1 text-[13px] text-brand-mist/60">
          Statutory inspection schedules, certification register, and compliance position across your authorised estate.
        </p>
      </div>

      {/* Assurance Summary Strip */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-4">
          <div className="text-[11px] font-normal uppercase text-brand-mist/60">Total Statutory Duties</div>
          <div className="mt-1 text-2xl font-light text-white">{obligations.length}</div>
        </div>
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-4">
          <div className="text-[11px] font-normal uppercase text-emerald-400">Compliant Duties</div>
          <div className="mt-1 text-2xl font-light text-emerald-400">{compliantCount}</div>
        </div>
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-4">
          <div className="text-[11px] font-normal uppercase text-amber-300">Due Soon (30d)</div>
          <div className="mt-1 text-2xl font-light text-amber-400">{dueSoonCount}</div>
        </div>
        <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-4">
          <div className="text-[11px] font-normal uppercase text-rose-300">Overdue</div>
          <div className="mt-1 text-2xl font-light text-rose-400">{overdueCount}</div>
        </div>
      </div>

      {/* Active Obligations Table */}
      <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden">
        <div className="border-b border-brand-edge-dark bg-brand-void/40 px-6 py-4">
          <h2 className="text-sm font-normal text-white">Statutory Obligation Register</h2>
        </div>
        <table className="w-full text-left text-[13px]">
          <thead className="border-b border-brand-edge-dark bg-brand-void/60 text-brand-mist/60 font-medium text-[11px] uppercase">
            <tr>
              <th className="px-6 py-3">Site / Scope</th>
              <th className="px-6 py-3">Obligation & Standard</th>
              <th className="px-6 py-3">Duty Holder</th>
              <th className="px-6 py-3">Next Due</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-edge-dark/30 text-brand-mist">
            {obligations.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-brand-mist/40 italic">
                  No active statutory compliance obligations configured for your scope.
                </td>
              </tr>
            ) : (
              obligations.map((ob) => (
                <tr key={ob.id} className="hover:bg-brand-void/30 transition-colors">
                  <td className="px-6 py-3.5 font-normal text-white">
                    {ob.site?.name || 'Estate Site'}
                    <div className="text-[11px] text-brand-mist/50">{ob.asset?.name || 'Site-wide System'}</div>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="text-white">{ob.rule_version?.rule?.title || 'Statutory Inspection'}</div>
                    <div className="font-normal text-[11.5px] text-brand-mist/60">{ob.rule_version?.rule?.code || 'STATUTORY-001'}</div>
                  </td>
                  <td className="px-6 py-3.5 text-brand-mist/80">{ob.responsible_party || 'EntireFM'}</td>
                  <td className="px-6 py-3.5 font-normal text-[12px] text-white">{ob.next_due_at || '—'}</td>
                  <td className="px-6 py-3.5">
                    <span className={`rounded border px-2 py-0.5 font-normal text-[10px] ${
                      ob.status === 'COMPLIANT'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : ob.status === 'OVERDUE'
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                        : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                    }`}>
                      {ob.status}
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
