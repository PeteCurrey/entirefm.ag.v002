import React from 'react';
import Link from 'next/link';
import {
  listWorkAllocationRequirements,
  evaluateCandidatesForRequirement,
} from '@/server/allocation/allocation-store';
import { ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CandidateDryRunPage({
  searchParams,
}: {
  searchParams: Promise<{ reqId?: string }>;
}) {
  const { reqId } = await searchParams;
  const requirements = await listWorkAllocationRequirements();
  const selectedReqId = reqId || requirements[0]?.id;

  const candidates = selectedReqId ? await evaluateCandidatesForRequirement(selectedReqId) : [];
  const selectedReq = requirements.find((r) => r.id === selectedReqId);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
          DETERMINISTIC EVALUATION
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Supplier Candidate &amp; Hard Gate Review Tool
        </h1>
        <p className="text-xs text-slate-600 font-light mt-1">
          Evaluate legal, compliance, and technical eligibility before calculating explainable operational suitability.
        </p>
      </div>

      {/* Requirement Selector */}
      <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-3 font-mono text-xs">
        <span className="font-bold text-slate-900 font-sans block uppercase tracking-wider text-xs">
          Select Work Requirement for Candidate Matching:
        </span>
        <div className="flex flex-wrap gap-2">
          {requirements.map((r) => (
            <Link
              key={r.id}
              href={`/admin/operations/allocation/candidates?reqId=${r.id}`}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                r.id === selectedReqId
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {r.source_id} &middot; {r.service_name} ({r.site_city})
            </Link>
          ))}
        </div>
      </div>

      {/* Selected Requirement Card */}
      {selectedReq && (
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-sm text-xs font-mono space-y-2">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="font-bold text-slate-900 font-sans text-sm">{selectedReq.site_name} &middot; {selectedReq.site_city}</span>
            <span className="text-rose-700 font-bold">{selectedReq.priority}</span>
          </div>
          <p className="text-slate-700 font-sans">{selectedReq.scope_summary}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-500 text-[11px]">
            <div>Client: <strong className="text-slate-800">{selectedReq.client_name}</strong></div>
            <div>Service: <strong className="text-slate-800">{selectedReq.service_name}</strong></div>
            <div>SLA Window: <strong className="text-slate-800">{selectedReq.sla_attendance_target_hours} Hours</strong></div>
            <div>NTE Budget: <strong className="text-slate-800">£{selectedReq.not_to_exceed_gbp || '—'}</strong></div>
          </div>
        </div>
      )}

      {/* Candidates Table */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-xs uppercase text-slate-700">
          Evaluated Candidates ({candidates.length})
        </div>

        <div className="divide-y divide-slate-100 font-mono text-xs">
          {candidates.map((c) => (
            <div key={c.supplier_id} className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 font-sans text-sm">{c.supplier_name}</span>
                  {c.is_eligible ? (
                    <span className="text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> HARD GATES PASSED
                    </span>
                  ) : (
                    <span className="text-rose-800 bg-rose-100 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                      <ShieldAlert className="h-3 w-3" /> NOT ELIGIBLE
                    </span>
                  )}
                  {c.is_preferred_partner && (
                    <span className="text-amber-800 bg-amber-100 font-bold px-1.5 py-0.5 rounded text-[9.5px]">
                      PREFERRED
                    </span>
                  )}
                </div>

                {/* Exclusion Reasons if Ineligible */}
                {!c.is_eligible && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-800 text-[11px] font-sans">
                    <strong>Exclusion Reasons: </strong> {c.hard_gate_result.exclusion_reasons.join('; ')}
                  </div>
                )}

                {/* Strengths & Considerations if Eligible */}
                {c.is_eligible && (
                  <div className="space-y-1 text-[11px] font-sans">
                    <div className="text-emerald-800">
                      <strong>Strengths: </strong> {c.strengths.join(' &middot; ')}
                    </div>
                    {c.considerations.length > 0 && (
                      <div className="text-amber-800">
                        <strong>Considerations: </strong> {c.considerations.join(' &middot; ')}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Suitability Score Gauge */}
              <div className="text-right shrink-0">
                <span className="text-slate-400 text-[10px] uppercase block">SUITABILITY SCORE</span>
                <div className={`text-2xl font-bold ${c.is_eligible ? 'text-slate-900' : 'text-slate-400'}`}>
                  {c.suitability_score} / 100
                </div>
                <span className="text-[10px] text-slate-500">
                  SLA: {c.sla_rate}% &middot; FTF: {c.ftf_rate}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
