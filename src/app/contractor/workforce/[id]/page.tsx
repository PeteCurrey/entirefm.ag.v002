import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { redirect, notFound } from 'next/navigation';
import { getContractorOperativeById } from '@/server/contractor/workforce-service';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  ShieldCheck,
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Briefcase,
  Phone,
  Mail,
  Wrench,
  GraduationCap,
  FileText,
  QrCode,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Operative Competency Record | EntireFM Contractor Platform',
  description: 'Verified operative qualifications, trade accreditations, and EntireFM dispatch eligibility.',
};

export const dynamic = 'force-dynamic';

export default async function OperativeProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getCurrentSession();
  if (!session) redirect('/login?redirect=/contractor/workforce');

  const { id } = await params;
  const operative = await getContractorOperativeById(id, session);

  if (!operative) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <div>
        <Link
          href="/contractor/workforce"
          className="text-xs text-brand-mist/60 hover:text-white flex items-center gap-1.5 font-mono mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Workforce
        </Link>
      </div>

      {/* Header Banner */}
      <div className="rounded-2xl border border-brand-edge-dark bg-gradient-to-r from-brand-carbon via-brand-carbon/90 to-brand-void p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-brand-electric/10 text-brand-electric flex items-center justify-center font-light text-2xl border border-brand-electric/20 shrink-0">
            {operative.firstName.charAt(0)}{operative.lastName.charAt(0)}
          </div>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-electric-bright font-bold">
                OPERATIVE RECORD &bull; {operative.internalReference}
              </span>
              <span
                className={`text-[10.5px] font-mono px-2 py-0.5 rounded border ${
                  operative.isEligibleForDispatch
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20 font-bold'
                }`}
              >
                {operative.isEligibleForDispatch ? 'ELIGIBLE FOR ENTIREFM WORK' : 'DISPATCH ACTION REQUIRED'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">{operative.fullName}</h1>
            <p className="text-xs text-brand-mist/70 font-mono">
              {operative.jobTitle} &bull; {operative.employmentStatus} {operative.isSupervisor && '• Lead Supervisor'}
            </p>
          </div>
        </div>

        {/* Digital ID Block */}
        <div className="p-4 rounded-xl bg-brand-void/80 border border-brand-edge-dark flex items-center gap-4 shrink-0">
          <QrCode className="w-8 h-8 text-brand-electric" />
          <div className="text-xs font-mono">
            <span className="text-[10px] text-brand-mist/50 block">EntireFM Contractor ID</span>
            <span className="text-white font-bold block mt-0.5">{operative.entirefmContractorIdNumber}</span>
            <span className="text-[10.5px] text-emerald-400 block mt-0.5">Verified Network Pass</span>
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Overview & Contact */}
        <div className="space-y-6">
          {/* Contact & Employment */}
          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-4">
            <h3 className="text-sm font-medium text-white border-b border-brand-edge-dark/60 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-brand-electric" />
              Operative Identity &amp; Contact
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-brand-mist/50 block">Work Email Address</span>
                <span className="text-white font-normal mt-0.5 block">{operative.email}</span>
              </div>
              <div>
                <span className="text-brand-mist/50 block">Work Mobile</span>
                <span className="text-white font-mono mt-0.5 block">{operative.phone || 'Not recorded'}</span>
              </div>
              <div>
                <span className="text-brand-mist/50 block">Home / Base Postcode</span>
                <span className="text-white font-mono mt-0.5 block">{operative.homePostcode || 'Local Hub'}</span>
              </div>
              <div>
                <span className="text-brand-mist/50 block">Start Date</span>
                <span className="text-white font-mono mt-0.5 block">{operative.startDate || '—'}</span>
              </div>
            </div>
          </div>

          {/* Approved Engineering Trades */}
          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-4">
            <h3 className="text-sm font-medium text-white border-b border-brand-edge-dark/60 pb-3 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-brand-electric" />
              Approved Engineering Trades
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {operative.trades.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded bg-brand-void border border-brand-edge-dark text-white text-xs font-light"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Qualifications, Training & Competencies */}
        <div className="lg:col-span-2 space-y-6">
          {/* Verified Qualifications */}
          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-brand-edge-dark/60 pb-3">
              <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-electric" />
                Verified Trade Qualifications ({operative.qualifications.length})
              </h3>
            </div>

            <div className="divide-y divide-brand-edge-dark/30">
              {operative.qualifications.map((q) => (
                <div key={q.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-white font-normal block">{q.name}</span>
                    <span className="text-[11px] font-mono text-brand-mist/50 block">
                      {q.awardingBody} &bull; Ref: {q.certificateNumber || 'Verified'} &bull; Exp: {q.expiryDate || 'No Expiry'}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10.5px] font-mono border ${
                      q.status === 'VALID'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20 font-bold'
                    }`}
                  >
                    {q.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Statutory Training Courses */}
          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-brand-edge-dark/60 pb-3">
              <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                Health &amp; Safety Training Refreshers ({operative.trainingRecords.length})
              </h3>
            </div>

            <div className="divide-y divide-brand-edge-dark/30">
              {operative.trainingRecords.map((t) => (
                <div key={t.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-white font-normal block">{t.courseName}</span>
                    <span className="text-[11px] font-mono text-brand-mist/50 block">
                      Provider: {t.provider} &bull; Completed: {t.completionDate} {t.expiryDate && `&bull; Exp: ${t.expiryDate}`}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10.5px] font-mono border ${
                      t.status === 'VALID'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Competencies */}
          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-4">
            <h3 className="text-sm font-medium text-white border-b border-brand-edge-dark/60 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified Competencies Held
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {operative.competencies.map((comp) => (
                <div key={comp} className="p-3 rounded-lg bg-brand-void border border-brand-edge-dark flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-white font-light">{comp.replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
