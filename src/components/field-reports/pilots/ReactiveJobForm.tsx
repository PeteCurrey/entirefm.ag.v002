'use client';

import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Clock,
  Plus,
  Trash2,
  AlertTriangle,
  Camera,
  CheckCircle2,
  FileText,
  MapPin,
  Shield,
  ArrowRight,
} from 'lucide-react';
import SignatureCapture from '../SignatureCapture';
import type {
  FullReportPack,
  LabourRowData,
  MaterialRowData,
  ReportDefectRowData,
  ReactiveJobOutcome,
  SignatureType,
} from '@/server/field-reports/types';

interface Props {
  pack: FullReportPack;
  onAutosave: (payload: {
    responses: Array<{ section_key: string; field_key: string; value: any }>;
    repeatableRows?: Record<string, any[]>;
  }) => Promise<void>;
  onSign: (sig: {
    signatureType: SignatureType;
    signatoryName: string;
    signatoryPosition?: string;
    signatureDataUrl?: string;
    declarationText?: string;
  }) => Promise<void>;
  isReadOnly?: boolean;
}

export default function ReactiveJobForm({
  pack,
  onAutosave,
  onSign,
  isReadOnly,
}: Props) {
  const { instance, responses, repeatableRows, signatures } = pack;

  // 01 Issue Reported
  const [issueDesc, setIssueDesc] = useState<string>(
    responses['01_issue_reported']?.issue_description || instance.work_order?.description || ''
  );
  const [initialNotes, setInitialNotes] = useState<string>(
    responses['01_issue_reported']?.engineer_initial_notes || ''
  );

  // 02 Attendance
  const [arrivalTime, setArrivalTime] = useState<string>(
    responses['02_attendance']?.arrival_time || '08:30'
  );
  const [departureTime, setDepartureTime] = useState<string>(
    responses['02_attendance']?.departure_time || '10:45'
  );
  const [permitRequired, setPermitRequired] = useState<boolean>(
    responses['02_attendance']?.permit_required === true
  );
  const [isolationRequired, setIsolationRequired] = useState<boolean>(
    responses['02_attendance']?.isolation_required === true
  );
  const [outOfHours, setOutOfHours] = useState<boolean>(
    responses['02_attendance']?.out_of_hours === true
  );

  // 03 Diagnosis / Works
  const [worksCarriedOut, setWorksCarriedOut] = useState<string>(
    responses['03_diagnosis_works']?.works_carried_out || ''
  );

  // 04 Labour Rows
  const initialLabour = (repeatableRows['04_labour'] || []).map(r => r.data_json as LabourRowData);
  const [labour, setLabour] = useState<LabourRowData[]>(
    initialLabour.length > 0
      ? initialLabour
      : [
          {
            operative_name: instance.assigned_engineer ? `${instance.assigned_engineer.first_name} ${instance.assigned_engineer.last_name}` : 'Field Engineer',
            trade: 'General Hard FM',
            arrival_time: '08:30',
            departure_time: '10:45',
            hours_total: 2.25,
            is_overtime: false,
          },
        ]
  );

  // 05 Materials
  const initialMaterials = (repeatableRows['05_materials'] || []).map(r => r.data_json as MaterialRowData);
  const [materials, setMaterials] = useState<MaterialRowData[]>(initialMaterials);

  // 06 Outcome
  const [outcome, setOutcome] = useState<ReactiveJobOutcome>(
    responses['06_outcome']?.job_outcome || 'COMPLETED'
  );

  // 07 Defects
  const initialDefects = (repeatableRows['07_defects'] || []).map(r => r.data_json as ReportDefectRowData);
  const [defects, setDefects] = useState<ReportDefectRowData[]>(initialDefects);

  // Trigger autosave when local state changes
  useEffect(() => {
    if (isReadOnly) return;
    const timeout = setTimeout(() => {
      onAutosave({
        responses: [
          { section_key: '01_issue_reported', field_key: 'issue_description', value: issueDesc },
          { section_key: '01_issue_reported', field_key: 'engineer_initial_notes', value: initialNotes },
          {
            section_key: '02_attendance',
            field_key: 'attendance_data',
            value: {
              arrival_time: arrivalTime,
              departure_time: departureTime,
              permit_required: permitRequired,
              isolation_required: isolationRequired,
              out_of_hours: outOfHours,
            },
          },
          { section_key: '02_attendance', field_key: 'arrival_time', value: arrivalTime },
          { section_key: '02_attendance', field_key: 'departure_time', value: departureTime },
          { section_key: '02_attendance', field_key: 'permit_required', value: permitRequired },
          { section_key: '02_attendance', field_key: 'isolation_required', value: isolationRequired },
          { section_key: '02_attendance', field_key: 'out_of_hours', value: outOfHours },
          { section_key: '03_diagnosis_works', field_key: 'works_carried_out', value: worksCarriedOut },
          { section_key: '06_outcome', field_key: 'job_outcome', value: outcome },
        ],
        repeatableRows: {
          '04_labour': labour.map((l, i) => ({
            row_type: 'LABOUR_ROW',
            sequence_order: i + 1,
            data_json: l,
          })),
          '05_materials': materials.map((m, i) => ({
            row_type: 'MATERIAL_ROW',
            sequence_order: i + 1,
            data_json: m,
          })),
          '07_defects': defects.map((d, i) => ({
            row_type: 'DEFECT_ROW',
            sequence_order: i + 1,
            data_json: d,
          })),
        },
      });
    }, 600);

    return () => clearTimeout(timeout);
  }, [
    issueDesc,
    initialNotes,
    arrivalTime,
    departureTime,
    permitRequired,
    isolationRequired,
    outOfHours,
    worksCarriedOut,
    labour,
    materials,
    outcome,
    defects,
    isReadOnly,
  ]);

  const handleRecordArrivalNow = () => {
    const now = new Date();
    const formatted = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setArrivalTime(formatted);
  };

  const handleAddLabour = () => {
    setLabour([
      ...labour,
      {
        operative_name: '',
        trade: 'Assistant / Specialist',
        arrival_time: arrivalTime,
        departure_time: departureTime,
        hours_total: 1.0,
        is_overtime: false,
      },
    ]);
  };

  const handleAddMaterial = () => {
    setMaterials([
      ...materials,
      {
        description: '',
        part_number: '',
        quantity: 1,
        unit: 'EA',
        supplier: 'Van Stock',
        is_chargeable: true,
      },
    ]);
  };

  const handleAddDefect = () => {
    setDefects([
      ...defects,
      {
        title: '',
        description: '',
        location: instance.site?.name || 'Site',
        severity: 'MAJOR',
        action_taken: 'Made safe / isolated where necessary',
        further_action_required: '',
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* ── 01 ISSUE REPORTED ── */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <span className="w-6 h-6 rounded bg-indigo-950 text-indigo-400 font-mono text-xs font-bold flex items-center justify-center">
            01
          </span>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Issue Reported</h2>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Reported Fault / Problem *
            </label>
            <textarea
              rows={3}
              value={issueDesc}
              disabled={isReadOnly}
              onChange={(e) => setIssueDesc(e.target.value)}
              placeholder="Fault description from service desk / work order..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Engineer Initial Assessment
            </label>
            <input
              type="text"
              value={initialNotes}
              disabled={isReadOnly}
              onChange={(e) => setInitialNotes(e.target.value)}
              placeholder="e.g. Arrived on site, plant room access confirmed"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-60"
            />
          </div>
        </div>
      </section>

      {/* ── 02 ATTENDANCE ── */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-indigo-950 text-indigo-400 font-mono text-xs font-bold flex items-center justify-center">
              02
            </span>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Attendance &amp; Site Access</h2>
          </div>
          {!isReadOnly && (
            <button
              type="button"
              onClick={handleRecordArrivalNow}
              className="px-3 py-1 rounded bg-indigo-950 hover:bg-indigo-900 text-indigo-300 text-xs font-bold border border-indigo-800 flex items-center gap-1.5 transition-colors"
            >
              <Clock className="w-3.5 h-3.5" /> Arrived On Site
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Arrival Time</label>
            <input
              type="time"
              value={arrivalTime}
              disabled={isReadOnly}
              onChange={(e) => setArrivalTime(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-60"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Departure Time</label>
            <input
              type="time"
              value={departureTime}
              disabled={isReadOnly}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-60"
            />
          </div>
        </div>

        {/* Safety & Access Flags */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            disabled={isReadOnly}
            onClick={() => setPermitRequired(!permitRequired)}
            className={`p-2.5 rounded-lg text-xs font-bold border transition-colors ${
              permitRequired
                ? 'bg-amber-950 text-amber-200 border-amber-800'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            {permitRequired ? '✓ Permit Active' : 'Permit Required?'}
          </button>
          <button
            type="button"
            disabled={isReadOnly}
            onClick={() => setIsolationRequired(!isolationRequired)}
            className={`p-2.5 rounded-lg text-xs font-bold border transition-colors ${
              isolationRequired
                ? 'bg-amber-950 text-amber-200 border-amber-800'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            {isolationRequired ? '✓ Isolated' : 'Isolation Req?'}
          </button>
          <button
            type="button"
            disabled={isReadOnly}
            onClick={() => setOutOfHours(!outOfHours)}
            className={`p-2.5 rounded-lg text-xs font-bold border transition-colors ${
              outOfHours
                ? 'bg-indigo-950 text-indigo-200 border-indigo-800'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            {outOfHours ? '✓ Out of Hours' : 'OOH Work?'}
          </button>
        </div>
      </section>

      {/* ── 03 DIAGNOSIS / WORKS CARRIED OUT ── */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <span className="w-6 h-6 rounded bg-indigo-950 text-indigo-400 font-mono text-xs font-bold flex items-center justify-center">
            03
          </span>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Diagnosis / Works Carried Out *
          </h2>
        </div>

        <div>
          <textarea
            rows={5}
            value={worksCarriedOut}
            disabled={isReadOnly}
            onChange={(e) => setWorksCarriedOut(e.target.value)}
            placeholder="Detailed description of works executed, test results, adjustments made, and parts replaced..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-60"
          />
        </div>
      </section>

      {/* ── 04 LABOUR ── */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-indigo-950 text-indigo-400 font-mono text-xs font-bold flex items-center justify-center">
              04
            </span>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Labour Allocation</h2>
          </div>
          {!isReadOnly && (
            <button
              type="button"
              onClick={handleAddLabour}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Operative
            </button>
          )}
        </div>

        <div className="space-y-3">
          {labour.map((row, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={row.operative_name}
                  disabled={isReadOnly}
                  onChange={(e) => {
                    const copy = [...labour];
                    copy[idx].operative_name = e.target.value;
                    setLabour(copy);
                  }}
                  placeholder="Operative Name"
                  className="bg-transparent text-sm font-semibold text-white focus:outline-none focus:underline"
                />
                {!isReadOnly && labour.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setLabour(labour.filter((_, i) => i !== idx))}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Trade</span>
                  <input
                    type="text"
                    value={row.trade}
                    disabled={isReadOnly}
                    onChange={(e) => {
                      const copy = [...labour];
                      copy[idx].trade = e.target.value;
                      setLabour(copy);
                    }}
                    placeholder="Trade"
                    className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Total Hours</span>
                  <input
                    type="number"
                    step="0.25"
                    value={row.hours_total}
                    disabled={isReadOnly}
                    onChange={(e) => {
                      const copy = [...labour];
                      copy[idx].hours_total = parseFloat(e.target.value) || 0;
                      setLabour(copy);
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white font-mono"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    disabled={isReadOnly}
                    onClick={() => {
                      const copy = [...labour];
                      copy[idx].is_overtime = !copy[idx].is_overtime;
                      setLabour(copy);
                    }}
                    className={`w-full py-1.5 rounded text-[11px] font-bold border ${
                      row.is_overtime
                        ? 'bg-amber-950 text-amber-200 border-amber-800'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {row.is_overtime ? 'Overtime' : 'Standard'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 05 MATERIALS ── */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-indigo-950 text-indigo-400 font-mono text-xs font-bold flex items-center justify-center">
              05
            </span>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Materials &amp; Parts</h2>
          </div>
          {!isReadOnly && (
            <button
              type="button"
              onClick={handleAddMaterial}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Material
            </button>
          )}
        </div>

        {materials.length === 0 ? (
          <div className="text-xs text-slate-500 text-center py-4 bg-slate-950/50 rounded-lg border border-dashed border-slate-800">
            No materials or consumables recorded. Tap &apos;+ Add Material&apos; if parts were fitted.
          </div>
        ) : (
          <div className="space-y-3">
            {materials.map((mat, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={mat.description}
                    disabled={isReadOnly}
                    onChange={(e) => {
                      const copy = [...materials];
                      copy[idx].description = e.target.value;
                      setMaterials(copy);
                    }}
                    placeholder="Part Description / Item Name"
                    className="bg-transparent text-sm font-semibold text-white focus:outline-none focus:underline flex-1 mr-2"
                  />
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => setMaterials(materials.filter((_, i) => i !== idx))}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Quantity</span>
                    <input
                      type="number"
                      value={mat.quantity}
                      disabled={isReadOnly}
                      onChange={(e) => {
                        const copy = [...materials];
                        copy[idx].quantity = parseInt(e.target.value, 10) || 1;
                        setMaterials(copy);
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Part Number</span>
                    <input
                      type="text"
                      value={mat.part_number || ''}
                      disabled={isReadOnly}
                      onChange={(e) => {
                        const copy = [...materials];
                        copy[idx].part_number = e.target.value;
                        setMaterials(copy);
                      }}
                      placeholder="e.g. V-BELT-A42"
                      className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white font-mono"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      disabled={isReadOnly}
                      onClick={() => {
                        const copy = [...materials];
                        copy[idx].is_chargeable = !copy[idx].is_chargeable;
                        setMaterials(copy);
                      }}
                      className={`w-full py-1.5 rounded text-[11px] font-bold border ${
                        mat.is_chargeable
                          ? 'bg-indigo-950 text-indigo-200 border-indigo-800'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {mat.is_chargeable ? 'Chargeable' : 'Included'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── 06 OUTCOME ── */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <span className="w-6 h-6 rounded bg-indigo-950 text-indigo-400 font-mono text-xs font-bold flex items-center justify-center">
            06
          </span>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Job Outcome *</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(
            [
              ['COMPLETED', 'Completed', 'bg-emerald-600 border-emerald-500'],
              ['TEMPORARY_REPAIR', 'Temporary Repair', 'bg-amber-600 border-amber-500'],
              ['FOLLOW_ON_REQUIRED', 'Follow-On Required', 'bg-sky-600 border-sky-500'],
              ['QUOTATION_REQUIRED', 'Quotation Required', 'bg-purple-600 border-purple-500'],
              ['PARTS_REQUIRED', 'Parts Required', 'bg-indigo-600 border-indigo-500'],
              ['SPECIALIST_SUBCONTRACTOR_REQUIRED', 'Specialist Required', 'bg-rose-600 border-rose-500'],
            ] as const
          ).map(([val, label, activeClass]) => (
            <button
              key={val}
              type="button"
              disabled={isReadOnly}
              onClick={() => setOutcome(val)}
              className={`p-3 rounded-lg font-bold text-xs tracking-wider border transition-all text-center ${
                outcome === val
                  ? `${activeClass} text-white shadow-md`
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* ── 07 DEFECTS / OBSERVATIONS ── */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-indigo-950 text-indigo-400 font-mono text-xs font-bold flex items-center justify-center">
              07
            </span>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Defects &amp; Remedial Actions
            </h2>
          </div>
          {!isReadOnly && (
            <button
              type="button"
              onClick={handleAddDefect}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Log Defect
            </button>
          )}
        </div>

        {defects.length === 0 ? (
          <div className="text-xs text-slate-500 text-center py-4 bg-slate-950/50 rounded-lg border border-dashed border-slate-800">
            No active compliance or asset defects identified.
          </div>
        ) : (
          <div className="space-y-4">
            {defects.map((def, idx) => (
              <div key={idx} className="bg-slate-950 border border-amber-900/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                      DEFECT #{idx + 1}
                    </span>
                    <select
                      value={def.severity}
                      disabled={isReadOnly}
                      onChange={(e) => {
                        const copy = [...defects];
                        copy[idx].severity = e.target.value as any;
                        setDefects(copy);
                      }}
                      className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                    >
                      <option value="CRITICAL">CRITICAL</option>
                      <option value="MAJOR">MAJOR</option>
                      <option value="MINOR">MINOR</option>
                    </select>
                  </div>
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => setDefects(defects.filter((_, i) => i !== idx))}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Defect Description *</label>
                    <input
                      type="text"
                      value={def.description}
                      disabled={isReadOnly}
                      onChange={(e) => {
                        const copy = [...defects];
                        copy[idx].description = e.target.value;
                        setDefects(copy);
                      }}
                      placeholder="e.g. Pump seal weeping water onto baseplate"
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 block mb-1">Location</label>
                      <input
                        type="text"
                        value={def.location}
                        disabled={isReadOnly}
                        onChange={(e) => {
                          const copy = [...defects];
                          copy[idx].location = e.target.value;
                          setDefects(copy);
                        }}
                        placeholder="e.g. Basement Plant Room"
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Action Taken</label>
                      <input
                        type="text"
                        value={def.action_taken}
                        disabled={isReadOnly}
                        onChange={(e) => {
                          const copy = [...defects];
                          copy[idx].action_taken = e.target.value;
                          setDefects(copy);
                        }}
                        placeholder="e.g. Isolated valve and mopped area"
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Further Action / Quotation Required</label>
                    <input
                      type="text"
                      value={def.further_action_required}
                      disabled={isReadOnly}
                      onChange={(e) => {
                        const copy = [...defects];
                        copy[idx].further_action_required = e.target.value;
                        setDefects(copy);
                      }}
                      placeholder="e.g. Replacement mechanical seal kit required"
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── 09 ENGINEER SIGNATURE ── */}
      <section className="space-y-4">
        <SignatureCapture
          type="ENGINEER"
          title="09 Engineer Declaration & Sign-Off *"
          defaultName={
            instance.assigned_engineer
              ? `${instance.assigned_engineer.first_name} ${instance.assigned_engineer.last_name}`
              : ''
          }
          defaultPosition="Competent Field Engineer"
          existingSignature={signatures.ENGINEER}
          declarationText="I certify that the above works were completed in accordance with EntireFM SFG20 standard and site safety guidelines."
          onSaveSignature={onSign}
          disabled={isReadOnly}
        />
      </section>

      {/* ── 10 CLIENT SIGNATURE ── */}
      <section className="space-y-4">
        <SignatureCapture
          type="CLIENT_REP"
          title="10 Client / Site Representative Sign-Off (Optional)"
          defaultName=""
          defaultPosition="Facilities / Site Lead"
          existingSignature={signatures.CLIENT_REP}
          declarationText="I acknowledge that the engineer attended site and works described were performed."
          onSaveSignature={onSign}
          disabled={isReadOnly}
        />
      </section>
    </div>
  );
}
