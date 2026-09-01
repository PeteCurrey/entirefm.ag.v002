/**
 * CONTRACTOR OPERATIONS CONTROL CENTRE — /contractor (CP-01/02/03)
 * ================================================================
 * Operational command environment for EntireFM supply chain partners.
 * Integrates real work assignments, compliance scoring, expiry alerts,
 * engineer roster, and purchase orders.
 */

import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Calendar,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Briefcase,
} from 'lucide-react';
import { evaluateContractorCompliance } from '@/server/contractor/compliance-engine';
import {
  getPersonalisedContractorIntelligence,
  evaluateCompanyWatch,
  evaluateCredentialWatch,
} from '@/server/intelligence/intelligence-engine';
import { Compass } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contractor Operations Control Centre | EntireFM',
  description: 'Supply chain operations command for work order dispatch, operative assignment, compliance tracking, and document vault.',
};

export const dynamic = 'force-dynamic';

export default async function ContractorDashboardPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login?redirect=/contractor');

  const isViewAs = !!session.viewAsContext?.isViewAs;
  if (session.orgType !== 'CONTRACTOR' && !isViewAs && session.orgType !== 'ENTIREFM') {
    if ((session.orgType as string) === 'SUPPLIER') {
      const { getSupplierUserByAuthId, getSupplierOrganisationById } = await import(
        '@/server/suppliers/supplier-auth-store'
      );
      const authUserId = session.personId || session.authUserId || '';
      const supplierUser = await getSupplierUserByAuthId(authUserId);
      const supplierOrg = supplierUser?.organisation_id
        ? await getSupplierOrganisationById(supplierUser.organisation_id)
        : null;
      const isApprovedSupplier = supplierOrg?.lifecycleStatus === 'APPROVED';

      if (!isApprovedSupplier) {
        redirect('/supplier-portal?notice=under_review');
      }
    } else {
      redirect('/login?error=forbidden_contractor');
    }
  }

  const providerOrgId = session.orgId;

  // Query real scoped data, compliance intelligence, and regulatory intelligence in parallel
  const [offersRes, acceptedRes, posRes, operativesRes, complianceSummary, intelligenceFeed, companyWatch, credentialWatch] = await Promise.all([
    dbQuery<any[]>(
      `work_assignments?provider_org_id=eq.${encodeURIComponent(providerOrgId)}&status=eq.OFFERED&select=*,work_order:work_orders(id,work_order_number,title,priority,status,site_id)&order=created_at.desc&limit=10`
    ),
    dbQuery<any[]>(
      `work_assignments?provider_org_id=eq.${encodeURIComponent(providerOrgId)}&status=in.(ACCEPTED,SCHEDULED,IN_PROGRESS)&select=*,work_order:work_orders(id,work_order_number,title,priority,status)&order=created_at.desc&limit=10`
    ),
    dbQuery<any[]>(
      `purchase_orders?supplier_org_id=eq.${encodeURIComponent(providerOrgId)}&status=in.(ISSUED,PARTIALLY_INVOICED)&select=id,po_number,total_amount_gbp,status&limit=10`
    ),
    dbQuery<any[]>(
      `persons?organisation_id=eq.${encodeURIComponent(providerOrgId)}&status=eq.ACTIVE&select=id,first_name,last_name,job_title&limit=20`
    ),
    evaluateContractorCompliance(providerOrgId, session),
    getPersonalisedContractorIntelligence(providerOrgId, session),
    evaluateCompanyWatch(providerOrgId, session),
    evaluateCredentialWatch(providerOrgId, session),
  ]);

  const newOffers = offersRes.data || [];
  const activeJobs = acceptedRes.data || [];
  const openPOs = posRes.data || [];
  const operatives = operativesRes.data || [];

  const isRestricted = complianceSummary.operationalStatus === 'RESTRICTED';

  return (
    <div className="space-y-8">
      {/* 1. Executive Header */}
      <div className="rounded-2xl border border-brand-edge-dark bg-gradient-to-r from-brand-carbon via-brand-carbon/90 to-brand-void p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-brand-electric-bright font-bold">
              ENTIREFM NETWORK &bull; {session.orgName}
            </span>
            <span
              className={`text-[11px] font-normal px-2.5 py-0.5 rounded border ${
                complianceSummary.operationalStatus === 'COMPLIANT'
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : complianceSummary.operationalStatus === 'RESTRICTED'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              }`}
            >
              {complianceSummary.operationalStatus.replace(/_/g, ' ')}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Contractor Control Centre
          </h1>
          <p className="text-sm text-brand-mist/70 max-w-xl font-light">
            Live dispatch pipeline, operative allocations, proactive compliance monitoring, and commercial purchase orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/contractor/compliance"
            className="px-4 py-3 rounded-xl border border-brand-edge-dark bg-brand-void/80 hover:bg-brand-edge-dark text-white text-xs font-normal transition-all flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-brand-electric" />
            Compliance ({complianceSummary.complianceScorePct}%)
          </Link>

          <Link
            href="/contractor/work"
            className="px-5 py-3 rounded-xl bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 transition-all flex items-center gap-2 shadow-lg shadow-brand-electric/30"
          >
            <Briefcase className="w-4 h-4" />
            Work Queue ({newOffers.length + activeJobs.length})
          </Link>
        </div>
      </div>

      {/* 1b. Restrained Onboarding Progress Checklist for Newly Approved Partners */}
      {operatives.length === 0 && (
        <div className="rounded-2xl border border-brand-electric/30 bg-brand-carbon/60 p-6 space-y-4 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-brand-electric-bright font-bold">
                PARTNER ONBOARDING ESSENTIALS
              </span>
              <h3 className="text-base font-light text-white">
                Welcome to the EntireFM Contractor Network
              </h3>
              <p className="text-xs text-brand-mist/70 font-light">
                Your supplier application has been approved. Complete these initial setup milestones to enable automated work dispatch.
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-bold px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 self-start sm:self-auto">
              ✓ Approved Partner
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <Link
              href="/contractor/workforce"
              className="p-3.5 rounded-xl border border-brand-edge-dark bg-brand-void/60 hover:border-brand-electric/50 transition-all space-y-1 block group"
            >
              <div className="flex items-center justify-between text-xs text-white font-medium">
                <span>1. Add Workforce</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-mist/50 group-hover:text-brand-electric transition-colors" />
              </div>
              <p className="text-[11px] text-brand-mist/60 font-light">
                Register engineers and assign trade qualifications.
              </p>
            </Link>

            <Link
              href="/contractor/compliance"
              className="p-3.5 rounded-xl border border-brand-edge-dark bg-brand-void/60 hover:border-brand-electric/50 transition-all space-y-1 block group"
            >
              <div className="flex items-center justify-between text-xs text-white font-medium">
                <span>2. Review Compliance</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-mist/50 group-hover:text-brand-electric transition-colors" />
              </div>
              <p className="text-[11px] text-brand-mist/60 font-light">
                Verify insurance policies and statutory certifications.
              </p>
            </Link>

            <Link
              href="/contractor/rams"
              className="p-3.5 rounded-xl border border-brand-edge-dark bg-brand-void/60 hover:border-brand-electric/50 transition-all space-y-1 block group"
            >
              <div className="flex items-center justify-between text-xs text-white font-medium">
                <span>3. RAMS &amp; Job Packs</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-mist/50 group-hover:text-brand-electric transition-colors" />
              </div>
              <p className="text-[11px] text-brand-mist/60 font-light">
                Review safety templates and automated job packs.
              </p>
            </Link>

            <Link
              href="/contractor/intelligence"
              className="p-3.5 rounded-xl border border-brand-edge-dark bg-brand-void/60 hover:border-brand-electric/50 transition-all space-y-1 block group"
            >
              <div className="flex items-center justify-between text-xs text-white font-medium">
                <span>4. Intelligence &amp; Watch</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-mist/50 group-hover:text-brand-electric transition-colors" />
              </div>
              <p className="text-[11px] text-brand-mist/60 font-light">
                Personalised regulatory updates and trade surveillance.
              </p>
            </Link>
          </div>
        </div>
      )}

      {/* Critical Restriction Warning */}
      {isRestricted && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-5 flex items-start gap-4 shadow-lg">
          <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-rose-200">Work Dispatch Restricted</h3>
            <p className="text-xs text-rose-200/80 font-light leading-relaxed">
              Mandatory compliance controls (e.g. Public Liability insurance) have expired or require verification. Please upload valid replacement documentation in the Compliance Centre to restore work eligibility.
            </p>
            <Link
              href="/contractor/compliance"
              className="inline-block mt-2 text-xs text-rose-300 hover:text-white underline font-medium"
            >
              Resolve Compliance Actions &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Action-Oriented Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-5">
          <span className="text-[10px] font-normal text-brand-mist/50 uppercase">New Job Offers</span>
          <p className={`text-3xl font-light mt-1 ${newOffers.length > 0 ? 'text-amber-400 font-normal' : 'text-white'}`}>
            {newOffers.length}
          </p>
          <span className="text-[11px] text-brand-mist/40 mt-0.5 block">Requires accept/decline</span>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-5">
          <span className="text-[10px] font-normal text-brand-mist/50 uppercase">Active / In Field</span>
          <p className="text-3xl font-light text-brand-electric-bright mt-1">{activeJobs.length}</p>
          <span className="text-[11px] text-brand-mist/40 mt-0.5 block">Attending operations</span>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-5">
          <span className="text-[10px] font-normal text-brand-mist/50 uppercase">Compliance Score</span>
          <p
            className={`text-3xl font-light mt-1 ${
              complianceSummary.complianceScorePct >= 90
                ? 'text-emerald-400'
                : complianceSummary.complianceScorePct >= 70
                ? 'text-amber-400'
                : 'text-rose-400'
            }`}
          >
            {complianceSummary.complianceScorePct}%
          </p>
          <span className="text-[11px] text-brand-mist/40 mt-0.5 block">
            {complianceSummary.criticalActionsCount > 0 ? `${complianceSummary.criticalActionsCount} critical actions` : 'Controls validated'}
          </span>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-5">
          <span className="text-[10px] font-normal text-brand-mist/50 uppercase">Field Engineers</span>
          <p className="text-3xl font-light text-cyan-400 mt-1">{operatives.length}</p>
          <span className="text-[11px] text-brand-mist/40 mt-0.5 block">Registered operatives</span>
        </div>
      </div>

      {/* Compliance Actions Required Strip */}
      {complianceSummary.actions.length > 0 && (
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-brand-edge-dark/60 pb-3">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h2 className="text-sm font-semibold text-white">
                Compliance Actions Required ({complianceSummary.actions.length})
              </h2>
            </div>
            <Link href="/contractor/compliance" className="text-xs text-brand-electric-bright hover:underline">
              View Compliance Centre →
            </Link>
          </div>

          <div className="divide-y divide-brand-edge-dark/30">
            {complianceSummary.actions.slice(0, 3).map((act) => (
              <div key={act.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        act.priority === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {act.priority}
                    </span>
                    <span className="text-sm font-normal text-white">{act.title}</span>
                  </div>
                  <p className="text-xs text-brand-mist/60 font-light mt-0.5">{act.reason}</p>
                </div>
                <Link
                  href="/contractor/compliance"
                  className="px-3 py-1.5 rounded-lg bg-brand-void border border-brand-edge-dark text-xs text-brand-mist hover:text-white hover:border-brand-electric transition-colors shrink-0 self-start sm:self-auto"
                >
                  {act.resolutionCta} &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CP-09 Intelligence & Compliance Watch Widget */}
      <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-brand-edge-dark/60 pb-3">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-brand-electric-bright" />
            <div>
              <h2 className="text-sm font-semibold text-white">
                Intelligence & Live Compliance Watch
              </h2>
              <span className="text-[11px] text-brand-mist/50">Personalised statutory and trade intelligence</span>
            </div>
          </div>
          <Link href="/contractor/intelligence" className="text-xs text-brand-electric-bright hover:underline font-normal">
            Open Intelligence Centre →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-brand-void/60 border border-brand-edge-dark/40 rounded-lg p-3.5">
            <span className="text-[10px] font-normal text-brand-mist/50 uppercase">Pending Updates</span>
            <p className="text-2xl font-light text-white mt-1">{intelligenceFeed.pendingActionCount}</p>
            <span className="text-[11px] text-brand-mist/60 mt-0.5 block">
              {intelligenceFeed.unacknowledgedCriticalCount > 0
                ? `${intelligenceFeed.unacknowledgedCriticalCount} high priority`
                : 'No critical items'}
            </span>
          </div>

          <div className="bg-brand-void/60 border border-brand-edge-dark/40 rounded-lg p-3.5">
            <span className="text-[10px] font-normal text-brand-mist/50 uppercase">Company Status</span>
            <p className={`text-2xl font-light mt-1 ${companyWatch.companyStatus === 'ACTIVE' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {companyWatch.companyStatus}
            </p>
            <span className="text-[11px] text-brand-mist/60 mt-0.5 block">
              {companyWatch.accounts.overdue || companyWatch.confirmationStatement.overdue
                ? '⚠️ Filing overdue'
                : 'Companies House Good Standing'}
            </span>
          </div>

          <div className="bg-brand-void/60 border border-brand-edge-dark/40 rounded-lg p-3.5">
            <span className="text-[10px] font-normal text-brand-mist/50 uppercase">Credential Surveillance</span>
            <p className={`text-2xl font-light mt-1 ${credentialWatch.expiringWithin90DaysCount > 0 ? 'text-amber-400' : 'text-cyan-400'}`}>
              {credentialWatch.expiringWithin90DaysCount > 0 ? `${credentialWatch.expiringWithin90DaysCount} Expiring` : 'All Current'}
            </p>
            <span className="text-[11px] text-brand-mist/60 mt-0.5 block">
              {credentialWatch.organisationCredentials.length} credentials tracked
            </span>
          </div>
        </div>
      </div>

      {/* New Work Offers (Action Required) */}
      {newOffers.length > 0 && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-semibold text-white">
                New Work Order Offers ({newOffers.length})
              </h2>
            </div>
            <Link href="/contractor/work" className="text-xs text-amber-400 hover:underline">
              Accept / Decline in Work Queue →
            </Link>
          </div>

          <div className="divide-y divide-brand-edge-dark/40">
            {newOffers.map((offer) => (
              <div key={offer.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-normal text-white">{offer.work_order?.title || 'Maintenance Request'}</div>
                  <div className="text-xs font-normal text-brand-mist/50 mt-0.5">
                    {offer.work_order?.work_order_number || offer.id} &bull; Priority {offer.work_order?.priority || 'P3_MEDIUM'}
                  </div>
                </div>
                <Link
                  href="/contractor/work"
                  className="px-3 py-1.5 rounded-lg bg-brand-electric text-white text-xs font-medium hover:bg-brand-electric/80 transition-colors"
                >
                  Review Offer
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Jobs & Registered Engineers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-6">
          <div className="flex items-center justify-between border-b border-brand-edge-dark/60 pb-4">
            <div>
              <h2 className="text-base font-normal text-white">Accepted &amp; In Progress</h2>
              <p className="text-xs text-brand-mist/50 mt-0.5">Active fieldwork assignments</p>
            </div>
            <Link href="/contractor/work" className="text-xs text-brand-electric hover:underline">
              View All →
            </Link>
          </div>

          <div className="mt-4 divide-y divide-brand-edge-dark/30">
            {activeJobs.length === 0 ? (
              <div className="py-10 text-center text-xs text-brand-mist/40">
                No active jobs currently in progress.
              </div>
            ) : (
              activeJobs.slice(0, 5).map((job) => (
                <div key={job.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-normal text-white">{job.work_order?.title || 'Work Order'}</div>
                    <div className="text-xs font-normal text-brand-mist/50 mt-0.5">
                      {job.work_order?.work_order_number} &bull; {job.status}
                    </div>
                  </div>
                  <span className="rounded bg-brand-electric/10 border border-brand-electric/30 px-2 py-0.5 font-normal text-[10px] text-brand-electric-bright">
                    ACTIVE
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Registered Engineers */}
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-6">
          <div className="flex items-center justify-between border-b border-brand-edge-dark/60 pb-4">
            <div>
              <h2 className="text-base font-normal text-white">Engineer Roster</h2>
              <p className="text-xs text-brand-mist/50 mt-0.5">Operatives &amp; competencies</p>
            </div>
            <Link href="/contractor/engineers" className="text-xs text-brand-electric hover:underline">
              Manage Team →
            </Link>
          </div>

          <div className="mt-4 divide-y divide-brand-edge-dark/30">
            {operatives.length === 0 ? (
              <div className="py-10 text-center text-xs text-brand-mist/40">
                No engineers currently registered.
              </div>
            ) : (
              operatives.slice(0, 5).map((op) => (
                <div key={op.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-normal text-white">{op.first_name} {op.last_name}</div>
                    <div className="text-xs font-normal text-brand-mist/50 mt-0.5">{op.job_title || 'Field Engineer'}</div>
                  </div>
                  <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 font-normal text-[10px] text-emerald-400">
                    AUTHORISED
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
