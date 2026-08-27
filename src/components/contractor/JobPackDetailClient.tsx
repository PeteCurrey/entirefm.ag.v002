'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Wrench,
  ShieldCheck,
  Building2,
  AlertOctagon,
  Phone,
  Camera,
  MapPin,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { JobPackRecord } from '@/server/contractor/job-pack-engine';
import { StopWorkModal } from './StopWorkModal';

interface Props {
  jobPack: JobPackRecord;
  currentPersonId?: string;
}

export function JobPackDetailClient({ jobPack: initialPack, currentPersonId }: Props) {
  const [pack, setPack] = useState<JobPackRecord>(initialPack);
  const [isSigningBriefing, setIsSigningBriefing] = useState(false);
  const [isStopWorkOpen, setIsStopWorkOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignBriefing = async () => {
    setIsSigningBriefing(true);
    try {
      const res = await fetch(`/api/contractor/job-packs/${encodeURIComponent(pack.id)}/briefing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operativeId: currentPersonId }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to record briefing');

      // Refresh pack
      const getRes = await fetch(`/api/contractor/job-packs/${encodeURIComponent(pack.id)}`);
      const getData = await getRes.json();
      if (getData.jobPack) setPack(getData.jobPack);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign briefing');
    } finally {
      setIsSigningBriefing(false);
    }
  };

  const isBriefed = pack.briefings.some(
    (b) => b.operativeId === currentPersonId && b.jobPackVersion === pack.version
  );

  const isReady = pack.readiness.isReadyForAttendance;
  const blockers = pack.readiness.blockingReasons;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href={`/contractor/work`}
          className="text-xs text-brand-mist/60 hover:text-white flex items-center gap-1.5 font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Work Orders
        </Link>
      </div>

      {/* Header Banner */}
      <div className="rounded-2xl border border-brand-edge-dark bg-gradient-to-r from-brand-carbon via-brand-carbon/90 to-brand-void p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10.5px] font-mono uppercase tracking-widest text-brand-electric-bright font-bold">
              {pack.id} &bull; v{pack.version}
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                isReady
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20 font-bold'
              }`}
            >
              {isReady ? 'READY FOR ATTENDANCE' : 'ACTION REQUIRED'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-void text-brand-mist border border-brand-edge-dark">
              WO: {pack.workOrderNumber}
            </span>
            {pack.readiness.gatingPolicy === 'EMERGENCY_BYPASS' && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                EMERGENCY P1 BYPASS
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">{pack.workOrderNumber} &bull; {pack.trade}</h1>
          <p className="text-xs text-brand-mist/70 font-mono">
            {pack.siteName} &bull; {pack.clientName} &bull; Planned: {pack.plannedAttendanceDate} ({pack.plannedAttendanceTime})
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsStopWorkOpen(true)}
            className="px-3.5 py-2 rounded-lg border border-rose-800/60 bg-rose-950/20 hover:bg-rose-950/40 text-rose-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            Stop Work
          </button>

          <a
            href={`/api/contractor/job-packs/${encodeURIComponent(pack.id)}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 flex items-center gap-1.5 transition-colors shadow-md shadow-brand-electric/20"
          >
            <Download className="w-3.5 h-3.5" />
            Print / PDF Job Pack
          </a>
        </div>
      </div>

      {/* Stop Work Safety Alert if Active */}
      {pack.stoppedWorkEvent && (
        <div className="p-4 rounded-xl border border-rose-700 bg-rose-950/40 text-rose-300 space-y-2 text-xs font-mono">
          <div className="flex items-center gap-2 font-bold text-white">
            <AlertOctagon className="w-5 h-5 text-rose-400" />
            <span>SAFETY STOP WORK ENGAGED: {pack.stoppedWorkEvent.reasonCategory}</span>
          </div>
          <p className="text-rose-200/90 font-sans leading-relaxed">
            {pack.stoppedWorkEvent.details}
          </p>
          <div className="text-[10.5px] text-rose-400/70 pt-1">
            Reported by {pack.stoppedWorkEvent.stoppedByName} on {new Date(pack.stoppedWorkEvent.stoppedAt).toLocaleString('en-GB')}
          </div>
        </div>
      )}

      {/* Blocking Reasons Alert if Not Ready */}
      {!isReady && blockers.length > 0 && (
        <div className="p-4 rounded-xl border border-rose-800/50 bg-rose-950/20 text-xs font-mono space-y-2">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Pre-Attendance Action Required ({blockers.length} Items):</span>
          </div>
          <div className="space-y-1.5 pl-6">
            {blockers.map((b, idx) => (
              <div key={idx} className="text-rose-200/90 font-sans flex items-start justify-between gap-4">
                <span>&bull; <strong className="text-white">{b.title}:</strong> {b.detail}</span>
                {b.actionUrl && (
                  <Link href={b.actionUrl} className="text-brand-electric-bright hover:underline shrink-0 font-mono text-[11px]">
                    Resolve &rarr;
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Site Access Conflict Warning */}
      {pack.siteInstructions?.accessConflictDetected && (
        <div className="p-3.5 rounded-lg border border-amber-500/40 bg-amber-950/20 text-amber-300 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{pack.siteInstructions.conflictDetail}</span>
        </div>
      )}

      {/* 2-Column Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Scope, Operative & RAMS */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Scope & Location */}
          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-3">
            <h3 className="text-sm font-medium text-white border-b border-brand-edge-dark/60 pb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-electric" />
              1. Work Scope &amp; Site Information
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div>
                <span className="text-brand-mist/50 block">Scope Description</span>
                <p className="text-white font-sans text-xs mt-0.5 leading-relaxed">{pack.scopeDescription}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-brand-edge-dark/40">
                <div>
                  <span className="text-brand-mist/50 block">Site Location</span>
                  <span className="text-white block mt-0.5">{pack.siteName}</span>
                  <span className="text-brand-mist/60 text-[11px] block">{pack.siteAddress}</span>
                </div>
                <div>
                  <span className="text-brand-mist/50 block">Access Hours &amp; Contact</span>
                  <span className="text-white block mt-0.5">{pack.siteInstructions?.accessHours}</span>
                  <span className="text-brand-mist/60 text-[11px] block">
                    {pack.siteInstructions?.contactName} ({pack.siteInstructions?.contactPhone})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Assigned Operative & CP-04 Competency Snapshot */}
          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-3">
            <h3 className="text-sm font-medium text-white border-b border-brand-edge-dark/60 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-brand-electric" />
              2. Assigned Operative &amp; Verified Competency (CP-04)
            </h3>
            {pack.assignedOperative ? (
              <div className="space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold font-sans text-sm block">{pack.assignedOperative.fullName}</span>
                    <span className="text-brand-mist/50 text-[11px] block">
                      {pack.assignedOperative.jobTitle} &bull; {pack.assignedOperative.trade}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] border ${
                      pack.assignedOperative.eligibilityStatus === 'ELIGIBLE'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}
                  >
                    {pack.assignedOperative.eligibilityStatus}
                  </span>
                </div>

                <div className="pt-2 border-t border-brand-edge-dark/40 space-y-1">
                  <span className="text-brand-mist/50 block text-[10.5px] uppercase">Verified Qualifications &amp; Accreditations:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {pack.assignedOperative.relevantQualifications.map((q, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-brand-void text-white border border-brand-edge-dark text-[11px]">
                        {q}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center text-brand-mist/50 text-xs font-mono">
                No operative assigned to this work order.
              </div>
            )}
          </div>

          {/* Section 3: RAMS Status (CP-05) */}
          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-3">
            <h3 className="text-sm font-medium text-white border-b border-brand-edge-dark/60 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              3. Risk Assessment &amp; Method Statement (CP-05)
            </h3>
            {pack.ramsRecord ? (
              <div className="flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-white font-medium block">{pack.ramsRecord.title}</span>
                  <span className="text-brand-mist/50 text-[11px] block">
                    Ref: {pack.ramsRecord.ramsId} (v{pack.ramsRecord.version})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] border ${
                      pack.ramsRecord.isApproved
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {pack.ramsRecord.status.replace(/_/g, ' ')}
                  </span>
                  <Link
                    href={`/contractor/rams/${encodeURIComponent(pack.ramsRecord.ramsId)}`}
                    className="text-brand-electric-bright hover:underline text-xs"
                  >
                    View RAMS &rarr;
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-brand-mist/50">No RAMS linked yet.</span>
                <Link
                  href={`/contractor/rams/create?workOrderId=${encodeURIComponent(pack.workOrderId)}`}
                  className="px-3 py-1 rounded bg-brand-electric text-white text-xs font-semibold"
                >
                  Create RAMS &rarr;
                </Link>
              </div>
            )}
          </div>

          {/* Section 4: Mandatory Field Evidence Checklist */}
          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-4">
            <h3 className="text-sm font-medium text-white border-b border-brand-edge-dark/60 pb-3 flex items-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" />
              4. Mandatory Field Evidence Checklist
            </h3>
            <div className="divide-y divide-brand-edge-dark/30 text-xs font-mono">
              {pack.evidenceChecklist.map((ev) => (
                <div key={ev.id} className="py-2.5 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.2 rounded bg-brand-void text-brand-electric border border-brand-edge-dark text-[9.5px]">
                        {ev.phase}
                      </span>
                      <span className="text-white font-medium">{ev.title}</span>
                    </div>
                    <p className="text-[11px] text-brand-mist/70 font-sans mt-0.5">{ev.description}</p>
                  </div>
                  <span className="text-brand-mist/50 shrink-0 text-[10.5px]">
                    {ev.uploadedCount > 0 ? `${ev.uploadedCount} uploaded` : 'Pending on site'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Safety, Emergency & Briefing Register */}
        <div className="space-y-6">
          {/* Section 5: PPE & Access Plant */}
          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-3 text-xs font-mono">
            <h3 className="text-sm font-medium text-white border-b border-brand-edge-dark/60 pb-3 flex items-center gap-2 font-sans">
              <Wrench className="w-4 h-4 text-brand-electric" />
              5. PPE &amp; Equipment
            </h3>
            <div className="space-y-2">
              <span className="text-brand-mist/50 block text-[10.5px] uppercase">Mandatory PPE:</span>
              <div className="flex flex-wrap gap-1">
                {pack.ppeRequired.map((p, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-brand-void text-white border border-brand-edge-dark text-[10.5px]">
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-2 pt-2 border-t border-brand-edge-dark/40">
              <span className="text-brand-mist/50 block text-[10.5px] uppercase">Plant &amp; Access:</span>
              <div className="flex flex-wrap gap-1">
                {pack.plantRequired.map((pl, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-brand-void text-white border border-brand-edge-dark text-[10.5px]">
                    {pl}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 6: Emergency & Hospital */}
          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-3 text-xs font-mono">
            <h3 className="text-sm font-medium text-white border-b border-brand-edge-dark/60 pb-3 flex items-center gap-2 font-sans">
              <Phone className="w-4 h-4 text-emerald-400" />
              6. Emergency Arrangements
            </h3>
            <div className="space-y-2">
              <div>
                <span className="text-brand-mist/50 block">Emergency Operations Line</span>
                <span className="text-white font-bold block mt-0.5">{pack.emergencyArrangements.emergencyContact}</span>
              </div>
              <div>
                <span className="text-brand-mist/50 block">Nearest Hospital (A&amp;E)</span>
                <span className="text-white block mt-0.5">{pack.emergencyArrangements.nearestHospital}</span>
              </div>
              <div>
                <span className="text-brand-mist/50 block">Evacuation Assembly Point</span>
                <span className="text-brand-mist/80 font-sans block mt-0.5">{pack.emergencyArrangements.evacuationRoute}</span>
              </div>
            </div>
          </div>

          {/* Section 7: Digital Briefing Sign-Off */}
          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-brand-edge-dark/60 pb-3">
              <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                7. Pre-Attendance Briefing
              </h3>
            </div>

            <div className="space-y-3 text-xs font-mono">
              {!isBriefed ? (
                <div className="space-y-3">
                  <p className="text-brand-mist/80 font-sans leading-relaxed">
                    Operative must review scope, site hazards, RAMS controls, and evidence checklist before attending site.
                  </p>
                  <button
                    type="button"
                    onClick={handleSignBriefing}
                    disabled={isSigningBriefing}
                    className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isSigningBriefing ? 'Signing...' : 'Sign Briefing (Read & Understood)'}
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Briefing Confirmed</span>
                  </div>
                  <span className="text-[11px] text-brand-mist block">
                    Acknowledged for Job Pack v{pack.version}.
                  </span>
                </div>
              )}

              {pack.briefings.length > 0 && (
                <div className="pt-2 border-t border-brand-edge-dark/40 divide-y divide-brand-edge-dark/30">
                  {pack.briefings.map((b, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between text-[11px]">
                      <div>
                        <span className="text-white font-medium block">{b.operativeName}</span>
                        <span className="text-brand-mist/50 block">{new Date(b.briefedAt).toLocaleString('en-GB')}</span>
                      </div>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9.5px]">
                        SIGNED
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stop Work Modal */}
      <StopWorkModal
        isOpen={isStopWorkOpen}
        onClose={() => setIsStopWorkOpen(false)}
        onSuccess={() => {
          setPack((prev) => ({
            ...prev,
            stoppedWorkEvent: {
              stoppedByPersonId: currentPersonId || 'user',
              stoppedByName: 'Operative',
              stoppedAt: new Date().toISOString(),
              reasonCategory: 'SAFETY_HOLD',
              details: 'Safety stop work engaged from field screen.',
            },
            readiness: {
              ...prev.readiness,
              status: 'ACTION_REQUIRED',
              isReadyForAttendance: false,
            },
          }));
        }}
        jobPackId={pack.id}
        workOrderNumber={pack.workOrderNumber}
      />
    </div>
  );
}
