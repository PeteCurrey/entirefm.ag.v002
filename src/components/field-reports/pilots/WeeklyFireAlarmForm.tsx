'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Plus,
  Trash2,
  AlertOctagon,
  Flame,
  CheckCircle2,
  XCircle,
  Bell,
  Radio,
} from 'lucide-react';
import FieldCheckControl from '../FieldCheckControl';
import SignatureCapture from '../SignatureCapture';
import type {
  FullReportPack,
  CallPointTestRowData,
  ReportDefectRowData,
  CheckResult,
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

export default function WeeklyFireAlarmForm({
  pack,
  onAutosave,
  onSign,
  isReadOnly,
}: Props) {
  const { instance, responses, repeatableRows, signatures } = pack;

  // 01 System Details
  const [panelModel, setPanelModel] = useState<string>(
    responses['01_system_details']?.panel_model || 'Advanced MX-5000 4-Loop'
  );
  const [category, setCategory] = useState<string>(
    responses['01_system_details']?.category || 'Category L1 / P1 Standard'
  );
  const [arcStation, setArcStation] = useState<string>(
    responses['01_system_details']?.arc_station || 'DualCom Plus ARC Active'
  );

  // 02 Panel Inspection
  const [mainsHealthy, setMainsHealthy] = useState<CheckResult>(
    responses['02_panel_inspection']?.mains_healthy || 'PASS'
  );
  const [faultClear, setFaultClear] = useState<CheckResult>(
    responses['02_panel_inspection']?.fault_indicators_clear || 'PASS'
  );
  const [batteryNormal, setBatteryNormal] = useState<CheckResult>(
    responses['02_panel_inspection']?.battery_state || 'PASS'
  );
  const [zonesNormal, setZonesNormal] = useState<CheckResult>(
    responses['02_panel_inspection']?.zones_normal || 'PASS'
  );

  // 03 Call Points Tested
  const initialCallPoints = (repeatableRows['03_call_points'] || []).map(r => r.data_json as CallPointTestRowData);
  const [callPoints, setCallPoints] = useState<CallPointTestRowData[]>(
    initialCallPoints.length > 0
      ? initialCallPoints
      : [
          {
            call_point_ref: 'MCP-008',
            zone_loop: 'Zone 2 / Loop 1',
            floor_area: 'First Floor East Wing',
            exact_location: 'Adjacent to Staircase Core B (Exit G.12)',
            test_result: 'PASS',
          },
        ]
  );

  // 04 Ancillaries
  const [soundersOperate, setSoundersOperate] = useState<CheckResult>(
    responses['04_ancillaries']?.sounders_operate || 'PASS'
  );
  const [arcConfirmed, setArcConfirmed] = useState<CheckResult>(
    responses['04_ancillaries']?.arc_confirmed || 'PASS'
  );
  const [doorReleases, setDoorReleases] = useState<CheckResult>(
    responses['04_ancillaries']?.door_releases || 'PASS'
  );

  // 05 Defects (auto-populated or manually added)
  const initialDefects = (repeatableRows['05_defects'] || []).map(r => r.data_json as ReportDefectRowData);
  const [defects, setDefects] = useState<ReportDefectRowData[]>(initialDefects);

  // Detect any FAIL to highlight inline defect requirements
  const hasAnyFail =
    mainsHealthy === 'FAIL' ||
    faultClear === 'FAIL' ||
    batteryNormal === 'FAIL' ||
    zonesNormal === 'FAIL' ||
    soundersOperate === 'FAIL' ||
    arcConfirmed === 'FAIL' ||
    doorReleases === 'FAIL' ||
    callPoints.some(cp => cp.test_result === 'FAIL');

  // Trigger autosave on changes
  useEffect(() => {
    if (isReadOnly) return;
    const timeout = setTimeout(() => {
      onAutosave({
        responses: [
          {
            section_key: '01_system_details',
            field_key: 'system_data',
            value: { panel_model: panelModel, category, arc_station: arcStation },
          },
          { section_key: '01_system_details', field_key: 'panel_model', value: panelModel },
          { section_key: '01_system_details', field_key: 'category', value: category },
          { section_key: '01_system_details', field_key: 'arc_station', value: arcStation },

          {
            section_key: '02_panel_inspection',
            field_key: 'panel_data',
            value: {
              mains_healthy: mainsHealthy,
              fault_indicators_clear: faultClear,
              battery_state: batteryNormal,
              zones_normal: zonesNormal,
            },
          },
          { section_key: '02_panel_inspection', field_key: 'mains_healthy', value: mainsHealthy },
          { section_key: '02_panel_inspection', field_key: 'fault_indicators_clear', value: faultClear },
          { section_key: '02_panel_inspection', field_key: 'battery_state', value: batteryNormal },
          { section_key: '02_panel_inspection', field_key: 'zones_normal', value: zonesNormal },

          {
            section_key: '04_ancillaries',
            field_key: 'ancillaries_data',
            value: {
              sounders_operate: soundersOperate,
              arc_confirmed: arcConfirmed,
              door_releases: doorReleases,
            },
          },
          { section_key: '04_ancillaries', field_key: 'sounders_operate', value: soundersOperate },
          { section_key: '04_ancillaries', field_key: 'arc_confirmed', value: arcConfirmed },
          { section_key: '04_ancillaries', field_key: 'door_releases', value: doorReleases },
        ],
        repeatableRows: {
          '03_call_points': callPoints.map((cp, i) => ({
            row_type: 'CHECK_ROW',
            sequence_order: i + 1,
            data_json: cp,
          })),
          '05_defects': defects.map((d, i) => ({
            row_type: 'DEFECT_ROW',
            sequence_order: i + 1,
            data_json: d,
          })),
        },
      });
    }, 600);

    return () => clearTimeout(timeout);
  }, [
    panelModel,
    category,
    arcStation,
    mainsHealthy,
    faultClear,
    batteryNormal,
    zonesNormal,
    callPoints,
    soundersOperate,
    arcConfirmed,
    doorReleases,
    defects,
    isReadOnly,
  ]);

  const handleAddCallPoint = () => {
    const nextNum = callPoints.length + 1;
    setCallPoints([
      ...callPoints,
      {
        call_point_ref: `MCP-00${nextNum}`,
        zone_loop: 'Zone 1 / Loop 1',
        floor_area: 'Ground Floor',
        exact_location: '',
        test_result: 'PASS',
      },
    ]);
  };

  const handleCallPointResultChange = (idx: number, result: CheckResult) => {
    const copy = [...callPoints];
    copy[idx].test_result = result;
    setCallPoints(copy);

    // If marked FAIL, automatically ensure defect entry exists
    if (result === 'FAIL') {
      const failedCp = copy[idx];
      const exists = defects.some(d => d.linked_asset_reference === failedCp.call_point_ref);
      if (!exists) {
        setDefects([
          ...defects,
          {
            title: `Call Point Failure: ${failedCp.call_point_ref}`,
            description: `Manual call point ${failedCp.call_point_ref} at ${failedCp.exact_location || failedCp.floor_area} failed to trigger alarm signal on test key insertion.`,
            location: `${failedCp.floor_area} - ${failedCp.exact_location}`,
            severity: 'CRITICAL',
            action_taken: 'Noted in site fire logbook; reported to building management.',
            further_action_required: 'Immediate call point microswitch replacement required.',
            linked_asset_reference: failedCp.call_point_ref,
          },
        ]);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* ── 01 SYSTEM DETAILS ── */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <span className="w-6 h-6 rounded bg-indigo-950 text-indigo-400 text-xs font-bold flex items-center justify-center">
            01
          </span>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-500" />
            Fire Alarm System Details (BS 5839-1)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Control Panel Model</label>
            <input
              type="text"
              value={panelModel}
              disabled={isReadOnly}
              onChange={(e) => setPanelModel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-60"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">System Category</label>
            <input
              type="text"
              value={category}
              disabled={isReadOnly}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-60"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Monitoring Link (ARC)</label>
            <input
              type="text"
              value={arcStation}
              disabled={isReadOnly}
              onChange={(e) => setArcStation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-60"
            />
          </div>
        </div>
      </section>

      {/* ── 02 PANEL INSPECTION ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <span className="w-6 h-6 rounded bg-indigo-950 text-indigo-400 text-xs font-bold flex items-center justify-center">
            02
          </span>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Control Panel State Inspection
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FieldCheckControl
            label="Mains Supply Indicator"
            sublabel="Healthy & Continuous (Green LED)"
            value={mainsHealthy}
            onChange={setMainsHealthy}
            disabled={isReadOnly}
          />
          <FieldCheckControl
            label="Fault & Disablement Indicators"
            sublabel="All clear, no yellow fault/disable LEDs illuminated"
            value={faultClear}
            onChange={setFaultClear}
            disabled={isReadOnly}
          />
          <FieldCheckControl
            label="Battery Charger & Standby State"
            sublabel="Float voltage nominal, no charger fault"
            value={batteryNormal}
            onChange={setBatteryNormal}
            disabled={isReadOnly}
          />
          <FieldCheckControl
            label="Zones in Normal Mode"
            sublabel="All detection zones armed without bypass"
            value={zonesNormal}
            onChange={setZonesNormal}
            disabled={isReadOnly}
          />
        </div>
      </section>

      {/* ── 03 CALL POINTS TESTED ── */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-indigo-950 text-indigo-400 text-xs font-bold flex items-center justify-center">
              03
            </span>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Rotational Call Point(s) Tested *
            </h2>
          </div>
          {!isReadOnly && (
            <button
              type="button"
              onClick={handleAddCallPoint}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Test Another Device
            </button>
          )}
        </div>

        <div className="space-y-4">
          {callPoints.map((cp, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={cp.call_point_ref}
                    disabled={isReadOnly}
                    onChange={(e) => {
                      const copy = [...callPoints];
                      copy[idx].call_point_ref = e.target.value;
                      setCallPoints(copy);
                    }}
                    placeholder="Ref (e.g. MCP-012)"
                    className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sm font-bold text-sky-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={cp.zone_loop}
                    disabled={isReadOnly}
                    onChange={(e) => {
                      const copy = [...callPoints];
                      copy[idx].zone_loop = e.target.value;
                      setCallPoints(copy);
                    }}
                    placeholder="Zone / Loop"
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300"
                  />
                </div>
                {!isReadOnly && callPoints.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setCallPoints(callPoints.filter((_, i) => i !== idx))}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Floor / Area</label>
                  <input
                    type="text"
                    value={cp.floor_area}
                    disabled={isReadOnly}
                    onChange={(e) => {
                      const copy = [...callPoints];
                      copy[idx].floor_area = e.target.value;
                      setCallPoints(copy);
                    }}
                    placeholder="e.g. Ground Floor East Wing"
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Exact Location</label>
                  <input
                    type="text"
                    value={cp.exact_location}
                    disabled={isReadOnly}
                    onChange={(e) => {
                      const copy = [...callPoints];
                      copy[idx].exact_location = e.target.value;
                      setCallPoints(copy);
                    }}
                    placeholder="e.g. Next to Exit Door G.04"
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-1">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Test Result</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={isReadOnly}
                    onClick={() => handleCallPointResultChange(idx, 'PASS')}
                    className={`py-2 rounded-lg font-bold text-xs border ${
                      cp.test_result === 'PASS'
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    ✓ PASS (Activated Alarm)
                  </button>
                  <button
                    type="button"
                    disabled={isReadOnly}
                    onClick={() => handleCallPointResultChange(idx, 'FAIL')}
                    className={`py-2 rounded-lg font-bold text-xs border ${
                      cp.test_result === 'FAIL'
                        ? 'bg-rose-600 text-white border-rose-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    ✕ FAIL (Defect Revealed)
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 04 ANCILLARIES ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <span className="w-6 h-6 rounded bg-indigo-950 text-indigo-400 text-xs font-bold flex items-center justify-center">
            04
          </span>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Sounders, Signalling &amp; Ancillaries
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FieldCheckControl
            label="Sounders & Beacons"
            sublabel="Audible alarm throughout building"
            value={soundersOperate}
            onChange={setSoundersOperate}
            disabled={isReadOnly}
          />
          <FieldCheckControl
            label="Monitoring Station (ARC)"
            sublabel="Signal transmission confirmed"
            value={arcConfirmed}
            onChange={setArcConfirmed}
            disabled={isReadOnly}
          />
          <FieldCheckControl
            label="Magnetic Door Releases"
            sublabel="Fire doors release on alarm"
            value={doorReleases}
            onChange={setDoorReleases}
            disabled={isReadOnly}
          />
        </div>
      </section>

      {/* ── 05 DEFECT REVEAL BLOCK ── */}
      {hasAnyFail && (
        <section className="bg-slate-900 border-2 border-rose-600/70 rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-rose-900/40 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-rose-950 text-rose-300 text-xs font-bold flex items-center justify-center">
                05
              </span>
              <h2 className="text-sm font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                Defect &amp; Rectification Notice (Revealed)
              </h2>
            </div>
            {!isReadOnly && (
              <button
                type="button"
                onClick={() =>
                  setDefects([
                    ...defects,
                    {
                      title: 'Fire Alarm System Fault',
                      description: '',
                      location: instance.site?.name || 'Site',
                      severity: 'CRITICAL',
                      action_taken: 'Noted in logbook',
                      further_action_required: '',
                    },
                  ])
                }
                className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Defect
              </button>
            )}
          </div>

          <p className="text-xs text-rose-200 bg-rose-950/40 border border-rose-900/50 rounded-lg p-3">
            ⚠️ One or more statutory checks failed. A formal defect will be synchronised to the CAFM registry upon submission.
          </p>

          <div className="space-y-4">
            {defects.map((def, idx) => (
              <div key={idx} className="bg-slate-950 border border-rose-900/60 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-300">
                    DEFECT RECORD #{idx + 1} {def.linked_asset_reference ? `(${def.linked_asset_reference})` : ''}
                  </span>
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
                    <textarea
                      rows={2}
                      value={def.description}
                      disabled={isReadOnly}
                      onChange={(e) => {
                        const copy = [...defects];
                        copy[idx].description = e.target.value;
                        setDefects(copy);
                      }}
                      placeholder="Specific failure description..."
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
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Further Rectification Required</label>
                    <input
                      type="text"
                      value={def.further_action_required}
                      disabled={isReadOnly}
                      onChange={(e) => {
                        const copy = [...defects];
                        copy[idx].further_action_required = e.target.value;
                        setDefects(copy);
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 07 SIGNATURE ── */}
      <section className="space-y-4">
        <SignatureCapture
          type="ENGINEER"
          title="07 Competent Tester Sign-Off *"
          defaultName={
            instance.assigned_engineer
              ? `${instance.assigned_engineer.first_name} ${instance.assigned_engineer.last_name}`
              : ''
          }
          defaultPosition="Fire Safety Technician"
          existingSignature={signatures.ENGINEER}
          declarationText="I confirm that the weekly test of the fire detection and alarm system was carried out in accordance with BS 5839-1:2017 recommendations."
          onSaveSignature={onSign}
          disabled={isReadOnly}
        />
      </section>
    </div>
  );
}
