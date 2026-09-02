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
  Compass,
} from 'lucide-react';
import { evaluateContractorCompliance } from '@/server/contractor/compliance-engine';
import {
  getPersonalisedContractorIntelligence,
  evaluateCompanyWatch,
  evaluateCredentialWatch,
} from '@/server/intelligence/intelligence-engine';

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
      const { getSupplierUserByAuthId, getSupplierOrganisationById, getSupplierOrganisationByOwnerId } = await import(
        '@/server/suppliers/supplier-auth-store'
      );
      const authUserId = session.personId || session.authUserId || '';
      let supplierUser = await getSupplierUserByAuthId(authUserId);
      let supplierOrg = supplierUser?.organisation_id
        ? await getSupplierOrganisationById(supplierUser.organisation_id)
        : null;

      if (!supplierOrg) {
        supplierOrg = await getSupplierOrganisationByOwnerId(authUserId);
      }

      const isApprovedSupplier = supplierOrg?.lifecycleStatus === 'APPROVED';

      if (!isApprovedSupplier) {
        redirect('/supplier-portal?notice=under_review');
      }
    } else {
      redirect('/login?error=forbidden_contractor');
    }
  }

  const authUserId = session.personId || session.authUserId || '';
  const providerOrgId = session.orgId;

  // ── Authoritative Contractor Organisation Identity Resolution ──────────────
  let legalName = session.orgName || 'Contractor Organisation';
  let tradingName = '';

  try {
    const { getSupplierOrganisationById, getSupplierOrganisationByOwnerId } = await import(
      '@/server/suppliers/supplier-auth-store'
    );
    let sOrg = session.orgId ? await getSupplierOrganisationById(session.orgId) : null;
    if (!sOrg && authUserId) {
      sOrg = await getSupplierOrganisationByOwnerId(authUserId);
    }
    if (sOrg) {
      legalName = sOrg.legalName || legalName;
      tradingName = sOrg.tradingName || '';
    }
  } catch (err) {
    console.warn('[CONTRACTOR_PAGE] Organisation resolution fallback', err);
  }

  const orgDisplayName = tradingName || legalName;

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
    <div className="space-y-6">
      {/* 1. Contractor Control Centre (Executive Header Panel) */}
      <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-6 sm:p-7 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-[#EA580C] font-bold">
              ENTIREFM NETWORK &bull; {orgDisplayName}
            </span>
            <span
              className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-[4px] border ${
                complianceSummary.operationalStatus === 'COMPLIANT'
                  ? 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
                  : complianceSummary.operationalStatus === 'RESTRICTED'
                  ? 'bg-[#FFF1F2] text-[#E11D48] border-[#FECDD3]'
                  : 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'
              }`}
            >
              {complianceSummary.operationalStatus.replace(/_/g, ' ')}
            </span>
          </div>

          <h1 className="text-2xl font-semibold text-[#111111] tracking-tight">
            Contractor Control Centre
          </h1>
          <p className="text-xs text-[#6D6D68] max-w-2xl font-normal leading-relaxed">
            Live dispatch pipeline, operative allocations, proactive compliance monitoring, and commercial purchase orders.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/contractor/compliance"
            className="px-3.5 py-2 rounded-[6px] border border-[#E8E8E5] bg-[#FFFFFF] hover:bg-[#FAFAF8] text-[#111111] text-xs font-medium transition-all flex items-center gap-2 shadow-xs"
          >
            <ShieldCheck className="w-4 h-4 text-[#EA580C]" />
            <span>Compliance ({complianceSummary.complianceScorePct}%)</span>
          </Link>

          <Link
            href="/contractor/work"
            className="px-4 py-2 rounded-[6px] bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-medium transition-all flex items-center gap-2 shadow-xs"
          >
            <Briefcase className="w-4 h-4" />
            <span>Work Queue ({newOffers.length + activeJobs.length})</span>
          </Link>
        </div>
      </div>

      {/* 2. Partner Onboarding Essentials (Clean 4-Stage Horizontal Milestone Process) */}
      {operatives.length === 0 && (
        <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E8E5]">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase tracking-wider text-[#EA580C] font-bold">
                PARTNER ONBOARDING ESSENTIALS
              </span>
              <h3 className="text-[14px] font-semibold text-[#111111]">
                Welcome to the EntireFM Contractor Network
              </h3>
              <p className="text-xs text-[#6D6D68]">
                Your supplier application is approved. Complete these initial setup milestones to enable automated work dispatch.
              </p>
            </div>
            <span className="text-[11px] text-[#15803D] font-medium px-2.5 py-1 bg-[#F0FDF4] rounded-[4px] border border-[#BBF7D0] self-start sm:self-auto flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" /> Approved Partner
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <Link
              href="/contractor/workforce"
              className="p-3.5 rounded-[6px] border border-[#E8E8E5] bg-[#FAFAF8] hover:border-[#EA580C] hover:bg-[#FFFFFF] transition-all space-y-1 block group"
            >
              <div className="flex items-center justify-between text-xs text-[#111111] font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-[#9A9A95] font-bold">01</span>
                  Add Workforce
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#9A9A95] group-hover:text-[#EA580C] transition-colors" />
              </div>
              <p className="text-[11px] text-[#6D6D68]">
                Register engineers and assign trade qualifications.
              </p>
            </Link>

            <Link
              href="/contractor/compliance"
              className="p-3.5 rounded-[6px] border border-[#E8E8E5] bg-[#FAFAF8] hover:border-[#EA580C] hover:bg-[#FFFFFF] transition-all space-y-1 block group"
            >
              <div className="flex items-center justify-between text-xs text-[#111111] font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-[#9A9A95] font-bold">02</span>
                  Review Compliance
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#9A9A95] group-hover:text-[#EA580C] transition-colors" />
              </div>
              <p className="text-[11px] text-[#6D6D68]">
                Verify insurance policies and statutory certifications.
              </p>
            </Link>

            <Link
              href="/contractor/rams"
              className="p-3.5 rounded-[6px] border border-[#E8E8E5] bg-[#FAFAF8] hover:border-[#EA580C] hover:bg-[#FFFFFF] transition-all space-y-1 block group"
            >
              <div className="flex items-center justify-between text-xs text-[#111111] font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-[#9A9A95] font-bold">03</span>
                  RAMS &amp; Job Packs
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#9A9A95] group-hover:text-[#EA580C] transition-colors" />
              </div>
              <p className="text-[11px] text-[#6D6D68]">
                Review safety templates and automated job packs.
              </p>
            </Link>

            <Link
              href="/contractor/intelligence"
              className="p-3.5 rounded-[6px] border border-[#E8E8E5] bg-[#FAFAF8] hover:border-[#EA580C] hover:bg-[#FFFFFF] transition-all space-y-1 block group"
            >
              <div className="flex items-center justify-between text-xs text-[#111111] font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-[#9A9A95] font-bold">04</span>
                  Intelligence &amp; Watch
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#9A9A95] group-hover:text-[#EA580C] transition-colors" />
              </div>
              <p className="text-[11px] text-[#6D6D68]">
                Personalised regulatory updates and trade surveillance.
              </p>
            </Link>
          </div>
        </div>
      )}

      {/* 3. Work Dispatch Restricted Warning */}
      {isRestricted && (
        <div className="rounded-[8px] border border-[#FECDD3] bg-[#FFF1F2] p-5 flex items-start gap-4 shadow-xs">
          <ShieldAlert className="w-5 h-5 text-[#E11D48] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-[#9F1239] uppercase tracking-wide">Work Dispatch Restricted</h3>
            <p className="text-xs text-[#9F1239]/90 font-normal leading-relaxed">
              Mandatory compliance controls (e.g. Public Liability insurance) have expired or require verification. Please upload valid replacement documentation in the Compliance Centre to restore work eligibility.
            </p>
            <Link
              href="/contractor/compliance"
              className="inline-block mt-1.5 text-xs text-[#E11D48] hover:text-[#9F1239] underline font-medium"
            >
              Resolve Compliance Actions &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* 4. Action-Oriented Metric Cards (KPIs) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-4 sm:p-5 shadow-xs">
          <span className="text-[10.5px] font-semibold text-[#6D6D68] uppercase tracking-wider">New Job Offers</span>
          <p className={`text-2xl font-semibold mt-1 ${newOffers.length > 0 ? 'text-[#D97706]' : 'text-[#111111]'}`}>
            {newOffers.length}
          </p>
          <span className="text-[11px] text-[#9A9A95] mt-0.5 block">Requires accept/decline</span>
        </div>

        <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-4 sm:p-5 shadow-xs">
          <span className="text-[10.5px] font-semibold text-[#6D6D68] uppercase tracking-wider">Active / In Field</span>
          <p className="text-2xl font-semibold text-[#EA580C] mt-1">{activeJobs.length}</p>
          <span className="text-[11px] text-[#9A9A95] mt-0.5 block">Attending operations</span>
        </div>

        <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-4 sm:p-5 shadow-xs">
          <span className="text-[10.5px] font-semibold text-[#6D6D68] uppercase tracking-wider">Compliance Score</span>
          <p
            className={`text-2xl font-semibold mt-1 ${
              complianceSummary.complianceScorePct >= 90
                ? 'text-[#15803D]'
                : complianceSummary.complianceScorePct >= 70
                ? 'text-[#D97706]'
                : 'text-[#E11D48]'
            }`}
          >
            {complianceSummary.complianceScorePct}%
          </p>
          <span className="text-[11px] text-[#9A9A95] mt-0.5 block">
            {complianceSummary.criticalActionsCount > 0 ? `${complianceSummary.criticalActionsCount} critical actions` : 'Controls validated'}
          </span>
        </div>

        <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-4 sm:p-5 shadow-xs">
          <span className="text-[10.5px] font-semibold text-[#6D6D68] uppercase tracking-wider">Field Engineers</span>
          <p className="text-2xl font-semibold text-[#111111] mt-1">{operatives.length}</p>
          <span className="text-[11px] text-[#9A9A95] mt-0.5 block">Registered operatives</span>
        </div>
      </div>

      {/* 5. Compliance Actions Required Section */}
      {complianceSummary.actions.length > 0 && (
        <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#D97706]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                Compliance Actions Required ({complianceSummary.actions.length})
              </h2>
            </div>
            <Link href="/contractor/compliance" className="text-xs text-[#EA580C] hover:underline font-medium">
              View Compliance Centre →
            </Link>
          </div>

          <div className="divide-y divide-[#E8E8E5]">
            {complianceSummary.actions.slice(0, 3).map((act) => (
              <div key={act.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-[4px] ${
                        act.priority === 'CRITICAL'
                          ? 'bg-[#FFF1F2] text-[#E11D48] border border-[#FECDD3]'
                          : 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]'
                      }`}
                    >
                      {act.priority}
                    </span>
                    <span className="text-xs font-medium text-[#111111]">{act.title}</span>
                  </div>
                  <p className="text-[11.5px] text-[#6D6D68] mt-0.5">{act.reason}</p>
                </div>
                <Link
                  href="/contractor/compliance"
                  className="px-3 py-1.5 rounded-[6px] bg-[#FAFAF8] border border-[#E8E8E5] text-xs text-[#111111] hover:bg-[#FFFFFF] hover:border-[#EA580C] transition-colors shrink-0 self-start sm:self-auto font-medium"
                >
                  {act.resolutionCta} &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. CP-09 Intelligence & Compliance Watch Widget */}
      <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-3">
          <div className="flex items-center gap-2.5">
            <Compass className="w-4 h-4 text-[#EA580C]" />
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                Intelligence &amp; Live Compliance Watch
              </h2>
              <span className="text-[11px] text-[#6D6D68]">Personalised statutory and trade intelligence</span>
            </div>
          </div>
          <Link href="/contractor/intelligence" className="text-xs text-[#EA580C] hover:underline font-medium">
            Open Intelligence Centre →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#FAFAF8] border border-[#E8E8E5] rounded-[6px] p-3.5">
            <span className="text-[10px] font-semibold text-[#6D6D68] uppercase tracking-wider">Pending Updates</span>
            <p className="text-xl font-normal text-[#111111] mt-1">{intelligenceFeed.pendingActionCount}</p>
            <span className="text-[11px] text-[#6D6D68] mt-0.5 block">
              {intelligenceFeed.unacknowledgedCriticalCount > 0
                ? `${intelligenceFeed.unacknowledgedCriticalCount} high priority`
                : 'No critical items'}
            </span>
          </div>

          <div className="bg-[#FAFAF8] border border-[#E8E8E5] rounded-[6px] p-3.5">
            <span className="text-[10px] font-semibold text-[#6D6D68] uppercase tracking-wider">Company Status</span>
            <p className={`text-xl font-normal mt-1 ${companyWatch.companyStatus === 'ACTIVE' ? 'text-[#15803D]' : 'text-[#D97706]'}`}>
              {companyWatch.companyStatus}
            </p>
            <span className="text-[11px] text-[#6D6D68] mt-0.5 block">
              {companyWatch.accounts.overdue || companyWatch.confirmationStatement.overdue
                ? '⚠️ Filing overdue'
                : 'Companies House Good Standing'}
            </span>
          </div>

          <div className="bg-[#FAFAF8] border border-[#E8E8E5] rounded-[6px] p-3.5">
            <span className="text-[10px] font-semibold text-[#6D6D68] uppercase tracking-wider">Credential Surveillance</span>
            <p className={`text-xl font-normal mt-1 ${credentialWatch.expiringWithin90DaysCount > 0 ? 'text-[#D97706]' : 'text-[#15803D]'}`}>
              {credentialWatch.expiringWithin90DaysCount > 0 ? `${credentialWatch.expiringWithin90DaysCount} Expiring` : 'All Current'}
            </p>
            <span className="text-[11px] text-[#6D6D68] mt-0.5 block">
              {credentialWatch.organisationCredentials.length} credentials tracked
            </span>
          </div>
        </div>
      </div>

      {/* 7. New Work Offers (Action Required) */}
      {newOffers.length > 0 && (
        <div className="rounded-[8px] border border-[#FDE68A] bg-[#FFFBEB] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#FDE68A] pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D97706]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#92400E]">
                New Work Order Offers ({newOffers.length})
              </h2>
            </div>
            <Link href="/contractor/work" className="text-xs text-[#D97706] hover:underline font-medium">
              Accept / Decline in Work Queue →
            </Link>
          </div>

          <div className="divide-y divide-[#FDE68A]/60">
            {newOffers.map((offer) => (
              <div key={offer.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-[#111111]">{offer.work_order?.title || 'Maintenance Request'}</div>
                  <div className="text-[11px] text-[#6D6D68] mt-0.5">
                    {offer.work_order?.work_order_number || offer.id} &bull; Priority {offer.work_order?.priority || 'P3_MEDIUM'}
                  </div>
                </div>
                <Link
                  href="/contractor/work"
                  className="px-3 py-1.5 rounded-[6px] bg-[#EA580C] text-white text-xs font-medium hover:bg-[#C2410C] transition-colors"
                >
                  Review Offer
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. Active Jobs & Registered Engineers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-3">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111]">Accepted &amp; In Progress</h2>
              <p className="text-[11px] text-[#6D6D68] mt-0.5">Active fieldwork assignments</p>
            </div>
            <Link href="/contractor/work" className="text-xs text-[#EA580C] hover:underline font-medium">
              View All →
            </Link>
          </div>

          <div className="mt-3 divide-y divide-[#E8E8E5]">
            {activeJobs.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#9A9A95]">
                No active jobs currently in progress.
              </div>
            ) : (
              activeJobs.slice(0, 5).map((job) => (
                <div key={job.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-[#111111]">{job.work_order?.title || 'Work Order'}</div>
                    <div className="text-[11px] text-[#6D6D68] mt-0.5">
                      {job.work_order?.work_order_number} &bull; {job.status}
                    </div>
                  </div>
                  <span className="rounded-[4px] bg-[#FFF7ED] border border-[#FFEDD5] px-2 py-0.5 font-medium text-[10px] text-[#EA580C]">
                    ACTIVE
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Registered Engineers */}
        <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-3">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111]">Engineer Roster</h2>
              <p className="text-[11px] text-[#6D6D68] mt-0.5">Operatives &amp; competencies</p>
            </div>
            <Link href="/contractor/engineers" className="text-xs text-[#EA580C] hover:underline font-medium">
              Manage Team →
            </Link>
          </div>

          <div className="mt-3 divide-y divide-[#E8E8E5]">
            {operatives.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#9A9A95]">
                No engineers currently registered.
              </div>
            ) : (
              operatives.slice(0, 5).map((op) => (
                <div key={op.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-[#111111]">{op.first_name} {op.last_name}</div>
                    <div className="text-[11px] text-[#6D6D68] mt-0.5">{op.job_title || 'Field Engineer'}</div>
                  </div>
                  <span className="rounded-[4px] bg-[#F0FDF4] border border-[#BBF7D0] px-2 py-0.5 font-medium text-[10px] text-[#15803D]">
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
