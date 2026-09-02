import React from 'react';
import Link from 'next/link';
import { FileText, HardDrive, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';

const LIFECYCLE = [
  {
    step: 'CREATE',
    Icon: FileText,
    desc: 'Build RAMS, risk assessments and method statements using FM-specific templates. Select hazards, add site-specific controls, assign operative sign-offs.',
  },
  {
    step: 'STORE',
    Icon: HardDrive,
    desc: 'Upload insurance certificates, qualifications, accreditation documents and company policies into a secure, structured Document Vault — searchable and organised.',
  },
  {
    step: 'MAINTAIN',
    Icon: RefreshCw,
    desc: 'Automated 90/60/30-day expiry tracking. Renewal reminders across insurance, certifications and operative qualifications before they lapse.',
  },
  {
    step: 'USE',
    Icon: CheckCircle2,
    desc: 'Attach documentation to work orders and job packs. Share with clients on request. Submit as timestamped evidence on job completion.',
  },
] as const;

const DOC_TYPES = [
  'Risk Assessments & Method Statements (RAMS)',
  'Method statements',
  'COSHH assessments',
  'Public & employers liability certificates',
  'Trade qualifications',
  'Industry certifications (Gas Safe, NICEIC, Refcom etc.)',
  'Accreditation scheme documents',
  'Health & safety policies',
  'Company policies & procedures',
  'Site-specific documentation',
  'Operative competency records',
  'Training & induction records',
] as const;

export function ContractorRamsSection() {
  return (
    <section className="py-24 bg-white border-b border-slate-200" data-reveal>
      <div className="container-wide space-y-16">

        {/* Header */}
        <div className="max-w-3xl">
          <span className="eyebrow eyebrow-light">DOCUMENTATION MANAGEMENT</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
            The paperwork behind professional work.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            Contractors can maintain and manage the full range of documentation required to operate professionally and meet the information requirements of clients and FM organisations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: document lifecycle */}
          <div className="space-y-3">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
              Document lifecycle
            </p>

            <div className="space-y-0">
              {LIFECYCLE.map((phase, idx) => {
                const { Icon } = phase;
                const isLast = idx === LIFECYCLE.length - 1;
                return (
                  <div key={phase.step} className="flex gap-5 pb-8 relative">
                    {/* Connector line between steps */}
                    {!isLast && (
                      <div
                        aria-hidden="true"
                        className="absolute left-[19px] top-10 w-px bg-slate-200"
                        style={{ height: 'calc(100% - 1.25rem)' }}
                      />
                    )}

                    {/* Icon node */}
                    <div className="shrink-0 w-10 h-10 rounded-sm bg-slate-900 flex items-center justify-center shadow-subtle">
                      <Icon className="w-[18px] h-[18px] text-white" aria-hidden="true" />
                    </div>

                    {/* Content */}
                    <div className="pt-1.5 space-y-1">
                      <p className="text-[10px] font-bold text-[#EA580C] uppercase tracking-widest">
                        {phase.step}
                      </p>
                      <p className="text-[12.5px] text-slate-600 font-light leading-relaxed">
                        {phase.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: document types + CTA */}
          <div className="space-y-10">

            {/* Document types grid */}
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 mb-4">
                Document types managed
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5" role="list">
                {DOC_TYPES.map((doc) => (
                  <li
                    key={doc}
                    className="flex items-start gap-2.5 text-[12px] text-slate-600 font-light"
                  >
                    <span
                      className="mt-[5px] w-1.5 h-1.5 rounded-full shrink-0 bg-[#EA580C]"
                      aria-hidden="true"
                    />
                    {doc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Platform CTA card */}
            <div className="rounded-sm border border-slate-200 bg-[#FAF9FB] p-6 sm:p-7 space-y-4">
              <p className="text-[10px] font-bold text-[#EA580C] uppercase tracking-widest">
                RAMS & Documentation in the Portal
              </p>
              <h3 className="text-base font-light text-slate-900 leading-snug">
                Build RAMS using commercial FM-specific templates. Store certificates in the Document Vault. Attach documentation directly to jobs.
              </h3>
              <p className="text-[12px] text-slate-500 font-light leading-relaxed">
                The RAMS builder provides commercial FM risk controls, hazard selection, method statement creation and digital operative sign-offs. Document storage includes automated expiry management and audit history.
              </p>
              <div className="flex flex-wrap gap-5 pt-1">
                <Link
                  href="/contractor/rams"
                  className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#EA580C] hover:underline underline-offset-2 group"
                >
                  Explore the RAMS Builder
                  <ArrowRight
                    className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  href="#platform-overview"
                  className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-500 hover:text-slate-900 transition-colors"
                >
                  See Document Vault
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
