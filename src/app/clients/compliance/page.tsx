/**
 * CLIENT COMPLIANCE — /clients/compliance
 * ========================================
 * Statutory compliance obligations, inspection records, and
 * certificates for the client's managed estate.
 */

import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession, requireClientSession } from '@/server/identity';
import { listComplianceObligations, listCertificates, listComplianceExceptions } from '@/server/compliance';
import { redirect } from 'next/navigation';
import { ShieldCheck, AlertTriangle, Clock, CheckCircle2, Download } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compliance | Client Portal — EntireFM',
  description: 'Statutory inspection records, certificates, and compliance status for your managed properties.',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

function statusBadge(status: string) {
  const s = status?.toUpperCase() || '';
  if (s === 'COMPLIANT') {
    return <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-normal text-emerald-400">Current</span>;
  }
  if (s === 'OVERDUE') {
    return <span className="rounded border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[10px] font-normal text-rose-400">Expired</span>;
  }
  if (s === 'DUE_SOON') {
    return <span className="rounded border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-normal text-amber-300">Due Soon</span>;
  }
  if (s === 'EXPIRING_SOON') {
    return <span className="rounded border border-orange-500/20 bg-orange-500/10 px-2 py-0.5 text-[10px] font-normal text-orange-300">Attention Required</span>;
  }
  return <span className="rounded border border-brand-edge-dark px-2 py-0.5 text-[10px] font-normal text-brand-mist/60">{status}</span>;
}

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
  const exceptions = (await listComplianceExceptions({ clientId }, session)).filter((e: any) => e.client_visible);

  const currentCount = obligations.filter((o: any) => o.status === 'COMPLIANT').length;
  const overdueCount = obligations.filter((o: any) => o.status === 'OVERDUE').length;
  const dueSoonCount = obligations.filter((o: any) => ['DUE_SOON', 'EXPIRING_SOON'].includes(o.status)).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-light text-white tracking-tight">Compliance</h1>
        <p className="mt-1 text-[13px] text-brand-mist/60">
          Statutory inspection schedules and certification records across your managed estate.
          EntireFM manages planned inspection programmes on your behalf.
        </p>
      </div>

      {/* Status Summary */}
      {obligations.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-4">
            <div className="text-[11px] font-normal uppercase text-brand-mist/50">Total Obligations</div>
            <div className="mt-1.5 text-2xl font-light text-white">{obligations.length}</div>
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="text-[11px] font-normal uppercase text-emerald-400">Current</div>
            <div className="mt-1.5 text-2xl font-light text-emerald-400">{currentCount}</div>
          </div>
          <div className={`rounded-xl border p-4 ${dueSoonCount > 0 ? 'border-amber-500/20 bg-amber-500/5' : 'border-brand-edge-dark bg-brand-carbon/40'}`}>
            <div className={`text-[11px] font-normal uppercase ${dueSoonCount > 0 ? 'text-amber-400' : 'text-brand-mist/50'}`}>Due Soon</div>
            <div className={`mt-1.5 text-2xl font-light ${dueSoonCount > 0 ? 'text-amber-400' : 'text-brand-mist/40'}`}>{dueSoonCount}</div>
          </div>
          <div className={`rounded-xl border p-4 ${overdueCount > 0 ? 'border-rose-500/20 bg-rose-500/5' : 'border-brand-edge-dark bg-brand-carbon/40'}`}>
            <div className={`text-[11px] font-normal uppercase ${overdueCount > 0 ? 'text-rose-400' : 'text-brand-mist/50'}`}>Expired</div>
            <div className={`mt-1.5 text-2xl font-light ${overdueCount > 0 ? 'text-rose-400' : 'text-brand-mist/40'}`}>{overdueCount}</div>
          </div>
        </div>
      )}

      {/* Obligation Register */}
      <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden">
        <div className="border-b border-brand-edge-dark bg-brand-void/40 px-6 py-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-electric-bright" />
          <h2 className="text-sm font-normal text-white">Statutory Obligation Register</h2>
        </div>
        {obligations.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <CheckCircle2 className="w-7 h-7 text-brand-mist/30 mx-auto mb-3" />
            <p className="text-sm text-brand-mist/60">No compliance obligations are currently configured for your estate.</p>
            <p className="text-xs text-brand-mist/40 mt-1">
              Contact your EntireFM account manager to set up your compliance programme.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="border-b border-brand-edge-dark bg-brand-void/60 text-brand-mist/60 font-medium text-[11px] uppercase">
                <tr>
                  <th className="px-6 py-3">Property</th>
                  <th className="px-6 py-3">Inspection Type</th>
                  <th className="px-6 py-3">Responsible</th>
                  <th className="px-6 py-3">Next Due</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-edge-dark/30 text-brand-mist">
                {obligations.map((ob: any) => (
                  <tr key={ob.id} className="hover:bg-brand-void/30 transition-colors">
                    <td className="px-6 py-3.5 font-normal text-white">
                      {ob.site?.name || 'Estate Site'}
                      {ob.asset?.name && (
                        <div className="text-[11px] text-brand-mist/50 mt-0.5">{ob.asset.name}</div>
                      )}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="text-white">{ob.rule_version?.rule?.title || ob.title || 'Statutory Inspection'}</div>
                      {ob.rule_version?.rule?.code && (
                        <div className="font-normal text-[11px] text-brand-mist/40 mt-0.5">{ob.rule_version.rule.code}</div>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-brand-mist/70">
                      {ob.responsible_party === 'CLIENT' ? 'Client' : 'EntireFM'}
                    </td>
                    <td className="px-6 py-3.5 font-normal text-[12px] text-white">
                      {ob.next_due_at
                        ? new Date(ob.next_due_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                    </td>
                    <td className="px-6 py-3.5">{statusBadge(ob.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Certificates */}
      {certs.length > 0 && (
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden">
          <div className="border-b border-brand-edge-dark bg-brand-void/40 px-6 py-4">
            <h2 className="text-sm font-normal text-white">Certificates & Inspection Records</h2>
            <p className="text-[12px] text-brand-mist/50 mt-0.5">Certificates filed by EntireFM on completion of statutory inspections.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="border-b border-brand-edge-dark bg-brand-void/60 text-brand-mist/60 font-medium text-[11px] uppercase">
                <tr>
                  <th className="px-6 py-3">Certificate Type</th>
                  <th className="px-6 py-3">Property</th>
                  <th className="px-6 py-3">Issued</th>
                  <th className="px-6 py-3">Expiry</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-edge-dark/30 text-brand-mist">
                {certs.filter((c: any) => c.client_visible !== false).map((cert: any) => (
                  <tr key={cert.id} className="hover:bg-brand-void/30 transition-colors">
                    <td className="px-6 py-3.5 font-normal text-white">{cert.certificate_type || 'Certificate'}</td>
                    <td className="px-6 py-3.5 text-brand-mist/70">{cert.site?.name || '—'}</td>
                    <td className="px-6 py-3.5 text-[12px]">
                      {cert.issued_date
                        ? new Date(cert.issued_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                    </td>
                    <td className="px-6 py-3.5 text-[12px]">
                      {cert.expiry_date ? (
                        <span className={new Date(cert.expiry_date) < new Date() ? 'text-rose-400' : 'text-brand-mist/70'}>
                          {new Date(cert.expiry_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`rounded border px-2 py-0.5 text-[10px] font-normal ${
                        cert.status === 'VALID'
                          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                          : cert.status === 'EXPIRED'
                          ? 'border-rose-500/20 bg-rose-500/10 text-rose-400'
                          : 'border-amber-500/20 bg-amber-500/10 text-amber-300'
                      }`}>
                        {cert.status === 'VALID' ? 'Valid' : cert.status === 'EXPIRED' ? 'Expired' : cert.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      {cert.document_url ? (
                        <a
                          href={cert.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-brand-electric hover:text-brand-electric-bright transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          View
                        </a>
                      ) : (
                        <span className="text-[11px] text-brand-mist/30">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Client-visible exceptions */}
      {exceptions.length > 0 && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 overflow-hidden">
          <div className="border-b border-amber-500/20 px-6 py-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-normal text-white">Compliance Notes</h2>
          </div>
          <div className="divide-y divide-amber-500/10">
            {exceptions.map((ex: any) => (
              <div key={ex.id} className="px-6 py-4">
                <p className="text-sm text-white font-normal">{ex.description || 'Compliance exception noted.'}</p>
                {ex.mitigation_actions && (
                  <p className="text-xs text-brand-mist/60 mt-1">{ex.mitigation_actions}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
