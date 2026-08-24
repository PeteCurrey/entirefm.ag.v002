import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getCurrentSession, requireAdminSession } from '@/server/identity';
import { listComplaintsForAdmin } from '@/server/complaints';
import { listDataRightsRequests } from '@/server/data-rights';
import { listActivePolicyManifest } from '@/server/legal';
import { LEGAL_CONFIG, SUBPROCESSOR_REGISTER, COOKIE_INVENTORY, TODO_VERIFY } from '@/config/legal';
import {
  CENTRAL_CLAIMS_REGISTRY,
  getClaimsByStatus,
  getClaimStatusCount,
  type LegalClaimEntry,
} from '@/config/claims-registry';
import {
  ShieldCheck,
  Scale,
  FileText,
  AlertTriangle,
  Lock,
  ExternalLink,
  CheckCircle2,
  Clock,
  Building2,
  Eye,
  Users,
  Settings,
  ArrowRight,
  ShieldAlert,
  Search,
  Check,
  X,
  FileCode,
  HelpCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Legal & Governance Human Approval Console | EntireFM Admin',
  description: 'Enterprise governance console for policy approvals, claims registry, complaints queue, subprocessor oversight, and statutory compliance.',
};

export default async function AdminLegalPage() {
  const session = await getCurrentSession();
  const adminSession = requireAdminSession(session);

  const complaints = await listComplaintsForAdmin(adminSession);
  const dataRightsRequests = await listDataRightsRequests(adminSession);
  const policies = listActivePolicyManifest();
  const claimCounts = getClaimStatusCount();

  const proposedPolicies = getClaimsByStatus('PROPOSED_BUSINESS_POLICY');
  const configRequiredClaims = getClaimsByStatus('CONFIG_REQUIRED');
  const legalReviewClaims = getClaimsByStatus('LEGAL_REVIEW_REQUIRED');

  const isExecutive =
    adminSession.role === 'SUPER_ADMIN' ||
    adminSession.role === 'CEO' ||
    adminSession.role === 'DIRECTOR' ||
    adminSession.role === 'COMPLIANCE_MANAGER';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 sm:p-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 text-slate-950 font-bold">
              <Scale className="h-4 w-4" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Legal Governance & Human Approval Console
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Human-in-the-loop executive control over 24 corporate policies, proposed business rules, statutory SAR requests, and dispute queues.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/legal"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <Eye className="h-3.5 w-3.5 text-teal-400" />
            View Public Legal Hub
            <ExternalLink className="h-3 w-3 opacity-60" />
          </Link>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-850 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Awaiting Human Approval</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">{proposedPolicies.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Proposed policy rules</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-850 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Config / Facts Required</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-rose-400 mt-2">{configRequiredClaims.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">VAT, ICO, Insurance Schedules</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-850 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Open Data Rights & SARs</span>
            <Search className="h-4 w-4 text-teal-400" />
          </div>
          <p className="text-2xl font-bold text-teal-400 mt-2">
            {dataRightsRequests.filter((d) => d.status !== 'COMPLETED' && d.status !== 'REJECTED').length}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Statutory 1-month countdown active</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-850 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Verified Production Processors</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">
            {SUBPROCESSOR_REGISTER.filter((s) => s.status === 'VERIFIED_ACTIVE').length}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {SUBPROCESSOR_REGISTER.filter((s) => s.status === 'DETECTED').length} detected in R&D
          </p>
        </div>
      </div>

      {/* 1. APPROVAL INBOX (AI May Propose, AI May Not Approve) */}
      <div className="rounded-2xl border border-amber-900/50 bg-slate-850 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-amber-500/20 text-amber-400 text-xs font-bold">
                !
              </span>
              <h2 className="text-base font-bold text-white">
                Human Approval Inbox (Proposed Business Policies)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              AI / code has proposed the following operational policies. They remain non-contractual until explicitly approved by an authorized executive.
            </p>
          </div>
          <span className="text-xs bg-amber-950 text-amber-300 border border-amber-800 px-3 py-1 rounded-full font-semibold">
            {proposedPolicies.length} Items Awaiting Sign-Off
          </span>
        </div>

        {proposedPolicies.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-xs text-slate-500">
            No policies currently awaiting human approval. All proposals resolved.
          </div>
        ) : (
          <div className="space-y-4">
            {proposedPolicies.map((item) => (
              <div
                key={item.claimId}
                className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60 mr-2">
                      {item.category}
                    </span>
                    <span className="font-bold text-white text-sm">{item.claimId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono">
                      State: {item.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block font-semibold">Proposed Public Wording:</span>
                    <p className="text-slate-200 bg-slate-950/60 p-3 rounded-lg border border-slate-800 font-medium mt-1 leading-relaxed">
                      "{item.publicWording}"
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-slate-500 block">Rationale & Source Reference:</span>
                      <span className="text-slate-300">{item.sourceReference}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Affected Public Pages:</span>
                      <span className="text-teal-400 font-mono">
                        {item.affectedPages?.join(', ') || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {isExecutive && (
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
                    >
                      Send for Legal Review
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-rose-950 text-rose-300 border border-rose-800 text-xs font-semibold hover:bg-rose-900 transition-colors"
                    >
                      Reject Proposal
                    </button>
                    <button
                      type="button"
                      className="px-4 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Approve as Human Executive
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. CONFIGURATION REQUIRED QUEUE (Missing Corporate Facts) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-850 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="h-4 w-4 text-rose-400" />
              Missing Corporate Facts & Configuration Queue
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              These factual credentials must be supplied. In accordance with truth-control rules, zero public fallbacks are rendered until verified.
            </p>
          </div>
          <span className="text-xs bg-rose-950 text-rose-300 border border-rose-800 px-3 py-1 rounded-full font-semibold">
            {configRequiredClaims.length} Items Pending
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 text-xs">
          {configRequiredClaims.map((claim) => (
            <div key={claim.claimId} className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{claim.claimId}</span>
                <span className="text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded">
                  CONFIG_REQUIRED
                </span>
              </div>
              <p className="text-slate-300">{claim.claim}</p>
              <p className="text-[11px] text-slate-500">{claim.internalNotes}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. LEGAL REVIEW REQUIRED QUEUE */}
      <div className="rounded-2xl border border-slate-800 bg-slate-850 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Scale className="h-4 w-4 text-indigo-400" />
              External Legal Review Queue (High-Impact Clauses)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Clauses with significant liability, dispute resolution, or regulatory impact held pending solicitor review.
            </p>
          </div>
          <span className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-3 py-1 rounded-full font-semibold">
            {legalReviewClaims.length} Items in Legal Review
          </span>
        </div>

        <div className="space-y-3 text-xs">
          {legalReviewClaims.map((claim) => (
            <div key={claim.claimId} className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{claim.claimId}</span>
                <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded">
                  LEGAL_REVIEW_REQUIRED
                </span>
              </div>
              <p className="text-slate-200">{claim.claim}</p>
              <p className="text-[11px] text-slate-400">{claim.internalNotes}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. SUBPROCESSOR VERIFICATION REGISTRY (Detected vs Active) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-850 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Subprocessor Contractual Verification Register
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Only providers with status VERIFIED_ACTIVE populate public legal pages. Technologies in R&D remain marked DETECTED.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-[11px] font-bold uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Provider Name</th>
                <th className="px-4 py-3">Contractual Entity</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Primary Hosting</th>
                <th className="px-4 py-3">Transfer Assessment</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {SUBPROCESSOR_REGISTER.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-bold text-white">{sub.name}</td>
                  <td className="px-4 py-3 text-slate-400">{sub.contractualEntity}</td>
                  <td className="px-4 py-3 text-slate-400">{sub.category}</td>
                  <td className="px-4 py-3 font-mono text-[11px]">{sub.primaryHostingRegion}</td>
                  <td className="px-4 py-3 text-slate-400 max-w-[220px] truncate" title={sub.internationalTransferAssessment}>
                    {sub.transferSafeguard}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        sub.status === 'VERIFIED_ACTIVE'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. DATA SUBJECT RIGHTS (SAR) QUEUE */}
      <div className="rounded-2xl border border-slate-800 bg-slate-850 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Search className="h-4 w-4 text-teal-400" />
              Data Subject Rights Queue (UK GDPR Arts 15-22)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live feed of statutory rights requests with calendar-month deadline calculation.
            </p>
          </div>
          <Link
            href="/legal/data-rights"
            target="_blank"
            className="text-xs font-semibold text-teal-400 hover:underline inline-flex items-center gap-1"
          >
            Public Rights Portal
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {dataRightsRequests.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-xs text-slate-500">
            No active data subject rights requests in queue. Zero synthetic records.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-[11px] font-bold uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Right Type</th>
                  <th className="px-4 py-3">Subject Name</th>
                  <th className="px-4 py-3">Relationship</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Statutory Deadline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {dataRightsRequests.map((r) => (
                  <tr key={r.reference} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-mono font-bold text-white">{r.reference}</td>
                    <td className="px-4 py-3 font-semibold text-teal-400">{r.right_type}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{r.full_name}</div>
                      <div className="text-[11px] text-slate-500">{r.email}</div>
                    </td>
                    <td className="px-4 py-3 capitalize">{r.relationship.replace('_', ' ')}</td>
                    <td className="px-4 py-3">
                      <span className="bg-teal-950 text-teal-300 border border-teal-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
                      {new Date(r.clock.finalStatutoryDueDate).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 6. COMPLAINTS & DISPUTE QUEUE */}
      <div className="rounded-2xl border border-slate-800 bg-slate-850 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Complaints & Dispute Resolution Queue
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-category grievance intake queue with separate statutory rules vs internal service targets.
            </p>
          </div>
          <Link
            href="/legal/complaints"
            target="_blank"
            className="text-xs font-semibold text-teal-400 hover:underline inline-flex items-center gap-1"
          >
            Intake Form
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {complaints.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-xs text-slate-500">
            No active complaints in queue. Zero synthetic records.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-[11px] font-bold uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Submitter</th>
                  <th className="px-4 py-3">Responsible Team</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Ack Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {complaints.map((c) => (
                  <tr key={c.reference} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-mono font-bold text-white">{c.reference}</td>
                    <td className="px-4 py-3 capitalize">{c.category.replace('_', ' ')}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{c.full_name}</div>
                      <div className="text-[11px] text-slate-500">{c.email}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-teal-400">{c.responsible_team}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.severity === 'SAFETY_CRITICAL'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : c.severity === 'HIGH'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {c.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-[11px]">
                      {new Date(c.internal_acknowledgement_target_at).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 7. POLICY LIFECYCLE & CRYPTOGRAPHIC HASH REGISTRY */}
      <div className="rounded-2xl border border-slate-800 bg-slate-850 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">
              Policy Lifecycle & Cryptographic Version Registry
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Only PUBLISHED policies can be electronically accepted. SHA-256 hashes guarantee unalterable legal audit integrity.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-[11px] font-bold uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Policy Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Version</th>
                <th className="px-4 py-3">Lifecycle State</th>
                <th className="px-4 py-3">Acceptance Required</th>
                <th className="px-4 py-3">SHA-256 Integrity Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {policies.map((p) => (
                <tr key={p.policy_slug} className="hover:bg-slate-800/40">
                  <td className="px-4 py-2.5 font-bold text-white">
                    <Link
                      href={`/legal/${p.policy_slug}`}
                      target="_blank"
                      className="hover:text-teal-400 transition-colors"
                    >
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">{p.policy_slug}</td>
                  <td className="px-4 py-2.5 font-bold text-teal-400">v{p.version}</td>
                  <td className="px-4 py-2.5">
                    <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                      {p.lifecycle_state}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    {p.requires_explicit_acceptance ? (
                      <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded font-semibold">
                        Contractual
                      </span>
                    ) : (
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                        Standard Disclosure
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[10px] text-slate-500 truncate max-w-[180px]">
                    {p.sha256_hash}
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
