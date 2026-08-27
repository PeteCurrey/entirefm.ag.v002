'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  FileText,
  Download,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Wrench,
  Shield,
  Send,
  Building2,
  Lock,
  Sparkles,
} from 'lucide-react';
import { RamsRecord } from '@/server/contractor/rams-service';

interface Props {
  rams: RamsRecord;
  currentPersonId?: string;
  isContractorUser: boolean;
}

export function RamsDetailClient({ rams: initialRams, currentPersonId, isContractorUser }: Props) {
  const router = useRouter();
  const [rams, setRams] = useState<RamsRecord>(initialRams);
  const [activeTab, setActiveTab] = useState<
    'SCOPE' | 'PEOPLE' | 'HAZARDS' | 'METHOD' | 'SAFETY' | 'EMERGENCY' | 'BRIEFING'
  >('SCOPE');
  const [isSigningBriefing, setIsSigningBriefing] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignBriefing = async () => {
    setIsSigningBriefing(true);
    try {
      const res = await fetch(`/api/contractor/rams/${encodeURIComponent(rams.id)}/briefing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operativeId: currentPersonId }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to sign briefing');

      // Refresh detail
      const getRes = await fetch(`/api/contractor/rams/${encodeURIComponent(rams.id)}`);
      const getData = await getRes.json();
      if (getData.rams) setRams(getData.rams);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to record operative briefing');
    } finally {
      setIsSigningBriefing(false);
    }
  };

  const handleDuplicate = async () => {
    setIsDuplicating(true);
    try {
      const res = await fetch(`/api/contractor/rams/${encodeURIComponent(rams.id)}/duplicate`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to duplicate RAMS');
      router.push(`/contractor/rams/${encodeURIComponent(data.newRamsId)}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Duplication failed');
      setIsDuplicating(false);
    }
  };

  const isBriefed = rams.operativeBriefings.some(
    (b) => b.operativeId === currentPersonId && b.version === rams.version
  );

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/contractor/rams"
          className="text-xs text-brand-mist/60 hover:text-white flex items-center gap-1.5 font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to RAMS Dashboard
        </Link>
      </div>

      {/* Header Banner */}
      <div className="rounded-2xl border border-brand-edge-dark bg-gradient-to-r from-brand-carbon via-brand-carbon/90 to-brand-void p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10.5px] font-mono uppercase tracking-widest text-brand-electric-bright font-bold">
              {rams.id} &bull; v{rams.version}
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                rams.status === 'ACCEPTED_FOR_WORK' || rams.status === 'ISSUED'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : rams.status === 'CHANGES_REQUESTED'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 font-bold'
                  : 'bg-brand-void text-brand-mist border-brand-edge-dark'
              }`}
            >
              {rams.status.replace(/_/g, ' ')}
            </span>
            {rams.workOrderNumber && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-void text-brand-mist border border-brand-edge-dark">
                WO: {rams.workOrderNumber}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">{rams.title}</h1>
          <p className="text-xs text-brand-mist/70 font-mono">
            {rams.siteName} &bull; {rams.clientName} &bull; {rams.workCategory}
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleDuplicate}
            disabled={isDuplicating}
            className="px-3.5 py-2 rounded-lg border border-brand-edge-dark bg-brand-carbon hover:bg-brand-edge-dark text-white text-xs font-mono flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Copy className="w-3.5 h-3.5" />
            {isDuplicating ? 'Copying...' : 'Duplicate RAMS'}
          </button>

          <a
            href={`/api/contractor/rams/${encodeURIComponent(rams.id)}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 flex items-center gap-1.5 transition-colors shadow-md shadow-brand-electric/20"
          >
            <Download className="w-3.5 h-3.5" />
            Print / PDF Document
          </a>
        </div>
      </div>

      {/* Review Feedback Alert if Changes Requested */}
      {rams.status === 'CHANGES_REQUESTED' && rams.entirefmReview && (
        <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-950/20 text-amber-300 space-y-2 text-xs font-mono">
          <div className="flex items-center gap-2 font-bold text-white">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>EntireFM Safety Review — Changes Requested</span>
          </div>
          <p className="text-amber-200/90 font-sans leading-relaxed">
            {rams.entirefmReview.generalNotes || 'Please revise access equipment controls and clarify working at height arrangements.'}
          </p>
          <div className="text-[10.5px] text-amber-400/70 pt-1">
            Reviewed by {rams.entirefmReview.reviewedByName} on {new Date(rams.entirefmReview.reviewedAt).toLocaleDateString('en-GB')}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-brand-edge-dark overflow-x-auto pb-2 text-xs font-mono">
        {[
          { key: 'SCOPE', label: '1. Scope & Site' },
          { key: 'PEOPLE', label: '2. People & Competency' },
          { key: 'HAZARDS', label: `3. 5x5 Risk Matrix (${rams.hazards.length})` },
          { key: 'METHOD', label: `4. Method Steps (${rams.methodSteps.length})` },
          { key: 'SAFETY', label: '5. PPE, Plant & Permits' },
          { key: 'EMERGENCY', label: '6. Emergency & Waste' },
          { key: 'BRIEFING', label: `7. Briefing Sign-Off (${rams.operativeBriefings.length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === t.key
                ? 'bg-brand-electric text-white font-medium'
                : 'text-brand-mist hover:text-white hover:bg-brand-carbon'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">
        {/* TAB 1: Scope */}
        {activeTab === 'SCOPE' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-3">
              <h3 className="text-sm font-medium text-white border-b border-brand-edge-dark/60 pb-3">
                Job Context &amp; Location
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div>
                  <span className="text-brand-mist/50 block">Site Location</span>
                  <span className="text-white block mt-0.5">{rams.siteName}</span>
                  {rams.siteAddress && <span className="text-brand-mist/60 text-[11px] block">{rams.siteAddress}</span>}
                </div>
                <div>
                  <span className="text-brand-mist/50 block">Client Account</span>
                  <span className="text-white block mt-0.5">{rams.clientName}</span>
                </div>
                <div>
                  <span className="text-brand-mist/50 block">Planned Attendance</span>
                  <span className="text-white block mt-0.5">{rams.plannedStartDate} &bull; {rams.workingHours}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-3">
              <h3 className="text-sm font-medium text-white border-b border-brand-edge-dark/60 pb-3">
                Work Scope Description
              </h3>
              <p className="text-xs text-brand-mist/80 font-light leading-relaxed">
                {rams.workScopeDescription}
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: People */}
        {activeTab === 'PEOPLE' && (
          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-4">
            <h3 className="text-sm font-medium text-white border-b border-brand-edge-dark/60 pb-3">
              Assigned Operatives &amp; Verified Competencies (CP-04)
            </h3>
            <div className="divide-y divide-brand-edge-dark/30">
              {rams.assignedOperatives.map((op) => (
                <div key={op.operativeId} className="py-3 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-white font-medium block">{op.fullName}</span>
                    <span className="text-[11px] text-brand-mist/50 block">{op.role} &bull; {op.trade}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] border ${
                      op.eligibilityStatus === 'ELIGIBLE'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}
                  >
                    {op.eligibilityStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Hazards & 5x5 Matrix */}
        {activeTab === 'HAZARDS' && (
          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-4">
            <h3 className="text-sm font-medium text-white border-b border-brand-edge-dark/60 pb-3">
              5x5 Hazard Identification &amp; Risk Mitigation Matrix
            </h3>
            <div className="space-y-3">
              {rams.hazards.map((h) => (
                <div key={h.id} className="p-4 rounded-xl border border-brand-edge-dark bg-brand-void space-y-2 text-xs font-mono">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-white font-bold font-sans text-sm block">{h.hazard}</span>
                      <span className="text-[10.5px] text-brand-mist/50 block mt-0.5">
                        Persons at Risk: {h.personsAtRisk.join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded bg-rose-950/40 text-rose-300 border border-rose-800 text-[10.5px]">
                        Initial: L{h.initialLikelihood}×S{h.initialSeverity} ({h.initialRiskScore})
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800 text-[10.5px]">
                        Residual: L{h.residualLikelihood}×S{h.residualSeverity} ({h.residualRiskScore})
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-brand-mist/80 font-sans space-y-1 pt-2 border-t border-brand-edge-dark/50">
                    <span className="font-bold text-white block">Key Physical Controls:</span>
                    <ul className="list-disc list-inside space-y-0.5">
                      {h.controls.map((c, cIdx) => (
                        <li key={cIdx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Method Steps */}
        {activeTab === 'METHOD' && (
          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-4">
            <h3 className="text-sm font-medium text-white border-b border-brand-edge-dark/60 pb-3">
              Step-by-Step Method Statement Procedure
            </h3>
            <div className="space-y-3">
              {methodStepsFromRams(rams).map((s) => (
                <div key={s.sequence} className="p-4 rounded-xl border border-brand-edge-dark bg-brand-void space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="w-5 h-5 rounded bg-brand-electric/20 text-brand-electric flex items-center justify-center font-bold text-xs">
                        {s.sequence}
                      </span>
                      <span className="text-white font-bold">{s.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-brand-mist/50 uppercase">{s.responsibleRole}</span>
                  </div>
                  <p className="text-brand-mist/80 font-light leading-relaxed pl-7">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: Briefing Sign-Off */}
        {activeTab === 'BRIEFING' && (
          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-edge-dark/60 pb-4">
              <div>
                <h3 className="text-sm font-medium text-white">Digital Operative Briefing Register</h3>
                <p className="text-xs text-brand-mist/60 font-light mt-0.5">
                  Operatives assigned to this job must confirm they have read, understood, and will comply with all identified controls.
                </p>
              </div>

              {!isBriefed && (
                <button
                  type="button"
                  onClick={handleSignBriefing}
                  disabled={isSigningBriefing}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold transition-colors disabled:opacity-50 shrink-0 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isSigningBriefing ? 'Signing...' : 'Sign Briefing (Read & Understood)'}
                </button>
              )}
            </div>

            <div className="divide-y divide-brand-edge-dark/30 text-xs font-mono">
              {rams.operativeBriefings.length === 0 ? (
                <div className="py-6 text-center text-brand-mist/50">
                  No operative briefings recorded yet for version {rams.version}.
                </div>
              ) : (
                rams.operativeBriefings.map((b, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="text-white font-medium block">{b.operativeName}</span>
                      <span className="text-[10.5px] text-brand-mist/50 block">
                        Briefed on v{b.version} &bull; {new Date(b.briefedAt).toLocaleString('en-GB')}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                      READ &amp; UNDERSTOOD
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function methodStepsFromRams(rams: RamsRecord) {
  return rams.methodSteps && rams.methodSteps.length > 0
    ? rams.methodSteps
    : [
        {
          sequence: 1,
          title: 'Arrival & Sign-In',
          description: 'Report to site reception, sign in, and verify site access keys.',
          responsibleRole: 'Lead Operative',
        },
      ];
}
