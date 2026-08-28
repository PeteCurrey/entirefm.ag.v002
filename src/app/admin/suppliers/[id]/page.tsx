import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSupplierOrganisation } from '@/server/suppliers/store';
import { getSupplierMembership, listPartnerInvoices } from '@/server/partner-network/store';
import {
  getSupplierOnboardingPlan,
  listSupplierDocuments,
  getSupplierBankDetails,
  listServiceApprovals,
  listGeographicApprovals,
  listComplianceHolds,
  listRemediationActions,
  listSupplierAuditLogs,
} from '@/server/suppliers/assurance-store';
import { getSupplierScorecard } from '@/server/suppliers/performance-store';
import { getApplicationDraft } from '@/server/suppliers/supplier-auth-store';
import {
  ShieldCheck,
  ShieldAlert,
  Award,
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  CreditCard,
  FileText,
  AlertTriangle,
  Lock,
  History,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SupplierProfile360Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supplier = await getSupplierOrganisation(id);

  if (!supplier) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-light text-slate-900">Supplier Not Found</h2>
        <p className="text-xs text-slate-500">The supplier ID {id} does not exist in the repository.</p>
        <Link href="/admin/suppliers/landscape" className="btn-primary text-xs inline-block">
          Return to Supplier Landscape
        </Link>
      </div>
    );
  }

  const [
    membership,
    invoices,
    onboardingPlan,
    documents,
    bankDetails,
    serviceApprovals,
    geoApprovals,
    complianceHolds,
    remediationActions,
    auditLogs,
    scorecard,
    authDraft,
  ] = await Promise.all([
    getSupplierMembership(supplier.id),
    listPartnerInvoices({ supplierId: supplier.id }),
    getSupplierOnboardingPlan(supplier.id),
    listSupplierDocuments(supplier.id),
    getSupplierBankDetails(supplier.id),
    listServiceApprovals(supplier.id),
    listGeographicApprovals(supplier.id),
    listComplianceHolds(supplier.id),
    listRemediationActions(supplier.id),
    listSupplierAuditLogs(supplier.id),
    getSupplierScorecard(supplier.id),
    getApplicationDraft(supplier.id),
  ]);

  const activeHolds = complianceHolds.filter((h) => h.is_active);

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link href="/admin/suppliers/landscape" className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Supplier Landscape
      </Link>

      {/* Profile Header */}
      <div className="bg-white border border-slate-200 p-8 rounded-sm shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10.5px] font-mono px-2 py-0.5 rounded bg-slate-900 text-white font-normal">
                {supplier.relationship_level.replace(/_/g, ' ')}
              </span>
              <span className={`text-[10.5px] font-mono px-2 py-0.5 rounded ${
                supplier.compliance_status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                COMPLIANCE: {supplier.compliance_status.replace(/_/g, ' ')}
              </span>
              <span className={`text-[10.5px] font-mono px-2 py-0.5 rounded ${
                supplier.risk_level === 'CRITICAL' ? 'bg-rose-600 text-white' : supplier.risk_level === 'HIGH' ? 'bg-amber-500 text-white' : 'bg-slate-700 text-white'
              }`}>
                RISK: {supplier.risk_level}
              </span>
              {activeHolds.length > 0 && (
                <span className="text-[10.5px] font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-light flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3" /> {activeHolds.length} COMPLIANCE HOLD
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extralight text-slate-900">
              {supplier.legal_name}
            </h1>
            {supplier.trading_name && (
              <span className="text-xs font-mono text-slate-500 block">Trading as {supplier.trading_name}</span>
            )}
          </div>

          <div className="text-right space-y-1 font-mono text-xs text-slate-600">
            <div>ID: <span className="font-light text-slate-900">{supplier.id}</span></div>
            <div>Company Reg: <span className="font-light">{supplier.company_number || '—'}</span></div>
            <div>VAT: <span className="font-light">{supplier.vat_number || '—'}</span></div>
          </div>
        </div>

        {/* Contact & Location Details */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono text-slate-700">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span>{supplier.headquarters_city}, {supplier.headquarters_postcode}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-slate-400" />
            <span>{supplier.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-slate-400" />
            <span>{supplier.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-slate-400" />
            <span>{supplier.website_url ? supplier.website_url.replace(/^https?:\/\//, '') : '—'}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Operational Scope, Onboarding, Documents & Commercial */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Scorecard, Scoped Approvals, Onboarding Plan, Documents */}
        <div className="lg:col-span-8 space-y-6">
          {/* Operational Performance Scorecard (Phase 4) */}
          {scorecard && (
            <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-sm font-normal uppercase tracking-wider text-slate-900">
                    Operational Performance Scorecard
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    Window: {scorecard.measurement_window.replace('_', ' ')} &middot; {scorecard.total_completed_jobs} Completed Jobs
                  </span>
                </div>
                <span className={`text-xs font-mono font-light px-2.5 py-1 rounded ${
                  scorecard.overall_status === 'EXCELLENT' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                }`}>
                  STATUS: {scorecard.overall_status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase block">SLA ATTENDANCE</span>
                  <div className="text-xl font-light text-emerald-700">{scorecard.sla_attendance_rate.value}%</div>
                  <span className="text-[10px] text-slate-500">Target: 90%</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase block">FIRST-TIME FIX</span>
                  <div className="text-xl font-light text-slate-900">{scorecard.first_time_fix_rate.value}%</div>
                  <span className="text-[10px] text-slate-500">Single Visit Fix</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase block">EVIDENCE ACCURACY</span>
                  <div className="text-xl font-light text-slate-900">{scorecard.evidence_acceptance_rate.value}%</div>
                  <span className="text-[10px] text-slate-500">Report Acceptance</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase block">INVOICE MATCH</span>
                  <div className="text-xl font-light text-slate-900">{scorecard.invoice_accuracy_rate.value}%</div>
                  <span className="text-[10px] text-slate-500">3-Way PO Match</span>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Onboarding Plan */}
          <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-normal uppercase tracking-wider text-slate-900">
                Dynamic Assurance Requirements ({onboardingPlan?.completion_percentage || 0}% Complete)
              </h3>
              <span className="text-xs font-mono font-light px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                {onboardingPlan?.completed_mandatory_items || 0} / {onboardingPlan?.total_mandatory_items || 0} Mandatory Accepted
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {onboardingPlan?.items.map((item) => (
                <div key={item.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-light text-slate-900 font-sans">{item.title}</span>
                      {item.is_mandatory && <span className="text-[9.5px] font-mono text-rose-600 font-light">MANDATORY</span>}
                    </div>
                    <p className="text-slate-500 text-[11.5px] font-light">{item.description}</p>
                    {item.expiry_date && <span className="text-[10.5px] font-mono text-slate-400">Expires: {item.expiry_date}</span>}
                  </div>

                  <span className={`inline-block text-[10px] font-mono font-light px-2 py-0.5 rounded shrink-0 ${
                    item.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' : item.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Scoped Service & Geographic Approvals */}
          <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4">
            <h3 className="text-sm font-normal uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-200">
              Authorised Operational Scope
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-light block">APPROVED DISCIPLINES</span>
                {serviceApprovals.length === 0 ? (
                  <p className="text-xs text-slate-500 font-light">No services approved yet.</p>
                ) : (
                  serviceApprovals.map((sa) => (
                    <div key={sa.id} className="flex items-center justify-between text-xs font-mono">
                      <span className="font-light text-slate-800">{sa.service_name}</span>
                      <span className="text-emerald-700 font-light">APPROVED</span>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-light block">APPROVED GEOGRAPHY</span>
                {geoApprovals.length === 0 ? (
                  <p className="text-xs text-slate-500 font-light">No regional approvals on file.</p>
                ) : (
                  geoApprovals.map((ga) => (
                    <div key={ga.id} className="flex items-center justify-between text-xs font-mono">
                      <span className="font-light text-slate-800">{ga.region_or_city}</span>
                      <span className="text-emerald-700 font-light">AUTHORISED</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Document Vault */}
          <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4">
            <h3 className="text-sm font-normal uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-200">
              Verified Compliance Documents ({documents.length})
            </h3>

            <div className="divide-y divide-slate-100 text-xs font-mono">
              {documents.length === 0 ? (
                <p className="py-4 text-center text-slate-500 font-light">No documents uploaded.</p>
              ) : (
                documents.map((doc) => (
                  <div key={doc.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-light text-slate-900 font-sans">{doc.file_name}</div>
                      <span className="text-slate-400 text-[10.5px]">{doc.document_type} &middot; v{doc.version} &middot; Exp: {doc.expiry_date || '—'}</span>
                    </div>
                    <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-light text-[10px]">
                      {doc.review_status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Bank Details, Commercial, Remediation, Audit */}
        <div className="lg:col-span-4 space-y-6">
          {/* Masked Bank Details (Dual-Control) */}
          <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-slate-500" />
                <h3 className="text-xs font-normal uppercase tracking-wider text-slate-900">
                  Bank Remittance (Masked)
                </h3>
              </div>
              <span className={`text-[10px] font-mono font-light px-1.5 py-0.5 rounded ${
                bankDetails?.verification_status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {bankDetails?.verification_status || 'NOT_SUBMITTED'}
              </span>
            </div>

            {bankDetails ? (
              <div className="space-y-1.5 text-xs font-mono">
                <div><span className="text-slate-400">Account: </span><span className="font-light text-slate-800">{bankDetails.account_name}</span></div>
                <div><span className="text-slate-400">Bank: </span><span className="text-slate-700">{bankDetails.bank_name}</span></div>
                <div><span className="text-slate-400">Sort Code: </span><span className="font-light">{bankDetails.sort_code_masked}</span></div>
                <div><span className="text-slate-400">Account #: </span><span className="font-light">{bankDetails.account_number_masked}</span></div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 font-light">No bank details submitted.</p>
            )}
          </div>

          {/* Internal Commercial Tab (Procurement Firewall) */}
          <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-brand-pink" />
                <h3 className="text-xs font-normal uppercase tracking-wider text-slate-900">
                  Commercial &amp; Membership
                </h3>
              </div>
              <span className="text-[9.5px] font-mono font-light px-1.5 py-0.5 rounded bg-slate-100 text-slate-800">
                FIREWALL ISOLATED
              </span>
            </div>

            {authDraft?.selectedMembershipTier ? (
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tier:</span>
                  <span className="font-light text-slate-900">
                    {authDraft.selectedMembershipTier === 'TIER_1'
                      ? 'Contractor Network Member'
                      : 'Contractor Network Partner'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Commercial Route:</span>
                  <span className={`font-light ${authDraft.membershipPaymentStatus === 'WAIVED' ? 'text-emerald-700 font-bold' : 'text-slate-900'}`}>
                    {authDraft.membershipPaymentStatus === 'WAIVED'
                      ? 'EntireFM Invitation (Fee Waived)'
                      : authDraft.membershipPaymentStatus === 'PAID'
                      ? 'Organic Direct Payment'
                      : 'Pending Settlement'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Standard Value:</span>
                  <span className="font-light text-slate-900">
                    £{(authDraft.membershipStandardAmountGbp || (authDraft.selectedMembershipTier === 'TIER_1' ? 295 : 695)).toLocaleString()} + VAT
                  </span>
                </div>
                {authDraft.membershipPaymentStatus === 'WAIVED' && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Amount Waived:</span>
                    <span className="font-bold">
                      -£{(authDraft.membershipWaivedAmountGbp || (authDraft.selectedMembershipTier === 'TIER_1' ? 295 : 695)).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-100 pt-1.5 font-bold">
                  <span className="text-slate-700">Amount Paid / Due:</span>
                  <span className="text-slate-900">
                    £{(authDraft.membershipFinalAmountGbp ?? (authDraft.membershipPaymentStatus === 'WAIVED' ? 0 : 295)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Status:</span>
                  <span className={`font-bold ${
                    authDraft.membershipPaymentStatus === 'PAID' || authDraft.membershipPaymentStatus === 'WAIVED'
                      ? 'text-emerald-700'
                      : 'text-amber-800'
                  }`}>
                    {authDraft.membershipPaymentStatus || 'UNPAID'}
                  </span>
                </div>
              </div>
            ) : membership ? (
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tier:</span>
                  <span className="font-light text-slate-900">{membership.product_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-light text-emerald-600">{membership.membership_status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Annual Fee:</span>
                  <span className="font-light text-slate-900">£{membership.price_gbp.toLocaleString()} + VAT</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 font-light">No commercial membership assigned.</p>
            )}
          </div>

          {/* Remediation Actions */}
          <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-3">
            <h3 className="text-xs font-normal uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-200">
              Remediation Actions ({remediationActions.length})
            </h3>
            {remediationActions.length === 0 ? (
              <p className="text-xs text-slate-500 font-light">No active remediation actions.</p>
            ) : (
              remediationActions.map((r) => (
                <div key={r.id} className="p-2.5 bg-slate-50 rounded border border-slate-200 text-xs font-mono space-y-1">
                  <div className="flex justify-between font-light">
                    <span className="text-slate-900">{r.issue_summary}</span>
                    <span className="text-amber-800">{r.status}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] font-sans">{r.detailed_remediation_required}</p>
                </div>
              ))
            )}
          </div>

          {/* Compliance Audit Trail */}
          <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-3">
            <h3 className="text-xs font-normal uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-200">
              Audit Trail ({auditLogs.length})
            </h3>
            <div className="divide-y divide-slate-100 text-xs font-mono">
              {auditLogs.slice(0, 4).map((a) => (
                <div key={a.id} className="py-2 space-y-0.5">
                  <div className="font-light text-slate-800">{a.action}</div>
                  <div className="text-slate-400 text-[10px]">{a.actor} &middot; {a.timestamp.substring(0, 10)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
