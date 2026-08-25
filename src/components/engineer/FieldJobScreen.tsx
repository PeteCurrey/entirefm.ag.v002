'use client';

import React, { useState, useRef } from 'react';
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

  // Modals
  const [noAccessOpen, setNoAccessOpen] = useState(false);
  const [noAccessReason, setNoAccessReason] = useState('Site closed / No keyholder present');
  const [noAccessNotes, setNoAccessNotes] = useState('');

  const [defectModalOpen, setDefectModalOpen] = useState(false);
  const [defectTitle, setDefectTitle] = useState('');
  const [defectDesc, setDefectDesc] = useState('');
  const [defectSeverity, setDefectSeverity] = useState<'ADVISORY' | 'MINOR' | 'MAJOR' | 'CRITICAL' | 'UNSAFE'>('MAJOR');
  const [defectMakeSafe, setDefectMakeSafe] = useState<'NOT_APPLICABLE' | 'MADE_SAFE' | 'ISOLATED' | 'UNABLE_TO_MAKE_SAFE' | 'ESCALATED'>('MADE_SAFE');
  const [defectStopWork, setDefectStopWork] = useState(false);
  const [defectAction, setDefectAction] = useState('Replace worn bearings');

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
      ? 'Completed quarterly planned maintenance on Packaged Air Handling Unit and Chiller system. Cleaned filter media, inspected drive belts, and verified operating temperatures and refrigerant pressures.'
      : 'Attended site to investigate high temperature alarm on server room AC split unit. Replaced failed contactor, verified refrigerant charge, and tested unit under full load.'
  );
  const [reportRecs, setReportRecs] = useState('System is operating satisfactorily within design parameters.');
  const [reportOutcome, setReportOutcome] = useState<DigitalServiceReport['completion_outcome']>('COMPLETED');
  const [signatoryName, setSignatoryName] = useState('Dave Smith');
  const [signatoryRole, setSignatoryRole] = useState('Facilities Coordinator');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ramsAcknowledged, setRamsAcknowledged] = useState(visit.job_pack.rams.acknowledged || false);

  const jobPack = visit.job_pack;

  // Actions
  const handleStartWork = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/engineer/visits/${visit.id}/work`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operativeId: session.personId }),
      });
      const data = await res.json();
      if (data.success && data.visit) setVisit(data.visit);
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

  const handleRaiseDefect = async () => {
    if (!defectTitle || !defectDesc) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/engineer/visits/${visit.id}/defects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: defectTitle,
          description: defectDesc,
          severity: defectSeverity,
          make_safe_status: defectMakeSafe,
          stop_work_triggered: defectStopWork,
          recommended_action: defectAction,
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: variationReason,
          additional_scope: variationScope,
          estimated_labour_hours: Number(variationHours),
          estimated_parts_cost_gbp: Number(variationPartsGbp),
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
        headers: { 'Content-Type': 'application/json' },
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
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <Link href="/engineer" className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-mono">
          <ChevronLeft className="h-4 w-4" /> Today
        </Link>
        <span className="text-xs font-mono font-bold text-brand-pink">{jobPack.work_order_number}</span>
        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
          visit.status === 'SUBMITTED' || visit.status === 'VALIDATED'
            ? 'bg-emerald-100 text-emerald-800'
            : visit.status === 'IN_PROGRESS'
            ? 'bg-blue-100 text-blue-900'
            : 'bg-slate-900 text-white'
        }`}>
          {visit.status}
        </span>
      </div>

      {/* Stop Work Warning Banner if triggered */}
      {defectsList.some((d) => d.stop_work_triggered) && (
        <div className="p-4 bg-rose-600 text-white rounded text-xs flex items-center gap-3">
          <AlertOctagon className="h-6 w-6 shrink-0 text-white" />
          <div>
            <strong className="block text-sm">SAFETY STOP-WORK TRIGGERED</strong>
            <span>Active critical hazard reported. Work is isolated and escalated to EntireFM Helpdesk.</span>
          </div>
        </div>
      )}

      {/* Status Action Banner */}
      {visit.status === 'ARRIVED' && (
        <div className="bg-purple-50 border border-purple-200 rounded p-4 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase text-purple-700 font-bold block">CHECKED IN ON SITE</span>
            <span className="text-xs text-purple-950 font-medium">Ready to commence site execution.</span>
          </div>
          <button
            onClick={handleStartWork}
            disabled={isSubmitting}
            className="btn-primary text-xs py-2 px-4 bg-purple-800 hover:bg-purple-900 text-white font-bold"
          >
            Start Work
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 text-xs font-mono">
        <button
          onClick={() => setActiveTab('WORK')}
          className={`py-2.5 px-3 border-b-2 font-bold ${
            activeTab === 'WORK' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400'
          }`}
        >
          Execution
        </button>
        <button
          onClick={() => setActiveTab('JOB_PACK')}
          className={`py-2.5 px-3 border-b-2 font-bold ${
            activeTab === 'JOB_PACK' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400'
          }`}
        >
          Job Pack
        </button>
        <button
          onClick={() => setActiveTab('EVIDENCE')}
          className={`py-2.5 px-3 border-b-2 font-bold ${
            activeTab === 'EVIDENCE' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400'
          }`}
        >
          Evidence ({evidenceList.length})
        </button>
        <button
          onClick={() => setActiveTab('DEFECTS')}
          className={`py-2.5 px-3 border-b-2 font-bold ${
            activeTab === 'DEFECTS' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400'
          }`}
        >
          Defects &amp; Scope
        </button>
        <button
          onClick={() => setActiveTab('REPORT')}
          className={`py-2.5 px-3 border-b-2 font-bold ${
            activeTab === 'REPORT' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400'
          }`}
        >
          Service Report
        </button>
      </div>

      {/* TAB 1: WORK EXECUTION */}
      {activeTab === 'WORK' && (
        <div className="space-y-4">
          {/* Work Summary Card */}
          <div className="bg-white border border-slate-200 rounded p-4 space-y-2">
            <h2 className="text-base font-bold text-slate-900">{jobPack.title}</h2>
            <p className="text-xs text-slate-600 font-sans">{jobPack.site.name} &bull; {jobPack.site.address_line1}</p>

            <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-100 text-slate-500">
              <span>Discipline: {jobPack.discipline}</span>
              <span>Workflow: {jobPack.workflow_type}</span>
            </div>
          </div>

          {/* PPM Mode: Checklist & Measurements */}
          {jobPack.workflow_type === 'PPM' && (
            <div className="bg-white border border-slate-200 rounded p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 font-sans">
                  Mandatory PPM Maintenance Tasks ({tasks.length})
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {tasks.filter((t) => t.recorded_status || t.recorded_measurement !== undefined).length} / {tasks.length} Done
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {tasks.map((task) => (
                  <div key={task.id} className="py-3 space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-900 font-sans">{task.task_name}</span>
                      {task.is_mandatory && (
                        <span className="text-[9.5px] font-mono text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded shrink-0">
                          MANDATORY
                        </span>
                      )}
                    </div>

                    {/* Pass/Fail Controls */}
                    {task.task_type === 'PASS_FAIL' && (
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleUpdateTask(task.id, { recorded_status: 'PASS' })}
                          className={`py-2 rounded text-xs font-bold font-mono transition-all ${
                            task.recorded_status === 'PASS'
                              ? 'bg-emerald-700 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          PASS
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateTask(task.id, { recorded_status: 'FAIL' })}
                          className={`py-2 rounded text-xs font-bold font-mono transition-all ${
                            task.recorded_status === 'FAIL'
                              ? 'bg-rose-700 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          FAIL
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateTask(task.id, { recorded_status: 'NOT_APPLICABLE' })}
                          className={`py-2 rounded text-xs font-bold font-mono transition-all ${
                            task.recorded_status === 'NOT_APPLICABLE'
                              ? 'bg-slate-800 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          N/A
                        </button>
                      </div>
                    )}

                    {/* Measurement Controls with Structured Units */}
                    {task.task_type === 'MEASUREMENT' && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="0.1"
                            value={task.recorded_measurement ?? ''}
                            onChange={(e) =>
                              handleUpdateTask(task.id, {
                                recorded_measurement: e.target.value ? parseFloat(e.target.value) : undefined,
                              })
                            }
                            placeholder={`e.g. ${task.expected_min || 18}`}
                            className="w-32 p-2 border border-slate-300 rounded font-mono text-xs"
                          />
                          <span className="font-mono font-bold text-slate-700">{task.measurement_unit}</span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            (Tolerance: {task.expected_min} &ndash; {task.expected_max} {task.measurement_unit})
                          </span>
                        </div>

                        {task.is_out_of_tolerance && (
                          <div className="p-2 bg-amber-50 border border-amber-200 rounded text-amber-900 text-[11px] flex items-center gap-1.5">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                            <span>Reading outside nominal tolerance limits. Verify and record recommendation.</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reactive Mode: Fault -> Diagnosis -> Repair */}
          {jobPack.workflow_type === 'REACTIVE' && (
            <div className="bg-white border border-slate-200 rounded p-4 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 font-sans block border-b border-slate-100 pb-2">
                Reactive Investigation &amp; Remediation
              </span>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Fault Description &amp; Findings</label>
                  <textarea
                    rows={2}
                    defaultValue="Server room temperature elevated to 28.5°C. High pressure safety trip active on outdoor condensing unit."
                    className="w-full p-2 border border-slate-300 rounded font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Root Cause Identified</label>
                  <textarea
                    rows={2}
                    defaultValue="Condenser fan motor contactor coil open circuit. Outdoor fan inoperative under load."
                    className="w-full p-2 border border-slate-300 rounded font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Remedial Action Undertaken</label>
                  <textarea
                    rows={2}
                    defaultValue="Replaced 24V contactor from van stock. Tested condenser fan rotation, cleared fault log, and verified return air temperature down to 19°C."
                    className="w-full p-2 border border-slate-300 rounded font-sans"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions Row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setActiveTab('EVIDENCE')}
              className="btn-secondary text-xs py-2.5 flex items-center justify-center gap-1.5 font-bold"
            >
              <Camera className="h-4 w-4" />
              <span>Capture Photo</span>
            </button>

            <button
              onClick={() => setDefectModalOpen(true)}
              className="btn-secondary text-xs py-2.5 text-amber-800 border-amber-300 flex items-center justify-center gap-1.5 font-bold"
            >
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span>Raise Defect</span>
            </button>
          </div>

          {/* No Access Button */}
          <div className="pt-2">
            <button
              onClick={() => setNoAccessOpen(true)}
              className="w-full py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 border border-slate-200 rounded text-xs font-mono font-bold text-center"
            >
              No Access / Unable to Attend Site
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: DIGITAL JOB PACK */}
      {activeTab === 'JOB_PACK' && (
        <div className="space-y-4 text-xs font-sans">
          {/* Site & Access */}
          <div className="bg-white border border-slate-200 rounded p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-900 text-sm">Site &amp; Access Details</span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${jobPack.site.name} ${jobPack.site.address_line1} ${jobPack.site.postcode}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary text-[11px] py-1 px-2.5 flex items-center gap-1 font-mono text-brand-pink font-bold"
              >
                <Navigation className="h-3 w-3" /> Native Directions
              </a>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-slate-400 block text-[10.5px]">Address</span>
                <span className="font-bold text-slate-900">{jobPack.site.address_line1}, {jobPack.site.city}, {jobPack.site.postcode}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10.5px]">Opening Times</span>
                <span className="text-slate-800">{jobPack.site.opening_hours}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10.5px]">Parking &amp; Loading</span>
                <span className="text-slate-800">{jobPack.site.parking_instructions}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10.5px]">Reception / Sign-in Procedure</span>
                <span className="text-slate-800">{jobPack.site.reception_procedure}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10.5px]">Access Telephone</span>
                <a href={`tel:${jobPack.site.access_telephone}`} className="text-brand-pink font-bold font-mono">
                  {jobPack.site.access_telephone}
                </a>
              </div>
              <div>
                <span className="text-slate-400 block text-[10.5px]">Known Site Hazards</span>
                <ul className="list-disc list-inside text-rose-800 font-medium">
                  {jobPack.site.known_hazards.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Asset Context */}
          {jobPack.asset && (
            <div className="bg-white border border-slate-200 rounded p-4 space-y-3">
              <span className="font-bold text-slate-900 text-sm block border-b border-slate-100 pb-2">
                Target Asset Specification
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block font-sans text-[10.5px]">Asset Tag</span>
                  <span className="font-bold text-slate-900">{jobPack.asset.asset_tag}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans text-[10.5px]">Criticality</span>
                  <span className="text-rose-700 font-bold">{jobPack.asset.criticality}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans text-[10.5px]">Manufacturer</span>
                  <span>{jobPack.asset.manufacturer}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans text-[10.5px]">Model / Serial</span>
                  <span>{jobPack.asset.model}</span>
                </div>
              </div>
            </div>
          )}

          {/* Risk-Proportionate RAMS */}
          <div className="bg-white border border-slate-200 rounded p-4 space-y-3">
            <span className="font-bold text-slate-900 text-sm block border-b border-slate-100 pb-2">
              Approved Risk Assessment &amp; Method Statement (RAMS)
            </span>
            <div className="space-y-2">
              <div className="text-xs text-slate-700">
                <strong>{jobPack.rams.title}</strong> &bull; {jobPack.rams.version}
              </div>
              <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={ramsAcknowledged}
                  onChange={(e) => setRamsAcknowledged(e.target.checked)}
                  className="text-brand-pink h-4 w-4"
                />
                <span className="text-xs text-slate-900 font-bold">
                  I confirm I have reviewed site-specific RAMS and PPE requirements before commencing work.
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EVIDENCE CAPTURE */}
      {activeTab === 'EVIDENCE' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 font-sans">
                Camera-First Photo Evidence
              </span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Synced to Cloud
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleAddEvidence('BEFORE')}
                className="p-3 bg-slate-50 border border-slate-200 rounded text-center hover:bg-slate-100 space-y-1"
              >
                <Camera className="h-5 w-5 mx-auto text-slate-700" />
                <span className="text-[11px] font-bold block text-slate-900">Before Photo</span>
              </button>
              <button
                onClick={() => handleAddEvidence('DURING')}
                className="p-3 bg-slate-50 border border-slate-200 rounded text-center hover:bg-slate-100 space-y-1"
              >
                <Camera className="h-5 w-5 mx-auto text-slate-700" />
                <span className="text-[11px] font-bold block text-slate-900">During / Work</span>
              </button>
              <button
                onClick={() => handleAddEvidence('AFTER')}
                className="p-3 bg-slate-50 border border-slate-200 rounded text-center hover:bg-slate-100 space-y-1"
              >
                <Camera className="h-5 w-5 mx-auto text-slate-700" />
                <span className="text-[11px] font-bold block text-slate-900">After Photo</span>
              </button>
            </div>

            {evidenceList.length > 0 && (
              <div className="divide-y divide-slate-100 pt-2">
                {evidenceList.map((ev) => (
                  <div key={ev.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{ev.category} Photograph</span>
                      <span className="text-slate-400 block font-mono text-[10.5px]">{ev.file_name}</span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                      {ev.sync_state}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: DEFECTS, VARIATIONS & PARTS */}
      {activeTab === 'DEFECTS' && (
        <div className="space-y-4 text-xs font-sans">
          {/* Defects List */}
          <div className="bg-white border border-slate-200 rounded p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-900 text-sm">Raised Defects ({defectsList.length})</span>
              <button
                onClick={() => setDefectModalOpen(true)}
                className="btn-secondary text-[11px] py-1 px-2.5 font-bold flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Raise Defect
              </button>
            </div>

            {defectsList.length === 0 ? (
              <p className="text-slate-400 text-xs">No defects reported on this attendance.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {defectsList.map((d) => (
                  <div key={d.id} className="py-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{d.title}</span>
                      <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                        d.severity === 'CRITICAL' || d.severity === 'UNSAFE' ? 'bg-rose-100 text-rose-900' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {d.severity} &bull; {d.make_safe_status}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{d.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Variations & NTE */}
          <div className="bg-white border border-slate-200 rounded p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-900 text-sm">Variations &amp; NTE Limits</span>
              <button
                onClick={() => setVariationModalOpen(true)}
                className="btn-secondary text-[11px] py-1 px-2.5 font-bold flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Request Variation
              </button>
            </div>

            <div className="bg-slate-50 p-2.5 rounded font-mono text-slate-600 flex justify-between items-center text-[11px]">
              <span>Authorised NTE Ceiling:</span>
              <strong className="text-slate-900">£{jobPack.nte_limit_gbp || 500}.00</strong>
            </div>

            {variationsList.map((v) => (
              <div key={v.id} className="p-3 bg-amber-50 border border-amber-200 rounded space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 font-sans">{v.reason}</span>
                  <span className="text-amber-900 font-mono font-bold">£{v.total_variation_estimate_gbp.toFixed(2)}</span>
                </div>
                <p className="text-slate-700 text-[11px] font-sans">{v.additional_scope}</p>
              </div>
            ))}
          </div>

          {/* Parts Used / Awaiting Parts */}
          <div className="bg-white border border-slate-200 rounded p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-900 text-sm">Parts &amp; Materials</span>
              <button
                onClick={() => setPartModalOpen(true)}
                className="btn-secondary text-[11px] py-1 px-2.5 font-bold flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Add Part
              </button>
            </div>

            {partsList.map((p) => (
              <div key={p.id} className="py-2 flex items-center justify-between border-b border-slate-100">
                <div>
                  <span className="font-bold text-slate-900">{p.part_name}</span>
                  <span className="text-slate-400 block font-mono text-[10.5px]">Qty: {p.quantity}</span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  p.is_awaiting_delivery ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {p.is_awaiting_delivery ? 'AWAITING DELIVERY' : 'INSTALLED'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: DIGITAL SERVICE REPORT & SUBMISSION */}
      {activeTab === 'REPORT' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded p-4 space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-900 text-sm">Digital Service Report</span>
              <span className="text-[10px] font-mono text-slate-400">EFM-FSR-2026-AUTOGEN</span>
            </div>

            {validationError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-900 text-xs flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">Work Undertaken (Engineer Narrative):</label>
              <textarea
                rows={3}
                value={reportNarrative}
                onChange={(e) => setReportNarrative(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded font-sans text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Engineer Recommendations:</label>
              <textarea
                rows={2}
                value={reportRecs}
                onChange={(e) => setReportRecs(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded font-sans text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Completion Outcome:</label>
              <select
                value={reportOutcome}
                onChange={(e) => setReportOutcome(e.target.value as any)}
                className="w-full p-2 border border-slate-300 rounded font-sans text-xs"
              >
                <option value="COMPLETED">Fully Completed</option>
                <option value="PARTIALLY_COMPLETED">Partially Completed</option>
                <option value="FURTHER_WORK_REQUIRED">Further Work Required</option>
                <option value="AWAITING_PARTS">Awaiting Parts (Return Visit)</option>
                <option value="MAKE_SAFE_ONLY">Make Safe Only (Critical Issue)</option>
              </select>
            </div>

            {/* Site Signatory */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
              <span className="font-bold text-slate-900 block">Site Representative Sign-Off</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] text-slate-500">Contact Name</label>
                  <input
                    type="text"
                    value={signatoryName}
                    onChange={(e) => setSignatoryName(e.target.value)}
                    className="w-full p-1.5 border border-slate-300 rounded text-xs font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] text-slate-500">Role / Position</label>
                  <input
                    type="text"
                    value={signatoryRole}
                    onChange={(e) => setSignatoryRole(e.target.value)}
                    className="w-full p-1.5 border border-slate-300 rounded text-xs font-sans"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmitServiceReport}
              disabled={isSubmitting || visit.status === 'SUBMITTED' || visit.status === 'VALIDATED'}
              className="btn-primary w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>
                {visit.status === 'SUBMITTED'
                  ? 'Service Report Submitted'
                  : visit.status === 'VALIDATED'
                  ? 'Service Report Validated'
                  : 'Submit Service Report to EntireFM'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* No Access Modal */}
      {noAccessOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded max-w-md w-full p-5 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-slate-900">Record No Access</h3>
            <p className="text-xs text-slate-600">
              Select the primary reason for being unable to access site or asset:
            </p>

            <select
              value={noAccessReason}
              onChange={(e) => setNoAccessReason(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded text-xs font-sans"
            >
              <option value="Site closed / No keyholder present">Site closed / No keyholder present</option>
              <option value="Access denied by tenant / occupant">Access denied by tenant</option>
              <option value="Incorrect access codes / key missing">Incorrect access codes</option>
              <option value="Asset physically obstructed / unsafe access">Asset physically obstructed</option>
              <option value="Permit to work not issued by site">Permit to work unavailable</option>
            </select>

            <textarea
              rows={2}
              value={noAccessNotes}
              onChange={(e) => setNoAccessNotes(e.target.value)}
              placeholder="Notes on contact attempts with site manager..."
              className="w-full p-2 border border-slate-300 rounded text-xs font-sans"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setNoAccessOpen(false)}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleNoAccessSubmit}
                className="btn-primary text-xs py-1.5 px-4 bg-rose-700 text-white font-bold"
              >
                Submit No Access (Pause SLA)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Defect Modal */}
      {defectModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded max-w-md w-full p-5 space-y-3 shadow-xl text-xs font-sans">
            <h3 className="text-sm font-bold text-slate-900">Raise Operational Defect</h3>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Defect Title</label>
              <input
                type="text"
                value={defectTitle}
                onChange={(e) => setDefectTitle(e.target.value)}
                placeholder="e.g. Severely worn fan drive bearing"
                className="w-full p-2 border border-slate-300 rounded text-xs font-sans"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Severity</label>
              <select
                value={defectSeverity}
                onChange={(e) => setDefectSeverity(e.target.value as any)}
                className="w-full p-2 border border-slate-300 rounded text-xs font-sans"
              >
                <option value="ADVISORY">Advisory</option>
                <option value="MINOR">Minor</option>
                <option value="MAJOR">Major</option>
                <option value="CRITICAL">Critical</option>
                <option value="UNSAFE">Unsafe (Immediate Hazard)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Make Safe Status</label>
              <select
                value={defectMakeSafe}
                onChange={(e) => setDefectMakeSafe(e.target.value as any)}
                className="w-full p-2 border border-slate-300 rounded text-xs font-sans"
              >
                <option value="MADE_SAFE">Made Safe</option>
                <option value="ISOLATED">Isolated from supply</option>
                <option value="UNABLE_TO_MAKE_SAFE">Unable to Make Safe</option>
                <option value="NOT_APPLICABLE">Not Applicable</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Description &amp; Observations</label>
              <textarea
                rows={2}
                value={defectDesc}
                onChange={(e) => setDefectDesc(e.target.value)}
                placeholder="Details of the physical defect and hazard..."
                className="w-full p-2 border border-slate-300 rounded text-xs font-sans"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDefectModalOpen(false)}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!defectTitle || !defectDesc || isSubmitting}
                onClick={handleRaiseDefect}
                className="btn-primary text-xs py-1.5 px-4 bg-amber-700 text-white font-bold"
              >
                Record Defect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Variation Modal */}
      {variationModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded max-w-md w-full p-5 space-y-3 shadow-xl text-xs font-sans">
            <h3 className="text-sm font-bold text-slate-900">Request Additional Scope / Variation</h3>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Reason for Variation</label>
              <input
                type="text"
                value={variationReason}
                onChange={(e) => setVariationReason(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-xs font-sans"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Scope of Additional Work</label>
              <textarea
                rows={2}
                value={variationScope}
                onChange={(e) => setVariationScope(e.target.value)}
                placeholder="Detail additional labour and materials required..."
                className="w-full p-2 border border-slate-300 rounded text-xs font-sans"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Est. Labour Hours</label>
                <input
                  type="number"
                  value={variationHours}
                  onChange={(e) => setVariationHours(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-slate-300 rounded text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Est. Parts (£)</label>
                <input
                  type="number"
                  value={variationPartsGbp}
                  onChange={(e) => setVariationPartsGbp(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-slate-300 rounded text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setVariationModalOpen(false)}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!variationScope || isSubmitting}
                onClick={handleRequestVariation}
                className="btn-primary text-xs py-1.5 px-4 bg-brand-pink text-white font-bold"
              >
                Submit Variation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Part Modal */}
      {partModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded max-w-md w-full p-5 space-y-3 shadow-xl text-xs font-sans">
            <h3 className="text-sm font-bold text-slate-900">Record Part / Material</h3>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Part Description</label>
              <input
                type="text"
                value={partName}
                onChange={(e) => setPartName(e.target.value)}
                placeholder="e.g. 24V Contactor or F7 Pocket Filter"
                className="w-full p-2 border border-slate-300 rounded text-xs font-sans"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Part Number</label>
              <input
                type="text"
                value={partNumber}
                onChange={(e) => setPartNumber(e.target.value)}
                placeholder="e.g. D-CON-24V-01"
                className="w-full p-2 border border-slate-300 rounded text-xs font-mono"
              />
            </div>

            <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={partAwaiting}
                onChange={(e) => setPartAwaiting(e.target.checked)}
                className="text-brand-pink h-4 w-4"
              />
              <span>Part not in stock &mdash; Awaiting delivery (Return visit required)</span>
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPartModalOpen(false)}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!partName || isSubmitting}
                onClick={handleRecordPart}
                className="btn-primary text-xs py-1.5 px-4 bg-emerald-700 text-white font-bold"
              >
                Save Part
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
