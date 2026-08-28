'use client';

import React, { useState, useEffect } from 'react';
import {
  Zap,
  Plus,
  Copy,
  Trash2,
  CheckCircle2,
  Layers,
  MapPin,
  Sliders,
  Sparkles,
  ArrowDown,
} from 'lucide-react';
import SignatureCapture from '../SignatureCapture';
import type {
  FullReportPack,
  LuminaireAssetRowData,
  ReportDefectRowData,
  SignatureType,
  LuminaireType,
  LuminaireCondition,
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

export default function EmergencyLightingScheduleForm({
  pack,
  onAutosave,
  onSign,
  isReadOnly,
}: Props) {
  const { instance, responses, repeatableRows, signatures } = pack;

  // 01 Survey Header
  const [buildingArea, setBuildingArea] = useState<string>(
    responses['01_survey_header']?.building_area || 'Full Estate Demise'
  );

  // 03 Overall Assessment
  const [assessmentSummary, setAssessmentSummary] = useState<string>(
    responses['03_overall_assessment']?.summary ||
      'Emergency lighting register verified. All accessible fittings surveyed and logged into CAFM asset repository. Test switch keys operational.'
  );

  // 02 Assets Schedule
  const initialAssets = (repeatableRows['02_assets_schedule'] || []).map(
    r => r.data_json as LuminaireAssetRowData
  );

  const [assets, setAssets] = useState<LuminaireAssetRowData[]>(
    initialAssets.length > 0
      ? initialAssets
      : [
          {
            asset_reference: 'EL-001',
            floor_level: 'Ground Floor',
            zone_area: 'Zone 1 - Reception',
            exact_location: 'Above main revolving entrance door',
            fitting_type: '3W LED Exit Box',
            maintained_type: 'MAINTAINED',
            test_facility: 'Key Switch KS-01',
            duration_hours: 3,
            condition: 'GOOD',
            is_operational: true,
          },
        ]
  );

  // Sticky default memory for rapid entry
  const [currentFloor, setCurrentFloor] = useState<string>('Ground Floor');
  const [currentZone, setCurrentZone] = useState<string>('Zone 1');

  // Trigger autosave on changes
  useEffect(() => {
    if (isReadOnly) return;
    const timeout = setTimeout(() => {
      onAutosave({
        responses: [
          { section_key: '01_survey_header', field_key: 'building_area', value: buildingArea },
          { section_key: '03_overall_assessment', field_key: 'summary', value: assessmentSummary },
        ],
        repeatableRows: {
          '02_assets_schedule': assets.map((a, i) => ({
            row_type: 'ASSET_ROW',
            sequence_order: i + 1,
            data_json: a,
          })),
        },
      });
    }, 600);

    return () => clearTimeout(timeout);
  }, [buildingArea, assessmentSummary, assets, isReadOnly]);

  const generateNextRef = (currentList: LuminaireAssetRowData[]): string => {
    if (currentList.length === 0) return 'EL-001';
    const last = currentList[currentList.length - 1];
    const match = last.asset_reference.match(/([a-zA-Z-]+)(\d+)/);
    if (match) {
      const prefix = match[1];
      const num = parseInt(match[2], 10) + 1;
      return `${prefix}${String(num).padStart(match[2].length, '0')}`;
    }
    return `EL-${String(currentList.length + 1).padStart(3, '0')}`;
  };

  const handleAddNextAsset = () => {
    const nextRef = generateNextRef(assets);
    const last = assets[assets.length - 1];
    setAssets([
      ...assets,
      {
        asset_reference: nextRef,
        floor_level: last ? last.floor_level : currentFloor,
        zone_area: last ? last.zone_area : currentZone,
        exact_location: '',
        fitting_type: last ? last.fitting_type : 'LED Bulkhead 3W',
        maintained_type: last ? last.maintained_type : 'MAINTAINED',
        test_facility: last ? last.test_facility : 'Key Switch KS-01',
        duration_hours: 3,
        condition: 'GOOD',
        is_operational: true,
      },
    ]);
  };

  const handleDuplicatePrevious = () => {
    if (assets.length === 0) return handleAddNextAsset();
    const last = assets[assets.length - 1];
    const nextRef = generateNextRef(assets);
    setAssets([
      ...assets,
      {
        ...last,
        asset_reference: nextRef,
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* ── LIVE SURVEY PROGRESS HERO ── */}
      <section className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-800/40 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-400" />
            <span className="text-xs uppercase font-mono tracking-widest text-indigo-300">
              EMERGENCY LIGHTING ASSET SURVEY
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">
            {assets.length} <span className="text-base font-normal text-slate-300">Assets Recorded</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Synchronises directly into canonical CAFM Asset Register on completion.
          </p>
        </div>

        {!isReadOnly && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDuplicatePrevious}
              className="px-3.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" /> Duplicate Previous
            </button>
            <button
              type="button"
              onClick={handleAddNextAsset}
              className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-950 transition-colors"
            >
              <Plus className="w-4 h-4" /> + Add Next Asset
            </button>
          </div>
        )}
      </section>

      {/* ── 01 SURVEY HEADER ── */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <span className="w-6 h-6 rounded bg-indigo-950 text-indigo-400 font-mono text-xs font-bold flex items-center justify-center">
            01
          </span>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Survey Demise &amp; Building Scope
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Building Area / Demise</label>
            <input
              type="text"
              value={buildingArea}
              disabled={isReadOnly}
              onChange={(e) => setBuildingArea(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-60"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Compliance Standard</label>
            <input
              type="text"
              disabled
              value="BS 5266-1:2016 / BS EN 1838 (3-Hour Duration Standard)"
              className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-400 font-mono"
            />
          </div>
        </div>
      </section>

      {/* ── 02 ASSETS SCHEDULE CARD LIST ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-indigo-950 text-indigo-400 font-mono text-xs font-bold flex items-center justify-center">
              02
            </span>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Emergency Luminaire Schedule
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {assets.length} items logged
          </span>
        </div>

        <div className="space-y-3">
          {assets.map((asset, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3 hover:border-slate-700 transition-colors"
            >
              {/* Row Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-500">#{idx + 1}</span>
                  <input
                    type="text"
                    value={asset.asset_reference}
                    disabled={isReadOnly}
                    onChange={(e) => {
                      const copy = [...assets];
                      copy[idx].asset_reference = e.target.value;
                      setAssets(copy);
                    }}
                    placeholder="Ref (e.g. EL-001)"
                    className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-sm font-mono font-bold text-sky-400 focus:outline-none focus:border-indigo-500"
                  />
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    asset.is_operational
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {asset.is_operational ? 'OPERATIONAL' : 'DEFECTIVE'}
                  </span>
                </div>

                {!isReadOnly && assets.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setAssets(assets.filter((_, i) => i !== idx))}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Location & Fitting */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Floor / Level</label>
                  <input
                    type="text"
                    value={asset.floor_level}
                    disabled={isReadOnly}
                    onChange={(e) => {
                      const copy = [...assets];
                      copy[idx].floor_level = e.target.value;
                      setCurrentFloor(e.target.value);
                      setAssets(copy);
                    }}
                    placeholder="e.g. Ground Floor"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Zone / Area</label>
                  <input
                    type="text"
                    value={asset.zone_area}
                    disabled={isReadOnly}
                    onChange={(e) => {
                      const copy = [...assets];
                      copy[idx].zone_area = e.target.value;
                      setCurrentZone(e.target.value);
                      setAssets(copy);
                    }}
                    placeholder="e.g. Zone 1 - Reception"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Exact Position</label>
                  <input
                    type="text"
                    value={asset.exact_location}
                    disabled={isReadOnly}
                    onChange={(e) => {
                      const copy = [...assets];
                      copy[idx].exact_location = e.target.value;
                      setAssets(copy);
                    }}
                    placeholder="e.g. Above fire exit G.02"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  />
                </div>
              </div>

              {/* Technical Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Fitting Type</label>
                  <input
                    type="text"
                    value={asset.fitting_type}
                    disabled={isReadOnly}
                    onChange={(e) => {
                      const copy = [...assets];
                      copy[idx].fitting_type = e.target.value;
                      setAssets(copy);
                    }}
                    placeholder="e.g. LED Bulkhead 3W"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Mode</label>
                  <select
                    value={asset.maintained_type}
                    disabled={isReadOnly}
                    onChange={(e) => {
                      const copy = [...assets];
                      copy[idx].maintained_type = e.target.value as LuminaireType;
                      setAssets(copy);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  >
                    <option value="MAINTAINED">MAINTAINED</option>
                    <option value="NON_MAINTAINED">NON-MAINTAINED</option>
                    <option value="COMBINED">COMBINED</option>
                    <option value="EXIT_SIGN">EXIT SIGN</option>
                    <option value="CENTRAL_BATTERY">CENTRAL BATTERY</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Condition</label>
                  <select
                    value={asset.condition}
                    disabled={isReadOnly}
                    onChange={(e) => {
                      const copy = [...assets];
                      copy[idx].condition = e.target.value as LuminaireCondition;
                      setAssets(copy);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  >
                    <option value="EXCELLENT">EXCELLENT</option>
                    <option value="GOOD">GOOD</option>
                    <option value="FAIR">FAIR</option>
                    <option value="POOR">POOR</option>
                    <option value="DEFECTIVE">DEFECTIVE</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Test Switch</label>
                  <input
                    type="text"
                    value={asset.test_facility}
                    disabled={isReadOnly}
                    onChange={(e) => {
                      const copy = [...assets];
                      copy[idx].test_facility = e.target.value;
                      setAssets(copy);
                    }}
                    placeholder="e.g. KS-01"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-mono"
                  />
                </div>
              </div>

              {/* Operational State Toggle */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  disabled={isReadOnly}
                  onClick={() => {
                    const copy = [...assets];
                    copy[idx].is_operational = !copy[idx].is_operational;
                    setAssets(copy);
                  }}
                  className={`text-xs font-bold px-3 py-1.5 rounded border transition-colors ${
                    asset.is_operational
                      ? 'bg-emerald-950 text-emerald-200 border-emerald-800'
                      : 'bg-rose-950 text-rose-200 border-rose-800'
                  }`}
                >
                  {asset.is_operational ? '✓ Passes Lux / Duration Check' : '✕ Defective / Fails Duration'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 03 OVERALL ASSESSMENT ── */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <span className="w-6 h-6 rounded bg-indigo-950 text-indigo-400 font-mono text-xs font-bold flex items-center justify-center">
            03
          </span>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Surveyor Assessment &amp; Limitations
          </h3>
        </div>

        <div>
          <textarea
            rows={3}
            value={assessmentSummary}
            disabled={isReadOnly}
            onChange={(e) => setAssessmentSummary(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-60"
          />
        </div>
      </section>

      {/* ── 06 SIGNATURE ── */}
      <section className="space-y-4">
        <SignatureCapture
          type="ENGINEER"
          title="06 Surveyor Declaration & Sign-Off *"
          defaultName={
            instance.assigned_engineer
              ? `${instance.assigned_engineer.first_name} ${instance.assigned_engineer.last_name}`
              : ''
          }
          defaultPosition="Authorised Life Safety Surveyor"
          existingSignature={signatures.ENGINEER}
          declarationText="I confirm that this asset schedule accurately represents the emergency lighting installation surveyed in accordance with BS 5266-1."
          onSaveSignature={onSign}
          disabled={isReadOnly}
        />
      </section>
    </div>
  );
}
