import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getCurrentSession, requireAdminSession } from '@/server/identity';
import { listComplaintsForAdmin } from '@/server/complaints';
import { listDataRightsRequests } from '@/server/data-rights';
import { listActivePolicyManifest } from '@/server/legal';
import { LEGAL_CONFIG, SUBPROCESSOR_REGISTER, COOKIE_INVENTORY, TODO_VERIFY } from '@/config/legal';
import { CENTRAL_CLAIMS_REGISTRY, getClaimStatusCount } from '@/config/claims-registry';
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
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Legal, Data & Governance Control | EntireFM Admin',
  description: 'Enterprise governance console for policy versions, claims registry, complaints queue, subprocessor oversight, and statutory compliance.',
};

export default async function AdminLegalPage() {
  const session = await getCurrentSession();
  const adminSession = requireAdminSession(session);

  const complaints = await listComplaintsForAdmin(adminSession);
  const dataRightsRequests = await listDataRightsRequests(adminSession);
  const policies = listActivePolicyManifest();
  const claimCounts = getClaimStatusCount();

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
              Legal, Data & Governance Console
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise administration of 24 corporate policies, statutory claim registry, SAR intake, complaints queue, and subprocessor oversight.
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
            <span>Active Policies</span>
            <FileText className="h-4 w-4 text-teal-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{policies.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">All 24 published and versioned</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-850 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Verified Claims</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">{claimCounts.VERIFIED}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Of {CENTRAL_CLAIMS_REGISTRY.length} registered claims</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-850 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Open Complaints & SARs</span>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">
            {complaints.filter((c) => c.status !== 'CLOSED' && c.status !== 'RESOLVED').length +
              dataRightsRequests.filter((d) => d.status !== 'COMPLETED' && d.status !== 'REJECTED').length}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Active statutory matters</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-850 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Audited Subprocessors</span>
            <ShieldCheck className="h-4 w-4 text-teal-400" />
          </div>
          <p className="text-2xl font-bold text-teal-400 mt-2">{SUBPROCESSOR_REGISTER.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Live providers (AWS London, Resend)</p>
        </div>
      </div>

      {/* Central Claim Registry Overview */}
      <div className="rounded-2xl border border-slate-800 bg-slate-850 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-teal-400" />
            <h2 className="text-base font-bold text-white">
              Legal Claim Registry & Truth Verification Matrix
            </h2>
          </div>
          <span className="text-[11px] font-mono bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
            Enforcing 5-Tier Claim Truth Model
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-3">
            <span className="text-emerald-400 font-bold block">VERIFIED ({claimCounts.VERIFIED})</span>
            <span className="text-[11px] text-slate-400">Backing document/certificate verified</span>
          </div>
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-3">
            <span className="text-sky-400 font-bold block">APPROVED BUSINESS POLICY ({claimCounts.APPROVED_BUSINESS_POLICY})</span>
            <span className="text-[11px] text-slate-400">Explicitly approved governance rule</span>
          </div>
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-3">
            <span className="text-amber-400 font-bold block">CONFIG_REQUIRED ({claimCounts.CONFIG_REQUIRED})</span>
            <span className="text-[11px] text-slate-400">Awaiting user input; truthful fallback in UI</span>
          </div>
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-3">
            <span className="text-rose-400 font-bold block">LEGAL_REVIEW ({claimCounts.LEGAL_REVIEW_REQUIRED})</span>
            <span className="text-[11px] text-slate-400">Held pending legal counsel review</span>
          </div>
        </div>
      </div>

      {/* Data Subject Rights (SAR) Queue */}
      <div className="rounded-2xl border border-slate-800 bg-slate-850 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Search className="h-4 w-4 text-teal-400" />
              Data Subject Rights (SAR) Queue
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              UK GDPR Articles 15–22 statutory requests with 1-calendar-month legal deadline tracking.
            </p>
          </div>
          <Link
            href="/legal/data-rights"
            target="_blank"
            className="text-xs font-semibold text-teal-400 hover:underline inline-flex items-center gap-1"
          >
            Public SAR Portal
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
                  <th className="px-4 py-3">Statutory Due</th>
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
                      {new Date(r.statutory_due_date).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Complaints & Dispute Queue */}
      <div className="rounded-2xl border border-slate-800 bg-slate-850 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Complaints & Dispute Resolution Queue
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Commercial, contractor, billing, and safety grievance intake (DPC- & COM- series).
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
                  <th className="px-4 py-3">Received</th>
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
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(c.received_at).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Active Policy Manifest & Cryptographic Hashes */}
      <div className="rounded-2xl border border-slate-800 bg-slate-850 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">
              Policy Manifest & Cryptographic Version Registry
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Auditable SHA-256 hashes guarantee that published contractual policies have not been silently modified.
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
                <th className="px-4 py-3">Effective Date</th>
                <th className="px-4 py-3">Explicit Acceptance</th>
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
                  <td className="px-4 py-2.5 text-slate-400">{p.effective_date}</td>
                  <td className="px-4 py-2.5">
                    {p.requires_explicit_acceptance ? (
                      <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded font-semibold">
                        Contractual Required
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
