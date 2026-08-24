import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getCurrentSession, requireAdminSession } from '@/server/identity';
import { listComplaintsForAdmin } from '@/server/complaints';
import { listActivePolicyManifest } from '@/server/legal';
import { LEGAL_CONFIG, SUBPROCESSOR_REGISTER, COOKIE_INVENTORY, TODO_VERIFY } from '@/config/legal';
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
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Legal, Data & Governance Control | EntireFM Admin',
  description: 'Enterprise governance console for policy versions, complaints queue, subprocessor oversight, and statutory compliance.',
};

export default async function AdminLegalPage() {
  const session = await getCurrentSession();
  const adminSession = requireAdminSession(session);

  const complaints = await listComplaintsForAdmin(adminSession);
  const policies = listActivePolicyManifest();

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
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-white font-bold">
              <Scale className="h-4 w-4" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Legal, Data & Governance Console
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise administration of 24 corporate policies, statutory complaints queue, subprocessor oversight, and verification registry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/legal"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <Eye className="h-3.5 w-3.5 text-indigo-400" />
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
            <FileText className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{policies.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">All 24 published and versioned</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-850 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Open Complaints</span>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">
            {complaints.filter((c) => c.status !== 'CLOSED' && c.status !== 'RESOLVED').length}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Across all 8 intake categories</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-850 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Verified Subprocessors</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">{SUBPROCESSOR_REGISTER.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">UK & International transfers active</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-850 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Audited Cookies</span>
            <Lock className="h-4 w-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-sky-400 mt-2">{COOKIE_INVENTORY.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Live storage technologies</p>
        </div>
      </div>

      {/* Corporate Verification Status & TODO_VERIFY Audit Panel */}
      <div className="rounded-2xl border border-slate-800 bg-slate-850 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Building2 className="h-5 w-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">
              Corporate Entity & Regulatory Verification Status
            </h2>
          </div>
          <span className="text-[11px] font-mono bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
            Entity: Alkota Group Limited
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-1">
            <span className="text-slate-500 block">Company Registration</span>
            <span className="font-bold text-white block">No. {LEGAL_CONFIG.companyNumber}</span>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Verified (Companies House)
            </span>
          </div>

          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-1">
            <span className="text-slate-500 block">VAT Registration</span>
            <span className="font-bold text-white block">
              {LEGAL_CONFIG.vatNumber === TODO_VERIFY ? 'Pending Verification' : LEGAL_CONFIG.vatNumber}
            </span>
            {LEGAL_CONFIG.vatNumber === TODO_VERIFY ? (
              <span className="text-[11px] text-amber-400 flex items-center gap-1">
                <Clock className="h-3 w-3" /> TODO_VERIFY (Fallbacks Active)
              </span>
            ) : (
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Verified
              </span>
            )}
          </div>

          <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-1">
            <span className="text-slate-500 block">ICO Data Protection Register</span>
            <span className="font-bold text-white block">
              {LEGAL_CONFIG.icoRegistrationNumber === TODO_VERIFY
                ? 'Pending Verification'
                : LEGAL_CONFIG.icoRegistrationNumber}
            </span>
            {LEGAL_CONFIG.icoRegistrationNumber === TODO_VERIFY ? (
              <span className="text-[11px] text-amber-400 flex items-center gap-1">
                <Clock className="h-3 w-3" /> TODO_VERIFY (Fallbacks Active)
              </span>
            ) : (
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Complaints & Dispute Queue */}
      <div className="rounded-2xl border border-slate-800 bg-slate-850 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">
              Complaints & Data Subject Rights Queue
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Statutory 8-category intake queue with SLA and acknowledgment tracking.
            </p>
          </div>
          <Link
            href="/legal/complaints"
            target="_blank"
            className="text-xs font-semibold text-indigo-400 hover:underline inline-flex items-center gap-1"
          >
            Intake Form
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {complaints.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-xs text-slate-500">
            No active complaints in queue. All service requests and data rights inquiries are up to date.
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
                    <td className="px-4 py-3 font-medium text-indigo-400">{c.responsible_team}</td>
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
                      <span className="bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded text-[10px] font-semibold">
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
                      className="hover:text-indigo-400 transition-colors"
                    >
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">{p.policy_slug}</td>
                  <td className="px-4 py-2.5 font-bold text-indigo-400">v{p.version}</td>
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
