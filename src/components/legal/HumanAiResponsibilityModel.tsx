import React from 'react';
import { ArrowRight, Cpu, UserCheck, AlertTriangle, FileEdit, CheckCircle2, ShieldCheck } from 'lucide-react';

export function HumanAiResponsibilityModel() {
  const workflows = [
    {
      title: 'Contractor & Trade Allocation',
      aiRole: 'AI evaluates qualifications, SSIP accreditation, geographical proximity, and real-time trade availability to suggest optimal engineers.',
      humanRole: 'Operations Helpdesk manager confirms work order dispatch. AI cannot bind EntireFM or contractor to unverified jobs.',
      humanIcon: UserCheck,
      badge: 'Assisted Dispatch',
    },
    {
      title: 'Compliance & Safety Exception Flagging',
      aiRole: 'AI monitors statutory testing expiry windows (EICR, Gas, Legionella, Fire) and flags emerging compliance deficits.',
      humanRole: 'Authorised Compliance Lead reviews asset evidence, issues remedial instructions, and conducts formal risk assessments.',
      humanIcon: AlertTriangle,
      badge: 'Risk Review',
    },
    {
      title: 'Asset Survey & Quote Scoping',
      aiRole: 'AI synthesises equipment telemetry, maintenance history, and manufacturer guidelines to draft indicative PPM matrices.',
      humanRole: 'Senior Commercial Surveyor inspects physical asset conditions, verifies site rates, and issues formal binding client proposals.',
      humanIcon: FileEdit,
      badge: 'Commercial Approval',
    },
    {
      title: 'Helpdesk Triage & Routine Prioritisation',
      aiRole: 'AI scans incoming service requests for urgent health, safety, and security keywords to recommend priority tier (P1 to P4).',
      humanRole: 'Client site managers and EntireFM duty controllers retain absolute authority to manually re-prioritise or escalate at any time.',
      humanIcon: CheckCircle2,
      badge: 'Contestable Triage',
    },
  ];

  return (
    <div className="my-8 rounded-2xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
          <ShieldCheck className="h-4 w-4" />
        </span>
        <div>
          <h3 className="text-base font-light text-slate-900 sm:text-lg">
            Human + AI Co-Responsibility Architecture
          </h3>
          <p className="text-xs text-slate-600">
            EntireFM operating principle: AI provides analytical assistance; accountable human professionals make binding decisions.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {workflows.map((wf, idx) => {
          const HumanIcon = wf.humanIcon;
          return (
            <div
              key={idx}
              className="grid gap-4 rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs md:grid-cols-[1fr_auto_1fr] md:items-center"
            >
              {/* AI Column */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-indigo-50 text-indigo-700">
                    <Cpu className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-xs font-normal text-indigo-900">AI Role (Analytics & Drafting)</span>
                  <span className="rounded bg-indigo-100 px-1.5 py-0.2 text-[10px] font-normal text-indigo-800 ml-auto md:hidden">
                    {wf.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-8">
                  {wf.aiRole}
                </p>
              </div>

              {/* Arrow */}
              <div className="hidden items-center justify-center md:flex text-slate-300">
                <ArrowRight className="h-5 w-5 text-indigo-400" />
              </div>

              {/* Human Column */}
              <div className="space-y-1 border-t border-slate-100 pt-3 md:border-t-0 md:pt-0">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-emerald-50 text-emerald-700">
                    <HumanIcon className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-xs font-normal text-emerald-900">Human Governance (Binding Decision)</span>
                  <span className="hidden md:inline-block rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-normal text-indigo-800 ml-auto">
                    {wf.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed pl-8 font-normal">
                  {wf.humanRole}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-slate-600">
        <strong className="text-slate-900">Statutory Safeguard (UK GDPR Article 22 & DUA Act 2025): </strong>
        EntireFM does not conduct sole automated decision-making producing legal or similarly significant effects without accessible, meaningful human review.
      </div>
    </div>
  );
}
