'use client';

/**
 * CLIENT COMPONENT: WorkOrderDetailClient
 * =======================================
 * Premium work order operational hub with 14-stage lifecycle stepper,
 * live SLA countdown, arrival verification, quote approvals, and client sign-off.
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  QrCode,
  Wrench,
  UserCheck,
  FileText,
  DollarSign,
  ShieldCheck,
  Coins,
  Send,
  Camera,
  ExternalLink,
  BrainCircuit,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface WorkOrderDetailClientProps {
  workOrder: any;
  sessionUser: {
    id: string;
    name: string;
    role: string;
    orgType: string;
  };
}

const LIFECYCLE_STAGES = [
  { id: 'REPORTED', label: 'Reported' },
  { id: 'TRIAGED', label: 'Triaged' },
  { id: 'ASSIGNED', label: 'Assigned' },
  { id: 'ACCEPTED', label: 'Accepted' },
  { id: 'SCHEDULED', label: 'Scheduled' },
  { id: 'EN_ROUTE', label: 'En Route' },
  { id: 'ON_SITE', label: 'On Site' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'AWAITING', label: 'Awaiting Parts/Quote' },
  { id: 'COMPLETED', label: 'Completed' },
  { id: 'QA', label: 'QA / Sign-off' },
  { id: 'CLOSED', label: 'Closed' },
];

export function WorkOrderDetailClient({
  workOrder,
  sessionUser,
}: WorkOrderDetailClientProps) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'quotes' | 'evidence_ai' | 'attendance'>('timeline');
  const [newNote, setNewNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [approvingQuoteId, setApprovingQuoteId] = useState<string | null>(null);
  const [signOffNotes, setSignOffNotes] = useState('');
  const [isSigningOff, setIsSigningOff] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  
  // AI Post-Attendance Evidence Intelligence
  const [evidenceAnalysis, setEvidenceAnalysis] = useState<any | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  const fetchEvidenceAnalysis = async () => {
    setIsLoadingAnalysis(true);
    try {
      const res = await fetch(`/api/work-orders/${encodeURIComponent(workOrder.id)}/evidence-analysis`);
      if (res.ok) {
        const data = await res.json();
        setEvidenceAnalysis(data.analysis);
      }
    } catch (err) {
      console.warn('[EVIDENCE_AI_FETCH_ERR]', err);
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  useEffect(() => {
    fetchEvidenceAnalysis();
  }, [workOrder.id]);

  // Map status to current lifecycle index
  const getCurrentStageIndex = (status: string, holdReason?: string) => {
    const s = status.toUpperCase();
    if (s === 'DRAFT' || s === 'SUBMITTED' || s === 'REPORTED') return 0;
    if (s === 'OPEN' || s === 'TRIAGE') return 1;
    if (s === 'ISSUED' || s === 'OFFERED' || s === 'ASSIGNED') return 2;
    if (s === 'ACCEPTED') return 3;
    if (s === 'SCHEDULED') return 4;
    if (s === 'EN_ROUTE') return 5;
    if (s === 'ON_SITE') return 6;
    if (s === 'IN_PROGRESS') return 7;
    if (s === 'ON_HOLD' || s === 'AWAITING' || (holdReason && holdReason.startsWith('AWAITING'))) return 8;
    if (s === 'COMPLETION_PENDING' || s === 'COMPLETED') return 9;
    if (s === 'QA') return 10;
    if (s === 'CLOSED') return 11;
    return 1;
  };

  const currentStageIndex = getCurrentStageIndex(workOrder.status, workOrder.hold_reason);

  const handleApproveQuote = async (quoteId: string) => {
    setApprovingQuoteId(quoteId);
    try {
      const res = await fetch(`/api/clients/quotes/${encodeURIComponent(quoteId)}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'APPROVE', notes: `Approved by ${sessionUser.name}` }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedbackMsg(data.message || 'Quote approved successfully. Contractor notified to proceed.');
      } else {
        setFeedbackMsg(data.error || 'Failed to approve quote.');
      }
    } catch {
      setFeedbackMsg('Network error while recording quote approval.');
    } finally {
      setApprovingQuoteId(null);
    }
  };

  const handleClientSignOff = async () => {
    setIsSigningOff(true);
    try {
      const res = await fetch(`/api/clients/work-orders/${encodeURIComponent(workOrder.id)}/sign-off`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ satisfaction_rating: 5, notes: signOffNotes || 'Signed off with full satisfaction' }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedbackMsg(data.message || 'Client satisfaction sign-off registered. Work order closed.');
      } else {
        setFeedbackMsg(data.error || 'Failed to record sign-off.');
      }
    } catch {
      setFeedbackMsg('Network error while recording client sign-off.');
    } finally {
      setIsSigningOff(false);
    }
  };

  const isBreached = workOrder.sla_status?.status === 'BREACHED';
  const isAtRisk = workOrder.sla_status?.status === 'AT_RISK';
  const verifiedScans = (workOrder.scans || []).filter((s: any) => s.scan_event_type === 'CHECK_IN' || s.scan_event_type === 'ATTENDANCE_VERIFIED');

  return (
    <div className="space-y-6">
      {/* ─── BREADCRUMB & TOP ACTIONS ────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Link
          href="/clients/work-orders"
          className="inline-flex items-center gap-1.5 text-xs text-brand-mist/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Triage Board
        </Link>
        <span className="text-[11px] text-brand-mist/40 font-mono">
          WO Ref: {workOrder.work_order_number}
        </span>
      </div>

      {/* ─── SUMMARY HERO CARD ───────────────────────────────────────────── */}
      <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/80 p-6 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded bg-brand-electric/10 border border-brand-electric/30 px-2.5 py-0.5 font-mono text-xs font-bold text-brand-electric-bright">
                {workOrder.work_order_number}
              </span>
              <span className="rounded bg-brand-void border border-brand-edge-dark px-2 py-0.5 text-[11px] text-brand-mist/70">
                {workOrder.priority}
              </span>
              <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] text-emerald-400">
                {workOrder.status}
              </span>
            </div>
            <h1 className="text-2xl font-light text-white tracking-tight">{workOrder.title}</h1>
            <p className="text-xs text-brand-mist/70 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-electric" />
              {workOrder.site?.name} {workOrder.site?.address_line1 ? `· ${workOrder.site.address_line1}, ${workOrder.site.city}` : ''}
            </p>
          </div>

          {/* SLA Countdown Radar */}
          <div className="rounded-xl border border-brand-edge-dark bg-brand-void/80 p-3 text-right min-w-[200px]">
            <span className="text-[10px] uppercase tracking-wider text-brand-mist/50 block">SLA Resolution Radar</span>
            {isBreached ? (
              <span className="text-sm font-bold text-rose-400 flex items-center justify-end gap-1 mt-1">
                <AlertTriangle className="w-4 h-4" /> SLA BREACHED
              </span>
            ) : isAtRisk ? (
              <span className="text-sm font-bold text-amber-400 flex items-center justify-end gap-1 mt-1">
                <Clock className="w-4 h-4 animate-pulse" /> {Math.round(workOrder.sla_status?.minutesRemaining || 0)}m remaining
              </span>
            ) : (
              <span className="text-sm font-normal text-emerald-400 flex items-center justify-end gap-1 mt-1">
                <CheckCircle2 className="w-4 h-4" /> On Target
              </span>
            )}
            <span className="text-[10.5px] text-brand-mist/40 block mt-0.5">
              Target: {workOrder.sla_resolution_due_at ? new Date(workOrder.sla_resolution_due_at).toLocaleString('en-GB') : '24h Standard'}
            </span>
          </div>
        </div>

        {/* ─── 14-STAGE LIFECYCLE STEPPER ─────────────────────────────────── */}
        <div className="pt-4 border-t border-brand-edge-dark/50">
          <span className="text-[10px] uppercase font-bold text-brand-mist/40 tracking-wider block mb-3">
            Operational Lifecycle Progress
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-1 text-center">
            {LIFECYCLE_STAGES.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <div
                  key={stage.id}
                  className={`p-2 rounded-xl border text-[10.5px] font-normal transition-all ${
                    isCurrent
                      ? 'bg-brand-electric text-white border-brand-electric font-semibold shadow-md shadow-brand-electric/30'
                      : isPast
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-brand-void/40 border-brand-edge-dark/40 text-brand-mist/40'
                  }`}
                >
                  <span className="block truncate">{stage.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Client Sign-Off Action Banner */}
        {['COMPLETED', 'QA', 'IN_PROGRESS'].includes(workOrder.status) && (
          <div className="pt-4 border-t border-brand-edge-dark/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-brand-void/40 p-3.5 rounded-xl border border-brand-edge-dark">
            <div className="space-y-0.5">
              <span className="text-xs font-medium text-white block">Client Handover &amp; Satisfaction Sign-Off</span>
              <span className="text-[11px] text-brand-mist/60 block">Confirm satisfactory completion of works to close out the ticket and update estate analytics.</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={signOffNotes}
                onChange={(e) => setSignOffNotes(e.target.value)}
                placeholder="Optional satisfaction notes..."
                className="rounded-lg bg-brand-carbon border border-brand-edge-dark px-2.5 py-1.5 text-xs text-white placeholder-brand-mist/30 focus:border-brand-electric focus:outline-none"
              />
              <button
                onClick={handleClientSignOff}
                disabled={isSigningOff || workOrder.status === 'CLOSED'}
                className="px-4 py-1.5 rounded-lg bg-emerald-500 text-brand-void text-xs font-semibold hover:bg-emerald-400 transition-all whitespace-nowrap disabled:opacity-50 flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {workOrder.status === 'CLOSED' ? 'Signed Off' : isSigningOff ? 'Closing...' : 'Sign Off & Close'}
              </button>
            </div>
          </div>
        )}

        {feedbackMsg && (
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}
      </div>

      {/* ─── KEY OPERATIONAL CONTEXT GRID ────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Linked Asset & QR Tag */}
        <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/40 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Linked Asset</h3>
            <QrCode className="w-4 h-4 text-brand-electric" />
          </div>
          {workOrder.asset ? (
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-brand-mist/50 block">Asset Tag</span>
                <span className="font-mono text-brand-electric-bright font-medium">{workOrder.asset.asset_reference}</span>
              </div>
              <div>
                <span className="text-brand-mist/50 block">Equipment Name</span>
                <span className="text-white font-normal">{workOrder.asset.name}</span>
              </div>
              <div>
                <span className="text-brand-mist/50 block">Category / Make</span>
                <span className="text-brand-mist/80">{workOrder.asset.category} · {workOrder.asset.manufacturer || 'N/A'}</span>
              </div>
              <div className="pt-1">
                <Link
                  href={`/asset/${workOrder.asset.id}?wo=${workOrder.id}`}
                  className="inline-flex items-center gap-1.5 text-xs text-brand-electric-bright hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View Asset QR History
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-xs text-brand-mist/40">No specific plant asset linked.</p>
          )}
        </div>

        {/* Assigned Contractor & Engineer */}
        <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/40 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Assigned Contractor</h3>
            <UserCheck className="w-4 h-4 text-brand-electric" />
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-brand-mist/50 block">Contractor Partner</span>
              <span className="text-white font-normal">{workOrder.provider?.name || 'EntireFM Direct Operations'}</span>
            </div>
            <div>
              <span className="text-brand-mist/50 block">Lead Operative</span>
              <span className="text-white font-normal">
                {workOrder.lead_engineer ? `${workOrder.lead_engineer.first_name} ${workOrder.lead_engineer.last_name}` : 'Dispatched Operative'}
              </span>
            </div>
            <div>
              <span className="text-brand-mist/50 block">Contact</span>
              <span className="text-brand-mist/70">{workOrder.lead_engineer?.phone || workOrder.provider?.phone || 'Via EntireFM Helpdesk'}</span>
            </div>
          </div>
        </div>

        {/* Attendance & Physical Verification */}
        <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/40 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Attendance Verification</h3>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-brand-mist/50 block">On-Site QR Verification</span>
              {verifiedScans.length > 0 ? (
                <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Physical Scan Verified
                </span>
              ) : (
                <span className="text-amber-400/80">Pending Operative Scan</span>
              )}
            </div>
            {verifiedScans.length > 0 && (
              <div>
                <span className="text-brand-mist/50 block">Arrival Timestamp</span>
                <span className="font-mono text-white text-[11px]">{new Date(verifiedScans[0].created_at).toLocaleString('en-GB')}</span>
              </div>
            )}
            <div>
              <span className="text-brand-mist/50 block">Target Completion</span>
              <span className="text-brand-mist/80">
                {workOrder.target_completion_at ? new Date(workOrder.target_completion_at).toLocaleDateString('en-GB') : 'Standard SLA Window'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── TABBED OPERATIONAL DETAILS ──────────────────────────────────── */}
      <div className="border-b border-brand-edge-dark flex gap-2 text-xs">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg transition-colors ${
            activeTab === 'timeline'
              ? 'border-b-2 border-brand-electric text-white font-medium bg-brand-carbon/60'
              : 'text-brand-mist/60 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" /> Timeline &amp; Notes ({(workOrder.activities || []).length})
        </button>

        <button
          onClick={() => setActiveTab('quotes')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg transition-colors ${
            activeTab === 'quotes'
              ? 'border-b-2 border-brand-electric text-white font-medium bg-brand-carbon/60'
              : 'text-brand-mist/60 hover:text-white'
          }`}
        >
          <Coins className="w-3.5 h-3.5" /> Quotes &amp; Approvals ({(workOrder.quotes || []).length})
        </button>

        <button
          onClick={() => setActiveTab('evidence_ai')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg transition-colors ${
            activeTab === 'evidence_ai'
              ? 'border-b-2 border-brand-electric text-white font-medium bg-brand-carbon/60'
              : 'text-brand-mist/60 hover:text-white'
          }`}
        >
          <BrainCircuit className="w-3.5 h-3.5 text-brand-electric" /> AI Evidence Intelligence
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg transition-colors ${
            activeTab === 'attendance'
              ? 'border-b-2 border-brand-electric text-white font-medium bg-brand-carbon/60'
              : 'text-brand-mist/60 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Attendance Audits ({(workOrder.scans || []).length})
        </button>
      </div>

      {/* ─── TAB CONTENT PANELS ──────────────────────────────────────────── */}
      {activeTab === 'timeline' && (
        <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/40 p-5 space-y-4">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Live Activity Stream</h3>
          <div className="space-y-3">
            {(workOrder.activities || []).length === 0 ? (
              <p className="text-xs text-brand-mist/40 py-4">Ticket created. Awaiting dispatch update.</p>
            ) : (
              (workOrder.activities || []).map((act: any) => (
                <div key={act.id} className="p-3 rounded-xl bg-brand-void/60 border border-brand-edge-dark/50 text-xs space-y-1">
                  <div className="flex items-center justify-between text-brand-mist/50">
                    <span className="font-medium text-white">{act.actor ? `${act.actor.first_name} ${act.actor.last_name}` : 'EntireFM System'}</span>
                    <span className="font-mono text-[10.5px]">{new Date(act.created_at).toLocaleString('en-GB')}</span>
                  </div>
                  <p className="text-brand-mist/90">{act.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'quotes' && (
        <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/40 p-5 space-y-4">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Variation Quotes Requiring Approval</h3>
          {(workOrder.quotes || []).length === 0 ? (
            <p className="text-xs text-brand-mist/40 py-4">No commercial variations or parts quotes required for this work order.</p>
          ) : (
            (workOrder.quotes || []).map((q: any) => (
              <div key={q.id} className="p-4 rounded-xl border border-brand-edge-dark bg-brand-void/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-brand-electric-bright">{q.quote_number}</span>
                    <h4 className="text-sm font-medium text-white">{q.title}</h4>
                  </div>
                  <span className="text-base font-semibold text-emerald-400">
                    £{Number(q.total_price_gbp).toFixed(2)} + VAT
                  </span>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => handleApproveQuote(q.id)}
                    disabled={approvingQuoteId === q.id || q.status === 'APPROVED'}
                    className="px-4 py-2 rounded-xl bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 transition-all disabled:opacity-50"
                  >
                    {q.status === 'APPROVED' ? 'Approved' : approvingQuoteId === q.id ? 'Approving...' : '1-Click Approve Quote'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'evidence_ai' && (
        <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/40 p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-brand-edge-dark pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-electric" />
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                  Post-Attendance Multimodal Evidence Intelligence
                </h3>
              </div>
              <p className="text-[11px] text-brand-mist/60 mt-0.5">
                Automated advisory analysis of uploaded engineer photographs, completion records, and telemetry.
              </p>
            </div>

            <button
              onClick={fetchEvidenceAnalysis}
              disabled={isLoadingAnalysis}
              className="px-3 py-1.5 rounded-lg border border-brand-edge-dark bg-brand-void text-xs text-brand-mist hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingAnalysis ? 'animate-spin' : ''}`} />
              Re-Analyze
            </button>
          </div>

          {isLoadingAnalysis ? (
            <div className="py-8 text-center space-y-2">
              <RefreshCw className="w-6 h-6 text-brand-electric animate-spin mx-auto" />
              <p className="text-xs text-brand-mist">Evaluating uploaded photos and completion sheets...</p>
            </div>
          ) : evidenceAnalysis ? (
            <div className="space-y-4">
              {/* Mandatory Advisory Governance Badge */}
              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-start gap-2.5">
                <BrainCircuit className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs">
                  <span className="font-semibold text-sky-300">
                    {evidenceAnalysis.advisoryLabel || 'AI Observation & Recommendation'}
                  </span>
                  <p className="text-[11px] text-brand-mist/80">
                    {evidenceAnalysis.disclaimer}
                  </p>
                </div>
              </div>

              {/* Observations */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-semibold text-brand-mist uppercase tracking-wider">AI Observations</h4>
                <div className="space-y-2">
                  {evidenceAnalysis.observations.map((obs: any) => (
                    <div key={obs.id} className="p-3 rounded-xl bg-brand-void/80 border border-brand-edge-dark text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{obs.category}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {obs.confidence} Confidence
                        </span>
                      </div>
                      <p className="text-brand-mist/90">{obs.observation}</p>
                      <div className="text-[10px] text-brand-mist/50">Ref: {obs.evidenceReference}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {evidenceAnalysis.recommendations?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-semibold text-brand-mist uppercase tracking-wider">AI Recommendations</h4>
                  <div className="space-y-2">
                    {evidenceAnalysis.recommendations.map((rec: any) => (
                      <div key={rec.id} className="p-3 rounded-xl bg-brand-void/80 border border-brand-edge-dark text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-brand-electric-bright">Recommended Action</span>
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-brand-carbon text-brand-mist">
                            {rec.priority} Priority
                          </span>
                        </div>
                        <p className="text-white">{rec.recommendation}</p>
                        <p className="text-[10.5px] text-brand-mist/60">{rec.rationale}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Safety Flags */}
              {evidenceAnalysis.safetyFlags?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Safety Flags</h4>
                  <div className="space-y-2">
                    {evidenceAnalysis.safetyFlags.map((sf: any) => (
                      <div key={sf.id} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1 text-amber-300">
                        <div className="flex items-center gap-1.5 font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" /> Safety Review Advisory
                        </div>
                        <p className="text-[11.5px]">{sf.issue}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-brand-mist/40 py-4">Evidence intelligence initialized. Run analysis to inspect submitted materials.</p>
          )}
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="rounded-2xl border border-brand-edge-dark bg-brand-carbon/40 p-5 space-y-4">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Physical Check-In &amp; QR Attendance History</h3>
          <div className="space-y-2">
            {(workOrder.scans || []).length === 0 ? (
              <p className="text-xs text-brand-mist/40 py-4">No on-site QR scans recorded yet.</p>
            ) : (
              (workOrder.scans || []).map((s: any) => (
                <div key={s.id} className="p-3 rounded-xl bg-brand-void/60 border border-brand-edge-dark text-xs flex items-center justify-between">
                  <div>
                    <span className="text-white font-medium block">{s.person ? `${s.person.first_name} ${s.person.last_name}` : 'Operative'}</span>
                    <span className="text-[10.5px] text-brand-mist/50">{s.notes || s.scan_event_type}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[11px] text-brand-electric-bright block">{new Date(s.created_at).toLocaleTimeString('en-GB')}</span>
                    <span className="text-[10px] text-brand-mist/40">{new Date(s.created_at).toLocaleDateString('en-GB')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
