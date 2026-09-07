'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  ChevronLeft,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Camera,
  Plus,
  Navigation,
  FileText,
  ShieldCheck,
  Wrench,
  Upload,
  Phone,
  AlertOctagon,
  Eye,
  Sliders,
  DollarSign,
  Send,
  Sparkles,
  RefreshCw,
  Download,
  WifiOff,
  Mic,
  Check,
  ChevronRight,
  User,
  Building,
  HardHat,
  Package,
} from 'lucide-react';
import {
  DigitalJobPack,
  PpmChecklistItem,
  FieldEvidenceItem,
  OperationalDefectRecord,
  VariationRequestRecord,
  OperationalPartRecord,
  DigitalServiceReport,
  FieldVisitRecord,
} from '@/server/field/operations-store';

interface Props {
  visit: FieldVisitRecord;
  tasks: PpmChecklistItem[];
  readings: any[];
  parts: OperationalPartRecord[];
  serviceReport: DigitalServiceReport | null;
  session: { personId: string; displayName: string };
}

export default function FieldJobScreen({
  visit: initialVisit,
  tasks: initialTasks,
  parts: initialParts,
  serviceReport: initialReport,
  session,
}: Props) {
  const [visit, setVisit] = useState<FieldVisitRecord>(initialVisit);
  const [tasks, setTasks] = useState<PpmChecklistItem[]>(
    initialVisit.ppm_tasks && initialVisit.ppm_tasks.length > 0 ? initialVisit.ppm_tasks : initialTasks
  );
  const [evidenceList, setEvidenceList] = useState<FieldEvidenceItem[]>(initialVisit.evidence_items || []);
  const [defectsList, setDefectsList] = useState<OperationalDefectRecord[]>(initialVisit.defects || []);
  const [variationsList, setVariationsList] = useState<VariationRequestRecord[]>(initialVisit.variations || []);
  const [partsList, setPartsList] = useState<OperationalPartRecord[]>(
    initialVisit.parts_used && initialVisit.parts_used.length > 0 ? initialVisit.parts_used : initialParts
  );
  const [report, setReport] = useState<DigitalServiceReport | null>(
    initialVisit.service_report || initialReport
  );

  // Active Tab: 'WORK' | 'JOB_PACK' | 'EVIDENCE' | 'DEFECTS' | 'REPORT'
  const [activeTab, setActiveTab] = useState<'WORK' | 'JOB_PACK' | 'EVIDENCE' | 'DEFECTS' | 'REPORT'>('WORK');

  // Modals / Bottom Sheets
  const [noAccessOpen, setNoAccessOpen] = useState(false);
  const [noAccessReason, setNoAccessReason] = useState('Site closed / No keyholder present');
  const [noAccessNotes, setNoAccessNotes] = useState('');

  const [defectModalOpen, setDefectModalOpen] = useState(false);
  const [defectTitle, setDefectTitle] = useState('');
  const [defectDesc, setDefectDesc] = useState('');
  const [defectSeverity, setDefectSeverity] = useState<'ADVISORY' | 'MINOR' | 'MAJOR' | 'CRITICAL' | 'UNSAFE'>('MAJOR');
  const [defectMakeSafe, setDefectMakeSafe] = useState<'NOT_APPLICABLE' | 'MADE_SAFE' | 'ISOLATED' | 'UNABLE_TO_MAKE_SAFE' | 'ESCALATED'>('MADE_SAFE');
  const [defectStopWork, setDefectStopWork] = useState(false);
  const [defectAction, setDefectAction] = useState('Replace worn component');

  const [variationModalOpen, setVariationModalOpen] = useState(false);
  const [variationReason, setVariationReason] = useState('Additional defective component found during inspection');
  const [variationScope, setVariationScope] = useState('');
  const [variationHours, setVariationHours] = useState(2);
  const [variationPartsGbp, setVariationPartsGbp] = useState(150);

  const [partModalOpen, setPartModalOpen] = useState(false);
  const [partName, setPartName] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [partAwaiting, setPartAwaiting] = useState(false);

  // Service Report Form State
  const [reportNarrative, setReportNarrative] = useState(
    initialVisit.job_pack?.workflow_type === 'PPM'
      ? 'Completed quarterly planned maintenance on HVAC / mechanical system. Cleaned filter media, inspected drive belts, and verified operating temperatures and pressures.'
      : 'Attended site to investigate reported fault. Conducted diagnostics, replaced failed component, verified operating parameters, and tested under full load.'
  );
  const [reportRecs, setReportRecs] = useState('System is operating satisfactorily within design parameters.');
  const [reportOutcome, setReportOutcome] = useState<DigitalServiceReport['completion_outcome']>('COMPLETED');
  const [signatoryName, setSignatoryName] = useState(session.displayName);
  const [signatoryRole, setSignatoryRole] = useState('Facilities Coordinator');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ramsAcknowledged, setRamsAcknowledged] = useState(visit.job_pack?.rams?.acknowledged || false);

  const jobPack = visit.job_pack || ({} as DigitalJobPack);

  // Unsynced Evidence Count
  const unsyncedEvidenceCount = evidenceList.filter(
    (ev) => ev.sync_state === 'SAVED_ON_DEVICE' || ev.sync_state === 'WAITING_FOR_CONNECTION' || ev.sync_state === 'SYNCING'
  ).length;

  // Actions
  const handleStartWork = async () => {
    setIsSubmitting(true);
    setExecutionError(null);
    try {
      const res = await fetch(`/api/engineer/visits/${visit.id}/work`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-idempotency-key': `work-${visit.id}-${session.personId}`,
        },
        body: JSON.stringify({ operativeId: session.personId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setExecutionError(data.error || 'Failed to start work');
        return;
      }
      if (data.visit) setVisit(data.visit);
    } catch (err: any) {
      setExecutionError(err.message || 'Connection error while starting work');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNoAccessSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/engineer/visits/${visit.id}/no-access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operativeId: session.personId,
          reason: noAccessReason,
          contact_attempted: true,
          contact_notes: noAccessNotes || 'Contacted site contact phone on record.',
        }),
      });
      const data = await res.json();
      if (data.success && data.visit) {
        setVisit(data.visit);
        setNoAccessOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (taskId: string, update: Partial<PpmChecklistItem>) => {
    try {
      const res = await fetch(`/api/engineer/visits/${visit.id}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, update }),
      });
      const data = await res.json();
      if (data.success && data.visit) {
        setVisit(data.visit);
        setTasks(data.visit.ppm_tasks);
      }
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleAddEvidence = (category: FieldEvidenceItem['category']) => {
    const newEvidence: FieldEvidenceItem = {
      id: `ev-${Date.now()}`,
      visit_id: visit.id,
      category,
      file_name: `evidence_${category.toLowerCase()}_${Date.now()}.jpg`,
      storage_path: `/evidence/${visit.id}/${category.toLowerCase()}_photo.jpg`,
      captured_at: new Date().toISOString(),
      sync_state: 'SYNCED',
      caption: `${category} photograph captured on site`,
    };
    setEvidenceList([newEvidence, ...evidenceList]);
  };

  const handleRetryEvidenceSync = (evId: string) => {
    setEvidenceList((prev) =>
      prev.map((ev) => (ev.id === evId ? { ...ev, sync_state: 'SYNCED' } : ev))
    );
  };

  const handleRaiseDefect = async () => {
    if (!defectTitle || !defectDesc) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/engineer/visits/${visit.id}/defects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-idempotency-key': `def-${visit.id}-${defectTitle.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        },
        body: JSON.stringify({
          title: defectTitle,
          description: defectDesc,
          severity: defectSeverity,
          make_safe_status: defectMakeSafe,
          stop_work_triggered: defectStopWork,
          recommended_action: defectAction,
          operativeId: session.personId,
        }),
      });
      const data = await res.json();
      if (data.success && data.defect) {
        setDefectsList([data.defect, ...defectsList]);
        setDefectModalOpen(false);
        setDefectTitle('');
        setDefectDesc('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestVariation = async () => {
    if (!variationScope) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/engineer/visits/${visit.id}/variations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-idempotency-key': `var-${visit.id}-${variationReason.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        },
        body: JSON.stringify({
          reason: variationReason,
          additional_scope: variationScope,
          estimated_labour_hours: Number(variationHours),
          estimated_parts_cost_gbp: Number(variationPartsGbp),
          operativeId: session.personId,
        }),
      });
      const data = await res.json();
      if (data.success && data.variation) {
        setVariationsList([data.variation, ...variationsList]);
        setVariationModalOpen(false);
        setVariationScope('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecordPart = async () => {
    if (!partName) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/engineer/visits/${visit.id}/parts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          part_name: partName,
          part_number: partNumber || 'GEN-01',
          quantity: 1,
          is_installed: !partAwaiting,
          is_awaiting_delivery: partAwaiting,
        }),
      });
      const data = await res.json();
      if (data.success && data.part) {
        setPartsList([data.part, ...partsList]);
        setPartModalOpen(false);
        setPartName('');
        setPartNumber('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitServiceReport = async () => {
    setValidationError(null);

    // Unsynced Evidence Gate
    if (unsyncedEvidenceCount > 0) {
      setValidationError(
        `${unsyncedEvidenceCount} piece(s) of evidence are still waiting to upload. Connect to network and complete sync before submitting report.`
      );
      return;
    }

    // Pre-submission validation
    if (jobPack.workflow_type === 'PPM') {
      const incomplete = tasks.filter((t) => t.is_mandatory && !t.recorded_status && t.recorded_measurement === undefined);
      if (incomplete.length > 0) {
        setValidationError(`Incomplete mandatory tasks: ${incomplete.map((t) => t.task_name).join(', ')}`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/engineer/visits/${visit.id}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-idempotency-key': `rep-${visit.id}-${session.personId}`,
        },
        body: JSON.stringify({
          operativeId: session.personId,
          work_completed_narrative: reportNarrative,
          engineer_recommendations: reportRecs,
          completion_outcome: reportOutcome,
          site_signatory: signatoryName
            ? {
                name: signatoryName,
                role: signatoryRole,
                signature_data_url: 'data:image/svg+xml;utf8,<svg>Signature_Confirmed</svg>',
              }
            : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setValidationError(data.error || 'Failed to submit service report');
        setIsSubmitting(false);
        return;
      }

      setReport(data.report);
      setVisit((prev) => ({ ...prev, status: 'SUBMITTED', service_report: data.report }));
    } catch (err: any) {
      setValidationError(err.message || 'Submission error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-12">
      {/* Top Header Card */}
      <div className="bg-brand-carbon border border-brand-edge-dark rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <Link
            href="/engineer"
            className="text-xs text-brand-mist hover:text-white flex items-center gap-1 font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Queue
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-brand-electric-bright">
              {jobPack.work_order_number || visit.work_order_id}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                visit.status === 'SUBMITTED' || visit.status === 'VALIDATED'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : visit.status === 'IN_PROGRESS'
                  ? 'bg-brand-electric/20 text-brand-electric-bright border-brand-electric/40'
                  : visit.status === 'CANCELLED'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-brand-void text-brand-mist border-brand-edge-dark'
              }`}
            >
              {visit.status}
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-base font-bold text-white leading-snug">
            {jobPack.title || 'Site Remedial Execution'}
          </h1>
          <p className="text-xs text-brand-mist/70 mt-0.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-electric-bright shrink-0" />
            <span>{jobPack.site?.name} &bull; {jobPack.site?.city || jobPack.site?.address_line1}</span>
          </p>
        </div>

        {/* Quick Launch Talk to Quote Header Action */}
        <div className="pt-2 border-t border-brand-edge-dark flex items-center justify-between gap-2">
          <span className="text-[11px] text-brand-mist/60 font-medium">Proactive Remedial Required?</span>
          <Link
            href={`/engineer/talk?workOrderId=${encodeURIComponent(
              visit.work_order_id || ''
            )}&workOrderNumber=${encodeURIComponent(
              jobPack.work_order_number || ''
            )}&siteId=${encodeURIComponent(jobPack.site?.id || '')}&siteName=${encodeURIComponent(
              jobPack.site?.name || ''
            )}&assetId=${encodeURIComponent(
              jobPack.asset?.id || ''
            )}&assetReference=${encodeURIComponent(jobPack.asset?.asset_tag || '')}`}
            className="bg-brand-electric/15 hover:bg-brand-electric/25 border border-brand-electric/40 text-brand-electric-bright hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Talk to Quote</span>
          </Link>
        </div>
      </div>

      {/* Cancellation Banner */}
      {visit.is_cancelled && (
        <div className="p-4 bg-rose-600/20 border border-rose-500/40 text-rose-200 rounded-2xl text-xs flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <div className="space-y-1">
            <strong className="block text-sm text-white font-bold">WORK ORDER CANCELLED</strong>
            <span>Reason: {visit.cancellation_reason || 'Instruction from client or schedule cancelled.'}</span>
            <span className="block text-[11px] text-rose-300/80">
              Further execution is blocked. Any evidence captured has been safely archived.
            </span>
          </div>
        </div>
      )}

      {/* Execution Error Banner */}
      {executionError && (
        <div className="p-4 bg-rose-500/15 border border-rose-500/30 text-rose-200 rounded-2xl text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="block text-sm font-bold text-white">Execution Blocked</strong>
            <span>{executionError}</span>
          </div>
        </div>
      )}

      {/* Stop Work Warning Banner */}
      {defectsList.some((d) => d.stop_work_triggered) && (
        <div className="p-4 bg-rose-600 border border-rose-500 rounded-2xl text-xs text-white flex items-center gap-3 shadow-xl">
          <AlertOctagon className="w-6 h-6 shrink-0" />
          <div>
            <strong className="block text-sm font-bold">SAFETY STOP-WORK ACTIVE</strong>
            <span>Critical hazard identified. Equipment isolated and escalated to EntireFM Helpdesk.</span>
          </div>
        </div>
      )}

      {/* Check-in / Start Work Action Banner */}
      {visit.status === 'ARRIVED' && !visit.is_cancelled && (
        <div className="bg-brand-carbon border border-purple-500/40 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xl">
          <div>
            <span className="text-[10px] uppercase text-purple-400 font-bold block">CHECKED IN ON SITE</span>
            <span className="text-xs text-white font-medium">Ready to commence site execution.</span>
          </div>
          <button
            type="button"
            onClick={handleStartWork}
            disabled={isSubmitting}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-purple-900/40 transition-all active:scale-95"
            style={{ minHeight: '48px' }}
          >
            Start Work
          </button>
        </div>
      )}

      {/* Segmented Tab Bar */}
      <div className="flex bg-brand-carbon border border-brand-edge-dark rounded-xl p-1 gap-1 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('WORK')}
          className={`flex-1 py-2.5 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1 ${
            activeTab === 'WORK'
              ? 'bg-brand-electric text-white shadow-sm'
              : 'text-brand-mist/70 hover:text-white'
          }`}
          style={{ minHeight: '44px' }}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Execution</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('JOB_PACK')}
          className={`flex-1 py-2.5 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1 ${
            activeTab === 'JOB_PACK'
              ? 'bg-brand-electric text-white shadow-sm'
              : 'text-brand-mist/70 hover:text-white'
          }`}
          style={{ minHeight: '44px' }}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Job Pack</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('EVIDENCE')}
          className={`flex-1 py-2.5 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1 ${
            activeTab === 'EVIDENCE'
              ? 'bg-brand-electric text-white shadow-sm'
              : 'text-brand-mist/70 hover:text-white'
          }`}
          style={{ minHeight: '44px' }}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Photos ({evidenceList.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('DEFECTS')}
          className={`flex-1 py-2.5 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1 ${
            activeTab === 'DEFECTS'
              ? 'bg-brand-electric text-white shadow-sm'
              : 'text-brand-mist/70 hover:text-white'
          }`}
          style={{ minHeight: '44px' }}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Defects ({defectsList.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('REPORT')}
          className={`flex-1 py-2.5 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1 ${
            activeTab === 'REPORT'
              ? 'bg-brand-electric text-white shadow-sm'
              : 'text-brand-mist/70 hover:text-white'
          }`}
          style={{ minHeight: '44px' }}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Report</span>
        </button>
      </div>

      {/* TAB 1: WORK EXECUTION */}
      {activeTab === 'WORK' && (
        <div className="space-y-4">
          {/* Action Quick Bar */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDefectModalOpen(true)}
              className="bg-brand-carbon hover:bg-brand-void border border-brand-edge-dark text-amber-300 rounded-xl p-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              style={{ minHeight: '48px' }}
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Raise Defect</span>
            </button>
            <button
              type="button"
              onClick={() => setVariationModalOpen(true)}
              className="bg-brand-carbon hover:bg-brand-void border border-brand-edge-dark text-brand-electric-bright rounded-xl p-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              style={{ minHeight: '48px' }}
            >
              <DollarSign className="w-4 h-4 text-brand-electric-bright" />
              <span>Request Variation</span>
            </button>
          </div>

          {/* Checklist / Tasks Schedule */}
          <div className="bg-brand-carbon border border-brand-edge-dark rounded-2xl p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-mist">
                Execution Tasks ({tasks.length})
              </h3>
              <span className="text-[10px] text-brand-mist/60">
                {tasks.filter((t) => t.recorded_status === 'PASS').length} / {tasks.length} Completed
              </span>
            </div>

            {tasks.length === 0 ? (
              <p className="text-xs text-brand-mist/60 text-center py-4 bg-brand-void rounded-xl border border-brand-edge-dark">
                Standard remedial procedure in effect. Complete observations in Service Report.
              </p>
            ) : (
              <div className="space-y-2.5">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-brand-void border border-brand-edge-dark rounded-xl p-3 space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-semibold text-white block">{task.task_name}</span>
                        {task.notes && (
                          <span className="text-[11px] text-brand-mist/70 block mt-0.5">
                            {task.notes}
                          </span>
                        )}
                      </div>
                      {task.is_mandatory && (
                        <span className="text-[9px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.2 rounded shrink-0">
                          MANDATORY
                        </span>
                      )}
                    </div>

                    {/* Task status actions */}
                    <div className="flex items-center gap-2 pt-1 border-t border-brand-edge-dark/60">
                      <button
                        type="button"
                        onClick={() => handleUpdateTask(task.id, { recorded_status: 'PASS' })}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors ${
                          task.recorded_status === 'PASS'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-brand-carbon text-brand-mist hover:text-white border border-brand-edge-dark'
                        }`}
                        style={{ minHeight: '40px' }}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Pass</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateTask(task.id, { recorded_status: 'FAIL' })}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors ${
                          task.recorded_status === 'FAIL'
                            ? 'bg-rose-600 text-white'
                            : 'bg-brand-carbon text-brand-mist hover:text-white border border-brand-edge-dark'
                        }`}
                        style={{ minHeight: '40px' }}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Fail</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateTask(task.id, { recorded_status: 'NOT_APPLICABLE' })}
                        className={`py-1.5 px-2.5 rounded-lg text-[11px] font-medium transition-colors ${
                          task.recorded_status === 'NOT_APPLICABLE'
                            ? 'bg-slate-700 text-white'
                            : 'bg-brand-carbon text-brand-mist/60 hover:text-white border border-brand-edge-dark'
                        }`}
                        style={{ minHeight: '40px' }}
                      >
                        N/A
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Parts Used Card */}
          <div className="bg-brand-carbon border border-brand-edge-dark rounded-2xl p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-mist">
                Parts &amp; Materials Used ({partsList.length})
              </h3>
              <button
                type="button"
                onClick={() => setPartModalOpen(true)}
                className="text-xs text-brand-electric-bright hover:underline font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Part
              </button>
            </div>

            {partsList.length === 0 ? (
              <p className="text-xs text-brand-mist/50 text-center py-3 bg-brand-void rounded-xl border border-brand-edge-dark">
                No parts logged. Tap Add Part to record materials from van stock or catalogue.
              </p>
            ) : (
              <div className="space-y-2">
                {partsList.map((part) => (
                  <div
                    key={part.id}
                    className="bg-brand-void border border-brand-edge-dark rounded-xl p-3 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-white block">{part.part_name}</span>
                      <span className="text-[11px] text-brand-mist/60 font-mono">
                        Ref: {part.part_number} &bull; Qty: {part.quantity}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        part.is_installed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {part.is_installed ? 'Installed' : 'Awaiting Delivery'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* No Access Button */}
          <button
            type="button"
            onClick={() => setNoAccessOpen(true)}
            className="w-full bg-brand-carbon hover:bg-rose-950/20 border border-brand-edge-dark hover:border-rose-500/30 text-rose-300 rounded-xl py-3 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            style={{ minHeight: '48px' }}
          >
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            <span>Report No Site Access / Abort</span>
          </button>
        </div>
      )}

      {/* TAB 2: DIGITAL JOB PACK */}
      {activeTab === 'JOB_PACK' && (
        <div className="space-y-4">
          {/* Site & Access Information */}
          <div className="bg-brand-carbon border border-brand-edge-dark rounded-2xl p-4 space-y-3 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-mist flex items-center gap-1.5">
              <Building className="w-4 h-4 text-brand-electric-bright" />
              <span>Site &amp; Access Details</span>
            </h3>

            <div className="bg-brand-void p-3.5 rounded-xl border border-brand-edge-dark space-y-2 text-xs">
              <div>
                <span className="text-[10px] uppercase text-brand-mist/60 block">Site Name</span>
                <span className="font-bold text-white text-sm">{jobPack.site?.name || 'Commercial Site'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-brand-mist/60 block">Address</span>
                <span className="text-brand-mist/90">
                  {jobPack.site?.address_line1}, {jobPack.site?.city} {jobPack.site?.postcode}
                </span>
              </div>
              {jobPack.site?.reception_procedure && (
                <div className="pt-1 border-t border-brand-edge-dark">
                  <span className="text-[10px] uppercase text-brand-electric-bright font-bold block">
                    Reception &amp; Access Instructions
                  </span>
                  <span className="text-white/90">{jobPack.site.reception_procedure}</span>
                </div>
              )}
            </div>

            {jobPack.site?.access_telephone && (
              <a
                href={`tel:${jobPack.site.access_telephone}`}
                className="w-full bg-brand-void hover:bg-brand-carbon border border-brand-edge-dark text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 text-xs font-bold transition-colors"
                style={{ minHeight: '48px' }}
              >
                <Phone className="w-4 h-4 text-brand-electric-bright" />
                <span>Call Site Contact: {jobPack.site.access_telephone}</span>
              </a>
            )}
          </div>

          {/* Asset Details */}
          {jobPack.asset && (
            <div className="bg-brand-carbon border border-brand-edge-dark rounded-2xl p-4 space-y-3 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-mist flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-brand-electric-bright" />
                <span>Asset Specification</span>
              </h3>

              <div className="bg-brand-void p-3.5 rounded-xl border border-brand-edge-dark space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-white text-sm">{jobPack.asset.name}</span>
                    <span className="text-brand-mist/70 text-xs block">
                      {jobPack.asset.manufacturer} &bull; {jobPack.asset.model}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-brand-carbon text-brand-electric-bright px-2 py-0.5 rounded border border-brand-edge-dark">
                    {jobPack.asset.asset_tag}
                  </span>
                </div>
                {jobPack.asset.location_description && (
                  <div className="pt-1 border-t border-brand-edge-dark text-brand-mist">
                    <span>Location: </span>
                    <strong className="text-white">{jobPack.asset.location_description}</strong>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* RAMS & Health and Safety */}
          <div className="bg-brand-carbon border border-brand-edge-dark rounded-2xl p-4 space-y-3 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-mist flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-electric-bright" />
              <span>Health &amp; Safety Compliance (RAMS)</span>
            </h3>

            <div className="bg-brand-void p-3.5 rounded-xl border border-brand-edge-dark space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span>Standard RAMS Protocol:</span>
                <span className="font-bold text-white">RAMS-2026-MECH-01</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Asbestos Register:</span>
                <span className="text-emerald-400 font-bold">No Asbestos Identified</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EVIDENCE & PHOTOS */}
      {activeTab === 'EVIDENCE' && (
        <div className="space-y-4">
          <div className="bg-brand-carbon border border-brand-edge-dark rounded-2xl p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-mist">
                Site Photographic Evidence ({evidenceList.length})
              </h3>
            </div>

            {/* Quick Photo Capture Category Buttons */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleAddEvidence('BEFORE')}
                className="bg-brand-void hover:bg-brand-electric/15 border border-brand-edge-dark hover:border-brand-electric/40 text-white rounded-xl py-3 px-3 flex items-center justify-center gap-2 transition-colors"
                style={{ minHeight: '48px' }}
              >
                <Camera className="w-4 h-4 text-brand-electric-bright" />
                <span>Pre-Work Photo</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddEvidence('AFTER')}
                className="bg-brand-void hover:bg-brand-electric/15 border border-brand-edge-dark hover:border-brand-electric/40 text-white rounded-xl py-3 px-3 flex items-center justify-center gap-2 transition-colors"
                style={{ minHeight: '48px' }}
              >
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Post-Work Photo</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddEvidence('DEFECT')}
                className="bg-brand-void hover:bg-brand-electric/15 border border-brand-edge-dark hover:border-brand-electric/40 text-white rounded-xl py-3 px-3 flex items-center justify-center gap-2 transition-colors"
                style={{ minHeight: '48px' }}
              >
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Defect Photo</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddEvidence('ASSET_LABEL')}
                className="bg-brand-void hover:bg-brand-electric/15 border border-brand-edge-dark hover:border-brand-electric/40 text-white rounded-xl py-3 px-3 flex items-center justify-center gap-2 transition-colors"
                style={{ minHeight: '48px' }}
              >
                <Camera className="w-4 h-4 text-purple-400" />
                <span>Nameplate / Tag</span>
              </button>
            </div>

            {/* Photo List */}
            {evidenceList.length === 0 ? (
              <p className="text-xs text-brand-mist/50 text-center py-6 bg-brand-void rounded-xl border border-brand-edge-dark">
                No photographs captured yet. Use the buttons above to capture on-site visual evidence.
              </p>
            ) : (
              <div className="space-y-2 pt-2">
                {evidenceList.map((ev) => (
                  <div
                    key={ev.id}
                    className="bg-brand-void border border-brand-edge-dark rounded-xl p-3 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-carbon border border-brand-edge-dark flex items-center justify-center text-brand-electric-bright">
                        <Camera className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-white block">{ev.caption || ev.category}</span>
                        <span className="text-[11px] text-brand-mist/60">
                          {new Date(ev.captured_at).toLocaleTimeString('en-GB')} &bull; {ev.category}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                      SYNCED
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: DEFECTS & SAFETY */}
      {activeTab === 'DEFECTS' && (
        <div className="space-y-4">
          <div className="bg-brand-carbon border border-brand-edge-dark rounded-2xl p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-mist">
                Operational Defects ({defectsList.length})
              </h3>
              <button
                type="button"
                onClick={() => setDefectModalOpen(true)}
                className="text-xs text-amber-300 hover:underline font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Raise Defect
              </button>
            </div>

            {defectsList.length === 0 ? (
              <p className="text-xs text-brand-mist/50 text-center py-4 bg-brand-void rounded-xl border border-brand-edge-dark">
                Zero defects reported on this asset/visit.
              </p>
            ) : (
              <div className="space-y-2">
                {defectsList.map((d) => (
                  <div
                    key={d.id}
                    className="bg-brand-void border border-brand-edge-dark rounded-xl p-3.5 space-y-1.5 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <strong className="text-white font-bold">{d.title}</strong>
                      <span className="text-[9.5px] font-bold px-2 py-0.5 rounded uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {d.severity}
                      </span>
                    </div>
                    <p className="text-brand-mist/80 text-[11px]">{d.description}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-brand-edge-dark text-[10.5px] text-brand-mist/60">
                      <span>Make Safe: <strong className="text-white">{d.make_safe_status}</strong></span>
                      {d.stop_work_triggered && (
                        <span className="text-rose-400 font-bold">STOP WORK TRIGGERED</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: SERVICE REPORT */}
      {activeTab === 'REPORT' && (
        <div className="space-y-4">
          <div className="bg-brand-carbon border border-brand-edge-dark rounded-2xl p-4 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-mist">
              Digital Service Report Completion
            </h3>

            {validationError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{validationError}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-brand-mist/80 block font-semibold mb-1">
                  Work Completed Narrative
                </label>
                <textarea
                  rows={4}
                  value={reportNarrative}
                  onChange={(e) => setReportNarrative(e.target.value)}
                  className="w-full bg-brand-void border border-brand-edge-dark text-white rounded-xl p-3 focus:outline-none focus:border-brand-electric leading-relaxed"
                />
              </div>

              <div>
                <label className="text-brand-mist/80 block font-semibold mb-1">
                  Engineer Recommendations
                </label>
                <input
                  type="text"
                  value={reportRecs}
                  onChange={(e) => setReportRecs(e.target.value)}
                  className="w-full bg-brand-void border border-brand-edge-dark text-white rounded-xl p-3 focus:outline-none focus:border-brand-electric"
                />
              </div>

              <div>
                <label className="text-brand-mist/80 block font-semibold mb-1">Completion Outcome</label>
                <select
                  value={reportOutcome}
                  onChange={(e) => setReportOutcome(e.target.value as any)}
                  className="w-full bg-brand-void border border-brand-edge-dark text-white rounded-xl p-3 focus:outline-none focus:border-brand-electric"
                >
                  <option value="COMPLETED">COMPLETED &bull; System Operational</option>
                  <option value="PARTIALLY_COMPLETED">PARTIALLY COMPLETED &bull; Further Attendance Required</option>
                  <option value="UNABLE_TO_COMPLETE">UNABLE TO COMPLETE &bull; Awaiting Parts / Access</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-brand-mist/80 block font-semibold mb-1">Signatory Name</label>
                  <input
                    type="text"
                    value={signatoryName}
                    onChange={(e) => setSignatoryName(e.target.value)}
                    className="w-full bg-brand-void border border-brand-edge-dark text-white rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="text-brand-mist/80 block font-semibold mb-1">Signatory Role</label>
                  <input
                    type="text"
                    value={signatoryRole}
                    onChange={(e) => setSignatoryRole(e.target.value)}
                    className="w-full bg-brand-void border border-brand-edge-dark text-white rounded-xl p-2.5"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitServiceReport}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-3.5 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all active:scale-98"
              style={{ minHeight: '52px' }}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Service Report to EntireFM</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Raise Defect Bottom Sheet */}
      {defectModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-brand-carbon border border-brand-edge-dark rounded-t-2xl sm:rounded-2xl max-w-sm w-full p-5 space-y-3 shadow-2xl safe-area-inset-bottom">
            <h3 className="text-sm font-bold text-white">Raise Operational Defect</h3>
            <div className="space-y-2 text-xs">
              <input
                type="text"
                value={defectTitle}
                onChange={(e) => setDefectTitle(e.target.value)}
                placeholder="Defect summary (e.g. Worn drive belt)..."
                className="w-full bg-brand-void border border-brand-edge-dark text-white rounded-xl p-2.5"
              />
              <textarea
                rows={3}
                value={defectDesc}
                onChange={(e) => setDefectDesc(e.target.value)}
                placeholder="Detailed description of defect and risk..."
                className="w-full bg-brand-void border border-brand-edge-dark text-white rounded-xl p-2.5"
              />
              <select
                value={defectSeverity}
                onChange={(e) => setDefectSeverity(e.target.value as any)}
                className="w-full bg-brand-void border border-brand-edge-dark text-white rounded-xl p-2.5"
              >
                <option value="MINOR">MINOR &bull; Cosmetic / Non-urgent</option>
                <option value="MAJOR">MAJOR &bull; Performance degraded</option>
                <option value="CRITICAL">CRITICAL &bull; Complete failure risk</option>
                <option value="UNSAFE">UNSAFE &bull; Immediate hazard</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDefectModalOpen(false)}
                className="bg-brand-void text-white rounded-xl py-2.5 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRaiseDefect}
                className="bg-amber-500 text-slate-950 rounded-xl py-2.5 text-xs font-bold"
              >
                Save Defect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Request Variation Bottom Sheet */}
      {variationModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-brand-carbon border border-brand-edge-dark rounded-t-2xl sm:rounded-2xl max-w-sm w-full p-5 space-y-3 shadow-2xl safe-area-inset-bottom">
            <h3 className="text-sm font-bold text-white">Request Scope Variation</h3>
            <div className="space-y-2 text-xs">
              <textarea
                rows={3}
                value={variationScope}
                onChange={(e) => setVariationScope(e.target.value)}
                placeholder="Describe additional required remedial scope..."
                className="w-full bg-brand-void border border-brand-edge-dark text-white rounded-xl p-2.5"
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-brand-mist/60 text-[10px] block">Extra Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    value={variationHours}
                    onChange={(e) => setVariationHours(Number(e.target.value))}
                    className="w-full bg-brand-void border border-brand-edge-dark text-white rounded-xl p-2"
                  />
                </div>
                <div>
                  <label className="text-brand-mist/60 text-[10px] block">Parts Cost (£)</label>
                  <input
                    type="number"
                    step="10"
                    value={variationPartsGbp}
                    onChange={(e) => setVariationPartsGbp(Number(e.target.value))}
                    className="w-full bg-brand-void border border-brand-edge-dark text-white rounded-xl p-2"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setVariationModalOpen(false)}
                className="bg-brand-void text-white rounded-xl py-2.5 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRequestVariation}
                className="bg-brand-electric text-white rounded-xl py-2.5 text-xs font-bold"
              >
                Submit Variation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Record Part Bottom Sheet */}
      {partModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-brand-carbon border border-brand-edge-dark rounded-t-2xl sm:rounded-2xl max-w-sm w-full p-5 space-y-3 shadow-2xl safe-area-inset-bottom">
            <h3 className="text-sm font-bold text-white">Record Material / Part</h3>
            <div className="space-y-2 text-xs">
              <input
                type="text"
                value={partName}
                onChange={(e) => setPartName(e.target.value)}
                placeholder="Part description (e.g. 24V Actuator)..."
                className="w-full bg-brand-void border border-brand-edge-dark text-white rounded-xl p-2.5"
              />
              <input
                type="text"
                value={partNumber}
                onChange={(e) => setPartNumber(e.target.value)}
                placeholder="Part number / Catalogue ref..."
                className="w-full bg-brand-void border border-brand-edge-dark text-white rounded-xl p-2.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPartModalOpen(false)}
                className="bg-brand-void text-white rounded-xl py-2.5 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRecordPart}
                className="bg-emerald-600 text-white rounded-xl py-2.5 text-xs font-bold"
              >
                Save Part
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: No Access Bottom Sheet */}
      {noAccessOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-brand-carbon border border-brand-edge-dark rounded-t-2xl sm:rounded-2xl max-w-sm w-full p-5 space-y-3 shadow-2xl safe-area-inset-bottom">
            <h3 className="text-sm font-bold text-white">Report No Site Access</h3>
            <p className="text-xs text-brand-mist/70">
              State the reason you are unable to access the property or plant room:
            </p>
            <div className="space-y-2 text-xs">
              <select
                value={noAccessReason}
                onChange={(e) => setNoAccessReason(e.target.value)}
                className="w-full bg-brand-void border border-brand-edge-dark text-white rounded-xl p-2.5"
              >
                <option value="Site closed / No keyholder present">Site closed / No keyholder present</option>
                <option value="Access denied by building management">Access denied by building management</option>
                <option value="Permit to Work not issued">Permit to Work not issued</option>
                <option value="Hazardous site condition prevents safe access">Hazardous site condition</option>
              </select>
              <textarea
                rows={2}
                value={noAccessNotes}
                onChange={(e) => setNoAccessNotes(e.target.value)}
                placeholder="Additional details on call attempts or keyholder contact..."
                className="w-full bg-brand-void border border-brand-edge-dark text-white rounded-xl p-2.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setNoAccessOpen(false)}
                className="bg-brand-void text-white rounded-xl py-2.5 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleNoAccessSubmit}
                className="bg-rose-600 text-white rounded-xl py-2.5 text-xs font-bold"
              >
                Confirm No Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
