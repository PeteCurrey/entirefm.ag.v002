import React from 'react';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { getComplianceKPIs, listComplianceExceptions, listComplianceObligations, getExpiringCertificates } from '@/server/compliance';

export const dynamic = 'force-dynamic';

export default async function ComplianceCommandPage() {
  const kpis = await getComplianceKPIs();
  const exceptions = await listComplianceExceptions();
  const obligations = await listComplianceObligations();
  const expiring = await getExpiringCertificates(30);

  const overdueObs = obligations.filter(o => o.status === 'OVERDUE');

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Assurance & Governance"
        title="Compliance Command Centre"
        description="Unified statutory oversight, rule applicability, certificate verification, exception management, and audit readiness."
        action={
          <div className="flex gap-2">
            <Link
              href="/admin/compliance/audits"
              className="rounded border border-[#E8E8E5] bg-white px-3.5 py-1.5 text-[12.5px] font-normal text-white hover:bg-white"
            >
              Audit Readiness
            </Link>
            <Link
              href="/admin/compliance/obligations"
              className="rounded bg-brand-electric px-3.5 py-1.5 text-[12.5px] font-normal text-white shadow hover:bg-brand-indigo"
            >
              View Obligations
            </Link>
          </div>
        }
      />

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
        <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-4">
          <div className="text-[11px] font-normal uppercase text-[#6D6D68]">Applicable Obligations</div>
          <div className="mt-1 text-2xl font-light text-[#111111]">{kpis.APPLICABLE_OBLIGATIONS}</div>
          <div className="mt-1 text-[11.5px] text-emerald-400 font-normal">{kpis.COMPLIANT_OBLIGATIONS} Compliant</div>
        </div>
        <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-4">
          <div className="text-[11px] font-normal uppercase text-rose-300">Overdue Obligations</div>
          <div className="mt-1 text-2xl font-light text-rose-400">{kpis.OVERDUE_OBLIGATIONS}</div>
          <div className="mt-1 text-[11.5px] text-[#6D6D68]">Requires urgent work</div>
        </div>
        <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-4">
          <div className="text-[11px] font-normal uppercase text-amber-300">Certs Expiring (30d)</div>
          <div className="mt-1 text-2xl font-light text-amber-400">{kpis.CERTIFICATES_EXPIRING_30D}</div>
          <div className="mt-1 text-[11.5px] text-[#6D6D68]">{kpis.CERTIFICATES_EXPIRED} expired</div>
        </div>
        <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-4">
          <div className="text-[11px] font-normal uppercase text-[#6D6D68]">Open Exceptions</div>
          <div className="mt-1 text-2xl font-light text-[#111111]">{kpis.OPEN_COMPLIANCE_EXCEPTIONS}</div>
          <div className="mt-1 text-[11.5px] text-rose-400 font-normal">{kpis.CRITICAL_COMPLIANCE_EXCEPTIONS} Critical</div>
        </div>
        <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-4">
          <div className="text-[11px] font-normal uppercase text-[#6D6D68]">Evidence Pending</div>
          <div className="mt-1 text-2xl font-light text-[#111111]">{kpis.EVIDENCE_PENDING}</div>
          <div className="mt-1 text-[11.5px] text-[#6D6D68] font-normal">{kpis.VALIDATION_PENDING} Review Req</div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#E8E8E5] pb-3 text-[12.5px]">
        <Link href="/admin/compliance" className="rounded px-3 py-1 font-normal bg-brand-electric/10 text-brand-electric">Command</Link>
        <Link href="/admin/compliance/obligations" className="rounded px-3 py-1 text-[#6D6D68] hover:text-white">Obligations</Link>
        <Link href="/admin/compliance/exceptions" className="rounded px-3 py-1 text-[#6D6D68] hover:text-white">Exceptions ({exceptions.length})</Link>
        <Link href="/admin/compliance/certificates" className="rounded px-3 py-1 text-[#6D6D68] hover:text-white">Certificates</Link>
        <Link href="/admin/compliance/evidence" className="rounded px-3 py-1 text-[#6D6D68] hover:text-white">Evidence Register</Link>
        <Link href="/admin/compliance/sources" className="rounded px-3 py-1 text-[#6D6D68] hover:text-white">Sources</Link>
        <Link href="/admin/compliance/rules" className="rounded px-3 py-1 text-[#6D6D68] hover:text-white">Rules</Link>
        <Link href="/admin/compliance/applicability" className="rounded px-3 py-1 text-[#6D6D68] hover:text-white">Applicability</Link>
        <Link href="/admin/compliance/audits" className="rounded px-3 py-1 text-[#6D6D68] hover:text-white">Audit Packs</Link>
        <Link href="/admin/compliance/reports" className="rounded px-3 py-1 text-[#6D6D68] hover:text-white">Reports</Link>
      </div>

      {/* Urgent Attention Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Overdue Obligations */}
        <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-3">
            <h3 className="text-[14px] font-normal text-[#111111]">Overdue Statutory Duties</h3>
            <span className="rounded bg-rose-500/10 px-2 py-0.5 font-normal text-[11px] text-rose-400">
              {overdueObs.length} Action Required
            </span>
          </div>
          {overdueObs.length === 0 ? (
            <p className="text-[12.5px] text-[#9A9A95] italic py-3">No overdue configured compliance obligations for this scope.</p>
          ) : (
            <div className="space-y-3">
              {overdueObs.slice(0, 5).map(ob => (
                <div key={ob.id} className="flex items-center justify-between rounded border border-[#E8E8E5] bg-[#FAFAF8] p-3 text-[12.5px]">
                  <div>
                    <div className="font-normal text-[#111111]">{ob.site?.name || 'Estate Site'}</div>
                    <div className="text-[11.5px] text-[#6D6D68]">{ob.asset?.name || 'Statutory System Duty'}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-normal text-[11px] text-rose-400">Due: {ob.next_due_at}</div>
                    <span className="text-[10.5px] text-[#9A9A95]">{ob.responsible_party}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Open Compliance Exceptions */}
        <div className="rounded-lg border border-[#E8E8E5] bg-white shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-3">
            <h3 className="text-[14px] font-normal text-[#111111]">Active Compliance Exceptions</h3>
            <span className="rounded bg-amber-500/10 px-2 py-0.5 font-normal text-[11px] text-amber-400">
              {exceptions.length} Open
            </span>
          </div>
          {exceptions.length === 0 ? (
            <p className="text-[12.5px] text-[#9A9A95] italic py-3">No open compliance exceptions recorded.</p>
          ) : (
            <div className="space-y-3">
              {exceptions.slice(0, 5).map(exc => (
                <div key={exc.id} className="flex items-center justify-between rounded border border-[#E8E8E5] bg-[#FAFAF8] p-3 text-[12.5px]">
                  <div>
                    <div className="font-normal text-[#111111]">{exc.site?.name || 'Estate Site'}</div>
                    <div className="text-[11.5px] text-[#6D6D68]">{exc.reason}</div>
                  </div>
                  <div className="text-right">
                    <span className={`rounded px-2 py-0.5 font-normal text-[10px]${exc.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'}`}>
                      {exc.severity}
                    </span>
                    <div className="mt-1 text-[10.5px] text-[#9A9A95] font-normal">{exc.state}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
